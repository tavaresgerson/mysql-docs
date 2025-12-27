### 24.3.22 The INFORMATION\_SCHEMA SCHEMATA Table

A schema is a database, so the [`SCHEMATA`](information-schema-schemata-table.html "24.3.22 The INFORMATION_SCHEMA SCHEMATA Table") table provides information about databases.

The [`SCHEMATA`](information-schema-schemata-table.html "24.3.22 The INFORMATION_SCHEMA SCHEMATA Table") table has these columns:

* `CATALOG_NAME`

  The name of the catalog to which the schema belongs. This value is always `def`.

* `SCHEMA_NAME`

  The name of the schema.

* `DEFAULT_CHARACTER_SET_NAME`

  The schema default character set.

* `DEFAULT_COLLATION_NAME`

  The schema default collation.

* `SQL_PATH`

  This value is always `NULL`.

Schema names are also available from the [`SHOW DATABASES`](show-databases.html "13.7.5.14 SHOW DATABASES Statement") statement. See [Section 13.7.5.14, “SHOW DATABASES Statement”](show-databases.html "13.7.5.14 SHOW DATABASES Statement"). The following statements are equivalent:

```sql
SELECT SCHEMA_NAME AS `Database`
  FROM INFORMATION_SCHEMA.SCHEMATA
  [WHERE SCHEMA_NAME LIKE 'wild']

SHOW DATABASES
  [LIKE 'wild']
```

You see only those databases for which you have some kind of privilege, unless you have the global [`SHOW DATABASES`](show-databases.html "13.7.5.14 SHOW DATABASES Statement") privilege.

Caution

Because a global privilege is considered a privilege for all databases, *any* global privilege enables a user to see all database names with [`SHOW DATABASES`](show-databases.html "13.7.5.14 SHOW DATABASES Statement") or by examining the `INFORMATION_SCHEMA` [`SCHEMATA`](information-schema-schemata-table.html "24.3.22 The INFORMATION_SCHEMA SCHEMATA Table") table.
