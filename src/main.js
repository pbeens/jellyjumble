import './style.css';
import { SIZE, START_MOVES, createBoard, findMatches, legalMoves, adjacent, trySwap, refill, matchScore } from './game.js';

const $ = selector => document.querySelector(selector);
const boardElement = $('#board');
const status = $('#status');
const restartButton = $('#restart-button');
const hintButton = $('#hint-button');
const help = $('#help-dialog');
const end = $('#end-dialog');
const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
const kinds = [
  { name: 'Rose cushion', light: '#f6b2bf', dark: '#dc7f98', shape: '<rect x="8" y="10" width="48" height="46" rx="17"/>' },
  { name: 'Tangerine flower', light: '#ffc58b', dark: '#e99c59', shape: '<path d="M32 6c7-5 14 3 13 9 10-1 15 10 9 16 7 8 0 18-9 18-3 11-15 12-20 5-10 4-18-5-15-14C0 35 4 22 13 20 12 9 25 4 32 6Z"/>' },
  { name: 'Lilac drop', light: '#c6b0e2', dark: '#9d81c4', shape: '<path d="M32 5C25 16 9 26 9 39a23 20 0 0 0 46 0C55 26 39 16 32 5Z"/>' },
  { name: 'Mint diamond', light: '#b8d5a3', dark: '#88b277', shape: '<path d="M24 9q8-8 16 0l15 15q8 8 0 16L40 55q-8 8-16 0L9 40q-8-8 0-16Z"/>' },
  { name: 'Blue pebble', light: '#a8cfdc', dark: '#77a9c0', shape: '<path d="M19 9q13-5 26 0 11 4 12 20l-2 15q-3 13-23 13T9 44L7 29Q8 13 19 9Z"/>' },
  { name: 'Lemon star', light: '#f4da85', dark: '#d9b658', shape: '<path d="M27 9q5-9 10 0l5 10 12 2q10 1 3 10l-8 9 1 13q1 9-9 5l-9-5-10 5q-9 4-8-5l1-13-9-9q-6-9 3-10l13-2Z"/>' },
];

function readSetting(key, fallback) {
  try { return localStorage.getItem(key) ?? fallback; } catch { return fallback; }
}
function saveSetting(key, value) {
  try { localStorage.setItem(key, String(value)); } catch { /* Play remains available without storage. */ }
}

let board, moves, score, selected = null, busy = false, focusIndex = 0;
let best = Math.max(0, Number(readSetting('jelly-best', '0')) || 0);
let roundBest = best;
let soundEnabled = readSetting('jelly-sound', 'off') === 'on';
let audio;
let hinted = [];
let pointer = null;
let suppressClick = false;
const cells = Array.from({ length: SIZE * SIZE }, (_, i) => {
  const cell = document.createElement('button');
  cell.type = 'button';
  cell.className = 'cell';
  cell.dataset.index = i;
  boardElement.append(cell);
  return cell;
});

function jelly(kind, index) {
  const { light, dark, shape } = kinds[kind];
  return `<svg viewBox="0 0 64 64" aria-hidden="true"><defs><linearGradient id="j${index}" x2=".25" y2="1"><stop stop-color="${light}"/><stop offset="1" stop-color="${dark}"/></linearGradient></defs><g fill="url(#j${index})" stroke="${dark}" stroke-width="1.4">${shape}</g><path d="M18 22q1-5 6-6" fill="none" stroke="#fff" stroke-width="4" stroke-linecap="round" opacity=".45"/><g fill="#53463e"><ellipse cx="24" cy="33" rx="2.1" ry="2.8"/><ellipse cx="40" cy="33" rx="2.1" ry="2.8"/></g><path d="M28 41q4 4 8 0" fill="none" stroke="#655046" stroke-width="1.8" stroke-linecap="round"/><g fill="#fff" opacity=".22"><ellipse cx="18" cy="39" rx="3.5" ry="2"/><ellipse cx="46" cy="39" rx="3.5" ry="2"/></g></svg>`;
}

function render() {
  cells.forEach((cell, i) => {
    cell.innerHTML = jelly(board[i], i);
    cell.classList.toggle('selected', selected === i);
    cell.classList.toggle('hinted', hinted.includes(i));
    cell.classList.remove('clearing');
    cell.setAttribute('aria-label', `${kinds[board[i]].name}, row ${Math.floor(i / SIZE) + 1}, column ${i % SIZE + 1}`);
    cell.setAttribute('aria-pressed', String(selected === i));
    cell.setAttribute('aria-disabled', String(busy || moves === 0));
    cell.tabIndex = i === focusIndex ? 0 : -1;
  });
  $('#score').textContent = score.toLocaleString();
  $('#moves').textContent = moves;
  $('#best').textContent = best.toLocaleString();
  $('#move-progress').style.width = `${moves / START_MOVES * 100}%`;
  boardElement.setAttribute('aria-busy', String(busy));
  restartButton.disabled = busy;
  hintButton.disabled = busy || moves === 0;
}

