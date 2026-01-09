### 35.3.1 Configuração de Telemetria de Rastreamento

Esta seção descreve a configuração para o servidor e o cliente.

* Configuração do Servidor
* Configuração do Cliente
* Exemplo de Configuração do Cliente

#### Configuração do Servidor

As seguintes são as variáveis de configuração de telemetria de rastreamento do servidor:

* `telemetry.trace_enabled`

  <table frame="box" rules="all" summary="Propriedades para telemetry.trace_enabled"><tbody><tr><th>Variável do Sistema</th> <td><code class="literal"><a class="link" href="telemetry-trace-configuration.html#sysvar_telemetry.trace_enabled">telemetry.trace_enabled</a></code></td> </tr><tr><th>Alcance</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th><a class="link" href="optimizer-hints.html#optimizer-hints-set-var" title="Sintaxe de Hint de Configuração de Variável"><code class="literal">SET_VAR</code></a> Hint Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Booleano</td> </tr><tr><th>Valor Padrão</th> <td><code class="literal">OFF</code></td> </tr></tbody></table>

Controla se as traças de telemetria são coletadas ou não.

* `telemetry.query_text_enabled`

<table frame="box" rules="all" summary="Propriedades para telemetry.query_text_enabled">
  <tr>
    <th>Variável do Sistema</th>
    <td><code class="literal"><a class="link" href="telemetry-trace-configuration.html#sysvar_telemetry.query_text_enabled">telemetry.query_text_enabled</a></code></td>
  </tr>
  <tr>
    <th>Âmbito</th>
    <td>Global</td>
  </tr>
  <tr>
    <th>Dinâmico</th>
    <td>Sim</td>
  </tr>
  <tr>
    <th>Hinta de <a class="link" href="optimizer-hints.html#optimizer-hints-set-var" title="Sintaxe de dica de configuração de variável"><code class="literal">SET_VAR</a></code> Aplica-se</th>
    <td>Não</td>
  </tr>
  <tr>
    <th>Tipo</th>
    <td>Booleano</td>
  </tr>
  <tr>
    <th>Valor Padrão</th>
    <td><code class="literal">ON</code></td>
  </tr>
</table>

<table frame="box" rules="all" summary="Propriedades para telemetria.otel_log_level">
  <tr>
    <th>Variável do Sistema</th>
    <td><code class="literal"><a class="link" href="telemetry-trace-configuration.html#sysvar_telemetry.otel_log_level">telemetry.otel_log_level</a></code></td>
  </tr>
  <tr>
    <th>Âmbito</th>
    <td>Global</td>
  </tr>
  <tr>
    <th>Dinâmico</th>
    <td>Sim</td>
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
    <td><code class="literal">ERROR</code></td>
  </tr>
  <tr>
    <th>Valores Válidos</th>
    <td><p class="valid-value"><code class="literal">SILENT</code></p><p class="valid-value"><code class="literal">INFO</code></p><p class="valid-value"><code class="literal">ERROR</code></p><p class="valid-value"><code class="literal">WARNING</code></p><p class="valid-value"><code class="literal">DEBUG</code></p></td>
  </tr>
</table>

  Controla quais logs do OpenTelemetry são impressos nos logs do servidor

* `telemetry.otel_resource_attributes`

<table frame="box" rules="all" summary="Propriedades para telemetria.otel_resource_attributes">
  <tr>
    <th>Variável do Sistema</th>
    <td><code class="literal"><a class="link" href="telemetry-trace-configuration.html#sysvar_telemetry.otel_resource_attributes">telemetry.otel_resource_attributes</a></code></td>
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
    <td><code class="literal">empty</code></td>
  </tr>
</table>

Veja a variável correspondente do OpenTelemetry OTEL\_RESOURCE\_ATTRIBUTES.

* `telemetry.otel_exporter_otlp_traces_protocol`

<table frame="box" rules="all" summary="Propriedades para telemetria.otel_exporter_otlp_traces_protocol">
  <tr>
    <th>Variável do Sistema</th>
    <td><code class="literal"><a class="link" href="telemetry-trace-configuration.html#sysvar_telemetry.otel_exporter_otlp_traces_protocol">telemetry.otel_exporter_otlp_traces_protocol</a></code></td>
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

  Protocolo de transporte OTLP

* `telemetry.otel_exporter_otlp_traces_endpoint`

