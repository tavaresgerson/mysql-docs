## 14.13 Encryption and Compression Functions

**Table 14.18 Encryption Functions**

<table frame="box" rules="all" summary="A reference that lists encryption functions."><col style="width: 28%"/><col style="width: 71%"/><thead><tr><th>Name</th>
<th>Description</th>
</tr></thead><tbody><tr><td><a class="link" href="encryption-functions.html#function_aes-decrypt"><code class="literal">AES_DECRYPT()</code></a></td>
<td>
      Decrypt using AES
    </td>
</tr><tr><td><a class="link" href="encryption-functions.html#function_aes-encrypt"><code class="literal">AES_ENCRYPT()</code></a></td>
<td>
      Encrypt using AES
    </td>
</tr><tr><td><a class="link" href="encryption-functions.html#function_compress"><code class="literal">COMPRESS()</code></a></td>
<td>
      Return result as a binary string
    </td>
</tr><tr><td><a class="link" href="encryption-functions.html#function_md5"><code class="literal">MD5()</code></a></td>
<td>
      Calculate MD5 checksum
    </td>
</tr><tr><td><a class="link" href="encryption-functions.html#function_random-bytes"><code class="literal">RANDOM_BYTES()</code></a></td>
<td>
      Return a random byte vector
    </td>
</tr><tr><td><a class="link" href="encryption-functions.html#function_sha1"><code class="literal">SHA1()</code>, <code class="literal">SHA()</code></a></td>
<td>
      Calculate an SHA-1 160-bit checksum
    </td>
</tr><tr><td><a class="link" href="encryption-functions.html#function_sha2"><code class="literal">SHA2()</code></a></td>
<td>
      Calculate an SHA-2 checksum
    </td>
</tr><tr><td><a class="link" href="encryption-functions.html#function_statement-digest"><code class="literal">STATEMENT_DIGEST()</code></a></td>
<td>
      Compute statement digest hash value
    </td>
</tr><tr><td><a class="link" href="encryption-functions.html#function_statement-digest-text"><code class="literal">STATEMENT_DIGEST_TEXT()</code></a></td>
<td>
      Compute normalized statement digest
    </td>
</tr><tr><td><a class="link" href="encryption-functions.html#function_uncompress"><code class="literal">UNCOMPRESS()</code></a></td>
<td>
      Uncompress a string compressed
    </td>
</tr><tr><td><a class="link" href="encryption-functions.html#function_uncompressed-length"><code class="literal">UNCOMPRESSED_LENGTH()</code></a></td>
<td>
      Return the length of a string before compression
    </td>
</tr><tr><td><a class="link" href="encryption-functions.html#function_validate-password-strength"><code class="literal">VALIDATE_PASSWORD_STRENGTH()</code></a></td>
<td>
      Determine strength of password
    </td>
</tr></tbody></table>

Many encryption and compression functions return strings for which
the result might contain arbitrary byte values. If you want to
store these results, use a column with a
[`VARBINARY`](binary-varbinary.html "13.3.3 The BINARY and VARBINARY Types") or
[`BLOB`](blob.html "13.3.4 The BLOB and TEXT Types") binary string data type. This
avoids potential problems with trailing space removal or character
set conversion that would change data values, such as may occur if
you use a nonbinary string data type
([`CHAR`](char.html "13.3.2 The CHAR and VARCHAR Types"),
[`VARCHAR`](char.html "13.3.2 The CHAR and VARCHAR Types"),
[`TEXT`](blob.html "13.3.4 The BLOB and TEXT Types")).

