## 12.10 Supported Character Sets and Collations

This section indicates which character sets MySQL supports. There is one subsection for each group of related character sets. For each character set, the permissible collations are listed.

To list the available character sets and their default collations, use the `SHOW CHARACTER SET` statement or query the `INFORMATION_SCHEMA` `CHARACTER_SETS` table. For example:

```
mysql> SHOW CHARACTER SET;
+----------+---------------------------------+---------------------+--------+
| Charset  | Description                     | Default collation   | Maxlen |
+----------+---------------------------------+---------------------+--------+
| armscii8 | ARMSCII-8 Armenian              | armscii8_general_ci |      1 |
| ascii    | US ASCII                        | ascii_general_ci    |      1 |
| big5     | Big5 Traditional Chinese        | big5_chinese_ci     |      2 |
| binary   | Binary pseudo charset           | binary              |      1 |
| cp1250   | Windows Central European        | cp1250_general_ci   |      1 |
| cp1251   | Windows Cyrillic                | cp1251_general_ci   |      1 |
| cp1256   | Windows Arabic                  | cp1256_general_ci   |      1 |
| cp1257   | Windows Baltic                  | cp1257_general_ci   |      1 |
| cp850    | DOS West European               | cp850_general_ci    |      1 |
| cp852    | DOS Central European            | cp852_general_ci    |      1 |
| cp866    | DOS Russian                     | cp866_general_ci    |      1 |
| cp932    | SJIS for Windows Japanese       | cp932_japanese_ci   |      2 |
| dec8     | DEC West European               | dec8_swedish_ci     |      1 |
| eucjpms  | UJIS for Windows Japanese       | eucjpms_japanese_ci |      3 |
| euckr    | EUC-KR Korean                   | euckr_korean_ci     |      2 |
| gb18030  | China National Standard GB18030 | gb18030_chinese_ci  |      4 |
| gb2312   | GB2312 Simplified Chinese       | gb2312_chinese_ci   |      2 |
| gbk      | GBK Simplified Chinese          | gbk_chinese_ci      |      2 |
| geostd8  | GEOSTD8 Georgian                | geostd8_general_ci  |      1 |
| greek    | ISO 8859-7 Greek                | greek_general_ci    |      1 |
| hebrew   | ISO 8859-8 Hebrew               | hebrew_general_ci   |      1 |
| hp8      | HP West European                | hp8_english_ci      |      1 |
| keybcs2  | DOS Kamenicky Czech-Slovak      | keybcs2_general_ci  |      1 |
| koi8r    | KOI8-R Relcom Russian           | koi8r_general_ci    |      1 |
| koi8u    | KOI8-U Ukrainian                | koi8u_general_ci    |      1 |
| latin1   | cp1252 West European            | latin1_swedish_ci   |      1 |
| latin2   | ISO 8859-2 Central European     | latin2_general_ci   |      1 |
| latin5   | ISO 8859-9 Turkish              | latin5_turkish_ci   |      1 |
| latin7   | ISO 8859-13 Baltic              | latin7_general_ci   |      1 |
| macce    | Mac Central European            | macce_general_ci    |      1 |
| macroman | Mac West European               | macroman_general_ci |      1 |
| sjis     | Shift-JIS Japanese              | sjis_japanese_ci    |      2 |
| swe7     | 7bit Swedish                    | swe7_swedish_ci     |      1 |
| tis620   | TIS620 Thai                     | tis620_thai_ci      |      1 |
| ucs2     | UCS-2 Unicode                   | ucs2_general_ci     |      2 |
| ujis     | EUC-JP Japanese                 | ujis_japanese_ci    |      3 |
| utf16    | UTF-16 Unicode                  | utf16_general_ci    |      4 |
| utf16le  | UTF-16LE Unicode                | utf16le_general_ci  |      4 |
| utf32    | UTF-32 Unicode                  | utf32_general_ci    |      4 |
| utf8mb3  | UTF-8 Unicode                   | utf8mb3_general_ci  |      3 |
| utf8mb4  | UTF-8 Unicode                   | utf8mb4_0900_ai_ci  |      4 |
+----------+---------------------------------+---------------------+--------+
```

In cases where a character set has multiple collations, it might not be clear which collation is most suitable for a given application. To avoid choosing the wrong collation, it can be helpful to perform some comparisons with representative data values to make sure that a given collation sorts values the way you expect.


### 12.10.1 Unicode Character Sets

This section describes the collations available for Unicode character sets and their differentiating properties. For general information about Unicode, see Section 12.9, “Unicode Support”.

MySQL supports multiple Unicode character sets:

* `utf8mb4`: A UTF-8 encoding of the Unicode character set using one to four bytes per character.

* `utf8mb3`: A UTF-8 encoding of the Unicode character set using one to three bytes per character. This character set is deprecated; please use `utf8mb4` instead.

* `utf8`: A deprecated alias for `utf8mb3`. Use `utf8mb4` instead.

  Note

  `utf8` is expected in a future release to become an alias for `utf8mb4`.

* `ucs2`: The UCS-2 encoding of the Unicode character set using two bytes per character. Deprecated; expect support for this character set to be removed in a future version of MySQL.

* `utf16`: The UTF-16 encoding for the Unicode character set using two or four bytes per character. Like `ucs2` but with an extension for supplementary characters.

* `utf16le`: The UTF-16LE encoding for the Unicode character set. Like `utf16` but little-endian rather than big-endian.

* `utf32`: The UTF-32 encoding for the Unicode character set using four bytes per character.

Note

The `utf8mb3` character set is deprecated and you should expect it to be removed in a future MySQL release. Please use `utf8mb4` instead. `utf8` is currently an alias for `utf8mb3`, but it is now deprecated as such, and `utf8` is expected subsequently to become a reference to `utf8mb4`. `utf8mb3` is also displayed in place of `utf8` in columns of Information Schema tables, and in the output of SQL `SHOW` statements.

To avoid ambiguity about the meaning of `utf8`, consider specifying `utf8mb4` explicitly for character set references.

`utf8mb4`, `utf16`, `utf16le`, and `utf32` support Basic Multilingual Plane (BMP) characters and supplementary characters that lie outside the BMP. `utf8mb3` and `ucs2` support only BMP characters.

