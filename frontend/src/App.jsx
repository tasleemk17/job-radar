import { useEffect, useState, useCallback } from 'react';
import './App.css';
import SearchPanel from './components/SearchPanel.jsx';
import JobFeed from './components/JobFeed.jsx';
import ApplicationsView from './components/ApplicationsView.jsx';
import { searchJobs, listTracked, trackJob, updateTracked, removeTracked } from './api.js';

const DEFAULT_WHERE = 'Pune';

export default function App() {
  const [tab, setTab] = useState('feed');

  const [jobs, setJobs] = useState([]);
  const [count, setCount] = useState(0);
  const [where, setWhere] = useState(DEFAULT_WHERE);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState('just now');

  const [applications, setApplications] = useState([]);
  const [appsLoading, setAppsLoading] = useState(false);

  const trackedIds = new Set(applications.map((a) => a.externalId));

  const runSearch = useCallback(async ({ what, where: loc, maxDaysOld }) => {
    setLoading(true);
    setError(null);
    setWhere(loc);
    try {
      const data = await searchJobs({ what, where: loc, maxDaysOld });
      setJobs(data.results);
      setCount(data.count);
      setLastUpdated('just now');
    } catch (err) {
      setError(err.response?.data?.error || 'Could not reach the job search backend.');
    } finally {
      setLoading(false);
    }
  }, []);

  const refreshApplications = useCallback(async () => {
    setAppsLoading(true);
    try {
      const data = await listTracked();
      setApplications(data);
    } catch {
      // Tracker staying empty is a soft failure; the feed is still usable.
    } finally {
      setAppsLoading(false);
    }
  }, []);

  useEffect(() => {
    runSearch({ what: '', where: DEFAULT_WHERE, maxDaysOld: 30 });
    refreshApplications();
  }, [runSearch, refreshApplications]);

  async function handleTrack(job) {
    await trackJob(job, 'saved');
    refreshApplications();
  }

  async function handleUpdateStatus(id, status) {
    await updateTracked(id, { status });
    refreshApplications();
  }

  async function handleRemove(id) {
    await removeTracked(id);
    refreshApplications();
  }

  return (
    <div className="app-shell">
      <SearchPanel
        initialWhat=""
        initialWhere={DEFAULT_WHERE}
        onSearch={runSearch}
        loading={loading}
      />

      <main className="main">
        <nav className="tabs">
          <button
            type="button"
            className={`tabs__item ${tab === 'feed' ? 'tabs__item--active' : ''}`}
            onClick={() => setTab('feed')}
          >
            Feed
          </button>
          <button
            type="button"
            className={`tabs__item ${tab === 'tracker' ? 'tabs__item--active' : ''}`}
            onClick={() => setTab('tracker')}
          >
            Tracker
            {applications.length > 0 && <span className="tabs__count">{applications.length}</span>}
          </button>
        </nav>

        <div className="main__content">
          {tab === 'feed' ? (
            <JobFeed
              jobs={jobs}
              count={count}
              where={where}
              loading={loading}
              error={error}
              trackedIds={trackedIds}
              onTrack={handleTrack}
              lastUpdated={lastUpdated}
            />
          ) : (
            <ApplicationsView
              applications={applications}
              loading={appsLoading}
              onUpdateStatus={handleUpdateStatus}
              onRemove={handleRemove}
            />
          )}
        </div>
      </main>
    </div>
  );
}
