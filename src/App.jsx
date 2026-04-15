import { useState, useEffect } from "react";

// --- BRAND ---
const B = {
  red: "#C0392B", darkRed: "#922B21", cream: "#FDF8F2",
  sand: "#E8D5B7", warm: "#F5EDD8", muted: "#9B7E5A",
  dark: "#2C1A0E", green: "#2E7D52", gold: "#D4860A",
  softRed: "#FDECEA", softGreen: "#E8F5EE", softGold: "#FEF9E7",
};

const TABS = [
  { id: "ideas",     icon: "💡", label: "Ideas"       },
  { id: "carousel",  icon: "🎠", label: "Carousel"    },
  { id: "repurpose", icon: "🔄", label: "Repurpose"   },
  { id: "pinterest", icon: "📌", label: "Pinterest"   },
  { id: "freebie",   icon: "🎁", label: "Freebie"     },
  { id: "tracker",   icon: "📊", label: "Tracker"     },
  { id: "blog",      icon: "✍️", label: "Blog"        },
];

// --- SHARED HELPERS ---
async function askClaude(prompt, maxTokens = 900) {
  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "anthropic-version": "2023-06-01",
      "anthropic-dangerous-direct-browser-access": "true",
      "x-api-key": import.meta.env.VITE_ANTHROPIC_API_KEY,
    },
    body: JSON.stringify({
      model: "claude-sonnet-4-20250514",
      max_tokens: maxTokens,
      messages: [{ role: "user", content: prompt }],
    }),
  });
  if (!res.ok) {
    const errData = await res.json().catch(() => ({}));
    throw new Error(errData?.error?.message || `API error ${res.status}`);
  }
  const data = await res.json();
  const text = data.content?.find(b => b.type === "text")?.text || "";
  const clean = text.replace(/```json[\s\S]*?```|```[\s\S]*?```/g, m =>
    m.replace(/```json\n?|```\n?/g, "")
  ).trim();
  return clean;
}

const CONTEXT = `Brand: CuriousLittleRed (@curiouslittlered). Solo homeschool mom. Sells Montessori-inspired digital printables (toddler activity pages + seasonal/holiday) on Etsy and her own website. Target: homeschool moms of toddlers ages 2-5. Platforms: TikTok (944 followers, best video 7,878 views - DIY butterfly glue art), Pinterest (299 followers, 130K monthly views, top pin 127K impressions). Content style: fun, playful, colorful, text-overlay videos.`;

// --- STYLES ---
const S = {
  label: { display:"block", fontSize:11, fontWeight:700, color:B.muted, marginBottom:5, textTransform:"uppercase", letterSpacing:0.8 },
  input: { width:"100%", padding:"10px 13px", borderRadius:10, border:`1.5px solid ${B.sand}`, background:"#fff", fontSize:14, color:B.dark, outline:"none", boxSizing:"border-box", fontFamily:"inherit" },
  btn: (bg=B.red,fg="#fff") => ({ background:bg, color:fg, border:"none", borderRadius:10, padding:"11px 22px", fontSize:14, fontWeight:700, cursor:"pointer", fontFamily:"inherit", transition:"opacity .15s" }),
  card: { background:"#fff", border:`1px solid ${B.sand}`, borderRadius:16, padding:"18px 20px", boxShadow:"0 2px 10px rgba(0,0,0,0.05)" },
  tag: (c) => ({ display:"inline-block", background:c+"18", color:c, fontSize:10, fontWeight:700, borderRadius:5, padding:"2px 7px", marginRight:5, textTransform:"uppercase", letterSpacing:0.5 }),
  section: { fontWeight:700, fontSize:15, color:B.dark, marginBottom:12, paddingBottom:6, borderBottom:`2px solid ${B.sand}` },
  pill: (active) => ({ background: active ? B.red : "transparent", color: active ? "#fff" : "rgba(255,255,255,0.7)", border:"none", borderRadius:"8px 8px 0 0", padding:"9px 14px", fontWeight:600, fontSize:12, cursor:"pointer", fontFamily:"inherit", whiteSpace:"nowrap", transition:"all .2s" }),
  textarea: { width:"100%", padding:"10px 13px", borderRadius:10, border:`1.5px solid ${B.sand}`, background:"#fff", fontSize:14, color:"#2C1A0E", outline:"none", boxSizing:"border-box", fontFamily:"inherit", minHeight:120, resize:"vertical", lineHeight:1.6 },
};

function Spinner({ text="Generating..." }) {
  return <div style={{ textAlign:"center", padding:"50px 0", color:B.muted, fontSize:14 }}>✨ {text}</div>;
}
function Err({ msg }) {
  return msg ? <div style={{ color:B.red, fontSize:13, marginTop:10 }}>⚠️ {msg}</div> : null;
}
function SectionTitle({ children }) {
  return <div style={S.section}>{children}</div>;
}

