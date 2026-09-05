const express = require('express');
const axios = require('axios');

const router = express.Router();

const ADZUNA_BASE = 'https://api.adzuna.com/v1/api/jobs/in/search';

function mapListing(raw) {
  return {
    externalId: String(raw.id),
    title: raw.title,
    company: raw.company?.display_name || 'Not listed',
    location: raw.location?.display_name || 'Not listed',
    description: raw.description || '',
    salaryMin: raw.salary_min || null,
    salaryMax: raw.salary_max || null,
    applyUrl: raw.redirect_url,
    postedAt: raw.created || null,
    category: raw.category?.label || null,
    contractType: raw.contract_time || raw.contract_type || null,
  };
}

// GET /api/jobs/search?what=react+developer&where=Pune&page=1&maxDaysOld=7
router.get('/search', async (req, res) => {
  const { ADZUNA_APP_ID, ADZUNA_APP_KEY } = process.env;

  if (!ADZUNA_APP_ID || !ADZUNA_APP_KEY) {
    return res.status(500).json({
      error:
        'Adzuna API credentials are missing. Add ADZUNA_APP_ID and ADZUNA_APP_KEY to backend/.env — see .env.example for how to get a free key.',
    });
  }

  const { what = '', where = 'India', page = 1, maxDaysOld = 30, resultsPerPage = 20 } = req.query;

  try {
    const { data } = await axios.get(`${ADZUNA_BASE}/${page}`, {
      params: {
        app_id: ADZUNA_APP_ID,
        app_key: ADZUNA_APP_KEY,
        what: what || undefined,
        where: where || undefined,
        max_days_old: maxDaysOld,
        results_per_page: resultsPerPage,
        sort_by: 'date',
        'content-type': 'application/json',
      },
      timeout: 10000,
    });

    res.json({
      count: data.count,
      page: Number(page),
      results: (data.results || []).map(mapListing),
    });
  } catch (err) {
    const status = err.response?.status || 500;
    const message =
      err.response?.data?.exception ||
      err.response?.data?.display ||
      err.message ||
      'Job search failed';
    res.status(status).json({ error: message });
  }
});

module.exports = router;
