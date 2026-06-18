### 17.11.5 Reclaiming Disk Space with TRUNCATE TABLE

To reclaim operating system disk space when
[truncating](glossary.html#glos_truncate "truncate") an
`InnoDB` table, the table must be stored in its
own [.ibd](glossary.html#glos_ibd_file ".ibd file") file. For a table to
be stored in its own [.ibd](glossary.html#glos_ibd_file ".ibd file")
file, [`innodb_file_per_table`](innodb-parameters.html#sysvar_innodb_file_per_table) must
enabled when the table is created. Additionally, there cannot be a
[foreign key](glossary.html#glos_foreign_key "foreign key") constraint
between the table being truncated and other tables, otherwise the
`TRUNCATE TABLE` operation fails. A foreign key
constraint between two columns in the same table, however, is
permitted.

When a table is truncated, it is dropped and re-created in a new
`.ibd` file, and the freed space is returned to
the operating system. This is in contrast to truncating
`InnoDB` tables that are stored within the
`InnoDB`
[system tablespace](glossary.html#glos_system_tablespace "system tablespace")
(tables created when `innodb_file_per_table=OFF`)
and tables stored in shared
[general
tablespaces](glossary.html#glos_general_tablespace "general tablespace"), where only `InnoDB` can use
the freed space after the table is truncated.

The ability to truncate tables and return disk space to the
operating system also means that
[physical backups](glossary.html#glos_physical_backup "physical backup") can
be smaller. Truncating tables that are stored in the system
tablespace (tables created when
`innodb_file_per_table=OFF`) or in a general
tablespace leaves blocks of unused space in the tablespace.