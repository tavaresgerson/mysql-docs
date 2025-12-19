### 35.3.1 Configuring Trace Telemetry

This section describes the configuration for server and client.

*  Server Configuration
*  Client Configuration
*  Client Configuration Example

#### Server Configuration

The following are the server trace telemetry configuration variables:

*  `telemetry.trace_enabled`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>System Variable</th> <td><code>telemetry.trace_enabled</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th><code>SET_VAR</code> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>ON</code></td> </tr></tbody></table>

  Controls whether telemetry traces are collected or not .
*  `telemetry.query_text_enabled`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>System Variable</th> <td><code>telemetry.query_text_enabled</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th><code>SET_VAR</code> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>ON</code></td> </tr></tbody></table>

  Controls whether the SQL query text is included in the trace
*  `telemetry.otel_log_level`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>System Variable</th> <td><code>telemetry.otel_log_level</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th><code>SET_VAR</code> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>Enumeration</td> </tr><tr><th>Default Value</th> <td><code>ERROR</code></td> </tr><tr><th>Valid Values</th> <td><p class="valid-value"><code>SILENT</code></p><p class="valid-value"><code>INFO</code></p><p class="valid-value"><code>ERROR</code></p><p class="valid-value"><code>WARNING</code></p><p class="valid-value"><code>DEBUG</code></p></td> </tr></tbody></table>

  Controls which OpenTelemetry logs are printed in the server logs
*  `telemetry.otel_resource_attributes`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>System Variable</th> <td><code>telemetry.otel_resource_attributes</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th><code>SET_VAR</code> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>empty</code></td> </tr></tbody></table>

  See corresponding OpenTelemetry variable OTEL\_RESOURCE\_ATTRIBUTES.
*  `telemetry.otel_exporter_otlp_traces_protocol`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>System Variable</th> <td><code>telemetry.otel_exporter_otlp_traces_protocol</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th><code>SET_VAR</code> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>Enumeration</td> </tr><tr><th>Default Value</th> <td><code>http/protobuf</code></td> </tr><tr><th>Valid Values</th> <td><p class="valid-value"><code>http/protobuf</code></p><p class="valid-value"><code>http/json</code></p></td> </tr></tbody></table>

  OTLP transport protocol
*  `telemetry.otel_exporter_otlp_traces_endpoint`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>System Variable</th> <td><code>telemetry.otel_exporter_otlp_traces_endpoint</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th><code>SET_VAR</code> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>http://localhost:4318/v1/traces</code></td> </tr></tbody></table>

  Target URL to which the exporter sends traces
*  `telemetry.otel_exporter_otlp_traces_certificates`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>System Variable</th> <td><code>telemetry.otel_exporter_otlp_traces_certificates</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th><code>SET_VAR</code> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code></code></td> </tr></tbody></table>

  The trusted certificate to use when verifying a server's TLS credentials.
*  `telemetry.otel_exporter_otlp_traces_client_key`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>System Variable</th> <td><code>telemetry.otel_exporter_otlp_traces_client_key</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th><code>SET_VAR</code> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code></code></td> </tr></tbody></table>

  Client's private key in PEM format.
*  `telemetry.otel_exporter_otlp_traces_client_certificates`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>System Variable</th> <td><code>telemetry.otel_exporter_otlp_traces_client_certificates</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th><code>SET_VAR</code> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code></code></td> </tr></tbody></table>

  Client certificate/chain trust for clients private key in PEM format.
*  `telemetry.otel_exporter_otlp_traces_headers`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>System Variable</th> <td><code>telemetry.otel_exporter_otlp_traces_headers</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th><code>SET_VAR</code> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>empty</code></td> </tr></tbody></table>

  See corresponding OpenTelemetry variable OTEL\_EXPORTER\_TRACES\_HEADERS.
*  `telemetry.otel_exporter_otlp_traces_compression`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>System Variable</th> <td><code>telemetry.otel_exporter_otlp_traces_compression</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th><code>SET_VAR</code> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>none (no compression)</code></td> </tr><tr><th>Valid Values</th> <td><p class="valid-value"><code>none (no compression)</code></p><p class="valid-value"><code>gzip</code></p></td> </tr></tbody></table>

  Compression used by exporter
