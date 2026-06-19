## 6.6 MySQL Enterprise Encryption

Note

MySQL Enterprise Encryption is an extension included in MySQL Enterprise Edition, a commercial product. To learn more about commercial products, <https://www.mysql.com/products/>.

MySQL Enterprise Edition includes a set of encryption functions based on the OpenSSL library that expose OpenSSL capabilities at the SQL level. These functions enable Enterprise applications to perform the following operations:

* Implement added data protection using public-key asymmetric cryptography

* Create public and private keys and digital signatures
* Perform asymmetric encryption and decryption
* Use cryptographic hashing for digital signing and data verification and validation

MySQL Enterprise Encryption supports the RSA, DSA, and DH cryptographic algorithms.

MySQL Enterprise Encryption is supplied as a library of loadable functions, from which individual functions can be installed individually.


### 6.6.1 MySQL Enterprise Encryption Installation

MySQL Enterprise Encryption functions are located in a loadable function library file installed in the plugin directory (the directory named by the `plugin_dir` system variable). The function library base name is `openssl_udf` and the suffix is platform dependent. For example, the file name on Linux or Windows is `openssl_udf.so` or `openssl_udf.dll`, respectively.

To install functions from the library file, use the `CREATE FUNCTION` statement. To load all functions from the library, use this set of statements, adjusting the file name suffix as necessary:

```sql
CREATE FUNCTION asymmetric_decrypt RETURNS STRING
  SONAME 'openssl_udf.so';
CREATE FUNCTION asymmetric_derive RETURNS STRING
  SONAME 'openssl_udf.so';
CREATE FUNCTION asymmetric_encrypt RETURNS STRING
  SONAME 'openssl_udf.so';
CREATE FUNCTION asymmetric_sign RETURNS STRING
  SONAME 'openssl_udf.so';
CREATE FUNCTION asymmetric_verify RETURNS INTEGER
  SONAME 'openssl_udf.so';
CREATE FUNCTION create_asymmetric_priv_key RETURNS STRING
  SONAME 'openssl_udf.so';
CREATE FUNCTION create_asymmetric_pub_key RETURNS STRING
  SONAME 'openssl_udf.so';
CREATE FUNCTION create_dh_parameters RETURNS STRING
  SONAME 'openssl_udf.so';
CREATE FUNCTION create_digest RETURNS STRING
  SONAME 'openssl_udf.so';
```

Once installed, the functions remain installed across server restarts. To unload the functions, use the `DROP FUNCTION` statement:

```sql
DROP FUNCTION asymmetric_decrypt;
DROP FUNCTION asymmetric_derive;
DROP FUNCTION asymmetric_encrypt;
DROP FUNCTION asymmetric_sign;
DROP FUNCTION asymmetric_verify;
DROP FUNCTION create_asymmetric_priv_key;
DROP FUNCTION create_asymmetric_pub_key;
DROP FUNCTION create_dh_parameters;
DROP FUNCTION create_digest;
```

In the `CREATE FUNCTION` and `DROP FUNCTION` statements, the function names must be specified in lowercase. This differs from their use at function invocation time, for which you can use any lettercase.

The `CREATE FUNCTION` and `DROP FUNCTION` statements require the `INSERT` and `DROP` privilege, respectively, for the `mysql` database.


### 6.6.2 MySQL Enterprise Encryption Usage and Examples

To use MySQL Enterprise Encryption in applications, invoke the functions that are appropriate for the operations you wish to perform. This section demonstrates how to carry out some representative tasks:

* Create a private/public key pair using RSA encryption
* Use the private key to encrypt data and the public key to decrypt it
* Generate a digest from a string
* Use the digest with a key pair
* Create a symmetric key
* Limit CPU usage by key-generation operations

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

This requires DH private/public keys as inputs, created using a shared symmetric secret. Create the secret by passing the key length to `create_dh_parameters()`, then pass the secret as the “key length” to `create_asymmetric_priv_key()`.

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

Key string values can be created at runtime and stored into a variable or table using `SET`, `SELECT`, or `INSERT`:

```sql
SET @priv1 = create_asymmetric_priv_key('RSA', 1024);
SELECT create_asymmetric_priv_key('RSA', 1024) INTO @priv2;
INSERT INTO t (key_col) VALUES(create_asymmetric_priv_key('RSA', 1024));
```

Key string values stored in files can be read using the `LOAD_FILE()` function by users who have the `FILE` privilege.

Digest and signature strings can be handled similarly.

#### Limit CPU usage by key-generation operations

The `create_asymmetric_priv_key()` and `create_dh_parameters()` encryption functions take a key-length parameter, and the amount of CPU resources required by these functions increases as the key length increases. For some installations, this might result in unacceptable CPU usage if applications frequently generate excessively long keys.

