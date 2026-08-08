import { jobs as staticJobs } from '../data/jobs';

/**
 * Smart Deduplicated Seeding Engine for REST API
 */
export async function smartSeedAll(logCallback = () => {}) {
  const addLog = (msg, type = 'info') => {
    logCallback(msg, type);
  };

  try {
    addLog('🔍 Syncing jobs to REST API backend...', 'info');
    const baseUrl = import.meta.env.VITE_API_BASE_URL || '';
    
    let seededCount = 0;
    for (const j of staticJobs) {
      try {
        const payload = {
          company: j.company,
          logo: j.logo,
          logoColor: j.logoColor,
          role: j.role,
          location: j.location,
          type: j.type?.toUpperCase().replace(/[\s-]/g, '_') || 'FULL_TIME',
          experience: j.experience,
          salary: j.salary,
          tags: j.tags || [],
          posted: j.posted,
          applyLink: j.applyLink,
          description: j.description,
          requirements: j.requirements || [],
        };

        const res = await fetch(`${baseUrl}/api/v1/jobs`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        if (res.ok) seededCount++;
      } catch (e) {
        console.warn('Seed single job failed:', e);
      }
    }

    addLog(`🎉 Seed complete! Processed ${seededCount} jobs via REST API.`, 'success');
    return true;
  } catch (err) {
    addLog(`❌ Smart seed error: ${err.message}`, 'error');
    return false;
  }
}

export async function autoSeedIfEmpty() {
  // No-op for REST API architecture
}
