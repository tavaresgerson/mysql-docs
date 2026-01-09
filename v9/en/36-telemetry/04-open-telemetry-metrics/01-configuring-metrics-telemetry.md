### 35.4.1 Configuring Metrics Telemetry

This section lists the system variables used to configure Metric telemetry.

#### Server Configuration

* `telemetry.metrics_enabled`

  <table frame="box" rules="all" summary="Properties for telemetry.metrics_enabled"><tbody><tr><th>System Variable</th> <td><code><a class="link" href="telemetry-metrics-configuration.html#sysvar_telemetry.metrics_enabled">telemetry.metrics_enabled</a></code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th><a class="link" href="optimizer-hints.html#optimizer-hints-set-var" title="Variable-Setting Hint Syntax"><code>SET_VAR</code></a> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>OFF</code></td> </tr></tbody></table>

  Controls whether telemetry metrics are collected or not.

* `telemetry.otel_exporter_otlp_metrics_protocol`

  <table frame="box" rules="all" summary="Properties for telemetry.otel_exporter_otlp_metrics_protocol"><tbody><tr><th>System Variable</th> <td><code><a class="link" href="telemetry-metrics-configuration.html#sysvar_telemetry.otel_exporter_otlp_metrics_protocol">telemetry.otel_exporter_otlp_metrics_protocol</a></code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th><a class="link" href="optimizer-hints.html#optimizer-hints-set-var" title="Variable-Setting Hint Syntax"><code>SET_VAR</code></a> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>Enumeration</td> </tr><tr><th>Default Value</th> <td><code>http/protobuf</code></td> </tr><tr><th>Valid Values</th> <td><p class="valid-value"><code>http/protobuf</code></p><p class="valid-value"><code>http/json</code></p></td> </tr></tbody></table>

  The OLTP transport protocol.

  Note

  MySQL does not support the `gprc` protocol.

* `telemetry.otel_exporter_otlp_metrics_endpoint`

  <table frame="box" rules="all" summary="Properties for telemetry.otel_exporter_otlp_metrics_endpoint"><tbody><tr><th>System Variable</th> <td><code><a class="link" href="telemetry-metrics-configuration.html#sysvar_telemetry.otel_exporter_otlp_metrics_endpoint">telemetry.otel_exporter_otlp_metrics_endpoint</a></code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th><a class="link" href="optimizer-hints.html#optimizer-hints-set-var" title="Variable-Setting Hint Syntax"><code>SET_VAR</code></a> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>empty</code></td> </tr></tbody></table>

  Endpoint metric signals are sent to.

* `telemetry.otel_exporter_otlp_metrics_network_namespace`

  <table frame="box" rules="all" summary="Properties for telemetry.otel_exporter_otlp_metrics_network_namespace"><tbody><tr><th>System Variable</th> <td><code><a class="link" href="telemetry-metrics-configuration.html#sysvar_telemetry.otel_exporter_otlp_metrics_network_namespace">telemetry.otel_exporter_otlp_metrics_network_namespace</a></code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th><a class="link" href="optimizer-hints.html#optimizer-hints-set-var" title="Variable-Setting Hint Syntax"><code>SET_VAR</code></a> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>[none]</code></td> </tr></tbody></table>

  (Linux only) Network namespace to use when sending data to the metrics endpoint.

* `telemetry.otel_exporter_otlp_metrics_certificates`

  <table frame="box" rules="all" summary="Properties for telemetry.otel_exporter_otlp_metrics_certificates"><tbody><tr><th>System Variable</th> <td><code><a class="link" href="telemetry-metrics-configuration.html#sysvar_telemetry.otel_exporter_otlp_metrics_certificates">telemetry.otel_exporter_otlp_metrics_certificates</a></code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th><a class="link" href="optimizer-hints.html#optimizer-hints-set-var" title="Variable-Setting Hint Syntax"><code>SET_VAR</code></a> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>[none]</code></td> </tr></tbody></table>

  The trusted certificate to use when verifying a server's TLS credentials.

