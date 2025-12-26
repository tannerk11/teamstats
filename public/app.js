// Frontend JavaScript for sortable table
const API_URL = window.location.hostname === 'localhost' 
  ? 'http://localhost:3000/api/stats'
  : '/api/stats'; // Use relative URL in production

const SEASONS_API_URL = window.location.hostname === 'localhost' 
  ? 'http://localhost:3000/api/seasons'
  : '/api/seasons';

let statsData = [];
let allStatsData = []; // Store unfiltered data
let columnLabels = {};
let currentSort = { column: 'netRatingRank', direction: 'asc' };
let currentColumns = []; // Store the current column order
let statsChart = null; // Store chart instance
let scatterChart = null; // Store scatter chart instance
let reboundChart = null; // Store rebound scatter chart instance
let adjRatingChart = null; // Store AdjDRTG vs AdjORTG chart instance
let netRatingComparisonChart = null; // Store AdjNRTG vs NRTG chart instance
let paceChart = null; // Store Pace vs Net Rating chart instance
let transitionChart = null; // Store Steals vs Fast Break Points chart instance
let assistTOChart = null; // Store Assist/TO Ratio vs Win% chart instance
let orebChart = null; // Store OREB% vs 2nd Chance PPG chart instance
let currentChartStat = 'netRating'; // Current stat to display
let currentConference = ''; // Current conference filter
let currentSeason = ''; // Current season filter

// Load available seasons and populate dropdown
async function loadSeasons() {
  try {
    const response = await fetch(SEASONS_API_URL);
    const result = await response.json();
    
    const seasonFilter = document.getElementById('seasonFilter');
    seasonFilter.innerHTML = '';
    
    result.seasons.forEach(season => {
      const option = document.createElement('option');
      option.value = season.id;
      option.textContent = season.label;
      if (season.isCurrent) {
        option.selected = true;
        currentSeason = season.id;
      }
      seasonFilter.appendChild(option);
    });
    
    // Add change listener
    seasonFilter.addEventListener('change', (e) => {
      currentSeason = e.target.value;
      console.log(`🔄 Season changed to: ${currentSeason}`);
      applyFilters(); // Reload data for new season
    });
    
    console.log(`✅ Loaded ${result.seasons.length} seasons, current: ${currentSeason}`);
  } catch (error) {
    console.error('Error loading seasons:', error);
    // Set default season if loading fails
    currentSeason = '2025-26';
  }
}

// Fetch data from API
async function fetchStats(customFilters = null) {
  const loading = document.getElementById('loading');
  const error = document.getElementById('error');
  const statsTable = document.getElementById('statsTable');
  
  loading.style.display = 'block';
  loading.innerHTML = '<div class="spinner"></div> Loading stats...';
  error.style.display = 'none';
  statsTable.style.display = 'none';
  
  try {
    const startTime = performance.now();
    let url = API_URL;
    
    if (customFilters) {
      // Build query string with custom filters
      const params = new URLSearchParams();
      params.append('season', currentSeason); // Always include season
      if (customFilters.location) params.append('location', customFilters.location);
      if (customFilters.competition) params.append('competition', customFilters.competition);
      if (customFilters.winLoss) params.append('winLoss', customFilters.winLoss);
      if (customFilters.month) params.append('month', customFilters.month);
      if (currentConference) params.append('conference', currentConference);
      params.append('_t', Date.now()); // Cache-busting parameter
      url += '?' + params.toString();
      console.log('Fetching with custom filters:', url, customFilters);
    } else {
      // Default to overall stats with no filters
      url += `?season=${currentSeason}&split=overall`;
      if (currentConference) url += `&conference=${currentConference}`;
      url += `&_t=${Date.now()}`; // Cache-busting parameter
      console.log('Fetching overall stats:', url);
    }
    
    const response = await fetch(url, {
      cache: 'no-store' // Disable browser caching
    });
    const result = await response.json();
  const loadTime = ((performance.now() - startTime) / 1000).toFixed(2);
  console.log(`✅ Received ${result.data ? result.data.length : 0} teams in ${loadTime}s`);
    
    if (result.success) {
      allStatsData = result.data;
      columnLabels = result.columnLabels || {};

      // Always use the full, unfiltered data for Teams tab unless filters are applied
      statsData = allStatsData;

      // Populate conference filter dropdowns
      populateConferenceFilters();

      // Apply current conference filter
      applyConferenceFilter();

      updateLastUpdated(result.lastUpdated);
      renderTable();
      renderCharts();
      loading.style.display = 'none';
      statsTable.style.display = 'table';

      console.log(`⚡ Total load time: ${loadTime}s`);
    } else {
      throw new Error(result.error || 'Failed to fetch data');
    }
  } catch (err) {
    console.error('Error fetching stats:', err);
    loading.style.display = 'none';
    error.textContent = `Error: ${err.message}`;
    error.style.display = 'block';
  }
}

// Update last updated timestamp
function updateLastUpdated(timestamp) {
  const date = new Date(timestamp);
  const formatted = date.toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
  document.getElementById('lastUpdated').textContent = `Last updated: ${formatted}`;
}

