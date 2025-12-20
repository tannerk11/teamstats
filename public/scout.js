// Scout page - Individual team analysis

// API URLs
const SEASONS_API_URL = window.location.hostname === 'localhost' 
  ? 'http://localhost:3000/api/seasons'
  : '/api/seasons';

const TEAM_API_URL = window.location.hostname === 'localhost' 
  ? 'http://localhost:3000/api/team'
  : '/api/team';

const PLAYERS_API_URL = window.location.hostname === 'localhost' 
  ? 'http://localhost:3000/api/players'
  : '/api/players';

// State management
let selectedSeason = null;
let selectedConference = null;
let selectedTeam = null;
let teamData = null;
let rosterData = [];
let currentScheduleFilter = 'all';
let currentRosterFilter = 'all';
let SEASONS = [];
let TEAMS_BY_SEASON = {};

// Initialize page
document.addEventListener('DOMContentLoaded', async () => {
  await loadSeasons();
  initializeSelectors();
  attachEventListeners();
});

// Load seasons from API
async function loadSeasons() {
  try {
    const response = await fetch(SEASONS_API_URL);
    if (!response.ok) {
      throw new Error('Failed to load seasons');
    }
    const data = await response.json();
    SEASONS = data.seasons;
    TEAMS_BY_SEASON = data.teamsBySeason;
  } catch (error) {
    console.error('Error loading seasons:', error);
    showError('Failed to load seasons. Please refresh the page.');
  }
}

// Initialize season, conference, and team selectors
function initializeSelectors() {
  const seasonSelect = document.getElementById('seasonSelect');
  
  // Populate seasons
  SEASONS.forEach(season => {
    const option = document.createElement('option');
    option.value = season.id;
    option.textContent = season.label;
    if (season.isCurrent) {
      option.selected = true;
      selectedSeason = season.id; // Set the current season
    }
    seasonSelect.appendChild(option);
  });
  
  // Populate conferences for the initial season
  if (selectedSeason) {
    populateConferences();
  }
}

// Attach event listeners
function attachEventListeners() {
  document.getElementById('seasonSelect').addEventListener('change', onSeasonChange);
  document.getElementById('conferenceSelect').addEventListener('change', onConferenceChange);
  document.getElementById('teamSelect').addEventListener('change', onTeamChange);
  
  // Schedule filter buttons
  document.querySelectorAll('#scheduleSection .filter-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      document.querySelectorAll('#scheduleSection .filter-btn').forEach(b => b.classList.remove('active'));
      e.target.classList.add('active');
      currentScheduleFilter = e.target.dataset.filter;
      renderSchedule();
    });
  });
  
  // Roster filter buttons
  document.querySelectorAll('#rosterSection .filter-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      document.querySelectorAll('#rosterSection .filter-btn').forEach(b => b.classList.remove('active'));
      e.target.classList.add('active');
      currentRosterFilter = e.target.dataset.filter;
      displayRoster();
    });
  });
}

// Handle season selection
function onSeasonChange(e) {
  selectedSeason = e.target.value;
  selectedConference = null;
  selectedTeam = null;
  
  if (!selectedSeason) {
    resetConferenceAndTeamSelectors();
    return;
  }
  
  populateConferences();
  resetTeamSelector();
  hideTeamData();
}

// Handle conference selection
function onConferenceChange(e) {
  selectedConference = e.target.value;
  selectedTeam = null;
  
  if (!selectedConference) {
    resetTeamSelector();
    hideTeamData();
    return;
  }
  
  populateTeams();
  hideTeamData();
}

// Handle team selection
async function onTeamChange(e) {
  selectedTeam = e.target.value;
  
  if (!selectedTeam) {
    hideTeamData();
    return;
  }
  
  await loadTeamData();
}

// Populate conferences dropdown
function populateConferences() {
  const conferenceSelect = document.getElementById('conferenceSelect');
  conferenceSelect.innerHTML = '<option value="">Select Conference</option>';
  
  const teams = TEAMS_BY_SEASON[selectedSeason] || [];
  const conferences = [...new Set(teams.map(t => t.conference))].sort();
  
  conferences.forEach(conf => {
    const option = document.createElement('option');
    option.value = conf;
    option.textContent = conf;
    conferenceSelect.appendChild(option);
  });
  
  conferenceSelect.disabled = false;
}

