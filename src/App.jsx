import { useState } from "react";

const API_KEY = import.meta.env.VITE_ANTHROPIC_API_KEY;

const B = {
  ink: "#2A1F1A", warm: "#F7F2EC", paper: "#FBF8F4",
  blush: "#D4907A", rose: "#B86B52", deep: "#8B4A35",
  mid: "#7A6358", light: "#C4AFA6", border: "#E8DDD8",
  green: "#4A7A5A", red: "#9A3A3A", gold: "#B8922A",
  white: "#FFFFFF",
};

const TABS = [
  { id: "partners", icon: "🤝", label: "Partners" },
  { id: "content",  icon: "📸", label: "Content"  },
  { id: "blog",     icon: "✍️", label: "Blog"     },
  { id: "marketing",icon: "💡", label: "Marketing"},
  { id: "emails",   icon: "📧", label: "Emails"   },
  { id: "prep",     icon: "🎯", label: "Session Prep" },
];

const SYSTEM = `You are a writing assistant for Janice C Photography, a family portrait photographer in Northern Virginia.

Janice's voice: warm, real, direct, mom to mom. She has a 3 year old toddler. She connects with NoVA mamas who want candid, unhurried, heirloom photos. Not posed. Real moments.

Her brand line: The moments you forgot to notice.
Mini Session: $249, 20 min, 5 photos. Full Session: $449, 60 min, 10 photos.
Her edge: She is a mom too. No stress. No posing. Real life, beautifully captured.

Voice rules: Write like a real person talking. Short sentences. Simple words. No flowery AI phrases like cherish or timeless memories or capture the magic. Warm but not dramatic. Direct and honest. Mom to mom energy. Never use dashes in copy.`;

