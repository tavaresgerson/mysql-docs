## 28.3 INFORMATION\_SCHEMA General Tables

The following sections describe what may be denoted as the “general” set of `INFORMATION_SCHEMA` tables. These are the tables not associated with particular storage engines, components, or plugins.


### 28.3.1 INFORMATION\_SCHEMA General Table Reference

The following table summarizes `INFORMATION_SCHEMA` general tables. For greater detail, see the individual table descriptions.

**Table 28.2 INFORMATION\_SCHEMA General Tables**

<table frame="box" rules="all" summary="A reference that lists INFORMATION_SCHEMA general tables."><col style="width: 28%"/><col style="width: 71%"/><thead><tr><th>Table Name</th> <th>Description</th> </tr></thead><tbody><tr><td><a class="link" href="information-schema-administrable-role-authorizations-table.html" title="28.3.2 The INFORMATION_SCHEMA ADMINISTRABLE_ROLE_AUTHORIZATIONS Table"><code class="literal">ADMINISTRABLE_ROLE_AUTHORIZATIONS</code></a></td> <td>Grantable users or roles for current user or role</td> </tr><tr><td><a class="link" href="information-schema-applicable-roles-table.html" title="28.3.3 The INFORMATION_SCHEMA APPLICABLE_ROLES Table"><code class="literal">APPLICABLE_ROLES</code></a></td> <td>Applicable roles for current user</td> </tr><tr><td><a class="link" href="information-schema-character-sets-table.html" title="28.3.4 The INFORMATION_SCHEMA CHARACTER_SETS Table"><code class="literal">CHARACTER_SETS</code></a></td> <td>Available character sets</td> </tr><tr><td><a class="link" href="information-schema-check-constraints-table.html" title="28.3.5 The INFORMATION_SCHEMA CHECK_CONSTRAINTS Table"><code class="literal">CHECK_CONSTRAINTS</code></a></td> <td>Table and column CHECK constraints</td> </tr><tr><td><a class="link" href="information-schema-collation-character-set-applicability-table.html" title="28.3.7 The INFORMATION_SCHEMA COLLATION_CHARACTER_SET_APPLICABILITY Table"><code class="literal">COLLATION_CHARACTER_SET_APPLICABILITY</code></a></td> <td>Character set applicable to each collation</td> </tr><tr><td><a class="link" href="information-schema-collations-table.html" title="28.3.6 The INFORMATION_SCHEMA COLLATIONS Table"><code class="literal">COLLATIONS</code></a></td> <td>Collations for each character set</td> </tr><tr><td><a class="link" href="information-schema-column-privileges-table.html" title="28.3.10 The INFORMATION_SCHEMA COLUMN_PRIVILEGES Table"><code class="literal">COLUMN_PRIVILEGES</code></a></td> <td>Privileges defined on columns</td> </tr><tr><td><a class="link" href="information-schema-column-statistics-table.html" title="28.3.11 The INFORMATION_SCHEMA COLUMN_STATISTICS Table"><code class="literal">COLUMN_STATISTICS</code></a></td> <td>Histogram statistics for column values</td> </tr><tr><td><a class="link" href="information-schema-columns-table.html" title="28.3.8 The INFORMATION_SCHEMA COLUMNS Table"><code class="literal">COLUMNS</code></a></td> <td>Columns in each table</td> </tr><tr><td><a class="link" href="information-schema-columns-extensions-table.html" title="28.3.9 The INFORMATION_SCHEMA COLUMNS_EXTENSIONS Table"><code class="literal">COLUMNS_EXTENSIONS</code></a></td> <td>Column attributes for primary and secondary storage engines</td> </tr><tr><td><a class="link" href="information-schema-enabled-roles-table.html" title="28.3.12 The INFORMATION_SCHEMA ENABLED_ROLES Table"><code class="literal">ENABLED_ROLES</code></a></td> <td>Roles enabled within current session</td> </tr><tr><td><a class="link" href="information-schema-engines-table.html" title="28.3.13 The INFORMATION_SCHEMA ENGINES Table"><code class="literal">ENGINES</code></a></td> <td>Storage engine properties</td> </tr><tr><td><a class="link" href="information-schema-events-table.html" title="28.3.14 The INFORMATION_SCHEMA EVENTS Table"><code class="literal">EVENTS</code></a></td> <td>Event Manager events</td> </tr><tr><td><a class="link" href="information-schema-files-table.html" title="28.3.15 The INFORMATION_SCHEMA FILES Table"><code class="literal">FILES</code></a></td> <td>Files that store tablespace data</td> </tr><tr><td><a class="link" href="information-schema-key-column-usage-table.html" title="28.3.16 The INFORMATION_SCHEMA KEY_COLUMN_USAGE Table"><code class="literal">KEY_COLUMN_USAGE</code></a></td> <td>Which key columns have constraints</td> </tr><tr><td><a class="link" href="information-schema-keywords-table.html" title="28.3.17 The INFORMATION_SCHEMA KEYWORDS Table"><code class="literal">KEYWORDS</code></a></td> <td>MySQL keywords</td> </tr><tr><td><a class="link" href="information-schema-libraries-table.html" title="28.3.22 The INFORMATION_SCHEMA LIBRARIES Table"><code class="literal">LIBRARIES</code></a></td> <td>Information about JavaScript libraries</td> </tr><tr><td><a class="link" href="information-schema-ndb-transid-mysql-connection-map-table.html" title="28.3.23 The INFORMATION_SCHEMA ndb_transid_mysql_connection_map Table"><code class="literal">ndb_transid_mysql_connection_map</code></a></td> <td>NDB transaction information</td> </tr><tr><td><a class="link" href="information-schema-optimizer-trace-table.html" title="28.3.24 The INFORMATION_SCHEMA OPTIMIZER_TRACE Table"><code class="literal">OPTIMIZER_TRACE</code></a></td> <td>Information produced by optimizer trace activity</td> </tr><tr><td><a class="link" href="information-schema-parameters-table.html" title="28.3.25 The INFORMATION_SCHEMA PARAMETERS Table"><code class="literal">PARAMETERS</code></a></td> <td>Stored routine parameters and stored function return values</td> </tr><tr><td><a class="link" href="information-schema-partitions-table.html" title="28.3.26 The INFORMATION_SCHEMA PARTITIONS Table"><code class="literal">PARTITIONS</code></a></td> <td>Table partition information</td> </tr><tr><td><a class="link" href="information-schema-plugins-table.html" title="28.3.27 The INFORMATION_SCHEMA PLUGINS Table"><code class="literal">PLUGINS</code></a></td> <td>Plugin information</td> </tr><tr><td><a class="link" href="information-schema-processlist-table.html" title="28.3.28 The INFORMATION_SCHEMA PROCESSLIST Table"><code class="literal">PROCESSLIST</code></a></td> <td>Information about currently executing threads</td> </tr><tr><td><a class="link" href="information-schema-profiling-table.html" title="28.3.29 The INFORMATION_SCHEMA PROFILING Table"><code class="literal">PROFILING</code></a></td> <td>Statement profiling information</td> </tr><tr><td><a class="link" href="information-schema-referential-constraints-table.html" title="28.3.30 The INFORMATION_SCHEMA REFERENTIAL_CONSTRAINTS Table"><code class="literal">REFERENTIAL_CONSTRAINTS</code></a></td> <td>Foreign key information</td> </tr><tr><td><a class="link" href="information-schema-resource-groups-table.html" title="28.3.31 The INFORMATION_SCHEMA RESOURCE_GROUPS Table"><code class="literal">RESOURCE_GROUPS</code></a></td> <td>Resource group information</td> </tr><tr><td><a class="link" href="information-schema-role-column-grants-table.html" title="28.3.32 The INFORMATION_SCHEMA ROLE_COLUMN_GRANTS Table"><code class="literal">ROLE_COLUMN_GRANTS</code></a></td> <td>Column privileges for roles available to or granted by currently enabled roles</td> </tr><tr><td><a class="link" href="information-schema-role-routine-grants-table.html" title="28.3.33 The INFORMATION_SCHEMA ROLE_ROUTINE_GRANTS Table"><code class="literal">ROLE_ROUTINE_GRANTS</code></a></td> <td>Routine privileges for roles available to or granted by currently enabled roles</td> </tr><tr><td><a class="link" href="information-schema-role-table-grants-table.html" title="28.3.34 The INFORMATION_SCHEMA ROLE_TABLE_GRANTS Table"><code class="literal">ROLE_TABLE_GRANTS</code></a></td> <td>Table privileges for roles available to or granted by currently enabled roles</td> </tr><tr><td><a class="link" href="information-schema-routine-libraries-table.html" title="28.3.35 The INFORMATION_SCHEMA ROUTINE_LIBRARIES Table"><code class="literal">ROUTINE_LIBRARIES</code></a></td> <td>Information about libraries used in JavaScript stored routines</td> </tr><tr><td><a class="link" href="information-schema-routines-table.html" title="28.3.36 The INFORMATION_SCHEMA ROUTINES Table"><code class="literal">ROUTINES</code></a></td> <td>Stored routine information</td> </tr><tr><td><a class="link" href="information-schema-schema-privileges-table.html" title="28.3.39 The INFORMATION_SCHEMA SCHEMA_PRIVILEGES Table"><code class="literal">SCHEMA_PRIVILEGES</code></a></td> <td>Privileges defined on schemas</td> </tr><tr><td><a class="link" href="information-schema-schemata-table.html" title="28.3.37 The INFORMATION_SCHEMA SCHEMATA Table"><code class="literal">SCHEMATA</code></a></td> <td>Schema information</td> </tr><tr><td><a class="link" href="information-schema-schemata-extensions-table.html" title="28.3.38 The INFORMATION_SCHEMA SCHEMATA_EXTENSIONS Table"><code class="literal">SCHEMATA_EXTENSIONS</code></a></td> <td>Schema options</td> </tr><tr><td><a class="link" href="information-schema-st-geometry-columns-table.html" title="28.3.41 The INFORMATION_SCHEMA ST_GEOMETRY_COLUMNS Table"><code class="literal">ST_GEOMETRY_COLUMNS</code></a></td> <td>Columns in each table that store spatial data</td> </tr><tr><td><a class="link" href="information-schema-st-spatial-reference-systems-table.html" title="28.3.42 The INFORMATION_SCHEMA ST_SPATIAL_REFERENCE_SYSTEMS Table"><code class="literal">ST_SPATIAL_REFERENCE_SYSTEMS</code></a></td> <td>Available spatial reference systems</td> </tr><tr><td><a class="link" href="information-schema-st-units-of-measure-table.html" title="28.3.43 The INFORMATION_SCHEMA ST_UNITS_OF_MEASURE Table"><code class="literal">ST_UNITS_OF_MEASURE</code></a></td> <td>Acceptable units for ST_Distance()</td> </tr><tr><td><a class="link" href="information-schema-statistics-table.html" title="28.3.40 The INFORMATION_SCHEMA STATISTICS Table"><code class="literal">STATISTICS</code></a></td> <td>Table index statistics</td> </tr><tr><td><a class="link" href="information-schema-table-constraints-table.html" title="28.3.47 The INFORMATION_SCHEMA TABLE_CONSTRAINTS Table"><code class="literal">TABLE_CONSTRAINTS</code></a></td> <td>Which tables have constraints</td> </tr><tr><td><a class="link" href="information-schema-table-constraints-extensions-table.html" title="28.3.48 The INFORMATION_SCHEMA TABLE_CONSTRAINTS_EXTENSIONS Table"><code class="literal">TABLE_CONSTRAINTS_EXTENSIONS</code></a></td> <td>Table constraint attributes for primary and secondary storage engines</td> </tr><tr><td><a class="link" href="information-schema-table-privileges-table.html" title="28.3.49 The INFORMATION_SCHEMA TABLE_PRIVILEGES Table"><code class="literal">TABLE_PRIVILEGES</code></a></td> <td>Privileges defined on tables</td> </tr><tr><td><a class="link" href="information-schema-tables-table.html" title="28.3.44 The INFORMATION_SCHEMA TABLES Table"><code class="literal">TABLES</code></a></td> <td>Table information</td> </tr><tr><td><a class="link" href="information-schema-tables-extensions-table.html" title="28.3.45 The INFORMATION_SCHEMA TABLES_EXTENSIONS Table"><code class="literal">TABLES_EXTENSIONS</code></a></td> <td>Table attributes for primary and secondary storage engines</td> </tr><tr><td><a class="link" href="information-schema-tablespaces-extensions-table.html" title="28.3.46 The INFORMATION_SCHEMA TABLESPACES_EXTENSIONS Table"><code class="literal">TABLESPACES_EXTENSIONS</code></a></td> <td>Tablespace attributes for primary storage engines</td> </tr><tr><td><a class="link" href="information-schema-triggers-table.html" title="28.3.50 The INFORMATION_SCHEMA TRIGGERS Table"><code class="literal">TRIGGERS</code></a></td> <td>Trigger information</td> </tr><tr><td><a class="link" href="information-schema-user-attributes-table.html" title="28.3.51 The INFORMATION_SCHEMA USER_ATTRIBUTES Table"><code class="literal">USER_ATTRIBUTES</code></a></td> <td>User comments and attributes</td> </tr><tr><td><a class="link" href="information-schema-user-privileges-table.html" title="28.3.52 The INFORMATION_SCHEMA USER_PRIVILEGES Table"><code class="literal">USER_PRIVILEGES</code></a></td> <td>Privileges defined globally per user</td> </tr><tr><td><a class="link" href="information-schema-view-routine-usage-table.html" title="28.3.54 The INFORMATION_SCHEMA VIEW_ROUTINE_USAGE Table"><code class="literal">VIEW_ROUTINE_USAGE</code></a></td> <td>Stored functions used in views</td> </tr><tr><td><a class="link" href="information-schema-view-table-usage-table.html" title="28.3.55 The INFORMATION_SCHEMA VIEW_TABLE_USAGE Table"><code class="literal">VIEW_TABLE_USAGE</code></a></td> <td>Tables and views used in views</td> </tr><tr><td><a class="link" href="information-schema-views-table.html" title="28.3.53 The INFORMATION_SCHEMA VIEWS Table"><code class="literal">VIEWS</code></a></td> <td>View information</td> </tr></tbody></table>


### 28.3.2 The INFORMATION\_SCHEMA ADMINISTRABLE\_ROLE\_AUTHORIZATIONS Table

The `ADMINISTRABLE_ROLE_AUTHORIZATIONS` table provides information about which roles applicable for the current user or role can be granted to other users or roles.

The `ADMINISTRABLE_ROLE_AUTHORIZATIONS` table has these columns:

* `USER`

  The user name part of the current user account.

* `HOST`

  The host name part of the current user account.

* `GRANTEE`

  The user name part of the account to which the role is granted.

* `GRANTEE_HOST`

  The host name part of the account to which the role is granted.

* `ROLE_NAME`

  The user name part of the granted role.

* `ROLE_HOST`

  The host name part of the granted role.

* `IS_GRANTABLE`

  `YES` or `NO`, depending on whether the role is grantable to other accounts.

* `IS_DEFAULT`

  `YES` or `NO`, depending on whether the role is a default role.

* `IS_MANDATORY`

  `YES` or `NO`, depending on whether the role is mandatory.


### 28.3.3 The INFORMATION\_SCHEMA APPLICABLE\_ROLES Table

The `APPLICABLE_ROLES` table provides information about the roles that are applicable for the current user.

The `APPLICABLE_ROLES` table has these columns:

* `USER`

  The user name part of the current user account.

* `HOST`

  The host name part of the current user account.

* `GRANTEE`

  The user name part of the account to which the role is granted.

* `GRANTEE_HOST`

  The host name part of the account to which the role is granted.

* `ROLE_NAME`

  The user name part of the granted role.

* `ROLE_HOST`

  The host name part of the granted role.

* `IS_GRANTABLE`

  `YES` or `NO`, depending on whether the role is grantable to other accounts.

* `IS_DEFAULT`

  `YES` or `NO`, depending on whether the role is a default role.

* `IS_MANDATORY`

  `YES` or `NO`, depending on whether the role is mandatory.


### 28.3.4 The INFORMATION\_SCHEMA CHARACTER\_SETS Table

The `CHARACTER_SETS` table provides information about available character sets.

The `CHARACTER_SETS` table has these columns:

* `CHARACTER_SET_NAME`

  The character set name.

* `DEFAULT_COLLATE_NAME`

  The default collation for the character set.

* `DESCRIPTION`

  A description of the character set.

* `MAXLEN`

  The maximum number of bytes required to store one character.

#### Notes

Character set information is also available from the `SHOW CHARACTER SET` statement. See Section 15.7.7.4, “SHOW CHARACTER SET Statement”. The following statements are equivalent:

```
SELECT * FROM INFORMATION_SCHEMA.CHARACTER_SETS
  [WHERE CHARACTER_SET_NAME LIKE 'wild']

SHOW CHARACTER SET
  [LIKE 'wild']
```


### 28.3.5 The INFORMATION\_SCHEMA CHECK\_CONSTRAINTS Table

`CREATE TABLE` supports the core features of table and column `CHECK` constraints; the `CHECK_CONSTRAINTS` table provides information about these constraints.

The `CHECK_CONSTRAINTS` table has these columns:

* `CONSTRAINT_CATALOG`

  The name of the catalog to which the constraint belongs. This value is always `def`.

* `CONSTRAINT_SCHEMA`

  The name of the schema (database) to which the constraint belongs.

* `CONSTRAINT_NAME`

  The name of the constraint.

* `CHECK_CLAUSE`

  The expression that specifies the constraint condition.


### 28.3.6 The INFORMATION\_SCHEMA COLLATIONS Table

The `COLLATIONS` table provides information about collations for each character set.

The `COLLATIONS` table has these columns:

* `COLLATION_NAME`

  The collation name.

* `CHARACTER_SET_NAME`

  The name of the character set with which the collation is associated.

* `ID`

  The collation ID.

* `IS_DEFAULT`

  Whether the collation is the default for its character set.

* `IS_COMPILED`

  Whether the character set is compiled into the server.

* `SORTLEN`

  This is related to the amount of memory required to sort strings expressed in the character set.

* `PAD_ATTRIBUTE`

  The collation pad attribute, either `NO PAD` or `PAD SPACE`. This attribute affects whether trailing spaces are significant in string comparisons; see Trailing Space Handling in Comparisons.

#### Notes

Collation information is also available from the `SHOW COLLATION` statement. See Section 15.7.7.5, “SHOW COLLATION Statement”. The following statements are equivalent:

```
SELECT COLLATION_NAME FROM INFORMATION_SCHEMA.COLLATIONS
  [WHERE COLLATION_NAME LIKE 'wild']

SHOW COLLATION
  [LIKE 'wild']
```


