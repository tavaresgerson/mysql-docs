## 35.3 OpenTelemetry Trace

Tracing telemetry enables you to visualize the flow of any processing action as it is processed through your server. The data for each action, a span, includes possible error information and timing data. Traces are generated for `COM_QUERY` commands executed, including non-query commands such as `COM_PING`, or `COM_STMT_CLOSE`. Query statement traces also have an associated SQL text attribute.

Telemetry tracing is implemented in:

* MySQL Enterprise Edition Telemetry Component
* MySQL Enterprise Edition Client
* MySQL Connectors


### 35.3.1 Configuring Trace Telemetry

This section describes the configuration for server and client.

* Server Configuration
* Client Configuration
* Client Configuration Example

#### Server Configuration

The following are the server trace telemetry configuration variables:

* `telemetry.trace_enabled`

  <table frame="box" rules="all" summary="Properties for telemetry.trace_enabled"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>System Variable</th> <td><code class="literal"><a class="link" href="telemetry-trace-configuration.html#sysvar_telemetry.trace_enabled">telemetry.trace_enabled</a></code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th><a class="link" href="optimizer-hints.html#optimizer-hints-set-var" title="Variable-Setting Hint Syntax"><code class="literal">SET_VAR</code></a> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code class="literal">OFF</code></td> </tr></tbody></table>

  Controls whether telemetry traces are collected or not .

* `telemetry.query_text_enabled`

  <table frame="box" rules="all" summary="Properties for telemetry.query_text_enabled"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>System Variable</th> <td><code class="literal"><a class="link" href="telemetry-trace-configuration.html#sysvar_telemetry.query_text_enabled">telemetry.query_text_enabled</a></code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th><a class="link" href="optimizer-hints.html#optimizer-hints-set-var" title="Variable-Setting Hint Syntax"><code class="literal">SET_VAR</code></a> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code class="literal">ON</code></td> </tr></tbody></table>

  Controls whether the SQL query text is included in the trace

* `telemetry.otel_log_level`

  <table frame="box" rules="all" summary="Properties for telemetry.otel_log_level"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>System Variable</th> <td><code class="literal"><a class="link" href="telemetry-trace-configuration.html#sysvar_telemetry.otel_log_level">telemetry.otel_log_level</a></code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th><a class="link" href="optimizer-hints.html#optimizer-hints-set-var" title="Variable-Setting Hint Syntax"><code class="literal">SET_VAR</code></a> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>Enumeration</td> </tr><tr><th>Default Value</th> <td><code class="literal">ERROR</code></td> </tr><tr><th>Valid Values</th> <td><p class="valid-value"><code class="literal">SILENT</code></p><p class="valid-value"><code class="literal">INFO</code></p><p class="valid-value"><code class="literal">ERROR</code></p><p class="valid-value"><code class="literal">WARNING</code></p><p class="valid-value"><code class="literal">DEBUG</code></p></td> </tr></tbody></table>

  Controls which OpenTelemetry logs are printed in the server logs

* `telemetry.otel_resource_attributes`

  <table frame="box" rules="all" summary="Properties for telemetry.otel_resource_attributes"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>System Variable</th> <td><code class="literal"><a class="link" href="telemetry-trace-configuration.html#sysvar_telemetry.otel_resource_attributes">telemetry.otel_resource_attributes</a></code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th><a class="link" href="optimizer-hints.html#optimizer-hints-set-var" title="Variable-Setting Hint Syntax"><code class="literal">SET_VAR</code></a> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code class="literal">empty</code></td> </tr></tbody></table>

  See corresponding OpenTelemetry variable OTEL\_RESOURCE\_ATTRIBUTES.

* `telemetry.otel_exporter_otlp_traces_protocol`

  <table frame="box" rules="all" summary="Properties for telemetry.otel_exporter_otlp_traces_protocol"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>System Variable</th> <td><code class="literal"><a class="link" href="telemetry-trace-configuration.html#sysvar_telemetry.otel_exporter_otlp_traces_protocol">telemetry.otel_exporter_otlp_traces_protocol</a></code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th><a class="link" href="optimizer-hints.html#optimizer-hints-set-var" title="Variable-Setting Hint Syntax"><code class="literal">SET_VAR</code></a> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>Enumeration</td> </tr><tr><th>Default Value</th> <td><code class="literal">http/protobuf</code></td> </tr><tr><th>Valid Values</th> <td><p class="valid-value"><code class="literal">http/protobuf</code></p><p class="valid-value"><code class="literal">http/json</code></p></td> </tr></tbody></table>

  OTLP transport protocol

