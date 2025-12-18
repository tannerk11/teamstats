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

// API endpoint to get all team stats
app.get('/api/stats', async (req, res) => {
  try {
    const splitType = req.query.split || 'conference';
    const useCustomFilters = req.query.location || req.query.competition || req.query.winLoss || req.query.month;
    
    console.log(`Fetching fresh data (split: ${splitType})...`);
    const teamsData = await fetchAllTeams(TEAMS);
    
    let statistics;
    let filterInfo = { split: splitType };
    
    // Use custom filtering if any filter params are provided
    if (useCustomFilters) {
      const filters = {
        location: req.query.location,
        competition: req.query.competition,
        winLoss: req.query.winLoss,
        month: req.query.month
      };
      
      console.log('Applying custom filters:', filters);
      
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
    } else {
      // Use pre-calculated splits
      statistics = calculateCustomStats(teamsData, splitType);
      filterInfo = { split: splitType };
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

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
  console.log(`📊 API available at http://localhost:${PORT}/api/stats`);
});
