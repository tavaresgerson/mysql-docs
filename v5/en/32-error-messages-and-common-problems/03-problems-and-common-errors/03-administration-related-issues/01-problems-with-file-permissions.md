#### B.3.3.1 Problems with File Permissions

If you have problems with file permissions, the `UMASK` or `UMASK_DIR` environment variable might be set incorrectly when [**mysqld**](mysqld.html "4.3.1 mysqld — The MySQL Server") starts. For example, [**mysqld**](mysqld.html "4.3.1 mysqld — The MySQL Server") might issue the following error message when you create a table:

```sql
ERROR: Can't find file: 'path/with/filename.frm' (Errcode: 13)
```

The default `UMASK` and `UMASK_DIR` values are `0640` and `0750`, respectively. [**mysqld**](mysqld.html "4.3.1 mysqld — The MySQL Server") assumes that the value for `UMASK` or `UMASK_DIR` is in octal if it starts with a zero. For example, setting `UMASK=0600` is equivalent to `UMASK=384` because 0600 octal is 384 decimal.

Assuming that you start [**mysqld**](mysqld.html "4.3.1 mysqld — The MySQL Server") using [**mysqld_safe**](mysqld-safe.html "4.3.2 mysqld_safe — MySQL Server Startup Script"), change the default `UMASK` value as follows:

```sql
UMASK=384  # = 600 in octal
export UMASK
mysqld_safe &
```

Note

An exception applies for the error log file if you start [**mysqld**](mysqld.html "4.3.1 mysqld — The MySQL Server") using [**mysqld_safe**](mysqld-safe.html "4.3.2 mysqld_safe — MySQL Server Startup Script"), which does not respect `UMASK`: [**mysqld_safe**](mysqld-safe.html "4.3.2 mysqld_safe — MySQL Server Startup Script") may create the error log file if it does not exist prior to starting [**mysqld**](mysqld.html "4.3.1 mysqld — The MySQL Server"), and [**mysqld_safe**](mysqld-safe.html "4.3.2 mysqld_safe — MySQL Server Startup Script") uses a umask set to a strict value of `0137`. If this is unsuitable, create the error file manually with the desired access mode prior to executing [**mysqld_safe**](mysqld-safe.html "4.3.2 mysqld_safe — MySQL Server Startup Script").

By default, [**mysqld**](mysqld.html "4.3.1 mysqld — The MySQL Server") creates database directories with an access permission value of `0750`. To modify this behavior, set the `UMASK_DIR` variable. If you set its value, new directories are created with the combined `UMASK` and `UMASK_DIR` values. For example, to give group access to all new directories, start [**mysqld_safe**](mysqld-safe.html "4.3.2 mysqld_safe — MySQL Server Startup Script") as follows:

```sql
UMASK_DIR=504  # = 770 in octal
export UMASK_DIR
mysqld_safe &
```

For additional details, see [Section 4.9, “Environment Variables”](environment-variables.html "4.9 Environment Variables").
