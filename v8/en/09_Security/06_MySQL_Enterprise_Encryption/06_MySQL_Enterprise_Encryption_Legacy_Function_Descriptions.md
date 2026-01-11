### 8.6.6 MySQL Enterprise Encryption Legacy Function Descriptions

In releases before MySQL 8.0.30, MySQL Enterprise Encryption's functions are based on the `openssl_udf` shared library. This reference describes those functions. The functions continue to be available in later releases if they have been installed, but they are deprecated.

For information on upgrading to the new component functions provided by the MySQL component `component_enterprise_encryption`, and a list of the behavior differences between the legacy functions and the component functions, see Upgrading MySQL Enterprise Encryption.

The reference for the component functions is Section 8.6.5, “MySQL Enterprise Encryption Component Function Descriptions”.

MySQL Enterprise Encryption functions have these general characteristics:

* For arguments of the wrong type or an incorrect number of arguments, each function returns an error.

* If the arguments are not suitable to permit a function to perform the requested operation, it returns `NULL` or 0 as appropriate. This occurs, for example, if a function does not support a specified algorithm, a key length is too short or long, or a string expected to be a key string in PEM format is not a valid key.

* The underlying SSL library takes care of randomness initialization.

Several of the legacy functions take an encryption algorithm argument. The following table summarizes the supported algorithms by function.

**Table 8.49 Supported Algorithms by Function**

<table summary="Supported encryption algorithms by function."><thead><tr> <th>Function</th> <th>Supported Algorithms</th> </tr></thead><tbody><tr> <td><code>asymmetric_decrypt()</code></td> <td>RSA</td> </tr><tr> <td><code>asymmetric_derive()</code></td> <td>DH</td> </tr><tr> <td><code>asymmetric_encrypt()</code></td> <td>RSA</td> </tr><tr> <td><code>asymmetric_sign()</code></td> <td>RSA, DSA</td> </tr><tr> <td><code>asymmetric_verify()</code></td> <td>RSA, DSA</td> </tr><tr> <td><code>create_asymmetric_priv_key()</code></td> <td>RSA, DSA, DH</td> </tr><tr> <td><code>create_asymmetric_pub_key()</code></td> <td>RSA, DSA, DH</td> </tr><tr> <td><code>create_dh_parameters()</code></td> <td>DH</td> </tr></tbody></table>

Note

Although you can create keys using any of the RSA, DSA, or DH encryption algorithms, other legacy functions that take key arguments might accept only certain types of keys. For example, `asymmetric_encrypt()` and `asymmetric_decrypt()` accept only RSA keys.

For additional examples and discussion, see Section 8.6.3, “MySQL Enterprise Encryption Usage and Examples”.

* `asymmetric_decrypt(algorithm, crypt_str, key_str)`

  Decrypts an encrypted string using the given algorithm and key string, and returns the resulting plaintext as a binary string. If decryption fails, the result is `NULL`.

  The `openssl_udf` shared library function cannot decrypt content produced by the `component_enterprise_encryption` functions that are available from MySQL 8.0.30.

  *`algorithm`* is the encryption algorithm used to create the key. The supported algorithm value is `'RSA'`.

  *`crypt_str`* is the encrypted string to decrypt, which was encrypted with `asymmetric_encrypt()`.

  *`key_str`* is a valid PEM encoded RSA public or private key. For successful decryption, the key string must correspond to the public or private key string used with `asymmetric_encrypt()` to produce the encrypted string.

  For a usage example, see the description of `asymmetric_encrypt()`.

