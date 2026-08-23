import { useState, useEffect, useRef, useContext, createContext } from "react";
import { db } from "./db.js";

const DEFAULT_THEME = {
  navy: "#1C2B3A",
  navy2: "#243A4F",
  canvas: "#F1ECDE",
  canvas2: "#E8E0CB",
  amber: "#E1982F",
  amberDark: "#B9761D",
  rust: "#BD5433",
  pine: "#3E5642",
  line: "#c9bfa2",
  ink: "#20241f",
  headingFont: "Oswald",
  bodyFont: "Karla",
};

const DEFAULT_BRANDING = {
  logo: "",
  siteName: "Triad Dads",
  tagline: "Piedmont Triad, NC",
};

const FONT_HEADING_OPTIONS = [
  { label: "Oswald (default)", value: "Oswald", google: "Oswald:wght@500;600;700" },
  { label: "Bebas Neue", value: "Bebas Neue", google: "Bebas+Neue" },
  { label: "Anton", value: "Anton", google: "Anton" },
  { label: "Archivo Black", value: "Archivo Black", google: "Archivo+Black" },
  { label: "Poppins", value: "Poppins", google: "Poppins:wght@600;700" },
  { label: "Playfair Display", value: "Playfair Display", google: "Playfair+Display:wght@700;800" },
];

const FONT_BODY_OPTIONS = [
  { label: "Karla (default)", value: "Karla", google: "Karla:ital,wght@0,400;0,500;0,600;0,700;1,400" },
  { label: "Inter", value: "Inter", google: "Inter:wght@400;500;600;700" },
  { label: "Lato", value: "Lato", google: "Lato:wght@400;700" },
  { label: "Source Sans 3", value: "Source Sans 3", google: "Source+Sans+3:wght@400;600;700" },
  { label: "Nunito Sans", value: "Nunito Sans", google: "Nunito+Sans:wght@400;600;700" },
];

const ThemeContext = createContext(DEFAULT_THEME);

// Change this before you deploy the site publicly — see README.md.
const ADMIN_PASSCODE = "#C0wb0ysnumber1984";

const DEFAULT_CITIES = [
  { slug: "greensboro", name: "Greensboro", blurb: "The biggest playground in the Triad — greenways, a science museum built for rainy days, and a downtown that finally has somewhere decent to eat after the game." },
  { slug: "winston-salem", name: "Winston-Salem", blurb: "Arts-district energy with a serious outdoor streak. Reynolda Gardens, the Innovation Quarter, and more trailheads than you'll get to in a summer." },
  { slug: "high-point", name: "High Point", blurb: "Furniture Market crowds twice a year, quiet neighborhood parks the other fifty weeks, and a youth sports scene that takes rec league seriously." },
  { slug: "burlington", name: "Burlington", blurb: "Halfway between everywhere, with an outlet mall for gear runs and a city park system that punches above its size." },
  { slug: "kernersville", name: "Kernersville", blurb: "Small-town pace with a big splash pad, a walkable downtown, and the shortest commute to everywhere else in the Triad." },
  { slug: "lexington-davidson", name: "Lexington & Davidson County", blurb: "Barbecue-capital pride, Boone's Cave and Denton FarmPark for weekend adventures, and small-town Friday night lights that still mean something." },
  { slug: "clemmons-lewisville", name: "Clemmons & Lewisville", blurb: "Quiet, fast-growing suburbs just west of Winston-Salem — greenway access, top-rated schools, and a lake five minutes away when the backyard isn't cutting it." },
];

const DEFAULT_ARTICLES = [
  {
    id: "a1",
    title: "10 Triad Trails You Can Hike Before Nap Time Ends",
    category: "Outdoors",
    city: "greensboro",
    date: "2026-08-18",
    excerpt: "Stroller-friendly loops, creek scrambles for the bold ones, and exactly where to find shade when the August sun isn't playing fair.",
    body: "Stroller-friendly loops, creek scrambles for the bold ones, and exactly where to find shade when the August sun isn't playing fair. Bur-Mil Park's Owl's Roost Loop is the safe bet for anyone under five — flat, shaded, and back at the truck in forty-five minutes flat.",
    image: "",
  },
  {
    id: "a2",
    title: "The Weeknight Grill Rotation That Keeps Everyone Fed",
    category: "Grilling",
    city: "winston-salem",
    date: "2026-08-12",
    excerpt: "Five go-to cookouts that survive a picky 6-year-old, a hungry teenager, and a grill you fire up more nights than not.",
    body: "Five go-to cookouts that survive a picky 6-year-old, a hungry teenager, and a grill you fire up more nights than not. Rule one: always double the chicken. Rule two: the sides cook while you're still deciding on the marinade.",
    image: "",
  },
  {
    id: "a3",
    title: "Lexington Barbecue: A Dad's Honest Ranking",
    category: "Food",
    city: "lexington-davidson",
    date: "2026-08-20",
    excerpt: "Four generations of pitmasters, one very opinionated ranking, and the one spot worth the extra fifteen minutes in the car.",
    body: "Four generations of pitmasters, one very opinionated ranking, and the one spot worth the extra fifteen minutes in the car. Lexington-style chopped with the red slaw isn't just a lunch order here — it's a small-town identity, and the kids will be arguing about it before they can drive.",
    image: "",
  },
  {
    id: "a4",
    title: "We Tested 6 Backpack Coolers So You Don't Have To",
    category: "Gear",
    city: "high-point",
    date: "2026-08-05",
    excerpt: "From sideline soccer games to Sunday lake trips — the ones worth the money and the two we sent back.",
    body: "From sideline soccer games to Sunday lake trips — the ones worth the money and the two we sent back. The $60 mid-tier pack held ice for nine hours in ninety-degree heat, which is the only number that actually matters.",
    image: "",
  },
  {
    id: "a5",
    title: "Tanglewood Park: The Clemmons Backyard Every Dad Ends Up At",
    category: "Outdoors",
    city: "clemmons-lewisville",
    date: "2026-08-21",
    excerpt: "Paddleboats, the steam engine, and a golf course you can actually afford — why Tanglewood earns the weekend trip every single time.",
    body: "Paddleboats, the steam engine, and a golf course you can actually afford — why Tanglewood earns the weekend trip every single time. Get there before 10am on a Saturday or you'll be parking on the grass, but the arboretum trail is worth the walk from the overflow lot either way.",
    image: "",
  },
];

const DEFAULT_EVENTS = [
  { id: "e1", title: "Davidson County Farmers Market — Saturday Morning Run", date: "2026-08-29", city: "lexington-davidson", location: "Uptown Lexington", description: "Produce, kettle corn, and enough space for the stroller to actually move." },
  { id: "e2", title: "Kernersville Splash Pad Family Night", date: "2026-08-27", city: "kernersville", location: "Fourth of July Park", description: "Free, first-come, and the shady picnic tables fill up fast after 6pm." },
  { id: "e3", title: "Greensboro Science Center — After Hours", date: "2026-09-04", city: "greensboro", location: "Greensboro Science Center", description: "Fewer crowds, same dinosaur exhibit your kid won't stop talking about." },
  { id: "e4", title: "Tanglewood Park Family Paddle Morning", date: "2026-08-30", city: "clemmons-lewisville", location: "Tanglewood Park, Clemmons", description: "Paddleboat rentals open early before the lake gets crowded — bring the life vests." },
];

const DEFAULT_ABOUT = {
  name: "The Triad Dads Team",
  bio: "We're local dads writing the guide we wished existed — honest, no-fluff advice on weekends, gear, and everything in between across the Piedmont Triad. Update this bio anytime from the Admin panel.",
  photo: "",
};

