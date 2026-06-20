## 19.4 X Plugin

Esta seção explica como configurar e monitorar o Plugin X.

### 19.4.1 Usando conexões criptografadas com o plugin X

Esta seção explica como configurar o X Plugin para usar conexões criptografadas. Para mais informações de fundo, consulte [Seção 6.3, “Usando Conexões Criptografadas”][(encrypted-connections.html "6.3 Using Encrypted Connections")].

Para habilitar a configuração do suporte para conexões criptografadas, o X Plugin
tem as variáveis de sistema `mysqlx_ssl_xxx`
, que podem ter valores diferentes das variáveis de sistema
`ssl_xxx`
usadas com o MySQL Server. Por exemplo, o X Plugin pode ter
chaves SSL, certificados e arquivos de autoridade de certificado que diferem
dos usados para o MySQL Server. Essas variáveis são descritas em
[Seção 19.4.2.2, “Opções do X Plugin e Variáveis de Sistema”](x-plugin-options-system-variables.html "19.4.2.2 X Plugin Options and System Variables"). Da mesma forma,
o X Plugin tem suas próprias
`Mysqlx_ssl_xxx`
variáveis de status que correspondem aos status de conexão criptografada do MySQL Server
`Ssl_xxx`
. Veja [Seção 19.4.2.3, “Variáveis de Status do X Plugin”](x-plugin-status-variables.html "19.4.2.3 X Plugin Status Variables").

Na inicialização, o X Plugin determina sua configuração para conexões criptografadas da seguinte forma:

* Se todas as variáveis do sistema `mysqlx_ssl_xxx` tiverem seus valores padrão, o X Plugin configura conexões criptografadas usando os valores das variáveis do sistema `ssl_xxx` do servidor MySQL.

* Se qualquer `mysqlx_ssl_xxx` variável tiver um valor não padrão, o X Plugin configura conexões criptografadas usando os valores das suas próprias variáveis do sistema. (Este é o caso se qualquer `mysqlx_ssl_xxx` variável do sistema estiver definida com um valor diferente do seu padrão.)

Isso significa que, em um servidor com o X Plugin habilitado, você pode optar por ter conexões do Protocolo MySQL e do X compartilhando a mesma configuração de criptografia, definindo apenas as variáveis `ssl_xxx`, ou ter configurações de criptografia separadas para conexões do Protocolo MySQL e do X, configurando as variáveis `ssl_xxx` e `mysqlx_ssl_xxx` separadamente.

Para ter conexões com o MySQL Protocol e o X Protocol usando a mesma configuração de criptografia, defina apenas as variáveis do sistema `ssl_xxx` em `my.cnf`:

```sql
[mysqld]
ssl_ca=ca.pem
ssl_cert=server-cert.pem
ssl_key=server-key.pem
```

Para configurar a criptografia separadamente para conexões com o Protocolo MySQL e o Protocolo X, defina as variáveis de sistema `ssl_xxx` e `mysqlx_ssl_xxx` no `my.cnf`:

```sql
[mysqld]
ssl_ca=ca1.pem
ssl_cert=server-cert1.pem
ssl_key=server-key1.pem

mysqlx_ssl_ca=ca2.pem
mysqlx_ssl_cert=server-cert2.pem
mysqlx_ssl_key=server-key2.pem
```

