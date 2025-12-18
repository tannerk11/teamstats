// Custom statistics calculations

/**
 * Helper to parse float with fallback to 0
 * @param {*} value - Value to parse
 * @returns {number} Parsed number or 0
 */
function safeParseFloat(value) {
  return parseFloat(value) || 0;
}

/**
 * Calculate shooting percentage
 * @param {number} made - Shots made
 * @param {number} attempted - Shots attempted
 * @returns {number} Percentage (0-100)
 */
function calculatePct(made, attempted) {
  return attempted > 0 ? (made / attempted) * 100 : 0;
}

/**
 * Calculate advanced stats from raw aggregated data
 * @param {Object} stats - Raw aggregated stats object
 * @returns {Object} Stats with advanced calculations added
 */
export function calculateAdvancedStats(stats) {
  // Parse all needed stats at once
  const s = {
    // Team stats
    fgapg: safeParseFloat(stats.fgapg),
    fgmpg: safeParseFloat(stats.fgmpg),
    fgm3pg: safeParseFloat(stats.fgm3pg),
    fga3pg: safeParseFloat(stats.fga3pg),
    orebpg: safeParseFloat(stats.orebpg),
    drebpg: safeParseFloat(stats.drebpg),
    topg: safeParseFloat(stats.topg),
    ftapg: safeParseFloat(stats.ftapg),
    ptspg: safeParseFloat(stats.ptspg),
    // Opponent stats
    fgapgopp: safeParseFloat(stats.fgapgopp),
    fgmpgopp: safeParseFloat(stats.fgmpgopp),
    fgm3pgopp: safeParseFloat(stats.fgm3pgopp),
    fga3pgopp: safeParseFloat(stats.fga3pgopp),
    orebpgopp: safeParseFloat(stats.orebpgopp),
    topgopp: safeParseFloat(stats.topgopp),
    ftapgopp: safeParseFloat(stats.ftapgopp),
    ftmpgopp: safeParseFloat(stats.ftmpgopp),
    ptspgopp: safeParseFloat(stats.ptspgopp),
    drebpgopp: safeParseFloat(stats.drebpgopp),
    // Totals for percentage calculations
    fgm: safeParseFloat(stats.fgm),
    fga: safeParseFloat(stats.fga),
    fgm3: safeParseFloat(stats.fgm3),
    fga3: safeParseFloat(stats.fga3),
    ftm: safeParseFloat(stats.ftm),
    fta: safeParseFloat(stats.fta)
  };
  
  // Calculate possessions
  const possessions = s.fgapg - s.orebpg + s.topg + (0.475 * s.ftapg);
  const oppPossessions = s.fgapgopp - s.orebpgopp + s.topgopp + (0.475 * s.ftapgopp);
  
  // Calculate points per possession
  const ppp = possessions > 0 ? s.ptspg / possessions : 0;
  const oppPpp = oppPossessions > 0 ? s.ptspgopp / oppPossessions : 0;
  
  // Calculate ratings
  const ortg = ppp * 100;
  const drtg = oppPpp * 100;
  const nrtg = ortg - drtg;
  
  // Calculate shooting percentages (from totals for accuracy)
  const fgPct = calculatePct(s.fgm, s.fga);
  const fg3Pct = calculatePct(s.fgm3, s.fga3);
  const ftPct = calculatePct(s.ftm, s.fta);
  
  // Calculate effective FG%
  const efgPct = calculatePct(s.fgmpg + (0.5 * s.fgm3pg), s.fgapg);
  const efgPctOpp = calculatePct(s.fgmpgopp + (0.5 * s.fgm3pgopp), s.fgapgopp);
  
  // Calculate opponent shooting percentages
  const fgPctOpp = calculatePct(s.fgmpgopp, s.fgapgopp);
  const fg3PctOpp = calculatePct(s.fgm3pgopp, s.fga3pgopp);
  const ftPctOpp = calculatePct(s.ftmpgopp, s.ftapgopp);
  
  // Calculate turnover percentages
  const toPct = calculatePct(s.topg, possessions);
  const toPctOpp = calculatePct(s.topgopp, oppPossessions);
  
  // Calculate rebound percentages
  const orPct = calculatePct(s.orebpg, s.orebpg + s.drebpgopp);
  const drPct = calculatePct(s.drebpg, s.drebpg + s.orebpgopp);
  const orPctOpp = calculatePct(s.orebpgopp, s.orebpgopp + s.drebpg);
  const drPctOpp = calculatePct(s.drebpgopp, s.drebpgopp + s.orebpg);
  
  // Calculate attempt rates
  const ftRate = calculatePct(s.ftapg, s.fgapg);
  const ftRateOpp = calculatePct(s.ftapgopp, s.fgapgopp);
  const threePtRate = calculatePct(s.fga3pg, s.fgapg);
  const threePtRateOpp = calculatePct(s.fga3pgopp, s.fgapgopp);
  
  // Calculate shot volumes
  const shotVolume = possessions > 0 ? (s.fgapg + (0.475 * s.ftapg)) / possessions : 0;
  const shotVolumeOpp = oppPossessions > 0 ? (s.fgapgopp + (0.475 * s.ftapgopp)) / oppPossessions : 0;
  
  return {
    ...stats, // Keep all original stats
    
    // Basic shooting percentages
    fgPct: parseFloat(fgPct.toFixed(1)),
    fg3Pct: parseFloat(fg3Pct.toFixed(1)),
    ftPct: parseFloat(ftPct.toFixed(1)),
    
    // Possessions and efficiency
    possessionsPerGame: possessions,
    pointsPerPossession: parseFloat(ppp.toFixed(3)),
    oppPossessionsPerGame: oppPossessions,
    oppPointsPerPossession: parseFloat(oppPpp.toFixed(3)),
    netPointsPerPossession: parseFloat((ppp - oppPpp).toFixed(3)),
    
    // Ratings
    offensiveRating: parseFloat(ortg.toFixed(1)),
    defensiveRating: parseFloat(drtg.toFixed(1)),
    netRating: parseFloat(nrtg.toFixed(1)),
    
    // Effective FG%
    efgPct: parseFloat(efgPct.toFixed(1)),
    efgPctOpp: parseFloat(efgPctOpp.toFixed(1)),
    
    // Opponent shooting percentages
    fgPctOpp: parseFloat(fgPctOpp.toFixed(1)),
    fg3PctOpp: parseFloat(fg3PctOpp.toFixed(1)),
    ftPctOpp: parseFloat(ftPctOpp.toFixed(1)),
    
    // Four Factors
    toPct: parseFloat(toPct.toFixed(1)),
    toPctOpp: parseFloat(toPctOpp.toFixed(1)),
    orPct: parseFloat(orPct.toFixed(1)),
    drPct: parseFloat(drPct.toFixed(1)),
    orPctOpp: parseFloat(orPctOpp.toFixed(1)),
    drPctOpp: parseFloat(drPctOpp.toFixed(1)),
    
    // Attempt rates
    ftRate: parseFloat(ftRate.toFixed(1)),
    ftRateOpp: parseFloat(ftRateOpp.toFixed(1)),
    threePtRate: parseFloat(threePtRate.toFixed(1)),
    threePtRateOpp: parseFloat(threePtRateOpp.toFixed(1)),
    shotVolume: parseFloat(shotVolume.toFixed(3)),
    shotVolumeOpp: parseFloat(shotVolumeOpp.toFixed(3)),
  };
}

