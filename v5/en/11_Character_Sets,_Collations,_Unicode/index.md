# Chapter 10 Character Sets, Collations, Unicode

**Table of Contents**

[10.1 Character Sets and Collations in General](charset-general.html)

[10.2 Character Sets and Collations in MySQL](charset-mysql.html)
:   [10.2.1 Character Set Repertoire](charset-repertoire.html)

    [10.2.2 UTF-8 for Metadata](charset-metadata.html)

[10.3 Specifying Character Sets and Collations](charset-syntax.html)
:   [10.3.1 Collation Naming Conventions](charset-collation-names.html)

    [10.3.2 Server Character Set and Collation](charset-server.html)

    [10.3.3 Database Character Set and Collation](charset-database.html)

    [10.3.4 Table Character Set and Collation](charset-table.html)

    [10.3.5 Column Character Set and Collation](charset-column.html)

    [10.3.6 Character String Literal Character Set and Collation](charset-literal.html)

    [10.3.7 The National Character Set](charset-national.html)

    [10.3.8 Character Set Introducers](charset-introducer.html)

    [10.3.9 Examples of Character Set and Collation Assignment](charset-examples.html)

    [10.3.10 Compatibility with Other DBMSs](charset-compatibility.html)

[10.4 Connection Character Sets and Collations](charset-connection.html)

[10.5 Configuring Application Character Set and Collation](charset-applications.html)

[10.6 Error Message Character Set](charset-errors.html)

[10.7 Column Character Set Conversion](charset-conversion.html)

[10.8 Collation Issues](charset-collations.html)
:   [10.8.1 Using COLLATE in SQL Statements](charset-collate.html)

    [10.8.2 COLLATE Clause Precedence](charset-collate-precedence.html)

    [10.8.3 Character Set and Collation Compatibility](charset-collation-compatibility.html)

    [10.8.4 Collation Coercibility in Expressions](charset-collation-coercibility.html)

    [10.8.5 The binary Collation Compared to \_bin Collations](charset-binary-collations.html)

    [10.8.6 Examples of the Effect of Collation](charset-collation-effect.html)

    [10.8.7 Using Collation in INFORMATION\_SCHEMA Searches](charset-collation-information-schema.html)

[10.9 Unicode Support](charset-unicode.html)
:   [10.9.1 The utf8mb4 Character Set (4-Byte UTF-8 Unicode Encoding)](charset-unicode-utf8mb4.html)

    [10.9.2 The utf8mb3 Character Set (3-Byte UTF-8 Unicode Encoding)](charset-unicode-utf8mb3.html)

    [10.9.3 The utf8 Character Set (Alias for utf8mb3)](charset-unicode-utf8.html)

    [10.9.4 The ucs2 Character Set (UCS-2 Unicode Encoding)](charset-unicode-ucs2.html)

    [10.9.5 The utf16 Character Set (UTF-16 Unicode Encoding)](charset-unicode-utf16.html)

    [10.9.6 The utf16le Character Set (UTF-16LE Unicode Encoding)](charset-unicode-utf16le.html)

    [10.9.7 The utf32 Character Set (UTF-32 Unicode Encoding)](charset-unicode-utf32.html)

    [10.9.8 Converting Between 3-Byte and 4-Byte Unicode Character Sets](charset-unicode-conversion.html)

[10.10 Supported Character Sets and Collations](charset-charsets.html)
:   [10.10.1 Unicode Character Sets](charset-unicode-sets.html)

    [10.10.2 West European Character Sets](charset-we-sets.html)

    [10.10.3 Central European Character Sets](charset-ce-sets.html)

    [10.10.4 South European and Middle East Character Sets](charset-se-me-sets.html)

    [10.10.5 Baltic Character Sets](charset-baltic-sets.html)

    [10.10.6 Cyrillic Character Sets](charset-cyrillic-sets.html)

    [10.10.7 Asian Character Sets](charset-asian-sets.html)

    [10.10.8 The Binary Character Set](charset-binary-set.html)

[10.11 Restrictions on Character Sets](charset-restrictions.html)

[10.12 Setting the Error Message Language](error-message-language.html)

[10.13 Adding a Character Set](adding-character-set.html)
:   [10.13.1 Character Definition Arrays](character-arrays.html)

    [10.13.2 String Collating Support for Complex Character Sets](string-collating.html)

    [10.13.3 Multi-Byte Character Support for Complex Character Sets](multibyte-characters.html)

[10.14 Adding a Collation to a Character Set](adding-collation.html)
:   [10.14.1 Collation Implementation Types](charset-collation-implementations.html)

    [10.14.2 Choosing a Collation ID](adding-collation-choosing-id.html)

    [10.14.3 Adding a Simple Collation to an 8-Bit Character Set](adding-collation-simple-8bit.html)

    [10.14.4 Adding a UCA Collation to a Unicode Character Set](adding-collation-unicode-uca.html)

[10.15 Character Set Configuration](charset-configuration.html)

[10.16 MySQL Server Locale Support](locale-support.html)

MySQL includes character set support that enables you to store data
using a variety of character sets and perform comparisons according
to a variety of collations. The default MySQL server character set
and collation are `latin1` and
`latin1_swedish_ci`, but you can specify character
sets at the server, database, table, column, and string literal
levels.

This chapter discusses the following topics:

* What are character sets and collations?
* The multiple-level default system for character set assignment.
* Syntax for specifying character sets and collations.
* Affected functions and operations.
* Unicode support.
* The character sets and collations that are available, with
  notes.

* Selecting the language for error messages.
* Selecting the locale for day and month names.

Character set issues affect not only data storage, but also
communication between client programs and the MySQL server. If you
want the client program to communicate with the server using a
character set different from the default, you'll need to indicate
which one. For example, to use the `utf8` Unicode
character set, issue this statement after connecting to the server:

```sql
SET NAMES 'utf8';
```

For more information about configuring character sets for
application use and character set-related issues in client/server
communication, see [Section 10.5, “Configuring Application Character Set and Collation”](charset-applications.html "10.5 Configuring Application Character Set and Collation"), and
[Section 10.4, “Connection Character Sets and Collations”](charset-connection.html "10.4 Connection Character Sets and Collations").