<table frame="box" rules="all" summary="Propriedades para a exportação de traços de telemetry.otel_exporter_otlp_traces_endpoint"><tbody><tr><th>Variável do Sistema</th> <td><code class="literal"><a class="link" href="telemetry-trace-configuration.html#sysvar_telemetry.otel_exporter_otlp_traces_endpoint">telemetry.otel_exporter_otlp_traces_endpoint</a></code></td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th><a class="link" href="optimizer-hints.html#optimizer-hints-set-var" title="Sintaxe de dica de configuração de variáveis"><code class="literal">SET_VAR</a></code> Dicas Aplicam-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>String</td> </tr><tr><th>Valor Padrão</th> <td><code class="literal"></code></td> </tr></tbody></table>

  URL de destino para a qual o exportador envia os traços

* `telemetry.otel_exporter_otlp_traces_network_namespace`

  <table frame="box" rules="all" summary="Propriedades para o namespace de rede telemetry.otel_exporter_otlp_traces_network_namespace"><tbody><tr><th>Variável do Sistema</th> <td><code class="literal"><a class="link" href="telemetry-trace-configuration.html#sysvar_telemetry.otel_exporter_otlp_traces_network_namespace">telemetry.otel_exporter_otlp_traces_network_namespace</a></code></td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th><a class="link" href="optimizer-hints.html#optimizer-hints-set-var" title="Sintaxe de dica de configuração de variáveis"><code class="literal">SET_VAR</a></code> Dicas Aplicam-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>String</td> </tr><tr><th>Valor Padrão</th> <td><code class="literal">[none]</code></td> </tr></tbody></table>

  (Apenas para Linux) Namespace de rede a ser usado ao enviar dados para o endpoint de traços.

* `telemetry.otel_exporter_otlp_traces_certificates`

  <table frame="box" rules="all" summary="Propriedades para telemetry.otel_exporter_otlp_traces_certificates"><tbody><tr><th>Variável do Sistema</th> <td><code class="literal"><a class="link" href="telemetry-trace-configuration.html#sysvar_telemetry.otel_exporter_otlp_traces_certificates">telemetry.otel_exporter_otlp_traces_certificates</a></code></td> </tr><tr><th>Alcance</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>Hinta de <a class="link" href="optimizer-hints.html#optimizer-hints-set-var" title="Sintaxe de dica de configuração de variável"><code class="literal">SET_VAR</a></code> Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>String</td> </tr><tr><th>Valor Padrão</th> <td><code class="literal"></code></td> </tr></tbody></table>

  O certificado confiável a ser usado ao verificar as credenciais TLS de um servidor.

* `telemetry.otel_exporter_otlp_traces_client_key`

  <table frame="box" rules="all" summary="Propriedades para telemetry.otel_exporter_otlp_traces_client_key"><tbody><tr><th>Variável do Sistema</th> <td><code class="literal"><a class="link" href="telemetry-trace-configuration.html#sysvar_telemetry.otel_exporter_otlp_traces_client_key">telemetry.otel_exporter_otlp_traces_client_key</a></code></td> </tr><tr><th>Alcance</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>Hinta de <a class="link" href="optimizer-hints.html#optimizer-hints-set-var" title="Sintaxe de dica de configuração de variável"><code class="literal">SET_VAR</a></code> Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>String</td> </tr><tr><th>Valor Padrão</th> <td><code class="literal"></code></td> </tr></tbody></table>

Chave privada do cliente no formato PEM.

* `telemetry.otel_exporter_otlp_traces_client_certificates`

  <table frame="box" rules="all" summary="Propriedades para telemetry.otel_exporter_otlp_traces_client_certificates">
    
    <tbody>
      <tr>
        <th>Variável do Sistema</th>
        <td><code class="literal"><a class="link" href="telemetry-trace-configuration.html#sysvar_telemetry.otel_exporter_otlp_traces_client_certificates">telemetry.otel_exporter_otlp_traces_client_certificates</a></code></td>
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
        <a class="link" href="optimizer-hints.html#optimizer-hints-set-var" title="Sintaxe de dica de configuração de variável"><code class="literal">SET_VAR</a></code> Dicas de Configuração Aplica-se</a></td>
        <td>Não</td>
      </tr>
      <tr>
        <th>Tipo</th>
        <td>String</td>
      </tr>
      <tr>
        <th>Valor Padrão</th>
        <td><code class="literal"></code></td>
      </tr>
    </tbody>
  </table>

  Confiança do certificado/cadeia de certificados do cliente na chave privada no formato PEM.