### 28.3.7 The INFORMATION\_SCHEMA COLLATION\_CHARACTER\_SET\_APPLICABILITY Table

The `COLLATION_CHARACTER_SET_APPLICABILITY` table indicates what character set is applicable for what collation.

The `COLLATION_CHARACTER_SET_APPLICABILITY` table has these columns:

* `COLLATION_NAME`

  The collation name.

* `CHARACTER_SET_NAME`

  The name of the character set with which the collation is associated.

#### Notes

The `COLLATION_CHARACTER_SET_APPLICABILITY` columns are equivalent to the first two columns displayed by the `SHOW COLLATION` statement.


### 28.3.8 The INFORMATION\_SCHEMA COLUMNS Table

The `COLUMNS` table provides information about columns in tables. The related `ST_GEOMETRY_COLUMNS` table provides information about table columns that store spatial data. See Section 28.3.41, “The INFORMATION\_SCHEMA ST\_GEOMETRY\_COLUMNS Table”.

The `COLUMNS` table has these columns:

* `TABLE_CATALOG`

  The name of the catalog to which the table containing the column belongs. This value is always `def`.

* `TABLE_SCHEMA`

  The name of the schema (database) to which the table containing the column belongs.

* `TABLE_NAME`

  The name of the table containing the column.

* `COLUMN_NAME`

  The name of the column.

* `ORDINAL_POSITION`

  The position of the column within the table. `ORDINAL_POSITION` is necessary because you might want to say `ORDER BY ORDINAL_POSITION`. Unlike [`SHOW COLUMNS`](show-columns.html "15.7.7.6 SHOW COLUMNS Statement"), `SELECT` from the `COLUMNS` table does not have automatic ordering.

* `COLUMN_DEFAULT`

  The default value for the column. This is `NULL` if the column has an explicit default of `NULL`, or if the column definition includes no `DEFAULT` clause.

* `IS_NULLABLE`

  The column nullability. The value is `YES` if `NULL` values can be stored in the column, `NO` if not.

* `DATA_TYPE`

  The column data type.

  The `DATA_TYPE` value is the type name only with no other information. The `COLUMN_TYPE` value contains the type name and possibly other information such as the precision or length.

* `CHARACTER_MAXIMUM_LENGTH`

  For string columns, the maximum length in characters.

* `CHARACTER_OCTET_LENGTH`

  For string columns, the maximum length in bytes.

* `NUMERIC_PRECISION`

  For numeric columns, the numeric precision.

* `NUMERIC_SCALE`

  For numeric columns, the numeric scale.

* `DATETIME_PRECISION`

  For temporal columns, the fractional seconds precision.

* `CHARACTER_SET_NAME`

  For character string columns, the character set name.

* `COLLATION_NAME`

  For character string columns, the collation name.

* `COLUMN_TYPE`

  The column data type.

  The `DATA_TYPE` value is the type name only with no other information. The `COLUMN_TYPE` value contains the type name and possibly other information such as the precision or length.

* `COLUMN_KEY`

  Whether the column is indexed:

  + If `COLUMN_KEY` is empty, the column either is not indexed or is indexed only as a secondary column in a multiple-column, nonunique index.

  + If `COLUMN_KEY` is `PRI`, the column is a `PRIMARY KEY` or is one of the columns in a multiple-column `PRIMARY KEY`.

  + If `COLUMN_KEY` is `UNI`, the column is the first column of a `UNIQUE` index. (A `UNIQUE` index permits multiple `NULL` values, but you can tell whether the column permits `NULL` by checking the `Null` column.)

  + If `COLUMN_KEY` is `MUL`, the column is the first column of a nonunique index in which multiple occurrences of a given value are permitted within the column.

  If more than one of the `COLUMN_KEY` values applies to a given column of a table, `COLUMN_KEY` displays the one with the highest priority, in the order `PRI`, `UNI`, `MUL`.

  A `UNIQUE` index may be displayed as `PRI` if it cannot contain `NULL` values and there is no `PRIMARY KEY` in the table. A `UNIQUE` index may display as `MUL` if several columns form a composite `UNIQUE` index; although the combination of the columns is unique, each column can still hold multiple occurrences of a given value.

* `EXTRA`

  Any additional information that is available about a given column. The value is nonempty in these cases:

  + `auto_increment` for columns that have the `AUTO_INCREMENT` attribute.

  + `on update CURRENT_TIMESTAMP` for `TIMESTAMP` or `DATETIME` columns that have the `ON UPDATE CURRENT_TIMESTAMP` attribute.

  + `STORED GENERATED` or `VIRTUAL GENERATED` for generated columns.

  + `DEFAULT_GENERATED` for columns that have an expression default value.

* `PRIVILEGES`

  The privileges you have for the column.

* `COLUMN_COMMENT`

  Any comment included in the column definition.

* `GENERATION_EXPRESSION`

  For generated columns, displays the expression used to compute column values. Empty for nongenerated columns. For information about generated columns, see Section 15.1.24.8, “CREATE TABLE and Generated Columns”.

* `SRS_ID`

  This value applies to spatial columns. It contains the column `SRID` value that indicates the spatial reference system for values stored in the column. See Section 13.4.1, “Spatial Data Types”, and Section 13.4.5, “Spatial Reference System Support”. The value is `NULL` for nonspatial columns and spatial columns with no `SRID` attribute.

#### Notes

* In `SHOW COLUMNS`, the `Type` display includes values from several different `COLUMNS` columns.

* `CHARACTER_OCTET_LENGTH` should be the same as `CHARACTER_MAXIMUM_LENGTH`, except for multibyte character sets.

* `CHARACTER_SET_NAME` can be derived from `COLLATION_NAME`. For example, if you say `SHOW FULL COLUMNS FROM t`, and you see in the `COLLATION_NAME` column a value of `utf8mb4_swedish_ci`, the character set is what appears before the first underscore: `utf8mb4`.

Column information is also available from the `SHOW COLUMNS` statement. See Section 15.7.7.6, “SHOW COLUMNS Statement”. The following statements are nearly equivalent:

```
SELECT COLUMN_NAME, DATA_TYPE, IS_NULLABLE, COLUMN_DEFAULT
  FROM INFORMATION_SCHEMA.COLUMNS
  WHERE table_name = 'tbl_name'
  [AND table_schema = 'db_name']
  [AND column_name LIKE 'wild']

SHOW COLUMNS
  FROM tbl_name
  [FROM db_name]
  [LIKE 'wild']
```

