import * as crypto from 'crypto';

// const { publicKey, privateKey } = crypto.generateKeyPairSync('rsa', {
//   modulusLength: 4096,
//   publicKeyEncoding: {
//     type: 'spki',
//     format: 'pem',
//   },
//   privateKeyEncoding: {
//     type: 'pkcs8',
//     format: 'pem',
//     cipher: 'aes-256-cbc',
//     passphrase: 'top secret',
//   },
// });

// const { publicKey, privateKey } = crypto.generateKeyPairSync('rsa', {
//   // The standard secure default length for RSA keys is 2048 bits
//   modulusLength: 2048,
// });

// const signature = crypto.sign(algorithm, data, privateKey);

// const isVerified = crypto.verify(algorithm, data, publicKey, signature);

// console.log({
//   publicKey: publicKey.export({ type: 'pkcs1', format: 'pem' }),
//   privateKey: privateKey.export({ type: 'pkcs1', format: 'pem' }),
//   signature: signature.toString('hex'),
//   isVerified,
// });

/**
 * How to sign and verify with `openssl`
 * ```
 * # generate private key
 * openssl genrsa -out private.pem 1024
 * # generate public key
 * openssl rsa -in private.pem -pubout > public.pem
 * # generate message file
 * echo -n 'A message for sign' > data.txt
 * # sign with private key
 * openssl dgst -sha1 -sign private.pem -out sha1.sign data.txt
 * # verify signature
 * openssl dgst -sha1 -verify public.pem -signature sha1.sign data.txt
 * # >> Verified OK
 * ```
 */
if (import.meta.vitest) {
  const { it, expect, describe } = import.meta.vitest;

  describe(`GIVEN ${crypto.generateKeyPairSync.name} with RSA`, () => {
    const algorithm = 'SHA256';
    const data = Buffer.from('hello world');
    it('GIVEN RSA key pair, sign and verify a signature.', () => {
      const { publicKey, privateKey } = crypto.generateKeyPairSync('rsa', {
        modulusLength: 2048,
      });
      const signature = crypto.sign(algorithm, data, privateKey);
      const isVerified = crypto.verify(algorithm, data, publicKey, signature);
      expect(isVerified).toBe(true);
      const isVerifiedWithPrivateKey = crypto.verify(
        algorithm,
        data,
        privateKey,
        signature,
      );
      expect(isVerifiedWithPrivateKey).toBe(true);
    });

    it("GIVEN a wrong RSA key pair, can't verify a signature", () => {
      const { publicKey, privateKey } = crypto.generateKeyPairSync('rsa', {
        modulusLength: 1000,
      });
      const signature = crypto.sign(algorithm, data, privateKey);
      const isVerifiedWithOtherAlgo = crypto.verify('MD5', data, publicKey, signature);
      const isVerifiedWithOtherData = crypto.verify(
        algorithm,
        Buffer.from('hey world'),
        publicKey,
        signature,
      );
      const isVerifiedWithOtherSignature = crypto.verify(
        algorithm,
        data,
        publicKey,
        Buffer.from('hello'),
      );
      expect(isVerifiedWithOtherAlgo).toBe(false);
      expect(isVerifiedWithOtherData).toBe(false);
      expect(isVerifiedWithOtherSignature).toBe(false);
    });
  });
}
