import { useState } from 'react';
import { useInterviewPrep } from '../hooks/useInterviewPrep';
import './InterviewPrep.css';

const diffBadge = { Easy: '#10b981', Medium: '#f59e0b', Hard: '#ef4444' };

export default function InterviewPrep() {
  const { categories, loading, error } = useInterviewPrep();
  const [activeTab, setActiveTab] = useState(null);

  // Set default tab once data loads
  const activeId = activeTab || (categories[0]?.id ?? null);
  const active = categories.find(c => c.id === activeId);

  return (
    <div className="page-wrapper">
      {/* Header */}
      <div className="prep-hero">
        <div className="container">
          <p className="badge">Master Every Round</p>
          <h1 className="section-title" style={{ marginTop: 8 }}>
            Interview <span className="grad-text">Preparation Hub</span>
          </h1>
          <p className="section-subtitle">
            Everything you need to crack DSA, HR, aptitude, system design, and more.
          </p>
        </div>
      </div>

      {loading ? (
        <div className="container section" style={{ textAlign: 'center' }}>
          <span style={{ fontSize: 40 }}>⏳</span>
          <h3>Loading topics...</h3>
        </div>
      ) : error ? (
        <div className="container section" style={{ textAlign: 'center' }}>
          <span style={{ fontSize: 40 }}>⚠️</span>
          <h3>Could not load interview prep data</h3>
          <p>{error}</p>
        </div>
      ) : (
        <>
          {/* Tabs */}
          <div className="prep-tabs-wrapper">
            <div className="container">
              <div className="prep-tabs">
                {categories.map(cat => (
                  <button
                    key={cat.id}
                    className={`prep-tab${activeId === cat.id ? ' active' : ''}`}
                    style={activeId === cat.id ? { borderBottomColor: cat.color, color: cat.color } : {}}
                    onClick={() => setActiveTab(cat.id)}
                  >
                    <span>{cat.icon}</span>
                    <span>{cat.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Topics Grid */}
          {active && (
            <div className="container section">
              <div className="prep-section-header">
                <div>
                  <h2 style={{ fontSize: 24, fontWeight: 800, display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span>{active.icon}</span>
                    <span style={{ color: active.color }}>{active.label}</span>
                  </h2>
                  <p style={{ color: 'var(--text-muted)', fontSize: 14, marginTop: 4 }}>
                    {active.topics.length} topics to master
                  </p>
                </div>
              </div>

              <div className="topics-grid" style={{ marginTop: 32 }}>
                {active.topics.map((topic, i) => (
                  <div key={i} className="topic-card card">
                    <div className="topic-card-header">
                      <h3 className="topic-title">{topic.title}</h3>
                      <span
                        className="diff-badge"
                        style={{ background: diffBadge[topic.difficulty] + '22', color: diffBadge[topic.difficulty] }}
                      >
                        {topic.difficulty}
                      </span>
                    </div>
                    <p className="topic-desc">{topic.description}</p>
                    <div className="topic-footer">
                      <span className="topic-time">⏱ {topic.time}</span>
                      <button
                        className="btn btn-outline"
                        style={{ fontSize: 12, padding: '6px 14px', borderColor: active.color, color: active.color }}
                      >
                        Start →
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}

      {/* Tips Banner */}
      <div className="container" style={{ paddingBottom: 80 }}>
        <div className="tips-banner">
          <div className="tips-banner-content">
            <span style={{ fontSize: 40 }}>🤖</span>
            <div>
              <h3>Want AI-powered interview coaching?</h3>
              <p>Ask our AI assistant any interview question and get instant expert tips.</p>
            </div>
            <a href="/ai-tips" className="btn btn-primary">Try AI Tips ✨</a>
          </div>
        </div>
      </div>
    </div>
  );
}
