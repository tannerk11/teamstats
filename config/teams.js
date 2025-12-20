// Configuration file for team URLs organized by season
// Teams are grouped by season ID (e.g., '2025-26', '2024-25')

// Helper function to get teams for a specific season
export function getTeamsBySeason(season) {
  return TEAMS_BY_SEASON[season] || [];
}

// 2025-26 Season Teams
const TEAMS_2025_26 = [
  {
    name: 'Eastern Oregon',
    url: 'https://prestosports-downloads.s3.us-west-2.amazonaws.com/teamData/1stv0so5yo4dy8m6.json',
    conference: 'Cascade Collegiate Conference'
  },
  {
    name: 'College of Idaho',
    url: 'https://prestosports-downloads.s3.us-west-2.amazonaws.com/teamData/4i8ab7eu0vord9i5.json',
    conference: 'Cascade Collegiate Conference'
  },
  {
    name: 'Bushnell',
    url: 'https://prestosports-downloads.s3.us-west-2.amazonaws.com/teamData/9jt4efsckjxx1mz4.json',
    conference: 'Cascade Collegiate Conference'
  },
  {
    name: 'Lewis-Clark State',
    url: 'https://prestosports-downloads.s3.us-west-2.amazonaws.com/teamData/63q7r68ue0e7wm4s.json',
    conference: 'Cascade Collegiate Conference'
  },
  {
    name: 'Southern Oregon',
    url: 'https://prestosports-downloads.s3.us-west-2.amazonaws.com/teamData/d9bz792lojsrfwks.json',
    conference: 'Cascade Collegiate Conference'
  },
  {
    name: 'Corban',
    url: 'https://prestosports-downloads.s3.us-west-2.amazonaws.com/teamData/7cybomek4tlt46f2.json',
    conference: 'Cascade Collegiate Conference'
  },
  {
    name: 'Warner Pacific',
    url: 'https://prestosports-downloads.s3.us-west-2.amazonaws.com/teamData/bzl8n82kgtbnb3nn.json',
    conference: 'Cascade Collegiate Conference'
  },
  {
    name: 'Northwest',
    url: 'https://prestosports-downloads.s3.us-west-2.amazonaws.com/teamData/06kd3hu801rdnlh8.json',
    conference: 'Cascade Collegiate Conference'
  },
  {
    name: 'Oregon Tech',
    url: 'https://prestosports-downloads.s3.us-west-2.amazonaws.com/teamData/3imnxiqstibufgfg.json',
    conference: 'Cascade Collegiate Conference'
  },
  {
    name: 'Evergreen',
    url: 'https://prestosports-downloads.s3.us-west-2.amazonaws.com/teamData/btqo7b3zslrdsf5l.json',
    conference: 'Cascade Collegiate Conference'
  },
  {
    name: 'Walla Walla',
    url: 'https://prestosports-downloads.s3.us-west-2.amazonaws.com/teamData/55sgu57331e4eidf.json',
    conference: 'Cascade Collegiate Conference'
  },
  {
    name: 'Central Baptist (Ark.)',
    url: 'https://prestosports-downloads.s3.us-west-2.amazonaws.com/teamData/xkd9rudhj2mqgh1g.json',
    conference: 'American Midwest Conference'
  },
  {
    name: 'Columbia (MO)',
    url: 'https://prestosports-downloads.s3.us-west-2.amazonaws.com/teamData/9rpe7j7fsvyq85oe.json',
    conference: 'American Midwest Conference'
  },
  {
    name: 'Hannibal-LaGrange (MO)',
    url: 'https://prestosports-downloads.s3.us-west-2.amazonaws.com/teamData/2nmalaqk2frlpnfu.json',
    conference: 'American Midwest Conference'
  },
  {
    name: 'Harris-Stowe (MO)',
    url: 'https://prestosports-downloads.s3.us-west-2.amazonaws.com/teamData/k4j3el2hyhzcrugg.json',
    conference: 'American Midwest Conference'
  },
  {
    name: 'Mission (Mo.)',
    url: 'https://prestosports-downloads.s3.us-west-2.amazonaws.com/teamData/qkxtkm5jj30t2962.json',
    conference: 'American Midwest Conference'
  },
  {
    name: 'UHSP',
    url: 'https://prestosports-downloads.s3.us-west-2.amazonaws.com/teamData/zzecb24d05wuiqjh.json',
    conference: 'American Midwest Conference'
  },
  {
    name: 'Williams Baptist (AR)',
    url: 'https://prestosports-downloads.s3.us-west-2.amazonaws.com/teamData/1lflx0vg8b1qerqn.json',
    conference: 'American Midwest Conference'
  },
  {
    name: 'Bluefield (VA)',
    url: 'https://prestosports-downloads.s3.us-west-2.amazonaws.com/teamData/tf5afi2y1jx2g3xx.json',
    conference: 'Appalachian Athletic Conference'
  },
  {
    name: 'Bryan (TN)',
    url: 'https://prestosports-downloads.s3.us-west-2.amazonaws.com/teamData/ibw6qifc8ghj95sv.json',
    conference: 'Appalachian Athletic Conference'
  },
  {
    name: 'CIU (SC)',
    url: 'https://prestosports-downloads.s3.us-west-2.amazonaws.com/teamData/gdku0ysvsz8d609j.json',
    conference: 'Appalachian Athletic Conference'
  },
  {
    name: 'Columbia (SC)',
    url: 'https://prestosports-downloads.s3.us-west-2.amazonaws.com/teamData/r5gry3aq3v3tpgko.json',
    conference: 'Appalachian Athletic Conference'
  },
  {
    name: 'Johnson (TN)',
    url: 'https://prestosports-downloads.s3.us-west-2.amazonaws.com/teamData/l6kxycj98vzoks05.json',
    conference: 'Appalachian Athletic Conference'
  },
  {
    name: 'Milligan (TN)',
    url: 'https://prestosports-downloads.s3.us-west-2.amazonaws.com/teamData/3zps8q4vqy9nyp2m.json',
    conference: 'Appalachian Athletic Conference'
  },
  {
    name: 'Montreat (NC)',
    url: 'https://prestosports-downloads.s3.us-west-2.amazonaws.com/teamData/pyx1sbm8xs65wp3v.json',
    conference: 'Appalachian Athletic Conference'
  },
  {
    name: 'Pikeville (KY)',
    url: 'https://prestosports-downloads.s3.us-west-2.amazonaws.com/teamData/y7d96mogabb3ct3a.json',
    conference: 'Appalachian Athletic Conference'
  },
  {
    name: 'Reinhardt (Ga.)',
    url: 'https://prestosports-downloads.s3.us-west-2.amazonaws.com/teamData/7yjrmy96t88k7ybk.json',
    conference: 'Appalachian Athletic Conference'
  },
  {
    name: 'Spartanburg Methodist',
    url: 'https://prestosports-downloads.s3.us-west-2.amazonaws.com/teamData/1w6oevdw7vq0lxnb.json',
    conference: 'Appalachian Athletic Conference'
  },
  {
    name: 'Tennessee Wesleyan',
    url: 'https://prestosports-downloads.s3.us-west-2.amazonaws.com/teamData/y8r1i0vgvtld4cfu.json',
    conference: 'Appalachian Athletic Conference'
  },
  {
    name: 'Truett McConnell',
    url: 'https://prestosports-downloads.s3.us-west-2.amazonaws.com/teamData/8gj553vtxn5fvizm.json',
    conference: 'Appalachian Athletic Conference'
  },
  {
    name: 'Union Commonwealth',
    url: 'https://prestosports-downloads.s3.us-west-2.amazonaws.com/teamData/67k7taeg2ya43jsq.json',
    conference: 'Appalachian Athletic Conference'
  },
  {
    name: 'Cal Maritime',
    url: 'https://prestosports-downloads.s3.us-west-2.amazonaws.com/teamData/98nzncgb3wafq8yy.json',
    conference: 'California Pacific'
  },
  {
    name: 'Northern New Mexico',
    url: 'https://prestosports-downloads.s3.us-west-2.amazonaws.com/teamData/bn11d0cb428bfqb3.json',
    conference: 'California Pacific'
  },
  {
    name: 'Pacific Union (CA)',
    url: 'https://prestosports-downloads.s3.us-west-2.amazonaws.com/teamData/966xcecaqwmlnhu7.json',
    conference: 'California Pacific'
  },
  {
    name: 'Simpson (CA)',
    url: 'https://prestosports-downloads.s3.us-west-2.amazonaws.com/teamData/2kel1qoxjv1gtd2h.json',
    conference: 'California Pacific'
  },
  {
    name: 'Stanton (CA)',
    url: 'https://prestosports-downloads.s3.us-west-2.amazonaws.com/teamData/k4wglwbxv3tlmjh9.json',
    conference: 'California Pacific'
  },
  {
    name: 'Westcliff (Calif.)',
    url: 'https://prestosports-downloads.s3.us-west-2.amazonaws.com/teamData/c1p5ibrwxhb26q71.json',
    conference: 'California Pacific'
  },
  {
    name: 'Calumet (IN)',
    url: 'https://prestosports-downloads.s3.us-west-2.amazonaws.com/teamData/nu6ztx3sdtck0zpy.json',
    conference: 'Chicagoland'
  },
  {
    name: 'Governors State',
    url: 'https://prestosports-downloads.s3.us-west-2.amazonaws.com/teamData/0hodbajwdhfbbxyc.json',
    conference: 'Chicagoland'
  },
  {
    name: 'Holy Cross (Ind.)',
    url: 'https://prestosports-downloads.s3.us-west-2.amazonaws.com/teamData/bqhnoe98d419bi87.json',
    conference: 'Chicagoland'
  },
  {
    name: 'Indiana Northwest',
    url: 'https://prestosports-downloads.s3.us-west-2.amazonaws.com/teamData/unjxjxd9f5u7eocu.json',
    conference: 'Chicagoland'
  },
  {
    name: 'Indiana South Bend (IN)',
    url: 'https://prestosports-downloads.s3.us-west-2.amazonaws.com/teamData/qx5l2pqwnz8tizce.json',
    conference: 'Chicagoland'
  },
  {
    name: 'Judson (IL)',
    url: 'https://prestosports-downloads.s3.us-west-2.amazonaws.com/teamData/lw3v01doxpg9an08.json',
    conference: 'Chicagoland'
  },
  {
    name: 'Olivet Nazarene (IL)',
    url: 'https://prestosports-downloads.s3.us-west-2.amazonaws.com/teamData/jippabvj1oniftyy.json',
    conference: 'Chicagoland'
  },
  {
    name: 'Saint Xavier (IL)',
    url: 'https://prestosports-downloads.s3.us-west-2.amazonaws.com/teamData/uqyg9ggyp95p85ll.json',
    conference: 'Chicagoland'
  },
  {
    name: 'St. Ambrose (IA)',
    url: 'https://prestosports-downloads.s3.us-west-2.amazonaws.com/teamData/savdwlesti7mhodq.json',
    conference: 'Chicagoland'
  },
  {
    name: 'St. Francis (IL)',
    url: 'https://prestosports-downloads.s3.us-west-2.amazonaws.com/teamData/9z3oryhapsd4crpr.json',
    conference: 'Chicagoland'
  },
  {
    name: 'Trinity Christian (IL)',
    url: 'https://prestosports-downloads.s3.us-west-2.amazonaws.com/teamData/g0kww6f2yicjsrol.json',
    conference: 'Chicagoland'
  },
  {
    name: 'Viterbo',
    url: 'https://prestosports-downloads.s3.us-west-2.amazonaws.com/teamData/5ezvdhjls8g1k423.json',
    conference: 'Chicagoland'
  },
  {
    name: 'Alice Lloyd (KY)',
    url: 'https://prestosports-downloads.s3.us-west-2.amazonaws.com/teamData/utquwo36widup1zj.json',
    conference: 'Continental'
  },
  {
    name: 'Arkansas Baptist',
    url: 'https://prestosports-downloads.s3.us-west-2.amazonaws.com/teamData/lsenzzzbiwaj92vo.json',
    conference: 'Continental'
  },
  {
    name: 'Carolina (N.C.)',
    url: 'https://prestosports-downloads.s3.us-west-2.amazonaws.com/teamData/lq6khpkwzk0lxcjc.json',
    conference: 'Continental'
  },
  {
    name: 'Fisher (MA)',
    url: 'https://prestosports-downloads.s3.us-west-2.amazonaws.com/teamData/97ife69ayjsx4aeg.json',
    conference: 'Continental'
  },
  {
    name: 'Florida College (FL)',
    url: 'https://prestosports-downloads.s3.us-west-2.amazonaws.com/teamData/qte3s0zhuaxgapw5.json',
    conference: 'Continental'
  },
  {
    name: 'Florida National',
    url: 'https://prestosports-downloads.s3.us-west-2.amazonaws.com/teamData/fsiytsvtffrc5zzz.json',
    conference: 'Continental'
  },
  {
    name: 'Georgia Gwinnett',
    url: 'https://prestosports-downloads.s3.us-west-2.amazonaws.com/teamData/fp8ppv1u0prs4tao.json',
    conference: 'Continental'
  },
  {
    name: 'Haskell Indian Nations University',
    url: 'https://prestosports-downloads.s3.us-west-2.amazonaws.com/teamData/jpuc70yew66noevp.json',
    conference: 'Continental'
  },
  {
    name: 'Hesston College',
    url: 'https://prestosports-downloads.s3.us-west-2.amazonaws.com/teamData/ux03rfyc3su2199x.json',
    conference: 'Continental'
  },
  {
    name: 'Morris',
    url: 'https://prestosports-downloads.s3.us-west-2.amazonaws.com/teamData/gkrpogscn6zr13e6.json',
    conference: 'Continental'
  },
  {
    name: 'Washington Adventist (MD)',
    url: 'https://prestosports-downloads.s3.us-west-2.amazonaws.com/teamData/ogfxb82uv9u1162h.json',
    conference: 'Continental'
  },
  {
    name: 'Bethel (IN)',
    url: 'https://prestosports-downloads.s3.us-west-2.amazonaws.com/teamData/bpg9r1ko4226lt9c.json',
    conference: 'Crossroads'
  },
  {
    name: 'Goshen (IN)',
    url: 'https://prestosports-downloads.s3.us-west-2.amazonaws.com/teamData/9kadalxixwx49lrn.json',
    conference: 'Crossroads'
  },
  {
    name: 'Grace (Ind.)',
    url: 'https://prestosports-downloads.s3.us-west-2.amazonaws.com/teamData/9dywy441jl3aoc1b.json',
    conference: 'Crossroads'
  },
  {
    name: 'Huntington (IN)',
    url: 'https://prestosports-downloads.s3.us-west-2.amazonaws.com/teamData/ijw9m5k79jl8apu9.json',
    conference: 'Crossroads'
  },
  {
    name: 'Indiana Wesleyan',
    url: 'https://prestosports-downloads.s3.us-west-2.amazonaws.com/teamData/56wbwagnvaxroi56.json',
    conference: 'Crossroads'
  },
  {
    name: 'Marian',
    url: 'https://prestosports-downloads.s3.us-west-2.amazonaws.com/teamData/3ausanq6wvezlgxy.json',
    conference: 'Crossroads'
  },
  {
    name: 'Mount Vernon Nazarene (OH)',
    url: 'https://prestosports-downloads.s3.us-west-2.amazonaws.com/teamData/hb50choy92t9zfe2.json',
    conference: 'Crossroads'
  },
  {
    name: 'Saint Francis (IN)',
    url: 'https://prestosports-downloads.s3.us-west-2.amazonaws.com/teamData/cb8db3txklxyc2pc.json',
    conference: 'Crossroads'
  },
  {
    name: 'Spring Arbor (Mich.)',
    url: 'https://prestosports-downloads.s3.us-west-2.amazonaws.com/teamData/cmtdcehecjx417n8.json',
    conference: 'Crossroads'
  },
  {
    name: 'Taylor (IN)',
    url: 'https://prestosports-downloads.s3.us-west-2.amazonaws.com/teamData/adb8lbgc77cnqk9n.json',
    conference: 'Crossroads'
  },
  {
    name: 'Bellevue (NE)',
    url: 'https://prestosports-downloads.s3.us-west-2.amazonaws.com/teamData/so1oqpcdme78dvk3.json',
    conference: 'Frontier'
  },
  {
    name: 'Bismarck State (ND)',
    url: 'https://prestosports-downloads.s3.us-west-2.amazonaws.com/teamData/geu6ewv55c4rtl9v.json',
    conference: 'Frontier'
  },
  {
    name: 'Carroll (MT)',
    url: 'https://prestosports-downloads.s3.us-west-2.amazonaws.com/teamData/77k94oykgzv6w8ef.json',
    conference: 'Frontier'
  },
  {
    name: 'Dakota State (SD)',
    url: 'https://prestosports-downloads.s3.us-west-2.amazonaws.com/teamData/krbl4y3pe460n3u6.json',
    conference: 'Frontier'
  },
  {
    name: 'Dickinson State (ND)',
    url: 'https://prestosports-downloads.s3.us-west-2.amazonaws.com/teamData/xjfzgl4n71gr0vnr.json',
    conference: 'Frontier'
  },
  {
    name: 'Mayville State',
    url: 'https://prestosports-downloads.s3.us-west-2.amazonaws.com/teamData/koxj4giy13frqier.json',
    conference: 'Frontier'
  },
  {
    name: 'Montana State-Northern (MT)',
    url: 'https://prestosports-downloads.s3.us-west-2.amazonaws.com/teamData/7jkz3hzdr4dq3qja.json',
    conference: 'Frontier'
  },
  {
    name: 'Montana Tech (MT)',
    url: 'https://prestosports-downloads.s3.us-west-2.amazonaws.com/teamData/t2gi12ks6ithhvps.json',
    conference: 'Frontier'
  },
  {
    name: 'Montana Western (MT)',
    url: 'https://prestosports-downloads.s3.us-west-2.amazonaws.com/teamData/5x66ef619svxlach.json',
    conference: 'Frontier'
  },
  {
    name: 'Providence (MT)',
    url: 'https://prestosports-downloads.s3.us-west-2.amazonaws.com/teamData/qtsdm4cwz0ksvwlg.json',
    conference: 'Frontier'
  },
  {
    name: 'Rocky Mountain (MT)',
    url: 'https://prestosports-downloads.s3.us-west-2.amazonaws.com/teamData/x0giszf8s5mck8z4.json',
    conference: 'Frontier'
  },
  {
    name: 'Valley City State',
    url: 'https://prestosports-downloads.s3.us-west-2.amazonaws.com/teamData/o43m70ylykqkbcu8.json',
    conference: 'Frontier'
  },
  {
    name: 'Briar Cliff (IA)',
    url: 'https://prestosports-downloads.s3.us-west-2.amazonaws.com/teamData/2p9iztvhnymzitjz.json',
    conference: 'Great Plains'
  },
  {
    name: 'Concordia (Neb.)',
    url: 'https://prestosports-downloads.s3.us-west-2.amazonaws.com/teamData/5vcsx4rpuv7yco96.json',
    conference: 'Great Plains'
  },
  {
    name: 'Dakota Wesleyan (SD)',
    url: 'https://prestosports-downloads.s3.us-west-2.amazonaws.com/teamData/p6hggilvflkpfy5n.json',
    conference: 'Great Plains'
  },
  {
    name: 'Doane (NE)',
    url: 'https://prestosports-downloads.s3.us-west-2.amazonaws.com/teamData/2pweokvomp075t04.json',
    conference: 'Great Plains'
  },
  {
    name: 'Dordt (IA)',
    url: 'https://prestosports-downloads.s3.us-west-2.amazonaws.com/teamData/8yf84siytuh1vd2d.json',
    conference: 'Great Plains'
  },
  {
    name: 'Hastings',
    url: 'https://prestosports-downloads.s3.us-west-2.amazonaws.com/teamData/61rhgpr7gvykllzf.json',
    conference: 'Great Plains'
  },
  {
    name: 'Midland',
    url: 'https://prestosports-downloads.s3.us-west-2.amazonaws.com/teamData/xb7l7kvc62jcki6m.json',
    conference: 'Great Plains'
  },
  {
    name: 'Morningside (Iowa)',
    url: 'https://prestosports-downloads.s3.us-west-2.amazonaws.com/teamData/kkm7lztsqyrz76hh.json',
    conference: 'Great Plains'
  },
  {
    name: 'Mount Marty',
    url: 'https://prestosports-downloads.s3.us-west-2.amazonaws.com/teamData/a80f731itzm9rq45.json',
    conference: 'Great Plains'
  },
  {
    name: 'Northwestern (Iowa)',
    url: 'https://prestosports-downloads.s3.us-west-2.amazonaws.com/teamData/yiy0s0ukmbrh55g9.json',
    conference: 'Great Plains'
  },
  {
    name: 'Waldorf',
    url: 'https://prestosports-downloads.s3.us-west-2.amazonaws.com/teamData/8i86sp8l6s1yci49.json',
    conference: 'Great Plains'
  },
  {
    name: 'Arizona Christian',
    url: 'https://prestosports-downloads.s3.us-west-2.amazonaws.com/teamData/ewg3uwod6litgh4k.json',
    conference: 'Great Southwest'
  },
  {
    name: 'Benedictine Mesa',
    url: 'https://prestosports-downloads.s3.us-west-2.amazonaws.com/teamData/0v3ibcw4z8ksjawf.json',
    conference: 'Great Southwest'
  },
  {
    name: 'Embry-Riddle (AZ)',
    url: 'https://prestosports-downloads.s3.us-west-2.amazonaws.com/teamData/uahzc9pfcg1la2ys.json',
    conference: 'Great Southwest'
  },
  {
    name: 'Hope International',
    url: 'https://prestosports-downloads.s3.us-west-2.amazonaws.com/teamData/j1nfsgs187990vmz.json',
    conference: 'Great Southwest'
  },
  {
    name: 'La Sierra',
    url: 'https://prestosports-downloads.s3.us-west-2.amazonaws.com/teamData/th6cpawtqnswsolt.json',
    conference: 'Great Southwest'
  },
  {
    name: 'Life Pacific',
    url: 'https://prestosports-downloads.s3.us-west-2.amazonaws.com/teamData/jdhor053gehturdd.json',
    conference: 'Great Southwest'
  },
  {
    name: 'OUAZ',
    url: 'https://prestosports-downloads.s3.us-west-2.amazonaws.com/teamData/mbgclfsuebfr9uhd.json',
    conference: 'Great Southwest'
  },
  {
    name: 'Park-Gilbert (AZ)',
    url: 'https://prestosports-downloads.s3.us-west-2.amazonaws.com/teamData/g4jnyn355yajs75r.json',
    conference: 'Great Southwest'
  },
  {
    name: 'Dillard (La.)',
    url: 'https://prestosports-downloads.s3.us-west-2.amazonaws.com/teamData/3kysfppgqn9w5ww6.json',
    conference: 'HBCU Conference'
  },
  {
    name: 'Fisk (TN)',
    url: 'https://prestosports-downloads.s3.us-west-2.amazonaws.com/teamData/iiqndbcumwot3efl.json',
    conference: 'HBCU Conference'
  },
  {
    name: 'Huston-Tillotson',
    url: 'https://prestosports-downloads.s3.us-west-2.amazonaws.com/teamData/886zvby1a7gkmdyk.json',
    conference: 'HBCU Conference'
  },
  {
    name: 'Oakwood (AL)',
    url: 'https://prestosports-downloads.s3.us-west-2.amazonaws.com/teamData/3tcvftukn7zt2bfn.json',
    conference: 'HBCU Conference'
  },
  {
    name: 'Paul Quinn',
    url: 'https://prestosports-downloads.s3.us-west-2.amazonaws.com/teamData/mk040olwrsi6r9za.json',
    conference: 'HBCU Conference'
  },
  {
    name: 'Philander Smith (AR)',
    url: 'https://prestosports-downloads.s3.us-west-2.amazonaws.com/teamData/43ak6qyhboo0u9co.json',
    conference: 'HBCU Conference'
  },
  {
    name: 'Rust (MS)',
    url: 'https://prestosports-downloads.s3.us-west-2.amazonaws.com/teamData/gy8jyx1b3s1ronzs.json',
    conference: 'HBCU Conference'
  },
  {
    name: 'Southern University at New Orleans (LA)',
    url: 'https://prestosports-downloads.s3.us-west-2.amazonaws.com/teamData/75pnvl92dopvv2zl.json',
    conference: 'HBCU Conference'
  },
  {
    name: 'Stillman',
    url: 'https://prestosports-downloads.s3.us-west-2.amazonaws.com/teamData/fhml5wi3xx5gclta.json',
    conference: 'HBCU Conference'
  },
  {
    name: 'Talladega (AL)',
    url: 'https://prestosports-downloads.s3.us-west-2.amazonaws.com/teamData/tx5zz1ofxfnghopf.json',
    conference: 'HBCU Conference'
  },
  {
    name: 'Tougaloo (Miss.)',
    url: 'https://prestosports-downloads.s3.us-west-2.amazonaws.com/teamData/rm5x9uvuhcwmqfp5.json',
    conference: 'HBCU Conference'
  },
  {
    name: 'Virgin Islands',
    url: 'https://prestosports-downloads.s3.us-west-2.amazonaws.com/teamData/ni6s1f44kf22dope.json',
    conference: 'HBCU Conference'
  },
  {
    name: 'Voorhees University',
    url: 'https://prestosports-downloads.s3.us-west-2.amazonaws.com/teamData/4vtoh5ygmslttgvp.json',
    conference: 'HBCU Conference'
  },
  {
    name: 'Wilberforce (OH)',
    url: 'https://prestosports-downloads.s3.us-west-2.amazonaws.com/teamData/cmjh1h90xx32smn4.json',
    conference: 'HBCU Conference'
  },
  {
    name: 'Wiley (TX)',
    url: 'https://prestosports-downloads.s3.us-west-2.amazonaws.com/teamData/ije5fae78xmfj4mt.json',
    conference: 'HBCU Conference'
  },
  {
    name: 'Baker',
    url: 'https://prestosports-downloads.s3.us-west-2.amazonaws.com/teamData/2dke2dg9d7epwrvh.json',
    conference: 'Heart of America'
  },
  {
    name: 'Benedictine (KS)',
    url: 'https://prestosports-downloads.s3.us-west-2.amazonaws.com/teamData/xnsyvh4xmn8zqgs8.json',
    conference: 'Heart of America'
  },
  {
    name: 'Central Methodist',
    url: 'https://prestosports-downloads.s3.us-west-2.amazonaws.com/teamData/zsa882elivq4sbky.json',
    conference: 'Heart of America'
  },
  {
    name: 'Clarke (IA)',
    url: 'https://prestosports-downloads.s3.us-west-2.amazonaws.com/teamData/7qnhqi6v8b45gf6f.json',
    conference: 'Heart of America'
  },
  {
    name: 'Culver-Stockton (MO)',
    url: 'https://prestosports-downloads.s3.us-west-2.amazonaws.com/teamData/7ti872mk3gv6rmi8.json',
    conference: 'Heart of America'
  },
  {
    name: 'Graceland',
    url: 'https://prestosports-downloads.s3.us-west-2.amazonaws.com/teamData/80bxkgxkcntz7330.json',
    conference: 'Heart of America'
  },
  {
    name: 'Grand View',
    url: 'https://prestosports-downloads.s3.us-west-2.amazonaws.com/teamData/00akf2gq08y449mm.json',
    conference: 'Heart of America'
  },
  {
    name: 'MidAmerica Nazarene',
    url: 'https://prestosports-downloads.s3.us-west-2.amazonaws.com/teamData/il4mdc03xf6t7b9d.json',
    conference: 'Heart of America'
  },
  {
    name: 'Missouri Baptist',
    url: 'https://prestosports-downloads.s3.us-west-2.amazonaws.com/teamData/h9yd19aa2lzifcap.json',
    conference: 'Heart of America'
  },
  {
    name: 'Missouri Valley',
    url: 'https://prestosports-downloads.s3.us-west-2.amazonaws.com/teamData/9mi0x36ppunzcj3p.json',
    conference: 'Heart of America'
  },
  {
    name: 'Mount Mercy',
    url: 'https://prestosports-downloads.s3.us-west-2.amazonaws.com/teamData/0f6s4kmveid2x5ia.json',
    conference: 'Heart of America'
  },
  {
    name: 'Park',
    url: 'https://prestosports-downloads.s3.us-west-2.amazonaws.com/teamData/lv1zwlk90a13f167.json',
    conference: 'Heart of America'
  },
  {
    name: 'Peru State',
    url: 'https://prestosports-downloads.s3.us-west-2.amazonaws.com/teamData/ep5jp9uebux1jxi1.json',
    conference: 'Heart of America'
  },
  {
    name: 'William Penn (Iowa)',
    url: 'https://prestosports-downloads.s3.us-west-2.amazonaws.com/teamData/ojd7b2jr0u3blf7x.json',
    conference: 'Heart of America'
  },
  {
    name: 'William Woods',
    url: 'https://prestosports-downloads.s3.us-west-2.amazonaws.com/teamData/bcdg2lfcnqq8feqx.json',
    conference: 'Heart of America'
  },
  {
    name: 'Avila (MO)',
    url: 'https://prestosports-downloads.s3.us-west-2.amazonaws.com/teamData/rlgvoguijufju1we.json',
    conference: 'KCAC'
  },
  {
    name: 'Bethany (KS)',
    url: 'https://prestosports-downloads.s3.us-west-2.amazonaws.com/teamData/2s4os0g8vi9fjjeu.json',
    conference: 'KCAC'
  },
  {
    name: 'Bethel (KS)',
    url: 'https://prestosports-downloads.s3.us-west-2.amazonaws.com/teamData/43m3k5wll3vupq1z.json',
    conference: 'KCAC'
  },
  {
    name: 'Evangel (Mo.)',
    url: 'https://prestosports-downloads.s3.us-west-2.amazonaws.com/teamData/h3eht9n47fprdz4c.json',
    conference: 'KCAC'
  },
  {
    name: 'Friends (KS)',
    url: 'https://prestosports-downloads.s3.us-west-2.amazonaws.com/teamData/28ww01qt1irstr83.json',
    conference: 'KCAC'
  },
  {
    name: 'Kansas Wesleyan',
    url: 'https://prestosports-downloads.s3.us-west-2.amazonaws.com/teamData/dcszmb4z37picldp.json',
    conference: 'KCAC'
  },
  {
    name: 'McPherson (Kan.)',
    url: 'https://prestosports-downloads.s3.us-west-2.amazonaws.com/teamData/deeyr82q75j88pi9.json',
    conference: 'KCAC'
  },
  {
    name: 'Oklahoma Wesleyan',
    url: 'https://prestosports-downloads.s3.us-west-2.amazonaws.com/teamData/03f7aes4dwqskjzm.json',
    conference: 'KCAC'
  },
  {
    name: 'Ottawa (Kan.)',
    url: 'https://prestosports-downloads.s3.us-west-2.amazonaws.com/teamData/2f01lzamkbef2fmr.json',
    conference: 'KCAC'
  },
  {
    name: 'Saint Mary',
    url: 'https://prestosports-downloads.s3.us-west-2.amazonaws.com/teamData/71nh3jgot5qd4je0.json',
    conference: 'KCAC'
  },
  {
    name: 'Southwestern',
    url: 'https://prestosports-downloads.s3.us-west-2.amazonaws.com/teamData/di6eopk91pm4ptok.json',
    conference: 'KCAC'
  },
  {
    name: 'Sterling',
    url: 'https://prestosports-downloads.s3.us-west-2.amazonaws.com/teamData/mdsct1ssyax3w0ux.json',
    conference: 'KCAC'
  },
  {
    name: 'Tabor',
    url: 'https://prestosports-downloads.s3.us-west-2.amazonaws.com/teamData/jkk14em46uq8ub73.json',
    conference: 'KCAC'
  },
  {
    name: 'York (NE)',
    url: 'https://prestosports-downloads.s3.us-west-2.amazonaws.com/teamData/edcndd376mpvg0ck.json',
    conference: 'KCAC'
  },
  {
    name: 'Bethel (TN)',
    url: 'https://prestosports-downloads.s3.us-west-2.amazonaws.com/teamData/rop857y3wzih5xu3.json',
    conference: 'Mid-South'
  },
  {
    name: 'Campbellsville (KY)',
    url: 'https://prestosports-downloads.s3.us-west-2.amazonaws.com/teamData/mm3z1fwmxboxur07.json',
    conference: 'Mid-South'
  },
  {
    name: 'Cumberland (Tenn.)',
    url: 'https://prestosports-downloads.s3.us-west-2.amazonaws.com/teamData/58fkm9vx1agchalz.json',
    conference: 'Mid-South'
  },
  {
    name: 'Cumberlands (Ky.)',
    url: 'https://prestosports-downloads.s3.us-west-2.amazonaws.com/teamData/a8ctlz4mrw5lz47a.json',
    conference: 'Mid-South'
  },
  {
    name: 'Freed-Hardeman (Tenn.)',
    url: 'https://prestosports-downloads.s3.us-west-2.amazonaws.com/teamData/jwnyo2lpc3vnga4g.json',
    conference: 'Mid-South'
  },
  {
    name: 'Georgetown (Ky.)',
    url: 'https://prestosports-downloads.s3.us-west-2.amazonaws.com/teamData/dym98aepst44x1v4.json',
    conference: 'Mid-South'
  },
  {
    name: 'Lindsey Wilson (Ky.)',
    url: 'https://prestosports-downloads.s3.us-west-2.amazonaws.com/teamData/nmcwq9nsg0wbklvr.json',
    conference: 'Mid-South'
  },
  {
    name: 'Huston-Tillotson',
    url: 'https://prestosports-downloads.s3.us-west-2.amazonaws.com/teamData/5ntl0ve2k3oiv4dw.json',
    conference: 'Red River'
  },
  {
    name: 'Jarvis Christian',
    url: 'https://prestosports-downloads.s3.us-west-2.amazonaws.com/teamData/fzos97hjkbw3n0n1.json',
    conference: 'Red River'
  },
  {
    name: 'LSU Alexandria (La.)',
    url: 'https://prestosports-downloads.s3.us-west-2.amazonaws.com/teamData/iqzgom7h0ju1fq52.json',
    conference: 'Red River'
  },
  {
    name: 'LSU Shreveport (La.)',
    url: 'https://prestosports-downloads.s3.us-west-2.amazonaws.com/teamData/t54lw39uy3l8i95f.json',
    conference: 'Red River'
  },
  {
    name: 'Louisiana Christian',
    url: 'https://prestosports-downloads.s3.us-west-2.amazonaws.com/teamData/czem8ort9cz09oox.json',
    conference: 'Red River'
  },
  {
    name: 'North American',
    url: 'https://prestosports-downloads.s3.us-west-2.amazonaws.com/teamData/9r71j91ff2sxxq9x.json',
    conference: 'Red River'
  },
  {
    name: 'Our Lady of the Lake',
    url: 'https://prestosports-downloads.s3.us-west-2.amazonaws.com/teamData/b7xcmrqaq3jw1ihz.json',
    conference: 'Red River'
  },
  {
    name: 'Paul Quinn',
    url: 'https://prestosports-downloads.s3.us-west-2.amazonaws.com/teamData/jzx3as1gzqhzrb9x.json',
    conference: 'Red River'
  },
  {
    name: 'Southwest',
    url: 'https://prestosports-downloads.s3.us-west-2.amazonaws.com/teamData/7bvubyk9jf99u6wq.json',
    conference: 'Red River'
  },
  {
    name: 'Texas A&M  Texarkana',
    url: 'https://prestosports-downloads.s3.us-west-2.amazonaws.com/teamData/13nr6yl4n1nynonm.json',
    conference: 'Red River'
  },
  {
    name: 'Texas A&amp;M-San Antonio',
    url: 'https://prestosports-downloads.s3.us-west-2.amazonaws.com/teamData/3yj6ce0c8yycm2vy.json',
    conference: 'Red River'
  },
  {
    name: 'Texas College',
    url: 'https://prestosports-downloads.s3.us-west-2.amazonaws.com/teamData/245b1fslxyrr21ai.json',
    conference: 'Red River'
  },
  {
    name: 'Xavier (La.)',
    url: 'https://prestosports-downloads.s3.us-west-2.amazonaws.com/teamData/0df12pb14tenepxg.json',
    conference: 'Red River'
  },
  {
    name: 'Brescia (KY)',
    url: 'https://prestosports-downloads.s3.us-west-2.amazonaws.com/teamData/6c2wxa01gb8kj2gh.json',
    conference: 'River States'
  },
  {
    name: 'IU Columbus',
    url: 'https://prestosports-downloads.s3.us-west-2.amazonaws.com/teamData/2jbzd944amsfw7uk.json',
    conference: 'River States'
  },
  {
    name: 'IU Kokomo',
    url: 'https://prestosports-downloads.s3.us-west-2.amazonaws.com/teamData/kx8d4ogl9xomr7nd.json',
    conference: 'River States'
  },
  {
    name: 'Indiana East',
    url: 'https://prestosports-downloads.s3.us-west-2.amazonaws.com/teamData/8vwua8nbm34lgbdm.json',
    conference: 'River States'
  },
  {
    name: 'Indiana Southeast',
    url: 'https://prestosports-downloads.s3.us-west-2.amazonaws.com/teamData/t8p6ki9wijzg1pbo.json',
    conference: 'River States'
  },
  {
    name: 'Kentucky Christian',
    url: 'https://prestosports-downloads.s3.us-west-2.amazonaws.com/teamData/vysiphwx7nox4hl0.json',
    conference: 'River States'
  },
  {
    name: 'Midway',
    url: 'https://prestosports-downloads.s3.us-west-2.amazonaws.com/teamData/b7cohdvvo3lfrb56.json',
    conference: 'River States'
  },
  {
    name: 'Oakland City (IN)',
    url: 'https://prestosports-downloads.s3.us-west-2.amazonaws.com/teamData/cxttsfwd9d8ui0cx.json',
    conference: 'River States'
  },
  {
    name: 'Rio Grande',
    url: 'https://prestosports-downloads.s3.us-west-2.amazonaws.com/teamData/rjjdfn81rv21zypb.json',
    conference: 'River States'
  },
  {
    name: 'Shawnee State',
    url: 'https://prestosports-downloads.s3.us-west-2.amazonaws.com/teamData/o808yeyoqyxf7qzi.json',
    conference: 'River States'
  },
  {
    name: 'St. Mary-Woods',
    url: 'https://prestosports-downloads.s3.us-west-2.amazonaws.com/teamData/eoidoav77s1jknw9.json',
    conference: 'River States'
  },
  {
    name: 'WVU Tech (WV)',
    url: 'https://prestosports-downloads.s3.us-west-2.amazonaws.com/teamData/cjvmcufvu6llqvyp.json',
    conference: 'River States'
  },
  {
    name: 'Central Christian (KS)',
    url: 'https://prestosports-downloads.s3.us-west-2.amazonaws.com/teamData/mqz8lztdcis4jler.json',
    conference: 'Sooner'
  },
  {
    name: 'College of the Ozarks',
    url: 'https://prestosports-downloads.s3.us-west-2.amazonaws.com/teamData/42btd352sasg786k.json',
    conference: 'Sooner'
  },
  {
    name: 'John Brown',
    url: 'https://prestosports-downloads.s3.us-west-2.amazonaws.com/teamData/y8ziuz9xkfnpagm4.json',
    conference: 'Sooner'
  },
  {
    name: 'Langston (Okla.)',
    url: 'https://prestosports-downloads.s3.us-west-2.amazonaws.com/teamData/j08sh4mqj320sxcq.json',
    conference: 'Sooner'
  },
  {
    name: 'Mid-America Christian',
    url: 'https://prestosports-downloads.s3.us-west-2.amazonaws.com/teamData/ey2zc8sfvv21k24i.json',
    conference: 'Sooner'
  },
  {
    name: 'Nelson (Texas)',
    url: 'https://prestosports-downloads.s3.us-west-2.amazonaws.com/teamData/k0vrp3bxv839vdth.json',
    conference: 'Sooner'
  },
  {
    name: 'Oklahoma City',
    url: 'https://prestosports-downloads.s3.us-west-2.amazonaws.com/teamData/mpoo76vo6j43nc1b.json',
    conference: 'Sooner'
  },
  {
    name: 'Oklahoma Panhandle State',
    url: 'https://prestosports-downloads.s3.us-west-2.amazonaws.com/teamData/6g122touan13zcvz.json',
    conference: 'Sooner'
  },
  {
    name: 'Science and Arts',
    url: 'https://prestosports-downloads.s3.us-west-2.amazonaws.com/teamData/kmxfjgfvoos1vezv.json',
    conference: 'Sooner'
  },
  {
    name: 'Southwestern Christian',
    url: 'https://prestosports-downloads.s3.us-west-2.amazonaws.com/teamData/6g67kx2orpp1d5jn.json',
    conference: 'Sooner'
  },
  {
    name: 'Texas Wesleyan',
    url: 'https://prestosports-downloads.s3.us-west-2.amazonaws.com/teamData/32w8y7fygi8srltm.json',
    conference: 'Sooner'
  },
  {
    name: 'Wayland Baptist (TX)',
    url: 'https://prestosports-downloads.s3.us-west-2.amazonaws.com/teamData/ifb9rcd3hbrf0rdw.json',
    conference: 'Sooner'
  },
  {
    name: 'Abraham Baldwin Agricultural',
    url: 'https://prestosports-downloads.s3.us-west-2.amazonaws.com/teamData/7ovx9ct5qj200e2e.json',
    conference: 'Southern States'
  },
  {
    name: 'Blue Mountain Christian (MS)',
    url: 'https://prestosports-downloads.s3.us-west-2.amazonaws.com/teamData/skzdyceviagoc1eb.json',
    conference: 'Southern States'
  },
  {
    name: 'Brewton-Parker (GA)',
    url: 'https://prestosports-downloads.s3.us-west-2.amazonaws.com/teamData/xwktikhg9dglsw4h.json',
    conference: 'Southern States'
  },
  {
    name: 'Dalton State (GA)',
    url: 'https://prestosports-downloads.s3.us-west-2.amazonaws.com/teamData/8f0gpnid3vlgwjw6.json',
    conference: 'Southern States'
  },
  {
    name: 'Faulkner (AL)',
    url: 'https://prestosports-downloads.s3.us-west-2.amazonaws.com/teamData/a1jgon8f4hwhuj6g.json',
    conference: 'Southern States'
  },
  {
    name: 'Life',
    url: 'https://prestosports-downloads.s3.us-west-2.amazonaws.com/teamData/9v7meboyv88on4na.json',
    conference: 'Southern States'
  },
  {
    name: 'Loyola (La.)',
    url: 'https://prestosports-downloads.s3.us-west-2.amazonaws.com/teamData/0a6fp9f0py4ncpd1.json',
    conference: 'Southern States'
  },
  {
    name: 'Middle Georgia State',
    url: 'https://prestosports-downloads.s3.us-west-2.amazonaws.com/teamData/6p1hxz3yjfik562i.json',
    conference: 'Southern States'
  },
  {
    name: 'Mobile (Ala.)',
    url: 'https://prestosports-downloads.s3.us-west-2.amazonaws.com/teamData/yqn7hpbu8afw8sqp.json',
    conference: 'Southern States'
  },
  {
    name: 'Point',
    url: 'https://prestosports-downloads.s3.us-west-2.amazonaws.com/teamData/ynqzhufd5m1fnh5f.json',
    conference: 'Southern States'
  },
  {
    name: 'Tennessee Southern',
    url: 'https://prestosports-downloads.s3.us-west-2.amazonaws.com/teamData/j9vfdbcwao1ex2t4.json',
    conference: 'Southern States'
  },
  {
    name: 'Thomas',
    url: 'https://prestosports-downloads.s3.us-west-2.amazonaws.com/teamData/7rw05olr4fewffny.json',
    conference: 'Southern States'
  },
  {
    name: 'William Carey (Miss.)',
    url: 'https://prestosports-downloads.s3.us-west-2.amazonaws.com/teamData/8d9rvfbac9677e55.json',
    conference: 'Southern States'
  },
  {
    name: 'Ave Maria',
    url: 'https://prestosports-downloads.s3.us-west-2.amazonaws.com/teamData/qx4f5rsc0eriy8km.json',
    conference: 'The Sun'
  },
  {
    name: 'Coastal Georgia',
    url: 'https://prestosports-downloads.s3.us-west-2.amazonaws.com/teamData/w0knl6cpiwcplyi6.json',
    conference: 'The Sun'
  },
  {
    name: 'Florida Memorial',
    url: 'https://prestosports-downloads.s3.us-west-2.amazonaws.com/teamData/z9lypwqlhd5u4i9d.json',
    conference: 'The Sun'
  },
  {
    name: 'Keiser (Fla.)',
    url: 'https://prestosports-downloads.s3.us-west-2.amazonaws.com/teamData/5fsku8nsnx6wu5el.json',
    conference: 'The Sun'
  },
  {
    name: 'New College of Florida',
    url: 'https://prestosports-downloads.s3.us-west-2.amazonaws.com/teamData/o1s8y7t697kgwglo.json',
    conference: 'The Sun'
  },
  {
    name: 'Southeastern (Fla.)',
    url: 'https://prestosports-downloads.s3.us-west-2.amazonaws.com/teamData/bbefpsprq4iww70x.json',
    conference: 'The Sun'
  },
  {
    name: 'St. Thomas (Fla.)',
    url: 'https://prestosports-downloads.s3.us-west-2.amazonaws.com/teamData/ig0wsst5y3nf909d.json',
    conference: 'The Sun'
  },
  {
    name: 'Warner (FL)',
    url: 'https://prestosports-downloads.s3.us-west-2.amazonaws.com/teamData/ympwm0xsrtbss5dv.json',
    conference: 'The Sun'
  },
  {
    name: 'Webber International (FL)',
    url: 'https://prestosports-downloads.s3.us-west-2.amazonaws.com/teamData/hde39dioprem1wwl.json',
    conference: 'The Sun'
  },
  {
    name: 'Aquinas (Mich.)',
    url: 'https://prestosports-downloads.s3.us-west-2.amazonaws.com/teamData/qt8zi4e7fi3d9822.json',
    conference: 'Wolverine-Hoosier'
  },
  {
    name: 'Cleary (MI)',
    url: 'https://prestosports-downloads.s3.us-west-2.amazonaws.com/teamData/y1c07998xyo96z3f.json',
    conference: 'Wolverine-Hoosier'
  },
  {
    name: 'Cornerstone',
    url: 'https://prestosports-downloads.s3.us-west-2.amazonaws.com/teamData/yowe2ihb3x0s57ki.json',
    conference: 'Wolverine-Hoosier'
  },
  {
    name: 'Defiance College (OH)',
    url: 'https://prestosports-downloads.s3.us-west-2.amazonaws.com/teamData/fkbl469rff7uozfa.json',
    conference: 'Wolverine-Hoosier'
  },
  {
    name: 'Indiana Tech',
    url: 'https://prestosports-downloads.s3.us-west-2.amazonaws.com/teamData/ovuabkdpbgfesti2.json',
    conference: 'Wolverine-Hoosier'
  },
  {
    name: 'Lawrence Tech',
    url: 'https://prestosports-downloads.s3.us-west-2.amazonaws.com/teamData/2zedt96z7nko4874.json',
    conference: 'Wolverine-Hoosier'
  },
  {
    name: 'Lourdes',
    url: 'https://prestosports-downloads.s3.us-west-2.amazonaws.com/teamData/xah7lzr8zfbhcgte.json',
    conference: 'Wolverine-Hoosier'
  },
  {
    name: 'Madonna (Mich.)',
    url: 'https://prestosports-downloads.s3.us-west-2.amazonaws.com/teamData/xe7gv016i10uoc6v.json',
    conference: 'Wolverine-Hoosier'
  },
  {
    name: 'Michigan-Dearborn',
    url: 'https://prestosports-downloads.s3.us-west-2.amazonaws.com/teamData/eaugxtoc5azt9bqw.json',
    conference: 'Wolverine-Hoosier'
  },
  {
    name: 'Northwestern Ohio',
    url: 'https://prestosports-downloads.s3.us-west-2.amazonaws.com/teamData/qvshurr30id7torq.json',
    conference: 'Wolverine-Hoosier'
  },
  {
    name: 'Rochester Christian (Mich.)',
    url: 'https://prestosports-downloads.s3.us-west-2.amazonaws.com/teamData/bl3wfshkutiszsjb.json',
    conference: 'Wolverine-Hoosier'
  },
  {
    name: 'Siena Heights',
    url: 'https://prestosports-downloads.s3.us-west-2.amazonaws.com/teamData/f7kfaycoyllojha9.json',
    conference: 'Wolverine-Hoosier'
  }
];

