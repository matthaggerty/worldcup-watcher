import { useState, useEffect, useMemo } from "react";

const mkMatch = (etH, etM, home, away, group, venue, broadcast, favorite, confidence) => ({
  etH, etM, home, away, group, venue, broadcast, favorite, confidence
});

const TZ_OFFSETS = { ET: 0, CT: -1, MT: -2, PT: -3 };

function convertTime(etH, etM, tz) {
  const offset = TZ_OFFSETS[tz];
  let h = etH + offset;
  h = ((h % 24) + 24) % 24;
  const period = h >= 12 ? "PM" : "AM";
  const h12 = h % 12 === 0 ? 12 : h % 12;
  const mm = etM === 0 ? "" : `:${String(etM).padStart(2,"0")}`;
  return `${h12}${mm} ${period} ${tz}`;
}

const schedule = {
  "GROUP STAGE": {
    "Thu Jun 11": [
      mkMatch(15,0,"🇲🇽 Mexico","🇿🇦 S. Africa","A","Mexico City",["FOX","TUBI"],"home","strong"),
      mkMatch(22,0,"🇰🇷 S. Korea","🇨🇿 Czechia","A","Guadalajara",["FS1"],"even","slight"),
    ],
    "Fri Jun 12": [
      mkMatch(15,0,"🇨🇦 Canada","🇧🇦 Bosnia","B","Toronto",["FOX"],"home","slight"),
      mkMatch(21,0,"🇺🇸 USA","🇵🇾 Paraguay","D","Los Angeles",["FOX","TUBI"],"home","slight"),
    ],
    "Sat Jun 13": [
      mkMatch(15,0,"🇶🇦 Qatar","🇨🇭 Switzerland","B","San Francisco",["FOX"],"away","strong"),
      mkMatch(18,0,"🇧🇷 Brazil","🇲🇦 Morocco","C","New York/NJ",["FS1"],"home","strong"),
      mkMatch(21,0,"🇭🇹 Haiti","🏴󠁧󠁢󠁳󠁣󠁴󠁿 Scotland","C","Boston",["FS1"],"away","strong"),
      mkMatch(12,0,"🇦🇺 Australia","🇹🇷 Türkiye","D","Vancouver",["FS1"],"even","slight"),
    ],
    "Sun Jun 14": [
      mkMatch(13,0,"🇩🇪 Germany","🇨🇼 Curaçao","E","Houston",["FOX"],"home","strong"),
      mkMatch(16,0,"🇳🇱 Netherlands","🇯🇵 Japan","F","Dallas",["FOX"],"home","strong"),
      mkMatch(19,0,"🇨🇮 Ivory Coast","🇪🇨 Ecuador","E","Philadelphia",["FS1"],"even","slight"),
      mkMatch(22,0,"🇸🇪 Sweden","🇹🇳 Tunisia","F","Monterrey",["FS1"],"home","slight"),
    ],
    "Mon Jun 15": [
      mkMatch(12,0,"🇪🇸 Spain","🇨🇻 Cape Verde","H","Atlanta",["FOX"],"home","strong"),
      mkMatch(15,0,"🇧🇪 Belgium","🇪🇬 Egypt","G","Vancouver",["FOX"],"home","strong"),
      mkMatch(18,0,"🇸🇦 Saudi Arabia","🇺🇾 Uruguay","H","Miami",["FS1"],"away","strong"),
      mkMatch(21,0,"🇮🇷 Iran","🇳🇿 New Zealand","G","Los Angeles",["FS1"],"home","slight"),
    ],
    "Tue Jun 16": [
      mkMatch(15,0,"🇫🇷 France","🇸🇳 Senegal","I","New York/NJ",["FOX"],"home","strong"),
      mkMatch(18,0,"🇮🇶 Iraq","🇳🇴 Norway","I","Boston",["FOX"],"away","strong"),
      mkMatch(21,0,"🇦🇷 Argentina","🇩🇿 Algeria","J","Kansas City",["FOX"],"home","strong"),
      mkMatch(24,0,"🇦🇹 Austria","🇯🇴 Jordan","J","San Francisco",["FS1"],"home","strong"),
    ],
    "Wed Jun 17": [
      mkMatch(13,0,"🇵🇹 Portugal","🇨🇩 DR Congo","K","Houston",["FOX"],"home","strong"),
      mkMatch(16,0,"🏴󠁧󠁢󠁥󠁮󠁧󠁿 England","🇭🇷 Croatia","L","Dallas",["FOX"],"home","slight"),
      mkMatch(19,0,"🇬🇭 Ghana","🇵🇦 Panama","L","Toronto",["FS1"],"home","slight"),
      mkMatch(22,0,"🇺🇿 Uzbekistan","🇨🇴 Colombia","K","Mexico City",["FS1"],"away","strong"),
    ],
    "Thu Jun 18": [
      mkMatch(12,0,"🇨🇿 Czechia","🇿🇦 S. Africa","A","Atlanta",["FOX"],"home","slight"),
      mkMatch(15,0,"🇨🇭 Switzerland","🇧🇦 Bosnia","B","Los Angeles",["FOX"],"home","strong"),
      mkMatch(18,0,"🇨🇦 Canada","🇶🇦 Qatar","B","Vancouver",["FOX"],"home","strong"),
      mkMatch(21,0,"🇲🇽 Mexico","🇰🇷 S. Korea","A","Guadalajara",["FOX"],"home","slight"),
    ],
    "Fri Jun 19": [
      mkMatch(15,0,"🇺🇸 USA","🇦🇺 Australia","D","Seattle",["FOX"],"home","slight"),
      mkMatch(18,0,"🏴󠁧󠁢󠁳󠁣󠁴󠁿 Scotland","🇲🇦 Morocco","C","Boston",["FOX"],"even","slight"),
      mkMatch(20,30,"🇧🇷 Brazil","🇭🇹 Haiti","C","Philadelphia",["FOX"],"home","strong"),
      mkMatch(23,0,"🇵🇾 Paraguay","🇹🇷 Türkiye","D","San Francisco",["FS1"],"away","slight"),
    ],
    "Sat Jun 20": [
      mkMatch(13,0,"🇳🇱 Netherlands","🇸🇪 Sweden","F","Houston",["FOX"],"home","slight"),
      mkMatch(16,0,"🇩🇪 Germany","🇨🇮 Ivory Coast","E","Toronto",["FOX"],"home","strong"),
      mkMatch(23,0,"🇪🇨 Ecuador","🇨🇼 Curaçao","E","Kansas City",["FS1"],"home","strong"),
      mkMatch(24,0,"🇹🇳 Tunisia","🇯🇵 Japan","F","Monterrey",["FS1"],"away","slight"),
    ],
    "Sun Jun 21": [
      mkMatch(12,0,"🇪🇸 Spain","🇸🇦 Saudi Arabia","H","Atlanta",["FOX"],"home","strong"),
      mkMatch(15,0,"🇧🇪 Belgium","🇮🇷 Iran","G","Los Angeles",["FOX"],"home","strong"),
      mkMatch(18,0,"🇺🇾 Uruguay","🇨🇻 Cape Verde","H","Miami",["FOX"],"home","strong"),
      mkMatch(21,0,"🇳🇿 New Zealand","🇪🇬 Egypt","G","Vancouver",["FS1"],"away","slight"),
    ],
    "Mon Jun 22": [
      mkMatch(13,0,"🇦🇷 Argentina","🇦🇹 Austria","J","Dallas",["FOX"],"even","slight"),
      mkMatch(17,0,"🇫🇷 France","🇮🇶 Iraq","I","Philadelphia",["FOX"],"home","strong"),
      mkMatch(20,0,"🇳🇴 Norway","🇸🇳 Senegal","I","New York/NJ",["FOX"],"even","slight"),
      mkMatch(23,0,"🇯🇴 Jordan","🇩🇿 Algeria","J","San Francisco",["FS1"],"even","slight"),
    ],
    "Tue Jun 23": [
      mkMatch(13,0,"🇵🇹 Portugal","🇺🇿 Uzbekistan","K","Houston",["FOX"],"even","slight"),
      mkMatch(16,0,"🏴󠁧󠁢󠁥󠁮󠁧󠁿 England","🇬🇭 Ghana","L","Boston",["FS1"],"even","slight"),
      mkMatch(19,0,"🇵🇦 Panama","🇭🇷 Croatia","L","Toronto",["FOX"],"even","slight"),
      mkMatch(22,0,"🇨🇴 Colombia","🇨🇩 DR Congo","K","Guadalajara",["FS1"],"even","slight"),
    ],
    "Wed Jun 24": [
      mkMatch(15,0,"🇨🇭 Switzerland","🇨🇦 Canada","B","Vancouver",["FOX"],"even","slight"),
      mkMatch(15,0,"🇧🇦 Bosnia","🇶🇦 Qatar","B","Seattle",["FOX"],"home","strong"),
      mkMatch(18,0,"🏴󠁧󠁢󠁳󠁣󠁴󠁿 Scotland","🇧🇷 Brazil","C","Miami",["FOX"],"away","strong"),
      mkMatch(18,0,"🇲🇦 Morocco","🇭🇹 Haiti","C","Atlanta",["FS1"],"home","strong"),
      mkMatch(21,0,"🇨🇿 Czechia","🇲🇽 Mexico","A","Mexico City",["FOX"],"away","slight"),
      mkMatch(21,0,"🇿🇦 S. Africa","🇰🇷 S. Korea","A","Monterrey",["FS1"],"away","slight"),
    ],
    "Thu Jun 25": [
      mkMatch(16,0,"🇪🇨 Ecuador","🇩🇪 Germany","E","New York/NJ",["FOX"],"away","strong"),
      mkMatch(16,0,"🇨🇼 Curaçao","🇨🇮 Ivory Coast","E","Philadelphia",["FOX"],"away","strong"),
      mkMatch(19,0,"🇯🇵 Japan","🇸🇪 Sweden","F","Dallas",["FS1"],"even","slight"),
      mkMatch(19,0,"🇹🇳 Tunisia","🇳🇱 Netherlands","F","Kansas City",["FS1"],"away","strong"),
      mkMatch(22,0,"🇹🇷 Türkiye","🇺🇸 USA","D","Los Angeles",["FOX"],"away","slight"),
      mkMatch(22,0,"🇵🇾 Paraguay","🇦🇺 Australia","D","San Francisco",["FS1"],"even","slight"),
    ],
    "Fri Jun 26": [
      mkMatch(15,0,"🇳🇴 Norway","🇫🇷 France","I","Boston",["FOX"],"even","slight"),
      mkMatch(15,0,"🇸🇳 Senegal","🇮🇶 Iraq","I","Toronto",["FS1"],"even","slight"),
      mkMatch(20,0,"🇨🇻 Cape Verde","🇸🇦 Saudi Arabia","H","Houston",["FOX"],"even","slight"),
      mkMatch(20,0,"🇺🇾 Uruguay","🇪🇸 Spain","H","Guadalajara",["FS1"],"even","slight"),
      mkMatch(23,0,"🇪🇬 Egypt","🇮🇷 Iran","G","Seattle",["FS1"],"home","slight"),
      mkMatch(23,0,"🇳🇿 New Zealand","🇧🇪 Belgium","G","Vancouver",["FOX"],"away","strong"),
    ],
    "Sat Jun 27": [
      mkMatch(17,0,"🇵🇦 Panama","🏴󠁧󠁢󠁥󠁮󠁧󠁿 England","L","New York/NJ",["FOX"],"away","strong"),
      mkMatch(17,0,"🇭🇷 Croatia","🇬🇭 Ghana","L","Philadelphia",["FS1"],"home","slight"),
      mkMatch(19,30,"🇨🇴 Colombia","🇵🇹 Portugal","K","Miami",["FOX"],"away","slight"),
      mkMatch(19,30,"🇨🇩 DR Congo","🇺🇿 Uzbekistan","K","Atlanta",["FOX"],"home","slight"),
      mkMatch(22,0,"🇩🇿 Algeria","🇦🇹 Austria","J","Kansas City",["FS1"],"away","slight"),
      mkMatch(22,0,"🇯🇴 Jordan","🇦🇷 Argentina","J","Dallas",["FOX"],"away","strong"),
    ],
  },
  "KNOCKOUT STAGE": {
    "Round of 32 (Jun 28–Jul 3)": [mkMatch(15,0,"TBD","TBD","R32","Various",["FOX","FS1"],null,null)],
    "Round of 16 (Jul 4–7)":      [mkMatch(15,0,"TBD","TBD","R16","Various",["FOX","FS1"],null,null)],
    "Quarterfinals (Jul 9–11)": [
      mkMatch(15,0,"TBD","TBD","QF","Boston",["FOX"],null,null),
      mkMatch(15,0,"TBD","TBD","QF","Los Angeles",["FOX"],null,null),
      mkMatch(15,0,"TBD","TBD","QF","Miami",["FOX"],null,null),
      mkMatch(15,0,"TBD","TBD","QF","Kansas City",["FOX"],null,null),
    ],
    "Semifinals (Jul 14–15)": [
      mkMatch(15,0,"TBD","TBD","SF","Dallas",["FOX"],null,null),
      mkMatch(15,0,"TBD","TBD","SF","Atlanta",["FOX"],null,null),
    ],
    "3rd Place (Jul 18)": [mkMatch(15,0,"TBD","TBD","3P","Miami",["FOX"],null,null)],
    "🏆 Final (Jul 19)":  [mkMatch(15,0,"TBD","TBD","FIN","New York/NJ",["FOX"],null,null)],
  },
};

