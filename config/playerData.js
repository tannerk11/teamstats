// Configuration file for player data URLs
// Maps conference names to their player data JSON URLs
// Player data is organized by conference, with all players from all teams in each conference

// HOW TO FIND MORE PLAYER DATA URLS:
// 1. Go to a conference page on naiastats.prestosports.com
// 2. Navigate to the Players section
// 3. Inspect network requests (Developer Tools > Network)
// 4. Look for requests to prestosports-downloads.s3.us-west-2.amazonaws.com/playersData/
// 5. The ID in the URL is the conference's player data identifier
// 6. Add it below with the conference name

export const PLAYER_DATA_URLS = [
  {
    conference: 'Cascade Collegiate Conference',
    url: 'https://prestosports-downloads.s3.us-west-2.amazonaws.com/playersData/ockrqc6ca6xs1bw9.json'
  },
  // Add more conferences below as needed
  // Example:
  // {
  //   conference: 'Heart of America',
  //   url: 'https://prestosports-downloads.s3.us-west-2.amazonaws.com/playersData/CONFERENCE_ID_HERE.json'
  // },
];
