/**
 * Extract Teams from Conference Page(s)
 * 
 * This script fetches a conference page, finds all team page links,
 * visits each team page, and extracts the JSON URL from the network calls
 * 
 * Usage: 
 *   Extract single conference: node scripts/extractConferenceTeams.js <conference_url>
 *   Extract all conferences for season: node scripts/extractConferenceTeams.js <season>
 * 
 * Example:
 *   node scripts/extractConferenceTeams.js "https://naiastats.prestosports.com/sports/mbkb/2025-26/conf/Appalachian/teams?jsRendering=true"
 *   node scripts/extractConferenceTeams.js "2024-25"
 */

// Conference names to extract (URL slugs from PrestoSports)
// Note: Conference slugs differ between seasons
const CONFERENCES_2025_26 = [
  'Appalachian',
  'American_Midwest', 
  'Cal_Pac',
  'Cascade',
  'Chicagoland',
  'Continental',
  'Crossroads',
  'Frontier',
  'Great_Plains',
  'GSAC',
  'HBCU',
  'Heart',
  'KCAC',
  'Mid-South',
  'Red_River',
  'RSC',
  'SAC',
  'Sooner',
  'SSAC',
  'Sun',
  'WHAC'
];

const CONFERENCES_2024_25 = [
  'Appalachian',
  'American_Midwest', 
  'California_Pacific',
  'Cascade',
  'Chicagoland',
  'Continental',
  'Crossroads',
  'Frontier',
  'Great_Plains',
  'Great_Southwest',
  'HBCU_Conference',
  'Heart_of_America',
  'KCAC',
  'Mid-South',
  'Red_River',
  'River_States',
  'Sooner',
  'Southern_States',
  'The_Sun',
  'Wolverine-Hoosier'
];

// Generate conference URLs for a specific season
function getConferenceUrls(season) {
  const conferences = season === '2024-25' ? CONFERENCES_2024_25 : CONFERENCES_2025_26;
  return conferences.map(conf => 
    `https://naiastats.prestosports.com/sports/mbkb/${season}/conf/${conf}/teams?jsRendering=true`
  );
}

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
    // Extract conference name from URL
    const confMatch = conferenceUrl.match(/\/conf\/([^\/]+)\//);
    const confName = confMatch ? confMatch[1] : 'Unknown';
    
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
        results.push({
          ...teamData,
          conference: confName
        });
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

async function extractAllConferences(season) {
  console.log(`🚀 Extracting all teams for ${season} season...`);
  console.log('═══════════════════════════════════════════════════════════\n');
  
  const conferenceUrls = getConferenceUrls(season);
  const allResults = [];
  
  for (const conferenceUrl of conferenceUrls) {
    const teams = await extractTeamsFromConference(conferenceUrl);
    allResults.push(...teams);
    
    // Small delay between conferences
    if (conferenceUrls.indexOf(conferenceUrl) < conferenceUrls.length - 1) {
      await new Promise(resolve => setTimeout(resolve, 500));
    }
  }
  
  console.log('\n═══════════════════════════════════════════════════════════');
  console.log(`📋 RESULTS for ${season} - Add these to config/teams.js:`);
  console.log('═══════════════════════════════════════════════════════════\n');
  
  for (const team of allResults) {
    console.log(`  {`);
    console.log(`    name: '${team.name}',`);
    console.log(`    url: '${team.url}',`);
    console.log(`    conference: '${team.conference}'`);
    console.log(`  },`);
  }
  
  console.log('\n═══════════════════════════════════════════════════════════');
  console.log(`✅ Successfully extracted ${allResults.length} teams from ${conferenceUrls.length} conference(s) for ${season} season\n`);
}

// Main execution
async function main() {
  const arg = process.argv[2];
  
  if (!arg) {
    console.log('❌ No argument provided!');
    console.log('\nUsage:');
    console.log('  Season mode: node scripts/extractConferenceTeams.js <season>');
    console.log('  Single conference: node scripts/extractConferenceTeams.js <conference_url>\n');
    console.log('Examples:');
    console.log('  node scripts/extractConferenceTeams.js "2024-25"');
    console.log('  node scripts/extractConferenceTeams.js "https://naiastats.prestosports.com/sports/mbkb/2025-26/conf/Appalachian/teams?jsRendering=true"\n');
    return;
  }
  
  // Check if argument is a season (e.g., "2024-25") or a full URL
  if (arg.startsWith('http')) {
    // Single conference URL mode
    console.log('🚀 Extracting teams from single conference...');
    console.log('═══════════════════════════════════════════════════════════\n');
    
    const teams = await extractTeamsFromConference(arg);
    
    console.log('\n═══════════════════════════════════════════════════════════');
    console.log('📋 RESULTS - Add these to config/teams.js:');
    console.log('═══════════════════════════════════════════════════════════\n');
    
    for (const team of teams) {
      console.log(`  {`);
      console.log(`    name: '${team.name}',`);
      console.log(`    url: '${team.url}',`);
      console.log(`    conference: '${team.conference || 'CONFERENCE_NAME_HERE'}'`);
      console.log(`  },`);
    }
    
    console.log('\n═══════════════════════════════════════════════════════════');
    console.log(`✅ Successfully extracted ${teams.length} team(s)\n`);
  } else {
    // Season mode - extract all conferences for that season
    await extractAllConferences(arg);
  }
}

main().catch(console.error);