* `telemetry.otel_exporter_otlp_traces_headers`

  <table frame="box" rules="all" summary="Propriedades para telemetry.query_text_enabled">
    
    <tbody>
      <tr>
        <th>Variável do Sistema</th>
        <td><code class="literal"><a class="link" href="telemetry-trace-configuration.html#sysvar_telemetry.query_text_enabled">telemetry.query_text_enabled</a></code></td>
      </tr>
      <tr>
        <th>Alcance</th>
        <td>Global</td>
      </tr>
      <tr>
        <th>Dinâmico</th>
        <td>Sim</td>
      </tr>
      <tr>
        <a class="link" href="optimizer-hints.html#optimizer-hints-set-var" title="Sintaxe de dica de configuração de variável"><code class="literal">SET_VAR</a></code> Dicas de Configuração Aplica-se</a></td>
        <td>Não</td>
      </tr>
      <tr>
        <th>Tipo</th>
        <td>Booleano</td>
      </tr>
      <tr>
        <th>Valor Padrão</th>
        <td><code class="literal">ON</code></td>
      </tr>
    </tbody>
  </table>0

Veja a variável correspondente do OpenTelemetry OTEL\_EXPORTER\_TRACES\_HEADERS.

* `telemetry.otel_exporter_otlp_traces_secret_headers`

  <table frame="box" rules="all" summary="Propriedades para telemetry.query_text_enabled"><tr><th>Variável do Sistema</th> <td><code class="literal"><a class="link" href="telemetry-trace-configuration.html#sysvar_telemetry.query_text_enabled">telemetry.query_text_enabled</a></code></td> </tr><tr><th>Alcance</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th><a class="link" href="optimizer-hints.html#optimizer-hints-set-var" title="Sintaxe de dica de configuração de variável"><code class="literal">SET_VAR</a></code> Dicas Aplicam-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Booleano</td> </tr><tr><th>Valor Padrão</th> <td><code class="literal">ON</code></td> </tr></table>1

  Nome de um segredo que contém os dados sensíveis para cabeçalhos de rastreamento. O conteúdo e o formato dos dados dependem da implementação do provedor de segredos fornecida com a variável do sistema `telemetry.secret_provider`.

* `telemetry.otel_exporter_otlp_traces_compression`

<table frame="box" rules="all" summary="Propriedades para telemetry.query_text_enabled">
  <tr>
    <th>Variável do Sistema</th>
    <td><code class="literal"><a class="link" href="telemetry-trace-configuration.html#sysvar_telemetry.query_text_enabled">telemetry.query_text_enabled</a></code></td>
  </tr>
  <tr>
    <th>Alcance</th>
    <td>Global</td>
  </tr>
  <tr>
    <th>Dinâmica</th>
    <td>Sim</td>
  </tr>
  <tr>
    <th>Hinta de <a class="link" href="optimizer-hints.html#optimizer-hints-set-var" title="Sintaxe de dica de configuração de variável"><code class="literal">SET_VAR</a></code> Aplica-se</th>
    <td>Não</td>
  </tr>
  <tr>
    <th>Tipo</th>
    <td>Booleano</td>
  </tr>
  <tr>
    <th>Valor Padrão</th>
    <td><code class="literal">ON</code></td>
  </tr>
</table>
2

  Compressão usada pelo exportador

* `telemetry.otel_exporter_otlp_traces_timeout`

  <table frame="box" rules="all" summary="Propriedades para telemetry.query_text_enabled">
    <tr>
      <th>Variável do Sistema</th>
      <td><code class="literal"><a class="link" href="telemetry-trace-configuration.html#sysvar_telemetry.query_text_enabled">telemetry.query_text_enabled</a></code></td>
    </tr>
    <tr>
      <th>Alcance</th>
      <td>Global</td>
    </tr>
    <tr>
      <th>Dinâmica</th>
      <td>Sim</td>
    </tr>
    <tr>
      <th>Hinta de <a class="link" href="optimizer-hints.html#optimizer-hints-set-var" title="Sintaxe de dica de configuração de variável"><code class="literal">SET_VAR</a></code> Aplica-se</th>
      <td>Não</td>
    </tr>
    <tr>
      <th>Tipo</th>
      <td>Booleano</td>
    </tr>
    <tr>
      <th>Valor Padrão</th>
      <td><code class="literal">ON</code></td>
    </tr>
  </table>
3

  Tempo em milissegundos que o exportador OLTP espera por cada exportação em lote.

* `telemetry.otel_bsp_schedule_delay`

Intervalo de atraso entre duas exportações consecutivas em milissegundos

