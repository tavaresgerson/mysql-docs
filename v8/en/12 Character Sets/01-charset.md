# Chapter 12 Character Sets, Collations, Unicode

MySQL includes character set support that enables you to store data using a variety of character sets and perform comparisons according to a variety of collations. The default MySQL server character set and collation are `utf8mb4` and `utf8mb4_0900_ai_ci`, but you can specify character sets at the server, database, table, column, and string literal levels. To maximize interoperability and future-proofing of your data and applications, we recommend that you use the `utf8mb4` character set whenever possible.

::: info Note

`UTF8` is a deprecated synonym for `utf8mb3`, and you should expect it to be removed in a future version of MySQL. Specify `utfmb3` or (preferably) `utfmb4` instead.

:::

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

For more information about configuring character sets for application use and character set-related issues in client/server communication, see  Section 12.5, “Configuring Application Character Set and Collation”, and Section 12.4, “Connection Character Sets and Collations”.
