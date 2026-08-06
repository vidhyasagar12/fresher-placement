import { useState } from 'react';
import { smartSeedAll } from '../../../utils/autoSeed';

export default function AdminSeed({ onSeedDone }) {
  const [log, setLog] = useState([]);
  const [seeding, setSeeding] = useState(false);
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

  const logColors = { error: '#fca5a5', success: '#6ee7b7', info: 'rgba(255,255,255,0.6)' };

  return (
    <div className="admin-section">
      <div className="admin-section-header">
        <h2>🌱 Smart Data Seeder</h2>
      </div>

      <div style={{ background: '#12121e', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 16, padding: 28, maxWidth: 640 }}>
        <p style={{ color: 'rgba(255,255,255,0.6)', lineHeight: 1.7, marginTop: 0 }}>
          Uploads all initial data (<code style={{ color: '#a78bfa' }}>jobs.js</code>, <code style={{ color: '#a78bfa' }}>blogs.js</code>, <code style={{ color: '#a78bfa' }}>interviewPrep.js</code>) into your Supabase PostgreSQL database.
        </p>

        <div style={{ background: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.3)', borderRadius: 10, padding: '12px 16px', marginBottom: 20 }}>
          <p style={{ margin: 0, color: '#6ee7b7', fontSize: 14 }}>
            🛡️ <strong>Zero Duplicate Protection Active:</strong> Automatically checks for existing records before inserting. Safe to run anytime!
          </p>
        </div>

        {!done && (
          <button
            className="admin-btn-primary"
            onClick={handleSeed}
            disabled={seeding}
            style={{ fontSize: 15, padding: '12px 28px' }}
          >
            {seeding ? '⏳ Seeding Data...' : '🌱 Seed All Initial Data to Supabase'}
          </button>
        )}

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
