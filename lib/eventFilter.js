/**
 * Event filtering service for custom split combinations
 * Processes events array to calculate stats with multiple filters
 */

/**
 * Check if a stat key represents a percentage stat
 * @param {string} key - The stat key to check
 * @returns {boolean} True if it's a percentage stat
 */
function isPercentageStat(key) {
  const lowerKey = key.toLowerCase();
  return lowerKey.includes('pct') || 
         /fg[pm]?t/.test(lowerKey) ||  // fgt, fgpt, fgmt
         /ft[pm]?t/.test(lowerKey) ||  // ftt, ftpt, ftmt
         lowerKey.match(/^(fg|ft)\d?pt/);  // fg3pt, ftpt, etc.
}

/**
 * Filter events based on multiple criteria
 * @param {Array} events - Array of game events
 * @param {Object} filters - Filter criteria
 * @param {string} teamName - Team name for win/loss filtering
 * @returns {Array} Filtered events
 */
export function filterEvents(events, filters = {}, teamName = null) {
  if (!events || events.length === 0) return [];
  
  return events.filter(event => {
    // Skip if event data is missing
    if (!event || !event.event) return false;
    
    const { home, conference, division, national, neutralSite, opponent, result, eventType } = event.event;
    
    // Skip games that haven't been played yet (no result)
    if (!result || !result.winner || !result.winner.name) return false;
    
    // Skip pre-season/exhibition games (exclude by default)
    if (eventType && (eventType.code === 'preSeason' || eventType.code === 'exhibition')) return false;
    
    // Also skip games where statsCount is explicitly false
    if (eventType && eventType.statsCount === false) return false;
    
    // IMPORTANT: Only count as played if stats are available and contain at least one real value
    // This prevents games with a result but no stats data from being counted in GP/PPG calculations
    if (!event.stats || typeof event.stats !== 'object' || Object.keys(event.stats).length === 0) {
      return false;
    }
    // Check that at least one stat value is not null/empty
    const hasRealStat = Object.values(event.stats).some(
      v => v !== null && v !== undefined && v !== ''
    );
    if (!hasRealStat) {
      return false;
    }
    
    // Location filter (home/away/neutral)
    if (filters.location) {
      if (filters.location === 'home' && !home) return false;
      if (filters.location === 'away' && (home || neutralSite)) return false;
      if (filters.location === 'neutral' && !neutralSite) return false;
    }
    
    // Competition level filter
    if (filters.competition) {
      if (filters.competition === 'conference' && !conference) return false;
      if (filters.competition === 'division' && !division) return false;
      if (filters.competition === 'national' && !national) return false;
    }
    
    // Win/Loss filter - check if this team won or lost
    if (filters.winLoss && teamName) {
      const winnerName = result?.winner?.name;
      const isWin = winnerName === teamName;
      if (filters.winLoss === 'wins' && !isWin) return false;
      if (filters.winLoss === 'losses' && isWin) return false;
    }
    
    // Month filter
    if (filters.month) {
      const gameDate = new Date(event.event.date);
      const gameMonth = gameDate.getMonth(); // 0-11
      const monthMap = {
        'november': 10, 'december': 11, 'january': 0, 
        'february': 1, 'march': 2, 'april': 3
      };
      if (monthMap[filters.month] !== gameMonth) return false;
    }
    
    return true;
  });
}

/**
 * Aggregate stats from filtered events
 * @param {Array} events - Filtered events
 * @param {string} teamName - The team's school name for win/loss determination
 * @returns {Object} Aggregated stats
 */
