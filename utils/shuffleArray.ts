/**
 * shuffle an array
 * @param arr - any array
 * @returns order shuffled array
 */
export function shuffleArray(arr: any[]): any[] {
  arr.sort(() => 0.5 - Math.random());
  return arr;
}

if (import.meta.vitest) {
  const { it, expect } = import.meta.vitest;
  it(`GIVE one array, return shuffled array contain same valus`, () => {
    const unshuffled = ['hello', 'a', 't', 'q', 1, 2, 3, { cats: true }];
    const shuffled = shuffleArray(unshuffled);
    expect(shuffled).toContain(unshuffled[0]);
    expect(shuffled).toContain(unshuffled[1]);
    expect(shuffled).toContain(unshuffled[2]);
  });
}
