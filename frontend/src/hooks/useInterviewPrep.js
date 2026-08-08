import { useState, useEffect } from 'react';

export function useInterviewPrep() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchPrep() {
      setLoading(true);
      setError(null);
      try {
        const baseUrl = import.meta.env.VITE_API_BASE_URL || '';
        const res = await fetch(`${baseUrl}/api/v1/interview-prep`);
        if (res.ok) {
          const data = await res.json();
          setCategories(data || []);
        } else {
          setError(`Database API returned status ${res.status}`);
          setCategories([]);
        }
      } catch (err) {
        setError(`Database connection failed: ${err.message}`);
        setCategories([]);
      } finally {
        setLoading(false);
      }
    }
    fetchPrep();
  }, []);

  return { categories, loading, error };
}
