const MAX_NUM = 20;
const MIN_NUM = 2;
type GetNReturnType = {
  p: number;
  q: number;
  n: number;
};
type GetDReturnType = {
  e: number;
  d: number;
};

type KeyGenerationReturnType = {
  n: number;
  e: number;
  d: number;
};
type KeyDistributionReturnType = {
  publicKey: {
    n: number;
    e: number;
  };
  privateKey: {
    n: number;
    d: number;
  };
};
function randomNumber(min: number, max: number): number {
  return Math.floor(Math.random() * max) + min;
}
function getPrime(min: number, max: number) {
  const x = randomNumber(min, max);
  if (isPrime(x)) return x;
  else return getPrime(min, max);
}

function isPrime(num: number): boolean {
  for (let i = 2, s = Math.sqrt(num); i <= s; i++) if (num % i === 0) return false;
  return num > 1;
}

/**
 * ### key exchange {@link https://en.wikipedia.org/wiki/Diffie%E2%80%93Hellman_key_exchange | Diffie–Hellman key exchange}
 * > A method of securely exchanging cryptographic keys over a public channel.
 * > Although Diffie–Hellman key agreement itself is a non-authenticated key-agreement protocol, it provides the basis for a variety of authenticated protocols.
 * > The method was followed shortly afterwards by RSA, an implementation of public-key cryptography using asymmetric algorithms.
 *
 * ### RSA {@link https://en.wikipedia.org/wiki/RSA_(cryptosystem) | cryptosystem}
 * > The RSA algorithm involves four steps: key generation, key distribution, encryption, and decryption.
 * - key generation
 */
function keyGeneration(): KeyGenerationReturnType {
  const args = getN();
  const r = getR(args);
  const { e, d } = getD(r);
  return { n: args.n, e, d };
  /**
   * 1. Choose two distinct prime numbers p and q.
   * 2. Compute n = pq.
   * @returns p, q, n
   */
  function getN(): GetNReturnType {
    while (true) {
      const p = getPrime(MIN_NUM, MAX_NUM);
      console.log(p);
      const q = getPrime(MIN_NUM, MAX_NUM);
      if (p !== q) {
        return {
          p,
          q,
          n: q * p,
        };
      }
    }
  }

  /**
   * 3. Get r.
   * r =  φ(N) =  φ(p) x  φ(q) = (p-1)(q-1)
   * @param args - contains p and q
   * @returns r
   */
  function getR(args: GetNReturnType): number {
    return (args.p - 1) * (args.q - 1);
  }

  /**
   * Choose an integer e such that 1 < e < λ(n) and gcd(e, λ(n)) = 1; that is, e and λ(n) are coprime.
   * gcd: Greatest common divisor.
   * 4. Get e.
   * Determine d as d ≡ e−1 (mod λ(n)); that is, d is the modular multiplicative inverse of e modulo λ(n)
   * 5. Get d.
   * @param r - r from {@link getR}
   * @returns d
   */
  function getD(r: number): GetDReturnType {
    // compute e value is time consuming, to simplify it, let e = 65537
    // https://www.johndcook.com/blog/2018/12/12/rsa-exponent/
    const e = 65537;
    for (let d = 1; d < r; d++) {
      if ((d * e) % r === 1) return { d, e };
    }
  }
}

/**
 * Key distribution step mock.
 * Suppose that Bob wants to send information to Alice.
 * Alice transmits her public key (n, e) to Bob via a reliable, but not necessarily secret, route.
 * Alice's private key (d) is never distributed.
 * @param args - get from key generation.
 * @returns public/secret key
 */
function keyDistribution(args: KeyGenerationReturnType): KeyDistributionReturnType {
  return {
    publicKey: {
      n: args.n,
      e: args.e,
    },
    privateKey: {
      n: args.n,
      d: args.d,
    },
  };
}

/**
 * RSA encrypt
 * @param message - message to encrypt
 * @param key - distributed public key
 * @returns encrypted secret message
 */
function encrypt(message: number, key: KeyDistributionReturnType['publicKey']): number {
  console.log({
    message,
    key,
    num: message ** key.e,
  });
  const cipher = message ** key.e % key.n;
  return cipher;
}

/**
 * RSA decrypt
 * @param secret - decrypted secret
 * @param key - private key
 * @returns - original message
 */
function decrypt(secret: number, key: KeyDistributionReturnType['privateKey']): number {
  const cipher = secret ** key.d % key.n;
  return cipher;
}

if (import.meta.vitest) {
  const { it, expect } = import.meta.vitest;
  it.todo('GIVEN RSA key pair, public key to encrypt and private key to decrypt.', () => {
    const { publicKey, privateKey } = keyDistribution(keyGeneration());
    const message = 100;
    const cipher = encrypt(message, publicKey);
    const originalMessage = decrypt(cipher, privateKey);
    expect(originalMessage).toBe(message);
  });
}
