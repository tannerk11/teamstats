// Fetch and process player data from all conferences

/**
 * Fetch player data from a single conference
 * @param {string} url - The player data JSON URL
 * @param {string} conference - The conference name
 * @returns {Promise<Array>} - Array of player objects
 */
export async function fetchPlayerData(url, conference) {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    
    // Add conference info to each player and return
    return data.individuals.map(player => ({
      ...player,
      conference: conference
    }));
  } catch (error) {
    console.error(`Error fetching player data for ${conference}:`, error.message);
    return [];
  }
}

/**
 * Fetch player data from all configured conferences
 * @param {Array} playerDataConfigs - Array of {conference, url} objects
 * @returns {Promise<Array>} - Array of all players
 */
export async function fetchAllPlayerData(playerDataConfigs) {
  console.log(`📥 Fetching player data from ${playerDataConfigs.length} conferences...`);
  
  const startTime = Date.now();
  const promises = playerDataConfigs.map(config => 
    fetchPlayerData(config.url, config.conference)
  );
  
  const results = await Promise.all(promises);
  const allPlayers = results.flat();
  
  const duration = ((Date.now() - startTime) / 1000).toFixed(2);
  console.log(`✅ Fetched ${allPlayers.length} total players in ${duration}s`);
  
  return allPlayers;
}

/**
 * Filter players by various criteria
 * @param {Array} players - Array of player objects
 * @param {Object} filters - Filter criteria
 * @returns {Array} - Filtered players
 */
export function filterPlayers(players, filters = {}) {
  let filtered = [...players];
  
  // Filter by conference
  if (filters.conference && filters.conference !== 'all') {
    filtered = filtered.filter(p => p.conference === filters.conference);
  }
  
  // Filter by team
  if (filters.team && filters.team !== 'all') {
    filtered = filtered.filter(p => p.team === filters.team);
  }
  
  // Filter by position
  if (filters.position && filters.position !== 'all') {
    filtered = filtered.filter(p => p.position === filters.position);
  }
  
  // Filter by year
  if (filters.year && filters.year !== 'all') {
    filtered = filtered.filter(p => p.year === filters.year);
  }
  
  return filtered;
}

/**
 * Get unique values for filter dropdowns
 * @param {Array} players - Array of player objects
 * @returns {Object} - Object with arrays of unique values
 */
export function getFilterOptions(players) {
  const conferences = [...new Set(players.map(p => p.conference).filter(Boolean))].sort();
  const teams = [...new Set(players.map(p => p.team).filter(Boolean))].sort();
  const positions = [...new Set(players.map(p => p.position).filter(Boolean))].sort();
  const years = [...new Set(players.map(p => p.year).filter(Boolean))].sort();
  
  return {
    conferences,
    teams,
    positions,
    years
  };
}
