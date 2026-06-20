## 7.5 MySQL Components

MySQL Server includes a component-based infrastructure for extending server capabilities. A component provides services that are available to the server and other components. (With respect to service use, the server is a component, equal to other components.) Components interact with each other only through the services they provide.

MySQL distributions include several components that implement server extensions:

* Components for configuring error logging. See Section 7.4.2, “The Error Log”, and Section 7.5.3, “Error Log Components”.

* A component for checking passwords. See Section 8.4.4, “The Password Validation Component”.

* Keyring components provide secure storage for sensitive information. See Section 8.4.5, “The MySQL Keyring”.

* A component that enables applications to add their own message events to the audit log. See Section 8.4.7, “The Audit Message Component”.

* A component that implements a loadable function for accessing query attributes. See Section 11.6, “Query Attributes”.

* A component for scheduling actively executing tasks. See Section 7.5.5, “Scheduler Component”.

* Components for use with MySQL Replication and MySQL Group Replication. See Section 7.5.6, “Replication Components”.

* A component that enables creation and use of MySQL stored programs written in JavaScript. See Section 7.5.7, “Multilingual Engine Component (MLE)”").

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

* A sink is a destination (writer) for log events. Typically, a sink processes log events into log messages that have a particular format and writes these messages to its associated output, such as a file or the system log. A sink may also write to the Performance Schema `error_log` table; see Section 29.12.22.3, “The error_log Table”. Events pass unmodified to the next log component in the list of enabled components (that is, although a sink formats events to produce output messages, it does not modify events as they pass internally to the next component).

The `log_error_services` system variable lists the enabled log components. Components not named in the list are disabled. `log_error_services` also implicitly loads error log components if they are not already loaded. For more information, see Section 7.4.2.1, “Error Log Configuration”.

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

A component service provides access to query attributes (see Section 11.6, “Query Attributes”). The `query_attributes` component uses this service to provide access to query attributes within SQL statements.

* Purpose: Implements the `mysql_query_attribute_string()` function that takes an attribute name argument and returns the attribute value as a string, or `NULL` if the attribute does not exist.

* URN: `file://component_query_attributes`

Developers who wish to incorporate the same query-attribute component service used by `query_attributes` should consult the `mysql_query_attributes.h` file in a MySQL source distribution.


### 7.5.5 Scheduler Component

Note

The `scheduler` component is included in MySQL Enterprise Edition, a commercial product. To learn more about commercial products, see <https://www.mysql.com/products/>.

The `scheduler` component provides an implementation of the `mysql_scheduler` service that enables applications, components, or plugins to configure, run, and unconfigure tasks every *`N`* seconds. For example, the `audit_log` server plugin calls the `scheduler` component at its initialization and configures a regular, recurring flush of its memory cache (see Enabling the Audit Log Flush Task).

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


### 7.5.6 Replication Components

The following sections contain information about components intended for use with MySQL Replication or Group Replication.


#### 7.5.6.1 Replication Applier Metrics Component

The Replication Applier Metrics component implements two Performance Schema tables, listed here:

* `replication_applier_metrics`: Shows statistics for the replication applier, for a given replication channel.

* `replication_applier_progress_by_worker`: Shows statistics for the replication applier, for the worker with the given ID and channel name.

* Purpose: Provide replication applier statistics tables in the MySQL Performance Schema.

* URN: `file://component_replication_applier_metrics`

For installation instructions, see Section 7.5.1, “Installing and Uninstalling Components”.

This component is available only as part of MySQL Enterprise Edition.

Important

The `replication_applier_metrics` component does not function when `replica_parallel_workers=0`.


#### 7.5.6.2 Group Replication Flow Control Statistics Component

The Group Replication Flow Control Statistics component (`component_group_replication_flow_control_stats`) enables a number of global status variables which provide information on Group Replication flow control execution. This component is available in MySQL 9.5 and later as part of MySQL Enterprise Edition.

* Purpose: Support Group Replication global variables in addition to those normally present for measuring statistics relating to flow control execution.

* URN: `file://component_group_replication_flow_control_stats`

Prior to installing the Group Replication Flow Control Statistics component, the Group Replication plugin must be installed using `INSTALL PLUGIN` or `--plugin-load-add` (see Section 20.2.1.2, “Configuring an Instance for Group Replication”); otherwise, the `INSTALL COMPONENT` statement is rejected with the error Cannot satisfy dependency for service 'group_replication_flow_control_metrics_service' required by component 'mysql:group_replication_flow_control_stats'. If you attempt to uninstall the Group Replication plugin when the Group Replication Flow Control Statistics component is installed, `UNINSTALL PLUGIN` fails with the error Plugin 'group_replication' cannot be uninstalled now. Please uninstall the component 'component_group_replication_flow_control_stats' and then UNINSTALL PLUGIN group_replication.

Provided that these conditions are met, The Group Replication Flow Control Statistics component can be installed and uninstalled using [`INSTALL COMPONENT`](install-component.html "15.7.4.3 INSTALL COMPONENT Statement") and [`UNINSTALL COMPONENT`](uninstall-component.html "15.7.4.5 UNINSTALL COMPONENT Statement"), respectively. See the descriptions of these statements, as well as Section 7.5.1, “Installing and Uninstalling Components”, for more information.

The Group Replication Flow Control Statistics component provides the global status variables listed here with their meanings:

* `Gr_flow_control_throttle_active_count`: The number of transactions currently being throttled.

* `Gr_flow_control_throttle_count`: The number of transactions which have been throttled.

* `Gr_flow_control_throttle_last_throttle_timestamp`: The most recent date and time that a transaction was throttled.

* `Gr_flow_control_throttle_time_sum`: Time in microseconds that transactions have been throttled.

The values of these variables can be obtained by querying the Performance Schema `global_status` table, as shown here:

```
mysql> SELECT * FROM performance_schema.global_status
    -> WHERE VARIABLE_NAME LIKE 'Gr_flow_control%';
+--------------------------------------------------+---------------------+
| VARIABLE_NAME	                                  | VARIABLE_VALUE      |
+--------------------------------------------------+---------------------+
| Gr_flow_control_throttle_active_count	          | 10                  |
+--------------------------------------------------+---------------------+
| Gr_flow_control_throttle_count	                 | 10                  |
+--------------------------------------------------+---------------------+
| Gr_flow_control_throttle_last_throttle_timestamp | 2024-07-01 12:50:56 |
+--------------------------------------------------+---------------------+
| Gr_flow_control_throttle_time_sum	              | 10                  |
+--------------------------------------------------+---------------------+
```

You can also observe these values in the output of [`SHOW GLOBAL STATUS`](show-status.html "15.7.7.38 SHOW STATUS Statement"), like this:

```
mysql> SHOW GLOBAL STATUS LIKE 'Gr_flow_control%';
+--------------------------------------------------+---------------------+
| Variable_Name	                                  | Value               |
+--------------------------------------------------+---------------------+
| Gr_flow_control_throttle_active_count	          | 10                  |
+--------------------------------------------------+---------------------+
| Gr_flow_control_throttle_count	                 | 10                  |
+--------------------------------------------------+---------------------+
| Gr_flow_control_throttle_last_throttle_timestamp | 2024-07-01 12:50:56 |
+--------------------------------------------------+---------------------+
| Gr_flow_control_throttle_time_sum	              | 10                  |
+--------------------------------------------------+---------------------+
```

All of the status variables listed previously are reset whenever any of the following events occurs:

* The server is restarted.
* The group is bootstrapped.
* A new member joins, or a member automatically rejoins.

Since they reflect what what the local member observes, all of these status variables have member scope.


#### 7.5.6.3 Group Replication Resource Manager Component

The Group Replication Resource Manager component monitors secondary server lag time and memory usage, and can expel servers which lag excessively or use too many resources from the group. Allowable lag time and resource usage are configurable for both applier channels and recovery channels, as explained in this section. This component is available as part of MySQL Enterprise Edition.

* Purpose: Provide monitoring of and control over secondary server lag time and resource usage.

* URN: `file://component_group_replication_resource_manager`

Prior to installing the Group Replication Resource Manager component, the Group Replication plugin should be installed using `INSTALL PLUGIN` or `--plugin-load-add` (see Section 20.2.1.2, “Configuring an Instance for Group Replication”). It is possible to install the component without the Group Replication plugin being available, but in this case, the component is useful only for monitoring of memory usage and is not capable of taking any action.

The Group Replication Resource Manager component can be installed and uninstalled using [`INSTALL COMPONENT`](install-component.html "15.7.4.3 INSTALL COMPONENT Statement") and [`UNINSTALL COMPONENT`](uninstall-component.html "15.7.4.5 UNINSTALL COMPONENT Statement"), respectively. See the descriptions of these statements, as well as Section 7.5.1, “Installing and Uninstalling Components”, for more information.

