// Human-readable column name mappings
export const COLUMN_LABELS = {
  // Team Info
  teamName: 'Team Name',
  
  // Win/Loss Record
  wins: 'W',
  losses: 'L',
  record: 'Record',
  
  // Games & Time
  gp: 'GP',
  gs: 'Games Started',
  hgp: 'Home Games',
  min: 'Total Minutes',
  minpg: 'Minutes/Game',
  minpm: 'Minutes/Game',
  
  // Scoring
  pts: 'Points',
  ptspg: 'PPG',
  ptspm: 'PPG',
  ptsopp: 'Opp Points',
  ptspgopp: 'Opp PPG',
  ptspmopp: 'Opp PPG',
  
  // Points Breakdown
  ptspaint: 'Points in Paint',
  ptspaintpg: 'PITP',
  ptspaintopp: 'Opp Paint Points',
  ptspaintpgopp: 'Opp PITP',
  ptsbench: 'Bench Points',
  ptsbenchpg: 'Bench PPG',
  ptsbenchopp: 'Opp Bench Points',
  ptsbenchpgopp: 'Opp Bench PPG',
  ptsfastb: 'Fast Break Points',
  ptsfastbpg: 'Fast Break PPG',
  ptsfastbopp: 'Opp Fast Break Points',
  ptsfastbpgopp: 'Opp Fast Break PPG',
  ptsto: 'Points Off Turnovers',
  ptstopg: 'Pts Off TO',
  ptstoopp: 'Opp Points Off TO',
  ptstopgopp: 'Opp Pts Off TO',
  ptsch2: '2nd Chance Points',
  ptsch2pg: '2nd Chance PPG',
  ptsch2opp: 'Opp 2nd Chance Points',
  ptsch2pgopp: 'Opp 2nd Chance PPG',
  
  // Field Goals
  fgm: 'FG Made',
  fga: 'FG Attempted',
  fgmpg: 'FG Made/Game',
  fgmpm: 'FG Made/Game',
  fgapg: 'FG Att/Game',
  fgapm: 'FG Att/Game',
  fgpt: 'FG%',
  fgptg: 'FG%',
  fgptpct: 'FG% (Decimal)',
  fgp: 'FG Made-Att',
  fgppg: 'FG/Game',
  fgppm: 'FG/Game',
  
  // Opponent Field Goals
  fgmopp: 'Opp FG Made',
  fgaopp: 'Opp FG Attempted',
  fgmpgopp: 'Opp FG Made/Game',
  fgmpmopp: 'Opp FG Made/Game',
  fgapgopp: 'Opp FG Att/Game',
  fgapmopp: 'Opp FG Att/Game',
  fgptopp: 'Opp FG%',
  fgptgopp: 'Opp FG%',
  fgptpctopp: 'Opp FG% (Decimal)',
  fgpopp: 'Opp FG Made-Att',
  fgppgopp: 'Opp FG/Game',
  fgppmopp: 'Opp FG/Game',
  
  // 3-Pointers
  fgm3: '3PT Made',
  fga3: '3PT Attempted',
  fgm3pg: '3PT Made/Game',
  fgm3pm: '3PT Made/Game',
  fga3pg: '3PT Att/Game',
  fga3pm: '3PT Att/Game',
  fgpt3: '3PT%',
  fgptg3: '3PT%',
  fgpt3pct: '3PT% (Decimal)',
  fgp3: '3PT Made-Att',
  fgp3pg: '3PT/Game',
  fgp3pm: '3PT/Game',
  
  // Opponent 3-Pointers
  fgm3opp: 'Opp 3PT Made',
  fga3opp: 'Opp 3PT Attempted',
  fgm3pgopp: 'Opp 3PT Made/Game',
  fgm3pmopp: 'Opp 3PT Made/Game',
  fga3pgopp: 'Opp 3PT Att/Game',
  fga3pmopp: 'Opp 3PT Att/Game',
  fgpt3opp: 'Opp 3PT%',
  fgptg3opp: 'Opp 3PT%',
  fgpt3pctopp: 'Opp 3PT% (Decimal)',
  fgp3opp: 'Opp 3PT Made-Att',
  fgp3pgopp: 'Opp 3PT/Game',
  fgp3pmopp: 'Opp 3PT/Game',
  
  // Free Throws
  ftm: 'FT Made',
  fta: 'FT Attempted',
  ftmpg: 'FT Made/Game',
  ftmpm: 'FT Made/Game',
  ftapg: 'FT Att/Game',
  ftapm: 'FT Att/Game',
  ftpt: 'FT%',
  ftptg: 'FT%',
  ftppct: 'FT% (Decimal)',
  ftp: 'FT Made-Att',
  ftppg: 'FT/Game',
  ftppm: 'FT/Game',
  
  // Opponent Free Throws
  ftmopp: 'Opp FT Made',
  ftaopp: 'Opp FT Attempted',
  ftmpgopp: 'Opp FT Made/Game',
  ftmpmopp: 'Opp FT Made/Game',
  ftapgopp: 'Opp FT Att/Game',
  ftapmopp: 'Opp FT Att/Game',
  ftptopp: 'Opp FT%',
  ftptgopp: 'Opp FT%',
  ftppctopp: 'Opp FT% (Decimal)',
  ftpopp: 'Opp FT Made-Att',
  ftppgopp: 'Opp FT/Game',
  ftppmopp: 'Opp FT/Game',
  
  // Rebounds
  treb: 'Total Reb',
  trebpg: 'RPG',
  trebpm: 'RPG',
  oreb: 'Offensive Reb',
  orebpg: 'ORPG',
  orebpm: 'ORPG',
  dreb: 'Defensive Reb',
  drebpg: 'DRPG',
  drebpm: 'DRPG',
  mreb: 'Reb Margin',
  mrebpg: 'Reb Margin/Game',
  mrebpm: 'Reb Margin/Game',
  rebmg: 'Reb Margin/Game',
  
  // Opponent Rebounds
  trebopp: 'Opp Total Reb',
  trebpgopp: 'Opp Reb/Game',
  trebpmopp: 'Opp Reb/Game',
  orebopp: 'Opp Off Reb',
  orebpgopp: 'Opp Off Reb/Game',
  orebpmopp: 'Opp Off Reb/Game',
  drebopp: 'Opp Def Reb',
  drebpgopp: 'Opp Def Reb/Game',
  drebpmopp: 'Opp Def Reb/Game',
  
  // Assists
  ast: 'Assists',
  astpg: 'APG',
  astpm: 'APG',
  astopp: 'Opp Assists',
  astpgopp: 'Opp Assists/Game',
  astpmopp: 'Opp Assists/Game',
  
  // Turnovers
  to: 'TO',
  topg: 'TO/Game',
  topm: 'TO/Game',
  tomg: 'TO Margin/Game',
  toopp: 'Opp TO',
  topgopp: 'Opp TO/Game',
  topmopp: 'Opp TO/Game',
  
  // Steals
  stl: 'Steals',
  stlpg: 'SPG',
  stlpm: 'SPG',
  stlopp: 'Opp Steals',
  stlpgopp: 'Opp Steals/Game',
  stlpmopp: 'Opp Steals/Game',
  
  // Blocks
  blk: 'Blocks',
  blkpg: 'BPG',
  blkpm: 'BPG',
  blkopp: 'Opp Blocks',
  blkpgopp: 'Opp Blocks/Game',
  blkpmopp: 'Opp Blocks/Game',
  
  // Fouls
  pf: 'Personal Fouls',
  pfpg: 'Fouls/Game',
  pfpm: 'Fouls/Game',
  pfopp: 'Opp Fouls',
  pfpgopp: 'Opp Fouls/Game',
  pfpmopp: 'Opp Fouls/Game',
  
  // Disqualifications
  dq: 'Disqualifications',
  dqpg: 'DQ/Game',
  dqpm: 'DQ/Game',
  dqopp: 'Opp DQ',
  dqpgopp: 'Opp DQ/Game',
  dqpmopp: 'Opp DQ/Game',
  
  // Advanced Stats
  oeff: 'Offensive Efficiency',
  deff: 'Defensive Efficiency',
  neff: 'Net Efficiency',
  tposs: 'Total Possessions',
  tpossopp: 'Opp Total Possessions',
  possessionsPerGame: 'Poss/PG',
  pointsPerPossession: 'PPP',
  oppPossessionsPerGame: 'O Poss/PG',
  oppPointsPerPossession: 'OPPP',
  netPointsPerPossession: 'Net PPP',
  offensiveRating: 'ORTG',
  defensiveRating: 'DRTG',
  efgPct: 'EFG%',
  toPct: 'TO%',
  orPct: 'OREB%',
  drPct: 'DREB%',
  ftRate: 'FT Rate',
  threePtRate: '3PT Rate',
  shotVolume: 'Shot Volume',
  
  // Assist/Turnover Ratio
  ato: 'Assist/TO Ratio',
  at: 'Assist/TO',
  ata: 'A/TO Ratio',
  atn: 'A/TO',
  atoopp: 'Opp A/TO Ratio',
  atopp: 'Opp Assists/TO',
  ataopp: 'Opp A/TO',
  atna: 'A/TO N/A',
  
  // Other
  leads: 'Leads',
  leadspg: 'Leads/Game',
  leadsopp: 'Opp Leads',
  leadspgopp: 'Opp Leads/Game',
  ties: 'Ties',
  tiespg: 'Ties/Game',
  tiesopp: 'Opp Ties',
  tiespgopp: 'Opp Ties/Game',
  scmg: 'SCMG',
  
  // Game Info
  ga: 'Games Away',
  gaopp: 'Opp Games Away',
  gpopp: 'Opp Games Played',
  gsopp: 'Opp Games Started',
  minopp: 'Opp Total Minutes',
  minpgopp: 'Opp Minutes/Game',
  minpmopp: 'Opp Minutes/Game',
  
  // XML/Technical Fields
  ptsgamexml: 'Points (XML)',
  ptsseasonxml: 'Season Points (XML)',
  ptsoppgamexml: 'Opp Points (XML)',
  ptsoppseasonxml: 'Opp Season Points (XML)',
  gpata: 'GP ATA',
  gpataopp: 'Opp GP ATA',
  ngpatna: 'NG PAT N/A',
  
  // Score Info
  g1: 'Game 1 Score',
  g2: 'Game 2 Score',
  g1opp: 'Game 1 Opp Score',
  g2opp: 'Game 2 Opp Score',
};

// Get display name for a column
export function getColumnLabel(columnKey) {
  return COLUMN_LABELS[columnKey] || formatColumnName(columnKey);
}

// Fallback formatter for unmapped columns
function formatColumnName(name) {
  return name
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, str => str.toUpperCase())
    .trim();
}
