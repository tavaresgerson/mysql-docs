#### 29.12.22.7 The mysql\_option Table

The `mysql_option` table provides information about options available in the MySQL Server, or in components and plugins that are currently or previously have been installed:

```
mysql> TABLE mysql_option;
+---------------------------+----------------+------------------+
| OPTION_NAME               | OPTION_ENABLED | OPTION_CONTAINER |
+---------------------------+----------------+------------------+
| Binary Log                | TRUE           | mysql_server     |
| Hypergraph Optimizer      | FALSE          | mysql_server     |
| JavaScript Library        | TRUE           | component:mle    |
| JavaScript Stored Program | TRUE           | component:mle    |
| MySQL Server              | TRUE           | mysql_server     |
| Replication Replica       | FALSE          | mysql_server     |
| Traditional Optimizer     | TRUE           | mysql_server     |
| Vector                    | TRUE           | component_vector |
+---------------------------+----------------+------------------+
```

(An “option” in this context refers to a feature of the server, component, or plugin, and not to a command-line option such as those used with **mysqld** or other MySQL programs.)

This table is installed by the Option Tracker component, available with MySQL Enterprise Edition; for more information about the component, see Section 7.5.8, “Option Tracker Component”.

To be shown in this table, a component or plugin must be written and compiled with support for the Option Tracker component. Not all MySQL components and plugins currently available provide such support. See Section 7.5.8.2, “Option Tracker Supported Components”, for a list of those which support the Option Tracker.

The `mysql_option` table has the following columns:

* `OPTION_NAME`

  The name of the option or feature, or `MySQL Server`, as appropriate.

* `OPTION_ENABLED`

  Whether the option or feature is currently enabled. This value is always one of `TRUE` or `FALSE`.

* `OPTION_CONTAINER`

  The name of the option or feature. For the MySQL server, this is `mysql_server`.

This table is read-only, and cannot be truncated, although it is updated by the functions described in Section 7.5.8.5, “Option Tracker Functions”.

Usage data for options and features listed in `mysql_option` can be found in the `mysql_option.option_usage` table, which is described in Section 7.5.8.1, “Option Tracker Tables”.
