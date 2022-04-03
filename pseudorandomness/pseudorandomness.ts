/**
 * PRNG - Pseudorandom number generator
 * - Mersenne Twister
 * - Linear congruential generator (LCG)
 * @see {@link https://en.wikipedia.org/wiki/Pseudorandomness | pseudorandom}
 * @see {@link https://en.wikipedia.org/wiki/Linear_congruential_generator | LCG}
 * @see {@link https://v8.dev/blog/math-random | V8 Math.random}
 * @param seed - seed
 * @param m - modulus
 * @param a - multiplier
 * @param c - increment
 * @returns pseudorandom number result
 */
function lcg(seed: number, m = 2 ** 31, a = 1103515245, c = 12345): number {
  return (a * seed + c) % m;
}

if (import.meta.vitest) {
  const { it, expect } = import.meta.vitest;
  it('GIVEN seed 1 get result', () => {
    expect(lcg(1)).toBe(1103527590);
  });
}
