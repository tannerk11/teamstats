// Express server to serve conference stats data
import express from 'express';
import cors from 'cors';
import { TEAMS_BY_SEASON, getTeamsBySeason } from './config/teams.js';
import { PLAYER_DATA_URLS } from './config/playerData.js';
import { SEASONS, DEFAULT_SEASON } from './config/seasons.js';
import { fetchAllTeams } from './lib/dataFetcher.js';
import { calculateCustomStats, calculateAdvancedStats } from './lib/calculator.js';
import { COLUMN_LABELS } from './lib/columnLabels.js';
import { getFilteredTeamStats } from './lib/eventFilter.js';
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

// Calculate Defensive and Offensive Strength of Schedule
function calculateStrengthOfSchedule(statistics, teamsData, splitType, filters = null) {
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
    
    // Filter events based on split type and filters (same as used for stats)
    const filteredEvents = events.filter(event => {
      // Skip exhibition and pre-season games
      const eventType = event.event?.eventType;
      if (eventType && (eventType.code === 'preSeason' || eventType.code === 'exhibition')) {
        return false;
      }
      if (eventType && eventType.statsCount === false) {
        return false;
      }
      
      // Skip if no result
      if (!event.event?.result?.winner?.name) {
        return false;
      }
      
      // Apply split type filters
      if (splitType === 'conference' && !event.event?.conference) {
        return false;
      }
      if (splitType === 'division' && !event.event?.division) {
        return false;
      }
      if (splitType === 'national' && !event.event?.national) {
        return false;
      }
      
      // Apply custom filters if provided
      if (filters) {
        const { home, neutralSite, conference, division, national, opponent, result } = event.event;
        
        // Location filter
        if (filters.location) {
          if (filters.location === 'home' && !home) return false;
          if (filters.location === 'away' && (home || neutralSite)) return false;
          if (filters.location === 'neutral' && !neutralSite) return false;
        }
        
        // Competition filter
        if (filters.competition) {
          if (filters.competition === 'conference' && !conference) return false;
          if (filters.competition === 'nonconference' && conference) return false;
          if (filters.competition === 'division' && !division) return false;
          if (filters.competition === 'national' && !national) return false;
        }
        
        // Win/Loss filter
        if (filters.winLoss) {
          const isWin = result?.winner?.name === team.teamName;
          if (filters.winLoss === 'wins' && !isWin) return false;
          if (filters.winLoss === 'losses' && isWin) return false;
        }
        
        // Month filter
        if (filters.month && event.event.date) {
          const eventDate = new Date(event.event.date);
          const eventMonth = eventDate.getMonth() + 1; // 1-12
          if (parseInt(filters.month) !== eventMonth) return false;
        }
      }
      
      return true;
    });
    
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
    
    // Calculate Strength of Schedule (DSOS and OSOS)
    statistics = calculateStrengthOfSchedule(statistics, teamsData, splitType, filters);
    
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
