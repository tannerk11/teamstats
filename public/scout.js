// Scout page - Individual team analysis
import { SEASONS } from '../config/seasons.js';
import { TEAMS_BY_SEASON } from '../config/teams.js';

// State management
let selectedSeason = null;
let selectedConference = null;
let selectedTeam = null;
let teamData = null;
let currentScheduleFilter = 'all';

// Initialize page
document.addEventListener('DOMContentLoaded', () => {
  initializeSelectors();
  attachEventListeners();
});

// Initialize season, conference, and team selectors
function initializeSelectors() {
  const seasonSelect = document.getElementById('seasonSelect');
  
  // Populate seasons
  SEASONS.forEach(season => {
    const option = document.createElement('option');
    option.value = season.id;
    option.textContent = season.name;
    seasonSelect.appendChild(option);
  });
}

// Attach event listeners
function attachEventListeners() {
  document.getElementById('seasonSelect').addEventListener('change', onSeasonChange);
  document.getElementById('conferenceSelect').addEventListener('change', onConferenceChange);
  document.getElementById('teamSelect').addEventListener('change', onTeamChange);
  
  // Schedule filter buttons
  document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
      e.target.classList.add('active');
      currentScheduleFilter = e.target.dataset.filter;
      renderSchedule();
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
    
    const response = await fetch(selectedTeam);
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
  
  const overallStats = calculateSplitStats(teamData.schedule);
  document.getElementById('teamRecord').textContent = 
    `${overallStats.wins}-${overallStats.losses} (${overallStats.winPct})`;
  document.getElementById('teamConference').textContent = selectedConference;
  
  // Calculate and display splits
  displaySplits();
  
  // Display schedule
  displaySchedule();
}

// Calculate stats for a subset of games
function calculateSplitStats(games) {
  if (!games || games.length === 0) {
    return {
      gp: 0, wins: 0, losses: 0, winPct: '.000',
      ppg: 0, oppg: 0, margin: 0,
      fgPct: 0, fg3Pct: 0, ftPct: 0,
      rpg: 0, apg: 0, topg: 0, spg: 0, bpg: 0
    };
  }
  
  const completed = games.filter(g => g.score && g.opponentScore);
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
  
  completed.forEach(game => {
    const pts = parseInt(game.score) || 0;
    const oppPts = parseInt(game.opponentScore) || 0;
    
    if (pts > oppPts) wins++;
    else if (pts < oppPts) losses++;
    
    totalPts += pts;
    totalOppPts += oppPts;
    
    if (game.fgm !== undefined) totalFGM += game.fgm;
    if (game.fga !== undefined) totalFGA += game.fga;
    if (game.fg3m !== undefined) total3PM += game.fg3m;
    if (game.fg3a !== undefined) total3PA += game.fg3a;
    if (game.ftm !== undefined) totalFTM += game.ftm;
    if (game.fta !== undefined) totalFTA += game.fta;
    if (game.reb !== undefined) totalReb += game.reb;
    if (game.ast !== undefined) totalAst += game.ast;
    if (game.to !== undefined) totalTO += game.to;
    if (game.stl !== undefined) totalStl += game.stl;
    if (game.blk !== undefined) totalBlk += game.blk;
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
  const schedule = teamData.schedule || [];
  
  // Calculate different splits
  const overall = calculateSplitStats(schedule);
  const home = calculateSplitStats(schedule.filter(g => g.location === 'home'));
  const away = calculateSplitStats(schedule.filter(g => g.location === 'away'));
  const neutral = calculateSplitStats(schedule.filter(g => g.location === 'neutral'));
  const conference = calculateSplitStats(schedule.filter(g => g.conference === true));
  const nonConference = calculateSplitStats(schedule.filter(g => g.conference === false));
  
  const splits = [
    { name: 'Overall', ...overall },
    { name: 'Home', ...home },
    { name: 'Away', ...away },
    { name: 'Neutral', ...neutral },
    { name: 'Conference', ...conference },
    { name: 'Non-Conference', ...nonConference }
  ];
  
  const tbody = document.getElementById('splitsBody');
  tbody.innerHTML = '';
  
  splits.forEach(split => {
    if (split.gp > 0) {
      const row = createSplitRow(split);
      tbody.appendChild(row);
    }
  });
  
  document.getElementById('splitsSection').style.display = 'block';
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

// Display schedule
function displaySchedule() {
  const schedule = teamData.schedule || [];
  
  // Calculate records for summary
  const allGames = schedule.filter(g => g.score && g.opponentScore);
  const confGames = allGames.filter(g => g.conference === true);
  const homeGames = allGames.filter(g => g.location === 'home');
  const awayGames = allGames.filter(g => g.location === 'away');
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
  const schedule = teamData.schedule || [];
  let filteredSchedule = [...schedule];
  
  // Apply filter
  switch (currentScheduleFilter) {
    case 'completed':
      filteredSchedule = schedule.filter(g => g.score && g.opponentScore);
      break;
    case 'upcoming':
      filteredSchedule = schedule.filter(g => !g.score || !g.opponentScore);
      break;
    case 'conference':
      filteredSchedule = schedule.filter(g => g.conference === true);
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
function createScheduleRow(game) {
  const row = document.createElement('tr');
  const isCompleted = game.score && game.opponentScore;
  
  let result = '-';
  let score = '-';
  let resultClass = '';
  
  if (isCompleted) {
    const pts = parseInt(game.score);
    const oppPts = parseInt(game.opponentScore);
    
    if (pts > oppPts) {
      result = 'W';
      resultClass = 'win';
    } else if (pts < oppPts) {
      result = 'L';
      resultClass = 'loss';
    } else {
      result = 'T';
      resultClass = '';
    }
    
    score = `${pts}-${oppPts}`;
  }
  
  const location = game.location === 'home' ? 'vs' : 
                   game.location === 'away' ? '@' : 'N';
  
  const conferenceTag = game.conference ? '<span class="conference-tag">CONF</span>' : '';
  
  row.innerHTML = `
    <td>${game.date || 'TBD'}</td>
    <td>${game.opponent || 'TBD'}</td>
    <td>${location}</td>
    <td class="${resultClass}">${result}</td>
    <td>${score}</td>
    <td>${conferenceTag}</td>
  `;
  
  if (!isCompleted) {
    row.classList.add('upcoming-game');
  }
  
  return row;
}

// Get record string from games
function getRecordString(games) {
  if (games.length === 0) return '0-0';
  
  let wins = 0, losses = 0;
  games.forEach(game => {
    const pts = parseInt(game.score) || 0;
    const oppPts = parseInt(game.opponentScore) || 0;
    if (pts > oppPts) wins++;
    else if (pts < oppPts) losses++;
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