async function askClaude(prompt, maxTokens = 1000) {
  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "anthropic-version": "2023-06-01",
      "anthropic-dangerous-direct-browser-access": "true",
      "x-api-key": API_KEY,
    },
    body: JSON.stringify({
      model: "claude-sonnet-4-20250514",
      max_tokens: maxTokens,
      system: SYSTEM,
      messages: [{ role: "user", content: prompt }],
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

const S = {
  page: { fontFamily: "'Jost', sans-serif", background: B.paper, minHeight: "100vh", color: B.ink },
  header: { background: B.ink, padding: "18px 20px 0", position: "sticky", top: 0, zIndex: 50 },
  headerTop: { display: "flex", alignItems: "center", gap: 12, marginBottom: 16 },
  logo: { width: 36, height: 36, borderRadius: "50%", background: B.blush, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16 },
  h1: { fontFamily: "'Playfair Display', serif", fontSize: 18, color: B.warm, fontWeight: 400 },
  sub: { fontSize: 10, color: B.light, letterSpacing: "1.5px", textTransform: "uppercase", marginTop: 1 },
  tabs: { display: "flex", overflowX: "auto", scrollbarWidth: "none" },
  tab: (active) => ({ flexShrink: 0, padding: "10px 14px", fontFamily: "'Jost', sans-serif", fontSize: 11, fontWeight: 500, letterSpacing: "0.8px", textTransform: "uppercase", color: active ? B.blush : B.light, background: "transparent", border: "none", borderBottom: active ? `2px solid ${B.blush}` : "2px solid transparent", cursor: "pointer", whiteSpace: "nowrap" }),
  section: { padding: "20px 16px 100px" },
  intro: { fontSize: 13, color: B.mid, lineHeight: 1.6, marginBottom: 20, padding: "12px 14px", background: B.warm, borderRadius: 10, borderLeft: `3px solid ${B.blush}` },
  formGroup: { marginBottom: 14 },
  label: { display: "block", fontSize: 10, fontWeight: 500, letterSpacing: "1px", textTransform: "uppercase", color: B.mid, marginBottom: 6 },
  input: { width: "100%", padding: "11px 14px", border: `1px solid ${B.border}`, borderRadius: 10, fontFamily: "'Jost', sans-serif", fontSize: 14, color: B.ink, background: B.white, outline: "none", boxSizing: "border-box" },
  select: { width: "100%", padding: "11px 14px", border: `1px solid ${B.border}`, borderRadius: 10, fontFamily: "'Jost', sans-serif", fontSize: 14, color: B.ink, background: B.white, outline: "none", boxSizing: "border-box", appearance: "none" },
  textarea: { width: "100%", padding: "11px 14px", border: `1px solid ${B.border}`, borderRadius: 10, fontFamily: "'Jost', sans-serif", fontSize: 14, color: B.ink, background: B.white, outline: "none", boxSizing: "border-box", minHeight: 90, lineHeight: 1.6, resize: "vertical" },
  formRow: { display: "flex", gap: 10 },
  btnGenerate: { width: "100%", padding: 14, background: B.rose, color: B.white, border: "none", borderRadius: 12, fontFamily: "'Jost', sans-serif", fontSize: 14, fontWeight: 500, cursor: "pointer", marginTop: 4 },
  btnSm: (bg=B.warm, color=B.rose) => ({ fontFamily: "'Jost', sans-serif", fontSize: 11, fontWeight: 500, padding: "5px 10px", borderRadius: 8, border: `1px solid ${B.border}`, background: bg, color, cursor: "pointer" }),
  resultCard: { background: B.white, border: `1px solid ${B.border}`, borderRadius: 14, padding: 18, marginTop: 16 },
  resultTitle: { fontFamily: "'Playfair Display', serif", fontSize: 16, color: B.ink, marginBottom: 12 },
  resultBody: { fontSize: 13, color: B.mid, lineHeight: 1.8, whiteSpace: "pre-wrap" },
  resultActions: { display: "flex", gap: 8, marginTop: 14, flexWrap: "wrap" },
  scriptBox: { background: B.warm, borderRadius: 10, padding: 14, marginTop: 12, borderLeft: `3px solid ${B.blush}` },
  trackerCard: { background: B.white, border: `1px solid ${B.border}`, borderRadius: 12, padding: 14, marginBottom: 10 },
  badge: (status) => {
    const map = { "Yes": [B.green, "#E8F5E8"], "No": [B.red, "#FDEAEA"], "Follow Up": [B.gold, "#FEF6E4"], "Not Contacted": [B.mid, B.warm], "Contacted": [B.mid, B.warm] };
    const [color, bg] = map[status] || [B.mid, B.warm];
    return { fontSize: 10, fontWeight: 500, padding: "3px 10px", borderRadius: 20, background: bg, color, whiteSpace: "nowrap" };
  },
  savedTitle: { fontSize: 10, fontWeight: 500, letterSpacing: "1.5px", textTransform: "uppercase", color: B.light, marginBottom: 12, marginTop: 28 },
  empty: { textAlign: "center", padding: "32px 16px", color: B.light, fontSize: 13 },
  loading: { textAlign: "center", padding: 32, color: B.light, fontSize: 13 },
};

function Spinner() {
  return <div style={S.loading}>✨ Writing just for you...</div>;
}

function ResultCard({ title, body, onCopy, onRetry, children }) {
  return (
    <div style={S.resultCard}>
      {title && <div style={S.resultTitle}>{title}</div>}
      {children || <div style={S.resultBody}>{body}</div>}
      <div style={S.resultActions}>
        {onCopy && <button style={S.btnSm()} onClick={onCopy}>Copy</button>}
        {onRetry && <button style={S.btnSm(B.warm, B.mid)} onClick={onRetry}>Try Again</button>}
      </div>
    </div>
  );
}

// PARTNERS TAB
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

Use exactly these headers:

WHY THIS WORKS
[2-3 sentences on why this is a great partner. Be specific.]

WHAT TO OFFER
[2-3 concrete offers. Real and specific.]

HOW TO APPROACH THEM
[Walk in, email, or DM? Be specific.]

OUTREACH SCRIPT
[Exact words Janice says or sends. Warm, real, under 5 sentences. No formal language. No dashes.]`);
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
      <button style={S.btnGenerate} onClick={generate}>✨ Generate Partnership Strategy</button>

      {loading && <Spinner />}
      {result && !result.error && (
        <ResultCard title={`${result.type} in ${result.loc}`} body={result.text} onCopy={()=>copyText(result.text)} onRetry={generate}>
          <div style={S.resultBody}>{result.text}</div>
          <div style={S.resultActions}>
            <button style={S.btnSm()} onClick={()=>copyText(result.text)}>Copy All</button>
            <button style={S.btnSm(B.green, B.white)} onClick={savePartner}>Save to Tracker</button>
            <button style={S.btnSm(B.warm, B.mid)} onClick={generate}>Try Again</button>
          </div>
        </ResultCard>
      )}
      {result?.error && <div style={{...S.resultCard, color: B.red, fontSize: 13}}>Something went wrong. Try again.</div>}

      <div style={S.savedTitle}>Saved Partners</div>
      {partners.length === 0 && <div style={S.empty}><div style={{fontSize:32,marginBottom:8}}>🤝</div><p>No partners saved yet.<br/>Generate one above and hit Save.</p></div>}
      {partners.map(p => (
        <div key={p.id} style={S.trackerCard}>
          <div style={{display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:8}}>
            <div>
              <div style={{fontFamily:"'Playfair Display',serif", fontSize:16, color:B.ink}}>{p.name}</div>
              <div style={{fontSize:11, color:B.mid, marginTop:2}}>{p.type} · {p.loc}</div>
            </div>
            <span style={S.badge(p.status)}>{p.status}</span>
          </div>
          {p.notes && <div style={{fontSize:12, color:B.mid, marginBottom:8, fontStyle:"italic"}}>{p.notes}</div>}
          <div style={{display:"flex", gap:8, flexWrap:"wrap", alignItems:"center", marginTop:10}}>
            <select style={{...S.select, width:"auto", padding:"5px 10px", fontSize:11}} value={p.status} onChange={e=>updateStatus(p.id, e.target.value)}>
              {statusOptions.map(s=><option key={s}>{s}</option>)}
            </select>
            <button style={S.btnSm()} onClick={()=>alert(p.script)}>Script</button>
            <button style={S.btnSm()} onClick={()=>addNote(p.id)}>Note</button>
            <button style={S.btnSm("#FDEAEA", B.red)} onClick={()=>deleteP(p.id)}>Remove</button>
          </div>
        </div>
      ))}
    </div>
  );
}

// CONTENT TAB
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
Rules: In Janice's voice. Warm, real, mom to mom. Not salesy. ${platform==="Pinterest"?"Pinterest style: descriptive, 2-3 sentences, 5 hashtags.":"Instagram style: conversational, 3-5 sentences, soft call to action, 5-8 hashtags on new line."} Include NoVA hashtags. No dashes. Sound like a real person. Write caption only, no intro.`);
      setResult(text);
    } catch { setResult("error"); }
    setLoading(false);
  }

  return (
    <div style={S.section}>
      <p style={S.intro}>Pick your content type and platform. I will write a caption in your voice. Warm, real, mom to mom. No fluff.</p>
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
      <button style={S.btnGenerate} onClick={generate}>✨ Write My Caption</button>
      {loading && <Spinner />}
      {result && result !== "error" && <ResultCard title={`${type} · ${platform}`} body={result} onCopy={()=>copyText(result)} onRetry={generate} />}
      {result === "error" && <div style={{...S.resultCard, color:B.red, fontSize:13}}>Something went wrong. Try again.</div>}
    </div>
  );
}

