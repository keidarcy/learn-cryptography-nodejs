const alphabetCount = 26;
const alphabet = Array(alphabetCount)
  .fill(0)
  .map((_, i) => String.fromCharCode(i + 97));

type KeyTable = Record<string, string>;
type TablePair = {
  encryptKey: KeyTable;
  decryptKey: KeyTable;
};

/**
 * Generate encrypt and decrypt table.
 * @param shift - shift value
 * @returns two key tables for encrypt and decrypt
 *
 */
function generateKey(shift: number): TablePair {
  const encryptKey = {};
  const decryptKey = {};

  for (let i = 0; i < 26; i++) {
    Object.assign(encryptKey, { [alphabet[i]]: alphabet[(shift + i) % alphabetCount] });
    Object.assign(decryptKey, { [alphabet[(shift + i) % alphabetCount]]: alphabet[i] });
  }

  return { encryptKey, decryptKey };
}

/**
 * @param message - message to encrypt
 * @param shift - shift value
 * @returns secret from message
 *
 */
function encrypt(message: string, shift: number) {
  let secret = '';
  const { encryptKey } = generateKey(shift);

  for (let i = 0; i < message.length; i++) {
    secret += encryptKey[message[i]];
  }
  return secret;
}

/**
 * @param secret - secret to decrypt
 * @param shift - shift value
 * @returns message from secret
 *
 */
function decrypt(secret: string, shift: number) {
  let message = '';
  const { decryptKey } = generateKey(shift);

  for (let i = 0; i < secret.length; i++) {
    message += decryptKey[secret[i]];
  }

  return message;
}

// @ts-expect-error
if (import.meta.vitest) {
  // @ts-expect-error
  const { it, expect } = import.meta.vitest;
  it('GIVEN usual shift and message', () => {
    const shift = 2;
    const message = 'hello';
    const secret = encrypt(message, shift);
    const result = decrypt(secret, shift);
    expect(result).toBe(message);
  });
}
