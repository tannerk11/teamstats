// Express server to serve conference stats data
import express from 'express';
import cors from 'cors';
import { TEAMS_BY_SEASON, getTeamsBySeason } from './config/teams.js';
import { PLAYER_DATA_URLS } from './config/playerData.js';
import { SEASONS, DEFAULT_SEASON } from './config/seasons.js';
import { fetchAllTeams } from './lib/dataFetcher.js';
import { calculateCustomStats, calculateAdvancedStats } from './lib/calculator.js';
import { COLUMN_LABELS } from './lib/columnLabels.js';
import { getFilteredTeamStats, filterEvents } from './lib/eventFilter.js';
import { fetchAllPlayerData, filterPlayers, getFilterOptions } from './lib/playerDataFetcher.js';

const app = express();
const PORT = process.env.PORT || 3000;

// Enable CORS for frontend access
app.use(cors());
app.use(express.json());

// Serve static files (our frontend)
app.use(express.static('public'));

// Cache for team data by season (refresh every 5 minutes)
const teamDataCache = new Map(); // season -> { data, timestamp }
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

// Cache for player data by season (refresh every 5 minutes)
const playerDataCache = new Map(); // season -> { data, timestamp }

async function getCachedTeamsData(season = DEFAULT_SEASON) {
  const now = Date.now();
  const cached = teamDataCache.get(season);
  
  if (!cached || (now - cached.timestamp) > CACHE_DURATION) {
    console.log(`📦 Fetching fresh data for ${season} season...`);
    const teams = getTeamsBySeason(season);
    const data = await fetchAllTeams(teams);
    teamDataCache.set(season, { data, timestamp: now });
    console.log(`✅ Cached ${data.length} teams for ${season}`);
    return data;
  } else {
    console.log(`⚡ Using cached data for ${season}`);
    return cached.data;
  }
}

async function getCachedPlayerData(season = DEFAULT_SEASON) {
  const now = Date.now();
  const cached = playerDataCache.get(season);
  
  if (!cached || (now - cached.timestamp) > CACHE_DURATION) {
    console.log(`📦 Fetching fresh player data for ${season} season...`);
    const data = await fetchAllPlayerData(PLAYER_DATA_URLS);
    playerDataCache.set(season, { data, timestamp: now });
    console.log(`✅ Cached ${data.length} players for ${season}`);
    return data;
  } else {
    console.log(`⚡ Using cached player data for ${season}`);
    return cached.data;
  }
}

/**
 * Calculate Strength of Schedule adjustments using iterative method (KenPom-style)
 * Runs multiple iterations to account for opponent's opponent strength
 * @param {Array} statistics - Array of team statistics objects
 * @param {Array} teamsData - Array of team data with events
 * @param {string} splitType - Type of split (conference, overall, etc.)
 * @param {Object} filters - Optional filters applied to events
 * @returns {Array} statistics with SOS fields added
 */
