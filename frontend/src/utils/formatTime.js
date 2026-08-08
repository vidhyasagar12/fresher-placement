/**
 * Dynamic Relative Time Formatter
 * Calculates human-readable time elapsed (e.g. "Just now", "5m ago", "3h ago", "1 day ago", "3 days ago")
 * based on ISO timestamp or Date object.
 */
export function formatPostedTime(created_at, fallback = 'Just now') {
  if (!created_at) return fallback;

  const date = new Date(created_at);
  if (isNaN(date.getTime())) return fallback;

  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  // If created_at is slightly in the future or under 10 seconds ago
  if (diffInSeconds < 10) {
    return 'Just now';
  }

  const minutes = Math.floor(diffInSeconds / 60);
  const hours = Math.floor(diffInSeconds / 3600);
  const days = Math.floor(diffInSeconds / 86400);
  const weeks = Math.floor(days / 7);
  const months = Math.floor(days / 30);

  if (minutes < 1) {
    return 'Just now';
  }
  if (minutes < 60) {
    return `${minutes}m ago`;
  }
  if (hours < 24) {
    return `${hours}h ago`;
  }
  if (days === 1) {
    return '1 day ago';
  }
  if (days < 7) {
    return `${days} days ago`;
  }
  if (weeks < 4) {
    return `${weeks} week${weeks > 1 ? 's' : ''} ago`;
  }
  return `${months} month${months > 1 ? 's' : ''} ago`;
}

/**
 * Parses a relative string like "2 days ago", "6 hours ago", "1 day ago" into an ISO Date string.
 * Used during auto-seeding to generate accurate historical created_at timestamps.
 */
export function parseRelativeTimeToIso(postedStr) {
  if (!postedStr) return new Date().toISOString();
  const str = postedStr.toLowerCase().trim();

  const now = new Date();

  if (str.includes('just now')) return now.toISOString();

  const matchMinutes = str.match(/(\d+)\s*(m|min|minute|minutes)/);
  if (matchMinutes) {
    now.setMinutes(now.getMinutes() - parseInt(matchMinutes[1], 10));
    return now.toISOString();
  }

  const matchHours = str.match(/(\d+)\s*(h|hr|hour|hours)/);
  if (matchHours) {
    now.setHours(now.getHours() - parseInt(matchHours[1], 10));
    return now.toISOString();
  }

  const matchDays = str.match(/(\d+)\s*(d|day|days)/);
  if (matchDays) {
    now.setDate(now.getDate() - parseInt(matchDays[1], 10));
    return now.toISOString();
  }

  const matchWeeks = str.match(/(\d+)\s*(w|wk|week|weeks)/);
  if (matchWeeks) {
    now.setDate(now.getDate() - (parseInt(matchWeeks[1], 10) * 7));
    return now.toISOString();
  }

  const matchMonths = str.match(/(\d+)\s*(mo|month|months)/);
  if (matchMonths) {
    now.setMonth(now.getMonth() - parseInt(matchMonths[1], 10));
    return now.toISOString();
  }

  return now.toISOString();
}
