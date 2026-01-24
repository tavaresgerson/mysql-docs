#### 13.2.5.3 INSERT DELAYED Statement

```sql
INSERT DELAYED ...
```

The `DELAYED` option for the [`INSERT`](insert.html "13.2.5 INSERT Statement") statement is a MySQL extension to standard SQL. In previous versions of MySQL, it can be used for certain kinds of tables (such as `MyISAM`), such that when a client uses [`INSERT DELAYED`](insert-delayed.html "13.2.5.3 INSERT DELAYED Statement"), it gets an okay from the server at once, and the row is queued to be inserted when the table is not in use by any other thread.

`DELAYED` inserts and replaces were deprecated in MySQL 5.6. In MySQL 5.7, `DELAYED` is not supported. The server recognizes but ignores the `DELAYED` keyword, handles the insert as a nondelayed insert, and generates an `ER_WARN_LEGACY_SYNTAX_CONVERTED` warning: INSERT DELAYED is no longer supported. The statement was converted to INSERT. The `DELAYED` keyword is scheduled for removal in a future release.
