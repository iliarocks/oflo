// Custom fractional indexing with lowercase alphabet only
const ALPHABET = "abcdefghijklmnopqrstuvwxyz";
const BASE = ALPHABET.length;

function toNumber(str: string): number[] {
  return str.split('').map(char => ALPHABET.indexOf(char));
}

function toString(nums: number[]): string {
  return nums.map(n => ALPHABET[n]).join('');
}

function midpoint(a: string, b: string | null): string {
  // Ensure a < b lexicographically
  if (b && a >= b) {
    throw new Error(`Invalid: ${a} >= ${b}`);
  }

  // Pad strings to same length
  const maxLen = Math.max(a.length, b?.length || 0) + 1;
  const aPadded = a.padEnd(maxLen, ALPHABET[0]);
  const bPadded = b ? b.padEnd(maxLen, ALPHABET[0]) : ALPHABET[BASE - 1].repeat(maxLen);

  // Convert to numbers
  const aNums = toNumber(aPadded);
  const bNums = toNumber(bPadded);

  // Find midpoint
  const result: number[] = [];
  let carry = 0;
  
  for (let i = maxLen - 1; i >= 0; i--) {
    const sum = aNums[i] + bNums[i] + carry * BASE;
    result.unshift(Math.floor(sum / 2));
    carry = sum % 2;
  }

  // Convert back and trim trailing 'a's (zeros)
  let resultStr = toString(result);
  while (resultStr.length > 1 && resultStr.endsWith(ALPHABET[0])) {
    resultStr = resultStr.slice(0, -1);
  }

  return resultStr;
}

/**
 * Generate a fractional index between two positions
 * @param a - Lower position (null for beginning)
 * @param b - Upper position (null for end)
 * @returns Position string using only lowercase letters
 */
export function generateKeyBetween(a: string | null, b: string | null): string {
  // Beginning of list
  if (!a && !b) {
    return 'm'; // middle of alphabet
  }

  // Insert at beginning
  if (!a) {
    if (b![0] <= 'b') {
      return ALPHABET[0] + 'm'; // 'am'
    }
    // Find midpoint between start and b
    const mid = Math.floor(ALPHABET.indexOf(b![0]) / 2);
    return ALPHABET[mid];
  }

  // Insert at end
  if (!b) {
    // Simply append a middle character
    return a + 'm';
  }

  // Insert between two positions
  // Check if we can just insert something between them
  if (a < b) {
    // Try appending to a
    const testKey = a + 'm';
    if (testKey < b) {
      return testKey;
    }
    
    // Find a key between a and b
    // Simple approach: find common prefix and diverge
    let i = 0;
    while (i < a.length && i < b.length && a[i] === b[i]) {
      i++;
    }
    
    if (i < a.length && i < b.length) {
      const aChar = ALPHABET.indexOf(a[i]);
      const bChar = ALPHABET.indexOf(b[i]);
      if (bChar - aChar > 1) {
        const midChar = Math.floor((aChar + bChar) / 2);
        return a.slice(0, i) + ALPHABET[midChar];
      }
    }
    
    // If we can't find a simple solution, append to a
    return a + 'b';
  }
  
  throw new Error(`Invalid: ${a} >= ${b}`);
}

// Simpler version using just incrementing
export function generateSimpleKey(prev: string | null, next: string | null): string {
  if (!prev && !next) return 'n';
  
  if (!prev) {
    // Generate before next
    if (!next || next[0] > 'b') {
      return 'b';
    }
    // Find a string that comes before next
    let result = '';
    for (let i = 0; i < next.length; i++) {
      const charIndex = ALPHABET.indexOf(next[i]);
      if (charIndex > 0) {
        result += next.slice(0, i) + ALPHABET[charIndex - 1] + 'n';
        break;
      }
      result += 'a';
    }
    return result || 'a';
  }
  
  if (!next) {
    // Generate after prev
    return prev + 'n';
  }
  
  // Between two keys - find midpoint
  if (prev >= next) {
    throw new Error(`Invalid: ${prev} >= ${next}`);
  }
  
  // Simple approach: append to prev if possible
  const testKey = prev + 'n';
  if (testKey < next) {
    return testKey;
  }
  
  // Otherwise find actual midpoint
  return midpoint(prev, next);
}

// Export the simple version as default
export default generateSimpleKey;