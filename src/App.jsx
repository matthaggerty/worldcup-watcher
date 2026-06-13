import { useState, useEffect, useLayoutEffect, useMemo, useRef } from "react";

const mkMatch = (etH, etM, home, away, group, venue, broadcast, favorite, confidence) => ({
  etH, etM, home, away, group, venue, broadcast, favorite, confidence
});

function timeAgo(iso) {
  const diffMs = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diffMs / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
}

function TwitterTimeline() {
  const [shorts, setShorts] = useState(null);
  const [index, setIndex] = useState(0);
  const [failed, setFailed] = useState(false);
  const [autoplay, setAutoplay] = useState(false);

  useEffect(() => {
    let cancelled = false;

    const load = () => {
      fetch("/.netlify/functions/foxsoccer-short")
        .then((res) => {
          if (!res.ok) throw new Error(`status ${res.status}`);
          return res.json();
        })
        .then((data) => {
          if (cancelled) return;
          if (data.error) throw new Error(data.error);
          setShorts(data.shorts || []);
        })
        .catch(() => { if (!cancelled) setFailed(true); });
    };

    load();
    const interval = setInterval(load, 5 * 60 * 1000);
    return () => { cancelled = true; clearInterval(interval); };
  }, []);

  const short = shorts && shorts.length ? shorts[index % shorts.length] : null;

  return (
    <div style={{ marginTop:16 }}>
      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:10 }}>
        <div style={{ fontSize:"12px", fontWeight:800, letterSpacing:"1px", color:"#8aabcc" }}>
          LATEST FROM FOX SOCCER
        </div>
        {shorts && shorts.length > 1 && (
          <button
            onClick={() => { setAutoplay(true); setIndex((i) => (i + 1) % shorts.length); }}
            style={{
              display:"flex", alignItems:"center", gap:4,
              background:"rgba(255,255,255,0.06)", border:"1px solid rgba(255,255,255,0.12)",
              borderRadius:6, color:"#ccff00", fontWeight:700, fontSize:"12px",
              padding:"4px 10px", cursor:"pointer",
            }}>
            Next ›
          </button>
        )}
      </div>
      {short ? (
        <div style={{ borderRadius:8, overflow:"hidden",
          background:"rgba(255,255,255,0.04)", border:"1px solid rgba(255,255,255,0.08)" }}>
          <div style={{ position:"relative", width:"100%", aspectRatio:"9 / 16", background:"#000" }}>
            <iframe
              key={short.videoId}
              src={`https://www.youtube.com/embed/${short.videoId}${autoplay ? "?autoplay=1&mute=1" : ""}`}
              title={short.title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              style={{ position:"absolute", top:0, left:0, width:"100%", height:"100%", border:"none" }}
            />
          </div>
          <a href={short.url} target="_blank" rel="noopener noreferrer"
            style={{ display:"block", padding:"14px 16px", textDecoration:"none" }}>
            <div style={{ fontSize:"14px", color:"#e8f0fe", lineHeight:1.5, marginBottom:8 }}>
              {short.title}
            </div>
            <div style={{ fontSize:"12px", color:"#6b8ab8" }}>
              FOX Soccer · {timeAgo(short.publishedAt)}
            </div>
          </a>
        </div>
      ) : (
        <a href="https://www.youtube.com/@Foxsoccer/shorts" target="_blank" rel="noopener noreferrer"
          style={{ display:"block", textAlign:"center", padding:"16px",
            borderRadius:8, background:"rgba(255,255,255,0.04)", border:"1px solid rgba(255,255,255,0.08)",
            color:"#ccff00", fontWeight:700, fontSize:"13px", textDecoration:"none" }}>
          {failed ? "View latest shorts from FOX Soccer →" : "Loading latest short…"}
        </a>
      )}
    </div>
  );
}

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
      borderLeft:`3px solid ${groupColors[m.group]||"#ccff00"}`,
      borderRadius:8, padding:"16px", marginBottom:12,
      minHeight:128, display:"flex", flexDirection:"column", justifyContent:"space-between", gap:14,
    }}>
      {showDay && (
        <div style={{ fontSize:"10px", color:"#ccff00", fontWeight:700, letterSpacing:"1px" }}>
          {m.day}
        </div>
      )}
      <div style={{ display:"flex", alignItems:"center", gap:12 }}>
        <div style={{ width:30, height:30, borderRadius:"50%", flexShrink:0,
          background:groupColors[m.group]||"#ccff00", display:"flex", alignItems:"center",
          justifyContent:"center", fontSize:"11px", fontWeight:800, color:"#fff" }}>
          {m.group}
        </div>
        <div style={{ flex:1, minWidth:0 }}>
          <div style={{ display:"flex", alignItems:"center", gap:6, flexWrap:"wrap" }}>
            <span style={{ fontSize:"15px", fontWeight:700 }}>{m.home}</span>
            <span style={{ fontSize:"10px", color:"#4a6a8a", fontWeight:600 }}>vs</span>
            <span style={{ fontSize:"15px", fontWeight:700 }}>{m.away}</span>
          </div>
          <div style={{ marginTop:6, fontSize:"11px", color:"#5a7a9a" }}>📍 {m.venue}</div>
        </div>
        {showLive ? (
          <LiveScoreBadge live={live} homeCode={homeCode} />
        ) : m.favorite !== null ? (
          <FavBadge match={m} />
        ) : (
          <div style={{ minWidth:70, textAlign:"center", fontSize:"10px", color:"#4a6a8a" }}>TBD</div>
        )}
      </div>
      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", flexWrap:"wrap", gap:6 }}>
        <span style={{ fontSize:"14px", fontWeight:700, color:"#ccff00" }}>
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

