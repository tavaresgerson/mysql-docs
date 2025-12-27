# Chapter 10 Character Sets, Collations, Unicode

**Table of Contents**

10.1 Character Sets and Collations in General

10.2 Character Sets and Collations in MySQL :   10.2.1 Character Set Repertoire

    10.2.2 UTF-8 for Metadata

10.3 Specifying Character Sets and Collations :   10.3.1 Collation Naming Conventions

    10.3.2 Server Character Set and Collation

    10.3.3 Database Character Set and Collation

    10.3.4 Table Character Set and Collation

    10.3.5 Column Character Set and Collation

    10.3.6 Character String Literal Character Set and Collation

    10.3.7 The National Character Set

    10.3.8 Character Set Introducers

    10.3.9 Examples of Character Set and Collation Assignment

    10.3.10 Compatibility with Other DBMSs

10.4 Connection Character Sets and Collations

10.5 Configuring Application Character Set and Collation

10.6 Error Message Character Set

10.7 Column Character Set Conversion

10.8 Collation Issues :   10.8.1 Using COLLATE in SQL Statements

    10.8.2 COLLATE Clause Precedence

    10.8.3 Character Set and Collation Compatibility

    10.8.4 Collation Coercibility in Expressions

    10.8.5 The binary Collation Compared to \_bin Collations

    10.8.6 Examples of the Effect of Collation

    10.8.7 Using Collation in INFORMATION\_SCHEMA Searches

10.9 Unicode Support :   10.9.1 The utf8mb4 Character Set (4-Byte UTF-8 Unicode Encoding)

    10.9.2 The utf8mb3 Character Set (3-Byte UTF-8 Unicode Encoding)

    10.9.3 The utf8 Character Set (Alias for utf8mb3)

    10.9.4 The ucs2 Character Set (UCS-2 Unicode Encoding)

    10.9.5 The utf16 Character Set (UTF-16 Unicode Encoding)

    10.9.6 The utf16le Character Set (UTF-16LE Unicode Encoding)

    10.9.7 The utf32 Character Set (UTF-32 Unicode Encoding)

    10.9.8 Converting Between 3-Byte and 4-Byte Unicode Character Sets

10.10 Supported Character Sets and Collations :   10.10.1 Unicode Character Sets

    10.10.2 West European Character Sets

    10.10.3 Central European Character Sets

    10.10.4 South European and Middle East Character Sets

    10.10.5 Baltic Character Sets

    10.10.6 Cyrillic Character Sets

    10.10.7 Asian Character Sets

    10.10.8 The Binary Character Set

10.11 Restrictions on Character Sets

10.12 Setting the Error Message Language

10.13 Adding a Character Set :   10.13.1 Character Definition Arrays

    10.13.2 String Collating Support for Complex Character Sets

    10.13.3 Multi-Byte Character Support for Complex Character Sets

10.14 Adding a Collation to a Character Set :   10.14.1 Collation Implementation Types

    10.14.2 Choosing a Collation ID

    10.14.3 Adding a Simple Collation to an 8-Bit Character Set

    10.14.4 Adding a UCA Collation to a Unicode Character Set

10.15 Character Set Configuration

10.16 MySQL Server Locale Support

MySQL includes character set support that enables you to store data using a variety of character sets and perform comparisons according to a variety of collations. The default MySQL server character set and collation are `latin1` and `latin1_swedish_ci`, but you can specify character sets at the server, database, table, column, and string literal levels.

This chapter discusses the following topics:

* What are character sets and collations?
* The multiple-level default system for character set assignment.
* Syntax for specifying character sets and collations.
* Affected functions and operations.
* Unicode support.
* The character sets and collations that are available, with notes.

* Selecting the language for error messages.
* Selecting the locale for day and month names.

Character set issues affect not only data storage, but also communication between client programs and the MySQL server. If you want the client program to communicate with the server using a character set different from the default, you'll need to indicate which one. For example, to use the `utf8` Unicode character set, issue this statement after connecting to the server:

```sql
SET NAMES 'utf8';
```

For more information about configuring character sets for application use and character set-related issues in client/server communication, see Section 10.5, “Configuring Application Character Set and Collation”, and Section 10.4, “Connection Character Sets and Collations”.