const DEFAULT_SOCIAL = [
  { id: "s1", platform: "Facebook", url: "#" },
  { id: "s2", platform: "Instagram", url: "#" },
  { id: "s3", platform: "Pinterest", url: "#" },
];

function fmtDate(iso) {
  const d = new Date(iso + "T00:00:00");
  return d.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
}

function Icon({ name, size = 20, color = DEFAULT_THEME.amber, strokeWidth = 1.8 }) {
  const paths = {
    outdoors: <><path d="M12 21s-7-4.35-7-10a7 7 0 0114 0c0 5.65-7 10-7 10z"/><circle cx="12" cy="11" r="2.5"/></>,
    grill: <><circle cx="12" cy="14" r="7"/><path d="M12 3v4M8 3v2M16 3v2"/></>,
    gear: <><rect x="4" y="8" width="16" height="12" rx="1"/><path d="M8 8V6a4 4 0 018 0v2"/></>,
    coach: <><circle cx="12" cy="12" r="9"/><path d="M9 9l6 6M15 9l-6 6"/></>,
    events: <><rect x="3" y="4" width="18" height="16" rx="2"/><path d="M3 9h18M8 4v4M16 4v4"/></>,
    city: <><path d="M20 8v8a2 2 0 01-2 2H6a2 2 0 01-2-2V8M2 8l10-6 10 6M9 21v-6h6v6"/></>,
    search: <><circle cx="11" cy="11" r="7"/><path d="M21 21l-4.3-4.3"/></>,
    lock: <><rect x="5" y="11" width="14" height="9" rx="2"/><path d="M8 11V7a4 4 0 018 0v4"/></>,
    pencil: <><path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 013 3L7 19l-4 1 1-4z"/></>,
    trash: <><path d="M3 6h18M8 6V4h8v2M6 6l1 14h10l1-14"/></>,
    plus: <><path d="M12 5v14M5 12h14"/></>,
    image: <><rect x="3" y="4" width="18" height="16" rx="2"/><circle cx="9" cy="10" r="1.6"/><path d="M21 16l-6-5-4 4-3-2-5 4"/></>,
    chat: <><path d="M4 5h16v11H8l-4 4z"/></>,
    facebook: <><path d="M14 9h3V6h-3a3 3 0 00-3 3v2H8v3h3v6h3v-6h3l1-3h-4v-2a1 1 0 011-1z"/></>,
    instagram: <><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1"/></>,
    pinterest: <><circle cx="12" cy="12" r="9"/><path d="M9 17c1-3 1.5-5.5 1.5-7a2.5 2.5 0 015 0c0 2-1 3.5-2 4.5"/></>,
    tiktok: <><path d="M14 3v11.5a3.5 3.5 0 11-3.5-3.5c.35 0 .68.05 1 .14V7.7a6 6 0 105 5.9V8.5a5 5 0 003.5 1.4V6.8A3.5 3.5 0 0116 3z"/></>,
    youtube: <><rect x="3" y="6" width="18" height="12" rx="3"/><path d="M11 9.5l4 2.5-4 2.5z" fill={color}/></>,
    x: <><path d="M5 5l14 14M19 5L5 19"/></>,
    globe: <><circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3a14 14 0 010 18M12 3a14 14 0 000 18"/></>,
  };
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
      {paths[name] || null}
    </svg>
  );
}

export default function TriadDads() {
  const [data, setData] = useState(null);
  const [loaded, setLoaded] = useState(false);
  const [loadError, setLoadError] = useState("");
  const [view, setView] = useState({ page: "home" });
  const [authed, setAuthed] = useState(false);
  const [passInput, setPassInput] = useState("");
  const [authError, setAuthError] = useState("");
  const [saveNote, setSaveNote] = useState("");
  const saveTimer = useRef(null);

  useEffect(() => {
    (async () => {
      try {
        const res = await db.get("triad-dads-content");
        const parsed = res && res.value ? JSON.parse(res.value) : {};
        setData({
          cities: parsed.cities || DEFAULT_CITIES,
          articles: parsed.articles || DEFAULT_ARTICLES,
          events: parsed.events || DEFAULT_EVENTS,
          about: parsed.about || DEFAULT_ABOUT,
          social: parsed.social || DEFAULT_SOCIAL,
          theme: { ...DEFAULT_THEME, ...(parsed.theme || {}) },
          branding: { ...DEFAULT_BRANDING, ...(parsed.branding || {}) },
        });
      } catch (e) {
        setLoadError(e.message || "Couldn't load site content.");
        setData({
          cities: DEFAULT_CITIES,
          articles: DEFAULT_ARTICLES,
          events: DEFAULT_EVENTS,
          about: DEFAULT_ABOUT,
          social: DEFAULT_SOCIAL,
          theme: DEFAULT_THEME,
          branding: DEFAULT_BRANDING,
        });
      } finally {
        setLoaded(true);
      }
    })();
  }, []);

  async function persist(next) {
    setData(next);
    try {
      await db.set("triad-dads-content", JSON.stringify(next));
      setSaveNote("Saved");
    } catch (e) {
      setSaveNote(e.message || "Save failed — try again");
    }
    if (saveTimer.current) clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => setSaveNote(""), 2500);
  }

  if (!loaded || !data) {
    return (
      <div style={{ minHeight: "100vh", background: DEFAULT_THEME.canvas, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "Georgia, serif", color: DEFAULT_THEME.navy }}>
        Loading Triad Dads…
      </div>
    );
  }

  const theme = data.theme;
  const sortedArticles = [...data.articles].sort((a, b) => (a.date < b.date ? 1 : -1));
  const sortedEvents = [...data.events].sort((a, b) => (a.date < b.date ? -1 : 1));

  function go(page, extra = {}) {
    window.scrollTo(0, 0);
    setView({ page, ...extra });
  }

  const headingParam = (FONT_HEADING_OPTIONS.find((f) => f.value === theme.headingFont) || FONT_HEADING_OPTIONS[0]).google;
  const bodyParam = (FONT_BODY_OPTIONS.find((f) => f.value === theme.bodyFont) || FONT_BODY_OPTIONS[0]).google;
  const fontImportUrl = `https://fonts.googleapis.com/css2?family=${headingParam}&family=${bodyParam}&display=swap`;

  return (
    <ThemeContext.Provider value={theme}>
      <div style={{ fontFamily: `'${theme.bodyFont}', system-ui, sans-serif`, background: theme.canvas, color: theme.ink, minHeight: "100vh" }}>
        <style>{`
          @import url('${fontImportUrl}');
          .td-h { font-family: '${theme.headingFont}', sans-serif; text-transform: uppercase; letter-spacing: 0.02em; }
          .td-link:hover { color: ${theme.rust} !important; }
          .td-card:hover { transform: translateY(-3px); box-shadow: 0 14px 26px rgba(28,43,58,0.15); }
          .td-card { transition: transform .15s, box-shadow .15s; }
          .td-input { font-family: '${theme.bodyFont}', sans-serif; padding: 10px 12px; border: 2px solid ${theme.navy}; border-radius: 3px; font-size: 14px; width: 100%; }
          .td-btn { font-family: '${theme.headingFont}', sans-serif; text-transform: uppercase; letter-spacing: 0.04em; font-weight: 600; border: none; border-radius: 3px; cursor: pointer; padding: 11px 18px; font-size: 13px; }
        `}</style>

        {loadError && (
          <div style={{ background: "#7a2a1e", color: "#fff", textAlign: "center", fontSize: 13, padding: "8px 16px" }}>
            {loadError}
          </div>
        )}

        <TopBar go={go} view={view} authed={authed} saveNote={saveNote} cities={data.cities} branding={data.branding} />

        {view.page === "home" && <Home data={data} sortedArticles={sortedArticles} sortedEvents={sortedEvents} go={go} />}
        {view.page === "city" && <CityPage data={data} slug={view.slug} sortedArticles={sortedArticles} go={go} isAdmin={authed} />}
        {view.page === "article" && <ArticlePage data={data} id={view.id} go={go} isAdmin={authed} />}
        {view.page === "events" && <EventsPage sortedEvents={sortedEvents} data={data} go={go} isAdmin={authed} />}
        {view.page === "about" && <AboutPage data={data} />}
        {view.page === "admin" && !authed && (
          <AdminLogin passInput={passInput} setPassInput={setPassInput} authError={authError}
            onSubmit={() => {
              if (passInput === ADMIN_PASSCODE) { setAuthed(true); setAuthError(""); }
              else setAuthError("Wrong passcode — try again.");
            }} go={go} />
        )}
        {view.page === "admin" && authed && (
          <AdminPanel data={data} persist={persist} onLogout={() => { setAuthed(false); setPassInput(""); }} />
        )}

        <Footer go={go} cities={data.cities} social={data.social} branding={data.branding} />
      </div>
    </ThemeContext.Provider>
  );
}

