## 10.3 Specifying Character Sets and Collations

10.3.1 Collation Naming Conventions

10.3.2 Server Character Set and Collation

10.3.3 Database Character Set and Collation

10.3.4 Table Character Set and Collation

10.3.5 Column Character Set and Collation

10.3.6 Character String Literal Character Set and Collation

10.3.7 The National Character Set

10.3.8 Character Set Introducers

10.3.9 Examples of Character Set and Collation Assignment

10.3.10 Compatibility with Other DBMSs

There are default settings for character sets and collations at four levels: server, database, table, and column. The description in the following sections may appear complex, but it has been found in practice that multiple-level defaulting leads to natural and obvious results.

`CHARACTER SET` is used in clauses that specify a character set. `CHARSET` can be used as a synonym for `CHARACTER SET`.

Character set issues affect not only data storage, but also communication between client programs and the MySQL server. If you want the client program to communicate with the server using a character set different from the default, you'll need to indicate which one. For example, to use the `utf8` Unicode character set, issue this statement after connecting to the server:

```sql
SET NAMES 'utf8';
```

For more information about character set-related issues in client/server communication, see Section 10.4, “Connection Character Sets and Collations”.
