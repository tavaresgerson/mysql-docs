### 35.5.1 Configurando a Telemetria de Log

Esta seção descreve a configuração para o servidor.

Para informações sobre os registradores configurados, consulte a Seção 29.12.21.1, “A tabela setup_loggers”.

* Variáveis de sistema de configuração do servidor
* Variáveis de status de configuração do servidor
* Linha de comando de configuração do servidor

#### Variáveis de sistema de configuração do servidor

As seguintes variáveis de sistema de configuração da telemetria de logs do servidor são:

* `telemetry.log_enabled`

<table frame="box" rules="all" summary="Propriedades para telemetry.log_enabled"><tr><th>Sistema</th> <td><code><a class="link" href="telemetry-logs-configuration.html#sysvar_telemetry.log_enabled">telemetry.log_enabled</a></code></td></tr><tr><th>Alcance</th> <td>Global</td></tr><tr><th>Dinâmico</th> <td>Sim</td></tr><tr><th><a class="link" href="optimizer-hints.html#optimizer-hints-set-var" title="Sintaxe de dica de configuração de variáveis"><code>SET_VAR</code></a></code> Dicas de sintaxe de configuração da variável</th> <td>Não</td></tr><tr><th>Tipo</th> <td>Booleano</td></tr><tr><th>Valor padrão</th> <td><code>OFF</code></td></tr></table>

Controla se os logs de telemetria são exportados ou não.

* `telemetry.otel_exporter_otlp_logs_protocol`

<table frame="box" rules="all" summary="Propriedades para telemetria.otel_exporter_otlp_logs_protocol">
  <tr>
    <th>Variável do Sistema</th>
    <td><code><a class="link" href="telemetry-logs-configuration.html#sysvar_telemetry.otel_exporter_otlp_logs_protocol">telemetry.otel_exporter_otlp_logs_protocol</a></code></td>
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
    <th>Hinta de <a class="link" href="optimizer-hints.html#optimizer-hints-set-var" title="Sintaxe de dica de configuração de variáveis"><code>SET_VAR</a></code> Aplica-se</th>
    <td>Não</td>
  </tr>
  <tr>
    <th>Tipo</th>
    <td>Enumeração</td>
  </tr>
  <tr>
    <th>Valor Padrão</th>
    <td><code>http/protobuf</code></td>
  </tr>
  <tr>
    <th>Valores Válidos</th>
    <td><p class="valid-value"><code>http/protobuf</code></p><p class="valid-value"><code>http/json</code></p></td>
  </tr>
</table>

  Protocolo de transporte OTLP

* `telemetry.otel_exporter_otlp_logs_endpoint`

<table frame="box" rules="all" summary="Propriedades para telemetria.otel_exporter_otlp_logs_endpoint"><tbody><tr><th>Variável do Sistema</th> <td><code><a class="link" href="telemetry-logs-configuration.html#sysvar_telemetry.otel_exporter_otlp_logs_endpoint">telemetry.otel_exporter_otlp_logs_endpoint</a></code></td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th><a class="link" href="optimizer-hints.html#optimizer-hints-set-var" title="Sintaxe de dica de configuração de variável"><code>SET_VAR</a></code> Dicas Aplicadas</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>String</td> </tr><tr><th>Valor Padrão</th> <td><code>vazio</code></td> </tr></tbody></table>

  URL de destino para onde o exportador envia logs.

* `telemetry.otel_exporter_otlp_logs_network_namespace`

  <table frame="box" rules="all" summary="Propriedades para telemetria.otel_exporter_otlp_logs_network_namespace"><tbody><tr><th>Variável do Sistema</th> <td><code><a class="link" href="telemetry-logs-configuration.html#sysvar_telemetry.otel_exporter_otlp_logs_network_namespace">telemetry.otel_exporter_otlp_logs_network_namespace</a></code></td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th><a class="link" href="optimizer-hints.html#optimizer-hints-set-var" title="Sintaxe de dica de configuração de variável"><code>SET_VAR</a></code> Dicas Aplicadas</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>String</td> </tr><tr><th>Valor Padrão</th> <td><code>[none]</code></td> </tr></tbody></table>

  (Apenas para Linux) Namespace de rede a ser usado ao enviar dados para o endpoint de logs.

