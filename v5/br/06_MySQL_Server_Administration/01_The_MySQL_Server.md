## 5.1 O Servidor MySQL

`mysqld` é o servidor MySQL. A discussão a seguir abrange esses tópicos de configuração do servidor MySQL:

* Opções de inicialização que o servidor suporta. Você pode especificar essas opções na string de comando, através de arquivos de configuração ou em ambos.

* Variáveis do sistema do servidor. Essas variáveis refletem o estado atual e os valores das opções de inicialização, algumas das quais podem ser modificadas enquanto o servidor está em execução.

* Variáveis de status do servidor. Essas variáveis contêm contadores e estatísticas sobre a operação em execução.

* Como configurar o modo SQL do servidor. Esta configuração modifica certos aspectos da sintaxe e semântica do SQL, por exemplo, para compatibilidade com código de outros sistemas de banco de dados, ou para controlar o tratamento de erros para situações específicas.

* Como o servidor gerencia as conexões dos clientes. * Configurando e usando suporte para IPv6. * Configurando e usando suporte para fuso horário. * Capacidades de ajuda no lado do servidor. * O processo de desligamento do servidor. Há considerações de desempenho e confiabilidade, dependendo do tipo de tabela (transacional ou não transacional) e se você usa replicação.

Para uma lista de variáveis e opções do servidor MySQL que foram adicionadas, descontinuadas ou removidas no MySQL 5.7, consulte a Seção 1.4, “Variáveis e opções do servidor e de status adicionadas, descontinuadas ou removidas no MySQL 5.7”.

Nota

Nem todos os motores de armazenamento são suportados por todos os binários e configurações do servidor MySQL. Para descobrir como determinar quais motores de armazenamento sua instalação do MySQL suporta, consulte a Seção 13.7.5.16, “Declaração SHOW ENGINES”.

### 5.1.1 Configurando o servidor

O servidor MySQL, `mysqld`, possui muitas opções de comando e variáveis do sistema que podem ser definidas na inicialização para configurar sua operação. Para determinar os valores padrão das opções de comando e variáveis do sistema usadas pelo servidor, execute este comando:

```sql
$> mysqld --verbose --help
```

O comando produz uma lista de todas as opções de `mysqld` e variáveis de sistema configuráveis. Sua saída inclui os valores padrão de opção e variáveis e parece algo assim:

```sql
abort-slave-event-count           0
allow-suspicious-udfs             FALSE
archive                           ON
auto-increment-increment          1
auto-increment-offset             1
autocommit                        TRUE
automatic-sp-privileges           TRUE
avoid-temporal-upgrade            FALSE
back-log                          80
basedir                           /home/jon/bin/mysql-5.7/
...
tmpdir                            /tmp
transaction-alloc-block-size      8192
transaction-isolation             REPEATABLE-READ
transaction-prealloc-size         4096
transaction-read-only             FALSE
transaction-write-set-extraction  OFF
updatable-views-with-limit        YES
validate-user-plugins             TRUE
verbose                           TRUE
wait-timeout                      28800
```

Para ver os valores atuais das variáveis do sistema que são efetivamente utilizados pelo servidor enquanto ele está em execução, conecte-se a ele e execute a seguinte instrução:

```sql
mysql> SHOW VARIABLES;
```

Para ver alguns indicadores estatísticos e de status de um servidor em execução, execute esta declaração:

```sql
mysql> SHOW STATUS;
```

As informações sobre variáveis e status do sistema também estão disponíveis usando o comando **mysqladmin**:

```sql
$> mysqladmin variables
$> mysqladmin extended-status
```

Para uma descrição completa de todas as opções de comando, variáveis do sistema e variáveis de status, consulte essas seções:

* Seção 5.1.6, “Opções de comando do servidor” * Seção 5.1.7, “Variáveis do sistema do servidor” * Seção 5.1.9, “Variáveis de status do servidor”

Informações mais detalhadas sobre monitoramento estão disponíveis no Schema de Desempenho; veja o Capítulo 25, *Schema de Desempenho MySQL*. Além disso, o esquema MySQL `sys` é um conjunto de objetos que oferece acesso conveniente aos dados coletados pelo Schema de Desempenho; veja o Capítulo 26, *Schema sys MySQL*.

O MySQL utiliza algoritmos que são muito escaláveis, então você geralmente pode executar com muito pouca memória. No entanto, normalmente, melhores resultados de desempenho resultam em fornecer mais memória ao MySQL.

Ao sintonizar um servidor MySQL, as duas variáveis mais importantes a serem configuradas são `key_buffer_size` e `table_open_cache`. Você deve primeiro ter certeza de que essas variáveis estão configuradas corretamente antes de tentar alterar outras variáveis.

Os exemplos a seguir indicam alguns valores variáveis típicos para diferentes configurações de execução.

* Se você tem pelo menos 1 a 2 GB de memória e muitas tabelas e deseja o máximo de desempenho com um número moderado de clientes, use algo como este:

  ```sql
  $> mysqld_safe --key_buffer_size=384M --table_open_cache=4000 \
             --sort_buffer_size=4M --read_buffer_size=1M &
  ```

* Se você tem apenas 256 MB de memória e apenas algumas tabelas, mas ainda faz muitas ordenações, você pode usar algo assim:

  ```sql
  $> mysqld_safe --key_buffer_size=64M --sort_buffer_size=1M
  ```

Se houver muitas conexões simultâneas, podem ocorrer problemas de troca, a menos que `mysqld` tenha sido configurado para usar muito pouca memória para cada conexão. `mysqld` funciona melhor se você tiver memória suficiente para todas as conexões.

* Com pouca memória e muitas conexões, use algo assim:

  ```sql
  $> mysqld_safe --key_buffer_size=512K --sort_buffer_size=100K \
             --read_buffer_size=100K &
  ```

Ou até mesmo:

  ```sql
  $> mysqld_safe --key_buffer_size=512K --sort_buffer_size=16K \
             --table_open_cache=32 --read_buffer_size=8K \
             --net_buffer_length=1K &
  ```

Se você estiver realizando operações `GROUP BY` ou `ORDER BY` em tabelas que são muito maiores do que a sua memória disponível, aumente o valor de `read_rnd_buffer_size` para acelerar a leitura de strings após operações de ordenação.

Se você especificar uma opção na string de comando para `mysqld` ou `mysqld_safe`, ela permanecerá em vigor apenas para essa invocação do servidor. Para usar a opção toda vez que o servidor for executado, coloque-a em um arquivo de opção. Veja a Seção 4.2.2.2, “Usando arquivos de opção”.

### 5.1.2 Configurações Padrão do Servidor

O servidor MySQL tem muitos parâmetros de operação, que você pode alterar na inicialização do servidor usando opções de string de comando ou arquivos de configuração (arquivos de opção). Também é possível alterar muitos parâmetros em tempo de execução. Para instruções gerais sobre a configuração de parâmetros na inicialização ou em tempo de execução, consulte a Seção 5.1.6, “Opções de comando do servidor”, e a Seção 5.1.7, “Variáveis do sistema do servidor”.

No Windows, o Instalador do MySQL interage com o usuário e cria um arquivo chamado `my.ini` no diretório de instalação básica como o arquivo de opção padrão. Se você instalar no Windows a partir de um arquivo Zip, pode copiar o arquivo de modelo `my-default.ini` no diretório de instalação básica para `my.ini` e usar este último como o arquivo de opção padrão.

Nota

A partir do MySQL 5.7.18, `my-default.ini` não está mais incluído ou instalado pelos pacotes de distribuição.

Nota

Em Windows, a extensão de arquivo da opção `.ini` ou `.cnf` pode não ser exibida.

Após completar o processo de instalação, você pode editar o arquivo de opção padrão a qualquer momento para modificar os parâmetros usados pelo servidor. Por exemplo, para usar um ajuste de parâmetro no arquivo que está comentado com um caractere `#` no início da string, remova o `#`, e modifique o valor do parâmetro, se necessário. Para desabilitar um ajuste, adicione um `#` ao início da string ou remova-o.

Para plataformas que não são do Windows, não é criado um arquivo de opção padrão durante a instalação do servidor ou o processo de inicialização do diretório de dados. Crie seu arquivo de opção seguindo as instruções fornecidas na Seção 4.2.2.2, “Usando arquivos de opção”. Sem um arquivo de opção, o servidor apenas começa com suas configurações padrão — veja a Seção 5.1.2, “Configurações padrão de servidor” sobre como verificar essas configurações.

Para obter informações adicionais sobre o formato e a sintaxe do arquivo de opções, consulte a Seção 4.2.2.2, “Usando arquivos de opção”.

### 5.1.3 Referência à opção do servidor, variável do sistema e variável de status

A tabela a seguir lista todas as opções de string de comando, variáveis de sistema e variáveis de status aplicáveis dentro de `mysqld`.

A tabela lista as opções de string de comando (Cmd-line), as opções válidas em arquivos de configuração (Arquivo de opção), as variáveis do sistema do servidor (Var do sistema) e as variáveis de status (Var de status) em uma lista unificada, com indicação de onde cada opção ou variável é válida. Se uma opção do servidor definida na string de comando ou em um arquivo de opção difere do nome da variável do sistema correspondente, o nome da variável é indicado imediatamente abaixo da opção correspondente. Para variáveis de sistema e de status, o escopo da variável (Var Scope) é Global, Sessão ou ambos. Consulte as descrições dos itens correspondentes para obter detalhes sobre a configuração e uso das opções e variáveis. Quando apropriado, são fornecidos links diretos para informações adicionais sobre os itens.

Para uma versão desta tabela específica para o NDB Cluster, consulte a Seção 21.4.2.5, “Referência de opção e variável do NDB Cluster mysqld”.

**Tabela 5.1 Resumo das opções de string de comando, variáveis de sistema e variáveis de status**

<table>
<thead>
<tr>
<th>Name</th>
<th>Cmd-Line</th>
<th>Option File</th>
<th>System Var</th>
<th>Status Var</th>
<th>Var Scope</th>
<th>Dynamic</th>
</tr>
</thead>
<tbody>
<tr>
<th>abort-slave-event-count</th>
<td>Yes</td>
<td>Yes</td>
<td></td>
<td></td>
<td></td>
<td></td>
</tr>
<tr>
<th>Aborted_clients</th>
<td></td>
<td></td>
<td></td>
<td>Yes</td>
<td>Global</td>
<td>No</td>
</tr>
<tr>
<th>Aborted_connects</th>
<td></td>
<td></td>
<td></td>
<td>Yes</td>
<td>Global</td>
<td>No</td>
</tr>
<tr>
<th>allow-suspicious-udfs</th>
<td>Yes</td>
<td>Yes</td>
<td></td>
<td></td>
<td></td>
<td></td>
</tr>
<tr>
<th>ansi</th>
<td>Yes</td>
<td>Yes</td>
<td></td>
<td></td>
<td></td>
<td></td>
</tr>
<tr>
<th>audit-log</th>
<td>Yes</td>
<td>Yes</td>
<td></td>
<td></td>
<td></td>
<td></td>
</tr>
<tr>
<th>audit_log_buffer_size</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td></td>
<td>Global</td>
<td>No</td>
</tr>
<tr>
<th>audit_log_compression</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td></td>
<td>Global</td>
<td>No</td>
</tr>
<tr>
<th>audit_log_connection_policy</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td></td>
<td>Global</td>
<td>Yes</td>
</tr>
<tr>
<th>audit_log_current_session</th>
<td></td>
<td></td>
<td>Yes</td>
<td></td>
<td>Both</td>
<td>No</td>
</tr>
<tr>
<th>Audit_log_current_size</th>
<td></td>
<td></td>
<td></td>
<td>Yes</td>
<td>Global</td>
<td>No</td>
</tr>
<tr>
<th>audit_log_disable</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td></td>
<td>Global</td>
<td>Yes</td>
</tr>
<tr>
<th>audit_log_encryption</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td></td>
<td>Global</td>
<td>No</td>
</tr>
<tr>
<th>Audit_log_event_max_drop_size</th>
<td></td>
<td></td>
<td></td>
<td>Yes</td>
<td>Global</td>
<td>No</td>
</tr>
<tr>
<th>Audit_log_events</th>
<td></td>
<td></td>
<td></td>
<td>Yes</td>
<td>Global</td>
<td>No</td>
</tr>
<tr>
<th>Audit_log_events_filtered</th>
<td></td>
<td></td>
<td></td>
<td>Yes</td>
<td>Global</td>
<td>No</td>
</tr>
<tr>
<th>Audit_log_events_lost</th>
<td></td>
<td></td>
<td></td>
<td>Yes</td>
<td>Global</td>
<td>No</td>
</tr>
<tr>
<th>Audit_log_events_written</th>
<td></td>
<td></td>
<td></td>
<td>Yes</td>
<td>Global</td>
<td>No</td>
</tr>
<tr>
<th>audit_log_exclude_accounts</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td></td>
<td>Global</td>
<td>Yes</td>
</tr>
<tr>
<th>audit_log_file</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td></td>
<td>Global</td>
<td>No</td>
</tr>
<tr>
<th>audit_log_filter_id</th>
<td></td>
<td></td>
<td>Yes</td>
<td></td>
<td>Both</td>
<td>No</td>
</tr>
<tr>
<th>audit_log_flush</th>
<td></td>
<td></td>
<td>Yes</td>
<td></td>
<td>Global</td>
<td>Yes</td>
</tr>
<tr>
<th>audit_log_format</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td></td>
<td>Global</td>
<td>No</td>
</tr>
<tr>
<th>audit_log_format_unix_timestamp</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td></td>
<td>Global</td>
<td>Yes</td>
</tr>
<tr>
<th>audit_log_include_accounts</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td></td>
<td>Global</td>
<td>Yes</td>
</tr>
<tr>
<th>audit_log_policy</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td></td>
<td>Global</td>
<td>No</td>
</tr>
<tr>
<th>audit_log_read_buffer_size</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td></td>
<td>Varies</td>
<td>Varies</td>
</tr>
<tr>
<th>audit_log_rotate_on_size</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td></td>
<td>Global</td>
<td>Yes</td>
</tr>
<tr>
<th>audit_log_statement_policy</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td></td>
<td>Global</td>
<td>Yes</td>
</tr>
<tr>
<th>audit_log_strategy</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td></td>
<td>Global</td>
<td>No</td>
</tr>
<tr>
<th>Audit_log_total_size</th>
<td></td>
<td></td>
<td></td>
<td>Yes</td>
<td>Global</td>
<td>No</td>
</tr>
<tr>
<th>Audit_log_write_waits</th>
<td></td>
<td></td>
<td></td>
<td>Yes</td>
<td>Global</td>
<td>No</td>
</tr>
<tr>
<th>authentication_ldap_sasl_auth_method_name</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td></td>
<td>Global</td>
<td>Yes</td>
</tr>
<tr>
<th>authentication_ldap_sasl_bind_base_dn</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td></td>
<td>Global</td>
<td>Yes</td>
</tr>
<tr>
<th>authentication_ldap_sasl_bind_root_dn</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td></td>
<td>Global</td>
<td>Yes</td>
</tr>
<tr>
<th>authentication_ldap_sasl_bind_root_pwd</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td></td>
<td>Global</td>
<td>Yes</td>
</tr>
<tr>
<th>authentication_ldap_sasl_ca_path</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td></td>
<td>Global</td>
<td>Yes</td>
</tr>
<tr>
<th>authentication_ldap_sasl_group_search_attr</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td></td>
<td>Global</td>
<td>Yes</td>
</tr>
<tr>
<th>authentication_ldap_sasl_group_search_filter</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td></td>
<td>Global</td>
<td>Yes</td>
</tr>
<tr>
<th>authentication_ldap_sasl_init_pool_size</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td></td>
<td>Global</td>
<td>Yes</td>
</tr>
<tr>
<th>authentication_ldap_sasl_log_status</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td></td>
<td>Global</td>
<td>Yes</td>
</tr>
<tr>
<th>authentication_ldap_sasl_max_pool_size</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td></td>
<td>Global</td>
<td>Yes</td>
</tr>
<tr>
<th>authentication_ldap_sasl_server_host</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td></td>
<td>Global</td>
<td>Yes</td>
</tr>
<tr>
<th>authentication_ldap_sasl_server_port</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td></td>
<td>Global</td>
<td>Yes</td>
</tr>
<tr>
<th>authentication_ldap_sasl_tls</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td></td>
<td>Global</td>
<td>Yes</td>
</tr>
<tr>
<th>authentication_ldap_sasl_user_search_attr</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td></td>
<td>Global</td>
<td>Yes</td>
</tr>
<tr>
<th>authentication_ldap_simple_auth_method_name</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td></td>
<td>Global</td>
<td>Yes</td>
</tr>
<tr>
<th>authentication_ldap_simple_bind_base_dn</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td></td>
<td>Global</td>
<td>Yes</td>
</tr>
<tr>
<th>authentication_ldap_simple_bind_root_dn</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td></td>
<td>Global</td>
<td>Yes</td>
</tr>
<tr>
<th>authentication_ldap_simple_bind_root_pwd</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td></td>
<td>Global</td>
<td>Yes</td>
</tr>
<tr>
<th>authentication_ldap_simple_ca_path</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td></td>
<td>Global</td>
<td>Yes</td>
</tr>
<tr>
<th>authentication_ldap_simple_group_search_attr</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td></td>
<td>Global</td>
<td>Yes</td>
</tr>
<tr>
<th>authentication_ldap_simple_group_search_filter</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td></td>
<td>Global</td>
<td>Yes</td>
</tr>
<tr>
<th>authentication_ldap_simple_init_pool_size</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td></td>
<td>Global</td>
<td>Yes</td>
</tr>
<tr>
<th>authentication_ldap_simple_log_status</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td></td>
<td>Global</td>
<td>Yes</td>
</tr>
<tr>
<th>authentication_ldap_simple_max_pool_size</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td></td>
<td>Global</td>
<td>Yes</td>
</tr>
<tr>
<th>authentication_ldap_simple_server_host</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td></td>
<td>Global</td>
<td>Yes</td>
</tr>
<tr>
<th>authentication_ldap_simple_server_port</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td></td>
<td>Global</td>
<td>Yes</td>
</tr>
<tr>
<th>authentication_ldap_simple_tls</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td></td>
<td>Global</td>
<td>Yes</td>
</tr>
<tr>
<th>authentication_ldap_simple_user_search_attr</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td></td>
<td>Global</td>
<td>Yes</td>
</tr>
<tr>
<th>authentication_windows_log_level</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td></td>
<td>Global</td>
<td>No</td>
</tr>
<tr>
<th>authentication_windows_use_principal_name</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td></td>
<td>Global</td>
<td>No</td>
</tr>
<tr>
<th>auto_generate_certs</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td></td>
<td>Global</td>
<td>No</td>
</tr>
<tr>
<th>auto_increment_increment</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td></td>
<td>Both</td>
<td>Yes</td>
</tr>
<tr>
<th>auto_increment_offset</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td></td>
<td>Both</td>
<td>Yes</td>
</tr>
<tr>
<th>autocommit</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td></td>
<td>Both</td>
<td>Yes</td>
</tr>
<tr>
<th>automatic_sp_privileges</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td></td>
<td>Global</td>
<td>Yes</td>
</tr>
<tr>
<th>avoid_temporal_upgrade</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td></td>
<td>Global</td>
<td>Yes</td>
</tr>
<tr>
<th>back_log</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td></td>
<td>Global</td>
<td>No</td>
</tr>
<tr>
<th>basedir</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td></td>
<td>Global</td>
<td>No</td>
</tr>
<tr>
<th>big_tables</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td></td>
<td>Both</td>
<td>Yes</td>
</tr>
<tr>
<th>bind_address</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td></td>
<td>Global</td>
<td>No</td>
</tr>
<tr>
<th>Binlog_cache_disk_use</th>
<td></td>
<td></td>
<td></td>
<td>Yes</td>
<td>Global</td>
<td>No</td>
</tr>
<tr>
<th>binlog_cache_size</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td></td>
<td>Global</td>
<td>Yes</td>
</tr>
<tr>
<th>Binlog_cache_use</th>
<td></td>
<td></td>
<td></td>
<td>Yes</td>
<td>Global</td>
<td>No</td>
</tr>
<tr>
<th>binlog-checksum</th>
<td>Yes</td>
<td>Yes</td>
<td></td>
<td></td>
<td></td>
<td></td>
</tr>
<tr>
<th>binlog_checksum</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td></td>
<td>Global</td>
<td>Yes</td>
</tr>
<tr>
<th>binlog_direct_non_transactional_updates</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td></td>
<td>Both</td>
<td>Yes</td>
</tr>
<tr>
<th>binlog-do-db</th>
<td>Yes</td>
<td>Yes</td>
<td></td>
<td></td>
<td></td>
<td></td>
</tr>
<tr>
<th>binlog_error_action</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td></td>
<td>Global</td>
<td>Yes</td>
</tr>
<tr>
<th>binlog_format</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td></td>
<td>Both</td>
<td>Yes</td>
</tr>
<tr>
<th>binlog_group_commit_sync_delay</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td></td>
<td>Global</td>
<td>Yes</td>
</tr>
<tr>
<th>binlog_group_commit_sync_no_delay_count</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td></td>
<td>Global</td>
<td>Yes</td>
</tr>
<tr>
<th>binlog_gtid_simple_recovery</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td></td>
<td>Global</td>
<td>No</td>
</tr>
<tr>
<th>binlog-ignore-db</th>
<td>Yes</td>
<td>Yes</td>
<td></td>
<td></td>
<td></td>
<td></td>
</tr>
<tr>
<th>binlog_max_flush_queue_time</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td></td>
<td>Global</td>
<td>Yes</td>
</tr>
<tr>
<th>binlog_order_commits</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td></td>
<td>Global</td>
<td>Yes</td>
</tr>
<tr>
<th>binlog-row-event-max-size</th>
<td>Yes</td>
<td>Yes</td>
<td></td>
<td></td>
<td></td>
<td></td>
</tr>
<tr>
<th>binlog_row_image</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td></td>
<td>Both</td>
<td>Yes</td>
</tr>
<tr>
<th>binlog_rows_query_log_events</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td></td>
<td>Both</td>
<td>Yes</td>
</tr>
<tr>
<th>Binlog_stmt_cache_disk_use</th>
<td></td>
<td></td>
<td></td>
<td>Yes</td>
<td>Global</td>
<td>No</td>
</tr>
<tr>
<th>binlog_stmt_cache_size</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td></td>
<td>Global</td>
<td>Yes</td>
</tr>
<tr>
<th>Binlog_stmt_cache_use</th>
<td></td>
<td></td>
<td></td>
<td>Yes</td>
<td>Global</td>
<td>No</td>
</tr>
<tr>
<th>binlog_transaction_dependency_history_size</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td></td>
<td>Global</td>
<td>Yes</td>
</tr>
<tr>
<th>binlog_transaction_dependency_tracking</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td></td>
<td>Global</td>
<td>Yes</td>
</tr>
<tr>
<th>block_encryption_mode</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td></td>
<td>Both</td>
<td>Yes</td>
</tr>
<tr>
<th>bootstrap</th>
<td>Yes</td>
<td>Yes</td>
<td></td>
<td></td>
<td></td>
<td></td>
</tr>
<tr>
<th>bulk_insert_buffer_size</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td></td>
<td>Both</td>
<td>Yes</td>
</tr>
<tr>
<th>Bytes_received</th>
<td></td>
<td></td>
<td></td>
<td>Yes</td>
<td>Both</td>
<td>No</td>
</tr>
<tr>
<th>Bytes_sent</th>
<td></td>
<td></td>
<td></td>
<td>Yes</td>
<td>Both</td>
<td>No</td>
</tr>
<tr>
<th>character_set_client</th>
<td></td>
<td></td>
<td>Yes</td>
<td></td>
<td>Both</td>
<td>Yes</td>
</tr>
<tr>
<th>character-set-client-handshake</th>
<td>Yes</td>
<td>Yes</td>
<td></td>
<td></td>
<td></td>
<td></td>
</tr>
<tr>
<th>character_set_connection</th>
<td></td>
<td></td>
<td>Yes</td>
<td></td>
<td>Both</td>
<td>Yes</td>
</tr>
<tr>
<th>character_set_database (note 1)</th>
<td></td>
<td></td>
<td>Yes</td>
<td></td>
<td>Both</td>
<td>Yes</td>
</tr>
<tr>
<th>character_set_filesystem</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td></td>
<td>Both</td>
<td>Yes</td>
</tr>
<tr>
<th>character_set_results</th>
<td></td>
<td></td>
<td>Yes</td>
<td></td>
<td>Both</td>
<td>Yes</td>
</tr>
<tr>
<th>character_set_server</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td></td>
<td>Both</td>
<td>Yes</td>
</tr>
<tr>
<th>character_set_system</th>
<td></td>
<td></td>
<td>Yes</td>
<td></td>
<td>Global</td>
<td>No</td>
</tr>
<tr>
<th>character_sets_dir</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td></td>
<td>Global</td>
<td>No</td>
</tr>
<tr>
<th>check_proxy_users</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td></td>
<td>Global</td>
<td>Yes</td>
</tr>
<tr>
<th>chroot</th>
<td>Yes</td>
<td>Yes</td>
<td></td>
<td></td>
<td></td>
<td></td>
</tr>
<tr>
<th>collation_connection</th>
<td></td>
<td></td>
<td>Yes</td>
<td></td>
<td>Both</td>
<td>Yes</td>
</tr>
<tr>
<th>collation_database (note 1)</th>
<td></td>
<td></td>
<td>Yes</td>
<td></td>
<td>Both</td>
<td>Yes</td>
</tr>
<tr>
<th>collation_server</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td></td>
<td>Both</td>
<td>Yes</td>
</tr>
<tr>
<th>Com_admin_commands</th>
<td></td>
<td></td>
<td></td>
<td>Yes</td>
<td>Both</td>
<td>No</td>
</tr>
<tr>
<th>Com_alter_db</th>
<td></td>
<td></td>
<td></td>
<td>Yes</td>
<td>Both</td>
<td>No</td>
</tr>
<tr>
<th>Com_alter_db_upgrade</th>
<td></td>
<td></td>
<td></td>
<td>Yes</td>
<td>Both</td>
<td>No</td>
</tr>
<tr>
<th>Com_alter_event</th>
<td></td>
<td></td>
<td></td>
<td>Yes</td>
<td>Both</td>
<td>No</td>
</tr>
<tr>
<th>Com_alter_function</th>
<td></td>
<td></td>
<td></td>
<td>Yes</td>
<td>Both</td>
<td>No</td>
</tr>
<tr>
<th>Com_alter_procedure</th>
<td></td>
<td></td>
<td></td>
<td>Yes</td>
<td>Both</td>
<td>No</td>
</tr>
<tr>
<th>Com_alter_server</th>
<td></td>
<td></td>
<td></td>
<td>Yes</td>
<td>Both</td>
<td>No</td>
</tr>
<tr>
<th>Com_alter_table</th>
<td></td>
<td></td>
<td></td>
<td>Yes</td>
<td>Both</td>
<td>No</td>
</tr>
<tr>
<th>Com_alter_tablespace</th>
<td></td>
<td></td>
<td></td>
<td>Yes</td>
<td>Both</td>
<td>No</td>
</tr>
<tr>
<th>Com_alter_user</th>
<td></td>
<td></td>
<td></td>
<td>Yes</td>
<td>Both</td>
<td>No</td>
</tr>
<tr>
<th>Com_analyze</th>
<td></td>
<td></td>
<td></td>
<td>Yes</td>
<td>Both</td>
<td>No</td>
</tr>
<tr>
<th>Com_assign_to_keycache</th>
<td></td>
<td></td>
<td></td>
<td>Yes</td>
<td>Both</td>
<td>No</td>
</tr>
<tr>
<th>Com_begin</th>
<td></td>
<td></td>
<td></td>
<td>Yes</td>
<td>Both</td>
<td>No</td>
</tr>
<tr>
<th>Com_binlog</th>
<td></td>
<td></td>
<td></td>
<td>Yes</td>
<td>Both</td>
<td>No</td>
</tr>
<tr>
<th>Com_call_procedure</th>
<td></td>
<td></td>
<td></td>
<td>Yes</td>
<td>Both</td>
<td>No</td>
</tr>
<tr>
<th>Com_change_db</th>
<td></td>
<td></td>
<td></td>
<td>Yes</td>
<td>Both</td>
<td>No</td>
</tr>
<tr>
<th>Com_change_master</th>
<td></td>
<td></td>
<td></td>
<td>Yes</td>
<td>Both</td>
<td>No</td>
</tr>
<tr>
<th>Com_change_repl_filter</th>
<td></td>
<td></td>
<td></td>
<td>Yes</td>
<td>Both</td>
<td>No</td>
</tr>
<tr>
<th>Com_check</th>
<td></td>
<td></td>
<td></td>
<td>Yes</td>
<td>Both</td>
<td>No</td>
</tr>
<tr>
<th>Com_checksum</th>
<td></td>
<td></td>
<td></td>
<td>Yes</td>
<td>Both</td>
<td>No</td>
</tr>
<tr>
<th>Com_commit</th>
<td></td>
<td></td>
<td></td>
<td>Yes</td>
<td>Both</td>
<td>No</td>
</tr>
<tr>
<th>Com_create_db</th>
<td></td>
<td></td>
<td></td>
<td>Yes</td>
<td>Both</td>
<td>No</td>
</tr>
<tr>
<th>Com_create_event</th>
<td></td>
<td></td>
<td></td>
<td>Yes</td>
<td>Both</td>
<td>No</td>
</tr>
<tr>
<th>Com_create_function</th>
<td></td>
<td></td>
<td></td>
<td>Yes</td>
<td>Both</td>
<td>No</td>
</tr>
<tr>
<th>Com_create_index</th>
<td></td>
<td></td>
<td></td>
<td>Yes</td>
<td>Both</td>
<td>No</td>
</tr>
<tr>
<th>Com_create_procedure</th>
<td></td>
<td></td>
<td></td>
<td>Yes</td>
<td>Both</td>
<td>No</td>
</tr>
<tr>
<th>Com_create_server</th>
<td></td>
<td></td>
<td></td>
<td>Yes</td>
<td>Both</td>
<td>No</td>
</tr>
<tr>
<th>Com_create_table</th>
<td></td>
<td></td>
<td></td>
<td>Yes</td>
<td>Both</td>
<td>No</td>
</tr>
<tr>
<th>Com_create_trigger</th>
<td></td>
<td></td>
<td></td>
<td>Yes</td>
<td>Both</td>
<td>No</td>
</tr>
<tr>
<th>Com_create_udf</th>
<td></td>
<td></td>
<td></td>
<td>Yes</td>
<td>Both</td>
<td>No</td>
</tr>
<tr>
<th>Com_create_user</th>
<td></td>
<td></td>
<td></td>
<td>Yes</td>
<td>Both</td>
<td>No</td>
</tr>
<tr>
<th>Com_create_view</th>
<td></td>
<td></td>
<td></td>
<td>Yes</td>
<td>Both</td>
<td>No</td>
</tr>
<tr>
<th>Com_dealloc_sql</th>
<td></td>
<td></td>
<td></td>
<td>Yes</td>
<td>Both</td>
<td>No</td>
</tr>
<tr>
<th>Com_delete</th>
<td></td>
<td></td>
<td></td>
<td>Yes</td>
<td>Both</td>
<td>No</td>
</tr>
<tr>
<th>Com_delete_multi</th>
<td></td>
<td></td>
<td></td>
<td>Yes</td>
<td>Both</td>
<td>No</td>
</tr>
<tr>
<th>Com_do</th>
<td></td>
<td></td>
<td></td>
<td>Yes</td>
<td>Both</td>
<td>No</td>
</tr>
<tr>
<th>Com_drop_db</th>
<td></td>
<td></td>
<td></td>
<td>Yes</td>
<td>Both</td>
<td>No</td>
</tr>
<tr>
<th>Com_drop_event</th>
<td></td>
<td></td>
<td></td>
<td>Yes</td>
<td>Both</td>
<td>No</td>
</tr>
<tr>
<th>Com_drop_function</th>
<td></td>
<td></td>
<td></td>
<td>Yes</td>
<td>Both</td>
<td>No</td>
</tr>
<tr>
<th>Com_drop_index</th>
<td></td>
<td></td>
<td></td>
<td>Yes</td>
<td>Both</td>
<td>No</td>
</tr>
<tr>
<th>Com_drop_procedure</th>
<td></td>
<td></td>
<td></td>
<td>Yes</td>
<td>Both</td>
<td>No</td>
</tr>
<tr>
<th>Com_drop_server</th>
<td></td>
<td></td>
<td></td>
<td>Yes</td>
<td>Both</td>
<td>No</td>
</tr>
<tr>
<th>Com_drop_table</th>
<td></td>
<td></td>
<td></td>
<td>Yes</td>
<td>Both</td>
<td>No</td>
</tr>
<tr>
<th>Com_drop_trigger</th>
<td></td>
<td></td>
<td></td>
<td>Yes</td>
<td>Both</td>
<td>No</td>
</tr>
<tr>
<th>Com_drop_user</th>
<td></td>
<td></td>
<td></td>
<td>Yes</td>
<td>Both</td>
<td>No</td>
</tr>
<tr>
<th>Com_drop_view</th>
<td></td>
<td></td>
<td></td>
<td>Yes</td>
<td>Both</td>
<td>No</td>
</tr>
<tr>
<th>Com_empty_query</th>
<td></td>
<td></td>
<td></td>
<td>Yes</td>
<td>Both</td>
<td>No</td>
</tr>
<tr>
<th>Com_execute_sql</th>
<td></td>
<td></td>
<td></td>
<td>Yes</td>
<td>Both</td>
<td>No</td>
</tr>
<tr>
<th>Com_explain_other</th>
<td></td>
<td></td>
<td></td>
<td>Yes</td>
<td>Both</td>
<td>No</td>
</tr>
<tr>
<th>Com_flush</th>
<td></td>
<td></td>
<td></td>
<td>Yes</td>
<td>Both</td>
<td>No</td>
</tr>
<tr>
<th>Com_get_diagnostics</th>
<td></td>
<td></td>
<td></td>
<td>Yes</td>
<td>Both</td>
<td>No</td>
</tr>
<tr>
<th>Com_grant</th>
<td></td>
<td></td>
<td></td>
<td>Yes</td>
<td>Both</td>
<td>No</td>
</tr>
<tr>
<th>Com_group_replication_start</th>
<td></td>
<td></td>
<td></td>
<td>Yes</td>
<td>Global</td>
<td>No</td>
</tr>
<tr>
<th>Com_group_replication_stop</th>
<td></td>
<td></td>
<td></td>
<td>Yes</td>
<td>Global</td>
<td>No</td>
</tr>
<tr>
<th>Com_ha_close</th>
<td></td>
<td></td>
<td></td>
<td>Yes</td>
<td>Both</td>
<td>No</td>
</tr>
<tr>
<th>Com_ha_open</th>
<td></td>
<td></td>
<td></td>
<td>Yes</td>
<td>Both</td>
<td>No</td>
</tr>
<tr>
<th>Com_ha_read</th>
<td></td>
<td></td>
<td></td>
<td>Yes</td>
<td>Both</td>
<td>No</td>
</tr>
<tr>
<th>Com_help</th>
<td></td>
<td></td>
<td></td>
<td>Yes</td>
<td>Both</td>
<td>No</td>
</tr>
<tr>
<th>Com_insert</th>
<td></td>
<td></td>
<td></td>
<td>Yes</td>
<td>Both</td>
<td>No</td>
</tr>
<tr>
<th>Com_insert_select</th>
<td></td>
<td></td>
<td></td>
<td>Yes</td>
<td>Both</td>
<td>No</td>
</tr>
<tr>
<th>Com_install_plugin</th>
<td></td>
<td></td>
<td></td>
<td>Yes</td>
<td>Both</td>
<td>No</td>
</tr>
<tr>
<th>Com_kill</th>
<td></td>
<td></td>
<td></td>
<td>Yes</td>
<td>Both</td>
<td>No</td>
</tr>
<tr>
<th>Com_load</th>
<td></td>
<td></td>
<td></td>
<td>Yes</td>
<td>Both</td>
<td>No</td>
</tr>
<tr>
<th>Com_lock_tables</th>
<td></td>
<td></td>
<td></td>
<td>Yes</td>
<td>Both</td>
<td>No</td>
</tr>
<tr>
<th>Com_optimize</th>
<td></td>
<td></td>
<td></td>
<td>Yes</td>
<td>Both</td>
<td>No</td>
</tr>
<tr>
<th>Com_preload_keys</th>
<td></td>
<td></td>
<td></td>
<td>Yes</td>
<td>Both</td>
<td>No</td>
</tr>
<tr>
<th>Com_prepare_sql</th>
<td></td>
<td></td>
<td></td>
<td>Yes</td>
<td>Both</td>
<td>No</td>
</tr>
<tr>
<th>Com_purge</th>
<td></td>
<td></td>
<td></td>
<td>Yes</td>
<td>Both</td>
<td>No</td>
</tr>
<tr>
<th>Com_purge_before_date</th>
<td></td>
<td></td>
<td></td>
<td>Yes</td>
<td>Both</td>
<td>No</td>
</tr>
<tr>
<th>Com_release_savepoint</th>
<td></td>
<td></td>
<td></td>
<td>Yes</td>
<td>Both</td>
<td>No</td>
</tr>
<tr>
<th>Com_rename_table</th>
<td></td>
<td></td>
<td></td>
<td>Yes</td>
<td>Both</td>
<td>No</td>
</tr>
<tr>
<th>Com_rename_user</th>
<td></td>
<td></td>
<td></td>
<td>Yes</td>
<td>Both</td>
<td>No</td>
</tr>
<tr>
<th>Com_repair</th>
<td></td>
<td></td>
<td></td>
<td>Yes</td>
<td>Both</td>
<td>No</td>
</tr>
<tr>
<th>Com_replace</th>
<td></td>
<td></td>
<td></td>
<td>Yes</td>
<td>Both</td>
<td>No</td>
</tr>
<tr>
<th>Com_replace_select</th>
<td></td>
<td></td>
<td></td>
<td>Yes</td>
<td>Both</td>
<td>No</td>
</tr>
<tr>
<th>Com_reset</th>
<td></td>
<td></td>
<td></td>
<td>Yes</td>
<td>Both</td>
<td>No</td>
</tr>
<tr>
<th>Com_resignal</th>
<td></td>
<td></td>
<td></td>
<td>Yes</td>
<td>Both</td>
<td>No</td>
</tr>
<tr>
<th>Com_revoke</th>
<td></td>
<td></td>
<td></td>
<td>Yes</td>
<td>Both</td>
<td>No</td>
</tr>
<tr>
<th>Com_revoke_all</th>
<td></td>
<td></td>
<td></td>
<td>Yes</td>
<td>Both</td>
<td>No</td>
</tr>
<tr>
<th>Com_rollback</th>
<td></td>
<td></td>
<td></td>
<td>Yes</td>
<td>Both</td>
<td>No</td>
</tr>
<tr>
<th>Com_rollback_to_savepoint</th>
<td></td>
<td></td>
<td></td>
<td>Yes</td>
<td>Both</td>
<td>No</td>
</tr>
<tr>
<th>Com_savepoint</th>
<td></td>
<td></td>
<td></td>
<td>Yes</td>
<td>Both</td>
<td>No</td>
</tr>
<tr>
<th>Com_select</th>
<td></td>
<td></td>
<td></td>
<td>Yes</td>
<td>Both</td>
<td>No</td>
</tr>
<tr>
<th>Com_set_option</th>
<td></td>
<td></td>
<td></td>
<td>Yes</td>
<td>Both</td>
<td>No</td>
</tr>
<tr>
<th>Com_show_authors</th>
<td></td>
<td></td>
<td></td>
<td>Yes</td>
<td>Both</td>
<td>No</td>
</tr>
<tr>
<th>Com_show_binlog_events</th>
<td></td>
<td></td>
<td></td>
<td>Yes</td>
<td>Both</td>
<td>No</td>
</tr>
<tr>
<th>Com_show_binlogs</th>
<td></td>
<td></td>
<td></td>
<td>Yes</td>
<td>Both</td>
<td>No</td>
</tr>
<tr>
<th>Com_show_charsets</th>
<td></td>
<td></td>
<td></td>
<td>Yes</td>
<td>Both</td>
<td>No</td>
</tr>
<tr>
<th>Com_show_collations</th>
<td></td>
<td></td>
<td></td>
<td>Yes</td>
<td>Both</td>
<td>No</td>
</tr>
<tr>
<th>Com_show_contributors</th>
<td></td>
<td></td>
<td></td>
<td>Yes</td>
<td>Both</td>
<td>No</td>
</tr>
<tr>
<th>Com_show_create_db</th>
<td></td>
<td></td>
<td></td>
<td>Yes</td>
<td>Both</td>
<td>No</td>
</tr>
<tr>
<th>Com_show_create_event</th>
<td></td>
<td></td>
<td></td>
<td>Yes</td>
<td>Both</td>
<td>No</td>
</tr>
<tr>
<th>Com_show_create_func</th>
<td></td>
<td></td>
<td></td>
<td>Yes</td>
<td>Both</td>
<td>No</td>
</tr>
<tr>
<th>Com_show_create_proc</th>
<td></td>
<td></td>
<td></td>
<td>Yes</td>
<td>Both</td>
<td>No</td>
</tr>
<tr>
<th>Com_show_create_table</th>
<td></td>
<td></td>
<td></td>
<td>Yes</td>
<td>Both</td>
<td>No</td>
</tr>
<tr>
<th>Com_show_create_trigger</th>
<td></td>
<td></td>
<td></td>
<td>Yes</td>
<td>Both</td>
<td>No</td>
</tr>
<tr>
<th>Com_show_create_user</th>
<td></td>
<td></td>
<td></td>
<td>Yes</td>
<td>Both</td>
<td>No</td>
</tr>
<tr>
<th>Com_show_databases</th>
<td></td>
<td></td>
<td></td>
<td>Yes</td>
<td>Both</td>
<td>No</td>
</tr>
<tr>
<th>Com_show_engine_logs</th>
<td></td>
<td></td>
<td></td>
<td>Yes</td>
<td>Both</td>
<td>No</td>
</tr>
<tr>
<th>Com_show_engine_mutex</th>
<td></td>
<td></td>
<td></td>
<td>Yes</td>
<td>Both</td>
<td>No</td>
</tr>
<tr>
<th>Com_show_engine_status</th>
<td></td>
<td></td>
<td></td>
<td>Yes</td>
<td>Both</td>
<td>No</td>
</tr>
<tr>
<th>Com_show_errors</th>
<td></td>
<td></td>
<td></td>
<td>Yes</td>
<td>Both</td>
<td>No</td>
</tr>
<tr>
<th>Com_show_events</th>
<td></td>
<td></td>
<td></td>
<td>Yes</td>
<td>Both</td>
<td>No</td>
</tr>
<tr>
<th>Com_show_fields</th>
<td></td>
<td></td>
<td></td>
<td>Yes</td>
<td>Both</td>
<td>No</td>
</tr>
<tr>
<th>Com_show_function_code</th>
<td></td>
<td></td>
<td></td>
<td>Yes</td>
<td>Both</td>
<td>No</td>
</tr>
<tr>
<th>Com_show_function_status</th>
<td></td>
<td></td>
<td></td>
<td>Yes</td>
<td>Both</td>
<td>No</td>
</tr>
<tr>
<th>Com_show_grants</th>
<td></td>
<td></td>
<td></td>
<td>Yes</td>
<td>Both</td>
<td>No</td>
</tr>
<tr>
<th>Com_show_keys</th>
<td></td>
<td></td>
<td></td>
<td>Yes</td>
<td>Both</td>
<td>No</td>
</tr>
<tr>
<th>Com_show_master_status</th>
<td></td>
<td></td>
<td></td>
<td>Yes</td>
<td>Both</td>
<td>No</td>
</tr>
<tr>
<th>Com_show_ndb_status</th>
<td></td>
<td></td>
<td></td>
<td>Yes</td>
<td>Both</td>
<td>No</td>
</tr>
<tr>
<th>Com_show_open_tables</th>
<td></td>
<td></td>
<td></td>
<td>Yes</td>
<td>Both</td>
<td>No</td>
</tr>
<tr>
<th>Com_show_plugins</th>
<td></td>
<td></td>
<td></td>
<td>Yes</td>
<td>Both</td>
<td>No</td>
</tr>
<tr>
<th>Com_show_privileges</th>
<td></td>
<td></td>
<td></td>
<td>Yes</td>
<td>Both</td>
<td>No</td>
</tr>
<tr>
<th>Com_show_procedure_code</th>
<td></td>
<td></td>
<td></td>
<td>Yes</td>
<td>Both</td>
<td>No</td>
</tr>
<tr>
<th>Com_show_procedure_status</th>
<td></td>
<td></td>
<td></td>
<td>Yes</td>
<td>Both</td>
<td>No</td>
</tr>
<tr>
<th>Com_show_processlist</th>
<td></td>
<td></td>
<td></td>
<td>Yes</td>
<td>Both</td>
<td>No</td>
</tr>
<tr>
<th>Com_show_profile</th>
<td></td>
<td></td>
<td></td>
<td>Yes</td>
<td>Both</td>
<td>No</td>
</tr>
<tr>
<th>Com_show_profiles</th>
<td></td>
<td></td>
<td></td>
<td>Yes</td>
<td>Both</td>
<td>No</td>
</tr>
<tr>
<th>Com_show_relaylog_events</th>
<td></td>
<td></td>
<td></td>
<td>Yes</td>
<td>Both</td>
<td>No</td>
</tr>
<tr>
<th>Com_show_slave_hosts</th>
<td></td>
<td></td>
<td></td>
<td>Yes</td>
<td>Both</td>
<td>No</td>
</tr>
<tr>
<th>Com_show_slave_status</th>
<td></td>
<td></td>
<td></td>
<td>Yes</td>
<td>Both</td>
<td>No</td>
</tr>
<tr>
<th>Com_show_status</th>
<td></td>
<td></td>
<td></td>
<td>Yes</td>
<td>Both</td>
<td>No</td>
</tr>
<tr>
<th>Com_show_storage_engines</th>
<td></td>
<td></td>
<td></td>
<td>Yes</td>
<td>Both</td>
<td>No</td>
</tr>
<tr>
<th>Com_show_table_status</th>
<td></td>
<td></td>
<td></td>
<td>Yes</td>
<td>Both</td>
<td>No</td>
</tr>
<tr>
<th>Com_show_tables</th>
<td></td>
<td></td>
<td></td>
<td>Yes</td>
<td>Both</td>
<td>No</td>
</tr>
<tr>
<th>Com_show_triggers</th>
<td></td>
<td></td>
<td></td>
<td>Yes</td>
<td>Both</td>
<td>No</td>
</tr>
<tr>
<th>Com_show_variables</th>
<td></td>
<td></td>
<td></td>
<td>Yes</td>
<td>Both</td>
<td>No</td>
</tr>
<tr>
<th>Com_show_warnings</th>
<td></td>
<td></td>
<td></td>
<td>Yes</td>
<td>Both</td>
<td>No</td>
</tr>
<tr>
<th>Com_shutdown</th>
<td></td>
<td></td>
<td></td>
<td>Yes</td>
<td>Both</td>
<td>No</td>
</tr>
<tr>
<th>Com_signal</th>
<td></td>
<td></td>
<td></td>
<td>Yes</td>
<td>Both</td>
<td>No</td>
</tr>
<tr>
<th>Com_slave_start</th>
<td></td>
<td></td>
<td></td>
<td>Yes</td>
<td>Both</td>
<td>No</td>
</tr>
<tr>
<th>Com_slave_stop</th>
<td></td>
<td></td>
<td></td>
<td>Yes</td>
<td>Both</td>
<td>No</td>
</tr>
<tr>
<th>Com_stmt_close</th>
<td></td>
<td></td>
<td></td>
<td>Yes</td>
<td>Both</td>
<td>No</td>
</tr>
<tr>
<th>Com_stmt_execute</th>
<td></td>
<td></td>
<td></td>
<td>Yes</td>
<td>Both</td>
<td>No</td>
</tr>
<tr>
<th>Com_stmt_fetch</th>
<td></td>
<td></td>
<td></td>
<td>Yes</td>
<td>Both</td>
<td>No</td>
</tr>
<tr>
<th>Com_stmt_prepare</th>
<td></td>
<td></td>
<td></td>
<td>Yes</td>
<td>Both</td>
<td>No</td>
</tr>
<tr>
<th>Com_stmt_reprepare</th>
<td></td>
<td></td>
<td></td>
<td>Yes</td>
<td>Both</td>
<td>No</td>
</tr>
<tr>
<th>Com_stmt_reset</th>
<td></td>
<td></td>
<td></td>
<td>Yes</td>
<td>Both</td>
<td>No</td>
</tr>
<tr>
<th>Com_stmt_send_long_data</th>
<td></td>
<td></td>
<td></td>
<td>Yes</td>
<td>Both</td>
<td>No</td>
</tr>
<tr>
<th>Com_truncate</th>
<td></td>
<td></td>
<td></td>
<td>Yes</td>
<td>Both</td>
<td>No</td>
</tr>
<tr>
<th>Com_uninstall_plugin</th>
<td></td>
<td></td>
<td></td>
<td>Yes</td>
<td>Both</td>
<td>No</td>
</tr>
<tr>
<th>Com_unlock_tables</th>
<td></td>
<td></td>
<td></td>
<td>Yes</td>
<td>Both</td>
<td>No</td>
</tr>
<tr>
<th>Com_update</th>
<td></td>
<td></td>
<td></td>
<td>Yes</td>
<td>Both</td>
<td>No</td>
</tr>
<tr>
<th>Com_update_multi</th>
<td></td>
<td></td>
<td></td>
<td>Yes</td>
<td>Both</td>
<td>No</td>
</tr>
<tr>
<th>Com_xa_commit</th>
<td></td>
<td></td>
<td></td>
<td>Yes</td>
<td>Both</td>
<td>No</td>
</tr>
<tr>
<th>Com_xa_end</th>
<td></td>
<td></td>
<td></td>
<td>Yes</td>
<td>Both</td>
<td>No</td>
</tr>
<tr>
<th>Com_xa_prepare</th>
<td></td>
<td></td>
<td></td>
<td>Yes</td>
<td>Both</td>
<td>No</td>
</tr>
<tr>
<th>Com_xa_recover</th>
<td></td>
<td></td>
<td></td>
<td>Yes</td>
<td>Both</td>
<td>No</td>
</tr>
<tr>
<th>Com_xa_rollback</th>
<td></td>
<td></td>
<td></td>
<td>Yes</td>
<td>Both</td>
<td>No</td>
</tr>
<tr>
<th>Com_xa_start</th>
<td></td>
<td></td>
<td></td>
<td>Yes</td>
<td>Both</td>
<td>No</td>
</tr>
<tr>
<th>completion_type</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td></td>
<td>Both</td>
<td>Yes</td>
</tr>
<tr>
<th>Compression</th>
<td></td>
<td></td>
<td></td>
<td>Yes</td>
<td>Session</td>
<td>No</td>
</tr>
<tr>
<th>concurrent_insert</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td></td>
<td>Global</td>
<td>Yes</td>
</tr>
<tr>
<th>connect_timeout</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td></td>
<td>Global</td>
<td>Yes</td>
</tr>
<tr>
<th>Connection_control_delay_generated</th>
<td></td>
<td></td>
<td></td>
<td>Yes</td>
<td>Global</td>
<td>No</td>
</tr>
<tr>
<th>connection_control_failed_connections_threshold</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td></td>
<td>Global</td>
<td>Yes</td>
</tr>
<tr>
<th>connection_control_max_connection_delay</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td></td>
<td>Global</td>
<td>Yes</td>
</tr>
<tr>
<th>connection_control_min_connection_delay</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td></td>
<td>Global</td>
<td>Yes</td>
</tr>
<tr>
<th>Connection_errors_accept</th>
<td></td>
<td></td>
<td></td>
<td>Yes</td>
<td>Global</td>
<td>No</td>
</tr>
<tr>
<th>Connection_errors_internal</th>
<td></td>
<td></td>
<td></td>
<td>Yes</td>
<td>Global</td>
<td>No</td>
</tr>
<tr>
<th>Connection_errors_max_connections</th>
<td></td>
<td></td>
<td></td>
<td>Yes</td>
<td>Global</td>
<td>No</td>
</tr>
<tr>
<th>Connection_errors_peer_address</th>
<td></td>
<td></td>
<td></td>
<td>Yes</td>
<td>Global</td>
<td>No</td>
</tr>
<tr>
<th>Connection_errors_select</th>
<td></td>
<td></td>
<td></td>
<td>Yes</td>
<td>Global</td>
<td>No</td>
</tr>
<tr>
<th>Connection_errors_tcpwrap</th>
<td></td>
<td></td>
<td></td>
<td>Yes</td>
<td>Global</td>
<td>No</td>
</tr>
<tr>
<th>Connections</th>
<td></td>
<td></td>
<td></td>
<td>Yes</td>
<td>Global</td>
<td>No</td>
</tr>
<tr>
<th>console</th>
<td>Yes</td>
<td>Yes</td>
<td></td>
<td></td>
<td></td>
<td></td>
</tr>
<tr>
<th>core-file</th>
<td>Yes</td>
<td>Yes</td>
<td></td>
<td></td>
<td></td>
<td></td>
</tr>
<tr>
<th>core_file</th>
<td></td>
<td></td>
<td>Yes</td>
<td></td>
<td>Global</td>
<td>No</td>
</tr>
<tr>
<th>Created_tmp_disk_tables</th>
<td></td>
<td></td>
<td></td>
<td>Yes</td>
<td>Both</td>
<td>No</td>
</tr>
<tr>
<th>Created_tmp_files</th>
<td></td>
<td></td>
<td></td>
<td>Yes</td>
<td>Global</td>
<td>No</td>
</tr>
<tr>
<th>Created_tmp_tables</th>
<td></td>
<td></td>
<td></td>
<td>Yes</td>
<td>Both</td>
<td>No</td>
</tr>
<tr>
<th>daemon_memcached_enable_binlog</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td></td>
<td>Global</td>
<td>No</td>
</tr>
<tr>
<th>daemon_memcached_engine_lib_name</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td></td>
<td>Global</td>
<td>No</td>
</tr>
<tr>
<th>daemon_memcached_engine_lib_path</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td></td>
<td>Global</td>
<td>No</td>
</tr>
<tr>
<th>daemon_memcached_option</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td></td>
<td>Global</td>
<td>No</td>
</tr>
<tr>
<th>daemon_memcached_r_batch_size</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td></td>
<td>Global</td>
<td>No</td>
</tr>
<tr>
<th>daemon_memcached_w_batch_size</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td></td>
<td>Global</td>
<td>No</td>
</tr>
<tr>
<th>daemonize</th>
<td>Yes</td>
<td>Yes</td>
<td></td>
<td></td>
<td></td>
<td></td>
</tr>
<tr>
<th>datadir</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td></td>
<td>Global</td>
<td>No</td>
</tr>
<tr>
<th>date_format</th>
<td></td>
<td></td>
<td>Yes</td>
<td></td>
<td>Global</td>
<td>No</td>
</tr>
<tr>
<th>datetime_format</th>
<td></td>
<td></td>
<td>Yes</td>
<td></td>
<td>Global</td>
<td>No</td>
</tr>
<tr>
<th>debug</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td></td>
<td>Both</td>
<td>Yes</td>
</tr>
<tr>
<th>debug_sync</th>
<td></td>
<td></td>
<td>Yes</td>
<td></td>
<td>Session</td>
<td>Yes</td>
</tr>
<tr>
<th>debug-sync-timeout</th>
<td>Yes</td>
<td>Yes</td>
<td></td>
<td></td>
<td></td>
<td></td>
</tr>
<tr>
<th>default_authentication_plugin</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td></td>
<td>Global</td>
<td>No</td>
</tr>
<tr>
<th>default_password_lifetime</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td></td>
<td>Global</td>
<td>Yes</td>
</tr>
<tr>
<th>default_storage_engine</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td></td>
<td>Both</td>
<td>Yes</td>
</tr>
<tr>
<th>default-time-zone</th>
<td>Yes</td>
<td>Yes</td>
<td></td>
<td></td>
<td></td>
<td></td>
</tr>
<tr>
<th>default_tmp_storage_engine</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td></td>
<td>Both</td>
<td>Yes</td>
</tr>
<tr>
<th>default_week_format</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td></td>
<td>Both</td>
<td>Yes</td>
</tr>
<tr>
<th>defaults-extra-file</th>
<td>Yes</td>
<td></td>
<td></td>
<td></td>
<td></td>
<td></td>
</tr>
<tr>
<th>defaults-file</th>
<td>Yes</td>
<td></td>
<td></td>
<td></td>
<td></td>
<td></td>
</tr>
<tr>
<th>defaults-group-suffix</th>
<td>Yes</td>
<td></td>
<td></td>
<td></td>
<td></td>
<td></td>
</tr>
<tr>
<th>delay_key_write</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td></td>
<td>Global</td>
<td>Yes</td>
</tr>
<tr>
<th>Delayed_errors</th>
<td></td>
<td></td>
<td></td>
<td>Yes</td>
<td>Global</td>
<td>No</td>
</tr>
<tr>
<th>delayed_insert_limit</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td></td>
<td>Global</td>
<td>Yes</td>
</tr>
<tr>
<th>Delayed_insert_threads</th>
<td></td>
<td></td>
<td></td>
<td>Yes</td>
<td>Global</td>
<td>No</td>
</tr>
<tr>
<th>delayed_insert_timeout</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td></td>
<td>Global</td>
<td>Yes</td>
</tr>
<tr>
<th>delayed_queue_size</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td></td>
<td>Global</td>
<td>Yes</td>
</tr>
<tr>
<th>Delayed_writes</th>
<td></td>
<td></td>
<td></td>
<td>Yes</td>
<td>Global</td>
<td>No</td>
</tr>
<tr>
<th>des-key-file</th>
<td>Yes</td>
<td>Yes</td>
<td></td>
<td></td>
<td></td>
<td></td>
</tr>
<tr>
<th>disable-partition-engine-check</th>
<td>Yes</td>
<td>Yes</td>
<td></td>
<td></td>
<td></td>
<td></td>
</tr>
<tr>
<th>disabled_storage_engines</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td></td>
<td>Global</td>
<td>No</td>
</tr>
<tr>
<th>disconnect_on_expired_password</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td></td>
<td>Global</td>
<td>No</td>
</tr>
<tr>
<th>disconnect-slave-event-count</th>
<td>Yes</td>
<td>Yes</td>
<td></td>
<td></td>
<td></td>
<td></td>
</tr>
<tr>
<th>div_precision_increment</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td></td>
<td>Both</td>
<td>Yes</td>
</tr>
<tr>
<th>early-plugin-load</th>
<td>Yes</td>
<td>Yes</td>
<td></td>
<td></td>
<td></td>
<td></td>
</tr>
<tr>
<th>end_markers_in_json</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td></td>
<td>Both</td>
<td>Yes</td>
</tr>
<tr>
<th>enforce_gtid_consistency</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td></td>
<td>Global</td>
<td>Varies</td>
</tr>
<tr>
<th>eq_range_index_dive_limit</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td></td>
<td>Both</td>
<td>Yes</td>
</tr>
<tr>
<th>error_count</th>
<td></td>
<td></td>
<td>Yes</td>
<td></td>
<td>Session</td>
<td>No</td>
</tr>
<tr>
<th>event_scheduler</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td></td>
<td>Global</td>
<td>Yes</td>
</tr>
<tr>
<th>exit-info</th>
<td>Yes</td>
<td>Yes</td>
<td></td>
<td></td>
<td></td>
<td></td>
</tr>
<tr>
<th>expire_logs_days</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td></td>
<td>Global</td>
<td>Yes</td>
</tr>
<tr>
<th>explicit_defaults_for_timestamp</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td></td>
<td>Both</td>
<td>Yes</td>
</tr>
<tr>
<th>external-locking</th>
<td>Yes</td>
<td>Yes</td>
<td></td>
<td></td>
<td></td>
<td></td>
</tr>
<tr>
<th> - <em>Variable</em>: skip_external_locking</th>
<td></td>
<td></td>
<td></td>
<td></td>
<td></td>
<td></td>
</tr>
<tr>
<th>external_user</th>
<td></td>
<td></td>
<td>Yes</td>
<td></td>
<td>Session</td>
<td>No</td>
</tr>
<tr>
<th>federated</th>
<td>Yes</td>
<td>Yes</td>
<td></td>
<td></td>
<td></td>
<td></td>
</tr>
<tr>
<th>Firewall_access_denied</th>
<td></td>
<td></td>
<td></td>
<td>Yes</td>
<td>Global</td>
<td>No</td>
</tr>
<tr>
<th>Firewall_access_granted</th>
<td></td>
<td></td>
<td></td>
<td>Yes</td>
<td>Global</td>
<td>No</td>
</tr>
<tr>
<th>Firewall_access_suspicious</th>
<td></td>
<td></td>
<td></td>
<td>Yes</td>
<td>Global</td>
<td>No</td>
</tr>
<tr>
<th>Firewall_cached_entries</th>
<td></td>
<td></td>
<td></td>
<td>Yes</td>
<td>Global</td>
<td>No</td>
</tr>
<tr>
<th>flush</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td></td>
<td>Global</td>
<td>Yes</td>
</tr>
<tr>
<th>Flush_commands</th>
<td></td>
<td></td>
<td></td>
<td>Yes</td>
<td>Global</td>
<td>No</td>
</tr>
<tr>
<th>flush_time</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td></td>
<td>Global</td>
<td>Yes</td>
</tr>
<tr>
<th>foreign_key_checks</th>
<td></td>
<td></td>
<td>Yes</td>
<td></td>
<td>Both</td>
<td>Yes</td>
</tr>
<tr>
<th>ft_boolean_syntax</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td></td>
<td>Global</td>
<td>Yes</td>
</tr>
<tr>
<th>ft_max_word_len</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td></td>
<td>Global</td>
<td>No</td>
</tr>
<tr>
<th>ft_min_word_len</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td></td>
<td>Global</td>
<td>No</td>
</tr>
<tr>
<th>ft_query_expansion_limit</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td></td>
<td>Global</td>
<td>No</td>
</tr>
<tr>
<th>ft_stopword_file</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td></td>
<td>Global</td>
<td>No</td>
</tr>
<tr>
<th>gdb</th>
<td>Yes</td>
<td>Yes</td>
<td></td>
<td></td>
<td></td>
<td></td>
</tr>
<tr>
<th>general_log</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td></td>
<td>Global</td>
<td>Yes</td>
</tr>
<tr>
<th>general_log_file</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td></td>
<td>Global</td>
<td>Yes</td>
</tr>
<tr>
<th>group_concat_max_len</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td></td>
<td>Both</td>
<td>Yes</td>
</tr>
<tr>
<th>group_replication_allow_local_disjoint_gtids_join</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td></td>
<td>Global</td>
<td>Yes</td>
</tr>
<tr>
<th>group_replication_allow_local_lower_version_join</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td></td>
<td>Global</td>
<td>Yes</td>
</tr>
<tr>
<th>group_replication_auto_increment_increment</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td></td>
<td>Global</td>
<td>Yes</td>
</tr>
<tr>
<th>group_replication_bootstrap_group</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td></td>
<td>Global</td>
<td>Yes</td>
</tr>
<tr>
<th>group_replication_components_stop_timeout</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td></td>
<td>Global</td>
<td>Yes</td>
</tr>
<tr>
<th>group_replication_compression_threshold</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td></td>
<td>Global</td>
<td>Yes</td>
</tr>
<tr>
<th>group_replication_enforce_update_everywhere_checks</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td></td>
<td>Global</td>
<td>Yes</td>
</tr>
<tr>
<th>group_replication_exit_state_action</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td></td>
<td>Global</td>
<td>Yes</td>
</tr>
<tr>
<th>group_replication_flow_control_applier_threshold</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td></td>
<td>Global</td>
<td>Yes</td>
</tr>
<tr>
<th>group_replication_flow_control_certifier_threshold</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td></td>
<td>Global</td>
<td>Yes</td>
</tr>
<tr>
<th>group_replication_flow_control_mode</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td></td>
<td>Global</td>
<td>Yes</td>
</tr>
<tr>
<th>group_replication_force_members</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td></td>
<td>Global</td>
<td>Yes</td>
</tr>
<tr>
<th>group_replication_group_name</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td></td>
<td>Global</td>
<td>Yes</td>
</tr>
<tr>
<th>group_replication_group_seeds</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td></td>
<td>Global</td>
<td>Yes</td>
</tr>
<tr>
<th>group_replication_gtid_assignment_block_size</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td></td>
<td>Global</td>
<td>Yes</td>
</tr>
<tr>
<th>group_replication_ip_whitelist</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td></td>
<td>Global</td>
<td>Yes</td>
</tr>
<tr>
<th>group_replication_local_address</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td></td>
<td>Global</td>
<td>Yes</td>
</tr>
<tr>
<th>group_replication_member_weight</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td></td>
<td>Global</td>
<td>Yes</td>
</tr>
<tr>
<th>group_replication_poll_spin_loops</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td></td>
<td>Global</td>
<td>Yes</td>
</tr>
<tr>
<th>group_replication_primary_member</th>
<td></td>
<td></td>
<td></td>
<td>Yes</td>
<td>Global</td>
<td>No</td>
</tr>
<tr>
<th>group_replication_recovery_complete_at</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td></td>
<td>Global</td>
<td>Yes</td>
</tr>
<tr>
<th>group_replication_recovery_reconnect_interval</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td></td>
<td>Global</td>
<td>Yes</td>
</tr>
<tr>
<th>group_replication_recovery_retry_count</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td></td>
<td>Global</td>
<td>Yes</td>
</tr>
<tr>
<th>group_replication_recovery_ssl_ca</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td></td>
<td>Global</td>
<td>Yes</td>
</tr>
<tr>
<th>group_replication_recovery_ssl_capath</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td></td>
<td>Global</td>
<td>Yes</td>
</tr>
<tr>
<th>group_replication_recovery_ssl_cert</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td></td>
<td>Global</td>
<td>Yes</td>
</tr>
<tr>
<th>group_replication_recovery_ssl_cipher</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td></td>
<td>Global</td>
<td>Yes</td>
</tr>
<tr>
<th>group_replication_recovery_ssl_crl</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td></td>
<td>Global</td>
<td>Yes</td>
</tr>
<tr>
<th>group_replication_recovery_ssl_crlpath</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td></td>
<td>Global</td>
<td>Yes</td>
</tr>
<tr>
<th>group_replication_recovery_ssl_key</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td></td>
<td>Global</td>
<td>Yes</td>
</tr>
<tr>
<th>group_replication_recovery_ssl_verify_server_cert</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td></td>
<td>Global</td>
<td>Yes</td>
</tr>
<tr>
<th>group_replication_recovery_use_ssl</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td></td>
<td>Global</td>
<td>Yes</td>
</tr>
<tr>
<th>group_replication_single_primary_mode</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td></td>
<td>Global</td>
<td>Yes</td>
</tr>
<tr>
<th>group_replication_ssl_mode</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td></td>
<td>Global</td>
<td>Yes</td>
</tr>
<tr>
<th>group_replication_start_on_boot</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td></td>
<td>Global</td>
<td>Yes</td>
</tr>
<tr>
<th>group_replication_transaction_size_limit</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td></td>
<td>Global</td>
<td>Yes</td>
</tr>
<tr>
<th>group_replication_unreachable_majority_timeout</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td></td>
<td>Global</td>
<td>Yes</td>
</tr>
<tr>
<th>gtid_executed</th>
<td></td>
<td></td>
<td>Yes</td>
<td></td>
<td>Varies</td>
<td>No</td>
</tr>
<tr>
<th>gtid_executed_compression_period</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td></td>
<td>Global</td>
<td>Yes</td>
</tr>
<tr>
<th>gtid_mode</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td></td>
<td>Global</td>
<td>Varies</td>
</tr>
<tr>
<th>gtid_next</th>
<td></td>
<td></td>
<td>Yes</td>
<td></td>
<td>Session</td>
<td>Yes</td>
</tr>
<tr>
<th>gtid_owned</th>
<td></td>
<td></td>
<td>Yes</td>
<td></td>
<td>Both</td>
<td>No</td>
</tr>
<tr>
<th>gtid_purged</th>
<td></td>
<td></td>
<td>Yes</td>
<td></td>
<td>Global</td>
<td>Yes</td>
</tr>
<tr>
<th>Handler_commit</th>
<td></td>
<td></td>
<td></td>
<td>Yes</td>
<td>Both</td>
<td>No</td>
</tr>
<tr>
<th>Handler_delete</th>
<td></td>
<td></td>
<td></td>
<td>Yes</td>
<td>Both</td>
<td>No</td>
</tr>
<tr>
<th>Handler_discover</th>
<td></td>
<td></td>
<td></td>
<td>Yes</td>
<td>Both</td>
<td>No</td>
</tr>
<tr>
<th>Handler_external_lock</th>
<td></td>
<td></td>
<td></td>
<td>Yes</td>
<td>Both</td>
<td>No</td>
</tr>
<tr>
<th>Handler_mrr_init</th>
<td></td>
<td></td>
<td></td>
<td>Yes</td>
<td>Both</td>
<td>No</td>
</tr>
<tr>
<th>Handler_prepare</th>
<td></td>
<td></td>
<td></td>
<td>Yes</td>
<td>Both</td>
<td>No</td>
</tr>
<tr>
<th>Handler_read_first</th>
<td></td>
<td></td>
<td></td>
<td>Yes</td>
<td>Both</td>
<td>No</td>
</tr>
<tr>
<th>Handler_read_key</th>
<td></td>
<td></td>
<td></td>
<td>Yes</td>
<td>Both</td>
<td>No</td>
</tr>
<tr>
<th>Handler_read_last</th>
<td></td>
<td></td>
<td></td>
<td>Yes</td>
<td>Both</td>
<td>No</td>
</tr>
<tr>
<th>Handler_read_next</th>
<td></td>
<td></td>
<td></td>
<td>Yes</td>
<td>Both</td>
<td>No</td>
</tr>
<tr>
<th>Handler_read_prev</th>
<td></td>
<td></td>
<td></td>
<td>Yes</td>
<td>Both</td>
<td>No</td>
</tr>
<tr>
<th>Handler_read_rnd</th>
<td></td>
<td></td>
<td></td>
<td>Yes</td>
<td>Both</td>
<td>No</td>
</tr>
<tr>
<th>Handler_read_rnd_next</th>
<td></td>
<td></td>
<td></td>
<td>Yes</td>
<td>Both</td>
<td>No</td>
</tr>
<tr>
<th>Handler_rollback</th>
<td></td>
<td></td>
<td></td>
<td>Yes</td>
<td>Both</td>
<td>No</td>
</tr>
<tr>
<th>Handler_savepoint</th>
<td></td>
<td></td>
<td></td>
<td>Yes</td>
<td>Both</td>
<td>No</td>
</tr>
<tr>
<th>Handler_savepoint_rollback</th>
<td></td>
<td></td>
<td></td>
<td>Yes</td>
<td>Both</td>
<td>No</td>
</tr>
<tr>
<th>Handler_update</th>
<td></td>
<td></td>
<td></td>
<td>Yes</td>
<td>Both</td>
<td>No</td>
</tr>
<tr>
<th>Handler_write</th>
<td></td>
<td></td>
<td></td>
<td>Yes</td>
<td>Both</td>
<td>No</td>
</tr>
<tr>
<th>have_compress</th>
<td></td>
<td></td>
<td>Yes</td>
<td></td>
<td>Global</td>
<td>No</td>
</tr>
<tr>
<th>have_crypt</th>
<td></td>
<td></td>
<td>Yes</td>
<td></td>
<td>Global</td>
<td>No</td>
</tr>
<tr>
<th>have_dynamic_loading</th>
<td></td>
<td></td>
<td>Yes</td>
<td></td>
<td>Global</td>
<td>No</td>
</tr>
<tr>
<th>have_geometry</th>
<td></td>
<td></td>
<td>Yes</td>
<td></td>
<td>Global</td>
<td>No</td>
</tr>
<tr>
<th>have_openssl</th>
<td></td>
<td></td>
<td>Yes</td>
<td></td>
<td>Global</td>
<td>No</td>
</tr>
<tr>
<th>have_profiling</th>
<td></td>
<td></td>
<td>Yes</td>
<td></td>
<td>Global</td>
<td>No</td>
</tr>
<tr>
<th>have_query_cache</th>
<td></td>
<td></td>
<td>Yes</td>
<td></td>
<td>Global</td>
<td>No</td>
</tr>
<tr>
<th>have_rtree_keys</th>
<td></td>
<td></td>
<td>Yes</td>
<td></td>
<td>Global</td>
<td>No</td>
</tr>
<tr>
<th>have_ssl</th>
<td></td>
<td></td>
<td>Yes</td>
<td></td>
<td>Global</td>
<td>No</td>
</tr>
<tr>
<th>have_statement_timeout</th>
<td></td>
<td></td>
<td>Yes</td>
<td></td>
<td>Global</td>
<td>No</td>
</tr>
<tr>
<th>have_symlink</th>
<td></td>
<td></td>
<td>Yes</td>
<td></td>
<td>Global</td>
<td>No</td>
</tr>
<tr>
<th>help</th>
<td>Yes</td>
<td>Yes</td>
<td></td>
<td></td>
<td></td>
<td></td>
</tr>
<tr>
<th>host_cache_size</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td></td>
<td>Global</td>
<td>Yes</td>
</tr>
<tr>
<th>hostname</th>
<td></td>
<td></td>
<td>Yes</td>
<td></td>
<td>Global</td>
<td>No</td>
</tr>
<tr>
<th>identity</th>
<td></td>
<td></td>
<td>Yes</td>
<td></td>
<td>Session</td>
<td>Yes</td>
</tr>
<tr>
<th>ignore_builtin_innodb</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td></td>
<td>Global</td>
<td>No</td>
</tr>
<tr>
<th>ignore-db-dir</th>
<td>Yes</td>
<td>Yes</td>
<td></td>
<td></td>
<td></td>
<td></td>
</tr>
<tr>
<th>ignore_db_dirs</th>
<td></td>
<td></td>
<td>Yes</td>
<td></td>
<td>Global</td>
<td>No</td>
</tr>
<tr>
<th>init_connect</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td></td>
<td>Global</td>
<td>Yes</td>
</tr>
<tr>
<th>init_file</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td></td>
<td>Global</td>
<td>No</td>
</tr>
<tr>
<th>init_slave</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td></td>
<td>Global</td>
<td>Yes</td>
</tr>
<tr>
<th>initialize</th>
<td>Yes</td>
<td>Yes</td>
<td></td>
<td></td>
<td></td>
<td></td>
</tr>
<tr>
<th>initialize-insecure</th>
<td>Yes</td>
<td>Yes</td>
<td></td>
<td></td>
<td></td>
<td></td>
</tr>
<tr>
<th>innodb</th>
<td>Yes</td>
<td>Yes</td>
<td></td>
<td></td>
<td></td>
<td></td>
</tr>
<tr>
<th>innodb_adaptive_flushing</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td></td>
<td>Global</td>
<td>Yes</td>
</tr>
<tr>
<th>innodb_adaptive_flushing_lwm</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td></td>
<td>Global</td>
<td>Yes</td>
</tr>
<tr>
<th>innodb_adaptive_hash_index</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td></td>
<td>Global</td>
<td>Yes</td>
</tr>
<tr>
<th>innodb_adaptive_hash_index_parts</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td></td>
<td>Global</td>
<td>No</td>
</tr>
<tr>
<th>innodb_adaptive_max_sleep_delay</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td></td>
<td>Global</td>
<td>Yes</td>
</tr>
<tr>
<th>innodb_api_bk_commit_interval</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td></td>
<td>Global</td>
<td>Yes</td>
</tr>
<tr>
<th>innodb_api_disable_rowlock</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td></td>
<td>Global</td>
<td>No</td>
</tr>
<tr>
<th>innodb_api_enable_binlog</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td></td>
<td>Global</td>
<td>No</td>
</tr>
<tr>
<th>innodb_api_enable_mdl</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td></td>
<td>Global</td>
<td>No</td>
</tr>
<tr>
<th>innodb_api_trx_level</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td></td>
<td>Global</td>
<td>Yes</td>
</tr>
<tr>
<th>innodb_autoextend_increment</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td></td>
<td>Global</td>
<td>Yes</td>
</tr>
<tr>
<th>innodb_autoinc_lock_mode</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td></td>
<td>Global</td>
<td>No</td>
</tr>
<tr>
<th>Innodb_available_undo_logs</th>
<td></td>
<td></td>
<td></td>
<td>Yes</td>
<td>Global</td>
<td>No</td>
</tr>
<tr>
<th>innodb_background_drop_list_empty</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td></td>
<td>Global</td>
<td>Yes</td>
</tr>
<tr>
<th>Innodb_buffer_pool_bytes_data</th>
<td></td>
<td></td>
<td></td>
<td>Yes</td>
<td>Global</td>
<td>No</td>
</tr>
<tr>
<th>Innodb_buffer_pool_bytes_dirty</th>
<td></td>
<td></td>
<td></td>
<td>Yes</td>
<td>Global</td>
<td>No</td>
</tr>
<tr>
<th>innodb_buffer_pool_chunk_size</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td></td>
<td>Global</td>
<td>No</td>
</tr>
<tr>
<th>innodb_buffer_pool_dump_at_shutdown</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td></td>
<td>Global</td>
<td>Yes</td>
</tr>
<tr>
<th>innodb_buffer_pool_dump_now</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td></td>
<td>Global</td>
<td>Yes</td>
</tr>
<tr>
<th>innodb_buffer_pool_dump_pct</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td></td>
<td>Global</td>
<td>Yes</td>
</tr>
<tr>
<th>Innodb_buffer_pool_dump_status</th>
<td></td>
<td></td>
<td></td>
<td>Yes</td>
<td>Global</td>
<td>No</td>
</tr>
<tr>
<th>innodb_buffer_pool_filename</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td></td>
<td>Global</td>
<td>Yes</td>
</tr>
<tr>
<th>innodb_buffer_pool_instances</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td></td>
<td>Global</td>
<td>No</td>
</tr>
<tr>
<th>innodb_buffer_pool_load_abort</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td></td>
<td>Global</td>
<td>Yes</td>
</tr>
<tr>
<th>innodb_buffer_pool_load_at_startup</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td></td>
<td>Global</td>
<td>No</td>
</tr>
<tr>
<th>innodb_buffer_pool_load_now</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td></td>
<td>Global</td>
<td>Yes</td>
</tr>
<tr>
<th>Innodb_buffer_pool_load_status</th>
<td></td>
<td></td>
<td></td>
<td>Yes</td>
<td>Global</td>
<td>No</td>
</tr>
<tr>
<th>Innodb_buffer_pool_pages_data</th>
<td></td>
<td></td>
<td></td>
<td>Yes</td>
<td>Global</td>
<td>No</td>
</tr>
<tr>
<th>Innodb_buffer_pool_pages_dirty</th>
<td></td>
<td></td>
<td></td>
<td>Yes</td>
<td>Global</td>
<td>No</td>
</tr>
<tr>
<th>Innodb_buffer_pool_pages_flushed</th>
<td></td>
<td></td>
<td></td>
<td>Yes</td>
<td>Global</td>
<td>No</td>
</tr>
<tr>
<th>Innodb_buffer_pool_pages_free</th>
<td></td>
<td></td>
<td></td>
<td>Yes</td>
<td>Global</td>
<td>No</td>
</tr>
<tr>
<th>Innodb_buffer_pool_pages_latched</th>
<td></td>
<td></td>
<td></td>
<td>Yes</td>
<td>Global</td>
<td>No</td>
</tr>
<tr>
<th>Innodb_buffer_pool_pages_misc</th>
<td></td>
<td></td>
<td></td>
<td>Yes</td>
<td>Global</td>
<td>No</td>
</tr>
<tr>
<th>Innodb_buffer_pool_pages_total</th>
<td></td>
<td></td>
<td></td>
<td>Yes</td>
<td>Global</td>
<td>No</td>
</tr>
<tr>
<th>Innodb_buffer_pool_read_ahead</th>
<td></td>
<td></td>
<td></td>
<td>Yes</td>
<td>Global</td>
<td>No</td>
</tr>
<tr>
<th>Innodb_buffer_pool_read_ahead_evicted</th>
<td></td>
<td></td>
<td></td>
<td>Yes</td>
<td>Global</td>
<td>No</td>
</tr>
<tr>
<th>Innodb_buffer_pool_read_ahead_rnd</th>
<td></td>
<td></td>
<td></td>
<td>Yes</td>
<td>Global</td>
<td>No</td>
</tr>
<tr>
<th>Innodb_buffer_pool_read_requests</th>
<td></td>
<td></td>
<td></td>
<td>Yes</td>
<td>Global</td>
<td>No</td>
</tr>
<tr>
<th>Innodb_buffer_pool_reads</th>
<td></td>
<td></td>
<td></td>
<td>Yes</td>
<td>Global</td>
<td>No</td>
</tr>
<tr>
<th>Innodb_buffer_pool_resize_status</th>
<td></td>
<td></td>
<td></td>
<td>Yes</td>
<td>Global</td>
<td>No</td>
</tr>
<tr>
<th>innodb_buffer_pool_size</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td></td>
<td>Global</td>
<td>Varies</td>
</tr>
<tr>
<th>Innodb_buffer_pool_wait_free</th>
<td></td>
<td></td>
<td></td>
<td>Yes</td>
<td>Global</td>
<td>No</td>
</tr>
<tr>
<th>Innodb_buffer_pool_write_requests</th>
<td></td>
<td></td>
<td></td>
<td>Yes</td>
<td>Global</td>
<td>No</td>
</tr>
<tr>
<th>innodb_change_buffer_max_size</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td></td>
<td>Global</td>
<td>Yes</td>
</tr>
<tr>
<th>innodb_change_buffering</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td></td>
<td>Global</td>
<td>Yes</td>
</tr>
<tr>
<th>innodb_change_buffering_debug</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td></td>
<td>Global</td>
<td>Yes</td>
</tr>
<tr>
<th>innodb_checksum_algorithm</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td></td>
<td>Global</td>
<td>Yes</td>
</tr>
<tr>
<th>innodb_checksums</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td></td>
<td>Global</td>
<td>No</td>
</tr>
<tr>
<th>innodb_cmp_per_index_enabled</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td></td>
<td>Global</td>
<td>Yes</td>
</tr>
<tr>
<th>innodb_commit_concurrency</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td></td>
<td>Global</td>
<td>Yes</td>
</tr>
<tr>
<th>innodb_compress_debug</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td></td>
<td>Global</td>
<td>Yes</td>
</tr>
<tr>
<th>innodb_compression_failure_threshold_pct</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td></td>
<td>Global</td>
<td>Yes</td>
</tr>
<tr>
<th>innodb_compression_level</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td></td>
<td>Global</td>
<td>Yes</td>
</tr>
<tr>
<th>innodb_compression_pad_pct_max</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td></td>
<td>Global</td>
<td>Yes</td>
</tr>
<tr>
<th>innodb_concurrency_tickets</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td></td>
<td>Global</td>
<td>Yes</td>
</tr>
<tr>
<th>innodb_data_file_path</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td></td>
<td>Global</td>
<td>No</td>
</tr>
<tr>
<th>Innodb_data_fsyncs</th>
<td></td>
<td></td>
<td></td>
<td>Yes</td>
<td>Global</td>
<td>No</td>
</tr>
<tr>
<th>innodb_data_home_dir</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td></td>
<td>Global</td>
<td>No</td>
</tr>
<tr>
<th>Innodb_data_pending_fsyncs</th>
<td></td>
<td></td>
<td></td>
<td>Yes</td>
<td>Global</td>
<td>No</td>
</tr>
<tr>
<th>Innodb_data_pending_reads</th>
<td></td>
<td></td>
<td></td>
<td>Yes</td>
<td>Global</td>
<td>No</td>
</tr>
<tr>
<th>Innodb_data_pending_writes</th>
<td></td>
<td></td>
<td></td>
<td>Yes</td>
<td>Global</td>
<td>No</td>
</tr>
<tr>
<th>Innodb_data_read</th>
<td></td>
<td></td>
<td></td>
<td>Yes</td>
<td>Global</td>
<td>No</td>
</tr>
<tr>
<th>Innodb_data_reads</th>
<td></td>
<td></td>
<td></td>
<td>Yes</td>
<td>Global</td>
<td>No</td>
</tr>
<tr>
<th>Innodb_data_writes</th>
<td></td>
<td></td>
<td></td>
<td>Yes</td>
<td>Global</td>
<td>No</td>
</tr>
<tr>
<th>Innodb_data_written</th>
<td></td>
<td></td>
<td></td>
<td>Yes</td>
<td>Global</td>
<td>No</td>
</tr>
<tr>
<th>Innodb_dblwr_pages_written</th>
<td></td>
<td></td>
<td></td>
<td>Yes</td>
<td>Global</td>
<td>No</td>
</tr>
<tr>
<th>Innodb_dblwr_writes</th>
<td></td>
<td></td>
<td></td>
<td>Yes</td>
<td>Global</td>
<td>No</td>
</tr>
<tr>
<th>innodb_deadlock_detect</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td></td>
<td>Global</td>
<td>Yes</td>
</tr>
<tr>
<th>innodb_default_row_format</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td></td>
<td>Global</td>
<td>Yes</td>
</tr>
<tr>
<th>innodb_disable_resize_buffer_pool_debug</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td></td>
<td>Global</td>
<td>Yes</td>
</tr>
<tr>
<th>innodb_disable_sort_file_cache</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td></td>
<td>Global</td>
<td>Yes</td>
</tr>
<tr>
<th>innodb_doublewrite</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td></td>
<td>Global</td>
<td>No</td>
</tr>
<tr>
<th>innodb_fast_shutdown</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td></td>
<td>Global</td>
<td>Yes</td>
</tr>
<tr>
<th>innodb_fil_make_page_dirty_debug</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td></td>
<td>Global</td>
<td>Yes</td>
</tr>
<tr>
<th>innodb_file_format</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td></td>
<td>Global</td>
<td>Yes</td>
</tr>
<tr>
<th>innodb_file_format_check</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td></td>
<td>Global</td>
<td>No</td>
</tr>
<tr>
<th>innodb_file_format_max</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td></td>
<td>Global</td>
<td>Yes</td>
</tr>
<tr>
<th>innodb_file_per_table</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td></td>
<td>Global</td>
<td>Yes</td>
</tr>
<tr>
<th>innodb_fill_factor</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td></td>
<td>Global</td>
<td>Yes</td>
</tr>
<tr>
<th>innodb_flush_log_at_timeout</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td></td>
<td>Global</td>
<td>Yes</td>
</tr>
<tr>
<th>innodb_flush_log_at_trx_commit</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td></td>
<td>Global</td>
<td>Yes</td>
</tr>
<tr>
<th>innodb_flush_method</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td></td>
<td>Global</td>
<td>No</td>
</tr>
<tr>
<th>innodb_flush_neighbors</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td></td>
<td>Global</td>
<td>Yes</td>
</tr>
<tr>
<th>innodb_flush_sync</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td></td>
<td>Global</td>
<td>Yes</td>
</tr>
<tr>
<th>innodb_flushing_avg_loops</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td></td>
<td>Global</td>
<td>Yes</td>
</tr>
<tr>
<th>innodb_force_load_corrupted</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td></td>
<td>Global</td>
<td>No</td>
</tr>
<tr>
<th>innodb_force_recovery</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td></td>
<td>Global</td>
<td>No</td>
</tr>
<tr>
<th>innodb_ft_aux_table</th>
<td></td>
<td></td>
<td>Yes</td>
<td></td>
<td>Global</td>
<td>Yes</td>
</tr>
<tr>
<th>innodb_ft_cache_size</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td></td>
<td>Global</td>
<td>No</td>
</tr>
<tr>
<th>innodb_ft_enable_diag_print</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td></td>
<td>Global</td>
<td>Yes</td>
</tr>
<tr>
<th>innodb_ft_enable_stopword</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td></td>
<td>Both</td>
<td>Yes</td>
</tr>
<tr>
<th>innodb_ft_max_token_size</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td></td>
<td>Global</td>
<td>No</td>
</tr>
<tr>
<th>innodb_ft_min_token_size</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td></td>
<td>Global</td>
<td>No</td>
</tr>
<tr>
<th>innodb_ft_num_word_optimize</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td></td>
<td>Global</td>
<td>Yes</td>
</tr>
<tr>
<th>innodb_ft_result_cache_limit</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td></td>
<td>Global</td>
<td>Yes</td>
</tr>
<tr>
<th>innodb_ft_server_stopword_table</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td></td>
<td>Global</td>
<td>Yes</td>
</tr>
<tr>
<th>innodb_ft_sort_pll_degree</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td></td>
<td>Global</td>
<td>No</td>
</tr>
<tr>
<th>innodb_ft_total_cache_size</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td></td>
<td>Global</td>
<td>No</td>
</tr>
<tr>
<th>innodb_ft_user_stopword_table</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td></td>
<td>Both</td>
<td>Yes</td>
</tr>
<tr>
<th>Innodb_have_atomic_builtins</th>
<td></td>
<td></td>
<td></td>
<td>Yes</td>
<td>Global</td>
<td>No</td>
</tr>
<tr>
<th>innodb_io_capacity</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td></td>
<td>Global</td>
<td>Yes</td>
</tr>
<tr>
<th>innodb_io_capacity_max</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td></td>
<td>Global</td>
<td>Yes</td>
</tr>
<tr>
<th>innodb_large_prefix</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td></td>
<td>Global</td>
<td>Yes</td>
</tr>
<tr>
<th>innodb_limit_optimistic_insert_debug</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td></td>
<td>Global</td>
<td>Yes</td>
</tr>
<tr>
<th>innodb_lock_wait_timeout</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td></td>
<td>Both</td>
<td>Yes</td>
</tr>
<tr>
<th>innodb_locks_unsafe_for_binlog</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td></td>
<td>Global</td>
<td>No</td>
</tr>
<tr>
<th>innodb_log_buffer_size</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td></td>
<td>Global</td>
<td>No</td>
</tr>
<tr>
<th>innodb_log_checkpoint_now</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td></td>
<td>Global</td>
<td>Yes</td>
</tr>
<tr>
<th>innodb_log_checksums</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td></td>
<td>Global</td>
<td>Yes</td>
</tr>
<tr>
<th>innodb_log_compressed_pages</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td></td>
<td>Global</td>
<td>Yes</td>
</tr>
<tr>
<th>innodb_log_file_size</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td></td>
<td>Global</td>
<td>No</td>
</tr>
<tr>
<th>innodb_log_files_in_group</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td></td>
<td>Global</td>
<td>No</td>
</tr>
<tr>
<th>innodb_log_group_home_dir</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td></td>
<td>Global</td>
<td>No</td>
</tr>
<tr>
<th>Innodb_log_waits</th>
<td></td>
<td></td>
<td></td>
<td>Yes</td>
<td>Global</td>
<td>No</td>
</tr>
<tr>
<th>innodb_log_write_ahead_size</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td></td>
<td>Global</td>
<td>Yes</td>
</tr>
<tr>
<th>Innodb_log_write_requests</th>
<td></td>
<td></td>
<td></td>
<td>Yes</td>
<td>Global</td>
<td>No</td>
</tr>
<tr>
<th>Innodb_log_writes</th>
<td></td>
<td></td>
<td></td>
<td>Yes</td>
<td>Global</td>
<td>No</td>
</tr>
<tr>
<th>innodb_lru_scan_depth</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td></td>
<td>Global</td>
<td>Yes</td>
</tr>
<tr>
<th>innodb_max_dirty_pages_pct</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td></td>
<td>Global</td>
<td>Yes</td>
</tr>
<tr>
<th>innodb_max_dirty_pages_pct_lwm</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td></td>
<td>Global</td>
<td>Yes</td>
</tr>
<tr>
<th>innodb_max_purge_lag</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td></td>
<td>Global</td>
<td>Yes</td>
</tr>
<tr>
<th>innodb_max_purge_lag_delay</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td></td>
<td>Global</td>
<td>Yes</td>
</tr>
<tr>
<th>innodb_max_undo_log_size</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td></td>
<td>Global</td>
<td>Yes</td>
</tr>
<tr>
<th>innodb_merge_threshold_set_all_debug</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td></td>
<td>Global</td>
<td>Yes</td>
</tr>
<tr>
<th>innodb_monitor_disable</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td></td>
<td>Global</td>
<td>Yes</td>
</tr>
<tr>
<th>innodb_monitor_enable</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td></td>
<td>Global</td>
<td>Yes</td>
</tr>
<tr>
<th>innodb_monitor_reset</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td></td>
<td>Global</td>
<td>Yes</td>
</tr>
<tr>
<th>innodb_monitor_reset_all</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td></td>
<td>Global</td>
<td>Yes</td>
</tr>
<tr>
<th>Innodb_num_open_files</th>
<td></td>
<td></td>
<td></td>
<td>Yes</td>
<td>Global</td>
<td>No</td>
</tr>
<tr>
<th>innodb_numa_interleave</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td></td>
<td>Global</td>
<td>No</td>
</tr>
<tr>
<th>innodb_old_blocks_pct</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td></td>
<td>Global</td>
<td>Yes</td>
</tr>
<tr>
<th>innodb_old_blocks_time</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td></td>
<td>Global</td>
<td>Yes</td>
</tr>
<tr>
<th>innodb_online_alter_log_max_size</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td></td>
<td>Global</td>
<td>Yes</td>
</tr>
<tr>
<th>innodb_open_files</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td></td>
<td>Global</td>
<td>No</td>
</tr>
<tr>
<th>innodb_optimize_fulltext_only</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td></td>
<td>Global</td>
<td>Yes</td>
</tr>
<tr>
<th>Innodb_os_log_fsyncs</th>
<td></td>
<td></td>
<td></td>
<td>Yes</td>
<td>Global</td>
<td>No</td>
</tr>
<tr>
<th>Innodb_os_log_pending_fsyncs</th>
<td></td>
<td></td>
<td></td>
<td>Yes</td>
<td>Global</td>
<td>No</td>
</tr>
<tr>
<th>Innodb_os_log_pending_writes</th>
<td></td>
<td></td>
<td></td>
<td>Yes</td>
<td>Global</td>
<td>No</td>
</tr>
<tr>
<th>Innodb_os_log_written</th>
<td></td>
<td></td>
<td></td>
<td>Yes</td>
<td>Global</td>
<td>No</td>
</tr>
<tr>
<th>innodb_page_cleaners</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td></td>
<td>Global</td>
<td>No</td>
</tr>
<tr>
<th>Innodb_page_size</th>
<td></td>
<td></td>
<td></td>
<td>Yes</td>
<td>Global</td>
<td>No</td>
</tr>
<tr>
<th>innodb_page_size</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td></td>
<td>Global</td>
<td>No</td>
</tr>
<tr>
<th>Innodb_pages_created</th>
<td></td>
<td></td>
<td></td>
<td>Yes</td>
<td>Global</td>
<td>No</td>
</tr>
<tr>
<th>Innodb_pages_read</th>
<td></td>
<td></td>
<td></td>
<td>Yes</td>
<td>Global</td>
<td>No</td>
</tr>
<tr>
<th>Innodb_pages_written</th>
<td></td>
<td></td>
<td></td>
<td>Yes</td>
<td>Global</td>
<td>No</td>
</tr>
<tr>
<th>innodb_print_all_deadlocks</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td></td>
<td>Global</td>
<td>Yes</td>
</tr>
<tr>
<th>innodb_purge_batch_size</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td></td>
<td>Global</td>
<td>Yes</td>
</tr>
<tr>
<th>innodb_purge_rseg_truncate_frequency</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td></td>
<td>Global</td>
<td>Yes</td>
</tr>
<tr>
<th>innodb_purge_threads</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td></td>
<td>Global</td>
<td>No</td>
</tr>
<tr>
<th>innodb_random_read_ahead</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td></td>
<td>Global</td>
<td>Yes</td>
</tr>
<tr>
<th>innodb_read_ahead_threshold</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td></td>
<td>Global</td>
<td>Yes</td>
</tr>
<tr>
<th>innodb_read_io_threads</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td></td>
<td>Global</td>
<td>No</td>
</tr>
<tr>
<th>innodb_read_only</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td></td>
<td>Global</td>
<td>No</td>
</tr>
<tr>
<th>innodb_replication_delay</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td></td>
<td>Global</td>
<td>Yes</td>
</tr>
<tr>
<th>innodb_rollback_on_timeout</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td></td>
<td>Global</td>
<td>No</td>
</tr>
<tr>
<th>innodb_rollback_segments</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td></td>
<td>Global</td>
<td>Yes</td>
</tr>
<tr>
<th>Innodb_row_lock_current_waits</th>
<td></td>
<td></td>
<td></td>
<td>Yes</td>
<td>Global</td>
<td>No</td>
</tr>
<tr>
<th>Innodb_row_lock_time</th>
<td></td>
<td></td>
<td></td>
<td>Yes</td>
<td>Global</td>
<td>No</td>
</tr>
<tr>
<th>Innodb_row_lock_time_avg</th>
<td></td>
<td></td>
<td></td>
<td>Yes</td>
<td>Global</td>
<td>No</td>
</tr>
<tr>
<th>Innodb_row_lock_time_max</th>
<td></td>
<td></td>
<td></td>
<td>Yes</td>
<td>Global</td>
<td>No</td>
</tr>
<tr>
<th>Innodb_row_lock_waits</th>
<td></td>
<td></td>
<td></td>
<td>Yes</td>
<td>Global</td>
<td>No</td>
</tr>
<tr>
<th>Innodb_rows_deleted</th>
<td></td>
<td></td>
<td></td>
<td>Yes</td>
<td>Global</td>
<td>No</td>
</tr>
<tr>
<th>Innodb_rows_inserted</th>
<td></td>
<td></td>
<td></td>
<td>Yes</td>
<td>Global</td>
<td>No</td>
</tr>
<tr>
<th>Innodb_rows_read</th>
<td></td>
<td></td>
<td></td>
<td>Yes</td>
<td>Global</td>
<td>No</td>
</tr>
<tr>
<th>Innodb_rows_updated</th>
<td></td>
<td></td>
<td></td>
<td>Yes</td>
<td>Global</td>
<td>No</td>
</tr>
<tr>
<th>innodb_saved_page_number_debug</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td></td>
<td>Global</td>
<td>Yes</td>
</tr>
<tr>
<th>innodb_sort_buffer_size</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td></td>
<td>Global</td>
<td>No</td>
</tr>
<tr>
<th>innodb_spin_wait_delay</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td></td>
<td>Global</td>
<td>Yes</td>
</tr>
<tr>
<th>innodb_stats_auto_recalc</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td></td>
<td>Global</td>
<td>Yes</td>
</tr>
<tr>
<th>innodb_stats_include_delete_marked</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td></td>
<td>Global</td>
<td>Yes</td>
</tr>
<tr>
<th>innodb_stats_method</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td></td>
<td>Global</td>
<td>Yes</td>
</tr>
<tr>
<th>innodb_stats_on_metadata</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td></td>
<td>Global</td>
<td>Yes</td>
</tr>
<tr>
<th>innodb_stats_persistent</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td></td>
<td>Global</td>
<td>Yes</td>
</tr>
<tr>
<th>innodb_stats_persistent_sample_pages</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td></td>
<td>Global</td>
<td>Yes</td>
</tr>
<tr>
<th>innodb_stats_sample_pages</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td></td>
<td>Global</td>
<td>Yes</td>
</tr>
<tr>
<th>innodb_stats_transient_sample_pages</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td></td>
<td>Global</td>
<td>Yes</td>
</tr>
<tr>
<th>innodb-status-file</th>
<td>Yes</td>
<td>Yes</td>
<td></td>
<td></td>
<td></td>
<td></td>
</tr>
<tr>
<th>innodb_status_output</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td></td>
<td>Global</td>
<td>Yes</td>
</tr>
<tr>
<th>innodb_status_output_locks</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td></td>
<td>Global</td>
<td>Yes</td>
</tr>
<tr>
<th>innodb_strict_mode</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td></td>
<td>Both</td>
<td>Yes</td>
</tr>
<tr>
<th>innodb_support_xa</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td></td>
<td>Both</td>
<td>Yes</td>
</tr>
<tr>
<th>innodb_sync_array_size</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td></td>
<td>Global</td>
<td>No</td>
</tr>
<tr>
<th>innodb_sync_debug</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td></td>
<td>Global</td>
<td>No</td>
</tr>
<tr>
<th>innodb_sync_spin_loops</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td></td>
<td>Global</td>
<td>Yes</td>
</tr>
<tr>
<th>innodb_table_locks</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td></td>
<td>Both</td>
<td>Yes</td>
</tr>
<tr>
<th>innodb_temp_data_file_path</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td></td>
<td>Global</td>
<td>No</td>
</tr>
<tr>
<th>innodb_thread_concurrency</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td></td>
<td>Global</td>
<td>Yes</td>
</tr>
<tr>
<th>innodb_thread_sleep_delay</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td></td>
<td>Global</td>
<td>Yes</td>
</tr>
<tr>
<th>innodb_tmpdir</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td></td>
<td>Both</td>
<td>Yes</td>
</tr>
<tr>
<th>Innodb_truncated_status_writes</th>
<td></td>
<td></td>
<td></td>
<td>Yes</td>
<td>Global</td>
<td>No</td>
</tr>
<tr>
<th>innodb_trx_purge_view_update_only_debug</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td></td>
<td>Global</td>
<td>Yes</td>
</tr>
<tr>
<th>innodb_trx_rseg_n_slots_debug</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td></td>
<td>Global</td>
<td>Yes</td>
</tr>
<tr>
<th>innodb_undo_directory</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td></td>
<td>Global</td>
<td>No</td>
</tr>
<tr>
<th>innodb_undo_log_truncate</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td></td>
<td>Global</td>
<td>Yes</td>
</tr>
<tr>
<th>innodb_undo_logs</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td></td>
<td>Global</td>
<td>Yes</td>
</tr>
<tr>
<th>innodb_undo_tablespaces</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td></td>
<td>Global</td>
<td>No</td>
</tr>
<tr>
<th>innodb_use_native_aio</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td></td>
<td>Global</td>
<td>No</td>
</tr>
<tr>
<th>innodb_version</th>
<td></td>
<td></td>
<td>Yes</td>
<td></td>
<td>Global</td>
<td>No</td>
</tr>
<tr>
<th>innodb_write_io_threads</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td></td>
<td>Global</td>
<td>No</td>
</tr>
<tr>
<th>insert_id</th>
<td></td>
<td></td>
<td>Yes</td>
<td></td>
<td>Session</td>
<td>Yes</td>
</tr>
<tr>
<th>install</th>
<td>Yes</td>
<td></td>
<td></td>
<td></td>
<td></td>
<td></td>
</tr>
<tr>
<th>install-manual</th>
<td>Yes</td>
<td></td>
<td></td>
<td></td>
<td></td>
<td></td>
</tr>
<tr>
<th>interactive_timeout</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td></td>
<td>Both</td>
<td>Yes</td>
</tr>
<tr>
<th>internal_tmp_disk_storage_engine</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td></td>
<td>Global</td>
<td>Yes</td>
</tr>
<tr>
<th>join_buffer_size</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td></td>
<td>Both</td>
<td>Yes</td>
</tr>
<tr>
<th>keep_files_on_create</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td></td>
<td>Both</td>
<td>Yes</td>
</tr>
<tr>
<th>Key_blocks_not_flushed</th>
<td></td>
<td></td>
<td></td>
<td>Yes</td>
<td>Global</td>
<td>No</td>
</tr>
<tr>
<th>Key_blocks_unused</th>
<td></td>
<td></td>
<td></td>
<td>Yes</td>
<td>Global</td>
<td>No</td>
</tr>
<tr>
<th>Key_blocks_used</th>
<td></td>
<td></td>
<td></td>
<td>Yes</td>
<td>Global</td>
<td>No</td>
</tr>
<tr>
<th>key_buffer_size</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td></td>
<td>Global</td>
<td>Yes</td>
</tr>
<tr>
<th>key_cache_age_threshold</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td></td>
<td>Global</td>
<td>Yes</td>
</tr>
<tr>
<th>key_cache_block_size</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td></td>
<td>Global</td>
<td>Yes</td>
</tr>
<tr>
<th>key_cache_division_limit</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td></td>
<td>Global</td>
<td>Yes</td>
</tr>
<tr>
<th>Key_read_requests</th>
<td></td>
<td></td>
<td></td>
<td>Yes</td>
<td>Global</td>
<td>No</td>
</tr>
<tr>
<th>Key_reads</th>
<td></td>
<td></td>
<td></td>
<td>Yes</td>
<td>Global</td>
<td>No</td>
</tr>
<tr>
<th>Key_write_requests</th>
<td></td>
<td></td>
<td></td>
<td>Yes</td>
<td>Global</td>
<td>No</td>
</tr>
<tr>
<th>Key_writes</th>
<td></td>
<td></td>
<td></td>
<td>Yes</td>
<td>Global</td>
<td>No</td>
</tr>
<tr>
<th>keyring_aws_cmk_id</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td></td>
<td>Global</td>
<td>Yes</td>
</tr>
<tr>
<th>keyring_aws_conf_file</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td></td>
<td>Global</td>
<td>No</td>
</tr>
<tr>
<th>keyring_aws_data_file</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td></td>
<td>Global</td>
<td>No</td>
</tr>
<tr>
<th>keyring_aws_region</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td></td>
<td>Global</td>
<td>Yes</td>
</tr>
<tr>
<th>keyring_encrypted_file_data</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td></td>
<td>Global</td>
<td>Yes</td>
</tr>
<tr>
<th>keyring_encrypted_file_password</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td></td>
<td>Global</td>
<td>Yes</td>
</tr>
<tr>
<th>keyring_file_data</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td></td>
<td>Global</td>
<td>Yes</td>
</tr>
<tr>
<th>keyring-migration-destination</th>
<td>Yes</td>
<td>Yes</td>
<td></td>
<td></td>
<td></td>
<td></td>
</tr>
<tr>
<th>keyring-migration-host</th>
<td>Yes</td>
<td>Yes</td>
<td></td>
<td></td>
<td></td>
<td></td>
</tr>
<tr>
<th>keyring-migration-password</th>
<td>Yes</td>
<td>Yes</td>
<td></td>
<td></td>
<td></td>
<td></td>
</tr>
<tr>
<th>keyring-migration-port</th>
<td>Yes</td>
<td>Yes</td>
<td></td>
<td></td>
<td></td>
<td></td>
</tr>
<tr>
<th>keyring-migration-socket</th>
<td>Yes</td>
<td>Yes</td>
<td></td>
<td></td>
<td></td>
<td></td>
</tr>
<tr>
<th>keyring-migration-source</th>
<td>Yes</td>
<td>Yes</td>
<td></td>
<td></td>
<td></td>
<td></td>
</tr>
<tr>
<th>keyring-migration-user</th>
<td>Yes</td>
<td>Yes</td>
<td></td>
<td></td>
<td></td>
<td></td>
</tr>
<tr>
<th>keyring_okv_conf_dir</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td></td>
<td>Global</td>
<td>Yes</td>
</tr>
<tr>
<th>keyring_operations</th>
<td></td>
<td></td>
<td>Yes</td>
<td></td>
<td>Global</td>
<td>Yes</td>
</tr>
<tr>
<th>language</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td></td>
<td>Global</td>
<td>No</td>
</tr>
<tr>
<th>large_files_support</th>
<td></td>
<td></td>
<td>Yes</td>
<td></td>
<td>Global</td>
<td>No</td>
</tr>
<tr>
<th>large_page_size</th>
<td></td>
<td></td>
<td>Yes</td>
<td></td>
<td>Global</td>
<td>No</td>
</tr>
<tr>
<th>large_pages</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td></td>
<td>Global</td>
<td>No</td>
</tr>
<tr>
<th>last_insert_id</th>
<td></td>
<td></td>
<td>Yes</td>
<td></td>
<td>Session</td>
<td>Yes</td>
</tr>
<tr>
<th>Last_query_cost</th>
<td></td>
<td></td>
<td></td>
<td>Yes</td>
<td>Session</td>
<td>No</td>
</tr>
<tr>
<th>Last_query_partial_plans</th>
<td></td>
<td></td>
<td></td>
<td>Yes</td>
<td>Session</td>
<td>No</td>
</tr>
<tr>
<th>lc_messages</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td></td>
<td>Both</td>
<td>Yes</td>
</tr>
<tr>
<th>lc_messages_dir</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td></td>
<td>Global</td>
<td>No</td>
</tr>
<tr>
<th>lc_time_names</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td></td>
<td>Both</td>
<td>Yes</td>
</tr>
<tr>
<th>license</th>
<td></td>
<td></td>
<td>Yes</td>
<td></td>
<td>Global</td>
<td>No</td>
</tr>
<tr>
<th>local_infile</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td></td>
<td>Global</td>
<td>Yes</td>
</tr>
<tr>
<th>local-service</th>
<td>Yes</td>
<td></td>
<td></td>
<td></td>
<td></td>
<td></td>
</tr>
<tr>
<th>lock_wait_timeout</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td></td>
<td>Both</td>
<td>Yes</td>
</tr>
<tr>
<th>Locked_connects</th>
<td></td>
<td></td>
<td></td>
<td>Yes</td>
<td>Global</td>
<td>No</td>
</tr>
<tr>
<th>locked_in_memory</th>
<td></td>
<td></td>
<td>Yes</td>
<td></td>
<td>Global</td>
<td>No</td>
</tr>
<tr>
<th>log-bin</th>
<td>Yes</td>
<td>Yes</td>
<td></td>
<td></td>
<td></td>
<td></td>
</tr>
<tr>
<th>log_bin</th>
<td></td>
<td></td>
<td>Yes</td>
<td></td>
<td>Global</td>
<td>No</td>
</tr>
<tr>
<th>log_bin_basename</th>
<td></td>
<td></td>
<td>Yes</td>
<td></td>
<td>Global</td>
<td>No</td>
</tr>
<tr>
<th>log_bin_index</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td></td>
<td>Global</td>
<td>No</td>
</tr>
<tr>
<th>log_bin_trust_function_creators</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td></td>
<td>Global</td>
<td>Yes</td>
</tr>
<tr>
<th>log_bin_use_v1_row_events</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td></td>
<td>Global</td>
<td>Yes</td>
</tr>
<tr>
<th>log_builtin_as_identified_by_password</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td></td>
<td>Global</td>
<td>Yes</td>
</tr>
<tr>
<th>log_error</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td></td>
<td>Global</td>
<td>No</td>
</tr>
<tr>
<th>log_error_verbosity</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td></td>
<td>Global</td>
<td>Yes</td>
</tr>
<tr>
<th>log-isam</th>
<td>Yes</td>
<td>Yes</td>
<td></td>
<td></td>
<td></td>
<td></td>
</tr>
<tr>
<th>log_output</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td></td>
<td>Global</td>
<td>Yes</td>
</tr>
<tr>
<th>log_queries_not_using_indexes</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td></td>
<td>Global</td>
<td>Yes</td>
</tr>
<tr>
<th>log-raw</th>
<td>Yes</td>
<td>Yes</td>
<td></td>
<td></td>
<td></td>
<td></td>
</tr>
<tr>
<th>log-short-format</th>
<td>Yes</td>
<td>Yes</td>
<td></td>
<td></td>
<td></td>
<td></td>
</tr>
<tr>
<th>log_slave_updates</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td></td>
<td>Global</td>
<td>No</td>
</tr>
<tr>
<th>log_slow_admin_statements</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td></td>
<td>Global</td>
<td>Yes</td>
</tr>
<tr>
<th>log_slow_slave_statements</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td></td>
<td>Global</td>
<td>Yes</td>
</tr>
<tr>
<th>log_statements_unsafe_for_binlog</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td></td>
<td>Global</td>
<td>Yes</td>
</tr>
<tr>
<th>log_syslog</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td></td>
<td>Global</td>
<td>Yes</td>
</tr>
<tr>
<th>log_syslog_facility</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td></td>
<td>Global</td>
<td>Yes</td>
</tr>
<tr>
<th>log_syslog_include_pid</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td></td>
<td>Global</td>
<td>Yes</td>
</tr>
<tr>
<th>log_syslog_tag</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td></td>
<td>Global</td>
<td>Yes</td>
</tr>
<tr>
<th>log-tc</th>
<td>Yes</td>
<td>Yes</td>
<td></td>
<td></td>
<td></td>
<td></td>
</tr>
<tr>
<th>log-tc-size</th>
<td>Yes</td>
<td>Yes</td>
<td></td>
<td></td>
<td></td>
<td></td>
</tr>
<tr>
<th>log_throttle_queries_not_using_indexes</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td></td>
<td>Global</td>
<td>Yes</td>
</tr>
<tr>
<th>log_timestamps</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td></td>
<td>Global</td>
<td>Yes</td>
</tr>
<tr>
<th>log_warnings</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td></td>
<td>Global</td>
<td>Yes</td>
</tr>
<tr>
<th>long_query_time</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td></td>
<td>Both</td>
<td>Yes</td>
</tr>
<tr>
<th>low_priority_updates</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td></td>
<td>Both</td>
<td>Yes</td>
</tr>
<tr>
<th>lower_case_file_system</th>
<td></td>
<td></td>
<td>Yes</td>
<td></td>
<td>Global</td>
<td>No</td>
</tr>
<tr>
<th>lower_case_table_names</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td></td>
<td>Global</td>
<td>No</td>
</tr>
<tr>
<th>master-info-file</th>
<td>Yes</td>
<td>Yes</td>
<td></td>
<td></td>
<td></td>
<td></td>
</tr>
<tr>
<th>master_info_repository</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td></td>
<td>Global</td>
<td>Yes</td>
</tr>
<tr>
<th>master-retry-count</th>
<td>Yes</td>
<td>Yes</td>
<td></td>
<td></td>
<td></td>
<td></td>
</tr>
<tr>
<th>master_verify_checksum</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td></td>
<td>Global</td>
<td>Yes</td>
</tr>
<tr>
<th>max_allowed_packet</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td></td>
<td>Both</td>
<td>Yes</td>
</tr>
<tr>
<th>max_binlog_cache_size</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td></td>
<td>Global</td>
<td>Yes</td>
</tr>
<tr>
<th>max-binlog-dump-events</th>
<td>Yes</td>
<td>Yes</td>
<td></td>
<td></td>
<td></td>
<td></td>
</tr>
<tr>
<th>max_binlog_size</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td></td>
<td>Global</td>
<td>Yes</td>
</tr>
<tr>
<th>max_binlog_stmt_cache_size</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td></td>
<td>Global</td>
<td>Yes</td>
</tr>
<tr>
<th>max_connect_errors</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td></td>
<td>Global</td>
<td>Yes</td>
</tr>
<tr>
<th>max_connections</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td></td>
<td>Global</td>
<td>Yes</td>
</tr>
<tr>
<th>max_delayed_threads</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td></td>
<td>Both</td>
<td>Yes</td>
</tr>
<tr>
<th>max_digest_length</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td></td>
<td>Global</td>
<td>No</td>
</tr>
<tr>
<th>max_error_count</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td></td>
<td>Both</td>
<td>Yes</td>
</tr>
<tr>
<th>max_execution_time</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td></td>
<td>Both</td>
<td>Yes</td>
</tr>
<tr>
<th>Max_execution_time_exceeded</th>
<td></td>
<td></td>
<td></td>
<td>Yes</td>
<td>Both</td>
<td>No</td>
</tr>
<tr>
<th>Max_execution_time_set</th>
<td></td>
<td></td>
<td></td>
<td>Yes</td>
<td>Both</td>
<td>No</td>
</tr>
<tr>
<th>Max_execution_time_set_failed</th>
<td></td>
<td></td>
<td></td>
<td>Yes</td>
<td>Both</td>
<td>No</td>
</tr>
<tr>
<th>max_heap_table_size</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td></td>
<td>Both</td>
<td>Yes</td>
</tr>
<tr>
<th>max_insert_delayed_threads</th>
<td></td>
<td></td>
<td>Yes</td>
<td></td>
<td>Both</td>
<td>Yes</td>
</tr>
<tr>
<th>max_join_size</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td></td>
<td>Both</td>
<td>Yes</td>
</tr>
<tr>
<th>max_length_for_sort_data</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td></td>
<td>Both</td>
<td>Yes</td>
</tr>
<tr>
<th>max_points_in_geometry</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td></td>
<td>Both</td>
<td>Yes</td>
</tr>
<tr>
<th>max_prepared_stmt_count</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td></td>
<td>Global</td>
<td>Yes</td>
</tr>
<tr>
<th>max_relay_log_size</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td></td>
<td>Global</td>
<td>Yes</td>
</tr>
<tr>
<th>max_seeks_for_key</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td></td>
<td>Both</td>
<td>Yes</td>
</tr>
<tr>
<th>max_sort_length</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td></td>
<td>Both</td>
<td>Yes</td>
</tr>
<tr>
<th>max_sp_recursion_depth</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td></td>
<td>Both</td>
<td>Yes</td>
</tr>
<tr>
<th>max_tmp_tables</th>
<td></td>
<td></td>
<td>Yes</td>
<td></td>
<td>Both</td>
<td>Yes</td>
</tr>
<tr>
<th>Max_used_connections</th>
<td></td>
<td></td>
<td></td>
<td>Yes</td>
<td>Global</td>
<td>No</td>
</tr>
<tr>
<th>Max_used_connections_time</th>
<td></td>
<td></td>
<td></td>
<td>Yes</td>
<td>Global</td>
<td>No</td>
</tr>
<tr>
<th>max_user_connections</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td></td>
<td>Both</td>
<td>Yes</td>
</tr>
<tr>
<th>max_write_lock_count</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td></td>
<td>Global</td>
<td>Yes</td>
</tr>
<tr>
<th>mecab_charset</th>
<td></td>
<td></td>
<td></td>
<td>Yes</td>
<td>Global</td>
<td>No</td>
</tr>
<tr>
<th>mecab_rc_file</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td></td>
<td>Global</td>
<td>No</td>
</tr>
<tr>
<th>memlock</th>
<td>Yes</td>
<td>Yes</td>
<td></td>
<td></td>
<td></td>
<td></td>
</tr>
<tr>
<th> - <em>Variable</em>: locked_in_memory</th>
<td></td>
<td></td>
<td></td>
<td></td>
<td></td>
<td></td>
</tr>
<tr>
<th>metadata_locks_cache_size</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td></td>
<td>Global</td>
<td>No</td>
</tr>
<tr>
<th>metadata_locks_hash_instances</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td></td>
<td>Global</td>
<td>No</td>
</tr>
<tr>
<th>min_examined_row_limit</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td></td>
<td>Both</td>
<td>Yes</td>
</tr>
<tr>
<th>multi_range_count</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td></td>
<td>Both</td>
<td>Yes</td>
</tr>
<tr>
<th>myisam-block-size</th>
<td>Yes</td>
<td>Yes</td>
<td></td>
<td></td>
<td></td>
<td></td>
</tr>
<tr>
<th>myisam_data_pointer_size</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td></td>
<td>Global</td>
<td>Yes</td>
</tr>
<tr>
<th>myisam_max_sort_file_size</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td></td>
<td>Global</td>
<td>Yes</td>
</tr>
<tr>
<th>myisam_mmap_size</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td></td>
<td>Global</td>
<td>No</td>
</tr>
<tr>
<th>myisam_recover_options</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td></td>
<td>Global</td>
<td>No</td>
</tr>
<tr>
<th>myisam_repair_threads</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td></td>
<td>Both</td>
<td>Yes</td>
</tr>
<tr>
<th>myisam_sort_buffer_size</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td></td>
<td>Both</td>
<td>Yes</td>
</tr>
<tr>
<th>myisam_stats_method</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td></td>
<td>Both</td>
<td>Yes</td>
</tr>
<tr>
<th>myisam_use_mmap</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td></td>
<td>Global</td>
<td>Yes</td>
</tr>
<tr>
<th>mysql_firewall_mode</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td></td>
<td>Global</td>
<td>Yes</td>
</tr>
<tr>
<th>mysql_firewall_trace</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td></td>
<td>Global</td>
<td>Yes</td>
</tr>
<tr>
<th>mysql_native_password_proxy_users</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td></td>
<td>Global</td>
<td>Yes</td>
</tr>
<tr>
<th>mysqlx</th>
<td>Yes</td>
<td>Yes</td>
<td></td>
<td></td>
<td></td>
<td></td>
</tr>
<tr>
<th>Mysqlx_address</th>
<td></td>
<td></td>
<td></td>
<td>Yes</td>
<td>Global</td>
<td>No</td>
</tr>
<tr>
<th>mysqlx_bind_address</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td></td>
<td>Global</td>
<td>No</td>
</tr>
<tr>
<th>Mysqlx_bytes_received</th>
<td></td>
<td></td>
<td></td>
<td>Yes</td>
<td>Both</td>
<td>No</td>
</tr>
<tr>
<th>Mysqlx_bytes_sent</th>
<td></td>
<td></td>
<td></td>
<td>Yes</td>
<td>Both</td>
<td>No</td>
</tr>
<tr>
<th>mysqlx_connect_timeout</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td></td>
<td>Global</td>
<td>Yes</td>
</tr>
<tr>
<th>Mysqlx_connection_accept_errors</th>
<td></td>
<td></td>
<td></td>
<td>Yes</td>
<td>Both</td>
<td>No</td>
</tr>
<tr>
<th>Mysqlx_connection_errors</th>
<td></td>
<td></td>
<td></td>
<td>Yes</td>
<td>Both</td>
<td>No</td>
</tr>
<tr>
<th>Mysqlx_connections_accepted</th>
<td></td>
<td></td>
<td></td>
<td>Yes</td>
<td>Global</td>
<td>No</td>
</tr>
<tr>
<th>Mysqlx_connections_closed</th>
<td></td>
<td></td>
<td></td>
<td>Yes</td>
<td>Global</td>
<td>No</td>
</tr>
<tr>
<th>Mysqlx_connections_rejected</th>
<td></td>
<td></td>
<td></td>
<td>Yes</td>
<td>Global</td>
<td>No</td>
</tr>
<tr>
<th>Mysqlx_crud_create_view</th>
<td></td>
<td></td>
<td></td>
<td>Yes</td>
<td>Both</td>
<td>No</td>
</tr>
<tr>
<th>Mysqlx_crud_delete</th>
<td></td>
<td></td>
<td></td>
<td>Yes</td>
<td>Both</td>
<td>No</td>
</tr>
<tr>
<th>Mysqlx_crud_drop_view</th>
<td></td>
<td></td>
<td></td>
<td>Yes</td>
<td>Both</td>
<td>No</td>
</tr>
<tr>
<th>Mysqlx_crud_find</th>
<td></td>
<td></td>
<td></td>
<td>Yes</td>
<td>Both</td>
<td>No</td>
</tr>
<tr>
<th>Mysqlx_crud_insert</th>
<td></td>
<td></td>
<td></td>
<td>Yes</td>
<td>Both</td>
<td>No</td>
</tr>
<tr>
<th>Mysqlx_crud_modify_view</th>
<td></td>
<td></td>
<td></td>
<td>Yes</td>
<td>Both</td>
<td>No</td>
</tr>
<tr>
<th>Mysqlx_crud_update</th>
<td></td>
<td></td>
<td></td>
<td>Yes</td>
<td>Both</td>
<td>No</td>
</tr>
<tr>
<th>Mysqlx_errors_sent</th>
<td></td>
<td></td>
<td></td>
<td>Yes</td>
<td>Both</td>
<td>No</td>
</tr>
<tr>
<th>Mysqlx_errors_unknown_message_type</th>
<td></td>
<td></td>
<td></td>
<td>Yes</td>
<td>Both</td>
<td>No</td>
</tr>
<tr>
<th>Mysqlx_expect_close</th>
<td></td>
<td></td>
<td></td>
<td>Yes</td>
<td>Both</td>
<td>No</td>
</tr>
<tr>
<th>Mysqlx_expect_open</th>
<td></td>
<td></td>
<td></td>
<td>Yes</td>
<td>Both</td>
<td>No</td>
</tr>
<tr>
<th>mysqlx_idle_worker_thread_timeout</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td></td>
<td>Global</td>
<td>Yes</td>
</tr>
<tr>
<th>Mysqlx_init_error</th>
<td></td>
<td></td>
<td></td>
<td>Yes</td>
<td>Both</td>
<td>No</td>
</tr>
<tr>
<th>mysqlx_max_allowed_packet</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td></td>
<td>Global</td>
<td>Yes</td>
</tr>
<tr>
<th>mysqlx_max_connections</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td></td>
<td>Global</td>
<td>Yes</td>
</tr>
<tr>
<th>mysqlx_min_worker_threads</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td></td>
<td>Global</td>
<td>Yes</td>
</tr>
<tr>
<th>Mysqlx_notice_other_sent</th>
<td></td>
<td></td>
<td></td>
<td>Yes</td>
<td>Both</td>
<td>No</td>
</tr>
<tr>
<th>Mysqlx_notice_warning_sent</th>
<td></td>
<td></td>
<td></td>
<td>Yes</td>
<td>Both</td>
<td>No</td>
</tr>
<tr>
<th>Mysqlx_port</th>
<td></td>
<td></td>
<td></td>
<td>Yes</td>
<td>Global</td>
<td>No</td>
</tr>
<tr>
<th>mysqlx_port</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td></td>
<td>Global</td>
<td>No</td>
</tr>
<tr>
<th>mysqlx_port_open_timeout</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td></td>
<td>Global</td>
<td>No</td>
</tr>
<tr>
<th>Mysqlx_rows_sent</th>
<td></td>
<td></td>
<td></td>
<td>Yes</td>
<td>Both</td>
<td>No</td>
</tr>
<tr>
<th>Mysqlx_sessions</th>
<td></td>
<td></td>
<td></td>
<td>Yes</td>
<td>Global</td>
<td>No</td>
</tr>
<tr>
<th>Mysqlx_sessions_accepted</th>
<td></td>
<td></td>
<td></td>
<td>Yes</td>
<td>Global</td>
<td>No</td>
</tr>
<tr>
<th>Mysqlx_sessions_closed</th>
<td></td>
<td></td>
<td></td>
<td>Yes</td>
<td>Global</td>
<td>No</td>
</tr>
<tr>
<th>Mysqlx_sessions_fatal_error</th>
<td></td>
<td></td>
<td></td>
<td>Yes</td>
<td>Global</td>
<td>No</td>
</tr>
<tr>
<th>Mysqlx_sessions_killed</th>
<td></td>
<td></td>
<td></td>
<td>Yes</td>
<td>Global</td>
<td>No</td>
</tr>
<tr>
<th>Mysqlx_sessions_rejected</th>
<td></td>
<td></td>
<td></td>
<td>Yes</td>
<td>Global</td>
<td>No</td>
</tr>
<tr>
<th>Mysqlx_socket</th>
<td></td>
<td></td>
<td></td>
<td>Yes</td>
<td>Global</td>
<td>No</td>
</tr>
<tr>
<th>mysqlx_socket</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td></td>
<td>Global</td>
<td>No</td>
</tr>
<tr>
<th>Mysqlx_ssl_accept_renegotiates</th>
<td></td>
<td></td>
<td></td>
<td>Yes</td>
<td>Global</td>
<td>No</td>
</tr>
<tr>
<th>Mysqlx_ssl_accepts</th>
<td></td>
<td></td>
<td></td>
<td>Yes</td>
<td>Global</td>
<td>No</td>
</tr>
<tr>
<th>Mysqlx_ssl_active</th>
<td></td>
<td></td>
<td></td>
<td>Yes</td>
<td>Both</td>
<td>No</td>
</tr>
<tr>
<th>mysqlx_ssl_ca</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td></td>
<td>Global</td>
<td>No</td>
</tr>
<tr>
<th>mysqlx_ssl_capath</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td></td>
<td>Global</td>
<td>No</td>
</tr>
<tr>
<th>mysqlx_ssl_cert</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td></td>
<td>Global</td>
<td>No</td>
</tr>
<tr>
<th>Mysqlx_ssl_cipher</th>
<td></td>
<td></td>
<td></td>
<td>Yes</td>
<td>Both</td>
<td>No</td>
</tr>
<tr>
<th>mysqlx_ssl_cipher</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td></td>
<td>Global</td>
<td>No</td>
</tr>
<tr>
<th>Mysqlx_ssl_cipher_list</th>
<td></td>
<td></td>
<td></td>
<td>Yes</td>
<td>Both</td>
<td>No</td>
</tr>
<tr>
<th>mysqlx_ssl_crl</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td></td>
<td>Global</td>
<td>No</td>
</tr>
<tr>
<th>mysqlx_ssl_crlpath</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td></td>
<td>Global</td>
<td>No</td>
</tr>
<tr>
<th>Mysqlx_ssl_ctx_verify_depth</th>
<td></td>
<td></td>
<td></td>
<td>Yes</td>
<td>Both</td>
<td>No</td>
</tr>
<tr>
<th>Mysqlx_ssl_ctx_verify_mode</th>
<td></td>
<td></td>
<td></td>
<td>Yes</td>
<td>Both</td>
<td>No</td>
</tr>
<tr>
<th>Mysqlx_ssl_finished_accepts</th>
<td></td>
<td></td>
<td></td>
<td>Yes</td>
<td>Global</td>
<td>No</td>
</tr>
<tr>
<th>mysqlx_ssl_key</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td></td>
<td>Global</td>
<td>No</td>
</tr>
<tr>
<th>Mysqlx_ssl_server_not_after</th>
<td></td>
<td></td>
<td></td>
<td>Yes</td>
<td>Global</td>
<td>No</td>
</tr>
<tr>
<th>Mysqlx_ssl_server_not_before</th>
<td></td>
<td></td>
<td></td>
<td>Yes</td>
<td>Global</td>
<td>No</td>
</tr>
<tr>
<th>Mysqlx_ssl_verify_depth</th>
<td></td>
<td></td>
<td></td>
<td>Yes</td>
<td>Global</td>
<td>No</td>
</tr>
<tr>
<th>Mysqlx_ssl_verify_mode</th>
<td></td>
<td></td>
<td></td>
<td>Yes</td>
<td>Global</td>
<td>No</td>
</tr>
<tr>
<th>Mysqlx_ssl_version</th>
<td></td>
<td></td>
<td></td>
<td>Yes</td>
<td>Both</td>
<td>No</td>
</tr>
<tr>
<th>Mysqlx_stmt_create_collection</th>
<td></td>
<td></td>
<td></td>
<td>Yes</td>
<td>Both</td>
<td>No</td>
</tr>
<tr>
<th>Mysqlx_stmt_create_collection_index</th>
<td></td>
<td></td>
<td></td>
<td>Yes</td>
<td>Both</td>
<td>No</td>
</tr>
<tr>
<th>Mysqlx_stmt_disable_notices</th>
<td></td>
<td></td>
<td></td>
<td>Yes</td>
<td>Both</td>
<td>No</td>
</tr>
<tr>
<th>Mysqlx_stmt_drop_collection</th>
<td></td>
<td></td>
<td></td>
<td>Yes</td>
<td>Both</td>
<td>No</td>
</tr>
<tr>
<th>Mysqlx_stmt_drop_collection_index</th>
<td></td>
<td></td>
<td></td>
<td>Yes</td>
<td>Both</td>
<td>No</td>
</tr>
<tr>
<th>Mysqlx_stmt_enable_notices</th>
<td></td>
<td></td>
<td></td>
<td>Yes</td>
<td>Both</td>
<td>No</td>
</tr>
<tr>
<th>Mysqlx_stmt_ensure_collection</th>
<td></td>
<td></td>
<td></td>
<td>Yes</td>
<td>Both</td>
<td>No</td>
</tr>
<tr>
<th>Mysqlx_stmt_execute_mysqlx</th>
<td></td>
<td></td>
<td></td>
<td>Yes</td>
<td>Both</td>
<td>No</td>
</tr>
<tr>
<th>Mysqlx_stmt_execute_sql</th>
<td></td>
<td></td>
<td></td>
<td>Yes</td>
<td>Both</td>
<td>No</td>
</tr>
<tr>
<th>Mysqlx_stmt_execute_xplugin</th>
<td></td>
<td></td>
<td></td>
<td>Yes</td>
<td>Both</td>
<td>No</td>
</tr>
<tr>
<th>Mysqlx_stmt_kill_client</th>
<td></td>
<td></td>
<td></td>
<td>Yes</td>
<td>Both</td>
<td>No</td>
</tr>
<tr>
<th>Mysqlx_stmt_list_clients</th>
<td></td>
<td></td>
<td></td>
<td>Yes</td>
<td>Both</td>
<td>No</td>
</tr>
<tr>
<th>Mysqlx_stmt_list_notices</th>
<td></td>
<td></td>
<td></td>
<td>Yes</td>
<td>Both</td>
<td>No</td>
</tr>
<tr>
<th>Mysqlx_stmt_list_objects</th>
<td></td>
<td></td>
<td></td>
<td>Yes</td>
<td>Both</td>
<td>No</td>
</tr>
<tr>
<th>Mysqlx_stmt_ping</th>
<td></td>
<td></td>
<td></td>
<td>Yes</td>
<td>Both</td>
<td>No</td>
</tr>
<tr>
<th>Mysqlx_worker_threads</th>
<td></td>
<td></td>
<td></td>
<td>Yes</td>
<td>Global</td>
<td>No</td>
</tr>
<tr>
<th>Mysqlx_worker_threads_active</th>
<td></td>
<td></td>
<td></td>
<td>Yes</td>
<td>Global</td>
<td>No</td>
</tr>
<tr>
<th>named_pipe</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td></td>
<td>Global</td>
<td>No</td>
</tr>
<tr>
<th>named_pipe_full_access_group</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td></td>
<td>Global</td>
<td>No</td>
</tr>
<tr>
<th>ndb_allow_copying_alter_table</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td></td>
<td>Both</td>
<td>Yes</td>
</tr>
<tr>
<th>Ndb_api_adaptive_send_deferred_count</th>
<td></td>
<td></td>
<td></td>
<td>Yes</td>
<td>Global</td>
<td>No</td>
</tr>
<tr>
<th>Ndb_api_adaptive_send_deferred_count_session</th>
<td></td>
<td></td>
<td></td>
<td>Yes</td>
<td>Global</td>
<td>No</td>
</tr>
<tr>
<th>Ndb_api_adaptive_send_deferred_count_slave</th>
<td></td>
<td></td>
<td></td>
<td>Yes</td>
<td>Global</td>
<td>No</td>
</tr>
<tr>
<th>Ndb_api_adaptive_send_forced_count</th>
<td></td>
<td></td>
<td></td>
<td>Yes</td>
<td>Global</td>
<td>No</td>
</tr>
<tr>
<th>Ndb_api_adaptive_send_forced_count_session</th>
<td></td>
<td></td>
<td></td>
<td>Yes</td>
<td>Global</td>
<td>No</td>
</tr>
<tr>
<th>Ndb_api_adaptive_send_forced_count_slave</th>
<td></td>
<td></td>
<td></td>
<td>Yes</td>
<td>Global</td>
<td>No</td>
</tr>
<tr>
<th>Ndb_api_adaptive_send_unforced_count</th>
<td></td>
<td></td>
<td></td>
<td>Yes</td>
<td>Global</td>
<td>No</td>
</tr>
<tr>
<th>Ndb_api_adaptive_send_unforced_count_session</th>
<td></td>
<td></td>
<td></td>
<td>Yes</td>
<td>Global</td>
<td>No</td>
</tr>
<tr>
<th>Ndb_api_adaptive_send_unforced_count_slave</th>
<td></td>
<td></td>
<td></td>
<td>Yes</td>
<td>Global</td>
<td>No</td>
</tr>
<tr>
<th>Ndb_api_bytes_received_count</th>
<td></td>
<td></td>
<td></td>
<td>Yes</td>
<td>Global</td>
<td>No</td>
</tr>
<tr>
<th>Ndb_api_bytes_received_count_session</th>
<td></td>
<td></td>
<td></td>
<td>Yes</td>
<td>Session</td>
<td>No</td>
</tr>
<tr>
<th>Ndb_api_bytes_received_count_slave</th>
<td></td>
<td></td>
<td></td>
<td>Yes</td>
<td>Global</td>
<td>No</td>
</tr>
<tr>
<th>Ndb_api_bytes_sent_count</th>
<td></td>
<td></td>
<td></td>
<td>Yes</td>
<td>Global</td>
<td>No</td>
</tr>
<tr>
<th>Ndb_api_bytes_sent_count_session</th>
<td></td>
<td></td>
<td></td>
<td>Yes</td>
<td>Session</td>
<td>No</td>
</tr>
<tr>
<th>Ndb_api_bytes_sent_count_slave</th>
<td></td>
<td></td>
<td></td>
<td>Yes</td>
<td>Global</td>
<td>No</td>
</tr>
<tr>
<th>Ndb_api_event_bytes_count</th>
<td></td>
<td></td>
<td></td>
<td>Yes</td>
<td>Global</td>
<td>No</td>
</tr>
<tr>
<th>Ndb_api_event_bytes_count_injector</th>
<td></td>
<td></td>
<td></td>
<td>Yes</td>
<td>Global</td>
<td>No</td>
</tr>
<tr>
<th>Ndb_api_event_data_count</th>
<td></td>
<td></td>
<td></td>
<td>Yes</td>
<td>Global</td>
<td>No</td>
</tr>
<tr>
<th>Ndb_api_event_data_count_injector</th>
<td></td>
<td></td>
<td></td>
<td>Yes</td>
<td>Global</td>
<td>No</td>
</tr>
<tr>
<th>Ndb_api_event_nondata_count</th>
<td></td>
<td></td>
<td></td>
<td>Yes</td>
<td>Global</td>
<td>No</td>
</tr>
<tr>
<th>Ndb_api_event_nondata_count_injector</th>
<td></td>
<td></td>
<td></td>
<td>Yes</td>
<td>Global</td>
<td>No</td>
</tr>
<tr>
<th>Ndb_api_pk_op_count</th>
<td></td>
<td></td>
<td></td>
<td>Yes</td>
<td>Global</td>
<td>No</td>
</tr>
<tr>
<th>Ndb_api_pk_op_count_session</th>
<td></td>
<td></td>
<td></td>
<td>Yes</td>
<td>Session</td>
<td>No</td>
</tr>
<tr>
<th>Ndb_api_pk_op_count_slave</th>
<td></td>
<td></td>
<td></td>
<td>Yes</td>
<td>Global</td>
<td>No</td>
</tr>
<tr>
<th>Ndb_api_pruned_scan_count</th>
<td></td>
<td></td>
<td></td>
<td>Yes</td>
<td>Global</td>
<td>No</td>
</tr>
<tr>
<th>Ndb_api_pruned_scan_count_session</th>
<td></td>
<td></td>
<td></td>
<td>Yes</td>
<td>Session</td>
<td>No</td>
</tr>
<tr>
<th>Ndb_api_pruned_scan_count_slave</th>
<td></td>
<td></td>
<td></td>
<td>Yes</td>
<td>Global</td>
<td>No</td>
</tr>
<tr>
<th>Ndb_api_range_scan_count</th>
<td></td>
<td></td>
<td></td>
<td>Yes</td>
<td>Global</td>
<td>No</td>
</tr>
<tr>
<th>Ndb_api_range_scan_count_session</th>
<td></td>
<td></td>
<td></td>
<td>Yes</td>
<td>Session</td>
<td>No</td>
</tr>
<tr>
<th>Ndb_api_range_scan_count_slave</th>
<td></td>
<td></td>
<td></td>
<td>Yes</td>
<td>Global</td>
<td>No</td>
</tr>
<tr>
<th>Ndb_api_read_row_count</th>
<td></td>
<td></td>
<td></td>
<td>Yes</td>
<td>Global</td>
<td>No</td>
</tr>
<tr>
<th>Ndb_api_read_row_count_session</th>
<td></td>
<td></td>
<td></td>
<td>Yes</td>
<td>Session</td>
<td>No</td>
</tr>
<tr>
<th>Ndb_api_read_row_count_slave</th>
<td></td>
<td></td>
<td></td>
<td>Yes</td>
<td>Global</td>
<td>No</td>
</tr>
<tr>
<th>Ndb_api_scan_batch_count</th>
<td></td>
<td></td>
<td></td>
<td>Yes</td>
<td>Global</td>
<td>No</td>
</tr>
<tr>
<th>Ndb_api_scan_batch_count_session</th>
<td></td>
<td></td>
<td></td>
<td>Yes</td>
<td>Session</td>
<td>No</td>
</tr>
<tr>
<th>Ndb_api_scan_batch_count_slave</th>
<td></td>
<td></td>
<td></td>
<td>Yes</td>
<td>Global</td>
<td>No</td>
</tr>
<tr>
<th>Ndb_api_table_scan_count</th>
<td></td>
<td></td>
<td></td>
<td>Yes</td>
<td>Global</td>
<td>No</td>
</tr>
<tr>
<th>Ndb_api_table_scan_count_session</th>
<td></td>
<td></td>
<td></td>
<td>Yes</td>
<td>Session</td>
<td>No</td>
</tr>
<tr>
<th>Ndb_api_table_scan_count_slave</th>
<td></td>
<td></td>
<td></td>
<td>Yes</td>
<td>Global</td>
<td>No</td>
</tr>
<tr>
<th>Ndb_api_trans_abort_count</th>
<td></td>
<td></td>
<td></td>
<td>Yes</td>
<td>Global</td>
<td>No</td>
</tr>
<tr>
<th>Ndb_api_trans_abort_count_session</th>
<td></td>
<td></td>
<td></td>
<td>Yes</td>
<td>Session</td>
<td>No</td>
</tr>
<tr>
<th>Ndb_api_trans_abort_count_slave</th>
<td></td>
<td></td>
<td></td>
<td>Yes</td>
<td>Global</td>
<td>No</td>
</tr>
<tr>
<th>Ndb_api_trans_close_count</th>
<td></td>
<td></td>
<td></td>
<td>Yes</td>
<td>Global</td>
<td>No</td>
</tr>
<tr>
<th>Ndb_api_trans_close_count_session</th>
<td></td>
<td></td>
<td></td>
<td>Yes</td>
<td>Session</td>
<td>No</td>
</tr>
<tr>
<th>Ndb_api_trans_close_count_slave</th>
<td></td>
<td></td>
<td></td>
<td>Yes</td>
<td>Global</td>
<td>No</td>
</tr>
<tr>
<th>Ndb_api_trans_commit_count</th>
<td></td>
<td></td>
<td></td>
<td>Yes</td>
<td>Global</td>
<td>No</td>
</tr>
<tr>
<th>Ndb_api_trans_commit_count_session</th>
<td></td>
<td></td>
<td></td>
<td>Yes</td>
<td>Session</td>
<td>No</td>
</tr>
<tr>
<th>Ndb_api_trans_commit_count_slave</th>
<td></td>
<td></td>
<td></td>
<td>Yes</td>
<td>Global</td>
<td>No</td>
</tr>
<tr>
<th>Ndb_api_trans_local_read_row_count</th>
<td></td>
<td></td>
<td></td>
<td>Yes</td>
<td>Global</td>
<td>No</td>
</tr>
<tr>
<th>Ndb_api_trans_local_read_row_count_session</th>
<td></td>
<td></td>
<td></td>
<td>Yes</td>
<td>Session</td>
<td>No</td>
</tr>
<tr>
<th>Ndb_api_trans_local_read_row_count_slave</th>
<td></td>
<td></td>
<td></td>
<td>Yes</td>
<td>Global</td>
<td>No</td>
</tr>
<tr>
<th>Ndb_api_trans_start_count</th>
<td></td>
<td></td>
<td></td>
<td>Yes</td>
<td>Global</td>
<td>No</td>
</tr>
<tr>
<th>Ndb_api_trans_start_count_session</th>
<td></td>
<td></td>
<td></td>
<td>Yes</td>
<td>Session</td>
<td>No</td>
</tr>
<tr>
<th>Ndb_api_trans_start_count_slave</th>
<td></td>
<td></td>
<td></td>
<td>Yes</td>
<td>Global</td>
<td>No</td>
</tr>
<tr>
<th>Ndb_api_uk_op_count</th>
<td></td>
<td></td>
<td></td>
<td>Yes</td>
<td>Global</td>
<td>No</td>
</tr>
<tr>
<th>Ndb_api_uk_op_count_session</th>
<td></td>
<td></td>
<td></td>
<td>Yes</td>
<td>Session</td>
<td>No</td>
</tr>
<tr>
<th>Ndb_api_uk_op_count_slave</th>
<td></td>
<td></td>
<td></td>
<td>Yes</td>
<td>Global</td>
<td>No</td>
</tr>
<tr>
<th>Ndb_api_wait_exec_complete_count</th>
<td></td>
<td></td>
<td></td>
<td>Yes</td>
<td>Global</td>
<td>No</td>
</tr>
<tr>
<th>Ndb_api_wait_exec_complete_count_session</th>
<td></td>
<td></td>
<td></td>
<td>Yes</td>
<td>Session</td>
<td>No</td>
</tr>
<tr>
<th>Ndb_api_wait_exec_complete_count_slave</th>
<td></td>
<td></td>
<td></td>
<td>Yes</td>
<td>Global</td>
<td>No</td>
</tr>
<tr>
<th>Ndb_api_wait_meta_request_count</th>
<td></td>
<td></td>
<td></td>
<td>Yes</td>
<td>Global</td>
<td>No</td>
</tr>
<tr>
<th>Ndb_api_wait_meta_request_count_session</th>
<td></td>
<td></td>
<td></td>
<td>Yes</td>
<td>Session</td>
<td>No</td>
</tr>
<tr>
<th>Ndb_api_wait_meta_request_count_slave</th>
<td></td>
<td></td>
<td></td>
<td>Yes</td>
<td>Global</td>
<td>No</td>
</tr>
<tr>
<th>Ndb_api_wait_nanos_count</th>
<td></td>
<td></td>
<td></td>
<td>Yes</td>
<td>Global</td>
<td>No</td>
</tr>
<tr>
<th>Ndb_api_wait_nanos_count_session</th>
<td></td>
<td></td>
<td></td>
<td>Yes</td>
<td>Session</td>
<td>No</td>
</tr>
<tr>
<th>Ndb_api_wait_nanos_count_slave</th>
<td></td>
<td></td>
<td></td>
<td>Yes</td>
<td>Global</td>
<td>No</td>
</tr>
<tr>
<th>Ndb_api_wait_scan_result_count</th>
<td></td>
<td></td>
<td></td>
<td>Yes</td>
<td>Global</td>
<td>No</td>
</tr>
<tr>
<th>Ndb_api_wait_scan_result_count_session</th>
<td></td>
<td></td>
<td></td>
<td>Yes</td>
<td>Session</td>
<td>No</td>
</tr>
<tr>
<th>Ndb_api_wait_scan_result_count_slave</th>
<td></td>
<td></td>
<td></td>
<td>Yes</td>
<td>Global</td>
<td>No</td>
</tr>
<tr>
<th>ndb_autoincrement_prefetch_sz</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td></td>
<td>Both</td>
<td>Yes</td>
</tr>
<tr>
<th>ndb_batch_size</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td></td>
<td>Both</td>
<td>Yes</td>
</tr>
<tr>
<th>ndb_blob_read_batch_bytes</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td></td>
<td>Both</td>
<td>Yes</td>
</tr>
<tr>
<th>ndb_blob_write_batch_bytes</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td></td>
<td>Both</td>
<td>Yes</td>
</tr>
<tr>
<th>ndb_cache_check_time</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td></td>
<td>Global</td>
<td>Yes</td>
</tr>
<tr>
<th>ndb_clear_apply_status</th>
<td>Yes</td>
<td></td>
<td>Yes</td>
<td></td>
<td>Global</td>
<td>Yes</td>
</tr>
<tr>
<th>ndb_cluster_connection_pool</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td></td>
<td>Global</td>
<td>No</td>
</tr>
<tr>
<th>ndb_cluster_connection_pool_nodeids</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td></td>
<td>Global</td>
<td>No</td>
</tr>
<tr>
<th>Ndb_cluster_node_id</th>
<td></td>
<td></td>
<td></td>
<td>Yes</td>
<td>Global</td>
<td>No</td>
</tr>
<tr>
<th>Ndb_config_from_host</th>
<td></td>
<td></td>
<td></td>
<td>Yes</td>
<td>Both</td>
<td>No</td>
</tr>
<tr>
<th>Ndb_config_from_port</th>
<td></td>
<td></td>
<td></td>
<td>Yes</td>
<td>Both</td>
<td>No</td>
</tr>
<tr>
<th>Ndb_conflict_fn_epoch</th>
<td></td>
<td></td>
<td></td>
<td>Yes</td>
<td>Global</td>
<td>No</td>
</tr>
<tr>
<th>Ndb_conflict_fn_epoch_trans</th>
<td></td>
<td></td>
<td></td>
<td>Yes</td>
<td>Global</td>
<td>No</td>
</tr>
<tr>
<th>Ndb_conflict_fn_epoch2</th>
<td></td>
<td></td>
<td></td>
<td>Yes</td>
<td>Global</td>
<td>No</td>
</tr>
<tr>
<th>Ndb_conflict_fn_epoch2_trans</th>
<td></td>
<td></td>
<td></td>
<td>Yes</td>
<td>Global</td>
<td>No</td>
</tr>
<tr>
<th>Ndb_conflict_fn_max</th>
<td></td>
<td></td>
<td></td>
<td>Yes</td>
<td>Global</td>
<td>No</td>
</tr>
<tr>
<th>Ndb_conflict_fn_max_del_win</th>
<td></td>
<td></td>
<td></td>
<td>Yes</td>
<td>Global</td>
<td>No</td>
</tr>
<tr>
<th>Ndb_conflict_fn_old</th>
<td></td>
<td></td>
<td></td>
<td>Yes</td>
<td>Global</td>
<td>No</td>
</tr>
<tr>
<th>Ndb_conflict_last_conflict_epoch</th>
<td></td>
<td></td>
<td></td>
<td>Yes</td>
<td>Global</td>
<td>No</td>
</tr>
<tr>
<th>Ndb_conflict_last_stable_epoch</th>
<td></td>
<td></td>
<td></td>
<td>Yes</td>
<td>Global</td>
<td>No</td>
</tr>
<tr>
<th>Ndb_conflict_reflected_op_discard_count</th>
<td></td>
<td></td>
<td></td>
<td>Yes</td>
<td>Global</td>
<td>No</td>
</tr>
<tr>
<th>Ndb_conflict_reflected_op_prepare_count</th>
<td></td>
<td></td>
<td></td>
<td>Yes</td>
<td>Global</td>
<td>No</td>
</tr>
<tr>
<th>Ndb_conflict_refresh_op_count</th>
<td></td>
<td></td>
<td></td>
<td>Yes</td>
<td>Global</td>
<td>No</td>
</tr>
<tr>
<th>Ndb_conflict_trans_conflict_commit_count</th>
<td></td>
<td></td>
<td></td>
<td>Yes</td>
<td>Global</td>
<td>No</td>
</tr>
<tr>
<th>Ndb_conflict_trans_detect_iter_count</th>
<td></td>
<td></td>
<td></td>
<td>Yes</td>
<td>Global</td>
<td>No</td>
</tr>
<tr>
<th>Ndb_conflict_trans_reject_count</th>
<td></td>
<td></td>
<td></td>
<td>Yes</td>
<td>Global</td>
<td>No</td>
</tr>
<tr>
<th>Ndb_conflict_trans_row_conflict_count</th>
<td></td>
<td></td>
<td></td>
<td>Yes</td>
<td>Global</td>
<td>No</td>
</tr>
<tr>
<th>Ndb_conflict_trans_row_reject_count</th>
<td></td>
<td></td>
<td></td>
<td>Yes</td>
<td>Global</td>
<td>No</td>
</tr>
<tr>
<th>ndb-connectstring</th>
<td>Yes</td>
<td>Yes</td>
<td></td>
<td></td>
<td></td>
<td></td>
</tr>
<tr>
<th>ndb_data_node_neighbour</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td></td>
<td>Global</td>
<td>Yes</td>
</tr>
<tr>
<th>ndb_default_column_format</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td></td>
<td>Global</td>
<td>Yes</td>
</tr>
<tr>
<th>ndb_default_column_format</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td></td>
<td>Global</td>
<td>Yes</td>
</tr>
<tr>
<th>ndb_deferred_constraints</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td></td>
<td>Both</td>
<td>Yes</td>
</tr>
<tr>
<th>ndb_deferred_constraints</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td></td>
<td>Both</td>
<td>Yes</td>
</tr>
<tr>
<th>ndb_distribution</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td></td>
<td>Global</td>
<td>Yes</td>
</tr>
<tr>
<th>ndb_distribution</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td></td>
<td>Global</td>
<td>Yes</td>
</tr>
<tr>
<th>Ndb_epoch_delete_delete_count</th>
<td></td>
<td></td>
<td></td>
<td>Yes</td>
<td>Global</td>
<td>No</td>
</tr>
<tr>
<th>ndb_eventbuffer_free_percent</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td></td>
<td>Global</td>
<td>Yes</td>
</tr>
<tr>
<th>ndb_eventbuffer_max_alloc</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td></td>
<td>Global</td>
<td>Yes</td>
</tr>
<tr>
<th>Ndb_execute_count</th>
<td></td>
<td></td>
<td></td>
<td>Yes</td>
<td>Global</td>
<td>No</td>
</tr>
<tr>
<th>ndb_extra_logging</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td></td>
<td>Global</td>
<td>Yes</td>
</tr>
<tr>
<th>ndb_force_send</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td></td>
<td>Both</td>
<td>Yes</td>
</tr>
<tr>
<th>ndb_fully_replicated</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td></td>
<td>Both</td>
<td>Yes</td>
</tr>
<tr>
<th>ndb_index_stat_enable</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td></td>
<td>Both</td>
<td>Yes</td>
</tr>
<tr>
<th>ndb_index_stat_option</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td></td>
<td>Both</td>
<td>Yes</td>
</tr>
<tr>
<th>ndb_join_pushdown</th>
<td></td>
<td></td>
<td>Yes</td>
<td></td>
<td>Both</td>
<td>Yes</td>
</tr>
<tr>
<th>Ndb_last_commit_epoch_server</th>
<td></td>
<td></td>
<td></td>
<td>Yes</td>
<td>Global</td>
<td>No</td>
</tr>
<tr>
<th>Ndb_last_commit_epoch_session</th>
<td></td>
<td></td>
<td></td>
<td>Yes</td>
<td>Session</td>
<td>No</td>
</tr>
<tr>
<th>ndb_log_apply_status</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td></td>
<td>Global</td>
<td>No</td>
</tr>
<tr>
<th>ndb_log_apply_status</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td></td>
<td>Global</td>
<td>No</td>
</tr>
<tr>
<th>ndb_log_bin</th>
<td>Yes</td>
<td></td>
<td>Yes</td>
<td></td>
<td>Both</td>
<td>No</td>
</tr>
<tr>
<th>ndb_log_binlog_index</th>
<td>Yes</td>
<td></td>
<td>Yes</td>
<td></td>
<td>Global</td>
<td>Yes</td>
</tr>
<tr>
<th>ndb_log_empty_epochs</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td></td>
<td>Global</td>
<td>Yes</td>
</tr>
<tr>
<th>ndb_log_empty_epochs</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td></td>
<td>Global</td>
<td>Yes</td>
</tr>
<tr>
<th>ndb_log_empty_update</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td></td>
<td>Global</td>
<td>Yes</td>
</tr>
<tr>
<th>ndb_log_empty_update</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td></td>
<td>Global</td>
<td>Yes</td>
</tr>
<tr>
<th>ndb_log_exclusive_reads</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td></td>
<td>Both</td>
<td>Yes</td>
</tr>
<tr>
<th>ndb_log_exclusive_reads</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td></td>
<td>Both</td>
<td>Yes</td>
</tr>
<tr>
<th>ndb_log_fail_terminate</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td></td>
<td>Global</td>
<td>No</td>
</tr>
<tr>
<th>ndb_log_orig</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td></td>
<td>Global</td>
<td>No</td>
</tr>
<tr>
<th>ndb_log_orig</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td></td>
<td>Global</td>
<td>No</td>
</tr>
<tr>
<th>ndb_log_transaction_id</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td></td>
<td>Global</td>
<td>No</td>
</tr>
<tr>
<th>ndb_log_transaction_id</th>
<td></td>
<td></td>
<td>Yes</td>
<td></td>
<td>Global</td>
<td>No</td>
</tr>
<tr>
<th>ndb_log_update_as_write</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td></td>
<td>Global</td>
<td>Yes</td>
</tr>
<tr>
<th>ndb_log_update_minimal</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td></td>
<td>Global</td>
<td>Yes</td>
</tr>
<tr>
<th>ndb_log_updated_only</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td></td>
<td>Global</td>
<td>Yes</td>
</tr>
<tr>
<th>ndb-mgmd-host</th>
<td>Yes</td>
<td>Yes</td>
<td></td>
<td></td>
<td></td>
<td></td>
</tr>
<tr>
<th>ndb_nodeid</th>
<td>Yes</td>
<td>Yes</td>
<td></td>
<td>Yes</td>
<td>Global</td>
<td>No</td>
</tr>
<tr>
<th>Ndb_number_of_data_nodes</th>
<td></td>
<td></td>
<td></td>
<td>Yes</td>
<td>Global</td>
<td>No</td>
</tr>
<tr>
<th>ndb_optimization_delay</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td></td>
<td>Global</td>
<td>Yes</td>
</tr>
<tr>
<th>ndb_optimized_node_selection</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td></td>
<td>Global</td>
<td>Yes</td>
</tr>
<tr>
<th>ndb_optimized_node_selection</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td></td>
<td>Global</td>
<td>No</td>
</tr>
<tr>
<th>Ndb_pruned_scan_count</th>
<td></td>
<td></td>
<td></td>
<td>Yes</td>
<td>Global</td>
<td>No</td>
</tr>
<tr>
<th>Ndb_pushed_queries_defined</th>
<td></td>
<td></td>
<td></td>
<td>Yes</td>
<td>Global</td>
<td>No</td>
</tr>
<tr>
<th>Ndb_pushed_queries_dropped</th>
<td></td>
<td></td>
<td></td>
<td>Yes</td>
<td>Global</td>
<td>No</td>
</tr>
<tr>
<th>Ndb_pushed_queries_executed</th>
<td></td>
<td></td>
<td></td>
<td>Yes</td>
<td>Global</td>
<td>No</td>
</tr>
<tr>
<th>Ndb_pushed_reads</th>
<td></td>
<td></td>
<td></td>
<td>Yes</td>
<td>Global</td>
<td>No</td>
</tr>
<tr>
<th>ndb_read_backup</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td></td>
<td>Global</td>
<td>Yes</td>
</tr>
<tr>
<th>ndb_recv_thread_activation_threshold</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td></td>
<td>Global</td>
<td>Yes</td>
</tr>
<tr>
<th>ndb_recv_thread_cpu_mask</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td></td>
<td>Global</td>
<td>Yes</td>
</tr>
<tr>
<th>ndb_report_thresh_binlog_epoch_slip</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td></td>
<td>Global</td>
<td>Yes</td>
</tr>
<tr>
<th>ndb_report_thresh_binlog_mem_usage</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td></td>
<td>Global</td>
<td>Yes</td>
</tr>
<tr>
<th>ndb_row_checksum</th>
<td></td>
<td></td>
<td>Yes</td>
<td></td>
<td>Both</td>
<td>Yes</td>
</tr>
<tr>
<th>Ndb_scan_count</th>
<td></td>
<td></td>
<td></td>
<td>Yes</td>
<td>Global</td>
<td>No</td>
</tr>
<tr>
<th>ndb_show_foreign_key_mock_tables</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td></td>
<td>Global</td>
<td>Yes</td>
</tr>
<tr>
<th>ndb_slave_conflict_role</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td></td>
<td>Global</td>
<td>Yes</td>
</tr>
<tr>
<th>Ndb_slave_max_replicated_epoch</th>
<td></td>
<td></td>
<td></td>
<td>Yes</td>
<td>Global</td>
<td>No</td>
</tr>
<tr>
<th>Ndb_system_name</th>
<td></td>
<td></td>
<td>Yes</td>
<td></td>
<td>Global</td>
<td>No</td>
</tr>
<tr>
<th>ndb_table_no_logging</th>
<td></td>
<td></td>
<td>Yes</td>
<td></td>
<td>Session</td>
<td>Yes</td>
</tr>
<tr>
<th>ndb_table_temporary</th>
<td></td>
<td></td>
<td>Yes</td>
<td></td>
<td>Session</td>
<td>Yes</td>
</tr>
<tr>
<th>ndb-transid-mysql-connection-map</th>
<td>Yes</td>
<td></td>
<td></td>
<td></td>
<td></td>
<td></td>
</tr>
<tr>
<th>ndb_use_copying_alter_table</th>
<td></td>
<td></td>
<td>Yes</td>
<td></td>
<td>Both</td>
<td>No</td>
</tr>
<tr>
<th>ndb_use_exact_count</th>
<td></td>
<td></td>
<td>Yes</td>
<td></td>
<td>Both</td>
<td>Yes</td>
</tr>
<tr>
<th>ndb_use_transactions</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td></td>
<td>Both</td>
<td>Yes</td>
</tr>
<tr>
<th>ndb_version</th>
<td></td>
<td></td>
<td>Yes</td>
<td></td>
<td>Global</td>
<td>No</td>
</tr>
<tr>
<th>ndb_version_string</th>
<td></td>
<td></td>
<td>Yes</td>
<td></td>
<td>Global</td>
<td>No</td>
</tr>
<tr>
<th>ndb_wait_connected</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td></td>
<td>Global</td>
<td>No</td>
</tr>
<tr>
<th>ndb_wait_setup</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td></td>
<td>Global</td>
<td>No</td>
</tr>
<tr>
<th>ndbcluster</th>
<td>Yes</td>
<td>Yes</td>
<td></td>
<td></td>
<td></td>
<td></td>
</tr>
<tr>
<th>ndbinfo_database</th>
<td></td>
<td></td>
<td>Yes</td>
<td></td>
<td>Global</td>
<td>No</td>
</tr>
<tr>
<th>ndbinfo_max_bytes</th>
<td>Yes</td>
<td></td>
<td>Yes</td>
<td></td>
<td>Both</td>
<td>Yes</td>
</tr>
<tr>
<th>ndbinfo_max_rows</th>
<td>Yes</td>
<td></td>
<td>Yes</td>
<td></td>
<td>Both</td>
<td>Yes</td>
</tr>
<tr>
<th>ndbinfo_offline</th>
<td></td>
<td></td>
<td>Yes</td>
<td></td>
<td>Global</td>
<td>Yes</td>
</tr>
<tr>
<th>ndbinfo_show_hidden</th>
<td>Yes</td>
<td></td>
<td>Yes</td>
<td></td>
<td>Both</td>
<td>Yes</td>
</tr>
<tr>
<th>ndbinfo_table_prefix</th>
<td></td>
<td></td>
<td>Yes</td>
<td></td>
<td>Global</td>
<td>No</td>
</tr>
<tr>
<th>ndbinfo_version</th>
<td></td>
<td></td>
<td>Yes</td>
<td></td>
<td>Global</td>
<td>No</td>
</tr>
<tr>
<th>net_buffer_length</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td></td>
<td>Both</td>
<td>Yes</td>
</tr>
<tr>
<th>net_read_timeout</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td></td>
<td>Both</td>
<td>Yes</td>
</tr>
<tr>
<th>net_retry_count</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td></td>
<td>Both</td>
<td>Yes</td>
</tr>
<tr>
<th>net_write_timeout</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td></td>
<td>Both</td>
<td>Yes</td>
</tr>
<tr>
<th>new</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td></td>
<td>Both</td>
<td>Yes</td>
</tr>
<tr>
<th>ngram_token_size</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td></td>
<td>Global</td>
<td>No</td>
</tr>
<tr>
<th>no-defaults</th>
<td>Yes</td>
<td></td>
<td></td>
<td></td>
<td></td>
<td></td>
</tr>
<tr>
<th>Not_flushed_delayed_rows</th>
<td></td>
<td></td>
<td></td>
<td>Yes</td>
<td>Global</td>
<td>No</td>
</tr>
<tr>
<th>offline_mode</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td></td>
<td>Global</td>
<td>Yes</td>
</tr>
<tr>
<th>old</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td></td>
<td>Global</td>
<td>No</td>
</tr>
<tr>
<th>old_alter_table</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td></td>
<td>Both</td>
<td>Yes</td>
</tr>
<tr>
<th>old_passwords</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td></td>
<td>Both</td>
<td>Yes</td>
</tr>
<tr>
<th>old-style-user-limits</th>
<td>Yes</td>
<td>Yes</td>
<td></td>
<td></td>
<td></td>
<td></td>
</tr>
<tr>
<th>Ongoing_anonymous_gtid_violating_transaction_count</th>
<td></td>
<td></td>
<td></td>
<td>Yes</td>
<td>Global</td>
<td>No</td>
</tr>
<tr>
<th>Ongoing_anonymous_transaction_count</th>
<td></td>
<td></td>
<td></td>
<td>Yes</td>
<td>Global</td>
<td>No</td>
</tr>
<tr>
<th>Ongoing_automatic_gtid_violating_transaction_count</th>
<td></td>
<td></td>
<td></td>
<td>Yes</td>
<td>Global</td>
<td>No</td>
</tr>
<tr>
<th>Open_files</th>
<td></td>
<td></td>
<td></td>
<td>Yes</td>
<td>Global</td>
<td>No</td>
</tr>
<tr>
<th>open_files_limit</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td></td>
<td>Global</td>
<td>No</td>
</tr>
<tr>
<th>Open_streams</th>
<td></td>
<td></td>
<td></td>
<td>Yes</td>
<td>Global</td>
<td>No</td>
</tr>
<tr>
<th>Open_table_definitions</th>
<td></td>
<td></td>
<td></td>
<td>Yes</td>
<td>Global</td>
<td>No</td>
</tr>
<tr>
<th>Open_tables</th>
<td></td>
<td></td>
<td></td>
<td>Yes</td>
<td>Both</td>
<td>No</td>
</tr>
<tr>
<th>Opened_files</th>
<td></td>
<td></td>
<td></td>
<td>Yes</td>
<td>Global</td>
<td>No</td>
</tr>
<tr>
<th>Opened_table_definitions</th>
<td></td>
<td></td>
<td></td>
<td>Yes</td>
<td>Both</td>
<td>No</td>
</tr>
<tr>
<th>Opened_tables</th>
<td></td>
<td></td>
<td></td>
<td>Yes</td>
<td>Both</td>
<td>No</td>
</tr>
<tr>
<th>optimizer_prune_level</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td></td>
<td>Both</td>
<td>Yes</td>
</tr>
<tr>
<th>optimizer_search_depth</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td></td>
<td>Both</td>
<td>Yes</td>
</tr>
<tr>
<th>optimizer_switch</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td></td>
<td>Both</td>
<td>Yes</td>
</tr>
<tr>
<th>optimizer_trace</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td></td>
<td>Both</td>
<td>Yes</td>
</tr>
<tr>
<th>optimizer_trace_features</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td></td>
<td>Both</td>
<td>Yes</td>
</tr>
<tr>
<th>optimizer_trace_limit</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td></td>
<td>Both</td>
<td>Yes</td>
</tr>
<tr>
<th>optimizer_trace_max_mem_size</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td></td>
<td>Both</td>
<td>Yes</td>
</tr>
<tr>
<th>optimizer_trace_offset</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td></td>
<td>Both</td>
<td>Yes</td>
</tr>
<tr>
<th>parser_max_mem_size</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td></td>
<td>Both</td>
<td>Yes</td>
</tr>
<tr>
<th>partition</th>
<td>Yes</td>
<td>Yes</td>
<td></td>
<td></td>
<td></td>
<td></td>
</tr>
<tr>
<th>performance_schema</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td></td>
<td>Global</td>
<td>No</td>
</tr>
<tr>
<th>Performance_schema_accounts_lost</th>
<td></td>
<td></td>
<td></td>
<td>Yes</td>
<td>Global</td>
<td>No</td>
</tr>
<tr>
<th>performance_schema_accounts_size</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td></td>
<td>Global</td>
<td>No</td>
</tr>
<tr>
<th>Performance_schema_cond_classes_lost</th>
<td></td>
<td></td>
<td></td>
<td>Yes</td>
<td>Global</td>
<td>No</td>
</tr>
<tr>
<th>Performance_schema_cond_instances_lost</th>
<td></td>
<td></td>
<td></td>
<td>Yes</td>
<td>Global</td>
<td>No</td>
</tr>
<tr>
<th>performance-schema-consumer-events-stages-current</th>
<td>Yes</td>
<td>Yes</td>
<td></td>
<td></td>
<td></td>
<td></td>
</tr>
<tr>
<th>performance-schema-consumer-events-stages-history</th>
<td>Yes</td>
<td>Yes</td>
<td></td>
<td></td>
<td></td>
<td></td>
</tr>
<tr>
<th>performance-schema-consumer-events-stages-history-long</th>
<td>Yes</td>
<td>Yes</td>
<td></td>
<td></td>
<td></td>
<td></td>
</tr>
<tr>
<th>performance-schema-consumer-events-statements-current</th>
<td>Yes</td>
<td>Yes</td>
<td></td>
<td></td>
<td></td>
<td></td>
</tr>
<tr>
<th>performance-schema-consumer-events-statements-history</th>
<td>Yes</td>
<td>Yes</td>
<td></td>
<td></td>
<td></td>
<td></td>
</tr>
<tr>
<th>performance-schema-consumer-events-statements-history-long</th>
<td>Yes</td>
<td>Yes</td>
<td></td>
<td></td>
<td></td>
<td></td>
</tr>
<tr>
<th>performance-schema-consumer-events-transactions-current</th>
<td>Yes</td>
<td>Yes</td>
<td></td>
<td></td>
<td></td>
<td></td>
</tr>
<tr>
<th>performance-schema-consumer-events-transactions-history</th>
<td>Yes</td>
<td>Yes</td>
<td></td>
<td></td>
<td></td>
<td></td>
</tr>
<tr>
<th>performance-schema-consumer-events-transactions-history-long</th>
<td>Yes</td>
<td>Yes</td>
<td></td>
<td></td>
<td></td>
<td></td>
</tr>
<tr>
<th>performance-schema-consumer-events-waits-current</th>
<td>Yes</td>
<td>Yes</td>
<td></td>
<td></td>
<td></td>
<td></td>
</tr>
<tr>
<th>performance-schema-consumer-events-waits-history</th>
<td>Yes</td>
<td>Yes</td>
<td></td>
<td></td>
<td></td>
<td></td>
</tr>
<tr>
<th>performance-schema-consumer-events-waits-history-long</th>
<td>Yes</td>
<td>Yes</td>
<td></td>
<td></td>
<td></td>
<td></td>
</tr>
<tr>
<th>performance-schema-consumer-global-instrumentation</th>
<td>Yes</td>
<td>Yes</td>
<td></td>
<td></td>
<td></td>
<td></td>
</tr>
<tr>
<th>performance-schema-consumer-statements-digest</th>
<td>Yes</td>
<td>Yes</td>
<td></td>
<td></td>
<td></td>
<td></td>
</tr>
<tr>
<th>performance-schema-consumer-thread-instrumentation</th>
<td>Yes</td>
<td>Yes</td>
<td></td>
<td></td>
<td></td>
<td></td>
</tr>
<tr>
<th>Performance_schema_digest_lost</th>
<td></td>
<td></td>
<td></td>
<td>Yes</td>
<td>Global</td>
<td>No</td>
</tr>
<tr>
<th>performance_schema_digests_size</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td></td>
<td>Global</td>
<td>No</td>
</tr>
<tr>
<th>performance_schema_events_stages_history_long_size</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td></td>
<td>Global</td>
<td>No</td>
</tr>
<tr>
<th>performance_schema_events_stages_history_size</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td></td>
<td>Global</td>
<td>No</td>
</tr>
<tr>
<th>performance_schema_events_statements_history_long_size</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td></td>
<td>Global</td>
<td>No</td>
</tr>
<tr>
<th>performance_schema_events_statements_history_size</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td></td>
<td>Global</td>
<td>No</td>
</tr>
<tr>
<th>performance_schema_events_transactions_history_long_size</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td></td>
<td>Global</td>
<td>No</td>
</tr>
<tr>
<th>performance_schema_events_transactions_history_size</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td></td>
<td>Global</td>
<td>No</td>
</tr>
<tr>
<th>performance_schema_events_waits_history_long_size</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td></td>
<td>Global</td>
<td>No</td>
</tr>
<tr>
<th>performance_schema_events_waits_history_size</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td></td>
<td>Global</td>
<td>No</td>
</tr>
<tr>
<th>Performance_schema_file_classes_lost</th>
<td></td>
<td></td>
<td></td>
<td>Yes</td>
<td>Global</td>
<td>No</td>
</tr>
<tr>
<th>Performance_schema_file_handles_lost</th>
<td></td>
<td></td>
<td></td>
<td>Yes</td>
<td>Global</td>
<td>No</td>
</tr>
<tr>
<th>Performance_schema_file_instances_lost</th>
<td></td>
<td></td>
<td></td>
<td>Yes</td>
<td>Global</td>
<td>No</td>
</tr>
<tr>
<th>Performance_schema_hosts_lost</th>
<td></td>
<td></td>
<td></td>
<td>Yes</td>
<td>Global</td>
<td>No</td>
</tr>
<tr>
<th>performance_schema_hosts_size</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td></td>
<td>Global</td>
<td>No</td>
</tr>
<tr>
<th>Performance_schema_index_stat_lost</th>
<td></td>
<td></td>
<td></td>
<td>Yes</td>
<td>Global</td>
<td>No</td>
</tr>
<tr>
<th>performance-schema-instrument</th>
<td>Yes</td>
<td>Yes</td>
<td></td>
<td></td>
<td></td>
<td></td>
</tr>
<tr>
<th>Performance_schema_locker_lost</th>
<td></td>
<td></td>
<td></td>
<td>Yes</td>
<td>Global</td>
<td>No</td>
</tr>
<tr>
<th>performance_schema_max_cond_classes</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td></td>
<td>Global</td>
<td>No</td>
</tr>
<tr>
<th>performance_schema_max_cond_instances</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td></td>
<td>Global</td>
<td>No</td>
</tr>
<tr>
<th>performance_schema_max_digest_length</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td></td>
<td>Global</td>
<td>No</td>
</tr>
<tr>
<th>performance_schema_max_file_classes</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td></td>
<td>Global</td>
<td>No</td>
</tr>
<tr>
<th>performance_schema_max_file_handles</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td></td>
<td>Global</td>
<td>No</td>
</tr>
<tr>
<th>performance_schema_max_file_instances</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td></td>
<td>Global</td>
<td>No</td>
</tr>
<tr>
<th>performance_schema_max_index_stat</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td></td>
<td>Global</td>
<td>No</td>
</tr>
<tr>
<th>performance_schema_max_memory_classes</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td></td>
<td>Global</td>
<td>No</td>
</tr>
<tr>
<th>performance_schema_max_metadata_locks</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td></td>
<td>Global</td>
<td>No</td>
</tr>
<tr>
<th>performance_schema_max_mutex_classes</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td></td>
<td>Global</td>
<td>No</td>
</tr>
<tr>
<th>performance_schema_max_mutex_instances</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td></td>
<td>Global</td>
<td>No</td>
</tr>
<tr>
<th>performance_schema_max_prepared_statements_instances</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td></td>
<td>Global</td>
<td>No</td>
</tr>
<tr>
<th>performance_schema_max_program_instances</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td></td>
<td>Global</td>
<td>No</td>
</tr>
<tr>
<th>performance_schema_max_rwlock_classes</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td></td>
<td>Global</td>
<td>No</td>
</tr>
<tr>
<th>performance_schema_max_rwlock_instances</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td></td>
<td>Global</td>
<td>No</td>
</tr>
<tr>
<th>performance_schema_max_socket_classes</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td></td>
<td>Global</td>
<td>No</td>
</tr>
<tr>
<th>performance_schema_max_socket_instances</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td></td>
<td>Global</td>
<td>No</td>
</tr>
<tr>
<th>performance_schema_max_sql_text_length</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td></td>
<td>Global</td>
<td>No</td>
</tr>
<tr>
<th>performance_schema_max_stage_classes</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td></td>
<td>Global</td>
<td>No</td>
</tr>
<tr>
<th>performance_schema_max_statement_classes</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td></td>
<td>Global</td>
<td>No</td>
</tr>
<tr>
<th>performance_schema_max_statement_stack</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td></td>
<td>Global</td>
<td>No</td>
</tr>
<tr>
<th>performance_schema_max_table_handles</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td></td>
<td>Global</td>
<td>No</td>
</tr>
<tr>
<th>performance_schema_max_table_instances</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td></td>
<td>Global</td>
<td>No</td>
</tr>
<tr>
<th>performance_schema_max_table_lock_stat</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td></td>
<td>Global</td>
<td>No</td>
</tr>
<tr>
<th>performance_schema_max_thread_classes</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td></td>
<td>Global</td>
<td>No</td>
</tr>
<tr>
<th>performance_schema_max_thread_instances</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td></td>
<td>Global</td>
<td>No</td>
</tr>
<tr>
<th>Performance_schema_memory_classes_lost</th>
<td></td>
<td></td>
<td></td>
<td>Yes</td>
<td>Global</td>
<td>No</td>
</tr>
<tr>
<th>Performance_schema_metadata_lock_lost</th>
<td></td>
<td></td>
<td></td>
<td>Yes</td>
<td>Global</td>
<td>No</td>
</tr>
<tr>
<th>Performance_schema_mutex_classes_lost</th>
<td></td>
<td></td>
<td></td>
<td>Yes</td>
<td>Global</td>
<td>No</td>
</tr>
<tr>
<th>Performance_schema_mutex_instances_lost</th>
<td></td>
<td></td>
<td></td>
<td>Yes</td>
<td>Global</td>
<td>No</td>
</tr>
<tr>
<th>Performance_schema_nested_statement_lost</th>
<td></td>
<td></td>
<td></td>
<td>Yes</td>
<td>Global</td>
<td>No</td>
</tr>
<tr>
<th>Performance_schema_prepared_statements_lost</th>
<td></td>
<td></td>
<td></td>
<td>Yes</td>
<td>Global</td>
<td>No</td>
</tr>
<tr>
<th>Performance_schema_program_lost</th>
<td></td>
<td></td>
<td></td>
<td>Yes</td>
<td>Global</td>
<td>No</td>
</tr>
<tr>
<th>Performance_schema_rwlock_classes_lost</th>
<td></td>
<td></td>
<td></td>
<td>Yes</td>
<td>Global</td>
<td>No</td>
</tr>
<tr>
<th>Performance_schema_rwlock_instances_lost</th>
<td></td>
<td></td>
<td></td>
<td>Yes</td>
<td>Global</td>
<td>No</td>
</tr>
<tr>
<th>Performance_schema_session_connect_attrs_lost</th>
<td></td>
<td></td>
<td></td>
<td>Yes</td>
<td>Global</td>
<td>No</td>
</tr>
<tr>
<th>performance_schema_session_connect_attrs_size</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td></td>
<td>Global</td>
<td>No</td>
</tr>
<tr>
<th>performance_schema_setup_actors_size</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td></td>
<td>Global</td>
<td>No</td>
</tr>
<tr>
<th>performance_schema_setup_objects_size</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td></td>
<td>Global</td>
<td>No</td>
</tr>
<tr>
<th>performance_schema_show_processlist</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td></td>
<td>Global</td>
<td>Yes</td>
</tr>
<tr>
<th>Performance_schema_socket_classes_lost</th>
<td></td>
<td></td>
<td></td>
<td>Yes</td>
<td>Global</td>
<td>No</td>
</tr>
<tr>
<th>Performance_schema_socket_instances_lost</th>
<td></td>
<td></td>
<td></td>
<td>Yes</td>
<td>Global</td>
<td>No</td>
</tr>
<tr>
<th>Performance_schema_stage_classes_lost</th>
<td></td>
<td></td>
<td></td>
<td>Yes</td>
<td>Global</td>
<td>No</td>
</tr>
<tr>
<th>Performance_schema_statement_classes_lost</th>
<td></td>
<td></td>
<td></td>
<td>Yes</td>
<td>Global</td>
<td>No</td>
</tr>
<tr>
<th>Performance_schema_table_handles_lost</th>
<td></td>
<td></td>
<td></td>
<td>Yes</td>
<td>Global</td>
<td>No</td>
</tr>
<tr>
<th>Performance_schema_table_instances_lost</th>
<td></td>
<td></td>
<td></td>
<td>Yes</td>
<td>Global</td>
<td>No</td>
</tr>
<tr>
<th>Performance_schema_table_lock_stat_lost</th>
<td></td>
<td></td>
<td></td>
<td>Yes</td>
<td>Global</td>
<td>No</td>
</tr>
<tr>
<th>Performance_schema_thread_classes_lost</th>
<td></td>
<td></td>
<td></td>
<td>Yes</td>
<td>Global</td>
<td>No</td>
</tr>
<tr>
<th>Performance_schema_thread_instances_lost</th>
<td></td>
<td></td>
<td></td>
<td>Yes</td>
<td>Global</td>
<td>No</td>
</tr>
<tr>
<th>Performance_schema_users_lost</th>
<td></td>
<td></td>
<td></td>
<td>Yes</td>
<td>Global</td>
<td>No</td>
</tr>
<tr>
<th>performance_schema_users_size</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td></td>
<td>Global</td>
<td>No</td>
</tr>
<tr>
<th>pid_file</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td></td>
<td>Global</td>
<td>No</td>
</tr>
<tr>
<th>plugin_dir</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td></td>
<td>Global</td>
<td>No</td>
</tr>
<tr>
<th>plugin-load</th>
<td>Yes</td>
<td>Yes</td>
<td></td>
<td></td>
<td></td>
<td></td>
</tr>
<tr>
<th>plugin-load-add</th>
<td>Yes</td>
<td>Yes</td>
<td></td>
<td></td>
<td></td>
<td></td>
</tr>
<tr>
<th>plugin-xxx</th>
<td>Yes</td>
<td>Yes</td>
<td></td>
<td></td>
<td></td>
<td></td>
</tr>
<tr>
<th>port</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td></td>
<td>Global</td>
<td>No</td>
</tr>
<tr>
<th>port-open-timeout</th>
<td>Yes</td>
<td>Yes</td>
<td></td>
<td></td>
<td></td>
<td></td>
</tr>
<tr>
<th>preload_buffer_size</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td></td>
<td>Both</td>
<td>Yes</td>
</tr>
<tr>
<th>Prepared_stmt_count</th>
<td></td>
<td></td>
<td></td>
<td>Yes</td>
<td>Global</td>
<td>No</td>
</tr>
<tr>
<th>print-defaults</th>
<td>Yes</td>
<td></td>
<td></td>
<td></td>
<td></td>
<td></td>
</tr>
<tr>
<th>profiling</th>
<td></td>
<td></td>
<td>Yes</td>
<td></td>
<td>Both</td>
<td>Yes</td>
</tr>
<tr>
<th>profiling_history_size</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td></td>
<td>Both</td>
<td>Yes</td>
</tr>
<tr>
<th>protocol_version</th>
<td></td>
<td></td>
<td>Yes</td>
<td></td>
<td>Global</td>
<td>No</td>
</tr>
<tr>
<th>proxy_user</th>
<td></td>
<td></td>
<td>Yes</td>
<td></td>
<td>Session</td>
<td>No</td>
</tr>
<tr>
<th>pseudo_slave_mode</th>
<td></td>
<td></td>
<td>Yes</td>
<td></td>
<td>Session</td>
<td>Yes</td>
</tr>
<tr>
<th>pseudo_thread_id</th>
<td></td>
<td></td>
<td>Yes</td>
<td></td>
<td>Session</td>
<td>Yes</td>
</tr>
<tr>
<th>Qcache_free_blocks</th>
<td></td>
<td></td>
<td></td>
<td>Yes</td>
<td>Global</td>
<td>No</td>
</tr>
<tr>
<th>Qcache_free_memory</th>
<td></td>
<td></td>
<td></td>
<td>Yes</td>
<td>Global</td>
<td>No</td>
</tr>
<tr>
<th>Qcache_hits</th>
<td></td>
<td></td>
<td></td>
<td>Yes</td>
<td>Global</td>
<td>No</td>
</tr>
<tr>
<th>Qcache_inserts</th>
<td></td>
<td></td>
<td></td>
<td>Yes</td>
<td>Global</td>
<td>No</td>
</tr>
<tr>
<th>Qcache_lowmem_prunes</th>
<td></td>
<td></td>
<td></td>
<td>Yes</td>
<td>Global</td>
<td>No</td>
</tr>
<tr>
<th>Qcache_not_cached</th>
<td></td>
<td></td>
<td></td>
<td>Yes</td>
<td>Global</td>
<td>No</td>
</tr>
<tr>
<th>Qcache_queries_in_cache</th>
<td></td>
<td></td>
<td></td>
<td>Yes</td>
<td>Global</td>
<td>No</td>
</tr>
<tr>
<th>Qcache_total_blocks</th>
<td></td>
<td></td>
<td></td>
<td>Yes</td>
<td>Global</td>
<td>No</td>
</tr>
<tr>
<th>Queries</th>
<td></td>
<td></td>
<td></td>
<td>Yes</td>
<td>Both</td>
<td>No</td>
</tr>
<tr>
<th>query_alloc_block_size</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td></td>
<td>Both</td>
<td>Yes</td>
</tr>
<tr>
<th>query_cache_limit</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td></td>
<td>Global</td>
<td>Yes</td>
</tr>
<tr>
<th>query_cache_min_res_unit</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td></td>
<td>Global</td>
<td>Yes</td>
</tr>
<tr>
<th>query_cache_size</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td></td>
<td>Global</td>
<td>Yes</td>
</tr>
<tr>
<th>query_cache_type</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td></td>
<td>Both</td>
<td>Yes</td>
</tr>
<tr>
<th>query_cache_wlock_invalidate</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td></td>
<td>Both</td>
<td>Yes</td>
</tr>
<tr>
<th>query_prealloc_size</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td></td>
<td>Both</td>
<td>Yes</td>
</tr>
<tr>
<th>Questions</th>
<td></td>
<td></td>
<td></td>
<td>Yes</td>
<td>Both</td>
<td>No</td>
</tr>
<tr>
<th>rand_seed1</th>
<td></td>
<td></td>
<td>Yes</td>
<td></td>
<td>Session</td>
<td>Yes</td>
</tr>
<tr>
<th>rand_seed2</th>
<td></td>
<td></td>
<td>Yes</td>
<td></td>
<td>Session</td>
<td>Yes</td>
</tr>
<tr>
<th>range_alloc_block_size</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td></td>
<td>Both</td>
<td>Yes</td>
</tr>
<tr>
<th>range_optimizer_max_mem_size</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td></td>
<td>Both</td>
<td>Yes</td>
</tr>
<tr>
<th>rbr_exec_mode</th>
<td></td>
<td></td>
<td>Yes</td>
<td></td>
<td>Session</td>
<td>Yes</td>
</tr>
<tr>
<th>read_buffer_size</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td></td>
<td>Both</td>
<td>Yes</td>
</tr>
<tr>
<th>read_only</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td></td>
<td>Global</td>
<td>Yes</td>
</tr>
<tr>
<th>read_rnd_buffer_size</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td></td>
<td>Both</td>
<td>Yes</td>
</tr>
<tr>
<th>relay_log</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td></td>
<td>Global</td>
<td>No</td>
</tr>
<tr>
<th>relay_log_basename</th>
<td></td>
<td></td>
<td>Yes</td>
<td></td>
<td>Global</td>
<td>No</td>
</tr>
<tr>
<th>relay_log_index</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td></td>
<td>Global</td>
<td>No</td>
</tr>
<tr>
<th>relay_log_info_file</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td></td>
<td>Global</td>
<td>No</td>
</tr>
<tr>
<th>relay_log_info_repository</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td></td>
<td>Global</td>
<td>Yes</td>
</tr>
<tr>
<th>relay_log_purge</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td></td>
<td>Global</td>
<td>Yes</td>
</tr>
<tr>
<th>relay_log_recovery</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td></td>
<td>Global</td>
<td>No</td>
</tr>
<tr>
<th>relay_log_space_limit</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td></td>
<td>Global</td>
<td>No</td>
</tr>
<tr>
<th>remove</th>
<td>Yes</td>
<td></td>
<td></td>
<td></td>
<td></td>
<td></td>
</tr>
<tr>
<th>replicate-do-db</th>
<td>Yes</td>
<td>Yes</td>
<td></td>
<td></td>
<td></td>
<td></td>
</tr>
<tr>
<th>replicate-do-table</th>
<td>Yes</td>
<td>Yes</td>
<td></td>
<td></td>
<td></td>
<td></td>
</tr>
<tr>
<th>replicate-ignore-db</th>
<td>Yes</td>
<td>Yes</td>
<td></td>
<td></td>
<td></td>
<td></td>
</tr>
<tr>
<th>replicate-ignore-table</th>
<td>Yes</td>
<td>Yes</td>
<td></td>
<td></td>
<td></td>
<td></td>
</tr>
<tr>
<th>replicate-rewrite-db</th>
<td>Yes</td>
<td>Yes</td>
<td></td>
<td></td>
<td></td>
<td></td>
</tr>
<tr>
<th>replicate-same-server-id</th>
<td>Yes</td>
<td>Yes</td>
<td></td>
<td></td>
<td></td>
<td></td>
</tr>
<tr>
<th>replicate-wild-do-table</th>
<td>Yes</td>
<td>Yes</td>
<td></td>
<td></td>
<td></td>
<td></td>
</tr>
<tr>
<th>replicate-wild-ignore-table</th>
<td>Yes</td>
<td>Yes</td>
<td></td>
<td></td>
<td></td>
<td></td>
</tr>
<tr>
<th>replication_optimize_for_static_plugin_config</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td></td>
<td>Global</td>
<td>Yes</td>
</tr>
<tr>
<th>replication_sender_observe_commit_only</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td></td>
<td>Global</td>
<td>Yes</td>
</tr>
<tr>
<th>report_host</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td></td>
<td>Global</td>
<td>No</td>
</tr>
<tr>
<th>report_password</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td></td>
<td>Global</td>
<td>No</td>
</tr>
<tr>
<th>report_port</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td></td>
<td>Global</td>
<td>No</td>
</tr>
<tr>
<th>report_user</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td></td>
<td>Global</td>
<td>No</td>
</tr>
<tr>
<th>require_secure_transport</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td></td>
<td>Global</td>
<td>Yes</td>
</tr>
<tr>
<th>rewriter_enabled</th>
<td></td>
<td></td>
<td>Yes</td>
<td></td>
<td>Global</td>
<td>Yes</td>
</tr>
<tr>
<th>Rewriter_number_loaded_rules</th>
<td></td>
<td></td>
<td></td>
<td>Yes</td>
<td>Global</td>
<td>No</td>
</tr>
<tr>
<th>Rewriter_number_reloads</th>
<td></td>
<td></td>
<td></td>
<td>Yes</td>
<td>Global</td>
<td>No</td>
</tr>
<tr>
<th>Rewriter_number_rewritten_queries</th>
<td></td>
<td></td>
<td></td>
<td>Yes</td>
<td>Global</td>
<td>No</td>
</tr>
<tr>
<th>Rewriter_reload_error</th>
<td></td>
<td></td>
<td></td>
<td>Yes</td>
<td>Global</td>
<td>No</td>
</tr>
<tr>
<th>rewriter_verbose</th>
<td></td>
<td></td>
<td>Yes</td>
<td></td>
<td>Global</td>
<td>Yes</td>
</tr>
<tr>
<th>Rpl_semi_sync_master_clients</th>
<td></td>
<td></td>
<td></td>
<td>Yes</td>
<td>Global</td>
<td>No</td>
</tr>
<tr>
<th>rpl_semi_sync_master_enabled</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td></td>
<td>Global</td>
<td>Yes</td>
</tr>
<tr>
<th>Rpl_semi_sync_master_net_avg_wait_time</th>
<td></td>
<td></td>
<td></td>
<td>Yes</td>
<td>Global</td>
<td>No</td>
</tr>
<tr>
<th>Rpl_semi_sync_master_net_wait_time</th>
<td></td>
<td></td>
<td></td>
<td>Yes</td>
<td>Global</td>
<td>No</td>
</tr>
<tr>
<th>Rpl_semi_sync_master_net_waits</th>
<td></td>
<td></td>
<td></td>
<td>Yes</td>
<td>Global</td>
<td>No</td>
</tr>
<tr>
<th>Rpl_semi_sync_master_no_times</th>
<td></td>
<td></td>
<td></td>
<td>Yes</td>
<td>Global</td>
<td>No</td>
</tr>
<tr>
<th>Rpl_semi_sync_master_no_tx</th>
<td></td>
<td></td>
<td></td>
<td>Yes</td>
<td>Global</td>
<td>No</td>
</tr>
<tr>
<th>Rpl_semi_sync_master_status</th>
<td></td>
<td></td>
<td></td>
<td>Yes</td>
<td>Global</td>
<td>No</td>
</tr>
<tr>
<th>Rpl_semi_sync_master_timefunc_failures</th>
<td></td>
<td></td>
<td></td>
<td>Yes</td>
<td>Global</td>
<td>No</td>
</tr>
<tr>
<th>rpl_semi_sync_master_timeout</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td></td>
<td>Global</td>
<td>Yes</td>
</tr>
<tr>
<th>rpl_semi_sync_master_trace_level</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td></td>
<td>Global</td>
<td>Yes</td>
</tr>
<tr>
<th>Rpl_semi_sync_master_tx_avg_wait_time</th>
<td></td>
<td></td>
<td></td>
<td>Yes</td>
<td>Global</td>
<td>No</td>
</tr>
<tr>
<th>Rpl_semi_sync_master_tx_wait_time</th>
<td></td>
<td></td>
<td></td>
<td>Yes</td>
<td>Global</td>
<td>No</td>
</tr>
<tr>
<th>Rpl_semi_sync_master_tx_waits</th>
<td></td>
<td></td>
<td></td>
<td>Yes</td>
<td>Global</td>
<td>No</td>
</tr>
<tr>
<th>rpl_semi_sync_master_wait_for_slave_count</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td></td>
<td>Global</td>
<td>Yes</td>
</tr>
<tr>
<th>rpl_semi_sync_master_wait_no_slave</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td></td>
<td>Global</td>
<td>Yes</td>
</tr>
<tr>
<th>rpl_semi_sync_master_wait_point</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td></td>
<td>Global</td>
<td>Yes</td>
</tr>
<tr>
<th>Rpl_semi_sync_master_wait_pos_backtraverse</th>
<td></td>
<td></td>
<td></td>
<td>Yes</td>
<td>Global</td>
<td>No</td>
</tr>
<tr>
<th>Rpl_semi_sync_master_wait_sessions</th>
<td></td>
<td></td>
<td></td>
<td>Yes</td>
<td>Global</td>
<td>No</td>
</tr>
<tr>
<th>Rpl_semi_sync_master_yes_tx</th>
<td></td>
<td></td>
<td></td>
<td>Yes</td>
<td>Global</td>
<td>No</td>
</tr>
<tr>
<th>rpl_semi_sync_slave_enabled</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td></td>
<td>Global</td>
<td>Yes</td>
</tr>
<tr>
<th>Rpl_semi_sync_slave_status</th>
<td></td>
<td></td>
<td></td>
<td>Yes</td>
<td>Global</td>
<td>No</td>
</tr>
<tr>
<th>rpl_semi_sync_slave_trace_level</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td></td>
<td>Global</td>
<td>Yes</td>
</tr>
<tr>
<th>rpl_stop_slave_timeout</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td></td>
<td>Global</td>
<td>Yes</td>
</tr>
<tr>
<th>Rsa_public_key</th>
<td></td>
<td></td>
<td></td>
<td>Yes</td>
<td>Global</td>
<td>No</td>
</tr>
<tr>
<th>safe-user-create</th>
<td>Yes</td>
<td>Yes</td>
<td></td>
<td></td>
<td></td>
<td></td>
</tr>
<tr>
<th>secure_auth</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td></td>
<td>Global</td>
<td>Yes</td>
</tr>
<tr>
<th>secure_file_priv</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td></td>
<td>Global</td>
<td>No</td>
</tr>
<tr>
<th>Select_full_join</th>
<td></td>
<td></td>
<td></td>
<td>Yes</td>
<td>Both</td>
<td>No</td>
</tr>
<tr>
<th>Select_full_range_join</th>
<td></td>
<td></td>
<td></td>
<td>Yes</td>
<td>Both</td>
<td>No</td>
</tr>
<tr>
<th>Select_range</th>
<td></td>
<td></td>
<td></td>
<td>Yes</td>
<td>Both</td>
<td>No</td>
</tr>
<tr>
<th>Select_range_check</th>
<td></td>
<td></td>
<td></td>
<td>Yes</td>
<td>Both</td>
<td>No</td>
</tr>
<tr>
<th>Select_scan</th>
<td></td>
<td></td>
<td></td>
<td>Yes</td>
<td>Both</td>
<td>No</td>
</tr>
<tr>
<th>server_id</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td></td>
<td>Global</td>
<td>Yes</td>
</tr>
<tr>
<th>server_id_bits</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td></td>
<td>Global</td>
<td>No</td>
</tr>
<tr>
<th>server_uuid</th>
<td></td>
<td></td>
<td>Yes</td>
<td></td>
<td>Global</td>
<td>No</td>
</tr>
<tr>
<th>session_track_gtids</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td></td>
<td>Both</td>
<td>Yes</td>
</tr>
<tr>
<th>session_track_schema</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td></td>
<td>Both</td>
<td>Yes</td>
</tr>
<tr>
<th>session_track_state_change</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td></td>
<td>Both</td>
<td>Yes</td>
</tr>
<tr>
<th>session_track_system_variables</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td></td>
<td>Both</td>
<td>Yes</td>
</tr>
<tr>
<th>session_track_transaction_info</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td></td>
<td>Both</td>
<td>Yes</td>
</tr>
<tr>
<th>sha256_password_auto_generate_rsa_keys</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td></td>
<td>Global</td>
<td>No</td>
</tr>
<tr>
<th>sha256_password_private_key_path</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td></td>
<td>Global</td>
<td>No</td>
</tr>
<tr>
<th>sha256_password_proxy_users</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td></td>
<td>Global</td>
<td>Yes</td>
</tr>
<tr>
<th>sha256_password_public_key_path</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td></td>
<td>Global</td>
<td>No</td>
</tr>
<tr>
<th>shared_memory</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td></td>
<td>Global</td>
<td>No</td>
</tr>
<tr>
<th>shared_memory_base_name</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td></td>
<td>Global</td>
<td>No</td>
</tr>
<tr>
<th>show_compatibility_56</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td></td>
<td>Global</td>
<td>Yes</td>
</tr>
<tr>
<th>show_create_table_verbosity</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td></td>
<td>Both</td>
<td>Yes</td>
</tr>
<tr>
<th>show_old_temporals</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td></td>
<td>Both</td>
<td>Yes</td>
</tr>
<tr>
<th>show-slave-auth-info</th>
<td>Yes</td>
<td>Yes</td>
<td></td>
<td></td>
<td></td>
<td></td>
</tr>
<tr>
<th>skip-character-set-client-handshake</th>
<td>Yes</td>
<td>Yes</td>
<td></td>
<td></td>
<td></td>
<td></td>
</tr>
<tr>
<th>skip_external_locking</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td></td>
<td>Global</td>
<td>No</td>
</tr>
<tr>
<th>skip-grant-tables</th>
<td>Yes</td>
<td>Yes</td>
<td></td>
<td></td>
<td></td>
<td></td>
</tr>
<tr>
<th>skip-host-cache</th>
<td>Yes</td>
<td>Yes</td>
<td></td>
<td></td>
<td></td>
<td></td>
</tr>
<tr>
<th>skip_name_resolve</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td></td>
<td>Global</td>
<td>No</td>
</tr>
<tr>
<th>skip-ndbcluster</th>
<td>Yes</td>
<td>Yes</td>
<td></td>
<td></td>
<td></td>
<td></td>
</tr>
<tr>
<th>skip_networking</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td></td>
<td>Global</td>
<td>No</td>
</tr>
<tr>
<th>skip-new</th>
<td>Yes</td>
<td>Yes</td>
<td></td>
<td></td>
<td></td>
<td></td>
</tr>
<tr>
<th>skip-partition</th>
<td>Yes</td>
<td>Yes</td>
<td></td>
<td></td>
<td></td>
<td></td>
</tr>
<tr>
<th>skip_show_database</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td></td>
<td>Global</td>
<td>No</td>
</tr>
<tr>
<th>skip_slave_start</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td></td>
<td>Global</td>
<td>No</td>
</tr>
<tr>
<th>skip-ssl</th>
<td>Yes</td>
<td>Yes</td>
<td></td>
<td></td>
<td></td>
<td></td>
</tr>
<tr>
<th>skip-stack-trace</th>
<td>Yes</td>
<td>Yes</td>
<td></td>
<td></td>
<td></td>
<td></td>
</tr>
<tr>
<th>slave_allow_batching</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td></td>
<td>Global</td>
<td>Yes</td>
</tr>
<tr>
<th>slave_checkpoint_group</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td></td>
<td>Global</td>
<td>Yes</td>
</tr>
<tr>
<th>slave_checkpoint_period</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td></td>
<td>Global</td>
<td>Yes</td>
</tr>
<tr>
<th>slave_compressed_protocol</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td></td>
<td>Global</td>
<td>Yes</td>
</tr>
<tr>
<th>slave_exec_mode</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td></td>
<td>Global</td>
<td>Yes</td>
</tr>
<tr>
<th>Slave_heartbeat_period</th>
<td></td>
<td></td>
<td></td>
<td>Yes</td>
<td>Global</td>
<td>No</td>
</tr>
<tr>
<th>Slave_last_heartbeat</th>
<td></td>
<td></td>
<td></td>
<td>Yes</td>
<td>Global</td>
<td>No</td>
</tr>
<tr>
<th>slave_load_tmpdir</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td></td>
<td>Global</td>
<td>No</td>
</tr>
<tr>
<th>slave_max_allowed_packet</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td></td>
<td>Global</td>
<td>Yes</td>
</tr>
<tr>
<th>slave_net_timeout</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td></td>
<td>Global</td>
<td>Yes</td>
</tr>
<tr>
<th>Slave_open_temp_tables</th>
<td></td>
<td></td>
<td></td>
<td>Yes</td>
<td>Global</td>
<td>No</td>
</tr>
<tr>
<th>slave_parallel_type</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td></td>
<td>Global</td>
<td>Yes</td>
</tr>
<tr>
<th>slave_parallel_workers</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td></td>
<td>Global</td>
<td>Yes</td>
</tr>
<tr>
<th>slave_pending_jobs_size_max</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td></td>
<td>Global</td>
<td>Yes</td>
</tr>
<tr>
<th>slave_preserve_commit_order</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td></td>
<td>Global</td>
<td>Yes</td>
</tr>
<tr>
<th>Slave_received_heartbeats</th>
<td></td>
<td></td>
<td></td>
<td>Yes</td>
<td>Global</td>
<td>No</td>
</tr>
<tr>
<th>Slave_retried_transactions</th>
<td></td>
<td></td>
<td></td>
<td>Yes</td>
<td>Global</td>
<td>No</td>
</tr>
<tr>
<th>Slave_rows_last_search_algorithm_used</th>
<td></td>
<td></td>
<td></td>
<td>Yes</td>
<td>Global</td>
<td>No</td>
</tr>
<tr>
<th>slave_rows_search_algorithms</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td></td>
<td>Global</td>
<td>Yes</td>
</tr>
<tr>
<th>Slave_running</th>
<td></td>
<td></td>
<td></td>
<td>Yes</td>
<td>Global</td>
<td>No</td>
</tr>
<tr>
<th>slave_skip_errors</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td></td>
<td>Global</td>
<td>No</td>
</tr>
<tr>
<th>slave-sql-verify-checksum</th>
<td>Yes</td>
<td>Yes</td>
<td></td>
<td></td>
<td></td>
<td></td>
</tr>
<tr>
<th>slave_sql_verify_checksum</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td></td>
<td>Global</td>
<td>Yes</td>
</tr>
<tr>
<th>slave_transaction_retries</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td></td>
<td>Global</td>
<td>Yes</td>
</tr>
<tr>
<th>slave_type_conversions</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td></td>
<td>Global</td>
<td>Yes</td>
</tr>
<tr>
<th>Slow_launch_threads</th>
<td></td>
<td></td>
<td></td>
<td>Yes</td>
<td>Both</td>
<td>No</td>
</tr>
<tr>
<th>slow_launch_time</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td></td>
<td>Global</td>
<td>Yes</td>
</tr>
<tr>
<th>Slow_queries</th>
<td></td>
<td></td>
<td></td>
<td>Yes</td>
<td>Both</td>
<td>No</td>
</tr>
<tr>
<th>slow_query_log</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td></td>
<td>Global</td>
<td>Yes</td>
</tr>
<tr>
<th>slow_query_log_file</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td></td>
<td>Global</td>
<td>Yes</td>
</tr>
<tr>
<th>slow-start-timeout</th>
<td>Yes</td>
<td>Yes</td>
<td></td>
<td></td>
<td></td>
<td></td>
</tr>
<tr>
<th>socket</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td></td>
<td>Global</td>
<td>No</td>
</tr>
<tr>
<th>sort_buffer_size</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td></td>
<td>Both</td>
<td>Yes</td>
</tr>
<tr>
<th>Sort_merge_passes</th>
<td></td>
<td></td>
<td></td>
<td>Yes</td>
<td>Both</td>
<td>No</td>
</tr>
<tr>
<th>Sort_range</th>
<td></td>
<td></td>
<td></td>
<td>Yes</td>
<td>Both</td>
<td>No</td>
</tr>
<tr>
<th>Sort_rows</th>
<td></td>
<td></td>
<td></td>
<td>Yes</td>
<td>Both</td>
<td>No</td>
</tr>
<tr>
<th>Sort_scan</th>
<td></td>
<td></td>
<td></td>
<td>Yes</td>
<td>Both</td>
<td>No</td>
</tr>
<tr>
<th>sporadic-binlog-dump-fail</th>
<td>Yes</td>
<td>Yes</td>
<td></td>
<td></td>
<td></td>
<td></td>
</tr>
<tr>
<th>sql_auto_is_null</th>
<td></td>
<td></td>
<td>Yes</td>
<td></td>
<td>Both</td>
<td>Yes</td>
</tr>
<tr>
<th>sql_big_selects</th>
<td></td>
<td></td>
<td>Yes</td>
<td></td>
<td>Both</td>
<td>Yes</td>
</tr>
<tr>
<th>sql_buffer_result</th>
<td></td>
<td></td>
<td>Yes</td>
<td></td>
<td>Both</td>
<td>Yes</td>
</tr>
<tr>
<th>sql_log_bin</th>
<td></td>
<td></td>
<td>Yes</td>
<td></td>
<td>Session</td>
<td>Yes</td>
</tr>
<tr>
<th>sql_log_off</th>
<td></td>
<td></td>
<td>Yes</td>
<td></td>
<td>Both</td>
<td>Yes</td>
</tr>
<tr>
<th>sql_mode</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td></td>
<td>Both</td>
<td>Yes</td>
</tr>
<tr>
<th>sql_notes</th>
<td></td>
<td></td>
<td>Yes</td>
<td></td>
<td>Both</td>
<td>Yes</td>
</tr>
<tr>
<th>sql_quote_show_create</th>
<td></td>
<td></td>
<td>Yes</td>
<td></td>
<td>Both</td>
<td>Yes</td>
</tr>
<tr>
<th>sql_safe_updates</th>
<td></td>
<td></td>
<td>Yes</td>
<td></td>
<td>Both</td>
<td>Yes</td>
</tr>
<tr>
<th>sql_select_limit</th>
<td></td>
<td></td>
<td>Yes</td>
<td></td>
<td>Both</td>
<td>Yes</td>
</tr>
<tr>
<th>sql_slave_skip_counter</th>
<td></td>
<td></td>
<td>Yes</td>
<td></td>
<td>Global</td>
<td>Yes</td>
</tr>
<tr>
<th>sql_warnings</th>
<td></td>
<td></td>
<td>Yes</td>
<td></td>
<td>Both</td>
<td>Yes</td>
</tr>
<tr>
<th>ssl</th>
<td>Yes</td>
<td>Yes</td>
<td></td>
<td></td>
<td></td>
<td></td>
</tr>
<tr>
<th>Ssl_accept_renegotiates</th>
<td></td>
<td></td>
<td></td>
<td>Yes</td>
<td>Global</td>
<td>No</td>
</tr>
<tr>
<th>Ssl_accepts</th>
<td></td>
<td></td>
<td></td>
<td>Yes</td>
<td>Global</td>
<td>No</td>
</tr>
<tr>
<th>ssl_ca</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td></td>
<td>Global</td>
<td>No</td>
</tr>
<tr>
<th>Ssl_callback_cache_hits</th>
<td></td>
<td></td>
<td></td>
<td>Yes</td>
<td>Global</td>
<td>No</td>
</tr>
<tr>
<th>ssl_capath</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td></td>
<td>Global</td>
<td>No</td>
</tr>
<tr>
<th>ssl_cert</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td></td>
<td>Global</td>
<td>No</td>
</tr>
<tr>
<th>Ssl_cipher</th>
<td></td>
<td></td>
<td></td>
<td>Yes</td>
<td>Both</td>
<td>No</td>
</tr>
<tr>
<th>ssl_cipher</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td></td>
<td>Global</td>
<td>No</td>
</tr>
<tr>
<th>Ssl_cipher_list</th>
<td></td>
<td></td>
<td></td>
<td>Yes</td>
<td>Both</td>
<td>No</td>
</tr>
<tr>
<th>Ssl_client_connects</th>
<td></td>
<td></td>
<td></td>
<td>Yes</td>
<td>Global</td>
<td>No</td>
</tr>
<tr>
<th>Ssl_connect_renegotiates</th>
<td></td>
<td></td>
<td></td>
<td>Yes</td>
<td>Global</td>
<td>No</td>
</tr>
<tr>
<th>ssl_crl</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td></td>
<td>Global</td>
<td>No</td>
</tr>
<tr>
<th>ssl_crlpath</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td></td>
<td>Global</td>
<td>No</td>
</tr>
<tr>
<th>Ssl_ctx_verify_depth</th>
<td></td>
<td></td>
<td></td>
<td>Yes</td>
<td>Global</td>
<td>No</td>
</tr>
<tr>
<th>Ssl_ctx_verify_mode</th>
<td></td>
<td></td>
<td></td>
<td>Yes</td>
<td>Global</td>
<td>No</td>
</tr>
<tr>
<th>Ssl_default_timeout</th>
<td></td>
<td></td>
<td></td>
<td>Yes</td>
<td>Both</td>
<td>No</td>
</tr>
<tr>
<th>Ssl_finished_accepts</th>
<td></td>
<td></td>
<td></td>
<td>Yes</td>
<td>Global</td>
<td>No</td>
</tr>
<tr>
<th>Ssl_finished_connects</th>
<td></td>
<td></td>
<td></td>
<td>Yes</td>
<td>Global</td>
<td>No</td>
</tr>
<tr>
<th>ssl_key</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td></td>
<td>Global</td>
<td>No</td>
</tr>
<tr>
<th>Ssl_server_not_after</th>
<td></td>
<td></td>
<td></td>
<td>Yes</td>
<td>Both</td>
<td>No</td>
</tr>
<tr>
<th>Ssl_server_not_before</th>
<td></td>
<td></td>
<td></td>
<td>Yes</td>
<td>Both</td>
<td>No</td>
</tr>
<tr>
<th>Ssl_session_cache_hits</th>
<td></td>
<td></td>
<td></td>
<td>Yes</td>
<td>Global</td>
<td>No</td>
</tr>
<tr>
<th>Ssl_session_cache_misses</th>
<td></td>
<td></td>
<td></td>
<td>Yes</td>
<td>Global</td>
<td>No</td>
</tr>
<tr>
<th>Ssl_session_cache_mode</th>
<td></td>
<td></td>
<td></td>
<td>Yes</td>
<td>Global</td>
<td>No</td>
</tr>
<tr>
<th>Ssl_session_cache_overflows</th>
<td></td>
<td></td>
<td></td>
<td>Yes</td>
<td>Global</td>
<td>No</td>
</tr>
<tr>
<th>Ssl_session_cache_size</th>
<td></td>
<td></td>
<td></td>
<td>Yes</td>
<td>Global</td>
<td>No</td>
</tr>
<tr>
<th>Ssl_session_cache_timeouts</th>
<td></td>
<td></td>
<td></td>
<td>Yes</td>
<td>Global</td>
<td>No</td>
</tr>
<tr>
<th>Ssl_sessions_reused</th>
<td></td>
<td></td>
<td></td>
<td>Yes</td>
<td>Session</td>
<td>No</td>
</tr>
<tr>
<th>Ssl_used_session_cache_entries</th>
<td></td>
<td></td>
<td></td>
<td>Yes</td>
<td>Global</td>
<td>No</td>
</tr>
<tr>
<th>Ssl_verify_depth</th>
<td></td>
<td></td>
<td></td>
<td>Yes</td>
<td>Both</td>
<td>No</td>
</tr>
<tr>
<th>Ssl_verify_mode</th>
<td></td>
<td></td>
<td></td>
<td>Yes</td>
<td>Both</td>
<td>No</td>
</tr>
<tr>
<th>Ssl_version</th>
<td></td>
<td></td>
<td></td>
<td>Yes</td>
<td>Both</td>
<td>No</td>
</tr>
<tr>
<th>standalone</th>
<td>Yes</td>
<td>Yes</td>
<td></td>
<td></td>
<td></td>
<td></td>
</tr>
<tr>
<th>stored_program_cache</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td></td>
<td>Global</td>
<td>Yes</td>
</tr>
<tr>
<th>super-large-pages</th>
<td>Yes</td>
<td>Yes</td>
<td></td>
<td></td>
<td></td>
<td></td>
</tr>
<tr>
<th>super_read_only</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td></td>
<td>Global</td>
<td>Yes</td>
</tr>
<tr>
<th>symbolic-links</th>
<td>Yes</td>
<td>Yes</td>
<td></td>
<td></td>
<td></td>
<td></td>
</tr>
<tr>
<th>sync_binlog</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td></td>
<td>Global</td>
<td>Yes</td>
</tr>
<tr>
<th>sync_frm</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td></td>
<td>Global</td>
<td>Yes</td>
</tr>
<tr>
<th>sync_master_info</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td></td>
<td>Global</td>
<td>Yes</td>
</tr>
<tr>
<th>sync_relay_log</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td></td>
<td>Global</td>
<td>Yes</td>
</tr>
<tr>
<th>sync_relay_log_info</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td></td>
<td>Global</td>
<td>Yes</td>
</tr>
<tr>
<th>sysdate-is-now</th>
<td>Yes</td>
<td>Yes</td>
<td></td>
<td></td>
<td></td>
<td></td>
</tr>
<tr>
<th>system_time_zone</th>
<td></td>
<td></td>
<td>Yes</td>
<td></td>
<td>Global</td>
<td>No</td>
</tr>
<tr>
<th>table_definition_cache</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td></td>
<td>Global</td>
<td>Yes</td>
</tr>
<tr>
<th>Table_locks_immediate</th>
<td></td>
<td></td>
<td></td>
<td>Yes</td>
<td>Global</td>
<td>No</td>
</tr>
<tr>
<th>Table_locks_waited</th>
<td></td>
<td></td>
<td></td>
<td>Yes</td>
<td>Global</td>
<td>No</td>
</tr>
<tr>
<th>table_open_cache</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td></td>
<td>Global</td>
<td>Yes</td>
</tr>
<tr>
<th>Table_open_cache_hits</th>
<td></td>
<td></td>
<td></td>
<td>Yes</td>
<td>Both</td>
<td>No</td>
</tr>
<tr>
<th>table_open_cache_instances</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td></td>
<td>Global</td>
<td>No</td>
</tr>
<tr>
<th>Table_open_cache_misses</th>
<td></td>
<td></td>
<td></td>
<td>Yes</td>
<td>Both</td>
<td>No</td>
</tr>
<tr>
<th>Table_open_cache_overflows</th>
<td></td>
<td></td>
<td></td>
<td>Yes</td>
<td>Both</td>
<td>No</td>
</tr>
<tr>
<th>tc-heuristic-recover</th>
<td>Yes</td>
<td>Yes</td>
<td></td>
<td></td>
<td></td>
<td></td>
</tr>
<tr>
<th>Tc_log_max_pages_used</th>
<td></td>
<td></td>
<td></td>
<td>Yes</td>
<td>Global</td>
<td>No</td>
</tr>
<tr>
<th>Tc_log_page_size</th>
<td></td>
<td></td>
<td></td>
<td>Yes</td>
<td>Global</td>
<td>No</td>
</tr>
<tr>
<th>Tc_log_page_waits</th>
<td></td>
<td></td>
<td></td>
<td>Yes</td>
<td>Global</td>
<td>No</td>
</tr>
<tr>
<th>temp-pool</th>
<td>Yes</td>
<td>Yes</td>
<td></td>
<td></td>
<td></td>
<td></td>
</tr>
<tr>
<th>thread_cache_size</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td></td>
<td>Global</td>
<td>Yes</td>
</tr>
<tr>
<th>thread_handling</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td></td>
<td>Global</td>
<td>No</td>
</tr>
<tr>
<th>thread_pool_algorithm</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td></td>
<td>Global</td>
<td>No</td>
</tr>
<tr>
<th>thread_pool_high_priority_connection</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td></td>
<td>Both</td>
<td>Yes</td>
</tr>
<tr>
<th>thread_pool_max_unused_threads</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td></td>
<td>Global</td>
<td>Yes</td>
</tr>
<tr>
<th>thread_pool_prio_kickup_timer</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td></td>
<td>Global</td>
<td>Yes</td>
</tr>
<tr>
<th>thread_pool_size</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td></td>
<td>Global</td>
<td>No</td>
</tr>
<tr>
<th>thread_pool_stall_limit</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td></td>
<td>Global</td>
<td>Yes</td>
</tr>
<tr>
<th>thread_stack</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td></td>
<td>Global</td>
<td>No</td>
</tr>
<tr>
<th>Threads_cached</th>
<td></td>
<td></td>
<td></td>
<td>Yes</td>
<td>Global</td>
<td>No</td>
</tr>
<tr>
<th>Threads_connected</th>
<td></td>
<td></td>
<td></td>
<td>Yes</td>
<td>Global</td>
<td>No</td>
</tr>
<tr>
<th>Threads_created</th>
<td></td>
<td></td>
<td></td>
<td>Yes</td>
<td>Global</td>
<td>No</td>
</tr>
<tr>
<th>Threads_running</th>
<td></td>
<td></td>
<td></td>
<td>Yes</td>
<td>Global</td>
<td>No</td>
</tr>
<tr>
<th>time_format</th>
<td></td>
<td></td>
<td>Yes</td>
<td></td>
<td>Global</td>
<td>No</td>
</tr>
<tr>
<th>time_zone</th>
<td></td>
<td></td>
<td>Yes</td>
<td></td>
<td>Both</td>
<td>Yes</td>
</tr>
<tr>
<th>timestamp</th>
<td></td>
<td></td>
<td>Yes</td>
<td></td>
<td>Session</td>
<td>Yes</td>
</tr>
<tr>
<th>tls_version</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td></td>
<td>Global</td>
<td>No</td>
</tr>
<tr>
<th>tmp_table_size</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td></td>
<td>Both</td>
<td>Yes</td>
</tr>
<tr>
<th>tmpdir</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td></td>
<td>Global</td>
<td>No</td>
</tr>
<tr>
<th>transaction_alloc_block_size</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td></td>
<td>Both</td>
<td>Yes</td>
</tr>
<tr>
<th>transaction_allow_batching</th>
<td></td>
<td></td>
<td>Yes</td>
<td></td>
<td>Session</td>
<td>Yes</td>
</tr>
<tr>
<th>transaction_isolation</th>
<td>Yes</td>
<td>Yes</td>
<td></td>
<td></td>
<td>Both</td>
<td>Yes</td>
</tr>
<tr>
<th> - <em>Variable</em>: tx_isolation</th>
<td></td>
<td></td>
<td>Yes</td>
<td></td>
<td>Both</td>
<td>Yes</td>
</tr>
<tr>
<th>transaction_prealloc_size</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td></td>
<td>Both</td>
<td>Yes</td>
</tr>
<tr>
<th>transaction_read_only</th>
<td>Yes</td>
<td>Yes</td>
<td></td>
<td></td>
<td>Both</td>
<td>Yes</td>
</tr>
<tr>
<th> - <em>Variable</em>: tx_read_only</th>
<td></td>
<td></td>
<td>Yes</td>
<td></td>
<td>Both</td>
<td>Yes</td>
</tr>
<tr>
<th>transaction_write_set_extraction</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td></td>
<td>Both</td>
<td>Yes</td>
</tr>
<tr>
<th>tx_isolation</th>
<td></td>
<td></td>
<td>Yes</td>
<td></td>
<td>Both</td>
<td>Yes</td>
</tr>
<tr>
<th>tx_read_only</th>
<td></td>
<td></td>
<td>Yes</td>
<td></td>
<td>Both</td>
<td>Yes</td>
</tr>
<tr>
<th>unique_checks</th>
<td></td>
<td></td>
<td>Yes</td>
<td></td>
<td>Both</td>
<td>Yes</td>
</tr>
<tr>
<th>updatable_views_with_limit</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td></td>
<td>Both</td>
<td>Yes</td>
</tr>
<tr>
<th>Uptime</th>
<td></td>
<td></td>
<td></td>
<td>Yes</td>
<td>Global</td>
<td>No</td>
</tr>
<tr>
<th>Uptime_since_flush_status</th>
<td></td>
<td></td>
<td></td>
<td>Yes</td>
<td>Global</td>
<td>No</td>
</tr>
<tr>
<th>user</th>
<td>Yes</td>
<td>Yes</td>
<td></td>
<td></td>
<td></td>
<td></td>
</tr>
<tr>
<th>validate-password</th>
<td>Yes</td>
<td>Yes</td>
<td></td>
<td></td>
<td></td>
<td></td>
</tr>
<tr>
<th>validate_password_check_user_name</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td></td>
<td>Global</td>
<td>Yes</td>
</tr>
<tr>
<th>validate_password_dictionary_file</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td></td>
<td>Global</td>
<td>Varies</td>
</tr>
<tr>
<th>validate_password_dictionary_file_last_parsed</th>
<td></td>
<td></td>
<td></td>
<td>Yes</td>
<td>Global</td>
<td>No</td>
</tr>
<tr>
<th>validate_password_dictionary_file_words_count</th>
<td></td>
<td></td>
<td></td>
<td>Yes</td>
<td>Global</td>
<td>No</td>
</tr>
<tr>
<th>validate_password_length</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td></td>
<td>Global</td>
<td>Yes</td>
</tr>
<tr>
<th>validate_password_mixed_case_count</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td></td>
<td>Global</td>
<td>Yes</td>
</tr>
<tr>
<th>validate_password_number_count</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td></td>
<td>Global</td>
<td>Yes</td>
</tr>
<tr>
<th>validate_password_policy</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td></td>
<td>Global</td>
<td>Yes</td>
</tr>
<tr>
<th>validate_password_special_char_count</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td></td>
<td>Global</td>
<td>Yes</td>
</tr>
<tr>
<th>validate-user-plugins</th>
<td>Yes</td>
<td>Yes</td>
<td></td>
<td></td>
<td></td>
<td></td>
</tr>
<tr>
<th>verbose</th>
<td>Yes</td>
<td>Yes</td>
<td></td>
<td></td>
<td></td>
<td></td>
</tr>
<tr>
<th>version</th>
<td></td>
<td></td>
<td>Yes</td>
<td></td>
<td>Global</td>
<td>No</td>
</tr>
<tr>
<th>version_comment</th>
<td></td>
<td></td>
<td>Yes</td>
<td></td>
<td>Global</td>
<td>No</td>
</tr>
<tr>
<th>version_compile_machine</th>
<td></td>
<td></td>
<td>Yes</td>
<td></td>
<td>Global</td>
<td>No</td>
</tr>
<tr>
<th>version_compile_os</th>
<td></td>
<td></td>
<td>Yes</td>
<td></td>
<td>Global</td>
<td>No</td>
</tr>
<tr>
<th>version_tokens_session</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td></td>
<td>Both</td>
<td>Yes</td>
</tr>
<tr>
<th>version_tokens_session_number</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td></td>
<td>Both</td>
<td>No</td>
</tr>
<tr>
<th>wait_timeout</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td></td>
<td>Both</td>
<td>Yes</td>
</tr>
<tr>
<th>warning_count</th>
<td></td>
<td></td>
<td>Yes</td>
<td></td>
<td>Session</td>
<td>No</td>
</tr>
</tbody>
</table>

**Notas:**

1. Esta opção é dinâmica, mas deve ser definida apenas pelo servidor. Você não deve definir essa variável manualmente.

### 5.1.4 Referência de variável do sistema do servidor

A tabela a seguir lista todas as variáveis do sistema aplicáveis dentro de `mysqld`.

A tabela lista as opções de string de comando (Cmd-line), as opções válidas em arquivos de configuração (Arquivo de opção), as variáveis do sistema do servidor (Var do sistema) e as variáveis de status (Var de status) em uma lista unificada, com indicação de onde cada opção ou variável é válida. Se uma opção do servidor definida na string de comando ou em um arquivo de opção difere do nome da variável correspondente do sistema, o nome da variável é indicado imediatamente abaixo da opção correspondente. O escopo da variável (Var Scope) é Global, Sessão ou ambos. Consulte as descrições dos itens correspondentes para obter detalhes sobre a configuração e uso das variáveis. Quando apropriado, são fornecidos links diretos para informações adicionais sobre os itens.

**Tabela 5.2 Resumo das variáveis do sistema**

<table>
<thead>
<tr>
<th>Variable Name</th>
<th>Cmd-Line</th>
<th>Option File</th>
<th>System Var</th>
<th>Var Scope</th>
<th>Dynamic</th>
</tr>
</thead>
<tbody>
<tr>
<th>audit_log_buffer_size</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td>Global</td>
<td>No</td>
</tr>
<tr>
<th>audit_log_compression</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td>Global</td>
<td>No</td>
</tr>
<tr>
<th>audit_log_connection_policy</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td>Global</td>
<td>Yes</td>
</tr>
<tr>
<th>audit_log_current_session</th>
<td></td>
<td></td>
<td>Yes</td>
<td>Both</td>
<td>No</td>
</tr>
<tr>
<th>audit_log_disable</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td>Global</td>
<td>Yes</td>
</tr>
<tr>
<th>audit_log_encryption</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td>Global</td>
<td>No</td>
</tr>
<tr>
<th>audit_log_exclude_accounts</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td>Global</td>
<td>Yes</td>
</tr>
<tr>
<th>audit_log_file</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td>Global</td>
<td>No</td>
</tr>
<tr>
<th>audit_log_filter_id</th>
<td></td>
<td></td>
<td>Yes</td>
<td>Both</td>
<td>No</td>
</tr>
<tr>
<th>audit_log_flush</th>
<td></td>
<td></td>
<td>Yes</td>
<td>Global</td>
<td>Yes</td>
</tr>
<tr>
<th>audit_log_format</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td>Global</td>
<td>No</td>
</tr>
<tr>
<th>audit_log_format_unix_timestamp</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td>Global</td>
<td>Yes</td>
</tr>
<tr>
<th>audit_log_include_accounts</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td>Global</td>
<td>Yes</td>
</tr>
<tr>
<th>audit_log_policy</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td>Global</td>
<td>No</td>
</tr>
<tr>
<th>audit_log_read_buffer_size</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td>Varies</td>
<td>Varies</td>
</tr>
<tr>
<th>audit_log_rotate_on_size</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td>Global</td>
<td>Yes</td>
</tr>
<tr>
<th>audit_log_statement_policy</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td>Global</td>
<td>Yes</td>
</tr>
<tr>
<th>audit_log_strategy</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td>Global</td>
<td>No</td>
</tr>
<tr>
<th>authentication_ldap_sasl_auth_method_name</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td>Global</td>
<td>Yes</td>
</tr>
<tr>
<th>authentication_ldap_sasl_bind_base_dn</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td>Global</td>
<td>Yes</td>
</tr>
<tr>
<th>authentication_ldap_sasl_bind_root_dn</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td>Global</td>
<td>Yes</td>
</tr>
<tr>
<th>authentication_ldap_sasl_bind_root_pwd</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td>Global</td>
<td>Yes</td>
</tr>
<tr>
<th>authentication_ldap_sasl_ca_path</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td>Global</td>
<td>Yes</td>
</tr>
<tr>
<th>authentication_ldap_sasl_group_search_attr</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td>Global</td>
<td>Yes</td>
</tr>
<tr>
<th>authentication_ldap_sasl_group_search_filter</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td>Global</td>
<td>Yes</td>
</tr>
<tr>
<th>authentication_ldap_sasl_init_pool_size</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td>Global</td>
<td>Yes</td>
</tr>
<tr>
<th>authentication_ldap_sasl_log_status</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td>Global</td>
<td>Yes</td>
</tr>
<tr>
<th>authentication_ldap_sasl_max_pool_size</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td>Global</td>
<td>Yes</td>
</tr>
<tr>
<th>authentication_ldap_sasl_server_host</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td>Global</td>
<td>Yes</td>
</tr>
<tr>
<th>authentication_ldap_sasl_server_port</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td>Global</td>
<td>Yes</td>
</tr>
<tr>
<th>authentication_ldap_sasl_tls</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td>Global</td>
<td>Yes</td>
</tr>
<tr>
<th>authentication_ldap_sasl_user_search_attr</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td>Global</td>
<td>Yes</td>
</tr>
<tr>
<th>authentication_ldap_simple_auth_method_name</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td>Global</td>
<td>Yes</td>
</tr>
<tr>
<th>authentication_ldap_simple_bind_base_dn</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td>Global</td>
<td>Yes</td>
</tr>
<tr>
<th>authentication_ldap_simple_bind_root_dn</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td>Global</td>
<td>Yes</td>
</tr>
<tr>
<th>authentication_ldap_simple_bind_root_pwd</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td>Global</td>
<td>Yes</td>
</tr>
<tr>
<th>authentication_ldap_simple_ca_path</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td>Global</td>
<td>Yes</td>
</tr>
<tr>
<th>authentication_ldap_simple_group_search_attr</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td>Global</td>
<td>Yes</td>
</tr>
<tr>
<th>authentication_ldap_simple_group_search_filter</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td>Global</td>
<td>Yes</td>
</tr>
<tr>
<th>authentication_ldap_simple_init_pool_size</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td>Global</td>
<td>Yes</td>
</tr>
<tr>
<th>authentication_ldap_simple_log_status</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td>Global</td>
<td>Yes</td>
</tr>
<tr>
<th>authentication_ldap_simple_max_pool_size</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td>Global</td>
<td>Yes</td>
</tr>
<tr>
<th>authentication_ldap_simple_server_host</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td>Global</td>
<td>Yes</td>
</tr>
<tr>
<th>authentication_ldap_simple_server_port</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td>Global</td>
<td>Yes</td>
</tr>
<tr>
<th>authentication_ldap_simple_tls</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td>Global</td>
<td>Yes</td>
</tr>
<tr>
<th>authentication_ldap_simple_user_search_attr</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td>Global</td>
<td>Yes</td>
</tr>
<tr>
<th>authentication_windows_log_level</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td>Global</td>
<td>No</td>
</tr>
<tr>
<th>authentication_windows_use_principal_name</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td>Global</td>
<td>No</td>
</tr>
<tr>
<th>auto_generate_certs</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td>Global</td>
<td>No</td>
</tr>
<tr>
<th>auto_increment_increment</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td>Both</td>
<td>Yes</td>
</tr>
<tr>
<th>auto_increment_offset</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td>Both</td>
<td>Yes</td>
</tr>
<tr>
<th>autocommit</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td>Both</td>
<td>Yes</td>
</tr>
<tr>
<th>automatic_sp_privileges</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td>Global</td>
<td>Yes</td>
</tr>
<tr>
<th>avoid_temporal_upgrade</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td>Global</td>
<td>Yes</td>
</tr>
<tr>
<th>back_log</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td>Global</td>
<td>No</td>
</tr>
<tr>
<th>basedir</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td>Global</td>
<td>No</td>
</tr>
<tr>
<th>big_tables</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td>Both</td>
<td>Yes</td>
</tr>
<tr>
<th>bind_address</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td>Global</td>
<td>No</td>
</tr>
<tr>
<th>binlog_cache_size</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td>Global</td>
<td>Yes</td>
</tr>
<tr>
<th>binlog_checksum</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td>Global</td>
<td>Yes</td>
</tr>
<tr>
<th>binlog_direct_non_transactional_updates</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td>Both</td>
<td>Yes</td>
</tr>
<tr>
<th>binlog_error_action</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td>Global</td>
<td>Yes</td>
</tr>
<tr>
<th>binlog_format</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td>Both</td>
<td>Yes</td>
</tr>
<tr>
<th>binlog_group_commit_sync_delay</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td>Global</td>
<td>Yes</td>
</tr>
<tr>
<th>binlog_group_commit_sync_no_delay_count</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td>Global</td>
<td>Yes</td>
</tr>
<tr>
<th>binlog_gtid_simple_recovery</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td>Global</td>
<td>No</td>
</tr>
<tr>
<th>binlog_max_flush_queue_time</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td>Global</td>
<td>Yes</td>
</tr>
<tr>
<th>binlog_order_commits</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td>Global</td>
<td>Yes</td>
</tr>
<tr>
<th>binlog_row_image</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td>Both</td>
<td>Yes</td>
</tr>
<tr>
<th>binlog_rows_query_log_events</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td>Both</td>
<td>Yes</td>
</tr>
<tr>
<th>binlog_stmt_cache_size</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td>Global</td>
<td>Yes</td>
</tr>
<tr>
<th>binlog_transaction_dependency_history_size</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td>Global</td>
<td>Yes</td>
</tr>
<tr>
<th>binlog_transaction_dependency_tracking</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td>Global</td>
<td>Yes</td>
</tr>
<tr>
<th>block_encryption_mode</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td>Both</td>
<td>Yes</td>
</tr>
<tr>
<th>bulk_insert_buffer_size</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td>Both</td>
<td>Yes</td>
</tr>
<tr>
<th>character_set_client</th>
<td></td>
<td></td>
<td>Yes</td>
<td>Both</td>
<td>Yes</td>
</tr>
<tr>
<th>character_set_connection</th>
<td></td>
<td></td>
<td>Yes</td>
<td>Both</td>
<td>Yes</td>
</tr>
<tr>
<th>character_set_database (note 1)</th>
<td></td>
<td></td>
<td>Yes</td>
<td>Both</td>
<td>Yes</td>
</tr>
<tr>
<th>character_set_filesystem</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td>Both</td>
<td>Yes</td>
</tr>
<tr>
<th>character_set_results</th>
<td></td>
<td></td>
<td>Yes</td>
<td>Both</td>
<td>Yes</td>
</tr>
<tr>
<th>character_set_server</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td>Both</td>
<td>Yes</td>
</tr>
<tr>
<th>character_set_system</th>
<td></td>
<td></td>
<td>Yes</td>
<td>Global</td>
<td>No</td>
</tr>
<tr>
<th>character_sets_dir</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td>Global</td>
<td>No</td>
</tr>
<tr>
<th>check_proxy_users</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td>Global</td>
<td>Yes</td>
</tr>
<tr>
<th>collation_connection</th>
<td></td>
<td></td>
<td>Yes</td>
<td>Both</td>
<td>Yes</td>
</tr>
<tr>
<th>collation_database (note 1)</th>
<td></td>
<td></td>
<td>Yes</td>
<td>Both</td>
<td>Yes</td>
</tr>
<tr>
<th>collation_server</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td>Both</td>
<td>Yes</td>
</tr>
<tr>
<th>completion_type</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td>Both</td>
<td>Yes</td>
</tr>
<tr>
<th>concurrent_insert</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td>Global</td>
<td>Yes</td>
</tr>
<tr>
<th>connect_timeout</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td>Global</td>
<td>Yes</td>
</tr>
<tr>
<th>connection_control_failed_connections_threshold</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td>Global</td>
<td>Yes</td>
</tr>
<tr>
<th>connection_control_max_connection_delay</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td>Global</td>
<td>Yes</td>
</tr>
<tr>
<th>connection_control_min_connection_delay</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td>Global</td>
<td>Yes</td>
</tr>
<tr>
<th>core_file</th>
<td></td>
<td></td>
<td>Yes</td>
<td>Global</td>
<td>No</td>
</tr>
<tr>
<th>daemon_memcached_enable_binlog</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td>Global</td>
<td>No</td>
</tr>
<tr>
<th>daemon_memcached_engine_lib_name</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td>Global</td>
<td>No</td>
</tr>
<tr>
<th>daemon_memcached_engine_lib_path</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td>Global</td>
<td>No</td>
</tr>
<tr>
<th>daemon_memcached_option</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td>Global</td>
<td>No</td>
</tr>
<tr>
<th>daemon_memcached_r_batch_size</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td>Global</td>
<td>No</td>
</tr>
<tr>
<th>daemon_memcached_w_batch_size</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td>Global</td>
<td>No</td>
</tr>
<tr>
<th>datadir</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td>Global</td>
<td>No</td>
</tr>
<tr>
<th>date_format</th>
<td></td>
<td></td>
<td>Yes</td>
<td>Global</td>
<td>No</td>
</tr>
<tr>
<th>datetime_format</th>
<td></td>
<td></td>
<td>Yes</td>
<td>Global</td>
<td>No</td>
</tr>
<tr>
<th>debug</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td>Both</td>
<td>Yes</td>
</tr>
<tr>
<th>debug_sync</th>
<td></td>
<td></td>
<td>Yes</td>
<td>Session</td>
<td>Yes</td>
</tr>
<tr>
<th>default_authentication_plugin</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td>Global</td>
<td>No</td>
</tr>
<tr>
<th>default_password_lifetime</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td>Global</td>
<td>Yes</td>
</tr>
<tr>
<th>default_storage_engine</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td>Both</td>
<td>Yes</td>
</tr>
<tr>
<th>default_tmp_storage_engine</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td>Both</td>
<td>Yes</td>
</tr>
<tr>
<th>default_week_format</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td>Both</td>
<td>Yes</td>
</tr>
<tr>
<th>delay_key_write</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td>Global</td>
<td>Yes</td>
</tr>
<tr>
<th>delayed_insert_limit</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td>Global</td>
<td>Yes</td>
</tr>
<tr>
<th>delayed_insert_timeout</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td>Global</td>
<td>Yes</td>
</tr>
<tr>
<th>delayed_queue_size</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td>Global</td>
<td>Yes</td>
</tr>
<tr>
<th>disabled_storage_engines</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td>Global</td>
<td>No</td>
</tr>
<tr>
<th>disconnect_on_expired_password</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td>Global</td>
<td>No</td>
</tr>
<tr>
<th>div_precision_increment</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td>Both</td>
<td>Yes</td>
</tr>
<tr>
<th>end_markers_in_json</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td>Both</td>
<td>Yes</td>
</tr>
<tr>
<th>enforce_gtid_consistency</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td>Global</td>
<td>Varies</td>
</tr>
<tr>
<th>eq_range_index_dive_limit</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td>Both</td>
<td>Yes</td>
</tr>
<tr>
<th>error_count</th>
<td></td>
<td></td>
<td>Yes</td>
<td>Session</td>
<td>No</td>
</tr>
<tr>
<th>event_scheduler</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td>Global</td>
<td>Yes</td>
</tr>
<tr>
<th>expire_logs_days</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td>Global</td>
<td>Yes</td>
</tr>
<tr>
<th>explicit_defaults_for_timestamp</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td>Both</td>
<td>Yes</td>
</tr>
<tr>
<th>external_user</th>
<td></td>
<td></td>
<td>Yes</td>
<td>Session</td>
<td>No</td>
</tr>
<tr>
<th>flush</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td>Global</td>
<td>Yes</td>
</tr>
<tr>
<th>flush_time</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td>Global</td>
<td>Yes</td>
</tr>
<tr>
<th>foreign_key_checks</th>
<td></td>
<td></td>
<td>Yes</td>
<td>Both</td>
<td>Yes</td>
</tr>
<tr>
<th>ft_boolean_syntax</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td>Global</td>
<td>Yes</td>
</tr>
<tr>
<th>ft_max_word_len</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td>Global</td>
<td>No</td>
</tr>
<tr>
<th>ft_min_word_len</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td>Global</td>
<td>No</td>
</tr>
<tr>
<th>ft_query_expansion_limit</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td>Global</td>
<td>No</td>
</tr>
<tr>
<th>ft_stopword_file</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td>Global</td>
<td>No</td>
</tr>
<tr>
<th>general_log</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td>Global</td>
<td>Yes</td>
</tr>
<tr>
<th>general_log_file</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td>Global</td>
<td>Yes</td>
</tr>
<tr>
<th>group_concat_max_len</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td>Both</td>
<td>Yes</td>
</tr>
<tr>
<th>group_replication_allow_local_disjoint_gtids_join</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td>Global</td>
<td>Yes</td>
</tr>
<tr>
<th>group_replication_allow_local_lower_version_join</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td>Global</td>
<td>Yes</td>
</tr>
<tr>
<th>group_replication_auto_increment_increment</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td>Global</td>
<td>Yes</td>
</tr>
<tr>
<th>group_replication_bootstrap_group</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td>Global</td>
<td>Yes</td>
</tr>
<tr>
<th>group_replication_components_stop_timeout</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td>Global</td>
<td>Yes</td>
</tr>
<tr>
<th>group_replication_compression_threshold</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td>Global</td>
<td>Yes</td>
</tr>
<tr>
<th>group_replication_enforce_update_everywhere_checks</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td>Global</td>
<td>Yes</td>
</tr>
<tr>
<th>group_replication_exit_state_action</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td>Global</td>
<td>Yes</td>
</tr>
<tr>
<th>group_replication_flow_control_applier_threshold</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td>Global</td>
<td>Yes</td>
</tr>
<tr>
<th>group_replication_flow_control_certifier_threshold</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td>Global</td>
<td>Yes</td>
</tr>
<tr>
<th>group_replication_flow_control_mode</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td>Global</td>
<td>Yes</td>
</tr>
<tr>
<th>group_replication_force_members</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td>Global</td>
<td>Yes</td>
</tr>
<tr>
<th>group_replication_group_name</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td>Global</td>
<td>Yes</td>
</tr>
<tr>
<th>group_replication_group_seeds</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td>Global</td>
<td>Yes</td>
</tr>
<tr>
<th>group_replication_gtid_assignment_block_size</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td>Global</td>
<td>Yes</td>
</tr>
<tr>
<th>group_replication_ip_whitelist</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td>Global</td>
<td>Yes</td>
</tr>
<tr>
<th>group_replication_local_address</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td>Global</td>
<td>Yes</td>
</tr>
<tr>
<th>group_replication_member_weight</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td>Global</td>
<td>Yes</td>
</tr>
<tr>
<th>group_replication_poll_spin_loops</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td>Global</td>
<td>Yes</td>
</tr>
<tr>
<th>group_replication_recovery_complete_at</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td>Global</td>
<td>Yes</td>
</tr>
<tr>
<th>group_replication_recovery_reconnect_interval</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td>Global</td>
<td>Yes</td>
</tr>
<tr>
<th>group_replication_recovery_retry_count</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td>Global</td>
<td>Yes</td>
</tr>
<tr>
<th>group_replication_recovery_ssl_ca</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td>Global</td>
<td>Yes</td>
</tr>
<tr>
<th>group_replication_recovery_ssl_capath</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td>Global</td>
<td>Yes</td>
</tr>
<tr>
<th>group_replication_recovery_ssl_cert</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td>Global</td>
<td>Yes</td>
</tr>
<tr>
<th>group_replication_recovery_ssl_cipher</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td>Global</td>
<td>Yes</td>
</tr>
<tr>
<th>group_replication_recovery_ssl_crl</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td>Global</td>
<td>Yes</td>
</tr>
<tr>
<th>group_replication_recovery_ssl_crlpath</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td>Global</td>
<td>Yes</td>
</tr>
<tr>
<th>group_replication_recovery_ssl_key</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td>Global</td>
<td>Yes</td>
</tr>
<tr>
<th>group_replication_recovery_ssl_verify_server_cert</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td>Global</td>
<td>Yes</td>
</tr>
<tr>
<th>group_replication_recovery_use_ssl</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td>Global</td>
<td>Yes</td>
</tr>
<tr>
<th>group_replication_single_primary_mode</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td>Global</td>
<td>Yes</td>
</tr>
<tr>
<th>group_replication_ssl_mode</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td>Global</td>
<td>Yes</td>
</tr>
<tr>
<th>group_replication_start_on_boot</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td>Global</td>
<td>Yes</td>
</tr>
<tr>
<th>group_replication_transaction_size_limit</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td>Global</td>
<td>Yes</td>
</tr>
<tr>
<th>group_replication_unreachable_majority_timeout</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td>Global</td>
<td>Yes</td>
</tr>
<tr>
<th>gtid_executed</th>
<td></td>
<td></td>
<td>Yes</td>
<td>Varies</td>
<td>No</td>
</tr>
<tr>
<th>gtid_executed_compression_period</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td>Global</td>
<td>Yes</td>
</tr>
<tr>
<th>gtid_mode</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td>Global</td>
<td>Varies</td>
</tr>
<tr>
<th>gtid_next</th>
<td></td>
<td></td>
<td>Yes</td>
<td>Session</td>
<td>Yes</td>
</tr>
<tr>
<th>gtid_owned</th>
<td></td>
<td></td>
<td>Yes</td>
<td>Both</td>
<td>No</td>
</tr>
<tr>
<th>gtid_purged</th>
<td></td>
<td></td>
<td>Yes</td>
<td>Global</td>
<td>Yes</td>
</tr>
<tr>
<th>have_compress</th>
<td></td>
<td></td>
<td>Yes</td>
<td>Global</td>
<td>No</td>
</tr>
<tr>
<th>have_crypt</th>
<td></td>
<td></td>
<td>Yes</td>
<td>Global</td>
<td>No</td>
</tr>
<tr>
<th>have_dynamic_loading</th>
<td></td>
<td></td>
<td>Yes</td>
<td>Global</td>
<td>No</td>
</tr>
<tr>
<th>have_geometry</th>
<td></td>
<td></td>
<td>Yes</td>
<td>Global</td>
<td>No</td>
</tr>
<tr>
<th>have_openssl</th>
<td></td>
<td></td>
<td>Yes</td>
<td>Global</td>
<td>No</td>
</tr>
<tr>
<th>have_profiling</th>
<td></td>
<td></td>
<td>Yes</td>
<td>Global</td>
<td>No</td>
</tr>
<tr>
<th>have_query_cache</th>
<td></td>
<td></td>
<td>Yes</td>
<td>Global</td>
<td>No</td>
</tr>
<tr>
<th>have_rtree_keys</th>
<td></td>
<td></td>
<td>Yes</td>
<td>Global</td>
<td>No</td>
</tr>
<tr>
<th>have_ssl</th>
<td></td>
<td></td>
<td>Yes</td>
<td>Global</td>
<td>No</td>
</tr>
<tr>
<th>have_statement_timeout</th>
<td></td>
<td></td>
<td>Yes</td>
<td>Global</td>
<td>No</td>
</tr>
<tr>
<th>have_symlink</th>
<td></td>
<td></td>
<td>Yes</td>
<td>Global</td>
<td>No</td>
</tr>
<tr>
<th>host_cache_size</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td>Global</td>
<td>Yes</td>
</tr>
<tr>
<th>hostname</th>
<td></td>
<td></td>
<td>Yes</td>
<td>Global</td>
<td>No</td>
</tr>
<tr>
<th>identity</th>
<td></td>
<td></td>
<td>Yes</td>
<td>Session</td>
<td>Yes</td>
</tr>
<tr>
<th>ignore_builtin_innodb</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td>Global</td>
<td>No</td>
</tr>
<tr>
<th>ignore_db_dirs</th>
<td></td>
<td></td>
<td>Yes</td>
<td>Global</td>
<td>No</td>
</tr>
<tr>
<th>init_connect</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td>Global</td>
<td>Yes</td>
</tr>
<tr>
<th>init_file</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td>Global</td>
<td>No</td>
</tr>
<tr>
<th>init_slave</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td>Global</td>
<td>Yes</td>
</tr>
<tr>
<th>innodb_adaptive_flushing</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td>Global</td>
<td>Yes</td>
</tr>
<tr>
<th>innodb_adaptive_flushing_lwm</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td>Global</td>
<td>Yes</td>
</tr>
<tr>
<th>innodb_adaptive_hash_index</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td>Global</td>
<td>Yes</td>
</tr>
<tr>
<th>innodb_adaptive_hash_index_parts</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td>Global</td>
<td>No</td>
</tr>
<tr>
<th>innodb_adaptive_max_sleep_delay</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td>Global</td>
<td>Yes</td>
</tr>
<tr>
<th>innodb_api_bk_commit_interval</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td>Global</td>
<td>Yes</td>
</tr>
<tr>
<th>innodb_api_disable_rowlock</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td>Global</td>
<td>No</td>
</tr>
<tr>
<th>innodb_api_enable_binlog</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td>Global</td>
<td>No</td>
</tr>
<tr>
<th>innodb_api_enable_mdl</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td>Global</td>
<td>No</td>
</tr>
<tr>
<th>innodb_api_trx_level</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td>Global</td>
<td>Yes</td>
</tr>
<tr>
<th>innodb_autoextend_increment</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td>Global</td>
<td>Yes</td>
</tr>
<tr>
<th>innodb_autoinc_lock_mode</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td>Global</td>
<td>No</td>
</tr>
<tr>
<th>innodb_background_drop_list_empty</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td>Global</td>
<td>Yes</td>
</tr>
<tr>
<th>innodb_buffer_pool_chunk_size</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td>Global</td>
<td>No</td>
</tr>
<tr>
<th>innodb_buffer_pool_dump_at_shutdown</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td>Global</td>
<td>Yes</td>
</tr>
<tr>
<th>innodb_buffer_pool_dump_now</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td>Global</td>
<td>Yes</td>
</tr>
<tr>
<th>innodb_buffer_pool_dump_pct</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td>Global</td>
<td>Yes</td>
</tr>
<tr>
<th>innodb_buffer_pool_filename</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td>Global</td>
<td>Yes</td>
</tr>
<tr>
<th>innodb_buffer_pool_instances</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td>Global</td>
<td>No</td>
</tr>
<tr>
<th>innodb_buffer_pool_load_abort</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td>Global</td>
<td>Yes</td>
</tr>
<tr>
<th>innodb_buffer_pool_load_at_startup</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td>Global</td>
<td>No</td>
</tr>
<tr>
<th>innodb_buffer_pool_load_now</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td>Global</td>
<td>Yes</td>
</tr>
<tr>
<th>innodb_buffer_pool_size</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td>Global</td>
<td>Varies</td>
</tr>
<tr>
<th>innodb_change_buffer_max_size</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td>Global</td>
<td>Yes</td>
</tr>
<tr>
<th>innodb_change_buffering</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td>Global</td>
<td>Yes</td>
</tr>
<tr>
<th>innodb_change_buffering_debug</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td>Global</td>
<td>Yes</td>
</tr>
<tr>
<th>innodb_checksum_algorithm</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td>Global</td>
<td>Yes</td>
</tr>
<tr>
<th>innodb_checksums</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td>Global</td>
<td>No</td>
</tr>
<tr>
<th>innodb_cmp_per_index_enabled</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td>Global</td>
<td>Yes</td>
</tr>
<tr>
<th>innodb_commit_concurrency</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td>Global</td>
<td>Yes</td>
</tr>
<tr>
<th>innodb_compress_debug</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td>Global</td>
<td>Yes</td>
</tr>
<tr>
<th>innodb_compression_failure_threshold_pct</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td>Global</td>
<td>Yes</td>
</tr>
<tr>
<th>innodb_compression_level</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td>Global</td>
<td>Yes</td>
</tr>
<tr>
<th>innodb_compression_pad_pct_max</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td>Global</td>
<td>Yes</td>
</tr>
<tr>
<th>innodb_concurrency_tickets</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td>Global</td>
<td>Yes</td>
</tr>
<tr>
<th>innodb_data_file_path</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td>Global</td>
<td>No</td>
</tr>
<tr>
<th>innodb_data_home_dir</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td>Global</td>
<td>No</td>
</tr>
<tr>
<th>innodb_deadlock_detect</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td>Global</td>
<td>Yes</td>
</tr>
<tr>
<th>innodb_default_row_format</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td>Global</td>
<td>Yes</td>
</tr>
<tr>
<th>innodb_disable_resize_buffer_pool_debug</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td>Global</td>
<td>Yes</td>
</tr>
<tr>
<th>innodb_disable_sort_file_cache</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td>Global</td>
<td>Yes</td>
</tr>
<tr>
<th>innodb_doublewrite</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td>Global</td>
<td>No</td>
</tr>
<tr>
<th>innodb_fast_shutdown</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td>Global</td>
<td>Yes</td>
</tr>
<tr>
<th>innodb_fil_make_page_dirty_debug</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td>Global</td>
<td>Yes</td>
</tr>
<tr>
<th>innodb_file_format</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td>Global</td>
<td>Yes</td>
</tr>
<tr>
<th>innodb_file_format_check</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td>Global</td>
<td>No</td>
</tr>
<tr>
<th>innodb_file_format_max</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td>Global</td>
<td>Yes</td>
</tr>
<tr>
<th>innodb_file_per_table</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td>Global</td>
<td>Yes</td>
</tr>
<tr>
<th>innodb_fill_factor</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td>Global</td>
<td>Yes</td>
</tr>
<tr>
<th>innodb_flush_log_at_timeout</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td>Global</td>
<td>Yes</td>
</tr>
<tr>
<th>innodb_flush_log_at_trx_commit</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td>Global</td>
<td>Yes</td>
</tr>
<tr>
<th>innodb_flush_method</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td>Global</td>
<td>No</td>
</tr>
<tr>
<th>innodb_flush_neighbors</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td>Global</td>
<td>Yes</td>
</tr>
<tr>
<th>innodb_flush_sync</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td>Global</td>
<td>Yes</td>
</tr>
<tr>
<th>innodb_flushing_avg_loops</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td>Global</td>
<td>Yes</td>
</tr>
<tr>
<th>innodb_force_load_corrupted</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td>Global</td>
<td>No</td>
</tr>
<tr>
<th>innodb_force_recovery</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td>Global</td>
<td>No</td>
</tr>
<tr>
<th>innodb_ft_aux_table</th>
<td></td>
<td></td>
<td>Yes</td>
<td>Global</td>
<td>Yes</td>
</tr>
<tr>
<th>innodb_ft_cache_size</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td>Global</td>
<td>No</td>
</tr>
<tr>
<th>innodb_ft_enable_diag_print</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td>Global</td>
<td>Yes</td>
</tr>
<tr>
<th>innodb_ft_enable_stopword</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td>Both</td>
<td>Yes</td>
</tr>
<tr>
<th>innodb_ft_max_token_size</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td>Global</td>
<td>No</td>
</tr>
<tr>
<th>innodb_ft_min_token_size</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td>Global</td>
<td>No</td>
</tr>
<tr>
<th>innodb_ft_num_word_optimize</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td>Global</td>
<td>Yes</td>
</tr>
<tr>
<th>innodb_ft_result_cache_limit</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td>Global</td>
<td>Yes</td>
</tr>
<tr>
<th>innodb_ft_server_stopword_table</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td>Global</td>
<td>Yes</td>
</tr>
<tr>
<th>innodb_ft_sort_pll_degree</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td>Global</td>
<td>No</td>
</tr>
<tr>
<th>innodb_ft_total_cache_size</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td>Global</td>
<td>No</td>
</tr>
<tr>
<th>innodb_ft_user_stopword_table</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td>Both</td>
<td>Yes</td>
</tr>
<tr>
<th>innodb_io_capacity</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td>Global</td>
<td>Yes</td>
</tr>
<tr>
<th>innodb_io_capacity_max</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td>Global</td>
<td>Yes</td>
</tr>
<tr>
<th>innodb_large_prefix</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td>Global</td>
<td>Yes</td>
</tr>
<tr>
<th>innodb_limit_optimistic_insert_debug</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td>Global</td>
<td>Yes</td>
</tr>
<tr>
<th>innodb_lock_wait_timeout</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td>Both</td>
<td>Yes</td>
</tr>
<tr>
<th>innodb_locks_unsafe_for_binlog</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td>Global</td>
<td>No</td>
</tr>
<tr>
<th>innodb_log_buffer_size</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td>Global</td>
<td>No</td>
</tr>
<tr>
<th>innodb_log_checkpoint_now</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td>Global</td>
<td>Yes</td>
</tr>
<tr>
<th>innodb_log_checksums</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td>Global</td>
<td>Yes</td>
</tr>
<tr>
<th>innodb_log_compressed_pages</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td>Global</td>
<td>Yes</td>
</tr>
<tr>
<th>innodb_log_file_size</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td>Global</td>
<td>No</td>
</tr>
<tr>
<th>innodb_log_files_in_group</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td>Global</td>
<td>No</td>
</tr>
<tr>
<th>innodb_log_group_home_dir</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td>Global</td>
<td>No</td>
</tr>
<tr>
<th>innodb_log_write_ahead_size</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td>Global</td>
<td>Yes</td>
</tr>
<tr>
<th>innodb_lru_scan_depth</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td>Global</td>
<td>Yes</td>
</tr>
<tr>
<th>innodb_max_dirty_pages_pct</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td>Global</td>
<td>Yes</td>
</tr>
<tr>
<th>innodb_max_dirty_pages_pct_lwm</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td>Global</td>
<td>Yes</td>
</tr>
<tr>
<th>innodb_max_purge_lag</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td>Global</td>
<td>Yes</td>
</tr>
<tr>
<th>innodb_max_purge_lag_delay</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td>Global</td>
<td>Yes</td>
</tr>
<tr>
<th>innodb_max_undo_log_size</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td>Global</td>
<td>Yes</td>
</tr>
<tr>
<th>innodb_merge_threshold_set_all_debug</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td>Global</td>
<td>Yes</td>
</tr>
<tr>
<th>innodb_monitor_disable</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td>Global</td>
<td>Yes</td>
</tr>
<tr>
<th>innodb_monitor_enable</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td>Global</td>
<td>Yes</td>
</tr>
<tr>
<th>innodb_monitor_reset</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td>Global</td>
<td>Yes</td>
</tr>
<tr>
<th>innodb_monitor_reset_all</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td>Global</td>
<td>Yes</td>
</tr>
<tr>
<th>innodb_numa_interleave</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td>Global</td>
<td>No</td>
</tr>
<tr>
<th>innodb_old_blocks_pct</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td>Global</td>
<td>Yes</td>
</tr>
<tr>
<th>innodb_old_blocks_time</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td>Global</td>
<td>Yes</td>
</tr>
<tr>
<th>innodb_online_alter_log_max_size</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td>Global</td>
<td>Yes</td>
</tr>
<tr>
<th>innodb_open_files</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td>Global</td>
<td>No</td>
</tr>
<tr>
<th>innodb_optimize_fulltext_only</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td>Global</td>
<td>Yes</td>
</tr>
<tr>
<th>innodb_page_cleaners</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td>Global</td>
<td>No</td>
</tr>
<tr>
<th>innodb_page_size</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td>Global</td>
<td>No</td>
</tr>
<tr>
<th>innodb_print_all_deadlocks</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td>Global</td>
<td>Yes</td>
</tr>
<tr>
<th>innodb_purge_batch_size</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td>Global</td>
<td>Yes</td>
</tr>
<tr>
<th>innodb_purge_rseg_truncate_frequency</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td>Global</td>
<td>Yes</td>
</tr>
<tr>
<th>innodb_purge_threads</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td>Global</td>
<td>No</td>
</tr>
<tr>
<th>innodb_random_read_ahead</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td>Global</td>
<td>Yes</td>
</tr>
<tr>
<th>innodb_read_ahead_threshold</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td>Global</td>
<td>Yes</td>
</tr>
<tr>
<th>innodb_read_io_threads</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td>Global</td>
<td>No</td>
</tr>
<tr>
<th>innodb_read_only</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td>Global</td>
<td>No</td>
</tr>
<tr>
<th>innodb_replication_delay</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td>Global</td>
<td>Yes</td>
</tr>
<tr>
<th>innodb_rollback_on_timeout</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td>Global</td>
<td>No</td>
</tr>
<tr>
<th>innodb_rollback_segments</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td>Global</td>
<td>Yes</td>
</tr>
<tr>
<th>innodb_saved_page_number_debug</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td>Global</td>
<td>Yes</td>
</tr>
<tr>
<th>innodb_sort_buffer_size</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td>Global</td>
<td>No</td>
</tr>
<tr>
<th>innodb_spin_wait_delay</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td>Global</td>
<td>Yes</td>
</tr>
<tr>
<th>innodb_stats_auto_recalc</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td>Global</td>
<td>Yes</td>
</tr>
<tr>
<th>innodb_stats_include_delete_marked</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td>Global</td>
<td>Yes</td>
</tr>
<tr>
<th>innodb_stats_method</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td>Global</td>
<td>Yes</td>
</tr>
<tr>
<th>innodb_stats_on_metadata</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td>Global</td>
<td>Yes</td>
</tr>
<tr>
<th>innodb_stats_persistent</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td>Global</td>
<td>Yes</td>
</tr>
<tr>
<th>innodb_stats_persistent_sample_pages</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td>Global</td>
<td>Yes</td>
</tr>
<tr>
<th>innodb_stats_sample_pages</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td>Global</td>
<td>Yes</td>
</tr>
<tr>
<th>innodb_stats_transient_sample_pages</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td>Global</td>
<td>Yes</td>
</tr>
<tr>
<th>innodb_status_output</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td>Global</td>
<td>Yes</td>
</tr>
<tr>
<th>innodb_status_output_locks</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td>Global</td>
<td>Yes</td>
</tr>
<tr>
<th>innodb_strict_mode</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td>Both</td>
<td>Yes</td>
</tr>
<tr>
<th>innodb_support_xa</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td>Both</td>
<td>Yes</td>
</tr>
<tr>
<th>innodb_sync_array_size</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td>Global</td>
<td>No</td>
</tr>
<tr>
<th>innodb_sync_debug</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td>Global</td>
<td>No</td>
</tr>
<tr>
<th>innodb_sync_spin_loops</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td>Global</td>
<td>Yes</td>
</tr>
<tr>
<th>innodb_table_locks</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td>Both</td>
<td>Yes</td>
</tr>
<tr>
<th>innodb_temp_data_file_path</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td>Global</td>
<td>No</td>
</tr>
<tr>
<th>innodb_thread_concurrency</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td>Global</td>
<td>Yes</td>
</tr>
<tr>
<th>innodb_thread_sleep_delay</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td>Global</td>
<td>Yes</td>
</tr>
<tr>
<th>innodb_tmpdir</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td>Both</td>
<td>Yes</td>
</tr>
<tr>
<th>innodb_trx_purge_view_update_only_debug</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td>Global</td>
<td>Yes</td>
</tr>
<tr>
<th>innodb_trx_rseg_n_slots_debug</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td>Global</td>
<td>Yes</td>
</tr>
<tr>
<th>innodb_undo_directory</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td>Global</td>
<td>No</td>
</tr>
<tr>
<th>innodb_undo_log_truncate</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td>Global</td>
<td>Yes</td>
</tr>
<tr>
<th>innodb_undo_logs</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td>Global</td>
<td>Yes</td>
</tr>
<tr>
<th>innodb_undo_tablespaces</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td>Global</td>
<td>No</td>
</tr>
<tr>
<th>innodb_use_native_aio</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td>Global</td>
<td>No</td>
</tr>
<tr>
<th>innodb_version</th>
<td></td>
<td></td>
<td>Yes</td>
<td>Global</td>
<td>No</td>
</tr>
<tr>
<th>innodb_write_io_threads</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td>Global</td>
<td>No</td>
</tr>
<tr>
<th>insert_id</th>
<td></td>
<td></td>
<td>Yes</td>
<td>Session</td>
<td>Yes</td>
</tr>
<tr>
<th>interactive_timeout</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td>Both</td>
<td>Yes</td>
</tr>
<tr>
<th>internal_tmp_disk_storage_engine</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td>Global</td>
<td>Yes</td>
</tr>
<tr>
<th>join_buffer_size</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td>Both</td>
<td>Yes</td>
</tr>
<tr>
<th>keep_files_on_create</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td>Both</td>
<td>Yes</td>
</tr>
<tr>
<th>key_buffer_size</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td>Global</td>
<td>Yes</td>
</tr>
<tr>
<th>key_cache_age_threshold</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td>Global</td>
<td>Yes</td>
</tr>
<tr>
<th>key_cache_block_size</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td>Global</td>
<td>Yes</td>
</tr>
<tr>
<th>key_cache_division_limit</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td>Global</td>
<td>Yes</td>
</tr>
<tr>
<th>keyring_aws_cmk_id</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td>Global</td>
<td>Yes</td>
</tr>
<tr>
<th>keyring_aws_conf_file</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td>Global</td>
<td>No</td>
</tr>
<tr>
<th>keyring_aws_data_file</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td>Global</td>
<td>No</td>
</tr>
<tr>
<th>keyring_aws_region</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td>Global</td>
<td>Yes</td>
</tr>
<tr>
<th>keyring_encrypted_file_data</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td>Global</td>
<td>Yes</td>
</tr>
<tr>
<th>keyring_encrypted_file_password</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td>Global</td>
<td>Yes</td>
</tr>
<tr>
<th>keyring_file_data</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td>Global</td>
<td>Yes</td>
</tr>
<tr>
<th>keyring_okv_conf_dir</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td>Global</td>
<td>Yes</td>
</tr>
<tr>
<th>keyring_operations</th>
<td></td>
<td></td>
<td>Yes</td>
<td>Global</td>
<td>Yes</td>
</tr>
<tr>
<th>language</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td>Global</td>
<td>No</td>
</tr>
<tr>
<th>large_files_support</th>
<td></td>
<td></td>
<td>Yes</td>
<td>Global</td>
<td>No</td>
</tr>
<tr>
<th>large_page_size</th>
<td></td>
<td></td>
<td>Yes</td>
<td>Global</td>
<td>No</td>
</tr>
<tr>
<th>large_pages</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td>Global</td>
<td>No</td>
</tr>
<tr>
<th>last_insert_id</th>
<td></td>
<td></td>
<td>Yes</td>
<td>Session</td>
<td>Yes</td>
</tr>
<tr>
<th>lc_messages</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td>Both</td>
<td>Yes</td>
</tr>
<tr>
<th>lc_messages_dir</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td>Global</td>
<td>No</td>
</tr>
<tr>
<th>lc_time_names</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td>Both</td>
<td>Yes</td>
</tr>
<tr>
<th>license</th>
<td></td>
<td></td>
<td>Yes</td>
<td>Global</td>
<td>No</td>
</tr>
<tr>
<th>local_infile</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td>Global</td>
<td>Yes</td>
</tr>
<tr>
<th>lock_wait_timeout</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td>Both</td>
<td>Yes</td>
</tr>
<tr>
<th>locked_in_memory</th>
<td></td>
<td></td>
<td>Yes</td>
<td>Global</td>
<td>No</td>
</tr>
<tr>
<th>log_bin</th>
<td></td>
<td></td>
<td>Yes</td>
<td>Global</td>
<td>No</td>
</tr>
<tr>
<th>log_bin_basename</th>
<td></td>
<td></td>
<td>Yes</td>
<td>Global</td>
<td>No</td>
</tr>
<tr>
<th>log_bin_index</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td>Global</td>
<td>No</td>
</tr>
<tr>
<th>log_bin_trust_function_creators</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td>Global</td>
<td>Yes</td>
</tr>
<tr>
<th>log_bin_use_v1_row_events</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td>Global</td>
<td>Yes</td>
</tr>
<tr>
<th>log_builtin_as_identified_by_password</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td>Global</td>
<td>Yes</td>
</tr>
<tr>
<th>log_error</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td>Global</td>
<td>No</td>
</tr>
<tr>
<th>log_error_verbosity</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td>Global</td>
<td>Yes</td>
</tr>
<tr>
<th>log_output</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td>Global</td>
<td>Yes</td>
</tr>
<tr>
<th>log_queries_not_using_indexes</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td>Global</td>
<td>Yes</td>
</tr>
<tr>
<th>log_slave_updates</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td>Global</td>
<td>No</td>
</tr>
<tr>
<th>log_slow_admin_statements</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td>Global</td>
<td>Yes</td>
</tr>
<tr>
<th>log_slow_slave_statements</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td>Global</td>
<td>Yes</td>
</tr>
<tr>
<th>log_statements_unsafe_for_binlog</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td>Global</td>
<td>Yes</td>
</tr>
<tr>
<th>log_syslog</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td>Global</td>
<td>Yes</td>
</tr>
<tr>
<th>log_syslog_facility</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td>Global</td>
<td>Yes</td>
</tr>
<tr>
<th>log_syslog_include_pid</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td>Global</td>
<td>Yes</td>
</tr>
<tr>
<th>log_syslog_tag</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td>Global</td>
<td>Yes</td>
</tr>
<tr>
<th>log_throttle_queries_not_using_indexes</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td>Global</td>
<td>Yes</td>
</tr>
<tr>
<th>log_timestamps</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td>Global</td>
<td>Yes</td>
</tr>
<tr>
<th>log_warnings</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td>Global</td>
<td>Yes</td>
</tr>
<tr>
<th>long_query_time</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td>Both</td>
<td>Yes</td>
</tr>
<tr>
<th>low_priority_updates</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td>Both</td>
<td>Yes</td>
</tr>
<tr>
<th>lower_case_file_system</th>
<td></td>
<td></td>
<td>Yes</td>
<td>Global</td>
<td>No</td>
</tr>
<tr>
<th>lower_case_table_names</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td>Global</td>
<td>No</td>
</tr>
<tr>
<th>master_info_repository</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td>Global</td>
<td>Yes</td>
</tr>
<tr>
<th>master_verify_checksum</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td>Global</td>
<td>Yes</td>
</tr>
<tr>
<th>max_allowed_packet</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td>Both</td>
<td>Yes</td>
</tr>
<tr>
<th>max_binlog_cache_size</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td>Global</td>
<td>Yes</td>
</tr>
<tr>
<th>max_binlog_size</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td>Global</td>
<td>Yes</td>
</tr>
<tr>
<th>max_binlog_stmt_cache_size</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td>Global</td>
<td>Yes</td>
</tr>
<tr>
<th>max_connect_errors</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td>Global</td>
<td>Yes</td>
</tr>
<tr>
<th>max_connections</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td>Global</td>
<td>Yes</td>
</tr>
<tr>
<th>max_delayed_threads</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td>Both</td>
<td>Yes</td>
</tr>
<tr>
<th>max_digest_length</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td>Global</td>
<td>No</td>
</tr>
<tr>
<th>max_error_count</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td>Both</td>
<td>Yes</td>
</tr>
<tr>
<th>max_execution_time</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td>Both</td>
<td>Yes</td>
</tr>
<tr>
<th>max_heap_table_size</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td>Both</td>
<td>Yes</td>
</tr>
<tr>
<th>max_insert_delayed_threads</th>
<td></td>
<td></td>
<td>Yes</td>
<td>Both</td>
<td>Yes</td>
</tr>
<tr>
<th>max_join_size</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td>Both</td>
<td>Yes</td>
</tr>
<tr>
<th>max_length_for_sort_data</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td>Both</td>
<td>Yes</td>
</tr>
<tr>
<th>max_points_in_geometry</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td>Both</td>
<td>Yes</td>
</tr>
<tr>
<th>max_prepared_stmt_count</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td>Global</td>
<td>Yes</td>
</tr>
<tr>
<th>max_relay_log_size</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td>Global</td>
<td>Yes</td>
</tr>
<tr>
<th>max_seeks_for_key</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td>Both</td>
<td>Yes</td>
</tr>
<tr>
<th>max_sort_length</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td>Both</td>
<td>Yes</td>
</tr>
<tr>
<th>max_sp_recursion_depth</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td>Both</td>
<td>Yes</td>
</tr>
<tr>
<th>max_tmp_tables</th>
<td></td>
<td></td>
<td>Yes</td>
<td>Both</td>
<td>Yes</td>
</tr>
<tr>
<th>max_user_connections</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td>Both</td>
<td>Yes</td>
</tr>
<tr>
<th>max_write_lock_count</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td>Global</td>
<td>Yes</td>
</tr>
<tr>
<th>mecab_rc_file</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td>Global</td>
<td>No</td>
</tr>
<tr>
<th>metadata_locks_cache_size</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td>Global</td>
<td>No</td>
</tr>
<tr>
<th>metadata_locks_hash_instances</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td>Global</td>
<td>No</td>
</tr>
<tr>
<th>min_examined_row_limit</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td>Both</td>
<td>Yes</td>
</tr>
<tr>
<th>multi_range_count</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td>Both</td>
<td>Yes</td>
</tr>
<tr>
<th>myisam_data_pointer_size</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td>Global</td>
<td>Yes</td>
</tr>
<tr>
<th>myisam_max_sort_file_size</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td>Global</td>
<td>Yes</td>
</tr>
<tr>
<th>myisam_mmap_size</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td>Global</td>
<td>No</td>
</tr>
<tr>
<th>myisam_recover_options</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td>Global</td>
<td>No</td>
</tr>
<tr>
<th>myisam_repair_threads</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td>Both</td>
<td>Yes</td>
</tr>
<tr>
<th>myisam_sort_buffer_size</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td>Both</td>
<td>Yes</td>
</tr>
<tr>
<th>myisam_stats_method</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td>Both</td>
<td>Yes</td>
</tr>
<tr>
<th>myisam_use_mmap</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td>Global</td>
<td>Yes</td>
</tr>
<tr>
<th>mysql_firewall_mode</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td>Global</td>
<td>Yes</td>
</tr>
<tr>
<th>mysql_firewall_trace</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td>Global</td>
<td>Yes</td>
</tr>
<tr>
<th>mysql_native_password_proxy_users</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td>Global</td>
<td>Yes</td>
</tr>
<tr>
<th>mysqlx_bind_address</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td>Global</td>
<td>No</td>
</tr>
<tr>
<th>mysqlx_connect_timeout</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td>Global</td>
<td>Yes</td>
</tr>
<tr>
<th>mysqlx_idle_worker_thread_timeout</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td>Global</td>
<td>Yes</td>
</tr>
<tr>
<th>mysqlx_max_allowed_packet</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td>Global</td>
<td>Yes</td>
</tr>
<tr>
<th>mysqlx_max_connections</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td>Global</td>
<td>Yes</td>
</tr>
<tr>
<th>mysqlx_min_worker_threads</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td>Global</td>
<td>Yes</td>
</tr>
<tr>
<th>mysqlx_port</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td>Global</td>
<td>No</td>
</tr>
<tr>
<th>mysqlx_port_open_timeout</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td>Global</td>
<td>No</td>
</tr>
<tr>
<th>mysqlx_socket</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td>Global</td>
<td>No</td>
</tr>
<tr>
<th>mysqlx_ssl_ca</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td>Global</td>
<td>No</td>
</tr>
<tr>
<th>mysqlx_ssl_capath</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td>Global</td>
<td>No</td>
</tr>
<tr>
<th>mysqlx_ssl_cert</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td>Global</td>
<td>No</td>
</tr>
<tr>
<th>mysqlx_ssl_cipher</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td>Global</td>
<td>No</td>
</tr>
<tr>
<th>mysqlx_ssl_crl</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td>Global</td>
<td>No</td>
</tr>
<tr>
<th>mysqlx_ssl_crlpath</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td>Global</td>
<td>No</td>
</tr>
<tr>
<th>mysqlx_ssl_key</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td>Global</td>
<td>No</td>
</tr>
<tr>
<th>named_pipe</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td>Global</td>
<td>No</td>
</tr>
<tr>
<th>named_pipe_full_access_group</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td>Global</td>
<td>No</td>
</tr>
<tr>
<th>ndb_allow_copying_alter_table</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td>Both</td>
<td>Yes</td>
</tr>
<tr>
<th>ndb_autoincrement_prefetch_sz</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td>Both</td>
<td>Yes</td>
</tr>
<tr>
<th>ndb_batch_size</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td>Both</td>
<td>Yes</td>
</tr>
<tr>
<th>ndb_blob_read_batch_bytes</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td>Both</td>
<td>Yes</td>
</tr>
<tr>
<th>ndb_blob_write_batch_bytes</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td>Both</td>
<td>Yes</td>
</tr>
<tr>
<th>ndb_cache_check_time</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td>Global</td>
<td>Yes</td>
</tr>
<tr>
<th>ndb_clear_apply_status</th>
<td>Yes</td>
<td></td>
<td>Yes</td>
<td>Global</td>
<td>Yes</td>
</tr>
<tr>
<th>ndb_cluster_connection_pool</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td>Global</td>
<td>No</td>
</tr>
<tr>
<th>ndb_cluster_connection_pool_nodeids</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td>Global</td>
<td>No</td>
</tr>
<tr>
<th>ndb_data_node_neighbour</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td>Global</td>
<td>Yes</td>
</tr>
<tr>
<th>ndb_default_column_format</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td>Global</td>
<td>Yes</td>
</tr>
<tr>
<th>ndb_default_column_format</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td>Global</td>
<td>Yes</td>
</tr>
<tr>
<th>ndb_deferred_constraints</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td>Both</td>
<td>Yes</td>
</tr>
<tr>
<th>ndb_deferred_constraints</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td>Both</td>
<td>Yes</td>
</tr>
<tr>
<th>ndb_distribution</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td>Global</td>
<td>Yes</td>
</tr>
<tr>
<th>ndb_distribution</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td>Global</td>
<td>Yes</td>
</tr>
<tr>
<th>ndb_eventbuffer_free_percent</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td>Global</td>
<td>Yes</td>
</tr>
<tr>
<th>ndb_eventbuffer_max_alloc</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td>Global</td>
<td>Yes</td>
</tr>
<tr>
<th>ndb_extra_logging</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td>Global</td>
<td>Yes</td>
</tr>
<tr>
<th>ndb_force_send</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td>Both</td>
<td>Yes</td>
</tr>
<tr>
<th>ndb_fully_replicated</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td>Both</td>
<td>Yes</td>
</tr>
<tr>
<th>ndb_index_stat_enable</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td>Both</td>
<td>Yes</td>
</tr>
<tr>
<th>ndb_index_stat_option</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td>Both</td>
<td>Yes</td>
</tr>
<tr>
<th>ndb_join_pushdown</th>
<td></td>
<td></td>
<td>Yes</td>
<td>Both</td>
<td>Yes</td>
</tr>
<tr>
<th>ndb_log_apply_status</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td>Global</td>
<td>No</td>
</tr>
<tr>
<th>ndb_log_apply_status</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td>Global</td>
<td>No</td>
</tr>
<tr>
<th>ndb_log_bin</th>
<td>Yes</td>
<td></td>
<td>Yes</td>
<td>Both</td>
<td>No</td>
</tr>
<tr>
<th>ndb_log_binlog_index</th>
<td>Yes</td>
<td></td>
<td>Yes</td>
<td>Global</td>
<td>Yes</td>
</tr>
<tr>
<th>ndb_log_empty_epochs</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td>Global</td>
<td>Yes</td>
</tr>
<tr>
<th>ndb_log_empty_epochs</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td>Global</td>
<td>Yes</td>
</tr>
<tr>
<th>ndb_log_empty_update</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td>Global</td>
<td>Yes</td>
</tr>
<tr>
<th>ndb_log_empty_update</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td>Global</td>
<td>Yes</td>
</tr>
<tr>
<th>ndb_log_exclusive_reads</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td>Both</td>
<td>Yes</td>
</tr>
<tr>
<th>ndb_log_exclusive_reads</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td>Both</td>
<td>Yes</td>
</tr>
<tr>
<th>ndb_log_fail_terminate</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td>Global</td>
<td>No</td>
</tr>
<tr>
<th>ndb_log_orig</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td>Global</td>
<td>No</td>
</tr>
<tr>
<th>ndb_log_orig</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td>Global</td>
<td>No</td>
</tr>
<tr>
<th>ndb_log_transaction_id</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td>Global</td>
<td>No</td>
</tr>
<tr>
<th>ndb_log_transaction_id</th>
<td></td>
<td></td>
<td>Yes</td>
<td>Global</td>
<td>No</td>
</tr>
<tr>
<th>ndb_log_update_as_write</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td>Global</td>
<td>Yes</td>
</tr>
<tr>
<th>ndb_log_update_minimal</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td>Global</td>
<td>Yes</td>
</tr>
<tr>
<th>ndb_log_updated_only</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td>Global</td>
<td>Yes</td>
</tr>
<tr>
<th>ndb_optimization_delay</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td>Global</td>
<td>Yes</td>
</tr>
<tr>
<th>ndb_optimized_node_selection</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td>Global</td>
<td>Yes</td>
</tr>
<tr>
<th>ndb_optimized_node_selection</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td>Global</td>
<td>No</td>
</tr>
<tr>
<th>ndb_read_backup</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td>Global</td>
<td>Yes</td>
</tr>
<tr>
<th>ndb_recv_thread_activation_threshold</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td>Global</td>
<td>Yes</td>
</tr>
<tr>
<th>ndb_recv_thread_cpu_mask</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td>Global</td>
<td>Yes</td>
</tr>
<tr>
<th>ndb_report_thresh_binlog_epoch_slip</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td>Global</td>
<td>Yes</td>
</tr>
<tr>
<th>ndb_report_thresh_binlog_mem_usage</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td>Global</td>
<td>Yes</td>
</tr>
<tr>
<th>ndb_row_checksum</th>
<td></td>
<td></td>
<td>Yes</td>
<td>Both</td>
<td>Yes</td>
</tr>
<tr>
<th>ndb_show_foreign_key_mock_tables</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td>Global</td>
<td>Yes</td>
</tr>
<tr>
<th>ndb_slave_conflict_role</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td>Global</td>
<td>Yes</td>
</tr>
<tr>
<th>Ndb_system_name</th>
<td></td>
<td></td>
<td>Yes</td>
<td>Global</td>
<td>No</td>
</tr>
<tr>
<th>ndb_table_no_logging</th>
<td></td>
<td></td>
<td>Yes</td>
<td>Session</td>
<td>Yes</td>
</tr>
<tr>
<th>ndb_table_temporary</th>
<td></td>
<td></td>
<td>Yes</td>
<td>Session</td>
<td>Yes</td>
</tr>
<tr>
<th>ndb_use_copying_alter_table</th>
<td></td>
<td></td>
<td>Yes</td>
<td>Both</td>
<td>No</td>
</tr>
<tr>
<th>ndb_use_exact_count</th>
<td></td>
<td></td>
<td>Yes</td>
<td>Both</td>
<td>Yes</td>
</tr>
<tr>
<th>ndb_use_transactions</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td>Both</td>
<td>Yes</td>
</tr>
<tr>
<th>ndb_version</th>
<td></td>
<td></td>
<td>Yes</td>
<td>Global</td>
<td>No</td>
</tr>
<tr>
<th>ndb_version_string</th>
<td></td>
<td></td>
<td>Yes</td>
<td>Global</td>
<td>No</td>
</tr>
<tr>
<th>ndb_wait_connected</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td>Global</td>
<td>No</td>
</tr>
<tr>
<th>ndb_wait_setup</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td>Global</td>
<td>No</td>
</tr>
<tr>
<th>ndbinfo_database</th>
<td></td>
<td></td>
<td>Yes</td>
<td>Global</td>
<td>No</td>
</tr>
<tr>
<th>ndbinfo_max_bytes</th>
<td>Yes</td>
<td></td>
<td>Yes</td>
<td>Both</td>
<td>Yes</td>
</tr>
<tr>
<th>ndbinfo_max_rows</th>
<td>Yes</td>
<td></td>
<td>Yes</td>
<td>Both</td>
<td>Yes</td>
</tr>
<tr>
<th>ndbinfo_offline</th>
<td></td>
<td></td>
<td>Yes</td>
<td>Global</td>
<td>Yes</td>
</tr>
<tr>
<th>ndbinfo_show_hidden</th>
<td>Yes</td>
<td></td>
<td>Yes</td>
<td>Both</td>
<td>Yes</td>
</tr>
<tr>
<th>ndbinfo_table_prefix</th>
<td></td>
<td></td>
<td>Yes</td>
<td>Global</td>
<td>No</td>
</tr>
<tr>
<th>ndbinfo_version</th>
<td></td>
<td></td>
<td>Yes</td>
<td>Global</td>
<td>No</td>
</tr>
<tr>
<th>net_buffer_length</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td>Both</td>
<td>Yes</td>
</tr>
<tr>
<th>net_read_timeout</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td>Both</td>
<td>Yes</td>
</tr>
<tr>
<th>net_retry_count</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td>Both</td>
<td>Yes</td>
</tr>
<tr>
<th>net_write_timeout</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td>Both</td>
<td>Yes</td>
</tr>
<tr>
<th>new</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td>Both</td>
<td>Yes</td>
</tr>
<tr>
<th>ngram_token_size</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td>Global</td>
<td>No</td>
</tr>
<tr>
<th>offline_mode</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td>Global</td>
<td>Yes</td>
</tr>
<tr>
<th>old</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td>Global</td>
<td>No</td>
</tr>
<tr>
<th>old_alter_table</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td>Both</td>
<td>Yes</td>
</tr>
<tr>
<th>old_passwords</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td>Both</td>
<td>Yes</td>
</tr>
<tr>
<th>open_files_limit</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td>Global</td>
<td>No</td>
</tr>
<tr>
<th>optimizer_prune_level</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td>Both</td>
<td>Yes</td>
</tr>
<tr>
<th>optimizer_search_depth</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td>Both</td>
<td>Yes</td>
</tr>
<tr>
<th>optimizer_switch</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td>Both</td>
<td>Yes</td>
</tr>
<tr>
<th>optimizer_trace</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td>Both</td>
<td>Yes</td>
</tr>
<tr>
<th>optimizer_trace_features</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td>Both</td>
<td>Yes</td>
</tr>
<tr>
<th>optimizer_trace_limit</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td>Both</td>
<td>Yes</td>
</tr>
<tr>
<th>optimizer_trace_max_mem_size</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td>Both</td>
<td>Yes</td>
</tr>
<tr>
<th>optimizer_trace_offset</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td>Both</td>
<td>Yes</td>
</tr>
<tr>
<th>parser_max_mem_size</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td>Both</td>
<td>Yes</td>
</tr>
<tr>
<th>performance_schema</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td>Global</td>
<td>No</td>
</tr>
<tr>
<th>performance_schema_accounts_size</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td>Global</td>
<td>No</td>
</tr>
<tr>
<th>performance_schema_digests_size</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td>Global</td>
<td>No</td>
</tr>
<tr>
<th>performance_schema_events_stages_history_long_size</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td>Global</td>
<td>No</td>
</tr>
<tr>
<th>performance_schema_events_stages_history_size</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td>Global</td>
<td>No</td>
</tr>
<tr>
<th>performance_schema_events_statements_history_long_size</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td>Global</td>
<td>No</td>
</tr>
<tr>
<th>performance_schema_events_statements_history_size</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td>Global</td>
<td>No</td>
</tr>
<tr>
<th>performance_schema_events_transactions_history_long_size</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td>Global</td>
<td>No</td>
</tr>
<tr>
<th>performance_schema_events_transactions_history_size</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td>Global</td>
<td>No</td>
</tr>
<tr>
<th>performance_schema_events_waits_history_long_size</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td>Global</td>
<td>No</td>
</tr>
<tr>
<th>performance_schema_events_waits_history_size</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td>Global</td>
<td>No</td>
</tr>
<tr>
<th>performance_schema_hosts_size</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td>Global</td>
<td>No</td>
</tr>
<tr>
<th>performance_schema_max_cond_classes</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td>Global</td>
<td>No</td>
</tr>
<tr>
<th>performance_schema_max_cond_instances</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td>Global</td>
<td>No</td>
</tr>
<tr>
<th>performance_schema_max_digest_length</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td>Global</td>
<td>No</td>
</tr>
<tr>
<th>performance_schema_max_file_classes</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td>Global</td>
<td>No</td>
</tr>
<tr>
<th>performance_schema_max_file_handles</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td>Global</td>
<td>No</td>
</tr>
<tr>
<th>performance_schema_max_file_instances</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td>Global</td>
<td>No</td>
</tr>
<tr>
<th>performance_schema_max_index_stat</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td>Global</td>
<td>No</td>
</tr>
<tr>
<th>performance_schema_max_memory_classes</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td>Global</td>
<td>No</td>
</tr>
<tr>
<th>performance_schema_max_metadata_locks</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td>Global</td>
<td>No</td>
</tr>
<tr>
<th>performance_schema_max_mutex_classes</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td>Global</td>
<td>No</td>
</tr>
<tr>
<th>performance_schema_max_mutex_instances</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td>Global</td>
<td>No</td>
</tr>
<tr>
<th>performance_schema_max_prepared_statements_instances</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td>Global</td>
<td>No</td>
</tr>
<tr>
<th>performance_schema_max_program_instances</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td>Global</td>
<td>No</td>
</tr>
<tr>
<th>performance_schema_max_rwlock_classes</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td>Global</td>
<td>No</td>
</tr>
<tr>
<th>performance_schema_max_rwlock_instances</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td>Global</td>
<td>No</td>
</tr>
<tr>
<th>performance_schema_max_socket_classes</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td>Global</td>
<td>No</td>
</tr>
<tr>
<th>performance_schema_max_socket_instances</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td>Global</td>
<td>No</td>
</tr>
<tr>
<th>performance_schema_max_sql_text_length</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td>Global</td>
<td>No</td>
</tr>
<tr>
<th>performance_schema_max_stage_classes</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td>Global</td>
<td>No</td>
</tr>
<tr>
<th>performance_schema_max_statement_classes</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td>Global</td>
<td>No</td>
</tr>
<tr>
<th>performance_schema_max_statement_stack</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td>Global</td>
<td>No</td>
</tr>
<tr>
<th>performance_schema_max_table_handles</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td>Global</td>
<td>No</td>
</tr>
<tr>
<th>performance_schema_max_table_instances</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td>Global</td>
<td>No</td>
</tr>
<tr>
<th>performance_schema_max_table_lock_stat</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td>Global</td>
<td>No</td>
</tr>
<tr>
<th>performance_schema_max_thread_classes</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td>Global</td>
<td>No</td>
</tr>
<tr>
<th>performance_schema_max_thread_instances</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td>Global</td>
<td>No</td>
</tr>
<tr>
<th>performance_schema_session_connect_attrs_size</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td>Global</td>
<td>No</td>
</tr>
<tr>
<th>performance_schema_setup_actors_size</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td>Global</td>
<td>No</td>
</tr>
<tr>
<th>performance_schema_setup_objects_size</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td>Global</td>
<td>No</td>
</tr>
<tr>
<th>performance_schema_show_processlist</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td>Global</td>
<td>Yes</td>
</tr>
<tr>
<th>performance_schema_users_size</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td>Global</td>
<td>No</td>
</tr>
<tr>
<th>pid_file</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td>Global</td>
<td>No</td>
</tr>
<tr>
<th>plugin_dir</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td>Global</td>
<td>No</td>
</tr>
<tr>
<th>port</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td>Global</td>
<td>No</td>
</tr>
<tr>
<th>preload_buffer_size</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td>Both</td>
<td>Yes</td>
</tr>
<tr>
<th>profiling</th>
<td></td>
<td></td>
<td>Yes</td>
<td>Both</td>
<td>Yes</td>
</tr>
<tr>
<th>profiling_history_size</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td>Both</td>
<td>Yes</td>
</tr>
<tr>
<th>protocol_version</th>
<td></td>
<td></td>
<td>Yes</td>
<td>Global</td>
<td>No</td>
</tr>
<tr>
<th>proxy_user</th>
<td></td>
<td></td>
<td>Yes</td>
<td>Session</td>
<td>No</td>
</tr>
<tr>
<th>pseudo_slave_mode</th>
<td></td>
<td></td>
<td>Yes</td>
<td>Session</td>
<td>Yes</td>
</tr>
<tr>
<th>pseudo_thread_id</th>
<td></td>
<td></td>
<td>Yes</td>
<td>Session</td>
<td>Yes</td>
</tr>
<tr>
<th>query_alloc_block_size</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td>Both</td>
<td>Yes</td>
</tr>
<tr>
<th>query_cache_limit</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td>Global</td>
<td>Yes</td>
</tr>
<tr>
<th>query_cache_min_res_unit</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td>Global</td>
<td>Yes</td>
</tr>
<tr>
<th>query_cache_size</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td>Global</td>
<td>Yes</td>
</tr>
<tr>
<th>query_cache_type</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td>Both</td>
<td>Yes</td>
</tr>
<tr>
<th>query_cache_wlock_invalidate</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td>Both</td>
<td>Yes</td>
</tr>
<tr>
<th>query_prealloc_size</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td>Both</td>
<td>Yes</td>
</tr>
<tr>
<th>rand_seed1</th>
<td></td>
<td></td>
<td>Yes</td>
<td>Session</td>
<td>Yes</td>
</tr>
<tr>
<th>rand_seed2</th>
<td></td>
<td></td>
<td>Yes</td>
<td>Session</td>
<td>Yes</td>
</tr>
<tr>
<th>range_alloc_block_size</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td>Both</td>
<td>Yes</td>
</tr>
<tr>
<th>range_optimizer_max_mem_size</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td>Both</td>
<td>Yes</td>
</tr>
<tr>
<th>rbr_exec_mode</th>
<td></td>
<td></td>
<td>Yes</td>
<td>Session</td>
<td>Yes</td>
</tr>
<tr>
<th>read_buffer_size</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td>Both</td>
<td>Yes</td>
</tr>
<tr>
<th>read_only</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td>Global</td>
<td>Yes</td>
</tr>
<tr>
<th>read_rnd_buffer_size</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td>Both</td>
<td>Yes</td>
</tr>
<tr>
<th>relay_log</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td>Global</td>
<td>No</td>
</tr>
<tr>
<th>relay_log_basename</th>
<td></td>
<td></td>
<td>Yes</td>
<td>Global</td>
<td>No</td>
</tr>
<tr>
<th>relay_log_index</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td>Global</td>
<td>No</td>
</tr>
<tr>
<th>relay_log_info_file</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td>Global</td>
<td>No</td>
</tr>
<tr>
<th>relay_log_info_repository</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td>Global</td>
<td>Yes</td>
</tr>
<tr>
<th>relay_log_purge</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td>Global</td>
<td>Yes</td>
</tr>
<tr>
<th>relay_log_recovery</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td>Global</td>
<td>No</td>
</tr>
<tr>
<th>relay_log_space_limit</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td>Global</td>
<td>No</td>
</tr>
<tr>
<th>replication_optimize_for_static_plugin_config</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td>Global</td>
<td>Yes</td>
</tr>
<tr>
<th>replication_sender_observe_commit_only</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td>Global</td>
<td>Yes</td>
</tr>
<tr>
<th>report_host</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td>Global</td>
<td>No</td>
</tr>
<tr>
<th>report_password</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td>Global</td>
<td>No</td>
</tr>
<tr>
<th>report_port</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td>Global</td>
<td>No</td>
</tr>
<tr>
<th>report_user</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td>Global</td>
<td>No</td>
</tr>
<tr>
<th>require_secure_transport</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td>Global</td>
<td>Yes</td>
</tr>
<tr>
<th>rewriter_enabled</th>
<td></td>
<td></td>
<td>Yes</td>
<td>Global</td>
<td>Yes</td>
</tr>
<tr>
<th>rewriter_verbose</th>
<td></td>
<td></td>
<td>Yes</td>
<td>Global</td>
<td>Yes</td>
</tr>
<tr>
<th>rpl_semi_sync_master_enabled</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td>Global</td>
<td>Yes</td>
</tr>
<tr>
<th>rpl_semi_sync_master_timeout</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td>Global</td>
<td>Yes</td>
</tr>
<tr>
<th>rpl_semi_sync_master_trace_level</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td>Global</td>
<td>Yes</td>
</tr>
<tr>
<th>rpl_semi_sync_master_wait_for_slave_count</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td>Global</td>
<td>Yes</td>
</tr>
<tr>
<th>rpl_semi_sync_master_wait_no_slave</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td>Global</td>
<td>Yes</td>
</tr>
<tr>
<th>rpl_semi_sync_master_wait_point</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td>Global</td>
<td>Yes</td>
</tr>
<tr>
<th>rpl_semi_sync_slave_enabled</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td>Global</td>
<td>Yes</td>
</tr>
<tr>
<th>rpl_semi_sync_slave_trace_level</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td>Global</td>
<td>Yes</td>
</tr>
<tr>
<th>rpl_stop_slave_timeout</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td>Global</td>
<td>Yes</td>
</tr>
<tr>
<th>secure_auth</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td>Global</td>
<td>Yes</td>
</tr>
<tr>
<th>secure_file_priv</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td>Global</td>
<td>No</td>
</tr>
<tr>
<th>server_id</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td>Global</td>
<td>Yes</td>
</tr>
<tr>
<th>server_id_bits</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td>Global</td>
<td>No</td>
</tr>
<tr>
<th>server_uuid</th>
<td></td>
<td></td>
<td>Yes</td>
<td>Global</td>
<td>No</td>
</tr>
<tr>
<th>session_track_gtids</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td>Both</td>
<td>Yes</td>
</tr>
<tr>
<th>session_track_schema</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td>Both</td>
<td>Yes</td>
</tr>
<tr>
<th>session_track_state_change</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td>Both</td>
<td>Yes</td>
</tr>
<tr>
<th>session_track_system_variables</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td>Both</td>
<td>Yes</td>
</tr>
<tr>
<th>session_track_transaction_info</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td>Both</td>
<td>Yes</td>
</tr>
<tr>
<th>sha256_password_auto_generate_rsa_keys</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td>Global</td>
<td>No</td>
</tr>
<tr>
<th>sha256_password_private_key_path</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td>Global</td>
<td>No</td>
</tr>
<tr>
<th>sha256_password_proxy_users</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td>Global</td>
<td>Yes</td>
</tr>
<tr>
<th>sha256_password_public_key_path</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td>Global</td>
<td>No</td>
</tr>
<tr>
<th>shared_memory</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td>Global</td>
<td>No</td>
</tr>
<tr>
<th>shared_memory_base_name</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td>Global</td>
<td>No</td>
</tr>
<tr>
<th>show_compatibility_56</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td>Global</td>
<td>Yes</td>
</tr>
<tr>
<th>show_create_table_verbosity</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td>Both</td>
<td>Yes</td>
</tr>
<tr>
<th>show_old_temporals</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td>Both</td>
<td>Yes</td>
</tr>
<tr>
<th>skip_external_locking</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td>Global</td>
<td>No</td>
</tr>
<tr>
<th>skip_name_resolve</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td>Global</td>
<td>No</td>
</tr>
<tr>
<th>skip_networking</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td>Global</td>
<td>No</td>
</tr>
<tr>
<th>skip_show_database</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td>Global</td>
<td>No</td>
</tr>
<tr>
<th>skip_slave_start</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td>Global</td>
<td>No</td>
</tr>
<tr>
<th>slave_allow_batching</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td>Global</td>
<td>Yes</td>
</tr>
<tr>
<th>slave_checkpoint_group</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td>Global</td>
<td>Yes</td>
</tr>
<tr>
<th>slave_checkpoint_period</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td>Global</td>
<td>Yes</td>
</tr>
<tr>
<th>slave_compressed_protocol</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td>Global</td>
<td>Yes</td>
</tr>
<tr>
<th>slave_exec_mode</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td>Global</td>
<td>Yes</td>
</tr>
<tr>
<th>slave_load_tmpdir</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td>Global</td>
<td>No</td>
</tr>
<tr>
<th>slave_max_allowed_packet</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td>Global</td>
<td>Yes</td>
</tr>
<tr>
<th>slave_net_timeout</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td>Global</td>
<td>Yes</td>
</tr>
<tr>
<th>slave_parallel_type</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td>Global</td>
<td>Yes</td>
</tr>
<tr>
<th>slave_parallel_workers</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td>Global</td>
<td>Yes</td>
</tr>
<tr>
<th>slave_pending_jobs_size_max</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td>Global</td>
<td>Yes</td>
</tr>
<tr>
<th>slave_preserve_commit_order</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td>Global</td>
<td>Yes</td>
</tr>
<tr>
<th>slave_rows_search_algorithms</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td>Global</td>
<td>Yes</td>
</tr>
<tr>
<th>slave_skip_errors</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td>Global</td>
<td>No</td>
</tr>
<tr>
<th>slave_sql_verify_checksum</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td>Global</td>
<td>Yes</td>
</tr>
<tr>
<th>slave_transaction_retries</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td>Global</td>
<td>Yes</td>
</tr>
<tr>
<th>slave_type_conversions</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td>Global</td>
<td>Yes</td>
</tr>
<tr>
<th>slow_launch_time</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td>Global</td>
<td>Yes</td>
</tr>
<tr>
<th>slow_query_log</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td>Global</td>
<td>Yes</td>
</tr>
<tr>
<th>slow_query_log_file</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td>Global</td>
<td>Yes</td>
</tr>
<tr>
<th>socket</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td>Global</td>
<td>No</td>
</tr>
<tr>
<th>sort_buffer_size</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td>Both</td>
<td>Yes</td>
</tr>
<tr>
<th>sql_auto_is_null</th>
<td></td>
<td></td>
<td>Yes</td>
<td>Both</td>
<td>Yes</td>
</tr>
<tr>
<th>sql_big_selects</th>
<td></td>
<td></td>
<td>Yes</td>
<td>Both</td>
<td>Yes</td>
</tr>
<tr>
<th>sql_buffer_result</th>
<td></td>
<td></td>
<td>Yes</td>
<td>Both</td>
<td>Yes</td>
</tr>
<tr>
<th>sql_log_bin</th>
<td></td>
<td></td>
<td>Yes</td>
<td>Session</td>
<td>Yes</td>
</tr>
<tr>
<th>sql_log_off</th>
<td></td>
<td></td>
<td>Yes</td>
<td>Both</td>
<td>Yes</td>
</tr>
<tr>
<th>sql_mode</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td>Both</td>
<td>Yes</td>
</tr>
<tr>
<th>sql_notes</th>
<td></td>
<td></td>
<td>Yes</td>
<td>Both</td>
<td>Yes</td>
</tr>
<tr>
<th>sql_quote_show_create</th>
<td></td>
<td></td>
<td>Yes</td>
<td>Both</td>
<td>Yes</td>
</tr>
<tr>
<th>sql_safe_updates</th>
<td></td>
<td></td>
<td>Yes</td>
<td>Both</td>
<td>Yes</td>
</tr>
<tr>
<th>sql_select_limit</th>
<td></td>
<td></td>
<td>Yes</td>
<td>Both</td>
<td>Yes</td>
</tr>
<tr>
<th>sql_slave_skip_counter</th>
<td></td>
<td></td>
<td>Yes</td>
<td>Global</td>
<td>Yes</td>
</tr>
<tr>
<th>sql_warnings</th>
<td></td>
<td></td>
<td>Yes</td>
<td>Both</td>
<td>Yes</td>
</tr>
<tr>
<th>ssl_ca</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td>Global</td>
<td>No</td>
</tr>
<tr>
<th>ssl_capath</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td>Global</td>
<td>No</td>
</tr>
<tr>
<th>ssl_cert</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td>Global</td>
<td>No</td>
</tr>
<tr>
<th>ssl_cipher</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td>Global</td>
<td>No</td>
</tr>
<tr>
<th>ssl_crl</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td>Global</td>
<td>No</td>
</tr>
<tr>
<th>ssl_crlpath</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td>Global</td>
<td>No</td>
</tr>
<tr>
<th>ssl_key</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td>Global</td>
<td>No</td>
</tr>
<tr>
<th>stored_program_cache</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td>Global</td>
<td>Yes</td>
</tr>
<tr>
<th>super_read_only</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td>Global</td>
<td>Yes</td>
</tr>
<tr>
<th>sync_binlog</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td>Global</td>
<td>Yes</td>
</tr>
<tr>
<th>sync_frm</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td>Global</td>
<td>Yes</td>
</tr>
<tr>
<th>sync_master_info</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td>Global</td>
<td>Yes</td>
</tr>
<tr>
<th>sync_relay_log</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td>Global</td>
<td>Yes</td>
</tr>
<tr>
<th>sync_relay_log_info</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td>Global</td>
<td>Yes</td>
</tr>
<tr>
<th>system_time_zone</th>
<td></td>
<td></td>
<td>Yes</td>
<td>Global</td>
<td>No</td>
</tr>
<tr>
<th>table_definition_cache</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td>Global</td>
<td>Yes</td>
</tr>
<tr>
<th>table_open_cache</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td>Global</td>
<td>Yes</td>
</tr>
<tr>
<th>table_open_cache_instances</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td>Global</td>
<td>No</td>
</tr>
<tr>
<th>thread_cache_size</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td>Global</td>
<td>Yes</td>
</tr>
<tr>
<th>thread_handling</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td>Global</td>
<td>No</td>
</tr>
<tr>
<th>thread_pool_algorithm</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td>Global</td>
<td>No</td>
</tr>
<tr>
<th>thread_pool_high_priority_connection</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td>Both</td>
<td>Yes</td>
</tr>
<tr>
<th>thread_pool_max_unused_threads</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td>Global</td>
<td>Yes</td>
</tr>
<tr>
<th>thread_pool_prio_kickup_timer</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td>Global</td>
<td>Yes</td>
</tr>
<tr>
<th>thread_pool_size</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td>Global</td>
<td>No</td>
</tr>
<tr>
<th>thread_pool_stall_limit</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td>Global</td>
<td>Yes</td>
</tr>
<tr>
<th>thread_stack</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td>Global</td>
<td>No</td>
</tr>
<tr>
<th>time_format</th>
<td></td>
<td></td>
<td>Yes</td>
<td>Global</td>
<td>No</td>
</tr>
<tr>
<th>time_zone</th>
<td></td>
<td></td>
<td>Yes</td>
<td>Both</td>
<td>Yes</td>
</tr>
<tr>
<th>timestamp</th>
<td></td>
<td></td>
<td>Yes</td>
<td>Session</td>
<td>Yes</td>
</tr>
<tr>
<th>tls_version</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td>Global</td>
<td>No</td>
</tr>
<tr>
<th>tmp_table_size</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td>Both</td>
<td>Yes</td>
</tr>
<tr>
<th>tmpdir</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td>Global</td>
<td>No</td>
</tr>
<tr>
<th>transaction_alloc_block_size</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td>Both</td>
<td>Yes</td>
</tr>
<tr>
<th>transaction_allow_batching</th>
<td></td>
<td></td>
<td>Yes</td>
<td>Session</td>
<td>Yes</td>
</tr>
<tr>
<th>transaction_isolation</th>
<td>Yes</td>
<td>Yes</td>
<td></td>
<td></td>
<td>Yes</td>
</tr>
<tr>
<th> - <em>Variable</em>: tx_isolation</th>
<td></td>
<td></td>
<td>Yes</td>
<td>Both</td>
<td>Yes</td>
</tr>
<tr>
<th>transaction_prealloc_size</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td>Both</td>
<td>Yes</td>
</tr>
<tr>
<th>transaction_read_only</th>
<td>Yes</td>
<td>Yes</td>
<td></td>
<td></td>
<td>Yes</td>
</tr>
<tr>
<th> - <em>Variable</em>: tx_read_only</th>
<td></td>
<td></td>
<td>Yes</td>
<td>Both</td>
<td>Yes</td>
</tr>
<tr>
<th>transaction_write_set_extraction</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td>Both</td>
<td>Yes</td>
</tr>
<tr>
<th>tx_isolation</th>
<td></td>
<td></td>
<td>Yes</td>
<td>Both</td>
<td>Yes</td>
</tr>
<tr>
<th>tx_read_only</th>
<td></td>
<td></td>
<td>Yes</td>
<td>Both</td>
<td>Yes</td>
</tr>
<tr>
<th>unique_checks</th>
<td></td>
<td></td>
<td>Yes</td>
<td>Both</td>
<td>Yes</td>
</tr>
<tr>
<th>updatable_views_with_limit</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td>Both</td>
<td>Yes</td>
</tr>
<tr>
<th>validate_password_check_user_name</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td>Global</td>
<td>Yes</td>
</tr>
<tr>
<th>validate_password_dictionary_file</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td>Global</td>
<td>Varies</td>
</tr>
<tr>
<th>validate_password_length</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td>Global</td>
<td>Yes</td>
</tr>
<tr>
<th>validate_password_mixed_case_count</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td>Global</td>
<td>Yes</td>
</tr>
<tr>
<th>validate_password_number_count</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td>Global</td>
<td>Yes</td>
</tr>
<tr>
<th>validate_password_policy</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td>Global</td>
<td>Yes</td>
</tr>
<tr>
<th>validate_password_special_char_count</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td>Global</td>
<td>Yes</td>
</tr>
<tr>
<th>version</th>
<td></td>
<td></td>
<td>Yes</td>
<td>Global</td>
<td>No</td>
</tr>
<tr>
<th>version_comment</th>
<td></td>
<td></td>
<td>Yes</td>
<td>Global</td>
<td>No</td>
</tr>
<tr>
<th>version_compile_machine</th>
<td></td>
<td></td>
<td>Yes</td>
<td>Global</td>
<td>No</td>
</tr>
<tr>
<th>version_compile_os</th>
<td></td>
<td></td>
<td>Yes</td>
<td>Global</td>
<td>No</td>
</tr>
<tr>
<th>version_tokens_session</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td>Both</td>
<td>Yes</td>
</tr>
<tr>
<th>version_tokens_session_number</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td>Both</td>
<td>No</td>
</tr>
<tr>
<th>wait_timeout</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td>Both</td>
<td>Yes</td>
</tr>
<tr>
<th>warning_count</th>
<td></td>
<td></td>
<td>Yes</td>
<td>Session</td>
<td>No</td>
</tr>
</tbody>
</table>

**Notas:**

1. Esta opção é dinâmica, mas deve ser definida apenas pelo servidor. Você não deve definir essa variável manualmente.

### 5.1.5 Referência à variável de status do servidor

A tabela a seguir lista todas as variáveis de status aplicáveis dentro de `mysqld`.

A tabela lista o tipo de dados e o escopo de cada variável. A última coluna indica se o escopo de cada variável é Global, Sessão ou ambos. Consulte as descrições dos itens correspondentes para obter detalhes sobre a configuração e uso das variáveis. Quando apropriado, são fornecidos links diretos para informações adicionais sobre os itens.

**Tabela 5.3 Resumo das Variáveis de Status**

<table>
<thead>
<tr>
<th>Variable Name</th>
<th>Variable Type</th>
<th>Variable Scope</th>
</tr>
</thead>
<tbody>
<tr>
<th>Aborted_clients</th>
<td>Integer</td>
<td>Global</td>
</tr>
<tr>
<th>Aborted_connects</th>
<td>Integer</td>
<td>Global</td>
</tr>
<tr>
<th>Audit_log_current_size</th>
<td>Integer</td>
<td>Global</td>
</tr>
<tr>
<th>Audit_log_event_max_drop_size</th>
<td>Integer</td>
<td>Global</td>
</tr>
<tr>
<th>Audit_log_events</th>
<td>Integer</td>
<td>Global</td>
</tr>
<tr>
<th>Audit_log_events_filtered</th>
<td>Integer</td>
<td>Global</td>
</tr>
<tr>
<th>Audit_log_events_lost</th>
<td>Integer</td>
<td>Global</td>
</tr>
<tr>
<th>Audit_log_events_written</th>
<td>Integer</td>
<td>Global</td>
</tr>
<tr>
<th>Audit_log_total_size</th>
<td>Integer</td>
<td>Global</td>
</tr>
<tr>
<th>Audit_log_write_waits</th>
<td>Integer</td>
<td>Global</td>
</tr>
<tr>
<th>Binlog_cache_disk_use</th>
<td>Integer</td>
<td>Global</td>
</tr>
<tr>
<th>Binlog_cache_use</th>
<td>Integer</td>
<td>Global</td>
</tr>
<tr>
<th>Binlog_stmt_cache_disk_use</th>
<td>Integer</td>
<td>Global</td>
</tr>
<tr>
<th>Binlog_stmt_cache_use</th>
<td>Integer</td>
<td>Global</td>
</tr>
<tr>
<th>Bytes_received</th>
<td>Integer</td>
<td>Both</td>
</tr>
<tr>
<th>Bytes_sent</th>
<td>Integer</td>
<td>Both</td>
</tr>
<tr>
<th>Com_admin_commands</th>
<td>Integer</td>
<td>Both</td>
</tr>
<tr>
<th>Com_alter_db</th>
<td>Integer</td>
<td>Both</td>
</tr>
<tr>
<th>Com_alter_db_upgrade</th>
<td>Integer</td>
<td>Both</td>
</tr>
<tr>
<th>Com_alter_event</th>
<td>Integer</td>
<td>Both</td>
</tr>
<tr>
<th>Com_alter_function</th>
<td>Integer</td>
<td>Both</td>
</tr>
<tr>
<th>Com_alter_procedure</th>
<td>Integer</td>
<td>Both</td>
</tr>
<tr>
<th>Com_alter_server</th>
<td>Integer</td>
<td>Both</td>
</tr>
<tr>
<th>Com_alter_table</th>
<td>Integer</td>
<td>Both</td>
</tr>
<tr>
<th>Com_alter_tablespace</th>
<td>Integer</td>
<td>Both</td>
</tr>
<tr>
<th>Com_alter_user</th>
<td>Integer</td>
<td>Both</td>
</tr>
<tr>
<th>Com_analyze</th>
<td>Integer</td>
<td>Both</td>
</tr>
<tr>
<th>Com_assign_to_keycache</th>
<td>Integer</td>
<td>Both</td>
</tr>
<tr>
<th>Com_begin</th>
<td>Integer</td>
<td>Both</td>
</tr>
<tr>
<th>Com_binlog</th>
<td>Integer</td>
<td>Both</td>
</tr>
<tr>
<th>Com_call_procedure</th>
<td>Integer</td>
<td>Both</td>
</tr>
<tr>
<th>Com_change_db</th>
<td>Integer</td>
<td>Both</td>
</tr>
<tr>
<th>Com_change_master</th>
<td>Integer</td>
<td>Both</td>
</tr>
<tr>
<th>Com_change_repl_filter</th>
<td>Integer</td>
<td>Both</td>
</tr>
<tr>
<th>Com_check</th>
<td>Integer</td>
<td>Both</td>
</tr>
<tr>
<th>Com_checksum</th>
<td>Integer</td>
<td>Both</td>
</tr>
<tr>
<th>Com_commit</th>
<td>Integer</td>
<td>Both</td>
</tr>
<tr>
<th>Com_create_db</th>
<td>Integer</td>
<td>Both</td>
</tr>
<tr>
<th>Com_create_event</th>
<td>Integer</td>
<td>Both</td>
</tr>
<tr>
<th>Com_create_function</th>
<td>Integer</td>
<td>Both</td>
</tr>
<tr>
<th>Com_create_index</th>
<td>Integer</td>
<td>Both</td>
</tr>
<tr>
<th>Com_create_procedure</th>
<td>Integer</td>
<td>Both</td>
</tr>
<tr>
<th>Com_create_server</th>
<td>Integer</td>
<td>Both</td>
</tr>
<tr>
<th>Com_create_table</th>
<td>Integer</td>
<td>Both</td>
</tr>
<tr>
<th>Com_create_trigger</th>
<td>Integer</td>
<td>Both</td>
</tr>
<tr>
<th>Com_create_udf</th>
<td>Integer</td>
<td>Both</td>
</tr>
<tr>
<th>Com_create_user</th>
<td>Integer</td>
<td>Both</td>
</tr>
<tr>
<th>Com_create_view</th>
<td>Integer</td>
<td>Both</td>
</tr>
<tr>
<th>Com_dealloc_sql</th>
<td>Integer</td>
<td>Both</td>
</tr>
<tr>
<th>Com_delete</th>
<td>Integer</td>
<td>Both</td>
</tr>
<tr>
<th>Com_delete_multi</th>
<td>Integer</td>
<td>Both</td>
</tr>
<tr>
<th>Com_do</th>
<td>Integer</td>
<td>Both</td>
</tr>
<tr>
<th>Com_drop_db</th>
<td>Integer</td>
<td>Both</td>
</tr>
<tr>
<th>Com_drop_event</th>
<td>Integer</td>
<td>Both</td>
</tr>
<tr>
<th>Com_drop_function</th>
<td>Integer</td>
<td>Both</td>
</tr>
<tr>
<th>Com_drop_index</th>
<td>Integer</td>
<td>Both</td>
</tr>
<tr>
<th>Com_drop_procedure</th>
<td>Integer</td>
<td>Both</td>
</tr>
<tr>
<th>Com_drop_server</th>
<td>Integer</td>
<td>Both</td>
</tr>
<tr>
<th>Com_drop_table</th>
<td>Integer</td>
<td>Both</td>
</tr>
<tr>
<th>Com_drop_trigger</th>
<td>Integer</td>
<td>Both</td>
</tr>
<tr>
<th>Com_drop_user</th>
<td>Integer</td>
<td>Both</td>
</tr>
<tr>
<th>Com_drop_view</th>
<td>Integer</td>
<td>Both</td>
</tr>
<tr>
<th>Com_empty_query</th>
<td>Integer</td>
<td>Both</td>
</tr>
<tr>
<th>Com_execute_sql</th>
<td>Integer</td>
<td>Both</td>
</tr>
<tr>
<th>Com_explain_other</th>
<td>Integer</td>
<td>Both</td>
</tr>
<tr>
<th>Com_flush</th>
<td>Integer</td>
<td>Both</td>
</tr>
<tr>
<th>Com_get_diagnostics</th>
<td>Integer</td>
<td>Both</td>
</tr>
<tr>
<th>Com_grant</th>
<td>Integer</td>
<td>Both</td>
</tr>
<tr>
<th>Com_group_replication_start</th>
<td>Integer</td>
<td>Global</td>
</tr>
<tr>
<th>Com_group_replication_stop</th>
<td>Integer</td>
<td>Global</td>
</tr>
<tr>
<th>Com_ha_close</th>
<td>Integer</td>
<td>Both</td>
</tr>
<tr>
<th>Com_ha_open</th>
<td>Integer</td>
<td>Both</td>
</tr>
<tr>
<th>Com_ha_read</th>
<td>Integer</td>
<td>Both</td>
</tr>
<tr>
<th>Com_help</th>
<td>Integer</td>
<td>Both</td>
</tr>
<tr>
<th>Com_insert</th>
<td>Integer</td>
<td>Both</td>
</tr>
<tr>
<th>Com_insert_select</th>
<td>Integer</td>
<td>Both</td>
</tr>
<tr>
<th>Com_install_plugin</th>
<td>Integer</td>
<td>Both</td>
</tr>
<tr>
<th>Com_kill</th>
<td>Integer</td>
<td>Both</td>
</tr>
<tr>
<th>Com_load</th>
<td>Integer</td>
<td>Both</td>
</tr>
<tr>
<th>Com_lock_tables</th>
<td>Integer</td>
<td>Both</td>
</tr>
<tr>
<th>Com_optimize</th>
<td>Integer</td>
<td>Both</td>
</tr>
<tr>
<th>Com_preload_keys</th>
<td>Integer</td>
<td>Both</td>
</tr>
<tr>
<th>Com_prepare_sql</th>
<td>Integer</td>
<td>Both</td>
</tr>
<tr>
<th>Com_purge</th>
<td>Integer</td>
<td>Both</td>
</tr>
<tr>
<th>Com_purge_before_date</th>
<td>Integer</td>
<td>Both</td>
</tr>
<tr>
<th>Com_release_savepoint</th>
<td>Integer</td>
<td>Both</td>
</tr>
<tr>
<th>Com_rename_table</th>
<td>Integer</td>
<td>Both</td>
</tr>
<tr>
<th>Com_rename_user</th>
<td>Integer</td>
<td>Both</td>
</tr>
<tr>
<th>Com_repair</th>
<td>Integer</td>
<td>Both</td>
</tr>
<tr>
<th>Com_replace</th>
<td>Integer</td>
<td>Both</td>
</tr>
<tr>
<th>Com_replace_select</th>
<td>Integer</td>
<td>Both</td>
</tr>
<tr>
<th>Com_reset</th>
<td>Integer</td>
<td>Both</td>
</tr>
<tr>
<th>Com_resignal</th>
<td>Integer</td>
<td>Both</td>
</tr>
<tr>
<th>Com_revoke</th>
<td>Integer</td>
<td>Both</td>
</tr>
<tr>
<th>Com_revoke_all</th>
<td>Integer</td>
<td>Both</td>
</tr>
<tr>
<th>Com_rollback</th>
<td>Integer</td>
<td>Both</td>
</tr>
<tr>
<th>Com_rollback_to_savepoint</th>
<td>Integer</td>
<td>Both</td>
</tr>
<tr>
<th>Com_savepoint</th>
<td>Integer</td>
<td>Both</td>
</tr>
<tr>
<th>Com_select</th>
<td>Integer</td>
<td>Both</td>
</tr>
<tr>
<th>Com_set_option</th>
<td>Integer</td>
<td>Both</td>
</tr>
<tr>
<th>Com_show_authors</th>
<td>Integer</td>
<td>Both</td>
</tr>
<tr>
<th>Com_show_binlog_events</th>
<td>Integer</td>
<td>Both</td>
</tr>
<tr>
<th>Com_show_binlogs</th>
<td>Integer</td>
<td>Both</td>
</tr>
<tr>
<th>Com_show_charsets</th>
<td>Integer</td>
<td>Both</td>
</tr>
<tr>
<th>Com_show_collations</th>
<td>Integer</td>
<td>Both</td>
</tr>
<tr>
<th>Com_show_contributors</th>
<td>Integer</td>
<td>Both</td>
</tr>
<tr>
<th>Com_show_create_db</th>
<td>Integer</td>
<td>Both</td>
</tr>
<tr>
<th>Com_show_create_event</th>
<td>Integer</td>
<td>Both</td>
</tr>
<tr>
<th>Com_show_create_func</th>
<td>Integer</td>
<td>Both</td>
</tr>
<tr>
<th>Com_show_create_proc</th>
<td>Integer</td>
<td>Both</td>
</tr>
<tr>
<th>Com_show_create_table</th>
<td>Integer</td>
<td>Both</td>
</tr>
<tr>
<th>Com_show_create_trigger</th>
<td>Integer</td>
<td>Both</td>
</tr>
<tr>
<th>Com_show_create_user</th>
<td>Integer</td>
<td>Both</td>
</tr>
<tr>
<th>Com_show_databases</th>
<td>Integer</td>
<td>Both</td>
</tr>
<tr>
<th>Com_show_engine_logs</th>
<td>Integer</td>
<td>Both</td>
</tr>
<tr>
<th>Com_show_engine_mutex</th>
<td>Integer</td>
<td>Both</td>
</tr>
<tr>
<th>Com_show_engine_status</th>
<td>Integer</td>
<td>Both</td>
</tr>
<tr>
<th>Com_show_errors</th>
<td>Integer</td>
<td>Both</td>
</tr>
<tr>
<th>Com_show_events</th>
<td>Integer</td>
<td>Both</td>
</tr>
<tr>
<th>Com_show_fields</th>
<td>Integer</td>
<td>Both</td>
</tr>
<tr>
<th>Com_show_function_code</th>
<td>Integer</td>
<td>Both</td>
</tr>
<tr>
<th>Com_show_function_status</th>
<td>Integer</td>
<td>Both</td>
</tr>
<tr>
<th>Com_show_grants</th>
<td>Integer</td>
<td>Both</td>
</tr>
<tr>
<th>Com_show_keys</th>
<td>Integer</td>
<td>Both</td>
</tr>
<tr>
<th>Com_show_master_status</th>
<td>Integer</td>
<td>Both</td>
</tr>
<tr>
<th>Com_show_ndb_status</th>
<td>Integer</td>
<td>Both</td>
</tr>
<tr>
<th>Com_show_open_tables</th>
<td>Integer</td>
<td>Both</td>
</tr>
<tr>
<th>Com_show_plugins</th>
<td>Integer</td>
<td>Both</td>
</tr>
<tr>
<th>Com_show_privileges</th>
<td>Integer</td>
<td>Both</td>
</tr>
<tr>
<th>Com_show_procedure_code</th>
<td>Integer</td>
<td>Both</td>
</tr>
<tr>
<th>Com_show_procedure_status</th>
<td>Integer</td>
<td>Both</td>
</tr>
<tr>
<th>Com_show_processlist</th>
<td>Integer</td>
<td>Both</td>
</tr>
<tr>
<th>Com_show_profile</th>
<td>Integer</td>
<td>Both</td>
</tr>
<tr>
<th>Com_show_profiles</th>
<td>Integer</td>
<td>Both</td>
</tr>
<tr>
<th>Com_show_relaylog_events</th>
<td>Integer</td>
<td>Both</td>
</tr>
<tr>
<th>Com_show_slave_hosts</th>
<td>Integer</td>
<td>Both</td>
</tr>
<tr>
<th>Com_show_slave_status</th>
<td>Integer</td>
<td>Both</td>
</tr>
<tr>
<th>Com_show_status</th>
<td>Integer</td>
<td>Both</td>
</tr>
<tr>
<th>Com_show_storage_engines</th>
<td>Integer</td>
<td>Both</td>
</tr>
<tr>
<th>Com_show_table_status</th>
<td>Integer</td>
<td>Both</td>
</tr>
<tr>
<th>Com_show_tables</th>
<td>Integer</td>
<td>Both</td>
</tr>
<tr>
<th>Com_show_triggers</th>
<td>Integer</td>
<td>Both</td>
</tr>
<tr>
<th>Com_show_variables</th>
<td>Integer</td>
<td>Both</td>
</tr>
<tr>
<th>Com_show_warnings</th>
<td>Integer</td>
<td>Both</td>
</tr>
<tr>
<th>Com_shutdown</th>
<td>Integer</td>
<td>Both</td>
</tr>
<tr>
<th>Com_signal</th>
<td>Integer</td>
<td>Both</td>
</tr>
<tr>
<th>Com_slave_start</th>
<td>Integer</td>
<td>Both</td>
</tr>
<tr>
<th>Com_slave_stop</th>
<td>Integer</td>
<td>Both</td>
</tr>
<tr>
<th>Com_stmt_close</th>
<td>Integer</td>
<td>Both</td>
</tr>
<tr>
<th>Com_stmt_execute</th>
<td>Integer</td>
<td>Both</td>
</tr>
<tr>
<th>Com_stmt_fetch</th>
<td>Integer</td>
<td>Both</td>
</tr>
<tr>
<th>Com_stmt_prepare</th>
<td>Integer</td>
<td>Both</td>
</tr>
<tr>
<th>Com_stmt_reprepare</th>
<td>Integer</td>
<td>Both</td>
</tr>
<tr>
<th>Com_stmt_reset</th>
<td>Integer</td>
<td>Both</td>
</tr>
<tr>
<th>Com_stmt_send_long_data</th>
<td>Integer</td>
<td>Both</td>
</tr>
<tr>
<th>Com_truncate</th>
<td>Integer</td>
<td>Both</td>
</tr>
<tr>
<th>Com_uninstall_plugin</th>
<td>Integer</td>
<td>Both</td>
</tr>
<tr>
<th>Com_unlock_tables</th>
<td>Integer</td>
<td>Both</td>
</tr>
<tr>
<th>Com_update</th>
<td>Integer</td>
<td>Both</td>
</tr>
<tr>
<th>Com_update_multi</th>
<td>Integer</td>
<td>Both</td>
</tr>
<tr>
<th>Com_xa_commit</th>
<td>Integer</td>
<td>Both</td>
</tr>
<tr>
<th>Com_xa_end</th>
<td>Integer</td>
<td>Both</td>
</tr>
<tr>
<th>Com_xa_prepare</th>
<td>Integer</td>
<td>Both</td>
</tr>
<tr>
<th>Com_xa_recover</th>
<td>Integer</td>
<td>Both</td>
</tr>
<tr>
<th>Com_xa_rollback</th>
<td>Integer</td>
<td>Both</td>
</tr>
<tr>
<th>Com_xa_start</th>
<td>Integer</td>
<td>Both</td>
</tr>
<tr>
<th>Compression</th>
<td>Integer</td>
<td>Session</td>
</tr>
<tr>
<th>Connection_control_delay_generated</th>
<td>Integer</td>
<td>Global</td>
</tr>
<tr>
<th>Connection_errors_accept</th>
<td>Integer</td>
<td>Global</td>
</tr>
<tr>
<th>Connection_errors_internal</th>
<td>Integer</td>
<td>Global</td>
</tr>
<tr>
<th>Connection_errors_max_connections</th>
<td>Integer</td>
<td>Global</td>
</tr>
<tr>
<th>Connection_errors_peer_address</th>
<td>Integer</td>
<td>Global</td>
</tr>
<tr>
<th>Connection_errors_select</th>
<td>Integer</td>
<td>Global</td>
</tr>
<tr>
<th>Connection_errors_tcpwrap</th>
<td>Integer</td>
<td>Global</td>
</tr>
<tr>
<th>Connections</th>
<td>Integer</td>
<td>Global</td>
</tr>
<tr>
<th>Created_tmp_disk_tables</th>
<td>Integer</td>
<td>Both</td>
</tr>
<tr>
<th>Created_tmp_files</th>
<td>Integer</td>
<td>Global</td>
</tr>
<tr>
<th>Created_tmp_tables</th>
<td>Integer</td>
<td>Both</td>
</tr>
<tr>
<th>Delayed_errors</th>
<td>Integer</td>
<td>Global</td>
</tr>
<tr>
<th>Delayed_insert_threads</th>
<td>Integer</td>
<td>Global</td>
</tr>
<tr>
<th>Delayed_writes</th>
<td>Integer</td>
<td>Global</td>
</tr>
<tr>
<th>Firewall_access_denied</th>
<td>Integer</td>
<td>Global</td>
</tr>
<tr>
<th>Firewall_access_granted</th>
<td>Integer</td>
<td>Global</td>
</tr>
<tr>
<th>Firewall_access_suspicious</th>
<td>Integer</td>
<td>Global</td>
</tr>
<tr>
<th>Firewall_cached_entries</th>
<td>Integer</td>
<td>Global</td>
</tr>
<tr>
<th>Flush_commands</th>
<td>Integer</td>
<td>Global</td>
</tr>
<tr>
<th>group_replication_primary_member</th>
<td>String</td>
<td>Global</td>
</tr>
<tr>
<th>Handler_commit</th>
<td>Integer</td>
<td>Both</td>
</tr>
<tr>
<th>Handler_delete</th>
<td>Integer</td>
<td>Both</td>
</tr>
<tr>
<th>Handler_discover</th>
<td>Integer</td>
<td>Both</td>
</tr>
<tr>
<th>Handler_external_lock</th>
<td>Integer</td>
<td>Both</td>
</tr>
<tr>
<th>Handler_mrr_init</th>
<td>Integer</td>
<td>Both</td>
</tr>
<tr>
<th>Handler_prepare</th>
<td>Integer</td>
<td>Both</td>
</tr>
<tr>
<th>Handler_read_first</th>
<td>Integer</td>
<td>Both</td>
</tr>
<tr>
<th>Handler_read_key</th>
<td>Integer</td>
<td>Both</td>
</tr>
<tr>
<th>Handler_read_last</th>
<td>Integer</td>
<td>Both</td>
</tr>
<tr>
<th>Handler_read_next</th>
<td>Integer</td>
<td>Both</td>
</tr>
<tr>
<th>Handler_read_prev</th>
<td>Integer</td>
<td>Both</td>
</tr>
<tr>
<th>Handler_read_rnd</th>
<td>Integer</td>
<td>Both</td>
</tr>
<tr>
<th>Handler_read_rnd_next</th>
<td>Integer</td>
<td>Both</td>
</tr>
<tr>
<th>Handler_rollback</th>
<td>Integer</td>
<td>Both</td>
</tr>
<tr>
<th>Handler_savepoint</th>
<td>Integer</td>
<td>Both</td>
</tr>
<tr>
<th>Handler_savepoint_rollback</th>
<td>Integer</td>
<td>Both</td>
</tr>
<tr>
<th>Handler_update</th>
<td>Integer</td>
<td>Both</td>
</tr>
<tr>
<th>Handler_write</th>
<td>Integer</td>
<td>Both</td>
</tr>
<tr>
<th>Innodb_available_undo_logs</th>
<td>Integer</td>
<td>Global</td>
</tr>
<tr>
<th>Innodb_buffer_pool_bytes_data</th>
<td>Integer</td>
<td>Global</td>
</tr>
<tr>
<th>Innodb_buffer_pool_bytes_dirty</th>
<td>Integer</td>
<td>Global</td>
</tr>
<tr>
<th>Innodb_buffer_pool_dump_status</th>
<td>String</td>
<td>Global</td>
</tr>
<tr>
<th>Innodb_buffer_pool_load_status</th>
<td>String</td>
<td>Global</td>
</tr>
<tr>
<th>Innodb_buffer_pool_pages_data</th>
<td>Integer</td>
<td>Global</td>
</tr>
<tr>
<th>Innodb_buffer_pool_pages_dirty</th>
<td>Integer</td>
<td>Global</td>
</tr>
<tr>
<th>Innodb_buffer_pool_pages_flushed</th>
<td>Integer</td>
<td>Global</td>
</tr>
<tr>
<th>Innodb_buffer_pool_pages_free</th>
<td>Integer</td>
<td>Global</td>
</tr>
<tr>
<th>Innodb_buffer_pool_pages_latched</th>
<td>Integer</td>
<td>Global</td>
</tr>
<tr>
<th>Innodb_buffer_pool_pages_misc</th>
<td>Integer</td>
<td>Global</td>
</tr>
<tr>
<th>Innodb_buffer_pool_pages_total</th>
<td>Integer</td>
<td>Global</td>
</tr>
<tr>
<th>Innodb_buffer_pool_read_ahead</th>
<td>Integer</td>
<td>Global</td>
</tr>
<tr>
<th>Innodb_buffer_pool_read_ahead_evicted</th>
<td>Integer</td>
<td>Global</td>
</tr>
<tr>
<th>Innodb_buffer_pool_read_ahead_rnd</th>
<td>Integer</td>
<td>Global</td>
</tr>
<tr>
<th>Innodb_buffer_pool_read_requests</th>
<td>Integer</td>
<td>Global</td>
</tr>
<tr>
<th>Innodb_buffer_pool_reads</th>
<td>Integer</td>
<td>Global</td>
</tr>
<tr>
<th>Innodb_buffer_pool_resize_status</th>
<td>String</td>
<td>Global</td>
</tr>
<tr>
<th>Innodb_buffer_pool_wait_free</th>
<td>Integer</td>
<td>Global</td>
</tr>
<tr>
<th>Innodb_buffer_pool_write_requests</th>
<td>Integer</td>
<td>Global</td>
</tr>
<tr>
<th>Innodb_data_fsyncs</th>
<td>Integer</td>
<td>Global</td>
</tr>
<tr>
<th>Innodb_data_pending_fsyncs</th>
<td>Integer</td>
<td>Global</td>
</tr>
<tr>
<th>Innodb_data_pending_reads</th>
<td>Integer</td>
<td>Global</td>
</tr>
<tr>
<th>Innodb_data_pending_writes</th>
<td>Integer</td>
<td>Global</td>
</tr>
<tr>
<th>Innodb_data_read</th>
<td>Integer</td>
<td>Global</td>
</tr>
<tr>
<th>Innodb_data_reads</th>
<td>Integer</td>
<td>Global</td>
</tr>
<tr>
<th>Innodb_data_writes</th>
<td>Integer</td>
<td>Global</td>
</tr>
<tr>
<th>Innodb_data_written</th>
<td>Integer</td>
<td>Global</td>
</tr>
<tr>
<th>Innodb_dblwr_pages_written</th>
<td>Integer</td>
<td>Global</td>
</tr>
<tr>
<th>Innodb_dblwr_writes</th>
<td>Integer</td>
<td>Global</td>
</tr>
<tr>
<th>Innodb_have_atomic_builtins</th>
<td>Integer</td>
<td>Global</td>
</tr>
<tr>
<th>Innodb_log_waits</th>
<td>Integer</td>
<td>Global</td>
</tr>
<tr>
<th>Innodb_log_write_requests</th>
<td>Integer</td>
<td>Global</td>
</tr>
<tr>
<th>Innodb_log_writes</th>
<td>Integer</td>
<td>Global</td>
</tr>
<tr>
<th>Innodb_num_open_files</th>
<td>Integer</td>
<td>Global</td>
</tr>
<tr>
<th>Innodb_os_log_fsyncs</th>
<td>Integer</td>
<td>Global</td>
</tr>
<tr>
<th>Innodb_os_log_pending_fsyncs</th>
<td>Integer</td>
<td>Global</td>
</tr>
<tr>
<th>Innodb_os_log_pending_writes</th>
<td>Integer</td>
<td>Global</td>
</tr>
<tr>
<th>Innodb_os_log_written</th>
<td>Integer</td>
<td>Global</td>
</tr>
<tr>
<th>Innodb_page_size</th>
<td>Integer</td>
<td>Global</td>
</tr>
<tr>
<th>Innodb_pages_created</th>
<td>Integer</td>
<td>Global</td>
</tr>
<tr>
<th>Innodb_pages_read</th>
<td>Integer</td>
<td>Global</td>
</tr>
<tr>
<th>Innodb_pages_written</th>
<td>Integer</td>
<td>Global</td>
</tr>
<tr>
<th>Innodb_row_lock_current_waits</th>
<td>Integer</td>
<td>Global</td>
</tr>
<tr>
<th>Innodb_row_lock_time</th>
<td>Integer</td>
<td>Global</td>
</tr>
<tr>
<th>Innodb_row_lock_time_avg</th>
<td>Integer</td>
<td>Global</td>
</tr>
<tr>
<th>Innodb_row_lock_time_max</th>
<td>Integer</td>
<td>Global</td>
</tr>
<tr>
<th>Innodb_row_lock_waits</th>
<td>Integer</td>
<td>Global</td>
</tr>
<tr>
<th>Innodb_rows_deleted</th>
<td>Integer</td>
<td>Global</td>
</tr>
<tr>
<th>Innodb_rows_inserted</th>
<td>Integer</td>
<td>Global</td>
</tr>
<tr>
<th>Innodb_rows_read</th>
<td>Integer</td>
<td>Global</td>
</tr>
<tr>
<th>Innodb_rows_updated</th>
<td>Integer</td>
<td>Global</td>
</tr>
<tr>
<th>Innodb_truncated_status_writes</th>
<td>Integer</td>
<td>Global</td>
</tr>
<tr>
<th>Key_blocks_not_flushed</th>
<td>Integer</td>
<td>Global</td>
</tr>
<tr>
<th>Key_blocks_unused</th>
<td>Integer</td>
<td>Global</td>
</tr>
<tr>
<th>Key_blocks_used</th>
<td>Integer</td>
<td>Global</td>
</tr>
<tr>
<th>Key_read_requests</th>
<td>Integer</td>
<td>Global</td>
</tr>
<tr>
<th>Key_reads</th>
<td>Integer</td>
<td>Global</td>
</tr>
<tr>
<th>Key_write_requests</th>
<td>Integer</td>
<td>Global</td>
</tr>
<tr>
<th>Key_writes</th>
<td>Integer</td>
<td>Global</td>
</tr>
<tr>
<th>Last_query_cost</th>
<td>Numeric</td>
<td>Session</td>
</tr>
<tr>
<th>Last_query_partial_plans</th>
<td>Integer</td>
<td>Session</td>
</tr>
<tr>
<th>Locked_connects</th>
<td>Integer</td>
<td>Global</td>
</tr>
<tr>
<th>Max_execution_time_exceeded</th>
<td>Integer</td>
<td>Both</td>
</tr>
<tr>
<th>Max_execution_time_set</th>
<td>Integer</td>
<td>Both</td>
</tr>
<tr>
<th>Max_execution_time_set_failed</th>
<td>Integer</td>
<td>Both</td>
</tr>
<tr>
<th>Max_used_connections</th>
<td>Integer</td>
<td>Global</td>
</tr>
<tr>
<th>Max_used_connections_time</th>
<td>Datetime</td>
<td>Global</td>
</tr>
<tr>
<th>mecab_charset</th>
<td>String</td>
<td>Global</td>
</tr>
<tr>
<th>Mysqlx_address</th>
<td>String</td>
<td>Global</td>
</tr>
<tr>
<th>Mysqlx_bytes_received</th>
<td>Integer</td>
<td>Both</td>
</tr>
<tr>
<th>Mysqlx_bytes_sent</th>
<td>Integer</td>
<td>Both</td>
</tr>
<tr>
<th>Mysqlx_connection_accept_errors</th>
<td>Integer</td>
<td>Both</td>
</tr>
<tr>
<th>Mysqlx_connection_errors</th>
<td>Integer</td>
<td>Both</td>
</tr>
<tr>
<th>Mysqlx_connections_accepted</th>
<td>Integer</td>
<td>Global</td>
</tr>
<tr>
<th>Mysqlx_connections_closed</th>
<td>Integer</td>
<td>Global</td>
</tr>
<tr>
<th>Mysqlx_connections_rejected</th>
<td>Integer</td>
<td>Global</td>
</tr>
<tr>
<th>Mysqlx_crud_create_view</th>
<td>Integer</td>
<td>Both</td>
</tr>
<tr>
<th>Mysqlx_crud_delete</th>
<td>Integer</td>
<td>Both</td>
</tr>
<tr>
<th>Mysqlx_crud_drop_view</th>
<td>Integer</td>
<td>Both</td>
</tr>
<tr>
<th>Mysqlx_crud_find</th>
<td>Integer</td>
<td>Both</td>
</tr>
<tr>
<th>Mysqlx_crud_insert</th>
<td>Integer</td>
<td>Both</td>
</tr>
<tr>
<th>Mysqlx_crud_modify_view</th>
<td>Integer</td>
<td>Both</td>
</tr>
<tr>
<th>Mysqlx_crud_update</th>
<td>Integer</td>
<td>Both</td>
</tr>
<tr>
<th>Mysqlx_errors_sent</th>
<td>Integer</td>
<td>Both</td>
</tr>
<tr>
<th>Mysqlx_errors_unknown_message_type</th>
<td>Integer</td>
<td>Both</td>
</tr>
<tr>
<th>Mysqlx_expect_close</th>
<td>Integer</td>
<td>Both</td>
</tr>
<tr>
<th>Mysqlx_expect_open</th>
<td>Integer</td>
<td>Both</td>
</tr>
<tr>
<th>Mysqlx_init_error</th>
<td>Integer</td>
<td>Both</td>
</tr>
<tr>
<th>Mysqlx_notice_other_sent</th>
<td>Integer</td>
<td>Both</td>
</tr>
<tr>
<th>Mysqlx_notice_warning_sent</th>
<td>Integer</td>
<td>Both</td>
</tr>
<tr>
<th>Mysqlx_port</th>
<td>String</td>
<td>Global</td>
</tr>
<tr>
<th>Mysqlx_rows_sent</th>
<td>Integer</td>
<td>Both</td>
</tr>
<tr>
<th>Mysqlx_sessions</th>
<td>Integer</td>
<td>Global</td>
</tr>
<tr>
<th>Mysqlx_sessions_accepted</th>
<td>Integer</td>
<td>Global</td>
</tr>
<tr>
<th>Mysqlx_sessions_closed</th>
<td>Integer</td>
<td>Global</td>
</tr>
<tr>
<th>Mysqlx_sessions_fatal_error</th>
<td>Integer</td>
<td>Global</td>
</tr>
<tr>
<th>Mysqlx_sessions_killed</th>
<td>Integer</td>
<td>Global</td>
</tr>
<tr>
<th>Mysqlx_sessions_rejected</th>
<td>Integer</td>
<td>Global</td>
</tr>
<tr>
<th>Mysqlx_socket</th>
<td>String</td>
<td>Global</td>
</tr>
<tr>
<th>Mysqlx_ssl_accept_renegotiates</th>
<td>Integer</td>
<td>Global</td>
</tr>
<tr>
<th>Mysqlx_ssl_accepts</th>
<td>Integer</td>
<td>Global</td>
</tr>
<tr>
<th>Mysqlx_ssl_active</th>
<td>Integer</td>
<td>Both</td>
</tr>
<tr>
<th>Mysqlx_ssl_cipher</th>
<td>Integer</td>
<td>Both</td>
</tr>
<tr>
<th>Mysqlx_ssl_cipher_list</th>
<td>Integer</td>
<td>Both</td>
</tr>
<tr>
<th>Mysqlx_ssl_ctx_verify_depth</th>
<td>Integer</td>
<td>Both</td>
</tr>
<tr>
<th>Mysqlx_ssl_ctx_verify_mode</th>
<td>Integer</td>
<td>Both</td>
</tr>
<tr>
<th>Mysqlx_ssl_finished_accepts</th>
<td>Integer</td>
<td>Global</td>
</tr>
<tr>
<th>Mysqlx_ssl_server_not_after</th>
<td>Integer</td>
<td>Global</td>
</tr>
<tr>
<th>Mysqlx_ssl_server_not_before</th>
<td>Integer</td>
<td>Global</td>
</tr>
<tr>
<th>Mysqlx_ssl_verify_depth</th>
<td>Integer</td>
<td>Global</td>
</tr>
<tr>
<th>Mysqlx_ssl_verify_mode</th>
<td>Integer</td>
<td>Global</td>
</tr>
<tr>
<th>Mysqlx_ssl_version</th>
<td>Integer</td>
<td>Both</td>
</tr>
<tr>
<th>Mysqlx_stmt_create_collection</th>
<td>Integer</td>
<td>Both</td>
</tr>
<tr>
<th>Mysqlx_stmt_create_collection_index</th>
<td>Integer</td>
<td>Both</td>
</tr>
<tr>
<th>Mysqlx_stmt_disable_notices</th>
<td>Integer</td>
<td>Both</td>
</tr>
<tr>
<th>Mysqlx_stmt_drop_collection</th>
<td>Integer</td>
<td>Both</td>
</tr>
<tr>
<th>Mysqlx_stmt_drop_collection_index</th>
<td>Integer</td>
<td>Both</td>
</tr>
<tr>
<th>Mysqlx_stmt_enable_notices</th>
<td>Integer</td>
<td>Both</td>
</tr>
<tr>
<th>Mysqlx_stmt_ensure_collection</th>
<td>String</td>
<td>Both</td>
</tr>
<tr>
<th>Mysqlx_stmt_execute_mysqlx</th>
<td>Integer</td>
<td>Both</td>
</tr>
<tr>
<th>Mysqlx_stmt_execute_sql</th>
<td>Integer</td>
<td>Both</td>
</tr>
<tr>
<th>Mysqlx_stmt_execute_xplugin</th>
<td>Integer</td>
<td>Both</td>
</tr>
<tr>
<th>Mysqlx_stmt_kill_client</th>
<td>Integer</td>
<td>Both</td>
</tr>
<tr>
<th>Mysqlx_stmt_list_clients</th>
<td>Integer</td>
<td>Both</td>
</tr>
<tr>
<th>Mysqlx_stmt_list_notices</th>
<td>Integer</td>
<td>Both</td>
</tr>
<tr>
<th>Mysqlx_stmt_list_objects</th>
<td>Integer</td>
<td>Both</td>
</tr>
<tr>
<th>Mysqlx_stmt_ping</th>
<td>Integer</td>
<td>Both</td>
</tr>
<tr>
<th>Mysqlx_worker_threads</th>
<td>Integer</td>
<td>Global</td>
</tr>
<tr>
<th>Mysqlx_worker_threads_active</th>
<td>Integer</td>
<td>Global</td>
</tr>
<tr>
<th>Ndb_api_adaptive_send_deferred_count</th>
<td>Integer</td>
<td>Global</td>
</tr>
<tr>
<th>Ndb_api_adaptive_send_deferred_count_session</th>
<td>Integer</td>
<td>Global</td>
</tr>
<tr>
<th>Ndb_api_adaptive_send_deferred_count_slave</th>
<td>Integer</td>
<td>Global</td>
</tr>
<tr>
<th>Ndb_api_adaptive_send_forced_count</th>
<td>Integer</td>
<td>Global</td>
</tr>
<tr>
<th>Ndb_api_adaptive_send_forced_count_session</th>
<td>Integer</td>
<td>Global</td>
</tr>
<tr>
<th>Ndb_api_adaptive_send_forced_count_slave</th>
<td>Integer</td>
<td>Global</td>
</tr>
<tr>
<th>Ndb_api_adaptive_send_unforced_count</th>
<td>Integer</td>
<td>Global</td>
</tr>
<tr>
<th>Ndb_api_adaptive_send_unforced_count_session</th>
<td>Integer</td>
<td>Global</td>
</tr>
<tr>
<th>Ndb_api_adaptive_send_unforced_count_slave</th>
<td>Integer</td>
<td>Global</td>
</tr>
<tr>
<th>Ndb_api_bytes_received_count</th>
<td>Integer</td>
<td>Global</td>
</tr>
<tr>
<th>Ndb_api_bytes_received_count_session</th>
<td>Integer</td>
<td>Session</td>
</tr>
<tr>
<th>Ndb_api_bytes_received_count_slave</th>
<td>Integer</td>
<td>Global</td>
</tr>
<tr>
<th>Ndb_api_bytes_sent_count</th>
<td>Integer</td>
<td>Global</td>
</tr>
<tr>
<th>Ndb_api_bytes_sent_count_session</th>
<td>Integer</td>
<td>Session</td>
</tr>
<tr>
<th>Ndb_api_bytes_sent_count_slave</th>
<td>Integer</td>
<td>Global</td>
</tr>
<tr>
<th>Ndb_api_event_bytes_count</th>
<td>Integer</td>
<td>Global</td>
</tr>
<tr>
<th>Ndb_api_event_bytes_count_injector</th>
<td>Integer</td>
<td>Global</td>
</tr>
<tr>
<th>Ndb_api_event_data_count</th>
<td>Integer</td>
<td>Global</td>
</tr>
<tr>
<th>Ndb_api_event_data_count_injector</th>
<td>Integer</td>
<td>Global</td>
</tr>
<tr>
<th>Ndb_api_event_nondata_count</th>
<td>Integer</td>
<td>Global</td>
</tr>
<tr>
<th>Ndb_api_event_nondata_count_injector</th>
<td>Integer</td>
<td>Global</td>
</tr>
<tr>
<th>Ndb_api_pk_op_count</th>
<td>Integer</td>
<td>Global</td>
</tr>
<tr>
<th>Ndb_api_pk_op_count_session</th>
<td>Integer</td>
<td>Session</td>
</tr>
<tr>
<th>Ndb_api_pk_op_count_slave</th>
<td>Integer</td>
<td>Global</td>
</tr>
<tr>
<th>Ndb_api_pruned_scan_count</th>
<td>Integer</td>
<td>Global</td>
</tr>
<tr>
<th>Ndb_api_pruned_scan_count_session</th>
<td>Integer</td>
<td>Session</td>
</tr>
<tr>
<th>Ndb_api_pruned_scan_count_slave</th>
<td>Integer</td>
<td>Global</td>
</tr>
<tr>
<th>Ndb_api_range_scan_count</th>
<td>Integer</td>
<td>Global</td>
</tr>
<tr>
<th>Ndb_api_range_scan_count_session</th>
<td>Integer</td>
<td>Session</td>
</tr>
<tr>
<th>Ndb_api_range_scan_count_slave</th>
<td>Integer</td>
<td>Global</td>
</tr>
<tr>
<th>Ndb_api_read_row_count</th>
<td>Integer</td>
<td>Global</td>
</tr>
<tr>
<th>Ndb_api_read_row_count_session</th>
<td>Integer</td>
<td>Session</td>
</tr>
<tr>
<th>Ndb_api_read_row_count_slave</th>
<td>Integer</td>
<td>Global</td>
</tr>
<tr>
<th>Ndb_api_scan_batch_count</th>
<td>Integer</td>
<td>Global</td>
</tr>
<tr>
<th>Ndb_api_scan_batch_count_session</th>
<td>Integer</td>
<td>Session</td>
</tr>
<tr>
<th>Ndb_api_scan_batch_count_slave</th>
<td>Integer</td>
<td>Global</td>
</tr>
<tr>
<th>Ndb_api_table_scan_count</th>
<td>Integer</td>
<td>Global</td>
</tr>
<tr>
<th>Ndb_api_table_scan_count_session</th>
<td>Integer</td>
<td>Session</td>
</tr>
<tr>
<th>Ndb_api_table_scan_count_slave</th>
<td>Integer</td>
<td>Global</td>
</tr>
<tr>
<th>Ndb_api_trans_abort_count</th>
<td>Integer</td>
<td>Global</td>
</tr>
<tr>
<th>Ndb_api_trans_abort_count_session</th>
<td>Integer</td>
<td>Session</td>
</tr>
<tr>
<th>Ndb_api_trans_abort_count_slave</th>
<td>Integer</td>
<td>Global</td>
</tr>
<tr>
<th>Ndb_api_trans_close_count</th>
<td>Integer</td>
<td>Global</td>
</tr>
<tr>
<th>Ndb_api_trans_close_count_session</th>
<td>Integer</td>
<td>Session</td>
</tr>
<tr>
<th>Ndb_api_trans_close_count_slave</th>
<td>Integer</td>
<td>Global</td>
</tr>
<tr>
<th>Ndb_api_trans_commit_count</th>
<td>Integer</td>
<td>Global</td>
</tr>
<tr>
<th>Ndb_api_trans_commit_count_session</th>
<td>Integer</td>
<td>Session</td>
</tr>
<tr>
<th>Ndb_api_trans_commit_count_slave</th>
<td>Integer</td>
<td>Global</td>
</tr>
<tr>
<th>Ndb_api_trans_local_read_row_count</th>
<td>Integer</td>
<td>Global</td>
</tr>
<tr>
<th>Ndb_api_trans_local_read_row_count_session</th>
<td>Integer</td>
<td>Session</td>
</tr>
<tr>
<th>Ndb_api_trans_local_read_row_count_slave</th>
<td>Integer</td>
<td>Global</td>
</tr>
<tr>
<th>Ndb_api_trans_start_count</th>
<td>Integer</td>
<td>Global</td>
</tr>
<tr>
<th>Ndb_api_trans_start_count_session</th>
<td>Integer</td>
<td>Session</td>
</tr>
<tr>
<th>Ndb_api_trans_start_count_slave</th>
<td>Integer</td>
<td>Global</td>
</tr>
<tr>
<th>Ndb_api_uk_op_count</th>
<td>Integer</td>
<td>Global</td>
</tr>
<tr>
<th>Ndb_api_uk_op_count_session</th>
<td>Integer</td>
<td>Session</td>
</tr>
<tr>
<th>Ndb_api_uk_op_count_slave</th>
<td>Integer</td>
<td>Global</td>
</tr>
<tr>
<th>Ndb_api_wait_exec_complete_count</th>
<td>Integer</td>
<td>Global</td>
</tr>
<tr>
<th>Ndb_api_wait_exec_complete_count_session</th>
<td>Integer</td>
<td>Session</td>
</tr>
<tr>
<th>Ndb_api_wait_exec_complete_count_slave</th>
<td>Integer</td>
<td>Global</td>
</tr>
<tr>
<th>Ndb_api_wait_meta_request_count</th>
<td>Integer</td>
<td>Global</td>
</tr>
<tr>
<th>Ndb_api_wait_meta_request_count_session</th>
<td>Integer</td>
<td>Session</td>
</tr>
<tr>
<th>Ndb_api_wait_meta_request_count_slave</th>
<td>Integer</td>
<td>Global</td>
</tr>
<tr>
<th>Ndb_api_wait_nanos_count</th>
<td>Integer</td>
<td>Global</td>
</tr>
<tr>
<th>Ndb_api_wait_nanos_count_session</th>
<td>Integer</td>
<td>Session</td>
</tr>
<tr>
<th>Ndb_api_wait_nanos_count_slave</th>
<td>Integer</td>
<td>Global</td>
</tr>
<tr>
<th>Ndb_api_wait_scan_result_count</th>
<td>Integer</td>
<td>Global</td>
</tr>
<tr>
<th>Ndb_api_wait_scan_result_count_session</th>
<td>Integer</td>
<td>Session</td>
</tr>
<tr>
<th>Ndb_api_wait_scan_result_count_slave</th>
<td>Integer</td>
<td>Global</td>
</tr>
<tr>
<th>Ndb_cluster_node_id</th>
<td>Integer</td>
<td>Global</td>
</tr>
<tr>
<th>Ndb_config_from_host</th>
<td>Integer</td>
<td>Both</td>
</tr>
<tr>
<th>Ndb_config_from_port</th>
<td>Integer</td>
<td>Both</td>
</tr>
<tr>
<th>Ndb_conflict_fn_epoch</th>
<td>Integer</td>
<td>Global</td>
</tr>
<tr>
<th>Ndb_conflict_fn_epoch_trans</th>
<td>Integer</td>
<td>Global</td>
</tr>
<tr>
<th>Ndb_conflict_fn_epoch2</th>
<td>Integer</td>
<td>Global</td>
</tr>
<tr>
<th>Ndb_conflict_fn_epoch2_trans</th>
<td>Integer</td>
<td>Global</td>
</tr>
<tr>
<th>Ndb_conflict_fn_max</th>
<td>Integer</td>
<td>Global</td>
</tr>
<tr>
<th>Ndb_conflict_fn_max_del_win</th>
<td>Integer</td>
<td>Global</td>
</tr>
<tr>
<th>Ndb_conflict_fn_old</th>
<td>Integer</td>
<td>Global</td>
</tr>
<tr>
<th>Ndb_conflict_last_conflict_epoch</th>
<td>Integer</td>
<td>Global</td>
</tr>
<tr>
<th>Ndb_conflict_last_stable_epoch</th>
<td>Integer</td>
<td>Global</td>
</tr>
<tr>
<th>Ndb_conflict_reflected_op_discard_count</th>
<td>Integer</td>
<td>Global</td>
</tr>
<tr>
<th>Ndb_conflict_reflected_op_prepare_count</th>
<td>Integer</td>
<td>Global</td>
</tr>
<tr>
<th>Ndb_conflict_refresh_op_count</th>
<td>Integer</td>
<td>Global</td>
</tr>
<tr>
<th>Ndb_conflict_trans_conflict_commit_count</th>
<td>Integer</td>
<td>Global</td>
</tr>
<tr>
<th>Ndb_conflict_trans_detect_iter_count</th>
<td>Integer</td>
<td>Global</td>
</tr>
<tr>
<th>Ndb_conflict_trans_reject_count</th>
<td>Integer</td>
<td>Global</td>
</tr>
<tr>
<th>Ndb_conflict_trans_row_conflict_count</th>
<td>Integer</td>
<td>Global</td>
</tr>
<tr>
<th>Ndb_conflict_trans_row_reject_count</th>
<td>Integer</td>
<td>Global</td>
</tr>
<tr>
<th>Ndb_epoch_delete_delete_count</th>
<td>Integer</td>
<td>Global</td>
</tr>
<tr>
<th>Ndb_execute_count</th>
<td>Integer</td>
<td>Global</td>
</tr>
<tr>
<th>Ndb_last_commit_epoch_server</th>
<td>Integer</td>
<td>Global</td>
</tr>
<tr>
<th>Ndb_last_commit_epoch_session</th>
<td>Integer</td>
<td>Session</td>
</tr>
<tr>
<th>Ndb_cluster_node_id</th>
<td>Integer</td>
<td>Global</td>
</tr>
<tr>
<th>Ndb_number_of_data_nodes</th>
<td>Integer</td>
<td>Global</td>
</tr>
<tr>
<th>Ndb_pruned_scan_count</th>
<td>Integer</td>
<td>Global</td>
</tr>
<tr>
<th>Ndb_pushed_queries_defined</th>
<td>Integer</td>
<td>Global</td>
</tr>
<tr>
<th>Ndb_pushed_queries_dropped</th>
<td>Integer</td>
<td>Global</td>
</tr>
<tr>
<th>Ndb_pushed_queries_executed</th>
<td>Integer</td>
<td>Global</td>
</tr>
<tr>
<th>Ndb_pushed_reads</th>
<td>Integer</td>
<td>Global</td>
</tr>
<tr>
<th>Ndb_scan_count</th>
<td>Integer</td>
<td>Global</td>
</tr>
<tr>
<th>Ndb_slave_max_replicated_epoch</th>
<td>Integer</td>
<td>Global</td>
</tr>
<tr>
<th>Not_flushed_delayed_rows</th>
<td>Integer</td>
<td>Global</td>
</tr>
<tr>
<th>Ongoing_anonymous_gtid_violating_transaction_count</th>
<td>Integer</td>
<td>Global</td>
</tr>
<tr>
<th>Ongoing_anonymous_transaction_count</th>
<td>Integer</td>
<td>Global</td>
</tr>
<tr>
<th>Ongoing_automatic_gtid_violating_transaction_count</th>
<td>Integer</td>
<td>Global</td>
</tr>
<tr>
<th>Open_files</th>
<td>Integer</td>
<td>Global</td>
</tr>
<tr>
<th>Open_streams</th>
<td>Integer</td>
<td>Global</td>
</tr>
<tr>
<th>Open_table_definitions</th>
<td>Integer</td>
<td>Global</td>
</tr>
<tr>
<th>Open_tables</th>
<td>Integer</td>
<td>Both</td>
</tr>
<tr>
<th>Opened_files</th>
<td>Integer</td>
<td>Global</td>
</tr>
<tr>
<th>Opened_table_definitions</th>
<td>Integer</td>
<td>Both</td>
</tr>
<tr>
<th>Opened_tables</th>
<td>Integer</td>
<td>Both</td>
</tr>
<tr>
<th>Performance_schema_accounts_lost</th>
<td>Integer</td>
<td>Global</td>
</tr>
<tr>
<th>Performance_schema_cond_classes_lost</th>
<td>Integer</td>
<td>Global</td>
</tr>
<tr>
<th>Performance_schema_cond_instances_lost</th>
<td>Integer</td>
<td>Global</td>
</tr>
<tr>
<th>Performance_schema_digest_lost</th>
<td>Integer</td>
<td>Global</td>
</tr>
<tr>
<th>Performance_schema_file_classes_lost</th>
<td>Integer</td>
<td>Global</td>
</tr>
<tr>
<th>Performance_schema_file_handles_lost</th>
<td>Integer</td>
<td>Global</td>
</tr>
<tr>
<th>Performance_schema_file_instances_lost</th>
<td>Integer</td>
<td>Global</td>
</tr>
<tr>
<th>Performance_schema_hosts_lost</th>
<td>Integer</td>
<td>Global</td>
</tr>
<tr>
<th>Performance_schema_index_stat_lost</th>
<td>Integer</td>
<td>Global</td>
</tr>
<tr>
<th>Performance_schema_locker_lost</th>
<td>Integer</td>
<td>Global</td>
</tr>
<tr>
<th>Performance_schema_memory_classes_lost</th>
<td>Integer</td>
<td>Global</td>
</tr>
<tr>
<th>Performance_schema_metadata_lock_lost</th>
<td>Integer</td>
<td>Global</td>
</tr>
<tr>
<th>Performance_schema_mutex_classes_lost</th>
<td>Integer</td>
<td>Global</td>
</tr>
<tr>
<th>Performance_schema_mutex_instances_lost</th>
<td>Integer</td>
<td>Global</td>
</tr>
<tr>
<th>Performance_schema_nested_statement_lost</th>
<td>Integer</td>
<td>Global</td>
</tr>
<tr>
<th>Performance_schema_prepared_statements_lost</th>
<td>Integer</td>
<td>Global</td>
</tr>
<tr>
<th>Performance_schema_program_lost</th>
<td>Integer</td>
<td>Global</td>
</tr>
<tr>
<th>Performance_schema_rwlock_classes_lost</th>
<td>Integer</td>
<td>Global</td>
</tr>
<tr>
<th>Performance_schema_rwlock_instances_lost</th>
<td>Integer</td>
<td>Global</td>
</tr>
<tr>
<th>Performance_schema_session_connect_attrs_lost</th>
<td>Integer</td>
<td>Global</td>
</tr>
<tr>
<th>Performance_schema_socket_classes_lost</th>
<td>Integer</td>
<td>Global</td>
</tr>
<tr>
<th>Performance_schema_socket_instances_lost</th>
<td>Integer</td>
<td>Global</td>
</tr>
<tr>
<th>Performance_schema_stage_classes_lost</th>
<td>Integer</td>
<td>Global</td>
</tr>
<tr>
<th>Performance_schema_statement_classes_lost</th>
<td>Integer</td>
<td>Global</td>
</tr>
<tr>
<th>Performance_schema_table_handles_lost</th>
<td>Integer</td>
<td>Global</td>
</tr>
<tr>
<th>Performance_schema_table_instances_lost</th>
<td>Integer</td>
<td>Global</td>
</tr>
<tr>
<th>Performance_schema_table_lock_stat_lost</th>
<td>Integer</td>
<td>Global</td>
</tr>
<tr>
<th>Performance_schema_thread_classes_lost</th>
<td>Integer</td>
<td>Global</td>
</tr>
<tr>
<th>Performance_schema_thread_instances_lost</th>
<td>Integer</td>
<td>Global</td>
</tr>
<tr>
<th>Performance_schema_users_lost</th>
<td>Integer</td>
<td>Global</td>
</tr>
<tr>
<th>Prepared_stmt_count</th>
<td>Integer</td>
<td>Global</td>
</tr>
<tr>
<th>Qcache_free_blocks</th>
<td>Integer</td>
<td>Global</td>
</tr>
<tr>
<th>Qcache_free_memory</th>
<td>Integer</td>
<td>Global</td>
</tr>
<tr>
<th>Qcache_hits</th>
<td>Integer</td>
<td>Global</td>
</tr>
<tr>
<th>Qcache_inserts</th>
<td>Integer</td>
<td>Global</td>
</tr>
<tr>
<th>Qcache_lowmem_prunes</th>
<td>Integer</td>
<td>Global</td>
</tr>
<tr>
<th>Qcache_not_cached</th>
<td>Integer</td>
<td>Global</td>
</tr>
<tr>
<th>Qcache_queries_in_cache</th>
<td>Integer</td>
<td>Global</td>
</tr>
<tr>
<th>Qcache_total_blocks</th>
<td>Integer</td>
<td>Global</td>
</tr>
<tr>
<th>Queries</th>
<td>Integer</td>
<td>Both</td>
</tr>
<tr>
<th>Questions</th>
<td>Integer</td>
<td>Both</td>
</tr>
<tr>
<th>Rewriter_number_loaded_rules</th>
<td>Integer</td>
<td>Global</td>
</tr>
<tr>
<th>Rewriter_number_reloads</th>
<td>Integer</td>
<td>Global</td>
</tr>
<tr>
<th>Rewriter_number_rewritten_queries</th>
<td>Integer</td>
<td>Global</td>
</tr>
<tr>
<th>Rewriter_reload_error</th>
<td>Boolean</td>
<td>Global</td>
</tr>
<tr>
<th>Rpl_semi_sync_master_clients</th>
<td>Integer</td>
<td>Global</td>
</tr>
<tr>
<th>Rpl_semi_sync_master_net_avg_wait_time</th>
<td>Integer</td>
<td>Global</td>
</tr>
<tr>
<th>Rpl_semi_sync_master_net_wait_time</th>
<td>Integer</td>
<td>Global</td>
</tr>
<tr>
<th>Rpl_semi_sync_master_net_waits</th>
<td>Integer</td>
<td>Global</td>
</tr>
<tr>
<th>Rpl_semi_sync_master_no_times</th>
<td>Integer</td>
<td>Global</td>
</tr>
<tr>
<th>Rpl_semi_sync_master_no_tx</th>
<td>Integer</td>
<td>Global</td>
</tr>
<tr>
<th>Rpl_semi_sync_master_status</th>
<td>Boolean</td>
<td>Global</td>
</tr>
<tr>
<th>Rpl_semi_sync_master_timefunc_failures</th>
<td>Integer</td>
<td>Global</td>
</tr>
<tr>
<th>Rpl_semi_sync_master_tx_avg_wait_time</th>
<td>Integer</td>
<td>Global</td>
</tr>
<tr>
<th>Rpl_semi_sync_master_tx_wait_time</th>
<td>Integer</td>
<td>Global</td>
</tr>
<tr>
<th>Rpl_semi_sync_master_tx_waits</th>
<td>Integer</td>
<td>Global</td>
</tr>
<tr>
<th>Rpl_semi_sync_master_wait_pos_backtraverse</th>
<td>Integer</td>
<td>Global</td>
</tr>
<tr>
<th>Rpl_semi_sync_master_wait_sessions</th>
<td>Integer</td>
<td>Global</td>
</tr>
<tr>
<th>Rpl_semi_sync_master_yes_tx</th>
<td>Integer</td>
<td>Global</td>
</tr>
<tr>
<th>Rpl_semi_sync_slave_status</th>
<td>Boolean</td>
<td>Global</td>
</tr>
<tr>
<th>Rsa_public_key</th>
<td>String</td>
<td>Global</td>
</tr>
<tr>
<th>Select_full_join</th>
<td>Integer</td>
<td>Both</td>
</tr>
<tr>
<th>Select_full_range_join</th>
<td>Integer</td>
<td>Both</td>
</tr>
<tr>
<th>Select_range</th>
<td>Integer</td>
<td>Both</td>
</tr>
<tr>
<th>Select_range_check</th>
<td>Integer</td>
<td>Both</td>
</tr>
<tr>
<th>Select_scan</th>
<td>Integer</td>
<td>Both</td>
</tr>
<tr>
<th>Slave_heartbeat_period</th>
<td>Numeric</td>
<td>Global</td>
</tr>
<tr>
<th>Slave_last_heartbeat</th>
<td>Datetime</td>
<td>Global</td>
</tr>
<tr>
<th>Slave_open_temp_tables</th>
<td>Integer</td>
<td>Global</td>
</tr>
<tr>
<th>Slave_received_heartbeats</th>
<td>Integer</td>
<td>Global</td>
</tr>
<tr>
<th>Slave_retried_transactions</th>
<td>Integer</td>
<td>Global</td>
</tr>
<tr>
<th>Slave_rows_last_search_algorithm_used</th>
<td>String</td>
<td>Global</td>
</tr>
<tr>
<th>Slave_running</th>
<td>String</td>
<td>Global</td>
</tr>
<tr>
<th>Slow_launch_threads</th>
<td>Integer</td>
<td>Both</td>
</tr>
<tr>
<th>Slow_queries</th>
<td>Integer</td>
<td>Both</td>
</tr>
<tr>
<th>Sort_merge_passes</th>
<td>Integer</td>
<td>Both</td>
</tr>
<tr>
<th>Sort_range</th>
<td>Integer</td>
<td>Both</td>
</tr>
<tr>
<th>Sort_rows</th>
<td>Integer</td>
<td>Both</td>
</tr>
<tr>
<th>Sort_scan</th>
<td>Integer</td>
<td>Both</td>
</tr>
<tr>
<th>Ssl_accept_renegotiates</th>
<td>Integer</td>
<td>Global</td>
</tr>
<tr>
<th>Ssl_accepts</th>
<td>Integer</td>
<td>Global</td>
</tr>
<tr>
<th>Ssl_callback_cache_hits</th>
<td>Integer</td>
<td>Global</td>
</tr>
<tr>
<th>Ssl_cipher</th>
<td>String</td>
<td>Both</td>
</tr>
<tr>
<th>Ssl_cipher_list</th>
<td>String</td>
<td>Both</td>
</tr>
<tr>
<th>Ssl_client_connects</th>
<td>Integer</td>
<td>Global</td>
</tr>
<tr>
<th>Ssl_connect_renegotiates</th>
<td>Integer</td>
<td>Global</td>
</tr>
<tr>
<th>Ssl_ctx_verify_depth</th>
<td>Integer</td>
<td>Global</td>
</tr>
<tr>
<th>Ssl_ctx_verify_mode</th>
<td>Integer</td>
<td>Global</td>
</tr>
<tr>
<th>Ssl_default_timeout</th>
<td>Integer</td>
<td>Both</td>
</tr>
<tr>
<th>Ssl_finished_accepts</th>
<td>Integer</td>
<td>Global</td>
</tr>
<tr>
<th>Ssl_finished_connects</th>
<td>Integer</td>
<td>Global</td>
</tr>
<tr>
<th>Ssl_server_not_after</th>
<td>Integer</td>
<td>Both</td>
</tr>
<tr>
<th>Ssl_server_not_before</th>
<td>Integer</td>
<td>Both</td>
</tr>
<tr>
<th>Ssl_session_cache_hits</th>
<td>Integer</td>
<td>Global</td>
</tr>
<tr>
<th>Ssl_session_cache_misses</th>
<td>Integer</td>
<td>Global</td>
</tr>
<tr>
<th>Ssl_session_cache_mode</th>
<td>String</td>
<td>Global</td>
</tr>
<tr>
<th>Ssl_session_cache_overflows</th>
<td>Integer</td>
<td>Global</td>
</tr>
<tr>
<th>Ssl_session_cache_size</th>
<td>Integer</td>
<td>Global</td>
</tr>
<tr>
<th>Ssl_session_cache_timeouts</th>
<td>Integer</td>
<td>Global</td>
</tr>
<tr>
<th>Ssl_sessions_reused</th>
<td>Integer</td>
<td>Session</td>
</tr>
<tr>
<th>Ssl_used_session_cache_entries</th>
<td>Integer</td>
<td>Global</td>
</tr>
<tr>
<th>Ssl_verify_depth</th>
<td>Integer</td>
<td>Both</td>
</tr>
<tr>
<th>Ssl_verify_mode</th>
<td>Integer</td>
<td>Both</td>
</tr>
<tr>
<th>Ssl_version</th>
<td>String</td>
<td>Both</td>
</tr>
<tr>
<th>Table_locks_immediate</th>
<td>Integer</td>
<td>Global</td>
</tr>
<tr>
<th>Table_locks_waited</th>
<td>Integer</td>
<td>Global</td>
</tr>
<tr>
<th>Table_open_cache_hits</th>
<td>Integer</td>
<td>Both</td>
</tr>
<tr>
<th>Table_open_cache_misses</th>
<td>Integer</td>
<td>Both</td>
</tr>
<tr>
<th>Table_open_cache_overflows</th>
<td>Integer</td>
<td>Both</td>
</tr>
<tr>
<th>Tc_log_max_pages_used</th>
<td>Integer</td>
<td>Global</td>
</tr>
<tr>
<th>Tc_log_page_size</th>
<td>Integer</td>
<td>Global</td>
</tr>
<tr>
<th>Tc_log_page_waits</th>
<td>Integer</td>
<td>Global</td>
</tr>
<tr>
<th>Threads_cached</th>
<td>Integer</td>
<td>Global</td>
</tr>
<tr>
<th>Threads_connected</th>
<td>Integer</td>
<td>Global</td>
</tr>
<tr>
<th>Threads_created</th>
<td>Integer</td>
<td>Global</td>
</tr>
<tr>
<th>Threads_running</th>
<td>Integer</td>
<td>Global</td>
</tr>
<tr>
<th>Uptime</th>
<td>Integer</td>
<td>Global</td>
</tr>
<tr>
<th>Uptime_since_flush_status</th>
<td>Integer</td>
<td>Global</td>
</tr>
<tr>
<th>validate_password_dictionary_file_last_parsed</th>
<td>Datetime</td>
<td>Global</td>
</tr>
<tr>
<th>validate_password_dictionary_file_words_count</th>
<td>Integer</td>
<td>Global</td>
</tr>
</tbody>
</table>

### 5.1.6 Opções de comando do servidor

Quando você iniciar o servidor `mysqld`, pode especificar as opções do programa usando qualquer um dos métodos descritos na Seção 4.2.2, “Especificação de Opções do Programa”. Os métodos mais comuns são fornecer opções em um arquivo de opções ou na string de comando. No entanto, na maioria dos casos, é desejável garantir que o servidor use as mesmas opções cada vez que é executado. A melhor maneira de garantir isso é listá-las em um arquivo de opções. Veja a Seção 4.2.2.2, “Uso de Arquivos de Opções”. Essa seção também descreve o formato e a sintaxe do arquivo de opções.

`mysqld` lê opções dos grupos `[mysqld]` e `[server]`. `mysqld_safe` lê opções dos grupos `[mysqld]`, `[server]`, `[mysqld_safe]` e `[safe_mysqld]`. **mysql.server** lê opções dos grupos `[mysqld]` e `[mysql.server]`.

Um servidor MySQL embutido geralmente lê as opções dos grupos `[server]`, `[embedded]` e `[xxxxx_SERVER]`, onde *`xxxxx`* é o nome do aplicativo no qual o servidor está embutido.

`mysqld` aceita muitas opções de comando. Para um breve resumo, execute este comando:

```sql
mysqld --help
```

Para ver a lista completa, use este comando:

```sql
mysqld --verbose --help
```

Alguns dos itens da lista são, na verdade, variáveis do sistema que podem ser definidas na inicialização do servidor. Esses itens podem ser exibidos em tempo de execução usando a declaração `SHOW VARIABLES`. Alguns itens exibidos pelo comando anterior `mysqld` não aparecem na saída `SHOW VARIABLES`; isso ocorre porque são opções e não variáveis do sistema.

A lista a seguir mostra algumas das opções de servidor mais comuns. Opções adicionais são descritas em outras seções:

* Opções que afetam a segurança: Veja a Seção 6.1.4, “Opções e variáveis relacionadas à segurança do mysqld”.

* Opções relacionadas ao SSL: Veja Opções de comando para conexões criptografadas.

* Opções de controle de registro binário: Veja a Seção 5.4.4, “O Registro Binário”. * Opções relacionadas à replicação: Veja a Seção 16.1.6, “Opções e variáveis de replicação e registro binário”.

* Opções para carregar plugins, como motores de armazenamento intercambiáveis: Veja a Seção 5.5.1, “Instalando e Desinstalando Plugins”.

* Opções específicas para motores de armazenamento particulares: Veja a Seção 14.15, “Opções de inicialização do InnoDB e Variáveis do sistema” e a Seção 15.2.1, “Opções de inicialização do MyISAM”.

Algumas opções controlam o tamanho dos buffers ou caches. Para um buffer dado, o servidor pode precisar alocar estruturas de dados internas. Essas estruturas são tipicamente alocadas a partir da memória total alocada para o buffer, e a quantidade de espaço necessária pode ser dependente da plataforma. Isso significa que, quando você atribui um valor a uma opção que controla o tamanho de um buffer, a quantidade de espaço realmente disponível pode diferir do valor atribuído. Em alguns casos, a quantidade pode ser menor que o valor atribuído. Também é possível que o servidor ajuste um valor para cima. Por exemplo, se você atribuir um valor de 0 a uma opção para a qual o valor mínimo é 1024, o servidor define o valor para 1024.

Os valores para tamanhos de buffer, comprimentos e tamanhos de pilha são fornecidos em bytes, a menos que especificado de outra forma.

Algumas opções aceitam valores de nome de arquivo. A menos que especificado de outra forma, a localização padrão do arquivo é o diretório de dados se o valor for um nome de caminho relativo. Para especificar a localização explicitamente, use um nome de caminho absoluto. Suponha que o diretório de dados seja `/var/mysql/data`. Se uma opção com valor de arquivo for dada como um nome de caminho relativo, ela está localizada sob `/var/mysql/data`. Se o valor for um nome de caminho absoluto, sua localização é conforme dado pelo nome do caminho.

Você também pode definir os valores das variáveis do sistema do servidor no início do servidor usando nomes de variáveis como opções. Para atribuir um valor a uma variável do sistema do servidor, use uma opção na forma `--var_name=value`. Por exemplo, `--sort_buffer_size=384M` define a variável `sort_buffer_size` para um valor de 384 MB.

Quando você atribui um valor a uma variável, o MySQL pode corrigir automaticamente o valor para permanecer dentro de um determinado intervalo ou ajustar o valor para o valor mais próximo permitido, se apenas certos valores forem permitidos.

Para restringir o valor máximo ao qual uma variável do sistema pode ser definida em tempo de execução com a declaração `SET`, especifique esse máximo usando uma opção na forma `--maximum-var_name=value` na inicialização do servidor.

Você pode alterar os valores da maioria das variáveis do sistema no tempo de execução com a declaração `SET`. Veja a Seção 13.7.4.1, “Sintaxe SET para Atribuição de Variáveis”.

A Seção 5.1.7, “Variáveis do Sistema do Servidor”, fornece uma descrição completa para todas as variáveis e informações adicionais para defini-las na inicialização e no funcionamento do servidor. Para informações sobre a alteração de variáveis do sistema, consulte a Seção 5.1.1, “Configurando o Servidor”.

* `--help`, `-?`

  <table frame="box" rules="all" summary="Properties for help"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--help</code></td> </tr></tbody></table>

Exibir uma breve mensagem de ajuda e sair. Use as opções `--verbose` e `--help` para ver a mensagem completa.

* `--allow-suspicious-udfs`

  <table frame="box" rules="all" summary="Properties for allow-suspicious-udfs"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--allow-suspicious-udfs[={OFF|ON}]</code></td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>OFF</code></td> </tr></tbody></table>

Esta opção controla se funções carregáveis que têm apenas um símbolo `xxx` para a função principal podem ser carregadas. Por padrão, a opção está desativada e apenas funções carregáveis que têm pelo menos um símbolo auxiliar podem ser carregadas; isso previne tentativas de carregar funções de arquivos de objeto compartilhado que não contenham funções legítimas. Veja as precauções de segurança das funções carregáveis.

* `--ansi`

  <table frame="box" rules="all" summary="Properties for ansi"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--ansi</code></td> </tr></tbody></table>

Use a sintaxe SQL padrão (ANSI) em vez da sintaxe MySQL. Para um controle mais preciso sobre o modo SQL do servidor, use a opção `--sql-mode`. Veja a Seção 1.6, “Conformidade com os Padrões MySQL”, e a Seção 5.1.10, “Modos SQL do servidor”.

* `--basedir=dir_name`, `-b dir_name`

  <table frame="box" rules="all" summary="Properties for basedir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--basedir=dir_name</code></td> </tr><tr><th>System Variable</th> <td><code>basedir</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th>Type</th> <td>Directory name</td> </tr><tr><th>Default Value</th> <td><code>configuration-dependent default</code></td> </tr></tbody></table>

O caminho para o diretório de instalação do MySQL. Esta opção define a variável de sistema `basedir`.

* `--bootstrap`

  <table frame="box" rules="all" summary="Properties for bootstrap"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--bootstrap</code></td> </tr><tr><th>Deprecated</th> <td>Yes</td> </tr></tbody></table>

Essa opção é usada pelo programa **mysql_install_db** para criar as tabelas de privilégios do MySQL sem precisar iniciar um servidor MySQL completo.

Nota

**mysql_install_db** é descontinuado porque sua funcionalidade foi integrada ao servidor `mysqld`, o MySQL. Consequentemente, a opção de servidor `--bootstrap` que **mysql_install_db** passa para `mysqld` também é descontinuada. Para inicializar uma instalação do MySQL, invoque `mysqld` com a opção `--initialize` ou `--initialize-insecure`. Para mais informações, consulte a Seção 2.9.1, “Inicializando o diretório de dados”. Espera-se que **mysql_install_db** e a opção de servidor `--bootstrap` sejam removidos em uma versão futura do MySQL.

`--bootstrap` é mutuamente exclusiva com `--daemonize`, `--initialize` e `--initialize-insecure`.

Os identificadores de transação global (GTIDs) não são desativados quando o `--bootstrap` é usado. O `--bootstrap` foi usado (Bug #20980271). Veja a Seção 16.1.3, “Replicação com Identificadores de Transação Global”.

Quando o servidor opera no modo bootstap, algumas funcionalidades não estão disponíveis, o que limita as declarações permitidas em qualquer arquivo nomeado pela variável de sistema `init_file`. Para mais informações, consulte a descrição dessa variável. Além disso, a variável de sistema `disabled_storage_engines` não tem efeito.

* `--character-set-client-handshake`

  <table frame="box" rules="all" summary="Properties for character-set-client-handshake"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--character-set-client-handshake[={OFF|ON}]</code></td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>ON</code></td> </tr></tbody></table>

Não ignore as informações sobre o conjunto de caracteres enviadas pelo cliente. Para ignorar as informações do cliente e usar o conjunto de caracteres padrão do servidor, use `--skip-character-set-client-handshake`; isso faz com que o MySQL se comporte como o MySQL 4.0.

* `--chroot=dir_name`, `-r dir_name`

  <table frame="box" rules="all" summary="Properties for chroot"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--chroot=dir_name</code></td> </tr><tr><th>Type</th> <td>Directory name</td> </tr></tbody></table>

Coloque o servidor `mysqld` em um ambiente fechado durante a inicialização, usando a chamada de sistema `chroot()`. Esta é uma medida de segurança recomendada. O uso desta opção limita um pouco os `LOAD DATA` e `SELECT ... INTO OUTFILE`.

* `--console`

  <table frame="box" rules="all" summary="Properties for console"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--console</code></td> </tr><tr><th>Platform Specific</th> <td>Windows</td> </tr></tbody></table>

(Apenas para Windows.) Escreva o log de erro em `stderr` e `stdout` (o console). `mysqld` não fecha a janela do console se esta opção for usada.

`--console` tem precedência sobre `--log-error` se ambos forem fornecidos. (Em MySQL 5.5 e 5.6, isso é invertido: `--log-error` tem precedência sobre `--console` se ambos forem fornecidos.)

* `--core-file`

  <table frame="box" rules="all" summary="Properties for core-file"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--core-file</code></td> </tr></tbody></table>

Quando esta opção é usada, escreva um arquivo de núcleo se `mysqld` morrer; não são necessários (ou aceitos) argumentos. O nome e a localização do arquivo de núcleo dependem do sistema. No Linux, um arquivo de núcleo com o nome `core.pid` é escrito no diretório de trabalho atual do processo, que para `mysqld` é o diretório de dados. *`pid`* representa o ID do processo do processo do servidor. No macOS, um arquivo de núcleo com o nome `core.pid` é escrito no diretório `/cores`. No Solaris, use o comando **coreadm** para especificar onde escrever o arquivo de núcleo e como nomeá-lo.

Para alguns sistemas, para obter um arquivo de núcleo, você também deve especificar a opção `--core-file-size` para `mysqld_safe`. Veja a Seção 4.3.2, “`mysqld_safe` — Script de inicialização do MySQL Server”. Em alguns sistemas, como o Solaris, você não obtém um arquivo de núcleo se também estiver usando a opção `--user`. Pode haver restrições ou limitações adicionais. Por exemplo, pode ser necessário executar **ulimit -c unlimited** antes de iniciar o servidor. Consulte a documentação do seu sistema.

* `--daemonize`

  <table frame="box" rules="all" summary="Properties for daemonize"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--daemonize[={OFF|ON}]</code></td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>OFF</code></td> </tr></tbody></table>

Essa opção faz com que o servidor seja executado como um daemon tradicional, permitindo que ele trabalhe com sistemas operacionais que utilizam systemd para controle de processos. Para mais informações, consulte a Seção 2.5.10, “Gerenciamento do servidor MySQL com systemd”.

`--daemonize` é mutuamente exclusiva com `--bootstrap`, `--initialize` e `--initialize-insecure`.

* `--datadir=dir_name`, `-h dir_name`

  <table frame="box" rules="all" summary="Properties for allow-suspicious-udfs"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--allow-suspicious-udfs[={OFF|ON}]</code></td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>OFF</code></td> </tr></tbody></table>0

O caminho para o diretório de dados do servidor MySQL. Esta opção define a variável de sistema `datadir`. Veja a descrição dessa variável.

* `--debug[=debug_options]`, `-# [debug_options]`

  <table frame="box" rules="all" summary="Properties for allow-suspicious-udfs"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--allow-suspicious-udfs[={OFF|ON}]</code></td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>OFF</code></td> </tr></tbody></table>1

Se o MySQL estiver configurado com a opção `-DWITH_DEBUG=1` **CMake**, você pode usar essa opção para obter um arquivo de rastreamento do que o `mysqld` está fazendo. Uma string típica de *`debug_options`* é `d:t:o,file_name`. O padrão é `d:t:i:o,/tmp/mysqld.trace` no Unix e `d:t:i:O,\mysqld.trace` no Windows.

Usar `-DWITH_DEBUG=1` para configurar o MySQL com suporte de depuração permite que você use a opção `--debug="d,parser_debug"` quando você iniciar o servidor. Isso faz com que o analisador Bison que é usado para processar declarações SQL descarregue uma traçada do analisador na saída padrão de erro do servidor. Normalmente, essa saída é escrita no log de erro.

Essa opção pode ser dada várias vezes. Os valores que começam com `+` ou `-` são adicionados ou subtraídos do valor anterior. Por exemplo, `--debug=T` `--debug=+P` define o valor para `P:T`.

Para mais informações, consulte a Seção 5.8.3, “O pacote DBUG”.

* `--debug-sync-timeout[=N]`

  <table frame="box" rules="all" summary="Properties for allow-suspicious-udfs"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--allow-suspicious-udfs[={OFF|ON}]</code></td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>OFF</code></td> </tr></tbody></table>2

Controla se a facilidade de Sincronização de depuração para testes e depuração está habilitada. O uso da Sincronização de depuração requer que o MySQL seja configurado com a opção `-DWITH_DEBUG=ON` **CMake** (consulte Seção 2.8.7, “Opções de configuração de fonte do MySQL”). Se a Sincronização de depuração não for compilada, essa opção não está disponível. O valor da opção é um tempo de espera em segundos. O valor padrão é 0, que desativa a Sincronização de depuração. Para a habilitar, especifique um valor maior que 0; esse valor também se torna o tempo de espera padrão para pontos de sincronização individuais. Se a opção for fornecida sem um valor, o tempo de espera é definido para 300 segundos.

Para uma descrição da facilidade de depuração de sincronização e como usar pontos de sincronização, consulte MySQL Internals: Test Synchronization.

* `--default-time-zone=timezone`

  <table frame="box" rules="all" summary="Properties for allow-suspicious-udfs"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--allow-suspicious-udfs[={OFF|ON}]</code></td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>OFF</code></td> </tr></tbody></table>3

Defina o fuso horário do servidor padrão. Esta opção define a variável de sistema global `time_zone`. Se esta opção não for fornecida, o fuso horário padrão é o mesmo do fuso horário do sistema (dado pelo valor da variável de sistema `system_time_zone`.

A variável `system_time_zone` difere da `time_zone`. Embora possam ter o mesmo valor, a última variável é usada para inicializar o fuso horário para cada cliente que se conecta. Veja a Seção 5.1.13, “Suporte ao Fuso Horário do MySQL Server”.

* `--defaults-extra-file=file_name`

Leia este arquivo de opção após o arquivo de opção global, mas (em Unix) antes do arquivo de opção do usuário. Se o arquivo não existir ou não for acessível, ocorrerá um erro. Se *`file_name`* não for um nome de caminho absoluto, ele será interpretado em relação ao diretório atual. Isso deve ser a primeira opção na string de comando se for usada.

Para informações adicionais sobre esta e outras opções de arquivo de opções, consulte a Seção 4.2.2.3, “Opções de string de comando que afetam o tratamento de arquivo de opções”.

* `--defaults-file=file_name`

Leia apenas o arquivo de opção fornecido. Se o arquivo não existir ou não for acessível, ocorrerá um erro. Se *`file_name`* não for um nome de caminho absoluto, ele será interpretado em relação ao diretório atual.

Nota

Esta deve ser a primeira opção na string de comando, se for usada, exceto que se o servidor for iniciado com as opções `--defaults-file` e `--install` (ou `--install-manual`) `--install` (ou `--install-manual`) deve ser primeiro.

Para informações adicionais sobre esta e outras opções de arquivo de opções, consulte a Seção 4.2.2.3, “Opções de string de comando que afetam o tratamento de arquivo de opções”.

* `--defaults-group-suffix=str`

Leia não apenas os grupos de opções usuais, mas também grupos com os nomes usuais e um sufixo de *`str`*. Por exemplo, `mysqld` normalmente lê o grupo `[mysqld]`. Se esta opção for dada como `--defaults-group-suffix=_other`, `mysqld` também lê o grupo `[mysqld_other]`.

Para informações adicionais sobre esta e outras opções de arquivo de opções, consulte a Seção 4.2.2.3, “Opções de string de comando que afetam o tratamento de arquivo de opções”.

* `--des-key-file=file_name`

  <table frame="box" rules="all" summary="Properties for allow-suspicious-udfs"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--allow-suspicious-udfs[={OFF|ON}]</code></td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>OFF</code></td> </tr></tbody></table>4

Leia as chaves DES padrão deste arquivo. Essas chaves são usadas pelas funções `DES_ENCRYPT()` e `DES_DECRYPT()`.

Nota

As funções `DES_ENCRYPT()` e `DES_DECRYPT()` são descontinuadas no MySQL 5.7, removidas no MySQL 8.0 e não devem mais ser usadas. Consequentemente, `--des-key-file` também é descontinuada e é removida no MySQL 8.0.

* `--disable-partition-engine-check`

  <table frame="box" rules="all" summary="Properties for allow-suspicious-udfs"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--allow-suspicious-udfs[={OFF|ON}]</code></td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>OFF</code></td> </tr></tbody></table>5

Se deve desabilitar a verificação de inicialização para tabelas com particionamento não nativo.

A partir do MySQL 5.7.17, o manipulador de particionamento genérico no servidor MySQL é descontinuado e é removido no MySQL 8.0, quando o mecanismo de armazenamento usado para uma tabela específica é esperado para fornecer seu próprio manipulador de particionamento (“nativo”). Atualmente, apenas os mecanismos de armazenamento `InnoDB` e `NDB` fazem isso.

O uso de tabelas com particionamento não nativo resulta em um aviso `ER_WARN_DEPRECATED_SYNTAX`. No MySQL 5.7.17 a 5.7.20, o servidor realiza automaticamente uma verificação no início para identificar tabelas que usam particionamento não nativo; para quaisquer que sejam encontradas, o servidor escreve uma mensagem em seu log de erro. Para desabilitar essa verificação, use a opção `--disable-partition-engine-check`. No MySQL 5.7.21 e posterior, essa verificação *não* é realizada; nessas versões, você deve iniciar o servidor com `--disable-partition-engine-check=false`, se deseja que o servidor verifique tabelas que usam o manipulador de particionamento genérico (Bug #85830, Bug #25846957).

O uso de tabelas com particionamento não nativo resulta em um aviso `ER_WARN_DEPRECATED_SYNTAX`. Além disso, o servidor realiza uma verificação ao iniciar para identificar as tabelas que utilizam particionamento não nativo; para qualquer uma encontrada, o servidor escreve uma mensagem em seu log de erro. Para desabilitar essa verificação, use a opção `--disable-partition-engine-check`.

Para se preparar para a migração para o MySQL 8.0, qualquer tabela com particionamento não nativo deve ser alterada para usar um motor que forneça particionamento nativo, ou ser feita sem particionamento. Por exemplo, para alterar uma tabela para `InnoDB`, execute esta declaração:

  ```sql
  ALTER TABLE table_name ENGINE = INNODB;
  ```

* `--early-plugin-load=plugin_list`

  <table frame="box" rules="all" summary="Properties for allow-suspicious-udfs"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--allow-suspicious-udfs[={OFF|ON}]</code></td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>OFF</code></td> </tr></tbody></table>6

Esta opção indica ao servidor quais plugins devem ser carregados antes de carregar os plugins embutidos obrigatórios e antes da inicialização do mecanismo de armazenamento. O carregamento precoce é suportado apenas para plugins compilados com `PLUGIN_OPT_ALLOW_EARLY`. Se várias opções de `--early-plugin-load` forem fornecidas, apenas a última se aplica.

O valor da opção é uma lista separada por ponto e vírgula de valores de *`plugin_library`* e *`name`*`=`*`plugin_library`*. Cada *`plugin_library`* é o nome de um arquivo de biblioteca que contém código de plugin, e cada *`name`* é o nome de um plugin a ser carregado. Se uma biblioteca de plugin é nomeada sem qualquer nome de plugin anterior, o servidor carrega todos os plugins da biblioteca. Com um nome de plugin anterior, o servidor carrega apenas o plugin nomeado da biblioteca. O servidor procura arquivos de biblioteca de plugin no diretório nomeado pela variável de sistema `plugin_dir`.

Por exemplo, se os plugins com os nomes `myplug1` e `myplug2` estão contidos nos arquivos da biblioteca de plugins `myplug1.so` e `myplug2.so`, use esta opção para realizar um carregamento de plugin precoce:

  ```sql
  mysqld --early-plugin-load="myplug1=myplug1.so;myplug2=myplug2.so"
  ```

Os valores de argumento são rodeados por aspas porque, caso contrário, alguns interpretadores de comandos interpretam o ponto e vírgula (`;`) como um caractere especial. (Por exemplo, as escovas Unix o tratam como um terminador de comando.)

Cada plugin nomeado é carregado precocemente apenas para uma única invocação de `mysqld`. Após um reinício, o plugin não é carregado precocemente, a menos que `--early-plugin-load` seja usado novamente.

Se o servidor for iniciado usando `--initialize` ou `--initialize-insecure`, os plugins especificados por `--early-plugin-load` não são carregados.

Se o servidor for executado com `--help`, os plugins especificados por `--early-plugin-load` são carregados, mas não inicializados. Esse comportamento garante que as opções do plugin sejam exibidas na mensagem de ajuda.

A criptografia do tablespace `InnoDB` depende do Keyring MySQL para gerenciamento de chaves de criptografia, e o plugin do keyring que deve ser usado deve ser carregado antes da inicialização do mecanismo de armazenamento para facilitar a recuperação `InnoDB` para tabelas criptografadas. Por exemplo, os administradores que desejam que o plugin `keyring_file` seja carregado no início devem usar `--early-plugin-load` com o valor da opção apropriado (como `keyring_file.so` em sistemas Unix e Unix-like ou `keyring_file.dll` em Windows).

Importante

No MySQL 5.7.11, o valor padrão `--early-plugin-load` é o nome do arquivo da biblioteca de plugins `keyring_file`, fazendo com que o plugin seja carregado por padrão. No MySQL 5.7.12 e versões posteriores, o valor padrão `--early-plugin-load` é vazio; para carregar o plugin `keyring_file`, você deve especificar explicitamente a opção com um valor que nomeie o arquivo da biblioteca de plugins `keyring_file`.

Essa alteração do valor padrão do `--early-plugin-load` introduz uma incompatibilidade para a criptografia do espaço de tabelas `InnoDB` para atualizações de 5.7.11 para 5.7.12 ou superior. Os administradores que criptografaram os espaços de tabelas `InnoDB` devem tomar medidas explícitas para garantir o carregamento contínuo do plugin do chaveiro: Inicie o servidor com uma opção `--early-plugin-load` que nomeie o arquivo da biblioteca do plugin. Para informações adicionais, consulte a Seção 6.4.4.1, “Instalação do Plugin do Chaveiro”.

Para informações sobre a criptografia do espaço de tabelas `InnoDB`, consulte a Seção 14.14, “Criptografia de Dados em Repouso do InnoDB”. Para informações gerais sobre o carregamento de plugins, consulte a Seção 5.5.1, “Instalando e Desinstalando Plugins”.

* `--exit-info[=flags]`, `-T [flags]`

  <table frame="box" rules="all" summary="Properties for allow-suspicious-udfs"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--allow-suspicious-udfs[={OFF|ON}]</code></td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>OFF</code></td> </tr></tbody></table>7

Este é um bitmask de diferentes flags que você pode usar para depuração do servidor `mysqld`. Não use esta opção a menos que você saiba *exatamente* o que ela faz!

* `--external-locking`

  <table frame="box" rules="all" summary="Properties for allow-suspicious-udfs"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--allow-suspicious-udfs[={OFF|ON}]</code></td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>OFF</code></td> </tr></tbody></table>8

Ative o bloqueio externo (bloqueio do sistema), que é desativado por padrão. Se você usar essa opção em um sistema em que o `lockd` não funciona totalmente (como o Linux), é fácil para o `mysqld` entrar em um impasse.

Para desabilitar o bloqueio externo explicitamente, use `--skip-external-locking`.

O bloqueio externo afeta apenas o acesso à tabela `MyISAM`. Para mais informações, incluindo as condições em que ele pode e não pode ser usado, consulte a Seção 8.11.5, “Bloqueio Externo”.

* `--flush`

  <table frame="box" rules="all" summary="Properties for allow-suspicious-udfs"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--allow-suspicious-udfs[={OFF|ON}]</code></td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>OFF</code></td> </tr></tbody></table>9

Limpe (sincione) todas as alterações no disco após cada declaração SQL. Normalmente, o MySQL realiza uma escrita de todas as alterações no disco apenas após cada declaração SQL e permite que o sistema operacional gere a sincronização com o disco. Veja a Seção B.3.3.3, “O que fazer se o MySQL continuar a falhar”.

Nota

Se `--flush` for especificado, o valor de `flush_time` não importa e as alterações em `flush_time` não afetam o comportamento de limpeza.

* `--gdb`

  <table frame="box" rules="all" summary="Properties for ansi"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--ansi</code></td> </tr></tbody></table>0

Instale um manipulador de interrupção para `SIGINT` (necessário para parar `mysqld` com `^C` para definir pontos de interrupção) e desative o rastreamento de pilha e o gerenciamento de arquivos de núcleo. Veja a Seção 5.8.1.4, “Depuração do mysqld sob o gdb”.

* `--ignore-db-dir=dir_name`

  <table frame="box" rules="all" summary="Properties for ansi"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--ansi</code></td> </tr></tbody></table>1

Esta opção indica ao servidor que ignore o nome do diretório dado para fins da declaração `SHOW DATABASES` ou das tabelas `INFORMATION_SCHEMA`. Por exemplo, se uma configuração MySQL localizar o diretório de dados na raiz de um sistema de arquivos no Unix, o sistema pode criar um diretório `lost+found` lá que o servidor deve ignorar. Começar o servidor com `--ignore-db-dir=lost+found` faz com que esse nome não seja listado como uma base de dados.

Para especificar mais de um nome, use esta opção várias vezes, uma vez para cada nome. Especificar a opção com um valor vazio (ou seja, como `--ignore-db-dir=`) redefinirá a lista de diretórios para a lista vazia.

As instâncias desta opção fornecidas na inicialização do servidor são usadas para definir a variável de sistema `ignore_db_dirs`.

Essa opção é desatualizada no MySQL 5.7. Com a introdução do dicionário de dados no MySQL 8.0, ela se tornou superfciosa e foi removida naquela versão.

* `--initialize`

  <table frame="box" rules="all" summary="Properties for ansi"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--ansi</code></td> </tr></tbody></table>2

Esta opção é usada para inicializar uma instalação do MySQL, criando o diretório de dados e preenchendo as tabelas no banco de dados do sistema `mysql`. Para mais informações, consulte a Seção 2.9.1, “Inicializando o diretório de dados”.

Essa opção limita os efeitos de, ou não é compatível com, uma série de outras opções de inicialização para o servidor MySQL. Algumas das questões mais comuns desse tipo são mencionadas aqui:

+ Recomendamos fortemente, ao inicializar o diretório de dados com `--initialize`, que você não especifique outras opções além de `--datadir`, outras opções usadas para definir locais de diretório, como `--basedir`, e possivelmente `--user`, se necessário. As opções para o servidor MySQL em execução podem ser especificadas ao iniciá-lo uma vez que a inicialização tenha sido concluída e `mysqld` tenha sido desligado. Isso também se aplica ao uso de `--initialize-insecure` em vez de `--initialize`.

+ Quando o servidor é iniciado com `--initialize`, algumas funcionalidades não estão disponíveis, o que limita as declarações permitidas em qualquer arquivo nomeado pela variável de sistema `init_file`. Para mais informações, consulte a descrição dessa variável. Além disso, a variável de sistema `disabled_storage_engines` não tem efeito.

+ A opção `--ndbcluster` é ignorada quando usada em conjunto com `--initialize`.

+ `--initialize` é mutuamente exclusiva com `--bootstrap` e `--daemonize`.

Os itens da lista anterior também se aplicam ao inicializar o servidor usando a opção `--initialize-insecure`.

* `--initialize-insecure`

  <table frame="box" rules="all" summary="Properties for ansi"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--ansi</code></td> </tr></tbody></table>3

Esta opção é usada para inicializar uma instalação do MySQL, criando o diretório de dados e preenchendo as tabelas no banco de dados do sistema `mysql`. Esta opção implica em `--initialize`, e as mesmas restrições e limitações se aplicam; para mais informações, consulte a descrição dessa opção e a Seção 2.9.1, “Inicializando o Diretório de Dados”.

Aviso

Essa opção cria um usuário MySQL `root` com uma senha vazia, o que é inseguro. Por esse motivo, não a use em produção sem definir essa senha manualmente. Consulte a seção Configuração da senha do root após a inicialização para obter informações sobre como fazer isso.

* `--innodb-xxx`

Defina uma opção para o mecanismo de armazenamento `InnoDB`. As opções do `InnoDB` estão listadas na Seção 14.15, “Opções de inicialização do InnoDB e variáveis do sistema”.

* `--install [service_name]`

  <table frame="box" rules="all" summary="Properties for ansi"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--ansi</code></td> </tr></tbody></table>4

(Apenas para Windows) Instale o servidor como um serviço do Windows que é iniciado automaticamente durante o início do Windows. O nome do serviço padrão é `MySQL` se não for fornecido o valor *`service_name`*. Para mais informações, consulte a Seção 2.3.4.8, “Iniciar o MySQL como um serviço do Windows”.

Nota

Se o servidor for iniciado com as opções `--defaults-file` e `--install`, o `--install` deve ser executado primeiro.

* `--install-manual [service_name]`

  <table frame="box" rules="all" summary="Properties for ansi"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--ansi</code></td> </tr></tbody></table>5

(Apenas para Windows) Instale o servidor como um serviço do Windows que deve ser iniciado manualmente. Ele não é iniciado automaticamente durante o início do Windows. O nome do serviço padrão é `MySQL` se não for fornecido o valor *`service_name`*. Para mais informações, consulte a Seção 2.3.4.8, “Iniciar o MySQL como um serviço do Windows”.

Nota

Se o servidor for iniciado com as opções `--defaults-file` e `--install-manual`, o `--install-manual` deve ser o primeiro.

* `--language=lang_name, -L lang_name`

  <table frame="box" rules="all" summary="Properties for ansi"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--ansi</code></td> </tr></tbody></table>6

A linguagem a ser usada para mensagens de erro. *`lang_name`* pode ser fornecida como o nome da linguagem ou como o nome completo do caminho para o diretório onde os arquivos de linguagem estão instalados. Veja a Seção 10.12, “Definindo a linguagem da mensagem de erro”.

`--lc-messages-dir` e `--lc-messages` devem ser usados em vez de `--language`, que é descontinuado (e tratado como sinônimo de `--lc-messages-dir`). Você deve esperar que a opção `--language` seja removida em uma versão futura do MySQL.

* `--large-pages`

  <table frame="box" rules="all" summary="Properties for ansi"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--ansi</code></td> </tr></tbody></table>7

Algumas arquiteturas de hardware/sistema operacional suportam páginas de memória maiores do que o padrão (geralmente 4 KB). A implementação real deste suporte depende do hardware e do sistema operacional subjacente. Aplicativos que realizam muitos acessos de memória podem obter melhorias de desempenho ao usar páginas grandes devido à redução de erros no Buffer de Busca de Tradução (TLB).

O MySQL suporta a implementação do Linux para suporte a páginas grandes (que é chamado de HugeTLB no Linux). Veja a Seção 8.12.4.3, “Habilitar suporte a páginas grandes”. Para suporte de páginas grandes no Solaris, consulte a descrição da opção `--super-large-pages`.

`--large-pages` é desativado por padrão.

* `--lc-messages=locale_name`

  <table frame="box" rules="all" summary="Properties for ansi"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--ansi</code></td> </tr></tbody></table>8

O local a ser usado para mensagens de erro. O padrão é `en_US`. O servidor converte o argumento em um nome de idioma e o combina com o valor de `--lc-messages-dir` para produzir a localização do arquivo de mensagem de erro. Veja a Seção 10.12, “Definindo o idioma da mensagem de erro”.

* `--lc-messages-dir=dir_name`

  <table frame="box" rules="all" summary="Properties for ansi"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--ansi</code></td> </tr></tbody></table>9

O diretório onde as mensagens de erro estão localizadas. O servidor usa o valor juntamente com o valor de `--lc-messages` para produzir a localização do arquivo de mensagem de erro. Veja a Seção 10.12, “Definindo o idioma da mensagem de erro”.

* `--local-service`

  <table frame="box" rules="all" summary="Properties for basedir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--basedir=dir_name</code></td> </tr><tr><th>System Variable</th> <td><code>basedir</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th>Type</th> <td>Directory name</td> </tr><tr><th>Default Value</th> <td><code>configuration-dependent default</code></td> </tr></tbody></table>0

(Apenas para Windows) Uma opção `--local-service` após o nome do serviço faz com que o servidor seja executado usando a conta `LocalService` do Windows que tem privilégios limitados no sistema. Se os `--defaults-file` e `--local-service` forem fornecidos após o nome do serviço, eles podem ser em qualquer ordem. Veja a Seção 2.3.4.8, “Iniciando o MySQL como um Serviço do Windows”.

* `--log-error[=file_name]`

  <table frame="box" rules="all" summary="Properties for basedir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--basedir=dir_name</code></td> </tr><tr><th>System Variable</th> <td><code>basedir</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th>Type</th> <td>Directory name</td> </tr><tr><th>Default Value</th> <td><code>configuration-dependent default</code></td> </tr></tbody></table>1

Escreva o log de erro e as mensagens de inicialização neste arquivo. Veja a Seção 5.4.2, “O Log de Erro”.

Se a opção não especificar nenhum arquivo, o nome do arquivo de registro de erro em sistemas Unix e Unix-like é `host_name.err` no diretório de dados. O nome do arquivo em sistemas Windows é o mesmo, a menos que a opção `--pid-file` seja especificada. Nesse caso, o nome do arquivo é o nome de base do arquivo PID com um sufixo de `.err` no diretório de dados.

Se a opção nomear um arquivo, o arquivo de registro de erro terá esse nome (com o sufixo `.err` adicionado, se o nome não tiver sufixo), localizado sob o diretório de dados, a menos que um nome de caminho absoluto seja fornecido para especificar um local diferente.

Em Windows, `--console` tem precedência sobre `--log-error` se ambos forem fornecidos. Neste caso, o servidor escreve o log de erro no console em vez de em um arquivo. (Em MySQL 5.5 e 5.6, isso é invertido: `--log-error` tem precedência sobre `--console` se ambos forem fornecidos.)

* `--log-isam[=file_name]`

  <table frame="box" rules="all" summary="Properties for basedir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--basedir=dir_name</code></td> </tr><tr><th>System Variable</th> <td><code>basedir</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th>Type</th> <td>Directory name</td> </tr><tr><th>Default Value</th> <td><code>configuration-dependent default</code></td> </tr></tbody></table>2

Registre todas as alterações de `MyISAM` neste arquivo (usado apenas durante a depuração de `MyISAM`).

* `--log-raw`

  <table frame="box" rules="all" summary="Properties for basedir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--basedir=dir_name</code></td> </tr><tr><th>System Variable</th> <td><code>basedir</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th>Type</th> <td>Directory name</td> </tr><tr><th>Default Value</th> <td><code>configuration-dependent default</code></td> </tr></tbody></table>3

As senhas em determinadas declarações escritas no log de consulta geral, no log de consultas lentas e no log binário são reescritas pelo servidor para não ocorrerem literalmente em texto simples. A reescrita de senhas pode ser suprimida para o log de consulta geral, iniciando o servidor com a opção `--log-raw`. Esta opção pode ser útil para fins de diagnóstico, para ver o texto exato das declarações recebidas pelo servidor, mas, por razões de segurança, não é recomendada para uso em produção.

Se um plugin de reescrita de consulta estiver instalado, a opção `--log-raw` afeta o registro de declarações da seguinte forma:

+ Sem `--log-raw`, o servidor registra a declaração devolvida pelo plugin de reescrita de consulta. Isso pode diferir da declaração recebida.

+ Com `--log-raw`, o servidor registra a declaração original como recebida.

Para mais informações, consulte a Seção 6.1.2.3, “Senhas e Registro”.

* `--log-short-format`

  <table frame="box" rules="all" summary="Properties for basedir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--basedir=dir_name</code></td> </tr><tr><th>System Variable</th> <td><code>basedir</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th>Type</th> <td>Directory name</td> </tr><tr><th>Default Value</th> <td><code>configuration-dependent default</code></td> </tr></tbody></table>4

Registre menos informações no registro de consultas lentas, se ele tiver sido ativado.

* `--log-tc=file_name`

  <table frame="box" rules="all" summary="Properties for basedir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--basedir=dir_name</code></td> </tr><tr><th>System Variable</th> <td><code>basedir</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th>Type</th> <td>Directory name</td> </tr><tr><th>Default Value</th> <td><code>configuration-dependent default</code></td> </tr></tbody></table>5

O nome do arquivo de registro do coordenador de transação mapeado à memória (para transações XA que afetam múltiplos motores de armazenamento quando o log binário é desativado). O nome padrão é `tc.log`. O arquivo é criado sob o diretório de dados, se não for fornecido como um nome de caminho completo. Esta opção não é usada.

* `--log-tc-size=size`

  <table frame="box" rules="all" summary="Properties for basedir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--basedir=dir_name</code></td> </tr><tr><th>System Variable</th> <td><code>basedir</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th>Type</th> <td>Directory name</td> </tr><tr><th>Default Value</th> <td><code>configuration-dependent default</code></td> </tr></tbody></table>6

O tamanho em bytes do log do coordenador de transação mapeado à memória. Os valores padrão e mínimos são 6 vezes o tamanho da página, e o valor deve ser um múltiplo do tamanho da página. (Antes do MySQL 5.7.21, o tamanho padrão é de 24 KB.)

* `--log-warnings[=level]`, `-W [level]`

  <table frame="box" rules="all" summary="Properties for basedir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--basedir=dir_name</code></td> </tr><tr><th>System Variable</th> <td><code>basedir</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th>Type</th> <td>Directory name</td> </tr><tr><th>Default Value</th> <td><code>configuration-dependent default</code></td> </tr></tbody></table>7

Nota

A variável de sistema `log_error_verbosity` é preferida e deve ser usada em vez da opção `--log-warnings` ou da variável de sistema `log_warnings`. Para mais informações, consulte as descrições de `log_error_verbosity` e `log_warnings`. A opção de string de comando `--log-warnings` e a variável de sistema `log_warnings` são desatualizadas; espere que elas sejam removidas em uma versão futura do MySQL.

Se deve produzir mensagens de alerta adicionais no log de erro. Esta opção é ativada por padrão. Para desativá-la, use `--log-warnings=0`. Especificar a opção sem um valor de *`level`* incrementa o valor atual em 1. Os logs do servidor registram mensagens sobre declarações que são inseguras para o registro baseado em declarações se o valor for maior que 0. Conexões aborridas e erros de acesso negado para novas tentativas de conexão são registrados se o valor for maior que 1. Veja a Seção B.3.2.9, “Erros de Comunicação e Conexões Abortadas”.

* `--memlock`

  <table frame="box" rules="all" summary="Properties for basedir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--basedir=dir_name</code></td> </tr><tr><th>System Variable</th> <td><code>basedir</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th>Type</th> <td>Directory name</td> </tr><tr><th>Default Value</th> <td><code>configuration-dependent default</code></td> </tr></tbody></table>8

Bloqueie o processo `mysqld` na memória. Esta opção pode ajudar se você tiver um problema em que o sistema operacional está fazendo com que o `mysqld` troque para o disco.

`--memlock` funciona em sistemas que suportam a chamada de sistema `mlockall()`; isso inclui Solaris, a maioria das distribuições Linux que usam um kernel 2.4 ou superior e, talvez, outros sistemas Unix. Em sistemas Linux, você pode determinar se o `mlockall()` (e, portanto, esta opção) é suportado ou não, verificando se ele está definido no arquivo do sistema `mman.h`, da seguinte forma:

  ```sql
  $> grep mlockall /usr/include/sys/mman.h
  ```

Se o `mlockall()` for suportado, você deve ver na saída do comando anterior algo como o seguinte:

  ```sql
  extern int mlockall (int __flags) __THROW;
  ```

Importante

O uso desta opção pode exigir que você execute o servidor como `root`, o que, por razões de segurança, normalmente não é uma boa ideia. Veja a Seção 6.1.5, “Como executar o MySQL como um usuário normal”.

Em Linux e, possivelmente, em outros sistemas, você pode evitar a necessidade de executar o servidor como `root` ao alterar o arquivo `limits.conf`. Consulte as notas sobre o limite de memlock na Seção 8.12.4.3, “Habilitar suporte a página grande”.

Você não deve usar essa opção em um sistema que não suporte a chamada de sistema `mlockall()`; se você fizer isso, `mysqld` é muito provável que saia assim que você tentar iniciá-lo.

* `--myisam-block-size=N`

  <table frame="box" rules="all" summary="Properties for basedir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--basedir=dir_name</code></td> </tr><tr><th>System Variable</th> <td><code>basedir</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th>Type</th> <td>Directory name</td> </tr><tr><th>Default Value</th> <td><code>configuration-dependent default</code></td> </tr></tbody></table>9

O tamanho do bloco a ser utilizado para as páginas do índice `MyISAM`.

* `--no-defaults`

Não leia nenhum arquivo de opções. Se o início do programa falhar devido à leitura de opções desconhecidas de um arquivo de opções, `--no-defaults` pode ser usado para evitar que sejam lidas. Isso deve ser a primeira opção na string de comando se for usado.

Para informações adicionais sobre esta e outras opções de arquivo de opções, consulte a Seção 4.2.2.3, “Opções de string de comando que afetam o tratamento de arquivo de opções”.

* `--old-style-user-limits`

  <table frame="box" rules="all" summary="Properties for bootstrap"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--bootstrap</code></td> </tr><tr><th>Deprecated</th> <td>Yes</td> </tr></tbody></table>0

Ative os limites de recursos de usuário de estilo antigo. (Antes do MySQL 5.0.3, os limites de recursos das contas eram contados separadamente para cada host do qual um usuário se conecta, em vez de por string de conta na tabela `user`. Veja a Seção 6.2.16, “Definindo Limites de Recursos de Conta”.

* `--partition[=value]`

  <table frame="box" rules="all" summary="Properties for bootstrap"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--bootstrap</code></td> </tr><tr><th>Deprecated</th> <td>Yes</td> </tr></tbody></table>1

Habilita ou desabilita o suporte à partição definida pelo usuário no MySQL Server.

Essa opção é desatualizada no MySQL 5.7.16 e foi removida do MySQL 8.0, pois, no MySQL 8.0, o mecanismo de particionamento é substituído por particionamento nativo, que não pode ser desativado.

* `--performance-schema-xxx`

Configure uma opção do Schema de desempenho. Para obter detalhes, consulte a Seção 25.14, “Opções de comando do Schema de desempenho”.

* `--plugin-load=plugin_list`

  <table frame="box" rules="all" summary="Properties for bootstrap"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--bootstrap</code></td> </tr><tr><th>Deprecated</th> <td>Yes</td> </tr></tbody></table>2

Esta opção indica ao servidor que carregue os plugins nomeados no início. Se forem fornecidas várias opções `--plugin-load`, apenas a última se aplica. Plugins adicionais para carregar podem ser especificados usando opções `--plugin-load-add`.

O valor da opção é uma lista separada por ponto e vírgula de valores de *`plugin_library`*, *`name`*, *`=`* e *`plugin_library`*. Cada *`plugin_library`* é o nome de um arquivo de biblioteca que contém código de plugin, e cada *`name`* é o nome de um plugin a ser carregado. Se uma biblioteca de plugin for nomeada sem qualquer nome de plugin anterior, o servidor carrega todos os plugins da biblioteca. Com um nome de plugin anterior, o servidor carrega apenas o plugin nomeado da biblioteca. O servidor procura arquivos de biblioteca de plugin no diretório nomeado pela variável de sistema `plugin_dir`.

Por exemplo, se os plugins com os nomes `myplug1` e `myplug2` estão contidos nos arquivos da biblioteca de plugins `myplug1.so` e `myplug2.so`, use esta opção para realizar um carregamento de plugin precoce:

  ```sql
  mysqld --plugin-load="myplug1=myplug1.so;myplug2=myplug2.so"
  ```

Os valores de argumento são rodeados por aspas porque, caso contrário, alguns interpretadores de comandos interpretam o ponto e vírgula (`;`) como um caractere especial. (Por exemplo, as escovas Unix o tratam como um terminador de comando.)

Cada plugin nomeado é carregado apenas para uma única invocação de `mysqld`. Após um reinício, o plugin não é carregado a menos que `--plugin-load` seja usado novamente. Isso é em contraste com `INSTALL PLUGIN`, que adiciona uma entrada à tabela `mysql.plugins` para fazer com que o plugin seja carregado em todas as inicializações normais do servidor.

Durante a sequência normal de inicialização, o servidor determina quais plugins devem ser carregados lendo a tabela do sistema `mysql.plugins`. Se o servidor for iniciado com a opção `--skip-grant-tables`, os plugins registrados na tabela `mysql.plugins` não são carregados e não estão disponíveis. `--plugin-load` permite que plugins sejam carregados mesmo quando `--skip-grant-tables` é fornecido. `--plugin-load` também permite que plugins sejam carregados na inicialização que não podem ser carregados em tempo de execução.

Esta opção não define uma variável de sistema correspondente. A saída de `SHOW PLUGINS` fornece informações sobre os plugins carregados. Informações mais detalhadas podem ser encontradas na tabela do Esquema de Informações `PLUGINS`. Veja a Seção 5.5.2, “Obtenção de Informações sobre Plugins do Servidor”.

Para obter informações adicionais sobre o carregamento de plugins, consulte a Seção 5.5.1, “Instalando e Desinstalando Plugins”.

* `--plugin-load-add=plugin_list`

  <table frame="box" rules="all" summary="Properties for bootstrap"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--bootstrap</code></td> </tr><tr><th>Deprecated</th> <td>Yes</td> </tr></tbody></table>3

Esta opção complementa a opção `--plugin-load`. `--plugin-load-add` adiciona um plugin ou plugins ao conjunto de plugins a serem carregados no início. O formato do argumento é o mesmo que para `--plugin-load`. `--plugin-load-add` pode ser usado para evitar especificar um grande conjunto de plugins como um único argumento longo e complicado `--plugin-load`.

`--plugin-load-add` pode ser dado na ausência de `--plugin-load`, mas qualquer instância de `--plugin-load-add` que apareça antes de `--plugin-load` não tem efeito porque `--plugin-load` redefiniu o conjunto de plugins a serem carregados. Em outras palavras, essas opções:

  ```sql
  --plugin-load=x --plugin-load-add=y
  ```

são equivalentes a esta opção:

  ```sql
  --plugin-load="x;y"
  ```

Mas essas opções:

  ```sql
  --plugin-load-add=y --plugin-load=x
  ```

são equivalentes a esta opção:

  ```sql
  --plugin-load=x
  ```

Esta opção não define uma variável de sistema correspondente. A saída de `SHOW PLUGINS` fornece informações sobre os plugins carregados. Informações mais detalhadas podem ser encontradas na tabela do Esquema de Informações `PLUGINS`. Veja a Seção 5.5.2, “Obtenção de Informações sobre Plugins do Servidor”.

Para obter informações adicionais sobre o carregamento de plugins, consulte a Seção 5.5.1, “Instalando e Desinstalando Plugins”.

* `--plugin-xxx`

Especifica uma opção que se refere a um plugin de servidor. Por exemplo, muitos motores de armazenamento podem ser construídos como plugins, e para esses motores, as opções para eles podem ser especificadas com o prefixo `--plugin`. Assim, a opção `--innodb-file-per-table` para `InnoDB` pode ser especificada como `--plugin-innodb-file-per-table`.

Para opções booleanas que podem ser ativadas ou desativadas, o prefixo `--skip` e outros formatos alternativos são suportados também (consulte a Seção 4.2.2.4, “Modificadores de Opção do Programa”). Por exemplo, `--skip-plugin-innodb-file-per-table` desativa `innodb-file-per-table`.

A justificativa para o prefixo `--plugin` é que ele permite especificar opções de plugin de forma inequívoca, caso haja um conflito de nome com uma opção de servidor embutida. Por exemplo, se um escritor de plugin designasse um plugin como “sql” e implementasse uma opção “modo”, o nome da opção poderia ser `--sql-mode`, o que entraria em conflito com a opção embutida do mesmo nome. Nesses casos, as referências ao nome em conflito são resolvidas em favor da opção embutida. Para evitar a ambiguidade, os usuários podem especificar a opção de plugin como `--plugin-sql-mode`. O uso do prefixo `--plugin` para opções de plugin é recomendado para evitar qualquer questão de ambiguidade.

* `--port=port_num`, `-P port_num`

  <table frame="box" rules="all" summary="Properties for bootstrap"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--bootstrap</code></td> </tr><tr><th>Deprecated</th> <td>Yes</td> </tr></tbody></table>4

O número do porto a ser usado ao ouvir conexões TCP/IP. Em sistemas Unix e similares, o número do porto deve ser 1024 ou superior, a menos que o servidor seja iniciado pelo usuário do sistema operacional `root`. Definir esta opção para 0 faz com que o valor padrão seja usado.

* `--port-open-timeout=num`

  <table frame="box" rules="all" summary="Properties for bootstrap"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--bootstrap</code></td> </tr><tr><th>Deprecated</th> <td>Yes</td> </tr></tbody></table>5

Em alguns sistemas, quando o servidor é parado, a porta TCP/IP pode não ficar disponível imediatamente. Se o servidor for reiniciado rapidamente depois disso, sua tentativa de reabrir a porta pode falhar. Esta opção indica quantos segundos o servidor deve esperar para que a porta TCP/IP fique livre, se não puder ser aberta. O padrão é não esperar.

* `--print-defaults`

Imprima o nome do programa e todas as opções que ele obtém a partir de arquivos de opção. Os valores da senha são mascarados. Isso deve ser a primeira opção na string de comando, se for usada, exceto que ela pode ser usada imediatamente após `--defaults-file` ou `--defaults-extra-file`.

Para informações adicionais sobre esta e outras opções de arquivo de opções, consulte a Seção 4.2.2.3, “Opções de string de comando que afetam o tratamento de arquivo de opções”.

* `--remove [service_name]`

  <table frame="box" rules="all" summary="Properties for bootstrap"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--bootstrap</code></td> </tr><tr><th>Deprecated</th> <td>Yes</td> </tr></tbody></table>6

(Apenas para Windows) Remova um serviço MySQL no Windows. O nome padrão do serviço é `MySQL` se não for fornecido um valor de *`service_name`*. Para mais informações, consulte a Seção 2.3.4.8, “Iniciar o MySQL como um serviço do Windows”.

* `--safe-user-create`

  <table frame="box" rules="all" summary="Properties for bootstrap"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--bootstrap</code></td> </tr><tr><th>Deprecated</th> <td>Yes</td> </tr></tbody></table>7

Se essa opção estiver habilitada, um usuário não pode criar novos usuários MySQL usando a declaração `GRANT` a menos que o usuário tenha o privilégio `INSERT` para a tabela do sistema `mysql.user` ou qualquer coluna na tabela. Se você deseja que um usuário tenha a capacidade de criar novos usuários que tenham os privilégios que o usuário tem o direito de conceder, você deve conceder ao usuário o seguinte privilégio:

  ```sql
  GRANT INSERT(user) ON mysql.user TO 'user_name'@'host_name';
  ```

Isso garante que o usuário não possa alterar diretamente quaisquer colunas de privilégio, mas tem que usar a declaração `GRANT` para conceder privilégios a outros usuários.

* `--skip-grant-tables`

  <table frame="box" rules="all" summary="Properties for bootstrap"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--bootstrap</code></td> </tr><tr><th>Deprecated</th> <td>Yes</td> </tr></tbody></table>8

Esta opção afeta a sequência de inicialização do servidor:

+ `--skip-grant-tables` faz com que o servidor não leia as tabelas de concessão no banco de dados do sistema `mysql`, e, portanto, comece sem usar o sistema de privilégios. Isso dá a qualquer pessoa com acesso ao servidor * acesso ilimitado a todas as bases de dados*.

Para fazer com que um servidor iniciado com `--skip-grant-tables` carregue as tabelas de concessão no tempo de execução, realize uma operação de limpeza de privilégios, que pode ser feita das seguintes maneiras:

- Emita uma declaração MySQL `FLUSH PRIVILEGES` após se conectar ao servidor.

- Execute o comando **mysqladmin flush-privileges** ou **mysqladmin reload** a partir da string de comando.

O esvaziamento de privilégios também pode ocorrer implicitamente como resultado de outras ações realizadas após a inicialização, causando assim que o servidor comece a usar as tabelas de concessão. Por exemplo, `mysqld_upgrade` esvazia os privilégios durante o procedimento de atualização.

+ `--skip-grant-tables` faz com que o servidor não carregue certos outros objetos registrados no banco de dados do sistema `mysql`:

- Plugins instalados usando `INSTALL PLUGIN` e registrados na tabela do sistema `mysql.plugin`.

Para fazer com que os plugins sejam carregados mesmo quando se usa `--skip-grant-tables`, use a opção `--plugin-load` ou `--plugin-load-add`.

- Eventos agendados instalados usando `CREATE EVENT` e registrados na tabela do sistema `mysql.event`.

- Funções carregáveis instaladas usando `CREATE FUNCTION` e registradas na tabela do sistema `mysql.func`.

+ `--skip-grant-tables` faz com que a variável de sistema `disabled_storage_engines` não tenha efeito.

* `--skip-host-cache`

  <table frame="box" rules="all" summary="Properties for bootstrap"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--bootstrap</code></td> </tr><tr><th>Deprecated</th> <td>Yes</td> </tr></tbody></table>9

Desative o uso do cache de host interno para uma resolução mais rápida de nomes para IP. Com o cache desativado, o servidor realiza uma pesquisa DNS toda vez que um cliente se conecta.

O uso do `--skip-host-cache` é semelhante ao definir a variável de sistema `host_cache_size` para 0, mas o `host_cache_size` é mais flexível, pois também pode ser usado para redimensionar, habilitar ou desabilitar o cache do host em tempo de execução, não apenas na inicialização do servidor.

Iniciar o servidor com `--skip-host-cache` não impede alterações no valor de `host_cache_size` durante a execução, mas tais alterações não têm efeito e o cache não é reativado, mesmo se `host_cache_size` for definido como maior que 0.

Para mais informações sobre como o cache do host funciona, consulte a Seção 5.1.11.2, “Consultas DNS e o cache do host”.

* `--skip-innodb`

Desative o motor de armazenamento `InnoDB`. Neste caso, como o motor de armazenamento padrão é `InnoDB`, o servidor não pode ser iniciado, a menos que você também use `--default-storage-engine` e `--default-tmp-storage-engine` para definir o padrão para algum outro motor tanto para as tabelas permanentes quanto para as `TEMPORARY`.

O motor de armazenamento `InnoDB` não pode ser desativado, e a opção `--skip-innodb` é desatualizada e não tem efeito. Seu uso resulta em um aviso. Espere que essa opção seja removida em uma versão futura do MySQL.

* `--skip-new`

  <table frame="box" rules="all" summary="Properties for character-set-client-handshake"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--character-set-client-handshake[={OFF|ON}]</code></td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>ON</code></td> </tr></tbody></table>0

Essa opção desativa (o que costumava ser considerado) comportamentos novos, possivelmente inseguros. Isso resulta nesses ajustes: `delay_key_write=OFF`, `concurrent_insert=NEVER`, `automatic_sp_privileges=OFF`. Também faz com que `OPTIMIZE TABLE` seja mapeado para `ALTER TABLE` para motores de armazenamento para os quais `OPTIMIZE TABLE` não é suportado.

* `--skip-partition`

  <table frame="box" rules="all" summary="Properties for character-set-client-handshake"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--character-set-client-handshake[={OFF|ON}]</code></td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>ON</code></td> </tr></tbody></table>1

Desabilita a partição definida pelo usuário. As tabelas particionadas podem ser visualizadas usando `SHOW TABLES` ou consultando a tabela do Esquema de Informações `TABLES`, mas não podem ser criadas ou modificadas, nem os dados nessas tabelas podem ser acessados. Todas as colunas específicas de partição na tabela do Esquema de Informações `PARTITIONS` exibem `NULL`.

Como o arquivo de definição de tabela `DROP TABLE` remove os arquivos de definição de tabela (`.frm`), esta declaração funciona em tabelas particionadas, mesmo quando a opção de desativação de particionamento está habilitada. No entanto, a declaração não remove as definições de particionamento associadas a tabelas particionadas nesses casos. Por essa razão, você deve evitar a remoção de tabelas particionadas com a desativação de particionamento, ou tomar medidas para remover manualmente os arquivos `.par` órfãos (se presentes).

Nota

Em MySQL 5.7, os arquivos de definição de partição (`.par`) não são mais criados para tabelas `InnoDB` particionadas. Em vez disso, as definições de partição são armazenadas no dicionário de dados interno `InnoDB`. Os arquivos de definição de partição (`.par`) continuam a ser usados para tabelas `MyISAM` particionadas.

Essa opção é desatualizada no MySQL 5.7.16 e foi removida do MySQL 8.0, pois, no MySQL 8.0, o mecanismo de particionamento é substituído por particionamento nativo, que não pode ser desativado.

* `--skip-show-database`

  <table frame="box" rules="all" summary="Properties for character-set-client-handshake"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--character-set-client-handshake[={OFF|ON}]</code></td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>ON</code></td> </tr></tbody></table>2

Essa opção define a variável de sistema `skip_show_database`, que controla quem é permitido usar a declaração `SHOW DATABASES`. Veja a Seção 5.1.7, “Variáveis do sistema do servidor”.

* `--skip-stack-trace`

  <table frame="box" rules="all" summary="Properties for character-set-client-handshake"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--character-set-client-handshake[={OFF|ON}]</code></td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>ON</code></td> </tr></tbody></table>3

Não escreva traços de pilha. Esta opção é útil quando você está executando `mysqld` sob um depurador. Em alguns sistemas, você também deve usar esta opção para obter um arquivo de núcleo. Veja a Seção 5.8, “Depuração do MySQL”.

* `--slow-start-timeout=timeout`

  <table frame="box" rules="all" summary="Properties for character-set-client-handshake"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--character-set-client-handshake[={OFF|ON}]</code></td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>ON</code></td> </tr></tbody></table>4

Esta opção controla o tempo de espera do gerenciador de controle de serviço do Windows. O valor é o número máximo de milissegundos que o gerenciador de controle de serviço espera antes de tentar matar o serviço do Windows durante o arranque. O valor padrão é 15000 (15 segundos). Se o serviço MySQL demorar muito para iniciar, você pode precisar aumentar esse valor. Um valor de 0 significa que não há tempo de espera.

* `--socket=path`

  <table frame="box" rules="all" summary="Properties for character-set-client-handshake"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--character-set-client-handshake[={OFF|ON}]</code></td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>ON</code></td> </tr></tbody></table>5

Em Unix, esta opção especifica o arquivo de socket Unix a ser usado ao ouvir conexões locais. O valor padrão é `/tmp/mysql.sock`. Se esta opção for fornecida, o servidor cria o arquivo no diretório de dados, a menos que um nome de caminho absoluto seja fornecido para especificar um diretório diferente. Em Windows, a opção especifica o nome do pipe a ser usado ao ouvir conexões locais que usam um pipe nomeado. O valor padrão é `MySQL` (não sensível ao caso).

* `--sql-mode=value[,value[,value...]]`(server-options.html#option_mysqld_sql-mode)

  <table frame="box" rules="all" summary="Properties for character-set-client-handshake"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--character-set-client-handshake[={OFF|ON}]</code></td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>ON</code></td> </tr></tbody></table>6

Defina o modo SQL. Consulte a Seção 5.1.10, “Modos SQL do servidor”.

Nota

Os programas de instalação do MySQL podem configurar o modo SQL durante o processo de instalação. Se o modo SQL for diferente do padrão ou do que você espera, verifique se há uma configuração em um arquivo de opção que o servidor lê no início.

* `--ssl`, `--skip-ssl`

  <table frame="box" rules="all" summary="Properties for character-set-client-handshake"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--character-set-client-handshake[={OFF|ON}]</code></td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>ON</code></td> </tr></tbody></table>7

A opção `--ssl` especifica que o servidor permite, mas não exige conexões criptografadas. Esta opção é ativada por padrão.

`--ssl` pode ser especificado na forma negada como `--skip-ssl` ou um sinônimo (`--ssl=OFF`, `--disable-ssl`). Neste caso, a opção especifica que o servidor *não* permite conexões encriptadas, independentemente das configurações das variáveis de sistema `tls_xxx` e `ssl_xxx`.

Para obter mais informações sobre como configurar se o servidor permite que os clientes se conectem usando SSL e indicar onde encontrar as chaves e certificados SSL, consulte a Seção 6.3.1, “Configurando o MySQL para usar conexões criptografadas”, que também descreve as capacidades do servidor para autogeração e autodescoberta de arquivos de certificado e chave. Considere definir pelo menos as variáveis de sistema `ssl_cert` e `ssl_key` no lado do servidor e a opção `--ssl-ca` (ou `--ssl-capath`) no lado do cliente.

* `--standalone`

  <table frame="box" rules="all" summary="Properties for character-set-client-handshake"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--character-set-client-handshake[={OFF|ON}]</code></td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>ON</code></td> </tr></tbody></table>8

Disponível apenas no Windows; instrui o servidor MySQL a não ser executado como um serviço.

* `--super-large-pages`

  <table frame="box" rules="all" summary="Properties for character-set-client-handshake"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--character-set-client-handshake[={OFF|ON}]</code></td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>ON</code></td> </tr></tbody></table>9

O uso padrão de páginas grandes no MySQL tenta usar o tamanho maior suportado, até 4 MB. Sob o Solaris, um recurso de "páginas super grandes" permite o uso de páginas de até 256 MB. Este recurso está disponível para plataformas SPARC recentes. Ele pode ser habilitado ou desabilitado usando a opção `--super-large-pages` ou `--skip-super-large-pages`.

* `--symbolic-links`, `--skip-symbolic-links`

  <table frame="box" rules="all" summary="Properties for chroot"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--chroot=dir_name</code></td> </tr><tr><th>Type</th> <td>Directory name</td> </tr></tbody></table>0

Ative ou desative o suporte a links simbólicos. Em Unix, ativar links simbólicos significa que você pode vincular um arquivo de índice `MyISAM` ou um arquivo de dados a outro diretório com a opção `INDEX DIRECTORY` ou `DATA DIRECTORY` da declaração `CREATE TABLE`. Se você excluir ou renomear a tabela, os arquivos a que seus links simbólicos apontam também serão excluídos ou renomeados. Veja a Seção 8.12.3.2, “Usando Links Simbólicos para Tabelas MyISAM em Unix”.

Esta opção não tem significado no Windows.

* `--sysdate-is-now`

  <table frame="box" rules="all" summary="Properties for chroot"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--chroot=dir_name</code></td> </tr><tr><th>Type</th> <td>Directory name</td> </tr></tbody></table>1

`SYSDATE()` por padrão retorna o momento em que é executado, e não o momento em que a declaração na qual ocorre começa a ser executada. Isso difere do comportamento de `NOW()`. Esta opção faz com que `SYSDATE()` seja sinônimo de `NOW()`. Para informações sobre as implicações para o registro binário e a replicação, consulte a descrição para `SYSDATE()` na Seção 12.7, “Funções de Data e Hora” e para `SET TIMESTAMP` na Seção 5.1.7, “Variáveis do Sistema do Servidor”.

* `--tc-heuristic-recover={COMMIT|ROLLBACK}`

  <table frame="box" rules="all" summary="Properties for chroot"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--chroot=dir_name</code></td> </tr><tr><th>Type</th> <td>Directory name</td> </tr></tbody></table>2

A decisão de usar uma recuperação heurística manual.

Se uma opção `--tc-heuristic-recover` for especificada, o servidor sai, independentemente de a recuperação heurística manual ter sucesso.

Em sistemas com mais de um mecanismo de armazenamento capaz de commit de duas fases, a opção `ROLLBACK` não é segura e faz com que a recuperação seja interrompida com o seguinte erro:

  ```sql
  [ERROR] --tc-heuristic-recover rollback
  strategy is not safe on systems with more than one 2-phase-commit-capable
  storage engine. Aborting crash recovery.
  ```

* `--temp-pool`

  <table frame="box" rules="all" summary="Properties for chroot"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--chroot=dir_name</code></td> </tr><tr><th>Type</th> <td>Directory name</td> </tr></tbody></table>3

Essa opção é ignorada, exceto no Linux. No Linux, ela faz com que a maioria dos arquivos temporários criados pelo servidor use um pequeno conjunto de nomes, em vez de um nome único para cada novo arquivo. Isso resolve um problema no kernel do Linux relacionado à criação de muitos novos arquivos com nomes diferentes. Com o comportamento antigo, o Linux parece estar "viciado" de memória, porque está sendo alocado na cache de entrada de diretório, em vez de na cache do disco.

A partir do MySQL 5.7.18, essa opção é desatualizada e foi removida no MySQL 8.0.

* `--transaction-isolation=level`

  <table frame="box" rules="all" summary="Properties for chroot"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--chroot=dir_name</code></td> </tr><tr><th>Type</th> <td>Directory name</td> </tr></tbody></table>4

Define o nível de isolamento de transação padrão. O valor `level` pode ser `READ-UNCOMMITTED`, `READ-COMMITTED`, `REPEATABLE-READ` ou `SERIALIZABLE`. Veja a Seção 13.3.6, “Instrução SET TRANSACTION”.

O nível de isolamento de transação padrão também pode ser definido em tempo de execução usando a declaração `SET TRANSACTION` ou definindo a variável de sistema `tx_isolation` (ou, a partir do MySQL 5.7.20, `transaction_isolation`).

* `--transaction-read-only`

  <table frame="box" rules="all" summary="Properties for chroot"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--chroot=dir_name</code></td> </tr><tr><th>Type</th> <td>Directory name</td> </tr></tbody></table>5

Define o modo de acesso à transação padrão. Por padrão, o modo somente leitura é desativado, portanto, o modo é leitura/escrita.

Para definir o modo de acesso de transação padrão no tempo de execução, use a declaração `SET TRANSACTION` ou defina a variável de sistema `tx_read_only` (ou, a partir do MySQL 5.7.20, `transaction_read_only`). Veja a Seção 13.3.6, “Declaração SET TRANSACTION”.

* `--tmpdir=dir_name`, `-t dir_name`

  <table frame="box" rules="all" summary="Properties for chroot"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--chroot=dir_name</code></td> </tr><tr><th>Type</th> <td>Directory name</td> </tr></tbody></table>6

O caminho do diretório a ser usado para criar arquivos temporários. Isso pode ser útil se o diretório padrão `/tmp` estiver em uma partição que é pequena o suficiente para conter tabelas temporárias. Esta opção aceita vários caminhos que são usados de forma rotativa. Os caminhos devem ser separados por colchetes (`:`) em Unix e por pontos e vírgulas (`;`) em Windows.

`--tmpdir` pode ser um local não permanente, como um diretório em um sistema de arquivos baseado em memória ou um diretório que é limpo quando o host do servidor é reiniciado. Se o servidor MySQL estiver atuando como uma replica, e você estiver usando um local não permanente para `--tmpdir`, considere definir um diretório temporário diferente para a replica usando a variável de sistema `slave_load_tmpdir`. Para uma replica de replicação, os arquivos temporários usados para replicar as declarações de `LOAD DATA` são armazenados neste diretório, portanto, com um local permanente, eles podem sobreviver a reinicializações de máquina, embora a replicação agora possa continuar após um reinício se os arquivos temporários tiverem sido removidos.

Para mais informações sobre o local de armazenamento de arquivos temporários, consulte a Seção B.3.3.5, “Onde o MySQL armazena arquivos temporários”.

* `--user={user_name|user_id}`, `-u {user_name|user_id}`

  <table frame="box" rules="all" summary="Properties for chroot"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--chroot=dir_name</code></td> </tr><tr><th>Type</th> <td>Directory name</td> </tr></tbody></table>7

Execute o servidor `mysqld` como o usuário com o nome *`user_name`* ou o ID de usuário numérico *`user_id`*. (“Usuário” neste contexto se refere a uma conta de login do sistema, não a um usuário MySQL listado nas tabelas de concessão.)

Esta opção é *obrigatória* ao iniciar `mysqld` como `root`. O servidor muda seu ID de usuário durante sua sequência de inicialização, fazendo com que ele seja executado como aquele usuário em particular, em vez de como `root`. Veja a Seção 6.1.1, “Diretrizes de Segurança”.

Para evitar uma possível lacuna de segurança onde um usuário adiciona uma opção `--user=root` a um arquivo `my.cnf` (causando assim o servidor a rodar como `root`, `mysqld` usa apenas a primeira opção `--user` especificada e produz um aviso se houver várias opções `--user`. As opções em `/etc/my.cnf` e `$MYSQL_HOME/my.cnf` são processadas antes das opções de string de comando, portanto, é recomendável que você coloque uma opção `--user` em `/etc/my.cnf` e especifique um valor diferente de `root`. A opção em `/etc/my.cnf` é encontrada antes de qualquer outra opção `--user`, o que garante que o servidor execute como um usuário diferente de `root`, e que um aviso resulte se qualquer outra opção `--user` for encontrada.

* `--validate-user-plugins[={OFF|ON}]`

  <table frame="box" rules="all" summary="Properties for chroot"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--chroot=dir_name</code></td> </tr><tr><th>Type</th> <td>Directory name</td> </tr></tbody></table>8

Se essa opção estiver habilitada (o padrão), o servidor verifica cada conta de usuário e produz um aviso se forem encontradas condições que tornariam a conta inutilizável:

+ A conta requer um plugin de autenticação que não está carregado.

+ A conta requer o plugin de autenticação `sha256_password`, mas o servidor foi iniciado sem SSL ou RSA habilitados, conforme exigido por este plugin.

Ativação de `--validate-user-plugins` desacelera a inicialização do servidor e `FLUSH PRIVILEGES`. Se você não precisa da verificação adicional, pode desativar essa opção na inicialização para evitar a redução do desempenho.

* `--verbose`, `-v`

Use esta opção com a opção `--help` para obter ajuda detalhada.

* `--version`, `-V`

Exibir informações da versão e sair.

### 5.1.7 Variáveis do sistema do servidor

O servidor MySQL mantém muitas variáveis de sistema que afetam sua operação. A maioria das variáveis de sistema pode ser definida na inicialização do servidor usando opções na string de comando ou em um arquivo de opções. A maioria delas pode ser alterada dinamicamente durante a execução usando a declaração `SET`, que permite modificar a operação do servidor sem precisar parar e reiniciar. Algumas variáveis são somente leitura, e seus valores são determinados pelo ambiente do sistema, pela forma como o MySQL está instalado no sistema ou, possivelmente, pelas opções usadas para compilar o MySQL. A maioria das variáveis de sistema tem um valor padrão, mas há exceções, incluindo variáveis somente leitura. Você também pode usar os valores das variáveis de sistema em expressões.

Durante a execução, definir o valor de uma variável de sistema global requer o privilégio `SUPER`. Definir o valor de uma variável de sistema de sessão normalmente não requer privilégios especiais e pode ser feito por qualquer usuário, embora haja exceções. Para mais informações, consulte a Seção 5.1.8.1, “Privilégios de Variáveis de Sistema”.

Existem várias maneiras de ver os nomes e os valores das variáveis do sistema:

* Para ver os valores que um servidor usa com base em seus padrões compilados e quaisquer arquivos de opção que ele lê, use este comando:

  ```sql
  mysqld --verbose --help
  ```

* Para ver os valores que um servidor usa com base apenas em seus padrões compilados, ignorando as configurações em quaisquer arquivos de opção, use este comando:

  ```sql
  mysqld --no-defaults --verbose --help
  ```

* Para ver os valores atuais utilizados por um servidor em execução, use a declaração `SHOW VARIABLES` ou as tabelas de variáveis do sistema do Performance Schema. Veja a Seção 25.12.13, “Tabelas de variáveis do sistema do Performance Schema”.

Esta seção fornece uma descrição de cada variável do sistema. Para uma tabela de resumo das variáveis do sistema, consulte a Seção 5.1.4, “Referência de variáveis do sistema do servidor”. Para mais informações sobre manipulação de variáveis do sistema, consulte a Seção 5.1.8, “Usando variáveis do sistema”.

Para informações adicionais sobre variáveis do sistema, consulte essas seções:

* A seção 5.1.8, “Usando variáveis do sistema”, discute a sintaxe para definir e exibir os valores das variáveis do sistema.

* A seção 5.1.8.2, “Variáveis dinâmicas do sistema”, lista as variáveis que podem ser definidas em tempo de execução.

* Informações sobre as variáveis do sistema de ajuste podem ser encontradas na Seção 5.1.1, “Configurando o servidor”.

* A seção 14.15, “Opções de inicialização do InnoDB e variáveis do sistema”, lista as variáveis do sistema `InnoDB`.

* A seção 21.4.3.9.2, “Variáveis do Sistema de Aglomerado NDB”, lista as variáveis do sistema que são específicas para o NDB Cluster.

* Para informações sobre as variáveis do sistema do servidor específicas para replicação, consulte a Seção 16.1.6, “Opções e variáveis de replicação e registro binário”.

Nota

Algumas das seguintes descrições de variáveis referem-se a “ativar” ou “desativar” uma variável. Essas variáveis podem ser ativadas com a declaração `SET` definindo-as como `ON` ou `1`, ou desativadas definindo-as como `OFF` ou `0`. As variáveis booleanas podem ser definidas no início com os valores `ON`, `TRUE`, `OFF` e `FALSE` (não sensível ao caso), bem como `1` e `0`. Ver Seção 4.2.2.4, “Modificadores de Opção do Programa”.

Algumas variáveis do sistema controlam o tamanho dos buffers ou caches. Para um buffer dado, o servidor pode precisar alocar estruturas de dados internas. Essas estruturas são tipicamente alocadas a partir da memória total alocada para o buffer, e a quantidade de espaço necessária pode ser dependente da plataforma. Isso significa que, quando você atribui um valor a uma variável que controla o tamanho de um buffer, a quantidade de espaço realmente disponível pode diferir do valor atribuído. Em alguns casos, a quantidade pode ser menor que o valor atribuído. Também é possível que o servidor ajuste um valor para cima. Por exemplo, se você atribuir um valor de 0 a uma variável para a qual o valor mínimo é 1024, o servidor define o valor para 1024.

Os valores para tamanhos de buffer, comprimentos e tamanhos de pilha são fornecidos em bytes, a menos que especificado de outra forma.

Nota

Algumas descrições de variáveis do sistema incluem um tamanho de bloco, no caso, um valor que não é um múltiplo inteiro do tamanho de bloco declarado é arredondado para o próximo múltiplo inferior do tamanho de bloco antes de ser armazenado pelo servidor, ou seja, `FLOOR(value)` `* block_size`.

*Exemplo*: Suponha que o tamanho do bloco para uma variável dada seja dado como 4096, e você defina o valor da variável para 100000 (a gente assume que o valor máximo da variável é maior que esse número). Como 100000 / 4096 = 24,4140625, o servidor automaticamente reduz o valor para 98304 (24 * 4096) antes de armazená-lo.

Em alguns casos, o máximo declarado para uma variável é o máximo permitido pelo analisador MySQL, mas não é um múltiplo exato do tamanho do bloco. Nesses casos, o máximo efetivo é o próximo múltiplo menor do tamanho do bloco.

*Exemplo*: O valor máximo de uma variável do sistema é mostrado como 4294967295 (232-1), e seu tamanho de bloco é de 1024. 4294967295 / 1024 = 4194303,9990234375, então, se você definir essa variável para seu valor máximo declarado, o valor realmente armazenado é 4194303 * 1024 = 4294966272.

Algumas variáveis do sistema aceitam valores de nome de arquivo. A menos que especificado de outra forma, a localização padrão do arquivo é o diretório de dados se o valor for um nome de caminho relativo. Para especificar a localização explicitamente, use um nome de caminho absoluto. Suponha que o diretório de dados seja `/var/mysql/data`. Se uma variável com valor de arquivo for dada como um nome de caminho relativo, ela está localizada sob `/var/mysql/data`. Se o valor for um nome de caminho absoluto, sua localização é conforme dado pelo nome do caminho.

* `authentication_windows_log_level`

  <table frame="box" rules="all" summary="Properties for authentication_windows_log_level"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--authentication-windows-log-level=#</code></td> </tr><tr><th>System Variable</th> <td><code>authentication_windows_log_level</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>2</code></td> </tr><tr><th>Minimum Value</th> <td><code>0</code></td> </tr><tr><th>Maximum Value</th> <td><code>4</code></td> </tr></tbody></table>

Essa variável está disponível apenas se o plugin de autenticação Windows `authentication_windows` estiver habilitado e o código de depuração estiver habilitado. Veja a Seção 6.4.1.8, “Autenticação Pluggable Windows”.

Essa variável define o nível de registro para o plugin de autenticação do Windows. O quadro a seguir mostra os valores permitidos.

  <table summary="Permitted values for the authentication_windows system variable."><col style="width: 10%"/><col style="width: 75%"/><thead><tr> <th>Value</th> <th>Descrição</th> </tr></thead><tbody><tr> <td>0</td> <td>Sem registro</td> </tr><tr> <td>1</td> <td>Registre apenas mensagens de erro</td> </tr><tr> <td>2</td> <td>Mensagens de nível 1 de log e mensagens de alerta</td> </tr><tr> <td>3</td> <td>Mensagens de nível 2 de log e notas de informação</td> </tr><tr> <td>4</td> <td>Mensagens de nível 3 de log e mensagens de depuração</td> </tr></tbody></table>

* `authentication_windows_use_principal_name`

  <table frame="box" rules="all" summary="Properties for authentication_windows_use_principal_name"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--authentication-windows-use-principal-name[={OFF|ON}]</code></td> </tr><tr><th>System Variable</th> <td><code>authentication_windows_use_principal_name</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>ON</code></td> </tr></tbody></table>

Essa variável está disponível apenas se o plugin de autenticação `authentication_windows` do Windows estiver habilitado. Veja a Seção 6.4.1.8, “Autenticação Pluggable do Windows”.

Um cliente que se autentica usando a função `InitSecurityContext()` deve fornecer uma string que identifica o serviço ao qual ele se conecta (*`targetName`*). O MySQL usa o nome principal (UPN) da conta sob a qual o servidor está em execução. O UPN tem a forma `user_id@computer_name` e não precisa ser registrado em nenhum lugar para ser usado. Esse UPN é enviado pelo servidor no início do aperto de mão de autenticação.

Essa variável controla se o servidor envia o UPN no desafio inicial. Por padrão, a variável está habilitada. Por razões de segurança, ela pode ser desabilitada para evitar enviar o nome da conta do servidor a um cliente como texto claro. Se a variável for desabilitada, o servidor sempre envia um byte `0x00` no primeiro desafio, o cliente não especifica *`targetName`*, e, como resultado, a autenticação NTLM é usada.

Se o servidor não conseguir obter seu UPN (o que ocorre principalmente em ambientes que não suportam autenticação Kerberos), o UPN não é enviado pelo servidor e a autenticação NTLM é usada.

* `autocommit`

  <table frame="box" rules="all" summary="Properties for autocommit"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--autocommit[={OFF|ON}]</code></td> </tr><tr><th>System Variable</th> <td><code>autocommit</code></td> </tr><tr><th>Scope</th> <td>Global, Session</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>ON</code></td> </tr></tbody></table>

O modo de autocommit. Se definido como 1, todas as alterações em uma tabela entram em vigor imediatamente. Se definido como 0, você deve usar `COMMIT` para aceitar uma transação ou `ROLLBACK` para cancelá-la. Se `autocommit` é 0 e você o altera para 1, o MySQL realiza um `COMMIT` automático de qualquer transação aberta. Outra maneira de iniciar uma transação é usar uma declaração `START TRANSACTION` ou `BEGIN`. Veja a Seção 13.3.1, “Declarações START TRANSACTION, COMMIT e ROLLBACK”.

Por padrão, as conexões dos clientes começam com `autocommit` definido como 1. Para fazer com que os clientes comecem com um valor padrão de 0, defina o valor global `autocommit` iniciando o servidor com a opção `--autocommit=0`. Para definir a variável usando um arquivo de opção, inclua essas strings:

  ```sql
  [mysqld]
  autocommit=0
  ```

* `automatic_sp_privileges`

  <table frame="box" rules="all" summary="Properties for automatic_sp_privileges"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--automatic-sp-privileges[={OFF|ON}]</code></td> </tr><tr><th>System Variable</th> <td><code>automatic_sp_privileges</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>ON</code></td> </tr></tbody></table>

Quando essa variável tiver o valor 1 (padrão), o servidor concede automaticamente os privilégios `EXECUTE` e `ALTER ROUTINE` ao criador de uma rotina armazenada, se o usuário não puder executar e alterar ou descartar a rotina. (O privilégio `ALTER ROUTINE` é necessário para descartar a rotina. O servidor também descarta automaticamente esses privilégios do criador quando a rotina é descartada. Se `automatic_sp_privileges` for 0, o servidor não adiciona ou descarta automaticamente esses privilégios.

O criador de uma rotina é a conta usada para executar a declaração `CREATE` para ela. Isso pode não ser a mesma conta nomeada como `DEFINER` na definição da rotina.

Se você começar `mysqld` com `--skip-new`, `automatic_sp_privileges` é definido como `OFF`.

Veja também a Seção 23.2.2, “Rotinas Armazenadas e Privilégios do MySQL”.

* `auto_generate_certs`

  <table frame="box" rules="all" summary="Properties for auto_generate_certs"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--auto-generate-certs[={OFF|ON}]</code></td> </tr><tr><th>System Variable</th> <td><code>auto_generate_certs</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>ON</code></td> </tr></tbody></table>

Essa variável está disponível se o servidor foi compilado usando o OpenSSL (consulte a Seção 6.3.4, "Capacidades dependentes da biblioteca SSL"). Ela controla se o servidor autogerará arquivos de chave e certificado SSL no diretório de dados, se eles ainda não existirem.

Ao iniciar, o servidor gera automaticamente os arquivos de certificado e chave SSL do lado do servidor e do lado do cliente no diretório de dados se a variável de sistema `auto_generate_certs` estiver habilitada, não forem especificadas outras opções SSL além de `--ssl`, e os arquivos SSL do lado do servidor não estiverem ausentes no diretório de dados. Esses arquivos permitem conexões seguras do cliente usando SSL; veja Seção 6.3.1, “Configurando o MySQL para usar conexões criptografadas”.

Para mais informações sobre a autogeração de arquivos SSL, incluindo nomes e características dos arquivos, consulte a Seção 6.3.3.1, “Criando certificados e chaves SSL e RSA usando MySQL”.

A variável de sistema `sha256_password_auto_generate_rsa_keys` está relacionada, mas controla a autogeração de arquivos de par de chave RSA necessários para a troca segura de senhas usando RSA em conexões não encriptadas.

* `avoid_temporal_upgrade`

  <table frame="box" rules="all" summary="Properties for avoid_temporal_upgrade"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--avoid-temporal-upgrade[={OFF|ON}]</code></td> </tr><tr><th>Deprecated</th> <td>Yes</td> </tr><tr><th>System Variable</th> <td><code>avoid_temporal_upgrade</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>OFF</code></td> </tr></tbody></table>

Essa variável controla se `ALTER TABLE` atualiza implicitamente as colunas temporais encontradas no formato pré-5.6.4 (as colunas `TIME`, `DATETIME` e `TIMESTAMP` sem suporte para precisão de frações de segundo). A atualização dessas colunas requer uma reconstrução da tabela, o que impede qualquer uso de alterações rápidas que possam ser aplicadas de outra forma à operação a ser realizada.

Essa variável é desativada por padrão. Ativa-la faz com que `ALTER TABLE` não reconstrua as colunas temporais e, assim, possa aproveitar possíveis alterações rápidas.

Essa variável é desatualizada; espere que ela seja removida em uma versão futura do MySQL.

* `back_log`

  <table frame="box" rules="all" summary="Properties for back_log"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--back-log=#</code></td> </tr><tr><th>System Variable</th> <td><code>back_log</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Valor padrão</th> <td><code>-1</code>(significa autodimensionamento; não atribua este valor literal)</td> </tr><tr><th>Minimum Value</th> <td><code>1</code></td> </tr><tr><th>Maximum Value</th> <td><code>65535</code></td> </tr></tbody></table>

O número de solicitações de conexão pendentes que o MySQL pode ter. Isso entra em jogo quando o principal thread do MySQL recebe muitas solicitações de conexão em um curto período de tempo. Em seguida, leva algum tempo (embora muito pouco) para o principal thread verificar a conexão e iniciar um novo thread. O valor `back_log` indica quantos pedidos podem ser empilhados durante esse curto período de tempo antes de o MySQL parar momentaneamente de responder a novos pedidos. Você precisa aumentar isso apenas se espera um grande número de conexões em um curto período de tempo.

Em outras palavras, esse valor é o tamanho da fila de espera para conexões TCP/IP recebidas. Seu sistema operacional tem seu próprio limite para o tamanho dessa fila. A página manual da chamada de sistema Unix `listen()` deve ter mais detalhes. Verifique a documentação do seu sistema operacional para o valor máximo para essa variável. `back_log` não pode ser definido como maior que o limite do seu sistema operacional.

O valor padrão é baseado na seguinte fórmula, limitada a um limite de 900:

  ```sql
  50 + (max_connections / 5)
  ```

* `basedir`

  <table frame="box" rules="all" summary="Properties for basedir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--basedir=dir_name</code></td> </tr><tr><th>System Variable</th> <td><code>basedir</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th>Type</th> <td>Directory name</td> </tr><tr><th>Default Value</th> <td><code>configuration-dependent default</code></td> </tr></tbody></table>

O caminho para o diretório de base de instalação do MySQL.

* `big_tables`

  <table frame="box" rules="all" summary="Properties for big_tables"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--big-tables[={OFF|ON}]</code></td> </tr><tr><th>System Variable</th> <td><code>big_tables</code></td> </tr><tr><th>Scope</th> <td>Global, Session</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>OFF</code></td> </tr></tbody></table>

Se habilitada, o servidor armazena todas as tabelas temporárias no disco em vez de na memória. Isso previne a maioria dos erros `The table tbl_name is full` para operações `SELECT` que exigem uma grande tabela temporária, mas também desacelera as consultas para as quais tabelas de memória seriam suficientes.

O valor padrão para novas conexões é `OFF` (use tabelas temporárias de memória). Normalmente, nunca é necessário habilitar essa variável, porque o servidor é capaz de lidar com grandes conjuntos de resultados automaticamente, usando memória para tabelas temporárias pequenas e alternando para tabelas baseadas em disco conforme necessário.

* `bind_address`

  <table summary="Permitted values for the authentication_windows system variable."><col style="width: 10%"/><col style="width: 75%"/><thead><tr> <th>Value</th> <th>Descrição</th> </tr></thead><tbody><tr> <td>0</td> <td>Sem registro</td> </tr><tr> <td>1</td> <td>Registre apenas mensagens de erro</td> </tr><tr> <td>2</td> <td>Mensagens de nível 1 de log e mensagens de alerta</td> </tr><tr> <td>3</td> <td>Mensagens de nível 2 de log e notas de informação</td> </tr><tr> <td>4</td> <td>Mensagens de nível 3 de log e mensagens de depuração</td> </tr></tbody></table>0

O servidor MySQL escuta em um único soquete de rede para conexões TCP/IP. Esse soquete está vinculado a um único endereço, mas é possível que um endereço mapeie em múltiplas interfaces de rede. Para especificar um endereço, defina `bind_address=addr` no início do servidor, onde *`addr`* é um endereço IPv4 ou IPv6 ou um nome de host. Se *`addr`* for um nome de host, o servidor resolve o nome em um endereço IP e se vincula a esse endereço. Se um nome de host resolver em múltiplos endereços IP, o servidor usa o primeiro endereço IPv4, se houver algum, ou o primeiro endereço IPv6, caso contrário.

O servidor trata diferentes tipos de endereços da seguinte forma:

+ Se o endereço for `*`, o servidor aceita conexões TCP/IP em todas as interfaces IPv4 do host do servidor e, se o host do servidor suportar IPv6, em todas as interfaces IPv6. Use este endereço para permitir conexões tanto IPv4 quanto IPv6 em todas as interfaces do servidor. Este valor é o padrão.

+ Se o endereço for `0.0.0.0`, o servidor aceita conexões TCP/IP em todas as interfaces IPv4 do host do servidor.

+ Se o endereço for `::`, o servidor aceita conexões TCP/IP em todas as interfaces de IPv4 e IPv6 do host do servidor.

+ Se o endereço for um endereço mapeado IPv4, o servidor aceita conexões TCP/IP para esse endereço, no formato IPv4 ou IPv6. Por exemplo, se o servidor estiver vinculado a `::ffff:127.0.0.1`, os clientes podem se conectar usando `--host=127.0.0.1` ou `--host=::ffff:127.0.0.1`.

+ Se o endereço for um endereço IPv4 ou IPv6 "regular" (como `127.0.0.1` ou `::1`), o servidor aceita conexões TCP/IP apenas para esse endereço IPv4 ou IPv6.

Se a vinculação ao endereço falhar, o servidor produz um erro e não inicia.

Se você pretende vincular o servidor a um endereço específico, certifique-se de que a tabela do sistema `mysql.user` contenha uma conta com privilégios administrativos que você possa usar para se conectar a esse endereço. Caso contrário, você não poderá desligar o servidor. Por exemplo, se você vincular o servidor a `*`, poderá se conectar a ele usando todas as contas existentes. Mas se você vincular o servidor a `::1`, ele aceita conexões apenas nesse endereço. Nesse caso, primeiro certifique-se de que a conta `'root'@'::1'` esteja presente na tabela [[`mysql.user`] para que você ainda possa se conectar ao servidor para desligá-lo.

Essa variável não tem efeito para o servidor embutido (`libmysqld`) e não é visível dentro do servidor embutido.

* `block_encryption_mode`

  <table summary="Permitted values for the authentication_windows system variable."><col style="width: 10%"/><col style="width: 75%"/><thead><tr> <th>Value</th> <th>Descrição</th> </tr></thead><tbody><tr> <td>0</td> <td>Sem registro</td> </tr><tr> <td>1</td> <td>Registre apenas mensagens de erro</td> </tr><tr> <td>2</td> <td>Mensagens de nível 1 de log e mensagens de alerta</td> </tr><tr> <td>3</td> <td>Mensagens de nível 2 de log e notas de informação</td> </tr><tr> <td>4</td> <td>Mensagens de nível 3 de log e mensagens de depuração</td> </tr></tbody></table>1

Essa variável controla o modo de criptografia de bloco para algoritmos baseados em bloco, como o AES. Ela afeta a criptografia para `AES_ENCRYPT()` e `AES_DECRYPT()`.

`block_encryption_mode` aceita um valor no formato `aes-keylen-mode`, onde *`keylen`* é o comprimento da chave em bits e *`mode`* é o modo de criptografia. O valor não é sensível ao caso. Os valores permitidos de *`keylen`* são 128, 192 e

Os modos de criptografia permitidos dependem de se o MySQL foi compilado com OpenSSL ou yaSSL:

+ Para o OpenSSL, os valores permitidos de *`mode`* são: `ECB`, `CBC`, `CFB1`, `CFB8`, `CFB128`, `OFB`

+ Para o yaSSL, os valores permitidos de *`mode`* são: `ECB`, `CBC`

Por exemplo, essa declaração faz com que as funções de criptografia AES usem um comprimento de chave de 256 bits e o modo CBC:

  ```sql
  SET block_encryption_mode = 'aes-256-cbc';
  ```

Um erro ocorre para tentativas de definir `block_encryption_mode` para um valor que contém um comprimento de chave não suportado ou um modo que a biblioteca SSL não suporta.

* `bulk_insert_buffer_size`

  <table summary="Permitted values for the authentication_windows system variable."><col style="width: 10%"/><col style="width: 75%"/><thead><tr> <th>Value</th> <th>Descrição</th> </tr></thead><tbody><tr> <td>0</td> <td>Sem registro</td> </tr><tr> <td>1</td> <td>Registre apenas mensagens de erro</td> </tr><tr> <td>2</td> <td>Mensagens de nível 1 de log e mensagens de alerta</td> </tr><tr> <td>3</td> <td>Mensagens de nível 2 de log e notas de informação</td> </tr><tr> <td>4</td> <td>Mensagens de nível 3 de log e mensagens de depuração</td> </tr></tbody></table>2

`MyISAM` utiliza uma cache semelhante a uma árvore especial para tornar as inserções em massa mais rápidas para `INSERT ... SELECT`, `INSERT ... VALUES (...), (...), ...` e `LOAD DATA` ao adicionar dados a tabelas não vazias. Esta variável limita o tamanho da árvore de cache em bytes por thread. Definindo-a como 0, desativa esta otimização. O valor padrão é de 8 MB.

* `character_set_client`

  <table summary="Permitted values for the authentication_windows system variable."><col style="width: 10%"/><col style="width: 75%"/><thead><tr> <th>Value</th> <th>Descrição</th> </tr></thead><tbody><tr> <td>0</td> <td>Sem registro</td> </tr><tr> <td>1</td> <td>Registre apenas mensagens de erro</td> </tr><tr> <td>2</td> <td>Mensagens de nível 1 de log e mensagens de alerta</td> </tr><tr> <td>3</td> <td>Mensagens de nível 2 de log e notas de informação</td> </tr><tr> <td>4</td> <td>Mensagens de nível 3 de log e mensagens de depuração</td> </tr></tbody></table>3

O conjunto de caracteres para as declarações que chegam do cliente. O valor da sessão desta variável é definido usando o conjunto de caracteres solicitado pelo cliente quando o cliente se conecta ao servidor. (Muitos clientes suportam uma opção `--default-character-set` para permitir que este conjunto de caracteres seja especificado explicitamente. Veja também a Seção 10.4, “Conjunto de caracteres de conexão e colagens”.) O valor global da variável é usado para definir o valor da sessão nos casos em que o valor solicitado pelo cliente é desconhecido ou não disponível, ou o servidor é configurado para ignorar solicitações do cliente:

+ O cliente solicita um conjunto de caracteres desconhecido pelo servidor. Por exemplo, um cliente habilitado para japonês solicita `sjis` ao se conectar a um servidor não configurado com suporte ao `sjis`.

+ O cliente é de uma versão do MySQL mais antiga do que o MySQL 4.1, e, portanto, não solicita um conjunto de caracteres.

+ `mysqld` foi iniciado com a opção `--skip-character-set-client-handshake`, o que faz com que ele ignore a configuração do conjunto de caracteres do cliente. Isso reproduz o comportamento do MySQL 4.0 e é útil se você deseja atualizar o servidor sem atualizar todos os clientes.

Alguns conjuntos de caracteres não podem ser usados como o conjunto de caracteres do cliente. Tentar usá-los como o valor `character_set_client` produz um erro. Veja Conjuntos de caracteres do cliente impermissíveis.

* `character_set_connection`

  <table summary="Permitted values for the authentication_windows system variable."><col style="width: 10%"/><col style="width: 75%"/><thead><tr> <th>Value</th> <th>Descrição</th> </tr></thead><tbody><tr> <td>0</td> <td>Sem registro</td> </tr><tr> <td>1</td> <td>Registre apenas mensagens de erro</td> </tr><tr> <td>2</td> <td>Mensagens de nível 1 de log e mensagens de alerta</td> </tr><tr> <td>3</td> <td>Mensagens de nível 2 de log e notas de informação</td> </tr><tr> <td>4</td> <td>Mensagens de nível 3 de log e mensagens de depuração</td> </tr></tbody></table>4

O conjunto de caracteres utilizado para literais especificados sem um introduzidor de conjunto de caracteres e para conversão de número para string. Para informações sobre introdutores, consulte a Seção 10.3.8, “Introdutores de Conjunto de Caracteres”.

* `character_set_database`

  <table summary="Permitted values for the authentication_windows system variable."><col style="width: 10%"/><col style="width: 75%"/><thead><tr> <th>Value</th> <th>Descrição</th> </tr></thead><tbody><tr> <td>0</td> <td>Sem registro</td> </tr><tr> <td>1</td> <td>Registre apenas mensagens de erro</td> </tr><tr> <td>2</td> <td>Mensagens de nível 1 de log e mensagens de alerta</td> </tr><tr> <td>3</td> <td>Mensagens de nível 2 de log e notas de informação</td> </tr><tr> <td>4</td> <td>Mensagens de nível 3 de log e mensagens de depuração</td> </tr></tbody></table>5

O conjunto de caracteres usado pelo banco de dados padrão. O servidor define essa variável sempre que o banco de dados padrão muda. Se não houver um banco de dados padrão, a variável terá o mesmo valor que `character_set_server`.

As variáveis de sistema globais `character_set_database` e `collation_database` do sistema são descontinuadas no MySQL 5.7; espera-se que elas sejam removidas em uma versão futura do MySQL.

Atribuir um valor às variáveis de sistema `character_set_database` e `collation_database` da sessão é desaconselhável no MySQL 5.7 e as atribuições produzem um aviso. Você deve esperar que as variáveis de sessão se tornem somente leitura em uma versão futura do MySQL e as atribuições produzam um erro, enquanto permanecem possíveis para acessar as variáveis de sessão para determinar o conjunto de caracteres do banco de dados e a collation para o banco de dados padrão.

* `character_set_filesystem`

  <table summary="Permitted values for the authentication_windows system variable."><col style="width: 10%"/><col style="width: 75%"/><thead><tr> <th>Value</th> <th>Descrição</th> </tr></thead><tbody><tr> <td>0</td> <td>Sem registro</td> </tr><tr> <td>1</td> <td>Registre apenas mensagens de erro</td> </tr><tr> <td>2</td> <td>Mensagens de nível 1 de log e mensagens de alerta</td> </tr><tr> <td>3</td> <td>Mensagens de nível 2 de log e notas de informação</td> </tr><tr> <td>4</td> <td>Mensagens de nível 3 de log e mensagens de depuração</td> </tr></tbody></table>6

O conjunto de caracteres do sistema de arquivos. Esta variável é usada para interpretar literais de string que se referem a nomes de arquivos, como nas declarações `LOAD DATA` e `SELECT ... INTO OUTFILE` e na função `LOAD_FILE()`. Tais nomes de arquivos são convertidos de `character_set_client` para `character_set_filesystem` antes de ocorrer a tentativa de abertura do arquivo. O valor padrão é `binary`, o que significa que não ocorre nenhuma conversão. Para sistemas nos quais nomes de arquivos multibyte são permitidos, um valor diferente pode ser mais apropriado. Por exemplo, se o sistema representa nomes de arquivos usando UTF-8, defina `character_set_filesystem` para `'utf8mb4'`.

* `character_set_results`

  <table summary="Permitted values for the authentication_windows system variable."><col style="width: 10%"/><col style="width: 75%"/><thead><tr> <th>Value</th> <th>Descrição</th> </tr></thead><tbody><tr> <td>0</td> <td>Sem registro</td> </tr><tr> <td>1</td> <td>Registre apenas mensagens de erro</td> </tr><tr> <td>2</td> <td>Mensagens de nível 1 de log e mensagens de alerta</td> </tr><tr> <td>3</td> <td>Mensagens de nível 2 de log e notas de informação</td> </tr><tr> <td>4</td> <td>Mensagens de nível 3 de log e mensagens de depuração</td> </tr></tbody></table>7

O conjunto de caracteres usado para retornar os resultados da consulta ao cliente. Isso inclui dados de resultado, como valores de coluna, metadados de resultado, como nomes de coluna e mensagens de erro.

* `character_set_server`

  <table summary="Permitted values for the authentication_windows system variable."><col style="width: 10%"/><col style="width: 75%"/><thead><tr> <th>Value</th> <th>Descrição</th> </tr></thead><tbody><tr> <td>0</td> <td>Sem registro</td> </tr><tr> <td>1</td> <td>Registre apenas mensagens de erro</td> </tr><tr> <td>2</td> <td>Mensagens de nível 1 de log e mensagens de alerta</td> </tr><tr> <td>3</td> <td>Mensagens de nível 2 de log e notas de informação</td> </tr><tr> <td>4</td> <td>Mensagens de nível 3 de log e mensagens de depuração</td> </tr></tbody></table>8

O conjunto de caracteres padrão dos servidores. Consulte a Seção 10.15, “Configuração do Conjunto de Caracteres”. Se você definir essa variável, também deve definir `collation_server` para especificar a collation do conjunto de caracteres.

* `character_set_system`

  <table summary="Permitted values for the authentication_windows system variable."><col style="width: 10%"/><col style="width: 75%"/><thead><tr> <th>Value</th> <th>Descrição</th> </tr></thead><tbody><tr> <td>0</td> <td>Sem registro</td> </tr><tr> <td>1</td> <td>Registre apenas mensagens de erro</td> </tr><tr> <td>2</td> <td>Mensagens de nível 1 de log e mensagens de alerta</td> </tr><tr> <td>3</td> <td>Mensagens de nível 2 de log e notas de informação</td> </tr><tr> <td>4</td> <td>Mensagens de nível 3 de log e mensagens de depuração</td> </tr></tbody></table>9

O conjunto de caracteres usado pelo servidor para armazenar identificadores. O valor é sempre `utf8`.

* `character_sets_dir`

  <table frame="box" rules="all" summary="Properties for authentication_windows_use_principal_name"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--authentication-windows-use-principal-name[={OFF|ON}]</code></td> </tr><tr><th>System Variable</th> <td><code>authentication_windows_use_principal_name</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>ON</code></td> </tr></tbody></table>0

O diretório onde os conjuntos de caracteres são instalados. Veja a Seção 10.15, “Configuração de Conjunto de Caracteres”.

* `check_proxy_users`

  <table frame="box" rules="all" summary="Properties for authentication_windows_use_principal_name"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--authentication-windows-use-principal-name[={OFF|ON}]</code></td> </tr><tr><th>System Variable</th> <td><code>authentication_windows_use_principal_name</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>ON</code></td> </tr></tbody></table>1

Alguns plugins de autenticação implementam mapeamento de usuários proxy para si mesmos (por exemplo, os plugins de autenticação PAM e Windows). Outros plugins de autenticação não suportam usuários proxy por padrão. Destes, alguns podem solicitar que o próprio servidor MySQL mapeie usuários proxy de acordo com os privilégios de proxy concedidos: `mysql_native_password`, `sha256_password`.

Se a variável de sistema `check_proxy_users` estiver habilitada, o servidor realiza mapeamento de usuário proxy para quaisquer plugins de autenticação que façam tal solicitação. No entanto, também pode ser necessário habilitar variáveis de sistema específicas do plugin para aproveitar o suporte ao mapeamento de usuário proxy do servidor:

+ Para o plugin `mysql_native_password`, habilite `mysql_native_password_proxy_users`.

+ Para o plugin `sha256_password`, habilite `sha256_password_proxy_users`.

Para informações sobre proxeamento de usuários, consulte a Seção 6.2.14, “Usuários de Proxy”.

* `collation_connection`

  <table frame="box" rules="all" summary="Properties for authentication_windows_use_principal_name"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--authentication-windows-use-principal-name[={OFF|ON}]</code></td> </tr><tr><th>System Variable</th> <td><code>authentication_windows_use_principal_name</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>ON</code></td> </tr></tbody></table>2

A correção do conjunto de caracteres de conexão. `collation_connection` é importante para comparações de cadeias literais. Para comparações de cadeias com valores de coluna, `collation_connection` não importa porque as colunas têm sua própria correção, que tem uma precedência de correção mais alta (veja Seção 10.8.4, “Coercibilidade de Correção em Expressões”).

* `collation_database`

  <table frame="box" rules="all" summary="Properties for authentication_windows_use_principal_name"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--authentication-windows-use-principal-name[={OFF|ON}]</code></td> </tr><tr><th>System Variable</th> <td><code>authentication_windows_use_principal_name</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>ON</code></td> </tr></tbody></table>3

A agregação usada pelo banco de dados padrão. O servidor define essa variável sempre que o banco de dados padrão muda. Se não houver um banco de dados padrão, a variável terá o mesmo valor que `collation_server`.

As variáveis de sistema global `character_set_database` e `collation_database` do `character_set_database` e `collation_database` são descontinuadas no MySQL 5.7; espera-se que elas sejam removidas em uma versão futura do MySQL.

Atribuir um valor às variáveis de sistema `character_set_database` e `collation_database` da sessão é desaconselhável no MySQL 5.7 e as atribuições produzem um aviso. Espere que as variáveis de sessão se tornem somente de leitura em uma versão futura do MySQL e as atribuições produzam um erro, enquanto permanecem possíveis para acessar as variáveis de sessão para determinar o conjunto de caracteres do banco de dados e a collation do banco de dados padrão.

* `collation_server`

  <table frame="box" rules="all" summary="Properties for authentication_windows_use_principal_name"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--authentication-windows-use-principal-name[={OFF|ON}]</code></td> </tr><tr><th>System Variable</th> <td><code>authentication_windows_use_principal_name</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>ON</code></td> </tr></tbody></table>4

A agregação padrão do servidor. Consulte a Seção 10.15, “Configuração do Conjunto de Caracteres”.

* `completion_type`

  <table frame="box" rules="all" summary="Properties for authentication_windows_use_principal_name"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--authentication-windows-use-principal-name[={OFF|ON}]</code></td> </tr><tr><th>System Variable</th> <td><code>authentication_windows_use_principal_name</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>ON</code></td> </tr></tbody></table>5

O tipo de conclusão da transação. Essa variável pode assumir os valores mostrados na tabela a seguir. A variável pode ser atribuída usando os valores de nome ou os valores inteiros correspondentes.

  <table frame="box" rules="all" summary="Properties for authentication_windows_use_principal_name"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--authentication-windows-use-principal-name[={OFF|ON}]</code></td> </tr><tr><th>System Variable</th> <td><code>authentication_windows_use_principal_name</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>ON</code></td> </tr></tbody></table>6

`completion_type` afeta as transações que começam com `START TRANSACTION` ou `BEGIN` e terminam com `COMMIT` ou `ROLLBACK`. Não se aplica a compromissos implícitos resultantes da execução das declarações listadas na Seção 13.3.3, “Declarações que Causam um Compromisso Implícito”. Também não se aplica para `XA COMMIT`, `XA ROLLBACK`, ou quando `autocommit=1`.

* `concurrent_insert`

  <table frame="box" rules="all" summary="Properties for authentication_windows_use_principal_name"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--authentication-windows-use-principal-name[={OFF|ON}]</code></td> </tr><tr><th>System Variable</th> <td><code>authentication_windows_use_principal_name</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>ON</code></td> </tr></tbody></table>7

Se `AUTO` (o padrão), o MySQL permite que as instruções `INSERT` e `SELECT` sejam executadas simultaneamente para tabelas `MyISAM` que não têm blocos livres no meio do arquivo de dados.

Essa variável pode assumir os valores mostrados na tabela a seguir. A variável pode ser atribuída usando os valores de nome ou os valores inteiros correspondentes.

  <table frame="box" rules="all" summary="Properties for authentication_windows_use_principal_name"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--authentication-windows-use-principal-name[={OFF|ON}]</code></td> </tr><tr><th>System Variable</th> <td><code>authentication_windows_use_principal_name</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>ON</code></td> </tr></tbody></table>8

Se você começar `mysqld` com `--skip-new`, `concurrent_insert` é definido como `NEVER`.

Veja também a Seção 8.11.3, “Inserções Concorrentes”.

* `connect_timeout`

  <table frame="box" rules="all" summary="Properties for authentication_windows_use_principal_name"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--authentication-windows-use-principal-name[={OFF|ON}]</code></td> </tr><tr><th>System Variable</th> <td><code>authentication_windows_use_principal_name</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>ON</code></td> </tr></tbody></table>9

O número de segundos que o servidor `mysqld` espera por um pacote de conexão antes de responder com `Bad handshake`. O valor padrão é de 10 segundos.

Aumentar o valor do `connect_timeout` pode ajudar se os clientes frequentemente encontrarem erros da forma do `Lost connection to MySQL server at 'XXX', system error: errno`.

* `core_file`

  <table frame="box" rules="all" summary="Properties for autocommit"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--autocommit[={OFF|ON}]</code></td> </tr><tr><th>System Variable</th> <td><code>autocommit</code></td> </tr><tr><th>Scope</th> <td>Global, Session</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>ON</code></td> </tr></tbody></table>0

Se deve escrever um arquivo de núcleo se o servidor sair inesperadamente. Essa variável é definida pela opção `--core-file`.

* `datadir`

  <table frame="box" rules="all" summary="Properties for autocommit"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--autocommit[={OFF|ON}]</code></td> </tr><tr><th>System Variable</th> <td><code>autocommit</code></td> </tr><tr><th>Scope</th> <td>Global, Session</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>ON</code></td> </tr></tbody></table>1

O caminho para o diretório de dados do servidor MySQL. Os caminhos relativos são resolvidos em relação ao diretório atual. Se você espera que o servidor seja iniciado automaticamente (ou seja, em contextos para os quais você não pode assumir qual é o diretório atual), é melhor especificar o valor `datadir` como um caminho absoluto.

* `date_format`

Essa variável não é usada. Ela é desatualizada e será removida no MySQL 8.0.

* `datetime_format`

Essa variável não é usada. Ela é desatualizada e será removida no MySQL 8.0.

* `debug`

  <table frame="box" rules="all" summary="Properties for autocommit"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--autocommit[={OFF|ON}]</code></td> </tr><tr><th>System Variable</th> <td><code>autocommit</code></td> </tr><tr><th>Scope</th> <td>Global, Session</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>ON</code></td> </tr></tbody></table>2

Essa variável indica as configurações atuais de depuração. Ela está disponível apenas para servidores construídos com suporte de depuração. O valor inicial vem do valor das instâncias da opção `--debug` fornecida na inicialização do servidor. Os valores globais e de sessão podem ser definidos em tempo de execução.

Definir o valor da sessão desta variável do sistema é uma operação restrita. O usuário da sessão deve ter privilégios suficientes para definir variáveis de sessão restritas. Consulte a Seção 5.1.8.1, “Privilégios da Variável do Sistema”.

Atribuir um valor que começa com `+` ou `-` faz com que o valor seja adicionado ou subtraído do valor atual:

  ```sql
  mysql> SET debug = 'T';
  mysql> SELECT @@debug;
  +---------+
  | @@debug |
  +---------+
  | T       |
  +---------+

  mysql> SET debug = '+P';
  mysql> SELECT @@debug;
  +---------+
  | @@debug |
  +---------+
  | P:T     |
  +---------+

  mysql> SET debug = '-P';
  mysql> SELECT @@debug;
  +---------+
  | @@debug |
  +---------+
  | T       |
  +---------+
  ```

Para mais informações, consulte a Seção 5.8.3, “O pacote DBUG”.

* `debug_sync`

  <table frame="box" rules="all" summary="Properties for autocommit"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--autocommit[={OFF|ON}]</code></td> </tr><tr><th>System Variable</th> <td><code>autocommit</code></td> </tr><tr><th>Scope</th> <td>Global, Session</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>ON</code></td> </tr></tbody></table>3

Essa variável é a interface de usuário para a facilidade de sincronização de depuração. O uso do Debug Sync requer que o MySQL seja configurado com a opção `-DWITH_DEBUG=ON` **CMake** (consulte Seção 2.8.7, “Opções de Configuração de Fonte do MySQL”); caso contrário, essa variável do sistema não estará disponível.

O valor da variável global é somente de leitura e indica se a facilidade está habilitada. Por padrão, o Debug Sync está desabilitado e o valor de `debug_sync` é `OFF`. Se o servidor for iniciado com `--debug-sync-timeout=N`, onde *`N`* é um valor de tempo de espera maior que 0, o Debug Sync é habilitado e o valor de `debug_sync` é `ON - current signal` seguido pelo nome do sinal. Além disso, *`N`* se torna o tempo de espera padrão para pontos de sincronização individuais.

O valor da sessão pode ser lido por qualquer usuário e tem o mesmo valor que a variável global. O valor da sessão pode ser definido para controlar os pontos de sincronização.

Definir o valor da sessão desta variável do sistema é uma operação restrita. O usuário da sessão deve ter privilégios suficientes para definir variáveis de sessão restritas. Consulte a Seção 5.1.8.1, “Privilégios da Variável do Sistema”.

Para uma descrição da facilidade de depuração de sincronização e como usar pontos de sincronização, consulte a documentação do Doxygen do MySQL Server.

* `default_authentication_plugin`

  <table frame="box" rules="all" summary="Properties for autocommit"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--autocommit[={OFF|ON}]</code></td> </tr><tr><th>System Variable</th> <td><code>autocommit</code></td> </tr><tr><th>Scope</th> <td>Global, Session</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>ON</code></td> </tr></tbody></table>4

O plugin de autenticação padrão. Esses valores são permitidos:

+ `mysql_native_password`: Use senhas nativas do MySQL; veja a Seção 6.4.1.1, “Autenticação Pluggable Nativa”.

+ `sha256_password`: Use senhas SHA-256; veja a Seção 6.4.1.5, “Autenticação Pluggable SHA-256”.

Nota

Se essa variável tiver um valor diferente de `mysql_native_password`, os clientes mais antigos do MySQL 5.5.7 não poderão se conectar, pois, entre os plugins de autenticação padrão permitidos, eles entendem apenas o protocolo de autenticação `mysql_native_password`.

O valor `default_authentication_plugin` afeta esses aspectos da operação do servidor:

+ Determina qual plugin de autenticação o servidor atribui às novas contas criadas por declarações `CREATE USER` e `GRANT` que não especificam explicitamente um plugin de autenticação.

+ A variável de sistema `old_passwords` afeta a criptografia de senhas para contas que utilizam o plugin de autenticação `mysql_native_password` ou `sha256_password`. Se o plugin de autenticação padrão for um desses plugins, o servidor define `old_passwords` no início do processo ao valor exigido pelo método de criptografia de senha do plugin.

+ Para uma conta criada com uma das seguintes declarações, o servidor associa a conta ao plugin de autenticação padrão e atribui à conta a senha fornecida, criptografada conforme exigido por esse plugin:

    ```sql
    CREATE USER ... IDENTIFIED BY 'cleartext password';
    GRANT ...  IDENTIFIED BY 'cleartext password';
    ```

+ Para uma conta criada com uma das seguintes declarações, o servidor associa a conta ao plugin de autenticação padrão e atribui o hash da senha fornecido à conta, se o hash da senha tiver o formato exigido pelo plugin:

    ```sql
    CREATE USER ... IDENTIFIED BY PASSWORD 'encrypted password';
    GRANT ...  IDENTIFIED BY PASSWORD 'encrypted password';
    ```

Se o hash da senha não estiver no formato exigido pelo plugin de autenticação padrão, a declaração falha.

* `default_password_lifetime`

  <table frame="box" rules="all" summary="Properties for autocommit"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--autocommit[={OFF|ON}]</code></td> </tr><tr><th>System Variable</th> <td><code>autocommit</code></td> </tr><tr><th>Scope</th> <td>Global, Session</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>ON</code></td> </tr></tbody></table>5

Esta variável define a política global de expiração automática da senha. O valor padrão `default_password_lifetime` é 0, que desativa a expiração automática da senha. Se o valor de `default_password_lifetime` for um número inteiro positivo *`N`*, indica o tempo de vida permitido da senha; as senhas devem ser alteradas a cada *`N`* dias.

A política global de expiração de senha pode ser alterada conforme desejado para contas individuais usando as opções de expiração de senha da declaração `ALTER USER`. Veja a Seção 6.2.11, “Gestão de Senhas”.

Nota

Antes do MySQL 5.7.11, o valor padrão do `default_password_lifetime` é 360 (as senhas devem ser alteradas aproximadamente uma vez por ano). Para essas versões, esteja ciente de que, se não fizer alterações na variável `default_password_lifetime` ou nas contas individuais dos usuários, todas as senhas dos usuários expiram após 360 dias e todas as contas dos usuários começam a funcionar em modo restrito quando isso acontece. Os clientes (que são efetivamente usuários) que se conectam ao servidor recebem então um erro indicando que a senha deve ser alterada: `ERROR 1820 (HY000): You must reset your password using ALTER USER statement before executing this statement.`

No entanto, isso é fácil de passar despercebido para clientes que se conectam automaticamente ao servidor, como as conexões feitas a partir de scripts. Para evitar que esses clientes deixem de funcionar de repente devido à expiração da senha, certifique-se de alterar as configurações de expiração da senha para esses clientes, da seguinte forma:

  ```sql
  ALTER USER 'script'@'localhost' PASSWORD EXPIRE NEVER;
  ```

Alternativamente, defina a variável `default_password_lifetime` para `0`, desativando assim a expiração automática da senha para todos os usuários.

* `default_storage_engine`

  <table frame="box" rules="all" summary="Properties for autocommit"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--autocommit[={OFF|ON}]</code></td> </tr><tr><th>System Variable</th> <td><code>autocommit</code></td> </tr><tr><th>Scope</th> <td>Global, Session</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>ON</code></td> </tr></tbody></table>6

O mecanismo de armazenamento padrão para tabelas. Veja o Capítulo 15, *Mecanismos de Armazenamento Alternativos*. Esta variável define o mecanismo de armazenamento para tabelas permanentes apenas. Para definir o mecanismo de armazenamento para as tabelas `TEMPORARY`, defina a variável de sistema `default_tmp_storage_engine`.

Para ver quais motores de armazenamento estão disponíveis e habilitados, use a declaração `SHOW ENGINES` ou consulte a tabela `INFORMATION_SCHEMA` `ENGINES`.

Se você desabilitar o mecanismo de armazenamento padrão no início da inicialização do servidor, você deve definir o mecanismo padrão tanto para as tabelas permanentes quanto para as tabelas `TEMPORARY` como um mecanismo diferente, caso contrário, o servidor não poderá ser iniciado.

* `default_tmp_storage_engine`

  <table frame="box" rules="all" summary="Properties for autocommit"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--autocommit[={OFF|ON}]</code></td> </tr><tr><th>System Variable</th> <td><code>autocommit</code></td> </tr><tr><th>Scope</th> <td>Global, Session</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>ON</code></td> </tr></tbody></table>7

O mecanismo de armazenamento padrão para as tabelas `TEMPORARY` (criadas com `CREATE TEMPORARY TABLE`). Para definir o mecanismo de armazenamento para tabelas permanentes, defina a variável de sistema `default_storage_engine`. Veja também a discussão sobre essa variável em relação aos possíveis valores.

Se você desabilitar o mecanismo de armazenamento padrão no início da inicialização do servidor, você deve definir o mecanismo padrão tanto para as tabelas permanentes quanto para as tabelas `TEMPORARY` como um mecanismo diferente, caso contrário, o servidor não poderá ser iniciado.

* `default_week_format`

  <table frame="box" rules="all" summary="Properties for autocommit"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--autocommit[={OFF|ON}]</code></td> </tr><tr><th>System Variable</th> <td><code>autocommit</code></td> </tr><tr><th>Scope</th> <td>Global, Session</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>ON</code></td> </tr></tbody></table>8

O valor padrão a ser usado para a função `WEEK()`. Veja a Seção 12.7, “Funções de data e hora”.

* `delay_key_write`

  <table frame="box" rules="all" summary="Properties for autocommit"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--autocommit[={OFF|ON}]</code></td> </tr><tr><th>System Variable</th> <td><code>autocommit</code></td> </tr><tr><th>Scope</th> <td>Global, Session</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>ON</code></td> </tr></tbody></table>9

Esta variável especifica como usar escritas de chave com atraso. Ela se aplica apenas às tabelas `MyISAM`. A escrita de chave com atraso faz com que os buffers de chave não sejam limpos entre as escritas. Veja também a Seção 15.2.1, “Opções de inicialização do MyISAM”.

Essa variável pode ter um dos seguintes valores para afetar o tratamento da opção da tabela `DELAY_KEY_WRITE`, que pode ser usada nas declarações `CREATE TABLE`.

  <table frame="box" rules="all" summary="Properties for automatic_sp_privileges"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--automatic-sp-privileges[={OFF|ON}]</code></td> </tr><tr><th>System Variable</th> <td><code>automatic_sp_privileges</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>ON</code></td> </tr></tbody></table>0

Nota

Se você definir essa variável para `ALL`, não deve usar as tabelas `MyISAM` dentro de outro programa (como outro servidor MySQL ou **myisamchk**) quando as tabelas estiverem em uso. Isso leva à corrupção do índice.

Se `DELAY_KEY_WRITE` estiver habilitado para uma tabela, o buffer de chave não é esvaziado para a tabela em cada atualização de índice, mas apenas quando a tabela é fechada. Isso acelera muito as escritas em chaves, mas se você usar esse recurso, deve adicionar a verificação automática de todas as tabelas `MyISAM` iniciando o servidor com a variável de sistema `myisam_recover_options` definida (por exemplo, `myisam_recover_options='BACKUP,FORCE'`). Veja a Seção 5.1.7, “Variáveis do Sistema do Servidor”, e a Seção 15.2.1, “Opções de Inicialização do MyISAM”.

Se você iniciar `mysqld` com `--skip-new`, `delay_key_write` é definido como `OFF`.

Aviso

Se você ativar o bloqueio externo com `--external-locking`, não há proteção contra corrupção de índice para tabelas que utilizam escritas de chave atrasadas.

* `delayed_insert_limit`

  <table frame="box" rules="all" summary="Properties for automatic_sp_privileges"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--automatic-sp-privileges[={OFF|ON}]</code></td> </tr><tr><th>System Variable</th> <td><code>automatic_sp_privileges</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>ON</code></td> </tr></tbody></table>1

Essa variável do sistema é desatualizada (porque as inserções `DELAYED` não são suportadas); espere que ela seja removida em uma versão futura.

* `delayed_insert_timeout`

  <table frame="box" rules="all" summary="Properties for automatic_sp_privileges"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--automatic-sp-privileges[={OFF|ON}]</code></td> </tr><tr><th>System Variable</th> <td><code>automatic_sp_privileges</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>ON</code></td> </tr></tbody></table>2

Essa variável do sistema é desatualizada (porque as inserções `DELAYED` não são suportadas); espere que ela seja removida em uma versão futura.

* `delayed_queue_size`

  <table frame="box" rules="all" summary="Properties for automatic_sp_privileges"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--automatic-sp-privileges[={OFF|ON}]</code></td> </tr><tr><th>System Variable</th> <td><code>automatic_sp_privileges</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>ON</code></td> </tr></tbody></table>3

Essa variável do sistema é desatualizada (porque as inserções `DELAYED` não são suportadas); espere que ela seja removida em uma versão futura.

* `disabled_storage_engines`

  <table frame="box" rules="all" summary="Properties for automatic_sp_privileges"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--automatic-sp-privileges[={OFF|ON}]</code></td> </tr><tr><th>System Variable</th> <td><code>automatic_sp_privileges</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>ON</code></td> </tr></tbody></table>4

Essa variável indica quais motores de armazenamento não podem ser usados para criar tabelas ou espaços de tabela. Por exemplo, para impedir que novas tabelas `MyISAM` ou `FEDERATED` sejam criadas, inicie o servidor com essas strings no arquivo de opção do servidor:

  ```sql
  [mysqld]
  disabled_storage_engines="MyISAM,FEDERATED"
  ```

Por padrão, `disabled_storage_engines` está vazio (sem motores desativados), mas pode ser configurado como uma lista de um ou mais motores separados por vírgula (não sensível ao caso). Qualquer motor mencionado no valor não pode ser usado para criar tabelas ou espaços de tabela com `CREATE TABLE` ou `CREATE TABLESPACE`, e não pode ser usado com `ALTER TABLE ... ENGINE` ou `ALTER TABLESPACE ... ENGINE` para alterar o motor de armazenamento de tabelas ou espaços de tabela existentes. Tentativas de fazer isso resultam em um erro `ER_DISABLED_STORAGE_ENGINE`.

`disabled_storage_engines` não restringe outras declarações DDL para tabelas existentes, como `CREATE INDEX`, `TRUNCATE TABLE`, `ANALYZE TABLE`, `DROP TABLE` ou `DROP TABLESPACE`. Isso permite uma transição suave para que tabelas ou espaços de tabela existentes que utilizam um motor desativado possam ser migradas para um motor permitido por meio de meios como `ALTER TABLE ... ENGINE permitted_engine`.

É permitido definir a variável de sistema `default_storage_engine` ou `default_tmp_storage_engine` para um mecanismo de armazenamento desativado. Isso pode fazer com que as aplicações se comportem de forma errática ou falhem, embora isso possa ser uma técnica útil em um ambiente de desenvolvimento para identificar aplicações que usam motores desativados, para que possam ser modificadas.

`disabled_storage_engines` é desativado e não tem efeito se o servidor for iniciado com qualquer uma dessas opções: `--bootstrap`, `--initialize`, `--initialize-insecure`, `--skip-grant-tables`.

Nota

Definir `disabled_storage_engines` pode causar um problema com `mysqld_upgrade`. Para obter detalhes, consulte a Seção 4.4.7, “mysql_upgrade — Verificar e atualizar tabelas do MySQL”.

* `disconnect_on_expired_password`

  <table frame="box" rules="all" summary="Properties for automatic_sp_privileges"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--automatic-sp-privileges[={OFF|ON}]</code></td> </tr><tr><th>System Variable</th> <td><code>automatic_sp_privileges</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>ON</code></td> </tr></tbody></table>5

Essa variável controla como o servidor lida com clientes com senhas expiradas:

+ Se o cliente indicar que pode lidar com senhas expiradas, o valor de `disconnect_on_expired_password` é irrelevante. O servidor permite que o cliente se conecte, mas o coloca no modo sandbox.

+ Se o cliente não indicar que pode lidar com senhas expiradas, o servidor lida com o cliente de acordo com o valor de `disconnect_on_expired_password`:

- Se `disconnect_on_expired_password`: estiver habilitado, o servidor desconecta o cliente.

- Se `disconnect_on_expired_password`: estiver desativado, o servidor permite que o cliente se conecte, mas o coloca no modo sandbox.

Para mais informações sobre a interação entre as configurações do cliente e do servidor relacionadas ao tratamento de senhas expiradas, consulte a Seção 6.2.12, “Tratamento do servidor de senhas expiradas”.

* `div_precision_increment`

  <table frame="box" rules="all" summary="Properties for automatic_sp_privileges"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--automatic-sp-privileges[={OFF|ON}]</code></td> </tr><tr><th>System Variable</th> <td><code>automatic_sp_privileges</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>ON</code></td> </tr></tbody></table>6

Essa variável indica o número de dígitos pelo qual é necessário aumentar a escala do resultado das operações de divisão realizadas com o operador `/`. O valor padrão é 4. Os valores mínimo e máximo são, respectivamente, 0 e 30. O exemplo a seguir ilustra o efeito de aumentar o valor padrão.

  ```sql
  mysql> SELECT 1/7;
  +--------+
  | 1/7    |
  +--------+
  | 0.1429 |
  +--------+
  mysql> SET div_precision_increment = 12;
  mysql> SELECT 1/7;
  +----------------+
  | 1/7            |
  +----------------+
  | 0.142857142857 |
  +----------------+
  ```

* `end_markers_in_json`

  <table frame="box" rules="all" summary="Properties for automatic_sp_privileges"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--automatic-sp-privileges[={OFF|ON}]</code></td> </tr><tr><th>System Variable</th> <td><code>automatic_sp_privileges</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>ON</code></td> </tr></tbody></table>7

Se o output JSON do otimizador deve adicionar marcadores finais. Veja a Seção 8.15.9, “A variável de sistema end_markers_in_json”.

* `eq_range_index_dive_limit`

  <table frame="box" rules="all" summary="Properties for automatic_sp_privileges"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--automatic-sp-privileges[={OFF|ON}]</code></td> </tr><tr><th>System Variable</th> <td><code>automatic_sp_privileges</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>ON</code></td> </tr></tbody></table>8

Essa variável indica o número de intervalos de igualdade em uma condição de comparação de igualdade quando o otimizador deve mudar de usar mergulhos de índice para estatísticas de índice na estimativa do número de strings qualificadas. Ela se aplica à avaliação de expressões que têm uma das seguintes formas equivalentes, onde o otimizador usa um índice não único para procurar valores de *`col_name`*:

  ```sql
  col_name IN(val1, ..., valN)
  col_name = val1 OR ... OR col_name = valN
  ```

Em ambos os casos, a expressão contém intervalos de igualdade *`N`*. O otimizador pode fazer estimativas de string usando mergulhos de índice ou estatísticas de índice. Se `eq_range_index_dive_limit` for maior que 0, o otimizador usa estatísticas de índice existentes em vez de mergulhos de índice se houver `eq_range_index_dive_limit` ou mais intervalos de igualdade. Assim, para permitir o uso de mergulhos de índice para até *`N`* intervalos de igualdade, defina `eq_range_index_dive_limit` para *`N`* + 1. Para desabilitar o uso de estatísticas de índice e usar sempre mergulhos de índice, independentemente de *`N`*, defina `eq_range_index_dive_limit` para 0.

Para mais informações, consulte a seção Otimização da faixa de igualdade da comparação de muitos valores.

Para atualizar as estatísticas do índice de tabela para as melhores estimativas, use `ANALYZE TABLE`.

* `error_count`

O número de erros que resultaram da última declaração que gerou mensagens. Essa variável é somente de leitura. Veja a Seção 13.7.5.17, “Declaração SHOW ERRORS”.

* `event_scheduler`

  <table frame="box" rules="all" summary="Properties for automatic_sp_privileges"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--automatic-sp-privileges[={OFF|ON}]</code></td> </tr><tr><th>System Variable</th> <td><code>automatic_sp_privileges</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>ON</code></td> </tr></tbody></table>9

Essa variável habilita ou desabilita, e inicia ou para, o Cronograma de Eventos. Os possíveis valores de status são `ON`, `OFF` e `DISABLED`. A configuração do Cronograma de Eventos `OFF` não é a mesma que a desativação do Cronograma de Eventos, que requer a definição do status para `DISABLED`. Essa variável e seus efeitos sobre o funcionamento do Cronograma de Eventos são discutidos em maior detalhe na Seção 23.4.2, “Configuração do Cronograma de Eventos”

* `explicit_defaults_for_timestamp`

  <table frame="box" rules="all" summary="Properties for auto_generate_certs"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--auto-generate-certs[={OFF|ON}]</code></td> </tr><tr><th>System Variable</th> <td><code>auto_generate_certs</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>ON</code></td> </tr></tbody></table>0

Essa variável de sistema determina se o servidor habilita certos comportamentos não padrão para valores padrão e o tratamento do valor `NULL` nas colunas `TIMESTAMP`. Por padrão, `explicit_defaults_for_timestamp` é desativado, o que habilita os comportamentos não padrão.

Se `explicit_defaults_for_timestamp` estiver desativado, o servidor habilita os comportamentos não padrão e trata as colunas `TIMESTAMP` da seguinte forma:

As colunas que não são explicitamente declaradas com o atributo `NULL` são automaticamente declaradas com o atributo `NOT NULL`. Atribuir um valor àquela coluna de `NULL` é permitido e define a coluna como o timestamp atual.

+ A primeira coluna `TIMESTAMP` em uma tabela, se não for explicitamente declarada com o atributo `NULL` ou um atributo explícito `DEFAULT` ou `ON UPDATE`, é automaticamente declarada com os atributos `DEFAULT CURRENT_TIMESTAMP` e `ON UPDATE CURRENT_TIMESTAMP`.

+ As colunas que seguem a primeira, se não forem explicitamente declaradas com o atributo `NULL` ou um atributo explícito `DEFAULT`, são automaticamente declaradas como `DEFAULT '0000-00-00 00:00:00'` (o timestamp “zero”). Para as strings inseridas que não especificam um valor explícito para uma dessas colunas, a coluna é atribuída a `'0000-00-00 00:00:00'` e não ocorre nenhum aviso.

Dependendo se o modo SQL rigoroso ou o modo SQL `NO_ZERO_DATE` está habilitado, um valor padrão de `'0000-00-00 00:00:00'` pode ser inválido. Esteja ciente de que o modo SQL `TRADITIONAL` inclui o modo rigoroso e `NO_ZERO_DATE`. Veja a Seção 5.1.10, “Modos SQL do servidor”.

Os comportamentos não padrão que acabamos de descrever são desaconselhados; espere que eles sejam removidos em um lançamento futuro do MySQL.

Se `explicit_defaults_for_timestamp` estiver habilitado, o servidor desativa os comportamentos não padrão e trata as colunas `TIMESTAMP` da seguinte forma:

+ Não é possível atribuir um valor à coluna `TIMESTAMP` para configurá-la como o timestamp atual. Para atribuir o timestamp atual, configure a coluna para `CURRENT_TIMESTAMP` ou um sinônimo, como `NOW()`.

As colunas que não são explicitamente declaradas com o atributo `NOT NULL` são automaticamente declaradas com o atributo `NULL` e permitem valores de `NULL`. Atribuir a uma coluna um valor de `NULL` a ela atribui `NULL`, e não o timestamp atual.

As colunas declaradas com o atributo `NOT NULL` não permitem valores de `NULL`. Para inserções que especificam `NULL` para tal coluna, o resultado é um erro para uma inserção de uma única string se o modo SQL rigoroso estiver habilitado, ou `'0000-00-00 00:00:00'` é inserido para inserções de várias strings com o modo SQL rigoroso desativado. Em nenhum caso, atribuir ao valor da coluna `NULL` o valor do timestamp atual.

As colunas `TIMESTAMP` explicitamente declaradas com o atributo `NOT NULL` e sem um atributo explícito `DEFAULT` são tratadas como não tendo um valor padrão. Para as strings inseridas que não especificam um valor explícito para tal coluna, o resultado depende do modo SQL. Se o modo SQL rigoroso estiver habilitado, ocorre um erro. Se o modo SQL rigoroso não estiver habilitado, a coluna é declarada com o valor padrão implícito de `'0000-00-00 00:00:00'` e ocorre um aviso. Isso é semelhante à forma como o MySQL trata outros tipos temporais, como `DATETIME`.

+ Não há coluna `TIMESTAMP` declarada automaticamente com os atributos `DEFAULT CURRENT_TIMESTAMP` ou `ON UPDATE CURRENT_TIMESTAMP`. Esses atributos devem ser especificados explicitamente.

+ A primeira coluna `TIMESTAMP` em uma tabela não é tratada de maneira diferente das colunas `TIMESTAMP` que seguem a primeira.

Se `explicit_defaults_for_timestamp` for desativado na inicialização do servidor, este aviso aparece no log de erro:

  ```sql
  [Warning] TIMESTAMP with implicit DEFAULT value is deprecated.
  Please use --explicit_defaults_for_timestamp server option (see
  documentation for more details).
  ```

Como indicado pelo aviso, para desabilitar os comportamentos não padronizados obsoletos, habilite a variável de sistema `explicit_defaults_for_timestamp` na inicialização do servidor.

Nota

`explicit_defaults_for_timestamp` é, por si só, descontinuado, pois seu único propósito é permitir o controle sobre comportamentos `TIMESTAMP` descontinuados que devem ser removidos em uma futura versão do MySQL. Quando a remoção desses comportamentos ocorrer, `explicit_defaults_for_timestamp` não terá mais nenhum propósito, e você pode esperar que ele também seja removido.

Para informações adicionais, consulte a Seção 11.2.6, “Inicialização e atualização automática para TIMESTAMP e DATETIME”.

* `external_user`

  <table frame="box" rules="all" summary="Properties for auto_generate_certs"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--auto-generate-certs[={OFF|ON}]</code></td> </tr><tr><th>System Variable</th> <td><code>auto_generate_certs</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>ON</code></td> </tr></tbody></table>1

O nome de usuário externo usado durante o processo de autenticação, conforme definido pelo plugin usado para autenticar o cliente. Com autenticação nativa (incorporada) do MySQL, ou se o plugin não definir o valor, essa variável é `NULL`. Veja a Seção 6.2.14, “Usuários Proxy”.

* `flush`

  <table frame="box" rules="all" summary="Properties for auto_generate_certs"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--auto-generate-certs[={OFF|ON}]</code></td> </tr><tr><th>System Variable</th> <td><code>auto_generate_certs</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>ON</code></td> </tr></tbody></table>2

Se `ON`, o servidor esvazia (sincroniza) todas as alterações no disco após cada declaração SQL. Normalmente, o MySQL escreve todas as alterações no disco apenas após cada declaração SQL e permite que o sistema operacional gere a sincronização com o disco. Veja a Seção B.3.3.3, “O que fazer se o MySQL continuar a falhar”. Esta variável é definida como `ON` se você iniciar `mysqld` com a opção `--flush`.

Nota

Se `flush` estiver habilitado, o valor de `flush_time` não importa e as alterações em `flush_time` não afetam o comportamento de limpeza.

* `flush_time`

  <table frame="box" rules="all" summary="Properties for auto_generate_certs"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--auto-generate-certs[={OFF|ON}]</code></td> </tr><tr><th>System Variable</th> <td><code>auto_generate_certs</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>ON</code></td> </tr></tbody></table>3

Se este valor for definido como um valor não nulo, todas as tabelas são fechadas a cada `flush_time` segundos para liberar recursos e sincronizar dados não apagados no disco. Esta opção é melhor utilizada apenas em sistemas com recursos mínimos.

Nota

Se `flush` estiver habilitado, o valor de `flush_time` não importa e as alterações em `flush_time` não afetam o comportamento de limpeza.

* `foreign_key_checks`

  <table frame="box" rules="all" summary="Properties for auto_generate_certs"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--auto-generate-certs[={OFF|ON}]</code></td> </tr><tr><th>System Variable</th> <td><code>auto_generate_certs</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>ON</code></td> </tr></tbody></table>4

Se definido como 1 (o padrão), os constrangimentos de chave estrangeira são verificados. Se definido como 0, os constrangimentos de chave estrangeira são ignorados, com algumas exceções. Ao recriar uma tabela que foi excluída, um erro é retornado se a definição da tabela não atender aos constrangimentos de chave estrangeira que fazem referência à tabela. Da mesma forma, uma operação `ALTER TABLE` retorna um erro se uma definição de chave estrangeira for formada incorretamente. Para mais informações, consulte a Seção 13.1.18.5, “Constrangimentos de Chave Estrangeira”.

Definir essa variável tem o mesmo efeito nas tabelas `NDB` que nas tabelas `InnoDB`. Normalmente, você deixa essa configuração habilitada durante o funcionamento normal, para impor a integridade referencial. Desabilitar o controle de chave estrangeira pode ser útil para recarregar as tabelas `InnoDB` em uma ordem diferente daquela exigida por suas relações pai/filho. Veja a Seção 13.1.18.5, “Restrições de Chave Estrangeira”.

Definir `foreign_key_checks` para 0 também afeta as declarações de definição de dados: `DROP SCHEMA` elimina um esquema, mesmo que ele contenha tabelas que possuem chaves estrangeiras que são referenciadas por tabelas externas ao esquema, e `DROP TABLE` elimina tabelas que possuem chaves estrangeiras que são referenciadas por outras tabelas.

Nota

Definir `foreign_key_checks` para 1 não aciona uma varredura dos dados da tabela existente. Portanto, as strings adicionadas à tabela enquanto `foreign_key_checks=0` não são verificadas quanto à consistência.

Não é permitido excluir um índice exigido por uma restrição de chave estrangeira, mesmo com `foreign_key_checks=0`. A restrição de chave estrangeira deve ser removida antes de excluir o índice (Bug #70260).

* `ft_boolean_syntax`

  <table frame="box" rules="all" summary="Properties for auto_generate_certs"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--auto-generate-certs[={OFF|ON}]</code></td> </tr><tr><th>System Variable</th> <td><code>auto_generate_certs</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>ON</code></td> </tr></tbody></table>5

A lista de operadores suportados por pesquisas de texto completo booleanas realizadas usando `IN BOOLEAN MODE`. Veja a Seção 12.9.2, “Pesquisas de Texto Completo Booleanas”.

O valor padrão da variável é `'+ -><()~*:""&|'`. As regras para alterar o valor são as seguintes:

+ A função do operador é determinada pela posição dentro da string.

+ O valor de substituição deve ser de 14 caracteres.  
+ Cada caractere deve ser um caractere não alfanumérico ASCII.  
+ Ou o primeiro ou o segundo caractere deve ser um espaço.  
+ Não são permitidas duplicatas, exceto as frases que citam operadores nas posições 11 e 12. Esses dois caracteres não precisam ser iguais, mas são os únicos que podem ser.

+ As posições 10, 13 e 14 (que, por padrão, estão configuradas como `:`, `&` e `|`) são reservadas para futuras extensões.

* `ft_max_word_len`

  <table frame="box" rules="all" summary="Properties for auto_generate_certs"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--auto-generate-certs[={OFF|ON}]</code></td> </tr><tr><th>System Variable</th> <td><code>auto_generate_certs</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>ON</code></td> </tr></tbody></table>6

O comprimento máximo da palavra a ser incluída em um índice `MyISAM` `FULLTEXT`.

Nota

`FULLTEXT` índices em tabelas `MyISAM` devem ser reconstruídos após a alteração desta variável. Use `REPAIR TABLE tbl_name QUICK`.

* `ft_min_word_len`

  <table frame="box" rules="all" summary="Properties for auto_generate_certs"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--auto-generate-certs[={OFF|ON}]</code></td> </tr><tr><th>System Variable</th> <td><code>auto_generate_certs</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>ON</code></td> </tr></tbody></table>7

O comprimento mínimo da palavra a ser incluída em um índice `MyISAM` `FULLTEXT`.

Nota

`FULLTEXT` os índices nas tabelas `MyISAM` devem ser reconstruídos após a alteração desta variável. Use `REPAIR TABLE tbl_name QUICK`.

* `ft_query_expansion_limit`

  <table frame="box" rules="all" summary="Properties for auto_generate_certs"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--auto-generate-certs[={OFF|ON}]</code></td> </tr><tr><th>System Variable</th> <td><code>auto_generate_certs</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>ON</code></td> </tr></tbody></table>8

O número de jogos principais a serem utilizados para pesquisas de texto completo realizadas usando `WITH QUERY EXPANSION`.

* `ft_stopword_file`

  <table frame="box" rules="all" summary="Properties for auto_generate_certs"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--auto-generate-certs[={OFF|ON}]</code></td> </tr><tr><th>System Variable</th> <td><code>auto_generate_certs</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>ON</code></td> </tr></tbody></table>9

O arquivo a partir do qual ler a lista de palavras irrelevantes para pesquisas de texto completo nas tabelas `MyISAM`. O servidor procura o arquivo no diretório de dados, a menos que um nome de caminho absoluto seja fornecido para especificar um diretório diferente. Todas as palavras do arquivo são usadas; os comentários *não* são considerados. Por padrão, uma lista integrada de palavras irrelevantes é usada (conforme definido no arquivo `storage/myisam/ft_static.c`. Definindo esta variável como uma string vazia (`''`) desativa o filtro de palavras irrelevantes. Veja também a Seção 12.9.4, “Palavras irrelevantes de texto completo”.

Nota

`FULLTEXT` os índices nas tabelas `MyISAM` devem ser reconstruídos após a alteração desta variável ou dos conteúdos do arquivo de palavras-chave. Use `REPAIR TABLE tbl_name QUICK`.

* `general_log`

  <table frame="box" rules="all" summary="Properties for avoid_temporal_upgrade"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--avoid-temporal-upgrade[={OFF|ON}]</code></td> </tr><tr><th>Deprecated</th> <td>Yes</td> </tr><tr><th>System Variable</th> <td><code>avoid_temporal_upgrade</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>OFF</code></td> </tr></tbody></table>0

Se o log de consulta geral está habilitado. O valor pode ser 0 (ou `OFF`) para desabilitar o log ou 1 (ou `ON`) para habilitar o log. O destino para a saída do log é controlado pela variável de sistema `log_output`; se esse valor for `NONE`, não são escritas entradas de log, mesmo que o log esteja habilitado.

* `general_log_file`

  <table frame="box" rules="all" summary="Properties for avoid_temporal_upgrade"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--avoid-temporal-upgrade[={OFF|ON}]</code></td> </tr><tr><th>Deprecated</th> <td>Yes</td> </tr><tr><th>System Variable</th> <td><code>avoid_temporal_upgrade</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>OFF</code></td> </tr></tbody></table>1

O nome do arquivo de registro de consulta geral. O valor padrão é `host_name.log`, mas o valor inicial pode ser alterado com a opção `--general_log_file`.

* `group_concat_max_len`

  <table frame="box" rules="all" summary="Properties for avoid_temporal_upgrade"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--avoid-temporal-upgrade[={OFF|ON}]</code></td> </tr><tr><th>Deprecated</th> <td>Yes</td> </tr><tr><th>System Variable</th> <td><code>avoid_temporal_upgrade</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>OFF</code></td> </tr></tbody></table>2

O comprimento máximo permitido do resultado em bytes para a função `GROUP_CONCAT()`. O padrão é 1024.

* `have_compress`

`YES` se a biblioteca de compressão `zlib` estiver disponível para o servidor, `NO` se não estiver. Caso contrário, as funções `COMPRESS()` e `UNCOMPRESS()` não podem ser utilizadas.

* `have_crypt`

`YES` se o `crypt()` sistema de chamada estiver disponível para o servidor, `NO` se não estiver. Caso contrário, a função `ENCRYPT()` não pode ser usada.

Nota

A função `ENCRYPT()` é descontinuada no MySQL 5.7, será removida em uma versão futura do MySQL e não deve mais ser usada. (Para hashing unidirecional, considere usar `SHA2()` em vez disso.) Consequentemente, `have_crypt` também é descontinuada; espere que ela seja removida em uma versão futura.

* `have_dynamic_loading`

`YES` se `mysqld` suporta carregamento dinâmico de plugins, `NO` se não. Se o valor for `NO`, você não pode usar opções como `--plugin-load` para carregar plugins na inicialização do servidor, ou a declaração `INSTALL PLUGIN` para carregar plugins em tempo real.

* `have_geometry`

`YES` se o servidor suporta tipos de dados espaciais, `NO` se

* `have_openssl`

Esta variável é sinônimo de `have_ssl`.

* `have_profiling`

`YES` Se a capacidade de perfilamento de se houver, `NO` Se não. Se houver, a variável de sistema `profiling` controla se essa capacidade está habilitada ou desabilitada. Veja a Seção 13.7.5.31, “Declaração SHOW PROFILES”.

Essa variável é desatualizada; espere que ela seja removida em uma versão futura do MySQL.

* `have_query_cache`

`YES` se `mysqld` suporta o cache de consulta, `NO` se

Nota

O cache de consulta é descontinuado a partir do MySQL 5.7.20 e é removido no MySQL 8.0. A depreciação inclui `have_query_cache`.

* `have_rtree_keys`

`YES` se os índices `RTREE` estiverem disponíveis, `NO` se não estiverem. (Estes são usados para índices espaciais em tabelas `MyISAM`.)

* `have_ssl`

  <table frame="box" rules="all" summary="Properties for avoid_temporal_upgrade"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--avoid-temporal-upgrade[={OFF|ON}]</code></td> </tr><tr><th>Deprecated</th> <td>Yes</td> </tr><tr><th>System Variable</th> <td><code>avoid_temporal_upgrade</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>OFF</code></td> </tr></tbody></table>3

`YES` se `mysqld` suporta conexões SSL, `DISABLED` se o servidor foi compilado com suporte SSL, mas não foi iniciado com as opções de criptografia de conexão apropriadas. Para mais informações, consulte a Seção 2.8.6, “Configurando o Suporte à Biblioteca SSL”.

* `have_statement_timeout`

  <table frame="box" rules="all" summary="Properties for avoid_temporal_upgrade"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--avoid-temporal-upgrade[={OFF|ON}]</code></td> </tr><tr><th>Deprecated</th> <td>Yes</td> </tr><tr><th>System Variable</th> <td><code>avoid_temporal_upgrade</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>OFF</code></td> </tr></tbody></table>4

Se a função de temporização de execução de declaração está disponível (consulte Dicas de otimização do temporizador de execução de declaração). O valor pode ser `NO` se o thread de fundo usado por essa função não puder ser inicializado.

* `have_symlink`

`YES` se o suporte a links simbólicos estiver habilitado, `NO` se não. Isso é necessário no Unix para o suporte às opções da tabela `DATA DIRECTORY` e `INDEX DIRECTORY`. Se o servidor for iniciado com a opção `--skip-symbolic-links`, o valor é `DISABLED`.

Essa variável não tem significado no Windows.

* `host_cache_size`

  <table frame="box" rules="all" summary="Properties for avoid_temporal_upgrade"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--avoid-temporal-upgrade[={OFF|ON}]</code></td> </tr><tr><th>Deprecated</th> <td>Yes</td> </tr><tr><th>System Variable</th> <td><code>avoid_temporal_upgrade</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>OFF</code></td> </tr></tbody></table>5

O servidor MySQL mantém um cache de host de memória que contém informações sobre o nome do host e o endereço IP do cliente e é usado para evitar pesquisas no Sistema de Nomes de Domínio (DNS); veja a Seção 5.1.11.2, “Pesquisas de DNS e o cache de host”.

A variável `host_cache_size` controla o tamanho do cache do host, bem como o tamanho da tabela do Schema de Desempenho `host_cache` que expõe o conteúdo do cache. Definir `host_cache_size` tem esses efeitos:

+ Definindo o tamanho em 0, desativa o cache do host. Com o cache desativado, o servidor realiza uma pesquisa DNS toda vez que um cliente se conecta.

+ Alterar o tamanho no tempo de execução causa uma operação de varredura implícita do cache do host, que limpa o cache do host, trunca a tabela `host_cache` e desbloqueia quaisquer hosts bloqueados.

O valor padrão é dimensionado automaticamente para 128, mais 1 para um valor de `max_connections` até 500, mais 1 para cada incremento de 20 em 500 no valor de `max_connections`, limitado a um limite de 2000.

Usar a opção `--skip-host-cache` é semelhante a definir a variável de sistema `host_cache_size` como 0, mas `host_cache_size` é mais flexível porque também pode ser usado para redimensionar, habilitar e desabilitar o cache do host em tempo de execução, não apenas na inicialização do servidor.

Iniciar o servidor com `--skip-host-cache` não impede alterações no valor de `host_cache_size` durante a execução, mas tais alterações não têm efeito e o cache não é reativado, mesmo se `host_cache_size` for definido como maior que 0.

Definir a variável de sistema `host_cache_size` em vez da opção `--skip-host-cache` é preferível pelas razões mencionadas no parágrafo anterior. Além disso, a opção `--skip-host-cache` é descontinuada no MySQL 8.0, e sua remoção é esperada em uma versão futura do MySQL.

* `hostname`

  <table frame="box" rules="all" summary="Properties for avoid_temporal_upgrade"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--avoid-temporal-upgrade[={OFF|ON}]</code></td> </tr><tr><th>Deprecated</th> <td>Yes</td> </tr><tr><th>System Variable</th> <td><code>avoid_temporal_upgrade</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>OFF</code></td> </tr></tbody></table>6

O servidor define essa variável com o nome do host do servidor na inicialização.

* `identity`

Essa variável é sinônimo da variável `last_insert_id`. Ela existe para compatibilidade com outros sistemas de banco de dados. Você pode ler seu valor com `SELECT @@identity`, e configurá-la usando `SET identity`.

* `ignore_db_dirs`

  <table frame="box" rules="all" summary="Properties for avoid_temporal_upgrade"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--avoid-temporal-upgrade[={OFF|ON}]</code></td> </tr><tr><th>Deprecated</th> <td>Yes</td> </tr><tr><th>System Variable</th> <td><code>avoid_temporal_upgrade</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>OFF</code></td> </tr></tbody></table>7

Uma lista de nomes separados por vírgula que não são considerados como diretórios de banco de dados no diretório de dados. O valor é definido a partir de quaisquer instâncias de `--ignore-db-dir` fornecidas na inicialização do servidor.

A partir do MySQL 5.7.11, `--ignore-db-dir` pode ser usado no momento da inicialização do diretório de dados com **mysqld --initialize** para especificar os diretórios que o servidor deve ignorar para avaliar se um diretório de dados existente é considerado vazio. Veja a Seção 2.9.1, “Inicializando o diretório de dados”.

Essa variável do sistema é desatualizada no MySQL 5.7. Com a introdução do dicionário de dados no MySQL 8.0, ela se tornou superfciosa e foi removida naquela versão.

* `init_connect`

  <table frame="box" rules="all" summary="Properties for avoid_temporal_upgrade"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--avoid-temporal-upgrade[={OFF|ON}]</code></td> </tr><tr><th>Deprecated</th> <td>Yes</td> </tr><tr><th>System Variable</th> <td><code>avoid_temporal_upgrade</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>OFF</code></td> </tr></tbody></table>8

Uma cadeia a ser executada pelo servidor para cada cliente que se conecta. A cadeia consiste em uma ou mais instruções SQL, separadas por caracteres ponto e vírgula.

Para os usuários que possuem o privilégio `SUPER`, o conteúdo de `init_connect` não é executado. Isso é feito para que um valor errôneo para `init_connect` não impeça que todos os clientes se conectem. Por exemplo, o valor pode conter uma declaração com um erro de sintaxe, causando assim o fracasso das conexões dos clientes. Não executar `init_connect` para usuários que possuem o privilégio `SUPER` permite que eles abram uma conexão e corrijam o valor de `init_connect`.

A partir do MySQL 5.7.22, a execução de `init_connect` é ignorada para qualquer usuário cliente com uma senha expirada. Isso é feito porque tal usuário não pode executar instruções arbitrárias, e, portanto, a execução de `init_connect` falha, deixando o cliente incapaz de se conectar. Ignorar a execução de `init_connect` permite que o usuário se conecte e mude a senha.

O servidor descarta quaisquer conjuntos de resultados produzidos por declarações no valor de `init_connect`.

* `init_file`

  <table frame="box" rules="all" summary="Properties for avoid_temporal_upgrade"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--avoid-temporal-upgrade[={OFF|ON}]</code></td> </tr><tr><th>Deprecated</th> <td>Yes</td> </tr><tr><th>System Variable</th> <td><code>avoid_temporal_upgrade</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>OFF</code></td> </tr></tbody></table>9

Se especificado, essa variável nomeia um arquivo que contém declarações SQL a serem lidas e executadas durante o processo de inicialização. Cada declaração deve estar em uma única string e não deve incluir comentários.

Se o servidor for iniciado com qualquer uma das opções `--bootstrap`, `--initialize` ou `--initialize-insecure`, ele opera no modo bootstap e algumas funcionalidades não estão disponíveis, o que limita as declarações permitidas no arquivo. Essas incluem declarações relacionadas à gestão de contas (como `CREATE USER` ou `GRANT`), replicação e identificadores de transação global. Veja a Seção 16.1.3, “Replicação com Identificadores de Transação Global”.

* `innodb_xxx`

As variáveis de sistema do sistema `InnoDB` estão listadas na Seção 14.15, “Opções de inicialização e variáveis de sistema do InnoDB”. Essas variáveis controlam muitos aspectos do armazenamento, uso de memória e padrões de E/S para as tabelas do `InnoDB`, e são especialmente importantes agora que o `InnoDB` é o motor de armazenamento padrão.

* `insert_id`

O valor a ser utilizado pela seguinte declaração `INSERT` ou `ALTER TABLE` ao inserir um valor `AUTO_INCREMENT`. Este é utilizado principalmente com o log binário.

* `interactive_timeout`

  <table frame="box" rules="all" summary="Properties for back_log"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--back-log=#</code></td> </tr><tr><th>System Variable</th> <td><code>back_log</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Valor padrão</th> <td><code>-1</code>(significa autodimensionamento; não atribua este valor literal)</td> </tr><tr><th>Minimum Value</th> <td><code>1</code></td> </tr><tr><th>Maximum Value</th> <td><code>65535</code></td> </tr></tbody></table>0

O número de segundos que o servidor espera por atividade em uma conexão interativa antes de fechá-la. Um cliente interativo é definido como um cliente que usa a opção `CLIENT_INTERACTIVE` para `mysql_real_connect()`. Veja também `wait_timeout`.

* `internal_tmp_disk_storage_engine`

  <table frame="box" rules="all" summary="Properties for back_log"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--back-log=#</code></td> </tr><tr><th>System Variable</th> <td><code>back_log</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Valor padrão</th> <td><code>-1</code>(significa autodimensionamento; não atribua este valor literal)</td> </tr><tr><th>Minimum Value</th> <td><code>1</code></td> </tr><tr><th>Maximum Value</th> <td><code>65535</code></td> </tr></tbody></table>1

O mecanismo de armazenamento para tabelas internas temporárias em disco (consulte a Seção 8.4.4, “Uso de Tabela Temporária Interna no MySQL”). Os valores permitidos são `MYISAM` e `INNODB` (o padrão).

O otimizador utiliza o mecanismo de armazenamento definido por `internal_tmp_disk_storage_engine` para tabelas temporárias internas em disco.

Quando usa `internal_tmp_disk_storage_engine=INNODB` (o padrão), as consultas que geram tabelas internas temporárias no disco que excedem os limites de string ou coluna de `InnoDB` retornam erros de Tamanho de string muito grande ou Muitas colunas. A solução é definir `internal_tmp_disk_storage_engine` para `MYISAM`.

* `join_buffer_size`

  <table frame="box" rules="all" summary="Properties for back_log"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--back-log=#</code></td> </tr><tr><th>System Variable</th> <td><code>back_log</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Valor padrão</th> <td><code>-1</code>(significa autodimensionamento; não atribua este valor literal)</td> </tr><tr><th>Minimum Value</th> <td><code>1</code></td> </tr><tr><th>Maximum Value</th> <td><code>65535</code></td> </tr></tbody></table>2

O tamanho mínimo do buffer que é usado para varreduras de índice simples, varreduras de índice de intervalo e junções que não usam índices e, portanto, realizam varreduras completas da tabela. Normalmente, a melhor maneira de obter junções rápidas é adicionar índices. Aumente o valor de `join_buffer_size` para obter uma junção completa mais rápida quando não é possível adicionar índices. Um buffer de junção é alocado para cada junção completa entre duas tabelas. Para uma junção complexa entre várias tabelas para as quais não são usados índices, pode ser necessário múltiplos buffers de junção.

O padrão é de 256 KB. O ajuste máximo permitido para `join_buffer_size` é de 4 GB−1. Valores maiores são permitidos para plataformas de 64 bits (exceto o Windows de 64 bits, para o qual valores grandes são truncados para 4 GB−1 com um aviso). O tamanho do bloco é de 128, e um valor que não é um múltiplo exato do tamanho do bloco é arredondado para o próximo múltiplo inferior do tamanho do bloco pelo MySQL Server antes de armazenar o valor para a variável do sistema. O analisador permite valores até o valor máximo de inteiro não assinado para a plataforma (4294967295 ou 232−1 para um sistema de 32 bits, 18446744073709551615 ou 264−1 para um sistema de 64 bits) mas o máximo real é um tamanho de bloco menor.

A menos que um algoritmo de Bloco em Nó Fechado ou Acesso a Chave em Massa seja usado, não há ganho em definir o buffer maior do que o necessário para conter cada string correspondente, e todas as junções alocam pelo menos o tamanho mínimo, então use cautela ao definir essa variável para um valor grande globalmente. É melhor manter a configuração global pequena e alterar a configuração da sessão para um valor maior apenas em sessões que estão realizando junções grandes. O tempo de alocação de memória pode causar quedas substanciais de desempenho se o tamanho global for maior do que o necessário pela maioria das consultas que o utilizam.

Quando o Bloco de Busca Envolvente é usado, um buffer de junção maior pode ser benéfico até o ponto em que todas as colunas necessárias de todas as strings da primeira tabela são armazenadas no buffer de junção. Isso depende da consulta; o tamanho ótimo pode ser menor do que manter todas as strings das primeiras tabelas.

Quando o Batched Key Access é usado, o valor de `join_buffer_size` define o tamanho do lote de chaves em cada solicitação ao motor de armazenamento. Quanto maior o buffer, mais acesso sequencial é feito à tabela direita de uma operação de junção, o que pode melhorar significativamente o desempenho.

Para informações adicionais sobre junção com buffer, consulte a Seção 8.2.1.6, “Algoritmos de junção de laço aninhado”. Para informações sobre Acesso de Chave em lote, consulte a Seção 8.2.1.11, “Joins de Bloco de Laço Aninhado e Acesso de Chave em lote”.

* `keep_files_on_create`

  <table frame="box" rules="all" summary="Properties for back_log"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--back-log=#</code></td> </tr><tr><th>System Variable</th> <td><code>back_log</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Valor padrão</th> <td><code>-1</code>(significa autodimensionamento; não atribua este valor literal)</td> </tr><tr><th>Minimum Value</th> <td><code>1</code></td> </tr><tr><th>Maximum Value</th> <td><code>65535</code></td> </tr></tbody></table>3

Se uma tabela `MyISAM` for criada sem a opção `DATA DIRECTORY`, o arquivo `.MYD` será criado no diretório do banco de dados. Por padrão, se `MyISAM` encontrar um arquivo existente `.MYD` neste caso, ele o sobrescreverá. O mesmo se aplica aos arquivos `.MYI` para tabelas criadas sem a opção `INDEX DIRECTORY`. Para suprimir esse comportamento, defina a variável `keep_files_on_create` para `ON` (1), caso em que `MyISAM` não sobrescreverá os arquivos existentes e retornará um erro em vez disso. O valor padrão é `OFF` (0).

Se uma tabela `MyISAM` for criada com a opção `DATA DIRECTORY` ou `INDEX DIRECTORY` e um arquivo existente `.MYD` ou `.MYI` for encontrado, o MyISAM sempre retorna um erro. Não sobrescreve um arquivo no diretório especificado.

* `key_buffer_size`

  <table frame="box" rules="all" summary="Properties for back_log"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--back-log=#</code></td> </tr><tr><th>System Variable</th> <td><code>back_log</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Valor padrão</th> <td><code>-1</code>(significa autodimensionamento; não atribua este valor literal)</td> </tr><tr><th>Minimum Value</th> <td><code>1</code></td> </tr><tr><th>Maximum Value</th> <td><code>65535</code></td> </tr></tbody></table>4

Os blocos de índice para as tabelas de `MyISAM` são armazenados em memória e são compartilhados por todos os threads. `key_buffer_size` é o tamanho do buffer utilizado para os blocos de índice. O buffer de chave também é conhecido como cache de chave.

O ajuste mínimo permitido é 0, mas você não pode definir `key_buffer_size` para 0 dinamicamente. Um ajuste de 0 elimina o cache de chave, o que não é permitido no tempo de execução. Definir `key_buffer_size` para 0 é permitido apenas no início, caso em que o cache de chave não é inicializado. Alterar o ajuste de `key_buffer_size` no tempo de execução de um valor de 0 para um valor não nulo permitido inicializa o cache de chave.

`key_buffer_size` pode ser aumentado ou diminuído apenas em incrementos ou múltiplos de 4096 bytes. Aumentar ou diminuir o ajuste por um valor não conforme produz um aviso e truncá-lo para um valor conforme.

O ajuste máximo permitido para `key_buffer_size` é 4GB−1 em plataformas de 32 bits. Valores maiores são permitidos para plataformas de 64 bits. O tamanho máximo efetivo pode ser menor, dependendo do RAM físico disponível e dos limites de RAM por processo impostos pelo sistema operacional ou pela plataforma de hardware. O valor desta variável indica a quantidade de memória solicitada. Internamente, o servidor aloca a maior quantidade possível de memória até esse valor, mas a alocação real pode ser menor.

Você pode aumentar o valor para obter uma melhor manipulação do índice para todas as leituras e múltiplos escritos; em um sistema cuja função principal é executar o MySQL usando o mecanismo de armazenamento `MyISAM`, 25% da memória total da máquina é um valor aceitável para esta variável. No entanto, você deve estar ciente de que, se você fizer o valor muito grande (por exemplo, mais de 50% da memória total da máquina), seu sistema pode começar a fazer paginação e tornar-se extremamente lento. Isso ocorre porque o MySQL depende do sistema operacional para realizar o cache do sistema de arquivos para leituras de dados, então você deve deixar algum espaço para o cache do sistema de arquivos. Você também deve considerar os requisitos de memória de quaisquer outros mecanismos de armazenamento que você possa estar usando além de `MyISAM`.

Para obter ainda mais velocidade ao escrever muitas strings ao mesmo tempo, use `LOCK TABLES`. Veja a Seção 8.2.4.1, “Otimizando os comandos INSERT”.

Você pode verificar o desempenho do buffer principal emitindo uma declaração `SHOW STATUS` e examinando as variáveis de status `Key_read_requests`, `Key_reads`, `Key_write_requests` e `Key_writes`. (Veja a Seção 13.7.5, “Declarações SHOW”.) A proporção `Key_reads/Key_read_requests` normalmente deve ser menor que 0,01. A proporção `Key_writes/Key_write_requests` geralmente está próxima de 1 se você estiver usando principalmente atualizações e exclusões, mas pode ser muito menor se você tende a fazer atualizações que afetam muitas strings ao mesmo tempo ou se estiver usando a opção de tabela `DELAY_KEY_WRITE`.

A fração do buffer de chave em uso pode ser determinada usando `key_buffer_size` em conjunto com a variável de status `Key_blocks_unused` e o tamanho do bloco do buffer, que está disponível a partir da variável de sistema `key_cache_block_size`:

  ```sql
  1 - ((Key_blocks_unused * key_cache_block_size) / key_buffer_size)
  ```

Esse valor é uma aproximação, pois alguns espaços no buffer de chave são alocados internamente para estruturas administrativas. Os fatores que influenciam a quantidade de overhead dessas estruturas incluem o tamanho do bloco e o tamanho do ponteiro. À medida que o tamanho do bloco aumenta, a porcentagem do buffer de chave perdida para overhead tende a diminuir. Blocos maiores resultam em um menor número de operações de leitura (porque mais chaves são obtidas por leitura), mas, inversamente, um aumento nas leituras de chaves que não são examinadas (se nem todas as chaves em um bloco são relevantes para uma consulta).

É possível criar vários caches de chave `MyISAM`. O limite de tamanho de 4 GB se aplica a cada cache individualmente, não como um grupo. Veja a Seção 8.10.2, “O cache de chave MyISAM”.

* `key_cache_age_threshold`

  <table frame="box" rules="all" summary="Properties for back_log"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--back-log=#</code></td> </tr><tr><th>System Variable</th> <td><code>back_log</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Valor padrão</th> <td><code>-1</code>(significa autodimensionamento; não atribua este valor literal)</td> </tr><tr><th>Minimum Value</th> <td><code>1</code></td> </tr><tr><th>Maximum Value</th> <td><code>65535</code></td> </tr></tbody></table>5

Este valor controla a demissão dos buffers da sublista quente de um cache de chave para a sublista quente. Valores mais baixos fazem com que a demissão aconteça mais rapidamente. O valor mínimo é 100. O valor padrão é 300. Veja a Seção 8.10.2, “O cache de chave MyISAM”.

* `key_cache_block_size`

  <table frame="box" rules="all" summary="Properties for back_log"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--back-log=#</code></td> </tr><tr><th>System Variable</th> <td><code>back_log</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Valor padrão</th> <td><code>-1</code>(significa autodimensionamento; não atribua este valor literal)</td> </tr><tr><th>Minimum Value</th> <td><code>1</code></td> </tr><tr><th>Maximum Value</th> <td><code>65535</code></td> </tr></tbody></table>6

O tamanho em bytes dos blocos na cache de chave. O valor padrão é 1024. Veja a Seção 8.10.2, “A cache de chave MyISAM”.

* `key_cache_division_limit`

  <table frame="box" rules="all" summary="Properties for back_log"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--back-log=#</code></td> </tr><tr><th>System Variable</th> <td><code>back_log</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Valor padrão</th> <td><code>-1</code>(significa autodimensionamento; não atribua este valor literal)</td> </tr><tr><th>Minimum Value</th> <td><code>1</code></td> </tr><tr><th>Maximum Value</th> <td><code>65535</code></td> </tr></tbody></table>7

O ponto de divisão entre as sublistas quente e quente da lista de cache de chave. O valor é a porcentagem da lista de buffer a ser usada para a sublista quente. Os valores permitidos variam de 1 a 100. O valor padrão é 100. Veja a Seção 8.10.2, “O cache de chave MyISAM”.

* `large_files_support`

  <table frame="box" rules="all" summary="Properties for back_log"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--back-log=#</code></td> </tr><tr><th>System Variable</th> <td><code>back_log</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Valor padrão</th> <td><code>-1</code>(significa autodimensionamento; não atribua este valor literal)</td> </tr><tr><th>Minimum Value</th> <td><code>1</code></td> </tr><tr><th>Maximum Value</th> <td><code>65535</code></td> </tr></tbody></table>8

Se o `mysqld` foi compilado com opções para suporte a arquivos grandes.

* `large_pages`

  <table frame="box" rules="all" summary="Properties for back_log"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--back-log=#</code></td> </tr><tr><th>System Variable</th> <td><code>back_log</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Valor padrão</th> <td><code>-1</code>(significa autodimensionamento; não atribua este valor literal)</td> </tr><tr><th>Minimum Value</th> <td><code>1</code></td> </tr><tr><th>Maximum Value</th> <td><code>65535</code></td> </tr></tbody></table>9

Se o suporte para páginas grandes estiver habilitado (através da opção `--large-pages`). Veja a Seção 8.12.4.3, “Habilitar o suporte para páginas grandes”.

* `large_page_size`

  <table frame="box" rules="all" summary="Properties for basedir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--basedir=dir_name</code></td> </tr><tr><th>System Variable</th> <td><code>basedir</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th>Type</th> <td>Directory name</td> </tr><tr><th>Default Value</th> <td><code>configuration-dependent default</code></td> </tr></tbody></table>0

Se o suporte a páginas grandes estiver habilitado, isso mostrará o tamanho das páginas de memória. Páginas de memória grandes são suportadas apenas no Linux; em outras plataformas, o valor desta variável é sempre 0. Veja a Seção 8.12.4.3, “Habilitar o suporte a páginas grandes”.

* `last_insert_id`

O valor que deve ser retornado a partir de `LAST_INSERT_ID()`. Este valor é armazenado no log binário quando você usa `LAST_INSERT_ID()` em uma declaração que atualiza uma tabela. Definir essa variável não atualiza o valor retornado pela função C API `mysql_insert_id()`.

* `lc_messages`

  <table frame="box" rules="all" summary="Properties for basedir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--basedir=dir_name</code></td> </tr><tr><th>System Variable</th> <td><code>basedir</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th>Type</th> <td>Directory name</td> </tr><tr><th>Default Value</th> <td><code>configuration-dependent default</code></td> </tr></tbody></table>1

O local a ser usado para mensagens de erro. O padrão é `en_US`. O servidor converte o argumento em um nome de idioma e o combina com o valor de `lc_messages_dir` para produzir a localização do arquivo de mensagem de erro. Veja a Seção 10.12, “Definindo o idioma da mensagem de erro”.

* `lc_messages_dir`

  <table frame="box" rules="all" summary="Properties for basedir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--basedir=dir_name</code></td> </tr><tr><th>System Variable</th> <td><code>basedir</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th>Type</th> <td>Directory name</td> </tr><tr><th>Default Value</th> <td><code>configuration-dependent default</code></td> </tr></tbody></table>2

O diretório onde as mensagens de erro estão localizadas. O servidor usa o valor juntamente com o valor de `lc_messages` para produzir a localização do arquivo de mensagem de erro. Veja a Seção 10.12, “Definindo o idioma da mensagem de erro”.

* `lc_time_names`

  <table frame="box" rules="all" summary="Properties for basedir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--basedir=dir_name</code></td> </tr><tr><th>System Variable</th> <td><code>basedir</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th>Type</th> <td>Directory name</td> </tr><tr><th>Default Value</th> <td><code>configuration-dependent default</code></td> </tr></tbody></table>3

Essa variável especifica o local que controla o idioma usado para exibir os nomes e abreviações de dia e mês. Essa variável afeta a saída das funções `DATE_FORMAT()`, `DAYNAME()` e `MONTHNAME()`. Os nomes do local são valores em estilo POSIX, como `'ja_JP'` ou `'pt_BR'`. O valor padrão é `'en_US'`, independentemente da configuração do local do sistema. Para mais informações, consulte a Seção 10.16, “Suporte ao Local do MySQL Server”.

* `license`

  <table frame="box" rules="all" summary="Properties for basedir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--basedir=dir_name</code></td> </tr><tr><th>System Variable</th> <td><code>basedir</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th>Type</th> <td>Directory name</td> </tr><tr><th>Default Value</th> <td><code>configuration-dependent default</code></td> </tr></tbody></table>4

O tipo de licença que o servidor tem.

* `local_infile`

  <table frame="box" rules="all" summary="Properties for basedir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--basedir=dir_name</code></td> </tr><tr><th>System Variable</th> <td><code>basedir</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th>Type</th> <td>Directory name</td> </tr><tr><th>Default Value</th> <td><code>configuration-dependent default</code></td> </tr></tbody></table>5

Essa variável controla a capacidade do servidor `LOCAL` para as declarações `LOAD DATA`. Dependendo da configuração do `local_infile`, o servidor pode recusar ou permitir o carregamento de dados locais por clientes que têm `LOCAL` habilitado no lado do cliente.

Para explicitamente fazer com que o servidor recuse ou permita as declarações `LOAD DATA LOCAL` (independentemente de como os programas e bibliotecas do cliente são configurados no momento da construção ou no tempo de execução), inicie `mysqld` com `local_infile` desativado ou ativado, respectivamente. `local_infile` também pode ser definido no tempo de execução. Para mais informações, consulte a Seção 6.1.6, “Considerações de segurança para LOAD DATA LOCAL”.

* `lock_wait_timeout`

  <table frame="box" rules="all" summary="Properties for basedir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--basedir=dir_name</code></td> </tr><tr><th>System Variable</th> <td><code>basedir</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th>Type</th> <td>Directory name</td> </tr><tr><th>Default Value</th> <td><code>configuration-dependent default</code></td> </tr></tbody></table>6

Esta variável especifica o tempo de espera em segundos para tentativas de adquirir bloqueios de metadados. Os valores permitidos variam de 1 a 31536000 (1 ano). O padrão é 31536000.

Esse tempo de espera se aplica a todas as declarações que utilizam bloqueios de metadados. Isso inclui operações DML e DDL em tabelas, visualizações, procedimentos armazenados e funções armazenadas, bem como as declarações `LOCK TABLES`, `FLUSH TABLES WITH READ LOCK` e `HANDLER`.

Esse tempo de espera não se aplica a acessos implícitos a tabelas do sistema no banco de dados `mysql`, como as tabelas de concessão modificadas por declarações `GRANT` ou `REVOKE` ou declarações de registro de tabela. O tempo de espera se aplica a tabelas do sistema acessadas diretamente, como com `SELECT` ou `UPDATE`.

O valor do tempo de espera se aplica separadamente para cada tentativa de bloqueio de metadados. Uma declaração dada pode exigir mais de um bloqueio, portanto, é possível que a declaração bloqueie por mais tempo do que o valor de `lock_wait_timeout` antes de relatar um erro de tempo de espera. Quando ocorre o tempo de espera do bloqueio, `ER_LOCK_WAIT_TIMEOUT` é relatado.

`lock_wait_timeout` não se aplica a inserções atrasadas, que sempre são executadas com um tempo limite de 1 ano. Isso é feito para evitar tempos limites desnecessários, pois uma sessão que emite uma inserção atrasada não recebe notificação sobre os tempos limites de inserção atrasada.

* `locked_in_memory`

  <table frame="box" rules="all" summary="Properties for basedir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--basedir=dir_name</code></td> </tr><tr><th>System Variable</th> <td><code>basedir</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th>Type</th> <td>Directory name</td> </tr><tr><th>Default Value</th> <td><code>configuration-dependent default</code></td> </tr></tbody></table>7

Se o `mysqld` foi bloqueado na memória com o `--memlock`.

* `log_error`

  <table frame="box" rules="all" summary="Properties for basedir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--basedir=dir_name</code></td> </tr><tr><th>System Variable</th> <td><code>basedir</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th>Type</th> <td>Directory name</td> </tr><tr><th>Default Value</th> <td><code>configuration-dependent default</code></td> </tr></tbody></table>8

O destino da saída do log de erro. Se o destino for o console, o valor é `stderr`. Caso contrário, o destino é um arquivo e o valor `log_error` é o nome do arquivo. Veja a Seção 5.4.2, “O Log de Erro”.

* `log_error_verbosity`

  <table frame="box" rules="all" summary="Properties for basedir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--basedir=dir_name</code></td> </tr><tr><th>System Variable</th> <td><code>basedir</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th>Type</th> <td>Directory name</td> </tr><tr><th>Default Value</th> <td><code>configuration-dependent default</code></td> </tr></tbody></table>9

A verbosidade do servidor ao escrever mensagens de erro, aviso e nota no log de erro. O quadro a seguir mostra os valores permitidos. O padrão é 3.

  <table frame="box" rules="all" summary="Properties for big_tables"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--big-tables[={OFF|ON}]</code></td> </tr><tr><th>System Variable</th> <td><code>big_tables</code></td> </tr><tr><th>Scope</th> <td>Global, Session</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>OFF</code></td> </tr></tbody></table>0

`log_error_verbosity` foi adicionado no MySQL 5.7.2. É preferido e deve ser usado em vez da antiga variável de sistema `log_warnings`. Consulte a descrição de `log_warnings` para informações sobre como essa variável se relaciona com `log_error_verbosity`. Em particular, atribuir um valor a `log_warnings` atribui um valor a `log_error_verbosity` e vice-versa.

* `log_output`

  <table frame="box" rules="all" summary="Properties for big_tables"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--big-tables[={OFF|ON}]</code></td> </tr><tr><th>System Variable</th> <td><code>big_tables</code></td> </tr><tr><th>Scope</th> <td>Global, Session</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>OFF</code></td> </tr></tbody></table>1

O destino ou destinos para o registro de consulta geral e o registro de consulta lenta. O valor é uma lista com uma ou mais palavras separadas por vírgula escolhidas de `TABLE`, `FILE` e `NONE`. `TABLE` seleciona o registro para os arquivos de registro dos bancos de dados `general_log` e `slow_log` do sistema `mysql`. `FILE` seleciona o registro para arquivos de registro. `NONE` desativa o registro. Se `NONE` estiver presente no valor, ele tem precedência sobre qualquer outra palavra presente. `TABLE` e `FILE` podem ser dados para selecionar ambos os destinos de saída de log.

Essa variável seleciona destinos de saída de log, mas não habilita a saída de log. Para fazer isso, habilite as variáveis de sistema `general_log` e `slow_query_log`. Para o registro de `FILE`, as variáveis de sistema `general_log_file` e `slow_query_log_file` determinam os locais dos arquivos de log. Para mais informações, consulte a Seção 5.4.1, “Selecionando destinos de saída de log de consulta geral e log de consulta lenta”.

* `log_queries_not_using_indexes`

  <table frame="box" rules="all" summary="Properties for big_tables"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--big-tables[={OFF|ON}]</code></td> </tr><tr><th>System Variable</th> <td><code>big_tables</code></td> </tr><tr><th>Scope</th> <td>Global, Session</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>OFF</code></td> </tr></tbody></table>2

Se você ativar essa variável com o registro de consultas lentas ativado, as consultas que devem recuperar todas as strings serão registradas. Veja a Seção 5.4.5, “O Registro de Consultas Lentas”. Esta opção não significa necessariamente que nenhum índice é usado. Por exemplo, uma consulta que usa uma varredura de índice completo usa um índice, mas seria registrada porque o índice não limitaria o número de strings.

* `log_slow_admin_statements`

  <table frame="box" rules="all" summary="Properties for big_tables"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--big-tables[={OFF|ON}]</code></td> </tr><tr><th>System Variable</th> <td><code>big_tables</code></td> </tr><tr><th>Scope</th> <td>Global, Session</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>OFF</code></td> </tr></tbody></table>3

Inclua declarações administrativas lentas nas declarações escritas no log de consulta lenta. As declarações administrativas incluem `ALTER TABLE`, `ANALYZE TABLE`, `CHECK TABLE`, `CREATE INDEX`, `DROP INDEX`, `OPTIMIZE TABLE` e `REPAIR TABLE`.

* `log_syslog`

  <table frame="box" rules="all" summary="Properties for big_tables"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--big-tables[={OFF|ON}]</code></td> </tr><tr><th>System Variable</th> <td><code>big_tables</code></td> </tr><tr><th>Scope</th> <td>Global, Session</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>OFF</code></td> </tr></tbody></table>4

Se deve escrever a saída do log de erro no log do sistema. Este é o Diálogo de Eventos no Windows e `syslog` em sistemas Unix e Unix-like. O valor padrão é específico da plataforma:

+ No Windows, a saída do Diário de eventos é ativada por padrão.  
+ Em sistemas Unix e Unix-like, a saída de `syslog` é desativada por padrão.

Independentemente do padrão, `log_syslog` pode ser configurado explicitamente para controlar a saída em qualquer plataforma compatível.

O controle de saída do log do sistema é distinto da transmissão de saída de erro para um arquivo ou o console. A saída de erro pode ser direcionada para um arquivo ou o console, além ou em vez do log do sistema, conforme desejado. Veja a Seção 5.4.2, “O Log de Erro”.

* `log_syslog_facility`

  <table frame="box" rules="all" summary="Properties for big_tables"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--big-tables[={OFF|ON}]</code></td> </tr><tr><th>System Variable</th> <td><code>big_tables</code></td> </tr><tr><th>Scope</th> <td>Global, Session</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>OFF</code></td> </tr></tbody></table>5

A opção de saída do log de erro escrita em `syslog` (que tipo de programa está enviando a mensagem). Esta variável não tem efeito a menos que a variável de sistema `log_syslog` esteja habilitada. Veja a Seção 5.4.2.3, “Registro de Erro no Log do Sistema”.

Os valores permitidos podem variar de acordo com o sistema operacional; consulte a documentação do seu sistema `syslog`.

Essa variável não existe no Windows.

* `log_syslog_include_pid`

  <table frame="box" rules="all" summary="Properties for big_tables"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--big-tables[={OFF|ON}]</code></td> </tr><tr><th>System Variable</th> <td><code>big_tables</code></td> </tr><tr><th>Scope</th> <td>Global, Session</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>OFF</code></td> </tr></tbody></table>6

Se deve incluir o ID do processo do servidor em cada string de saída do log de erro escrito em `syslog`. Essa variável não tem efeito a menos que a variável de sistema `log_syslog` esteja habilitada. Veja a Seção 5.4.2.3, “Registro de Erros no Log do Sistema”.

Essa variável não existe no Windows.

* `log_syslog_tag`

  <table frame="box" rules="all" summary="Properties for big_tables"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--big-tables[={OFF|ON}]</code></td> </tr><tr><th>System Variable</th> <td><code>big_tables</code></td> </tr><tr><th>Scope</th> <td>Global, Session</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>OFF</code></td> </tr></tbody></table>7

A tag a ser adicionada ao identificador do servidor na saída do log de erro escrito em `syslog`. Essa variável não tem efeito a menos que a variável de sistema `log_syslog` esteja habilitada. Veja a Seção 5.4.2.3, “Registro de Erros no Log do Sistema”.

Por padrão, o identificador do servidor é `mysqld` sem nenhuma tag. Se um valor de tag de *`tag`* for especificado, ele será anexado ao identificador do servidor com um hífen inicial, resultando em um identificador de `mysqld-tag`.

Em Windows, para usar uma etiqueta que não existe, o servidor deve ser executado a partir de uma conta com privilégios de administrador, para permitir a criação de uma entrada de registro para a etiqueta. Privilegios elevados não são necessários se a etiqueta já existir.

* `log_timestamps`

  <table frame="box" rules="all" summary="Properties for big_tables"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--big-tables[={OFF|ON}]</code></td> </tr><tr><th>System Variable</th> <td><code>big_tables</code></td> </tr><tr><th>Scope</th> <td>Global, Session</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>OFF</code></td> </tr></tbody></table>8

Essa variável controla o fuso horário dos timestamps em mensagens escritas no log de erro e, em geral, em mensagens de log de consulta e log de consulta lenta escritas em arquivos. Não afeta o fuso horário dos timestamps de mensagens de log de consulta geral e log de consulta lenta escritas em tabelas (`mysql.general_log`, `mysql.slow_log`). As strings recuperadas dessas tabelas podem ser convertidas do fuso horário do sistema local para qualquer fuso horário desejado com `CONVERT_TZ()` ou definindo a variável de sistema de sessão `time_zone`.

Os valores permitidos `log_timestamps` são `UTC` (padrão) e `SYSTEM` (fuso horário do sistema local).

Os timestamps são escritos no formato ISO 8601 / RFC 3339: `YYYY-MM-DDThh:mm:ss.uuuuuu` mais um valor de cauda de `Z`, indicando o horário Zulu (UTC) ou `±hh:mm` (um deslocamento em relação ao UTC).

* `log_throttle_queries_not_using_indexes`

  <table frame="box" rules="all" summary="Properties for big_tables"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--big-tables[={OFF|ON}]</code></td> </tr><tr><th>System Variable</th> <td><code>big_tables</code></td> </tr><tr><th>Scope</th> <td>Global, Session</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>OFF</code></td> </tr></tbody></table>9

Se `log_queries_not_using_indexes` estiver habilitado, a variável `log_throttle_queries_not_using_indexes` limita o número de consultas desse tipo por minuto que podem ser escritas no log de consultas lentas. Um valor de 0 (padrão) significa “sem limite”. Para mais informações, consulte a Seção 5.4.5, “O log de consultas lentas”.

* `log_warnings`

  <table summary="Permitted values for the authentication_windows system variable."><col style="width: 10%"/><col style="width: 75%"/><thead><tr> <th>Value</th> <th>Descrição</th> </tr></thead><tbody><tr> <td>0</td> <td>Sem registro</td> </tr><tr> <td>1</td> <td>Registre apenas mensagens de erro</td> </tr><tr> <td>2</td> <td>Mensagens de nível 1 de log e mensagens de alerta</td> </tr><tr> <td>3</td> <td>Mensagens de nível 2 de log e notas de informação</td> </tr><tr> <td>4</td> <td>Mensagens de nível 3 de log e mensagens de depuração</td> </tr></tbody></table>00

Se deve produzir mensagens de alerta adicionais no log de erro. A partir do MySQL 5.7.2, os itens de informações anteriormente regidos por `log_warnings` são regidos por `log_error_verbosity`, que é preferido e deve ser usado em vez do sistema de variável mais antigo `log_warnings`. (A variável de sistema `log_warnings` e a opção de string de comando `--log-warnings` são desatualizadas; espera-se que elas sejam removidas em uma versão futura do MySQL.)

`log_warnings` é habilitado por padrão (o padrão é 1 antes do MySQL 5.7.2, 2 a partir do 5.7.2). Para desabilitá-lo, configure-o para 0. Se o valor for maior que 0, o servidor registra mensagens sobre declarações que são inseguras para o registro baseado em declarações. Se o valor for maior que 1, o servidor registra conexões abortadas e erros de negação de acesso para novas tentativas de conexão. Veja a Seção B.3.2.9, “Erros de Comunicação e Conexões Abortadas”.

Se você usa replicação, é recomendável habilitar essa variável, definindo-a maior que 0, para obter mais informações sobre o que está acontecendo, como mensagens sobre falhas de rede e reconexões.

Se um servidor de replicação for iniciado com `log_warnings` habilitado, a replica imprime mensagens no log de erro para fornecer informações sobre seu status, como as coordenadas do log binário e do log de releio onde ele inicia seu trabalho, quando está passando para outro log de releio, quando se reconecta após uma desconexão, e assim por diante.

Atribuir um valor a `log_warnings` atribui um valor a `log_error_verbosity` e vice-versa. As variáveis estão relacionadas da seguinte forma:

A supressão de todos os itens do `log_warnings`, alcançada com o `log_warnings=0`, é alcançada com o `log_error_verbosity=1` (apenas erros).

+ Os itens impressos para `log_warnings=1` ou superior são considerados avisos e são impressos para `log_error_verbosity=2` ou superior.

+ Os itens impressos para `log_warnings=2` são considerados notas e são impressos para `log_error_verbosity=3`.

A partir do MySQL 5.7.2, o nível de registro padrão é controlado por `log_error_verbosity`, que tem um valor padrão de 3. Além disso, o padrão para `log_warnings` muda de 1 para 2, o que corresponde a `log_error_verbosity=3`. Para obter um nível de registro semelhante ao padrão anterior, configure `log_error_verbosity=2`.

Em MySQL 5.7.2 e versões posteriores, o uso de `log_warnings` ainda é permitido, mas corresponde ao uso de `log_error_verbosity` da seguinte forma:

+ Definir `log_warnings=0` é equivalente a `log_error_verbosity=1` (erros apenas).

+ Definir `log_warnings=1` é equivalente a `log_error_verbosity=2` (erros, avisos).

Definir `log_warnings=2` (ou superior) é equivalente a `log_error_verbosity=3` (erros, avisos e notas), e o servidor define `log_warnings` para 2 se um valor maior for especificado.

* `long_query_time`

  <table summary="Permitted values for the authentication_windows system variable."><col style="width: 10%"/><col style="width: 75%"/><thead><tr> <th>Value</th> <th>Descrição</th> </tr></thead><tbody><tr> <td>0</td> <td>Sem registro</td> </tr><tr> <td>1</td> <td>Registre apenas mensagens de erro</td> </tr><tr> <td>2</td> <td>Mensagens de nível 1 de log e mensagens de alerta</td> </tr><tr> <td>3</td> <td>Mensagens de nível 2 de log e notas de informação</td> </tr><tr> <td>4</td> <td>Mensagens de nível 3 de log e mensagens de depuração</td> </tr></tbody></table>01

Se uma consulta demorar mais do que esse número de segundos, o servidor incrementa a variável de status `Slow_queries`. Se o registro de consultas lentas estiver habilitado, a consulta é registrada no arquivo de registro de consultas lentas. Esse valor é medido em tempo real, não em tempo de CPU, portanto, uma consulta que está abaixo do limite em um sistema com carga leve pode estar acima do limite em um sistema com carga pesada. Os valores mínimo e padrão de `long_query_time` são 0 e 10, respectivamente. O máximo é 31536000, que é 365 dias em segundos. O valor pode ser especificado com uma resolução de microsegundos. Veja a Seção 5.4.5, “O Registro de Consultas Lentas”.

Valores menores desta variável resultam em mais declarações sendo consideradas de longa duração, com o resultado de que é necessário mais espaço para o log de consulta lenta. Para valores muito pequenos (menos de um segundo), o log pode crescer bastante em um curto período de tempo. Aumentar o número de declarações consideradas de longa duração também pode resultar em falsos positivos para o alerta “Número excessivo de processos de longa duração” no MySQL Enterprise Monitor, especialmente se a Replicação por Grupo estiver habilitada. Por essas razões, valores muito pequenos devem ser usados apenas em ambientes de teste, ou, em ambientes de produção, apenas por um curto período.

* `low_priority_updates`

  <table summary="Permitted values for the authentication_windows system variable."><col style="width: 10%"/><col style="width: 75%"/><thead><tr> <th>Value</th> <th>Descrição</th> </tr></thead><tbody><tr> <td>0</td> <td>Sem registro</td> </tr><tr> <td>1</td> <td>Registre apenas mensagens de erro</td> </tr><tr> <td>2</td> <td>Mensagens de nível 1 de log e mensagens de alerta</td> </tr><tr> <td>3</td> <td>Mensagens de nível 2 de log e notas de informação</td> </tr><tr> <td>4</td> <td>Mensagens de nível 3 de log e mensagens de depuração</td> </tr></tbody></table>02

Se definido como `1`, todas as declarações `INSERT`, `UPDATE`, `DELETE` e `LOCK TABLE WRITE` aguardam até que não haja nenhum `SELECT` ou `LOCK TABLE READ` pendente na tabela afetada. O mesmo efeito pode ser obtido usando `{INSERT | REPLACE | DELETE | UPDATE} LOW_PRIORITY ...` para reduzir a prioridade de apenas uma consulta. Esta variável afeta apenas os motores de armazenamento que usam apenas bloqueio de nível de tabela (como `MyISAM`, `MEMORY` e `MERGE`). Veja a Seção 8.11.2, “Problemas de Bloqueio de Tabela”.

* `lower_case_file_system`

  <table summary="Permitted values for the authentication_windows system variable."><col style="width: 10%"/><col style="width: 75%"/><thead><tr> <th>Value</th> <th>Descrição</th> </tr></thead><tbody><tr> <td>0</td> <td>Sem registro</td> </tr><tr> <td>1</td> <td>Registre apenas mensagens de erro</td> </tr><tr> <td>2</td> <td>Mensagens de nível 1 de log e mensagens de alerta</td> </tr><tr> <td>3</td> <td>Mensagens de nível 2 de log e notas de informação</td> </tr><tr> <td>4</td> <td>Mensagens de nível 3 de log e mensagens de depuração</td> </tr></tbody></table>03

Essa variável descreve a sensibilidade de maiúsculas e minúsculas dos nomes de arquivos no sistema de arquivos onde o diretório de dados está localizado. `OFF` significa que os nomes de arquivos são sensíveis a maiúsculas e minúsculas, `ON` significa que não são sensíveis a maiúsculas e minúsculas. Essa variável é somente leitura porque reflete um atributo do sistema de arquivos e configurá-la não teria efeito no sistema de arquivos.

* `lower_case_table_names`

  <table summary="Permitted values for the authentication_windows system variable."><col style="width: 10%"/><col style="width: 75%"/><thead><tr> <th>Value</th> <th>Descrição</th> </tr></thead><tbody><tr> <td>0</td> <td>Sem registro</td> </tr><tr> <td>1</td> <td>Registre apenas mensagens de erro</td> </tr><tr> <td>2</td> <td>Mensagens de nível 1 de log e mensagens de alerta</td> </tr><tr> <td>3</td> <td>Mensagens de nível 2 de log e notas de informação</td> </tr><tr> <td>4</td> <td>Mensagens de nível 3 de log e mensagens de depuração</td> </tr></tbody></table>04

Se definido como 0, os nomes dos tabelas são armazenados conforme especificado e as comparações são sensíveis ao caso. Se definido como 1, os nomes dos tabelas são armazenados em minúsculas no disco e as comparações não são sensíveis ao caso. Se definido como 2, os nomes dos tabelas são armazenados conforme dado, mas comparados em minúsculas. Esta opção também se aplica aos nomes dos bancos de dados e aos aliases das tabelas. Para obter detalhes adicionais, consulte a Seção 9.2.3, “Sensibilidade ao Caso do Identificador”.

O valor padrão desta variável depende da plataforma (consulte `lower_case_file_system`). Em Linux e outros sistemas semelhantes ao Unix, o padrão é `0`. Em Windows, o valor padrão é `1`. Em macOS, o valor padrão é `2`. Em Linux (e outros sistemas semelhantes ao Unix), definir o valor para `2` não é suportado; o servidor força o valor para `0` em vez disso.

Você *não* deve definir `lower_case_table_names` para 0 se você estiver executando o MySQL em um sistema onde o diretório de dados reside em um sistema de arquivos sensível a maiúsculas e minúsculas (como em Windows ou macOS). É uma combinação não suportada que pode resultar em uma condição de travamento ao executar uma operação `INSERT INTO ... SELECT ... FROM tbl_name` com a letra *`tbl_name`* errada. Com `MyISAM`, acessar os nomes das tabelas usando diferentes letras pode causar corrupção de índice.

Uma mensagem de erro é impressa e o servidor sai se você tentar iniciar o servidor com `--lower_case_table_names=0` em um sistema de arquivos sensível a maiúsculas e minúsculas.

A definição desta variável afeta o comportamento das opções de filtragem de replicação em relação à sensibilidade de caso. Para mais informações, consulte a Seção 16.2.5, “Como os servidores avaliam as regras de filtragem de replicação”.

* `max_allowed_packet`

  <table summary="Permitted values for the authentication_windows system variable."><col style="width: 10%"/><col style="width: 75%"/><thead><tr> <th>Value</th> <th>Descrição</th> </tr></thead><tbody><tr> <td>0</td> <td>Sem registro</td> </tr><tr> <td>1</td> <td>Registre apenas mensagens de erro</td> </tr><tr> <td>2</td> <td>Mensagens de nível 1 de log e mensagens de alerta</td> </tr><tr> <td>3</td> <td>Mensagens de nível 2 de log e notas de informação</td> </tr><tr> <td>4</td> <td>Mensagens de nível 3 de log e mensagens de depuração</td> </tr></tbody></table>05

O tamanho máximo de um pacote ou qualquer string gerada/intermediária, ou qualquer parâmetro enviado pela função da API C `mysql_stmt_send_long_data()`. O padrão é de 4 MB.

O buffer de mensagens de pacote é inicializado com `net_buffer_length` bytes, mas pode crescer até `max_allowed_packet` bytes quando necessário. Esse valor, por padrão, é pequeno, para capturar pacotes grandes (possivelmente incorretos).

Você deve aumentar esse valor se estiver usando colunas grandes `BLOB` ou strings longas. Devem ser tão grandes quanto o maior `BLOB` que você deseja usar. O limite do protocolo para `max_allowed_packet` é de 1 GB. O valor deve ser um múltiplo de 1024; os não múltiplos são arredondados para o próximo múltiplo.

Quando você altera o tamanho do buffer de mensagem alterando o valor da variável `max_allowed_packet`, você também deve alterar o tamanho do buffer no lado do cliente, se o seu programa de cliente permitir. O valor padrão `max_allowed_packet` embutido na biblioteca do cliente é de 1 GB, mas os programas individuais do cliente podem sobrepor isso. Por exemplo, **mysql** e **mysqldump** têm valores padrão de 16 MB e 24 MB, respectivamente. Eles também permitem que você altere o valor do lado do cliente, definindo `max_allowed_packet` na string de comando ou em um arquivo de opção.

O valor da sessão desta variável é somente de leitura. O cliente pode receber até tantos bytes quanto o valor da sessão. No entanto, o servidor não pode enviar ao cliente mais bytes do que o valor atual do global `max_allowed_packet`. (O valor global pode ser menor que o valor da sessão se o valor global for alterado após a conexão do cliente.)

* `max_connect_errors`

  <table summary="Permitted values for the authentication_windows system variable."><col style="width: 10%"/><col style="width: 75%"/><thead><tr> <th>Value</th> <th>Descrição</th> </tr></thead><tbody><tr> <td>0</td> <td>Sem registro</td> </tr><tr> <td>1</td> <td>Registre apenas mensagens de erro</td> </tr><tr> <td>2</td> <td>Mensagens de nível 1 de log e mensagens de alerta</td> </tr><tr> <td>3</td> <td>Mensagens de nível 2 de log e notas de informação</td> </tr><tr> <td>4</td> <td>Mensagens de nível 3 de log e mensagens de depuração</td> </tr></tbody></table>06

Após `max_connect_errors` solicitações de conexão consecutivas de um host serem interrompidas sem uma conexão bem-sucedida, o servidor bloqueia essa conexão do host. Se uma conexão de um host for estabelecida com sucesso em menos de `max_connect_errors` tentativas após uma conexão anterior ter sido interrompida, o contador de erros para o host é zerado. Para desbloquear hosts bloqueados, limpe o cache do host; veja Limpar o Cache do Host.

* `max_connections`

  <table summary="Permitted values for the authentication_windows system variable."><col style="width: 10%"/><col style="width: 75%"/><thead><tr> <th>Value</th> <th>Descrição</th> </tr></thead><tbody><tr> <td>0</td> <td>Sem registro</td> </tr><tr> <td>1</td> <td>Registre apenas mensagens de erro</td> </tr><tr> <td>2</td> <td>Mensagens de nível 1 de log e mensagens de alerta</td> </tr><tr> <td>3</td> <td>Mensagens de nível 2 de log e notas de informação</td> </tr><tr> <td>4</td> <td>Mensagens de nível 3 de log e mensagens de depuração</td> </tr></tbody></table>07

O número máximo de conexões de clientes simultâneos permitido. O valor efetivo máximo é o menor entre o valor efetivo de `open_files_limit` `- 810`, e o valor realmente definido para `max_connections`.

Para mais informações, consulte a Seção 5.1.11.1, “Interfaces de conexão”.

* `max_delayed_threads`

  <table summary="Permitted values for the authentication_windows system variable."><col style="width: 10%"/><col style="width: 75%"/><thead><tr> <th>Value</th> <th>Descrição</th> </tr></thead><tbody><tr> <td>0</td> <td>Sem registro</td> </tr><tr> <td>1</td> <td>Registre apenas mensagens de erro</td> </tr><tr> <td>2</td> <td>Mensagens de nível 1 de log e mensagens de alerta</td> </tr><tr> <td>3</td> <td>Mensagens de nível 2 de log e notas de informação</td> </tr><tr> <td>4</td> <td>Mensagens de nível 3 de log e mensagens de depuração</td> </tr></tbody></table>08

Essa variável do sistema é desatualizada (porque as inserções `DELAYED` não são suportadas); espere que ela seja removida em uma versão futura.

* `max_digest_length`

  <table summary="Permitted values for the authentication_windows system variable."><col style="width: 10%"/><col style="width: 75%"/><thead><tr> <th>Value</th> <th>Descrição</th> </tr></thead><tbody><tr> <td>0</td> <td>Sem registro</td> </tr><tr> <td>1</td> <td>Registre apenas mensagens de erro</td> </tr><tr> <td>2</td> <td>Mensagens de nível 1 de log e mensagens de alerta</td> </tr><tr> <td>3</td> <td>Mensagens de nível 2 de log e notas de informação</td> </tr><tr> <td>4</td> <td>Mensagens de nível 3 de log e mensagens de depuração</td> </tr></tbody></table>09

O número máximo de bytes de memória reservados por sessão para o cálculo de digests de declarações normalizados. Uma vez que esse espaço é utilizado durante o cálculo do digest, ocorre a redução: não são coletados mais tokens de uma declaração analisada e não fazem parte do seu valor de digest. As declarações que diferem apenas após esse número de bytes de tokens analisados produzem o mesmo digest de declaração normalizada e são consideradas idênticas se comparadas ou se agregadas para estatísticas de digest.

O comprimento utilizado para calcular um digest de declaração normalizado é a soma do comprimento do digest de declaração normalizado e do comprimento do digest de declaração. Como o comprimento do digest de declaração é sempre 64, quando o valor de `max_digest_length` é 1024 (o padrão), o comprimento máximo para uma declaração SQL normalizada antes da ocorrência de corte é 1024 - 64 = 960 bytes.

Aviso

Definir `max_digest_length` como zero desativa a produção de digestão, o que também desativa a funcionalidade do servidor que requer digestões, como o MySQL Enterprise Firewall.

A redução do valor de `max_digest_length` reduz o uso de memória, mas faz com que o valor de digestão de mais declarações se tornem indistinguíveis se diferirem apenas no final. O aumento do valor permite que declarações mais longas sejam distinguidas, mas aumenta o uso de memória, particularmente para cargas de trabalho que envolvem um grande número de sessões simultâneas (o servidor aloca `max_digest_length` bytes por sessão).

O analisador utiliza essa variável do sistema como um limite para o comprimento máximo dos resumos normalizados que ele calcula. O Schema de desempenho, se ele rastrear os resumos de declaração, faz uma cópia do valor do digest, usando a variável do sistema `performance_schema_max_digest_length`. O valor do digest é limitado pelo comprimento máximo que ele armazena. Consequentemente, se `performance_schema_max_digest_length` for menor que `max_digest_length`, os valores do digest armazenados no Schema de desempenho são truncados em relação aos valores originais do digest.

Para mais informações sobre a digestão de declarações, consulte a Seção 25.10, “Digestas de declarações do Schema de desempenho”.

* `max_error_count`

  <table summary="Permitted values for the authentication_windows system variable."><col style="width: 10%"/><col style="width: 75%"/><thead><tr> <th>Value</th> <th>Descrição</th> </tr></thead><tbody><tr> <td>0</td> <td>Sem registro</td> </tr><tr> <td>1</td> <td>Registre apenas mensagens de erro</td> </tr><tr> <td>2</td> <td>Mensagens de nível 1 de log e mensagens de alerta</td> </tr><tr> <td>3</td> <td>Mensagens de nível 2 de log e notas de informação</td> </tr><tr> <td>4</td> <td>Mensagens de nível 3 de log e mensagens de depuração</td> </tr></tbody></table>10

O número máximo de mensagens de erro, aviso e informação que devem ser armazenadas para exibição pelas declarações `SHOW ERRORS` e `SHOW WARNINGS`. Isso é o mesmo que o número de áreas de condição na área de diagnóstico, e, portanto, o número de condições que podem ser inspecionadas pelo `GET DIAGNOSTICS`.

* `max_execution_time`

  <table summary="Permitted values for the authentication_windows system variable."><col style="width: 10%"/><col style="width: 75%"/><thead><tr> <th>Value</th> <th>Descrição</th> </tr></thead><tbody><tr> <td>0</td> <td>Sem registro</td> </tr><tr> <td>1</td> <td>Registre apenas mensagens de erro</td> </tr><tr> <td>2</td> <td>Mensagens de nível 1 de log e mensagens de alerta</td> </tr><tr> <td>3</td> <td>Mensagens de nível 2 de log e notas de informação</td> </tr><tr> <td>4</td> <td>Mensagens de nível 3 de log e mensagens de depuração</td> </tr></tbody></table>11

O tempo de espera para a execução das instruções `SELECT`, em milissegundos. Se o valor for 0, os tempos de espera não estão habilitados.

`max_execution_time` se aplica da seguinte forma:

+ O valor global `max_execution_time` fornece o valor padrão para o valor da sessão para novas conexões. O valor da sessão aplica-se às execuções `SELECT` executadas dentro da sessão que não incluem nenhuma dica de otimizador `MAX_EXECUTION_TIME(N)` ou para as quais *`N`* é 0.

+ `max_execution_time` se aplica a declarações `SELECT` somente de leitura. As declarações que não são somente de leitura são aquelas que invocam uma função armazenada que modifica dados como efeito colateral.

+ `max_execution_time` é ignorado para declarações `SELECT` em programas armazenados.

* `max_heap_table_size`

  <table summary="Permitted values for the authentication_windows system variable."><col style="width: 10%"/><col style="width: 75%"/><thead><tr> <th>Value</th> <th>Descrição</th> </tr></thead><tbody><tr> <td>0</td> <td>Sem registro</td> </tr><tr> <td>1</td> <td>Registre apenas mensagens de erro</td> </tr><tr> <td>2</td> <td>Mensagens de nível 1 de log e mensagens de alerta</td> </tr><tr> <td>3</td> <td>Mensagens de nível 2 de log e notas de informação</td> </tr><tr> <td>4</td> <td>Mensagens de nível 3 de log e mensagens de depuração</td> </tr></tbody></table>12

Essa variável define o tamanho máximo ao qual as tabelas criadas pelo usuário `MEMORY` são permitidas para crescer. O valor da variável é usado para calcular os valores das tabelas `MEMORY` `MAX_ROWS`.

Definir essa variável não afeta nenhuma tabela existente do `MEMORY`, a menos que a tabela seja refeita com uma declaração como `CREATE TABLE` ou alterada com `ALTER TABLE` ou `TRUNCATE TABLE`. Uma reinicialização do servidor também define o tamanho máximo das tabelas existentes do `MEMORY` ao valor global do `max_heap_table_size`.

Essa variável também é usada em conjunto com `tmp_table_size` para limitar o tamanho das tabelas internas de memória. Veja a Seção 8.4.4, “Uso de Tabela Temporária Interna no MySQL”.

`max_heap_table_size` não é replicada. Consulte a Seção 16.4.1.20, “Replicação e Tabelas de MEMÓRIA”, e a Seção 16.4.1.37, “Replicação e Variáveis”, para obter mais informações.

* `max_insert_delayed_threads`

  <table summary="Permitted values for the authentication_windows system variable."><col style="width: 10%"/><col style="width: 75%"/><thead><tr> <th>Value</th> <th>Descrição</th> </tr></thead><tbody><tr> <td>0</td> <td>Sem registro</td> </tr><tr> <td>1</td> <td>Registre apenas mensagens de erro</td> </tr><tr> <td>2</td> <td>Mensagens de nível 1 de log e mensagens de alerta</td> </tr><tr> <td>3</td> <td>Mensagens de nível 2 de log e notas de informação</td> </tr><tr> <td>4</td> <td>Mensagens de nível 3 de log e mensagens de depuração</td> </tr></tbody></table>13

Esta variável é sinônimo de `max_delayed_threads`.

Essa variável do sistema é desatualizada (porque as inserções `DELAYED` não são suportadas); espere que ela seja removida em uma versão futura.

* `max_join_size`

  <table summary="Permitted values for the authentication_windows system variable."><col style="width: 10%"/><col style="width: 75%"/><thead><tr> <th>Value</th> <th>Descrição</th> </tr></thead><tbody><tr> <td>0</td> <td>Sem registro</td> </tr><tr> <td>1</td> <td>Registre apenas mensagens de erro</td> </tr><tr> <td>2</td> <td>Mensagens de nível 1 de log e mensagens de alerta</td> </tr><tr> <td>3</td> <td>Mensagens de nível 2 de log e notas de informação</td> </tr><tr> <td>4</td> <td>Mensagens de nível 3 de log e mensagens de depuração</td> </tr></tbody></table>14

Não permita declarações que provavelmente precisem examinar mais de `max_join_size` strings (para declarações de tabela única) ou combinações de strings (para declarações de múltiplas tabelas) ou que provavelmente façam mais de `max_join_size` buscas em disco. Ao definir esse valor, você pode detectar declarações em que as chaves não são usadas corretamente e que provavelmente levarão muito tempo. Defina-o se seus usuários tendem a realizar junções que não possuem uma cláusula de `WHERE`, que levam muito tempo ou que retornam milhões de strings. Para mais informações, consulte "Usando o modo de Safe-Updates (--safe-updates)").

Definir essa variável para um valor diferente de `DEFAULT` redefinirá o valor de `sql_big_selects` para `0`. Se você definir o valor de `sql_big_selects` novamente, a variável `max_join_size` será ignorada.

Se o resultado de uma consulta estiver no cache de consulta, não é realizada nenhuma verificação do tamanho do resultado, porque o resultado já foi computado anteriormente e não sobrecarrega o servidor para enviá-lo ao cliente.

* `max_length_for_sort_data`

  <table summary="Permitted values for the authentication_windows system variable."><col style="width: 10%"/><col style="width: 75%"/><thead><tr> <th>Value</th> <th>Descrição</th> </tr></thead><tbody><tr> <td>0</td> <td>Sem registro</td> </tr><tr> <td>1</td> <td>Registre apenas mensagens de erro</td> </tr><tr> <td>2</td> <td>Mensagens de nível 1 de log e mensagens de alerta</td> </tr><tr> <td>3</td> <td>Mensagens de nível 2 de log e notas de informação</td> </tr><tr> <td>4</td> <td>Mensagens de nível 3 de log e mensagens de depuração</td> </tr></tbody></table>15

O limite de tamanho dos valores do índice que determina qual algoritmo do `filesort` deve ser usado. Veja a Seção 8.2.1.14, “Otimização de ORDEM POR”.

* `max_points_in_geometry`

  <table summary="Permitted values for the authentication_windows system variable."><col style="width: 10%"/><col style="width: 75%"/><thead><tr> <th>Value</th> <th>Descrição</th> </tr></thead><tbody><tr> <td>0</td> <td>Sem registro</td> </tr><tr> <td>1</td> <td>Registre apenas mensagens de erro</td> </tr><tr> <td>2</td> <td>Mensagens de nível 1 de log e mensagens de alerta</td> </tr><tr> <td>3</td> <td>Mensagens de nível 2 de log e notas de informação</td> </tr><tr> <td>4</td> <td>Mensagens de nível 3 de log e mensagens de depuração</td> </tr></tbody></table>16

O valor máximo do argumento *`points_per_circle`* para a função `ST_Buffer_Strategy()`.

* `max_prepared_stmt_count`

  <table summary="Permitted values for the authentication_windows system variable."><col style="width: 10%"/><col style="width: 75%"/><thead><tr> <th>Value</th> <th>Descrição</th> </tr></thead><tbody><tr> <td>0</td> <td>Sem registro</td> </tr><tr> <td>1</td> <td>Registre apenas mensagens de erro</td> </tr><tr> <td>2</td> <td>Mensagens de nível 1 de log e mensagens de alerta</td> </tr><tr> <td>3</td> <td>Mensagens de nível 2 de log e notas de informação</td> </tr><tr> <td>4</td> <td>Mensagens de nível 3 de log e mensagens de depuração</td> </tr></tbody></table>17

Essa variável limita o número total de declarações preparadas no servidor. Ela pode ser usada em ambientes onde há o potencial de ataques de negação de serviço, baseado em esgotar a memória do servidor ao preparar um grande número de declarações. Se o valor for definido menor que o número atual de declarações preparadas, as declarações existentes não serão afetadas e podem ser usadas, mas não é possível preparar novas declarações até que o número atual caia abaixo do limite. Definir o valor para 0 desativa as declarações preparadas.

* `max_seeks_for_key`

  <table summary="Permitted values for the authentication_windows system variable."><col style="width: 10%"/><col style="width: 75%"/><thead><tr> <th>Value</th> <th>Descrição</th> </tr></thead><tbody><tr> <td>0</td> <td>Sem registro</td> </tr><tr> <td>1</td> <td>Registre apenas mensagens de erro</td> </tr><tr> <td>2</td> <td>Mensagens de nível 1 de log e mensagens de alerta</td> </tr><tr> <td>3</td> <td>Mensagens de nível 2 de log e notas de informação</td> </tr><tr> <td>4</td> <td>Mensagens de nível 3 de log e mensagens de depuração</td> </tr></tbody></table>18

Limite o número máximo de buscas assumido ao procurar strings com base em uma chave. O otimizador do MySQL assume que não são necessários mais que esse número de buscas de chave ao procurar strings correspondentes em uma tabela, fazendo uma varredura em um índice, independentemente da cardinalidade real do índice (veja Seção 13.7.5.22, “Declaração SHOW INDEX”). Ao definir esse valor para um valor baixo (digamos, 100), você pode forçar o MySQL a preferir índices em vez de varreduras de tabela.

* `max_sort_length`

  <table summary="Permitted values for the authentication_windows system variable."><col style="width: 10%"/><col style="width: 75%"/><thead><tr> <th>Value</th> <th>Descrição</th> </tr></thead><tbody><tr> <td>0</td> <td>Sem registro</td> </tr><tr> <td>1</td> <td>Registre apenas mensagens de erro</td> </tr><tr> <td>2</td> <td>Mensagens de nível 1 de log e mensagens de alerta</td> </tr><tr> <td>3</td> <td>Mensagens de nível 2 de log e notas de informação</td> </tr><tr> <td>4</td> <td>Mensagens de nível 3 de log e mensagens de depuração</td> </tr></tbody></table>19

O número de bytes a serem usados ao ordenar os valores dos dados. O servidor utiliza apenas os primeiros `max_sort_length` bytes de cada valor e ignora o restante. Consequentemente, os valores que diferem apenas após os primeiros `max_sort_length` bytes são considerados iguais para as operações `GROUP BY`, `ORDER BY` e `DISTINCT`.

Para aumentar o valor de `max_sort_length`, pode ser necessário aumentar o valor de `sort_buffer_size`. Para obter detalhes, consulte a Seção 8.2.1.14, “Otimização de ORDEM”.

* `max_sp_recursion_depth`

  <table summary="Permitted values for the authentication_windows system variable."><col style="width: 10%"/><col style="width: 75%"/><thead><tr> <th>Value</th> <th>Descrição</th> </tr></thead><tbody><tr> <td>0</td> <td>Sem registro</td> </tr><tr> <td>1</td> <td>Registre apenas mensagens de erro</td> </tr><tr> <td>2</td> <td>Mensagens de nível 1 de log e mensagens de alerta</td> </tr><tr> <td>3</td> <td>Mensagens de nível 2 de log e notas de informação</td> </tr><tr> <td>4</td> <td>Mensagens de nível 3 de log e mensagens de depuração</td> </tr></tbody></table>20

O número de vezes que um procedimento armazenado específico pode ser chamado recursivamente. O valor padrão para esta opção é 0, que desativa completamente a recursão em procedimentos armazenados. O valor máximo é 255.

A recursão de procedimentos armazenados aumenta a demanda pelo espaço de pilha de thread. Se você aumentar o valor de `max_sp_recursion_depth`, pode ser necessário aumentar o tamanho da pilha de thread, aumentando o valor de `thread_stack` na inicialização do servidor.

* `max_tmp_tables`

Essa variável não é usada. Ela é desatualizada e será removida no MySQL 8.0.

* `max_user_connections`

  <table summary="Permitted values for the authentication_windows system variable."><col style="width: 10%"/><col style="width: 75%"/><thead><tr> <th>Value</th> <th>Descrição</th> </tr></thead><tbody><tr> <td>0</td> <td>Sem registro</td> </tr><tr> <td>1</td> <td>Registre apenas mensagens de erro</td> </tr><tr> <td>2</td> <td>Mensagens de nível 1 de log e mensagens de alerta</td> </tr><tr> <td>3</td> <td>Mensagens de nível 2 de log e notas de informação</td> </tr><tr> <td>4</td> <td>Mensagens de nível 3 de log e mensagens de depuração</td> </tr></tbody></table>21

O número máximo de conexões simultâneas permitidas para qualquer conta de usuário do MySQL. Um valor de 0 (padrão) significa "sem limite".

Essa variável tem um valor global que pode ser definido na inicialização ou no runtime do servidor. Também possui um valor de sessão somente de leitura que indica o limite de conexão simultânea efetiva que se aplica à conta associada à sessão atual. O valor da sessão é inicializado da seguinte forma:

+ Se a conta do usuário tiver um limite de recurso `MAX_USER_CONNECTIONS` não nulo, o valor da sessão `max_user_connections` é definido nesse limite.

Caso contrário, o valor da sessão `max_user_connections` é definido pelo valor global.

Os limites de recursos da conta são especificados usando a declaração `CREATE USER` ou `ALTER USER`. Veja a Seção 6.2.16, “Definindo Limites de Recursos da Conta”.

* `max_write_lock_count`

  <table summary="Permitted values for the authentication_windows system variable."><col style="width: 10%"/><col style="width: 75%"/><thead><tr> <th>Value</th> <th>Descrição</th> </tr></thead><tbody><tr> <td>0</td> <td>Sem registro</td> </tr><tr> <td>1</td> <td>Registre apenas mensagens de erro</td> </tr><tr> <td>2</td> <td>Mensagens de nível 1 de log e mensagens de alerta</td> </tr><tr> <td>3</td> <td>Mensagens de nível 2 de log e notas de informação</td> </tr><tr> <td>4</td> <td>Mensagens de nível 3 de log e mensagens de depuração</td> </tr></tbody></table>22

Após muitas solicitações de bloqueio de escrita, permita que algumas solicitações de bloqueio de leitura pendentes sejam processadas entre elas. As solicitações de bloqueio de escrita têm prioridade mais alta do que as solicitações de bloqueio de leitura. No entanto, se `max_write_lock_count` estiver definido com um valor baixo (digamos, 10), as solicitações de bloqueio de leitura podem ser preferidas em relação às solicitações de bloqueio de escrita pendentes, se as solicitações de bloqueio de leitura já tiverem sido superadas em favor de 10 solicitações de bloqueio de escrita. Normalmente, esse comportamento não ocorre porque `max_write_lock_count`, por padrão, tem um valor muito grande.

* `mecab_rc_file`

  <table summary="Permitted values for the authentication_windows system variable."><col style="width: 10%"/><col style="width: 75%"/><thead><tr> <th>Value</th> <th>Descrição</th> </tr></thead><tbody><tr> <td>0</td> <td>Sem registro</td> </tr><tr> <td>1</td> <td>Registre apenas mensagens de erro</td> </tr><tr> <td>2</td> <td>Mensagens de nível 1 de log e mensagens de alerta</td> </tr><tr> <td>3</td> <td>Mensagens de nível 2 de log e notas de informação</td> </tr><tr> <td>4</td> <td>Mensagens de nível 3 de log e mensagens de depuração</td> </tr></tbody></table>23

A opção `mecab_rc_file` é usada ao configurar o analisador de texto completo MeCab.

A opção `mecab_rc_file` define o caminho para o arquivo de configuração `mecabrc`, que é o arquivo de configuração do MeCab. A opção é somente de leitura e só pode ser definida na inicialização. O arquivo de configuração `mecabrc` é necessário para inicializar o MeCab.

Para informações sobre o analisador de texto completo MeCab, consulte a Seção 12.9.9, “Plugin de Analisador de Texto Completo MeCab”.

Para obter informações sobre as opções que podem ser especificadas no arquivo de configuração MeCab `mecabrc`, consulte a documentação do MeCab no site do [Google Developers][(https://code.google.com/)].

* `metadata_locks_cache_size`

  <table summary="Permitted values for the authentication_windows system variable."><col style="width: 10%"/><col style="width: 75%"/><thead><tr> <th>Value</th> <th>Descrição</th> </tr></thead><tbody><tr> <td>0</td> <td>Sem registro</td> </tr><tr> <td>1</td> <td>Registre apenas mensagens de erro</td> </tr><tr> <td>2</td> <td>Mensagens de nível 1 de log e mensagens de alerta</td> </tr><tr> <td>3</td> <td>Mensagens de nível 2 de log e notas de informação</td> </tr><tr> <td>4</td> <td>Mensagens de nível 3 de log e mensagens de depuração</td> </tr></tbody></table>24

O tamanho do cache de bloqueios de metadados. O servidor usa esse cache para evitar a criação e destruição de objetos de sincronização. Isso é particularmente útil em sistemas onde essas operações são caras, como o Windows XP.

Em MySQL 5.7.4, as mudanças na implementação de bloqueio de metadados tornam essa variável desnecessária, e, portanto, é desaconselhada; espere que ela seja removida em uma versão futura do MySQL.

* `metadata_locks_hash_instances`

  <table summary="Permitted values for the authentication_windows system variable."><col style="width: 10%"/><col style="width: 75%"/><thead><tr> <th>Value</th> <th>Descrição</th> </tr></thead><tbody><tr> <td>0</td> <td>Sem registro</td> </tr><tr> <td>1</td> <td>Registre apenas mensagens de erro</td> </tr><tr> <td>2</td> <td>Mensagens de nível 1 de log e mensagens de alerta</td> </tr><tr> <td>3</td> <td>Mensagens de nível 2 de log e notas de informação</td> </tr><tr> <td>4</td> <td>Mensagens de nível 3 de log e mensagens de depuração</td> </tr></tbody></table>25

O conjunto de bloqueios de metadados pode ser dividido em hashes separados para permitir que conexões que acessam diferentes objetos usem diferentes hashes de bloqueio e reduzam a concorrência. A variável de sistema `metadata_locks_hash_instances` especifica o número de hashes (padrão 8).

Em MySQL 5.7.4, as mudanças na implementação de bloqueio de metadados tornam essa variável desnecessária, e, portanto, é desaconselhada; espere que ela seja removida em uma versão futura do MySQL.

* `min_examined_row_limit`

  <table summary="Permitted values for the authentication_windows system variable."><col style="width: 10%"/><col style="width: 75%"/><thead><tr> <th>Value</th> <th>Descrição</th> </tr></thead><tbody><tr> <td>0</td> <td>Sem registro</td> </tr><tr> <td>1</td> <td>Registre apenas mensagens de erro</td> </tr><tr> <td>2</td> <td>Mensagens de nível 1 de log e mensagens de alerta</td> </tr><tr> <td>3</td> <td>Mensagens de nível 2 de log e notas de informação</td> </tr><tr> <td>4</td> <td>Mensagens de nível 3 de log e mensagens de depuração</td> </tr></tbody></table>26

As consultas que examinam menos que esse número de strings não são registradas no registro de consultas lentas.

* `multi_range_count`

  <table summary="Permitted values for the authentication_windows system variable."><col style="width: 10%"/><col style="width: 75%"/><thead><tr> <th>Value</th> <th>Descrição</th> </tr></thead><tbody><tr> <td>0</td> <td>Sem registro</td> </tr><tr> <td>1</td> <td>Registre apenas mensagens de erro</td> </tr><tr> <td>2</td> <td>Mensagens de nível 1 de log e mensagens de alerta</td> </tr><tr> <td>3</td> <td>Mensagens de nível 2 de log e notas de informação</td> </tr><tr> <td>4</td> <td>Mensagens de nível 3 de log e mensagens de depuração</td> </tr></tbody></table>27

Essa variável não tem efeito. Ela é desatualizada e será removida no MySQL 8.0.

* `myisam_data_pointer_size`

  <table summary="Permitted values for the authentication_windows system variable."><col style="width: 10%"/><col style="width: 75%"/><thead><tr> <th>Value</th> <th>Descrição</th> </tr></thead><tbody><tr> <td>0</td> <td>Sem registro</td> </tr><tr> <td>1</td> <td>Registre apenas mensagens de erro</td> </tr><tr> <td>2</td> <td>Mensagens de nível 1 de log e mensagens de alerta</td> </tr><tr> <td>3</td> <td>Mensagens de nível 2 de log e notas de informação</td> </tr><tr> <td>4</td> <td>Mensagens de nível 3 de log e mensagens de depuração</td> </tr></tbody></table>28

O tamanho padrão do ponteiro em bytes, que será utilizado pelo `CREATE TABLE` para as tabelas do `MyISAM` quando não for especificado a opção `MAX_ROWS`. Este valor padrão não pode ser menor que 2 ou maior que 7. O valor padrão é

6. Veja a Seção B.3.2.10, “A mesa está cheia”. * `myisam_max_sort_file_size`

  <table summary="Permitted values for the authentication_windows system variable."><col style="width: 10%"/><col style="width: 75%"/><thead><tr> <th>Value</th> <th>Descrição</th> </tr></thead><tbody><tr> <td>0</td> <td>Sem registro</td> </tr><tr> <td>1</td> <td>Registre apenas mensagens de erro</td> </tr><tr> <td>2</td> <td>Mensagens de nível 1 de log e mensagens de alerta</td> </tr><tr> <td>3</td> <td>Mensagens de nível 2 de log e notas de informação</td> </tr><tr> <td>4</td> <td>Mensagens de nível 3 de log e mensagens de depuração</td> </tr></tbody></table>29

O tamanho máximo do arquivo temporário que o MySQL é permitido usar ao recriar um índice `MyISAM` (durante `REPAIR TABLE`, `ALTER TABLE` ou `LOAD DATA`). Se o tamanho do arquivo fosse maior que esse valor, o índice é criado usando a cache de chave em vez disso, o que é mais lento. O valor é dado em bytes.

Se os arquivos de índice `MyISAM` ultrapassarem esse tamanho e houver espaço disponível no disco, aumentar o valor pode ajudar no desempenho. O espaço deve estar disponível no sistema de arquivos que contém o diretório onde o arquivo de índice original está localizado.

* `myisam_mmap_size`

  <table summary="Permitted values for the authentication_windows system variable."><col style="width: 10%"/><col style="width: 75%"/><thead><tr> <th>Value</th> <th>Descrição</th> </tr></thead><tbody><tr> <td>0</td> <td>Sem registro</td> </tr><tr> <td>1</td> <td>Registre apenas mensagens de erro</td> </tr><tr> <td>2</td> <td>Mensagens de nível 1 de log e mensagens de alerta</td> </tr><tr> <td>3</td> <td>Mensagens de nível 2 de log e notas de informação</td> </tr><tr> <td>4</td> <td>Mensagens de nível 3 de log e mensagens de depuração</td> </tr></tbody></table>30

O valor máximo de memória a ser usado para mapear a memória de arquivos comprimidos `MyISAM`. Se muitas tabelas compactadas `MyISAM` forem usadas, o valor pode ser reduzido para diminuir a probabilidade de problemas de troca de memória.

* `myisam_recover_options`

  <table summary="Permitted values for the authentication_windows system variable."><col style="width: 10%"/><col style="width: 75%"/><thead><tr> <th>Value</th> <th>Descrição</th> </tr></thead><tbody><tr> <td>0</td> <td>Sem registro</td> </tr><tr> <td>1</td> <td>Registre apenas mensagens de erro</td> </tr><tr> <td>2</td> <td>Mensagens de nível 1 de log e mensagens de alerta</td> </tr><tr> <td>3</td> <td>Mensagens de nível 2 de log e notas de informação</td> </tr><tr> <td>4</td> <td>Mensagens de nível 3 de log e mensagens de depuração</td> </tr></tbody></table>31

Defina o modo de recuperação do mecanismo de armazenamento `MyISAM`. O valor da variável é qualquer combinação dos valores de `OFF`, `DEFAULT`, `BACKUP`, `FORCE` ou `QUICK`. Se você especificar vários valores, separe-os por vírgula. Especificar a variável sem valor na inicialização do servidor é o mesmo que especificar `DEFAULT`, e especificar com um valor explícito de `""` desabilita a recuperação (mesmo que um valor de `OFF`). Se a recuperação estiver habilitada, cada vez que `mysqld` abre uma tabela `MyISAM`, ele verifica se a tabela está marcada como quebrada ou se não foi fechada corretamente. (A última opção funciona apenas se você estiver executando com bloqueio externo desativado.) Se este for o caso, `mysqld` executa uma verificação na tabela. Se a tabela estiver corrompida, `mysqld` tenta repará-la.

As opções a seguir afetam o funcionamento da reparação.

  <table summary="Permitted values for the authentication_windows system variable."><col style="width: 10%"/><col style="width: 75%"/><thead><tr> <th>Value</th> <th>Descrição</th> </tr></thead><tbody><tr> <td>0</td> <td>Sem registro</td> </tr><tr> <td>1</td> <td>Registre apenas mensagens de erro</td> </tr><tr> <td>2</td> <td>Mensagens de nível 1 de log e mensagens de alerta</td> </tr><tr> <td>3</td> <td>Mensagens de nível 2 de log e notas de informação</td> </tr><tr> <td>4</td> <td>Mensagens de nível 3 de log e mensagens de depuração</td> </tr></tbody></table>32

Antes que o servidor repare automaticamente uma tabela, ele escreve uma nota sobre a reparação no log de erro. Se você deseja ser capaz de recuperar a maioria dos problemas sem intervenção do usuário, você deve usar as opções `BACKUP,FORCE`. Isso força a reparação de uma tabela, mesmo que algumas strings sejam excluídas, mas mantém o arquivo de dados antigo como um backup para que você possa examinar mais tarde o que aconteceu.

Veja a Seção 15.2.1, “Opções de inicialização do MyISAM”.

* `myisam_repair_threads`

  <table summary="Permitted values for the authentication_windows system variable."><col style="width: 10%"/><col style="width: 75%"/><thead><tr> <th>Value</th> <th>Descrição</th> </tr></thead><tbody><tr> <td>0</td> <td>Sem registro</td> </tr><tr> <td>1</td> <td>Registre apenas mensagens de erro</td> </tr><tr> <td>2</td> <td>Mensagens de nível 1 de log e mensagens de alerta</td> </tr><tr> <td>3</td> <td>Mensagens de nível 2 de log e notas de informação</td> </tr><tr> <td>4</td> <td>Mensagens de nível 3 de log e mensagens de depuração</td> </tr></tbody></table>33

Nota

Essa variável do sistema é desatualizada no MySQL 5.7; espere que ela seja removida em um lançamento futuro do MySQL.

A partir do MySQL 5.7.38, valores que não sejam 1 produzem um aviso.

Se esse valor for maior que 1, os índices da tabela `MyISAM` são criados em paralelo (cada índice em seu próprio thread) durante o processo `Repair by sorting`. O valor padrão é 1.

Nota

A reparação multithread é um código de qualidade *beta*.

* `myisam_sort_buffer_size`

  <table summary="Permitted values for the authentication_windows system variable."><col style="width: 10%"/><col style="width: 75%"/><thead><tr> <th>Value</th> <th>Descrição</th> </tr></thead><tbody><tr> <td>0</td> <td>Sem registro</td> </tr><tr> <td>1</td> <td>Registre apenas mensagens de erro</td> </tr><tr> <td>2</td> <td>Mensagens de nível 1 de log e mensagens de alerta</td> </tr><tr> <td>3</td> <td>Mensagens de nível 2 de log e notas de informação</td> </tr><tr> <td>4</td> <td>Mensagens de nível 3 de log e mensagens de depuração</td> </tr></tbody></table>34

O tamanho do buffer que é alocado ao ordenar índices `MyISAM` durante um `REPAIR TABLE` ou ao criar índices com `CREATE INDEX` ou `ALTER TABLE`.

* `myisam_stats_method`

  <table summary="Permitted values for the authentication_windows system variable."><col style="width: 10%"/><col style="width: 75%"/><thead><tr> <th>Value</th> <th>Descrição</th> </tr></thead><tbody><tr> <td>0</td> <td>Sem registro</td> </tr><tr> <td>1</td> <td>Registre apenas mensagens de erro</td> </tr><tr> <td>2</td> <td>Mensagens de nível 1 de log e mensagens de alerta</td> </tr><tr> <td>3</td> <td>Mensagens de nível 2 de log e notas de informação</td> </tr><tr> <td>4</td> <td>Mensagens de nível 3 de log e mensagens de depuração</td> </tr></tbody></table>35

Como o servidor trata os valores de `NULL` ao coletar estatísticas sobre a distribuição dos valores do índice para as tabelas de `MyISAM`. Esta variável tem três valores possíveis, `nulls_equal`, `nulls_unequal` e `nulls_ignored`. Para `nulls_equal`, todos os valores de índice de `NULL` são considerados iguais e formam um único grupo de valores que tem um tamanho igual ao número de valores de `NULL`. Para `nulls_unequal`, os valores de `NULL` são considerados desiguais, e cada `NULL` forma um grupo de valores distinto de tamanho

1. Para `nulls_ignored`, os valores de `NULL` são ignorados.

O método que é usado para gerar estatísticas de tabela influencia a forma como o otimizador escolhe índices para a execução de consultas, conforme descrito na Seção 8.3.7, "Coleta de Estatísticas de Índices de InnoDB e MyISAM".

* `myisam_use_mmap`

  <table summary="Permitted values for the authentication_windows system variable."><col style="width: 10%"/><col style="width: 75%"/><thead><tr> <th>Value</th> <th>Descrição</th> </tr></thead><tbody><tr> <td>0</td> <td>Sem registro</td> </tr><tr> <td>1</td> <td>Registre apenas mensagens de erro</td> </tr><tr> <td>2</td> <td>Mensagens de nível 1 de log e mensagens de alerta</td> </tr><tr> <td>3</td> <td>Mensagens de nível 2 de log e notas de informação</td> </tr><tr> <td>4</td> <td>Mensagens de nível 3 de log e mensagens de depuração</td> </tr></tbody></table>36

Utilize mapeamento de memória para leitura e escrita de tabelas `MyISAM`.

* `mysql_native_password_proxy_users`

  <table summary="Permitted values for the authentication_windows system variable."><col style="width: 10%"/><col style="width: 75%"/><thead><tr> <th>Value</th> <th>Descrição</th> </tr></thead><tbody><tr> <td>0</td> <td>Sem registro</td> </tr><tr> <td>1</td> <td>Registre apenas mensagens de erro</td> </tr><tr> <td>2</td> <td>Mensagens de nível 1 de log e mensagens de alerta</td> </tr><tr> <td>3</td> <td>Mensagens de nível 2 de log e notas de informação</td> </tr><tr> <td>4</td> <td>Mensagens de nível 3 de log e mensagens de depuração</td> </tr></tbody></table>37

Essa variável controla se o plugin de autenticação embutido `mysql_native_password` suporta usuários proxy. Não tem efeito a menos que a variável de sistema `check_proxy_users` esteja habilitada. Para informações sobre proxeamento de usuários, consulte a Seção 6.2.14, “Usuários Proxy”.

* `named_pipe`

  <table summary="Permitted values for the authentication_windows system variable."><col style="width: 10%"/><col style="width: 75%"/><thead><tr> <th>Value</th> <th>Descrição</th> </tr></thead><tbody><tr> <td>0</td> <td>Sem registro</td> </tr><tr> <td>1</td> <td>Registre apenas mensagens de erro</td> </tr><tr> <td>2</td> <td>Mensagens de nível 1 de log e mensagens de alerta</td> </tr><tr> <td>3</td> <td>Mensagens de nível 2 de log e notas de informação</td> </tr><tr> <td>4</td> <td>Mensagens de nível 3 de log e mensagens de depuração</td> </tr></tbody></table>38

(Apenas para Windows.) Indica se o servidor suporta conexões por pipes nomeados.

* `named_pipe_full_access_group`

  <table summary="Permitted values for the authentication_windows system variable."><col style="width: 10%"/><col style="width: 75%"/><thead><tr> <th>Value</th> <th>Descrição</th> </tr></thead><tbody><tr> <td>0</td> <td>Sem registro</td> </tr><tr> <td>1</td> <td>Registre apenas mensagens de erro</td> </tr><tr> <td>2</td> <td>Mensagens de nível 1 de log e mensagens de alerta</td> </tr><tr> <td>3</td> <td>Mensagens de nível 2 de log e notas de informação</td> </tr><tr> <td>4</td> <td>Mensagens de nível 3 de log e mensagens de depuração</td> </tr></tbody></table>39

(Apenas para Windows.) O controle de acesso concedido aos clientes no pipe nomeado criado pelo servidor MySQL é definido para o mínimo necessário para uma comunicação bem-sucedida quando a variável de sistema `named_pipe` é habilitada para suportar conexões de pipe nomeado. Alguns softwares de cliente MySQL podem abrir conexões de pipe nomeado sem qualquer configuração adicional; no entanto, outros softwares de cliente ainda podem exigir acesso total para abrir uma conexão de pipe nomeado.

Essa variável define o nome de um grupo local do Windows cujos membros recebem acesso suficiente do servidor MySQL para usar clientes de canal nomeado. A partir do MySQL 5.7.34, o valor padrão é definido como uma string vazia, o que significa que nenhum usuário do Windows recebe acesso total ao canal nomeado.

Um novo nome de grupo local do Windows (por exemplo, `mysql_access_client_users`) pode ser criado no Windows e, em seguida, usado para substituir o valor padrão quando o acesso for absolutamente necessário. Neste caso, limite a adesão do grupo ao menor número possível de usuários, removendo os usuários do grupo quando seu software de cliente for atualizado. Um usuário que não faz parte do grupo e tenta abrir uma conexão com o cliente de named-pipe MySQL afetado é negado o acesso até que um administrador do Windows adicione o usuário ao grupo. Os usuários recém-adicionados devem fazer logout e fazer login novamente para se juntar ao grupo (requerido pelo Windows).

Definir o valor para `'*everyone*'` fornece uma maneira independente da linguagem de se referir ao grupo Todos no Windows. O grupo Todos não é seguro por padrão.

* `net_buffer_length`

  <table summary="Permitted values for the authentication_windows system variable."><col style="width: 10%"/><col style="width: 75%"/><thead><tr> <th>Value</th> <th>Descrição</th> </tr></thead><tbody><tr> <td>0</td> <td>Sem registro</td> </tr><tr> <td>1</td> <td>Registre apenas mensagens de erro</td> </tr><tr> <td>2</td> <td>Mensagens de nível 1 de log e mensagens de alerta</td> </tr><tr> <td>3</td> <td>Mensagens de nível 2 de log e notas de informação</td> </tr><tr> <td>4</td> <td>Mensagens de nível 3 de log e mensagens de depuração</td> </tr></tbody></table>40

Cada thread de cliente está associado a um buffer de conexão e um buffer de resultado. Ambos começam com um tamanho dado por `net_buffer_length`, mas são ampliados dinamicamente até `max_allowed_packet` bytes conforme necessário. O buffer de resultado encolhe para `net_buffer_length` após cada declaração SQL.

Essa variável normalmente não deve ser alterada, mas se você tiver muito pouco espaço de memória, pode configurá-la para o comprimento esperado das declarações enviadas pelos clientes. Se as declarações excederem esse comprimento, o buffer de conexão será automaticamente ampliado. O valor máximo para o qual `net_buffer_length` pode ser configurado é de 1 MB.

O valor da sessão desta variável é somente leitura.

* `net_read_timeout`

  <table summary="Permitted values for the authentication_windows system variable."><col style="width: 10%"/><col style="width: 75%"/><thead><tr> <th>Value</th> <th>Descrição</th> </tr></thead><tbody><tr> <td>0</td> <td>Sem registro</td> </tr><tr> <td>1</td> <td>Registre apenas mensagens de erro</td> </tr><tr> <td>2</td> <td>Mensagens de nível 1 de log e mensagens de alerta</td> </tr><tr> <td>3</td> <td>Mensagens de nível 2 de log e notas de informação</td> </tr><tr> <td>4</td> <td>Mensagens de nível 3 de log e mensagens de depuração</td> </tr></tbody></table>41

O número de segundos para esperar mais dados de uma conexão antes de abortar a leitura. Quando o servidor está lendo do cliente, `net_read_timeout` é o valor do tempo de espera que controla quando abortar. Quando o servidor está escrevendo para o cliente, `net_write_timeout` é o valor do tempo de espera que controla quando abortar. Veja também `slave_net_timeout`.

* `net_retry_count`

  <table summary="Permitted values for the authentication_windows system variable."><col style="width: 10%"/><col style="width: 75%"/><thead><tr> <th>Value</th> <th>Descrição</th> </tr></thead><tbody><tr> <td>0</td> <td>Sem registro</td> </tr><tr> <td>1</td> <td>Registre apenas mensagens de erro</td> </tr><tr> <td>2</td> <td>Mensagens de nível 1 de log e mensagens de alerta</td> </tr><tr> <td>3</td> <td>Mensagens de nível 2 de log e notas de informação</td> </tr><tr> <td>4</td> <td>Mensagens de nível 3 de log e mensagens de depuração</td> </tr></tbody></table>42

Se uma leitura ou escrita em um port de comunicação for interrompida, tente novamente quantas vezes for necessário antes de desistir. Esse valor deve ser definido bastante alto no FreeBSD, pois interrupções internas são enviadas para todos os threads.

* `net_write_timeout`

  <table summary="Permitted values for the authentication_windows system variable."><col style="width: 10%"/><col style="width: 75%"/><thead><tr> <th>Value</th> <th>Descrição</th> </tr></thead><tbody><tr> <td>0</td> <td>Sem registro</td> </tr><tr> <td>1</td> <td>Registre apenas mensagens de erro</td> </tr><tr> <td>2</td> <td>Mensagens de nível 1 de log e mensagens de alerta</td> </tr><tr> <td>3</td> <td>Mensagens de nível 2 de log e notas de informação</td> </tr><tr> <td>4</td> <td>Mensagens de nível 3 de log e mensagens de depuração</td> </tr></tbody></table>43

O número de segundos para esperar que um bloco seja escrito em uma conexão antes de abortar a escrita. Veja também `net_read_timeout`.

* `new`

  <table summary="Permitted values for the authentication_windows system variable."><col style="width: 10%"/><col style="width: 75%"/><thead><tr> <th>Value</th> <th>Descrição</th> </tr></thead><tbody><tr> <td>0</td> <td>Sem registro</td> </tr><tr> <td>1</td> <td>Registre apenas mensagens de erro</td> </tr><tr> <td>2</td> <td>Mensagens de nível 1 de log e mensagens de alerta</td> </tr><tr> <td>3</td> <td>Mensagens de nível 2 de log e notas de informação</td> </tr><tr> <td>4</td> <td>Mensagens de nível 3 de log e mensagens de depuração</td> </tr></tbody></table>44

Essa variável foi usada no MySQL 4.0 para ativar alguns comportamentos do 4.1 e é mantida para compatibilidade reversa. Seu valor é sempre `OFF`.

Em NDB Cluster, definir essa variável para `ON` permite o uso de tipos de particionamento diferentes de `KEY` ou `LINEAR KEY` com tabelas `NDB`. Esse recurso experimental não é suportado na produção e, agora, é descontinuado e, portanto, sujeito à remoção em uma versão futura. Para informações adicionais, consulte "Particionamento definido pelo usuário e o motor de armazenamento NDB (NDB Cluster)").

* `ngram_token_size`

  <table summary="Permitted values for the authentication_windows system variable."><col style="width: 10%"/><col style="width: 75%"/><thead><tr> <th>Value</th> <th>Descrição</th> </tr></thead><tbody><tr> <td>0</td> <td>Sem registro</td> </tr><tr> <td>1</td> <td>Registre apenas mensagens de erro</td> </tr><tr> <td>2</td> <td>Mensagens de nível 1 de log e mensagens de alerta</td> </tr><tr> <td>3</td> <td>Mensagens de nível 2 de log e notas de informação</td> </tr><tr> <td>4</td> <td>Mensagens de nível 3 de log e mensagens de depuração</td> </tr></tbody></table>45

Define o tamanho do token n-gram para o analisador de texto completo de n-gram. A opção `ngram_token_size` é somente leitura e só pode ser modificada no momento do início. O valor padrão é 2 (bigram). O valor máximo é 10.

Para mais informações sobre como configurar essa variável, consulte a Seção 12.9.8, “Parser de Texto Completo ngram”.

* `offline_mode`

  <table summary="Permitted values for the authentication_windows system variable."><col style="width: 10%"/><col style="width: 75%"/><thead><tr> <th>Value</th> <th>Descrição</th> </tr></thead><tbody><tr> <td>0</td> <td>Sem registro</td> </tr><tr> <td>1</td> <td>Registre apenas mensagens de erro</td> </tr><tr> <td>2</td> <td>Mensagens de nível 1 de log e mensagens de alerta</td> </tr><tr> <td>3</td> <td>Mensagens de nível 2 de log e notas de informação</td> </tr><tr> <td>4</td> <td>Mensagens de nível 3 de log e mensagens de depuração</td> </tr></tbody></table>46

Se o servidor estiver no modo "offline", que possui essas características:

+ Os usuários do cliente conectado que não possuem o privilégio `SUPER` são desconectados na próxima solicitação, com um erro apropriado. A desconexão inclui o término de declarações em execução e a liberação de bloqueios. Esses clientes também não podem iniciar novas conexões e receberão um erro apropriado.

+ Usuários de clientes conectados que possuem o privilégio `SUPER` não são desconectados e podem iniciar novas conexões para gerenciar o servidor.

Os threads replicados têm permissão para continuar aplicando dados ao servidor.

Apenas os usuários que possuem o privilégio `SUPER` podem controlar o modo offline. Para colocar um servidor em modo offline, altere o valor da variável de sistema `OFF` para `ON`. Para retomar as operações normais, altere `offline_mode` de `ON` para `OFF`. No modo offline, os clientes que são recusados recebem um erro `ER_SERVER_OFFLINE_MODE`.

* `old`

  <table summary="Permitted values for the authentication_windows system variable."><col style="width: 10%"/><col style="width: 75%"/><thead><tr> <th>Value</th> <th>Descrição</th> </tr></thead><tbody><tr> <td>0</td> <td>Sem registro</td> </tr><tr> <td>1</td> <td>Registre apenas mensagens de erro</td> </tr><tr> <td>2</td> <td>Mensagens de nível 1 de log e mensagens de alerta</td> </tr><tr> <td>3</td> <td>Mensagens de nível 2 de log e notas de informação</td> </tr><tr> <td>4</td> <td>Mensagens de nível 3 de log e mensagens de depuração</td> </tr></tbody></table>47

`old` é uma variável de compatibilidade. Ela é desativada por padrão, mas pode ser ativada na inicialização para reverter o comportamento do servidor para o comportamento presente em versões anteriores.

Quando o `old` é habilitado, ele altera o escopo padrão das dicas de índice para o usado antes do MySQL 5.1.17. Ou seja, as dicas de índice sem a cláusula `FOR` se aplicam apenas à forma como os índices são usados para recuperação de strings e não à resolução das cláusulas `ORDER BY` ou `GROUP BY` (Veja Seção 8.9.4, “Dicas de Índice”). Tenha cuidado ao habilitar isso em uma configuração de replicação. Com o registro binário baseado em declarações, ter modos diferentes para a fonte e réplicas pode levar a erros de replicação.

* `old_alter_table`

  <table summary="Permitted values for the authentication_windows system variable."><col style="width: 10%"/><col style="width: 75%"/><thead><tr> <th>Value</th> <th>Descrição</th> </tr></thead><tbody><tr> <td>0</td> <td>Sem registro</td> </tr><tr> <td>1</td> <td>Registre apenas mensagens de erro</td> </tr><tr> <td>2</td> <td>Mensagens de nível 1 de log e mensagens de alerta</td> </tr><tr> <td>3</td> <td>Mensagens de nível 2 de log e notas de informação</td> </tr><tr> <td>4</td> <td>Mensagens de nível 3 de log e mensagens de depuração</td> </tr></tbody></table>48

Quando essa variável é habilitada, o servidor não utiliza o método otimizado de processamento de uma operação `ALTER TABLE`. Ele volta a usar uma tabela temporária, copiando os dados e, em seguida, renomeando a tabela temporária para a original, como usado pelo MySQL 5.0 e versões anteriores. Para mais informações sobre o funcionamento do `ALTER TABLE`, consulte a Seção 13.1.8, “Declaração ALTER TABLE”.

* `old_passwords`

  <table summary="Permitted values for the authentication_windows system variable."><col style="width: 10%"/><col style="width: 75%"/><thead><tr> <th>Value</th> <th>Descrição</th> </tr></thead><tbody><tr> <td>0</td> <td>Sem registro</td> </tr><tr> <td>1</td> <td>Registre apenas mensagens de erro</td> </tr><tr> <td>2</td> <td>Mensagens de nível 1 de log e mensagens de alerta</td> </tr><tr> <td>3</td> <td>Mensagens de nível 2 de log e notas de informação</td> </tr><tr> <td>4</td> <td>Mensagens de nível 3 de log e mensagens de depuração</td> </tr></tbody></table>49

Nota

Essa variável do sistema é desatualizada no MySQL 5.7; espere que ela seja removida em um lançamento futuro do MySQL.

Essa variável controla o método de hashing de senha usado pela função `PASSWORD()`. Também influencia o hashing de senha realizado pelas declarações `CREATE USER` e `GRANT` que especificam uma senha usando uma cláusula `IDENTIFIED BY`.

A tabela a seguir mostra, para cada método de hashing de senha, o valor permitido de `old_passwords` e quais plugins de autenticação usam o método de hashing.

  <table summary="Permitted values for the authentication_windows system variable."><col style="width: 10%"/><col style="width: 75%"/><thead><tr> <th>Value</th> <th>Descrição</th> </tr></thead><tbody><tr> <td>0</td> <td>Sem registro</td> </tr><tr> <td>1</td> <td>Registre apenas mensagens de erro</td> </tr><tr> <td>2</td> <td>Mensagens de nível 1 de log e mensagens de alerta</td> </tr><tr> <td>3</td> <td>Mensagens de nível 2 de log e notas de informação</td> </tr><tr> <td>4</td> <td>Mensagens de nível 3 de log e mensagens de depuração</td> </tr></tbody></table>50

Se você definir `old_passwords=2`, siga as instruções para usar o plugin `sha256_password` na Seção 6.4.1.5, “Autenticação substituível SHA-256”.

O servidor define o valor global `old_passwords` durante a inicialização para ser consistente com o método de hashing de senha exigido pelo plugin de autenticação indicado pela variável de sistema `default_authentication_plugin`.

Quando um cliente se conecta com sucesso ao servidor, o servidor define o valor da sessão `old_passwords` de forma apropriada para o método de autenticação da conta. Por exemplo, se a conta usa o plugin de autenticação `sha256_password`, o servidor define `old_passwords=2`.

Para informações adicionais sobre plugins de autenticação e formatos de hashing, consulte a Seção 6.2.13, “Autenticação Conectada”, e a Seção 6.1.2.4, “Hashing de Senha no MySQL”.

* `open_files_limit`

  <table summary="Permitted values for the authentication_windows system variable."><col style="width: 10%"/><col style="width: 75%"/><thead><tr> <th>Value</th> <th>Descrição</th> </tr></thead><tbody><tr> <td>0</td> <td>Sem registro</td> </tr><tr> <td>1</td> <td>Registre apenas mensagens de erro</td> </tr><tr> <td>2</td> <td>Mensagens de nível 1 de log e mensagens de alerta</td> </tr><tr> <td>3</td> <td>Mensagens de nível 2 de log e notas de informação</td> </tr><tr> <td>4</td> <td>Mensagens de nível 3 de log e mensagens de depuração</td> </tr></tbody></table>51

O número de descritores de arquivo disponíveis para `mysqld` a partir do sistema operacional:

+ Ao iniciar, `mysqld` reserva descritores com `setrlimit()`, usando o valor solicitado ao definir essa variável diretamente ou usando a opção `--open-files-limit` para `mysqld_safe`. Se `mysqld` produzir o erro `Too many open files`, tente aumentar o valor de `open_files_limit`. Internamente, o valor máximo para essa variável é o valor máximo de inteiro não assinado, mas o máximo real depende da plataforma.

+ No momento da execução, o valor de `open_files_limit` indica o número de descritores de arquivo que o sistema operacional realmente permite ao `mysqld`, que pode diferir do valor solicitado na inicialização. Se o número de descritores de arquivo solicitados durante a inicialização não puder ser alocado, `mysqld` escreve um aviso no log de erro.

O valor efetivo do `open_files_limit` é baseado no valor especificado na inicialização do sistema (se houver) e nos valores de `max_connections` e `table_open_cache`, utilizando as seguintes fórmulas:

+ `10 + max_connections + (table_open_cache * 2)`

+ `max_connections * 5`
  + O limite do sistema operacional, se esse limite for positivo, mas não infinito.

+ Se o limite do sistema operacional for Infinito: `open_files_limit` valor se especificado na inicialização, 5000 se não for o caso.

O servidor tenta obter o número de descritores de arquivo usando o máximo desses valores. Se não for possível obter tantos descritores, o servidor tenta obter tantos quantos o sistema permite.

O valor efetivo é 0 em sistemas onde o MySQL não pode alterar o número de arquivos abertos.

Em Unix, o valor não pode ser definido maior que o valor exibido pelo comando **ulimit -n**. Em sistemas Linux que utilizam `systemd`, o valor não pode ser definido maior que `LimitNOFile` (este é `DefaultLimitNOFILE`, se `LimitNOFile` não estiver definido); caso contrário, em Linux, o valor de `open_files_limit` não pode exceder **ulimit -n**.

* `optimizer_prune_level`

  <table summary="Permitted values for the authentication_windows system variable."><col style="width: 10%"/><col style="width: 75%"/><thead><tr> <th>Value</th> <th>Descrição</th> </tr></thead><tbody><tr> <td>0</td> <td>Sem registro</td> </tr><tr> <td>1</td> <td>Registre apenas mensagens de erro</td> </tr><tr> <td>2</td> <td>Mensagens de nível 1 de log e mensagens de alerta</td> </tr><tr> <td>3</td> <td>Mensagens de nível 2 de log e notas de informação</td> </tr><tr> <td>4</td> <td>Mensagens de nível 3 de log e mensagens de depuração</td> </tr></tbody></table>52

Controla as heurísticas aplicadas durante a otimização da consulta para eliminar planos parciais menos promissores do espaço de busca do otimizador. Um valor de 0 desativa as heurísticas para que o otimizador realize uma busca exhaustiva. Um valor de 1 faz com que o otimizador elimine planos com base no número de strings recuperadas pelos planos intermediários.

* `optimizer_search_depth`

  <table summary="Permitted values for the authentication_windows system variable."><col style="width: 10%"/><col style="width: 75%"/><thead><tr> <th>Value</th> <th>Descrição</th> </tr></thead><tbody><tr> <td>0</td> <td>Sem registro</td> </tr><tr> <td>1</td> <td>Registre apenas mensagens de erro</td> </tr><tr> <td>2</td> <td>Mensagens de nível 1 de log e mensagens de alerta</td> </tr><tr> <td>3</td> <td>Mensagens de nível 2 de log e notas de informação</td> </tr><tr> <td>4</td> <td>Mensagens de nível 3 de log e mensagens de depuração</td> </tr></tbody></table>53

A profundidade máxima de pesquisa realizada pelo otimizador de consulta. Valores maiores que o número de relações em um resultado de consulta resultam em melhores planos de consulta, mas demoram mais para gerar um plano de execução para uma consulta. Valores menores que o número de relações em uma consulta retornam um plano de execução mais rápido, mas o plano resultante pode estar longe de ser ótimo. Se definido como 0, o sistema escolhe automaticamente um valor razoável.

* `optimizer_switch`

  <table summary="Permitted values for the authentication_windows system variable."><col style="width: 10%"/><col style="width: 75%"/><thead><tr> <th>Value</th> <th>Descrição</th> </tr></thead><tbody><tr> <td>0</td> <td>Sem registro</td> </tr><tr> <td>1</td> <td>Registre apenas mensagens de erro</td> </tr><tr> <td>2</td> <td>Mensagens de nível 1 de log e mensagens de alerta</td> </tr><tr> <td>3</td> <td>Mensagens de nível 2 de log e notas de informação</td> </tr><tr> <td>4</td> <td>Mensagens de nível 3 de log e mensagens de depuração</td> </tr></tbody></table>54

A variável de sistema `optimizer_switch` permite o controle do comportamento do otimizador. O valor desta variável é um conjunto de flags, cada uma com um valor de `on` ou `off` para indicar se o comportamento do otimizador correspondente está habilitado ou desabilitado. Esta variável tem valores globais e de sessão e pode ser alterada em tempo de execução. O valor padrão global pode ser definido na inicialização do servidor.

Para ver o conjunto atual de flags do otimizador, selecione o valor da variável:

  ```sql
  mysql> SELECT @@optimizer_switch\G
  *************************** 1. row ***************************
  @@optimizer_switch: index_merge=on,index_merge_union=on,
                      index_merge_sort_union=on,
                      index_merge_intersection=on,
                      engine_condition_pushdown=on,
                      index_condition_pushdown=on,
                      mrr=on,mrr_cost_based=on,
                      block_nested_loop=on,batched_key_access=off,
                      materialization=on,semijoin=on,loosescan=on,
                      firstmatch=on,duplicateweedout=on,
                      subquery_materialization_cost_based=on,
                      use_index_extensions=on,
                      condition_fanout_filter=on,derived_merge=on,
                      prefer_ordering_index=on
  ```

Para mais informações sobre a sintaxe desta variável e os comportamentos do otimizador que ela controla, consulte a Seção 8.9.2, “Otimizações Desconectables”.

* `optimizer_trace`

  <table summary="Permitted values for the authentication_windows system variable."><col style="width: 10%"/><col style="width: 75%"/><thead><tr> <th>Value</th> <th>Descrição</th> </tr></thead><tbody><tr> <td>0</td> <td>Sem registro</td> </tr><tr> <td>1</td> <td>Registre apenas mensagens de erro</td> </tr><tr> <td>2</td> <td>Mensagens de nível 1 de log e mensagens de alerta</td> </tr><tr> <td>3</td> <td>Mensagens de nível 2 de log e notas de informação</td> </tr><tr> <td>4</td> <td>Mensagens de nível 3 de log e mensagens de depuração</td> </tr></tbody></table>55

Essa variável controla o rastreamento do otimizador. Para detalhes, consulte a Seção 8.15, “Rastreamento do otimizador”.

* `optimizer_trace_features`

  <table summary="Permitted values for the authentication_windows system variable."><col style="width: 10%"/><col style="width: 75%"/><thead><tr> <th>Value</th> <th>Descrição</th> </tr></thead><tbody><tr> <td>0</td> <td>Sem registro</td> </tr><tr> <td>1</td> <td>Registre apenas mensagens de erro</td> </tr><tr> <td>2</td> <td>Mensagens de nível 1 de log e mensagens de alerta</td> </tr><tr> <td>3</td> <td>Mensagens de nível 2 de log e notas de informação</td> </tr><tr> <td>4</td> <td>Mensagens de nível 3 de log e mensagens de depuração</td> </tr></tbody></table>56

Essa variável habilita ou desabilita as características de rastreamento do otimizador selecionadas. Para obter detalhes, consulte a Seção 8.15, “Rastreamento do otimizador”.

* `optimizer_trace_limit`

  <table summary="Permitted values for the authentication_windows system variable."><col style="width: 10%"/><col style="width: 75%"/><thead><tr> <th>Value</th> <th>Descrição</th> </tr></thead><tbody><tr> <td>0</td> <td>Sem registro</td> </tr><tr> <td>1</td> <td>Registre apenas mensagens de erro</td> </tr><tr> <td>2</td> <td>Mensagens de nível 1 de log e mensagens de alerta</td> </tr><tr> <td>3</td> <td>Mensagens de nível 2 de log e notas de informação</td> </tr><tr> <td>4</td> <td>Mensagens de nível 3 de log e mensagens de depuração</td> </tr></tbody></table>57

O número máximo de rastros do otimizador a serem exibidos. Para detalhes, consulte a Seção 8.15, “Rastrear o otimizador”.

* `optimizer_trace_max_mem_size`

  <table summary="Permitted values for the authentication_windows system variable."><col style="width: 10%"/><col style="width: 75%"/><thead><tr> <th>Value</th> <th>Descrição</th> </tr></thead><tbody><tr> <td>0</td> <td>Sem registro</td> </tr><tr> <td>1</td> <td>Registre apenas mensagens de erro</td> </tr><tr> <td>2</td> <td>Mensagens de nível 1 de log e mensagens de alerta</td> </tr><tr> <td>3</td> <td>Mensagens de nível 2 de log e notas de informação</td> </tr><tr> <td>4</td> <td>Mensagens de nível 3 de log e mensagens de depuração</td> </tr></tbody></table>58

O tamanho cumulativo máximo dos rastros armazenados do otimizador. Para detalhes, consulte a Seção 8.15, “Rastrear o otimizador”.

* `optimizer_trace_offset`

  <table summary="Permitted values for the authentication_windows system variable."><col style="width: 10%"/><col style="width: 75%"/><thead><tr> <th>Value</th> <th>Descrição</th> </tr></thead><tbody><tr> <td>0</td> <td>Sem registro</td> </tr><tr> <td>1</td> <td>Registre apenas mensagens de erro</td> </tr><tr> <td>2</td> <td>Mensagens de nível 1 de log e mensagens de alerta</td> </tr><tr> <td>3</td> <td>Mensagens de nível 2 de log e notas de informação</td> </tr><tr> <td>4</td> <td>Mensagens de nível 3 de log e mensagens de depuração</td> </tr></tbody></table>59

O deslocamento das traçadas do otimizador para exibição. Para detalhes, consulte a Seção 8.15, “Rastrear o otimizador”.

* `performance_schema_xxx`

As variáveis do sistema do esquema de desempenho são listadas na Seção 25.15, “Variáveis do sistema do esquema de desempenho”. Essas variáveis podem ser usadas para configurar a operação do esquema de desempenho.

* `parser_max_mem_size`

  <table summary="Permitted values for the authentication_windows system variable."><col style="width: 10%"/><col style="width: 75%"/><thead><tr> <th>Value</th> <th>Descrição</th> </tr></thead><tbody><tr> <td>0</td> <td>Sem registro</td> </tr><tr> <td>1</td> <td>Registre apenas mensagens de erro</td> </tr><tr> <td>2</td> <td>Mensagens de nível 1 de log e mensagens de alerta</td> </tr><tr> <td>3</td> <td>Mensagens de nível 2 de log e notas de informação</td> </tr><tr> <td>4</td> <td>Mensagens de nível 3 de log e mensagens de depuração</td> </tr></tbody></table>60

O valor máximo de memória disponível para o analisador. O valor padrão não estabelece limite para a memória disponível. O valor pode ser reduzido para proteger contra situações de falta de memória causadas pela análise de declarações SQL longas ou complexas.

* `pid_file`

  <table summary="Permitted values for the authentication_windows system variable."><col style="width: 10%"/><col style="width: 75%"/><thead><tr> <th>Value</th> <th>Descrição</th> </tr></thead><tbody><tr> <td>0</td> <td>Sem registro</td> </tr><tr> <td>1</td> <td>Registre apenas mensagens de erro</td> </tr><tr> <td>2</td> <td>Mensagens de nível 1 de log e mensagens de alerta</td> </tr><tr> <td>3</td> <td>Mensagens de nível 2 de log e notas de informação</td> </tr><tr> <td>4</td> <td>Mensagens de nível 3 de log e mensagens de depuração</td> </tr></tbody></table>61

O nome do caminho do arquivo no qual o servidor escreve seu ID de processo. O servidor cria o arquivo no diretório de dados, a menos que um nome de caminho absoluto seja especificado para especificar um diretório diferente. Se você especificar essa variável, deve especificar um valor. Se você não especificar essa variável, o MySQL usa um valor padrão de `host_name.pid`, onde *`host_name`* é o nome da máquina hospedeira.

O arquivo de ID de processo é usado por outros programas, como `mysqld_safe`, para determinar o ID de processo do servidor. Em Windows, essa variável também afeta o nome do arquivo de log de erro padrão. Veja a Seção 5.4.2, “O Log de Erro”.

* `plugin_dir`

  <table summary="Permitted values for the authentication_windows system variable."><col style="width: 10%"/><col style="width: 75%"/><thead><tr> <th>Value</th> <th>Descrição</th> </tr></thead><tbody><tr> <td>0</td> <td>Sem registro</td> </tr><tr> <td>1</td> <td>Registre apenas mensagens de erro</td> </tr><tr> <td>2</td> <td>Mensagens de nível 1 de log e mensagens de alerta</td> </tr><tr> <td>3</td> <td>Mensagens de nível 2 de log e notas de informação</td> </tr><tr> <td>4</td> <td>Mensagens de nível 3 de log e mensagens de depuração</td> </tr></tbody></table>62

O nome do caminho do diretório do plugin.

Se o diretório do plugin for legível pelo servidor, pode ser possível que um usuário escreva código executável em um arquivo no diretório usando `SELECT ... INTO DUMPFILE`. Isso pode ser prevenido ao tornar `plugin_dir` somente leitura para o servidor ou ao definir `secure_file_priv` para um diretório onde as `SELECT` podem ser escritas com segurança.

* `port`

  <table summary="Permitted values for the authentication_windows system variable."><col style="width: 10%"/><col style="width: 75%"/><thead><tr> <th>Value</th> <th>Descrição</th> </tr></thead><tbody><tr> <td>0</td> <td>Sem registro</td> </tr><tr> <td>1</td> <td>Registre apenas mensagens de erro</td> </tr><tr> <td>2</td> <td>Mensagens de nível 1 de log e mensagens de alerta</td> </tr><tr> <td>3</td> <td>Mensagens de nível 2 de log e notas de informação</td> </tr><tr> <td>4</td> <td>Mensagens de nível 3 de log e mensagens de depuração</td> </tr></tbody></table>63

O número do porto no qual o servidor escuta conexões TCP/IP. Essa variável pode ser definida com a opção `--port`.

* `preload_buffer_size`

  <table summary="Permitted values for the authentication_windows system variable."><col style="width: 10%"/><col style="width: 75%"/><thead><tr> <th>Value</th> <th>Descrição</th> </tr></thead><tbody><tr> <td>0</td> <td>Sem registro</td> </tr><tr> <td>1</td> <td>Registre apenas mensagens de erro</td> </tr><tr> <td>2</td> <td>Mensagens de nível 1 de log e mensagens de alerta</td> </tr><tr> <td>3</td> <td>Mensagens de nível 2 de log e notas de informação</td> </tr><tr> <td>4</td> <td>Mensagens de nível 3 de log e mensagens de depuração</td> </tr></tbody></table>64

O tamanho do buffer que é alocado ao pré-carregar índices.

* `profiling`

Se definido como 0 ou `OFF` (o padrão), o perfilamento de declarações é desativado. Se definido como 1 ou `ON`, o perfilamento de declarações é ativado e as declarações `SHOW PROFILE` e `SHOW PROFILES` fornecem acesso às informações de perfilamento. Veja a Seção 13.7.5.31, “Declaração SHOW PROFILES”.

Essa variável é desatualizada; espere que ela seja removida em uma versão futura do MySQL.

* `profiling_history_size`

O número de declarações para as quais manter as informações de perfilamento se `profiling` estiver habilitado. O valor padrão é 15. O valor máximo é 100. Definir o valor em 0 desativa efetivamente o perfilamento. Veja a Seção 13.7.5.31, “Declaração SHOW PROFILES”.

Essa variável é desatualizada; espere que ela seja removida em uma versão futura do MySQL.

* `protocol_version`

  <table summary="Permitted values for the authentication_windows system variable."><col style="width: 10%"/><col style="width: 75%"/><thead><tr> <th>Value</th> <th>Descrição</th> </tr></thead><tbody><tr> <td>0</td> <td>Sem registro</td> </tr><tr> <td>1</td> <td>Registre apenas mensagens de erro</td> </tr><tr> <td>2</td> <td>Mensagens de nível 1 de log e mensagens de alerta</td> </tr><tr> <td>3</td> <td>Mensagens de nível 2 de log e notas de informação</td> </tr><tr> <td>4</td> <td>Mensagens de nível 3 de log e mensagens de depuração</td> </tr></tbody></table>65

A versão do protocolo cliente/servidor utilizado pelo servidor MySQL.

* `proxy_user`

  <table summary="Permitted values for the authentication_windows system variable."><col style="width: 10%"/><col style="width: 75%"/><thead><tr> <th>Value</th> <th>Descrição</th> </tr></thead><tbody><tr> <td>0</td> <td>Sem registro</td> </tr><tr> <td>1</td> <td>Registre apenas mensagens de erro</td> </tr><tr> <td>2</td> <td>Mensagens de nível 1 de log e mensagens de alerta</td> </tr><tr> <td>3</td> <td>Mensagens de nível 2 de log e notas de informação</td> </tr><tr> <td>4</td> <td>Mensagens de nível 3 de log e mensagens de depuração</td> </tr></tbody></table>66

Se o cliente atual for um proxy para outro usuário, essa variável é o nome da conta do usuário proxy. Caso contrário, essa variável é `NULL`. Veja a Seção 6.2.14, “Usuários Proxy”.

* `pseudo_slave_mode`

  <table summary="Permitted values for the authentication_windows system variable."><col style="width: 10%"/><col style="width: 75%"/><thead><tr> <th>Value</th> <th>Descrição</th> </tr></thead><tbody><tr> <td>0</td> <td>Sem registro</td> </tr><tr> <td>1</td> <td>Registre apenas mensagens de erro</td> </tr><tr> <td>2</td> <td>Mensagens de nível 1 de log e mensagens de alerta</td> </tr><tr> <td>3</td> <td>Mensagens de nível 2 de log e notas de informação</td> </tr><tr> <td>4</td> <td>Mensagens de nível 3 de log e mensagens de depuração</td> </tr></tbody></table>67

Essa variável do sistema é para uso interno do servidor. `pseudo_slave_mode` auxilia na manipulação correta das transações que foram geradas em servidores mais antigos ou mais novos do que o servidor que as está processando atualmente. **mysqlbinlog** define o valor de `pseudo_slave_mode` como verdadeiro antes de executar quaisquer instruções SQL.

`pseudo_slave_mode` tem os seguintes efeitos no manuseio de transações preparadas XA, que podem ser anexados ou separados da sessão de manuseio (por padrão, a sessão que emite `XA START`):

+ Se for verdade, e a sessão de manipulação executou uma declaração de uso interno `BINLOG`, as transações XA são automaticamente descontadas da sessão assim que a primeira parte da transação até `XA PREPARE` terminar, para que possam ser comprometidas ou revertidas por qualquer sessão que tenha o privilégio `XA_RECOVER_ADMIN`.

+ Se falso, as transações XA permanecem anexadas à sessão de manipulação enquanto essa sessão estiver ativa, durante o qual nenhum outro processo pode comprometê-la. A transação preparada só é desanexada se a sessão se desconectar ou o servidor for reiniciado.

* `pseudo_thread_id`

  <table summary="Permitted values for the authentication_windows system variable."><col style="width: 10%"/><col style="width: 75%"/><thead><tr> <th>Value</th> <th>Descrição</th> </tr></thead><tbody><tr> <td>0</td> <td>Sem registro</td> </tr><tr> <td>1</td> <td>Registre apenas mensagens de erro</td> </tr><tr> <td>2</td> <td>Mensagens de nível 1 de log e mensagens de alerta</td> </tr><tr> <td>3</td> <td>Mensagens de nível 2 de log e notas de informação</td> </tr><tr> <td>4</td> <td>Mensagens de nível 3 de log e mensagens de depuração</td> </tr></tbody></table>68

Esta variável é para uso interno do servidor.

Aviso

Altere o valor da sessão da variável de sistema `pseudo_thread_id` e o valor retornado pela função `CONNECTION_ID()` será alterado.

* `query_alloc_block_size`

  <table summary="Permitted values for the authentication_windows system variable."><col style="width: 10%"/><col style="width: 75%"/><thead><tr> <th>Value</th> <th>Descrição</th> </tr></thead><tbody><tr> <td>0</td> <td>Sem registro</td> </tr><tr> <td>1</td> <td>Registre apenas mensagens de erro</td> </tr><tr> <td>2</td> <td>Mensagens de nível 1 de log e mensagens de alerta</td> </tr><tr> <td>3</td> <td>Mensagens de nível 2 de log e notas de informação</td> </tr><tr> <td>4</td> <td>Mensagens de nível 3 de log e mensagens de depuração</td> </tr></tbody></table>69

O tamanho da alocação em bytes dos blocos de memória que são alocados para objetos criados durante a análise e execução da declaração. Se você tiver problemas com fragmentação de memória, pode ser útil aumentar este parâmetro.

O tamanho do bloco para o número de bytes é de 1024. Um valor que não é um múltiplo exato do tamanho do bloco é arredondado para o próximo múltiplo inferior do tamanho do bloco pelo MySQL Server antes de armazenar o valor para a variável do sistema. O analisador permite valores até o valor máximo de inteiro não assinado para a plataforma (4294967295 ou 232−1 para um sistema de 32 bits, 18446744073709551615 ou 264−1 para um sistema de 64 bits), mas o máximo real é um tamanho de bloco inferior.

* `query_cache_limit`

  <table summary="Permitted values for the authentication_windows system variable."><col style="width: 10%"/><col style="width: 75%"/><thead><tr> <th>Value</th> <th>Descrição</th> </tr></thead><tbody><tr> <td>0</td> <td>Sem registro</td> </tr><tr> <td>1</td> <td>Registre apenas mensagens de erro</td> </tr><tr> <td>2</td> <td>Mensagens de nível 1 de log e mensagens de alerta</td> </tr><tr> <td>3</td> <td>Mensagens de nível 2 de log e notas de informação</td> </tr><tr> <td>4</td> <td>Mensagens de nível 3 de log e mensagens de depuração</td> </tr></tbody></table>70

Não cache os resultados que sejam maiores que este número de bytes. O valor padrão é 1 MB.

Nota

O cache de consulta é descontinuado a partir do MySQL 5.7.20 e é removido no MySQL 8.0. A depreciação inclui `query_cache_limit`.

* `query_cache_min_res_unit`

  <table summary="Permitted values for the authentication_windows system variable."><col style="width: 10%"/><col style="width: 75%"/><thead><tr> <th>Value</th> <th>Descrição</th> </tr></thead><tbody><tr> <td>0</td> <td>Sem registro</td> </tr><tr> <td>1</td> <td>Registre apenas mensagens de erro</td> </tr><tr> <td>2</td> <td>Mensagens de nível 1 de log e mensagens de alerta</td> </tr><tr> <td>3</td> <td>Mensagens de nível 2 de log e notas de informação</td> </tr><tr> <td>4</td> <td>Mensagens de nível 3 de log e mensagens de depuração</td> </tr></tbody></table>71

O tamanho mínimo (em bytes) para blocos alocados pelo cache de consulta. O valor padrão é 4096 (4 KB). As informações de ajuste para esta variável estão fornecidas na Seção 8.10.3.3, “Configuração do Cache de Consulta”.

Nota

O cache de consulta é descontinuado a partir do MySQL 5.7.20 e é removido no MySQL 8.0. A depreciação inclui `query_cache_min_res_unit`.

* `query_cache_size`

  <table summary="Permitted values for the authentication_windows system variable."><col style="width: 10%"/><col style="width: 75%"/><thead><tr> <th>Value</th> <th>Descrição</th> </tr></thead><tbody><tr> <td>0</td> <td>Sem registro</td> </tr><tr> <td>1</td> <td>Registre apenas mensagens de erro</td> </tr><tr> <td>2</td> <td>Mensagens de nível 1 de log e mensagens de alerta</td> </tr><tr> <td>3</td> <td>Mensagens de nível 2 de log e notas de informação</td> </tr><tr> <td>4</td> <td>Mensagens de nível 3 de log e mensagens de depuração</td> </tr></tbody></table>72

O valor de memória alocado para o armazenamento de resultados de consultas. Por padrão, o cache de consulta é desativado. Isso é alcançado usando um valor padrão de 1M, com um valor padrão para `query_cache_type` de 0. (Para reduzir significativamente o overhead se você definir o tamanho para 0, você também deve iniciar o servidor com `query_cache_type=0`.

Os valores permitidos são múltiplos de 1024; outros valores são arredondados para o múltiplo mais próximo. Para valores não nulos de `query_cache_size`, são alocados tantos bytes de memória, mesmo que `query_cache_type=0`. Consulte a Seção 8.10.3.3, “Configuração do Cache de Consulta”, para obter mais informações.

O cache de consulta precisa de um tamanho mínimo de cerca de 40 KB para alocar suas estruturas. (O tamanho exato depende da arquitetura do sistema.) Se você definir o valor de `query_cache_size` como muito pequeno, um aviso ocorre, conforme descrito na Seção 8.10.3.3, “Configuração do Cache de Consulta”.

Nota

O cache de consulta é descontinuado a partir do MySQL 5.7.20 e é removido no MySQL 8.0. A depreciação inclui `query_cache_size`.

* `query_cache_type`

  <table summary="Permitted values for the authentication_windows system variable."><col style="width: 10%"/><col style="width: 75%"/><thead><tr> <th>Value</th> <th>Descrição</th> </tr></thead><tbody><tr> <td>0</td> <td>Sem registro</td> </tr><tr> <td>1</td> <td>Registre apenas mensagens de erro</td> </tr><tr> <td>2</td> <td>Mensagens de nível 1 de log e mensagens de alerta</td> </tr><tr> <td>3</td> <td>Mensagens de nível 2 de log e notas de informação</td> </tr><tr> <td>4</td> <td>Mensagens de nível 3 de log e mensagens de depuração</td> </tr></tbody></table>73

Defina o tipo de cache de consulta. Definir o valor `GLOBAL` define o tipo para todos os clientes que se conectam posteriormente. Os clientes individuais podem definir o valor `SESSION` para afetar o uso próprio do cache de consulta. Os valores possíveis são mostrados na tabela a seguir.

  <table summary="Permitted values for the authentication_windows system variable."><col style="width: 10%"/><col style="width: 75%"/><thead><tr> <th>Value</th> <th>Descrição</th> </tr></thead><tbody><tr> <td>0</td> <td>Sem registro</td> </tr><tr> <td>1</td> <td>Registre apenas mensagens de erro</td> </tr><tr> <td>2</td> <td>Mensagens de nível 1 de log e mensagens de alerta</td> </tr><tr> <td>3</td> <td>Mensagens de nível 2 de log e notas de informação</td> </tr><tr> <td>4</td> <td>Mensagens de nível 3 de log e mensagens de depuração</td> </tr></tbody></table>74

Essa variável tem como padrão `OFF`.

Se o servidor for iniciado com `query_cache_type` definido como 0, ele não adquire o mutex do cache de consulta de forma alguma, o que significa que o cache de consulta não pode ser habilitado em tempo de execução e há um custo operacional reduzido na execução da consulta.

Nota

O cache de consulta é descontinuado a partir do MySQL 5.7.20 e é removido no MySQL 8.0. A depreciação inclui `query_cache_type`.

* `query_cache_wlock_invalidate`

  <table summary="Permitted values for the authentication_windows system variable."><col style="width: 10%"/><col style="width: 75%"/><thead><tr> <th>Value</th> <th>Descrição</th> </tr></thead><tbody><tr> <td>0</td> <td>Sem registro</td> </tr><tr> <td>1</td> <td>Registre apenas mensagens de erro</td> </tr><tr> <td>2</td> <td>Mensagens de nível 1 de log e mensagens de alerta</td> </tr><tr> <td>3</td> <td>Mensagens de nível 2 de log e notas de informação</td> </tr><tr> <td>4</td> <td>Mensagens de nível 3 de log e mensagens de depuração</td> </tr></tbody></table>75

Normalmente, quando um cliente adquire um bloqueio `WRITE` em uma tabela, outros clientes não são bloqueados para emitir declarações que leem a tabela se os resultados da consulta estiverem presentes no cache de consulta. Definir essa variável para 1 faz com que a aquisição de um bloqueio `WRITE` para uma tabela in valide quaisquer consultas no cache de consulta que se refiram à tabela. Isso obriga outros clientes que tentam acessar a tabela a esperar enquanto o bloqueio estiver em vigor.

Nota

O cache de consulta é descontinuado a partir do MySQL 5.7.20 e é removido no MySQL 8.0. A depreciação inclui `query_cache_wlock_invalidate`.

* `query_prealloc_size`

  <table summary="Permitted values for the authentication_windows system variable."><col style="width: 10%"/><col style="width: 75%"/><thead><tr> <th>Value</th> <th>Descrição</th> </tr></thead><tbody><tr> <td>0</td> <td>Sem registro</td> </tr><tr> <td>1</td> <td>Registre apenas mensagens de erro</td> </tr><tr> <td>2</td> <td>Mensagens de nível 1 de log e mensagens de alerta</td> </tr><tr> <td>3</td> <td>Mensagens de nível 2 de log e notas de informação</td> </tr><tr> <td>4</td> <td>Mensagens de nível 3 de log e mensagens de depuração</td> </tr></tbody></table>76

O tamanho em bytes do buffer persistente usado para a análise e execução de declarações. Esse buffer não é liberado entre as declarações. Se você estiver executando consultas complexas, um valor maior de `query_prealloc_size` pode ser útil para melhorar o desempenho, pois pode reduzir a necessidade do servidor de realizar alocação de memória durante as operações de execução de consulta. Você deve estar ciente de que fazer isso não elimina necessariamente a alocação completamente; o servidor ainda pode alocar memória em algumas situações, como para operações relacionadas a transações ou a programas armazenados.

* `rand_seed1`

  <table summary="Permitted values for the authentication_windows system variable."><col style="width: 10%"/><col style="width: 75%"/><thead><tr> <th>Value</th> <th>Descrição</th> </tr></thead><tbody><tr> <td>0</td> <td>Sem registro</td> </tr><tr> <td>1</td> <td>Registre apenas mensagens de erro</td> </tr><tr> <td>2</td> <td>Mensagens de nível 1 de log e mensagens de alerta</td> </tr><tr> <td>3</td> <td>Mensagens de nível 2 de log e notas de informação</td> </tr><tr> <td>4</td> <td>Mensagens de nível 3 de log e mensagens de depuração</td> </tr></tbody></table>77

As variáveis `rand_seed1` e `rand_seed2` existem apenas como variáveis de sessão e podem ser definidas, mas não lidas. As variáveis — mas não seus valores — são exibidas na saída de `SHOW VARIABLES`.

O propósito dessas variáveis é suportar a replicação da função `RAND()`. Para declarações que invocam `RAND()`, a fonte passa dois valores para a replica, onde são usados para gerar um número aleatório. A replica usa esses valores para definir as variáveis de sessão `rand_seed1` e `rand_seed2` para que `RAND()` na replica gere o mesmo valor que na fonte.

* `rand_seed2`

Veja a descrição para `rand_seed1`.

* `range_alloc_block_size`

  <table summary="Permitted values for the authentication_windows system variable."><col style="width: 10%"/><col style="width: 75%"/><thead><tr> <th>Value</th> <th>Descrição</th> </tr></thead><tbody><tr> <td>0</td> <td>Sem registro</td> </tr><tr> <td>1</td> <td>Registre apenas mensagens de erro</td> </tr><tr> <td>2</td> <td>Mensagens de nível 1 de log e mensagens de alerta</td> </tr><tr> <td>3</td> <td>Mensagens de nível 2 de log e notas de informação</td> </tr><tr> <td>4</td> <td>Mensagens de nível 3 de log e mensagens de depuração</td> </tr></tbody></table>78

O tamanho em bytes dos blocos que são alocados ao realizar a otimização de intervalo.

O tamanho do bloco para o número de bytes é de 1024. Um valor que não é um múltiplo exato do tamanho do bloco é arredondado para o próximo múltiplo inferior do tamanho do bloco pelo MySQL Server antes de armazenar o valor para a variável do sistema. O analisador permite valores até o valor máximo de inteiro não assinado para a plataforma (4294967295 ou 232−1 para um sistema de 32 bits, 18446744073709551615 ou 264−1 para um sistema de 64 bits), mas o máximo real é um tamanho de bloco inferior.

* `range_optimizer_max_mem_size`

  <table summary="Permitted values for the authentication_windows system variable."><col style="width: 10%"/><col style="width: 75%"/><thead><tr> <th>Value</th> <th>Descrição</th> </tr></thead><tbody><tr> <td>0</td> <td>Sem registro</td> </tr><tr> <td>1</td> <td>Registre apenas mensagens de erro</td> </tr><tr> <td>2</td> <td>Mensagens de nível 1 de log e mensagens de alerta</td> </tr><tr> <td>3</td> <td>Mensagens de nível 2 de log e notas de informação</td> </tr><tr> <td>4</td> <td>Mensagens de nível 3 de log e mensagens de depuração</td> </tr></tbody></table>79

O limite de consumo de memória para o otimizador de intervalo. Um valor de 0 significa “sem limite”. Se um plano de execução considerado pelo otimizador usa o método de acesso de intervalo, mas o otimizador estima que a quantidade de memória necessária para esse método excederá o limite, ele abandona o plano e considera outros planos. Para mais informações, consulte Limitar o uso de memória para otimização de intervalo.

* `rbr_exec_mode`

  <table summary="Permitted values for the authentication_windows system variable."><col style="width: 10%"/><col style="width: 75%"/><thead><tr> <th>Value</th> <th>Descrição</th> </tr></thead><tbody><tr> <td>0</td> <td>Sem registro</td> </tr><tr> <td>1</td> <td>Registre apenas mensagens de erro</td> </tr><tr> <td>2</td> <td>Mensagens de nível 1 de log e mensagens de alerta</td> </tr><tr> <td>3</td> <td>Mensagens de nível 2 de log e notas de informação</td> </tr><tr> <td>4</td> <td>Mensagens de nível 3 de log e mensagens de depuração</td> </tr></tbody></table>80

Para uso interno pelo **mysqlbinlog**. Esta variável troca o servidor entre os modos `IDEMPOTENT` e `STRICT`. O modo `IDEMPOTENT` causa a supressão de erros de chave duplicada e sem chave encontrada nas declarações `BINLOG` geradas pelo **mysqlbinlog**. Este modo é útil ao refazer um log binário baseado em string em um servidor que causa conflitos com dados existentes. O **mysqlbinlog** define este modo quando você especifica a opção `--idempotent` escrevendo o seguinte na saída:

  ```sql
  SET SESSION RBR_EXEC_MODE=IDEMPOTENT;
  ```

* `read_buffer_size`

  <table summary="Permitted values for the authentication_windows system variable."><col style="width: 10%"/><col style="width: 75%"/><thead><tr> <th>Value</th> <th>Descrição</th> </tr></thead><tbody><tr> <td>0</td> <td>Sem registro</td> </tr><tr> <td>1</td> <td>Registre apenas mensagens de erro</td> </tr><tr> <td>2</td> <td>Mensagens de nível 1 de log e mensagens de alerta</td> </tr><tr> <td>3</td> <td>Mensagens de nível 2 de log e notas de informação</td> </tr><tr> <td>4</td> <td>Mensagens de nível 3 de log e mensagens de depuração</td> </tr></tbody></table>81

Cada thread que realiza uma varredura sequencial para uma tabela `MyISAM` aloca um buffer desse tamanho (em bytes) para cada tabela que ele varre. Se você fizer muitas varreduras sequenciais, você pode querer aumentar esse valor, que tem como padrão 131072. O valor dessa variável deve ser um múltiplo de 4KB. Se estiver definido para um valor que não é um múltiplo de 4KB, seu valor é arredondado para o próximo múltiplo de 4KB.

Essa opção também é usada no seguinte contexto para todos os motores de armazenamento:

+ Para o armazenamento de índices em um arquivo temporário (não em uma tabela temporária), ao ordenar as strings para `ORDER BY`.

+ Para inserção em massa em partições.
+ Para cache de resultados de consultas aninhadas.

`read_buffer_size` também é usado de outra forma específica para o motor de armazenamento: para determinar o tamanho do bloco de memória para as tabelas `MEMORY`.

Para mais informações sobre o uso da memória durante diferentes operações, consulte a Seção 8.12.4.1, “Como o MySQL usa memória”.

* `read_only`

  <table summary="Permitted values for the authentication_windows system variable."><col style="width: 10%"/><col style="width: 75%"/><thead><tr> <th>Value</th> <th>Descrição</th> </tr></thead><tbody><tr> <td>0</td> <td>Sem registro</td> </tr><tr> <td>1</td> <td>Registre apenas mensagens de erro</td> </tr><tr> <td>2</td> <td>Mensagens de nível 1 de log e mensagens de alerta</td> </tr><tr> <td>3</td> <td>Mensagens de nível 2 de log e notas de informação</td> </tr><tr> <td>4</td> <td>Mensagens de nível 3 de log e mensagens de depuração</td> </tr></tbody></table>82

Se a variável de sistema `read_only` estiver habilitada, o servidor não permite nenhuma atualização do cliente, exceto para usuários que possuem o privilégio `SUPER`. Essa variável é desabilitada por padrão.

O servidor também suporta uma variável de sistema `super_read_only` (desativada por padrão), que tem esses efeitos:

+ Se o `super_read_only` estiver habilitado, o servidor proíbe atualizações do cliente, mesmo de usuários que possuem o privilégio `SUPER`.

+ Definir `super_read_only` para `ON` implicitamente força `read_only` para `ON`.

+ Definir `read_only` para `OFF` implicitamente força `super_read_only` para `OFF`.

Mesmo com `read_only` habilitado, o servidor permite essas operações:

+ Atualizações realizadas por threads de replicação, se o servidor for uma replica. Em configurações de replicação, pode ser útil habilitar `read_only` em servidores replicados para garantir que as réplicas aceitem atualizações apenas do servidor de origem e não dos clientes.

+ Uso das declarações `ANALYZE TABLE` ou `OPTIMIZE TABLE`. O propósito do modo de leitura somente é impedir alterações na estrutura ou conteúdo da tabela. Análises e otimizações não se qualificam como tais alterações. Isso significa, por exemplo, que verificações de consistência em réplicas de leitura somente podem ser realizadas com **mysqlcheck** `--all-databases` `--analyze`.

+ Uso das declarações `FLUSH STATUS`, que são sempre escritas no log binário.

+ Operações nas tabelas `TEMPORARY`.  + Inserções nas tabelas de log (`mysql.general_log` e `mysql.slow_log`); veja a Seção 5.4.1, “Selecionando destinos de saída de log de consulta geral e log de consulta lenta”.

+ A partir do MySQL 5.7.16, as atualizações nas tabelas do Gerador de Desempenho, como as operações `UPDATE` ou `TRUNCATE TABLE`, são afetadas.

As alterações em `read_only` em um servidor de origem de replicação não são replicadas para os servidores replicados. O valor pode ser definido em uma replica independente da configuração na fonte.

As seguintes condições se aplicam às tentativas de habilitar `read_only` (incluindo tentativas implícitas resultantes da habilitação de `super_read_only`):

+ A tentativa falha e ocorre um erro se você tiver qualquer bloqueio explícito (adquirido com `LOCK TABLES`) ou tiver uma transação pendente.

+ A tentativa é bloqueada enquanto outros clientes têm uma declaração em andamento, ativo `LOCK TABLES WRITE`, ou um compromisso em andamento, até que os bloqueios sejam liberados e as declarações e transações terminem. Enquanto a tentativa de habilitar `read_only` está pendente, as solicitações de outros clientes para bloqueios de tabela ou para iniciar transações também são bloqueadas até que `read_only` tenha sido definido.

+ A tentativa é bloqueada se houver transações ativas que possuem bloqueios de metadados, até que essas transações terminem.

+ `read_only` pode ser habilitado enquanto você mantém um bloqueio de leitura global (adquirido com `FLUSH TABLES WITH READ LOCK`) porque isso não envolve bloqueios de tabela.

* `read_rnd_buffer_size`

  <table summary="Permitted values for the authentication_windows system variable."><col style="width: 10%"/><col style="width: 75%"/><thead><tr> <th>Value</th> <th>Descrição</th> </tr></thead><tbody><tr> <td>0</td> <td>Sem registro</td> </tr><tr> <td>1</td> <td>Registre apenas mensagens de erro</td> </tr><tr> <td>2</td> <td>Mensagens de nível 1 de log e mensagens de alerta</td> </tr><tr> <td>3</td> <td>Mensagens de nível 2 de log e notas de informação</td> </tr><tr> <td>4</td> <td>Mensagens de nível 3 de log e mensagens de depuração</td> </tr></tbody></table>83

Essa variável é usada para leituras de tabelas de `MyISAM`, e, para qualquer mecanismo de armazenamento, para otimização de leitura de Multi-Range.

Ao ler strings de uma tabela `MyISAM` em ordem ordenada após uma operação de classificação por chave, as strings são lidas através deste buffer para evitar buscas em disco. Veja a Seção 8.2.1.14, “Otimização de ORDER BY”. Definir a variável em um valor grande pode melhorar muito o desempenho do `ORDER BY`. No entanto, esta é uma buffer alocada para cada cliente, portanto, você não deve definir a variável global em um valor grande. Em vez disso, altere a variável de sessão apenas dentro dos clientes que precisam executar consultas grandes.

Para mais informações sobre o uso da memória durante diferentes operações, consulte a Seção 8.12.4.1, “Como o MySQL usa memória”. Para informações sobre otimização de leitura de vários intervalos, consulte a Seção 8.2.1.10, “Otimização de leitura de vários intervalos”.

* `require_secure_transport`

  <table summary="Permitted values for the authentication_windows system variable."><col style="width: 10%"/><col style="width: 75%"/><thead><tr> <th>Value</th> <th>Descrição</th> </tr></thead><tbody><tr> <td>0</td> <td>Sem registro</td> </tr><tr> <td>1</td> <td>Registre apenas mensagens de erro</td> </tr><tr> <td>2</td> <td>Mensagens de nível 1 de log e mensagens de alerta</td> </tr><tr> <td>3</td> <td>Mensagens de nível 2 de log e notas de informação</td> </tr><tr> <td>4</td> <td>Mensagens de nível 3 de log e mensagens de depuração</td> </tr></tbody></table>84

Se as conexões do cliente ao servidor são necessárias para usar algum tipo de transporte seguro. Quando essa variável é habilitada, o servidor permite apenas conexões TCP/IP criptografadas usando TLS/SSL, ou conexões que usam um arquivo de soquete (em Unix) ou memória compartilhada (em Windows). O servidor rejeita tentativas de conexão não seguras, que falham com um erro `ER_SECURE_TRANSPORT_REQUIRED`.

Essa capacidade complementa os requisitos de SSL por conta, que têm precedência. Por exemplo, se uma conta é definida com `REQUIRE SSL`, habilitar `require_secure_transport` não permite usar a conta para se conectar usando um arquivo de socket Unix.

É possível que um servidor não tenha nenhum transporte seguro disponível. Por exemplo, um servidor no Windows não suporta nenhum transporte seguro se for iniciado sem especificar nenhum certificado SSL ou arquivos de chave e com a variável de sistema `shared_memory` desativada. Nessas condições, as tentativas de habilitar `require_secure_transport` no início causam o servidor a escrever uma mensagem no log de erro e sair. As tentativas de habilitar a variável em tempo de execução falham com um erro `ER_NO_SECURE_TRANSPORTS_CONFIGURED`.

Veja também Configurar conexões criptografadas como obrigatórias.

* `secure_auth`

  <table summary="Permitted values for the authentication_windows system variable."><col style="width: 10%"/><col style="width: 75%"/><thead><tr> <th>Value</th> <th>Descrição</th> </tr></thead><tbody><tr> <td>0</td> <td>Sem registro</td> </tr><tr> <td>1</td> <td>Registre apenas mensagens de erro</td> </tr><tr> <td>2</td> <td>Mensagens de nível 1 de log e mensagens de alerta</td> </tr><tr> <td>3</td> <td>Mensagens de nível 2 de log e notas de informação</td> </tr><tr> <td>4</td> <td>Mensagens de nível 3 de log e mensagens de depuração</td> </tr></tbody></table>85

Se essa variável estiver habilitada, o servidor bloqueia as conexões dos clientes que tentam usar contas que têm senhas armazenadas no formato antigo (pré-4.1). Habilite essa variável para impedir o uso de todas as senhas que empregam o formato antigo (e, portanto, comunicação insegura na rede).

Essa variável é desatualizada; espere que ela seja removida em uma versão futura do MySQL. Ela sempre está habilitada e tentar desabilitá-la produz um erro.

A inicialização do servidor falha com um erro se essa variável estiver habilitada e as tabelas de privilégio estiverem no formato pré-4.1. Veja a Seção 6.4.1.3, “Migrando para fora da codificação de senha pré-4.1 e do plugin mysql_old_password”.

Nota

As senhas que utilizam o método de hashing pré-4.1 são menos seguras do que as senhas que utilizam o método nativo de hashing de senha e devem ser evitadas. As senhas pré-4.1 são desaconselhadas e o suporte para elas é removido no MySQL 5.7.5. Para instruções de atualização de conta, consulte a Seção 6.4.1.3, “Migrando para fora do hashing de senha pré-4.1 e do plugin mysql_old_password”.

* `secure_file_priv`

  <table summary="Permitted values for the authentication_windows system variable."><col style="width: 10%"/><col style="width: 75%"/><thead><tr> <th>Value</th> <th>Descrição</th> </tr></thead><tbody><tr> <td>0</td> <td>Sem registro</td> </tr><tr> <td>1</td> <td>Registre apenas mensagens de erro</td> </tr><tr> <td>2</td> <td>Mensagens de nível 1 de log e mensagens de alerta</td> </tr><tr> <td>3</td> <td>Mensagens de nível 2 de log e notas de informação</td> </tr><tr> <td>4</td> <td>Mensagens de nível 3 de log e mensagens de depuração</td> </tr></tbody></table>86

Essa variável é usada para limitar o efeito das operações de importação e exportação de dados, como as realizadas pelas declarações `LOAD DATA` e `SELECT ... INTO OUTFILE` e a função `LOAD_FILE()`. Essas operações são permitidas apenas para usuários que possuem o privilégio `FILE`.

`secure_file_priv` pode ser definido da seguinte forma:

+ Se estiver vazia, a variável não terá efeito. Não é uma configuração segura.

+ Se configurado com o nome de um diretório, o servidor limita as operações de importação e exportação para trabalhar apenas com arquivos nesse diretório. O diretório deve existir; o servidor não o cria.

+ Se configurado em `NULL`, o servidor desativa as operações de importação e exportação.

O valor padrão é específico da plataforma e depende do valor da opção `INSTALL_LAYOUT` **CMake**, conforme mostrado na tabela a seguir. Para especificar explicitamente o valor padrão da `secure_file_priv` se você estiver compilando a partir do código-fonte, use a opção `INSTALL_SECURE_FILE_PRIVDIR` **CMake**.

  <table summary="Permitted values for the authentication_windows system variable."><col style="width: 10%"/><col style="width: 75%"/><thead><tr> <th>Value</th> <th>Descrição</th> </tr></thead><tbody><tr> <td>0</td> <td>Sem registro</td> </tr><tr> <td>1</td> <td>Registre apenas mensagens de erro</td> </tr><tr> <td>2</td> <td>Mensagens de nível 1 de log e mensagens de alerta</td> </tr><tr> <td>3</td> <td>Mensagens de nível 2 de log e notas de informação</td> </tr><tr> <td>4</td> <td>Mensagens de nível 3 de log e mensagens de depuração</td> </tr></tbody></table>87

Para definir o valor padrão do `secure_file_priv` para o servidor embutido `libmysqld`, use a opção **CMake** do `INSTALL_SECURE_FILE_PRIV_EMBEDDEDDIR`. O valor padrão para essa opção é `NULL`.

O servidor verifica o valor de `secure_file_priv` ao iniciar e escreve um aviso no log de erro se o valor for inseguro. Um valor que não é `NULL` é considerado inseguro se estiver vazio, ou se o valor for o diretório de dados ou um subdiretório dele, ou um diretório que é acessível por todos os usuários. Se `secure_file_priv` estiver definido em um caminho inexistente, o servidor escreve uma mensagem de erro no log de erro e sai.

* `session_track_gtids`

  <table summary="Permitted values for the authentication_windows system variable."><col style="width: 10%"/><col style="width: 75%"/><thead><tr> <th>Value</th> <th>Descrição</th> </tr></thead><tbody><tr> <td>0</td> <td>Sem registro</td> </tr><tr> <td>1</td> <td>Registre apenas mensagens de erro</td> </tr><tr> <td>2</td> <td>Mensagens de nível 1 de log e mensagens de alerta</td> </tr><tr> <td>3</td> <td>Mensagens de nível 2 de log e notas de informação</td> </tr><tr> <td>4</td> <td>Mensagens de nível 3 de log e mensagens de depuração</td> </tr></tbody></table>88

Controla se o servidor retorna GTIDs ao cliente, permitindo que o cliente os use para rastrear o estado do servidor. Dependendo do valor da variável, no final da execução de cada transação, os GTIDs do servidor são capturados e retornados ao cliente como parte do reconhecimento. Os valores possíveis para `session_track_gtids` são os seguintes:

+ `OFF`: O servidor não retorna GTIDs ao cliente. Esse é o padrão.

+ `OWN_GTID`: O servidor retorna os GTIDs para todas as transações que foram comprometidas com sucesso por este cliente em sua sessão atual desde o último reconhecimento. Tipicamente, este é o único GTID para a última transação comprometida, mas se um único pedido do cliente resultou em várias transações, o servidor retorna um conjunto de GTIDs contendo todos os GTIDs relevantes.

+ `ALL_GTIDS`: O servidor retorna o valor global da sua variável de sistema `gtid_executed`, que ele lê em um ponto após a transação ser comprometida com sucesso. Além do GTID para a transação que foi comprometida, este conjunto de GTID inclui todas as transações comprometidas no servidor por qualquer cliente e pode incluir transações comprometidas após o ponto em que a transação atualmente reconhecida foi comprometida.

`session_track_gtids` não pode ser definido dentro de um contexto transacional.

Para mais informações sobre o rastreamento do estado de sessão, consulte a Seção 5.1.15, “Rastreamento do servidor do estado de sessão do cliente”.

* `session_track_schema`

  <table summary="Permitted values for the authentication_windows system variable."><col style="width: 10%"/><col style="width: 75%"/><thead><tr> <th>Value</th> <th>Descrição</th> </tr></thead><tbody><tr> <td>0</td> <td>Sem registro</td> </tr><tr> <td>1</td> <td>Registre apenas mensagens de erro</td> </tr><tr> <td>2</td> <td>Mensagens de nível 1 de log e mensagens de alerta</td> </tr><tr> <td>3</td> <td>Mensagens de nível 2 de log e notas de informação</td> </tr><tr> <td>4</td> <td>Mensagens de nível 3 de log e mensagens de depuração</td> </tr></tbody></table>89

Controla se o servidor registra quando o esquema padrão (banco de dados) é definido na sessão atual e notifica o cliente para disponibilizar o nome do esquema.

Se o rastreador de nome do esquema estiver habilitado, a notificação de nome ocorre toda vez que o esquema padrão é definido, mesmo que o novo nome do esquema seja o mesmo que o antigo.

Para mais informações sobre o rastreamento do estado de sessão, consulte a Seção 5.1.15, “Rastreamento do servidor do estado de sessão do cliente”.

* `session_track_state_change`

  <table summary="Permitted values for the authentication_windows system variable."><col style="width: 10%"/><col style="width: 75%"/><thead><tr> <th>Value</th> <th>Descrição</th> </tr></thead><tbody><tr> <td>0</td> <td>Sem registro</td> </tr><tr> <td>1</td> <td>Registre apenas mensagens de erro</td> </tr><tr> <td>2</td> <td>Mensagens de nível 1 de log e mensagens de alerta</td> </tr><tr> <td>3</td> <td>Mensagens de nível 2 de log e notas de informação</td> </tr><tr> <td>4</td> <td>Mensagens de nível 3 de log e mensagens de depuração</td> </tr></tbody></table>90

Controla se o servidor acompanha as alterações no estado da sessão atual e notifica o cliente quando ocorrem alterações no estado. As alterações podem ser relatadas para esses atributos do estado da sessão do cliente:

+ O esquema padrão (banco de dados).  
+ Valores específicos para sessão de variáveis do sistema.  
+ Variáveis definidas pelo usuário.  
+ Tabelas temporárias.  
+ Estruturas preparadas.

Se o rastreador de estado de sessão estiver habilitado, a notificação ocorre para cada alteração que envolva atributos de sessão rastreados, mesmo que os novos valores dos atributos sejam os mesmos que os antigos. Por exemplo, definir uma variável definida pelo usuário para seu valor atual resulta em uma notificação.

A variável `session_track_state_change` controla apenas a notificação de quando as alterações ocorrem, não o que as alterações são. Por exemplo, as notificações de mudança de estado ocorrem quando o esquema padrão é definido ou variáveis de sistema de sessão são atribuídas, mas a notificação não inclui o nome do esquema ou os valores das variáveis de sistema de sessão. Para receber notificação do nome do esquema ou dos valores das variáveis de sistema de sessão, use a variável de sistema `session_track_schema` ou `session_track_system_variables`, respectivamente.

Nota

Atribuir um valor para `session_track_state_change` em si não é considerado uma mudança de estado e não é relatado como tal. No entanto, se seu nome estiver listado no valor de `session_track_system_variables`, quaisquer atribuições a ele resultam em notificação do novo valor.

Para mais informações sobre o rastreamento do estado de sessão, consulte a Seção 5.1.15, “Rastreamento do servidor do estado de sessão do cliente”.

* `session_track_system_variables`

  <table summary="Permitted values for the authentication_windows system variable."><col style="width: 10%"/><col style="width: 75%"/><thead><tr> <th>Value</th> <th>Descrição</th> </tr></thead><tbody><tr> <td>0</td> <td>Sem registro</td> </tr><tr> <td>1</td> <td>Registre apenas mensagens de erro</td> </tr><tr> <td>2</td> <td>Mensagens de nível 1 de log e mensagens de alerta</td> </tr><tr> <td>3</td> <td>Mensagens de nível 2 de log e notas de informação</td> </tr><tr> <td>4</td> <td>Mensagens de nível 3 de log e mensagens de depuração</td> </tr></tbody></table>91

Controla se o servidor acompanha as atribuições às variáveis do sistema de sessão e notifica o cliente sobre o nome e o valor de cada variável atribuída. O valor da variável é uma lista de variáveis separadas por vírgula para as quais se deseja acompanhar as atribuições. Por padrão, a notificação está habilitada para `time_zone`, `autocommit`, `character_set_client`, `character_set_results` e `character_set_connection`. (Estes últimos três são os afetados por `SET NAMES`.)

O valor especial `*` faz com que o servidor acompanhe as atribuições a todas as variáveis de sessão. Se fornecido, esse valor deve ser especificado por si mesmo, sem nomes específicos de variáveis do sistema.

Para desabilitar a notificação das atribuições de variáveis de sessão, defina `session_track_system_variables` como uma string vazia.

Se a rastreamento de variáveis de sessão do sistema estiver habilitado, a notificação ocorre para todas as atribuições de variáveis de sessão rastreadas, mesmo que os novos valores sejam os mesmos que os antigos.

Para mais informações sobre o rastreamento do estado de sessão, consulte a Seção 5.1.15, “Rastreamento do servidor do estado de sessão do cliente”.

* `session_track_transaction_info`

  <table summary="Permitted values for the authentication_windows system variable."><col style="width: 10%"/><col style="width: 75%"/><thead><tr> <th>Value</th> <th>Descrição</th> </tr></thead><tbody><tr> <td>0</td> <td>Sem registro</td> </tr><tr> <td>1</td> <td>Registre apenas mensagens de erro</td> </tr><tr> <td>2</td> <td>Mensagens de nível 1 de log e mensagens de alerta</td> </tr><tr> <td>3</td> <td>Mensagens de nível 2 de log e notas de informação</td> </tr><tr> <td>4</td> <td>Mensagens de nível 3 de log e mensagens de depuração</td> </tr></tbody></table>92

Controla se o servidor acompanha o estado e as características das transações dentro da sessão atual e notifica o cliente para disponibilizar essas informações. Esses valores `session_track_transaction_info` são permitidos:

+ `OFF`: Desative o rastreamento do estado de transação. Este é o padrão.

+ `STATE`: Habilitar o rastreamento do estado da transação sem o rastreamento de características. O rastreamento de estado permite que o cliente determine se uma transação está em andamento e se ela pode ser movida para uma sessão diferente sem ser revertida.

+ `CHARACTERISTICS`: Habilitar o rastreamento do estado da transação, incluindo o rastreamento de características. O rastreamento de características permite que o cliente determine como reiniciar uma transação em outra sessão, de modo que ela tenha as mesmas características da sessão original. As seguintes características são relevantes para esse propósito:

    ```sql
    ISOLATION LEVEL
    READ ONLY
    READ WRITE
    WITH CONSISTENT SNAPSHOT
    ```

Para que um cliente possa realocar uma transação com segurança para outra sessão, ele deve acompanhar não apenas o estado da transação, mas também as características da transação. Além disso, o cliente deve acompanhar as variáveis de sistema `transaction_isolation` e `transaction_read_only` para determinar corretamente os padrões da sessão. (Para acompanhar essas variáveis, liste-as no valor da variável de sistema `session_track_system_variables`.)

Para mais informações sobre o rastreamento do estado de sessão, consulte a Seção 5.1.15, “Rastreamento do servidor do estado de sessão do cliente”.

* `sha256_password_auto_generate_rsa_keys`

  <table summary="Permitted values for the authentication_windows system variable."><col style="width: 10%"/><col style="width: 75%"/><thead><tr> <th>Value</th> <th>Descrição</th> </tr></thead><tbody><tr> <td>0</td> <td>Sem registro</td> </tr><tr> <td>1</td> <td>Registre apenas mensagens de erro</td> </tr><tr> <td>2</td> <td>Mensagens de nível 1 de log e mensagens de alerta</td> </tr><tr> <td>3</td> <td>Mensagens de nível 2 de log e notas de informação</td> </tr><tr> <td>4</td> <td>Mensagens de nível 3 de log e mensagens de depuração</td> </tr></tbody></table>93

Essa variável está disponível se o servidor foi compilado usando o OpenSSL (consulte a Seção 6.3.4, "Capacidades dependentes da biblioteca SSL"). Ela controla se o servidor gera automaticamente os arquivos de par de chave privada/pública RSA no diretório de dados, se eles ainda não existirem.

Ao iniciar, o servidor gera automaticamente arquivos de par de chave privada/pública RSA no diretório de dados se a variável de sistema `sha256_password_auto_generate_rsa_keys` estiver habilitada, não houver opções RSA especificadas e os arquivos RSA estiverem ausentes no diretório de dados. Esses arquivos permitem a troca segura de senhas usando RSA em conexões não criptografadas para contas autenticadas pelo plugin `sha256_password`; consulte Seção 6.4.1.5, “Autenticação Conectada SHA-256”.

Para obter mais informações sobre a autogeração de arquivos RSA, incluindo nomes e características dos arquivos, consulte a Seção 6.3.3.1, “Criando certificados e chaves SSL e RSA usando MySQL”.

A variável de sistema `auto_generate_certs` está relacionada, mas controla a autogeração de certificados SSL e arquivos de chave necessários para conexões seguras usando SSL.

* `sha256_password_private_key_path`

  <table summary="Permitted values for the authentication_windows system variable."><col style="width: 10%"/><col style="width: 75%"/><thead><tr> <th>Value</th> <th>Descrição</th> </tr></thead><tbody><tr> <td>0</td> <td>Sem registro</td> </tr><tr> <td>1</td> <td>Registre apenas mensagens de erro</td> </tr><tr> <td>2</td> <td>Mensagens de nível 1 de log e mensagens de alerta</td> </tr><tr> <td>3</td> <td>Mensagens de nível 2 de log e notas de informação</td> </tr><tr> <td>4</td> <td>Mensagens de nível 3 de log e mensagens de depuração</td> </tr></tbody></table>94

Essa variável está disponível se o MySQL foi compilado usando o OpenSSL (consulte a Seção 6.3.4, “Capacidades dependentes da biblioteca SSL”). Seu valor é o nome do caminho do arquivo da chave privada RSA para o plugin de autenticação `sha256_password`. Se o arquivo estiver nomeado como um caminho relativo, ele será interpretado em relação ao diretório de dados do servidor. O arquivo deve estar no formato PEM.

Importante

Como este arquivo armazena uma chave privada, seu modo de acesso deve ser restrito para que apenas o servidor MySQL possa lê-lo.

Para informações sobre `sha256_password`, consulte a Seção 6.4.1.5, “Autenticação Pluggable SHA-256”.

* `sha256_password_proxy_users`

  <table summary="Permitted values for the authentication_windows system variable."><col style="width: 10%"/><col style="width: 75%"/><thead><tr> <th>Value</th> <th>Descrição</th> </tr></thead><tbody><tr> <td>0</td> <td>Sem registro</td> </tr><tr> <td>1</td> <td>Registre apenas mensagens de erro</td> </tr><tr> <td>2</td> <td>Mensagens de nível 1 de log e mensagens de alerta</td> </tr><tr> <td>3</td> <td>Mensagens de nível 2 de log e notas de informação</td> </tr><tr> <td>4</td> <td>Mensagens de nível 3 de log e mensagens de depuração</td> </tr></tbody></table>95

Essa variável controla se o plugin de autenticação embutido `sha256_password` suporta usuários proxy. Não tem efeito a menos que a variável de sistema `check_proxy_users` esteja habilitada. Para informações sobre proxeamento de usuários, consulte a Seção 6.2.14, “Usuários proxy”.

* `sha256_password_public_key_path`

  <table summary="Permitted values for the authentication_windows system variable."><col style="width: 10%"/><col style="width: 75%"/><thead><tr> <th>Value</th> <th>Descrição</th> </tr></thead><tbody><tr> <td>0</td> <td>Sem registro</td> </tr><tr> <td>1</td> <td>Registre apenas mensagens de erro</td> </tr><tr> <td>2</td> <td>Mensagens de nível 1 de log e mensagens de alerta</td> </tr><tr> <td>3</td> <td>Mensagens de nível 2 de log e notas de informação</td> </tr><tr> <td>4</td> <td>Mensagens de nível 3 de log e mensagens de depuração</td> </tr></tbody></table>96

Essa variável está disponível se o MySQL foi compilado usando o OpenSSL (consulte a Seção 6.3.4, “Capacidades Dependentes da Biblioteca SSL”). Seu valor é o nome do caminho do arquivo da chave pública RSA para o plugin de autenticação `sha256_password`. Se o arquivo estiver nomeado como um caminho relativo, ele será interpretado em relação ao diretório de dados do servidor. O arquivo deve estar no formato PEM. Como esse arquivo armazena uma chave pública, as cópias podem ser distribuídas livremente aos usuários do cliente. (Os clientes que especificam explicitamente uma chave pública ao se conectar ao servidor usando criptografia de senha RSA devem usar a mesma chave pública usada pelo servidor.)

Para obter informações sobre `sha256_password`, incluindo informações sobre como os clientes especificam a chave pública RSA, consulte a Seção 6.4.1.5, “Autenticação Pluggable SHA-256”.

* `shared_memory`

  <table summary="Permitted values for the authentication_windows system variable."><col style="width: 10%"/><col style="width: 75%"/><thead><tr> <th>Value</th> <th>Descrição</th> </tr></thead><tbody><tr> <td>0</td> <td>Sem registro</td> </tr><tr> <td>1</td> <td>Registre apenas mensagens de erro</td> </tr><tr> <td>2</td> <td>Mensagens de nível 1 de log e mensagens de alerta</td> </tr><tr> <td>3</td> <td>Mensagens de nível 2 de log e notas de informação</td> </tr><tr> <td>4</td> <td>Mensagens de nível 3 de log e mensagens de depuração</td> </tr></tbody></table>97

(Apenas para Windows.) Se o servidor permite conexões de memória compartilhada.

* `shared_memory_base_name`

  <table summary="Permitted values for the authentication_windows system variable."><col style="width: 10%"/><col style="width: 75%"/><thead><tr> <th>Value</th> <th>Descrição</th> </tr></thead><tbody><tr> <td>0</td> <td>Sem registro</td> </tr><tr> <td>1</td> <td>Registre apenas mensagens de erro</td> </tr><tr> <td>2</td> <td>Mensagens de nível 1 de log e mensagens de alerta</td> </tr><tr> <td>3</td> <td>Mensagens de nível 2 de log e notas de informação</td> </tr><tr> <td>4</td> <td>Mensagens de nível 3 de log e mensagens de depuração</td> </tr></tbody></table>98

(Apenas para Windows.) O nome da memória compartilhada a ser usado para conexões de memória compartilhada. Isso é útil quando você está executando várias instâncias do MySQL em uma única máquina física. O nome padrão é `MYSQL`. O nome é sensível a maiúsculas e minúsculas.

Essa variável só se aplica se o servidor for iniciado com a variável de sistema `shared_memory` habilitada para suportar conexões de memória compartilhada.

* `show_compatibility_56`

  <table summary="Permitted values for the authentication_windows system variable."><col style="width: 10%"/><col style="width: 75%"/><thead><tr> <th>Value</th> <th>Descrição</th> </tr></thead><tbody><tr> <td>0</td> <td>Sem registro</td> </tr><tr> <td>1</td> <td>Registre apenas mensagens de erro</td> </tr><tr> <td>2</td> <td>Mensagens de nível 1 de log e mensagens de alerta</td> </tr><tr> <td>3</td> <td>Mensagens de nível 2 de log e notas de informação</td> </tr><tr> <td>4</td> <td>Mensagens de nível 3 de log e mensagens de depuração</td> </tr></tbody></table>99

O `INFORMATION_SCHEMA` possui tabelas que contêm informações sobre variáveis de sistema e status (consulte a Seção 24.3.11, “As tabelas GLOBAL_VARIABLES e SESSION_VARIABLES do INFORMATION_SCHEMA”, e a Seção 24.3.10, “As tabelas GLOBAL_STATUS e SESSION_STATUS do INFORMATION_SCHEMA”). A partir do MySQL 5.7.6, o Schema de Desempenho também contém tabelas de variáveis de sistema e status (consulte a Seção 25.12.13, “Tabelas de variáveis de sistema do Schema de Desempenho”, e a Seção 25.12.14, “Tabelas de variáveis de status do Schema de Desempenho”). As tabelas do Schema de Desempenho são destinadas a substituir as tabelas `INFORMATION_SCHEMA`, que são descontinuadas a partir do MySQL 5.7.6 e são removidas no MySQL 8.0.

Para obter conselhos sobre a migração das tabelas `INFORMATION_SCHEMA` para as tabelas do Schema de Desempenho, consulte a Seção 25.20, “Migração para as tabelas do Schema de Desempenho do Sistema e das Variáveis de Estado”. Para auxiliar na migração, você pode usar a variável de sistema `show_compatibility_56`, que afeta se a compatibilidade com o MySQL 5.6 é habilitada em relação à forma como as informações de variáveis de sistema e de estado são fornecidas pelas tabelas `INFORMATION_SCHEMA` e do Schema de Desempenho, além das declarações `SHOW VARIABLES` e `SHOW STATUS`.

Nota

`show_compatibility_56` é descontinuado, pois seu único propósito é permitir o controle sobre fontes de informações de variáveis de sistema e status obsoletas, que você pode esperar serem removidas em um lançamento futuro do MySQL. Quando essas fontes forem removidas, `show_compatibility_56` não terá mais nenhum propósito, e você pode esperar que ela também seja removida.

A discussão a seguir descreve os efeitos de `show_compatibility_56`:

+ Visão geral de show_compatibility_56 Efeitos
+ Efeito de show_compatibility_56 em DECLARAÇÕES SHOW
+ Efeito de show_compatibility_56 em Tabelas do SCHEMA_INFORMÁTICO
+ Efeito de show_compatibility_56 em Tabelas do SCHEMA de DESEMPENHO
+ Efeito de show_compatibility_56 em Variáveis de Status de Escravo
+ Efeito de show_compatibility_56 em FLUSH STATUS

Para uma melhor compreensão, é altamente recomendável que você também leia essas seções:

+ Seção 25.12.13, “Tabelas de variáveis de sistema do Schema de desempenho”  
+ Seção 25.12.14, “Tabelas de variáveis de status do Schema de desempenho”  
+ Seção 25.12.15.10, “Tabelas de resumo de variáveis de status”

#### Visão geral da compatibilidade com o show_56 Efeitos

A variável de sistema `show_compatibility_56` afeta esses aspectos da operação do servidor em relação às variáveis de sistema e status:

+ Informações disponíveis nas declarações `SHOW VARIABLES` e `SHOW STATUS`

+ Informações disponíveis nas tabelas `INFORMATION_SCHEMA` que fornecem informações sobre variáveis de sistema e status

+ Informações disponíveis nas tabelas do Schema de Desempenho que fornecem informações sobre variáveis de sistema e status

+ O efeito da declaração `FLUSH STATUS` nas variáveis de status

Esta lista resume os efeitos de `show_compatibility_56`, com detalhes adicionais fornecidos mais adiante:

+ Quando `show_compatibility_56` é `ON`, a compatibilidade com o MySQL 5.6 é habilitada. As fontes de informações de variáveis mais antigas (`SHOW` declarações, `INFORMATION_SCHEMA` tabelas) produzem o mesmo resultado que no MySQL 5.6.

+ Quando `show_compatibility_56` é `OFF`, a compatibilidade com o MySQL 5.6 é desativada. A seleção das tabelas de `INFORMATION_SCHEMA` produz um erro porque as tabelas do Schema de Desempenho são destinadas a substituí-las. As tabelas de `INFORMATION_SCHEMA` são desaconselhadas a partir do MySQL 5.7.6 e são removidas no MySQL 8.0.

Para obter informações sobre variáveis de sistema e status. Quando `show_compatibility_56=OFF`, use as tabelas do Schema de Desempenho ou as instruções `SHOW`.

Nota

Quando as declarações `show_compatibility_56=OFF`, `SHOW VARIABLES` e `SHOW STATUS` exibem strings das tabelas do Schema de Desempenho `global_variables`, `session_variables`, `global_status` e `session_status`.

A partir do MySQL 5.7.9, essas tabelas são legíveis e acessíveis mundialmente sem o privilégio `SELECT`, o que significa que `SELECT` também não é necessário para usar as declarações `SHOW`. Antes do MySQL 5.7.9, o privilégio `SELECT` é necessário para acessar essas tabelas do Gerador de Desempenho, seja diretamente ou indiretamente por meio das declarações `SHOW`.

+ Várias variáveis de status do `Slave_xxx` estão disponíveis a partir do `SHOW STATUS` quando o `show_compatibility_56` é `ON`. Quando o `show_compatibility_56` é `OFF`, algumas dessas variáveis não estão expostas ao `SHOW STATUS`. As informações que elas fornecem estão disponíveis em tabelas do Schema de Desempenho relacionadas à replicação, conforme descrito mais adiante.

+ `show_compatibility_56` não afeta o acesso a variáveis do sistema usando a notação `@@`: `@@GLOBAL.var_name`, `@@SESSION.var_name`, `@@var_name`.

+ `show_compatibility_56` não tem efeito no servidor embutido, que produz saída compatível com 5.6 em todos os casos.

As descrições a seguir detalham o efeito de definir `show_compatibility_56` para `ON` ou `OFF` nos contextos em que essa variável se aplica.

#### Efeito de show_compatibility_56 em declarações SHOW

`SHOW GLOBAL VARIABLES` declaração:

+ `ON`: Saída do MySQL 5.6.  
  + `OFF`: A saída exibe as strings da tabela do Gerador de Desempenho `global_variables`.

`SHOW [SESSION | LOCAL] VARIABLES` declaração:

+ `ON`: Saída do MySQL 5.6.  
  + `OFF`: A saída do esquema de desempenho da tabela `session_variables` exibe as strings. (Nos MySQL 5.7.6 e 5.7.7, a saída `OFF` não reflete totalmente todos os valores das variáveis do sistema em vigor para a sessão atual; não inclui strings para as variáveis globais que não têm correspondência em sessão. Isso é corrigido no MySQL 5.7.8.)

`SHOW GLOBAL STATUS` declaração:

+ `ON`: Saída do MySQL 5.6.  
  + `OFF`: A saída exibe as strings da tabela do Gerador de Desempenho `global_status` e os contadores de execução da instrução `Com_xxx`.

A saída `OFF` não inclui nenhuma string para variáveis de sessão que não têm correspondência global, ao contrário da saída `ON`.

`SHOW [SESSION | LOCAL] STATUS` declaração:

+ `ON`: Saída do MySQL 5.6.  
  + `OFF`: A saída exibe as strings da tabela do Gerador de Desempenho `session_status`, além dos contadores de execução da declaração `Com_xxx`. (No MySQL 5.7.6 e 5.7.7, a saída `OFF` não reflete totalmente todos os valores das variáveis de status em vigor para a sessão atual; não inclui strings para variáveis globais que não têm correspondência de sessão. Isso é corrigido no MySQL 5.7.8.)

Em MySQL 5.7.6 e 5.7.7, para cada uma das declarações `SHOW` descritas acima, o uso de uma cláusula `WHERE` produz um aviso quando `show_compatibility_56=ON` e um erro quando `show_compatibility_56=OFF`. (Isso se aplica a cláusulas `WHERE` que não são otimizadas. Por exemplo, `WHERE 1` é trivialmente verdadeiro, é otimizado e, portanto, não produz aviso ou erro.) Esse comportamento não ocorre a partir do MySQL 5.7.8; `WHERE` é suportado como antes do 5.7.6.

#### Efeito de show_compatibility_56 em Tabelas do INFORMATION_SCHEMA

Tabelas de `INFORMATION_SCHEMA` (`GLOBAL_VARIABLES`, `SESSION_VARIABLES`, `GLOBAL_STATUS` e `SESSION_STATUS`):

+ `ON`: Saída do MySQL 5.6, com um aviso de depreciação.

+ `OFF`: A seleção dessas tabelas produz um erro. (Antes da versão 5.7.9, a seleção dessas tabelas não produz saída, com um aviso de depreciação.)

#### Efeito do show_compatibility_56 nas tabelas do Schema de desempenho

Tabelas de variáveis do sistema do esquema de desempenho:

+ `OFF`:

- `global_variables`: Apenas variáveis de sistema global.

- `session_variables`: Variáveis do sistema em vigor para a sessão atual: uma string para cada variável de sessão e uma string para cada variável global que não tenha correspondência em sessão.

- `variables_by_thread`: Apenas variáveis do sistema de sessão, para cada sessão ativa.

+ `ON`: O mesmo resultado que para `OFF`. (Antes da versão 5.7.8, essas tabelas não produzem nenhum resultado.)

Tabelas de variáveis de status do Schema de desempenho:

+ `OFF`:

- `global_status`: Variáveis de status globais apenas.

- `session_status`: Variáveis de status em vigor na sessão atual: uma string para cada variável de sessão e uma string para cada variável global que não tenha correspondência em sessão.

- `status_by_account` Apenas variáveis de status de sessão, agregadas por conta.

- `status_by_host`: Variáveis de status de sessão apenas, agregadas por nome de host.

- `status_by_thread`: Variáveis de status de sessão apenas, para cada sessão ativa.

- `status_by_user`: Variáveis de status de sessão, agregadas por nome de usuário.

O Schema de Desempenho não coleta estatísticas para as variáveis de status `Com_xxx` nas tabelas de variáveis de status. Para obter contagens globais e por execução de declarações de sessão, use as tabelas `events_statements_summary_global_by_event_name` e `events_statements_summary_by_thread_by_event_name`, respectivamente.

+ `ON`: O mesmo resultado que para `OFF`. (Antes da versão 5.7.9, essas tabelas não produzem nenhum resultado.)

#### Efeito do show_compatibility_56 nas variáveis de status de escravo

Variáveis de status de réplica:

+ `ON`: Várias variáveis de status `Slave_xxx` estão disponíveis em `SHOW STATUS`.

+ `OFF`: Algumas dessas variáveis de replicação não são expostas às tabelas de status da `SHOW STATUS` ou das variáveis de status do Schema de Desempenho. As informações que elas fornecem estão disponíveis nas tabelas relacionadas à replicação do Schema de Desempenho. A tabela a seguir mostra quais as variáveis de status `Slave_xxx` se tornam indisponíveis na `SHOW STATUS` e seus locais nas tabelas de replicação do Schema de Desempenho.

    <table frame="box" rules="all" summary="Properties for authentication_windows_use_principal_name"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--authentication-windows-use-principal-name[={OFF|ON}]</code></td> </tr><tr><th>System Variable</th> <td><code>authentication_windows_use_principal_name</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>ON</code></td> </tr></tbody></table>00

#### Efeito do show_compatibility_56 no FLUSH STATUS

`FLUSH STATUS` declaração:

+ `ON`: Esta declaração produz o comportamento do MySQL 5.6. Ela adiciona os valores das variáveis de status de sessão do thread atual aos valores globais e redefre os valores de sessão para zero. Algumas variáveis globais também podem ser redefinidas para zero. Ela também redefre os contadores para caches de chave (padrão e nomeados) para zero e define `Max_used_connections` para o número atual de conexões abertas.

+ `OFF`: Esta declaração adiciona o status da sessão de todas as sessões ativas às variáveis de status globais, refaz o status de todas as sessões ativas e refaz os valores de status de conta, host e usuário agregados de sessões desconectadas.

* `show_create_table_verbosity`

  <table frame="box" rules="all" summary="Properties for authentication_windows_use_principal_name"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--authentication-windows-use-principal-name[={OFF|ON}]</code></td> </tr><tr><th>System Variable</th> <td><code>authentication_windows_use_principal_name</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>ON</code></td> </tr></tbody></table>01

`SHOW CREATE TABLE` normalmente não exibe a opção da tabela `ROW_FORMAT` se o formato da string for o formato padrão. Ativação desta variável faz com que `SHOW CREATE TABLE` exiba `ROW_FORMAT`, independentemente de ser o formato padrão.

* `show_old_temporals`

  <table frame="box" rules="all" summary="Properties for authentication_windows_use_principal_name"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--authentication-windows-use-principal-name[={OFF|ON}]</code></td> </tr><tr><th>System Variable</th> <td><code>authentication_windows_use_principal_name</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>ON</code></td> </tr></tbody></table>02

Se a saída do `SHOW CREATE TABLE` incluir comentários para marcar colunas temporais encontradas no formato pré-5.6.4 (colunas `TIME`, `DATETIME` e `TIMESTAMP` sem suporte para precisão de segundos fracionários). Essa variável é desativada por padrão. Se ativada, a saída do `SHOW CREATE TABLE` parece assim:

  ```sql
  CREATE TABLE `mytbl` (
    `ts` timestamp /* 5.5 binary format */ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `dt` datetime /* 5.5 binary format */ DEFAULT NULL,
    `t` time /* 5.5 binary format */ DEFAULT NULL
  ) DEFAULT CHARSET=latin1
  ```

A saída para a coluna `COLUMN_TYPE` do esquema de informações da tabela `COLUMNS` é afetada de maneira semelhante.

Essa variável é desatualizada; espere que ela seja removida em uma versão futura do MySQL.

* `skip_external_locking`

  <table frame="box" rules="all" summary="Properties for authentication_windows_use_principal_name"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--authentication-windows-use-principal-name[={OFF|ON}]</code></td> </tr><tr><th>System Variable</th> <td><code>authentication_windows_use_principal_name</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>ON</code></td> </tr></tbody></table>03

Este é `OFF` se `mysqld` usa bloqueio externo (bloqueio do sistema), `ON` se o bloqueio externo está desativado. Isso afeta apenas o acesso à tabela `MyISAM`.

Essa variável é definida pela opção `--external-locking` ou `--skip-external-locking`. O bloqueio externo é desativado por padrão.

O bloqueio externo afeta apenas o acesso à tabela `MyISAM`. Para mais informações, incluindo as condições em que ele pode e não pode ser usado, consulte a Seção 8.11.5, “Bloqueio Externo”.

* `skip_name_resolve`

  <table frame="box" rules="all" summary="Properties for authentication_windows_use_principal_name"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--authentication-windows-use-principal-name[={OFF|ON}]</code></td> </tr><tr><th>System Variable</th> <td><code>authentication_windows_use_principal_name</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>ON</code></td> </tr></tbody></table>04

Se resolver nomes de host ao verificar conexões de clientes. Se esta variável for `OFF`, `mysqld` resolve nomes de host ao verificar conexões de clientes. Se for `ON`, `mysqld` usa apenas números de IP; nesse caso, todos os valores da coluna `Host` nas tabelas de concessão devem ser endereços IP. Veja a Seção 5.1.11.2, “Consultas DNS e Cache de Host”.

Dependendo da configuração da rede do seu sistema e dos valores `Host` para as suas contas, os clientes podem precisar se conectar usando uma opção explícita `--host`, como `--host=127.0.0.1` ou `--host=::1`.

Uma tentativa de se conectar ao host `127.0.0.1` normalmente resolve para a conta `localhost`. No entanto, isso falha se o servidor for executado com `skip_name_resolve` habilitado. Se você planeja fazer isso, certifique-se de que existe uma conta que possa aceitar uma conexão. Por exemplo, para poder se conectar como `root` usando `--host=127.0.0.1` ou `--host=::1`, crie essas contas:

  ```sql
  CREATE USER 'root'@'127.0.0.1' IDENTIFIED BY 'root-password';
  CREATE USER 'root'@'::1' IDENTIFIED BY 'root-password';
  ```

* `skip_networking`

  <table frame="box" rules="all" summary="Properties for authentication_windows_use_principal_name"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--authentication-windows-use-principal-name[={OFF|ON}]</code></td> </tr><tr><th>System Variable</th> <td><code>authentication_windows_use_principal_name</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>ON</code></td> </tr></tbody></table>05

Essa variável controla se o servidor permite conexões TCP/IP. Por padrão, ela está desativada (permite conexões TCP). Se ativada, o servidor permite apenas conexões locais (não TCP/IP) e toda interação com `mysqld` deve ser feita usando pipes nomeados ou memória compartilhada (em Windows) ou arquivos de soquete Unix (em Unix). Esta opção é altamente recomendada para sistemas onde apenas clientes locais são permitidos. Veja a Seção 5.1.11.2, “Consultas DNS e Cache de Anfitrião”.

* `skip_show_database`

  <table frame="box" rules="all" summary="Properties for authentication_windows_use_principal_name"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--authentication-windows-use-principal-name[={OFF|ON}]</code></td> </tr><tr><th>System Variable</th> <td><code>authentication_windows_use_principal_name</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>ON</code></td> </tr></tbody></table>06

Isso impede que as pessoas usem a declaração `SHOW DATABASES` se não tiverem o privilégio `SHOW DATABASES`. Isso pode melhorar a segurança se você tiver preocupações sobre os usuários poderem ver bancos de dados pertencentes a outros usuários. Seu efeito depende do privilégio `SHOW DATABASES`: Se o valor da variável for `ON`, a declaração `SHOW DATABASES` é permitida apenas para usuários que têm o privilégio `SHOW DATABASES`, e a declaração exibe todos os nomes dos bancos de dados. Se o valor for `OFF`, `SHOW DATABASES` é permitido para todos os usuários, mas exibe os nomes apenas dos bancos de dados para os quais o usuário tem o privilégio `SHOW DATABASES` ou outro privilégio.

Cuidado

Porque um privilégio global é considerado um privilégio para todas as bases de dados, *qualquer* privilégio global permite que um usuário veja todos os nomes de banco de dados com `SHOW DATABASES` ou examinando a tabela `INFORMATION_SCHEMA` `SCHEMATA`.

* `slow_launch_time`

  <table frame="box" rules="all" summary="Properties for authentication_windows_use_principal_name"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--authentication-windows-use-principal-name[={OFF|ON}]</code></td> </tr><tr><th>System Variable</th> <td><code>authentication_windows_use_principal_name</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>ON</code></td> </tr></tbody></table>07

Se a criação de um fórum demorar mais do que esse número de segundos, o servidor incrementa a variável de status `Slow_launch_threads`.

* `slow_query_log`

  <table frame="box" rules="all" summary="Properties for authentication_windows_use_principal_name"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--authentication-windows-use-principal-name[={OFF|ON}]</code></td> </tr><tr><th>System Variable</th> <td><code>authentication_windows_use_principal_name</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>ON</code></td> </tr></tbody></table>08

Se o registro de consultas lentas está habilitado. O valor pode ser 0 (ou `OFF`) para desabilitar o registro ou 1 (ou `ON`) para habilitar o registro. O destino da saída do registro é controlado pela variável de sistema `log_output`; se esse valor for `NONE`, não são escritas entradas de registro, mesmo que o registro esteja habilitado.

“Lento” é determinado pelo valor da variável `long_query_time`. Veja a Seção 5.4.5, “O Log de consulta lenta”.

* `slow_query_log_file`

  <table frame="box" rules="all" summary="Properties for authentication_windows_use_principal_name"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--authentication-windows-use-principal-name[={OFF|ON}]</code></td> </tr><tr><th>System Variable</th> <td><code>authentication_windows_use_principal_name</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>ON</code></td> </tr></tbody></table>09

O nome do arquivo de registro de consultas lentas. O valor padrão é `host_name-slow.log`, mas o valor inicial pode ser alterado com a opção `--slow_query_log_file`.

* `socket`

  <table frame="box" rules="all" summary="Properties for authentication_windows_use_principal_name"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--authentication-windows-use-principal-name[={OFF|ON}]</code></td> </tr><tr><th>System Variable</th> <td><code>authentication_windows_use_principal_name</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>ON</code></td> </tr></tbody></table>10

Nas plataformas Unix, essa variável é o nome do arquivo de soquete que é usado para conexões de clientes locais. O padrão é `/tmp/mysql.sock`. (Para alguns formatos de distribuição, o diretório pode ser diferente, como `/var/lib/mysql` para RPMs.)

Em Windows, essa variável é o nome do pipe nomeado que é usado para conexões de clientes locais. O valor padrão é `MySQL` (não sensível ao caso).

* `sort_buffer_size`

  <table frame="box" rules="all" summary="Properties for authentication_windows_use_principal_name"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--authentication-windows-use-principal-name[={OFF|ON}]</code></td> </tr><tr><th>System Variable</th> <td><code>authentication_windows_use_principal_name</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>ON</code></td> </tr></tbody></table>11

Cada sessão que deve realizar uma ordenação aloca um buffer desse tamanho. `sort_buffer_size` não é específico para qualquer motor de armazenamento e se aplica de forma geral para otimização. No mínimo, o valor `sort_buffer_size` deve ser grande o suficiente para acomodar quinze tuplas no buffer de ordenação. Além disso, aumentar o valor de `max_sort_length` pode exigir o aumento do valor de `sort_buffer_size`. Para mais informações, consulte a Seção 8.2.1.14, “Otimização de ORDER BY”

Se você observar muitos `Sort_merge_passes` por segundo na saída do `SHOW GLOBAL STATUS`, pode considerar aumentar o valor do `sort_buffer_size` para acelerar as operações do `ORDER BY` ou `GROUP BY` que não podem ser melhoradas com otimização de consulta ou indexação aprimorada.

O otimizador tenta descobrir quanto espaço é necessário, mas pode alocar mais, até o limite. Definí-lo maior do que o necessário globalmente desacelera a maioria das consultas que fazem ordenação. É melhor aumentá-lo como um ajuste de sessão e apenas para as sessões que precisam de um tamanho maior. No Linux, existem limiares de 256 KB e 2 MB onde valores maiores podem desacelerar significativamente a alocação de memória, então você deve considerar ficar abaixo de um desses valores. Experimente para encontrar o melhor valor para sua carga de trabalho. Veja a Seção B.3.3.5, “Onde o MySQL armazena arquivos temporários”.

O ajuste máximo permitido para `sort_buffer_size` é 4GB−1. Valores maiores são permitidos para plataformas de 64 bits (exceto para o Windows de 64 bits, para o qual valores grandes são truncados para 4GB−1 com um aviso).

* `sql_auto_is_null`

  <table frame="box" rules="all" summary="Properties for authentication_windows_use_principal_name"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--authentication-windows-use-principal-name[={OFF|ON}]</code></td> </tr><tr><th>System Variable</th> <td><code>authentication_windows_use_principal_name</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>ON</code></td> </tr></tbody></table>12

Se essa variável estiver habilitada, após uma declaração que insere com sucesso um valor gerado automaticamente `AUTO_INCREMENT`, você pode encontrar esse valor emitindo uma declaração do seguinte formato:

  ```sql
  SELECT * FROM tbl_name WHERE auto_col IS NULL
  ```

Se a declaração retornar uma string, o valor retornado é o mesmo se você tivesse invocado a função `LAST_INSERT_ID()`. Para detalhes, incluindo o valor de retorno após uma inserção de várias strings, consulte a Seção 12.15, “Funções de Informação”. Se nenhuma string do valor `AUTO_INCREMENT` foi inserida com sucesso, a declaração `SELECT` não retorna nenhuma string.

O comportamento de recuperar um valor de `AUTO_INCREMENT` usando uma comparação de `IS NULL` é utilizado por alguns programas ODBC, como o Access. Veja Obtenção de Valores de Auto-Incremento. Esse comportamento pode ser desativado definindo `sql_auto_is_null` como `OFF`.

O valor padrão de `sql_auto_is_null` é `OFF`.

* `sql_big_selects`

  <table frame="box" rules="all" summary="Properties for authentication_windows_use_principal_name"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--authentication-windows-use-principal-name[={OFF|ON}]</code></td> </tr><tr><th>System Variable</th> <td><code>authentication_windows_use_principal_name</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>ON</code></td> </tr></tbody></table>13

Se configurado como `OFF`, o MySQL interrompe as instruções `SELECT` que provavelmente levarão muito tempo para serem executadas (ou seja, instruções para as quais o otimizador estima que o número de strings examinadas exceda o valor de `max_join_size`). Isso é útil quando uma instrução `WHERE` inadmissível foi emitida. O valor padrão para uma nova conexão é `ON`, que permite todas as instruções `SELECT`.

Se você definir a variável de sistema `max_join_size` para um valor diferente de `DEFAULT`, `sql_big_selects` é definido como `OFF`.

* `sql_buffer_result`

  <table frame="box" rules="all" summary="Properties for authentication_windows_use_principal_name"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--authentication-windows-use-principal-name[={OFF|ON}]</code></td> </tr><tr><th>System Variable</th> <td><code>authentication_windows_use_principal_name</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>ON</code></td> </tr></tbody></table>14

Se habilitado, `sql_buffer_result` obriga os resultados das declarações de `SELECT` a serem colocados em tabelas temporárias. Isso ajuda o MySQL a liberar os bloqueios da tabela precocemente e pode ser benéfico em casos em que leva um longo tempo enviar os resultados ao cliente. O valor padrão é `OFF`.

* `sql_log_off`

  <table frame="box" rules="all" summary="Properties for authentication_windows_use_principal_name"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--authentication-windows-use-principal-name[={OFF|ON}]</code></td> </tr><tr><th>System Variable</th> <td><code>authentication_windows_use_principal_name</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>ON</code></td> </tr></tbody></table>15

Essa variável controla se o registro no log de consulta geral é desativado para a sessão atual (assumindo que o próprio log de consulta geral é habilitado). O valor padrão é `OFF` (ou seja, habilitar o registro). Para desativar ou habilitar o registro de consultas gerais para a sessão atual, defina a variável de sessão `sql_log_off` para `ON` ou `OFF`.

Definir o valor da sessão desta variável do sistema é uma operação restrita. O usuário da sessão deve ter privilégios suficientes para definir variáveis de sessão restritas. Consulte a Seção 5.1.8.1, “Privilégios da Variável do Sistema”.

* `sql_mode`

  <table frame="box" rules="all" summary="Properties for authentication_windows_use_principal_name"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--authentication-windows-use-principal-name[={OFF|ON}]</code></td> </tr><tr><th>System Variable</th> <td><code>authentication_windows_use_principal_name</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>ON</code></td> </tr></tbody></table>16

O modo SQL do servidor atual, que pode ser definido dinamicamente. Para mais detalhes, consulte a Seção 5.1.10, “Modos SQL do servidor”.

Nota

Os programas de instalação do MySQL podem configurar o modo SQL durante o processo de instalação. Se o modo SQL for diferente do padrão ou do que você espera, verifique se há uma configuração em um arquivo de opção que o servidor lê no início.

* `sql_notes`

  <table frame="box" rules="all" summary="Properties for authentication_windows_use_principal_name"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--authentication-windows-use-principal-name[={OFF|ON}]</code></td> </tr><tr><th>System Variable</th> <td><code>authentication_windows_use_principal_name</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>ON</code></td> </tr></tbody></table>17

Se habilitada (padrão), os diagnósticos do nível `Note` incrementam `warning_count` e o servidor os registra. Se desabilitada, os diagnósticos de `Note` não incrementam `warning_count` e o servidor não os registra. O **mysqldump** inclui a saída para desabilitar essa variável, para que a recarga do arquivo de dump não produza avisos para eventos que não afetam a integridade da operação de recarga.

* `sql_quote_show_create`

  <table frame="box" rules="all" summary="Properties for authentication_windows_use_principal_name"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--authentication-windows-use-principal-name[={OFF|ON}]</code></td> </tr><tr><th>System Variable</th> <td><code>authentication_windows_use_principal_name</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>ON</code></td> </tr></tbody></table>18

Se habilitada (padrão), o servidor cita identificadores para as declarações `SHOW CREATE TABLE` e `SHOW CREATE DATABASE`. Se desabilitada, a citação é desativada. Esta opção é habilitada por padrão para que a replicação funcione para identificadores que requerem citação. Veja a Seção 13.7.5.10, “Declaração SHOW CREATE TABLE”, e a Seção 13.7.5.6, “Declaração SHOW CREATE DATABASE”.

* `sql_safe_updates`

  <table frame="box" rules="all" summary="Properties for authentication_windows_use_principal_name"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--authentication-windows-use-principal-name[={OFF|ON}]</code></td> </tr><tr><th>System Variable</th> <td><code>authentication_windows_use_principal_name</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>ON</code></td> </tr></tbody></table>19

Se essa variável estiver habilitada, as declarações `UPDATE` e `DELETE` que não utilizam uma chave na cláusula `WHERE` ou uma cláusula `LIMIT` produzem um erro. Isso permite detectar as declarações `UPDATE` e `DELETE` onde as chaves não são usadas corretamente e que provavelmente mudariam ou deleteiam um grande número de strings. O valor padrão é `OFF`.

Para o cliente **mysql**, `sql_safe_updates` pode ser habilitado usando a opção `--safe-updates`. Para mais informações, consulte "Usando o modo de atualizações seguras (--safe-updates)".

* `sql_select_limit`

  <table frame="box" rules="all" summary="Properties for authentication_windows_use_principal_name"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--authentication-windows-use-principal-name[={OFF|ON}]</code></td> </tr><tr><th>System Variable</th> <td><code>authentication_windows_use_principal_name</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>ON</code></td> </tr></tbody></table>20

O número máximo de strings a serem retornadas a partir das declarações `SELECT`. Para mais informações, consulte "Usando o modo de atualizações seguras (--safe-updates)".

O valor padrão para uma nova conexão é o número máximo de strings que o servidor permite por tabela. Os valores padrão típicos são (232)−1 ou (264)−1. Se você alterou o limite, o valor padrão pode ser restaurado atribuindo um valor de `DEFAULT`.

Se um `SELECT` tiver uma cláusula `LIMIT`, o `LIMIT` terá precedência sobre o valor de `sql_select_limit`.

* `sql_warnings`

  <table frame="box" rules="all" summary="Properties for authentication_windows_use_principal_name"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--authentication-windows-use-principal-name[={OFF|ON}]</code></td> </tr><tr><th>System Variable</th> <td><code>authentication_windows_use_principal_name</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>ON</code></td> </tr></tbody></table>21

Essa variável controla se as declarações de uma única string `INSERT` produzem uma string de informações se houver avisos. O padrão é `OFF`. Defina o valor para `ON` para produzir uma string de informações.

* `ssl_ca`

  <table frame="box" rules="all" summary="Properties for authentication_windows_use_principal_name"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--authentication-windows-use-principal-name[={OFF|ON}]</code></td> </tr><tr><th>System Variable</th> <td><code>authentication_windows_use_principal_name</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>ON</code></td> </tr></tbody></table>22

O nome do caminho do arquivo de certificado da Autoridade de Certificação (CA) no formato PEM. O arquivo contém uma lista de Autoridades de Certificação SSL confiáveis.

* `ssl_capath`

  <table frame="box" rules="all" summary="Properties for authentication_windows_use_principal_name"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--authentication-windows-use-principal-name[={OFF|ON}]</code></td> </tr><tr><th>System Variable</th> <td><code>authentication_windows_use_principal_name</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>ON</code></td> </tr></tbody></table>23

O nome do caminho do diretório que contém os arquivos de certificado da Autoridade de Certificação SSL (CA) confiável em formato PEM. Você deve executar o OpenSSL `rehash` no diretório especificado por esta opção antes de usá-lo. Em sistemas Linux, você pode invocar `rehash` da seguinte maneira:

  ```sql
  $> openssl rehash path/to/directory
  ```

Nas plataformas Windows, você pode usar o script `c_rehash` em um prompt de comando, da seguinte forma:

  ```sql
  \> c_rehash path/to/directory
  ```

Veja [openssl-rehash][(https://docs.openssl.org/3.1/man1/openssl-rehash/)] para obter a sintaxe completa e outras informações.

O suporte para essa capacidade depende da biblioteca SSL usada para compilar o MySQL; consulte a Seção 6.3.4, “Capacidades dependentes da biblioteca SSL”.

* `ssl_cert`

  <table frame="box" rules="all" summary="Properties for authentication_windows_use_principal_name"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--authentication-windows-use-principal-name[={OFF|ON}]</code></td> </tr><tr><th>System Variable</th> <td><code>authentication_windows_use_principal_name</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>ON</code></td> </tr></tbody></table>24

O nome do caminho do arquivo de certificado público da chave SSL do servidor no formato PEM.

Se o servidor for iniciado com `ssl_cert` definido para um certificado que utiliza qualquer cifra ou categoria de cifra restrita, o servidor inicia com suporte para conexões criptografadas desativado. Para informações sobre restrições de cifra, consulte Configuração de cifra de conexão.

* `ssl_cipher`

  <table frame="box" rules="all" summary="Properties for authentication_windows_use_principal_name"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--authentication-windows-use-principal-name[={OFF|ON}]</code></td> </tr><tr><th>System Variable</th> <td><code>authentication_windows_use_principal_name</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>ON</code></td> </tr></tbody></table>25

A lista de cifra permitida para criptografia de conexão. Se nenhuma cifra na lista for suportada, as conexões criptografadas não funcionarão.

Para maior portabilidade, a lista de cifra deve ser uma lista de um ou mais nomes de cifra, separados por colchetes. Esse formato é compreendido tanto pelo OpenSSL quanto pelo yaSSL. O exemplo a seguir mostra dois nomes de cifra separados por um colon:

  ```sql
  [mysqld]
  ssl_cipher="DHE-RSA-AES128-GCM-SHA256:AES128-SHA"
  ```

O OpenSSL suporta uma sintaxe mais flexível para especificar cifras, conforme descrito na documentação do OpenSSL em <https://www.openssl.org/docs/manmaster/man1/openssl-ciphers.html>. O yaSSL não suporta essa sintaxe estendida, portanto, as tentativas de usar essa sintaxe estendida falham para uma distribuição do MySQL compilada usando o yaSSL.

Para obter informações sobre os cifradores de criptografia que o MySQL suporta, consulte a Seção 6.3.2, “Protocolos e cifradores de conexão criptografada TLS”.

* `ssl_crl`

  <table frame="box" rules="all" summary="Properties for authentication_windows_use_principal_name"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--authentication-windows-use-principal-name[={OFF|ON}]</code></td> </tr><tr><th>System Variable</th> <td><code>authentication_windows_use_principal_name</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>ON</code></td> </tr></tbody></table>26

O nome do caminho do arquivo que contém listas de revogação de certificados no formato PEM. O suporte para a capacidade de lista de revogação depende da biblioteca SSL usada para compilar o MySQL. Veja a Seção 6.3.4, “Capacidades Dependentes da Biblioteca SSL”.

* `ssl_crlpath`

  <table frame="box" rules="all" summary="Properties for authentication_windows_use_principal_name"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--authentication-windows-use-principal-name[={OFF|ON}]</code></td> </tr><tr><th>System Variable</th> <td><code>authentication_windows_use_principal_name</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>ON</code></td> </tr></tbody></table>27

O caminho do diretório que contém arquivos de lista de revogação de certificados em formato PEM. O suporte para a capacidade de lista de revogação depende da biblioteca SSL usada para compilar o MySQL. Veja a Seção 6.3.4, “Capacidades Dependentes da Biblioteca SSL”.

* `ssl_key`

  <table frame="box" rules="all" summary="Properties for authentication_windows_use_principal_name"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--authentication-windows-use-principal-name[={OFF|ON}]</code></td> </tr><tr><th>System Variable</th> <td><code>authentication_windows_use_principal_name</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>ON</code></td> </tr></tbody></table>28

O nome do caminho do arquivo de chave privada SSL do servidor no formato PEM. Para maior segurança, use um certificado com um tamanho de chave RSA de pelo menos 2048 bits.

Se o arquivo de chave estiver protegido por uma senha, o servidor solicita ao usuário a senha. A senha deve ser fornecida interativamente; não pode ser armazenada em um arquivo. Se a senha estiver incorreta, o programa continua como se não pudesse ler a chave.

* `stored_program_cache`

  <table frame="box" rules="all" summary="Properties for authentication_windows_use_principal_name"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--authentication-windows-use-principal-name[={OFF|ON}]</code></td> </tr><tr><th>System Variable</th> <td><code>authentication_windows_use_principal_name</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>ON</code></td> </tr></tbody></table>29

Define um limite superior suave para o número de rotinas armazenadas em cache por conexão. O valor desta variável é especificado em termos do número de rotinas armazenadas mantidas em cada um dos dois caches mantidos pelo MySQL Server, respectivamente, para procedimentos armazenados e funções armazenadas.

Sempre que uma rotina armazenada é executada, esse tamanho de cache é verificado antes da primeira ou da declaração de nível superior na rotina ser analisada; se o número de rotinas do mesmo tipo (procedimentos armazenados ou funções armazenadas, conforme o que está sendo executado) exceder o limite especificado por essa variável, o cache correspondente é esvaziado e a memória previamente alocada para objetos armazenados é liberada. Isso permite que o cache seja esvaziado com segurança, mesmo quando há dependências entre rotinas armazenadas.

* `super_read_only`

  <table frame="box" rules="all" summary="Properties for authentication_windows_use_principal_name"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--authentication-windows-use-principal-name[={OFF|ON}]</code></td> </tr><tr><th>System Variable</th> <td><code>authentication_windows_use_principal_name</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>ON</code></td> </tr></tbody></table>30

Se a variável de sistema `read_only` estiver habilitada, o servidor não permite atualizações de clientes, exceto para usuários que possuem o privilégio `SUPER`. Se a variável de sistema `super_read_only` também estiver habilitada, o servidor proíbe atualizações de clientes, mesmo para usuários que possuem `SUPER`. Consulte a descrição da variável de sistema `read_only` para uma descrição do modo somente leitura e informações sobre como `read_only` e `super_read_only` interagem.

As atualizações do cliente prevenidas quando o `super_read_only` está habilitado incluem operações que não necessariamente parecem ser atualizações, como `CREATE FUNCTION` (para instalar uma função carregável) e `INSTALL PLUGIN`. Essas operações são proibidas porque envolvem alterações em tabelas no banco de dados do sistema `mysql`.

As alterações em `super_read_only` em um servidor de fonte de replicação não são replicadas para os servidores replicados. O valor pode ser definido em uma replica independente da configuração na fonte.

* `sync_frm`

  <table frame="box" rules="all" summary="Properties for authentication_windows_use_principal_name"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--authentication-windows-use-principal-name[={OFF|ON}]</code></td> </tr><tr><th>System Variable</th> <td><code>authentication_windows_use_principal_name</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>ON</code></td> </tr></tbody></table>31

Se essa variável estiver definida como 1, quando qualquer tabela não temporária for criada, seu arquivo `.frm` será sincronizado com o disco (usando `fdatasync()`). Isso é mais lento, mas mais seguro em caso de falha. O padrão é 1.

Essa variável é desatualizada no MySQL 5.7 e é removida no MySQL 8.0 (quando os arquivos `.frm` se tornam obsoletos).

* `system_time_zone`

  <table frame="box" rules="all" summary="Properties for authentication_windows_use_principal_name"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--authentication-windows-use-principal-name[={OFF|ON}]</code></td> </tr><tr><th>System Variable</th> <td><code>authentication_windows_use_principal_name</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>ON</code></td> </tr></tbody></table>32

O fuso horário do sistema do servidor. Quando o servidor começa a ser executado, ele herda um ajuste do fuso horário das configurações padrão da máquina, possivelmente modificado pelo ambiente da conta usada para executar o servidor ou pelo script de inicialização. O valor é usado para definir `system_time_zone`. Para especificar explicitamente o fuso horário do sistema, defina a variável de ambiente `TZ` ou use a opção `--timezone` do script `mysqld_safe`.

A variável `system_time_zone` difere da variável `time_zone`. Embora possam ter o mesmo valor, a última variável é usada para inicializar o fuso horário para cada cliente que se conecta. Veja a Seção 5.1.13, “Suporte ao Fuso Horário do MySQL Server”.

* `table_definition_cache`

  <table frame="box" rules="all" summary="Properties for authentication_windows_use_principal_name"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--authentication-windows-use-principal-name[={OFF|ON}]</code></td> </tr><tr><th>System Variable</th> <td><code>authentication_windows_use_principal_name</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>ON</code></td> </tr></tbody></table>33

O número de definições de tabela (dos arquivos `.frm`) que podem ser armazenados na cache de definição de tabela. Se você usar um grande número de tabelas, pode criar uma cache de definição de tabela grande para acelerar a abertura das tabelas. A cache de definição de tabela ocupa menos espaço e não usa descritores de arquivo, ao contrário da cache de tabela normal. O valor mínimo é 400. O valor padrão é baseado na seguinte fórmula, limitada a um limite de 2000:

  ```sql
  400 + (table_open_cache / 2)
  ```

Para `InnoDB`, o ajuste `table_definition_cache` atua como um limite suave para o número de instâncias de tabela no cache do dicionário de dados `InnoDB` e o número de espaços de tabela por arquivo que podem ser abertos ao mesmo tempo.

Se o número de instâncias de tabela no cache do dicionário de dados `InnoDB` exceder o limite de `table_definition_cache`, um mecanismo LRU começa a marcar as instâncias de tabela para expulsão e, eventualmente, as remove do cache do dicionário de dados InnoDB. O número de tabelas abertas com metadados em cache pode ser maior que o limite de `table_definition_cache` devido às instâncias de tabela com relações de chave estrangeira, que não são colocadas na lista LRU.

O número de espaços de tabela por arquivo que podem ser abertos ao mesmo tempo é limitado tanto pelas configurações `table_definition_cache` quanto `innodb_open_files`. Se ambas as variáveis forem definidas, a configuração mais alta é usada. Se nenhuma das variáveis for definida, a configuração `table_definition_cache`, que tem um valor padrão mais alto, é usada. Se o número de espaços de tabela abertos exceder o limite definido por `table_definition_cache` ou `innodb_open_files`, um mecanismo LRU (Lista de Última Utilização) busca os arquivos de espaço de tabela que estão completamente esvaziados e que atualmente não estão sendo estendidos. Esse processo é realizado a cada vez que um novo espaço de tabela é aberto. Apenas espaços de tabela inativos são fechados.

* `table_open_cache`

  <table frame="box" rules="all" summary="Properties for authentication_windows_use_principal_name"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--authentication-windows-use-principal-name[={OFF|ON}]</code></td> </tr><tr><th>System Variable</th> <td><code>authentication_windows_use_principal_name</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>ON</code></td> </tr></tbody></table>34

O número de mesas abertas para todos os threads. Aumentar esse valor aumenta o número de descritores de arquivo que o `mysqld` requer. O valor efetivo dessa variável é o maior entre o valor efetivo do `open_files_limit` `- 10 -` o valor efetivo do `max_connections` `/ 2`, e 400; ou seja,

  ```sql
  MAX(
      (open_files_limit - 10 - max_connections) / 2,
      400
     )
  ```

Você pode verificar se precisa aumentar o cache da tabela verificando a variável de status `Opened_tables`. Se o valor de `Opened_tables` for grande e você não usar `FLUSH TABLES` com frequência (o que apenas força todas as tabelas a serem fechadas e reabertas), então você deve aumentar o valor da variável `table_open_cache`. Para mais informações sobre o cache da tabela, consulte a Seção 8.4.3.1, “Como o MySQL abre e fecha tabelas”.

* `table_open_cache_instances`

  <table frame="box" rules="all" summary="Properties for authentication_windows_use_principal_name"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--authentication-windows-use-principal-name[={OFF|ON}]</code></td> </tr><tr><th>System Variable</th> <td><code>authentication_windows_use_principal_name</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>ON</code></td> </tr></tbody></table>35

O número de instâncias de cache de tabelas abertas. Para melhorar a escalabilidade, reduzindo a concorrência entre sessões, o cache de tabelas abertas pode ser dividido em várias instâncias menores de tamanho `table_open_cache` / `table_open_cache_instances`. Uma sessão precisa bloquear apenas uma instância para acessá-la para declarações DML. Isso segmenta o acesso ao cache entre as instâncias, permitindo um desempenho mais alto para operações que usam o cache quando há muitas sessões acessando tabelas. (As declarações DDL ainda requerem um bloqueio em todo o cache, mas tais declarações são muito menos frequentes do que as declarações DML.)

Um valor de 8 ou 16 é recomendado em sistemas que usam rotineiramente 16 ou mais núcleos. No entanto, se você tem muitos gatilhos grandes em suas tabelas que causam um alto carregamento de memória, o ajuste padrão para `table_open_cache_instances` pode levar ao uso excessivo de memória. Nessa situação, pode ser útil definir `table_open_cache_instances` para 1 para restringir o uso de memória.

* `thread_cache_size`

  <table frame="box" rules="all" summary="Properties for authentication_windows_use_principal_name"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--authentication-windows-use-principal-name[={OFF|ON}]</code></td> </tr><tr><th>System Variable</th> <td><code>authentication_windows_use_principal_name</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>ON</code></td> </tr></tbody></table>36

Quantas strings de execução o servidor deve armazenar para reutilização. Quando um cliente se desconecta, as strings de execução do cliente são colocadas no cache se houver menos de `thread_cache_size` strings de execução. As solicitações de strings de execução são atendidas reutilizando strings de execução retiradas do cache, se possível, e apenas quando o cache estiver vazio, uma nova string de execução é criada. Essa variável pode ser aumentada para melhorar o desempenho se você tiver muitas novas conexões. Normalmente, isso não proporciona uma melhoria notável no desempenho se você tiver uma boa implementação de strings de execução. No entanto, se seu servidor receber centenas de conexões por segundo, você deve normalmente definir `thread_cache_size` alta o suficiente para que a maioria das novas conexões use strings de execução armazenadas no cache. Ao examinar a diferença entre as variáveis de status `Connections` e `Threads_created`, você pode ver quão eficiente é o cache de strings de execução. Para detalhes, consulte a Seção 5.1.9, “Variáveis de Status do Servidor”.

O valor padrão é baseado na seguinte fórmula, limitada a um limite de 100:

  ```sql
  8 + (max_connections / 100)
  ```

Essa variável não tem efeito para o servidor incorporado (`libmysqld`) e, a partir do MySQL 5.7.2, ela não é mais visível no servidor incorporado.

* `thread_handling`

  <table frame="box" rules="all" summary="Properties for authentication_windows_use_principal_name"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--authentication-windows-use-principal-name[={OFF|ON}]</code></td> </tr><tr><th>System Variable</th> <td><code>authentication_windows_use_principal_name</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>ON</code></td> </tr></tbody></table>37

O modelo de manipulação de threads usado pelo servidor para os threads de conexão. Os valores permitidos são `no-threads` (o servidor usa um único thread para manipular uma conexão), `one-thread-per-connection` (o servidor usa um thread para manipular cada conexão de cliente) e `loaded-dynamically` (definido pelo plugin de pool de threads quando ele é inicializado). `no-threads` é útil para depuração sob Linux; veja Seção 5.8, “Depuração do MySQL”.

Essa variável não tem efeito para o servidor incorporado (`libmysqld`) e, a partir do MySQL 5.7.2, ela não é mais visível dentro do servidor incorporado.

* `thread_pool_algorithm`

  <table frame="box" rules="all" summary="Properties for authentication_windows_use_principal_name"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--authentication-windows-use-principal-name[={OFF|ON}]</code></td> </tr><tr><th>System Variable</th> <td><code>authentication_windows_use_principal_name</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>ON</code></td> </tr></tbody></table>38

Esta variável controla qual algoritmo o plugin de pool de threads utiliza:

+ Um valor de 0 (padrão) utiliza um algoritmo conservador de baixa concorrência, que é o mais bem testado e que é conhecido por produzir resultados muito bons.

+ Um valor de 1 aumenta a concorrência e utiliza um algoritmo mais agressivo, que, às vezes, tem sido conhecido por apresentar um desempenho 5–10% melhor em contagem ótima de threads, mas que apresenta um desempenho degradante à medida que o número de conexões aumenta. Seu uso deve ser considerado experimental e não é suportado.

Essa variável está disponível apenas se o plugin de pool de threads estiver habilitado. Veja a Seção 5.5.3, “MySQL Enterprise Thread Pool”.

* `thread_pool_high_priority_connection`

  <table frame="box" rules="all" summary="Properties for authentication_windows_use_principal_name"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--authentication-windows-use-principal-name[={OFF|ON}]</code></td> </tr><tr><th>System Variable</th> <td><code>authentication_windows_use_principal_name</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>ON</code></td> </tr></tbody></table>39

Essa variável afeta a fila de espera de novas declarações antes da execução. Se o valor for 0 (falso, padrão), a fila de espera de declarações usa as filas de baixa prioridade e alta prioridade. Se o valor for 1 (verdadeiro), as declarações em fila sempre vão para a fila de alta prioridade.

Essa variável está disponível apenas se o plugin de pool de threads estiver habilitado. Veja a Seção 5.5.3, “MySQL Enterprise Thread Pool”.

* `thread_pool_max_unused_threads`

  <table frame="box" rules="all" summary="Properties for authentication_windows_use_principal_name"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--authentication-windows-use-principal-name[={OFF|ON}]</code></td> </tr><tr><th>System Variable</th> <td><code>authentication_windows_use_principal_name</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>ON</code></td> </tr></tbody></table>40

O número máximo permitido de threads não utilizadas na pilha de threads. Essa variável permite limitar a quantidade de memória usada por threads em espera.

Um valor de 0 (padrão) significa que não há limite no número de threads em espera. Um valor de *`N`* onde *`N`* é maior que 0 significa 1 thread de consumo e *`N`−1 threads de reserva. Neste caso, se uma thread estiver pronta para dormir, mas o número de threads em espera já estiver no máximo, a thread sai em vez de dormir.

Um thread de sono está dormindo como um thread de consumidor ou um thread de reserva. O conjunto de threads permite que um thread esteja como thread de consumidor quando está dormindo. Se um thread for colocado em sono e não houver um thread de consumidor existente, ele dorme como um thread de consumidor. Quando um thread precisa ser acordado, um thread de consumidor é selecionado, se houver um. Um thread de reserva é selecionado apenas quando não há um thread de consumidor para ser acordado.

Essa variável está disponível apenas se o plugin de pool de threads estiver habilitado. Veja a Seção 5.5.3, “MySQL Enterprise Thread Pool”.

* `thread_pool_prio_kickup_timer`

  <table frame="box" rules="all" summary="Properties for authentication_windows_use_principal_name"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--authentication-windows-use-principal-name[={OFF|ON}]</code></td> </tr><tr><th>System Variable</th> <td><code>authentication_windows_use_principal_name</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>ON</code></td> </tr></tbody></table>41

Essa variável afeta as declarações que estão esperando execução na fila de baixa prioridade. O valor é o número de milissegundos antes que uma declaração em espera seja movida para a fila de alta prioridade. O padrão é 1000 (1 segundo).

Essa variável está disponível apenas se o plugin de pool de threads estiver habilitado. Veja a Seção 5.5.3, “MySQL Enterprise Thread Pool”.

* `thread_pool_size`

  <table frame="box" rules="all" summary="Properties for authentication_windows_use_principal_name"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--authentication-windows-use-principal-name[={OFF|ON}]</code></td> </tr><tr><th>System Variable</th> <td><code>authentication_windows_use_principal_name</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>ON</code></td> </tr></tbody></table>42

O número de grupos de threads no pool de threads. Este é o parâmetro mais importante que controla o desempenho do pool de threads. Isso afeta quantas instruções podem ser executadas simultaneamente. Se um valor fora do intervalo de valores permitidos for especificado, o plugin do pool de threads não é carregado e o servidor escreve uma mensagem no log de erro.

Essa variável está disponível apenas se o plugin de pool de threads estiver habilitado. Veja a Seção 5.5.3, “MySQL Enterprise Thread Pool”.

* `thread_pool_stall_limit`

  <table frame="box" rules="all" summary="Properties for authentication_windows_use_principal_name"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--authentication-windows-use-principal-name[={OFF|ON}]</code></td> </tr><tr><th>System Variable</th> <td><code>authentication_windows_use_principal_name</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>ON</code></td> </tr></tbody></table>43

Essa variável afeta as declarações de execução. O valor é o tempo que uma declaração leva para terminar após começar a ser executada antes de ser definida como travada, momento em que o grupo de threads permite que o grupo de threads comece a executar outra declaração. O valor é medido em unidades de 10 milissegundos, então o valor padrão de 6 significa 60 ms. Valores de espera curtos permitem que os threads comecem mais rapidamente. Valores curtos também são melhores para evitar situações de deadlock. Valores de espera longos são úteis para cargas de trabalho que incluem declarações de longa duração, para evitar começar muitas novas declarações enquanto as atuais são executadas.

Essa variável está disponível apenas se o plugin de pool de threads estiver habilitado. Veja a Seção 5.5.3, “MySQL Enterprise Thread Pool”.

* `thread_stack`

  <table frame="box" rules="all" summary="Properties for authentication_windows_use_principal_name"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--authentication-windows-use-principal-name[={OFF|ON}]</code></td> </tr><tr><th>System Variable</th> <td><code>authentication_windows_use_principal_name</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>ON</code></td> </tr></tbody></table>44

O tamanho da pilha para cada thread. O padrão é grande o suficiente para o funcionamento normal. Se o tamanho da pilha de thread for muito pequeno, isso limita a complexidade das instruções SQL que o servidor pode manipular, a profundidade de recursividade de procedimentos armazenados e outras ações que consomem memória.

* `time_format`

Essa variável não é usada. Ela é desatualizada e será removida no MySQL 8.0.

* `time_zone`

  <table frame="box" rules="all" summary="Properties for authentication_windows_use_principal_name"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--authentication-windows-use-principal-name[={OFF|ON}]</code></td> </tr><tr><th>System Variable</th> <td><code>authentication_windows_use_principal_name</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>ON</code></td> </tr></tbody></table>45

O fuso horário atual. Esta variável é usada para inicializar o fuso horário para cada cliente que se conecta. Por padrão, o valor inicial desta é `'SYSTEM'` (o que significa, “use o valor de `system_time_zone`”). O valor pode ser especificado explicitamente na inicialização do servidor com a opção `--default-time-zone`. Veja a Seção 5.1.13, “Suporte ao Fuso Horário do MySQL Server”.

Nota

Se configurado como `SYSTEM`, cada chamada de função MySQL que requer um cálculo de fuso horário faz uma chamada de biblioteca do sistema para determinar o fuso horário do sistema atual. Essa chamada pode ser protegida por um mutex global, resultando em concorrência.

* `timestamp`

  <table frame="box" rules="all" summary="Properties for authentication_windows_use_principal_name"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--authentication-windows-use-principal-name[={OFF|ON}]</code></td> </tr><tr><th>System Variable</th> <td><code>authentication_windows_use_principal_name</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>ON</code></td> </tr></tbody></table>46

Defina o horário para este cliente. Isso é usado para obter o timestamp original se você usar o log binário para restaurar strings. *`timestamp_value`* deve ser um timestamp de época Unix (um valor como o retornado por `UNIX_TIMESTAMP()`, não um valor no formato `'YYYY-MM-DD hh:mm:ss'` ou `DEFAULT`).

Definir `timestamp` com um valor constante faz com que ele retorne esse valor até que seja alterado novamente. Definir `timestamp` com `DEFAULT` faz com que seu valor seja a data e a hora atuais na data em que é acessado. O valor máximo corresponde a `'2038-01-19 03:14:07'` UTC, o mesmo que para o tipo de dados `TIMESTAMP`.

`timestamp` é um `DOUBLE` e não um `BIGINT`, porque seu valor inclui uma parte em microsegundos.

`SET timestamp` afeta o valor retornado por `NOW()`, mas não por `SYSDATE()`. Isso significa que as configurações de marcação de tempo no log binário não têm efeito nas invocações de `SYSDATE()`. O servidor pode ser iniciado com a opção `--sysdate-is-now` para fazer com que `SYSDATE()` seja sinônimo de `NOW()`, caso em que `SET timestamp` afeta ambas as funções.

* `tls_version`

  <table frame="box" rules="all" summary="Properties for authentication_windows_use_principal_name"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--authentication-windows-use-principal-name[={OFF|ON}]</code></td> </tr><tr><th>System Variable</th> <td><code>authentication_windows_use_principal_name</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>ON</code></td> </tr></tbody></table>47

Quais protocolos o servidor permite para conexões criptografadas. O valor é uma lista separada por vírgula contendo uma ou mais versões de protocolo. Os protocolos que podem ser nomeados para esta variável dependem da biblioteca SSL usada para compilar o MySQL. Os protocolos permitidos devem ser escolhidos para não deixar "buracos" na lista. Para detalhes, consulte a Seção 6.3.2, "Protocolos e cifra de conexão criptografada TLS".

Nota

A partir do MySQL 5.7.35, os protocolos de conexão TLSv1 e TLSv1.1 são desatualizados e o suporte para eles está sujeito à remoção em uma versão futura do MySQL. Veja Protocolos TLS Desatualizados.

Definir essa variável como uma string vazia desativa as conexões criptografadas.

* `tmp_table_size`

  <table frame="box" rules="all" summary="Properties for authentication_windows_use_principal_name"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--authentication-windows-use-principal-name[={OFF|ON}]</code></td> </tr><tr><th>System Variable</th> <td><code>authentication_windows_use_principal_name</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>ON</code></td> </tr></tbody></table>48

O tamanho máximo de tabelas temporárias internas de memória. Esta variável não se aplica a tabelas `MEMORY` criadas pelo usuário.

O limite real é o menor dos valores de `tmp_table_size` e `max_heap_table_size`. Quando uma tabela temporária de memória excede o limite, o MySQL a converte automaticamente em uma tabela temporária em disco. A opção `internal_tmp_disk_storage_engine` define o mecanismo de armazenamento utilizado para tabelas temporárias em disco.

Aumente o valor de `tmp_table_size` (e `max_heap_table_size`, se necessário) se você fizer muitas consultas avançadas de `GROUP BY` e tiver muita memória.

Você pode comparar o número de tabelas temporárias internas criadas em disco com o número total de tabelas temporárias internas criadas, comparando os valores de `Created_tmp_disk_tables` e `Created_tmp_tables`.

Veja também a Seção 8.4.4, “Uso de Tabela Temporária Interna no MySQL”.

* `tmpdir`

  <table frame="box" rules="all" summary="Properties for authentication_windows_use_principal_name"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--authentication-windows-use-principal-name[={OFF|ON}]</code></td> </tr><tr><th>System Variable</th> <td><code>authentication_windows_use_principal_name</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>ON</code></td> </tr></tbody></table>49

O caminho do diretório a ser usado para criar arquivos temporários. Isso pode ser útil se o diretório padrão `/tmp` estiver em uma partição que é pequena o suficiente para conter tabelas temporárias. Essa variável pode ser definida como uma lista de vários caminhos que são usados de forma rotativa. Os caminhos devem ser separados por caracteres de colon (`:`) em Unix e caracteres de ponto e vírgula (`;`) em Windows.

`tmpdir` pode ser um local não permanente, como um diretório em um sistema de arquivos baseado em memória ou um diretório que é limpo quando o host do servidor é reiniciado. Se o servidor MySQL estiver atuando como uma replica e você estiver usando um local não permanente para `tmpdir`, considere definir um diretório temporário diferente para a replica usando a variável `slave_load_tmpdir`. Para uma replica, os arquivos temporários usados para replicar as declarações de `LOAD DATA` são armazenados neste diretório, portanto, com um local permanente, eles podem sobreviver a reinicializações de máquina, embora a replicação agora possa continuar após um reinício se os arquivos temporários tiverem sido removidos.

Para mais informações sobre o local de armazenamento de arquivos temporários, consulte a Seção B.3.3.5, “Onde o MySQL armazena arquivos temporários”.

* `transaction_alloc_block_size`

  <table frame="box" rules="all" summary="Properties for authentication_windows_use_principal_name"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--authentication-windows-use-principal-name[={OFF|ON}]</code></td> </tr><tr><th>System Variable</th> <td><code>authentication_windows_use_principal_name</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>ON</code></td> </tr></tbody></table>50

O valor em bytes pelo qual deve-se aumentar o pool de memória por transação que necessita de memória. Veja a descrição de `transaction_prealloc_size`.

* `transaction_isolation`

  <table frame="box" rules="all" summary="Properties for authentication_windows_use_principal_name"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--authentication-windows-use-principal-name[={OFF|ON}]</code></td> </tr><tr><th>System Variable</th> <td><code>authentication_windows_use_principal_name</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>ON</code></td> </tr></tbody></table>51

O nível de isolamento de transação. O padrão é `REPEATABLE-READ`.

O nível de isolamento de transação tem três escopos: global, sessão e próxima transação. Essa implementação de três escopos leva a algumas semânticas de atribuição de nível de isolamento não padrão, conforme descrito mais adiante.

Para definir o nível de isolamento de transação global ao iniciar, use a opção `--transaction-isolation` do servidor.

No momento da execução, o nível de isolamento pode ser definido diretamente usando a declaração `SET` para atribuir um valor à variável de sistema `transaction_isolation`, ou indiretamente usando a declaração `SET TRANSACTION`. Se você definir `transaction_isolation` diretamente para um nome de nível de isolamento que contenha um espaço, o nome deve ser fechado entre aspas, com o espaço substituído por uma barra. Por exemplo, use esta declaração `SET` para definir o valor global:

  ```sql
  SET GLOBAL transaction_isolation = 'READ-COMMITTED';
  ```

Definir o valor global `transaction_isolation` define o nível de isolamento para todas as sessões subsequentes. As sessões existentes não são afetadas.

Para definir o valor da sessão ou do nível seguinte `transaction_isolation`, use a declaração `SET`. Para a maioria das variáveis do sistema de sessão, essas declarações são formas equivalentes de definir o valor:

  ```sql
  SET @@SESSION.var_name = value;
  SET SESSION var_name = value;
  SET var_name = value;
  SET @@var_name = value;
  ```

Como mencionado anteriormente, o nível de isolamento de transação tem um escopo de próxima transação, além dos escopos global e de sessão. Para habilitar que o escopo de próxima transação seja definido, a sintaxe `SET` para atribuir valores de variáveis de sistema de sessão tem semântica não padrão para `transaction_isolation`:

+ Para definir o nível de isolamento da sessão, use qualquer uma dessas sintaxes:

    ```sql
    SET @@SESSION.transaction_isolation = value;
    SET SESSION transaction_isolation = value;
    SET transaction_isolation = value;
    ```

Para cada uma dessas sintaxes, essas semânticas se aplicam:

- Define o nível de isolamento para todas as transações subsequentes realizadas dentro da sessão.

- Permitido dentro das transações, mas não afeta a transação em andamento atual.

- Se executado entre transações, substitui qualquer declaração anterior que defina o nível de isolamento da próxima transação.

- Corresponde a `SET SESSION TRANSACTION ISOLATION LEVEL` (com a palavra-chave `SESSION`).

+ Para definir o nível de isolamento da próxima transação, use a seguinte sintaxe:

    ```sql
    SET @@transaction_isolation = value;
    ```

Para essa sintaxe, essas semânticas se aplicam:

- Define o nível de isolamento apenas para a próxima transação única realizada dentro da sessão.

- As transações subsequentes retornam ao nível de isolamento de sessão.

- Não permitido em transações.
- Corresponde a `SET TRANSACTION ISOLATION LEVEL` (sem a palavra-chave `SESSION`).

Para mais informações sobre `SET TRANSACTION` e sua relação com a variável de sistema `transaction_isolation`, consulte a Seção 13.3.6, “Instrução SET TRANSACTION”.

Nota

`transaction_isolation` foi adicionado no MySQL 5.7.20 como sinônimo de `tx_isolation`, que agora é descontinuado e será removido no MySQL 8.0. As aplicações devem ser ajustadas para usar `transaction_isolation` em preferência a `tx_isolation`.

* `transaction_prealloc_size`

  <table frame="box" rules="all" summary="Properties for authentication_windows_use_principal_name"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--authentication-windows-use-principal-name[={OFF|ON}]</code></td> </tr><tr><th>System Variable</th> <td><code>authentication_windows_use_principal_name</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>ON</code></td> </tr></tbody></table>52

Existe um pool de memória por transação do qual várias alocações relacionadas à transação obtêm memória. O tamanho inicial do pool em bytes é `transaction_prealloc_size`. Para cada alocação que não pode ser satisfeita a partir do pool porque tem memória insuficiente disponível, o pool é aumentado em `transaction_alloc_block_size` bytes. Quando a transação termina, o pool é truncado para `transaction_prealloc_size` bytes.

Ao tornar `transaction_prealloc_size` suficientemente grande para conter todas as declarações em uma única transação, você pode evitar muitas chamadas de `malloc()`.

* `transaction_read_only`

  <table frame="box" rules="all" summary="Properties for authentication_windows_use_principal_name"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--authentication-windows-use-principal-name[={OFF|ON}]</code></td> </tr><tr><th>System Variable</th> <td><code>authentication_windows_use_principal_name</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>ON</code></td> </tr></tbody></table>53

O modo de acesso à transação. O valor pode ser `OFF` (leitura/escrita; o padrão) ou `ON` (somente leitura).

O modo de acesso à transação tem três escopos: global, sessão e próxima transação. Essa implementação de três escopos leva a algumas semânticas de atribuição de modo de acesso não padrão, conforme descrito mais adiante.

Para definir o modo de acesso de transação global na inicialização, use a opção do servidor `--transaction-read-only`.

No momento da execução, o modo de acesso pode ser definido diretamente usando a declaração `SET` para atribuir um valor à variável de sistema `transaction_read_only`, ou indiretamente usando a declaração `SET TRANSACTION`. Por exemplo, use esta declaração `SET` para definir o valor global:

  ```sql
  SET GLOBAL transaction_read_only = ON;
  ```

Definir o valor global `transaction_read_only` define o modo de acesso para todas as sessões subsequentes. As sessões existentes não são afetadas.

Para definir o valor da sessão ou do nível seguinte `transaction_read_only`, use a declaração `SET`. Para a maioria das variáveis do sistema de sessão, essas declarações são formas equivalentes de definir o valor:

  ```sql
  SET @@SESSION.var_name = value;
  SET SESSION var_name = value;
  SET var_name = value;
  SET @@var_name = value;
  ```

Como mencionado anteriormente, o modo de acesso à transação tem um escopo de próxima transação, além dos escopos global e de sessão. Para habilitar que o escopo de próxima transação seja definido, a sintaxe `SET` para atribuir valores de variáveis do sistema de sessão tem semântica não padrão para `transaction_read_only`,

+ Para definir o modo de acesso à sessão, use qualquer uma dessas sintaxes:

    ```sql
    SET @@SESSION.transaction_read_only = value;
    SET SESSION transaction_read_only = value;
    SET transaction_read_only = value;
    ```

Para cada uma dessas sintaxes, essas semânticas se aplicam:

- Define o modo de acesso para todas as transações subsequentes realizadas dentro da sessão.

- Permitido dentro das transações, mas não afeta a transação em andamento atual.

- Se executado entre transações, substitui qualquer declaração anterior que defina o modo de acesso da próxima transação.

- Corresponde a `SET SESSION TRANSACTION {READ WRITE | READ ONLY}` (com a palavra-chave `SESSION`).

+ Para definir o modo de acesso da próxima transação, use esta sintaxe:

    ```sql
    SET @@transaction_read_only = value;
    ```

Para essa sintaxe, essas semânticas se aplicam:

- Define o modo de acesso apenas para a próxima transação única realizada dentro da sessão.

- As transações subsequentes retornam ao modo de acesso à sessão.

- Não permitido em transações.
- Corresponde a `SET TRANSACTION {READ WRITE | READ ONLY}` (sem a palavra-chave `SESSION`).

Para mais informações sobre `SET TRANSACTION` e sua relação com a variável de sistema `transaction_read_only`, consulte a Seção 13.3.6, “Instrução SET TRANSACTION”.

Nota

`transaction_read_only` foi adicionado no MySQL 5.7.20 como sinônimo de `tx_read_only`, que agora é descontinuado e será removido no MySQL 8.0. As aplicações devem ser ajustadas para usar `transaction_read_only` em preferência a `tx_read_only`.

* `tx_isolation`

  <table frame="box" rules="all" summary="Properties for authentication_windows_use_principal_name"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--authentication-windows-use-principal-name[={OFF|ON}]</code></td> </tr><tr><th>System Variable</th> <td><code>authentication_windows_use_principal_name</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>ON</code></td> </tr></tbody></table>54

O nível de isolamento de transação padrão. Por padrão, é `REPEATABLE-READ`.

Nota

`transaction_isolation` foi adicionado no MySQL 5.7.20 como sinônimo de `tx_isolation`, que agora é descontinuado e será removido no MySQL 8.0. As aplicações devem ser ajustadas para usar `transaction_isolation` em preferência a `tx_isolation`. Consulte a descrição de `transaction_isolation` para detalhes.

* `tx_read_only`

  <table frame="box" rules="all" summary="Properties for authentication_windows_use_principal_name"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--authentication-windows-use-principal-name[={OFF|ON}]</code></td> </tr><tr><th>System Variable</th> <td><code>authentication_windows_use_principal_name</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>ON</code></td> </tr></tbody></table>55

O modo de acesso à transação padrão. O valor pode ser `OFF` (leitura/escrita, padrão) ou `ON` (somente leitura).

Nota

`transaction_read_only` foi adicionado no MySQL 5.7.20 como sinônimo de `tx_read_only`, que agora é descontinuado e será removido no MySQL 8.0. As aplicações devem ser ajustadas para usar `transaction_read_only` em preferência de `tx_read_only`. Consulte a descrição de `transaction_read_only` para detalhes.

* `unique_checks`

  <table frame="box" rules="all" summary="Properties for authentication_windows_use_principal_name"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--authentication-windows-use-principal-name[={OFF|ON}]</code></td> </tr><tr><th>System Variable</th> <td><code>authentication_windows_use_principal_name</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>ON</code></td> </tr></tbody></table>56

Se definido para 1 (o padrão), as verificações de unicidade para índices secundários nas tabelas de `InnoDB` são realizadas. Se definido para 0, os motores de armazenamento são permitidos a assumir que chaves duplicadas não estão presentes nos dados de entrada. Se você sabe com certeza que seus dados não contêm violações de unicidade, você pode definir isso para 0 para acelerar as importações de grandes tabelas para `InnoDB`.

Definir essa variável para 0 não **obriga** os motores de armazenamento a ignorar chaves duplicadas. Ainda é permitido que um motor verifique essas chaves e emita erros de chave duplicada se as detectar.

* `updatable_views_with_limit`

  <table frame="box" rules="all" summary="Properties for authentication_windows_use_principal_name"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--authentication-windows-use-principal-name[={OFF|ON}]</code></td> </tr><tr><th>System Variable</th> <td><code>authentication_windows_use_principal_name</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>ON</code></td> </tr></tbody></table>57

Essa variável controla se atualizações para uma visão podem ser feitas quando a visão não contém todas as colunas da chave primária definida na tabela subjacente, se a declaração de atualização contém uma cláusula `LIMIT`. (Tais atualizações são frequentemente geradas por ferramentas de GUI.) Uma atualização é uma declaração `UPDATE` ou `DELETE`. Chave primária aqui significa um `PRIMARY KEY`, ou um índice `UNIQUE` no qual nenhuma coluna pode conter `NULL`.

A variável pode ter dois valores:

+ `1` ou `YES`: Emitir apenas uma advertência (não uma mensagem de erro). Este é o valor padrão.

+ `0` ou `NO`: Proibir a atualização.

* `validate_password_xxx`

O plugin `validate_password` implementa um conjunto de variáveis do sistema com nomes na forma `validate_password_xxx`. Essas variáveis afetam o teste de senha desse plugin; veja a Seção 6.4.3.2, “Opções e Variáveis do Plugin de Validação de Senha”.

* `version`

O número da versão do servidor. O valor também pode incluir um sufixo que indica informações de construção ou configuração do servidor. `-log` indica que um ou mais dos logs gerais, logs de consultas lentas ou logs binários estão habilitados. `-debug` indica que o servidor foi construído com suporte de depuração habilitado.

* `version_comment`

  <table frame="box" rules="all" summary="Properties for authentication_windows_use_principal_name"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--authentication-windows-use-principal-name[={OFF|ON}]</code></td> </tr><tr><th>System Variable</th> <td><code>authentication_windows_use_principal_name</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>ON</code></td> </tr></tbody></table>58

O programa de configuração **CMake** tem uma opção `COMPILATION_COMMENT` que permite especificar um comentário ao compilar o MySQL. Essa variável contém o valor desse comentário. Veja a Seção 2.8.7, “Opções de configuração de fonte MySQL”.

* `version_compile_machine`

  <table frame="box" rules="all" summary="Properties for authentication_windows_use_principal_name"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--authentication-windows-use-principal-name[={OFF|ON}]</code></td> </tr><tr><th>System Variable</th> <td><code>authentication_windows_use_principal_name</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>ON</code></td> </tr></tbody></table>59

O tipo do binário do servidor.

* `version_compile_os`

  <table frame="box" rules="all" summary="Properties for authentication_windows_use_principal_name"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--authentication-windows-use-principal-name[={OFF|ON}]</code></td> </tr><tr><th>System Variable</th> <td><code>authentication_windows_use_principal_name</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>ON</code></td> </tr></tbody></table>60

O tipo de sistema operacional no qual o MySQL foi construído.

* `wait_timeout`

<table>
<tbody>
<tr>
<th>Command-Line Format</th>
<td><code>--authentication-windows-use-principal-name[={OFF|ON}]</code></td>
</tr>
<tr>
<th>System Variable</th>
<td><code>authentication_windows_use_principal_name</code></td>
</tr>
<tr>
<th>Scope</th>
<td>Global</td>
</tr>
<tr>
<th>Dynamic</th>
<td>No</td>
</tr>
<tr>
<th>Type</th>
<td>Boolean</td>
</tr>
<tr>
<th>Default Value</th>
<td><code>ON</code></td>
</tr>
</tbody>
</table>

O número de segundos que o servidor espera por atividade em uma conexão não interativa antes de fechá-la.

No início do thread, o valor da sessão `wait_timeout` é inicializado a partir do valor global `wait_timeout` ou a partir do valor global `interactive_timeout`, dependendo do tipo de cliente (conforme definido pela opção de conexão `CLIENT_INTERACTIVE` para `mysql_real_connect()`). Veja também `interactive_timeout`.

* `warning_count`

O número de erros, avisos e notas que resultaram da última declaração que gerou mensagens. Essa variável é somente de leitura. Veja a Seção 13.7.5.40, “Declaração SHOW WARNINGS”.

### 5.1.8 Usando variáveis do sistema

O servidor MySQL mantém muitas variáveis de sistema que configuram sua operação. A Seção 5.1.7, “Variáveis de sistema do servidor”, descreve o significado dessas variáveis. Cada variável de sistema tem um valor padrão. As variáveis de sistema podem ser definidas na inicialização do servidor usando opções na string de comando ou em um arquivo de opções. A maioria delas pode ser alterada dinamicamente enquanto o servidor está em execução, por meio da declaração `SET`, que permite modificar a operação do servidor sem precisar parar e reiniciar. Você também pode usar os valores das variáveis de sistema em expressões.

Muitas variáveis do sistema são incorporadas. As variáveis do sistema implementadas por um plugin do servidor são expostas quando o plugin é instalado e têm nomes que começam com o nome do plugin. Por exemplo, o plugin `audit_log` implementa uma variável do sistema chamada `audit_log_policy`.

Existem dois escopos em que as variáveis do sistema existem. As variáveis globais afetam o funcionamento geral do servidor. As variáveis de sessão afetam seu funcionamento para conexões individuais de clientes. Uma variável de sistema dada pode ter tanto um valor global quanto um valor de sessão. As variáveis de sistema globais e de sessão estão relacionadas da seguinte forma:

* Quando o servidor é iniciado, ele inicializa cada variável global com seu valor padrão. Esses valores padrão podem ser alterados por opções especificadas na string de comando ou em um arquivo de opções. (Veja a Seção 4.2.2, “Especificação de Opções do Programa”.)

* O servidor também mantém um conjunto de variáveis de sessão para cada cliente que se conecta. As variáveis de sessão do cliente são inicializadas no momento da conexão, usando os valores atuais das variáveis globais correspondentes. Por exemplo, o modo SQL de um cliente é controlado pelo valor da sessão `sql_mode`, que é inicializado quando o cliente se conecta ao valor do global `sql_mode`.

Para algumas variáveis do sistema, o valor da sessão não é inicializado a partir do valor global correspondente; se assim for, isso é indicado na descrição da variável.

Os valores das variáveis do sistema podem ser definidos globalmente na inicialização do servidor usando opções na string de comando ou em um arquivo de opções. Na inicialização, a sintaxe para as variáveis do sistema é a mesma para as opções de comando, então, dentro dos nomes das variáveis, travessões e sublinhados podem ser usados de forma intercambiável. Por exemplo, `--general_log=ON` e `--general-log=ON` são equivalentes.

Quando você usa uma opção de inicialização para definir uma variável que recebe um valor numérico, o valor pode ser dado com um sufixo de `K`, `M` ou `G` (seja maiúscula ou minúscula) para indicar um multiplicador de 1024, 10242 ou 10243; ou seja, unidades de kilobytes, megabytes ou gigabytes, respectivamente. Assim, o seguinte comando inicia o servidor com um tamanho de arquivo de log `InnoDB` de 16 megabytes e um tamanho máximo de pacote de um gigabyte:

```sql
mysqld --innodb-log-file-size=16M --max-allowed-packet=1G
```

Dentro de um arquivo de opção, essas variáveis são definidas da seguinte forma:

```sql
[mysqld]
innodb_log_file_size=16M
max_allowed_packet=1G
```

A grafia maiúscula ou minúscula das letras de sufixo não importa; `16M` e `16m` são equivalentes, assim como `1G` e `1g`.

Para restringir o valor máximo ao qual uma variável do sistema pode ser definida em tempo de execução com a declaração `SET`, especifique esse máximo usando uma opção na forma `--maximum-var_name=value` na inicialização do servidor. Por exemplo, para impedir que o valor de `innodb_log_file_size` seja aumentado para mais de 32 MB em tempo de execução, use a opção `--maximum-innodb-log-file-size=32M`.

Muitas variáveis do sistema são dinâmicas e podem ser alteradas durante a execução do programa usando a declaração `SET`. Para uma lista, consulte a Seção 5.1.8.2, “Variáveis de sistema dinâmicas”. Para alterar uma variável de sistema com `SET`, consulte-a pelo nome, opcionalmente precedida por um modificador. Durante a execução, os nomes das variáveis de sistema devem ser escritos usando underscores, não traços. Os exemplos a seguir ilustram brevemente essa sintaxe:

* Defina uma variável de sistema global:

  ```sql
  SET GLOBAL max_connections = 1000;
  SET @@GLOBAL.max_connections = 1000;
  ```

* Defina uma variável de sistema de sessão:

  ```sql
  SET SESSION sql_mode = 'TRADITIONAL';
  SET @@SESSION.sql_mode = 'TRADITIONAL';
  SET @@sql_mode = 'TRADITIONAL';
  ```

Para obter detalhes completos sobre a sintaxe do `SET`, consulte a Seção 13.7.4.1, “Sintaxe de definição de variáveis”. Para uma descrição dos requisitos de privilégio para definir variáveis do sistema, consulte a Seção 5.1.8.1, “Privilégios de variáveis do sistema”.

Sufixos para especificar um multiplicador de valor podem ser usados ao definir uma variável na inicialização do servidor, mas não para definir o valor com `SET` no tempo de execução. Por outro lado, com `SET`, você pode atribuir o valor de uma variável usando uma expressão, o que não é verdade quando você define uma variável na inicialização do servidor. Por exemplo, a primeira das strings a seguir é legal na inicialização do servidor, mas a segunda não é:

```sql
$> mysql --max_allowed_packet=16M
$> mysql --max_allowed_packet=16*1024*1024
```

Por outro lado, a segunda das strings a seguir é legal durante a execução, mas a primeira não é:

```sql
mysql> SET GLOBAL max_allowed_packet=16M;
mysql> SET GLOBAL max_allowed_packet=16*1024*1024;
```

Para exibir os nomes e valores das variáveis do sistema, use a declaração `SHOW VARIABLES`:

```sql
mysql> SHOW VARIABLES;
+---------------------------------+-----------------------------------+
| Variable_name                   | Value                             |
+---------------------------------+-----------------------------------+
| auto_increment_increment        | 1                                 |
| auto_increment_offset           | 1                                 |
| automatic_sp_privileges         | ON                                |
| back_log                        | 50                                |
| basedir                         | /home/mysql/                      |
| binlog_cache_size               | 32768                             |
| bulk_insert_buffer_size         | 8388608                           |
| character_set_client            | utf8                              |
| character_set_connection        | utf8                              |
| character_set_database          | latin1                            |
| character_set_filesystem        | binary                            |
| character_set_results           | utf8                              |
| character_set_server            | latin1                            |
| character_set_system            | utf8                              |
| character_sets_dir              | /home/mysql/share/mysql/charsets/ |
| collation_connection            | utf8_general_ci                   |
| collation_database              | latin1_swedish_ci                 |
| collation_server                | latin1_swedish_ci                 |
...
| innodb_autoextend_increment     | 8                                 |
| innodb_buffer_pool_size         | 8388608                           |
| innodb_checksums                | ON                                |
| innodb_commit_concurrency       | 0                                 |
| innodb_concurrency_tickets      | 500                               |
| innodb_data_file_path           | ibdata1:10M:autoextend            |
| innodb_data_home_dir            |                                   |
...
| version                         | 5.7.18-log                        |
| version_comment                 | Source distribution               |
| version_compile_machine         | i686                              |
| version_compile_os              | suse-linux                        |
| wait_timeout                    | 28800                             |
+---------------------------------+-----------------------------------+
```

Com uma cláusula `LIKE`, a declaração exibe apenas as variáveis que correspondem ao padrão. Para obter um nome específico de variável, use uma cláusula `LIKE` como mostrado:

```sql
SHOW VARIABLES LIKE 'max_join_size';
SHOW SESSION VARIABLES LIKE 'max_join_size';
```

Para obter uma lista de variáveis cujos nomes correspondem a um padrão, use o caractere curinga `%` em uma cláusula `LIKE`:

```sql
SHOW VARIABLES LIKE '%size%';
SHOW GLOBAL VARIABLES LIKE '%size%';
```

Os caracteres curinga podem ser usados em qualquer posição dentro do padrão que deve ser correspondido. De forma estrita, porque `_` é um curinga que corresponde a qualquer único caractere, você deve escapar `_` para correspondê-lo literalmente. Na prática, isso raramente é necessário.

Para `SHOW VARIABLES`, se você não especificar nem `GLOBAL` nem `SESSION`, o MySQL retorna os valores de `SESSION`.

A razão para exigir a palavra-chave `GLOBAL` ao definir variáveis apenas para `GLOBAL`, mas não ao recuperá-las, é para evitar problemas no futuro:

* Se uma variável `SESSION` fosse removida que tenha o mesmo nome que uma variável `GLOBAL`, um cliente com privilégios suficientes para modificar variáveis globais poderia, acidentalmente, alterar a variável `GLOBAL` em vez de apenas a variável `SESSION` para sua própria sessão.

* Se uma variável `SESSION` fosse adicionada com o mesmo nome que uma variável `GLOBAL`, um cliente que pretenda alterar a variável `GLOBAL` pode encontrar apenas sua própria variável `SESSION` alterada.

#### 5.1.8.1 Privilegios de variáveis do sistema

Uma variável de sistema pode ter um valor global que afeta o funcionamento do servidor como um todo, um valor de sessão que afeta apenas a sessão atual ou ambos. Para modificar os valores de execução de variáveis de sistema, use a declaração `SET`. Veja a Seção 13.7.4.1, “Sintaxe SET para Atribuição de Variáveis”. Esta seção descreve os privilégios necessários para atribuir valores a variáveis de sistema em tempo de execução.

Definir um valor de variável de execução de sistema global requer o privilégio `SUPER`.

Para definir o valor de execução de uma variável de sessão do sistema, use a declaração `SET SESSION`. Em contraste com a definição de valores de execução globais, definir valores de execução de sessão normalmente não requer privilégios especiais e pode ser feito por qualquer usuário para afetar a sessão atual. Para algumas variáveis de sistema, definir o valor da sessão pode ter efeitos fora da sessão atual e, portanto, é uma operação restrita que pode ser feita apenas por usuários que têm o privilégio `SUPER`. Se uma variável de sistema de sessão for restringida dessa maneira, a descrição da variável indica essa restrição. Exemplos incluem `binlog_format` e `sql_log_bin`. Definir o valor da sessão dessas variáveis afeta o registro binário para a sessão atual, mas também pode ter implicações mais amplas para a integridade da replicação e backups do servidor.

#### 5.1.8.2 Variáveis dinâmicas do sistema

Muitas variáveis do sistema do servidor são dinâmicas e podem ser definidas em tempo de execução. Consulte a Seção 13.7.4.1, “Sintaxe de definição para atribuição de variáveis”. Para uma descrição dos requisitos de privilégio para definir variáveis do sistema, consulte a Seção 5.1.8.1, “Privilégios de variáveis do sistema”.

A tabela a seguir lista todas as variáveis de sistema dinâmico aplicáveis dentro de `mysqld`.

A tabela lista o tipo de dados e o escopo de cada variável. A última coluna indica se o escopo de cada variável é Global, Sessão ou ambos. Consulte as descrições dos itens correspondentes para obter detalhes sobre a configuração e uso das variáveis. Quando apropriado, são fornecidos links diretos para informações adicionais sobre os itens.

As variáveis que têm um tipo de “string” aceitam um valor de string. As variáveis que têm um tipo de “numérico” aceitam um valor numérico. As variáveis que têm um tipo de “booleano” podem ser definidas como 0, 1, `ON` ou `OFF`. As variáveis marcadas como “enumeração” normalmente devem ser definidas como um dos valores disponíveis para a variável, mas também podem ser definidas como o número que corresponde ao valor de enumeração desejado. Para as variáveis de sistema enumeradas, o primeiro valor de enumeração corresponde a 0. Isso difere do tipo de dados `ENUM` usado para as colunas da tabela, para o qual o primeiro valor de enumeração corresponde a 1.

**Tabela 5.4 Resumo das variáveis dinâmicas do sistema**

<table>
<thead>
<tr>
<th>Variable Name</th>
<th>Variable Type</th>
<th>Variable Scope</th>
</tr>
</thead>
<tbody>
<tr>
<th><code>audit_log_connection_policy</code></th>
<td>Enumeration</td>
<td>Global</td>
</tr>
<tr>
<th><code>audit_log_disable</code></th>
<td>Boolean</td>
<td>Global</td>
</tr>
<tr>
<th><code>audit_log_exclude_accounts</code></th>
<td>String</td>
<td>Global</td>
</tr>
<tr>
<th><code>audit_log_flush</code></th>
<td>Boolean</td>
<td>Global</td>
</tr>
<tr>
<th><code>audit_log_format_unix_timestamp</code></th>
<td>Boolean</td>
<td>Global</td>
</tr>
<tr>
<th><code>audit_log_include_accounts</code></th>
<td>String</td>
<td>Global</td>
</tr>
<tr>
<th><code>audit_log_read_buffer_size</code></th>
<td>Integer</td>
<td>Varies</td>
</tr>
<tr>
<th><code>audit_log_rotate_on_size</code></th>
<td>Integer</td>
<td>Global</td>
</tr>
<tr>
<th><code>audit_log_statement_policy</code></th>
<td>Enumeration</td>
<td>Global</td>
</tr>
<tr>
<th><code>authentication_ldap_sasl_auth_method_name</code></th>
<td>String</td>
<td>Global</td>
</tr>
<tr>
<th><code>authentication_ldap_sasl_bind_base_dn</code></th>
<td>String</td>
<td>Global</td>
</tr>
<tr>
<th><code>authentication_ldap_sasl_bind_root_dn</code></th>
<td>String</td>
<td>Global</td>
</tr>
<tr>
<th><code>authentication_ldap_sasl_bind_root_pwd</code></th>
<td>String</td>
<td>Global</td>
</tr>
<tr>
<th><code>authentication_ldap_sasl_ca_path</code></th>
<td>String</td>
<td>Global</td>
</tr>
<tr>
<th><code>authentication_ldap_sasl_group_search_attr</code></th>
<td>String</td>
<td>Global</td>
</tr>
<tr>
<th><code>authentication_ldap_sasl_group_search_filter</code></th>
<td>String</td>
<td>Global</td>
</tr>
<tr>
<th><code>authentication_ldap_sasl_init_pool_size</code></th>
<td>Integer</td>
<td>Global</td>
</tr>
<tr>
<th><code>authentication_ldap_sasl_log_status</code></th>
<td>Integer</td>
<td>Global</td>
</tr>
<tr>
<th><code>authentication_ldap_sasl_max_pool_size</code></th>
<td>Integer</td>
<td>Global</td>
</tr>
<tr>
<th><code>authentication_ldap_sasl_server_host</code></th>
<td>String</td>
<td>Global</td>
</tr>
<tr>
<th><code>authentication_ldap_sasl_server_port</code></th>
<td>Integer</td>
<td>Global</td>
</tr>
<tr>
<th><code>authentication_ldap_sasl_tls</code></th>
<td>Boolean</td>
<td>Global</td>
</tr>
<tr>
<th><code>authentication_ldap_sasl_user_search_attr</code></th>
<td>String</td>
<td>Global</td>
</tr>
<tr>
<th><code>authentication_ldap_simple_auth_method_name</code></th>
<td>String</td>
<td>Global</td>
</tr>
<tr>
<th><code>authentication_ldap_simple_bind_base_dn</code></th>
<td>String</td>
<td>Global</td>
</tr>
<tr>
<th><code>authentication_ldap_simple_bind_root_dn</code></th>
<td>String</td>
<td>Global</td>
</tr>
<tr>
<th><code>authentication_ldap_simple_bind_root_pwd</code></th>
<td>String</td>
<td>Global</td>
</tr>
<tr>
<th><code>authentication_ldap_simple_ca_path</code></th>
<td>String</td>
<td>Global</td>
</tr>
<tr>
<th><code>authentication_ldap_simple_group_search_attr</code></th>
<td>String</td>
<td>Global</td>
</tr>
<tr>
<th><code>authentication_ldap_simple_group_search_filter</code></th>
<td>String</td>
<td>Global</td>
</tr>
<tr>
<th><code>authentication_ldap_simple_init_pool_size</code></th>
<td>Integer</td>
<td>Global</td>
</tr>
<tr>
<th><code>authentication_ldap_simple_log_status</code></th>
<td>Integer</td>
<td>Global</td>
</tr>
<tr>
<th><code>authentication_ldap_simple_max_pool_size</code></th>
<td>Integer</td>
<td>Global</td>
</tr>
<tr>
<th><code>authentication_ldap_simple_server_host</code></th>
<td>String</td>
<td>Global</td>
</tr>
<tr>
<th><code>authentication_ldap_simple_server_port</code></th>
<td>Integer</td>
<td>Global</td>
</tr>
<tr>
<th><code>authentication_ldap_simple_tls</code></th>
<td>Boolean</td>
<td>Global</td>
</tr>
<tr>
<th><code>authentication_ldap_simple_user_search_attr</code></th>
<td>String</td>
<td>Global</td>
</tr>
<tr>
<th><code>auto_increment_increment</code></th>
<td>Integer</td>
<td>Both</td>
</tr>
<tr>
<th><code>auto_increment_offset</code></th>
<td>Integer</td>
<td>Both</td>
</tr>
<tr>
<th><code>autocommit</code></th>
<td>Boolean</td>
<td>Both</td>
</tr>
<tr>
<th><code>automatic_sp_privileges</code></th>
<td>Boolean</td>
<td>Global</td>
</tr>
<tr>
<th><code>avoid_temporal_upgrade</code></th>
<td>Boolean</td>
<td>Global</td>
</tr>
<tr>
<th><code>big_tables</code></th>
<td>Boolean</td>
<td>Both</td>
</tr>
<tr>
<th><code>binlog_cache_size</code></th>
<td>Integer</td>
<td>Global</td>
</tr>
<tr>
<th><code>binlog_checksum</code></th>
<td>String</td>
<td>Global</td>
</tr>
<tr>
<th><code>binlog_direct_non_transactional_updates</code></th>
<td>Boolean</td>
<td>Both</td>
</tr>
<tr>
<th><code>binlog_error_action</code></th>
<td>Enumeration</td>
<td>Global</td>
</tr>
<tr>
<th><code>binlog_format</code></th>
<td>Enumeration</td>
<td>Both</td>
</tr>
<tr>
<th><code>binlog_group_commit_sync_delay</code></th>
<td>Integer</td>
<td>Global</td>
</tr>
<tr>
<th><code>binlog_group_commit_sync_no_delay_count</code></th>
<td>Integer</td>
<td>Global</td>
</tr>
<tr>
<th><code>binlog_max_flush_queue_time</code></th>
<td>Integer</td>
<td>Global</td>
</tr>
<tr>
<th><code>binlog_order_commits</code></th>
<td>Boolean</td>
<td>Global</td>
</tr>
<tr>
<th><code>binlog_row_image</code></th>
<td>Enumeration</td>
<td>Both</td>
</tr>
<tr>
<th><code>binlog_rows_query_log_events</code></th>
<td>Boolean</td>
<td>Both</td>
</tr>
<tr>
<th><code>binlog_stmt_cache_size</code></th>
<td>Integer</td>
<td>Global</td>
</tr>
<tr>
<th><code>binlog_transaction_dependency_history_size</code></th>
<td>Integer</td>
<td>Global</td>
</tr>
<tr>
<th><code>binlog_transaction_dependency_tracking</code></th>
<td>Enumeration</td>
<td>Global</td>
</tr>
<tr>
<th><code>block_encryption_mode</code></th>
<td>String</td>
<td>Both</td>
</tr>
<tr>
<th><code>bulk_insert_buffer_size</code></th>
<td>Integer</td>
<td>Both</td>
</tr>
<tr>
<th><code>character_set_client</code></th>
<td>String</td>
<td>Both</td>
</tr>
<tr>
<th><code>character_set_connection</code></th>
<td>String</td>
<td>Both</td>
</tr>
<tr>
<th><code>character_set_database</code></th>
<td>String</td>
<td>Both</td>
</tr>
<tr>
<th><code>character_set_filesystem</code></th>
<td>String</td>
<td>Both</td>
</tr>
<tr>
<th><code>character_set_results</code></th>
<td>String</td>
<td>Both</td>
</tr>
<tr>
<th><code>character_set_server</code></th>
<td>String</td>
<td>Both</td>
</tr>
<tr>
<th><code>check_proxy_users</code></th>
<td>Boolean</td>
<td>Global</td>
</tr>
<tr>
<th><code>collation_connection</code></th>
<td>String</td>
<td>Both</td>
</tr>
<tr>
<th><code>collation_database</code></th>
<td>String</td>
<td>Both</td>
</tr>
<tr>
<th><code>collation_server</code></th>
<td>String</td>
<td>Both</td>
</tr>
<tr>
<th><code>completion_type</code></th>
<td>Enumeration</td>
<td>Both</td>
</tr>
<tr>
<th><code>concurrent_insert</code></th>
<td>Enumeration</td>
<td>Global</td>
</tr>
<tr>
<th><code>connect_timeout</code></th>
<td>Integer</td>
<td>Global</td>
</tr>
<tr>
<th><code>connection_control_failed_connections_threshold</code></th>
<td>Integer</td>
<td>Global</td>
</tr>
<tr>
<th><code>connection_control_max_connection_delay</code></th>
<td>Integer</td>
<td>Global</td>
</tr>
<tr>
<th><code>connection_control_min_connection_delay</code></th>
<td>Integer</td>
<td>Global</td>
</tr>
<tr>
<th><code>debug</code></th>
<td>String</td>
<td>Both</td>
</tr>
<tr>
<th><code>debug_sync</code></th>
<td>String</td>
<td>Session</td>
</tr>
<tr>
<th><code>default_password_lifetime</code></th>
<td>Integer</td>
<td>Global</td>
</tr>
<tr>
<th><code>default_storage_engine</code></th>
<td>Enumeration</td>
<td>Both</td>
</tr>
<tr>
<th><code>default_tmp_storage_engine</code></th>
<td>Enumeration</td>
<td>Both</td>
</tr>
<tr>
<th><code>default_week_format</code></th>
<td>Integer</td>
<td>Both</td>
</tr>
<tr>
<th><code>delay_key_write</code></th>
<td>Enumeration</td>
<td>Global</td>
</tr>
<tr>
<th><code>delayed_insert_limit</code></th>
<td>Integer</td>
<td>Global</td>
</tr>
<tr>
<th><code>delayed_insert_timeout</code></th>
<td>Integer</td>
<td>Global</td>
</tr>
<tr>
<th><code>delayed_queue_size</code></th>
<td>Integer</td>
<td>Global</td>
</tr>
<tr>
<th><code>div_precision_increment</code></th>
<td>Integer</td>
<td>Both</td>
</tr>
<tr>
<th><code>end_markers_in_json</code></th>
<td>Boolean</td>
<td>Both</td>
</tr>
<tr>
<th><code>enforce_gtid_consistency</code></th>
<td>Enumeration</td>
<td>Global</td>
</tr>
<tr>
<th><code>eq_range_index_dive_limit</code></th>
<td>Integer</td>
<td>Both</td>
</tr>
<tr>
<th><code>event_scheduler</code></th>
<td>Enumeration</td>
<td>Global</td>
</tr>
<tr>
<th><code>expire_logs_days</code></th>
<td>Integer</td>
<td>Global</td>
</tr>
<tr>
<th><code>explicit_defaults_for_timestamp</code></th>
<td>Boolean</td>
<td>Both</td>
</tr>
<tr>
<th><code>flush</code></th>
<td>Boolean</td>
<td>Global</td>
</tr>
<tr>
<th><code>flush_time</code></th>
<td>Integer</td>
<td>Global</td>
</tr>
<tr>
<th><code>foreign_key_checks</code></th>
<td>Boolean</td>
<td>Both</td>
</tr>
<tr>
<th><code>ft_boolean_syntax</code></th>
<td>String</td>
<td>Global</td>
</tr>
<tr>
<th><code>general_log</code></th>
<td>Boolean</td>
<td>Global</td>
</tr>
<tr>
<th><code>general_log_file</code></th>
<td>File name</td>
<td>Global</td>
</tr>
<tr>
<th><code>group_concat_max_len</code></th>
<td>Integer</td>
<td>Both</td>
</tr>
<tr>
<th><code>group_replication_allow_local_disjoint_gtids_join</code></th>
<td>Boolean</td>
<td>Global</td>
</tr>
<tr>
<th><code>group_replication_allow_local_lower_version_join</code></th>
<td>Boolean</td>
<td>Global</td>
</tr>
<tr>
<th><code>group_replication_auto_increment_increment</code></th>
<td>Integer</td>
<td>Global</td>
</tr>
<tr>
<th><code>group_replication_bootstrap_group</code></th>
<td>Boolean</td>
<td>Global</td>
</tr>
<tr>
<th><code>group_replication_components_stop_timeout</code></th>
<td>Integer</td>
<td>Global</td>
</tr>
<tr>
<th><code>group_replication_compression_threshold</code></th>
<td>Integer</td>
<td>Global</td>
</tr>
<tr>
<th><code>group_replication_enforce_update_everywhere_checks</code></th>
<td>Boolean</td>
<td>Global</td>
</tr>
<tr>
<th><code>group_replication_exit_state_action</code></th>
<td>Enumeration</td>
<td>Global</td>
</tr>
<tr>
<th><code>group_replication_flow_control_applier_threshold</code></th>
<td>Integer</td>
<td>Global</td>
</tr>
<tr>
<th><code>group_replication_flow_control_certifier_threshold</code></th>
<td>Integer</td>
<td>Global</td>
</tr>
<tr>
<th><code>group_replication_flow_control_mode</code></th>
<td>Enumeration</td>
<td>Global</td>
</tr>
<tr>
<th><code>group_replication_force_members</code></th>
<td>String</td>
<td>Global</td>
</tr>
<tr>
<th><code>group_replication_group_name</code></th>
<td>String</td>
<td>Global</td>
</tr>
<tr>
<th><code>group_replication_group_seeds</code></th>
<td>String</td>
<td>Global</td>
</tr>
<tr>
<th><code>group_replication_gtid_assignment_block_size</code></th>
<td>Integer</td>
<td>Global</td>
</tr>
<tr>
<th><code>group_replication_ip_whitelist</code></th>
<td>String</td>
<td>Global</td>
</tr>
<tr>
<th><code>group_replication_local_address</code></th>
<td>String</td>
<td>Global</td>
</tr>
<tr>
<th><code>group_replication_member_weight</code></th>
<td>Integer</td>
<td>Global</td>
</tr>
<tr>
<th><code>group_replication_poll_spin_loops</code></th>
<td>Integer</td>
<td>Global</td>
</tr>
<tr>
<th><code>group_replication_recovery_complete_at</code></th>
<td>Enumeration</td>
<td>Global</td>
</tr>
<tr>
<th><code>group_replication_recovery_reconnect_interval</code></th>
<td>Integer</td>
<td>Global</td>
</tr>
<tr>
<th><code>group_replication_recovery_retry_count</code></th>
<td>Integer</td>
<td>Global</td>
</tr>
<tr>
<th><code>group_replication_recovery_ssl_ca</code></th>
<td>String</td>
<td>Global</td>
</tr>
<tr>
<th><code>group_replication_recovery_ssl_capath</code></th>
<td>String</td>
<td>Global</td>
</tr>
<tr>
<th><code>group_replication_recovery_ssl_cert</code></th>
<td>String</td>
<td>Global</td>
</tr>
<tr>
<th><code>group_replication_recovery_ssl_cipher</code></th>
<td>String</td>
<td>Global</td>
</tr>
<tr>
<th><code>group_replication_recovery_ssl_crl</code></th>
<td>File name</td>
<td>Global</td>
</tr>
<tr>
<th><code>group_replication_recovery_ssl_crlpath</code></th>
<td>Directory name</td>
<td>Global</td>
</tr>
<tr>
<th><code>group_replication_recovery_ssl_key</code></th>
<td>String</td>
<td>Global</td>
</tr>
<tr>
<th><code>group_replication_recovery_ssl_verify_server_cert</code></th>
<td>Boolean</td>
<td>Global</td>
</tr>
<tr>
<th><code>group_replication_recovery_use_ssl</code></th>
<td>Boolean</td>
<td>Global</td>
</tr>
<tr>
<th><code>group_replication_single_primary_mode</code></th>
<td>Boolean</td>
<td>Global</td>
</tr>
<tr>
<th><code>group_replication_ssl_mode</code></th>
<td>Enumeration</td>
<td>Global</td>
</tr>
<tr>
<th><code>group_replication_start_on_boot</code></th>
<td>Boolean</td>
<td>Global</td>
</tr>
<tr>
<th><code>group_replication_transaction_size_limit</code></th>
<td>Integer</td>
<td>Global</td>
</tr>
<tr>
<th><code>group_replication_unreachable_majority_timeout</code></th>
<td>Integer</td>
<td>Global</td>
</tr>
<tr>
<th><code>gtid_executed_compression_period</code></th>
<td>Integer</td>
<td>Global</td>
</tr>
<tr>
<th><code>gtid_mode</code></th>
<td>Enumeration</td>
<td>Global</td>
</tr>
<tr>
<th><code>gtid_next</code></th>
<td>Enumeration</td>
<td>Session</td>
</tr>
<tr>
<th><code>gtid_purged</code></th>
<td>String</td>
<td>Global</td>
</tr>
<tr>
<th><code>host_cache_size</code></th>
<td>Integer</td>
<td>Global</td>
</tr>
<tr>
<th><code>identity</code></th>
<td>Integer</td>
<td>Session</td>
</tr>
<tr>
<th><code>init_connect</code></th>
<td>String</td>
<td>Global</td>
</tr>
<tr>
<th><code>init_slave</code></th>
<td>String</td>
<td>Global</td>
</tr>
<tr>
<th><code>innodb_adaptive_flushing</code></th>
<td>Boolean</td>
<td>Global</td>
</tr>
<tr>
<th><code>innodb_adaptive_flushing_lwm</code></th>
<td>Integer</td>
<td>Global</td>
</tr>
<tr>
<th><code>innodb_adaptive_hash_index</code></th>
<td>Boolean</td>
<td>Global</td>
</tr>
<tr>
<th><code>innodb_adaptive_max_sleep_delay</code></th>
<td>Integer</td>
<td>Global</td>
</tr>
<tr>
<th><code>innodb_api_bk_commit_interval</code></th>
<td>Integer</td>
<td>Global</td>
</tr>
<tr>
<th><code>innodb_api_trx_level</code></th>
<td>Integer</td>
<td>Global</td>
</tr>
<tr>
<th><code>innodb_autoextend_increment</code></th>
<td>Integer</td>
<td>Global</td>
</tr>
<tr>
<th><code>innodb_background_drop_list_empty</code></th>
<td>Boolean</td>
<td>Global</td>
</tr>
<tr>
<th><code>innodb_buffer_pool_dump_at_shutdown</code></th>
<td>Boolean</td>
<td>Global</td>
</tr>
<tr>
<th><code>innodb_buffer_pool_dump_now</code></th>
<td>Boolean</td>
<td>Global</td>
</tr>
<tr>
<th><code>innodb_buffer_pool_dump_pct</code></th>
<td>Integer</td>
<td>Global</td>
</tr>
<tr>
<th><code>innodb_buffer_pool_filename</code></th>
<td>File name</td>
<td>Global</td>
</tr>
<tr>
<th><code>innodb_buffer_pool_load_abort</code></th>
<td>Boolean</td>
<td>Global</td>
</tr>
<tr>
<th><code>innodb_buffer_pool_load_now</code></th>
<td>Boolean</td>
<td>Global</td>
</tr>
<tr>
<th><code>innodb_buffer_pool_size</code></th>
<td>Integer</td>
<td>Global</td>
</tr>
<tr>
<th><code>innodb_change_buffer_max_size</code></th>
<td>Integer</td>
<td>Global</td>
</tr>
<tr>
<th><code>innodb_change_buffering</code></th>
<td>Enumeration</td>
<td>Global</td>
</tr>
<tr>
<th><code>innodb_change_buffering_debug</code></th>
<td>Integer</td>
<td>Global</td>
</tr>
<tr>
<th><code>innodb_checksum_algorithm</code></th>
<td>Enumeration</td>
<td>Global</td>
</tr>
<tr>
<th><code>innodb_cmp_per_index_enabled</code></th>
<td>Boolean</td>
<td>Global</td>
</tr>
<tr>
<th><code>innodb_commit_concurrency</code></th>
<td>Integer</td>
<td>Global</td>
</tr>
<tr>
<th><code>innodb_compress_debug</code></th>
<td>Enumeration</td>
<td>Global</td>
</tr>
<tr>
<th><code>innodb_compression_failure_threshold_pct</code></th>
<td>Integer</td>
<td>Global</td>
</tr>
<tr>
<th><code>innodb_compression_level</code></th>
<td>Integer</td>
<td>Global</td>
</tr>
<tr>
<th><code>innodb_compression_pad_pct_max</code></th>
<td>Integer</td>
<td>Global</td>
</tr>
<tr>
<th><code>innodb_concurrency_tickets</code></th>
<td>Integer</td>
<td>Global</td>
</tr>
<tr>
<th><code>innodb_deadlock_detect</code></th>
<td>Boolean</td>
<td>Global</td>
</tr>
<tr>
<th><code>innodb_default_row_format</code></th>
<td>Enumeration</td>
<td>Global</td>
</tr>
<tr>
<th><code>innodb_disable_resize_buffer_pool_debug</code></th>
<td>Boolean</td>
<td>Global</td>
</tr>
<tr>
<th><code>innodb_disable_sort_file_cache</code></th>
<td>Boolean</td>
<td>Global</td>
</tr>
<tr>
<th><code>innodb_fast_shutdown</code></th>
<td>Integer</td>
<td>Global</td>
</tr>
<tr>
<th><code>innodb_fil_make_page_dirty_debug</code></th>
<td>Integer</td>
<td>Global</td>
</tr>
<tr>
<th><code>innodb_file_format</code></th>
<td>String</td>
<td>Global</td>
</tr>
<tr>
<th><code>innodb_file_format_max</code></th>
<td>String</td>
<td>Global</td>
</tr>
<tr>
<th><code>innodb_file_per_table</code></th>
<td>Boolean</td>
<td>Global</td>
</tr>
<tr>
<th><code>innodb_fill_factor</code></th>
<td>Integer</td>
<td>Global</td>
</tr>
<tr>
<th><code>innodb_flush_log_at_timeout</code></th>
<td>Integer</td>
<td>Global</td>
</tr>
<tr>
<th><code>innodb_flush_log_at_trx_commit</code></th>
<td>Enumeration</td>
<td>Global</td>
</tr>
<tr>
<th><code>innodb_flush_neighbors</code></th>
<td>Enumeration</td>
<td>Global</td>
</tr>
<tr>
<th><code>innodb_flush_sync</code></th>
<td>Boolean</td>
<td>Global</td>
</tr>
<tr>
<th><code>innodb_flushing_avg_loops</code></th>
<td>Integer</td>
<td>Global</td>
</tr>
<tr>
<th><code>innodb_ft_aux_table</code></th>
<td>String</td>
<td>Global</td>
</tr>
<tr>
<th><code>innodb_ft_enable_diag_print</code></th>
<td>Boolean</td>
<td>Global</td>
</tr>
<tr>
<th><code>innodb_ft_enable_stopword</code></th>
<td>Boolean</td>
<td>Both</td>
</tr>
<tr>
<th><code>innodb_ft_num_word_optimize</code></th>
<td>Integer</td>
<td>Global</td>
</tr>
<tr>
<th><code>innodb_ft_result_cache_limit</code></th>
<td>Integer</td>
<td>Global</td>
</tr>
<tr>
<th><code>innodb_ft_server_stopword_table</code></th>
<td>String</td>
<td>Global</td>
</tr>
<tr>
<th><code>innodb_ft_user_stopword_table</code></th>
<td>String</td>
<td>Both</td>
</tr>
<tr>
<th><code>innodb_io_capacity</code></th>
<td>Integer</td>
<td>Global</td>
</tr>
<tr>
<th><code>innodb_io_capacity_max</code></th>
<td>Integer</td>
<td>Global</td>
</tr>
<tr>
<th><code>innodb_large_prefix</code></th>
<td>Boolean</td>
<td>Global</td>
</tr>
<tr>
<th><code>innodb_limit_optimistic_insert_debug</code></th>
<td>Integer</td>
<td>Global</td>
</tr>
<tr>
<th><code>innodb_lock_wait_timeout</code></th>
<td>Integer</td>
<td>Both</td>
</tr>
<tr>
<th><code>innodb_log_checkpoint_now</code></th>
<td>Boolean</td>
<td>Global</td>
</tr>
<tr>
<th><code>innodb_log_checksums</code></th>
<td>Boolean</td>
<td>Global</td>
</tr>
<tr>
<th><code>innodb_log_compressed_pages</code></th>
<td>Boolean</td>
<td>Global</td>
</tr>
<tr>
<th><code>innodb_log_write_ahead_size</code></th>
<td>Integer</td>
<td>Global</td>
</tr>
<tr>
<th><code>innodb_lru_scan_depth</code></th>
<td>Integer</td>
<td>Global</td>
</tr>
<tr>
<th><code>innodb_max_dirty_pages_pct</code></th>
<td>Numeric</td>
<td>Global</td>
</tr>
<tr>
<th><code>innodb_max_dirty_pages_pct_lwm</code></th>
<td>Numeric</td>
<td>Global</td>
</tr>
<tr>
<th><code>innodb_max_purge_lag</code></th>
<td>Integer</td>
<td>Global</td>
</tr>
<tr>
<th><code>innodb_max_purge_lag_delay</code></th>
<td>Integer</td>
<td>Global</td>
</tr>
<tr>
<th><code>innodb_max_undo_log_size</code></th>
<td>Integer</td>
<td>Global</td>
</tr>
<tr>
<th><code>innodb_merge_threshold_set_all_debug</code></th>
<td>Integer</td>
<td>Global</td>
</tr>
<tr>
<th><code>innodb_monitor_disable</code></th>
<td>String</td>
<td>Global</td>
</tr>
<tr>
<th><code>innodb_monitor_enable</code></th>
<td>String</td>
<td>Global</td>
</tr>
<tr>
<th><code>innodb_monitor_reset</code></th>
<td>Enumeration</td>
<td>Global</td>
</tr>
<tr>
<th><code>innodb_monitor_reset_all</code></th>
<td>Enumeration</td>
<td>Global</td>
</tr>
<tr>
<th><code>innodb_old_blocks_pct</code></th>
<td>Integer</td>
<td>Global</td>
</tr>
<tr>
<th><code>innodb_old_blocks_time</code></th>
<td>Integer</td>
<td>Global</td>
</tr>
<tr>
<th><code>innodb_online_alter_log_max_size</code></th>
<td>Integer</td>
<td>Global</td>
</tr>
<tr>
<th><code>innodb_optimize_fulltext_only</code></th>
<td>Boolean</td>
<td>Global</td>
</tr>
<tr>
<th><code>innodb_print_all_deadlocks</code></th>
<td>Boolean</td>
<td>Global</td>
</tr>
<tr>
<th><code>innodb_purge_batch_size</code></th>
<td>Integer</td>
<td>Global</td>
</tr>
<tr>
<th><code>innodb_purge_rseg_truncate_frequency</code></th>
<td>Integer</td>
<td>Global</td>
</tr>
<tr>
<th><code>innodb_random_read_ahead</code></th>
<td>Boolean</td>
<td>Global</td>
</tr>
<tr>
<th><code>innodb_read_ahead_threshold</code></th>
<td>Integer</td>
<td>Global</td>
</tr>
<tr>
<th><code>innodb_replication_delay</code></th>
<td>Integer</td>
<td>Global</td>
</tr>
<tr>
<th><code>innodb_rollback_segments</code></th>
<td>Integer</td>
<td>Global</td>
</tr>
<tr>
<th><code>innodb_saved_page_number_debug</code></th>
<td>Integer</td>
<td>Global</td>
</tr>
<tr>
<th><code>innodb_spin_wait_delay</code></th>
<td>Integer</td>
<td>Global</td>
</tr>
<tr>
<th><code>innodb_stats_auto_recalc</code></th>
<td>Boolean</td>
<td>Global</td>
</tr>
<tr>
<th><code>innodb_stats_include_delete_marked</code></th>
<td>Boolean</td>
<td>Global</td>
</tr>
<tr>
<th><code>innodb_stats_method</code></th>
<td>Enumeration</td>
<td>Global</td>
</tr>
<tr>
<th><code>innodb_stats_on_metadata</code></th>
<td>Boolean</td>
<td>Global</td>
</tr>
<tr>
<th><code>innodb_stats_persistent</code></th>
<td>Boolean</td>
<td>Global</td>
</tr>
<tr>
<th><code>innodb_stats_persistent_sample_pages</code></th>
<td>Integer</td>
<td>Global</td>
</tr>
<tr>
<th><code>innodb_stats_sample_pages</code></th>
<td>Integer</td>
<td>Global</td>
</tr>
<tr>
<th><code>innodb_stats_transient_sample_pages</code></th>
<td>Integer</td>
<td>Global</td>
</tr>
<tr>
<th><code>innodb_status_output</code></th>
<td>Boolean</td>
<td>Global</td>
</tr>
<tr>
<th><code>innodb_status_output_locks</code></th>
<td>Boolean</td>
<td>Global</td>
</tr>
<tr>
<th><code>innodb_strict_mode</code></th>
<td>Boolean</td>
<td>Both</td>
</tr>
<tr>
<th><code>innodb_support_xa</code></th>
<td>Boolean</td>
<td>Both</td>
</tr>
<tr>
<th><code>innodb_sync_spin_loops</code></th>
<td>Integer</td>
<td>Global</td>
</tr>
<tr>
<th><code>innodb_table_locks</code></th>
<td>Boolean</td>
<td>Both</td>
</tr>
<tr>
<th><code>innodb_thread_concurrency</code></th>
<td>Integer</td>
<td>Global</td>
</tr>
<tr>
<th><code>innodb_thread_sleep_delay</code></th>
<td>Integer</td>
<td>Global</td>
</tr>
<tr>
<th><code>innodb_tmpdir</code></th>
<td>Directory name</td>
<td>Both</td>
</tr>
<tr>
<th><code>innodb_trx_purge_view_update_only_debug</code></th>
<td>Boolean</td>
<td>Global</td>
</tr>
<tr>
<th><code>innodb_trx_rseg_n_slots_debug</code></th>
<td>Integer</td>
<td>Global</td>
</tr>
<tr>
<th><code>innodb_undo_log_truncate</code></th>
<td>Boolean</td>
<td>Global</td>
</tr>
<tr>
<th><code>innodb_undo_logs</code></th>
<td>Integer</td>
<td>Global</td>
</tr>
<tr>
<th><code>insert_id</code></th>
<td>Integer</td>
<td>Session</td>
</tr>
<tr>
<th><code>interactive_timeout</code></th>
<td>Integer</td>
<td>Both</td>
</tr>
<tr>
<th><code>internal_tmp_disk_storage_engine</code></th>
<td>Enumeration</td>
<td>Global</td>
</tr>
<tr>
<th><code>join_buffer_size</code></th>
<td>Integer</td>
<td>Both</td>
</tr>
<tr>
<th><code>keep_files_on_create</code></th>
<td>Boolean</td>
<td>Both</td>
</tr>
<tr>
<th><code>key_buffer_size</code></th>
<td>Integer</td>
<td>Global</td>
</tr>
<tr>
<th><code>key_cache_age_threshold</code></th>
<td>Integer</td>
<td>Global</td>
</tr>
<tr>
<th><code>key_cache_block_size</code></th>
<td>Integer</td>
<td>Global</td>
</tr>
<tr>
<th><code>key_cache_division_limit</code></th>
<td>Integer</td>
<td>Global</td>
</tr>
<tr>
<th><code>keyring_aws_cmk_id</code></th>
<td>String</td>
<td>Global</td>
</tr>
<tr>
<th><code>keyring_aws_region</code></th>
<td>Enumeration</td>
<td>Global</td>
</tr>
<tr>
<th><code>keyring_encrypted_file_data</code></th>
<td>File name</td>
<td>Global</td>
</tr>
<tr>
<th><code>keyring_encrypted_file_password</code></th>
<td>String</td>
<td>Global</td>
</tr>
<tr>
<th><code>keyring_file_data</code></th>
<td>File name</td>
<td>Global</td>
</tr>
<tr>
<th><code>keyring_okv_conf_dir</code></th>
<td>Directory name</td>
<td>Global</td>
</tr>
<tr>
<th><code>keyring_operations</code></th>
<td>Boolean</td>
<td>Global</td>
</tr>
<tr>
<th><code>last_insert_id</code></th>
<td>Integer</td>
<td>Session</td>
</tr>
<tr>
<th><code>lc_messages</code></th>
<td>String</td>
<td>Both</td>
</tr>
<tr>
<th><code>lc_time_names</code></th>
<td>String</td>
<td>Both</td>
</tr>
<tr>
<th><code>local_infile</code></th>
<td>Boolean</td>
<td>Global</td>
</tr>
<tr>
<th><code>lock_wait_timeout</code></th>
<td>Integer</td>
<td>Both</td>
</tr>
<tr>
<th><code>log_bin_trust_function_creators</code></th>
<td>Boolean</td>
<td>Global</td>
</tr>
<tr>
<th><code>log_bin_use_v1_row_events</code></th>
<td>Boolean</td>
<td>Global</td>
</tr>
<tr>
<th><code>log_builtin_as_identified_by_password</code></th>
<td>Boolean</td>
<td>Global</td>
</tr>
<tr>
<th><code>log_error_verbosity</code></th>
<td>Integer</td>
<td>Global</td>
</tr>
<tr>
<th><code>log_output</code></th>
<td>Set</td>
<td>Global</td>
</tr>
<tr>
<th><code>log_queries_not_using_indexes</code></th>
<td>Boolean</td>
<td>Global</td>
</tr>
<tr>
<th><code>log_slow_admin_statements</code></th>
<td>Boolean</td>
<td>Global</td>
</tr>
<tr>
<th><code>log_slow_slave_statements</code></th>
<td>Boolean</td>
<td>Global</td>
</tr>
<tr>
<th><code>log_statements_unsafe_for_binlog</code></th>
<td>Boolean</td>
<td>Global</td>
</tr>
<tr>
<th><code>log_syslog</code></th>
<td>Boolean</td>
<td>Global</td>
</tr>
<tr>
<th><code>log_syslog_facility</code></th>
<td>String</td>
<td>Global</td>
</tr>
<tr>
<th><code>log_syslog_include_pid</code></th>
<td>Boolean</td>
<td>Global</td>
</tr>
<tr>
<th><code>log_syslog_tag</code></th>
<td>String</td>
<td>Global</td>
</tr>
<tr>
<th><code>log_throttle_queries_not_using_indexes</code></th>
<td>Integer</td>
<td>Global</td>
</tr>
<tr>
<th><code>log_timestamps</code></th>
<td>Enumeration</td>
<td>Global</td>
</tr>
<tr>
<th><code>log_warnings</code></th>
<td>Integer</td>
<td>Global</td>
</tr>
<tr>
<th><code>long_query_time</code></th>
<td>Numeric</td>
<td>Both</td>
</tr>
<tr>
<th><code>low_priority_updates</code></th>
<td>Boolean</td>
<td>Both</td>
</tr>
<tr>
<th><code>master_info_repository</code></th>
<td>String</td>
<td>Global</td>
</tr>
<tr>
<th><code>master_verify_checksum</code></th>
<td>Boolean</td>
<td>Global</td>
</tr>
<tr>
<th><code>max_allowed_packet</code></th>
<td>Integer</td>
<td>Both</td>
</tr>
<tr>
<th><code>max_binlog_cache_size</code></th>
<td>Integer</td>
<td>Global</td>
</tr>
<tr>
<th><code>max_binlog_size</code></th>
<td>Integer</td>
<td>Global</td>
</tr>
<tr>
<th><code>max_binlog_stmt_cache_size</code></th>
<td>Integer</td>
<td>Global</td>
</tr>
<tr>
<th><code>max_connect_errors</code></th>
<td>Integer</td>
<td>Global</td>
</tr>
<tr>
<th><code>max_connections</code></th>
<td>Integer</td>
<td>Global</td>
</tr>
<tr>
<th><code>max_delayed_threads</code></th>
<td>Integer</td>
<td>Both</td>
</tr>
<tr>
<th><code>max_error_count</code></th>
<td>Integer</td>
<td>Both</td>
</tr>
<tr>
<th><code>max_execution_time</code></th>
<td>Integer</td>
<td>Both</td>
</tr>
<tr>
<th><code>max_heap_table_size</code></th>
<td>Integer</td>
<td>Both</td>
</tr>
<tr>
<th><code>max_insert_delayed_threads</code></th>
<td>Integer</td>
<td>Both</td>
</tr>
<tr>
<th><code>max_join_size</code></th>
<td>Integer</td>
<td>Both</td>
</tr>
<tr>
<th><code>max_length_for_sort_data</code></th>
<td>Integer</td>
<td>Both</td>
</tr>
<tr>
<th><code>max_points_in_geometry</code></th>
<td>Integer</td>
<td>Both</td>
</tr>
<tr>
<th><code>max_prepared_stmt_count</code></th>
<td>Integer</td>
<td>Global</td>
</tr>
<tr>
<th><code>max_relay_log_size</code></th>
<td>Integer</td>
<td>Global</td>
</tr>
<tr>
<th><code>max_seeks_for_key</code></th>
<td>Integer</td>
<td>Both</td>
</tr>
<tr>
<th><code>max_sort_length</code></th>
<td>Integer</td>
<td>Both</td>
</tr>
<tr>
<th><code>max_sp_recursion_depth</code></th>
<td>Integer</td>
<td>Both</td>
</tr>
<tr>
<th><code>max_tmp_tables</code></th>
<td>Integer</td>
<td>Both</td>
</tr>
<tr>
<th><code>max_user_connections</code></th>
<td>Integer</td>
<td>Both</td>
</tr>
<tr>
<th><code>max_write_lock_count</code></th>
<td>Integer</td>
<td>Global</td>
</tr>
<tr>
<th><code>min_examined_row_limit</code></th>
<td>Integer</td>
<td>Both</td>
</tr>
<tr>
<th><code>multi_range_count</code></th>
<td>Integer</td>
<td>Both</td>
</tr>
<tr>
<th><code>myisam_data_pointer_size</code></th>
<td>Integer</td>
<td>Global</td>
</tr>
<tr>
<th><code>myisam_max_sort_file_size</code></th>
<td>Integer</td>
<td>Global</td>
</tr>
<tr>
<th><code>myisam_repair_threads</code></th>
<td>Integer</td>
<td>Both</td>
</tr>
<tr>
<th><code>myisam_sort_buffer_size</code></th>
<td>Integer</td>
<td>Both</td>
</tr>
<tr>
<th><code>myisam_stats_method</code></th>
<td>Enumeration</td>
<td>Both</td>
</tr>
<tr>
<th><code>myisam_use_mmap</code></th>
<td>Boolean</td>
<td>Global</td>
</tr>
<tr>
<th><code>mysql_firewall_mode</code></th>
<td>Boolean</td>
<td>Global</td>
</tr>
<tr>
<th><code>mysql_firewall_trace</code></th>
<td>Boolean</td>
<td>Global</td>
</tr>
<tr>
<th><code>mysql_native_password_proxy_users</code></th>
<td>Boolean</td>
<td>Global</td>
</tr>
<tr>
<th><code>mysqlx_connect_timeout</code></th>
<td>Integer</td>
<td>Global</td>
</tr>
<tr>
<th><code>mysqlx_idle_worker_thread_timeout</code></th>
<td>Integer</td>
<td>Global</td>
</tr>
<tr>
<th><code>mysqlx_max_allowed_packet</code></th>
<td>Integer</td>
<td>Global</td>
</tr>
<tr>
<th><code>mysqlx_max_connections</code></th>
<td>Integer</td>
<td>Global</td>
</tr>
<tr>
<th><code>mysqlx_min_worker_threads</code></th>
<td>Integer</td>
<td>Global</td>
</tr>
<tr>
<th><code>ndb_allow_copying_alter_table</code></th>
<td>Boolean</td>
<td>Both</td>
</tr>
<tr>
<th><code>ndb_autoincrement_prefetch_sz</code></th>
<td>Integer</td>
<td>Both</td>
</tr>
<tr>
<th><code>ndb_batch_size</code></th>
<td>Integer</td>
<td>Both</td>
</tr>
<tr>
<th><code>ndb_blob_read_batch_bytes</code></th>
<td>Integer</td>
<td>Both</td>
</tr>
<tr>
<th><code>ndb_blob_write_batch_bytes</code></th>
<td>Integer</td>
<td>Both</td>
</tr>
<tr>
<th><code>ndb_cache_check_time</code></th>
<td>Integer</td>
<td>Global</td>
</tr>
<tr>
<th><code>ndb_clear_apply_status</code></th>
<td>Boolean</td>
<td>Global</td>
</tr>
<tr>
<th><code>ndb_data_node_neighbour</code></th>
<td>Integer</td>
<td>Global</td>
</tr>
<tr>
<th><code>ndb_default_column_format</code></th>
<td>Enumeration</td>
<td>Global</td>
</tr>
<tr>
<th><code>ndb_default_column_format</code></th>
<td>Enumeration</td>
<td>Global</td>
</tr>
<tr>
<th><code>ndb_deferred_constraints</code></th>
<td>Integer</td>
<td>Both</td>
</tr>
<tr>
<th><code>ndb_deferred_constraints</code></th>
<td>Integer</td>
<td>Both</td>
</tr>
<tr>
<th><code>ndb_distribution</code></th>
<td>Enumeration</td>
<td>Global</td>
</tr>
<tr>
<th><code>ndb_distribution</code></th>
<td>Enumeration</td>
<td>Global</td>
</tr>
<tr>
<th><code>ndb_eventbuffer_free_percent</code></th>
<td>Integer</td>
<td>Global</td>
</tr>
<tr>
<th><code>ndb_eventbuffer_max_alloc</code></th>
<td>Integer</td>
<td>Global</td>
</tr>
<tr>
<th><code>ndb_extra_logging</code></th>
<td>Integer</td>
<td>Global</td>
</tr>
<tr>
<th><code>ndb_force_send</code></th>
<td>Boolean</td>
<td>Both</td>
</tr>
<tr>
<th><code>ndb_fully_replicated</code></th>
<td>Boolean</td>
<td>Both</td>
</tr>
<tr>
<th><code>ndb_index_stat_enable</code></th>
<td>Boolean</td>
<td>Both</td>
</tr>
<tr>
<th><code>ndb_index_stat_option</code></th>
<td>String</td>
<td>Both</td>
</tr>
<tr>
<th><code>ndb_join_pushdown</code></th>
<td>Boolean</td>
<td>Both</td>
</tr>
<tr>
<th><code>ndb_log_binlog_index</code></th>
<td>Boolean</td>
<td>Global</td>
</tr>
<tr>
<th><code>ndb_log_empty_epochs</code></th>
<td>Boolean</td>
<td>Global</td>
</tr>
<tr>
<th><code>ndb_log_empty_epochs</code></th>
<td>Boolean</td>
<td>Global</td>
</tr>
<tr>
<th><code>ndb_log_empty_update</code></th>
<td>Boolean</td>
<td>Global</td>
</tr>
<tr>
<th><code>ndb_log_empty_update</code></th>
<td>Boolean</td>
<td>Global</td>
</tr>
<tr>
<th><code>ndb_log_exclusive_reads</code></th>
<td>Boolean</td>
<td>Both</td>
</tr>
<tr>
<th><code>ndb_log_exclusive_reads</code></th>
<td>Boolean</td>
<td>Both</td>
</tr>
<tr>
<th><code>ndb_log_update_as_write</code></th>
<td>Boolean</td>
<td>Global</td>
</tr>
<tr>
<th><code>ndb_log_update_minimal</code></th>
<td>Boolean</td>
<td>Global</td>
</tr>
<tr>
<th><code>ndb_log_updated_only</code></th>
<td>Boolean</td>
<td>Global</td>
</tr>
<tr>
<th><code>ndb_optimization_delay</code></th>
<td>Integer</td>
<td>Global</td>
</tr>
<tr>
<th><code>ndb_optimized_node_selection</code></th>
<td>Integer</td>
<td>Global</td>
</tr>
<tr>
<th><code>ndb_read_backup</code></th>
<td>Boolean</td>
<td>Global</td>
</tr>
<tr>
<th><code>ndb_recv_thread_activation_threshold</code></th>
<td>Integer</td>
<td>Global</td>
</tr>
<tr>
<th><code>ndb_recv_thread_cpu_mask</code></th>
<td>Bitmap</td>
<td>Global</td>
</tr>
<tr>
<th><code>ndb_report_thresh_binlog_epoch_slip</code></th>
<td>Integer</td>
<td>Global</td>
</tr>
<tr>
<th><code>ndb_report_thresh_binlog_mem_usage</code></th>
<td>Integer</td>
<td>Global</td>
</tr>
<tr>
<th><code>ndb_row_checksum</code></th>
<td>Integer</td>
<td>Both</td>
</tr>
<tr>
<th><code>ndb_show_foreign_key_mock_tables</code></th>
<td>Boolean</td>
<td>Global</td>
</tr>
<tr>
<th><code>ndb_slave_conflict_role</code></th>
<td>Enumeration</td>
<td>Global</td>
</tr>
<tr>
<th><code>ndb_table_no_logging</code></th>
<td>Boolean</td>
<td>Session</td>
</tr>
<tr>
<th><code>ndb_table_temporary</code></th>
<td>Boolean</td>
<td>Session</td>
</tr>
<tr>
<th><code>ndb_use_exact_count</code></th>
<td>Boolean</td>
<td>Both</td>
</tr>
<tr>
<th><code>ndb_use_transactions</code></th>
<td>Boolean</td>
<td>Both</td>
</tr>
<tr>
<th><code>ndbinfo_max_bytes</code></th>
<td>Integer</td>
<td>Both</td>
</tr>
<tr>
<th><code>ndbinfo_max_rows</code></th>
<td>Integer</td>
<td>Both</td>
</tr>
<tr>
<th><code>ndbinfo_offline</code></th>
<td>Boolean</td>
<td>Global</td>
</tr>
<tr>
<th><code>ndbinfo_show_hidden</code></th>
<td>Boolean</td>
<td>Both</td>
</tr>
<tr>
<th><code>net_buffer_length</code></th>
<td>Integer</td>
<td>Both</td>
</tr>
<tr>
<th><code>net_read_timeout</code></th>
<td>Integer</td>
<td>Both</td>
</tr>
<tr>
<th><code>net_retry_count</code></th>
<td>Integer</td>
<td>Both</td>
</tr>
<tr>
<th><code>net_write_timeout</code></th>
<td>Integer</td>
<td>Both</td>
</tr>
<tr>
<th><code>new</code></th>
<td>Boolean</td>
<td>Both</td>
</tr>
<tr>
<th><code>offline_mode</code></th>
<td>Boolean</td>
<td>Global</td>
</tr>
<tr>
<th><code>old_alter_table</code></th>
<td>Boolean</td>
<td>Both</td>
</tr>
<tr>
<th><code>old_passwords</code></th>
<td>Enumeration</td>
<td>Both</td>
</tr>
<tr>
<th><code>optimizer_prune_level</code></th>
<td>Integer</td>
<td>Both</td>
</tr>
<tr>
<th><code>optimizer_search_depth</code></th>
<td>Integer</td>
<td>Both</td>
</tr>
<tr>
<th><code>optimizer_switch</code></th>
<td>Set</td>
<td>Both</td>
</tr>
<tr>
<th><code>optimizer_trace</code></th>
<td>String</td>
<td>Both</td>
</tr>
<tr>
<th><code>optimizer_trace_features</code></th>
<td>String</td>
<td>Both</td>
</tr>
<tr>
<th><code>optimizer_trace_limit</code></th>
<td>Integer</td>
<td>Both</td>
</tr>
<tr>
<th><code>optimizer_trace_max_mem_size</code></th>
<td>Integer</td>
<td>Both</td>
</tr>
<tr>
<th><code>optimizer_trace_offset</code></th>
<td>Integer</td>
<td>Both</td>
</tr>
<tr>
<th><code>parser_max_mem_size</code></th>
<td>Integer</td>
<td>Both</td>
</tr>
<tr>
<th><code>performance_schema_show_processlist</code></th>
<td>Boolean</td>
<td>Global</td>
</tr>
<tr>
<th><code>preload_buffer_size</code></th>
<td>Integer</td>
<td>Both</td>
</tr>
<tr>
<th><code>profiling</code></th>
<td>Boolean</td>
<td>Both</td>
</tr>
<tr>
<th><code>profiling_history_size</code></th>
<td>Integer</td>
<td>Both</td>
</tr>
<tr>
<th><code>pseudo_slave_mode</code></th>
<td>Boolean</td>
<td>Session</td>
</tr>
<tr>
<th><code>pseudo_thread_id</code></th>
<td>Integer</td>
<td>Session</td>
</tr>
<tr>
<th><code>query_alloc_block_size</code></th>
<td>Integer</td>
<td>Both</td>
</tr>
<tr>
<th><code>query_cache_limit</code></th>
<td>Integer</td>
<td>Global</td>
</tr>
<tr>
<th><code>query_cache_min_res_unit</code></th>
<td>Integer</td>
<td>Global</td>
</tr>
<tr>
<th><code>query_cache_size</code></th>
<td>Integer</td>
<td>Global</td>
</tr>
<tr>
<th><code>query_cache_type</code></th>
<td>Enumeration</td>
<td>Both</td>
</tr>
<tr>
<th><code>query_cache_wlock_invalidate</code></th>
<td>Boolean</td>
<td>Both</td>
</tr>
<tr>
<th><code>query_prealloc_size</code></th>
<td>Integer</td>
<td>Both</td>
</tr>
<tr>
<th><code>rand_seed1</code></th>
<td>Integer</td>
<td>Session</td>
</tr>
<tr>
<th><code>rand_seed2</code></th>
<td>Integer</td>
<td>Session</td>
</tr>
<tr>
<th><code>range_alloc_block_size</code></th>
<td>Integer</td>
<td>Both</td>
</tr>
<tr>
<th><code>range_optimizer_max_mem_size</code></th>
<td>Integer</td>
<td>Both</td>
</tr>
<tr>
<th><code>rbr_exec_mode</code></th>
<td>Enumeration</td>
<td>Session</td>
</tr>
<tr>
<th><code>read_buffer_size</code></th>
<td>Integer</td>
<td>Both</td>
</tr>
<tr>
<th><code>read_only</code></th>
<td>Boolean</td>
<td>Global</td>
</tr>
<tr>
<th><code>read_rnd_buffer_size</code></th>
<td>Integer</td>
<td>Both</td>
</tr>
<tr>
<th><code>relay_log_info_repository</code></th>
<td>String</td>
<td>Global</td>
</tr>
<tr>
<th><code>relay_log_purge</code></th>
<td>Boolean</td>
<td>Global</td>
</tr>
<tr>
<th><code>replication_optimize_for_static_plugin_config</code></th>
<td>Boolean</td>
<td>Global</td>
</tr>
<tr>
<th><code>replication_sender_observe_commit_only</code></th>
<td>Boolean</td>
<td>Global</td>
</tr>
<tr>
<th><code>require_secure_transport</code></th>
<td>Boolean</td>
<td>Global</td>
</tr>
<tr>
<th><code>rewriter_enabled</code></th>
<td>Boolean</td>
<td>Global</td>
</tr>
<tr>
<th><code>rewriter_verbose</code></th>
<td>Integer</td>
<td>Global</td>
</tr>
<tr>
<th><code>rpl_semi_sync_master_enabled</code></th>
<td>Boolean</td>
<td>Global</td>
</tr>
<tr>
<th><code>rpl_semi_sync_master_timeout</code></th>
<td>Integer</td>
<td>Global</td>
</tr>
<tr>
<th><code>rpl_semi_sync_master_trace_level</code></th>
<td>Integer</td>
<td>Global</td>
</tr>
<tr>
<th><code>rpl_semi_sync_master_wait_for_slave_count</code></th>
<td>Integer</td>
<td>Global</td>
</tr>
<tr>
<th><code>rpl_semi_sync_master_wait_no_slave</code></th>
<td>Boolean</td>
<td>Global</td>
</tr>
<tr>
<th><code>rpl_semi_sync_master_wait_point</code></th>
<td>Enumeration</td>
<td>Global</td>
</tr>
<tr>
<th><code>rpl_semi_sync_slave_enabled</code></th>
<td>Boolean</td>
<td>Global</td>
</tr>
<tr>
<th><code>rpl_semi_sync_slave_trace_level</code></th>
<td>Integer</td>
<td>Global</td>
</tr>
<tr>
<th><code>rpl_stop_slave_timeout</code></th>
<td>Integer</td>
<td>Global</td>
</tr>
<tr>
<th><code>secure_auth</code></th>
<td>Boolean</td>
<td>Global</td>
</tr>
<tr>
<th><code>server_id</code></th>
<td>Integer</td>
<td>Global</td>
</tr>
<tr>
<th><code>session_track_gtids</code></th>
<td>Enumeration</td>
<td>Both</td>
</tr>
<tr>
<th><code>session_track_schema</code></th>
<td>Boolean</td>
<td>Both</td>
</tr>
<tr>
<th><code>session_track_state_change</code></th>
<td>Boolean</td>
<td>Both</td>
</tr>
<tr>
<th><code>session_track_system_variables</code></th>
<td>String</td>
<td>Both</td>
</tr>
<tr>
<th><code>session_track_transaction_info</code></th>
<td>Enumeration</td>
<td>Both</td>
</tr>
<tr>
<th><code>sha256_password_proxy_users</code></th>
<td>Boolean</td>
<td>Global</td>
</tr>
<tr>
<th><code>show_compatibility_56</code></th>
<td>Boolean</td>
<td>Global</td>
</tr>
<tr>
<th><code>show_create_table_verbosity</code></th>
<td>Boolean</td>
<td>Both</td>
</tr>
<tr>
<th><code>show_old_temporals</code></th>
<td>Boolean</td>
<td>Both</td>
</tr>
<tr>
<th><code>slave_allow_batching</code></th>
<td>Boolean</td>
<td>Global</td>
</tr>
<tr>
<th><code>slave_checkpoint_group</code></th>
<td>Integer</td>
<td>Global</td>
</tr>
<tr>
<th><code>slave_checkpoint_period</code></th>
<td>Integer</td>
<td>Global</td>
</tr>
<tr>
<th><code>slave_compressed_protocol</code></th>
<td>Boolean</td>
<td>Global</td>
</tr>
<tr>
<th><code>slave_exec_mode</code></th>
<td>Enumeration</td>
<td>Global</td>
</tr>
<tr>
<th><code>slave_max_allowed_packet</code></th>
<td>Integer</td>
<td>Global</td>
</tr>
<tr>
<th><code>slave_net_timeout</code></th>
<td>Integer</td>
<td>Global</td>
</tr>
<tr>
<th><code>slave_parallel_type</code></th>
<td>Enumeration</td>
<td>Global</td>
</tr>
<tr>
<th><code>slave_parallel_workers</code></th>
<td>Integer</td>
<td>Global</td>
</tr>
<tr>
<th><code>slave_pending_jobs_size_max</code></th>
<td>Integer</td>
<td>Global</td>
</tr>
<tr>
<th><code>slave_preserve_commit_order</code></th>
<td>Boolean</td>
<td>Global</td>
</tr>
<tr>
<th><code>slave_rows_search_algorithms</code></th>
<td>Set</td>
<td>Global</td>
</tr>
<tr>
<th><code>slave_sql_verify_checksum</code></th>
<td>Boolean</td>
<td>Global</td>
</tr>
<tr>
<th><code>slave_transaction_retries</code></th>
<td>Integer</td>
<td>Global</td>
</tr>
<tr>
<th><code>slave_type_conversions</code></th>
<td>Set</td>
<td>Global</td>
</tr>
<tr>
<th><code>slow_launch_time</code></th>
<td>Integer</td>
<td>Global</td>
</tr>
<tr>
<th><code>slow_query_log</code></th>
<td>Boolean</td>
<td>Global</td>
</tr>
<tr>
<th><code>slow_query_log_file</code></th>
<td>File name</td>
<td>Global</td>
</tr>
<tr>
<th><code>sort_buffer_size</code></th>
<td>Integer</td>
<td>Both</td>
</tr>
<tr>
<th><code>sql_auto_is_null</code></th>
<td>Boolean</td>
<td>Both</td>
</tr>
<tr>
<th><code>sql_big_selects</code></th>
<td>Boolean</td>
<td>Both</td>
</tr>
<tr>
<th><code>sql_buffer_result</code></th>
<td>Boolean</td>
<td>Both</td>
</tr>
<tr>
<th><code>sql_log_bin</code></th>
<td>Boolean</td>
<td>Session</td>
</tr>
<tr>
<th><code>sql_log_off</code></th>
<td>Boolean</td>
<td>Both</td>
</tr>
<tr>
<th><code>sql_mode</code></th>
<td>Set</td>
<td>Both</td>
</tr>
<tr>
<th><code>sql_notes</code></th>
<td>Boolean</td>
<td>Both</td>
</tr>
<tr>
<th><code>sql_quote_show_create</code></th>
<td>Boolean</td>
<td>Both</td>
</tr>
<tr>
<th><code>sql_safe_updates</code></th>
<td>Boolean</td>
<td>Both</td>
</tr>
<tr>
<th><code>sql_select_limit</code></th>
<td>Integer</td>
<td>Both</td>
</tr>
<tr>
<th><code>sql_slave_skip_counter</code></th>
<td>Integer</td>
<td>Global</td>
</tr>
<tr>
<th><code>sql_warnings</code></th>
<td>Boolean</td>
<td>Both</td>
</tr>
<tr>
<th><code>stored_program_cache</code></th>
<td>Integer</td>
<td>Global</td>
</tr>
<tr>
<th><code>super_read_only</code></th>
<td>Boolean</td>
<td>Global</td>
</tr>
<tr>
<th><code>sync_binlog</code></th>
<td>Integer</td>
<td>Global</td>
</tr>
<tr>
<th><code>sync_frm</code></th>
<td>Boolean</td>
<td>Global</td>
</tr>
<tr>
<th><code>sync_master_info</code></th>
<td>Integer</td>
<td>Global</td>
</tr>
<tr>
<th><code>sync_relay_log</code></th>
<td>Integer</td>
<td>Global</td>
</tr>
<tr>
<th><code>sync_relay_log_info</code></th>
<td>Integer</td>
<td>Global</td>
</tr>
<tr>
<th><code>table_definition_cache</code></th>
<td>Integer</td>
<td>Global</td>
</tr>
<tr>
<th><code>table_open_cache</code></th>
<td>Integer</td>
<td>Global</td>
</tr>
<tr>
<th><code>thread_cache_size</code></th>
<td>Integer</td>
<td>Global</td>
</tr>
<tr>
<th><code>thread_pool_high_priority_connection</code></th>
<td>Integer</td>
<td>Both</td>
</tr>
<tr>
<th><code>thread_pool_max_unused_threads</code></th>
<td></td>
<td>Global</td>
</tr>
<tr>
<th><code>thread_pool_prio_kickup_timer</code></th>
<td></td>
<td>Global</td>
</tr>
<tr>
<th><code>thread_pool_stall_limit</code></th>
<td>Integer</td>
<td>Global</td>
</tr>
<tr>
<th><code>time_zone</code></th>
<td>String</td>
<td>Both</td>
</tr>
<tr>
<th><code>timestamp</code></th>
<td>Numeric</td>
<td>Session</td>
</tr>
<tr>
<th><code>tmp_table_size</code></th>
<td>Integer</td>
<td>Both</td>
</tr>
<tr>
<th><code>transaction_alloc_block_size</code></th>
<td>Integer</td>
<td>Both</td>
</tr>
<tr>
<th><code>transaction_allow_batching</code></th>
<td>Boolean</td>
<td>Session</td>
</tr>
<tr>
<th><code>transaction_isolation</code></th>
<td>Enumeration</td>
<td>Both</td>
</tr>
<tr>
<th><code>transaction_prealloc_size</code></th>
<td>Integer</td>
<td>Both</td>
</tr>
<tr>
<th><code>transaction_read_only</code></th>
<td>Boolean</td>
<td>Both</td>
</tr>
<tr>
<th><code>transaction_write_set_extraction</code></th>
<td>Enumeration</td>
<td>Both</td>
</tr>
<tr>
<th><code>tx_isolation</code></th>
<td>Enumeration</td>
<td>Both</td>
</tr>
<tr>
<th><code>tx_read_only</code></th>
<td>Boolean</td>
<td>Both</td>
</tr>
<tr>
<th><code>unique_checks</code></th>
<td>Boolean</td>
<td>Both</td>
</tr>
<tr>
<th><code>updatable_views_with_limit</code></th>
<td>Boolean</td>
<td>Both</td>
</tr>
<tr>
<th><code>validate_password_check_user_name</code></th>
<td>Boolean</td>
<td>Global</td>
</tr>
<tr>
<th><code>validate_password_dictionary_file</code></th>
<td>File name</td>
<td>Global</td>
</tr>
<tr>
<th><code>validate_password_length</code></th>
<td>Integer</td>
<td>Global</td>
</tr>
<tr>
<th><code>validate_password_mixed_case_count</code></th>
<td>Integer</td>
<td>Global</td>
</tr>
<tr>
<th><code>validate_password_number_count</code></th>
<td>Integer</td>
<td>Global</td>
</tr>
<tr>
<th><code>validate_password_policy</code></th>
<td>Enumeration</td>
<td>Global</td>
</tr>
<tr>
<th><code>validate_password_special_char_count</code></th>
<td>Integer</td>
<td>Global</td>
</tr>
<tr>
<th><code>version_tokens_session</code></th>
<td>String</td>
<td>Both</td>
</tr>
<tr>
<th><code>wait_timeout</code></th>
<td>Integer</td>
<td>Both</td>
</tr>
</tbody>
</table>

#### 5.1.8.3 Variáveis de sistema estruturado

Uma variável estruturada difere de uma variável de sistema regular em dois aspectos:

* Seu valor é uma estrutura com componentes que especificam parâmetros do servidor considerados intimamente relacionados.

* Pode haver vários exemplos de um tipo específico de variável estruturada. Cada um deles tem um nome diferente e se refere a um recurso diferente mantido pelo servidor.

O MySQL suporta um tipo de variável estruturada, que especifica os parâmetros que regem o funcionamento dos caches de chave. Uma variável estruturada de cache de chave tem esses componentes:

* `key_buffer_size`
* `key_cache_block_size`
* `key_cache_division_limit`
* `key_cache_age_threshold`

Esta seção descreve a sintaxe para se referir a variáveis estruturadas. As variáveis de cache chave são usadas para exemplos de sintaxe, mas detalhes específicos sobre como as caches de chave operam são encontrados em outro lugar, na Seção 8.10.2, “A Cache de Chave MyISAM”.

Para se referir a um componente de uma instância de variável estruturada, você pode usar um nome composto no formato *`instance_name.component_name`*. Exemplos:

```sql
hot_cache.key_buffer_size
hot_cache.key_cache_block_size
cold_cache.key_cache_block_size
```

Para cada variável de sistema estruturada, uma instância com o nome de `default` é sempre predefinida. Se você se referir a um componente de uma variável estruturada sem qualquer nome de instância, a instância `default` é usada. Assim, `default.key_buffer_size` e `key_buffer_size` referem-se a ambas as mesmas variáveis de sistema.

As instâncias e componentes variáveis estruturadas seguem essas regras de nomenclatura:

* Para um tipo específico de variável estruturada, cada instância deve ter um nome que seja único *dentro* das variáveis desse tipo. No entanto, os nomes das instâncias não precisam ser únicos *entre* os tipos de variáveis estruturadas. Por exemplo, cada variável estruturada tem uma instância chamada `default`, então `default` não é único entre os tipos de variáveis.

* Os nomes dos componentes de cada tipo de variável estruturada devem ser únicos em todos os nomes de variáveis do sistema. Se isso não fosse verdade (ou seja, se dois tipos diferentes de variáveis estruturadas pudessem compartilhar nomes de membros de componentes), não seria claro qual variável estruturada padrão usar para referências a nomes de membros que não são qualificados por um nome de instância.

* Se o nome de uma instância de variável estruturada não for legal como um identificador não citado, refira-o como um identificador citado usando barras. Por exemplo, `hot-cache` não é legal, mas `` `hot-cache` `` é.

* `global`, `session` e `local` não são nomes de instâncias legais. Isso evita um conflito com notações como `@@GLOBAL.var_name` para referência a variáveis de sistema não estruturadas.

Atualmente, as duas primeiras regras não têm possibilidade de serem violadas, pois o único tipo de variável estruturada é o destinado a caches de chave. Essas regras podem assumir maior importância se algum outro tipo de variável estruturada for criado no futuro.

Com uma exceção, você pode se referir a componentes de variáveis estruturadas usando nomes compostos em qualquer contexto onde nomes de variáveis simples podem ocorrer. Por exemplo, você pode atribuir um valor a uma variável estruturada usando uma opção de string de comando:

```sql
$> mysqld --hot_cache.key_buffer_size=64K
```

Em um arquivo de opção, use a seguinte sintaxe:

```sql
[mysqld]
hot_cache.key_buffer_size=64K
```

Se você iniciar o servidor com essa opção, ele cria um cache de chave chamado `hot_cache` com um tamanho de 64 KB, além do cache de chave padrão que tem um tamanho padrão de 8 MB.

Suponha que você comece o servidor da seguinte forma:

```sql
$> mysqld --key_buffer_size=256K \
         --extra_cache.key_buffer_size=128K \
         --extra_cache.key_cache_block_size=2048
```

Neste caso, o servidor define o tamanho do cache de chave padrão em 256 KB. (Você também poderia ter escrito `--default.key_buffer_size=256K`. Além disso, o servidor cria um segundo cache de chave chamado `extra_cache` que tem um tamanho de 128 KB, com o tamanho dos buffers de bloco para cache de blocos de índice de tabela definido em 2048 bytes.

O exemplo a seguir inicia o servidor com três caches de chave diferentes, com tamanhos em uma proporção de 3:1:1:

```sql
$> mysqld --key_buffer_size=6M \
         --hot_cache.key_buffer_size=2M \
         --cold_cache.key_buffer_size=2M
```

Valores variáveis estruturados também podem ser definidos e recuperados em tempo de execução. Por exemplo, para definir um cache de chave chamado `hot_cache` com um tamanho de 10 MB, use uma das seguintes declarações:

```sql
mysql> SET GLOBAL hot_cache.key_buffer_size = 10*1024*1024;
mysql> SET @@GLOBAL.hot_cache.key_buffer_size = 10*1024*1024;
```

Para recuperar o tamanho do cache, faça o seguinte:

```sql
mysql> SELECT @@GLOBAL.hot_cache.key_buffer_size;
```

No entanto, a seguinte declaração não funciona. A variável não é interpretada como um nome composto, mas como uma string simples para uma operação de correspondência de padrões `LIKE`:

```sql
mysql> SHOW GLOBAL VARIABLES LIKE 'hot_cache.key_buffer_size';
```

Essa é a exceção para poder usar nomes de variáveis estruturadas em qualquer lugar onde um nome de variável simples pode ocorrer.

### 5.1.9 Variáveis de Status do Servidor

O servidor MySQL mantém muitas variáveis de estado que fornecem informações sobre sua operação. Você pode visualizar essas variáveis e seus valores usando a declaração `SHOW [GLOBAL | SESSION] STATUS` (consulte Seção 13.7.5.35, “Declaração SHOW STATUS”). A palavra-chave opcional `GLOBAL` agrega os valores em todas as conexões, e `SESSION` mostra os valores para a conexão atual.

```sql
mysql> SHOW GLOBAL STATUS;
+-----------------------------------+------------+
| Variable_name                     | Value      |
+-----------------------------------+------------+
| Aborted_clients                   | 0          |
| Aborted_connects                  | 0          |
| Bytes_received                    | 155372598  |
| Bytes_sent                        | 1176560426 |
...
| Connections                       | 30023      |
| Created_tmp_disk_tables           | 0          |
| Created_tmp_files                 | 3          |
| Created_tmp_tables                | 2          |
...
| Threads_created                   | 217        |
| Threads_running                   | 88         |
| Uptime                            | 1389872    |
+-----------------------------------+------------+
```

Muitas variáveis de status são redefinidas para 0 pela declaração `FLUSH STATUS`.

Esta seção fornece uma descrição de cada variável de status. Para um resumo das variáveis de status, consulte a Seção 5.1.5, “Referência da Variável de Status do Servidor”. Para informações sobre as variáveis de status específicas do NDB Cluster, consulte a Seção 21.4.3.9.3, “Variáveis de Status do NDB Cluster”.

As variáveis de status têm os significados mostrados na lista a seguir.

* `Aborted_clients`

O número de conexões que foram interrompidas porque o cliente morreu sem fechar a conexão corretamente. Veja a Seção B.3.2.9, “Erros de comunicação e conexões interrompidas”.

* `Aborted_connects`

O número de tentativas falhadas de conexão com o servidor MySQL. Consulte a Seção B.3.2.9, “Erros de comunicação e conexões interrompidas”.

Para informações adicionais relacionadas à conexão, verifique as variáveis de status `Connection_errors_xxx` e a tabela `host_cache`.

A partir do MySQL 5.7.3, `Aborted_connects` não é visível no servidor incorporado, porque para esse servidor ele não está atualizado e não é significativo.

* `Binlog_cache_disk_use`

O número de transações que utilizaram o cache temporário de registro binário, mas que excederam o valor de `binlog_cache_size` e utilizaram um arquivo temporário para armazenar declarações da transação.

O número de declarações não transacionais que causaram a escrita do cache de transação de registro binário no disco é rastreado separadamente na variável de status `Binlog_stmt_cache_disk_use`.

* `Binlog_cache_use`

O número de transações que utilizaram o cache do log binário.

* `Binlog_stmt_cache_disk_use`

O número de declarações não transacionais que utilizaram o cache de declarações de log binário, mas que excederam o valor de `binlog_stmt_cache_size` e utilizaram um arquivo temporário para armazenar essas declarações.

* `Binlog_stmt_cache_use`

O número de declarações não transacionais que utilizaram o cache de cache de log binário.

* `Bytes_received`

O número de bytes recebidos de todos os clientes.

* `Bytes_sent`

O número de bytes enviados para todos os clientes.

* `Com_xxx`

As variáveis de contagem de declarações `Com_xxx` indicam o número de vezes que cada declaração *`xxx`* foi executada. Há uma variável de status para cada tipo de declaração. Por exemplo, `Com_delete` e `Com_update` contam as declarações `DELETE` e `UPDATE`, respectivamente. `Com_delete_multi` e `Com_update_multi` são semelhantes, mas aplicam-se às declarações `DELETE` e `UPDATE` que usam sintaxe de múltiplas tabelas.

Se um resultado de consulta for retornado do cache de consulta, o servidor incrementa a variável de status `Qcache_hits`, não `Com_select`. Veja a Seção 8.10.3.4, “Status do Cache de Consulta e Manutenção”.

Todas as variáveis `Com_stmt_xxx` são incrementadas mesmo que um argumento de declaração preparada seja desconhecido ou se houver ocorrido um erro durante a execução. Em outras palavras, seus valores correspondem ao número de solicitações emitidas, não ao número de solicitações concluídas com sucesso. Por exemplo, porque as variáveis de status são inicializadas para cada inicialização do servidor e não persistem em reinicializações, a variável `Com_shutdown` que rastreia as declarações `SHUTDOWN` normalmente tem um valor de zero, mas pode ser não nulo se as declarações `SHUTDOWN` foram executadas, mas falharam.

As variáveis de status `Com_stmt_xxx` são as seguintes:

+ `Com_stmt_prepare`
  + `Com_stmt_execute`
  + `Com_stmt_fetch`
  + `Com_stmt_send_long_data`
  + `Com_stmt_reset`
  + `Com_stmt_close`

Essas variáveis representam comandos de declaração preparada. Seus nomes se referem ao conjunto de comandos `COM_xxx` usado na camada de rede. Em outras palavras, seus valores aumentam sempre que chamadas de API de declaração preparada, como **mysql_stmt_prepare()**, **mysql_stmt_execute()**, e assim por diante, são executadas. No entanto, `Com_stmt_prepare`, `Com_stmt_execute` e `Com_stmt_close` também aumentam para `PREPARE`, `EXECUTE`, ou `DEALLOCATE PREPARE`, respectivamente. Além disso, os valores das variáveis de contagem de declaração mais antigas `Com_prepare_sql`, `Com_execute_sql` e `Com_dealloc_sql` aumentam para as declarações `PREPARE`, `EXECUTE` e `DEALLOCATE PREPARE`. `Com_stmt_fetch` representa o número total de viagens de ida e volta na rede emitidas ao buscar em cursors.

`Com_stmt_reprepare` indica o número de vezes que as declarações foram automaticamente repreparadas pelo servidor após as alterações de metadados em tabelas ou visualizações referenciadas pela declaração. Uma operação de repreparação incrementa `Com_stmt_reprepare` e também `Com_stmt_prepare`.

`Com_explain_other` indica o número de declarações `EXPLAIN FOR CONNECTION` executadas. Veja a Seção 8.8.4, “Obtenção de Informações do Plano de Execução para uma Conexão Nomeada”.

`Com_change_repl_filter` indica o número de `CHANGE REPLICATION FILTER` declarações executadas.

* `Compression`

Se a conexão do cliente utiliza compressão no protocolo cliente/servidor.

* `Connection_errors_xxx`

Essas variáveis fornecem informações sobre os erros que ocorrem durante o processo de conexão do cliente. Elas são globais e representam contagens de erros agregadas em todas as conexões de todos os hosts. Essas variáveis rastreiam erros que não são contabilizados pelo cache do host (consulte a Seção 5.1.11.2, “Consultas DNS e o Cache do Host”), como erros que não estão associados a conexões TCP, ocorrem muito cedo no processo de conexão (mesmo antes de um endereço IP ser conhecido) ou não são específicos para qualquer endereço IP particular (como condições de falta de memória).

A partir do MySQL 5.7.3, as variáveis de status `Connection_errors_xxx` não são visíveis no servidor incorporado, porque, para esse servidor, elas não são atualizadas e não têm significado.

+ `Connection_errors_accept`

O número de erros que ocorreram durante as chamadas para `accept()` na porta de escuta.

+ `Connection_errors_internal`

O número de conexões recusadas devido a erros internos no servidor, como falha em iniciar um novo thread ou uma condição de memória insuficiente.

+ `Connection_errors_max_connections`

O número de conexões recusadas porque o limite do servidor `max_connections` foi atingido.

+ `Connection_errors_peer_address`

O número de erros que ocorreram ao procurar endereços IP do cliente de conexão.

+ `Connection_errors_select`

O número de erros que ocorreram durante as chamadas para `select()` ou `poll()` na porta de escuta. (A falha desta operação não significa necessariamente que uma conexão do cliente foi rejeitada.)

+ `Connection_errors_tcpwrap`

Número de conexões recusadas pela biblioteca `libwrap`.

* `Connections`

O número de tentativas de conexão (sucesso ou não) ao servidor MySQL.

* `Created_tmp_disk_tables`

O número de tabelas temporárias internas criadas no disco pelo servidor durante a execução de instruções.

Você pode comparar o número de tabelas temporárias internas criadas em disco com o número total de tabelas temporárias internas criadas, comparando os valores de `Created_tmp_disk_tables` e `Created_tmp_tables`.

Veja também a Seção 8.4.4, “Uso de Tabela Temporária Interna no MySQL”.

* `Created_tmp_files`

Quantos arquivos temporários o `mysqld` criou.

* `Created_tmp_tables`

O número de tabelas temporárias internas criadas pelo servidor durante a execução de instruções.

Você pode comparar o número de tabelas temporárias internas criadas em disco com o número total de tabelas temporárias internas criadas, comparando os valores de `Created_tmp_disk_tables` e `Created_tmp_tables`.

Veja também a Seção 8.4.4, “Uso de Tabela Temporária Interna no MySQL”.

Cada invocação da declaração `SHOW STATUS` utiliza uma tabela temporária interna e incrementa o valor global `Created_tmp_tables`.

* `Delayed_errors`

Essa variável de estado é desatualizada (porque as inserções `DELAYED` não são suportadas); espere que ela seja removida em uma versão futura.

* `Delayed_insert_threads`

Essa variável de estado é desatualizada (porque as inserções `DELAYED` não são suportadas); espere que ela seja removida em uma versão futura.

* `Delayed_writes`

Essa variável de estado é desatualizada (porque as inserções `DELAYED` não são suportadas); espere que ela seja removida em uma versão futura.

* `Flush_commands`

O número de vezes que o servidor limpa as tabelas, seja porque um usuário executou uma declaração `FLUSH TABLES` ou devido a uma operação interna do servidor. Também é incrementado pelo recebimento de um pacote `COM_REFRESH`. Isso contrasta com `Com_flush`, que indica quantas declarações `FLUSH` foram executadas, seja `FLUSH TABLES`, `FLUSH LOGS` e assim por diante.

* `group_replication_primary_member`

Mostra o UUID do membro principal quando o grupo está operando no modo de único principal. Se o grupo estiver operando no modo de múltiplos principais, exibe uma string vazia.

* `Handler_commit`

O número de declarações internas `COMMIT`.

* `Handler_delete`

O número de vezes que as strings foram excluídas das tabelas.

* `Handler_external_lock`

O servidor incrementa essa variável em cada chamada à sua função `external_lock()`, que geralmente ocorre no início e no final do acesso a uma instância de tabela. Pode haver diferenças entre os motores de armazenamento. Essa variável pode ser usada, por exemplo, para descobrir, para uma declaração que acessa uma tabela particionada, quantos particionamentos foram cortados antes de ocorrer o bloqueio: Verifique quanto o contador aumentou para a declaração, subtraia 2 (2 chamadas para a própria tabela), e depois divida por 2 para obter o número de particionamentos bloqueados.

* `Handler_mrr_init`

O número de vezes que o servidor usa a própria implementação de leitura de Multi-Range do mecanismo de armazenamento para acesso a tabela.

* `Handler_prepare`

Um contador para a fase de preparação de operações de compromisso de duas fases.

* `Handler_read_first`

O número de vezes que a primeira entrada em um índice foi lida. Se esse valor for alto, sugere que o servidor está realizando muitas varreduras completas do índice (por exemplo, `SELECT col1 FROM foo`, assumindo que `col1` está indexado).

* `Handler_read_key`

O número de solicitações para ler uma string com base em uma chave. Se esse valor for alto, é uma boa indicação de que suas tabelas estão corretamente indexadas para suas consultas.

* `Handler_read_last`

O número de solicitações para ler a última chave em um índice. Com `ORDER BY`, o servidor emite uma solicitação de primeira chave seguida por várias solicitações de próxima chave, enquanto com `ORDER BY DESC`, o servidor emite uma solicitação de última chave seguida por várias solicitações de chave anterior.

* `Handler_read_next`

O número de solicitações para ler a próxima string na ordem da chave. Esse valor é incrementado se você estiver consultando uma coluna de índice com uma restrição de intervalo ou se estiver realizando uma varredura de índice.

* `Handler_read_prev`

O número de solicitações para ler a string anterior na ordem chave. Esse método de leitura é usado principalmente para otimizar `ORDER BY ... DESC`.

* `Handler_read_rnd`

O número de solicitações para ler uma string com base em uma posição fixa. Esse valor é alto se você está fazendo muitas consultas que exigem ordenação dos resultados. Provavelmente, você tem muitas consultas que exigem que o MySQL escaneie tabelas inteiras ou você tem junções que não usam chaves corretamente.

* `Handler_read_rnd_next`

O número de solicitações para ler a próxima string no arquivo de dados. Esse valor é alto se você está fazendo muitas varreduras de tabela. Geralmente, isso sugere que suas tabelas não estão corretamente indexadas ou que suas consultas não foram escritas para aproveitar os índices que você tem.

* `Handler_rollback`

O número de solicitações para que um motor de armazenamento realize uma operação de rollback.

* `Handler_savepoint`

O número de solicitações para que um motor de armazenamento coloque um ponto de salvamento.

* `Handler_savepoint_rollback`

O número de solicitações para que um motor de armazenamento volte a um ponto de salvamento.

* `Handler_update`

O número de solicitações para atualizar uma string em uma tabela.

* `Handler_write`

O número de solicitações para inserir uma string em uma tabela.

* `Innodb_available_undo_logs`

Nota

A variável de status `Innodb_available_undo_logs` é descontinuada a partir do MySQL 5.7.19; espere que ela seja removida em uma versão futura.

O número total de segmentos de rollback disponíveis `InnoDB`. Complementa a variável de sistema `innodb_rollback_segments`, que define o número de segmentos de rollback ativos.

Um segmento de rollback sempre reside no espaço de tabelas do sistema, e 32 segmentos de rollback são reservados para uso de tabelas temporárias e são hospedados no espaço de tabelas temporárias (`ibtmp1`). Veja a Seção 14.6.7, “Logs de Undo”.

Se você iniciar uma instância MySQL com 32 ou menos segmentos de rollback, `InnoDB` ainda atribui um segmento de rollback ao espaço de tabelas do sistema e 32 segmentos de rollback ao espaço de tabelas temporárias. Neste caso, `Innodb_available_undo_logs` relata 33 segmentos de rollback disponíveis, mesmo que a instância tenha sido inicializada com um valor menor `innodb_rollback_segments`.

* `Innodb_buffer_pool_dump_status`

O progresso de uma operação para registrar as páginas mantidas no pool de buffer `InnoDB`, desencadeado pela configuração de `innodb_buffer_pool_dump_at_shutdown` ou `innodb_buffer_pool_dump_now`.

Para informações relacionadas e exemplos, consulte a Seção 14.8.3.6, “Salvar e restaurar o estado do pool de buffer”.

* `Innodb_buffer_pool_load_status`

O progresso de uma operação para aquecer o pool de buffer `InnoDB` lendo um conjunto de páginas correspondentes a um ponto anterior no tempo, desencadeada pela configuração de `innodb_buffer_pool_load_at_startup` ou `innodb_buffer_pool_load_now`. Se a operação introduzir muito overhead, você pode cancelá-la configurando `innodb_buffer_pool_load_abort`.

Para informações relacionadas e exemplos, consulte a Seção 14.8.3.6, “Salvar e restaurar o estado do pool de buffer”.

* `Innodb_buffer_pool_bytes_data`

O número total de bytes no pool de buffer `InnoDB` que contém dados. O número inclui páginas sujas e limpas. Para cálculos mais precisos de uso de memória do que com `Innodb_buffer_pool_pages_data`, quando as tabelas compactadas fazem com que o pool de buffer retenha páginas de diferentes tamanhos.

* `Innodb_buffer_pool_pages_data`

O número de páginas no pool de buffer `InnoDB` que contêm dados. O número inclui páginas sujas e limpas. Ao usar tabelas compactadas, o valor informado em `Innodb_buffer_pool_pages_data` pode ser maior que `Innodb_buffer_pool_pages_total` (Bug #59550).

* `Innodb_buffer_pool_bytes_dirty`

O número total de bytes atuais mantidos em páginas sujas no pool de buffer `InnoDB`. Para cálculos mais precisos de uso de memória do que com `Innodb_buffer_pool_pages_dirty`, quando tabelas comprimidas fazem com que o pool de buffer mantenha páginas de tamanhos diferentes.

* `Innodb_buffer_pool_pages_dirty`

O número atual de páginas sujas no pool de buffer `InnoDB`.

* `Innodb_buffer_pool_pages_flushed`

O número de solicitações para limpar páginas do pool de buffer `InnoDB`.

* `Innodb_buffer_pool_pages_free`

O número de páginas livres no pool de buffer `InnoDB`.

* `Innodb_buffer_pool_pages_latched`

O número de páginas abertas no pool de buffer `InnoDB`. São páginas que estão sendo lidas ou escritas atualmente, ou que não podem ser esvaziadas ou removidas por algum outro motivo. O cálculo desta variável é caro, portanto, ela está disponível apenas quando o sistema `UNIV_DEBUG` é definido no momento da construção do servidor.

* `Innodb_buffer_pool_pages_misc`

O número de páginas no pool de buffer `InnoDB` que estão ocupadas porque foram alocadas para overhead administrativo, como bloqueios de string ou índice de hash adaptativo. Esse valor também pode ser calculado como `Innodb_buffer_pool_pages_total` − `Innodb_buffer_pool_pages_free` − `Innodb_buffer_pool_pages_data`. Ao usar tabelas compactadas, `Innodb_buffer_pool_pages_misc` pode reportar um valor fora dos limites (Bug #59550).

* `Innodb_buffer_pool_pages_total`

O tamanho total do conjunto de buffers `InnoDB`, em páginas. Ao usar tabelas comprimidas, o valor informado em `Innodb_buffer_pool_pages_data` pode ser maior que `Innodb_buffer_pool_pages_total` (Bug #59550)

* `Innodb_buffer_pool_read_ahead`

O número de páginas lidas no pool de buffer `InnoDB` pelo thread de leitura antecipada em segundo plano.

* `Innodb_buffer_pool_read_ahead_evicted`

O número de páginas lidas no pool de buffer `InnoDB` pelo thread de leitura antecipada em segundo plano que foram posteriormente expulsas sem terem sido acessadas por consultas.

* `Innodb_buffer_pool_read_ahead_rnd`

O número de leituras "aleatórias" iniciadas por `InnoDB`. Isso acontece quando uma consulta digitaliza uma grande porção de uma tabela, mas em ordem aleatória.

* `Innodb_buffer_pool_read_requests`

O número de solicitações de leitura lógica.

* `Innodb_buffer_pool_reads`

O número de leituras lógicas que `InnoDB` não conseguiu satisfazer a partir do pool de buffer e teve que ler diretamente do disco.

* `Innodb_buffer_pool_resize_status`

O status de uma operação para redimensionar o pool de buffer `InnoDB` dinamicamente, desencadeada pela definição do parâmetro `innodb_buffer_pool_size` dinamicamente. O parâmetro `innodb_buffer_pool_size` é dinâmico, o que permite redimensionar o pool de buffer sem reiniciar o servidor. Consulte Configurando o tamanho do pool de buffer InnoDB online para informações relacionadas.

* `Innodb_buffer_pool_wait_free`

Normalmente, as operações de escrita no pool de buffer `InnoDB` ocorrem em segundo plano. Quando o `InnoDB` precisa ler ou criar uma página e não há páginas limpas disponíveis, o `InnoDB` esvazia primeiro algumas páginas sujas e aguarda que essa operação seja concluída. Esse contador conta as instâncias dessas espera. Se o `innodb_buffer_pool_size` tiver sido configurado corretamente, esse valor deve ser pequeno.

* `Innodb_buffer_pool_write_requests`

O número de gravações feitas no pool de buffer `InnoDB`.

* `Innodb_data_fsyncs`

O número de operações `fsync()` até o momento. A frequência das chamadas `fsync()` é influenciada pela configuração da opção de configuração `innodb_flush_method`.

* `Innodb_data_pending_fsyncs`

O número atual de operações pendentes de `fsync()`. A frequência das chamadas de `fsync()` é influenciada pela configuração da opção de configuração `innodb_flush_method`.

* `Innodb_data_pending_reads`

O número atual de leituras pendentes.

* `Innodb_data_pending_writes`

O número atual de gravações pendentes.

* `Innodb_data_read`

A quantidade de dados lidos desde que o servidor foi iniciado (em bytes).

* `Innodb_data_reads`

O número total de leituras de dados (leitura de arquivos do sistema operacional).

* `Innodb_data_writes`

O número total de gravações de dados.

* `Innodb_data_written`

O volume de dados escritos até agora, em bytes.

* `Innodb_dblwr_pages_written`

O número de páginas que foram escritas no buffer de dupla gravação. Veja a Seção 14.12.1, “I/O de disco do InnoDB”.

* `Innodb_dblwr_writes`

O número de operações de escrita dupla que foram realizadas. Consulte a Seção 14.12.1, “I/O de disco InnoDB”.

* `Innodb_have_atomic_builtins`

Indica se o servidor foi construído com instruções atômicas.

* `Innodb_log_waits`

O número de vezes em que o buffer de registro era muito pequeno e era necessário esperar para que ele fosse esvaziado antes de continuar.

* `Innodb_log_write_requests`

O número de solicitações de escrita para o log de refazer `InnoDB`.

* `Innodb_log_writes`

O número de gravações físicas no arquivo de registro de refazer `InnoDB`.

* `Innodb_num_open_files`

O número de arquivos `InnoDB` atualmente mantidos abertos.

* `Innodb_os_log_fsyncs`

O número de `fsync()` escritos feitos nos arquivos de registro redo `InnoDB`.

* `Innodb_os_log_pending_fsyncs`

O número de operações pendentes de `fsync()` para os arquivos de registro de reescrita `InnoDB`.

* `Innodb_os_log_pending_writes`

O número de gravações pendentes nos arquivos de registro redo `InnoDB`.

* `Innodb_os_log_written`

O número de bytes escritos nos arquivos de registro de reescrita `InnoDB`.

* `Innodb_page_size`

`InnoDB` tamanho da página (padrão 16 KB). Muitos valores são contados em páginas; o tamanho da página permite que eles sejam facilmente convertidos em bytes.

* `Innodb_pages_created`

O número de páginas criadas por operações nas tabelas `InnoDB`.

* `Innodb_pages_read`

O número de páginas lidas do pool de buffer `InnoDB` por operações nas tabelas `InnoDB`.

* `Innodb_pages_written`

O número de páginas escritas por operações nas tabelas `InnoDB`.

* `Innodb_row_lock_current_waits`

O número de bloqueios de string atualmente aguardados por operações nas tabelas `InnoDB`.

* `Innodb_row_lock_time`

O tempo total gasto na aquisição de bloqueios de string para as tabelas `InnoDB`, em milissegundos.

* `Innodb_row_lock_time_avg`

O tempo médio para adquirir um bloqueio de string para as tabelas `InnoDB`, em milissegundos.

* `Innodb_row_lock_time_max`

O tempo máximo para adquirir um bloqueio de string para as tabelas `InnoDB`, em milissegundos.

* `Innodb_row_lock_waits`

O número de vezes em que as operações nas tabelas `InnoDB` tiveram que esperar por um bloqueio de string.

* `Innodb_rows_deleted`

O número de strings excluídas das tabelas `InnoDB`.

* `Innodb_rows_inserted`

O número de strings inseridas nas tabelas `InnoDB`.

* `Innodb_rows_read`

O número de strings lidas das tabelas `InnoDB`.

* `Innodb_rows_updated`

O número estimado de strings atualizadas nas tabelas `InnoDB`.

Nota

Esse valor não é considerado 100% preciso. Para um resultado preciso (mas mais caro), use `ROW_COUNT()`.

* `Innodb_truncated_status_writes`

O número de vezes em que a saída da declaração `SHOW ENGINE INNODB STATUS` foi truncada.

* `Key_blocks_not_flushed`

O número de blocos-chave no cache de chave `MyISAM` que mudaram, mas ainda não foram descarregados no disco.

* `Key_blocks_unused`

O número de blocos não utilizados na cache da chave `MyISAM`. Você pode usar esse valor para determinar quanto da cache de chave está em uso; consulte a discussão sobre `key_buffer_size` na Seção 5.1.7, “Variáveis do sistema do servidor”.

* `Key_blocks_used`

O número de blocos usados na cache da chave `MyISAM`. Esse valor é um limite máximo que indica o número máximo de blocos que já foram usados ao mesmo tempo.

* `Key_read_requests`

O número de solicitações para ler um bloco-chave do cache de chave `MyISAM`.

* `Key_reads`

O número de leituras físicas de um bloco de chave do disco para a cache de chave `MyISAM`. Se `Key_reads` for grande, então o valor de `key_buffer_size` provavelmente é muito pequeno. A taxa de falha de cache pode ser calculada como `Key_reads`/`Key_read_requests`.

* `Key_write_requests`

O número de solicitações para escrever um bloco chave na cache de chave `MyISAM`.

* `Key_writes`

O número de gravações físicas de um bloco de chave da cache de chave `MyISAM` para o disco.

* `Last_query_cost`

O custo total da última consulta compilada, conforme calculado pelo otimizador de consulta. Isso é útil para comparar o custo de diferentes planos de consulta para a mesma consulta. O valor padrão de 0 significa que nenhuma consulta foi compilada ainda. O valor padrão é 0. `Last_query_cost` tem escopo de sessão.

`Last_query_cost` pode ser calculado com precisão apenas para consultas simples e "planas", mas não para consultas complexas, como aquelas que contêm subconsultas ou `UNION`. Para este último caso, o valor é definido como 0.

* `Last_query_partial_plans`

O número de iterações que o otimizador de consultas fez na construção do plano de execução para a consulta anterior.

`Last_query_partial_plans` tem escopo de sessão.

* `Locked_connects`

O número de tentativas de conexão a contas de usuários bloqueadas. Para informações sobre bloqueio e desbloqueio de contas, consulte a Seção 6.2.15, “Bloqueio de Conta”.

* `Max_execution_time_exceeded`

O número de declarações `SELECT` para as quais o tempo de espera de execução foi excedido.

* `Max_execution_time_set`

O número de declarações `SELECT` para as quais foi definido um tempo de espera de execução não nulo. Isso inclui declarações que incluem uma dica de otimizador `MAX_EXECUTION_TIME` não nula e declarações que não incluem tal dica, mas executam enquanto o tempo de espera indicado pela variável de sistema `max_execution_time` é não nulo.

* `Max_execution_time_set_failed`

O número de declarações `SELECT` para as quais a tentativa de definir um limite de tempo de execução falhou.

* `Max_used_connections`

O número máximo de conexões que foram usadas simultaneamente desde que o servidor foi iniciado.

* `Max_used_connections_time`

O momento em que `Max_used_connections` atingiu seu valor atual.

* `Not_flushed_delayed_rows`

Essa variável de estado é desatualizada (porque as inserções `DELAYED` não são suportadas); espere que ela seja removida em uma versão futura.

* `mecab_charset`

O conjunto de caracteres atualmente utilizado pelo plugin de análise de texto completo MeCab. Para informações relacionadas, consulte a Seção 12.9.9, “Plugin de Análise de Texto Completo MeCab”.

* `Ongoing_anonymous_transaction_count`

Mostra o número de transações em andamento que foram marcadas como anônimas. Isso pode ser usado para garantir que nenhuma outra transação esteja esperando para ser processada.

* `Ongoing_anonymous_gtid_violating_transaction_count`

Essa variável de status só está disponível em builds de depuração. Mostra o número de transações em andamento que utilizam `gtid_next=ANONYMOUS` e que violam a consistência GTID.

* `Ongoing_automatic_gtid_violating_transaction_count`

Essa variável de status só está disponível em builds de depuração. Mostra o número de transações em andamento que utilizam `gtid_next=AUTOMATIC` e que violam a consistência GTID.

* `Open_files`

O número de arquivos abertos. Esse contagem inclui arquivos regulares abertos pelo servidor. Não inclui outros tipos de arquivos, como soquetes ou pipes. Além disso, o contagem não inclui arquivos que os motores de armazenamento abrem usando suas próprias funções internas, em vez de pedir ao nível do servidor para fazer isso.

* `Open_streams`

O número de fluxos abertos (usados principalmente para registro).

* `Open_table_definitions`

O número de arquivos `.frm` armazenados em cache.

* `Open_tables`

O número de tabelas que estão abertas.

* `Opened_files`

O número de arquivos que foram abertos com `my_open()` (uma função da biblioteca `mysys`). Parte do servidor que abre arquivos sem usar essa função não incrementa o contagem.

* `Opened_table_definitions`

O número de arquivos `.frm` que foram cacheados.

* `Opened_tables`

O número de tabelas que foram abertas. Se `Opened_tables` é grande, seu valor `table_open_cache` provavelmente é muito pequeno.

* `Performance_schema_xxx`

As variáveis de status do Schema de desempenho estão listadas na Seção 25.16, “Variáveis de status do Schema de desempenho”. Essas variáveis fornecem informações sobre a instrumentação que não pôde ser carregada ou criada devido a restrições de memória.

* `Prepared_stmt_count`

O número atual de declarações preparadas. (O número máximo de declarações é dado pela variável de sistema `max_prepared_stmt_count`.)

* `Qcache_free_blocks`

O número de blocos de memória livres no cache de consulta.

Nota

O cache de consulta é descontinuado a partir do MySQL 5.7.20 e é removido no MySQL 8.0. A depreciação inclui `Qcache_free_blocks`.

* `Qcache_free_memory`

O valor da memória livre para o cache de consulta.

Nota

O cache de consulta é descontinuado a partir do MySQL 5.7.20 e é removido no MySQL 8.0. A depreciação inclui `Qcache_free_memory`.

* `Qcache_hits`

O número de acertos no cache de consultas.

A discussão no início desta seção indica como relacionar essa variável de status de contagem de declarações a outras variáveis semelhantes.

Nota

O cache de consulta é descontinuado a partir do MySQL 5.7.20 e é removido no MySQL 8.0. A depreciação inclui `Qcache_hits`.

* `Qcache_inserts`

O número de consultas adicionadas ao cache de consultas.

Nota

O cache de consulta é descontinuado a partir do MySQL 5.7.20 e é removido no MySQL 8.0. A depreciação inclui `Qcache_inserts`.

* `Qcache_lowmem_prunes`

O número de consultas que foram excluídas do cache de consultas devido à baixa memória.

Nota

O cache de consulta é descontinuado a partir do MySQL 5.7.20 e é removido no MySQL 8.0. A depreciação inclui `Qcache_lowmem_prunes`.

* `Qcache_not_cached`

O número de consultas não cacheadas (não cacheáveis ou não cacheadas devido à configuração `query_cache_type`).

Nota

O cache de consulta é descontinuado a partir do MySQL 5.7.20 e é removido no MySQL 8.0. A depreciação inclui `Qcache_not_cached`.

* `Qcache_queries_in_cache`

O número de consultas registradas no cache de consultas.

Nota

O cache de consulta é descontinuado a partir do MySQL 5.7.20 e é removido no MySQL 8.0. A depreciação inclui `Qcache_queries_in_cache`.

* `Qcache_total_blocks`

O número total de blocos no cache de consulta.

Nota

O cache de consulta é descontinuado a partir do MySQL 5.7.20 e é removido no MySQL 8.0. A depreciação inclui `Qcache_total_blocks`.

* `Queries`

O número de declarações executadas pelo servidor. Esta variável inclui declarações executadas dentro de programas armazenados, ao contrário da variável `Questions`. Não conta com os comandos `COM_PING` ou `COM_STATISTICS`.

A discussão no início desta seção indica como relacionar essa variável de status de contagem de declarações a outras variáveis semelhantes.

* `Questions`

O número de declarações executadas pelo servidor. Isso inclui apenas declarações enviadas ao servidor pelos clientes e não declarações executadas dentro de programas armazenados, ao contrário da variável `Queries`. Esta variável não conta com os comandos `COM_PING`, `COM_STATISTICS`, `COM_STMT_PREPARE`, `COM_STMT_CLOSE` ou `COM_STMT_RESET`.

A discussão no início desta seção indica como relacionar essa variável de status de contagem de declarações a outras variáveis semelhantes.

* `Rpl_semi_sync_master_clients`

O número de réplicas semi-síncronas.

Essa variável está disponível apenas se o plugin de replicação semi-sincronizada do lado da fonte estiver instalado.

* `Rpl_semi_sync_master_net_avg_wait_time`

O tempo médio em microsegundos que a fonte esperou por uma resposta replicada. Esta variável é desatualizada, sempre `0`; espere-a em uma versão futura.

Essa variável está disponível apenas se o plugin de replicação semi-sincronizada do lado da fonte estiver instalado.

* `Rpl_semi_sync_master_net_wait_time`

O tempo total em microsegundos que a fonte esperou por respostas replicadas. Esta variável é desatualizada e sempre é `0`; espere que ela seja removida em uma versão futura.

Essa variável está disponível apenas se o plugin de replicação semi-sincronizada do lado da fonte estiver instalado.

* `Rpl_semi_sync_master_net_waits`

O número total de vezes que a fonte esperou por respostas replicadas.

Essa variável está disponível apenas se o plugin de replicação semi-sincronizada do lado da fonte estiver instalado.

* `Rpl_semi_sync_master_no_times`

O número de vezes que a fonte desligou a replicação semisíncrona.

Essa variável está disponível apenas se o plugin de replicação semi-sincronizada do lado da fonte estiver instalado.

* `Rpl_semi_sync_master_no_tx`

O número de commits que não foram reconhecidos com sucesso por uma réplica.

Essa variável está disponível apenas se o plugin de replicação semi-sincronizada do lado da fonte estiver instalado.

* `Rpl_semi_sync_master_status`

Se a replicação semi-sincronizada está atualmente operacional na fonte. O valor é `ON` se o plugin tiver sido habilitado e um reconhecimento de compromisso ocorrer. É `OFF` se o plugin não estiver habilitado ou se a fonte tiver retornado para replicação assíncrona devido ao tempo de espera de reconhecimento de compromisso.

Essa variável está disponível apenas se o plugin de replicação semi-sincronizada do lado da fonte estiver instalado.

* `Rpl_semi_sync_master_timefunc_failures`

O número de vezes que a fonte falhou ao chamar funções de tempo, como `gettimeofday()`.

Essa variável está disponível apenas se o plugin de replicação semi-sincronizada do lado da fonte estiver instalado.

* `Rpl_semi_sync_master_tx_avg_wait_time`

O tempo médio em microsegundos que a fonte esperou por cada transação.

Essa variável está disponível apenas se o plugin de replicação semi-sincronizada do lado da fonte estiver instalado.

* `Rpl_semi_sync_master_tx_wait_time`

O tempo total em microsegundos que a fonte esperou por transações.

Essa variável está disponível apenas se o plugin de replicação semi-sincronizada do lado da fonte estiver instalado.

* `Rpl_semi_sync_master_tx_waits`

O número total de vezes que a fonte esperou por transações.

Essa variável está disponível apenas se o plugin de replicação semi-sincronizada do lado da fonte estiver instalado.

* `Rpl_semi_sync_master_wait_pos_backtraverse`

O número total de vezes que a fonte esperou por um evento com coordenadas binárias inferiores às esperadas anteriormente. Isso pode ocorrer quando a ordem em que as transações começam a esperar uma resposta é diferente da ordem em que seus eventos de log binário são escritos.

Essa variável está disponível apenas se o plugin de replicação semi-sincronizada do lado da fonte estiver instalado.

* `Rpl_semi_sync_master_wait_sessions`

O número de sessões que estão atualmente aguardando respostas replicadas.

Essa variável está disponível apenas se o plugin de replicação semi-sincronizada do lado da fonte estiver instalado.

* `Rpl_semi_sync_master_yes_tx`

O número de commits que foram reconhecidos com sucesso por uma réplica.

Essa variável está disponível apenas se o plugin de replicação semi-sincronizada do lado da fonte estiver instalado.

* `Rpl_semi_sync_slave_status`

Se a replicação semi-sincronizada está atualmente operacional na replica. Isso é `ON` se o plugin tiver sido habilitado e o thread de I/O da replica estiver em execução, `OFF` caso contrário.

Essa variável está disponível apenas se o plugin de replicação semi-sincronizada do lado do replicador estiver instalado.

* `Rsa_public_key`

Essa variável está disponível se o MySQL foi compilado usando o OpenSSL (consulte a Seção 6.3.4, “Capacidades Dependentes da Biblioteca SSL”). Seu valor é a chave pública usada pelo plugin de autenticação `sha256_password` para troca de senha com par de chave RSA. O valor não está vazio apenas se o servidor inicializar com sucesso as chaves privada e pública nos arquivos nomeados pelas variáveis de sistema `sha256_password_private_key_path` e `sha256_password_public_key_path`. O valor de `Rsa_public_key` vem do último arquivo.

Para informações sobre `sha256_password`, consulte a Seção 6.4.1.5, “Autenticação Pluggable SHA-256”.

* `Select_full_join`

O número de junções que realizam varreduras de tabela porque não usam índices. Se esse valor não for 0, você deve verificar cuidadosamente os índices de suas tabelas.

* `Select_full_range_join`

O número de junções que utilizaram uma pesquisa de intervalo em uma tabela de referência.

* `Select_range`

O número de junções que utilizaram intervalos na primeira tabela. Normalmente, isso não é um problema crítico, mesmo que o valor seja bastante grande.

* `Select_range_check`

O número de junções sem chaves que verificam o uso de chave após cada string. Se este número não for 0, você deve verificar cuidadosamente os índices de suas tabelas.

* `Select_scan`

O número de junções que realizaram uma varredura completa da primeira tabela.

* `Slave_heartbeat_period`

Mostra o intervalo de batida de replicação (em segundos) em uma replica de replicação.

Essa variável é afetada pelo valor da variável do sistema `show_compatibility_56`. Para detalhes, consulte o efeito de show_compatibility_56 sobre as variáveis de status do escravo.

Nota

Essa variável apenas mostra o status do canal de replicação padrão. Para monitorar qualquer canal de replicação, use a coluna `HEARTBEAT_INTERVAL` na tabela `replication_connection_configuration` para o canal de replicação. `Slave_heartbeat_period` é desatualizado e foi removido no MySQL 8.0.

* `Slave_last_heartbeat`

Mostra quando o sinal mais recente do batimento cardíaco foi recebido por uma réplica, como um valor `TIMESTAMP`.

Essa variável é afetada pelo valor da variável do sistema `show_compatibility_56`. Para detalhes, consulte o efeito de show_compatibility_56 sobre as variáveis de status do escravo.

Nota

Essa variável apenas mostra o status do canal de replicação padrão. Para monitorar qualquer canal de replicação, use a coluna `LAST_HEARTBEAT_TIMESTAMP` na tabela `replication_connection_status` para o canal de replicação. `Slave_last_heartbeat` é desatualizado e foi removido no MySQL 8.0.

* `Slave_open_temp_tables`

O número de tabelas temporárias que o thread de replicação SQL atualmente tem aberto. Se o valor for maior que zero, não é seguro desligar a replica; veja Seção 16.4.1.29, “Replicação e Tabelas Temporárias”. Esta variável reporta o total de tabelas temporárias abertas para *todos* os canais de replicação.

* `Slave_received_heartbeats`

Esse contador é incrementado a cada batida de replicação recebida por uma réplica de replicação desde a última vez que a réplica foi reiniciada ou redefinida, ou uma declaração `CHANGE MASTER TO` foi emitida.

Essa variável é afetada pelo valor da variável do sistema `show_compatibility_56`. Para detalhes, consulte o efeito de show_compatibility_56 sobre as variáveis de status do escravo.

Nota

Essa variável apenas mostra o status do canal de replicação padrão. Para monitorar qualquer canal de replicação, use a coluna `COUNT_RECEIVED_HEARTBEATS` na tabela `replication_connection_status` para o canal de replicação. `Slave_received_heartbeats` é desatualizado e foi removido no MySQL 8.0.

* `Slave_retried_transactions`

O número total de vezes desde a inicialização em que o SQL thread da replica de replicação tentou novamente as transações.

Essa variável é afetada pelo valor da variável do sistema `show_compatibility_56`. Para detalhes, consulte o efeito de show_compatibility_56 sobre as variáveis de status do escravo.

Nota

Essa variável apenas mostra o status do canal de replicação padrão. Para monitorar qualquer canal de replicação, use a coluna `COUNT_TRANSACTIONS_RETRIES` na tabela `replication_applier_status` para o canal de replicação. `Slave_retried_transactions` é desatualizado e foi removido no MySQL 8.0.

* `Slave_rows_last_search_algorithm_used`

O algoritmo de busca que foi mais recentemente utilizado por esta réplica para localizar strings para replicação baseada em string. O resultado mostra se a réplica utilizou índices, uma varredura de tabela ou hashing como o algoritmo de busca para a última transação executada em qualquer canal.

O método utilizado depende do ambiente da variável de sistema `slave_rows_search_algorithms` e das chaves disponíveis na tabela relevante.

Essa variável está disponível apenas para builds de depuração do MySQL.

* `Slave_running`

Este é `ON` se este servidor for uma replica que está conectada a uma fonte de replicação e ambos os threads de I/O e SQL estão em execução; caso contrário, é `OFF`.

Essa variável é afetada pelo valor da variável do sistema `show_compatibility_56`. Para detalhes, consulte o efeito de show_compatibility_56 sobre as variáveis de status do escravo.

Nota

Essa variável apenas mostra o status do canal de replicação padrão. Para monitorar qualquer canal de replicação, use a coluna `SERVICE_STATE` nas tabelas `replication_applier_status` ou `replication_connection_status` do canal de replicação. `Slave_running` é desatualizado e foi removido no MySQL 8.0.

* `Slow_launch_threads`

O número de threads que demoraram mais de `slow_launch_time` segundos para serem criadas.

Essa variável não é significativa no servidor integrado (`libmysqld`) e, a partir do MySQL 5.7.2, ela não é mais visível no servidor integrado.

* `Slow_queries`

O número de consultas que levaram mais de `long_query_time` segundos. Esse contador é incrementado independentemente de o registro de consultas lentas estar habilitado. Para informações sobre esse registro, consulte a Seção 5.4.5, “O registro de consultas lentas”.

* `Sort_merge_passes`

O número de passes de junção que o algoritmo de ordenação teve que realizar. Se esse valor for grande, você deve considerar aumentar o valor da variável do sistema `sort_buffer_size`.

* `Sort_range`

O número de tipos que foram feitos usando faixas.

* `Sort_rows`

O número de strings ordenadas.

* `Sort_scan`

O número de tipos que foram feitos ao digitalizar a tabela.

* `Ssl_accept_renegotiates`

O número de negociações necessárias para estabelecer a conexão.

* `Ssl_accepts`

O número de conexões SSL aceitas.

* `Ssl_callback_cache_hits`

O número de acertos na cache de callback.

* `Ssl_cipher`

O cifrador de criptografia atual (vazio para conexões não criptografadas).

* `Ssl_cipher_list`

A lista de possíveis cifradores SSL (vazia para conexões sem SSL).

* `Ssl_client_connects`

O número de tentativas de conexão SSL para uma fonte habilitada para SSL.

* `Ssl_connect_renegotiates`

O número de negociações necessárias para estabelecer a conexão com uma fonte habilitada para SSL.

* `Ssl_ctx_verify_depth`

A profundidade da verificação do contexto SSL (quantos certificados na cadeia são testados).

* `Ssl_ctx_verify_mode`

O modo de verificação do contexto SSL.

* `Ssl_default_timeout`

O limite de tempo padrão do SSL.

* `Ssl_finished_accepts`

O número de conexões SSL bem-sucedidas ao servidor.

* `Ssl_finished_connects`

O número de conexões de replicação bem-sucedidas a uma fonte habilitada para SSL.

* `Ssl_server_not_after`

A última data em que o certificado SSL é válido. Para verificar as informações de expiração do certificado SSL, use esta declaração:

  ```sql
  mysql> SHOW STATUS LIKE 'Ssl_server_not%';
  +-----------------------+--------------------------+
  | Variable_name         | Value                    |
  +-----------------------+--------------------------+
  | Ssl_server_not_after  | Apr 28 14:16:39 2025 GMT |
  | Ssl_server_not_before | May  1 14:16:39 2015 GMT |
  +-----------------------+--------------------------+
  ```

* `Ssl_server_not_before`

A primeira data em que o certificado SSL é válido.

* `Ssl_session_cache_hits`

O número de acertos no cache de sessão SSL.

* `Ssl_session_cache_misses`

O número de falhas no cache de sessão SSL.

* `Ssl_session_cache_mode`

O modo de cache de sessão SSL.

* `Ssl_session_cache_overflows`

O número de transbordamentos de cache de sessão SSL.

* `Ssl_session_cache_size`

O tamanho do cache de sessão SSL.

* `Ssl_session_cache_timeouts`

O número de expirações de cache de sessão SSL.

* `Ssl_sessions_reused`

Isso é igual a 0 se o TLS não foi usado na sessão atual do MySQL, ou se uma sessão TLS não foi reutilizada; caso contrário, é igual a 1.

`Ssl_sessions_reused` tem escopo de sessão.

* `Ssl_used_session_cache_entries`

Quantas entradas de cache de sessão SSL foram usadas.

* `Ssl_verify_depth`

A profundidade de verificação para conexões SSL de replicação.

* `Ssl_verify_mode`

O modo de verificação usado pelo servidor para uma conexão que utiliza SSL. O valor é uma máscara de bits; os bits são definidos no arquivo de cabeçalho `openssl/ssl.h`:

  ```sql
  # define SSL_VERIFY_NONE                 0x00
  # define SSL_VERIFY_PEER                 0x01
  # define SSL_VERIFY_FAIL_IF_NO_PEER_CERT 0x02
  # define SSL_VERIFY_CLIENT_ONCE          0x04
  ```

`SSL_VERIFY_PEER` indica que o servidor solicita um certificado do cliente. Se o cliente fornecer um, o servidor realiza a verificação e prossegue apenas se a verificação for bem-sucedida. `SSL_VERIFY_CLIENT_ONCE` indica que uma solicitação do certificado do cliente é feita apenas no aperto inicial.

* `Ssl_version`

A versão do protocolo SSL da conexão (por exemplo, TLSv1). Se a conexão não estiver criptografada, o valor é vazio.

* `Table_locks_immediate`

O número de vezes em que um pedido de bloqueio de tabela pode ser concedido imediatamente.

* `Table_locks_waited`

O número de vezes em que um pedido de bloqueio de tabela não pôde ser concedido imediatamente e foi necessário esperar. Se esse número for alto e você tiver problemas de desempenho, você deve primeiro otimizar suas consultas e, em seguida, dividir sua tabela ou tabelas ou usar replicação.

* `Table_open_cache_hits`

O número de resultados de busca de cache de mesas abertas.

* `Table_open_cache_misses`

O número de falhas para buscas de cache de tabelas abertas.

* `Table_open_cache_overflows`

O número de transbordamentos para o cache de tabelas abertas. Este é o número de vezes, após uma tabela ser aberta ou fechada, em que uma instância de cache tem uma entrada não utilizada e o tamanho da instância é maior que `table_open_cache` / `table_open_cache_instances`.

* `Tc_log_max_pages_used`

Para a implementação mapeada na memória do log que é usada pelo `mysqld` quando atua como coordenador de transação para a recuperação de transações internas XA, esta variável indica o maior número de páginas usadas para o log desde que o servidor foi iniciado. Se o produto de `Tc_log_max_pages_used` e `Tc_log_page_size` sempre for significativamente menor que o tamanho do log, o tamanho é maior do que o necessário e pode ser reduzido. (O tamanho é definido pela opção `--log-tc-size`. Esta variável não é usada: não é necessária para a recuperação com base em log binário, e o método de registro de recuperação mapeada na memória não é usado a menos que o número de motores de armazenamento que são capazes de dois estágios de compromisso e que suportam transações XA seja maior que um. (`InnoDB` é o único motor aplicável.)

* `Tc_log_page_size`

O tamanho da página usado para a implementação mapeada à memória do log de recuperação XA. O valor padrão é determinado usando `getpagesize()`. Esta variável é inutilizada pelas mesmas razões descritas para `Tc_log_max_pages_used`.

* `Tc_log_page_waits`

Para a implementação mapeada à memória do log de recuperação, essa variável é incrementada cada vez que o servidor não conseguiu comprometer uma transação e teve que esperar por uma página livre no log. Se esse valor for grande, você pode querer aumentar o tamanho do log (com a opção [[`--log-tc-size`]). Para a recuperação com base em log binário, essa variável é incrementada cada vez que o log binário não pode ser fechado porque há compromissos de duas fases em progresso. (A operação de fechamento espera até que todas essas transações sejam concluídas.)

* `Threads_cached`

O número de threads na cache de threads.

Essa variável não é significativa no servidor integrado (`libmysqld`) e, a partir do MySQL 5.7.2, ela não é mais visível no servidor integrado.

* `Threads_connected`

O número de conexões atualmente abertas.

* `Threads_created`

O número de threads criadas para lidar com as conexões. Se `Threads_created` é grande, você pode querer aumentar o valor de `thread_cache_size`. A taxa de falha de cache pode ser calculada como `Threads_created`/`Connections`.

* `Threads_running`

O número de threads que não estão dormindo.

* `Uptime`

O número de segundos que o servidor está ativo.

* `Uptime_since_flush_status`

O número de segundos desde a última declaração `FLUSH STATUS`.

### 5.1.10 Modos SQL do servidor

O servidor MySQL pode operar em diferentes modos SQL e pode aplicar esses modos de maneira diferente para diferentes clientes, dependendo do valor da variável de sistema `sql_mode`. Os administradores de banco de dados podem definir o modo SQL global para atender aos requisitos do servidor do site, e cada aplicativo pode definir seu modo SQL de sessão de acordo com suas próprias necessidades.

Os modos afetam a sintaxe SQL que o MySQL suporta e as verificações de validação de dados que ele realiza. Isso facilita o uso do MySQL em diferentes ambientes e o uso do MySQL junto com outros servidores de banco de dados.

* Configurando o Modo SQL
* Os Modos SQL Mais Importantes
* Lista Completa dos Modos SQL
* Modos SQL Combinados
* Modo SQL Estrito
* Comparação do Palavra-Chave IGNORE e Modo SQL Estrito
* Alterações no Modo SQL em MySQL 5.7

Para respostas a perguntas frequentemente feitas sobre os modos SQL do servidor no MySQL, consulte a Seção A.3, “Perguntas frequentes do MySQL 5.7: Modo SQL do servidor”.

Ao trabalhar com as tabelas `InnoDB`, considere também a variável de sistema `innodb_strict_mode`. Ela permite verificações de erro adicionais para as tabelas `InnoDB`.

#### Configurando o Modo SQL

O modo SQL padrão no MySQL 5.7 inclui esses modos: `ONLY_FULL_GROUP_BY`, `STRICT_TRANS_TABLES`, `NO_ZERO_IN_DATE`, `NO_ZERO_DATE`, `ERROR_FOR_DIVISION_BY_ZERO`, `NO_AUTO_CREATE_USER` e `NO_ENGINE_SUBSTITUTION`.

Esses modos foram adicionados ao modo SQL padrão no MySQL 5.7: Os modos `ONLY_FULL_GROUP_BY` e `STRICT_TRANS_TABLES` foram adicionados no MySQL 5.7.5. O modo `NO_AUTO_CREATE_USER` foi adicionado no MySQL 5.7.7. Os modos `ERROR_FOR_DIVISION_BY_ZERO`, `NO_ZERO_DATE` e `NO_ZERO_IN_DATE` foram adicionados no MySQL 5.7.8. Para uma discussão adicional sobre essas mudanças no valor do modo SQL padrão, consulte Mudanças no Modo SQL no MySQL 5.7.

Para definir o modo SQL na inicialização do servidor, use a opção `--sql-mode="modes"` na string de comando, ou `sql-mode="modes"` em um arquivo de opção, como `my.cnf` (sistemas operacionais Unix) ou `my.ini` (Windows). *`modes`* é uma lista de diferentes modos separados por vírgulas. Para limpar explicitamente o modo SQL, configure-o como uma string vazia usando `--sql-mode=""` na string de comando, ou `sql-mode=""` em um arquivo de opção.

Nota

Os programas de instalação do MySQL podem configurar o modo SQL durante o processo de instalação. Se o modo SQL for diferente do padrão ou do que você espera, verifique se há uma configuração em um arquivo de opção que o servidor lê no início.

Para alterar o modo SQL em tempo de execução, defina a variável de sistema global ou de sessão `sql_mode` usando uma declaração `SET`:

```sql
SET GLOBAL sql_mode = 'modes';
SET SESSION sql_mode = 'modes';
```

Definir a variável `GLOBAL` requer o privilégio `SUPER` e afeta o funcionamento de todos os clientes que se conectam a partir desse momento. Definir a variável `SESSION` afeta apenas o cliente atual. Cada cliente pode alterar o valor da sessão `sql_mode` a qualquer momento.

Para determinar o valor atual do ajuste global ou de sessão `sql_mode`, selecione seu valor:

```sql
SELECT @@GLOBAL.sql_mode;
SELECT @@SESSION.sql_mode;
```

Importante

Modo SQL e particionamento definido pelo usuário. Mudar o modo SQL do servidor após criar e inserir dados em tabelas particionadas pode causar mudanças significativas no comportamento dessas tabelas e pode levar à perda ou corrupção de dados. É altamente recomendável que você nunca mude o modo SQL uma vez que tenha criado tabelas que utilizam particionamento definido pelo usuário.

Quando se replicam tabelas particionadas, modos SQL diferentes no banco de dados fonte e na replica também podem causar problemas. Para obter os melhores resultados, você deve sempre usar o mesmo modo SQL do servidor no banco de dados fonte e na replica.

Para mais informações, consulte a Seção 22.6, “Restrições e Limitações sobre Partição”.

#### Os modos SQL mais importantes

Os valores mais importantes do `sql_mode` são provavelmente estes:

* `ANSI`

Esse modo altera a sintaxe e o comportamento para se conformar mais de perto com o SQL padrão. É um dos modos de combinação especiais listados no final desta seção.

* `STRICT_TRANS_TABLES`

Se um valor não puder ser inserido conforme especificado em uma tabela transacional, interrompa a declaração. Para uma tabela não transacional, interrompa a declaração se o valor ocorrer em uma declaração de uma única string ou na primeira string de uma declaração de várias strings. Mais detalhes são fornecidos mais adiante nesta seção.

A partir do MySQL 5.7.5, o modo SQL padrão inclui `STRICT_TRANS_TABLES`.

* `TRADITIONAL`

Faça o MySQL se comportar como um sistema de banco de dados SQL “tradicional”. Uma descrição simples desse modo é “dar um erro em vez de um aviso” ao inserir um valor incorreto em uma coluna. É um dos modos de combinação especiais listados no final desta seção.

Nota

Com o modo `TRADITIONAL` ativado, um `INSERT` ou `UPDATE` é interrompido assim que ocorre um erro. Se você estiver usando um motor de armazenamento não transacional, isso pode não ser o que você deseja, pois as alterações de dados feitas antes do erro podem não ser revertidas, resultando em uma atualização "parcialmente feita".

Quando este manual se refere a “modo estrito”, ele significa um modo com `STRICT_TRANS_TABLES` ou `STRICT_ALL_TABLES` habilitado ou ambos.

#### Lista completa dos modos SQL

A lista a seguir descreve todos os modos de SQL suportados:

* `ALLOW_INVALID_DATES`

Não realize verificações completas das datas. Verifique apenas que o mês esteja na faixa de 1 a 12 e o dia na faixa de 1 a 31. Isso pode ser útil para aplicações da Web que obtêm ano, mês e dia em três campos diferentes e armazenam exatamente o que o usuário inseriu, sem validação de data. Esse modo se aplica às colunas `DATE` e `DATETIME`. Não se aplica às colunas `TIMESTAMP`, que sempre requerem uma data válida.

Com `ALLOW_INVALID_DATES` desativado, o servidor exige que os valores do mês e do dia sejam válidos e não apenas dentro do intervalo de 1 a 12 e 1 a 31, respectivamente. Com o modo rigoroso desativado, datas inválidas, como `'2004-04-31'`, são convertidas em `'0000-00-00'` e um aviso é gerado. Com o modo rigoroso ativado, datas inválidas geram um erro. Para permitir tais datas, ative `ALLOW_INVALID_DATES`.

* `ANSI_QUOTES`

Se você tratar `"` como um caractere de citação de identificador (como o `` ` ` quote character) and not as a string quote character. You can still use ` ` ` ANSI_QUOTES`, não pode usar aspas duplas para citar strings literais, porque elas são interpretadas como identificadores.

* `ERROR_FOR_DIVISION_BY_ZERO`

O modo `ERROR_FOR_DIVISION_BY_ZERO` afeta o tratamento da divisão por zero, que inclui `MOD(N,0)`. Para operações de mudança de dados (`INSERT`, `UPDATE`), seu efeito também depende se o modo SQL rigoroso está habilitado.

+ Se este modo não estiver habilitado, a divisão por zero insere `NULL` e não produz nenhum aviso.

+ Se este modo estiver ativado, a divisão por zero insere `NULL` e produz um aviso.

+ Se este modo e o modo estrito forem ativados, a divisão por zero produzirá um erro, a menos que `IGNORE` também seja fornecido. Para `INSERT IGNORE` e `UPDATE IGNORE`, a divisão por zero insere `NULL` e produz um aviso.

Para `SELECT`, a divisão por zero retorna `NULL`. A ativação de `ERROR_FOR_DIVISION_BY_ZERO` também gera um aviso, independentemente de o modo estrito estar habilitado.

`ERROR_FOR_DIVISION_BY_ZERO` é descontinuado. `ERROR_FOR_DIVISION_BY_ZERO` não faz parte do modo estrito, mas deve ser usado em conjunto com o modo estrito e é ativado por padrão. Um aviso ocorre se `ERROR_FOR_DIVISION_BY_ZERO` for ativado sem também ativar o modo estrito ou vice-versa. Para discussão adicional, consulte Mudanças no Modo SQL no MySQL 5.7.

Porque `ERROR_FOR_DIVISION_BY_ZERO` é desatualizado; espere que ele seja removido em uma versão futura do MySQL como um nome de modo separado e seu efeito incluído nos efeitos do modo SQL rigoroso.

* `HIGH_NOT_PRECEDENCE`

A precedência do operador `NOT` é tal que expressões como `NOT a BETWEEN b AND c` são analisadas como `NOT (a BETWEEN b AND c)`. Em algumas versões mais antigas do MySQL, a expressão era analisada como `(NOT a) BETWEEN b AND c`. O comportamento antigo de precedência mais alta pode ser obtido ao habilitar o modo SQL `HIGH_NOT_PRECEDENCE`.

  ```sql
  mysql> SET sql_mode = '';
  mysql> SELECT NOT 1 BETWEEN -5 AND 5;
          -> 0
  mysql> SET sql_mode = 'HIGH_NOT_PRECEDENCE';
  mysql> SELECT NOT 1 BETWEEN -5 AND 5;
          -> 1
  ```

* `IGNORE_SPACE`

Permita espaços entre o nome de uma função e o caractere `(`. Isso faz com que os nomes de funções embutidas sejam tratados como palavras reservadas. Como resultado, identificadores que são iguais aos nomes de funções devem ser citados como descrito na Seção 9.2, “Nomes de Objetos do Esquema”. Por exemplo, porque existe uma função `COUNT()`, o uso de `count` como nome de tabela na seguinte declaração causa um erro:

  ```sql
  mysql> CREATE TABLE count (i INT);
  ERROR 1064 (42000): You have an error in your SQL syntax
  ```

O nome da tabela deve ser citado:

  ```sql
  mysql> CREATE TABLE `count` (i INT);
  Query OK, 0 rows affected (0.00 sec)
  ```

O modo SQL `IGNORE_SPACE` se aplica a funções embutidas, não a funções carregáveis ou funções armazenadas. É sempre permitido ter espaços após o nome de uma função carregável ou uma função armazenada, independentemente de `IGNORE_SPACE` estar habilitado.

Para uma discussão adicional sobre `IGNORE_SPACE`, consulte a Seção 9.2.5, “Parágrafo e Resolução do Nome da Função”.

* `NO_AUTO_CREATE_USER`

Evite que a declaração `GRANT` crie automaticamente novas contas de usuário, a menos que informações de autenticação sejam especificadas. A declaração deve especificar uma senha não vazia usando `IDENTIFIED BY` ou um plugin de autenticação usando `IDENTIFIED WITH`.

É preferível criar contas MySQL com `CREATE USER` em vez de `GRANT`. `NO_AUTO_CREATE_USER` é desatualizado e o modo SQL padrão inclui `NO_AUTO_CREATE_USER`. As atribuições a `sql_mode` que alteram o estado do modo `NO_AUTO_CREATE_USER` produzem um aviso, exceto as atribuições que definem `sql_mode` para `DEFAULT`. Espera-se que `NO_AUTO_CREATE_USER` seja removido em uma futura versão do MySQL, e que seu efeito seja ativado o tempo todo (e que `GRANT` não crie contas mais).

Anteriormente, antes de `NO_AUTO_CREATE_USER` ser descontinuado, uma razão para não habilitá-lo era que ele não era seguro para replicação. Agora, ele pode ser habilitado e a gestão de usuários segura para replicação pode ser realizada com `CREATE USER IF NOT EXISTS`, `DROP USER IF EXISTS` e `ALTER USER IF EXISTS`, em vez de `GRANT`. Essas declarações permitem a replicação segura quando as réplicas podem ter diferentes concessões do que as do banco de origem. Veja a Seção 13.7.1.2, “Declaração CREATE USER”, a Seção 13.7.1.3, “Declaração DROP USER” e a Seção 13.7.1.1, “Declaração ALTER USER”.

* `NO_AUTO_VALUE_ON_ZERO`

`NO_AUTO_VALUE_ON_ZERO` afeta o manuseio das colunas `AUTO_INCREMENT`. Normalmente, você gera o próximo número de sequência para a coluna inserindo `NULL` ou `0` nela. `NO_AUTO_VALUE_ON_ZERO` suprime esse comportamento para `0`, de modo que apenas `NULL` gere o próximo número de sequência.

Este modo pode ser útil se `0` tiver sido armazenado na coluna `AUTO_INCREMENT` de uma tabela. (Por sinal, armazenar `0` não é uma prática recomendada.) Por exemplo, se você descarregar a tabela com **mysqldump** e depois recarregar, o MySQL normalmente gera novos números de sequência quando encontra os valores de `0`, resultando em uma tabela com conteúdo diferente do que foi descarregado. Habilitar `NO_AUTO_VALUE_ON_ZERO` antes de recarregar o arquivo de dump resolve esse problema. Por essa razão, **mysqldump** inclui automaticamente em sua saída uma declaração que habilita `NO_AUTO_VALUE_ON_ZERO`.

* `NO_BACKSLASH_ESCAPES`

Ativação desse modo desativa o uso do caractere barra invertida (`\`) como caractere de escape dentro de strings e identificadores. Com esse modo ativado, a barra invertida se torna um caractere comum, como qualquer outro, e a sequência de escape padrão para expressões `LIKE` é alterada para que nenhum caractere de escape seja usado.

* `NO_DIR_IN_CREATE`

Ao criar uma tabela, ignore todas as diretivas `INDEX DIRECTORY` e `DATA DIRECTORY`. Esta opção é útil em servidores de replicação de replicação.

* `NO_ENGINE_SUBSTITUTION`

Controle a substituição automática do motor de armazenamento padrão quando uma declaração como `CREATE TABLE` ou `ALTER TABLE` especifica um motor de armazenamento desativado ou não compilado.

Por padrão, `NO_ENGINE_SUBSTITUTION` está habilitado.

Como os motores de armazenamento podem ser substituíveis em tempo de execução, os motores indisponíveis são tratados da mesma maneira:

Com `NO_ENGINE_SUBSTITUTION` desativado, para `CREATE TABLE`, o motor padrão é usado e uma mensagem de alerta ocorre se o motor desejado estiver indisponível. Para `ALTER TABLE`, uma mensagem de alerta ocorre e a tabela não é alterada.

Com `NO_ENGINE_SUBSTITUTION` habilitado, ocorre um erro e a tabela não é criada ou alterada se o motor desejado estiver indisponível.

* `NO_FIELD_OPTIONS`

Não imprima opções de coluna específicas do MySQL na saída de `SHOW CREATE TABLE`. Esse modo é usado pelo **mysqldump** no modo de portabilidade.

Nota

A partir do MySQL 5.7.22, `NO_FIELD_OPTIONS` é descontinuado. Ele é removido no MySQL 8.0.

* `NO_KEY_OPTIONS`

Não imprima opções de índice específicas para MySQL no resultado de `SHOW CREATE TABLE`. Esse modo é usado pelo **mysqldump** no modo de portabilidade.

Nota

A partir do MySQL 5.7.22, `NO_KEY_OPTIONS` é descontinuado. Ele é removido no MySQL 8.0.

* `NO_TABLE_OPTIONS`

Não imprima opções de tabela específicas do MySQL (como `ENGINE`) na saída do `SHOW CREATE TABLE`. Esse modo é usado pelo **mysqldump** no modo de portabilidade.

Nota

A partir do MySQL 5.7.22, `NO_TABLE_OPTIONS` é descontinuado. Ele é removido no MySQL 8.0.

* `NO_UNSIGNED_SUBTRACTION`

A subtração entre valores inteiros, onde um é do tipo `UNSIGNED`, produz um resultado não assinado por padrão. Se o resultado, de outra forma, tivesse sido negativo, resulta em um erro:

  ```sql
  mysql> SET sql_mode = '';
  Query OK, 0 rows affected (0.00 sec)

  mysql> SELECT CAST(0 AS UNSIGNED) - 1;
  ERROR 1690 (22003): BIGINT UNSIGNED value is out of range in '(cast(0 as unsigned) - 1)'
  ```

Se o modo SQL `NO_UNSIGNED_SUBTRACTION` estiver habilitado, o resultado será negativo:

  ```sql
  mysql> SET sql_mode = 'NO_UNSIGNED_SUBTRACTION';
  mysql> SELECT CAST(0 AS UNSIGNED) - 1;
  +-------------------------+
  | CAST(0 AS UNSIGNED) - 1 |
  +-------------------------+
  |                      -1 |
  +-------------------------+
  ```

Se o resultado de uma operação desse tipo for usado para atualizar uma coluna inteira `UNSIGNED`, o resultado é limitado ao valor máximo para o tipo da coluna, ou limitado a 0 se `NO_UNSIGNED_SUBTRACTION` estiver habilitado. Com o modo SQL estrito habilitado, ocorre um erro e a coluna permanece inalterada.

Quando `NO_UNSIGNED_SUBTRACTION` está habilitado, o resultado da subtração é assinado, *mesmo que qualquer operando seja não assinado*. Por exemplo, compare o tipo da coluna `c2` na tabela `t1` com o da coluna `c2` na tabela `t2`:

  ```sql
  mysql> SET sql_mode='';
  mysql> CREATE TABLE test (c1 BIGINT UNSIGNED NOT NULL);
  mysql> CREATE TABLE t1 SELECT c1 - 1 AS c2 FROM test;
  mysql> DESCRIBE t1;
  +-------+---------------------+------+-----+---------+-------+
  | Field | Type                | Null | Key | Default | Extra |
  +-------+---------------------+------+-----+---------+-------+
  | c2    | bigint(21) unsigned | NO   |     | 0       |       |
  +-------+---------------------+------+-----+---------+-------+

  mysql> SET sql_mode='NO_UNSIGNED_SUBTRACTION';
  mysql> CREATE TABLE t2 SELECT c1 - 1 AS c2 FROM test;
  mysql> DESCRIBE t2;
  +-------+------------+------+-----+---------+-------+
  | Field | Type       | Null | Key | Default | Extra |
  +-------+------------+------+-----+---------+-------+
  | c2    | bigint(21) | NO   |     | 0       |       |
  +-------+------------+------+-----+---------+-------+
  ```

Isso significa que `BIGINT UNSIGNED` não é 100% utilizável em todos os contextos. Veja a Seção 12.10, “Funções e Operadores de Cast”.

* `NO_ZERO_DATE`

O modo `NO_ZERO_DATE` afeta se o servidor permite o `'0000-00-00'` como uma data válida. Seu efeito também depende se o modo SQL rigoroso está habilitado.

+ Se este modo não estiver habilitado, `'0000-00-00'` é permitido e os produtos inseridos não geram nenhum aviso.

+ Se este modo estiver habilitado, `'0000-00-00'` é permitido e os produtos inseridos geram um aviso.

+ Se este modo e o modo estrito forem habilitados, `'0000-00-00'` não é permitido e as inserções produzem um erro, a menos que `IGNORE` também seja fornecido. Para `INSERT IGNORE` e `UPDATE IGNORE`, `'0000-00-00'` é permitido e as inserções produzem um aviso.

`NO_ZERO_DATE` é descontinuado. `NO_ZERO_DATE` não faz parte do modo estrito, mas deve ser usado em conjunto com o modo estrito e é ativado por padrão. Um aviso ocorre se `NO_ZERO_DATE` for ativado sem também ativar o modo estrito ou vice-versa. Para discussão adicional, consulte Mudanças no Modo SQL no MySQL 5.7.

Porque `NO_ZERO_DATE` é desatualizado; espere que ele seja removido em um lançamento futuro do MySQL como um nome de modo separado e seu efeito incluído nos efeitos do modo SQL rigoroso.

* `NO_ZERO_IN_DATE`

O modo `NO_ZERO_IN_DATE` afeta se o servidor permite datas em que a parte do ano é não nula, mas o mês ou o dia é 0. (Este modo afeta datas como `'2010-00-01'` ou `'2010-01-00'`, mas não `'0000-00-00'`. Para controlar se o servidor permite `'0000-00-00'`, use o modo `NO_ZERO_DATE`. O efeito de `NO_ZERO_IN_DATE` também depende se o modo SQL rigoroso está habilitado.

+ Se este modo não estiver habilitado, datas com zero partes são permitidas e os insertos não produzem nenhum aviso.

+ Se este modo estiver ativado, as datas com zero partes serão inseridas como `'0000-00-00'` e gerará um aviso.

+ Se este modo e o modo estrito forem habilitados, datas com zero partes não são permitidas e os insertos produzem um erro, a menos que `IGNORE` também seja fornecido. Para `INSERT IGNORE` e `UPDATE IGNORE`, datas com zero partes são inseridas como `'0000-00-00'` e produzem um aviso.

`NO_ZERO_IN_DATE` é descontinuado. `NO_ZERO_IN_DATE` não faz parte do modo estrito, mas deve ser usado em conjunto com o modo estrito e é ativado por padrão. Um aviso ocorre se `NO_ZERO_IN_DATE` for ativado sem também ativar o modo estrito ou vice-versa. Para discussão adicional, consulte Mudanças no Modo SQL no MySQL 5.7.

Porque `NO_ZERO_IN_DATE` é desatualizado; espere que ele seja removido em um lançamento futuro do MySQL como um nome de modo separado e seu efeito incluído nos efeitos do modo SQL rigoroso.

* `ONLY_FULL_GROUP_BY`

Recusar consultas para as quais a lista de seleção, a condição `HAVING` ou a lista `ORDER BY` se referem a colunas não agregadas que não estão nomeadas na cláusula `GROUP BY` nem são funcionalmente dependentes (determinadas de forma única) das colunas `GROUP BY`.

A partir do MySQL 5.7.5, o modo SQL padrão inclui `ONLY_FULL_GROUP_BY`. (Antes do 5.7.5, o MySQL não detecta a dependência funcional e `ONLY_FULL_GROUP_BY` não é ativado por padrão.)

Uma extensão do MySQL para SQL padrão permite referências na cláusula `HAVING` a expressões aliadas na lista de seleção. Antes do MySQL 5.7.5, habilitar `ONLY_FULL_GROUP_BY` desativa essa extensão, exigindo, assim, que a cláusula `HAVING` seja escrita usando expressões não aliadas. A partir do MySQL 5.7.5, essa restrição é levantada para que a cláusula `HAVING` possa se referir a aliases, independentemente de `ONLY_FULL_GROUP_BY` estar habilitado.

Para discussões adicionais e exemplos, consulte a Seção 12.19.3, “Tratamento do MySQL do GROUP BY”.

* `PAD_CHAR_TO_FULL_LENGTH`

Por padrão, os espaços finais são eliminados dos valores das colunas de `CHAR` na recuperação. Se `PAD_CHAR_TO_FULL_LENGTH` estiver habilitado, o corte não ocorre e os valores recuperados de `CHAR` são preenchidos com seu comprimento total. Esse modo não se aplica às colunas de `VARCHAR`, para as quais os espaços finais são retidos na recuperação.

  ```sql
  mysql> CREATE TABLE t1 (c1 CHAR(10));
  Query OK, 0 rows affected (0.37 sec)

  mysql> INSERT INTO t1 (c1) VALUES('xy');
  Query OK, 1 row affected (0.01 sec)

  mysql> SET sql_mode = '';
  Query OK, 0 rows affected (0.00 sec)

  mysql> SELECT c1, CHAR_LENGTH(c1) FROM t1;
  +------+-----------------+
  | c1   | CHAR_LENGTH(c1) |
  +------+-----------------+
  | xy   |               2 |
  +------+-----------------+
  1 row in set (0.00 sec)

  mysql> SET sql_mode = 'PAD_CHAR_TO_FULL_LENGTH';
  Query OK, 0 rows affected (0.00 sec)

  mysql> SELECT c1, CHAR_LENGTH(c1) FROM t1;
  +------------+-----------------+
  | c1         | CHAR_LENGTH(c1) |
  +------------+-----------------+
  | xy         |              10 |
  +------------+-----------------+
  1 row in set (0.00 sec)
  ```

* `PIPES_AS_CONCAT`

Trate `||` como um operador de concatenação de strings (mesmo que `CONCAT()`) e não como sinônimo de `OR`.

* `REAL_AS_FLOAT`

Trate `REAL` - FLOAT, DOUBLE") como sinônimo de `FLOAT` - FLOAT, DOUBLE"). Por padrão, o MySQL trata `REAL` - FLOAT, DOUBLE") como sinônimo de `DOUBLE` - FLOAT, DOUBLE").

* `STRICT_ALL_TABLES`

Ative o modo SQL rigoroso para todos os motores de armazenamento. Os valores de dados inválidos são rejeitados. Para obter mais informações, consulte o Modo SQL rigoroso.

De MySQL 5.7.4 até 5.7.7, `STRICT_ALL_TABLES` inclui o efeito dos modos `ERROR_FOR_DIVISION_BY_ZERO`, `NO_ZERO_DATE` e `NO_ZERO_IN_DATE`. Para uma discussão adicional, consulte Alterações de Modo SQL no MySQL 5.7.

* `STRICT_TRANS_TABLES`

Ative o modo SQL rigoroso para os motores de armazenamento transacional e, quando possível, para os motores de armazenamento não transacional. Para obter detalhes, consulte o modo SQL rigoroso.

De MySQL 5.7.4 até 5.7.7, `STRICT_TRANS_TABLES` inclui o efeito dos modos `ERROR_FOR_DIVISION_BY_ZERO`, `NO_ZERO_DATE` e `NO_ZERO_IN_DATE`. Para uma discussão adicional, consulte Alterações de Modo SQL no MySQL 5.7.

#### Modos de combinação SQL

Os seguintes modos especiais são fornecidos como abreviação para combinações de valores de modo da lista anterior.

* `ANSI`

Equivalente a `REAL_AS_FLOAT`, `PIPES_AS_CONCAT`, `ANSI_QUOTES`, `IGNORE_SPACE` e (a partir do MySQL 5.7.5) `ONLY_FULL_GROUP_BY`.

O modo `ANSI` também faz com que o servidor retorne um erro para consultas onde uma função de conjunto *`S`* com uma referência externa `S(outer_ref)` não pode ser agregada na consulta externa contra a qual a referência externa foi resolvida. Essa é uma consulta do tipo:

  ```sql
  SELECT * FROM t1 WHERE t1.a IN (SELECT MAX(t1.b) FROM t2 WHERE ...);
  ```

Aqui, `MAX(t1.b)` não pode ser agregado na consulta externa porque aparece na cláusula `WHERE` dessa consulta. O SQL padrão exige um erro nessa situação. Se o modo `ANSI` não estiver habilitado, o servidor trata `S(outer_ref)` nessas consultas da mesma maneira que interpretaria `S(const)`.

Veja a Seção 1.6, “Conformidade com os Padrões MySQL”.

* `DB2`

Equivalente a `PIPES_AS_CONCAT`, `ANSI_QUOTES`, `IGNORE_SPACE`, `NO_KEY_OPTIONS`, `NO_TABLE_OPTIONS`, `NO_FIELD_OPTIONS`.

Nota

A partir do MySQL 5.7.22, `DB2` é descontinuado. Ele é removido no MySQL 8.0.

* `MAXDB`

Equivalente a `PIPES_AS_CONCAT`, `ANSI_QUOTES`, `IGNORE_SPACE`, `NO_KEY_OPTIONS`, `NO_TABLE_OPTIONS`, `NO_FIELD_OPTIONS`, `NO_AUTO_CREATE_USER`.

Nota

A partir do MySQL 5.7.22, `MAXDB` é descontinuado. Ele é removido no MySQL 8.0.

* `MSSQL`

Equivalente a `PIPES_AS_CONCAT`, `ANSI_QUOTES`, `IGNORE_SPACE`, `NO_KEY_OPTIONS`, `NO_TABLE_OPTIONS`, `NO_FIELD_OPTIONS`.

Nota

A partir do MySQL 5.7.22, `MSSQL` é descontinuado. Ele é removido no MySQL 8.0.

* `MYSQL323`

Equivalente a `MYSQL323`, `HIGH_NOT_PRECEDENCE`. Isso significa `HIGH_NOT_PRECEDENCE` mais alguns comportamentos `SHOW CREATE TABLE` específicos para `MYSQL323`:

A coluna de exibição do `TIMESTAMP` não inclui os atributos `DEFAULT` ou `ON UPDATE`.

A exibição de coluna de string não inclui atributos de conjunto de caracteres e collation. Para as colunas `CHAR` e `VARCHAR`, se a collation for binária, `BINARY` é anexado ao tipo de coluna.

+ A opção de tabela `ENGINE=engine_name` é exibida como `TYPE=engine_name`.

+ Para as tabelas de `MEMORY`, o mecanismo de armazenamento é exibido como `HEAP`.

Nota

A partir do MySQL 5.7.22, `MYSQL323` é descontinuado. Ele é removido no MySQL 8.0.

* `MYSQL40`

Equivalente a `MYSQL40`, `HIGH_NOT_PRECEDENCE`. Isso significa `HIGH_NOT_PRECEDENCE` mais alguns comportamentos específicos de `MYSQL40`. Estes são os mesmos que para `MYSQL323`, exceto que `SHOW CREATE TABLE` não exibe `HEAP` como o mecanismo de armazenamento para as tabelas de `MEMORY`.

Nota

A partir do MySQL 5.7.22, `MYSQL40` é descontinuado. Ele é removido no MySQL 8.0.

* `ORACLE`

Equivalente a `PIPES_AS_CONCAT`, `ANSI_QUOTES`, `IGNORE_SPACE`, `NO_KEY_OPTIONS`, `NO_TABLE_OPTIONS`, `NO_FIELD_OPTIONS`, `NO_AUTO_CREATE_USER`.

Nota

A partir do MySQL 5.7.22, `ORACLE` é descontinuado. Ele é removido no MySQL 8.0.

* `POSTGRESQL`

Equivalente a `PIPES_AS_CONCAT`, `ANSI_QUOTES`, `IGNORE_SPACE`, `NO_KEY_OPTIONS`, `NO_TABLE_OPTIONS`, `NO_FIELD_OPTIONS`.

Nota

A partir do MySQL 5.7.22, `POSTGRESQL` é descontinuado. Ele é removido no MySQL 8.0.

* `TRADITIONAL`

Antes do MySQL 5.7.4, e no MySQL 5.7.8 e posterior, `TRADITIONAL` é equivalente a `STRICT_TRANS_TABLES`, `STRICT_ALL_TABLES`, `NO_ZERO_IN_DATE`, `NO_ZERO_DATE`, `ERROR_FOR_DIVISION_BY_ZERO`, `NO_AUTO_CREATE_USER` e `NO_ENGINE_SUBSTITUTION`.

De MySQL 5.7.4 a 5.7.7, `TRADITIONAL` é equivalente a `STRICT_TRANS_TABLES`, `STRICT_ALL_TABLES`, `NO_AUTO_CREATE_USER` e `NO_ENGINE_SUBSTITUTION`. Os modos `NO_ZERO_IN_DATE`, `NO_ZERO_DATE` e `ERROR_FOR_DIVISION_BY_ZERO` não têm nomes porque, nessas versões, seus efeitos estão incluídos nos efeitos do modo SQL estrito (`STRICT_ALL_TABLES` ou `STRICT_TRANS_TABLES`). Assim, os efeitos de `TRADITIONAL` são os mesmos em todas as versões do MySQL 5.7 (e os mesmos do MySQL 5.6). Para uma discussão adicional, consulte Mudanças no Modo SQL no MySQL 5.7.

#### Modo SQL rigoroso

O modo estrito controla como o MySQL lida com valores inválidos ou ausentes em declarações de alteração de dados, como `INSERT` ou `UPDATE`. Um valor pode ser inválido por várias razões. Por exemplo, ele pode ter o tipo de dados errado para a coluna, ou pode estar fora do intervalo. Um valor está ausente quando uma nova string a ser inserida não contém um valor para uma coluna que não é `NULL` e que não tem uma cláusula explícita de `DEFAULT` em sua definição. (Para uma coluna `NULL`, `NULL` é inserido se o valor estiver ausente.) O modo estrito também afeta declarações DDL, como `CREATE TABLE`.

Se o modo estrito não estiver em vigor, o MySQL insere valores ajustados para valores inválidos ou ausentes e produz avisos (consulte a Seção 13.7.5.40, “Declaração SHOW WARNINGS”). No modo estrito, você pode produzir esse comportamento usando `INSERT IGNORE` ou `UPDATE IGNORE`.

Para declarações como `SELECT` que não alteram dados, valores inválidos geram um aviso no modo estrito, não um erro.

O modo estrito produz um erro para tentativas de criar uma chave que exceda o comprimento máximo da chave. Quando o modo estrito não está habilitado, isso resulta em um aviso e na redução da chave ao comprimento máximo da chave.

O modo estrito não afeta se as restrições de chave estrangeira são verificadas. `foreign_key_checks` pode ser usado para isso. (Veja a Seção 5.1.7, “Variáveis do Sistema do Servidor”.)

O modo SQL rigoroso está em vigor se `STRICT_ALL_TABLES` ou `STRICT_TRANS_TABLES` estiverem habilitados, embora os efeitos desses modos sejam um pouco diferentes:

* Para tabelas transacionais, ocorre um erro para valores inválidos ou ausentes em uma declaração de alteração de dados quando o `STRICT_ALL_TABLES` ou o `STRICT_TRANS_TABLES` está habilitado. A declaração é interrompida e revertida.

* Para tabelas não transacionais, o comportamento é o mesmo em qualquer modo, se o valor ruim ocorrer na primeira string a ser inserida ou atualizada: a declaração é abortada e a tabela permanece inalterada. Se a declaração inserir ou modificar várias strings e o valor ruim ocorrer na segunda ou string posterior, o resultado depende do modo rigoroso habilitado:

+ Para `STRICT_ALL_TABLES`, o MySQL retorna um erro e ignora o resto das strings. No entanto, como as strings anteriores foram inseridas ou atualizadas, o resultado é uma atualização parcial. Para evitar isso, use declarações de uma única string, que podem ser interrompidas sem alterar a tabela.

+ Para `STRICT_TRANS_TABLES`, o MySQL converte um valor inválido no valor válido mais próximo para a coluna e insere o valor ajustado. Se um valor estiver ausente, o MySQL insere o valor padrão implícito para o tipo de dados da coluna. Em qualquer caso, o MySQL gera um aviso em vez de um erro e continua processando a declaração. Os valores padrão implícitos são descritos na Seção 11.6, “Valores padrão de tipo de dados”.

O modo estrito afeta o tratamento de divisão por zero, datas zero e zeros em datas da seguinte forma:

* O modo estrito afeta o tratamento da divisão por zero, o que inclui `MOD(N,0)`:

Para operações de alteração de dados (`INSERT`, `UPDATE`):

+ Se o modo estrito não estiver habilitado, a divisão por zero insere `NULL` e não produz nenhum aviso.

+ Se o modo estrito estiver habilitado, a divisão por zero produzirá um erro, a menos que `IGNORE` também seja fornecido. Para `INSERT IGNORE` e `UPDATE IGNORE`, a divisão por zero insere `NULL` e produz um aviso.

Para `SELECT`, a divisão por zero retorna `NULL`. Ativação do modo estrito também produz um aviso.

* O modo estrito afeta se o servidor permite `'0000-00-00'` como uma data válida:

+ Se o modo estrito não estiver habilitado, `'0000-00-00'` é permitido e os produtos de inserção não geram aviso.

+ Se o modo estrito estiver habilitado, `'0000-00-00'` não é permitido e as inserções produzem um erro, a menos que `IGNORE` também seja fornecido. Para `INSERT IGNORE` e `UPDATE IGNORE`, `'0000-00-00'` é permitido e as inserções produzem um aviso.

* O modo estrito afeta se o servidor permite datas em que a parte do ano é não nula, mas a parte do mês ou do dia é 0 (datas como `'2010-00-01'` ou `'2010-01-00'`):

+ Se o modo estrito não estiver habilitado, datas com zero partes são permitidas e os insertos não produzem nenhum aviso.

+ Se o modo estrito estiver habilitado, datas com zero partes não são permitidas e os insertos produzem um erro, a menos que `IGNORE` também seja fornecido. Para `INSERT IGNORE` e `UPDATE IGNORE`, datas com zero partes são inseridas como `'0000-00-00'` (que é considerada válida com `IGNORE`) e produzem um aviso.

Para mais informações sobre o modo estrito em relação a `IGNORE`, consulte a comparação entre o termo IGNORE e o modo SQL estrito.

Antes do MySQL 5.7.4, e no MySQL 5.7.8 e posterior, o modo estrito afeta o tratamento da divisão por zero, datas zero e zeros em datas em conjunto com os modos `ERROR_FOR_DIVISION_BY_ZERO`, `NO_ZERO_DATE` e `NO_ZERO_IN_DATE`. A partir do MySQL 5.7.4 até 5.7.7, os modos `ERROR_FOR_DIVISION_BY_ZERO`, `NO_ZERO_DATE` e `NO_ZERO_IN_DATE` não fazem nada quando nomeados explicitamente e seus efeitos estão incluídos nos efeitos do modo estrito. Para discussão adicional, consulte Mudanças no Modo SQL no MySQL 5.7.

#### Comparação do Palavra-chave IGNORE e Modo SQL Estrito

Esta seção compara o efeito na execução da declaração do termo `IGNORE` (que desvaloriza erros em avisos) e o modo SQL rigoroso (que eleva avisos a erros). Ela descreve quais declarações elas afetam e quais erros elas aplicam.

A tabela a seguir apresenta uma comparação resumida do comportamento da declaração quando o padrão é produzir um erro em vez de uma advertência. Um exemplo de quando o padrão é produzir um erro é inserir um `NULL` em uma coluna `NOT NULL`. Um exemplo de quando o padrão é produzir uma advertência é inserir um valor do tipo de dados errado em uma coluna (como inserir a string `'abc'` em uma coluna de número inteiro).

<table summary="Comparison of statement behavior when the default is to produce an error versus a warning."><col style="width: 33%"/><col style="width: 33%"/><col style="width: 33%"/><thead><tr> <th>Modo operacional</th> <th>Quando a Definição Padrão de Declaração é Erro</th> <th>Quando a Definição Padrão de Declaração é Aviso</th> </tr></thead><tbody><tr> <th>Sem<code>IGNORE</code>ou modo SQL rigoroso</th> <td>Erro</td> <td>Aviso</td> </tr><tr> <th>Com<code>IGNORE</code></th> <td>Aviso</td> <td>Aviso (mesmo que sem<code>IGNORE</code>ou modo SQL rigoroso)</td> </tr><tr> <th>Com modo SQL rigoroso</th> <td>Erro (mesmo que sem<code>IGNORE</code>ou modo SQL rigoroso)</td> <td>Erro</td> </tr><tr> <th>Com<code>IGNORE</code>e modo SQL rigoroso</th> <td>Aviso</td> <td>Aviso</td> </tr></tbody></table>

Uma conclusão a retirar da tabela é que, quando a palavra-chave `IGNORE` e o modo SQL rigoroso estão em vigor, a `IGNORE` tem precedência. Isso significa que, embora `IGNORE` e o modo SQL rigoroso possam ser considerados ter efeitos opostos no tratamento de erros, eles não se cancelam quando usados juntos.

* O efeito do IGNORE na execução de declarações
* O efeito do modo SQL estrito na execução de declarações

##### O efeito do IGNORE na execução da declaração

Várias declarações no MySQL suportam uma palavra-chave opcional `IGNORE`. Esta palavra-chave faz com que o servidor desvalorize certos tipos de erros e gere avisos em vez disso. Para uma declaração de várias strings, desvalorizar um erro para um aviso pode permitir que uma string seja processada. Caso contrário, `IGNORE` faz com que a declaração passe para a próxima string em vez de abortar. (Para erros não ignoráveis, um erro ocorre independentemente da palavra-chave `IGNORE`.)

Exemplo: Se a tabela `t` tiver uma coluna de chave primária `i` contendo valores únicos, tentar inserir o mesmo valor de `i` em várias strings normalmente produz um erro de chave duplicada:

```sql
mysql> CREATE TABLE t (i INT NOT NULL PRIMARY KEY);
mysql> INSERT INTO t (i) VALUES(1),(1);
ERROR 1062 (23000): Duplicate entry '1' for key 'PRIMARY'
```

Com `IGNORE`, a string contendo a chave duplicada ainda não é inserida, mas ocorre um aviso em vez de um erro:

```sql
mysql> INSERT IGNORE INTO t (i) VALUES(1),(1);
Query OK, 1 row affected, 1 warning (0.01 sec)
Records: 2  Duplicates: 1  Warnings: 1

mysql> SHOW WARNINGS;
+---------+------+---------------------------------------+
| Level   | Code | Message                               |
+---------+------+---------------------------------------+
| Warning | 1062 | Duplicate entry '1' for key 'PRIMARY' |
+---------+------+---------------------------------------+
1 row in set (0.00 sec)
```

Exemplo: Se a tabela `t2` tiver uma coluna `NOT NULL` `id`, ao tentar inserir `NULL`, será gerado um erro no modo SQL rigoroso:

```sql
mysql> CREATE TABLE t2 (id INT NOT NULL);
mysql> INSERT INTO t2 (id) VALUES(1),(NULL),(3);
ERROR 1048 (23000): Column 'id' cannot be null
mysql> SELECT * FROM t2;
Empty set (0.00 sec)
```

Se o modo SQL não for estrito, `IGNORE` faz com que `NULL` seja inserido como o valor padrão implícito da coluna (0 neste caso), o que permite que a string seja tratada sem ignorá-la:

```sql
mysql> INSERT INTO t2 (id) VALUES(1),(NULL),(3);
mysql> SELECT * FROM t2;
+----+
| id |
+----+
|  1 |
|  0 |
|  3 |
+----+
```

Essas declarações dão suporte à palavra-chave `IGNORE`:

* `CREATE TABLE ... SELECT`: `IGNORE` não se aplica às partes `CREATE TABLE` ou `SELECT` da declaração, mas sim aos insertos na tabela de strings produzidos pelo `SELECT`. As strings que duplicam uma string existente em um valor de chave única são descartadas.

* `DELETE`: `IGNORE` faz com que o MySQL ignore erros durante o processo de exclusão de strings.

* `INSERT`: Com `IGNORE`, as strings que duplicam uma string existente em um valor de chave única são descartadas. As strings definidas com valores que causariam erros de conversão de dados são definidas com os valores mais próximos dos válidos, em vez disso.

Para tabelas particionadas onde não é encontrado um particionamento que corresponda a um valor dado, `IGNORE` faz com que a operação de inserção falhe silenciosamente para as strings que contêm o valor não correspondente.

* `LOAD DATA`, `LOAD XML`: Com `IGNORE`, as strings que duplicam uma string existente em um valor de chave única são descartadas.

* `UPDATE`: Com `IGNORE`, as strings para as quais conflitos de chave duplicada ocorrem em um valor de chave única não são atualizadas. As strings atualizadas para valores que causariam erros de conversão de dados são atualizadas para os valores mais próximos dos válidos, em vez disso.

A palavra-chave `IGNORE` se aplica aos seguintes erros ignoráveis:

* `ER_BAD_NULL_ERROR`
* `ER_DUP_ENTRY`
* `ER_DUP_ENTRY_WITH_KEY_NAME`
* `ER_DUP_KEY`
* `ER_NO_PARTITION_FOR_GIVEN_VALUE`
* `ER_NO_PARTITION_FOR_GIVEN_VALUE_SILENT`
* `ER_NO_REFERENCED_ROW_2`
* `ER_ROW_DOES_NOT_MATCH_GIVEN_PARTITION_SET`
* `ER_ROW_IS_REFERENCED_2`
* `ER_SUBQUERY_NO_1_ROW`
* `ER_VIEW_CHECK_FAILED`

##### O efeito do modo SQL rigoroso na execução das declarações

O servidor MySQL pode operar em diferentes modos SQL e pode aplicar esses modos de maneira diferente para diferentes clientes, dependendo do valor da variável de sistema `sql_mode`. No modo SQL "estricto", o servidor atualiza certos avisos em erros.

Por exemplo, no modo SQL não estrito, inserir a string `'abc'` em uma coluna inteira resulta em conversão do valor para 0 e um aviso:

```sql
mysql> SET sql_mode = '';
Query OK, 0 rows affected (0.00 sec)

mysql> INSERT INTO t (i) VALUES('abc');
Query OK, 1 row affected, 1 warning (0.01 sec)

mysql> SHOW WARNINGS;
+---------+------+--------------------------------------------------------+
| Level   | Code | Message                                                |
+---------+------+--------------------------------------------------------+
| Warning | 1366 | Incorrect integer value: 'abc' for column 'i' at row 1 |
+---------+------+--------------------------------------------------------+
1 row in set (0.00 sec)
```

No modo SQL estrito, o valor inválido é rejeitado com um erro:

```sql
mysql> SET sql_mode = 'STRICT_ALL_TABLES';
Query OK, 0 rows affected (0.00 sec)

mysql> INSERT INTO t (i) VALUES('abc');
ERROR 1366 (HY000): Incorrect integer value: 'abc' for column 'i' at row 1
```

Para mais informações sobre as possíveis configurações da variável de sistema `sql_mode`, consulte a Seção 5.1.10, “Modos SQL do servidor”.

O modo SQL rigoroso se aplica às seguintes declarações em condições nas quais algum valor pode estar fora do intervalo ou uma string inválida pode ser inserida ou excluída de uma tabela:

* `ALTER TABLE`
* `CREATE TABLE`
* `CREATE TABLE ... SELECT`

* `DELETE` (tanto tabela única quanto tabela múltipla)

* `INSERT`
* `LOAD DATA`
* `LOAD XML`
* `SELECT SLEEP()`

* `UPDATE` (tanto tabela única quanto tabela múltipla)

Dentro dos programas armazenados, as declarações individuais dos tipos listados acima são executadas no modo SQL estrito se o programa foi definido enquanto o modo estrito estava em vigor.

O modo SQL rigoroso se aplica aos seguintes erros, que representam uma classe de erros em que um valor de entrada é inválido ou está ausente. Um valor é inválido se tiver o tipo de dados errado para a coluna ou pode estar fora do intervalo. Um valor está ausente se uma nova string a ser inserida não contiver um valor para uma coluna `NOT NULL` que não tenha uma cláusula `DEFAULT` explícita em sua definição.

```sql
ER_BAD_NULL_ERROR
ER_CUT_VALUE_GROUP_CONCAT
ER_DATA_TOO_LONG
ER_DATETIME_FUNCTION_OVERFLOW
ER_DIVISION_BY_ZERO
ER_INVALID_ARGUMENT_FOR_LOGARITHM
ER_NO_DEFAULT_FOR_FIELD
ER_NO_DEFAULT_FOR_VIEW_FIELD
ER_TOO_LONG_KEY
ER_TRUNCATED_WRONG_VALUE
ER_TRUNCATED_WRONG_VALUE_FOR_FIELD
ER_WARN_DATA_OUT_OF_RANGE
ER_WARN_NULL_TO_NOTNULL
ER_WARN_TOO_FEW_RECORDS
ER_WRONG_ARGUMENTS
ER_WRONG_VALUE_FOR_TYPE
WARN_DATA_TRUNCATED
```

Nota

Como o desenvolvimento contínuo do MySQL define novos erros, pode haver erros que não estão na lista anterior para os quais o modo SQL rigoroso se aplica.

#### Alterações no Modo SQL no MySQL 5.7

No MySQL 5.7.22, esses modos SQL são desatualizados e são removidos no MySQL 8.0: `DB2`, `MAXDB`, `MSSQL`, `MYSQL323`, `MYSQL40`, `ORACLE`, `POSTGRESQL`, `NO_FIELD_OPTIONS`, `NO_KEY_OPTIONS`, `NO_TABLE_OPTIONS`.

No MySQL 5.7, o modo `ONLY_FULL_GROUP_BY` SQL é ativado por padrão porque o processamento `GROUP BY` tornou-se mais sofisticado para incluir a detecção de dependências funcionais. No entanto, se você encontrar que ter o `ONLY_FULL_GROUP_BY` ativado faz com que as consultas para aplicações existentes sejam rejeitadas, uma dessas ações deve restaurar o funcionamento:

* Se for possível modificar uma consulta que contenha uma coluna incorreta, faça isso de tal forma que as colunas não agregadas dependam funcionalmente das colunas de `GROUP BY`, ou faça referência às colunas não agregadas usando `ANY_VALUE()`.

* Se não for possível modificar uma consulta que contenha uma violação (por exemplo, se ela foi gerada por uma aplicação de terceiros), configure a variável de sistema `sql_mode` na inicialização do servidor para não habilitar `ONLY_FULL_GROUP_BY`.

No MySQL 5.7, os modos SQL `ERROR_FOR_DIVISION_BY_ZERO`, `NO_ZERO_DATE` e `NO_ZERO_IN_DATE` são desaconselhados. O plano a longo prazo é incluir os três modos no modo SQL estrito e removê-los como modos explícitos em uma versão futura do MySQL. Para compatibilidade no MySQL 5.7 com o modo estrito do MySQL 5.6 e para fornecer um tempo adicional para que as aplicações afetadas sejam modificadas, os seguintes comportamentos se aplicam:

* `ERROR_FOR_DIVISION_BY_ZERO`, `NO_ZERO_DATE` e `NO_ZERO_IN_DATE` não fazem parte do modo SQL estrito, mas é pretendido que sejam usados juntamente com o modo estrito. Como um lembrete, um aviso ocorre se eles forem habilitados sem também habilitar o modo estrito ou vice-versa.

* `ERROR_FOR_DIVISION_BY_ZERO`, `NO_ZERO_DATE` e `NO_ZERO_IN_DATE` são habilitados por padrão.

Com as mudanças anteriores, a verificação de dados mais rigorosa ainda está habilitada por padrão, mas os modos individuais podem ser desativados em ambientes onde atualmente é desejável ou necessário fazê-lo.

### 5.1.11 Gerenciamento de Conexão

Esta seção descreve como o MySQL Server gerencia as conexões. Isso inclui uma descrição das interfaces de conexão disponíveis, como o servidor usa os threads de manipulador de conexão, detalhes sobre a interface de conexão administrativa e a gestão de pesquisas DNS.

#### 5.1.11.1 Interfaces de conexão

Esta seção descreve aspectos sobre como o servidor MySQL gerencia as conexões dos clientes.

* Interfaces de rede e gerenciamento de conexões
* Gerenciamento de threads de conexão do cliente
* Gerenciamento de volume de conexão

##### Interfaces de rede e Threads do Gerenciador de Conexão

O servidor é capaz de ouvir conexões de clientes em várias interfaces de rede. Os threads do gerenciador de conexão lidam com solicitações de conexão de clientes nas interfaces de rede que o servidor escuta:

* Em todas as plataformas, um thread de gerenciamento lida com os pedidos de conexão TCP/IP.

* No Unix, o mesmo thread do gerenciador também lida com solicitações de conexão de arquivos de soquete Unix.

* No Windows, um thread de gerenciamento lida com os pedidos de conexão de memória compartilhada, e outro lida com os pedidos de conexão de canal nomeado.

O servidor não cria threads para lidar com interfaces que ele não escuta. Por exemplo, um servidor Windows que não tem suporte para conexões de canal nomeado habilitado não cria uma thread para lidar com elas.

Os plugins ou componentes de servidor individual podem implementar sua própria interface de conexão:

* O X Plugin permite que o MySQL Server se comunique com clientes usando o Protocolo X. Veja a Seção 19.4, “X Plugin”.

##### Gerenciamento de Threads de Conexão do Cliente

Os threads do gerenciador de conexão associam cada conexão do cliente a um thread dedicado a ela que lida com a autenticação e o processamento de solicitações para essa conexão. Os threads do gerenciador criam um novo thread quando necessário, mas tentam evitar fazer isso consultando primeiro o cache de threads para ver se ele contém um thread que pode ser usado para a conexão. Quando uma conexão termina, seu thread é devolvido ao cache de threads se o cache não estiver cheio.

Nesse modelo de thread de conexão, há tantos threads quanto clientes atualmente conectados, o que tem algumas desvantagens quando a carga de trabalho do servidor deve escalar para lidar com um grande número de conexões. Por exemplo, a criação e a eliminação de threads se tornam caras. Além disso, cada thread requer recursos do servidor e do kernel, como espaço de pilha. Para acomodar um grande número de conexões simultâneas, o tamanho da pilha por thread deve ser mantido pequeno, levando a uma situação em que ela é ou muito pequena ou o servidor consome grandes quantidades de memória. A exaustão de outros recursos também pode ocorrer, e o custo de escalonamento pode se tornar significativo.

A Edição Empresarial do MySQL inclui um plugin de pool de threads que oferece um modelo alternativo de manipulação de threads, projetado para reduzir o custo e melhorar o desempenho. Ele implementa um pool de threads que aumenta o desempenho do servidor, gerenciando eficientemente os threads de execução de instruções para um grande número de conexões de clientes. Veja a Seção 5.5.3, “MySQL Enterprise Thread Pool”.

Para controlar e monitorar como o servidor gerencia os threads que lidam com conexões de clientes, várias variáveis de sistema e status são relevantes. (Veja Seção 5.1.7, “Variáveis de sistema do servidor”, e Seção 5.1.9, “Variáveis de status do servidor”.)

* A variável de sistema `thread_cache_size` determina o tamanho do cache de threads. Por padrão, o servidor ajusta o valor automaticamente ao iniciar, mas pode ser definido explicitamente para ignorar esse valor padrão. Um valor de 0 desativa o cache, o que faz com que um thread seja configurado para cada nova conexão e descartado quando a conexão é encerrada. Para habilitar o *`N`* de threads de conexão inativa a serem cacheados, defina `thread_cache_size` para *`N`* ao iniciar o servidor ou em tempo de execução. Um thread de conexão torna-se inativo quando a conexão do cliente com a qual ele foi associado é encerrada.

* Para monitorar o número de threads na cache e quantos threads foram criados, pois uma thread não pôde ser retirada da cache, verifique as variáveis de status `Threads_cached` e `Threads_created`.

* Quando a pilha de threads é muito pequena, isso limita a complexidade das instruções SQL que o servidor pode manipular, a profundidade de recursão de procedimentos armazenados e outras ações que consomem memória. Para definir um tamanho de pilha de *`N`* bytes para cada thread, inicie o servidor com `thread_stack` definido como *`N`*.

##### Gerenciamento de Volume de Conexão

Para controlar o número máximo de clientes que o servidor permite conectar simultaneamente, defina a variável de sistema `max_connections` no início ou durante o funcionamento do servidor. Pode ser necessário aumentar `max_connections` se mais clientes tentarem se conectar simultaneamente do que o servidor está configurado para lidar (consulte Seção B.3.2.5, “Demasiadas conexões”).

`mysqld` permite, na verdade, `max_connections`

+ 1 conexão de cliente. A conexão extra é reservada para uso por contas que possuem o privilégio `SUPER`. Ao conceder o privilégio aos administradores e não aos usuários normais (que não deveriam precisar disso), um administrador que também possui o privilégio `PROCESS` pode se conectar ao servidor e usar `SHOW PROCESSLIST` para diagnosticar problemas, mesmo que o número máximo de clientes não privilegiados estejam conectados. Veja a Seção 13.7.5.29, “Declaração SHOW PROCESSLIST”.

Se o servidor recusar uma conexão porque o limite `max_connections` é atingido, ele incrementa a variável de status `Connection_errors_max_connections`.

O número máximo de conexões que o MySQL suporta (ou seja, o valor máximo ao qual `max_connections` pode ser ajustado) depende de vários fatores:

* A qualidade da biblioteca de threads em uma plataforma específica.
* A quantidade de RAM disponível.
* A quantidade de RAM utilizada para cada conexão.
* A carga de trabalho de cada conexão.
* O tempo de resposta desejado.
* O número de descritores de arquivo disponíveis.

O Linux ou o Solaris deve ser capaz de suportar, rotineiramente, pelo menos 500 a 1000 conexões simultâneas e até 10.000 conexões se você tiver muitos gigabytes de RAM disponíveis e a carga de trabalho de cada uma for baixa ou o tempo de resposta não seja exigente.

Aumentar o valor de `max_connections` aumenta o número de descritores de arquivo que `mysqld` requer. Se o número necessário de descritores não estiver disponível, o servidor reduz o valor de `max_connections`. Para comentários sobre os limites de descritores de arquivo, consulte a Seção 8.4.3.1, “Como o MySQL abre e fecha tabelas”.

Pode ser necessário aumentar a variável de sistema `open_files_limit`, o que também pode exigir aumentar o limite do sistema operacional sobre o número de descritores de arquivo que o MySQL pode usar. Consulte a documentação do seu sistema operacional para determinar se é possível aumentar o limite e como fazer isso. Veja também a Seção B.3.2.16, “Ficheiro não encontrado e erros semelhantes”.

#### 5.1.11.2 Consultas de DNS e Cache de Anfitrião

O servidor MySQL mantém um cache de host de memória que contém informações sobre os clientes: endereço IP, nome do host e informações de erro. A tabela do Schema de Desempenho `host_cache` expõe o conteúdo do cache de host para que ele possa ser examinado usando as instruções `SELECT`. Isso pode ajudá-lo a diagnosticar as causas dos problemas de conexão. Veja a Seção 25.12.16.1, “A tabela host_cache”.

As seções a seguir discutem como o cache do host funciona, bem como outros tópicos, como como configurar e monitorar o cache.

* Operação de Cache do Host
* Configuração do Cache do Host
* Monitoramento do Cache do Host
* Limpeza do Cache do Host
* Lidando com Hosts Bloqueados

##### Operação de Cache do Host

O servidor utiliza o cache do host apenas para conexões TCP que não são do localhost. Ele não utiliza o cache para conexões TCP estabelecidas usando um endereço de interface de loopback (por exemplo, `127.0.0.1` ou `::1`), ou para conexões estabelecidas usando um arquivo de soquete Unix, canal de canalização ou memória compartilhada.

O servidor utiliza o cache do host para vários propósitos:

* Ao armazenar os resultados das pesquisas de IP para nomes de host, o servidor evita realizar uma pesquisa no Sistema de Nomes de Domínio (DNS) para cada conexão do cliente. Em vez disso, para um host dado, ele precisa realizar uma pesquisa apenas para a primeira conexão desse host.

* O cache contém informações sobre os erros que ocorrem durante o processo de conexão do cliente. Alguns erros são considerados "bloqueantes". Se muitos desses ocorrerem sucessivamente a partir de um determinado host sem uma conexão bem-sucedida, o servidor bloqueia mais conexões desse host. A variável de sistema `max_connect_errors` determina o número permitido de erros sucessivos antes que ocorra o bloqueio.

Para cada nova conexão de cliente aplicável, o servidor usa o endereço IP do cliente para verificar se o nome do host do cliente está na cache de hosts. Se estiver, o servidor recusa ou continua a processar a solicitação de conexão, dependendo de se o host está bloqueado ou não. Se o host não estiver na cache, o servidor tenta resolver o nome do host. Primeiro, resolve o endereço IP em um nome de host e resolve esse nome de host de volta a um endereço IP. Em seguida, compara o resultado com o endereço IP original para garantir que eles sejam os mesmos. O servidor armazena informações sobre o resultado dessa operação na cache de hosts. Se a cache estiver cheia, a entrada menos recentemente usada é descartada.

O servidor realiza a resolução de nomes de host usando a chamada de sistema `getaddrinfo()`.

O servidor lida com as entradas no cache do host da seguinte forma:

1. Quando a primeira conexão do cliente TCP atingir o servidor a partir de um endereço IP dado, uma nova entrada de cache é criada para registrar o IP do cliente, o nome do host e a bandeira de validação de busca do cliente. Inicialmente, o nome do host é definido como `NULL` e a bandeira é falsa. Esta entrada também é usada para conexões subsequentes do cliente TCP do mesmo endereço IP de origem.

2. Se a bandeira de validação para a entrada de IP do cliente for falsa, o servidor tenta uma resolução DNS de nome de IP para nome de host. Se isso for bem-sucedido, o nome do host é atualizado com o nome de host resolvido e a bandeira de validação é definida como verdadeira. Se a resolução não for bem-sucedida, a ação tomada depende se o erro é permanente ou transitório. Para falhas permanentes, o nome do host permanece `NULL` e a bandeira de validação é definida como verdadeira. Para falhas transitórias, o nome do host e a bandeira de validação permanecem inalterados. (Neste caso, outra tentativa de resolução DNS ocorre na próxima vez que um cliente se conecta a partir deste IP.)

3. Se ocorrer um erro durante o processamento de uma conexão de cliente que chega de um endereço IP específico, o servidor atualiza os respectivos contadores de erro na entrada para esse IP. Para uma descrição dos erros registrados, consulte a Seção 25.12.16.1, “A tabela host_cache”.

Para desbloquear hosts bloqueados, limpe o cache do host; veja Como lidar com hosts bloqueados.

É possível que um host bloqueado seja desbloqueado mesmo sem limpar o cache do host se houver atividade de outros hosts:

* Se o cache estiver cheio quando uma conexão chega de um IP de cliente que não está no cache, o servidor descarta a entrada de cache menos recentemente usada para dar lugar à nova entrada.

* Se a entrada descartada for para um host bloqueado, esse host será desbloqueado.

Alguns erros de conexão não estão associados a conexões TCP, ocorrem muito cedo no processo de conexão (até mesmo antes de um endereço IP ser conhecido) ou não são específicos para qualquer endereço IP particular (como condições de memória insuficiente). Para obter informações sobre esses erros, consulte as variáveis de status `Connection_errors_xxx` (consulte Seção 5.1.9, “Variáveis de Status do Servidor”).

##### Configurando o Cache do Host

O cache do host é ativado por padrão. A variável de sistema `host_cache_size` controla seu tamanho, bem como o tamanho da tabela do Schema de Desempenho `host_cache` que expõe o conteúdo do cache. O tamanho do cache pode ser definido na inicialização do servidor e alterado em tempo real. Por exemplo, para definir o tamanho para 100 na inicialização, coloque essas strings no arquivo do servidor `my.cnf`:

```sql
[mysqld]
host_cache_size=200
```

Para alterar o tamanho para 300 no momento da execução, faça o seguinte:

```sql
SET GLOBAL host_cache_size=300;
```

Definir `host_cache_size` para 0, seja no início do servidor ou durante o runtime, desativa o cache do host. Com o cache desativado, o servidor realiza uma pesquisa DNS toda vez que um cliente se conecta.

Alterar o tamanho do cache em tempo de execução causa uma operação de esvaziamento implícito do cache do host, que limpa o cache do host, trunca a tabela `host_cache` e desbloqueia quaisquer hosts bloqueados; veja Esvaziamento do Cache do Host.

Usar a opção `--skip-host-cache` é semelhante a definir a variável de sistema `host_cache_size` como 0, mas `host_cache_size` é mais flexível porque também pode ser usado para redimensionar, habilitar e desabilitar o cache do host em tempo de execução, não apenas na inicialização do servidor. Iniciar o servidor com `--skip-host-cache` não impede alterações em tempo de execução no valor de `host_cache_size`, mas tais alterações não têm efeito e o cache não é reativado mesmo se `host_cache_size` for definido maior que 0.

Para desabilitar as pesquisas de nomes de host DNS, inicie o servidor com a variável de sistema `skip_name_resolve` habilitada. Neste caso, o servidor usa apenas endereços IP e não nomes de host para corresponder os hosts de conexão a strings nas tabelas de concessão do MySQL. Apenas as contas especificadas nessas tabelas que usam endereços IP podem ser usadas. (Um cliente pode não ser capaz de se conectar se não existir uma conta que especifique o endereço IP do cliente.)

Se você tem um DNS muito lento e muitos hosts, poderá melhorar o desempenho habilitando `skip_name_resolve` para desabilitar consultas DNS ou aumentando o valor de `host_cache_size` para tornar o cache do host maior.

Para não permitir conexões TCP/IP, inicie o servidor com a variável de sistema `skip_networking` habilitada.

Para ajustar o número permitido de erros de conexão consecutivos antes que ocorra o bloqueio do host, defina a variável de sistema `max_connect_errors`. Por exemplo, para definir o valor no início, coloque essas strings no arquivo do servidor `my.cnf`:

```sql
[mysqld]
max_connect_errors=10000
```

Para alterar o valor em tempo de execução, faça o seguinte:

```sql
SET GLOBAL max_connect_errors=10000;
```

##### Monitoramento do Cache do Host

A tabela do Schema de Desempenho `host_cache` expõe o conteúdo do cache do host. Essa tabela pode ser examinada usando as instruções `SELECT`, que podem ajudar a diagnosticar as causas dos problemas de conexão. O Schema de Desempenho deve ser habilitado ou essa tabela estará vazia. Para informações sobre essa tabela, consulte a Seção 25.12.16.1, “A tabela host_cache”.

##### Limpar o cache do host

Descartar o cache do host pode ser aconselhável ou desejável nessas condições:

* Alguns dos seus anfitriões de clientes alteram o endereço IP. * A mensagem de erro `Host 'host_name' is blocked` ocorre para conexões de anfitriões legítimos. (Veja Como lidar com anfitriões bloqueados.)

A limpeza do cache do host tem esses efeitos:

* Limpa o cache do host de memória. * Remove todas as strings da tabela do Schema de desempenho `host_cache` que exibe o conteúdo do cache.

* Desbloqueia qualquer host bloqueado. Isso permite que novas tentativas de conexão sejam feitas a partir desses hosts.

Para limpar o cache do host, use qualquer um desses métodos:

* Altere o valor da variável de sistema `host_cache_size`. Isso requer o privilégio `SUPER`.

* Execute uma declaração `TRUNCATE TABLE` que trunque a tabela do Schema de Desempenho `host_cache`. Isso requer o privilégio `DROP` para a tabela.

* Execute uma declaração `FLUSH HOSTS`. Isso requer o privilégio `RELOAD`.

* Execute o comando **mysqladmin flush-hosts**. Isso requer o privilégio `RELOAD`.

##### Lidando com Anfitriões Bloqueados

O servidor usa o cache do host para rastrear erros que ocorrem durante o processo de conexão do cliente. Se o seguinte erro ocorrer, isso significa que o `mysqld` recebeu muitas solicitações de conexão do host fornecido que foram interrompidas no meio:

```sql
Host 'host_name' is blocked because of many connection errors.
Unblock with 'mysqladmin flush-hosts'
```

O valor da variável de sistema `max_connect_errors` determina quantos pedidos de conexão interrompida consecutivos o servidor permite antes de bloquear um host. Após os pedidos `max_connect_errors` falharem sem uma conexão bem-sucedida, o servidor assume que algo está errado (por exemplo, que alguém está tentando invadir), e bloqueia o host de novos pedidos de conexão.

Para desbloquear hosts bloqueados, limpe o cache do host; veja Limpar o cache do host.

Como alternativa, para evitar que a mensagem de erro ocorra, configure `max_connect_errors` conforme descrito na Configuração do Cache do Host. O valor padrão de `max_connect_errors` é 100. Aumentar `max_connect_errors` para um valor grande torna menos provável que um host atinja o limite e seja bloqueado. No entanto, se a mensagem de erro `Host 'host_name' is blocked` ocorrer, primeiro verifique se não há nada errado com as conexões TCP/IP dos hosts bloqueados. Não faz sentido aumentar o valor de `max_connect_errors` se houver problemas de rede.

### 5.1.12 Suporte ao IPv6

O suporte ao IPv6 no MySQL inclui essas funcionalidades:

* O MySQL Server pode aceitar conexões TCP/IP de clientes que se conectam através do IPv6. Por exemplo, este comando se conecta através do IPv6 ao servidor MySQL no host local:

  ```sql
  $> mysql -h ::1
  ```

Para usar essa capacidade, duas coisas devem ser verdadeiras:

+ Seu sistema deve ser configurado para suportar IPv6. Veja a Seção 5.1.12.1, “Verificando o suporte do sistema para IPv6”.

+ A configuração padrão do servidor MySQL permite conexões IPv6, além das conexões IPv4. Para alterar a configuração padrão, inicie o servidor com a variável de sistema `bind_address` definida para um valor apropriado. Veja a Seção 5.1.7, “Variáveis do sistema do servidor”.

* Os nomes de contas do MySQL permitem que os administradores de banco de dados (DBAs) especifiquem privilégios para clientes que se conectam ao servidor através do IPv6. Veja a Seção 6.2.4, “Especificação de Nomes de Contas”. Endereços IPv6 podem ser especificados em nomes de contas em declarações como `CREATE USER`, `GRANT` e `REVOKE`. Por exemplo:

  ```sql
  mysql> CREATE USER 'bill'@'::1' IDENTIFIED BY 'secret';
  mysql> GRANT SELECT ON mydb.* TO 'bill'@'::1';
  ```

* As funções IPv6 permitem a conversão entre formatos de endereço IPv6 interno e formato de string, e verificação de se os valores representam endereços IPv6 válidos. Por exemplo, `INET6_ATON()` e `INET6_NTOA()` são semelhantes a `INET_ATON()` e `INET_NTOA()`, mas lidam com endereços IPv6 além de endereços IPv4. Veja a Seção 12.20, “Funções Diversas”.

As seções a seguir descrevem como configurar o MySQL para que os clientes possam se conectar ao servidor através do IPv6.

#### 5.1.12.1 Verificando o suporte do sistema para IPv6

Antes que o MySQL Server possa aceitar conexões IPv6, o sistema operacional do seu servidor deve suportar IPv6. Como um teste simples para determinar se isso é verdade, tente este comando:

```sql
$> ping6 ::1
16 bytes from ::1, icmp_seq=0 hlim=64 time=0.171 ms
16 bytes from ::1, icmp_seq=1 hlim=64 time=0.077 ms
...
```

Para produzir uma descrição das interfaces de rede do seu sistema, invoque **ifconfig -a** e procure por endereços IPv6 na saída.

Se o seu host não suporta IPv6, consulte a documentação do seu sistema para obter instruções sobre como habilitá-lo. Pode ser que você precise apenas reconfigurar uma interface de rede existente para adicionar um endereço IPv6. Ou uma mudança mais extensa pode ser necessária, como a reconstrução do kernel com opções de IPv6 habilitadas.

Esses links podem ser úteis para configurar o IPv6 em várias plataformas:

* [Windows][(https://msdn.microsoft.com/en-us/library/dd163569.aspx)]
* [Gentoo Linux][(http://www.gentoo.org/doc/en/ipv6.xml)]
* [Ubuntu Linux][(https://wiki.ubuntu.com/IPv6)]
* [Linux (Generic)][(http://www.tldp.org/HOWTO/Linux+IPv6-HOWTO/)]
* [macOS][(https://support.apple.com/en-us/HT202237)]

#### 5.1.12.2 Configurando o servidor MySQL para permitir conexões IPv6

O servidor MySQL escuta em um único soquete de rede para conexões TCP/IP. Esse soquete está vinculado a um único endereço, mas é possível que um endereço mapeie em múltiplas interfaces de rede. Para especificar um endereço, defina `bind_address=addr` na inicialização do servidor, onde *`addr`* é um endereço IPv4 ou IPv6 ou um nome de host. Para obter detalhes, consulte a descrição `bind_address` na Seção 5.1.7, “Variáveis do Sistema do Servidor”.

#### 5.1.12.3 Conectando usando o endereço de host local IPv6

O procedimento a seguir mostra como configurar o MySQL para permitir conexões IPv6 por clientes que se conectam ao servidor local usando o endereço de host local `::1`. As instruções aqui fornecidas pressupem que seu sistema suporta IPv6.

1. Inicie o servidor MySQL com uma configuração apropriada `bind_address` para permitir que ele aceite conexões IPv6. Por exemplo, coloque as seguintes strings no arquivo de opção do servidor e reinicie o servidor:

   ```sql
   [mysqld]
   bind_address = *
   ```

Como alternativa, você pode vincular o servidor ao `::1`, mas isso torna o servidor mais restritivo para conexões TCP/IP. Ele aceita apenas conexões IPv6 para esse único endereço e rejeita conexões IPv4. Para mais informações, consulte a descrição do `bind_address` na Seção 5.1.7, “Variáveis do sistema do servidor”.

2. Como administrador, conecte-se ao servidor e crie uma conta para um usuário local que se conecte a partir do endereço IPv6 local do host `::1`:

   ```sql
   mysql> CREATE USER 'ipv6user'@'::1' IDENTIFIED BY 'ipv6pass';
   ```

Para a sintaxe permitida de endereços IPv6 em nomes de conta, consulte a Seção 6.2.4, “Especificação de Nomes de Conta”. Além da declaração `CREATE USER`, você pode emitir declarações `GRANT` que dão privilégios específicos à conta, embora isso não seja necessário para as etapas restantes deste procedimento.

3. Inicie o cliente **mysql** para se conectar ao servidor usando a nova conta:

   ```sql
   $> mysql -h ::1 -u ipv6user -pipv6pass
   ```

4. Experimente algumas declarações simples que mostrem informações de conexão:

   ```sql
   mysql> STATUS
   ...
   Connection:   ::1 via TCP/IP
   ...

   mysql> SELECT CURRENT_USER(), @@bind_address;
   +----------------+----------------+
   | CURRENT_USER() | @@bind_address |
   +----------------+----------------+
   | ipv6user@::1   | ::             |
   +----------------+----------------+
   ```

#### 5.1.12.4 Conectando usando endereços de host não locais IPv6

O procedimento a seguir mostra como configurar o MySQL para permitir conexões IPv6 por clientes remotos. É semelhante ao procedimento anterior para clientes locais, mas os hosts do servidor e do cliente são distintos e cada um tem seu próprio endereço IPv6 não local. O exemplo usa esses endereços:

```sql
Server host: 2001:db8:0:f101::1
Client host: 2001:db8:0:f101::2
```

Esses endereços são escolhidos da faixa de endereços não roteáveis recomendada pela IANA para fins de documentação e são suficientes para testes na sua rede local. Para aceitar conexões IPv6 de clientes externos à rede local, o host do servidor deve ter um endereço público. Se o seu provedor de rede lhe atribuir um endereço IPv6, você pode usá-lo. Caso contrário, outra maneira de obter um endereço é usar um intermediário IPv6; veja Seção 5.1.12.5, “Obtenção de um endereço IPv6 de um intermediário”.

1. Inicie o servidor MySQL com uma configuração apropriada `bind_address` para permitir que ele aceite conexões IPv6. Por exemplo, coloque as seguintes strings no arquivo de opção do servidor e reinicie o servidor:

   ```sql
   [mysqld]
   bind_address = *
   ```

Como alternativa, você pode vincular o servidor ao `2001:db8:0:f101::1`, mas isso torna o servidor mais restritivo para conexões TCP/IP. Ele aceita apenas conexões IPv6 para esse único endereço e rejeita conexões IPv4. Para mais informações, consulte a descrição do `bind_address` na Seção 5.1.7, “Variáveis do sistema do servidor”.

2. No host do servidor (`2001:db8:0:f101::1`), crie uma conta para um usuário que se conecta do host do cliente (`2001:db8:0:f101::2`):

   ```sql
   mysql> CREATE USER 'remoteipv6user'@'2001:db8:0:f101::2' IDENTIFIED BY 'remoteipv6pass';
   ```

3. No host do cliente (`2001:db8:0:f101::2`), invoque o cliente **mysql** para se conectar ao servidor usando a nova conta:

   ```sql
   $> mysql -h 2001:db8:0:f101::1 -u remoteipv6user -premoteipv6pass
   ```

4. Experimente algumas declarações simples que mostrem informações de conexão:

   ```sql
   mysql> STATUS
   ...
   Connection:   2001:db8:0:f101::1 via TCP/IP
   ...

   mysql> SELECT CURRENT_USER(), @@bind_address;
   +-----------------------------------+----------------+
   | CURRENT_USER()                    | @@bind_address |
   +-----------------------------------+----------------+
   | remoteipv6user@2001:db8:0:f101::2 | ::             |
   +-----------------------------------+----------------+
   ```

#### 5.1.12.5. Obter uma endereço IPv6 de um corretor

Se você não tem um endereço IPv6 público que permita que seu sistema se comunique via IPv6 fora da sua rede local, você pode obtê-lo de um intermediário de túnel IPv6. A página do intermediário de túnel IPv6 da Wikipedia lista vários intermediários e suas características, como se eles forneçam endereços estáticos e os protocolos de roteamento suportados.

Depois de configurar o seu servidor host para usar um endereço IPv6 fornecido pelo intermediário, inicie o servidor MySQL com uma configuração apropriada `bind_address` para permitir que o servidor aceite conexões IPv6. Por exemplo, coloque as seguintes strings no arquivo de opção do servidor e reinicie o servidor:

```sql
[mysqld]
bind_address = *
```

Como alternativa, você pode vincular o servidor ao endereço IPv6 específico fornecido pelo corretor, mas isso torna o servidor mais restritivo para conexões TCP/IP. Ele aceita apenas conexões IPv6 para esse único endereço e rejeita conexões IPv4. Para mais informações, consulte a descrição do `bind_address` na Seção 5.1.7, “Variáveis do Sistema do Servidor”. Além disso, se o corretor alocar endereços dinâmicos, o endereço fornecido para o seu sistema pode mudar na próxima vez que você se conectar ao corretor. Se assim for, quaisquer contas que você criar que nomeiem o endereço original se tornarão inválidas. Para vincular um endereço específico, mas evitar esse problema de mudança de endereço, você pode conseguir arranjar com o corretor para um endereço IPv6 estático.

O exemplo a seguir mostra como usar o Freenet6 como intermediário e o pacote de cliente IPv6 **gogoc** no Gentoo Linux.

1. Crie uma conta no Freenet6 visitando este endereço URL e se inscrevendo:

   ```sql
   http://gogonet.gogo6.com
   ```

2. Após criar a conta, vá até este endereço URL, faça login e crie um ID de usuário e uma senha para o intermediário IPv6:

   ```sql
   http://gogonet.gogo6.com/page/freenet6-registration
   ```

3. Como `root`, instale **gogoc**:

   ```sql
   $> emerge gogoc
   ```

4. Editar `/etc/gogoc/gogoc.conf` para definir os valores de `userid` e `password`. Por exemplo:

   ```sql
   userid=gogouser
   passwd=gogopass
   ```

5. Inicie o **gogoc**:

   ```sql
   $> /etc/init.d/gogoc start
   ```

Para iniciar o **gogoc** a cada vez que o seu sistema é iniciado, execute este comando:

   ```sql
   $> rc-update add gogoc default
   ```

6. Use o **ping6** para tentar pingar um host:

   ```sql
   $> ping6 ipv6.google.com
   ```

7. Para ver seu endereço IPv6:

   ```sql
   $> ifconfig tun
   ```

### 5.1.13 Suporte ao Fuso Horário do MySQL Server

Esta seção descreve as configurações do fuso horário mantidas pelo MySQL, como carregar as tabelas do sistema necessárias para o suporte de hora nomeada, como se manter atualizado com as mudanças de fuso horário e como habilitar o suporte de segundo intercalar.

Para obter informações sobre as configurações de fuso horário em configurações de replicação, consulte a Seção 16.4.1.15, “Replicação e funções do sistema” e a Seção 16.4.1.31, “Replicação e fusos horários”.

* Variáveis de Fuso Horário
* Preenchimento das tabelas de fuso horário
* Manter-se atualizado com as mudanças de fuso horário
* Suporte para segundo intercalar de fuso horário

#### Variáveis de Fuso Horário

O MySQL Server mantém vários ajustes de fuso horário:

* O fuso horário do sistema do servidor. Quando o servidor é iniciado, ele tenta determinar o fuso horário da máquina hospedeira e usa-o para definir a variável de sistema `system_time_zone`. O valor não muda posteriormente.

Para especificar explicitamente o fuso horário do sistema para o MySQL Server no início, defina a variável de ambiente `TZ` antes de iniciar o `mysqld`. Se você iniciar o servidor usando o `mysqld_safe`, sua opção `--timezone` oferece outra maneira de definir o fuso horário do sistema. Os valores permitidos para `TZ` e `--timezone` dependem do sistema operacional. Consulte a documentação do seu sistema operacional para ver quais valores são aceitáveis.

* O fuso horário atual do servidor. A variável de sistema global `time_zone` indica o fuso horário em que o servidor está operando atualmente. O valor inicial `time_zone` é `'SYSTEM'`, que indica que o fuso horário do servidor é o mesmo que o fuso horário do sistema.

Nota

Se configurado em `SYSTEM`, cada chamada de função MySQL que requer um cálculo de fuso horário faz uma chamada de biblioteca do sistema para determinar o fuso horário do sistema atual. Essa chamada pode ser protegida por um mutex global, resultando em concorrência.

O valor inicial do fuso horário do servidor global pode ser especificado explicitamente na inicialização com a opção `--default-time-zone` na string de comando, ou você pode usar a seguinte string em um arquivo de opções:

  ```sql
  default-time-zone='timezone'
  ```

Se você tiver o privilégio `SUPER`, pode definir o valor do fuso horário do servidor global em tempo de execução com esta declaração:

  ```sql
  SET GLOBAL time_zone = timezone;
  ```

* Fuso-horário por sessão. Cada cliente que se conecta tem seu próprio horário de sessão, definido pela variável de sessão `time_zone`. Inicialmente, a variável de sessão toma seu valor da variável global `time_zone`, mas o cliente pode alterar seu próprio fuso-horário com esta declaração:

  ```sql
  SET time_zone = timezone;
  ```

A configuração do fuso horário da sessão afeta a exibição e o armazenamento de valores de hora que são sensíveis ao fuso horário. Isso inclui os valores exibidos por funções como `NOW()` ou `CURTIME()`, e valores armazenados e recuperados das colunas `TIMESTAMP`. Os valores das colunas `TIMESTAMP` são convertidos do fuso horário da sessão para UTC para armazenamento e, a partir do UTC, para o fuso horário da sessão para recuperação.

A configuração do fuso horário da sessão não afeta os valores exibidos por funções como `UTC_TIMESTAMP()` ou os valores nas colunas `DATE`, `TIME` ou `DATETIME`. Além disso, os valores desses tipos de dados não são armazenados no UTC; o fuso horário deles se aplica apenas quando a conversão dos valores de `TIMESTAMP`. Se você deseja aritmética específica para o local para os valores de `DATE`, `TIME` ou `DATETIME`, converta-os para UTC, realize a aritmética e, em seguida, converta de volta.

Os valores atuais dos fusos horários globais e de sessão podem ser recuperados da seguinte forma:

```sql
SELECT @@GLOBAL.time_zone, @@SESSION.time_zone;
```

Os valores de *`timezone`* podem ser fornecidos em vários formatos, nenhum dos quais é sensível ao caso:

* Como o valor `'SYSTEM'`, indicando que o fuso horário do servidor é o mesmo que o fuso horário do sistema.

* Como uma cadeia que indica um deslocamento em relação ao UTC na forma `[H]H:MM`, precedida por um `+` ou `-`, como `'+10:00'`, `'-6:00'` ou `'+05:30'`. Um zero inicial pode ser usado opcionalmente para valores de horas menores que 10; o MySQL preenchendo um zero inicial ao armazenar e recuperar o valor nesses casos. O MySQL converte `'-00:00'` ou `'-0:00'` para `'+00:00'`.

Um deslocamento de fuso horário deve estar na faixa de `'-12:59'` a `'+13:00'`, inclusive.

* Como um fuso horário nomeado, como `'Europe/Helsinki'`, `'US/Eastern'`, `'MET'` ou `'UTC'`.

Nota

Os fusos horários nomeados só podem ser usados se as tabelas de informações de fuso horário no banco de dados `mysql` tiverem sido criadas e preenchidas. Caso contrário, o uso de um fuso horário nomeado resulta em um erro:

  ```sql
  mysql> SET time_zone = 'UTC';
  ERROR 1298 (HY000): Unknown or incorrect time zone: 'UTC'
  ```

#### Populando as tabelas de fuso horário

Várias tabelas no banco de dados do sistema `mysql` existem para armazenar informações sobre fuso horário (veja Seção 5.3, “O banco de dados do sistema MySQL”). O procedimento de instalação do MySQL cria as tabelas de fuso horário, mas não as carrega. Para fazer isso manualmente, use as instruções a seguir.

Nota

Carregar as informações sobre o fuso horário não é necessariamente uma operação única, pois as informações mudam ocasionalmente. Quando essas mudanças ocorrem, os aplicativos que usam as regras antigas ficam desatualizados e você pode achar necessário recarregar as tabelas de fuso horário para manter as informações usadas pelo seu servidor MySQL atualizadas. Veja Como se manter atualizado com as mudanças de fuso horário.

Se o seu sistema tiver seu próprio banco de dados de zoneinfo (o conjunto de arquivos que descrevem as zonas horárias), use o programa `mysql_tzinfo_to_sql` para carregar as tabelas de zona horária. Exemplos de sistemas desse tipo são Linux, macOS, FreeBSD e Solaris. Um local provável para esses arquivos é o diretório `/usr/share/zoneinfo`. Se o seu sistema não tiver um banco de dados de zoneinfo, você pode usar um pacote para download, conforme descrito mais adiante nesta seção.

Para carregar as tabelas de fuso horário a partir da string de comando, passe o nome do caminho do diretório zoneinfo para `mysql_tzinfo_to_sql` e envie a saída para o programa **mysql**. Por exemplo:

```sql
mysql_tzinfo_to_sql /usr/share/zoneinfo | mysql -u root -p mysql
```

O comando **mysql** mostrado aqui assume que você se conecta ao servidor usando uma conta como `root` que tenha privilégios para modificar tabelas no banco de dados do sistema `mysql`. Ajuste os parâmetros de conexão conforme necessário.

`mysql_tzinfo_to_sql` lê os arquivos de fuso horário do sistema e gera declarações SQL a partir deles. O **mysql** processa essas declarações para carregar as tabelas de fuso horário.

`mysql_tzinfo_to_sql` também pode ser usado para carregar um único arquivo de fuso horário ou gerar informações sobre segundos intercalares:

* Para carregar um arquivo de fuso horário único *`tz_file`* que corresponda a um nome de fuso horário *`tz_name`*, invoque `mysql_tzinfo_to_sql` da seguinte forma:

  ```sql
  mysql_tzinfo_to_sql tz_file tz_name | mysql -u root -p mysql
  ```

Com essa abordagem, você deve executar um comando separado para carregar o arquivo de fuso horário para cada zona nomeada que o servidor precisa saber.

* Se o seu fuso horário deve considerar segundos intercalares, inicie as informações sobre segundos intercalares da seguinte forma, onde *`tz_file`* é o nome do arquivo do seu fuso horário:

  ```sql
  mysql_tzinfo_to_sql --leap tz_file | mysql -u root -p mysql
  ```

Após executar `mysql_tzinfo_to_sql`, reinicie o servidor para que ele não continue a usar quaisquer dados de fuso horário armazenados anteriormente.

Se o seu sistema não tiver um banco de dados de zoneinfo (por exemplo, Windows), você pode usar um pacote que contém instruções SQL disponíveis para download na MySQL Developer Zone:

```sql
https://dev.mysql.com/downloads/timezones.html
```

Aviso

Não use um pacote de fuso horário para download se o seu sistema tiver um banco de dados de zoneinfo. Em vez disso, use o utilitário `mysql_tzinfo_to_sql`. Caso contrário, você pode causar uma diferença no manuseio de datetime entre o MySQL e outros aplicativos no seu sistema.

Para usar um pacote de fuso horário de declaração SQL que você baixou, desempacote-o e, em seguida, carregue o conteúdo do arquivo desempaquetar nas tabelas de fuso horário:

```sql
mysql -u root -p mysql < file_name
```

Em seguida, reinicie o servidor.

Aviso

*Não* use um pacote de fuso horário para download que contenha as tabelas `MyISAM`. Isso é destinado a versões mais antigas do MySQL. O MySQL 5.7 e versões posteriores utilizam `InnoDB` para as tabelas de fuso horário. Tentar substituí-las com as tabelas `MyISAM` causa problemas.

#### Mantendo-se atualizado com as mudanças nos fusos horários

Quando as regras de fuso horário mudam, os aplicativos que usam as regras antigas ficam desatualizados. Para se manter atualizado, é necessário garantir que o seu sistema use informações de fuso horário atual. Para o MySQL, há vários fatores a serem considerados para se manter atualizado:

* O tempo do sistema operacional afeta o valor que o servidor MySQL usa para os horários se seu fuso horário estiver definido como `SYSTEM`. Certifique-se de que seu sistema operacional esteja usando as informações mais recentes sobre o fuso horário. Para a maioria dos sistemas operacionais, a atualização mais recente ou o pacote de serviço prepara seu sistema para as mudanças de horário. Verifique o site do fornecedor do seu sistema operacional para uma atualização que aborde as mudanças de horário.

* Se você substituir o arquivo de fuso horário `/etc/localtime` do sistema por uma versão que utiliza regras diferentes das que estão em vigor no início de `mysqld`, reinicie `mysqld` para que ele utilize as regras atualizadas. Caso contrário, `mysqld` pode não notar quando o sistema altera seu horário.

* Se você usa fusos horários com nomes no MySQL, certifique-se de que as tabelas de fuso horário no banco de dados `mysql` estejam atualizadas:

+ Se o seu sistema tiver seu próprio banco de dados de zoneinfo, recarregue as tabelas de fuso horário do MySQL sempre que o banco de dados zoneinfo for atualizado.

+ Para sistemas que não possuem seu próprio banco de dados de zoneinfo, verifique a MySQL Developer Zone para atualizações. Quando uma nova atualização estiver disponível, baixe-a e use-a para substituir o conteúdo das suas tabelas de fuso horário atuais.

Para obter instruções para ambos os métodos, consulte a seção Populando as tabelas de fuso horário. `mysqld` armazena as informações de fuso horário que ele consulta, portanto, após atualizar as tabelas de fuso horário, reinicie `mysqld` para garantir que ele não continue a fornecer dados de fuso horário desatualizados.

Se você não tiver certeza se os fusos horários nomeados estão disponíveis, para uso como configuração do fuso horário do servidor ou por clientes que definem seu próprio fuso horário, verifique se suas tabelas de fuso horário estão vazias. A consulta a seguir determina se a tabela que contém os nomes dos fusos horários tem alguma string:

```sql
mysql> SELECT COUNT(*) FROM mysql.time_zone_name;
+----------+
| COUNT(*) |
+----------+
|        0 |
+----------+
```

Um número de contagem de zero indica que a tabela está vazia. Neste caso, nenhuma aplicação está atualmente usando fuso-horário nomeado e você não precisa atualizar as tabelas (a menos que você queira habilitar o suporte a fuso-horário nomeado). Um número de contagem maior que zero indica que a tabela não está vazia e que seu conteúdo está disponível para ser usado para suporte a fuso-horário nomeado. Neste caso, certifique-se de recarregar suas tabelas de fuso-horário para que as aplicações que usam fuso-horário nomeado obtenham resultados de consulta corretos.

Para verificar se sua instalação do MySQL está corretamente atualizada para uma mudança nas regras do horário de verão, use um teste como o seguinte. O exemplo usa valores apropriados para a mudança de 1 hora do horário de verão de 2007 que ocorre nos Estados Unidos em 11 de março às 2h.

O teste utiliza esta consulta:

```sql
SELECT
  CONVERT_TZ('2007-03-11 2:00:00','US/Eastern','US/Central') AS time1,
  CONVERT_TZ('2007-03-11 3:00:00','US/Eastern','US/Central') AS time2;
```

Os dois valores de tempo indicam os momentos em que a mudança do fuso horário ocorre, e o uso de zonas horárias nomeadas exige que as tabelas de fuso horário sejam usadas. O resultado desejado é que ambas as consultas retornem o mesmo resultado (o horário de entrada, convertido para o valor equivalente na zona horária 'US/Central').

Antes de atualizar as tabelas de fuso horário, você verá um resultado incorreto como este:

```sql
+---------------------+---------------------+
| time1               | time2               |
+---------------------+---------------------+
| 2007-03-11 01:00:00 | 2007-03-11 02:00:00 |
+---------------------+---------------------+
```

Depois de atualizar as tabelas, você deve ver o resultado correto:

```sql
+---------------------+---------------------+
| time1               | time2               |
+---------------------+---------------------+
| 2007-03-11 01:00:00 | 2007-03-11 01:00:00 |
+---------------------+---------------------+
```

#### Suporte para segundo intercalar do fuso horário

Os valores dos segundos intercalares são retornados com uma parte de tempo que termina com `:59:59`. Isso significa que uma função como `NOW()` pode retornar o mesmo valor para dois ou três segundos consecutivos durante o segundo intercalar. Resta claro que os valores temporais literais que têm uma parte de tempo que termina com `:59:60` ou `:59:61` são considerados inválidos.

Se for necessário procurar os valores de `TIMESTAMP` um segundo antes do segundo intercalar, resultados anômalos podem ser obtidos se você usar uma comparação com os valores de `'YYYY-MM-DD hh:mm:ss'`. O exemplo a seguir demonstra isso. Ele altera o fuso horário da sessão para UTC, de modo que não haja diferença entre os valores internos de `TIMESTAMP` (que estão em UTC) e os valores exibidos (que têm a correção do fuso horário aplicada).

```sql
mysql> CREATE TABLE t1 (
         a INT,
         ts TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
         PRIMARY KEY (ts)
       );
Query OK, 0 rows affected (0.01 sec)

mysql> -- change to UTC
mysql> SET time_zone = '+00:00';
Query OK, 0 rows affected (0.00 sec)

mysql> -- Simulate NOW() = '2008-12-31 23:59:59'
mysql> SET timestamp = 1230767999;
Query OK, 0 rows affected (0.00 sec)

mysql> INSERT INTO t1 (a) VALUES (1);
Query OK, 1 row affected (0.00 sec)

mysql> -- Simulate NOW() = '2008-12-31 23:59:60'
mysql> SET timestamp = 1230768000;
Query OK, 0 rows affected (0.00 sec)

mysql> INSERT INTO t1 (a) VALUES (2);
Query OK, 1 row affected (0.00 sec)

mysql> -- values differ internally but display the same
mysql> SELECT a, ts, UNIX_TIMESTAMP(ts) FROM t1;
+------+---------------------+--------------------+
| a    | ts                  | UNIX_TIMESTAMP(ts) |
+------+---------------------+--------------------+
|    1 | 2008-12-31 23:59:59 |         1230767999 |
|    2 | 2008-12-31 23:59:59 |         1230768000 |
+------+---------------------+--------------------+
2 rows in set (0.00 sec)

mysql> -- only the non-leap value matches
mysql> SELECT * FROM t1 WHERE ts = '2008-12-31 23:59:59';
+------+---------------------+
| a    | ts                  |
+------+---------------------+
|    1 | 2008-12-31 23:59:59 |
+------+---------------------+
1 row in set (0.00 sec)

mysql> -- the leap value with seconds=60 is invalid
mysql> SELECT * FROM t1 WHERE ts = '2008-12-31 23:59:60';
Empty set, 2 warnings (0.00 sec)
```

Para contornar isso, você pode usar uma comparação com base no valor UTC realmente armazenado na coluna, que tem a correção do segundo intercalar aplicada:

```sql
mysql> -- selecting using UNIX_TIMESTAMP value return leap value
mysql> SELECT * FROM t1 WHERE UNIX_TIMESTAMP(ts) = 1230768000;
+------+---------------------+
| a    | ts                  |
+------+---------------------+
|    2 | 2008-12-31 23:59:59 |
+------+---------------------+
1 row in set (0.00 sec)
```

### 5.1.14 Suporte de Ajuda no Servidor

O MySQL Server suporta uma declaração `HELP` que retorna informações do Manual de Referência MySQL (consulte Seção 13.8.3, “Declaração HELP”). Essas informações são armazenadas em várias tabelas no banco de dados `mysql` (consulte Seção 5.3, “O banco de dados do sistema mysql”). O funcionamento adequado da declaração `HELP` requer que essas tabelas de ajuda sejam inicializadas.

Para uma nova instalação do MySQL usando uma distribuição binária ou de fonte no Unix, a inicialização do conteúdo da tabela de ajuda ocorre quando você inicializa o diretório de dados (consulte a Seção 2.9.1, “Inicializando o diretório de dados”). Para uma distribuição RPM no Linux ou uma distribuição binária no Windows, a inicialização do conteúdo ocorre como parte do processo de instalação do MySQL.

Para uma atualização do MySQL usando uma distribuição binária, o conteúdo da tabela de ajuda não é atualizado automaticamente, mas você pode atualizá-lo manualmente. Localize o arquivo `fill_help_tables.sql` no diretório `share` ou `share/mysql`. Altere a localização para esse diretório e processe o arquivo com o cliente **mysql** da seguinte forma:

```sql
mysql -u root -p mysql < fill_help_tables.sql
```

O comando mostrado aqui assume que você se conecta ao servidor usando uma conta como `root` que tenha privilégios para modificar tabelas no banco de dados `mysql`. Ajuste os parâmetros de conexão conforme necessário.

Se você está trabalhando com o Git e uma árvore de origem de desenvolvimento MySQL, a árvore de origem contém apenas uma versão de [[`fill_help_tables.sql`] ]]. Para obter uma cópia não-stub, use uma de uma distribuição de origem ou binária.

Nota

Cada série do MySQL tem seu próprio manual de referência específico para a série, portanto, o conteúdo da tabela de ajuda também é específico para a série. Isso tem implicações para a replicação, pois o conteúdo da tabela de ajuda deve corresponder à série do MySQL. Se você carregar o conteúdo do MySQL 5.7 em um servidor fonte do MySQL 5.7, não faz sentido replicar esse conteúdo para um servidor replica em uma série diferente do MySQL e para o qual esse conteúdo não é apropriado. Por essa razão, ao atualizar servidores individuais em um cenário de replicação, você deve atualizar as tabelas de ajuda de cada servidor, usando as instruções fornecidas anteriormente.

### 5.1.15 Rastreamento do servidor do estado da sessão do cliente

O servidor MySQL implementa vários rastreadores de estado de sessão. Um cliente pode habilitar esses rastreadores para receber notificações sobre as alterações em seu estado de sessão.

* Usos para rastreadores de estado de sessão
* Rastreadores de estado de sessão disponíveis
* Suporte para rastreador de estado de sessão da API C
* Suporte para rastreador de estado de sessão da pasta de testes

#### Usos dos rastreadores de estado de sessão

Os rastreadores de estado de sessão têm usos como esses:

* Para facilitar a migração de sessão. * Para facilitar a alternância de transação.

Uma utilização do mecanismo de rastreador é fornecer uma maneira para os conectores MySQL e aplicações de cliente determinarem se há algum contexto de sessão disponível para permitir a migração de sessão de um servidor para outro. (Para alterar sessões em um ambiente balanceado, é necessário detectar se há estado de sessão a ser considerado ao decidir se pode ser feita uma mudança.)

Outro uso do mecanismo de rastreador é permitir que as aplicações saibam quando as transações podem ser movidas de uma sessão para outra. O rastreamento do estado das transações permite isso, o que é útil para aplicações que podem querer mover transações de um servidor ocupado para um que é menos carregado. Por exemplo, um conector de balanceamento de carga que gerencia um conjunto de conexões de cliente pode mover transações entre sessões disponíveis no conjunto.

No entanto, a troca de sessão não pode ser feita em horários arbitrários. Se uma sessão estiver no meio de uma transação para a qual leituras ou escritas foram feitas, a troca para uma sessão diferente implica um rollback da transação na sessão original. Uma troca de sessão deve ser feita apenas quando uma transação ainda não tenha nenhuma leitura ou escrita realizada nela.

Exemplos de quando as transações podem ser razoavelmente substituídas:

* Imediatamente após `START TRANSACTION`

* Após `COMMIT AND CHAIN`

Além de conhecer o estado da transação, é útil conhecer as características da transação, para que as mesmas características sejam usadas se a transação for movida para uma sessão diferente. As seguintes características são relevantes para esse propósito:

```sql
READ ONLY
READ WRITE
ISOLATION LEVEL
WITH CONSISTENT SNAPSHOT
```

#### Rastreadores de estado de sessão disponíveis

Para suportar as atividades de rastreamento de sessão, a notificação está disponível para esses tipos de informações do estado de sessão do cliente:

* Alterações nesses atributos do estado da sessão do cliente:

+ O esquema padrão (banco de dados).  
+ Valores específicos para sessão de variáveis do sistema.  
+ Variáveis definidas pelo usuário.  
+ Tabelas temporárias.  
+ Estruturas preparadas.

A variável de sistema `session_track_state_change` controla este rastreador.

* Alterações no nome do esquema padrão. A variável de sistema `session_track_schema` controla este rastreador.

* Alterações nos valores da sessão das variáveis do sistema. A variável de sistema `session_track_system_variables` controla este rastreador.

* GTIDs disponíveis. A variável de sistema `session_track_gtids` controla este rastreador.

* Informações sobre o estado e as características da transação. A variável de sistema `session_track_transaction_info` controla este rastreador.

Para descrições das variáveis do sistema relacionadas ao rastreador, consulte a Seção 5.1.7, “Variáveis do Sistema do Servidor”. Essas variáveis do sistema permitem o controle sobre quais notificações de mudança ocorrem, mas não fornecem uma maneira de acessar as informações da notificação. A notificação ocorre no protocolo cliente/servidor do MySQL, que inclui informações do rastreador em pacotes OK para que as mudanças do estado da sessão possam ser detectadas.

#### Suporte ao Rastreador de Estado de Sessão da API C

Para permitir que os aplicativos do cliente extraiam informações sobre mudanças de estado dos pacotes OK retornados pelo servidor, a API C do MySQL fornece um par de funções:

* `mysql_session_track_get_first()` recupera a primeira parte das informações de mudança de estado recebidas do servidor. Veja mysql_session_track_get_first().

* `mysql_session_track_get_next()` recupera qualquer informação de mudança de estado recebida do servidor. Após uma chamada bem-sucedida para `mysql_session_track_get_first()`, chame esta função repetidamente, enquanto ela retornar sucesso. Veja mysql_session_track_get_next().

#### Suporte ao Rastreador de Estado de Sessão da Unidade de Teste

O programa **mysqltest** possui os comandos `disable_session_track_info` e `enable_session_track_info` que controlam se as notificações do rastreador de sessão ocorrem. Você pode usar esses comandos para ver, a partir da string de comando, quais notificações as instruções SQL produzem. Suponha que um arquivo `testscript` contenha o seguinte script do **mysqltest**:

```sql
DROP TABLE IF EXISTS test.t1;
CREATE TABLE test.t1 (i INT, f FLOAT);
--enable_session_track_info
SET @@SESSION.session_track_schema=ON;
SET @@SESSION.session_track_system_variables='*';
SET @@SESSION.session_track_state_change=ON;
USE information_schema;
SET NAMES 'utf8mb4';
SET @@SESSION.session_track_transaction_info='CHARACTERISTICS';
SET TRANSACTION ISOLATION LEVEL SERIALIZABLE;
SET TRANSACTION READ WRITE;
START TRANSACTION;
SELECT 1;
INSERT INTO test.t1 () VALUES();
INSERT INTO test.t1 () VALUES(1, RAND());
COMMIT;
```

Execute o script da seguinte forma para ver as informações fornecidas pelos rastreadores habilitados. Para uma descrição das informações `Tracker:` exibidas pelo **mysqltest** para os vários rastreadores, consulte mysql_session_track_get_first().

```sql
$> mysqltest < testscript
DROP TABLE IF EXISTS test.t1;
CREATE TABLE test.t1 (i INT, f FLOAT);
SET @@SESSION.session_track_schema=ON;
SET @@SESSION.session_track_system_variables='*';
-- Tracker : SESSION_TRACK_SYSTEM_VARIABLES
-- session_track_system_variables
-- *

SET @@SESSION.session_track_state_change=ON;
-- Tracker : SESSION_TRACK_SYSTEM_VARIABLES
-- session_track_state_change
-- ON

USE information_schema;
-- Tracker : SESSION_TRACK_SCHEMA
-- information_schema

-- Tracker : SESSION_TRACK_STATE_CHANGE
-- 1

SET NAMES 'utf8mb4';
-- Tracker : SESSION_TRACK_SYSTEM_VARIABLES
-- character_set_client
-- utf8mb4
-- character_set_connection
-- utf8mb4
-- character_set_results
-- utf8mb4

-- Tracker : SESSION_TRACK_STATE_CHANGE
-- 1

SET @@SESSION.session_track_transaction_info='CHARACTERISTICS';
-- Tracker : SESSION_TRACK_SYSTEM_VARIABLES
-- session_track_transaction_info
-- CHARACTERISTICS

-- Tracker : SESSION_TRACK_STATE_CHANGE
-- 1

-- Tracker : SESSION_TRACK_TRANSACTION_CHARACTERISTICS
--

-- Tracker : SESSION_TRACK_TRANSACTION_STATE
-- ________

SET TRANSACTION ISOLATION LEVEL SERIALIZABLE;
-- Tracker : SESSION_TRACK_TRANSACTION_CHARACTERISTICS
-- SET TRANSACTION ISOLATION LEVEL SERIALIZABLE;

SET TRANSACTION READ WRITE;
-- Tracker : SESSION_TRACK_TRANSACTION_CHARACTERISTICS
-- SET TRANSACTION ISOLATION LEVEL SERIALIZABLE; SET TRANSACTION READ WRITE;

START TRANSACTION;
-- Tracker : SESSION_TRACK_TRANSACTION_CHARACTERISTICS
-- SET TRANSACTION ISOLATION LEVEL SERIALIZABLE; START TRANSACTION READ WRITE;

-- Tracker : SESSION_TRACK_TRANSACTION_STATE
-- T_______

SELECT 1;
1
1
-- Tracker : SESSION_TRACK_TRANSACTION_STATE
-- T_____S_

INSERT INTO test.t1 () VALUES();
-- Tracker : SESSION_TRACK_TRANSACTION_STATE
-- T___W_S_

INSERT INTO test.t1 () VALUES(1, RAND());
-- Tracker : SESSION_TRACK_TRANSACTION_STATE
-- T___WsS_

COMMIT;
-- Tracker : SESSION_TRACK_TRANSACTION_CHARACTERISTICS
--

-- Tracker : SESSION_TRACK_TRANSACTION_STATE
-- ________

ok
```

Antecedendo à declaração `START TRANSACTION`, duas declarações `SET TRANSACTION` executam que definem os níveis de isolamento e as características do modo de acesso para a próxima transação. O valor `SESSION_TRACK_TRANSACTION_CHARACTERISTICS` indica aqueles valores da próxima transação que foram definidos.

Após a declaração `COMMIT` que encerra a transação, o valor `SESSION_TRACK_TRANSACTION_CHARACTERISTICS` é relatado como vazio. Isso indica que as características da próxima transação que foram definidas antes do início da transação foram redefinidas e que os padrões de sessão se aplicam. Para acompanhar as alterações nesses padrões de sessão, acompanhe os valores da sessão das variáveis de sistema `transaction_isolation` e `transaction_read_only`.

Para ver informações sobre GTIDs, habilite o rastreador `SESSION_TRACK_GTIDS` usando a variável de sistema do sistema `session_track_gtids`.

### 5.1.16 O processo de desligamento do servidor

O processo de desligamento do servidor ocorre da seguinte forma:

1. O processo de desligamento é iniciado.

Isso pode ocorrer de várias maneiras. Por exemplo, um usuário com o privilégio `SHUTDOWN` pode executar o comando **mysqladmin shutdown**. O **mysqladmin** pode ser usado em qualquer plataforma suportada pelo MySQL. Outros métodos de iniciação de desligamento específicos para o sistema operacional também são possíveis: o servidor é desligado no Unix quando recebe um sinal [[`SIGTERM`]. Um servidor que funciona como um serviço no Windows é desligado quando o gerente de serviços o informa.

2. O servidor cria um thread de desligamento, se necessário.

Dependendo de como o desligamento foi iniciado, o servidor pode criar um thread para lidar com o processo de desligamento. Se o desligamento foi solicitado por um cliente, um thread de desligamento é criado. Se o desligamento for o resultado da recepção de um sinal `SIGTERM`, o thread do sinal pode lidar com o desligamento em si, ou pode criar um thread separado para fazer isso. Se o servidor tentar criar um thread de desligamento e não conseguir (por exemplo, se a memória estiver esgotada), ele emite uma mensagem de diagnóstico que aparece no log de erro:

   ```sql
   Error: Can't create thread to kill server
   ```

3. O servidor para de aceitar novas conexões.

Para impedir que uma nova atividade seja iniciada durante o desligamento, o servidor para de aceitar novas conexões de clientes fechando os manipuladores das interfaces de rede para as quais ele normalmente escuta conexões: a porta TCP/IP, o arquivo de soquete Unix, o pipe nomeado do Windows e a memória compartilhada no Windows.

4. O servidor termina a atividade atual.

Para cada thread associado a uma conexão com um cliente, o servidor quebra a conexão com o cliente e marca o thread como morto. Os threads morrem quando percebem que foram marcados como tal. Os threads de conexões ociosas morrem rapidamente. Os threads que estão atualmente processando declarações verificam seu estado periodicamente e demoram mais para morrer. Para informações adicionais sobre a terminação de threads, consulte a Seção 13.7.6.4, “Declaração KILL”, em particular para as instruções sobre operações `REPAIR TABLE` ou `OPTIMIZE TABLE` mortas nas tabelas `MyISAM`.

Para os threads que têm uma transação aberta, a transação é revertida. Se um thread está atualizando uma tabela não transacional, uma operação como uma multipla `UPDATE` ou `INSERT` pode deixar a tabela parcialmente atualizada, porque a operação pode terminar antes de ser concluída.

Se o servidor for um servidor de replicação de origem, ele trata os threads associados às réplicas atualmente conectadas como outros threads de cliente. Isso significa que cada um deles é marcado como morto e sai quando verifica seu estado na próxima vez.

Se o servidor for uma replica, ele para os threads de I/O e SQL, se estiverem ativos, antes de marcar os threads do cliente como mortos. O thread SQL é permitido terminar sua declaração atual (para evitar causar problemas de replicação) e, em seguida, para. Se o thread SQL estiver em meio a uma transação neste ponto, o servidor espera até que o grupo atual de eventos de replicação (se houver) tenha terminado a execução, ou até que o usuário emita uma declaração `KILL QUERY` ou `KILL CONNECTION`. Veja também a Seção 13.4.2.6, “Declaração STOP SLAVE”. Como declarações não transacionais não podem ser revertidas, para garantir uma replicação segura em caso de falha, apenas tabelas transacionais devem ser usadas.

Nota

Para garantir a segurança em caso de falha na réplica, você deve executar a réplica com o `--relay-log-recovery` habilitado.

Veja também a Seção 16.2.4, “Repositórios de Log de Relé e Metadados de Replicação”).

5. O servidor desliga ou fecha os motores de armazenamento.

Nesta etapa, o servidor descarta o cache da tabela e fecha todas as tabelas abertas.

Cada mecanismo de armazenamento realiza quaisquer ações necessárias para as tabelas que ele gerencia. `InnoDB` esvazia seu pool de buffers para o disco (a menos que `innodb_fast_shutdown` seja 2), escreve o LSN atual no espaço de tabelas e termina seus próprios threads internos. `MyISAM` esvazia quaisquer escritas de índice pendentes para uma tabela.

6. O servidor sai.

Para fornecer informações aos processos de gerenciamento, o servidor retorna um dos códigos de saída descritos na lista a seguir. A frase entre parênteses indica a ação realizada pelo systemd em resposta ao código, para plataformas nas quais o systemd é usado para gerenciar o servidor.

* 0 = término bem-sucedido (sem reinício)  
* 1 = término não bem-sucedido (sem reinício)  
* 2 = término não bem-sucedido (reinício feito)

