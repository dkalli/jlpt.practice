let currentWords = [];
let showFurigana = true;

async function loadLevel(level) {
  const res = await fetch(`data/${level}.json`);
  currentWords = res.ok ? await res.json() : [];
  renderWords();
  if (document.getElementById('quiz-area').style.display !== 'none') showQuizWord();
}

function renderWords() {
  const container = document.getElementById('word-list');
  container.innerHTML = '';

  if (currentWords.length === 0) {
    container.innerHTML = '<p style="color:#8a8a8a">아직 준비되지 않은 레벨이에요.</p>';
    return;
  }

  currentWords.forEach(item => {
    const card = document.createElement('div');
    card.className = 'word-card';

    const wordEl = document.createElement('span');
    wordEl.className = 'word';
    wordEl.textContent = item.word;

    const readingEl = document.createElement('span');
    readingEl.className = 'reading';
    readingEl.textContent = `(${item.reading})`;
    readingEl.style.display = showFurigana ? 'inline' : 'none';

    const meaningEl = document.createElement('span');
    meaningEl.className = 'meaning';
    meaningEl.textContent = item.meaning_ko;

    card.append(wordEl, readingEl, meaningEl);
    container.appendChild(card);
  });
}

document.querySelectorAll('#level-tabs button').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('#level-tabs button').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    loadLevel(btn.dataset.level);
  });
});

document.getElementById('furigana-toggle').addEventListener('change', (e) => {
  showFurigana = e.target.checked;
  renderWords();
  if (document.getElementById('quiz-area').style.display !== 'none') showQuizWord();
});

// --- 퀴즈 모드 ---
const wordListEl = document.getElementById('word-list');
const quizAreaEl = document.getElementById('quiz-area');
const quizModeBtn = document.getElementById('quiz-mode-btn');
let quizOn = false;
let currentQuizWord = null;

function showQuizWord() {
  if (currentWords.length === 0) return;
  currentQuizWord = currentWords[Math.floor(Math.random() * currentWords.length)];
  document.getElementById('quiz-word').textContent = currentQuizWord.word;
  document.getElementById('quiz-reading').textContent = showFurigana ? `(${currentQuizWord.reading})` : '';
  const meaningEl = document.getElementById('quiz-meaning');
  meaningEl.style.display = 'none';
  meaningEl.textContent = currentQuizWord.meaning_ko;
}

quizModeBtn.addEventListener('click', () => {
  quizOn = !quizOn;
  quizModeBtn.textContent = quizOn ? '목록 보기' : '퀴즈 모드';
  wordListEl.style.display = quizOn ? 'none' : 'grid';
  quizAreaEl.style.display = quizOn ? 'block' : 'none';
  if (quizOn) showQuizWord();
});

document.getElementById('quiz-reveal-btn').textContent = '정답 보기';
document.getElementById('quiz-next-btn').textContent = '다음 단어';

document.getElementById('quiz-reveal-btn').addEventListener('click', () => {
  document.getElementById('quiz-meaning').style.display = 'block';
});

document.getElementById('quiz-next-btn').addEventListener('click', showQuizWord);

loadLevel('n5');
