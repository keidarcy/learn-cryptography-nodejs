/**
 * Convert alphabet text to binary string.
 * @example
 *  'a' => '01100001'
 * @param text - alphabet text
 * @returns converted binary string.
 */
export function textToBin(text: string): string {
  let bin = '';
  for (let i = 0; i < text.length; i++) {
    const ascii = text[i].charCodeAt(0);
    // bin += ascii.toString(2);
    bin += '0'.repeat(8 - numToBinStr(ascii).length) + numToBinStr(ascii);
  }
  return bin;
}

function numToBinStr(num: number): string {
  if (num === 0) return '0';
  if (num === 1) return '1';
  return numToBinStr(Math.floor(num / 2)) + (num % 2);
}

if (import.meta.vitest) {
  const { it, expect } = import.meta.vitest;
  it('GIVEN a get binary 01100001', () => {
    expect(textToBin('a')).toBe('01100001');
  });

  it('GIVE TEST get binary 01010100010001010101001101010100', () => {
    expect(textToBin('TEST')).toBe('01010100010001010101001101010100');
  });
}
