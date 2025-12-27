### 5.1.14 Server-Side Help Support

MySQL Server supports a [`HELP`](help.html "13.8.3 HELP Statement") statement that returns information from the MySQL Reference Manual (see [Section 13.8.3, “HELP Statement”](help.html "13.8.3 HELP Statement")). This information is stored in several tables in the `mysql` database (see [Section 5.3, “The mysql System Database”](system-schema.html "5.3 The mysql System Database")). Proper operation of the [`HELP`](help.html "13.8.3 HELP Statement") statement requires that these help tables be initialized.

For a new installation of MySQL using a binary or source distribution on Unix, help-table content initialization occurs when you initialize the data directory (see [Section 2.9.1, “Initializing the Data Directory”](data-directory-initialization.html "2.9.1 Initializing the Data Directory")). For an RPM distribution on Linux or binary distribution on Windows, content initialization occurs as part of the MySQL installation process.

For a MySQL upgrade using a binary distribution, help-table content is not upgraded automatically, but you can upgrade it manually. Locate the `fill_help_tables.sql` file in the `share` or `share/mysql` directory. Change location into that directory and process the file with the [**mysql**](mysql.html "4.5.1 mysql — The MySQL Command-Line Client") client as follows:

```sql
mysql -u root -p mysql < fill_help_tables.sql
```

The command shown here assumes that you connect to the server using an account such as `root` that has privileges for modifying tables in the `mysql` database. Adjust the connection parameters as required.

If you are working with Git and a MySQL development source tree, the source tree contains only a “stub” version of `fill_help_tables.sql`. To obtain a non-stub copy, use one from a source or binary distribution.

Note

Each MySQL series has its own series-specific reference manual, so help-table content is series specific as well. This has implications for replication because help-table content should match the MySQL series. If you load MySQL 5.7 help content into a MySQL 5.7 source server, it does not make sense to replicate that content to a replica server from a different MySQL series and for which that content is not appropriate. For this reason, as you upgrade individual servers in a replication scenario, you should upgrade each server's help tables, using the instructions given earlier.
