// Express server to serve conference stats data
import express from 'express';
import cors from 'cors';
import { TEAMS } from './config/teams.js';
import { fetchAllTeams } from './lib/dataFetcher.js';
import { calculateCustomStats } from './lib/calculator.js';
import { COLUMN_LABELS } from './lib/columnLabels.js';

const app = express();
const PORT = 3000;

// Enable CORS for frontend access
app.use(cors());
app.use(express.json());

// Serve static files (our frontend)
app.use(express.static('public'));

// API endpoint to get all team stats
app.get('/api/stats', async (req, res) => {
  try {
    const splitType = req.query.split || 'conference';
    console.log(`Fetching fresh data (split: ${splitType})...`);
    const teamsData = await fetchAllTeams(TEAMS);
    const statistics = calculateCustomStats(teamsData, splitType);
    
    res.json({
      success: true,
      lastUpdated: new Date().toISOString(),
      data: statistics,
      columnLabels: COLUMN_LABELS,
      split: splitType
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