* `telemetry.otel_exporter_otlp_logs_certificates`

  <table frame="box" rules="all" summary="Propriedades para telemetry.otel_exporter_otlp_logs_certificates"><tbody><tr><th>Variável do Sistema</th> <td><code><a class="link" href="telemetry-logs-configuration.html#sysvar_telemetry.otel_exporter_otlp_logs_certificates">telemetry.otel_exporter_otlp_logs_certificates</a></code></td> </tr><tr><th>Alcance</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>Hinta de <a class="link" href="optimizer-hints.html#optimizer-hints-set-var" title="Sintaxe de dica de definição de variável"><code>SET_VAR</a></code> Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>String</td> </tr><tr><th>Valor Padrão</th> <td><code></code></td> </tr></tbody></table>

  O certificado confiável a ser usado ao verificar as credenciais TLS de um servidor.

* `telemetry.otel_exporter_otlp_logs_client_key`

  <table frame="box" rules="all" summary="Propriedades para telemetry.otel_exporter_otlp_logs_client_key"><tbody><tr><th>Variável do Sistema</th> <td><code><a class="link" href="telemetry-logs-configuration.html#sysvar_telemetry.otel_exporter_otlp_logs_client_key">telemetry.otel_exporter_otlp_logs_client_key</a></code></td> </tr><tr><th>Alcance</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>Hinta de <a class="link" href="optimizer-hints.html#optimizer-hints-set-var" title="Sintaxe de dica de definição de variável"><code>SET_VAR</a></code> Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>String</td> </tr><tr><th>Valor Padrão</th> <td><code></code></td> </tr></tbody></table>

  A chave privada do cliente no formato PEM.

* `telemetry.otel_exporter_otlp_logs_client_certificates`

  <table frame="box" rules="all" summary="Propriedades para telemetry.otel_exporter_otlp_logs_client_certificates">
    <tr><th>Variável do Sistema</th> <td><code><a class="link" href="telemetry-logs-configuration.html#sysvar_telemetry.otel_exporter_otlp_logs_client_certificates">telemetry.otel_exporter_otlp_logs_client_certificates</a></code></td> </tr>
    <tr><th>Alcance</th> <td>Global</td> </tr>
    <tr><th>Dinâmico</th> <td>Não</td> </tr>
    <tr><th>Hinta de <a class="link" href="optimizer-hints.html#optimizer-hints-set-var" title="Sintaxe de dica de configuração de variável"><code>SET_VAR</a></code></a> Aplica</th> <td>Não</td> </tr>
    <tr><th>Tipo</th> <td>String</td> </tr>
    <tr><th>Valor Padrão</th> <td><code></code></td> </tr>
  </table>

  Certificado/cadeia de confiança do certificado do cliente no formato PEM.

* `telemetry.otel_exporter_otlp_logs_headers`

  <table frame="box" rules="all" summary="Propriedades para telemetry.otel_exporter_otlp_logs_headers">
    <tr><th>Variável do Sistema</th> <td><code><a class="link" href="telemetry-logs-configuration.html#sysvar_telemetry.otel_exporter_otlp_logs_headers">telemetry.otel_exporter_otlp_logs_headers</a></code></td> </tr>
    <tr><th>Alcance</th> <td>Global</td> </tr>
    <tr><th>Dinâmico</th> <td>Não</td> </tr>
    <tr><th>Hinta de <a class="link" href="optimizer-hints.html#optimizer-hints-set-var" title="Sintaxe de dica de configuração de variável"><code>SET_VAR</a></code></a> Aplica</th> <td>Não</td> </tr>
    <tr><th>Tipo</th> <td>String</td> </tr>
    <tr><th>Valor Padrão</th> <td><code></code></td> </tr>
  </table>

