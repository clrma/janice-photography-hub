import { useState } from "react";

const API_KEY = import.meta.env.VITE_ANTHROPIC_API_KEY;

const B = {
  ink: "#1A1A1A",
  white: "#FFFFFF",
  warm: "#F5F0EB",
  taupe: "#E8E0D8",
  mid: "#8A7D72",
  light: "#C4B8B0",
  border: "#DDD5CE",
  accent: "#B8926A",
  accentDark: "#96724E",
  paper: "#FAFAF8",
  red: "#9A3A3A",
  green: "#3A6A4A",
  gold: "#8A6A2A",
};

const TABS = [
  { id: "partners",  icon: "🤝", label: "Partners"     },
  { id: "content",   icon: "📸", label: "Content"      },
  { id: "blog",      icon: "✍️", label: "Blog"         },
  { id: "marketing", icon: "💡", label: "Marketing"    },
  { id: "emails",    icon: "📧", label: "Emails"       },
  { id: "prep",      icon: "🎯", label: "Session Prep" },
];

const SYSTEM = `You are a writing assistant for Janice C Photography, a family portrait photographer in Northern Virginia.

Janice's voice: warm, real, direct, mom to mom. She has a 3 year old toddler. She connects with NoVA mamas who want candid, unhurried, heirloom photos. Not posed. Real moments.

Her brand line: The moments you forgot to notice.
Mini Session: $249, 20 min, 5 photos. Full Session: $449, 60 min, 10 photos. Location: All sessions take place at my home studio location in Fairfax, Virginia, with your choice of an indoor or outdoor setting. When mentioning the location, always use this exact wording: "All sessions take place at my home studio location, with your choice of an indoor or outdoor setting." Do not paraphrase this. Booking is through Calendly.
Her edge: She is a mom too. No stress. No posing. Real life, beautifully captured.

Voice rules: Write like a real person talking. Short sentences. Simple words. No flowery AI phrases like cherish or timeless memories or capture the magic. Warm but not dramatic. Direct and honest. Mom to mom energy. Never use dashes in copy.

Format rules: Use plain text only. No markdown symbols like ##, **, or *. Use ALL CAPS for section headers instead. Separate sections with a blank line.`;

// Variation seeds — picked randomly each call so Claude doesn't repeat itself
const VARIATION_ANGLES = [
  "Take a fresh angle. Start differently than you normally would.",
  "Lead with something unexpected. Don't open the way most people would.",
  "This time, be a little more direct and less warm. Still friendly, just more to the point.",
  "Go a bit more personal and story-driven than usual.",
  "Keep it shorter than you think you need to. Cut anything that isn't essential.",
  "Be a little more conversational, like you're texting a friend.",
  "Start with the most interesting part, not the setup.",
  "Use a different opening word or phrase than Hey or Hi.",
  "Try a different structure than last time. Mix up the order.",
  "Be bolder. Say what other photographers won't say.",
];

function getVariationSeed() {
  return VARIATION_ANGLES[Math.floor(Math.random() * VARIATION_ANGLES.length)];
}

async function askClaude(prompt, maxTokens = 1000) {
  const variation = getVariationSeed();
  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "anthropic-version": "2023-06-01",
      "anthropic-dangerous-direct-browser-access": "true",
      "x-api-key": API_KEY,
    },
    body: JSON.stringify({
      model: "claude-sonnet-4-5",
      max_tokens: maxTokens,
      system: SYSTEM,
      messages: [{ role: "user", content: `${prompt}\n\nVariation note (follow this): ${variation}` }],
    }),
  });
  if (!res.ok) throw new Error(`API error ${res.status}`);
  const data = await res.json();
  return data.content?.find(b => b.type === "text")?.text || "";
}

function copyText(text) {
  navigator.clipboard.writeText(text).catch(() => {});
  alert("Copied!");
}