// Render the table
function renderTable() {
  if (statsData.length === 0) return;
  
  // Add rank based on Adjusted Net Rating (adjNTRG) - the best measure of team strength
  const teamsWithAdjNTRG = statsData
    .map((team, index) => ({ team, value: team.adjNTRG, originalIndex: index }))
    .filter(item => item.value != null && !isNaN(item.value))
    .sort((a, b) => b.value - a.value); // Sort by adjNTRG descending (higher is better)
  
  // Assign rank to each team based on adjNTRG
  teamsWithAdjNTRG.forEach((item, rank) => {
    statsData[item.originalIndex].netRatingRank = rank + 1;
  });
  
  let rankedData = statsData;
  
  // Debug: Check if DSOS/OSOS exist in first team
  if (statsData.length > 0) {
    console.log('First team data sample:', {
      teamName: statsData[0].teamName,
      dsos: statsData[0].dsos,
      osos: statsData[0].osos,
      ortg: statsData[0].offensiveRating,
      drtg: statsData[0].defensiveRating
    });
  }
  
  // Get all unique columns from the data
  const allColumns = new Set();
  rankedData.forEach(team => {
    Object.keys(team).forEach(key => allColumns.add(key));
  });
  
  // ====== COLUMN FILTER: Edit this array to show only specific columns ======
  // To show all columns, set columnsToShow = null
  // To show specific columns, list them here:
  const columnsToShow = [
    'netRatingRank',
    'teamName',
    'conference',
    'gp', 'wins', 'losses', 'winPct',
    'netRating', 'offensiveRating', 'defensiveRating', 'nsos',
    'adjORTG', 'adjDRTG', 'adjNTRG',
    'ptspg', 'ptspgopp',
    'possessionsPerGame', 'oppPossessionsPerGame',
    'fgPct', 'fg3Pct', 'ftPct', 'efgPct', 'ftRate', 'threePtRate', 'shotVolume',
    'fgPctOpp', 'fg3PctOpp', 'ftPctOpp', 'efgPctOpp', 'ftRateOpp', 'threePtRateOpp', 'shotVolumeOpp',
    'trebpg', 'drebpg', 'orebpg', 'orPct', 'drPct',
    'trebpgopp', 'drebpgopp', 'orebpgopp', 'orPctOpp', 'drPctOpp',
    'astpg', 'toPct', 'topg', 'stlpg', 'blkpg',
    'astpgopp', 'toPctOpp', 'topgopp', 'stlpgopp', 'blkpgopp',
    'ptspaintpg', 'ptsbenchpg', 'ptsfastbpg', 'ptstopg', 'ptsch2pg',
    'ptspaintpgopp', 'ptsbenchpgopp', 'ptsfastbpgopp', 'ptstopgopp', 'ptsch2pgopp'
  ];
  
  // Filter and order columns
  let columns;
  if (columnsToShow) {
    // Use the exact order specified in columnsToShow
    columns = columnsToShow.filter(col => allColumns.has(col));
    console.log('Columns to show:', columnsToShow);
    console.log('Columns found in data:', columns);
    console.log('Missing columns:', columnsToShow.filter(col => !allColumns.has(col)));
  } else {
    // Show all columns, sorted alphabetically (teamName first)
    columns = Array.from(allColumns).sort((a, b) => {
      if (a === 'teamName') return -1;
      if (b === 'teamName') return 1;
      return a.localeCompare(b);
    });
  }
  
  // Store columns for use in sorting
  currentColumns = columns;
  
  // Sort by rank by default (ascending - lower rank numbers first)
  statsData.sort((a, b) => {
    const aVal = a.netRatingRank || 999999;
    const bVal = b.netRatingRank || 999999;
    return aVal - bVal;
  });
  
  // Render header
  const headerRow = document.getElementById('tableHeader');
  headerRow.innerHTML = columns.map(col => 
    `<th class="sortable" data-column="${col}">${getColumnLabel(col)}</th>`
  ).join('');
  
  // Add click handlers to headers
  headerRow.querySelectorAll('th').forEach(th => {
    th.addEventListener('click', () => sortTable(th.dataset.column));
  });
  
  // Add sort indicator to rank column
  const rankHeader = document.querySelector('th[data-column="netRatingRank"]');
  if (rankHeader) {
    rankHeader.classList.add('sort-asc');
  }
  
  // Render body
  renderTableBody(columns);
}

// Render table body
// Calculate rankings for stats that should display rankings
function calculateRankings() {
  // Only rank ORTG (higher is better) and DRTG (lower is better)
  const rankedStats = ['offensiveRating', 'adjORTG', 'adjNTRG', 'nsos'];
  const rankedStatsLowerBetter = ['defensiveRating', 'adjDRTG'];
  
  const rankings = {};
  
  // Calculate rankings for each stat
  [...rankedStats, ...rankedStatsLowerBetter].forEach(stat => {
    const isLowerBetter = rankedStatsLowerBetter.includes(stat);
    
    // Create array of teams with valid values for this stat
    const validTeams = statsData
      .map((team, index) => ({ team, value: team[stat], index }))
      .filter(item => item.value != null && !isNaN(item.value));
    
    // Sort by value
    validTeams.sort((a, b) => {
      return isLowerBetter ? a.value - b.value : b.value - a.value;
    });
    
    // Assign rankings
    validTeams.forEach((item, rank) => {
      if (!rankings[item.index]) rankings[item.index] = {};
      rankings[item.index][stat] = rank + 1;
    });
  });
  
  return rankings;
}

function renderTableBody(columns) {
  const tbody = document.getElementById('tableBody');
  const rankings = calculateRankings();
  
  const teamRows = statsData.map((team, teamIndex) => {
    const cells = columns.map(col => {
      const value = team[col];
      const formatted = formatValue(value, col);
      let cellClass = '';
      if (col === 'teamName') cellClass = 'team-name';
      else if (col === 'netRatingRank') cellClass = 'rank-cell';
      
      // Add ranking if available for this stat
      const ranking = rankings[teamIndex]?.[col];
      const displayValue = ranking 
        ? `${formatted} <span class="stat-rank">${ranking}</span>`
        : formatted;
      
      return `<td class="${cellClass}">${displayValue}</td>`;
    }).join('');
    return `<tr>${cells}</tr>`;
  }).join('');
  
  // Calculate averages for numeric columns
  const averageRow = columns.map((col, colIndex) => {
    let cellClass = 'average-cell';
    if (col === 'teamName') cellClass += ' team-name';
    else if (col === 'netRatingRank') cellClass += ' rank-cell';
    
    if (col === 'teamName') {
      return `<td class="${cellClass}"><strong>Average</strong></td>`;
    } else if (col === 'netRatingRank') {
      // Don't show rank for average row
      return `<td class="${cellClass}">-</td>`;
    } else if (col === 'record') {
      // Calculate average wins and losses
      const totalWins = statsData.reduce((sum, team) => sum + (team.wins || 0), 0);
      const totalLosses = statsData.reduce((sum, team) => sum + (team.losses || 0), 0);
      const avgWins = (totalWins / statsData.length).toFixed(1);
      const avgLosses = (totalLosses / statsData.length).toFixed(1);
      return `<td class="${cellClass}">${avgWins}-${avgLosses}</td>`;
    } else if (col === 'gp' || col === 'wins' || col === 'losses') {
      // Calculate average for GP, wins, losses with 1 decimal
      const numericValues = statsData
        .map(team => team[col])
        .filter(val => typeof val === 'number' && !isNaN(val));
      
      if (numericValues.length > 0) {
        const avg = numericValues.reduce((sum, val) => sum + val, 0) / numericValues.length;
        return `<td class="${cellClass}">${avg.toFixed(1)}</td>`;
      }
      return `<td class="${cellClass}">-</td>`;
    } else {
      // Calculate average for numeric columns (without rankings)
      const numericValues = statsData
        .map(team => team[col])
        .filter(val => typeof val === 'number' && !isNaN(val));
      
      if (numericValues.length > 0) {
        const avg = numericValues.reduce((sum, val) => sum + val, 0) / numericValues.length;
        const formatted = formatValue(avg, col);
        return `<td class="${cellClass}">${formatted}</td>`;
      }
      return `<td class="${cellClass}">-</td>`;
    }
  }).join('');
  
  tbody.innerHTML = teamRows + `<tr class="average-row">${averageRow}</tr>`;
}

