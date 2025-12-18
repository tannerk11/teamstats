/**
 * Extract Teams from Conference Page(s)
 * 
 * This script fetches a conference page, finds all team page links,
 * visits each team page, and extracts the JSON URL from the network calls
 * 
 * Usage: 
 *   Extract single conference: node scripts/extractConferenceTeams.js <conference_url>
 *   Extract all conferences: node scripts/extractConferenceTeams.js
 * 
 * Example:
 *   node scripts/extractConferenceTeams.js "https://naiastats.prestosports.com/sports/mbkb/2025-26/conf/Appalachian/teams?jsRendering=true"
 */

// ALREADY EXTRACTED - These conferences are in config/teams.js
const ALREADY_EXTRACTED = [
  'https://naiastats.prestosports.com/sports/mbkb/2025-26/conf/Cascade/teams?jsRendering=true',
  'https://naiastats.prestosports.com/sports/mbkb/2025-26/conf/American_Midwest/teams?jsRendering=true',
  'https://naiastats.prestosports.com/sports/mbkb/2025-26/conf/Appalachian/teams?jsRendering=true',
];

// TO EXTRACT - Add new conference URLs here
const CONFERENCE_URLS = [
  // Add more conference URLs below
];

async function getTeamPagesFromTeamsData(conferenceUrl) {
  try {
    const response = await fetch(conferenceUrl);
    const html = await response.text();
    
    // Find the teamsData JSON URL in the page
    const teamsDataMatch = html.match(/prestosports-downloads\.s3[^"']*\/teamsData\/[a-z0-9]+\.json/i);
    
    if (!teamsDataMatch) {
      return [];
    }
    
    const teamsDataUrl = `https://${teamsDataMatch[0]}`;
    
    // Fetch the teams data JSON
    const teamsResponse = await fetch(teamsDataUrl);
    const teamsData = await teamsResponse.json();
    
    if (!teamsData.teams || !Array.isArray(teamsData.teams)) {
      return [];
    }
    
    // Build team page URLs from the pageName field
    const baseUrl = new URL(conferenceUrl);
    const confPath = baseUrl.pathname.replace(/\?.*$/, '');
    
    return teamsData.teams.map(team => ({
      name: team.name,
      pageUrl: `${baseUrl.origin}${confPath}/${team.pageName}?jsRendering=true&view=profile`
    }));
    
  } catch (error) {
    console.log(`  ❌ Error extracting team data: ${error.message}`);
    return [];
  }
}

async function extractJsonUrlFromTeamPage(teamPageUrl) {
  try {
    const response = await fetch(teamPageUrl);
    const html = await response.text();
    
    // Look for the teamData JSON URL pattern
    const jsonUrlMatch = html.match(/prestosports-downloads\.s3[^"']*\/teamData\/[a-z0-9]+\.json/i);
    
    if (!jsonUrlMatch) {
      return null;
    }
    
    const jsonUrl = `https://${jsonUrlMatch[0]}`;
    
    // Fetch the JSON to get the team name
    const jsonResponse = await fetch(jsonUrl);
    const jsonData = await jsonResponse.json();
    const teamName = jsonData.attributes?.school_name || 'Unknown Team';
    
    return {
      name: teamName,
      url: jsonUrl
    };
    
  } catch (error) {
    return null;
  }
}

async function extractTeamsFromConference(conferenceUrl) {
  try {
    console.log(`\n🔍 Fetching conference page: ${conferenceUrl}`);
    
    // Step 1: Get all team info from conference teamsData JSON
    const teamPages = await getTeamPagesFromTeamsData(conferenceUrl);
    console.log(`  ✅ Found ${teamPages.length} teams`);
    
    if (teamPages.length === 0) {
      console.log(`  ❌ No teams found`);
      return [];
    }
    
    console.log(`\n  📊 Visiting each team page to extract JSON URLs...\n`);
    
    const results = [];
    
    // Step 2: Visit each team page and extract the actual JSON URL
    for (const teamPage of teamPages) {
      console.log(`    🔍 ${teamPage.name}...`);
      
      const teamData = await extractJsonUrlFromTeamPage(teamPage.pageUrl);
      
      if (teamData) {
        console.log(`      ✅ Found JSON`);
        results.push(teamData);
      } else {
        console.log(`      ❌ Failed to extract JSON URL`);
      }
      
      // Small delay to be nice to the server
      await new Promise(resolve => setTimeout(resolve, 400));
    }
    
    return results;
    
  } catch (error) {
    console.log(`  ❌ Error: ${error.message}`);
    return [];
  }
}

async function extractAllConferences() {
  console.log('🚀 Extracting all teams from conference pages...');
  console.log('═══════════════════════════════════════════════════════════\n');
  
  const allResults = [];
  
  for (const conferenceUrl of CONFERENCE_URLS) {
    const teams = await extractTeamsFromConference(conferenceUrl);
    allResults.push(...teams);
    
    // Small delay between conferences
    if (CONFERENCE_URLS.indexOf(conferenceUrl) < CONFERENCE_URLS.length - 1) {
      await new Promise(resolve => setTimeout(resolve, 500));
    }
  }
  
  console.log('\n═══════════════════════════════════════════════════════════');
  console.log('📋 RESULTS - Add these to config/teams.js:');
  console.log('═══════════════════════════════════════════════════════════\n');
  
  for (const team of allResults) {
    console.log(`  {`);
    console.log(`    name: '${team.name}',`);
    console.log(`    url: '${team.url}',`);
    console.log(`    conference: 'CONFERENCE_NAME_HERE'`);
    console.log(`  },`);
  }
  
  console.log('\n═══════════════════════════════════════════════════════════');
  console.log(`✅ Successfully extracted ${allResults.length} teams from ${CONFERENCE_URLS.length} conference(s)\n`);
}

// Main execution
async function main() {
  // Check if a single conference URL was provided as command line argument
  const singleConferenceUrl = process.argv[2];
  
  if (singleConferenceUrl) {
    // Extract single conference mode
    console.log('🚀 Extracting teams from single conference...');
    console.log('═══════════════════════════════════════════════════════════\n');
    
    const teams = await extractTeamsFromConference(singleConferenceUrl);
    
    console.log('\n═══════════════════════════════════════════════════════════');
    console.log('📋 RESULTS - Add these to config/teams.js:');
    console.log('═══════════════════════════════════════════════════════════\n');
    
    for (const team of teams) {
      console.log(`  {`);
      console.log(`    name: '${team.name}',`);
      console.log(`    url: '${team.url}',`);
      console.log(`    conference: 'CONFERENCE_NAME_HERE'`);
      console.log(`  },`);
    }
    
    console.log('\n═══════════════════════════════════════════════════════════');
    console.log(`✅ Successfully extracted ${teams.length} team(s)\n`);
  } else if (CONFERENCE_URLS.length > 0) {
    // Extract all conferences in CONFERENCE_URLS array
    await extractAllConferences();
  } else {
    console.log('❌ No conference URLs provided!');
    console.log('\nUsage:');
    console.log('  Single conference: node scripts/extractConferenceTeams.js <conference_url>');
    console.log('  Multiple conferences: Add URLs to CONFERENCE_URLS array in the script\n');
    console.log('Example:');
    console.log('  node scripts/extractConferenceTeams.js "https://naiastats.prestosports.com/sports/mbkb/2025-26/conf/SomeConference/teams?jsRendering=true"\n');
  }
}

main().catch(console.error);
