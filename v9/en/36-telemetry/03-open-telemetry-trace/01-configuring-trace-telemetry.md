### 35.3.1 Configuring Trace Telemetry

This section describes the configuration for server and client.

* Server Configuration
* Client Configuration
* Client Configuration Example

#### Server Configuration

The following are the server trace telemetry configuration variables:

* `telemetry.trace_enabled`

  <table frame="box" rules="all" summary="Properties for telemetry.trace_enabled"><tbody><tr><th>System Variable</th> <td><code><a class="link" href="telemetry-trace-configuration.html#sysvar_telemetry.trace_enabled">telemetry.trace_enabled</a></code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th><a class="link" href="optimizer-hints.html#optimizer-hints-set-var" title="Variable-Setting Hint Syntax"><code>SET_VAR</code></a> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>OFF</code></td> </tr></tbody></table>

  Controls whether telemetry traces are collected or not .

* `telemetry.query_text_enabled`

  <table frame="box" rules="all" summary="Properties for telemetry.query_text_enabled"><tbody><tr><th>System Variable</th> <td><code><a class="link" href="telemetry-trace-configuration.html#sysvar_telemetry.query_text_enabled">telemetry.query_text_enabled</a></code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th><a class="link" href="optimizer-hints.html#optimizer-hints-set-var" title="Variable-Setting Hint Syntax"><code>SET_VAR</code></a> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>ON</code></td> </tr></tbody></table>

  Controls whether the SQL query text is included in the trace

* `telemetry.otel_log_level`

  <table frame="box" rules="all" summary="Properties for telemetry.otel_log_level"><tbody><tr><th>System Variable</th> <td><code><a class="link" href="telemetry-trace-configuration.html#sysvar_telemetry.otel_log_level">telemetry.otel_log_level</a></code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th><a class="link" href="optimizer-hints.html#optimizer-hints-set-var" title="Variable-Setting Hint Syntax"><code>SET_VAR</code></a> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>Enumeration</td> </tr><tr><th>Default Value</th> <td><code>ERROR</code></td> </tr><tr><th>Valid Values</th> <td><p class="valid-value"><code>SILENT</code></p><p class="valid-value"><code>INFO</code></p><p class="valid-value"><code>ERROR</code></p><p class="valid-value"><code>WARNING</code></p><p class="valid-value"><code>DEBUG</code></p></td> </tr></tbody></table>

  Controls which OpenTelemetry logs are printed in the server logs

* `telemetry.otel_resource_attributes`

  <table frame="box" rules="all" summary="Properties for telemetry.otel_resource_attributes"><tbody><tr><th>System Variable</th> <td><code><a class="link" href="telemetry-trace-configuration.html#sysvar_telemetry.otel_resource_attributes">telemetry.otel_resource_attributes</a></code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th><a class="link" href="optimizer-hints.html#optimizer-hints-set-var" title="Variable-Setting Hint Syntax"><code>SET_VAR</code></a> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>empty</code></td> </tr></tbody></table>

  See corresponding OpenTelemetry variable OTEL\_RESOURCE\_ATTRIBUTES.

* `telemetry.otel_exporter_otlp_traces_protocol`

  <table frame="box" rules="all" summary="Properties for telemetry.otel_exporter_otlp_traces_protocol"><tbody><tr><th>System Variable</th> <td><code><a class="link" href="telemetry-trace-configuration.html#sysvar_telemetry.otel_exporter_otlp_traces_protocol">telemetry.otel_exporter_otlp_traces_protocol</a></code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th><a class="link" href="optimizer-hints.html#optimizer-hints-set-var" title="Variable-Setting Hint Syntax"><code>SET_VAR</code></a> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>Enumeration</td> </tr><tr><th>Default Value</th> <td><code>http/protobuf</code></td> </tr><tr><th>Valid Values</th> <td><p class="valid-value"><code>http/protobuf</code></p><p class="valid-value"><code>http/json</code></p></td> </tr></tbody></table>

  OTLP transport protocol