function TopBar({ go, view, authed, saveNote, cities, branding }) {
  const COLORS = useContext(ThemeContext);
  const [cityOpen, setCityOpen] = useState(false);
  return (
    <header style={{ background: COLORS.canvas, borderBottom: `3px solid ${COLORS.navy}`, position: "sticky", top: 0, zIndex: 50 }}>
      <div style={{ maxWidth: 1180, margin: "0 auto", padding: "14px 20px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16, flexWrap: "wrap" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer" }} onClick={() => go("home")}>
          {branding.logo ? (
            <img src={branding.logo} alt={branding.siteName} style={{ width: 38, height: 38, borderRadius: 6, objectFit: "cover", flexShrink: 0 }} />
          ) : (
            <svg width="38" height="38" viewBox="0 0 48 48" fill="none">
              <rect x="4" y="4" width="40" height="40" rx="4" fill={COLORS.navy} />
              <path d="M14 30 L18 18 L22 26 L26 14 L30 30" stroke={COLORS.amber} strokeWidth="2.4" fill="none" strokeLinecap="round" strokeLinejoin="round" />
              <circle cx="24" cy="34" r="2" fill={COLORS.amber} />
            </svg>
          )}
          <div style={{ lineHeight: 1 }}>
            <div className="td-h" style={{ fontSize: 20, fontWeight: 700, color: COLORS.navy }}>{branding.siteName}</div>
            <div className="td-h" style={{ fontSize: 10, letterSpacing: "0.16em", color: COLORS.rust }}>{branding.tagline}</div>
          </div>
        </div>

        <nav style={{ display: "flex", gap: 4, alignItems: "center", flexWrap: "wrap" }}>
          <NavBtn onClick={() => go("home")} active={view.page === "home"}>Home</NavBtn>
          <div style={{ position: "relative" }}
               onMouseEnter={() => setCityOpen(true)} onMouseLeave={() => setCityOpen(false)}>
            <NavBtn onClick={() => setCityOpen(!cityOpen)} active={view.page === "city"}>Cities ▾</NavBtn>
            {cityOpen && (
              <div style={{ position: "absolute", top: "100%", left: 0, background: COLORS.navy2, minWidth: 220, padding: "8px 0", borderRadius: "0 0 4px 4px", boxShadow: "0 10px 24px rgba(0,0,0,0.25)" }}>
                {cities.map((c) => (
                  <div key={c.slug} className="td-link" style={{ padding: "9px 16px", fontSize: 13.5, color: "#ECE3CC", cursor: "pointer" }}
                       onClick={() => { go("city", { slug: c.slug }); setCityOpen(false); }}>
                    {c.name}
                  </div>
                ))}
              </div>
            )}
          </div>
          <NavBtn onClick={() => go("events")} active={view.page === "events"}>Events</NavBtn>
          <NavBtn onClick={() => go("about")} active={view.page === "about"}>About</NavBtn>
          <NavBtn onClick={() => go("admin")} active={view.page === "admin"}>
            <span style={{ display: "flex", alignItems: "center", gap: 5 }}>
              <Icon name="lock" size={13} color={view.page === "admin" ? COLORS.canvas : COLORS.navy} />
              Admin
            </span>
          </NavBtn>
        </nav>
      </div>
      {saveNote && (
        <div style={{ background: COLORS.pine, color: "#fff", textAlign: "center", fontSize: 12.5, padding: "4px 0", fontFamily: `'${COLORS.headingFont}'`, letterSpacing: "0.05em", textTransform: "uppercase" }}>
          {saveNote}
        </div>
      )}
    </header>
  );
}

function NavBtn({ children, onClick, active }) {
  const COLORS = useContext(ThemeContext);
  return (
    <div className="td-h" onClick={onClick}
      style={{ padding: "9px 13px", fontSize: 13, fontWeight: 600, color: active ? COLORS.canvas : COLORS.navy, background: active ? COLORS.navy : "transparent", borderRadius: 3, cursor: "pointer" }}>
      {children}
    </div>
  );
}

function Hero({ go }) {
  const COLORS = useContext(ThemeContext);
  return (
    <section style={{ background: `linear-gradient(160deg, ${COLORS.navy} 0%, ${COLORS.navy2} 55%, #2c4356 100%)`, color: COLORS.canvas }}>
      <div style={{ maxWidth: 1180, margin: "0 auto", padding: "56px 20px 44px", display: "grid", gridTemplateColumns: "1.2fr 0.8fr", gap: 32, alignItems: "center" }}>
        <div>
          <span style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(225,152,47,0.15)", border: `1px solid ${COLORS.amber}`, color: COLORS.amber, fontFamily: `'${COLORS.headingFont}'`, fontSize: 12, letterSpacing: "0.14em", textTransform: "uppercase", padding: "6px 12px", borderRadius: 20, marginBottom: 16 }}>● Local & Dad-Tested</span>
          <h1 className="td-h" style={{ fontSize: 38, lineHeight: 1.08, color: "#fff", marginBottom: 14 }}>Your playbook for <span style={{ color: COLORS.amber }}>dad life</span> in the Triad</h1>
          <p style={{ fontSize: 16, color: "#c9d3da", maxWidth: 460, lineHeight: 1.55, marginBottom: 22 }}>Weekend plans, weeknight wins, and honest gear reviews for dads raising kids from Greensboro to Lexington & Davidson County.</p>
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
            <button className="td-btn" style={{ background: COLORS.amber, color: COLORS.navy }} onClick={() => go("events")}>See This Week's Events</button>
          </div>
        </div>
        <svg viewBox="0 0 400 300" width="100%" height="auto">
          <rect width="400" height="300" rx="10" fill="#2c4358" />
          <circle cx="200" cy="130" r="90" fill="#33506a" />
          <path d="M130 180 Q200 80 270 180" stroke={COLORS.amber} strokeWidth="5" fill="none" strokeLinecap="round" />
          <circle cx="200" cy="130" r="38" fill={COLORS.amber} />
          <path d="M184 130 l10 10 l20 -24" stroke={COLORS.navy} strokeWidth="5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
    </section>
  );
}