* `telemetry.otel_bsp_max_queue_size`

  <table frame="box" rules="all" summary="Propriedades para telemetry.query_text_enabled"><tbody><tr><th>Variável do Sistema</th> <td><code class="literal"><a class="link" href="telemetry-trace-configuration.html#sysvar_telemetry.query_text_enabled">telemetry.query_text_enabled</a></code></td> </tr><tr><th>Alcance</th> <td>Global</td> </tr><tr><th>Dinâmica</th> <td>Sim</td> </tr><tr><th><a class="link" href="optimizer-hints.html#optimizer-hints-set-var" title="Sintaxe de dica de configuração de variável"><code class="literal">SET_VAR</code></a></code> Dicas Aplicam-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Booleano</td> </tr><tr><th>Valor Padrão</th> <td><code class="literal">ON</code></td> </tr></tbody></table>6

  Tamanho máximo da fila

* `telemetry.otel_bsp_max_export_batch_size`

Tamanho máximo do lote

* `telemetry.otel_exporter_otlp_traces_min_tls`

  <table frame="box" rules="all" summary="Propriedades para telemetry.query_text_enabled"><tbody><tr><th>Variável do sistema</th> <td><code class="literal"><a class="link" href="telemetry-trace-configuration.html#sysvar_telemetry.query_text_enabled">telemetry.query_text_enabled</a></code></td> </tr><tr><th>Alcance</th> <td>Global</td> </tr><tr><th>Dinâmica</th> <td>Sim</td> </tr><tr><th><a class="link" href="optimizer-hints.html#optimizer-hints-set-var" title="Sintaxe de dica de definição de variável"><code class="literal">SET_VAR</code></a></code> Dicas de definição de variável aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Booleano</td> </tr><tr><th>Valor padrão</th> <td><code class="literal">ON</code></td> </tr></tbody></table>8

* `telemetry.otel_exporter_otlp_traces_max_tls`

<table frame="box" rules="all" summary="Propriedades para telemetry.query_text_enabled">
  <tr><th>Variável do Sistema</th> <td><code class="literal"><a class="link" href="telemetry-trace-configuration.html#sysvar_telemetry.query_text_enabled">telemetry.query_text_enabled</a></code></td> </tr>
  <tr><th>Alcance</th> <td>Global</td> </tr>
  <tr><th>Dinâmica</th> <td>Sim</td> </tr>
  <tr><th>Hinta de <a class="link" href="optimizer-hints.html#optimizer-hints-set-var" title="Sintaxe de dica de configuração de variável"><code class="literal">SET_VAR</a></code> Aplica-se</th> <td>Não</td> </tr>
  <tr><th>Tipo</th> <td>Booleano</td> </tr>
  <tr><th>Valor Padrão</th> <td><code class="literal">ON</code></td> </tr>
</table>
8

* `telemetry.otel_exporter_otlp_traces_cipher`

  <table frame="box" rules="all" summary="Propriedades para telemetry.query_text_enabled">
    <tr><th>Variável do Sistema</th> <td><code class="literal"><a class="link" href="telemetry-trace-configuration.html#sysvar_telemetry.query_text_enabled">telemetry.query_text_enabled</a></code></td> </tr>
    <tr><th>Alcance</th> <td>Global</td> </tr>
    <tr><th>Dinâmica</th> <td>Sim</td> </tr>
    <tr><th>Hinta de <a class="link" href="optimizer-hints.html#optimizer-hints-set-var" title="Sintaxe de dica de configuração de variável"><code class="literal">SET_VAR</a></code> Aplica-se</th> <td>Não</td> </tr>
    <tr><th>Tipo</th> <td>Booleano</td> </tr>
    <tr><th>Valor Padrão</th> <td><code class="literal">ON</code></td> </tr>
  </table>
9

Lista atual de criptografadores TLS 1.2 a serem usados para traços. O valor padrão atual é:

```
  ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-ECDSA-AES256-GCM-SHA384:
  ECDHE-RSA-AES128-GCM-SHA256:ECDHE-RSA-AES256-GCM-SHA384:ECDHE-ECDSA-CHACHA20-POLY1305:
  ECDHE-RSA-CHACHA20-POLY1305:ECDHE-ECDSA-AES256-CCM:ECDHE-ECDSA-AES128-CCM:
  DHE-RSA-AES128-GCM-SHA256:DHE-RSA-AES256-GCM-SHA384:DHE-RSA-AES256-CCM:
  DHE-RSA-AES128-CCM:DHE-RSA-CHACHA20-POLY1305
  ```

* `telemetry.otel_exporter_otlp_traces_cipher_suite`