function getTodayDayKey(days) {
  const todayKey = new Date()
    .toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric", timeZone: "America/New_York" })
    .replace(",", "");
  return days.includes(todayKey) ? todayKey : days[0];
}

const allDaysMatches = { ...schedule["GROUP STAGE"], ...schedule["KNOCKOUT STAGE"] };
const allDays = Object.keys(allDaysMatches);

export default function WorldCupSchedule() {
  const [activeDay, setActiveDay] = useState(() => getTodayDayKey(allDays));
  const [tz,          setTz]          = useState("ET");
  const [selectedTeam, setSelectedTeam] = useState(ALL_TEAMS_LABEL);
  const [selectedGroup, setSelectedGroup] = useState(ALL_GROUPS_LABEL);
  const liveScores = useLiveScores();

  const allTeams = useMemo(() => getAllTeams(), []);
  const days     = allDays;

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

  const dayMatches = allDaysMatches[activeDay] || [];
  const dayIndex   = days.indexOf(activeDay);

  const activeDayRef = useRef(null);
  const dayScrollRef = useRef(null);
  useLayoutEffect(() => {
    const container = dayScrollRef.current;
    const button = activeDayRef.current;
    if (!container || !button) return;
    const containerRect = container.getBoundingClientRect();
    const buttonRect = button.getBoundingClientRect();
    const paddingLeft = parseFloat(getComputedStyle(container).paddingLeft) || 0;
    const delta = (buttonRect.left - containerRect.left) - paddingLeft;
    container.scrollTo({ left: container.scrollLeft + delta, behavior:"auto" });
  }, [activeDay]);

  const touchStart = useRef(null);
  const isHorizontalSwipe = useRef(false);
  const handleTouchStart = (e) => {
    touchStart.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    isHorizontalSwipe.current = false;
  };
  const handleTouchMove = (e) => {
    if (!touchStart.current) return;
    const deltaX = e.touches[0].clientX - touchStart.current.x;
    const deltaY = e.touches[0].clientY - touchStart.current.y;
    if (!isHorizontalSwipe.current && Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 10) {
      isHorizontalSwipe.current = true;
    }
    if (isHorizontalSwipe.current) e.preventDefault();
  };
  const handleTouchEnd = (e) => {
    if (!touchStart.current) return;
    const deltaX = e.changedTouches[0].clientX - touchStart.current.x;
    touchStart.current = null;
    const SWIPE_THRESHOLD = 50;
    if (deltaX <= -SWIPE_THRESHOLD && dayIndex < days.length - 1) {
      setActiveDay(days[dayIndex + 1]);
    } else if (deltaX >= SWIPE_THRESHOLD && dayIndex > 0) {
      setActiveDay(days[dayIndex - 1]);
    }
  };

  const handleTeamChange = (value) => {
    setSelectedTeam(value);
    if (value !== ALL_TEAMS_LABEL) setSelectedGroup(ALL_GROUPS_LABEL);
  };

  const handleGroupChange = (value) => {
    setSelectedGroup(value);
    if (value !== ALL_GROUPS_LABEL) setSelectedTeam(ALL_TEAMS_LABEL);
  };

  const TZToggle = () => (
    <select
      value={tz}
      onChange={e => setTz(e.target.value)}
      style={{
        flexShrink:0, minWidth:64,
        background:"rgba(255,255,255,0.06)", color:"#e8f0fe",
        border:"1px solid rgba(255,255,255,0.15)", borderRadius:8,
        padding:"7px 12px", fontSize:"13px", fontWeight:600, cursor:"pointer",
        appearance:"none", backgroundImage:"url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath fill='%236b8ab8' d='M6 8L0 0h12z'/%3E%3C/svg%3E\")",
        backgroundRepeat:"no-repeat", backgroundPosition:"right 12px center",
      }}>
      {TZ_LIST.map(t => (
        <option key={t} value={t} style={{ background:"#15161a", color:"#e8f0fe" }}>{t}</option>
      ))}
    </select>
  );

  return (
    <div style={{ minHeight:"100vh", background:`
        radial-gradient(circle at 15% 10%, rgba(204,255,0,0.16), transparent 45%),
        radial-gradient(circle at 85% 90%, rgba(40,120,255,0.22), transparent 50%),
        #05070a` }}>
    <div style={{ maxWidth:520, margin:"0 auto", minHeight:"100vh", overflowX:"hidden", background:"linear-gradient(135deg,#0a0a0a 0%,#121212 50%,#000000 100%)", boxShadow:"0 0 60px rgba(0,0,0,0.6)", fontFamily:"'Segoe UI',system-ui,sans-serif", color:"#e8f0fe" }}>

      {/* Header */}
      <div style={{ position:"relative", background:"#000", padding:"24px 20px 18px", overflow:"hidden" }}>
        <div style={{
          position:"absolute", inset:0,
          backgroundImage:"url(/stadium-bg.svg)", backgroundSize:"cover", backgroundPosition:"right top",
          opacity:0.9, pointerEvents:"none"
        }} />

        <div style={{ position:"relative", zIndex:1 }}>
          <svg width="60" height="36" viewBox="0 0 60 36" fill="none" style={{ marginBottom:10, display:"block" }}>
            <circle cx="14" cy="18" r="12" stroke="#ccff00" strokeWidth="2"/>
            <path d="M14 8 L20 13 L18 20 L10 20 L8 13 Z M14 8 L14 6 M20 13 L26 11 M18 20 L22 26 M10 20 L6 26 M8 13 L2 11"
              stroke="#ccff00" strokeWidth="1.5" fill="none"/>
            <line x1="30" y1="9" x2="58" y2="9" stroke="#ccff00" strokeWidth="2" opacity="0.9"/>
            <line x1="30" y1="14" x2="50" y2="14" stroke="#ccff00" strokeWidth="2" opacity="0.6"/>
            <line x1="30" y1="19" x2="42" y2="19" stroke="#ccff00" strokeWidth="2" opacity="0.35"/>
          </svg>

          <div style={{ fontFamily:"'Arial Black',Impact,sans-serif", fontWeight:900, fontSize:"40px",
            lineHeight:1, letterSpacing:"-1px", color:"#fff", textTransform:"uppercase" }}>
            World Cup
          </div>
          <div style={{ fontFamily:"'Arial Black',Impact,sans-serif", fontWeight:900, fontSize:"40px",
            lineHeight:1, letterSpacing:"-1px", color:"#ccff00", textTransform:"uppercase", marginBottom:10 }}>
            Watcher
          </div>

          <div style={{ width:36, height:4, background:"#ccff00", marginBottom:10 }} />

          <div style={{ fontSize:"15px", color:"#cfd8dc", lineHeight:1.4 }}>
            Every kickoff{" "}
            <span style={{ color:"#ccff00", fontWeight:700 }}>without the chaos.</span>
          </div>
        </div>
      </div>

      {/* Country/Group selectors + TZ toggle */}
      <div style={{ padding:"12px 16px", display:"flex", gap:10, alignItems:"center", flexWrap:"wrap", justifyContent:"space-between", borderBottom:"1px solid rgba(255,255,255,0.07)" }}>
        <select
          value={selectedTeam}
          onChange={e => handleTeamChange(e.target.value)}
          style={{
            flex:1, minWidth:130, maxWidth:280,
            background:"rgba(255,255,255,0.06)", color:"#e8f0fe",
            border:"1px solid rgba(255,255,255,0.15)", borderRadius:8,
            padding:"7px 12px", fontSize:"13px", fontWeight:600, cursor:"pointer",
            appearance:"none", backgroundImage:"url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath fill='%236b8ab8' d='M6 8L0 0h12z'/%3E%3C/svg%3E\")",
            backgroundRepeat:"no-repeat", backgroundPosition:"right 12px center",
          }}>
          {allTeams.map(t => (
            <option key={t} value={t} style={{ background:"#15161a", color:"#e8f0fe" }}>{t}</option>
          ))}
        </select>
        <select
          value={selectedGroup}
          onChange={e => handleGroupChange(e.target.value)}
          style={{
            flex:1, minWidth:118, maxWidth:180,
            background:"rgba(255,255,255,0.06)", color:"#e8f0fe",
            border:"1px solid rgba(255,255,255,0.15)", borderRadius:8,
            padding:"7px 12px", fontSize:"13px", fontWeight:600, cursor:"pointer",
            appearance:"none", backgroundImage:"url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath fill='%236b8ab8' d='M6 8L0 0h12z'/%3E%3C/svg%3E\")",
            backgroundRepeat:"no-repeat", backgroundPosition:"right 12px center", paddingRight:24,
          }}>
          {GROUP_OPTIONS.map(g => (
            <option key={g} value={g} style={{ background:"#15161a", color:"#e8f0fe" }}>{g}</option>
          ))}
        </select>
        <TZToggle />
      </div>

      {/* Country schedule view */}
      {isTeamFiltered ? (
        <div style={{ padding:"16px 16px 24px" }}>
          <div style={{ fontSize:"14px", fontWeight:700, color:"#ccff00", marginBottom:14, letterSpacing:"0.5px" }}>
            {selectedTeam} — Group Stage Schedule
          </div>
          {teamMatches.length === 0 ? (
            <div style={{ textAlign:"center", padding:40, color:"#4a6a8a" }}>No matches found</div>
          ) : (
            teamMatches.map((m,i) => <MatchCard key={i} m={m} tz={tz} showDay={true} liveScores={liveScores} />)
          )}
          <TwitterTimeline />
        </div>
      ) : isGroupFiltered ? (
        <div style={{ padding:"16px 16px 24px" }}>
          <div style={{ fontSize:"14px", fontWeight:700, color:"#ccff00", marginBottom:14, letterSpacing:"0.5px" }}>
            {selectedGroup} — Group Stage Schedule
          </div>
          {groupMatches.length === 0 ? (
            <div style={{ textAlign:"center", padding:40, color:"#4a6a8a" }}>No matches found</div>
          ) : (
            groupMatches.map((m,i) => <MatchCard key={i} m={m} tz={tz} showDay={true} liveScores={liveScores} />)
          )}
          <TwitterTimeline />
        </div>
      ) : (
        <>
          {/* Day Selector */}
          <div ref={dayScrollRef} style={{ padding:"10px 16px", display:"flex", gap:6, overflowX:"auto", WebkitOverflowScrolling:"touch", scrollbarWidth:"none", borderBottom:"1px solid rgba(255,255,255,0.07)" }}>
            {days.map(d => (
              <button key={d} ref={activeDay===d ? activeDayRef : null} onClick={() => setActiveDay(d)}
                style={{ whiteSpace:"nowrap", padding:"5px 11px",
                  background: activeDay===d ? "#ccff00" : "rgba(255,255,255,0.06)",
                  border:"1px solid", borderColor: activeDay===d ? "#ccff00" : "rgba(255,255,255,0.12)",
                  borderRadius:6, cursor:"pointer", fontSize:"12px",
                  fontWeight: activeDay===d ? 700 : 500,
                  color: activeDay===d ? "#0a0a0a" : "#8aabcc" }}>
                {d}
              </button>
            ))}
          </div>

          {/* Match Cards */}
          <div style={{ padding:"0 16px 24px", touchAction:"pan-y" }}
            onTouchStart={handleTouchStart} onTouchMove={handleTouchMove} onTouchEnd={handleTouchEnd}>
            {dayMatches.map((m,i) => <MatchCard key={i} m={m} tz={tz} showDay={false} liveScores={liveScores} />)}
            <TwitterTimeline />
          </div>
        </>
      )}
    </div>
    </div>
  );
}
