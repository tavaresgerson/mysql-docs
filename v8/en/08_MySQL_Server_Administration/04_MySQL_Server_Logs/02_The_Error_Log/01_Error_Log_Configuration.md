#### 7.4.2.1 Error Log Configuration

In MySQL 8.0, error logging uses the MySQL component architecture described at Section 7.5, “MySQL Components”. The error log subsystem consists of components that perform log event filtering and writing, as well as a system variable that configures which components to load and enable to achieve the desired logging result.

This section discusses how to load and enable components for error logging. For instructions specific to log filters, see Section 7.4.2.4, “Types of Error Log Filtering”. For instructions specific to the JSON and system log sinks, see Section 7.4.2.7, “Error Logging in JSON Format”, and Section 7.4.2.8, “Error Logging to the System Log”. For additional details about all available log components, see Section 7.5.3, “Error Log Components”.

Component-based error logging offers these features:

* Log events that can be filtered by filter components to affect the information available for writing.

* Log events that are output by sink (writer) components. Multiple sink components can be enabled, to write error log output to multiple destinations.

* Built-in filter and sink components that implement the default error log format.

* A loadable sink that enables logging in JSON format.
* A loadable sink that enables logging to the system log.
* System variables that control which log components to load and enable and how each component operates.

Error log configuration is described under the following topics in this section:

* The Default Error Log Configuration
* Error Log Configuration Methods
* Implicit Error Log Configuration
* Explicit Error Log Configuration
* Changing the Error Log Configuration Method
* Troubleshooting Configuration Issues
* Configuring Multiple Log Sinks
* Log Sink Performance Schema Support

##### The Default Error Log Configuration

The `log_error_services` system variable controls which loadable log components to load (as of MySQL 8.0.30) and which log components to enable for error logging. By default, `log_error_services` has this value:

```
mysql> SELECT @@GLOBAL.log_error_services;
+----------------------------------------+
| @@GLOBAL.log_error_services            |
+----------------------------------------+
| log_filter_internal; log_sink_internal |
+----------------------------------------+
```

That value indicates that log events first pass through the `log_filter_internal` filter component, then through the `log_sink_internal` sink component, both of which are built-in components. A filter modifies log events seen by components named later in the `log_error_services` value. A sink is a destination for log events. Typically, a sink processes log events into log messages that have a particular format and writes these messages to its associated output, such as a file or the system log.

The combination of `log_filter_internal` and `log_sink_internal` implements the default error log filtering and output behavior. The action of these components is affected by other server options and system variables:

* The output destination is determined by the `--log-error` option (and, on Windows, `--pid-file` and `--console`). These determine whether to write error messages to the console or a file and, if to a file, the error log file name. See Section 7.4.2.2, “Default Error Log Destination Configuration”.

* The `log_error_verbosity` and `log_error_suppression_list` system variables affect which types of log events `log_filter_internal` permits or suppresses. See Section 7.4.2.5, “Priority-Based Error Log Filtering (log_filter_internal)”").

When configuring `log_error_services`, be aware of the following characteristics:

* A list of log components may be delimited by semicolon or (as of MySQL 8.0.12) comma, optionally followed by space. A given setting cannot use both semicolon and comma separators. Component order is significant because the server executes components in the order listed.

* The final component in the `log_error_services` value cannot be a filter. This is an error because any changes it has on events would have no effect on output:

  ```
  mysql> SET GLOBAL log_error_services = 'log_filter_internal';
  ERROR 1231 (42000): Variable 'log_error_services' can't be set to the value
  of 'log_filter_internal'
  ```

  To correct the problem, include a sink at the end of the value:

  ```
  mysql> SET GLOBAL log_error_services = 'log_filter_internal; log_sink_internal';
  ```

* The order of components named in `log_error_services` is significant, particularly with respect to the relative order of filters and sinks. Consider this `log_error_services` value:

  ```
  log_filter_internal; log_sink_1; log_sink_2
  ```

  In this case, log events pass to the built-in filter, then to the first sink, then to the second sink. Both sinks receive the filtered log events.

  Compare that to this `log_error_services` value:

  ```
  log_sink_1; log_filter_internal; log_sink_2
  ```

  In this case, log events pass to the first sink, then to the built-in filter, then to the second sink. The first sink receives unfiltered events. The second sink receives filtered events. You might configure error logging this way if you want one log that contains messages for all log events, and another log that contains messages only for a subset of log events.

##### Error Log Configuration Methods

Error log configuration involves loading and enabling error log components as necessary and performing component-specific configuration.