function FormattedText({ text }) {
  if (!text) return null;
  const lines = text.split("\n");
  return (
    <div>
      {lines.map((line, i) => {
        const trimmed = line.trim();
        if (!trimmed) return <div key={i} style={{ height: 12 }} />;
        const isHeader = trimmed === trimmed.toUpperCase() && trimmed.length > 3 && /[A-Z]{3,}/.test(trimmed);
        if (isHeader) {
          return (
            <div key={i} style={{
              fontSize: 14,
              fontWeight: 700,
              letterSpacing: "1.5px",
              color: "#B8926A",
              marginTop: 20,
              marginBottom: 6,
              fontFamily: "'Jost', sans-serif",
            }}>{trimmed}</div>
          );
        }
        return (
          <div key={i} style={{
            fontSize: 14,
            color: "#1A1A1A",
            lineHeight: 1.75, textAlign: "left", fontSize: 16,
            fontFamily: "'Jost', sans-serif",
          }}>{line}</div>
        );
      })}
    </div>
  );
}

const S = {
  page: { fontFamily: "'Jost', sans-serif", background: "#FAFAF8", minHeight: "100vh", color: "#1A1A1A" },
  header: { background: "#1A1A1A", padding: "20px 24px 0", position: "sticky", top: 0, zIndex: 50 },
  headerTop: { display: "flex", alignItems: "center", justifyContent: "center", gap: 14, marginBottom: 18 },
  logo: { width: 38, height: 38, borderRadius: "50%", background: "#B8926A", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 17 },
  h1: { fontFamily: "'Playfair Display', serif", fontSize: 20, color: "#FFFFFF", fontWeight: 400 },
  sub: { fontSize: 10, color: "#C4B8B0", letterSpacing: "2px", textTransform: "uppercase", marginTop: 2 },
  tabs: { display: "flex", overflowX: "auto", scrollbarWidth: "none", justifyContent: "center" },
  tab: (active) => ({
    flexShrink: 0,
    padding: "10px 16px",
    fontFamily: "'Jost', sans-serif",
    fontSize: 14,
    fontWeight: 600,
    letterSpacing: "1px",
    textTransform: "uppercase",
    color: active ? "#FFFFFF" : "#C4B8B0",
    background: "transparent",
    border: "none",
    borderBottom: active ? "2px solid #B8926A" : "2px solid transparent",
    cursor: "pointer",
    whiteSpace: "nowrap",
  }),
  section: { padding: "28px 24px 100px", maxWidth: "100%" },
  intro: {
    fontSize: 14,
    color: "#8A7D72",
    lineHeight: 1.7,
    marginBottom: 24,
    padding: "14px 16px",
    background: "#F5F0EB",
    borderRadius: 8,
    borderLeft: "3px solid #B8926A",
  },
  formGroup: { marginBottom: 16 },
  label: {
    display: "block",
    fontSize: 14,
    fontWeight: 600,
    letterSpacing: "1px",
    textTransform: "uppercase",
    color: "#8A7D72",
    marginBottom: 7,
  },
  input: {
    width: "100%",
    padding: "11px 14px",
    border: "1px solid #DDD5CE",
    borderRadius: 8,
    fontFamily: "'Jost', sans-serif",
    fontSize: 14,
    color: "#1A1A1A",
    background: "#FFFFFF",
    outline: "none",
    boxSizing: "border-box",
  },
  select: {
    width: "100%",
    padding: "11px 14px",
    border: "1px solid #DDD5CE",
    borderRadius: 8,
    fontFamily: "'Jost', sans-serif",
    fontSize: 14,
    color: "#1A1A1A",
    background: "#FFFFFF",
    outline: "none",
    boxSizing: "border-box",
    appearance: "none",
  },
  textarea: {
    width: "100%",
    padding: "11px 14px",
    border: "1px solid #DDD5CE",
    borderRadius: 8,
    fontFamily: "'Jost', sans-serif",
    fontSize: 14,
    color: "#1A1A1A",
    background: "#FFFFFF",
    outline: "none",
    boxSizing: "border-box",
    minHeight: 100,
    lineHeight: 1.65,
    resize: "vertical",
  },
  formRow: { display: "flex", gap: 12 },
  btnGenerate: {
    width: "100%",
    padding: "14px 20px",
    background: "#1A1A1A",
    color: "#FFFFFF",
    border: "none",
    borderRadius: 8,
    fontFamily: "'Jost', sans-serif",
    fontSize: 14,
    fontWeight: 600,
    cursor: "pointer",
    marginTop: 4,
    letterSpacing: "0.5px",
  },
  btnSm: (bg = "#F5F0EB", color = "#1A1A1A") => ({
    fontFamily: "'Jost', sans-serif",
    fontSize: 12,
    fontWeight: 500,
    padding: "7px 14px",
    borderRadius: 6,
    border: "1px solid #DDD5CE",
    background: bg,
    color,
    cursor: "pointer",
  }),
  resultCard: {
    background: "#FFFFFF",
    border: "1px solid #DDD5CE",
    borderRadius: 10,
    padding: "22px 24px",
    marginTop: 20,
  },
  resultTitle: {
    fontFamily: "'Playfair Display', serif",
    fontSize: 18,
    color: "#1A1A1A",
    marginBottom: 16,
    fontWeight: 600,
  },
  resultActions: { display: "flex", gap: 8, marginTop: 18, flexWrap: "wrap" },
  scriptBox: {
    background: "#F5F0EB",
    borderRadius: 8,
    padding: "16px 18px",
    marginTop: 14,
    borderLeft: "3px solid #B8926A",
  },
  trackerCard: {
    background: "#FFFFFF",
    border: "1px solid #DDD5CE",
    borderRadius: 10,
    padding: "16px 18px",
    marginBottom: 10,
  },
  badge: (status) => {
    const map = {
      "Yes": ["#3A6A4A", "#E8F5E8"],
      "No": ["#9A3A3A", "#FDEAEA"],
      "Follow Up": ["#8A6A2A", "#FEF6E4"],
      "Not Contacted": ["#8A7D72", "#F5F0EB"],
      "Contacted": ["#8A7D72", "#E8E0D8"],
    };
    const [color, bg] = map[status] || ["#8A7D72", "#F5F0EB"];
    return { fontSize: 14, fontWeight: 600, padding: "4px 12px", borderRadius: 20, background: bg, color, whiteSpace: "nowrap" };
  },
  savedTitle: {
    fontSize: 14,
    fontWeight: 600,
    letterSpacing: "1.5px",
    textTransform: "uppercase",
    color: "#C4B8B0",
    marginBottom: 14,
    marginTop: 32,
  },
  empty: { textAlign: "left", padding: "28px 0", color: "#C4B8B0", fontSize: 14 },
  loading: { padding: "28px 0", color: "#8A7D72", fontSize: 14 },
};

