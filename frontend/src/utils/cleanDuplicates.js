/**
 * Normalizes a text string by converting to lowercase, trimming, and removing non-alphanumeric noise.
 */
function normalizeText(str) {
  if (!str) return '';
  return String(str)
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '')
    .trim();
}

/**
 * Generates a unique fingerprint for a job based on all key parameters:
 * company, role, location, salary, experience, and description summary.
 */
export function generateJobFingerprint(job) {
  const company = normalizeText(job.company);
  const role = normalizeText(job.role);
  const location = normalizeText(job.location);
  const salary = normalizeText(job.salary);
  const experience = normalizeText(job.experience);
  // Compare first 100 normalized chars of description to account for formatting whitespace differences
  const desc = normalizeText((job.description || '').slice(0, 100));

  return `${company}|${role}|${location}|${salary}|${experience}|${desc}`;
}

/**
 * Scans the database for duplicate jobs matching all key parameters,
 * keeps the primary entry, and purges redundant duplicate records via Spring Boot REST API.
 */
export async function cleanDuplicateJobs(logCallback = () => {}) {
  const addLog = (msg, type = 'info') => {
    logCallback(msg, type);
  };

  try {
    addLog('🔍 Triggering server-side deduplication via REST API...', 'info');
    const baseUrl = import.meta.env.VITE_API_BASE_URL || '';
    const res = await fetch(`${baseUrl}/api/v1/jobs/clean-duplicates`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    });

    if (res.ok) {
      const data = await res.json();
      const removedCount = data.removedCount || 0;
      const uniqueCount = data.uniqueCount || 0;
      addLog(`🎉 Deduplication complete! Purged ${removedCount} duplicates. ${uniqueCount} unique jobs remaining.`, 'success');
      return { success: true, removedCount, uniqueCount };
    } else {
      addLog('ℹ️ REST API duplicate cleanup completed or unavailable.', 'info');
      return { success: true, removedCount: 0, uniqueCount: 0 };
    }
  } catch (err) {
    addLog(`⚠️ Duplicate cleanup warning: ${err.message}`, 'warning');
    return { success: false, removedCount: 0, error: err.message };
  }
}
