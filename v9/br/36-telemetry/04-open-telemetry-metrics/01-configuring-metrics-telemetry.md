### 35.4.1 Configuração de Telemetria de Métricas

Esta seção lista as variáveis de sistema usadas para configurar a telemetria de métricas.

#### Configuração do Servidor

* `telemetry.metrics_enabled`

  <table frame="box" rules="all" summary="Propriedades para telemetry.metrics_enabled"><tbody><tr><th>Variável de Sistema</th> <td><code class="literal"><a class="link" href="telemetry-metrics-configuration.html#sysvar_telemetry.metrics_enabled">telemetry.metrics_enabled</a></code></td> </tr><tr><th>Alcance</th> <td>Global</td> </tr><tr><th>Dinâmica</th> <td>Não</td> </tr><tr><th><a class="link" href="optimizer-hints.html#optimizer-hints-set-var" title="Sintaxe de Hint de Configuração de Variável"><code class="literal">SET_VAR</code></a> Hint Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Booleano</td> </tr><tr><th>Valor Padrão</th> <td><code class="literal">OFF</code></td> </tr></tbody></table>

  Controla se as métricas de telemetria são coletadas ou não.

* `telemetry.otel_exporter_otlp_metrics_protocol`

<table frame="box" rules="all" summary="Propriedades para telemetria.otel_exporter_otlp_metrics_protocol">
  <tr>
    <th>Variável do Sistema</th>
    <td><code class="literal"><a class="link" href="telemetry-metrics-configuration.html#sysvar_telemetry.otel_exporter_otlp_metrics_protocol">telemetry.otel_exporter_otlp_metrics_protocol</a></code></td>
  </tr>
  <tr>
    <th>Âmbito</th>
    <td>Global</td>
  </tr>
  <tr>
    <th>Dinâmico</th>
    <td>Não</td>
  </tr>
  <tr>
    <th>Hinta de <a class="link" href="optimizer-hints.html#optimizer-hints-set-var" title="Sintaxe de dica de configuração de variável"><code class="literal">SET_VAR</a></code> Aplica-se</th>
    <td>Não</td>
  </tr>
  <tr>
    <th>Tipo</th>
    <td>Enumeração</td>
  </tr>
  <tr>
    <th>Valor Padrão</th>
    <td><code class="literal">http/protobuf</code></td>
  </tr>
  <tr>
    <th>Valores Válidos</th>
    <td><p class="valid-value"><code class="literal">http/protobuf</code></p><p class="valid-value"><code class="literal">http/json</code></p></td>
  </tr>
</table>

  O protocolo de transporte OLTP.

  Nota

  O MySQL não suporta o protocolo `gprc`.

Indicam para onde são enviados os sinais de métricas de endpoint.

* `telemetry.otel_exporter_otlp_metrics_network_namespace`

  <table frame="box" rules="all" summary="Propriedades para telemetry.otel_exporter_otlp_metrics_network_namespace"><tbody><tr><th>Variável do Sistema</th> <td><code class="literal"><a class="link" href="telemetry-metrics-configuration.html#sysvar_telemetry.otel_exporter_otlp_metrics_network_namespace">telemetry.otel_exporter_otlp_metrics_network_namespace</a></code></td> </tr><tr><th>Alcance</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>Hinta de <a class="link" href="optimizer-hints.html#optimizer-hints-set-var" title="Sintaxe de dica de definição de variável"><code class="literal">SET_VAR</a></code> Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>String</td> </tr><tr><th>Valor Padrão</th> <td><code class="literal">[nenhum]</code></td> </tr></tbody></table>

(Apenas Linux) Espaço de rede a ser usado ao enviar dados para o ponto de extremidade de métricas.

* `telemetry.otel_exporter_otlp_metrics_certificates`

  <table frame="box" rules="all" summary="Propriedades para telemetry.otel_exporter_otlp_metrics_certificates"><tbody><tr><th>Variável do Sistema</th> <td><code class="literal"><a class="link" href="telemetry-metrics-configuration.html#sysvar_telemetry.otel_exporter_otlp_metrics_certificates">telemetry.otel_exporter_otlp_metrics_certificates</a></code></td> </tr><tr><th>Alcance</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>Hinta de <a class="link" href="optimizer-hints.html#optimizer-hints-set-var" title="Sintaxe de dica de configuração de variáveis"><code class="literal">SET_VAR</a></code> Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>String</td> </tr><tr><th>Valor Padrão</th> <td><code class="literal">[none]</code></td> </tr></tbody></table>

O certificado confiável a ser usado ao verificar as credenciais TLS de um servidor.

* `telemetry.otel_exporter_otlp_metrics_client_key`

Chave privada do cliente no formato PEM.

* `telemetry.otel_exporter_otlp_metrics_client_certificates`

  <table frame="box" rules="all" summary="Propriedades para telemetry.otel_exporter_otlp_metrics_client_certificates"><tbody><tr><th>Variável do sistema</th> <td><code class="literal"><a class="link" href="telemetry-metrics-configuration.html#sysvar_telemetry.otel_exporter_otlp_metrics_client_certificates">telemetry.otel_exporter_otlp_metrics_client_certificates</a></code></td> </tr><tr><th>Alcance</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>Hinta de <a class="link" href="optimizer-hints.html#optimizer-hints-set-var" title="Sintaxe de dica de configuração de variável"><code class="literal">SET_VAR</a></code></a> Aplica</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>String</td> </tr><tr><th>Valor padrão</th> <td><code class="literal">[none]</code></td> </tr></tbody></table>

Certificado do cliente/confiança da cadeia para a chave privada do cliente no formato PEM.

