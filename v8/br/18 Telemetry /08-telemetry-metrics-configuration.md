### 35.4.1 Configuração de métricas de telemetria

#### Configuração do servidor

* `telemetry.metrics_enabled`

  <table><tbody><tr><th>Variável do sistema</th> <td><code>telemetry.metrics_enabled</code></td> </tr><tr><th>Alcance</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th><code>SET_VAR</code> Hint Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Booleano</td> </tr><tr><th>Valor padrão</th> <td><code>ON</code></td> </tr></tbody></table>

  Controla se as métricas de telemetria são coletadas ou não.
* `telemetry.otel_exporter_otlp_metrics_protocol`

  <table><tbody><tr><th>Variável do sistema</th> <td><code>telemetry.otel_exporter_otlp_metrics_protocol</code></td> </tr><tr><th>Alcance</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th><code>SET_VAR</code> Hint Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Enumeração</td> </tr><tr><th>Valor padrão</th> <td><code>http/protobuf</code></td> </tr><tr><th>Valores válidos</th> <td><p class="valid-value"><code>http/protobuf</code></p><p class="valid-value"><code>http/json</code></p></td> </tr></tbody></table>

  O protocolo de transporte OLTP.

  ::: info Nota

  O MySQL não suporta o protocolo `gprc`.


  :::

<table><tbody><tr><th>Variável do Sistema</th> <td><code>telemetry.otel_exporter_otlp_metrics_certificates</code></td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th><code>SET_VAR</code> Hint Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>String</td> </tr><tr><th>Valor Padrão</th> <td><code>[none]</code></td> </tr></tbody></table>

  O certificado confiável a ser usado ao verificar as credenciais TLS de um servidor.
*  `telemetry.otel_exporter_otlp_metrics_client_key`

  <table><tbody><tr><th>Variável do Sistema</th> <td><code>telemetry.otel_exporter_otlp_metrics_client_key</code></td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th><code>SET_VAR</code> Hint Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>String</td> </tr><tr><th>Valor Padrão</th> <td><code>[none]</code></td> </tr></tbody></table>

  A chave privada do cliente no formato PEM.
*  `telemetry.otel_exporter_otlp_metrics_client_certificates`

  <table><tbody><tr><th>Variável do Sistema</th> <td><code>telemetry.otel_exporter_otlp_metrics_client_certificates</code></td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th><code>SET_VAR</code> Hint Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>String</td> </tr><tr><th>Valor Padrão</th> <td><code>[none]</code></td> </tr></tbody></table>

  Confiança do certificado/cadeia de certificados do cliente para a chave privada do cliente no formato PEM.
*  `telemetry.otel_exporter_otlp_metrics_min_tls`

<table><tbody><tr><th>Variável do Sistema</th> <td><code>telemetry.otel_exporter_otlp_metrics_min_tls</code></td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th><code>SET_VAR</code> Hint Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Enumeração</td> </tr><tr><th>Valor Padrão</th> <td><code>[none]</code></td> </tr><tr><th>Valores Válidos</th> <td><p class="valid-value"><code>[none]</code></p><p class="valid-value"><code>1.2</code></p><p class="valid-value"><code>1.3</code></p></td> </tr></tbody></table>

  Versão mínima de TLS a ser usada para métricas.
*  `telemetry.otel_exporter_otlp_metrics_max_tls`

  <table><tbody><tr><th>Variável do Sistema</th> <td><code>telemetry.otel_exporter_otlp_metrics_max_tls</code></td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th><code>SET_VAR</code> Hint Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Enumeração</td> </tr><tr><th>Valor Padrão</th> <td><code>[none]</code></td> </tr></tbody></table>

  Versão máxima de TLS a ser usada para métricas.
*  `telemetry.otel_exporter_otlp_metrics_cipher`

  <table><tbody><tr><th>Variável do Sistema</th> <td><code>telemetry.otel_exporter_otlp_metrics_cipher</code></td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th><code>SET_VAR</code> Hint Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>String</td> </tr><tr><th>Valor Padrão</th> <td><code>[none]</code></td> </tbody></table>

  Criptografia TLS a ser usada para métricas (TLS 1.2).
*  `telemetry.otel_exporter_otlp_metrics_cipher_suite`

<table><tbody><tr><th>Variável do Sistema</th> <td><code>telemetry.otel_exporter_otlp_metrics_cipher_suite</code></td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th><code>SET_VAR</code> Hint Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>String</td> </tr><tr><th>Valor Padrão</th> <td><code>[none]</code></td> </tr></tbody></table>

  Criptografia TLS a ser usada para métricas (TLS 1.3).
