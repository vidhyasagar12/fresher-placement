import { useState, useEffect } from 'react';
import { jobs as staticJobs } from '../data/jobs';
import { generateJobFingerprint } from '../utils/cleanDuplicates';

export function useJobs() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchJobs() {
      setLoading(true);
      try {
        const baseUrl = import.meta.env.VITE_API_BASE_URL || '';
        const res = await fetch(`${baseUrl}/api/v1/jobs`);
        if (res.ok) {
          const data = await res.json();
          const seen = new Set();
          const uniqueJobs = (data || []).filter(job => {
            const fp = generateJobFingerprint(job);
            if (seen.has(fp)) return false;
            seen.add(fp);
            return true;
          });
          setJobs(uniqueJobs.length > 0 ? uniqueJobs : staticJobs);
        } else {
          setJobs(staticJobs);
        }
      } catch (err) {
        console.warn('Backend API unreachable, using static fallback:', err.message);
        setJobs(staticJobs);
      } finally {
        setLoading(false);
      }
    }
    fetchJobs();
  }, []);

  return { jobs, loading, error };
}
