## 7.5 MySQL Components

MySQL Server includes a component-based infrastructure for extending server capabilities. A component provides services that are available to the server and other components. (With respect to service use, the server is a component, equal to other components.) Components interact with each other only through the services they provide.

MySQL distributions include several components that implement server extensions:

* Components for configuring error logging. See Section 7.4.2, “The Error Log”, and Section 7.5.3, “Error Log Components”.

* A component for checking passwords. See Section 8.4.3, “The Password Validation Component”.

* Keyring components provide secure storage for sensitive information. See Section 8.4.4, “The MySQL Keyring”.

* A component that enables applications to add their own message events to the audit log. See Section 8.4.6, “The Audit Message Component”.

* A component that implements a loadable function for accessing query attributes. See Section 11.6, “Query Attributes”.

* A component for scheduling actively executing tasks. See Section 7.5.5, “Scheduler Component”.

System and status variables implemented by a component are exposed when the component is installed and have names that begin with a component-specific prefix. For example, the `log_filter_dragnet` error log filter component implements a system variable named `log_error_filter_rules`, the full name of which is `dragnet.log_error_filter_rules`. To refer to this variable, use the full name.

The following sections describe how to install and uninstall components, and how to determine at runtime which components are installed and obtain information about them.

For information about the internal implementation of components, see the MySQL Server Doxygen documentation, available at https://dev.mysql.com/doc/index-other.html. For example, if you intend to write your own components, this information is important for understanding how components work.


### 7.5.1 Installing and Uninstalling Components

Components must be loaded into the server before they can be used. MySQL supports manual component loading at runtime and automatic loading during server startup.

While a component is loaded, information about it is available as described in Section 7.5.2, “Obtaining Component Information”.

The `INSTALL COMPONENT` and `UNINSTALL COMPONENT` SQL statements enable component loading and unloading. For example:

```
INSTALL COMPONENT 'file://component_validate_password';
UNINSTALL COMPONENT 'file://component_validate_password';
```

A loader service handles component loading and unloading, and also registers loaded components in the `mysql.component` system table.

The SQL statements for component manipulation affect server operation and the `mysql.component` system table as follows:

* `INSTALL COMPONENT` loads components into the server. The components become active immediately. The loader service also registers loaded components in the `mysql.component` system table. For subsequent server restarts, the loader service loads any components listed in `mysql.component` during the startup sequence. This occurs even if the server is started with the `--skip-grant-tables` option. The optional `SET` clause permits setting component system-variable values when you install components.

* `UNINSTALL COMPONENT` deactivates components and unloads them from the server. The loader service also unregisters the components from the `mysql.component` system table so that the server no longer loads them during its startup sequence for subsequent restarts.

Compared to the corresponding [`INSTALL PLUGIN`](install-plugin.html "15.7.4.4 INSTALL PLUGIN Statement") statement for server plugins, the `INSTALL COMPONENT` statement for components offers the significant advantage that it is not necessary to know any platform-specific file name suffix for naming the component. This means that a given `INSTALL COMPONENT` statement can be executed uniformly across platforms.

A component when installed may also automatically install related loadable functions. If so, the component when uninstalled also automatically uninstalls those functions.


### 7.5.2 Obtaining Component Information

The `mysql.component` system table contains information about currently loaded components and shows which components have been registered using [`INSTALL COMPONENT`](install-component.html "15.7.4.3 INSTALL COMPONENT Statement"). Selecting from the table shows which components are installed. For example:

```
mysql> SELECT * FROM mysql.component;
+--------------+--------------------+------------------------------------+
| component_id | component_group_id | component_urn                      |
+--------------+--------------------+------------------------------------+
|            1 |                  1 | file://component_validate_password |
|            2 |                  2 | file://component_log_sink_json     |
+--------------+--------------------+------------------------------------+
```

The `component_id` and `component_group_id` values are for internal use. The `component_urn` is the URN used in `INSTALL COMPONENT` and `UNINSTALL COMPONENT` statements to load and unload the component.