*  `telemetry.otel_exporter_otlp_metrics_headers`

  <table><tbody><tr><th>Variável do Sistema</th> <td><code>telemetry.otel_exporter_otlp_metrics_headers</code></td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th><code>SET_VAR</code> Hint Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>String</td> </tr><tr><th>Valor Padrão</th> <td><code>[none]</code></td> </tr></tbody></table>

  Pares chave-valor a serem usados como cabeçalhos associados a solicitações HTTP.
*  `telemetry.otel_exporter_otlp_metrics_compression`

  <table><tbody><tr><th>Variável do Sistema</th> <td><code>telemetry.otel_exporter_otlp_metrics_compression</code></td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th><code>SET_VAR</code> Hint Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>String</td> </tr><tr><th>Valor Padrão</th> <td><code>none (sem compressão)</code></td> </tr><tr><th>Valores Válidos</th> <td><p class="valid-value"><code>none (sem compressão)</code></p><p class="valid-value"><code>gzip</code></p></td> </tr></tbody></table>

  Compressão usada pelo exportador
*  `telemetry.otel_exporter_otlp_metrics_timeout`

<table><tbody><tr><th>Variável do Sistema</th> <td><code>telemetry.otel_exporter_otlp_metrics_timeout</code></td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th><code>SET_VAR</code> Hint Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor Padrão</th> <td><code>10000</code></td> </tr><tr><th>Unidade</th> <td>milissegundos</td> </tbody></table>

  Tempo em milissegundos que o exportador OLTP espera por cada exportação em lote.
*  `telemetry.metrics_reader_frequency_1`

  <table><tbody><tr><th>Variável do Sistema</th> <td><code>telemetry.metrics_reader_frequency_1</code></td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th><code>SET_VAR</code> Hint Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor Padrão</th> <td><code>10</code></td> </tr><tr><th>Unidade</th> <td>segundos</td> </tbody></table>

  Obrigatório. Define o intervalo em segundos (f1) entre as avaliações dos medidores para medidores com uma frequência igual ou menor que o intervalo, f1. Por exemplo:

  ```
  SELECT * from performance_schema.setup_meters WHERE FREQUENCY <= telemetry.metrics_reader_frequency_1
  ```
*  `telemetry.metrics_reader_frequency_2`

  <table><tbody><tr><th>Variável do Sistema</th> <td><code>telemetry.metrics_reader_frequency_2</code></td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th><code>SET_VAR</code> Hint Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor Padrão</th> <td><code>10</code></td> </tr><tr><th>Unidade</th> <td>segundos</td> </tbody></table>

  Opcional. Define o intervalo em segundos (f2) entre as avaliações dos medidores para medidores com uma frequência maior que o intervalo, f1. Por exemplo, se f1 e f2 são definidos:

  ```
  SELECT * from performance_schema.setup_meters WHERE FREQUENCY <= telemetry.metrics_reader_frequency_1
  ```

  e, a cada f2 segundos:

  ```
  SELECT * from performance_schema.setup_meters
        WHERE FREQUENCY > telemetry.metrics_reader_frequency_1
        AND FREQUENCY <= metrics_reader_frequency_2;
  ```
*  `telemetry.metrics_reader_frequency_3`

<table><tbody><tr><th>Variável do Sistema</th> <td><code>telemetry.metrics_reader_frequency_3</code></td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>Dica de <code>SET_VAR</code> Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor Padrão</th> <td><code>10</code></td> </tr><tr><th>Unidade</th> <td>segundos</td> </tbody></table>

Opcional. Define o intervalo em segundos (f3) entre as avaliações do medidor para medidores com uma frequência maior que o intervalo, f2. Por exemplo, se f1, f2 e f3 são definidos:

```
  SELECT * from performance_schema.setup_meters WHERE FREQUENCY <= telemetry.metrics_reader_frequency_1
  ```

e, a cada f2 segundos:

```
  SELECT * from performance_schema.setup_meters
        WHERE FREQUENCY > telemetry.metrics_reader_frequency_1
        AND FREQUENCY <= metrics_reader_frequency_2;
  ```

e, a cada f3 segundos:

```
  SELECT * from performance_schema.setup_meters WHERE FREQUENCY > telemetry.metrics_reader_frequency_2;
  ```