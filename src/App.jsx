<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Janice C Photography — Command Center</title>
<link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;1,400&family=Jost:wght@300;400;500&display=swap" rel="stylesheet">
<style>
:root {
  --ink: #2A1F1A;
  --warm: #F7F2EC;
  --paper: #FBF8F4;
  --blush: #D4907A;
  --rose: #B86B52;
  --deep: #8B4A35;
  --mid: #7A6358;
  --light: #C4AFA6;
  --border: #E8DDD8;
  --green: #4A7A5A;
  --red: #9A3A3A;
  --gold: #B8922A;
}
* { box-sizing: border-box; margin: 0; padding: 0; }
body { font-family: 'Jost', sans-serif; background: var(--paper); color: var(--ink); min-height: 100vh; }

header {
  background: var(--ink);
  padding: 18px 20px 0;
  position: sticky; top: 0; z-index: 50;
}
.header-top { display: flex; align-items: center; gap: 12px; margin-bottom: 16px; }
.logo { width: 36px; height: 36px; border-radius: 50%; background: var(--blush); display: flex; align-items: center; justify-content: center; font-size: 16px; }
.header-text h1 { font-family: 'Playfair Display', serif; font-size: 18px; color: var(--warm); font-weight: 400; }
.header-text p { font-size: 10px; color: var(--light); letter-spacing: 1.5px; text-transform: uppercase; margin-top: 1px; }

.tabs { display: flex; overflow-x: auto; gap: 0; scrollbar-width: none; }
.tabs::-webkit-scrollbar { display: none; }
.tab {
  flex-shrink: 0; padding: 10px 14px;
  font-family: 'Jost', sans-serif; font-size: 11px; font-weight: 500;
  letter-spacing: 0.8px; text-transform: uppercase;
  color: var(--light); background: transparent;
  border: none; border-bottom: 2px solid transparent;
  cursor: pointer; transition: all 0.2s; white-space: nowrap;
}
.tab.active { color: var(--blush); border-bottom: 2px solid var(--blush); }

.section { display: none; padding: 20px 16px 100px; }
.section.active { display: block; }
.section-intro { font-size: 13px; color: var(--mid); line-height: 1.6; margin-bottom: 20px; padding: 12px 14px; background: var(--warm); border-radius: 10px; border-left: 3px solid var(--blush); }