### 7.5.3 Error Log Components

This section describes the characteristics of individual error log components. For general information about configuring error logging, see Section 7.4.2, “The Error Log”.

A log component can be a filter or a sink:

* A filter processes log events, to add, remove, or modify event fields, or to delete events entirely. The resulting events pass to the next log component in the list of enabled components.

* A sink is a destination (writer) for log events. Typically, a sink processes log events into log messages that have a particular format and writes these messages to its associated output, such as a file or the system log. A sink may also write to the Performance Schema `error_log` table; see Section 29.12.21.2, “The error_log Table”. Events pass unmodified to the next log component in the list of enabled components (that is, although a sink formats events to produce output messages, it does not modify events as they pass internally to the next component).

The `log_error_services` system variable value lists the enabled log components. Components not named in the list are disabled. From MySQL 8.0.30, `log_error_services` also implicitly loads error log components if they are not already loaded. For more information, see Section 7.4.2.1, “Error Log Configuration”.

The following sections describe individual log components, grouped by component type:

* Filter Error Log Components
* Sink Error Log Components

Component descriptions include these types of information:

* The component name and intended purpose.
* Whether the component is built in or must be loaded. For a loadable component, the description specifies the URN to use if explicitly loading or unloading the component with the `INSTALL COMPONENT` and `UNINSTALL COMPONENT` statements. Implicitly loading error log components requires only the component name. For more information, see Section 7.4.2.1, “Error Log Configuration”.

* Whether the component can be listed multiple times in the `log_error_services` value.

* For a sink component, the destination to which the component writes output.

* For a sink component, whether it supports an interface to the Performance Schema `error_log` table.

#### Filter Error Log Components

Error log filter components implement filtering of error log events. If no filter component is enabled, no filtering occurs.

Any enabled filter component affects log events only for components listed later in the `log_error_services` value. In particular, for any log sink component listed in `log_error_services` earlier than any filter component, no log event filtering occurs.

##### The log_filter_internal Component

* Purpose: Implements filtering based on log event priority and error code, in combination with the `log_error_verbosity` and `log_error_suppression_list` system variables. See Section 7.4.2.5, “Priority-Based Error Log Filtering (log_filter_internal)”").

* URN: This component is built in and need not be loaded.
* Multiple uses permitted: No.

If `log_filter_internal` is disabled, `log_error_verbosity` and `log_error_suppression_list` have no effect.

##### The log_filter_dragnet Component

* Purpose: Implements filtering based on the rules defined by the `dragnet.log_error_filter_rules` system variable setting. See Section 7.4.2.6, “Rule-Based Error Log Filtering (log_filter_dragnet)”").

* URN: `file://component_log_filter_dragnet`
* Multiple uses permitted: No.

#### Sink Error Log Components

Error log sink components are writers that implement error log output. If no sink component is enabled, no log output occurs.

Some sink component descriptions refer to the default error log destination. This is the console or a file and is indicated by the value of the `log_error` system variable, determined as described in Section 7.4.2.2, “Default Error Log Destination Configuration”.

##### The log_sink_internal Component

* Purpose: Implements traditional error log message output format.

* URN: This component is built in and need not be loaded.
* Multiple uses permitted: No.
* Output destination: Writes to the default error log destination.

* Performance Schema support: Writes to the `error_log` table. Provides a parser for reading error log files created by previous server instances.

##### The log_sink_json Component

* Purpose: Implements JSON-format error logging. See Section 7.4.2.7, “Error Logging in JSON Format”.

* URN: `file://component_log_sink_json`
* Multiple uses permitted: Yes.
* Output destination: This sink determines its output destination based on the default error log destination, which is given by the `log_error` system variable:

  + If `log_error` names a file, the sink bases output file naming on that file name, plus a numbered `.NN.json` suffix, with *`NN`* starting at

    00. For example, if `log_error` is *`file_name`*, successive instances of `log_sink_json` named in the `log_error_services` value write to `file_name.00.json`, `file_name.01.json`, and so forth.

  + If `log_error` is `stderr`, the sink writes to the console. If `log_sink_json` is named multiple times in the `log_error_services` value, they all write to the console, which is likely not useful.