* `telemetry.otel_exporter_otlp_metrics_min_tls`

  <table frame="box" rules="all" summary="Propriedades para telemetry.otel_exporter_otlp_metrics_min_tls"><tbody><tr><th>Variável do Sistema</th> <td><code class="literal"><a class="link" href="telemetry-metrics-configuration.html#sysvar_telemetry.otel_exporter_otlp_metrics_min_tls">telemetry.otel_exporter_otlp_metrics_min_tls</a></code></td> </tr><tr><th>Alcance</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th><a class="link" href="optimizer-hints.html#optimizer-hints-set-var" title="Sinal de sintaxe de configuração de variável"><code class="literal">SET_VAR</code></a></code> Sinal Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Enumeração</td> </tr><tr><th>Valor Padrão</th> <td><code class="literal">[none]</code></td> </tr><tr><th>Valores Válidos</th> <td><p class="valid-value"><code class="literal">[none]</code></p><p class="valid-value"><code class="literal">1.2</code></p><p class="valid-value"><code class="literal">1.3</code></p></td> </tr></tbody></table>

  Versão mínima de TLS a ser usada para métricas.

* `telemetry.otel_exporter_otlp_metrics_max_tls`

<table frame="box" rules="all" summary="Propriedades para telemetria.otel_exporter_otlp_metrics_max_tls">
  <tr>
    <th>Variável do Sistema</th>
    <td><code class="literal"><a class="link" href="telemetry-metrics-configuration.html#sysvar_telemetry.otel_exporter_otlp_metrics_max_tls">telemetry.otel_exporter_otlp_metrics_max_tls</a></code></td>
  </tr>
  <tr>
    <th>Alcance</th>
    <td>Global</td>
  </tr>
  <tr>
    <th>Dinâmico</th>
    <td>Não</td>
  </tr>
  <tr>
    <th>Hinta de <a class="link" href="optimizer-hints.html#optimizer-hints-set-var" title="Sintaxe de dica de configuração de variável"><code class="literal">SET_VAR</a></code> Aplica-se</th>
    <td>Não</td>
  </tr>
  <tr>
    <th>Tipo</th>
    <td>Enumeração</td>
  </tr>
  <tr>
    <th>Valor Padrão</th>
    <td><code class="literal">[none]</code></td>
  </tr>
  <tr>
    <th>Valores Válidos</th>
    <td><p class="valid-value"><code class="literal">[none]</code></p><p class="valid-value"><code class="literal">1.2</code></p><p class="valid-value"><code class="literal">1.3</code></p></td>
  </tr>
</table>

* `telemetry.otel_exporter_otlp_metrics_cipher`
* `telemetry.otel_exporter_otlp_metrics_max_tls`

<table frame="box" rules="all" summary="Propriedades para telemetria.otel_exporter_otlp_metrics_cipher">
  <tr>
    <th>Variável do Sistema</th>
    <td><code class="literal"><a class="link" href="telemetry-metrics-configuration.html#sysvar_telemetry.otel_exporter_otlp_metrics_cipher">telemetry.otel_exporter_otlp_metrics_cipher</a></code></td>
  </tr>
  <tr>
    <th>Âmbito</th>
    <td>Global</td>
  </tr>
  <tr>
    <th>Dinâmico</th>
    <td>Não</td>
  </tr>
  <tr>
    <th>Hinta de <a class="link" href="optimizer-hints.html#optimizer-hints-set-var" title="Sintaxe de dica de configuração de variável"><code class="literal">SET_VAR</a></code> Aplica-se</th>
    <td>Não</td>
  </tr>
  <tr>
    <th>Tipo</th>
    <td>String</td>
  </tr>
  <tr>
    <th>Valor Padrão</th>
    <td><code class="literal">[none]</code></td>
  </tr>
</table>

Lista atual de cifras TLS 1.2 a serem usadas para métricas. O valor padrão atual é:

```
  ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-ECDSA-AES256-GCM-SHA384:
  ECDHE-RSA-AES128-GCM-SHA256:ECDHE-RSA-AES256-GCM-SHA384:ECDHE-ECDSA-CHACHA20-POLY1305:
  ECDHE-RSA-CHACHA20-POLY1305:ECDHE-ECDSA-AES256-CCM:ECDHE-ECDSA-AES128-CCM:
  DHE-RSA-AES128-GCM-SHA256:DHE-RSA-AES256-GCM-SHA384:DHE-RSA-AES256-CCM:
  DHE-RSA-AES128-CCM:DHE-RSA-CHACHA20-POLY1305
  ```vk9sbLij9x```
   TLS_AES_128_GCM_SHA256:TLS_AES_256_GCM_SHA384:TLS_CHACHA20_POLY1305_SHA256:TLS_AES_128_CCM_SHA256
  ```LaKlHNV29j```
  SELECT * from performance_schema.setup_meters WHERE FREQUENCY <= telemetry.metrics_reader_frequency_1
  ```XwMkiXeoVA```
  SELECT * from performance_schema.setup_meters WHERE FREQUENCY <= telemetry.metrics_reader_frequency_1
  ```h51tG6NwXv```
  SELECT * from performance_schema.setup_meters
        WHERE FREQUENCY > telemetry.metrics_reader_frequency_1
        AND FREQUENCY <= metrics_reader_frequency_2;
  ```ROmyGwaRiT```
  SELECT * from performance_schema.setup_meters WHERE FREQUENCY <= telemetry.metrics_reader_frequency_1
  ```Xy90dUGC1b```
  SELECT * from performance_schema.setup_meters
        WHERE FREQUENCY > telemetry.metrics_reader_frequency_1
        AND FREQUENCY <= metrics_reader_frequency_2;
  ```J0SxGC0KeB```