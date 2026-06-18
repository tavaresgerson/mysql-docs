### 7.1.17 Server-Side Help Support

MySQL Server supports a [`HELP`](help.html "15.8.3 HELP Statement")
statement that returns information from the MySQL Reference Manual
(see [Section 15.8.3, “HELP Statement”](help.html "15.8.3 HELP Statement")). This information is stored in
several tables in the `mysql` schema (see
[Section 7.3, “The mysql System Schema”](system-schema.html "7.3 The mysql System Schema")). Proper operation of the
[`HELP`](help.html "15.8.3 HELP Statement") statement requires that these
help tables be initialized.

For a new installation of MySQL using a binary or source
distribution on Unix, help-table content initialization occurs
when you initialize the data directory (see
[Section 2.9.1, “Initializing the Data Directory”](data-directory-initialization.html "2.9.1 Initializing the Data Directory")). For an RPM
distribution on Linux or binary distribution on Windows, content
initialization occurs as part of the MySQL installation process.

For a MySQL upgrade using a binary distribution, help-table
content is upgraded automatically by the server. To upgrade it
manually, locate the `fill_help_tables.sql`
file in the `share` or
`share/mysql` directory. Change location into
that directory and process the file with the
[**mysql**](mysql.html "6.5.1 mysql — The MySQL Command-Line Client") client as follows:

```
mysql -u root -p mysql < fill_help_tables.sql
```

The command shown here assumes that you connect to the server
using an account such as `root` that has
privileges for modifying tables in the `mysql`
schema. Adjust the connection parameters as required.