function Spinner() {
  return <div style={S.loading}>Writing just for you...</div>;
}

function ResultCard({ title, body, onCopy, onRetry, children }) {
  return (
    <div style={S.resultCard}>
      {title && <div style={S.resultTitle}>{title}</div>}
      {children || <FormattedText text={body} />}
      <div style={S.resultActions}>
        {onCopy && <button style={S.btnSm("#1A1A1A", "#FFFFFF")} onClick={onCopy}>Copy</button>}
        {onRetry && <button style={S.btnSm()} onClick={onRetry}>Try Again</button>}
      </div>
    </div>
  );
}

function PartnersTab() {
  const [type, setType] = useState("Toddler Gym");
  const [loc, setLoc] = useState("Fairfax");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [partners, setPartners] = useState(() => { try { return JSON.parse(localStorage.getItem("jcp_partners")) || []; } catch { return []; } });

  const save = (p) => { localStorage.setItem("jcp_partners", JSON.stringify(p)); setPartners(p); };

  async function generate() {
    setLoading(true); setResult(null);
    try {
      const text = await askClaude(`Generate a partnership strategy for Janice C Photography to partner with a ${type} in ${loc}, Virginia.

Use exactly these section headers in ALL CAPS with no symbols:

WHY THIS WORKS
2 to 3 sentences on why this is a great partner. Be specific.

WHAT TO OFFER
3 concrete offers. Real and specific. Number them 1, 2, 3.

HOW TO APPROACH THEM
Walk in, email, or DM? Be specific about timing and what to bring.

OUTREACH SCRIPT
Exact words Janice says or sends. Warm, real, under 5 sentences. No formal language. No dashes.`);
      setResult({ type, loc, text });
    } catch(e) { setResult({ error: true }); }
    setLoading(false);
  }

  function savePartner() {
    const name = prompt(`Business name? (leave blank to use "${type} in ${loc}")`);
    const entry = { id: Date.now(), name: name || `${type} in ${loc}`, type, loc, script: result.text, status: "Not Contacted", notes: "" };
    save([...partners, entry]);
    alert("Saved!");
  }

  function updateStatus(id, status) { save(partners.map(p => p.id === id ? {...p, status} : p)); }
  function addNote(id) { const note = prompt("Add a note:"); if (note !== null) save(partners.map(p => p.id === id ? {...p, notes: note} : p)); }
  function deleteP(id) { if (confirm("Remove this partner?")) save(partners.filter(p => p.id !== id)); }

  const statusOptions = ["Not Contacted","Contacted","Follow Up","Yes","No"];

  return (
    <div style={S.section}>
      <p style={S.intro}>Pick a business type and NoVA area. I will suggest the best partnership approach, what to offer, and give you a script to use.</p>
      <div style={S.formRow}>
        <div style={{...S.formGroup, flex:1}}>
          <label style={S.label}>Business Type</label>
          <select style={S.select} value={type} onChange={e=>setType(e.target.value)}>
            {["Toddler Gym","Preschool / Montessori","Kids Hair Salon","Baby Boutique","Maternity Boutique","Pediatric Dentist","Pediatrician Office","Prenatal Yoga Studio","Kids Art Studio","Children's Dance School","Baby Gear / Consignment","Kids Music Class","Postpartum Support Group","Mom Play Cafe"].map(o=><option key={o}>{o}</option>)}
          </select>
        </div>
        <div style={{...S.formGroup, flex:1}}>
          <label style={S.label}>NoVA Area</label>
          <select style={S.select} value={loc} onChange={e=>setLoc(e.target.value)}>
            {["Fairfax","Arlington","Alexandria","Loudoun County","Prince William County","Reston","Herndon","Chantilly","Ashburn","Manassas"].map(o=><option key={o}>{o}</option>)}
          </select>
        </div>
      </div>
      <button style={S.btnGenerate} onClick={generate}>Generate Partnership Strategy</button>
      {loading && <Spinner />}
      {result && !result.error && (
        <div style={S.resultCard}>
          <div style={S.resultTitle}>{result.type} · {result.loc}</div>
          <FormattedText text={result.text} />
          <div style={S.resultActions}>
            <button style={S.btnSm("#1A1A1A", "#FFFFFF")} onClick={()=>copyText(result.text)}>Copy All</button>
            <button style={S.btnSm("#B8926A", "#FFFFFF")} onClick={savePartner}>Save to Tracker</button>
            <button style={S.btnSm()} onClick={generate}>Try Again</button>
          </div>
        </div>
      )}
      {result?.error && <div style={{...S.resultCard, color: "#9A3A3A", fontSize: 14}}>Something went wrong. Try again.</div>}
      <div style={S.savedTitle}>Saved Partners</div>
      {partners.length === 0 && <div style={S.empty}>No partners saved yet. Generate one above and hit Save.</div>}
      {partners.map(p => (
        <div key={p.id} style={S.trackerCard}>
          <div style={{display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:10}}>
            <div>
              <div style={{fontFamily:"'Playfair Display',serif", fontSize:16, color:"#1A1A1A", fontWeight:600}}>{p.name}</div>
              <div style={{fontSize:12, color:"#8A7D72", marginTop:3}}>{p.type} · {p.loc}</div>
            </div>
            <span style={S.badge(p.status)}>{p.status}</span>
          </div>
          {p.notes && <div style={{fontSize:13, color:"#8A7D72", marginBottom:10, fontStyle:"italic"}}>{p.notes}</div>}
          <div style={{display:"flex", gap:8, flexWrap:"wrap", alignItems:"center", marginTop:10}}>
            <select style={{...S.select, width:"auto", padding:"6px 12px", fontSize:12}} value={p.status} onChange={e=>updateStatus(p.id, e.target.value)}>
              {statusOptions.map(s=><option key={s}>{s}</option>)}
            </select>
            <button style={S.btnSm()} onClick={()=>alert(p.script)}>Script</button>
            <button style={S.btnSm()} onClick={()=>addNote(p.id)}>Note</button>
            <button style={S.btnSm("#FDEAEA", "#9A3A3A")} onClick={()=>deleteP(p.id)}>Remove</button>
          </div>
        </div>
      ))}
    </div>
  );
}