const groupColors = {
  A:"#e74c3c",B:"#e67e22",C:"#f1c40f",D:"#2ecc71",
  E:"#1abc9c",F:"#3498db",G:"#9b59b6",H:"#e91e63",
  I:"#ff5722",J:"#795548",K:"#607d8b",L:"#00bcd4",
  R32:"#546e7a",R16:"#546e7a",QF:"#546e7a",SF:"#546e7a","3P":"#546e7a",FIN:"#c0392b",
};

const broadcastStyle = {
  FOX:  { bg:"#003366", color:"#fff", label:"FOX"  },
  FS1:  { bg:"#cc0000", color:"#fff", label:"FS1"  },
  TUBI: { bg:"#00e364", color:"#000", label:"TUBI" },
};

// Maps our country names to ESPN's 3-letter team abbreviations
const COUNTRY_CODES = {
  "Mexico":"MEX","S. Korea":"KOR","S. Africa":"RSA","Czechia":"CZE",
  "Canada":"CAN","Bosnia":"BIH","Qatar":"QAT","Switzerland":"SUI",
  "Brazil":"BRA","Morocco":"MAR","Scotland":"SCO","Haiti":"HAI",
  "USA":"USA","Australia":"AUS","Paraguay":"PAR","Türkiye":"TUR",
  "Germany":"GER","Curaçao":"CUW","Ivory Coast":"CIV","Ecuador":"ECU",
  "Netherlands":"NED","Japan":"JPN","Tunisia":"TUN","Sweden":"SWE",
  "Belgium":"BEL","Egypt":"EGY","Iran":"IRN","New Zealand":"NZL",
  "Spain":"ESP","Cape Verde":"CPV","Saudi Arabia":"KSA","Uruguay":"URU",
  "France":"FRA","Senegal":"SEN","Norway":"NOR","Iraq":"IRQ",
  "Argentina":"ARG","Austria":"AUT","Jordan":"JOR","Algeria":"ALG",
  "Portugal":"POR","DR Congo":"COD","Uzbekistan":"UZB","Colombia":"COL",
  "England":"ENG","Croatia":"CRO","Ghana":"GHA","Panama":"PAN",
};

