import { useState, useEffect } from 'react';
import { supabase } from '../supabase';
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
        // 1. Fetch jobs and unique companies from Supabase
        const { data: jobsData } = await supabase
          .from('jobs')
          .select('company');

        const dbJobsTotal = jobsData ? jobsData.length : 0;
        const dbCompanies = jobsData
          ? new Set(jobsData.map(j => j.company?.trim().toLowerCase()).filter(Boolean)).size
          : 0;

        // 2. Fetch total interview topics from Supabase
        const { count: topicsTotal } = await supabase
          .from('interview_topics')
          .select('*', { count: 'exact', head: true });

        const finalJobs = Math.max(dbJobsTotal, staticJobsCount);
        const finalCompanies = Math.max(dbCompanies, staticCompaniesCount);
        const finalTopics = Math.max(topicsTotal || 0, staticTopicsCount);

        setStats(prev => ({
          ...prev,
          jobsCount: formatNumber(finalJobs),
          companiesCount: formatNumber(finalCompanies),
          topicsCount: formatNumber(finalTopics),
          loading: false,
        }));
      } catch (err) {
        console.warn('Error loading dynamic stats, using fallback:', err);
      }
    }

    loadStats();
  }, []);

  return stats;
}
