### 35.5.1 Configuring Log Telemetry

This section describes the configuration for server.

For information on the configured loggers, see Section 29.12.21.1, “The setup_loggers Table”.

* Server Configuration System Variables
* Server Configuration Status Variables
* Server Configuration Command Line

#### Server Configuration System Variables

The following are the server telemetry logging system variables:

* `telemetry.log_enabled`

  <table frame="box" rules="all" summary="Properties for telemetry.log_enabled"><tbody><tr><th>System Variable</th> <td><code>telemetry.log_enabled</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th><code>SET_VAR</code> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>OFF</code></td> </tr></tbody></table>

  Controls whether telemetry logs are exported or not.

* `telemetry.otel_exporter_otlp_logs_protocol`

  <table frame="box" rules="all" summary="Properties for telemetry.otel_exporter_otlp_logs_protocol"><tbody><tr><th>System Variable</th> <td><code>telemetry.otel_exporter_otlp_logs_protocol</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th><code>SET_VAR</code> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>Enumeration</td> </tr><tr><th>Default Value</th> <td><code>http/protobuf</code></td> </tr><tr><th>Valid Values</th> <td><p><code>http/protobuf</code></p><p><code>http/json</code></p></td> </tr></tbody></table>

  OTLP transport protocol

* `telemetry.otel_exporter_otlp_logs_endpoint`

  <table frame="box" rules="all" summary="Properties for telemetry.otel_exporter_otlp_logs_endpoint"><tbody><tr><th>System Variable</th> <td><code>telemetry.otel_exporter_otlp_logs_endpoint</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th><code>SET_VAR</code> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>empty</code></td> </tr></tbody></table>

  Target URL to which the exporter sends logs.

* `telemetry.otel_exporter_otlp_logs_network_namespace`

  <table frame="box" rules="all" summary="Properties for telemetry.otel_exporter_otlp_logs_network_namespace"><tbody><tr><th>System Variable</th> <td><code>telemetry.otel_exporter_otlp_logs_network_namespace</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th><code>SET_VAR</code> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>[none]</code></td> </tr></tbody></table>

  (Linux only) Network namespace to use when sending data to the logs endpoint.

* `telemetry.otel_exporter_otlp_logs_certificates`

  <table frame="box" rules="all" summary="Properties for telemetry.otel_exporter_otlp_logs_certificates"><tbody><tr><th>System Variable</th> <td><code>telemetry.otel_exporter_otlp_logs_certificates</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th><code>SET_VAR</code> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code></code></td> </tr></tbody></table>

  The trusted certificate to use when verifying a server's TLS credentials.

* `telemetry.otel_exporter_otlp_logs_client_key`

  <table frame="box" rules="all" summary="Properties for telemetry.otel_exporter_otlp_logs_client_key"><tbody><tr><th>System Variable</th> <td><code>telemetry.otel_exporter_otlp_logs_client_key</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th><code>SET_VAR</code> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code></code></td> </tr></tbody></table>

  Client's private key in PEM format.

* `telemetry.otel_exporter_otlp_logs_client_certificates`

  <table frame="box" rules="all" summary="Properties for telemetry.otel_exporter_otlp_logs_client_certificates"><tbody><tr><th>System Variable</th> <td><code>telemetry.otel_exporter_otlp_logs_client_certificates</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th><code>SET_VAR</code> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code></code></td> </tr></tbody></table>

  Client certificate/chain trust for client's private key in PEM format.

* `telemetry.otel_exporter_otlp_logs_headers`

  <table frame="box" rules="all" summary="Properties for telemetry.otel_exporter_otlp_logs_headers"><tbody><tr><th>System Variable</th> <td><code>telemetry.otel_exporter_otlp_logs_headers</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th><code>SET_VAR</code> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code></code></td> </tr></tbody></table>

  A list of headers to apply to all outgoing logs

* `telemetry.otel_exporter_otlp_logs_secret_headers`

  <table frame="box" rules="all" summary="Properties for telemetry.otel_exporter_otlp_logs_secret_headers"><tbody><tr><th>System Variable</th> <td><code>telemetry.otel_exporter_otlp_logs_secret_headers</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th><code>SET_VAR</code> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>[none]</code></td> </tr></tbody></table>

  Name of a secret, that contains the sensitive data for logs headers. The data content and format depends on the secret provider implementation provided with system variable `telemetry.secret_provider`.

