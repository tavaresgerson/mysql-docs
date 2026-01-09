#### 7.5.8.5 Option Tracker Functions

The Option Tracker provides the functions shown in the next table. More detailed information about each function is provided in the list following the table.

These functions provide safe interfaces for reading and updating the `mysql_option.option_usage` table (see Section 7.5.8.1, “Option Tracker Tables”) and `performance_schema.mysql_option` table; in addition, changes made using the functions are propagated to Group Replication secondaries whereas changes made using SQL are not. For these reasons, you should always use the Option Tracker functions for modifying option usage data instead of attempting to update either of these tables directly.

**Table 7.11 Option Tracker Functions**

<table frame="box" rules="all" summary="A reference that lists functions provided by the Option Tracker Component."><col style="width: 28%"/><col style="width: 71%"/><thead><tr><th>Name</th> <th>Description</th> </tr></thead><tbody><tr><td><code class="literal">option_tracker_option_register()</code></td> <td> Register an option with the Option Tracker </td> </tr><tr><td><code class="literal">option_tracker_option_unregister()</code></td> <td> Deregister an option from the Option Tracker </td> </tr><tr><td><code class="literal">option_tracker_usage_get()</code></td> <td> Get usage data for an option registered with the Option Tracker </td> </tr><tr><td><code class="literal">option_tracker_usage_set()</code></td> <td> Set usage data for an option registered with the Option Tracker </td> </tr></tbody></table>

* `option_tracker_option_register()`

  This function registers the option with the supplied option name, container name and *`enabled`* value with the Option Tracker; that is, a row corresponding to this option is inserted into the Performance Schema `mysql_option` table.

  Syntax:

  ```
  int option_tracker_option_register(
    string option_name,
    string container_name
    int enabled
  )
  ```

  Arguments:

  + *`option_name`*: The name of the option. This is a case-insensitive string. This argument cannot be null, although it can be an empty string.

  + *`container_name`*: The name of the container. This argument is case-insensitive, and cannot be an empty string or null.

  + *`enabled`*: `1` if the option is enabled, `0` if disabled.

  Return value:

  `0` on success, a nonzero value otherwise. The nonzero value is usually `1`, but this is not guaranteed.

  Example:

  ```
  mysql> SELECT option_tracker_option_register('Berry Picker', 'component_berry_picker', 0);
  +-----------------------------------------------------------------------------+
  | option_tracker_option_register('Berry Picker', 'component_berry_picker', 0) |
  +-----------------------------------------------------------------------------+
  |                                                                           0 |
  +-----------------------------------------------------------------------------+
  ```

  You can verify that the option was registered by querying the `mysql_option` table, like this:

  ```
  mysql> SELECT * FROM performance_schema.mysql_option WHERE OPTION_NAME='Berry Picker';
  +--------------+----------------+------------------------+
  | OPTION_NAME  | OPTION_ENABLED | OPTION_CONTAINER       |
  +--------------+----------------+------------------------+
  | Berry Picker | FALSE          | component_berry_picker |
  +--------------+----------------+------------------------+
  ```

  It is not required that the named container actually exist for this function to work.

  The caller must have the `OPTION_TRACKER_UPDATER` privilege; this privilege must always be granted explicitly.

  Successive calls to this function have no effect on the `mysql_option` table and return `1`, indicating that the function call did not succeed; to change a given option's status from disabled to enabled, it is necessary to deregister it using `option_tracker_option_unregister()`, then to re-register it, like this:

  ```
  mysql> SELECT option_tracker_option_register('Berry Picker', 'component_berry_picker', 0);
  +-----------------------------------------------------------------------------+
  | option_tracker_option_register('Berry Picker', 'component_berry_picker', 0) |
  +-----------------------------------------------------------------------------+
  |                                                                           0 |
  +-----------------------------------------------------------------------------+

  mysql> SELECT * FROM performance_schema.mysql_option WHERE OPTION_NAME='Berry Picker';
  +--------------+----------------+------------------------+
  | OPTION_NAME  | OPTION_ENABLED | OPTION_CONTAINER       |
  +--------------+----------------+------------------------+
  | Berry Picker | FALSE          | component_berry_picker |
  +--------------+----------------+------------------------+

  mysql> SELECT option_tracker_option_register('Berry Picker', 'component_berry_picker', 1);
  +-----------------------------------------------------------------------------+
  | option_tracker_option_register('Berry Picker', 'component_berry_picker', 1) |
  +-----------------------------------------------------------------------------+
  |                                                                           1 |
  +-----------------------------------------------------------------------------+

  mysql> SELECT * FROM performance_schema.mysql_option WHERE OPTION_NAME='Berry Picker';
  +--------------+----------------+------------------------+
  | OPTION_NAME  | OPTION_ENABLED | OPTION_CONTAINER       |
  +--------------+----------------+------------------------+
  | Berry Picker | FALSE          | component_berry_picker |
  +--------------+----------------+------------------------+

  mysql> SELECT option_tracker_option_unregister('Berry Picker');
  +--------------------------------------------------+
  | option_tracker_option_unregister('Berry Picker') |
  +--------------------------------------------------+
  |                                                0 |
  +--------------------------------------------------+

  mysql> SELECT * FROM performance_schema.mysql_option WHERE OPTION_NAME='Berry Picker';
  Empty set (0.00 sec)

  mysql> SELECT option_tracker_option_register('Berry Picker', 'component_berry_picker', 1);
  +-----------------------------------------------------------------------------+
  | option_tracker_option_register('Berry Picker', 'component_berry_picker', 1) |
  +-----------------------------------------------------------------------------+
  |                                                                           0 |
  +-----------------------------------------------------------------------------+

  mysql> SELECT * FROM performance_schema.mysql_option WHERE OPTION_NAME='Berry Picker';
  +--------------+----------------+------------------------+
  | OPTION_NAME  | OPTION_ENABLED | OPTION_CONTAINER       |
  +--------------+----------------+------------------------+
  | Berry Picker | TRUE           | component_berry_picker |
  +--------------+----------------+------------------------+
  ```

  Calls to this function do not update the `mysql_option.option_usage` table; to add or update usage information, use `option_tracker_usage_set()`.

