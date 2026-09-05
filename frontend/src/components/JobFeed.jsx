import JobRow from './JobRow.jsx';

export default function JobFeed({ jobs, count, where, loading, error, trackedIds, onTrack, lastUpdated }) {
  if (error) {
    return (
      <div className="state-block state-block--error">
        <h3>The scan didn't go through</h3>
        <p>{error}</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="state-block">
        <h3>Scanning listings…</h3>
        <p>Pulling current vacancies for this search.</p>
      </div>
    );
  }

  if (!jobs.length) {
    return (
      <div className="state-block">
        <h3>No vacancies matched yet</h3>
        <p>Try a broader role, drop the location, or widen "posted within".</p>
      </div>
    );
  }

  return (
    <div>
      <div className="stats-row">
        <div className="stat">
          <span className="stat__value">{count}</span>
          <span className="stat__label">vacancies found</span>
        </div>
        <div className="stat">
          <span className="stat__value">{where || 'India'}</span>
          <span className="stat__label">search area</span>
        </div>
        <div className="stat stat--live">
          <span className="stat__dot" aria-hidden="true" />
          <span className="stat__label">updated {lastUpdated}</span>
        </div>
      </div>

      <ul className="job-list">
        {jobs.map((job) => (
          <JobRow
            key={job.externalId}
            job={job}
            tracked={trackedIds.has(job.externalId)}
            onTrack={onTrack}
          />
        ))}
      </ul>
    </div>
  );
}
