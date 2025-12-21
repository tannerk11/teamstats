// Frontend JavaScript for player stats table
const API_URL = window.location.hostname === 'localhost' 
  ? 'http://localhost:3000/api/players'
  : '/api/players';

const SEASONS_API_URL = window.location.hostname === 'localhost' 
  ? 'http://localhost:3000/api/seasons'
  : '/api/seasons';

let playersData = [];
let allPlayersData = [];
let currentSort = { column: 'ptspg', direction: 'desc' };
let filterOptions = {};
let currentStatType = 'stats';
let currentSeason = '';

// Pagination
const PLAYERS_PER_PAGE = 100;
let currentPage = 1;
let totalPages = 1;

// Column definitions with labels
const PLAYER_COLUMNS = {
  fullName: { label: 'Player', sortable: true },
  team: { label: 'Team', sortable: true },
  position: { label: 'Pos', sortable: true },
  year: { label: 'Year', sortable: true },
  gp: { label: 'GP', sortable: true },
  fgm: { label: 'FGM', sortable: true },
  fga: { label: 'FGA', sortable: true },
  fgm3: { label: '3PM', sortable: true },
  fga3: { label: '3PA', sortable: true },
  ptspg: { label: 'PPG', sortable: true },
  fgmpg: { label: 'FGMPG', sortable: true },
  fgapg: { label: 'FGAPG', sortable: true },
  fgpt: { label: 'FG%', sortable: true },
  fgm3pg: { label: '3PMPG', sortable: true },
  fga3pg: { label: '3PAPG', sortable: true },
  fgpt3: { label: '3P%', sortable: true },
  ftmpg: { label: 'FTMPG', sortable: true },
  ftapg: { label: 'FTAPG', sortable: true },
  ftpt: { label: 'FT%', sortable: true },
  trebpg: { label: 'RPG', sortable: true },
  orebpg: { label: 'ORPG', sortable: true },
  drebpg: { label: 'DRPG', sortable: true },
  astpg: { label: 'APG', sortable: true },
  stlpg: { label: 'SPG', sortable: true },
  blkpg: { label: 'BPG', sortable: true },
  topg: { label: 'TPG', sortable: true },
  ato: { label: 'A/TO', sortable: true },
  minpg: { label: 'MPG', sortable: true }
};

// Load available seasons and populate dropdown
async function loadSeasons() {
  try {
    const response = await fetch(SEASONS_API_URL);
    const result = await response.json();
    
    const seasonFilter = document.getElementById('seasonFilter');
    seasonFilter.innerHTML = '';
    
    // Filter to only show 2025-26 since player data not available for previous seasons
    const availableSeasons = result.seasons.filter(season => season.id === '2025-26');
    
    availableSeasons.forEach(season => {
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
      fetchPlayers(); // Reload data for new season
    });
    
    console.log(`✅ Loaded ${availableSeasons.length} seasons for players, current: ${currentSeason}`);
  } catch (error) {
    console.error('Error loading seasons:', error);
    // Set default season if loading fails
    currentSeason = '2025-26';
  }
}

// Fetch player data from API
async function fetchPlayers() {
  const loading = document.getElementById('loading');
  const error = document.getElementById('error');
  const playersTable = document.getElementById('playersTable');
  
  loading.style.display = 'block';
  error.style.display = 'none';
  playersTable.style.display = 'none';
  
  try {
    const statType = document.getElementById('statTypeFilter').value;
    const conference = document.getElementById('conferenceFilter').value;
    const team = document.getElementById('teamFilter').value;
    
    const params = new URLSearchParams();
    params.append('season', currentSeason); // Always include season
    params.append('statType', statType);
    if (conference !== 'all') params.append('conference', conference);
    if (team !== 'all') params.append('team', team);
    params.append('_t', Date.now());
    
    const url = `${API_URL}?${params.toString()}`;
    console.log('Fetching players:', url);
    
    const response = await fetch(url, { cache: 'no-store' });
    const result = await response.json();
    
    if (result.success) {
      // Calculate per-game stats from totals
      allPlayersData = result.data.map(player => {
        const gp = player.gp || 1; // Avoid division by zero
        return {
          ...player,
          fgmpg: player.fgm ? (player.fgm / gp) : 0,
          fgapg: player.fga ? (player.fga / gp) : 0,
          fgm3pg: player.fgm3 ? (player.fgm3 / gp) : 0,
          fga3pg: player.fga3 ? (player.fga3 / gp) : 0,
          ftmpg: player.ftm ? (player.ftm / gp) : 0,
          ftapg: player.fta ? (player.fta / gp) : 0,
          orebpg: player.oreb ? (player.oreb / gp) : 0,
          drebpg: player.dreb ? (player.dreb / gp) : 0
        };
      });
      playersData = allPlayersData;
      filterOptions = result.filterOptions;
      currentStatType = result.statType;
      
      updateFilterOptions();
      updateLastUpdated(result.lastUpdated);
      renderTable();
      
      loading.style.display = 'none';
      playersTable.style.display = 'table';
      
      console.log(`✅ Loaded ${playersData.length} players`);
    } else {
      throw new Error(result.error || 'Failed to fetch player data');
    }
  } catch (err) {
    console.error('Error fetching players:', err);
    loading.style.display = 'none';
    error.textContent = `Error: ${err.message}`;
    error.style.display = 'block';
  }
}