const ESPN_SCOREBOARD_URL = "https://site.api.espn.com/apis/site/v2/sports/soccer/fifa.world/scoreboard";

function formatDateYYYYMMDD(d) {
  const y = d.getFullYear();
  const m = String(d.getMonth()+1).padStart(2,"0");
  const day = String(d.getDate()).padStart(2,"0");
  return `${y}${m}${day}`;
}

// Polls ESPN's scoreboard for live/recent World Cup games, keyed by sorted team-code pair
function useLiveScores() {
  const [liveScores, setLiveScores] = useState({});

  useEffect(() => {
    let cancelled = false;

    async function fetchScores() {
      const today = new Date();
      const dateStrings = [-1, 0, 1].map(offset => {
        const d = new Date(today);
        d.setDate(d.getDate() + offset);
        return formatDateYYYYMMDD(d);
      });

      const results = {};
      await Promise.all(dateStrings.map(async (ds) => {
        try {
          const res = await fetch(`${ESPN_SCOREBOARD_URL}?dates=${ds}`);
          const data = await res.json();
          (data.events || []).forEach(ev => {
            const comp = ev.competitions?.[0];
            const competitors = comp?.competitors || [];
            if (competitors.length !== 2) return;
            const home = competitors.find(c => c.homeAway === "home");
            const away = competitors.find(c => c.homeAway === "away");
            if (!home?.team?.abbreviation || !away?.team?.abbreviation) return;
            const key = [home.team.abbreviation, away.team.abbreviation].sort().join("-");
            const status = comp.status?.type || {};
            results[key] = {
              state: status.state,
              clock: comp.status?.displayClock,
              homeCode: home.team.abbreviation,
              awayCode: away.team.abbreviation,
              homeScore: home.score,
              awayScore: away.score,
            };
          });
        } catch {
          // ignore network/API errors, just skip this date
        }
      }));

      if (!cancelled) setLiveScores(results);
    }

    fetchScores();
    const interval = setInterval(fetchScores, 60000);
    return () => { cancelled = true; clearInterval(interval); };
  }, []);

  return liveScores;
}

