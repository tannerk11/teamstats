// Custom statistics calculations

/**
 * Calculate custom statistics for all teams
 * @param {Array<{name: string, data: Object, success: boolean}>} teamsData
 * @returns {Array<Object>} Array of calculated statistics for each team
 */
export function calculateCustomStats(teamsData, splitType = 'conference') {
  return teamsData
    .filter(team => team.success && team.data) // Only process successful fetches
    .map(team => {
      const attributes = team.data.attributes;
      const splits = team.data.splits || {};
      const stats = splits[splitType] || {};
      
      // EXAMPLE CUSTOM STATISTIC: Possessions per game
      // Convert string values to numbers for calculations
      const fgapg = parseFloat(stats.fgapg) || 0;
      const orebpg = parseFloat(stats.orebpg) || 0;
      const topg = parseFloat(stats.topg) || 0;
      const ftapg = parseFloat(stats.ftapg) || 0;
      
      const possessions = fgapg - orebpg + topg + (0.475 * ftapg);
      
      return {
        teamName: team.name,
        
        // All raw stats data available for calculations
        ...stats,
        
        // Your custom calculated statistics go here (these override any raw data with same name)
        possessionsPerGame: possessions,
        
        // Add more custom calculations here as needed
      };
    });
}
