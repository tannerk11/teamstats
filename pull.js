// Main orchestrator for fetching and calculating conference statistics
import { TEAMS } from './config/teams.js';
import { fetchAllTeams } from './lib/dataFetcher.js';
import { calculateCustomStats } from './lib/calculator.js';
import { writeFile } from 'fs/promises';
import { join } from 'path';

async function main() {
  console.log('=== Conference Stats Analyzer ===\n');
  
  // Step 1: Fetch data for all teams
  const teamsData = await fetchAllTeams(TEAMS);
  
  // Step 2: Calculate custom statistics
  console.log('\nCalculating statistics...');
  const statistics = calculateCustomStats(teamsData);
  
  // Step 3: Display results
  console.log('\n=== Team Stats ===');
  statistics.forEach(stat => {
    console.log(`\n${stat.teamName}:`);
    console.log(`  Possessions Per Game: ${stat.possessionsPerGame.toFixed(2)}`);
  });
  
  // Step 4: Save results to file (optional)
  const outputPath = join(process.cwd(), 'output', 'results.json');
  await writeFile(outputPath, JSON.stringify(statistics, null, 2));
  console.log(`\n✓ Results saved to ${outputPath}`);
  
  return statistics;
}

// Run the main function
main().catch(console.error);