// Populate teams dropdown
function populateTeams() {
  const teamSelect = document.getElementById('teamSelect');
  teamSelect.innerHTML = '<option value="">Select Team</option>';
  
  const teams = TEAMS_BY_SEASON[selectedSeason] || [];
  const filteredTeams = teams.filter(t => t.conference === selectedConference).sort((a, b) => 
    a.name.localeCompare(b.name)
  );
  
  filteredTeams.forEach(team => {
    const option = document.createElement('option');
    option.value = team.url;
    option.textContent = team.name;
    option.dataset.name = team.name;
    teamSelect.appendChild(option);
  });
  
  teamSelect.disabled = false;
}

// Reset conference and team selectors
function resetConferenceAndTeamSelectors() {
  const conferenceSelect = document.getElementById('conferenceSelect');
  const teamSelect = document.getElementById('teamSelect');
  
  conferenceSelect.innerHTML = '<option value="">Select Conference</option>';
  conferenceSelect.disabled = true;
  
  teamSelect.innerHTML = '<option value="">Select Team</option>';
  teamSelect.disabled = true;
  
  hideTeamData();
}

// Reset team selector
function resetTeamSelector() {
  const teamSelect = document.getElementById('teamSelect');
  teamSelect.innerHTML = '<option value="">Select Team</option>';
  teamSelect.disabled = true;
}

// Hide team data sections
function hideTeamData() {
  document.getElementById('teamInfo').style.display = 'none';
  document.getElementById('splitsSection').style.display = 'none';
  document.getElementById('scheduleSection').style.display = 'none';
  document.getElementById('loadingIndicator').style.display = 'none';
}

// Load team data from API
async function loadTeamData() {
  try {
    document.getElementById('loadingIndicator').style.display = 'block';
    document.getElementById('error').style.display = 'none';
    hideTeamData();
    
    // Fetch through our API proxy to avoid CORS issues
    const response = await fetch(`${TEAM_API_URL}?url=${encodeURIComponent(selectedTeam)}`);
    if (!response.ok) {
      throw new Error(`Failed to load team data: ${response.status}`);
    }
    
    teamData = await response.json();
    
    document.getElementById('loadingIndicator').style.display = 'none';
    displayTeamData();
    
  } catch (error) {
    console.error('Error loading team data:', error);
    document.getElementById('loadingIndicator').style.display = 'none';
    showError('Failed to load team data. Please try again.');
  }
}

// Display team data
function displayTeamData() {
  const teamSelect = document.getElementById('teamSelect');
  const teamName = teamSelect.options[teamSelect.selectedIndex].dataset.name;
  
  // Show team info
  document.getElementById('teamInfo').style.display = 'block';
  document.getElementById('teamName').textContent = teamName;
  
  const overallStats = calculateSplitStats(teamData.events || []);
  document.getElementById('teamRecord').textContent = 
    `${overallStats.wins}-${overallStats.losses} (${overallStats.winPct})`;
  document.getElementById('teamConference').textContent = selectedConference;
  
  // Calculate and display splits
  displaySplits();
  
  // Load and display roster
  loadRoster(teamName);
  
  // Display schedule
  displaySchedule();
}

