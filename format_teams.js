import { readFileSync } from 'fs';

const content = readFileSync('extracted_teams_batch.txt', 'utf-8');
const sections = content.split('🔍 Fetching conference page:').slice(1);

const conferences = [
  'California Pacific',
  'Chicagoland',
  'Continental',
  'Crossroads',
  'Frontier',
  'Great Plains',
  'Great Southwest',
  'HBCU Conference',
  'Heart of America',
  'KCAC',
  'Mid-South',
  'Red River',
  'River States',
  'Sooner',
  'Southern States',
  'The Sun',
  'Wolverine-Hoosier'
];

console.log('// Add these teams to config/teams.js');
console.log('');

sections.forEach((section, idx) => {
  const confName = conferences[idx];
  const teamMatches = section.matchAll(/{\s*name: '([^']+)',\s*url: '([^']+)',\s*conference: 'CONFERENCE_NAME_HERE'\s*},?/g);
  const teams = Array.from(teamMatches);
  
  if (teams.length > 0) {
    console.log(`  // ${confName} (${teams.length} teams)`);
    teams.forEach(match => {
      console.log(`  {`);
      console.log(`    name: '${match[1]}',`);
      console.log(`    url: '${match[2]}',`);
      console.log(`    conference: '${confName}'`);
      console.log(`  },`);
    });
  }
});
