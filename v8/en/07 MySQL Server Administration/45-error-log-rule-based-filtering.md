#### 7.4.2.6 Rule-Based Error Log Filtering (`log_filter_dragnet`)

The `log_filter_dragnet` log filter component enables log filtering based on user-defined rules.

To enable the `log_filter_dragnet` filter, first load the filter component, then modify the `log_error_services` value. The following example enables `log_filter_dragnet` in combination with the built-in log sink:

```
INSTALL COMPONENT 'file://component_log_filter_dragnet';
SET GLOBAL log_error_services = 'log_filter_dragnet; log_sink_internal';
```

To set  `log_error_services` to take effect at server startup, use the instructions at Section 7.4.2.1, “Error Log Configuration”. Those instructions apply to other error-logging system variables as well.

With `log_filter_dragnet` enabled, define its filter rules by setting the `dragnet.log_error_filter_rules` system variable. A rule set consists of zero or more rules, where each rule is an `IF` statement terminated by a period (`.`) character. If the variable value is empty (zero rules), no filtering occurs.

Example 1. This rule set drops information events, and, for other events, removes the `source_line` field:

```
SET GLOBAL dragnet.log_error_filter_rules =
  'IF prio>=INFORMATION THEN drop. IF EXISTS source_line THEN unset source_line.';
```

The effect is similar to the filtering performed by the `log_sink_internal` filter with a setting of `log_error_verbosity=2`.

For readability, you might find it preferable to list the rules on separate lines. For example:

```
SET GLOBAL dragnet.log_error_filter_rules = '
  IF prio>=INFORMATION THEN drop.
  IF EXISTS source_line THEN unset source_line.
';
```

Example 2: This rule limits information events to no more than one per 60 seconds:

```
SET GLOBAL dragnet.log_error_filter_rules =
  'IF prio>=INFORMATION THEN throttle 1/60.';
```

Once you have the filtering configuration set up as you desire, consider assigning `dragnet.log_error_filter_rules` using `SET PERSIST` rather than `SET GLOBAL` to make the setting persist across server restarts. Alternatively, add the setting to the server option file.

When using `log_filter_dragnet`, `log_error_suppression_list` is ignored.

To stop using the filtering language, first remove it from the set of error logging components. Usually this means using a different filter component rather than no filter component. For example:

```
SET GLOBAL log_error_services = 'log_filter_internal; log_sink_internal';
```

Again, consider using `SET PERSIST` rather than `SET GLOBAL` to make the setting persist across server restarts.

Then uninstall the filter `log_filter_dragnet` component:

```
UNINSTALL COMPONENT 'file://component_log_filter_dragnet';
```

The following sections describe aspects of `log_filter_dragnet` operation in more detail:

*  Grammar for `log_filter_dragnet` Rule Language
*  Actions for `log_filter_dragnet` Rules
*  Field References in `log_filter_dragnet` Rules

##### Grammar for `log_filter_dragnet` Rule Language

The following grammar defines the language for `log_filter_dragnet` filter rules. Each rule is an `IF` statement terminated by a period (`.`) character. The language is not case-sensitive.

```
rule:
    IF condition THEN action
    [ELSEIF condition THEN action] ...
    [ELSE action]
    .

condition: {
    field comparator value
  | [NOT] EXISTS field
  | condition {AND | OR}  condition
}

action: {
    drop
  | throttle {count | count / window_size}
  | set field [:= | =] value
  | unset [field]
}

field: {
    core_field
  | optional_field
  | user_defined_field
}

core_field: {
    time
  | msg
  | prio
  | err_code
  | err_symbol
  | SQL_state
  | subsystem
}

optional_field: {
    OS_errno
  | OS_errmsg
  | label
  | user
  | host
  | thread
  | query_id
  | source_file
  | source_line
  | function
  | component
}

user_defined_field:
    sequence of characters in [a-zA-Z0-9_] class

comparator: {== | != | <> | >= | => | <= | =< | < | >}

value: {
    string_literal
  | integer_literal
  | float_literal
  | error_symbol
  | priority
}

count: integer_literal
window_size: integer_literal

string_literal:
    sequence of characters quoted as '...' or "..."

integer_literal:
    sequence of characters in [0-9] class

float_literal:
    integer_literal[.integer_literal]

error_symbol:
    valid MySQL error symbol such as ER_ACCESS_DENIED_ERROR or ER_STARTUP

priority: {
    ERROR
  | WARNING
  | INFORMATION
}
```

