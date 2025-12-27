### 6.6.2 MySQL Enterprise Encryption Usage and Examples

To use MySQL Enterprise Encryption in applications, invoke the functions that are appropriate for the operations you wish to perform. This section demonstrates how to carry out some representative tasks:

* [Create a private/public key pair using RSA encryption](enterprise-encryption-usage.html#enterprise-encryption-usage-create-key-pair "Create a private/public key pair using RSA encryption")
* [Use the private key to encrypt data and the public key to decrypt it](enterprise-encryption-usage.html#enterprise-encryption-usage-encrypt-decrypt "Use the private key to encrypt data and the public key to decrypt it")
* [Generate a digest from a string](enterprise-encryption-usage.html#enterprise-encryption-usage-create-digest "Generate a digest from a string")
* [Use the digest with a key pair](enterprise-encryption-usage.html#enterprise-encryption-usage-digital-signing "Use the digest with a key pair")
* [Create a symmetric key](enterprise-encryption-usage.html#enterprise-encryption-usage-create-symmetic-key "Create a symmetric key")
* [Limit CPU usage by key-generation operations](enterprise-encryption-usage.html#enterprise-encryption-usage-limit-cpu "Limit CPU usage by key-generation operations")

#### Create a private/public key pair using RSA encryption

```sql
-- Encryption algorithm; can be 'DSA' or 'DH' instead
SET @algo = 'RSA';
-- Key length in bits; make larger for stronger keys
SET @key_len = 1024;

-- Create private key
SET @priv = create_asymmetric_priv_key(@algo, @key_len);
-- Derive corresponding public key from private key, using same algorithm
SET @pub = create_asymmetric_pub_key(@algo, @priv);
```

Now you can use the key pair to encrypt and decrypt data, sign and verify data, or generate symmetric keys.

#### Use the private key to encrypt data and the public key to decrypt it

This requires that the members of the key pair be RSA keys.

```sql
SET @ciphertext = asymmetric_encrypt(@algo, 'My secret text', @priv);
SET @plaintext = asymmetric_decrypt(@algo, @ciphertext, @pub);
```

Conversely, you can encrypt using the public key and decrypt using the private key.

```sql
SET @ciphertext = asymmetric_encrypt(@algo, 'My secret text', @pub);
SET @plaintext = asymmetric_decrypt(@algo, @ciphertext, @priv);
```

In either case, the algorithm specified for the encryption and decryption functions must match that used to generate the keys.

#### Generate a digest from a string

```sql
-- Digest type; can be 'SHA256', 'SHA384', or 'SHA512' instead
SET @dig_type = 'SHA224';

-- Generate digest string
SET @dig = create_digest(@dig_type, 'My text to digest');
```

#### Use the digest with a key pair

The key pair can be used to sign data, then verify that the signature matches the digest.

```sql
-- Encryption algorithm; could be 'DSA' instead; keys must
-- have been created using same algorithm
SET @algo = 'RSA';

-- Generate signature for digest and verify signature against digest
SET @sig = asymmetric_sign(@algo, @dig, @priv, @dig_type);
-- Verify signature against digest
SET @verf = asymmetric_verify(@algo, @dig, @sig, @pub, @dig_type);
```

#### Create a symmetric key

This requires DH private/public keys as inputs, created using a shared symmetric secret. Create the secret by passing the key length to [`create_dh_parameters()`](enterprise-encryption-functions.html#function_create-dh-parameters), then pass the secret as the “key length” to [`create_asymmetric_priv_key()`](enterprise-encryption-functions.html#function_create-asymmetric-priv-key).

```sql
-- Generate DH shared symmetric secret
SET @dhp = create_dh_parameters(1024);
-- Generate DH key pairs
SET @algo = 'DH';
SET @priv1 = create_asymmetric_priv_key(@algo, @dhp);
SET @pub1 = create_asymmetric_pub_key(@algo, @priv1);
SET @priv2 = create_asymmetric_priv_key(@algo, @dhp);
SET @pub2 = create_asymmetric_pub_key(@algo, @priv2);

-- Generate symmetric key using public key of first party,
-- private key of second party
SET @sym1 = asymmetric_derive(@pub1, @priv2);

-- Or use public key of second party, private key of first party
SET @sym2 = asymmetric_derive(@pub2, @priv1);
```

Key string values can be created at runtime and stored into a variable or table using [`SET`](set-variable.html "13.7.4.1 SET Syntax for Variable Assignment"), [`SELECT`](select.html "13.2.9 SELECT Statement"), or [`INSERT`](insert.html "13.2.5 INSERT Statement"):

```sql
SET @priv1 = create_asymmetric_priv_key('RSA', 1024);
SELECT create_asymmetric_priv_key('RSA', 1024) INTO @priv2;
INSERT INTO t (key_col) VALUES(create_asymmetric_priv_key('RSA', 1024));
```

Key string values stored in files can be read using the [`LOAD_FILE()`](string-functions.html#function_load-file) function by users who have the [`FILE`](privileges-provided.html#priv_file) privilege.

Digest and signature strings can be handled similarly.

#### Limit CPU usage by key-generation operations

The [`create_asymmetric_priv_key()`](enterprise-encryption-functions.html#function_create-asymmetric-priv-key) and [`create_dh_parameters()`](enterprise-encryption-functions.html#function_create-dh-parameters) encryption functions take a key-length parameter, and the amount of CPU resources required by these functions increases as the key length increases. For some installations, this might result in unacceptable CPU usage if applications frequently generate excessively long keys.

OpenSSL imposes a minimum key length of 1,024 bits for all keys. OpenSSL also imposes a maximum key length of 10,000 bits and 16,384 bits for DSA and RSA keys, respectively, for [`create_asymmetric_priv_key()`](enterprise-encryption-functions.html#function_create-asymmetric-priv-key), and a maximum key length of 10,000 bits for [`create_dh_parameters()`](enterprise-encryption-functions.html#function_create-dh-parameters). If those maximum values are too high, three environment variables are available as of MySQL 5.7.17 to enable MySQL server administrators to set lower maximum lengths for key generation, and thereby to limit CPU usage:

* `MYSQL_OPENSSL_UDF_DSA_BITS_THRESHOLD`: Maximum DSA key length in bits for [`create_asymmetric_priv_key()`](enterprise-encryption-functions.html#function_create-asymmetric-priv-key). The minimum and maximum values for this variable are 1,024 and 10,000.

* `MYSQL_OPENSSL_UDF_RSA_BITS_THRESHOLD`: Maximum RSA key length in bits for [`create_asymmetric_priv_key()`](enterprise-encryption-functions.html#function_create-asymmetric-priv-key). The minimum and maximum values for this variable are 1,024 and 16,384.

* `MYSQL_OPENSSL_UDF_DH_BITS_THRESHOLD`: Maximum key length in bits for [`create_dh_parameters()`](enterprise-encryption-functions.html#function_create-dh-parameters). The minimum and maximum values for this variable are 1,024 and 10,000.

To use any of these environment variables, set them in the environment of the process that starts the server. If set, their values take precedence over the maximum key lengths imposed by OpenSSL. For example, to set a maximum key length of 4,096 bits for DSA and RSA keys for [`create_asymmetric_priv_key()`](enterprise-encryption-functions.html#function_create-asymmetric-priv-key), set these variables:

```sql
export MYSQL_OPENSSL_UDF_DSA_BITS_THRESHOLD=4096
export MYSQL_OPENSSL_UDF_RSA_BITS_THRESHOLD=4096
```

The example uses Bourne shell syntax. The syntax for other shells may differ.
