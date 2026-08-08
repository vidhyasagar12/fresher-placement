import { useState } from 'react';

export function useInterviewQuestions() {
  const [questions] = useState([]);
  const [loading] = useState(false);
  const [error] = useState(null);

  return { questions, loading, error };
}