function stripName(label) {
  return label.replace(/^[\p{Emoji}\s]+/u,"").trim();
}

// Extract all unique teams from the group stage
function getAllTeams() {
  const teams = new Set();
  Object.values(schedule["GROUP STAGE"]).forEach(day =>
    day.forEach(m => { teams.add(m.home); teams.add(m.away); })
  );
  return ["🌍 All Teams", ...Array.from(teams).sort((a,b) => {
    const nameA = stripName(a);
    const nameB = stripName(b);
    return nameA.localeCompare(nameB);
  })];
}

function getMatchesForCountry(country) {
  const results = [];
  Object.entries(schedule["GROUP STAGE"]).forEach(([day, matches]) => {
    matches.forEach(m => {
      if (m.home === country || m.away === country) {
        results.push({ ...m, day });
      }
    });
  });
  return results;
}

function getMatchesForGroup(group) {
  const results = [];
  Object.entries(schedule["GROUP STAGE"]).forEach(([day, matches]) => {
    matches.forEach(m => {
      if (m.group === group) {
        results.push({ ...m, day });
      }
    });
  });
  return results;
}

function FavBadge({ match }) {
  if (!match.favorite || match.favorite === "even") {
    return <div style={{ fontSize:"10px", color:"#6b8ab8", fontStyle:"italic", textAlign:"center", minWidth:70 }}>Even match</div>;
  }
  const isHome = match.favorite === "home";
  const raw = isHome ? match.home : match.away;
  const name = stripName(raw);
  const color = match.confidence === "strong" ? "#f1c40f" : "#8aabcc";
  return (
    <div style={{ minWidth:70, textAlign:"center" }}>
      <div style={{ fontSize:"9px", color:"#4a6a8a", letterSpacing:"1px", marginBottom:2 }}>FAVORED</div>
      <div style={{ fontSize:"11px", fontWeight:700, color, lineHeight:1.2 }}>
        {isHome ? "◀ " : ""}{name.length > 10 ? name.slice(0,10)+"…" : name}{!isHome ? " ▶" : ""}
      </div>
      <div style={{ fontSize:"9px", color: match.confidence === "strong" ? "#f1c40f88" : "#4a6a8a", marginTop:1 }}>
        {match.confidence === "strong" ? "●●●" : "●●○"}
      </div>
    </div>
  );
}