* `telemetry.otel_exporter_otlp_traces_endpoint`

  <table frame="box" rules="all" summary="Properties for telemetry.otel_exporter_otlp_traces_endpoint"><tbody><tr><th>System Variable</th> <td><code><a class="link" href="telemetry-trace-configuration.html#sysvar_telemetry.otel_exporter_otlp_traces_endpoint">telemetry.otel_exporter_otlp_traces_endpoint</a></code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th><a class="link" href="optimizer-hints.html#optimizer-hints-set-var" title="Variable-Setting Hint Syntax"><code>SET_VAR</code></a> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code></code></td> </tr></tbody></table>

  Target URL to which the exporter sends traces

* `telemetry.otel_exporter_otlp_traces_network_namespace`

  <table frame="box" rules="all" summary="Properties for telemetry.otel_exporter_otlp_traces_network_namespace"><tbody><tr><th>System Variable</th> <td><code><a class="link" href="telemetry-trace-configuration.html#sysvar_telemetry.otel_exporter_otlp_traces_network_namespace">telemetry.otel_exporter_otlp_traces_network_namespace</a></code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th><a class="link" href="optimizer-hints.html#optimizer-hints-set-var" title="Variable-Setting Hint Syntax"><code>SET_VAR</code></a> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>[none]</code></td> </tr></tbody></table>

  (Linux only) Network namespace to use when sending data to the traces endpoint.

* `telemetry.otel_exporter_otlp_traces_certificates`

  <table frame="box" rules="all" summary="Properties for telemetry.otel_exporter_otlp_traces_certificates"><tbody><tr><th>System Variable</th> <td><code><a class="link" href="telemetry-trace-configuration.html#sysvar_telemetry.otel_exporter_otlp_traces_certificates">telemetry.otel_exporter_otlp_traces_certificates</a></code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th><a class="link" href="optimizer-hints.html#optimizer-hints-set-var" title="Variable-Setting Hint Syntax"><code>SET_VAR</code></a> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code></code></td> </tr></tbody></table>

  The trusted certificate to use when verifying a server's TLS credentials.

* `telemetry.otel_exporter_otlp_traces_client_key`

  <table frame="box" rules="all" summary="Properties for telemetry.otel_exporter_otlp_traces_client_key"><tbody><tr><th>System Variable</th> <td><code><a class="link" href="telemetry-trace-configuration.html#sysvar_telemetry.otel_exporter_otlp_traces_client_key">telemetry.otel_exporter_otlp_traces_client_key</a></code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th><a class="link" href="optimizer-hints.html#optimizer-hints-set-var" title="Variable-Setting Hint Syntax"><code>SET_VAR</code></a> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code></code></td> </tr></tbody></table>

  Client's private key in PEM format.

* `telemetry.otel_exporter_otlp_traces_client_certificates`

  <table frame="box" rules="all" summary="Properties for telemetry.otel_exporter_otlp_traces_client_certificates"><tbody><tr><th>System Variable</th> <td><code><a class="link" href="telemetry-trace-configuration.html#sysvar_telemetry.otel_exporter_otlp_traces_client_certificates">telemetry.otel_exporter_otlp_traces_client_certificates</a></code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th><a class="link" href="optimizer-hints.html#optimizer-hints-set-var" title="Variable-Setting Hint Syntax"><code>SET_VAR</code></a> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code></code></td> </tr></tbody></table>

  Client certificate/chain trust for clients private key in PEM format.

* `telemetry.otel_exporter_otlp_traces_headers`

  <table frame="box" rules="all" summary="Properties for telemetry.query_text_enabled"><tbody><tr><th>System Variable</th> <td><code><a class="link" href="telemetry-trace-configuration.html#sysvar_telemetry.query_text_enabled">telemetry.query_text_enabled</a></code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th><a class="link" href="optimizer-hints.html#optimizer-hints-set-var" title="Variable-Setting Hint Syntax"><code>SET_VAR</code></a> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>ON</code></td> </tr></tbody></table>

  See corresponding OpenTelemetry variable OTEL\_EXPORTER\_TRACES\_HEADERS.