function calculateStrengthOfScheduleAdditive(statistics, teamsData, splitType, filters = null) {
  const ITERATIONS = 5; // Number of iterations for convergence (KenPom uses similar)
  const DAMPENING_FACTOR = 0.4; // How much schedule strength affects ratings
  
  // Calculate league averages (these stay constant)
  const leagueAvgORTG = statistics.reduce((sum, t) => sum + (t.offensiveRating || 0), 0) / statistics.length;
  const leagueAvgDRTG = statistics.reduce((sum, t) => sum + (t.defensiveRating || 0), 0) / statistics.length;
  
  console.log(`📊 League Averages: ORTG=${leagueAvgORTG.toFixed(1)}, DRTG=${leagueAvgDRTG.toFixed(1)}`);
  
  // Build opponent list for each team (do this once, reuse in iterations)
  const teamOpponents = new Map();
  const teamRawRatings = new Map();
  
  // Create a normalized name lookup for fuzzy matching
  // This handles cases like "Montana Tech (MT)" vs "Montana Tech"
  const normalizedNameMap = new Map();
  
  statistics.forEach(team => {
    // Store raw ratings by exact name
    teamRawRatings.set(team.teamName, {
      ortg: team.offensiveRating || 0,
      drtg: team.defensiveRating || 0,
      nrtg: team.netRating || 0
    });
    
    // Also store by normalized name (without state abbreviation)
    const baseName = team.teamName.replace(/\s*\([A-Za-z.]+\)\s*$/, '').trim();
    normalizedNameMap.set(baseName.toLowerCase(), team.teamName);
    normalizedNameMap.set(team.teamName.toLowerCase(), team.teamName);
  });
  
  // Helper function to find matching team name
  function findMatchingTeam(oppName) {
    if (!oppName) return null;
    
    // Exact match
    if (teamRawRatings.has(oppName)) return oppName;
    
    // Try lowercase exact match
    const lowerOppName = oppName.toLowerCase();
    if (normalizedNameMap.has(lowerOppName)) {
      return normalizedNameMap.get(lowerOppName);
    }
    
    // Try without state abbreviation
    const baseName = oppName.replace(/\s*\([A-Za-z.]+\)\s*$/, '').trim().toLowerCase();
    if (normalizedNameMap.has(baseName)) {
      return normalizedNameMap.get(baseName);
    }
    
    return null;
  }
  
  statistics.forEach(team => {
    // Find opponents
    const teamData = teamsData.find(t => {
      const name = t.data?.attributes?.school_name || t.name;
      return name === team.teamName;
    });
    
    if (!teamData || !teamData.data || !teamData.data.events) {
      teamOpponents.set(team.teamName, []);
      return;
    }
    
    const events = teamData.data.events || [];
    
    // Build filter object for filterEvents
    const eventFilters = { ...filters };
    if (splitType === 'conference') {
      eventFilters.competition = 'conference';
    } else if (splitType === 'division') {
      eventFilters.competition = 'division';
    } else if (splitType === 'national') {
      eventFilters.competition = 'national';
    }
    
    // Get filtered events and extract opponent names
    const filteredEvents = filterEvents(events, eventFilters, team.teamName);
    const allOpponentNames = filteredEvents.map(event => event.event?.opponent?.name).filter(Boolean);
    
    // Use fuzzy matching to find opponents in our ratings
    const teamNamesSet = new Set(teamRawRatings.keys());
    const matchedOpponents = allOpponentNames
      .map(name => findMatchingTeam(name, teamNamesSet))
      .filter(Boolean);
    
    // Debug: log first team's opponent matching
    if (team.teamName === 'Eastern Oregon' || team.teamName === 'Bushnell (OR)') {
      console.log(`  ${team.teamName}: ${allOpponentNames.length} opponents in events, ${matchedOpponents.length} matched in ratings`);
      if (matchedOpponents.length === 0 && allOpponentNames.length > 0) {
        console.log(`    Sample unmatched: ${allOpponentNames.slice(0, 3).join(', ')}`);
        console.log(`    Sample team names: ${Array.from(teamRawRatings.keys()).slice(0, 3).join(', ')}`);
      } else if (matchedOpponents.length > 0) {
        console.log(`    Sample matched: ${matchedOpponents.slice(0, 3).join(', ')}`);
      }
    }
    
    teamOpponents.set(team.teamName, matchedOpponents);
  });
  
  // Initialize adjusted ratings with raw ratings
  let currentAdjusted = new Map();
  statistics.forEach(team => {
    currentAdjusted.set(team.teamName, {
      adjORTG: team.offensiveRating || 0,
      adjDRTG: team.defensiveRating || 0,
      adjNTRG: team.netRating || 0
    });
  });
  
  // Run iterative adjustment
  for (let iteration = 0; iteration < ITERATIONS; iteration++) {
    const newAdjusted = new Map();
    
    statistics.forEach(team => {
      const opponents = teamOpponents.get(team.teamName) || [];
      const rawRatings = teamRawRatings.get(team.teamName);
      
      if (opponents.length === 0) {
        // No opponents, keep raw ratings
        newAdjusted.set(team.teamName, {
          adjORTG: rawRatings.ortg,
          adjDRTG: rawRatings.drtg,
          adjNTRG: rawRatings.nrtg,
          osos: leagueAvgORTG,
          dsos: leagueAvgDRTG,
          nsos: 0
        });
        return;
      }
      
      // Calculate opponent averages using CURRENT ADJUSTED ratings
      let totalOppAdjORTG = 0;
      let totalOppAdjDRTG = 0;
      
      opponents.forEach(oppName => {
        const oppAdj = currentAdjusted.get(oppName);
        if (oppAdj) {
          totalOppAdjORTG += oppAdj.adjORTG;
          totalOppAdjDRTG += oppAdj.adjDRTG;
        }
      });
      
      const avgOppAdjORTG = totalOppAdjORTG / opponents.length;
      const avgOppAdjDRTG = totalOppAdjDRTG / opponents.length;
      
      // Calculate schedule strength based on adjusted opponent ratings
      // For offense: tough defenses (low adjDRTG) = positive strength
      const offensiveScheduleStrength = leagueAvgDRTG - avgOppAdjDRTG;
      // For defense: tough offenses (high adjORTG) = positive strength  
      const defensiveScheduleStrength = avgOppAdjORTG - leagueAvgORTG;
      
      // Apply adjustment to RAW ratings (not cumulative)
      const adjORTG = rawRatings.ortg + (DAMPENING_FACTOR * offensiveScheduleStrength);
      const adjDRTG = rawRatings.drtg - (DAMPENING_FACTOR * defensiveScheduleStrength);
      const adjNTRG = adjORTG - adjDRTG;
      
      newAdjusted.set(team.teamName, {
        adjORTG,
        adjDRTG,
        adjNTRG,
        osos: avgOppAdjORTG,
        dsos: avgOppAdjDRTG,
        nsos: avgOppAdjORTG - avgOppAdjDRTG
      });
    });
    
    // Update current adjusted for next iteration
    currentAdjusted = newAdjusted;
    
    // Log convergence progress
    if (iteration === 0 || iteration === ITERATIONS - 1) {
      const sample = statistics[0];
      const adj = currentAdjusted.get(sample?.teamName);
      if (adj) {
        console.log(`  Iteration ${iteration + 1}: ${sample.teamName} adjNTRG=${adj.adjNTRG.toFixed(2)}`);
      }
    }
  }
  
  console.log(`✅ Completed ${ITERATIONS} iterations for SOS adjustment`);
  
  // Apply final adjusted values to statistics
  return statistics.map(team => {
    const adj = currentAdjusted.get(team.teamName);
    if (adj) {
      team.adjORTG = adj.adjORTG;
      team.adjDRTG = adj.adjDRTG;
      team.adjNTRG = adj.adjNTRG;
      team.osos = adj.osos;
      team.dsos = adj.dsos;
      team.nsos = adj.nsos;
    } else {
      team.adjORTG = team.offensiveRating;
      team.adjDRTG = team.defensiveRating;
      team.adjNTRG = team.netRating;
      team.osos = leagueAvgORTG;
      team.dsos = leagueAvgDRTG;
      team.nsos = 0;
    }
    return team;
  });
}

