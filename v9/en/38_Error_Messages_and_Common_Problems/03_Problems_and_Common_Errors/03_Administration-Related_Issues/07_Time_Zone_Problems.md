#### B.3.3.7 Time Zone Problems

If you have a problem with `SELECT NOW()` returning values in UTC and not your local time, you have to tell the server your current time zone. The same applies if `UNIX_TIMESTAMP()` returns the wrong value. This should be done for the environment in which the server runs (for example, in **mysqld\_safe** or **mysql.server**). See Section 6.9, “Environment Variables”.

You can set the time zone for the server with the `--timezone=timezone_name` option to **mysqld\_safe**. You can also set it by setting the `TZ` environment variable before you start **mysqld**.

The permissible values for `--timezone` or `TZ` are system dependent. Consult your operating system documentation to see what values are acceptable.
