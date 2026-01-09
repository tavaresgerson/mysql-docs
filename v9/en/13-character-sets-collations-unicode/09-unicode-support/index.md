## 12.9 Unicode Support

12.9.1 The utf8mb4 Character Set (4-Byte UTF-8 Unicode Encoding)

12.9.2 The utf8mb3 Character Set (3-Byte UTF-8 Unicode Encoding)

12.9.3 The utf8 Character Set (Deprecated alias for utf8mb3)

12.9.4 The ucs2 Character Set (UCS-2 Unicode Encoding)

12.9.5 The utf16 Character Set (UTF-16 Unicode Encoding)

12.9.6 The utf16le Character Set (UTF-16LE Unicode Encoding)

12.9.7 The utf32 Character Set (UTF-32 Unicode Encoding)

12.9.8 Converting Between 3-Byte and 4-Byte Unicode Character Sets

The Unicode Standard includes characters from the Basic Multilingual Plane (BMP) and supplementary characters that lie outside the BMP. This section describes support for Unicode in MySQL. For information about the Unicode Standard itself, visit the Unicode Consortium website.

BMP characters have these characteristics:

* Their code point values are between 0 and 65535 (or `U+0000` and `U+FFFF`).

* They can be encoded in a variable-length encoding using 8, 16, or 24 bits (1 to 3 bytes).

* They can be encoded in a fixed-length encoding using 16 bits (2 bytes).

* They are sufficient for almost all characters in major languages.

Supplementary characters lie outside the BMP:

* Their code point values are between `U+10000` and `U+10FFFF`).

* Unicode support for supplementary characters requires character sets that have a range outside BMP characters and therefore take more space than BMP characters (up to 4 bytes per character).

The UTF-8 (Unicode Transformation Format with 8-bit units) method for encoding Unicode data is implemented according to RFC 3629, which describes encoding sequences that take from one to four bytes. The idea of UTF-8 is that various Unicode characters are encoded using byte sequences of different lengths:

* Basic Latin letters, digits, and punctuation signs use one byte.

* Most European and Middle East script letters fit into a 2-byte sequence: extended Latin letters (with tilde, macron, acute, grave and other accents), Cyrillic, Greek, Armenian, Hebrew, Arabic, Syriac, and others.

* Korean, Chinese, and Japanese ideographs use 3-byte or 4-byte sequences.

MySQL supports these Unicode character sets:

* `utf8mb4`: A UTF-8 encoding of the Unicode character set using one to four bytes per character.

* `utf8mb3`: A UTF-8 encoding of the Unicode character set using one to three bytes per character. This character set is deprecated andsubject to removal in a future release; use `utf8mb4` instead.

* `utf8`: A deprecated alias for `utf8mb3`; use `utf8mb4` instead.

  Note

  `utf8` is expected in a future version of MySQL to become an alias for `utf8mb4`.

* `ucs2`: The UCS-2 encoding of the Unicode character set using two bytes per character. Deprecated; expect support for this character set to be removed in a future release.

* `utf16`: The UTF-16 encoding for the Unicode character set using two or four bytes per character. Like `ucs2` but with an extension for supplementary characters.

* `utf16le`: The UTF-16LE encoding for the Unicode character set. Like `utf16` but little-endian rather than big-endian.

* `utf32`: The UTF-32 encoding for the Unicode character set using four bytes per character.

Note

The `utf8mb3` character set is deprecated and you should expect it to be removed in a future MySQL release. Please use `utf8mb4` instead. `utf8` is currently an alias for `utf8mb3`, but it is now deprecated as such, and `utf8` is expected subsequently to become a reference to `utf8mb4`. MySQL 9.5 also displays `utf8mb3` in place of `utf8` in the columns of Information Schema tables, and in the output of SQL `SHOW` statements.

In addition, you should be aware that collations using the `utf8_` prefix in older releases of MySQL have since been renamed using the prefix `utf8mb3_`, instead.

To avoid ambiguity about the meaning of `utf8`, consider specifying `utf8mb4` explicitly for character set references.

Table 12.2, “Unicode Character Set General Characteristics”, summarizes the general characteristics of Unicode character sets supported by MySQL.

**Table 12.2 Unicode Character Set General Characteristics**

<table summary="General characteristics of Unicode character sets."><col style="width: 20%"/><col style="width: 40%"/><col style="width: 40%"/><thead><tr> <th>Character Set</th> <th>Supported Characters</th> <th>Required Storage Per Character</th> </tr></thead><tbody><tr> <th><code class="literal">utf8mb3</code>, <code class="literal">utf8</code> (deprecated)</th> <td>BMP only</td> <td>1, 2, or 3 bytes</td> </tr><tr> <th><code class="literal">ucs2</code></th> <td>BMP only</td> <td>2 bytes</td> </tr><tr> <th><code class="literal">utf8mb4</code></th> <td>BMP and supplementary</td> <td>1, 2, 3, or 4 bytes</td> </tr><tr> <th><code class="literal">utf16</code></th> <td>BMP and supplementary</td> <td>2 or 4 bytes</td> </tr><tr> <th><code class="literal">utf16le</code></th> <td>BMP and supplementary</td> <td>2 or 4 bytes</td> </tr><tr> <th><code class="literal">utf32</code></th> <td>BMP and supplementary</td> <td>4 bytes</td> </tr></tbody></table>

Characters outside the BMP compare as `REPLACEMENT CHARACTER` and convert to `'?'` when converted to a Unicode character set that supports only BMP characters (`utf8mb3` or `ucs2`).

If you use character sets that support supplementary characters and thus are “wider” than the BMP-only `utf8mb3` and `ucs2` character sets, there are potential incompatibility issues for your applications; see Section 12.9.8, “Converting Between 3-Byte and 4-Byte Unicode Character Sets”. That section also describes how to convert tables from the (3-byte) `utf8mb3` to the (4-byte) `utf8mb4`, and what constraints may apply in doing so.

A similar set of collations is available for most Unicode character sets. For example, each has a Danish collation, the names of which are `utf8mb4_danish_ci`, `utf8mb3_danish_ci` (deprecated), `utf8_danish_ci` (deprecated), `ucs2_danish_ci`, `utf16_danish_ci`, and `utf32_danish_ci`. The exception is `utf16le`, which has only two collations. For information about Unicode collations and their differentiating properties, including collation properties for supplementary characters, see Section 12.10.1, “Unicode Character Sets”.

The MySQL implementation of UCS-2, UTF-16, and UTF-32 stores characters in big-endian byte order and does not use a byte order mark (BOM) at the beginning of values. Other database systems might use little-endian byte order or a BOM. In such cases, conversion of values needs to be performed when transferring data between those systems and MySQL. The implementation of UTF-16LE is little-endian.

MySQL uses no BOM for UTF-8 values.

Client applications that communicate with the server using Unicode should set the client character set accordingly (for example, by issuing a `SET NAMES 'utf8mb4'` statement). Some character sets cannot be used as the client character set. Attempting to use them with `SET NAMES` or `SET CHARACTER SET` produces an error. See Impermissible Client Character Sets.

The following sections provide additional detail on the Unicode character sets in MySQL.