* `telemetry.otel_exporter_otlp_traces_secret_headers`

  <table frame="box" rules="all" summary="Properties for telemetry.query_text_enabled"><tbody><tr><th>System Variable</th> <td><code><a class="link" href="telemetry-trace-configuration.html#sysvar_telemetry.query_text_enabled">telemetry.query_text_enabled</a></code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th><a class="link" href="optimizer-hints.html#optimizer-hints-set-var" title="Variable-Setting Hint Syntax"><code>SET_VAR</code></a> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>ON</code></td> </tr></tbody></table>

  Name of a secret, that contains the sensitive data for trace headers. The data content and format depends on the secret provider implementation provided with system variable `telemetry.secret_provider`.

* `telemetry.otel_exporter_otlp_traces_compression`

  <table frame="box" rules="all" summary="Properties for telemetry.query_text_enabled"><tbody><tr><th>System Variable</th> <td><code><a class="link" href="telemetry-trace-configuration.html#sysvar_telemetry.query_text_enabled">telemetry.query_text_enabled</a></code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th><a class="link" href="optimizer-hints.html#optimizer-hints-set-var" title="Variable-Setting Hint Syntax"><code>SET_VAR</code></a> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>ON</code></td> </tr></tbody></table>

  Compression used by exporter

* `telemetry.otel_exporter_otlp_traces_timeout`

  <table frame="box" rules="all" summary="Properties for telemetry.query_text_enabled"><tbody><tr><th>System Variable</th> <td><code><a class="link" href="telemetry-trace-configuration.html#sysvar_telemetry.query_text_enabled">telemetry.query_text_enabled</a></code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th><a class="link" href="optimizer-hints.html#optimizer-hints-set-var" title="Variable-Setting Hint Syntax"><code>SET_VAR</code></a> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>ON</code></td> </tr></tbody></table>

  Time in milliseconds the OLTP exporter waits for each batch export.

* `telemetry.otel_bsp_schedule_delay`

  <table frame="box" rules="all" summary="Properties for telemetry.query_text_enabled"><tbody><tr><th>System Variable</th> <td><code><a class="link" href="telemetry-trace-configuration.html#sysvar_telemetry.query_text_enabled">telemetry.query_text_enabled</a></code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th><a class="link" href="optimizer-hints.html#optimizer-hints-set-var" title="Variable-Setting Hint Syntax"><code>SET_VAR</code></a> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>ON</code></td> </tr></tbody></table>

  Delay interval between two consecutive exports in milliseconds

* `telemetry.otel_bsp_max_queue_size`

  <table frame="box" rules="all" summary="Properties for telemetry.query_text_enabled"><tbody><tr><th>System Variable</th> <td><code><a class="link" href="telemetry-trace-configuration.html#sysvar_telemetry.query_text_enabled">telemetry.query_text_enabled</a></code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th><a class="link" href="optimizer-hints.html#optimizer-hints-set-var" title="Variable-Setting Hint Syntax"><code>SET_VAR</code></a> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>ON</code></td> </tr></tbody></table>

  Maximum queue size

* `telemetry.otel_bsp_max_export_batch_size`

  <table frame="box" rules="all" summary="Properties for telemetry.query_text_enabled"><tbody><tr><th>System Variable</th> <td><code><a class="link" href="telemetry-trace-configuration.html#sysvar_telemetry.query_text_enabled">telemetry.query_text_enabled</a></code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th><a class="link" href="optimizer-hints.html#optimizer-hints-set-var" title="Variable-Setting Hint Syntax"><code>SET_VAR</code></a> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>ON</code></td> </tr></tbody></table>

  Maximum batch size

* `telemetry.otel_exporter_otlp_traces_min_tls`

  <table frame="box" rules="all" summary="Properties for telemetry.query_text_enabled"><tbody><tr><th>System Variable</th> <td><code><a class="link" href="telemetry-trace-configuration.html#sysvar_telemetry.query_text_enabled">telemetry.query_text_enabled</a></code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th><a class="link" href="optimizer-hints.html#optimizer-hints-set-var" title="Variable-Setting Hint Syntax"><code>SET_VAR</code></a> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>ON</code></td> </tr></tbody></table>