// Sort table by column
function sortTable(column) {
  const header = document.querySelector(`th[data-column="${column}"]`);
  const allHeaders = document.querySelectorAll('th');
  
  // Determine sort direction
  if (currentSort.column === column) {
    currentSort.direction = currentSort.direction === 'asc' ? 'desc' : 'asc';
  } else {
    currentSort.column = column;
    currentSort.direction = 'asc';
  }
  
  // Update header classes
  allHeaders.forEach(h => {
    h.classList.remove('sort-asc', 'sort-desc');
  });
  header.classList.add(currentSort.direction === 'asc' ? 'sort-asc' : 'sort-desc');
  
  // Sort data
  statsData.sort((a, b) => {
    let aVal = a[column];
    let bVal = b[column];
    
    // Special handling for record column - sort by wins
    if (column === 'record') {
      aVal = a['wins'] || 0;
      bVal = b['wins'] || 0;
    }
    
    // Remove commas from strings and convert to numbers if possible
    if (typeof aVal === 'string') {
      const cleanA = parseFloat(aVal.replace(/,/g, ''));
      if (!isNaN(cleanA)) aVal = cleanA;
    }
    if (typeof bVal === 'string') {
      const cleanB = parseFloat(bVal.replace(/,/g, ''));
      if (!isNaN(cleanB)) bVal = cleanB;
    }
    
    // Handle null/undefined
    if (aVal == null) return 1;
    if (bVal == null) return -1;
    
    // Compare
    if (aVal < bVal) return currentSort.direction === 'asc' ? -1 : 1;
    if (aVal > bVal) return currentSort.direction === 'asc' ? 1 : -1;
    return 0;
  });
  
  // Re-render body with the same column order
  renderTableBody(currentColumns);
}

// Get readable column label
function getColumnLabel(columnKey) {
  if (columnKey === 'rank') return 'Rank';
  if (columnKey === 'netRatingRank') return 'Rank';
  if (columnLabels[columnKey]) {
    return columnLabels[columnKey];
  }
  // Fallback formatter
  return columnKey
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, str => str.toUpperCase())
    .trim();
}

// Format cell values
function formatValue(value, columnKey) {
  if (value == null) return '-';
  
  // Abbreviate conference names
  if (columnKey === 'conference') {
    const conferenceAbbreviations = {
      'American Midwest': 'AMC',
      'American Rivers': 'ARC',
      'Atlantic East': 'AEC',
      'Big South': 'BSC',
      'California Pacific': 'CalPac',
      'Cascade': 'CCC',
      'Central Atlantic Collegiate': 'CACC',
      'Chicagoland Collegiate': 'CCAC',
      'Colonial States': 'CSAC',
      'Commonwealth Coast': 'CCC',
      'Continental Athletic': 'CAC',
      'Crossroads League': 'CL',
      'East Coast': 'ECC',
      'Empire 8': 'E8',
      'Great Lakes Intercollegiate': 'GLIAC',
      'Great Lakes Valley': 'GLVC',
      'Great Midwest': 'GMAC',
      'Great Northeast': 'GNAC',
      'Gulf South': 'GSC',
      'Heartland': 'HCAC',
      'Independent': 'IND',
      'Lone Star': 'LSC',
      'Massachusetts State Collegiate': 'MASCAC',
      'Michigan Intercollegiate': 'MIAA',
      'Middle Atlantic': 'MAC',
      'Midwest': 'MWC',
      'Minnesota Intercollegiate': 'MIAC',
      'Mountain East': 'MEC',
      'New England Collegiate': 'NECC',
      'New England Women\'s and Men\'s': 'NEWMAC',
      'New Jersey Athletic': 'NJAC',
      'North Atlantic': 'NAC',
      'North Coast Athletic': 'NCAC',
      'North Star': 'NSAA',
      'Northeast': 'NE-10',
      'Northern Athletics Collegiate': 'NACA',
      'Northern Sun Intercollegiate': 'NSIC',
      'Northwest': 'NWC',
      'Ohio Athletic': 'OAC',
      'Old Dominion': 'ODAC',
      'Pacific West': 'PacWest',
      'Peach Belt': 'PBC',
      'Pennsylvania State Athletic': 'PSAC',
      'Presidents\' Athletic': 'PAC',
      'Rocky Mountain': 'RMAC',
      'South Atlantic': 'SAC',
      'Southern Athletic': 'SAA',
      'Southern California Intercollegiate': 'SCIAC',
      'Southern Collegiate': 'SCAC',
      'Sunshine State': 'SSC',
      'Upper Midwest': 'UMAC',
      'USA South': 'USAS',
      'Wisconsin Intercollegiate': 'WIAC'
    };
    return conferenceAbbreviations[value] || value;
  }
  
  // Return certain fields as-is (like win-loss record, rank, games played, team name)
  if (columnKey === 'record' || columnKey === 'wins' || columnKey === 'losses' || columnKey === 'gp' || columnKey === 'rank' || columnKey === 'netRatingRank' || columnKey === 'teamName') {
    return value;
  }
  
  // Special handling for Win % - display as decimal without leading 0
  if (columnKey === 'winPct') {
    if (typeof value === 'number') {
      return value.toFixed(3);
    }
    return value;
  }
  
  // Check if this is points per possession or Shot Volume (needs 3 decimals)
  const isThreeDecimals = columnKey && (
    columnKey === 'pointsPerPossession' || 
    columnKey === 'oppPointsPerPossession' ||
    columnKey === 'netPointsPerPossession' ||
    columnKey === 'shotVolume'
  );
  
  // Check if this is a percentage field (needs % symbol)
  const isPercentage = columnKey && (
    columnKey.toLowerCase().includes('pct') ||
    columnKey.toLowerCase().includes('rate')
  );
  
  // Check if this is per game stat or SCMG (needs 1 decimal)
  const isOneDecimal = columnKey && (
    columnKey.includes('pg') || 
    columnKey.includes('pm') ||
    columnKey === 'scmg' ||
    columnKey === 'dsos' ||
    columnKey === 'osos' ||
    columnKey === 'nsos' ||
    columnKey === 'adjORTG' ||
    columnKey === 'adjDRTG' ||
    columnKey === 'adjNTRG'
  );
  
  // If it's already a number, format it
  if (typeof value === 'number') {
    if (isThreeDecimals) {
      return value.toFixed(3);
    }
    if (isPercentage) {
      return value.toFixed(1) + '%';
    }
    if (isOneDecimal) {
      return value.toFixed(1);
    }
    return value.toFixed(2);
  }
  
  // If it's a string, try to parse it as a number
  if (typeof value === 'string') {
    // Remove commas and try to parse
    const cleanValue = value.replace(/,/g, '');
    const numValue = parseFloat(cleanValue);
    
    // If it's a valid number, format it nicely
    if (!isNaN(numValue)) {
      // Check if this needs 3 decimals
      if (isThreeDecimals) {
        return numValue.toFixed(3);
      }
      // Check if this is a percentage field
      if (isPercentage) {
        return numValue.toFixed(1) + '%';
      }
      // Check if this is per game stat or SCMG
      if (isOneDecimal) {
        return numValue.toFixed(1);
      }
      // For whole numbers, don't show decimals (unless per game)
      if (Number.isInteger(numValue)) {
        return numValue.toLocaleString();
      }
      // For decimals, show 1-3 decimal places
      return numValue.toFixed(Math.abs(numValue) < 10 ? 3 : 1);
    }
  }
  
  // Otherwise return as-is
  return value;
}

