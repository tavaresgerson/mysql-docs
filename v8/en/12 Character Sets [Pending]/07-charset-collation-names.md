--- title: MySQL 8.4 Reference Manual :: 12.3.1 Collation Naming Conventions url: https://dev.mysql.com/doc/refman/8.4/en/charset-collation-names.html order: 7 ---



### 12.3.1 Collation Naming Conventions

MySQL collation names follow these conventions:

* A collation name starts with the name of the character set with which it is associated, generally followed by one or more suffixes indicating other collation characteristics. For example, `utf8mb4_0900_ai_ci` and `latin1_swedish_ci` are collations for the `utf8mb4` and `latin1` character sets, respectively. The `binary` character set has a single collation, also named `binary`, with no suffixes.
* A language-specific collation includes a locale code or language name. For example, `utf8mb4_tr_0900_ai_ci` and `utf8mb4_hu_0900_ai_ci` sort characters for the `utf8mb4` character set using the rules of Turkish and Hungarian, respectively. `utf8mb4_turkish_ci` and `utf8mb4_hungarian_ci` are similar but based on a less recent version of the Unicode Collation Algorithm.
* Collation suffixes indicate whether a collation is case-sensitive, accent-sensitive, or kana-sensitive (or some combination thereof), or binary. The following table shows the suffixes used to indicate these characteristics.

  **Table 12.1 Collation Suffix Meanings**

  <table><col style="width: 20%"/><col style="width: 80%"/><thead><tr> <th>Suffix</th> <th>Meaning</th> </tr></thead><tbody><tr> <td><code>_ai</code></td> <td>Accent-insensitive</td> </tr><tr> <td><code>_as</code></td> <td>Accent-sensitive</td> </tr><tr> <td><code>_ci</code></td> <td>Case-insensitive</td> </tr><tr> <td><code>_cs</code></td> <td>Case-sensitive</td> </tr><tr> <td><code>_ks</code></td> <td>Kana-sensitive</td> </tr><tr> <td><code>_bin</code></td> <td>Binary</td> </tr></tbody></table>

  For nonbinary collation names that do not specify accent sensitivity, it is determined by case sensitivity. If a collation name does not contain `_ai` or `_as`, `_ci` in the name implies `_ai` and `_cs` in the name implies `_as`. For example, `latin1_general_ci` is explicitly case-insensitive and implicitly accent-insensitive, `latin1_general_cs` is explicitly case-sensitive and implicitly accent-sensitive, and `utf8mb4_0900_ai_ci` is explicitly case-insensitive and accent-insensitive.

  For Japanese collations, the `_ks` suffix indicates that a collation is kana-sensitive; that is, it distinguishes Katakana characters from Hiragana characters. Japanese collations without the `_ks` suffix are not kana-sensitive and treat Katakana and Hiragana characters equal for sorting.

  For the `binary` collation of the `binary` character set, comparisons are based on numeric byte values. For the `_bin` collation of a nonbinary character set, comparisons are based on numeric character code values, which differ from byte values for multibyte characters. For information about the differences between the `binary` collation of the `binary` character set and the `_bin` collations of nonbinary character sets, see  Section 12.8.5, “The binary Collation Compared to \_bin Collations”.
* Collation names for Unicode character sets may include a version number to indicate the version of the Unicode Collation Algorithm (UCA) on which the collation is based. UCA-based collations without a version number in the name use the version-4.0.0 UCA weight keys. For example:

  + `utf8mb4_0900_ai_ci` is based on UCA 9.0.0 weight keys (<http://www.unicode.org/Public/UCA/9.0.0/allkeys.txt>).
  + `utf8mb4_unicode_520_ci` is based on UCA 5.2.0 weight keys (<http://www.unicode.org/Public/UCA/5.2.0/allkeys.txt>).
  + `utf8mb4_unicode_ci` (with no version named) is based on UCA 4.0.0 weight keys (<http://www.unicode.org/Public/UCA/4.0.0/allkeys-4.0.0.txt>).
* For Unicode character sets, the `xxx_general_mysql500_ci` collations preserve the pre-5.1.24 ordering of the original `xxx_general_ci` collations and permit upgrades for tables created before MySQL 5.1.24 (Bug #27877).

