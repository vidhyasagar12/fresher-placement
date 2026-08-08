import { describe, it, expect } from 'vitest';
import { formatPostedTime, parseRelativeTimeToIso } from '../formatTime';

describe('formatTime utility module', () => {
  describe('formatPostedTime', () => {
    it('returns "Just now" for dates created less than 10 seconds ago', () => {
      const now = new Date().toISOString();
      expect(formatPostedTime(now)).toBe('Just now');
    });

    it('returns fallback if created_at is null or undefined', () => {
      expect(formatPostedTime(null, 'Static Posted')).toBe('Static Posted');
      expect(formatPostedTime(undefined, 'Just now')).toBe('Just now');
    });

    it('returns "15m ago" for dates created 15 minutes ago', () => {
      const date = new Date(Date.now() - 15 * 60 * 1000).toISOString();
      expect(formatPostedTime(date)).toBe('15m ago');
    });

    it('returns "3h ago" for dates created 3 hours ago', () => {
      const date = new Date(Date.now() - 3 * 3600 * 1000).toISOString();
      expect(formatPostedTime(date)).toBe('3h ago');
    });

    it('returns "1 day ago" for dates created 24 hours ago', () => {
      const date = new Date(Date.now() - 25 * 3600 * 1000).toISOString();
      expect(formatPostedTime(date)).toBe('1 day ago');
    });

    it('returns "3 days ago" for dates created 3 days ago', () => {
      const date = new Date(Date.now() - 3 * 86400 * 1000).toISOString();
      expect(formatPostedTime(date)).toBe('3 days ago');
    });

    it('returns "2 weeks ago" for dates created 14 days ago', () => {
      const date = new Date(Date.now() - 14 * 86400 * 1000).toISOString();
      expect(formatPostedTime(date)).toBe('2 weeks ago');
    });
  });

  describe('parseRelativeTimeToIso', () => {
    it('parses "Just now" into an ISO string close to current time', () => {
      const iso = parseRelativeTimeToIso('Just now');
      const diff = Math.abs(new Date(iso).getTime() - Date.now());
      expect(diff).toBeLessThan(1000);
    });

    it('parses "2 days ago" into an ISO string approximately 2 days in the past', () => {
      const iso = parseRelativeTimeToIso('2 days ago');
      const expectedTime = Date.now() - (2 * 86400 * 1000);
      const diff = Math.abs(new Date(iso).getTime() - expectedTime);
      expect(diff).toBeLessThan(5000);
    });

    it('parses "6 hours ago" into an ISO string approximately 6 hours in the past', () => {
      const iso = parseRelativeTimeToIso('6 hours ago');
      const expectedTime = Date.now() - (6 * 3600 * 1000);
      const diff = Math.abs(new Date(iso).getTime() - expectedTime);
      expect(diff).toBeLessThan(5000);
    });
  });
});