Para obter informações gerais sobre a configuração do suporte de criptografia de conexão, consulte [Seção 6.3.1, “Configurando o MySQL para usar conexões criptografadas”][(using-encrypted-connections.html "6.3.1 Configuring MySQL to Use Encrypted Connections")]. Essa discussão é escrita para o MySQL Server, mas os nomes dos parâmetros são semelhantes para o X Plugin. (Os nomes das variáveis de sistema do X Plugin `mysqlx_ssl_xxx` correspondem aos nomes das variáveis de sistema do MySQL Server `ssl_xxx`.

A variável de sistema `tls_version` (server-system-variables.html#sysvar_tls_version) que determina as versões TLS permitidas para conexões do Protocolo MySQL também se aplica às conexões do X Protocol. Portanto, as versões TLS permitidas para ambos os tipos de conexões são as mesmas.

A criptografia por conexão é opcional, mas um usuário específico pode ser
obrigado a usar criptografia para conexões do X Protocol e do MySQL Protocol
incluindo uma cláusula apropriada `REQUIRE`
na declaração `CREATE USER`(create-user.html "13.7.1.2 CREATE USER Statement") que cria o usuário. Para detalhes, consulte
[Seção 13.7.1.2, “Declaração CREATE USER”](create-user.html "13.7.1.2 CREATE USER Statement"). Alternativamente, para exigir que todos os usuários
usem criptografia para conexões do X Protocol e do MySQL Protocol,
ative a
`require_secure_transport`(server-system-variables.html#sysvar_require_secure_transport) variável do sistema. Para informações adicionais, consulte
[Configurando Conexões Criptografadas como Obrigatórias](using-encrypted-connections.html#mandatory-encrypted-connections "Configuring Encrypted Connections as Mandatory").

### 19.4.2 Opções e variáveis do plugin X

Esta seção descreve as opções de comando e as variáveis do sistema
que configuram o X Plugin, bem como as variáveis de status
disponíveis para fins de monitoramento. Se os valores de configuração
especificados no momento do início forem incorretos, o X Plugin
poderá não se inicializar corretamente e o servidor não o carregará. Nesse caso,
o servidor também pode produzir mensagens de erro para outras configurações do X Plugin
porque não consegue reconhecê-las.

#### 19.4.2.1 Opção de Plugin e Referência de Variável

Esta tabela fornece uma visão geral das opções de comando, variáveis do sistema e variáveis de status fornecidas pelo X Plugin.

**Tabela 19.1 Opção de Plugin e Referência de Variável**

<table frame="box" rules="all" summary="Reference for X Plugin command-line options, system variables, and status variables."><col style="width: 20%"/><col style="width: 15%"/><col style="width: 15%"/><col style="width: 15%"/><col style="width: 15%"/><col style="width: 15%"/><col style="width: 15%"/><thead><tr><th>Name</th>
<th>Cmd-Line</th>
<th>Option File</th>
<th>System Var</th>
<th>Status Var</th>
<th>Var Scope</th>
<th>Dynamic</th>
</tr></thead><tbody><tr><th>mysqlx</th>
<td>Yes</td>
<td>Yes</td>
<td></td>
<td></td>
<td></td>
<td></td>
</tr><tr><th>Mysqlx_address</th>
<td></td>
<td></td>
<td></td>
<td>Yes</td>
<td>Global</td>
<td>No</td>
</tr><tr><th>mysqlx_bind_address</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td></td>
<td>Global</td>
<td>No</td>
</tr><tr><th>Mysqlx_bytes_received</th>
<td></td>
<td></td>
<td></td>
<td>Yes</td>
<td>Both</td>
<td>No</td>
</tr><tr><th>Mysqlx_bytes_sent</th>
<td></td>
<td></td>
<td></td>
<td>Yes</td>
<td>Both</td>
<td>No</td>
</tr><tr><th>mysqlx_connect_timeout</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td></td>
<td>Global</td>
<td>Yes</td>
</tr><tr><th>Mysqlx_connection_accept_errors</th>
<td></td>
<td></td>
<td></td>
<td>Yes</td>
<td>Both</td>
<td>No</td>
</tr><tr><th>Mysqlx_connection_errors</th>
<td></td>
<td></td>
<td></td>
<td>Yes</td>
<td>Both</td>
<td>No</td>
</tr><tr><th>Mysqlx_connections_accepted</th>
<td></td>
<td></td>
<td></td>
<td>Yes</td>
<td>Global</td>
<td>No</td>
</tr><tr><th>Mysqlx_connections_closed</th>
<td></td>
<td></td>
<td></td>
<td>Yes</td>
<td>Global</td>
<td>No</td>
</tr><tr><th>Mysqlx_connections_rejected</th>
<td></td>
<td></td>
<td></td>
<td>Yes</td>
<td>Global</td>
<td>No</td>
</tr><tr><th>Mysqlx_crud_create_view</th>
<td></td>
<td></td>
<td></td>
<td>Yes</td>
<td>Both</td>
<td>No</td>
</tr><tr><th>Mysqlx_crud_delete</th>
<td></td>
<td></td>
<td></td>
<td>Yes</td>
<td>Both</td>
<td>No</td>
</tr><tr><th>Mysqlx_crud_drop_view</th>
<td></td>
<td></td>
<td></td>
<td>Yes</td>
<td>Both</td>
<td>No</td>
</tr><tr><th>Mysqlx_crud_find</th>
<td></td>
<td></td>
<td></td>
<td>Yes</td>
<td>Both</td>
<td>No</td>
</tr><tr><th>Mysqlx_crud_insert</th>
<td></td>
<td></td>
<td></td>
<td>Yes</td>
<td>Both</td>
<td>No</td>
</tr><tr><th>Mysqlx_crud_modify_view</th>
<td></td>
<td></td>
<td></td>
<td>Yes</td>
<td>Both</td>
<td>No</td>
</tr><tr><th>Mysqlx_crud_update</th>
<td></td>
<td></td>
<td></td>
<td>Yes</td>
<td>Both</td>
<td>No</td>
</tr><tr><th>Mysqlx_errors_sent</th>
<td></td>
<td></td>
<td></td>
<td>Yes</td>
<td>Both</td>
<td>No</td>
</tr><tr><th>Mysqlx_errors_unknown_message_type</th>
<td></td>
<td></td>
<td></td>
<td>Yes</td>
<td>Both</td>
<td>No</td>
</tr><tr><th>Mysqlx_expect_close</th>
<td></td>
<td></td>
<td></td>
<td>Yes</td>
<td>Both</td>
<td>No</td>
</tr><tr><th>Mysqlx_expect_open</th>
<td></td>
<td></td>
<td></td>
<td>Yes</td>
<td>Both</td>
<td>No</td>
</tr><tr><th>mysqlx_idle_worker_thread_timeout</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td></td>
<td>Global</td>
<td>Yes</td>
</tr><tr><th>Mysqlx_init_error</th>
<td></td>
<td></td>
<td></td>
<td>Yes</td>
<td>Both</td>
<td>No</td>
</tr><tr><th>mysqlx_max_allowed_packet</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td></td>
<td>Global</td>
<td>Yes</td>
</tr><tr><th>mysqlx_max_connections</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td></td>
<td>Global</td>
<td>Yes</td>
</tr><tr><th>mysqlx_min_worker_threads</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td></td>
<td>Global</td>
<td>Yes</td>
</tr><tr><th>Mysqlx_notice_other_sent</th>
<td></td>
<td></td>
<td></td>
<td>Yes</td>
<td>Both</td>
<td>No</td>
</tr><tr><th>Mysqlx_notice_warning_sent</th>
<td></td>
<td></td>
<td></td>
<td>Yes</td>
<td>Both</td>
<td>No</td>
</tr><tr><th>Mysqlx_port</th>
<td></td>
<td></td>
<td></td>
<td>Yes</td>
<td>Global</td>
<td>No</td>
</tr><tr><th>mysqlx_port</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td></td>
<td>Global</td>
<td>No</td>
</tr><tr><th>mysqlx_port_open_timeout</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td></td>
<td>Global</td>
<td>No</td>
</tr><tr><th>Mysqlx_rows_sent</th>
<td></td>
<td></td>
<td></td>
<td>Yes</td>
<td>Both</td>
<td>No</td>
</tr><tr><th>Mysqlx_sessions</th>
<td></td>
<td></td>
<td></td>
<td>Yes</td>
<td>Global</td>
<td>No</td>
</tr><tr><th>Mysqlx_sessions_accepted</th>
<td></td>
<td></td>
<td></td>
<td>Yes</td>
<td>Global</td>
<td>No</td>
</tr><tr><th>Mysqlx_sessions_closed</th>
<td></td>
<td></td>
<td></td>
<td>Yes</td>
<td>Global</td>
<td>No</td>
</tr><tr><th>Mysqlx_sessions_fatal_error</th>
<td></td>
<td></td>
<td></td>
<td>Yes</td>
<td>Global</td>
<td>No</td>
</tr><tr><th>Mysqlx_sessions_killed</th>
<td></td>
<td></td>
<td></td>
<td>Yes</td>
<td>Global</td>
<td>No</td>
</tr><tr><th>Mysqlx_sessions_rejected</th>
<td></td>
<td></td>
<td></td>
<td>Yes</td>
<td>Global</td>
<td>No</td>
</tr><tr><th>Mysqlx_socket</th>
<td></td>
<td></td>
<td></td>
<td>Yes</td>
<td>Global</td>
<td>No</td>
</tr><tr><th>mysqlx_socket</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td></td>
<td>Global</td>
<td>No</td>
</tr><tr><th>Mysqlx_ssl_accept_renegotiates</th>
<td></td>
<td></td>
<td></td>
<td>Yes</td>
<td>Global</td>
<td>No</td>
</tr><tr><th>Mysqlx_ssl_accepts</th>
<td></td>
<td></td>
<td></td>
<td>Yes</td>
<td>Global</td>
<td>No</td>
</tr><tr><th>Mysqlx_ssl_active</th>
<td></td>
<td></td>
<td></td>
<td>Yes</td>
<td>Both</td>
<td>No</td>
</tr><tr><th>mysqlx_ssl_ca</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td></td>
<td>Global</td>
<td>No</td>
</tr><tr><th>mysqlx_ssl_capath</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td></td>
<td>Global</td>
<td>No</td>
</tr><tr><th>mysqlx_ssl_cert</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td></td>
<td>Global</td>
<td>No</td>
</tr><tr><th>Mysqlx_ssl_cipher</th>
<td></td>
<td></td>
<td></td>
<td>Yes</td>
<td>Both</td>
<td>No</td>
</tr><tr><th>mysqlx_ssl_cipher</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td></td>
<td>Global</td>
<td>No</td>
</tr><tr><th>Mysqlx_ssl_cipher_list</th>
<td></td>
<td></td>
<td></td>
<td>Yes</td>
<td>Both</td>
<td>No</td>
</tr><tr><th>mysqlx_ssl_crl</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td></td>
<td>Global</td>
<td>No</td>
</tr><tr><th>mysqlx_ssl_crlpath</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td></td>
<td>Global</td>
<td>No</td>
</tr><tr><th>Mysqlx_ssl_ctx_verify_depth</th>
<td></td>
<td></td>
<td></td>
<td>Yes</td>
<td>Both</td>
<td>No</td>
</tr><tr><th>Mysqlx_ssl_ctx_verify_mode</th>
<td></td>
<td></td>
<td></td>
<td>Yes</td>
<td>Both</td>
<td>No</td>
</tr><tr><th>Mysqlx_ssl_finished_accepts</th>
<td></td>
<td></td>
<td></td>
<td>Yes</td>
<td>Global</td>
<td>No</td>
</tr><tr><th>mysqlx_ssl_key</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td></td>
<td>Global</td>
<td>No</td>
</tr><tr><th>Mysqlx_ssl_server_not_after</th>
<td></td>
<td></td>
<td></td>
<td>Yes</td>
<td>Global</td>
<td>No</td>
</tr><tr><th>Mysqlx_ssl_server_not_before</th>
<td></td>
<td></td>
<td></td>
<td>Yes</td>
<td>Global</td>
<td>No</td>
</tr><tr><th>Mysqlx_ssl_verify_depth</th>
<td></td>
<td></td>
<td></td>
<td>Yes</td>
<td>Global</td>
<td>No</td>
</tr><tr><th>Mysqlx_ssl_verify_mode</th>
<td></td>
<td></td>
<td></td>
<td>Yes</td>
<td>Global</td>
<td>No</td>
</tr><tr><th>Mysqlx_ssl_version</th>
<td></td>
<td></td>
<td></td>
<td>Yes</td>
<td>Both</td>
<td>No</td>
</tr><tr><th>Mysqlx_stmt_create_collection</th>
<td></td>
<td></td>
<td></td>
<td>Yes</td>
<td>Both</td>
<td>No</td>
</tr><tr><th>Mysqlx_stmt_create_collection_index</th>
<td></td>
<td></td>
<td></td>
<td>Yes</td>
<td>Both</td>
<td>No</td>
</tr><tr><th>Mysqlx_stmt_disable_notices</th>
<td></td>
<td></td>
<td></td>
<td>Yes</td>
<td>Both</td>
<td>No</td>
</tr><tr><th>Mysqlx_stmt_drop_collection</th>
<td></td>
<td></td>
<td></td>
<td>Yes</td>
<td>Both</td>
<td>No</td>
</tr><tr><th>Mysqlx_stmt_drop_collection_index</th>
<td></td>
<td></td>
<td></td>
<td>Yes</td>
<td>Both</td>
<td>No</td>
</tr><tr><th>Mysqlx_stmt_enable_notices</th>
<td></td>
<td></td>
<td></td>
<td>Yes</td>
<td>Both</td>
<td>No</td>
</tr><tr><th>Mysqlx_stmt_ensure_collection</th>
<td></td>
<td></td>
<td></td>
<td>Yes</td>
<td>Both</td>
<td>No</td>
</tr><tr><th>Mysqlx_stmt_execute_mysqlx</th>
<td></td>
<td></td>
<td></td>
<td>Yes</td>
<td>Both</td>
<td>No</td>
</tr><tr><th>Mysqlx_stmt_execute_sql</th>
<td></td>
<td></td>
<td></td>
<td>Yes</td>
<td>Both</td>
<td>No</td>
</tr><tr><th>Mysqlx_stmt_execute_xplugin</th>
<td></td>
<td></td>
<td></td>
<td>Yes</td>
<td>Both</td>
<td>No</td>
</tr><tr><th>Mysqlx_stmt_kill_client</th>
<td></td>
<td></td>
<td></td>
<td>Yes</td>
<td>Both</td>
<td>No</td>
</tr><tr><th>Mysqlx_stmt_list_clients</th>
<td></td>
<td></td>
<td></td>
<td>Yes</td>
<td>Both</td>
<td>No</td>
</tr><tr><th>Mysqlx_stmt_list_notices</th>
<td></td>
<td></td>
<td></td>
<td>Yes</td>
<td>Both</td>
<td>No</td>
</tr><tr><th>Mysqlx_stmt_list_objects</th>
<td></td>
<td></td>
<td></td>
<td>Yes</td>
<td>Both</td>
<td>No</td>
</tr><tr><th>Mysqlx_stmt_ping</th>
<td></td>
<td></td>
<td></td>
<td>Yes</td>
<td>Both</td>
<td>No</td>
</tr><tr><th>Mysqlx_worker_threads</th>
<td></td>
<td></td>
<td></td>
<td>Yes</td>
<td>Global</td>
<td>No</td>
</tr><tr><th>Mysqlx_worker_threads_active</th>
<td></td>
<td></td>
<td></td>
<td>Yes</td>
<td>Global</td>
<td>No</td>
</tr></tbody></table>

#### 19.4.2.2 Opções do Plugin e Variáveis do Sistema

Para controlar a ativação do X Plugin, use esta opção:

* `--mysqlx[=value]`(x-plugin-options-system-variables.html#option_mysqld_mysqlx)

  <table frame="box" rules="all" summary="Properties for mysqlx"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th>
<td><code>--mysqlx[=value]</code></td>
</tr><tr><th>Introduced</th>
<td>5.7.12</td>
</tr><tr><th>Type</th>
<td>Enumeration</td>
</tr><tr><th>Default Value</th>
<td><code>ON</code></td>
</tr><tr><th>Valores válidos</th>
<td><code>ON</code><code>OFF</code><code>FORCE</code><code>FORCE_PLUS_PERMANENT</code></td>
</tr></tbody></table>

Esta opção controla como o servidor carrega o X Plugin no início. Está disponível apenas se o plugin tiver sido registrado anteriormente com `INSTALL
  PLUGIN` (install-plugin.html "13.7.3.3 Declaracao de INSTALAR PLUGIN") ou estiver carregado com `--plugin-load` (server-options.html#option_mysqld_plugin-load) ou `--plugin-load-add` (server-options.html#option_mysqld_plugin-load-add).

O valor da opção deve ser uma das disponíveis para opções de carregamento de plugins, conforme descrito em [Seção 5.5.1, “Instalando e Desinstalando Plugins”][(plugin-loading.html "5.5.1 Installing and Uninstalling Plugins")]. Por exemplo,
`--mysqlx=FORCE_PLUS_PERMANENT`
instrui o servidor a carregar o plugin e impedir que ele seja removido enquanto o servidor estiver em execução.

Se o X Plugin estiver habilitado, ele expõe várias variáveis do sistema que permitem o controle sobre sua operação:

* `mysqlx_bind_address`(x-plugin-options-system-variables.html#sysvar_mysqlx_bind_address)

  <table frame="box" rules="all" summary="Properties for mysqlx_bind_address"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th>
<td><code>--mysqlx-bind-address=addr</code></td>
</tr><tr><th>Introduced</th>
<td>5.7.17</td>
</tr><tr><th>System Variable</th>
<td><code>mysqlx_bind_address</code></td>
</tr><tr><th>Scope</th>
<td>Global</td>
</tr><tr><th>Dynamic</th>
<td>No</td>
</tr><tr><th>Type</th>
<td>String</td>
</tr><tr><th>Default Value</th>
<td><code>*</code></td>
</tr></tbody></table>

O endereço de rede no qual o X Plugin escuta conexões TCP/IP. Esta variável não é dinâmica e pode ser configurada apenas na inicialização. Este é o equivalente do X Plugin à variável do sistema `bind_address`(server-system-variables.html#sysvar_bind_address); consulte a descrição dessa variável para obter mais informações.

`mysqlx_bind_address`](x-plugin-options-system-variables.html#sysvar_mysqlx_bind_address) aceita
um único valor de endereço, que pode especificar um único
endereço IP ou nome de host não comodal, ou um dos formatos de endereço comodal
que permitem ouvir em múltiplas interfaces de rede (`*`,
`0.0.0.0` ou `::`).

Um endereço IP pode ser especificado como um endereço IPv4 ou IPv6.  Se o valor for um nome de host, o X Plugin resolve o nome para um endereço IP e se vincula a esse endereço. Se um nome de host resolver para múltiplos endereços IP, o X Plugin usa o primeiro endereço IPv4, se houver algum, ou o primeiro endereço IPv6, caso contrário.

O X Plugin trata diferentes tipos de endereços da seguinte forma:

+ Se o endereço for `*`, o X Plugin aceita conexões TCP/IP em todas as interfaces do servidor host IPv4 e, se o servidor host suportar IPv6, em todas as interfaces IPv6. Use este endereço para permitir conexões tanto de IPv4 quanto de IPv6 para o X Plugin. Este valor é o padrão.

+ Se o endereço for `0.0.0.0`, o X Plugin aceita conexões TCP/IP em todas as interfaces do servidor IPv4.

+ Se o endereço for `::`, o X Plugin aceita conexões TCP/IP em todas as interfaces de IPv4 e IPv6 do host do servidor.

+ Se o endereço for um endereço mapeado IPv4, o X Plugin aceita conexões TCP/IP para esse endereço, no formato IPv4 ou IPv6. Por exemplo, se o X Plugin estiver vinculado a `::ffff:127.0.0.1`, um cliente como o MySQL Shell pode se conectar usando `--host=127.0.0.1` ou `--host=::ffff:127.0.0.1`.

+ Se o endereço for um endereço IPv4 ou IPv6 "regular" (como `127.0.0.1` ou `::1`), o X Plugin aceita conexões TCP/IP apenas para esse endereço IPv4 ou IPv6.

Se a vinculação ao endereço falhar, o X Plugin produz um erro e o servidor não o carrega.

* `mysqlx_connect_timeout`](x-plugin-options-system-variables.html#sysvar_mysqlx_connect_timeout)

  <table frame="box" rules="all" summary="Properties for mysqlx_connect_timeout"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th>
<td><code>--mysqlx-connect-timeout=#</code></td>
</tr><tr><th>Introduced</th>
<td>5.7.12</td>
</tr><tr><th>System Variable</th>
<td><code>mysqlx_connect_timeout</code></td>
</tr><tr><th>Scope</th>
<td>Global</td>
</tr><tr><th>Dynamic</th>
<td>Yes</td>
</tr><tr><th>Type</th>
<td>Integer</td>
</tr><tr><th>Default Value</th>
<td><code>30</code></td>
</tr><tr><th>Minimum Value</th>
<td><code>1</code></td>
</tr><tr><th>Maximum Value</th>
<td><code>1000000000</code></td>
</tr><tr><th>Unit</th>
<td>seconds</td>
</tr></tbody></table>

O número de segundos que o X Plugin espera para o primeiro pacote ser recebido de clientes recém-conectados. Isso é o equivalente do X Plugin de
`connect_timeout`(server-system-variables.html#sysvar_connect_timeout); veja a descrição daquela variável para mais informações.

* `mysqlx_idle_worker_thread_timeout`(x-plugin-options-system-variables.html#sysvar_mysqlx_idle_worker_thread_timeout)

  <table frame="box" rules="all" summary="Properties for mysqlx_idle_worker_thread_timeout"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th>
<td><code>--mysqlx-idle-worker-thread-timeout=#</code></td>
</tr><tr><th>Introduced</th>
<td>5.7.12</td>
</tr><tr><th>System Variable</th>
<td><code>mysqlx_idle_worker_thread_timeout</code></td>
</tr><tr><th>Scope</th>
<td>Global</td>
</tr><tr><th>Dynamic</th>
<td>Yes</td>
</tr><tr><th>Type</th>
<td>Integer</td>
</tr><tr><th>Default Value</th>
<td><code>60</code></td>
</tr><tr><th>Minimum Value</th>
<td><code>0</code></td>
</tr><tr><th>Maximum Value</th>
<td><code>3600</code></td>
</tr><tr><th>Unit</th>
<td>seconds</td>
</tr></tbody></table>

O número de segundos após o qual os threads de trabalhadores ociosos são terminados.

* `mysqlx_max_allowed_packet`(x-plugin-options-system-variables.html#sysvar_mysqlx_max_allowed_packet)

  <table frame="box" rules="all" summary="Properties for mysqlx_max_allowed_packet"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th>
<td><code>--mysqlx-max-allowed-packet=#</code></td>
</tr><tr><th>Introduced</th>
<td>5.7.12</td>
</tr><tr><th>System Variable</th>
<td><code>mysqlx_max_allowed_packet</code></td>
</tr><tr><th>Scope</th>
<td>Global</td>
</tr><tr><th>Dynamic</th>
<td>Yes</td>
</tr><tr><th>Type</th>
<td>Integer</td>
</tr><tr><th>Default Value</th>
<td><code>67108864</code></td>
</tr><tr><th>Minimum Value</th>
<td><code>512</code></td>
</tr><tr><th>Maximum Value</th>
<td><code>1073741824</code></td>
</tr><tr><th>Unit</th>
<td>bytes</td>
</tr></tbody></table>

O tamanho máximo dos pacotes de rede que podem ser recebidos pelo X Plugin. Este é o equivalente do X Plugin de `max_allowed_packet`(server-system-variables.html#sysvar_max_allowed_packet); consulte a descrição dessa variável para mais informações.

* `mysqlx_max_connections`(x-plugin-options-system-variables.html#sysvar_mysqlx_max_connections)

  <table frame="box" rules="all" summary="Properties for mysqlx_max_connections"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th>
<td><code>--mysqlx-max-connections=#</code></td>
</tr><tr><th>Introduced</th>
<td>5.7.12</td>
</tr><tr><th>System Variable</th>
<td><code>mysqlx_max_connections</code></td>
</tr><tr><th>Scope</th>
<td>Global</td>
</tr><tr><th>Dynamic</th>
<td>Yes</td>
</tr><tr><th>Type</th>
<td>Integer</td>
</tr><tr><th>Default Value</th>
<td><code>100</code></td>
</tr><tr><th>Minimum Value</th>
<td><code>1</code></td>
</tr><tr><th>Maximum Value</th>
<td><code>65535</code></td>
</tr></tbody></table>

O número máximo de conexões de clientes concorrentes que o X Plugin pode aceitar. Esse é o equivalente do X Plugin de `max_connections`(server-system-variables.html#sysvar_max_connections); veja a descrição daquela variável para mais informações.

Para modificações nesta variável, se o novo valor for menor que o número atual de conexões, o novo limite é considerado apenas para novas conexões.

* `mysqlx_min_worker_threads`(x-plugin-options-system-variables.html#sysvar_mysqlx_min_worker_threads)

  <table frame="box" rules="all" summary="Properties for mysqlx_min_worker_threads"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th>
<td><code>--mysqlx-min-worker-threads=#</code></td>
</tr><tr><th>Introduced</th>
<td>5.7.12</td>
</tr><tr><th>System Variable</th>
<td><code>mysqlx_min_worker_threads</code></td>
</tr><tr><th>Scope</th>
<td>Global</td>
</tr><tr><th>Dynamic</th>
<td>Yes</td>
</tr><tr><th>Type</th>
<td>Integer</td>
</tr><tr><th>Default Value</th>
<td><code>2</code></td>
</tr><tr><th>Minimum Value</th>
<td><code>1</code></td>
</tr><tr><th>Maximum Value</th>
<td><code>100</code></td>
</tr></tbody></table>

O número mínimo de threads de trabalho usadas pelo X Plugin para o tratamento de solicitações de clientes.

* `mysqlx_port`(x-plugin-options-system-variables.html#sysvar_mysqlx_port)

  <table frame="box" rules="all" summary="Properties for mysqlx_port"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th>
<td><code>--mysqlx-port=port_num</code></td>
</tr><tr><th>Introduced</th>
<td>5.7.12</td>
</tr><tr><th>System Variable</th>
<td><code>mysqlx_port</code></td>
</tr><tr><th>Scope</th>
<td>Global</td>
</tr><tr><th>Dynamic</th>
<td>No</td>
</tr><tr><th>Type</th>
<td>Integer</td>
</tr><tr><th>Default Value</th>
<td><code>33060</code></td>
</tr><tr><th>Minimum Value</th>
<td><code>1</code></td>
</tr><tr><th>Maximum Value</th>
<td><code>65535</code></td>
</tr></tbody></table>

O porta de rede no qual o X Plugin escuta conexões TCP/IP. Este é o equivalente do X Plugin de
`port`(server-system-variables.html#sysvar_port); veja a descrição daquela variável para mais informações.

* `mysqlx_port_open_timeout`(x-plugin-options-system-variables.html#sysvar_mysqlx_port_open_timeout)

  <table frame="box" rules="all" summary="Properties for mysqlx_port_open_timeout"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th>
<td><code>--mysqlx-port-open-timeout=#</code></td>
</tr><tr><th>Introduced</th>
<td>5.7.17</td>
</tr><tr><th>System Variable</th>
<td><code>mysqlx_port_open_timeout</code></td>
</tr><tr><th>Scope</th>
<td>Global</td>
</tr><tr><th>Dynamic</th>
<td>No</td>
</tr><tr><th>Type</th>
<td>Integer</td>
</tr><tr><th>Default Value</th>
<td><code>0</code></td>
</tr><tr><th>Minimum Value</th>
<td><code>0</code></td>
</tr><tr><th>Maximum Value</th>
<td><code>120</code></td>
</tr><tr><th>Unit</th>
<td>seconds</td>
</tr></tbody></table>

O número de segundos que o X Plugin espera para uma porta TCP/IP ficar livre.

* `mysqlx_socket`(x-plugin-options-system-variables.html#sysvar_mysqlx_socket)

  <table frame="box" rules="all" summary="Properties for mysqlx_socket"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th>
<td><code>--mysqlx-socket=file_name</code></td>
</tr><tr><th>Introduced</th>
<td>5.7.15</td>
</tr><tr><th>System Variable</th>
<td><code>mysqlx_socket</code></td>
</tr><tr><th>Scope</th>
<td>Global</td>
</tr><tr><th>Dynamic</th>
<td>No</td>
</tr><tr><th>Type</th>
<td>String</td>
</tr><tr><th>Default Value</th>
<td><code>/tmp/mysqlx.sock</code></td>
</tr></tbody></table>

O caminho para um arquivo de soquete Unix que o Plugin X usa para conexões. Esta configuração é usada apenas pelo MySQL Server quando executado em sistemas operacionais Unix. Os clientes podem usar este soquete para se conectar ao MySQL Server usando o Plugin X.

O caminho padrão e o nome do arquivo são baseados no caminho padrão e no nome do arquivo para o arquivo de soquete principal do MySQL Server, com a adição de um `x` anexado ao nome do arquivo. O caminho padrão e o nome do arquivo para o arquivo de soquete principal é `/tmp/mysql.sock`, portanto, o caminho padrão e o nome do arquivo para o arquivo de soquete do Plugin X é `/tmp/mysqlx.sock`.

Se você especificar um caminho alternativo e um nome de arquivo para o arquivo do socket principal na inicialização do servidor usando a variável de sistema `socket`(server-system-variables.html#sysvar_socket), isso não afeta o padrão do arquivo do socket do X Plugin. Nesta situação, se você quiser armazenar ambos os sockets em um único caminho, você deve definir a variável de sistema `mysqlx_socket`(x-plugin-options-system-variables.html#sysvar_mysqlx_socket) também. Por exemplo, em um arquivo de configuração:

  ```sql
  socket=/home/sockets/mysqld/mysql.sock
  mysqlx_socket=/home/sockets/xplugin/xplugin.sock
  ```

Se você alterar o caminho padrão e o nome do arquivo do socket principal no momento da compilação usando a opção de compilação
`MYSQL_UNIX_ADDR`(source-configuration-options.html#option_cmake_mysql_unix_addr), isso afeta o padrão do arquivo de socket do plugin X, que é formado adicionando um
`x` ao nome do arquivo
`MYSQL_UNIX_ADDR`(source-configuration-options.html#option_cmake_mysql_unix_addr). Se você deseja definir um padrão diferente para o arquivo de socket do plugin X no momento da compilação, use a opção de compilação
`MYSQLX_UNIX_ADDR`(source-configuration-options.html#option_cmake_mysqlx_unix_addr).

A variável de ambiente `MYSQLX_UNIX_PORT` também pode ser usada para definir um padrão para o arquivo de soquete do Plugin X no início do servidor (consulte [Seção 4.9, “Variáveis de Ambiente”][(environment-variables.html "4.9 Environment Variables")]). Se você definir essa variável de ambiente, ela substituirá o valor compilado de `MYSQLX_UNIX_ADDR`(source-configuration-options.html#option_cmake_mysqlx_unix_addr) , mas será substituída pelo valor de `mysqlx_socket`(x-plugin-options-system-variables.html#sysvar_mysqlx_socket).

* `mysqlx_ssl_ca`(x-plugin-options-system-variables.html#sysvar_mysqlx_ssl_ca)

  <table frame="box" rules="all" summary="Properties for mysqlx_bind_address"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th>
<td><code>--mysqlx-bind-address=addr</code></td>
</tr><tr><th>Introduced</th>
<td>5.7.17</td>
</tr><tr><th>System Variable</th>
<td><code>mysqlx_bind_address</code></td>
</tr><tr><th>Scope</th>
<td>Global</td>
</tr><tr><th>Dynamic</th>
<td>No</td>
</tr><tr><th>Type</th>
<td>String</td>
</tr><tr><th>Default Value</th>
<td><code>*</code></td>
</tr></tbody></table>0

O sistema variável `mysqlx_ssl_ca`(x-plugin-options-system-variables.html#sysvar_mysqlx_ssl_ca) é semelhante ao `ssl_ca`(server-system-variables.html#sysvar_ssl_ca), exceto que ele se aplica ao X Plugin em vez da interface principal de conexão do servidor MySQL. Para obter informações sobre a configuração do suporte de criptografia para o X Plugin, consulte [Seção 19.4.1, “Usando conexões criptografadas com o X Plugin”][(x-plugin-encrypted-connections.html "19.4.1 Using Encrypted Connections with X Plugin")].

* `mysqlx_ssl_capath`(x-plugin-options-system-variables.html#sysvar_mysqlx_ssl_capath)

  <table frame="box" rules="all" summary="Properties for mysqlx_bind_address"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th>
<td><code>--mysqlx-bind-address=addr</code></td>
</tr><tr><th>Introduced</th>
<td>5.7.17</td>
</tr><tr><th>System Variable</th>
<td><code>mysqlx_bind_address</code></td>
</tr><tr><th>Scope</th>
<td>Global</td>
</tr><tr><th>Dynamic</th>
<td>No</td>
</tr><tr><th>Type</th>
<td>String</td>
</tr><tr><th>Default Value</th>
<td><code>*</code></td>
</tr></tbody></table>1

A variável de sistema `mysqlx_ssl_capath`(x-plugin-options-system-variables.html#sysvar_mysqlx_ssl_capath) é semelhante à
`ssl_capath`(server-system-variables.html#sysvar_ssl_capath), exceto que ela se aplica ao X Plugin em vez da interface de conexão principal do MySQL Server. Para informações sobre a configuração do suporte à criptografia para o X Plugin, consulte
[Seção 19.4.1, “Usando conexões criptografadas com X Plugin”](x-plugin-encrypted-connections.html "19.4.1 Using Encrypted Connections with X Plugin").

* `mysqlx_ssl_cert`(x-plugin-options-system-variables.html#sysvar_mysqlx_ssl_cert)

  <table frame="box" rules="all" summary="Properties for mysqlx_bind_address"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th>
<td><code>--mysqlx-bind-address=addr</code></td>
</tr><tr><th>Introduced</th>
<td>5.7.17</td>
</tr><tr><th>System Variable</th>
<td><code>mysqlx_bind_address</code></td>
</tr><tr><th>Scope</th>
<td>Global</td>
</tr><tr><th>Dynamic</th>
<td>No</td>
</tr><tr><th>Type</th>
<td>String</td>
</tr><tr><th>Default Value</th>
<td><code>*</code></td>
</tr></tbody></table>2

O sistema variável `mysqlx_ssl_cert`](x-plugin-options-system-variables.html#sysvar_mysqlx_ssl_cert) é semelhante ao `ssl_cert`(server-system-variables.html#sysvar_ssl_cert), exceto que ele se aplica ao X Plugin em vez da interface principal de conexão do servidor MySQL. Para obter informações sobre a configuração do suporte de criptografia para o X Plugin, consulte [Seção 19.4.1, “Usando conexões criptografadas com o X Plugin”](x-plugin-encrypted-connections.html "19.4.1 Using Encrypted Connections with X Plugin").

* `mysqlx_ssl_cipher`(x-plugin-options-system-variables.html#sysvar_mysqlx_ssl_cipher)

  <table frame="box" rules="all" summary="Properties for mysqlx_bind_address"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th>
<td><code>--mysqlx-bind-address=addr</code></td>
</tr><tr><th>Introduced</th>
<td>5.7.17</td>
</tr><tr><th>System Variable</th>
<td><code>mysqlx_bind_address</code></td>
</tr><tr><th>Scope</th>
<td>Global</td>
</tr><tr><th>Dynamic</th>
<td>No</td>
</tr><tr><th>Type</th>
<td>String</td>
</tr><tr><th>Default Value</th>
<td><code>*</code></td>
</tr></tbody></table>3

A variável de sistema `mysqlx_ssl_cipher`(x-plugin-options-system-variables.html#sysvar_mysqlx_ssl_cipher) é semelhante à
`ssl_cipher`(server-system-variables.html#sysvar_ssl_cipher), exceto que ela
se aplica ao X Plugin em vez da interface principal de conexão do
Servidor MySQL. Para informações sobre a configuração do suporte à
criptografia para o X Plugin, consulte
[Seção 19.4.1, “Usando Conexões Criptografadas com X Plugin”](x-plugin-encrypted-connections.html "19.4.1 Using Encrypted Connections with X Plugin").

* `mysqlx_ssl_crl`(x-plugin-options-system-variables.html#sysvar_mysqlx_ssl_crl)

  <table frame="box" rules="all" summary="Properties for mysqlx_bind_address"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th>
<td><code>--mysqlx-bind-address=addr</code></td>
</tr><tr><th>Introduced</th>
<td>5.7.17</td>
</tr><tr><th>System Variable</th>
<td><code>mysqlx_bind_address</code></td>
</tr><tr><th>Scope</th>
<td>Global</td>
</tr><tr><th>Dynamic</th>
<td>No</td>
</tr><tr><th>Type</th>
<td>String</td>
</tr><tr><th>Default Value</th>
<td><code>*</code></td>
</tr></tbody></table>4

O sistema variável `mysqlx_ssl_crl`(x-plugin-options-system-variables.html#sysvar_mysqlx_ssl_crl) é semelhante ao `ssl_crl`(server-system-variables.html#sysvar_ssl_crl), exceto que ele se aplica ao X Plugin em vez da interface principal de conexão do servidor MySQL. Para obter informações sobre a configuração do suporte de criptografia para o X Plugin, consulte [Seção 19.4.1, “Usando conexões criptografadas com o X Plugin”][(x-plugin-encrypted-connections.html "19.4.1 Using Encrypted Connections with X Plugin")].

* `mysqlx_ssl_crlpath`(x-plugin-options-system-variables.html#sysvar_mysqlx_ssl_crlpath)

  <table frame="box" rules="all" summary="Properties for mysqlx_bind_address"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th>
<td><code>--mysqlx-bind-address=addr</code></td>
</tr><tr><th>Introduced</th>
<td>5.7.17</td>
</tr><tr><th>System Variable</th>
<td><code>mysqlx_bind_address</code></td>
</tr><tr><th>Scope</th>
<td>Global</td>
</tr><tr><th>Dynamic</th>
<td>No</td>
</tr><tr><th>Type</th>
<td>String</td>
</tr><tr><th>Default Value</th>
<td><code>*</code></td>
</tr></tbody></table>5

A variável de sistema `mysqlx_ssl_crlpath`(x-plugin-options-system-variables.html#sysvar_mysqlx_ssl_crlpath) é semelhante à
`ssl_crlpath`(server-system-variables.html#sysvar_ssl_crlpath), exceto que ela
se aplica ao X Plugin em vez da interface principal de conexão do
MySQL Server. Para informações sobre a configuração do suporte à
criptografia para o X Plugin, consulte
[Seção 19.4.1, “Usando conexões criptografadas com o X Plugin”](x-plugin-encrypted-connections.html "19.4.1 Using Encrypted Connections with X Plugin").

* `mysqlx_ssl_key`(x-plugin-options-system-variables.html#sysvar_mysqlx_ssl_key)

  <table frame="box" rules="all" summary="Properties for mysqlx_bind_address"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th>
<td><code>--mysqlx-bind-address=addr</code></td>
</tr><tr><th>Introduced</th>
<td>5.7.17</td>
</tr><tr><th>System Variable</th>
<td><code>mysqlx_bind_address</code></td>
</tr><tr><th>Scope</th>
<td>Global</td>
</tr><tr><th>Dynamic</th>
<td>No</td>
</tr><tr><th>Type</th>
<td>String</td>
</tr><tr><th>Default Value</th>
<td><code>*</code></td>
</tr></tbody></table>6

O sistema variável `mysqlx_ssl_key`(x-plugin-options-system-variables.html#sysvar_mysqlx_ssl_key) é semelhante ao `ssl_key`(server-system-variables.html#sysvar_ssl_key), exceto que ele se aplica ao X Plugin em vez da interface principal de conexão do servidor MySQL. Para obter informações sobre a configuração do suporte de criptografia para o X Plugin, consulte [Seção 19.4.1, “Usando conexões criptografadas com X Plugin”][(x-plugin-encrypted-connections.html "19.4.1 Using Encrypted Connections with X Plugin")].

#### 19.4.2.3 Variáveis de status do plugin X

As variáveis de status do X Plugin têm os seguintes significados.

* `Mysqlx_address`(x-plugin-status-variables.html#statvar_Mysqlx_address)

O endereço da rede ao qual o X Plugin está vinculado. Se a vinculação falhou ou se a opção
`skip_networking`(server-system-variables.html#sysvar_skip_networking) foi usada, o valor mostra `UNDEFINED`.

* `Mysqlx_bytes_received`(x-plugin-status-variables.html#statvar_Mysqlx_bytes_received)

O número de bytes recebidos através da rede.

* `Mysqlx_bytes_sent`(x-plugin-status-variables.html#statvar_Mysqlx_bytes_sent)

O número de bytes enviados através da rede.

* `Mysqlx_connection_accept_errors`(x-plugin-status-variables.html#statvar_Mysqlx_connection_accept_errors)

O número de conexões que causaram erros de aceitação.

* `Mysqlx_connection_errors`(x-plugin-status-variables.html#statvar_Mysqlx_connection_errors)

O número de conexões que causaram erros.

* `Mysqlx_connections_accepted`(x-plugin-status-variables.html#statvar_Mysqlx_connections_accepted)

O número de conexões que foram aceitas.

* `Mysqlx_connections_closed`(x-plugin-status-variables.html#statvar_Mysqlx_connections_closed)

O número de conexões que foram fechadas.

* `Mysqlx_connections_rejected`(x-plugin-status-variables.html#statvar_Mysqlx_connections_rejected)

O número de conexões que foram rejeitadas.

* `Mysqlx_crud_create_view`(x-plugin-status-variables.html#statvar_Mysqlx_crud_create_view)

O número de solicitações de visualização criadas recebidas.

* `Mysqlx_crud_delete`(x-plugin-status-variables.html#statvar_Mysqlx_crud_delete)

O número de solicitações de exclusão recebidas.

* `Mysqlx_crud_drop_view`(x-plugin-status-variables.html#statvar_Mysqlx_crud_drop_view)

O número de solicitações de visualização em queda recebidas.

* `Mysqlx_crud_find`(x-plugin-status-variables.html#statvar_Mysqlx_crud_find)

O número de solicitações de pesquisa recebidas.

* `Mysqlx_crud_insert`(x-plugin-status-variables.html#statvar_Mysqlx_crud_insert)

O número de pedidos de inserção recebidos.

* `Mysqlx_crud_modify_view`(x-plugin-status-variables.html#statvar_Mysqlx_crud_modify_view)

O número de solicitações de modificação de visualização recebidas.

* `Mysqlx_crud_update`(x-plugin-status-variables.html#statvar_Mysqlx_crud_update)

O número de solicitações de atualização recebidas.

* `Mysqlx_errors_sent`(x-plugin-status-variables.html#statvar_Mysqlx_errors_sent)

O número de erros enviados aos clientes.

* `Mysqlx_errors_unknown_message_type`(x-plugin-status-variables.html#statvar_Mysqlx_errors_unknown_message_type)

O número de tipos de mensagens desconhecidas que foram recebidos.

* `Mysqlx_expect_close`(x-plugin-status-variables.html#statvar_Mysqlx_expect_close)

O número de blocos de expectativa fechados.

* `Mysqlx_expect_open`(x-plugin-status-variables.html#statvar_Mysqlx_expect_open)

Número de blocos de expectativa abertos.

* `Mysqlx_init_error`(x-plugin-status-variables.html#statvar_Mysqlx_init_error)

O número de erros durante a inicialização.

* `Mysqlx_notice_other_sent`(x-plugin-status-variables.html#statvar_Mysqlx_notice_other_sent)

O número de outros tipos de notificações enviadas de volta aos clientes.

* `Mysqlx_notice_warning_sent`(x-plugin-status-variables.html#statvar_Mysqlx_notice_warning_sent)

O número de avisos enviados de volta aos clientes.

* `Mysqlx_port`(x-plugin-status-variables.html#statvar_Mysqlx_port)

O porto TCP ao qual o X Plugin está ouvindo. Se uma ligação de rede falhou, ou se a variável do sistema
`skip_networking`(server-system-variables.html#sysvar_skip_networking) estiver habilitada, o valor mostra
`UNDEFINED`.

* `Mysqlx_rows_sent`(x-plugin-status-variables.html#statvar_Mysqlx_rows_sent)

O número de strings enviadas de volta aos clientes.

* `Mysqlx_sessions`(x-plugin-status-variables.html#statvar_Mysqlx_sessions)

O número de sessões que foram abertas.

* `Mysqlx_sessions_accepted`(x-plugin-status-variables.html#statvar_Mysqlx_sessions_accepted)

O número de tentativas de sessão que foram aceitas.

* `Mysqlx_sessions_closed`(x-plugin-status-variables.html#statvar_Mysqlx_sessions_closed)

O número de sessões que foram fechadas.

* `Mysqlx_sessions_fatal_error`(x-plugin-status-variables.html#statvar_Mysqlx_sessions_fatal_error)

O número de sessões que foram encerradas com um erro fatal.

* `Mysqlx_sessions_killed`(x-plugin-status-variables.html#statvar_Mysqlx_sessions_killed)

O número de sessões que foram eliminadas.

* `Mysqlx_sessions_rejected`(x-plugin-status-variables.html#statvar_Mysqlx_sessions_rejected)

O número de tentativas de sessão que foram rejeitadas.

* `Mysqlx_socket`(x-plugin-status-variables.html#statvar_Mysqlx_socket)

O socket Unix ao qual o X Plugin está ouvindo.

* `Mysqlx_ssl_accept_renegotiates`(x-plugin-status-variables.html#statvar_Mysqlx_ssl_accept_renegotiates)

O número de negociações necessárias para estabelecer a conexão.

* `Mysqlx_ssl_accepts`(x-plugin-status-variables.html#statvar_Mysqlx_ssl_accepts)

O número de conexões SSL aceitas.

* `Mysqlx_ssl_active`(x-plugin-status-variables.html#statvar_Mysqlx_ssl_active)

Se o SSL estiver ativo.

* `Mysqlx_ssl_cipher`(x-plugin-status-variables.html#statvar_Mysqlx_ssl_cipher)

O cifrador SSL atual (vazio para conexões sem SSL).

* `Mysqlx_ssl_cipher_list`(x-plugin-status-variables.html#statvar_Mysqlx_ssl_cipher_list)

Uma lista de possíveis cifradores SSL (vazia para conexões sem SSL).

* `Mysqlx_ssl_ctx_verify_depth`(x-plugin-status-variables.html#statvar_Mysqlx_ssl_ctx_verify_depth)

O limite de profundidade de verificação de certificado atualmente definido em ctx.

* `Mysqlx_ssl_ctx_verify_mode`(x-plugin-status-variables.html#statvar_Mysqlx_ssl_ctx_verify_mode)

O modo de verificação de certificado atualmente definido em ctx.

* `Mysqlx_ssl_finished_accepts`(x-plugin-status-variables.html#statvar_Mysqlx_ssl_finished_accepts)

O número de conexões SSL bem-sucedidas ao servidor.

* `Mysqlx_ssl_server_not_after`(x-plugin-status-variables.html#statvar_Mysqlx_ssl_server_not_after)

A última data em que o certificado SSL é válido.

* `Mysqlx_ssl_server_not_before`(x-plugin-status-variables.html#statvar_Mysqlx_ssl_server_not_before)

A primeira data em que o certificado SSL é válido.

* `Mysqlx_ssl_verify_depth`(x-plugin-status-variables.html#statvar_Mysqlx_ssl_verify_depth)

A profundidade de verificação de certificado para conexões SSL.

* `Mysqlx_ssl_verify_mode`(x-plugin-status-variables.html#statvar_Mysqlx_ssl_verify_mode)

O modo de verificação de certificado para conexões SSL.

* `Mysqlx_ssl_version`(x-plugin-status-variables.html#statvar_Mysqlx_ssl_version)

O nome do protocolo utilizado para conexões SSL.

* `Mysqlx_stmt_create_collection`(x-plugin-status-variables.html#statvar_Mysqlx_stmt_create_collection)

Número de declarações de criação de coleção recebidas.

* `Mysqlx_stmt_create_collection_index`(x-plugin-status-variables.html#statvar_Mysqlx_stmt_create_collection_index)

Número de declarações de índice de coleção criadas recebidas.

* `Mysqlx_stmt_disable_notices`(x-plugin-status-variables.html#statvar_Mysqlx_stmt_disable_notices)

O número de declarações de aviso de invalidez recebidas.

* `Mysqlx_stmt_drop_collection`(x-plugin-status-variables.html#statvar_Mysqlx_stmt_drop_collection)

O número de declarações de coleta de gotas recebidas.

* `Mysqlx_stmt_drop_collection_index`(x-plugin-status-variables.html#statvar_Mysqlx_stmt_drop_collection_index)

O número de declarações de índices de coleta de gotas recebidas.

* `Mysqlx_stmt_enable_notices`(x-plugin-status-variables.html#statvar_Mysqlx_stmt_enable_notices)

O número de declarações de notificação de ativação recebidas.

* `Mysqlx_stmt_ensure_collection`(x-plugin-status-variables.html#statvar_Mysqlx_stmt_ensure_collection)

O número de declarações de cobrança recebidas.

* `Mysqlx_stmt_execute_mysqlx`(x-plugin-status-variables.html#statvar_Mysqlx_stmt_execute_mysqlx)

O número de mensagens StmtExecute recebidas com o namespace definido como `mysqlx`.

* `Mysqlx_stmt_execute_sql`(x-plugin-status-variables.html#statvar_Mysqlx_stmt_execute_sql)

O número de solicitações StmtExecute recebidas para o namespace SQL.

* `Mysqlx_stmt_execute_xplugin`(x-plugin-status-variables.html#statvar_Mysqlx_stmt_execute_xplugin)

O número de solicitações StmtExecute recebidas para o namespace do plugin X.

* `Mysqlx_stmt_kill_client`(x-plugin-status-variables.html#statvar_Mysqlx_stmt_kill_client)

Número de declarações de clientes que receberam um pedido de morte.

* `Mysqlx_stmt_list_clients`(x-plugin-status-variables.html#statvar_Mysqlx_stmt_list_clients)

Número de declarações recebidas de clientes da lista.

* `Mysqlx_stmt_list_notices`(x-plugin-status-variables.html#statvar_Mysqlx_stmt_list_notices)

O número de declarações de notificação de lista recebidas.

* `Mysqlx_stmt_list_objects`(x-plugin-status-variables.html#statvar_Mysqlx_stmt_list_objects)

Número de declarações de objetos de lista recebidas.

* `Mysqlx_stmt_ping`(x-plugin-status-variables.html#statvar_Mysqlx_stmt_ping)

O número de declarações de ping recebidas.

* `Mysqlx_worker_threads`(x-plugin-status-variables.html#statvar_Mysqlx_worker_threads)

O número de threads de trabalho disponíveis.

* `Mysqlx_worker_threads_active`(x-plugin-status-variables.html#statvar_Mysqlx_worker_threads_active)

O número de threads de trabalho atualmente utilizados.

### 19.4.3 Monitoramento do Plugin X

Para monitorar o X Plugin, use as variáveis de status que ele expõe. Veja [Seção 19.4.2.3, “Variáveis de status do X Plugin”][(x-plugin-status-variables.html "19.4.2.3 X Plugin Status Variables")].