There are two error log configuration methods, *implicit* and *explicit*. It is recommended that one configuration method is selected and used exclusively. Using both methods can result in warnings at startup. For more information, see Troubleshooting Configuration Issues.

* *Implicit Error Log Configuration* (introduced in MySQL 8.0.30)

  This configuration method loads and enables the log components defined by the `log_error_services` variable. Loadable components that are not already loaded are loaded implicitly at startup before the `InnoDB` storage engine is fully available. This configuration method has the following advantages:

  + Log components are loaded early in the startup sequence, before the `InnoDB` storage engine, making logged information available sooner.

  + It avoids loss of buffered log information should a failure occur during startup.

  + Installing error log components using `INSTALL COMPONENT` is not required, simplifying error log configuration.

  To use this method, see Implicit Error Log Configuration.

* *Explicit Error Log Configuration*

  Note

  This configuration method is supported for backward compatibility. The implicit configuration method, introduced in MySQL 8.0.30, is recommended.

  This configuration method requires loading error log components using `INSTALL COMPONENT` and then configuring `log_error_services` to enable the log components. `INSTALL COMPONENT` adds the component to the `mysql.component` table (an `InnoDB` table), and the components to load at startup are read from this table, which is only accessible after `InnoDB` is initialized.

  Logged information is buffered during the startup sequence while the `InnoDB` storage engine is initialized, which is sometimes prolonged by operations such as recovery and data dictionary upgrade that occur during the `InnoDB` startup sequence.

  To use this method, see Explicit Error Log Configuration.

##### Implicit Error Log Configuration

This procedure describes how to load and enable error logging components implicitly using `log_error_services`. For a discussion of error log configuration methods, see Error Log Configuration Methods.

To load and enable error logging components implicitly:

1. List the error log components in the `log_error_services` value.

   To load and enable the error log components at server startup, set `log_error_services` in an option file. The following example configures the use of the JSON log sink (`log_sink_json`) in addition to the built-in log filter and sink (`log_filter_internal`, `log_sink_internal`).

   ```
   [mysqld]
   log_error_services='log_filter_internal; log_sink_internal; log_sink_json'
   ```

   Note

   To use the JSON log sink (`log_sink_syseventlog`) instead of the default sink (`log_sink_internal`), you would replace `log_sink_internal` with `log_sink_json`.

   To load and enable the component immediately and for subsequent restarts, set `log_error_services` using `SET PERSIST`:

   ```
   SET PERSIST log_error_services = 'log_filter_internal; log_sink_internal; log_sink_json';
   ```

2. If the error log component exposes any system variables that must be set for component initialization to succeed, assign those variables appropriate values. You can set these variables in an option file or using `SET PERSIST`.

   Important

   When implementing an implicit configuration, set `log_error_services` first to load a component and expose its system variables, and then set component system variables afterward. This configuration order is required regardless of whether variable assignment is performed on the command-line, in an option file, or using `SET PERSIST`.

To disable a log component, remove it from the `log_error_services` value. Also remove any associated component variables settings that you have defined.

Note

Loading a log component implicitly using `log_error_services` has no effect on the `mysql.component` table. It does not add the component to the `mysql.component` table, nor does it remove a component previously installed using `INSTALL COMPONENT` from the `mysql.component` table.

##### Explicit Error Log Configuration

This procedure describes how to load and enable error logging components explicitly by loading components using `INSTALL COMPONENT` and then enabling using `log_error_services`. For a discussion of error log configuration methods, see Error Log Configuration Methods.

To load and enable error logging components explicitly:

1. Load the component using `INSTALL COMPONENT` (unless it is built in or already loaded). For example, to load the JSON log sink, issue the following statement:

   ```
   INSTALL COMPONENT 'file://component_log_sink_json';
   ```

   Loading a component using `INSTALL COMPONENT` registers it in the `mysql.component` system table so that the server loads it automatically for subsequent startups, after `InnoDB` is initialized.

   The URN to use when loading a log component with `INSTALL COMPONENT` is the component name prefixed with `file://component_`. For example, for the `log_sink_json` component, the corresponding URN is `file://component_log_sink_json`. For error log component URNs, see Section 7.5.3, “Error Log Components”.

2. If the error log component exposes any system variables that must be set for component initialization to succeed, assign those variables appropriate values. You can set these variables in an option file or using `SET PERSIST`.

