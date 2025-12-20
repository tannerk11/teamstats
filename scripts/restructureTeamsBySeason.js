/**
 * Restructure teams.js to organize teams by season
 * Reads the current teams.js (2025-26 data) and combines with 2024-25 data
 */

// Current 2025-26 teams (from existing teams.js)
import { TEAMS as TEAMS_2025_26 } from '../config/teams-backup-2025-26.js';

// 2024-25 teams (extracted from script output)
const TEAMS_2024_25 = [
  {
    name: 'Bushnell (OR)',
    url: 'https://prestosports-downloads.s3.us-west-2.amazonaws.com/teamData/l2e4jplzihn39gfu.json',
    conference: 'Cascade'
  },
  {
    name: 'College of Idaho',
    url: 'https://prestosports-downloads.s3.us-west-2.amazonaws.com/teamData/f7v4ggaemf9uakjq.json',
    conference: 'Cascade'
  },
  {
    name: 'Corban',
    url: 'https://prestosports-downloads.s3.us-west-2.amazonaws.com/teamData/3c61o7yjr2n3ki2x.json',
    conference: 'Cascade'
  },
  {
    name: 'Eastern Oregon',
    url: 'https://prestosports-downloads.s3.us-west-2.amazonaws.com/teamData/4b0qxarakqnrz0bb.json',
    conference: 'Cascade'
  },
  {
    name: 'Evergreen (WA)',
    url: 'https://prestosports-downloads.s3.us-west-2.amazonaws.com/teamData/bb1iteveqfhhou6p.json',
    conference: 'Cascade'
  },
  {
    name: 'Lewis-Clark State (Idaho)',
    url: 'https://prestosports-downloads.s3.us-west-2.amazonaws.com/teamData/4s4ickykdmcr5ss1.json',
    conference: 'Cascade'
  },
  {
    name: 'Multnomah',
    url: 'https://prestosports-downloads.s3.us-west-2.amazonaws.com/teamData/0wojsnaekexy3pnm.json',
    conference: 'Cascade'
  },
  {
    name: 'Northwest (WA)',
    url: 'https://prestosports-downloads.s3.us-west-2.amazonaws.com/teamData/4nu88j6l8ra8fiqs.json',
    conference: 'Cascade'
  },
  {
    name: 'Oregon Tech',
    url: 'https://prestosports-downloads.s3.us-west-2.amazonaws.com/teamData/295achyjeysbnto4.json',
    conference: 'Cascade'
  },
  {
    name: 'Southern Oregon',
    url: 'https://prestosports-downloads.s3.us-west-2.amazonaws.com/teamData/57mov2juqpbp6taa.json',
    conference: 'Cascade'
  },
  {
    name: 'Walla Walla',
    url: 'https://prestosports-downloads.s3.us-west-2.amazonaws.com/teamData/1w8bp42bm5prquyg.json',
    conference: 'Cascade'
  },
  {
    name: 'Warner Pacific (OR)',
    url: 'https://prestosports-downloads.s3.us-west-2.amazonaws.com/teamData/2i7rdu53cpcdohi1.json',
    conference: 'Cascade'
  },
  {
    name: 'Central Baptist (Ark.)',
    url: 'https://prestosports-downloads.s3.us-west-2.amazonaws.com/teamData/84cn3s8ghoccscm0.json',
    conference: 'American_Midwest'
  },
  {
    name: 'Columbia (MO)',
    url: 'https://prestosports-downloads.s3.us-west-2.amazonaws.com/teamData/5pgro7tafbf0trt4.json',
    conference: 'American_Midwest'
  },
  {
    name: 'Crowley\'s Ridge (AR)',
    url: 'https://prestosports-downloads.s3.us-west-2.amazonaws.com/teamData/qym03coui37tkznf.json',
    conference: 'American_Midwest'
  },
  {
    name: 'Hannibal-LaGrange (MO)',
    url: 'https://prestosports-downloads.s3.us-west-2.amazonaws.com/teamData/pteke9ftl5dn79wc.json',
    conference: 'American_Midwest'
  },
  {
    name: 'Harris-Stowe (MO)',
    url: 'https://prestosports-downloads.s3.us-west-2.amazonaws.com/teamData/09rxbfisdqj24nmv.json',
    conference: 'American_Midwest'
  },
  {
    name: 'Mission (Mo.)',
    url: 'https://prestosports-downloads.s3.us-west-2.amazonaws.com/teamData/oqbfcye6bu1y2xmo.json',
    conference: 'American_Midwest'
  },
  {
    name: 'Missouri Baptist',
    url: 'https://prestosports-downloads.s3.us-west-2.amazonaws.com/teamData/264bw078inirmguc.json',
    conference: 'American_Midwest'
  },
  {
    name: 'UHSP',
    url: 'https://prestosports-downloads.s3.us-west-2.amazonaws.com/teamData/a9lz5bw99e2s4h0n.json',
    conference: 'American_Midwest'
  },
  {
    name: 'William Woods',
    url: 'https://prestosports-downloads.s3.us-west-2.amazonaws.com/teamData/46fm9of1hgqop0cp.json',
    conference: 'American_Midwest'
  },
  {
    name: 'Williams Baptist (AR)',
    url: 'https://prestosports-downloads.s3.us-west-2.amazonaws.com/teamData/nhfnawr115rrmfth.json',
    conference: 'American_Midwest'
  },
  {
    name: 'Bluefield (VA)',
    url: 'https://prestosports-downloads.s3.us-west-2.amazonaws.com/teamData/jsab6o4h66wkulwr.json',
    conference: 'Appalachian'
  },
  {
    name: 'Bryan (TN)',
    url: 'https://prestosports-downloads.s3.us-west-2.amazonaws.com/teamData/2dc69bz8inw55qks.json',
    conference: 'Appalachian'
  },
  {
    name: 'CIU (SC)',
    url: 'https://prestosports-downloads.s3.us-west-2.amazonaws.com/teamData/66d82tbohtosmtsv.json',
    conference: 'Appalachian'
  },
  {
    name: 'Columbia (SC)',
    url: 'https://prestosports-downloads.s3.us-west-2.amazonaws.com/teamData/emndsrivabhdw1zb.json',
    conference: 'Appalachian'
  },
  {
    name: 'Johnson (TN)',
    url: 'https://prestosports-downloads.s3.us-west-2.amazonaws.com/teamData/ee1vs6xps0lue1eo.json',
    conference: 'Appalachian'
  },
  {
    name: 'Kentucky Christian',
    url: 'https://prestosports-downloads.s3.us-west-2.amazonaws.com/teamData/baakq8j322mpy6gb.json',
    conference: 'Appalachian'
  },
  {
    name: 'Milligan (TN)',
    url: 'https://prestosports-downloads.s3.us-west-2.amazonaws.com/teamData/gyxbmcg1h7na4zna.json',
    conference: 'Appalachian'
  },
  {
    name: 'Montreat (NC)',
    url: 'https://prestosports-downloads.s3.us-west-2.amazonaws.com/teamData/0ijah32p2qpu9ehy.json',
    conference: 'Appalachian'
  },
  {
    name: 'Pikeville (KY)',
    url: 'https://prestosports-downloads.s3.us-west-2.amazonaws.com/teamData/1q4mwp31df1y8xgs.json',
    conference: 'Appalachian'
  },
  {
    name: 'Reinhardt (Ga.)',
    url: 'https://prestosports-downloads.s3.us-west-2.amazonaws.com/teamData/5u2s6ic7a2nrq9nh.json',
    conference: 'Appalachian'
  },
  {
    name: 'St. Andrews (NC)',
    url: 'https://prestosports-downloads.s3.us-west-2.amazonaws.com/teamData/1murk8h8bdmz5cdn.json',
    conference: 'Appalachian'
  },
  {
    name: 'Tennessee Wesleyan',
    url: 'https://prestosports-downloads.s3.us-west-2.amazonaws.com/teamData/38cxlids1ryhgzuy.json',
    conference: 'Appalachian'
  },
  {
    name: 'Truett McConnell',
    url: 'https://prestosports-downloads.s3.us-west-2.amazonaws.com/teamData/7xfv9nm3huc6ionz.json',
    conference: 'Appalachian'
  },
  {
    name: 'Union Commonwealth',
    url: 'https://prestosports-downloads.s3.us-west-2.amazonaws.com/teamData/oxtnobhy2xxthdka.json',
    conference: 'Appalachian'
  }
];

// Create new structure
const TEAMS_BY_SEASON = {
  '2025-26': TEAMS_2025_26,
  '2024-25': TEAMS_2024_25
};

// Helper function to get teams for a specific season
export function getTeamsBySeason(season) {
  return TEAMS_BY_SEASON[season] || [];
}

// Export both the structure and individual season arrays
export { TEAMS_BY_SEASON, TEAMS_2025_26, TEAMS_2024_25 };

// Also export TEAMS as alias for current season for backward compatibility
export const TEAMS = TEAMS_2025_26;

console.log('✅ Teams restructured by season:');
console.log(`  2025-26: ${TEAMS_2025_26.length} teams`);
console.log(`  2024-25: ${TEAMS_2024_25.length} teams`);