function LiveScoreBadge({ live, homeCode }) {
  const isLive = live.state === "in";
  const isFinal = live.state === "post";
  const sameOrientation = live.homeCode === homeCode;
  const leftScore = sameOrientation ? live.homeScore : live.awayScore;
  const rightScore = sameOrientation ? live.awayScore : live.homeScore;
  return (
    <div style={{ minWidth:70, textAlign:"center" }}>
      <div style={{ fontSize:"9px", fontWeight:800, letterSpacing:"1px", marginBottom:2,
        color: isLive ? "#ff5a5f" : "#8aabcc" }}>
        {isLive ? `● LIVE ${live.clock || ""}`.trim() : isFinal ? "FULL TIME" : ""}
      </div>
      <div style={{ fontSize:"18px", fontWeight:800, color:"#e8f0fe" }}>
        {leftScore} – {rightScore}
      </div>
    </div>
  );
}

function MatchCard({ m, tz, showDay, liveScores }) {
  const homeCode = COUNTRY_CODES[stripName(m.home)];
  const awayCode = COUNTRY_CODES[stripName(m.away)];
  const pairKey = homeCode && awayCode ? [homeCode, awayCode].sort().join("-") : null;
  const live = pairKey ? liveScores?.[pairKey] : null;
  const showLive = live && live.state !== "pre";

  return (
    <div style={{
      background:"rgba(255,255,255,0.04)", border:"1px solid rgba(255,255,255,0.08)",
      borderLeft:`3px solid ${groupColors[m.group]||"#e8c96a"}`,
      borderRadius:8, padding:"12px 14px", marginBottom:10,
    }}>
      {showDay && (
        <div style={{ fontSize:"10px", color:"#e8c96a", fontWeight:700, letterSpacing:"1px", marginBottom:6 }}>
          {m.day}
        </div>
      )}
      <div style={{ display:"flex", alignItems:"center", gap:10 }}>
        <div style={{ width:26, height:26, borderRadius:"50%", flexShrink:0,
          background:groupColors[m.group]||"#e8c96a", display:"flex", alignItems:"center",
          justifyContent:"center", fontSize:"10px", fontWeight:800, color:"#fff" }}>
          {m.group}
        </div>
        <div style={{ flex:1, minWidth:0 }}>
          <div style={{ display:"flex", alignItems:"center", gap:6, flexWrap:"wrap" }}>
            <span style={{ fontSize:"14px", fontWeight:700 }}>{m.home}</span>
            <span style={{ fontSize:"10px", color:"#4a6a8a", fontWeight:600 }}>vs</span>
            <span style={{ fontSize:"14px", fontWeight:700 }}>{m.away}</span>
          </div>
          <div style={{ marginTop:3, fontSize:"11px", color:"#5a7a9a" }}>📍 {m.venue}</div>
        </div>
        {showLive ? (
          <LiveScoreBadge live={live} homeCode={homeCode} />
        ) : m.favorite !== null ? (
          <FavBadge match={m} />
        ) : (
          <div style={{ minWidth:70, textAlign:"center", fontSize:"10px", color:"#4a6a8a" }}>TBD</div>
        )}
      </div>
      <div style={{ marginTop:8, display:"flex", alignItems:"center", justifyContent:"space-between", flexWrap:"wrap", gap:6 }}>
        <span style={{ fontSize:"14px", fontWeight:700, color:"#e8c96a" }}>
          {m.etH != null ? convertTime(m.etH, m.etM, tz) : "TBD"}
        </span>
        <div style={{ display:"flex", gap:4, flexWrap:"wrap", alignItems:"center" }}>
          {(m.broadcast||[]).map(b => (
            <div key={b} style={{ background:broadcastStyle[b]?.bg||"#333", color:broadcastStyle[b]?.color||"#fff",
              borderRadius:4, padding:"2px 7px", fontSize:"10px", fontWeight:700 }}>
              {broadcastStyle[b]?.label||b}
            </div>
          ))}
          <div style={{ background:"#1a4a88", color:"#fff", borderRadius:4, padding:"2px 7px", fontSize:"10px", fontWeight:700 }}>Fox One</div>
          <div style={{ background:"#c00", color:"#fff", borderRadius:4, padding:"2px 7px", fontSize:"10px", fontWeight:700 }}>Telemundo</div>
          <div style={{ background:"#9b59b6", color:"#fff", borderRadius:4, padding:"2px 7px", fontSize:"10px", fontWeight:700 }}>Peacock</div>
        </div>
      </div>
    </div>
  );
}