* `telemetry.otel_exporter_otlp_traces_endpoint`

  <table frame="box" rules="all" summary="Properties for telemetry.otel_exporter_otlp_traces_endpoint"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>System Variable</th> <td><code class="literal"><a class="link" href="telemetry-trace-configuration.html#sysvar_telemetry.otel_exporter_otlp_traces_endpoint">telemetry.otel_exporter_otlp_traces_endpoint</a></code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th><a class="link" href="optimizer-hints.html#optimizer-hints-set-var" title="Variable-Setting Hint Syntax"><code class="literal">SET_VAR</code></a> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code class="literal"></code></td> </tr></tbody></table>

  Target URL to which the exporter sends traces

* `telemetry.otel_exporter_otlp_traces_network_namespace`

  <table frame="box" rules="all" summary="Properties for telemetry.otel_exporter_otlp_traces_network_namespace"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>System Variable</th> <td><code class="literal"><a class="link" href="telemetry-trace-configuration.html#sysvar_telemetry.otel_exporter_otlp_traces_network_namespace">telemetry.otel_exporter_otlp_traces_network_namespace</a></code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th><a class="link" href="optimizer-hints.html#optimizer-hints-set-var" title="Variable-Setting Hint Syntax"><code class="literal">SET_VAR</code></a> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code class="literal">[none]</code></td> </tr></tbody></table>

  (Linux only) Network namespace to use when sending data to the traces endpoint.

* `telemetry.otel_exporter_otlp_traces_certificates`

  <table frame="box" rules="all" summary="Properties for telemetry.otel_exporter_otlp_traces_certificates"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>System Variable</th> <td><code class="literal"><a class="link" href="telemetry-trace-configuration.html#sysvar_telemetry.otel_exporter_otlp_traces_certificates">telemetry.otel_exporter_otlp_traces_certificates</a></code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th><a class="link" href="optimizer-hints.html#optimizer-hints-set-var" title="Variable-Setting Hint Syntax"><code class="literal">SET_VAR</code></a> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code class="literal"></code></td> </tr></tbody></table>

  The trusted certificate to use when verifying a server's TLS credentials.

* `telemetry.otel_exporter_otlp_traces_client_key`

  <table frame="box" rules="all" summary="Properties for telemetry.otel_exporter_otlp_traces_client_key"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>System Variable</th> <td><code class="literal"><a class="link" href="telemetry-trace-configuration.html#sysvar_telemetry.otel_exporter_otlp_traces_client_key">telemetry.otel_exporter_otlp_traces_client_key</a></code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th><a class="link" href="optimizer-hints.html#optimizer-hints-set-var" title="Variable-Setting Hint Syntax"><code class="literal">SET_VAR</code></a> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code class="literal"></code></td> </tr></tbody></table>

  Client's private key in PEM format.

* `telemetry.otel_exporter_otlp_traces_client_certificates`

  <table frame="box" rules="all" summary="Properties for telemetry.otel_exporter_otlp_traces_client_certificates"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>System Variable</th> <td><code class="literal"><a class="link" href="telemetry-trace-configuration.html#sysvar_telemetry.otel_exporter_otlp_traces_client_certificates">telemetry.otel_exporter_otlp_traces_client_certificates</a></code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th><a class="link" href="optimizer-hints.html#optimizer-hints-set-var" title="Variable-Setting Hint Syntax"><code class="literal">SET_VAR</code></a> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code class="literal"></code></td> </tr></tbody></table>

  Client certificate/chain trust for clients private key in PEM format.

* `telemetry.otel_exporter_otlp_traces_headers`

  <table frame="box" rules="all" summary="Properties for telemetry.query_text_enabled"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>System Variable</th> <td><code class="literal"><a class="link" href="telemetry-trace-configuration.html#sysvar_telemetry.query_text_enabled">telemetry.query_text_enabled</a></code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th><a class="link" href="optimizer-hints.html#optimizer-hints-set-var" title="Variable-Setting Hint Syntax"><code class="literal">SET_VAR</code></a> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code class="literal">ON</code></td> </tr></tbody></table>0

  See corresponding OpenTelemetry variable OTEL\_EXPORTER\_TRACES\_HEADERS.

