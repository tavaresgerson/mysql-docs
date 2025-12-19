--- title: MySQL 8.4 Reference Manual :: 14.13 Encryption and Compression Functions url: https://dev.mysql.com/doc/refman/8.4/en/encryption-functions.html order: 32 ---



## 14.13 Encryption and Compression Functions

**Table 14.18 Encryption Functions**

<table><col style="width: 28%"/><col style="width: 71%"/><thead><tr><th>Name</th> <th>Description</th> </tr></thead><tbody><tr><td><code>AES_DECRYPT()</code></td> <td> Decrypt using AES </td> </tr><tr><td><code>AES_ENCRYPT()</code></td> <td> Encrypt using AES </td> </tr><tr><td><code>COMPRESS()</code></td> <td> Return result as a binary string </td> </tr><tr><td><code>MD5()</code></td> <td> Calculate MD5 checksum </td> </tr><tr><td><code>RANDOM_BYTES()</code></td> <td> Return a random byte vector </td> </tr><tr><td><code>SHA1()</code>, <code>SHA()</code></td> <td> Calculate an SHA-1 160-bit checksum </td> </tr><tr><td><code>SHA2()</code></td> <td> Calculate an SHA-2 checksum </td> </tr><tr><td><code>STATEMENT_DIGEST()</code></td> <td> Compute statement digest hash value </td> </tr><tr><td><code>STATEMENT_DIGEST_TEXT()</code></td> <td> Compute normalized statement digest </td> </tr><tr><td><code>UNCOMPRESS()</code></td> <td> Uncompress a string compressed </td> </tr><tr><td><code>UNCOMPRESSED_LENGTH()</code></td> <td> Return the length of a string before compression </td> </tr><tr><td><code>VALIDATE_PASSWORD_STRENGTH()</code></td> <td> Determine strength of password </td> </tr></tbody></table>

Many encryption and compression functions return strings for which the result might contain arbitrary byte values. If you want to store these results, use a column with a `VARBINARY` or `BLOB` binary string data type. This avoids potential problems with trailing space removal or character set conversion that would change data values, such as may occur if you use a nonbinary string data type ( `CHAR`, `VARCHAR`, `TEXT`).

Some encryption functions return strings of ASCII characters: `MD5()`, `SHA()`, `SHA1()`, `SHA2()`, `STATEMENT_DIGEST()`, `STATEMENT_DIGEST_TEXT()`. Their return value is a string that has a character set and collation determined by the `character_set_connection` and `collation_connection` system variables. This is a nonbinary string unless the character set is `binary`.

If an application stores values from a function such as `MD5()` or `SHA1()` that returns a string of hex digits, more efficient storage and comparisons can be obtained by converting the hex representation to binary using `UNHEX()` and storing the result in a `BINARY(N)` column. Each pair of hexadecimal digits requires one byte in binary form, so the value of *`N`* depends on the length of the hex string. *`N`* is 16 for an  `MD5()` value and 20 for a `SHA1()` value. For `SHA2()`, *`N`* ranges from 28 to 32 depending on the argument specifying the desired bit length of the result.

The size penalty for storing the hex string in a `CHAR` column is at least two times, up to eight times if the value is stored in a column that uses the `utf8mb4` character set (where each character uses 4 bytes). Storing the string also results in slower comparisons because of the larger values and the need to take character set collation rules into account.

Suppose that an application stores `MD5()` string values in a `CHAR(32)` column:

```
CREATE TABLE md5_tbl (md5_val CHAR(32), ...);
INSERT INTO md5_tbl (md5_val, ...) VALUES(MD5('abcdef'), ...);
```

To convert hex strings to more compact form, modify the application to use  `UNHEX()` and `BINARY(16)` instead as follows:

```
CREATE TABLE md5_tbl (md5_val BINARY(16), ...);
INSERT INTO md5_tbl (md5_val, ...) VALUES(UNHEX(MD5('abcdef')), ...);
```

Applications should be prepared to handle the very rare case that a hashing function produces the same value for two different input values. One way to make collisions detectable is to make the hash column a primary key.