function updateSound() {
  $('#sound-button').setAttribute('aria-pressed', String(soundEnabled));
  $('#sound-button').setAttribute('aria-label', soundEnabled ? 'Turn sound off' : 'Turn sound on');
  $('#sound-label').textContent = soundEnabled ? 'Sound on' : 'Sound off';
  $('#sound-icon').textContent = soundEnabled ? '♫' : '♪';
}

function prepareAudio() {
  if (!soundEnabled) return;
  try {
    const Audio = window.AudioContext || window.webkitAudioContext;
    if (!Audio) return;
    audio ??= new Audio();
    if (audio.state === 'suspended') audio.resume().catch(() => {});
  } catch { /* Audio is optional. */ }
}

function tone(chain = 1, invalid = false) {
  if (!soundEnabled || !audio || audio.state !== 'running') return;
  try {
    const now = audio.currentTime;
    const pitches = invalid ? [180] : [392, 494, 587];
    pitches.forEach((frequency, i) => {
      const oscillator = audio.createOscillator();
      const gain = audio.createGain();
      oscillator.type = 'sine';
      oscillator.frequency.value = frequency * (1 + Math.min(chain - 1, 6) * .12);
      gain.gain.setValueAtTime(0, now + i * .055);
      gain.gain.linearRampToValueAtTime(.045, now + i * .055 + .01);
      gain.gain.exponentialRampToValueAtTime(.001, now + i * .055 + .22);
      oscillator.connect(gain).connect(audio.destination);
      oscillator.start(now + i * .055);
      oscillator.stop(now + i * .055 + .24);
      oscillator.onended = () => { oscillator.disconnect(); gain.disconnect(); };
    });
  } catch { /* A blocked sound must never interrupt a round. */ }
}

function wait(ms) { return new Promise(resolve => setTimeout(resolve, reducedMotion.matches ? 0 : ms)); }

async function animateSwap(a, b) {
  const first = cells[a].getBoundingClientRect();
  const second = cells[b].getBoundingClientRect();
  const x = second.x - first.x, y = second.y - first.y;
  await Promise.all([[a, x, y], [b, -x, -y]].map(([i, dx, dy]) =>
    cells[i].firstElementChild.animate([{ transform: 'translate(0,0)' }, { transform: `translate(${dx}px,${dy}px)` }],
      { duration: reducedMotion.matches ? 0 : 180, easing: 'ease-in-out', fill: 'forwards' }).finished));
}

async function move(a, b) {
  if (busy || moves === 0 || !adjacent(a, b)) return;
  prepareAudio();
  busy = true; selected = null; hinted = [];
  render();
  const next = trySwap(board, a, b);
  await animateSwap(a, b);
  if (!next) {
    tone(1, true);
    // Redraw at swapped positions, then animate back without changing the board.
    cells[a].innerHTML = jelly(board[b], a);
    cells[b].innerHTML = jelly(board[a], b);
    await animateSwap(a, b);
    status.textContent = 'Almost! Make a line of 3. No move lost.';
    busy = false; render();
    return;
  }
  board = next; moves--;
  let chain = 0;
  let earned = 0;
  let matches = findMatches(board);
  while (matches.size) {
    chain++;
    const points = matchScore(matches.size, chain);
    score += points; earned += points;
    best = Math.max(best, score);
    render();
    matches.forEach(i => cells[i].classList.add('clearing'));
    status.textContent = chain > 1 ? `Happy chain ×${chain}! +${points} points` : `A sweet little match! +${points} points`;
    tone(chain);
    await wait(240);
    const result = refill(board, matches);
    board = result.board;
    render();
    const step = cells[0].getBoundingClientRect().height + parseFloat(getComputedStyle(boardElement).gap);
    await Promise.all(result.falls.map((distance, i) => distance ? cells[i].firstElementChild.animate([
      { transform: `translateY(${-distance * step}px)`, opacity: .2 },
      { transform: 'translateY(0)', opacity: 1 },
    ], { duration: reducedMotion.matches ? 0 : 270, easing: 'cubic-bezier(.2,.7,.4,1)' }).finished : Promise.resolve()));
    matches = findMatches(board);
    if (chain >= 50 && matches.size) { board = createBoard(); break; }
  }
  saveSetting('jelly-best', best);
  $('#score-caption').textContent = score > roundBest ? 'A new personal best. Look at you!' : 'Every match is a little win.';
  status.textContent = chain > 1 ? `${chain} lovely matches. +${earned} points!` : `+${earned} points. A little win looks good on you.`;
  if (moves > 0 && !legalMoves(board).length) {
    status.textContent = 'A fresh little mix — no moves lost.';
    await wait(500);
    board = createBoard();
  }
  busy = false;
  render();
  if (moves === 0) {
    status.textContent = `Round complete! ${score.toLocaleString()} points. Start fresh to play again.`;
    $('#end-score').textContent = score.toLocaleString();
    $('#end-message').textContent = score > roundBest ? 'Your new personal best. A very sweet achievement!' : 'Ready for another happy jumble?';
    if (help.open) help.close();
    end.showModal();
  }
}

