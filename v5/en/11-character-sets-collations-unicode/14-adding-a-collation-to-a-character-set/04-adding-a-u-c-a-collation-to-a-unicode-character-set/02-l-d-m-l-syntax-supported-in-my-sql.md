#### 10.14.4.2 LDML Syntax Supported in MySQL

This section describes the LDML syntax that MySQL recognizes. This is a subset of the syntax described in the LDML specification available at <http://www.unicode.org/reports/tr35/>, which should be consulted for further information. MySQL recognizes a large enough subset of the syntax that, in many cases, it is possible to download a collation definition from the Unicode Common Locale Data Repository and paste the relevant part (that is, the part between the `<rules>` and `</rules>` tags) into the MySQL `Index.xml` file. The rules described here are all supported except that character sorting occurs only at the primary level. Rules that specify differences at secondary or higher sort levels are recognized (and thus can be included in collation definitions) but are treated as equality at the primary level.

The MySQL server generates diagnostics when it finds problems while parsing the `Index.xml` file. See Section 10.14.4.3, “Diagnostics During Index.xml Parsing”.

**Character Representation**

Characters named in LDML rules can be written literally or in `\unnnn` format, where *`nnnn`* is the hexadecimal Unicode code point value. For example, `A` and `á` can be written literally or as `\u0041` and `\u00E1`. Within hexadecimal values, the digits `A` through `F` are not case-sensitive; `\u00E1` and `\u00e1` are equivalent. For UCA 4.0.0 collations, hexadecimal notation can be used only for characters in the Basic Multilingual Plane, not for characters outside the BMP range of `0000` to `FFFF`. For UCA 5.2.0 collations, hexadecimal notation can be used for any character.

The `Index.xml` file itself should be written using UTF-8 encoding.

**Syntax Rules**

LDML has reset rules and shift rules to specify character ordering. Orderings are given as a set of rules that begin with a reset rule that establishes an anchor point, followed by shift rules that indicate how characters sort relative to the anchor point.

* A `<reset>` rule does not specify any ordering in and of itself. Instead, it “resets” the ordering for subsequent shift rules to cause them to be taken in relation to a given character. Either of the following rules resets subsequent shift rules to be taken in relation to the letter `'A'`:

  ```sql
  <reset>A</reset>

  <reset>\u0041</reset>
  ```

* The `<p>`, `<s>`, and `<t>` shift rules define primary, secondary, and tertiary differences of a character from another character:

  + Use primary differences to distinguish separate letters.

  + Use secondary differences to distinguish accent variations.

  + Use tertiary differences to distinguish lettercase variations.

  Either of these rules specifies a primary shift rule for the `'G'` character:

  ```sql
  <p>G</p>

  <p>\u0047</p>
  ```

* The `<i>` shift rule indicates that one character sorts identically to another. The following rules cause `'b'` to sort the same as `'a'`:

  ```sql
  <reset>a</reset>
  <i>b</i>
  ```

* Abbreviated shift syntax specifies multiple shift rules using a single pair of tags. The following table shows the correspondence between abbreviated syntax rules and the equivalent nonabbreviated rules.

  **Table 10.5 Abbreviated Shift Syntax**

  <table summary="Abbreviated and corresponding nonabbreviated shift syntax rules."><col style="width: 40%"/><col style="width: 60%"/><thead><tr> <th>Abbreviated Syntax</th> <th>Nonabbreviated Syntax</th> </tr></thead><tbody><tr> <td><code>&lt;pc&gt;xyz&lt;/pc&gt;</code></td> <td><code>&lt;p&gt;x&lt;/p&gt;&lt;p&gt;y&lt;/p&gt;&lt;p&gt;z&lt;/p&gt;</code></td> </tr><tr> <td><code>&lt;sc&gt;xyz&lt;/sc&gt;</code></td> <td><code>&lt;s&gt;x&lt;/s&gt;&lt;s&gt;y&lt;/s&gt;&lt;s&gt;z&lt;/s&gt;</code></td> </tr><tr> <td><code>&lt;tc&gt;xyz&lt;/tc&gt;</code></td> <td><code>&lt;t&gt;x&lt;/t&gt;&lt;t&gt;y&lt;/t&gt;&lt;t&gt;z&lt;/t&gt;</code></td> </tr><tr> <td><code>&lt;ic&gt;xyz&lt;/ic&gt;</code></td> <td><code>&lt;i&gt;x&lt;/i&gt;&lt;i&gt;y&lt;/i&gt;&lt;i&gt;z&lt;/i&gt;</code></td> </tr></tbody></table>