Simple conditions compare a field to a value or test field existence. To construct more complex conditions, use the `AND` and `OR` operators. Both operators have the same precedence and evaluate left to right.

To escape a character within a string, precede it by a backslash (`\`). A backslash is required to include backslash itself or the string-quoting character, optional for other characters.

For convenience, `log_filter_dragnet` supports symbolic names for comparisons to certain fields. For readability and portability, symbolic values are preferable (where applicable) to numeric values.

* Event priority values 1, 2, and 3 can be specified as `ERROR`, `WARNING`, and `INFORMATION`. Priority symbols are recognized only in comparisons with the `prio` field. These comparisons are equivalent:

  ```
  IF prio == INFORMATION THEN ...
  IF prio == 3 THEN ...
  ```
* Error codes can be specified in numeric form or as the corresponding error symbol. For example, `ER_STARTUP` is the symbolic name for error `1408`, so these comparisons are equivalent:

  ```
  IF err_code == ER_STARTUP THEN ...
  IF err_code == 1408 THEN ...
  ```

  Error symbols are recognized only in comparisons with the `err_code` field and user-defined fields.

  To find the error symbol corresponding to a given error code number, use one of these methods:

  + Check the list of server errors at Server Error Message Reference.
  + Use the   `perror` command. Given an error number argument,   `perror` displays information about the error, including its symbol.

  Suppose that a rule set with error numbers looks like this:

  ```
  IF err_code == 10927 OR err_code == 10914 THEN drop.
  IF err_code == 1131 THEN drop.
  ```

  Using   `perror`, determine the error symbols:

  ```
  $> perror 10927 10914 1131
  MySQL error code MY-010927 (ER_ACCESS_DENIED_FOR_USER_ACCOUNT_LOCKED):
  Access denied for user '%-.48s'@'%-.64s'. Account is locked.
  MySQL error code MY-010914 (ER_ABORTING_USER_CONNECTION):
  Aborted connection %u to db: '%-.192s' user: '%-.48s' host:
  '%-.64s' (%-.64s).
  MySQL error code MY-001131 (ER_PASSWORD_ANONYMOUS_USER):
  You are using MySQL as an anonymous user and anonymous users
  are not allowed to change passwords
  ```

  Substituting error symbols for numbers, the rule set becomes:

  ```
  IF err_code == ER_ACCESS_DENIED_FOR_USER_ACCOUNT_LOCKED
    OR err_code == ER_ABORTING_USER_CONNECTION THEN drop.
  IF err_code == ER_PASSWORD_ANONYMOUS_USER THEN drop.
  ```

Symbolic names can be specified as quoted strings for comparison with string fields, but in such cases the names are strings that have no special meaning and `log_filter_dragnet` does not resolve them to the corresponding numeric value. Also, typos may go undetected, whereas an error occurs immediately on `SET` for attempts to use an unquoted symbol unknown to the server.

##### Actions for `log_filter_dragnet` Rules

`log_filter_dragnet` supports these actions in filter rules:

* `drop`: Drop the current log event (do not log it).
* `throttle`: Apply rate limiting to reduce log verbosity for events matching particular conditions. The argument indicates a rate, in the form *`count`* or *`count`*/*`window_size`*. The *`count`* value indicates the permitted number of event occurrences to log per time window. The *`window_size`* value is the time window in seconds; if omitted, the default window is 60 seconds. Both values must be integer literals.

  This rule throttles plugin-shutdown messages to 5 occurrences per 60 seconds:

  ```
  IF err_code == ER_PLUGIN_SHUTTING_DOWN_PLUGIN THEN throttle 5.
  ```

  This rule throttles errors and warnings to 1000 occurrences per hour and information messages to 100 occurrences per hour:

  ```
  IF prio <= INFORMATION THEN throttle 1000/3600 ELSE throttle 100/3600.
  ```
* `set`: Assign a value to a field (and cause the field to exist if it did not already). In subsequent rules, `EXISTS` tests against the field name are true, and the new value can be tested by comparison conditions.
* `unset`: Discard a field. In subsequent rules, `EXISTS` tests against the field name are false, and comparisons of the field against any value are false.

  In the special case that the condition refers to exactly one field name, the field name following `unset` is optional and `unset` discards the named field. These rules are equivalent:

  ```
  IF myfield == 2 THEN unset myfield.
  IF myfield == 2 THEN unset.
  ```

##### Field References in `log_filter_dragnet` Rules

`log_filter_dragnet` rules support references to core, optional, and user-defined fields in error events.

*  Core Field References
*  Optional Field References
*  User-Defined Field References

###### Core Field References

The `log_filter_dragnet` grammar at Grammar for `log_filter_dragnet` Rule Language names the core fields that filter rules recognize. For general descriptions of these fields, see Section 7.4.2.3, “Error Event Fields”, with which you are assumed to be familiar. The following remarks provide additional information only as it pertains specifically to core field references as used within `log_filter_dragnet` rules.

* `prio`

  The event priority, to indicate an error, warning, or note/information event. In comparisons, each priority can be specified as a symbolic priority name or an integer literal. Priority symbols are recognized only in comparisons with the `prio` field. These comparisons are equivalent:

  ```
  IF prio == INFORMATION THEN ...
  IF prio == 3 THEN ...
  ```

  The following table shows the permitted priority levels.

  <table><thead><tr> <th>Event Type</th> <th>Priority Symbol</th> <th>Numeric Priority</th> </tr></thead><tbody><tr> <th>Error event</th> <td><code>ERROR</code></td> <td>1</td> </tr><tr> <th>Warning event</th> <td><code>WARNING</code></td> <td>2</td> </tr><tr> <th>Note/information event</th> <td><code>INFORMATION</code></td> <td>3</td> </tr></tbody></table>

  There is also a message priority of `SYSTEM`, but system messages cannot be filtered and are always written to the error log.

  Priority values follow the principle that higher priorities have lower values, and vice versa. Priority values begin at 1 for the most severe events (errors) and increase for events with decreasing priority. For example, to discard events with priority lower than warnings, test for priority values higher than `WARNING`:

  ```
  IF prio > WARNING THEN drop.
  ```

  The following examples show the `log_filter_dragnet` rules to achieve an effect similar to each `log_error_verbosity` value permitted by the `log_filter_internal` filter:

  + Errors only (`log_error_verbosity=1`):

    ```
    IF prio > ERROR THEN drop.
    ```
  + Errors and warnings (`log_error_verbosity=2`):

    ```
    IF prio > WARNING THEN drop.
    ```
  + Errors, warnings, and notes (`log_error_verbosity=3`):

    ```
    IF prio > INFORMATION THEN drop.
    ```

    This rule can actually be omitted because there are no `prio` values greater than `INFORMATION`, so effectively it drops nothing.
* `err_code`

  The numeric event error code. In comparisons, the value to test can be specified as a symbolic error name or an integer literal. Error symbols are recognized only in comparisons with the `err_code` field and user-defined fields. These comparisons are equivalent:

  ```
  IF err_code == ER_ACCESS_DENIED_ERROR THEN ...
  IF err_code == 1045 THEN ...
  ```
* `err_symbol`

  The event error symbol, as a string (for example, `'ER_DUP_KEY'`). `err_symbol` values are intended more for identifying particular lines in log output than for use in filter rule comparisons because `log_filter_dragnet` does not resolve comparison values specified as strings to the equivalent numeric error code. (For that to occur, an error must be specified using its unquoted symbol.)

###### Optional Field References

The `log_filter_dragnet` grammar at Grammar for `log_filter_dragnet` Rule Language names the optional fields that filter rules recognize. For general descriptions of these fields, see Section 7.4.2.3, “Error Event Fields”, with which you are assumed to be familiar. The following remarks provide additional information only as it pertains specifically to optional field references as used within `log_filter_dragnet` rules.

* `label`

  The label corresponding to the `prio` value, as a string. Filter rules can change the label for log sinks that support custom labels. `label` values are intended more for identifying particular lines in log output than for use in filter rule comparisons because `log_filter_dragnet` does not resolve comparison values specified as strings to the equivalent numeric priority.
* `source_file`

  The source file in which the event occurred, without any leading path. For example, to test for the `sql/gis/distance.cc` file, write the comparison like this:

  ```
  IF source_file == "distance.cc" THEN ...
  ```

###### User-Defined Field References

Any field name in a `log_filter_dragnet` filter rule not recognized as a core or optional field name is taken to refer to a user-defined field.
