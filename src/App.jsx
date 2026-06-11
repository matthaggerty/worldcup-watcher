import { useState } from "react";

// All kick-off times stored as ET (Eastern Time) 24h values
// Times that cross midnight are stored as e.g. 24:00 = midnight, 25:00 = 1am next day
// etH: hour in ET (24h), etM: minutes
const mkMatch = (etH, etM, home, away, group, venue, broadcast, favorite, confidence, favNote) => ({
  etH, etM, home, away, group, venue, broadcast, favorite, confidence, favNote
});

const TZ_OFFSETS = { ET: 0, CT: -1, MT: -2, PT: -3 };

function convertTime(etH, etM, tz) {
  const offset = TZ_OFFSETS[tz];
  let h = etH + offset;
  let m = etM;
  const nextDay = h < 0 || (etH >= 0 && h >= 24 && etH < 24);
  h = ((h % 24) + 24) % 24;
  const period = h >= 12 ? "PM" : "AM";
  const h12 = h % 12 === 0 ? 12 : h % 12;
  const mm = m === 0 ? "" : `:${String(m).padStart(2,"0")}`;
  const late = (etH + offset) < 0 ? " (prev day)" : (etH + offset) >= 24 ? " (next day)" : "";
  return `${h12}${mm} ${period} ${tz}${late}`;
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
      mkMatch(16,0,"🇨🇼 Curaçao","🇪🇨 Ecuador","E","Dallas",["FS1"],"away","strong"),
      mkMatch(19,0,"🇩🇪 Germany","🇨🇮 Ivory Coast","E","Kansas City",["FOX"],"home","strong"),
      mkMatch(18,0,"🇯🇵 Japan","🇹🇳 Tunisia","F","Miami",["FS1"],"home","slight"),
      mkMatch(21,0,"🇳🇱 Netherlands","🇸🇪 Sweden","F","New York/NJ",["FOX"],"home","slight"),
    ],
    "Sun Jun 21": [
      mkMatch(12,0,"🇪🇸 Spain","🇸🇦 Saudi Arabia","H","Atlanta",["FOX"],"home","strong"),
      mkMatch(15,0,"🇳🇿 New Zealand","🇧🇪 Belgium","G","Los Angeles",["FOX"],"away","strong"),
      mkMatch(15,0,"🇺🇾 Uruguay","🇨🇻 Cape Verde","H","Boston",["FOX"],"home","strong"),
      mkMatch(18,0,"🇪🇬 Egypt","🇮🇷 Iran","G","Seattle",["FS1"],"home","slight"),
    ],
    "Mon Jun 22": [
      mkMatch(12,0,"🇸🇳 Senegal","🇳🇴 Norway","I","Philadelphia",["FOX"],"even","slight"),
      mkMatch(15,0,"🇫🇷 France","🇮🇶 Iraq","I","New York/NJ",["FOX"],"home","strong"),
      mkMatch(21,0,"🇩🇿 Algeria","🇦🇹 Austria","J","Houston",["FS1"],"away","slight"),
      mkMatch(22,0,"🇦🇷 Argentina","🇯🇴 Jordan","J","Dallas",["FOX"],"home","strong"),
    ],
    "Tue Jun 23": [
      mkMatch(13,0,"🇨🇩 DR Congo","🇺🇿 Uzbekistan","K","Kansas City",["FOX"],"home","slight"),
      mkMatch(16,0,"🇵🇹 Portugal","🇨🇴 Colombia","K","Kansas City",["FOX"],"home","slight"),
      mkMatch(19,0,"🇭🇷 Croatia","🇬🇭 Ghana","L","Toronto",["FS1"],"home","slight"),
      mkMatch(21,0,"🏴󠁧󠁢󠁥󠁮󠁧󠁿 England","🇵🇦 Panama","L","New York/NJ",["FOX"],"home","strong"),
    ],
    "Wed Jun 24": [
      mkMatch(15,0,"🇿🇦 S. Africa","🇰🇷 S. Korea","A","Miami",["FS1"],"away","slight"),
      mkMatch(15,0,"🇲🇽 Mexico","🇨🇿 Czechia","A","Guadalajara",["FOX"],"home","slight"),
      mkMatch(18,0,"🇲🇦 Morocco","🇭🇹 Haiti","C","Atlanta",["FS1"],"home","strong"),
      mkMatch(18,0,"🇧🇷 Brazil","🏴󠁧󠁢󠁳󠁣󠁴󠁿 Scotland","C","Los Angeles",["FOX"],"home","strong"),
    ],
    "Thu Jun 25": [
      mkMatch(15,0,"🇧🇦 Bosnia","🇶🇦 Qatar","B","Philadelphia",["FOX"],"home","strong"),
      mkMatch(15,0,"🇨🇭 Switzerland","🇨🇦 Canada","B","Vancouver",["FOX"],"even","slight"),
      mkMatch(18,0,"🇦🇺 Australia","🇵🇾 Paraguay","D","Seattle",["FS1"],"even","slight"),
      mkMatch(18,0,"🇹🇷 Türkiye","🇺🇸 USA","D","San Francisco",["FOX"],"away","slight"),
    ],
    "Fri Jun 26": [
      mkMatch(15,0,"🇪🇨 Ecuador","🇩🇪 Germany","E","Houston",["FOX"],"away","strong"),
      mkMatch(15,0,"🇨🇮 Ivory Coast","🇨🇼 Curaçao","E","Dallas",["FOX"],"home","strong"),
      mkMatch(18,0,"🇸🇪 Sweden","🇯🇵 Japan","F","Boston",["FS1"],"even","slight"),
      mkMatch(18,0,"🇹🇳 Tunisia","🇳🇱 Netherlands","F","Atlanta",["FS1"],"away","strong"),
    ],
    "Sat Jun 27": [
      mkMatch(15,0,"🇸🇦 Saudi Arabia","🇪🇸 Spain","H","Miami",["FOX"],"away","strong"),
      mkMatch(15,0,"🇨🇻 Cape Verde","🇺🇾 Uruguay","H","Kansas City",["FS1"],"away","strong"),
      mkMatch(18,0,"🇮🇷 Iran","🇧🇪 Belgium","G","New York/NJ",["FOX"],"away","strong"),
      mkMatch(18,0,"🇳🇿 New Zealand","🇪🇬 Egypt","G","Los Angeles",["FS1"],"away","slight"),
      mkMatch(19,0,"🇵🇦 Panama","🇬🇭 Ghana","L","Toronto",["FS1"],"away","slight"),
      mkMatch(21,0,"🏴󠁧󠁢󠁥󠁮󠁧󠁿 England","🇭🇷 Croatia","L","New York/NJ",["FOX"],"home","slight"),
    ],
  },
  "KNOCKOUT STAGE": {
    "Round of 32 (Jun 28–Jul 3)": [
      mkMatch(15,0,"TBD","TBD","R32","Various",["FOX","FS1"],null,null),
    ],
    "Round of 16 (Jul 4–7)": [
      mkMatch(15,0,"TBD","TBD","R16","Various",["FOX","FS1"],null,null),
    ],
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
    "3rd Place (Jul 18)": [
      mkMatch(15,0,"TBD","TBD","3P","Miami",["FOX"],null,null),
    ],
    "🏆 Final (Jul 19)": [
      mkMatch(15,0,"TBD","TBD","FIN","New York/NJ",["FOX"],null,null),
    ],
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

function FavBadge({ match }) {
  if (!match.favorite || match.favorite === "even") {
    return <div style={{ fontSize:"10px", color:"#6b8ab8", fontStyle:"italic", textAlign:"center", minWidth:70 }}>Even match</div>;
  }
  const isHome = match.favorite === "home";
  const raw = isHome ? match.home : match.away;
  const name = raw.replace(/^[\p{Emoji}\s]+/u, "").trim();
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

const TZ_LIST = ["ET","CT","MT","PT"];

export default function WorldCupSchedule() {
  const [activeStage, setActiveStage] = useState("GROUP STAGE");
  const [activeDay,   setActiveDay]   = useState(Object.keys(schedule["GROUP STAGE"])[0]);
  const [filterGroup, setFilterGroup] = useState("ALL");
  const [tz,          setTz]          = useState("ET");

  const stages = Object.keys(schedule);
  const days    = Object.keys(schedule[activeStage]);
  const matches = schedule[activeStage][activeDay] || [];
  const filtered = filterGroup === "ALL" ? matches : matches.filter(m => m.group === filterGroup);
  const allGroups = ["ALL","A","B","C","D","E","F","G","H","I","J","K","L"];

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

      {/* Stage Tabs */}
      <div style={{ display:"flex", borderBottom:"1px solid rgba(255,255,255,0.1)", background:"rgba(0,0,0,0.3)" }}>
        {stages.map(s => (
          <button key={s} onClick={() => { setActiveStage(s); setActiveDay(Object.keys(schedule[s])[0]); setFilterGroup("ALL"); }}
            style={{ flex:1, padding:"12px 4px", border:"none", background:"none", cursor:"pointer",
              fontSize:"11px", fontWeight:700, letterSpacing:"1px",
              color: activeStage===s ? "#e8c96a" : "#6b8ab8",
              borderBottom: activeStage===s ? "2px solid #e8c96a" : "2px solid transparent" }}>
            {s}
          </button>
        ))}
      </div>

      {/* Group Filter + TZ toggle on same row */}
      {activeStage === "GROUP STAGE" && (
        <div style={{ padding:"10px 16px 0", display:"flex", justifyContent:"space-between", alignItems:"flex-start", gap:8, flexWrap:"wrap" }}>
          <div style={{ display:"flex", gap:6, flexWrap:"wrap" }}>
            {allGroups.map(g => (
              <button key={g} onClick={() => setFilterGroup(g)}
                style={{ padding:"3px 9px", border:"1px solid",
                  borderColor: filterGroup===g ? (g==="ALL" ? "#e8c96a" : groupColors[g]) : "rgba(255,255,255,0.12)",
                  background: filterGroup===g ? (g==="ALL" ? "rgba(232,201,106,0.15)" : `${groupColors[g]}22`) : "transparent",
                  borderRadius:12, cursor:"pointer", fontSize:"11px", fontWeight:700,
                  color: filterGroup===g ? (g==="ALL" ? "#e8c96a" : groupColors[g]) : "#6b8ab8" }}>
                {g==="ALL" ? "ALL" : `GRP ${g}`}
              </button>
            ))}
          </div>

          {/* TZ Toggle */}
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
        </div>
      )}

      {/* TZ toggle for knockout stage too */}
      {activeStage !== "GROUP STAGE" && (
        <div style={{ padding:"10px 16px 0", display:"flex", justifyContent:"flex-end" }}>
          <div style={{ display:"flex", background:"rgba(0,0,0,0.3)", borderRadius:8, border:"1px solid rgba(255,255,255,0.1)", overflow:"hidden" }}>
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
        </div>
      )}

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
        {filtered.length === 0 && (
          <div style={{ textAlign:"center", padding:40, color:"#4a6a8a", fontSize:14 }}>
            No matches for Group {filterGroup} on this day
          </div>
        )}
        {filtered.map((m, i) => (
          <div key={i} style={{
            background:"rgba(255,255,255,0.04)", border:"1px solid rgba(255,255,255,0.08)",
            borderLeft:`3px solid ${groupColors[m.group]||"#e8c96a"}`,
            borderRadius:8, padding:"12px 14px", marginBottom:10,
          }}>
            {/* Row 1: group badge + teams + fav */}
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
              {m.favorite !== null && <FavBadge match={m} />}
              {m.favorite === null && <div style={{ minWidth:70, textAlign:"center", fontSize:"10px", color:"#4a6a8a" }}>TBD</div>}
            </div>

            {/* Row 2: time + broadcast chips */}
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
        ))}
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
    </div>
  );
}