* `telemetry.otel_exporter_otlp_traces_max_tls`

  <table frame="box" rules="all" summary="Properties for telemetry.query_text_enabled"><tbody><tr><th>System Variable</th> <td><code><a class="link" href="telemetry-trace-configuration.html#sysvar_telemetry.query_text_enabled">telemetry.query_text_enabled</a></code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th><a class="link" href="optimizer-hints.html#optimizer-hints-set-var" title="Variable-Setting Hint Syntax"><code>SET_VAR</code></a> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>ON</code></td> </tr></tbody></table>

* `telemetry.otel_exporter_otlp_traces_cipher`

  <table frame="box" rules="all" summary="Properties for telemetry.query_text_enabled"><tbody><tr><th>System Variable</th> <td><code><a class="link" href="telemetry-trace-configuration.html#sysvar_telemetry.query_text_enabled">telemetry.query_text_enabled</a></code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th><a class="link" href="optimizer-hints.html#optimizer-hints-set-var" title="Variable-Setting Hint Syntax"><code>SET_VAR</code></a> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>ON</code></td> </tr></tbody></table>

  Current list of TLS 1.2 ciphers to use for traces. The current default is:

  ```
  ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-ECDSA-AES256-GCM-SHA384:
  ECDHE-RSA-AES128-GCM-SHA256:ECDHE-RSA-AES256-GCM-SHA384:ECDHE-ECDSA-CHACHA20-POLY1305:
  ECDHE-RSA-CHACHA20-POLY1305:ECDHE-ECDSA-AES256-CCM:ECDHE-ECDSA-AES128-CCM:
  DHE-RSA-AES128-GCM-SHA256:DHE-RSA-AES256-GCM-SHA384:DHE-RSA-AES256-CCM:
  DHE-RSA-AES128-CCM:DHE-RSA-CHACHA20-POLY1305
  ```

* `telemetry.otel_exporter_otlp_traces_cipher_suite`

  <table frame="box" rules="all" summary="Properties for telemetry.otel_log_level"><tbody><tr><th>System Variable</th> <td><code><a class="link" href="telemetry-trace-configuration.html#sysvar_telemetry.otel_log_level">telemetry.otel_log_level</a></code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th><a class="link" href="optimizer-hints.html#optimizer-hints-set-var" title="Variable-Setting Hint Syntax"><code>SET_VAR</code></a> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>Enumeration</td> </tr><tr><th>Default Value</th> <td><code>ERROR</code></td> </tr><tr><th>Valid Values</th> <td><p class="valid-value"><code>SILENT</code></p><p class="valid-value"><code>INFO</code></p><p class="valid-value"><code>ERROR</code></p><p class="valid-value"><code>WARNING</code></p><p class="valid-value"><code>DEBUG</code></p></td> </tr></tbody></table>

  Current list of TLS 1.3 ciphers to use for traces. The current default is:

  ```
   TLS_AES_128_GCM_SHA256:TLS_AES_256_GCM_SHA384:TLS_CHACHA20_POLY1305_SHA256:TLS_AES_128_CCM_SHA256
  ```

#### Client Configuration

The MySQL client reads telemetry configuration from the `[telemetry_client]` section of the configuration file. See Installing Client Plugin for information on the `telemetry_client` option. The following configuration options are available:

**Table 35.2 mysql client Telemetry Option Summary**

<table frame="box" rules="all" summary="Properties for telemetry.otel_log_level"><tbody><tr><th>System Variable</th> <td><code><a class="link" href="telemetry-trace-configuration.html#sysvar_telemetry.otel_log_level">telemetry.otel_log_level</a></code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th><a class="link" href="optimizer-hints.html#optimizer-hints-set-var" title="Variable-Setting Hint Syntax"><code>SET_VAR</code></a> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>Enumeration</td> </tr><tr><th>Default Value</th> <td><code>ERROR</code></td> </tr><tr><th>Valid Values</th> <td><p class="valid-value"><code>SILENT</code></p><p class="valid-value"><code>INFO</code></p><p class="valid-value"><code>ERROR</code></p><p class="valid-value"><code>WARNING</code></p><p class="valid-value"><code>DEBUG</code></p></td> </tr></tbody></table>