function SectionHead({ eyebrow, title, action, dark }) {
  const COLORS = useContext(ThemeContext);
  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 24, borderBottom: `3px solid ${dark ? "rgba(241,236,222,0.25)" : COLORS.navy}`, paddingBottom: 12 }}>
      <div>
        <span className="td-h" style={{ fontSize: 11.5, letterSpacing: "0.16em", color: dark ? COLORS.amber : COLORS.rust, display: "block", marginBottom: 5 }}>{eyebrow}</span>
        <h2 className="td-h" style={{ fontSize: 26, color: dark ? "#fff" : COLORS.navy }}>{title}</h2>
      </div>
      {action}
    </div>
  );
}

function ArticleCard({ article, go, cityName }) {
  const COLORS = useContext(ThemeContext);
  return (
    <article className="td-card" style={{ background: "#fff", border: `1px solid ${COLORS.line}`, borderRadius: 4, overflow: "hidden", cursor: "pointer" }} onClick={() => go("article", { id: article.id })}>
      <div style={{ height: 110, position: "relative", background: article.image ? `url(${article.image}) center/cover no-repeat` : `linear-gradient(135deg, ${COLORS.pine}, #5c7c5f)` }}>
        <span className="td-h" style={{ position: "absolute", top: 10, left: 10, background: COLORS.amber, color: COLORS.navy, fontSize: 10, letterSpacing: "0.08em", padding: "4px 9px", borderRadius: 2, transform: "rotate(-3deg)" }}>{article.category}</span>
      </div>
      <div style={{ padding: "16px 18px 20px" }}>
        <span className="td-h" style={{ fontSize: 10.5, letterSpacing: "0.08em", color: "#8a8570", display: "block", marginBottom: 8 }}>{fmtDate(article.date)}{cityName ? ` · ${cityName}` : ""}</span>
        <h3 className="td-h" style={{ fontSize: 17, lineHeight: 1.28, color: COLORS.navy, marginBottom: 8, textTransform: "none" }}>{article.title}</h3>
        <p style={{ fontSize: 14, lineHeight: 1.55, color: "#4c4a3f", margin: 0 }}>{article.excerpt}</p>
      </div>
    </article>
  );
}