// --- TAB 1: IDEAS ---
function IdeasTab() {
  const [platform, setPlatform] = useState("TikTok");
  const [type, setType] = useState("DIY Activity");
  const [ideas, setIdeas] = useState([]);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  const types = ["DIY Activity","Toddler Busy Activity","Morning Routine","Seasonal/Holiday","Montessori Play","Behind the Scenes Mom Life","Printable Showcase"];

  async function generate() {
    setLoading(true); setIdeas([]); setErr("");
    try {
      const raw = await askClaude(`${CONTEXT}

Generate 5 TikTok/Pinterest content ideas for platform: ${platform}, type: "${type}".

Key insight: Her best performing content is DIY activities and emotional/surprise hooks (butterfly glue = 7,878 views). NOT product showcases. Lead with a problem homeschool moms have, solve it with an activity, then naturally mention the printable.

Each idea needs a strong 2-second hook (first words they hear/see), body content, and soft CTA to printables.

JSON only: {"ideas":[{"title":"...","hook":"...","body":"...","cta":"...","whyItWorks":"..."}]}`);
      setIdeas(JSON.parse(raw).ideas || []);
    } catch(e) { setErr("Could not generate — please try again! " + (e.message||"")); }
    setLoading(false);
  }

  return (
    <div style={{ padding:"24px 0" }}>
      <p style={{ color:B.muted, fontSize:14, marginBottom:20 }}>Ideas built around what's <strong>actually working</strong> on your account — activity-first, problem-led hooks.</p>
      <div style={{ display:"flex", gap:10, flexWrap:"wrap", marginBottom:14 }}>
        <div style={{ flex:1, minWidth:130 }}>
          <label style={S.label}>Platform</label>
          <select value={platform} onChange={e=>setPlatform(e.target.value)} style={S.input}>
            {["TikTok","Instagram Reels","Pinterest"].map(p=><option key={p}>{p}</option>)}
          </select>
        </div>
        <div style={{ flex:2, minWidth:180 }}>
          <label style={S.label}>Content Type</label>
          <select value={type} onChange={e=>setType(e.target.value)} style={S.input}>
            {types.map(t=><option key={t}>{t}</option>)}
          </select>
        </div>
      </div>
      <button onClick={generate} disabled={loading} style={S.btn()}>✨ Generate 5 Ideas</button>
      <Err msg={err} />
      {loading && <Spinner />}
      {ideas.map((idea,i) => (
        <div key={i} style={{ ...S.card, marginTop:14 }}>
          <div style={{ display:"flex", gap:12 }}>
            <div style={{ background:B.red, color:"#fff", borderRadius:"50%", width:26, height:26, display:"flex", alignItems:"center", justifyContent:"center", fontWeight:700, fontSize:12, flexShrink:0 }}>{i+1}</div>
            <div style={{ flex:1 }}>
              <div style={{ fontWeight:700, color:B.dark, fontSize:15, marginBottom:8 }}>{idea.title}</div>
              <div style={{ marginBottom:5 }}><span style={S.tag("#E74C3C")}>Hook</span><span style={{ fontSize:13, color:B.dark }}>{idea.hook}</span></div>
              <div style={{ marginBottom:5 }}><span style={S.tag("#8E44AD")}>Body</span><span style={{ fontSize:13, color:B.dark }}>{idea.body}</span></div>
              <div style={{ marginBottom:5 }}><span style={S.tag(B.red)}>CTA</span><span style={{ fontSize:13, color:B.dark }}>{idea.cta}</span></div>
              <div style={{ background:B.softGold, borderRadius:8, padding:"7px 10px", fontSize:12, color:B.gold, marginTop:6 }}>💡 {idea.whyItWorks}</div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

// --- TAB 2: CAROUSEL ---
function CarouselTab() {
  const [topic, setTopic] = useState("");
  const [slides, setSlides] = useState([]);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");
  const colors = [B.red,"#8B4513",B.gold,"#2980B9",B.green,B.dark];

  async function build() {
    if (!topic.trim()) return;
    setLoading(true); setSlides([]); setErr("");
    try {
      const raw = await askClaude(`${CONTEXT}

Build a 6-slide Instagram/Pinterest carousel about: "${topic}"

Slide 1: Bold hook — a pain point or surprising statement
Slides 2-5: Value/steps/tips
Slide 6: Soft sell — mention her printables naturally

JSON only: {"slides":[{"slide":1,"headline":"...","body":"...","visual":"...","designTip":"..."}]}`);
      setSlides(JSON.parse(raw).slides || []);
    } catch(e) { setErr("Could not generate — please try again! " + (e.message||"")); }
    setLoading(false);
  }

  return (
    <div style={{ padding:"24px 0" }}>
      <p style={{ color:B.muted, fontSize:14, marginBottom:20 }}>Turn any topic into a ready-to-design carousel with visual directions for each slide.</p>
      <div style={{ marginBottom:12 }}>
        <label style={S.label}>Carousel Topic</label>
        <input value={topic} onChange={e=>setTopic(e.target.value)} placeholder="e.g. 5 ways to make toddler learning screen-free" style={S.input} onKeyDown={e=>e.key==="Enter"&&build()} />
      </div>
      <button onClick={build} disabled={loading||!topic.trim()} style={S.btn()}>🎠 Build Carousel</button>
      <Err msg={err} />
      {loading && <Spinner text="Building your carousel..." />}
      {slides.length > 0 && (
        <div style={{ marginTop:24, display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(250px,1fr))", gap:14 }}>
          {slides.map((slide,i) => (
            <div key={i} style={{ ...S.card, borderTop:`4px solid ${colors[i%colors.length]}`, padding:"16px" }}>
              <div style={{ fontSize:10, fontWeight:700, color:colors[i%colors.length], textTransform:"uppercase", letterSpacing:1, marginBottom:5 }}>Slide {slide.slide}</div>
              <div style={{ fontWeight:700, fontSize:14, color:B.dark, marginBottom:7 }}>{slide.headline}</div>
              <div style={{ fontSize:13, color:"#555", marginBottom:8, lineHeight:1.5 }}>{slide.body}</div>
              <div style={{ fontSize:12, color:B.muted, background:B.warm, borderRadius:6, padding:"6px 9px", marginBottom:6 }}>🖼️ <em>{slide.visual}</em></div>
              <div style={{ fontSize:11, color:B.gold, background:B.softGold, borderRadius:6, padding:"5px 9px" }}>✏️ {slide.designTip}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// --- TAB 3: REPURPOSE ---
function RepurposeTab() {
  const [topic, setTopic] = useState("");
  const [plan, setPlan] = useState(null);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  async function build() {
    if (!topic.trim()) return;
    setLoading(true); setPlan(null); setErr("");
    try {
      const raw = await askClaude(`${CONTEXT}

Create a full repurposing plan for this video topic: "${topic}"

She films ONE video. Turn it into content for: TikTok, Instagram Reels, Instagram Carousel, Pinterest Video Pin, Pinterest Static Pin, and an Etsy listing description angle.

For each platform give: specific caption (ready to copy-paste), hashtags (5-7), and one action tip.

JSON only: {"repurpose":[{"platform":"...","caption":"...","hashtags":["..."],"actionTip":"..."}]}`);
      setPlan(JSON.parse(raw).repurpose || []);
    } catch(e) { setErr("Could not generate — please try again! " + (e.message||"")); }
    setLoading(false);
  }

  const platformColors = { "TikTok":"#010101","Instagram Reels":"#C13584","Instagram Carousel":"#E1306C","Pinterest Video Pin":"#E60023","Pinterest Static Pin":"#AD081B","Etsy Listing":"#F1641E" };

  return (
    <div style={{ padding:"24px 0" }}>
      <p style={{ color:B.muted, fontSize:14, marginBottom:6 }}>Film <strong>once</strong>, post everywhere. Paste your video topic and get a ready-to-use plan for all 5 platforms + Etsy.</p>
      <div style={{ background:B.softGold, borderRadius:10, padding:"10px 14px", marginBottom:20, fontSize:13, color:B.gold }}>
        💡 <strong>Your butterfly video got 7,878 views.</strong> Use this tool to squeeze every last drop from content like that!
      </div>
      <div style={{ marginBottom:12 }}>
        <label style={S.label}>Your Video Topic</label>
        <input value={topic} onChange={e=>setTopic(e.target.value)} placeholder="e.g. Draw a butterfly with glue then peel it off" style={S.input} onKeyDown={e=>e.key==="Enter"&&build()} />
      </div>
      <button onClick={build} disabled={loading||!topic.trim()} style={S.btn()}>🔄 Build Repurposing Plan</button>
      <Err msg={err} />
      {loading && <Spinner text="Building your plan across all platforms..." />}
      {plan && plan.map((p,i) => (
        <div key={i} style={{ ...S.card, marginTop:14, borderLeft:`4px solid ${platformColors[p.platform]||B.red}` }}>
          <div style={{ fontWeight:700, color:platformColors[p.platform]||B.red, fontSize:13, marginBottom:8 }}>{p.platform}</div>
          <div style={{ fontSize:13, color:B.dark, lineHeight:1.6, marginBottom:8, background:B.cream, borderRadius:8, padding:"10px 12px" }}>{p.caption}</div>
          <div style={{ display:"flex", flexWrap:"wrap", gap:5, marginBottom:8 }}>
            {p.hashtags?.map((h,j) => <span key={j} style={{ background:B.sand, color:B.muted, fontSize:11, borderRadius:20, padding:"2px 9px" }}>{h}</span>)}
          </div>
          <div style={{ fontSize:12, color:B.green, background:B.softGreen, borderRadius:7, padding:"6px 10px" }}>✅ {p.actionTip}</div>
        </div>
      ))}
    </div>
  );
}

// --- TAB 4: PINTEREST SEO ---
function PinterestTab() {
  const [pinTopic, setPinTopic] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");
  const [copied, setCopied] = useState("");

  async function generate() {
    if (!pinTopic.trim()) return;
    setLoading(true); setResult(null); setErr("");
    try {
      const raw = await askClaude(`${CONTEXT}

Her Pinterest has 130K monthly views. Top pin: "Build, Stack, Learn! Wooden Puzzle" with 127,007 impressions — but it's an Amazon affiliate pin with 0 sales. She needs to redirect traffic to her OWN Etsy printables.

Generate Pinterest SEO content for this pin topic: "${pinTopic}"

Include:
- Pin title (max 100 chars, keyword-rich)
- Pin description (150-300 chars, conversational, keywords woven in naturally)
- 10 keywords/search terms homeschool moms actually type
- Board name suggestion
- One tip to link this to her Etsy

JSON only: {"title":"...","description":"...","keywords":["..."],"boardName":"...","etsyTip":"..."}`);
      setResult(JSON.parse(raw));
    } catch(e) { setErr("Could not generate — please try again! " + (e.message||"")); }
    setLoading(false);
  }

  function copy(text, key) {
    navigator.clipboard.writeText(text);
    setCopied(key);
    setTimeout(() => setCopied(""), 2000);
  }

  return (
    <div style={{ padding:"24px 0" }}>
      <div style={{ background:B.softRed, borderRadius:12, padding:"12px 16px", marginBottom:20, fontSize:13, color:B.red }}>
        🚨 <strong>Your 127K impression pin has 0 Etsy sales.</strong> This tool writes SEO descriptions that send Pinterest moms directly to YOUR products — not Amazon.
      </div>
      <div style={{ marginBottom:12 }}>
        <label style={S.label}>Pin Topic</label>
        <input value={pinTopic} onChange={e=>setPinTopic(e.target.value)} placeholder="e.g. Montessori toddler activity with wooden puzzle" style={S.input} onKeyDown={e=>e.key==="Enter"&&generate()} />
      </div>
      <button onClick={generate} disabled={loading||!pinTopic.trim()} style={S.btn("#E60023")}>📌 Generate Pinterest SEO</button>
      <Err msg={err} />
      {loading && <Spinner text="Writing your SEO content..." />}
      {result && (
        <div style={{ marginTop:22 }}>
          {[
            { label:"📌 Pin Title", key:"title", val:result.title },
            { label:"📝 Pin Description", key:"description", val:result.description },
          ].map(({label,key,val}) => (
            <div key={key} style={{ ...S.card, marginBottom:12 }}>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:8 }}>
                <div style={{ fontWeight:700, color:B.dark, fontSize:13 }}>{label}</div>
                <button onClick={()=>copy(val,key)} style={{ ...S.btn(copied===key?B.green:B.sand, copied===key?"#fff":B.muted), padding:"5px 12px", fontSize:11 }}>{copied===key?"✅ Copied!":"Copy"}</button>
              </div>
              <div style={{ fontSize:13, color:"#444", lineHeight:1.6, background:B.cream, borderRadius:8, padding:"10px 12px" }}>{val}</div>
            </div>
          ))}
          <div style={{ ...S.card, marginBottom:12 }}>
            <div style={{ fontWeight:700, color:B.dark, fontSize:13, marginBottom:10 }}>🔍 Keywords to Use</div>
            <div style={{ display:"flex", flexWrap:"wrap", gap:6 }}>
              {result.keywords?.map((k,i) => (
                <span key={i} onClick={()=>copy(k,`kw${i}`)} style={{ background:copied===`kw${i}`?B.green:B.sand, color:copied===`kw${i}`?"#fff":B.muted, fontSize:12, borderRadius:20, padding:"4px 11px", cursor:"pointer", transition:"all .2s" }}>{k}</span>
              ))}
            </div>
            <div style={{ fontSize:11, color:B.muted, marginTop:8 }}>Tap any keyword to copy it</div>
          </div>
          <div style={{ ...S.card, marginBottom:12 }}>
            <div style={{ fontWeight:700, color:B.dark, fontSize:13, marginBottom:5 }}>📋 Suggested Board Name</div>
            <div style={{ fontSize:13, color:"#444", background:B.cream, borderRadius:8, padding:"9px 12px" }}>{result.boardName}</div>
          </div>
          <div style={{ background:B.softGreen, borderRadius:12, padding:"12px 16px", fontSize:13, color:B.green }}>
            💸 <strong>Etsy Link Tip:</strong> {result.etsyTip}
          </div>
        </div>
      )}
    </div>
  );
}

// --- TAB 5: FREEBIE FUNNEL ---
function FreebieTab() {
  const [plan, setPlan] = useState(null);
  const [loading, setLoading] = useState(false);

  async function generate() {
    setLoading(true); setPlan(null);
    try {
      const raw = await askClaude(`${CONTEXT}

She has 130K Pinterest monthly views and needs to convert them into an email list and eventually Etsy buyers. Design a freebie lead magnet funnel specifically for CuriousLittleRed.

Create:
1. 3 freebie ideas (free printables she could offer) that homeschool moms would want badly enough to give their email
2. For the best freebie: the pin title + description to promote it
3. What to put in the thank-you email after they download
4. What to send in email #2 (3 days later) to softly sell a paid printable
5. One sentence explaining why this beats Amazon affiliate income

JSON only: {"freebieIdeas":[{"name":"...","why":"...","whatToInclude":"..."}],"bestFreebie":"...","pinPromo":{"title":"...","description":"..."},"thankYouEmail":{"subject":"...","body":"..."},"followUpEmail":{"subject":"...","body":"..."},"whyBetter":"..."}`);
      setPlan(JSON.parse(raw));
    } catch {}
    setLoading(false);
  }

  useEffect(() => { generate(); }, []);

  if (loading) return <Spinner text="Building your freebie funnel..." />;
  if (!plan) return <button onClick={generate} style={{ ...S.btn(), marginTop:24 }}>Load Freebie Plan</button>;

  return (
    <div style={{ padding:"24px 0" }}>
      <div style={{ background:B.softGreen, borderRadius:12, padding:"12px 16px", marginBottom:20, fontSize:13, color:B.green }}>
        💸 <strong>Why this beats Amazon affiliates:</strong> {plan.whyBetter}
      </div>
      <SectionTitle>🎁 3 Freebie Ideas for Your Email List</SectionTitle>
      {plan.freebieIdeas?.map((f,i) => (
        <div key={i} style={{ ...S.card, marginBottom:12, borderLeft:`4px solid ${i===0?B.red:B.sand}` }}>
          <div style={{ display:"flex", gap:8, alignItems:"flex-start" }}>
            {i===0 && <span style={{ background:B.red, color:"#fff", fontSize:10, fontWeight:700, borderRadius:5, padding:"2px 7px", flexShrink:0 }}>BEST</span>}
            <div>
              <div style={{ fontWeight:700, color:B.dark, fontSize:14, marginBottom:5 }}>{f.name}</div>
              <div style={{ fontSize:13, color:"#555", marginBottom:5 }}>{f.why}</div>
              <div style={{ fontSize:12, color:B.muted, background:B.warm, borderRadius:7, padding:"6px 10px" }}>📄 Include: {f.whatToInclude}</div>
            </div>
          </div>
        </div>
      ))}
      <SectionTitle style={{ marginTop:24 }}>📌 Pinterest Pin to Promote Your Freebie</SectionTitle>
      <div style={{ ...S.card, marginBottom:20 }}>
        <div style={{ fontWeight:700, color:"#E60023", fontSize:13, marginBottom:5 }}>Pin Title</div>
        <div style={{ fontSize:13, color:B.dark, background:B.cream, borderRadius:8, padding:"9px 12px", marginBottom:12 }}>{plan.pinPromo?.title}</div>
        <div style={{ fontWeight:700, color:"#E60023", fontSize:13, marginBottom:5 }}>Pin Description</div>
        <div style={{ fontSize:13, color:B.dark, background:B.cream, borderRadius:8, padding:"9px 12px" }}>{plan.pinPromo?.description}</div>
      </div>
      <SectionTitle>📧 Email #1 — Thank You Email (Instant)</SectionTitle>
      <div style={{ ...S.card, marginBottom:12 }}>
        <div style={{ fontWeight:700, color:B.dark, fontSize:12, marginBottom:4 }}>Subject: {plan.thankYouEmail?.subject}</div>
        <div style={{ fontSize:13, color:"#555", lineHeight:1.6, background:B.cream, borderRadius:8, padding:"10px 12px", whiteSpace:"pre-wrap" }}>{plan.thankYouEmail?.body}</div>
      </div>
      <SectionTitle>📧 Email #2 — Soft Sell (3 Days Later)</SectionTitle>
      <div style={{ ...S.card, marginBottom:12 }}>
        <div style={{ fontWeight:700, color:B.dark, fontSize:12, marginBottom:4 }}>Subject: {plan.followUpEmail?.subject}</div>
        <div style={{ fontSize:13, color:"#555", lineHeight:1.6, background:B.cream, borderRadius:8, padding:"10px 12px", whiteSpace:"pre-wrap" }}>{plan.followUpEmail?.body}</div>
      </div>
      <button onClick={generate} style={{ ...S.btn("transparent",B.red), border:`2px solid ${B.red}`, marginTop:4 }}>🔄 Regenerate Plan</button>
    </div>
  );
}

// --- TAB 6: TRACKER ---
const STORE_KEY = "clr_v2_posts";

function TrackerTab() {
  const [posts, setPosts] = useState(() => { try { return JSON.parse(localStorage.getItem(STORE_KEY)||"[]"); } catch { return []; } });
  const [form, setForm] = useState({ platform:"TikTok", title:"", views:"", likes:"", comments:"", saves:"", date:new Date().toISOString().slice(0,10) });
  const [showForm, setShowForm] = useState(false);
  const [insights, setInsights] = useState([]);
  const [loadingInsights, setLoadingInsights] = useState(false);

  function save() {
    if (!form.title) return;
    const updated = [{ ...form, id:Date.now(), views:+form.views||0, likes:+form.likes||0, comments:+form.comments||0, saves:+form.saves||0 }, ...posts];
    setPosts(updated);
    localStorage.setItem(STORE_KEY, JSON.stringify(updated));
    setForm({ platform:"TikTok", title:"", views:"", likes:"", comments:"", saves:"", date:new Date().toISOString().slice(0,10) });
    setShowForm(false);
  }

  function remove(id) {
    const updated = posts.filter(p=>p.id!==id);
    setPosts(updated);
    localStorage.setItem(STORE_KEY, JSON.stringify(updated));
  }

  async function getInsights() {
    if (!posts.length) return;
    setLoadingInsights(true); setInsights([]);
    try {
      const summary = posts.slice(0,10).map(p=>`"${p.title}" on ${p.platform}: ${p.views} views, ${p.likes} likes, ${p.comments} comments, ${p.saves} saves`).join("\n");
      const raw = await askClaude(`${CONTEXT}

Analyze this post performance data and give 4 short, actionable insights for CuriousLittleRed. Be specific. Compare to her known best performer (butterfly DIY = 7,878 views). Tell her what to do MORE of and what to stop.\n\n${summary}\n\nJSON only: {"insights":["...","...","...","..."]}`);
      setInsights(JSON.parse(raw).insights||[]);
    } catch { setInsights(["Could not load insights. Try again!"]); }
    setLoadingInsights(false);
  }

  const totalViews = posts.reduce((a,p)=>a+p.views,0);
  const topPost = posts.length ? posts.reduce((a,b)=>a.views>b.views?a:b) : null;

  return (
    <div style={{ padding:"24px 0" }}>
      <p style={{ color:B.muted, fontSize:14, marginBottom:18 }}>Log your posts and get AI analysis on what's actually working for CuriousLittleRed.</p>
      {posts.length > 0 && (
        <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:10, marginBottom:20 }}>
          {[["Posts Logged", posts.length,"📝"],["Total Views",totalViews.toLocaleString(),"👁️"],["Top Post",topPost?.views.toLocaleString()||"-","🔥"]].map(([l,v,ic])=>(
            <div key={l} style={{ background:B.cream, border:`1px solid ${B.sand}`, borderRadius:12, padding:"12px", textAlign:"center" }}>
              <div style={{ fontSize:20 }}>{ic}</div>
              <div style={{ fontSize:20, fontWeight:700, color:B.red }}>{v}</div>
              <div style={{ fontSize:11, color:B.muted }}>{l}</div>
            </div>
          ))}
        </div>
      )}
      <div style={{ display:"flex", gap:10, marginBottom:20, flexWrap:"wrap" }}>
        <button onClick={()=>setShowForm(!showForm)} style={S.btn()}>+ Log Post</button>
        {posts.length > 0 && <button onClick={getInsights} disabled={loadingInsights} style={S.btn(B.green)}>{loadingInsights?"Analyzing...":"🔍 AI Insights"}</button>}
      </div>
      {showForm && (
        <div style={{ ...S.card, marginBottom:18 }}>
          <div style={{ fontWeight:700, color:B.dark, marginBottom:14 }}>Log a New Post</div>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10 }}>
            <div>
              <label style={S.label}>Platform</label>
              <select value={form.platform} onChange={e=>setForm({...form,platform:e.target.value})} style={S.input}>
                {["TikTok","Instagram Reels","Pinterest","Instagram Carousel"].map(p=><option key={p}>{p}</option>)}
              </select>
            </div>
            <div>
              <label style={S.label}>Date</label>
              <input type="date" value={form.date} onChange={e=>setForm({...form,date:e.target.value})} style={S.input} />
            </div>
            <div style={{ gridColumn:"1/-1" }}>
              <label style={S.label}>Post Title / Topic</label>
              <input value={form.title} onChange={e=>setForm({...form,title:e.target.value})} placeholder="What was the post about?" style={S.input} />
            </div>
            {[["views","👁️ Views"],["likes","❤️ Likes"],["comments","💬 Comments"],["saves","🔖 Saves"]].map(([k,l])=>(
              <div key={k}>
                <label style={S.label}>{l}</label>
                <input type="number" value={form[k]} onChange={e=>setForm({...form,[k]:e.target.value})} placeholder="0" style={S.input} />
              </div>
            ))}
          </div>
          <button onClick={save} style={{ ...S.btn(), marginTop:14 }}>Save Post</button>
        </div>
      )}
      {insights.length > 0 && (
        <div style={{ ...S.card, background:B.softGreen, borderColor:B.green, marginBottom:16 }}>
          <div style={{ fontWeight:700, color:B.green, marginBottom:10 }}>🔍 AI Insights for CuriousLittleRed</div>
          {insights.map((ins,i)=><div key={i} style={{ fontSize:13, color:B.dark, marginBottom:7 }}>• {ins}</div>)}
        </div>
      )}
      {posts.length === 0 && <div style={{ textAlign:"center", color:B.muted, padding:"40px 0", fontSize:14 }}>No posts yet. Log your first one! 📝</div>}
      {posts.map(p=>(
        <div key={p.id} style={{ ...S.card, display:"flex", justifyContent:"space-between", marginBottom:10 }}>
          <div>
            <div style={{ fontWeight:600, color:B.dark, marginBottom:3 }}>{p.title}</div>
            <div style={{ fontSize:11, color:B.muted, marginBottom:6 }}>{p.platform} · {p.date}</div>
            <div style={{ display:"flex", gap:12, fontSize:12 }}>
              <span>👁️ {p.views?.toLocaleString()}</span>
              <span>❤️ {p.likes}</span>
              <span>💬 {p.comments}</span>
              <span>🔖 {p.saves}</span>
            </div>
          </div>
          <button onClick={()=>remove(p.id)} style={{ background:"none", border:"none", cursor:"pointer", color:"#ccc", fontSize:18, alignSelf:"flex-start" }}>x</button>
        </div>
      ))}
    </div>
  );
}

// --- TAB 7: BLOG ---
function BlogTab() {
  const [topic, setTopic] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loadingSuggestions, setLoadingSuggestions] = useState(false);
  const [err, setErr] = useState("");
  const [copied, setCopied] = useState(false);

  async function getSuggestions() {
    setLoadingSuggestions(true); setSuggestions([]); setErr("");
    try {
      const raw = await askClaude(`${CONTEXT}

Suggest 6 blog post topics for CuriousLittleRed's website. Topics should help homeschool moms of toddlers, naturally lead to her printables, and be good for Pinterest SEO.

JSON only: {"topics":["...","...","...","...","...","..."]}`);
      setSuggestions(JSON.parse(raw).topics || []);
    } catch(e) { setErr("Could not load suggestions. " + (e.message||"")); }
    setLoadingSuggestions(false);
  }

  async function generatePost() {
    if (!topic.trim()) return;
    setLoading(true); setPost(null); setErr("");
    try {
      const raw = await askClaude(`${CONTEXT}

Write a complete blog post for CuriousLittleRed's website about: "${topic}"

Requirements:
- Warm, conversational tone — like a homeschool mom talking to another mom
- 600-800 words
- Include: intro, 3-5 practical tips or steps, a natural mention of her printables, closing with encouragement
- SEO-friendly with keywords homeschool moms search for
- End with a Pinterest-friendly summary (2 sentences max) they can use as a pin description

JSON only: {"title":"...","intro":"...","sections":[{"heading":"...","content":"..."}],"printableMention":"...","closing":"...","pinterestSummary":"..."}`, 2000);
      setPost(JSON.parse(raw));
    } catch(e) { setErr("Could not generate — please try again! " + (e.message||"")); }
    setLoading(false);
  }

  function copyPost() {
    if (!post) return;
    const text = `${post.title}\n\n${post.intro}\n\n${post.sections.map(s=>`${s.heading}\n${s.content}`).join("\n\n")}\n\n${post.printableMention}\n\n${post.closing}\n\n---\nPinterest Summary: ${post.pinterestSummary}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div style={{ padding:"24px 0" }}>
      <p style={{ color:B.muted, fontSize:14, marginBottom:20 }}>Write blog posts that bring Pinterest moms to your site and naturally lead them to your printables.</p>

      <div style={{ marginBottom:16 }}>
        <label style={S.label}>Blog Topic</label>
        <input
          value={topic}
          onChange={e=>setTopic(e.target.value)}
          placeholder="e.g. Easy Montessori activities for toddlers at home"
          style={S.input}
          onKeyDown={e=>e.key==="Enter"&&generatePost()}
        />
      </div>

      <div style={{ display:"flex", gap:10, flexWrap:"wrap", marginBottom:20 }}>
        <button onClick={generatePost} disabled={loading||!topic.trim()} style={S.btn()}>✍️ Write Blog Post</button>
        <button onClick={getSuggestions} disabled={loadingSuggestions} style={S.btn(B.gold)}>💡 Suggest Topics</button>
      </div>

      <Err msg={err} />

      {loadingSuggestions && <Spinner text="Finding great topics for you..." />}

      {suggestions.length > 0 && (
        <div style={{ ...S.card, marginBottom:20 }}>
          <div style={{ fontWeight:700, color:B.dark, fontSize:13, marginBottom:12 }}>💡 Topic Ideas — click one to use it</div>
          <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
            {suggestions.map((s,i) => (
              <div key={i} onClick={()=>{ setTopic(s); setSuggestions([]); }} style={{ background:B.cream, border:`1px solid ${B.sand}`, borderRadius:10, padding:"10px 14px", fontSize:13, color:B.dark, cursor:"pointer" }}>
                {s}
              </div>
            ))}
          </div>
        </div>
      )}

      {loading && <Spinner text="Writing your blog post..." />}

      {post && (
        <div style={{ marginTop:10 }}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:16 }}>
            <div style={{ fontWeight:700, color:B.dark, fontSize:18 }}>{post.title}</div>
            <button onClick={copyPost} style={S.btn(copied?B.green:B.red)}>{copied?"✅ Copied!":"📋 Copy All"}</button>
          </div>

          <div style={{ ...S.card, marginBottom:12 }}>
            <div style={{ fontWeight:700, color:B.muted, fontSize:11, textTransform:"uppercase", letterSpacing:0.8, marginBottom:8 }}>Intro</div>
            <div style={{ fontSize:14, color:B.dark, lineHeight:1.7 }}>{post.intro}</div>
          </div>

          {post.sections?.map((sec,i) => (
            <div key={i} style={{ ...S.card, marginBottom:12 }}>
              <div style={{ fontWeight:700, color:B.dark, fontSize:15, marginBottom:8 }}>{sec.heading}</div>
              <div style={{ fontSize:14, color:"#444", lineHeight:1.7 }}>{sec.content}</div>
            </div>
          ))}

          <div style={{ ...S.card, marginBottom:12, borderLeft:`4px solid ${B.red}` }}>
            <div style={{ fontWeight:700, color:B.red, fontSize:11, textTransform:"uppercase", letterSpacing:0.8, marginBottom:8 }}>Printable Mention</div>
            <div style={{ fontSize:14, color:B.dark, lineHeight:1.7 }}>{post.printableMention}</div>
          </div>

          <div style={{ ...S.card, marginBottom:12 }}>
            <div style={{ fontWeight:700, color:B.muted, fontSize:11, textTransform:"uppercase", letterSpacing:0.8, marginBottom:8 }}>Closing</div>
            <div style={{ fontSize:14, color:B.dark, lineHeight:1.7 }}>{post.closing}</div>
          </div>

          <div style={{ background:B.softGold, borderRadius:12, padding:"14px 16px" }}>
            <div style={{ fontWeight:700, color:B.gold, fontSize:11, textTransform:"uppercase", letterSpacing:0.8, marginBottom:6 }}>📌 Pinterest Summary</div>
            <div style={{ fontSize:13, color:B.dark, lineHeight:1.6 }}>{post.pinterestSummary}</div>
          </div>
        </div>
      )}
    </div>
  );
}

// --- APP SHELL ---
export default function App() {
  const [active, setActive] = useState("ideas");

  return (
    <div style={{ minHeight:"100vh", background:B.cream, fontFamily:"'Palatino Linotype', 'Book Antiqua', Palatino, serif" }}>
      <div style={{ background:`linear-gradient(135deg, ${B.darkRed} 0%, ${B.red} 100%)`, paddingBottom:0, boxShadow:"0 4px 20px rgba(0,0,0,0.2)" }}>
        <div style={{ maxWidth:740, margin:"0 auto", padding:"18px 20px 0" }}>
          <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:16 }}>
            <div style={{ width:44, height:44, background:"#fff", borderRadius:"50%", display:"flex", alignItems:"center", justifyContent:"center", fontSize:22, boxShadow:"0 2px 8px rgba(0,0,0,0.2)", flexShrink:0 }}>🍂</div>
            <div>
              <div style={{ color:"#fff", fontWeight:700, fontSize:20, lineHeight:1.1 }}>CuriousLittleRed</div>
              <div style={{ color:"rgba(255,255,255,0.7)", fontSize:11, letterSpacing:0.5 }}>Content Command Center v2 · Built for your 130K Pinterest viewers</div>
            </div>
          </div>
          <div style={{ display:"flex", gap:2, overflowX:"auto", paddingBottom:0 }}>
            {TABS.map(t=>(
              <button key={t.id} onClick={()=>setActive(t.id)} style={S.pill(active===t.id)}>
                {t.icon} {t.label}
              </button>
            ))}
          </div>
        </div>
      </div>
      <div style={{ maxWidth:740, margin:"0 auto", padding:"0 18px 60px" }}>
        {active==="ideas"     && <IdeasTab />}
        {active==="carousel"  && <CarouselTab />}
        {active==="repurpose" && <RepurposeTab />}
        {active==="pinterest" && <PinterestTab />}
        {active==="freebie"   && <FreebieTab />}
        {active==="tracker"   && <TrackerTab />}
        {active==="blog"      && <BlogTab />}
      </div>
    </div>
  );
}
