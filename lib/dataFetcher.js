// Data fetching utilities

/**
 * Fetch data for a single team from a URL with timeout
 * @param {string} url - The URL to fetch team data from
 * @param {number} timeout - Timeout in milliseconds (default: 10000)
 * @returns {Promise<Object>} The team data JSON
 */
export async function fetchTeamData(url, timeout = 10000) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);
  
  try {
    const res = await fetch(url, { signal: controller.signal });
    clearTimeout(timeoutId);
    
    if (!res.ok) {
      throw new Error(`HTTP ${res.status} - Failed to fetch: ${url}`);
    }
    return await res.json();
  } catch (error) {
    clearTimeout(timeoutId);
    if (error.name === 'AbortError') {
      throw new Error(`Timeout after ${timeout}ms`);
    }
    throw error;
  }
}

/**
 * Fetch data for all teams in batches with rate limiting
 * @param {Array<{name: string, url: string, conference: string}>} teams - Array of team objects
 * @param {number} batchSize - Number of teams to fetch concurrently (default: 10)
 * @returns {Promise<Array<{name: string, conference: string, data: Object}>>} Array of team data
 */
export async function fetchAllTeams(teams, batchSize = 10) {
  console.log(`Fetching data for ${teams.length} team(s) in batches of ${batchSize}...`);
  
  const results = [];
  let successCount = 0;
  let failCount = 0;
  
  // Process teams in batches
  for (let i = 0; i < teams.length; i += batchSize) {
    const batch = teams.slice(i, Math.min(i + batchSize, teams.length));
    console.log(`\nProcessing batch ${Math.floor(i / batchSize) + 1}/${Math.ceil(teams.length / batchSize)} (teams ${i + 1}-${Math.min(i + batchSize, teams.length)})...`);
    
    const batchResults = await Promise.all(
      batch.map(async (team) => {
        try {
          const data = await fetchTeamData(team.url);
          successCount++;
          console.log(`✓ [${successCount + failCount}/${teams.length}] ${team.name}`);
          return {
            name: team.name,
            conference: team.conference || 'Unknown',
            data: data,
            success: true
          };
        } catch (error) {
          failCount++;
          console.error(`✗ [${successCount + failCount}/${teams.length}] ${team.name}: ${error.message}`);
          return {
            name: team.name,
            conference: team.conference || 'Unknown',
            data: null,
            success: false,
            error: error.message
          };
        }
      })
    );
    
    results.push(...batchResults);
    
    // Small delay between batches to avoid overwhelming the server
    if (i + batchSize < teams.length) {
      await new Promise(resolve => setTimeout(resolve, 500));
    }
  }
  
  console.log(`\n✓ Completed: ${successCount} successful, ${failCount} failed`);
  return results;
}
