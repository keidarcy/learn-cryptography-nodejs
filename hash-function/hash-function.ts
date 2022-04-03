import { createHash, Hash } from 'crypto';
/**
 * @see {@link https://en.wikipedia.org/wiki/Hash_function | hash function}
 * @remarks
 * - The function to map data of arbitrary size to __fixed-size__ values.
 * - The values returned by a hash function are called `hash values`, `hash codes`, `digests`, or simply `hashes`.
 * - Not reversible in general.
 * - Two basic properties.
 *   - 1. it should be very fast to compute;
 *   - 2. it should minimize duplication of output values (collisions)
 * - hash with salt to prevent {@link https://en.wikipedia.org/wiki/Rainbow_table | rainbow table}
 *
 * @example
 * - md5 (collision)
 * - sha1 (collision)
 * - sha256
 * - sha512
 *
 * @param algorithm - hash function algorithm
 * @param text - original text
 * @returns hashed text.
 */
function hash(algorithm: string, text: string) {
  const hashed = createHash(algorithm);
  hashed.update(text);
  return hashed.digest('hex');
}

if (import.meta.vitest) {
  const { it, expect } = import.meta.vitest;
  it('GIVEN `hello` with `md5`', () => {
    expect(hash('md5', 'hello')).toBe('5d41402abc4b2a76b9719d911017c592');
  });

  it('GIVEN `hello` with `sha256`', () => {
    expect(hash('sha256', 'hello')).toBe(
      '2cf24dba5fb0a30e26e83b2ac5b9e29e1b161e5c1fa7425e73043362938b9824',
    );
  });
}
