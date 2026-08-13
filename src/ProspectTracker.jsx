import React, { useState, useMemo, useEffect, useRef } from "react";

/* Colors & constants */
const INK = "#170E2B";
const CARD = "#241A3D";
const CARD_HOVER = "#2E2050";
const LINE = "#3B2C5E";
const GOLD = "#F1B62C";
const GOLD_DIM = "#8A6321";
const RUST = "#8E5FD9";
const TEXT = "#F3EFFB";
const TEXT_DIM = "#A79BC9";
const GREEN = "#5FB88A";
const LIGHT_PURPLE = "#B79CE0";

const TIERS = [
  { key: "unranked", label: "Unranked", color: TEXT_DIM, pct: 15 },
  { key: "sleeper", label: "Sleeper", color: LIGHT_PURPLE, pct: 40 },
  { key: "riser", label: "Riser", color: GOLD, pct: 65 },
  { key: "breakout", label: "Breakout", color: RUST, pct: 90 },
];

const POSITIONS = ["PG", "SG", "SF", "PF", "C"];

const POSITION_GROUPS = {
  PG: "Guards",
  SG: "Guards",
  SF: "Wings",
  PF: "Wings",
  C: "Bigs",
};
const GROUP_ORDER = ["Guards", "Wings", "Bigs"];

const ARCHETYPES = [
  "Playmaking guard",
  "Combo guard",
  "3-and-D wing",
  "Slashing scorer",
  "Point-of-attack defender",
  "Stretch big",
  "Rim protector",
  "Rebounding forward",
];

function posGroup(pos) {
  return POSITION_GROUPS[pos] || "Wings";
}

function Stars({ stars }) {
  if (!stars) return null;
  return (
    <span style={{ color: GOLD, letterSpacing: 1, fontSize: 12 }}>
      {"★".repeat(stars)}
      <span style={{ color: LINE }}>{"★".repeat(5 - stars)}</span>
    </span>
  );
}

const SEED = [
  {
    id: 1,
    name: "Marcus Whitfield",
    school: "Eastbrook HS",
    state: "OH",
    grad: 2027,
    pos: "PG",
    archetype: "Playmaking guard",
    height: "6'1\"",
    rank: 47,
    stars: 4,
    media: { state: true, national: false },
    social: { ig: "", x: "", hudl: "" },
    ppg: 18.4,
    rpg: 3.2,
    apg: 6.9,
    tier: "riser",
    watch: true,
    notes: "Elite change of pace, needs to add a reliable pull-up 3. Runs a AAU squad most scouts haven't seen play.",
  },
  {
    id: 2,
    name: "Devon Achebe",
    school: "Millbrook Christian",
    state: "GA",
    grad: 2026,
    pos: "C",
    archetype: "Rim protector",
    height: "6'9\"",
    rank: null,
    stars: 3,
    media: { state: false, national: false },
    social: { ig: "", x: "", hudl: "" },
    ppg: 12.1,
    rpg: 11.6,
    apg: 1.4,
    tier: "sleeper",
    watch: true,
    notes: "Vertical pop is legit, block numbers understate his rim impact. Small school, thin schedule.",
  },
  {
    id: 3,
    name: "Cole Ravenswood",
    school: "Piney Ridge HS",
    state: "NC",
    grad: 2027,
    pos: "SF",
    archetype: "3-and-D wing",
    height: "6'6\"",
    rank: null,
    stars: 2,
    media: { state: false, national: false },
    social: { ig: "", x: "", hudl: "" },
    ppg: 15.8,
    rpg: 6.1,
    apg: 2.8,
    tier: "unranked",
    watch: false,
    notes: "Frame still filling out. Catch-and-shoot 3 is ahead of schedule for his age.",
  },
  {
    id: 4,
    name: "Jaylen Ferro",
    school: "Southgate Prep",
    state: "TX",
    grad: 2026,
    pos: "SG",
    archetype: "Slashing scorer",
    height: "6'3\"",
    rank: 12,
    stars: 5,
    media: { state: true, national: true },
    social: { ig: "", x: "", hudl: "" },
    ppg: 21.7,
    rpg: 4.0,
    apg: 3.6,
    tier: "breakout",
    watch: true,
    notes: "Buzz building fast after a 34-point regional final. Expect offers to spike this month.",
  },
  {
    id: 5,
    name: "Isaiah Cho",
    school: "Northbridge Academy",
    state: "WA",
    grad: 2028,
    pos: "PF",
    archetype: "Point-of-attack defender",
    height: "6'7\"",
    rank: null,
    stars: 3,
    media: { state: false, national: false },
    social: { ig: "", x: "", hudl: "" },
    ppg: 9.9,
    rpg: 8.4,
    apg: 1.1,
    tier: "sleeper",
    watch: false,
    notes: "Freshman year, already the most switchable defender on the floor. One to check in on next season.",
  },
  {
    id: 6,
    name: "Omari Blackwood",
    school: "Eastbrook HS",
    state: "OH",
    grad: 2027,
    pos: "SG",
    archetype: "Combo guard",
    height: "6'4\"",
    rank: null,
    stars: 2,
    media: { state: false, national: false },
    social: { ig: "", x: "", hudl: "" },
    ppg: 14.2,
    rpg: 3.8,
    apg: 4.3,
    tier: "unranked",
    watch: false,
    notes: "Plays off Whitfield, so shot volume is low — worth watching him on the ball with a different lineup.",
  },
];

