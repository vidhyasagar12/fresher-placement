import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../../../supabase';
import { publishToInstagram } from '../../../services/instagram';
import { generateJobPoster } from '../../../utils/generateJobPoster';
import { generateSeoCaption } from '../../../utils/generateSeoCaption';

const EMPTY_JOB = {
  company: '', logo: '', logo_color: '#6c3cfc', role: '', location: '',
  type: 'Onsite', experience: 'Fresher', salary: '', tags: '',
  posted: 'Just now', apply_link: '', description: '', requirements: '',
  auto_post_ig: true,
};

function Toast({ msg, type }) {
  if (!msg) return null;
  return <div className={`admin-toast ${type}`}>{msg}</div>;
}

export default function AdminJobs() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(EMPTY_JOB);
  const [editId, setEditId] = useState(null);
  const [saving, setSaving] = useState(false);
  const [autoPostIg, setAutoPostIg] = useState(true);
  const [toast, setToast] = useState({ msg: '', type: 'success' });

  // Preview Modal state
  const [preview, setPreview] = useState({
    show: false,
    dataUrl: '',
    caption: '',
    altText: '',
    job: null,
  });

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast({ msg: '', type: 'success' }), 4000);
  };

  const loadJobs = useCallback(async () => {
    setLoading(true);
    const { data } = await supabase.from('jobs').select('*').order('created_at', { ascending: false });
    setJobs(data || []);
    setLoading(false);
  }, []);

  useEffect(() => { loadJobs(); }, [loadJobs]);

  const openAdd = () => { setForm(EMPTY_JOB); setEditId(null); setAutoPostIg(true); setShowForm(true); };
  const openEdit = (job) => {
    setForm({
      ...job,
      tags: (job.tags || []).join(', '),
      requirements: (job.requirements || []).join('\n'),
    });
    setEditId(job.id);
    setAutoPostIg(false);
    setShowForm(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    const payload = {
      ...form,
      tags: typeof form.tags === 'string' ? form.tags.split(',').map(t => t.trim()).filter(Boolean) : form.tags,
      requirements: typeof form.requirements === 'string' ? form.requirements.split('\n').map(r => r.trim()).filter(Boolean) : form.requirements,
    };
    delete payload.id;
    delete payload.created_at;
    delete payload.auto_post_ig;

    let error;
    let savedJobId = editId;

    if (editId) {
      ({ error } = await supabase.from('jobs').update(payload).eq('id', editId));
    } else {
      const { data: insertedData, error: insErr } = await supabase.from('jobs').insert([payload]).select();
      error = insErr;
      if (insertedData?.[0]) savedJobId = insertedData[0].id;
    }

    if (error) {
      setSaving(false);
      showToast('Error: ' + error.message, 'error');
      return;
    }

    // Trigger Instagram Auto-Post if checked
    if (autoPostIg) {
      showToast('🚀 Job saved! Publishing to Instagram...');
      try {
        const igResult = await publishToInstagram({ ...payload, id: savedJobId });
        showToast(igResult.message, igResult.published ? 'success' : 'info');

        if (savedJobId) {
          await supabase.from('jobs').update({ instagram_posted: true }).eq('id', savedJobId);
        }
      } catch (igErr) {
        console.error('Instagram post error:', igErr);
        showToast('Job saved, but Instagram post failed: ' + igErr.message, 'error');
      }
    } else {
      showToast(editId ? 'Job updated!' : 'Job posted successfully!');
    }

    setSaving(false);
    setShowForm(false);
    loadJobs();
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this job?')) return;
    const { error } = await supabase.from('jobs').delete().eq('id', id);
    if (error) showToast('Delete failed: ' + error.message, 'error');
    else { showToast('Job deleted'); loadJobs(); }
  };

  const handlePreviewPoster = async (jobData) => {
    const targetJob = jobData || {
      ...form,
      tags: typeof form.tags === 'string' ? form.tags.split(',').map(t => t.trim()).filter(Boolean) : form.tags,
      requirements: typeof form.requirements === 'string' ? form.requirements.split('\n').map(r => r.trim()).filter(Boolean) : form.requirements,
    };

    const { dataUrl } = await generateJobPoster(targetJob);
    const seo = generateSeoCaption(targetJob);

    setPreview({
      show: true,
      dataUrl,
      caption: seo.caption,
      altText: seo.altText,
      job: targetJob,
    });
  };

  const copyToClipboard = (text, label) => {
    navigator.clipboard.writeText(text);
    showToast(`📋 Copied ${label} to clipboard!`);
  };

  const downloadPoster = () => {
    const a = document.createElement('a');
    a.href = preview.dataUrl;
    a.download = `Instagram-Poster-${(preview.job?.company || 'job').replace(/\s+/g, '-')}.png`;
    a.click();
    showToast('💾 Poster image downloaded!');
  };

  const F = (key) => ({ value: form[key], onChange: e => setForm(f => ({ ...f, [key]: e.target.value })) });

  return (
    <div className="admin-section">
      <Toast msg={toast.msg} type={toast.type} />

      <div className="admin-section-header">
        <h2>💼 Job Listings &amp; Instagram Publisher</h2>
        <button className="admin-btn-primary" onClick={openAdd}>➕ Post New Job</button>
      </div>

      {loading ? (
        <div className="admin-loading">⏳ Loading jobs...</div>
      ) : jobs.length === 0 ? (
        <div className="admin-empty"><span>💼</span>No jobs yet. Post your first one!</div>
      ) : (
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Company</th>
                <th>Role</th>
                <th>Location</th>
                <th>Type</th>
                <th>Salary</th>
                <th>Instagram Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {jobs.map(job => (
                <tr key={job.id}>
                  <td><strong>{job.company}</strong></td>
                  <td>{job.role}</td>
                  <td>{job.location}</td>
                  <td>{job.type}</td>
                  <td>{job.salary}</td>
                  <td>
                    {job.instagram_posted ? (
                      <span className="admin-tag" style={{ background: 'rgba(16,185,129,0.2)', color: '#6ee7b7' }}>📸 Posted</span>
                    ) : (
                      <button
                        className="admin-btn-edit"
                        style={{ fontSize: 11, padding: '3px 8px' }}
                        onClick={() => handlePreviewPoster(job)}
                      >
                        📱 Generate IG Poster
                      </button>
                    )}
                  </td>
                  <td>
                    <div className="actions">
                      <button className="admin-btn-edit" onClick={() => openEdit(job)}>✏️ Edit</button>
                      <button className="admin-btn-danger" onClick={() => handleDelete(job.id)}>🗑 Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Form Modal */}
      {showForm && (
        <div className="admin-modal-overlay" onClick={e => e.target === e.currentTarget && setShowForm(false)}>
          <div className="admin-modal">
            <div className="admin-modal-header">
              <h3>{editId ? '✏️ Edit Job' : '➕ Post New Job & Instagram Graphic'}</h3>
              <button className="admin-modal-close" onClick={() => setShowForm(false)}>✕</button>
            </div>
            <form className="admin-form" onSubmit={handleSave}>
              <div className="admin-form-row">
                <div className="admin-form-group">
                  <label>Company Name *</label>
                  <input required placeholder="e.g. Google" {...F('company')} />
                </div>
                <div className="admin-form-group">
                  <label>Logo Letter</label>
                  <input placeholder="e.g. G" maxLength={3} {...F('logo')} />
                </div>
              </div>
              <div className="admin-form-row">
                <div className="admin-form-group">
                  <label>Logo Color</label>
                  <input type="color" {...F('logo_color')} style={{ height: 44, padding: 4 }} />
                </div>
                <div className="admin-form-group">
                  <label>Work Type</label>
                  <select {...F('type')}>
                    <option>Onsite</option>
                    <option>Remote</option>
                    <option>Hybrid</option>
                  </select>
                </div>
              </div>
              <div className="admin-form-group">
                <label>Job Role / Title *</label>
                <input required placeholder="e.g. Associate Software Engineer" {...F('role')} />
              </div>
              <div className="admin-form-row">
                <div className="admin-form-group">
                  <label>Location</label>
                  <input placeholder="e.g. Bangalore, India" {...F('location')} />
                </div>
                <div className="admin-form-group">
                  <label>Experience</label>
                  <input placeholder="e.g. Fresher (0–1 yr)" {...F('experience')} />
                </div>
              </div>
              <div className="admin-form-row">
                <div className="admin-form-group">
                  <label>Salary</label>
                  <input placeholder="e.g. ₹12–18 LPA" {...F('salary')} />
                </div>
                <div className="admin-form-group">
                  <label>Posted</label>
                  <input placeholder="e.g. 2 days ago" {...F('posted')} />
                </div>
              </div>
              <div className="admin-form-group">
                <label>Tags (comma-separated for SEO &amp; Hashtags)</label>
                <input placeholder="Java, Python, React" {...F('tags')} />
              </div>
              <div className="admin-form-group">
                <label>Apply Link</label>
                <input type="url" placeholder="https://careers.company.com" {...F('apply_link')} />
              </div>
              <div className="admin-form-group">
                <label>Job Description</label>
                <textarea rows={3} placeholder="Describe the role..." {...F('description')} />
              </div>
              <div className="admin-form-group">
                <label>Requirements (one per line)</label>
                <textarea rows={4} placeholder="B.E/B.Tech in CS&#10;Strong in DSA&#10;..." {...F('requirements')} />
              </div>

              {/* Instagram Auto-Post Checkbox & Preview */}
              <div style={{ background: 'rgba(108,60,252,0.15)', border: '1px solid rgba(108,60,252,0.3)', borderRadius: 12, padding: 16 }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', textTransform: 'none', fontSize: 14, color: '#fff' }}>
                    <input
                      type="checkbox"
                      checked={autoPostIg}
                      onChange={e => setAutoPostIg(e.target.checked)}
                      style={{ width: 18, height: 18, accentColor: '#6c3cfc' }}
                    />
                    <span>📸 <strong>Auto-Post to Instagram</strong> (Generate 1080x1080 Poster &amp; SEO Caption)</span>
                  </label>
                  <button
                    type="button"
                    className="admin-btn-edit"
                    style={{ fontSize: 12, padding: '6px 12px' }}
                    onClick={() => handlePreviewPoster()}
                  >
                    👁️ Preview Poster &amp; SEO
                  </button>
                </div>
              </div>

              <div className="admin-form-actions">
                <button type="button" className="admin-btn-cancel" onClick={() => setShowForm(false)}>Cancel</button>
                <button type="submit" className="admin-btn-primary" disabled={saving}>
                  {saving ? 'Saving & Publishing...' : editId ? '💾 Update Job' : '🚀 Post Job & Publish'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Instagram Poster & SEO Caption Preview Modal */}
      {preview.show && (
        <div className="admin-modal-overlay" onClick={e => e.target === e.currentTarget && setPreview({ show: false, dataUrl: '', caption: '', altText: '', job: null })}>
          <div className="admin-modal" style={{ maxWidth: 880 }}>
            <div className="admin-modal-header">
              <h3>📸 Instagram Poster &amp; SEO Caption Preview</h3>
              <button className="admin-modal-close" onClick={() => setPreview({ show: false, dataUrl: '', caption: '', altText: '', job: null })}>✕</button>
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: '320px 1fr', gap: 24 }}>
              {/* Graphic Poster Image */}
              <div style={{ textAlign: 'center' }}>
                <img
                  src={preview.dataUrl}
                  alt="Generated Instagram Poster"
                  style={{ width: '100%', borderRadius: 16, border: '1px solid rgba(255,255,255,0.1)', boxShadow: '0 10px 30px rgba(0,0,0,0.5)' }}
                />
                <button
                  type="button"
                  className="admin-btn-primary"
                  style={{ width: '100%', justifyContent: 'center', marginTop: 14 }}
                  onClick={downloadPoster}
                >
                  💾 Download 1080x1080 PNG
                </button>
              </div>

              {/* SEO Caption & Alt Text */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <label style={{ fontSize: 13, fontWeight: 700, color: '#a78bfa', textTransform: 'uppercase' }}>
                    🔥 SEO Optimized Caption &amp; Hashtags
                  </label>
                  <button
                    type="button"
                    className="admin-btn-edit"
                    style={{ fontSize: 12 }}
                    onClick={() => copyToClipboard(preview.caption, 'SEO Caption')}
                  >
                    📋 Copy Caption
                  </button>
                </div>
                <textarea
                  rows={12}
                  readOnly
                  value={preview.caption}
                  style={{
                    background: 'rgba(0,0,0,0.4)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: 10,
                    color: '#e2e8f0',
                    fontFamily: 'monospace',
                    fontSize: 13,
                    padding: 12,
                  }}
                />

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <label style={{ fontSize: 12, fontWeight: 700, color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase' }}>
                    ♿ Instagram Accessibility Alt-Text (Algorithm Indexing)
                  </label>
                  <button
                    type="button"
                    className="admin-btn-edit"
                    style={{ fontSize: 11, padding: '2px 8px' }}
                    onClick={() => copyToClipboard(preview.altText, 'Alt Text')}
                  >
                    📋 Copy Alt Text
                  </button>
                </div>
                <input
                  readOnly
                  value={preview.altText}
                  style={{
                    background: 'rgba(0,0,0,0.4)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: 8,
                    color: 'rgba(255,255,255,0.7)',
                    fontSize: 12,
                    padding: '8px 12px',
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