OpenSSL imposes a minimum key length of 1,024 bits for all keys. OpenSSL also imposes a maximum key length of 10,000 bits and 16,384 bits for DSA and RSA keys, respectively, for `create_asymmetric_priv_key()`, and a maximum key length of 10,000 bits for `create_dh_parameters()`. If those maximum values are too high, three environment variables are available as of MySQL 5.7.17 to enable MySQL server administrators to set lower maximum lengths for key generation, and thereby to limit CPU usage:

* `MYSQL_OPENSSL_UDF_DSA_BITS_THRESHOLD`: Maximum DSA key length in bits for `create_asymmetric_priv_key()`. The minimum and maximum values for this variable are 1,024 and 10,000.

* `MYSQL_OPENSSL_UDF_RSA_BITS_THRESHOLD`: Maximum RSA key length in bits for `create_asymmetric_priv_key()`. The minimum and maximum values for this variable are 1,024 and 16,384.

* `MYSQL_OPENSSL_UDF_DH_BITS_THRESHOLD`: Maximum key length in bits for `create_dh_parameters()`. The minimum and maximum values for this variable are 1,024 and 10,000.

To use any of these environment variables, set them in the environment of the process that starts the server. If set, their values take precedence over the maximum key lengths imposed by OpenSSL. For example, to set a maximum key length of 4,096 bits for DSA and RSA keys for `create_asymmetric_priv_key()`, set these variables:

```sql
export MYSQL_OPENSSL_UDF_DSA_BITS_THRESHOLD=4096
export MYSQL_OPENSSL_UDF_RSA_BITS_THRESHOLD=4096
```

The example uses Bourne shell syntax. The syntax for other shells may differ.


### 6.6.3 MySQL Enterprise Encryption Function Reference

**Table 6.36 MySQL Enterprise Encryption Functions**

<table frame="box" rules="all" summary="A reference that lists MySQL Enterprise Encryption functions."><col style="width: 28%"/><col style="width: 71%"/><thead><tr><th>Name*</th> <th>Description</th> </tr></thead><tbody><tr><td><code>asymmetric_decrypt()</code></td> <td> Decrypt ciphertext using private or public key </td> </tr><tr><td><code>asymmetric_derive()</code></td> <td> Derive symmetric key from asymmetric keys </td> </tr><tr><td><code>asymmetric_encrypt()</code></td> <td> Encrypt cleartext using private or public key </td> </tr><tr><td><code>asymmetric_sign()</code></td> <td> Generate signature from digest </td> </tr><tr><td><code>asymmetric_verify()</code></td> <td> Verify that signature matches digest </td> </tr><tr><td><code>create_asymmetric_priv_key()</code></td> <td> Create private key </td> </tr><tr><td><code>create_asymmetric_pub_key()</code></td> <td> Create public key </td> </tr><tr><td><code>create_dh_parameters()</code></td> <td> Generate shared DH secret </td> </tr><tr><td><code>create_digest()</code></td> <td> Generate digest from string </td> </tr></tbody></table>


### 6.6.4 MySQL Enterprise Encryption Function Descriptions

MySQL Enterprise Encryption functions have these general characteristics:

* For arguments of the wrong type or an incorrect number of arguments, each function returns an error.

* If the arguments are not suitable to permit a function to perform the requested operation, it returns `NULL` or 0 as appropriate. This occurs, for example, if a function does not support a specified algorithm, a key length is too short or long, or a string expected to be a key string in PEM format is not a valid key. (OpenSSL imposes its own key-length limits, and server administrators can impose additional limits on maximum key length by setting environment variables. See Section 6.6.2, “MySQL Enterprise Encryption Usage and Examples”.)

* The underlying SSL library takes care of randomness initialization.

Several of the functions take an encryption algorithm argument. The following table summarizes the supported algorithms by function.

**Table 6.37 Supported Algorithms by Function**

<table summary="Supported encryption algorithms by function."><col style="width: 50%"/><col style="width: 50%"/><thead><tr> <th>Function</th> <th>Supported Algorithms</th> </tr></thead><tbody><tr> <td><code>asymmetric_decrypt()</code></td> <td>RSA</td> </tr><tr> <td><code>asymmetric_derive()</code></td> <td>DH</td> </tr><tr> <td><code>asymmetric_encrypt()</code></td> <td>RSA</td> </tr><tr> <td><code>asymmetric_sign()</code></td> <td>RSA, DSA</td> </tr><tr> <td><code>asymmetric_verify()</code></td> <td>RSA, DSA</td> </tr><tr> <td><code>create_asymmetric_priv_key()</code></td> <td>RSA, DSA, DH</td> </tr><tr> <td><code>create_asymmetric_pub_key()</code></td> <td>RSA, DSA, DH</td> </tr><tr> <td><code>create_dh_parameters()</code></td> <td>DH</td> </tr></tbody></table>