* `telemetry.otel_exporter_otlp_metrics_client_key`

  <table frame="box" rules="all" summary="Properties for telemetry.otel_exporter_otlp_metrics_client_key"><tbody><tr><th>System Variable</th> <td><code><a class="link" href="telemetry-metrics-configuration.html#sysvar_telemetry.otel_exporter_otlp_metrics_client_key">telemetry.otel_exporter_otlp_metrics_client_key</a></code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th><a class="link" href="optimizer-hints.html#optimizer-hints-set-var" title="Variable-Setting Hint Syntax"><code>SET_VAR</code></a> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>[none]</code></td> </tr></tbody></table>

  Client's private key in PEM format.

* `telemetry.otel_exporter_otlp_metrics_client_certificates`

  <table frame="box" rules="all" summary="Properties for telemetry.otel_exporter_otlp_metrics_client_certificates"><tbody><tr><th>System Variable</th> <td><code><a class="link" href="telemetry-metrics-configuration.html#sysvar_telemetry.otel_exporter_otlp_metrics_client_certificates">telemetry.otel_exporter_otlp_metrics_client_certificates</a></code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th><a class="link" href="optimizer-hints.html#optimizer-hints-set-var" title="Variable-Setting Hint Syntax"><code>SET_VAR</code></a> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>[none]</code></td> </tr></tbody></table>

  Client certificate/chain trust for clients private key in PEM format.

* `telemetry.otel_exporter_otlp_metrics_min_tls`

  <table frame="box" rules="all" summary="Properties for telemetry.otel_exporter_otlp_metrics_min_tls"><tbody><tr><th>System Variable</th> <td><code><a class="link" href="telemetry-metrics-configuration.html#sysvar_telemetry.otel_exporter_otlp_metrics_min_tls">telemetry.otel_exporter_otlp_metrics_min_tls</a></code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th><a class="link" href="optimizer-hints.html#optimizer-hints-set-var" title="Variable-Setting Hint Syntax"><code>SET_VAR</code></a> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>Enumeration</td> </tr><tr><th>Default Value</th> <td><code>[none]</code></td> </tr><tr><th>Valid Values</th> <td><p class="valid-value"><code>[none]</code></p><p class="valid-value"><code>1.2</code></p><p class="valid-value"><code>1.3</code></p></td> </tr></tbody></table>

  Minimum TLS version to use for metrics.

* `telemetry.otel_exporter_otlp_metrics_max_tls`

  <table frame="box" rules="all" summary="Properties for telemetry.otel_exporter_otlp_metrics_max_tls"><tbody><tr><th>System Variable</th> <td><code><a class="link" href="telemetry-metrics-configuration.html#sysvar_telemetry.otel_exporter_otlp_metrics_max_tls">telemetry.otel_exporter_otlp_metrics_max_tls</a></code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th><a class="link" href="optimizer-hints.html#optimizer-hints-set-var" title="Variable-Setting Hint Syntax"><code>SET_VAR</code></a> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>Enumeration</td> </tr><tr><th>Default Value</th> <td><code>[none]</code></td> </tr><tr><th>Valid Values</th> <td><p class="valid-value"><code>[none]</code></p><p class="valid-value"><code>1.2</code></p><p class="valid-value"><code>1.3</code></p></td> </tr></tbody></table>

  Maximum TLS version to use for metrics.

* `telemetry.otel_exporter_otlp_metrics_cipher`

  <table frame="box" rules="all" summary="Properties for telemetry.otel_exporter_otlp_metrics_cipher"><tbody><tr><th>System Variable</th> <td><code><a class="link" href="telemetry-metrics-configuration.html#sysvar_telemetry.otel_exporter_otlp_metrics_cipher">telemetry.otel_exporter_otlp_metrics_cipher</a></code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th><a class="link" href="optimizer-hints.html#optimizer-hints-set-var" title="Variable-Setting Hint Syntax"><code>SET_VAR</code></a> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>[none]</code></td> </tr></tbody></table>

  Current list of TLS 1.2 ciphers to use for metrics. The current default is:

  ```
  ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-ECDSA-AES256-GCM-SHA384:
  ECDHE-RSA-AES128-GCM-SHA256:ECDHE-RSA-AES256-GCM-SHA384:ECDHE-ECDSA-CHACHA20-POLY1305:
  ECDHE-RSA-CHACHA20-POLY1305:ECDHE-ECDSA-AES256-CCM:ECDHE-ECDSA-AES128-CCM:
  DHE-RSA-AES128-GCM-SHA256:DHE-RSA-AES256-GCM-SHA384:DHE-RSA-AES256-CCM:
  DHE-RSA-AES128-CCM:DHE-RSA-CHACHA20-POLY1305
  ```

