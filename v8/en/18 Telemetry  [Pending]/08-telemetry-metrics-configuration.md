### 35.4.1 Configuring Metrics Telemetry

#### Server Configuration

*  `telemetry.metrics_enabled`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>System Variable</th> <td><code>telemetry.metrics_enabled</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th><code>SET_VAR</code> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>ON</code></td> </tr></tbody></table>

  Controls whether telemetry metrics are collected or not.
*  `telemetry.otel_exporter_otlp_metrics_protocol`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>System Variable</th> <td><code>telemetry.otel_exporter_otlp_metrics_protocol</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th><code>SET_VAR</code> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>Enumeration</td> </tr><tr><th>Default Value</th> <td><code>http/protobuf</code></td> </tr><tr><th>Valid Values</th> <td><p class="valid-value"><code>http/protobuf</code></p><p class="valid-value"><code>http/json</code></p></td> </tr></tbody></table>

  The OLTP transport protocol.

  ::: info Note

  MySQL does not support the `gprc` protocol.


  :::
*  `telemetry.otel_exporter_otlp_metrics_endpoint`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>System Variable</th> <td><code>telemetry.otel_exporter_otlp_metrics_endpoint</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th><code>SET_VAR</code> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>http://localhost:4318/v1/metrics</code></td> </tr></tbody></table>

  Endpoint metric signals are sent to.
*  `telemetry.otel_exporter_otlp_metrics_certificates`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>System Variable</th> <td><code>telemetry.otel_exporter_otlp_metrics_certificates</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th><code>SET_VAR</code> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>[none]</code></td> </tr></tbody></table>

  The trusted certificate to use when verifying a server's TLS credentials.
*  `telemetry.otel_exporter_otlp_metrics_client_key`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>System Variable</th> <td><code>telemetry.otel_exporter_otlp_metrics_client_key</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th><code>SET_VAR</code> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>[none]</code></td> </tr></tbody></table>

  Client's private key in PEM format.
*  `telemetry.otel_exporter_otlp_metrics_client_certificates`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>System Variable</th> <td><code>telemetry.otel_exporter_otlp_metrics_client_certificates</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th><code>SET_VAR</code> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>[none]</code></td> </tr></tbody></table>

  Client certificate/chain trust for clients private key in PEM format.
*  `telemetry.otel_exporter_otlp_metrics_min_tls`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>System Variable</th> <td><code>telemetry.otel_exporter_otlp_metrics_min_tls</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th><code>SET_VAR</code> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>Enumeration</td> </tr><tr><th>Default Value</th> <td><code>[none]</code></td> </tr><tr><th>Valid Values</th> <td><p class="valid-value"><code>[none]</code></p><p class="valid-value"><code>1.2</code></p><p class="valid-value"><code>1.3</code></p></td> </tr></tbody></table>

  Minimum TLS version to use for metrics.
*  `telemetry.otel_exporter_otlp_metrics_max_tls`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>System Variable</th> <td><code>telemetry.otel_exporter_otlp_metrics_max_tls</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th><code>SET_VAR</code> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>Enumeration</td> </tr><tr><th>Default Value</th> <td><code>[none]</code></td> </tr><tr><th>Valid Values</th> <td><p class="valid-value"><code>[none]</code></p><p class="valid-value"><code>1.2</code></p><p class="valid-value"><code>1.3</code></p></td> </tr></tbody></table>

  Maximum TLS version to use for metrics.
*  `telemetry.otel_exporter_otlp_metrics_cipher`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>System Variable</th> <td><code>telemetry.otel_exporter_otlp_metrics_cipher</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th><code>SET_VAR</code> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>[none]</code></td> </tr></tbody></table>

  TLS cipher to use for metrics (TLS 1.2).
*  `telemetry.otel_exporter_otlp_metrics_cipher_suite`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>System Variable</th> <td><code>telemetry.otel_exporter_otlp_metrics_cipher_suite</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th><code>SET_VAR</code> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>[none]</code></td> </tr></tbody></table>

  TLS cipher to use for metrics (TLS 1.3).
*  `telemetry.otel_exporter_otlp_metrics_headers`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>System Variable</th> <td><code>telemetry.otel_exporter_otlp_metrics_headers</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th><code>SET_VAR</code> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>[none]</code></td> </tr></tbody></table>

  Key-value pairs to be used as headers associated with HTTP requests.
*  `telemetry.otel_exporter_otlp_metrics_compression`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>System Variable</th> <td><code>telemetry.otel_exporter_otlp_metrics_compression</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th><code>SET_VAR</code> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>none (no compression)</code></td> </tr><tr><th>Valid Values</th> <td><p class="valid-value"><code>none (no compression)</code></p><p class="valid-value"><code>gzip</code></p></td> </tr></tbody></table>

  Compression used by exporter
*  `telemetry.otel_exporter_otlp_metrics_timeout`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>System Variable</th> <td><code>telemetry.otel_exporter_otlp_metrics_timeout</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th><code>SET_VAR</code> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>10000</code></td> </tr><tr><th>Unit</th> <td>milliseconds</td> </tr></tbody></table>

  Time in milliseconds the OLTP exporter waits for each batch export.
*  `telemetry.metrics_reader_frequency_1`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>System Variable</th> <td><code>telemetry.metrics_reader_frequency_1</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th><code>SET_VAR</code> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>10</code></td> </tr><tr><th>Unit</th> <td>seconds</td> </tr></tbody></table>

  Mandatory. Defines the interval in seconds (f1) between meter evaluations for meters with a frequency less than or equal to the interval, f1. For example:

  ```
  SELECT * from performance_schema.setup_meters WHERE FREQUENCY <= telemetry.metrics_reader_frequency_1
  ```
*  `telemetry.metrics_reader_frequency_2`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>System Variable</th> <td><code>telemetry.metrics_reader_frequency_2</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th><code>SET_VAR</code> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>10</code></td> </tr><tr><th>Unit</th> <td>seconds</td> </tr></tbody></table>

  Optional. Defines the interval in seconds (f2) between meter evaluations for meters with a frequency greater than the interval, f1. For example, if f1 and f2 are defined:

  ```
  SELECT * from performance_schema.setup_meters WHERE FREQUENCY <= telemetry.metrics_reader_frequency_1
  ```

  and, every f2 seconds:

  ```
  SELECT * from performance_schema.setup_meters
        WHERE FREQUENCY > telemetry.metrics_reader_frequency_1
        AND FREQUENCY <= metrics_reader_frequency_2;
  ```
*  `telemetry.metrics_reader_frequency_3`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>System Variable</th> <td><code>telemetry.metrics_reader_frequency_3</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th><code>SET_VAR</code> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>10</code></td> </tr><tr><th>Unit</th> <td>seconds</td> </tr></tbody></table>

  Optional. Defines the interval in seconds (f3) between meter evaluations for meters with a frequency greater than the interval, f2. For example, if f1, f2, and f3 are defined:

  ```
  SELECT * from performance_schema.setup_meters WHERE FREQUENCY <= telemetry.metrics_reader_frequency_1
  ```

  and, every f2 seconds:

  ```
  SELECT * from performance_schema.setup_meters
        WHERE FREQUENCY > telemetry.metrics_reader_frequency_1
        AND FREQUENCY <= metrics_reader_frequency_2;
  ```

  and, every f3 seconds:

  ```
  SELECT * from performance_schema.setup_meters WHERE FREQUENCY > telemetry.metrics_reader_frequency_2;
  ```

