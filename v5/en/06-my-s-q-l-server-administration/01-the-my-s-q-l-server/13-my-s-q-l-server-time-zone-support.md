### 5.1.13 MySQL Server Time Zone Support

This section describes the time zone settings maintained by MySQL, how to load the system tables required for named time support, how to stay current with time zone changes, and how to enable leap-second support.

For information about time zone settings in replication setups, see [Section 16.4.1.15, “Replication and System Functions”](replication-features-functions.html "16.4.1.15 Replication and System Functions") and [Section 16.4.1.31, “Replication and Time Zones”](replication-features-timezone.html "16.4.1.31 Replication and Time Zones").

* [Time Zone Variables](time-zone-support.html#time-zone-variables "Time Zone Variables")
* [Populating the Time Zone Tables](time-zone-support.html#time-zone-installation "Populating the Time Zone Tables")
* [Staying Current with Time Zone Changes](time-zone-support.html#time-zone-upgrades "Staying Current with Time Zone Changes")
* [Time Zone Leap Second Support](time-zone-support.html#time-zone-leap-seconds "Time Zone Leap Second Support")

#### Time Zone Variables

MySQL Server maintains several time zone settings:

* The server system time zone. When the server starts, it attempts to determine the time zone of the host machine and uses it to set the [`system_time_zone`](server-system-variables.html#sysvar_system_time_zone) system variable. The value does not change thereafter.

  To explicitly specify the system time zone for MySQL Server at startup, set the `TZ` environment variable before you start [**mysqld**](mysqld.html "4.3.1 mysqld — The MySQL Server"). If you start the server using [**mysqld\_safe**](mysqld-safe.html "4.3.2 mysqld_safe — MySQL Server Startup Script"), its [`--timezone`](mysqld-safe.html#option_mysqld_safe_timezone) option provides another way to set the system time zone. The permissible values for `TZ` and [`--timezone`](mysqld-safe.html#option_mysqld_safe_timezone) are system dependent. Consult your operating system documentation to see what values are acceptable.

* The server current time zone. The global [`time_zone`](server-system-variables.html#sysvar_time_zone) system variable indicates the time zone the server currently is operating in. The initial [`time_zone`](server-system-variables.html#sysvar_time_zone) value is `'SYSTEM'`, which indicates that the server time zone is the same as the system time zone.

  Note

  If set to `SYSTEM`, every MySQL function call that requires a time zone calculation makes a system library call to determine the current system time zone. This call may be protected by a global mutex, resulting in contention.

  The initial global server time zone value can be specified explicitly at startup with the [`--default-time-zone`](server-options.html#option_mysqld_default-time-zone) option on the command line, or you can use the following line in an option file:

  ```sql
  default-time-zone='timezone'
  ```

  If you have the [`SUPER`](privileges-provided.html#priv_super) privilege, you can set the global server time zone value at runtime with this statement:

  ```sql
  SET GLOBAL time_zone = timezone;
  ```

* Per-session time zones. Each client that connects has its own session time zone setting, given by the session [`time_zone`](server-system-variables.html#sysvar_time_zone) variable. Initially, the session variable takes its value from the global [`time_zone`](server-system-variables.html#sysvar_time_zone) variable, but the client can change its own time zone with this statement:

  ```sql
  SET time_zone = timezone;
  ```

The session time zone setting affects display and storage of time values that are zone-sensitive. This includes the values displayed by functions such as [`NOW()`](date-and-time-functions.html#function_now) or [`CURTIME()`](date-and-time-functions.html#function_curtime), and values stored in and retrieved from [`TIMESTAMP`](datetime.html "11.2.2 The DATE, DATETIME, and TIMESTAMP Types") columns. Values for [`TIMESTAMP`](datetime.html "11.2.2 The DATE, DATETIME, and TIMESTAMP Types") columns are converted from the session time zone to UTC for storage, and from UTC to the session time zone for retrieval.

The session time zone setting does not affect values displayed by functions such as [`UTC_TIMESTAMP()`](date-and-time-functions.html#function_utc-timestamp) or values in [`DATE`](datetime.html "11.2.2 The DATE, DATETIME, and TIMESTAMP Types"), [`TIME`](time.html "11.2.3 The TIME Type"), or [`DATETIME`](datetime.html "11.2.2 The DATE, DATETIME, and TIMESTAMP Types") columns. Nor are values in those data types stored in UTC; the time zone applies for them only when converting from [`TIMESTAMP`](datetime.html "11.2.2 The DATE, DATETIME, and TIMESTAMP Types") values. If you want locale-specific arithmetic for [`DATE`](datetime.html "11.2.2 The DATE, DATETIME, and TIMESTAMP Types"), [`TIME`](time.html "11.2.3 The TIME Type"), or [`DATETIME`](datetime.html "11.2.2 The DATE, DATETIME, and TIMESTAMP Types") values, convert them to UTC, perform the arithmetic, and then convert back.

The current global and session time zone values can be retrieved like this:

```sql
SELECT @@GLOBAL.time_zone, @@SESSION.time_zone;
```

*`timezone`* values can be given in several formats, none of which are case-sensitive:

* As the value `'SYSTEM'`, indicating that the server time zone is the same as the system time zone.

* As a string indicating an offset from UTC of the form `[H]H:MM`, prefixed with a `+` or `-`, such as `'+10:00'`, `'-6:00'`, or `'+05:30'`. A leading zero can optionally be used for hours values less than 10; MySQL prepends a leading zero when storing and retriving the value in such cases. MySQL converts `'-00:00'` or `'-0:00'` to `'+00:00'`.

  A time zone offset must be in the range `'-12:59'` to `'+13:00'`, inclusive.

* As a named time zone, such as `'Europe/Helsinki'`, `'US/Eastern'`, `'MET'`, or `'UTC'`.

  Note

  Named time zones can be used only if the time zone information tables in the `mysql` database have been created and populated. Otherwise, use of a named time zone results in an error:

  ```sql
  mysql> SET time_zone = 'UTC';
  ERROR 1298 (HY000): Unknown or incorrect time zone: 'UTC'
  ```

#### Populating the Time Zone Tables

Several tables in the `mysql` system database exist to store time zone information (see [Section 5.3, “The mysql System Database”](system-schema.html "5.3 The mysql System Database")). The MySQL installation procedure creates the time zone tables, but does not load them. To do so manually, use the following instructions.

Note

Loading the time zone information is not necessarily a one-time operation because the information changes occasionally. When such changes occur, applications that use the old rules become out of date and you may find it necessary to reload the time zone tables to keep the information used by your MySQL server current. See [Staying Current with Time Zone Changes](time-zone-support.html#time-zone-upgrades "Staying Current with Time Zone Changes").

If your system has its own zoneinfo database (the set of files describing time zones), use the [**mysql\_tzinfo\_to\_sql**](mysql-tzinfo-to-sql.html "4.4.6 mysql_tzinfo_to_sql — Load the Time Zone Tables") program to load the time zone tables. Examples of such systems are Linux, macOS, FreeBSD, and Solaris. One likely location for these files is the `/usr/share/zoneinfo` directory. If your system has no zoneinfo database, you can use a downloadable package, as described later in this section.

To load the time zone tables from the command line, pass the zoneinfo directory path name to [**mysql\_tzinfo\_to\_sql**](mysql-tzinfo-to-sql.html "4.4.6 mysql_tzinfo_to_sql — Load the Time Zone Tables") and send the output into the [**mysql**](mysql.html "4.5.1 mysql — The MySQL Command-Line Client") program. For example:

```sql
mysql_tzinfo_to_sql /usr/share/zoneinfo | mysql -u root -p mysql
```

The [**mysql**](mysql.html "4.5.1 mysql — The MySQL Command-Line Client") command shown here assumes that you connect to the server using an account such as `root` that has privileges for modifying tables in the `mysql` system database. Adjust the connection parameters as required.

[**mysql\_tzinfo\_to\_sql**](mysql-tzinfo-to-sql.html "4.4.6 mysql_tzinfo_to_sql — Load the Time Zone Tables") reads your system's time zone files and generates SQL statements from them. [**mysql**](mysql.html "4.5.1 mysql — The MySQL Command-Line Client") processes those statements to load the time zone tables.

[**mysql\_tzinfo\_to\_sql**](mysql-tzinfo-to-sql.html "4.4.6 mysql_tzinfo_to_sql — Load the Time Zone Tables") also can be used to load a single time zone file or generate leap second information:

* To load a single time zone file *`tz_file`* that corresponds to a time zone name *`tz_name`*, invoke [**mysql\_tzinfo\_to\_sql**](mysql-tzinfo-to-sql.html "4.4.6 mysql_tzinfo_to_sql — Load the Time Zone Tables") like this:

  ```sql
  mysql_tzinfo_to_sql tz_file tz_name | mysql -u root -p mysql
  ```

  With this approach, you must execute a separate command to load the time zone file for each named zone that the server needs to know about.

* If your time zone must account for leap seconds, initialize leap second information like this, where *`tz_file`* is the name of your time zone file:

  ```sql
  mysql_tzinfo_to_sql --leap tz_file | mysql -u root -p mysql
  ```

After running [**mysql\_tzinfo\_to\_sql**](mysql-tzinfo-to-sql.html "4.4.6 mysql_tzinfo_to_sql — Load the Time Zone Tables"), restart the server so that it does not continue to use any previously cached time zone data.

If your system has no zoneinfo database (for example, Windows), you can use a package containing SQL statements that is available for download at the MySQL Developer Zone:

```sql
https://dev.mysql.com/downloads/timezones.html
```

Warning

Do *not* use a downloadable time zone package if your system has a zoneinfo database. Use the [**mysql\_tzinfo\_to\_sql**](mysql-tzinfo-to-sql.html "4.4.6 mysql_tzinfo_to_sql — Load the Time Zone Tables") utility instead. Otherwise, you may cause a difference in datetime handling between MySQL and other applications on your system.

To use an SQL-statement time zone package that you have downloaded, unpack it, then load the unpacked file contents into the time zone tables:

```sql
mysql -u root -p mysql < file_name
```

Then restart the server.

Warning

Do *not* use a downloadable time zone package that contains `MyISAM` tables. That is intended for older MySQL versions. MySQL 5.7 and higher uses `InnoDB` for the time zone tables. Trying to replace them with `MyISAM` tables causes problems.

#### Staying Current with Time Zone Changes

When time zone rules change, applications that use the old rules become out of date. To stay current, it is necessary to make sure that your system uses current time zone information is used. For MySQL, there are multiple factors to consider in staying current:

* The operating system time affects the value that the MySQL server uses for times if its time zone is set to `SYSTEM`. Make sure that your operating system is using the latest time zone information. For most operating systems, the latest update or service pack prepares your system for the time changes. Check the website for your operating system vendor for an update that addresses the time changes.

* If you replace the system's `/etc/localtime` time zone file with a version that uses rules differing from those in effect at [**mysqld**](mysqld.html "4.3.1 mysqld — The MySQL Server") startup, restart [**mysqld**](mysqld.html "4.3.1 mysqld — The MySQL Server") so that it uses the updated rules. Otherwise, [**mysqld**](mysqld.html "4.3.1 mysqld — The MySQL Server") might not notice when the system changes its time.

* If you use named time zones with MySQL, make sure that the time zone tables in the `mysql` database are up to date:

  + If your system has its own zoneinfo database, reload the MySQL time zone tables whenever the zoneinfo database is updated.

  + For systems that do not have their own zoneinfo database, check the MySQL Developer Zone for updates. When a new update is available, download it and use it to replace the content of your current time zone tables.

  For instructions for both methods, see [Populating the Time Zone Tables](time-zone-support.html#time-zone-installation "Populating the Time Zone Tables"). [**mysqld**](mysqld.html "4.3.1 mysqld — The MySQL Server") caches time zone information that it looks up, so after updating the time zone tables, restart [**mysqld**](mysqld.html "4.3.1 mysqld — The MySQL Server") to make sure that it does not continue to serve outdated time zone data.

If you are uncertain whether named time zones are available, for use either as the server's time zone setting or by clients that set their own time zone, check whether your time zone tables are empty. The following query determines whether the table that contains time zone names has any rows:

```sql
mysql> SELECT COUNT(*) FROM mysql.time_zone_name;
+----------+
| COUNT(*) |
+----------+
|        0 |
+----------+
```

A count of zero indicates that the table is empty. In this case, no applications currently are using named time zones, and you need not update the tables (unless you want to enable named time zone support). A count greater than zero indicates that the table is not empty and that its contents are available to be used for named time zone support. In this case, be sure to reload your time zone tables so that applications that use named time zones obtain correct query results.

To check whether your MySQL installation is updated properly for a change in Daylight Saving Time rules, use a test like the one following. The example uses values that are appropriate for the 2007 DST 1-hour change that occurs in the United States on March 11 at 2 a.m.

The test uses this query:

```sql
SELECT
  CONVERT_TZ('2007-03-11 2:00:00','US/Eastern','US/Central') AS time1,
  CONVERT_TZ('2007-03-11 3:00:00','US/Eastern','US/Central') AS time2;
```

The two time values indicate the times at which the DST change occurs, and the use of named time zones requires that the time zone tables be used. The desired result is that both queries return the same result (the input time, converted to the equivalent value in the 'US/Central' time zone).

Before updating the time zone tables, you see an incorrect result like this:

```sql
+---------------------+---------------------+
| time1               | time2               |
+---------------------+---------------------+
| 2007-03-11 01:00:00 | 2007-03-11 02:00:00 |
+---------------------+---------------------+
```

After updating the tables, you should see the correct result:

```sql
+---------------------+---------------------+
| time1               | time2               |
+---------------------+---------------------+
| 2007-03-11 01:00:00 | 2007-03-11 01:00:00 |
+---------------------+---------------------+
```

#### Time Zone Leap Second Support

Leap second values are returned with a time part that ends with `:59:59`. This means that a function such as [`NOW()`](date-and-time-functions.html#function_now) can return the same value for two or three consecutive seconds during the leap second. It remains true that literal temporal values having a time part that ends with `:59:60` or `:59:61` are considered invalid.

If it is necessary to search for [`TIMESTAMP`](datetime.html "11.2.2 The DATE, DATETIME, and TIMESTAMP Types") values one second before the leap second, anomalous results may be obtained if you use a comparison with `'YYYY-MM-DD hh:mm:ss'` values. The following example demonstrates this. It changes the session time zone to UTC so there is no difference between internal [`TIMESTAMP`](datetime.html "11.2.2 The DATE, DATETIME, and TIMESTAMP Types") values (which are in UTC) and displayed values (which have time zone correction applied).

```sql
mysql> CREATE TABLE t1 (
         a INT,
         ts TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
         PRIMARY KEY (ts)
       );
Query OK, 0 rows affected (0.01 sec)

mysql> -- change to UTC
mysql> SET time_zone = '+00:00';
Query OK, 0 rows affected (0.00 sec)

mysql> -- Simulate NOW() = '2008-12-31 23:59:59'
mysql> SET timestamp = 1230767999;
Query OK, 0 rows affected (0.00 sec)

mysql> INSERT INTO t1 (a) VALUES (1);
Query OK, 1 row affected (0.00 sec)

mysql> -- Simulate NOW() = '2008-12-31 23:59:60'
mysql> SET timestamp = 1230768000;
Query OK, 0 rows affected (0.00 sec)

mysql> INSERT INTO t1 (a) VALUES (2);
Query OK, 1 row affected (0.00 sec)

mysql> -- values differ internally but display the same
mysql> SELECT a, ts, UNIX_TIMESTAMP(ts) FROM t1;
+------+---------------------+--------------------+
| a    | ts                  | UNIX_TIMESTAMP(ts) |
+------+---------------------+--------------------+
|    1 | 2008-12-31 23:59:59 |         1230767999 |
|    2 | 2008-12-31 23:59:59 |         1230768000 |
+------+---------------------+--------------------+
2 rows in set (0.00 sec)

mysql> -- only the non-leap value matches
mysql> SELECT * FROM t1 WHERE ts = '2008-12-31 23:59:59';
+------+---------------------+
| a    | ts                  |
+------+---------------------+
|    1 | 2008-12-31 23:59:59 |
+------+---------------------+
1 row in set (0.00 sec)

mysql> -- the leap value with seconds=60 is invalid
mysql> SELECT * FROM t1 WHERE ts = '2008-12-31 23:59:60';
Empty set, 2 warnings (0.00 sec)
```

To work around this, you can use a comparison based on the UTC value actually stored in the column, which has the leap second correction applied:

```sql
mysql> -- selecting using UNIX_TIMESTAMP value return leap value
mysql> SELECT * FROM t1 WHERE UNIX_TIMESTAMP(ts) = 1230768000;
+------+---------------------+
| a    | ts                  |
+------+---------------------+
|    2 | 2008-12-31 23:59:59 |
+------+---------------------+
1 row in set (0.00 sec)
```