* `telemetry.otel_exporter_otlp_metrics_cipher_suite`

  <table frame="box" rules="all" summary="Properties for telemetry.otel_exporter_otlp_metrics_protocol"><tbody><tr><th>System Variable</th> <td><code><a class="link" href="telemetry-metrics-configuration.html#sysvar_telemetry.otel_exporter_otlp_metrics_protocol">telemetry.otel_exporter_otlp_metrics_protocol</a></code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th><a class="link" href="optimizer-hints.html#optimizer-hints-set-var" title="Variable-Setting Hint Syntax"><code>SET_VAR</code></a> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>Enumeration</td> </tr><tr><th>Default Value</th> <td><code>http/protobuf</code></td> </tr><tr><th>Valid Values</th> <td><p class="valid-value"><code>http/protobuf</code></p><p class="valid-value"><code>http/json</code></p></td> </tr></tbody></table>

  Current list of TLS 1.3 ciphers to use for metrics. The current default is:

  ```
   TLS_AES_128_GCM_SHA256:TLS_AES_256_GCM_SHA384:TLS_CHACHA20_POLY1305_SHA256:TLS_AES_128_CCM_SHA256
  ```

* `telemetry.otel_exporter_otlp_metrics_headers`

  <table frame="box" rules="all" summary="Properties for telemetry.otel_exporter_otlp_metrics_protocol"><tbody><tr><th>System Variable</th> <td><code><a class="link" href="telemetry-metrics-configuration.html#sysvar_telemetry.otel_exporter_otlp_metrics_protocol">telemetry.otel_exporter_otlp_metrics_protocol</a></code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th><a class="link" href="optimizer-hints.html#optimizer-hints-set-var" title="Variable-Setting Hint Syntax"><code>SET_VAR</code></a> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>Enumeration</td> </tr><tr><th>Default Value</th> <td><code>http/protobuf</code></td> </tr><tr><th>Valid Values</th> <td><p class="valid-value"><code>http/protobuf</code></p><p class="valid-value"><code>http/json</code></p></td> </tr></tbody></table>

  Key-value pairs to be used as headers associated with HTTP requests.

* `telemetry.otel_exporter_otlp_metrics_secret_headers`

  <table frame="box" rules="all" summary="Properties for telemetry.otel_exporter_otlp_metrics_protocol"><tbody><tr><th>System Variable</th> <td><code><a class="link" href="telemetry-metrics-configuration.html#sysvar_telemetry.otel_exporter_otlp_metrics_protocol">telemetry.otel_exporter_otlp_metrics_protocol</a></code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th><a class="link" href="optimizer-hints.html#optimizer-hints-set-var" title="Variable-Setting Hint Syntax"><code>SET_VAR</code></a> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>Enumeration</td> </tr><tr><th>Default Value</th> <td><code>http/protobuf</code></td> </tr><tr><th>Valid Values</th> <td><p class="valid-value"><code>http/protobuf</code></p><p class="valid-value"><code>http/json</code></p></td> </tr></tbody></table>

  Name of a secret, that contains the sensitive data for metrics headers. The data content and format depends on the secret provider implementation provided with system variable `telemetry.secret_provider`.

* `telemetry.otel_exporter_otlp_metrics_compression`

  <table frame="box" rules="all" summary="Properties for telemetry.otel_exporter_otlp_metrics_protocol"><tbody><tr><th>System Variable</th> <td><code><a class="link" href="telemetry-metrics-configuration.html#sysvar_telemetry.otel_exporter_otlp_metrics_protocol">telemetry.otel_exporter_otlp_metrics_protocol</a></code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th><a class="link" href="optimizer-hints.html#optimizer-hints-set-var" title="Variable-Setting Hint Syntax"><code>SET_VAR</code></a> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>Enumeration</td> </tr><tr><th>Default Value</th> <td><code>http/protobuf</code></td> </tr><tr><th>Valid Values</th> <td><p class="valid-value"><code>http/protobuf</code></p><p class="valid-value"><code>http/json</code></p></td> </tr></tbody></table>

  Compression used by exporter

