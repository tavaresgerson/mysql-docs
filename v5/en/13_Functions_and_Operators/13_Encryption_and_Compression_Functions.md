## 12.13 Encryption and Compression Functions

**Table 12.18 Encryption Functions**

<table frame="box" rules="all" summary="A reference that lists encryption functions."><col style="width: 25%"/><col style="width: 62%"/><col style="width: 12%"/><thead><tr><th>Name</th>
<th>Description</th>
<th>Deprecated</th>
</tr></thead><tbody><tr><th><code>AES_DECRYPT()</code></th>
<td>
      Decrypt using AES
    </td>
<td></td>
</tr><tr><th><code>AES_ENCRYPT()</code></th>
<td>
      Encrypt using AES
    </td>
<td></td>
</tr><tr><th><code>COMPRESS()</code></th>
<td>
      Return result as a binary string
    </td>
<td></td>
</tr><tr><th><code>DECODE()</code></th>
<td>
      Decode a string encrypted using ENCODE()
    </td>
<td>Yes</td>
</tr><tr><th><code>DES_DECRYPT()</code></th>
<td>
      Decrypt a string
    </td>
<td>Yes</td>
</tr><tr><th><code>DES_ENCRYPT()</code></th>
<td>
      Encrypt a string
    </td>
<td>Yes</td>
</tr><tr><th><code>ENCODE()</code></th>
<td>
      Encode a string
    </td>
<td>Yes</td>
</tr><tr><th><code>ENCRYPT()</code></th>
<td>
      Encrypt a string
    </td>
<td>Yes</td>
</tr><tr><th><code>MD5()</code></th>
<td>
      Calculate MD5 checksum
    </td>
<td></td>
</tr><tr><th><code>PASSWORD()</code></th>
<td>
      Calculate and return a password string
    </td>
<td>Yes</td>
</tr><tr><th><code>RANDOM_BYTES()</code></th>
<td>
      Return a random byte vector
    </td>
<td></td>
</tr><tr><th><code>SHA1()</code>, <code>SHA()</code></th>
<td>
      Calculate an SHA-1 160-bit checksum
    </td>
<td></td>
</tr><tr><th><code>SHA2()</code></th>
<td>
      Calculate an SHA-2 checksum
    </td>
<td></td>
</tr><tr><th><code>UNCOMPRESS()</code></th>
<td>
      Uncompress a string compressed
    </td>
<td></td>
</tr><tr><th><code>UNCOMPRESSED_LENGTH()</code></th>
<td>
      Return the length of a string before compression
    </td>
<td></td>
</tr><tr><th><code>VALIDATE_PASSWORD_STRENGTH()</code></th>
<td>
      Determine strength of password
    </td>
<td></td>
</tr></tbody></table>

Many encryption and compression functions return strings for which
the result might contain arbitrary byte values. If you want to
store these results, use a column with a
[`VARBINARY`](binary-varbinary.html "11.3.3 The BINARY and VARBINARY Types") or
[`BLOB`](blob.html "11.3.4 The BLOB and TEXT Types") binary string data type. This
avoids potential problems with trailing space removal or character
set conversion that would change data values, such as may occur if
you use a nonbinary string data type
([`CHAR`](char.html "11.3.2 The CHAR and VARCHAR Types"),
[`VARCHAR`](char.html "11.3.2 The CHAR and VARCHAR Types"),
[`TEXT`](blob.html "11.3.4 The BLOB and TEXT Types")).

