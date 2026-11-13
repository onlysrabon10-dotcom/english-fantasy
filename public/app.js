const $ = (id) => document.getElementById(id);
let adminToken = "";
let learnerId = "";
let activeTab = "levels";
const progressKey = () => `ef-progress-${learnerId || "guest"}`;
const completed = new Set();

const levels = [
  { title: "Level 1", subtitle: "Grammar Foundation", topics: ["Use of Be Verbs", "Use of Have Verbs", "Present Indefinite", "Present Continuous", "Present Perfect", "Past Indefinite", "Past Continuous", "Future Indefinite"] },
  { title: "Level 2", subtitle: "Build Your Sentences", topics: ["Use of Modals", "Sentence Pattern", "Use of There", "First Conditional", "Second Conditional", "Second Conditional (Imagine)", "Use of Get"] },
  { title: "Level 3", subtitle: "Grammar in Use", topics: ["Use of Prepositions", "Articles (A, An, The)", "Passive Voice"] },
  { title: "Level 4", subtitle: "Coming Soon", topics: [] }
];
const lessonNotes = {
  "Use of Be Verbs": [
    { heading: "Profession (পেশা)", structure: "Subject + am/is/are + a/an + profession", examples: ["I am a student. — আমি একজন শিক্ষার্থী।", "My father is a doctor. — আমার বাবা একজন ডাক্তার।", "They are teachers. — তাঁরা শিক্ষক।"] },
    { heading: "Location (অবস্থান)", structure: "Subject + am/is/are + place", examples: ["I am at home. — আমি বাসায় আছি।", "She is in Dhaka. — সে ঢাকায় আছে।", "The books are on the table. — বইগুলো টেবিলের ওপর আছে।"] },
    { heading: "Condition (অবস্থা)", structure: "Subject + am/is/are + adjective", examples: ["I am happy. — আমি খুশি।", "He is sick. — সে অসুস্থ।", "We are ready. — আমরা প্রস্তুত।"] },
    { heading: "Future (ভবিষ্যৎ)", structure: "Subject + will be + complement", examples: ["I will be a doctor. — আমি ডাক্তার হব।", "She will be at school. — সে স্কুলে থাকবে।", "They will be happy. — তারা খুশি হবে।"] }
  ],
  "Use of Have Verbs": [
    { heading: "Possession (কোনো কিছু থাকা)", structure: "I/You/We/They + have + noun; He/She/It + has + noun", examples: ["I have a book. — আমার একটি বই আছে।", "She has a new bag. — তার একটি নতুন ব্যাগ আছে।"] },
    { heading: "Relationship (সম্পর্ক)", structure: "Subject + have/has + family member / relationship", examples: ["I have two brothers. — আমার দুই ভাই আছে।", "He has a sister. — তার একজন বোন আছে।"] },
    { heading: "Condition (শারীরিক অবস্থা)", structure: "Subject + have/has + a/an + illness or condition", examples: ["I have a headache. — আমার মাথাব্যথা আছে।", "She has a fever. — তার জ্বর হয়েছে।"] },
    { heading: "Future (ভবিষ্যতে থাকবে)", structure: "Subject + will have + noun", examples: ["I will have a car. — আমার একটি গাড়ি থাকবে।", "They will have a test tomorrow. — আগামীকাল তাদের পরীক্ষা থাকবে।"] }
  ],
  "Present Indefinite": [{ heading: "ব্যবহার", structure: "Subject + V1 (he/she/it হলে V1+s/es) + object", examples: ["I play football. — আমি ফুটবল খেলি।", "She reads a book. — সে একটি বই পড়ে।"] }],
  "Present Continuous": [{ heading: "ব্যবহার", structure: "Subject + am/is/are + verb-ing + object", examples: ["I am reading. — আমি পড়ছি।", "They are playing. — তারা খেলছে।"] }],
  "Present Perfect": [{ heading: "ব্যবহার", structure: "Subject + have/has + V3 + object", examples: ["I have finished my work. — আমি আমার কাজ শেষ করেছি।", "He has eaten rice. — সে ভাত খেয়েছে।"] }],
  "Past Indefinite": [{ heading: "ব্যবহার", structure: "Subject + V2 + object", examples: ["I visited Dhaka. — আমি ঢাকা ভ্রমণ করেছিলাম।", "She cooked rice. — সে ভাত রান্না করেছিল।"] }],
  "Past Continuous": [{ heading: "ব্যবহার", structure: "Subject + was/were + verb-ing + object", examples: ["She was cooking. — সে রান্না করছিল।", "We were studying. — আমরা পড়ছিলাম।"] }],
  "Future Indefinite": [{ heading: "ব্যবহার", structure: "Subject + will + V1 + object", examples: ["I will call you. — আমি তোমাকে ফোন করব।", "They will visit us. — তারা আমাদের দেখতে আসবে।"] }],
  "Use of Modals": [{ heading: "Structure", structure: "Subject + modal + V1 + object", examples: ["You should study. — তোমার পড়াশোনা করা উচিত।", "She can swim. — সে সাঁতার কাটতে পারে।"] }],
  "Sentence Pattern": [{ heading: "Basic Sentence Pattern", structure: "Subject + Verb + Object (S + V + O)", examples: ["I read a book. — আমি একটি বই পড়ি।", "She drinks water. — সে পানি পান করে।"] }, { heading: "Be Verb Pattern", structure: "Subject + be verb + complement", examples: ["He is a teacher. — তিনি একজন শিক্ষক।"] }],
  "Use of There": [{ heading: "There is / There are", structure: "There + is/are + noun + place", examples: ["There is a book on the table. — টেবিলের ওপর একটি বই আছে।", "There are two cats. — দুটি বিড়াল আছে।"] }],
  "First Conditional": [{ heading: "Structure", structure: "If + Present Simple, Subject + will + V1", examples: ["If it rains, I will stay home. — বৃষ্টি হলে আমি বাড়িতে থাকব।"] }],
  "Second Conditional": [{ heading: "Structure", structure: "If + Past Simple, Subject + would + V1", examples: ["If I had time, I would travel. — সময় থাকলে আমি ভ্রমণ করতাম।"] }],
  "Second Conditional (Imagine)": [{ heading: "Imagine", structure: "Imagine + subject + past form, ... would + V1", examples: ["Imagine you were rich. What would you do? — কল্পনা করো তুমি ধনী হলে। তুমি কী করতে?"] }],
  "Use of Get": [{ heading: "Common uses", structure: "Get = পাওয়া / হওয়া / পৌঁছানো (context অনুযায়ী)", examples: ["I get up early. — আমি সকালে তাড়াতাড়ি উঠি।", "It is getting cold. — ঠান্ডা পড়ছে।"] }],
  "Use of Prepositions": [{ heading: "ব্যবহার", structure: "Preposition + noun/pronoun দিয়ে অবস্থান, সময় বা সম্পর্ক বোঝায়", examples: ["The book is on the table. — বইটি টেবিলের ওপর।", "I live in Dhaka. — আমি ঢাকায় থাকি।"] }],
  "Articles (A, An, The)": [{ heading: "ব্যবহার", structure: "A/An = অনির্দিষ্ট একবচন; The = নির্দিষ্ট ব্যক্তি/বস্তু", examples: ["I saw a bird. — আমি একটি পাখি দেখেছি।", "She is an honest girl. — সে একজন সৎ মেয়ে।", "The sun is bright. — সূর্য উজ্জ্বল।"] }],
  "Passive Voice": [{ heading: "Basic Structure", structure: "Object + be verb + V3 (+ by + subject)", examples: ["Active: They make cars. — তারা গাড়ি তৈরি করে।", "Passive: Cars are made. — গাড়ি তৈরি করা হয়।"] }]
};
const sixSentenceSets = [
  [
    { bn: "আমি একজন শিক্ষার্থী।", forms: ["I am a student.", "I am not a student.", "Am I a student?", "Am I not a student?", "Why am I a student?", "Why am I not a student?"], bnForms: ["আমি একজন শিক্ষার্থী।", "আমি শিক্ষার্থী নই।", "আমি কি একজন শিক্ষার্থী?", "আমি কি একজন শিক্ষার্থী নই?", "আমি কেন একজন শিক্ষার্থী?", "আমি কেন একজন শিক্ষার্থী নই?"] },
    { bn: "আমার একটি বই আছে।", forms: ["I have a book.", "I don't have a book.", "Do I have a book?", "Don't I have a book?", "Why do I have a book?", "Why don't I have a book?"], bnForms: ["আমার একটি বই আছে।", "আমার কোনো বই নেই।", "আমার কি একটি বই আছে?", "আমার কি কোনো বই নেই?", "আমার কেন একটি বই আছে?", "আমার কেন কোনো বই নেই?"] },
    { bn: "সে গতকাল অসুস্থ ছিল।", forms: ["She was ill yesterday.", "She wasn't ill yesterday.", "Was she ill yesterday?", "Wasn't she ill yesterday?", "Why was she ill yesterday?", "Why wasn't she ill yesterday?"], bnForms: ["সে গতকাল অসুস্থ ছিল।", "সে গতকাল অসুস্থ ছিল না।", "সে কি গতকাল অসুস্থ ছিল?", "সে কি গতকাল অসুস্থ ছিল না?", "সে কেন গতকাল অসুস্থ ছিল?", "সে কেন গতকাল অসুস্থ ছিল না?"] },
    { bn: "আমি ডাক্তার হব।", forms: ["I will be a doctor.", "I won't be a doctor.", "Will I be a doctor?", "Won't I be a doctor?", "Why will I be a doctor?", "Why won't I be a doctor?"], bnForms: ["আমি ডাক্তার হব।", "আমি ডাক্তার হব না।", "আমি কি ডাক্তার হব?", "আমি কি ডাক্তার হব না?", "আমি কেন ডাক্তার হব?", "আমি কেন ডাক্তার হব না?"] }
  ],
  [
    { bn: "সে সাঁতার কাটতে পারে।", forms: ["She can swim.", "She cannot swim.", "Can she swim?", "Can't she swim?", "Why can she swim?", "Why can't she swim?"], bnForms: ["সে সাঁতার কাটতে পারে।", "সে সাঁতার কাটতে পারে না।", "সে কি সাঁতার কাটতে পারে?", "সে কি সাঁতার কাটতে পারে না?", "সে কেন সাঁতার কাটতে পারে?", "সে কেন সাঁতার কাটতে পারে না?"] },
    { bn: "টেবিলের ওপর একটি বই আছে।", forms: ["There is a book on the table.", "There isn't a book on the table.", "Is there a book on the table?", "Isn't there a book on the table?", "Why is there a book on the table?", "Why isn't there a book on the table?"], bnForms: ["টেবিলের ওপর একটি বই আছে।", "টেবিলের ওপর কোনো বই নেই।", "টেবিলের ওপর কি একটি বই আছে?", "টেবিলের ওপর কি কোনো বই নেই?", "টেবিলের ওপর কেন একটি বই আছে?", "টেবিলের ওপর কেন কোনো বই নেই?"] },
    { bn: "তুমি পড়াশোনা করলে, তুমি পাস করবে।", forms: ["If you study, you will pass.", "If you don't study, you won't pass.", "Will you pass if you study?", "Won't you pass if you study?", "Why will you pass if you study?", "Why won't you pass if you study?"], bnForms: ["তুমি পড়াশোনা করলে পাস করবে।", "তুমি পড়াশোনা না করলে পাস করবে না।", "তুমি কি পড়াশোনা করলে পাস করবে?", "তুমি কি পড়াশোনা না করলে পাস করবে না?", "তুমি পড়াশোনা করলে কেন পাস করবে?", "তুমি পড়াশোনা না করলে কেন পাস করবে না?"] }
  ],
  [
    { bn: "আমি ঢাকায় থাকি।", forms: ["I live in Dhaka.", "I don't live in Dhaka.", "Do I live in Dhaka?", "Don't I live in Dhaka?", "Why do I live in Dhaka?", "Why don't I live in Dhaka?"], bnForms: ["আমি ঢাকায় থাকি।", "আমি ঢাকায় থাকি না।", "আমি কি ঢাকায় থাকি?", "আমি কি ঢাকায় থাকি না?", "আমি কেন ঢাকায় থাকি?", "আমি কেন ঢাকায় থাকি না?"] },
    { bn: "সে একটি আপেল খায়।", forms: ["She eats an apple.", "She doesn't eat an apple.", "Does she eat an apple?", "Doesn't she eat an apple?", "Why does she eat an apple?", "Why doesn't she eat an apple?"], bnForms: ["সে একটি আপেল খায়।", "সে একটি আপেল খায় না।", "সে কি একটি আপেল খায়?", "সে কি একটি আপেল খায় না?", "সে কেন একটি আপেল খায়?", "সে কেন একটি আপেল খায় না?"] },
    { bn: "চিঠিটি লেখা হয়।", forms: ["The letter is written.", "The letter isn't written.", "Is the letter written?", "Isn't the letter written?", "Why is the letter written?", "Why isn't the letter written?"], bnForms: ["চিঠিটি লেখা হয়।", "চিঠিটি লেখা হয় না।", "চিঠিটি কি লেখা হয়?", "চিঠিটি কি লেখা হয় না?", "চিঠিটি কেন লেখা হয়?", "চিঠিটি কেন লেখা হয় না?"] }
  ],
  []
];
const words = [
  { word: "Accept", meaning: "গ্রহণ করা", forms: "Accept · Accepted · Accepted · Accepting · Accepts", example: "I accept your offer.", bn: "আমি তোমার প্রস্তাব গ্রহণ করি।" },
  { word: "Achieve", meaning: "অর্জন করা", forms: "Achieve · Achieved · Achieved · Achieving · Achieves", example: "She works hard to achieve her goal.", bn: "সে তার লক্ষ্য অর্জনের জন্য কঠোর পরিশ্রম করে।" },
  { word: "Admire", meaning: "প্রশংসা করা", forms: "Admire · Admired · Admired · Admiring · Admires", example: "I admire my teacher.", bn: "আমি আমার শিক্ষককে শ্রদ্ধা করি।" },
  { word: "Avoid", meaning: "এড়িয়ে চলা", forms: "Avoid · Avoided · Avoided · Avoiding · Avoids", example: "Avoid bad habits.", bn: "খারাপ অভ্যাস এড়িয়ে চলো।" }
];
const twisterGroups = [
  { title: "Tongue Twister — Set 1", items: [
    "How much wood would a woodchuck chuck if a woodchuck could chuck wood?",
    "Green grape fruit, ripe grape fruit.",
    "Polly put purple paint in the pool.",
    "Carlos kicks a curly corner kick.",
    "The teacher told me to teach a typical topic."
  ]},
  { title: "Tongue Twister — Set 2 (10 Together)", items: [
    "Red lorry, yellow lorry.", "Three free throws.", "Top cup, cup top.", "Blue blue bird.", "Daddy draws doors.",
    "Two toads totally tired today.", "He threw three balls.", "The blue bluebird blinks.",
    "Can you can a can as a canner can?", "Papa Popy pets a pretty parrot."
  ]}
];
const quiz = [
  { q: "Choose the correct sentence.", options: ["He are happy.", "He is happy.", "He am happy."], answer: 1, why: "He-এর সঙ্গে is বসে।" },
  { q: "Which sentence uses Present Continuous?", options: ["I play football.", "I have played football.", "I am playing football."], answer: 2, why: "Present Continuous: am/is/are + verb-ing." },
  { q: "Choose the correct article: She is ___ honest girl.", options: ["a", "an", "the"], answer: 1, why: "Honest-এর h উচ্চারিত হয় না, তাই an।" },
  { q: "Choose the correct preposition: I live ___ Dhaka.", options: ["at", "on", "in"], answer: 2, why: "শহরের আগে সাধারণত in বসে।" },
  { q: "Choose the correct form: They ___ a new car.", options: ["has", "have", "having"], answer: 1, why: "They-এর সঙ্গে have বসে।" }
];

