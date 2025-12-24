## 3.6 Preparing Your Installation for Upgrade

Before upgrading to the latest MySQL 8.4 release, ensure the upgrade readiness of your current MySQL 8.3 or MySQL 8.4 server instance by performing the preliminary checks described below. The upgrade process may fail otherwise.

Tip

Consider using the  MySQL Shell upgrade checker utility that enables you to verify whether MySQL server instances are ready for upgrade. You can select a target MySQL Server release to which you plan to upgrade, ranging from the MySQL Server 8.0.11 up to the MySQL Server release number that matches the current MySQL Shell release number. The upgrade checker utility carries out the automated checks that are relevant for the specified target release, and advises you of further relevant checks that you should make manually. The upgrade checker works for all Bugfix, Innovation, and LTS releases of MySQL. Installation instructions for MySQL Shell can be found  here.

Preliminary checks:

1. The following issues must not be present:

   * There must be no tables that use obsolete data types or functions.
   * There must be no orphan `.frm` files.
   * Triggers must not have a missing or empty definer or an invalid creation context (indicated by the `character_set_client`, `collation_connection`, `Database Collation` attributes displayed by `SHOW TRIGGERS` or the `INFORMATION_SCHEMA` `TRIGGERS` table). Any such triggers must be dumped and restored to fix the issue.

   To check for these issues, execute this command:

   ```
   mysqlcheck -u root -p --all-databases --check-upgrade
   ```

   If  `mysqlcheck` reports any errors, correct the issues.
2. There must be no partitioned tables that use a storage engine that does not have native partitioning support. To identify such tables, execute this query:

   ```
   SELECT TABLE_SCHEMA, TABLE_NAME
       FROM INFORMATION_SCHEMA.TABLES
       WHERE ENGINE NOT IN ('innodb', 'ndbcluster')
           AND CREATE_OPTIONS LIKE '%partitioned%';
   ```

   Any table reported by the query must be altered to use `InnoDB` or be made nonpartitioned. To change a table storage engine to `InnoDB`, execute this statement:

   ```
   ALTER TABLE table_name ENGINE = INNODB;
   ```

   For information about converting `MyISAM` tables to `InnoDB`, see Section 17.6.1.5, “Converting Tables from MyISAM to InnoDB”.

   To make a partitioned table nonpartitioned, execute this statement:

   ```
   ALTER TABLE table_name REMOVE PARTITIONING;
   ```
3. Some keywords may be reserved in MySQL 8.4 that were not reserved previously. See  Section 11.3, “Keywords and Reserved Words”. This can cause words previously used as identifiers to become illegal. To fix affected statements, use identifier quoting. See  Section 11.2, “Schema Object Names”.
4. There must be no tables in the MySQL 8.3 `mysql` system database that have the same name as a table used by the MySQL 8.4 data dictionary. To identify tables with those names, execute this query:

   ```
   SELECT TABLE_SCHEMA, TABLE_NAME
   FROM INFORMATION_SCHEMA.TABLES
   WHERE
       LOWER(TABLE_SCHEMA) = 'mysql'
       AND
       LOWER(TABLE_NAME) IN
       (
       'catalogs',
       'character_sets',
       'check_constraints',
       'collations',
       'column_statistics',
       'column_type_elements',
       'columns',
       'dd_properties',
       'events',
       'foreign_key_column_usage',
       'foreign_keys',
       'index_column_usage',
       'index_partitions',
       'index_stats',
       'indexes',
       'parameter_type_elements',
       'parameters',
       'resource_groups',
       'routines',
       'schemata',
       'st_spatial_reference_systems',
       'table_partition_values',
       'table_partitions',
       'table_stats',
       'tables',
       'tablespace_files',
       'tablespaces',
       'triggers',
       'view_routine_usage',
       'view_table_usage'
       );
   ```

   Any tables reported by the query must be dropped or renamed (use  `RENAME TABLE`). This may also entail changes to applications that use the affected tables.