Some encryption functions return strings of ASCII characters:
[`MD5()`](encryption-functions.html#function_md5),
[`PASSWORD()`](encryption-functions.html#function_password),
[`SHA()`](encryption-functions.html#function_sha1),
[`SHA1()`](encryption-functions.html#function_sha1),
[`SHA2()`](encryption-functions.html#function_sha2). Their return value is a
string that has a character set and collation determined by the
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
[`BINARY(N)`](binary-varbinary.html "11.3.3 The BINARY and VARBINARY Types")
column. Each pair of hexadecimal digits requires one byte in
binary form, so the value of *`N`* depends
on the length of the hex string. *`N`* is
16 for an [`MD5()`](encryption-functions.html#function_md5) value and 20 for a
[`SHA1()`](encryption-functions.html#function_sha1) value. For
[`SHA2()`](encryption-functions.html#function_sha2),
*`N`* ranges from 28 to 32 depending on the
argument specifying the desired bit length of the result.

The size penalty for storing the hex string in a
[`CHAR`](char.html "11.3.2 The CHAR and VARCHAR Types") column is at least two times,
up to eight times if the value is stored in a column that uses the
`utf8` character set (where each character uses 4
bytes). Storing the string also results in slower comparisons
because of the larger values and the need to take character set
collation rules into account.

Suppose that an application stores
[`MD5()`](encryption-functions.html#function_md5) string values in a
[`CHAR(32)`](char.html "11.3.2 The CHAR and VARCHAR Types") column:

```sql
CREATE TABLE md5_tbl (md5_val CHAR(32), ...);
INSERT INTO md5_tbl (md5_val, ...) VALUES(MD5('abcdef'), ...);
```

To convert hex strings to more compact form, modify the
application to use [`UNHEX()`](string-functions.html#function_unhex) and
[`BINARY(16)`](binary-varbinary.html "11.3.3 The BINARY and VARBINARY Types") instead as follows:

```sql
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
  the original plaintext string. If either function argument is
  `NULL`, the function returns
  `NULL`. If
  [`AES_DECRYPT()`](encryption-functions.html#function_aes-decrypt) detects invalid
  data or incorrect padding, it returns `NULL`.
  However, it is possible for
  [`AES_DECRYPT()`](encryption-functions.html#function_aes-decrypt) to return a
  non-`NULL` value (possibly garbage) if the
  input data or the key is invalid.

  As of MySQL 5.7.40, these functions support the use of a key
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
  [Section 5.1.7, “Server System Variables”](server-system-variables.html "5.1.7 Server System Variables"). The optional
  *`init_vector`* argument is used to
  provide an initialization vector for block encryption modes
  that require it.

  Statements that use
  [`AES_ENCRYPT()`](encryption-functions.html#function_aes-encrypt) or
  [`AES_DECRYPT()`](encryption-functions.html#function_aes-decrypt) are unsafe for
  statement-based replication.

  If [`AES_ENCRYPT()`](encryption-functions.html#function_aes-encrypt) is invoked
  from within the [**mysql**](mysql.html "4.5.1 mysql — The MySQL Command-Line Client") client, binary
  strings display using hexadecimal notation, depending on the
  value of the [`--binary-as-hex`](mysql-command-options.html#option_mysql_binary-as-hex).
  For more information about that option, see
  [Section 4.5.1, “mysql — The MySQL Command-Line Client”](mysql.html "4.5.1 mysql — The MySQL Command-Line Client").

  The arguments for the
  [`AES_ENCRYPT()`](encryption-functions.html#function_aes-encrypt) and
  [`AES_DECRYPT()`](encryption-functions.html#function_aes-decrypt) functions are as
  follows:

  *`str`*
  :   The string for
      [`AES_ENCRYPT()`](encryption-functions.html#function_aes-encrypt) to encrypt
      using the key string *`key_str`*,
      or (as of MySQL 5.7.40) the key derived from it by the
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
      or (from MySQL 5.7.40) the key derived from it by the
      specified KDF. The string can be any length. The length
      of *`crypt_str`* can be
      calculated from the length of the original string using
      this formula:

      ```sql
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

      If you are using a KDF, which you can from MySQL 5.7.40,
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

      ```sql
      INSERT INTO t
      VALUES (1,AES_ENCRYPT('text',UNHEX('F3229A0B371ED2D9441B830D21A390C3')));
      ```

      A passphrase can be used to generate an AES key by
      hashing the passphrase. For example:

      ```sql
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
      available from MySQL 5.7.40.

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

      ```sql
      SELECT AES_ENCRYPT('mytext','mykeystring', '', 'hkdf', 'salt', 'info');
      ```

      In this example, PBKDF2 is specified as the key
      derivation function, a salt is provided, and the number
      of iterations is doubled from the recommended minimum:

      ```sql
      SELECT AES_ENCRYPT('mytext','mykeystring', '', 'pbkdf2_hmac','salt', '2000');
      ```

  *`salt`*
  :   A salt to be passed to the key derivation function
      (KDF). This optional argument is available from MySQL
      5.7.40. Both HKDF and PBKDF2 can use salts, and their
      use is recommended to help prevent attacks based on
      dictionaries of common passwords or rainbow tables.

      A salt consists of random data, which for security must
      be different for each encryption operation. A random
      string of bytes to use for the salt can be produced by
      calling [`RANDOM_BYTES()`](encryption-functions.html#function_random-bytes).
      This example produces a 64-bit salt:

      ```sql
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
      MySQL 5.7.40 when you specify `hkdf` as
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
      5.7.40 when you specify `pbkdf2_hmac`
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

  ```sql
  mysql> SET block_encryption_mode = 'aes-256-cbc';
  mysql> SET @key_str = SHA2('My secret passphrase',512);
  mysql> SET @init_vector = RANDOM_BYTES(16);
  mysql> SET @crypt_str = AES_ENCRYPT('text',@key_str,@init_vector);
  mysql> SELECT AES_DECRYPT(@crypt_str,@key_str,@init_vector);
  +-----------------------------------------------+
  | AES_DECRYPT(@crypt_str,@key_str,@init_vector) |
  +-----------------------------------------------+
  | text                                          |
  +-----------------------------------------------+
  ```

* [`COMPRESS(string_to_compress)`](encryption-functions.html#function_compress)

  Compresses a string and returns the result as a binary string.
  This function requires MySQL to have been compiled with a
  compression library such as `zlib`.
  Otherwise, the return value is always `NULL`.
  The compressed string can be uncompressed with
  [`UNCOMPRESS()`](encryption-functions.html#function_uncompress).

  ```sql
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
    [`CHAR`](char.html "11.3.2 The CHAR and VARCHAR Types") or
    [`VARCHAR`](char.html "11.3.2 The CHAR and VARCHAR Types") column. (However,
    use of nonbinary string data types such as
    [`CHAR`](char.html "11.3.2 The CHAR and VARCHAR Types") or
    [`VARCHAR`](char.html "11.3.2 The CHAR and VARCHAR Types") to store compressed
    strings is not recommended anyway because character set
    conversion may occur. Use a
    [`VARBINARY`](binary-varbinary.html "11.3.3 The BINARY and VARBINARY Types") or
    [`BLOB`](blob.html "11.3.4 The BLOB and TEXT Types") binary string column
    instead.)

  If [`COMPRESS()`](encryption-functions.html#function_compress) is invoked from
  within the [**mysql**](mysql.html "4.5.1 mysql — The MySQL Command-Line Client") client, binary strings
  display using hexadecimal notation, depending on the value of
  the [`--binary-as-hex`](mysql-command-options.html#option_mysql_binary-as-hex). For more
  information about that option, see [Section 4.5.1, “mysql — The MySQL Command-Line Client”](mysql.html "4.5.1 mysql — The MySQL Command-Line Client").

* [`DECODE(crypt_str,pass_str)`](encryption-functions.html#function_decode)

  [`DECODE()`](encryption-functions.html#function_decode) decrypts the encrypted
  string *`crypt_str`* using
  *`pass_str`* as the password.
  *`crypt_str`* should be a string
  returned from [`ENCODE()`](encryption-functions.html#function_encode).

  Note

  The [`ENCODE()`](encryption-functions.html#function_encode) and
  [`DECODE()`](encryption-functions.html#function_decode) functions are
  deprecated in MySQL 5.7, and should no longer
  be used. Expect them to be removed in a future MySQL
  release. Consider using
  [`AES_ENCRYPT()`](encryption-functions.html#function_aes-encrypt) and
  [`AES_DECRYPT()`](encryption-functions.html#function_aes-decrypt) instead.

* [`DES_DECRYPT(crypt_str[,key_str])`](encryption-functions.html#function_des-decrypt)

  Decrypts a string encrypted with
  [`DES_ENCRYPT()`](encryption-functions.html#function_des-encrypt). If an error
  occurs, this function returns `NULL`.

  This function works only if MySQL has been configured with SSL
  support. See [Section 6.3, “Using Encrypted Connections”](encrypted-connections.html "6.3 Using Encrypted Connections").

  If no *`key_str`* argument is given,
  [`DES_DECRYPT()`](encryption-functions.html#function_des-decrypt) examines the
  first byte of the encrypted string to determine the DES key
  number that was used to encrypt the original string, and then
  reads the key from the DES key file to decrypt the message.
  For this to work, the user must have the
  [`SUPER`](privileges-provided.html#priv_super) privilege. The key file
  can be specified with the
  [`--des-key-file`](server-options.html#option_mysqld_des-key-file) server option.

  If you pass this function a *`key_str`*
  argument, that string is used as the key for decrypting the
  message.

  If the *`crypt_str`* argument does not
  appear to be an encrypted string, MySQL returns the given
  *`crypt_str`*.

  Note

  The [`DES_ENCRYPT()`](encryption-functions.html#function_des-encrypt) and
  [`DES_DECRYPT()`](encryption-functions.html#function_des-decrypt) functions are
  deprecated in MySQL 5.7, are removed in MySQL
  8.0, and should no longer be used. Consider using
  [`AES_ENCRYPT()`](encryption-functions.html#function_aes-encrypt) and
  [`AES_DECRYPT()`](encryption-functions.html#function_aes-decrypt) instead.

* [`DES_ENCRYPT(str[,{key_num|key_str}])`](encryption-functions.html#function_des-encrypt)

  Encrypts the string with the given key using the Triple-DES
  algorithm.

  This function works only if MySQL has been configured with SSL
  support. See [Section 6.3, “Using Encrypted Connections”](encrypted-connections.html "6.3 Using Encrypted Connections").

  The encryption key to use is chosen based on the second
  argument to [`DES_ENCRYPT()`](encryption-functions.html#function_des-encrypt), if
  one was given. With no argument, the first key from the DES
  key file is used. With a *`key_num`*
  argument, the given key number (0 to 9) from the DES key file
  is used. With a *`key_str`* argument,
  the given key string is used to encrypt
  *`str`*.

  The key file can be specified with the
  [`--des-key-file`](server-options.html#option_mysqld_des-key-file) server option.

  The return string is a binary string where the first character
  is [`CHAR(128 |
  key_num)`](string-functions.html#function_char). If an error
  occurs, [`DES_ENCRYPT()`](encryption-functions.html#function_des-encrypt) returns
  `NULL`.

  The 128 is added to make it easier to recognize an encrypted
  key. If you use a string key,
  *`key_num`* is 127.

  The string length for the result is given by this formula:

  ```sql
  new_len = orig_len + (8 - (orig_len % 8)) + 1
  ```

  Each line in the DES key file has the following format:

  ```sql
  key_num des_key_str
  ```

  Each *`key_num`* value must be a number
  in the range from `0` to
  `9`. Lines in the file may be in any order.
  *`des_key_str`* is the string that is
  used to encrypt the message. There should be at least one
  space between the number and the key. The first key is the
  default key that is used if you do not specify any key
  argument to [`DES_ENCRYPT()`](encryption-functions.html#function_des-encrypt).

  You can tell MySQL to read new key values from the key file
  with the [`FLUSH DES_KEY_FILE`](flush.html#flush-des-key-file)
  statement. This requires the
  [`RELOAD`](privileges-provided.html#priv_reload) privilege.

  One benefit of having a set of default keys is that it gives
  applications a way to check for the existence of encrypted
  column values, without giving the end user the right to
  decrypt those values.

  Note

  The [`DES_ENCRYPT()`](encryption-functions.html#function_des-encrypt) and
  [`DES_DECRYPT()`](encryption-functions.html#function_des-decrypt) functions are
  deprecated in MySQL 5.7, are removed in MySQL
  8.0, and should no longer be used. Consider using
  [`AES_ENCRYPT()`](encryption-functions.html#function_aes-encrypt) and
  [`AES_DECRYPT()`](encryption-functions.html#function_aes-decrypt) instead.

  ```sql
  mysql> SELECT customer_address FROM customer_table
       > WHERE crypted_credit_card = DES_ENCRYPT('credit_card_number');
  ```

  If [`DES_ENCRYPT()`](encryption-functions.html#function_des-encrypt) is invoked
  from within the [**mysql**](mysql.html "4.5.1 mysql — The MySQL Command-Line Client") client, binary
  strings display using hexadecimal notation, depending on the
  value of the [`--binary-as-hex`](mysql-command-options.html#option_mysql_binary-as-hex).
  For more information about that option, see
  [Section 4.5.1, “mysql — The MySQL Command-Line Client”](mysql.html "4.5.1 mysql — The MySQL Command-Line Client").

* [`ENCODE(str,pass_str)`](encryption-functions.html#function_encode)

  [`ENCODE()`](encryption-functions.html#function_encode) encrypts
  *`str`* using
  *`pass_str`* as the password. The
  result is a binary string of the same length as
  *`str`*. To decrypt the result, use
  [`DECODE()`](encryption-functions.html#function_decode).

  Note

  The [`ENCODE()`](encryption-functions.html#function_encode) and
  [`DECODE()`](encryption-functions.html#function_decode) functions are
  deprecated in MySQL 5.7, and should no longer
  be used. Expect them to be removed in a future MySQL
  release.

  If you still need to use
  [`ENCODE()`](encryption-functions.html#function_encode), a salt value must be
  used with it to reduce risk. For example:

  ```sql
  ENCODE('cleartext', CONCAT('my_random_salt','my_secret_password'))
  ```

  A new random salt value must be used whenever a password is
  updated.

  If [`ENCODE()`](encryption-functions.html#function_encode) is invoked from
  within the [**mysql**](mysql.html "4.5.1 mysql — The MySQL Command-Line Client") client, binary strings
  display using hexadecimal notation, depending on the value of
  the [`--binary-as-hex`](mysql-command-options.html#option_mysql_binary-as-hex). For more
  information about that option, see [Section 4.5.1, “mysql — The MySQL Command-Line Client”](mysql.html "4.5.1 mysql — The MySQL Command-Line Client").

* [`ENCRYPT(str[,salt])`](encryption-functions.html#function_encrypt)

  Encrypts *`str`* using the Unix
  `crypt()` system call and returns a binary
  string. The *`salt`* argument must be a
  string with at least two characters or else the result is
  `NULL`. If no *`salt`*
  argument is given, a random value is used.

  Note

  The [`ENCRYPT()`](encryption-functions.html#function_encrypt) function is
  deprecated in MySQL 5.7, are removed in MySQL
  8.0, and should no longer be used. For one-way
  hashing, consider using
  [`SHA2()`](encryption-functions.html#function_sha2) instead.

  ```sql
  mysql> SELECT ENCRYPT('hello');
          -> 'VxuFAJXVARROc'
  ```

  [`ENCRYPT()`](encryption-functions.html#function_encrypt) ignores all but the
  first eight characters of *`str`*, at
  least on some systems. This behavior is determined by the
  implementation of the underlying `crypt()`
  system call.

  The use of [`ENCRYPT()`](encryption-functions.html#function_encrypt) with the
  `ucs2`, `utf16`,
  `utf16le`, or `utf32`
  multibyte character sets is not recommended because the system
  call expects a string terminated by a zero byte.

  If `crypt()` is not available on your
  system (as is the case with Windows),
  [`ENCRYPT()`](encryption-functions.html#function_encrypt) always returns
  `NULL`.

  If [`ENCRYPT()`](encryption-functions.html#function_encrypt) is invoked from
  within the [**mysql**](mysql.html "4.5.1 mysql — The MySQL Command-Line Client") client, binary strings
  display using hexadecimal notation, depending on the value of
  the [`--binary-as-hex`](mysql-command-options.html#option_mysql_binary-as-hex). For more
  information about that option, see [Section 4.5.1, “mysql — The MySQL Command-Line Client”](mysql.html "4.5.1 mysql — The MySQL Command-Line Client").

* [`MD5(str)`](encryption-functions.html#function_md5)

  Calculates an MD5 128-bit checksum for the string. The value
  is returned as a string of 32 hexadecimal digits, or
  `NULL` if the argument was
  `NULL`. The return value can, for example, be
  used as a hash key. See the notes at the beginning of this
  section about storing hash values efficiently.

  The return value is a string in the connection character set.

  ```sql
  mysql> SELECT MD5('testing');
          -> 'ae2b1fca515949e5d54fb22b8ed95575'
  ```

  This is the “RSA Data Security, Inc. MD5 Message-Digest
  Algorithm.”

  See the note regarding the MD5 algorithm at the beginning this
  section.

* [`PASSWORD(str)`](encryption-functions.html#function_password)

  Note

  This function is deprecated in MySQL 5.7 and is
  removed in MySQL 8.0.

  Returns a hashed password string calculated from the cleartext
  password *`str`*. The return value is a
  string in the connection character set, or
  `NULL` if the argument is
  `NULL`. This function is the SQL interface to
  the algorithm used by the server to encrypt MySQL passwords
  for storage in the `mysql.user` grant table.

  The [`old_passwords`](server-system-variables.html#sysvar_old_passwords) system
  variable controls the password hashing method used by the
  [`PASSWORD()`](encryption-functions.html#function_password) function. It also
  influences password hashing performed by
  [`CREATE USER`](create-user.html "13.7.1.2 CREATE USER Statement") and
  [`GRANT`](grant.html "13.7.1.4 GRANT Statement") statements that specify a
  password using an `IDENTIFIED BY` clause.

  The following table shows, for each password hashing method,
  the permitted value of `old_passwords` and
  which authentication plugins use the hashing method.

  <table summary="For each password hashing method, the permitted value of old_passwords and which authentication plugins use the hashing method"><col style="width: 40%"/><col style="width: 20%"/><col style="width: 40%"/><thead><tr>
<th>Password Hashing Method</th>
<th>old_passwords Value</th>
<th>Associated Authentication Plugin</th>
</tr></thead><tbody><tr>
<th>MySQL 4.1 native hashing</th>
<td>0</td>
<td><code>mysql_native_password</code></td>
</tr><tr>
<th>SHA-256 hashing</th>
<td>2</td>
<td><code>sha256_password</code></td>
</tr></tbody></table>

  SHA-256 password hashing
  ([`old_passwords=2`](server-system-variables.html#sysvar_old_passwords)) uses a
  random salt value, which makes the result from
  [`PASSWORD()`](encryption-functions.html#function_password) nondeterministic.
  Consequently, statements that use this function are not safe
  for statement-based replication and cannot be stored in the
  query cache.

  Encryption performed by
  [`PASSWORD()`](encryption-functions.html#function_password) is one-way (not
  reversible), but it is not the same type of encryption used
  for Unix passwords.

  Note

  [`PASSWORD()`](encryption-functions.html#function_password) is used by the
  authentication system in MySQL Server; you should
  *not* use it in your own applications.
  For that purpose, consider a more secure function such as
  [`SHA2()`](encryption-functions.html#function_sha2) instead. Also see
  [RFC 2195,
  section 2 (Challenge-Response Authentication Mechanism
  (CRAM))](http://www.faqs.org/rfcs/rfc2195.html), for more information about handling
  passwords and authentication securely in your applications.

  Caution

  Under some circumstances, statements that invoke
  [`PASSWORD()`](encryption-functions.html#function_password) may be recorded in
  server logs or on the client side in a history file such as
  `~/.mysql_history`, which means that
  cleartext passwords may be read by anyone having read access
  to that information. For information about the conditions
  under which this occurs for the server logs and how to
  control it, see [Section 6.1.2.3, “Passwords and Logging”](password-logging.html "6.1.2.3 Passwords and Logging"). For
  similar information about client-side logging, see
  [Section 4.5.1.3, “mysql Client Logging”](mysql-logging.html "4.5.1.3 mysql Client Logging").

* [`RANDOM_BYTES(len)`](encryption-functions.html#function_random-bytes)

  This function returns a binary string of
  *`len`* random bytes generated using
  the random number generator of the SSL library. Permitted
  values of *`len`* range from 1 to 1024.
  For values outside that range, an error occurs.

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
  statement-based replication and cannot be stored in the query
  cache.

  If [`RANDOM_BYTES()`](encryption-functions.html#function_random-bytes) is invoked
  from within the [**mysql**](mysql.html "4.5.1 mysql — The MySQL Command-Line Client") client, binary
  strings display using hexadecimal notation, depending on the
  value of the [`--binary-as-hex`](mysql-command-options.html#option_mysql_binary-as-hex).
  For more information about that option, see
  [Section 4.5.1, “mysql — The MySQL Command-Line Client”](mysql.html "4.5.1 mysql — The MySQL Command-Line Client").

* [`SHA1(str)`](encryption-functions.html#function_sha1),
  [`SHA(str)`](encryption-functions.html#function_sha1)

  Calculates an SHA-1 160-bit checksum for the string, as
  described in RFC 3174 (Secure Hash Algorithm). The value is
  returned as a string of 40 hexadecimal digits, or
  `NULL` if the argument was
  `NULL`. One of the possible uses for this
  function is as a hash key. See the notes at the beginning of
  this section about storing hash values efficiently.
  [`SHA()`](encryption-functions.html#function_sha1) is
  synonymous with [`SHA1()`](encryption-functions.html#function_sha1).

  The return value is a string in the connection character set.

  ```sql
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

  ```sql
  mysql> SELECT SHA2('abc', 224);
          -> '23097d223405d8228642a477bda255b32aadbce4bda0b3f7e36c9da7'
  ```

  This function works only if MySQL has been configured with SSL
  support. See [Section 6.3, “Using Encrypted Connections”](encrypted-connections.html "6.3 Using Encrypted Connections").

  [`SHA2()`](encryption-functions.html#function_sha2) can be considered
  cryptographically more secure than
  [`MD5()`](encryption-functions.html#function_md5) or
  [`SHA1()`](encryption-functions.html#function_sha1).

* [`UNCOMPRESS(string_to_uncompress)`](encryption-functions.html#function_uncompress)

  Uncompresses a string compressed by the
  [`COMPRESS()`](encryption-functions.html#function_compress) function. If the
  argument is not a compressed value, the result is
  `NULL`. This function requires MySQL to have
  been compiled with a compression library such as
  `zlib`. Otherwise, the return value is always
  `NULL`.

  ```sql
  mysql> SELECT UNCOMPRESS(COMPRESS('any string'));
          -> 'any string'
  mysql> SELECT UNCOMPRESS('any string');
          -> NULL
  ```

* [`UNCOMPRESSED_LENGTH(compressed_string)`](encryption-functions.html#function_uncompressed-length)

  Returns the length that the compressed string had before being
  compressed.

  ```sql
  mysql> SELECT UNCOMPRESSED_LENGTH(COMPRESS(REPEAT('a',30)));
          -> 30
  ```

* [`VALIDATE_PASSWORD_STRENGTH(str)`](encryption-functions.html#function_validate-password-strength)

  Given an argument representing a plaintext password, this
  function returns an integer to indicate how strong the
  password is. The return value ranges from 0 (weak) to 100
  (strong).

  Password assessment by
  [`VALIDATE_PASSWORD_STRENGTH()`](encryption-functions.html#function_validate-password-strength) is
  done by the `validate_password` plugin. If
  that plugin is not installed, the function always returns 0.
  For information about installing
  `validate_password`, see
  [Section 6.4.3, “The Password Validation Plugin”](validate-password.html "6.4.3 The Password Validation Plugin"). To examine or configure
  the parameters that affect password testing, check or set the
  system variables implemented by
  `validate_password`. See
  [Section 6.4.3.2, “Password Validation Plugin Options and Variables”](validate-password-options-variables.html "6.4.3.2 Password Validation Plugin Options and Variables").

  The password is subjected to increasingly strict tests and the
  return value reflects which tests were satisfied, as shown in
  the following table. In addition, if the
  [`validate_password_check_user_name`](validate-password-options-variables.html#sysvar_validate_password_check_user_name)
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
                <code>validate_password_length</code></td>
<td>25</td>
</tr><tr>
<td>Satisfies policy 1 (<code>LOW</code>)</td>
<td>50</td>
</tr><tr>
<td>Satisfies policy 2 (<code>MEDIUM</code>)</td>
<td>75</td>
</tr><tr>
<td>Satisfies policy 3 (<code>STRONG</code>)</td>
<td>100</td>
</tr></tbody></table>