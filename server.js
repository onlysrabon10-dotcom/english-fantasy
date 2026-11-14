import "dotenv/config";
import express from "express";
import rateLimit from "express-rate-limit";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import OpenAI from "openai";
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import crypto from "node:crypto";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = Number(process.env.PORT || 3000);
const DATA_FILE = path.join(__dirname, "data", "sentences.json");
const JWT_SECRET = process.env.JWT_SECRET;

app.use(express.json({ limit: "30kb" }));
app.use(express.static(path.join(__dirname, "public")));

const aiLimiter = rateLimit({ windowMs: 60_000, limit: 12, standardHeaders: true, legacyHeaders: false });
const loginLimiter = rateLimit({ windowMs: 15 * 60_000, limit: 8, standardHeaders: true, legacyHeaders: false });

function requireConfig() {
  if (!JWT_SECRET || JWT_SECRET.length < 32) {
    throw new Error("Set JWT_SECRET in your .env file (at least 32 characters).");
  }
}
async function readSentences() {
  try { return JSON.parse(await fs.readFile(DATA_FILE, "utf8")); }
  catch { return []; }
}
async function writeSentences(items) {
  await fs.mkdir(path.dirname(DATA_FILE), { recursive: true });
  await fs.writeFile(DATA_FILE, JSON.stringify(items, null, 2), "utf8");
}
function makeToken() {
  requireConfig();
  return jwt.sign({ role: "admin", username: process.env.ADMIN_USERNAME || "admin" }, JWT_SECRET, { expiresIn: "3h" });
}
function adminOnly(req, res, next) {
  try {
    requireConfig();
    const header = req.headers.authorization || "";
    const token = header.startsWith("Bearer ") ? header.slice(7) : "";
    const payload = jwt.verify(token, JWT_SECRET);
    if (payload.role !== "admin") return res.status(403).json({ error: "Admin access required." });
    req.admin = payload;
    next();
  } catch {
    res.status(401).json({ error: "Please sign in as admin again." });
  }
}

app.get("/api/health", (_req, res) => res.json({ ok: true, app: "English Fantasy" }));

// Shared learner entry code. This is a shared access code, not individual identity verification.
app.post("/api/learner-login", (req, res) => {
  const id = String(req.body?.id || "").trim();
  if (id !== "5757") return res.status(401).json({ error: "ভুল ID Number। সঠিক ID Number দাও।" });
  res.json({ ok: true, learnerId: id });
});

app.post("/api/admin-login", loginLimiter, async (req, res) => {
  const username = String(req.body?.username || "");
  const password = String(req.body?.password || "");
  const configuredUser = process.env.ADMIN_USERNAME || "";
  const configuredPass = process.env.ADMIN_PASSWORD || "";
  if (!configuredUser || !configuredPass || !JWT_SECRET || JWT_SECRET.length < 32) {
    return res.status(503).json({ error: "Admin setup is incomplete. Configure .env first." });
  }
  // Compare a hash to avoid plain-text password comparison in application logic.
  const hash = await bcrypt.hash(configuredPass, 10);
  const valid = username === configuredUser && await bcrypt.compare(password, hash);
  if (!valid) return res.status(401).json({ error: "Incorrect admin ID or password." });
  res.json({ ok: true, token: makeToken() });
});

app.get("/api/sentences", async (_req, res) => {
  res.json(await readSentences());
});

app.post("/api/sentences", adminOnly, async (req, res) => {
  const { bangla, english, forms } = req.body || {};
  if (!String(bangla || "").trim() || !String(english || "").trim()) {
    return res.status(400).json({ error: "Bangla and English sentences are required." });
  }
  const items = await readSentences();
  const item = { id: crypto.randomUUID(), bangla: String(bangla).trim(), english: String(english).trim(), forms: Array.isArray(forms) ? forms : [], createdAt: new Date().toISOString() };
  items.unshift(item);
  await writeSentences(items);
  res.status(201).json(item);
});

app.put("/api/sentences/:id", adminOnly, async (req, res) => {
  const { bangla, english, forms } = req.body || {};
  if (!String(bangla || "").trim() || !String(english || "").trim()) return res.status(400).json({ error: "Bangla and English sentences are required." });
  const items = await readSentences();
  const index = items.findIndex(x => x.id === req.params.id);
  if (index < 0) return res.status(404).json({ error: "Sentence not found." });
  items[index] = { ...items[index], bangla: String(bangla).trim(), english: String(english).trim(), forms: Array.isArray(forms) ? forms : [] };
  await writeSentences(items);
  res.json(items[index]);
});

app.delete("/api/sentences/:id", adminOnly, async (req, res) => {
  const items = await readSentences();
  const next = items.filter(x => x.id !== req.params.id);
  if (next.length === items.length) return res.status(404).json({ error: "Sentence not found." });
  await writeSentences(next);
  res.json({ ok: true });
});

