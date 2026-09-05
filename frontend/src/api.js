import axios from 'axios';

const client = axios.create({ baseURL: '/api' });

export async function searchJobs({ what, where, page = 1, maxDaysOld = 30 }) {
  const { data } = await client.get('/jobs/search', {
    params: { what, where, page, maxDaysOld },
  });
  return data;
}

export async function listTracked(status) {
  const { data } = await client.get('/applications', {
    params: status ? { status } : {},
  });
  return data;
}

export async function trackJob(job, status = 'saved') {
  const { data } = await client.post('/applications', { ...job, status });
  return data;
}

export async function updateTracked(id, updates) {
  const { data } = await client.patch(`/applications/${id}`, updates);
  return data;
}

export async function removeTracked(id) {
  const { data } = await client.delete(`/applications/${id}`);
  return data;
}