.form-group { margin-bottom: 14px; }
label { display: block; font-size: 10px; font-weight: 500; letter-spacing: 1px; text-transform: uppercase; color: var(--mid); margin-bottom: 6px; }
select, input, textarea {
  width: 100%; padding: 11px 14px;
  border: 1px solid var(--border); border-radius: 10px;
  font-family: 'Jost', sans-serif; font-size: 14px; color: var(--ink);
  background: white; outline: none; transition: border 0.15s; appearance: none;
}
select { background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%237A6358' d='M6 8L1 3h10z'/%3E%3C/svg%3E"); background-repeat: no-repeat; background-position: right 14px center; padding-right: 36px; }
select:focus, input:focus, textarea:focus { border-color: var(--blush); }
textarea { resize: vertical; min-height: 90px; line-height: 1.6; }
.form-row { display: flex; gap: 10px; }
.form-row .form-group { flex: 1; }

.btn-generate {
  width: 100%; padding: 14px;
  background: var(--rose); color: white; border: none;
  border-radius: 12px; font-family: 'Jost', sans-serif;
  font-size: 14px; font-weight: 500; cursor: pointer;
  letter-spacing: 0.5px; transition: all 0.2s; margin-top: 4px;
}
.btn-generate:hover { background: var(--deep); }

.btn { font-family: 'Jost', sans-serif; font-size: 12px; font-weight: 500; padding: 7px 14px; border-radius: 8px; border: none; cursor: pointer; transition: all 0.15s; }
.btn-outline { background: transparent; color: var(--mid); border: 1px solid var(--border); }
.btn-outline:hover { background: var(--warm); }
.btn-sm { font-size: 11px; padding: 5px 10px; }
.btn-copy { background: var(--warm); color: var(--rose); border: 1px solid var(--border); }
.btn-copy:hover { background: var(--blush); color: white; }
.btn-save { background: var(--green); color: white; }
.btn-danger { background: transparent; color: var(--red); border: 1px solid #FDEAEA; }

.result-card {
  background: white; border: 1px solid var(--border);
  border-radius: 14px; padding: 18px; margin-top: 16px;
  animation: fadeUp 0.3s ease;
}
@keyframes fadeUp { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
.result-title { font-family: 'Playfair Display', serif; font-size: 16px; color: var(--ink); margin-bottom: 12px; }
.result-body { font-size: 13px; color: var(--mid); line-height: 1.8; white-space: pre-wrap; }
.result-actions { display: flex; gap: 8px; margin-top: 14px; flex-wrap: wrap; }

.script-box { background: var(--warm); border-radius: 10px; padding: 14px; margin-top: 12px; border-left: 3px solid var(--blush); }
.script-label { font-size: 10px; font-weight: 500; letter-spacing: 1px; text-transform: uppercase; color: var(--blush); margin-bottom: 8px; }

.tracker-card { background: white; border: 1px solid var(--border); border-radius: 12px; padding: 14px; margin-bottom: 10px; }
.tracker-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 8px; }
.tracker-name { font-family: 'Playfair Display', serif; font-size: 16px; color: var(--ink); }
.tracker-type { font-size: 11px; color: var(--mid); margin-top: 2px; }
.badge { font-size: 10px; font-weight: 500; padding: 3px 10px; border-radius: 20px; white-space: nowrap; }
.badge-yes { background: #E8F5E8; color: var(--green); }
.badge-no { background: #FDEAEA; color: var(--red); }
.badge-followup { background: #FEF6E4; color: var(--gold); }
.badge-pending { background: var(--warm); color: var(--mid); }
.tracker-actions { display: flex; gap: 8px; margin-top: 10px; flex-wrap: wrap; align-items: center; }
.status-select { padding: 5px 10px; font-size: 11px; border-radius: 8px; border: 1px solid var(--border); background: var(--warm); color: var(--mid); font-family: 'Jost', sans-serif; width: auto; appearance: none; }

.loading { text-align: center; padding: 32px; color: var(--light); }
.loading-dots { display: inline-flex; gap: 4px; }
.loading-dots span { width: 6px; height: 6px; border-radius: 50%; background: var(--blush); animation: bounce 1.2s infinite; }
.loading-dots span:nth-child(2) { animation-delay: 0.2s; }
.loading-dots span:nth-child(3) { animation-delay: 0.4s; }
@keyframes bounce { 0%,80%,100% { transform: scale(0.8); opacity: 0.5; } 40% { transform: scale(1.2); opacity: 1; } }

.saved-section { margin-top: 28px; }
.saved-title { font-size: 10px; font-weight: 500; letter-spacing: 1.5px; text-transform: uppercase; color: var(--light); margin-bottom: 12px; display: flex; align-items: center; gap: 8px; }
.saved-title::after { content: ''; flex: 1; height: 1px; background: var(--border); }
.empty { text-align: center; padding: 32px 16px; color: var(--light); font-size: 13px; }
.empty-icon { font-size: 32px; margin-bottom: 8px; }
</style>
</head>
<body>

<header>
  <div class="header-top">
    <div class="logo">📷</div>
    <div class="header-text">
      <h1>Janice C Photography</h1>
      <p>Command Center</p>
    </div>
  </div>
  <div class="tabs">
    <button class="tab active" onclick="switchTab('partners',this)">🤝 Partners</button>
    <button class="tab" onclick="switchTab('content',this)">📸 Content</button>
    <button class="tab" onclick="switchTab('blog',this)">✍️ Blog</button>
    <button class="tab" onclick="switchTab('marketing',this)">💡 Marketing</button>
    <button class="tab" onclick="switchTab('emails',this)">📧 Emails</button>
    <button class="tab" onclick="switchTab('prep',this)">🎯 Session Prep</button>
  </div>
</header>

<!-- PARTNERS -->
<div id="partners" class="section active">
  <p class="section-intro">Pick a business type and NoVA area. I will suggest the best partnership approach, what to offer, and give you a script to use.</p>
  <div class="form-row">
    <div class="form-group">
      <label>Business Type</label>
      <select id="p_type">
        <option>Toddler Gym</option>
        <option>Preschool / Montessori</option>
        <option>Kids Hair Salon</option>
        <option>Baby Boutique</option>
        <option>Maternity Boutique</option>
        <option>Pediatric Dentist</option>
        <option>Pediatrician Office</option>
        <option>Prenatal Yoga Studio</option>
        <option>Kids Art Studio</option>
        <option>Children's Dance School</option>
        <option>Baby Gear / Consignment</option>
        <option>Kids Music Class</option>
        <option>Postpartum Support Group</option>
        <option>Mom Play Cafe</option>
      </select>
    </div>
    <div class="form-group">
      <label>NoVA Area</label>
      <select id="p_location">
        <option>Fairfax</option>
        <option>Arlington</option>
        <option>Alexandria</option>
        <option>Loudoun County</option>
        <option>Prince William County</option>
        <option>Reston</option>
        <option>Herndon</option>
        <option>Chantilly</option>
        <option>Ashburn</option>
        <option>Manassas</option>
      </select>
    </div>
  </div>
  <button class="btn-generate" onclick="generatePartner()">✨ Generate Partnership Strategy</button>
  <div id="partnerResult"></div>
  <div class="saved-section">
    <div class="saved-title">Saved Partners</div>
    <div id="partnerTracker"></div>
  </div>
</div>

<!-- CONTENT -->
<div id="content" class="section">
  <p class="section-intro">Pick your content type and platform. I will write a caption in your voice. Warm, real, mom to mom. No fluff.</p>
  <div class="form-row">
    <div class="form-group">
      <label>Content Type</label>
      <select id="c_type">
        <option>Candid Family Moment</option>
        <option>Mama and Me</option>
        <option>Maternity</option>
        <option>Behind the Scenes</option>
        <option>Mini Session Promo</option>
        <option>Full Session Promo</option>
        <option>Client Spotlight</option>
        <option>Personal Mom Life</option>
        <option>Why Book a Session</option>
        <option>Outfit Inspiration</option>
        <option>Location Spotlight</option>
        <option>Referral Ask</option>
      </select>
    </div>
    <div class="form-group">
      <label>Platform</label>
      <select id="c_platform">
        <option>Instagram</option>
        <option>Facebook</option>
        <option>Pinterest</option>
        <option>Instagram and Facebook</option>
      </select>
    </div>
  </div>
  <div class="form-group">
    <label>Any specific detail to include? (optional)</label>
    <input id="c_detail" placeholder="e.g. spring minis, National Harbor, toddler who wouldn't stop running...">
  </div>
  <button class="btn-generate" onclick="generateContent()">✨ Write My Caption</button>
  <div id="contentResult"></div>
</div>

<!-- BLOG -->
<div id="blog" class="section">
  <p class="section-intro">Story-first blogs that NoVA mamas actually want to read. Real moments, real talk, nothing generic.</p>
  <div class="form-row">
    <div class="form-group">
      <label>Blog Type</label>
      <select id="b_type">
        <option>Session Story</option>
        <option>Personal Mom Story</option>
        <option>Mom Relatable Post</option>
        <option>AI Tips for Moms</option>
        <option>Photography Tips for Clients</option>
      </select>
    </div>
    <div class="form-group">
      <label>Tone</label>
      <select id="b_tone">
        <option>Warm and Honest</option>
        <option>Funny and Relatable</option>
        <option>Emotional and Real</option>
        <option>Helpful and Simple</option>
      </select>
    </div>
  </div>
  <div class="form-group">
    <label>What is the story or topic?</label>
    <textarea id="b_topic" placeholder="e.g. I photographed a family at Great Falls and the toddler cried the whole time and we still got the most beautiful shots..."></textarea>
  </div>
  <button class="btn-generate" onclick="generateBlog()">✨ Write My Blog Draft</button>
  <div id="blogResult"></div>
</div>

<!-- MARKETING -->
<div id="marketing" class="section">
  <p class="section-intro">Pick your session type, season, and goal. I will give you real marketing ideas you can actually do this week.</p>
  <div class="form-row">
    <div class="form-group">
      <label>Session Type</label>
      <select id="m_session">
        <option>Mini Session</option>
        <option>Full Session</option>
        <option>Maternity</option>
        <option>Mama and Me</option>
        <option>All Sessions</option>
      </select>
    </div>
    <div class="form-group">
      <label>Season or Topic</label>
      <select id="m_season">
        <option>Spring</option>
        <option>Summer</option>
        <option>Fall</option>
        <option>Winter</option>
        <option>Valentine's Day</option>
        <option>Mother's Day</option>
        <option>Back to School</option>
        <option>Christmas / Holiday</option>
        <option>New Year</option>
        <option>Evergreen (no season)</option>
      </select>
    </div>
  </div>
  <div class="form-group">
    <label>Goal</label>
    <select id="m_goal">
      <option>Get Bookings</option>
      <option>Build Awareness</option>
      <option>Get Referrals</option>
      <option>Grow Email List</option>
      <option>Find Partner Businesses</option>
      <option>Re-engage Past Clients</option>
    </select>
  </div>
  <button class="btn-generate" onclick="generateMarketing()">✨ Give Me Marketing Ideas</button>
  <div id="marketingResult"></div>
</div>

<!-- EMAILS -->
<div id="emails" class="section">
  <p class="section-intro">Ready to send emails in your voice. Copy, tweak the names, send. That is it.</p>
  <div class="form-group">
    <label>Email Type</label>
    <select id="e_type">
      <option>Inquiry Reply</option>
      <option>Booking Confirmation</option>
      <option>Session Prep</option>
      <option>Gallery Delivery</option>
      <option>Review Ask</option>
      <option>Referral Ask</option>
      <option>Follow Up (no response)</option>
      <option>Rescheduling</option>
    </select>
  </div>
  <div class="form-group">
    <label>Session Type</label>
    <select id="e_session">
      <option>Mini Session</option>
      <option>Full Session</option>
      <option>Maternity</option>
      <option>Mama and Me</option>
    </select>
  </div>
  <div class="form-group">
    <label>Any detail to personalize? (optional)</label>
    <input id="e_detail" placeholder="e.g. client has a 2 year old, session at Great Falls, gallery ready in 2 weeks...">
  </div>
  <button class="btn-generate" onclick="generateEmail()">✨ Write My Email</button>
  <div id="emailResult"></div>
</div>

<!-- SESSION PREP -->
<div id="prep" class="section">
  <p class="section-intro">Fill in the family details and I will write a personal prep guide you can send straight to your client.</p>
  <div class="form-row">
    <div class="form-group">
      <label>Session Type</label>
      <select id="sp_session">
        <option>Mini Session</option>
        <option>Full Session</option>
        <option>Maternity</option>
        <option>Mama and Me</option>
      </select>
    </div>
    <div class="form-group">
      <label>Location Type</label>
      <select id="sp_location">
        <option>Outdoor Park</option>
        <option>Home Studio</option>
        <option>Backyard</option>
        <option>Urban / Downtown</option>
        <option>Beach / Waterfront</option>
      </select>
    </div>
  </div>
  <div class="form-row">
    <div class="form-group">
      <label>Number of Kids</label>
      <select id="sp_kids">
        <option>No kids (mama only)</option>
        <option>1 kid</option>
        <option>2 kids</option>
        <option>3 or more kids</option>
        <option>Newborn</option>
      </select>
    </div>
    <div class="form-group">
      <label>Youngest Kid Age</label>
      <select id="sp_age">
        <option>N/A</option>
        <option>Newborn (0-3 months)</option>
        <option>Baby (4-12 months)</option>
        <option>Toddler (1-3 years)</option>
        <option>Preschool (3-5 years)</option>
        <option>School age (6+)</option>
      </select>
    </div>
  </div>
  <div class="form-group">
    <label>Vibe or Style</label>
    <select id="sp_vibe">
      <option>Light and Airy</option>
      <option>Warm and Cozy</option>
      <option>Natural and Earthy</option>
      <option>Fun and Playful</option>
      <option>Elegant and Timeless</option>
    </select>
  </div>
  <div class="form-group">
    <label>Anything specific about this family? (optional)</label>
    <input id="sp_notes" placeholder="e.g. toddler is shy, mama is pregnant, they love being outdoors...">
  </div>
  <button class="btn-generate" onclick="generatePrep()">✨ Generate Session Prep Guide</button>
  <div id="prepResult"></div>
</div>

<script>
function loadPartners() { try { return JSON.parse(localStorage.getItem('jcp_p')) || []; } catch { return []; } }
function savePartners(d) { try { localStorage.setItem('jcp_p', JSON.stringify(d)); } catch {} }
let savedPartners = loadPartners();

function switchTab(tab, btn) {
  document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
  document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
  document.getElementById(tab).classList.add('active');
  btn.classList.add('active');
}

function copyText(text) {
  navigator.clipboard.writeText(text).catch(() => {});
  alert('Copied!');
}

function showLoading(id) {
  document.getElementById(id).innerHTML = `<div class="loading"><div class="loading-dots"><span></span><span></span><span></span></div><p style="margin-top:12px;font-size:13px">Writing just for you...</p></div>`;
}

async function callClaude(prompt) {
  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "claude-sonnet-4-20250514",
      max_tokens: 1000,
      system: `You are a writing assistant for Janice C Photography, a family portrait photographer in Northern Virginia.

Janice's voice: warm, real, direct, mom to mom. She has a 3 year old toddler. She connects with NoVA mamas who want candid, unhurried, heirloom photos. Not posed. Real moments.

Her brand line: The moments you forgot to notice.
Mini Session: $249, 20 min, 5 photos. Full Session: $449, 60 min, 10 photos.
Her edge: She is a mom too. No stress. No posing. Real life, beautifully captured.

Voice rules: Write like a real person talking. Short sentences. Simple words. No flowery AI phrases like cherish or timeless memories or capture the magic. Warm but not dramatic. Direct and honest. Mom to mom energy. Never use dashes in copy.`,
      messages: [{ role: "user", content: prompt }]
    })
  });
  const data = await res.json();
  return data.content[0].text;
}

async function generatePartner() {
  const type = document.getElementById('p_type').value;
  const loc = document.getElementById('p_location').value;
  showLoading('partnerResult');
  try {
    const result = await callClaude(`Generate a partnership strategy for Janice C Photography to partner with a ${type} in ${loc}, Virginia.

Use exactly these headers:

WHY THIS WORKS
[2-3 sentences on why this is a great partner. Be specific.]

WHAT TO OFFER
[2-3 concrete offers. Real and specific.]

HOW TO APPROACH THEM
[Walk in, email, or DM? Be specific.]

OUTREACH SCRIPT
[Exact words Janice says or sends. Warm, real, under 5 sentences. No formal language.]`);

    const safeResult = result.replace(/`/g, "'").replace(/\\/g, "");
    document.getElementById('partnerResult').innerHTML = `
      <div class="result-card">
        <div class="result-title">${type} in ${loc}</div>
        <div class="result-body">${result}</div>
        <div class="result-actions">
          <button class="btn btn-copy btn-sm" onclick='copyText(${JSON.stringify(result)})'>Copy All</button>
          <button class="btn btn-save btn-sm" onclick='promptSavePartner(${JSON.stringify(type)}, ${JSON.stringify(loc)}, ${JSON.stringify(safeResult)})'>Save to Tracker</button>
        </div>
      </div>`;
  } catch(e) {
    document.getElementById('partnerResult').innerHTML = `<div class="result-card"><p style="color:var(--red);font-size:13px">Something went wrong. Try again.</p></div>`;
  }
}

function promptSavePartner(type, loc, script) {
  const name = prompt('Business name? (leave blank to use type + area)');
  const entry = { id: Date.now(), name: name || `${type} in ${loc}`, type, loc, script, status: 'Not Contacted', notes: '' };
  savedPartners.push(entry);
  savePartners(savedPartners);
  renderTracker();
  alert('Saved!');
}

function renderTracker() {
  const el = document.getElementById('partnerTracker');
  if (!savedPartners.length) {
    el.innerHTML = `<div class="empty"><div class="empty-icon">🤝</div><p>No partners saved yet.<br>Generate one above and hit Save.</p></div>`;
    return;
  }
  const bmap = { 'Not Contacted':'badge-pending','Contacted':'badge-pending','Follow Up':'badge-followup','Yes':'badge-yes','No':'badge-no' };
  el.innerHTML = savedPartners.map(p => `
    <div class="tracker-card">
      <div class="tracker-header">
        <div>
          <div class="tracker-name">${p.name}</div>
          <div class="tracker-type">${p.type} · ${p.loc}</div>
        </div>
        <span class="badge ${bmap[p.status]}">${p.status}</span>
      </div>
      ${p.notes ? `<div style="font-size:12px;color:var(--mid);margin-bottom:8px;font-style:italic">${p.notes}</div>` : ''}
      <div class="tracker-actions">
        <select class="status-select" onchange="updateStatus(${p.id},this.value)">
          ${['Not Contacted','Contacted','Follow Up','Yes','No'].map(s=>`<option ${p.status===s?'selected':''}>${s}</option>`).join('')}
        </select>
        <button class="btn btn-outline btn-sm" onclick="viewScript(${p.id})">Script</button>
        <button class="btn btn-outline btn-sm" onclick="addNote(${p.id})">Note</button>
        <button class="btn btn-danger btn-sm" onclick="deleteP(${p.id})">Remove</button>
      </div>
    </div>`).join('');
}

function updateStatus(id, status) {
  savedPartners = savedPartners.map(p => p.id===id ? {...p,status} : p);
  savePartners(savedPartners); renderTracker();
}
function viewScript(id) { const p = savedPartners.find(x=>x.id===id); if(p) alert(p.script); }
function addNote(id) {
  const note = prompt('Add a note:');
  if(note!==null) { savedPartners = savedPartners.map(p=>p.id===id?{...p,notes:note}:p); savePartners(savedPartners); renderTracker(); }
}
function deleteP(id) {
  if(!confirm('Remove this partner?')) return;
  savedPartners = savedPartners.filter(p=>p.id!==id); savePartners(savedPartners); renderTracker();
}

async function generateContent() {
  const type = document.getElementById('c_type').value;
  const platform = document.getElementById('c_platform').value;
  const detail = document.getElementById('c_detail').value;
  showLoading('contentResult');
  try {
    const result = await callClaude(`Write a ${platform} caption for Janice C Photography about: ${type}.
${detail ? 'Extra detail: ' + detail : ''}
Rules: In Janice's voice. Warm, real, mom to mom. Not salesy. ${platform==='Pinterest'?'Pinterest style: descriptive, 2-3 sentences, 5 hashtags.':'Instagram style: conversational, 3-5 sentences, soft call to action, 5-8 hashtags on new line.'} Include NoVA hashtags. No dashes. Sound like a real person. Write caption only, no intro.`);
    document.getElementById('contentResult').innerHTML = `
      <div class="result-card">
        <div class="result-title">${type} · ${platform}</div>
        <div class="result-body">${result}</div>
        <div class="result-actions">
          <button class="btn btn-copy btn-sm" onclick='copyText(${JSON.stringify(result)})'>Copy Caption</button>
          <button class="btn btn-outline btn-sm" onclick="generateContent()">Try Again</button>
        </div>
      </div>`;
  } catch(e) {
    document.getElementById('contentResult').innerHTML = `<div class="result-card"><p style="color:var(--red);font-size:13px">Something went wrong. Try again.</p></div>`;
  }
}

async function generateBlog() {
  const type = document.getElementById('b_type').value;
  const tone = document.getElementById('b_tone').value;
  const topic = document.getElementById('b_topic').value;
  if (!topic.trim()) { alert('Tell me what the blog is about first.'); return; }
  showLoading('blogResult');
  try {
    const result = await callClaude(`Write a ${tone} ${type} blog post for Janice C Photography.
Topic: ${topic}
Rules: First person as Janice. Story-first, start with a real moment. NoVA mamas should read this and think she gets me. 400-600 words. Short paragraphs max 3 sentences. No fluff. End with soft human call to action. No dashes. Include a title at top.`);
    document.getElementById('blogResult').innerHTML = `
      <div class="result-card">
        <div class="result-body">${result}</div>
        <div class="result-actions">
          <button class="btn btn-copy btn-sm" onclick='copyText(${JSON.stringify(result)})'>Copy Draft</button>
          <button class="btn btn-outline btn-sm" onclick="generateBlog()">Try Again</button>
        </div>
      </div>`;
  } catch(e) {
    document.getElementById('blogResult').innerHTML = `<div class="result-card"><p style="color:var(--red);font-size:13px">Something went wrong. Try again.</p></div>`;
  }
}

async function generateMarketing() {
  const session = document.getElementById('m_session').value;
  const season = document.getElementById('m_season').value;
  const goal = document.getElementById('m_goal').value;
  showLoading('marketingResult');
  try {
    const result = await callClaude(`Give Janice C Photography 5 specific marketing ideas for:
Session: ${session}, Season: ${season}, Goal: ${goal}, Location: Northern Virginia.
Each idea: specific, actionable, doable from a phone this week. Include where to post, what to say, how to do it.
Format: IDEA 1: [title] then 2-3 sentences. Direct and practical. No fluff.`);
    document.getElementById('marketingResult').innerHTML = `
      <div class="result-card">
        <div class="result-title">${session} · ${season} · ${goal}</div>
        <div class="result-body">${result}</div>
        <div class="result-actions">
          <button class="btn btn-copy btn-sm" onclick='copyText(${JSON.stringify(result)})'>Copy Ideas</button>
          <button class="btn btn-outline btn-sm" onclick="generateMarketing()">Try Again</button>
        </div>
      </div>`;
  } catch(e) {
    document.getElementById('marketingResult').innerHTML = `<div class="result-card"><p style="color:var(--red);font-size:13px">Something went wrong. Try again.</p></div>`;
  }
}

async function generateEmail() {
  const type = document.getElementById('e_type').value;
  const session = document.getElementById('e_session').value;
  const detail = document.getElementById('e_detail').value;
  showLoading('emailResult');
  try {
    const result = await callClaude(`Write a ${type} email for Janice C Photography for a ${session}.
${detail ? 'Details: ' + detail : ''}
Rules: From Janice to client. Warm, personal, real. Max 150 words. Start with Hey [Name]! Sign off as Janice. No dashes. Use [brackets] for fill-ins like [date] or [link]. Sound like a text from a friend who happens to be a photographer. Write the email only, no explanation.`);
    document.getElementById('emailResult').innerHTML = `
      <div class="result-card">
        <div class="result-title">${type} · ${session}</div>
        <div class="script-box"><div class="result-body">${result}</div></div>
        <div class="result-actions">
          <button class="btn btn-copy btn-sm" onclick='copyText(${JSON.stringify(result)})'>Copy Email</button>
          <button class="btn btn-outline btn-sm" onclick="generateEmail()">Try Again</button>
        </div>
      </div>`;
  } catch(e) {
    document.getElementById('emailResult').innerHTML = `<div class="result-card"><p style="color:var(--red);font-size:13px">Something went wrong. Try again.</p></div>`;
  }
}

async function generatePrep() {
  const session = document.getElementById('sp_session').value;
  const loc = document.getElementById('sp_location').value;
  const kids = document.getElementById('sp_kids').value;
  const age = document.getElementById('sp_age').value;
  const vibe = document.getElementById('sp_vibe').value;
  const notes = document.getElementById('sp_notes').value;
  showLoading('prepResult');
  try {
    const result = await callClaude(`Write a personal session prep guide for a Janice C Photography client.
Session: ${session}, Location: ${loc}, Kids: ${kids}, Youngest age: ${age}, Vibe: ${vibe}. ${notes ? 'Notes: ' + notes : ''}
Write as a friendly message from Janice to the client. Include: what to wear for ${vibe} vibe, arrival time tip, ${kids!=='No kids (mama only)'?`how to prep ${age} kids`:'what to bring'}, what NOT to stress about, one fun thing to look forward to. Start with Hey! So excited for your session! Use you and your kids. Short sections max 2-3 sentences. No dashes. Include [DATE] and [TIME] placeholders.`);
    document.getElementById('prepResult').innerHTML = `
      <div class="result-card">
        <div class="result-title">Prep Guide · ${session}</div>
        <div class="script-box"><div class="result-body">${result}</div></div>
        <div class="result-actions">
          <button class="btn btn-copy btn-sm" onclick='copyText(${JSON.stringify(result)})'>Copy Guide</button>
          <button class="btn btn-outline btn-sm" onclick="generatePrep()">Try Again</button>
        </div>
      </div>`;
  } catch(e) {
    document.getElementById('prepResult').innerHTML = `<div class="result-card"><p style="color:var(--red);font-size:13px">Something went wrong. Try again.</p></div>`;
  }
}

renderTracker();
</script>
</body>
</html>
