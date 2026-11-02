import test from 'node:test';
import assert from 'node:assert/strict';
import { SIZE, KINDS, adjacent, swap, createBoard, findMatches, trySwap, legalMoves, refill, matchScore } from './game.js';

function seeded(seed) {
  return () => { seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0; return seed / 4294967296; };
}
const quietBoard = () => Array.from({ length: SIZE * SIZE }, (_, i) => (i % SIZE + Math.floor(i / SIZE)) % KINDS);

test('starting boards have 64 valid pieces, no existing matches, and legal moves', () => {
  const random = seeded(82);
  for (let i = 0; i < 500; i++) {
    const board = createBoard(random);
    assert.equal(board.length, 64);
    assert.ok(board.every(piece => Number.isInteger(piece) && piece >= 0 && piece < KINDS));
    assert.equal(findMatches(board).size, 0);
    assert.ok(legalMoves(board).length > 0);
  }
});

test('even constant random sources yield playable initial boards', () => {
  for (const random of [() => 0, () => .999999]) {
    const board = createBoard(random);
    assert.equal(findMatches(board).size, 0);
    assert.ok(legalMoves(board).length > 0);
  }
});

test('adjacency rejects wrapping, diagonals, and out-of-range positions', () => {
  assert.equal(adjacent(0, 1), true);
  assert.equal(adjacent(0, 8), true);
  for (const pair of [[7, 8], [0, 9], [-1, 0], [63, 64], [0, 0], [0, 1.5]]) {
    assert.equal(adjacent(...pair), false);
  }
});

test('matching detects long horizontal and vertical lines without double-counting intersections', () => {
  const board = quietBoard();
  for (let col = 1; col <= 5; col++) board[3 * SIZE + col] = 5;
  for (let row = 1; row <= 5; row++) board[row * SIZE + 3] = 5;
  const expected = new Set([25, 26, 27, 28, 29, 11, 19, 35, 43]);
  assert.deepEqual(findMatches(board), expected);
});

test('matches cannot cross row boundaries', () => {
  const board = quietBoard();
  board[7] = board[8] = board[9] = 5;
  assert.equal(findMatches(board).size, 0);
});

test('invalid swaps preserve input; legal swaps create a match', () => {
  const board = createBoard(seeded(17));
  const original = [...board];
  const [a, b] = legalMoves(board)[0];
  const next = trySwap(board, a, b);
  assert.ok(findMatches(next).size >= 3);
  assert.deepEqual(board, original);
  assert.equal(trySwap(board, 7, 8), null);
  let checkedInvalid = false;
  for (let i = 0; i < 63; i++) {
    if (adjacent(i, i + 1) && findMatches(swap(board, i, i + 1)).size === 0) {
      assert.equal(trySwap(board, i, i + 1), null);
      checkedInvalid = true;
      break;
    }
  }
  assert.ok(checkedInvalid);
});

test('gravity preserves surviving order, fills gaps, and leaves other columns untouched', () => {
  const board = quietBoard();
  const original = [...board];
  const cleared = new Set([3 * SIZE + 2, 5 * SIZE + 2]);
  const result = refill(board, cleared, () => .99);
  const actual = Array.from({ length: SIZE }, (_, row) => result.board[row * SIZE + 2]);
  const survivors = Array.from({ length: SIZE }, (_, row) => row * SIZE + 2)
    .filter(i => !cleared.has(i)).map(i => board[i]);
  assert.deepEqual(actual, [5, 5, ...survivors]);
  assert.equal(result.falls[2], 2);
  assert.equal(result.falls[4 * SIZE + 2], 2);
  for (let i = 0; i < board.length; i++) if (i % SIZE !== 2) assert.equal(result.board[i], board[i]);
  assert.deepEqual(board, original);
});

test('cascade scores apply the chain multiplier', () => {
  assert.equal(matchScore(3, 1), 30);
  assert.equal(matchScore(4, 2), 80);
  assert.equal(matchScore(5, 3), 150);
});

test('100 complete seeded rounds resolve cascades into stable, playable boards', () => {
  const random = seeded(125);
  for (let round = 0; round < 100; round++) {
    let board = createBoard(random);
    for (let move = 0; move < 20; move++) {
      let options = legalMoves(board);
      if (!options.length) { board = createBoard(random); options = legalMoves(board); }
      const [a, b] = options[Math.floor(random() * options.length)];
      board = trySwap(board, a, b);
      let matches = findMatches(board), chain = 0;
      while (matches.size) {
        assert.ok(++chain < 50, 'cascade resolves within a reasonable limit');
        board = refill(board, matches, random).board;
        assert.ok(board.every(value => Number.isInteger(value) && value >= 0 && value < KINDS));
        matches = findMatches(board);
      }
      assert.equal(findMatches(board).size, 0);
    }
  }
});
