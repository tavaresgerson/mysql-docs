### 35.3.1 Configuração de Telemetria de Rastreamento

Esta seção descreve a configuração para o servidor e o cliente.

*  Configuração do Servidor
*  Configuração do Cliente
*  Exemplo de Configuração do Cliente

#### Configuração do Servidor

As seguintes são as variáveis de configuração de telemetria de rastreamento do servidor:

*  `telemetry.trace_enabled`

  <table><tbody><tr><th>Variável do Sistema</th> <td><code>telemetry.trace_enabled</code></td> </tr><tr><th>Alcance</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th><code>SET_VAR</code> Hint Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Booleano</td> </tr><tr><th>Valor Padrão</th> <td><code>ON</code></td> </tr></tbody></table>

  Controla se as traças de telemetria são coletadas ou não.
*  `telemetry.query_text_enabled`

  <table><tbody><tr><th>Variável do Sistema</th> <td><code>telemetry.query_text_enabled</code></td> </tr><tr><th>Alcance</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th><code>SET_VAR</code> Hint Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Booleano</td> </tr><tr><th>Valor Padrão</th> <td><code>ON</code></td> </tr></tbody></table>

  Controla se o texto da consulta SQL é incluído na traça
*  `telemetry.otel_log_level`

  <table><tbody><tr><th>Variável do Sistema</th> <td><code>telemetry.otel_log_level</code></td> </tr><tr><th>Alcance</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th><code>SET_VAR</code> Hint Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Enumeração</td> </tr><tr><th>Valor Padrão</th> <td><code>ERROR</code></td> </tr><tr><th>Valores Válidos</th> <td><p class="valid-value"><code>SILENT</code></p><p class="valid-value"><code>INFO</code></p><p class="valid-value"><code>ERROR</code></p><p class="valid-value"><code>WARNING</code></p><p class="valid-value"><code>DEBUG</code></p></td> </tr></tbody></table>

  Controla quais logs do OpenTelemetry são impressos nos logs do servidor
*  `telemetry.otel_resource_attributes`
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
```dcJpj8vjuN```

Se `telemetry-client = ON` estiver definido no arquivo de configuração, você não precisa especificar `--telemetry-client` ao iniciar o cliente.