// Express server to serve conference stats data
import express from 'express';
import cors from 'cors';
import { TEAMS } from './config/teams.js';
import { fetchAllTeams } from './lib/dataFetcher.js';
import { calculateCustomStats, calculateAdvancedStats } from './lib/calculator.js';
import { COLUMN_LABELS } from './lib/columnLabels.js';
import { getFilteredTeamStats } from './lib/eventFilter.js';

const app = express();
const PORT = process.env.PORT || 3000;

// Enable CORS for frontend access
app.use(cors());
app.use(express.json());

// Serve static files (our frontend)
app.use(express.static('public'));

// Cache for team data (refresh every 5 minutes)
let cachedTeamsData = null;
let cacheTimestamp = null;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

async function getCachedTeamsData() {
  const now = Date.now();
  
  if (!cachedTeamsData || !cacheTimestamp || (now - cacheTimestamp) > CACHE_DURATION) {
    console.log('📦 Fetching fresh data from all teams...');
    cachedTeamsData = await fetchAllTeams(TEAMS);
    cacheTimestamp = now;
    console.log(`✅ Cached ${cachedTeamsData.length} teams`);
  } else {
    console.log('⚡ Using cached data');
  }
  
  return cachedTeamsData;
}

// API endpoint to get all team stats
app.get('/api/stats', async (req, res) => {
  try {
    const splitType = req.query.split || 'conference';
    const conference = req.query.conference;
    const useCustomFilters = req.query.location || req.query.competition || req.query.winLoss || req.query.month;
    
    console.log(`\n🔍 Request: split=${splitType}, conference=${conference || 'all'}, filters=${useCustomFilters ? 'yes' : 'no'}`);
    const allTeamsData = await getCachedTeamsData();
    
    // Filter by conference if specified
    let teamsData = allTeamsData;
    if (conference && conference !== 'all') {
      teamsData = allTeamsData.filter(team => team.conference === conference);
      console.log(`📊 Filtered to ${teamsData.length} teams in ${conference}`);
    }
    
    let statistics;
    let filterInfo = { split: splitType };
    if (conference) {
      filterInfo.conference = conference;
    }
    
    // Use custom filtering if any filter params are provided
    if (useCustomFilters) {
      const filters = {
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
app.post('/api/refresh', async (req, res) => {
  try {
    console.log('🔄 Force refreshing cache...');
    cachedTeamsData = null;
    cacheTimestamp = null;
    await getCachedTeamsData();
    res.json({ 
      success: true, 
      message: 'Cache refreshed',
      timestamp: new Date().toISOString() 
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
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
