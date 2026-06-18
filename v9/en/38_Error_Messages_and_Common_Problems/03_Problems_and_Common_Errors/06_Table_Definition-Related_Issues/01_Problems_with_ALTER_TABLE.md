#### B.3.6.1 Problems with ALTER TABLE

If you get a duplicate-key error when using
[`ALTER TABLE`](alter-table.html "15.1.11 ALTER TABLE Statement") to change the
character set or collation of a character column, the cause is
either that the new column collation maps two keys to the same
value or that the table is corrupted. In the latter case, you
should run [`REPAIR TABLE`](repair-table.html "15.7.3.5 REPAIR TABLE Statement") on the
table. [`REPAIR TABLE`](repair-table.html "15.7.3.5 REPAIR TABLE Statement") works for
`MyISAM`, `ARCHIVE`, and
`CSV` tables.

If you use [`ALTER TABLE`](alter-table.html "15.1.11 ALTER TABLE Statement") on a
transactional table or if you are using Windows,
[`ALTER TABLE`](alter-table.html "15.1.11 ALTER TABLE Statement") unlocks the table
if you had done a
[`LOCK
TABLE`](lock-tables.html "15.3.6 LOCK TABLES and UNLOCK TABLES Statements") on it. This is done because
`InnoDB` and these operating systems cannot
drop a table that is in use.