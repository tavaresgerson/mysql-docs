# Chapter 26 MySQL sys Schema

**Table of Contents**

26.1 Prerequisites for Using the sys Schema

26.2 Using the sys Schema

26.3 sys Schema Progress Reporting

26.4 sys Schema Object Reference :   26.4.1 sys Schema Object Index

    26.4.2 sys Schema Tables and Triggers

    26.4.3 sys Schema Views

    26.4.4 sys Schema Stored Procedures

    26.4.5 sys Schema Stored Functions

MySQL 5.7 includes the `sys` schema, a set of objects that helps DBAs and developers interpret data collected by the Performance Schema. `sys` schema objects can be used for typical tuning and diagnosis use cases. Objects in this schema include:

* Views that summarize Performance Schema data into more easily understandable form.

* Stored procedures that perform operations such as Performance Schema configuration and generating diagnostic reports.

* Stored functions that query Performance Schema configuration and provide formatting services.

For new installations, the `sys` schema is installed by default during data directory initialization if you use **mysqld** with the `--initialize` or `--initialize-insecure` option. You can drop the `sys` schema manually after initialization if it is unneeded.

For upgrades, **mysql_upgrade** installs the `sys` schema if it is not installed, and upgrades it to the current version otherwise. To permit this behavior to be suppressed, **mysql_upgrade** has a `--skip-sys-schema` option.

**mysql_upgrade** returns an error if a `sys` schema exists but has no `version` view, on the assumption that absence of this view indicates a user-created `sys` schema. To upgrade in this case, remove or rename the existing `sys` schema first.

`sys` schema objects have a `DEFINER` of `'mysql.sys'@'localhost'`. Use of the dedicated `mysql.sys` account avoids problems that occur if a DBA renames or removes the `root` account.