function tierMeta(key) {
  return TIERS.find((t) => t.key === key) || TIERS[0];
}

function Buzz({ tier }) {
  const t = tierMeta(tier);
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
      <div
        style={{
          flex: 1,
          height: 5,
          borderRadius: 3,
          background: LINE,
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            width: `${t.pct}%`,
            height: "100%",
            background: t.color,
            borderRadius: 3,
          }}
        />
      </div>
      <span
        style={{
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: 11,
          letterSpacing: 0.5,
          color: t.color,
          textTransform: "uppercase",
          whiteSpace: "nowrap",
        }}
      >
        {t.label}
      </span>
    </div>
  );
}

function StatBlock({ label, value }) {
  return (
    <div style={{ textAlign: "center" }}>
      <div
        style={{
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: 20,
          color: TEXT,
          fontWeight: 500,
        }}
      >
        {value}
      </div>
      <div
        style={{
          fontSize: 10,
          color: TEXT_DIM,
          letterSpacing: 0.8,
          textTransform: "uppercase",
          marginTop: 2,
        }}
      >
        {label}
      </div>
    </div>
  );
}

function MediaBadge({ label, active, onClick }) {
  return (
    <button
      onClick={onClick}
      style={{
        background: active ? "rgba(232,163,61,0.14)" : "transparent",
        border: `1px solid ${active ? GOLD : LINE}`,
        color: active ? GOLD : TEXT_DIM,
        borderRadius: 4,
        padding: "1px 7px",
        fontSize: 11,
        cursor: "pointer",
      }}
    >
      {label}
    </button>
  );
}

const SOCIAL_FIELDS = [
  { key: "ig", label: "Instagram" },
  { key: "x", label: "X / Twitter" },
  { key: "hudl", label: "Hudl" },
];

