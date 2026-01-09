#### 7.5.8.2 Componentes com Suporte ao Rastreador de Opções

Para serem exibidos nas tabelas `mysql_option.option_usage` e `mysql_option`, um componente ou plugin deve ser escrito e compilado com suporte ao Rastreador de Opções. Os componentes e plugins que oferecem esse suporte no MySQL 9.5 incluem os mostrados na tabela a seguir:

**Tabela 7.8 Componentes e Plugins com Suporte ao Rastreador de Opções**

<table> border="1" class="table" summary="Esta tabela mostra as opções (componentes e plugins) do MySQL que suportam o componente Option Tracker no MySQL 9.5. Para cada opção, a tabela mostra o nome, o nome do contêiner, quando a opção é habilitada e quais eventos ou ações aumentam o contador associado.">
<colgroup><col/><col/><col/><col/></colgroup>
<thead><tr><th>Nome</th><th>Contêiner</th><th>Habilitado</th><th>Aumentado</th></tr></thead>
<tbody><tr><td>Plugin de chave AWS</td><td><code>keyring_aws</code> plugin</td><td>sempre</td><td>Quando qualquer uma das funções gerais do componente de chave (ver <a class="xref" href="keyring-functions-general-purpose.html" title="8.4.5.15 Funções gerais de chave de gerenciamento de chaves">8.4.5.15, “Funções gerais de chave de gerenciamento de chaves”</a>) são chamadas usando este componente</td></tr>
<tr><td>Registro binário</td><td><code>mysql_server</code></td><td>Sempre</td><td>A cada 10 minutos quando o registro binário está habilitado (ou seja, quando <a class="link" href="replication-options-binary-log.html#option_mysqld_log-bin"><code>--log-bin</code></a> é definido)</td></tr>
<tr><td>Controle de controle de conexão</td><td><code>component_connection_control</code> componente</td><td>Quando <a class="link" href="server-system-variables.html#sysvar_component_connection_control.failed_connections_threshold"><code>component_connection_control.failed_connections_threshold</code></a> != 0</td><td>Quando uma tentativa de conexão falha é adiada</td></tr>
<tr><td>Controle de DoS de conexão</td><td><code>connection_control</code> plugin</td><td>Quando <a class="link" href="connection-control-plugin-variables.html#sysvar_connection_control_failed_connections_threshold"><code>connection_control_failed_connections_threshold</code></a> != 0</td><td>Quando uma tentativa de conexão falha é adiada</td></tr>
<tr><td>Chave criptografada do arquivo</td><td><code>component_keyring_encrypted_file</code></td><td>sempre</td><td>Quando qualquer uma das funções gerais do componente de chave (ver <a class="xref" href="keyring-functions-general-purpose.html" title="8.4.5.15 Funções gerais de chave de gerenciamento de chaves">8.4.5.15, “Funções gerais de chave de gerenciamento de chaves”</a>) são chamadas usando este componente</td></tr>
<tr><td>AUDITORIA empresarial</td><td><code>audit_log plugin</code></td><td><a class="link" href="audit-log-reference.html#sysvar_audit_log_disable"><code>audit_log_disable</code></a> = OFF</td><td>Quando qualquer uma das funções deste plugin são chamadas, ou um novo arquivo de saída de auditoria é aberto para escrita</td></tr>
<tr><td>Mascagem de dados empresarial</td><td><code>component_masking</code></td><td>sempre</td><td>Quando qualquer uma das funções deste componente são chamadas</td></tr>
<tr><td>Criptografia empresarial</td><td><code>component_enterprise_encryption</code></td><td>sempre</td><td>Quando qualquer uma das funções deste componente são chamadas</td></tr>
<tr><td>Firewall empresarial</td><td><code>MYSQL_FIREWALL</code> plugin</td><td>Quando <a class="link" href="firewall-plugin.html#sysvar_mysql_firewall_mode"><code>mysql_firewall_mode</code></a> = ON</td><td>Quando qualquer uma das funções administrativas deste plugin (ver <a class="ulink" href="/doc/refman/8.4/en/firewall-reference.html#firewall-functions" target="_top">Funções administrativas do Firewall MySQL</a>) são chamadas, ou uma declaração, uma marcação ou uma rejeição são adicionadas, marcadas ou rejeitadas</td></tr>
<tr><td>Firewall empresarial</td><td><code>component_firewall</code></td><td>Quando <a class="link" href="firewall-component.html#sysvar_component_firewall.enabled"><code>component_firewall.enabled</code></a> = ON</td><td>Quando qualquer uma das funções administrativas deste componente (ver <a class="xref" href="firewall-component.html#firewall-component-stored-functions" title="Funções armazenadas do Firewall

O nome do componente exibido na coluna **Nome** da tabela é o valor mostrado na coluna `OPTION_NAME` da tabela `mysql_option.option_usage` (veja a Seção 7.5.8.1, “Tabelas de Rastreamento de Opções”) e na coluna `OPTION_NAME` da tabela `mysql_option` do Gerenciamento de Desempenho. O nome da variável de status do Rastreador de Opções (contador de uso) associada a este componente é formado prefixando esse valor com `option_tracker_usage:`.

O nome exibido na coluna **Container** da tabela é o valor exibido na coluna `OPTION_CONTAINER` da tabela `performance_schema.mysql_option`.

A coluna **Ativado** mostra as condições sob as quais o componente é ativado.

A coluna **Incrementado** mostra quais eventos ou ações causam o aumento do contador de uso deste componente.

Nota

O Máscara de Dados Empresariais era anteriormente conhecido como Máscara de Dados Empresariais e Desidentificação.