function select(i) {
  if (busy || moves === 0) return;
  prepareAudio();
  focusIndex = i;
  hinted = [];
  if (selected === i) { selected = null; render(); return; }
  if (selected !== null && adjacent(selected, i)) { void move(selected, i); return; }
  selected = i;
  status.textContent = 'Now pick a neighbor to make a match.';
  render();
}

function restart() {
  if (busy) return;
  if (end.open) end.close();
  board = createBoard(); moves = START_MOVES; score = 0;
  selected = null; hinted = []; focusIndex = 0; roundBest = best;
  $('#score-caption').textContent = 'Every match is a little win.';
  status.textContent = 'Pick a jelly. Find its happy place.';
  render();
}

boardElement.addEventListener('click', event => {
  const cell = event.target.closest('.cell');
  if (cell && !suppressClick) select(Number(cell.dataset.index));
});
boardElement.addEventListener('keydown', event => {
  const cell = event.target.closest('.cell');
  if (!cell) return;
  const i = Number(cell.dataset.index);
  const directions = { ArrowLeft: -1, ArrowRight: 1, ArrowUp: -SIZE, ArrowDown: SIZE };
  if (event.key in directions) {
    event.preventDefault();
    const next = i + directions[event.key];
    if (adjacent(i, next)) {
      focusIndex = next;
      cells.forEach((button, j) => { button.tabIndex = j === next ? 0 : -1; });
      cells[next].focus();
    }
  } else if (event.key === 'Escape') { selected = null; hinted = []; render(); }
});
boardElement.addEventListener('pointerdown', event => {
  const cell = event.target.closest('.cell');
  if (!cell || busy || moves === 0 || !event.isPrimary || event.button !== 0) return;
  pointer = { index: Number(cell.dataset.index), x: event.clientX, y: event.clientY, id: event.pointerId };
  cell.setPointerCapture(event.pointerId);
});
boardElement.addEventListener('pointerup', event => {
  if (!pointer || pointer.id !== event.pointerId) return;
  const { index, x, y } = pointer;
  pointer = null;
  const dx = event.clientX - x, dy = event.clientY - y;
  if (Math.max(Math.abs(dx), Math.abs(dy)) < 18) return;
  suppressClick = true;
  setTimeout(() => { suppressClick = false; }, 0);
  const to = index + (Math.abs(dx) > Math.abs(dy) ? Math.sign(dx) : Math.sign(dy) * SIZE);
  if (adjacent(index, to)) void move(index, to);
});
boardElement.addEventListener('pointercancel', () => { pointer = null; });
hintButton.addEventListener('click', () => {
  if (busy || moves === 0) return;
  selected = null;
  hinted = legalMoves(board)[0] ?? [];
  status.textContent = 'Try swapping the two outlined jellies.';
  render();
});
restartButton.addEventListener('click', restart);
$('#play-again').addEventListener('click', () => { restart(); cells[0].focus(); });
$('#view-board').addEventListener('click', () => { end.close(); restartButton.focus(); });
$('#sound-button').addEventListener('click', () => {
  soundEnabled = !soundEnabled;
  saveSetting('jelly-sound', soundEnabled ? 'on' : 'off');
  prepareAudio(); updateSound(); tone();
});
$('#help-button').addEventListener('click', () => help.showModal());
$('#close-help').addEventListener('click', () => help.close());
$('#play-button').addEventListener('click', () => { help.close(); cells[focusIndex].focus(); });
for (const dialog of [help, end]) dialog.addEventListener('click', event => {
  const rect = dialog.getBoundingClientRect();
  if (event.target === dialog && (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom)) dialog.close();
});

updateSound();
restart();
