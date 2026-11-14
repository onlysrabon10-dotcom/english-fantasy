const $ = (id) => document.getElementById(id);
let adminToken = "";
let learnerId = "";
let activeTab = "levels";
let currentLevelIndex = 0;
const progressKey = () => `ef-progress-${learnerId || "guest"}`;
const completed = new Set();

const levels = [
  { title: "Level 1", subtitle: "Grammar Foundation", topics: ["Use of Be Verbs", "Use of Have Verbs", "Tense"] },
  { title: "Level 2", subtitle: "Build Your Sentences", topics: ["Use of Modals", "Sentence Pattern", "Use of There", "First Conditional", "Second Conditional", "Second Conditional (Imagine)", "Use of Get"] },
  { title: "Level 3", subtitle: "Grammar in Use", topics: ["Use of Prepositions", "Articles (A, An, The)", "Passive Voice", "Causative Voice"] },
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
  "Use of Modals": [{ heading: "Modal verbs কী?", structure: "Subject + modal + V1 + (object/complement)", examples: ["Modal verb মূল verb-এর আগে বসে ability, permission, possibility, advice, obligation, willingness ইত্যাদি বোঝায়।", "Modal-এর পরে সাধারণত verb-এর base form (V1) বসে; he/she/it হলেও modal-এর সঙ্গে s/es যোগ হয় না।", "She can swim. — সে সাঁতার কাটতে পারে।", "You should study. — তোমার পড়াশোনা করা উচিত।"] }],
  "Sentence Pattern": [{ heading: "S + V", structure: "Subject + Verb", examples: ["Birds fly. — পাখিরা ওড়ে।", "The baby cried. — শিশুটি কেঁদেছিল।"] }, { heading: "S + V + O", structure: "Subject + Verb + Object", examples: ["I read a book. — আমি একটি বই পড়ি।", "She drinks water. — সে পানি পান করে।"] }, { heading: "S + V + C", structure: "Subject + Verb + Complement", examples: ["He is happy. — সে খুশি।", "They became friends. — তারা বন্ধু হয়ে গেল।"] }, { heading: "S + V + IO + DO", structure: "Subject + Verb + Indirect Object + Direct Object", examples: ["She gave me a gift. — সে আমাকে একটি উপহার দিয়েছিল।"] }, { heading: "S + V + O + C", structure: "Subject + Verb + Object + Complement", examples: ["They elected him captain. — তারা তাকে অধিনায়ক নির্বাচিত করল।"] }],
  "Use of There": [{ heading: "There is / There are — অস্তিত্ব বা উপস্থিতি", structure: "There + is + singular/uncountable noun; There + are + plural noun", examples: ["There is a book on the table. — টেবিলের ওপর একটি বই আছে।", "There are two cats in the garden. — বাগানে দুটি বিড়াল আছে।", "There is some water in the glass. — গ্লাসে কিছু পানি আছে।"] }, { heading: "Past and Future", structure: "There + was/were + noun; There + will be + noun", examples: ["There was a problem. — একটি সমস্যা ছিল।", "There will be a meeting tomorrow. — আগামীকাল একটি মিটিং হবে।"] }, { heading: "Negative and Questions", structure: "There + is/are + not + noun; Is/Are + there + noun?", examples: ["There isn't any milk. — কোনো দুধ নেই।", "Are there any questions? — কোনো প্রশ্ন আছে কি?"] }],
  "First Conditional": [{ heading: "ব্যবহার", structure: "If + Present Simple, Subject + will + V1", examples: ["ভবিষ্যতে বাস্তবসম্মত কোনো শর্ত পূরণ হলে কী হবে তা বোঝাতে First Conditional ব্যবহৃত হয়।", "If it rains, I will stay home. — বৃষ্টি হলে আমি বাড়িতে থাকব।", "If you study, you will pass. — তুমি পড়াশোনা করলে পাস করবে।", "If she comes, I will call you. — সে এলে আমি তোমাকে ফোন করব।"] }, { heading: "Negative ও Question", structure: "If + don't/doesn't + V1, subject + will/won't + V1", examples: ["If you don't hurry, you will miss the bus. — তুমি তাড়াতাড়ি না করলে বাস মিস করবে।", "What will you do if it rains? — বৃষ্টি হলে তুমি কী করবে?"] }],
  "Second Conditional": [{ heading: "ব্যবহার", structure: "If + Past Simple, Subject + would + V1", examples: ["বর্তমান বা ভবিষ্যতের কাল্পনিক/অবাস্তব বা কম সম্ভাবনাময় পরিস্থিতি বোঝাতে ব্যবহৃত হয়।", "If I had time, I would travel. — আমার সময় থাকলে আমি ভ্রমণ করতাম।", "If I were rich, I would help people. — আমি ধনী হলে মানুষকে সাহায্য করতাম।"] }, { heading: "মনে রাখবে", structure: "If-clause-এ Past Simple; মূল clause-এ would + V1", examples: ["সাধারণত If-clause-এ would বসে না। প্রচলিত formal usage-এ be verb-এর ক্ষেত্রে সব subject-এর সঙ্গে were ব্যবহার করা যায়।", "If she studied harder, she would get better results. — সে আরও মনোযোগ দিয়ে পড়লে ভালো ফল করত।"] }],
  "Second Conditional (Imagine)": [{ heading: "ব্যবহার", structure: "Imagine + (that) + subject + Past Simple; subject + would + V1", examples: ["কোনো কাল্পনিক পরিস্থিতি কল্পনা করতে Imagine ব্যবহার করা যায়। এরপর সেই পরিস্থিতিতে কী হতে পারে বোঝাতে would + V1 বসে।", "Imagine you were rich. What would you do? — কল্পনা করো তুমি ধনী হলে। তুমি কী করতে?", "Imagine you lived abroad. Where would you go? — কল্পনা করো তুমি বিদেশে থাকতে। তুমি কোথায় যেতে?"] }, { heading: "আরও Pattern", structure: "What would you do if ...? / Imagine + V-ing", examples: ["What would you do if you won a prize? — তুমি পুরস্কার জিতলে কী করতে?", "Imagine living near the sea. — সমুদ্রের কাছে বসবাস করার কথা কল্পনা করো।"] }],
  "Use of Get": [{ heading: "Get-এর সাধারণ অর্থ", structure: "get + noun = পাওয়া/নেওয়া; get + adjective = হয়ে যাওয়া; get to + place = পৌঁছানো", examples: ["I got a gift. — আমি একটি উপহার পেয়েছি।", "It's getting cold. — ঠান্ডা পড়ছে।", "We got to school early. — আমরা স্কুলে তাড়াতাড়ি পৌঁছেছিলাম।"] }, { heading: "Phrasal / common uses", structure: "get up, get in, get out, get back, get along with, get ready", examples: ["I get up at six. — আমি ছয়টায় ঘুম থেকে উঠি।", "Get in the car. — গাড়িতে ওঠো।", "Please get out. — দয়া করে বাইরে যাও।", "I get along with my classmates. — আমি আমার সহপাঠীদের সঙ্গে ভালোভাবে মিশি।", "Get ready quickly. — দ্রুত প্রস্তুত হও।"] }],
  "Use of Prepositions": [
    { heading: "Preposition কী এবং কোথায় বসে", structure: "Preposition + noun/pronoun; সাধারণত noun/pronoun-এর আগে বসে", examples: ["Preposition স্থান, সময়, দিক, অবস্থান ও সম্পর্ক বোঝায়।", "The book is on the table. — বইটি টেবিলের ওপর।", "I live in Dhaka. — আমি ঢাকায় থাকি।", "She came with me. — সে আমার সঙ্গে এসেছিল।"] },
    { heading: "Place: IN, ON, AT", structure: "IN = বড় এলাকা/ভেতরে; ON = পৃষ্ঠের ওপর; AT = নির্দিষ্ট point", examples: ["I live in Bangladesh. — আমি বাংলাদেশে থাকি।", "The phone is on the desk. — ফোনটি ডেস্কের ওপর।", "Meet me at the gate. — গেটে আমার সঙ্গে দেখা করো।", "She is in the room. — সে ঘরের ভেতরে আছে।"] },
    { heading: "Near, Close to, Beside, By", structure: "near/close to = কাছাকাছি; beside = ঠিক পাশে; by = পাশে/দ্বারা", examples: ["My school is near my house. — আমার স্কুল বাড়ির কাছে।", "The shop is close to the bank. — দোকানটি ব্যাংকের কাছাকাছি।", "Sit beside me. — আমার পাশে বসো।", "There is a tree by the road. — রাস্তার পাশে একটি গাছ আছে।"] },
    { heading: "TO, TOWARDS, ALONG, ACROSS", structure: "to = গন্তব্য; towards = দিক বরাবর; along = কোনো কিছুর পাশ ধরে; across = এক পাশ থেকে অন্য পাশে", examples: ["I am going to school. — আমি স্কুলে যাচ্ছি।", "He walked towards the door. — সে দরজার দিকে হাঁটল।", "We walked along the river. — আমরা নদীর পাশ ধরে হাঁটলাম।", "She walked across the road. — সে রাস্তা পার হলো।"] },
    { heading: "BEFORE, IN FRONT OF, BEHIND, OPPOSITE", structure: "before = আগে; in front of = সামনে; behind = পেছনে; opposite = বিপরীতে", examples: ["Wash your hands before dinner. — রাতের খাবারের আগে হাত ধুয়ে নাও।", "The car is in front of the house. — গাড়িটি বাড়ির সামনে।", "The garden is behind the school. — বাগানটি স্কুলের পেছনে।", "The bank is opposite the hospital. — ব্যাংকটি হাসপাতালের বিপরীতে।"] },
    { heading: "BETWEEN, AMONG", structure: "between = সাধারণত দুই ব্যক্তি/বস্তুর মধ্যে; among = একাধিকের মধ্যে", examples: ["The ball is between the boxes. — বলটি বাক্স দুটির মাঝে।", "She sat among her friends. — সে বন্ধুদের মাঝে বসেছিল।"] },
    { heading: "ABOVE, OVER, UNDER, BELOW, BENEATH, UNDERNEATH", structure: "above = উপরে (স্পর্শ ছাড়া); over = উপরে/ঢেকে; under/beneath/underneath = নিচে; below = নিম্ন স্তরে", examples: ["The fan is above my head. — পাখাটি আমার মাথার ওপরে।", "A plane flew over the city. — একটি বিমান শহরের ওপর দিয়ে উড়ল।", "The shoes are under the bed. — জুতাগুলো বিছানার নিচে।", "The temperature is below zero. — তাপমাত্রা শূন্যের নিচে।"] },
    { heading: "INSIDE, INTO, OUT OF, OUTSIDE", structure: "inside = ভেতরে অবস্থান; into = ভেতরের দিকে প্রবেশ; out of = ভেতর থেকে বাইরে; outside = বাইরে", examples: ["Stay inside the house. — বাড়ির ভেতরে থাকো।", "She went into the room. — সে ঘরের ভেতরে ঢুকল।", "Take the book out of the bag. — ব্যাগ থেকে বইটি বের করো।", "Wait outside the classroom. — শ্রেণিকক্ষের বাইরে অপেক্ষা করো।"] },
    { heading: "OF, OFF", structure: "of = সম্পর্ক/অংশ/মালিকানা; off = কোনো পৃষ্ঠ থেকে আলাদা/বন্ধ", examples: ["The cover of the book is blue. — বইটির মলাট নীল।", "Take your feet off the table. — টেবিল থেকে পা সরাও।", "The light is off. — বাতিটি বন্ধ।"] }
  ],
  "Articles (A, An, The)": [
    { heading: "A এবং AN-এর মূল নিয়ম", structure: "a + consonant sound; an + vowel sound; singular countable noun-এর আগে", examples: ["a book, a university (ইউ ধ্বনি), a European country.", "an apple, an hour (h নীরব), an honest man.", "I saw a bird. — আমি একটি পাখি দেখেছি।", "She is an honest girl. — সে একজন সৎ মেয়ে।"] },
    { heading: "THE-এর ব্যবহার", structure: "the + নির্দিষ্ট/আগে উল্লেখ করা noun; unique things; superlative; ordinal", examples: ["I saw a dog. The dog was black. — আমি একটি কুকুর দেখলাম। কুকুরটি কালো ছিল।", "The sun is bright. — সূর্য উজ্জ্বল।", "He is the tallest boy. — সে সবচেয়ে লম্বা ছেলে।", "This is the first chapter. — এটি প্রথম অধ্যায়।"] },
    { heading: "যেখানে Article বসে না (Zero Article)", structure: "সাধারণ অর্থে plural/uncountable noun, অধিকাংশ proper name, language/subject-এর আগে article নয়", examples: ["Books are useful. — বই উপকারী।", "Water is important. — পানি গুরুত্বপূর্ণ।", "I speak English. — আমি ইংরেজি বলি।", "Dhaka is a busy city. — ঢাকা একটি ব্যস্ত শহর।"] },
    { heading: "বিশেষ নিয়ম ও Common Mistakes", structure: "a/an বানানের অক্ষর নয়, উচ্চারণের sound অনুসারে; meal, school, bed ইত্যাদিতে অর্থভেদে article বদলায়", examples: ["an MBA student; a one-eyed man; an hour.", "I go to school. (শিক্ষার্থী হিসেবে); I went to the school. (নির্দিষ্ট ভবনে)।", "She plays the piano. — সে পিয়ানো বাজায়।", "The rich should help the poor. — ধনীদের দরিদ্রদের সাহায্য করা উচিত।"] }
  ],
  "Passive Voice": [
    { heading: "Passive Voice কী", structure: "Active: Subject + Verb + Object; Passive: Object + be verb + V3 (+ by + doer)", examples: ["Active: They make cars. — তারা গাড়ি তৈরি করে।", "Passive: Cars are made (by them). — গাড়ি তৈরি করা হয়।", "Object-কে গুরুত্ব দিতে বা doer অজানা/অপ্রয়োজনীয় হলে Passive ব্যবহৃত হয়।"] },
    { heading: "Tense অনুযায়ী Passive Structure", structure: "Present Simple: am/is/are + V3; Past Simple: was/were + V3; Future: will be + V3", examples: ["Rice is eaten. — ভাত খাওয়া হয়।", "The window was broken. — জানালাটি ভাঙা হয়েছিল।", "The work will be finished. — কাজটি শেষ করা হবে।", "Present Continuous: am/is/are being + V3; Present Perfect: has/have been + V3."] },
    { heading: "Negative, Question ও Modal Passive", structure: "be + not + V3; Be + subject + V3?; modal + be + V3", examples: ["The room isn't cleaned. — ঘরটি পরিষ্কার করা হয় না।", "Was the letter sent? — চিঠিটি কি পাঠানো হয়েছিল?", "The rules must be followed. — নিয়মগুলো অবশ্যই মানতে হবে।", "The work can be done. — কাজটি করা যেতে পারে।"] },
    { heading: "Passive করার ধাপ ও সতর্কতা", structure: "Active-এর object-কে subject করো + tense অনুযায়ী be verb + V3; প্রয়োজন হলে by + doer", examples: ["She wrote a letter. → A letter was written by her.", "People speak English here. → English is spoken here.", "যে verb-এর object নেই (যেমন sleep, arrive), সাধারণত তার Passive হয় না।"] }
  ],
  "Causative Voice": [
    { heading: "Causative Voice কী", structure: "কাউকে দিয়ে কোনো কাজ করানো/করিয়ে নেওয়া বোঝায়", examples: ["I had my hair cut. — আমি চুল কাটিয়েছি।", "She got her phone repaired. — সে তার ফোন মেরামত করিয়েছে।"] },
    { heading: "HAVE / GET + Object + V3", structure: "Subject + have/has/had + object + V3; Subject + get/gets/got + object + V3", examples: ["I have my room cleaned. — আমি আমার ঘর পরিষ্কার করাই।", "He had his car washed. — সে তার গাড়ি ধুইয়েছিল।", "We got the computer fixed. — আমরা কম্পিউটারটি ঠিক করিয়েছি।"] },
    { heading: "HAVE / MAKE / LET + Person + V1", structure: "have + person + V1; make + person + V1; let + person + V1", examples: ["I had him check the answer. — আমি তাকে উত্তরটি পরীক্ষা করতে বলেছিলাম/দিয়ে করিয়েছিলাম।", "The teacher made us rewrite it. — শিক্ষক আমাদের দিয়ে এটি আবার লিখিয়েছিলেন।", "Let me go. — আমাকে যেতে দাও।"] },
    { heading: "GET + Person + TO + V1; HELP", structure: "get + person + to + V1; help + person + (to) V1", examples: ["I got my brother to help me. — আমি আমার ভাইকে আমাকে সাহায্য করতে রাজি করিয়েছি।", "She helped me (to) carry the box. — সে আমাকে বাক্সটি বহন করতে সাহায্য করেছে।", "মনে রাখবে: make/let-এর পরে সাধারণত to ছাড়া V1; get-এর পরে person থাকলে to + V1।"] }
  ]
};
const modalLessons = {
  "Can": { meaning:"সামর্থ্য, দক্ষতা, অনানুষ্ঠানিক অনুমতি বা সম্ভাবনা বোঝায়।", structure:"Subject + can + V1; Negative: cannot/can't; Question: Can + subject + V1?", examples:["I can swim. — আমি সাঁতার কাটতে পারি।","Can I come in? — আমি কি ভেতরে আসতে পারি?","She can't drive. — সে গাড়ি চালাতে পারে না।"] },
  "Could": { meaning:"অতীতের সামর্থ্য, ভদ্র অনুরোধ, অথবা কম নিশ্চিত সম্ভাবনা বোঝায়।", structure:"Subject + could + V1; Could + subject + V1?", examples:["I could run fast when I was young. — ছোটবেলায় আমি দ্রুত দৌড়াতে পারতাম।","Could you help me? — আপনি কি আমাকে সাহায্য করতে পারবেন?","It could rain later. — পরে বৃষ্টি হতে পারে।"] },
  "May": { meaning:"আনুষ্ঠানিক অনুমতি এবং সম্ভাবনা বোঝায়।", structure:"Subject + may + V1; May + subject + V1?", examples:["May I come in? — আমি কি ভেতরে আসতে পারি?","It may rain today. — আজ বৃষ্টি হতে পারে।","You may leave now. — আপনি এখন যেতে পারেন।"] },
  "Might": { meaning:"কম নিশ্চিত সম্ভাবনা বা ভদ্র/সতর্ক পরামর্শ বোঝায়।", structure:"Subject + might + V1", examples:["She might come today. — সে আজ আসতেও পারে।","I might visit them. — আমি তাদের দেখতে যেতে পারি।","You might try again. — তুমি আরেকবার চেষ্টা করে দেখতে পারো।"] },
  "Must": { meaning:"জোরালো বাধ্যবাধকতা, প্রয়োজন বা দৃঢ় অনুমান বোঝায়।", structure:"Subject + must + V1; must not/mustn't = নিষেধ", examples:["You must obey the rules. — তোমাকে নিয়ম মানতেই হবে।","You mustn't be late. — তোমার দেরি করা চলবে না।","He must be tired. — তার নিশ্চয়ই ক্লান্ত লাগছে।"] },
  "Shall": { meaning:"প্রস্তাব, পরামর্শ বা আনুষ্ঠানিক ভবিষ্যৎ বোঝাতে I/We-এর সঙ্গে ব্যবহৃত হয়।", structure:"Shall + I/we + V1?; Subject + shall + V1 (formal)", examples:["Shall we start? — আমরা কি শুরু করব?","Shall I open the window? — আমি কি জানালাটি খুলব?","We shall overcome this difficulty. — আমরা এই অসুবিধা কাটিয়ে উঠব।"] },
  "Should": { meaning:"উপদেশ, কর্তব্য, প্রত্যাশা বা উচিত বোঝায়।", structure:"Subject + should + V1; should not/shouldn't + V1", examples:["You should study regularly. — তোমার নিয়মিত পড়াশোনা করা উচিত।","You shouldn't waste time. — তোমার সময় নষ্ট করা উচিত নয়।","Should I call him? — আমার কি তাকে ফোন করা উচিত?"] },
  "Will": { meaning:"ভবিষ্যৎ, সিদ্ধান্ত, প্রতিশ্রুতি বা ইচ্ছা বোঝায়।", structure:"Subject + will + V1; will not/won't + V1", examples:["I will call you tomorrow. — আমি আগামীকাল তোমাকে ফোন করব।","She won't come today. — সে আজ আসবে না।","Will you help me? — তুমি কি আমাকে সাহায্য করবে?"] },
  "Would": { meaning:"ভদ্র অনুরোধ, কল্পিত পরিস্থিতি, অতীতের অভ্যাস বা ইচ্ছা বোঝায়।", structure:"Subject + would + V1; Would + subject + V1?", examples:["Would you please help me? — আপনি কি দয়া করে আমাকে সাহায্য করবেন?","If I had money, I would travel. — আমার টাকা থাকলে আমি ভ্রমণ করতাম।","When we were young, we would play outside. — আমরা ছোটবেলায় বাইরে খেলতাম।"] },
  "Ought to": { meaning:"নৈতিক দায়িত্ব বা উপদেশ বোঝায়; should-এর কাছাকাছি অর্থ।", structure:"Subject + ought to + V1; ought not to + V1", examples:["You ought to respect your parents. — তোমার বাবা-মাকে সম্মান করা উচিত।","We ought to help others. — আমাদের অন্যদের সাহায্য করা উচিত।"] },
  "Need to": { meaning:"প্রয়োজন বা দরকার বোঝায়। এটি semi-modal expression।", structure:"Subject + need/needs to + V1; past: needed to + V1", examples:["I need to study. — আমার পড়াশোনা করা দরকার।","She needs to rest. — তার বিশ্রাম নেওয়া দরকার।","We needed to leave early. — আমাদের তাড়াতাড়ি বের হওয়া দরকার ছিল।"] },
  "Dare": { meaning:"সাহস থাকা বা সাহস করে কিছু করা বোঝায়; modal ও ordinary verb—দুইভাবেই আসে।", structure:"Dare + subject + V1? (modal); Subject + dare(s) to + V1 (ordinary verb)", examples:["Dare he speak to the teacher? — সে কি শিক্ষকের সঙ্গে কথা বলার সাহস করে?","She doesn't dare to ask. — সে জিজ্ঞেস করার সাহস পায় না।"] },
  "Used to": { meaning:"অতীতের অভ্যাস বা আগের অবস্থা বোঝায়, যা এখন আর নেই বা নিয়মিত ঘটে না। এটি semi-modal pattern।", structure:"Subject + used to + V1; Negative: didn't use to + V1; Question: Did + subject + use to + V1?", examples:["I used to play football. — আমি আগে ফুটবল খেলতাম।","She didn't use to drink tea. — সে আগে চা পান করত না।","Did you use to live here? — তুমি কি আগে এখানে থাকতে?"] },
  "Would you mind": { meaning:"ভদ্রভাবে অনুরোধ করতে ব্যবহৃত হয়। এর পরে verb-ing বসে; noun-ও বসতে পারে।", structure:"Would you mind + V-ing...?; Would you mind if + subject + past verb...?", examples:["Would you mind opening the window? — জানালাটি খুলে দিলে কি আপনার অসুবিধা হবে?","Would you mind waiting here? — এখানে অপেক্ষা করলে কি আপনার অসুবিধা হবে?","Would you mind if I sat here? — আমি এখানে বসলে কি আপনার আপত্তি হবে?"] },
  "Supposed to": { meaning:"কোনো নিয়ম, দায়িত্ব, প্রত্যাশা বা নির্ধারিত কাজ বোঝায়।", structure:"Subject + am/is/are supposed to + V1; was/were supposed to + V1", examples:["I am supposed to study now. — আমার এখন পড়াশোনা করার কথা।","You are not supposed to smoke here. — এখানে তোমার ধূমপান করার কথা নয়।","We were supposed to meet yesterday. — গতকাল আমাদের দেখা করার কথা ছিল।"] },
  "Yet to": { meaning:"কোনো কাজ এখনো সম্পন্ন হয়নি, তবে হওয়ার বাকি আছে—এমন অর্থ বোঝায়।", structure:"Subject + have/has + yet to + V1; Subject + be + yet to + V1 (formal use)", examples:["I have yet to finish my homework. — আমার এখনও বাড়ির কাজ শেষ করা বাকি।","The train is yet to arrive. — ট্রেনটির এখনও পৌঁছানো বাকি।","She has yet to reply. — তার এখনও উত্তর দেওয়া বাকি।"] },
  "Likely to": { meaning:"কোনো কাজ হওয়ার সম্ভাবনা বেশি বোঝায়।", structure:"Subject + am/is/are likely to + V1; Subject + be not likely to + V1", examples:["It is likely to rain. — বৃষ্টি হওয়ার সম্ভাবনা আছে।","He is likely to win. — তার জেতার সম্ভাবনা বেশি।","They are not likely to come. — তাদের আসার সম্ভাবনা কম।"] },
  "Am/Is/Are to": { meaning:"নির্ধারিত পরিকল্পনা, আনুষ্ঠানিক নির্দেশ বা দায়িত্ব বোঝায়।", structure:"Subject + am/is/are to + V1; Negative: am/is/are not to + V1", examples:["I am to meet the principal. — আমার প্রধান শিক্ষকের সঙ্গে দেখা করার কথা।","You are to submit the form today. — তোমাকে আজ ফর্ম জমা দিতে হবে।","She is not to leave early. — তার আগে চলে যাওয়ার কথা নয়।"] },
  "Was/Were to": { meaning:"অতীতে নির্ধারিত পরিকল্পনা বা দায়িত্ব বোঝায়; কাজটি ঘটেছিল কি না তা প্রসঙ্গ থেকে বোঝা যায়।", structure:"Subject + was/were to + V1; Negative: was/were not to + V1", examples:["I was to visit him yesterday. — গতকাল আমার তার সঙ্গে দেখা করার কথা ছিল।","They were to start at noon. — তাদের দুপুরে শুরু করার কথা ছিল।","He was not to tell anyone. — তার কাউকে বলার কথা ছিল না।"] }
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
  {
    "level": 1,
    "items": [
      [
        "Come here.",
        "এখানে এসো।",
        ""
      ],
      [
        "Go up.",
        "ওপরে যাও।",
        ""
      ],
      [
        "Go down.",
        "নিচে যাও।",
        ""
      ],
      [
        "Go slowly / Walk.",
        "ধীরে যাও / হেঁটে যাও।",
        ""
      ],
      [
        "Go at once.",
        "এখনই যাও।",
        ""
      ],
      [
        "Go straight.",
        "সোজা যাও।",
        ""
      ],
      [
        "Go away / Get out.",
        "চলে যাও।",
        ""
      ],
      [
        "Go ahead.",
        "এগিয়ে যাও।",
        ""
      ],
      [
        "Come near.",
        "কাছে এসো।",
        ""
      ],
      [
        "Wait outside.",
        "বাইরে অপেক্ষা করো।",
        ""
      ],
      [
        "Go on!",
        "চালিয়ে যাও!",
        ""
      ],
      [
        "Go back.",
        "ফিরে যাও।",
        ""
      ],
      [
        "Go to hell.",
        "জাহান্নামে যাও।",
        ""
      ],
      [
        "Relax for a while.",
        "একটু বিশ্রাম করো।",
        ""
      ],
      [
        "Look here.",
        "এদিকে দেখো।",
        ""
      ],
      [
        "Get down.",
        "নেমে যাও / নামো।",
        ""
      ],
      [
        "Not a bit!",
        "একটুও না!",
        ""
      ],
      [
        "Not the least.",
        "একটুও নয়।",
        ""
      ],
      [
        "Not at all.",
        "একদমই না / মোটেও না।",
        ""
      ],
      [
        "Let's take a break.",
        "চলো একটু বিরতি নিই।",
        ""
      ],
      [
        "Take it.",
        "এই নাও।",
        ""
      ],
      [
        "Wait here.",
        "এখানে অপেক্ষা করো।",
        ""
      ],
      [
        "Come back.",
        "ফিরে এসো।",
        ""
      ],
      [
        "Come soon.",
        "তাড়াতাড়ি এসো।",
        ""
      ],
      [
        "Come on!",
        "আরে, চেষ্টা করো!",
        ""
      ],
      [
        "Be ready.",
        "তৈরি হও।",
        ""
      ],
      [
        "Be calm.",
        "শান্ত হও।",
        ""
      ],
      [
        "Clean properly.",
        "ভালো করে পরিষ্কার করো।",
        ""
      ],
      [
        "Keep quiet.",
        "চুপ করো।",
        ""
      ],
      [
        "Stop here.",
        "এখানে থামো।",
        ""
      ],
      [
        "Try again.",
        "আরেকবার চেষ্টা করো।",
        ""
      ],
      [
        "Look ahead.",
        "সামনে তাকাও।",
        ""
      ],
      [
        "Mind your business.",
        "নিজের কাজে মন দাও।",
        ""
      ],
      [
        "Listen to me.",
        "আমার কথা শোনো।",
        ""
      ],
      [
        "Move aside.",
        "একপাশে সরে দাঁড়াও।",
        ""
      ],
      [
        "It's so embarrassing.",
        "এটা খুবই লজ্জার বিষয়।",
        ""
      ],
      [
        "Leave it.",
        "থাক, বাদ দাও।",
        ""
      ],
      [
        "Drive slowly.",
        "আস্তে গাড়ি চালাও।",
        ""
      ],
      [
        "Use your brain.",
        "বুদ্ধি খাটাও।",
        ""
      ],
      [
        "Keep it in your mind.",
        "মনে রেখো।",
        ""
      ],
      [
        "Have patience.",
        "একটু ধৈর্য ধরো।",
        ""
      ],
      [
        "Have a safe journey.",
        "নিরাপদে যেও / তোমার যাত্রা শুভ হোক।",
        ""
      ],
      [
        "Tell me about it.",
        "এটা সম্পর্কে আমাকে বলো।",
        ""
      ],
      [
        "Stand near.",
        "কাছে দাঁড়াও।",
        ""
      ],
      [
        "Stop worrying.",
        "চিন্তা করা বন্ধ করো।",
        ""
      ],
      [
        "That's not a bad idea.",
        "কথাটা মন্দ নয়।",
        ""
      ],
      [
        "Would you mind?",
        "আপনি কি কিছু মনে করবেন?",
        ""
      ],
      [
        "It's sad to hear.",
        "শুনে খারাপ লাগল।",
        ""
      ],
      [
        "It's a matter of joy.",
        "এটি আনন্দের বিষয়।",
        ""
      ],
      [
        "That's enough.",
        "যথেষ্ট হয়েছে।",
        ""
      ],
      [
        "Keep your promise.",
        "নিজের প্রতিশ্রুতি রাখো।",
        ""
      ],
      [
        "Get lost / Get out of my sight.",
        "আমার চোখের সামনে থেকে দূর হও।",
        ""
      ],
      [
        "Come and see me again.",
        "আবার আমার সঙ্গে দেখা করতে এসো।",
        ""
      ],
      [
        "Come afterwards.",
        "পরে এসো।",
        ""
      ],
      [
        "Come for a walk, please.",
        "চলো, একটু হাঁটতে যাই।",
        ""
      ],
      [
        "How did you think?",
        "তুমি কীভাবে এমনটা ভাবলে?",
        ""
      ],
      [
        "For this reason.",
        "এই কারণে।",
        ""
      ],
      [
        "Pray for me.",
        "আমার জন্য দোয়া করো।",
        ""
      ],
      [
        "I am very excited.",
        "আমি খুবই উত্তেজিত / আনন্দিত।",
        ""
      ],
      [
        "See you tomorrow.",
        "আগামীকাল দেখা হবে।",
        ""
      ]
    ]
  },
  {
    "level": 2,
    "items": [
      [
        "I'm sorry.",
        "আমি দুঃখিত।",
        ""
      ],
      [
        "Excuse me.",
        "মাফ করবেন।",
        ""
      ],
      [
        "Don't worry.",
        "দুশ্চিন্তা করো না।",
        ""
      ],
      [
        "Pardon me.",
        "মাফ করবেন।",
        ""
      ],
      [
        "Forget it.",
        "ওটা ভুলে যাও / বাদ দাও।",
        ""
      ],
      [
        "Thanks for your advice.",
        "আপনার পরামর্শের জন্য ধন্যবাদ।",
        ""
      ],
      [
        "I need more information.",
        "আমার আরও তথ্য প্রয়োজন।",
        ""
      ],
      [
        "Allow me to speak.",
        "আমাকে কথা বলার অনুমতি দিন।",
        ""
      ],
      [
        "I made a mistake. Please excuse me.",
        "ভুল হয়ে গেছে, দয়া করে মাফ করবেন।",
        ""
      ],
      [
        "Long time no see.",
        "অনেক দিন দেখা হয় না।",
        ""
      ],
      [
        "What's happening?",
        "কী হচ্ছে?",
        ""
      ],
      [
        "Have a nice day.",
        "আপনার দিনটি ভালো কাটুক।",
        ""
      ],
      [
        "What's wrong with you?",
        "তোমার কী সমস্যা?",
        ""
      ],
      [
        "Not good.",
        "ভালো নয়।",
        ""
      ],
      [
        "Not bad.",
        "খারাপ নয়।",
        ""
      ],
      [
        "Keep in touch.",
        "যোগাযোগ রেখো।",
        ""
      ],
      [
        "Look who it is!",
        "দেখো, কে এসেছে!",
        ""
      ],
      [
        "What a tragedy!",
        "কী মর্মান্তিক ঘটনা!",
        ""
      ],
      [
        "What a surprise!",
        "কী আশ্চর্য!",
        ""
      ],
      [
        "What a shame!",
        "কী লজ্জার কথা!",
        ""
      ],
      [
        "Hurry up!",
        "তাড়াতাড়ি করো!",
        ""
      ],
      [
        "I have lost my wallet.",
        "আমি আমার মানিব্যাগ হারিয়ে ফেলেছি।",
        ""
      ],
      [
        "For example.",
        "উদাহরণস্বরূপ।",
        ""
      ],
      [
        "In my opinion.",
        "আমার মতে।",
        ""
      ],
      [
        "By turns.",
        "পালা করে / পর্যায়ক্রমে।",
        ""
      ],
      [
        "Is she alive?",
        "সে কি বেঁচে আছে?",
        ""
      ],
      [
        "Keep it aside.",
        "এটা একপাশে রাখো।",
        ""
      ],
      [
        "Don't hide from me.",
        "আমার কাছ থেকে লুকিয়ো না।",
        ""
      ],
      [
        "Don't say anything.",
        "কিছু বলো না।",
        ""
      ],
      [
        "She made a mistake.",
        "সে একটি ভুল করেছিল।",
        ""
      ],
      [
        "Forgive him.",
        "তাকে ক্ষমা করে দাও।",
        ""
      ],
      [
        "Keep it there.",
        "এটা ওখানে রেখে দাও।",
        ""
      ],
      [
        "It was not good.",
        "এটা ভালো ছিল না।",
        ""
      ],
      [
        "She likes both.",
        "সে দুটোই পছন্দ করে।",
        ""
      ],
      [
        "I don't think so.",
        "আমি তা মনে করি না।",
        ""
      ],
      [
        "Take it out.",
        "এটা বাইরে বের করো।",
        ""
      ],
      [
        "Hold it carefully.",
        "এটা সাবধানে ধরো।",
        ""
      ],
      [
        "Save your time.",
        "তোমার সময় বাঁচাও।",
        ""
      ],
      [
        "Do your work by yourself.",
        "নিজের কাজ নিজে করো।",
        ""
      ],
      [
        "Give me a moment.",
        "আমাকে একটু সময় দাও।",
        ""
      ],
      [
        "You can go now.",
        "তুমি এখন যেতে পারো।",
        ""
      ],
      [
        "Look around you.",
        "তোমার চারপাশে তাকাও।",
        ""
      ],
      [
        "This is not fair.",
        "এটা ঠিক নয়।",
        ""
      ],
      [
        "Let him do this work.",
        "তাকে এই কাজটি করতে দাও।",
        ""
      ],
      [
        "I heard that she is sick.",
        "আমি শুনেছি যে সে অসুস্থ।",
        ""
      ],
      [
        "Give me something to eat.",
        "আমাকে কিছু খেতে দাও।",
        ""
      ],
      [
        "He knows my address.",
        "সে আমার ঠিকানা জানে।",
        ""
      ],
      [
        "You still have time.",
        "তোমার কাছে এখনো সময় আছে।",
        ""
      ],
      [
        "Don't eat street food.",
        "রাস্তার খাবার খেয়ো না।",
        ""
      ],
      [
        "It will be a matter of luck.",
        "এটা ভাগ্যের ব্যাপার হবে।",
        ""
      ],
      [
        "You have done a good job.",
        "তুমি ভালো কাজ করেছো।",
        ""
      ],
      [
        "Let me wake up early.",
        "আমাকে সকালে তাড়াতাড়ি উঠতে দাও।",
        ""
      ],
      [
        "Don't insist.",
        "জোরাজুরি করো না।",
        ""
      ],
      [
        "Move fast.",
        "দ্রুত সরে যাও।",
        ""
      ],
      [
        "I have good news.",
        "আমার কাছে ভালো খবর আছে।",
        ""
      ],
      [
        "Don't talk to him.",
        "তার সঙ্গে কথা বলো না।",
        ""
      ],
      [
        "Never tell a lie.",
        "কখনো মিথ্যা বলো না।",
        ""
      ],
      [
        "Do what he says.",
        "সে যা বলে, তা-ই করো।",
        ""
      ],
      [
        "Go and get it.",
        "যাও এবং ওটা নিয়ে এসো।",
        ""
      ],
      [
        "Stop him.",
        "তাকে থামাও।",
        ""
      ]
    ]
  },
  {
    "level": 3,
    "items": [
      [
        "It's good.",
        "এটা ভালো।",
        ""
      ],
      [
        "It's not like that.",
        "ব্যাপারটা তেমন নয়।",
        ""
      ],
      [
        "Look outside.",
        "বাইরে তাকাও।",
        ""
      ],
      [
        "No one has come yet.",
        "এখনো কেউ আসেনি।",
        ""
      ],
      [
        "I remember.",
        "আমার মনে আছে।",
        ""
      ],
      [
        "Stay inside.",
        "ভেতরে থাকো।",
        ""
      ],
      [
        "Come to the market with me.",
        "আমার সঙ্গে বাজারে চলো।",
        ""
      ],
      [
        "Don't doubt me.",
        "আমাকে সন্দেহ করো না।",
        ""
      ],
      [
        "Go home and take a rest.",
        "বাড়ি যাও এবং বিশ্রাম নাও।",
        ""
      ],
      [
        "Don't be angry with Mim.",
        "মীমের ওপর রাগ করো না।",
        ""
      ],
      [
        "I'm not sure.",
        "আমি নিশ্চিত নই।",
        ""
      ],
      [
        "Don't talk too much.",
        "বেশি কথা বলো না।",
        ""
      ],
      [
        "Keep doing it.",
        "এটা করতে থাকো।",
        ""
      ],
      [
        "I can't believe it.",
        "আমি এটা বিশ্বাস করতে পারছি না।",
        ""
      ],
      [
        "I knew it very well.",
        "আমি এটা খুব ভালো করেই জানতাম।",
        ""
      ],
      [
        "Is it your book?",
        "এটা কি তোমার বই?",
        ""
      ],
      [
        "No, it's not mine.",
        "না, এটা আমার নয়।",
        ""
      ],
      [
        "Write it properly.",
        "এটা ঠিকভাবে লেখো।",
        ""
      ],
      [
        "You can do it.",
        "তুমি এটা করতে পারবে।",
        ""
      ],
      [
        "I will meet you in a while.",
        "কিছুক্ষণ পরে তোমার সঙ্গে দেখা করব।",
        ""
      ],
      [
        "Come forward.",
        "সামনে এগিয়ে এসো।",
        ""
      ],
      [
        "Arrive on time.",
        "সময়মতো পৌঁছে যেয়ো।",
        ""
      ],
      [
        "Stand there.",
        "ওখানে দাঁড়াও।",
        ""
      ],
      [
        "Don't blame me.",
        "আমাকে দোষ দিও না।",
        ""
      ],
      [
        "I have nothing to say.",
        "আমার কিছু বলার নেই।",
        ""
      ],
      [
        "She is going to bed / sleep.",
        "সে ঘুমাতে যাচ্ছে।",
        ""
      ],
      [
        "There is still a lot of time.",
        "এখনো অনেক সময় আছে।",
        ""
      ],
      [
        "Nobody lives there.",
        "সেখানে কেউ থাকে না।",
        ""
      ],
      [
        "They are our neighbours.",
        "তারা আমাদের প্রতিবেশী।",
        ""
      ],
      [
        "It was usable.",
        "এটি ব্যবহারযোগ্য ছিল।",
        ""
      ],
      [
        "Be careful.",
        "সাবধান হও।",
        ""
      ],
      [
        "Turn around.",
        "ঘুরে দাঁড়াও।",
        ""
      ],
      [
        "You have to speak slowly.",
        "তোমাকে ধীরে কথা বলতে হবে।",
        ""
      ],
      [
        "You should hurry up.",
        "তোমার তাড়াতাড়ি করা উচিত।",
        ""
      ],
      [
        "Please speak up.",
        "দয়া করে একটু জোরে বলো।",
        ""
      ],
      [
        "You have to look down.",
        "তোমাকে নিচের দিকে তাকাতে হবে।",
        ""
      ],
      [
        "That's too bad.",
        "এটা খুবই খারাপ।",
        ""
      ],
      [
        "It is obvious.",
        "এটা স্পষ্ট।",
        ""
      ],
      [
        "I will go after a while.",
        "আমি কিছুক্ষণ পরে যাব।",
        ""
      ],
      [
        "Let's meet.",
        "চলো দেখা করি।",
        ""
      ],
      [
        "It may rain today.",
        "আজ বৃষ্টি হতে পারে।",
        ""
      ],
      [
        "I am surprised.",
        "আমি অবাক হয়েছি।",
        ""
      ],
      [
        "It is impossible for me.",
        "এটা আমার পক্ষে অসম্ভব।",
        ""
      ],
      [
        "Both are equal.",
        "দুটোই সমান।",
        ""
      ],
      [
        "Stay a little away.",
        "একটু দূরে থাকো।",
        ""
      ],
      [
        "The work is done.",
        "কাজটি শেষ হয়েছে।",
        ""
      ],
      [
        "He is a liar.",
        "সে একজন মিথ্যাবাদী।",
        ""
      ],
      [
        "Take it off.",
        "এটা খুলে ফেলো।",
        ""
      ],
      [
        "It's your turn now.",
        "এখন তোমার পালা।",
        ""
      ],
      [
        "Our time is up.",
        "আমাদের সময় শেষ।",
        ""
      ],
      [
        "He has to know.",
        "তাকে জানতে হবে।",
        ""
      ],
      [
        "Give him that.",
        "তাকে ওটা দাও।",
        ""
      ],
      [
        "Answer my question.",
        "আমার প্রশ্নের উত্তর দাও।",
        ""
      ],
      [
        "I have made a mistake.",
        "আমি একটি ভুল করেছি।",
        ""
      ],
      [
        "Tell him to call.",
        "তাকে ফোন করতে বলো।",
        ""
      ],
      [
        "What time is it?",
        "এখন কয়টা বাজে?",
        ""
      ],
      [
        "Bring any book.",
        "যেকোনো একটি বই নিয়ে এসো।",
        ""
      ],
      [
        "You have done well.",
        "তুমি ভালো করেছো।",
        ""
      ],
      [
        "You should watch out.",
        "তোমার সতর্ক থাকা উচিত।",
        ""
      ],
      [
        "Write in English.",
        "ইংরেজিতে লেখো।",
        ""
      ]
    ]
  }
];