// Calculate stats for a subset of games
function calculateSplitStats(events) {
  if (!events || events.length === 0) {
    return {
      gp: 0, wins: 0, losses: 0, winPct: '.000',
      ppg: 0, oppg: 0, margin: 0,
      fgPct: 0, fg3Pct: 0, ftPct: 0,
      rpg: 0, apg: 0, topg: 0, spg: 0, bpg: 0
    };
  }
  
  // Filter for completed games with scores
  const completed = events.filter(e => 
    e.event && 
    e.event.result && 
    e.event.result.hasScores
  );
  
  const gp = completed.length;
  
  if (gp === 0) {
    return {
      gp: 0, wins: 0, losses: 0, winPct: '.000',
      ppg: 0, oppg: 0, margin: 0,
      fgPct: 0, fg3Pct: 0, ftPct: 0,
      rpg: 0, apg: 0, topg: 0, spg: 0, bpg: 0
    };
  }
  
  let wins = 0, losses = 0;
  let totalPts = 0, totalOppPts = 0;
  let totalFGM = 0, totalFGA = 0;
  let total3PM = 0, total3PA = 0;
  let totalFTM = 0, totalFTA = 0;
  let totalReb = 0, totalAst = 0, totalTO = 0, totalStl = 0, totalBlk = 0;
  
  completed.forEach(eventData => {
    const event = eventData.event;
    const stats = eventData.stats || {};
    
    // Determine if win or loss
    if (event.result.description === 'Win') {
      wins++;
    } else if (event.result.description === 'Loss') {
      losses++;
    }
    
    // Get scores from result
    const scores = event.result.numericResults || [];
    const pts = scores[0] || 0;
    const oppPts = scores[1] || 0;
    
    totalPts += pts;
    totalOppPts += oppPts;
    
    // Parse stats (they're stored as strings in the stats object)
    const fgp = stats.fgp || '0-0';
    const [fgm, fga] = fgp.split('-').map(n => parseInt(n) || 0);
    totalFGM += fgm;
    totalFGA += fga;
    
    const fgp3 = stats.fgp3 || '0-0';
    const [fg3m, fg3a] = fgp3.split('-').map(n => parseInt(n) || 0);
    total3PM += fg3m;
    total3PA += fg3a;
    
    const ftp = stats.ftp || '0-0';
    const [ftm, fta] = ftp.split('-').map(n => parseInt(n) || 0);
    totalFTM += ftm;
    totalFTA += fta;
    
    totalReb += parseInt(stats.treb) || 0;
    totalAst += parseInt(stats.ast) || 0;
    totalTO += parseInt(stats.to) || 0;
    totalStl += parseInt(stats.stl) || 0;
    totalBlk += parseInt(stats.blk) || 0;
  });
  
  return {
    gp,
    wins,
    losses,
    winPct: (wins / gp).toFixed(3),
    ppg: (totalPts / gp).toFixed(1),
    oppg: (totalOppPts / gp).toFixed(1),
    margin: ((totalPts - totalOppPts) / gp).toFixed(1),
    fgPct: totalFGA > 0 ? ((totalFGM / totalFGA) * 100).toFixed(1) : '0.0',
    fg3Pct: total3PA > 0 ? ((total3PM / total3PA) * 100).toFixed(1) : '0.0',
    ftPct: totalFTA > 0 ? ((totalFTM / totalFTA) * 100).toFixed(1) : '0.0',
    rpg: (totalReb / gp).toFixed(1),
    apg: (totalAst / gp).toFixed(1),
    topg: (totalTO / gp).toFixed(1),
    spg: (totalStl / gp).toFixed(1),
    bpg: (totalBlk / gp).toFixed(1)
  };
}

// Display splits table
function displaySplits() {
  const events = teamData.events || [];
  
  // Get completed games for wins/losses splits
  const completedGames = events.filter(e => e.event && e.event.result && e.event.result.hasScores);
  const wins = completedGames.filter(e => e.event.result.description === 'Win');
  const losses = completedGames.filter(e => e.event.result.description === 'Loss');
  
  // Calculate different splits
  const overall = calculateSplitStats(events);
  const home = calculateSplitStats(events.filter(e => e.event && e.event.home === true));
  const away = calculateSplitStats(events.filter(e => e.event && e.event.home === false && !e.event.neutralSite));
  const conference = calculateSplitStats(events.filter(e => e.event && e.event.conference === true));
  const last5 = calculateSplitStats(completedGames.slice(-5));
  const last10 = calculateSplitStats(completedGames.slice(-10));
  const inWins = calculateSplitStats(wins);
  const inLosses = calculateSplitStats(losses);
  
  const tbody = document.getElementById('splitsBody');
  tbody.innerHTML = '';
  
  // Add rows in desired order
  if (overall.gp > 0) tbody.appendChild(createSplitRow({ name: 'Overall', ...overall }));
  if (conference.gp > 0) tbody.appendChild(createSplitRow({ name: 'Conference', ...conference }));
  if (last5.gp > 0) tbody.appendChild(createSplitRow({ name: 'Last 5', ...last5 }));
  if (last10.gp > 0) tbody.appendChild(createSplitRow({ name: 'Last 10', ...last10 }));
  if (home.gp > 0) tbody.appendChild(createSplitRow({ name: 'Home', ...home }));
  if (away.gp > 0) tbody.appendChild(createSplitRow({ name: 'Away', ...away }));
  if (inWins.gp > 0) tbody.appendChild(createSplitRow({ name: 'In Wins', ...inWins }));
  if (inLosses.gp > 0) tbody.appendChild(createSplitRow({ name: 'In Losses', ...inLosses }));
  
  document.getElementById('splitsSection').style.display = 'block';
  
  // Initialize sorting handlers
  initializeSplitsTableSorting();
}

