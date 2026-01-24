### 13.1.22 DROP DATABASE Statement

```sql
DROP {DATABASE | SCHEMA} [IF EXISTS] db_name
```

[`DROP DATABASE`](drop-database.html "13.1.22 DROP DATABASE Statement") drops all tables in the database and deletes the database. Be *very* careful with this statement! To use [`DROP DATABASE`](drop-database.html "13.1.22 DROP DATABASE Statement"), you need the [`DROP`](privileges-provided.html#priv_drop) privilege on the database. [`DROP SCHEMA`](drop-database.html "13.1.22 DROP DATABASE Statement") is a synonym for [`DROP DATABASE`](drop-database.html "13.1.22 DROP DATABASE Statement").

Important

When a database is dropped, privileges granted specifically for the database are *not* automatically dropped. They must be dropped manually. See [Section 13.7.1.4, “GRANT Statement”](grant.html "13.7.1.4 GRANT Statement").

`IF EXISTS` is used to prevent an error from occurring if the database does not exist.

If the default database is dropped, the default database is unset (the [`DATABASE()`](information-functions.html#function_database) function returns `NULL`).

If you use [`DROP DATABASE`](drop-database.html "13.1.22 DROP DATABASE Statement") on a symbolically linked database, both the link and the original database are deleted.

[`DROP DATABASE`](drop-database.html "13.1.22 DROP DATABASE Statement") returns the number of tables that were removed. This corresponds to the number of `.frm` files removed.

The [`DROP DATABASE`](drop-database.html "13.1.22 DROP DATABASE Statement") statement removes from the given database directory those files and directories that MySQL itself may create during normal operation:

* All files with the following extensions:

  + `.BAK`
  + `.DAT`
  + `.HSH`
  + `.MRG`
  + `.MYD`
  + `.MYI`
  + `.TRG`
  + `.TRN`
  + `.cfg`
  + `.db`
  + `.frm`
  + `.ibd`
  + `.ndb`
  + `.par`
* The `db.opt` file, if it exists.

If other files or directories remain in the database directory after MySQL removes those just listed, the database directory cannot be removed. In this case, you must remove any remaining files or directories manually and issue the [`DROP DATABASE`](drop-database.html "13.1.22 DROP DATABASE Statement") statement again.

Dropping a database does not remove any `TEMPORARY` tables that were created in that database. `TEMPORARY` tables are automatically removed when the session that created them ends. See [Section 13.1.18.2, “CREATE TEMPORARY TABLE Statement”](create-temporary-table.html "13.1.18.2 CREATE TEMPORARY TABLE Statement").

You can also drop databases with [**mysqladmin**](mysqladmin.html "4.5.2 mysqladmin — A MySQL Server Administration Program"). See [Section 4.5.2, “mysqladmin — A MySQL Server Administration Program”](mysqladmin.html "4.5.2 mysqladmin — A MySQL Server Administration Program").
