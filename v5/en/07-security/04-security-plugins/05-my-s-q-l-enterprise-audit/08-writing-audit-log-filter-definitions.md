#### 6.4.5.8 Writing Audit Log Filter Definitions

Filter definitions are [`JSON`](json.html "11.5 The JSON Data Type") values. For information about using [`JSON`](json.html "11.5 The JSON Data Type") data in MySQL, see [Section 11.5, “The JSON Data Type”](json.html "11.5 The JSON Data Type").

Filter definitions have this form, where *`actions`* indicates how filtering takes place:

```sql
{ "filter": actions }
```

The following discussion describes permitted constructs in filter definitions.

* [Logging All Events](audit-log-filter-definitions.html#audit-log-filtering-enabling-logging "Logging All Events")
* [Logging Specific Event Classes](audit-log-filter-definitions.html#audit-log-filtering-class-logging "Logging Specific Event Classes")
* [Logging Specific Event Subclasses](audit-log-filter-definitions.html#audit-log-filtering-subclass-logging "Logging Specific Event Subclasses")
* [Inclusive and Exclusive Logging](audit-log-filter-definitions.html#audit-log-filtering-inclusive-exclusive "Inclusive and Exclusive Logging")
* [Testing Event Field Values](audit-log-filter-definitions.html#audit-log-filtering-event-fields "Testing Event Field Values")
* [Blocking Execution of Specific Events](audit-log-filter-definitions.html#audit-log-filtering-blocking-events "Blocking Execution of Specific Events")
* [Logical Operators](audit-log-filter-definitions.html#audit-log-filtering-logical-operators "Logical Operators")
* [Referencing Predefined Variables](audit-log-filter-definitions.html#audit-log-filtering-predefined-variables "Referencing Predefined Variables")
* [Referencing Predefined Functions](audit-log-filter-definitions.html#audit-log-filtering-predefined-functions "Referencing Predefined Functions")
* [Replacing a User Filter](audit-log-filter-definitions.html#audit-log-filtering-filter-replacement "Replacing a User Filter")

##### Logging All Events

To explicitly enable or disable logging of all events, use a `log` item in the filter:

```sql
{
  "filter": { "log": true }
}
```

The `log` value can be either `true` or `false`.

The preceding filter enables logging of all events. It is equivalent to:

```sql
{
  "filter": { }
}
```

Logging behavior depends on the `log` value and whether `class` or `event` items are specified:

* With `log` specified, its given value is used.

* Without `log` specified, logging is `true` if no `class` or `event` item is specified, and `false` otherwise (in which case, `class` or `event` can include their own `log` item).

##### Logging Specific Event Classes

To log events of a specific class, use a `class` item in the filter, with its `name` field denoting the name of the class to log:

```sql
{
  "filter": {
    "class": { "name": "connection" }
  }
}
```

The `name` value can be `connection`, `general`, or `table_access` to log connection, general, or table-access events, respectively.

The preceding filter enables logging of events in the `connection` class. It is equivalent to the following filter with `log` items made explicit:

```sql
{
  "filter": {
    "log": false,
    "class": { "log": true,
               "name": "connection" }
  }
}
```

To enable logging of multiple classes, define the `class` value as a [`JSON`](json.html "11.5 The JSON Data Type") array element that names the classes:

```sql
{
  "filter": {
    "class": [
      { "name": "connection" },
      { "name": "general" },
      { "name": "table_access" }
    ]
  }
}
```

Note

When multiple instances of a given item appear at the same level within a filter definition, the item values can be combined into a single instance of that item within an array value. The preceding definition can be written like this:

```sql
{
  "filter": {
    "class": [
      { "name": [ "connection", "general", "table_access" ] }
    ]
  }
}
```

##### Logging Specific Event Subclasses

To select specific event subclasses, use an `event` item containing a `name` item that names the subclasses. The default action for events selected by an `event` item is to log them. For example, this filter enables logging for the named event subclasses:

```sql
{
  "filter": {
    "class": [
      {
        "name": "connection",
        "event": [
          { "name": "connect" },
          { "name": "disconnect" }
        ]
      },
      { "name": "general" },
      {
        "name": "table_access",
        "event": [
          { "name": "insert" },
          { "name": "delete" },
          { "name": "update" }
        ]
      }
    ]
  }
}
```

The `event` item can also contain explicit `log` items to indicate whether to log qualifying events. This `event` item selects multiple events and explicitly indicates logging behavior for them:

```sql
"event": [
  { "name": "read", "log": false },
  { "name": "insert", "log": true },
  { "name": "delete", "log": true },
  { "name": "update", "log": true }
]
```

As of MySQL 5.7.20, the `event` item can also indicate whether to block qualifying events, if it contains an `abort` item. For details, see [Blocking Execution of Specific Events](audit-log-filter-definitions.html#audit-log-filtering-blocking-events "Blocking Execution of Specific Events").

[Table 6.26, “Event Class and Subclass Combinations”](audit-log-filter-definitions.html#audit-log-event-subclass-combinations "Table 6.26 Event Class and Subclass Combinations") describes the permitted subclass values for each event class.

**Table 6.26 Event Class and Subclass Combinations**

<table summary="Permitted combiniations of event class and subclass values."><col style="width: 20%"/><col style="width: 20%"/><col style="width: 60%"/><thead><tr> <th>Event Class</th> <th>Event Subclass</th> <th>Description</th> </tr></thead><tbody><tr> <th><code>connection</code></th> <td><code>connect</code></td> <td>Connection initiation (successful or unsuccessful)</td> </tr><tr> <th><code>connection</code></th> <td><code>change_user</code></td> <td>User re-authentication with different user/password during session</td> </tr><tr> <th><code>connection</code></th> <td><code>disconnect</code></td> <td>Connection termination</td> </tr><tr> <th><code>general</code></th> <td><code>status</code></td> <td>General operation information</td> </tr><tr> <th><code>table_access</code></th> <td><code>read</code></td> <td>Table read statements, such as <a class="link" href="select.html" title="13.2.9 SELECT Statement"><code>SELECT</code></a> or <a class="link" href="insert-select.html" title="13.2.5.1 INSERT ... SELECT Statement"><code>INSERT INTO ... SELECT</code></a></td> </tr><tr> <th><code>table_access</code></th> <td><code>delete</code></td> <td>Table delete statements, such as <a class="link" href="delete.html" title="13.2.2 DELETE Statement"><code>DELETE</code></a> or <a class="link" href="truncate-table.html" title="13.1.34 TRUNCATE TABLE Statement"><code>TRUNCATE TABLE</code></a></td> </tr><tr> <th><code>table_access</code></th> <td><code>insert</code></td> <td>Table insert statements, such as <a class="link" href="insert.html" title="13.2.5 INSERT Statement"><code>INSERT</code></a> or <a class="link" href="replace.html" title="13.2.8 REPLACE Statement"><code>REPLACE</code></a></td> </tr><tr> <th><code>table_access</code></th> <td><code>update</code></td> <td>Table update statements, such as <a class="link" href="update.html" title="13.2.11 UPDATE Statement"><code>UPDATE</code></a></td> </tr></tbody></table>

[Table 6.27, “Log and Abort Characteristics Per Event Class and Subclass Combination”](audit-log-filter-definitions.html#audit-log-event-subclass-log-abort "Table 6.27 Log and Abort Characteristics Per Event Class and Subclass Combination") describes for each event subclass whether it can be logged or aborted.

**Table 6.27 Log and Abort Characteristics Per Event Class and Subclass Combination**

<table summary="Log and abort characteristics for event class and subclass combinations."><col style="width: 20%"/><col style="width: 20%"/><col style="width: 30%"/><col style="width: 30%"/><thead><tr> <th>Event Class</th> <th>Event Subclass</th> <th>Can be Logged</th> <th>Can be Aborted</th> </tr></thead><tbody><tr> <th><code>connection</code></th> <td><code>connect</code></td> <td>Yes</td> <td>No</td> </tr><tr> <th><code>connection</code></th> <td><code>change_user</code></td> <td>Yes</td> <td>No</td> </tr><tr> <th><code>connection</code></th> <td><code>disconnect</code></td> <td>Yes</td> <td>No</td> </tr><tr> <th><code>general</code></th> <td><code>status</code></td> <td>Yes</td> <td>No</td> </tr><tr> <th><code>table_access</code></th> <td><code>read</code></td> <td>Yes</td> <td>Yes</td> </tr><tr> <th><code>table_access</code></th> <td><code>delete</code></td> <td>Yes</td> <td>Yes</td> </tr><tr> <th><code>table_access</code></th> <td><code>insert</code></td> <td>Yes</td> <td>Yes</td> </tr><tr> <th><code>table_access</code></th> <td><code>update</code></td> <td>Yes</td> <td>Yes</td> </tr></tbody></table>

##### Inclusive and Exclusive Logging

A filter can be defined in inclusive or exclusive mode:

* Inclusive mode logs only explicitly specified items.
* Exclusive mode logs everything but explicitly specified items.

To perform inclusive logging, disable logging globally and enable logging for specific classes. This filter logs `connect` and `disconnect` events in the `connection` class, and events in the `general` class:

```sql
{
  "filter": {
    "log": false,
    "class": [
      {
        "name": "connection",
        "event": [
          { "name": "connect", "log": true },
          { "name": "disconnect", "log": true }
        ]
      },
      { "name": "general", "log": true }
    ]
  }
}
```

To perform exclusive logging, enable logging globally and disable logging for specific classes. This filter logs everything except events in the `general` class:

```sql
{
  "filter": {
    "log": true,
    "class":
      { "name": "general", "log": false }
  }
}
```

This filter logs `change_user` events in the `connection` class, and `table_access` events, by virtue of *not* logging everything else:

```sql
{
  "filter": {
    "log": true,
    "class": [
      {
        "name": "connection",
        "event": [
          { "name": "connect", "log": false },
          { "name": "disconnect", "log": false }
        ]
      },
      { "name": "general", "log": false }
    ]
  }
}
```

##### Testing Event Field Values

To enable logging based on specific event field values, specify a `field` item within the `log` item that indicates the field name and its expected value:

```sql
{
  "filter": {
    "class": {
    "name": "general",
      "event": {
        "name": "status",
        "log": {
          "field": { "name": "general_command.str", "value": "Query" }
        }
      }
    }
  }
}
```

Each event contains event class-specific fields that can be accessed from within a filter to perform custom filtering.

An event in the `connection` class indicates when a connection-related activity occurs during a session, such as a user connecting to or disconnecting from the server. [Table 6.28, “Connection Event Fields”](audit-log-filter-definitions.html#audit-log-connection-event-fields "Table 6.28 Connection Event Fields") indicates the permitted fields for `connection` events.

**Table 6.28 Connection Event Fields**

<table summary="Permitted fields for connection events."><col style="width: 35%"/><col style="width: 20%"/><col style="width: 45%"/><thead><tr> <th>Field Name</th> <th>Field Type</th> <th>Description</th> </tr></thead><tbody><tr> <th><code>status</code></th> <td>integer</td> <td><p class="valid-value"> Event status: </p><p class="valid-value"> 0: OK </p><p class="valid-value"> Otherwise: Failed </p></td> </tr><tr> <th><code>connection_id</code></th> <td>unsigned integer</td> <td>Connection ID</td> </tr><tr> <th><code>user.str</code></th> <td>string</td> <td>User name specified during authentication</td> </tr><tr> <th><code>user.length</code></th> <td>unsigned integer</td> <td>User name length</td> </tr><tr> <th><code>priv_user.str</code></th> <td>string</td> <td>Authenticated user name (account user name)</td> </tr><tr> <th><code>priv_user.length</code></th> <td>unsigned integer</td> <td>Authenticated user name length</td> </tr><tr> <th><code>external_user.str</code></th> <td>string</td> <td>External user name (provided by third-party authentication plugin)</td> </tr><tr> <th><code>external_user.length</code></th> <td>unsigned integer</td> <td>External user name length</td> </tr><tr> <th><code>proxy_user.str</code></th> <td>string</td> <td>Proxy user name</td> </tr><tr> <th><code>proxy_user.length</code></th> <td>unsigned integer</td> <td>Proxy user name length</td> </tr><tr> <th><code>host.str</code></th> <td>string</td> <td>Connected user host</td> </tr><tr> <th><code>host.length</code></th> <td>unsigned integer</td> <td>Connected user host length</td> </tr><tr> <th><code>ip.str</code></th> <td>string</td> <td>Connected user IP address</td> </tr><tr> <th><code>ip.length</code></th> <td>unsigned integer</td> <td>Connected user IP address length</td> </tr><tr> <th><code>database.str</code></th> <td>string</td> <td>Database name specified at connect time</td> </tr><tr> <th><code>database.length</code></th> <td>unsigned integer</td> <td>Database name length</td> </tr><tr> <th><code>connection_type</code></th> <td>integer</td> <td><p class="valid-value"> Connection type: </p><p class="valid-value"> 0 or <code>"::undefined"</code>: Undefined </p><p class="valid-value"> 1 or <code>"::tcp/ip"</code>: TCP/IP </p><p class="valid-value"> 2 or <code>"::socket"</code>: Socket </p><p class="valid-value"> 3 or <code>"::named_pipe"</code>: Named pipe </p><p class="valid-value"> 4 or <code>"::ssl"</code>: TCP/IP with encryption </p><p class="valid-value"> 5 or <code>"::shared_memory"</code>: Shared memory </p></td> </tr></tbody></table>

The `"::xxx"` values are symbolic pseudo-constants that may be given instead of the literal numeric values. They must be quoted as strings and are case-sensitive.

An event in the `general` class indicates the status code of an operation and its details. [Table 6.29, “General Event Fields”](audit-log-filter-definitions.html#audit-log-general-event-fields "Table 6.29 General Event Fields") indicates the permitted fields for `general` events.

**Table 6.29 General Event Fields**

<table summary="Permitted field types for general events."><col style="width: 35%"/><col style="width: 20%"/><col style="width: 45%"/><thead><tr> <th>Field Name</th> <th>Field Type</th> <th>Description</th> </tr></thead><tbody><tr> <th><code>general_error_code</code></th> <td>integer</td> <td><p class="valid-value"> Event status: </p><p class="valid-value"> 0: OK </p><p class="valid-value"> Otherwise: Failed </p></td> </tr><tr> <th><code>general_thread_id</code></th> <td>unsigned integer</td> <td>Connection/thread ID</td> </tr><tr> <th><code>general_user.str</code></th> <td>string</td> <td>User name specified during authentication</td> </tr><tr> <th><code>general_user.length</code></th> <td>unsigned integer</td> <td>User name length</td> </tr><tr> <th><code>general_command.str</code></th> <td>string</td> <td>Command name</td> </tr><tr> <th><code>general_command.length</code></th> <td>unsigned integer</td> <td>Command name length</td> </tr><tr> <th><code>general_query.str</code></th> <td>string</td> <td>SQL statement text</td> </tr><tr> <th><code>general_query.length</code></th> <td>unsigned integer</td> <td>SQL statement text length</td> </tr><tr> <th><code>general_host.str</code></th> <td>string</td> <td>Host name</td> </tr><tr> <th><code>general_host.length</code></th> <td>unsigned integer</td> <td>Host name length</td> </tr><tr> <th><code>general_sql_command.str</code></th> <td>string</td> <td>SQL command type name</td> </tr><tr> <th><code>general_sql_command.length</code></th> <td>unsigned integer</td> <td>SQL command type name length</td> </tr><tr> <th><code>general_external_user.str</code></th> <td>string</td> <td>External user name (provided by third-party authentication plugin)</td> </tr><tr> <th><code>general_external_user.length</code></th> <td>unsigned integer</td> <td>External user name length</td> </tr><tr> <th><code>general_ip.str</code></th> <td>string</td> <td>Connected user IP address</td> </tr><tr> <th><code>general_ip.length</code></th> <td>unsigned integer</td> <td>Connection user IP address length</td> </tr></tbody></table>

`general_command.str` indicates a command name: `Query`, `Execute`, `Quit`, or `Change user`.

A `general` event with the `general_command.str` field set to `Query` or `Execute` contains `general_sql_command.str` set to a value that specifies the type of SQL command: `alter_db`, `alter_db_upgrade`, `admin_commands`, and so forth. The available `general_sql_command.str` values can be seen as the last components of the Performance Schema instruments displayed by this statement:

```sql
mysql> SELECT NAME FROM performance_schema.setup_instruments
       WHERE NAME LIKE 'statement/sql/%' ORDER BY NAME;
+---------------------------------------+
| NAME                                  |
+---------------------------------------+
| statement/sql/alter_db                |
| statement/sql/alter_db_upgrade        |
| statement/sql/alter_event             |
| statement/sql/alter_function          |
| statement/sql/alter_instance          |
| statement/sql/alter_procedure         |
| statement/sql/alter_server            |
...
```

An event in the `table_access` class provides information about a specific type of access to a table. [Table 6.30, “Table-Access Event Fields”](audit-log-filter-definitions.html#audit-log-table-access-event-fields "Table 6.30 Table-Access Event Fields") indicates the permitted fields for `table_access` events.

**Table 6.30 Table-Access Event Fields**

<table summary="Permitted fields for table-access events."><col style="width: 35%"/><col style="width: 20%"/><col style="width: 45%"/><thead><tr> <th>Field Name</th> <th>Field Type</th> <th>Description</th> </tr></thead><tbody><tr> <th><code>connection_id</code></th> <td>unsigned integer</td> <td>Event connection ID</td> </tr><tr> <th><code>sql_command_id</code></th> <td>integer</td> <td>SQL command ID</td> </tr><tr> <th><code>query.str</code></th> <td>string</td> <td>SQL statement text</td> </tr><tr> <th><code>query.length</code></th> <td>unsigned integer</td> <td>SQL statement text length</td> </tr><tr> <th><code>table_database.str</code></th> <td>string</td> <td>Database name associated with event</td> </tr><tr> <th><code>table_database.length</code></th> <td>unsigned integer</td> <td>Database name length</td> </tr><tr> <th><code>table_name.str</code></th> <td>string</td> <td>Table name associated with event</td> </tr><tr> <th><code>table_name.length</code></th> <td>unsigned integer</td> <td>Table name length</td> </tr></tbody></table>

The following list shows which statements produce which table-access events:

* `read` event:

  + `SELECT`
  + `INSERT ... SELECT` (for tables referenced in `SELECT` clause)

  + `REPLACE ... SELECT` (for tables referenced in `SELECT` clause)

  + `UPDATE ... WHERE` (for tables referenced in `WHERE` clause)

  + `HANDLER ... READ`
* `delete` event:

  + `DELETE`
  + `TRUNCATE TABLE`
* `insert` event:

  + `INSERT`
  + `INSERT ... SELECT` (for table referenced in `INSERT` clause)

  + `REPLACE`
  + `REPLACE ... SELECT` (for table referenced in `REPLACE` clause

  + `LOAD DATA`
  + `LOAD XML`
* `update` event:

  + `UPDATE`
  + `UPDATE ... WHERE` (for tables referenced in `UPDATE` clause)

##### Blocking Execution of Specific Events

As of MySQL 5.7.20, `event` items can include an `abort` item that indicates whether to prevent qualifying events from executing. `abort` enables rules to be written that block execution of specific SQL statements.

The `abort` item must appear within an `event` item. For example:

```sql
"event": {
  "name": qualifying event subclass names
  "abort": condition
}
```

For event subclasses selected by the `name` item, the `abort` action is true or false, depending on *`condition`* evaluation. If the condition evaluates to true, the event is blocked. Otherwise, the event continues executing.

The *`condition`* specification can be as simple as `true` or `false`, or it can be more complex such that evaluation depends on event characteristics.

This filter blocks [`INSERT`](insert.html "13.2.5 INSERT Statement"), [`UPDATE`](update.html "13.2.11 UPDATE Statement"), and [`DELETE`](delete.html "13.2.2 DELETE Statement") statements:

```sql
{
  "filter": {
    "class": {
      "name": "table_access",
      "event": {
        "name": [ "insert", "update", "delete" ],
        "abort": true
      }
    }
  }
}
```

This more complex filter blocks the same statements, but only for a specific table (`finances.bank_account`):

```sql
{
  "filter": {
    "class": {
      "name": "table_access",
      "event": {
        "name": [ "insert", "update", "delete" ],
        "abort": {
          "and": [
            { "field": { "name": "table_database.str", "value": "finances" } },
            { "field": { "name": "table_name.str", "value": "bank_account" } }
          ]
        }
      }
    }
  }
}
```

Statements matched and blocked by the filter return an error to the client:

```sql
ERROR 1045 (28000): Statement was aborted by an audit log filter
```

Not all events can be blocked (see [Table 6.27, “Log and Abort Characteristics Per Event Class and Subclass Combination”](audit-log-filter-definitions.html#audit-log-event-subclass-log-abort "Table 6.27 Log and Abort Characteristics Per Event Class and Subclass Combination")). For an event that cannot be blocked, the audit log writes a warning to the error log rather than blocking it.

For attempts to define a filter in which the `abort` item appears elsewhere than in an `event` item, an error occurs.

##### Logical Operators

Logical operators (`and`, `or`, `not`) permit construction of complex conditions, enabling more advanced filtering configurations to be written. The following `log` item logs only `general` events with `general_command` fields having a specific value and length:

```sql
{
  "filter": {
    "class": {
      "name": "general",
      "event": {
        "name": "status",
        "log": {
          "or": [
            {
              "and": [
                { "field": { "name": "general_command.str",    "value": "Query" } },
                { "field": { "name": "general_command.length", "value": 5 } }
              ]
            },
            {
              "and": [
                { "field": { "name": "general_command.str",    "value": "Execute" } },
                { "field": { "name": "general_command.length", "value": 7 } }
              ]
            }
          ]
        }
      }
    }
  }
}
```

##### Referencing Predefined Variables

To refer to a predefined variable in a `log` condition, use a `variable` item, which takes `name` and `value` items and tests equality of the named variable against a given value:

```sql
"variable": {
  "name": "variable_name",
  "value": comparison_value
}
```

This is true if *`variable_name`* has the value *`comparison_value`*, false otherwise.

Example:

```sql
{
  "filter": {
    "class": {
      "name": "general",
      "event": {
        "name": "status",
        "log": {
          "variable": {
            "name": "audit_log_connection_policy_value",
            "value": "::none"
          }
        }
      }
    }
  }
}
```

Each predefined variable corresponds to a system variable. By writing a filter that tests a predefined variable, you can modify filter operation by setting the corresponding system variable, without having to redefine the filter. For example, by writing a filter that tests the value of the `audit_log_connection_policy_value` predefined variable, you can modify filter operation by changing the value of the [`audit_log_connection_policy`](audit-log-reference.html#sysvar_audit_log_connection_policy) system variable.

The `audit_log_xxx_policy` system variables are used for the legacy mode audit log (see [Section 6.4.5.10, “Legacy Mode Audit Log Filtering”](audit-log-legacy-filtering.html "6.4.5.10 Legacy Mode Audit Log Filtering")). With rule-based audit log filtering, those variables remain visible (for example, using [`SHOW VARIABLES`](show-variables.html "13.7.5.39 SHOW VARIABLES Statement")), but changes to them have no effect unless you write filters containing constructs that refer to them.

The following list describes the permitted predefined variables for `variable` items:

* `audit_log_connection_policy_value`

  This variable corresponds to the value of the [`audit_log_connection_policy`](audit-log-reference.html#sysvar_audit_log_connection_policy) system variable. The value is an unsigned integer. [Table 6.31, “audit\_log\_connection\_policy\_value Values”](audit-log-filter-definitions.html#audit-log-connection-policy-value-values "Table 6.31 audit_log_connection_policy_value Values") shows the permitted values and the corresponding [`audit_log_connection_policy`](audit-log-reference.html#sysvar_audit_log_connection_policy) values.

  **Table 6.31 audit\_log\_connection\_policy\_value Values**

  <table summary="Permitted audit_log_connection_policy_value values and the corresponding audit_log_connection_policy values."><col style="width: 20%"/><col style="width: 80%"/><thead><tr> <th>Value</th> <th>Corresponding audit_log_connection_policy Value</th> </tr></thead><tbody><tr> <td><code>0</code> or <code>"::none"</code></td> <td><code>NONE</code></td> </tr><tr> <td><code>1</code> or <code>"::errors"</code></td> <td><code>ERRORS</code></td> </tr><tr> <td><code>2</code> or <code>"::all"</code></td> <td><code>ALL</code></td> </tr></tbody></table>

  The `"::xxx"` values are symbolic pseudo-constants that may be given instead of the literal numeric values. They must be quoted as strings and are case-sensitive.

* `audit_log_policy_value`

  This variable corresponds to the value of the [`audit_log_policy`](audit-log-reference.html#sysvar_audit_log_policy) system variable. The value is an unsigned integer. [Table 6.32, “audit\_log\_policy\_value Values”](audit-log-filter-definitions.html#audit-log-policy-value-values "Table 6.32 audit_log_policy_value Values") shows the permitted values and the corresponding [`audit_log_policy`](audit-log-reference.html#sysvar_audit_log_policy) values.

  **Table 6.32 audit\_log\_policy\_value Values**

  <table summary="Permitted audit_log_policy_value values and the corresponding audit_log_policy values."><col style="width: 20%"/><col style="width: 80%"/><thead><tr> <th>Value</th> <th>Corresponding audit_log_policy Value</th> </tr></thead><tbody><tr> <td><code>0</code> or <code>"::none"</code></td> <td><code>NONE</code></td> </tr><tr> <td><code>1</code> or <code>"::logins"</code></td> <td><code>LOGINS</code></td> </tr><tr> <td><code>2</code> or <code>"::all"</code></td> <td><code>ALL</code></td> </tr><tr> <td><code>3</code> or <code>"::queries"</code></td> <td><code>QUERIES</code></td> </tr></tbody></table>

  The `"::xxx"` values are symbolic pseudo-constants that may be given instead of the literal numeric values. They must be quoted as strings and are case-sensitive.

* `audit_log_statement_policy_value`

  This variable corresponds to the value of the [`audit_log_statement_policy`](audit-log-reference.html#sysvar_audit_log_statement_policy) system variable. The value is an unsigned integer. [Table 6.33, “audit\_log\_statement\_policy\_value Values”](audit-log-filter-definitions.html#audit-log-statement-policy-value-values "Table 6.33 audit_log_statement_policy_value Values") shows the permitted values and the corresponding [`audit_log_statement_policy`](audit-log-reference.html#sysvar_audit_log_statement_policy) values.

  **Table 6.33 audit\_log\_statement\_policy\_value Values**

  <table summary="Permitted audit_log_statement_policy_value values and the corresponding audit_log_statement_policy values."><col style="width: 20%"/><col style="width: 80%"/><thead><tr> <th>Value</th> <th>Corresponding audit_log_statement_policy Value</th> </tr></thead><tbody><tr> <td><code>0</code> or <code>"::none"</code></td> <td><code>NONE</code></td> </tr><tr> <td><code>1</code> or <code>"::errors"</code></td> <td><code>ERRORS</code></td> </tr><tr> <td><code>2</code> or <code>"::all"</code></td> <td><code>ALL</code></td> </tr></tbody></table>

  The `"::xxx"` values are symbolic pseudo-constants that may be given instead of the literal numeric values. They must be quoted as strings and are case-sensitive.

##### Referencing Predefined Functions

To refer to a predefined function in a `log` condition, use a `function` item, which takes `name` and `args` items to specify the function name and its arguments, respectively:

```sql
"function": {
  "name": "function_name",
  "args": arguments
}
```

The `name` item should specify the function name only, without parentheses or the argument list.

The `args` item must satisfy these conditions:

* If the function takes no arguments, no `args` item should be given.

* If the function does take arguments, an `args` item is needed, and the arguments must be given in the order listed in the function description. Arguments can refer to predefined variables, event fields, or string or numeric constants.

If the number of arguments is incorrect or the arguments are not of the correct data types required by the function an error occurs.

Example:

```sql
{
  "filter": {
    "class": {
      "name": "general",
      "event": {
        "name": "status",
        "log": {
          "function": {
            "name": "find_in_include_list",
            "args": [ { "string": [ { "field": "user.str" },
                                    { "string": "@"},
                                    { "field": "host.str" } ] } ]
          }
        }
      }
    }
  }
}
```

The preceding filter determines whether to log `general` class `status` events depending on whether the current user is found in the [`audit_log_include_accounts`](audit-log-reference.html#sysvar_audit_log_include_accounts) system variable. That user is constructed using fields in the event.

The following list describes the permitted predefined functions for `function` items:

* `audit_log_exclude_accounts_is_null()`

  Checks whether the [`audit_log_exclude_accounts`](audit-log-reference.html#sysvar_audit_log_exclude_accounts) system variable is `NULL`. This function can be helpful when defining filters that correspond to the legacy audit log implementation.

  Arguments:

  None.

* `audit_log_include_accounts_is_null()`

  Checks whether the [`audit_log_include_accounts`](audit-log-reference.html#sysvar_audit_log_include_accounts) system variable is `NULL`. This function can be helpful when defining filters that correspond to the legacy audit log implementation.

  Arguments:

  None.

* `debug_sleep(millisec)`

  Sleeps for the given number of milliseconds. This function is used during performance measurement.

  `debug_sleep()` is available for debug builds only.

  Arguments:

  + *`millisec`*: An unsigned integer that specifies the number of milliseconds to sleep.

* `find_in_exclude_list(account)`

  Checks whether an account string exists in the audit log exclude list (the value of the [`audit_log_exclude_accounts`](audit-log-reference.html#sysvar_audit_log_exclude_accounts) system variable).

  Arguments:

  + *`account`*: A string that specifies the user account name.

* `find_in_include_list(account)`

  Checks whether an account string exists in the audit log include list (the value of the [`audit_log_include_accounts`](audit-log-reference.html#sysvar_audit_log_include_accounts) system variable).

  Arguments:

  + *`account`*: A string that specifies the user account name.

* `string_find(text, substr)`

  Checks whether the `substr` value is contained in the `text` value. This search is case-sensitive.

  Arguments:

  + *`text`*: The text string to search.

  + *`substr`*: The substring to search for in *`text`*.

##### Replacing a User Filter

In some cases, the filter definition can be changed dynamically. To do this, define a `filter` configuration within an existing `filter`. For example:

```sql
{
  "filter": {
    "id": "main",
    "class": {
      "name": "table_access",
      "event": {
        "name": [ "update", "delete" ],
        "log": false,
        "filter": {
          "class": {
            "name": "general",
            "event" : { "name": "status",
                        "filter": { "ref": "main" } }
          },
          "activate": {
            "or": [
              { "field": { "name": "table_name.str", "value": "temp_1" } },
              { "field": { "name": "table_name.str", "value": "temp_2" } }
            ]
          }
        }
      }
    }
  }
}
```

A new filter is activated when the `activate` item within a subfilter evaluates to `true`. Using `activate` in a top-level `filter` is not permitted.

A new filter can be replaced with the original one by using a `ref` item inside the subfilter to refer to the original filter `id`.

The filter shown operates like this:

* The `main` filter waits for `table_access` events, either `update` or `delete`.

* If the `update` or `delete` `table_access` event occurs on the `temp_1` or `temp_2` table, the filter is replaced with the internal one (without an `id`, since there is no need to refer to it explicitly).

* If the end of the command is signalled (`general` / `status` event), an entry is written to the audit log file and the filter is replaced with the `main` filter.

The filter is useful to log statements that update or delete anything from the `temp_1` or `temp_2` tables, such as this one:

```sql
UPDATE temp_1, temp_3 SET temp_1.a=21, temp_3.a=23;
```

The statement generates multiple `table_access` events, but the audit log file contains only `general` or `status` entries.

Note

Any `id` values used in the definition are evaluated with respect only to that definition. They have nothing to do with the value of the [`audit_log_filter_id`](audit-log-reference.html#sysvar_audit_log_filter_id) system variable.