function ContentTab() {
  const [type, setType] = useState("Candid Family Moment");
  const [platform, setPlatform] = useState("Instagram");
  const [detail, setDetail] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  async function generate() {
    setLoading(true); setResult(null);
    try {
      const text = await askClaude(`Write a ${platform} caption for Janice C Photography about: ${type}.
${detail ? "Extra detail: " + detail : ""}
Rules: In Janice's voice. Warm, real, mom to mom. Not salesy. ${platform==="Pinterest"?"Pinterest style: descriptive, 2 to 3 sentences, 5 hashtags.":"Instagram style: conversational, 3 to 5 sentences, soft call to action, 5 to 8 hashtags on new line."} Include NoVA hashtags. No dashes. Sound like a real person. Write caption only, no intro. No markdown symbols.`);
      setResult(text);
    } catch { setResult("error"); }
    setLoading(false);
  }

  return (
    <div style={S.section}>
      <p style={S.intro}>Pick your content type and platform. I will write a caption in your voice. Warm, real, mom to mom.</p>
      <div style={S.formRow}>
        <div style={{...S.formGroup, flex:1}}>
          <label style={S.label}>Content Type</label>
          <select style={S.select} value={type} onChange={e=>setType(e.target.value)}>
            {["Candid Family Moment","Mama and Me","Maternity","Behind the Scenes","Mini Session Promo","Full Session Promo","Client Spotlight","Personal Mom Life","Why Book a Session","Outfit Inspiration","Location Spotlight","Referral Ask"].map(o=><option key={o}>{o}</option>)}
          </select>
        </div>
        <div style={{...S.formGroup, flex:1}}>
          <label style={S.label}>Platform</label>
          <select style={S.select} value={platform} onChange={e=>setPlatform(e.target.value)}>
            {["Instagram","Facebook","Pinterest","Instagram and Facebook"].map(o=><option key={o}>{o}</option>)}
          </select>
        </div>
      </div>
      <div style={S.formGroup}>
        <label style={S.label}>Any specific detail? (optional)</label>
        <input style={S.input} value={detail} onChange={e=>setDetail(e.target.value)} placeholder="e.g. spring minis, National Harbor, toddler who wouldn't stop running..." />
      </div>
      <button style={S.btnGenerate} onClick={generate}>Write My Caption</button>
      {loading && <Spinner />}
      {result && result !== "error" && <ResultCard title={`${type} · ${platform}`} body={result} onCopy={()=>copyText(result)} onRetry={generate} />}
      {result === "error" && <div style={{...S.resultCard, color:"#9A3A3A", fontSize:14}}>Something went wrong. Try again.</div>}
    </div>
  );
}

