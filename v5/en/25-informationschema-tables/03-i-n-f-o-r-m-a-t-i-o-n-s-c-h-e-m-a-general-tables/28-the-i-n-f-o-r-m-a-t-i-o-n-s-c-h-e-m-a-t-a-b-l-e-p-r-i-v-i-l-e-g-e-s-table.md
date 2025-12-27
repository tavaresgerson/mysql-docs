### 24.3.28 The INFORMATION\_SCHEMA TABLE\_PRIVILEGES Table

The [`TABLE_PRIVILEGES`](information-schema-table-privileges-table.html "24.3.28 The INFORMATION_SCHEMA TABLE_PRIVILEGES Table") table provides information about table privileges. It takes its values from the `mysql.tables_priv` system table.

The [`TABLE_PRIVILEGES`](information-schema-table-privileges-table.html "24.3.28 The INFORMATION_SCHEMA TABLE_PRIVILEGES Table") table has these columns:

* `GRANTEE`

  The name of the account to which the privilege is granted, in `'user_name'@'host_name'` format.

* `TABLE_CATALOG`

  The name of the catalog to which the table belongs. This value is always `def`.

* `TABLE_SCHEMA`

  The name of the schema (database) to which the table belongs.

* `TABLE_NAME`

  The name of the table.

* `PRIVILEGE_TYPE`

  The privilege granted. The value can be any privilege that can be granted at the table level; see [Section 13.7.1.4, “GRANT Statement”](grant.html "13.7.1.4 GRANT Statement"). Each row lists a single privilege, so there is one row per table privilege held by the grantee.

* `IS_GRANTABLE`

  `YES` if the user has the [`GRANT OPTION`](privileges-provided.html#priv_grant-option) privilege, `NO` otherwise. The output does not list [`GRANT OPTION`](privileges-provided.html#priv_grant-option) as a separate row with `PRIVILEGE_TYPE='GRANT OPTION'`.

#### Notes

* [`TABLE_PRIVILEGES`](information-schema-table-privileges-table.html "24.3.28 The INFORMATION_SCHEMA TABLE_PRIVILEGES Table") is a nonstandard `INFORMATION_SCHEMA` table.

The following statements are *not* equivalent:

```sql
SELECT ... FROM INFORMATION_SCHEMA.TABLE_PRIVILEGES

SHOW GRANTS ...
```