* Performance Schema support: Writes to the `error_log` table. Provides a parser for reading error log files created by previous server instances.

##### The log_sink_syseventlog Component

* Purpose: Implements error logging to the system log. This is the Event Log on Windows, and `syslog` on Unix and Unix-like systems. See Section 7.4.2.8, “Error Logging to the System Log”.

* URN: `file://component_log_sink_syseventlog`

* Multiple uses permitted: No.
* Output destination: Writes to the system log. Does not use the default error log destination.

* Performance Schema support: Does not write to the `error_log` table. Does not provide a parser for reading error log files created by previous server instances.

##### The log_sink_test Component

* Purpose: Intended for internal use in writing test cases, not for production use.

* URN: `file://component_log_sink_test`

Sink properties such as whether multiple uses are permitted and the output destination are not specified for `log_sink_test` because, as mentioned, it is for internal use. As such, its behavior is subject to change at any time.


### 7.5.4 Query Attribute Components

As of MySQL 8.0.23, a component service provides access to query attributes (see Section 11.6, “Query Attributes”). The `query_attributes` component uses this service to provide access to query attributes within SQL statements.

* Purpose: Implements the `mysql_query_attribute_string()` function that takes an attribute name argument and returns the attribute value as a string, or `NULL` if the attribute does not exist.

* URN: `file://component_query_attributes`

Developers who wish to incorporate the same query-attribute component service used by `query_attributes` should consult the `mysql_query_attributes.h` file in a MySQL source distribution.


### 7.5.5 Scheduler Component

Note

The `scheduler` component is included in MySQL Enterprise Edition, a commercial product. To learn more about commercial products, see <https://www.mysql.com/products/>.

As of MySQL 8.0.34, the `scheduler` component provides an implementation of the `mysql_scheduler` service that enables applications, components, or plugins to configure, run, and unconfigure tasks every *`N`* seconds. For example, the `audit_log` server plugin calls the `scheduler` component at its initialization and configures a regular, recurring flush of its memory cache (see Enabling the Audit Log Flush Task).

* Purpose: Implements the `component_scheduler.enabled` system variable that controls whether the scheduler is actively executing tasks. At startup, the `scheduler` component registers the `performance_schema.component_scheduler_tasks` table, which lists the currently scheduled tasks and some runtime data about each one.

* URN: `file://component_scheduler`

For installation instructions, see Section 7.5.1, “Installing and Uninstalling Components”.

The `scheduler` component implements the service using these elements:

* A priority queue of the registered, inactive scheduled tasks sorted by the next time to run (in ascending order).

* A list of the registered, active tasks.
* A background thread that:

  + Sleeps if there are no tasks or if the top task needs more time to run. It wakes periodically to check whether it is time to end.

  + Compiles a list of the tasks that need to run, moves them from the inactive queue, adds them to the active queue, and executes each task individually.

  + After executing the task list, removes the tasks from the active list, adds them to the inactive list, and calculates the next time they need to run.

When a caller invokes the `mysql_scheduler.create()` service, it creates a new scheduled task instance to add to the queue, which signals the semaphore of the background thread. A handle to the new task is returned to the caller. The calling code should keep this handle and the service reference to the scheduling service until after calling the `mysql_scheduler.destroy()` service. When the caller invokes `destroy()` and passes in the handle it received from `create()`, the service waits for the task to become inactive (if running) and then removes it from the inactive queue.

The component service calls each application-provided callback (function pointer) into the same scheduler thread, one at a time and in ascending order, based on the time each requires to run.

Developers who wish to incorporate scheduler-queueing capabilities into an application, component, or plugin should consult the `mysql_scheduler.h` file in a MySQL source distribution.