<table frame="box" rules="all" summary="Propriedades para telemetria.otel_log_level">
  <tr>
    <th>Variável do Sistema</th>
    <td><code class="literal"><a class="link" href="telemetry-trace-configuration.html#sysvar_telemetry.otel_log_level">telemetry.otel_log_level</a></code></td>
  </tr>
  <tr>
    <th>Alcance</th>
    <td>Global</td>
  </tr>
  <tr>
    <th>Dinâmica</th>
    <td>Sim</td>
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
    <td><code class="literal">ERROR</code></td>
  </tr>
  <tr>
    <th>Valores Válidos</th>
    <td><p class="valid-value"><code class="literal">SILENT</code></p><p class="valid-value"><code class="literal">INFO</code></p><p class="valid-value"><code class="literal">ERROR</code></p><p class="valid-value"><code class="literal">WARNING</code></p><p class="valid-value"><code class="literal">DEBUG</code></p></td>
  </tr>
</table>

Lista atual de criptografadores TLS 1.3 a serem usados para traços. O padrão atual é:

```
   TLS_AES_128_GCM_SHA256:TLS_AES_256_GCM_SHA384:TLS_CHACHA20_POLY1305_SHA256:TLS_AES_128_CCM_SHA256
  ```

#### Configuração do Cliente

O cliente MySQL lê a configuração de telemetria da seção `[telemetry_client]` do arquivo de configuração. Consulte Instalação do Plugin do Cliente para obter informações sobre a opção `telemetry_client`. As seguintes opções de configuração estão disponíveis:

**Tabela 35.2 Resumo da Opção de Telemetria do Cliente MySQL**

<table frame="box" rules="all" summary="Propriedades para telemetria.otel_log_level">
  <tr>
    <th>Variável do Sistema</th> <td><code class="literal"><a class="link" href="telemetry-trace-configuration.html#sysvar_telemetry.otel_log_level">telemetry.otel_log_level</a></code></td>
  </tr>
  <tr>
    <th>Âmbito</th> <td>Global</td>
  </tr>
  <tr>
    <th>Dinâmico</th> <td>Sim</td>
  </tr>
  <tr>
    <th>Hinta de <a class="link" href="optimizer-hints.html#optimizer-hints-set-var" title="Sintaxe de dica de configuração de variáveis"><code class="literal">SET_VAR</a></code> Aplica-se</th> <td>Não</td>
  </tr>
  <tr>
    <th>Tipo</th> <td>Enumeração</td>
  </tr>
  <tr>
    <th>Valor Padrão</th> <td><code class="literal">ERROR</code></td>
  </tr>
  <tr>
    <th>Valores Válidos</th> <td><p class="valid-value"><code class="literal">SILENT</code></p><p class="valid-value"><code class="literal">INFO</code></p><p class="valid-value"><code class="literal">ERROR</code></p><p class="valid-value"><code class="literal">WARNING</code></p><p class="valid-value"><code class="literal">DEBUG</code></p></td>
  </tr>
</table>1

<table frame="box" rules="all" summary="Propriedades para telemetria.otel_log_level">
  <tr><th>Variável do Sistema</th> <td><code class="literal"><a class="link" href="telemetry-trace-configuration.html#sysvar_telemetry.otel_log_level">telemetry.otel_log_level</a></code></td> </tr>
  <tr><th>Âmbito</th> <td>Global</td> </tr>
  <tr><th>Dinâmico</th> <td>Sim</td> </tr>
  <tr><th>Hinta de <a class="link" href="optimizer-hints.html#optimizer-hints-set-var" title="Sintaxe de dica de configuração de variáveis"><code class="literal">SET_VAR</a></code> Aplica-se</th> <td>Não</td> </tr>
  <tr><th>Tipo</th> <td>Enumeração</td> </tr>
  <tr><th>Valor Padrão</th> <td><code class="literal">ERROR</code></td> </tr>
  <tr><th>Valores Válidos</th> <td><p class="valid-value"><code class="literal">SILENT</code></p><p class="valid-value"><code class="literal">INFO</code></p><p class="valid-value"><code class="literal">ERROR</code></p><p class="valid-value"><code class="literal">WARNING</code></p><p class="valid-value"><code class="literal">DEBUG</code></p></td> </tr>
</table>2

  Controla se as traças de telemetria são coletadas ou não.

