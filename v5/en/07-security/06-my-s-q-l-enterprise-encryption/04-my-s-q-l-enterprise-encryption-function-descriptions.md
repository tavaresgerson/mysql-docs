### 6.6.4 MySQL Enterprise Encryption Function Descriptions

MySQL Enterprise Encryption functions have these general characteristics:

* For arguments of the wrong type or an incorrect number of arguments, each function returns an error.

* If the arguments are not suitable to permit a function to perform the requested operation, it returns `NULL` or 0 as appropriate. This occurs, for example, if a function does not support a specified algorithm, a key length is too short or long, or a string expected to be a key string in PEM format is not a valid key. (OpenSSL imposes its own key-length limits, and server administrators can impose additional limits on maximum key length by setting environment variables. See [Section 6.6.2, “MySQL Enterprise Encryption Usage and Examples”](enterprise-encryption-usage.html "6.6.2 MySQL Enterprise Encryption Usage and Examples").)

* The underlying SSL library takes care of randomness initialization.

Several of the functions take an encryption algorithm argument. The following table summarizes the supported algorithms by function.

**Table 6.37 Supported Algorithms by Function**

<table summary="Supported encryption algorithms by function."><col style="width: 50%"/><col style="width: 50%"/><thead><tr> <th>Function</th> <th>Supported Algorithms</th> </tr></thead><tbody><tr> <td><a class="link" href="enterprise-encryption-functions.html#function_asymmetric-decrypt"><code>asymmetric_decrypt()</code></a></td> <td>RSA</td> </tr><tr> <td><a class="link" href="enterprise-encryption-functions.html#function_asymmetric-derive"><code>asymmetric_derive()</code></a></td> <td>DH</td> </tr><tr> <td><a class="link" href="enterprise-encryption-functions.html#function_asymmetric-encrypt"><code>asymmetric_encrypt()</code></a></td> <td>RSA</td> </tr><tr> <td><a class="link" href="enterprise-encryption-functions.html#function_asymmetric-sign"><code>asymmetric_sign()</code></a></td> <td>RSA, DSA</td> </tr><tr> <td><a class="link" href="enterprise-encryption-functions.html#function_asymmetric-verify"><code>asymmetric_verify()</code></a></td> <td>RSA, DSA</td> </tr><tr> <td><a class="link" href="enterprise-encryption-functions.html#function_create-asymmetric-priv-key"><code>create_asymmetric_priv_key()</code></a></td> <td>RSA, DSA, DH</td> </tr><tr> <td><a class="link" href="enterprise-encryption-functions.html#function_create-asymmetric-pub-key"><code>create_asymmetric_pub_key()</code></a></td> <td>RSA, DSA, DH</td> </tr><tr> <td><a class="link" href="enterprise-encryption-functions.html#function_create-dh-parameters"><code>create_dh_parameters()</code></a></td> <td>DH</td> </tr></tbody></table>

Note

