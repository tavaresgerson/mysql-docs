#### 7.4.2.2 Default Error Log Destination Configuration

This section describes which server options configure the default error log destination, which can be the console or a named file. It also indicates which log sink components base their own output destination on the default destination.

In this discussion, “console” means `stderr`, the standard error output. This is your terminal or console window unless the standard error output has been redirected to a different destination.

The server interprets options that determine the default error log destination somewhat differently for Windows and Unix systems. Be sure to configure the destination using the information appropriate to your platform. After the server interprets the default error log destination options, it sets the  `log_error` system variable to indicate the default destination, which affects where several log sink components write error messages. The following sections address these topics.

*  Default Error Log Destination on Windows
*  Default Error Log Destination on Unix and Unix-Like Systems
*  How the Default Error Log Destination Affects Log Sinks

##### Default Error Log Destination on Windows

On Windows,  **mysqld** uses the `--log-error`, `--pid-file`, and `--console` options to determine whether the default error log destination is the console or a file, and, if a file, the file name:

* If  `--console` is given, the default destination is the console. ( `--console` takes precedence over  `--log-error` if both are given, and the following items regarding `--log-error` do not apply.)
* If  `--log-error` is not given, or is given without naming a file, the default destination is a file named `host_name.err` in the data directory, unless the `--pid-file` option is specified. In that case, the file name is the PID file base name with a suffix of `.err` in the data directory.
* If  `--log-error` is given to name a file, the default destination is that file (with an `.err` suffix added if the name has no suffix). The file location is under the data directory unless an absolute path name is given to specify a different location.

If the default error log destination is the console, the server sets the  `log_error` system variable to `stderr`. Otherwise, the default destination is a file and the server sets `log_error` to the file name.

##### Default Error Log Destination on Unix and Unix-Like Systems

On Unix and Unix-like systems,  **mysqld** uses the  `--log-error` option to determine whether the default error log destination is the console or a file, and, if a file, the file name:

* If  `--log-error` is not given, the default destination is the console.
* If  `--log-error` is given without naming a file, the default destination is a file named `host_name.err` in the data directory.
* If  `--log-error` is given to name a file, the default destination is that file (with an `.err` suffix added if the name has no suffix). The file location is under the data directory unless an absolute path name is given to specify a different location.
* If  `--log-error` is given in an option file in a `[mysqld]`, `[server]`, or `[mysqld_safe]` section, on systems that use  **mysqld\_safe** to start the server, **mysqld\_safe** finds and uses the option, and passes it to  **mysqld**.

::: info Note

It is common for Yum or APT package installations to configure an error log file location under `/var/log` with an option like `log-error=/var/log/mysqld.log` in a server configuration file. Removing the path name from the option causes the `host_name.err` file in the data directory to be used.

:::

If the default error log destination is the console, the server sets the  `log_error` system variable to `stderr`. Otherwise, the default destination is a file and the server sets `log_error` to the file name.

##### How the Default Error Log Destination Affects Log Sinks

After the server interprets the error log destination configuration options, it sets the `log_error` system variable to indicate the default error log destination. Log sink components may base their own output destination on the `log_error` value, or determine their destination independently of `log_error`

If  `log_error` is `stderr`, the default error log destination is the console, and log sinks that base their output destination on the default destination also write to the console:

* `log_sink_internal`, `log_sink_json`, `log_sink_test`: These sinks write to the console. This is true even for sinks such as `log_sink_json` that can be enabled multiple times; all instances write to the console.
* `log_sink_syseventlog`: This sink writes to the system log, regardless of the `log_error` value.

If  `log_error` is not `stderr`, the default error log destination is a file and  `log_error` indicates the file name. Log sinks that base their output destination on the default destination base output file naming on that file name. (A sink might use exactly that name, or it might use some variant thereof.) Suppose that the `log_error` value *`file_name`*. Then log sinks use the name like this:

* `log_sink_internal`, `log_sink_test`: These sinks write to *`file_name`*.
* `log_sink_json`: Successive instances of this sink named in the `log_error_services` value write to files named *`file_name`* plus a numbered `.NN.json` suffix: `file_name.00.json`, `file_name.01.json`, and so forth.
* `log_sink_syseventlog`: This sink writes to the system log, regardless of the `log_error` value.
