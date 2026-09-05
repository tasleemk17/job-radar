import { relativeTime, formatSalary } from '../utils.js';

const STATUSES = ['saved', 'applied', 'interviewing', 'offer', 'rejected'];

const STATUS_LABEL = {
  saved: 'Saved',
  applied: 'Applied',
  interviewing: 'Interviewing',
  offer: 'Offer',
  rejected: 'Rejected',
};

export default function ApplicationsView({ applications, loading, onUpdateStatus, onRemove }) {
  if (loading) {
    return (
      <div className="state-block">
        <h3>Loading your tracker…</h3>
      </div>
    );
  }

  if (!applications.length) {
    return (
      <div className="state-block">
        <h3>Nothing tracked yet</h3>
        <p>Go to the Feed tab and hit "Track" on a listing to start building your pipeline here.</p>
      </div>
    );
  }

  const counts = STATUSES.reduce((acc, s) => {
    acc[s] = applications.filter((a) => a.status === s).length;
    return acc;
  }, {});

  return (
    <div>
      <div className="stats-row">
        {STATUSES.map((s) => (
          <div className="stat" key={s}>
            <span className="stat__value">{counts[s]}</span>
            <span className="stat__label">{STATUS_LABEL[s]}</span>
          </div>
        ))}
      </div>

      <ul className="job-list">
        {applications.map((app) => (
          <li className={`job-row job-row--${app.status}`} key={app._id}>
            <span className={`job-row__dot job-row__dot--${app.status}`} aria-hidden="true" />
            <div className="job-row__main">
              <div className="job-row__heading">
                <h3>{app.title}</h3>
                <span className="job-row__time">
                  {app.appliedAt ? `Applied ${relativeTime(app.appliedAt)}` : `Saved ${relativeTime(app.createdAt)}`}
                </span>
              </div>
              <div className="job-row__meta">
                <span>{app.company}</span>
                <span className="job-row__sep">/</span>
                <span>{app.location}</span>
                {formatSalary(app.salaryMin, app.salaryMax) && (
                  <>
                    <span className="job-row__sep">/</span>
                    <span className="job-row__salary">{formatSalary(app.salaryMin, app.salaryMax)}</span>
                  </>
                )}
              </div>
            </div>
            <div className="job-row__actions job-row__actions--tracker">
              <select
                value={app.status}
                onChange={(e) => onUpdateStatus(app._id, e.target.value)}
                className="status-select"
              >
                {STATUSES.map((s) => (
                  <option key={s} value={s}>
                    {STATUS_LABEL[s]}
                  </option>
                ))}
              </select>
              <a href={app.applyUrl} target="_blank" rel="noreferrer" className="btn btn--ghost">
                Open
              </a>
              <button type="button" className="btn btn--ghost" onClick={() => onRemove(app._id)}>
                Remove
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