function Home({ data, sortedArticles, sortedEvents, go }) {
  const COLORS = useContext(ThemeContext);
  return (
    <>
      <Hero go={go} />
      <section style={{ maxWidth: 1180, margin: "0 auto", padding: "48px 20px" }}>
        <SectionHead eyebrow="Fresh off the porch" title="Field Notes" action={<span className="td-h" style={{ fontSize: 12, color: COLORS.rust, cursor: "pointer" }} onClick={() => go("events")}>This Week's Events →</span>} />
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 22 }}>
          {sortedArticles.map((a) => (
            <ArticleCard key={a.id} article={a} go={go} cityName={data.cities.find((c) => c.slug === a.city)?.name} />
          ))}
        </div>
      </section>

      <section style={{ background: COLORS.navy, color: COLORS.canvas, padding: "48px 0" }}>
        <div style={{ maxWidth: 1180, margin: "0 auto", padding: "0 20px" }}>
          <SectionHead eyebrow="Know your turf" title="City Guides" dark />
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))", gap: 14 }}>
            {data.cities.map((c, i) => (
              <div key={c.slug} className="td-card" style={{ cursor: "pointer", aspectRatio: "1/1", borderRadius: 4, background: `linear-gradient(160deg, ${[COLORS.pine, COLORS.rust, COLORS.amberDark, "#4a5a3e", "#5c3a2e", "#39536b"][i % 6]}, ${COLORS.navy})`, display: "flex", alignItems: "flex-end", padding: 14, position: "relative", overflow: "hidden" }}
                   onClick={() => go("city", { slug: c.slug })}>
                <span className="td-h" style={{ fontSize: 14, color: "#fff", position: "relative", zIndex: 2 }}>{c.name}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

function CityPage({ data, slug, sortedArticles, go, isAdmin }) {
  const COLORS = useContext(ThemeContext);
  const city = data.cities.find((c) => c.slug === slug);
  if (!city) return <div style={{ padding: 60, textAlign: "center" }}>City not found. <a onClick={() => go("home")} style={{ color: COLORS.rust, cursor: "pointer" }}>Go home →</a></div>;
  const articles = sortedArticles.filter((a) => a.city === slug);
  const events = data.events.filter((e) => e.city === slug);
  return (
    <div style={{ maxWidth: 1180, margin: "0 auto", padding: "44px 20px" }}>
      <span className="td-h" style={{ fontSize: 12, letterSpacing: "0.14em", color: COLORS.rust, cursor: "pointer" }} onClick={() => go("home")}>← All Cities</span>
      <h1 className="td-h" style={{ fontSize: 36, color: COLORS.navy, margin: "10px 0 12px" }}>{city.name}</h1>
      <p style={{ fontSize: 16, lineHeight: 1.6, color: "#4c4a3f", maxWidth: 640, marginBottom: 36 }}>{city.blurb}</p>

      {events.length > 0 && (
        <div style={{ marginBottom: 40 }}>
          <h2 className="td-h" style={{ fontSize: 18, color: COLORS.navy, marginBottom: 14 }}>Upcoming in {city.name}</h2>
          {events.map((e) => <EventRow key={e.id} event={e} isAdmin={isAdmin} />)}
        </div>
      )}

      <h2 className="td-h" style={{ fontSize: 18, color: COLORS.navy, marginBottom: 14 }}>Field Notes from {city.name}</h2>
      {articles.length === 0 ? (
        <p style={{ color: "#8a8570" }}>Nothing posted for {city.name} yet — check back soon.</p>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 22 }}>
          {articles.map((a) => <ArticleCard key={a.id} article={a} go={go} />)}
        </div>
      )}
    </div>
  );
}

function ArticlePage({ data, id, go, isAdmin }) {
  const COLORS = useContext(ThemeContext);
  const article = data.articles.find((a) => a.id === id);
  if (!article) return <div style={{ padding: 60, textAlign: "center" }}>Article not found. <a onClick={() => go("home")} style={{ color: COLORS.rust, cursor: "pointer" }}>Go home →</a></div>;
  const city = data.cities.find((c) => c.slug === article.city);
  return (
    <div style={{ maxWidth: 760, margin: "0 auto", padding: "44px 20px" }}>
      <span className="td-h" style={{ fontSize: 12, letterSpacing: "0.14em", color: COLORS.rust, cursor: "pointer" }} onClick={() => go("home")}>← Back</span>
      <span className="td-h" style={{ display: "block", fontSize: 11, color: COLORS.amberDark, marginTop: 18 }}>{article.category}{city ? ` · ${city.name}` : ""}</span>
      <h1 className="td-h" style={{ fontSize: 32, color: COLORS.navy, margin: "8px 0 10px", textTransform: "none" }}>{article.title}</h1>
      <span style={{ fontSize: 13, color: "#8a8570" }}>{fmtDate(article.date)}</span>
      <div style={{ height: 260, borderRadius: 4, margin: "24px 0", background: article.image ? `url(${article.image}) center/cover no-repeat` : `linear-gradient(135deg, ${COLORS.pine}, #5c7c5f)` }} />
      <p style={{ fontSize: 17, lineHeight: 1.75, color: COLORS.ink }}>{article.body}</p>
      <Discussion parentId={`article-${article.id}`} isAdmin={isAdmin} />
    </div>
  );
}

function EventRow({ event, isAdmin }) {
  const COLORS = useContext(ThemeContext);
  const [open, setOpen] = useState(false);
  return (
    <div style={{ padding: "14px 0", borderBottom: `1px solid ${COLORS.line}` }}>
      <div style={{ display: "flex", gap: 16 }}>
        <div style={{ flexShrink: 0, width: 64, textAlign: "center" }}>
          <div className="td-h" style={{ fontSize: 20, color: COLORS.rust, lineHeight: 1 }}>{new Date(event.date + "T00:00:00").getDate()}</div>
          <div className="td-h" style={{ fontSize: 11, color: "#8a8570" }}>{new Date(event.date + "T00:00:00").toLocaleDateString("en-US", { month: "short" })}</div>
        </div>
        <div style={{ flex: 1 }}>
          <div className="td-h" style={{ fontSize: 15, color: COLORS.navy, textTransform: "none", marginBottom: 3 }}>{event.title}</div>
          <div style={{ fontSize: 13, color: "#8a8570", marginBottom: 4 }}>{event.location}</div>
          <div style={{ fontSize: 14, color: "#4c4a3f", marginBottom: 8 }}>{event.description}</div>
          <span className="td-h" style={{ fontSize: 11, letterSpacing: "0.06em", color: COLORS.rust, cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 5 }} onClick={() => setOpen(!open)}>
            <Icon name="chat" size={13} color={COLORS.rust} />
            {open ? "Hide Discussion" : "Discuss / Plan a Meetup"}
          </span>
        </div>
      </div>
      {open && <Discussion parentId={`event-${event.id}`} isAdmin={isAdmin} />}
    </div>
  );
}

function Discussion({ parentId, isAdmin }) {
  const COLORS = useContext(ThemeContext);
  const [comments, setComments] = useState([]);
  const [loaded, setLoaded] = useState(false);
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [posting, setPosting] = useState(false);
  const [confirmId, setConfirmId] = useState(null);

  useEffect(() => {
    let live = true;
    (async () => {
      try {
        const res = await db.get(`comments:${parentId}`);
        if (live) setComments(res && res.value ? JSON.parse(res.value) : []);
      } catch (e) {
        if (live) setComments([]);
      } finally {
        if (live) setLoaded(true);
      }
    })();
    return () => { live = false; };
  }, [parentId]);

  async function post() {
    if (!name.trim() || !message.trim()) return;
    setPosting(true);
    const next = [...comments, { id: "c" + Date.now(), name: name.trim(), message: message.trim(), date: new Date().toISOString() }];
    try {
      await db.set(`comments:${parentId}`, JSON.stringify(next));
      setComments(next);
      setMessage("");
    } catch (e) { /* best effort */ }
    setPosting(false);
  }

  async function remove(id) {
    const next = comments.filter((c) => c.id !== id);
    setComments(next);
    setConfirmId(null);
    try {
      await db.set(`comments:${parentId}`, JSON.stringify(next));
    } catch (e) { /* best effort */ }
  }

  return (
    <div style={{ marginTop: 24, paddingTop: 20, borderTop: `1px solid ${COLORS.line}` }}>
      <h4 className="td-h" style={{ fontSize: 14, color: COLORS.navy, marginBottom: 3 }}>Discussion</h4>
      <p style={{ fontSize: 12.5, color: "#8a8570", marginBottom: 14 }}>Plan a meetup, ask a question, or say hi — visible to everyone.</p>
      {!loaded && <p style={{ fontSize: 13, color: "#8a8570" }}>Loading…</p>}
      {loaded && comments.length === 0 && <p style={{ fontSize: 13.5, color: "#8a8570", marginBottom: 14 }}>No comments yet — be the first.</p>}
      {loaded && comments.map((c) => (
        <div key={c.id} style={{ padding: "10px 0", borderBottom: `1px solid ${COLORS.line}` }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 10 }}>
            <div style={{ flex: 1 }}>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ fontWeight: 700, fontSize: 13.5, color: COLORS.navy }}>{c.name}</span>
                <span style={{ fontSize: 11, color: "#8a8570" }}>{new Date(c.date).toLocaleDateString("en-US", { month: "short", day: "numeric" })}</span>
              </div>
              <p style={{ fontSize: 14, color: "#4c4a3f", margin: "4px 0 0" }}>{c.message}</p>
            </div>
            {isAdmin && confirmId !== c.id && (
              <button onClick={() => setConfirmId(c.id)} title="Delete comment" style={{ background: "none", border: "none", cursor: "pointer", padding: 4, flexShrink: 0 }}>
                <Icon name="trash" size={15} color={COLORS.rust} />
              </button>
            )}
            {isAdmin && confirmId === c.id && (
              <div style={{ display: "flex", gap: 6, flexShrink: 0 }}>
                <button className="td-btn" style={{ background: COLORS.rust, color: "#fff", fontSize: 10.5, padding: "6px 9px" }} onClick={() => remove(c.id)}>Delete</button>
                <button className="td-btn" style={{ background: "transparent", border: `1px solid ${COLORS.line}`, color: COLORS.navy, fontSize: 10.5, padding: "6px 9px" }} onClick={() => setConfirmId(null)}>Cancel</button>
              </div>
            )}
          </div>
        </div>
      ))}
      <div style={{ marginTop: 16, display: "grid", gap: 8 }}>
        <input className="td-input" placeholder="Your name" value={name} onChange={(e) => setName(e.target.value)} />
        <textarea className="td-input" placeholder="Ask a question or plan a meetup…" rows={3} value={message} onChange={(e) => setMessage(e.target.value)} />
        <button className="td-btn" style={{ background: COLORS.amber, color: COLORS.navy, justifySelf: "start" }} onClick={post} disabled={posting}>{posting ? "Posting…" : "Post Comment"}</button>
      </div>
    </div>
  );
}

function EventsPage({ sortedEvents, data, go, isAdmin }) {
  const COLORS = useContext(ThemeContext);
  return (
    <div style={{ maxWidth: 800, margin: "0 auto", padding: "44px 20px" }}>
      <h1 className="td-h" style={{ fontSize: 32, color: COLORS.navy, marginBottom: 6 }}>This Week & Beyond</h1>
      <p style={{ color: "#8a8570", marginBottom: 30 }}>Family events across the Triad, updated by the Triad Dads team.</p>
      {sortedEvents.length === 0 && <p style={{ color: "#8a8570" }}>No events posted yet.</p>}
      {sortedEvents.map((e) => (
        <div key={e.id} style={{ marginBottom: 4 }}>
          <span className="td-h" style={{ fontSize: 11, color: COLORS.rust, cursor: "pointer" }} onClick={() => go("city", { slug: e.city })}>{data.cities.find((c) => c.slug === e.city)?.name}</span>
          <EventRow event={e} isAdmin={isAdmin} />
        </div>
      ))}
    </div>
  );
}

const SOCIAL_ICON_MAP = { Facebook: "facebook", Instagram: "instagram", Pinterest: "pinterest", TikTok: "tiktok", YouTube: "youtube", X: "x" };