// 2024-25 Season Teams
// 2024-25 Season Teams (Full Extraction - 132 teams from 10 conferences)
// 2024-25 Season Teams (Full Extraction - 219 teams from 20 conferences)
const TEAMS_2024_25 = [
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
    name: 'Pikeville (	KY)',
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
  },
  {
    name: 'Central Baptist (Ark.)',
    url: 'https://prestosports-downloads.s3.us-west-2.amazonaws.com/teamData/84cn3s8ghoccscm0.json',
    conference: 'American Midwest'
  },
  {
    name: 'Columbia (MO)',
    url: 'https://prestosports-downloads.s3.us-west-2.amazonaws.com/teamData/5pgro7tafbf0trt4.json',
    conference: 'American Midwest'
  },
  {
    name: 'Crowley\'s Ridge (AR)',
    url: 'https://prestosports-downloads.s3.us-west-2.amazonaws.com/teamData/qym03coui37tkznf.json',
    conference: 'American Midwest'
  },
  {
    name: 'Hannibal-LaGrange (MO)',
    url: 'https://prestosports-downloads.s3.us-west-2.amazonaws.com/teamData/pteke9ftl5dn79wc.json',
    conference: 'American Midwest'
  },
  {
    name: 'Harris-Stowe (MO)',
    url: 'https://prestosports-downloads.s3.us-west-2.amazonaws.com/teamData/09rxbfisdqj24nmv.json',
    conference: 'American Midwest'
  },
  {
    name: 'Mission (Mo.)',
    url: 'https://prestosports-downloads.s3.us-west-2.amazonaws.com/teamData/oqbfcye6bu1y2xmo.json',
    conference: 'American Midwest'
  },
  {
    name: 'Missouri Baptist',
    url: 'https://prestosports-downloads.s3.us-west-2.amazonaws.com/teamData/264bw078inirmguc.json',
    conference: 'American Midwest'
  },
  {
    name: 'UHSP',
    url: 'https://prestosports-downloads.s3.us-west-2.amazonaws.com/teamData/a9lz5bw99e2s4h0n.json',
    conference: 'American Midwest'
  },
  {
    name: 'William Woods',
    url: 'https://prestosports-downloads.s3.us-west-2.amazonaws.com/teamData/46fm9of1hgqop0cp.json',
    conference: 'American Midwest'
  },
  {
    name: 'Williams Baptist (AR)',
    url: 'https://prestosports-downloads.s3.us-west-2.amazonaws.com/teamData/nhfnawr115rrmfth.json',
    conference: 'American Midwest'
  },
  {
    name: 'Cal Maritime',
    url: 'https://prestosports-downloads.s3.us-west-2.amazonaws.com/teamData/j9blvopub36u0kla.json',
    conference: 'California Pacific'
  },
  {
    name: 'La Sierra',
    url: 'https://prestosports-downloads.s3.us-west-2.amazonaws.com/teamData/qa90gp0qyun7c0ga.json',
    conference: 'California Pacific'
  },
  {
    name: 'Pacific Union (CA)',
    url: 'https://prestosports-downloads.s3.us-west-2.amazonaws.com/teamData/0i597nvxwucbirlv.json',
    conference: 'California Pacific'
  },
  {
    name: 'Simpson (CA)',
    url: 'https://prestosports-downloads.s3.us-west-2.amazonaws.com/teamData/izlzid3yp87j7una.json',
    conference: 'California Pacific'
  },
  {
    name: 'UC Merced',
    url: 'https://prestosports-downloads.s3.us-west-2.amazonaws.com/teamData/wysa6jq1exxhg5lq.json',
    conference: 'California Pacific'
  },
  {
    name: 'Westcliff (Calif.)',
    url: 'https://prestosports-downloads.s3.us-west-2.amazonaws.com/teamData/fh98g7kgt8fhn1zj.json',
    conference: 'California Pacific'
  },
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
    name: 'Calumet (IN)',
    url: 'https://prestosports-downloads.s3.us-west-2.amazonaws.com/teamData/3m07p9pnioqpmdx1.json',
    conference: 'Chicagoland'
  },
  {
    name: 'Governors State',
    url: 'https://prestosports-downloads.s3.us-west-2.amazonaws.com/teamData/cezissxlingki0ia.json',
    conference: 'Chicagoland'
  },
  {
    name: 'Holy Cross (Ind.)',
    url: 'https://prestosports-downloads.s3.us-west-2.amazonaws.com/teamData/azl7wcfiadz39g4x.json',
    conference: 'Chicagoland'
  },
  {
    name: 'Indiana Northwest',
    url: 'https://prestosports-downloads.s3.us-west-2.amazonaws.com/teamData/hndg44d3nyejs75s.json',
    conference: 'Chicagoland'
  },
  {
    name: 'Indiana South Bend (IN)',
    url: 'https://prestosports-downloads.s3.us-west-2.amazonaws.com/teamData/g4erokvl02ldxz5r.json',
    conference: 'Chicagoland'
  },
  {
    name: 'Judson (IL)',
    url: 'https://prestosports-downloads.s3.us-west-2.amazonaws.com/teamData/b06otktz19hhxs07.json',
    conference: 'Chicagoland'
  },
  {
    name: 'Olivet Nazarene (IL)',
    url: 'https://prestosports-downloads.s3.us-west-2.amazonaws.com/teamData/dn7gho3v6tbd8z4p.json',
    conference: 'Chicagoland'
  },
  {
    name: 'Saint Xavier (IL)',
    url: 'https://prestosports-downloads.s3.us-west-2.amazonaws.com/teamData/jeio170m6aymwz2y.json',
    conference: 'Chicagoland'
  },
  {
    name: 'St. Ambrose (IA)',
    url: 'https://prestosports-downloads.s3.us-west-2.amazonaws.com/teamData/2mwmtoazc4y241g9.json',
    conference: 'Chicagoland'
  },
  {
    name: 'St. Francis (IL)',
    url: 'https://prestosports-downloads.s3.us-west-2.amazonaws.com/teamData/qzxkfjxkn858gurq.json',
    conference: 'Chicagoland'
  },
  {
    name: 'Trinity Christian (IL)',
    url: 'https://prestosports-downloads.s3.us-west-2.amazonaws.com/teamData/ecy19nqqdwtyjy6h.json',
    conference: 'Chicagoland'
  },
  {
    name: 'Viterbo',
    url: 'https://prestosports-downloads.s3.us-west-2.amazonaws.com/teamData/78dx6mh44cbd270v.json',
    conference: 'Chicagoland'
  },
  {
    name: 'Arkansas Baptist',
    url: 'https://prestosports-downloads.s3.us-west-2.amazonaws.com/teamData/0e6oxtt63pk3gmvo.json',
    conference: 'Continental'
  },
  {
    name: 'Carolina (N.C.)',
    url: 'https://prestosports-downloads.s3.us-west-2.amazonaws.com/teamData/n8m2oywnxlu2225g.json',
    conference: 'Continental'
  },
  {
    name: 'Fisher (MA)',
    url: 'https://prestosports-downloads.s3.us-west-2.amazonaws.com/teamData/k1n83lqxdl3r9g8t.json',
    conference: 'Continental'
  },
  {
    name: 'Florida College (FL)',
    url: 'https://prestosports-downloads.s3.us-west-2.amazonaws.com/teamData/edrqttyy2antrasf.json',
    conference: 'Continental'
  },
  {
    name: 'Florida National',
    url: 'https://prestosports-downloads.s3.us-west-2.amazonaws.com/teamData/ev2s1y7otlfym79k.json',
    conference: 'Continental'
  },
  {
    name: 'Haskell Indian Nations University',
    url: 'https://prestosports-downloads.s3.us-west-2.amazonaws.com/teamData/qysbnirz9blcgd82.json',
    conference: 'Continental'
  },
  {
    name: 'Morris',
    url: 'https://prestosports-downloads.s3.us-west-2.amazonaws.com/teamData/lnud10a7399xfuh0.json',
    conference: 'Continental'
  },
  {
    name: 'Northern New Mexico',
    url: 'https://prestosports-downloads.s3.us-west-2.amazonaws.com/teamData/m5cui62oru7aeg7d.json',
    conference: 'Continental'
  },
  {
    name: 'Spartanburg Methodist',
    url: 'https://prestosports-downloads.s3.us-west-2.amazonaws.com/teamData/19kzfct4xdvj3u8m.json',
    conference: 'Continental'
  },
  {
    name: 'Washington Adventist (MD)',
    url: 'https://prestosports-downloads.s3.us-west-2.amazonaws.com/teamData/4wo71vkaxzj18h1w.json',
    conference: 'Continental'
  },
  {
    name: 'Bethel (IN)',
    url: 'https://prestosports-downloads.s3.us-west-2.amazonaws.com/teamData/mw3u4zgauvl5xj9q.json',
    conference: 'Crossroads'
  },
  {
    name: 'Goshen (IN)',
    url: 'https://prestosports-downloads.s3.us-west-2.amazonaws.com/teamData/wolzbymtn4yrh92y.json',
    conference: 'Crossroads'
  },
  {
    name: 'Grace (Ind.)',
    url: 'https://prestosports-downloads.s3.us-west-2.amazonaws.com/teamData/4mylq43vskagl76a.json',
    conference: 'Crossroads'
  },
  {
    name: 'Huntington (IN)',
    url: 'https://prestosports-downloads.s3.us-west-2.amazonaws.com/teamData/clfmuux13t9f688l.json',
    conference: 'Crossroads'
  },
  {
    name: 'Indiana Wesleyan',
    url: 'https://prestosports-downloads.s3.us-west-2.amazonaws.com/teamData/ixao0d4zn0rhutix.json',
    conference: 'Crossroads'
  },
  {
    name: 'Marian',
    url: 'https://prestosports-downloads.s3.us-west-2.amazonaws.com/teamData/0von3g5ewiugeksb.json',
    conference: 'Crossroads'
  },
  {
    name: 'Mount Vernon Nazarene (OH)',
    url: 'https://prestosports-downloads.s3.us-west-2.amazonaws.com/teamData/10pg4mwoyjis0yzo.json',
    conference: 'Crossroads'
  },
  {
    name: 'Saint Francis (IN)',
    url: 'https://prestosports-downloads.s3.us-west-2.amazonaws.com/teamData/dvla58mok251my5n.json',
    conference: 'Crossroads'
  },
  {
    name: 'Spring Arbor (Mich.)',
    url: 'https://prestosports-downloads.s3.us-west-2.amazonaws.com/teamData/kpcery3f8fcclcfi.json',
    conference: 'Crossroads'
  },
  {
    name: 'Taylor (IN)',
    url: 'https://prestosports-downloads.s3.us-west-2.amazonaws.com/teamData/qn7xmb353b4iip22.json',
    conference: 'Crossroads'
  },
  {
    name: 'Carroll (MT)',
    url: 'https://prestosports-downloads.s3.us-west-2.amazonaws.com/teamData/ftoq38h4uwznrl7e.json',
    conference: 'Frontier'
  },
  {
    name: 'Montana State-Northern (MT)',
    url: 'https://prestosports-downloads.s3.us-west-2.amazonaws.com/teamData/86cfpffsm4ayqn7b.json',
    conference: 'Frontier'
  },
  {
    name: 'Montana Tech (MT)',
    url: 'https://prestosports-downloads.s3.us-west-2.amazonaws.com/teamData/755w9dwumsmhc0o8.json',
    conference: 'Frontier'
  },
  {
    name: 'Montana Western (MT)',
    url: 'https://prestosports-downloads.s3.us-west-2.amazonaws.com/teamData/8pbto88udhv2g7q9.json',
    conference: 'Frontier'
  },
  {
    name: 'Providence (MT)',
    url: 'https://prestosports-downloads.s3.us-west-2.amazonaws.com/teamData/fj87cdpadblyehpd.json',
    conference: 'Frontier'
  },
  {
    name: 'Rocky Mountain (MT)',
    url: 'https://prestosports-downloads.s3.us-west-2.amazonaws.com/teamData/6m4scaxnqer4cvnq.json',
    conference: 'Frontier'
  },
  {
    name: 'Briar Cliff (IA)',
    url: 'https://prestosports-downloads.s3.us-west-2.amazonaws.com/teamData/mfh5v89tb993476h.json',
    conference: 'Great Plains'
  },
  {
    name: 'Concordia (Neb.)',
    url: 'https://prestosports-downloads.s3.us-west-2.amazonaws.com/teamData/col7ugca1ewh6gtr.json',
    conference: 'Great Plains'
  },
  {
    name: 'Dakota Wesleyan (SD)',
    url: 'https://prestosports-downloads.s3.us-west-2.amazonaws.com/teamData/2lc6gn461vs00clt.json',
    conference: 'Great Plains'
  },
  {
    name: 'Doane (NE)',
    url: 'https://prestosports-downloads.s3.us-west-2.amazonaws.com/teamData/4rfu9eb0a9w8qzpg.json',
    conference: 'Great Plains'
  },
  {
    name: 'Dordt (IA)',
    url: 'https://prestosports-downloads.s3.us-west-2.amazonaws.com/teamData/15ac7gqcfjd6wtp1.json',
    conference: 'Great Plains'
  },
  {
    name: 'Hastings',
    url: 'https://prestosports-downloads.s3.us-west-2.amazonaws.com/teamData/b270o73wxqzhqd01.json',
    conference: 'Great Plains'
  },
  {
    name: 'Midland',
    url: 'https://prestosports-downloads.s3.us-west-2.amazonaws.com/teamData/h7bkiw7tvsaae2tm.json',
    conference: 'Great Plains'
  },
  {
    name: 'Morningside (Iowa)',
    url: 'https://prestosports-downloads.s3.us-west-2.amazonaws.com/teamData/9ivtolflz5jawv0l.json',
    conference: 'Great Plains'
  },
  {
    name: 'Mount Marty',
    url: 'https://prestosports-downloads.s3.us-west-2.amazonaws.com/teamData/c92r0wux1frifh1l.json',
    conference: 'Great Plains'
  },
  {
    name: 'Northwestern (Iowa)',
    url: 'https://prestosports-downloads.s3.us-west-2.amazonaws.com/teamData/028572pibynveypy.json',
    conference: 'Great Plains'
  },
  {
    name: 'Waldorf',
    url: 'https://prestosports-downloads.s3.us-west-2.amazonaws.com/teamData/f5aatibm9bl03k70.json',
    conference: 'Great Plains'
  },
  {
    name: 'Arizona Christian',
    url: 'https://prestosports-downloads.s3.us-west-2.amazonaws.com/teamData/11kdwpu6um4kdt38.json',
    conference: 'Great Southwest'
  },
  {
    name: 'Benedictine Mesa',
    url: 'https://prestosports-downloads.s3.us-west-2.amazonaws.com/teamData/irjcs43alkzdddf8.json',
    conference: 'Great Southwest'
  },
  {
    name: 'Embry-Riddle (AZ)',
    url: 'https://prestosports-downloads.s3.us-west-2.amazonaws.com/teamData/bz9qqtherc8gcq1k.json',
    conference: 'Great Southwest'
  },
  {
    name: 'Hope International',
    url: 'https://prestosports-downloads.s3.us-west-2.amazonaws.com/teamData/ke09w43196mo44dx.json',
    conference: 'Great Southwest'
  },
  {
    name: 'Life Pacific',
    url: 'https://prestosports-downloads.s3.us-west-2.amazonaws.com/teamData/1bkrjfb5urrmmqew.json',
    conference: 'Great Southwest'
  },
  {
    name: 'OUAZ',
    url: 'https://prestosports-downloads.s3.us-west-2.amazonaws.com/teamData/234j93tbp5znt68u.json',
    conference: 'Great Southwest'
  },
  {
    name: 'Park-Gilbert (AZ)',
    url: 'https://prestosports-downloads.s3.us-west-2.amazonaws.com/teamData/3gzmd837w4lx49jf.json',
    conference: 'Great Southwest'
  },
  {
    name: 'The Master\'s (Calif.)',
    url: 'https://prestosports-downloads.s3.us-west-2.amazonaws.com/teamData/qo58r2rb6vu88b84.json',
    conference: 'Great Southwest'
  },
  {
    name: 'Dillard (La.)',
    url: 'https://prestosports-downloads.s3.us-west-2.amazonaws.com/teamData/dxv3kirydgexj6hw.json',
    conference: 'HBCU Conference'
  },
  {
    name: 'Fisk (TN)',
    url: 'https://prestosports-downloads.s3.us-west-2.amazonaws.com/teamData/e5vb1unj7dae28gn.json',
    conference: 'HBCU Conference'
  },
  {
    name: 'Oakwood (AL)',
    url: 'https://prestosports-downloads.s3.us-west-2.amazonaws.com/teamData/dw63b5cljd1qtenx.json',
    conference: 'HBCU Conference'
  },
  {
    name: 'Philander Smith (AR)',
    url: 'https://prestosports-downloads.s3.us-west-2.amazonaws.com/teamData/28ha3aagbqsy0rs5.json',
    conference: 'HBCU Conference'
  },
  {
    name: 'Rust (MS)',
    url: 'https://prestosports-downloads.s3.us-west-2.amazonaws.com/teamData/t4jcyneanjppi2al.json',
    conference: 'HBCU Conference'
  },
  {
    name: 'Southern University at New Orleans (LA)',
    url: 'https://prestosports-downloads.s3.us-west-2.amazonaws.com/teamData/aya07pm5wqqzws55.json',
    conference: 'HBCU Conference'
  },
  {
    name: 'Stillman',
    url: 'https://prestosports-downloads.s3.us-west-2.amazonaws.com/teamData/d8dqlbxm6pe2ytzj.json',
    conference: 'HBCU Conference'
  },
  {
    name: 'Talladega (AL)',
    url: 'https://prestosports-downloads.s3.us-west-2.amazonaws.com/teamData/n5erxmp43dl0x6hv.json',
    conference: 'HBCU Conference'
  },
  {
    name: 'Tougaloo (Miss.)',
    url: 'https://prestosports-downloads.s3.us-west-2.amazonaws.com/teamData/drm4juhtarj0izu1.json',
    conference: 'HBCU Conference'
  },
  {
    name: 'Virgin Islands',
    url: 'https://prestosports-downloads.s3.us-west-2.amazonaws.com/teamData/l27esj3qr0bk4ubi.json',
    conference: 'HBCU Conference'
  },
  {
    name: 'Voorhees University',
    url: 'https://prestosports-downloads.s3.us-west-2.amazonaws.com/teamData/cwrxeq27huwzfszq.json',
    conference: 'HBCU Conference'
  },
  {
    name: 'Wilberforce (OH)',
    url: 'https://prestosports-downloads.s3.us-west-2.amazonaws.com/teamData/9ld973gf09omf9t1.json',
    conference: 'HBCU Conference'
  },
  {
    name: 'Wiley (TX)',
    url: 'https://prestosports-downloads.s3.us-west-2.amazonaws.com/teamData/jh35pqal6k6otb99.json',
    conference: 'HBCU Conference'
  },
  {
    name: 'Baker',
    url: 'https://prestosports-downloads.s3.us-west-2.amazonaws.com/teamData/86udc6ihicug9t64.json',
    conference: 'Heart of America'
  },
  {
    name: 'Benedictine (KS)',
    url: 'https://prestosports-downloads.s3.us-west-2.amazonaws.com/teamData/2vzn87w7x0gh5m57.json',
    conference: 'Heart of America'
  },
  {
    name: 'Central Methodist',
    url: 'https://prestosports-downloads.s3.us-west-2.amazonaws.com/teamData/gny99ovz9bxwbg5p.json',
    conference: 'Heart of America'
  },
  {
    name: 'Clarke (IA)',
    url: 'https://prestosports-downloads.s3.us-west-2.amazonaws.com/teamData/n46ikh8f3vu7pqsm.json',
    conference: 'Heart of America'
  },
  {
    name: 'Culver-Stockton (MO)',
    url: 'https://prestosports-downloads.s3.us-west-2.amazonaws.com/teamData/4h2r4o27662j015p.json',
    conference: 'Heart of America'
  },
  {
    name: 'Graceland',
    url: 'https://prestosports-downloads.s3.us-west-2.amazonaws.com/teamData/rk1cjgvppl9vm0nc.json',
    conference: 'Heart of America'
  },
  {
    name: 'Grand View',
    url: 'https://prestosports-downloads.s3.us-west-2.amazonaws.com/teamData/15gk6jxb2483ztar.json',
    conference: 'Heart of America'
  },
  {
    name: 'MidAmerica Nazarene',
    url: 'https://prestosports-downloads.s3.us-west-2.amazonaws.com/teamData/6zp4nh1itan6nlip.json',
    conference: 'Heart of America'
  },
  {
    name: 'Missouri Valley',
    url: 'https://prestosports-downloads.s3.us-west-2.amazonaws.com/teamData/946epzc062qomwzx.json',
    conference: 'Heart of America'
  },
  {
    name: 'Mount Mercy',
    url: 'https://prestosports-downloads.s3.us-west-2.amazonaws.com/teamData/27zextkn4p0l9plq.json',
    conference: 'Heart of America'
  },
  {
    name: 'Park',
    url: 'https://prestosports-downloads.s3.us-west-2.amazonaws.com/teamData/mgm2p4zto7ez5s7c.json',
    conference: 'Heart of America'
  },
  {
    name: 'Peru State',
    url: 'https://prestosports-downloads.s3.us-west-2.amazonaws.com/teamData/u0hvke3o7s8gn330.json',
    conference: 'Heart of America'
  },
  {
    name: 'William Penn (Iowa)',
    url: 'https://prestosports-downloads.s3.us-west-2.amazonaws.com/teamData/eqlll0ca098wtwro.json',
    conference: 'Heart of America'
  },
  {
    name: 'Avila (MO)',
    url: 'https://prestosports-downloads.s3.us-west-2.amazonaws.com/teamData/77pahz22a55fb7iz.json',
    conference: 'KCAC'
  },
  {
    name: 'Bethany (KS)',
    url: 'https://prestosports-downloads.s3.us-west-2.amazonaws.com/teamData/9wp9akhcel6n3xob.json',
    conference: 'KCAC'
  },
  {
    name: 'Bethel (KS)',
    url: 'https://prestosports-downloads.s3.us-west-2.amazonaws.com/teamData/5j1vmdwu6ryl9w1r.json',
    conference: 'KCAC'
  },
  {
    name: 'Evangel (Mo.)',
    url: 'https://prestosports-downloads.s3.us-west-2.amazonaws.com/teamData/2zx6andzrjx0bl98.json',
    conference: 'KCAC'
  },
  {
    name: 'Friends (KS)',
    url: 'https://prestosports-downloads.s3.us-west-2.amazonaws.com/teamData/9uwdoh0jumd499n5.json',
    conference: 'KCAC'
  },
  {
    name: 'Kansas Wesleyan',
    url: 'https://prestosports-downloads.s3.us-west-2.amazonaws.com/teamData/nrgbwbnrcb32pkld.json',
    conference: 'KCAC'
  },
  {
    name: 'McPherson (Kan.)',
    url: 'https://prestosports-downloads.s3.us-west-2.amazonaws.com/teamData/kec6v28qf4ge5nr3.json',
    conference: 'KCAC'
  },
  {
    name: 'Oklahoma Wesleyan',
    url: 'https://prestosports-downloads.s3.us-west-2.amazonaws.com/teamData/3m2azdylvz5ddhwc.json',
    conference: 'KCAC'
  },
  {
    name: 'Ottawa (Kan.)',
    url: 'https://prestosports-downloads.s3.us-west-2.amazonaws.com/teamData/mupxv4lrre2wq6j6.json',
    conference: 'KCAC'
  },
  {
    name: 'Saint Mary',
    url: 'https://prestosports-downloads.s3.us-west-2.amazonaws.com/teamData/04fstwpgkydva9hh.json',
    conference: 'KCAC'
  },
  {
    name: 'Southwestern',
    url: 'https://prestosports-downloads.s3.us-west-2.amazonaws.com/teamData/8qgypugl6whi46yc.json',
    conference: 'KCAC'
  },
  {
    name: 'Sterling',
    url: 'https://prestosports-downloads.s3.us-west-2.amazonaws.com/teamData/crju8qcf9axchxqx.json',
    conference: 'KCAC'
  },
  {
    name: 'Tabor',
    url: 'https://prestosports-downloads.s3.us-west-2.amazonaws.com/teamData/m4pfcwkuteml56oi.json',
    conference: 'KCAC'
  },
  {
    name: 'York (NE)',
    url: 'https://prestosports-downloads.s3.us-west-2.amazonaws.com/teamData/1vk6i1tmkthskled.json',
    conference: 'KCAC'
  },
  {
    name: 'Bethel (TN)',
    url: 'https://prestosports-downloads.s3.us-west-2.amazonaws.com/teamData/w4xpgv2p20j73anp.json',
    conference: 'Mid-South'
  },
  {
    name: 'Campbellsville (KY)',
    url: 'https://prestosports-downloads.s3.us-west-2.amazonaws.com/teamData/7ajohq2wzzx0fo38.json',
    conference: 'Mid-South'
  },
  {
    name: 'Cumberland (Tenn.)',
    url: 'https://prestosports-downloads.s3.us-west-2.amazonaws.com/teamData/0y16tghlv316zxpa.json',
    conference: 'Mid-South'
  },
  {
    name: 'Cumberlands (Ky.)',
    url: 'https://prestosports-downloads.s3.us-west-2.amazonaws.com/teamData/6isgm55a7e2p1vhn.json',
    conference: 'Mid-South'
  },
  {
    name: 'Freed-Hardeman (Tenn.)',
    url: 'https://prestosports-downloads.s3.us-west-2.amazonaws.com/teamData/7co99ulb35bj39fs.json',
    conference: 'Mid-South'
  },
  {
    name: 'Georgetown (Ky.)',
    url: 'https://prestosports-downloads.s3.us-west-2.amazonaws.com/teamData/4t7vtejnch1ng66s.json',
    conference: 'Mid-South'
  },
  {
    name: 'Lindsey Wilson (Ky.)',
    url: 'https://prestosports-downloads.s3.us-west-2.amazonaws.com/teamData/7y5sm6ke5hznvt78.json',
    conference: 'Mid-South'
  },
  {
    name: 'Huston-Tillotson',
    url: 'https://prestosports-downloads.s3.us-west-2.amazonaws.com/teamData/sqciuzje71zh68qi.json',
    conference: 'Red River'
  },
  {
    name: 'Jarvis Christian',
    url: 'https://prestosports-downloads.s3.us-west-2.amazonaws.com/teamData/a8px6k3ku0d3k574.json',
    conference: 'Red River'
  },
  {
    name: 'LSU Alexandria (La.)',
    url: 'https://prestosports-downloads.s3.us-west-2.amazonaws.com/teamData/498wi1zgu35zxgor.json',
    conference: 'Red River'
  },
  {
    name: 'LSU Shreveport (La.)',
    url: 'https://prestosports-downloads.s3.us-west-2.amazonaws.com/teamData/ttyegodu299lynvk.json',
    conference: 'Red River'
  },
  {
    name: 'Louisiana Christian',
    url: 'https://prestosports-downloads.s3.us-west-2.amazonaws.com/teamData/6jaq63iux98iblui.json',
    conference: 'Red River'
  },
  {
    name: 'North American',
    url: 'https://prestosports-downloads.s3.us-west-2.amazonaws.com/teamData/ehr44qlu82i72vge.json',
    conference: 'Red River'
  },
  {
    name: 'Our Lady of the Lake',
    url: 'https://prestosports-downloads.s3.us-west-2.amazonaws.com/teamData/gqkksxexk0ih89sk.json',
    conference: 'Red River'
  },
  {
    name: 'Paul Quinn',
    url: 'https://prestosports-downloads.s3.us-west-2.amazonaws.com/teamData/097z3ekdya52gahc.json',
    conference: 'Red River'
  },
  {
    name: 'Southwest',
    url: 'https://prestosports-downloads.s3.us-west-2.amazonaws.com/teamData/9ddewhlbfm8os33z.json',
    conference: 'Red River'
  },
  {
    name: 'Texas A&M  Texarkana',
    url: 'https://prestosports-downloads.s3.us-west-2.amazonaws.com/teamData/q8rf0g7v60spl2sb.json',
    conference: 'Red River'
  },
  {
    name: 'Texas A&amp;M-San Antonio',
    url: 'https://prestosports-downloads.s3.us-west-2.amazonaws.com/teamData/rn82xhwfjwh2ay2e.json',
    conference: 'Red River'
  },
  {
    name: 'Texas College',
    url: 'https://prestosports-downloads.s3.us-west-2.amazonaws.com/teamData/h72nz3kqr8evnc7o.json',
    conference: 'Red River'
  },
  {
    name: 'Xavier (La.)',
    url: 'https://prestosports-downloads.s3.us-west-2.amazonaws.com/teamData/86x30luq4uin8kws.json',
    conference: 'Red River'
  },
  {
    name: 'Alice Lloyd (KY)',
    url: 'https://prestosports-downloads.s3.us-west-2.amazonaws.com/teamData/meux0xvjgllf3ulu.json',
    conference: 'River States'
  },
  {
    name: 'Brescia (KY)',
    url: 'https://prestosports-downloads.s3.us-west-2.amazonaws.com/teamData/qt565r9l10c6zlm3.json',
    conference: 'River States'
  },
  {
    name: 'IU Columbus',
    url: 'https://prestosports-downloads.s3.us-west-2.amazonaws.com/teamData/w40o05pu5v1y2wyq.json',
    conference: 'River States'
  },
  {
    name: 'IU Kokomo',
    url: 'https://prestosports-downloads.s3.us-west-2.amazonaws.com/teamData/8xi3fzdc0a7jr9zz.json',
    conference: 'River States'
  },
  {
    name: 'Indiana East',
    url: 'https://prestosports-downloads.s3.us-west-2.amazonaws.com/teamData/re6naewrkfsg9x0s.json',
    conference: 'River States'
  },
  {
    name: 'Indiana Southeast',
    url: 'https://prestosports-downloads.s3.us-west-2.amazonaws.com/teamData/knsmo6jejdglxjic.json',
    conference: 'River States'
  },
  {
    name: 'Midway',
    url: 'https://prestosports-downloads.s3.us-west-2.amazonaws.com/teamData/bxtckz5gdlcueg0c.json',
    conference: 'River States'
  },
  {
    name: 'Oakland City (IN)',
    url: 'https://prestosports-downloads.s3.us-west-2.amazonaws.com/teamData/ivzfdm7v1ufoiu0t.json',
    conference: 'River States'
  },
  {
    name: 'Rio Grande',
    url: 'https://prestosports-downloads.s3.us-west-2.amazonaws.com/teamData/ihjm5q90si5edtqn.json',
    conference: 'River States'
  },
  {
    name: 'Shawnee State',
    url: 'https://prestosports-downloads.s3.us-west-2.amazonaws.com/teamData/4si4opyzcvdus30u.json',
    conference: 'River States'
  },
  {
    name: 'St. Mary-Woods',
    url: 'https://prestosports-downloads.s3.us-west-2.amazonaws.com/teamData/lh6jqj75gk06y3q4.json',
    conference: 'River States'
  },
  {
    name: 'WVU Tech (WV)',
    url: 'https://prestosports-downloads.s3.us-west-2.amazonaws.com/teamData/4kq7pa5e77mg9aa3.json',
    conference: 'River States'
  },
  {
    name: 'Central Christian (KS)',
    url: 'https://prestosports-downloads.s3.us-west-2.amazonaws.com/teamData/i69bv4vkilokj03p.json',
    conference: 'Sooner'
  },
  {
    name: 'College of the Ozarks',
    url: 'https://prestosports-downloads.s3.us-west-2.amazonaws.com/teamData/ee2601shte8ivytd.json',
    conference: 'Sooner'
  },
  {
    name: 'John Brown',
    url: 'https://prestosports-downloads.s3.us-west-2.amazonaws.com/teamData/bfdj01xu0x3zgc0e.json',
    conference: 'Sooner'
  },
  {
    name: 'Langston (Okla.)',
    url: 'https://prestosports-downloads.s3.us-west-2.amazonaws.com/teamData/gy1sh1z3z6k3encx.json',
    conference: 'Sooner'
  },
  {
    name: 'Mid-America Christian',
    url: 'https://prestosports-downloads.s3.us-west-2.amazonaws.com/teamData/1x8mb12ftayd4gq5.json',
    conference: 'Sooner'
  },
  {
    name: 'Nelson (Texas)',
    url: 'https://prestosports-downloads.s3.us-west-2.amazonaws.com/teamData/azz4fy18qlgwrjxd.json',
    conference: 'Sooner'
  },
  {
    name: 'Oklahoma City',
    url: 'https://prestosports-downloads.s3.us-west-2.amazonaws.com/teamData/gycxqaqj4pnibh9n.json',
    conference: 'Sooner'
  },
  {
    name: 'Oklahoma Panhandle State',
    url: 'https://prestosports-downloads.s3.us-west-2.amazonaws.com/teamData/o5d2zfsy7140bdwg.json',
    conference: 'Sooner'
  },
  {
    name: 'Science and Arts',
    url: 'https://prestosports-downloads.s3.us-west-2.amazonaws.com/teamData/fzpyib5es80g7qpu.json',
    conference: 'Sooner'
  },
  {
    name: 'Southwestern Christian',
    url: 'https://prestosports-downloads.s3.us-west-2.amazonaws.com/teamData/f6cibdi4nc11kbdl.json',
    conference: 'Sooner'
  },
  {
    name: 'Texas Wesleyan',
    url: 'https://prestosports-downloads.s3.us-west-2.amazonaws.com/teamData/11qvvx356zlyhm4y.json',
    conference: 'Sooner'
  },
  {
    name: 'UNT Dallas',
    url: 'https://prestosports-downloads.s3.us-west-2.amazonaws.com/teamData/k3l7u4byik8cftdc.json',
    conference: 'Sooner'
  },
  {
    name: 'Wayland Baptist (TX)',
    url: 'https://prestosports-downloads.s3.us-west-2.amazonaws.com/teamData/3q3e0x35tpz7n19f.json',
    conference: 'Sooner'
  },
  {
    name: 'Abraham Baldwin Agricultural',
    url: 'https://prestosports-downloads.s3.us-west-2.amazonaws.com/teamData/8js9egh55rbkpx41.json',
    conference: 'Southern States'
  },
  {
    name: 'Blue Mountain Christian (MS)',
    url: 'https://prestosports-downloads.s3.us-west-2.amazonaws.com/teamData/7r8aykeyp0p5su33.json',
    conference: 'Southern States'
  },
  {
    name: 'Brewton-Parker (GA)',
    url: 'https://prestosports-downloads.s3.us-west-2.amazonaws.com/teamData/fgxn3r4dcjtwtwtx.json',
    conference: 'Southern States'
  },
  {
    name: 'Dalton State (GA)',
    url: 'https://prestosports-downloads.s3.us-west-2.amazonaws.com/teamData/0ehklcy1f8k17kxb.json',
    conference: 'Southern States'
  },
  {
    name: 'Faulkner (AL)',
    url: 'https://prestosports-downloads.s3.us-west-2.amazonaws.com/teamData/ed3cu5gub1cn0hap.json',
    conference: 'Southern States'
  },
  {
    name: 'Life',
    url: 'https://prestosports-downloads.s3.us-west-2.amazonaws.com/teamData/7wyuj1r2ip01w5tn.json',
    conference: 'Southern States'
  },
  {
    name: 'Loyola (La.)',
    url: 'https://prestosports-downloads.s3.us-west-2.amazonaws.com/teamData/57otsjzr24v1qof1.json',
    conference: 'Southern States'
  },
  {
    name: 'Middle Georgia State',
    url: 'https://prestosports-downloads.s3.us-west-2.amazonaws.com/teamData/afdi53n6w71qg6ux.json',
    conference: 'Southern States'
  },
  {
    name: 'Mobile (Ala.)',
    url: 'https://prestosports-downloads.s3.us-west-2.amazonaws.com/teamData/2mhyk59kw2gjz1d1.json',
    conference: 'Southern States'
  },
  {
    name: 'Point',
    url: 'https://prestosports-downloads.s3.us-west-2.amazonaws.com/teamData/60pt7r2bncgvlbml.json',
    conference: 'Southern States'
  },
  {
    name: 'Tennessee Southern',
    url: 'https://prestosports-downloads.s3.us-west-2.amazonaws.com/teamData/4f3h7lkyfdf99lwa.json',
    conference: 'Southern States'
  },
  {
    name: 'Thomas',
    url: 'https://prestosports-downloads.s3.us-west-2.amazonaws.com/teamData/48yefe67g2hs7llr.json',
    conference: 'Southern States'
  },
  {
    name: 'William Carey (Miss.)',
    url: 'https://prestosports-downloads.s3.us-west-2.amazonaws.com/teamData/kc6d8a9vuwfatri5.json',
    conference: 'Southern States'
  },
  {
    name: 'Ave Maria',
    url: 'https://prestosports-downloads.s3.us-west-2.amazonaws.com/teamData/0egrbpr413ufmxfj.json',
    conference: 'The Sun'
  },
  {
    name: 'Coastal Georgia',
    url: 'https://prestosports-downloads.s3.us-west-2.amazonaws.com/teamData/c7jcvkr5l7k3kpy0.json',
    conference: 'The Sun'
  },
  {
    name: 'Florida Memorial',
    url: 'https://prestosports-downloads.s3.us-west-2.amazonaws.com/teamData/9sd3lcooaulgxh02.json',
    conference: 'The Sun'
  },
  {
    name: 'Keiser (Fla.)',
    url: 'https://prestosports-downloads.s3.us-west-2.amazonaws.com/teamData/57fjythj0zxj0ees.json',
    conference: 'The Sun'
  },
  {
    name: 'New College of Florida',
    url: 'https://prestosports-downloads.s3.us-west-2.amazonaws.com/teamData/r7dgz3m0wq3zzhd3.json',
    conference: 'The Sun'
  },
  {
    name: 'Southeastern (Fla.)',
    url: 'https://prestosports-downloads.s3.us-west-2.amazonaws.com/teamData/03cmj9ddu907xavg.json',
    conference: 'The Sun'
  },
  {
    name: 'St. Thomas (Fla.)',
    url: 'https://prestosports-downloads.s3.us-west-2.amazonaws.com/teamData/814ltk1j4cfmiiie.json',
    conference: 'The Sun'
  },
  {
    name: 'Warner (FL)',
    url: 'https://prestosports-downloads.s3.us-west-2.amazonaws.com/teamData/51ghr3t4cvk5i50i.json',
    conference: 'The Sun'
  },
  {
    name: 'Webber International (FL)',
    url: 'https://prestosports-downloads.s3.us-west-2.amazonaws.com/teamData/atb4atpqsk1c4sqe.json',
    conference: 'The Sun'
  },
  {
    name: 'Aquinas (Mich.)',
    url: 'https://prestosports-downloads.s3.us-west-2.amazonaws.com/teamData/5xj42z2at2qmt9rh.json',
    conference: 'Wolverine-Hoosier'
  },
  {
    name: 'Cleary (MI)',
    url: 'https://prestosports-downloads.s3.us-west-2.amazonaws.com/teamData/ufo6yuschlmsyurr.json',
    conference: 'Wolverine-Hoosier'
  },
  {
    name: 'Concordia (MI)',
    url: 'https://prestosports-downloads.s3.us-west-2.amazonaws.com/teamData/443zmujiwgsxtc0k.json',
    conference: 'Wolverine-Hoosier'
  },
  {
    name: 'Cornerstone',
    url: 'https://prestosports-downloads.s3.us-west-2.amazonaws.com/teamData/7pcshtfq5ufcs9n3.json',
    conference: 'Wolverine-Hoosier'
  },
  {
    name: 'Defiance College (OH)',
    url: 'https://prestosports-downloads.s3.us-west-2.amazonaws.com/teamData/s54o1ugd6573t3ul.json',
    conference: 'Wolverine-Hoosier'
  },
  {
    name: 'Indiana Tech',
    url: 'https://prestosports-downloads.s3.us-west-2.amazonaws.com/teamData/1nkf44hp75i0qbox.json',
    conference: 'Wolverine-Hoosier'
  },
  {
    name: 'Lawrence Tech',
    url: 'https://prestosports-downloads.s3.us-west-2.amazonaws.com/teamData/g8ix71n4rx9dadz8.json',
    conference: 'Wolverine-Hoosier'
  },
  {
    name: 'Lourdes',
    url: 'https://prestosports-downloads.s3.us-west-2.amazonaws.com/teamData/0pg2rwjdy0hbwyab.json',
    conference: 'Wolverine-Hoosier'
  },
  {
    name: 'Madonna (Mich.)',
    url: 'https://prestosports-downloads.s3.us-west-2.amazonaws.com/teamData/1sevhopsx6zkcyk1.json',
    conference: 'Wolverine-Hoosier'
  },
  {
    name: 'Michigan-Dearborn',
    url: 'https://prestosports-downloads.s3.us-west-2.amazonaws.com/teamData/901jy7vyjnd82aro.json',
    conference: 'Wolverine-Hoosier'
  },
  {
    name: 'Northwestern Ohio',
    url: 'https://prestosports-downloads.s3.us-west-2.amazonaws.com/teamData/dzt1dg0v1kospbrs.json',
    conference: 'Wolverine-Hoosier'
  },
  {
    name: 'Rochester Christian (Mich.)',
    url: 'https://prestosports-downloads.s3.us-west-2.amazonaws.com/teamData/qza3o4bqiza1t3c3.json',
    conference: 'Wolverine-Hoosier'
  },
  {
    name: 'Siena Heights',
    url: 'https://prestosports-downloads.s3.us-west-2.amazonaws.com/teamData/b41se9oi45qupytp.json',
    conference: 'Wolverine-Hoosier'
  },

];

// Teams organized by season
export const TEAMS_BY_SEASON = {
  '2025-26': TEAMS_2025_26,
  '2024-25': TEAMS_2024_25
};

export { TEAMS_2025_26, TEAMS_2024_25 };

// Also export TEAMS as alias for current season for backward compatibility
export const TEAMS = TEAMS_2024_25;