<table frame="box" rules="all" summary="Propriedades para telemetria.otel_log_level">
  <tr>
    <th>Variável do Sistema</th>
    <td><code class="literal"><a class="link" href="telemetry-trace-configuration.html#sysvar_telemetry.otel_log_level">telemetry.otel_log_level</a></code></td>
  </tr>
  <tr>
    <th>Âmbito</th>
    <td>Global</td>
  </tr>
  <tr>
    <th>Dinâmico</th>
    <td>Sim</td>
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
    <td><code class="literal">ERROR</code></td>
  </tr>
  <tr>
    <th>Valores Válidos</th>
    <td><p class="valid-value"><code class="literal">SILENT</code></p><p class="valid-value"><code class="literal">INFO</code></p><p class="valid-value"><code class="literal">ERROR</code></p><p class="valid-value"><code class="literal">WARNING</code></p><p class="valid-value"><code class="literal">DEBUG</code></p></td>
  </tr>
</table>
3. Quando ativado, imprime ajuda sobre as opções do cliente de telemetria.

* `otel_log_level`

<table frame="box" rules="all" summary="Propriedades para telemetria.otel_log_level">
  <tr><th>Variável do Sistema</th> <td><code class="literal"><a class="link" href="telemetry-trace-configuration.html#sysvar_otel_log_level">telemetry.otel_log_level</a></code></td> </tr>
  <tr><th>Âmbito</th> <td>Global</td> </tr>
  <tr><th>Dinâmico</th> <td>Sim</td> </tr>
  <tr><th>Hinta de <a class="link" href="optimizer-hints.html#optimizer-hints-set-var" title="Sintaxe de dica de configuração de variáveis"><code class="literal">SET_VAR</a></code> Aplica-se</th> <td>Não</td> </tr>
  <tr><th>Tipo</th> <td>Enumeração</td> </tr>
  <tr><th>Valor Padrão</th> <td><code class="literal">ERROR</code></td> </tr>
  <tr><th>Valores Válidos</th> <td><p class="valid-value"><code class="literal">SILENT</code></p><p class="valid-value"><code class="literal">INFO</code></p><p class="valid-value"><code class="literal">ERROR</code></p><p class="valid-value"><code class="literal">WARNING</code></p><p class="valid-value"><code class="literal">DEBUG</code></p></td> </tr>
</table>4

  Controla quais logs do OpenTelemetry são impressos nos logs do servidor

<table frame="box" rules="all" summary="Propriedades para telemetria.otel_log_level">
  <tr><th>Variável do Sistema</th> <td><code class="literal"><a class="link" href="telemetry-trace-configuration.html#sysvar_otel_log_level">telemetry.otel_log_level</a></code></td> </tr>
  <tr><th>Âmbito</th> <td>Global</td> </tr>
  <tr><th>Dinâmica</th> <td>Sim</td> </tr>
  <tr><th>Hinta de <a class="link" href="optimizer-hints.html#optimizer-hints-set-var" title="Sintaxe de dica de configuração de variáveis"><code class="literal">SET_VAR</a></code> Aplica-se</th> <td>Não</td> </tr>
  <tr><th>Tipo</th> <td>Enumeração</td> </tr>
  <tr><th>Valor Padrão</th> <td><code class="literal">ERROR</code></td> </tr>
  <tr><th>Valores Válidos</th> <td><p class="valid-value"><code class="literal">SILENT</code></p><p class="valid-value"><code class="literal">INFO</code></p><p class="valid-value"><code class="literal">ERROR</code></p><p class="valid-value"><code class="literal">WARNING</code></p><p class="valid-value"><code class="literal">DEBUG</code></p></td> </tr>
</table>
5. Veja a variável correspondente do OpenTelemetry OTEL\_RESOURCE\_ATTRIBUTES.

* `otel_exporter_otlp_traces_protocol`

<table frame="box" rules="all" summary="Propriedades para telemetria.otel_log_level">
  <tr>
    <th>Variável do Sistema</th>
    <td><code class="literal"><a class="link" href="telemetry-trace-configuration.html#sysvar_otel_log_level">otel_exporter_otlp_traces_endpoint</a></code></td>
  </tr>
  <tr>
    <th>Alcance</th>
    <td>Global</td>
  </tr>
  <tr>
    <th>Dinâmico</th>
    <td>Sim</td>
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
    <td><code class="literal">ERROR</code></td>
  </tr>
  <tr>
    <th>Valores Válidos</th>
    <td><p class="valid-value"><code class="literal">SILENT</code></p><p class="valid-value"><code class="literal">INFO</code></p><p class="valid-value"><code class="literal">ERROR</code></p><p class="valid-value"><code class="literal">WARNING</code></p><p class="valid-value"><code class="literal">DEBUG</code></p></td>
  </tr>
</table>

  Protocolo de transporte OTLP

* `otel_exporter_otlp_traces_endpoint`