// Render Charts
function renderCharts() {
  renderStatsChart(currentChartStat);
  renderScatterChart();
  renderReboundChart();
  renderAdjRatingChart();
  renderNetRatingComparisonChart();
  renderPaceChart();
  renderTransitionChart();
  renderAssistTOChart();
  renderOrebChart();
}

// Render Dynamic Stats Bar Chart
function renderStatsChart(statKey) {
  const ctx = document.getElementById('statsChart');
  if (!ctx) return;
  
  // Destroy existing chart if it exists
  if (statsChart) {
    statsChart.destroy();
  }
  
  // Get stat label
  const statLabel = columnLabels[statKey] || statKey;
  
  // Update chart title
  document.getElementById('chartTitle').textContent = statLabel;
  
  // Sort teams by selected stat (descending)
  const sortedData = [...statsData].sort((a, b) => {
    const aVal = parseFloat(a[statKey]) || 0;
    const bVal = parseFloat(b[statKey]) || 0;
    return bVal - aVal;
  });
  
  const labels = sortedData.map(team => team.teamName);
  const data = sortedData.map(team => parseFloat(team[statKey]) || 0);
  
  // Determine if this stat can be negative (only Net PPP for now)
  const canBeNegative = statKey === 'netPointsPerPossession';
  
  // Color bars based on positive/negative values or use gradient
  let backgroundColors, borderColors;
  if (canBeNegative) {
    backgroundColors = data.map(value => 
      value >= 0 ? 'rgba(34, 197, 94, 0.8)' : 'rgba(239, 68, 68, 0.8)'
    );
    borderColors = data.map(value => 
      value >= 0 ? 'rgba(34, 197, 94, 1)' : 'rgba(239, 68, 68, 1)'
    );
  } else {
    // Use gradient from best to worst
    backgroundColors = data.map((value, index) => {
      const ratio = index / (data.length - 1);
      return `rgba(0, 49, 110, ${0.9 - ratio * 0.5})`;
    });
    borderColors = data.map((value, index) => {
      const ratio = index / (data.length - 1);
      return `rgba(0, 49, 110, ${1 - ratio * 0.3})`;
    });
  }
  
  // Determine decimal places for tooltip
  const isPercentage = statKey.toLowerCase().includes('pct') || 
                       statKey.toLowerCase().includes('rate');
  const is3Decimals = ['pointsPerPossession', 'oppPointsPerPossession', 'netPointsPerPossession', 'shotVolume'].includes(statKey);
  
  statsChart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: labels,
      datasets: [{
        label: statLabel,
        data: data,
        backgroundColor: backgroundColors,
        borderColor: borderColors,
        borderWidth: 2
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: true,
      plugins: {
        legend: {
          display: false
        },
        tooltip: {
          callbacks: {
            label: function(context) {
              let value = context.parsed.y;
              if (is3Decimals) {
                value = value.toFixed(3);
              } else if (isPercentage) {
                value = value.toFixed(1) + '%';
              } else {
                value = value.toFixed(1);
              }
              return `${statLabel}: ${value}`;
            }
          }
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          title: {
            display: true,
            text: statLabel,
            font: {
              size: 14,
              weight: 'bold'
            }
          },
          grid: {
            color: 'rgba(0, 0, 0, 0.05)'
          },
          ticks: {
            callback: function(value) {
              if (isPercentage) {
                return value.toFixed(0) + '%';
              }
              return value;
            }
          }
        },
        x: {
          grid: {
            display: false
          },
          ticks: {
            font: {
              size: 11
            }
          }
        }
      }
    }
  });
}