// Update filter dropdowns with available options
function updateFilterOptions() {
  if (!filterOptions) return;
  
  // Update conference dropdown
  const conferenceSelect = document.getElementById('conferenceFilter');
  const currentConference = conferenceSelect.value;
  conferenceSelect.innerHTML = '<option value="all">All Conferences</option>';
  filterOptions.conferences.forEach(conf => {
    const option = document.createElement('option');
    option.value = conf;
    option.textContent = conf;
    conferenceSelect.appendChild(option);
  });
  conferenceSelect.value = currentConference;
  
  // Update team dropdown
  const teamSelect = document.getElementById('teamFilter');
  const currentTeam = teamSelect.value;
  teamSelect.innerHTML = '<option value="all">All Teams</option>';
  
  // Filter teams by selected conference if applicable
  let teams = filterOptions.teams;
  if (currentConference !== 'all') {
    teams = [...new Set(allPlayersData
      .filter(p => p.conference === currentConference)
      .map(p => p.team)
      .filter(Boolean))].sort();
  }
  
  teams.forEach(team => {
    const option = document.createElement('option');
    option.value = team;
    option.textContent = team;
    teamSelect.appendChild(option);
  });
  teamSelect.value = currentTeam;
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

// Update pagination info
function updatePaginationInfo() {
  totalPages = Math.ceil(playersData.length / PLAYERS_PER_PAGE);
  const start = (currentPage - 1) * PLAYERS_PER_PAGE + 1;
  const end = Math.min(currentPage * PLAYERS_PER_PAGE, playersData.length);
  
  document.getElementById('playerCount').textContent = 
    `Showing ${start}-${end} of ${playersData.length} players (Page ${currentPage} of ${totalPages})`;
  
  // Update pagination buttons
  document.getElementById('prevPage').disabled = currentPage === 1;
  document.getElementById('nextPage').disabled = currentPage === totalPages;
  document.getElementById('pageInfo').textContent = `${currentPage} / ${totalPages}`;
}

// Go to specific page
function goToPage(page) {
  currentPage = Math.max(1, Math.min(page, totalPages));
  renderTable();
  
  // Scroll to top of table
  document.querySelector('.table-container').scrollTop = 0;
}

// Next page
function nextPage() {
  if (currentPage < totalPages) {
    goToPage(currentPage + 1);
  }
}

// Previous page
function prevPage() {
  if (currentPage > 1) {
    goToPage(currentPage - 1);
  }
}

// Render the table
function renderTable() {
  if (playersData.length === 0) {
    document.getElementById('playerCount').textContent = 'No players found';
    document.getElementById('paginationControls').style.display = 'none';
    return;
  }
  
  // Show pagination controls
  document.getElementById('paginationControls').style.display = 'flex';
  
  // Sort data
  const sorted = [...playersData].sort((a, b) => {
    const aVal = a[currentSort.column];
    const bVal = b[currentSort.column];
    
    if (aVal === null || aVal === undefined) return 1;
    if (bVal === null || bVal === undefined) return -1;
    
    // Check if sorting by text columns (name, team, position, year)
    const textColumns = ['fullName', 'team', 'position', 'year'];
    if (textColumns.includes(currentSort.column)) {
      const aStr = String(aVal || '');
      const bStr = String(bVal || '');
      return currentSort.direction === 'asc' 
        ? aStr.localeCompare(bStr)
        : bStr.localeCompare(aStr);
    }
    
    // For numeric columns, convert strings to numbers
    const aNum = Number(aVal);
    const bNum = Number(bVal);
    
    // Handle NaN cases
    if (isNaN(aNum)) return 1;
    if (isNaN(bNum)) return -1;
    
    return currentSort.direction === 'asc' 
      ? aNum - bNum
      : bNum - aNum;
  });
  
  // Render header
  const header = document.getElementById('tableHeader');
  header.innerHTML = '';
  
  Object.entries(PLAYER_COLUMNS).forEach(([key, config]) => {
    const th = document.createElement('th');
    th.textContent = config.label;
    th.className = 'sortable';
    
    // Add specific class for sticky column (player name)
    if (key === 'fullName') {
      th.classList.add('player-name-header');
    }
    
    if (currentSort.column === key) {
      th.classList.add('sorted');
      th.classList.add(currentSort.direction);
    }
    
    if (config.sortable) {
      th.addEventListener('click', () => sortBy(key));
    }
    
    header.appendChild(th);
  });
  
  // Calculate pagination
  const startIndex = (currentPage - 1) * PLAYERS_PER_PAGE;
  const endIndex = startIndex + PLAYERS_PER_PAGE;
  const paginatedData = sorted.slice(startIndex, endIndex);
  
  // Update pagination info
  updatePaginationInfo();
  
  // Render body
  const tbody = document.getElementById('tableBody');
  tbody.innerHTML = '';
  
  paginatedData.forEach((player, index) => {
    const tr = document.createElement('tr');
    
    Object.keys(PLAYER_COLUMNS).forEach(key => {
      const td = document.createElement('td');
      const value = player[key];
      
      if (key === 'fullName') {
        td.textContent = value || '';
        td.className = 'player-name';
      } else if (key === 'team') {
        td.textContent = value || '';
        td.className = 'player-team-cell';
      } else if (key === 'position' || key === 'year') {
        td.textContent = value || '';
      } else if (key === 'gp') {
        td.textContent = value || 0;
      } else if (key === 'fgm' || key === 'fga' || key === 'fgm3' || key === 'fga3') {
        // Total counting stats (not per game)
        const numValue = Number(value);
        td.textContent = !isNaN(numValue) ? Math.round(numValue) : 0;
      } else if (key === 'fgpt' || key === 'fgpt3' || key === 'ftpt') {
        // Percentage fields - already in percentage format (44.4 = 44.4%)
        const numValue = Number(value);
        td.textContent = !isNaN(numValue) && numValue > 0 ? numValue.toFixed(1) + '%' : '0.0%';
      } else if (key.includes('pg') || key === 'ato') {
        // Per game stats and ratio stats
        const numValue = Number(value);
        td.textContent = !isNaN(numValue) && numValue > 0 ? numValue.toFixed(1) : '0.0';
      } else {
        // Totals
        const numValue = Number(value);
        td.textContent = !isNaN(numValue) ? Math.round(numValue) : 0;
      }
      
      tr.appendChild(td);
    });
    
    tbody.appendChild(tr);
  });
}

// Sort by column
function sortBy(column) {
  if (currentSort.column === column) {
    currentSort.direction = currentSort.direction === 'asc' ? 'desc' : 'asc';
  } else {
    currentSort.column = column;
    currentSort.direction = column === 'fullName' || column === 'team' ? 'asc' : 'desc';
  }
  currentPage = 1; // Reset to first page when sorting
  renderTable();
}

// Apply filters
function applyFilters() {
  currentPage = 1; // Reset to first page when filtering
  fetchPlayers();
}

// Reset filters
function resetFilters() {
  document.getElementById('statTypeFilter').value = 'stats';
  document.getElementById('conferenceFilter').value = 'all';
  document.getElementById('teamFilter').value = 'all';
  fetchPlayers();
}

// Refresh data
async function refreshData() {
  const btn = document.getElementById('refreshBtn');
  btn.disabled = true;
  btn.textContent = 'Refreshing...';
  
  try {
    const refreshUrl = window.location.hostname === 'localhost' 
      ? 'http://localhost:3000/api/refresh'
      : '/api/refresh';
    
    await fetch(refreshUrl, { method: 'POST' });
    await fetchPlayers();
    btn.textContent = 'Refresh Data';
  } catch (error) {
    console.error('Error refreshing:', error);
    btn.textContent = 'Refresh Failed';
    setTimeout(() => btn.textContent = 'Refresh Data', 2000);
  } finally {
    btn.disabled = false;
  }
}

// Update team dropdown when conference changes
document.getElementById('conferenceFilter').addEventListener('change', () => {
  updateFilterOptions();
});

// Event listeners
document.getElementById('applyFilters').addEventListener('click', applyFilters);
document.getElementById('resetFilters').addEventListener('click', resetFilters);
document.getElementById('refreshBtn').addEventListener('click', refreshData);
document.getElementById('prevPage').addEventListener('click', prevPage);
document.getElementById('nextPage').addEventListener('click', nextPage);

// Initialize: Load seasons first, then fetch players
loadSeasons().then(() => {
  fetchPlayers();
});
