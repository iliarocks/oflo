// Lowercase-only fractional indexing
const ALPHABET = "abcdefghijklmnopqrstuvwxyz" as const;
const BASE = ALPHABET.length;

function idx(ch: string): number {
  const i = ALPHABET.indexOf(ch);
  if (i < 0) throw new Error(`Invalid character "${ch}" (only a–z allowed)`);
  return i;
}

/**
 * Return the shortest key K such that prev < K < next (lexicographically).
 * - If prev is null, treat it as smaller than any key.
 * - If next is null, treat it as larger than any key.
 * Always uses only [a–z].
 */
export function keyBetween(prev: string | null, next: string | null): string {
  if (prev !== null && next !== null && prev >= next) {
    throw new Error(`Invalid bounds: ${prev} >= ${next}`);
  }

  const a = prev ?? ""; // low bound
  const b = next ?? ""; // high bound

  // Walk from left to right until there's "space" for a new digit.
  for (let i = 0; ; i++) {
    // Sentinels: a missing digit is -1 (below 'a'), b missing digit is BASE (above 'z')
    const aDigit = i < a.length ? idx(a[i]) : -1;
    const bDigit = i < b.length ? idx(b[i]) : BASE;

    // The open interval between them at this position is (aDigit, bDigit)
    const start = aDigit + 1;
    const end = bDigit - 1;

    if (start <= end) {
      // Choose the middle to keep room on both sides (you can pick `start` to be left-biased)
      const digit = Math.floor((start + end) / 2);
      return a.slice(0, i) + ALPHABET[digit];
    }

    // No room at this position → carry on to the next digit, preserving prefix.
    // This naturally handles cases like ("a", "b") → "am", ("az", "b") → "azm", etc.
  }
}

// Ergonomic helpers
export const keyAfter = (prev: string | null) => keyBetween(prev, null);
export const keyBefore = (next: string | null) => keyBetween(null, next);
