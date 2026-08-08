import { useState, useEffect } from 'react';

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
  const [stats, setStats] = useState({
    jobsCount: '0',
    companiesCount: '0',
    topicsCount: '0',
    followersCount: '10K+',
    loading: true,
  });

  useEffect(() => {
    async function loadStats() {
      try {
        const baseUrl = import.meta.env.VITE_API_BASE_URL || '';
        const res = await fetch(`${baseUrl}/api/v1/jobs`);
        if (res.ok) {
          const jobsData = await res.json();
          if (Array.isArray(jobsData)) {
            const dbJobsTotal = jobsData.length;
            const dbCompanies = new Set(jobsData.map(j => j.company?.trim().toLowerCase()).filter(Boolean)).size;

            setStats({
              jobsCount: formatNumber(dbJobsTotal),
              companiesCount: formatNumber(dbCompanies),
              topicsCount: '50+',
              followersCount: '10K+',
              loading: false,
            });
          }
        }
      } catch (err) {
        console.warn('Error loading dynamic stats:', err.message);
        setStats(prev => ({ ...prev, loading: false }));
      }
    }

    loadStats();
  }, []);

  return stats;
}