* `telemetry.otel_exporter_otlp_traces_secret_headers`

  <table frame="box" rules="all" summary="Properties for telemetry.query_text_enabled"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>System Variable</th> <td><code class="literal"><a class="link" href="telemetry-trace-configuration.html#sysvar_telemetry.query_text_enabled">telemetry.query_text_enabled</a></code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th><a class="link" href="optimizer-hints.html#optimizer-hints-set-var" title="Variable-Setting Hint Syntax"><code class="literal">SET_VAR</code></a> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code class="literal">ON</code></td> </tr></tbody></table>1

  Name of a secret, that contains the sensitive data for trace headers. The data content and format depends on the secret provider implementation provided with system variable `telemetry.secret_provider`.

* `telemetry.otel_exporter_otlp_traces_compression`

  <table frame="box" rules="all" summary="Properties for telemetry.query_text_enabled"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>System Variable</th> <td><code class="literal"><a class="link" href="telemetry-trace-configuration.html#sysvar_telemetry.query_text_enabled">telemetry.query_text_enabled</a></code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th><a class="link" href="optimizer-hints.html#optimizer-hints-set-var" title="Variable-Setting Hint Syntax"><code class="literal">SET_VAR</code></a> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code class="literal">ON</code></td> </tr></tbody></table>2

  Compression used by exporter

* `telemetry.otel_exporter_otlp_traces_timeout`

  <table frame="box" rules="all" summary="Properties for telemetry.query_text_enabled"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>System Variable</th> <td><code class="literal"><a class="link" href="telemetry-trace-configuration.html#sysvar_telemetry.query_text_enabled">telemetry.query_text_enabled</a></code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th><a class="link" href="optimizer-hints.html#optimizer-hints-set-var" title="Variable-Setting Hint Syntax"><code class="literal">SET_VAR</code></a> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code class="literal">ON</code></td> </tr></tbody></table>3

  Time in milliseconds the OLTP exporter waits for each batch export.

* `telemetry.otel_bsp_schedule_delay`

  <table frame="box" rules="all" summary="Properties for telemetry.query_text_enabled"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>System Variable</th> <td><code class="literal"><a class="link" href="telemetry-trace-configuration.html#sysvar_telemetry.query_text_enabled">telemetry.query_text_enabled</a></code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th><a class="link" href="optimizer-hints.html#optimizer-hints-set-var" title="Variable-Setting Hint Syntax"><code class="literal">SET_VAR</code></a> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code class="literal">ON</code></td> </tr></tbody></table>4

  Delay interval between two consecutive exports in milliseconds

* `telemetry.otel_bsp_max_queue_size`

  <table frame="box" rules="all" summary="Properties for telemetry.query_text_enabled"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>System Variable</th> <td><code class="literal"><a class="link" href="telemetry-trace-configuration.html#sysvar_telemetry.query_text_enabled">telemetry.query_text_enabled</a></code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th><a class="link" href="optimizer-hints.html#optimizer-hints-set-var" title="Variable-Setting Hint Syntax"><code class="literal">SET_VAR</code></a> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code class="literal">ON</code></td> </tr></tbody></table>5

  Maximum queue size

* `telemetry.otel_bsp_max_export_batch_size`

  <table frame="box" rules="all" summary="Properties for telemetry.query_text_enabled"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>System Variable</th> <td><code class="literal"><a class="link" href="telemetry-trace-configuration.html#sysvar_telemetry.query_text_enabled">telemetry.query_text_enabled</a></code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th><a class="link" href="optimizer-hints.html#optimizer-hints-set-var" title="Variable-Setting Hint Syntax"><code class="literal">SET_VAR</code></a> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code class="literal">ON</code></td> </tr></tbody></table>6

  Maximum batch size

