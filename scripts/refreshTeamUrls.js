/**
 * Refresh Team URLs Script
 * 
 * This script automatically extracts fresh team URLs from all conference pages
 * and updates the config/teams.js file. Run this periodically (e.g., every 2 days)
 * to ensure team URLs stay current.
 * 
 * Usage:
 *   node scripts/refreshTeamUrls.js [season]
 * 
 * Examples:
 *   node scripts/refreshTeamUrls.js           # Refreshes current season (2025-26)
 *   node scripts/refreshTeamUrls.js 2025-26   # Refreshes specific season
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Conference slugs and their display names for each season
const CONFERENCE_CONFIG = {
  '2025-26': {
    'Appalachian': 'Appalachian',
    'American_Midwest': 'American Midwest Conference',
    'Cal_Pac': 'California Pacific',
    'Cascade': 'Cascade Collegiate Conference',
    'Chicagoland': 'Chicagoland',
    'Continental': 'Continental Athletic Conference',
    'Crossroads': 'Crossroads League',
    'Frontier': 'Frontier',
    'Great_Plains': 'Great Plains Athletic Conference',
    'GSAC': 'Golden State Athletic Conference',
    'HBCU': 'HBCU Athletic Conference',
    'Heart': 'Heart of America Athletic Conference',
    'KCAC': 'Kansas Collegiate Athletic Conference',
    'Mid-South': 'Mid-South Conference',
    'Red_River': 'Red River Athletic Conference',
    'RSC': 'River States Conference',
    'SAC': 'Sooner Athletic Conference',
    'Sooner': 'Sooner Athletic Conference',
    'SSAC': 'Southern States Athletic Conference',
    'Sun': 'Sun Conference',
    'WHAC': 'Wolverine-Hoosier Athletic Conference'
  },
  '2024-25': {
    'Appalachian': 'Appalachian',
    'American_Midwest': 'American Midwest Conference',
    'California_Pacific': 'California Pacific',
    'Cascade': 'Cascade',
    'Chicagoland': 'Chicagoland',
    'Continental': 'Continental Athletic Conference',
    'Crossroads': 'Crossroads League',
    'Frontier': 'Frontier',
    'Great_Plains': 'Great Plains Athletic Conference',
    'Great_Southwest': 'Golden State Athletic Conference',
    'HBCU_Conference': 'HBCU Athletic Conference',
    'Heart_of_America': 'Heart of America Athletic Conference',
    'KCAC': 'Kansas Collegiate Athletic Conference',
    'Mid-South': 'Mid-South Conference',
    'Red_River': 'Red River Athletic Conference',
    'River_States': 'River States Conference',
    'Sooner': 'Sooner Athletic Conference',
    'Southern_States': 'Southern States Athletic Conference',
    'The_Sun': 'Sun Conference',
    'Wolverine-Hoosier': 'Wolverine-Hoosier Athletic Conference'
  }
};

// Rate limiting settings
const DELAY_BETWEEN_TEAMS = 300;  // ms between team page fetches
const DELAY_BETWEEN_CONFERENCES = 500;  // ms between conference fetches

async function getTeamPagesFromConference(conferenceUrl) {
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

async function extractTeamsFromConference(conferenceSlug, conferenceName, season) {
  const conferenceUrl = `https://naiastats.prestosports.com/sports/mbkb/${season}/conf/${conferenceSlug}/teams?jsRendering=true`;
  
  try {
    const teamPages = await getTeamPagesFromConference(conferenceUrl);
    
    if (teamPages.length === 0) {
      return { success: false, teams: [], error: 'No teams found' };
    }
    
    const results = [];
    
    for (const teamPage of teamPages) {
      const teamData = await extractJsonUrlFromTeamPage(teamPage.pageUrl);
      
      if (teamData) {
        results.push({
          name: teamData.name,
          url: teamData.url,
          conference: conferenceName
        });
      }
      
      // Rate limiting
      await new Promise(resolve => setTimeout(resolve, DELAY_BETWEEN_TEAMS));
    }
    
    return { success: true, teams: results };
    
  } catch (error) {
    return { success: false, teams: [], error: error.message };
  }
}

async function refreshAllTeams(season) {
  console.log(`\n🔄 Refreshing team URLs for ${season} season...`);
  console.log(`📅 Started at: ${new Date().toISOString()}`);
  console.log('═══════════════════════════════════════════════════════════\n');
  
  const conferenceConfig = CONFERENCE_CONFIG[season];
  if (!conferenceConfig) {
    console.log(`❌ Unknown season: ${season}`);
    console.log(`   Available seasons: ${Object.keys(CONFERENCE_CONFIG).join(', ')}`);
    return null;
  }
  
  const allTeams = [];
  const conferenceStats = [];
  
  const conferenceEntries = Object.entries(conferenceConfig);
  
  for (let i = 0; i < conferenceEntries.length; i++) {
    const [slug, displayName] = conferenceEntries[i];
    const progress = `[${i + 1}/${conferenceEntries.length}]`;
    
    process.stdout.write(`${progress} ${displayName}... `);
    
    const result = await extractTeamsFromConference(slug, displayName, season);
    
    if (result.success) {
      console.log(`✅ ${result.teams.length} teams`);
      allTeams.push(...result.teams);
      conferenceStats.push({ name: displayName, count: result.teams.length, status: 'success' });
    } else {
      console.log(`❌ Failed: ${result.error}`);
      conferenceStats.push({ name: displayName, count: 0, status: 'failed', error: result.error });
    }
    
    // Rate limiting between conferences
    if (i < conferenceEntries.length - 1) {
      await new Promise(resolve => setTimeout(resolve, DELAY_BETWEEN_CONFERENCES));
    }
  }
  
  return { teams: allTeams, stats: conferenceStats };
}

function generateTeamsConfig(teams, season) {
  const seasonVar = season.replace('-', '_');
  
  let config = `// ${season} Season Teams\n`;
  config += `// Auto-generated by refreshTeamUrls.js on ${new Date().toISOString()}\n`;
  config += `const TEAMS_${seasonVar} = [\n`;
  
  for (const team of teams) {
    // Escape single quotes in team names
    const escapedName = team.name.replace(/'/g, "\\'");
    const escapedConference = team.conference.replace(/'/g, "\\'");
    
    config += `  {\n`;
    config += `    name: '${escapedName}',\n`;
    config += `    url: '${team.url}',\n`;
    config += `    conference: '${escapedConference}'\n`;
    config += `  },\n`;
  }
  
  config += `];\n`;
  
  return config;
}

async function updateTeamsFile(teams, season) {
  const teamsFilePath = path.join(__dirname, '..', 'config', 'teams.js');
  
  try {
    // Read current file
    let content = fs.readFileSync(teamsFilePath, 'utf8');
    
    // Generate new config for this season
    const newConfig = generateTeamsConfig(teams, season);
    const seasonVar = season.replace('-', '_');
    
    // Find and replace the existing season config
    // Match from "// 2025-26 Season Teams" or "const TEAMS_2025_26" to the closing "];"
    const seasonPattern = new RegExp(
      `(\\/\\/ ${season} Season Teams[\\s\\S]*?|)const TEAMS_${seasonVar} = \\[[\\s\\S]*?\\];`,
      'g'
    );
    
    if (content.match(seasonPattern)) {
      content = content.replace(seasonPattern, newConfig.trim());
      fs.writeFileSync(teamsFilePath, content);
      return true;
    } else {
      console.log(`⚠️  Could not find TEAMS_${seasonVar} in config file`);
      console.log(`   You may need to manually add the generated config.`);
      return false;
    }
    
  } catch (error) {
    console.log(`❌ Error updating teams file: ${error.message}`);
    return false;
  }
}

function printSummary(stats, totalTeams) {
  console.log('\n═══════════════════════════════════════════════════════════');
  console.log('📊 SUMMARY');
  console.log('═══════════════════════════════════════════════════════════\n');
  
  const successful = stats.filter(s => s.status === 'success');
  const failed = stats.filter(s => s.status === 'failed');
  
  console.log(`✅ Successful conferences: ${successful.length}`);
  console.log(`❌ Failed conferences: ${failed.length}`);
  console.log(`📋 Total teams extracted: ${totalTeams}\n`);
  
  if (failed.length > 0) {
    console.log('Failed conferences:');
    for (const f of failed) {
      console.log(`  - ${f.name}: ${f.error}`);
    }
    console.log('');
  }
  
  console.log('Teams per conference:');
  for (const s of successful.sort((a, b) => b.count - a.count)) {
    console.log(`  ${s.name}: ${s.count}`);
  }
}

async function main() {
  const season = process.argv[2] || '2025-26';
  
  console.log('╔═══════════════════════════════════════════════════════════╗');
  console.log('║         TEAM URL REFRESH SCRIPT                          ║');
  console.log('╚═══════════════════════════════════════════════════════════╝');
  
  // Extract all teams
  const result = await refreshAllTeams(season);
  
  if (!result) {
    process.exit(1);
  }
  
  const { teams, stats } = result;
  
  // Print summary
  printSummary(stats, teams.length);
  
  if (teams.length === 0) {
    console.log('\n❌ No teams extracted. Config file not updated.');
    process.exit(1);
  }
  
  // Update the config file
  console.log('\n📝 Updating config/teams.js...');
  const updated = await updateTeamsFile(teams, season);
  
  if (updated) {
    console.log(`✅ Successfully updated config/teams.js with ${teams.length} teams for ${season}`);
  } else {
    // Write to a backup file instead
    const backupPath = path.join(__dirname, '..', 'config', `teams-${season}-refreshed.js`);
    const config = generateTeamsConfig(teams, season);
    fs.writeFileSync(backupPath, config);
    console.log(`📄 Wrote backup config to: ${backupPath}`);
  }
  
  console.log(`\n📅 Completed at: ${new Date().toISOString()}`);
  console.log('═══════════════════════════════════════════════════════════\n');
}

main().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});
