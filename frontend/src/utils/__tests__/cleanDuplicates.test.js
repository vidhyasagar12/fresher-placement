import { describe, it, expect } from 'vitest';
import { generateJobFingerprint } from '../cleanDuplicates';

describe('cleanDuplicates utility module', () => {
  describe('generateJobFingerprint', () => {
    const baseJob = {
      company: 'Google',
      role: 'Associate Software Engineer',
      location: 'Bangalore, India',
      salary: '₹18–24 LPA',
      experience: 'Fresher (0–1 yr)',
      description: 'Work on cutting-edge distributed systems and cloud APIs.',
    };

    it('generates identical fingerprints for identical jobs regardless of case or whitespace differences', () => {
      const jobA = { ...baseJob };
      const jobB = {
        company: '  google  ',
        role: 'associate software engineer',
        location: 'bangalore, india ',
        salary: '₹18–24 LPA',
        experience: 'fresher (0–1 yr)',
        description: 'Work on cutting-edge distributed systems and cloud APIs.',
      };

      expect(generateJobFingerprint(jobA)).toBe(generateJobFingerprint(jobB));
    });

    it('generates different fingerprints when salary differs', () => {
      const jobA = { ...baseJob };
      const jobB = { ...baseJob, salary: '₹12–15 LPA' };

      expect(generateJobFingerprint(jobA)).not.toBe(generateJobFingerprint(jobB));
    });

    it('generates different fingerprints when location differs', () => {
      const jobA = { ...baseJob };
      const jobB = { ...baseJob, location: 'Hyderabad, India' };

      expect(generateJobFingerprint(jobA)).not.toBe(generateJobFingerprint(jobB));
    });

    it('generates different fingerprints when role differs', () => {
      const jobA = { ...baseJob };
      const jobB = { ...baseJob, role: 'Frontend Engineer' };

      expect(generateJobFingerprint(jobA)).not.toBe(generateJobFingerprint(jobB));
    });

    it('generates different fingerprints when description differs meaningfully', () => {
      const jobA = { ...baseJob };
      const jobB = { ...baseJob, description: 'Completely different engineering team requirements and duties.' };

      expect(generateJobFingerprint(jobA)).not.toBe(generateJobFingerprint(jobB));
    });
  });
});
