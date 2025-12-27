#### 10.10.7.1 The cp932 Character Set

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

    ```sql
    https://msdn.microsoft.com/en-us/goglobal/gg674964
    ```

  + NEC selected—IBM extended characters (lead byte `0xED` and `0xEE`):

    ```sql
    https://msdn.microsoft.com/en-us/goglobal/gg671837
    https://msdn.microsoft.com/en-us/goglobal/gg671838
    ```

  + IBM selected characters (lead byte `0xFA`, `0xFB`, `0xFC`):

    ```sql
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

Users of any Japanese character sets should be aware that using `--character-set-client-handshake` (or `--skip-character-set-client-handshake`) has an important effect. See Section 5.1.6, “Server Command Options”.
