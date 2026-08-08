import { useState, useEffect } from 'react';
import { jobs as staticJobs } from '../data/jobs';
import { interviewCategories as staticCats } from '../data/interviewPrep';

function formatNumber(num, suffixPlus = true) {
  if (num === null || num === undefined || isNaN(num)) return '0';
  if (typeof num === 'string') return num;
  if (num >= 1000000) {
    const val = (num / 1000000).toFixed(1).replace(/\.0$/, '');
    return `${val}M${suffixPlus ? '+' : ''}`;
  }
  if (num >= 1000) {
    const val = (num / 1000).toFixed(1).replace(/\.0$/, '');
    return `${val}K${suffixPlus ? '+' : ''}`;
  }
  return `${num}${suffixPlus ? '+' : ''}`;
}

export function useSiteStats() {
  const staticJobsCount = staticJobs.length;
  const staticCompaniesCount = new Set(staticJobs.map(j => j.company?.trim().toLowerCase()).filter(Boolean)).size;
  const staticTopicsCount = staticCats.reduce((acc, cat) => acc + (cat.topics?.length || 0), 0);

  const [stats, setStats] = useState({
    jobsCount: formatNumber(staticJobsCount),
    companiesCount: formatNumber(staticCompaniesCount),
    topicsCount: formatNumber(staticTopicsCount),
    followersCount: '10K+',
    loading: false,
  });

  useEffect(() => {
    async function loadStats() {
      try {
        const baseUrl = import.meta.env.VITE_API_BASE_URL || '';
        const res = await fetch(`${baseUrl}/api/v1/jobs`);
        if (res.ok) {
          const jobsData = await res.json();
          if (Array.isArray(jobsData) && jobsData.length > 0) {
            const dbJobsTotal = jobsData.length;
            const dbCompanies = new Set(jobsData.map(j => j.company?.trim().toLowerCase()).filter(Boolean)).size;

            setStats(prev => ({
              ...prev,
              jobsCount: formatNumber(Math.max(dbJobsTotal, staticJobsCount)),
              companiesCount: formatNumber(Math.max(dbCompanies, staticCompaniesCount)),
            }));
          }
        }
      } catch (err) {
        console.warn('Error loading dynamic stats:', err.message);
      }
    }

    loadStats();
  }, [staticCompaniesCount, staticJobsCount]);

  return stats;
}
