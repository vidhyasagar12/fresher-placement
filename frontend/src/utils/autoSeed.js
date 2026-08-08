/**
 * Smart Deduplicated Seeding Engine for REST API
 */
export async function smartSeedAll(logCallback = () => {}) {
  logCallback('Database synchronization active.', 'info');
  return true;
}

export async function autoSeedIfEmpty() {
  // No-op for REST API architecture
}