Information about generated invisible primary key columns is visible in this table by default. You can cause such information to be hidden by setting [`show_gipk_in_create_table_and_information_schema = OFF`](server-system-variables.html#sysvar_show_gipk_in_create_table_and_information_schema). For more information, see Section 15.1.24.11, “Generated Invisible Primary Keys”.


### 28.3.9 The INFORMATION\_SCHEMA COLUMNS\_EXTENSIONS Table

The `COLUMNS_EXTENSIONS` table provides information about column attributes defined for primary and secondary storage engines.

Note

The `COLUMNS_EXTENSIONS` table is reserved for future use.

The `COLUMNS_EXTENSIONS` table has these columns:

* `TABLE_CATALOG`

  The name of the catalog to which the table belongs. This value is always `def`.

* `TABLE_SCHEMA`

  The name of the schema (database) to which the table belongs.

* `TABLE_NAME`

  The name of the table.

* `COLUMN_NAME`

  The name of the column.

* `ENGINE_ATTRIBUTE`

  Column attributes defined for the primary storage engine. Reserved for future use.

* `SECONDARY_ENGINE_ATTRIBUTE`

  Column attributes defined for the secondary storage engine. Reserved for future use.


### 28.3.10 The INFORMATION\_SCHEMA COLUMN\_PRIVILEGES Table

The `COLUMN_PRIVILEGES` table provides information about column privileges. It takes its values from the `mysql.columns_priv` system table.

The `COLUMN_PRIVILEGES` table has these columns:

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

  The privilege granted. The value can be any privilege that can be granted at the column level; see Section 15.7.1.6, “GRANT Statement”. Each row lists a single privilege, so there is one row per column privilege held by the grantee.

  In the output from [`SHOW FULL COLUMNS`](show-columns.html "15.7.7.6 SHOW COLUMNS Statement"), the privileges are all in one column and in lowercase, for example, `select,insert,update,references`. In `COLUMN_PRIVILEGES`, there is one privilege per row, in uppercase.

* `IS_GRANTABLE`

  `YES` if the user has the `GRANT OPTION` privilege, `NO` otherwise. The output does not list `GRANT OPTION` as a separate row with `PRIVILEGE_TYPE='GRANT OPTION'`.

#### Notes

* `COLUMN_PRIVILEGES` is a nonstandard `INFORMATION_SCHEMA` table.

The following statements are *not* equivalent:

```
SELECT ... FROM INFORMATION_SCHEMA.COLUMN_PRIVILEGES

SHOW GRANTS ...
```


### 28.3.11 The INFORMATION\_SCHEMA COLUMN\_STATISTICS Table

The `COLUMN_STATISTICS` table provides access to histogram statistics for column values.

For information about histogram statistics, see Section 10.9.6, “Optimizer Statistics”, and Section 15.7.3.1, “ANALYZE TABLE Statement”.

You can see information only for columns for which you have some privilege.

The `COLUMN_STATISTICS` table has these columns:

* `SCHEMA_NAME`

  The names of the schema for which the statistics apply.

* `TABLE_NAME`

  The names of the column for which the statistics apply.

* `COLUMN_NAME`

  The names of the column for which the statistics apply.

* `HISTOGRAM`

  A `JSON` object describing the column statistics, stored as a histogram.


### 28.3.12 The INFORMATION\_SCHEMA ENABLED\_ROLES Table

The `ENABLED_ROLES` table provides information about the roles that are enabled within the current session.

The `ENABLED_ROLES` table has these columns:

* `ROLE_NAME`

  The user name part of the granted role.

* `ROLE_HOST`

  The host name part of the granted role.

* `IS_DEFAULT`

  `YES` or `NO`, depending on whether the role is a default role.

* `IS_MANDATORY`

  `YES` or `NO`, depending on whether the role is mandatory.


### 28.3.13 The INFORMATION\_SCHEMA ENGINES Table

The `ENGINES` table provides information about storage engines. This is particularly useful for checking whether a storage engine is supported, or to see what the default engine is.

The `ENGINES` table has these columns:

* `ENGINE`

  The name of the storage engine.

* `SUPPORT`

  The server's level of support for the storage engine, as shown in the following table.

  <table summary="Values for the SUPPORT column in the INFORMATION_SCHEMA.ENGINES table."><col style="width: 15%"/><col style="width: 85%"/><thead><tr> <th>Value</th> <th>Meaning</th> </tr></thead><tbody><tr> <td><code class="literal">YES</code></td> <td>The engine is supported and is active</td> </tr><tr> <td><code class="literal">DEFAULT</code></td> <td>Like <code class="literal">YES</code>, plus this is the default engine</td> </tr><tr> <td><code class="literal">NO</code></td> <td>The engine is not supported</td> </tr><tr> <td><code class="literal">DISABLED</code></td> <td>The engine is supported but has been disabled</td> </tr></tbody></table>

  A value of `NO` means that the server was compiled without support for the engine, so it cannot be enabled at runtime.

  A value of `DISABLED` occurs either because the server was started with an option that disables the engine, or because not all options required to enable it were given. In the latter case, the error log should contain a reason indicating why the option is disabled. See Section 7.4.2, “The Error Log”.

  You might also see `DISABLED` for a storage engine if the server was compiled to support it, but was started with a `--skip-engine_name` option. For the `NDB` storage engine, `DISABLED` means the server was compiled with support for NDB Cluster, but was not started with the `--ndbcluster` option.

  All MySQL servers support `MyISAM` tables. It is not possible to disable `MyISAM`.

* `COMMENT`

  A brief description of the storage engine.

* `TRANSACTIONS`

  Whether the storage engine supports transactions.

* `XA`

  Whether the storage engine supports XA transactions.

* `SAVEPOINTS`

  Whether the storage engine supports savepoints.

#### Notes

* `ENGINES` is a nonstandard `INFORMATION_SCHEMA` table.

Storage engine information is also available from the `SHOW ENGINES` statement. See Section 15.7.7.18, “SHOW ENGINES Statement”. The following statements are equivalent:

```
SELECT * FROM INFORMATION_SCHEMA.ENGINES

SHOW ENGINES
```


### 28.3.14 The INFORMATION\_SCHEMA EVENTS Table

The `EVENTS` table provides information about Event Manager events, which are discussed in Section 27.5, “Using the Event Scheduler”.

The `EVENTS` table has these columns:

* `EVENT_CATALOG`

  The name of the catalog to which the event belongs. This value is always `def`.

* `EVENT_SCHEMA`

  The name of the schema (database) to which the event belongs.

* `EVENT_NAME`

  The name of the event.

* `DEFINER`

  The account named in the `DEFINER` clause (often the user who created the event), in `'user_name'@'host_name'` format.

* `TIME_ZONE`

  The event time zone, which is the time zone used for scheduling the event and that is in effect within the event as it executes. The default value is `SYSTEM`.

* `EVENT_BODY`

  The language used for the statements in the event's `DO` clause. The value is always `SQL`.

* `EVENT_DEFINITION`

  The text of the SQL statement making up the event's `DO` clause; in other words, the statement executed by this event.

* `EVENT_TYPE`

  The event repetition type, either `ONE TIME` (transient) or `RECURRING` (repeating).

* `EXECUTE_AT`

  For a one-time event, this is the `DATETIME` value specified in the `AT` clause of the `CREATE EVENT` statement used to create the event, or of the last [`ALTER EVENT`](alter-event.html "15.1.3 ALTER EVENT Statement") statement that modified the event. The value shown in this column reflects the addition or subtraction of any `INTERVAL` value included in the event's `AT` clause. For example, if an event is created using `ON SCHEDULE AT CURRENT_TIMESTAMP + '1:6' DAY_HOUR`, and the event was created at 2018-02-09 14:05:30, the value shown in this column would be `'2018-02-10 20:05:30'`. If the event's timing is determined by an `EVERY` clause instead of an `AT` clause (that is, if the event is recurring), the value of this column is `NULL`.

* `INTERVAL_VALUE`

  For a recurring event, the number of intervals to wait between event executions. For a transient event, the value is always `NULL`.

* `INTERVAL_FIELD`

  The time units used for the interval which a recurring event waits before repeating. For a transient event, the value is always `NULL`.

* `SQL_MODE`

  The SQL mode in effect when the event was created or altered, and under which the event executes. For the permitted values, see Section 7.1.11, “Server SQL Modes”.

* `STARTS`

  The start date and time for a recurring event. This is displayed as a `DATETIME` value, and is `NULL` if no start date and time are defined for the event. For a transient event, this column is always `NULL`. For a recurring event whose definition includes a `STARTS` clause, this column contains the corresponding `DATETIME` value. As with the `EXECUTE_AT` column, this value resolves any expressions used. If there is no `STARTS` clause affecting the timing of the event, this column is `NULL`

* `ENDS`

  For a recurring event whose definition includes a `ENDS` clause, this column contains the corresponding `DATETIME` value. As with the `EXECUTE_AT` column, this value resolves any expressions used. If there is no `ENDS` clause affecting the timing of the event, this column is `NULL`.

* `STATUS`

  The event status. One of `ENABLED`, `DISABLED`, or `REPLICA_SIDE_DISABLED` (prior to MySQL 8.2.0, this was `SLAVESIDE_DISABLED`, now deprecated). `REPLICA_SIDE_DISABLED` indicates that the creation of the event occurred on another MySQL server acting as a replication source and replicated to the current MySQL server which is acting as a replica, but the event is not presently being executed on the replica. For more information, see Section 19.5.1.16, “Replication of Invoked Features”. information.

* `ON_COMPLETION`

  One of the two values `PRESERVE` or `NOT PRESERVE`.

* `CREATED`

  The date and time when the event was created. This is a `TIMESTAMP` value.

* `LAST_ALTERED`

  The date and time when the event was last modified. This is a `TIMESTAMP` value. If the event has not been modified since its creation, this value is the same as the `CREATED` value.

* `LAST_EXECUTED`

  The date and time when the event last executed. This is a `DATETIME` value. If the event has never executed, this column is `NULL`.

  `LAST_EXECUTED` indicates when the event started. As a result, the `ENDS` column is never less than `LAST_EXECUTED`.

* `EVENT_COMMENT`

  The text of the comment, if the event has one. If not, this value is empty.

* `ORIGINATOR`

  The server ID of the MySQL server on which the event was created; used in replication. This value may be updated by `ALTER EVENT` to the server ID of the server on which that statement occurs, if executed on a replication source. The default value is 0.

* `CHARACTER_SET_CLIENT`

  The session value of the `character_set_client` system variable when the event was created.

* `COLLATION_CONNECTION`

  The session value of the `collation_connection` system variable when the event was created.

* `DATABASE_COLLATION`

  The collation of the database with which the event is associated.

#### Notes

* `EVENTS` is a nonstandard `INFORMATION_SCHEMA` table.

* Times in the `EVENTS` table are displayed using the event time zone, the current session time zone, or UTC, as described in Section 27.5.4, “Event Metadata”.

* For more information about `REPLICA_SIDE_DISABLED` and the `ORIGINATOR` column, see Section 19.5.1.16, “Replication of Invoked Features”.

#### Example

Suppose that the user `'jon'@'ghidora'` creates an event named `e_daily`, and then modifies it a few minutes later using an [`ALTER EVENT`](alter-event.html "15.1.3 ALTER EVENT Statement") statement, as shown here:

```
DELIMITER |

CREATE EVENT e_daily
    ON SCHEDULE
      EVERY 1 DAY
    COMMENT 'Saves total number of sessions then clears the table each day'
    DO
      BEGIN
        INSERT INTO site_activity.totals (time, total)
          SELECT CURRENT_TIMESTAMP, COUNT(*)
            FROM site_activity.sessions;
        DELETE FROM site_activity.sessions;
      END |

DELIMITER ;

ALTER EVENT e_daily
    ENABLE;
```

(Note that comments can span multiple lines.)

This user can then run the following `SELECT` statement, and obtain the output shown:

```
mysql> SELECT * FROM INFORMATION_SCHEMA.EVENTS
       WHERE EVENT_NAME = 'e_daily'
       AND EVENT_SCHEMA = 'myschema'\G
*************************** 1. row ***************************
       EVENT_CATALOG: def
        EVENT_SCHEMA: myschema
          EVENT_NAME: e_daily
             DEFINER: jon@ghidora
           TIME_ZONE: SYSTEM
          EVENT_BODY: SQL
    EVENT_DEFINITION: BEGIN
        INSERT INTO site_activity.totals (time, total)
          SELECT CURRENT_TIMESTAMP, COUNT(*)
            FROM site_activity.sessions;
        DELETE FROM site_activity.sessions;
      END
          EVENT_TYPE: RECURRING
          EXECUTE_AT: NULL
      INTERVAL_VALUE: 1
      INTERVAL_FIELD: DAY
            SQL_MODE: ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,
                      NO_ZERO_IN_DATE,NO_ZERO_DATE,
                      ERROR_FOR_DIVISION_BY_ZERO,
                      NO_ENGINE_SUBSTITUTION
              STARTS: 2018-08-08 11:06:34
                ENDS: NULL
              STATUS: ENABLED
       ON_COMPLETION: NOT PRESERVE
             CREATED: 2018-08-08 11:06:34
        LAST_ALTERED: 2018-08-08 11:06:34
       LAST_EXECUTED: 2018-08-08 16:06:34
       EVENT_COMMENT: Saves total number of sessions then clears the
                      table each day
          ORIGINATOR: 1
CHARACTER_SET_CLIENT: utf8mb4
COLLATION_CONNECTION: utf8mb4_0900_ai_ci
  DATABASE_COLLATION: utf8mb4_0900_ai_ci
```

Event information is also available from the `SHOW EVENTS` statement. See Section 15.7.7.20, “SHOW EVENTS Statement”. The following statements are equivalent:

```
SELECT
    EVENT_SCHEMA, EVENT_NAME, DEFINER, TIME_ZONE, EVENT_TYPE, EXECUTE_AT,
    INTERVAL_VALUE, INTERVAL_FIELD, STARTS, ENDS, STATUS, ORIGINATOR,
    CHARACTER_SET_CLIENT, COLLATION_CONNECTION, DATABASE_COLLATION
  FROM INFORMATION_SCHEMA.EVENTS
  WHERE table_schema = 'db_name'
  [AND column_name LIKE 'wild']

SHOW EVENTS
  [FROM db_name]
  [LIKE 'wild']
```


### 28.3.15 The INFORMATION\_SCHEMA FILES Table

The `FILES` table provides information about the files in which MySQL tablespace data is stored.

The `FILES` table provides information about `InnoDB` data files. In NDB Cluster, this table also provides information about the files in which NDB Cluster Disk Data tables are stored. For additional information specific to `InnoDB`, see InnoDB Notes, later in this section; for additional information specific to NDB Cluster, see NDB Notes.

The `FILES` table has these columns:

* `FILE_ID`

  For `InnoDB`: The tablespace ID, also referred to as the `space_id` or `fil_space_t::id`.

  For `NDB`: A file identifier. `FILE_ID` column values are auto-generated.

* `FILE_NAME`

  For `InnoDB`: The name of the data file. File-per-table and general tablespaces have an `.ibd` file name extension. Undo tablespaces are prefixed by `undo`. The system tablespace is prefixed by `ibdata`. The global temporary tablespace is prefixed by `ibtmp`. The file name includes the file path, which may be relative to the MySQL data directory (the value of the `datadir` system variable).

  For `NDB`: The name of an undo log file created by `CREATE LOGFILE GROUP` or `ALTER LOGFILE GROUP`, or of a data file created by [`CREATE TABLESPACE`](create-tablespace.html "15.1.25 CREATE TABLESPACE Statement") or [`ALTER TABLESPACE`](alter-tablespace.html "15.1.12 ALTER TABLESPACE Statement"). In NDB 9.5, the file name is shown with a relative path; for an undo log file, this path is relative to the directory `DataDir/ndb_NodeId_fs/LG`; for a data file, it is relative to the directory `DataDir/ndb_NodeId_fs/TS`. This means, for example, that the name of a data file created with `ALTER TABLESPACE ts ADD DATAFILE 'data_2.dat' INITIAL SIZE 256M` is shown as `./data_2.dat`.

* `FILE_TYPE`

  For `InnoDB`: The tablespace file type. There are three possible file types for `InnoDB` files. `TABLESPACE` is the file type for any system, general, or file-per-table tablespace file that holds tables, indexes, or other forms of user data. `TEMPORARY` is the file type for temporary tablespaces. `UNDO LOG` is the file type for undo tablespaces, which hold undo records.

  For `NDB`: One of the values `UNDO LOG` or `DATAFILE`.

* `TABLESPACE_NAME`

  The name of the tablespace with which the file is associated.

  For `InnoDB`: General tablespace names are as specified when created. File-per-table tablespace names are shown in the following format: `schema_name/table_name`. The `InnoDB` system tablespace name is `innodb_system`. The global temporary tablespace name is `innodb_temporary`. Default undo tablespace names are `innodb_undo_001` and `innodb_undo_002`. User-created undo tablespace names are as specified when created.

* `TABLE_CATALOG`

  This value is always empty.

* `TABLE_SCHEMA`

  This is always `NULL`.

* `TABLE_NAME`

  This is always `NULL`.

* `LOGFILE_GROUP_NAME`

  For `InnoDB`: This is always `NULL`.

  For `NDB`: The name of the log file group to which the log file or data file belongs.

* `LOGFILE_GROUP_NUMBER`

  For `InnoDB`: This is always `NULL`.

  For `NDB`: For a Disk Data undo log file, the auto-generated ID number of the log file group to which the log file belongs. This is the same as the value shown for the `id` column in the `ndbinfo.dict_obj_info` table and the `log_id` column in the `ndbinfo.logspaces` and `ndbinfo.logspaces` tables for this undo log file.

* `ENGINE`

  For `InnoDB`: This value is always `InnoDB`.

  For `NDB`: This value is always `ndbcluster`.

* `FULLTEXT_KEYS`

  This is always `NULL`.

* `DELETED_ROWS`

  This is always `NULL`.

* `UPDATE_COUNT`

  This is always `NULL`.

* `FREE_EXTENTS`

  For `InnoDB`: The number of fully free extents in the current data file.

  For `NDB`: The number of extents which have not yet been used by the file.

* `TOTAL_EXTENTS`

  For `InnoDB`: The number of full extents used in the current data file. Any partial extent at the end of the file is not counted.

  For `NDB`: The total number of extents allocated to the file.

* `EXTENT_SIZE`

  For `InnoDB`: Extent size is 1048576 (1MB) for files with a 4KB, 8KB, or 16KB page size. Extent size is 2097152 bytes (2MB) for files with a 32KB page size, and 4194304 (4MB) for files with a 64KB page size. `FILES` does not report `InnoDB` page size. Page size is defined by the `innodb_page_size` system variable. Extent size information can also be retrieved from the `INNODB_TABLESPACES` table where `FILES.FILE_ID = INNODB_TABLESPACES.SPACE`.

  For `NDB`: The size of an extent for the file in bytes.

* `INITIAL_SIZE`

  For `InnoDB`: The initial size of the file in bytes.

  For `NDB`: The size of the file in bytes. This is the same value that was used in the `INITIAL_SIZE` clause of the `CREATE LOGFILE GROUP`, `ALTER LOGFILE GROUP`, `CREATE TABLESPACE`, or `ALTER TABLESPACE` statement used to create the file.

* `MAXIMUM_SIZE`

  For `InnoDB`: The maximum number of bytes permitted in the file. The value is `NULL` for all data files except for predefined system tablespace data files. Maximum system tablespace file size is defined by `innodb_data_file_path`. Maximum global temporary tablespace file size is defined by `innodb_temp_data_file_path`. A `NULL` value for a predefined system tablespace data file indicates that a file size limit was not defined explicitly.

  For `NDB`: This value is always the same as the `INITIAL_SIZE` value.

* `AUTOEXTEND_SIZE`

  The auto-extend size of the tablespace. For `NDB`, `AUTOEXTEND_SIZE` is always `NULL`.

* `CREATION_TIME`

  This is always `NULL`.

* `LAST_UPDATE_TIME`

  This is always `NULL`.

* `LAST_ACCESS_TIME`

  This is always `NULL`.

* `RECOVER_TIME`

  This is always `NULL`.

* `TRANSACTION_COUNTER`

  This is always `NULL`.

* `VERSION`

  For `InnoDB`: This is always `NULL`.

  For `NDB`: The version number of the file.

* `ROW_FORMAT`

  For `InnoDB`: This is always `NULL`.

  For `NDB`: One of `FIXED` or `DYNAMIC`.

* `TABLE_ROWS`

  This is always `NULL`.

* `AVG_ROW_LENGTH`

  This is always `NULL`.

* `DATA_LENGTH`

  This is always `NULL`.

* `MAX_DATA_LENGTH`

  This is always `NULL`.

* `INDEX_LENGTH`

  This is always `NULL`.

* `DATA_FREE`

  For `InnoDB`: The total amount of free space (in bytes) for the entire tablespace. Predefined system tablespaces, which include the system tablespace and temporary table tablespaces, may have one or more data files.

  For `NDB`: This is always `NULL`.

* `CREATE_TIME`

  This is always `NULL`.

* `UPDATE_TIME`

  This is always `NULL`.

* `CHECK_TIME`

  This is always `NULL`.

* `CHECKSUM`

  This is always `NULL`.

* `STATUS`

  For `InnoDB`: This value is `NORMAL` by default. `InnoDB` file-per-table tablespaces may report `IMPORTING`, which indicates that the tablespace is not yet available.

  For `NDB`: For NDB Cluster Disk Data files, this value is always `NORMAL`.

* `EXTRA`

  For `InnoDB`: This is always `NULL`.

  For `NDB`: For undo log files, this column shows the undo log buffer size; for data files, it is always *NULL*. A more detailed explanation is provided in the next few paragraphs.

  `NDB` stores a copy of each data file and each undo log file on each data node in the cluster. The `FILES` table contains one row for each such file. Suppose that you run the following two statements on an NDB Cluster with four data nodes:

  ```
  CREATE LOGFILE GROUP mygroup
      ADD UNDOFILE 'new_undo.dat'
      INITIAL_SIZE 2G
      ENGINE NDBCLUSTER;

  CREATE TABLESPACE myts
      ADD DATAFILE 'data_1.dat'
      USE LOGFILE GROUP mygroup
      INITIAL_SIZE 256M
      ENGINE NDBCLUSTER;
  ```

  After running these two statements successfully, you should see a result similar to the one shown here for this query against the `FILES` table:

  ```
  mysql> SELECT LOGFILE_GROUP_NAME, FILE_TYPE, EXTRA
      ->     FROM INFORMATION_SCHEMA.FILES
      ->     WHERE ENGINE = 'ndbcluster';

  +--------------------+-----------+--------------------------+
  | LOGFILE_GROUP_NAME | FILE_TYPE | EXTRA                    |
  +--------------------+-----------+--------------------------+
  | mygroup            | UNDO LOG  | UNDO_BUFFER_SIZE=8388608 |
  | mygroup            | DATAFILE  | NULL                     |
  +--------------------+-----------+--------------------------+
  ```

#### Notes

* `FILES` is a nonstandard `INFORMATION_SCHEMA` table.

* You must have the `PROCESS` privilege to query this table.

#### InnoDB Notes

The following notes apply to `InnoDB` data files.

* Information reported by `FILES` is obtained from the `InnoDB` in-memory cache for open files, whereas `INNODB_DATAFILES` gets its data from the `InnoDB` `SYS_DATAFILES` internal data dictionary table.

* The information provided by `FILES` includes global temporary tablespace information which is not available in the `InnoDB` `SYS_DATAFILES` internal data dictionary table, and is therefore not included in `INNODB_DATAFILES`.

* Undo tablespace information is shown in `FILES` when separate undo tablespaces are present, as they are by default in MySQL 9.5.

* The following query returns all `FILES` table information relating to `InnoDB` tablespaces.

  ```
  SELECT
    FILE_ID, FILE_NAME, FILE_TYPE, TABLESPACE_NAME, FREE_EXTENTS,
    TOTAL_EXTENTS, EXTENT_SIZE, INITIAL_SIZE, MAXIMUM_SIZE,
    AUTOEXTEND_SIZE, DATA_FREE, STATUS
  FROM INFORMATION_SCHEMA.FILES
  WHERE ENGINE='InnoDB'\G
  ```

#### NDB Notes

* The `FILES` table provides information about Disk Data *files* only; you cannot use it for determining disk space allocation or availability for individual `NDB` tables. However, it is possible to see how much space is allocated for each `NDB` table having data stored on disk—as well as how much remains available for storage of data on disk for that table—using **ndb\_desc**.

* Much of the information contained in the `FILES` table can also be found in the `ndbinfo` `files` table.

* The `CREATION_TIME`, `LAST_UPDATE_TIME`, and `LAST_ACCESSED` values are as reported by the operating system, and are not supplied by the `NDB` storage engine. Where no value is provided by the operating system, these columns display `NULL`.

* The difference between the `TOTAL EXTENTS` and `FREE_EXTENTS` columns is the number of extents currently in use by the file:

  ```
  SELECT TOTAL_EXTENTS - FREE_EXTENTS AS extents_used
      FROM INFORMATION_SCHEMA.FILES
      WHERE FILE_NAME = './myfile.dat';
  ```

  To approximate the amount of disk space in use by the file, multiply that difference by the value of the `EXTENT_SIZE` column, which gives the size of an extent for the file in bytes:

  ```
  SELECT (TOTAL_EXTENTS - FREE_EXTENTS) * EXTENT_SIZE AS bytes_used
      FROM INFORMATION_SCHEMA.FILES
      WHERE FILE_NAME = './myfile.dat';
  ```

  Similarly, you can estimate the amount of space that remains available in a given file by multiplying `FREE_EXTENTS` by `EXTENT_SIZE`:

  ```
  SELECT FREE_EXTENTS * EXTENT_SIZE AS bytes_free
      FROM INFORMATION_SCHEMA.FILES
      WHERE FILE_NAME = './myfile.dat';
  ```

  Important

  The byte values produced by the preceding queries are approximations only, and their precision is inversely proportional to the value of `EXTENT_SIZE`. That is, the larger `EXTENT_SIZE` becomes, the less accurate the approximations are.

  It is also important to remember that once an extent is used, it cannot be freed again without dropping the data file of which it is a part. This means that deletes from a Disk Data table do *not* release disk space.

  The extent size can be set in a [`CREATE TABLESPACE`](create-tablespace.html "15.1.25 CREATE TABLESPACE Statement") statement. For more information, see Section 15.1.25, “CREATE TABLESPACE Statement”.

* You can obtain information about Disk Data tablespaces using the **ndb\_desc** utility. For more information, see Section 25.6.11.1, “NDB Cluster Disk Data Objects”, as well as the description of **ndb\_desc**.

* For additional information, and examples of creating, dropping, and obtaining information about NDB Cluster Disk Data objects, see Section 25.6.11, “NDB Cluster Disk Data Tables”.


### 28.3.16 The INFORMATION\_SCHEMA KEY\_COLUMN\_USAGE Table

The `KEY_COLUMN_USAGE` table describes which key columns have constraints. This table provides no information about functional key parts because they are expressions and the table provides information only about columns.

The `KEY_COLUMN_USAGE` table has these columns:

* `CONSTRAINT_CATALOG`

  The name of the catalog to which the constraint belongs. This value is always `def`.

* `CONSTRAINT_SCHEMA`

  The name of the schema (database) to which the constraint belongs.

* `CONSTRAINT_NAME`

  The name of the constraint.

* `TABLE_CATALOG`

  The name of the catalog to which the table belongs. This value is always `def`.

* `TABLE_SCHEMA`

  The name of the schema (database) to which the table belongs.

* `TABLE_NAME`

  The name of the table that has the constraint.

* `COLUMN_NAME`

  The name of the column that has the constraint.

  If the constraint is a foreign key, then this is the column of the foreign key, not the column that the foreign key references.

* `ORDINAL_POSITION`

  The column's position within the constraint, not the column's position within the table. Column positions are numbered beginning with 1.

* `POSITION_IN_UNIQUE_CONSTRAINT`

  `NULL` for unique and primary-key constraints. For foreign-key constraints, this column is the ordinal position in key of the table that is being referenced.

* `REFERENCED_TABLE_SCHEMA`

  The name of the schema referenced by the constraint.

* `REFERENCED_TABLE_NAME`

  The name of the table referenced by the constraint.

* `REFERENCED_COLUMN_NAME`

  The name of the column referenced by the constraint.

Suppose that there are two tables name `t1` and `t3` that have the following definitions:

```
CREATE TABLE t1
(
    s1 INT,
    s2 INT,
    s3 INT,
    PRIMARY KEY(s3)
) ENGINE=InnoDB;

CREATE TABLE t3
(
    s1 INT,
    s2 INT,
    s3 INT,
    KEY(s1),
    CONSTRAINT CO FOREIGN KEY (s2) REFERENCES t1(s3)
) ENGINE=InnoDB;
```

For those two tables, the `KEY_COLUMN_USAGE` table has two rows:

* One row with `CONSTRAINT_NAME` = `'PRIMARY'`, `TABLE_NAME` = `'t1'`, `COLUMN_NAME` = `'s3'`, `ORDINAL_POSITION` = `1`, `POSITION_IN_UNIQUE_CONSTRAINT` = `NULL`.

  For `NDB`: This value is always `NULL`.

* One row with `CONSTRAINT_NAME` = `'CO'`, `TABLE_NAME` = `'t3'`, `COLUMN_NAME` = `'s2'`, `ORDINAL_POSITION` = `1`, `POSITION_IN_UNIQUE_CONSTRAINT` = `1`.


### 28.3.17 The INFORMATION\_SCHEMA KEYWORDS Table

The `KEYWORDS` table lists the words considered keywords by MySQL and, for each one, indicates whether it is reserved. Reserved keywords may require special treatment in some contexts, such as special quoting when used as identifiers (see Section 11.3, “Keywords and Reserved Words”). This table provides applications a runtime source of MySQL keyword information.

The `KEYWORDS` table has these columns:

* `WORD`

  The keyword.

* `RESERVED`

  An integer indicating whether the keyword is reserved (1) or nonreserved (0).

These queries lists all keywords, all reserved keywords, and all nonreserved keywords, respectively:

```
SELECT * FROM INFORMATION_SCHEMA.KEYWORDS;
SELECT WORD FROM INFORMATION_SCHEMA.KEYWORDS WHERE RESERVED = 1;
SELECT WORD FROM INFORMATION_SCHEMA.KEYWORDS WHERE RESERVED = 0;
```

The latter two queries are equivalent to:

```
SELECT WORD FROM INFORMATION_SCHEMA.KEYWORDS WHERE RESERVED;
SELECT WORD FROM INFORMATION_SCHEMA.KEYWORDS WHERE NOT RESERVED;
```

If you build MySQL from source, the build process generates a `keyword_list.h` header file containing an array of keywords and their reserved status. This file can be found in the `sql` directory under the build directory. This file may be useful for applications that require a static source for the keyword list.


### 28.3.18 The INFORMATION SCHEMA JSON\_DUALITY\_VIEWS Table

The `JSON_DUALITY_VIEWS` table provides information about JSON duality views accessible by the current user. There is one row in this table for each such view.

The `JSON_DUALITY_VIEWS` table contains the columns listed here:

* `TABLE_CATALOG`

  View catalog; this is always `def`.

* `TABLE_SCHEMA`

  View schema.

* `TABLE_NAME`

  View name.

* `DEFINER`

  User who created the view.

* `SECURITY_TYPE`

  One of `INVOKER` or `DEFINER`.

* `JSON_COLUMN_NAME`

  This is always `data`.

* `ROOT_TABLE_CATALOG`

  Catalog of the root table; this is always `def`.

* `ROOT_TABLE_SCHEMA`

  Schema of the root table.

* `ROOT_TABLE_NAME`

  Name of the root table.

* `ALLOW_INSERT`

  `1` if inserts are allowed, otherwise `0`.

* `ALLOW_UPDATE`

  `1` if updates are allowed, otherwise `0`.

* `ALLOW_DELETE`

  `1` if deletes are allowed, otherwise `0`.

* `READ_ONLY`

  `1` if insert, update, or delete are not allowed, otherwise `0`. (In other words, this is `1` only when `ALLOW_INSERT`, `ALLOW_UPDATE`, and `ALLOW_DELETE` are all `0`.)

* `STATUS`

  One of `valid` or `invalid`.

The root table name and other information are shown only if the user has some type of privilege on the root table; the user must also have `SHOW VIEW` and `SELECT` privileges on the view.


### 28.3.19 The INFORMATION SCHEMA JSON\_DUALITY\_VIEW\_COLUMNS Table

The `JSON_DUALITY_VIEW_COLUMNS` table shows information about all columns referenced by any JSON duality view which is accessible by the current user. There is one row per table reference.

The `JSON_DUALITY_VIEW_COLUMNS` table has the following columns:

* `TABLE_CATALOG`

  View catalog; this is always `def`.

* `TABLE_SCHEMA`

  View schema.

* `TABLE_NAME`

  View name.

* `REFERENCED_TABLE_CATALOG`

  Table catalog; always `def`.

* `REFERENCED_TABLE_SCHEMA`

  Table schema.

* `REFERENCED_TABLE_NAME`

  Table name.

* `IS_ROOT_TABLE`

  `1` if this is the root table, otherwise `0`.

* `REFERENCED_TABLE_ID`

  Unique table ID within this view.

* `REFERENCED_TABLE_COLUMN_NAME`

  Column name.

* `JSON_KEY_NAME`

  JSON key name.

* `ALLOW_INSERT`

  `1` if inserts are allowed, otherwise `0`.

* `ALLOW_UPDATE`

  `1` if updates are allowed, otherwise `0`.

* `ALLOW_DELETE`

  `1` if deletes are allowed, otherwise `0`.

* `READ_ONLY`

  `1` if insert, update, or delete are not allowed, otherwise `0`. (In other words, this is `1` only when `ALLOW_INSERT`, `ALLOW_UPDATE`, and `ALLOW_DELETE` are all `0`.)


### 28.3.20 The INFORMATION SCHEMA JSON\_DUALITY\_VIEW\_LINKS Table

The `JSON_DUALITY_VIEW_LINKS` table shows information about the relationships between parent and child tables for all views accessible by the current user. There is one row per view.

The `JSON_DUALITY_VIEW_LINKS` table has the columns shown here:

* `TABLE_CATALOG`

  View catalog; this is always `def`.

* `TABLE_SCHEMA`

  View schema.

* `TABLE_NAME`

  View name.

* `PARENT_TABLE_CATALOG`

  Parent catalog; this is always `def`.

* `PARENT_TABLE_SCHEMA`

  Parent schema.

* `PARENT_TABLE_NAME`

  Parent table.

* `CHILD_TABLE_CATALOG`

  Child catalog; this is always `def`.

* `CHILD_TABLE_SCHEMA`

  Child schema.

* `CHILD_TABLE_NAME`

  Child table.

* `PARENT_TABLE_COLUMN_NAME`

  Parent column name.

* `CHILD_TABLE_COLUMN_NAME`

  Child column name.

* `JOIN_TYPE`

  One of `NESTED` or `OUTER`.

* `JSON_KEY_NAME`

  Name of the applicable JSON key, if any.


### 28.3.21 The INFORMATION SCHEMA JSON\_DUALITY\_VIEW\_TABLES Table

The `JSON_DUALITY_VIEW_TABLES` table shows information about all tables referenced by any JSON duality view which is accessible by the current user. This table contains one row per table reference.

The `JSON_DUALITY_VIEW_TABLES` table has the columns listed here:

* `TABLE_CATALOG`

  View catalog; this is always `def`.

* `TABLE_SCHEMA`

  View schema.

* `TABLE_NAME`

  View name.

* `REFERENCED_TABLE_CATALOG`

  Table catalog; this is always `def`.

* `REFERENCED_TABLE_SCHEMA`

  Table schema.

* `REFERENCED_TABLE_NAME`

  Name of the table.

* `WHERE_CLAUSE`

  Expression used in the `WHERE` clause.

* `ALLOW_INSERT`

  `1` if inserts are allowed, otherwise `0`.

* `ALLOW_UPDATE`

  `1` if updates are allowed, otherwise `0`.

* `ALLOW_DELETE`

  `1` if deletes are allowed, otherwise `0`.

* `READ_ONLY`

  `1` if insert, update, or delete are not allowed, otherwise `0`. (In other words, this is `1` only when `ALLOW_INSERT`, `ALLOW_UPDATE`, and `ALLOW_DELETE` are all `0`.)

* `IS_ROOT_TABLE`

  `1` if this is the root table, otherwise `0`.

* `REFERENCED_TABLE_ID`

  Unique table ID within this view.

* `REFERENCED_TABLE_PARENT_ID`

  ID of the parent table.

* `REFERENCED_TABLE_PARENT_RELATIONSHIP`

  One of `nested` (arrays) or `singleton` (otherwise).


### 28.3.22 The INFORMATION\_SCHEMA LIBRARIES Table

The `LIBRARIES` table contains information about JavaScript and WebAssembly libraries known to the MLE JavaScript component (see Section 7.5.7, “Multilingual Engine Component (MLE)”")).

The `LIBRARIES` table has these columns:

* `LIBRARY_CATALOG`

  Library catalog name. Currently, this is always `def`.

* `LIBRARY_SCHEMA`

  Schema (database) to which the library belongs.

* `LIBRARY_NAME`

  Name of the library.

* `LIBRARY_DEFINITION`

  Text of the JavaScript library definition. For WebAssembly libraries, this column is empty.

* `LANGUAGE`

  Language. In MySQL 9.5, this is `JAVASCRIPT` or `WASM`.

* `CREATED`

  Library creation date and time.

* `LAST_ALTERED`

  Most recent date and time that the library was altered.

* `SQL_MODE`

  SQL mode in effect at time of creation (see Section 7.1.11, “Server SQL Modes”). This is a set consisting of none or any one or more of the following: `REAL_AS_FLOAT`, `PIPES_AS_CONCAT`, `ANSI_QUOTES`, `IGNORE_SPACE`, `ONLY_FULL_GROUP_BY`, `NO_UNSIGNED_SUBTRACTION`, `NO_DIR_IN_CREATE`, `ANSI`, `NO_AUTO_VALUE_ON_ZERO`, `NO_BACKSLASH_ESCAPES`, `STRICT_TRANS_TABLES`, `STRICT_ALL_TABLES`, `NO_ZERO_IN_DATE`, `NO_ZERO_DATE`, `ALLOW_INVALID_DATES`, `ERROR_FOR_DIVISION_BY_ZERO`, `TRADITIONAL`, `HIGH_NOT_PRECEDENCE`, `NO_ENGINE_SUBSTITUTION`, `PAD_CHAR_TO_FULL_LENGTH`, `TIME_TRUNCATE_FRACTIONAL`. The default is `ONLY_FULL_GROUP_BY, STRICT_TRANS_TABLES, NO_ZERO_IN_DATE, NO_ZERO_DATE, ERROR_FOR_DIVISION_BY_ZERO, NO_ENGINE_SUBSTITUTION`.

* `LIBRARY_COMMENT`

  Comment specified, if any, when the library was created (or last altered, using [`ALTER LIBRARY`](alter-library.html "15.1.7 ALTER LIBRARY Statement")).

* `CREATOR`

  User account which created the library.

Example:

```
mysql> CREATE LIBRARY IF NOT EXISTS jslib.lib1 LANGUAGE JAVASCRIPT
    ->     AS $$
    $>       export function f(n) {
    $>         return n
    $>       }
    $>     $$;
Query OK, 0 rows affected (0.02 sec)

mysql> CREATE LIBRARY IF NOT EXISTS jslib.lib2 LANGUAGE JAVASCRIPT
    ->     AS $$
    $>       export function g(n) {
    $>         return n * 2
    $>       }
    $>     $$;
Query OK, 0 rows affected (0.00 sec)

mysql> SELECT * FROM information_schema.LIBRARIES
    -> WHERE LIBRARY_SCHEMA='jslib'\G
*************************** 1. row ***************************
   LIBRARY_CATALOG: def
    LIBRARY_SCHEMA: jslib
      LIBRARY_NAME: lib1
LIBRARY_DEFINITION:
      export function f(n) {
        return n
      }

          LANGUAGE: JAVASCRIPT
           CREATED: 2024-12-16 09:20:26
      LAST_ALTERED: 2024-12-16 09:20:26
          SQL_MODE: ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,
NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION
           CREATOR: me@localhost
*************************** 2. row ***************************
   LIBRARY_CATALOG: def
    LIBRARY_SCHEMA: jslib
      LIBRARY_NAME: lib2
LIBRARY_DEFINITION:
      export function g(n) {
        return n * 2
      }

          LANGUAGE: JAVASCRIPT
           CREATED: 2024-12-16 09:20:26
      LAST_ALTERED: 2024-12-16 09:20:26
          SQL_MODE: ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,
NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION
           CREATOR: me@localhost
2 rows in set (0.00 sec)
```


### 28.3.23 The INFORMATION\_SCHEMA ndb\_transid\_mysql\_connection\_map Table

The `ndb_transid_mysql_connection_map` table provides a mapping between `NDB` transactions, `NDB` transaction coordinators, and MySQL Servers attached to an NDB Cluster as API nodes. This information is used when populating the `server_operations` and `server_transactions` tables of the `ndbinfo` NDB Cluster information database.

<table summary="Columns in the INFORMATION_SCHEMA ndb_transid_mysql_connection_map table. The table lists INFORMATION_SCHEMA names along with corresponding SHOW names (if applicable), and remarks."><col style="width: 40%"/><col style="width: 30%"/><col style="width: 30%"/><thead><tr> <th scope="col"><code class="literal">INFORMATION_SCHEMA</code> Name</th> <th scope="col"><code class="literal">SHOW</code> Name</th> <th scope="col">Remarks</th> </tr></thead><tbody><tr> <th scope="row"><code class="literal">mysql_connection_id</code></th> <td></td> <td>MySQL Server connection ID</td> </tr><tr> <th scope="row"><code class="literal">node_id</code></th> <td></td> <td>Transaction coordinator node ID</td> </tr><tr> <th scope="row"><code class="literal">ndb_transid</code></th> <td></td> <td><a class="link" href="mysql-cluster.html" title="Chapter 25 MySQL NDB Cluster 9.5"><code class="literal">NDB</code></a> transaction ID</td> </tr></tbody></table>

The `mysql_connection_id` is the same as the connection or session ID shown in the output of `SHOW PROCESSLIST`.

There are no `SHOW` statements associated with this table.

This is a nonstandard table, specific to NDB Cluster. It is implemented as an `INFORMATION_SCHEMA` plugin; you can verify that it is supported by checking the output of `SHOW PLUGINS`. If `ndb_transid_mysql_connection_map` support is enabled, the output from this statement includes a plugin having this name, of type `INFORMATION SCHEMA`, and having status `ACTIVE`, as shown here (using emphasized text):

```
mysql> SHOW PLUGINS;
+----------------------------------+--------+--------------------+---------+---------+
| Name                             | Status | Type               | Library | License |
+----------------------------------+--------+--------------------+---------+---------+
| binlog                           | ACTIVE | STORAGE ENGINE     | NULL    | GPL     |
| mysql_native_password            | ACTIVE | AUTHENTICATION     | NULL    | GPL     |
| sha256_password                  | ACTIVE | AUTHENTICATION     | NULL    | GPL     |
| caching_sha2_password            | ACTIVE | AUTHENTICATION     | NULL    | GPL     |
| daemon_keyring_proxy_plugin      | ACTIVE | DAEMON             | NULL    | GPL     |
| CSV                              | ACTIVE | STORAGE ENGINE     | NULL    | GPL     |
| MEMORY                           | ACTIVE | STORAGE ENGINE     | NULL    | GPL     |
| InnoDB                           | ACTIVE | STORAGE ENGINE     | NULL    | GPL     |
| INNODB_TRX                       | ACTIVE | INFORMATION SCHEMA | NULL    | GPL     |
| INNODB_CMP                       | ACTIVE | INFORMATION SCHEMA | NULL    | GPL     |

...

| INNODB_SESSION_TEMP_TABLESPACES  | ACTIVE | INFORMATION SCHEMA | NULL    | GPL     |
| MyISAM                           | ACTIVE | STORAGE ENGINE     | NULL    | GPL     |
| MRG_MYISAM                       | ACTIVE | STORAGE ENGINE     | NULL    | GPL     |
| PERFORMANCE_SCHEMA               | ACTIVE | STORAGE ENGINE     | NULL    | GPL     |
| TempTable                        | ACTIVE | STORAGE ENGINE     | NULL    | GPL     |
| ARCHIVE                          | ACTIVE | STORAGE ENGINE     | NULL    | GPL     |
| BLACKHOLE                        | ACTIVE | STORAGE ENGINE     | NULL    | GPL     |
| ndbcluster                       | ACTIVE | STORAGE ENGINE     | NULL    | GPL     |
| ndbinfo                          | ACTIVE | STORAGE ENGINE     | NULL    | GPL     |
| ndb_transid_mysql_connection_map | ACTIVE | INFORMATION SCHEMA | NULL    | GPL     |
| ngram                            | ACTIVE | FTPARSER           | NULL    | GPL     |
| mysqlx_cache_cleaner             | ACTIVE | AUDIT              | NULL    | GPL     |
| mysqlx                           | ACTIVE | DAEMON             | NULL    | GPL     |
+----------------------------------+--------+--------------------+---------+---------+
47 rows in set (0.01 sec)
```

The plugin is enabled by default. You can disable it (or force the server not to run unless the plugin starts) by starting the server with the `--ndb-transid-mysql-connection-map` option. If the plugin is disabled, the status is shown by `SHOW PLUGINS` as `DISABLED`. The plugin cannot be enabled or disabled at runtime.

Although the names of this table and its columns are displayed using lowercase, you can use uppercase or lowercase when referring to them in SQL statements.

For this table to be created, the MySQL Server must be a binary supplied with the NDB Cluster distribution, or one built from the NDB Cluster sources with `NDB` storage engine support enabled. It is not available in the standard MySQL 9.5 Server.


### 28.3.24 The INFORMATION\_SCHEMA OPTIMIZER\_TRACE Table

The `OPTIMIZER_TRACE` table provides information produced by the optimizer tracing capability for traced statements. To enable tracking, use the `optimizer_trace` system variable. For details, see Section 10.15, “Tracing the Optimizer”.

The `OPTIMIZER_TRACE` table has these columns:

* `QUERY`

  The text of the traced statement.

* `TRACE`

  The trace, in `JSON` format.

* `MISSING_BYTES_BEYOND_MAX_MEM_SIZE`

  Each remembered trace is a string that is extended as optimization progresses and appends data to it. The `optimizer_trace_max_mem_size` variable sets a limit on the total amount of memory used by all currently remembered traces. If this limit is reached, the current trace is not extended (and thus is incomplete), and the `MISSING_BYTES_BEYOND_MAX_MEM_SIZE` column shows the number of bytes missing from the trace.

* `INSUFFICIENT_PRIVILEGES`

  If a traced query uses views or stored routines that have `SQL SECURITY` with a value of `DEFINER`, it may be that a user other than the definer is denied from seeing the trace of the query. In that case, the trace is shown as empty and `INSUFFICIENT_PRIVILEGES` has a value of 1. Otherwise, the value is 0.


### 28.3.25 The INFORMATION\_SCHEMA PARAMETERS Table

The `PARAMETERS` table provides information about parameters for stored routines (stored procedures and stored functions), and about return values for stored functions. The `PARAMETERS` table does not include built-in (native) functions or loadable functions.

The `PARAMETERS` table has these columns:

* `SPECIFIC_CATALOG`

  The name of the catalog to which the routine containing the parameter belongs. This value is always `def`.

* `SPECIFIC_SCHEMA`

  The name of the schema (database) to which the routine containing the parameter belongs.

* `SPECIFIC_NAME`

  The name of the routine containing the parameter.

* `ORDINAL_POSITION`

  For successive parameters of a stored procedure or function, the `ORDINAL_POSITION` values are 1, 2, 3, and so forth. For a stored function, there is also a row that applies to the function return value (as described by the `RETURNS` clause). The return value is not a true parameter, so the row that describes it has these unique characteristics:

  + The `ORDINAL_POSITION` value is 0.
  + The `PARAMETER_NAME` and `PARAMETER_MODE` values are `NULL` because the return value has no name and the mode does not apply.

* `PARAMETER_MODE`

  The mode of the parameter. This value is one of `IN`, `OUT`, or `INOUT`. For a stored function return value, this value is `NULL`.

* `PARAMETER_NAME`

  The name of the parameter. For a stored function return value, this value is `NULL`.

* `DATA_TYPE`

  The parameter data type.

  The `DATA_TYPE` value is the type name only with no other information. The `DTD_IDENTIFIER` value contains the type name and possibly other information such as the precision or length.

* `CHARACTER_MAXIMUM_LENGTH`

  For string parameters, the maximum length in characters.

* `CHARACTER_OCTET_LENGTH`

  For string parameters, the maximum length in bytes.

* `NUMERIC_PRECISION`

  For numeric parameters, the numeric precision.

* `NUMERIC_SCALE`

  For numeric parameters, the numeric scale.

* `DATETIME_PRECISION`

  For temporal parameters, the fractional seconds precision.

* `CHARACTER_SET_NAME`

  For character string parameters, the character set name.

* `COLLATION_NAME`

  For character string parameters, the collation name.

* `DTD_IDENTIFIER`

  The parameter data type.

  The `DATA_TYPE` value is the type name only with no other information. The `DTD_IDENTIFIER` value contains the type name and possibly other information such as the precision or length.

* `ROUTINE_TYPE`

  `PROCEDURE` for stored procedures, `FUNCTION` for stored functions.


### 28.3.26 The INFORMATION\_SCHEMA PARTITIONS Table

The `PARTITIONS` table provides information about table partitions. Each row in this table corresponds to an individual partition or subpartition of a partitioned table. For more information about partitioning tables, see Chapter 26, *Partitioning*.

The `PARTITIONS` table has these columns:

* `TABLE_CATALOG`

  The name of the catalog to which the table belongs. This value is always `def`.

* `TABLE_SCHEMA`

  The name of the schema (database) to which the table belongs.

* `TABLE_NAME`

  The name of the table containing the partition.

* `PARTITION_NAME`

  The name of the partition.

* `SUBPARTITION_NAME`

  If the `PARTITIONS` table row represents a subpartition, the name of subpartition; otherwise `NULL`.

  For `NDB`: This value is always `NULL`.

* `PARTITION_ORDINAL_POSITION`

  All partitions are indexed in the same order as they are defined, with `1` being the number assigned to the first partition. The indexing can change as partitions are added, dropped, and reorganized; the number shown is this column reflects the current order, taking into account any indexing changes.

* `SUBPARTITION_ORDINAL_POSITION`

  Subpartitions within a given partition are also indexed and reindexed in the same manner as partitions are indexed within a table.

* `PARTITION_METHOD`

  One of the values `RANGE`, `LIST`, `HASH`, `LINEAR HASH`, `KEY`, or `LINEAR KEY`; that is, one of the available partitioning types as discussed in Section 26.2, “Partitioning Types”.

* `SUBPARTITION_METHOD`

  One of the values `HASH`, `LINEAR HASH`, `KEY`, or `LINEAR KEY`; that is, one of the available subpartitioning types as discussed in Section 26.2.6, “Subpartitioning”.

* `PARTITION_EXPRESSION`

  The expression for the partitioning function used in the `CREATE TABLE` or `ALTER TABLE` statement that created the table's current partitioning scheme.

  For example, consider a partitioned table created in the `test` database using this statement:

  ```
  CREATE TABLE tp (
      c1 INT,
      c2 INT,
      c3 VARCHAR(25)
  )
  PARTITION BY HASH(c1 + c2)
  PARTITIONS 4;
  ```

  The `PARTITION_EXPRESSION` column in a `PARTITIONS` table row for a partition from this table displays `c1 + c2`, as shown here:

  ```
  mysql> SELECT DISTINCT PARTITION_EXPRESSION
         FROM INFORMATION_SCHEMA.PARTITIONS
         WHERE TABLE_NAME='tp' AND TABLE_SCHEMA='test';
  +----------------------+
  | PARTITION_EXPRESSION |
  +----------------------+
  | c1 + c2              |
  +----------------------+
  ```

  For a table that is not explicitly partitioned, this column is always `NULL`, regardless of storage engine.

* `SUBPARTITION_EXPRESSION`

  This works in the same fashion for the subpartitioning expression that defines the subpartitioning for a table as `PARTITION_EXPRESSION` does for the partitioning expression used to define a table's partitioning.

  If the table has no subpartitions, this column is `NULL`.

* `PARTITION_DESCRIPTION`

  This column is used for RANGE and LIST partitions. For a `RANGE` partition, it contains the value set in the partition's `VALUES LESS THAN` clause, which can be either an integer or `MAXVALUE`. For a `LIST` partition, this column contains the values defined in the partition's `VALUES IN` clause, which is a list of comma-separated integer values.

  For partitions whose `PARTITION_METHOD` is other than `RANGE` or `LIST`, this column is always `NULL`.

* `TABLE_ROWS`

  The number of table rows in the partition.

  For partitioned `InnoDB` tables, the row count given in the `TABLE_ROWS` column is only an estimated value used in SQL optimization, and may not always be exact.

  For `NDB` tables, you can also obtain this information using the **ndb\_desc** utility.

* `AVG_ROW_LENGTH`

  The average length of the rows stored in this partition or subpartition, in bytes. This is the same as `DATA_LENGTH` divided by `TABLE_ROWS`.

  For `NDB` tables, you can also obtain this information using the **ndb\_desc** utility.

* `DATA_LENGTH`

  The total length of all rows stored in this partition or subpartition, in bytes; that is, the total number of bytes stored in the partition or subpartition.

  For `NDB` tables, you can also obtain this information using the **ndb\_desc** utility.

* `MAX_DATA_LENGTH`

  The maximum number of bytes that can be stored in this partition or subpartition.

  For `NDB` tables, you can also obtain this information using the **ndb\_desc** utility.

* `INDEX_LENGTH`

  The length of the index file for this partition or subpartition, in bytes.

  For partitions of `NDB` tables, whether the tables use implicit or explicit partitioning, the `INDEX_LENGTH` column value is always 0. However, you can obtain equivalent information using the **ndb\_desc** utility.

* `DATA_FREE`

  The number of bytes allocated to the partition or subpartition but not used.

  For `NDB` tables, you can also obtain this information using the **ndb\_desc** utility.

* `CREATE_TIME`

  The time that the partition or subpartition was created.

* `UPDATE_TIME`

  The time that the partition or subpartition was last modified.

* `CHECK_TIME`

  The last time that the table to which this partition or subpartition belongs was checked.

  For partitioned `InnoDB` tables, the value is always `NULL`.

* `CHECKSUM`

  The checksum value, if any; otherwise `NULL`.

* `PARTITION_COMMENT`

  The text of the comment, if the partition has one. If not, this value is empty.

  The maximum length for a partition comment is defined as 1024 characters, and the display width of the `PARTITION_COMMENT` column is also 1024, characters to match this limit.

* `NODEGROUP`

  This is the nodegroup to which the partition belongs. For NDB Cluster tables, this is always `default`. For partitioned tables using storage engines other than `NDB`, the value is also `default`. Otherwise, this column is empty.

* `TABLESPACE_NAME`

  The name of the tablespace to which the partition belongs. The value is always `DEFAULT`, unless the table uses the `NDB` storage engine (see the *Notes* at the end of this section).

#### Notes

* `PARTITIONS` is a nonstandard `INFORMATION_SCHEMA` table.

* A table using any storage engine other than `NDB` and which is not partitioned has one row in the `PARTITIONS` table. However, the values of the `PARTITION_NAME`, `SUBPARTITION_NAME`, `PARTITION_ORDINAL_POSITION`, `SUBPARTITION_ORDINAL_POSITION`, `PARTITION_METHOD`, `SUBPARTITION_METHOD`, `PARTITION_EXPRESSION`, `SUBPARTITION_EXPRESSION`, and `PARTITION_DESCRIPTION` columns are all `NULL`. Also, the `PARTITION_COMMENT` column in this case is blank.

* An `NDB` table which is not explicitly partitioned has one row in the `PARTITIONS` table for each data node in the NDB cluster. For each such row:

  + The `SUBPARTITION_NAME`, `SUBPARTITION_ORDINAL_POSITION`, `SUBPARTITION_METHOD`, `PARTITION_EXPRESSION`, `SUBPARTITION_EXPRESSION`, `CREATE_TIME`, `UPDATE_TIME`, `CHECK_TIME`, `CHECKSUM`, and `TABLESPACE_NAME` columns are all `NULL`.

  + The `PARTITION_METHOD` is always `AUTO`.

  + The `NODEGROUP` column is `default`.

  + The `PARTITION_COMMENT` column is empty.


### 28.3.27 The INFORMATION\_SCHEMA PLUGINS Table

The `PLUGINS` table provides information about server plugins.

The `PLUGINS` table has these columns:

* `PLUGIN_NAME`

  The name used to refer to the plugin in statements such as `INSTALL PLUGIN` and `UNINSTALL PLUGIN`.

* `PLUGIN_VERSION`

  The version from the plugin's general type descriptor.

* `PLUGIN_STATUS`

  The plugin status, one of `ACTIVE`, `INACTIVE`, `DISABLED`, `DELETING`, or `DELETED`.

* `PLUGIN_TYPE`

  The type of plugin, such as `STORAGE ENGINE`, `INFORMATION_SCHEMA`, or `AUTHENTICATION`.

* `PLUGIN_TYPE_VERSION`

  The version from the plugin's type-specific descriptor.

* `PLUGIN_LIBRARY`

  The name of the plugin shared library file. This is the name used to refer to the plugin file in statements such as `INSTALL PLUGIN` and `UNINSTALL PLUGIN`. This file is located in the directory named by the `plugin_dir` system variable. If the library name is `NULL`, the plugin is compiled in and cannot be uninstalled with `UNINSTALL PLUGIN`.

* `PLUGIN_LIBRARY_VERSION`

  The plugin API interface version.

* `PLUGIN_AUTHOR`

  The plugin author.

* `PLUGIN_DESCRIPTION`

  A short description of the plugin.

* `PLUGIN_LICENSE`

  How the plugin is licensed (for example, `GPL`).

* `LOAD_OPTION`

  How the plugin was loaded. The value is `OFF`, `ON`, `FORCE`, or `FORCE_PLUS_PERMANENT`. See Section 7.6.1, “Installing and Uninstalling Plugins”.

#### Notes

* `PLUGINS` is a nonstandard `INFORMATION_SCHEMA` table.

* For plugins installed with [`INSTALL PLUGIN`](install-plugin.html "15.7.4.4 INSTALL PLUGIN Statement"), the `PLUGIN_NAME` and `PLUGIN_LIBRARY` values are also registered in the `mysql.plugin` table.

* For information about plugin data structures that form the basis of the information in the `PLUGINS` table, see The MySQL Plugin API.

Plugin information is also available from the `SHOW PLUGINS` statement. See Section 15.7.7.28, “SHOW PLUGINS Statement”. These statements are equivalent:

```
SELECT
  PLUGIN_NAME, PLUGIN_STATUS, PLUGIN_TYPE,
  PLUGIN_LIBRARY, PLUGIN_LICENSE
FROM INFORMATION_SCHEMA.PLUGINS;

SHOW PLUGINS;
```


### 28.3.28 The INFORMATION\_SCHEMA PROCESSLIST Table

Important

`INFORMATION_SCHEMA.PROCESSLIST` is deprecated and subject to removal in a future MySQL release. As such, the implementation of [`SHOW PROCESSLIST`](show-processlist.html "15.7.7.32 SHOW PROCESSLIST Statement") which uses this table is also deprecated. It is recommended to use the Performance Schema implementation of `PROCESSLIST` instead.

The MySQL process list indicates the operations currently being performed by the set of threads executing within the server. The `PROCESSLIST` table is one source of process information. For a comparison of this table with other sources, see Sources of Process Information.

The `PROCESSLIST` table has these columns:

* `ID`

  The connection identifier. This is the same value displayed in the `Id` column of the `SHOW PROCESSLIST` statement, displayed in the `PROCESSLIST_ID` column of the Performance Schema `threads` table, and returned by the `CONNECTION_ID()` function within the thread.

* `USER`

  The MySQL user who issued the statement. A value of `system user` refers to a nonclient thread spawned by the server to handle tasks internally, for example, a delayed-row handler thread or an I/O or SQL thread used on replica hosts. For `system user`, there is no host specified in the `Host` column. `unauthenticated user` refers to a thread that has become associated with a client connection but for which authentication of the client user has not yet occurred. `event_scheduler` refers to the thread that monitors scheduled events (see Section 27.5, “Using the Event Scheduler”).

  Note

  A `USER` value of `system user` is distinct from the `SYSTEM_USER` privilege. The former designates internal threads. The latter distinguishes the system user and regular user account categories (see Section 8.2.11, “Account Categories”).

* `HOST`

  The host name of the client issuing the statement (except for `system user`, for which there is no host). The host name for TCP/IP connections is reported in `host_name:client_port` format to make it easier to determine which client is doing what.

* `DB`

  The default database for the thread, or `NULL` if none has been selected.

* `COMMAND`

  The type of command the thread is executing on behalf of the client, or `Sleep` if the session is idle. For descriptions of thread commands, see Section 10.14, “Examining Server Thread (Process) Information” Information"). The value of this column corresponds to the `COM_xxx` commands of the client/server protocol and `Com_xxx` status variables. See Section 7.1.10, “Server Status Variables”.

* `TIME`

  The time in seconds that the thread has been in its current state. For a replica SQL thread, the value is the number of seconds between the timestamp of the last replicated event and the real time of the replica host. See Section 19.2.3, “Replication Threads”.

* `STATE`

  An action, event, or state that indicates what the thread is doing. For descriptions of `STATE` values, see Section 10.14, “Examining Server Thread (Process) Information” Information").

  Most states correspond to very quick operations. If a thread stays in a given state for many seconds, there might be a problem that needs to be investigated.

* `INFO`

  The statement the thread is executing, or `NULL` if it is executing no statement. The statement might be the one sent to the server, or an innermost statement if the statement executes other statements. For example, if a `CALL` statement executes a stored procedure that is executing a `SELECT` statement, the `INFO` value shows the `SELECT` statement.

#### Notes

* `PROCESSLIST` is a nonstandard `INFORMATION_SCHEMA` table.

* Like the output from the [`SHOW PROCESSLIST`](show-processlist.html "15.7.7.32 SHOW PROCESSLIST Statement") statement, the `PROCESSLIST` table provides information about all threads, even those belonging to other users, if you have the `PROCESS` privilege. Otherwise (without the `PROCESS` privilege), nonanonymous users have access to information about their own threads but not threads for other users, and anonymous users have no access to thread information.

* If an SQL statement refers to the `PROCESSLIST` table, MySQL populates the entire table once, when statement execution begins, so there is read consistency during the statement. There is no read consistency for a multi-statement transaction.

The following statements are equivalent:

```
SELECT * FROM INFORMATION_SCHEMA.PROCESSLIST

SHOW FULL PROCESSLIST
```

You can obtain information about use of this table by checking the values of the server status variables `Deprecated_use_i_s_processlist_count` and `Deprecated_use_i_s_processlist_last_timestamp`. `Deprecated_use_i_s_processlist_count` shows the number of times the `PROCESSLIST` table has been accessed since the last server restart; `Deprecated_use_i_s_processlist_last_timestamp` provides the last time the table was accessed, as a Unix timestamp.


### 28.3.29 The INFORMATION\_SCHEMA PROFILING Table

The `PROFILING` table provides statement profiling information. Its contents correspond to the information produced by the [`SHOW PROFILE`](show-profile.html "15.7.7.33 SHOW PROFILE Statement") and `SHOW PROFILES` statements (see Section 15.7.7.33, “SHOW PROFILE Statement”). The table is empty unless the `profiling` session variable is set to 1.

Note

This table is deprecated; expect it to be removed in a future MySQL release. Use the Performance Schema instead; see Section 29.19.1, “Query Profiling Using Performance Schema”.

The `PROFILING` table has these columns:

* `QUERY_ID`

  A numeric statement identifier.

* `SEQ`

  A sequence number indicating the display order for rows with the same `QUERY_ID` value.

* `STATE`

  The profiling state to which the row measurements apply.

* `DURATION`

  How long statement execution remained in the given state, in seconds.

* `CPU_USER`, `CPU_SYSTEM`

  User and system CPU use, in seconds.

* `CONTEXT_VOLUNTARY`, `CONTEXT_INVOLUNTARY`

  How many voluntary and involuntary context switches occurred.

* `BLOCK_OPS_IN`, `BLOCK_OPS_OUT`

  The number of block input and output operations.

* `MESSAGES_SENT`, `MESSAGES_RECEIVED`

  The number of communication messages sent and received.

* `PAGE_FAULTS_MAJOR`, `PAGE_FAULTS_MINOR`

  The number of major and minor page faults.

* `SWAPS`

  How many swaps occurred.

* `SOURCE_FUNCTION`, `SOURCE_FILE`, and `SOURCE_LINE`

  Information indicating where in the source code the profiled state executes.

#### Notes

* `PROFILING` is a nonstandard `INFORMATION_SCHEMA` table.

Profiling information is also available from the `SHOW PROFILE` and `SHOW PROFILES` statements. See Section 15.7.7.33, “SHOW PROFILE Statement”. For example, the following queries are equivalent:

```
SHOW PROFILE FOR QUERY 2;

SELECT STATE, FORMAT(DURATION, 6) AS DURATION
FROM INFORMATION_SCHEMA.PROFILING
WHERE QUERY_ID = 2 ORDER BY SEQ;
```


### 28.3.30 The INFORMATION\_SCHEMA REFERENTIAL\_CONSTRAINTS Table

The `REFERENTIAL_CONSTRAINTS` table provides information about foreign keys.

The `REFERENTIAL_CONSTRAINTS` table has these columns:

* `CONSTRAINT_CATALOG`

  The name of the catalog to which the constraint belongs. This value is always `def`.

* `CONSTRAINT_SCHEMA`

  The name of the schema (database) to which the constraint belongs.

* `CONSTRAINT_NAME`

  The name of the constraint.

* `UNIQUE_CONSTRAINT_CATALOG`

  The name of the catalog containing the unique constraint that the constraint references. This value is always `def`.

* `UNIQUE_CONSTRAINT_SCHEMA`

  The name of the schema containing the unique constraint that the constraint references.

* `UNIQUE_CONSTRAINT_NAME`

  The name of the unique constraint that the constraint references.

* `MATCH_OPTION`

  The value of the constraint `MATCH` attribute. The only valid value at this time is `NONE`.

* `UPDATE_RULE`

  The value of the constraint `ON UPDATE` attribute. The possible values are `CASCADE`, `SET NULL`, `SET DEFAULT`, `RESTRICT`, `NO ACTION`.

* `DELETE_RULE`

  The value of the constraint `ON DELETE` attribute. The possible values are `CASCADE`, `SET NULL`, `SET DEFAULT`, `RESTRICT`, `NO ACTION`.

* `TABLE_NAME`

  The name of the table. This value is the same as in the `TABLE_CONSTRAINTS` table.

* `REFERENCED_TABLE_NAME`

  The name of the table referenced by the constraint.


### 28.3.31 The INFORMATION\_SCHEMA RESOURCE\_GROUPS Table

The `RESOURCE_GROUPS` table provides access to information about resource groups. For general discussion of the resource group capability, see Section 7.1.16, “Resource Groups”.

You can see information only for columns for which you have some privilege.

The `RESOURCE_GROUPS` table has these columns:

* `RESOURCE_GROUP_NAME`

  The name of the resource group.

* `RESOURCE_GROUP_TYPE`

  The resource group type, either `SYSTEM` or `USER`.

* `RESOURCE_GROUP_ENABLED`

  Whether the resource group is enabled (1) or disabled (0);

* `VCPU_IDS`

  The CPU affinity; that is, the set of virtual CPUs that the resource group can use. The value is a list of comma-separated CPU numbers or ranges.

* `THREAD_PRIORITY`

  The priority for threads assigned to the resource group. The priority ranges from -20 (highest priority) to 19 (lowest priority). System resource groups have a priority that ranges from -20 to 0. User resource groups have a priority that ranges from 0 to 19.


### 28.3.32 The INFORMATION\_SCHEMA ROLE\_COLUMN\_GRANTS Table

The `ROLE_COLUMN_GRANTS` table provides information about the column privileges for roles that are available to or granted by the currently enabled roles.

The `ROLE_COLUMN_GRANTS` table has these columns:

* `GRANTOR`

  The user name part of the account that granted the role.

* `GRANTOR_HOST`

  The host name part of the account that granted the role.

* `GRANTEE`

  The user name part of the account to which the role is granted.

* `GRANTEE_HOST`

  The host name part of the account to which the role is granted.

* `TABLE_CATALOG`

  The name of the catalog to which the role applies. This value is always `def`.

* `TABLE_SCHEMA`

  The name of the schema (database) to which the role applies.

* `TABLE_NAME`

  The name of the table to which the role applies.

* `COLUMN_NAME`

  The name of the column to which the role applies.

* `PRIVILEGE_TYPE`

  The privilege granted. The value can be any privilege that can be granted at the column level; see Section 15.7.1.6, “GRANT Statement”. Each row lists a single privilege, so there is one row per column privilege held by the grantee.

* `IS_GRANTABLE`

  `YES` or `NO`, depending on whether the role is grantable to other accounts.


### 28.3.33 The INFORMATION\_SCHEMA ROLE\_ROUTINE\_GRANTS Table

The `ROLE_ROUTINE_GRANTS` table provides information about the routine privileges for roles that are available to or granted by the currently enabled roles.

The `ROLE_ROUTINE_GRANTS` table has these columns:

* `GRANTOR`

  The user name part of the account that granted the role.

* `GRANTOR_HOST`

  The host name part of the account that granted the role.

* `GRANTEE`

  The user name part of the account to which the role is granted.

* `GRANTEE_HOST`

  The host name part of the account to which the role is granted.

* `SPECIFIC_CATALOG`

  The name of the catalog to which the routine belongs. This value is always `def`.

* `SPECIFIC_SCHEMA`

  The name of the schema (database) to which the routine belongs.

* `SPECIFIC_NAME`

  The name of the routine.

* `ROUTINE_CATALOG`

  The name of the catalog to which the routine belongs. This value is always `def`.

* `ROUTINE_SCHEMA`

  The name of the schema (database) to which the routine belongs.

* `ROUTINE_NAME`

  The name of the routine.

* `PRIVILEGE_TYPE`

  The privilege granted. The value can be any privilege that can be granted at the routine level; see Section 15.7.1.6, “GRANT Statement”. Each row lists a single privilege, so there is one row per column privilege held by the grantee.

* `IS_GRANTABLE`

  `YES` or `NO`, depending on whether the role is grantable to other accounts.


### 28.3.34 The INFORMATION\_SCHEMA ROLE\_TABLE\_GRANTS Table

The `ROLE_TABLE_GRANTS` table provides information about the table privileges for roles that are available to or granted by the currently enabled roles.

The `ROLE_TABLE_GRANTS` table has these columns:

* `GRANTOR`

  The user name part of the account that granted the role.

* `GRANTOR_HOST`

  The host name part of the account that granted the role.

* `GRANTEE`

  The user name part of the account to which the role is granted.

* `GRANTEE_HOST`

  The host name part of the account to which the role is granted.

* `TABLE_CATALOG`

  The name of the catalog to which the role applies. This value is always `def`.

* `TABLE_SCHEMA`

  The name of the schema (database) to which the role applies.

* `TABLE_NAME`

  The name of the table to which the role applies.

* `PRIVILEGE_TYPE`

  The privilege granted. The value can be any privilege that can be granted at the table level; see Section 15.7.1.6, “GRANT Statement”. Each row lists a single privilege, so there is one row per column privilege held by the grantee.

* `IS_GRANTABLE`

  `YES` or `NO`, depending on whether the role is grantable to other accounts.


### 28.3.35 The INFORMATION\_SCHEMA ROUTINE\_LIBRARIES Table

The `ROUTINE_LIBRARIES` table lists different JavaScript routines and the libraries supported by MLE Component (see Section 7.5.7, “Multilingual Engine Component (MLE)”")) that are imported by these JavaScript routines.

The `ROUTINE_LIBRARIES` table has the columns listed here:

* `ROUTINE_CATALOG`

  Routine catalog name. Currently, this is always `def`.

* `ROUTINE_SCHEMA`

  Routine schema or database.

* `ROUTINE_NAME`

  Name of the routine.

* `ROUTINE_TYPE`

  Type of routine. One of `FUNCTION`, `PROCEDURE`, or `LIBRARY`.

* `LIBRARY_CATALOG`

  Library catalog name. Currently, this is always `def`.

* `LIBRARY_SCHEMA`

  Library database or schema.

* `LIBRARY_NAME`

  Library name.

* `LIBRARY_VERSION`

  Library version.

Example:

```
mysql> TABLE information_schema.ROUTINE_LIBRARIES\G
*************************** 1. row ***************************
ROUTINE_CATALOG: def
 ROUTINE_SCHEMA: jslib
   ROUTINE_NAME: foo
   ROUTINE_TYPE: FUNCTION
LIBRARY_CATALOG: def
 LIBRARY_SCHEMA: jslib
   LIBRARY_NAME: lib1
LIBRARY_VERSION: NULL
*************************** 2. row ***************************
ROUTINE_CATALOG: def
 ROUTINE_SCHEMA: jslib
   ROUTINE_NAME: foo
   ROUTINE_TYPE: FUNCTION
LIBRARY_CATALOG: def
 LIBRARY_SCHEMA: jslib
   LIBRARY_NAME: lib2
LIBRARY_VERSION: NULL
2 rows in set (0.00 sec)
```

All stored routines importing libraries are listed in the `ROUTINE_LIBRARIES` table even if the referenced Library does not exist.


### 28.3.36 The INFORMATION\_SCHEMA ROUTINES Table

The `ROUTINES` table provides information about stored routines (stored procedures and stored functions). The `ROUTINES` table does not include built-in (native) functions or loadable functions.

The `ROUTINES` table has these columns:

* `SPECIFIC_NAME`

  The name of the routine.

* `ROUTINE_CATALOG`

  The name of the catalog to which the routine belongs. This value is always `def`.

* `ROUTINE_SCHEMA`

  The name of the schema (database) to which the routine belongs.

* `ROUTINE_NAME`

  The name of the routine.

* `ROUTINE_TYPE`

  `PROCEDURE` for stored procedures, `FUNCTION` for stored functions.

* `DATA_TYPE`

  If the routine is a stored function, the return value data type. If the routine is a stored procedure, this value is empty.

  The `DATA_TYPE` value is the type name only with no other information. The `DTD_IDENTIFIER` value contains the type name and possibly other information such as the precision or length.

* `CHARACTER_MAXIMUM_LENGTH`

  For stored function string return values, the maximum length in characters. If the routine is a stored procedure, this value is `NULL`.

* `CHARACTER_OCTET_LENGTH`

  For stored function string return values, the maximum length in bytes. If the routine is a stored procedure, this value is `NULL`.

* `NUMERIC_PRECISION`

  For stored function numeric return values, the numeric precision. If the routine is a stored procedure, this value is `NULL`.

* `NUMERIC_SCALE`

  For stored function numeric return values, the numeric scale. If the routine is a stored procedure, this value is `NULL`.

* `DATETIME_PRECISION`

  For stored function temporal return values, the fractional seconds precision. If the routine is a stored procedure, this value is `NULL`.

* `CHARACTER_SET_NAME`

  For stored function character string return values, the character set name. If the routine is a stored procedure, this value is `NULL`.

* `COLLATION_NAME`

  For stored function character string return values, the collation name. If the routine is a stored procedure, this value is `NULL`.

* `DTD_IDENTIFIER`

  If the routine is a stored function, the return value data type. If the routine is a stored procedure, this value is empty.

  The `DATA_TYPE` value is the type name only with no other information. The `DTD_IDENTIFIER` value contains the type name and possibly other information such as the precision or length.

* `ROUTINE_BODY`

  The language used for the routine definition. This value is always `SQL`.

* `ROUTINE_DEFINITION`

  The text of the SQL statement executed by the routine.

* `EXTERNAL_NAME`

  This value is always `NULL`.

* `EXTERNAL_LANGUAGE`

  The language of the stored routine. The value is read from the `external_language` column of the `mysql.routines` data dictionary table.

* `PARAMETER_STYLE`

  This value is always `SQL`.

* `IS_DETERMINISTIC`

  `YES` or `NO`, depending on whether the routine is defined with the `DETERMINISTIC` characteristic.

* `SQL_DATA_ACCESS`

  The data access characteristic for the routine. The value is one of `CONTAINS SQL`, `NO SQL`, `READS SQL DATA`, or `MODIFIES SQL DATA`.

* `SQL_PATH`

  This value is always `NULL`.

* `SECURITY_TYPE`

  The routine `SQL SECURITY` characteristic. The value is one of `DEFINER` or `INVOKER`.

* `CREATED`

  The date and time when the routine was created. This is a `TIMESTAMP` value.

* `LAST_ALTERED`

  The date and time when the routine was last modified. This is a `TIMESTAMP` value. If the routine has not been modified since its creation, this value is the same as the `CREATED` value.

* `SQL_MODE`

  The SQL mode in effect when the routine was created or altered, and under which the routine executes. For the permitted values, see Section 7.1.11, “Server SQL Modes”.

* `ROUTINE_COMMENT`

  The text of the comment, if the routine has one. If not, this value is empty.

* `DEFINER`

  The account named in the `DEFINER` clause (often the user who created the routine), in `'user_name'@'host_name'` format.

* `CHARACTER_SET_CLIENT`

  The session value of the `character_set_client` system variable when the routine was created.

* `COLLATION_CONNECTION`

  The session value of the `collation_connection` system variable when the routine was created.

* `DATABASE_COLLATION`

  The collation of the database with which the routine is associated.

#### Notes

* To see information about a routine, you must be the user named as the routine `DEFINER`, have the `SHOW_ROUTINE` privilege, have the `SELECT` privilege at the global level, or have the [`CREATE ROUTINE`](privileges-provided.html#priv_create-routine), [`ALTER ROUTINE`](privileges-provided.html#priv_alter-routine), or `EXECUTE` privilege granted at a scope that includes the routine. The `ROUTINE_DEFINITION` column is `NULL` if you have only `CREATE ROUTINE`, `ALTER ROUTINE`, or `EXECUTE`.

* Information about stored function return values is also available in the `PARAMETERS` table. The return value row for a stored function can be identified as the row that has an `ORDINAL_POSITION` value of 0.


### 28.3.37 The INFORMATION\_SCHEMA SCHEMATA Table

A schema is a database, so the `SCHEMATA` table provides information about databases.

The `SCHEMATA` table has these columns:

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

* `DEFAULT_ENCRYPTION`

  The schema default encryption.

Schema names are also available from the [`SHOW DATABASES`](show-databases.html "15.7.7.16 SHOW DATABASES Statement") statement. See Section 15.7.7.16, “SHOW DATABASES Statement”. The following statements are equivalent:

```
SELECT SCHEMA_NAME AS `Database`
  FROM INFORMATION_SCHEMA.SCHEMATA
  [WHERE SCHEMA_NAME LIKE 'wild']

SHOW DATABASES
  [LIKE 'wild']
```

You see only those databases for which you have some kind of privilege, unless you have the global [`SHOW DATABASES`](show-databases.html "15.7.7.16 SHOW DATABASES Statement") privilege.

Caution

Because any static global privilege is considered a privilege for all databases, any static global privilege enables a user to see all database names with [`SHOW DATABASES`](show-databases.html "15.7.7.16 SHOW DATABASES Statement") or by examining the `SCHEMATA` table of `INFORMATION_SCHEMA`, except databases that have been restricted at the database level by partial revokes.

#### Notes

* The `SCHEMATA_EXTENSIONS` table augments the `SCHEMATA` table with information about schema options.


### 28.3.38 The INFORMATION\_SCHEMA SCHEMATA\_EXTENSIONS Table

The `SCHEMATA_EXTENSIONS` table augments the `SCHEMATA` table with information about schema options.

The `SCHEMATA_EXTENSIONS` table has these columns:

* `CATALOG_NAME`

  The name of the catalog to which the schema belongs. This value is always `def`.

* `SCHEMA_NAME`

  The name of the schema.

* `OPTIONS`

  The options for the schema. If the schema is read only, the value contains `READ ONLY=1`. If the schema is not read only, no `READ ONLY` option appears.

#### Example

```
mysql> ALTER SCHEMA mydb READ ONLY = 1;
mysql> SELECT * FROM INFORMATION_SCHEMA.SCHEMATA_EXTENSIONS
       WHERE SCHEMA_NAME = 'mydb';
+--------------+-------------+-------------+
| CATALOG_NAME | SCHEMA_NAME | OPTIONS     |
+--------------+-------------+-------------+
| def          | mydb        | READ ONLY=1 |
+--------------+-------------+-------------+

mysql> ALTER SCHEMA mydb READ ONLY = 0;
mysql> SELECT * FROM INFORMATION_SCHEMA.SCHEMATA_EXTENSIONS
       WHERE SCHEMA_NAME = 'mydb';
+--------------+-------------+---------+
| CATALOG_NAME | SCHEMA_NAME | OPTIONS |
+--------------+-------------+---------+
| def          | mydb        |         |
+--------------+-------------+---------+
```

#### Notes

* `SCHEMATA_EXTENSIONS` is a nonstandard `INFORMATION_SCHEMA` table.


### 28.3.39 The INFORMATION\_SCHEMA SCHEMA\_PRIVILEGES Table

The `SCHEMA_PRIVILEGES` table provides information about schema (database) privileges. It takes its values from the `mysql.db` system table.

The `SCHEMA_PRIVILEGES` table has these columns:

* `GRANTEE`

  The name of the account to which the privilege is granted, in `'user_name'@'host_name'` format.

* `TABLE_CATALOG`

  The name of the catalog to which the schema belongs. This value is always `def`.

* `TABLE_SCHEMA`

  The name of the schema.

* `PRIVILEGE_TYPE`

  The privilege granted. The value can be any privilege that can be granted at the schema level; see Section 15.7.1.6, “GRANT Statement”. Each row lists a single privilege, so there is one row per schema privilege held by the grantee.

* `IS_GRANTABLE`

  `YES` if the user has the `GRANT OPTION` privilege, `NO` otherwise. The output does not list `GRANT OPTION` as a separate row with `PRIVILEGE_TYPE='GRANT OPTION'`.

#### Notes

* `SCHEMA_PRIVILEGES` is a nonstandard `INFORMATION_SCHEMA` table.

The following statements are *not* equivalent:

```
SELECT ... FROM INFORMATION_SCHEMA.SCHEMA_PRIVILEGES

SHOW GRANTS ...
```


### 28.3.40 The INFORMATION\_SCHEMA STATISTICS Table

The `STATISTICS` table provides information about table indexes.

Columns in `STATISTICS` that represent table statistics hold cached values. The `information_schema_stats_expiry` system variable defines the period of time before cached table statistics expire. The default is 86400 seconds (24 hours). If there are no cached statistics or statistics have expired, statistics are retrieved from storage engines when querying table statistics columns. To update cached values at any time for a given table, use `ANALYZE TABLE`. To always retrieve the latest statistics directly from storage engines, set `information_schema_stats_expiry=0`. For more information, see Section 10.2.3, “Optimizing INFORMATION\_SCHEMA Queries”.

Note

If the `innodb_read_only` system variable is enabled, [`ANALYZE TABLE`](analyze-table.html "15.7.3.1 ANALYZE TABLE Statement") may fail because it cannot update statistics tables in the data dictionary, which use `InnoDB`. For [`ANALYZE TABLE`](analyze-table.html "15.7.3.1 ANALYZE TABLE Statement") operations that update the key distribution, failure may occur even if the operation updates the table itself (for example, if it is a `MyISAM` table). To obtain the updated distribution statistics, set `information_schema_stats_expiry=0`.

The `STATISTICS` table has these columns:

* `TABLE_CATALOG`

  The name of the catalog to which the table containing the index belongs. This value is always `def`.

* `TABLE_SCHEMA`

  The name of the schema (database) to which the table containing the index belongs.

* `TABLE_NAME`

  The name of the table containing the index.

* `NON_UNIQUE`

  0 if the index cannot contain duplicates, 1 if it can.

* `INDEX_SCHEMA`

  The name of the schema (database) to which the index belongs.

* `INDEX_NAME`

  The name of the index. If the index is the primary key, the name is always `PRIMARY`.

* `SEQ_IN_INDEX`

  The column sequence number in the index, starting with 1.

* `COLUMN_NAME`

  The column name. See also the description for the `EXPRESSION` column.

* `COLLATION`

  How the column is sorted in the index. This can have values `A` (ascending), `D` (descending), or `NULL` (not sorted).

* `CARDINALITY`

  An estimate of the number of unique values in the index. To update this number, run [`ANALYZE TABLE`](analyze-table.html "15.7.3.1 ANALYZE TABLE Statement") or (for `MyISAM` tables) **myisamchk -a**.

  `CARDINALITY` is counted based on statistics stored as integers, so the value is not necessarily exact even for small tables. The higher the cardinality, the greater the chance that MySQL uses the index when doing joins.

* `SUB_PART`

  The index prefix. That is, the number of indexed characters if the column is only partly indexed, `NULL` if the entire column is indexed.

  Note

  Prefix *limits* are measured in bytes. However, prefix *lengths* for index specifications in [`CREATE TABLE`](create-table.html "15.1.24 CREATE TABLE Statement"), `ALTER TABLE`, and `CREATE INDEX` statements are interpreted as number of characters for nonbinary string types (`CHAR`, `VARCHAR`, `TEXT`) and number of bytes for binary string types (`BINARY`, `VARBINARY`, `BLOB`). Take this into account when specifying a prefix length for a nonbinary string column that uses a multibyte character set.

  For additional information about index prefixes, see Section 10.3.5, “Column Indexes”, and Section 15.1.18, “CREATE INDEX Statement”.

* `PACKED`

  Indicates how the key is packed. `NULL` if it is not.

* `NULLABLE`

  Contains `YES` if the column may contain `NULL` values and `''` if not.

* `INDEX_TYPE`

  The index method used (`BTREE`, `FULLTEXT`, `HASH`, `RTREE`).

* `COMMENT`

  Information about the index not described in its own column, such as `disabled` if the index is disabled.

* `INDEX_COMMENT`

  Any comment provided for the index with a `COMMENT` attribute when the index was created.

* `IS_VISIBLE`

  Whether the index is visible to the optimizer. See Section 10.3.12, “Invisible Indexes”.

* `EXPRESSION`

  MySQL supports functional key parts (see Functional Key Parts), which affects both the `COLUMN_NAME` and `EXPRESSION` columns:

  + For a nonfunctional key part, `COLUMN_NAME` indicates the column indexed by the key part and `EXPRESSION` is `NULL`.

  + For a functional key part, `COLUMN_NAME` column is `NULL` and `EXPRESSION` indicates the expression for the key part.

#### Notes

* There is no standard `INFORMATION_SCHEMA` table for indexes. The MySQL column list is similar to what SQL Server 2000 returns for `sp_statistics`, except that `QUALIFIER` and `OWNER` are replaced with `CATALOG` and `SCHEMA`, respectively.

Information about table indexes is also available from the `SHOW INDEX` statement. See Section 15.7.7.24, “SHOW INDEX Statement”. The following statements are equivalent:

```
SELECT * FROM INFORMATION_SCHEMA.STATISTICS
  WHERE table_name = 'tbl_name'
  AND table_schema = 'db_name'

SHOW INDEX
  FROM tbl_name
  FROM db_name
```

Information about generated invisible primary key columns is visible in this table by default. You can cause such information to be hidden by setting [`show_gipk_in_create_table_and_information_schema = OFF`](server-system-variables.html#sysvar_show_gipk_in_create_table_and_information_schema). For more information, see Section 15.1.24.11, “Generated Invisible Primary Keys”.


### 28.3.41 The INFORMATION\_SCHEMA ST\_GEOMETRY\_COLUMNS Table

The `ST_GEOMETRY_COLUMNS` table provides information about table columns that store spatial data. This table is based on the SQL/MM (ISO/IEC 13249-3) standard, with extensions as noted. MySQL implements `ST_GEOMETRY_COLUMNS` as a view on the `INFORMATION_SCHEMA` `COLUMNS` table.

The `ST_GEOMETRY_COLUMNS` table has these columns:

* `TABLE_CATALOG`

  The name of the catalog to which the table containing the column belongs. This value is always `def`.

* `TABLE_SCHEMA`

  The name of the schema (database) to which the table containing the column belongs.

* `TABLE_NAME`

  The name of the table containing the column.

* `COLUMN_NAME`

  The name of the column.

* `SRS_NAME`

  The spatial reference system (SRS) name.

* `SRS_ID`

  The spatial reference system ID (SRID).

* `GEOMETRY_TYPE_NAME`

  The column data type. Permitted values are: `geometry`, `point`, `linestring`, `polygon`, `multipoint`, `multilinestring`, `multipolygon`, `geometrycollection`. This column is a MySQL extension to the standard.


### 28.3.42 The INFORMATION\_SCHEMA ST\_SPATIAL\_REFERENCE\_SYSTEMS Table

The `ST_SPATIAL_REFERENCE_SYSTEMS` table provides information about available spatial reference systems (SRSs) for spatial data. This table is based on the SQL/MM (ISO/IEC 13249-3) standard.

Entries in the `ST_SPATIAL_REFERENCE_SYSTEMS` table are based on the [European Petroleum Survey Group](http://epsg.org) (EPSG) data set, except for SRID 0, which corresponds to a special SRS used in MySQL that represents an infinite flat Cartesian plane with no units assigned to its axes. For additional information about SRSs, see Section 13.4.5, “Spatial Reference System Support”.

The `ST_SPATIAL_REFERENCE_SYSTEMS` table has these columns:

* `SRS_NAME`

  The spatial reference system name. This value is unique.

* `SRS_ID`

  The spatial reference system numeric ID. This value is unique.

  `SRS_ID` values represent the same kind of values as the SRID of geometry values or passed as the SRID argument to spatial functions. SRID 0 (the unitless Cartesian plane) is special. It is always a legal spatial reference system ID and can be used in any computations on spatial data that depend on SRID values.

* `ORGANIZATION`

  The name of the organization that defined the coordinate system on which the spatial reference system is based.

* `ORGANIZATION_COORDSYS_ID`

  The numeric ID given to the spatial reference system by the organization that defined it.

* `DEFINITION`

  The spatial reference system definition. `DEFINITION` values are WKT values, represented as specified in the [Open Geospatial Consortium](http://www.opengeospatial.org) document [OGC 12-063r5](http://docs.opengeospatial.org/is/12-063r5/12-063r5.html).

  SRS definition parsing occurs on demand when definitions are needed by GIS functions. Parsed definitions are stored in the data dictionary cache to enable reuse and avoid incurring parsing overhead for every statement that needs SRS information.

* `DESCRIPTION`

  The spatial reference system description.

#### Notes

* The `SRS_NAME`, `ORGANIZATION`, `ORGANIZATION_COORDSYS_ID`, and `DESCRIPTION` columns contain information that may be of interest to users, but they are not used by MySQL.

#### Example

```
mysql> SELECT * FROM ST_SPATIAL_REFERENCE_SYSTEMS
       WHERE SRS_ID = 4326\G
*************************** 1. row ***************************
                SRS_NAME: WGS 84
                  SRS_ID: 4326
            ORGANIZATION: EPSG
ORGANIZATION_COORDSYS_ID: 4326
              DEFINITION: GEOGCS["WGS 84",DATUM["World Geodetic System 1984",
                          SPHEROID["WGS 84",6378137,298.257223563,
                          AUTHORITY["EPSG","7030"]],AUTHORITY["EPSG","6326"]],
                          PRIMEM["Greenwich",0,AUTHORITY["EPSG","8901"]],
                          UNIT["degree",0.017453292519943278,
                          AUTHORITY["EPSG","9122"]],
                          AXIS["Lat",NORTH],AXIS["Long",EAST],
                          AUTHORITY["EPSG","4326"]]
             DESCRIPTION:
```

This entry describes the SRS used for GPS systems. It has a name (`SRS_NAME`) of WGS 84 and an ID (`SRS_ID`) of 4326, which is the ID used by the [European Petroleum Survey Group](http://epsg.org) (EPSG).

The `DEFINITION` values for projected and geographic SRSs begin with `PROJCS` and `GEOGCS`, respectively. The definition for SRID 0 is special and has an empty `DEFINITION` value. The following query determines how many entries in the `ST_SPATIAL_REFERENCE_SYSTEMS` table correspond to projected, geographic, and other SRSs, based on `DEFINITION` values:

```
mysql> SELECT
         COUNT(*),
         CASE LEFT(DEFINITION, 6)
           WHEN 'PROJCS' THEN 'Projected'
           WHEN 'GEOGCS' THEN 'Geographic'
           ELSE 'Other'
         END AS SRS_TYPE
       FROM INFORMATION_SCHEMA.ST_SPATIAL_REFERENCE_SYSTEMS
       GROUP BY SRS_TYPE;
+----------+------------+
| COUNT(*) | SRS_TYPE   |
+----------+------------+
|        1 | Other      |
|     4668 | Projected  |
|      483 | Geographic |
+----------+------------+
```

To enable manipulation of SRS entries stored in the data dictionary, MySQL provides these SQL statements:

* [`CREATE SPATIAL REFERENCE SYSTEM`](create-spatial-reference-system.html "15.1.23 CREATE SPATIAL REFERENCE SYSTEM Statement"): See Section 15.1.23, “CREATE SPATIAL REFERENCE SYSTEM Statement”. The description for this statement includes additional information about SRS components.

* `DROP SPATIAL REFERENCE SYSTEM`: See Section 15.1.36, “DROP SPATIAL REFERENCE SYSTEM Statement”.


### 28.3.43 The INFORMATION\_SCHEMA ST\_UNITS\_OF\_MEASURE Table

The `ST_UNITS_OF_MEASURE` table provides information about acceptable units for the `ST_Distance()` function.

The `ST_UNITS_OF_MEASURE` table has these columns:

* `UNIT_NAME`

  The name of the unit.

* `UNIT_TYPE`

  The unit type (for example, `LINEAR`).

* `CONVERSION_FACTOR`

  A conversion factor used for internal calculations.

* `DESCRIPTION`

  A description of the unit.


### 28.3.44 The INFORMATION\_SCHEMA TABLES Table

The `TABLES` table provides information about tables in databases.

Columns in `TABLES` that represent table statistics hold cached values. The `information_schema_stats_expiry` system variable defines the period of time before cached table statistics expire. The default is 86400 seconds (24 hours). If there are no cached statistics or statistics have expired, statistics are retrieved from storage engines when querying table statistics columns. To update cached values at any time for a given table, use `ANALYZE TABLE`. To always retrieve the latest statistics directly from storage engines, set `information_schema_stats_expiry` to `0`. For more information, see Section 10.2.3, “Optimizing INFORMATION\_SCHEMA Queries”.

Note

If the `innodb_read_only` system variable is enabled, [`ANALYZE TABLE`](analyze-table.html "15.7.3.1 ANALYZE TABLE Statement") may fail because it cannot update statistics tables in the data dictionary, which use `InnoDB`. For [`ANALYZE TABLE`](analyze-table.html "15.7.3.1 ANALYZE TABLE Statement") operations that update the key distribution, failure may occur even if the operation updates the table itself (for example, if it is a `MyISAM` table). To obtain the updated distribution statistics, set `information_schema_stats_expiry=0`.

The `TABLES` table has these columns:

* `TABLE_CATALOG`

  The name of the catalog to which the table belongs. This value is always `def`.

* `TABLE_SCHEMA`

  The name of the schema (database) to which the table belongs.

* `TABLE_NAME`

  The name of the table.

* `TABLE_TYPE`

  `BASE TABLE` for a table, `VIEW` for a view, or `SYSTEM VIEW` for an `INFORMATION_SCHEMA` table.

  The `TABLES` table does not list `TEMPORARY` tables.

* `ENGINE`

  The storage engine for the table. See Chapter 17, *The InnoDB Storage Engine*, and Chapter 18, *Alternative Storage Engines*.

  For partitioned tables, `ENGINE` shows the name of the storage engine used by all partitions.

* `VERSION`

  This column is unused. With the removal of `.frm` files in MySQL 8.0, this column now reports a hardcoded value of `10`, which is the last `.frm` file version used in MySQL 5.7.

* `ROW_FORMAT`

  The row-storage format (`Fixed`, `Dynamic`, `Compressed`, `Redundant`, `Compact`). For `MyISAM` tables, `Dynamic` corresponds to what **myisamchk -dvv** reports as `Packed`.

* `TABLE_ROWS`

  The number of rows. Some storage engines, such as `MyISAM`, store the exact count. For other storage engines, such as `InnoDB`, this value is an approximation, and may vary from the actual value by as much as 40% to 50%. In such cases, use `SELECT COUNT(*)` to obtain an accurate count.

  `TABLE_ROWS` is `NULL` for `INFORMATION_SCHEMA` tables.

  For `InnoDB` tables, the row count is only a rough estimate used in SQL optimization. (This is also true if the `InnoDB` table is partitioned.)

* `AVG_ROW_LENGTH`

  The average row length.

* `DATA_LENGTH`

  For `MyISAM`, `DATA_LENGTH` is the length of the data file, in bytes.

  For `InnoDB`, `DATA_LENGTH` is the approximate amount of space allocated for the clustered index, in bytes. Specifically, it is the clustered index size, in pages, multiplied by the `InnoDB` page size.

  Refer to the notes at the end of this section for information regarding other storage engines.

* `MAX_DATA_LENGTH`

  For `MyISAM`, `MAX_DATA_LENGTH` is maximum length of the data file. This is the total number of bytes of data that can be stored in the table, given the data pointer size used.

  Unused for `InnoDB`.

  Refer to the notes at the end of this section for information regarding other storage engines.

* `INDEX_LENGTH`

  For `MyISAM`, `INDEX_LENGTH` is the length of the index file, in bytes.

  For `InnoDB`, `INDEX_LENGTH` is the approximate amount of space allocated for non-clustered indexes, in bytes. Specifically, it is the sum of non-clustered index sizes, in pages, multiplied by the `InnoDB` page size.

  Refer to the notes at the end of this section for information regarding other storage engines.

* `DATA_FREE`

  The number of allocated but unused bytes.

  `InnoDB` tables report the free space of the tablespace to which the table belongs. For a table located in the shared tablespace, this is the free space of the shared tablespace. If you are using multiple tablespaces and the table has its own tablespace, the free space is for only that table. Free space means the number of bytes in completely free extents minus a safety margin. Even if free space displays as 0, it may be possible to insert rows as long as new extents need not be allocated.

  For NDB Cluster, `DATA_FREE` shows the space allocated on disk for, but not used by, a Disk Data table or fragment on disk. (In-memory data resource usage is reported by the `DATA_LENGTH` column.)

  For partitioned tables, this value is only an estimate and may not be absolutely correct. A more accurate method of obtaining this information in such cases is to query the `INFORMATION_SCHEMA` `PARTITIONS` table, as shown in this example:

  ```
  SELECT SUM(DATA_FREE)
      FROM  INFORMATION_SCHEMA.PARTITIONS
      WHERE TABLE_SCHEMA = 'mydb'
      AND   TABLE_NAME   = 'mytable';
  ```

  For more information, see Section 28.3.26, “The INFORMATION\_SCHEMA PARTITIONS Table”.

* `AUTO_INCREMENT`

  The next `AUTO_INCREMENT` value.

* `CREATE_TIME`

  When the table was created.

* `UPDATE_TIME`

  When the table was last updated. For some storage engines, this value is `NULL`. Even with file-per-table mode with each `InnoDB` table in a separate `.ibd` file, change buffering can delay the write to the data file, so the file modification time is different from the time of the last insert, update, or delete. For `MyISAM`, the data file timestamp is used; however, on Windows the timestamp is not updated by updates, so the value is inaccurate.

  `UPDATE_TIME` displays a timestamp value for the last `UPDATE`, `INSERT`, or `DELETE` performed on `InnoDB` tables that are not partitioned. For MVCC, the timestamp value reflects the `COMMIT` time, which is considered the last update time. Timestamps are not persisted when the server is restarted or when the table is evicted from the `InnoDB` data dictionary cache.

* `CHECK_TIME`

  When the table was last checked. Not all storage engines update this time, in which case, the value is always `NULL`.

  For partitioned `InnoDB` tables, `CHECK_TIME` is always `NULL`.

* `TABLE_COLLATION`

  The table default collation. The output does not explicitly list the table default character set, but the collation name begins with the character set name.

* `CHECKSUM`

  The live checksum value, if any.

* `CREATE_OPTIONS`

  Extra options used with [`CREATE TABLE`](create-table.html "15.1.24 CREATE TABLE Statement").

  `CREATE_OPTIONS` shows `partitioned` for a partitioned table.

  `CREATE_OPTIONS` shows the `ENCRYPTION` clause specified for tables created in file-per-table tablespaces. It shows the encryption clause for file-per-table tablespaces if the table is encrypted or if the specified encryption differs from the schema encryption. The encryption clause is not shown for tables created in general tablespaces. To identify encrypted file-per-table and general tablespaces, query the `INNODB_TABLESPACES` `ENCRYPTION` column.

  When creating a table with strict mode disabled, the storage engine's default row format is used if the specified row format is not supported. The actual row format of the table is reported in the `ROW_FORMAT` column. `CREATE_OPTIONS` shows the row format that was specified in the [`CREATE TABLE`](create-table.html "15.1.24 CREATE TABLE Statement") statement.

  When altering the storage engine of a table, table options that are not applicable to the new storage engine are retained in the table definition to enable reverting the table with its previously defined options to the original storage engine, if necessary. The `CREATE_OPTIONS` column may show retained options.

* `TABLE_COMMENT`

  The comment used when creating the table (or information as to why MySQL could not access the table information).

#### Notes

* For `NDB` tables, the output of this statement shows appropriate values for the `AVG_ROW_LENGTH` and `DATA_LENGTH` columns, with the exception that `BLOB` columns are not taken into account.

* For `NDB` tables, `DATA_LENGTH` includes data stored in main memory only; the `MAX_DATA_LENGTH` and `DATA_FREE` columns apply to Disk Data.

* For NDB Cluster Disk Data tables, `MAX_DATA_LENGTH` shows the space allocated for the disk part of a Disk Data table or fragment. (In-memory data resource usage is reported by the `DATA_LENGTH` column.)

* For `MEMORY` tables, the `DATA_LENGTH`, `MAX_DATA_LENGTH`, and `INDEX_LENGTH` values approximate the actual amount of allocated memory. The allocation algorithm reserves memory in large amounts to reduce the number of allocation operations.

* For views, most `TABLES` columns are 0 or `NULL` except that `TABLE_NAME` indicates the view name, `CREATE_TIME` indicates the creation time, and `TABLE_COMMENT` says `VIEW`.

Table information is also available from the `SHOW TABLE STATUS` and `SHOW TABLES` statements. See Section 15.7.7.39, “SHOW TABLE STATUS Statement”, and Section 15.7.7.40, “SHOW TABLES Statement”. The following statements are equivalent:

```
SELECT
    TABLE_NAME, ENGINE, VERSION, ROW_FORMAT, TABLE_ROWS, AVG_ROW_LENGTH,
    DATA_LENGTH, MAX_DATA_LENGTH, INDEX_LENGTH, DATA_FREE, AUTO_INCREMENT,
    CREATE_TIME, UPDATE_TIME, CHECK_TIME, TABLE_COLLATION, CHECKSUM,
    CREATE_OPTIONS, TABLE_COMMENT
  FROM INFORMATION_SCHEMA.TABLES
  WHERE table_schema = 'db_name'
  [AND table_name LIKE 'wild']

SHOW TABLE STATUS
  FROM db_name
  [LIKE 'wild']
```

The following statements are equivalent:

```
SELECT
  TABLE_NAME, TABLE_TYPE
  FROM INFORMATION_SCHEMA.TABLES
  WHERE table_schema = 'db_name'
  [AND table_name LIKE 'wild']

SHOW FULL TABLES
  FROM db_name
  [LIKE 'wild']
```


### 28.3.45 The INFORMATION\_SCHEMA TABLES\_EXTENSIONS Table

The `TABLES_EXTENSIONS` table provides information about table attributes defined for primary and secondary storage engines.

Note

The `TABLES_EXTENSIONS` table is reserved for future use.

The `TABLES_EXTENSIONS` table has these columns:

* `TABLE_CATALOG`

  The name of the catalog to which the table belongs. This value is always `def`.

* `TABLE_SCHEMA`

  The name of the schema (database) to which the table belongs.

* `TABLE_NAME`

  The name of the table.

* `ENGINE_ATTRIBUTE`

  Table attributes defined for the primary storage engine. Reserved for future use.

* `SECONDARY_ENGINE_ATTRIBUTE`

  Table attributes defined for the secondary storage engine. Reserved for future use.


### 28.3.46 The INFORMATION\_SCHEMA TABLESPACES\_EXTENSIONS Table

The `TABLESPACES_EXTENSIONS` table provides information about tablespace attributes defined for primary storage engines.

Note

The `TABLESPACES_EXTENSIONS` table is reserved for future use.

The `TABLESPACES_EXTENSIONS` table has these columns:

* `TABLESPACE_NAME`

  The name of the tablespace.

* `ENGINE_ATTRIBUTE`

  Tablespace attributes defined for the primary storage engine. Reserved for future use.


### 28.3.47 The INFORMATION\_SCHEMA TABLE\_CONSTRAINTS Table

The `TABLE_CONSTRAINTS` table describes which tables have constraints.

The `TABLE_CONSTRAINTS` table has these columns:

* `CONSTRAINT_CATALOG`

  The name of the catalog to which the constraint belongs. This value is always `def`.

* `CONSTRAINT_SCHEMA`

  The name of the schema (database) to which the constraint belongs.

* `CONSTRAINT_NAME`

  The name of the constraint.

* `TABLE_SCHEMA`

  The name of the schema (database) to which the table belongs.

* `TABLE_NAME`

  The name of the table.

* `CONSTRAINT_TYPE`

  The type of constraint. The value can be `UNIQUE`, `PRIMARY KEY`, `FOREIGN KEY` or `CHECK`. This is a `CHAR` (not `ENUM`) column.

  The `UNIQUE` and `PRIMARY KEY` information is about the same as what you get from the `Key_name` column in the output from `SHOW INDEX` when the `Non_unique` column is `0`.

* `ENFORCED`

  For `CHECK` constraints, the value is `YES` or `NO` to indicate whether the constraint is enforced. For other constraints, the value is always `YES`.


### 28.3.48 The INFORMATION\_SCHEMA TABLE\_CONSTRAINTS\_EXTENSIONS Table

The `TABLE_CONSTRAINTS_EXTENSIONS` table provides information about table constraint attributes defined for primary and secondary storage engines.

Note

The `TABLE_CONSTRAINTS_EXTENSIONS` table is reserved for future use.

The `TABLE_CONSTRAINTS_EXTENSIONS` table has these columns:

* `CONSTRAINT_CATALOG`

  The name of the catalog to which the table belongs.

* `CONSTRAINT_SCHEMA`

  The name of the schema (database) to which the table belongs.

* `CONSTRAINT_NAME`

  The name of the constraint.

* `TABLE_NAME`

  The name of the table.

* `ENGINE_ATTRIBUTE`

  Constraint attributes defined for the primary storage engine. Reserved for future use.

* `SECONDARY_ENGINE_ATTRIBUTE`

  Constraint attributes defined for the secondary storage engine. Reserved for future use.


### 28.3.49 The INFORMATION\_SCHEMA TABLE\_PRIVILEGES Table

The `TABLE_PRIVILEGES` table provides information about table privileges. It takes its values from the `mysql.tables_priv` system table.

The `TABLE_PRIVILEGES` table has these columns:

* `GRANTEE`

  The name of the account to which the privilege is granted, in `'user_name'@'host_name'` format.

* `TABLE_CATALOG`

  The name of the catalog to which the table belongs. This value is always `def`.

* `TABLE_SCHEMA`

  The name of the schema (database) to which the table belongs.

* `TABLE_NAME`

  The name of the table.

* `PRIVILEGE_TYPE`

  The privilege granted. The value can be any privilege that can be granted at the table level; see Section 15.7.1.6, “GRANT Statement”. Each row lists a single privilege, so there is one row per table privilege held by the grantee.

* `IS_GRANTABLE`

  `YES` if the user has the `GRANT OPTION` privilege, `NO` otherwise. The output does not list `GRANT OPTION` as a separate row with `PRIVILEGE_TYPE='GRANT OPTION'`.

#### Notes

* `TABLE_PRIVILEGES` is a nonstandard `INFORMATION_SCHEMA` table.

The following statements are *not* equivalent:

```
SELECT ... FROM INFORMATION_SCHEMA.TABLE_PRIVILEGES

SHOW GRANTS ...
```


### 28.3.50 The INFORMATION\_SCHEMA TRIGGERS Table

The `TRIGGERS` table provides information about triggers. To see information about a table's triggers, you must have the `TRIGGER` privilege for the table.

The `TRIGGERS` table has these columns:

* `TRIGGER_CATALOG`

  The name of the catalog to which the trigger belongs. This value is always `def`.

* `TRIGGER_SCHEMA`

  The name of the schema (database) to which the trigger belongs.

* `TRIGGER_NAME`

  The name of the trigger.

* `EVENT_MANIPULATION`

  The trigger event. This is the type of operation on the associated table for which the trigger activates. The value is `INSERT` (a row was inserted), `DELETE` (a row was deleted), or `UPDATE` (a row was modified).

* `EVENT_OBJECT_CATALOG`, `EVENT_OBJECT_SCHEMA`, and `EVENT_OBJECT_TABLE`

  As noted in Section 27.4, “Using Triggers”, every trigger is associated with exactly one table. These columns indicate the catalog and schema (database) in which this table occurs, and the table name, respectively. The `EVENT_OBJECT_CATALOG` value is always `def`.

* `ACTION_ORDER`

  The ordinal position of the trigger's action within the list of triggers on the same table with the same `EVENT_MANIPULATION` and `ACTION_TIMING` values.

* `ACTION_CONDITION`

  This value is always `NULL`.

* `ACTION_STATEMENT`

  The trigger body; that is, the statement executed when the trigger activates. This text uses UTF-8 encoding.

* `ACTION_ORIENTATION`

  This value is always `ROW`.

* `ACTION_TIMING`

  Whether the trigger activates before or after the triggering event. The value is `BEFORE` or `AFTER`.

* `ACTION_REFERENCE_OLD_TABLE`

  This value is always `NULL`.

* `ACTION_REFERENCE_NEW_TABLE`

  This value is always `NULL`.

* `ACTION_REFERENCE_OLD_ROW` and `ACTION_REFERENCE_NEW_ROW`

  The old and new column identifiers, respectively. The `ACTION_REFERENCE_OLD_ROW` value is always `OLD` and the `ACTION_REFERENCE_NEW_ROW` value is always `NEW`.

* `CREATED`

  The date and time when the trigger was created. This is a `TIMESTAMP(2)` value (with a fractional part in hundredths of seconds) for triggers.

* `SQL_MODE`

  The SQL mode in effect when the trigger was created, and under which the trigger executes. For the permitted values, see Section 7.1.11, “Server SQL Modes”.

* `DEFINER`

  The account named in the `DEFINER` clause (often the user who created the trigger), in `'user_name'@'host_name'` format.

* `CHARACTER_SET_CLIENT`

  The session value of the `character_set_client` system variable when the trigger was created.

* `COLLATION_CONNECTION`

  The session value of the `collation_connection` system variable when the trigger was created.

* `DATABASE_COLLATION`

  The collation of the database with which the trigger is associated.

#### Example

The following example uses the `ins_sum` trigger defined in Section 27.4, “Using Triggers”:

```
mysql> SELECT * FROM INFORMATION_SCHEMA.TRIGGERS
       WHERE TRIGGER_SCHEMA='test' AND TRIGGER_NAME='ins_sum'\G
*************************** 1. row ***************************
           TRIGGER_CATALOG: def
            TRIGGER_SCHEMA: test
              TRIGGER_NAME: ins_sum
        EVENT_MANIPULATION: INSERT
      EVENT_OBJECT_CATALOG: def
       EVENT_OBJECT_SCHEMA: test
        EVENT_OBJECT_TABLE: account
              ACTION_ORDER: 1
          ACTION_CONDITION: NULL
          ACTION_STATEMENT: SET @sum = @sum + NEW.amount
        ACTION_ORIENTATION: ROW
             ACTION_TIMING: BEFORE
ACTION_REFERENCE_OLD_TABLE: NULL
ACTION_REFERENCE_NEW_TABLE: NULL
  ACTION_REFERENCE_OLD_ROW: OLD
  ACTION_REFERENCE_NEW_ROW: NEW
                   CREATED: 2018-08-08 10:10:12.61
                  SQL_MODE: ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,
                            NO_ZERO_IN_DATE,NO_ZERO_DATE,
                            ERROR_FOR_DIVISION_BY_ZERO,
                            NO_ENGINE_SUBSTITUTION
                   DEFINER: me@localhost
      CHARACTER_SET_CLIENT: utf8mb4
      COLLATION_CONNECTION: utf8mb4_0900_ai_ci
        DATABASE_COLLATION: utf8mb4_0900_ai_ci
```

Trigger information is also available from the `SHOW TRIGGERS` statement. See Section 15.7.7.41, “SHOW TRIGGERS Statement”.


### 28.3.51 The INFORMATION\_SCHEMA USER\_ATTRIBUTES Table

The `USER_ATTRIBUTES` table provides information about user comments and user attributes. It takes its values from the `mysql.user` system table.

The `USER_ATTRIBUTES` table has these columns:

* `USER`

  The user name portion of the account to which the `ATTRIBUTE` column value applies.

* `HOST`

  The host name portion of the account to which the `ATTRIBUTE` column value applies.

* `ATTRIBUTE`

  The user comment, user attribute, or both belonging to the account specified by the `USER` and `HOST` columns. The value is in JSON object notation. Attributes are shown exactly as set using [`CREATE USER`](create-user.html "15.7.1.3 CREATE USER Statement") and [`ALTER USER`](alter-user.html "15.7.1.1 ALTER USER Statement") statements with `ATTRIBUTE` or `COMMENT` options. A comment is shown as a key-value pair having `comment` as the key. For additional information and examples, see CREATE USER Comment and Attribute Options.

#### Notes

* `USER_ATTRIBUTES` is a nonstandard `INFORMATION_SCHEMA` table.

* To obtain only the user comment for a given user as an unquoted string, you can employ a query such as this one:

  ```
  mysql> SELECT ATTRIBUTE->>"$.comment" AS Comment
      ->     FROM INFORMATION_SCHEMA.USER_ATTRIBUTES
      ->     WHERE USER='bill' AND HOST='localhost';
  +-----------+
  | Comment   |
  +-----------+
  | A comment |
  +-----------+
  ```

  Similarly, you can obtain the unquoted value for a given user attribute using its key.

* `USER_ATTRIBUTES` contents are accessible as follows:

  + All rows are accessible if:

    - The current thread is a replica thread.
    - The access control system has not been initialized (for example, the server was started with the `--skip-grant-tables` option).

    - The currently authenticated account has the `UPDATE` or `SELECT` privilege for the `mysql.user` system table.

    - The currently authenticated account has the `CREATE USER` and `SYSTEM_USER` privileges.

  + Otherwise, the currently authenticated account can see the row for that account. Additionally, if the account has the `CREATE USER` privilege but not the `SYSTEM_USER` privilege, it can see rows for all other accounts that do not have the `SYSTEM_USER` privilege.

For more information about specifying account comments and attributes, see Section 15.7.1.3, “CREATE USER Statement”.


### 28.3.52 The INFORMATION\_SCHEMA USER\_PRIVILEGES Table

The `USER_PRIVILEGES` table provides information about global privileges. It takes its values from the `mysql.user` system table.

The `USER_PRIVILEGES` table has these columns:

* `GRANTEE`

  The name of the account to which the privilege is granted, in `'user_name'@'host_name'` format.

* `TABLE_CATALOG`

  The name of the catalog. This value is always `def`.

* `PRIVILEGE_TYPE`

  The privilege granted. The value can be any privilege that can be granted at the global level; see Section 15.7.1.6, “GRANT Statement”. Each row lists a single privilege, so there is one row per global privilege held by the grantee.

* `IS_GRANTABLE`

  `YES` if the user has the `GRANT OPTION` privilege, `NO` otherwise. The output does not list `GRANT OPTION` as a separate row with `PRIVILEGE_TYPE='GRANT OPTION'`.

#### Notes

* `USER_PRIVILEGES` is a nonstandard `INFORMATION_SCHEMA` table.

The following statements are *not* equivalent:

```
SELECT ... FROM INFORMATION_SCHEMA.USER_PRIVILEGES

SHOW GRANTS ...
```


### 28.3.53 The INFORMATION\_SCHEMA VIEWS Table

The `VIEWS` table provides information about views in databases. You must have the `SHOW VIEW` privilege to access this table.

The `VIEWS` table has these columns:

* `TABLE_CATALOG`

  The name of the catalog to which the view belongs. This value is always `def`.

* `TABLE_SCHEMA`

  The name of the schema (database) to which the view belongs.

* `TABLE_NAME`

  The name of the view.

* `VIEW_DEFINITION`

  The `SELECT` statement that provides the definition of the view. This column has most of what you see in the `Create Table` column that `SHOW CREATE VIEW` produces. Skip the words before `SELECT` and skip the words `WITH CHECK OPTION`. Suppose that the original statement was:

  ```
  CREATE VIEW v AS
    SELECT s2,s1 FROM t
    WHERE s1 > 5
    ORDER BY s1
    WITH CHECK OPTION;
  ```

  Then the view definition looks like this:

  ```
  SELECT s2,s1 FROM t WHERE s1 > 5 ORDER BY s1
  ```

* `CHECK_OPTION`

  The value of the `CHECK_OPTION` attribute. The value is one of `NONE`, `CASCADE`, or `LOCAL`.

* `IS_UPDATABLE`

  MySQL sets a flag, called the view updatability flag, at `CREATE VIEW` time. The flag is set to `YES` (true) if `UPDATE` and `DELETE` (and similar operations) are legal for the view. Otherwise, the flag is set to `NO` (false). The `IS_UPDATABLE` column in the `VIEWS` table displays the status of this flag. It means that the server always knows whether a view is updatable.

  If a view is not updatable, statements such `UPDATE`, `DELETE`, and `INSERT` are illegal and are rejected. (Even if a view is updatable, it might not be possible to insert into it; for details, refer to Section 27.6.3, “Updatable and Insertable Views”.)

* `DEFINER`

  The account of the user who created the view, in `'user_name'@'host_name'` format.

* `SECURITY_TYPE`

  The view `SQL SECURITY` characteristic. The value is one of `DEFINER` or `INVOKER`.

* `CHARACTER_SET_CLIENT`

  The session value of the `character_set_client` system variable when the view was created.

* `COLLATION_CONNECTION`

  The session value of the `collation_connection` system variable when the view was created.

#### Notes

MySQL permits different `sql_mode` settings to tell the server the type of SQL syntax to support. For example, you might use the `ANSI` SQL mode to ensure MySQL correctly interprets the standard SQL concatenation operator, the double bar (`||`), in your queries. If you then create a view that concatenates items, you might worry that changing the `sql_mode` setting to a value different from `ANSI` could cause the view to become invalid. But this is not the case. No matter how you write out a view definition, MySQL always stores it the same way, in a canonical form. Here is an example that shows how the server changes a double bar concatenation operator to a `CONCAT()` function:

```
mysql> SET sql_mode = 'ANSI';
Query OK, 0 rows affected (0.00 sec)

mysql> CREATE VIEW test.v AS SELECT 'a' || 'b' as col1;
Query OK, 0 rows affected (0.00 sec)

mysql> SELECT VIEW_DEFINITION FROM INFORMATION_SCHEMA.VIEWS
       WHERE TABLE_SCHEMA = 'test' AND TABLE_NAME = 'v';
+----------------------------------+
| VIEW_DEFINITION                  |
+----------------------------------+
| select concat('a','b') AS `col1` |
+----------------------------------+
1 row in set (0.00 sec)
```

The advantage of storing a view definition in canonical form is that changes made later to the value of `sql_mode` do not affect the results from the view. However, an additional consequence is that comments prior to `SELECT` are stripped from the definition by the server.


### 28.3.54 The INFORMATION\_SCHEMA VIEW\_ROUTINE\_USAGE Table

The `VIEW_ROUTINE_USAGE` table provides access to information about stored functions used in view definitions. The table does not list information about built-in (native) functions or loadable functions used in the definitions.

You can see information only for views for which you have some privilege, and only for functions for which you have some privilege.

The `VIEW_ROUTINE_USAGE` table has these columns:

* `TABLE_CATALOG`

  The name of the catalog to which the view belongs. This value is always `def`.

* `TABLE_SCHEMA`

  The name of the schema (database) to which the view belongs.

* `TABLE_NAME`

  The name of the view.

* `SPECIFIC_CATALOG`

  The name of the catalog to which the function used in the view definition belongs. This value is always `def`.

* `SPECIFIC_SCHEMA`

  The name of the schema (database) to which the function used in the view definition belongs.

* `SPECIFIC_NAME`

  The name of the function used in the view definition.


### 28.3.55 The INFORMATION\_SCHEMA VIEW\_TABLE\_USAGE Table

The `VIEW_TABLE_USAGE` table provides access to information about tables and views used in view definitions.

You can see information only for views for which you have some privilege, and only for tables for which you have some privilege.

The `VIEW_TABLE_USAGE` table has these columns:

* `VIEW_CATALOG`

  The name of the catalog to which the view belongs. This value is always `def`.

* `VIEW_SCHEMA`

  The name of the schema (database) to which the view belongs.

* `VIEW_NAME`

  The name of the view.

* `TABLE_CATALOG`

  The name of the catalog to which the table or view used in the view definition belongs. This value is always `def`.

* `TABLE_SCHEMA`

  The name of the schema (database) to which the table or view used in the view definition belongs.

* `TABLE_NAME`

  The name of the table or view used in the view definition.