::: info Note

Exploits for the MD5 and SHA-1 algorithms have become known. You may wish to consider using another one-way encryption function described in this section instead, such as `SHA2()`.


::: Caution

Passwords or other sensitive values supplied as arguments to encryption functions are sent as cleartext to the MySQL server unless an SSL connection is used. Also, such values appear in any MySQL logs to which they are written. To avoid these types of exposure, applications can encrypt sensitive values on the client side before sending them to the server. The same considerations apply to encryption keys. To avoid exposing these, applications can use stored procedures to encrypt and decrypt values on the server side.

* [`AES_DECRYPT(crypt_str,key_str[,init_vector][,kdf_name][,salt][,info | iterations])`](encryption-functions.html#function_aes-decrypt)

  This function decrypts data using the official AES (Advanced Encryption Standard) algorithm. For more information, see the description of  `AES_ENCRYPT()`.

  Statements that use `AES_DECRYPT()` are unsafe for statement-based replication.
* [`AES_ENCRYPT(str,key_str[,init_vector][,kdf_name][,salt][,info | iterations])`](encryption-functions.html#function_aes-encrypt)

   `AES_ENCRYPT()` and `AES_DECRYPT()` implement encryption and decryption of data using the official AES (Advanced Encryption Standard) algorithm, previously known as “Rijndael.” The AES standard permits various key lengths. By default these functions implement AES with a 128-bit key length. Key lengths of 196 or 256 bits can be used, as described later. The key length is a trade off between performance and security.

   `AES_ENCRYPT()` encrypts the string *`str`* using the key string *`key_str`*, and returns a binary string containing the encrypted output. `AES_DECRYPT()` decrypts the encrypted string *`crypt_str`* using the key string *`key_str`*, and returns the original (binary) string in hexadecimal format. (To obtain the string as plaintext, cast the result to `CHAR`. Alternatively, start the **mysql** client with `--skip-binary-as-hex` to cause all binary values to be displayed as text.) If either function argument is `NULL`, the function returns `NULL`. If `AES_DECRYPT()` detects invalid data or incorrect padding, it returns `NULL`. However, it is possible for `AES_DECRYPT()` to return a non-`NULL` value (possibly garbage) if the input data or the key is invalid.

  These functions support the use of a key derivation function (KDF) to create a cryptographically strong secret key from the information passed in *`key_str`*. The derived key is used to encrypt and decrypt the data, and it remains in the MySQL Server instance and is not accessible to users. Using a KDF is highly recommended, as it provides better security than specifying your own premade key or deriving it by a simpler method as you use the function. The functions support HKDF (available from OpenSSL 1.1.0), for which you can specify an optional salt and context-specific information to include in the keying material, and PBKDF2 (available from OpenSSL 1.0.2), for which you can specify an optional salt and set the number of iterations used to produce the key.

   `AES_ENCRYPT()` and `AES_DECRYPT()` permit control of the block encryption mode. The `block_encryption_mode` system variable controls the mode for block-based encryption algorithms. Its default value is `aes-128-ecb`, which signifies encryption using a key length of 128 bits and ECB mode. For a description of the permitted values of this variable, see Section 7.1.8, “Server System Variables”. The optional *`init_vector`* argument is used to provide an initialization vector for block encryption modes that require it.

  Statements that use `AES_ENCRYPT()` or `AES_DECRYPT()` are unsafe for statement-based replication.

  If  `AES_ENCRYPT()` is invoked from within the  **mysql** client, binary strings display using hexadecimal notation, depending on the value of the  `--binary-as-hex`. For more information about that option, see Section 6.5.1, “mysql — The MySQL Command-Line Client”.

  The arguments for the `AES_ENCRYPT()` and `AES_DECRYPT()` functions are as follows:

  *`str`* :   The string for `AES_ENCRYPT()` to encrypt using the key string *`key_str`*, or the key derived from it by the specified KDF. The string can be any length. Padding is automatically added to *`str`* so it is a multiple of a block as required by block-based algorithms such as AES. This padding is automatically removed by the `AES_DECRYPT()` function.

  *`crypt_str`* :   The encrypted string for `AES_DECRYPT()` to decrypt using the key string *`key_str`*, or the key derived from it by the specified KDF. The string can be any length. The length of *`crypt_str`* can be calculated from the length of the original string using this formula:

      ```
      16 * (trunc(string_length / 16) + 1)
      ```

  *`key_str`* :   The encryption key, or the input keying material that is used as the basis for deriving a key using a key derivation function (KDF). For the same instance of data, use the same value of *`key_str`* for encryption with `AES_ENCRYPT()` and decryption with `AES_DECRYPT()`.

      If you are using a KDF, *`key_str`* can be any arbitrary information such as a password or passphrase. In the further arguments for the function, you specify the KDF name, then add further options to increase the security as appropriate for the KDF.

      When you use a KDF, the function creates a cryptographically strong secret key from the information passed in *`key_str`* and any salt or additional information that you provide in the other arguments. The derived key is used to encrypt and decrypt the data, and it remains in the MySQL Server instance and is not accessible to users. Using a KDF is highly recommended, as it provides better security than specifying your own premade key or deriving it by a simpler method as you use the function.

      If you are not using a KDF, for a key length of 128 bits, the most secure way to pass a key to the *`key_str`* argument is to create a truly random 128-bit value and pass it as a binary value. For example:

      ```
      INSERT INTO t
      VALUES (1,AES_ENCRYPT('text',UNHEX('F3229A0B371ED2D9441B830D21A390C3')));
      ```

      A passphrase can be used to generate an AES key by hashing the passphrase. For example:

      ```
      INSERT INTO t
      VALUES (1,AES_ENCRYPT('text', UNHEX(SHA2('My secret passphrase',512))));
      ```

      If you exceed the maximum key length of 128 bits, a warning is returned. If you are not using a KDF, do not pass a password or passphrase directly to *`key_str`*, hash it first. Previous versions of this documentation suggested the former approach, but it is no longer recommended as the examples shown here are more secure.

  *`init_vector`* :   An initialization vector, for block encryption modes that require it. The `block_encryption_mode` system variable controls the mode. For the same instance of data, use the same value of *`init_vector`* for encryption with  `AES_ENCRYPT()` and decryption with `AES_DECRYPT()`.

      ::: info Note

      If you are using a KDF, you must specify an initialization vector or a null string for this argument, in order to access the later arguments to define the KDF.


      :::

      For modes that require an initialization vector, it must be 16 bytes or longer (bytes in excess of 16 are ignored). An error occurs if *`init_vector`* is missing. For modes that do not require an initialization vector, it is ignored and a warning is generated if *`init_vector`* is specified, unless you are using a KDF.

      The default value for the `block_encryption_mode` system variable is `aes-128-ecb`, or ECB mode, which does not require an initialization vector. The alternative permitted block encryption modes CBC, CFB1, CFB8, CFB128, and OFB all require an initialization vector.

      A random string of bytes to use for the initialization vector can be produced by calling `RANDOM_BYTES(16)`.

  *`kdf_name`* :   The name of the key derivation function (KDF) to create a key from the input keying material passed in *`key_str`*, and other arguments as appropriate for the KDF. Optional.

      For the same instance of data, use the same value of *`kdf_name`* for encryption with `AES_ENCRYPT()` and decryption with `AES_DECRYPT()`. When you specify *`kdf_name`*, you must specify *`init_vector`*, using either a valid initialization vector, or a null string if the encryption mode does not require an initialization vector.

      The following values are supported:

      `hkdf` :   HKDF, which is available from OpenSSL 1.1.0. HKDF extracts a pseudorandom key from the keying material then expands it into additional keys. With HKDF, you can specify an optional salt (*`salt`*) and context-specific information such as application details (*`info`*) to include in the keying material.

      `pbkdf2_hmac` :   PBKDF2, which is available from OpenSSL 1.0.2. PBKDF2 applies a pseudorandom function to the keying material, and repeats this process a large number of times to produce the key. With PBKDF2, you can specify an optional salt (*`salt`*) to include in the keying material, and set the number of iterations used to produce the key (*`iterations`*).

      In this example, HKDF is specified as the key derivation function, and a salt and context information are provided. The argument for the initialization vector is included but is the empty string:

      ```
      SELECT AES_ENCRYPT('mytext','mykeystring', '', 'hkdf', 'salt', 'info');
      ```

      In this example, PBKDF2 is specified as the key derivation function, a salt is provided, and the number of iterations is doubled from the recommended minimum:

      ```
      SELECT AES_ENCRYPT('mytext','mykeystring', '', 'pbkdf2_hmac','salt', '2000');
      ```

  *`salt`* :   A salt to be passed to the key derivation function (KDF). Optional. Both HKDF and PBKDF2 can use salts, and their use is recommended to help prevent attacks based on dictionaries of common passwords or rainbow tables.

      A salt consists of random data, which for security must be different for each encryption operation. A random string of bytes to use for the salt can be produced by calling  `RANDOM_BYTES()`. This example produces a 64-bit salt:

      ```
      SET @salt = RANDOM_BYTES(8);
      ```

      For the same instance of data, use the same value of *`salt`* for encryption with `AES_ENCRYPT()` and decryption with `AES_DECRYPT()`. The salt can safely be stored along with the encrypted data.

  *`info`* :   Context-specific information for HKDF to include in the keying material, such as information about the application. Optional; available when you specify `hkdf` as the KDF name. HKDF adds this information to the keying material specified in *`key_str`* and the salt specified in *`salt`* to produce the key.

      For the same instance of data, use the same value of *`info`* for encryption with `AES_ENCRYPT()` and decryption with `AES_DECRYPT()`.

  *`iterations`* :   The iteration count for PBKDF2 to use when producing the key. Optional; available when you specify `pbkdf2_hmac` as the KDF name. A higher count gives greater resistance to brute-force attacks because it has a greater computational cost for the attacker, but the same is necessarily true for the key derivation process. The default if you do not specify this argument is 1000, which is the minimum recommended by the OpenSSL standard.

      For the same instance of data, use the same value of *`iterations`* for encryption with  `AES_ENCRYPT()` and decryption with `AES_DECRYPT()`.

  ```
  mysql> SET block_encryption_mode = 'aes-256-cbc';
  mysql> SET @key_str = SHA2('My secret passphrase',512);
  mysql> SET @init_vector = RANDOM_BYTES(16);
  mysql> SET @crypt_str = AES_ENCRYPT('text',@key_str,@init_vector);
  mysql> SELECT CAST(AES_DECRYPT(@crypt_str,@key_str,@init_vector) AS CHAR);
  +-------------------------------------------------------------+
  | CAST(AES_DECRYPT(@crypt_str,@key_str,@init_vector) AS CHAR) |
  +-------------------------------------------------------------+
  | text                                                        |
  +-------------------------------------------------------------+
  ```
*  `COMPRESS(string_to_compress)`

  Compresses a string and returns the result as a binary string. This function requires MySQL to have been compiled with a compression library such as `zlib`. Otherwise, the return value is always `NULL`. The return value is also `NULL` if *`string_to_compress`* is `NULL`. The compressed string can be uncompressed with  `UNCOMPRESS()`.

  ```
  mysql> SELECT LENGTH(COMPRESS(REPEAT('a',1000)));
          -> 21
  mysql> SELECT LENGTH(COMPRESS(''));
          -> 0
  mysql> SELECT LENGTH(COMPRESS('a'));
          -> 13
  mysql> SELECT LENGTH(COMPRESS(REPEAT('a',16)));
          -> 15
  ```

  The compressed string contents are stored the following way:

  + Empty strings are stored as empty strings.
  + Nonempty strings are stored as a 4-byte length of the uncompressed string (low byte first), followed by the compressed string. If the string ends with space, an extra `.` character is added to avoid problems with endspace trimming should the result be stored in a `CHAR` or `VARCHAR` column. (However, use of nonbinary string data types such as `CHAR` or `VARCHAR` to store compressed strings is not recommended anyway because character set conversion may occur. Use a `VARBINARY` or `BLOB` binary string column instead.)

  If  `COMPRESS()` is invoked from within the  **mysql** client, binary strings display using hexadecimal notation, depending on the value of the  `--binary-as-hex`. For more information about that option, see  Section 6.5.1, “mysql — The MySQL Command-Line Client”.
*  `MD5(str)`

  Calculates an MD5 128-bit checksum for the string. The value is returned as a string of 32 hexadecimal digits, or `NULL` if the argument was `NULL`. The return value can, for example, be used as a hash key. See the notes at the beginning of this section about storing hash values efficiently.

  The return value is a string in the connection character set.

  If FIPS mode is enabled, `MD5()` returns `NULL`. See  Section 8.8, “FIPS Support”.

  ```
  mysql> SELECT MD5('testing');
          -> 'ae2b1fca515949e5d54fb22b8ed95575'
  ```

  This is the “RSA Data Security, Inc. MD5 Message-Digest Algorithm.”

  See the note regarding the MD5 algorithm at the beginning this section.
*  `RANDOM_BYTES(len)`

  This function returns a binary string of *`len`* random bytes generated using the random number generator of the SSL library. Permitted values of *`len`* range from 1 to 1024. For values outside that range, an error occurs. Returns `NULL` if *`len`* is `NULL`.

   `RANDOM_BYTES()` can be used to provide the initialization vector for the `AES_DECRYPT()` and `AES_ENCRYPT()` functions. For use in that context, *`len`* must be at least 16. Larger values are permitted, but bytes in excess of 16 are ignored.

   `RANDOM_BYTES()` generates a random value, which makes its result nondeterministic. Consequently, statements that use this function are unsafe for statement-based replication.

  If  `RANDOM_BYTES()` is invoked from within the  **mysql** client, binary strings display using hexadecimal notation, depending on the value of the  `--binary-as-hex`. For more information about that option, see Section 6.5.1, “mysql — The MySQL Command-Line Client”.
*  `SHA1(str)`, `SHA(str)`

  Calculates an SHA-1 160-bit checksum for the string, as described in RFC 3174 (Secure Hash Algorithm). The value is returned as a string of 40 hexadecimal digits, or `NULL` if the argument is `NULL`. One of the possible uses for this function is as a hash key. See the notes at the beginning of this section about storing hash values efficiently. `SHA()` is synonymous with  `SHA1()`.

  The return value is a string in the connection character set.

  ```
  mysql> SELECT SHA1('abc');
          -> 'a9993e364706816aba3e25717850c26c9cd0d89d'
  ```

   `SHA1()` can be considered a cryptographically more secure equivalent of `MD5()`. However, see the note regarding the MD5 and SHA-1 algorithms at the beginning this section.
* [`SHA2(str, hash_length)`](encryption-functions.html#function_sha2)

  Calculates the SHA-2 family of hash functions (SHA-224, SHA-256, SHA-384, and SHA-512). The first argument is the plaintext string to be hashed. The second argument indicates the desired bit length of the result, which must have a value of 224, 256, 384, 512, or 0 (which is equivalent to 256). If either argument is `NULL` or the hash length is not one of the permitted values, the return value is `NULL`. Otherwise, the function result is a hash value containing the desired number of bits. See the notes at the beginning of this section about storing hash values efficiently.

  The return value is a string in the connection character set.

  ```
  mysql> SELECT SHA2('abc', 224);
          -> '23097d223405d8228642a477bda255b32aadbce4bda0b3f7e36c9da7'
  ```

  This function works only if MySQL has been configured with SSL support. See  Section 8.3, “Using Encrypted Connections”.

   `SHA2()` can be considered cryptographically more secure than `MD5()` or `SHA1()`.
*  `STATEMENT_DIGEST(statement)`

  Given an SQL statement as a string, returns the statement digest hash value as a string in the connection character set, or `NULL` if the argument is `NULL`. The related `STATEMENT_DIGEST_TEXT()` function returns the normalized statement digest. For information about statement digesting, see Section 29.10, “Performance Schema Statement Digests and Sampling”.

  Both functions use the MySQL parser to parse the statement. If parsing fails, an error occurs. The error message includes the parse error only if the statement is provided as a literal string.

  The  `max_digest_length` system variable determines the maximum number of bytes available to these functions for computing normalized statement digests.

  ```
  mysql> SET @stmt = 'SELECT * FROM mytable WHERE cola = 10 AND colb = 20';
  mysql> SELECT STATEMENT_DIGEST(@stmt);
  +------------------------------------------------------------------+
  | STATEMENT_DIGEST(@stmt)                                          |
  +------------------------------------------------------------------+
  | 3bb95eeade896657c4526e74ff2a2862039d0a0fe8a9e7155b5fe492cbd78387 |
  +------------------------------------------------------------------+
  mysql> SELECT STATEMENT_DIGEST_TEXT(@stmt);
  +----------------------------------------------------------+
  | STATEMENT_DIGEST_TEXT(@stmt)                             |
  +----------------------------------------------------------+
  | SELECT * FROM `mytable` WHERE `cola` = ? AND `colb` = ?  |
  +----------------------------------------------------------+
  ```
*  `STATEMENT_DIGEST_TEXT(statement)`

  Given an SQL statement as a string, returns the normalized statement digest as a string in the connection character set, or `NULL` if the argument is `NULL`. For additional discussion and examples, see the description of the related `STATEMENT_DIGEST()` function.
*  `UNCOMPRESS(string_to_uncompress)`

  Uncompresses a string compressed by the `COMPRESS()` function. If the argument is not a compressed value, the result is `NULL`; if *`string_to_uncompress`* is `NULL`, the result is also `NULL`. This function requires MySQL to have been compiled with a compression library such as `zlib`. Otherwise, the return value is always `NULL`.

  ```
  mysql> SELECT UNCOMPRESS(COMPRESS('any string'));
          -> 'any string'
  mysql> SELECT UNCOMPRESS('any string');
          -> NULL
  ```
*  `UNCOMPRESSED_LENGTH(compressed_string)`

  Returns the length that the compressed string had before being compressed. Returns `NULL` if *`compressed_string`* is `NULL`.

  ```
  mysql> SELECT UNCOMPRESSED_LENGTH(COMPRESS(REPEAT('a',30)));
          -> 30
  ```
*  `VALIDATE_PASSWORD_STRENGTH(str)`

  Given an argument representing a plaintext password, this function returns an integer to indicate how strong the password is, or `NULL` if the argument is `NULL`. The return value ranges from 0 (weak) to 100 (strong).

  Password assessment by `VALIDATE_PASSWORD_STRENGTH()` is done by the `validate_password` component. If that component is not installed, the function always returns
  0. For information about installing `validate_password`, see Section 8.4.3, “The Password Validation Component”. To examine or configure the parameters that affect password testing, check or set the system variables implemented by `validate_password`. See Section 8.4.3.2, “Password Validation Options and Variables”.

  The password is subjected to increasingly strict tests and the return value reflects which tests were satisfied, as shown in the following table. In addition, if the `validate_password.check_user_name` system variable is enabled and the password matches the user name, `VALIDATE_PASSWORD_STRENGTH()` returns 0 regardless of how other `validate_password` system variables are set.

  <table><col style="width: 60%"/><col style="width: 20%"/><thead><tr> <th>Password Test</th> <th>Return Value</th> </tr></thead><tbody><tr> <td>Length &lt; 4</td> <td>0</td> </tr><tr> <td>Length ≥ 4 and &lt; <code>validate_password.length</code></td> <td>25</td> </tr><tr> <td>Satisfies policy 1 (<code>LOW</code>)</td> <td>50</td> </tr><tr> <td>Satisfies policy 2 (<code>MEDIUM</code>)</td> <td>75</td> </tr><tr> <td>Satisfies policy 3 (<code>STRONG</code>)</td> <td>100</td> </tr></tbody></table>

