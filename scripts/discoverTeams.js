/**
 * Team Discovery Script
 * 
 * This script helps discover new teams to add by:
 * 1. Analyzing opponents from existing teams' schedules
 * 2. Extracting unique team names and IDs
 * 3. Attempting to find their PrestoSports URLs
 * 
 * Usage: node scripts/discoverTeams.js
 */

import { TEAMS } from '../config/teams.js';

async function discoverTeams() {
  console.log('🔍 Discovering teams from existing schedules...\n');
  
  const opponentMap = new Map();
  
  // Fetch data from all existing teams
  for (const team of TEAMS) {
    console.log(`📊 Analyzing ${team.name}...`);
    
    try {
      const response = await fetch(team.url);
      const data = await response.json();
      
      // Extract all opponents
      if (data.events && Array.isArray(data.events)) {
        for (const event of data.events) {
          if (event.event && event.event.opponent) {
            const opp = event.event.opponent;
            const key = opp.name;
            
            if (!opponentMap.has(key)) {
              opponentMap.set(key, {
                name: opp.name,
                cleanName: opp.cleanName,
                teamIds: new Set(),
                playedAgainst: []
              });
            }
            
            const oppData = opponentMap.get(key);
            if (opp.teamId) {
              oppData.teamIds.add(opp.teamId);
            }
            oppData.playedAgainst.push(team.name);
          }
        }
      }
      
      console.log(`  ✓ Found ${data.events?.length || 0} games`);
    } catch (error) {
      console.log(`  ✗ Error fetching ${team.name}: ${error.message}`);
    }
  }
  
  console.log(`\n📋 Found ${opponentMap.size} unique opponents\n`);
  
  // Filter out teams we already have
  const existingTeamNames = new Set(TEAMS.map(t => t.name));
  const newTeams = Array.from(opponentMap.entries())
    .filter(([name, _]) => !existingTeamNames.has(name))
    .map(([name, data]) => ({
      name,
      cleanName: data.cleanName,
      teamIds: Array.from(data.teamIds),
      playedAgainst: data.playedAgainst,
      gamesCount: data.playedAgainst.length
    }))
    .sort((a, b) => b.gamesCount - a.gamesCount);
  
  console.log('═══════════════════════════════════════════════════════════');
  console.log('NEW TEAMS TO POTENTIALLY ADD:');
  console.log('═══════════════════════════════════════════════════════════\n');
  
  for (const team of newTeams) {
    console.log(`📌 ${team.name}`);
    console.log(`   Clean Name: ${team.cleanName}`);
    console.log(`   Games against your teams: ${team.gamesCount}`);
    console.log(`   Played against: ${team.playedAgainst.join(', ')}`);
    console.log(`   Team IDs: ${team.teamIds.join(', ')}`);
    console.log('');
  }
  
  console.log('═══════════════════════════════════════════════════════════');
  console.log(`\n💡 NEXT STEPS:\n`);
  console.log('For each team above:');
  console.log('1. Search for "[Team Name] basketball prestosports" in Google');
  console.log('2. Navigate to their schedule/stats page');
  console.log('3. Open browser DevTools (Network tab)');
  console.log('4. Look for requests to prestosports-downloads.s3.us-west-2.amazonaws.com');
  console.log('5. Copy the JSON URL and add to config/teams.js\n');
  
  // Check if any teamIds might give us clues
  console.log('🔧 EXPERIMENTAL: Testing teamId patterns...\n');
  
  const testTeams = newTeams.slice(0, 3); // Test first 3
  for (const team of testTeams) {
    for (const teamId of team.teamIds) {
      console.log(`Testing ${team.name} with ID ${teamId}...`);
      
      // Try the direct pattern (probably won't work but worth a shot)
      try {
        const testUrl = `https://prestosports-downloads.s3.us-west-2.amazonaws.com/teamData/${teamId}.json`;
        const response = await fetch(testUrl);
        if (response.ok) {
          const data = await response.json();
          console.log(`  ✅ FOUND! URL: ${testUrl}`);
          console.log(`  School: ${data.attributes?.school_name}`);
        } else {
          console.log(`  ✗ Not found (${response.status})`);
        }
      } catch (error) {
        console.log(`  ✗ Error: ${error.message}`);
      }
    }
  }
}

discoverTeams().catch(console.error);