3. Enable the component by listing it in the `log_error_services` value.

   Important

   From MySQL 8.0.30, when loading log components explicitly using `INSTALL COMPONENT`, do not persist or set `log_error_services` in an option file, which loads log components implicitly at startup. Instead, enable log components at runtime using a `SET GLOBAL` statement.

   The following example configures the use of the JSON log sink (`log_sink_json`) in addition to the built-in log filter and sink (`log_filter_internal`, `log_sink_internal`).

   ```
   SET GLOBAL log_error_services = 'log_filter_internal; log_sink_internal; log_sink_json';
   ```

   Note

   To use the JSON log sink (`log_sink_syseventlog`) instead of the default sink (`log_sink_internal`), you would replace `log_sink_internal` with `log_sink_json`.

To disable a log component, remove it from the `log_error_services` value. Then, if the component is loadable and you also want to unload it, use `UNINSTALL COMPONENT`. Also remove any associated component variables settings that you have defined.

Attempts to use `UNINSTALL COMPONENT` to unload a loadable component that is still named in the `log_error_services` value produce an error.

##### Changing the Error Log Configuration Method

If you have previously loaded error log components explicitly using `INSTALL COMPONENT` and want to switch to an implicit configuration, as described in Implicit Error Log Configuration, the following steps are recommended:

1. Set `log_error_services` back to its default configuration.

   ```
   SET GLOBAL log_error_services = 'log_filter_internal,log_sink_internal';
   ```

2. Use `UNINSTALL COMPONENT` to uninstall any loadable logging components that you installed previously. For example, if you installed the JSON log sink previously, uninstall it as shown:

   ```
   UNINSTALL COMPONENT 'file://component_log_sink_json';
   ```

3. Remove any component variable settings for the uninstalled component. For example, if component variables were set in an option file, remove the settings from the option file. If component variables were set using `SET PERSIST`, use `RESET PERSIST` to clear the settings.

4. Follow the steps in Implicit Error Log Configuration to reimplement your configuration.

If you need to revert from an implicit configuration to an explicit configuration, perform the following steps:

1. Set `log_error_services` back to its default configuration to unload implicitly loaded log components.

   ```
   SET GLOBAL log_error_services = 'log_filter_internal,log_sink_internal';
   ```

2. Remove any component variable settings associated with the uninstalled components. For example, if component variables were set in an option file, remove the settings from the option file. If component variables were set using `SET PERSIST`, use `RESET PERSIST` to clear the settings.

3. Restart the server to uninstall the log components that were implicitly loaded.

4. Follow the steps in Explicit Error Log Configuration to reimplement your configuration.

##### Troubleshooting Configuration Issues

From MySQL 8.0.30, log components listed in the `log_error_services` value at startup are loaded implicitly early in the MySQL Server startup sequence. If the log component was loaded previously using `INSTALL COMPONENT`, the server attempts to load the component again later in the startup sequence, which produces the following warning:

```
Cannot load component from specified URN: 'file://component_component_name'
```

You can check for this warning in the error log or by querying the Performance Schema `error_log` table using the following query:

```
SELECT error_code, data
  FROM performance_schema.error_log
 WHERE data LIKE "%'file://component_%"
   AND error_code="MY-013129" AND data LIKE "%MY-003529%";
```

To prevent this warning, follow the instructions in Changing the Error Log Configuration Method to adjust your error log configuration. Either an implicit or explicit error log configuration should be used, but not both.

A similar error occurs when attempting to explicitly load a component that was implicitly loaded at startup. For example, if `log_error_services` lists the JSON log sink component, that component is implicitly loaded at startup. Attempting to explicitly load the same component later returns this error:

```
mysql> INSTALL COMPONENT 'file://component_log_sink_json';
ERROR 3529 (HY000): Cannot load component from specified URN: 'file://component_log_sink_json'.
```

##### Configuring Multiple Log Sinks

It is possible to configure multiple log sinks, which enables sending output to multiple destinations. To enable the JSON log sink in addition to (rather than instead of) the default sink, set the `log_error_services` value like this:

```
SET GLOBAL log_error_services = 'log_filter_internal; log_sink_internal; log_sink_json';
```

To revert to using only the default sink and unload the system log sink, execute these statements:

```
SET GLOBAL log_error_services = 'log_filter_internal; log_sink_internal;
UNINSTALL COMPONENT 'file://component_log_sink_json';
```

##### Log Sink Performance Schema Support

If enabled log components include a sink that provides Performance Schema support, events written to the error log are also written to the Performance Schema `error_log` table. This enables examining error log contents using SQL queries. Currently, the traditional-format `log_sink_internal` and JSON-format `log_sink_json` sinks support this capability. See Section 29.12.21.2, “The error_log Table”.
