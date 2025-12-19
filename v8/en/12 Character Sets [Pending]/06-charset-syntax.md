--- title: MySQL 8.4 Reference Manual :: 12.3 Specifying Character Sets and Collations url: https://dev.mysql.com/doc/refman/8.4/en/charset-syntax.html order: 6 ---



## 12.3 Specifying Character Sets and Collations

 12.3.1 Collation Naming Conventions

 12.3.2 Server Character Set and Collation

 12.3.3 Database Character Set and Collation

 12.3.4 Table Character Set and Collation

 12.3.5 Column Character Set and Collation

 12.3.6 Character String Literal Character Set and Collation

 12.3.7 The National Character Set

 12.3.8 Character Set Introducers

 12.3.9 Examples of Character Set and Collation Assignment

 12.3.10 Compatibility with Other DBMSs

There are default settings for character sets and collations at four levels: server, database, table, and column. The description in the following sections may appear complex, but it has been found in practice that multiple-level defaulting leads to natural and obvious results.

`CHARACTER SET` is used in clauses that specify a character set. `CHARSET` can be used as a synonym for `CHARACTER SET`.

Character set issues affect not only data storage, but also communication between client programs and the MySQL server. If you want the client program to communicate with the server using a character set different from the default, you need to indicate which one. For example, to use the `latin1` Unicode character set, issue this statement after connecting to the server:

```
SET NAMES 'latin1';
```

For more information about character set-related issues in client/server communication, see Section 12.4, “Connection Character Sets and Collations”.