* `telemetry.otel_exporter_otlp_metrics_timeout`

  <table frame="box" rules="all" summary="Properties for telemetry.otel_exporter_otlp_metrics_protocol"><tbody><tr><th>System Variable</th> <td><code><a class="link" href="telemetry-metrics-configuration.html#sysvar_telemetry.otel_exporter_otlp_metrics_protocol">telemetry.otel_exporter_otlp_metrics_protocol</a></code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th><a class="link" href="optimizer-hints.html#optimizer-hints-set-var" title="Variable-Setting Hint Syntax"><code>SET_VAR</code></a> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>Enumeration</td> </tr><tr><th>Default Value</th> <td><code>http/protobuf</code></td> </tr><tr><th>Valid Values</th> <td><p class="valid-value"><code>http/protobuf</code></p><p class="valid-value"><code>http/json</code></p></td> </tr></tbody></table>

  Time in milliseconds the OLTP exporter waits for each batch export.

* `telemetry.metrics_reader_frequency_1`

  <table frame="box" rules="all" summary="Properties for telemetry.otel_exporter_otlp_metrics_protocol"><tbody><tr><th>System Variable</th> <td><code><a class="link" href="telemetry-metrics-configuration.html#sysvar_telemetry.otel_exporter_otlp_metrics_protocol">telemetry.otel_exporter_otlp_metrics_protocol</a></code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th><a class="link" href="optimizer-hints.html#optimizer-hints-set-var" title="Variable-Setting Hint Syntax"><code>SET_VAR</code></a> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>Enumeration</td> </tr><tr><th>Default Value</th> <td><code>http/protobuf</code></td> </tr><tr><th>Valid Values</th> <td><p class="valid-value"><code>http/protobuf</code></p><p class="valid-value"><code>http/json</code></p></td> </tr></tbody></table>

  Mandatory. Defines the interval in seconds (f1) between meter evaluations for meters with a frequency less than or equal to the interval, f1. For example:

  ```
  SELECT * from performance_schema.setup_meters WHERE FREQUENCY <= telemetry.metrics_reader_frequency_1
  ```

* `telemetry.metrics_reader_frequency_2`

  <table frame="box" rules="all" summary="Properties for telemetry.otel_exporter_otlp_metrics_protocol"><tbody><tr><th>System Variable</th> <td><code><a class="link" href="telemetry-metrics-configuration.html#sysvar_telemetry.otel_exporter_otlp_metrics_protocol">telemetry.otel_exporter_otlp_metrics_protocol</a></code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th><a class="link" href="optimizer-hints.html#optimizer-hints-set-var" title="Variable-Setting Hint Syntax"><code>SET_VAR</code></a> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>Enumeration</td> </tr><tr><th>Default Value</th> <td><code>http/protobuf</code></td> </tr><tr><th>Valid Values</th> <td><p class="valid-value"><code>http/protobuf</code></p><p class="valid-value"><code>http/json</code></p></td> </tr></tbody></table>

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

* `telemetry.metrics_reader_frequency_3`

  <table frame="box" rules="all" summary="Properties for telemetry.otel_exporter_otlp_metrics_protocol"><tbody><tr><th>System Variable</th> <td><code><a class="link" href="telemetry-metrics-configuration.html#sysvar_telemetry.otel_exporter_otlp_metrics_protocol">telemetry.otel_exporter_otlp_metrics_protocol</a></code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th><a class="link" href="optimizer-hints.html#optimizer-hints-set-var" title="Variable-Setting Hint Syntax"><code>SET_VAR</code></a> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>Enumeration</td> </tr><tr><th>Default Value</th> <td><code>http/protobuf</code></td> </tr><tr><th>Valid Values</th> <td><p class="valid-value"><code>http/protobuf</code></p><p class="valid-value"><code>http/json</code></p></td> </tr></tbody></table>

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
