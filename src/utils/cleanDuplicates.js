import { supabase } from '../supabase';

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
 * Scans the Supabase database for duplicate jobs matching all key parameters,
 * keeps the primary/newest entry, and safely deletes redundant duplicate records.
 */
export async function cleanDuplicateJobs(logCallback = () => {}) {
  const addLog = (msg, type = 'info') => {
    logCallback(msg, type);
  };

  try {
    addLog('🔍 Fetching all jobs from database to check for duplicates...', 'info');

    const { data: allJobs, error: fetchErr } = await supabase
      .from('jobs')
      .select('*')
      .order('created_at', { ascending: false });

    if (fetchErr) {
      addLog(`❌ Failed to fetch jobs: ${fetchErr.message}`, 'error');
      return { success: false, removedCount: 0, error: fetchErr.message };
    }

    if (!allJobs || allJobs.length === 0) {
      addLog('ℹ️ No jobs found in database.', 'info');
      return { success: true, removedCount: 0, uniqueCount: 0 };
    }

    const seenFingerprints = new Map(); // fingerprint -> primary job object
    const duplicateIdsToDelete = [];

    for (const job of allJobs) {
      const fp = generateJobFingerprint(job);

      if (seenFingerprints.has(fp)) {
        // We already have a primary record with matching company, role, location, salary, experience & description
        duplicateIdsToDelete.push(job.id);
      } else {
        seenFingerprints.set(fp, job);
      }
    }

    if (duplicateIdsToDelete.length === 0) {
      addLog(`✅ Zero duplicate jobs found! All ${allJobs.length} listings are unique.`, 'success');
      return { success: true, removedCount: 0, uniqueCount: allJobs.length };
    }

    addLog(`⚠️ Found ${duplicateIdsToDelete.length} duplicate job entries out of ${allJobs.length} total records. Purging duplicates...`, 'info');

    // Perform safe batch delete from Supabase
    const { error: deleteErr } = await supabase
      .from('jobs')
      .delete()
      .in('id', duplicateIdsToDelete);

    if (deleteErr) {
      addLog(`❌ Error deleting duplicates: ${deleteErr.message}`, 'error');
      return { success: false, removedCount: 0, error: deleteErr.message };
    }

    const uniqueCount = seenFingerprints.size;
    addLog(`🎉 Successfully cleaned ${duplicateIdsToDelete.length} duplicate job entries! ${uniqueCount} unique jobs remaining.`, 'success');

    return {
      success: true,
      removedCount: duplicateIdsToDelete.length,
      uniqueCount,
    };
  } catch (err) {
    addLog(`❌ Duplicate cleanup error: ${err.message}`, 'error');
    return { success: false, removedCount: 0, error: err.message };
  }
}
