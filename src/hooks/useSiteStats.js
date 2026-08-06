import { useState, useEffect } from 'react';
import { supabase } from '../supabase';

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
    jobsCount: '...',
    companiesCount: '...',
    topicsCount: '...',
    followersCount: '10K+',
    loading: true,
  });

  useEffect(() => {
    async function loadStats() {
      try {
        // 1. Fetch jobs and unique companies from Supabase
        const { data: jobsData } = await supabase
          .from('jobs')
          .select('company');

        const jobsTotal = jobsData ? jobsData.length : 0;
        const uniqueCompanies = jobsData
          ? new Set(jobsData.map(j => j.company?.trim().toLowerCase()).filter(Boolean)).size
          : 0;

        // 2. Fetch total interview topics from Supabase
        const { count: topicsTotal } = await supabase
          .from('interview_topics')
          .select('*', { count: 'exact', head: true });

        // 3. Try fetching dynamic Instagram followers count with fallbacks
        let followersText = '10K+';
        try {
          // Attempt 1: fetch from Instagram via CORS proxy
          const targetUrl = 'https://www.instagram.com/fresherplacement/';
          const proxyUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(targetUrl)}`;
          
          const controller = new AbortController();
          const timeoutId = setTimeout(() => controller.abort(), 4000); // 4s timeout

          const res = await fetch(proxyUrl, { signal: controller.signal });
          clearTimeout(timeoutId);

          if (res.ok) {
            const data = await res.json();
            const html = data.contents || '';

            // Match pattern like "10.5k Followers", "10,500 Followers", or "edge_followed_by":{"count":10500}
            const matchCount = html.match(/"edge_followed_by":\s*\{\s*"count":\s*(\d+)/i) ||
                               html.match(/(\d[\d,.]*\s*[KMBkmb]?)\s+Followers/i) ||
                               html.match(/content="(\d[\d,.]*\s*[KMBkmb]?)\s+Followers/i);

            if (matchCount && matchCount[1]) {
              const rawVal = matchCount[1].replace(/,/g, '').trim();
              if (!isNaN(rawVal)) {
                followersText = formatNumber(parseInt(rawVal, 10));
              } else {
                followersText = rawVal.toUpperCase();
                if (!followersText.includes('+')) followersText += '+';
              }
            }
          }
        } catch {
          // Fallback to default if Instagram blocks CORS or times out
          followersText = '10K+';
        }

        setStats({
          jobsCount: formatNumber(jobsTotal),
          companiesCount: formatNumber(uniqueCompanies),
          topicsCount: formatNumber(topicsTotal || 0),
          followersCount: followersText,
          loading: false,
        });
      } catch (err) {
        console.error('Error loading dynamic stats:', err);
        setStats(prev => ({ ...prev, loading: false }));
      }
    }

    loadStats();
  }, []);

  return stats;
}
