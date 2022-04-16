### CA

#### Generate private key

- generate private rsa key with des3 algo

```bash
openssl genrsa -des3 -out ca.key 2048
```

#### Generate root certificate

- Sign and generate certification(CA root certificate)
  - append country, FQDN, etc information

```bash
openssl req -x509 -key ca.key -out ca.crt -days 365
```

- read country information

```bash
openssl x509 -in ca.crt -text
```

- distribute and install in user OS

### Certification requester

#### Generate private/public key

- Generate private.key

```bash
openssl genrsa -out my-site.com.key 2048
```

- Generate csr file

```bash
openssl req -new -key my-site.com.key -out my-site.com.csr
```

- Read csr content

```bash
openssl req -text -noout -verify -in my-site.com.csr
```

- CA create cerficate for `my-site.com` (crt file) from csr file

```bash
openssl x509 -req -in my-website.csr -CA ../ca/ca.crt -CAkey ../ca/ca.key -set_serial 01 -out my-website.crt -days 365
```

- Read from crt file(include CA data, my-site.com data, public key of my-site.com)

```bash
openssl x509 -in my-site.com.crt -text -noout
```