* `telemetry.otel_exporter_otlp_logs_compression`

  <table frame="box" rules="all" summary="Properties for telemetry.otel_exporter_otlp_logs_compression"><tbody><tr><th>System Variable</th> <td><code>telemetry.otel_exporter_otlp_logs_compression</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th><code>SET_VAR</code> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>none (no compression)</code></td> </tr><tr><th>Valid Values</th> <td><p><code>none (no compression)</code></p><p><code>gzip</code></p></td> </tr></tbody></table>

  Compression used by log exporter.

* `telemetry.otel_exporter_otlp_logs_timeout`

  <table frame="box" rules="all" summary="Properties for telemetry.otel_exporter_otlp_logs_protocol"><tbody><tr><th>System Variable</th> <td><code>telemetry.otel_exporter_otlp_logs_protocol</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th><code>SET_VAR</code> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>Enumeration</td> </tr><tr><th>Default Value</th> <td><code>http/protobuf</code></td> </tr><tr><th>Valid Values</th> <td><p><code>http/protobuf</code></p><p><code>http/json</code></p></td> </tr></tbody></table>

  Time in milliseconds the OTLP exporter waits for each batch export.

* `telemetry.otel_blrp_schedule_delay`

  <table frame="box" rules="all" summary="Properties for telemetry.otel_exporter_otlp_logs_protocol"><tbody><tr><th>System Variable</th> <td><code>telemetry.otel_exporter_otlp_logs_protocol</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th><code>SET_VAR</code> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>Enumeration</td> </tr><tr><th>Default Value</th> <td><code>http/protobuf</code></td> </tr><tr><th>Valid Values</th> <td><p><code>http/protobuf</code></p><p><code>http/json</code></p></td> </tr></tbody></table>

  Delay interval between two consecutive exports in milliseconds.

* `telemetry.otel_blrp_max_queue_size`

  <table frame="box" rules="all" summary="Properties for telemetry.otel_exporter_otlp_logs_protocol"><tbody><tr><th>System Variable</th> <td><code>telemetry.otel_exporter_otlp_logs_protocol</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th><code>SET_VAR</code> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>Enumeration</td> </tr><tr><th>Default Value</th> <td><code>http/protobuf</code></td> </tr><tr><th>Valid Values</th> <td><p><code>http/protobuf</code></p><p><code>http/json</code></p></td> </tr></tbody></table>

  Maximum queue size.

* `telemetry.otel_blrp_max_export_batch_size`

  <table frame="box" rules="all" summary="Properties for telemetry.otel_exporter_otlp_logs_protocol"><tbody><tr><th>System Variable</th> <td><code>telemetry.otel_exporter_otlp_logs_protocol</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th><code>SET_VAR</code> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>Enumeration</td> </tr><tr><th>Default Value</th> <td><code>http/protobuf</code></td> </tr><tr><th>Valid Values</th> <td><p><code>http/protobuf</code></p><p><code>http/json</code></p></td> </tr></tbody></table>

  Maximum batch size.

* `telemetry.otel_exporter_otlp_logs_min_tls`

  <table frame="box" rules="all" summary="Properties for telemetry.otel_exporter_otlp_logs_protocol"><tbody><tr><th>System Variable</th> <td><code>telemetry.otel_exporter_otlp_logs_protocol</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th><code>SET_VAR</code> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>Enumeration</td> </tr><tr><th>Default Value</th> <td><code>http/protobuf</code></td> </tr><tr><th>Valid Values</th> <td><p><code>http/protobuf</code></p><p><code>http/json</code></p></td> </tr></tbody></table>

  The minimum accepted TLS version. If left empty, TLS 1.2 is used.

* `telemetry.otel_exporter_otlp_logs_max_tls`

  <table frame="box" rules="all" summary="Properties for telemetry.otel_exporter_otlp_logs_protocol"><tbody><tr><th>System Variable</th> <td><code>telemetry.otel_exporter_otlp_logs_protocol</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th><code>SET_VAR</code> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>Enumeration</td> </tr><tr><th>Default Value</th> <td><code>http/protobuf</code></td> </tr><tr><th>Valid Values</th> <td><p><code>http/protobuf</code></p><p><code>http/json</code></p></td> </tr></tbody></table>

  The maximum accepted TLS version. If left empty, there is no maximum TLS version.

