// app.js
// Shared site JS for navigation, MCQ rendering, interactivity, search/filter/pagination.
// IIFE to avoid global pollution.
(function () {
  'use strict';

  /* ---------- Utilities ---------- */
  function q(selector, ctx) { return (ctx || document).querySelector(selector); }
  function qa(selector, ctx) { return Array.from((ctx || document).querySelectorAll(selector)); }
  function el(tag, attrs = {}, children = []) {
    const node = document.createElement(tag);
    Object.entries(attrs).forEach(([k,v]) => {
      if (k === 'class') node.className = v;
      else if (k === 'text') node.textContent = v;
      else node.setAttribute(k, v);
    });
    (Array.isArray(children) ? children : [children]).forEach(c => {
      if (!c) return;
      node.appendChild(typeof c === 'string' ? document.createTextNode(c) : c);
    });
    return node;
  }

  // Simple aria-live announcer
  const announcer = (function () {
    const region = document.createElement('div');
    region.setAttribute('aria-live', 'polite');
    region.className = 'sr-only';
    document.body.appendChild(region);
    return {
      announce(msg) { region.textContent = msg; }
    };
  })();

  // Set footer years
  document.querySelectorAll('#year, #year2, #year3').forEach(elm => {
    if (elm) elm.textContent = new Date().getFullYear();
  });

  /* ---------- Navigation toggle (accessible) ---------- */
  function initNav(toggleId, listId) {
    const toggle = q(toggleId ? '#' + toggleId : '.nav-toggle');
    const list = q(listId ? '#' + listId : '.nav-list');
    if (!toggle || !list) return;

    toggle.addEventListener('click', () => {
      const expanded = toggle.getAttribute('aria-expanded') === 'true';
      toggle.setAttribute('aria-expanded', String(!expanded));
      list.style.display = expanded ? '' : 'flex';
      // Focus first link when opening for keyboard users
      if (!expanded) {
        const first = list.querySelector('a');
        if (first) first.focus();
      }
    });
  }

  initNav('navToggle', 'navList');
  initNav('navToggle2', 'navList2');
  initNav('navToggle3', 'navList3');

  /* ---------- Typed Hero (minimal JS + CSS) ---------- */
  function initHeroTyped() {
    const typedEl = q('.typed');
    if (!typedEl) return;
    const lines = ['Master in Python', 'Learn basic to advanced'];
    let idx = 0;
    // Simple cycle every 3.5s
    function showLine(i) {
      typedEl.textContent = lines[i];
    }
    showLine(0);
    let timer = setInterval(() => {
      idx = (idx + 1) % lines.length;
      showLine(idx);
    }, 3500);

    // Respect reduced motion
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      clearInterval(timer);
    }
  }
  initHeroTyped();

  /* ---------- Course card keyboard/link behavior ---------- */
  (function wireCourseCard(){
    const card = q('.course-card');
    if (!card) return;
    const href = card.dataset.href || 'python.html';
    card.addEventListener('click', () => { window.location.href = href; });
    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); window.location.href = href; }
    });
    // Handy: make inner Open Course link focusable
  })();

  /* ---------- MCQ rendering & interaction (used on index and python) ---------- */

  // Render a list of question objects into a container element.
  // Each question object: {id, topic, difficulty, question, choices[], answerIndex, explanation}
  function renderMCQs(container, questions, opts = {}) {
    container.innerHTML = '';
    questions.forEach(qobj => {
      const card = el('section', { class: 'question-card', tabindex:0, 'data-id': qobj.id });
      const head = el('div', { class: 'q-head' }, [
        el('strong', { text: `Q${qobj.id}: ${qobj.question}` }),
        el('span', { class: 'q-meta', text: `${qobj.topic} · ${qobj.difficulty}` })
      ]);
      card.appendChild(head);

      const options = el('div', { class: 'options', role: 'list' });
      // Track attempts for hint logic
      let attempts = 0;
      qobj.choices.forEach((choiceText, idx) => {
        const opt = el('div', {
          class: 'option',
          role: 'button',
          tabindex: 0,
          'data-index': idx,
          'aria-pressed': 'false'
        }, choiceText);
        // Handle selection
        function handleSelect() {
          attempts++;
          // If already answered correctly, do nothing
          if (card.getAttribute('data-answered') === 'true') return;
          if (idx === qobj.answerIndex) {
            opt.classList.add('correct');
            // Mark others as inactive
            qa('.option', options).forEach(o => o.setAttribute('aria-disabled', 'true'));
            card.setAttribute('data-answered', 'true');
            // show explanation
            const ex = el('div', { class: 'explanation', role: 'region', 'aria-live': 'polite' }, [
              el('strong', { text: 'Answer: ' + qobj.choices[qobj.answerIndex] }),
              el('div', { text: qobj.explanation })
            ]);
            // Tick icon (subtle)
            const tick = document.createElement('span');
            tick.setAttribute('aria-hidden','true');
            tick.style.marginLeft = '8px';
            tick.textContent = ' ✓';
            opt.appendChild(tick);
            card.appendChild(ex);
            announcer.announce(`Question ${qobj.id}: correct`);
          } else {
            opt.classList.add('incorrect');
            // brief shake visual; allow retry
            setTimeout(() => opt.classList.remove('incorrect'), 600);
            announcer.announce(`Question ${qobj.id}: incorrect`);
            // After two wrong attempts show hint
            if (attempts >= 2 && !card.querySelector('.hint')) {
              const hint = el('div', { class: 'explanation hint', text: 'Hint: review basics related to ' + qobj.topic + '.' });
              card.appendChild(hint);
            }
          }
        }
        // click & keyboard
        opt.addEventListener('click', handleSelect);
        opt.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); handleSelect(); } });
        options.appendChild(opt);
      });

      // Show Answer button
      const controls = el('div', { style: 'margin-top:.5rem; display:flex; gap:.5rem; align-items:center' });
      const showBtn = el('button', { class: 'btn', type: 'button', text: 'Show Answer' });
      showBtn.addEventListener('click', () => {
        if (card.getAttribute('data-answered') === 'true') return;
        // Reveal correct
        const correctOpt = options.querySelector(`.option[data-index="${qobj.answerIndex}"]`);
        if (correctOpt) {
          correctOpt.classList.add('correct');
          card.setAttribute('data-answered','true');
          // explanation
          const ex = el('div', { class: 'explanation', role: 'region', 'aria-live': 'polite' }, [
            el('strong', { text: 'Answer: ' + qobj.choices[qobj.answerIndex] }),
            el('div', { text: qobj.explanation })
          ]);
          card.appendChild(ex);
          announcer.announce(`Question ${qobj.id}: answer revealed`);
        }
      });
      controls.appendChild(showBtn);

      card.appendChild(options);
      card.appendChild(controls);
      container.appendChild(card);
    });
  }

  /* ---------- Home page: render embedded 20 questions ---------- */
  function initHome() {
    const script = q('#home-questions');
    const container = q('#homeQuiz');
    if (!script || !container) return;
    try {
      const data = JSON.parse(script.textContent);
      renderMCQs(container, data);
    } catch (err) {
      container.innerHTML = '<p class="muted">Failed to load sample questions.</p>';
      console.error(err);
    }
  }

  /* ---------- Python page: fetch questions.json, provide search/filter/pagination ---------- */
  function initPython() {
    const listEl = q('#questionList');
    const searchInput = q('#searchInput');
    const filterTopic = q('#filterTopic');
    const filterDifficulty = q('#filterDifficulty');
    const prevBtn = q('#prevPage');
    const nextBtn = q('#nextPage');
    const pageInfo = q('#pageInfo');
    const progressText = q('#progressText');

    if (!listEl) return;

    // Pagination settings
    const PAGE_SIZE = 50;
    let allQuestions = [];
    let filtered = [];
    let page = 1;

    function updateTopicsSelect() {
      const topics = Array.from(new Set(allQuestions.map(q => q.topic))).sort();
      filterTopic.innerHTML = '<option value="">All topics</option>' + topics.map(t => `<option value="${t}">${t}</option>`).join('');
    }

    function applyFilters() {
      const s = searchInput.value.trim().toLowerCase();
      const topic = filterTopic.value;
      const difficulty = filterDifficulty.value;
      filtered = allQuestions.filter(q => {
        if (topic && q.topic !== topic) return false;
        if (difficulty && q.difficulty !== difficulty) return false;
        if (s) {
          return (q.question && q.question.toLowerCase().includes(s)) ||
                 (q.topic && q.topic.toLowerCase().includes(s));
        }
        return true;
      });
      page = 1;
      renderPage();
    }

    function renderPage() {
      const total = filtered.length;
      const start = (page - 1) * PAGE_SIZE;
      const end = Math.min(total, start + PAGE_SIZE);
      const toShow = filtered.slice(start, end);
      listEl.innerHTML = '';
      if (toShow.length === 0) {
        listEl.innerHTML = '<p class="muted">No questions match your filters.</p>';
      } else {
        renderMCQs(listEl, toShow);
      }
      pageInfo.textContent = `Showing ${start + 1}–${end} of ${total}`;
      prevBtn.disabled = page === 1;
      nextBtn.disabled = end >= total;
      progressText.textContent = `Showing ${start + 1}–${end} of ${total} questions`;
    }

    prevBtn.addEventListener('click', () => { if (page > 1) { page--; renderPage(); } });
    nextBtn.addEventListener('click', () => { page++; renderPage(); });

    // wire search & filters (debounced input)
    let searchTimer = null;
    searchInput.addEventListener('input', () => {
      clearTimeout(searchTimer);
      searchTimer = setTimeout(applyFilters, 220);
    });
    filterTopic.addEventListener('change', applyFilters);
    filterDifficulty.addEventListener('change', applyFilters);

    // Fetch questions.json
    fetch('questions.json')
      .then(resp => {
        if (!resp.ok) throw new Error('Network response not ok');
        return resp.json();
      })
      .then(data => {
        allQuestions = Array.isArray(data) ? data : [];
        // Ensure id order
        allQuestions.sort((a,b) => a.id - b.id);
        updateTopicsSelect();
        filtered = allQuestions.slice();
        renderPage();
      })
      .catch(err => {
        listEl.innerHTML = '<p class="muted">Failed to load questions. Please check questions.json is available.</p>';
        console.error(err);
      });
  }

  /* ---------- Entry point (decide which page to init) ---------- */
  document.addEventListener('DOMContentLoaded', () => {
    const page = document.body.getAttribute('data-page');
    if (page === 'index') initHome();
    if (page === 'python') initPython();
  });

})();