const TZ_LIST = ["ET","CT","MT","PT"];
const ALL_TEAMS_LABEL = "🌍 All Teams";
const ALL_GROUPS_LABEL = "🏆 All Groups";
const GROUPS = ["A","B","C","D","E","F","G","H","I","J","K","L"];
const GROUP_OPTIONS = [ALL_GROUPS_LABEL, ...GROUPS.map(g => `Group ${g}`)];

export default function WorldCupSchedule() {
  const [activeStage, setActiveStage] = useState("GROUP STAGE");
  const [activeDay,   setActiveDay]   = useState(Object.keys(schedule["GROUP STAGE"])[0]);
  const [tz,          setTz]          = useState("ET");
  const [selectedTeam, setSelectedTeam] = useState(ALL_TEAMS_LABEL);
  const [selectedGroup, setSelectedGroup] = useState(ALL_GROUPS_LABEL);
  const liveScores = useLiveScores();

  const allTeams = useMemo(() => getAllTeams(), []);
  const stages   = Object.keys(schedule);
  const days     = Object.keys(schedule[activeStage]);

  const isTeamFiltered = selectedTeam !== ALL_TEAMS_LABEL;
  const teamMatches    = useMemo(() =>
    isTeamFiltered ? getMatchesForCountry(selectedTeam) : [],
    [selectedTeam, isTeamFiltered]
  );

  const isGroupFiltered = selectedGroup !== ALL_GROUPS_LABEL;
  const groupMatches    = useMemo(() =>
    isGroupFiltered ? getMatchesForGroup(selectedGroup.replace("Group ","")) : [],
    [selectedGroup, isGroupFiltered]
  );

  const dayMatches = schedule[activeStage]?.[activeDay] || [];

  const handleTeamChange = (value) => {
    setSelectedTeam(value);
    if (value !== ALL_TEAMS_LABEL) setSelectedGroup(ALL_GROUPS_LABEL);
  };

  const handleGroupChange = (value) => {
    setSelectedGroup(value);
    if (value !== ALL_GROUPS_LABEL) setSelectedTeam(ALL_TEAMS_LABEL);
  };

  const TZToggle = () => (
    <div style={{ display:"flex", background:"rgba(0,0,0,0.3)", borderRadius:8, border:"1px solid rgba(255,255,255,0.1)", overflow:"hidden", flexShrink:0 }}>
      {TZ_LIST.map(t => (
        <button key={t} onClick={() => setTz(t)}
          style={{ padding:"4px 10px", border:"none", cursor:"pointer", fontSize:"11px", fontWeight:700,
            background: tz===t ? "#e8c96a" : "transparent",
            color: tz===t ? "#1a1000" : "#6b8ab8",
            borderRight: t !== "PT" ? "1px solid rgba(255,255,255,0.1)" : "none" }}>
          {t}
        </button>
      ))}
    </div>
  );

  return (
    <div style={{ minHeight:"100vh", background:"linear-gradient(135deg,#0a1628 0%,#1a2d4f 50%,#0d1f38 100%)", fontFamily:"'Segoe UI',system-ui,sans-serif", color:"#e8f0fe" }}>

      {/* Header */}
      <div style={{ background:"linear-gradient(90deg,#c8a84b 0%,#e8c96a 40%,#c8a84b 100%)", padding:"16px 24px 12px", textAlign:"center" }}>
        <div style={{ fontSize:"11px", letterSpacing:"4px", color:"#5a3e00", fontWeight:700, marginBottom:2 }}>FIFA</div>
        <div style={{ fontSize:"26px", fontWeight:900, color:"#1a1000", letterSpacing:"-0.5px", lineHeight:1 }}>WORLD CUP 2026</div>
        <div style={{ fontSize:"11px", letterSpacing:"3px", color:"#5a3e00", fontWeight:600, marginTop:3 }}>
          CANADA · MEXICO · USA &nbsp;|&nbsp; JUN 11 – JUL 19
        </div>
      </div>

      {/* Country/Group selectors + TZ toggle */}
      <div style={{ padding:"12px 16px", display:"flex", gap:10, alignItems:"center", flexWrap:"wrap", justifyContent:"space-between", borderBottom:"1px solid rgba(255,255,255,0.07)" }}>
        <select
          value={selectedTeam}
          onChange={e => handleTeamChange(e.target.value)}
          style={{
            flex:1, minWidth:160, maxWidth:280,
            background:"rgba(255,255,255,0.06)", color:"#e8f0fe",
            border:"1px solid rgba(255,255,255,0.15)", borderRadius:8,
            padding:"7px 12px", fontSize:"13px", fontWeight:600, cursor:"pointer",
            appearance:"none", backgroundImage:"url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath fill='%236b8ab8' d='M6 8L0 0h12z'/%3E%3C/svg%3E\")",
            backgroundRepeat:"no-repeat", backgroundPosition:"right 12px center",
          }}>
          {allTeams.map(t => (
            <option key={t} value={t} style={{ background:"#1a2d4f", color:"#e8f0fe" }}>{t}</option>
          ))}
        </select>
        <select
          value={selectedGroup}
          onChange={e => handleGroupChange(e.target.value)}
          style={{
            flex:1, minWidth:120, maxWidth:200,
            background:"rgba(255,255,255,0.06)", color:"#e8f0fe",
            border:"1px solid rgba(255,255,255,0.15)", borderRadius:8,
            padding:"7px 12px", fontSize:"13px", fontWeight:600, cursor:"pointer",
            appearance:"none", backgroundImage:"url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath fill='%236b8ab8' d='M6 8L0 0h12z'/%3E%3C/svg%3E\")",
            backgroundRepeat:"no-repeat", backgroundPosition:"right 12px center",
          }}>
          {GROUP_OPTIONS.map(g => (
            <option key={g} value={g} style={{ background:"#1a2d4f", color:"#e8f0fe" }}>{g}</option>
          ))}
        </select>
        <TZToggle />
      </div>

      {/* Country schedule view */}
      {isTeamFiltered ? (
        <div style={{ padding:"16px 16px 24px" }}>
          <div style={{ fontSize:"14px", fontWeight:700, color:"#e8c96a", marginBottom:14, letterSpacing:"0.5px" }}>
            {selectedTeam} — Group Stage Schedule
          </div>
          {teamMatches.length === 0 ? (
            <div style={{ textAlign:"center", padding:40, color:"#4a6a8a" }}>No matches found</div>
          ) : (
            teamMatches.map((m,i) => <MatchCard key={i} m={m} tz={tz} showDay={true} liveScores={liveScores} />)
          )}
        </div>
      ) : isGroupFiltered ? (
        <div style={{ padding:"16px 16px 24px" }}>
          <div style={{ fontSize:"14px", fontWeight:700, color:"#e8c96a", marginBottom:14, letterSpacing:"0.5px" }}>
            {selectedGroup} — Group Stage Schedule
          </div>
          {groupMatches.length === 0 ? (
            <div style={{ textAlign:"center", padding:40, color:"#4a6a8a" }}>No matches found</div>
          ) : (
            groupMatches.map((m,i) => <MatchCard key={i} m={m} tz={tz} showDay={true} liveScores={liveScores} />)
          )}
        </div>
      ) : (
        <>
          {/* Stage Tabs */}
          <div style={{ display:"flex", borderBottom:"1px solid rgba(255,255,255,0.1)", background:"rgba(0,0,0,0.3)" }}>
            {stages.map(s => (
              <button key={s} onClick={() => { setActiveStage(s); setActiveDay(Object.keys(schedule[s])[0]); }}
                style={{ flex:1, padding:"12px 4px", border:"none", background:"none", cursor:"pointer",
                  fontSize:"11px", fontWeight:700, letterSpacing:"1px",
                  color: activeStage===s ? "#e8c96a" : "#6b8ab8",
                  borderBottom: activeStage===s ? "2px solid #e8c96a" : "2px solid transparent" }}>
                {s}
              </button>
            ))}
          </div>

          {/* Day Selector */}
          <div style={{ padding:"10px 16px", display:"flex", gap:6, overflowX:"auto", WebkitOverflowScrolling:"touch", scrollbarWidth:"none" }}>
            {days.map(d => (
              <button key={d} onClick={() => setActiveDay(d)}
                style={{ whiteSpace:"nowrap", padding:"5px 11px",
                  background: activeDay===d ? "#e8c96a" : "rgba(255,255,255,0.06)",
                  border:"1px solid", borderColor: activeDay===d ? "#e8c96a" : "rgba(255,255,255,0.12)",
                  borderRadius:6, cursor:"pointer", fontSize:"12px",
                  fontWeight: activeDay===d ? 700 : 500,
                  color: activeDay===d ? "#1a1000" : "#8aabcc" }}>
                {d}
              </button>
            ))}
          </div>

          {/* Match Cards */}
          <div style={{ padding:"0 16px 8px" }}>
            {dayMatches.map((m,i) => <MatchCard key={i} m={m} tz={tz} showDay={false} liveScores={liveScores} />)}
          </div>

          {/* Key Dates */}
          <div style={{ margin:"0 16px 24px", background:"rgba(232,201,106,0.05)", border:"1px solid rgba(232,201,106,0.15)", borderRadius:8, padding:"14px 16px" }}>
            <div style={{ fontSize:"11px", fontWeight:700, letterSpacing:"2px", color:"#e8c96a", marginBottom:10 }}>KEY DATES</div>
            {[
              ["Jun 11","Tournament Opens — Mexico City"],
              ["Jun 28–Jul 3","Round of 32"],
              ["Jul 4–7","Round of 16"],
              ["Jul 9–11","Quarterfinals"],
              ["Jul 14–15","Semifinals"],
              ["Jul 18","3rd Place Match — Miami"],
              ["Jul 19","🏆 Final — New York/NJ · 3:00 PM ET · FOX"],
            ].map(([d,l]) => (
              <div key={d} style={{ display:"flex", justifyContent:"space-between", padding:"4px 0", borderBottom:"1px solid rgba(255,255,255,0.04)" }}>
                <span style={{ fontSize:"12px", fontWeight:600, color:"#e8c96a" }}>{d}</span>
                <span style={{ fontSize:"12px", color:"#6b8ab8" }}>{l}</span>
              </div>
            ))}
            <div style={{ marginTop:10, fontSize:"10px", color:"#4a6a8a" }}>
              ★ Favorite confidence: ●●● = strong · ●●○ = slight
            </div>
          </div>
        </>
      )}
    </div>
  );
}
