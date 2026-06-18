### 10.3.2 Server Character Set and Collation

MySQL Server has a server character set and a server collation.
By default, these are `latin1` and
`latin1_swedish_ci`, but they can be set
explicitly at server startup on the command line or in an option
file and changed at runtime.

Initially, the server character set and collation depend on the
options that you use when you start [`mysqld`](mysqld.html "4.3.1 mysqld — The MySQL Server").
You can use
[`--character-set-server`](server-system-variables.html#sysvar_character_set_server) for the
character set. Along with it, you can add
[`--collation-server`](server-system-variables.html#sysvar_collation_server) for the
collation. If you don't specify a character set, that is the
same as saying
[`--character-set-server=latin1`](server-system-variables.html#sysvar_character_set_server). If
you specify only a character set (for example,
`latin1`) but not a collation, that is the same
as saying
[`--character-set-server=latin1`](server-system-variables.html#sysvar_character_set_server)
[`--collation-server=latin1_swedish_ci`](server-system-variables.html#sysvar_collation_server)
because `latin1_swedish_ci` is the default
collation for `latin1`. Therefore, the
following three commands all have the same effect:

```sql
mysqld
mysqld --character-set-server=latin1
mysqld --character-set-server=latin1 \
  --collation-server=latin1_swedish_ci
```

One way to change the settings is by recompiling. To change the
default server character set and collation when building from
sources, use the [`DEFAULT_CHARSET`](source-configuration-options.html#option_cmake_default_charset)
and [`DEFAULT_COLLATION`](source-configuration-options.html#option_cmake_default_collation) options for
**CMake**. For example:

```sql
cmake . -DDEFAULT_CHARSET=latin1
```

Or:

```sql
cmake . -DDEFAULT_CHARSET=latin1 \
  -DDEFAULT_COLLATION=latin1_german1_ci
```

Both [`mysqld`](mysqld.html "4.3.1 mysqld — The MySQL Server") and **CMake**
verify that the character set/collation combination is valid. If
not, each program displays an error message and terminates.

The server character set and collation are used as default
values if the database character set and collation are not
specified in [`CREATE DATABASE`](create-database.html "13.1.11 CREATE DATABASE Statement")
statements. They have no other purpose.

The current server character set and collation can be determined
from the values of the
[`character_set_server`](server-system-variables.html#sysvar_character_set_server) and
[`collation_server`](server-system-variables.html#sysvar_collation_server) system
variables. These variables can be changed at runtime.