* `asymmetric_derive(pub_key_str, priv_key_str)`

  Derives a symmetric key using the private key of one party and the public key of another, and returns the resulting key as a binary string. If key derivation fails, the result is `NULL`.

  *`pub_key_str`* and *`priv_key_str`* are valid PEM encoded key strings that were created using the DH algorithm.

  Suppose that you have two pairs of public and private keys:

  ```
  SET @dhp = create_dh_parameters(1024);
  SET @priv1 = create_asymmetric_priv_key('DH', @dhp);
  SET @pub1 = create_asymmetric_pub_key('DH', @priv1);
  SET @priv2 = create_asymmetric_priv_key('DH', @dhp);
  SET @pub2 = create_asymmetric_pub_key('DH', @priv2);
  ```

  Suppose further that you use the private key from one pair and the public key from the other pair to create a symmetric key string. Then this symmetric key identity relationship holds:

  ```
  asymmetric_derive(@pub1, @priv2) = asymmetric_derive(@pub2, @priv1)
  ```

  This example requires DH private/public keys as inputs, created using a shared symmetric secret. Create the secret by passing the key length to `create_dh_parameters()`, then pass the secret as the “key length” to `create_asymmetric_priv_key()`.

  ```
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

* `asymmetric_encrypt(algorithm, str, key_str)`

  Encrypts a string using the given algorithm and key string, and returns the resulting ciphertext as a binary string. If encryption fails, the result is `NULL`.

  *`algorithm`* is the encryption algorithm used to create the key. The supported algorithm value is `'RSA'`.

  *`str`* is the string to encrypt. The length of this string cannot be greater than the key string length in bytes, minus 11 (to account for the padding).

  *`key_str`* is a valid PEM encoded RSA public or private key.

  To recover the original unencrypted string, pass the encrypted string to `asymmetric_decrypt()`, along with the other part of the key pair used for encryption, as in the following example:

  ```
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

  ```
  SET @s = a string to be encrypted
  SET @priv = a valid private RSA key string in PEM format
  SET @pub = the corresponding public RSA key string in PEM format
  ```

  Then these identity relationships hold:

  ```
  asymmetric_decrypt('RSA', asymmetric_encrypt('RSA', @s, @priv), @pub) = @s
  asymmetric_decrypt('RSA', asymmetric_encrypt('RSA', @s, @pub), @priv) = @s
  ```

* `asymmetric_sign(algorithm, digest_str, priv_key_str, digest_type)`

  Signs a digest string using a private key string, and returns the signature as a binary string. If signing fails, the result is `NULL`.

  *`algorithm`* is the encryption algorithm used to create the key. The supported algorithm values are `'RSA'` and `'DSA'`.

  *`digest_str`* is a digest string. A digest string can be generated by calling `create_digest()`.

  *`priv_key_str`* is the private key string to use for signing the digest string. It can be a valid PEM encoded RSA private key or DSA private key.

  *`digest_type`* is the algorithm to be used to sign the data. The supported *`digest_type`* values are `'SHA224'`, `'SHA256'`, `'SHA384'`, and `'SHA512'`.

  For a usage example, see the description of `asymmetric_verify()`.

