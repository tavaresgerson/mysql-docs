### 10.14.4 Adding a UCA Collation to a Unicode Character Set

10.14.4.1 Defining a UCA Collation Using LDML Syntax

10.14.4.2 LDML Syntax Supported in MySQL

10.14.4.3 Diagnostics During Index.xml Parsing

This section describes how to add a UCA collation for a Unicode character set by writing the `<collation>` element within a `<charset>` character set description in the MySQL `Index.xml` file. The procedure described here does not require recompiling MySQL. It uses a subset of the Locale Data Markup Language (LDML) specification, which is available at <http://www.unicode.org/reports/tr35/>. With this method, you need not define the entire collation. Instead, you begin with an existing “base” collation and describe the new collation in terms of how it differs from the base collation. The following table lists the base collations of the Unicode character sets for which UCA collations can be defined. It is not possible to create user-defined UCA collations for `utf16le`; there is no `utf16le_unicode_ci` collation that would serve as the basis for such collations.

**Table 10.4 MySQL Character Sets Available for User-Defined UCA Collations**

<table summary="Unicode character sets for which user-defined UCA collations can be defined and their base collations."><col style="width: 30%"/><col style="width: 60%"/><thead><tr> <th>Character Set</th> <th>Base Collation</th> </tr></thead><tbody><tr> <td><code>utf8</code></td> <td><code>utf8_unicode_ci</code></td> </tr><tr> <td><code>ucs2</code></td> <td><code>ucs2_unicode_ci</code></td> </tr><tr> <td><code>utf16</code></td> <td><code>utf16_unicode_ci</code></td> </tr><tr> <td><code>utf32</code></td> <td><code>utf32_unicode_ci</code></td> </tr></tbody></table>

The following sections show how to add a collation that is defined using LDML syntax, and provide a summary of LDML rules supported in MySQL.
