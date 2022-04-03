type OneTimePadKey = number[];

/**
 * @see {@link https://en.wikipedia.org/wiki/One-time_pad}
 * @param n - length of the key
 * @returns key array
 */
function generateKey(n: number): OneTimePadKey {
  const key = [];
  for (let i = 0; i < n; i++) {
    key.push(Math.floor(Math.random() * 255));
  }
  return key;
}

/**
 * 'XOR' original message with key.
 * In javascript use '^' operator.
 * @param message original message
 * @param key one-time pad encrypt key
 * @returns encrypted key
 */
function encrypt(message: string, key: OneTimePadKey): string {
  let secret = [];
  for (let i = 0; i < message.length; i++) {
    secret.push(message[i].charCodeAt(0) ^ key[i]);
  }
  return secret.map((num) => String.fromCharCode(num)).join('');
}

/**
 * For the property of 'XOR'
 * a = b ^ c => b = a ^ c
 * decrypt function is same with encrypt function.
 * @param secret encrypted secret
 * @param key one-time pad key
 * @returns original message
 */
function decrypt(secret: string, key: OneTimePadKey): string {
  return encrypt(secret, key);
}

if (import.meta.vitest) {
  const { it, expect } = import.meta.vitest;
  it('GIVE a message ATTACK WILL be decrypted to original message.', () => {
    const key = generateKey(100000);
    const message = 'ATTACK';
    const secret = encrypt(message, key);
    expect(message).toBe(decrypt(secret, key));
  });
}