* `telemetry.otel_exporter_otlp_traces_min_tls`

  <table frame="box" rules="all" summary="Properties for telemetry.query_text_enabled"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>System Variable</th> <td><code class="literal"><a class="link" href="telemetry-trace-configuration.html#sysvar_telemetry.query_text_enabled">telemetry.query_text_enabled</a></code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th><a class="link" href="optimizer-hints.html#optimizer-hints-set-var" title="Variable-Setting Hint Syntax"><code class="literal">SET_VAR</code></a> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code class="literal">ON</code></td> </tr></tbody></table>7

* `telemetry.otel_exporter_otlp_traces_max_tls`

  <table frame="box" rules="all" summary="Properties for telemetry.query_text_enabled"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>System Variable</th> <td><code class="literal"><a class="link" href="telemetry-trace-configuration.html#sysvar_telemetry.query_text_enabled">telemetry.query_text_enabled</a></code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th><a class="link" href="optimizer-hints.html#optimizer-hints-set-var" title="Variable-Setting Hint Syntax"><code class="literal">SET_VAR</code></a> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code class="literal">ON</code></td> </tr></tbody></table>8

* `telemetry.otel_exporter_otlp_traces_cipher`

  <table frame="box" rules="all" summary="Properties for telemetry.query_text_enabled"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>System Variable</th> <td><code class="literal"><a class="link" href="telemetry-trace-configuration.html#sysvar_telemetry.query_text_enabled">telemetry.query_text_enabled</a></code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th><a class="link" href="optimizer-hints.html#optimizer-hints-set-var" title="Variable-Setting Hint Syntax"><code class="literal">SET_VAR</code></a> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code class="literal">ON</code></td> </tr></tbody></table>9

  Current list of TLS 1.2 ciphers to use for traces. The current default is:

  ```
  ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-ECDSA-AES256-GCM-SHA384:
  ECDHE-RSA-AES128-GCM-SHA256:ECDHE-RSA-AES256-GCM-SHA384:ECDHE-ECDSA-CHACHA20-POLY1305:
  ECDHE-RSA-CHACHA20-POLY1305:ECDHE-ECDSA-AES256-CCM:ECDHE-ECDSA-AES128-CCM:
  DHE-RSA-AES128-GCM-SHA256:DHE-RSA-AES256-GCM-SHA384:DHE-RSA-AES256-CCM:
  DHE-RSA-AES128-CCM:DHE-RSA-CHACHA20-POLY1305
  ```

* `telemetry.otel_exporter_otlp_traces_cipher_suite`

  <table frame="box" rules="all" summary="Properties for telemetry.otel_log_level"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>System Variable</th> <td><code class="literal"><a class="link" href="telemetry-trace-configuration.html#sysvar_telemetry.otel_log_level">telemetry.otel_log_level</a></code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th><a class="link" href="optimizer-hints.html#optimizer-hints-set-var" title="Variable-Setting Hint Syntax"><code class="literal">SET_VAR</code></a> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>Enumeration</td> </tr><tr><th>Default Value</th> <td><code class="literal">ERROR</code></td> </tr><tr><th>Valid Values</th> <td><p class="valid-value"><code class="literal">SILENT</code></p><p class="valid-value"><code class="literal">INFO</code></p><p class="valid-value"><code class="literal">ERROR</code></p><p class="valid-value"><code class="literal">WARNING</code></p><p class="valid-value"><code class="literal">DEBUG</code></p></td> </tr></tbody></table>0

  Current list of TLS 1.3 ciphers to use for traces. The current default is:

  ```
   TLS_AES_128_GCM_SHA256:TLS_AES_256_GCM_SHA384:TLS_CHACHA20_POLY1305_SHA256:TLS_AES_128_CCM_SHA256
  ```

#### Client Configuration

The MySQL client reads telemetry configuration from the `[telemetry_client]` section of the configuration file. See Installing Client Plugin for information on the `telemetry_client` option. The following configuration options are available:

**Table 35.2 mysql client Telemetry Option Summary**

<table frame="box" rules="all" summary="Properties for telemetry.otel_log_level"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>System Variable</th> <td><code class="literal"><a class="link" href="telemetry-trace-configuration.html#sysvar_telemetry.otel_log_level">telemetry.otel_log_level</a></code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th><a class="link" href="optimizer-hints.html#optimizer-hints-set-var" title="Variable-Setting Hint Syntax"><code class="literal">SET_VAR</code></a> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>Enumeration</td> </tr><tr><th>Default Value</th> <td><code class="literal">ERROR</code></td> </tr><tr><th>Valid Values</th> <td><p class="valid-value"><code class="literal">SILENT</code></p><p class="valid-value"><code class="literal">INFO</code></p><p class="valid-value"><code class="literal">ERROR</code></p><p class="valid-value"><code class="literal">WARNING</code></p><p class="valid-value"><code class="literal">DEBUG</code></p></td> </tr></tbody></table>1