Uma lista de cabeçalhos a serem aplicados a todos os logs de saída

* `telemetry.otel_exporter_otlp_logs_secret_headers`

  <table frame="box" rules="all" summary="Propriedades para telemetry.otel_exporter_otlp_logs_secret_headers"><tbody><tr><th>Variável do Sistema</th> <td><code><a class="link" href="telemetry-logs-configuration.html#sysvar_telemetry.otel_exporter_otlp_logs_secret_headers">telemetry.otel_exporter_otlp_logs_secret_headers</a></code></td> </tr><tr><th>Alcance</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>Hinta de <a class="link" href="optimizer-hints.html#optimizer-hints-set-var" title="Sintaxe de dica de configuração de variáveis"><code>SET_VAR</a></code> Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>String</td> </tr><tr><th>Valor Padrão</th> <td><code>[none]</code></td> </tr></tbody></table>

  Nome de um segredo, que contém os dados sensíveis para os cabeçalhos dos logs. O conteúdo e o formato dos dados dependem da implementação do provedor de segredos fornecida com a variável do sistema `telemetry.secret_provider`.

* `telemetry.otel_exporter_otlp_logs_compression`

<table frame="box" rules="all" summary="Propriedades para telemetria.otel_exporter_otlp_logs_compression">
  <tr>
    <th>Variável do Sistema</th>
    <td><code><a class="link" href="telemetry-logs-configuration.html#sysvar_telemetry.otel_exporter_otlp_logs_compression">telemetry.otel_exporter_otlp_logs_compression</a></code></td>
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
    <th>Hinta de <a class="link" href="optimizer-hints.html#optimizer-hints-set-var" title="Sintaxe de dica de configuração de variável"><code>SET_VAR</a></code> Aplica-se</th>
    <td>Não</td>
  </tr>
  <tr>
    <th>Tipo</th>
    <td>String</td>
  </tr>
  <tr>
    <th>Valor Padrão</th>
    <td><code>none (sem compressão)</code></td>
  </tr>
  <tr>
    <th>Valores Válidos</th>
    <td><p class="valid-value"><code>none (sem compressão)</code></p><p class="valid-value"><code>gzip</code></p></td>
  </tr>
</table>

  Compressão usada pelo exportador de logs.

* `telemetry.otel_exporter_otlp_logs_timeout`

<table frame="box" rules="all" summary="Propriedades para telemetria.otel_exporter_otlp_logs_protocol">
  <tr>
    <th>Variável do Sistema</th>
    <td><code><a class="link" href="telemetry-logs-configuration.html#sysvar_telemetry.otel_exporter_otlp_logs_protocol">telemetry.otel_exporter_otlp_logs_protocol</a></code></td>
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
    <th>Hinta de <a class="link" href="optimizer-hints.html#optimizer-hints-set-var" title="Sintaxe de dica de configuração de variável"><code>SET_VAR</a></code> Aplica-se</th>
    <td>Não</td>
  </tr>
  <tr>
    <th>Tipo</th>
    <td>Enumeração</td>
  </tr>
  <tr>
    <th>Valor Padrão</th>
    <td><code>http/protobuf</code></td>
  </tr>
  <tr>
    <th>Valores Válidos</th>
    <td><p class="valid-value"><code>http/protobuf</code></p><p class="valid-value"><code>http/json</code></p></td>
  </tr>
</table>

Tempo em milissegundos que o exportador OTLP espera por cada exportação em lote.

<table frame="box" rules="all" summary="Propriedades para telemetria.otel_exporter_otlp_logs_protocol">
  <tr>
    <th>Variável do Sistema</th>
    <td><code><a class="link" href="telemetry-logs-configuration.html#sysvar_telemetry.otel_exporter_otlp_logs_protocol">telemetry.otel_exporter_otlp_logs_protocol</a></code></td>
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
    <th>Hinta de <a class="link" href="optimizer-hints.html#optimizer-hints-set-var" title="Sintaxe de dica de configuração de variáveis"><code>SET_VAR</a></code> Aplica-se</th>
    <td>Não</td>
  </tr>
  <tr>
    <th>Tipo</th>
    <td>Enumeração</td>
  </tr>
  <tr>
    <th>Valor Padrão</th>
    <td><code>http/protobuf</code></td>
  </tr>
  <tr>
    <th>Valores Válidos</th>
    <td><p class="valid-value"><code>http/protobuf</code></p><p class="valid-value"><code>http/json</code></p></td>
  </tr>
