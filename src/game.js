export const SIZE = 8;
export const KINDS = 6;
export const START_MOVES = 20;

export function adjacent(a, b) {
  return Number.isInteger(a) && Number.isInteger(b) && a >= 0 && b >= 0 &&
    a < SIZE * SIZE && b < SIZE * SIZE &&
    Math.abs(Math.floor(a / SIZE) - Math.floor(b / SIZE)) +
    Math.abs(a % SIZE - b % SIZE) === 1;
}

export function swap(board, a, b) {
  const next = [...board];
  [next[a], next[b]] = [next[b], next[a]];
  return next;
}

export function findMatches(board) {
  const matches = new Set();
  for (let row = 0; row < SIZE; row++) {
    for (let col = 0; col < SIZE; col++) {
      const i = row * SIZE + col;
      if (board[i] == null) continue;
      for (const step of [1, SIZE]) {
        if (step === 1 && col > SIZE - 3) continue;
        if (step === SIZE && row > SIZE - 3) continue;
        if (board[i] === board[i + step] && board[i] === board[i + step * 2]) {
          matches.add(i).add(i + step).add(i + step * 2);
        }
      }
    }
  }
  return matches;
}

export function trySwap(board, a, b) {
  if (!adjacent(a, b)) return null;
  const next = swap(board, a, b);
  const matches = findMatches(next);
  return matches.has(a) || matches.has(b) ? next : null;
}

export function legalMoves(board) {
  const moves = [];
  for (let i = 0; i < board.length; i++) {
    for (const j of [i + 1, i + SIZE]) {
      if (adjacent(i, j) && trySwap(board, i, j)) moves.push([i, j]);
    }
  }
  return moves;
}

export function createBoard(random = Math.random) {
  for (let attempt = 0; attempt < 100; attempt++) {
    const board = [];
    for (let i = 0; i < SIZE * SIZE; i++) {
      const allowed = Array.from({ length: KINDS }, (_, kind) => kind).filter(kind =>
        !(i % SIZE >= 2 && board[i - 1] === kind && board[i - 2] === kind) &&
        !(i >= SIZE * 2 && board[i - SIZE] === kind && board[i - SIZE * 2] === kind));
      board.push(allowed[Math.min(allowed.length - 1, Math.floor(random() * allowed.length))]);
    }
    if (legalMoves(board).length) return board;
  }
  // Even a degenerate random source must produce a playable board.
  const board = Array.from({ length: SIZE * SIZE }, (_, i) => (i % SIZE + Math.floor(i / SIZE)) % KINDS);
  board[0] = 0; board[1] = 1; board[2] = 0; board[SIZE + 1] = 0;
  return board;
}

export function refill(board, cleared, random = Math.random) {
  const next = Array(SIZE * SIZE);
  const falls = Array(SIZE * SIZE).fill(0);
  for (let col = 0; col < SIZE; col++) {
    let target = SIZE - 1;
    for (let row = SIZE - 1; row >= 0; row--) {
      const from = row * SIZE + col;
      if (!cleared.has(from)) {
        const to = target * SIZE + col;
        next[to] = board[from];
        falls[to] = target - row;
        target--;
      }
    }
    const count = target + 1;
    for (; target >= 0; target--) {
      const to = target * SIZE + col;
      next[to] = Math.min(KINDS - 1, Math.floor(random() * KINDS));
      falls[to] = count;
    }
  }
  return { board: next, falls };
}

export function matchScore(count, cascade) {
  return count * 10 * cascade;
}