* An expansion is a reset rule that establishes an anchor point for a multiple-character sequence. MySQL supports expansions 2 to 6 characters long. The following rules put `'z'` greater at the primary level than the sequence of three characters `'abc'`:

  ```sql
  <reset>abc</reset>
  <p>z</p>
  ```

* A contraction is a shift rule that sorts a multiple-character sequence. MySQL supports contractions 2 to 6 characters long. The following rules put the sequence of three characters `'xyz'` greater at the primary level than `'a'`:

  ```sql
  <reset>a</reset>
  <p>xyz</p>
  ```

* Long expansions and long contractions can be used together. These rules put the sequence of three characters `'xyz'` greater at the primary level than the sequence of three characters `'abc'`:

  ```sql
  <reset>abc</reset>
  <p>xyz</p>
  ```

* Normal expansion syntax uses `<x>` plus `<extend>` elements to specify an expansion. The following rules put the character `'k'` greater at the secondary level than the sequence `'ch'`. That is, `'k'` behaves as if it expands to a character after `'c'` followed by `'h'`:

  ```sql
  <reset>c</reset>
  <x><s>k</s><extend>h</extend></x>
  ```

  This syntax permits long sequences. These rules sort the sequence `'ccs'` greater at the tertiary level than the sequence `'cscs'`:

  ```sql
  <reset>cs</reset>
  <x><t>ccs</t><extend>cs</extend></x>
  ```

  The LDML specification describes normal expansion syntax as “tricky.” See that specification for details.

* Previous context syntax uses `<x>` plus `<context>` elements to specify that the context before a character affects how it sorts. The following rules put `'-'` greater at the secondary level than `'a'`, but only when `'-'` occurs after `'b'`:

  ```sql
  <reset>a</reset>
  <x><context>b</context><s>-</s></x>
  ```

* Previous context syntax can include the `<extend>` element. These rules put `'def'` greater at the primary level than `'aghi'`, but only when `'def'` comes after `'abc'`:

  ```sql
  <reset>a</reset>
  <x><context>abc</context><p>def</p><extend>ghi</extend></x>
  ```

* Reset rules permit a `before` attribute. Normally, shift rules after a reset rule indicate characters that sort after the reset character. Shift rules after a reset rule that has the `before` attribute indicate characters that sort before the reset character. The following rules put the character `'b'` immediately before `'a'` at the primary level:

  ```sql
  <reset before="primary">a</reset>
  <p>b</p>
  ```

  Permissible `before` attribute values specify the sort level by name or the equivalent numeric value:

  ```sql
  <reset before="primary">
  <reset before="1">

  <reset before="secondary">
  <reset before="2">

  <reset before="tertiary">
  <reset before="3">
  ```

