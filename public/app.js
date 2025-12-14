// Frontend JavaScript for sortable table
const API_URL = 'http://localhost:3000/api/stats';

let statsData = [];
let columnLabels = {};
let currentSort = { column: null, direction: 'asc' };
let currentColumns = []; // Store the current column order
let currentSplit = 'conference'; // Current split type

// Fetch data from API
async function fetchStats(split = currentSplit) {
  const loading = document.getElementById('loading');
  const error = document.getElementById('error');
  const tableContainer = document.querySelector('.table-container');
  
  loading.style.display = 'block';
  error.style.display = 'none';
  tableContainer.style.display = 'none';
  
  try {
    const response = await fetch(`${API_URL}?split=${split}`);
    const result = await response.json();
    
    if (result.success) {
      statsData = result.data;
      columnLabels = result.columnLabels || {};
      updateLastUpdated(result.lastUpdated);
      renderTable();
      loading.style.display = 'none';
      tableContainer.style.display = 'block';
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
  
  // Get all unique columns from the data
  const allColumns = new Set();
  statsData.forEach(team => {
    Object.keys(team).forEach(key => allColumns.add(key));
  });
  
  // ====== COLUMN FILTER: Edit this array to show only specific columns ======
  // To show all columns, set columnsToShow = null
  // To show specific columns, list them here:
  const columnsToShow = [
  'teamName', 'gp', 'pts', 'ptspg', 'fgpt', 'fgpt3', 'ftpt', 
  'treb', 'trebpg', 'ast', 'astpg', 'to', 'topg', 'stl', 'blk', 'possessionsPerGame'
];
  
  // Filter and order columns
  let columns;
  if (columnsToShow) {
    // Use the exact order specified in columnsToShow
    columns = columnsToShow.filter(col => allColumns.has(col));
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
  
  // Render header
  const headerRow = document.getElementById('tableHeader');
  headerRow.innerHTML = columns.map(col => 
    `<th class="sortable" data-column="${col}">${getColumnLabel(col)}</th>`
  ).join('');
  
  // Add click handlers to headers
  headerRow.querySelectorAll('th').forEach(th => {
    th.addEventListener('click', () => sortTable(th.dataset.column));
  });
  
  // Render body
  renderTableBody(columns);
}

// Render table body
function renderTableBody(columns) {
  const tbody = document.getElementById('tableBody');
  tbody.innerHTML = statsData.map(team => {
    const cells = columns.map(col => {
      const value = team[col];
      const formatted = formatValue(value);
      const cellClass = col === 'teamName' ? 'team-name' : '';
      return `<td class="${cellClass}">${formatted}</td>`;
    }).join('');
    return `<tr>${cells}</tr>`;
  }).join('');
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
function formatValue(value) {
  if (value == null) return '-';
  
  // If it's already a number, format it
  if (typeof value === 'number') {
    return value.toFixed(2);
  }
  
  // If it's a string, try to parse it as a number
  if (typeof value === 'string') {
    // Remove commas and try to parse
    const cleanValue = value.replace(/,/g, '');
    const numValue = parseFloat(cleanValue);
    
    // If it's a valid number, format it nicely
    if (!isNaN(numValue)) {
      // For whole numbers, don't show decimals
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
document.getElementById('refreshBtn').addEventListener('click', () => fetchStats());
document.getElementById('splitSelector').addEventListener('change', (e) => {
  currentSplit = e.target.value;
  fetchStats(currentSplit);
});
fetchStats();
scheduleNextRefresh();
