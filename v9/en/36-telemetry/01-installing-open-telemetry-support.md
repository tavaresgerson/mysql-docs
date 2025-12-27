## 35.1 Installing OpenTelemetry Support

This section describes the installation of the server and client OpenTelemetry support.

* Installing Server Component
* Installing Client Plugin

### Installing Server Component

To install the server component, run the following command:

```
install component 'file://component_telemetry';
```

To confirm the component is present in your server, run the following query:

```
mysql> select * from mysql.component;
+--------------+--------------------+---------------------------------+
| component_id | component_group_id | component_urn                   |
+--------------+--------------------+---------------------------------+
|            1 |                  1 | file://component_telemetry      |
|            3 |                  3 | file://component_option_tracker |
|            4 |                  4 | file://component_mle            |
+--------------+--------------------+---------------------------------+
```

If `component_telemetry` is present in the `component_urn` column, the component is installed.

The component installation also adds telemetry-specific system variables.

```
mysql> show variables like "%telemetry%";
+----------------------------------------------------------+-----------------------------------+
| Variable_name                                            | Value                             |
+----------------------------------------------------------+-----------------------------------+
| telemetry.log_enabled                                    | ON                                |
| telemetry.metrics_enabled                                | ON                                |
| telemetry.metrics_reader_frequency_1                     | 10                                |
| telemetry.metrics_reader_frequency_2                     | 60                                |
| telemetry.metrics_reader_frequency_3                     | 0                                 |
| telemetry.otel_blrp_max_export_batch_size                | 512                               |
| telemetry.otel_blrp_max_queue_size                       | 2048                              |
| telemetry.otel_blrp_schedule_delay                       | 5000                              |
| telemetry.otel_bsp_max_export_batch_size                 | 512                               |
| telemetry.otel_bsp_max_queue_size                        | 2048                              |
| telemetry.otel_bsp_schedule_delay                        | 5000                              |
| telemetry.otel_exporter_otlp_logs_certificates           |                                   |
| telemetry.otel_exporter_otlp_logs_cipher                 | ECDHE-ECDSA-AES128-GCM-SHA256: ...|
| telemetry.otel_exporter_otlp_logs_cipher_suite           | TLS_AES_128_GCM_SHA256: ...       |
| telemetry.otel_exporter_otlp_logs_client_certificates    |                                   |
| telemetry.otel_exporter_otlp_logs_client_key             |                                   |
| telemetry.otel_exporter_otlp_logs_compression            | none                              |
| telemetry.otel_exporter_otlp_logs_endpoint               | http://localhost:4318/v1/logs     |
| telemetry.otel_exporter_otlp_logs_headers                |                                   |
| telemetry.otel_exporter_otlp_logs_max_tls                | default                           |
| telemetry.otel_exporter_otlp_logs_min_tls                | default                           |
| telemetry.otel_exporter_otlp_logs_protocol               | http/protobuf                     |
| telemetry.otel_exporter_otlp_logs_timeout                | 10000                             |
| telemetry.otel_exporter_otlp_metrics_certificates        |                                   |
| telemetry.otel_exporter_otlp_metrics_cipher              | ECDHE-ECDSA-AES128-GCM-SHA256: ...|
| telemetry.otel_exporter_otlp_metrics_cipher_suite        | TLS_AES_128_GCM_SHA256: ...       |
| telemetry.otel_exporter_otlp_metrics_client_certificates |                                   |
| telemetry.otel_exporter_otlp_metrics_client_key          |                                   |
| telemetry.otel_exporter_otlp_metrics_compression         | none                              |
| telemetry.otel_exporter_otlp_metrics_endpoint            | http://localhost:4318/v1/metrics  |
| telemetry.otel_exporter_otlp_metrics_headers             |                                   |
| telemetry.otel_exporter_otlp_metrics_max_tls             | default                           |
| telemetry.otel_exporter_otlp_metrics_min_tls             | default                           |
| telemetry.otel_exporter_otlp_metrics_protocol            | http/protobuf                     |
| telemetry.otel_exporter_otlp_metrics_timeout             | 10000                             |
| telemetry.otel_exporter_otlp_traces_certificates         |                                   |
| telemetry.otel_exporter_otlp_traces_cipher               | ECDHE-ECDSA-AES128-GCM-SHA256: ...|
| telemetry.otel_exporter_otlp_traces_cipher_suite         | TLS_AES_128_GCM_SHA256: ...       |
| telemetry.otel_exporter_otlp_traces_client_certificates  |                                   |
| telemetry.otel_exporter_otlp_traces_client_key           |                                   |
| telemetry.otel_exporter_otlp_traces_compression          | none                              |
| telemetry.otel_exporter_otlp_traces_endpoint             | http://localhost:4318/v1/traces   |
| telemetry.otel_exporter_otlp_traces_headers              |                                   |
| telemetry.otel_exporter_otlp_traces_max_tls              | default                           |
| telemetry.otel_exporter_otlp_traces_min_tls              | default                           |
| telemetry.otel_exporter_otlp_traces_protocol             | http/protobuf                     |
| telemetry.otel_exporter_otlp_traces_timeout              | 10000                             |
| telemetry.otel_log_level                                 | info                              |
| telemetry.otel_resource_attributes                       |                                   |
| telemetry.query_text_enabled                             | ON                                |
| telemetry.trace_enabled                                  | ON                                |
+----------------------------------------------------------+-----------------------------------|
```

### Installing Client Plugin

The Telemetry plugin for the MySQL client can be enabled with a command line switch, `--telemetry_client` or from a configuration option, `telemetry-client=ON |OFF`, defined in the `[mysql]` section of the configuration file.
