#### B.3.3.7 Time Zone Problems

If you have a problem with `SELECT NOW()` returning values in UTC and not your local time, you have to tell the server your current time zone. The same applies if [`UNIX_TIMESTAMP()`](date-and-time-functions.html#function_unix-timestamp) returns the wrong value. This should be done for the environment in which the server runs (for example, in [**mysqld_safe**](mysqld-safe.html "4.3.2 mysqld_safe — MySQL Server Startup Script") or [**mysql.server**](mysql-server.html "4.3.3 mysql.server — MySQL Server Startup Script")). See [Section 4.9, “Environment Variables”](environment-variables.html "4.9 Environment Variables").

You can set the time zone for the server with the [`--timezone=timezone_name`](mysqld-safe.html#option_mysqld_safe_timezone) option to [**mysqld_safe**](mysqld-safe.html "4.3.2 mysqld_safe — MySQL Server Startup Script"). You can also set it by setting the `TZ` environment variable before you start [**mysqld**](mysqld.html "4.3.1 mysqld — The MySQL Server").

The permissible values for [`--timezone`](mysqld-safe.html#option_mysqld_safe_timezone) or `TZ` are system dependent. Consult your operating system documentation to see what values are acceptable.