5. There must be no tables that have foreign key constraint names longer than 64 characters. Use this query to identify tables with constraint names that are too long:

   ```
   SELECT TABLE_SCHEMA, TABLE_NAME
   FROM INFORMATION_SCHEMA.TABLES
   WHERE TABLE_NAME IN
     (SELECT LEFT(SUBSTR(ID,INSTR(ID,'/')+1),
                  INSTR(SUBSTR(ID,INSTR(ID,'/')+1),'_ibfk_')-1)
      FROM INFORMATION_SCHEMA.INNODB_SYS_FOREIGN
      WHERE LENGTH(SUBSTR(ID,INSTR(ID,'/')+1))>64);
   ```

   For a table with a constraint name that exceeds 64 characters, drop the constraint and add it back with constraint name that does not exceed 64 characters (use `ALTER TABLE`).
6. There must be no obsolete SQL modes defined by `sql_mode` system variable. Attempting to use an obsolete SQL mode prevents MySQL 8.4 from starting. Applications that use obsolete SQL modes should be revised to avoid them. For information about SQL modes removed in MySQL 8.4, see Server Changes.
7. Only upgrade a MySQL server instance that was properly shut down. If the instance unexpectedly shutdown, then restart the instance and shut it down with `innodb_fast_shutdown=0` before upgrade.
8. There must be no views with explicitly defined columns names that exceed 64 characters (views with column names up to 255 characters were permitted in MySQL 5.7). To avoid upgrade errors, such views should be altered before upgrading. Currently, the only method of identify views with column names that exceed 64 characters is to inspect the view definition using  `SHOW CREATE VIEW`. You can also inspect view definitions by querying the Information Schema  `VIEWS` table.
9. There must be no tables or stored procedures with individual `ENUM` or `SET` column elements that exceed 255 characters or 1020 bytes in length. Prior to MySQL 8.4, the maximum combined length of `ENUM` or `SET` column elements was 64K. In MySQL 8.4, the maximum character length of an individual `ENUM` or `SET` column element is 255 characters, and the maximum byte length is 1020 bytes. (The 1020 byte limit supports multibyte character sets). Before upgrading to MySQL 8.0, modify any `ENUM` or `SET` column elements that exceed the new limits. Failing to do so causes the upgrade to fail with an error.
10. Your MySQL 8.3 installation must not use features that are not supported by MySQL 8.4. Any changes here are necessarily installation specific, but the following example illustrates the kind of thing to look for:

    Some server startup options and system variables have been removed in MySQL 8.4. See Features Removed in MySQL 8.4, and Section 1.5, “Server and Status Variables and Options Added, Deprecated, or Removed in MySQL 8.4 since 8.0”. If you use any of these, an upgrade requires configuration changes.
11. If you intend to change the `lower_case_table_names` setting to 1 at upgrade time, ensure that schema and table names are lowercase before upgrading. Otherwise, a failure could occur due to a schema or table name lettercase mismatch. You can use the following queries to check for schema and table names containing uppercase characters:

    ```
    mysql> select TABLE_NAME, if(sha(TABLE_NAME) !=sha(lower(TABLE_NAME)),'Yes','No') as UpperCase from information_schema.tables;
    ```

    If  `lower_case_table_names=1`, table and schema names are checked by the upgrade process to ensure that all characters are lowercase. If table or schema names are found to contain uppercase characters, the upgrade process fails with an error.

    ::: info Note

    Changing the `lower_case_table_names` setting at upgrade time is not recommended.


    :::

If upgrade to MySQL 8.4 fails due to any of the issues outlined above, the server reverts all changes to the data directory. In this case, remove all redo log files and restart the MySQL 8.3 server on the existing data directory to address the errors. The redo log files (`ib_logfile*`) reside in the MySQL data directory by default. After the errors are fixed, perform a slow shutdown (by setting `innodb_fast_shutdown=0`) before attempting the upgrade again.


