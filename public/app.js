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
  // Vocabulary previously practised in earlier chats (including the user's book word ranges)
  { word:"Bark", meaning:"ঘেউ ঘেউ করা", v1:"Bark", v2:"Barked", v3:"Barked", v4:"Barks", v5:"Barking", example:"Dogs bark at strangers.", bn:"কুকুর অপরিচিত মানুষ দেখলে ঘেউ ঘেউ করে।" },
  { word:"Bask", meaning:"রোদ পোহানো", v1:"Bask", v2:"Basked", v3:"Basked", v4:"Basks", v5:"Basking", example:"The cat basks in the sun.", bn:"বিড়ালটি রোদ পোহায়।" },
  { word:"Bet", meaning:"বাজি ধরা", v1:"Bet", v2:"Bet", v3:"Bet", v4:"Bets", v5:"Betting", example:"I bet he will win.", bn:"আমি বাজি ধরছি, সে জিতবে।" },
  { word:"Bid", meaning:"দর প্রস্তাব করা / আদেশ করা", v1:"Bid", v2:"Bid", v3:"Bid", v4:"Bids", v5:"Bidding", example:"She made a bid for the painting.", bn:"সে ছবিটির জন্য দর প্রস্তাব করল।" },
  { word:"Block", meaning:"বাধা দেওয়া / অবরোধ করা", v1:"Block", v2:"Blocked", v3:"Blocked", v4:"Blocks", v5:"Blocking", example:"A truck blocked the road.", bn:"একটি ট্রাক রাস্তা আটকে দিয়েছিল।" },
  { word:"Bury", meaning:"কবর দেওয়া / মাটিচাপা দেওয়া", v1:"Bury", v2:"Buried", v3:"Buried", v4:"Buries", v5:"Burying", example:"They buried the treasure.", bn:"তারা গুপ্তধনটি মাটির নিচে পুঁতে রাখল।" },
  { word:"Carry out", meaning:"সম্পন্ন করা / বাস্তবায়ন করা", v1:"Carry out", v2:"Carried out", v3:"Carried out", v4:"Carries out", v5:"Carrying out", example:"We carried out the plan.", bn:"আমরা পরিকল্পনাটি বাস্তবায়ন করেছি।" },
  { word:"Challenge", meaning:"চ্যালেঞ্জ করা", v1:"Challenge", v2:"Challenged", v3:"Challenged", v4:"Challenges", v5:"Challenging", example:"I challenge you to try again.", bn:"আমি তোমাকে আবার চেষ্টা করার চ্যালেঞ্জ দিচ্ছি।" },
  { word:"Chop", meaning:"টুকরো টুকরো করে কাটা", v1:"Chop", v2:"Chopped", v3:"Chopped", v4:"Chops", v5:"Chopping", example:"Please chop the onions.", bn:"দয়া করে পেঁয়াজগুলো কুচি করে কাটো।" },
  { word:"Cheat", meaning:"প্রতারণা করা", v1:"Cheat", v2:"Cheated", v3:"Cheated", v4:"Cheats", v5:"Cheating", example:"Never cheat in an exam.", bn:"কখনো পরীক্ষায় প্রতারণা করো না।" },
  { word:"Cite", meaning:"উদ্ধৃত করা", v1:"Cite", v2:"Cited", v3:"Cited", v4:"Cites", v5:"Citing", example:"Please cite your source.", bn:"দয়া করে তোমার তথ্যের উৎস উল্লেখ করো।" },
  { word:"Compose", meaning:"রচনা করা", v1:"Compose", v2:"Composed", v3:"Composed", v4:"Composes", v5:"Composing", example:"She composed a short poem.", bn:"সে একটি ছোট কবিতা রচনা করল।" },
  { word:"Compromise", meaning:"আপস করা", v1:"Compromise", v2:"Compromised", v3:"Compromised", v4:"Compromises", v5:"Compromising", example:"Both sides agreed to compromise.", bn:"দুই পক্ষই আপস করতে রাজি হলো।" },
  { word:"Confine", meaning:"সীমাবদ্ধ রাখা", v1:"Confine", v2:"Confined", v3:"Confined", v4:"Confines", v5:"Confining", example:"Do not confine your ideas to one subject.", bn:"তোমার ধারণাকে একটি বিষয়ের মধ্যে সীমাবদ্ধ রেখো না।" },
  { word:"Confess", meaning:"স্বীকার করা", v1:"Confess", v2:"Confessed", v3:"Confessed", v4:"Confesses", v5:"Confessing", example:"He confessed his mistake.", bn:"সে তার ভুল স্বীকার করল।" },
  { word:"Contribute", meaning:"অবদান রাখা", v1:"Contribute", v2:"Contributed", v3:"Contributed", v4:"Contributes", v5:"Contributing", example:"Everyone can contribute to the project.", bn:"প্রত্যেকে প্রকল্পটিতে অবদান রাখতে পারে।" },
  { word:"Defy", meaning:"অমান্য করা / বিরোধিতা করা", v1:"Defy", v2:"Defied", v3:"Defied", v4:"Defies", v5:"Defying", example:"He refused to defy the rules.", bn:"সে নিয়ম অমান্য করতে অস্বীকার করল।" },
  { word:"Detect", meaning:"শনাক্ত করা", v1:"Detect", v2:"Detected", v3:"Detected", v4:"Detects", v5:"Detecting", example:"The test can detect the problem.", bn:"পরীক্ষাটি সমস্যাটি শনাক্ত করতে পারে।" },
  { word:"Deplore", meaning:"তীব্র নিন্দা করা", v1:"Deplore", v2:"Deplored", v3:"Deplored", v4:"Deplores", v5:"Deploring", example:"We deplore violence.", bn:"আমরা সহিংসতার তীব্র নিন্দা করি।" },
  { word:"Deform", meaning:"বিকৃত করা", v1:"Deform", v2:"Deformed", v3:"Deformed", v4:"Deforms", v5:"Deforming", example:"Heat can deform plastic.", bn:"তাপ প্লাস্টিককে বিকৃত করতে পারে।" },
  { word:"Dishearten", meaning:"নিরুৎসাহিত করা", v1:"Dishearten", v2:"Disheartened", v3:"Disheartened", v4:"Disheartens", v5:"Disheartening", example:"Do not let failure dishearten you.", bn:"ব্যর্থতাকে তোমাকে নিরুৎসাহিত করতে দিও না।" },
  { word:"Displease", meaning:"অসন্তুষ্ট করা", v1:"Displease", v2:"Displeased", v3:"Displeased", v4:"Displeases", v5:"Displeasing", example:"His rude words displeased her.", bn:"তার অভদ্র কথাগুলো তাকে অসন্তুষ্ট করেছিল।" },
  { word:"Dismay", meaning:"হতাশ / বিচলিত করা", v1:"Dismay", v2:"Dismayed", v3:"Dismayed", v4:"Dismays", v5:"Dismaying", example:"The news dismayed us.", bn:"খবরটি আমাদের বিচলিত করেছিল।" },
  { word:"Disappoint", meaning:"হতাশ করা", v1:"Disappoint", v2:"Disappointed", v3:"Disappointed", v4:"Disappoints", v5:"Disappointing", example:"I do not want to disappoint my parents.", bn:"আমি আমার বাবা-মাকে হতাশ করতে চাই না।" },
  { word:"Dodge", meaning:"এড়িয়ে যাওয়া", v1:"Dodge", v2:"Dodged", v3:"Dodged", v4:"Dodges", v5:"Dodging", example:"He dodged the question.", bn:"সে প্রশ্নটি এড়িয়ে গেল।" },
  { word:"Drag", meaning:"টানা", v1:"Drag", v2:"Dragged", v3:"Dragged", v4:"Drags", v5:"Dragging", example:"Please drag the chair closer.", bn:"দয়া করে চেয়ারটি কাছে টেনে আনো।" },
  { word:"Fine", meaning:"জরিমানা করা", v1:"Fine", v2:"Fined", v3:"Fined", v4:"Fines", v5:"Fining", example:"The police fined the driver.", bn:"পুলিশ চালককে জরিমানা করল।" },
  { word:"Find", meaning:"খুঁজে পাওয়া", v1:"Find", v2:"Found", v3:"Found", v4:"Finds", v5:"Finding", example:"I found my keys.", bn:"আমি আমার চাবিগুলো খুঁজে পেয়েছি।" },
  { word:"Flow", meaning:"প্রবাহিত হওয়া", v1:"Flow", v2:"Flowed", v3:"Flowed", v4:"Flows", v5:"Flowing", example:"The river flows south.", bn:"নদীটি দক্ষিণ দিকে প্রবাহিত হয়।" },
  { word:"Fly", meaning:"উড়া", v1:"Fly", v2:"Flew", v3:"Flown", v4:"Flies", v5:"Flying", example:"Birds fly in the sky.", bn:"পাখিরা আকাশে ওড়ে।" },
  { word:"Forgive", meaning:"ক্ষমা করা", v1:"Forgive", v2:"Forgave", v3:"Forgiven", v4:"Forgives", v5:"Forgiving", example:"Please forgive me.", bn:"দয়া করে আমাকে ক্ষমা করো।" },
  { word:"Fry", meaning:"ভাজা", v1:"Fry", v2:"Fried", v3:"Fried", v4:"Fries", v5:"Frying", example:"She fries an egg.", bn:"সে একটি ডিম ভাজে।" },
  { word:"Gain", meaning:"অর্জন করা / লাভ করা", v1:"Gain", v2:"Gained", v3:"Gained", v4:"Gains", v5:"Gaining", example:"You can gain experience by practising.", bn:"অনুশীলনের মাধ্যমে তুমি অভিজ্ঞতা অর্জন করতে পারো।" },
  { word:"Gather", meaning:"জড়ো করা", v1:"Gather", v2:"Gathered", v3:"Gathered", v4:"Gathers", v5:"Gathering", example:"We gathered information.", bn:"আমরা তথ্য সংগ্রহ করেছি।" },
  { word:"Get", meaning:"পাওয়া", v1:"Get", v2:"Got", v3:"Got/Gotten", v4:"Gets", v5:"Getting", example:"I get good results when I practise.", bn:"আমি অনুশীলন করলে ভালো ফল পাই।" },
  { word:"Glorify", meaning:"মহিমান্বিত করা", v1:"Glorify", v2:"Glorified", v3:"Glorified", v4:"Glorifies", v5:"Glorifying", example:"The story glorifies courage.", bn:"গল্পটি সাহসিকতাকে মহিমান্বিত করে।" },
  { word:"Gossip", meaning:"পরনিন্দা / গসিপ করা", v1:"Gossip", v2:"Gossiped", v3:"Gossiped", v4:"Gossips", v5:"Gossiping", example:"They gossip about others.", bn:"তারা অন্যদের নিয়ে গসিপ করে।" },
  { word:"Govern", meaning:"শাসন করা", v1:"Govern", v2:"Governed", v3:"Governed", v4:"Governs", v5:"Governing", example:"Laws govern the country.", bn:"আইন দেশ পরিচালনা করে।" },
  { word:"Grow", meaning:"বড় হওয়া / জন্মানো", v1:"Grow", v2:"Grew", v3:"Grown", v4:"Grows", v5:"Growing", example:"Plants grow in sunlight.", bn:"গাছপালা সূর্যের আলোতে বেড়ে ওঠে।" },
  { word:"Guard", meaning:"পাহারা দেওয়া / রক্ষা করা", v1:"Guard", v2:"Guarded", v3:"Guarded", v4:"Guards", v5:"Guarding", example:"The dog guards the house.", bn:"কুকুরটি বাড়ি পাহারা দেয়।" },
  { word:"Guess", meaning:"অনুমান করা", v1:"Guess", v2:"Guessed", v3:"Guessed", v4:"Guesses", v5:"Guessing", example:"Can you guess the answer?", bn:"তুমি কি উত্তরটি অনুমান করতে পারো?" },
  { word:"Guide", meaning:"পথ দেখানো / নির্দেশনা দেওয়া", v1:"Guide", v2:"Guided", v3:"Guided", v4:"Guides", v5:"Guiding", example:"The teacher guides the students.", bn:"শিক্ষক শিক্ষার্থীদের পথ দেখান।" },
  { word:"Handle", meaning:"সামলানো / পরিচালনা করা", v1:"Handle", v2:"Handled", v3:"Handled", v4:"Handles", v5:"Handling", example:"She can handle the work.", bn:"সে কাজটি সামলাতে পারে।" },
  { word:"Hang (suspend)", meaning:"ঝুলিয়ে রাখা", v1:"Hang", v2:"Hung", v3:"Hung", v4:"Hangs", v5:"Hanging", example:"I hang my bag on the hook.", bn:"আমি আমার ব্যাগটি হুকে ঝুলিয়ে রাখি।" },
  { word:"Eject", meaning:"বহিষ্কার করা", v1:"Eject", v2:"Ejected", v3:"Ejected", v4:"Ejects", v5:"Ejecting", example:"The referee ejected the player.", bn:"রেফারি খেলোয়াড়টিকে বের করে দিলেন।" },
  { word:"Emancipate", meaning:"মুক্ত করা", v1:"Emancipate", v2:"Emancipated", v3:"Emancipated", v4:"Emancipates", v5:"Emancipating", example:"Education can emancipate people.", bn:"শিক্ষা মানুষকে মুক্ত করতে পারে।" },
  { word:"Embrace", meaning:"আলিঙ্গন করা / গ্রহণ করা", v1:"Embrace", v2:"Embraced", v3:"Embraced", v4:"Embraces", v5:"Embracing", example:"She embraced her mother.", bn:"সে তার মাকে আলিঙ্গন করল।" },
  { word:"Emphasize", meaning:"জোর দেওয়া", v1:"Emphasize", v2:"Emphasized", v3:"Emphasized", v4:"Emphasizes", v5:"Emphasizing", example:"The teacher emphasized the rule.", bn:"শিক্ষক নিয়মটির ওপর জোর দিলেন।" },
  { word:"Entrust", meaning:"বিশ্বাস করে দায়িত্ব দেওয়া", v1:"Entrust", v2:"Entrusted", v3:"Entrusted", v4:"Entrusts", v5:"Entrusting", example:"I entrusted him with the task.", bn:"আমি তাকে কাজটির দায়িত্ব দিয়েছিলাম।" },
  { word:"Erect", meaning:"নির্মাণ করা / খাড়া করা", v1:"Erect", v2:"Erected", v3:"Erected", v4:"Erects", v5:"Erecting", example:"They erected a new building.", bn:"তারা একটি নতুন ভবন নির্মাণ করল।" },
  { word:"Escort", meaning:"সঙ্গে করে নিয়ে যাওয়া", v1:"Escort", v2:"Escorted", v3:"Escorted", v4:"Escorts", v5:"Escorting", example:"A guard escorted us inside.", bn:"একজন প্রহরী আমাদের ভেতরে নিয়ে গেলেন।" },
  { word:"Evict", meaning:"উচ্ছেদ করা", v1:"Evict", v2:"Evicted", v3:"Evicted", v4:"Evicts", v5:"Evicting", example:"The court ordered them to evict the building.", bn:"আদালত তাদের ভবনটি খালি করার নির্দেশ দিল।" },
  { word:"Exert", meaning:"প্রয়োগ করা / প্রচেষ্টা চালানো", v1:"Exert", v2:"Exerted", v3:"Exerted", v4:"Exerts", v5:"Exerting", example:"You must exert more effort.", bn:"তোমাকে আরও চেষ্টা করতে হবে।" },
  { word:"Expose", meaning:"প্রকাশ করা / উন্মুক্ত করা", v1:"Expose", v2:"Exposed", v3:"Exposed", v4:"Exposes", v5:"Exposing", example:"The report exposed the truth.", bn:"প্রতিবেদনটি সত্য প্রকাশ করল।" },
  { word:"Falter", meaning:"দ্বিধাগ্রস্ত হওয়া / টলমল করা", v1:"Falter", v2:"Faltered", v3:"Faltered", v4:"Falters", v5:"Faltering", example:"Her voice began to falter.", bn:"তার কণ্ঠস্বর কাঁপতে শুরু করল।" },
  { word:"Fetch", meaning:"নিয়ে আসা", v1:"Fetch", v2:"Fetched", v3:"Fetched", v4:"Fetches", v5:"Fetching", example:"Please fetch me a glass of water.", bn:"দয়া করে আমার জন্য এক গ্লাস পানি নিয়ে এসো।" },
  { word:"Facilitate", meaning:"সহজতর করা", v1:"Facilitate", v2:"Facilitated", v3:"Facilitated", v4:"Facilitates", v5:"Facilitating", example:"Technology facilitates communication.", bn:"প্রযুক্তি যোগাযোগ সহজতর করে।" },
  { word:"Ferry", meaning:"ফেরি করে পারাপার করা", v1:"Ferry", v2:"Ferried", v3:"Ferried", v4:"Ferries", v5:"Ferrying", example:"Boats ferry people across the river.", bn:"নৌকাগুলো মানুষকে নদী পার করে।" },
  { word:"Hijack", meaning:"ছিনতাই করা", v1:"Hijack", v2:"Hijacked", v3:"Hijacked", v4:"Hijacks", v5:"Hijacking", example:"The news reported an attempted hijack.", bn:"খবরে ছিনতাইয়ের একটি চেষ্টার কথা জানানো হয়েছে।" },
  { word:"Hire", meaning:"ভাড়া করা / নিয়োগ দেওয়া", v1:"Hire", v2:"Hired", v3:"Hired", v4:"Hires", v5:"Hiring", example:"The company hires new workers.", bn:"কোম্পানিটি নতুন কর্মী নিয়োগ দেয়।" },
  { word:"Horrify", meaning:"আতঙ্কিত করা", v1:"Horrify", v2:"Horrified", v3:"Horrified", v4:"Horrifies", v5:"Horrifying", example:"The accident horrified everyone.", bn:"দুর্ঘটনাটি সবাইকে আতঙ্কিত করেছিল।" },
  { word:"Hum", meaning:"গুনগুন করা", v1:"Hum", v2:"Hummed", v3:"Hummed", v4:"Hums", v5:"Humming", example:"She hums a song while working.", bn:"কাজ করার সময় সে একটি গান গুনগুন করে।" },
  { word:"Humiliate", meaning:"অপমান করা", v1:"Humiliate", v2:"Humiliated", v3:"Humiliated", v4:"Humiliates", v5:"Humiliating", example:"Never humiliate others.", bn:"অন্যদের কখনো অপমান করো না।" },
  { word:"Hurry", meaning:"তাড়াহুড়া করা", v1:"Hurry", v2:"Hurried", v3:"Hurried", v4:"Hurries", v5:"Hurrying", example:"We must hurry to catch the bus.", bn:"বাস ধরতে আমাদের তাড়াতাড়ি করতে হবে।" },
  { word:"Ignore", meaning:"উপেক্ষা করা", v1:"Ignore", v2:"Ignored", v3:"Ignored", v4:"Ignores", v5:"Ignoring", example:"Do not ignore good advice.", bn:"ভালো পরামর্শ উপেক্ষা করো না।" },
  { word:"Imagine", meaning:"কল্পনা করা", v1:"Imagine", v2:"Imagined", v3:"Imagined", v4:"Imagines", v5:"Imagining", example:"Imagine a world without pollution.", bn:"দূষণহীন একটি পৃথিবী কল্পনা করো।" },
  { word:"Imitate", meaning:"অনুকরণ করা", v1:"Imitate", v2:"Imitated", v3:"Imitated", v4:"Imitates", v5:"Imitating", example:"Children often imitate adults.", bn:"শিশুরা প্রায়ই বড়দের অনুকরণ করে।" },
  { word:"Sacrifice", meaning:"ত্যাগ করা", v1:"Sacrifice", v2:"Sacrificed", v3:"Sacrificed", v4:"Sacrifices", v5:"Sacrificing", example:"She sacrificed her free time to study.", bn:"সে পড়াশোনার জন্য তার অবসর সময় ত্যাগ করেছিল।" },
  { word:"Edit", meaning:"সম্পাদনা করা", v1:"Edit", v2:"Edited", v3:"Edited", v4:"Edits", v5:"Editing", example:"I edit my writing before submitting it.", bn:"জমা দেওয়ার আগে আমি আমার লেখা সম্পাদনা করি।" },
  { word:"Discover", meaning:"আবিষ্কার করা / খুঁজে বের করা", v1:"Discover", v2:"Discovered", v3:"Discovered", v4:"Discovers", v5:"Discovering", example:"They discovered a new place.", bn:"তারা একটি নতুন জায়গা আবিষ্কার করল।" },
  { word:"Discourage", meaning:"নিরুৎসাহিত করা", v1:"Discourage", v2:"Discouraged", v3:"Discouraged", v4:"Discourages", v5:"Discouraging", example:"Do not let mistakes discourage you.", bn:"ভুলগুলোকে তোমাকে নিরুৎসাহিত করতে দিও না।" }
];
const commonExpressions = [
 {level:1, items:[
 ["How are you?","তুমি কেমন আছ?","How are you today?"],["I'm fine.","আমি ভালো আছি।","I'm fine, thank you."],["What happened?","কী হয়েছে?","What happened here?"],["No problem.","কোনো সমস্যা নেই।","No problem, I can help."],["Never mind.","থাক, কিছু মনে করো না।","Never mind, it's okay."],["Of course.","অবশ্যই।","Of course, you can join us."],["I don't know.","আমি জানি না।","I don't know the answer."],["I think so.","আমার তাই মনে হয়।","I think so, too."],["Wait a moment.","একটু অপেক্ষা করো।","Wait a moment, please."],["Be careful.","সাবধানে থেকো।","Be careful on the road."],["Hurry up.","তাড়াতাড়ি করো।","Hurry up or we'll be late."],["Come here.","এখানে আসো।","Come here for a minute."],["Go ahead.","এগিয়ে যাও / শুরু করো।","Go ahead and ask your question."],["That's right.","এটাই ঠিক।","That's right; you are correct."],["Not at all.","একদমই না / স্বাগতম।","Not at all, happy to help."],["Take care.","নিজের যত্ন নিও।","Take care of yourself."],["See you soon.","আবার শিগগির দেখা হবে।","See you soon at school."],["I'm sorry.","আমি দুঃখিত।","I'm sorry for being late."],["Thank you so much.","তোমাকে অনেক ধন্যবাদ।","Thank you so much for your help."],["You're welcome.","স্বাগতম / ধন্যবাদ দেওয়ার কিছু নেই।","You're welcome; anytime."]]},
 {level:2, items:[
 ["As far as I know","আমার যতদূর জানা আছে","As far as I know, the shop is closed."],["To be honest","সত্যি বলতে","To be honest, I disagree."],["In my opinion","আমার মতে","In my opinion, this is a good idea."],["It depends.","এটা নির্ভর করে।","It depends on the weather."],["That makes sense.","কথাটা যুক্তিসংগত।","That makes sense to me."],["I'm looking forward to it.","আমি এটির জন্য অধীর আগ্রহে অপেক্ষা করছি।","I'm looking forward to the trip."],["Keep in touch.","যোগাযোগ রেখো।","Keep in touch after the course."],["Let me know.","আমাকে জানিও।","Let me know when you arrive."],["I have no idea.","আমার কোনো ধারণা নেই।","I have no idea where he went."],["It's up to you.","এটা তোমার সিদ্ধান্ত।","It's up to you to choose."],["Don't get me wrong.","আমাকে ভুল বুঝো না।","Don't get me wrong; I am helping."],["That sounds great.","শুনতে দারুণ লাগছে।","That sounds great to me."],["I'm afraid so.","দুঃখজনকভাবে তাই মনে হচ্ছে।","I'm afraid so; the event is cancelled."],["I'm afraid not.","দুঃখিত, তা সম্ভব নয়।","I'm afraid not; we're fully booked."],["By the way","প্রসঙ্গক্রমে","By the way, how is your study going?"],["For example","উদাহরণস্বরূপ","For example, you can practise daily."],["On the other hand","অন্যদিকে","On the other hand, it may cost more."],["In that case","সে ক্ষেত্রে","In that case, call me tomorrow."],["As soon as possible","যত দ্রুত সম্ভব","Please reply as soon as possible."],["Make yourself at home.","নিজের বাড়ির মতো স্বচ্ছন্দ বোধ করো।","Come in and make yourself at home."]]},
 {level:3, items:[
 ["I couldn't agree more.","আমি এর সঙ্গে পুরোপুরি একমত।","I couldn't agree more with your point."],["It slipped my mind.","বিষয়টি আমার মন থেকে সরে গিয়েছিল।","Sorry, it slipped my mind."],["Let's get straight to the point.","চলো সরাসরি মূল কথায় আসি।","Let's get straight to the point."],["That rings a bell.","কথাটি পরিচিত মনে হচ্ছে।","That name rings a bell."],["I'm on the same page.","আমি একই বিষয়ে একমত / বুঝতে পেরেছি।","We are on the same page now."],["I see your point.","আমি তোমার বক্তব্য বুঝতে পারছি।","I see your point, but I disagree."],["It's not worth it.","এটি করার মতো লাভজনক নয়।","Arguing about it is not worth it."],["Don't take it personally.","ব্যক্তিগতভাবে নিয়ো না।","Don't take it personally; it was feedback."],["I'll keep that in mind.","আমি বিষয়টি মনে রাখব।","I'll keep that in mind next time."],["That is beside the point.","ওটা মূল বিষয়ের বাইরে।","That is beside the point."],["Let's call it a day.","আজকের মতো কাজ শেষ করি।","We've done enough; let's call it a day."],["I'm running out of time.","আমার সময় ফুরিয়ে আসছে।","I'm running out of time."],["It goes without saying.","এ কথা বলার অপেক্ষা রাখে না।","It goes without saying that practice matters."],["I take your word for it.","আমি তোমার কথা বিশ্বাস করছি।","I take your word for it."],["There's no point in worrying.","দুশ্চিন্তা করে লাভ নেই।","There's no point in worrying now."],["Let's not jump to conclusions.","চলো তাড়াহুড়া করে সিদ্ধান্তে না পৌঁছাই।","Let's not jump to conclusions."],["I beg to differ.","আমি বিনয়ের সঙ্গে দ্বিমত পোষণ করছি।","I beg to differ on this issue."],["It is easier said than done.","বলা সহজ, করা কঠিন।","Changing habits is easier said than done."],["We are running late.","আমাদের দেরি হয়ে যাচ্ছে।","We are running late for class."],["The choice is yours.","সিদ্ধান্ত তোমার।","The choice is yours."]]}];

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
  const total = levels.reduce((n, l) => n + l.topics.length, 0) + words.length + commonExpressions.reduce((n,g)=>n+g.items.length,0) + twisterGroups.reduce((n,g) => n + g.items.length,0) + quiz.length;
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
    host.innerHTML = `<div class="level-grid">${levels.map((level,i) => `<button class="level-tile" data-level="0${i+1}" ${i===3?'disabled':''}><span>${level.title}</span><small>${i===3?'Coming Soon':'Open lessons ↗'}</small></button>`).join("")}</div><div id="levelDetail"></div>`;
  } else if (tab === "vocabulary") {
    host.innerHTML = `<div class="vocab-intro"><span>WORD LIBRARY</span><h3>Build your vocabulary</h3><p>আগের অনুশীলন করা শব্দগুলো এখানে রাখা হয়েছে। Level 1-এর ২০০টি বইয়ের শব্দ ছবি পাওয়ার পর সম্পূর্ণ করা হবে।</p></div><div class="hub-grid">${[1,2,3,4].map(n => `<article class="hub-card vocab-level-card"><div class="eyebrow">VOCABULARY · 0${n}</div><h3>Level ${n}</h3><p>${n===1?`${words.length} saved words · meanings · V1–V5 · examples`:'More words will be added later'}</p><button class="hub-action ${n===1?'primary':''}" data-vocab="${n}">${n===1?'Explore words':'Coming Soon'}</button></article>`).join("")}</div><div id="vocabDetail"></div>`;
  } else if (tab === "twisters") {
    host.innerHTML = twisterGroups.map((g,gi) => `<div class="twister-group"><h3>${g.title}</h3><div class="hub-grid">${g.items.map((t,i) => `<div class="twister-card"><p>${escapeHtml(t)}</p><div><button class="hub-action" data-speak="${encodeURIComponent(t)}" aria-label="Listen">🔊 Audio</button><button class="hub-action" data-twister-done="${gi}-${i}">Done</button></div></div>`).join("")}</div></div>`).join("");
  } else if (tab === "expressions") {
    host.innerHTML = `<div class="expression-intro"><span>EVERYDAY ENGLISH</span><h3>Common Expressions</h3><p>দৈনন্দিন কথোপকথন থেকে advanced expressions পর্যন্ত।</p></div><div class="hub-grid">${commonExpressions.map(g => `<article class="hub-card expression-level-card"><div class="eyebrow">CONVERSATION COLLECTION</div><h3>Level ${g.level}</h3><p>${g.level===1?'Everyday basics':g.level===2?'Natural conversation':'Fluent expression'} · ${g.items.length} expressions</p><button class="hub-action primary" data-expression-level="${g.level}">Open Level ↗</button></article>`).join("")}</div><div id="expressionDetail"></div>`;
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
  detail.innerHTML = `<div class="hub-detail vocab-detail"><div class="detail-top"><div><div class="eyebrow">LEVEL 01 · WORD BANK</div><h3>Vocabulary Level 1</h3><p class="muted">${words.length}টি আগের অনুশীলনের শব্দ</p></div><button class="back-level" data-vocab-back>← Back</button></div><input class="word-search" id="wordSearch" placeholder="Search vocabulary..." aria-label="Search vocabulary"><div class="hub-grid" id="wordGrid">${words.map((w,i) => `<article class="word-card"><div class="word-number">WORD ${String(i+1).padStart(2,'0')}</div><h3>${escapeHtml(w.word)}</h3><p class="word-meaning">অর্থ: ${escapeHtml(w.meaning)}</p><div class="verb-forms"><span><b>V1</b>${escapeHtml(w.v1)}</span><span><b>V2</b>${escapeHtml(w.v2)}</span><span><b>V3</b>${escapeHtml(w.v3)}</span><span><b>V4</b>${escapeHtml(w.v4)}</span><span><b>V5</b>${escapeHtml(w.v5)}</span></div><p class="word-example"><strong>${escapeHtml(w.example)}</strong><br><span>${escapeHtml(w.bn)}</span></p><button class="hub-action" data-word-done="${i}">Mark learned ✓</button></article>`).join("")}</div><p class="muted">তোমার বইয়ের Level 1-এর ২০০টি শব্দের ছবি দিলে এই তালিকাটি বইয়ের সঠিক ক্রমে সাজিয়ে দেওয়া হবে।</p></div>`;
  $("wordSearch").addEventListener("input", e => { const q=e.target.value.toLowerCase(); document.querySelectorAll("#wordGrid .word-card").forEach(card => card.classList.toggle("hidden", !card.textContent.toLowerCase().includes(q))); });
}
function openExpressions(level) {
  const group = commonExpressions.find(g => g.level === level); const host = $("expressionDetail"); if (!group || !host) return;
  host.innerHTML = `<div class="hub-detail expression-detail"><div class="detail-top"><div><div class="eyebrow">COMMON EXPRESSIONS · LEVEL 0${level}</div><h3>${level===1?'Everyday Basics':level===2?'Natural Conversation':'Fluent Expressions'}</h3><p class="muted">${group.items.length}টি expression</p></div><button class="back-level" data-expression-back>← Back</button></div><div class="expression-list">${group.items.map((item,i)=>`<article class="expression-row"><div class="expression-index">${String(i+1).padStart(2,'0')}</div><div class="expression-body"><h4>${escapeHtml(item[0])}</h4><p>${escapeHtml(item[1])}</p><small>Example: ${escapeHtml(item[2])}</small></div><button class="hub-action" data-speak="${encodeURIComponent(item[0])}">🔊</button></article>`).join("")}</div></div>`;
  host.scrollIntoView({behavior:"smooth",block:"nearest"});
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
  if (b.dataset.expressionLevel) openExpressions(Number(b.dataset.expressionLevel));
  if (b.dataset.expressionBack !== undefined) { $("expressionDetail").innerHTML = ""; $("hubContent").scrollIntoView({behavior:"smooth",block:"start"}); }
  if (b.dataset.vocabBack !== undefined) { $("vocabDetail").innerHTML = ""; $("hubContent").scrollIntoView({behavior:"smooth",block:"start"}); }
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