*  `telemetry.otel_exporter_otlp_traces_timeout`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>System Variable</th> <td><code>telemetry.otel_exporter_otlp_traces_timeout</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th><code>SET_VAR</code> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>10000</code></td> </tr><tr><th>Unit</th> <td>milliseconds</td> </tr></tbody></table>

  Time in milliseconds the OLTP exporter waits for each batch export.
*  `telemetry.otel_bsp_schedule_delay`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>System Variable</th> <td><code>telemetry.otel_bsp_schedule_delay</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th><code>SET_VAR</code> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>5000</code></td> </tr><tr><th>Unit</th> <td>milliseconds</td> </tr></tbody></table>

  Delay interval between two consecutive exports in milliseconds
*  `telemetry.otel_bsp_max_queue_size`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>System Variable</th> <td><code>telemetry.otel_bsp_max_queue_size</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th><code>SET_VAR</code> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>2048</code></td> </tr></tbody></table>

  Maximum queue size
*  `telemetry.otel_bsp_max_export_batch_size`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>System Variable</th> <td><code>telemetry.otel_bsp_max_export_batch_size</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th><code>SET_VAR</code> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>512</code></td> </tr></tbody></table>

  Maximum batch size
*  `telemetry.otel_exporter_otlp_traces_min_tls`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>System Variable</th> <td><code>telemetry.otel_exporter_otlp_traces_min_tls</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th><code>SET_VAR</code> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>Enumeration</td> </tr><tr><th>Default Value</th> <td><code>[none]</code></td> </tr><tr><th>Valid Values</th> <td><p class="valid-value"><code>[none]</code></p><p class="valid-value"><code>1.2</code></p><p class="valid-value"><code>1.3</code></p></td> </tr></tbody></table>
*  `telemetry.otel_exporter_otlp_traces_max_tls`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>System Variable</th> <td><code>telemetry.otel_exporter_otlp_traces_max_tls</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th><code>SET_VAR</code> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>Enumeration</td> </tr><tr><th>Default Value</th> <td><code>[none]</code></td> </tr><tr><th>Valid Values</th> <td><p class="valid-value"><code>[none]</code></p><p class="valid-value"><code>1.2</code></p><p class="valid-value"><code>1.3</code></p></td> </tr></tbody></table>
*  `telemetry.otel_exporter_otlp_traces_cipher`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>System Variable</th> <td><code>telemetry.otel_exporter_otlp_traces_cipher</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th><code>SET_VAR</code> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>[none]</code></td> </tr></tbody></table>
*  `telemetry.otel_exporter_otlp_traces_cipher_suite`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>System Variable</th> <td><code>telemetry.otel_exporter_otlp_traces_cipher_suite</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th><code>SET_VAR</code> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>[none]</code></td> </tr></tbody></table>

#### Client Configuration

The MySQL client reads telemetry configuration from the `[telemetry_client]` section of the configuration file. See  Installing Client Plugin for information on the `telemetry_client` option. The following configuration options are available:

**Table 35.2 mysql client Telemetry Option Summary**

<table><col style="width: 35%"/><col style="width: 64%"/><thead><tr><th>Option Name</th> <th>Description</th> </tr></thead><tbody><tr><td>--telemetry_client</td> <td>Enables the telemetry client.</td> </tr><tr><td>--otel_bsp_max_export_batch_size</td> <td>See variable OTEL_BSP_MAX_EXPORT_BATCH_SIZE.</td> </tr><tr><td>--otel_bsp_max_queue_size</td> <td>See variable OTEL_BSP_MAX_QUEUE_SIZE.</td> </tr><tr><td>--otel_bsp_schedule_delay</td> <td>See variable OTEL_BSP_SCHEDULE_DELAY.</td> </tr><tr><td>--otel_exporter_otlp_traces_certificates</td> <td>Not in use at this time. Reserved for future development.</td> </tr><tr><td>--otel_exporter_otlp_traces_client_certificates</td> <td>Not in use at this time. Reserved for future development.</td> </tr><tr><td>--otel_exporter_otlp_traces_client_key</td> <td>Not in use at this time. Reserved for future development.</td> </tr><tr><td>--otel_exporter_otlp_traces_compression</td> <td>Compression type</td> </tr><tr><td>--otel_exporter_otlp_traces_endpoint</td> <td>The trace export endpoint</td> </tr><tr><td>--otel_exporter_otlp_traces_headers</td> <td>Key-value pairs to be used as headers associated with HTTP requests</td> </tr><tr><td>--otel_exporter_otlp_traces_protocol</td> <td>The OTLP transport protocol</td> </tr><tr><td>--otel_exporter_otlp_traces_timeout</td> <td>Time OLTP exporter waits for each batch export</td> </tr><tr><td>--otel-help</td> <td>When enabled, prints help about telemetry_client options.</td> </tr><tr><td>--otel_log_level</td> <td>Controls which opentelemetry logs are printed in the server logs</td> </tr><tr><td>--otel_resource_attributes</td> <td>See corresponding OpenTelemetry variable OTEL_RESOURCE_ATTRIBUTES.</td> </tr><tr><td>--otel-trace</td> <td>This system variable controls whether telemetry traces are collected or not.</td> </tr></tbody></table>