Although you can create keys using any of the RSA, DSA, or DH encryption algorithms, other functions that take key arguments might accept only certain types of keys. For example, [`asymmetric_encrypt()`](enterprise-encryption-functions.html#function_asymmetric-encrypt) and [`asymmetric_decrypt()`](enterprise-encryption-functions.html#function_asymmetric-decrypt) accept only RSA keys.

The following descriptions describe the calling sequences for MySQL Enterprise Encryption functions. For additional examples and discussion, see [Section 6.6.2, “MySQL Enterprise Encryption Usage and Examples”](enterprise-encryption-usage.html "6.6.2 MySQL Enterprise Encryption Usage and Examples").

* [`asymmetric_decrypt(algorithm, crypt_str, key_str)`](enterprise-encryption-functions.html#function_asymmetric-decrypt)

  Decrypts an encrypted string using the given algorithm and key string, and returns the resulting plaintext as a binary string. If decryption fails, the result is `NULL`.

  *`key_str`* must be a valid key string in PEM format. For successful decryption, it must be the public or private key string corresponding to the private or public key string used with [`asymmetric_encrypt()`](enterprise-encryption-functions.html#function_asymmetric-encrypt) to produce the encrypted string. *`algorithm`* indicates the encryption algorithm used to create the key.

  Supported *`algorithm`* values: `'RSA'`

  For a usage example, see the description of [`asymmetric_encrypt()`](enterprise-encryption-functions.html#function_asymmetric-encrypt).

* [`asymmetric_derive(pub_key_str, priv_key_str)`](enterprise-encryption-functions.html#function_asymmetric-derive)

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

* [`asymmetric_encrypt(algorithm, str, key_str)`](enterprise-encryption-functions.html#function_asymmetric-encrypt)

  Encrypts a string using the given algorithm and key string, and returns the resulting ciphertext as a binary string. If encryption fails, the result is `NULL`.

  The *`str`* length cannot be greater than the *`key_str`* length − 11, in bytes

  *`key_str`* must be a valid key string in PEM format. *`algorithm`* indicates the encryption algorithm used to create the key.

  Supported *`algorithm`* values: `'RSA'`

  To encrypt a string, pass a private or public key string to [`asymmetric_encrypt()`](enterprise-encryption-functions.html#function_asymmetric-encrypt). To recover the original unencrypted string, pass the encrypted string to [`asymmetric_decrypt()`](enterprise-encryption-functions.html#function_asymmetric-decrypt), along with the public or private key string correponding to the private or public key string used for encryption.

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

* [`asymmetric_sign(algorithm, digest_str, priv_key_str, digest_type)`](enterprise-encryption-functions.html#function_asymmetric-sign)

  Signs a digest string using a private key string, and returns the signature as a binary string. If signing fails, the result is `NULL`.

  *`digest_str`* is the digest string. It can be generated by calling [`create_digest()`](enterprise-encryption-functions.html#function_create-digest). *`digest_type`* indicates the digest algorithm used to generate the digest string.

  *`priv_key_str`* is the private key string to use for signing the digest string. It must be a valid key string in PEM format. *`algorithm`* indicates the encryption algorithm used to create the key.

  Supported *`algorithm`* values: `'RSA'`, `'DSA'`

  Supported *`digest_type`* values: `'SHA224'`, `'SHA256'`, `'SHA384'`, `'SHA512'`

  For a usage example, see the description of [`asymmetric_verify()`](enterprise-encryption-functions.html#function_asymmetric-verify).

* [`asymmetric_verify(algorithm, digest_str, sig_str, pub_key_str, digest_type)`](enterprise-encryption-functions.html#function_asymmetric-verify)

  Verifies whether the signature string matches the digest string, and returns 1 or 0 to indicate whether verification succeeded or failed.

  *`digest_str`* is the digest string. It can be generated by calling [`create_digest()`](enterprise-encryption-functions.html#function_create-digest). *`digest_type`* indicates the digest algorithm used to generate the digest string.

  *`sig_str`* is the signature string. It can be generated by calling [`asymmetric_sign()`](enterprise-encryption-functions.html#function_asymmetric-sign).

  *`pub_key_str`* is the public key string of the signer. It corresponds to the private key passed to [`asymmetric_sign()`](enterprise-encryption-functions.html#function_asymmetric-sign) to generate the signature string and must be a valid key string in PEM format. *`algorithm`* indicates the encryption algorithm used to create the key.

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

* [`create_asymmetric_priv_key(algorithm, {key_len|dh_secret})`](enterprise-encryption-functions.html#function_create-asymmetric-priv-key)

  Creates a private key using the given algorithm and key length or DH secret, and returns the key as a binary string in PEM format. If key generation fails, the result is `NULL`.

  Supported *`algorithm`* values: `'RSA'`, `'DSA'`, `'DH'`

  Supported *`key_len`* values: The minimum key length in bits is 1,024. The maximum key length depends on the algorithm: 16,384 for RSA and 10,000 for DSA. These key-length limits are constraints imposed by OpenSSL. Server administrators can impose additional limits on maximum key length by setting environment variables. See [Section 6.6.2, “MySQL Enterprise Encryption Usage and Examples”](enterprise-encryption-usage.html "6.6.2 MySQL Enterprise Encryption Usage and Examples").

  For DH keys, pass a shared DH secret instead of a key length. To create the secret, pass the key length to [`create_dh_parameters()`](enterprise-encryption-functions.html#function_create-dh-parameters).

  This example creates a 2,048-bit DSA private key, then derives a public key from the private key:

  ```sql
  SET @priv = create_asymmetric_priv_key('DSA', 2048);
  SET @pub = create_asymmetric_pub_key('DSA', @priv);
  ```

  For an example showing DH key generation, see the description of [`asymmetric_derive()`](enterprise-encryption-functions.html#function_asymmetric-derive).

  Some general considerations in choosing key lengths and encryption algorithms:

  + The strength of encryption for private and public keys increases with the key size, but the time for key generation increases as well.

  + Generation of DH keys takes much longer than RSA or RSA keys.

  + Asymmetric encryption functions are slower than symmetric functions. If performance is an important factor and the functions are to be used very frequently, you are better off using symmetric encryption. For example, consider using [`AES_ENCRYPT()`](encryption-functions.html#function_aes-encrypt) and [`AES_DECRYPT()`](encryption-functions.html#function_aes-decrypt).

* [`create_asymmetric_pub_key(algorithm, priv_key_str)`](enterprise-encryption-functions.html#function_create-asymmetric-pub-key)

  Derives a public key from the given private key using the given algorithm, and returns the key as a binary string in PEM format. If key derivation fails, the result is `NULL`.

  *`priv_key_str`* must be a valid key string in PEM format. *`algorithm`* indicates the encryption algorithm used to create the key.

  Supported *`algorithm`* values: `'RSA'`, `'DSA'`, `'DH'`

  For a usage example, see the description of [`create_asymmetric_priv_key()`](enterprise-encryption-functions.html#function_create-asymmetric-priv-key).

* [`create_dh_parameters(key_len)`](enterprise-encryption-functions.html#function_create-dh-parameters)

  Creates a shared secret for generating a DH private/public key pair and returns a binary string that can be passed to [`create_asymmetric_priv_key()`](enterprise-encryption-functions.html#function_create-asymmetric-priv-key). If secret generation fails, the result is null.

  Supported *`key_len`* values: The minimum and maximum key lengths in bits are 1,024 and 10,000. These key-length limits are constraints imposed by OpenSSL. Server administrators can impose additional limits on maximum key length by setting environment variables. See [Section 6.6.2, “MySQL Enterprise Encryption Usage and Examples”](enterprise-encryption-usage.html "6.6.2 MySQL Enterprise Encryption Usage and Examples").

  For an example showing how to use the return value for generating symmetric keys, see the description of [`asymmetric_derive()`](enterprise-encryption-functions.html#function_asymmetric-derive).

  ```sql
  SET @dhp = create_dh_parameters(1024);
  ```

* [`create_digest(digest_type, str)`](enterprise-encryption-functions.html#function_create-digest)

  Creates a digest from the given string using the given digest type, and returns the digest as a binary string. If digest generation fails, the result is `NULL`.

  Supported *`digest_type`* values: `'SHA224'`, `'SHA256'`, `'SHA384'`, `'SHA512'`

  ```sql
  SET @dig = create_digest('SHA512', The quick brown fox');
  ```

  The resulting digest string is suitable for use with [`asymmetric_sign()`](enterprise-encryption-functions.html#function_asymmetric-sign) and [`asymmetric_verify()`](enterprise-encryption-functions.html#function_asymmetric-verify).
