# SciBridge Bilingual Learning Hub

SciBridge turns the original Site-Scibridge codebase into a bilingual (English & Vietnamese) learning space that blends English
language development with the natural sciences and mathematics. All competitive-programming components (problem archive,
judge backend, submission system, and code checker) have been retired so the site now focuses entirely on bilingual lessons,
question banks, exam papers, and lightweight quiz contests while keeping the familiar layout and styling of the original project.

## Highlights

- **Bilingual interface** with a global EN ↔ VI switch that updates navigation copy, announcements, lessons, quizzes, and
dictionary entries in real time.
- **Subject coverage** for English, Mathematics, Physics, Chemistry, Biology, and Earth Science with sample lessons combining
language and STEM literacy.
- **Dictionary / Glossary** storing bilingual science and math vocabulary plus related terms.
- **Word of the Day** widget that rotates through sample entries using both languages.
- **Quiz & Contest arena** showing multiple-choice questions, immediate feedback, and a lightweight leaderboard/profile view.
- **Contest question banks & exam papers** so teachers can distribute bilingual practice sets without any coding workflow.
- **Admin staging panel** that lets teachers prototype new lessons, quizzes, and dictionary entries directly in the browser while
instructing them how to persist data inside `resources/data/edu-content.json`.
- **Unified search** for lessons, dictionary items, and quizzes in both languages.
- **Responsive design** that reuses the original styles and media queries from the Site-Scibridge theme.

## Repository structure

All existing file types remain in use:

- `templates/home.html` renders the bilingual home page while extending the default layout.
- `resources/style.scss` keeps the project styling and now includes the helper classes that power the new sections.
- `resources/edu.js` loads bilingual content, handles search, quizzes, dictionary rendering, and the admin preview panel.
- `resources/data/edu-content.json` contains the sample bilingual data for lessons, vocabulary, quizzes, contest question banks &
  exam papers, announcements, word of the day, leaderboards, and mentor profiles.

## Requirements

- Python ≥ 3.10
- Node.js ≥ 18 (for optional SCSS compilation)
- A working virtualenv is recommended.

## Quick start

```bash
# clone
$ git clone https://github.com/clhstestify/site-scibridge.git
$ cd site-scibridge

# install python requirements
$ python -m venv .venv && source .venv/bin/activate
$ pip install -r requirements.txt -r additional_requirements.txt

# migrate and run the Django server on port 5173
$ python manage.py migrate
$ python manage.py runserver 5173
```

The server uses Django's staticfiles pipeline, so the new JavaScript (`resources/edu.js`) and data (`resources/data/edu-content.json`)
are available immediately. When you need to recompile SCSS after making design changes, run:

```bash
$ npm install
$ npx sass resources/style.scss resources/style.css
```

(Collectstatic will pull the compiled CSS into the production deployment as usual.)

## Using the bilingual interface

1. Open `http://localhost:5173/` to load the SciBridge homepage.
2. Use the EN/VI toggle in the hero card to swap UI copy, dictionary entries, quiz prompts, feedback messages, and announcements.
   The script stores the preference in `localStorage` so returning visitors keep their language.
3. The search bar queries lessons, quizzes, and dictionary entries simultaneously (both languages are indexed).

## Admin & content authoring flow

The Admin panel on the homepage is a client-side staging area:

1. Fill out the "Add lesson preview", "Add quiz question", "Add dictionary entry", or "Add contest resources" forms.
2. Drafts are stored in `localStorage` so teachers can preview the layout and translations without impacting the JSON file.
3. When the content is ready, open `resources/data/edu-content.json` and append the entry under the matching section. Each
   object includes bilingual translations under `translations.en` and `translations.vi`.
4. Commit the updated JSON file so the server ships with the new bilingual content.

### JSON structure

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

Add new announcements, dictionary entries, word-of-the-day items, leaderboard rows, and mentor profiles by extending the arrays in
the same file. Keep both English and Vietnamese translations so the toggle can switch instantly.

## Retired competitive-programming stack

- Problem statements, online judge hooks, submission queues, and code-checker integrations have been removed from the site surface so the experience now centers on bilingual STEM literacy.
- Contests now represent question banks and examination papers that can be attached to leaderboards without requiring code execution.

### Admin login / role

Use the regular Django admin (`python manage.py createsuperuser`) to manage users, then rely on the homepage Admin card to stage
new educational resources. Because the staging tool only touches local storage, production data remains safe until a maintainer
edits `resources/data/edu-content.json` and commits the change.

## Testing & linting

The repo keeps all previous Python and JavaScript tooling. Run your preferred checks (flake8, pytest, prettier, etc.) the same
way as the upstream project. Example:

```bash
$ flake8
$ npm run format:check
```

## Feature checklist

- [x] Bilingual UI text and content
- [x] EN/VI toggle stored per user
- [x] Lessons for English, Mathematics, Physics, Chemistry, Biology, Earth Science
- [x] Bilingual glossary + search + filters
- [x] Word of the Day
- [x] Quiz/contest cards with instant feedback + leaderboard
- [x] Profiles and announcements
- [x] Admin preview panel with instructions for editing JSON data
- [x] README instructions for installing, running, and extending the site