*  `trace`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--otel-trace</code></td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>ON</code></td> </tr></tbody></table>

  Controls whether telemetry traces are collected or not .
*  `help`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--otel-help</code></td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>OFF</code></td> </tr></tbody></table>

  When enabled, prints help about telemetry\_client options .
*  `otel_log_level`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--otel_log_level</code></td> </tr><tr><th>Type</th> <td>Enumeration</td> </tr><tr><th>Default Value</th> <td><code>ERROR</code></td> </tr><tr><th>Valid Values</th> <td><p class="valid-value"><code>ERROR</code></p><p class="valid-value"><code>SILENT</code></p><p class="valid-value"><code>WARNING</code></p><p class="valid-value"><code>INFO</code></p><p class="valid-value"><code>DEBUG</code></p></td> </tr></tbody></table>

  Controls which OpenTelemetry logs are printed in the server logs
*  `otel_resource_attributes`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--otel_resource_attributes</code></td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code></code></td> </tr></tbody></table>

  See corresponding OpenTelemetry variable OTEL\_RESOURCE\_ATTRIBUTES.
*  `otel_exporter_otlp_traces_protocol`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--otel_exporter_otlp_traces_protocol</code></td> </tr><tr><th>Type</th> <td>Enumeration</td> </tr><tr><th>Default Value</th> <td><code>http/protobuf</code></td> </tr><tr><th>Valid Values</th> <td><p class="valid-value"><code>http/protobuf</code></p><p class="valid-value"><code>http/json</code></p></td> </tr></tbody></table>

  OTLP transport protocol
*  `otel_exporter_otlp_traces_endpoint`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--otel_exporter_otlp_traces_endpoint</code></td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>http://localhost:4318/v1/traces</code></td> </tr></tbody></table>

  Target URL to which the exporter sends traces
*  `otel_exporter_otlp_traces_certificates`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--otel_exporter_otlp_traces_certificates</code></td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code></code></td> </tr></tbody></table>

  The trusted certificate to use when verifying a server's TLS credentials.
*  `otel_exporter_otlp_traces_client_key`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--otel_exporter_otlp_traces_client_key</code></td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code></code></td> </tr></tbody></table>

  Client's private key in PEM format.
*  `otel_exporter_otlp_traces_client_certificates`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--otel_exporter_otlp_traces_client_certificates</code></td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code></code></td> </tr></tbody></table>

  Client certificate/chain trust for clients private key in PEM format.
*  `otel_exporter_otlp_traces_headers`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--otel_exporter_otlp_traces_headers</code></td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code></code></td> </tr></tbody></table>

  See corresponding OpenTelemetry variable OTEL\_EXPORTER\_TRACES\_HEADERS.
*  `otel_exporter_otlp_traces_compression`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--otel_exporter_otlp_traces_compression</code></td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>none</code></td> </tr><tr><th>Valid Values</th> <td><p class="valid-value"><code>none</code></p><p class="valid-value"><code>gzip</code></p></td> </tr></tbody></table>

  Compression used by exporter
*  `otel_exporter_otlp_traces_timeout`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--otel_exporter_otlp_traces_timeout</code></td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>10000</code></td> </tr></tbody></table>

  Time OLTP exporter waits for each batch export
*  `otel_bsp_schedule_delay`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--otel_bsp_schedule_delay</code></td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>5000</code></td> </tr></tbody></table>

  Delay interval between two consecutive exports in milliseconds
*  `otel_bsp_max_queue_size`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--otel_bsp_max_queue_size</code></td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>2048</code></td> </tr></tbody></table>

  Maximum queue size
*  `otel_bsp_max_export_batch_size`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--otel_bsp_max_export_batch_size</code></td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>512</code></td> </tr></tbody></table>

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