* `option_tracker_option_unregister()`

  This function deregisters an option that was previously registered; that is, it removes the corresponding row from the `mysql_option` table.

  Syntax:

  ```
  int option_tracker_option_unregister(
    string option_name
  )
  ```

  Arguments:

  *`option_name`*: The name of the option to be deregistered. This is a case-insensitive string, which cannot be null but can be an empty string.

  Return value:

  `0` on success, a nonzero value otherwise. The nonzero value is usually `1`, but this is not guaranteed.

  Example:

  ```
  mysql> SELECT * FROM performance_schema.mysql_option
      ->   WHERE OPTION_NAME='Berry Picker';
  +--------------+----------------+------------------------+
  | OPTION_NAME  | OPTION_ENABLED | OPTION_CONTAINER       |
  +--------------+----------------+------------------------+
  | Berry Picker | TRUE           | component_berry_picker |
  +--------------+----------------+------------------------+

  mysql> SELECT option_tracker_option_unregister('Berry Picker');
  +--------------------------------------------------+
  | option_tracker_option_unregister('berry picker') |
  +--------------------------------------------------+
  |                                                0 |
  +--------------------------------------------------+


  mysql> SELECT * FROM performance_schema.mysql_option
      -> WHERE OPTION_NAME='Berry Picker';
  Empty set (0.00 sec)
  ```

  As noted previously, the option name is case-insensitive, as shown here:

  ```
  mysql> SELECT * FROM performance_schema.mysql_option
      ->   WHERE OPTION_NAME='Berry Picker';
  +--------------+----------------+------------------------+
  | OPTION_NAME  | OPTION_ENABLED | OPTION_CONTAINER       |
  +--------------+----------------+------------------------+
  | Berry Picker | TRUE           | component_berry_picker |
  +--------------+----------------+------------------------+

  mysql> SELECT option_tracker_option_unregister('berry picker');
  +--------------------------------------------------+
  | option_tracker_option_unregister('berry picker') |
  +--------------------------------------------------+
  |                                                0 |
  +--------------------------------------------------+

  mysql> SELECT * FROM performance_schema.mysql_option
      ->   WHERE OPTION_NAME='Berry Picker';
  Empty set (0.00 sec)
  ```

  `option_tracker_option_unregister()` returns a nonzero value indicating failure if no row corresponding to the option name is found in the `mysql_option` table.