* `trace`

  <table frame="box" rules="all" summary="Properties for telemetry.otel_log_level"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>System Variable</th> <td><code class="literal"><a class="link" href="telemetry-trace-configuration.html#sysvar_telemetry.otel_log_level">telemetry.otel_log_level</a></code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th><a class="link" href="optimizer-hints.html#optimizer-hints-set-var" title="Variable-Setting Hint Syntax"><code class="literal">SET_VAR</code></a> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>Enumeration</td> </tr><tr><th>Default Value</th> <td><code class="literal">ERROR</code></td> </tr><tr><th>Valid Values</th> <td><p class="valid-value"><code class="literal">SILENT</code></p><p class="valid-value"><code class="literal">INFO</code></p><p class="valid-value"><code class="literal">ERROR</code></p><p class="valid-value"><code class="literal">WARNING</code></p><p class="valid-value"><code class="literal">DEBUG</code></p></td> </tr></tbody></table>2

  Controls whether telemetry traces are collected or not .

* `help`

  <table frame="box" rules="all" summary="Properties for telemetry.otel_log_level"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>System Variable</th> <td><code class="literal"><a class="link" href="telemetry-trace-configuration.html#sysvar_telemetry.otel_log_level">telemetry.otel_log_level</a></code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th><a class="link" href="optimizer-hints.html#optimizer-hints-set-var" title="Variable-Setting Hint Syntax"><code class="literal">SET_VAR</code></a> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>Enumeration</td> </tr><tr><th>Default Value</th> <td><code class="literal">ERROR</code></td> </tr><tr><th>Valid Values</th> <td><p class="valid-value"><code class="literal">SILENT</code></p><p class="valid-value"><code class="literal">INFO</code></p><p class="valid-value"><code class="literal">ERROR</code></p><p class="valid-value"><code class="literal">WARNING</code></p><p class="valid-value"><code class="literal">DEBUG</code></p></td> </tr></tbody></table>3

  When enabled, prints help about telemetry\_client options .

* `otel_log_level`

  <table frame="box" rules="all" summary="Properties for telemetry.otel_log_level"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>System Variable</th> <td><code class="literal"><a class="link" href="telemetry-trace-configuration.html#sysvar_telemetry.otel_log_level">telemetry.otel_log_level</a></code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th><a class="link" href="optimizer-hints.html#optimizer-hints-set-var" title="Variable-Setting Hint Syntax"><code class="literal">SET_VAR</code></a> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>Enumeration</td> </tr><tr><th>Default Value</th> <td><code class="literal">ERROR</code></td> </tr><tr><th>Valid Values</th> <td><p class="valid-value"><code class="literal">SILENT</code></p><p class="valid-value"><code class="literal">INFO</code></p><p class="valid-value"><code class="literal">ERROR</code></p><p class="valid-value"><code class="literal">WARNING</code></p><p class="valid-value"><code class="literal">DEBUG</code></p></td> </tr></tbody></table>4

  Controls which OpenTelemetry logs are printed in the server logs

* `otel_resource_attributes`

  <table frame="box" rules="all" summary="Properties for telemetry.otel_log_level"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>System Variable</th> <td><code class="literal"><a class="link" href="telemetry-trace-configuration.html#sysvar_telemetry.otel_log_level">telemetry.otel_log_level</a></code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th><a class="link" href="optimizer-hints.html#optimizer-hints-set-var" title="Variable-Setting Hint Syntax"><code class="literal">SET_VAR</code></a> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>Enumeration</td> </tr><tr><th>Default Value</th> <td><code class="literal">ERROR</code></td> </tr><tr><th>Valid Values</th> <td><p class="valid-value"><code class="literal">SILENT</code></p><p class="valid-value"><code class="literal">INFO</code></p><p class="valid-value"><code class="literal">ERROR</code></p><p class="valid-value"><code class="literal">WARNING</code></p><p class="valid-value"><code class="literal">DEBUG</code></p></td> </tr></tbody></table>5

  See corresponding OpenTelemetry variable OTEL\_RESOURCE\_ATTRIBUTES.

