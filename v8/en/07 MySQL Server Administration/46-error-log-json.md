#### 7.4.2.7 Error Logging in JSON Format

This section describes how to configure error logging using the built-in filter, `log_filter_internal`, and the JSON sink, `log_sink_json`, to take effect immediately and for subsequent server startups. For general information about configuring error logging, see Section 7.4.2.1, “Error Log Configuration”.

To enable the JSON sink, first load the sink component, then modify the  `log_error_services` value:

```
INSTALL COMPONENT 'file://component_log_sink_json';
SET PERSIST log_error_services = 'log_filter_internal; log_sink_json';
```

To set  `log_error_services` to take effect at server startup, use the instructions at Section 7.4.2.1, “Error Log Configuration”. Those instructions apply to other error-logging system variables as well.

It is permitted to name `log_sink_json` multiple times in the `log_error_services` value. For example, to write unfiltered events with one instance and filtered events with another instance, you could set `log_error_services` like this:

```
SET PERSIST log_error_services = 'log_sink_json; log_filter_internal; log_sink_json';
```

The JSON sink determines its output destination based on the default error log destination, which is given by the `log_error` system variable. If `log_error` names a file, the JSON sink bases output file naming on that file name, plus a numbered `.NN.json` suffix, with *`NN`* starting at 00. For example, if  `log_error` is *`file_name`*, successive instances of `log_sink_json` named in the `log_error_services` value write to `file_name.00.json`, `file_name.01.json`, and so forth.

If  `log_error` is `stderr`, the JSON sink writes to the console. If `log_sink_json` is named multiple times in the  `log_error_services` value, they all write to the console, which is likely not useful.