Note

Although you can create keys using any of the RSA, DSA, or DH encryption algorithms, other functions that take key arguments might accept only certain types of keys. For example, `asymmetric_encrypt()` and `asymmetric_decrypt()` accept only RSA keys.

The following descriptions describe the calling sequences for MySQL Enterprise Encryption functions. For additional examples and discussion, see Section 6.6.2, “MySQL Enterprise Encryption Usage and Examples”.

* `asymmetric_decrypt(algorithm, crypt_str, key_str)`

  Decrypts an encrypted string using the given algorithm and key string, and returns the resulting plaintext as a binary string. If decryption fails, the result is `NULL`.

  *`key_str`* must be a valid key string in PEM format. For successful decryption, it must be the public or private key string corresponding to the private or public key string used with `asymmetric_encrypt()` to produce the encrypted string. *`algorithm`* indicates the encryption algorithm used to create the key.

  Supported *`algorithm`* values: `'RSA'`

  For a usage example, see the description of `asymmetric_encrypt()`.

* `asymmetric_derive(pub_key_str, priv_key_str)`

  Derives a symmetric key using the private key of one party and the public key of another, and returns the resulting key as a binary string. If key derivation fails, the result is `NULL`.

  *`pub_key_str`* and *`priv_key_str`* must be valid key strings in PEM format. They must be created using the DH algorithm.

  Suppose that you have two pairs of public and private keys:

  ```sql
  SET @dhp = create_dh_parameters(1024);
  SET @priv1 = create_asymmetric_priv_key('DH', @dhp);
  SET @pub1 = create_asymmetric_pub_key('DH', @priv1);
  SET @priv2 = create_asymmetric_priv_key('DH', @dhp);
  SET @pub2 = create_asymmetric_pub_key('DH', @priv2);
  ```

  Suppose further that you use the private key from one pair and the public key from the other pair to create a symmetric key string. Then this symmetric key identity relationship holds:

  ```sql
  asymmetric_derive(@pub1, @priv2) = asymmetric_derive(@pub2, @priv1)
  ```

* `asymmetric_encrypt(algorithm, str, key_str)`

  Encrypts a string using the given algorithm and key string, and returns the resulting ciphertext as a binary string. If encryption fails, the result is `NULL`.

  The *`str`* length cannot be greater than the *`key_str`* length − 11, in bytes

  *`key_str`* must be a valid key string in PEM format. *`algorithm`* indicates the encryption algorithm used to create the key.

  Supported *`algorithm`* values: `'RSA'`

  To encrypt a string, pass a private or public key string to `asymmetric_encrypt()`. To recover the original unencrypted string, pass the encrypted string to `asymmetric_decrypt()`, along with the public or private key string correponding to the private or public key string used for encryption.

  ```sql
  -- Generate private/public key pair
  SET @priv = create_asymmetric_priv_key('RSA', 1024);
  SET @pub = create_asymmetric_pub_key('RSA', @priv);

  -- Encrypt using private key, decrypt using public key
  SET @ciphertext = asymmetric_encrypt('RSA', 'The quick brown fox', @priv);
  SET @plaintext = asymmetric_decrypt('RSA', @ciphertext, @pub);

  -- Encrypt using public key, decrypt using private key
  SET @ciphertext = asymmetric_encrypt('RSA', 'The quick brown fox', @pub);
  SET @plaintext = asymmetric_decrypt('RSA', @ciphertext, @priv);
  ```

  Suppose that:

  ```sql
  SET @s = a string to be encrypted
  SET @priv = a valid private RSA key string in PEM format
  SET @pub = the corresponding public RSA key string in PEM format
  ```

  Then these identity relationships hold:

  ```sql
  asymmetric_decrypt('RSA', asymmetric_encrypt('RSA', @s, @priv), @pub) = @s
  asymmetric_decrypt('RSA', asymmetric_encrypt('RSA', @s, @pub), @priv) = @s
  ```

* `asymmetric_sign(algorithm, digest_str, priv_key_str, digest_type)`

  Signs a digest string using a private key string, and returns the signature as a binary string. If signing fails, the result is `NULL`.

  *`digest_str`* is the digest string. It can be generated by calling `create_digest()`. *`digest_type`* indicates the digest algorithm used to generate the digest string.

  *`priv_key_str`* is the private key string to use for signing the digest string. It must be a valid key string in PEM format. *`algorithm`* indicates the encryption algorithm used to create the key.

  Supported *`algorithm`* values: `'RSA'`, `'DSA'`

  Supported *`digest_type`* values: `'SHA224'`, `'SHA256'`, `'SHA384'`, `'SHA512'`

  For a usage example, see the description of `asymmetric_verify()`.