export function aggregateStats(events, teamName) {
  if (!events || events.length === 0) {
    return null;
  }
  
  // Initialize aggregated stats
  const aggregated = {
    gp: events.length,
    wins: 0,
    losses: 0
  };
  
  // Sum up all stat fields
  events.forEach(event => {
    const stats = event.stats || {};
    
    // Count wins/losses by comparing winner name with team name
    // Only count if there's a result (skip future/cancelled games)
    if (event.event && event.event.result && event.event.result.winner && event.event.result.winner.name) {
      const winnerName = event.event.result.winner.name;
      if (winnerName === teamName) {
        aggregated.wins++;
      } else {
        aggregated.losses++;
      }
    }
    
    // Aggregate all numeric stats
    // IMPORTANT: Two-pass approach to avoid double-counting
    // Pass 1: Parse made-attempted format (e.g., "fgp" = "36-67" creates fgm=36, fga=67)
    // Pass 2: Add regular numeric values, but skip if already created in Pass 1
    
    const statsKeys = Object.keys(stats);
    
    // Pass 1: Handle made-attempted format
    statsKeys.forEach(key => {
      if (key === 'gp' || key === 'gs' || key === 'wins' || key === 'losses') return;
      if (key.endsWith('pg') || key.endsWith('pgopp') || key.endsWith('pm') || key.endsWith('pmopp')) return;
      
      const value = stats[key];
      if (typeof value === 'string' && value.includes('-')) {
        const [made, attempted] = value.split('-').map(v => parseFloat(v.replace(',', '')));
        if (!isNaN(made) && !isNaN(attempted)) {
          const madeKey = key.replace(/^([a-z]+)p/, '$1m');
          const attemptedKey = key.replace(/^([a-z]+)p/, '$1a');
          aggregated[madeKey] = (aggregated[madeKey] || 0) + made;
          aggregated[attemptedKey] = (aggregated[attemptedKey] || 0) + attempted;
          aggregated[`__parsed_${madeKey}`] = true;
          aggregated[`__parsed_${attemptedKey}`] = true;
        }
      }
    });
    
    // Pass 2: Handle regular numeric values
    statsKeys.forEach(key => {
      if (key === 'gp' || key === 'gs' || key === 'wins' || key === 'losses') return;
      if (key.endsWith('pg') || key.endsWith('pgopp') || key.endsWith('pm') || key.endsWith('pmopp')) return;
      
      // IMPORTANT: Skip percentage stats - they should be calculated from totals, not summed
      if (isPercentageStat(key)) {
        return;
      }
      
      const value = stats[key];
      if (typeof value === 'string' && !value.includes('-')) {
        // Skip if already created from made-attempted format
        if (aggregated[`__parsed_${key}`]) return;
        
        const numValue = parseFloat(value.replace(',', ''));
        if (!isNaN(numValue)) {
          aggregated[key] = (aggregated[key] || 0) + numValue;
        }
      }
    });
  });
  
  // Calculate per-game averages
  const perGameStats = {};
  
  // IMPORTANT: The event.stats contains BOTH totals (fga) and per-game stats (fgapg)
  // We need to skip the per-game stats during aggregation since they're just the same values
  // For each key, check if we also have a 'pg' version
  Object.keys(aggregated).forEach(key => {
    // Skip internal tracking keys
    if (key.startsWith('__parsed_')) {
      return;
    }
    
    if (key !== 'gp' && key !== 'wins' && key !== 'losses') {
      // Check if this key ends with 'pg' or 'pgopp'
      const isPerGameStat = key.endsWith('pg') || key.endsWith('pgopp');
      
      if (!isPerGameStat) {
        // It's a total stat - store it and calculate per-game
        perGameStats[key] = aggregated[key];
        
        // Don't create per-game versions of percentage stats
        if (!isPercentageStat(key)) {
          // For opponent stats (ending in 'opp'), insert 'pg' before 'opp'
          // e.g., ptsopp -> ptspgopp (not ptsopppg)
          if (key.endsWith('opp')) {
            const baseStat = key.slice(0, -3); // Remove 'opp'
            perGameStats[`${baseStat}pgopp`] = aggregated[key] / aggregated.gp;
          } else {
            // Regular stats: just append 'pg'
            perGameStats[`${key}pg`] = aggregated[key] / aggregated.gp;
          }
        }
      }
      // If it IS a per-game stat, skip it - we'll calculate it from the total
    } else {
      perGameStats[key] = aggregated[key];
    }
  });
  
  return perGameStats;
}

/**
 * Get stats for a team with custom filters
 * @param {Object} teamData - Full team data from API
 * @param {Object} filters - Filter criteria
 * @returns {Object} Calculated stats
 */
export function getFilteredTeamStats(teamData, filters = {}) {
  const teamName = teamData.attributes?.school_name || 'Unknown';
  const filteredEvents = filterEvents(teamData.events, filters, teamName);
  const aggregated = aggregateStats(filteredEvents, teamName);
  
  if (!aggregated) {
    return null;
  }
  
  // Add team name and win percentage
  aggregated.teamName = teamName;
  aggregated.winPct = (aggregated.wins + aggregated.losses) > 0 
    ? parseFloat((aggregated.wins / (aggregated.wins + aggregated.losses)).toFixed(3))
    : 0;
  
  return aggregated;
}
