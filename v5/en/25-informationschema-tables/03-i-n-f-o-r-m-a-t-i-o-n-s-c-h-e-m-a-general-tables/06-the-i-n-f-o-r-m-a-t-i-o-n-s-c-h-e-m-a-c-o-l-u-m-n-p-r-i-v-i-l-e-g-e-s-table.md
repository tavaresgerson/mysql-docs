### 24.3.6 The INFORMATION\_SCHEMA COLUMN\_PRIVILEGES Table

The [`COLUMN_PRIVILEGES`](information-schema-column-privileges-table.html "24.3.6 The INFORMATION_SCHEMA COLUMN_PRIVILEGES Table") table provides information about column privileges. It takes its values from the `mysql.columns_priv` system table.

The [`COLUMN_PRIVILEGES`](information-schema-column-privileges-table.html "24.3.6 The INFORMATION_SCHEMA COLUMN_PRIVILEGES Table") table has these columns:

* `GRANTEE`

  The name of the account to which the privilege is granted, in `'user_name'@'host_name'` format.

* `TABLE_CATALOG`

  The name of the catalog to which the table containing the column belongs. This value is always `def`.

* `TABLE_SCHEMA`

  The name of the schema (database) to which the table containing the column belongs.

* `TABLE_NAME`

  The name of the table containing the column.

* `COLUMN_NAME`

  The name of the column.

* `PRIVILEGE_TYPE`

  The privilege granted. The value can be any privilege that can be granted at the column level; see [Section 13.7.1.4, “GRANT Statement”](grant.html "13.7.1.4 GRANT Statement"). Each row lists a single privilege, so there is one row per column privilege held by the grantee.

  In the output from [`SHOW FULL COLUMNS`](show-columns.html "13.7.5.5 SHOW COLUMNS Statement"), the privileges are all in one column and in lowercase, for example, `select,insert,update,references`. In [`COLUMN_PRIVILEGES`](information-schema-column-privileges-table.html "24.3.6 The INFORMATION_SCHEMA COLUMN_PRIVILEGES Table"), there is one privilege per row, in uppercase.

* `IS_GRANTABLE`

  `YES` if the user has the [`GRANT OPTION`](privileges-provided.html#priv_grant-option) privilege, `NO` otherwise. The output does not list [`GRANT OPTION`](privileges-provided.html#priv_grant-option) as a separate row with `PRIVILEGE_TYPE='GRANT OPTION'`.

#### Notes

* [`COLUMN_PRIVILEGES`](information-schema-column-privileges-table.html "24.3.6 The INFORMATION_SCHEMA COLUMN_PRIVILEGES Table") is a nonstandard `INFORMATION_SCHEMA` table.

The following statements are *not* equivalent:

```sql
SELECT ... FROM INFORMATION_SCHEMA.COLUMN_PRIVILEGES

SHOW GRANTS ...
```
