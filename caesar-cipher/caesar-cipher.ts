import type { Secret, Message } from '../utils/types';

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
 * @see {@link https://en.wikipedia.org/wiki/Caesar_cipher}
 * Generate encrypt and decrypt table.
 * @param shift - shift value
 * @returns two key tables for encrypt and decrypt
 *
 */
function generateKey(shift: number): TablePair {
  const encryptKey = {};
  const decryptKey = {};

  for (let i = 0; i < 26; i++) {
    const encryptedIndex =
      (shift + i) % alphabetCount < 0
        ? alphabetCount - Math.abs((shift + i) % alphabetCount)
        : (shift + i) % alphabetCount;
    Object.assign(encryptKey, {
      [alphabet[i % alphabetCount]]: alphabet[encryptedIndex],
    });
    Object.assign(decryptKey, {
      [alphabet[encryptedIndex]]: alphabet[i % alphabetCount],
    });
  }

  return { encryptKey, decryptKey };
}

/**
 * @param message - message to encrypt
 * @param shift - shift value
 * @returns secret from message
 *
 */
function encrypt(message: Message, shift: number) {
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
function decrypt(secret: Secret, shift: number) {
  let message = '';
  const { decryptKey } = generateKey(shift);

  for (let i = 0; i < secret.length; i++) {
    message += decryptKey[secret[i]];
  }

  return message;
}

if (import.meta.vitest) {
  const { it, expect, describe } = import.meta.vitest;
  describe.each([
    { message: 'abc', shift: 2, secret: 'cde' },
    { message: 'edf', shift: 0, secret: 'edf' },
    { message: 'abc', shift: 27, secret: 'bcd' },
    { message: 'bcd', shift: -2, secret: 'zab' },
  ])(
    'describe message: $message shift: $shift to secret: $secret',
    ({ message, shift, secret }) => {
      it(`GIVE shift:${shift}, WHEN message: ${message}, WILL encrypted to ${secret} `, () => {
        const encryptedMessage = encrypt(message, shift);
        expect(encryptedMessage).toBe(secret);
        expect(decrypt(encryptedMessage, shift)).toBe(message);
      });
    },
  );
}
