const express = require('express');
const Application = require('../models/Application');

const router = express.Router();

// GET /api/applications?status=applied
router.get('/', async (req, res) => {
  try {
    const filter = req.query.status ? { status: req.query.status } : {};
    const applications = await Application.find(filter).sort({ updatedAt: -1 });
    res.json(applications);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/applications  — save a job from search results (upsert, so re-saving never duplicates)
router.post('/', async (req, res) => {
  try {
    const { externalId, status = 'saved', ...rest } = req.body;

    if (!externalId) {
      return res.status(400).json({ error: 'externalId is required' });
    }

    const update = {
      ...rest,
      externalId,
      status,
      ...(status === 'applied' ? { appliedAt: new Date() } : {}),
    };

    const application = await Application.findOneAndUpdate(
      { externalId },
      { $set: update },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    res.status(201).json(application);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PATCH /api/applications/:id  — move status forward (saved -> applied -> interviewing -> offer/rejected), add notes
router.patch('/:id', async (req, res) => {
  try {
    const updates = { ...req.body };
    if (updates.status === 'applied') {
      updates.appliedAt = new Date();
    }

    const application = await Application.findByIdAndUpdate(req.params.id, updates, {
      new: true,
    });

    if (!application) {
      return res.status(404).json({ error: 'Application not found' });
    }

    res.json(application);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE /api/applications/:id
router.delete('/:id', async (req, res) => {
  try {
    const application = await Application.findByIdAndDelete(req.params.id);
    if (!application) {
      return res.status(404).json({ error: 'Application not found' });
    }
    res.json({ deleted: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