* A reset rule can name a logical reset position rather than a literal character:

  ```sql
  <first_tertiary_ignorable/>
  <last_tertiary_ignorable/>
  <first_secondary_ignorable/>
  <last_secondary_ignorable/>
  <first_primary_ignorable/>
  <last_primary_ignorable/>
  <first_variable/>
  <last_variable/>
  <first_non_ignorable/>
  <last_non_ignorable/>
  <first_trailing/>
  <last_trailing/>
  ```

  These rules put `'z'` greater at the primary level than nonignorable characters that have a Default Unicode Collation Element Table (DUCET) entry and that are not CJK:

  ```sql
  <reset><last_non_ignorable/></reset>
  <p>z</p>
  ```

  Logical positions have the code points shown in the following table.

  **Table 10.6 Logical Reset Position Code Points**

  <table summary="Logical positions and Unicode 4.0.0 and Unicode 5.2.0 code points."><col style="width: 40%"/><col style="width: 30%"/><col style="width: 30%"/><thead><tr> <th scope="col">Logical Position</th> <th scope="col">Unicode 4.0.0 Code Point</th> <th scope="col">Unicode 5.2.0 Code Point</th> </tr></thead><tbody><tr> <th scope="row"><code>&lt;first_non_ignorable/&gt;</code></th> <td>U+02D0</td> <td>U+02D0</td> </tr><tr> <th scope="row"><code>&lt;last_non_ignorable/&gt;</code></th> <td>U+A48C</td> <td>U+1342E</td> </tr><tr> <th scope="row"><code>&lt;first_primary_ignorable/&gt;</code></th> <td>U+0332</td> <td>U+0332</td> </tr><tr> <th scope="row"><code>&lt;last_primary_ignorable/&gt;</code></th> <td>U+20EA</td> <td>U+101FD</td> </tr><tr> <th scope="row"><code>&lt;first_secondary_ignorable/&gt;</code></th> <td>U+0000</td> <td>U+0000</td> </tr><tr> <th scope="row"><code>&lt;last_secondary_ignorable/&gt;</code></th> <td>U+FE73</td> <td>U+FE73</td> </tr><tr> <th scope="row"><code>&lt;first_tertiary_ignorable/&gt;</code></th> <td>U+0000</td> <td>U+0000</td> </tr><tr> <th scope="row"><code>&lt;last_tertiary_ignorable/&gt;</code></th> <td>U+FE73</td> <td>U+FE73</td> </tr><tr> <th scope="row"><code>&lt;first_trailing/&gt;</code></th> <td>U+0000</td> <td>U+0000</td> </tr><tr> <th scope="row"><code>&lt;last_trailing/&gt;</code></th> <td>U+0000</td> <td>U+0000</td> </tr><tr> <th scope="row"><code>&lt;first_variable/&gt;</code></th> <td>U+0009</td> <td>U+0009</td> </tr><tr> <th scope="row"><code>&lt;last_variable/&gt;</code></th> <td>U+2183</td> <td>U+1D371</td> </tr></tbody></table>

* The `<collation>` element permits a `shift-after-method` attribute that affects character weight calculation for shift rules. The attribute has these permitted values:

  + `simple`: Calculate character weights as for reset rules that do not have a `before` attribute. This is the default if the attribute is not given.

  + `expand`: Use expansions for shifts after reset rules.

  Suppose that `'0'` and `'1'` have weights of `0E29` and `0E2A` and we want to put all basic Latin letters between `'0'` and `'1'`:

  ```sql
  <reset>0</reset>
  <pc>abcdefghijklmnopqrstuvwxyz</pc>
  ```

  For simple shift mode, weights are calculated as follows:

  ```sql
  'a' has weight 0E29+1
  'b' has weight 0E29+2
  'c' has weight 0E29+3
  ...
  ```

  However, there are not enough vacant positions to put 26 characters between `'0'` and `'1'`. The result is that digits and letters are intermixed.

  To solve this, use `shift-after-method="expand"`. Then weights are calculated like this:

  ```sql
  'a' has weight [0E29][233D+1]
  'b' has weight [0E29][233D+2]
  'c' has weight [0E29][233D+3]
  ...
  ```

  `233D` is the UCA 4.0.0 weight for character `0xA48C`, which is the last nonignorable character (a sort of the greatest character in the collation, excluding CJK). UCA 5.2.0 is similar but uses `3ACA`, for character `0x1342E`.

**MySQL-Specific LDML Extensions**

An extension to LDML rules permits the `<collation>` element to include an optional `version` attribute in `<collation>` tags to indicate the UCA version on which the collation is based. If the `version` attribute is omitted, its default value is `4.0.0`. For example, this specification indicates a collation that is based on UCA 5.2.0:

```sql
<collation id="nnn" name="utf8_xxx_ci" version="5.2.0">
...
</collation>
```
