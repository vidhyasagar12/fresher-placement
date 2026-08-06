import { useState } from 'react';
import './JobCard.css';

const typeColors = {
  Remote: { bg: '#d1fae5', color: '#065f46' },
  Hybrid: { bg: '#dbeafe', color: '#1e40af' },
  Onsite: { bg: '#fce7f3', color: '#9d174d' },
};

export default function JobCard({ job }) {
  const [expanded, setExpanded] = useState(false);
  const typeStyle = typeColors[job.type] || typeColors.Onsite;

  return (
    <div className="job-card card">
      <div className="job-card-header">
        <div className="company-logo" style={{ background: job.logoColor + '20', color: job.logoColor }}>
          {job.logo}
        </div>
        <div className="job-meta">
          <h3 className="job-role">{job.role}</h3>
          <p className="job-company">{job.company}</p>
        </div>
        <span className="job-type-badge" style={{ background: typeStyle.bg, color: typeStyle.color }}>
          {job.type}
        </span>
      </div>

      <div className="job-info-row">
        <span className="job-info-item">📍 {job.location}</span>
        <span className="job-info-item">🎓 {job.experience}</span>
        <span className="job-info-item">💰 {job.salary}</span>
      </div>

      <p className="job-description">{job.description}</p>

      <div className="job-tags">
        {job.tags.map(tag => (
          <span key={tag} className="tag">{tag}</span>
        ))}
      </div>

      {/* Requirements Toggle */}
      <button className="req-toggle" onClick={() => setExpanded(p => !p)}>
        {expanded ? '▲ Hide Requirements' : '▼ View Requirements'}
      </button>

      {expanded && (
        <div className="job-requirements">
          <h4>Requirements</h4>
          <ul>
            {job.requirements.map((req, i) => (
              <li key={i}>
                <span className="req-bullet">✓</span>
                {req}
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="job-card-footer">
        <span className="job-posted">🕐 {job.posted}</span>
        <a href={job.applyLink} target="_blank" rel="noopener noreferrer" className="btn btn-primary apply-btn">
          Apply Now →
        </a>
      </div>
    </div>
  );
}
