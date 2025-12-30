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
- `npm run refresh-urls` - Refresh all team URLs from conference pages (2025-26)
- `npm run refresh-urls:2024` - Refresh team URLs for 2024-25 season
- `npm run refresh-urls:2025` - Refresh team URLs for 2025-26 season

## Automatic URL Refresh

Team data URLs on PrestoSports can change between seasons or during the season. To keep URLs current, run the refresh script periodically:

```bash
npm run refresh-urls
```

### Setting Up Automatic Refresh (Every 2 Days)

**macOS (using launchd):**

Create `~/Library/LaunchAgents/com.conferencestats.refresh.plist`:
```xml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>Label</key>
    <string>com.conferencestats.refresh</string>
    <key>ProgramArguments</key>
    <array>
        <string>/usr/local/bin/node</string>
        <string>/Users/YOUR_USERNAME/Desktop/ConferenceStats/scripts/refreshTeamUrls.js</string>
    </array>
    <key>StartInterval</key>
    <integer>172800</integer><!-- 2 days in seconds -->
    <key>StandardOutPath</key>
    <string>/tmp/conferencestats-refresh.log</string>
    <key>StandardErrorPath</key>
    <string>/tmp/conferencestats-refresh-error.log</string>
</dict>
</plist>
```

Then load it:
```bash
launchctl load ~/Library/LaunchAgents/com.conferencestats.refresh.plist
```

**Linux (using cron):**

Add to crontab (`crontab -e`):
```bash
0 3 */2 * * cd /path/to/ConferenceStats && /usr/bin/node scripts/refreshTeamUrls.js >> /tmp/refresh.log 2>&1
```

This runs at 3 AM every 2 days.

## Technologies

- **Backend**: Node.js, Express
- **Frontend**: Vanilla JavaScript, HTML, CSS
- **Data**: REST API with JSON responses

## License

ISC
