/**
 * Extract Team JSON URLs from PrestoSports Pages
 * 
 * This script takes a list of team page URLs and extracts the JSON data URLs
 * 
 * Usage: node scripts/extractTeamUrls.js
 */

// Add your team page URLs here
const TEAM_PAGE_URLS = [
  'https://naiastats.prestosports.com/sports/mbkb/2025-26/conf/Cascade/teams/oregontech?jsRendering=true&view=profile',
  // Add more team page URLs below
];

async function extractJsonUrl(pageUrl) {
  try {
    console.log(`\n🔍 Fetching: ${pageUrl}`);
    
    const response = await fetch(pageUrl);
    const html = await response.text();
    
    // Look for the team data JSON URL pattern
    const jsonUrlMatch = html.match(/prestosports-downloads\.s3[^"']*\/teamData\/[a-z0-9]+\.json/i);
    
    if (!jsonUrlMatch) {
      console.log('  ❌ No team data JSON URL found');
      return null;
    }
    
    const jsonUrl = `https://${jsonUrlMatch[0]}`;
    
    // Fetch the JSON to get the team name
    const jsonResponse = await fetch(jsonUrl);
    const jsonData = await jsonResponse.json();
    const teamName = jsonData.attributes?.school_name || 'Unknown Team';
    
    console.log(`  ✅ Found: ${teamName}`);
    console.log(`  📊 JSON URL: ${jsonUrl}`);
    
    return {
      name: teamName,
      url: jsonUrl,
      pageUrl: pageUrl
    };
    
  } catch (error) {
    console.log(`  ❌ Error: ${error.message}`);
    return null;
  }
}

async function extractAllUrls() {
  console.log('🚀 Extracting team JSON URLs from PrestoSports pages...');
  console.log('═══════════════════════════════════════════════════════════\n');
  
  const results = [];
  
  for (const pageUrl of TEAM_PAGE_URLS) {
    const result = await extractJsonUrl(pageUrl);
    if (result) {
      results.push(result);
    }
    // Small delay to be nice to the server
    await new Promise(resolve => setTimeout(resolve, 500));
  }
  
  console.log('\n═══════════════════════════════════════════════════════════');
  console.log('📋 RESULTS - Add these to config/teams.js:');
  console.log('═══════════════════════════════════════════════════════════\n');
  
  for (const team of results) {
    console.log(`  {`);
    console.log(`    name: '${team.name}',`);
    console.log(`    url: '${team.url}'`);
    console.log(`  },`);
  }
  
  console.log('\n═══════════════════════════════════════════════════════════');
  console.log(`✅ Successfully extracted ${results.length} of ${TEAM_PAGE_URLS.length} teams\n`);
}

extractAllUrls().catch(console.error);