* `otel_exporter_otlp_traces_protocol`

  <table frame="box" rules="all" summary="Properties for telemetry.otel_log_level"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>System Variable</th> <td><code class="literal"><a class="link" href="telemetry-trace-configuration.html#sysvar_telemetry.otel_log_level">telemetry.otel_log_level</a></code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th><a class="link" href="optimizer-hints.html#optimizer-hints-set-var" title="Variable-Setting Hint Syntax"><code class="literal">SET_VAR</code></a> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>Enumeration</td> </tr><tr><th>Default Value</th> <td><code class="literal">ERROR</code></td> </tr><tr><th>Valid Values</th> <td><p class="valid-value"><code class="literal">SILENT</code></p><p class="valid-value"><code class="literal">INFO</code></p><p class="valid-value"><code class="literal">ERROR</code></p><p class="valid-value"><code class="literal">WARNING</code></p><p class="valid-value"><code class="literal">DEBUG</code></p></td> </tr></tbody></table>6

  OTLP transport protocol

* `otel_exporter_otlp_traces_endpoint`

  <table frame="box" rules="all" summary="Properties for telemetry.otel_log_level"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>System Variable</th> <td><code class="literal"><a class="link" href="telemetry-trace-configuration.html#sysvar_telemetry.otel_log_level">telemetry.otel_log_level</a></code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th><a class="link" href="optimizer-hints.html#optimizer-hints-set-var" title="Variable-Setting Hint Syntax"><code class="literal">SET_VAR</code></a> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>Enumeration</td> </tr><tr><th>Default Value</th> <td><code class="literal">ERROR</code></td> </tr><tr><th>Valid Values</th> <td><p class="valid-value"><code class="literal">SILENT</code></p><p class="valid-value"><code class="literal">INFO</code></p><p class="valid-value"><code class="literal">ERROR</code></p><p class="valid-value"><code class="literal">WARNING</code></p><p class="valid-value"><code class="literal">DEBUG</code></p></td> </tr></tbody></table>7

  Target URL to which the exporter sends traces

* `otel_exporter_otlp_traces_certificates`

  <table frame="box" rules="all" summary="Properties for telemetry.otel_log_level"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>System Variable</th> <td><code class="literal"><a class="link" href="telemetry-trace-configuration.html#sysvar_telemetry.otel_log_level">telemetry.otel_log_level</a></code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th><a class="link" href="optimizer-hints.html#optimizer-hints-set-var" title="Variable-Setting Hint Syntax"><code class="literal">SET_VAR</code></a> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>Enumeration</td> </tr><tr><th>Default Value</th> <td><code class="literal">ERROR</code></td> </tr><tr><th>Valid Values</th> <td><p class="valid-value"><code class="literal">SILENT</code></p><p class="valid-value"><code class="literal">INFO</code></p><p class="valid-value"><code class="literal">ERROR</code></p><p class="valid-value"><code class="literal">WARNING</code></p><p class="valid-value"><code class="literal">DEBUG</code></p></td> </tr></tbody></table>8

  The trusted certificate to use when verifying a server's TLS credentials.

* `otel_exporter_otlp_traces_client_key`

  <table frame="box" rules="all" summary="Properties for telemetry.otel_log_level"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>System Variable</th> <td><code class="literal"><a class="link" href="telemetry-trace-configuration.html#sysvar_telemetry.otel_log_level">telemetry.otel_log_level</a></code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th><a class="link" href="optimizer-hints.html#optimizer-hints-set-var" title="Variable-Setting Hint Syntax"><code class="literal">SET_VAR</code></a> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>Enumeration</td> </tr><tr><th>Default Value</th> <td><code class="literal">ERROR</code></td> </tr><tr><th>Valid Values</th> <td><p class="valid-value"><code class="literal">SILENT</code></p><p class="valid-value"><code class="literal">INFO</code></p><p class="valid-value"><code class="literal">ERROR</code></p><p class="valid-value"><code class="literal">WARNING</code></p><p class="valid-value"><code class="literal">DEBUG</code></p></td> </tr></tbody></table>9

  Client's private key in PEM format.

