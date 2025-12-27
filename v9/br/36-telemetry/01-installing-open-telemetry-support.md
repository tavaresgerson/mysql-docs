## 35.1 Instalação do Suporte OpenTelemetry

Esta seção descreve a instalação do suporte OpenTelemetry do servidor e do cliente.

* Instalação do Componente do Servidor
* Instalação do Plugin do Cliente

### Instalação do Componente do Servidor

Para instalar o componente do servidor, execute o seguinte comando:

```
install component 'file://component_telemetry';
```

Para confirmar se o componente está presente no seu servidor, execute a seguinte consulta:

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

Se `component_telemetry` estiver presente na coluna `component_urn`, o componente está instalado.

A instalação do componente também adiciona variáveis de sistema específicas de telemetria.

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

### Instalação do Plugin do Cliente

O plugin de Telemetria para o cliente MySQL pode ser habilitado com um interruptor de linha de comando, `--telemetry_client` ou a partir de uma opção de configuração, `telemetry-client=ON |OFF`, definida na seção `[mysql]` do arquivo de configuração.