# Chapter 12 Character Sets, Collations, Unicode

**Table of Contents**

12.1 Character Sets and Collations in General

12.2 Character Sets and Collations in MySQL :   12.2.1 Character Set Repertoire

    12.2.2 UTF-8 for Metadata

12.3 Specifying Character Sets and Collations :   12.3.1 Collation Naming Conventions

    12.3.2 Server Character Set and Collation

    12.3.3 Database Character Set and Collation

    12.3.4 Table Character Set and Collation

    12.3.5 Column Character Set and Collation

    12.3.6 Character String Literal Character Set and Collation

    12.3.7 The National Character Set

    12.3.8 Character Set Introducers

    12.3.9 Examples of Character Set and Collation Assignment

    12.3.10 Compatibility with Other DBMSs

12.4 Connection Character Sets and Collations

12.5 Configuring Application Character Set and Collation

12.6 Error Message Character Set

12.7 Column Character Set Conversion

12.8 Collation Issues :   12.8.1 Using COLLATE in SQL Statements

    12.8.2 COLLATE Clause Precedence

    12.8.3 Character Set and Collation Compatibility

    12.8.4 Collation Coercibility in Expressions

    12.8.5 The binary Collation Compared to \_bin Collations

    12.8.6 Examples of the Effect of Collation

    12.8.7 Using Collation in INFORMATION\_SCHEMA Searches

12.9 Unicode Support :   12.9.1 The utf8mb4 Character Set (4-Byte UTF-8 Unicode Encoding)

    12.9.2 The utf8mb3 Character Set (3-Byte UTF-8 Unicode Encoding)

    12.9.3 The utf8 Character Set (Deprecated alias for utf8mb3)

    12.9.4 The ucs2 Character Set (UCS-2 Unicode Encoding)

    12.9.5 The utf16 Character Set (UTF-16 Unicode Encoding)

    12.9.6 The utf16le Character Set (UTF-16LE Unicode Encoding)

    12.9.7 The utf32 Character Set (UTF-32 Unicode Encoding)

    12.9.8 Converting Between 3-Byte and 4-Byte Unicode Character Sets

12.10 Supported Character Sets and Collations :   12.10.1 Unicode Character Sets

    12.10.2 West European Character Sets

    12.10.3 Central European Character Sets

    12.10.4 South European and Middle East Character Sets

    12.10.5 Baltic Character Sets

    12.10.6 Cyrillic Character Sets

    12.10.7 Asian Character Sets

    12.10.8 The Binary Character Set

12.11 Restrictions on Character Sets

12.12 Setting the Error Message Language

12.13 Adding a Character Set :   12.13.1 Character Definition Arrays

    12.13.2 String Collating Support for Complex Character Sets

    12.13.3 Multi-Byte Character Support for Complex Character Sets

12.14 Adding a Collation to a Character Set :   12.14.1 Collation Implementation Types

    12.14.2 Choosing a Collation ID

    12.14.3 Adding a Simple Collation to an 8-Bit Character Set

    12.14.4 Adding a UCA Collation to a Unicode Character Set

12.15 Character Set Configuration

12.16 MySQL Server Locale Support

MySQL includes character set support that enables you to store data using a variety of character sets and perform comparisons according to a variety of collations. The default MySQL server character set and collation are `utf8mb4` and `utf8mb4_0900_ai_ci`, but you can specify character sets at the server, database, table, column, and string literal levels. To maximize interoperability and future-proofing of your data and applications, we recommend that you use the `utf8mb4` character set whenever possible.

Note

`UTF8` is a deprecated synonym for `utf8mb3`, and you should expect it to be removed in a future version of MySQL. Specify `utfmb3` or (preferably) `utfmb4` instead.

This chapter discusses the following topics:

* What are character sets and collations?
* The multiple-level default system for character set assignment.
* Syntax for specifying character sets and collations.
* Affected functions and operations.
* Unicode support.
* The character sets and collations that are available, with notes.

* Selecting the language for error messages.
* Selecting the locale for day and month names.

Character set issues affect not only data storage, but also communication between client programs and the MySQL server. If you want the client program to communicate with the server using a character set different from the default, you need to indicate which one. For example, to use the `latin1` Unicode character set, issue this statement after connecting to the server:

```
SET NAMES 'latin1';
```

For more information about configuring character sets for application use and character set-related issues in client/server communication, see Section 12.5, “Configuring Application Character Set and Collation”, and Section 12.4, “Connection Character Sets and Collations”.
