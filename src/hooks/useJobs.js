import { useState, useEffect } from 'react';
import { supabase } from '../supabase';
import { autoSeedIfEmpty, smartSeedAll } from '../utils/autoSeed';
import { generateJobFingerprint } from '../utils/cleanDuplicates';

export function useJobs() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchJobs() {
      setLoading(true);
      
      // Auto-seed initial data if Supabase jobs table is empty
      await autoSeedIfEmpty('jobs', smartSeedAll);

      const { data, error } = await supabase
        .from('jobs')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        setError(error.message);
      } else {
        // Client-side deduplication safeguard
        const seen = new Set();
        const uniqueJobs = (data || []).filter(job => {
          const fp = generateJobFingerprint(job);
          if (seen.has(fp)) return false;
          seen.add(fp);
          return true;
        });
        setJobs(uniqueJobs);
      }
      setLoading(false);
    }
    fetchJobs();
  }, []);

  return { jobs, loading, error };
}