function ProspectCard({ p, onToggleWatch, onCycleTier, onNoteChange, onToggleMedia, onSocialChange }) {
  const [open, setOpen] = useState(false);
  const [linksOpen, setLinksOpen] = useState(false);
  const t = tierMeta(p.tier);
  const hasAnyLink = p.social && (p.social.ig || p.social.x || p.social.hudl);
  return (
    <div
      style={{
        background: CARD,
        border: `1px solid ${LINE}`,
        borderLeft: `3px solid ${t.color}`,
        borderRadius: 8,
        padding: "14px 16px",
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div>
          <div style={{ display: "flex", alignItems: "baseline", gap: 8, flexWrap: "wrap" }}>
            <span style={{ fontFamily: "'Oswald', sans-serif", fontSize: 18, color: TEXT, letterSpacing: 0.3 }}>
              {p.name}
            </span>
            <span
              style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: 11,
                color: INK,
                background: GOLD,
                borderRadius: 4,
                padding: "1px 6px",
                fontWeight: 600,
              }}
            >
              {p.pos}
            </span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 4 }}>
            <Stars stars={p.stars} />
            <span
              style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: 11,
                color: p.rank ? RUST : TEXT_DIM,
              }}
            >
              {p.rank ? `#${p.rank} national` : "Unranked"}
            </span>
          </div>
          <div style={{ fontSize: 12.5, color: TEXT_DIM, marginTop: 4 }}>
            {p.school} · {p.state} · Class of {p.grad} · {p.height}
          </div>
          <div style={{ display: "flex", gap: 6, marginTop: 6, flexWrap: "wrap" }}>
            <div
              style={{
                fontSize: 11,
                color: LIGHT_PURPLE,
                border: "1px solid #4A3B78",
                display: "inline-block",
                borderRadius: 4,
                padding: "1px 7px",
              }}
            >
              {p.archetype}
            </div>
            <MediaBadge label="State media" active={p.media?.state} onClick={() => onToggleMedia(p.id, "state")} />
            <MediaBadge label="National media" active={p.media?.national} onClick={() => onToggleMedia(p.id, "national")} />
          </div>
        </div>
        <button
          onClick={() => onToggleWatch(p.id)}
          title={p.watch ? "Remove from watchlist" : "Add to watchlist"}
          style={{
            background: "transparent",
            border: `1px solid ${p.watch ? GOLD : LINE}`,
            color: p.watch ? GOLD : TEXT_DIM,
            borderRadius: 6,
            width: 30,
            height: 30,
            fontSize: 15,
            cursor: "pointer",
            flexShrink: 0,
          }}
        >
          {p.watch ? "★" : "☆"}
        </button>
      </div>

      <div style={{ display: "flex", gap: 22, margin: "14px 0" }}>
        <StatBlock label="PPG" value={p.ppg.toFixed(1)} />
        <StatBlock label="RPG" value={p.rpg.toFixed(1)} />
        <StatBlock label="APG" value={p.apg.toFixed(1)} />
      </div>

      <div style={{ marginBottom: 10 }}>
        <Buzz tier={p.tier} />
      </div>

      {hasAnyLink && (
        <div style={{ display: "flex", gap: 8, marginBottom: 10, flexWrap: "wrap" }}>
          {SOCIAL_FIELDS.filter((f) => p.social[f.key]).map((f) => (
            <a
              key={f.key}
              href={p.social[f.key]}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                fontSize: 11,
                color: GREEN,
                border: "1px solid #2E5A45",
                borderRadius: 4,
                padding: "2px 8px",
                textDecoration: "none",
              }}
            >
              {f.label} ↗
            </a>
          ))}
        </div>
      )}

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <button
          onClick={() => onCycleTier(p.id)}
          style={{
            background: "transparent",
            border: `1px solid ${LINE}`,
            color: TEXT_DIM,
            borderRadius: 6,
            padding: "5px 10px",
            fontSize: 11.5,
            cursor: "pointer",
          }}
        >
          Bump buzz
        </button>
        <div style={{ display: "flex", gap: 12 }}>
          <button
            onClick={() => setLinksOpen(!linksOpen)}
            style={{
              background: "transparent",
              border: "none",
              color: TEXT_DIM,
              fontSize: 12,
              cursor: "pointer",
              textDecoration: "underline",
            }}
          >
            {linksOpen ? "Hide links" : "Links"}
          </button>
          <button
            onClick={() => setOpen(!open)}
            style={{
              background: "transparent",
              border: "none",
              color: TEXT_DIM,
              fontSize: 12,
              cursor: "pointer",
              textDecoration: "underline",
            }}
          >
            {open ? "Hide notes" : "Notes"}
          </button>
        </div>
      </div>

      {linksOpen && (
        <div style={{ marginTop: 10, display: "flex", flexDirection: "column", gap: 6 }}>
          {SOCIAL_FIELDS.map((f) => (
            <input
              key={f.key}
              value={p.social[f.key]}
              onChange={(e) => onSocialChange(p.id, f.key, e.target.value)}
              placeholder={`${f.label} URL`}
              style={{
                width: "100%",
                background: INK,
                border: `1px solid ${LINE}`,
                borderRadius: 6,
                color: TEXT,
                fontSize: 12.5,
                padding: "7px 8px",
                fontFamily: "inherit",
                boxSizing: "border-box",
              }}
            />
          ))}
        </div>
      )}

      {open && (
        <textarea
          value={p.notes}
          onChange={(e) => onNoteChange(p.id, e.target.value)}
          rows={3}
          style={{
            width: "100%",
            marginTop: 10,
            background: INK,
            border: `1px solid ${LINE}`,
            borderRadius: 6,
            color: TEXT,
            fontSize: 12.5,
            padding: 8,
            resize: "vertical",
            fontFamily: "inherit",
            boxSizing: "border-box",
          }}
        />
      )}
    </div>
  );
}

