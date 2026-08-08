import { useState } from 'react';
import { smartSeedAll } from '../../../utils/autoSeed';
import { cleanDuplicateJobs } from '../../../utils/cleanDuplicates';

export default function AdminSeed({ onSeedDone }) {
  const [log, setLog] = useState([]);
  const [seeding, setSeeding] = useState(false);
  const [cleaning, setCleaning] = useState(false);
  const [done, setDone] = useState(false);

  const addLog = (msg, type = 'info') => {
    setLog(l => [...l, { msg, type }]);
  };

  const handleSeed = async () => {
    setSeeding(true);
    setLog([]);

    const success = await smartSeedAll(addLog);

    setSeeding(false);
    if (success) {
      setDone(true);
    }
  };

  const handleClean = async () => {
    setCleaning(true);
    setLog([]);
    addLog('🧹 Starting deep duplicate cleanup scan...', 'info');

    const result = await cleanDuplicateJobs((msg, type) => {
      addLog(msg, type);
    });

    setCleaning(false);
  };

  const logColors = { error: '#fca5a5', success: '#6ee7b7', info: 'rgba(255,255,255,0.6)' };

  return (
    <div className="admin-section">
      <div className="admin-section-header">
        <h2>🌱 Smart Data Seeder &amp; Database Cleaner</h2>
      </div>

      <div style={{ background: '#12121e', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 16, padding: 28, maxWidth: 640 }}>
        <p style={{ color: 'rgba(255,255,255,0.6)', lineHeight: 1.7, marginTop: 0 }}>
          Uploads initial data (<code style={{ color: '#a78bfa' }}>jobs.js</code>, <code style={{ color: '#a78bfa' }}>blogs.js</code>, <code style={{ color: '#a78bfa' }}>interviewPrep.js</code>) or purges matching duplicate entries from your database.
        </p>

        <div style={{ background: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.3)', borderRadius: 10, padding: '12px 16px', marginBottom: 20 }}>
          <p style={{ margin: 0, color: '#6ee7b7', fontSize: 14 }}>
            🛡️ <strong>Exact Parameter Protection Active:</strong> Compares company, role, location, salary, experience &amp; description.
          </p>
        </div>

        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          {!done && (
            <button
              className="admin-btn-primary"
              onClick={handleSeed}
              disabled={seeding || cleaning}
              style={{ fontSize: 14, padding: '12px 20px' }}
            >
              {seeding ? '⏳ Seeding Data...' : '🌱 Seed All Initial Data'}
            </button>
          )}

          <button
            type="button"
            className="admin-btn-edit"
            onClick={handleClean}
            disabled={seeding || cleaning}
            style={{ fontSize: 14, padding: '12px 20px' }}
          >
            {cleaning ? '⏳ Cleaning...' : '🧹 Purge Existing Duplicates'}
          </button>
        </div>

        {log.length > 0 && (
          <div style={{ marginTop: 20, background: '#0d0d14', borderRadius: 10, padding: '16px', fontFamily: 'monospace', fontSize: 13, maxHeight: 300, overflowY: 'auto' }}>
            {log.map((entry, i) => (
              <p key={i} style={{ margin: '4px 0', color: logColors[entry.type] || '#fff' }}>{entry.msg}</p>
            ))}
          </div>
        )}

        {done && (
          <button className="admin-btn-primary" style={{ marginTop: 20 }} onClick={onSeedDone}>
            ✅ Go to Dashboard
          </button>
        )}
      </div>
    </div>
  );
}