</table>

Intervalo de atraso entre duas exportações consecutivas em milissegundos.

* `telemetry.otel_blrp_max_queue_size`

<table frame="box" rules="all" summary="Propriedades para telemetria.otel_exporter_otlp_logs_protocol">
  <tr>
    <th>Variável do Sistema</th>
    <td><code><a class="link" href="telemetry-logs-configuration.html#sysvar_telemetry.otel_exporter_otlp_logs_protocol">telemetry.otel_exporter_otlp_logs_protocol</a></code></td>
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
    <th>Hinta de <a class="link" href="optimizer-hints.html#optimizer-hints-set-var" title="Sintaxe de dica de configuração de variável"><code>SET_VAR</a></code> Aplica-se</th>
    <td>Não</td>
  </tr>
  <tr>
    <th>Tipo</th>
    <td>Enumeração</td>
  </tr>
  <tr>
    <th>Valor Padrão</th>
    <td><code>http/protobuf</code></td>
  </tr>
  <tr>
    <th>Valores Válidos</th>
    <td><p class="valid-value"><code>http/protobuf</code></p><p class="valid-value"><code>http/json</code></p></td>
  </tr>
</table>

Tamanho máximo da fila.

* `telemetry.otel_blrp_max_export_batch_size`

<table frame="box" rules="all" summary="Propriedades para telemetria.otel_exporter_otlp_logs_protocol">
  <tr>
    <th>Variável do Sistema</th>
    <td><code><a class="link" href="telemetry-logs-configuration.html#sysvar_telemetry.otel_exporter_otlp_logs_protocol">telemetry.otel_exporter_otlp_logs_protocol</a></code></td>
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
    <th>Hinta de <a class="link" href="optimizer-hints.html#optimizer-hints-set-var" title="Sintaxe de dica de configuração de variáveis"><code>SET_VAR</a></code> Aplica-se</th>
    <td>Não</td>
  </tr>
  <tr>
    <th>Tipo</th>
    <td>Enumeração</td>
  </tr>
  <tr>
    <th>Valor Padrão</th>
    <td><code>http/protobuf</code></td>
  </tr>
  <tr>
    <th>Valores Válidos</th>
    <td><p class="valid-value"><code>http/protobuf</code></p><p class="valid-value"><code>http/json</code></p></td>
  </tr>
</table>
3. Tamanho máximo do lote.

<table frame="box" rules="all" summary="Propriedades para telemetria.otel_exporter_otlp_logs_protocol">
  <tr>
    <th>Variável do Sistema</th>
    <td><code><a class="link" href="telemetry-logs-configuration.html#sysvar_telemetry.otel_exporter_otlp_logs_protocol">telemetry.otel_exporter_otlp_logs_protocol</a></code></td>
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
    <th>Hinta de <a class="link" href="optimizer-hints.html#optimizer-hints-set-var" title="Sintaxe de dica de configuração de variáveis"><code>SET_VAR</a></code> Aplica-se</th>
    <td>Não</td>
  </tr>
  <tr>
    <th>Tipo</th>
    <td>Enumeração</td>
  </tr>
  <tr>
    <th>Valor Padrão</th>
    <td><code>http/protobuf</code></td>
  </tr>
  <tr>
    <th>Valores Válidos</th>
    <td><p class="valid-value"><code>http/protobuf</code></p><p class="valid-value"><code>http/json</code></p></td>
  </tr>
</table>
4
  A versão TLS mínima aceita. Se deixar em branco, será usada a TLS 1.2.

