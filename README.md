# SciBridge Bilingual Learning Hub

SciBridge is the educational fork of the original Site-Scibridge project. It keeps the same Django layout while transforming the
experience into a bilingual (English ↔ Vietnamese) classroom that highlights lessons, question banks, quizzes, glossaries, and
teacher tooling. This README walks you through installing the stack and, more importantly, shows **how to access every education
feature once the server is running**.

---

## 1. Install and launch the hub

```bash
# clone and enter the repo
$ git clone https://github.com/clhstestify/site-scibridge.git
$ cd site-scibridge

# set up python + dependencies
$ python -m venv .venv && source .venv/bin/activate
$ pip install -r requirements.txt -r additional_requirements.txt

# set up optional front-end toolchain for SCSS
$ npm install

# run database migrations then launch on port 5173
$ python manage.py migrate
$ python manage.py runserver 5173
```

Visit `http://localhost:5173/` to reach the bilingual homepage. Django automatically serves the static JavaScript (`resources/edu.js`)
and the education dataset (`resources/data/edu-content.json`). Whenever you modify `resources/style.scss`, rebuild it with:

```bash
$ npx sass resources/style.scss resources/style.css
```

---

## 2. Navigating the bilingual education interface

1. **Language switcher** – Use the EN/VI toggle in the hero card. All lesson cards, dictionary entries, quizzes, announcements, and
   feedback copy switch immediately. The choice is stored in `localStorage` so every return visit preserves the language.
2. **Unified search** – The search bar at the top of the education section queries lessons, quizzes, contests, and glossary entries in
   both languages simultaneously. Typing either English or Vietnamese keywords surfaces matching cards.
3. **Responsive layout** – The portal is built on `templates/home.html` with helper styles defined in `resources/style.scss`, so all
   sections collapse gracefully on phones and tablets.

---

## 3. Accessing each education feature

### Lessons & learning paths
- Scroll to the "Featured Lessons" deck to browse English, Mathematics, Physics, Chemistry, Biology, and Earth Science content.
- Filter by subject using the dropdown above the cards. Each lesson expands to show bilingual summaries and resource links pulled
  from `resources/data/edu-content.json`.
- Use the "Add lesson preview" form in the Admin panel to stage a new card locally before editing the JSON file.

### Dictionary / glossary & word of the day
- Open the "Bilingual Glossary" tab to see science and math vocabulary with contextual notes. Search updates the list instantly.
- The "Word of the Day" widget sits beside the glossary and rotates through highlighted entries using the same dataset.

### Quizzes, instant feedback, and leaderboard
- The "Quizzes & Mini Contests" section lists multiple-choice activities. Clicking a card reveals the bilingual question and options.
- Selecting an answer triggers instant feedback with the explanation translated to the current language.
- Below the quizzes, the "Community Leaderboard" shows fictional mentors and scores. These rows are fully editable via the JSON
  file so classrooms can spotlight real participants.

### Contest resources and exam papers
- The "Contest Library" showcases curated question banks and downloadable exam papers. Each resource exposes bilingual descriptions
  with outbound links (Google Drive, PDFs, etc.).
- Teachers can attach resources to the featured contests directly in `resources/data/edu-content.json` under `contests[].questionBanks`
  and `contests[].examPapers`.

### Announcements, profiles, and community updates
- The "Announcements" carousel publishes bilingual news items (club meetings, new lesson drops, etc.).
- The "Mentor Profiles" grid introduces facilitators in both languages to give the hub a personal touch.

### Admin preview & authoring workflow
1. Locate the "Teacher Staging Panel" on the homepage.
2. Choose one of the forms (lesson, quiz, dictionary entry, contest resources) and fill out both translations.
3. Previewed items live only in `localStorage` for the current browser, letting educators iterate safely.
4. When satisfied, open `resources/data/edu-content.json`, copy the staged object, and paste it into the appropriate array
   (`lessons`, `quizzes`, `dictionary`, `contests`, `announcements`, etc.). Each item follows the schema shown below.

```json
{
  "lessons": [
    {
      "id": "english-example",
      "subject": "english",
      "category": "vocabulary",
      "translations": {
        "en": { "title": "...", "summary": "...", "content": "..." },
        "vi": { "title": "...", "summary": "...", "content": "..." }
      },
      "resources": ["Printable word cards"]
    }
  ],
  "quizzes": [
    {
      "id": "quiz-physics-1",
      "subject": "physics",
      "translations": {
        "en": { "question": "...", "explanation": "..." },
        "vi": { "question": "...", "explanation": "..." }
      },
      "options": [
        { "id": "A", "translations": { "en": "...", "vi": "..." }, "correct": false }
      ]
    }
  ],
  "contests": [
    {
      "id": "contest-math-challenge",
      "subject": "mathematics",
      "translations": {
        "en": { "title": "...", "description": "..." },
        "vi": { "title": "...", "description": "..." }
      },
      "questionBanks": [
        {
          "id": "qb-math-2024",
          "type": "question-bank",
          "url": "https://...",
          "translations": {
            "en": { "title": "...", "note": "..." },
            "vi": { "title": "...", "note": "..." }
          }
        }
      ],
      "examPapers": [
        {
          "id": "exam-math-2023",
          "type": "exam-paper",
          "url": "https://...",
          "translations": {
            "en": { "title": "...", "note": "..." },
            "vi": { "title": "...", "note": "..." }
          }
        }
      ]
    }
  ]
}
```

Remember to keep both languages populated—missing translations will cause empty UI states when learners switch languages.

---

## 4. Managing users and admin rights

- Use the standard Django admin workflow to create staff accounts:
  ```bash
  $ python manage.py createsuperuser
  ```
- Teachers log into `/admin/` to manage users, but educational content remains JSON-driven. This separation keeps production data
  safe while still giving instructors self-service tools via the homepage staging panel.

---

## 5. Retired competitive-programming stack

The online judge, submission queue, and checker integrations from Site-Scibridge have been intentionally removed. Contests now
represent curated bilingual question banks or exam paper bundles, so the portal focuses entirely on STEM literacy rather than code
execution.

---

## 6. Testing & linting

Run the same quality tools as the upstream project:

```bash
$ flake8
$ pytest            # optional, if you add backend logic
$ npm run format:check
```

---

## 7. Feature checklist

- [x] Bilingual UI text and content with EN/VI toggle stored per user
- [x] Lessons covering English, Mathematics, Physics, Chemistry, Biology, Earth Science
- [x] Bilingual glossary, search, and Word of the Day
- [x] Quiz/contest cards with instant feedback plus leaderboard
- [x] Contest library for question banks & exam papers
- [x] Announcements and mentor profiles
- [x] Teacher staging panel + JSON editing workflow
- [x] README instructions showing how to access every education feature
