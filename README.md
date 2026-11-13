# ENGLISH FANTASY — Made By SRABON

A responsive Bangla-English learning website built with Node.js, Express and vanilla JavaScript.

## Run locally
1. Install Node.js (LTS recommended).
2. Open this folder in VS Code.
3. In the VS Code terminal run `npm.cmd install` (Windows PowerShell) or `npm install`.
4. Copy `.env.example` to `.env`.
5. Set a private `JWT_SECRET` (at least 32 characters), `ADMIN_USERNAME`, and `ADMIN_PASSWORD` in `.env`.
6. For AI sentence generation, set `OPENAI_API_KEY` in `.env`. Never put this key in `public/` or share it in chat.
7. Run `npm.cmd run dev` (Windows PowerShell) or `npm run dev`.
8. Open `http://localhost:3000`.

## Included
- 4-digit demo learner ID login (not secure account authentication).
- AI Bangla/English sentence generation with six natural forms where appropriate.
- Separate Level 1–4 lesson screens with a back button.
- Be Verb lessons: Profession, Location, Condition and Future.
- Have Verb lessons: Possession, Relationship, Condition and Future.
- Tense structures and examples, Sentence Pattern lesson, and other Level 2–3 starter lessons.
- A 6 Sentences practice section at the end of Levels 1–3, with six English forms and Bangla meanings.
- Vocabulary level structure with sample Level 1 words (replace with the user's book list when supplied).
- Tongue Twisters with browser speech synthesis audio and completion tracking.
- Common Expressions Level 1–3 placeholders, ready for the correct source list to be added.
- Interactive practice quiz with score and feedback.
- Per-ID browser-local learning progress and selectable themes.
- Admin login and sentence Add/Edit/Delete.

## Important limitations
- The 4-digit learner ID is a demo identity only. Progress is saved in that browser's local storage; it does not sync across devices or browsers. Real multi-device accounts need a database and proper authentication.
- Vocabulary sample words are placeholders until the vocabulary-book images/list are provided.
- Common Expressions are intentionally left as separate Level 1, 2 and 3 placeholders until the correct source image/list is supplied. No entries or numbering have been invented.
- Tongue Twister audio uses the browser's built-in speech synthesis. Available voices vary by device/browser and require browser support.
- AI generation requires a valid OpenAI API key and an account/API setup handled by an adult/guardian where required.
- For public hosting, use HTTPS, configure environment variables in the hosting provider, and use persistent storage/database rather than an ephemeral local file if you need permanent content.