* `telemetry.otel_exporter_otlp_logs_cipher`

  <table frame="box" rules="all" summary="Properties for telemetry.otel_exporter_otlp_logs_protocol"><tbody><tr><th>System Variable</th> <td><code>telemetry.otel_exporter_otlp_logs_protocol</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th><code>SET_VAR</code> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>Enumeration</td> </tr><tr><th>Default Value</th> <td><code>http/protobuf</code></td> </tr><tr><th>Valid Values</th> <td><p><code>http/protobuf</code></p><p><code>http/json</code></p></td> </tr></tbody></table>

  Current list of TLS 1.2 ciphers to use for logs. The current default is:

  ```
  ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-ECDSA-AES256-GCM-SHA384:
  ECDHE-RSA-AES128-GCM-SHA256:ECDHE-RSA-AES256-GCM-SHA384:ECDHE-ECDSA-CHACHA20-POLY1305:
  ECDHE-RSA-CHACHA20-POLY1305:ECDHE-ECDSA-AES256-CCM:ECDHE-ECDSA-AES128-CCM:
  DHE-RSA-AES128-GCM-SHA256:DHE-RSA-AES256-GCM-SHA384:DHE-RSA-AES256-CCM:
  DHE-RSA-AES128-CCM:DHE-RSA-CHACHA20-POLY1305
  ```

* `telemetry.otel_exporter_otlp_logs_cipher_suite`

  <table frame="box" rules="all" summary="Properties for telemetry.otel_exporter_otlp_logs_protocol"><tbody><tr><th>System Variable</th> <td><code>telemetry.otel_exporter_otlp_logs_protocol</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th><code>SET_VAR</code> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>Enumeration</td> </tr><tr><th>Default Value</th> <td><code>http/protobuf</code></td> </tr><tr><th>Valid Values</th> <td><p><code>http/protobuf</code></p><p><code>http/json</code></p></td> </tr></tbody></table>

  Current list of TLS 1.3 ciphers to use for logs. The current default is:

  ```
   TLS_AES_128_GCM_SHA256:TLS_AES_256_GCM_SHA384:TLS_CHACHA20_POLY1305_SHA256:TLS_AES_128_CCM_SHA256
  ```

#### Server Configuration Status Variables

This section describes the logger-related status variables.

* `Telemetry_logs_supported`: displays whether the server was compiled with Telemetry logging support.

* `Performance_schema_logger_lost`: Displays the number of logger instruments which failed to be created.

#### Server Configuration Command Line

This section describes the logger-related command line configuration options.

* `performance-schema-logger`: defines the default values for loggers. This can be defined multiple times, similarly to `--performance-schema-instrument`.

  In the following example, all loggers are configured with the error level `ERROR`, except `foo` and `bar` which are configured to error level `INFO` and `WARNING`, respectively:

  ```
                --performance-schema-logger = 'logger/% = Level:ERROR' --performance-schema-logger = 'logger/foo/% = Level:INFO'
                --performance-schema-logger = 'logger/bar/% = Level:WARNING'
  ```

  To see the configured loggers, run the following:

  ```
  select * from performance_schema.setup_loggers;
  +------------------------+-------+--------------------+
  | NAME                   | LEVEL | DESCRIPTION        |
  +------------------------+-------+--------------------+
  | logger/error/error_log | info  | MySQL error logger |
  +------------------------+-------+--------------------+
  ```

  This example shows the default MySQL error logger. This can be set to one of the following values:

  + `none`
  + `error`
  + `warn`
  + `info`
  + `debug`

  The following example changes the error logging level to WARNING:

  ```
  mysql> UPDATE performance_schema.setup_loggers
         SET LEVEL='WARN'
  ```

* `performance_schema_max_logger_classes`: this system variable can also be set from the command line. For example:

  ```
                --performance_schema_max_logger_classes=100
  ```

  Editing this value requires a server restart.
