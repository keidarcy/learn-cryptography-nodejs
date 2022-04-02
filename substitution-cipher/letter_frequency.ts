const alphabet = Array(26)
  .fill(0)
  .map((_, index) => String.fromCharCode(index + 97));

const standardLetterFrequency = {
  e: 0.127,
  t: 0.0906,
  a: 0.0817,
  o: 0.0751,
  i: 0.0697,
  n: 0.0675,
  s: 0.0633,
  h: 0.0609,
  r: 0.0599,
  d: 0.0425,
  l: 0.0403,
  c: 0.0278,
  u: 0.0276,
  m: 0.0241,
  w: 0.0236,
  f: 0.0223,
  g: 0.0202,
  y: 0.0197,
  p: 0.0193,
  b: 0.015,
  v: 0.0098,
  k: 0.0077,
  j: 0.0015,
  x: 0.0015,
  q: 0.001,
  z: 0.0007,
};

type LetterFrequency = Record<string, number>;

/**
 * Calculate cipher letter frequency.
 * @see {@link https://en.wikipedia.org/wiki/Letter_frequency}
 * @param cipher - cipher string
 * @returns letter frequency of current cipher.
 */
function cipherFrequency(cipher: string): LetterFrequency {
  const map = new Map<string, number>();
  let count = 0;
  for (let index = 0; index < cipher.length; index++) {
    const letter = cipher[index];
    if (alphabet.includes(letter)) {
      map.set(letter, map.has(letter) ? map.get(letter) + 1 : 1);
      count++;
    }
  }

  const result = Object.entries(Object.fromEntries(map))
    .sort(([, a], [, b]) => b - a)
    .reduce((acc, curr) => ({ ...acc, [curr[0]]: curr[1] / count }), {});
  return result;
}

/**
 * Guess cipher based on letter frequency.
 * @param cipher - cipher string
 * @returns guessed result message.
 */
function guess(cipher: string): string {
  const letterFrequency = cipherFrequency(cipher);
  const letterArr = Object.entries(letterFrequency)
    .sort(([, a], [, b]) => b - a)
    .map(([letter]) => letter);
  const standardLetterArr = Object.entries(standardLetterFrequency)
    .sort(([, a], [, b]) => b - a)
    .map(([letter]) => letter);

  let result = '';

  for (let index = 0; index < cipher.length; index++) {
    const indexOfCipherLetter = letterArr.indexOf(cipher[index]);
    result +=
      indexOfCipherLetter === -1 ? cipher[index] : standardLetterArr[indexOfCipherLetter];
  }
  return result;
}

if (import.meta.vitest) {
  const { it, expect } = import.meta.vitest;
  const sampleCipher = `lrvmnir bpr sumvbwvr jx bpr lmiwv yjeryrkbi jx qmbm wi
bpr xjvni mkd ymibrut jx irhx wi bpr riirkvr jx
ymbinlmtmipw utn qmumbr dj w ipmhh but bj rhnvwdmbr bpr
yjeryrkbi jx bpr qmbm mvvjudwko bj yt wkbrusurbmbwjk
lmird jk xjubt trmui jx ibndt
  wb wi kjb mk rmit bmiq bj rashmwk rmvp yjeryrkb mkd wbi
iwokwxwvmkvr mkd ijyr ynib urymwk nkrashmwkrd bj ower m
vjyshrbr rashmkmbwjk jkr cjnhd pmer bj lr fnmhwxwrd mkd
wkiswurd bj invp mk rabrkb bpmb pr vjnhd urmvp bpr ibmbr
jx rkhwopbrkrd ywkd vmsmlhr jx urvjokwgwko ijnkdhrii
ijnkd mkd ipmsrhrii ipmsr w dj kjb drry ytirhx bpr xwkmh
mnbpjuwbt lnb yt rasruwrkvr cwbp qmbm pmi hrxb kj djnlb
bpmb bpr xjhhjcwko wi bpr sujsru msshwvmbwjk mkd
wkbrusurbmbwjk w jxxru yt bprjuwri wk bpr pjsr bpmb bpr
riirkvr jx jqwkmcmk qmumbr cwhh urymwk wkbmvb`;
  const guessed = guess(sampleCipher);
  it('WILL contains some basic English words', () => {
    expect(guessed).toContain('the');
    expect(guessed).toContain('that');
  });
}