<table frame="box" rules="all" summary="Propriedades para telemetria.otel_log_level">
  <tr>
    <th>Variável do Sistema</th>
    <td><code class="literal"><a class="link" href="telemetry-trace-configuration.html#sysvar_telemetry.otel_log_level">telemetry.otel_log_level</a></code></td>
  </tr>
  <tr>
    <th>Âmbito</th>
    <td>Global</td>
  </tr>
  <tr>
    <th>Dinâmico</th>
    <td>Sim</td>
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
    <td><code class="literal">ERROR</code></td>
  </tr>
  <tr>
    <th>Valores Válidos</th>
    <td><p class="valid-value"><code class="literal">SILENT</code></p><p class="valid-value"><code class="literal">INFO</code></p><p class="valid-value"><code class="literal">ERROR</code></p><p class="valid-value"><code class="literal">WARNING</code></p><p class="valid-value"><code class="literal">DEBUG</code></p></td>
  </tr>
</table>
7. URL de destino para o qual o exportador envia as traças

* `otel_exporter_otlp_traces_certificates`

<table frame="box" rules="all" summary="Propriedades para telemetria.otel_log_level">
  <tr>
    <th>Variável do Sistema</th>
    <td><code class="literal"><a class="link" href="telemetry-trace-configuration.html#sysvar_otel_log_level">telemetry.otel_log_level</a></code></td>
  </tr>
  <tr>
    <th>Âmbito</th>
    <td>Global</td>
  </tr>
  <tr>
    <th>Dinâmico</th>
    <td>Sim</td>
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
    <td><code class="literal">ERROR</code></td>
  </tr>
  <tr>
    <th>Valores Válidos</th>
    <td><p class="valid-value"><code class="literal">SILENT</code></p><p class="valid-value"><code class="literal">INFO</code></p><p class="valid-value"><code class="literal">ERROR</code></p><p class="valid-value"><code class="literal">WARNING</code></p><p class="valid-value"><code class="literal">DEBUG</code></p></td>
  </tr>
</table>8

  O certificado confiável a ser usado ao verificar as credenciais TLS de um servidor.

* `otel_exporter_otlp_traces_client_key`

<table frame="box" rules="all" summary="Propriedades para telemetria.otel_log_level">
  <tr><th>Variável do Sistema</th> <td><code class="literal"><a class="link" href="telemetry-trace-configuration.html#sysvar_otel_log_level">telemetry.otel_log_level</a></code></td> </tr>
  <tr><th>Âmbito</th> <td>Global</td> </tr>
  <tr><th>Dinâmico</th> <td>Sim</td> </tr>
  <tr><th>Hinta de <a class="link" href="optimizer-hints.html#optimizer-hints-set-var" title="Sintaxe de dica de configuração de variáveis"><code class="literal">SET_VAR</a></code> Aplica-se</th> <td>Não</td> </tr>
  <tr><th>Tipo</th> <td>Enumeração</td> </tr>
  <tr><th>Valor Padrão</th> <td><code class="literal">ERROR</code></td> </tr>
  <tr><th>Valores Válidos</th> <td><p class="valid-value"><code class="literal">SILENT</code></p><p class="valid-value"><code class="literal">INFO</code></p><p class="valid-value"><code class="literal">ERROR</code></p><p class="valid-value"><code class="literal">WARNING</code></p><p class="valid-value"><code class="literal">DEBUG</code></p></td> </tr>
</table>
9
Chave privada do cliente no formato PEM.

* `otel_exporter_otlp_traces_client_certificates`

<table frame="box" rules="all" summary="Propriedades para telemetria.otel_resource_attributes">
  <tr>
    <th>Variável do sistema</th>
    <td><code class="literal"><a class="link" href="telemetry-trace-configuration.html#sysvar_telemetry.otel_resource_attributes">telemetry.otel_resource_attributes</a></code></td>
  </tr>
  <tr>
    <th>Alcance</th>
    <td>Global</td>
  </tr>
  <tr>
    <th>Dinâmica</th>
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
    <th>Valor padrão</th>
    <td><code class="literal">empty</code></td>
  </tr>
</table>
0

  Certificado/cadeia de confiança do certificado do cliente no formato PEM.

* `otel_exporter_otlp_traces_headers`

  <table frame="box" rules="all" summary="Propriedades para telemetria.otel_resource_attributes">
    <tr>
      <th>Variável do sistema</th>
      <td><code class="literal"><a class="link" href="telemetry-trace-configuration.html#sysvar_telemetry.otel_resource_attributes">telemetry.otel_resource_attributes</a></code></td>
    </tr>
    <tr>
      <th>Alcance</th>
      <td>Global</td>
    </tr>
    <tr>
      <th>Dinâmica</th>
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
      <th>Valor padrão</th>
      <td><code class="literal">empty</code></td>
    </tr>
  </table>