* `trace`

  <table frame="box" rules="all" summary="Properties for telemetry.otel_log_level"><tbody><tr><th>System Variable</th> <td><code><a class="link" href="telemetry-trace-configuration.html#sysvar_telemetry.otel_log_level">telemetry.otel_log_level</a></code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th><a class="link" href="optimizer-hints.html#optimizer-hints-set-var" title="Variable-Setting Hint Syntax"><code>SET_VAR</code></a> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>Enumeration</td> </tr><tr><th>Default Value</th> <td><code>ERROR</code></td> </tr><tr><th>Valid Values</th> <td><p class="valid-value"><code>SILENT</code></p><p class="valid-value"><code>INFO</code></p><p class="valid-value"><code>ERROR</code></p><p class="valid-value"><code>WARNING</code></p><p class="valid-value"><code>DEBUG</code></p></td> </tr></tbody></table>

  Controls whether telemetry traces are collected or not .

* `help`

  <table frame="box" rules="all" summary="Properties for telemetry.otel_log_level"><tbody><tr><th>System Variable</th> <td><code><a class="link" href="telemetry-trace-configuration.html#sysvar_telemetry.otel_log_level">telemetry.otel_log_level</a></code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th><a class="link" href="optimizer-hints.html#optimizer-hints-set-var" title="Variable-Setting Hint Syntax"><code>SET_VAR</code></a> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>Enumeration</td> </tr><tr><th>Default Value</th> <td><code>ERROR</code></td> </tr><tr><th>Valid Values</th> <td><p class="valid-value"><code>SILENT</code></p><p class="valid-value"><code>INFO</code></p><p class="valid-value"><code>ERROR</code></p><p class="valid-value"><code>WARNING</code></p><p class="valid-value"><code>DEBUG</code></p></td> </tr></tbody></table>

  When enabled, prints help about telemetry\_client options .

* `otel_log_level`

  <table frame="box" rules="all" summary="Properties for telemetry.otel_log_level"><tbody><tr><th>System Variable</th> <td><code><a class="link" href="telemetry-trace-configuration.html#sysvar_telemetry.otel_log_level">telemetry.otel_log_level</a></code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th><a class="link" href="optimizer-hints.html#optimizer-hints-set-var" title="Variable-Setting Hint Syntax"><code>SET_VAR</code></a> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>Enumeration</td> </tr><tr><th>Default Value</th> <td><code>ERROR</code></td> </tr><tr><th>Valid Values</th> <td><p class="valid-value"><code>SILENT</code></p><p class="valid-value"><code>INFO</code></p><p class="valid-value"><code>ERROR</code></p><p class="valid-value"><code>WARNING</code></p><p class="valid-value"><code>DEBUG</code></p></td> </tr></tbody></table>

  Controls which OpenTelemetry logs are printed in the server logs

* `otel_resource_attributes`

  <table frame="box" rules="all" summary="Properties for telemetry.otel_log_level"><tbody><tr><th>System Variable</th> <td><code><a class="link" href="telemetry-trace-configuration.html#sysvar_telemetry.otel_log_level">telemetry.otel_log_level</a></code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th><a class="link" href="optimizer-hints.html#optimizer-hints-set-var" title="Variable-Setting Hint Syntax"><code>SET_VAR</code></a> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>Enumeration</td> </tr><tr><th>Default Value</th> <td><code>ERROR</code></td> </tr><tr><th>Valid Values</th> <td><p class="valid-value"><code>SILENT</code></p><p class="valid-value"><code>INFO</code></p><p class="valid-value"><code>ERROR</code></p><p class="valid-value"><code>WARNING</code></p><p class="valid-value"><code>DEBUG</code></p></td> </tr></tbody></table>

  See corresponding OpenTelemetry variable OTEL\_RESOURCE\_ATTRIBUTES.

