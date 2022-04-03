import * as crypto from 'crypto';

/**
 * @see {@link https://en.wikipedia.org/wiki/Block_cipher}
 * AES / DES
 * aes is widely used now.
 *
 * ```sh
 * # display the available cipher algorithms
 * openssl list -cipher-algorithms
 * ```
 *
 * @param message
 * @param key
 * @returns
 */
function encrypt(message: string, key: Buffer) {
  const algorithms = 'aes-256-cbc';
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv(algorithms, key, iv);

  let encryptedData = cipher.update(message);
  encryptedData = Buffer.concat([encryptedData, cipher.final()]);
  return { iv, encryptedData };
}

/**
 * aes decrypt
 * @param iv The IV is usually passed along with the ciphertext.
 * @param key Use the async `crypto.scrypt()` instead.
 * @param encrypted encrypted message
 * @returns original message
 */
function decrypt(iv: Buffer, key: Buffer, encrypted: Buffer) {
  const algorithms = 'aes-256-cbc';
  const decipher = crypto.createDecipheriv(algorithms, key, iv);
  let decryptedData = decipher.update(encrypted);
  decryptedData = Buffer.concat([decryptedData, decipher.final()]);
  return decryptedData.toString('utf-8');
}

if (import.meta.vitest) {
  const { it, expect } = import.meta.vitest;
  it('GIVEN aes-256-cbc of `a` encrypt and decrypt by the same key GET `a`', () => {
    const message = 'a';
    const key = crypto.randomBytes(32);
    const { iv, encryptedData } = encrypt(message, key);
    const res = decrypt(iv, key, encryptedData);
    expect(res).toBe(message);
  });
}
