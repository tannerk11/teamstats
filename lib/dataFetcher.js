// Data fetching utilities

/**
 * Fetch data for a single team from a URL
 * @param {string} url - The URL to fetch team data from
 * @returns {Promise<Object>} The team data JSON
 */
export async function fetchTeamData(url) {
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`HTTP ${res.status} - Failed to fetch: ${url}`);
  }
  return await res.json();
}

/**
 * Fetch data for all teams in parallel
 * @param {Array<{name: string, url: string}>} teams - Array of team objects
 * @returns {Promise<Array<{name: string, data: Object}>>} Array of team data
 */
export async function fetchAllTeams(teams) {
  console.log(`Fetching data for ${teams.length} team(s)...`);
  
  const results = await Promise.all(
    teams.map(async (team) => {
      try {
        const data = await fetchTeamData(team.url);
        console.log(`✓ Fetched data for ${team.name}`);
        return {
          name: team.name,
          data: data,
          success: true
        };
      } catch (error) {
        console.error(`✗ Failed to fetch ${team.name}: ${error.message}`);
        return {
          name: team.name,
          data: null,
          success: false,
          error: error.message
        };
      }
    })
  );
  
  return results;
}