// Render 3PT Rate vs 3PT% Scatterplot
function renderScatterChart() {
  const ctx = document.getElementById('scatterChart');
  if (!ctx) return;
  
  // Destroy existing chart if it exists
  if (scatterChart) {
    scatterChart.destroy();
  }
  
  // Prepare data for scatter plot
  const scatterData = statsData.map(team => ({
    x: team.threePtRate || 0,
    y: parseFloat(team.fg3Pct) || 0,
    label: team.teamName
  }));
  
  // Calculate mean values for center lines
  const meanX = scatterData.reduce((sum, point) => sum + point.x, 0) / scatterData.length;
  const meanY = scatterData.reduce((sum, point) => sum + point.y, 0) / scatterData.length;
  
  // Plugin to draw center lines
  const centerLinesPlugin = {
    id: 'centerLines',
    afterDatasetsDraw(chart) {
      const { ctx, chartArea: { left, right, top, bottom }, scales: { x, y } } = chart;
      
      // Draw vertical center line (mean X)
      const xPos = x.getPixelForValue(meanX);
      ctx.save();
      ctx.strokeStyle = 'rgba(0, 0, 0, 0.6)';
      ctx.lineWidth = 2;
      ctx.setLineDash([5, 5]);
      ctx.beginPath();
      ctx.moveTo(xPos, top);
      ctx.lineTo(xPos, bottom);
      ctx.stroke();
      ctx.restore();
      
      // Draw horizontal center line (mean Y)
      const yPos = y.getPixelForValue(meanY);
      ctx.save();
      ctx.strokeStyle = 'rgba(0, 0, 0, 0.6)';
      ctx.lineWidth = 2;
      ctx.setLineDash([5, 5]);
      ctx.beginPath();
      ctx.moveTo(left, yPos);
      ctx.lineTo(right, yPos);
      ctx.stroke();
      ctx.restore();
    }
  };
  
  scatterChart = new Chart(ctx, {
    type: 'scatter',
    data: {
      datasets: [{
        label: 'Teams',
        data: scatterData,
        backgroundColor: 'rgba(0, 49, 110, 0.6)',
        borderColor: 'rgba(0, 49, 110, 1)',
        borderWidth: 2,
        pointRadius: 8,
        pointHoverRadius: 10
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: true,
      aspectRatio: 1, // Make it square
      plugins: {
        legend: {
          display: false
        },
        tooltip: {
          callbacks: {
            label: function(context) {
              const point = context.raw;
              return `${point.label}: ${point.x.toFixed(1)}% 3PT Rate, ${point.y.toFixed(1)}% 3PT FG%`;
            }
          }
        }
      },
      scales: {
        x: {
          title: {
            display: true,
            text: '3-Point Attempt Rate (%)',
            font: {
              size: 14,
              weight: 'bold'
            }
          },
          grid: {
            color: 'rgba(0, 0, 0, 0.05)'
          },
          ticks: {
            callback: function(value) {
              return value.toFixed(0) + '%';
            }
          }
        },
        y: {
          title: {
            display: true,
            text: '3-Point Field Goal Percentage (%)',
            font: {
              size: 14,
              weight: 'bold'
            }
          },
          grid: {
            color: 'rgba(0, 0, 0, 0.05)'
          },
          ticks: {
            callback: function(value) {
              return value.toFixed(0) + '%';
            }
          }
        }
      }
    },
    plugins: [centerLinesPlugin]
  });
}

// Render OREB% vs DREB% Scatterplot
function renderReboundChart() {
  const ctx = document.getElementById('reboundChart');
  if (!ctx) return;
  
  // Destroy existing chart if it exists
  if (reboundChart) {
    reboundChart.destroy();
  }
  
  // Prepare data for scatter plot
  const scatterData = statsData.map(team => ({
    x: parseFloat(team.orPct) || 0,
    y: parseFloat(team.drPct) || 0,
    label: team.teamName
  }));
  
  // Calculate mean values for center lines
  const meanX = scatterData.reduce((sum, point) => sum + point.x, 0) / scatterData.length;
  const meanY = scatterData.reduce((sum, point) => sum + point.y, 0) / scatterData.length;
  
  // Plugin to draw center lines
  const centerLinesPlugin = {
    id: 'centerLinesRebound',
    afterDatasetsDraw(chart) {
      const { ctx, chartArea: { left, right, top, bottom }, scales: { x, y } } = chart;
      
      // Draw vertical center line (mean X)
      const xPos = x.getPixelForValue(meanX);
      ctx.save();
      ctx.strokeStyle = 'rgba(0, 0, 0, 0.6)';
      ctx.lineWidth = 2;
      ctx.setLineDash([5, 5]);
      ctx.beginPath();
      ctx.moveTo(xPos, top);
      ctx.lineTo(xPos, bottom);
      ctx.stroke();
      ctx.restore();
      
      // Draw horizontal center line (mean Y)
      const yPos = y.getPixelForValue(meanY);
      ctx.save();
      ctx.strokeStyle = 'rgba(0, 0, 0, 0.6)';
      ctx.lineWidth = 2;
      ctx.setLineDash([5, 5]);
      ctx.beginPath();
      ctx.moveTo(left, yPos);
      ctx.lineTo(right, yPos);
      ctx.stroke();
      ctx.restore();
    }
  };
  
  reboundChart = new Chart(ctx, {
    type: 'scatter',
    data: {
      datasets: [{
        label: 'Teams',
        data: scatterData,
        backgroundColor: 'rgba(0, 49, 110, 0.6)',
        borderColor: 'rgba(0, 49, 110, 1)',
        borderWidth: 2,
        pointRadius: 8,
        pointHoverRadius: 10
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: true,
      aspectRatio: 1, // Make it square
      plugins: {
        legend: {
          display: false
        },
        tooltip: {
          callbacks: {
            label: function(context) {
              const point = context.raw;
              return `${point.label}: ${point.x.toFixed(1)}% OREB, ${point.y.toFixed(1)}% DREB`;
            }
          }
        }
      },
      scales: {
        x: {
          title: {
            display: true,
            text: 'Offensive Rebound Percentage (%)',
            font: {
              size: 14,
              weight: 'bold'
            }
          },
          grid: {
            color: 'rgba(0, 0, 0, 0.05)'
          },
          ticks: {
            callback: function(value) {
              return value.toFixed(0) + '%';
            }
          }
        },
        y: {
          title: {
            display: true,
            text: 'Defensive Rebound Percentage (%)',
            font: {
              size: 14,
              weight: 'bold'
            }
          },
          grid: {
            color: 'rgba(0, 0, 0, 0.05)'
          },
          ticks: {
            callback: function(value) {
              return value.toFixed(0) + '%';
            }
          }
        }
      }
    },
    plugins: [centerLinesPlugin]
  });
}

// Render AdjDRTG vs AdjORTG Scatterplot
function renderAdjRatingChart() {
  const ctx = document.getElementById('adjRatingChart');
  if (!ctx) return;
  
  // Destroy existing chart if it exists
  if (adjRatingChart) {
    adjRatingChart.destroy();
  }
  
  // Prepare data for scatter plot - X is AdjORTG, Y is AdjDRTG (inverted because lower DRTG is better)
  const scatterData = statsData.map(team => ({
    x: parseFloat(team.adjORTG) || 0,
    y: parseFloat(team.adjDRTG) || 0,
    label: team.teamName
  }));
  
  // Calculate mean values for center lines
  const meanX = scatterData.reduce((sum, point) => sum + point.x, 0) / scatterData.length;
  const meanY = scatterData.reduce((sum, point) => sum + point.y, 0) / scatterData.length;
  
  // Plugin to draw center lines
  const centerLinesPlugin = {
    id: 'centerLinesAdjRating',
    afterDatasetsDraw(chart) {
      const { ctx, chartArea: { left, right, top, bottom }, scales: { x, y } } = chart;
      
      // Draw vertical center line (mean X)
      const xPos = x.getPixelForValue(meanX);
      ctx.save();
      ctx.strokeStyle = 'rgba(0, 0, 0, 0.6)';
      ctx.lineWidth = 2;
      ctx.setLineDash([5, 5]);
      ctx.beginPath();
      ctx.moveTo(xPos, top);
      ctx.lineTo(xPos, bottom);
      ctx.stroke();
      ctx.restore();
      
      // Draw horizontal center line (mean Y)
      const yPos = y.getPixelForValue(meanY);
      ctx.save();
      ctx.strokeStyle = 'rgba(0, 0, 0, 0.6)';
      ctx.lineWidth = 2;
      ctx.setLineDash([5, 5]);
      ctx.beginPath();
      ctx.moveTo(left, yPos);
      ctx.lineTo(right, yPos);
      ctx.stroke();
      ctx.restore();
    }
  };
  
  adjRatingChart = new Chart(ctx, {
    type: 'scatter',
    data: {
      datasets: [{
        label: 'Teams',
        data: scatterData,
        backgroundColor: 'rgba(0, 110, 49, 0.6)',
        borderColor: 'rgba(0, 110, 49, 1)',
        borderWidth: 2,
        pointRadius: 8,
        pointHoverRadius: 10
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: true,
      aspectRatio: 1,
      plugins: {
        legend: {
          display: false
        },
        tooltip: {
          callbacks: {
            label: function(context) {
              const point = context.raw;
              return `${point.label}: AdjORTG ${point.x.toFixed(1)}, AdjDRTG ${point.y.toFixed(1)}`;
            }
          }
        }
      },
      scales: {
        x: {
          title: {
            display: true,
            text: 'Adjusted Offensive Rating (higher = better)',
            font: {
              size: 14,
              weight: 'bold'
            }
          },
          grid: {
            color: 'rgba(0, 0, 0, 0.05)'
          }
        },
        y: {
          reverse: true, // Lower DRTG is better, so reverse axis
          title: {
            display: true,
            text: 'Adjusted Defensive Rating (lower = better)',
            font: {
              size: 14,
              weight: 'bold'
            }
          },
          grid: {
            color: 'rgba(0, 0, 0, 0.05)'
          }
        }
      }
    },
    plugins: [centerLinesPlugin]
  });
}

// Render AdjNRTG vs NRTG Scatterplot (comparison of raw vs adjusted)
function renderNetRatingComparisonChart() {
  const ctx = document.getElementById('netRatingComparisonChart');
  if (!ctx) return;
  
  // Destroy existing chart if it exists
  if (netRatingComparisonChart) {
    netRatingComparisonChart.destroy();
  }
  
  // Prepare data for scatter plot - X is raw NRTG, Y is adjusted NRTG
  const scatterData = statsData.map(team => ({
    x: parseFloat(team.netRating) || 0,
    y: parseFloat(team.adjNTRG) || 0,
    label: team.teamName
  }));
  
  // Find min and max for the diagonal line
  const allValues = scatterData.flatMap(d => [d.x, d.y]);
  const minVal = Math.min(...allValues) - 5;
  const maxVal = Math.max(...allValues) + 5;
  
  // Plugin to draw diagonal reference line (y = x, where adj = raw)
  const diagonalLinePlugin = {
    id: 'diagonalLine',
    afterDatasetsDraw(chart) {
      const { ctx, chartArea: { left, right, top, bottom }, scales: { x, y } } = chart;
      
      // Draw diagonal line where adjNRTG = NRTG (no adjustment)
      const startX = x.getPixelForValue(minVal);
      const startY = y.getPixelForValue(minVal);
      const endX = x.getPixelForValue(maxVal);
      const endY = y.getPixelForValue(maxVal);
      
      ctx.save();
      ctx.strokeStyle = 'rgba(0, 0, 0, 0.4)';
      ctx.lineWidth = 2;
      ctx.setLineDash([5, 5]);
      ctx.beginPath();
      ctx.moveTo(startX, startY);
      ctx.lineTo(endX, endY);
      ctx.stroke();
      ctx.restore();
    }
  };
  
  netRatingComparisonChart = new Chart(ctx, {
    type: 'scatter',
    data: {
      datasets: [{
        label: 'Teams',
        data: scatterData,
        backgroundColor: 'rgba(110, 49, 0, 0.6)',
        borderColor: 'rgba(110, 49, 0, 1)',
        borderWidth: 2,
        pointRadius: 8,
        pointHoverRadius: 10
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: true,
      aspectRatio: 1,
      plugins: {
        legend: {
          display: false
        },
        tooltip: {
          callbacks: {
            label: function(context) {
              const point = context.raw;
              const diff = (point.y - point.x).toFixed(1);
              const diffStr = diff > 0 ? `+${diff}` : diff;
              return `${point.label}: Raw ${point.x.toFixed(1)} → Adj ${point.y.toFixed(1)} (${diffStr})`;
            }
          }
        }
      },
      scales: {
        x: {
          title: {
            display: true,
            text: 'Raw Net Rating (NRTG)',
            font: {
              size: 14,
              weight: 'bold'
            }
          },
          grid: {
            color: 'rgba(0, 0, 0, 0.05)'
          }
        },
        y: {
          title: {
            display: true,
            text: 'Adjusted Net Rating (AdjNRTG)',
            font: {
              size: 14,
              weight: 'bold'
            }
          },
          grid: {
            color: 'rgba(0, 0, 0, 0.05)'
          }
        }
      }
    },
    plugins: [diagonalLinePlugin]
  });
}

// Render Pace vs Net Rating Scatterplot
function renderPaceChart() {
  const ctx = document.getElementById('paceChart');
  if (!ctx) return;
  
  // Destroy existing chart if it exists
  if (paceChart) {
    paceChart.destroy();
  }
  
  // Prepare data for scatter plot - X is possessions per game (pace), Y is net rating
  const scatterData = statsData.map(team => ({
    x: parseFloat(team.possessionsPerGame) || 0,
    y: parseFloat(team.netRating) || 0,
    label: team.teamName
  })).filter(d => d.x > 0); // Filter out teams with no pace data
  
  // Calculate mean values for center lines
  const meanX = scatterData.reduce((sum, point) => sum + point.x, 0) / scatterData.length;
  const meanY = scatterData.reduce((sum, point) => sum + point.y, 0) / scatterData.length;
  
  // Plugin to draw center lines
  const centerLinesPlugin = {
    id: 'centerLinesPace',
    afterDatasetsDraw(chart) {
      const { ctx, chartArea: { left, right, top, bottom }, scales: { x, y } } = chart;
      
      // Draw vertical center line (mean X)
      const xPos = x.getPixelForValue(meanX);
      ctx.save();
      ctx.strokeStyle = 'rgba(0, 0, 0, 0.6)';
      ctx.lineWidth = 2;
      ctx.setLineDash([5, 5]);
      ctx.beginPath();
      ctx.moveTo(xPos, top);
      ctx.lineTo(xPos, bottom);
      ctx.stroke();
      ctx.restore();
      
      // Draw horizontal center line (mean Y = 0 for net rating)
      const yPos = y.getPixelForValue(0);
      ctx.save();
      ctx.strokeStyle = 'rgba(0, 0, 0, 0.6)';
      ctx.lineWidth = 2;
      ctx.setLineDash([5, 5]);
      ctx.beginPath();
      ctx.moveTo(left, yPos);
      ctx.lineTo(right, yPos);
      ctx.stroke();
      ctx.restore();
    }
  };
  
  paceChart = new Chart(ctx, {
    type: 'scatter',
    data: {
      datasets: [{
        label: 'Teams',
        data: scatterData,
        backgroundColor: 'rgba(128, 0, 128, 0.6)',
        borderColor: 'rgba(128, 0, 128, 1)',
        borderWidth: 2,
        pointRadius: 8,
        pointHoverRadius: 10
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: true,
      aspectRatio: 1,
      plugins: {
        legend: {
          display: false
        },
        tooltip: {
          callbacks: {
            label: function(context) {
              const point = context.raw;
              return `${point.label}: ${point.x.toFixed(1)} poss/game, ${point.y > 0 ? '+' : ''}${point.y.toFixed(1)} NRTG`;
            }
          }
        }
      },
      scales: {
        x: {
          title: {
            display: true,
            text: 'Pace (Possessions per Game)',
            font: {
              size: 14,
              weight: 'bold'
            }
          },
          grid: {
            color: 'rgba(0, 0, 0, 0.05)'
          }
        },
        y: {
          title: {
            display: true,
            text: 'Net Rating',
            font: {
              size: 14,
              weight: 'bold'
            }
          },
          grid: {
            color: 'rgba(0, 0, 0, 0.05)'
          }
        }
      }
    },
    plugins: [centerLinesPlugin]
  });
}

// Render Steals vs Fast Break Points Scatterplot
function renderTransitionChart() {
  const ctx = document.getElementById('transitionChart');
  if (!ctx) return;
  
  // Destroy existing chart if it exists
  if (transitionChart) {
    transitionChart.destroy();
  }
  
  // Prepare data for scatter plot - X is steals per game, Y is fast break points per game
  const scatterData = statsData.map(team => ({
    x: parseFloat(team.stlpg) || 0,
    y: parseFloat(team.ptsfastbpg) || 0,
    label: team.teamName
  })).filter(d => d.x > 0 && d.y > 0); // Filter out teams with no data
  
  // Calculate mean values for center lines
  const meanX = scatterData.reduce((sum, point) => sum + point.x, 0) / scatterData.length;
  const meanY = scatterData.reduce((sum, point) => sum + point.y, 0) / scatterData.length;
  
  // Plugin to draw center lines
  const centerLinesPlugin = {
    id: 'centerLinesTransition',
    afterDatasetsDraw(chart) {
      const { ctx, chartArea: { left, right, top, bottom }, scales: { x, y } } = chart;
      
      // Draw vertical center line (mean X)
      const xPos = x.getPixelForValue(meanX);
      ctx.save();
      ctx.strokeStyle = 'rgba(0, 0, 0, 0.6)';
      ctx.lineWidth = 2;
      ctx.setLineDash([5, 5]);
      ctx.beginPath();
      ctx.moveTo(xPos, top);
      ctx.lineTo(xPos, bottom);
      ctx.stroke();
      ctx.restore();
      
      // Draw horizontal center line (mean Y)
      const yPos = y.getPixelForValue(meanY);
      ctx.save();
      ctx.strokeStyle = 'rgba(0, 0, 0, 0.6)';
      ctx.lineWidth = 2;
      ctx.setLineDash([5, 5]);
      ctx.beginPath();
      ctx.moveTo(left, yPos);
      ctx.lineTo(right, yPos);
      ctx.stroke();
      ctx.restore();
    }
  };
  
  transitionChart = new Chart(ctx, {
    type: 'scatter',
    data: {
      datasets: [{
        label: 'Teams',
        data: scatterData,
        backgroundColor: 'rgba(220, 20, 60, 0.6)',
        borderColor: 'rgba(220, 20, 60, 1)',
        borderWidth: 2,
        pointRadius: 8,
        pointHoverRadius: 10
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: true,
      aspectRatio: 1,
      plugins: {
        legend: {
          display: false
        },
        tooltip: {
          callbacks: {
            label: function(context) {
              const point = context.raw;
              return `${point.label}: ${point.x.toFixed(1)} SPG, ${point.y.toFixed(1)} Fast Break PPG`;
            }
          }
        }
      },
      scales: {
        x: {
          title: {
            display: true,
            text: 'Steals per Game',
            font: {
              size: 14,
              weight: 'bold'
            }
          },
          grid: {
            color: 'rgba(0, 0, 0, 0.05)'
          }
        },
        y: {
          title: {
            display: true,
            text: 'Fast Break Points per Game',
            font: {
              size: 14,
              weight: 'bold'
            }
          },
          grid: {
            color: 'rgba(0, 0, 0, 0.05)'
          }
        }
      }
    },
    plugins: [centerLinesPlugin]
  });
}

// Render Assist/TO Ratio vs Win% Scatterplot
// Render Pace vs AdjNRTG Scatterplot
function renderAssistTOChart() {
  const ctx = document.getElementById('assistTOChart');
  if (!ctx) return;
  
  // Destroy existing chart if it exists
  if (assistTOChart) {
    assistTOChart.destroy();
  }
  
  // Prepare data for scatter plot - X is Pace, Y is AdjNRTG
  const scatterData = statsData.map(team => ({
    x: parseFloat(team.possessionsPerGame) || 0,
    y: parseFloat(team.adjNTRG) || 0,
    label: team.teamName
  })).filter(d => d.x > 0); // Filter out teams with no pace data
  
  // Calculate mean values for center lines
  const meanX = scatterData.reduce((sum, point) => sum + point.x, 0) / scatterData.length;
  const meanY = 0; // Use 0 for AdjNRTG (average team)
  
  // Plugin to draw center lines
  const centerLinesPlugin = {
    id: 'centerLinesAdjPace',
    afterDatasetsDraw(chart) {
      const { ctx, chartArea: { left, right, top, bottom }, scales: { x, y } } = chart;
      
      // Draw vertical center line (mean pace)
      const xPos = x.getPixelForValue(meanX);
      ctx.save();
      ctx.strokeStyle = 'rgba(0, 0, 0, 0.6)';
      ctx.lineWidth = 2;
      ctx.setLineDash([5, 5]);
      ctx.beginPath();
      ctx.moveTo(xPos, top);
      ctx.lineTo(xPos, bottom);
      ctx.stroke();
      ctx.restore();
      
      // Draw horizontal center line (0 AdjNRTG = average)
      const yPos = y.getPixelForValue(meanY);
      ctx.save();
      ctx.strokeStyle = 'rgba(0, 0, 0, 0.6)';
      ctx.lineWidth = 2;
      ctx.setLineDash([5, 5]);
      ctx.beginPath();
      ctx.moveTo(left, yPos);
      ctx.lineTo(right, yPos);
      ctx.stroke();
      ctx.restore();
    }
  };
  
  assistTOChart = new Chart(ctx, {
    type: 'scatter',
    data: {
      datasets: [{
        label: 'Teams',
        data: scatterData,
        backgroundColor: 'rgba(0, 128, 128, 0.6)',
        borderColor: 'rgba(0, 128, 128, 1)',
        borderWidth: 2,
        pointRadius: 8,
        pointHoverRadius: 10
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: true,
      aspectRatio: 1,
      plugins: {
        legend: {
          display: false
        },
        tooltip: {
          callbacks: {
            label: function(context) {
              const point = context.raw;
              return `${point.label}: ${point.x.toFixed(1)} poss/game, ${point.y > 0 ? '+' : ''}${point.y.toFixed(1)} AdjNRTG`;
            }
          }
        }
      },
      scales: {
        x: {
          title: {
            display: true,
            text: 'Pace (Possessions per Game)',
            font: {
              size: 14,
              weight: 'bold'
            }
          },
          grid: {
            color: 'rgba(0, 0, 0, 0.05)'
          }
        },
        y: {
          title: {
            display: true,
            text: 'Adjusted Net Rating (AdjNRTG)',
            font: {
              size: 14,
              weight: 'bold'
            }
          },
          grid: {
            color: 'rgba(0, 0, 0, 0.05)'
          }
        }
      }
    },
    plugins: [centerLinesPlugin]
  });
}

// Render OREB% vs 2nd Chance PPG Scatterplot
function renderOrebChart() {
  const ctx = document.getElementById('orebPtsChart');
  if (!ctx) return;
  
  // Destroy existing chart if it exists
  if (orebChart) {
    orebChart.destroy();
  }
  
  // Prepare data for scatter plot - X is offensive rebound %, Y is 2nd chance points per game
  const scatterData = statsData.map(team => ({
    x: parseFloat(team.orPct) || 0,
    y: parseFloat(team.ptsch2pg) || 0,
    label: team.teamName
  })).filter(d => d.x > 0 && d.y > 0); // Filter out teams with no data
  
  // Calculate mean values for center lines
  const meanX = scatterData.reduce((sum, point) => sum + point.x, 0) / scatterData.length;
  const meanY = scatterData.reduce((sum, point) => sum + point.y, 0) / scatterData.length;
  
  // Plugin to draw center lines
  const centerLinesPlugin = {
    id: 'centerLinesOreb',
    afterDatasetsDraw(chart) {
      const { ctx, chartArea: { left, right, top, bottom }, scales: { x, y } } = chart;
      
      // Draw vertical center line (mean X)
      const xPos = x.getPixelForValue(meanX);
      ctx.save();
      ctx.strokeStyle = 'rgba(0, 0, 0, 0.6)';
      ctx.lineWidth = 2;
      ctx.setLineDash([5, 5]);
      ctx.beginPath();
      ctx.moveTo(xPos, top);
      ctx.lineTo(xPos, bottom);
      ctx.stroke();
      ctx.restore();
      
      // Draw horizontal center line (mean Y)
      const yPos = y.getPixelForValue(meanY);
      ctx.save();
      ctx.strokeStyle = 'rgba(0, 0, 0, 0.6)';
      ctx.lineWidth = 2;
      ctx.setLineDash([5, 5]);
      ctx.beginPath();
      ctx.moveTo(left, yPos);
      ctx.lineTo(right, yPos);
      ctx.stroke();
      ctx.restore();
    }
  };
  
  orebChart = new Chart(ctx, {
    type: 'scatter',
    data: {
      datasets: [{
        label: 'Teams',
        data: scatterData,
        backgroundColor: 'rgba(255, 140, 0, 0.6)',
        borderColor: 'rgba(255, 140, 0, 1)',
        borderWidth: 2,
        pointRadius: 8,
        pointHoverRadius: 10
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: true,
      aspectRatio: 1,
      plugins: {
        legend: {
          display: false
        },
        tooltip: {
          callbacks: {
            label: function(context) {
              const point = context.raw;
              return `${point.label}: ${point.x.toFixed(1)}% OREB, ${point.y.toFixed(1)} 2nd Chance PPG`;
            }
          }
        }
      },
      scales: {
        x: {
          title: {
            display: true,
            text: 'Offensive Rebound Percentage (%)',
            font: {
              size: 14,
              weight: 'bold'
            }
          },
          grid: {
            color: 'rgba(0, 0, 0, 0.05)'
          },
          ticks: {
            callback: function(value) {
              return value + '%';
            }
          }
        },
        y: {
          title: {
            display: true,
            text: '2nd Chance Points per Game',
            font: {
              size: 14,
              weight: 'bold'
            }
          },
          grid: {
            color: 'rgba(0, 0, 0, 0.05)'
          }
        }
      }
    },
    plugins: [centerLinesPlugin]
  });
}

// Auto-refresh at midnight
function scheduleNextRefresh() {
  const now = new Date();
  const midnight = new Date();
  midnight.setHours(24, 0, 0, 0);
  const msUntilMidnight = midnight - now;
  
  setTimeout(() => {
    fetchStats();
    scheduleNextRefresh(); // Schedule next refresh
  }, msUntilMidnight);
  
  console.log(`Next auto-refresh scheduled at midnight (${midnight.toLocaleString()})`);
}

// Initialize
document.getElementById('refreshBtn').addEventListener('click', () => {
  // Check if any filters are active
  const filters = {
    location: document.getElementById('locationFilter').value,
    competition: document.getElementById('competitionFilter').value,
    winLoss: document.getElementById('winLossFilter').value,
    month: document.getElementById('monthFilter').value
  };
  
  const activeFilters = {};
  Object.keys(filters).forEach(key => {
    if (filters[key]) activeFilters[key] = filters[key];
  });
  
  if (Object.keys(activeFilters).length > 0) {
    applyCustomFilters();
  } else {
    fetchStats();
  }
});

// Conference filter functions
function populateConferenceFilters() {
  // Get unique conferences
  const conferences = [...new Set(allStatsData.map(team => team.conference))].sort();
  
  // Populate conference dropdown
  const customSelect = document.getElementById('conferenceCustomFilter');
  
  // Clear existing options except "All Conferences"
  customSelect.innerHTML = '<option value="">All Conferences</option>';
  
  // Add conference options
  conferences.forEach(conf => {
    const option = document.createElement('option');
    option.value = conf;
    option.textContent = conf;
    customSelect.appendChild(option);
  });
  
  // Set to current conference if one is selected
  if (currentConference) {
    customSelect.value = currentConference;
  }
}

function applyConferenceFilter() {
  // Filter out teams with 0 games played, then apply conference filter if set
  let filteredData = allStatsData.filter(team => (team.gp || 0) > 0);
  
  if (currentConference) {
    statsData = filteredData.filter(team => team.conference === currentConference);
  } else {
    statsData = filteredData;
  }
  
  // Note: Adjusted ratings (adjORTG, adjDRTG, adjNTRG) are now calculated server-side
  // using additive adjustment method for stability
}

// REMOVED: calculateAdjustedRatings() - now handled server-side with additive method
// The old multiplicative formula was: adjORTG = ORTG * (avgDRTG / dsos)
// The new additive formula is: adjORTG = ORTG + (0.4 * scheduleStrength)

// Conference filter change handler
document.getElementById('conferenceCustomFilter').addEventListener('change', (e) => {
  currentConference = e.target.value;
  applyConferenceFilter();
  renderTable();
  renderCharts();
});

// Custom filters apply button
document.getElementById('applyFilters').addEventListener('click', applyCustomFilters);

// Reset filters button
document.getElementById('resetFilters').addEventListener('click', resetFilters);

function applyCustomFilters() {
  const filters = {
    location: document.getElementById('locationFilter').value,
    competition: document.getElementById('competitionFilter').value,
    winLoss: document.getElementById('winLossFilter').value,
    month: document.getElementById('monthFilter').value
  };
  
  // Only pass non-empty filters
  const activeFilters = {};
  Object.keys(filters).forEach(key => {
    if (filters[key]) activeFilters[key] = filters[key];
  });
  
  // If no filters selected, fetch overall stats
  if (Object.keys(activeFilters).length === 0) {
    fetchStats();
  } else {
    fetchStats(activeFilters);
  }
}

function resetFilters() {
  // Reset all filter dropdowns
  document.getElementById('conferenceCustomFilter').value = '';
  document.getElementById('locationFilter').value = '';
  document.getElementById('competitionFilter').value = '';
  document.getElementById('winLossFilter').value = '';
  document.getElementById('monthFilter').value = '';
  
  // Reset current conference
  currentConference = '';
  
  // Fetch overall stats
  fetchStats();
}

// Chart stat selector
document.getElementById('chartStatSelector').addEventListener('change', (e) => {
  currentChartStat = e.target.value;
  renderStatsChart(currentChartStat);
});

// Initialize: Load seasons first, then fetch stats
loadSeasons().then(() => {
  fetchStats();
  scheduleNextRefresh();
});