// BLOG TAB
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
Rules: First person as Janice. Story-first, start with a real moment. NoVA mamas should read this and think she gets me. 400-600 words. Short paragraphs max 3 sentences. No fluff. End with soft human call to action. No dashes. Include a title at top.`, 1500);
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
            {["Session Story","Personal Mom Story","Mom Relatable Post","AI Tips for Moms","Photography Tips for Clients"].map(o=><option key={o}>{o}</option>)}
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
      <button style={S.btnGenerate} onClick={generate}>✨ Write My Blog Draft</button>
      {loading && <Spinner />}
      {result && result !== "error" && <ResultCard body={result} onCopy={()=>copyText(result)} onRetry={generate} />}
      {result === "error" && <div style={{...S.resultCard, color:B.red, fontSize:13}}>Something went wrong. Try again.</div>}
    </div>
  );
}

// MARKETING TAB
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
Format: IDEA 1: [title] then 2-3 sentences. Direct and practical. No fluff. No dashes.`);
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
      <button style={S.btnGenerate} onClick={generate}>✨ Give Me Marketing Ideas</button>
      {loading && <Spinner />}
      {result && result !== "error" && <ResultCard title={`${session} · ${season} · ${goal}`} body={result} onCopy={()=>copyText(result)} onRetry={generate} />}
      {result === "error" && <div style={{...S.resultCard, color:B.red, fontSize:13}}>Something went wrong. Try again.</div>}
    </div>
  );
}