function BlogTab() {
  const [type, setType] = useState("Session Story");
  const [tone, setTone] = useState("Warm and Honest");
  const [topic, setTopic] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  async function generate() {
    if (!topic.trim()) { alert("Tell me what the blog is about first."); return; }
    setLoading(true); setResult(null);
    try {
      const text = await askClaude(`Write a ${tone} ${type} blog post for Janice C Photography.
Topic: ${topic}
Rules: First person as Janice. Story-first, start with a real moment. NoVA mamas should read this and think she gets me. 400 to 600 words. Short paragraphs max 3 sentences. No fluff. End with soft human call to action. No dashes. Include a title at top. No markdown symbols.`, 1500);
      setResult(text);
    } catch { setResult("error"); }
    setLoading(false);
  }

  return (
    <div style={S.section}>
      <p style={S.intro}>Story-first blogs that NoVA mamas actually want to read. Real moments, real talk, nothing generic.</p>
      <div style={S.formRow}>
        <div style={{...S.formGroup, flex:1}}>
          <label style={S.label}>Blog Type</label>
          <select style={S.select} value={type} onChange={e=>setType(e.target.value)}>
            {["Session Story","Personal Mom Story","Mom Relatable Post","Photography Tips for Clients"].map(o=><option key={o}>{o}</option>)}
          </select>
        </div>
        <div style={{...S.formGroup, flex:1}}>
          <label style={S.label}>Tone</label>
          <select style={S.select} value={tone} onChange={e=>setTone(e.target.value)}>
            {["Warm and Honest","Funny and Relatable","Emotional and Real","Helpful and Simple"].map(o=><option key={o}>{o}</option>)}
          </select>
        </div>
      </div>
      <div style={S.formGroup}>
        <label style={S.label}>What is the story or topic?</label>
        <textarea style={S.textarea} value={topic} onChange={e=>setTopic(e.target.value)} placeholder="e.g. I photographed a family at Great Falls and the toddler cried the whole time and we still got the most beautiful shots..." />
      </div>
      <button style={S.btnGenerate} onClick={generate}>Write My Blog Draft</button>
      {loading && <Spinner />}
      {result && result !== "error" && <ResultCard body={result} onCopy={()=>copyText(result)} onRetry={generate} />}
      {result === "error" && <div style={{...S.resultCard, color:"#9A3A3A", fontSize:14}}>Something went wrong. Try again.</div>}
    </div>
  );
}