The Group Replication Resource Manager component provides a configurable automatic expulsion mechanism which detects when the applier or recovery channel on a group replication secondary is lagging, or when the secondary is swapping excessively, and expels the problematic server from the group, thus helping to maintain high availability. Due to the high availability requirement, *in order to use the auto-expulsion functionality with an active replication group, the group must initially consist of no fewer than three members, including the group replication primary*; this guarantees that there are at least two members (one primary and one secondary) in the event that one member has been expelled.

Note

The Group Replication Resource Manager component does not monitor the group replication primary, and is not intended to expel the primary, but it is possible for the decision to expel a secondary to be made just before the same secondary is promoted to primary (due to a concurrent primary failure), in which case the just-elected primary may be evicted.

Using the system and status variables provided by this component, the operator can separately monitor each of the three areas of concern—applier lag, recovery lag, and system resource exhaustion—and separate thresholds for expulsion set for each of them, as listed here:

* *Applier channel*: Obtain the time by which this server's applier channel lags behind that of the primary from the `Gr_resource_manager_applier_channel_lag` server status variable. You can set an upper limit for this by setting the `group_replication_resource_manager.applier_channel_lag` server system variable; if the lag exceeds this value 10 times or more in succession, this server is expelled from the group. The default threshold is 3600 seconds (1 hour).

* *Recovery channel*: The time by which this server's recovery channel lags behind that of the primary can be obtained by checking the value of the `Gr_resource_manager_recovery_channel_lag` server status variable. You can set an upper limit for this by setting `group_replication_resource_manager.recovery_channel_lag`; if the secondary's recovery lag is more than this, 10 times in succession, this server is expelled from the group. The default threshold is 3600 seconds (1 hour).

* *Resource (Memory) Usage*: The `group_replication_resource_manager.memory_used_limit` server system variable sets the threshold for memory consumption as a percentage of total memory; when `Gr_resource_manager_memory_used` exceeds this percentage 10 times in succession, this server is expelled.

The Resource Manager component checks lag and usage on group replication secondaries every 5 seconds. This period is not configurable by the operator.

A server which has been expelled from the group may subsequently try to rejoin it without manual intervention, provided that `group_replication_autorejoin_tries` is enabled (otherwise the server proceeds as specified by `group_replication_exit_state_action`). The auto-rejoin mechanism and behavior are the same as those described in Section 20.7.7.3, “Auto-Rejoin”.

For a replication group member attempting to join or rejoin a group after encountering issues and being expelled, a quarantine period prevents immediate re-expulsion. This period is tracked individually for each member, so that, during the quarantine period started after group member A has been expelled and subsequently allowed to re-join the group, member B can be expelled safely if the need arises. The duration of the quarantine period determined by the value of the `group_replication_resource_manager.quarantine_time` server system variable. The default length of the quarantine period is 3600 seconds (1 hour).

The Resource Management component provides a number of server status variables which can be used for monitoring the status of Group Replication and the Resource Manager component. In addition to the three such variables discussed previously, these include the following:

* `Gr_resource_manager_applier_channel_threshold_hits`: The number of samples which have exceeded `group_replication_resource_manager.applier_channel_lag`.

* `Gr_resource_manager_applier_channel_eviction_timestamp`: When the last eviction caused by applier channel lag occurred.

* `Gr_resource_manager_recovery_channel_threshold_hits`: The number of samples which have exceeded `group_replication_resource_manager.recovery_channel_lag`.

* `Gr_resource_manager_recovery_channel_eviction_timestamp`: When the last eviction caused by recovery channel lag occurred.

* `Gr_resource_manager_memory_threshold_hits`: The number of samples which have exceeded `group_replication_resource_manager.memory_used_limit`.

* `Gr_resource_manager_memory_eviction_timestamp`: When the last eviction caused by excess memory usage took place.

In addition, it is possible to determine if and when errors have occurred when attempting to get lag or memory usage information by checking the status variables listed here:

* `Gr_resource_manager_channel_lag_monitoring_error_timestamp`: Timestamp for the last time this member encountered an error while trying to obtain a value for channel lag.

* `Gr_resource_manager_memory_monitoring_error_timestamp`: The last time this member encountered an error while trying to obtain a value for the system memory usage.

For general information about MySQL Group Replication, see Chapter 20, *Group Replication*.


#### 7.5.6.4 Group Replication Primary Election Component

The Group Replication Primary Election component is available as part of MySQL Enterprise Edition.

* Purpose: On failover, when in single-primary mode, use replication group member most-up-to-date status as a criterion for selection of the new primary.

* URN: `file://component_group_replication_elect_prefers_most_updated`

Prior to installing the Group Replication Primary Election component, the Group Replication plugin must be installed using `INSTALL PLUGIN` or `--plugin-load-add` (see Section 20.2.1.2, “Configuring an Instance for Group Replication”); otherwise, the `INSTALL COMPONENT` statement is rejected with an error. If you attempt to uninstall the Group Replication plugin when the Group Replication Primary Election component is installed, [`UNINSTALL PLUGIN`](uninstall-plugin.html "15.7.4.6 UNINSTALL PLUGIN Statement") fails with the error Plugin 'group_replication' cannot be uninstalled now. Please uninstall the component 'component_group_replication_elect_prefers_most_updated' and then UNINSTALL PLUGIN group_replication.

Once these conditions are met, the Group Replication Primary Election component can be installed and uninstalled using `INSTALL COMPONENT` and `UNINSTALL COMPONENT`, respectively. See the descriptions of these statements, as well as Section 7.5.1, “Installing and Uninstalling Components”, for more information.

To enable the component, set the `group_replication_elect_prefers_most_updated.enabled` system variable to `ON`, on each replication group member. This means that, on failover, the component chooses as the new primary the secondary which is most up to date, based on how many transactions are in the secondary's backlog; the secondary with the smallest backlog (fewest transactions behind) is chosen as the new primary.

In order for most-up-to-date selection to work, the Group Replication Primary Election component must be installed on all group members; `group_replication_elect_prefers_most_updated.enabled` must be `ON` for each group member as well. If the component is not available, or if there is no one secondary that is the most up to date, weighted selection is used; in the event of matching greatest weights, the server with the lowest UUID (in lexical order) is promoted to primary.

**Status variables.** The Group Replication Primary Election component provides two status variables, listed here, for use in monitoring:

* `Gr_latest_primary_election_by_most_uptodate_members_trx_delta`: When a new primary is chosen using most-up-to-date selection, this is the difference in transactions processed by the new primary and by the most up to date secondary.

* `Gr_latest_primary_election_by_most_uptodate_member_timestamp`: This timestamp is set whenever a new primary is elected using the most-up-to-date method.

The values of these status variables are reset in the event of installation or uninstallation of the component, on group bootstrap, whenever a member joins the group (including automatic rejoin), and on server restart.

**Logging.** When primary selection on failover uses the most-up-to-date method, the component writes a message to the log similar to that shown here, announcing the change, identifying the new primary, and providing the number of transactions which need to be applied from the backlog:

```
ER_GRP_PRIMARY_ELECTION_METHOD_MOST_UPDATE
2024-10-08T16:07:48.100736Z 0 [Note] [MY-015562] [Server] Plugin
group_replication reported: 'Group Replication Primary Election:
Member with uuid 8a94f357-aab4-11df-86ab-c80aa9420000  was elected
primary since it was the most up-to-date member with 100 transactions
more than second most up-to-date member
8a94f468-aab4-11df-86ab-c80aa9420000. In case of a tie member weight and
then uuid lexical order was used over the most updated members.'
```

When primary selection uses member weight order, the component writes a log message announcing the change, identifying the new primary by UUID, and its weight value. The message is similar to that shown here:

```
ER_GRP_PRIMARY_ELECTION_METHOD_MEMBER_WEIGHT
2024-10-08T16:07:48.100736Z 0 [Note] [MY-015563] [Server] Plugin
group_replication reported: 'Group Replication Primary Election:
Member with uuid 8a94f357-aab4-11df-86ab-c80aa9420000 was elected
primary since it was highest weight member with value 70. In case
of a tie uuid lexical order was used.'
```


### 7.5.7 Multilingual Engine Component (MLE)

The Multilingual Engine component (MLE) provides support for languages other than SQL in MySQL stored procedures and functions. The MLE Component is available as part of MySQL Enterprise Edition.

With the MLE component in MySQL 9.5, you can create and execute MySQL stored programs written in JavaScript. For more information about these, see Section 27.3, “JavaScript Stored Programs”. For general information about MySQL stored routines, see Section 27.2, “Using Stored Routines”.

* Purpose: Provide support for languages other than SQL in stored functions and stored procedures. In MySQL 9.5, only JavaScript (ECMAScript) is supported by MLE.

* URN: `file://component_mle`

