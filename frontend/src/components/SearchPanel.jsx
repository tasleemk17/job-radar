import { useState } from 'react';

const FRESHNESS_OPTIONS = [
  { label: 'Any time', value: 30 },
  { label: 'Past 24 hours', value: 1 },
  { label: 'Past 3 days', value: 3 },
  { label: 'Past week', value: 7 },
];

export default function SearchPanel({ initialWhat, initialWhere, onSearch, loading }) {
  const [what, setWhat] = useState(initialWhat);
  const [where, setWhere] = useState(initialWhere);
  const [freshness, setFreshness] = useState(30);

  function handleSubmit(e) {
    e.preventDefault();
    onSearch({ what, where, maxDaysOld: freshness });
  }

  return (
    <aside className="rail">
      <div className="rail__brand">
        <span className="rail__dot" aria-hidden="true" />
        <span>Job Radar</span>
      </div>
      <p className="rail__tagline">Live vacancies, scanned on demand.</p>

      <form className="rail__form" onSubmit={handleSubmit}>
        <label className="field">
          <span className="field__label">Role</span>
          <input
            type="text"
            value={what}
            onChange={(e) => setWhat(e.target.value)}
            placeholder="react developer"
          />
        </label>

        <label className="field">
          <span className="field__label">Location</span>
          <input
            type="text"
            value={where}
            onChange={(e) => setWhere(e.target.value)}
            placeholder="Pune"
          />
        </label>

        <label className="field">
          <span className="field__label">Posted within</span>
          <select value={freshness} onChange={(e) => setFreshness(Number(e.target.value))}>
            {FRESHNESS_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </label>

        <button type="submit" className="rail__submit" disabled={loading}>
          {loading ? 'Scanning…' : 'Scan for vacancies'}
        </button>
      </form>

      <div className="rail__footer">
        Data from Adzuna's India job index. Every apply link opens the employer's real listing.
      </div>
    </aside>
  );
}
