## 12.6 Error Message Character Set

This section describes how the MySQL server uses character sets for constructing error messages. For information about the language of error messages (rather than the character set), see Section 12.12, “Setting the Error Message Language”. For general information about configuring error logging, see  Section 7.4.2, “The Error Log”.

*  Character Set for Error Message Construction
*  Character Set for Error Message Disposition

### Character Set for Error Message Construction

The server constructs error messages as follows:

* The message template uses UTF-8 (`utf8mb3`).
* Parameters in the message template are replaced with values that apply to a specific error occurrence:

  + Identifiers such as table or column names use UTF-8 internally so they are copied as is.
  + Character (nonbinary) string values are converted from their character set to UTF-8.
  + Binary string values are copied as is for bytes in the range `0x20` to `0x7E`, and using `\x` hexadecimal encoding for bytes outside that range. For example, if a duplicate-key error occurs for an attempt to insert `0x41CF9F` into a `VARBINARY` unique column, the resulting error message uses UTF-8 with some bytes hexadecimal encoded:

    ```
    Duplicate entry 'A\xCF\x9F' for key 1
    ```

### Character Set for Error Message Disposition

An error message, once constructed, can be written by the server to the error log or sent to clients:

* If the server writes the error message to the error log, it writes it in UTF-8, as constructed, without conversion to another character set.
* If the server sends the error message to a client program, the server converts it from UTF-8 to the character set specified by the `character_set_results` system variable. If `character_set_results` has a value of `NULL` or `binary`, no conversion occurs. No conversion occurs if the variable value is `utf8mb3` or `utf8mb4`, either, because those character sets have a repertoire that includes all UTF-8 characters used in message construction.

  If characters cannot be represented in `character_set_results`, some encoding may occur during the conversion. The encoding uses Unicode code point values:

  + Characters in the Basic Multilingual Plane (BMP) range (`0x0000` to `0xFFFF`) are written using `\nnnn` notation.
  + Characters outside the BMP range (`0x10000` to `0x10FFFF`) are written using `\+nnnnnn` notation.

  Clients can set `character_set_results` to control the character set in which they receive error messages. The variable can be set directly, or indirectly by means such as  `SET NAMES`. For more information about `character_set_results`, see Section 12.4, “Connection Character Sets and Collations”.