function MarketingTab() {
  const [session, setSession] = useState("Mini Session");
  const [season, setSeason] = useState("Spring");
  const [goal, setGoal] = useState("Get Bookings");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  async function generate() {
    setLoading(true); setResult(null);
    try {
      const text = await askClaude(`Give Janice C Photography 5 specific marketing ideas for:
Session: ${session}, Season: ${season}, Goal: ${goal}, Location: Northern Virginia.
Each idea: specific, actionable, doable from a phone this week. Include where to post, what to say, how to do it.
Format: Number each idea 1 through 5. Write IDEA TITLE in all caps, then 2 to 3 sentences. Direct and practical. No fluff. No dashes. No markdown symbols.`);
      setResult(text);
    } catch { setResult("error"); }
    setLoading(false);
  }

  return (
    <div style={S.section}>
      <p style={S.intro}>Pick your session type, season, and goal. I will give you real marketing ideas you can actually do this week.</p>
      <div style={S.formRow}>
        <div style={{...S.formGroup, flex:1}}>
          <label style={S.label}>Session Type</label>
          <select style={S.select} value={session} onChange={e=>setSession(e.target.value)}>
            {["Mini Session","Full Session","Maternity","Mama and Me","All Sessions"].map(o=><option key={o}>{o}</option>)}
          </select>
        </div>
        <div style={{...S.formGroup, flex:1}}>
          <label style={S.label}>Season or Topic</label>
          <select style={S.select} value={season} onChange={e=>setSeason(e.target.value)}>
            {["Spring","Summer","Fall","Winter","Valentine's Day","Mother's Day","Back to School","Christmas / Holiday","New Year","Evergreen"].map(o=><option key={o}>{o}</option>)}
          </select>
        </div>
      </div>
      <div style={S.formGroup}>
        <label style={S.label}>Goal</label>
        <select style={S.select} value={goal} onChange={e=>setGoal(e.target.value)}>
          {["Get Bookings","Build Awareness","Get Referrals","Grow Email List","Find Partner Businesses","Re-engage Past Clients"].map(o=><option key={o}>{o}</option>)}
        </select>
      </div>
      <button style={S.btnGenerate} onClick={generate}>Give Me Marketing Ideas</button>
      {loading && <Spinner />}
      {result && result !== "error" && <ResultCard title={`${session} · ${season} · ${goal}`} body={result} onCopy={()=>copyText(result)} onRetry={generate} />}
      {result === "error" && <div style={{...S.resultCard, color:"#9A3A3A", fontSize:14}}>Something went wrong. Try again.</div>}
    </div>
  );
}