function SocialRow({ social, dark }) {
  const COLORS = useContext(ThemeContext);
  if (!social || social.length === 0) return null;
  return (
    <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
      {social.map((s) => (
        <a key={s.id} href={s.url} target="_blank" rel="noopener noreferrer"
          style={{ width: 36, height: 36, borderRadius: "50%", border: `2px solid ${dark ? "rgba(255,255,255,0.3)" : COLORS.navy}`, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Icon name={SOCIAL_ICON_MAP[s.platform] || "globe"} size={15} color={dark ? "#cdd7de" : COLORS.navy} />
        </a>
      ))}
    </div>
  );
}

function AboutPage({ data }) {
  const COLORS = useContext(ThemeContext);
  const { about, social } = data;
  return (
    <div style={{ maxWidth: 700, margin: "0 auto", padding: "48px 20px", textAlign: "center" }}>
      {about.photo ? (
        <img src={about.photo} alt={about.name} style={{ width: 140, height: 140, borderRadius: "50%", objectFit: "cover", margin: "0 auto 20px" }} />
      ) : (
        <div style={{ width: 140, height: 140, borderRadius: "50%", margin: "0 auto 20px", background: `linear-gradient(135deg, ${COLORS.pine}, ${COLORS.navy})` }} />
      )}
      <h1 className="td-h" style={{ fontSize: 30, color: COLORS.navy, marginBottom: 12 }}>{about.name}</h1>
      <p style={{ fontSize: 16, lineHeight: 1.75, color: "#4c4a3f", whiteSpace: "pre-line", marginBottom: 26 }}>{about.bio}</p>
      <div style={{ display: "flex", justifyContent: "center" }}><SocialRow social={social} /></div>
    </div>
  );
}

function ImageUploadField({ value, onChange }) {
  const COLORS = useContext(ThemeContext);
  function handleFile(e) {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => onChange(reader.result);
    reader.readAsDataURL(file);
  }
  return (
    <div>
      <input className="td-input" type="file" accept="image/*" onChange={handleFile} />
      {value && (
        <div style={{ marginTop: 10 }}>
          <img src={value} alt="preview" style={{ maxWidth: 200, borderRadius: 4, display: "block", marginBottom: 8 }} />
          <button type="button" className="td-btn" style={{ background: "transparent", border: `2px solid ${COLORS.rust}`, color: COLORS.rust, fontSize: 11, padding: "6px 10px" }} onClick={() => onChange("")}>Remove Image</button>
        </div>
      )}
    </div>
  );
}

function AdminLogin({ passInput, setPassInput, authError, onSubmit }) {
  const COLORS = useContext(ThemeContext);
  return (
    <div style={{ maxWidth: 380, margin: "0 auto", padding: "70px 20px", textAlign: "center" }}>
      <Icon name="lock" size={30} color={COLORS.navy} />
      <h1 className="td-h" style={{ fontSize: 24, color: COLORS.navy, margin: "14px 0 6px" }}>Admin Access</h1>
      <p style={{ fontSize: 14, color: "#8a8570", marginBottom: 22 }}>Enter the site passcode to add or edit content.</p>
      <input className="td-input" type="password" placeholder="Passcode" value={passInput}
        onChange={(e) => setPassInput(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && onSubmit()} />
      {authError && <p style={{ color: COLORS.rust, fontSize: 13, marginTop: 8 }}>{authError}</p>}
      <button className="td-btn" style={{ background: COLORS.navy, color: "#fff", marginTop: 14, width: "100%" }} onClick={onSubmit}>Unlock Admin</button>
      <p style={{ fontSize: 11.5, color: "#8a8570", marginTop: 26, lineHeight: 1.5 }}>Note: this is a lightweight passcode gate suitable for keeping casual visitors out — it isn't bank-grade security since the check happens in the browser.</p>
    </div>
  );
}

function AdminPanel({ data, persist, onLogout }) {
  const COLORS = useContext(ThemeContext);
  const [tab, setTab] = useState("articles");
  return (
    <div style={{ maxWidth: 900, margin: "0 auto", padding: "36px 20px 60px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
        <h1 className="td-h" style={{ fontSize: 26, color: COLORS.navy }}>Admin Panel</h1>
        <button className="td-btn" style={{ background: "transparent", border: `2px solid ${COLORS.navy}`, color: COLORS.navy }} onClick={onLogout}>Log Out</button>
      </div>
      <div style={{ display: "flex", gap: 8, marginBottom: 24, borderBottom: `2px solid ${COLORS.line}`, paddingBottom: 10, flexWrap: "wrap" }}>
        {["articles", "events", "cities", "about", "social", "branding", "theme"].map((t) => (
          <div key={t} className="td-h" onClick={() => setTab(t)}
            style={{ padding: "8px 16px", fontSize: 12.5, cursor: "pointer", borderRadius: 3, background: tab === t ? COLORS.navy : "transparent", color: tab === t ? "#fff" : COLORS.navy }}>
            {t}
          </div>
        ))}
      </div>
      {tab === "articles" && <ArticlesAdmin data={data} persist={persist} />}
      {tab === "events" && <EventsAdmin data={data} persist={persist} />}
      {tab === "cities" && <CitiesAdmin data={data} persist={persist} />}
      {tab === "about" && <AboutAdmin data={data} persist={persist} />}
      {tab === "social" && <SocialAdmin data={data} persist={persist} />}
      {tab === "branding" && <BrandingAdmin data={data} persist={persist} />}
      {tab === "theme" && <ThemeAdmin data={data} persist={persist} />}
    </div>
  );
}

function BrandingAdmin({ data, persist }) {
  const COLORS = useContext(ThemeContext);
  const [form, setForm] = useState(data.branding);
  const changed = JSON.stringify(form) !== JSON.stringify(data.branding);
  return (
    <div style={{ background: "#fff", border: `1px solid ${COLORS.line}`, borderRadius: 4, padding: 20 }}>
      <h3 className="td-h" style={{ fontSize: 15, color: COLORS.navy, marginBottom: 14 }}>Branding</h3>
      <div style={{ display: "grid", gap: 10 }}>
        <div>
          <label style={{ fontSize: 12.5, color: "#8a8570", display: "block", marginBottom: 6 }}>Site Name</label>
          <input className="td-input" value={form.siteName} onChange={(e) => setForm({ ...form, siteName: e.target.value })} />
        </div>
        <div>
          <label style={{ fontSize: 12.5, color: "#8a8570", display: "block", marginBottom: 6 }}>Tagline</label>
          <input className="td-input" value={form.tagline} onChange={(e) => setForm({ ...form, tagline: e.target.value })} />
        </div>
        <div>
          <label style={{ fontSize: 12.5, color: "#8a8570", display: "block", marginBottom: 6 }}>Logo (leave blank to use the default mark)</label>
          <ImageUploadField value={form.logo} onChange={(v) => setForm({ ...form, logo: v })} />
        </div>
        {changed && <button className="td-btn" style={{ background: COLORS.amber, color: COLORS.navy, justifySelf: "start" }} onClick={() => persist({ ...data, branding: form })}>Save Branding</button>}
      </div>
    </div>
  );
}

const THEME_COLOR_FIELDS = [
  { key: "navy", label: "Primary (Navy)" },
  { key: "navy2", label: "Primary — Alt" },
  { key: "canvas", label: "Background" },
  { key: "canvas2", label: "Background — Alt" },
  { key: "amber", label: "Accent" },
  { key: "amberDark", label: "Accent — Dark" },
  { key: "rust", label: "Secondary Accent" },
  { key: "pine", label: "Tertiary Accent" },
  { key: "line", label: "Borders" },
  { key: "ink", label: "Body Text" },
];

function ThemeAdmin({ data, persist }) {
  const COLORS = useContext(ThemeContext);
  const [form, setForm] = useState(data.theme);
  const changed = JSON.stringify(form) !== JSON.stringify(data.theme);

  function setField(key, value) { setForm({ ...form, [key]: value }); }

  return (
    <div style={{ display: "grid", gap: 20 }}>
      <div style={{ background: "#fff", border: `1px solid ${COLORS.line}`, borderRadius: 4, padding: 20 }}>
        <h3 className="td-h" style={{ fontSize: 15, color: COLORS.navy, marginBottom: 14 }}>Colors</h3>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(170px, 1fr))", gap: 14 }}>
          {THEME_COLOR_FIELDS.map((f) => (
            <div key={f.key}>
              <label style={{ fontSize: 12, color: "#8a8570", display: "block", marginBottom: 4 }}>{f.label}</label>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <input type="color" value={form[f.key]} onChange={(e) => setField(f.key, e.target.value)} style={{ width: 40, height: 34, border: `1px solid ${COLORS.line}`, borderRadius: 3, padding: 0, cursor: "pointer" }} />
                <input className="td-input" style={{ fontSize: 12, padding: "8px 10px" }} value={form[f.key]} onChange={(e) => setField(f.key, e.target.value)} />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ background: "#fff", border: `1px solid ${COLORS.line}`, borderRadius: 4, padding: 20 }}>
        <h3 className="td-h" style={{ fontSize: 15, color: COLORS.navy, marginBottom: 14 }}>Fonts</h3>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 14 }}>
          <div>
            <label style={{ fontSize: 12, color: "#8a8570", display: "block", marginBottom: 4 }}>Heading Font</label>
            <select className="td-input" value={form.headingFont} onChange={(e) => setField("headingFont", e.target.value)}>
              {FONT_HEADING_OPTIONS.map((f) => <option key={f.value} value={f.value}>{f.label}</option>)}
            </select>
          </div>
          <div>
            <label style={{ fontSize: 12, color: "#8a8570", display: "block", marginBottom: 4 }}>Body Font</label>
            <select className="td-input" value={form.bodyFont} onChange={(e) => setField("bodyFont", e.target.value)}>
              {FONT_BODY_OPTIONS.map((f) => <option key={f.value} value={f.value}>{f.label}</option>)}
            </select>
          </div>
        </div>
      </div>

      <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
        {changed && <button className="td-btn" style={{ background: COLORS.amber, color: COLORS.navy }} onClick={() => persist({ ...data, theme: form })}>Save Theme</button>}
        <button className="td-btn" style={{ background: "transparent", border: `2px solid ${COLORS.navy}`, color: COLORS.navy }}
          onClick={() => { setForm(DEFAULT_THEME); persist({ ...data, theme: DEFAULT_THEME }); }}>
          Reset to Default Theme
        </button>
      </div>
    </div>
  );
}

const emptySocial = { platform: "Facebook", url: "" };

function SocialAdmin({ data, persist }) {
  const COLORS = useContext(ThemeContext);
  const [form, setForm] = useState(emptySocial);
  const [editingId, setEditingId] = useState(null);

  function save() {
    if (!form.url.trim()) return;
    if (editingId) {
      persist({ ...data, social: data.social.map((s) => (s.id === editingId ? { ...form, id: editingId } : s)) });
    } else {
      persist({ ...data, social: [...data.social, { ...form, id: "s" + Date.now() }] });
    }
    setForm(emptySocial);
    setEditingId(null);
  }
  function edit(s) { setForm(s); setEditingId(s.id); }
  function remove(id) { persist({ ...data, social: data.social.filter((s) => s.id !== id) }); if (editingId === id) { setForm(emptySocial); setEditingId(null); } }

  return (
    <div>
      <div style={{ background: "#fff", border: `1px solid ${COLORS.line}`, borderRadius: 4, padding: 20, marginBottom: 28 }}>
        <h3 className="td-h" style={{ fontSize: 15, color: COLORS.navy, marginBottom: 14 }}>{editingId ? "Edit Link" : "New Social Link"}</h3>
        <div style={{ display: "grid", gap: 10 }}>
          <select className="td-input" value={form.platform} onChange={(e) => setForm({ ...form, platform: e.target.value })}>
            {["Facebook", "Instagram", "Pinterest", "TikTok", "YouTube", "X"].map((p) => <option key={p}>{p}</option>)}
          </select>
          <input className="td-input" placeholder="https://..." value={form.url} onChange={(e) => setForm({ ...form, url: e.target.value })} />
          <div style={{ display: "flex", gap: 10 }}>
            <button className="td-btn" style={{ background: COLORS.amber, color: COLORS.navy }} onClick={save}>{editingId ? "Save Changes" : "Add Link"}</button>
            {editingId && <button className="td-btn" style={{ background: "transparent", border: `2px solid ${COLORS.navy}`, color: COLORS.navy }} onClick={() => { setForm(emptySocial); setEditingId(null); }}>Cancel</button>}
          </div>
        </div>
      </div>
      {data.social.map((s) => <AdminRow key={s.id} title={s.platform} sub={s.url} onEdit={() => edit(s)} onDelete={() => remove(s.id)} />)}
    </div>
  );
}

function AboutAdmin({ data, persist }) {
  const COLORS = useContext(ThemeContext);
  const [form, setForm] = useState(data.about);
  const changed = JSON.stringify(form) !== JSON.stringify(data.about);
  return (
    <div style={{ background: "#fff", border: `1px solid ${COLORS.line}`, borderRadius: 4, padding: 20 }}>
      <h3 className="td-h" style={{ fontSize: 15, color: COLORS.navy, marginBottom: 14 }}>About Section</h3>
      <div style={{ display: "grid", gap: 10 }}>
        <input className="td-input" placeholder="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
        <textarea className="td-input" placeholder="Bio" rows={5} value={form.bio} onChange={(e) => setForm({ ...form, bio: e.target.value })} />
        <div>
          <label style={{ fontSize: 12.5, color: "#8a8570", display: "block", marginBottom: 6 }}>Photo</label>
          <ImageUploadField value={form.photo} onChange={(v) => setForm({ ...form, photo: v })} />
        </div>
        {changed && <button className="td-btn" style={{ background: COLORS.amber, color: COLORS.navy, justifySelf: "start" }} onClick={() => persist({ ...data, about: form })}>Save About Section</button>}
      </div>
    </div>
  );
}

function CitiesAdmin({ data, persist }) {
  const COLORS = useContext(ThemeContext);
  function updateBlurb(slug, blurb) {
    persist({ ...data, cities: data.cities.map((c) => (c.slug === slug ? { ...c, blurb } : c)) });
  }
  return (
    <div style={{ display: "grid", gap: 16 }}>
      {data.cities.map((c) => (
        <div key={c.slug} style={{ background: "#fff", border: `1px solid ${COLORS.line}`, borderRadius: 4, padding: 18 }}>
          <h3 className="td-h" style={{ fontSize: 15, color: COLORS.navy, marginBottom: 10 }}>{c.name}</h3>
          <CityBlurbEditor initial={c.blurb} onSave={(v) => updateBlurb(c.slug, v)} />
        </div>
      ))}
    </div>
  );
}

function CityBlurbEditor({ initial, onSave }) {
  const COLORS = useContext(ThemeContext);
  const [val, setVal] = useState(initial);
  const changed = val !== initial;
  return (
    <div>
      <textarea className="td-input" rows={3} value={val} onChange={(e) => setVal(e.target.value)} />
      {changed && <button className="td-btn" style={{ background: COLORS.amber, color: COLORS.navy, marginTop: 8 }} onClick={() => onSave(val)}>Save Blurb</button>}
    </div>
  );
}

function AdminRow({ title, sub, onEdit, onDelete }) {
  const COLORS = useContext(ThemeContext);
  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 4px", borderBottom: `1px solid ${COLORS.line}` }}>
      <div>
        <div style={{ fontSize: 14.5, color: COLORS.navy, fontWeight: 600 }}>{title}</div>
        <div style={{ fontSize: 12.5, color: "#8a8570" }}>{sub}</div>
      </div>
      <div style={{ display: "flex", gap: 8 }}>
        <button onClick={onEdit} style={{ background: "none", border: "none", cursor: "pointer", padding: 6 }}><Icon name="pencil" size={16} color={COLORS.navy} /></button>
        <button onClick={onDelete} style={{ background: "none", border: "none", cursor: "pointer", padding: 6 }}><Icon name="trash" size={16} color={COLORS.rust} /></button>
      </div>
    </div>
  );
}

const emptyArticle = { title: "", category: "Outdoors", city: "greensboro", date: new Date().toISOString().slice(0, 10), excerpt: "", body: "", image: "" };
const emptyEvent = { title: "", date: new Date().toISOString().slice(0, 10), city: "greensboro", location: "", description: "" };

function ArticlesAdmin({ data, persist }) {
  const COLORS = useContext(ThemeContext);
  const [form, setForm] = useState(emptyArticle);
  const [editingId, setEditingId] = useState(null);

  function save() {
    if (!form.title.trim()) return;
    if (editingId) {
      persist({ ...data, articles: data.articles.map((a) => (a.id === editingId ? { ...form, id: editingId } : a)) });
    } else {
      persist({ ...data, articles: [...data.articles, { ...form, id: "a" + Date.now() }] });
    }
    setForm(emptyArticle);
    setEditingId(null);
  }
  function edit(a) { setForm(a); setEditingId(a.id); }
  function remove(id) { persist({ ...data, articles: data.articles.filter((a) => a.id !== id) }); if (editingId === id) { setForm(emptyArticle); setEditingId(null); } }

  return (
    <div>
      <div style={{ background: "#fff", border: `1px solid ${COLORS.line}`, borderRadius: 4, padding: 20, marginBottom: 28 }}>
        <h3 className="td-h" style={{ fontSize: 15, color: COLORS.navy, marginBottom: 14 }}>{editingId ? "Edit Article" : "New Article"}</h3>
        <div style={{ display: "grid", gap: 10 }}>
          <input className="td-input" placeholder="Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
          <div style={{ display: "flex", gap: 10 }}>
            <select className="td-input" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
              {["Outdoors", "Grilling", "Food", "Gear", "Coaching", "Family Time", "Money"].map((c) => <option key={c}>{c}</option>)}
            </select>
            <select className="td-input" value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })}>
              {data.cities.map((c) => <option key={c.slug} value={c.slug}>{c.name}</option>)}
            </select>
            <input className="td-input" type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} />
          </div>
          <textarea className="td-input" placeholder="Short excerpt (shown on cards)" rows={2} value={form.excerpt} onChange={(e) => setForm({ ...form, excerpt: e.target.value })} />
          <textarea className="td-input" placeholder="Full article body" rows={5} value={form.body} onChange={(e) => setForm({ ...form, body: e.target.value })} />
          <div>
            <label style={{ fontSize: 12.5, color: "#8a8570", display: "block", marginBottom: 6 }}>Cover Image (optional — falls back to a color block if left blank)</label>
            <ImageUploadField value={form.image || ""} onChange={(v) => setForm({ ...form, image: v })} />
          </div>
          <div style={{ display: "flex", gap: 10 }}>
            <button className="td-btn" style={{ background: COLORS.amber, color: COLORS.navy }} onClick={save}>{editingId ? "Save Changes" : "Publish Article"}</button>
            {editingId && <button className="td-btn" style={{ background: "transparent", border: `2px solid ${COLORS.navy}`, color: COLORS.navy }} onClick={() => { setForm(emptyArticle); setEditingId(null); }}>Cancel</button>}
          </div>
        </div>
      </div>

      {data.articles.map((a) => (
        <AdminRow key={a.id} title={a.title} sub={`${fmtDate(a.date)} · ${a.category}`} onEdit={() => edit(a)} onDelete={() => remove(a.id)} />
      ))}
    </div>
  );
}