function show(viewId) {
  ["loginView", "appView", "adminLoginView", "adminView"].forEach(id => $(id).classList.toggle("hidden", id !== viewId));
  window.scrollTo({ top: 0, behavior: "smooth" });
}
function toast(message) {
  const el = $("toast"); el.textContent = message; el.classList.remove("hidden");
  clearTimeout(toast.timer); toast.timer = setTimeout(() => el.classList.add("hidden"), 2400);
}
function setStatus(message, error = false) {
  const el = $("status"); el.textContent = message; el.classList.remove("hidden", "error");
  if (error) el.classList.add("error");
}
function clearStatus() { $("status").classList.add("hidden"); }
async function api(url, options = {}) {
  const headers = { "Content-Type": "application/json", ...(options.headers || {}) };
  if (options.admin) headers.Authorization = `Bearer ${adminToken}`;
  const response = await fetch(url, { ...options, headers });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data.error || "Something went wrong.");
  return data;
}
function escapeHtml(value = "") {
  return String(value).replace(/[&<>"']/g, c => ({ "&":"&amp;", "<":"&lt;", ">":"&gt;", '"':"&quot;", "'":"&#39;" }[c]));
}
function loadProgress() {
  completed.clear();
  try { JSON.parse(localStorage.getItem(progressKey()) || "[]").forEach(x => completed.add(x)); } catch {}
  updateProgress();
}
function markDone(key) { completed.add(key); localStorage.setItem(progressKey(), JSON.stringify([...completed])); updateProgress(); }
function updateProgress() {
  const total = levels.reduce((n, l) => n + l.topics.length, 0) + words.length + twisterGroups.reduce((n,g) => n + g.items.length,0) + quiz.length;
  const percent = Math.round(completed.size / total * 100);
  if ($("progressPercent")) $("progressPercent").textContent = `${Math.min(percent,100)}%`;
  if ($("progressBar")) $("progressBar").style.width = `${Math.min(percent,100)}%`;
}
function renderResult(data) {
  const forms = Array.isArray(data.forms) ? data.forms : [];
  const titleBn = data.inputBangla || "তোমার Sentence";
  const titleEn = data.inputEnglish || "";
  $("resultArea").innerHTML = `<article class="result-card"><div class="eyebrow">SENTENCE RESULT</div><h2 class="result-title">${escapeHtml(titleBn)}</h2><p class="translation">${escapeHtml(titleEn)}</p><p class="meaning">অর্থ: ${escapeHtml(data.meaning || titleBn)}</p><div class="forms-grid">${forms.map((f, i) => `<div class="form-item"><div class="form-name">${escapeHtml(f.name || `Sentence ${i + 1}`)}</div><div class="form-en">${escapeHtml(f.english || "")}</div><div class="form-bn">${escapeHtml(f.bangla || "")}</div><button class="copy-button" data-copy="${encodeURIComponent(f.english || "")}">Copy English</button></div>`).join("")}</div>${data.hasSixForms === false ? `<div class="notice">${escapeHtml(data.notice || "এই Sentence-এর ৬টি Form হয় না।")}</div>` : ""}</article>`;
  $("resultArea").querySelectorAll("[data-copy]").forEach(btn => btn.addEventListener("click", async () => { try { await navigator.clipboard.writeText(decodeURIComponent(btn.dataset.copy)); toast("Copied!"); } catch { toast("Copy is not available in this browser."); } }));
}
async function loadSaved() {
  const items = await api("/api/sentences");
  $("savedCount").textContent = items.length;
  $("savedList").innerHTML = items.length ? items.map(item => `<div class="saved-item"><div><strong>${escapeHtml(item.bangla)}</strong><span>${escapeHtml(item.english)}</span></div><button class="copy-button" data-load="${encodeURIComponent(item.bangla)}">Use</button></div>`).join("") : '<p class="muted">এখনো কোনো sentence যোগ করা হয়নি। Admin panel থেকে যোগ করা যাবে।</p>';
  $("savedList").querySelectorAll("[data-load]").forEach(btn => btn.addEventListener("click", () => { $("sentenceInput").value = decodeURIComponent(btn.dataset.load); $("sentenceInput").focus(); }));
}
function renderHub(tab = activeTab) {
  activeTab = tab;
  document.querySelectorAll(".hub-tab").forEach(b => b.classList.toggle("active", b.dataset.tab === tab));
  const host = $("hubContent");
  if (tab === "levels") {
    host.innerHTML = `<div class="level-grid">${levels.map((level,i) => `<button class="level-tile" data-level="${i}" ${i===3?'disabled':''}><span>${level.title}</span><small>${i===3?'Coming Soon':'Open lessons ↗'}</small></button>`).join("")}</div><div id="levelDetail"></div>`;
  } else if (tab === "vocabulary") {
    host.innerHTML = `<div class="hub-grid">${[1,2,3,4].map(n => `<article class="hub-card"><div class="eyebrow">VOCABULARY LEVEL ${n}</div><h3>Level ${n}</h3><p>${n === 1 ? "Beginner-friendly words with meaning, verb forms and examples." : "এই Level-এর Vocabulary content পরে যোগ করা যাবে।"}</p><button class="hub-action ${n===1?'primary':''}" data-vocab="${n}">${n===1?'Open sample words':'Coming Soon'}</button></article>`).join("")}</div><div id="vocabDetail"></div>`;
  } else if (tab === "twisters") {
    host.innerHTML = twisterGroups.map((g,gi) => `<div class="twister-group"><h3>${g.title}</h3><div class="hub-grid">${g.items.map((t,i) => `<div class="twister-card"><p>${escapeHtml(t)}</p><div><button class="hub-action" data-speak="${encodeURIComponent(t)}" aria-label="Listen">🔊 Audio</button><button class="hub-action" data-twister-done="${gi}-${i}">Done</button></div></div>`).join("")}</div></div>`).join("");
  } else if (tab === "expressions") {
    host.innerHTML = `<div class="hub-grid">${[1,2,3].map(n => `<article class="hub-card"><div class="eyebrow">COMMON EXPRESSIONS</div><h3>Level ${n}</h3><p>এই Level-এর আসল তালিকা পরে যোগ করা যাবে।</p><span class="topic-chip">Content coming soon</span></article>`).join("")}</div>`;
  } else if (tab === "quiz") {
    host.innerHTML = `<div class="hub-card"><div class="eyebrow">TEST YOURSELF</div><h3>Grammar & Vocabulary Quiz</h3><p>প্রতিটি প্রশ্নের একটি সঠিক উত্তর বেছে Submit করো।</p><form id="quizForm">${quiz.map((q,i) => `<div class="quiz-question"><p>${i+1}. ${q.q}</p>${q.options.map((o,j) => `<label><input type="radio" name="q${i}" value="${j}" /> ${escapeHtml(o)}</label>`).join("")}</div>`).join("")}<button class="hub-action primary" type="submit">Submit Answers</button></form><div id="quizFeedback" class="quiz-feedback" aria-live="polite"></div></div>`;
    $("quizForm").addEventListener("submit", e => { e.preventDefault(); let score=0, feedback=[]; quiz.forEach((q,i) => { const picked = document.querySelector(`input[name="q${i}"]:checked`); if (picked && Number(picked.value) === q.answer) score++; feedback.push(`${i+1}. ${picked && Number(picked.value) === q.answer ? "সঠিক" : "সঠিক উত্তর: " + q.options[q.answer]} — ${q.why}`); }); markDone("quiz"); $("quizFeedback").innerHTML = `<strong>তোমার Score: ${score}/${quiz.length}</strong><br>${feedback.map(escapeHtml).join("<br>")}`; });
  }
}
function openLevel(index) {
  const level = levels[index]; const detail = $("levelDetail");
  if (!level || !level.topics.length) return;
  const levelGrid = document.querySelector(".level-grid"); if (levelGrid) levelGrid.classList.add("hidden");
  detail.innerHTML = `<div class="hub-detail level-page"><button class="back-level" data-back-level>← Back to Levels</button><h3>${level.title}</h3><p class="muted">একটি Topic বেছে নিয়ে পড়া শুরু করো।</p><div class="lesson-list">${level.topics.map((topic,i) => `<article class="lesson-card"><div><strong>${escapeHtml(topic)}</strong><small>${index===0 && i<2 ? "Detailed lesson" : "Lesson & examples"}</small></div><button class="hub-action" data-open-topic="${encodeURIComponent(topic)}">Open ↗</button></article>`).join("")}<article class="lesson-card six-sentences-card"><div><strong>6 Sentences</strong><small>৩–৪টি বাক্যের ছয়টি Form অনুশীলন</small></div><button class="hub-action primary" data-six-sentences="${index}">Practice ↗</button></article></div><div id="topicLesson"></div></div>`;
  detail.scrollIntoView({behavior:"smooth",block:"nearest"});
}
function renderTopic(topic) {
  const host = $("topicLesson");
  const sections = lessonNotes[topic] || [];
  if (!sections.length) { host.innerHTML = `<div class="lesson-content"><h3>${escapeHtml(topic)}</h3><p>এই Lesson-এর বিস্তারিত অংশ পরে যোগ করা হবে।</p></div>`; return; }
  host.innerHTML = `<div class="lesson-content"><h3>${escapeHtml(topic)}</h3>${sections.map(section => `<section class="lesson-section"><h4>${escapeHtml(section.heading)}</h4><div class="structure-box"><strong>Structure:</strong> ${escapeHtml(section.structure)}</div><ul>${section.examples.map(ex => `<li>${escapeHtml(ex)}</li>`).join("")}</ul></section>`).join("")}<button class="hub-action primary" data-topic-done="${encodeURIComponent(topic)}">Mark as learned ✓</button></div>`;
  host.scrollIntoView({behavior:"smooth",block:"nearest"});
}
function renderSixSentences(levelIndex) {
  const host = $("topicLesson"); const items = sixSentenceSets[levelIndex] || [];
  if (!items.length) { host.innerHTML = `<div class="lesson-content"><h3>6 Sentences</h3><p>এই Level-এর practice sentences শিগগিরই যোগ হবে।</p></div>`; return; }
  const names = ["Affirmative", "Negative", "Interrogative", "Negative Interrogative", "Why Affirmative", "Why Negative"];
  host.innerHTML = `<div class="lesson-content"><h3>6 Sentences Practice</h3>${items.map((item,i) => `<section class="six-sentence-item"><h4>${i+1}. ${escapeHtml(item.bn)}</h4><div class="six-form-grid">${item.forms.map((form,j) => `<div class="six-form"><strong>${names[j]}</strong><span>${escapeHtml(form)}</span><small>${escapeHtml(item.bnForms?.[j] || "")}</small></div>`).join("")}</div></section>`).join("")}<button class="hub-action primary" data-six-done="${levelIndex}">Practice completed ✓</button></div>`;
  host.scrollIntoView({behavior:"smooth",block:"nearest"});
}
function openVocabulary(level) {
  const detail = $("vocabDetail");
  if (level !== 1) return toast("এই Vocabulary Level-এর content পরে যোগ হবে।");
  detail.innerHTML = `<div class="hub-detail"><h3>Vocabulary Level 1 — Sample Words</h3><div class="hub-grid">${words.map((w,i) => `<article class="word-card"><h3>${w.word}</h3><p>অর্থ: ${w.meaning}</p><small>${w.forms}</small><p><strong>${w.example}</strong><br>${w.bn}</p><button class="hub-action" data-word-done="${i}">Learned ✓</button></article>`).join("")}</div><p class="muted">এগুলো sample word। তোমার Vocabulary book-এর ছবি দিলে আসল তালিকা বসাব। V1–V5-এর ক্রম: V1, V2, V3, V4, V5.</p></div>`;
}
function speak(text) {
  if (!("speechSynthesis" in window)) return toast("এই Browser-এ audio speech support নেই।");
  window.speechSynthesis.cancel(); const utterance = new SpeechSynthesisUtterance(text); utterance.lang = "en-US"; utterance.rate = 0.82; window.speechSynthesis.speak(utterance);
}

$("learnerForm").addEventListener("submit", async e => {
  e.preventDefault(); const id = $("learnerId").value.trim();
  try { const data = await api("/api/learner-login", { method: "POST", body: JSON.stringify({ id }) }); learnerId = data.learnerId; $("learnerWelcome").textContent = `স্বাগতম! তোমার ID: ${learnerId}`; loadProgress(); show("appView"); renderHub("levels"); await loadSaved(); }
  catch (err) { toast(err.message); }
});
$("showAdminLogin").addEventListener("click", () => show("adminLoginView"));
$("backToLogin").addEventListener("click", () => show("loginView"));
$("logoutButton").addEventListener("click", () => { learnerId = ""; $("resultArea").innerHTML = ""; show("loginView"); });
$("searchButton").addEventListener("click", generate);
$("sentenceInput").addEventListener("keydown", e => { if (e.key === "Enter") generate(); });
async function generate() {
  const sentence = $("sentenceInput").value.trim(); if (!sentence) return toast("আগে একটি sentence লিখো।");
  clearStatus(); $("searchButton").disabled = true; $("searchButton").textContent = "Generating..."; setStatus("ChatGPT তোমার sentence বিশ্লেষণ করছে...");
  try { const data = await api("/api/generate", { method: "POST", body: JSON.stringify({ sentence }) }); clearStatus(); renderResult(data); }
  catch (err) { setStatus(err.message, true); }
  finally { $("searchButton").disabled = false; $("searchButton").innerHTML = 'Search <span>⌕</span>'; }
}
$("themeSelect").addEventListener("change", e => { document.body.classList.remove("theme-blue","theme-purple","theme-green","theme-light"); if (e.target.value !== "gold") document.body.classList.add(`theme-${e.target.value}`); localStorage.setItem("ef-theme", e.target.value); });
const savedTheme = localStorage.getItem("ef-theme"); if (savedTheme && $("themeSelect").querySelector(`option[value="${savedTheme}"]`)) { $("themeSelect").value = savedTheme; if (savedTheme !== "gold") document.body.classList.add(`theme-${savedTheme}`); }
document.querySelectorAll(".hub-tab").forEach(btn => btn.addEventListener("click", () => renderHub(btn.dataset.tab)));
$("hubContent").addEventListener("click", e => {
  const b = e.target.closest("button"); if (!b) return;
  if (b.dataset.level !== undefined) openLevel(Number(b.dataset.level));
  if (b.dataset.backLevel !== undefined) { $("levelDetail").innerHTML = ""; const levelGrid = document.querySelector(".level-grid"); if (levelGrid) levelGrid.classList.remove("hidden"); $("hubContent").scrollIntoView({behavior:"smooth",block:"start"}); }
  if (b.dataset.openTopic) renderTopic(decodeURIComponent(b.dataset.openTopic));
  if (b.dataset.sixSentences !== undefined) renderSixSentences(Number(b.dataset.sixSentences));
  if (b.dataset.topicDone) { markDone(`topic-${decodeURIComponent(b.dataset.topicDone)}`); b.textContent = "Learned ✓"; b.disabled = true; }
  if (b.dataset.sixDone !== undefined) { markDone(`six-${b.dataset.sixDone}`); b.textContent = "Completed ✓"; b.disabled = true; }
  if (b.dataset.vocab) openVocabulary(Number(b.dataset.vocab));
  if (b.dataset.speak) speak(decodeURIComponent(b.dataset.speak));
  if (b.dataset.lessonDone) { markDone(`lesson-${b.dataset.lessonDone}`); b.textContent = "Learned ✓"; b.disabled = true; }
  if (b.dataset.wordDone !== undefined) { markDone(`word-${b.dataset.wordDone}`); b.textContent = "Learned ✓"; b.disabled = true; }
  if (b.dataset.twisterDone) { markDone(`twister-${b.dataset.twisterDone}`); b.textContent = "Done ✓"; b.disabled = true; }
});

$("adminForm").addEventListener("submit", async e => { e.preventDefault(); try { const data = await api("/api/admin-login", { method: "POST", body: JSON.stringify({ username: $("adminUsername").value, password: $("adminPassword").value }) }); adminToken = data.token; show("adminView"); await loadAdminItems(); toast("Admin login successful."); } catch (err) { toast(err.message); } });
$("adminLogout").addEventListener("click", () => { adminToken = ""; $("adminPassword").value = ""; show("loginView"); });
async function loadAdminItems() {
  const items = await api("/api/sentences");
  $("adminSavedList").innerHTML = items.length ? items.map(item => `<div class="saved-item"><div><strong>${escapeHtml(item.bangla)}</strong><span>${escapeHtml(item.english)}</span></div><div class="admin-actions"><button class="copy-button" data-edit="${item.id}" data-bn="${encodeURIComponent(item.bangla)}" data-en="${encodeURIComponent(item.english)}">Edit</button><button class="copy-button" data-delete="${item.id}">Delete</button></div></div>`).join("") : '<p class="muted">No saved sentences yet.</p>';
  $("adminSavedList").querySelectorAll("[data-delete]").forEach(btn => btn.addEventListener("click", async () => { if (!confirm("এই sentence delete করবে?")) return; try { await api(`/api/sentences/${btn.dataset.delete}`, { method: "DELETE", admin: true }); await loadAdminItems(); toast("Sentence deleted."); } catch (err) { toast(err.message); } }));
  $("adminSavedList").querySelectorAll("[data-edit]").forEach(btn => btn.addEventListener("click", async () => { const bangla = prompt("বাংলা Sentence:", decodeURIComponent(btn.dataset.bn)); if (bangla === null) return; const english = prompt("English Sentence:", decodeURIComponent(btn.dataset.en)); if (english === null) return; try { await api(`/api/sentences/${btn.dataset.edit}`, { method: "PUT", admin: true, body: JSON.stringify({ bangla, english, forms: [] }) }); await loadAdminItems(); toast("Sentence updated."); } catch (err) { toast(err.message); } }));
}
$("addSentenceForm").addEventListener("submit", async e => {
  e.preventDefault(); let forms = []; const raw = $("newForms").value.trim();
  if (raw) { try { forms = JSON.parse(raw); if (!Array.isArray(forms)) throw new Error(); } catch { return toast("Forms JSON সঠিক নয়।"); } }
  try { await api("/api/sentences", { method: "POST", admin: true, body: JSON.stringify({ bangla: $("newBangla").value, english: $("newEnglish").value, forms }) }); $("addSentenceForm").reset(); await loadAdminItems(); toast("Sentence saved."); }
  catch (err) { toast(err.message); }
});
