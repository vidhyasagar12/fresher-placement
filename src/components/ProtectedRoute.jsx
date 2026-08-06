import { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { supabase } from '../supabase';

export default function ProtectedRoute({ children }) {
  const [session, setSession] = useState(undefined); // undefined = still loading

  useEffect(() => {
    // Get current session
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (session === undefined) {
    // Still checking auth — show nothing (avoid flash)
    return null;
  }

  if (!session) {
    return <Navigate to="/admin/login" replace />;
  }

  return children;
}