function EmailsTab() {
  const [type, setType] = useState("Inquiry Reply");
  const [useCustomType, setUseCustomType] = useState(false);
  const [customType, setCustomType] = useState("");
  const [session, setSession] = useState("Mini Session");
  const [detail, setDetail] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const emailType = useCustomType ? customType : type;

  async function generate() {
    if (useCustomType && !customType.trim()) {
      alert("Tell me what kind of email you need.");
      return;
    }
    setLoading(true); setResult(null);
    try {
      const text = await askClaude(`Write a ${emailType} email for Janice C Photography for a ${session}.
${detail ? "Details: " + detail : ""}
Rules: From Janice to client. Warm, personal, real. Max 150 words. Start with Hey [Name]! Sign off as Janice. No dashes. Use [brackets] for fill-ins like [date] or [link]. Sound like a text from a friend who happens to be a photographer. Write the email only, no explanation. No markdown symbols.`);
      setResult(text);
    } catch { setResult("error"); }
    setLoading(false);
  }

  return (
    <div style={S.section}>
      <p style={S.intro}>Ready to send emails in your voice. Copy, tweak the names, send.</p>

      <div style={S.formGroup}>
        <label style={S.label}>Email Type</label>
        <select
          style={S.select}
          value={useCustomType ? "__custom__" : type}
          onChange={e => {
            if (e.target.value === "__custom__") {
              setUseCustomType(true);
            } else {
              setUseCustomType(false);
              setType(e.target.value);
            }
          }}
        >
          {["Inquiry Reply","Booking Confirmation","Session Prep","Gallery Delivery","Review Ask","Referral Ask","Follow Up (no response)","Rescheduling"].map(o=><option key={o} value={o}>{o}</option>)}
          <option value="__custom__">Write my own...</option>
        </select>
      </div>

      {useCustomType && (
        <div style={S.formGroup}>
          <label style={S.label}>Describe the email you need</label>
          <textarea
            style={{...S.textarea, minHeight: 70}}
            value={customType}
            onChange={e => setCustomType(e.target.value)}
            placeholder="e.g. Email to a client who ghosted after I sent the gallery link, checking in without being pushy..."
          />
          <div style={{marginTop: 6}}>
            <button
              style={{...S.btnSm(), fontSize: 12}}
              onClick={() => { setUseCustomType(false); setCustomType(""); }}
            >
              Back to dropdown
            </button>
          </div>
        </div>
      )}

      <div style={S.formGroup}>
        <label style={S.label}>Session Type</label>
        <select style={S.select} value={session} onChange={e=>setSession(e.target.value)}>
          {["Mini Session","Full Session","Maternity","Mama and Me"].map(o=><option key={o}>{o}</option>)}
        </select>
      </div>
      <div style={S.formGroup}>
        <label style={S.label}>Any detail to personalize? (optional)</label>
        <input style={S.input} value={detail} onChange={e=>setDetail(e.target.value)} placeholder="e.g. client has a 2 year old, session at Great Falls..." />
      </div>
      <button style={S.btnGenerate} onClick={generate}>Write My Email</button>
      {loading && <Spinner />}
      {result && result !== "error" && (
        <div style={S.resultCard}>
          <div style={S.resultTitle}>{emailType} · {session}</div>
          <div style={S.scriptBox}><FormattedText text={result} /></div>
          <div style={S.resultActions}>
            <button style={S.btnSm("#1A1A1A", "#FFFFFF")} onClick={()=>copyText(result)}>Copy Email</button>
            <button style={S.btnSm()} onClick={generate}>Try Again</button>
          </div>
        </div>
      )}
      {result === "error" && <div style={{...S.resultCard, color:"#9A3A3A", fontSize:14}}>Something went wrong. Try again.</div>}
    </div>
  );
}