<table frame="box" rules="all" summary="Propriedades para telemetria.otel_exporter_otlp_logs_protocol">
  <tr>
    <th>Variável do Sistema</th>
    <td><code><a class="link" href="telemetry-logs-configuration.html#sysvar_telemetry.otel_exporter_otlp_logs_protocol">telemetry.otel_exporter_otlp_logs_protocol</a></code></td>
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
    <th>Hinta de <a class="link" href="optimizer-hints.html#optimizer-hints-set-var" title="Sintaxe de dica de configuração de variável"><code>SET_VAR</a></code> Aplica-se</th>
    <td>Não</td>
  </tr>
  <tr>
    <th>Tipo</th>
    <td>Enumeração</td>
  </tr>
  <tr>
    <th>Valor Padrão</th>
    <td><code>http/protobuf</code></td>
  </tr>
  <tr>
    <th>Valores Válidos</th>
    <td><p class="valid-value"><code>http/protobuf</code></p><p class="valid-value"><code>http/json</code></p></td>
  </tr>
</table>
5. A versão TLS máxima aceita. Se deixar em branco, não há versão TLS máxima.

* `telemetry.otel_exporter_otlp_logs_cipher`

<table frame="box" rules="all" summary="Propriedades para telemetria.otel_exporter_otlp_logs_protocol">
  <tr>
    <th>Variável do Sistema</th>
    <td><code><a class="link" href="telemetry-logs-configuration.html#sysvar_telemetry.otel_exporter_otlp_logs_protocol">telemetry.otel_exporter_otlp_logs_protocol</a></code></td>
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
    <th>Hinta de <a class="link" href="optimizer-hints.html#optimizer-hints-set-var" title="Sintaxe de dica de configuração de variável"><code>SET_VAR</a></code> Aplica-se</th>
    <td>Não</td>
  </tr>
  <tr>
    <th>Tipo</th>
    <td>Enumeração</td>
  </tr>
  <tr>
    <th>Valor Padrão</th>
    <td><code>http/protobuf</code></td>
  </tr>
  <tr>
    <th>Valores Válidos</th>
    <td><p class="valid-value"><code>http/protobuf</code></p><p class="valid-value"><code>http/json</code></p></td>
  </tr>
</table>

Lista atual de criptografias TLS 1.2 a serem usadas para logs. O valor padrão atual é:

```
  ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-ECDSA-AES256-GCM-SHA384:
  ECDHE-RSA-AES128-GCM-SHA256:ECDHE-RSA-AES256-GCM-SHA384:ECDHE-ECDSA-CHACHA20-POLY1305:
  ECDHE-RSA-CHACHA20-POLY1305:ECDHE-ECDSA-AES256-CCM:ECDHE-ECDSA-AES128-CCM:
  DHE-RSA-AES128-GCM-SHA256:DHE-RSA-AES256-GCM-SHA384:DHE-RSA-AES256-CCM:
  DHE-RSA-AES128-CCM:DHE-RSA-CHACHA20-POLY1305
  ```FAN15gOkJm```
   TLS_AES_128_GCM_SHA256:TLS_AES_256_GCM_SHA384:TLS_CHACHA20_POLY1305_SHA256:TLS_AES_128_CCM_SHA256
  ```OQ6rzYy4Oj```
                --performance-schema-logger = 'logger/% = Level:ERROR' --performance-schema-logger = 'logger/foo/% = Level:INFO'
                --performance-schema-logger = 'logger/bar/% = Level:WARNING'
  ```CDhRGz9K9p```
  select * from performance_schema.setup_loggers;
  +------------------------+-------+--------------------+
  | NAME                   | LEVEL | DESCRIPTION        |
  +------------------------+-------+--------------------+
  | logger/error/error_log | info  | MySQL error logger |
  +------------------------+-------+--------------------+
  ```5qw8B9GHx5```
  mysql> UPDATE performance_schema.setup_loggers
         SET LEVEL='WARN'
  ```LoyJsaMSM7```

  Editar este valor requer o reinício do servidor.