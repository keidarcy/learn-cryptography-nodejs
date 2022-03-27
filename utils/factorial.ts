/**
 * n! = n * (n-1) * (n-2) * ... * 1
 * @param n - number to calculate factorial
 * @returns factorial of n
 */
export function factorial(n: number): number {
  if (n < 2) return n;
  return n * factorial(n - 1);
}

if (import.meta.vitest) {
  const { it, expect } = import.meta.vitest;
  it.each([
    { input: 2, output: 2 },
    { input: 3, output: 6 },
    { input: 4, output: 24 },
    { input: 6, output: 720 },
    { input: 26, output: 403291461126605635584000000 },
  ])('GIVEN factorial input: $input, GET output: $output', ({ input, output }) => {
    if (factorial(input) < Number.MAX_SAFE_INTEGER) {
      expect(factorial(input)).toBe(output);
    } else {
      expect(BigInt(factorial(input))).toBe(BigInt(output));
    }
  });
}
