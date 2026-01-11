# Chapter 30 MySQL sys Schema

**Table of Contents**

30.1 Prerequisites for Using the sys Schema

30.2 Using the sys Schema

30.3 sys Schema Progress Reporting

30.4 sys Schema Object Reference :   30.4.1 sys Schema Object Index

    30.4.2 sys Schema Tables and Triggers

    30.4.3 sys Schema Views

    30.4.4 sys Schema Stored Procedures

    30.4.5 sys Schema Stored Functions

MySQL 8.0 includes the `sys` schema, a set of objects that helps DBAs and developers interpret data collected by the Performance Schema. `sys` schema objects can be used for typical tuning and diagnosis use cases. Objects in this schema include:

* Views that summarize Performance Schema data into more easily understandable form.

* Stored procedures that perform operations such as Performance Schema configuration and generating diagnostic reports.

* Stored functions that query Performance Schema configuration and provide formatting services.

For new installations, the `sys` schema is installed by default during data directory initialization if you use **mysqld** with the `--initialize` or `--initialize-insecure` option. If this is not desired, you can drop the `sys` schema manually after initialization if it is unneeded.

The MySQL upgrade procedure produces an error if a `sys` schema exists but has no `version` view, on the assumption that absence of this view indicates a user-created `sys` schema. To upgrade in this case, remove or rename the existing `sys` schema first.

`sys` schema objects have a `DEFINER` of `'mysql.sys'@'localhost'`. Use of the dedicated `mysql.sys` account avoids problems that occur if a DBA renames or removes the `root` account.