function PrepTab() {
  const [session, setSession] = useState("Mini Session");
  const [loc, setLoc] = useState("Outdoor Park");
  const [kids, setKids] = useState("1 kid");
  const [age, setAge] = useState("Toddler (1-3 years)");
  const [vibe, setVibe] = useState("Light and Airy");
  const [notes, setNotes] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  async function generate() {
    setLoading(true); setResult(null);
    try {
      const text = await askClaude(`Write a personal session prep guide for a Janice C Photography client.
Session: ${session}, Location: ${loc}, Kids: ${kids}, Youngest age: ${age}, Vibe: ${vibe}. ${notes ? "Notes: " + notes : ""}
Write as a friendly message from Janice to the client. Include: what to wear for ${vibe} vibe, arrival time tip, ${kids!=="No kids (mama only)"?`how to prep ${age} kids`:"what to bring"}, what NOT to stress about, one fun thing to look forward to. Start with Hey! So excited for your session! Use you and your kids. Short sections max 2 to 3 sentences. No dashes. Include [DATE] and [TIME] placeholders. No markdown symbols.`);
      setResult(text);
    } catch { setResult("error"); }
    setLoading(false);
  }

  return (
    <div style={S.section}>
      <p style={S.intro}>Fill in the family details and I will write a personal prep guide you can send straight to your client.</p>
      <div style={S.formRow}>
        <div style={{...S.formGroup, flex:1}}>
          <label style={S.label}>Session Type</label>
          <select style={S.select} value={session} onChange={e=>setSession(e.target.value)}>
            {["Mini Session","Full Session","Maternity","Mama and Me"].map(o=><option key={o}>{o}</option>)}
          </select>
        </div>
        <div style={{...S.formGroup, flex:1}}>
          <label style={S.label}>Location</label>
          <select style={S.select} value={loc} onChange={e=>setLoc(e.target.value)}>
            {["Outdoor Park","Home Studio","Backyard","Urban / Downtown","Beach / Waterfront"].map(o=><option key={o}>{o}</option>)}
          </select>
        </div>
      </div>
      <div style={S.formRow}>
        <div style={{...S.formGroup, flex:1}}>
          <label style={S.label}>Number of Kids</label>
          <select style={S.select} value={kids} onChange={e=>setKids(e.target.value)}>
            {["No kids (mama only)","1 kid","2 kids","3 or more kids","Newborn"].map(o=><option key={o}>{o}</option>)}
          </select>
        </div>
        <div style={{...S.formGroup, flex:1}}>
          <label style={S.label}>Youngest Kid Age</label>
          <select style={S.select} value={age} onChange={e=>setAge(e.target.value)}>
            {["N/A","Newborn (0-3 months)","Baby (4-12 months)","Toddler (1-3 years)","Preschool (3-5 years)","School age (6+)"].map(o=><option key={o}>{o}</option>)}
          </select>
        </div>
      </div>
      <div style={S.formGroup}>
        <label style={S.label}>Vibe or Style</label>
        <select style={S.select} value={vibe} onChange={e=>setVibe(e.target.value)}>
          {["Light and Airy","Warm and Cozy","Natural and Earthy","Fun and Playful","Elegant and Timeless"].map(o=><option key={o}>{o}</option>)}
        </select>
      </div>
      <div style={S.formGroup}>
        <label style={S.label}>Anything specific about this family? (optional)</label>
        <input style={S.input} value={notes} onChange={e=>setNotes(e.target.value)} placeholder="e.g. toddler is shy, mama is pregnant, they love being outdoors..." />
      </div>
      <button style={S.btnGenerate} onClick={generate}>Generate Session Prep Guide</button>
      {loading && <Spinner />}
      {result && result !== "error" && (
        <div style={S.resultCard}>
          <div style={S.resultTitle}>Prep Guide · {session}</div>
          <div style={S.scriptBox}><FormattedText text={result} /></div>
          <div style={S.resultActions}>
            <button style={S.btnSm("#1A1A1A", "#FFFFFF")} onClick={()=>copyText(result)}>Copy Guide</button>
            <button style={S.btnSm()} onClick={generate}>Try Again</button>
          </div>
        </div>
      )}
      {result === "error" && <div style={{...S.resultCard, color:"#9A3A3A", fontSize:14}}>Something went wrong. Try again.</div>}
    </div>
  );
}

export default function App() {
  const [activeTab, setActiveTab] = useState("partners");

  const tabComponents = {
    partners: <PartnersTab />,
    content: <ContentTab />,
    blog: <BlogTab />,
    marketing: <MarketingTab />,
    emails: <EmailsTab />,
    prep: <PrepTab />,
  };

  return (
    <>
      <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;1,400&family=Jost:wght@300;400;500;600&display=swap" rel="stylesheet" />
      <div style={S.page}>
        <header style={S.header}>
          <div style={S.headerTop}>
            <div style={S.logo}>📷</div>
            <div>
              <div style={S.h1}>Janice C Photography</div>
              <div style={S.sub}>Command Center</div>
            </div>
          </div>
          <div style={S.tabs}>
            {TABS.map(t => (
              <button key={t.id} style={S.tab(activeTab===t.id)} onClick={()=>setActiveTab(t.id)}>
                {t.icon} {t.label}
              </button>
            ))}
          </div>
        </header>
        {tabComponents[activeTab]}
      </div>
    </>
  );
}

