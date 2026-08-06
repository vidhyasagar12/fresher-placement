import { useState } from 'react';
import { supabase } from '../../../supabase';
import { jobs as staticJobs } from '../../../data/jobs';
import { blogs as staticBlogs } from '../../../data/blogs';
import { interviewCategories as staticCats } from '../../../data/interviewPrep';

export default function AdminSeed({ onSeedDone }) {
  const [log, setLog] = useState([]);
  const [seeding, setSeeding] = useState(false);
  const [done, setDone] = useState(false);

  const addLog = (msg, type = 'info') => setLog(l => [...l, { msg, type }]);

  const handleSeed = async () => {
    if (!confirm('This will INSERT all static data into Supabase. Duplicate entries may occur if run more than once. Continue?')) return;
    setSeeding(true);
    setLog([]);

    // ── Seed Jobs ──
    addLog('🌱 Seeding jobs...');
    const jobPayloads = staticJobs.map(j => ({
      company: j.company,
      logo: j.logo,
      logo_color: j.logoColor,
      role: j.role,
      location: j.location,
      type: j.type,
      experience: j.experience,
      salary: j.salary,
      tags: j.tags,
      posted: j.posted,
      apply_link: j.applyLink,
      description: j.description,
      requirements: j.requirements,
    }));
    const { error: jobErr } = await supabase.from('jobs').insert(jobPayloads);
    if (jobErr) addLog(`❌ Jobs error: ${jobErr.message}`, 'error');
    else addLog(`✅ Seeded ${jobPayloads.length} jobs`, 'success');

    // ── Seed Blogs ──
    addLog('🌱 Seeding blogs...');
    const blogPayloads = staticBlogs.map(b => ({
      slug: b.slug,
      title: b.title,
      excerpt: b.excerpt,
      category: b.category,
      date: b.date,
      read_time: b.readTime,
      tags: b.tags,
      content: b.content,
    }));
    const { error: blogErr } = await supabase.from('blogs').insert(blogPayloads);
    if (blogErr) addLog(`❌ Blogs error: ${blogErr.message}`, 'error');
    else addLog(`✅ Seeded ${blogPayloads.length} blogs`, 'success');

    // ── Seed Interview Categories ──
    addLog('🌱 Seeding interview categories...');
    const catPayloads = staticCats.map(c => ({ id: c.id, label: c.label, icon: c.icon, color: c.color }));
    const { error: catErr } = await supabase.from('interview_categories').insert(catPayloads);
    if (catErr) addLog(`❌ Categories error: ${catErr.message}`, 'error');
    else addLog(`✅ Seeded ${catPayloads.length} categories`, 'success');

    // ── Seed Topics ──
    addLog('🌱 Seeding interview topics...');
    const topicPayloads = staticCats.flatMap(c =>
      c.topics.map(t => ({
        category_id: c.id,
        title: t.title,
        difficulty: t.difficulty,
        time: t.time,
        description: t.desc,
      }))
    );
    const { error: topicErr } = await supabase.from('interview_topics').insert(topicPayloads);
    if (topicErr) addLog(`❌ Topics error: ${topicErr.message}`, 'error');
    else addLog(`✅ Seeded ${topicPayloads.length} topics`, 'success');

    addLog('🎉 All done! Your database is populated.', 'success');
    setStatus('done');
    setSeeding(false);
    setDone(true);
  };

  const logColors = { error: '#fca5a5', success: '#6ee7b7', info: 'rgba(255,255,255,0.6)' };

  return (
    <div className="admin-section">
      <div className="admin-section-header">
        <h2>🌱 Seed Initial Data</h2>
      </div>

      <div style={{ background: '#12121e', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 16, padding: 28, maxWidth: 600 }}>
        <p style={{ color: 'rgba(255,255,255,0.6)', lineHeight: 1.7, marginTop: 0 }}>
          This will upload all your existing static data (<code style={{ color: '#a78bfa' }}>jobs.js</code>, <code style={{ color: '#a78bfa' }}>blogs.js</code>, <code style={{ color: '#a78bfa' }}>interviewPrep.js</code>) into your Supabase PostgreSQL database.
        </p>

        <div style={{ background: 'rgba(245, 158, 11, 0.1)', border: '1px solid rgba(245, 158, 11, 0.3)', borderRadius: 10, padding: '12px 16px', marginBottom: 20 }}>
          <p style={{ margin: 0, color: '#fcd34d', fontSize: 14 }}>
            ⚠️ <strong>Run this only once.</strong> Running multiple times will create duplicate entries.
          </p>
        </div>

        {!done && (
          <button
            className="admin-btn-primary"
            onClick={handleSeed}
            disabled={seeding}
            style={{ fontSize: 15, padding: '12px 28px' }}
          >
            {seeding ? '⏳ Seeding...' : '🌱 Seed All Data to Supabase'}
          </button>
        )}

        {log.length > 0 && (
          <div style={{ marginTop: 20, background: '#0d0d14', borderRadius: 10, padding: '16px', fontFamily: 'monospace', fontSize: 13 }}>
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
