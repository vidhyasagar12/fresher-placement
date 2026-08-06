import { useState, useMemo } from 'react';
import { useJobs } from '../hooks/useJobs';
import JobCard from '../components/JobCard';
import './Jobs.css';

const allTypes = ['All', 'Remote', 'Hybrid', 'Onsite'];
const allTags = ['All', 'Java', 'Python', 'React', 'SQL', 'AWS', 'Node.js', 'JavaScript', 'C++'];

export default function Jobs() {
  const { jobs, loading, error } = useJobs();
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('All');
  const [tagFilter, setTagFilter] = useState('All');

  const filtered = useMemo(() => {
    return jobs.filter(job => {
      const q = search.toLowerCase();
      const matchSearch = !q ||
        job.role?.toLowerCase().includes(q) ||
        job.company?.toLowerCase().includes(q) ||
        job.location?.toLowerCase().includes(q) ||
        (job.tags || []).some(t => t.toLowerCase().includes(q));
      const matchType = typeFilter === 'All' || job.type === typeFilter;
      const matchTag = tagFilter === 'All' || (job.tags || []).some(t => t.toLowerCase().includes(tagFilter.toLowerCase()));
      return matchSearch && matchType && matchTag;
    });
  }, [jobs, search, typeFilter, tagFilter]);

  return (
    <div className="page-wrapper">
      {/* Header */}
      <div className="jobs-hero">
        <div className="container">
          <p className="badge">Updated Daily</p>
          <h1 className="section-title" style={{ marginTop: 8 }}>
            Browse <span className="grad-text">Job Openings</span>
          </h1>
          <p className="section-subtitle">Curated fresher-friendly opportunities from top companies across India</p>

          {/* Search */}
          <div className="jobs-search-bar">
            <span className="search-icon">🔍</span>
            <input
              type="text"
              placeholder="Search by role, company, location or tech..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="search-input"
            />
            {search && (
              <button className="search-clear" onClick={() => setSearch('')}>✕</button>
            )}
          </div>

          {/* Filters */}
          <div className="filter-row">
            <div className="filter-group">
              <span className="filter-label">Work Mode:</span>
              {allTypes.map(t => (
                <button
                  key={t}
                  className={`filter-chip${typeFilter === t ? ' active' : ''}`}
                  onClick={() => setTypeFilter(t)}
                >
                  {t}
                </button>
              ))}
            </div>
            <div className="filter-group">
              <span className="filter-label">Tech Stack:</span>
              {allTags.map(t => (
                <button
                  key={t}
                  className={`filter-chip${tagFilter === t ? ' active' : ''}`}
                  onClick={() => setTagFilter(t)}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="container section">
        {loading ? (
          <div className="no-results">
            <span style={{ fontSize: 40, animation: 'spin 1s linear infinite', display: 'inline-block' }}>⏳</span>
            <h3>Loading jobs...</h3>
            <p>Fetching the latest openings for you.</p>
          </div>
        ) : error ? (
          <div className="no-results">
            <span>⚠️</span>
            <h3>Could not load jobs</h3>
            <p>{error}</p>
          </div>
        ) : (
          <>
            <div className="jobs-results-header">
              <p className="results-count">
                Showing <strong>{filtered.length}</strong> of {jobs.length} jobs
              </p>
              {(search || typeFilter !== 'All' || tagFilter !== 'All') && (
                <button
                  className="btn btn-outline"
                  style={{ fontSize: 13, padding: '6px 14px' }}
                  onClick={() => { setSearch(''); setTypeFilter('All'); setTagFilter('All'); }}
                >
                  Clear All Filters
                </button>
              )}
            </div>

            {filtered.length === 0 ? (
              <div className="no-results">
                <span>🔍</span>
                <h3>No jobs found</h3>
                <p>Try different keywords or clear your filters.</p>
              </div>
            ) : (
              <div className="jobs-grid">
                {filtered.map(job => <JobCard key={job.id} job={job} />)}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
