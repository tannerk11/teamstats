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
      
      // CUSTOM STATISTICS
      // Convert string values to numbers for calculations
      const fgapg = parseFloat(stats.fgapg) || 0;
      const fgmpg = parseFloat(stats.fgmpg) || 0;
      const fgm3pg = parseFloat(stats.fgm3pg) || 0;
      const orebpg = parseFloat(stats.orebpg) || 0;
      const drebpg = parseFloat(stats.drebpg) || 0;
      const topg = parseFloat(stats.topg) || 0;
      const ftapg = parseFloat(stats.ftapg) || 0;
      const ptspg = parseFloat(stats.ptspg) || 0;
      
      // Opponent stats for calculations
      const fgapgopp = parseFloat(stats.fgapgopp) || 0;
      const orebpgopp = parseFloat(stats.orebpgopp) || 0;
      const topgopp = parseFloat(stats.topgopp) || 0;
      const ftapgopp = parseFloat(stats.ftapgopp) || 0;
      const ptspgopp = parseFloat(stats.ptspgopp) || 0;
      const drebpgopp = parseFloat(stats.drebpgopp) || 0;
      
      // Calculate team possessions per game
      const possessions = fgapg - orebpg + topg + (0.475 * ftapg);
      
      // Calculate opponent possessions per game
      const oppPossessions = fgapgopp - orebpgopp + topgopp + (0.475 * ftapgopp);
      
      // Calculate points per possession (PPP)
      const ppp = possessions > 0 ? ptspg / possessions : 0;
      
      // Calculate opponent points per possession
      const oppPpp = oppPossessions > 0 ? ptspgopp / oppPossessions : 0;
      
      // Effective FG % = (FGM + 0.5 * 3PM) / FGA
      const efgPct = fgapg > 0 ? ((fgmpg + (0.5 * fgm3pg)) / fgapg) * 100 : 0;
      
      // Turnover % = TO / Possessions
      const toPct = possessions > 0 ? (topg / possessions) * 100 : 0;
      
      // Offensive Rebound % = OREB / (OREB + Opp DREB)
      const orPct = (orebpg + drebpgopp) > 0 ? (orebpg / (orebpg + drebpgopp)) * 100 : 0;
      
      // Free Throw Rate = FTA / FGA (as percentage)
      const ftRate = fgapg > 0 ? (ftapg / fgapg) * 100 : 0;
      
      // Shot Volume = (FGA + 0.475 * FTA) / Possessions
      const shotVolume = possessions > 0 ? (fgapg + (0.475 * ftapg)) / possessions : 0;
      
      // Net PPP = Team PPP - Opponent PPP
      const netPpp = ppp - oppPpp;
      
      return {
        teamName: team.name,
        
        // All raw stats data available for calculations
        ...stats,
        
        // Your custom calculated statistics go here (these override any raw data with same name)
        possessionsPerGame: possessions,
        pointsPerPossession: parseFloat(ppp.toFixed(3)),
        oppPossessionsPerGame: oppPossessions,
        oppPointsPerPossession: parseFloat(oppPpp.toFixed(3)),
        netPointsPerPossession: parseFloat(netPpp.toFixed(3)),
        efgPct: parseFloat(efgPct.toFixed(1)),
        toPct: parseFloat(toPct.toFixed(1)),
        orPct: parseFloat(orPct.toFixed(1)),
        ftRate: parseFloat(ftRate.toFixed(1)),
        shotVolume: parseFloat(shotVolume.toFixed(3)),
        
        // Add more custom calculations here as needed
      };
    });
}