function EventsAdmin({ data, persist }) {
  const COLORS = useContext(ThemeContext);
  const [form, setForm] = useState(emptyEvent);
  const [editingId, setEditingId] = useState(null);

  function save() {
    if (!form.title.trim()) return;
    if (editingId) {
      persist({ ...data, events: data.events.map((e) => (e.id === editingId ? { ...form, id: editingId } : e)) });
    } else {
      persist({ ...data, events: [...data.events, { ...form, id: "e" + Date.now() }] });
    }
    setForm(emptyEvent);
    setEditingId(null);
  }
  function edit(e) { setForm(e); setEditingId(e.id); }
  function remove(id) { persist({ ...data, events: data.events.filter((e) => e.id !== id) }); if (editingId === id) { setForm(emptyEvent); setEditingId(null); } }

  return (
    <div>
      <div style={{ background: "#fff", border: `1px solid ${COLORS.line}`, borderRadius: 4, padding: 20, marginBottom: 28 }}>
        <h3 className="td-h" style={{ fontSize: 15, color: COLORS.navy, marginBottom: 14 }}>{editingId ? "Edit Event" : "New Event"}</h3>
        <div style={{ display: "grid", gap: 10 }}>
          <input className="td-input" placeholder="Event title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
          <div style={{ display: "flex", gap: 10 }}>
            <input className="td-input" type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} />
            <select className="td-input" value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })}>
              {data.cities.map((c) => <option key={c.slug} value={c.slug}>{c.name}</option>)}
            </select>
          </div>
          <input className="td-input" placeholder="Location" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} />
          <textarea className="td-input" placeholder="Description" rows={2} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
          <div style={{ display: "flex", gap: 10 }}>
            <button className="td-btn" style={{ background: COLORS.amber, color: COLORS.navy }} onClick={save}>{editingId ? "Save Changes" : "Add Event"}</button>
            {editingId && <button className="td-btn" style={{ background: "transparent", border: `2px solid ${COLORS.navy}`, color: COLORS.navy }} onClick={() => { setForm(emptyEvent); setEditingId(null); }}>Cancel</button>}
          </div>
        </div>
      </div>

      {data.events.map((e) => (
        <AdminRow key={e.id} title={e.title} sub={`${fmtDate(e.date)} · ${e.location}`} onEdit={() => edit(e)} onDelete={() => remove(e.id)} />
      ))}
    </div>
  );
}

function Footer({ go, cities, social, branding }) {
  const COLORS = useContext(ThemeContext);
  return (
    <footer style={{ background: "#161f28", color: "#a9b4bd", padding: "34px 20px 24px", marginTop: 40 }}>
      <div style={{ maxWidth: 1180, margin: "0 auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 16, marginBottom: 20 }}>
          <span style={{ fontSize: 12.5 }}>© {new Date().getFullYear()} {branding.siteName}. Built for dads who show up.</span>
          <div style={{ display: "flex", gap: 14, flexWrap: "wrap", alignItems: "center" }}>
            {cities.map((c) => (
              <span key={c.slug} className="td-link" style={{ fontSize: 12.5, cursor: "pointer" }} onClick={() => go("city", { slug: c.slug })}>{c.name}</span>
            ))}
            <span className="td-link" style={{ fontSize: 12.5, cursor: "pointer" }} onClick={() => go("about")}>About</span>
          </div>
        </div>
        <SocialRow social={social} dark />
      </div>
    </footer>
  );
}