// OLD FUNCTION - KEEP FOR REFERENCE/ROLLBACK
// Calculate Defensive and Offensive Strength of Schedule (Multiplicative method)
function calculateStrengthOfScheduleMultiplicative(statistics, teamsData, splitType, filters = null) {
  // Create a lookup map of team name to their ratings
  const teamRatingsMap = new Map();
  statistics.forEach(team => {
    teamRatingsMap.set(team.teamName, {
      drtg: team.defensiveRating || 0,
      ortg: team.offensiveRating || 0
    });
  });
  
  // For each team, calculate DSOS and OSOS
  return statistics.map(team => {
    const teamData = teamsData.find(t => {
      const name = t.data?.attributes?.school_name || t.name;
      return name === team.teamName;
    });
    
    if (!teamData || !teamData.data || !teamData.data.events) {
      team.dsos = 0;
      team.osos = 0;
      return team;
    }
    
    const events = teamData.data.events || [];
    
    // Build filter object for filterEvents
    // Convert splitType to competition filter (conference/division/national splits)
    const eventFilters = { ...filters };
    if (splitType === 'conference') {
      eventFilters.competition = 'conference';
    } else if (splitType === 'division') {
      eventFilters.competition = 'division';
    } else if (splitType === 'national') {
      eventFilters.competition = 'national';
    }
    
    // Use shared filterEvents function (handles exhibitions, pre-season, no stats, no results)
    const filteredEvents = filterEvents(events, eventFilters, team.teamName);
    
    // Calculate DSOS and OSOS from opponent ratings
    let totalDRTG = 0;
    let totalORTG = 0;
    let gamesPlayed = 0;
    
    filteredEvents.forEach(event => {
      const opponentName = event.event?.opponent?.name;
      if (opponentName && teamRatingsMap.has(opponentName)) {
        const opponentRatings = teamRatingsMap.get(opponentName);
        totalDRTG += opponentRatings.drtg;
        totalORTG += opponentRatings.ortg;
        gamesPlayed++;
      }
    });
    
    team.dsos = gamesPlayed > 0 ? totalDRTG / gamesPlayed : 0;
    team.osos = gamesPlayed > 0 ? totalORTG / gamesPlayed : 0;
    team.nsos = team.osos - team.dsos; // Net Strength of Schedule
    
    return team;
  });
}