/**
 * Calculate wins and losses from events array
 * @param {Array} events - Array of event objects
 * @param {string} splitType - 'conference' or 'overall'
 * @returns {Object} Object with wins and losses counts
 */
function calculateWinLoss(events = [], splitType = 'conference') {
  let wins = 0;
  let losses = 0;
  
  if (!events || events.length === 0) {
    return { wins, losses };
  }
  
  events.forEach(event => {
    // Check if this event should count based on split type
    const isConference = event.event?.conference === true;
    const isOverall = event.event?.overall === true;
    
    // Skip if not matching the requested split type
    if (splitType === 'conference' && !isConference) {
      return;
    }
    if (splitType === 'overall' && !isOverall) {
      return;
    }
    
    // Check the result description
    const result = event.event?.result?.description;
    if (result === 'Win') {
      wins++;
    } else if (result === 'Loss') {
      losses++;
    }
  });
  
  return { wins, losses };
}

/**
 * Calculate custom statistics for all teams from pre-calculated splits
 * @param {Array<{name: string, data: Object, success: boolean}>} teamsData
 * @param {string} splitType - Type of split to use ('conference', 'overall', etc.)
 * @returns {Array<Object>} Array of calculated statistics for each team
 */
export function calculateCustomStats(teamsData, splitType = 'conference') {
  return teamsData
    .filter(team => team.success && team.data)
    .map(team => {
      const splits = team.data.splits || {};
      const stats = splits[splitType] || {};
      const events = team.data.events || [];
      
      // Calculate wins and losses from events
      const { wins, losses } = calculateWinLoss(events, splitType);
      
      // Prepare stats object with team name, conference, and win/loss data
      const statsWithWinLoss = {
        ...stats,
        teamName: team.name,
        conference: team.conference || 'Unknown',
        wins,
        losses,
        record: `${wins}-${losses}`,
        winPct: (wins + losses) > 0 ? parseFloat((wins / (wins + losses)).toFixed(3)) : 0,
      };
      
      // Use the shared calculateAdvancedStats function to compute all metrics
      return calculateAdvancedStats(statsWithWinLoss);
    });
}