1

  Veja a variável correspondente OpenTelemetry OTEL\_EXPORTER\_TRACES\_HEADERS.

* `otel_exporter_otlp_traces_compression`

<table frame="box" rules="all" summary="Propriedades para telemetria.otel_resource_attributes">
  <tr>
    <th>Variável do Sistema</th> <td><code class="literal"><a class="link" href="telemetry-trace-configuration.html#sysvar_telemetry.otel_resource_attributes">telemetry.otel_resource_attributes</a></code></td>
  </tr>
  <tr>
    <th>Alcance</th> <td>Global</td>
  </tr>
  <tr>
    <th>Dinâmica</th> <td>Não</td>
  </tr>
  <tr>
    <th>Hinta de <a class="link" href="optimizer-hints.html#optimizer-hints-set-var" title="Sintaxe de dica de configuração de variável"><code class="literal">SET_VAR</a></code> Aplica-se</th> <td>Não</td>
  </tr>
  <tr>
    <th>Tipo</th> <td>String</td>
  </tr>
  <tr>
    <th>Valor Padrão</th> <td><code class="literal">empty</code></td>
  </tr>
</table>
2

  Compressão usada pelo exportador

* `otel_exporter_otlp_traces_timeout`

  <table frame="box" rules="all" summary="Propriedades para telemetria.otel_resource_attributes">
    <tr>
      <th>Variável do Sistema</th> <td><code class="literal"><a class="link" href="telemetry-trace-configuration.html#sysvar_telemetry.otel_resource_attributes">telemetry.otel_resource_attributes</a></code></td>
    </tr>
    <tr>
      <th>Alcance</th> <td>Global</td>
    </tr>
    <tr>
      <th>Dinâmica</th> <td>Não</td>
    </tr>
    <tr>
      <th>Hinta de <a class="link" href="optimizer-hints.html#optimizer-hints-set-var" title="Sintaxe de dica de configuração de variável"><code class="literal">SET_VAR</a></code> Aplica-se</th> <td>Não</td>
    </tr>
    <tr>
      <th>Tipo</th> <td>String</td>
    </tr>
    <tr>
      <th>Valor Padrão</th> <td><code class="literal">empty</code></td>
    </tr>
  </table>
3

  Tempo de espera do exportador OLTP para cada exportação em lote

* `otel_bsp_schedule_delay`

Intervalo de atraso entre duas exportações consecutivas em milissegundos

* `otel_bsp_max_queue_size`

  <table frame="box" rules="all" summary="Propriedades para telemetria.otel_resource_attributes"><tbody><tr><th>Variável do sistema</th> <td><code class="literal"><a class="link" href="telemetry-trace-configuration.html#sysvar_telemetry.otel_resource_attributes">telemetry.otel_resource_attributes</a></code></td> </tr><tr><th>Alcance</th> <td>Global</td> </tr><tr><th>Dinâmica</th> <td>Não</td> </tr><tr><th>Hinta de <a class="link" href="optimizer-hints.html#optimizer-hints-set-var" title="Sintaxe de dica de configuração de variável"><code class="literal">SET_VAR</a></code></a> Aplica</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>String</td> </tr><tr><th>Valor padrão</th> <td><code class="literal">empty</code></td> </tr></tbody></table>6

  Tamanho máximo da fila

* `otel_bsp_max_export_batch_size`

<table frame="box" rules="all" summary="Propriedades para telemetria.otel_resource_attributes">
  <tr>
    <th>Variável do Sistema</th>
    <td><code class="literal"><a class="link" href="telemetry-trace-configuration.html#sysvar_telemetry.otel_resource_attributes">telemetry.otel_resource_attributes</a></code></td>
  </tr>
  <tr>
    <th>Alcance</th>
    <td>Global</td>
  </tr>
  <tr>
    <th>Dinâmica</th>
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
    <td><code class="literal">empty</code></td>
  </tr>
</table>

6. Tamanho máximo do lote

#### Exemplo de Configuração do Cliente

O seguinte é um exemplo de arquivo de configuração `my.cnf` que contém a configuração do plugin de Telemetria do Cliente:

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

Se `telemetry-client = ON` estiver definido no arquivo de configuração, você não precisa especificar `--telemetry-client` ao iniciar o cliente.