Most Unicode character sets have a general collation (indicated by `_general` in the name or by the absence of a language specifier), a binary collation (indicated by `_bin` in the name), and several language-specific collations (indicated by language specifiers). For example, for `utf8mb4`, `utf8mb4_general_ci` and `utf8mb4_bin` are its general and binary collations, and `utf8mb4_danish_ci` is one of its language-specific collations.

Most character sets have a single binary collation. `utf8mb4` is an exception that has two: `utf8mb4_bin` and `utf8mb4_0900_bin`. These two binary collations have the same sort order but are distinguished by their pad attribute and collating weight characteristics. See Collation Pad Attributes, and Character Collating Weights.

Collation support for `utf16le` is limited. The only collations available are `utf16le_general_ci` and `utf16le_bin`. These are similar to `utf16_general_ci` and `utf16_bin`.

* Unicode Collation Algorithm (UCA) Versions Versions")
* Collation Pad Attributes
* Language-Specific Collations
* \_general\_ci Versus \_unicode\_ci Collations
* Character Collating Weights
* Miscellaneous Information

#### Unicode Collation Algorithm (UCA) Versions

MySQL implements the `xxx_unicode_ci` collations according to the Unicode Collation Algorithm (UCA) described at <http://www.unicode.org/reports/tr10/>. The collation uses the version-4.0.0 UCA weight keys: <http://www.unicode.org/Public/UCA/4.0.0/allkeys-4.0.0.txt>. The `xxx_unicode_ci` collations have only partial support for the Unicode Collation Algorithm. Some characters are not supported, and combining marks are not fully supported. This affects languages such as Vietnamese, Yoruba, and Navajo. A combined character is considered different from the same character written with a single unicode character in string comparisons, and the two characters are considered to have a different length (for example, as returned by the `CHAR_LENGTH()` function or in result set metadata).

Unicode collations based on UCA versions higher than 4.0.0 include the version in the collation name. Examples:

