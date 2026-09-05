const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema(
  {
    // Adzuna's own job id, so we never save the same listing twice
    externalId: { type: String, required: true, unique: true },
    title: { type: String, required: true },
    company: { type: String, default: 'Not listed' },
    location: { type: String, default: 'Not listed' },
    description: { type: String, default: '' },
    salaryMin: { type: Number, default: null },
    salaryMax: { type: Number, default: null },
    applyUrl: { type: String, required: true },
    postedAt: { type: Date, default: null },

    // Where the person is in their own process
    status: {
      type: String,
      enum: ['saved', 'applied', 'interviewing', 'rejected', 'offer'],
      default: 'saved',
    },
    notes: { type: String, default: '' },
    appliedAt: { type: Date, default: null },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Application', applicationSchema);