* `asymmetric_verify(algorithm, digest_str, sig_str, pub_key_str, digest_type)`

  Verifies whether the signature string matches the digest string, and returns 1 or 0 to indicate whether verification succeeded or failed.

  *`digest_str`* is the digest string. It can be generated by calling `create_digest()`. *`digest_type`* indicates the digest algorithm used to generate the digest string.

  *`sig_str`* is the signature string. It can be generated by calling `asymmetric_sign()`.

  *`pub_key_str`* is the public key string of the signer. It corresponds to the private key passed to `asymmetric_sign()` to generate the signature string and must be a valid key string in PEM format. *`algorithm`* indicates the encryption algorithm used to create the key.

  Supported *`algorithm`* values: `'RSA'`, `'DSA'`

  Supported *`digest_type`* values: `'SHA224'`, `'SHA256'`, `'SHA384'`, `'SHA512'`

  ```sql
  -- Set the encryption algorithm and digest type
  SET @algo = 'RSA';
  SET @dig_type = 'SHA224';

  -- Create private/public key pair
  SET @priv = create_asymmetric_priv_key(@algo, 1024);
  SET @pub = create_asymmetric_pub_key(@algo, @priv);

  -- Generate digest from string
  SET @dig = create_digest(@dig_type, 'The quick brown fox');

  -- Generate signature for digest and verify signature against digest
  SET @sig = asymmetric_sign(@algo, @dig, @priv, @dig_type);
  SET @verf = asymmetric_verify(@algo, @dig, @sig, @pub, @dig_type);
  ```

* `create_asymmetric_priv_key(algorithm, {key_len|dh_secret})`

  Creates a private key using the given algorithm and key length or DH secret, and returns the key as a binary string in PEM format. If key generation fails, the result is `NULL`.

  Supported *`algorithm`* values: `'RSA'`, `'DSA'`, `'DH'`

  Supported *`key_len`* values: The minimum key length in bits is 1,024. The maximum key length depends on the algorithm: 16,384 for RSA and 10,000 for DSA. These key-length limits are constraints imposed by OpenSSL. Server administrators can impose additional limits on maximum key length by setting environment variables. See Section 6.6.2, “MySQL Enterprise Encryption Usage and Examples”.

  For DH keys, pass a shared DH secret instead of a key length. To create the secret, pass the key length to `create_dh_parameters()`.

  This example creates a 2,048-bit DSA private key, then derives a public key from the private key:

  ```sql
  SET @priv = create_asymmetric_priv_key('DSA', 2048);
  SET @pub = create_asymmetric_pub_key('DSA', @priv);
  ```

  For an example showing DH key generation, see the description of `asymmetric_derive()`.

  Some general considerations in choosing key lengths and encryption algorithms:

  + The strength of encryption for private and public keys increases with the key size, but the time for key generation increases as well.

  + Generation of DH keys takes much longer than RSA or RSA keys.

  + Asymmetric encryption functions are slower than symmetric functions. If performance is an important factor and the functions are to be used very frequently, you are better off using symmetric encryption. For example, consider using `AES_ENCRYPT()` and `AES_DECRYPT()`.

* `create_asymmetric_pub_key(algorithm, priv_key_str)`

  Derives a public key from the given private key using the given algorithm, and returns the key as a binary string in PEM format. If key derivation fails, the result is `NULL`.

  *`priv_key_str`* must be a valid key string in PEM format. *`algorithm`* indicates the encryption algorithm used to create the key.

  Supported *`algorithm`* values: `'RSA'`, `'DSA'`, `'DH'`

  For a usage example, see the description of `create_asymmetric_priv_key()`.

* `create_dh_parameters(key_len)`

  Creates a shared secret for generating a DH private/public key pair and returns a binary string that can be passed to `create_asymmetric_priv_key()`. If secret generation fails, the result is null.

  Supported *`key_len`* values: The minimum and maximum key lengths in bits are 1,024 and 10,000. These key-length limits are constraints imposed by OpenSSL. Server administrators can impose additional limits on maximum key length by setting environment variables. See Section 6.6.2, “MySQL Enterprise Encryption Usage and Examples”.

  For an example showing how to use the return value for generating symmetric keys, see the description of `asymmetric_derive()`.

  ```sql
  SET @dhp = create_dh_parameters(1024);
  ```

* `create_digest(digest_type, str)`

  Creates a digest from the given string using the given digest type, and returns the digest as a binary string. If digest generation fails, the result is `NULL`.

  Supported *`digest_type`* values: `'SHA224'`, `'SHA256'`, `'SHA384'`, `'SHA512'`

  ```sql
  SET @dig = create_digest('SHA512', The quick brown fox');
  ```

  The resulting digest string is suitable for use with `asymmetric_sign()` and `asymmetric_verify()`.