// EMAILS TAB
function EmailsTab() {
  const [type, setType] = useState("Inquiry Reply");
  const [session, setSession] = useState("Mini Session");
  const [detail, setDetail] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  async function generate() {
    setLoading(true); setResult(null);
    try {
      const text = await askClaude(`Write a ${type} email for Janice C Photography for a ${session}.
${detail ? "Details: " + detail : ""}
Rules: From Janice to client. Warm, personal, real. Max 150 words. Start with Hey [Name]! Sign off as Janice. No dashes. Use [brackets] for fill-ins like [date] or [link]. Sound like a text from a friend who happens to be a photographer. Write the email only, no explanation.`);
      setResult(text);
    } catch { setResult("error"); }
    setLoading(false);
  }

  return (
    <div style={S.section}>
      <p style={S.intro}>Ready to send emails in your voice. Copy, tweak the names, send. That is it.</p>
      <div style={S.formGroup}>
        <label style={S.label}>Email Type</label>
        <select style={S.select} value={type} onChange={e=>setType(e.target.value)}>
          {["Inquiry Reply","Booking Confirmation","Session Prep","Gallery Delivery","Review Ask","Referral Ask","Follow Up (no response)","Rescheduling"].map(o=><option key={o}>{o}</option>)}
        </select>
      </div>
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
      <button style={S.btnGenerate} onClick={generate}>✨ Write My Email</button>
      {loading && <Spinner />}
      {result && result !== "error" && (
        <div style={S.resultCard}>
          <div style={S.resultTitle}>{type} · {session}</div>
          <div style={S.scriptBox}><div style={S.resultBody}>{result}</div></div>
          <div style={S.resultActions}>
            <button style={S.btnSm()} onClick={()=>copyText(result)}>Copy Email</button>
            <button style={S.btnSm(B.warm, B.mid)} onClick={generate}>Try Again</button>
          </div>
        </div>
      )}
      {result === "error" && <div style={{...S.resultCard, color:B.red, fontSize:13}}>Something went wrong. Try again.</div>}
    </div>
  );
}

// SESSION PREP TAB
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
Write as a friendly message from Janice to the client. Include: what to wear for ${vibe} vibe, arrival time tip, ${kids!=="No kids (mama only)"?`how to prep ${age} kids`:"what to bring"}, what NOT to stress about, one fun thing to look forward to. Start with Hey! So excited for your session! Use you and your kids. Short sections max 2-3 sentences. No dashes. Include [DATE] and [TIME] placeholders.`);
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
      <button style={S.btnGenerate} onClick={generate}>✨ Generate Session Prep Guide</button>
      {loading && <Spinner />}
      {result && result !== "error" && (
        <div style={S.resultCard}>
          <div style={S.resultTitle}>Prep Guide · {session}</div>
          <div style={S.scriptBox}><div style={S.resultBody}>{result}</div></div>
          <div style={S.resultActions}>
            <button style={S.btnSm()} onClick={()=>copyText(result)}>Copy Guide</button>
            <button style={S.btnSm(B.warm, B.mid)} onClick={generate}>Try Again</button>
          </div>
        </div>
      )}
      {result === "error" && <div style={{...S.resultCard, color:B.red, fontSize:13}}>Something went wrong. Try again.</div>}
    </div>
  );
}

// MAIN APP
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
      <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;1,400&family=Jost:wght@300;400;500&display=swap" rel="stylesheet" />
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

