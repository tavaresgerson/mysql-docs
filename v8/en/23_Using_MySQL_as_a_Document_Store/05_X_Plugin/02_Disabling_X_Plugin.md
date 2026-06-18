### 22.5.2 Disabling X Plugin

The X Plugin can be disabled at startup by either setting
[`mysqlx=0`](x-plugin-options-system-variables.html#option_mysqld_mysqlx) in your MySQL
configuration file, or by passing in either
[`--mysqlx=0`](x-plugin-options-system-variables.html#option_mysqld_mysqlx) or
[`--skip-mysqlx`](x-plugin-options-system-variables.html#option_mysqld_mysqlx)
when starting the MySQL server.

Alternatively, use the
[`-DWITH_MYSQLX=OFF`](source-configuration-options.html#option_cmake_with_mysqlx) CMake option to
compile MySQL Server without X Plugin.