* `option_tracker_usage_get()`

  This function returns the same value as the following query:

  ```
  mysql> SELECT USAGE_DATA FROM mysql_option.option_usage
      ->   WHERE OPTION_NAME='JavaScript Stored Program';
  +-------------------------------------------------------+
  | USAGE_DATA                                            |
  +-------------------------------------------------------+
  | {"used": "false", "usedDate": "2024-10-17T20:24:41Z"} |
  +-------------------------------------------------------+
  ```

  Syntax:

  ```
  string option_tracker_usage_get(
    option_name
  )
  ```

  Arguments:

  *`option_name`*: A case-insensitive string.

  Return value: A string in `JSON` format. See the description of the `option_tracker_usage_set()` function for more information about this value.

  Example:

  ```
  mysql> SELECT option_tracker_usage_get('Berry Picker');
  +----------------------------------------------------+
  | option_tracker_usage_get('Berry Picker')           |
  +----------------------------------------------------+
  | {"used": true, "usedDate": "2024-10-16T09:14:41Z"} |
  +----------------------------------------------------+
  ```

* `option_tracker_usage_set()`

  Sets usage data for the named option.

  Syntax:

  ```
  int option_tracker_usage_set(
    string option_name,
    string usage_data
  )
  ```

  Arguments:

  + *`option_name`*: The option name, a case-insensitive string. This can be an empty string, but must not be null.

  + *`usage_data`*: The usage data to record for the named option. This should be a JSON-formatted string, which usually takes the form shown here:

    ```
    {
      "used": "boolean"
      "usedDate": "ISO8601 date"
    }
    ```

    The `used` key should be `true` if the option has been used during the current session, and `false` otherwise. `usedDate` should be a quoted date-and-time value in [ISO 8601 format](https://www.iso.org/iso-8601-date-and-time-format.html), for example, `"2024-10-17T20:24:41Z"`. While this is not a requirement, it is normally expected that this is the current UTC date and time. You can obtain this value, using `UTC_DATE()` and `UTC_TIME()`, similarly to what is shown here (emphasized text):

    ```
    SELECT option_tracker_option_set(
      'Berry Picker',
      CONCAT(UTC_DATE(), 'T', UTC_TIME(), 'Z')
    );
    ```

    The form of *`usage_data`* shown, with the keys `used` and `usedDate`, is the recommended one. It is possible to include other keys and values in the `JSON` string, but it is also possible that they may not be read, understood, or even allowed by other applications.

  Return type:

  An integer: `0` on success, and a nonzero value (usually `1`) otherwise.

  Example:

  ```
  mysql> SELECT option_tracker_usage_set(
      ->   'Berry Picker', '{"used": true, "usedDate": "2024-10-17T20:38:23Z"}');
  +------------------------------------------------------------------------------------------------+
  | option_tracker_usage_set('Berry Picker', '{"used": true, "usedDate": "2024-10-17T20:38:23Z"}') |
  +------------------------------------------------------------------------------------------------+
  |                                                                                              0 |
  +------------------------------------------------------------------------------------------------+

  mysql> SELECT option_tracker_usage_get('Berry Picker');
  +----------------------------------------------------+
  | option_tracker_usage_get('Berry Picker')           |
  +----------------------------------------------------+
  | {"used": true, "usedDate": "2024-10-17T20:38:23Z"} |
  +----------------------------------------------------+
  ```

`option_tracker_usage_set()` requires that the user calling the function be granted the `OPTION_TRACKER_UPDATER` privilege explicitly; `option_tracker_usage_get()` requires either of `OPTION_TRACKER_UPDATER` or `OPTION_TRACKER_OBSERVER`. This is true even for the MySQL `root` user.
