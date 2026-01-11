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

  The `dec` character set is deprecated in MySQL 8.0.28; expect support for it to be removed in a subsequent MySQL release.

* `hp8` (HP Western European) collations:

  + `hp8_bin`
  + `hp8_english_ci` (default)

  The `hp8` character set is deprecated in MySQL 8.0.28; expect support for it to be removed in a subsequent MySQL release.

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

  `macroroman` is deprecated in MySQL 8.0.28; expect support for it to be removed in a subsequent MySQL release.

* `swe7` (7bit Swedish) collations:

  + `swe7_bin`
  + `swe7_swedish_ci` (default)
