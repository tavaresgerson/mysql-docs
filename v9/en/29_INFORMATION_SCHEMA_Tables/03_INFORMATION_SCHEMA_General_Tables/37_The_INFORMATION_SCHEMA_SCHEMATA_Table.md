### 28.3.37 The INFORMATION\_SCHEMA SCHEMATA Table

A schema is a database, so the
[`SCHEMATA`](information-schema-schemata-table.html "28.3.37 The INFORMATION_SCHEMA SCHEMATA Table") table provides information
about databases.

The [`SCHEMATA`](information-schema-schemata-table.html "28.3.37 The INFORMATION_SCHEMA SCHEMATA Table") table has these columns:

* `CATALOG_NAME`

  The name of the catalog to which the schema belongs. This
  value is always `def`.

* `SCHEMA_NAME`

  The name of the schema.

* `DEFAULT_CHARACTER_SET_NAME`

  The schema default character set.

* `DEFAULT_COLLATION_NAME`

  The schema default collation.

* `SQL_PATH`

  This value is always `NULL`.

* `DEFAULT_ENCRYPTION`

  The schema default encryption.

Schema names are also available from the [`SHOW
DATABASES`](show-databases.html "15.7.7.16 SHOW DATABASES Statement") statement. See
[Section 15.7.7.16, “SHOW DATABASES Statement”](show-databases.html "15.7.7.16 SHOW DATABASES Statement"). The following statements are
equivalent:

```
SELECT SCHEMA_NAME AS `Database`
  FROM INFORMATION_SCHEMA.SCHEMATA
  [WHERE SCHEMA_NAME LIKE 'wild']

SHOW DATABASES
  [LIKE 'wild']
```

You see only those databases for which you have some kind of
privilege, unless you have the global [`SHOW
DATABASES`](show-databases.html "15.7.7.16 SHOW DATABASES Statement") privilege.

Caution

Because any static global privilege is considered a privilege
for all databases, any static global privilege enables a user to
see all database names with [`SHOW
DATABASES`](show-databases.html "15.7.7.16 SHOW DATABASES Statement") or by examining the
[`SCHEMATA`](information-schema-schemata-table.html "28.3.37 The INFORMATION_SCHEMA SCHEMATA Table") table of
`INFORMATION_SCHEMA`, except databases that
have been restricted at the database level by partial revokes.

#### Notes

* The [`SCHEMATA_EXTENSIONS`](information-schema-schemata-extensions-table.html "28.3.38 The INFORMATION_SCHEMA SCHEMATA_EXTENSIONS Table") table
  augments the [`SCHEMATA`](information-schema-schemata-table.html "28.3.37 The INFORMATION_SCHEMA SCHEMATA Table") table with
  information about schema options.