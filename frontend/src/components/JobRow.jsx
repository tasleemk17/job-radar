import { relativeTime, formatSalary, stripHtml } from '../utils.js';

export default function JobRow({ job, tracked, onTrack }) {
  const salary = formatSalary(job.salaryMin, job.salaryMax);
  const isFresh = job.postedAt && Date.now() - new Date(job.postedAt).getTime() < 1000 * 60 * 60 * 72;

  return (
    <li className="job-row">
      <span
        className={`job-row__dot ${isFresh ? 'job-row__dot--fresh' : ''}`}
        aria-hidden="true"
      />
      <div className="job-row__main">
        <div className="job-row__heading">
          <h3>{job.title}</h3>
          <span className="job-row__time">{relativeTime(job.postedAt)}</span>
        </div>
        <div className="job-row__meta">
          <span>{job.company}</span>
          <span className="job-row__sep">/</span>
          <span>{job.location}</span>
          {salary && (
            <>
              <span className="job-row__sep">/</span>
              <span className="job-row__salary">{salary}</span>
            </>
          )}
        </div>
        {job.description && <p className="job-row__desc">{stripHtml(job.description).slice(0, 180)}…</p>}
      </div>
      <div className="job-row__actions">
        <a href={job.applyUrl} target="_blank" rel="noreferrer" className="btn btn--primary">
          Apply
        </a>
        <button
          type="button"
          className="btn btn--ghost"
          disabled={tracked}
          onClick={() => onTrack(job)}
        >
          {tracked ? 'Tracked' : 'Track'}
        </button>
      </div>
    </li>
  );
}
