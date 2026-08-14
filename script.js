let currentWords = [];
let showFurigana = true;

async function loadLevel(level) {
  const res = await fetch(`data/${level}.json`);
  currentWords = res.ok ? await res.json() : [];
  renderWords();
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
});

loadLevel('n5');