// Create a split row
function createSplitRow(split) {
  const row = document.createElement('tr');
  
  row.innerHTML = `
    <td class="sticky-col split-name">${split.name}</td>
    <td>${split.gp}</td>
    <td>${split.wins}</td>
    <td>${split.losses}</td>
    <td>${split.winPct}</td>
    <td>${split.ppg}</td>
    <td>${split.oppg}</td>
    <td class="${parseFloat(split.margin) > 0 ? 'positive' : 'negative'}">${split.margin}</td>
    <td>${split.fgPct}</td>
    <td>${split.fg3Pct}</td>
    <td>${split.ftPct}</td>
    <td>${split.rpg}</td>
    <td>${split.apg}</td>
    <td>${split.topg}</td>
    <td>${split.spg}</td>
    <td>${split.bpg}</td>
  `;
  
  return row;
}

// Load roster data
async function loadRoster(teamName) {
  try {
    // Determine stat type based on filter
    const statType = currentRosterFilter === 'conference' ? 'statsConference' : 'stats';
    const url = `${PLAYERS_API_URL}?season=${selectedSeason}&team=${encodeURIComponent(teamName)}&statType=${statType}`;
    console.log('🏀 Loading roster for:', teamName, 'with statType:', statType);
    console.log('🔗 Roster URL:', url);
    
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to load roster: ${response.status}`);
    }
    
    const result = await response.json();
    console.log('📊 Roster response:', result);
    console.log('👥 Number of players:', result.data ? result.data.length : 0);
    
    rosterData = result.data || [];
    
    renderRoster();
  } catch (error) {
    console.error('Error loading roster:', error);
    document.getElementById('rosterSection').style.display = 'none';
  }
}

// Display roster table
async function displayRoster() {
  // If filter changed, reload data
  const teamSelect = document.getElementById('teamSelect');
  const teamName = teamSelect.options[teamSelect.selectedIndex]?.dataset.name;
  
  if (teamName) {
    await loadRoster(teamName);
    return;
  }
  
  // Otherwise just render existing data
  renderRoster();
}

// Render roster table with current data
function renderRoster() {
  const tbody = document.getElementById('rosterBody');
  tbody.innerHTML = '';
  
  console.log('📋 Displaying roster with', rosterData.length, 'players');
  
  if (rosterData.length === 0) {
    const row = document.createElement('tr');
    row.innerHTML = '<td colspan="8" style="text-align: center;">No roster data available</td>';
    tbody.appendChild(row);
    document.getElementById('rosterSection').style.display = 'block';
  } else {
    rosterData.forEach(player => {
      console.log('👤 Player:', player.fullName, player);
      const row = createRosterRow(player);
      tbody.appendChild(row);
    });
    document.getElementById('rosterSection').style.display = 'block';
    
    // Initialize sorting handlers
    initializeRosterTableSorting();
  }
}

// Create a roster row
function createRosterRow(player) {
  const row = document.createElement('tr');
  
  const fgPct = player.fgpt || '0.0';
  const fg3Pct = player.fgpt3 || '0.0';
  const ftPct = player.ftpt || '0.0';
  
  row.innerHTML = `
    <td class="sticky-col">${player.fullName}</td>
    <td>${player.gp || 0}</td>
    <td>${player.ptspg || '0.0'}</td>
    <td>${player.trebpg || '0.0'}</td>
    <td>${player.astpg || '0.0'}</td>
    <td>${fgPct}</td>
    <td>${fg3Pct}</td>
    <td>${ftPct}</td>
  `;
  
  return row;
}

// Display schedule
function displaySchedule() {
  const events = teamData.events || [];
  
  // Calculate records for summary - filter for completed games with scores
  const allGames = events.filter(e => e.event && e.event.result && e.event.result.hasScores);
  const confGames = allGames.filter(e => e.event.conference === true);
  const homeGames = allGames.filter(e => e.event.home === true);
  const awayGames = allGames.filter(e => e.event.home === false && !e.event.neutralSite);
  const last10 = allGames.slice(-10);
  
  document.getElementById('overallRecord').textContent = getRecordString(allGames);
  document.getElementById('conferenceRecord').textContent = getRecordString(confGames);
  document.getElementById('homeRecord').textContent = getRecordString(homeGames);
  document.getElementById('awayRecord').textContent = getRecordString(awayGames);
  document.getElementById('last10Record').textContent = getRecordString(last10);
  
  renderSchedule();
  document.getElementById('scheduleSection').style.display = 'block';
}

// Render schedule based on current filter
function renderSchedule() {
  const events = teamData.events || [];
  let filteredSchedule = [...events];
  
  // Apply filter
  switch (currentScheduleFilter) {
    case 'completed':
      filteredSchedule = events.filter(e => e.event && e.event.result && e.event.result.hasScores);
      break;
    case 'upcoming':
      filteredSchedule = events.filter(e => !e.event || !e.event.result || !e.event.result.hasScores);
      break;
    case 'conference':
      filteredSchedule = events.filter(e => e.event && e.event.conference === true);
      break;
  }
  
  const tbody = document.getElementById('scheduleBody');
  tbody.innerHTML = '';
  
  if (filteredSchedule.length === 0) {
    const row = document.createElement('tr');
    row.innerHTML = '<td colspan="6" style="text-align: center;">No games found</td>';
    tbody.appendChild(row);
    return;
  }
  
  filteredSchedule.forEach(game => {
    const row = createScheduleRow(game);
    tbody.appendChild(row);
  });
}

// Create schedule row
function createScheduleRow(eventData) {
  const row = document.createElement('tr');
  const event = eventData.event;
  const isCompleted = event && event.result && event.result.hasScores;
  
  let result = '-';
  let score = '-';
  let resultClass = '';
  
  if (isCompleted) {
    result = event.result.descriptionShortWithOT || event.result.description.charAt(0);
    score = event.result.score || '-';
    
    if (event.result.description === 'Win') {
      resultClass = 'win';
    } else if (event.result.description === 'Loss') {
      resultClass = 'loss';
    }
  }
  
  const location = event.home ? 'vs' : 
                   (!event.home && !event.neutralSite) ? '@' : 'N';
  
  // Build tags array
  const tags = [];
  
  if (event.conference) {
    tags.push('<span class="conference-tag">CONF</span>');
  } else if (event.overall) {
    // Non-conference game
    tags.push('<span class="non-conference-tag">NON-CONF</span>');
  }
  
  // Check for postseason types
  if (event.postseason) {
    if (event.national) {
      tags.push('<span class="nationals-tag">NATIONALS</span>');
    } else {
      tags.push('<span class="playoffs-tag">PLAYOFFS</span>');
    }
  }
  
  const tagsHtml = tags.join(' ');
  
  row.innerHTML = `
    <td>${eventData.eventDateFormatted || 'TBD'}</td>
    <td>${event.opponent ? event.opponent.name : 'TBD'}</td>
    <td>${location}</td>
    <td class="${resultClass}">${result}</td>
    <td>${score}</td>
    <td>${tagsHtml}</td>
  `;
  
  if (!isCompleted) {
    row.classList.add('upcoming-game');
  } else if (resultClass === 'win') {
    row.classList.add('win-row');
  } else if (resultClass === 'loss') {
    row.classList.add('loss-row');
  }
  
  return row;
}

// Get record string from games
function getRecordString(events) {
  if (events.length === 0) return '0-0';
  
  let wins = 0, losses = 0;
  events.forEach(eventData => {
    const event = eventData.event;
    if (event && event.result && event.result.description) {
      if (event.result.description === 'Win') wins++;
      else if (event.result.description === 'Loss') losses++;
    }
  });
  
  return `${wins}-${losses}`;
}

// Show error message
function showError(message) {
  const errorDiv = document.getElementById('error');
  errorDiv.textContent = message;
  errorDiv.style.display = 'block';
  setTimeout(() => {
    errorDiv.style.display = 'none';
  }, 5000);
}

// Sorting functionality for splits table
let currentSplitSort = { column: null, direction: 'desc' };
let splitsArray = []; // Store splits data for sorting

function initializeSplitsTableSorting() {
  const headers = document.querySelectorAll('#splitsTable thead th.sortable');
  headers.forEach(header => {
    header.addEventListener('click', () => {
      const column = header.dataset.sort;
      sortSplitsTable(column);
    });
  });
}

function sortSplitsTable(column) {
  const tbody = document.getElementById('splitsBody');
  
  // Convert current rows to array
  const rows = Array.from(tbody.querySelectorAll('tr'));
  
  // Determine sort direction
  if (currentSplitSort.column === column) {
    currentSplitSort.direction = currentSplitSort.direction === 'asc' ? 'desc' : 'asc';
  } else {
    currentSplitSort.column = column;
    currentSplitSort.direction = 'desc'; // Default to descending
  }
  
  // Map columns to cell indices
  const columnIndex = {
    'gp': 1,
    'w': 2,
    'l': 3,
    'pct': 4,
    'ppg': 5,
    'oppg': 6,
    'margin': 7,
    'fgPct': 8,
    'fg3Pct': 9,
    'ftPct': 10,
    'rpg': 11,
    'apg': 12,
    'topg': 13,
    'spg': 14,
    'bpg': 15
  };
  
  const index = columnIndex[column];
  if (index === undefined) return;
  
  // Sort rows
  rows.sort((a, b) => {
    const aText = a.cells[index].textContent.trim();
    const bText = b.cells[index].textContent.trim();
    
    // Convert to numbers, handling percentage signs and dashes
    const aVal = aText === '-' ? -Infinity : parseFloat(aText.replace(/[^0-9.-]/g, ''));
    const bVal = bText === '-' ? -Infinity : parseFloat(bText.replace(/[^0-9.-]/g, ''));
    
    if (isNaN(aVal) && isNaN(bVal)) return 0;
    if (isNaN(aVal)) return 1;
    if (isNaN(bVal)) return -1;
    
    return currentSplitSort.direction === 'asc' ? aVal - bVal : bVal - aVal;
  });
  
  // Update header classes
  document.querySelectorAll('#splitsTable thead th').forEach(th => {
    th.classList.remove('sort-asc', 'sort-desc');
  });
  const header = document.querySelector(`#splitsTable thead th[data-sort="${column}"]`);
  if (header) {
    header.classList.add(currentSplitSort.direction === 'asc' ? 'sort-asc' : 'sort-desc');
  }
  
  // Re-append sorted rows
  tbody.innerHTML = '';
  rows.forEach(row => tbody.appendChild(row));
}

// Sorting functionality for roster table
let currentRosterSort = { column: null, direction: 'desc' };

function initializeRosterTableSorting() {
  const headers = document.querySelectorAll('#rosterTable thead th.sortable');
  headers.forEach(header => {
    header.addEventListener('click', () => {
      const column = header.dataset.sort;
      sortRosterTable(column);
    });
  });
}

function sortRosterTable(column) {
  // Determine sort direction
  if (currentRosterSort.column === column) {
    currentRosterSort.direction = currentRosterSort.direction === 'asc' ? 'desc' : 'asc';
  } else {
    currentRosterSort.column = column;
    currentRosterSort.direction = 'desc'; // Default to descending
  }
  
  // Map columns to player data fields
  const columnMap = {
    'gp': 'gp',
    'ppg': 'ptspg',
    'rpg': 'trebpg',
    'apg': 'astpg',
    'fgPct': 'fgpt',
    'fg3Pct': 'fgpt3',
    'ftPct': 'ftpt'
  };
  
  const field = columnMap[column];
  if (!field) return;
  
  // Sort roster data
  rosterData.sort((a, b) => {
    let aVal = parseFloat(a[field]) || 0;
    let bVal = parseFloat(b[field]) || 0;
    
    return currentRosterSort.direction === 'asc' ? aVal - bVal : bVal - aVal;
  });
  
  // Update header classes
  document.querySelectorAll('#rosterTable thead th').forEach(th => {
    th.classList.remove('sort-asc', 'sort-desc');
  });
  const header = document.querySelector(`#rosterTable thead th[data-sort="${column}"]`);
  if (header) {
    header.classList.add(currentRosterSort.direction === 'asc' ? 'sort-asc' : 'sort-desc');
  }
  
  // Re-render table
  const tbody = document.getElementById('rosterBody');
  tbody.innerHTML = '';
  rosterData.forEach(player => {
    const row = createRosterRow(player);
    tbody.appendChild(row);
  });
}
