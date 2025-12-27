### 2.11.3 Downgrade Notes

Before downgrading from MySQL 5.7, review the information in this section. Some items may require action before downgrading.

* System Table Changes
* InnoDB Changes
* Logging Changes
* SQL Changes

#### System Table Changes

* In MySQL 5.7.13, system table columns that store user@host string values were increased in length. Before downgrading to a previous release, ensure that there are no user@host values that exceed the previous 77 character length limit, and perform the following `mysql` system table alterations:

  ```sql
  ALTER TABLE mysql.proc MODIFY definer char(77) CHARACTER SET utf8 COLLATE utf8_bin NOT NULL DEFAULT '';
  ALTER TABLE mysql.event MODIFY definer char(77) CHARACTER SET utf8 COLLATE utf8_bin NOT NULL DEFAULT '';
  ALTER TABLE mysql.tables_priv MODIFY Grantor char(77) COLLATE utf8_bin NOT NULL DEFAULT '';
  ALTER TABLE mysql.procs_priv MODIFY Grantor char(77) COLLATE utf8_bin NOT NULL DEFAULT '';
  ```

* The maximum length of MySQL user names was increased from 16 characters to 32 characters in MySQL 5.7.8. Before downgrading to a previous release, ensure that there are no user names greater than 16 characters in length, and perform the following `mysql` system table alterations:

  ```sql
  ALTER TABLE mysql.tables_priv MODIFY User char(16) NOT NULL default '';
  ALTER TABLE mysql.columns_priv MODIFY User char(16) NOT NULL default '';
  ALTER TABLE mysql.user MODIFY User char(16) NOT NULL default '';
  ALTER TABLE mysql.db MODIFY User char(16) NOT NULL default '';
  ALTER TABLE mysql.procs_priv MODIFY User char(16) binary DEFAULT '' NOT NULL;
  ```

* The `Password` column of the `mysql.user` system table was removed in MySQL 5.7.6. All credentials are stored in the `authentication_string` column, including those formerly stored in the `Password` column. To make the `mysql.user` table compatible with previous releases, perform the following alterations before downgrading:

  ```sql
  ALTER TABLE mysql.user ADD Password char(41) character set latin1
    collate latin1_bin NOT NULL default '' AFTER user;
  UPDATE mysql.user SET password = authentication_string WHERE
    LENGTH(authentication_string) = 41 AND plugin = 'mysql_native_password';
  UPDATE mysql.user SET authentication_string = '' WHERE
    LENGTH(authentication_string) = 41 AND plugin = 'mysql_native_password';
  ```

* The `help_*` and `time_zone*` system tables changed from `MyISAM` to `InnoDB` in MySQL 5.7.5. Before downgrading to a previous release, change each affected table back to `MyISAM` by running the following statements:

  ```sql
  ALTER TABLE mysql.help_category ENGINE='MyISAM' STATS_PERSISTENT=DEFAULT;
  ALTER TABLE mysql.help_keyword ENGINE='MyISAM' STATS_PERSISTENT=DEFAULT;
  ALTER TABLE mysql.help_relation ENGINE='MyISAM' STATS_PERSISTENT=DEFAULT;
  ALTER TABLE mysql.help_topic ENGINE='MyISAM' STATS_PERSISTENT=DEFAULT;
  ALTER TABLE mysql.time_zone ENGINE='MyISAM' STATS_PERSISTENT=DEFAULT;
  ALTER TABLE mysql.time_zone_leap_second ENGINE='MyISAM' STATS_PERSISTENT=DEFAULT;
  ALTER TABLE mysql.time_zone_name ENGINE='MyISAM' STATS_PERSISTENT=DEFAULT;
  ALTER TABLE mysql.time_zone_transition  ENGINE='MyISAM' STATS_PERSISTENT=DEFAULT;
  ALTER TABLE mysql.time_zone_transition_type ENGINE='MyISAM' STATS_PERSISTENT=DEFAULT;
  ```

* The `mysql.plugin` and `mysql.servers` system tables changed from `MyISAM` to `InnoDB` in MySQL 5.7.6. Before downgrading to a previous release, change each affected table back to `MyISAM` by running the following statements:

  ```sql
  ALTER TABLE mysql.plugin ENGINE='MyISAM' STATS_PERSISTENT=DEFAULT;
  ALTER TABLE mysql.servers ENGINE='MyISAM' STATS_PERSISTENT=DEFAULT;
  ```

* The definition of the `plugin` column in the `mysql.user` system table differs in MySQL 5.7. Before downgrading to a MySQL 5.6 server for versions 5.6.23 and higher, alter the `plugin` column definition using this statement:

  ```sql
  ALTER TABLE mysql.user MODIFY plugin CHAR(64) COLLATE utf8_bin
    DEFAULT 'mysql_native_password';
  ```

  Before downgrading to a MySQL 5.6.22 server or older, alter the `plugin` column definition using this statement:

  ```sql
  ALTER TABLE mysql.user MODIFY plugin CHAR(64) COLLATE utf8_bin DEFAULT '';
  ```

* As of MySQL 5.7.7, the `sys` schema is installed by default during data directory installation. Before downgrading to a previous version, it is recommended that you drop the `sys` schema:

  ```sql
  DROP DATABASE sys;
  ```

  If you are downgrading to a release that includes the `sys` schema, **mysql\_upgrade** recreates the `sys` schema in a compatible form. The `sys` schema is not included in MySQL 5.6.

