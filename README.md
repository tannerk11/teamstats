# Conference Stats Analyzer

A web application for analyzing and comparing basketball conference statistics across multiple teams.

## Features

- 📊 **Multiple Teams**: Track statistics for all teams in your conference
- 🔄 **Real-time Data**: Fetches fresh data from team APIs
- 📈 **Sortable Columns**: Click any column header to sort
- 🎯 **Custom Statistics**: Calculate advanced metrics like possessions per game
- 🔀 **Split Views**: Toggle between Conference and Overall statistics
- 📌 **Sticky Columns**: Team name column stays fixed while scrolling
- 🕐 **Auto-refresh**: Automatically updates at midnight each day

## Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Add your team URLs:**
   Edit `config/teams.js` and add your team data URLs:
   ```javascript
   export const TEAMS = [
     {
       name: 'Team Name',
       url: 'https://your-team-url.json'
     },
     // Add more teams...
   ];
   ```

3. **Start the server:**
   ```bash
   npm start
   ```

4. **Open in browser:**
   Navigate to `http://localhost:3000`

## Project Structure

```
ConferenceStats/
├── config/
│   └── teams.js          # Team URLs configuration
├── lib/
│   ├── dataFetcher.js    # Handles API data fetching
│   ├── calculator.js     # Custom statistics calculations
│   └── columnLabels.js   # Column name mappings
├── public/
│   ├── index.html        # Main HTML page
│   ├── app.js           # Frontend JavaScript
│   └── styles.css       # Styling
├── server.js            # Express API server
└── package.json         # Dependencies

```

## Customization

### Add Custom Statistics

Edit `lib/calculator.js` to add your own calculated statistics:

```javascript
// Example: Calculate effective field goal percentage
const efg = ((fgm + (0.5 * fgm3)) / fga) * 100;

return {
  ...stats,
  effectiveFGPercent: efg,
};
```

### Control Visible Columns

Edit the `columnsToShow` array in `public/app.js` (around line 65):

```javascript
const columnsToShow = [
  'teamName', 'gp', 'pts', 'ptspg', 'fgpt', 'trebpg', 
  'astpg', 'possessionsPerGame'
];
```

### Add Column Labels

Edit `lib/columnLabels.js` to add readable names for your columns:

```javascript
export const COLUMN_LABELS = {
  myCustomStat: 'My Custom Statistic',
  // ...
};
```

## Scripts

- `npm start` - Start the production server
- `npm run dev` - Start with auto-reload on file changes
- `npm run pull` - Fetch and display stats in terminal

## Technologies

- **Backend**: Node.js, Express
- **Frontend**: Vanilla JavaScript, HTML, CSS
- **Data**: REST API with JSON responses

## License

ISC