const twisterGroups = [
  { title: "Tongue Twister — Set 1", items: [
    "How much wood would a woodchuck chuck if a woodchuck could chuck wood?",
    "Green grape fruit, ripe grape fruit.",
    "Polly put purple paint in the pool.",
    "Carlos kicks a curly corner kick.",
    "The teacher told me to teach a typical topic.",
    "She sells seashells by the seashore.",
    "Peter Piper picked a peck of pickled peppers.",
    "A big black bug bit a big black bear.",
    "Six slippery snails slid slowly seaward.",
    "Betty Botter bought some butter.",
    "Which witch wished which wicked wish?"
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


const idioms = [
  ["A piece of cake","খুব সহজ কাজ","The test was a piece of cake."],
  ["Break the ice","জড়তা কাটিয়ে কথা শুরু করা","A friendly question can break the ice."],
  ["Once in a blue moon","কদাচিৎ","We eat out once in a blue moon."],
  ["Under the weather","অসুস্থ বোধ করা","I'm feeling under the weather today."],
  ["Spill the beans","গোপন কথা ফাঁস করা","He spilled the beans about the surprise."],
  ["A blessing in disguise","প্রথমে খারাপ মনে হলেও পরে ভালো ফল","Missing the bus was a blessing in disguise."],
  ["Actions speak louder than words","কথার চেয়ে কাজের গুরুত্ব বেশি","Actions speak louder than words."],
  ["Add fuel to the fire","সমস্যা আরও বাড়িয়ে দেওয়া","His comment added fuel to the fire."],
  ["Back to square one","আবার শুরুতে ফিরে যাওয়া","The plan failed, so we are back to square one."],
  ["Bark up the wrong tree","ভুল ব্যক্তিকে দোষ দেওয়া বা ভুল পথে চেষ্টা করা","If you think I broke it, you're barking up the wrong tree."],
  ["Beat around the bush","মূল কথা এড়িয়ে যাওয়া","Please don't beat around the bush."],
  ["Better late than never","একেবারে না করার চেয়ে দেরিতে করা ভালো","You finally started studying—better late than never."],
  ["Bite off more than you can chew","সামর্থ্যের চেয়ে বেশি দায়িত্ব নেওয়া","I bit off more than I could chew."],
  ["Burn the midnight oil","রাত জেগে কাজ বা পড়াশোনা করা","She burned the midnight oil before the exam."],
  ["Call it a day","আজকের মতো কাজ শেষ করা","Let's call it a day."],
  ["Cost an arm and a leg","অত্যন্ত ব্যয়বহুল হওয়া","That phone costs an arm and a leg."],
  ["Cry over spilled milk","যা হয়ে গেছে তা নিয়ে আফসোস করা","There is no use crying over spilled milk."],
  ["Cut corners","কাজে শর্টকাট নিয়ে মান কমিয়ে ফেলা","Don't cut corners on your homework."],
  ["Get out of hand","নিয়ন্ত্রণের বাইরে চলে যাওয়া","The situation got out of hand."],
  ["Get something off your chest","মনের কথা বলে হালকা হওয়া","You can talk and get it off your chest."],
  ["Give someone a hand","কাউকে সাহায্য করা","Can you give me a hand?"],
  ["Hang in there","ধৈর্য ধরে লেগে থাকা","Hang in there; things will improve."],
  ["Hit the books","মন দিয়ে পড়াশোনা শুরু করা","I need to hit the books tonight."],
  ["In hot water","বিপদে বা ঝামেলায় থাকা","He is in hot water for being late."],
  ["It takes two to tango","কোনো বিষয়ে দুই পক্ষেরই ভূমিকা থাকে","Remember, it takes two to tango."],
  ["Keep an eye on","খেয়াল রাখা","Please keep an eye on my bag."],
  ["Kill two birds with one stone","এক কাজে দুইটি ফল পাওয়া","I can shop and visit my aunt, killing two birds with one stone."],
  ["Let the cat out of the bag","গোপন কথা প্রকাশ করে ফেলা","She let the cat out of the bag."],
  ["Miss the boat","সুযোগ হারানো","Apply now or you may miss the boat."],
  ["No pain, no gain","চেষ্টা ছাড়া সাফল্য আসে না","Keep practising—no pain, no gain."],
  ["On cloud nine","ভীষণ আনন্দিত","She was on cloud nine after the result."],
  ["Out of the blue","হঠাৎ করে","He called me out of the blue."],
  ["Pull someone's leg","মজা করে কাউকে বোকা বানানো","I'm just pulling your leg."],
  ["Put all your eggs in one basket","সব আশা এক জায়গায় নির্ভর করা","Don't put all your eggs in one basket."],
  ["See eye to eye","একমত হওয়া","We don't always see eye to eye."],
  ["Sit on the fence","সিদ্ধান্ত না নিয়ে দোটানায় থাকা","You cannot sit on the fence forever."],
  ["The ball is in your court","এখন সিদ্ধান্ত তোমার","I've done my part; the ball is in your court."],
  ["Through thick and thin","সুখে-দুঃখে","They supported each other through thick and thin."],
  ["Time flies","সময় দ্রুত চলে যায়","Time flies when you're having fun."],
  ["To make matters worse","পরিস্থিতি আরও খারাপ করতে","To make matters worse, it started raining."],
  ["Turn a blind eye","ইচ্ছা করে উপেক্ষা করা","We shouldn't turn a blind eye to mistakes."],
  ["Up in the air","এখনো অনিশ্চিত","Our holiday plans are still up in the air."],
  ["When pigs fly","কখনোই নয় / অসম্ভব কিছু বোঝাতে","He will clean his room when pigs fly."],
  ["Your guess is as good as mine","আমিও তোমার মতোই জানি না","Where is he? Your guess is as good as mine."],
  ["A dime a dozen","খুব সহজলভ্য বা অনেক পাওয়া যায়","Cheap souvenirs are a dime a dozen."],
  ["At the drop of a hat","এক মুহূর্ত দেরি না করে","She is ready to help at the drop of a hat."],
  ["By the book","নিয়ম মেনে","The teacher does everything by the book."],
  ["Every cloud has a silver lining","প্রতিটি খারাপ পরিস্থিতিতেও ভালো দিক থাকে","Every cloud has a silver lining."],
  ["Make ends meet","আয় দিয়ে খরচ চালানো","They work hard to make ends meet."],
  ["The last straw","সহ্যের শেষ সীমা","That delay was the last straw."]
];

const makeQ = (q, options, answer, why) => ({ q, options, answer, why });
function buildLevelQuizBanks() {
  const banks = [[], [], []];
  const add = (level, q) => banks[level-1].push(q);
  // Level 1: Be verbs (10)
  const beItems = [
    ["I","a student","am"],["She","happy","is"],["They","at school","are"],["He","a doctor","is"],["We","ready","are"],
    ["It","cold today","is"],["You","my friend","are"],["The books","on the desk","are"],["My mother","a teacher","is"],["I","at home yesterday","was"]
  ];
  beItems.forEach(([sub,comp,ans],i)=>add(1,makeQ(`Complete: ${sub} ___ ${comp}.`,["am","is","are","was"], ["am","is","are","was"].indexOf(ans),`এই Subject ও সময়ের সঙ্গে ${ans} সঠিক be verb।`)));
  // Have/has (10)
  const haveItems=[["I","have"],["She","has"],["They","have"],["He","has"],["We","have"],["Rina","has"],["You","have"],["The boys","have"],["My father","has"],["It","has"]];
  haveItems.forEach(([sub,ans])=>add(1,makeQ(`Choose the correct verb: ${sub} ___ a book.`,["have","has","having","had"],["have","has","having","had"].indexOf(ans),`${sub} এর সঙ্গে ${ans} ব্যবহার হয়।`)));
  // Present simple (10)
  const simpleItems=[["I","play","plays"],["She","reads","read"],["They","go","goes"],["He","watches","watch"],["We","study","studies"],["Rafi","works","work"],["You","like","likes"],["The cat","sleeps","sleep"],["Birds","fly","flies"],["My sister","cooks","cook"]];
  simpleItems.forEach(([sub,correct,wrong])=>add(1,makeQ(`Present Simple: ${sub} ___ every day.`,[correct,wrong,"am "+correct,"is "+correct],0,`Present Simple-এ ${sub} অনুযায়ী ${correct} সঠিক।`)));
  // Present continuous (5)
  [["I","am"],["She","is"],["They","are"],["We","are"],["The boy","is"]].forEach(([sub,ans])=>add(1,makeQ(`Present Continuous: ${sub} ___ reading now.`,["am","is","are","was"],["am","is","are","was"].indexOf(ans),`Present Continuous-এ ${sub} এর সঙ্গে ${ans} বসে।`)));
  // Present perfect (5)
  [["I","have"],["He","has"],["They","have"],["Mina","has"],["We","have"]].forEach(([sub,ans])=>add(1,makeQ(`Present Perfect: ${sub} ___ finished the work.`,["have","has","had","having"],["have","has","had","having"].indexOf(ans),`${sub} এর সঙ্গে ${ans} + V3 হয়।`)));
  // Past simple (5)
  [["Yesterday, I ___ to school.","went",["go","went","gone","going"]],["She ___ a letter.","wrote",["write","wrote","written","writes"]],["They ___ football.","played",["play","plays","played","playing"]],["He ___ dinner.","cooked",["cook","cooks","cooked","cooking"]],["We ___ Dhaka.","visited",["visit","visits","visited","visiting"]]].forEach(([q,a,o])=>add(1,makeQ(`Past Indefinite: ${q}`,o,o.indexOf(a),`Past Indefinite-এ এখানে V2 (${a}) দরকার।`)));
  // Past continuous (3)
  [["I","was"],["They","were"],["She","was"]].forEach(([sub,ans])=>add(1,makeQ(`Past Continuous: ${sub} ___ studying.`,["was","were","is","are"],["was","were","is","are"].indexOf(ans),`${sub} এর সঙ্গে ${ans} + verb-ing হয়।`)));
  // Future (2)
  [["I","will"],["They","will"]].forEach(([sub,ans])=>add(1,makeQ(`Future Indefinite: ${sub} ___ visit tomorrow.`,["will","would","am","has"],["will","would","am","has"].indexOf(ans),`Future Indefinite-এ Subject-এর পরে will + V1 হয়।`)));

  // Level 2: Modals (10), sentence patterns (10), there (10), conditionals (10), get (10)
  const modalItems=[["You ___ obey the rules.","must",["must","can","might","would"]],["She ___ swim very well.","can",["can","must","should","would"]],["You ___ see a doctor if you feel unwell.","should",["should","might","can","would"]],["It ___ rain later; I'm not sure.","might",["might","must","should","can"]],["___ you please help me?","Could",["Could","Must","Should","Might"]],["Students ___ be polite.","should",["should","would","might","could"]],["He ___ speak three languages.","can",["can","must","should","would"]],["You ___ not park here; it is prohibited.","must",["must","might","could","would"]],["I ___ visit my aunt tomorrow.","will",["will","must","should","might"]],["___ you mind opening the window?","Would",["Would","Should","Must","Can"]]];
  modalItems.forEach(([q,a,o])=>add(2,makeQ(q,o,o.indexOf(a),`${a} এখানে বাক্যের অর্থ ও গঠনের সঙ্গে মানানসই modal verb।`)));
  const patternItems=[["Which is the correct S + V + O sentence?","She reads books.",["She reads books.","Reads she books.","Books she reads.","She books reads."]],["Choose the correct S + be + complement pattern.","He is tired.",["He is tired.","He tired is.","Is tired he.","Tired he is a."]],["Which sentence has Subject + Verb + Object?","They play cricket.",["They play cricket.","Cricket they.","Play they cricket.","They cricket play."]],["Choose the correct sentence.","My brother is a student.",["My brother a student is.","My brother is a student.","Is my brother student a.","A student my brother."]],["Which is a correct negative sentence?","I do not like tea.",["I not like tea.","I do not like tea.","I does not like tea.","I am not like tea."]],["Choose the correct question pattern.","Do you speak English?",["You do speak English?","Do you speak English?","Speak do you English?","Does you speak English?"]],["Which sentence uses an adjective complement?","The sky is blue.",["The sky blue.","The sky is blue.","The sky does blue.","Blue the sky are."]],["Choose the correct word order.","She gave me a pen.",["She me gave a pen.","She gave me a pen.","Gave she a pen me.","A pen gave me she."]],["Which sentence is grammatically correct?","We are learning English.",["We learning are English.","We are learning English.","We is learning English.","We be learning English."]],["Choose the correct imperative sentence.","Please open the door.",["Please you open door.","Please open the door.","Opens please the door.","Please opening door."]]];
  patternItems.forEach(([q,a,o])=>add(2,makeQ(q,o,o.indexOf(a),`সঠিক English word order ও sentence pattern হলো “${a}”।`)));
  const thereItems=[["___ is a pen on the table.","There",["There","Their","They","It"]],["There ___ two apples in the basket.","are",["is","are","am","be"]],["There ___ a problem.","is",["is","are","were","have"]],["___ are many students here.","There",["There","Their","They","It"]],["There ___ some water in the glass.","is",["is","are","be","have"]],["___ there any questions?","Are",["Is","Are","Am","Do"]],["There ___ a shop here yesterday.","was",["is","are","was","were"]],["There ___ three chairs in the room.","are",["is","am","are","be"]],["There ___ not enough time.","is",["are","is","were","have"]],["___ there a library near here?","Is",["Do","Are","Is","Have"]]];
  thereItems.forEach(([q,a,o])=>add(2,makeQ(q,o,o.indexOf(a),`There-এর পরে noun singular/plural ও tense অনুযায়ী ${a} বসে।`)));
  const condItems=[["If it rains, we ___ at home.","will stay",["will stay","would stayed","stay will","would staying"]],["If I were rich, I ___ the world.","would travel",["will travel","would travel","travelled","am travelling"]],["If you study, you ___ pass.","will",["would","will","are","have"]],["If she had more time, she ___ more.","would read",["will read","would read","reads","is read"]],["If I were you, I ___ apologise.","would",["will","would","am","have"]],["If they invite me, I ___ go.","will",["would","will","did","was"]],["If he knew the answer, he ___ tell us.","would",["will","would","does","has"]],["If the weather is fine, we ___ outside.","will play",["would played","will play","played will","are play"]],["Imagine you ___ the principal. What would you change?","were",["are","was","were","be"]],["If I had a bicycle, I ___ to school.","would ride",["will ride","would ride","rode","am ride"]]];
  condItems.forEach(([q,a,o])=>add(2,makeQ(q,o,o.indexOf(a),`Conditional-এর If-clause ও result clause-এর গঠন মিলিয়ে ${a} সঠিক।`)));
  const getItems=[["I ___ up at 6 a.m. every day.","get",["get","gets","gotten","getting"]],["She ___ angry easily.","gets",["get","gets","getting","gotten"]],["Please ___ ready quickly.","get",["get","gets","got","getting"]],["We ___ to the station at noon yesterday.","got",["get","gets","got","getting"]],["How did you ___ this answer?","get",["got","gets","get","getting"]],["It is ___ dark.","getting",["get","gets","got","getting"]],["I ___ a message from him yesterday.","got",["get","gets","got","getting"]],["They ___ along well.","get",["gets","get","gotten","getting"]],["He ___ dressed before breakfast.","gets",["get","gets","got","getting"]],["We need to ___ started.","get",["gets","got","get","getting"]]];
  getItems.forEach(([q,a,o])=>add(2,makeQ(q,o,o.indexOf(a),`এই বাক্যে get-এর সঠিক form হলো ${a}।`)));

  // Level 3: Prepositions (20), articles (15), passive voice (15)
  const prepItems=[["I live ___ Dhaka.","in",["in","on","at","by"]],["The book is ___ the table.","on",["in","on","at","under"]],["We meet ___ 7 o'clock.","at",["in","on","at","by"]],["My birthday is ___ June.","in",["at","on","in","by"]],["The class is ___ Monday.","on",["in","at","on","for"]],["She is sitting ___ her two friends.","between",["among","between","through","over"]],["The teacher stood ___ the students.","among",["between","among","above","into"]],["The cat is ___ the chair.","under",["over","under","between","across"]],["He walked ___ the bridge.","across",["along","across","between","inside"]],["We walked ___ the river.","along",["across","along","into","off"]],["She came ___ the room.","into",["out of","into","under","beside"]],["He came ___ the house.","out of",["into","out of","onto","above"]],["The bank is ___ the school.","opposite",["opposite","inside","during","among"]],["I have lived here ___ 2020.","since",["for","since","during","by"]],["I studied ___ two hours.","for",["since","at","for","on"]],["Please finish it ___ Friday.","by",["since","by","during","from"]],["She was born ___ 2010.","in",["at","on","in","by"]],["The picture is ___ the wall.","on",["in","at","on","into"]],["He is standing ___ me.","beside",["beside","between","through","over"]],["We stayed inside ___ the storm.","during",["since","for","during","until"]]];
  prepItems.forEach(([q,a,o])=>add(3,makeQ(q,o,o.indexOf(a),`এই context-এ ${a} সঠিক preposition।`)));
  const articleItems=[["She is ___ honest person.","an",["a","an","the","no article"]],["He bought ___ umbrella.","an",["a","an","the","no article"]],["I saw ___ cat in the garden.","a",["a","an","the","no article"]],["___ sun rises in the east.","The",["A","An","The","No article"]],["She is ___ best player in the team.","the",["a","an","the","no article"]],["He studies at ___ university.","a",["a","an","the","no article"]],["I need ___ hour to finish.","an",["a","an","the","no article"]],["___ water is essential for life.","No article",["A","An","The","No article"]],["This is ___ European country.","a",["a","an","the","no article"]],["She plays ___ piano.","the",["a","an","the","no article"]],["I have ___ idea.","an",["a","an","the","no article"]],["He is ___ one-eyed man.","a",["a","an","the","no article"]],["___ Ganges is a famous river.","The",["A","An","The","No article"]],["We had ___ lunch at noon.","No article",["A","An","The","No article"]],["She adopted ___ little puppy.","a",["a","an","the","no article"]]];
  articleItems.forEach(([q,a,o])=>add(3,makeQ(`Choose the correct article: ${q}`,o,o.indexOf(a),`${a} এখানে sound ও article-এর নিয়ম অনুযায়ী সঠিক।`)));
  const passiveItems=[["Active: They make cars. Passive: Cars ___ made.","are",["is","are","was","be"]],["Active: She wrote a letter. Passive: A letter ___ written.","was",["is","are","was","were"]],["Active: He is cleaning the room. Passive: The room is ___ cleaned.","being",["been","being","be","was"]],["Active: They will build a bridge. Passive: A bridge will ___ built.","be",["is","be","been","being"]],["Active: Someone has stolen my bag. Passive: My bag has been ___.","stolen",["steal","stole","stolen","stealing"]],["Active: People speak English here. Passive: English ___ spoken here.","is",["are","is","was","be"]],["Active: The chef cooked the meal. Passive: The meal ___ cooked by the chef.","was",["is","are","was","were"]],["Active: They are painting the wall. Passive: The wall is being ___.","painted",["paint","painting","painted","paints"]],["Active: You must follow the rules. Passive: The rules must ___ followed.","be",["is","be","been","being"]],["Active: She can solve it. Passive: It can ___ solved.","be",["is","been","being","be"]],["Active: He will invite us. Passive: We will ___ invited.","be",["are","be","been","being"]],["Active: They have finished the work. Passive: The work has been ___.","finished",["finish","finishes","finished","finishing"]],["Active: The police caught the thief. Passive: The thief ___ caught.","was",["is","are","was","were"]],["Active: Someone is repairing the road. Passive: The road is being ___.","repaired",["repair","repairs","repaired","repairing"]],["Active: They sell fresh fruit here. Passive: Fresh fruit ___ sold here.","is",["are","is","was","be"]]];
  passiveItems.forEach(([q,a,o])=>add(3,makeQ(q,o,o.indexOf(a),`Passive Voice-এর tense অনুযায়ী ${a} সঠিক auxiliary/verb form।`)));
  return banks.map((bank)=>bank.slice(0,50));
}
const levelQuizBanks = buildLevelQuizBanks();

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
  const total = levels.reduce((n, l) => n + l.topics.length, 0) + words.length + commonExpressions.reduce((n,g)=>n+g.items.length,0) + twisterGroups.reduce((n,g) => n + g.items.length,0) + idioms.length + levelQuizBanks.reduce((n,b)=>n+b.length,0);
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
    host.innerHTML = `<div class="level-grid">${levels.map((level,i) => `<button class="level-tile" data-level-index="${i}" data-level="LEVEL 0${i+1}"><span>${level.title}</span><small>${i===3?'Explore coming soon':'Open learning path ↗'}</small></button>`).join("")}</div>`;
  } else if (tab === "vocabulary") {
    host.innerHTML = `<div class="vocab-intro"><span>WORD LIBRARY</span><h3>Build your vocabulary</h3><p>শব্দ লিখে Vocabulary খুঁজে নাও। Level অনুযায়ী শব্দও দেখা যাবে।</p></div><input class="word-search" id="vocabGlobalSearch" placeholder="Search vocabulary..." aria-label="Search vocabulary"><div id="vocabSearchResults" class="hub-grid"><p class="empty-note">শব্দ খুঁজতে English word বা বাংলা অর্থ লিখো।</p></div><div class="hub-grid vocab-levels">${[1,2,3,4].map(n => `<article class="hub-card vocab-level-card"><div class="eyebrow">VOCABULARY · 0${n}</div><h3>Level ${n}</h3><p>${n===1?`${words.length} saved words · meanings · V1–V5 · examples`:'More words will be added later'}</p><button class="hub-action ${n===1?'primary':''}" data-vocab="${n}">${n===1?'Explore words':'Coming Soon'}</button></article>`).join("")}</div><div id="vocabDetail"></div>`;
    $("vocabGlobalSearch").addEventListener("input", e => renderVocabularySearch(e.target.value));
  } else if (tab === "twisters") {
    host.innerHTML = twisterGroups.map((g,gi) => `<div class="twister-group"><h3>${g.title}</h3><div class="hub-grid">${g.items.map((t,i) => `<div class="twister-card"><p>${escapeHtml(t)}</p><div><button class="hub-action" data-speak="${encodeURIComponent(t)}" aria-label="Listen">🔊 Audio</button><button class="hub-action" data-twister-done="${gi}-${i}">Done</button></div></div>`).join("")}</div></div>`).join("");
  } else if (tab === "expressions") {
    host.innerHTML = `<div class="expression-intro"><span>EVERYDAY ENGLISH</span><h3>Common Expressions</h3><p>Expression লিখে খুঁজে নাও, অথবা Level অনুযায়ী দেখো।</p></div><input class="word-search" id="expressionGlobalSearch" placeholder="Search common expressions..." aria-label="Search common expressions"><div id="expressionSearchResults" class="expression-list"><p class="empty-note">Expression খুঁজতে English phrase বা বাংলা অর্থ লিখো।</p></div><div class="hub-grid expression-levels">${commonExpressions.map(g => `<article class="hub-card expression-level-card"><div class="eyebrow">CONVERSATION COLLECTION</div><h3>Level ${g.level}</h3><p>${g.level===1?'Everyday basics':g.level===2?'Natural conversation':'Fluent expression'} · ${g.items.length} expressions</p><button class="hub-action primary" data-expression-level="${g.level}">Open Level ↗</button></article>`).join("")}</div><div id="expressionDetail"></div>`;
    $("expressionGlobalSearch").addEventListener("input", e => renderExpressionSearch(e.target.value));
  } else if (tab === "idioms") {
    host.innerHTML = `<div class="expression-intro"><span>IDIOM COLLECTION</span><h3>50 Useful English Idioms</h3><p>প্রতিটি Idiom-এর বাংলা অর্থ ও Example sentence।</p></div><input class="word-search" id="idiomSearch" placeholder="Search idioms..." aria-label="Search idioms"><div class="expression-list" id="idiomList">${renderIdioms(idioms)}</div>`;
    $("idiomSearch").addEventListener("input", e => { const q=e.target.value.toLowerCase(); $("idiomList").innerHTML=renderIdioms(idioms.filter(x=>x.join(" ").toLowerCase().includes(q))); });
  } else if (tab === "quiz") {
    host.innerHTML = `<div class="hub-card"><div class="eyebrow">TEST YOURSELF</div><h3>Level-wise Practice Quiz</h3><p>প্রতিটি Level-এ ৫০টি করে প্রশ্ন। উত্তর নির্বাচন করলেই সঙ্গে সঙ্গে ফল দেখাবে।</p><div class="hub-grid">${levels.slice(0,3).map((l,i)=>`<button class="quiz-level-card" data-quiz-level="${i+1}"><strong>${l.title}</strong><span>50 Questions · Start Quiz ↗</span></button>`).join("")}</div></div>`;
  }
}
function renderIdioms(items) {
  if (!items.length) return '<p class="empty-note">কোনো Idiom পাওয়া যায়নি।</p>';
  return items.map((x,i)=>`<article class="expression-row"><div class="expression-index">${String(idioms.indexOf(x)+1).padStart(2,'0')}</div><div class="expression-body"><h4>${escapeHtml(x[0])}</h4><p>${escapeHtml(x[1])}</p><small>Example: ${escapeHtml(x[2])}</small></div><button class="hub-action" data-speak="${encodeURIComponent(x[0])}">🔊</button></article>`).join("");
}
function renderVocabularySearch(query) {
  const host=$("vocabSearchResults"); if(!host) return; const q=query.trim().toLowerCase();
  if(!q){host.innerHTML='<p class="empty-note">শব্দ খুঁজতে English word বা বাংলা অর্থ লিখো।</p>';return;}
  const found=words.map((w,i)=>({...w,index:i})).filter(w=>[w.word,w.meaning,w.example,w.bn].join(" ").toLowerCase().includes(q));
  host.innerHTML=found.length?found.map(w=>`<article class="word-card"><div class="word-number">WORD ${String(w.index+1).padStart(2,'0')}</div><h3>${escapeHtml(w.word)}</h3><p class="word-meaning">অর্থ: ${escapeHtml(w.meaning)}</p><p class="word-example"><strong>${escapeHtml(w.example)}</strong><br><span>${escapeHtml(w.bn)}</span></p></article>`).join(""):'<p class="empty-note">কোনো Vocabulary পাওয়া যায়নি।</p>';
}
function renderExpressionSearch(query) {
  const host=$("expressionSearchResults"); if(!host) return; const q=query.trim().toLowerCase();
  if(!q){host.innerHTML='<p class="empty-note">Expression খুঁজতে English phrase বা বাংলা অর্থ লিখো।</p>';return;}
  const found=commonExpressions.flatMap(g=>g.items.map((x,i)=>({item:x,level:g.level,index:i}))).filter(x=>x.item.join(" ").toLowerCase().includes(q));
  host.innerHTML=found.length?found.map(x=>`<article class="expression-row"><div class="expression-index">L${x.level}</div><div class="expression-body"><h4>${escapeHtml(x.item[0])}</h4><p>${escapeHtml(x.item[1])}</p>${x.item[2] ? `<small>Example: ${escapeHtml(x.item[2])}</small>` : ""}</div><button class="hub-action" data-speak="${encodeURIComponent(x.item[0])}">🔊</button></article>`).join(""):'<p class="empty-note">কোনো Expression পাওয়া যায়নি।</p>';
}
function openLevel(index) {
  currentLevelIndex=index;
  const level=levels[index]; const host=$("hubContent");
  if(!level) return;
  if(index===3){host.innerHTML=`<div class="hub-detail page-panel"><div class="page-top-actions"><button class="back-level" data-home-levels>⌂ Home</button><button class="back-level" data-back-level>← Back</button></div><div class="coming-soon-mark">04</div><h3>Level 4</h3><p>এই Level-এর lessons শিগগিরই আসছে।</p></div>`;return;}
  const topics=level.topics.map((topic,i)=>`<article class="lesson-card"><div><strong>${escapeHtml(topic)}</strong><small>${index===0 && i<2 ? "Detailed lesson" : topic==="Tense"?"6 separate tense lessons":"Lesson & examples"}</small></div><button class="hub-action" data-open-topic="${encodeURIComponent(topic)}">Open ↗</button></article>`).join("");
  host.innerHTML=`<div class="hub-detail level-page"><div class="page-top-actions"><button class="back-level" data-home-levels>⌂ Home</button><button class="back-level" data-back-level>← Back</button></div><div class="level-page-kicker">LEARNING PATH · 0${index+1}</div><h3>${level.title}</h3><p class="muted">একটি Topic বেছে নিয়ে নতুন Lesson Page-এ পড়া শুরু করো।</p><div class="lesson-list ${index===1?"level-two-grid":""}">${topics}</div><div class="level-extra-actions"><button class="hub-action" data-six-practice="${index}">6 Sentences · Practice</button><button class="hub-action" data-six-quiz="${index}">6 Sentences · Quiz</button></div><button class="level-quiz-launch" data-quiz-level="${index+1}"><span>LEVEL 0${index+1} QUIZ</span><strong>50 Questions</strong><small>Start your level test ↗</small></button></div>`;
}
function openTopicPage(topic) {
  const host=$("hubContent");
  if(topic==="Tense"){
    const tenseNames=["Present Indefinite","Present Continuous","Present Perfect","Past Indefinite","Past Continuous","Future Indefinite"];
    host.innerHTML=`<div class="hub-detail page-panel"><div class="page-top-actions"><button class="back-level" data-home-levels>⌂ Home</button><button class="back-level" data-back-to-level>← Back</button></div><div class="level-page-kicker">LEVEL 01 · GRAMMAR</div><h3>Tense</h3><p class="muted">৬টি Tense-এর যেকোনো একটি বেছে নাও।</p><div class="hub-grid modal-grid">${tenseNames.map(t=>`<article class="lesson-card"><div><strong>${t}</strong><small>Structure, usage & examples</small></div><button class="hub-action" data-open-topic="${encodeURIComponent(t)}">Open ↗</button></article>`).join("")}</div></div>`;
    return;
  }
  if(topic==="Use of Modals"){
    host.innerHTML=`<div class="hub-detail page-panel"><div class="page-top-actions"><button class="back-level" data-home-levels>⌂ Home</button><button class="back-level" data-back-to-level>← Back</button></div><div class="level-page-kicker">LEVEL 02 · MODAL VERBS</div><h3>Use of Modals</h3><p class="muted">প্রতিটি Modal আলাদা Lesson Page-এ পড়ো।</p><div class="hub-grid modal-grid">${Object.keys(modalLessons).map(m=>`<article class="lesson-card"><div><strong>${m}</strong><small>Usage · Structure · Examples</small></div><button class="hub-action" data-open-modal="${encodeURIComponent(m)}">Open ↗</button></article>`).join("")}</div></div>`;
    return;
  }
  renderTopic(topic);
}
function renderModalLesson(name) {
  const lesson=modalLessons[name]; if(!lesson) return;
  const host=$("hubContent");
  host.innerHTML=`<div class="hub-detail page-panel"><div class="page-top-actions"><button class="back-level" data-home-levels>⌂ Home</button><button class="back-level" data-back-modals>← All Modals</button></div><div class="level-page-kicker">LEVEL 02 · MODAL LESSON</div><h3>${escapeHtml(name)}</h3><section class="lesson-section"><h4>ব্যবহার (Usage)</h4><p>${escapeHtml(lesson.meaning)}</p><div class="structure-box"><strong>Structure:</strong> ${escapeHtml(lesson.structure)}</div><h4>Examples</h4><ul>${lesson.examples.map(x=>`<li>${escapeHtml(x)}</li>`).join("")}</ul><h4>Negative, Question ও WH Pattern</h4><div class="structure-box"><strong>Negative:</strong> Subject + modal + not + V1<br><strong>Question:</strong> Modal + subject + V1?<br><strong>WH:</strong> WH-word + modal + subject + V1?</div><ul><li>I cannot swim. — আমি সাঁতার কাটতে পারি না।</li><li>Can you swim? — তুমি কি সাঁতার কাটতে পারো?</li><li>Why can you swim? — তুমি কেন সাঁতার কাটতে পারো?</li><li>মনে রাখবে: Modal-এর পরে V1 বসে; he/she/it হলেও s/es হয় না।</li></ul></section><button class="hub-action primary" data-topic-done="${encodeURIComponent('Modal '+name)}">Mark as learned ✓</button></div>`;
}
function renderTopic(topic) {
  const host = $("hubContent");
  const sections = lessonNotes[topic] || [];
  const identification = ({"Present Indefinite":"Positive: করি/খাই/যাই। Negative: করি না/খাই না/যাই না।","Present Continuous":"Positive: করছি/খাচ্ছি/যাচ্ছি। Negative: করছি না/খাচ্ছি না/যাচ্ছি না।","Present Perfect":"Positive: করেছি/খেয়েছি/গিয়েছি। Negative: করিনি/খাইনি/যাইনি।","Past Indefinite":"Positive: করলাম/করেছিলাম/খেলাম/গেলাম। Negative: করিনি/খাইনি/যাইনি (প্রসঙ্গ দেখে Past বোঝা যায়)।","Past Continuous":"Positive: করছিলাম/খাচ্ছিলাম/যাচ্ছিলাম। Negative: করছিলাম না/খাচ্ছিলাম না/যাচ্ছিলাম না।","Future Indefinite":"Positive: করব/খাব/যাব। Negative: করব না/খাব না/যাব না."})[topic];
  const content=sections.length?sections.map(section => `<section class="lesson-section"><h4>${escapeHtml(section.heading)}</h4><div class="structure-box"><strong>Structure:</strong> ${escapeHtml(section.structure)}</div><ul>${section.examples.map(ex => `<li>${escapeHtml(ex)}</li>`).join("")}</ul></section>`).join("")+(identification?`<section class="lesson-section identification-box"><h4>বাংলা বাক্য দেখে Tense চেনার নিয়ম</h4><p>${escapeHtml(identification)}</p><p>এগুলো সাধারণ সংকেত। বাক্যের অর্থ ও সময়ের প্রসঙ্গও মিলিয়ে দেখবে।</p></section>`:""):'<p>এই Lesson-এর বিস্তারিত অংশ পরে যোগ করা হবে।</p>';
  host.innerHTML = `<div class="hub-detail page-panel"><div class="page-top-actions"><button class="back-level" data-home-levels>⌂ Home</button><button class="back-level" data-back-topic>← Back</button></div><div class="level-page-kicker">LEVEL 0${currentLevelIndex+1} · LESSON</div><h3>${escapeHtml(topic)}</h3>${content}<button class="hub-action primary" data-topic-done="${encodeURIComponent(topic)}">Mark as learned ✓</button></div>`;
}
function renderSixSentences(levelIndex) {
  const host = $("hubContent"); const items = sixSentenceSets[levelIndex] || [];
  if (!items.length) { host.innerHTML = `<div class="hub-detail page-panel"><button class="back-level" data-back-level>← Back</button><h3>6 Sentences Practice</h3><p>এই Level-এর practice sentences শিগগিরই যোগ হবে।</p></div>`; return; }
  const names = ["Affirmative", "Negative", "Interrogative", "Negative Interrogative", "Why Affirmative", "Why Negative"];
  host.innerHTML = `<div class="hub-detail page-panel"><div class="page-top-actions"><button class="back-level" data-home-levels>⌂ Home</button><button class="back-level" data-back-to-level>← Back</button></div><h3>6 Sentences · Practice</h3>${items.map((item,i) => `<section class="six-sentence-item"><h4>${i+1}. ${escapeHtml(item.bn)}</h4><div class="six-form-grid">${item.forms.map((form,j) => `<div class="six-form"><strong>${names[j]}</strong><span>${escapeHtml(form)}</span><small>${escapeHtml(item.bnForms?.[j] || "")}</small></div>`).join("")}</div></section>`).join("")}<button class="hub-action primary" data-six-done="${levelIndex}">Practice completed ✓</button></div>`;
}
function normalizeAnswer(v){return String(v||"").toLowerCase().replace(/[.!?,'’]/g,"").replace(/\s+/g," ").trim();}
function renderSixSentenceQuiz(levelIndex) {
  const host=$("hubContent"); const items=sixSentenceSets[levelIndex]||[];
  if(!items.length){host.innerHTML='<div class="hub-detail page-panel"><button class="back-level" data-back-to-level>← Back</button><p>এই Level-এর Quiz শিগগিরই যোগ হবে।</p></div>';return;}
  const names=["Affirmative","Negative","Interrogative","Negative Interrogative","Why Affirmative","Why Negative"];
  host.innerHTML=`<div class="hub-detail page-panel"><div class="page-top-actions"><button class="back-level" data-home-levels>⌂ Home</button><button class="back-level" data-back-to-level>← Back</button></div><div class="level-page-kicker">WRITE ALL SIX FORMS</div><h3>6 Sentences · Quiz</h3><p class="muted">প্রতিটি বাংলা বাক্যের জন্য নিজে ৬টি English Form লেখো।</p><form id="sixFormQuiz">${items.map((item,si)=>`<section class="six-sentence-item"><div class="quiz-source-bn">${si+1}. ${escapeHtml(item.bn)}</div>${names.map((n,i)=>`<label class="six-answer-field"><strong>${n}</strong><input name="s${si}f${i}" autocomplete="off" placeholder="Write ${n} sentence..."></label>`).join("")}</section>`).join("")}<button class="hub-action primary" type="submit">Check My Answers</button></form><div id="sixQuizResult" aria-live="polite"></div></div>`;
  $("sixFormQuiz").addEventListener("submit",e=>{
    e.preventDefault();let score=0,total=items.length*6;const result=[];
    items.forEach((item,si)=>item.forms.forEach((answer,i)=>{const field=e.currentTarget.elements[`s${si}f${i}`];const ok=normalizeAnswer(field.value)===normalizeAnswer(answer);if(ok)score++;field.classList.toggle("answer-correct",ok);field.classList.toggle("answer-wrong",!ok);result.push(`<p class="${ok?'correct-line':'wrong-line'}">${ok?'✓':'✕'} ${escapeHtml(item.bn)} — ${names[i]}: ${escapeHtml(answer)}</p>`);}));
    $("sixQuizResult").innerHTML=`<h4>Score: ${score}/${total}</h4>${result.join("")}`;if(score===total)markDone(`six-quiz-${levelIndex}`);
  });
}
function renderLevelQuiz(levelNumber) {
  currentLevelIndex=levelNumber-1;
  const host=$("hubContent"); const questions=levelQuizBanks[levelNumber-1]||[];
  const attempts=questions.map(()=>({tries:0,status:"unanswered",picked:null}));
  host.innerHTML=`<div class="hub-detail page-panel"><div class="page-top-actions"><button class="back-level" data-home-levels>⌂ Home</button><button class="back-level" data-back-to-level>← Back</button></div><div class="level-page-kicker">LEVEL 0${levelNumber} · PRACTICE TEST</div><h3>Level ${levelNumber} Quiz</h3><p class="muted">${questions.length}টি প্রশ্ন · ভুল হলে আবার উত্তর পরিবর্তন করতে পারবে। সবশেষে Submit Quiz চাপো।</p><div class="quiz-live-progress"><span id="levelQuizCount">0/${questions.length} answered</span><strong id="levelQuizScore">Correct: 0</strong></div><div id="levelQuizQuestions">${questions.map((q,i)=>`<article class="quiz-question" data-q-index="${i}"><p>${i+1}. ${escapeHtml(q.q)}</p><div class="quiz-options">${q.options.map((o,j)=>`<label><input type="radio" name="level${levelNumber}q${i}" value="${j}"><span>${escapeHtml(o)}</span></label>`).join("")}</div><div class="instant-feedback" id="feedback-${i}" aria-live="polite"></div></article>`).join("")}</div><button id="submitLevelQuiz" class="hub-action primary submit-quiz">Submit Quiz</button><div id="levelQuizComplete" class="quiz-complete" aria-live="polite"></div></div>`;
  host.querySelectorAll('.quiz-question input[type="radio"]').forEach(input=>input.addEventListener('change',()=>{
    const card=input.closest('.quiz-question'),qIndex=Number(card.dataset.qIndex),q=questions[qIndex],picked=Number(input.value),state=attempts[qIndex];
    state.tries++; state.picked=picked;
    const ok=picked===q.answer;
    state.status=ok?(state.tries===1?'first-correct':'retried-correct'):'wrong';
    card.classList.remove('question-correct','question-wrong','question-retried');
    if(state.status==='first-correct') card.classList.add('question-correct');
    else if(state.status==='retried-correct') card.classList.add('question-retried');
    else card.classList.add('question-wrong');
    const feedback=card.querySelector('.instant-feedback');
    feedback.innerHTML=ok?`<strong class="${state.tries===1?'feedback-good':'feedback-retry'}">${state.tries===1?'✓ Correct on first try':'✓ Correct after retry'}</strong><span>${escapeHtml(q.why)}</span>`:`<strong class="feedback-bad">✕ Incorrect — try again</strong><span>আবার উত্তর পরিবর্তন করতে পারো।</span>`;
    const answered=attempts.filter(a=>a.status!=='unanswered').length;
    const correct=attempts.filter(a=>a.status==='first-correct'||a.status==='retried-correct').length;
    $("levelQuizCount").textContent=`${answered}/${questions.length} answered`;
    $("levelQuizScore").textContent=`Correct: ${correct}`;
  }));
  $("submitLevelQuiz").addEventListener('click',()=>{
    const first=attempts.filter(a=>a.status==='first-correct').length;
    const retried=attempts.filter(a=>a.status==='retried-correct').length;
    const wrong=attempts.filter(a=>a.status==='wrong'||a.status==='unanswered').length;
    const score=first+retried;
    $("levelQuizComplete").innerHTML=`<div class="quiz-score-summary"><div class="quiz-score-circle"><strong>${score}</strong><span>/${questions.length}</span></div><div><h3>Quiz Result</h3><p>মোট নম্বর: <strong>${score}/${questions.length}</strong></p><p><span class="result-dot green"></span> প্রথমবার সঠিক: ${first}</p><p><span class="result-dot yellow"></span> আবার চেষ্টা করে সঠিক: ${retried}</p><p><span class="result-dot red"></span> এখনো ভুল/উত্তর দেওয়া হয়নি: ${wrong}</p></div></div><button class="hub-action" data-quiz-retry="${levelNumber}">Try Again</button>`;
    $("submitLevelQuiz").disabled=true;
    host.querySelectorAll('.quiz-question input').forEach(el=>el.disabled=true);
    markDone(`level-quiz-${levelNumber}`);
  });
}
function openVocabulary(level) {
  const detail = $("vocabDetail");
  if (level !== 1) return toast("এই Vocabulary Level-এর content পরে যোগ হবে।");
  detail.innerHTML = `<div class="hub-detail vocab-detail"><div class="detail-top"><div><div class="eyebrow">LEVEL 01 · WORD BANK</div><h3>Vocabulary Level 1</h3><p class="muted">${words.length}টি আগের অনুশীলনের শব্দ</p></div><div class="page-top-actions"><button class="back-level" data-home-vocab>⌂ Home</button><button class="back-level" data-vocab-back>← Back</button></div></div><input class="word-search" id="wordSearch" placeholder="Search vocabulary..." aria-label="Search vocabulary"><div class="hub-grid" id="wordGrid">${words.map((w,i) => `<article class="word-card"><div class="word-number">WORD ${String(i+1).padStart(2,'0')}</div><h3>${escapeHtml(w.word)}</h3><p class="word-meaning">অর্থ: ${escapeHtml(w.meaning)}</p><div class="verb-forms"><span><b>V1</b>${escapeHtml(w.v1)}</span><span><b>V2</b>${escapeHtml(w.v2)}</span><span><b>V3</b>${escapeHtml(w.v3)}</span><span><b>V4</b>${escapeHtml(w.v4)}</span><span><b>V5</b>${escapeHtml(w.v5)}</span></div><p class="word-example"><strong>${escapeHtml(w.example)}</strong><br><span>${escapeHtml(w.bn)}</span></p><button class="hub-action" data-word-done="${i}">Mark learned ✓</button></article>`).join("")}</div><p class="muted">তোমার বইয়ের Level 1-এর ২০০টি শব্দের ছবি দিলে এই তালিকাটি বইয়ের সঠিক ক্রমে সাজিয়ে দেওয়া হবে।</p></div>`;
  $("wordSearch").addEventListener("input", e => { const q=e.target.value.toLowerCase(); document.querySelectorAll("#wordGrid .word-card").forEach(card => card.classList.toggle("hidden", !card.textContent.toLowerCase().includes(q))); });
}
function openExpressions(level) {
  const group = commonExpressions.find(g => g.level === level); const host = $("expressionDetail"); if (!group || !host) return;
  host.innerHTML = `<div class="hub-detail expression-detail"><div class="detail-top"><div><div class="eyebrow">COMMON EXPRESSIONS · LEVEL 0${level}</div><h3>${level===1?'Everyday Basics':level===2?'Natural Conversation':'Fluent Expressions'}</h3><p class="muted">${group.items.length}টি expression</p></div><div class="page-top-actions"><button class="back-level" data-home-expressions>⌂ Home</button><button class="back-level" data-expression-back>← Back</button></div></div><div class="expression-list">${group.items.map((item,i)=>`<article class="expression-row"><div class="expression-index">${String(i+1).padStart(2,'0')}</div><div class="expression-body"><h4>${escapeHtml(item[0])}</h4><p>${escapeHtml(item[1])}</p>${item[2] ? `<small>Example: ${escapeHtml(item[2])}</small>` : ""}</div><button class="hub-action" data-speak="${encodeURIComponent(item[0])}">🔊</button></article>`).join("")}</div></div>`;
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
  if (b.dataset.levelIndex !== undefined) openLevel(Number(b.dataset.levelIndex));
  if (b.dataset.homeLevels !== undefined) renderHub("levels");
  if (b.dataset.homeVocab !== undefined) renderHub("vocabulary");
  if (b.dataset.homeExpressions !== undefined) renderHub("expressions");
  if (b.dataset.backLevel !== undefined) renderHub("levels");
  if (b.dataset.backToLevel !== undefined) openLevel(currentLevelIndex);
  if (b.dataset.backTopic !== undefined) openLevel(currentLevelIndex);
  if (b.dataset.openTopic) openTopicPage(decodeURIComponent(b.dataset.openTopic));
  if (b.dataset.openModal) renderModalLesson(decodeURIComponent(b.dataset.openModal));
  if (b.dataset.backModals !== undefined) openTopicPage("Use of Modals");
  if (b.dataset.sixPractice !== undefined) renderSixSentences(Number(b.dataset.sixPractice));
  if (b.dataset.sixQuiz !== undefined) renderSixSentenceQuiz(Number(b.dataset.sixQuiz));
  if (b.dataset.quizLevel !== undefined) renderLevelQuiz(Number(b.dataset.quizLevel));
  if (b.dataset.quizRetry !== undefined) renderLevelQuiz(Number(b.dataset.quizRetry));
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
