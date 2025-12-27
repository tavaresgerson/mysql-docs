### 7.5.3 Error Log Components

This section describes the characteristics of individual error log components. For general information about configuring error logging, see Section 7.4.2, “The Error Log”.

A log component can be a filter or a sink:

* A filter processes log events, to add, remove, or modify event fields, or to delete events entirely. The resulting events pass to the next log component in the list of enabled components.

* A sink is a destination (writer) for log events. Typically, a sink processes log events into log messages that have a particular format and writes these messages to its associated output, such as a file or the system log. A sink may also write to the Performance Schema `error_log` table; see Section 29.12.22.3, “The error\_log Table”. Events pass unmodified to the next log component in the list of enabled components (that is, although a sink formats events to produce output messages, it does not modify events as they pass internally to the next component).

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

##### The log\_filter\_internal Component

* Purpose: Implements filtering based on log event priority and error code, in combination with the `log_error_verbosity` and `log_error_suppression_list` system variables. See Section 7.4.2.5, “Priority-Based Error Log Filtering (log\_filter\_internal)”").

* URN: This component is built in and need not be loaded.
* Multiple uses permitted: No.

If `log_filter_internal` is disabled, `log_error_verbosity` and `log_error_suppression_list` have no effect.

##### The log\_filter\_dragnet Component

* Purpose: Implements filtering based on the rules defined by the `dragnet.log_error_filter_rules` system variable setting. See Section 7.4.2.6, “Rule-Based Error Log Filtering (log\_filter\_dragnet)”").

* URN: `file://component_log_filter_dragnet`
* Multiple uses permitted: No.

#### Sink Error Log Components

Error log sink components are writers that implement error log output. If no sink component is enabled, no log output occurs.

Some sink component descriptions refer to the default error log destination. This is the console or a file and is indicated by the value of the `log_error` system variable, determined as described in Section 7.4.2.2, “Default Error Log Destination Configuration”.

##### The log\_sink\_internal Component

* Purpose: Implements traditional error log message output format.

* URN: This component is built in and need not be loaded.
* Multiple uses permitted: No.
* Output destination: Writes to the default error log destination.

* Performance Schema support: Writes to the `error_log` table. Provides a parser for reading error log files created by previous server instances.

##### The log\_sink\_json Component

* Purpose: Implements JSON-format error logging. See Section 7.4.2.7, “Error Logging in JSON Format”.

* URN: `file://component_log_sink_json`
* Multiple uses permitted: Yes.
* Output destination: This sink determines its output destination based on the default error log destination, which is given by the `log_error` system variable:

  + If `log_error` names a file, the sink bases output file naming on that file name, plus a numbered `.NN.json` suffix, with *`NN`* starting at

    00. For example, if `log_error` is *`file_name`*, successive instances of `log_sink_json` named in the `log_error_services` value write to `file_name.00.json`, `file_name.01.json`, and so forth.

  + If `log_error` is `stderr`, the sink writes to the console. If `log_sink_json` is named multiple times in the `log_error_services` value, they all write to the console, which is likely not useful.

* Performance Schema support: Writes to the `error_log` table. Provides a parser for reading error log files created by previous server instances.

##### The log\_sink\_syseventlog Component

* Purpose: Implements error logging to the system log. This is the Event Log on Windows, and `syslog` on Unix and Unix-like systems. See Section 7.4.2.8, “Error Logging to the System Log”.

* URN: `file://component_log_sink_syseventlog`

* Multiple uses permitted: No.
* Output destination: Writes to the system log. Does not use the default error log destination.

* Performance Schema support: Does not write to the `error_log` table. Does not provide a parser for reading error log files created by previous server instances.

##### The log\_sink\_test Component

* Purpose: Intended for internal use in writing test cases, not for production use.

* URN: `file://component_log_sink_test`

Sink properties such as whether multiple uses are permitted and the output destination are not specified for `log_sink_test` because, as mentioned, it is for internal use. As such, its behavior is subject to change at any time.