* `asymmetric_verify(algorithm, digest_str, sig_str, pub_key_str, digest_type)`

  Verifies whether the signature string matches the digest string, and returns 1 or 0 to indicate whether verification succeeded or failed. If verification fails, the result is `NULL`.

  The `openssl_udf` shared library function cannot verify content produced by the `component_enterprise_encryption` functions that are available from MySQL 8.0.30.

  *`algorithm`* is the encryption algorithm used to create the key. The supported algorithm values are `'RSA'` and `'DSA'`.

  *`digest_str`* is the digest string. A digest string is required, and can be generated by calling `create_digest()`.

  *`sig_str`* is the signature string to be verified. A signature string can be generated by calling `asymmetric_sign()`.

  *`pub_key_str`* is the public key string of the signer. It corresponds to the private key passed to `asymmetric_sign()` to generate the signature string. It must be a valid PEM encoded RSA public key or DSA public key.

  *`digest_type`* is the algorithm that was used to sign the data. The supported *`digest_type`* values are `'SHA224'`, `'SHA256'`, `'SHA384'`, and `'SHA512'`.

  ```
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

  Creates a private key using the given algorithm and key length or DH secret, and returns the key as a binary string in PEM format. The key is in PKCS #1 format. If key generation fails, the result is `NULL`.

  *`algorithm`* is the encryption algorithm used to create the key. The supported algorithm values are `'RSA'`, `'DSA'`, and `'DH'`.

  *`key_len`* is the key length in bits for RSA and DSA keys. If you exceed the maximum allowed key length or specify less than the minimum, key generation fails and the result is null output. The minimum allowed key length in bits is 1,024, and the maximum allowed key length is 16,384 for the RSA algorithm or 10,000 for the DSA algorithm. These key-length limits are constraints imposed by OpenSSL. Server administrators can impose additional limits on maximum key length by setting the `MYSQL_OPENSSL_UDF_RSA_BITS_THRESHOLD`, `MYSQL_OPENSSL_UDF_DSA_BITS_THRESHOLD`, and `MYSQL_OPENSSL_UDF_DH_BITS_THRESHOLD` environment variables. See Section 8.6.2, “Configuring MySQL Enterprise Encryption”.

  Note

  Generating longer keys can consume significant CPU resources. Limiting the key length using the environment variables lets you provide adequate security for your requirements while balancing this with resource usage.

  *`dh_secret`* is a shared DH secret, which must be passed instead of a key length for DH keys. To create the secret, pass the key length to `create_dh_parameters()`.

  This example creates a 2,048-bit DSA private key, then derives a public key from the private key:

  ```
  SET @priv = create_asymmetric_priv_key('DSA', 2048);
  SET @pub = create_asymmetric_pub_key('DSA', @priv);
  ```

  For an example showing DH key generation, see the description of `asymmetric_derive()`.

* `create_asymmetric_pub_key(algorithm, priv_key_str)`

  Derives a public key from the given private key using the given algorithm, and returns the key as a binary string in PEM format. The key is in PKCS #1 format. If key derivation fails, the result is `NULL`.

  *`algorithm`* is the encryption algorithm used to create the key. The supported algorithm values are `'RSA'`, `'DSA'`, and `'DH'`.

  *`priv_key_str`* is a valid PEM encoded RSA, DSA, or DH private key.

  For a usage example, see the description of `create_asymmetric_priv_key()`.

* `create_dh_parameters(key_len)`

  Creates a shared secret for generating a DH private/public key pair and returns a binary string that can be passed to `create_asymmetric_priv_key()`. If secret generation fails, the result is `NULL`.

  *`key_len`* is the key length. The minimum and maximum key lengths in bits are 1,024 and 10,000. These key-length limits are constraints imposed by OpenSSL. Server administrators can impose additional limits on maximum key length by setting the `MYSQL_OPENSSL_UDF_RSA_BITS_THRESHOLD`, `MYSQL_OPENSSL_UDF_DSA_BITS_THRESHOLD`, and `MYSQL_OPENSSL_UDF_DH_BITS_THRESHOLD` environment variables. See Section 8.6.2, “Configuring MySQL Enterprise Encryption”.

  For an example showing how to use the return value for generating symmetric keys, see the description of `asymmetric_derive()`.

  ```
  SET @dhp = create_dh_parameters(1024);
  ```

* `create_digest(digest_type, str)`

  Creates a digest from the given string using the given digest type, and returns the digest as a binary string. If digest generation fails, the result is `NULL`.

  The resulting digest string is suitable for use with `asymmetric_sign()` and `asymmetric_verify()`. A digest is required for these functions.

  *`digest_type`* is the digest algorithm to be used to generate the digest string. The supported *`digest_type`* values are `'SHA224'`, `'SHA256'`, `'SHA384'`, and `'SHA512'`.

  *`str`* is the non-null data string for which the digest is to be generated.

  ```
  SET @dig = create_digest('SHA512', 'The quick brown fox');
  ```
