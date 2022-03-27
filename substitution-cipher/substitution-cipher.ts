import { type factorial } from '../utils/factorial';
import type { Secret, Message } from '../utils/types';
import { shuffleArray } from '../utils/shuffleArray';

type KeyMap = Record<string, string>;

/**
 * key size = factorial(26) {@link factorial}
 * 26! ≈ 288.4, or about 88 bits.
 * This cipher is not very strong, and is easily broken @see {@link https://en.wikipedia.org/wiki/Substitution_cipher | more}.
 */
function generateKey(): KeyMap {
  const alphabet = Array(26)
    .fill(0)
    .map((_, index) => String.fromCharCode(index + 97));

  const keyMap = new Map<string, string>();
  const shuffledAlphabet = shuffleArray([...alphabet]);

  for (let i = 0; i < 26; i++) {
    keyMap.set(alphabet[i], shuffledAlphabet[i]);
  }
  return Object.fromEntries(keyMap);
}

/**
 * @param message - the message to be encrypted.
 * @param key - {@link KeyMap}
 * @returns secret - encrypted message.
 */
function encrypt(message: Message, key: KeyMap): Secret {
  let secret = '';
  for (let i = 0; i < message.length; i++) {
    secret += key[message[i]];
  }
  return secret;
}

/**
 * @param secret - the message to be encrypted.
 * @param key - {@link KeyMap}
 * @returns message - original message.
 */
function decrypt(secret: Secret, key: KeyMap): Secret {
  const decryptKeyMap = new Map<string, string>();
  for (const [k, v] of Object.entries(key)) {
    decryptKeyMap.set(v, k);
  }
  const decryptKey = Object.fromEntries(decryptKeyMap);
  let message = '';
  for (let i = 0; i < secret.length; i++) {
    message += decryptKey[secret[i]];
  }
  return message;
}

if (import.meta.vitest) {
  const { it, expect } = import.meta.vitest;
  const key = generateKey();
  const message = 'thisismessage';
  it(`GIVE message: ${message}, after decrypt encrypted GET same value`, () => {
    expect(message).toBe(decrypt(encrypt(message, key), key));
  });
}
