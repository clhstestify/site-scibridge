/*
 * SciBridge bilingual education UI logic.
 *
 * This script keeps the existing layout from base.html but injects the bilingual
 * learning experience described in README.md. It loads structured JSON data,
 * renders both English and Vietnamese content, and exposes a client-side admin
 * preview so teachers can test content before updating resources/data/edu-content.json.
 */
(function () {
    document.addEventListener('DOMContentLoaded', function () {
        const app = document.getElementById('education-app');
        if (!app) return;

        const contentUrl = app.dataset.contentUrl;
        const langButtons = app.querySelectorAll('.language-toggle .toggle');
        const dictionarySearch = document.getElementById('dictionary-search');
        const dictionaryFilter = document.getElementById('dictionary-filter');
        const globalSearch = document.getElementById('global-search');
        const searchResults = document.getElementById('search-results');

        const wordTerm = document.getElementById('word-of-day-term');
        const wordDefinition = document.getElementById('word-of-day-definition');
        const wordUsage = document.getElementById('word-of-day-usage');

        const lessonGrid = document.getElementById('lesson-grid');
        const announcementList = document.getElementById('announcement-list');
        const dictionaryEntries = document.getElementById('dictionary-entries');
        const quizWrapper = document.getElementById('quiz-wrapper');
        const leaderboardList = document.getElementById('leaderboard-list');
        const contestResourcesContainer = document.getElementById('contest-resources');
        const profileGrid = document.getElementById('profile-grid');

        const adminLessonForm = document.getElementById('admin-lesson-form');
        const adminQuizForm = document.getElementById('admin-quiz-form');
        const adminDictionaryForm = document.getElementById('admin-dictionary-form');
        const adminContestForm = document.getElementById('admin-contest-form');

        const uiStrings = {
            en: {
                badge: 'Bilingual STEM Bridge',
                heroTitle: 'Learning hub for English + Natural Sciences',
                heroSubtitle: 'Explore lessons, bilingual vocabulary, and quizzes that connect high school English with mathematics and the sciences.',
                languageLabel: 'Language',
                wordOfDayHeading: 'Word of the day',
                searchLabel: 'Search bilingual lessons, quizzes, dictionary',
                announcementHeading: 'Announcements',
                announcementSubheading: 'News for English, Math, and Science programs.',
                subjectHeading: 'Featured bilingual lessons',
                subjectSubheading: 'Each tile combines English literacy with STEM thinking.',
                dictionaryHeading: 'Bilingual science glossary',
                dictionarySubheading: 'Find key terms for lab reports, math proofs, and presentations.',
                allSubjects: 'All subjects',
                quizHeading: 'Quiz & Contest Arena',
                quizSubheading: 'Instant feedback in both languages with a lightweight leaderboard.',
                contestResourcesHeading: 'Contest question banks & exam papers',
                contestResourcesNote: 'Teachers curate bilingual practice sets and mock exams for each subject contest.',
                leaderboardHeading: 'Leaderboard',
                contestLabel: 'Contest',
                questionBankLabel: 'Question banks',
                examPaperLabel: 'Exam papers',
                resourceLinkLabel: 'Open resource',
                profileHeading: 'Mentors & Student Spotlights',
                profileSubheading: 'Celebrate bilingual scientists and language ambassadors.',
                adminHeading: 'Admin panel',
                adminSubheading: 'Teachers can stage updates before publishing to the data file.',
                adminHelpHeading: 'How to add new content',
                adminHelpStep1: 'Use the forms to prototype lessons, quizzes, dictionary items, and contest resources. Drafts stay in local storage for preview.',
                adminHelpStep2: 'Open resources/data/edu-content.json to permanently add bilingual data (EN + VI fields).',
                adminHelpStep3: 'Commit updates so every server receives the new bilingual resources.',
                toggleHelp: 'The EN ↔ VI toggle switches UI text and content translations instantly.',
                adminLessonForm: 'Add lesson preview',
                adminSubject: 'Subject',
                adminTitleEn: 'Title (English)',
                adminTitleVi: 'Title (Vietnamese)',
                adminAddLesson: 'Preview lesson',
                adminQuizForm: 'Add quiz question',
                adminQuizSubject: 'Subject',
                adminQuestion: 'Question (EN)',
                adminQuestionVi: 'Question (VI)',
                adminAddQuiz: 'Preview quiz',
                adminDictionaryForm: 'Add dictionary entry',
                adminTerm: 'Term',
                adminDefinitionEn: 'Definition (EN)',
                adminDefinitionVi: 'Definition (VI)',
                adminAddDictionary: 'Preview entry',
                adminContestForm: 'Add contest resources',
                adminContestSubject: 'Subject',
                adminContestTitleEn: 'Contest title (EN)',
                adminContestTitleVi: 'Contest title (VI)',
                adminContestDescriptionEn: 'Contest notes (EN)',
                adminContestDescriptionVi: 'Contest notes (VI)',
                adminContestType: 'Resource type',
                adminContestQuestionBank: 'Question bank',
                adminContestExamPaper: 'Exam paper',
                adminResourceTitleEn: 'Resource title (EN)',
                adminResourceTitleVi: 'Resource title (VI)',
                adminResourceNoteEn: 'Notes (EN)',
                adminResourceNoteVi: 'Notes (VI)',
                adminResourceUrl: 'Link',
                adminAddContestResource: 'Preview contest resource',
                emptySearch: 'Type at least three characters to search.',
                searchMatches: 'matches',
                correct: 'Correct!',
                incorrect: 'Try again',
                leaderboardPoints: 'points',
                previewSaved: 'Draft saved locally for preview.'
            },
            vi: {
                badge: 'Cầu nối STEM song ngữ',
                heroTitle: 'Trung tâm học tập cho Tiếng Anh + Khoa học tự nhiên',
                heroSubtitle: 'Khám phá bài học, từ vựng song ngữ và câu đố kết nối tiếng Anh THPT với toán và khoa học.',
                languageLabel: 'Ngôn ngữ',
                wordOfDayHeading: 'Từ vựng mỗi ngày',
                searchLabel: 'Tìm kiếm bài học, câu đố, từ điển song ngữ',
                announcementHeading: 'Thông báo',
                announcementSubheading: 'Tin tức cho các chương trình Tiếng Anh, Toán và Khoa học.',
                subjectHeading: 'Bài học song ngữ nổi bật',
                subjectSubheading: 'Mỗi thẻ kết hợp năng lực ngôn ngữ với tư duy STEM.',
                dictionaryHeading: 'Bảng thuật ngữ khoa học song ngữ',
                dictionarySubheading: 'Tìm thuật ngữ cho báo cáo thí nghiệm, chứng minh toán và thuyết trình.',
                allSubjects: 'Tất cả môn học',
                quizHeading: 'Đấu trường Quiz & Contest',
                quizSubheading: 'Phản hồi tức thì bằng hai ngôn ngữ kèm bảng xếp hạng gọn nhẹ.',
                contestResourcesHeading: 'Ngân hàng câu hỏi & đề thi cho contest',
                contestResourcesNote: 'Giáo viên chọn bộ bài tập song ngữ và đề mô phỏng cho từng contest.',
                leaderboardHeading: 'Bảng xếp hạng',
                contestLabel: 'Cuộc thi',
                questionBankLabel: 'Ngân hàng câu hỏi',
                examPaperLabel: 'Đề thi',
                resourceLinkLabel: 'Mở tài liệu',
                profileHeading: 'Cố vấn & Gương mặt học sinh',
                profileSubheading: 'Tôn vinh nhà khoa học và đại sứ ngôn ngữ song ngữ.',
                adminHeading: 'Bảng điều khiển',
                adminSubheading: 'Giáo viên có thể chuẩn bị nội dung trước khi ghi vào tệp dữ liệu.',
                adminHelpHeading: 'Cách thêm nội dung',
                adminHelpStep1: 'Dùng biểu mẫu để thử bài học, quiz, mục từ điển và tài nguyên contest. Thay đổi được lưu tạm tại local storage.',
                adminHelpStep2: 'Mở resources/data/edu-content.json để thêm dữ liệu song ngữ (EN + VI) vĩnh viễn.',
                adminHelpStep3: 'Commit để mọi máy chủ nhận được tài nguyên song ngữ mới.',
                toggleHelp: 'Nút EN ↔ VI đổi ngôn ngữ giao diện và nội dung ngay lập tức.',
                adminLessonForm: 'Thêm bản nháp bài học',
                adminSubject: 'Môn học',
                adminTitleEn: 'Tiêu đề (Tiếng Anh)',
                adminTitleVi: 'Tiêu đề (Tiếng Việt)',
                adminAddLesson: 'Xem trước bài học',
                adminQuizForm: 'Thêm câu hỏi quiz',
                adminQuizSubject: 'Môn học',
                adminQuestion: 'Câu hỏi (EN)',
                adminQuestionVi: 'Câu hỏi (VI)',
                adminAddQuiz: 'Xem trước quiz',
                adminDictionaryForm: 'Thêm mục từ điển',
                adminTerm: 'Thuật ngữ',
                adminDefinitionEn: 'Định nghĩa (EN)',
                adminDefinitionVi: 'Định nghĩa (VI)',
                adminAddDictionary: 'Xem trước mục',
                adminContestForm: 'Thêm tài nguyên contest',
                adminContestSubject: 'Môn học',
                adminContestTitleEn: 'Tên contest (EN)',
                adminContestTitleVi: 'Tên contest (VI)',
                adminContestDescriptionEn: 'Ghi chú contest (EN)',
                adminContestDescriptionVi: 'Ghi chú contest (VI)',
                adminContestType: 'Loại tài nguyên',
                adminContestQuestionBank: 'Ngân hàng câu hỏi',
                adminContestExamPaper: 'Đề thi',
                adminResourceTitleEn: 'Tên tài nguyên (EN)',
                adminResourceTitleVi: 'Tên tài nguyên (VI)',
                adminResourceNoteEn: 'Ghi chú (EN)',
                adminResourceNoteVi: 'Ghi chú (VI)',
                adminResourceUrl: 'Liên kết',
                adminAddContestResource: 'Xem trước tài nguyên contest',
                emptySearch: 'Nhập ít nhất ba ký tự để tìm kiếm.',
                searchMatches: 'kết quả',
                correct: 'Chính xác!',
                incorrect: 'Thử lại',
                leaderboardPoints: 'điểm',
                previewSaved: 'Đã lưu bản nháp để xem trước.'
            }
        };

        const state = {
            lang: localStorage.getItem('scibridgeLang') || 'en',
            data: null,
            drafts: loadDrafts()
        };
        if (!state.drafts.contests) {
            state.drafts.contests = [];
        }

        fetch(contentUrl)
            .then((response) => response.json())
            .then((data) => {
                state.data = data;
                hydrate();
            })
            .catch((error) => {
                console.error('Unable to load bilingual content', error);
            });

        function hydrate() {
            updateUiCopy();
            renderAnnouncements();
            renderLessons();
            renderDictionary();
            renderWordOfDay();
            renderQuizzes();
            renderContestResources();
            renderLeaderboard();
            renderProfiles();
            bindSearch();
            bindAdminForms();
            highlightActiveLang();
        }

        function translate(entry, field) {
            const langPack = entry.translations || {};
            const preferred = langPack[state.lang] || langPack.en || {};
            return preferred[field] || '';
        }

        function updateUiCopy() {
            document.documentElement.setAttribute('lang', state.lang);
            const labels = app.querySelectorAll('[data-i18n]');
            labels.forEach((node) => {
                const key = node.getAttribute('data-i18n');
                const copy = uiStrings[state.lang][key];
                if (copy) node.textContent = copy;
            });
        }

        function highlightActiveLang() {
            langButtons.forEach((btn) => {
                btn.classList.toggle('active', btn.dataset.lang === state.lang);
            });
        }

        langButtons.forEach((button) => {
            button.addEventListener('click', () => {
                const selected = button.dataset.lang;
                if (selected === state.lang) return;
                state.lang = selected;
                localStorage.setItem('scibridgeLang', selected);
                updateUiCopy();
                renderAnnouncements();
                renderLessons();
                renderDictionary();
                renderWordOfDay();
                renderQuizzes();
                renderContestResources();
                renderLeaderboard();
                renderProfiles();
                runSearch(globalSearch.value.trim());
                highlightActiveLang();
            });
        });

        function renderWordOfDay() {
            if (!state.data) return;
            const entries = state.data.wordOfDay || [];
            if (!entries.length) return;
            const index = new Date().getDate() % entries.length;
            const entry = entries[index];
            wordTerm.textContent = entry.term;
            wordDefinition.textContent = translate(entry, 'definition');
            wordUsage.textContent = translate(entry, 'usage');
        }

        function renderAnnouncements() {
            if (!state.data) return;
            announcementList.innerHTML = '';
            const fragment = document.createDocumentFragment();
            state.data.announcements.forEach((announcement) => {
                const article = document.createElement('article');
                article.className = 'announcement-item';
                const title = translate(announcement, 'title');
                const body = translate(announcement, 'body');
                const date = new Date(announcement.date);
                const formatted = date.toLocaleDateString(state.lang === 'en' ? 'en-US' : 'vi-VN', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric'
                });
                article.innerHTML = `
                    <h3>${title}</h3>
                    <p class="meta">${formatted}</p>
                    <p>${body}</p>
                `;
                fragment.appendChild(article);
            });
            announcementList.appendChild(fragment);
        }

        function getLessons() {
            if (!state.data) return [];
            return [...state.data.lessons, ...(state.drafts.lessons || [])];
        }

        function renderLessons() {
            const lessons = getLessons();
            lessonGrid.innerHTML = '';
            lessons.forEach((lesson) => {
                const article = document.createElement('article');
                article.className = 'lesson-card';
                article.innerHTML = `
                    <div class="lesson-meta">
                        <span class="subject-tag">${formatSubject(lesson.subject)}</span>
                        <span class="category">${lesson.category || ''}</span>
                    </div>
                    <h3>${translate(lesson, 'title')}</h3>
                    <p>${translate(lesson, 'summary')}</p>
                    <p class="lesson-note">${translate(lesson, 'content')}</p>
                `;
                lessonGrid.appendChild(article);
            });
        }

        function renderDictionary() {
            if (!state.data) return;
            const entries = [...state.data.dictionary, ...(state.drafts.dictionary || [])];
            const query = (dictionarySearch.value || '').toLowerCase();
            const filter = dictionaryFilter.value;
            dictionaryEntries.innerHTML = '';
            entries
                .filter((entry) => {
                    const inFilter = filter === 'all' || entry.category === filter || entry.subject === filter;
                    const match =
                        !query ||
                        entry.term.toLowerCase().includes(query) ||
                        translationIncludes(entry, 'definition', query);
                    return inFilter && match;
                })
                .forEach((entry) => {
                    const article = document.createElement('article');
                    article.className = 'dictionary-card';
                    article.innerHTML = `
                        <header>
                            <h3>${entry.term}</h3>
                            <span>${formatSubject(entry.category || entry.subject)}</span>
                        </header>
                        <p>${translate(entry, 'definition')}</p>
                        <p class="related">${(entry.related || []).join(', ')}</p>
                    `;
                    dictionaryEntries.appendChild(article);
                });
        }

        function renderQuizzes() {
            if (!state.data) return;
            const quizzes = [...state.data.quizzes, ...(state.drafts.quizzes || [])];
            quizWrapper.innerHTML = '';
            quizzes.forEach((quiz) => {
                const block = document.createElement('article');
                block.className = 'quiz-card';
                block.innerHTML = `
                    <div class="lesson-meta">
                        <span class="subject-tag">${formatSubject(quiz.subject)}</span>
                    </div>
                    <p class="question">${translate(quiz, 'question')}</p>
                    <div class="quiz-options">
                        ${quiz.options
                            .map(
                                (option) => `
                            <button type="button" class="quiz-option" data-correct="${option.correct}">
                                ${option.id}. ${translateOption(option)}
                            </button>`
                            )
                            .join('')}
                    </div>
                    <p class="quiz-feedback"></p>
                    <p class="explanation" hidden>${translate(quiz, 'explanation')}</p>
                `;
                block.querySelectorAll('.quiz-option').forEach((button) => {
                    button.addEventListener('click', () => {
                        const isCorrect = button.dataset.correct === 'true';
                        const feedback = block.querySelector('.quiz-feedback');
                        const explanation = block.querySelector('.explanation');
                        if (isCorrect) {
                            feedback.textContent = uiStrings[state.lang].correct;
                            explanation.hidden = false;
                            updateLeaderboardPoints(quiz.subject);
                        } else {
                            feedback.textContent = uiStrings[state.lang].incorrect;
                        }
                    });
                });
                quizWrapper.appendChild(block);
            });
        }

        function renderContestResources() {
            if (!contestResourcesContainer || !state.data) return;
            const contests = getMergedContests();
            contestResourcesContainer.innerHTML = '';
            if (!contests.length) return;
            contests.forEach((contest) => {
                const article = document.createElement('article');
                article.className = 'contest-card';
                article.innerHTML = `
                    <header>
                        <div class="lesson-meta">
                            <span class="subject-tag">${formatSubject(contest.subject)}</span>
                        </div>
                        <h3>${translate(contest, 'title')}</h3>
                        <p>${translate(contest, 'description')}</p>
                    </header>
                    ${renderContestGroup('questionBanks', contest.questionBanks)}
                    ${renderContestGroup('examPapers', contest.examPapers)}
                `;
                contestResourcesContainer.appendChild(article);
            });
        }

        function renderContestGroup(type, entries) {
            const list = entries || [];
            if (!list.length) return '';
            const headingKey = type === 'questionBanks' ? 'questionBankLabel' : 'examPaperLabel';
            const items = list
                .map((item) => {
                    const note = translateResource(item, 'note');
                    const url = item.url
                        ? `<a href="${item.url}" target="_blank" rel="noopener" class="resource-link">${uiStrings[state.lang].resourceLinkLabel}</a>`
                        : '';
                    return `
                        <li>
                            <strong>${translateResource(item, 'title')}</strong>
                            ${note ? `<p>${note}</p>` : ''}
                            ${url}
                        </li>
                    `;
                })
                .join('');
            return `
                <div class="contest-resource-group">
                    <h4>${uiStrings[state.lang][headingKey]}</h4>
                    <ul>${items}</ul>
                </div>
            `;
        }

        function renderLeaderboard() {
            if (!state.data) return;
            const leaderboard = (state.data.leaderboard || []).sort((a, b) => b.points - a.points);
            leaderboardList.innerHTML = '';
            leaderboard.forEach((entry) => {
                const item = document.createElement('li');
                item.innerHTML = `
                    <div>
                        <strong>${entry.student}</strong>
                        <p>${translate(entry, 'bio')}</p>
                    </div>
                    <span>${entry.points} ${uiStrings[state.lang].leaderboardPoints}</span>
                `;
                leaderboardList.appendChild(item);
            });
        }

        function renderProfiles() {
            if (!state.data) return;
            profileGrid.innerHTML = '';
            state.data.profiles.forEach((profile) => {
                const card = document.createElement('article');
                card.className = 'profile-card';
                card.innerHTML = `
                    <h3>${profile.name}</h3>
                    <p class="role">${profile.role}</p>
                    <p>${translate(profile, 'bio')}</p>
                `;
                profileGrid.appendChild(card);
            });
        }

        function bindSearch() {
            globalSearch.addEventListener('input', (event) => {
                runSearch(event.target.value.trim());
            });
            dictionarySearch.addEventListener('input', renderDictionary);
            dictionaryFilter.addEventListener('change', renderDictionary);
        }

        function runSearch(query) {
            searchResults.innerHTML = '';
            if (query.length < 3) {
                searchResults.textContent = query.length ? uiStrings[state.lang].emptySearch : '';
                return;
            }
            if (!state.data) {
                return;
            }
            const lower = query.toLowerCase();
            const lessons = getLessons();
            const dictEntries = [...state.data.dictionary, ...(state.drafts.dictionary || [])];
            const quizzes = [...state.data.quizzes, ...(state.drafts.quizzes || [])];
            const contests = getMergedContests();
            const matches = [];
            lessons.forEach((lesson) => {
                if (translationIncludes(lesson, 'title', lower) || translationIncludes(lesson, 'summary', lower)) {
                    matches.push({ type: 'lesson', title: translate(lesson, 'title'), subject: lesson.subject });
                }
            });
            dictEntries.forEach((entry) => {
                const defMatches = translationIncludes(entry, 'definition', lower);
                if (entry.term.toLowerCase().includes(lower) || defMatches) {
                    matches.push({ type: 'dictionary', title: entry.term, subject: entry.category });
                }
            });
            quizzes.forEach((quiz) => {
                if (translationIncludes(quiz, 'question', lower)) {
                    matches.push({ type: 'quiz', title: translate(quiz, 'question'), subject: quiz.subject });
                }
            });
            contests.forEach((contest) => {
                if (translationIncludes(contest, 'title', lower)) {
                    matches.push({
                        type: uiStrings[state.lang].contestLabel,
                        title: translate(contest, 'title'),
                        subject: contest.subject
                    });
                }
                [...(contest.questionBanks || []), ...(contest.examPapers || [])].forEach((resource) => {
                    if (translationIncludes(resource, 'title', lower)) {
                        matches.push({
                            type:
                                resource.type === 'exam-paper'
                                    ? uiStrings[state.lang].examPaperLabel
                                    : uiStrings[state.lang].questionBankLabel,
                            title: translateResource(resource, 'title'),
                            subject: contest.subject
                        });
                    }
                });
            });
            if (!matches.length) {
                searchResults.textContent = '0 ' + uiStrings[state.lang].searchMatches;
                return;
            }
            const fragment = document.createDocumentFragment();
            matches.slice(0, 5).forEach((match) => {
                const div = document.createElement('div');
                div.className = 'search-hit';
                div.innerHTML = `
                    <strong>${match.title}</strong>
                    <span>${match.type} · ${formatSubject(match.subject)}</span>
                `;
                fragment.appendChild(div);
            });
            searchResults.innerHTML = '';
            searchResults.appendChild(fragment);
        }

        function bindAdminForms() {
            if (adminLessonForm) {
                adminLessonForm.addEventListener('submit', (event) => {
                    event.preventDefault();
                    const form = event.currentTarget;
                    const formData = new FormData(form);
                    const lesson = {
                        id: `draft-lesson-${Date.now()}`,
                        subject: formData.get('subject'),
                        category: 'draft',
                        translations: {
                            en: { title: formData.get('titleEn'), summary: 'Draft summary', content: 'Draft content' },
                            vi: { title: formData.get('titleVi'), summary: 'Bản nháp', content: 'Bản nháp' }
                        }
                    };
                    state.drafts.lessons.push(lesson);
                    persistDrafts();
                    renderLessons();
                    form.reset();
                    showPreviewToast();
                });
            }
            if (adminQuizForm) {
                adminQuizForm.addEventListener('submit', (event) => {
                    event.preventDefault();
                    const formData = new FormData(event.currentTarget);
                    const quiz = {
                        id: `draft-quiz-${Date.now()}`,
                        subject: formData.get('subject') || 'english',
                        translations: {
                            en: { question: formData.get('questionEn'), explanation: 'Draft explanation' },
                            vi: { question: formData.get('questionVi'), explanation: 'Giải thích nháp' }
                        },
                        options: [
                            {
                                id: 'A',
                                translations: { en: 'Option A', vi: 'Phương án A' },
                                correct: true
                            },
                            {
                                id: 'B',
                                translations: { en: 'Option B', vi: 'Phương án B' },
                                correct: false
                            }
                        ]
                    };
                    state.drafts.quizzes.push(quiz);
                    persistDrafts();
                    renderQuizzes();
                    event.currentTarget.reset();
                    showPreviewToast();
                });
            }
            if (adminDictionaryForm) {
                adminDictionaryForm.addEventListener('submit', (event) => {
                    event.preventDefault();
                    const formData = new FormData(event.currentTarget);
                    const entry = {
                        term: formData.get('term'),
                        category: 'draft',
                        translations: {
                            en: { definition: formData.get('definitionEn') },
                            vi: { definition: formData.get('definitionVi') }
                        }
                    };
                    state.drafts.dictionary.push(entry);
                    persistDrafts();
                    renderDictionary();
                    event.currentTarget.reset();
                    showPreviewToast();
                });
            }
            if (adminContestForm) {
                adminContestForm.addEventListener('submit', (event) => {
                    event.preventDefault();
                    const formData = new FormData(event.currentTarget);
                    const id = slugify(formData.get('contestTitleEn')) || `contest-${Date.now()}`;
                    const resourceType = formData.get('resourceType') || 'question-bank';
                    const resource = {
                        id: `resource-${Date.now()}`,
                        type: resourceType,
                        url: formData.get('resourceUrl'),
                        translations: {
                            en: { title: formData.get('resourceTitleEn'), note: formData.get('resourceNoteEn') },
                            vi: { title: formData.get('resourceTitleVi'), note: formData.get('resourceNoteVi') }
                        }
                    };
                    if (!state.drafts.contests) state.drafts.contests = [];
                    let contest = state.drafts.contests.find((entry) => entry.id === id);
                    if (!contest) {
                        contest = {
                            id,
                            subject: formData.get('subject') || 'english',
                            translations: {
                                en: { title: formData.get('contestTitleEn'), description: formData.get('contestDescriptionEn') },
                                vi: { title: formData.get('contestTitleVi'), description: formData.get('contestDescriptionVi') }
                            },
                            questionBanks: [],
                            examPapers: []
                        };
                        state.drafts.contests.push(contest);
                    } else {
                        contest.subject = formData.get('subject') || contest.subject;
                        contest.translations.en.title = formData.get('contestTitleEn');
                        contest.translations.en.description = formData.get('contestDescriptionEn');
                        contest.translations.vi.title = formData.get('contestTitleVi');
                        contest.translations.vi.description = formData.get('contestDescriptionVi');
                    }
                    const list = resourceType === 'exam-paper' ? contest.examPapers : contest.questionBanks;
                    list.push(resource);
                    persistDrafts();
                    renderContestResources();
                    event.currentTarget.reset();
                    showPreviewToast();
                });
            }
        }

        function showPreviewToast() {
            const toast = document.createElement('div');
            toast.className = 'preview-toast';
            toast.textContent = uiStrings[state.lang].previewSaved;
            app.appendChild(toast);
            setTimeout(() => {
                toast.remove();
            }, 2500);
        }

        function updateLeaderboardPoints(subject) {
            const entry = state.data.leaderboard[0];
            if (!entry) return;
            entry.points += 1;
            renderLeaderboard();
        }

        function formatSubject(subject) {
            if (!subject) return '';
            return subject
                .replace('-', ' ')
                .replace(/\b\w/g, (char) => char.toUpperCase());
        }

        function translateOption(option) {
            return option.translations[state.lang] || option.translations.en || '';
        }

        function translationIncludes(entry, field, query) {
            const translations = entry.translations || {};
            return Object.values(translations).some((pack) => {
                const value = (pack[field] || '').toLowerCase();
                return value.includes(query);
            });
        }

        function translateResource(entry, field) {
            const langPack = entry.translations || {};
            const preferred = langPack[state.lang] || langPack.en || {};
            return preferred[field] || '';
        }

        function getMergedContests() {
            const merged = ((state.data && state.data.contests) || []).map((contest) => ({
                ...contest,
                questionBanks: contest.questionBanks || [],
                examPapers: contest.examPapers || []
            }));
            (state.drafts.contests || []).forEach((draft) => {
                const existingIndex = merged.findIndex((contest) => contest.id === draft.id);
                if (existingIndex > -1) {
                    merged[existingIndex] = {
                        ...merged[existingIndex],
                        questionBanks: [...merged[existingIndex].questionBanks, ...(draft.questionBanks || [])],
                        examPapers: [...merged[existingIndex].examPapers, ...(draft.examPapers || [])]
                    };
                } else {
                    merged.push(draft);
                }
            });
            return merged;
        }

        function slugify(value) {
            return (value || '')
                .toString()
                .normalize('NFD')
                .replace(/[\u0300-\u036f]/g, '')
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, '-')
                .replace(/^-+|-+$/g, '');
        }

        function persistDrafts() {
            localStorage.setItem('scibridgeDrafts', JSON.stringify(state.drafts));
        }

        function loadDrafts() {
            try {
                const data = localStorage.getItem('scibridgeDrafts');
                return data ? JSON.parse(data) : { lessons: [], quizzes: [], dictionary: [], contests: [] };
            } catch (error) {
                return { lessons: [], quizzes: [], dictionary: [], contests: [] };
            }
        }
    });
})();