* `otel_exporter_otlp_traces_client_certificates`

  <table frame="box" rules="all" summary="Properties for telemetry.otel_resource_attributes"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>System Variable</th> <td><code class="literal"><a class="link" href="telemetry-trace-configuration.html#sysvar_telemetry.otel_resource_attributes">telemetry.otel_resource_attributes</a></code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th><a class="link" href="optimizer-hints.html#optimizer-hints-set-var" title="Variable-Setting Hint Syntax"><code class="literal">SET_VAR</code></a> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code class="literal">empty</code></td> </tr></tbody></table>0

  Client certificate/chain trust for clients private key in PEM format.

* `otel_exporter_otlp_traces_headers`

  <table frame="box" rules="all" summary="Properties for telemetry.otel_resource_attributes"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>System Variable</th> <td><code class="literal"><a class="link" href="telemetry-trace-configuration.html#sysvar_telemetry.otel_resource_attributes">telemetry.otel_resource_attributes</a></code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th><a class="link" href="optimizer-hints.html#optimizer-hints-set-var" title="Variable-Setting Hint Syntax"><code class="literal">SET_VAR</code></a> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code class="literal">empty</code></td> </tr></tbody></table>1

  See corresponding OpenTelemetry variable OTEL\_EXPORTER\_TRACES\_HEADERS.

* `otel_exporter_otlp_traces_compression`

  <table frame="box" rules="all" summary="Properties for telemetry.otel_resource_attributes"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>System Variable</th> <td><code class="literal"><a class="link" href="telemetry-trace-configuration.html#sysvar_telemetry.otel_resource_attributes">telemetry.otel_resource_attributes</a></code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th><a class="link" href="optimizer-hints.html#optimizer-hints-set-var" title="Variable-Setting Hint Syntax"><code class="literal">SET_VAR</code></a> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code class="literal">empty</code></td> </tr></tbody></table>2

  Compression used by exporter

* `otel_exporter_otlp_traces_timeout`

  <table frame="box" rules="all" summary="Properties for telemetry.otel_resource_attributes"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>System Variable</th> <td><code class="literal"><a class="link" href="telemetry-trace-configuration.html#sysvar_telemetry.otel_resource_attributes">telemetry.otel_resource_attributes</a></code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th><a class="link" href="optimizer-hints.html#optimizer-hints-set-var" title="Variable-Setting Hint Syntax"><code class="literal">SET_VAR</code></a> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code class="literal">empty</code></td> </tr></tbody></table>3

  Time OLTP exporter waits for each batch export

* `otel_bsp_schedule_delay`

  <table frame="box" rules="all" summary="Properties for telemetry.otel_resource_attributes"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>System Variable</th> <td><code class="literal"><a class="link" href="telemetry-trace-configuration.html#sysvar_telemetry.otel_resource_attributes">telemetry.otel_resource_attributes</a></code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th><a class="link" href="optimizer-hints.html#optimizer-hints-set-var" title="Variable-Setting Hint Syntax"><code class="literal">SET_VAR</code></a> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code class="literal">empty</code></td> </tr></tbody></table>4

  Delay interval between two consecutive exports in milliseconds

* `otel_bsp_max_queue_size`

  <table frame="box" rules="all" summary="Properties for telemetry.otel_resource_attributes"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>System Variable</th> <td><code class="literal"><a class="link" href="telemetry-trace-configuration.html#sysvar_telemetry.otel_resource_attributes">telemetry.otel_resource_attributes</a></code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th><a class="link" href="optimizer-hints.html#optimizer-hints-set-var" title="Variable-Setting Hint Syntax"><code class="literal">SET_VAR</code></a> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code class="literal">empty</code></td> </tr></tbody></table>5

  Maximum queue size

* `otel_bsp_max_export_batch_size`

  <table frame="box" rules="all" summary="Properties for telemetry.otel_resource_attributes"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>System Variable</th> <td><code class="literal"><a class="link" href="telemetry-trace-configuration.html#sysvar_telemetry.otel_resource_attributes">telemetry.otel_resource_attributes</a></code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th><a class="link" href="optimizer-hints.html#optimizer-hints-set-var" title="Variable-Setting Hint Syntax"><code class="literal">SET_VAR</code></a> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code class="literal">empty</code></td> </tr></tbody></table>6

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


