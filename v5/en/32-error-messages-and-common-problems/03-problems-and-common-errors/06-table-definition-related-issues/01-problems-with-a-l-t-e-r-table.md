#### B.3.6.1 Problems with ALTER TABLE

If you get a duplicate-key error when using [`ALTER TABLE`](alter-table.html "13.1.8 ALTER TABLE Statement") to change the character set or collation of a character column, the cause is either that the new column collation maps two keys to the same value or that the table is corrupted. In the latter case, you should run [`REPAIR TABLE`](repair-table.html "13.7.2.5 REPAIR TABLE Statement") on the table. [`REPAIR TABLE`](repair-table.html "13.7.2.5 REPAIR TABLE Statement") works for `MyISAM`, `ARCHIVE`, and `CSV` tables.

If [`ALTER TABLE`](alter-table.html "13.1.8 ALTER TABLE Statement") dies with the following error, the problem may be that MySQL crashed during an earlier [`ALTER TABLE`](alter-table.html "13.1.8 ALTER TABLE Statement") operation and there is an old table named `A-xxx` or `B-xxx` lying around:

```sql
Error on rename of './database/name.frm'
to './database/B-xxx.frm' (Errcode: 17)
```

In this case, go to the MySQL data directory and delete all files that have names starting with `A-` or `B-`. (You may want to move them elsewhere instead of deleting them.)

[`ALTER TABLE`](alter-table.html "13.1.8 ALTER TABLE Statement") works in the following way:

* Create a new table named `A-xxx` with the requested structural changes.

* Copy all rows from the original table to `A-xxx`.

* Rename the original table to `B-xxx`.

* Rename `A-xxx` to your original table name.

* Delete `B-xxx`.

If something goes wrong with the renaming operation, MySQL tries to undo the changes. If something goes seriously wrong (although this shouldn't happen), MySQL may leave the old table as `B-xxx`. A simple rename of the table files at the system level should get your data back.

If you use [`ALTER TABLE`](alter-table.html "13.1.8 ALTER TABLE Statement") on a transactional table or if you are using Windows, [`ALTER TABLE`](alter-table.html "13.1.8 ALTER TABLE Statement") unlocks the table if you had done a [`LOCK TABLE`](lock-tables.html "13.3.5 LOCK TABLES and UNLOCK TABLES Statements") on it. This is done because `InnoDB` and these operating systems cannot drop a table that is in use.
