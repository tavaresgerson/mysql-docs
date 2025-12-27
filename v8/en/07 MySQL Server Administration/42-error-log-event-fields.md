#### 7.4.2.3 Error Event Fields

Error events intended for the error log contain a set of fields, each of which consists of a key/value pair. An event field may be classified as core, optional, or user-defined:

* A core field is set up automatically for error events. However, its presence in the event during event processing is not guaranteed because a core field, like any type of field, may be unset by a log filter. If this happens, the field cannot be found by subsequent processing within that filter and by components that execute after the filter (such as log sinks).
* An optional field is normally absent but may be present for certain event types. When present, an optional field provides additional event information as appropriate and available.
* A user-defined field is any field with a name that is not already defined as a core or optional field. A user-defined field does not exist until created by a log filter.

As implied by the preceding description, any given field may be absent during event processing, either because it was not present in the first place, or was discarded by a filter. For log sinks, the effect of field absence is sink specific. For example, a sink might omit the field from the log message, indicate that the field is missing, or substitute a default. When in doubt, test: use a filter that unsets the field, then check what the log sink does with it.

The following sections describe the core and optional error event fields. For individual log filter components, there may be additional filter-specific considerations for these fields, or filters may add user-defined fields not listed here. For details, see the documentation for specific filters.

*  Core Error Event Fields
*  Optional Error Event Fields

##### Core Error Event Fields

These error event fields are core fields:

* `time`

  The event timestamp, with microsecond precision.
* `msg`

  The event message string.
* `prio`

  The event priority, to indicate a system, error, warning, or note/information event. This field corresponds to severity in `syslog`. The following table shows the possible priority levels.

  <table><thead><tr> <th>Event Type</th> <th>Numeric Priority</th> </tr></thead><tbody><tr> <td>System event</td> <td>0</td> </tr><tr> <td>Error event</td> <td>1</td> </tr><tr> <td>Warning event</td> <td>2</td> </tr><tr> <td>Note/information event</td> <td>3</td> </tr></tbody></table>

  The `prio` value is numeric. Related to it, an error event may also include an optional `label` field representing the priority as a string. For example, an event with a `prio` value of 2 may have a `label` value of `'Warning'`.

  Filter components may include or drop error events based on priority, except that system events are mandatory and cannot be dropped.

  In general, message priorities are determined as follows:

  Is the situation or event actionable?

  + Yes: Is the situation or event ignorable?

    - Yes: Priority is warning.
    - No: Priority is error.
  + No: Is the situation or event mandatory?

    - Yes: Priority is system.
    - No: Priority is note/information.
* `err_code`

  The event error code, as a number (for example, `1022`).
* `err_symbol`

  The event error symbol, as a string (for example, `'ER_DUP_KEY'`).
* `SQL_state`

  The event SQLSTATE value, as a string (for example, `'23000'`).
* `subsystem`

  The subsystem in which the event occurred. Possible values are `InnoDB` (the `InnoDB` storage engine), `Repl` (the replication subsystem), `Server` (otherwise).

##### Optional Error Event Fields

Optional error event fields fall into the following categories:

* Additional information about the error, such as the error signaled by the operating system or the error label:

  + `OS_errno`

    The operating system error number.
  + `OS_errmsg`

    The operating system error message.
  + `label`

    The label corresponding to the `prio` value, as a string.
* Identification of the client for which the event occurred:

  + `user`

    The client user.
  + `host`

    The client host.
  + `thread`

    The ID of the thread within  `mysqld` responsible for producing the error event. This ID indicates which part of the server produced the event, and is consistent with general query log and slow query log messages, which include the connection thread ID.
  + `query_id`

    The query ID.
* Debugging information:

  + `source_file`

    The source file in which the event occurred, without any leading path.
  + `source_line`

    The line within the source file at which the event occurred.
  + `function`

    The function in which the event occurred.
  + `component`

    The component or plugin in which the event occurred.