### 35.3.2 Trace Format

A span represents an operation within a trace. For more information, see [OpenTelemetry Span](https://github.com/open-telemetry/opentelemetry-specification/blob/main/specification/trace/api.md#span). The following span types are emitted by the telemetry component:

* Control Span
* Session Span
* Statement Span

#### Control Span

Issued when the telemetry configuration changes, notifying downstream system of which signal collection has been enabled or disabled.

This span type has the following attributes:

* `Name: Control`
* `trace_enabled`: Boolean.
* `metrics_enabled`: Boolean.
* `logs_enabled`: Boolean
* `details`:

#### Session Span

Issued when a client session ends, recording data relevant to that session from initial connection to close of session.

This span type has the following attributes:

* `Name: Session`
* `mysql.processlist_id`
* `mysql.thread_id`
* `mysql.user`
* `mysql.host`
* `mysql.group`

This span also contains dynamic attributes generated with the format `mysql.session_attr.xxx`, where `xxx` is the session connect attribute name. See `session_connect_attrs`.

For example, after the following session disconnects:

```
mysql> select * from session_connect_attrs;
+----------------+-----------------+------------+------------------+
| PROCESSLIST_ID | ATTR_NAME       | ATTR_VALUE | ORDINAL_POSITION |
+----------------+-----------------+------------+------------------+
|             10 | _pid            | 14488      |                0 |
|             10 | _platform       | x86_64     |                1 |
|             10 | _os             | Linux      |                2 |
|             10 | _client_name    | libmysql   |                3 |
|             10 | os_user         | malff      |                4 |
|             10 | _client_version | 8.4.0-tr   |                5 |
|             10 | program_name    | mysql      |                6 |
+----------------+-----------------+------------+------------------+
7 rows in set (0.00 sec)
```

The session span emitted is:

```
Span #
    Trace ID       : 4137db42febad2d00a4123286076ba18
    Parent ID      :
    ID             : b7ff26660b9fcb35
    Name           : session
    Kind           : Internal
    Start time     : 2023-01-11 10:58:24.79557649 +0000 UTC
    End time       : 2023-01-11 11:00:50.46695685 +0000 UTC
    Status code    : Unset
    Status message :
Attributes:
     -> mysql.processlist_id: Int(10)
     -> mysql.thread_id: Int(50)
     -> mysql.user: Str(root)
     -> mysql.host: Str(localhost)
     -> mysql.group: Str(USR_default)
     -> mysql.session_attr._pid: Str(14488)
     -> mysql.session_attr._platform: Str(x86_64)
     -> mysql.session_attr._os: Str(Linux)
     -> mysql.session_attr._client_name: Str(libmysql)
     -> mysql.session_attr.os_user: Str(malff)
     -> mysql.session_attr._client_version: Str(8.4.0-tr)
     -> mysql.session_attr.program_name: Str(mysql)
```

#### Statement Span

Issued when a statement execution ends in the server, recording all relevant statement information from the start of the execution to its completion.

This span type has the following attributes:

* `Name: stmt`
* `mysql.event_name`
* `mysql.lock_time`
* `mysql.sql_text`
* `mysql.digest_text`
* `mysql.current_schema`
* `mysql.object_type`
* `mysql.object_schema`
* `mysql.object_name`
* `mysql.sql_errno`
* `mysql.sqlstate`
* `mysql.message_text`
* `mysql.error_count`
* `mysql.warning_count`
* `mysql.rows_affected`
* `mysql.rows_sent`
* `mysql.rows_examined`
* `mysql.created_tmp_disk_tables`
* `mysql.created_tmp_tables`
* `mysql.select_full_join`
* `mysql.select_full_range_join`
* `mysql.select_range`
* `mysql.select_range_check`
* `mysql.select_scan`
* `mysql.sort_merge_passes`
* `mysql.sort_range`
* `mysql.sort_rows`
* `mysql.sort_scan`
* `mysql.no_index_used`
* `mysql.no_good_index_used`
* `mysql.max_controlled_memory`
* `mysql.max_total_memory`
* `mysql.cpu_time`