const ACCESS_CODE = "bisons";

function AccessGate({ onUnlock }) {
  const [value, setValue] = useState("");
  const [error, setError] = useState(false);

  const submit = () => {
    if (value.trim().toLowerCase() === ACCESS_CODE) {
      try {
        localStorage.setItem("lipscomb-recruiting-unlocked", "1");
      } catch (e) {}
      onUnlock();
    } else {
      setError(true);
    }
  };

  return (
    <div
      style={{
        background: INK,
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "'Inter', sans-serif",
        color: TEXT,
        padding: 20,
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Oswald:wght@500;600&family=Inter:wght@400;500;600&display=swap');
      `}</style>
      <div
        style={{
          background: CARD,
          border: `1px solid ${LINE}`,
          borderRadius: 10,
          padding: "32px 28px",
          width: 320,
          textAlign: "center",
        }}
      >
        <div style={{ fontSize: 11, letterSpacing: 2, color: GOLD, textTransform: "uppercase", marginBottom: 6 }}>
          Access required
        </div>
        <h1 style={{ fontFamily: "'Oswald', sans-serif", fontSize: 22, margin: "0 0 18px", fontWeight: 600 }}>
          Lipscomb Recruiting
        </h1>
        <input
          type="password"
          value={value}
          onChange={(e) => {
            setValue(e.target.value);
            setError(false);
          }}
          onKeyDown={(e) => e.key === "Enter" && submit()}
          placeholder="Access code"
          style={{
            width: "100%",
            background: INK,
            border: `1px solid ${error ? RUST : LINE}`,
            borderRadius: 6,
            color: TEXT,
            fontSize: 14,
            padding: "10px 12px",
            boxSizing: "border-box",
            textAlign: "center",
            marginBottom: 12,
          }}
        />
        {error && (
          <div style={{ color: RUST, fontSize: 12, marginBottom: 12 }}>
            That code isn't right — try again.
          </div>
        )}
        <button
          onClick={submit}
          style={{
            width: "100%",
            background: GOLD,
            color: INK,
            border: "none",
            borderRadius: 6,
            padding: "10px 0",
            fontSize: 13,
            fontWeight: 600,
            cursor: "pointer",
          }}
        >
          Enter
        </button>
      </div>
    </div>
  );
}

/* ---------- URL encode/decode helpers ---------- */

function safeB64Encode(obj) {
  try {
    const str = JSON.stringify(obj);
    return btoa(unescape(encodeURIComponent(str)));
  } catch (e) {
    return encodeURIComponent(JSON.stringify(obj));
  }
}
function safeB64Decode(s) {
  try {
    const json = decodeURIComponent(escape(atob(s)));
    return JSON.parse(json);
  } catch (e) {
    return JSON.parse(decodeURIComponent(s));
  }
}

/* ---------- Main component ---------- */

export default function ProspectTracker() {
  const [unlocked, setUnlocked] = useState(() => {
    try {
      return localStorage.getItem("lipscomb-recruiting-unlocked") === "1";
    } catch (e) {
      return false;
    }
  });

  const [players, setPlayers] = useState(SEED);
  const [posFilter, setPosFilter] = useState("ALL");
  const [archFilter, setArchFilter] = useState("ALL");
  const [starFilter, setStarFilter] = useState("ALL");
  const [mediaOnly, setMediaOnly] = useState(false);
  const [watchOnly, setWatchOnly] = useState(false);
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("buzz");
  const [groupByPos, setGroupByPos] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    name: "",
    school: "",
    state: "",
    grad: "2027",
    pos: "PG",
    archetype: ARCHETYPES[0],
    stars: "3",
    rank: "",
    ppg: "",
    rpg: "",
    apg: "",
  });

  const [copied, setCopied] = useState(false);
  const copiedTimerRef = useRef(null);
  const initializingRef = useRef(true);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const data = params.get("data");
    if (data) {
      try {
        const parsed = safeB64Decode(data);
        if (parsed.players) setPlayers(parsed.players);
        if (parsed.posFilter) setPosFilter(parsed.posFilter);
        if (parsed.archFilter) setArchFilter(parsed.archFilter);
        if (parsed.starFilter) setStarFilter(parsed.starFilter);
        if (typeof parsed.mediaOnly === "boolean") setMediaOnly(parsed.mediaOnly);
        if (typeof parsed.watchOnly === "boolean") setWatchOnly(parsed.watchOnly);
        if (parsed.search) setSearch(parsed.search);
        if (parsed.sortBy) setSortBy(parsed.sortBy);
        if (typeof parsed.groupByPos === "boolean") setGroupByPos(parsed.groupByPos);
      } catch (e) {
        console.warn("Unable to parse shared data:", e);
      }
    }
    initializingRef.current = false;
    return () => {
      if (copiedTimerRef.current) clearTimeout(copiedTimerRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (initializingRef.current) return;
    try {
      const payload = {
        players,
        posFilter,
        archFilter,
        starFilter,
        mediaOnly,
        watchOnly,
        search,
        sortBy,
        groupByPos,
      };
      const encoded = safeB64Encode(payload);
      const params = new URLSearchParams(window.location.search);
      params.set("data", encoded);
      const newUrl = `${window.location.pathname}?${params.toString()}`;
      window.history.replaceState({}, "", newUrl);
    } catch (e) {
      console.warn("Failed to sync URL:", e);
    }
  }, [players, posFilter, archFilter, starFilter, mediaOnly, watchOnly, search, sortBy, groupByPos]);

  const toggleWatch = (id) =>
    setPlayers((prev) => prev.map((p) => (p.id === id ? { ...p, watch: !p.watch } : p)));

  const cycleTier = (id) =>
    setPlayers((prev) =>
      prev.map((p) => {
        if (p.id !== id) return p;
        const idx = TIERS.findIndex((t) => t.key === p.tier);
        const next = TIERS[(idx + 1) % TIERS.length];
        return { ...p, tier: next.key };
      })
    );

  const noteChange = (id, notes) =>
    setPlayers((prev) => prev.map((p) => (p.id === id ? { ...p, notes } : p)));

  const toggleMedia = (id, key) =>
    setPlayers((prev) =>
      prev.map((p) => (p.id === id ? { ...p, media: { ...p.media, [key]: !p.media?.[key] } } : p))
    );

  const socialChange = (id, key, value) =>
    setPlayers((prev) =>
      prev.map((p) => (p.id === id ? { ...p, social: { ...p.social, [key]: value } } : p))
    );

  const addPlayer = () => {
    if (!form.name.trim() || !form.school.trim()) return;
    setPlayers((prev) => [
      {
        id: Date.now(),
        name: form.name.trim(),
        school: form.school.trim(),
        state: form.state.trim().toUpperCase() || "—",
        grad: Number(form.grad) || 2027,
        pos: form.pos,
        archetype: form.archetype,
        height: "—",
        stars: Number(form.stars) || 3,
        rank: form.rank.trim() ? Number(form.rank) : null,
        media: { state: false, national: false },
        social: { ig: "", x: "", hudl: "" },
        ppg: Number(form.ppg) || 0,
        rpg: Number(form.rpg) || 0,
        apg: Number(form.apg) || 0,
        tier: "unranked",
        watch: false,
        notes: "",
      },
      ...prev,
    ]);
    setForm({ name: "", school: "", state: "", grad: "2027", pos: "PG", archetype: ARCHETYPES[0], stars: "3", rank: "", ppg: "", rpg: "", apg: "" });
    setShowForm(false);
  };

  const filtered = useMemo(() => {
    let list = players.filter((p) => {
      if (posFilter !== "ALL" && p.pos !== posFilter) return false;
      if (archFilter !== "ALL" && p.archetype !== archFilter) return false;
      if (starFilter !== "ALL" && p.stars !== Number(starFilter)) return false;
      if (mediaOnly && !(p.media?.state || p.media?.national)) return false;
      if (watchOnly && !p.watch) return false;
      if (search.trim()) {
        const q = search.toLowerCase();
        if (!p.name.toLowerCase().includes(q) && !p.school.toLowerCase().includes(q)) return false;
      }
      return true;
    });
    list.sort((a, b) => {
      if (sortBy === "buzz") {
        return tierMeta(b.tier).pct - tierMeta(a.tier).pct;
      }
      if (sortBy === "rank") {
        if (a.rank == null && b.rank == null) return b.stars - a.stars;
        if (a.rank == null) return 1;
        if (b.rank == null) return -1;
        return a.rank - b.rank;
      }
      if (sortBy === "stars") return b.stars - a.stars;
      if (sortBy === "ppg") return b.ppg - a.ppg;
      if (sortBy === "grad") return a.grad - b.grad;
      return a.name.localeCompare(b.name);
    });
    return list;
  }, [players, posFilter, archFilter, starFilter, mediaOnly, watchOnly, search, sortBy]);

  const grouped = useMemo(() => {
    const map = { Guards: [], Wings: [], Bigs: [] };
    filtered.forEach((p) => map[posGroup(p.pos)].push(p));
    return map;
  }, [filtered]);

  const watchCount = players.filter((p) => p.watch).length;
  const breakoutCount = players.filter((p) => p.tier === "breakout" || p.tier === "riser").length;
  const mediaCount = players.filter((p) => p.media?.state || p.media?.national).length;

  const selectStyle = {
    background: CARD,
    border: `1px solid ${LINE}`,
    color: TEXT,
    borderRadius: 6,
    padding: "7px 10px",
    fontSize: 13,
    fontFamily: "inherit",
  };

  const inputStyle = { ...selectStyle, width: "100%", boxSizing: "border-box" };

  const share = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      if (copiedTimerRef.current) clearTimeout(copiedTimerRef.current);
      copiedTimerRef.current = setTimeout(() => setCopied(false), 2200);
    } catch (e) {
      window.prompt("Copy this URL to share the board:", window.location.href);
    }
  };

  if (!unlocked) {
    return <AccessGate onUnlock={() => setUnlocked(true)} />;
  }

  return (
    <div
      style={{
        background: INK,
        minHeight: "100vh",
        padding: "28px 24px 60px",
        fontFamily: "'Inter', sans-serif",
        color: TEXT,
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Oswald:wght@500;600&family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@400;500;600&display=swap');
        ::placeholder { color: ${TEXT_DIM}; opacity: 1; }
        button:hover { filter: brightness(1.15); }
      `}</style>

      <div style={{ maxWidth: 960, margin: "0 auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 22 }}>
          <div>
            <div style={{ fontSize: 11, letterSpacing: 2, color: GOLD, textTransform: "uppercase", marginBottom: 4 }}>
              Recruiting big board
            </div>
            <h1 style={{ fontFamily: "'Oswald', sans-serif", fontSize: 30, margin: 0, fontWeight: 600, letterSpacing: 0.3 }}>
              Lipscomb Recruiting
            </h1>
          </div>
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <button
              onClick={() => setShowForm(!showForm)}
              style={{
                background: GOLD,
                color: INK,
                border: "none",
                borderRadius: 6,
                padding: "10px 16px",
                fontSize: 13,
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              {showForm ? "Close" : "+ Add prospect"}
            </button>
            <button
              onClick={share}
              title="Copy shareable URL"
              style={{
                background: "transparent",
                border: `1px solid ${LINE}`,
                color: TEXT_DIM,
                borderRadius: 6,
                padding: "8px 12px",
                fontSize: 13,
                cursor: "pointer",
              }}
            >
              {copied ? "Copied!" : "Share"}
            </button>
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12, marginBottom: 22 }}>
          <div style={{ background: CARD, border: `1px solid ${LINE}`, borderRadius: 8, padding: "14px 16px" }}>
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 24, color: TEXT }}>{players.length}</div>
            <div style={{ fontSize: 11, color: TEXT_DIM, textTransform: "uppercase", letterSpacing: 0.6 }}>Tracked</div>
          </div>
          <div style={{ background: CARD, border: `1px solid ${LINE}`, borderRadius: 8, padding: "14px 16px" }}>
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 24, color: GOLD }}>{watchCount}</div>
            <div style={{ fontSize: 11, color: TEXT_DIM, textTransform: "uppercase", letterSpacing: 0.6 }}>Watchlisted</div>
          </div>
          <div style={{ background: CARD, border: `1px solid ${LINE}`, borderRadius: 8, padding: "14px 16px" }}>
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 24, color: RUST }}>{breakoutCount}</div>
            <div style={{ fontSize: 11, color: TEXT_DIM, textTransform: "uppercase", letterSpacing: 0.6 }}>Rising / breakout</div>
          </div>
          <div style={{ background: CARD, border: `1px solid ${LINE}`, borderRadius: 8, padding: "14px 16px" }}>
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 24, color: LIGHT_PURPLE }}>{mediaCount}</div>
            <div style={{ fontSize: 11, color: TEXT_DIM, textTransform: "uppercase", letterSpacing: 0.6 }}>In the media</div>
          </div>
        </div>

        {showForm && (
          <div
            style={{
              background: CARD,
              border: `1px solid ${LINE}`,
              borderRadius: 8,
              padding: 16,
              marginBottom: 22,
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 10,
            }}
          >
            <input style={inputStyle} placeholder="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            <input style={inputStyle} placeholder="School" value={form.school} onChange={(e) => setForm({ ...form, school: e.target.value })} />
            <input style={inputStyle} placeholder="State (e.g. OH)" value={form.state} onChange={(e) => setForm({ ...form, state: e.target.value })} />
            <input style={inputStyle} placeholder="Grad year" value={form.grad} onChange={(e) => setForm({ ...form, grad: e.target.value })} />
            <select style={selectStyle} value={form.pos} onChange={(e) => setForm({ ...form, pos: e.target.value })}>
              {POSITIONS.map((p) => (
                <option key={p} value={p}>{p}</option>
              ))}
            </select>
            <select style={selectStyle} value={form.archetype} onChange={(e) => setForm({ ...form, archetype: e.target.value })}>
              {ARCHETYPES.map((a) => (
                <option key={a} value={a}>{a}</option>
              ))}
            </select>
            <select style={selectStyle} value={form.stars} onChange={(e) => setForm({ ...form, stars: e.target.value })}>
              <option value="2">2 star</option>
              <option value="3">3 star</option>
              <option value="4">4 star</option>
              <option value="5">5 star</option>
            </select>
            <input style={inputStyle} placeholder="National rank (leave blank if unranked)" value={form.rank} onChange={(e) => setForm({ ...form, rank: e.target.value })} />
            <div style={{ display: "flex", gap: 8 }}>
              <input style={inputStyle} placeholder="PPG" value={form.ppg} onChange={(e) => setForm({ ...form, ppg: e.target.value })} />
              <input style={inputStyle} placeholder="RPG" value={form.rpg} onChange={(e) => setForm({ ...form, rpg: e.target.value })} />
              <input style={inputStyle} placeholder="APG" value={form.apg} onChange={(e) => setForm({ ...form, apg: e.target.value })} />
            </div>
            <button
              onClick={addPlayer}
              style={{
                gridColumn: "1 / -1",
                background: GOLD,
                color: INK,
                border: "none",
                borderRadius: 6,
                padding: "9px 0",
                fontSize: 13,
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              Save prospect
            </button>
          </div>
        )}

        <div style={{ display: "flex", flexWrap: "wrap", gap: 10, marginBottom: 18, alignItems: "center" }}>
          <input
            style={{ ...selectStyle, width: 180 }}
            placeholder="Search name or school"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <select style={selectStyle} value={posFilter} onChange={(e) => setPosFilter(e.target.value)}>
            <option value="ALL">All positions</option>
            {POSITIONS.map((p) => (
              <option key={p} value={p}>{p}</option>
            ))}
          </select>
          <select style={selectStyle} value={archFilter} onChange={(e) => setArchFilter(e.target.value)}>
            <option value="ALL">All archetypes</option>
            {ARCHETYPES.map((a) => (
              <option key={a} value={a}>{a}</option>
            ))}
          </select>
          <select style={selectStyle} value={starFilter} onChange={(e) => setStarFilter(e.target.value)}>
            <option value="ALL">All star ratings</option>
            <option value="5">5 star</option>
            <option value="4">4 star</option>
            <option value="3">3 star</option>
            <option value="2">2 star</option>
          </select>
          <select style={selectStyle} value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
            <option value="buzz">Sort: buzz</option>
            <option value="rank">Sort: national rank</option>
            <option value="stars">Sort: star rating</option>
            <option value="ppg">Sort: PPG</option>
            <option value="grad">Sort: grad year</option>
            <option value="name">Sort: name</option>
          </select>
          <button
            onClick={() => setWatchOnly(!watchOnly)}
            style={{
              background: watchOnly ? GOLD : "transparent",
              color: watchOnly ? INK : TEXT_DIM,
              border: `1px solid ${watchOnly ? GOLD : LINE}`,
              borderRadius: 6,
              padding: "7px 12px",
              fontSize: 13,
              cursor: "pointer",
            }}
          >
            ★ Watchlist only
          </button>
          <button
            onClick={() => setMediaOnly(!mediaOnly)}
            style={{
              background: mediaOnly ? GOLD : "transparent",
              color: mediaOnly ? INK : TEXT_DIM,
              border: `1px solid ${mediaOnly ? GOLD : LINE}`,
              borderRadius: 6,
              padding: "7px 12px",
              fontSize: 13,
              cursor: "pointer",
            }}
          >
            In the media
          </button>
          <button
            onClick={() => setGroupByPos(!groupByPos)}
            style={{
              background: groupByPos ? GOLD : "transparent",
              color: groupByPos ? INK : TEXT_DIM,
              border: `1px solid ${groupByPos ? GOLD : LINE}`,
              borderRadius: 6,
              padding: "7px 12px",
              fontSize: 13,
              cursor: "pointer",
            }}
          >
            Group by position
          </button>
        </div>

        {filtered.length === 0 ? (
          <div style={{ color: TEXT_DIM, fontSize: 14, padding: "30px 0", textAlign: "center" }}>
            No prospects match those filters.
          </div>
        ) : groupByPos ? (
          <div>
            {GROUP_ORDER.filter((g) => grouped[g].length > 0).map((g) => (
              <div key={g} style={{ marginBottom: 26 }}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "baseline",
                    gap: 10,
                    marginBottom: 12,
                    borderBottom: `1px solid ${LINE}`,
                    paddingBottom: 8,
                  }}
                >
                  <span style={{ fontFamily: "'Oswald', sans-serif", fontSize: 16, letterSpacing: 0.5, color: TEXT }}>
                    {g}
                  </span>
                  <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 12, color: TEXT_DIM }}>
                    {grouped[g].length}
                  </span>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 14 }}>
                  {grouped[g].map((p) => (
                    <ProspectCard key={p.id} p={p} onToggleWatch={toggleWatch} onCycleTier={cycleTier} onNoteChange={noteChange} onToggleMedia={toggleMedia} onSocialChange={socialChange} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 14 }}>
            {filtered.map((p) => (
              <ProspectCard key={p.id} p={p} onToggleWatch={toggleWatch} onCycleTier={cycleTier} onNoteChange={noteChange} onToggleMedia={toggleMedia} onSocialChange={socialChange} />
            ))}
          </div>
        )}

        <div style={{ marginTop: 26, fontSize: 11.5, color: TEXT_DIM, lineHeight: 1.6 }}>
          Sample data only — names and stats are illustrative, not real players. Swap in your own board and stats as you scout.
        </div>
      </div>
    </div>
  );
}