For installation instructions, see Section 7.5.1, “Installing and Uninstalling Components”.

The MLE component is available on all platforms supported by MySQL Enterprise Edition, except for Solaris. See [Supported Platforms](https://www.mysql.com/support/supportedplatforms/database.html) for more information.

Note

You should be aware that not all MySQL 9.5 installations support removal of the MLE component. If your installation supports it, you can remove the component using `UNINSTALL COMPONENT`. See Section 7.5.1, “Installing and Uninstalling Components”, for information about how to do this.

For MySQL installations supporting the uninstallation of the MLE component, you should be aware that it is not possible to perform the uninstallation from within a user session that has created or executed any JavaScript stored procedures. For this reason, we recommend that you create and execute JavaScript stored procedures in a session separate from that used to install the MLE component; in this case it is possible, after exiting the session in which JavaScript stored procedures were created or used, to uninstall the component in a separate session.


#### 7.5.7.1 MLE Component Option and Variable Reference

The following table lists all MySQL system variables and status variables supported by the ML component. Detailed descriptions of these variables can be found in the next two sections.

**Table 7.7 Multilingual Engine Component Variable Reference**

<table frame="box" rules="all" summary="Reference for MLE command-line options, system variables, and status variables."><col style="width: 20%"/><col style="width: 15%"/><col style="width: 15%"/><col style="width: 15%"/><col style="width: 15%"/><col style="width: 15%"/><col style="width: 15%"/><thead><tr><th scope="col">Name</th> <th scope="col">Cmd-Line</th> <th scope="col">Option File</th> <th scope="col">System Var</th> <th scope="col">Status Var</th> <th scope="col">Var Scope</th> <th scope="col">Dynamic</th> </tr></thead><tbody><tr><th scope="row">mle_heap_status</th> <td></td> <td></td> <td></td> <td>Yes</td> <td>Global</td> <td>No</td> </tr><tr><th scope="row">mle_languages_supported</th> <td></td> <td></td> <td></td> <td>Yes</td> <td>Global</td> <td>No</td> </tr><tr><th scope="row">mle_memory_used</th> <td></td> <td></td> <td></td> <td>Yes</td> <td>Global</td> <td>No</td> </tr><tr><th scope="row">mle_oom_errors</th> <td></td> <td></td> <td></td> <td>Yes</td> <td>Global</td> <td>No</td> </tr><tr><th scope="row">mle_session_resets</th> <td></td> <td></td> <td></td> <td>Yes</td> <td>Global</td> <td>No</td> </tr><tr><th scope="row">mle_sessions</th> <td></td> <td></td> <td></td> <td>Yes</td> <td>Global</td> <td>No</td> </tr><tr><th scope="row">mle_sessions_max</th> <td></td> <td></td> <td></td> <td>Yes</td> <td>Global</td> <td>No</td> </tr><tr><th scope="row">mle_status</th> <td></td> <td></td> <td></td> <td>Yes</td> <td>Global</td> <td>No</td> </tr><tr><th scope="row">mle_stored_functions</th> <td></td> <td></td> <td></td> <td>Yes</td> <td>Global</td> <td>No</td> </tr><tr><th scope="row">mle_stored_procedures</th> <td></td> <td></td> <td></td> <td>Yes</td> <td>Global</td> <td>No</td> </tr><tr><th scope="row">mle_stored_program_bytes_max</th> <td></td> <td></td> <td></td> <td>Yes</td> <td>Global</td> <td>No</td> </tr><tr><th scope="row">mle_stored_program_sql_max</th> <td></td> <td></td> <td></td> <td>Yes</td> <td>Global</td> <td>No</td> </tr><tr><th scope="row">mle_stored_programs</th> <td></td> <td></td> <td></td> <td>Yes</td> <td>Global</td> <td>No</td> </tr><tr><th scope="row">mle_threads</th> <td></td> <td></td> <td></td> <td>Yes</td> <td>Global</td> <td>No</td> </tr><tr><th scope="row">mle_threads_max</th> <td></td> <td></td> <td></td> <td>Yes</td> <td>Global</td> <td>No</td> </tr><tr><th scope="row">mle.memory_max</th> <td>Yes</td> <td>Yes</td> <td>Yes</td> <td></td> <td>Global</td> <td>Yes</td> </tr></tbody></table>

##### MLE Component System Variables

This section provides a description of each system variable specific to the MLE component. For a summary table that lists all system variables supported by the MySQL server, see Section 7.1.5, “Server System Variable Reference”. For general information regarding manipulation of system variables, see Section 7.1.9, “Using System Variables”.

* `mle.memory_max`

  <table frame="box" rules="all" summary="Properties for mle.memory_max"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--mle.memory-max=value</code></td> </tr><tr><th>System Variable</th> <td><code>mle.memory_max</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th><code>SET_VAR</code> Hint Applies</th> <td>No</td> </tr><tr><th>Platform Specific</th> <td>Linux</td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>(0.05) * (total physical memory in GB)</code></td> </tr><tr><th>Minimum Value</th> <td><code>320M</code></td> </tr><tr><th>Maximum Value</th> <td><code>64G</code></td> </tr><tr><th>Unit</th> <td>bytes</td> </tr></tbody></table>

  Determines the maximum amount of memory to allocate to the MLE component. This variable is dynamic, but can be set only when the component is inactive; you can determine whether this is the case by checking the value of the `mle_status` system status variable.

  When increasing the value for this variable, you should be bear in mid that you must allow sufficient memory for other uses by the MySQL server such as buffer pools, connection memory, join buffers, and so on. In addition, there must be enough memory to allow system processes to operate correctly.

  Important

  Setting this value greater than the amount of memory available on the system causes undefined behavior.

  For more information about memory usage by the MLE component, see Section 7.5.7.3, “MLE Component Memory and Thread Usage”.

##### MLE Component Status Variables

This section provides a description of each status variable specific to the MLE component. For general information about MySQL server status variables, see Section 7.1.10, “Server Status Variables”. For a summary table that lists all status variables supported by the MySQL server, see Section 7.1.6, “Server Status Variable Reference”.

The status variables have the following meanings:

* `mle_languages_supported`

  Lists the languages supported by the MLE component. In MySQL 9.5, this is always `JavaScript`.

  Available only if the MLE component is installed. See Section 7.5.7.2, “MLE Component Status and Session Information”, for more information.

* `mle_heap_status`

  Current status of the heap used by the MLE component. The value is one of: `Not Allocated`, `Allocated`, or `Garbage Collection`. The heap is allocated only if the MLE component is active (that is, if `mle_status` is equal to `Active`).

  Available only if the MLE component is installed. See Section 7.5.7.3, “MLE Component Memory and Thread Usage”, for more information.

* `mle_memory_used`

  Percentage of allocated memory used by the MLE component, rounded up to the nearest whole number.

  Available only if the MLE component is installed. See Section 7.5.7.3, “MLE Component Memory and Thread Usage”, for more information.

* `mle_oom_errors`

  The total number of out-of-memory errors thrown by MLE stored programs, across all sessions.

  Available only if the MLE component is installed. See Section 7.5.7.3, “MLE Component Memory and Thread Usage”, for more information.

* `mle_session_resets`

  The number of times MLE sessions have been cleared using the `mle_session_reset()` function.

  Available only if the MLE component is installed. See Section 7.5.7.2, “MLE Component Status and Session Information”, for more information.

* `mle_sessions`

  Current number of active MLE sessions. An MLE session is created within a given MySQL user session once the MySQL user creates or executes a JavaScript stored program. It is dropped when the MySQL user calls `mle_session_reset()`, or when the MySQL session ends.

  If the MySQL user calls `mle_session_reset()`, then later creates or executes a JavaScript stored program within the same MySQL user session, a new MLE session is created. There can be at most one MLE session per MySQL session.

  Available only if the MLE component is installed. See Section 7.5.7.2, “MLE Component Status and Session Information”, for more information.

* `mle_sessions_max`

  Maximum number of MLE sessions active at any one time since the MLE component became active.

  Available only if the MLE component is installed. See Section 7.5.7.2, “MLE Component Status and Session Information”, for more information.

* `mle_status`

  Current status of the MLE component. The value is one of: `Initializing`, `Inactive`, `Active`, or `Pending Shutdown`.

  Available only if the MLE component is installed. See Section 7.5.7.2, “MLE Component Status and Session Information”, for more information.

* `mle_stored_functions`

  This is the number of MLE stored functions currently cached across all sessions.

  Available only if the MLE component is installed. See Section 7.5.7.4, “MLE Component Stored Program Usage”, for more information.

* `mle_stored_procedures`

  The number of MLE stored procedures currently cached across all sessions.

  Available only if the MLE component is installed. See Section 7.5.7.4, “MLE Component Stored Program Usage”, for more information.

* `mle_stored_programs`

  Returns the number of stored programs (stored procedures and stored functions) currently cached across all sessions. An MLE stored program is cached as soon it is executed for the first time, in each session in which it was executed. It is dropped from its session's cache when any of the following happens:

  + The stored program is explicitly dropped.
  + The MLE session is dropped (see the description of `mle_sessions`)

  + An out-of-memory error is thrown in a current MLE session.

  If the same stored program is executed again after being dropped from the cache, it is cached again as usual.

  Available only if the MLE component is installed. See Section 7.5.7.4, “MLE Component Stored Program Usage”, for more information.

* `mle_stored_program_bytes_max`

  The size of the largest MLE stored program, in bytes. This value is equal to the size of the stored program's source text, expressed in bytes.

  Available only if the MLE component is installed. See Section 7.5.7.4, “MLE Component Stored Program Usage”, for more information.

* `mle_stored_program_sql_max`

  The maximum number of SQL statements executed by any MLE stored program.

  Available only if the MLE component is installed. See Section 7.5.7.4, “MLE Component Stored Program Usage”, for more information.

* `mle_threads`

  Returns the current number of physical threads attached to GraalVM. A physical thread, provided by the MySQL server's thread manager, is attached to GraalVM whenever it starts executing an operation inside GraalVM. Such operations include heap creation, code parsing, code execution, arguments conversion, memory usage queries, and deinitialization of stored programs. A thread is detached from GraalVM after it exits if the number of threads already attached exceeds the number of megabytes of heap allocated to Graal. The number of attached physical threads cannot exceed 1.5 times the number of megabytes of allocated Graal heap.

  Available only if the MLE component is installed. See Section 7.5.7.3, “MLE Component Memory and Thread Usage”, for more information.

* `mle_threads_max`

  The maximum number of MLE threads active at any given time, since the MLE component last became active.

  Available only if the MLE component is installed. See Section 7.5.7.3, “MLE Component Memory and Thread Usage”, for more information.

In addition to those listed here, a number of status variables providing counts of JavaScript library SQL statements are supported. See Com_xxx Variables, for information about these.


#### 7.5.7.2 MLE Component Status and Session Information

Once the MLE component is installed, you can obtain information about the component as shown here:

```
mysql> SHOW STATUS LIKE 'mle%';
+-------------------------+---------------+
| Variable_name           | Value         |
+-------------------------+---------------+
| mle_heap_status         | Not Allocated |
| mle_languages_supported | JavaScript    |
| mle_memory_used         | 0             |
| mle_status              | Inactive      |
+-------------------------+---------------+
4 rows in set (0.01 sec)
```

As with other MySQL status variables, you can also access those shown here by selecting from the Performance Schema `global_status` table.

The MLE component's status is indicated by the `mle_status` status variable. This remains `Inactive` until a user creates or invokes a stored procedure or function using a language supported by MLE, at which time it becomes (very briefly) `Initializing` or (more usually) `Active`. It remains `Active` until the server is shutting down or restarting, at which the value is `Pending shutdown`.

You can obtain status information and console output from an MLE stored program using the loadable function `mle_session_state()` supplied by the MLE component. See the description of this function for more information.

`mle_languages_supported` shows a list of languages supported by this instance of the component; in MySQL 9.5, this is always `JavaScript`.

See Section 7.5.7.3, “MLE Component Memory and Thread Usage”, for information about status variables relating to MLE component memory usage.

You can also obtain information about MLE sessions from system status variables. The `mle_sessions` status variable provides the number of active MLE sessions. `mle_sessions_max` displays the greatest number of MLE sessions simultaneously active at any one time since the MLE component became active. `mle_session_resets` shows the number of times the session state was cleared by calling `mle_session_reset()`. See the descriptions of these status variables for more information.

Counts of several JavaScript library SQL statements are kept as status variables. These include `Com_create_library`, `Com_drop_library`, `Com_alter_library`, `Com_show_create_library`, and `Com_show_library_status`; these indicate, respectively, the numbers of [`CREATE LIBRARY`](create-library.html "15.1.19 CREATE LIBRARY Statement"), `DROP LIBRARY`, `ALTER LIBRARY`, `SHOW CREATE LIBRARY`, and `SHOW LIBRARY STATUS` statements executed. For more information, see Com_xxx Variables.


#### 7.5.7.3 MLE Component Memory and Thread Usage

Memory allocation and usage information for the MLE component can be obtained by checking the values of the `mle_heap_status` and `mle_memory_used` status variables. Memory is not allocated until the component is activated by creating or executing a stored program that uses JavaScript. This means that, until the component is active, the value of `mle_heap_status` is `Not Allocated` and `mle_memory_used` is `0`. When the component is active, `mle_heap_status` should be `Allocated`, and `mle_memory_used` should be an integer in the range of 0 to 100 inclusive; the latter variable indicates the memory used by the MLE component as a percentage of the amount allocated to it, rounded up to the nearest whole number. It is also possible for `mle_heap_status` to be `Garbage Collection`, should it become necessary to reclaim memory that is no longer being used.

By default, the amount of memory allocated to the MLE component is calculated using the formula: (0.05) \* (total physical memory in GB), and kept within the range 0.4GB to 32GB. You can adjust this by setting the `mle.memory_max` system variable up to a maximum of 8GB (8589934592 bytes); the minimum possible value is 32MB. When increasing this, you should keep in mind that sufficient memory must remain for other uses by the MySQL server, and for system processes to operate correctly.

Setting `mle.memory_max` to a value that is greater than the total amount of memory on the system causes undefined behavior.

Important

You can change the amount of memory allocated to the MLE component only when the component is inactive. To set the allocation to a non-default value at install time, use a statement such as [`INSTALL COMPONENT 'file://component_mle' SET GLOBAL mle.memory_max = 1024*1024*512`](install-component.html "15.7.4.3 INSTALL COMPONENT Statement"), or set it after installing but before making any use of JavaScript stored programs.

You can obtain the number of out of memory errors that have been raised by MLE stored programs by checking the value of the `mle_oom_errors` status variable.

For information about threads used by the Multilingual Engine Component, you can consult the `mle_threads` status variable, which shows the current number of physical threads attached to GraalVM. `mle_threads_max` shows the maximum number of simultaneous physical threads attached to GraalVM at any point in time since the component became active.


#### 7.5.7.4 MLE Component Stored Program Usage

Several system status variables provide information about usage of MLE stored programs. The `mle_stored_procedures`, `mle_stored_functions`, and `mle_stored_programs` status variables show, respectively, the numbers of MLE stored procedures, MLE stored functions, and MLE stored programs which are presently cached, across all user sessions.

Additional MLE stored program metrics can be obtained from two status variables `mle_stored_program_bytes_max`, which provides the size, in bytes, of the largest current MLE stored program, and `mle_stored_program_sql_max` shows the maximum number of SQL statements executed by any MLE stored program.

Other information about MLE stored programs can be found in the Information Schema `ROUTINES` table.

MLE stored programs in MySQL Enterprise Edition 9.5 support imported JavaScript libraries. Information about MLE JavaScript libraries is available in the two Information Schema tables `LIBRARIES` and `ROUTINE_LIBRARIES`. For more information and examples of their use, see the descriptions of these tables, as well as Section 27.3.8, “Using JavaScript Libraries”.

`SHOW LIBRARY STATUS` can also provide useful information about one or more JavaScript libraries; see Section 27.3.8, “Using JavaScript Libraries”.


### 7.5.8 Option Tracker Component

The Option Tracker component provides information about features of the MySQL server, as well as about MySQL components and plugins that are installed on the system:

* Purpose: Provide information about MySQL features. These may be integral to the MySQL server, and may also be implemented by components or plugins installed on the system.

* URN: `file://component_option_tracker`

Note

In this context, we refer to these features as “options”. These should not be confused with command-line options used with MySQL programs such as **mysqld** or the **mysql** client.

This component is available as part of MySQL Enterprise Edition, a commercial offering.

See Section 7.5.8.2, “Option Tracker Supported Components”, for information about the features and components which support the Option Tracker.


#### 7.5.8.1 Option Tracker Tables

The Option Tracker supplies option information in the form of two tables, listed here:

* `performance_schema.mysql_option`: For each option implemented by a component or plugin installed on the system, this Performance Schema table shows the name of the option, the name or the component or plugin that provides the associated feature, and whether this feature is currently enabled. This table is installed by executing [`INSTALL COMPONENT 'file://component_option_tracker'`](install-component.html "15.7.4.3 INSTALL COMPONENT Statement").

  This table, like other Performance Schema tables, is read-only, and thus cannot be updated or truncated by users.

  See Section 29.12.22.7, “The mysql_option Table”, for more detailed information about this table, such as columns and their possible values.

* `mysql_option.option_usage`: Shows, for each option installed, the name of the associated feature, feature usage data in `JSON` format, and other information. This table is installed by executing the SQL script `option_tracker_install.sql`, and uninstalled by executing `option_tracker_uninstall.sql`, both found in the MySQL `share` directory.

  This table should be regarded as read-only. Reading `mysql_option.option_usage` requires the `OPTION_TRACKER_UPDATER` privilege or the `OPTION_TRACKER_OBSERVER` privilege.

  While it is possible to write to this table, *we strongly recommend that you not attempt to do so*.

  More detailed information about this table is given later in this section.

Important

`INSTALL COMPONENT 'file://component_option_tracker'` installs the component library and the Performance Schema `mysql_option` table, but does *not* install the `mysql_option.option_usage` table, which requires executing the installation SQL script found in the MySQL Server `share` directory as described in the next few paragraphs.

To perform a complete installation of the Option Tracker component, execute the installation script from the system shell like this:

```
$> mysql -uusername -ppassword < path/to/option_tracker_install.sql
```

(You may need to use additional options, such as `-h`, for the **mysql** client when running the installation script in this way, depending on the circumstances.)

Alternatively, you can execute the script from within a MySQL client session using the `source` or `\.` command, as shown here:

```
mysql> source path/to/option_tracker_install.sql

mysql> \. path/to/option_tracker_install.sql
```

The path is relative to the directory in which the **mysql** client is run.

For more information, see Section 6.5.1.5, “Executing SQL Statements from a Text File”.

The `mysql_option.option_usage` table provides usage information about options available in the MySQL Server, components, and plugins:

```
mysql> TABLE mysql_option.option_usage\G
*************************** 1. row ***************************
 CLUSTER_ID:
  SERVER_ID:
OPTION_NAME: JavaScript Library
 USAGE_DATA: {"usedCounter": "2", "usedDate": "2025-03-11T17:08:31Z"}
*************************** 2. row ***************************
 CLUSTER_ID:
  SERVER_ID:
OPTION_NAME: JavaScript Stored Program
 USAGE_DATA: {"usedCounter": "5", "usedDate": "2025-03-11T17:08:31Z"}
```

The `option_usage` table has the following columns:

* `CLUSTER_ID`

  The UUID of the MySQL Group Replication cluster of which this server is part. Currently left empty.

* `SERVER_ID`

  The server UUID if it is part of a MySQL Group Replication cluster . Currently left empty.

* `OPTION_NAME`

  The unique name of the feature.

* `USAGE_DATA`

  Option usage data in `JSON` object format. This data uses 2 keys, listed here:

  + `usedCounter`: An integer indicating the number of times the feature has been used.

  + `usedDate`: A UTC date and time indicating when the feature was most recently used.

  This information is persistent between server restarts, and may be present even though the corresponding option is not currently enabled (or even if it is not installed).

This table has a primary key on the `CLUSTER_ID`, `SERVER_ID`, and `OPTION_NAME` columns. The `OPTION_NAME` column value in this table for a given option is the same as the `OPTION_NAME` column value for the same feature in the `performance_schema.mysql_option` table. Thus, you can join the two tables in a manner similar to what is shown here:

```
mysql> SELECT * FROM performance_schema.mysql_option o
    -> JOIN mysql_option.option_usage u
    -> ON o.OPTION_NAME=u.OPTION_NAME\G
*************************** 1. row ***************************
     OPTION_NAME: JavaScript Library
  OPTION_ENABLED: TRUE
OPTION_CONTAINER: component:mle
      CLUSTER_ID:
       SERVER_ID:
     OPTION_NAME: JavaScript Library
      USAGE_DATA: {"used": false, "usedDate": "2025-01-13T17:08:31Z"}
*************************** 2. row ***************************
     OPTION_NAME: JavaScript Stored Program
  OPTION_ENABLED: TRUE
OPTION_CONTAINER: component:mle
      CLUSTER_ID:
       SERVER_ID:
     OPTION_NAME: JavaScript Stored Program
      USAGE_DATA: {"used": false, "usedDate": "2025-01-13T17:08:31Z"}
```

Unlike the Performance Schema `mysql_option` table, the `option_usage` table is writeable and can be updated using SQL statements.

In Group Replication, option usage data originates on the primary. It is neither written to the binary log nor replicated, but it is propagated to secondaries using the Group Replication protocol. Individual replicas can write their own option usage data into this table. This includes read/write nodes in Group Replication clusters; read-only nodes cannot write to this table.

User accounts must be granted the necessary privileges to access this table.


#### 7.5.8.2 Option Tracker Supported Components

To be shown in the `mysql_option.option_usage` and `mysql_option` tables, a component or plugin must be written and compiled with support for the Option Tracker. Components and plugins providing such support in MySQL 9.5 include those shown in the following table:

**Table 7.8 Components and Plugins with Option Tracker Support**

<table border="1" class="table" summary="This table shows MySQL options (components and plugins) which support the Option Tracker component in MySQL 9.5. For each option, the table shows the name, container name, when the option is enabled, and what events or actions increment the associated counter."><colgroup><col/><col/><col/><col/></colgroup><thead><tr><th scope="col">Name</th><th scope="col">Container</th><th scope="col">Enabled</th><th scope="col">Incremented</th></tr></thead><tbody><tr><td scope="row">AWS keyring plugin</td><td><code>keyring_aws</code> plugin</td><td>always</td><td>When any of the general-purpose keyring functions (see Section 8.4.5.15, “General-Purpose Keyring Key-Management Functions”) are called using this component</td></tr><tr><td scope="row">Binary Log</td><td><code>mysql_server</code></td><td>When binary logging is enabled (that is, when <code>--log-bin</code> is set)</td><td>Every 10 minutes when enabled</td></tr><tr><td scope="row">Connection control component</td><td><code>component_connection_control</code> component</td><td>When <code>component_connection_control.failed_connections_threshold</code> != 0</td><td>When a failed connection attempt is delayed</td></tr><tr><td scope="row">Connection DoS control</td><td><code>connection_control</code> plugin</td><td>When <code>connection_control_failed_connections_threshold</code> != 0</td><td>When a failed connection attempt is delayed</td></tr><tr><td scope="row">Encrypted File keyring</td><td><code>component_keyring_encrypted_file</code></td><td>always</td><td>When any of the general-purpose keyring functions (see Section 8.4.5.15, “General-Purpose Keyring Key-Management Functions”) are called using this component</td></tr><tr><td scope="row">Enterprise AUDIT</td><td><code>audit_log plugin</code></td><td><code>audit_log_disable</code> = OFF</td><td>When any of this plugin's functions are called, or a new audit output file is opened for writing</td></tr><tr><td scope="row">Enterprise Data Masking</td><td><code>component_masking</code></td><td>always</td><td>When any of this component's functions are called</td></tr><tr><td scope="row">Enterprise Encryption</td><td><code>component_enterprise_encryption</code></td><td>always</td><td>When any of this component's functions are called</td></tr><tr><td scope="row">Enterprise Firewall</td><td><code>MYSQL_FIREWALL</code> plugin</td><td>When <code>mysql_firewall_mode</code> = ON</td><td>When any of this plugin's administrative functions (see MySQL Enterprise Firewall Administrative Functions) are called, or a statement is added, flagged, or rejected</td></tr><tr><td scope="row">Enterprise Firewall</td><td><code>component_firewall</code></td><td>When <code>component_firewall.enabled</code> = ON</td><td>When any of this components's administrative functions (see MySQL Enterprise Firewall Component Functions) are called, or when a statement is added, flagged, or rejected</td></tr><tr><td scope="row">Enterprise Thread Pool</td><td><code>thread_pool</code> plugin</td><td>always</td><td>When the plugin is initialized, or a new connection added</td></tr><tr><td scope="row">File keyring</td><td><code>component_keyring_file</code></td><td>always</td><td>When any of the general-purpose keyring functions (see Section 8.4.5.15, “General-Purpose Keyring Key-Management Functions”) are called using this component</td></tr><tr><td scope="row">Group Replication</td><td><code>group_replication</code> plugin</td><td>When Group Replication is running</td><td>Every 10 minutes while the plugin is enabled; whenever the plugin is enabled or disabled; when the plugin sets <code>read_only</code> off on promotion to group primary</td></tr><tr><td scope="row">Hashicorp keyring</td><td><code>component_keyring_hashicorp</code></td><td>always</td><td>When any of the general-purpose keyring functions (see Section 8.4.5.15, “General-Purpose Keyring Key-Management Functions”) are called using this component</td></tr><tr><td scope="row">Hashicorp keyring</td><td><code>keyring_hashicoprp</code> plugin</td><td>always</td><td>When any of the general-purpose keyring functions (see Section 8.4.5.15, “General-Purpose Keyring Key-Management Functions”) are called using this plugin</td></tr><tr><td scope="row">Hypergraph Optimizer</td><td><code>mysql_server</code></td><td>When server is compiled with hypergraph optimizer support (MySQL HeatWave only)</td><td>Each time a query is executed using the hypergraph optimizer</td></tr><tr><td scope="row">HyperLogLog</td><td><code>component_hll</code></td><td>always</td><td>Whenever the <code>HLL()</code> aggregate function (MySQL HeatWave only) is called</td></tr><tr><td scope="row">JavaScript Library</td><td><code>component:mle</code></td><td>always</td><td>Whenever a JavaScript library is created or used</td></tr><tr><td scope="row">JavaScript Stored Program</td><td><code>component:mle</code></td><td>always</td><td>Whenever a JavaScript stored program is invoked</td></tr><tr><td scope="row">JSON Duality View</td><td><code>mysql_server</code></td><td>always</td><td>Whenever a JSON duality view is opened (see Section 27.7, “JSON Duality Views”)</td></tr><tr><td scope="row">Kerberos authentication</td><td><code>authentication_kerberos</code> plugin</td><td>always</td><td>When any of the general-purpose keyring functions (see Section 8.4.5.15, “General-Purpose Keyring Key-Management Functions”) are called using this component</td></tr><tr><td scope="row">LDAP Simple authentication</td><td><code>authentication_ldap_simple</code> plugin</td><td>always</td><td>When any of the general-purpose keyring functions (see Section 8.4.5.15, “General-Purpose Keyring Key-Management Functions”) are called using this plugin</td></tr><tr><td scope="row">MySQL Server</td><td><code>mysql_server</code></td><td>always</td><td>Every 10 minutes</td></tr><tr><td scope="row">MySQL Telemetry</td><td><code>component_telemetry</code></td><td>always</td><td>Every 1000th time that traces, logs, or metrics are exported</td></tr><tr><td scope="row">OCI Authentication</td><td><code>authentication_oci</code> plugin</td><td>always</td><td>When any of this plugin's functions are called</td></tr><tr><td scope="row">Oracle Key Vault keyring</td><td><code>keyring_okv</code> plugin</td><td>always</td><td>When any of the general-purpose keyring functions (see Section 8.4.5.15, “General-Purpose Keyring Key-Management Functions”) are called using this plugin</td></tr><tr><td scope="row">PAM authentication</td><td><code>authentication_pam</code> plugin</td><td>always</td><td>When any of the general-purpose keyring functions (see Section 8.4.5.15, “General-Purpose Keyring Key-Management Functions”) are called using this plugin</td></tr><tr><td scope="row">Password validation</td><td><code>component_validate_password</code></td><td>always</td><td>Whenever passwords are evaluated for strength, validated, or changed using this component</td></tr><tr><td scope="row">Replication Replica</td><td><code>mysql_server</code></td><td>When server acts as replica (at least one channel)</td><td>Every 10 minutes whenever replication is enabled; each time a secondary is reset or the primary is changed</td></tr><tr><td scope="row">SASL LDAP Authentication</td><td><code>authentication_ldap_sasl</code> plugin</td><td>always</td><td>When any of the general-purpose keyring functions (see Section 8.4.5.15, “General-Purpose Keyring Key-Management Functions”) are called using this plugin</td></tr><tr><td scope="row">Scheduler</td><td><code>component_scheduler</code></td><td>always</td><td>Whenever a scheduled task is created, run, or deleted</td></tr><tr><td scope="row">Traditional MySQL Optimizer</td><td><code>mysql_server</code></td><td>always</td><td>Each time a query is executed using the traditional optimizer</td></tr><tr><td scope="row">Vector</td><td><code>component_vector</code></td><td>always</td><td>Whenever the <code>DISTANCE()</code> function (or its alias <code>VECTOR_DISTANCE()</code>) is called (MySQL HeatWave only)</td></tr><tr><td scope="row">WebAssembly Library</td><td><code>component:mle</code></td><td>always</td><td>Whenever a WebAssembly library is created or used</td></tr><tr><td scope="row">WebauthN authentication</td><td><code>authentication_webauth</code> plugin</td><td>always</td><td>When any of the general-purpose keyring functions (see Section 8.4.5.15, “General-Purpose Keyring Key-Management Functions”) are called using this plugin</td></tr><tr><td scope="row">Windows authentication</td><td><code>authentication_windows</code> plugin</td><td>always</td><td>When any of the general-purpose keyring functions (see Section 8.4.5.15, “General-Purpose Keyring Key-Management Functions”) are called using this plugin</td></tr></tbody></table>

The component name displayed in the table's **Name** column is the value shown by the `OPTION_NAME` column of the `mysql_option.option_usage` table (see Section 7.5.8.1, “Option Tracker Tables”) and the `OPTION_NAME` column of the Performance Schema `mysql_option` table. The name of the Option Tracker status variable (usage counter) associated with this component is formed by prefixing this value with `option_tracker_usage:`.

The name shown in the table' **Container** column is the value displayed in the `performance_schema.mysql_option` table's `OPTION_CONTAINER` column.

The **Enabled** column shows the conditions under which the component is enabled.

The **Incremented** column shows what events or actions cause this component's usage counter to be increased.

Note

Enterprise Data Masking was previously known as Enterprise Data Masking and Deidentification.


#### 7.5.8.3 Option Tracker Status Variables

The Option Tracker component supplies a number of status variables, which are described in this section.

**Table 7.9 Option Tracker Status Variable Summary**

<table frame="box" rules="all" summary="Reference for status variables supplied by the Option Tracker."><col style="width: 40%"/><col style="width: 20%"/><col align="center" style="width: 20%"/><thead><tr><th scope="col">Variable Name</th> <th scope="col">Variable Type</th> <th scope="col">Variable Scope</th> </tr></thead><tbody><tr><th scope="row">option_tracker_usage:AWS keyring plugin</th> <td>Integer</td> <td>Global</td> </tr><tr><th scope="row">option_tracker_usage:Binary Log</th> <td>Integer</td> <td>Global</td> </tr><tr><th scope="row">option_tracker_usage:Connection control component</th> <td>Integer</td> <td>Global</td> </tr><tr><th scope="row">option_tracker_usage:Connection DoS control</th> <td>Integer</td> <td>Global</td> </tr><tr><th scope="row">option_tracker_usage:Encrypted File keyring</th> <td>Integer</td> <td>Global</td> </tr><tr><th scope="row">option_tracker_usage:Enterprise AUDIT</th> <td>Integer</td> <td>Global</td> </tr><tr><th scope="row">option_tracker_usage:Enterprise Data Masking</th> <td>Integer</td> <td>Global</td> </tr><tr><th scope="row">option_tracker_usage:Enterprise Encryption</th> <td>Integer</td> <td>Global</td> </tr><tr><th scope="row">option_tracker_usage:Enterprise Firewall</th> <td>Integer</td> <td>Global</td> </tr><tr><th scope="row">option_tracker_usage:Enterprise Thread Pool</th> <td>Integer</td> <td>Global</td> </tr><tr><th scope="row">option_tracker_usage:File keyring</th> <td>Integer</td> <td>Global</td> </tr><tr><th scope="row">option_tracker_usage:Group Replication</th> <td>Integer</td> <td>Global</td> </tr><tr><th scope="row">option_tracker_usage:Hashicorp keyring</th> <td>Integer</td> <td>Global</td> </tr><tr><th scope="row">option_tracker_usage:Hypergraph Optimizer</th> <td>Integer</td> <td>Global</td> </tr><tr><th scope="row">option_tracker_usage:HyperLogLog</th> <td>Integer</td> <td>Global</td> </tr><tr><th scope="row">option_tracker_usage:JavaScript Library</th> <td>Integer</td> <td>Global</td> </tr><tr><th scope="row">option_tracker_usage:JavaScript Stored Program</th> <td>Integer</td> <td>Global</td> </tr><tr><th scope="row">option_tracker_usage:JSON Duality View</th> <td>Integer</td> <td>Global</td> </tr><tr><th scope="row">option_tracker_usage:Kerberos authentication</th> <td>Integer</td> <td>Global</td> </tr><tr><th scope="row">option_tracker_usage:LDAP Simple authentication</th> <td>Integer</td> <td>Global</td> </tr><tr><th scope="row">option_tracker_usage:MySQL Server</th> <td>Integer</td> <td>Global</td> </tr><tr><th scope="row">option_tracker_usage:MySQL Shell</th> <td>Integer</td> <td>Global</td> </tr><tr><th scope="row">option_tracker_usage:MySQL Shell _ Copy</th> <td>Integer</td> <td>Global</td> </tr><tr><th scope="row">option_tracker_usage:MySQL Shell _ Dump</th> <td>Integer</td> <td>Global</td> </tr><tr><th scope="row">option_tracker_usage:MySQL Shell _ Dump _ Load</th> <td>Integer</td> <td>Global</td> </tr><tr><th scope="row">option_tracker_usage:MySQL Shell for VS Code</th> <td>Integer</td> <td>Global</td> </tr><tr><th scope="row">option_tracker_usage:MySQL Shell _ MRS</th> <td>Integer</td> <td>Global</td> </tr><tr><th scope="row">option_tracker_usage:MySQL Shell _ Upgrade Checker</th> <td>Integer</td> <td>Global</td> </tr><tr><th scope="row">option_tracker_usage:MySQL Shell VSC _ Dump</th> <td>Integer</td> <td>Global</td> </tr><tr><th scope="row">option_tracker_usage:MySQL Shell VSC _ Dump _ Load</th> <td>Integer</td> <td>Global</td> </tr><tr><th scope="row">option_tracker_usage:MySQL Shell VSC _ HeatWave Chat</th> <td>Integer</td> <td>Global</td> </tr><tr><th scope="row">option_tracker_usage:MySQL Shell VSC _ Lakehouse Navigator</th> <td>Integer</td> <td>Global</td> </tr><tr><th scope="row">option_tracker_usage:MySQL Shell VSC _ MRS</th> <td>Integer</td> <td>Global</td> </tr><tr><th scope="row">option_tracker_usage:MySQL Shell VSC _ Natural Language to SQL</th> <td>Integer</td> <td>Global</td> </tr><tr><th scope="row">option_tracker_usage:MySQL Telemetry</th> <td>Integer</td> <td>Global</td> </tr><tr><th scope="row">option_tracker_usage:OCI Authentication</th> <td>Integer</td> <td>Global</td> </tr><tr><th scope="row">option_tracker_usage:Oracle Key Vault keyring</th> <td>Integer</td> <td>Global</td> </tr><tr><th scope="row">option_tracker_usage:PAM authentication</th> <td>Integer</td> <td>Global</td> </tr><tr><th scope="row">option_tracker_usage:Password validation</th> <td>Integer</td> <td>Global</td> </tr><tr><th scope="row">option_tracker_usage:Replication Replica</th> <td>Integer</td> <td>Global</td> </tr><tr><th scope="row">option_tracker_usage:SASL LDAP Authentication</th> <td>Integer</td> <td>Global</td> </tr><tr><th scope="row">option_tracker_usage:Scheduler</th> <td>Integer</td> <td>Global</td> </tr><tr><th scope="row">option_tracker_usage:Traditional MySQL Optimizer</th> <td>Integer</td> <td>Global</td> </tr><tr><th scope="row">option_tracker_usage:Vector</th> <td>Integer</td> <td>Global</td> </tr><tr><th scope="row">option_tracker_usage:WebAssembly Library</th> <td>Integer</td> <td>Global</td> </tr><tr><th scope="row">option_tracker_usage:WebauthN authentication</th> <td>Integer</td> <td>Global</td> </tr><tr><th scope="row">option_tracker_usage:Windows authentication</th> <td>Integer</td> <td>Global</td> </tr><tr><th scope="row">option_tracker.gr_complete_table_received</th> <td>Integer</td> <td>Global</td> </tr><tr><th scope="row">option_tracker.gr_complete_table_sent</th> <td>Integer</td> <td>Global</td> </tr><tr><th scope="row">option_tracker.gr_error_received</th> <td>Integer</td> <td>Global</td> </tr><tr><th scope="row">option_tracker.gr_error_sent</th> <td>Integer</td> <td>Global</td> </tr><tr><th scope="row">option_tracker.gr_reset_request_received</th> <td>Integer</td> <td>Global</td> </tr><tr><th scope="row">option_tracker.gr_reset_request_sent</th> <td>Integer</td> <td>Global</td> </tr><tr><th scope="row">option_tracker.gr_single_row_received</th> <td>Integer</td> <td>Global</td> </tr><tr><th scope="row">option_tracker.gr_single_row_sent</th> <td>Integer</td> <td>Global</td> </tr></tbody></table>

* [`option_tracker_usage:AWS keyring plugin`](option-tracker-component-status-variables.html#statvar_option_tracker_usage-AWS_keyring_plugin)

  Number of times a general-purpose keyring function has been called using the AWS keyring plugin.

* [`option_tracker_usage:Binary Log`](option-tracker-component-status-variables.html#statvar_option_tracker_usage-Binary_Log)

  Incremented every 600 seconds (10 minutes) while binary logging is enabled.

* [`option_tracker_usage:Connection control component`](option-tracker-component-status-variables.html#statvar_option_tracker_usage-Connection_control_component)

  The number of times that a failed connection attempt has been delayed.

* [`option_tracker_usage:Connection DoS control`](option-tracker-component-status-variables.html#statvar_option_tracker_usage-Connection_DoS_control)

  The number of times a failed connection attempt has been delayed.

* [`option_tracker_usage:Encrypted File keyring`](option-tracker-component-status-variables.html#statvar_option_tracker_usage-Encrypted_File_keyring)

  Number of times that any of the general-purpose keyring functions (see Section 8.4.5.15, “General-Purpose Keyring Key-Management Functions”) have been called.

* [`option_tracker_usage:Enterprise AUDIT`](option-tracker-component-status-variables.html#statvar_option_tracker_usage-Enterprise_AUDIT)

  This count is incremented when any Audit Log plugin function is called, or when a new audit output file is opened for writing. See Section 8.4.6, “MySQL Enterprise Audit”, for more information.

* [`option_tracker_usage:Enterprise Data Masking`](option-tracker-component-status-variables.html#statvar_option_tracker_usage-Enterprise_Data_Masking)

  This value is incremented each time that a MySQL Enterprise Data Masking function is used. See Section 8.5, “MySQL Enterprise Data Masking”.

* [`option_tracker_usage:Enterprise Encryption`](option-tracker-component-status-variables.html#statvar_option_tracker_usage-Enterprise_Encryption)

  This is incremented each time a MySQL Enterprise Encryption function is called. See Section 8.6, “MySQL Enterprise Encryption”, for more information.

* [`option_tracker_usage:Enterprise Firewall`](option-tracker-component-status-variables.html#statvar_option_tracker_usage-Enterprise_Firewall)

  This status variable is incremented each time a MySQL Enterprise Firewall administrative function is called, or a statement is added, flagged, or rejected. See Section 8.4.8, “MySQL Enterprise Firewall”.

* [`option_tracker_usage:Enterprise Thread Pool`](option-tracker-component-status-variables.html#statvar_option_tracker_usage-Enterprise_Thread_Pool)

  The number of times that the MySQL Enterprise Thread Pool plugin has been initialized, or a new connection added. See Section 7.6.3, “MySQL Enterprise Thread Pool”, for more information.

* [`option_tracker_usage:File keyring`](option-tracker-component-status-variables.html#statvar_option_tracker_usage-File_keyring)

  This variable is imcremented each time any general-purpose keyring function (see Section 8.4.5.15, “General-Purpose Keyring Key-Management Functions”) is called.

* [`option_tracker_usage:Group Replication`](option-tracker-component-status-variables.html#statvar_option_tracker_usage-Group_Replication)

  This status variable is incremented every 600 seconds (10 minutes) whenever the MySQL Group Replication plugin is running. See Chapter 20, *Group Replication*.

* [`option_tracker_usage:Hashicorp keyring`](option-tracker-component-status-variables.html#statvar_option_tracker_usage-Hashicorp_keyring)

  The number of times any of the general-purpose keyring functions (see Section 8.4.5.15, “General-Purpose Keyring Key-Management Functions”) have been called using the Hashicorp keyring component.

* [`option_tracker_usage:Hypergraph Optimizer`](option-tracker-component-status-variables.html#statvar_option_tracker_usage-Hypergraph_Optimizer)

  Number of times a query was optimized using the Hypergrpah Optimizer. MySQL HeatWave only.

* `option_tracker_usage:HyperLogLog`

  Incremented whenever the `HLL()` aggregate function is called. MySQL HeatWave only.

* [`option_tracker_usage:JavaScript Library`](option-tracker-component-status-variables.html#statvar_option_tracker_usage-JavaScript_Library)

  Number of times that a JavaScript library has been created or used. See Section 27.3.8, “Using JavaScript Libraries”.

* [`option_tracker_usage:JavaScript Stored Program`](option-tracker-component-status-variables.html#statvar_option_tracker_usage-JavaScript_Stored_Program)

  Incremented each time a JavaScript program is invoked. See Section 27.3, “JavaScript Stored Programs”.

* [`option_tracker_usage:JSON Duality View`](option-tracker-component-status-variables.html#statvar_option_tracker_usage-JSON_Duality_View)

  Number of times that a JSON duality view has been opened. See Section 27.7, “JSON Duality Views”.

* [`option_tracker_usage:Kerberos authentication`](option-tracker-component-status-variables.html#statvar_option_tracker_usage-Kerberos_authentication)

  When any of the general-purpose keyring functions (see Section 8.4.5.15, “General-Purpose Keyring Key-Management Functions”) are called using the Kerberos authentication component.

* [`option_tracker_usage:LDAP Simple authentication`](option-tracker-component-status-variables.html#statvar_option_tracker_usage-LDAP_Simple_authentication)

  Incremented whenever any of the general-purpose keyring functions (see Section 8.4.5.15, “General-Purpose Keyring Key-Management Functions”) are called using the `authentication_ldap_simple` plugin.

* [`option_tracker_usage:MySQL Server`](option-tracker-component-status-variables.html#statvar_option_tracker_usage-MySQL_Server)

  This status variable is reset to 0 whenever the MySQL server is restarted. Thereafter, it is incremented every 600 seconds (10 minutes) as long as the server is running.

* `option_tracker_usage-MySQL_Shell_VSC_HeatWave_Chat`

  Reserved for future development.

* `option_tracker_usage-MySQL_Shell_VSC_Natural_Language_to_SQL`

  Reserved for future development.

* `option_tracker_usage-MySQL_Shell_VSC_Lakehouse_Navigator`

  Reserved for future development.

* `option_tracker_usage-MySQL_Shell`

  Reserved for future development.

* `option_tracker_usage-MySQL_Shell_for_VS_Code`

  Reserved for future development.

* `option_tracker_usage-MySQL_Shell_Dump`

  Reserved for future development.

* `option_tracker_usage-MySQL_Shell_VSC_Dump`

  Reserved for future development.

* `option_tracker_usage-MySQL_Shell_Dump_Load`

  Reserved for future development.

* `option_tracker_usage-MySQL_Shell_VSC_Dump_Load`

  Reserved for future development.

* `option_tracker_usage-MySQL_Shell_MRS`

  Reserved for future development.

* `option_tracker_usage-MySQL_Shell_VSC_MRS`

  Reserved for future development.

* `option_tracker_usage-MySQL_Shell_Copy`

  Reserved for future development.

* `option_tracker_usage-MySQL_Shell_Upgrade_Checker`

  Reserved for future development.

* [`option_tracker_usage:MySQL Telemetry`](option-tracker-component-status-variables.html#statvar_option_tracker_usage-MySQL_Telemetry)

  This value is incremented every 1000th time that traces, logs, or metrics are exported.

* [`option_tracker_usage:OCI Authentication`](option-tracker-component-status-variables.html#statvar_option_tracker_usage-OCI_Authentication)

  Incremented each time any OCI Authentication plugin function is called.

* [`option_tracker_usage:Oracle Key Vault keyring`](option-tracker-component-status-variables.html#statvar_option_tracker_usage-Oracle_Key_Vault_keyring)

  The number of times any of the general-purpose keyring functions (see Section 8.4.5.15, “General-Purpose Keyring Key-Management Functions”) have been called using the Oracle Key Vault keyring plugin.

* [`option_tracker_usage:PAM authentication`](option-tracker-component-status-variables.html#statvar_option_tracker_usage-PAM_authentication)

  The number of times any of the general-purpose keyring functions (see Section 8.4.5.15, “General-Purpose Keyring Key-Management Functions”) have been called using the PAM Authentication plugin. For more information, see Section 8.4.1.4, “PAM Pluggable Authentication”.

* [`option_tracker_usage:Password validation`](option-tracker-component-status-variables.html#statvar_option_tracker_usage-Password_validation)

  The number of times that passwords have been evaluated for strength, validated, or changed using `component_validate_password`. See Section 8.4.4, “The Password Validation Component”.

* [`option_tracker_usage:Replication Replica`](option-tracker-component-status-variables.html#statvar_option_tracker_usage-Replication_Replica)

  Every 600 seconds (10 minutes) whenever replication is enabled and this server is acting as a replica; reset each time a secondary is reset or the primary is changed.

* [`option_tracker_usage:SASL LDAP Authentication`](option-tracker-component-status-variables.html#statvar_option_tracker_usage-SASL_LDAP_Authentication)

  The number of times that a password has been evaluated for strength, validated, or changed using the `authentication_ldap_sasl` plugin. See Section 8.4.1.6, “LDAP Pluggable Authentication”, for more information.

* `option_tracker_usage:Scheduler`

  The number of times that a scheduled task has been created, executed, or deleted using the Scheduler component. See Section 7.5.5, “Scheduler Component”.

* [`option_tracker_usage:Traditional MySQL Optimizer`](option-tracker-component-status-variables.html#statvar_option_tracker_usage-Traditional_MySQL_Optimizer)

  This is the number of times that queries has been executed using the traditional MySQL optimizer.

* `option_tracker_usage:Vector`

  Incremented whenever the `DISTANCE()` function or its alias `VECTOR_DISTANCE()` is called (MySQL HeatWave only)

* [`option_tracker_usage:WebAssembly Library`](option-tracker-component-status-variables.html#statvar_option_tracker_usage-WebAssembly_Library)

  The number of times that WebAssembly libraries have been created or used. See Section 27.3.9, “Using WebAssembly Libraries”, for more information.

* [`option_tracker_usage:WebauthN authentication`](option-tracker-component-status-variables.html#statvar_option_tracker_usage-WebauthN_authentication)

  The number of times any of the general-purpose keyring functions (see Section 8.4.5.15, “General-Purpose Keyring Key-Management Functions”) have been called using the WebauthN authentication plugin. For more information, see Section 8.4.1.11, “WebAuthn Pluggable Authentication”.

* [`option_tracker_usage:Windows authentication`](option-tracker-component-status-variables.html#statvar_option_tracker_usage-Windows_authentication)

  This value is incremented each time any of the general-purpose keyring functions (see Section 8.4.5.15, “General-Purpose Keyring Key-Management Functions”) is called using the MySQL Windows authentication plugin. See Section 8.4.1.5, “Windows Pluggable Authentication”, for more information.

* `option_tracker.gr_complete_table_received`

  This is the number of complete tables which have been received through Group Replication.

* `option_tracker.gr_complete_table_sent`

  This is the number of complete tables which have been sent through Group Replication.

* `option_tracker.gr_error_received`

  This is the number of errors which have been received through Group Replication.

* `option_tracker.gr_error_sent`

  This is the number of errors which have been sent through Group Replication.

* `option_tracker.gr_reset_request_received`

  This is the number of reset requests which have been received through Group Replication.

* `option_tracker.gr_reset_request_sent`

  This is the number of reset requests which have been sent through Group Replication.

* `option_tracker.gr_single_row_received`

  This is the number of single rows which have been received through Group Replication.

* `option_tracker.gr_single_row_sent`

  This is the number of single rows which have been sent through Group Replication.


#### 7.5.8.4 Option Tracker System Variables

The Option Tracker component supplies a number of system variables, which are described in this section.

**Table 7.10 Option Tracker System Variable Summary**

<table frame="box" rules="all" summary="Reference for status variables supplied by the Option Tracker."><col style="width: 40%"/><col style="width: 20%"/><col align="center" style="width: 20%"/><thead><tr><th scope="col">Variable Name</th> <th scope="col">Variable Type</th> <th scope="col">Variable Scope</th> </tr></thead><tbody><tr><th scope="row">component_option_tracker.mysql_shell_support</th> <td>Boolean</td> <td>Global</td> </tr></tbody></table>

* `component_option_tracker.mysql_shell_support`

  Reserved for future development.


#### 7.5.8.5 Option Tracker Functions

The Option Tracker provides the functions shown in the next table. More detailed information about each function is provided in the list following the table.

These functions provide safe interfaces for reading and updating the `mysql_option.option_usage` table (see Section 7.5.8.1, “Option Tracker Tables”) and `performance_schema.mysql_option` table; in addition, changes made using the functions are propagated to Group Replication secondaries whereas changes made using SQL are not. For these reasons, you should always use the Option Tracker functions for modifying option usage data instead of attempting to update either of these tables directly.

**Table 7.11 Option Tracker Functions**

<table frame="box" rules="all" summary="A reference that lists functions provided by the Option Tracker Component."><col style="width: 28%"/><col style="width: 71%"/><thead><tr><th>Name</th> <th>Description</th> </tr></thead><tbody><tr><td><code>option_tracker_option_register()</code></td> <td> Register an option with the Option Tracker </td> </tr><tr><td><code>option_tracker_option_unregister()</code></td> <td> Deregister an option from the Option Tracker </td> </tr><tr><td><code>option_tracker_usage_get()</code></td> <td> Get usage data for an option registered with the Option Tracker </td> </tr><tr><td><code>option_tracker_usage_set()</code></td> <td> Set usage data for an option registered with the Option Tracker </td> </tr></tbody></table>

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