* `utf8mb4_unicode_520_ci` is based on UCA 5.2.0 weight keys (<http://www.unicode.org/Public/UCA/5.2.0/allkeys.txt>),

* `utf8mb4_0900_ai_ci` is based on UCA 9.0.0 weight keys (<http://www.unicode.org/Public/UCA/9.0.0/allkeys.txt>).

The `LOWER()` and `UPPER()` functions perform case folding according to the collation of their argument. A character that has uppercase and lowercase versions only in a Unicode version higher than 4.0.0 is converted by these functions only if the argument collation uses a high enough UCA version.

#### Collation Pad Attributes

Collations based on UCA 9.0.0 and higher are faster than collations based on UCA versions prior to 9.0.0. They also have a pad attribute of `NO PAD`, in contrast to `PAD SPACE` as used in collations based on UCA versions prior to 9.0.0. For comparison of nonbinary strings, `NO PAD` collations treat spaces at the end of strings like any other character (see Trailing Space Handling in Comparisons).

To determine the pad attribute for a collation, use the `INFORMATION_SCHEMA` `COLLATIONS` table, which has a `PAD_ATTRIBUTE` column. For example:

```
mysql> SELECT COLLATION_NAME, PAD_ATTRIBUTE
       FROM INFORMATION_SCHEMA.COLLATIONS
       WHERE CHARACTER_SET_NAME = 'utf8mb4';
+----------------------------+---------------+
| COLLATION_NAME             | PAD_ATTRIBUTE |
+----------------------------+---------------+
| utf8mb4_general_ci         | PAD SPACE     |
| utf8mb4_bin                | PAD SPACE     |
| utf8mb4_unicode_ci         | PAD SPACE     |
| utf8mb4_icelandic_ci       | PAD SPACE     |
...
| utf8mb4_0900_ai_ci         | NO PAD        |
| utf8mb4_de_pb_0900_ai_ci   | NO PAD        |
| utf8mb4_is_0900_ai_ci      | NO PAD        |
...
| utf8mb4_ja_0900_as_cs      | NO PAD        |
| utf8mb4_ja_0900_as_cs_ks   | NO PAD        |
| utf8mb4_0900_as_ci         | NO PAD        |
| utf8mb4_ru_0900_ai_ci      | NO PAD        |
| utf8mb4_ru_0900_as_cs      | NO PAD        |
| utf8mb4_zh_0900_as_cs      | NO PAD        |
| utf8mb4_0900_bin           | NO PAD        |
+----------------------------+---------------+
```

Comparison of nonbinary string values (`CHAR`, `VARCHAR`, and `TEXT`) that have a `NO PAD` collation differ from other collations with respect to trailing spaces. For example, `'a'` and `'a '` compare as different strings, not the same string. This can be seen using the binary collations for `utf8mb4`. The pad attribute for `utf8mb4_bin` is `PAD SPACE`, whereas for `utf8mb4_0900_bin` it is `NO PAD`. Consequently, operations involving `utf8mb4_0900_bin` do not add trailing spaces, and comparisons involving strings with trailing spaces may differ for the two collations:

```
mysql> CREATE TABLE t1 (c CHAR(10) COLLATE utf8mb4_bin);
Query OK, 0 rows affected (0.03 sec)

mysql> INSERT INTO t1 VALUES('a');
Query OK, 1 row affected (0.01 sec)

mysql> SELECT * FROM t1 WHERE c = 'a ';
+------+
| c    |
+------+
| a    |
+------+
1 row in set (0.00 sec)

mysql> ALTER TABLE t1 MODIFY c CHAR(10) COLLATE utf8mb4_0900_bin;
Query OK, 0 rows affected (0.02 sec)
Records: 0  Duplicates: 0  Warnings: 0

mysql> SELECT * FROM t1 WHERE c = 'a ';
Empty set (0.00 sec)
```

#### Language-Specific Collations

MySQL implements language-specific Unicode collations if the ordering based only on the Unicode Collation Algorithm (UCA) does not work well for a language. Language-specific collations are UCA-based, with additional language tailoring rules. Examples of such rules appear later in this section. For questions about particular language orderings, <http://unicode.org> provides Common Locale Data Repository (CLDR) collation charts at <http://www.unicode.org/cldr/charts/30/collation/index.html>.

For example, the nonlanguage-specific `utf8mb4_0900_ai_ci` and language-specific `utf8mb4_LOCALE_0900_ai_ci` Unicode collations each have these characteristics:

* The collation is based on UCA 9.0.0 and CLDR v30, is accent-insensitive and case-insensitive. These characteristics are indicated by `_0900`, `_ai`, and `_ci` in the collation name. Exception: `utf8mb4_la_0900_ai_ci` is not based on CLDR because Classical Latin is not defined in CLDR.

* The collation works for all characters in the range [U+0, U+10FFFF].

* If the collation is not language specific, it sorts all characters, including supplementary characters, in default order (described following). If the collation is language specific, it sorts characters of the language correctly according to language-specific rules, and characters not in the language in default order.

* By default, the collation sorts characters having a code point listed in the DUCET table (Default Unicode Collation Element Table) according to the weight value assigned in the table. The collation sorts characters not having a code point listed in the DUCET table using their implicit weight value, which is constructed according to the UCA.

* For non-language-specific collations, characters in contraction sequences are treated as separate characters. For language-specific collations, contractions might change character sorting order.

A collation name that includes a locale code or language name shown in the following table is a language-specific collation. Unicode character sets may include collations for one or more of these languages.

**Table 12.3 Unicode Collation Language Specifiers**

<table summary="Language specifiers for Unicode character set collations."><col style="width: 40%"/><col style="width: 60%"/><thead><tr> <th>Language</th> <th>Language Specifier</th> </tr></thead><tbody><tr> <td>Bosnian</td> <td><code class="literal">bs</code></td> </tr><tr> <td>Bulgarian</td> <td><code class="literal">bg</code></td> </tr><tr> <td>Chinese</td> <td><code class="literal">zh</code></td> </tr><tr> <td>Classical Latin</td> <td><code class="literal">la</code> or <code class="literal">roman</code></td> </tr><tr> <td>Croatian</td> <td><code class="literal">hr</code> or <code class="literal">croatian</code></td> </tr><tr> <td>Czech</td> <td><code class="literal">cs</code> or <code class="literal">czech</code></td> </tr><tr> <td>Danish</td> <td><code class="literal">da</code> or <code class="literal">danish</code></td> </tr><tr> <td>Esperanto</td> <td><code class="literal">eo</code> or <code class="literal">esperanto</code></td> </tr><tr> <td>Estonian</td> <td><code class="literal">et</code> or <code class="literal">estonian</code></td> </tr><tr> <td>Galician</td> <td><code class="literal">gl</code></td> </tr><tr> <td>German phone book order</td> <td><code class="literal">de_pb</code> or <code class="literal">german2</code></td> </tr><tr> <td>Hungarian</td> <td><code class="literal">hu</code> or <code class="literal">hungarian</code></td> </tr><tr> <td>Icelandic</td> <td><code class="literal">is</code> or <code class="literal">icelandic</code></td> </tr><tr> <td>Japanese</td> <td><code class="literal">ja</code></td> </tr><tr> <td>Latvian</td> <td><code class="literal">lv</code> or <code class="literal">latvian</code></td> </tr><tr> <td>Lithuanian</td> <td><code class="literal">lt</code> or <code class="literal">lithuanian</code></td> </tr><tr> <td>Mongolian</td> <td><code class="literal">mn</code></td> </tr><tr> <td>Norwegian / Bokmål</td> <td><code class="literal">nb</code></td> </tr><tr> <td>Norwegian / Nynorsk</td> <td><code class="literal">nn</code></td> </tr><tr> <td>Persian</td> <td><code class="literal">persian</code></td> </tr><tr> <td>Polish</td> <td><code class="literal">pl</code> or <code class="literal">polish</code></td> </tr><tr> <td>Romanian</td> <td><code class="literal">ro</code> or <code class="literal">romanian</code></td> </tr><tr> <td>Russian</td> <td><code class="literal">ru</code></td> </tr><tr> <td>Serbian</td> <td><code class="literal">sr</code></td> </tr><tr> <td>Sinhala</td> <td><code class="literal">sinhala</code></td> </tr><tr> <td>Slovak</td> <td><code class="literal">sk</code> or <code class="literal">slovak</code></td> </tr><tr> <td>Slovenian</td> <td><code class="literal">sl</code> or <code class="literal">slovenian</code></td> </tr><tr> <td>Modern Spanish</td> <td><code class="literal">es</code> or <code class="literal">spanish</code></td> </tr><tr> <td>Traditional Spanish</td> <td><code class="literal">es_trad</code> or <code class="literal">spanish2</code></td> </tr><tr> <td>Swedish</td> <td><code class="literal">sv</code> or <code class="literal">swedish</code></td> </tr><tr> <td>Turkish</td> <td><code class="literal">tr</code> or <code class="literal">turkish</code></td> </tr><tr> <td>Vietnamese</td> <td><code class="literal">vi</code> or <code class="literal">vietnamese</code></td> </tr></tbody></table>

MySQL provides the Bulgarian collations `utf8mb4_bg_0900_ai_ci` and `utf8mb4_bg_0900_as_cs`.

Croatian collations are tailored for these Croatian letters: `Č`, `Ć`, `Dž`, `Đ`, `Lj`, `Nj`, `Š`, `Ž`.

MySQL provides the `utf8mb4_sr_latn_0900_ai_ci` and `utf8mb4_sr_latn_0900_as_cs` collations for Serbian and the `utf8mb4_bs_0900_ai_ci` and `utf8mb4_bs_0900_as_cs` collations for Bosnian, when these languages are written with the Latin alphabet.

MySQL provides collations for both major varieties of Norwegian: for Bokmål, you can use `utf8mb4_nb_0900_ai_ci` and `utf8mb4_nb_0900_as_cs`; for Nynorsk, MySQL now provides `utf8mb4_nn_0900_ai_ci` and `utf8mb4_nn_0900_as_cs`.

For Japanese, the `utf8mb4` character set includes `utf8mb4_ja_0900_as_cs` and `utf8mb4_ja_0900_as_cs_ks` collations. Both collations are accent-sensitive and case-sensitive. `utf8mb4_ja_0900_as_cs_ks` is also kana-sensitive and distinguishes Katakana characters from Hiragana characters, whereas `utf8mb4_ja_0900_as_cs` treats Katakana and Hiragana characters as equal for sorting. Applications that require a Japanese collation but not kana sensitivity may use `utf8mb4_ja_0900_as_cs` for better sort performance. `utf8mb4_ja_0900_as_cs` uses three weight levels for sorting; `utf8mb4_ja_0900_as_cs_ks` uses four.

For Classical Latin collations that are accent-insensitive, `I` and `J` compare as equal, and `U` and `V` compare as equal. `I` and `J`, and `U` and `V` compare as equal on the base letter level. In other words, `J` is regarded as an accented `I`, and `U` is regarded as an accented `V`.

MySQL provides collations for the Mongolian language when written with Cyrillic characters, `utf8mb4_mn_cyrl_0900_ai_ci` and `utf8mb4_mn_cyrl_0900_as_cs`.

Spanish collations are available for modern and traditional Spanish. For both, `ñ` (n-tilde) is a separate letter between `n` and `o`. In addition, for traditional Spanish, `ch` is a separate letter between `c` and `d`, and `ll` is a separate letter between `l` and `m`.

Traditional Spanish collations may also be used for Asturian and Galician. MySQL also provides `utf8mb4_gl_0900_ai_ci` and `utf8mb4_gl_0900_as_cs` collations for Galician. (These are the same collations as `utf8mb4_es_0900_ai_ci` and `utf8mb4_es_0900_as_cs`, respectively.)

Swedish collations include Swedish rules. For example, in Swedish, the following relationship holds, which is not something expected by a German or French speaker:

```
Ü = Y < Ö
```

#### \_general\_ci Versus \_unicode\_ci Collations

For any Unicode character set, operations performed using the `xxx_general_ci` collation are faster than those for the `xxx_unicode_ci` collation. For example, comparisons for the `utf8mb4_general_ci` collation are faster, but slightly less correct, than comparisons for `utf8mb4_unicode_ci`. The reason is that `utf8mb4_unicode_ci` supports mappings such as expansions; that is, when one character compares as equal to combinations of other characters. For example, `ß` is equal to `ss` in German and some other languages. `utf8mb4_unicode_ci` also supports contractions and ignorable characters. `utf8mb4_general_ci` is a legacy collation that does not support expansions, contractions, or ignorable characters. It can make only one-to-one comparisons between characters.

To further illustrate, the following equalities hold in both `utf8mb4_general_ci` and `utf8mb4_unicode_ci` (for the effect of this in comparisons or searches, see Section 12.8.6, “Examples of the Effect of Collation”):

```
Ä = A
Ö = O
Ü = U
```

A difference between the collations is that this is true for `utf8mb4_general_ci`:

```
ß = s
```

Whereas this is true for `utf8mb4_unicode_ci`, which supports the German DIN-1 ordering (also known as dictionary order):

```
ß = ss
```

MySQL implements language-specific Unicode collations if the ordering with `utf8mb4_unicode_ci` does not work well for a language. For example, `utf8mb4_unicode_ci` works fine for German dictionary order and French, so there is no need to create special `utf8mb4` collations.

`utf8mb4_general_ci` also is satisfactory for both German and French, except that `ß` is equal to `s`, and not to `ss`. If this is acceptable for your application, you should use `utf8mb4_general_ci` because it is faster. If this is not acceptable (for example, if you require German dictionary order), use `utf8mb4_unicode_ci` because it is more accurate.

If you require German DIN-2 (phone book) ordering, use the `utf8mb4_german2_ci` collation, which compares the following sets of characters equal:

```
Ä = Æ = AE
Ö = Œ = OE
Ü = UE
ß = ss
```

`utf8mb4_german2_ci` is similar to `latin1_german2_ci`, but the latter does not compare `Æ` equal to `AE` or `Œ` equal to `OE`. There is no `utf8mb4_german_ci` corresponding to `latin1_german_ci` for German dictionary order because `utf8mb4_general_ci` suffices.

#### Character Collating Weights

A character's collating weight is determined as follows:

* For all Unicode collations except the `_bin` (binary) collations, MySQL performs a table lookup to find a character's collating weight.

* For `_bin` collations except `utf8mb4_0900_bin`, the weight is based on the code point, possibly with leading zero bytes added.

* For `utf8mb4_0900_bin`, the weight is the `utf8mb4` encoding bytes. The sort order is the same as for `utf8mb4_bin`, but much faster.

Collating weights can be displayed using the `WEIGHT_STRING()` function. (See Section 14.8, “String Functions and Operators”.) If a collation uses a weight lookup table, but a character is not in the table (for example, because it is a “new” character), collating weight determination becomes more complex:

* For BMP characters in general collations (`xxx_general_ci`), the weight is the code point.

* For BMP characters in UCA collations (for example, `xxx_unicode_ci` and language-specific collations), the following algorithm applies:

  ```
  if (code >= 0x3400 && code <= 0x4DB5)
    base= 0xFB80; /* CJK Ideograph Extension */
  else if (code >= 0x4E00 && code <= 0x9FA5)
    base= 0xFB40; /* CJK Ideograph */
  else
    base= 0xFBC0; /* All other characters */
  aaaa= base +  (code >> 15);
  bbbb= (code & 0x7FFF) | 0x8000;
  ```

  The result is a sequence of two collating elements, `aaaa` followed by `bbbb`. For example:

  ```
  mysql> SELECT HEX(WEIGHT_STRING(_ucs2 0x04CF COLLATE ucs2_unicode_ci));
  +----------------------------------------------------------+
  | HEX(WEIGHT_STRING(_ucs2 0x04CF COLLATE ucs2_unicode_ci)) |
  +----------------------------------------------------------+
  | FBC084CF                                                 |
  +----------------------------------------------------------+
  ```

  Thus, `U+04cf CYRILLIC SMALL LETTER PALOCHKA` (`ӏ`) is, with all UCA 4.0.0 collations, greater than `U+04c0 CYRILLIC LETTER PALOCHKA` (`Ӏ`). With UCA 5.2.0 collations, all palochkas sort together.

* For supplementary characters in general collations, the weight is the weight for `0xfffd REPLACEMENT CHARACTER`. For supplementary characters in UCA 4.0.0 collations, their collating weight is `0xfffd`. That is, to MySQL, all supplementary characters are equal to each other, and greater than almost all BMP characters.

  An example with Deseret characters and `COUNT(DISTINCT)`:

  ```
  CREATE TABLE t (s1 VARCHAR(5) CHARACTER SET utf32 COLLATE utf32_unicode_ci);
  INSERT INTO t VALUES (0xfffd);   /* REPLACEMENT CHARACTER */
  INSERT INTO t VALUES (0x010412); /* DESERET CAPITAL LETTER BEE */
  INSERT INTO t VALUES (0x010413); /* DESERET CAPITAL LETTER TEE */
  SELECT COUNT(DISTINCT s1) FROM t;
  ```

  The result is 2 because in the MySQL `xxx_unicode_ci` collations, the replacement character has a weight of `0x0dc6`, whereas Deseret Bee and Deseret Tee both have a weight of `0xfffd`. (Were the `utf32_general_ci` collation used instead, the result is 1 because all three characters have a weight of `0xfffd` in that collation.)

  An example with cuneiform characters and `WEIGHT_STRING()`:

  ```
  /*
  The four characters in the INSERT string are
  00000041  # LATIN CAPITAL LETTER A
  0001218F  # CUNEIFORM SIGN KAB
  000121A7  # CUNEIFORM SIGN KISH
  00000042  # LATIN CAPITAL LETTER B
  */
  CREATE TABLE t (s1 CHAR(4) CHARACTER SET utf32 COLLATE utf32_unicode_ci);
  INSERT INTO t VALUES (0x000000410001218f000121a700000042);
  SELECT HEX(WEIGHT_STRING(s1)) FROM t;
  ```

  The result is:

  ```
  0E33 FFFD FFFD 0E4A
  ```

  `0E33` and `0E4A` are primary weights as in [UCA 4.0.0](ftp://www.unicode.org/Public/UCA/4.0.0/allkeys-4.0.0.txt). `FFFD` is the weight for KAB and also for KISH.

  The rule that all supplementary characters are equal to each other is nonoptimal but is not expected to cause trouble. These characters are very rare, so it is very rare that a multi-character string consists entirely of supplementary characters. In Japan, since the supplementary characters are obscure Kanji ideographs, the typical user does not care what order they are in, anyway. If you really want rows sorted by the MySQL rule and secondarily by code point value, it is easy:

  ```
  ORDER BY s1 COLLATE utf32_unicode_ci, s1 COLLATE utf32_bin
  ```

* For supplementary characters based on UCA versions higher than 4.0.0 (for example, `xxx_unicode_520_ci`), supplementary characters do not necessarily all have the same collating weight. Some have explicit weights from the UCA `allkeys.txt` file. Others have weights calculated from this algorithm:

  ```
  aaaa= base +  (code >> 15);
  bbbb= (code & 0x7FFF) | 0x8000;
  ```

There is a difference between “ordering by the character's code value” and “ordering by the character's binary representation,” a difference that appears only with `utf16_bin`, because of surrogates.

Suppose that `utf16_bin` (the binary collation for `utf16`) was a binary comparison “byte by byte” rather than “character by character.” If that were so, the order of characters in `utf16_bin` would differ from the order in `utf8mb4_bin`. For example, the following chart shows two rare characters. The first character is in the range `E000`-`FFFF`, so it is greater than a surrogate but less than a supplementary. The second character is a supplementary.

```
Code point  Character                    utf8mb4      utf16
----------  ---------                    -------      -----
0FF9D       HALFWIDTH KATAKANA LETTER N  EF BE 9D     FF 9D
10384       UGARITIC LETTER DELTA        F0 90 8E 84  D8 00 DF 84
```

The two characters in the chart are in order by code point value because `0xff9d` < `0x10384`. And they are in order by `utf8mb4` value because `0xef` < `0xf0`. But they are not in order by `utf16` value, if we use byte-by-byte comparison, because `0xff` > `0xd8`.

So MySQL's `utf16_bin` collation is not “byte by byte.” It is “by code point.” When MySQL sees a supplementary-character encoding in `utf16`, it converts to the character's code-point value, and then compares. Therefore, `utf8mb4_bin` and `utf16_bin` are the same ordering. This is consistent with the SQL:2008 standard requirement for a UCS\_BASIC collation: “UCS\_BASIC is a collation in which the ordering is determined entirely by the Unicode scalar values of the characters in the strings being sorted. It is applicable to the UCS character repertoire. Since every character repertoire is a subset of the UCS repertoire, the UCS\_BASIC collation is potentially applicable to every character set. NOTE 11: The Unicode scalar value of a character is its code point treated as an unsigned integer.”

If the character set is `ucs2`, comparison is byte-by-byte, but `ucs2` strings should not contain surrogates, anyway.

#### Miscellaneous Information

The `xxx_general_mysql500_ci` collations preserve the pre-5.1.24 ordering of the original `xxx_general_ci` collations and permit upgrades for tables created before MySQL 5.1.24 (Bug #27877).


### 12.10.2 West European Character Sets

Western European character sets cover most West European languages, such as French, Spanish, Catalan, Basque, Portuguese, Italian, Albanian, Dutch, German, Danish, Swedish, Norwegian, Finnish, Faroese, Icelandic, Irish, Scottish, and English.

* `ascii` (US ASCII) collations:

  + `ascii_bin`
  + `ascii_general_ci` (default)
* `cp850` (DOS West European) collations:

  + `cp850_bin`
  + `cp850_general_ci` (default)
* `dec8` (DEC Western European) collations:

  + `dec8_bin`
  + `dec8_swedish_ci` (default)

  The `dec` character set is deprecated; expect support for it to be removed in a subsequent MySQL release.

* `hp8` (HP Western European) collations:

  + `hp8_bin`
  + `hp8_english_ci` (default)

  The `hp8` character set is deprecated; expect support for it to be removed in a subsequent MySQL release.

* `latin1` (cp1252 West European) collations:

  + `latin1_bin`
  + `latin1_danish_ci`
  + `latin1_general_ci`
  + `latin1_general_cs`
  + `latin1_german1_ci`
  + `latin1_german2_ci`
  + `latin1_spanish_ci`
  + `latin1_swedish_ci` (default)

  MySQL's `latin1` is the same as the Windows `cp1252` character set. This means it is the same as the official `ISO 8859-1` or IANA (Internet Assigned Numbers Authority) `latin1`, except that IANA `latin1` treats the code points between `0x80` and `0x9f` as “undefined,” whereas `cp1252`, and therefore MySQL's `latin1`, assign characters for those positions. For example, `0x80` is the Euro sign. For the “undefined” entries in `cp1252`, MySQL translates `0x81` to Unicode `0x0081`, `0x8d` to `0x008d`, `0x8f` to `0x008f`, `0x90` to `0x0090`, and `0x9d` to `0x009d`.

  The `latin1_swedish_ci` collation is the default that probably is used by the majority of MySQL customers. Although it is frequently said that it is based on the Swedish/Finnish collation rules, there are Swedes and Finns who disagree with this statement.

  The `latin1_german1_ci` and `latin1_german2_ci` collations are based on the DIN-1 and DIN-2 standards, where DIN stands for *Deutsches Institut für Normung* (the German equivalent of ANSI). DIN-1 is called the “dictionary collation” and DIN-2 is called the “phone book collation.” For an example of the effect this has in comparisons or when doing searches, see Section 12.8.6, “Examples of the Effect of Collation”.

  + `latin1_german1_ci` (dictionary) rules:

    ```
    Ä = A
    Ö = O
    Ü = U
    ß = s
    ```

  + `latin1_german2_ci` (phone-book) rules:

    ```
    Ä = AE
    Ö = OE
    Ü = UE
    ß = ss
    ```

  In the `latin1_spanish_ci` collation, `ñ` (n-tilde) is a separate letter between `n` and `o`.

* `macroman` (Mac West European) collations:

  + `macroman_bin`
  + `macroman_general_ci` (default)

  `macroroman` is deprecated; expect support for it to be removed in a subsequent MySQL release.

* `swe7` (7bit Swedish) collations:

  + `swe7_bin`
  + `swe7_swedish_ci` (default)


### 12.10.3 Central European Character Sets

MySQL provides some support for character sets used in the Czech Republic, Slovakia, Hungary, Romania, Slovenia, Croatia, Poland, and Serbia (Latin).

* `cp1250` (Windows Central European) collations:

  + `cp1250_bin`
  + `cp1250_croatian_ci`
  + `cp1250_czech_cs`
  + `cp1250_general_ci` (default)
  + `cp1250_polish_ci`
* `cp852` (DOS Central European) collations:

  + `cp852_bin`
  + `cp852_general_ci` (default)
* `keybcs2` (DOS Kamenicky Czech-Slovak) collations:

  + `keybcs2_bin`
  + `keybcs2_general_ci` (default)
* `latin2` (ISO 8859-2 Central European) collations:

  + `latin2_bin`
  + `latin2_croatian_ci`
  + `latin2_czech_cs`
  + `latin2_general_ci` (default)
  + `latin2_hungarian_ci`
* `macce` (Mac Central European) collations:

  + `macce_bin`
  + `macce_general_ci` (default)

  `macce` is deprecated; expect support for it to be removed in a subsequent MySQL release.


### 12.10.4 South European and Middle East Character Sets

South European and Middle Eastern character sets supported by MySQL include Armenian, Arabic, Georgian, Greek, Hebrew, and Turkish.

* `armscii8` (ARMSCII-8 Armenian) collations:

  + `armscii8_bin`
  + `armscii8_general_ci` (default)
* `cp1256` (Windows Arabic) collations:

  + `cp1256_bin`
  + `cp1256_general_ci` (default)
* `geostd8` (GEOSTD8 Georgian) collations:

  + `geostd8_bin`
  + `geostd8_general_ci` (default)
* `greek` (ISO 8859-7 Greek) collations:

  + `greek_bin`
  + `greek_general_ci` (default)
* `hebrew` (ISO 8859-8 Hebrew) collations:

  + `hebrew_bin`
  + `hebrew_general_ci` (default)
* `latin5` (ISO 8859-9 Turkish) collations:

  + `latin5_bin`
  + `latin5_turkish_ci` (default)


### 12.10.5 Baltic Character Sets

The Baltic character sets cover Estonian, Latvian, and Lithuanian languages.

* `cp1257` (Windows Baltic) collations:

  + `cp1257_bin`
  + `cp1257_general_ci` (default)
  + `cp1257_lithuanian_ci`
* `latin7` (ISO 8859-13 Baltic) collations:

  + `latin7_bin`
  + `latin7_estonian_cs`
  + `latin7_general_ci` (default)
  + `latin7_general_cs`


### 12.10.6 Cyrillic Character Sets

The Cyrillic character sets and collations are for use with Belarusian, Bulgarian, Russian, Ukrainian, and Serbian (Cyrillic) languages.

* `cp1251` (Windows Cyrillic) collations:

  + `cp1251_bin`
  + `cp1251_bulgarian_ci`
  + `cp1251_general_ci` (default)
  + `cp1251_general_cs`
  + `cp1251_ukrainian_ci`
* `cp866` (DOS Russian) collations:

  + `cp866_bin`
  + `cp866_general_ci` (default)
* `koi8r` (KOI8-R Relcom Russian) collations:

  + `koi8r_bin`
  + `koi8r_general_ci` (default)
* `koi8u` (KOI8-U Ukrainian) collations:

  + `koi8u_bin`
  + `koi8u_general_ci` (default)


### 12.10.7 Asian Character Sets

The Asian character sets that we support include Chinese, Japanese, Korean, and Thai. These can be complicated. For example, the Chinese sets must allow for thousands of different characters. See Section 12.10.7.1, “The cp932 Character Set”, for additional information about the `cp932` and `sjis` character sets. See Section 12.10.7.2, “The gb18030 Character Set”, for additional information about character set support for the Chinese National Standard GB 18030.

For answers to some common questions and problems relating support for Asian character sets in MySQL, see [Section A.11, “MySQL 9.5 FAQ: MySQL Chinese, Japanese, and Korean Character Sets”](faqs-cjk.html "A.11 MySQL 9.5 FAQ: MySQL Chinese, Japanese, and Korean Character Sets").

* `big5` (Big5 Traditional Chinese) collations:

  + `big5_bin`
  + `big5_chinese_ci` (default)
* `cp932` (SJIS for Windows Japanese) collations:

  + `cp932_bin`
  + `cp932_japanese_ci` (default)
* `eucjpms` (UJIS for Windows Japanese) collations:

  + `eucjpms_bin`
  + `eucjpms_japanese_ci` (default)
* `euckr` (EUC-KR Korean) collations:

  + `euckr_bin`
  + `euckr_korean_ci` (default)
* `gb2312` (GB2312 Simplified Chinese) collations:

  + `gb2312_bin`
  + `gb2312_chinese_ci` (default)
* `gbk` (GBK Simplified Chinese) collations:

  + `gbk_bin`
  + `gbk_chinese_ci` (default)
* `gb18030` (China National Standard GB18030) collations:

  + `gb18030_bin`
  + `gb18030_chinese_ci` (default)
  + `gb18030_unicode_520_ci`
* `sjis` (Shift-JIS Japanese) collations:

  + `sjis_bin`
  + `sjis_japanese_ci` (default)
* `tis620` (TIS620 Thai) collations:

  + `tis620_bin`
  + `tis620_thai_ci` (default)
* `ujis` (EUC-JP Japanese) collations:

  + `ujis_bin`
  + `ujis_japanese_ci` (default)

The `big5_chinese_ci` collation sorts on number of strokes.


#### 12.10.7.1 The cp932 Character Set

**Why is `cp932` needed?**

In MySQL, the `sjis` character set corresponds to the `Shift_JIS` character set defined by IANA, which supports JIS X0201 and JIS X0208 characters. (See <http://www.iana.org/assignments/character-sets>.)

However, the meaning of “SHIFT JIS” as a descriptive term has become very vague and it often includes the extensions to `Shift_JIS` that are defined by various vendors.

For example, “SHIFT JIS” used in Japanese Windows environments is a Microsoft extension of `Shift_JIS` and its exact name is `Microsoft Windows Codepage : 932` or `cp932`. In addition to the characters supported by `Shift_JIS`, `cp932` supports extension characters such as NEC special characters, NEC selected—IBM extended characters, and IBM selected characters.

Many Japanese users have experienced problems using these extension characters. These problems stem from the following factors:

* MySQL automatically converts character sets.
* Character sets are converted using Unicode (`ucs2`).

* The `sjis` character set does not support the conversion of these extension characters.

* There are several conversion rules from so-called “SHIFT JIS” to Unicode, and some characters are converted to Unicode differently depending on the conversion rule. MySQL supports only one of these rules (described later).

The MySQL `cp932` character set is designed to solve these problems.

Because MySQL supports character set conversion, it is important to separate IANA `Shift_JIS` and `cp932` into two different character sets because they provide different conversion rules.

**How does `cp932` differ from `sjis`?**

The `cp932` character set differs from `sjis` in the following ways:

* `cp932` supports NEC special characters, NEC selected—IBM extended characters, and IBM selected characters.

* Some `cp932` characters have two different code points, both of which convert to the same Unicode code point. When converting from Unicode back to `cp932`, one of the code points must be selected. For this “round trip conversion,” the rule recommended by Microsoft is used. (See <http://support.microsoft.com/kb/170559/EN-US/>.)

  The conversion rule works like this:

  + If the character is in both JIS X 0208 and NEC special characters, use the code point of JIS X 0208.

  + If the character is in both NEC special characters and IBM selected characters, use the code point of NEC special characters.

  + If the character is in both IBM selected characters and NEC selected—IBM extended characters, use the code point of IBM extended characters.

  The table shown at <https://msdn.microsoft.com/en-us/goglobal/cc305152.aspx> provides information about the Unicode values of `cp932` characters. For `cp932` table entries with characters under which a four-digit number appears, the number represents the corresponding Unicode (`ucs2`) encoding. For table entries with an underlined two-digit value appears, there is a range of `cp932` character values that begin with those two digits. Clicking such a table entry takes you to a page that displays the Unicode value for each of the `cp932` characters that begin with those digits.

  The following links are of special interest. They correspond to the encodings for the following sets of characters:

  + NEC special characters (lead byte `0x87`):

    ```
    https://msdn.microsoft.com/en-us/goglobal/gg674964
    ```

  + NEC selected—IBM extended characters (lead byte `0xED` and `0xEE`):

    ```
    https://msdn.microsoft.com/en-us/goglobal/gg671837
    https://msdn.microsoft.com/en-us/goglobal/gg671838
    ```

  + IBM selected characters (lead byte `0xFA`, `0xFB`, `0xFC`):

    ```
    https://msdn.microsoft.com/en-us/goglobal/gg671839
    https://msdn.microsoft.com/en-us/goglobal/gg671840
    https://msdn.microsoft.com/en-us/goglobal/gg671841
    ```

* `cp932` supports conversion of user-defined characters in combination with `eucjpms`, and solves the problems with `sjis`/`ujis` conversion. For details, please refer to <http://www.sljfaq.org/afaq/encodings.html>.

For some characters, conversion to and from `ucs2` is different for `sjis` and `cp932`. The following tables illustrate these differences.

Conversion to `ucs2`:

<table summary="sjis/cp932 values and the difference between sjis to ucs2 conversion and cp932 to ucs2 conversion."><col style="width: 33%"/><col style="width: 33%"/><col style="width: 33%"/><thead><tr> <th scope="col"><code class="literal">sjis</code>/<code class="literal">cp932</code> Value</th> <th scope="col"><code class="literal">sjis</code> -&gt; <code class="literal">ucs2</code> Conversion</th> <th scope="col"><code class="literal">cp932</code> -&gt; <code class="literal">ucs2</code> Conversion</th> </tr></thead><tbody><tr> <th scope="row">5C</th> <td>005C</td> <td>005C</td> </tr><tr> <th scope="row">7E</th> <td>007E</td> <td>007E</td> </tr><tr> <th scope="row">815C</th> <td>2015</td> <td>2015</td> </tr><tr> <th scope="row">815F</th> <td>005C</td> <td>FF3C</td> </tr><tr> <th scope="row">8160</th> <td>301C</td> <td>FF5E</td> </tr><tr> <th scope="row">8161</th> <td>2016</td> <td>2225</td> </tr><tr> <th scope="row">817C</th> <td>2212</td> <td>FF0D</td> </tr><tr> <th scope="row">8191</th> <td>00A2</td> <td>FFE0</td> </tr><tr> <th scope="row">8192</th> <td>00A3</td> <td>FFE1</td> </tr><tr> <th scope="row">81CA</th> <td>00AC</td> <td>FFE2</td> </tr></tbody></table>

Conversion from `ucs2`:

<table summary="ucs2 values and the difference between ucs2 to sjis conversion and ucs2 to cp932 conversion."><col style="width: 33%"/><col style="width: 33%"/><col style="width: 33%"/><thead><tr> <th scope="col"><code class="literal">ucs2</code> value</th> <th scope="col"><code class="literal">ucs2</code> -&gt; <code class="literal">sjis</code> Conversion</th> <th scope="col"><code class="literal">ucs2</code> -&gt; <code class="literal">cp932</code> Conversion</th> </tr></thead><tbody><tr> <th scope="row">005C</th> <td>815F</td> <td>5C</td> </tr><tr> <th scope="row">007E</th> <td>7E</td> <td>7E</td> </tr><tr> <th scope="row">00A2</th> <td>8191</td> <td>3F</td> </tr><tr> <th scope="row">00A3</th> <td>8192</td> <td>3F</td> </tr><tr> <th scope="row">00AC</th> <td>81CA</td> <td>3F</td> </tr><tr> <th scope="row">2015</th> <td>815C</td> <td>815C</td> </tr><tr> <th scope="row">2016</th> <td>8161</td> <td>3F</td> </tr><tr> <th scope="row">2212</th> <td>817C</td> <td>3F</td> </tr><tr> <th scope="row">2225</th> <td>3F</td> <td>8161</td> </tr><tr> <th scope="row">301C</th> <td>8160</td> <td>3F</td> </tr><tr> <th scope="row">FF0D</th> <td>3F</td> <td>817C</td> </tr><tr> <th scope="row">FF3C</th> <td>3F</td> <td>815F</td> </tr><tr> <th scope="row">FF5E</th> <td>3F</td> <td>8160</td> </tr><tr> <th scope="row">FFE0</th> <td>3F</td> <td>8191</td> </tr><tr> <th scope="row">FFE1</th> <td>3F</td> <td>8192</td> </tr><tr> <th scope="row">FFE2</th> <td>3F</td> <td>81CA</td> </tr></tbody></table>


#### 12.10.7.2 The gb18030 Character Set

In MySQL, the `gb18030` character set corresponds to the *Chinese National Standard GB 18030-2005: Information technology — Chinese coded character set*, which is the official character set of the People's Republic of China (PRC).

##### Characteristics of the MySQL gb18030 Character Set

* Supports all code points defined by the GB 18030-2005 standard. Unassigned code points in the ranges (GB+8431A439, GB+90308130) and (GB+E3329A36, GB+EF39EF39) are treated as '`?`' (0x3F). Conversion of unassigned code points returns '`?`'.

* Supports UPPER and LOWER conversion for all GB18030 code points. Case folding defined by Unicode is also supported (based on `CaseFolding-6.3.0.txt`).

* Supports Conversion of data to and from other character sets.

* Supports SQL statements such as [`SET NAMES`](set-names.html "15.7.6.3 SET NAMES Statement").

* Supports comparison between `gb18030` strings, and between `gb18030` strings and strings of other character sets. There is a conversion if strings have different character sets. Comparisons that include or ignore trailing spaces are also supported.

* The private use area (U+E000, U+F8FF) in Unicode is mapped to `gb18030`.

* There is no mapping between (U+D800, U+DFFF) and GB18030. Attempted conversion of code points in this range returns '`?`'.

* If an incoming sequence is illegal, an error or warning is returned. If an illegal sequence is used in `CONVERT()`, an error is returned. Otherwise, a warning is returned.

* For consistency with `utf8mb3` and `utf8mb4`, UPPER is not supported for ligatures.

* Searches for ligatures also match uppercase ligatures when using the `gb18030_unicode_520_ci` collation.

* If a character has more than one uppercase character, the chosen uppercase character is the one whose lowercase is the character itself.

* The minimum multibyte length is 1 and the maximum is 4. The character set determines the length of a sequence using the first 1 or 2 bytes.

##### Supported Collations

* `gb18030_bin`: A binary collation.
* `gb18030_chinese_ci`: The default collation, which supports Pinyin. Sorting of non-Chinese characters is based on the order of the original sort key. The original sort key is `GB(UPPER(ch))` if `UPPER(ch)` exists. Otherwise, the original sort key is `GB(ch)`. Chinese characters are sorted according to the Pinyin collation defined in the Unicode Common Locale Data Repository (CLDR 24). Non-Chinese characters are sorted before Chinese characters with the exception of `GB+FE39FE39`, which is the code point maximum.

* `gb18030_unicode_520_ci`: A Unicode collation. Use this collation if you need to ensure that ligatures are sorted correctly.


### 12.10.8 The Binary Character Set

The `binary` character set is the character set for binary strings, which are sequences of bytes. The `binary` character set has one collation, also named `binary`. Comparison and sorting are based on numeric byte values, rather than on numeric character code values (which for multibyte characters differ from numeric byte values). For information about the differences between the `binary` collation of the `binary` character set and the `_bin` collations of nonbinary character sets, see Section 12.8.5, “The binary Collation Compared to \_bin Collations”.

For the `binary` character set, the concepts of lettercase and accent equivalence do not apply:

* For single-byte characters stored as binary strings, character and byte boundaries are the same, so lettercase and accent differences are significant in comparisons. That is, the `binary` collation is case-sensitive and accent-sensitive.

  ```
  mysql> SET NAMES 'binary';
  mysql> SELECT CHARSET('abc'), COLLATION('abc');
  +----------------+------------------+
  | CHARSET('abc') | COLLATION('abc') |
  +----------------+------------------+
  | binary         | binary           |
  +----------------+------------------+
  mysql> SELECT 'abc' = 'ABC', 'a' = 'ä';
  +---------------+------------+
  | 'abc' = 'ABC' | 'a' = 'ä'  |
  +---------------+------------+
  |             0 |          0 |
  +---------------+------------+
  ```

* For multibyte characters stored as binary strings, character and byte boundaries differ. Character boundaries are lost, so comparisons that depend on them are not meaningful.

To perform lettercase conversion of a binary string, first convert it to a nonbinary string using a character set appropriate for the data stored in the string:

```
mysql> SET @str = BINARY 'New York';
mysql> SELECT LOWER(@str), LOWER(CONVERT(@str USING utf8mb4));
+-------------+------------------------------------+
| LOWER(@str) | LOWER(CONVERT(@str USING utf8mb4)) |
+-------------+------------------------------------+
| New York    | new york                           |
+-------------+------------------------------------+
```

To convert a string expression to a binary string, these constructs are equivalent:

```
BINARY expr
CAST(expr AS BINARY)
CONVERT(expr USING BINARY)
```

If a value is a character string literal, the `_binary` introducer may be used to designate it as a binary string. For example:

```
_binary 'a'
```

The `_binary` introducer is permitted for hexadecimal literals and bit-value literals as well, but unnecessary; such literals are binary strings by default.

For more information about introducers, see Section 12.3.8, “Character Set Introducers”.

Note

Within the **mysql** client, binary strings display using hexadecimal notation, depending on the value of the `--binary-as-hex`. For more information about that option, see Section 6.5.1, “mysql — The MySQL Command-Line Client”.