// API endpoint to get all team stats
app.get('/api/stats', async (req, res) => {
  try {
    const season = req.query.season || '2025-26'; // Default to current season
    const splitType = req.query.split || 'conference';
    const conference = req.query.conference;
    const useCustomFilters = req.query.location || req.query.competition || req.query.winLoss || req.query.month;
    
    console.log(`\n🔍 Request: season=${season}, split=${splitType}, conference=${conference || 'all'}, filters=${useCustomFilters ? 'yes' : 'no'}`);
    const allTeamsData = await getCachedTeamsData(season);
    
    // Filter by conference if specified
    let teamsData = allTeamsData;
    if (conference && conference !== 'all') {
      teamsData = allTeamsData.filter(team => team.conference === conference);
      console.log(`📊 Filtered to ${teamsData.length} teams in ${conference}`);
    }
    
    let statistics;
    let filterInfo = { split: splitType };
    let filters = null;
    
    if (conference) {
      filterInfo.conference = conference;
    }
    
    // Use custom filtering if any filter params are provided
    if (useCustomFilters) {
      filters = {
        location: req.query.location,
        competition: req.query.competition,
        winLoss: req.query.winLoss,
        month: req.query.month
      };
      
      console.log('🔧 Applying custom filters:', filters);
      
      // Process each team with filters and get aggregated stats
      statistics = teamsData
        .filter(team => team.success && team.data)
        .map(team => {
          const filteredStats = getFilteredTeamStats(team.data, filters);
          if (!filteredStats) return null;
          
          // Add conference to stats before calculating advanced metrics
          filteredStats.conference = team.conference || 'Unknown';
          
          // Calculate advanced stats directly from the aggregated raw stats
          return calculateAdvancedStats(filteredStats);
        }).filter(Boolean);
      
      filterInfo = { customFilters: filters };
      console.log(`✅ Processed ${statistics.length} teams with custom filters`);
    } else {
      // Use pre-calculated splits
      statistics = calculateCustomStats(teamsData, splitType);
      filterInfo = { split: splitType };
      console.log(`✅ Calculated ${statistics.length} teams with ${splitType} split`);
    }
    
    // Calculate Strength of Schedule (DSOS, OSOS, and adjusted ratings)
    statistics = calculateStrengthOfScheduleAdditive(statistics, teamsData, splitType, filters);
    
    // Log sample adjustments for verification
    console.log(`\n📊 Sample SOS Adjustments (first 3 teams):`);
    statistics.slice(0, 3).forEach(team => {
      console.log(`  ${team.teamName}:`);
      console.log(`    Raw: ORTG=${team.offensiveRating?.toFixed(1)}, DRTG=${team.defensiveRating?.toFixed(1)}, NET=${team.netRating?.toFixed(1)}`);
      console.log(`    Adj: ORTG=${team.adjORTG?.toFixed(1)}, DRTG=${team.adjDRTG?.toFixed(1)}, NET=${team.adjNTRG?.toFixed(1)}`);
      console.log(`    SOS: opp ORTG=${team.osos?.toFixed(1)}, opp DRTG=${team.dsos?.toFixed(1)}`);
    });

    // Remove duplicate teams (keep first occurrence)
    const seenTeams = new Set();
    statistics = statistics.filter(team => {
      if (seenTeams.has(team.teamName)) {
        return false;
      }
      seenTeams.add(team.teamName);
      return true;
    });
    console.log(`✅ Deduplicated to ${statistics.length} unique teams`);
    
    // Set cache-control headers to prevent browser caching
    res.set('Cache-Control', 'no-store, no-cache, must-revalidate, private');
    res.set('Pragma', 'no-cache');
    res.set('Expires', '0');
    
    res.json({
      success: true,
      lastUpdated: new Date().toISOString(),
      data: statistics,
      columnLabels: COLUMN_LABELS,
      ...filterInfo
    });
  } catch (error) {
    console.error('Error fetching stats:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Force refresh cache endpoint
// API endpoint to get available seasons
app.get('/api/seasons', (req, res) => {
  res.json({
    seasons: SEASONS,
    defaultSeason: DEFAULT_SEASON,
    teamsBySeason: TEAMS_BY_SEASON
  });
});

// API endpoint to get individual team data
app.get('/api/team', async (req, res) => {
  try {
    const { url } = req.query;
    
    if (!url) {
      return res.status(400).json({ error: 'Team URL is required' });
    }
    
    console.log(`🏀 Fetching team data from: ${url}`);
    
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to fetch team data: ${response.status}`);
    }
    
    const data = await response.json();
    res.json(data);
    
  } catch (error) {
    console.error('Error fetching team data:', error);
    res.status(500).json({ error: 'Failed to fetch team data' });
  }
});

app.post('/api/refresh', async (req, res) => {
  try {
    console.log('🔄 Force refreshing cache for all seasons...');
    teamDataCache.clear();
    playerDataCache.clear();
    
    // Refresh all seasons
    for (const season of SEASONS) {
      await getCachedTeamsData(season.id);
      await getCachedPlayerData(season.id);
    }
    
    res.json({ 
      success: true, 
      message: 'Cache refreshed for all seasons',
      timestamp: new Date().toISOString() 
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// API endpoint to get player stats
app.get('/api/players', async (req, res) => {
  try {
    const season = req.query.season || DEFAULT_SEASON;
    const statType = req.query.statType || 'stats'; // 'stats', 'statsConference', or 'statsNational'
    const conferenceFilter = req.query.conference;
    const teamFilter = req.query.team;
    
    console.log(`\n🏀 Player Request: season=${season}, statType=${statType}, conference=${conferenceFilter || 'all'}, team=${teamFilter || 'all'}`);
    
    const allPlayers = await getCachedPlayerData(season);
    
    // Apply filters
    const filters = {
      conference: conferenceFilter,
      team: teamFilter
    };
    
    const filteredPlayers = filterPlayers(allPlayers, filters);
    console.log(`✅ Returning ${filteredPlayers.length} players`);
    
    // Get filter options for dropdowns
    const filterOptions = getFilterOptions(allPlayers);
    
    // Format player data with selected stat type
    const players = filteredPlayers.map(player => {
      const stats = player[statType] || player.stats || {};
      
      return {
        fullName: player.fullName,
        firstName: player.firstName,
        lastName: player.lastName,
        team: player.team,
        conference: player.conference,
        position: player.position,
        year: player.year,
        uniform: player.uniform,
        gp: stats.gp || 0,
        // Scoring
        pts: stats.pts || 0,
        ptspg: stats.ptspg || 0,
        // Shooting
        fgm: stats.fgm || 0,
        fga: stats.fga || 0,
        fgpt: stats.fgpt || 0,
        fgm3: stats.fgm3 || 0,
        fga3: stats.fga3 || 0,
        fgpt3: stats.fgpt3 || 0,
        ftm: stats.ftm || 0,
        fta: stats.fta || 0,
        ftpt: stats.ftpt || 0,
        // Rebounds
        treb: stats.treb || 0,
        trebpg: stats.trebpg || 0,
        oreb: stats.oreb || 0,
        dreb: stats.dreb || 0,
        // Assists & Turnovers
        ast: stats.ast || 0,
        astpg: stats.astpg || 0,
        to: stats.to || 0,
        topg: stats.topg || 0,
        ato: stats.ato || 0,
        // Defense
        stl: stats.stl || 0,
        stlpg: stats.stlpg || 0,
        blk: stats.blk || 0,
        blkpg: stats.blkpg || 0,
        // Other
        pf: stats.pf || 0,
        min: stats.min || 0,
        minpg: stats.minpg || 0
      };
    });
    
    // Set cache-control headers
    res.set('Cache-Control', 'no-store, no-cache, must-revalidate, private');
    res.set('Pragma', 'no-cache');
    res.set('Expires', '0');
    
    res.json({
      success: true,
      lastUpdated: new Date().toISOString(),
      data: players,
      filterOptions: filterOptions,
      statType: statType
    });
  } catch (error) {
    console.error('Error fetching player stats:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    cached: cachedTeamsData ? true : false,
    cacheAge: cacheTimestamp ? Math.floor((Date.now() - cacheTimestamp) / 1000) : null
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
  console.log(`📊 API available at http://localhost:${PORT}/api/stats`);
  console.log(`🔄 Refresh cache: POST http://localhost:${PORT}/api/refresh`);
  console.log(`💾 Cache duration: ${CACHE_DURATION / 1000 / 60} minutes`);
});