* `otel_exporter_otlp_traces_protocol`

  <table frame="box" rules="all" summary="Properties for telemetry.otel_log_level"><tbody><tr><th>System Variable</th> <td><code><a class="link" href="telemetry-trace-configuration.html#sysvar_telemetry.otel_log_level">telemetry.otel_log_level</a></code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th><a class="link" href="optimizer-hints.html#optimizer-hints-set-var" title="Variable-Setting Hint Syntax"><code>SET_VAR</code></a> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>Enumeration</td> </tr><tr><th>Default Value</th> <td><code>ERROR</code></td> </tr><tr><th>Valid Values</th> <td><p class="valid-value"><code>SILENT</code></p><p class="valid-value"><code>INFO</code></p><p class="valid-value"><code>ERROR</code></p><p class="valid-value"><code>WARNING</code></p><p class="valid-value"><code>DEBUG</code></p></td> </tr></tbody></table>

  OTLP transport protocol

* `otel_exporter_otlp_traces_endpoint`

  <table frame="box" rules="all" summary="Properties for telemetry.otel_log_level"><tbody><tr><th>System Variable</th> <td><code><a class="link" href="telemetry-trace-configuration.html#sysvar_telemetry.otel_log_level">telemetry.otel_log_level</a></code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th><a class="link" href="optimizer-hints.html#optimizer-hints-set-var" title="Variable-Setting Hint Syntax"><code>SET_VAR</code></a> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>Enumeration</td> </tr><tr><th>Default Value</th> <td><code>ERROR</code></td> </tr><tr><th>Valid Values</th> <td><p class="valid-value"><code>SILENT</code></p><p class="valid-value"><code>INFO</code></p><p class="valid-value"><code>ERROR</code></p><p class="valid-value"><code>WARNING</code></p><p class="valid-value"><code>DEBUG</code></p></td> </tr></tbody></table>

  Target URL to which the exporter sends traces

* `otel_exporter_otlp_traces_certificates`

  <table frame="box" rules="all" summary="Properties for telemetry.otel_log_level"><tbody><tr><th>System Variable</th> <td><code><a class="link" href="telemetry-trace-configuration.html#sysvar_telemetry.otel_log_level">telemetry.otel_log_level</a></code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th><a class="link" href="optimizer-hints.html#optimizer-hints-set-var" title="Variable-Setting Hint Syntax"><code>SET_VAR</code></a> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>Enumeration</td> </tr><tr><th>Default Value</th> <td><code>ERROR</code></td> </tr><tr><th>Valid Values</th> <td><p class="valid-value"><code>SILENT</code></p><p class="valid-value"><code>INFO</code></p><p class="valid-value"><code>ERROR</code></p><p class="valid-value"><code>WARNING</code></p><p class="valid-value"><code>DEBUG</code></p></td> </tr></tbody></table>

  The trusted certificate to use when verifying a server's TLS credentials.

* `otel_exporter_otlp_traces_client_key`

  <table frame="box" rules="all" summary="Properties for telemetry.otel_log_level"><tbody><tr><th>System Variable</th> <td><code><a class="link" href="telemetry-trace-configuration.html#sysvar_telemetry.otel_log_level">telemetry.otel_log_level</a></code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th><a class="link" href="optimizer-hints.html#optimizer-hints-set-var" title="Variable-Setting Hint Syntax"><code>SET_VAR</code></a> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>Enumeration</td> </tr><tr><th>Default Value</th> <td><code>ERROR</code></td> </tr><tr><th>Valid Values</th> <td><p class="valid-value"><code>SILENT</code></p><p class="valid-value"><code>INFO</code></p><p class="valid-value"><code>ERROR</code></p><p class="valid-value"><code>WARNING</code></p><p class="valid-value"><code>DEBUG</code></p></td> </tr></tbody></table>

  Client's private key in PEM format.

* `otel_exporter_otlp_traces_client_certificates`

  <table frame="box" rules="all" summary="Properties for telemetry.otel_resource_attributes"><tbody><tr><th>System Variable</th> <td><code><a class="link" href="telemetry-trace-configuration.html#sysvar_telemetry.otel_resource_attributes">telemetry.otel_resource_attributes</a></code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th><a class="link" href="optimizer-hints.html#optimizer-hints-set-var" title="Variable-Setting Hint Syntax"><code>SET_VAR</code></a> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>empty</code></td> </tr></tbody></table>

  Client certificate/chain trust for clients private key in PEM format.