#### InnoDB Changes

* As of MySQL 5.7.5, the `FIL_PAGE_FLUSH_LSN` field, written to the first page of each `InnoDB` system tablespace file and to `InnoDB` undo tablespace files, is only written to the first file of the `InnoDB` system tablespace (page number 0:0). As a result, if you have a multiple-file system tablespace and decide to downgrade from MySQL 5.7 to MySQL 5.6, you may encounter an invalid message on MySQL 5.6 startup stating that the log sequence numbers *`x`* and *`y`* in ibdata files do not match the log sequence number *`y`* in the ib\_logfiles. If you encounter this message, restart MySQL 5.6. The invalid message should no longer appear.

* To simplify `InnoDB` tablespace discovery during crash recovery, new redo log record types were introduced in MySQL 5.7.5. This enhancement changes the redo log format. Before performing an in-place downgrade from MySQL 5.7.5 or later, perform a clean shutdown using an `innodb_fast_shutdown` setting of `0` or `1`. A slow shutdown using `innodb_fast_shutdown=0` is a recommended step in In-Place Downgrade.

* MySQL 5.7.8 and 5.7.9 undo logs could contain insufficient information about spatial columns (Bug #21508582). Before performing an in-place downgrade from MySQL 5.7.10 or higher to MySQL 5.7.9 or earlier, perform a slow shutdown using `innodb_fast_shutdown=0` to clear the undo logs. A slow shutdown using `innodb_fast_shutdown=0` is a recommended step in In-Place Downgrade.

* MySQL 5.7.8 undo logs could contain insufficient information about virtual columns and virtual column indexes (Bug
  #21869656). Before performing an in-place downgrade from MySQL 5.7.9 or later to MySQL 5.7.8 or earlier, perform a slow shutdown using `innodb_fast_shutdown=0` to clear the undo logs. A slow shutdown using `innodb_fast_shutdown=0` is a recommended step in In-Place Downgrade.

* As of MySQL 5.7.9, the redo log header of the first redo log file (`ib_logfile0`) includes a format version identifier and a text string that identifies the MySQL version that created the redo log files. This enhancement changes the redo log format. To prevent older versions of MySQL from starting on redo log files created in MySQL 5.7.9 or later, the checksum for redo log checkpoint pages was changed. As a result, you must perform a slow shutdown of MySQL (using innodb\_fast\_shutdown=0) and remove the redo log files (the `ib_logfile*` files) before performing an in-place downgrade. A slow shutdown using `innodb_fast_shutdown=0` and removing the redo log files are recommended steps in In-Place Downgrade.

* A new compression version used by the `InnoDB` page compression feature was added in MySQL 5.7.32. The new compression version is not compatible with earlier MySQL releases. Creating a page compressed table in MySQL 5.7.32 or higher and accessing the table after downgrading to a release earlier than MySQL 5.7.32 causes a failure. As a workaround, uncompress such tables before downgrading. To uncompress a table, run `ALTER TABLE tbl_name COMPRESSION='None'` and `OPTIMIZE TABLE`. For information about the `InnoDB` page compression feature, see Section 14.9.2, “InnoDB Page Compression”.

#### Logging Changes

* Support for sending the server error log to `syslog` in MySQL 5.7.5 and up differs from older versions. If you use `syslog` and downgrade to a version older than 5.7.5, you must stop using the relevant **mysqld** system variables and use the corresponding **mysqld\_safe** command options instead. Suppose that you use `syslog` by setting these system variables in the `[mysqld]` group of an option file:

  ```sql
  [mysqld]
  log_syslog=ON
  log_syslog_tag=mytag
  ```

  To downgrade, remove those settings and add option settings in the `[mysqld_safe]` option file group:

  ```sql
  [mysqld_safe]
  syslog
  syslog-tag=mytag
  ```

  `syslog`-related system variables that have no corresponding **mysqld\_safe** option cannot be used after a downgrade.

#### SQL Changes

* A trigger can have triggers for different combinations of trigger event (`INSERT`, `UPDATE`, `DELETE`) and action time (`BEFORE`, `AFTER`), but before MySQL 5.7.2 cannot have multiple triggers that have the same trigger event and action time. MySQL 5.7.2 lifts this limitation and multiple triggers are permitted. This change has implications for downgrades.

  If you downgrade a server that supports multiple triggers to an older version that does not, the downgrade has these effects:

  + For each table that has triggers, all trigger definitions remain in the `.TRG` file for the table. However, if there are multiple triggers with the same trigger event and action time, the server executes only one of them when the trigger event occurs. For information about `.TRG` files, see Table Trigger Storage.

  + If triggers for the table are added or dropped subsequent to the downgrade, the server rewrites the table's `.TRG` file. The rewritten file retains only one trigger per combination of trigger event and action time; the others are lost.

  To avoid these problems, modify your triggers before downgrading. For each table that has multiple triggers per combination of trigger event and action time, convert each such set of triggers to a single trigger as follows:

  1. For each trigger, create a stored routine that contains all the code in the trigger. Values accessed using `NEW` and `OLD` can be passed to the routine using parameters. If the trigger needs a single result value from the code, you can put the code in a stored function and have the function return the value. If the trigger needs multiple result values from the code, you can put the code in a stored procedure and return the values using `OUT` parameters.

  2. Drop all triggers for the table.
  3. Create one new trigger for the table that invokes the stored routines just created. The effect for this trigger is thus the same as the multiple triggers it replaces.