// Admin vocabulary manager: edits are persisted in the matching JSON file.
function vocabularyFile(level) {
  const n = Number(level);
  if (![1, 2, 3].includes(n)) return null;
  return path.join(__dirname, "data", `vocabulary-level${n}.json`);
}
async function readVocabulary(level) {
  const file = vocabularyFile(level);
  if (!file) throw new Error("Invalid vocabulary level.");
  return JSON.parse(await fs.readFile(file, "utf8"));
}
async function writeVocabulary(level, items) {
  const file = vocabularyFile(level);
  if (!file) throw new Error("Invalid vocabulary level.");
  await fs.writeFile(file, JSON.stringify(items, null, 2) + "\n", "utf8");
  const n = Number(level);
  const browserFile = path.join(__dirname, "public", `vocabulary-level${n}.js`);
  const safeJson = JSON.stringify(items).replace(/</g, "\\u003c");
  await fs.writeFile(browserFile, `window.level${n}Words = ${safeJson};\n`, "utf8");
}
function cleanWords(value) {
  if (Array.isArray(value)) return value.map(x => String(x).trim()).filter(Boolean).slice(0, 8);
  return String(value || "").split(/[\n,;]+/).map(x => x.trim()).filter(Boolean).slice(0, 8);
}
app.get("/api/admin/vocabulary/:level", adminOnly, async (req, res) => {
  try { res.json(await readVocabulary(req.params.level)); }
  catch { res.status(400).json({ error: "Vocabulary level not found." }); }
});
app.put("/api/admin/vocabulary/:level/:index", adminOnly, async (req, res) => {
  try {
    const level = Number(req.params.level), index = Number(req.params.index);
    const items = await readVocabulary(level);
    if (!Number.isInteger(index) || index < 0 || index >= items.length) return res.status(404).json({ error: "Word not found." });
    const body = req.body || {};
    const word = String(body.word ?? items[index].word).trim();
    const meaning = String(body.meaning ?? items[index].meaning).trim();
    if (!word || !meaning) return res.status(400).json({ error: "Word and meaning are required." });
    items[index] = { ...items[index], word, meaning, synonyms: cleanWords(body.synonyms ?? items[index].synonyms), indirectSynonyms: cleanWords(body.indirectSynonyms ?? items[index].indirectSynonyms), antonyms: cleanWords(body.antonyms ?? items[index].antonyms), indirectAntonyms: cleanWords(body.indirectAntonyms ?? items[index].indirectAntonyms) };
    await writeVocabulary(level, items); res.json(items[index]);
  } catch { res.status(400).json({ error: "Could not update vocabulary word." }); }
});
app.post("/api/admin/vocabulary/:level", adminOnly, async (req, res) => {
  try {
    const level = Number(req.params.level), items = await readVocabulary(level), body = req.body || {};
    const word = String(body.word || "").trim(), meaning = String(body.meaning || "").trim();
    if (!word || !meaning) return res.status(400).json({ error: "Word and meaning are required." });
    if (items.some(x => x.word.toLowerCase() === word.toLowerCase())) return res.status(409).json({ error: "This word already exists in this level." });
    const item = { word, meaning, synonyms: cleanWords(body.synonyms), indirectSynonyms: cleanWords(body.indirectSynonyms), antonyms: cleanWords(body.antonyms), indirectAntonyms: cleanWords(body.indirectAntonyms) };
    items.push(item); await writeVocabulary(level, items); res.status(201).json(item);
  } catch { res.status(400).json({ error: "Could not add vocabulary word." }); }
});
app.delete("/api/admin/vocabulary/:level/:index", adminOnly, async (req, res) => {
  try { const level = Number(req.params.level), index = Number(req.params.index), items = await readVocabulary(level); if (!Number.isInteger(index) || index < 0 || index >= items.length) return res.status(404).json({ error: "Word not found." }); items.splice(index, 1); await writeVocabulary(level, items); res.json({ ok: true }); }
  catch { res.status(400).json({ error: "Could not delete vocabulary word." }); }
});

app.post("/api/generate", aiLimiter, async (req, res) => {
  const sentence = String(req.body?.sentence || "").trim();
  if (!sentence || sentence.length > 500) return res.status(400).json({ error: "Write a sentence (up to 500 characters)." });
  if (!process.env.OPENAI_API_KEY) return res.status(503).json({ error: "AI is not connected yet. Add OPENAI_API_KEY to your .env file." });

  try {
    const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    const response = await client.chat.completions.create({
      model: process.env.OPENAI_MODEL || "gpt-4.1-mini",
      temperature: 0.2,
      response_format: { type: "json_object" },
      messages: [
        {
          role: "system",
          content: `You are an accurate beginner-friendly Bangla-English grammar tutor. The user may provide Bangla or English. Return ONLY valid JSON with this schema:
{
 "inputBangla": "natural Bangla version of the original meaning",
 "inputEnglish": "natural English translation",
 "meaning": "short Bangla meaning",
 "hasSixForms": true,
 "notice": "",
 "forms": [
  {"name":"Affirmative","english":"...","bangla":"..."},
  {"name":"Negative","english":"...","bangla":"..."},
  {"name":"Interrogative","english":"...","bangla":"..."},
  {"name":"Negative Interrogative","english":"...","bangla":"..."},
  {"name":"Why Affirmative","english":"...","bangla":"..."},
  {"name":"Why Negative","english":"...","bangla":"..."}
 ]
}
Important: Create the six forms ONLY if all six are grammatically natural and preserve the intended tense/voice/meaning. Otherwise include every natural useful sentence form you can produce in "forms", set hasSixForms to false, and set notice exactly to "এই Sentence-এর ৬টি Form হয় না।" (you may add a brief reason in Bangla after it). Never force an incorrect or unnatural form. Keep English beginner-friendly. Every English form must have a clear Bangla translation. If the input is not a complete sentence, explain briefly in notice and provide best useful correction in forms if possible. Do not invent grammar rules.`
        },
        { role: "user", content: sentence }
      ]
    });
    const raw = response.choices?.[0]?.message?.content || "{}";
    const result = JSON.parse(raw);
    if (!Array.isArray(result.forms)) result.forms = [];
    res.json(result);
  } catch (err) {
    console.error("AI generation error:", err?.message || err);
    res.status(500).json({ error: "Could not generate the sentence right now. Check the API setup and try again." });
  }
});

app.get("*", (_req, res) => res.sendFile(path.join(__dirname, "public", "index.html")));

app.listen(PORT, () => console.log(`English Fantasy running at http://localhost:${PORT}`));