* `otel_exporter_otlp_traces_headers`

  <table frame="box" rules="all" summary="Properties for telemetry.otel_resource_attributes"><tbody><tr><th>System Variable</th> <td><code><a class="link" href="telemetry-trace-configuration.html#sysvar_telemetry.otel_resource_attributes">telemetry.otel_resource_attributes</a></code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th><a class="link" href="optimizer-hints.html#optimizer-hints-set-var" title="Variable-Setting Hint Syntax"><code>SET_VAR</code></a> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>empty</code></td> </tr></tbody></table>

  See corresponding OpenTelemetry variable OTEL\_EXPORTER\_TRACES\_HEADERS.

* `otel_exporter_otlp_traces_compression`

  <table frame="box" rules="all" summary="Properties for telemetry.otel_resource_attributes"><tbody><tr><th>System Variable</th> <td><code><a class="link" href="telemetry-trace-configuration.html#sysvar_telemetry.otel_resource_attributes">telemetry.otel_resource_attributes</a></code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th><a class="link" href="optimizer-hints.html#optimizer-hints-set-var" title="Variable-Setting Hint Syntax"><code>SET_VAR</code></a> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>empty</code></td> </tr></tbody></table>

  Compression used by exporter

* `otel_exporter_otlp_traces_timeout`

  <table frame="box" rules="all" summary="Properties for telemetry.otel_resource_attributes"><tbody><tr><th>System Variable</th> <td><code><a class="link" href="telemetry-trace-configuration.html#sysvar_telemetry.otel_resource_attributes">telemetry.otel_resource_attributes</a></code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th><a class="link" href="optimizer-hints.html#optimizer-hints-set-var" title="Variable-Setting Hint Syntax"><code>SET_VAR</code></a> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>empty</code></td> </tr></tbody></table>

  Time OLTP exporter waits for each batch export

* `otel_bsp_schedule_delay`

  <table frame="box" rules="all" summary="Properties for telemetry.otel_resource_attributes"><tbody><tr><th>System Variable</th> <td><code><a class="link" href="telemetry-trace-configuration.html#sysvar_telemetry.otel_resource_attributes">telemetry.otel_resource_attributes</a></code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th><a class="link" href="optimizer-hints.html#optimizer-hints-set-var" title="Variable-Setting Hint Syntax"><code>SET_VAR</code></a> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>empty</code></td> </tr></tbody></table>

  Delay interval between two consecutive exports in milliseconds

* `otel_bsp_max_queue_size`

  <table frame="box" rules="all" summary="Properties for telemetry.otel_resource_attributes"><tbody><tr><th>System Variable</th> <td><code><a class="link" href="telemetry-trace-configuration.html#sysvar_telemetry.otel_resource_attributes">telemetry.otel_resource_attributes</a></code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th><a class="link" href="optimizer-hints.html#optimizer-hints-set-var" title="Variable-Setting Hint Syntax"><code>SET_VAR</code></a> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>empty</code></td> </tr></tbody></table>

  Maximum queue size

* `otel_bsp_max_export_batch_size`

  <table frame="box" rules="all" summary="Properties for telemetry.otel_resource_attributes"><tbody><tr><th>System Variable</th> <td><code><a class="link" href="telemetry-trace-configuration.html#sysvar_telemetry.otel_resource_attributes">telemetry.otel_resource_attributes</a></code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th><a class="link" href="optimizer-hints.html#optimizer-hints-set-var" title="Variable-Setting Hint Syntax"><code>SET_VAR</code></a> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>empty</code></td> </tr></tbody></table>

  Maximum batch size

#### Client Configuration Example

The following is an example of a `my.cnf` configuration file containing the Client Telemetry plugin configuration:

```
[mysql]

telemetry-client = ON

[telemetry_client]
help = ON
trace = OFF
otel-resource-attributes = "RK1=RV1, RK2=RV2, RK3=RV3"
otel-log-level = "error"
otel-exporter-otlp-traces-headers = "K1=V1, K2=V2"
otel-exporter-otlp-traces-protocol = "http/json"
```

If `telemetry-client = ON` is set in the configuration file, you do not need to specify `--telemetry-client` when starting the client.