Some encryption functions return strings of ASCII characters:
[`MD5()`](encryption-functions.html#function_md5),
[`SHA()`](encryption-functions.html#function_sha1),
[`SHA1()`](encryption-functions.html#function_sha1),
[`SHA2()`](encryption-functions.html#function_sha2),
[`STATEMENT_DIGEST()`](encryption-functions.html#function_statement-digest),
[`STATEMENT_DIGEST_TEXT()`](encryption-functions.html#function_statement-digest-text). Their
return value is a string that has a character set and collation
determined by the
[`character_set_connection`](server-system-variables.html#sysvar_character_set_connection) and
[`collation_connection`](server-system-variables.html#sysvar_collation_connection) system
variables. This is a nonbinary string unless the character set is
`binary`.

If an application stores values from a function such as
[`MD5()`](encryption-functions.html#function_md5) or
[`SHA1()`](encryption-functions.html#function_sha1) that returns a string of hex
digits, more efficient storage and comparisons can be obtained by
converting the hex representation to binary using
[`UNHEX()`](string-functions.html#function_unhex) and storing the result in a
[`BINARY(N)`](binary-varbinary.html "13.3.3 The BINARY and VARBINARY Types")
column. Each pair of hexadecimal digits requires one byte in
binary form, so the value of *`N`* depends
on the length of the hex string. *`N`* is
16 for an [`MD5()`](encryption-functions.html#function_md5) value and 20 for a
[`SHA1()`](encryption-functions.html#function_sha1) value. For
[`SHA2()`](encryption-functions.html#function_sha2),
*`N`* ranges from 28 to 32 depending on the
argument specifying the desired bit length of the result.

The size penalty for storing the hex string in a
[`CHAR`](char.html "13.3.2 The CHAR and VARCHAR Types") column is at least two times,
up to eight times if the value is stored in a column that uses the
`utf8mb4` character set (where each character
uses 4 bytes). Storing the string also results in slower
comparisons because of the larger values and the need to take
character set collation rules into account.

Suppose that an application stores
[`MD5()`](encryption-functions.html#function_md5) string values in a
[`CHAR(32)`](char.html "13.3.2 The CHAR and VARCHAR Types") column:

```
CREATE TABLE md5_tbl (md5_val CHAR(32), ...);
INSERT INTO md5_tbl (md5_val, ...) VALUES(MD5('abcdef'), ...);
```

To convert hex strings to more compact form, modify the
application to use [`UNHEX()`](string-functions.html#function_unhex) and
[`BINARY(16)`](binary-varbinary.html "13.3.3 The BINARY and VARBINARY Types") instead as follows:

```
CREATE TABLE md5_tbl (md5_val BINARY(16), ...);
INSERT INTO md5_tbl (md5_val, ...) VALUES(UNHEX(MD5('abcdef')), ...);
```

Applications should be prepared to handle the very rare case that
a hashing function produces the same value for two different input
values. One way to make collisions detectable is to make the hash
column a primary key.

Note

Exploits for the MD5 and SHA-1 algorithms have become known. You
may wish to consider using another one-way encryption function
described in this section instead, such as
[`SHA2()`](encryption-functions.html#function_sha2).

Caution

Passwords or other sensitive values supplied as arguments to
encryption functions are sent as cleartext to the MySQL server
unless an SSL connection is used. Also, such values appear in
any MySQL logs to which they are written. To avoid these types
of exposure, applications can encrypt sensitive values on the
client side before sending them to the server. The same
considerations apply to encryption keys. To avoid exposing
these, applications can use stored procedures to encrypt and
decrypt values on the server side.

* [`AES_DECRYPT(crypt_str,key_str[,init_vector][,kdf_name][,salt][,info
  | iterations])`](encryption-functions.html#function_aes-decrypt)

  This function decrypts data using the official AES (Advanced
  Encryption Standard) algorithm. For more information, see the
  description of [`AES_ENCRYPT()`](encryption-functions.html#function_aes-encrypt).

  Statements that use
  [`AES_DECRYPT()`](encryption-functions.html#function_aes-decrypt) are unsafe for
  statement-based replication.

* [`AES_ENCRYPT(str,key_str[,init_vector][,kdf_name][,salt][,info
  | iterations])`](encryption-functions.html#function_aes-encrypt)

  [`AES_ENCRYPT()`](encryption-functions.html#function_aes-encrypt) and
  [`AES_DECRYPT()`](encryption-functions.html#function_aes-decrypt) implement
  encryption and decryption of data using the official AES
  (Advanced Encryption Standard) algorithm, previously known as
  “Rijndael.” The AES standard permits various key
  lengths. By default these functions implement AES with a
  128-bit key length. Key lengths of 196 or 256 bits can be
  used, as described later. The key length is a trade off
  between performance and security.

  [`AES_ENCRYPT()`](encryption-functions.html#function_aes-encrypt) encrypts the
  string *`str`* using the key string
  *`key_str`*, and returns a binary
  string containing the encrypted output.
  [`AES_DECRYPT()`](encryption-functions.html#function_aes-decrypt) decrypts the
  encrypted string *`crypt_str`* using
  the key string *`key_str`*, and returns
  the original (binary) string in hexadecimal format. (To obtain
  the string as plaintext, cast the result to
  `CHAR`. Alternatively, start the
  [**mysql**](mysql.html "6.5.1 mysql — The MySQL Command-Line Client") client with
  [`--skip-binary-as-hex`](mysql-command-options.html#option_mysql_binary-as-hex)
  to cause all binary values to be displayed as text.) If either
  function argument is `NULL`, the function
  returns `NULL`. If
  [`AES_DECRYPT()`](encryption-functions.html#function_aes-decrypt) detects invalid
  data or incorrect padding, it returns `NULL`.
  However, it is possible for
  [`AES_DECRYPT()`](encryption-functions.html#function_aes-decrypt) to return a
  non-`NULL` value (possibly garbage) if the
  input data or the key is invalid.

  As of MySQL 8.0.30, these functions support the use of a key
  derivation function (KDF) to create a cryptographically strong
  secret key from the information passed in
  *`key_str`*. The derived key is used to
  encrypt and decrypt the data, and it remains in the MySQL
  Server instance and is not accessible to users. Using a KDF is
  highly recommended, as it provides better security than
  specifying your own premade key or deriving it by a simpler
  method as you use the function. The functions support HKDF
  (available from OpenSSL 1.1.0), for which you can specify an
  optional salt and context-specific information to include in
  the keying material, and PBKDF2 (available from OpenSSL
  1.0.2), for which you can specify an optional salt and set the
  number of iterations used to produce the key.

  [`AES_ENCRYPT()`](encryption-functions.html#function_aes-encrypt) and
  [`AES_DECRYPT()`](encryption-functions.html#function_aes-decrypt) permit control of
  the block encryption mode. The
  [`block_encryption_mode`](server-system-variables.html#sysvar_block_encryption_mode) system
  variable controls the mode for block-based encryption
  algorithms. Its default value is
  `aes-128-ecb`, which signifies encryption
  using a key length of 128 bits and ECB mode. For a description
  of the permitted values of this variable, see
  [Section 7.1.8, “Server System Variables”](server-system-variables.html "7.1.8 Server System Variables"). The optional
  *`init_vector`* argument is used to
  provide an initialization vector for block encryption modes
  that require it.

  Statements that use
  [`AES_ENCRYPT()`](encryption-functions.html#function_aes-encrypt) or
  [`AES_DECRYPT()`](encryption-functions.html#function_aes-decrypt) are unsafe for
  statement-based replication.

  If [`AES_ENCRYPT()`](encryption-functions.html#function_aes-encrypt) is invoked
  from within the [**mysql**](mysql.html "6.5.1 mysql — The MySQL Command-Line Client") client, binary
  strings display using hexadecimal notation, depending on the
  value of the [`--binary-as-hex`](mysql-command-options.html#option_mysql_binary-as-hex).
  For more information about that option, see
  [Section 6.5.1, “mysql — The MySQL Command-Line Client”](mysql.html "6.5.1 mysql — The MySQL Command-Line Client").

  The arguments for the
  [`AES_ENCRYPT()`](encryption-functions.html#function_aes-encrypt) and
  [`AES_DECRYPT()`](encryption-functions.html#function_aes-decrypt) functions are as
  follows:

  *`str`*
  :   The string for
      [`AES_ENCRYPT()`](encryption-functions.html#function_aes-encrypt) to encrypt
      using the key string *`key_str`*,
      or (from MySQL 8.0.30) the key derived from it by the
      specified KDF. The string can be any length. Padding is
      automatically added to *`str`* so
      it is a multiple of a block as required by block-based
      algorithms such as AES. This padding is automatically
      removed by the
      [`AES_DECRYPT()`](encryption-functions.html#function_aes-decrypt) function.

  *`crypt_str`*
  :   The encrypted string for
      [`AES_DECRYPT()`](encryption-functions.html#function_aes-decrypt) to decrypt
      using the key string *`key_str`*,
      or (from MySQL 8.0.30) the key derived from it by the
      specified KDF. The string can be any length. The length
      of *`crypt_str`* can be
      calculated from the length of the original string using
      this formula:

      ```
      16 * (trunc(string_length / 16) + 1)
      ```

  *`key_str`*
  :   The encryption key, or the input keying material that is
      used as the basis for deriving a key using a key
      derivation function (KDF). For the same instance of
      data, use the same value of
      *`key_str`* for encryption with
      [`AES_ENCRYPT()`](encryption-functions.html#function_aes-encrypt) and
      decryption with
      [`AES_DECRYPT()`](encryption-functions.html#function_aes-decrypt).

      If you are using a KDF, which you can from MySQL 8.0.30,
      *`key_str`* can be any arbitrary
      information such as a password or passphrase. In the
      further arguments for the function, you specify the KDF
      name, then add further options to increase the security
      as appropriate for the KDF.

      When you use a KDF, the function creates a
      cryptographically strong secret key from the information
      passed in *`key_str`* and any
      salt or additional information that you provide in the
      other arguments. The derived key is used to encrypt and
      decrypt the data, and it remains in the MySQL Server
      instance and is not accessible to users. Using a KDF is
      highly recommended, as it provides better security than
      specifying your own premade key or deriving it by a
      simpler method as you use the function.

      If you are not using a KDF, for a key length of 128
      bits, the most secure way to pass a key to the
      *`key_str`* argument is to create
      a truly random 128-bit value and pass it as a binary
      value. For example:

      ```
      INSERT INTO t
      VALUES (1,AES_ENCRYPT('text',UNHEX('F3229A0B371ED2D9441B830D21A390C3')));
      ```

      A passphrase can be used to generate an AES key by
      hashing the passphrase. For example:

      ```
      INSERT INTO t
      VALUES (1,AES_ENCRYPT('text', UNHEX(SHA2('My secret passphrase',512))));
      ```

      If you exceed the maximum key length of 128 bits, a
      warning is returned. If you are not using a KDF, do not
      pass a password or passphrase directly to
      *`key_str`*, hash it first.
      Previous versions of this documentation suggested the
      former approach, but it is no longer recommended as the
      examples shown here are more secure.

  *`init_vector`*
  :   An initialization vector, for block encryption modes
      that require it. The
      [`block_encryption_mode`](server-system-variables.html#sysvar_block_encryption_mode)
      system variable controls the mode. For the same instance
      of data, use the same value of
      *`init_vector`* for encryption
      with [`AES_ENCRYPT()`](encryption-functions.html#function_aes-encrypt) and
      decryption with
      [`AES_DECRYPT()`](encryption-functions.html#function_aes-decrypt).

      Note

      If you are using a KDF, you must specify an
      initialization vector or a null string for this
      argument, in order to access the later arguments to
      define the KDF.

      For modes that require an initialization vector, it must
      be 16 bytes or longer (bytes in excess of 16 are
      ignored). An error occurs if
      *`init_vector`* is missing. For
      modes that do not require an initialization vector, it
      is ignored and a warning is generated if
      *`init_vector`* is specified,
      unless you are using a KDF.

      The default value for the
      [`block_encryption_mode`](server-system-variables.html#sysvar_block_encryption_mode)
      system variable is `aes-128-ecb`, or
      ECB mode, which does not require an initialization
      vector. The alternative permitted block encryption modes
      CBC, CFB1, CFB8, CFB128, and OFB all require an
      initialization vector.

      A random string of bytes to use for the initialization
      vector can be produced by calling
      [`RANDOM_BYTES(16)`](encryption-functions.html#function_random-bytes).

  *`kdf_name`*
  :   The name of the key derivation function (KDF) to create
      a key from the input keying material passed in
      *`key_str`*, and other arguments
      as appropriate for the KDF. This optional argument is
      available from MySQL 8.0.30.

      For the same instance of data, use the same value of
      *`kdf_name`* for encryption with
      [`AES_ENCRYPT()`](encryption-functions.html#function_aes-encrypt) and
      decryption with
      [`AES_DECRYPT()`](encryption-functions.html#function_aes-decrypt). When you
      specify *`kdf_name`*, you must
      specify *`init_vector`*, using
      either a valid initialization vector, or a null string
      if the encryption mode does not require an
      initialization vector.

      The following values are supported:

      `hkdf`
      :   HKDF, which is available from OpenSSL 1.1.0. HKDF
          extracts a pseudorandom key from the keying
          material then expands it into additional keys.
          With HKDF, you can specify an optional salt
          (*`salt`*) and
          context-specific information such as application
          details (*`info`*) to
          include in the keying material.

      `pbkdf2_hmac`
      :   PBKDF2, which is available from OpenSSL 1.0.2.
          PBKDF2 applies a pseudorandom function to the
          keying material, and repeats this process a large
          number of times to produce the key. With PBKDF2,
          you can specify an optional salt
          (*`salt`*) to include in
          the keying material, and set the number of
          iterations used to produce the key
          (*`iterations`*).

      In this example, HKDF is specified as the key derivation
      function, and a salt and context information are
      provided. The argument for the initialization vector is
      included but is the empty string:

      ```
      SELECT AES_ENCRYPT('mytext','mykeystring', '', 'hkdf', 'salt', 'info');
      ```

      In this example, PBKDF2 is specified as the key
      derivation function, a salt is provided, and the number
      of iterations is doubled from the recommended minimum:

      ```
      SELECT AES_ENCRYPT('mytext','mykeystring', '', 'pbkdf2_hmac','salt', '2000');
      ```

  *`salt`*
  :   A salt to be passed to the key derivation function
      (KDF). This optional argument is available from MySQL
      8.0.30. Both HKDF and PBKDF2 can use salts, and their
      use is recommended to help prevent attacks based on
      dictionaries of common passwords or rainbow tables.

      A salt consists of random data, which for security must
      be different for each encryption operation. A random
      string of bytes to use for the salt can be produced by
      calling [`RANDOM_BYTES()`](encryption-functions.html#function_random-bytes).
      This example produces a 64-bit salt:

      ```
      SET @salt = RANDOM_BYTES(8);
      ```

      For the same instance of data, use the same value of
      *`salt`* for encryption with
      [`AES_ENCRYPT()`](encryption-functions.html#function_aes-encrypt) and
      decryption with
      [`AES_DECRYPT()`](encryption-functions.html#function_aes-decrypt). The salt
      can safely be stored along with the encrypted data.

  *`info`*
  :   Context-specific information for HKDF to include in the
      keying material, such as information about the
      application. This optional argument is available from
      MySQL 8.0.30 when you specify `hkdf` as
      the KDF name. HKDF adds this information to the keying
      material specified in *`key_str`*
      and the salt specified in
      *`salt`* to produce the key.

      For the same instance of data, use the same value of
      *`info`* for encryption with
      [`AES_ENCRYPT()`](encryption-functions.html#function_aes-encrypt) and
      decryption with
      [`AES_DECRYPT()`](encryption-functions.html#function_aes-decrypt).

  *`iterations`*
  :   The iteration count for PBKDF2 to use when producing the
      key. This optional argument is available from MySQL
      8.0.30 when you specify `pbkdf2_hmac`
      as the KDF name. A higher count gives greater resistance
      to brute-force attacks because it has a greater
      computational cost for the attacker, but the same is
      necessarily true for the key derivation process. The
      default if you do not specify this argument is 1000,
      which is the minimum recommended by the OpenSSL
      standard.

      For the same instance of data, use the same value of
      *`iterations`* for encryption
      with [`AES_ENCRYPT()`](encryption-functions.html#function_aes-encrypt) and
      decryption with
      [`AES_DECRYPT()`](encryption-functions.html#function_aes-decrypt).

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

* [`COMPRESS(string_to_compress)`](encryption-functions.html#function_compress)

  Compresses a string and returns the result as a binary string.
  This function requires MySQL to have been compiled with a
  compression library such as `zlib`.
  Otherwise, the return value is always `NULL`.
  The return value is also `NULL` if
  *`string_to_compress`* is
  `NULL`. The compressed string can be
  uncompressed with [`UNCOMPRESS()`](encryption-functions.html#function_uncompress).

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
  + Nonempty strings are stored as a 4-byte length of the
    uncompressed string (low byte first), followed by the
    compressed string. If the string ends with space, an extra
    `.` character is added to avoid problems
    with endspace trimming should the result be stored in a
    [`CHAR`](char.html "13.3.2 The CHAR and VARCHAR Types") or
    [`VARCHAR`](char.html "13.3.2 The CHAR and VARCHAR Types") column. (However,
    use of nonbinary string data types such as
    [`CHAR`](char.html "13.3.2 The CHAR and VARCHAR Types") or
    [`VARCHAR`](char.html "13.3.2 The CHAR and VARCHAR Types") to store compressed
    strings is not recommended anyway because character set
    conversion may occur. Use a
    [`VARBINARY`](binary-varbinary.html "13.3.3 The BINARY and VARBINARY Types") or
    [`BLOB`](blob.html "13.3.4 The BLOB and TEXT Types") binary string column
    instead.)

  If [`COMPRESS()`](encryption-functions.html#function_compress) is invoked from
  within the [**mysql**](mysql.html "6.5.1 mysql — The MySQL Command-Line Client") client, binary strings
  display using hexadecimal notation, depending on the value of
  the [`--binary-as-hex`](mysql-command-options.html#option_mysql_binary-as-hex). For more
  information about that option, see [Section 6.5.1, “mysql — The MySQL Command-Line Client”](mysql.html "6.5.1 mysql — The MySQL Command-Line Client").

* [`MD5(str)`](encryption-functions.html#function_md5)

  Calculates an MD5 128-bit checksum for the string. The value
  is returned as a string of 32 hexadecimal digits, or
  `NULL` if the argument was
  `NULL`. The return value can, for example, be
  used as a hash key. See the notes at the beginning of this
  section about storing hash values efficiently.

  The return value is a string in the connection character set.

  If FIPS mode is enabled,
  `MD5()` returns
  `NULL`. See [Section 8.8, “FIPS Support”](fips-mode.html "8.8 FIPS Support").

  ```
  mysql> SELECT MD5('testing');
          -> 'ae2b1fca515949e5d54fb22b8ed95575'
  ```

  This is the “RSA Data Security, Inc. MD5 Message-Digest
  Algorithm.”

  See the note regarding the MD5 algorithm at the beginning this
  section.

* [`RANDOM_BYTES(len)`](encryption-functions.html#function_random-bytes)

  This function returns a binary string of
  *`len`* random bytes generated using
  the random number generator of the SSL library. Permitted
  values of *`len`* range from 1 to 1024.
  For values outside that range, an error occurs. Returns
  `NULL` if *`len`* is
  `NULL`.

  [`RANDOM_BYTES()`](encryption-functions.html#function_random-bytes) can be used to
  provide the initialization vector for the
  [`AES_DECRYPT()`](encryption-functions.html#function_aes-decrypt) and
  [`AES_ENCRYPT()`](encryption-functions.html#function_aes-encrypt) functions. For
  use in that context, *`len`* must be at
  least 16. Larger values are permitted, but bytes in excess of
  16 are ignored.

  [`RANDOM_BYTES()`](encryption-functions.html#function_random-bytes) generates a
  random value, which makes its result nondeterministic.
  Consequently, statements that use this function are unsafe for
  statement-based replication.

  If [`RANDOM_BYTES()`](encryption-functions.html#function_random-bytes) is invoked
  from within the [**mysql**](mysql.html "6.5.1 mysql — The MySQL Command-Line Client") client, binary
  strings display using hexadecimal notation, depending on the
  value of the [`--binary-as-hex`](mysql-command-options.html#option_mysql_binary-as-hex).
  For more information about that option, see
  [Section 6.5.1, “mysql — The MySQL Command-Line Client”](mysql.html "6.5.1 mysql — The MySQL Command-Line Client").

* [`SHA1(str)`](encryption-functions.html#function_sha1),
  [`SHA(str)`](encryption-functions.html#function_sha1)

  Calculates an SHA-1 160-bit checksum for the string, as
  described in RFC 3174 (Secure Hash Algorithm). The value is
  returned as a string of 40 hexadecimal digits, or
  `NULL` if the argument is
  `NULL`. One of the possible uses for this
  function is as a hash key. See the notes at the beginning of
  this section about storing hash values efficiently.
  [`SHA()`](encryption-functions.html#function_sha1) is
  synonymous with [`SHA1()`](encryption-functions.html#function_sha1).

  The return value is a string in the connection character set.

  ```
  mysql> SELECT SHA1('abc');
          -> 'a9993e364706816aba3e25717850c26c9cd0d89d'
  ```

  [`SHA1()`](encryption-functions.html#function_sha1) can be considered a
  cryptographically more secure equivalent of
  [`MD5()`](encryption-functions.html#function_md5). However, see the note
  regarding the MD5 and SHA-1 algorithms at the beginning this
  section.

* [`SHA2(str,
  hash_length)`](encryption-functions.html#function_sha2)

  Calculates the SHA-2 family of hash functions (SHA-224,
  SHA-256, SHA-384, and SHA-512). The first argument is the
  plaintext string to be hashed. The second argument indicates
  the desired bit length of the result, which must have a value
  of 224, 256, 384, 512, or 0 (which is equivalent to 256). If
  either argument is `NULL` or the hash length
  is not one of the permitted values, the return value is
  `NULL`. Otherwise, the function result is a
  hash value containing the desired number of bits. See the
  notes at the beginning of this section about storing hash
  values efficiently.

  The return value is a string in the connection character set.

  ```
  mysql> SELECT SHA2('abc', 224);
          -> '23097d223405d8228642a477bda255b32aadbce4bda0b3f7e36c9da7'
  ```

  This function works only if MySQL has been configured with SSL
  support. See [Section 8.3, “Using Encrypted Connections”](encrypted-connections.html "8.3 Using Encrypted Connections").

  [`SHA2()`](encryption-functions.html#function_sha2) can be considered
  cryptographically more secure than
  [`MD5()`](encryption-functions.html#function_md5) or
  [`SHA1()`](encryption-functions.html#function_sha1).

* [`STATEMENT_DIGEST(statement)`](encryption-functions.html#function_statement-digest)

  Given an SQL statement as a string, returns the statement
  digest hash value as a string in the connection character set,
  or `NULL` if the argument is
  `NULL`. The related
  [`STATEMENT_DIGEST_TEXT()`](encryption-functions.html#function_statement-digest-text)
  function returns the normalized statement digest. For
  information about statement digesting, see
  [Section 29.10, “Performance Schema Statement Digests and Sampling”](performance-schema-statement-digests.html "29.10 Performance Schema Statement Digests and Sampling").

  Both functions use the MySQL parser to parse the statement. If
  parsing fails, an error occurs. The error message includes the
  parse error only if the statement is provided as a literal
  string.

  The [`max_digest_length`](server-system-variables.html#sysvar_max_digest_length) system
  variable determines the maximum number of bytes available to
  these functions for computing normalized statement digests.

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

* [`STATEMENT_DIGEST_TEXT(statement)`](encryption-functions.html#function_statement-digest-text)

  Given an SQL statement as a string, returns the normalized
  statement digest as a string in the connection character set,
  or `NULL` if the argument is
  `NULL`. For additional discussion and
  examples, see the description of the related
  [`STATEMENT_DIGEST()`](encryption-functions.html#function_statement-digest) function.

* [`UNCOMPRESS(string_to_uncompress)`](encryption-functions.html#function_uncompress)

  Uncompresses a string compressed by the
  [`COMPRESS()`](encryption-functions.html#function_compress) function. If the
  argument is not a compressed value, the result is
  `NULL`; if
  *`string_to_uncompress`* is
  `NULL`, the result is also
  `NULL`. This function requires MySQL to have
  been compiled with a compression library such as
  `zlib`. Otherwise, the return value is always
  `NULL`.

  ```
  mysql> SELECT UNCOMPRESS(COMPRESS('any string'));
          -> 'any string'
  mysql> SELECT UNCOMPRESS('any string');
          -> NULL
  ```

* [`UNCOMPRESSED_LENGTH(compressed_string)`](encryption-functions.html#function_uncompressed-length)

  Returns the length that the compressed string had before being
  compressed. Returns `NULL` if
  *`compressed_string`* is
  `NULL`.

  ```
  mysql> SELECT UNCOMPRESSED_LENGTH(COMPRESS(REPEAT('a',30)));
          -> 30
  ```

* [`VALIDATE_PASSWORD_STRENGTH(str)`](encryption-functions.html#function_validate-password-strength)

  Given an argument representing a plaintext password, this
  function returns an integer to indicate how strong the
  password is, or `NULL` if the argument is
  `NULL`. The return value ranges from 0 (weak)
  to 100 (strong).

  Password assessment by
  [`VALIDATE_PASSWORD_STRENGTH()`](encryption-functions.html#function_validate-password-strength) is
  done by the `validate_password` component. If
  that component is not installed, the function always returns

  0. For information about installing
  `validate_password`, see
  [Section 8.4.3, “The Password Validation Component”](validate-password.html "8.4.3 The Password Validation Component"). To examine or configure
  the parameters that affect password testing, check or set the
  system variables implemented by
  `validate_password`. See
  [Section 8.4.3.2, “Password Validation Options and Variables”](validate-password-options-variables.html "8.4.3.2 Password Validation Options and Variables").

  The password is subjected to increasingly strict tests and the
  return value reflects which tests were satisfied, as shown in
  the following table. In addition, if the
  [`validate_password.check_user_name`](validate-password-options-variables.html#sysvar_validate_password.check_user_name)
  system variable is enabled and the password matches the user
  name,
  [`VALIDATE_PASSWORD_STRENGTH()`](encryption-functions.html#function_validate-password-strength)
  returns 0 regardless of how other
  `validate_password` system variables are set.

  <table summary="Password tests of the VALIDATE_PASSWORD_STRENGTH() function and the values returned by each password test."><col style="width: 60%"/><col style="width: 20%"/><thead><tr>
<th>Password Test</th>
<th>Return Value</th>
</tr></thead><tbody><tr>
<td>Length &lt; 4</td>
<td>0</td>
</tr><tr>
<td>Length ≥ 4 and &lt;
                <a class="link" href="validate-password-options-variables.html#sysvar_validate_password.length"><code class="literal">validate_password.length</code></a></td>
<td>25</td>
</tr><tr>
<td>Satisfies policy 1 (<code class="literal">LOW</code>)</td>
<td>50</td>
</tr><tr>
<td>Satisfies policy 2 (<code class="literal">MEDIUM</code>)</td>
<td>75</td>
</tr><tr>
<td>Satisfies policy 3 (<code class="literal">STRONG</code>)</td>
<td>100</td>
</tr></tbody></table>