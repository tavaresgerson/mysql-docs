## 29.12 Descritores de tabela do esquema de desempenho

As tabelas no banco de dados `performance_schema` podem ser agrupadas da seguinte forma:

* Configurar tabelas. Essas tabelas são usadas para configurar e exibir características de monitoramento.

* Tabelas de eventos atuais. A tabela `events_waits_current` contém o evento mais recente para cada tópico. Outras tabelas semelhantes contêm eventos atuais em diferentes níveis da hierarquia de eventos: `events_stages_current` para eventos de estágio, `events_statements_current` para eventos de declaração e `events_transactions_current` para eventos de transação.

* Tabelas de histórico. Essas tabelas têm a mesma estrutura das tabelas de eventos atuais, mas contêm mais linhas. Por exemplo, para eventos de espera, a tabela `events_waits_history` contém os 10 eventos mais recentes por fio. `events_waits_history_long` contém os 10.000 eventos mais recentes. Existem outras tabelas semelhantes para históricos de estágios, declarações e transações.

Para alterar os tamanhos das tabelas de histórico, defina as variáveis de sistema apropriadas na inicialização do servidor. Por exemplo, para definir os tamanhos das tabelas de histórico de eventos de espera, defina `performance_schema_events_waits_history_size` e `performance_schema_events_waits_history_long_size`.

* Tabelas de resumo. Essas tabelas contêm informações agregadas em grupos de eventos, incluindo aqueles que foram descartados das tabelas de histórico.

* Tabelas de instância. Essas tabelas documentam os tipos de objetos que são instrumentados. Um objeto instrumentado, quando usado pelo servidor, produz um evento. Essas tabelas fornecem nomes de eventos e notas explicativas ou informações de status.

* Tabelas mistas. Essas não se enquadram em nenhum dos outros grupos de tabelas.

### 29.12.1 Referência à Tabela do Schema de Desempenho

A tabela a seguir resume todas as tabelas do Schema de Desempenho disponíveis. Para mais detalhes, consulte as descrições individuais das tabelas.

**Tabela 29.1 Tabelas do Schema de Desempenho**

<table frame="box" rules="all" summary="A reference that lists all Performance Schema tables."><col style="width: 25%"/><col style="width: 62%"/><col style="width: 12%"/><thead><tr><th>Table Name</th> <th>Description</th> <th>Introduced</th> </tr></thead><tbody><tr><th scope="row"><code>accounts</code></th> <td>Estatísticas de conexão por conta do cliente</td> <td></td> </tr><tr><th scope="row"><code>binary_log_transaction_compression_stats</code></th> <td>Binary log transaction compression</td> <td>8.0.20</td> </tr><tr><th scope="row"><code>clone_progress</code></th> <td>Clone operation progress</td> <td>8.0.17</td> </tr><tr><th scope="row"><code>clone_status</code></th> <td>Clone operation status</td> <td>8.0.17</td> </tr><tr><th scope="row"><code>component_scheduler_tasks</code></th> <td>Status of scheduled tasks</td> <td>8.0.34</td> </tr><tr><th scope="row"><code>cond_instances</code></th> <td>Synchronization object instances</td> <td></td> </tr><tr><th scope="row"><code>data_lock_waits</code></th> <td>Relações de espera de bloqueio de dados</td> <td></td> </tr><tr><th scope="row"><code>data_locks</code></th> <td>Lås de dados mantidos e solicitados</td> <td></td> </tr><tr><th scope="row"><code>error_log</code></th> <td>Server error log recent entries</td> <td>8.0.22</td> </tr><tr><th scope="row"><code>events_errors_summary_by_account_by_error</code></th> <td>Erros por conta e código de erro</td> <td></td> </tr><tr><th scope="row"><code>events_errors_summary_by_host_by_error</code></th> <td>Erros por host e código de erro</td> <td></td> </tr><tr><th scope="row"><code>events_errors_summary_by_thread_by_error</code></th> <td>Erros por fio e código de erro</td> <td></td> </tr><tr><th scope="row"><code>events_errors_summary_by_user_by_error</code></th> <td>Erros por usuário e código de erro</td> <td></td> </tr><tr><th scope="row"><code>events_errors_summary_global_by_error</code></th> <td>Erros por código de erro</td> <td></td> </tr><tr><th scope="row"><code>events_stages_current</code></th> <td>Current stage events</td> <td></td> </tr><tr><th scope="row"><code>events_stages_history</code></th> <td>Eventos mais recentes por fio</td> <td></td> </tr><tr><th scope="row"><code>events_stages_history_long</code></th> <td>Eventos mais recentes em estádio no geral</td> <td></td> </tr><tr><th scope="row"><code>events_stages_summary_by_account_by_event_name</code></th> <td>Eventos em andamento por conta e nome do evento</td> <td></td> </tr><tr><th scope="row"><code>events_stages_summary_by_host_by_event_name</code></th> <td>Eventos em andamento por nome do anfitrião e nome do evento</td> <td></td> </tr><tr><th scope="row"><code>events_stages_summary_by_thread_by_event_name</code></th> <td>Espera de palco por thread e nome de evento</td> <td></td> </tr><tr><th scope="row"><code>events_stages_summary_by_user_by_event_name</code></th> <td>Eventos em andamento por nome do usuário e nome do evento</td> <td></td> </tr><tr><th scope="row"><code>events_stages_summary_global_by_event_name</code></th> <td>Esperas de palco por nome de evento</td> <td></td> </tr><tr><th scope="row"><code>events_statements_current</code></th> <td>Current statement events</td> <td></td> </tr><tr><th scope="row"><code>events_statements_histogram_by_digest</code></th> <td>Histograma de declaração por esquema e valor de digestão</td> <td></td> </tr><tr><th scope="row"><code>events_statements_histogram_global</code></th> <td>Histograma de declaração resumido globalmente</td> <td></td> </tr><tr><th scope="row"><code>events_statements_history</code></th> <td>Eventos de declaração mais recentes por fio</td> <td></td> </tr><tr><th scope="row"><code>events_statements_history_long</code></th> <td>Eventos mais recentes em geral</td> <td></td> </tr><tr><th scope="row"><code>events_statements_summary_by_account_by_event_name</code></th> <td>Eventos declarados por conta e nome de evento</td> <td></td> </tr><tr><th scope="row"><code>events_statements_summary_by_digest</code></th> <td>Eventos declarativos por esquema e valor de digestão</td> <td></td> </tr><tr><th scope="row"><code>events_statements_summary_by_host_by_event_name</code></th> <td>Eventos declarados por nome de anfitrião e nome do evento</td> <td></td> </tr><tr><th scope="row"><code>events_statements_summary_by_program</code></th> <td>Eventos declarados por programa armazenado</td> <td></td> </tr><tr><th scope="row"><code>events_statements_summary_by_thread_by_event_name</code></th> <td>Eventos declarados por fio e nome de evento</td> <td></td> </tr><tr><th scope="row"><code>events_statements_summary_by_user_by_event_name</code></th> <td>Eventos declarativos por nome de usuário e nome de evento</td> <td></td> </tr><tr><th scope="row"><code>events_statements_summary_global_by_event_name</code></th> <td>Eventos declarativos por nome de evento</td> <td></td> </tr><tr><th scope="row"><code>events_transactions_current</code></th> <td>Current transaction events</td> <td></td> </tr><tr><th scope="row"><code>events_transactions_history</code></th> <td>Eventos de transação mais recentes por fio</td> <td></td> </tr><tr><th scope="row"><code>events_transactions_history_long</code></th> <td>Eventos de transação mais recentes no geral</td> <td></td> </tr><tr><th scope="row"><code>events_transactions_summary_by_account_by_event_name</code></th> <td>Eventos de transação por conta e nome do evento</td> <td></td> </tr><tr><th scope="row"><code>events_transactions_summary_by_host_by_event_name</code></th> <td>Eventos de transação por nome de host e nome de evento</td> <td></td> </tr><tr><th scope="row"><code>events_transactions_summary_by_thread_by_event_name</code></th> <td>Eventos de transação por fio e nome de evento</td> <td></td> </tr><tr><th scope="row"><code>events_transactions_summary_by_user_by_event_name</code></th> <td>Eventos de transação por nome de usuário e nome de evento</td> <td></td> </tr><tr><th scope="row"><code>events_transactions_summary_global_by_event_name</code></th> <td>Eventos de transação por nome de evento</td> <td></td> </tr><tr><th scope="row"><code>events_waits_current</code></th> <td>Current wait events</td> <td></td> </tr><tr><th scope="row"><code>events_waits_history</code></th> <td>Eventos de espera mais recentes por fio</td> <td></td> </tr><tr><th scope="row"><code>events_waits_history_long</code></th> <td>Eventos de espera mais recentes no geral</td> <td></td> </tr><tr><th scope="row"><code>events_waits_summary_by_account_by_event_name</code></th> <td>Eventos esperados por conta e nome do evento</td> <td></td> </tr><tr><th scope="row"><code>events_waits_summary_by_host_by_event_name</code></th> <td>Eventos esperados por nome de host e nome de evento</td> <td></td> </tr><tr><th scope="row"><code>events_waits_summary_by_instance</code></th> <td>Eventos de espera por instância</td> <td></td> </tr><tr><th scope="row"><code>events_waits_summary_by_thread_by_event_name</code></th> <td>Eventos de espera por fio e nome do evento</td> <td></td> </tr><tr><th scope="row"><code>events_waits_summary_by_user_by_event_name</code></th> <td>Eventos esperados por nome de usuário e nome de evento</td> <td></td> </tr><tr><th scope="row"><code>events_waits_summary_global_by_event_name</code></th> <td>Eventos esperados por nome de evento</td> <td></td> </tr><tr><th scope="row"><code>file_instances</code></th> <td>File instances</td> <td></td> </tr><tr><th scope="row"><code>file_summary_by_event_name</code></th> <td>Filtre os eventos por nome de evento</td> <td></td> </tr><tr><th scope="row"><code>file_summary_by_instance</code></th> <td>Eventos por instância do arquivo</td> <td></td> </tr><tr><th scope="row"><code>firewall_group_allowlist</code></th> <td>Firewall de dados em memória para listas de perfil de grupo</td> <td>8.0.23</td> </tr><tr><th scope="row"><code>firewall_groups</code></th> <td>Dados de firewall em memória para perfis de grupo</td> <td>8.0.23</td> </tr><tr><th scope="row"><code>firewall_membership</code></th> <td>Dados de firewall em memória para membros do perfil do grupo</td> <td>8.0.23</td> </tr><tr><th scope="row"><code>global_status</code></th> <td>Global status variables</td> <td></td> </tr><tr><th scope="row"><code>global_variables</code></th> <td>Global system variables</td> <td></td> </tr><tr><th scope="row"><code>host_cache</code></th> <td>Informações do cache de hospedagem interna</td> <td></td> </tr><tr><th scope="row"><code>hosts</code></th> <td>Estatísticas de conexão por nome de host do cliente</td> <td></td> </tr><tr><th scope="row"><code>keyring_component_status</code></th> <td>Informações de status para o componente de chave de segurança instalado</td> <td>8.0.24</td> </tr><tr><th scope="row"><code>keyring_keys</code></th> <td>Metadata for keyring keys</td> <td>8.0.16</td> </tr><tr><th scope="row"><code>log_status</code></th> <td>Informações sobre os registros do servidor para fins de backup</td> <td></td> </tr><tr><th scope="row"><code>memory_summary_by_account_by_event_name</code></th> <td>Operações de memória por conta e nome de evento</td> <td></td> </tr><tr><th scope="row"><code>memory_summary_by_host_by_event_name</code></th> <td>Operações de memória por host e nome de evento</td> <td></td> </tr><tr><th scope="row"><code>memory_summary_by_thread_by_event_name</code></th> <td>Operações de memória por fio e nome de evento</td> <td></td> </tr><tr><th scope="row"><code>memory_summary_by_user_by_event_name</code></th> <td>Operações de memória por usuário e nome de evento</td> <td></td> </tr><tr><th scope="row"><code>memory_summary_global_by_event_name</code></th> <td>Operações de memória globalmente por nome de evento</td> <td></td> </tr><tr><th scope="row"><code>metadata_locks</code></th> <td>Lâminas de bloqueio de metadados e solicitações de bloqueio</td> <td></td> </tr><tr><th scope="row"><code>mutex_instances</code></th> <td>Objetos de sincronização Mutex</td> <td></td> </tr><tr><th scope="row"><code>ndb_sync_excluded_objects</code></th> <td>Objetos do NDB que não podem ser sincronizados</td> <td>8.0.21</td> </tr><tr><th scope="row"><code>ndb_sync_pending_objects</code></th> <td>NDB objects waiting for synchronization</td> <td>8.0.21</td> </tr><tr><th scope="row"><code>objects_summary_global_by_type</code></th> <td>Object summaries</td> <td></td> </tr><tr><th scope="row"><code>performance_timers</code></th> <td>Quais temporizadores estão disponíveis</td> <td></td> </tr><tr><th scope="row"><code>persisted_variables</code></th> <td>Conteúdo do arquivo mysqld-auto.cnf</td> <td></td> </tr><tr><th scope="row"><code>prepared_statements_instances</code></th> <td>Instâncias de declaração preparada e estatísticas</td> <td></td> </tr><tr><th scope="row"><code>processlist</code></th> <td>Process list information</td> <td>8.0.22</td> </tr><tr><th scope="row"><code>replication_applier_configuration</code></th> <td>Parâmetros de configuração para o aplicativo de replicação no replica</td> <td></td> </tr><tr><th scope="row"><code>replication_applier_filters</code></th> <td>Filtros de replicação específicos para canal em replica atual</td> <td></td> </tr><tr><th scope="row"><code>replication_applier_global_filters</code></th> <td>Filtros de replicação global em replica atual</td> <td></td> </tr><tr><th scope="row"><code>replication_applier_status</code></th> <td>Status atual do aplicativo de replicação no replica</td> <td></td> </tr><tr><th scope="row"><code>replication_applier_status_by_coordinator</code></th> <td>Status do aplicativo de aplicação de fio SQL ou coordenador</td> <td></td> </tr><tr><th scope="row"><code>replication_applier_status_by_worker</code></th> <td>Status do aplicativo de aplicação de fio do trabalhador</td> <td></td> </tr><tr><th scope="row"><code>replication_asynchronous_connection_failover</code></th> <td>Listas de fontes para mecanismo de transição de falha de conexão assíncrona</td> <td>8.0.22</td> </tr><tr><th scope="row"><code>replication_asynchronous_connection_failover_managed</code></th> <td>Listas de fontes gerenciadas para mecanismo de falha de conexão assíncrona</td> <td>8.0.23</td> </tr><tr><th scope="row"><code>replication_connection_configuration</code></th> <td>Parâmetros de configuração para conectar-se à fonte</td> <td></td> </tr><tr><th scope="row"><code>replication_connection_status</code></th> <td>Status atual da conexão com a fonte</td> <td></td> </tr><tr><th scope="row"><code>replication_group_communication_information</code></th> <td>Replication group configuration options</td> <td>8.0.27</td> </tr><tr><th scope="row"><code>replication_group_configuration_version</code></th> <td>Versão da configuração de ações de membros para membros do grupo de replicação</td> <td>8.0.26</td> </tr><tr><th scope="row"><code>replication_group_member_actions</code></th> <td>Ações dos membros que estão incluídas na configuração de ações dos membros para membros do grupo de replicação</td> <td>8.0.26</td> </tr><tr><th scope="row"><code>replication_group_member_stats</code></th> <td>Estatísticas dos membros do grupo de replicação</td> <td></td> </tr><tr><th scope="row"><code>replication_group_members</code></th> <td>Rede e status do membro do grupo de replicação</td> <td></td> </tr><tr><th scope="row"><code>rwlock_instances</code></th> <td>Bloquear instâncias de objetos de sincronização</td> <td></td> </tr><tr><th scope="row"><code>session_account_connect_attrs</code></th> <td>Atributos de conexão por sessão atual</td> <td></td> </tr><tr><th scope="row"><code>session_connect_attrs</code></th> <td>Atributos de conexão para todas as sessões</td> <td></td> </tr><tr><th scope="row"><code>session_status</code></th> <td>Variáveis de status para a sessão atual</td> <td></td> </tr><tr><th scope="row"><code>session_variables</code></th> <td>Variáveis do sistema para a sessão atual</td> <td></td> </tr><tr><th scope="row"><code>setup_actors</code></th> <td>Como inicializar o monitoramento para novos threads de primeiro plano</td> <td></td> </tr><tr><th scope="row"><code>setup_consumers</code></th> <td>Consumidores para os quais as informações sobre o evento podem ser armazenadas</td> <td></td> </tr><tr><th scope="row"><code>setup_instruments</code></th> <td>Classes de objetos instrumentados para os quais eventos podem ser coletados</td> <td></td> </tr><tr><th scope="row"><code>setup_objects</code></th> <td>Quais objetos devem ser monitorados</td> <td></td> </tr><tr><th scope="row"><code>setup_threads</code></th> <td>Nomes e atributos de fios instrumentados</td> <td></td> </tr><tr><th scope="row"><code>socket_instances</code></th> <td>Active connection instances</td> <td></td> </tr><tr><th scope="row"><code>socket_summary_by_event_name</code></th> <td>Socket waits and I/O per event name</td> <td></td> </tr><tr><th scope="row"><code>socket_summary_by_instance</code></th> <td>Socket waits and I/O per instance</td> <td></td> </tr><tr><th scope="row"><code>status_by_account</code></th> <td>Variáveis de status de sessão por conta</td> <td></td> </tr><tr><th scope="row"><code>status_by_host</code></th> <td>Variáveis de status de sessão por nome de host</td> <td></td> </tr><tr><th scope="row"><code>status_by_thread</code></th> <td>Variáveis de status de sessão por sessão</td> <td></td> </tr><tr><th scope="row"><code>status_by_user</code></th> <td>Variáveis de status de sessão por nome de usuário</td> <td></td> </tr><tr><th scope="row"><code>table_handles</code></th> <td>Lâminas de fechamento e solicitações de fechamento</td> <td></td> </tr><tr><th scope="row"><code>table_io_waits_summary_by_index_usage</code></th> <td>Table I/O waits per index</td> <td></td> </tr><tr><th scope="row"><code>table_io_waits_summary_by_table</code></th> <td>Table I/O waits per table</td> <td></td> </tr><tr><th scope="row"><code>table_lock_waits_summary_by_table</code></th> <td>Esperas de bloqueio de tabela por tabela</td> <td></td> </tr><tr><th scope="row"><code>threads</code></th> <td>Informações sobre os threads do servidor</td> <td></td> </tr><tr><th scope="row"><code>tls_channel_status</code></th> <td>Status TLS para cada interface de conexão</td> <td>8.0.21</td> </tr><tr><th scope="row"><code>tp_thread_group_state</code></th> <td>Thread pool thread group states</td> <td>8.0.14</td> </tr><tr><th scope="row"><code>tp_thread_group_stats</code></th> <td>Thread pool thread group statistics</td> <td>8.0.14</td> </tr><tr><th scope="row"><code>tp_thread_state</code></th> <td>Thread pool thread information</td> <td>8.0.14</td> </tr><tr><th scope="row"><code>user_defined_functions</code></th> <td>Registered loadable functions</td> <td></td> </tr><tr><th scope="row"><code>user_variables_by_thread</code></th> <td>Variáveis definidas pelo usuário por fio</td> <td></td> </tr><tr><th scope="row"><code>users</code></th> <td>Estatísticas de conexão por nome de usuário do cliente</td> <td></td> </tr><tr><th scope="row"><code>variables_by_thread</code></th> <td>Variáveis do sistema de sessão por sessão</td> <td></td> </tr><tr><th scope="row"><code>variables_info</code></th> <td>Como as variáveis do sistema foram definidas mais recentemente</td> <td></td> </tr></tbody></table>

### 29.12.1 Tabelas de Configuração do Schema de Desempenho

As tabelas de configuração fornecem informações sobre a instrumentação atual e permitem que a configuração de monitoramento seja alterada. Por essa razão, algumas colunas nessas tabelas podem ser alteradas se você tiver o privilégio `UPDATE`.

O uso de tabelas em vez de variáveis individuais para informações de configuração oferece um alto grau de flexibilidade na modificação da configuração do Performance Schema. Por exemplo, você pode usar uma única declaração com sintaxe SQL padrão para fazer várias alterações de configuração simultâneas.

Estes são os modelos disponíveis:

* `setup_actors`: Como inicializar o monitoramento para novos threads de primeiro plano

* `setup_consumers`: Os destinos para os quais as informações do evento podem ser enviadas e armazenadas

* `setup_instruments`: As classes de objetos instrumentados para os quais eventos podem ser coletados

* `setup_objects`: Quais objetos devem ser monitorados

* `setup_threads`: Nomes e atributos de fios instrumentados

#### 29.12.2.1 A tabela setup_actors

A tabela `setup_actors` contém informações que determinam se é necessário habilitar o monitoramento e o registro de eventos históricos para novos threads de servidor de primeiro plano (threads associados a conexões de cliente). Essa tabela tem um tamanho máximo de 100 linhas por padrão. Para alterar o tamanho da tabela, modifique a variável de sistema `performance_schema_setup_actors_size` na inicialização do servidor.

Para cada novo fio de plano de fundo, o Schema de Desempenho corresponde o usuário e o host do fio às linhas da tabela `setup_actors`. Se uma linha dessa tabela corresponder, seus valores nas colunas `ENABLED` e `HISTORY` são usados para definir as colunas `INSTRUMENTED` e `HISTORY`, respectivamente, da linha da tabela `threads` para o fio. Isso permite que a instrumentação e o registro de eventos históricos sejam aplicados seletivamente por host, usuário ou conta (combinação de usuário e host). Se não houver correspondência, as colunas `INSTRUMENTED` e `HISTORY` para o fio são definidas como `NO`.

Para os fios de fundo, não há um usuário associado. `INSTRUMENTED` e `HISTORY` são `YES` por padrão e `setup_actors` não é consultado.

Os conteúdos iniciais da tabela `setup_actors` correspondem a qualquer combinação de usuário e host, portanto, o monitoramento e a coleta de eventos históricos são habilitados por padrão para todos os threads de primeiro plano:

```
mysql> SELECT * FROM performance_schema.setup_actors;
+------+------+------+---------+---------+
| HOST | USER | ROLE | ENABLED | HISTORY |
+------+------+------+---------+---------+
| %    | %    | %    | YES     | YES     |
+------+------+------+---------+---------+
```

Para obter informações sobre como usar a tabela `setup_actors` para afetar o monitoramento de eventos, consulte a Seção 29.4.6, “Pré-filtragem por Fuso Horário”.

As modificações na tabela `setup_actors` afetam apenas os threads de primeiro plano criados após a modificação, e não os threads existentes. Para afetar os threads existentes, modifique as colunas `INSTRUMENTED` e `HISTORY` das linhas da tabela `threads`.

A tabela `setup_actors` tem essas colunas:

* `HOST`

O nome do host. Isso deve ser um nome literal, ou `'%'` para significar “qualquer host”.

* `USER`

O nome do usuário. Isso deve ser um nome literal, ou `'%'` para significar “qualquer usuário”.

* `ROLE`

  Unused.

* `ENABLED`

Se deve habilitar a instrumentação para os threads de primeiro plano correspondentes à linha. O valor é `YES` ou `NO`.

* `HISTORY`

Se deve registrar eventos históricos para os threads de primeiro plano correspondentes à linha. O valor é `YES` ou `NO`.

A tabela `setup_actors` tem esses índices:

* Chave primária em (`HOST`, `USER`, `ROLE`)

`TRUNCATE TABLE` é permitido para a tabela `setup_actors`. Ele remove as linhas.

#### 29.12.2.2 A tabela setup_consumers

A tabela `setup_consumers` lista os tipos de consumidores para os quais as informações de evento podem ser armazenadas e que estão habilitados:

```
mysql> SELECT * FROM performance_schema.setup_consumers;
+----------------------------------+---------+
| NAME                             | ENABLED |
+----------------------------------+---------+
| events_stages_current            | NO      |
| events_stages_history            | NO      |
| events_stages_history_long       | NO      |
| events_statements_current        | YES     |
| events_statements_history        | YES     |
| events_statements_history_long   | NO      |
| events_transactions_current      | YES     |
| events_transactions_history      | YES     |
| events_transactions_history_long | NO      |
| events_waits_current             | NO      |
| events_waits_history             | NO      |
| events_waits_history_long        | NO      |
| global_instrumentation           | YES     |
| thread_instrumentation           | YES     |
| statements_digest                | YES     |
+----------------------------------+---------+
```

As configurações de consumo na tabela `setup_consumers` formam uma hierarquia de níveis mais altos para níveis mais baixos. Para informações detalhadas sobre o efeito da ativação de diferentes consumidores, consulte a Seção 29.4.7, “Pré-filtragem por Consumidor”.

As modificações na tabela `setup_consumers` afetam o monitoramento imediatamente.

A tabela `setup_consumers` tem essas colunas:

* `NAME`

O nome do consumidor.

* `ENABLED`

Se o consumidor está habilitado. O valor é `YES` ou `NO`. Esta coluna pode ser modificada. Se você desabilitar um consumidor, o servidor não gasta tempo adicionando informações de evento a ele.

A tabela `setup_consumers` tem esses índices:

* Chave primária ativada (`NAME`)

`TRUNCATE TABLE` não é permitido para a tabela `setup_consumers`.

#### 29.12.2.3 A tabela setup_instruments

A tabela `setup_instruments` lista as classes de objetos instrumentados para os quais eventos podem ser coletados:

```
mysql> SELECT * FROM performance_schema.setup_instruments\G
*************************** 1. row ***************************
         NAME: wait/synch/mutex/pfs/LOCK_pfs_share_list
      ENABLED: NO
        TIMED: NO
   PROPERTIES: singleton
        FLAGS: NULL
   VOLATILITY: 1
DOCUMENTATION: Components can provide their own performance_schema tables.
This lock protects the list of such tables definitions.
...
*************************** 410. row ***************************
         NAME: stage/sql/executing
      ENABLED: NO
        TIMED: NO
   PROPERTIES:
        FLAGS: NULL
   VOLATILITY: 0
DOCUMENTATION: NULL
...
*************************** 733. row ***************************
         NAME: statement/abstract/Query
      ENABLED: YES
        TIMED: YES
   PROPERTIES: mutable
        FLAGS: NULL
   VOLATILITY: 0
DOCUMENTATION: SQL query just received from the network.
At this point, the real statement type is unknown, the type
will be refined after SQL parsing.
...
*************************** 737. row ***************************
         NAME: memory/performance_schema/mutex_instances
      ENABLED: YES
        TIMED: NULL
   PROPERTIES: global_statistics
        FLAGS:
   VOLATILITY: 1
DOCUMENTATION: Memory used for table performance_schema.mutex_instances
...
*************************** 823. row ***************************
         NAME: memory/sql/Prepared_statement::infrastructure
      ENABLED: YES
        TIMED: NULL
   PROPERTIES: controlled_by_default
        FLAGS: controlled
   VOLATILITY: 0
DOCUMENTATION: Map infrastructure for prepared statements per session.
...
```

Cada instrumento adicionado ao código-fonte fornece uma linha para a tabela `setup_instruments`, mesmo quando o código instrumentado não é executado. Quando um instrumento é habilitado e executado, instâncias instrumentadas são criadas, que são visíveis nas tabelas `xxx_instances`, como `file_instances` ou `rwlock_instances`.

As modificações na maioria das linhas do `setup_instruments` afetam o monitoramento imediatamente. Para alguns instrumentos, as modificações só são eficazes apenas no início da inicialização do servidor; alterá-las durante a execução não tem efeito. Isso afeta principalmente os mutexes, condições e rwlocks no servidor, embora possa haver outros instrumentos para os quais isso seja verdade.

Para mais informações sobre o papel da tabela `setup_instruments` no filtro de eventos, consulte a Seção 29.4.3, “Pré-filtro de eventos”.

A tabela `setup_instruments` tem essas colunas:

* `NAME`

O nome do instrumento. Os nomes dos instrumentos podem ter várias partes e formar uma hierarquia, conforme discutido na Seção 29.6, “Convenções de Nomenclatura de Instrumentos do Schema de Desempenho”. Os eventos produzidos pela execução de um instrumento têm um valor `EVENT_NAME` que é retirado do valor `NAME` do instrumento. (Os eventos não têm realmente um “nome”, mas isso fornece uma maneira de associar eventos com instrumentos.)

* `ENABLED`

Se o instrumento está habilitado. O valor é `YES` ou `NO`. Um instrumento desabilitado não produz eventos. Esta coluna pode ser modificada, embora a definição de `ENABLED` não tenha efeito para instrumentos que já foram criados.

* `TIMED`

Se o instrumento é cronometrado. O valor é `YES`, `NO` ou `NULL`. Esta coluna pode ser modificada, embora a definição de `TIMED` não tenha efeito para instrumentos que já foram criados.

Um valor `TIMED` de `NULL` indica que o instrumento não suporta temporização. Por exemplo, as operações de memória não são temporizadas, portanto, sua coluna `TIMED` é `NULL`.

Definir `TIMED` para `NULL` para um instrumento que suporta temporização não tem efeito, assim como definir `TIMED` para não `NULL` para um instrumento que não suporta temporização.

Se um instrumento habilitado não estiver cronometrado, o código do instrumento é habilitado, mas o temporizador não está. Os eventos produzidos pelo instrumento têm `NULL` para os valores do temporizador `TIMER_START`, `TIMER_END` e `TIMER_WAIT`. Isso, por sua vez, faz com que esses valores sejam ignorados ao calcular os valores de soma, mínimo, máximo e média de tempo em tabelas resumidas.

* `PROPERTIES`

Propriedades do instrumento. Esta coluna utiliza o tipo de dados `SET`, portanto, várias bandeiras da lista a seguir podem ser definidas por instrumento:

+ `controlled_by_default`: a memória é coletada por padrão para este instrumento.

+ `global_statistics`: O instrumento produz apenas resumos globais. Resumos para níveis mais finos não estão disponíveis, como por fio, conta, usuário ou host. Por exemplo, a maioria dos instrumentos de memória produz apenas resumos globais.

+ `mutable`: O instrumento pode "mutar" para um mais específico. Essa propriedade se aplica apenas a instrumentos de declaração.

+ `progress`: O instrumento é capaz de relatar dados de progresso. Esta propriedade se aplica apenas a instrumentos em fase.

+ `singleton`: O instrumento tem uma única instância. Por exemplo, a maioria dos bloqueios de mutex globais no servidor são singletons, então os instrumentos correspondentes também são.

+ `user`: O instrumento está diretamente relacionado ao volume de trabalho do usuário (ao contrário do volume de trabalho do sistema). Um desses instrumentos é `wait/io/socket/sql/client_connection`.

* `FLAGS`

Se a memória do instrumento é controlada.

Essa bandeira é compatível apenas com instrumentos de memória não global e pode ser definida ou desdefinida. Por exemplo:

  ```
                SQL> UPDATE PERFORMANCE_SCHEMA.SETUP_INTRUMENTS SET FLAGS="controlled" WHERE NAME='memory/sql/NET::buff';
  ```

Nota

Tentar definir `FLAGS = controlled` em instrumentos não de memória ou em instrumentos de memória global falha silenciosamente.

* `VOLATILITY`

A volatilidade do instrumento. Os valores de volatilidade variam de baixo a alto. Os valores correspondem às constantes `PSI_VOLATILITY_xxx` definidas no arquivo de cabeçalho `mysql/psi/psi_base.h`:

  ```
  #define PSI_VOLATILITY_UNKNOWN 0
  #define PSI_VOLATILITY_PERMANENT 1
  #define PSI_VOLATILITY_PROVISIONING 2
  #define PSI_VOLATILITY_DDL 3
  #define PSI_VOLATILITY_CACHE 4
  #define PSI_VOLATILITY_SESSION 5
  #define PSI_VOLATILITY_TRANSACTION 6
  #define PSI_VOLATILITY_QUERY 7
  #define PSI_VOLATILITY_INTRA_QUERY 8
  ```

A coluna `VOLATILITY` é puramente informativa, para fornecer aos usuários (e ao código do Schema de Desempenho) uma indicação sobre o comportamento do runtime do instrumento.

Os instrumentos com um índice de baixa volatilidade (PERMANENTE = 1) são criados uma vez no início da inicialização do servidor e nunca destruídos ou recriados durante a operação normal do servidor. Eles são destruídos apenas durante o desligamento do servidor.

Por exemplo, o mutex `wait/synch/mutex/pfs/LOCK_pfs_share_list` é definido com uma volatilidade de 1, o que significa que ele é criado uma vez. O possível custo adicional da própria instrumentação (ou seja, a inicialização do mutex) não tem efeito para este instrumento. O custo adicional do tempo de execução ocorre apenas quando o mutex é bloqueado ou desbloqueado.

Instrumentos com um índice de volatilidade mais alto (por exemplo, SESSION = 5) são criados e destruídos para cada sessão do usuário. Por exemplo, o mutex `wait/synch/mutex/sql/THD::LOCK_query_plan` é criado sempre que uma sessão se conecta e destruído quando a sessão se desconecta.

Esse mutex é mais sensível ao custo do Schema de desempenho, porque o custo não vem apenas da instrumentação de bloqueio e desbloqueio, mas também da instrumentação de criação e destruição de mutex, que é executada com mais frequência.

Outro aspecto da volatilidade diz respeito ao fato de se uma atualização na coluna `ENABLED` realmente tenha algum efeito e quando isso ocorrerá:

+ Uma atualização de `ENABLED` afeta objetos instrumentados criados posteriormente, mas não tem efeito sobre os instrumentos já criados.

+ Os instrumentos que são mais "voláteis" usam as novas configurações da tabela `setup_instruments` mais cedo.

Por exemplo, essa declaração não afeta o mutex `LOCK_query_plan` para sessões existentes, mas tem efeito em novas sessões criadas após a atualização:

  ```
  UPDATE performance_schema.setup_instruments
  SET ENABLED=value
  WHERE NAME = 'wait/synch/mutex/sql/THD::LOCK_query_plan';
  ```

Essa declaração, na verdade, não tem nenhum efeito:

  ```
  UPDATE performance_schema.setup_instruments
  SET ENABLED=value
  WHERE NAME = 'wait/synch/mutex/pfs/LOCK_pfs_share_list';
  ```

Este mutex é permanente e foi criado antes da execução da atualização. O mutex nunca é criado novamente, portanto, o valor `ENABLED` em `setup_instruments` nunca é usado. Para habilitar ou desabilitar este mutex, use a tabela `mutex_instances` em vez disso.

* `DOCUMENTATION`

Uma cadeia que descreve o propósito do instrumento. O valor é `NULL` se nenhuma descrição estiver disponível.

A tabela `setup_instruments` tem esses índices:

* Chave primária ativada (`NAME`)

`TRUNCATE TABLE` não é permitido para a tabela `setup_instruments`.

A partir do MySQL 8.0.27, para auxiliar no monitoramento e na solução de problemas, o instrumento do Schema de Desempenho é usado para exportar os nomes dos threads instrumentados para o sistema operacional. Isso permite que utilitários que exibem nomes de threads, como depuradores e o comando **ps** do Unix, exibam nomes distintos de threads do **mysqld** em vez de “mysqld”. Esse recurso é suportado apenas no Linux, macOS e Windows.

Suponha que o **mysqld** esteja em execução em um sistema que tem uma versão do **ps** que suporte essa sintaxe de invocação:

```
ps -C mysqld H -o "pid tid cmd comm"
```

Sem a exportação de nomes de fios para o sistema operacional, o comando exibe a saída assim, onde a maioria dos valores `COMMAND` são `mysqld`:

```
  PID   TID CMD                         COMMAND
 1377  1377 /usr/sbin/mysqld            mysqld
 1377  1528 /usr/sbin/mysqld            mysqld
 1377  1529 /usr/sbin/mysqld            mysqld
 1377  1530 /usr/sbin/mysqld            mysqld
 1377  1531 /usr/sbin/mysqld            mysqld
 1377  1534 /usr/sbin/mysqld            mysqld
 1377  1535 /usr/sbin/mysqld            mysqld
 1377  1588 /usr/sbin/mysqld            xpl_worker1
 1377  1589 /usr/sbin/mysqld            xpl_worker0
 1377  1590 /usr/sbin/mysqld            mysqld
 1377  1594 /usr/sbin/mysqld            mysqld
 1377  1595 /usr/sbin/mysqld            mysqld
```

Com a exportação dos nomes dos fios para o sistema operacional, a saída tem a seguinte aparência, com fios que têm um nome semelhante ao nome do instrumento:

```
  PID   TID CMD                         COMMAND
27668 27668 /usr/sbin/mysqld            mysqld
27668 27671 /usr/sbin/mysqld            ib_io_ibuf
27668 27672 /usr/sbin/mysqld            ib_io_log
27668 27673 /usr/sbin/mysqld            ib_io_rd-1
27668 27674 /usr/sbin/mysqld            ib_io_rd-2
27668 27677 /usr/sbin/mysqld            ib_io_wr-1
27668 27678 /usr/sbin/mysqld            ib_io_wr-2
27668 27699 /usr/sbin/mysqld            xpl_worker-2
27668 27700 /usr/sbin/mysqld            xpl_accept-1
27668 27710 /usr/sbin/mysqld            evt_sched
27668 27711 /usr/sbin/mysqld            sig_handler
27668 27933 /usr/sbin/mysqld            connection
```

Diferentes instâncias de fio dentro da mesma classe são numeradas para fornecer nomes distintos, quando isso for viável. Devido às restrições sobre o comprimento do nome em relação a um número potencialmente grande de conexões, as conexões são nomeadas simplesmente `connection`.

#### 29.12.2.4 A tabela setup_objects

A tabela `setup_objects` controla se o Schema de Desempenho monitora objetos específicos. Essa tabela tem um tamanho máximo de 100 linhas por padrão. Para alterar o tamanho da tabela, modifique a variável de sistema `performance_schema_setup_objects_size` na inicialização do servidor.

O conteúdo inicial do `setup_objects` parece assim:

```
mysql> SELECT * FROM performance_schema.setup_objects;
+-------------+--------------------+-------------+---------+-------+
| OBJECT_TYPE | OBJECT_SCHEMA      | OBJECT_NAME | ENABLED | TIMED |
+-------------+--------------------+-------------+---------+-------+
| EVENT       | mysql              | %           | NO      | NO    |
| EVENT       | performance_schema | %           | NO      | NO    |
| EVENT       | information_schema | %           | NO      | NO    |
| EVENT       | %                  | %           | YES     | YES   |
| FUNCTION    | mysql              | %           | NO      | NO    |
| FUNCTION    | performance_schema | %           | NO      | NO    |
| FUNCTION    | information_schema | %           | NO      | NO    |
| FUNCTION    | %                  | %           | YES     | YES   |
| PROCEDURE   | mysql              | %           | NO      | NO    |
| PROCEDURE   | performance_schema | %           | NO      | NO    |
| PROCEDURE   | information_schema | %           | NO      | NO    |
| PROCEDURE   | %                  | %           | YES     | YES   |
| TABLE       | mysql              | %           | NO      | NO    |
| TABLE       | performance_schema | %           | NO      | NO    |
| TABLE       | information_schema | %           | NO      | NO    |
| TABLE       | %                  | %           | YES     | YES   |
| TRIGGER     | mysql              | %           | NO      | NO    |
| TRIGGER     | performance_schema | %           | NO      | NO    |
| TRIGGER     | information_schema | %           | NO      | NO    |
| TRIGGER     | %                  | %           | YES     | YES   |
+-------------+--------------------+-------------+---------+-------+
```

As modificações na tabela `setup_objects` afetam o monitoramento de objetos imediatamente.

Para os tipos de objeto listados em `setup_objects`, o Schema de Desempenho usa a tabela para monitorá-los. A correspondência de objetos é baseada nas colunas `OBJECT_SCHEMA` e `OBJECT_NAME`. Os objetos para os quais não há correspondência não são monitorados.

O efeito da configuração padrão do objeto é instrumentar todas as tabelas, exceto aquelas nos bancos de dados `mysql`, `INFORMATION_SCHEMA` e `performance_schema`. (As tabelas no banco de dados `INFORMATION_SCHEMA` não são instrumentadas, independentemente do conteúdo de `setup_objects`; a linha para `information_schema.%` faz isso explícito por padrão.)

Quando o Schema de Desempenho verifica uma correspondência em `setup_objects`, ele tenta encontrar correspondências mais específicas primeiro. Por exemplo, com uma tabela `db1.t1`, ele procura uma correspondência para `'db1'` e `'t1'`, depois para `'db1'` e `'%'`, depois para `'%'` e `'%'`. A ordem em que ocorre a correspondência é importante porque diferentes linhas de correspondência `setup_objects` podem ter diferentes valores de `ENABLED` e `TIMED`.

As linhas podem ser inseridas ou excluídas de `setup_objects` por usuários com o privilégio `INSERT` ou `DELETE` na tabela. Para as linhas existentes, apenas as colunas `ENABLED` e `TIMED` podem ser modificadas, por usuários com o privilégio `UPDATE` na tabela.

Para mais informações sobre o papel da tabela `setup_objects` no filtro de eventos, consulte a Seção 29.4.3, “Pré-filtro de eventos”.

A tabela `setup_objects` tem essas colunas:

* `OBJECT_TYPE`

O tipo de objeto a ser instrumentado. O valor é um dos `'EVENT'` (evento do Cronômetro de Eventos), `'FUNCTION'` (função armazenada), `'PROCEDURE'` (procedimento armazenado), `'TABLE'` (tabela base) ou `'TRIGGER'` (trigger).

O filtro `TABLE` afeta eventos de I/O de tabela (instrumento `wait/io/table/sql/handler`) e eventos de bloqueio de tabela (instrumento `wait/lock/table/sql/handler`).

* `OBJECT_SCHEMA`

O esquema que contém o objeto. Isso deve ser um nome literal, ou `'%'` para significar “qualquer esquema”.

* `OBJECT_NAME`

O nome do objeto instrumentado. Isso deve ser um nome literal, ou `'%'` para significar “qualquer objeto”.

* `ENABLED`

Se os eventos para o objeto estão instrumentados. O valor é `YES` ou `NO`. Esta coluna pode ser modificada.

* `TIMED`

Se os eventos para o objeto são temporizados. Essa coluna pode ser modificada.

A tabela `setup_objects` tem esses índices:

* Índice sobre (`OBJECT_TYPE`, `OBJECT_SCHEMA`, `OBJECT_NAME`)

`TRUNCATE TABLE` é permitido para a tabela `setup_objects`. Ele remove as linhas.

#### 29.12.2.5 A tabela setup_threads

A tabela `setup_threads` lista as classes de fio instrumentadas. Ela expõe os nomes e atributos das classes de fio:

```
mysql> SELECT * FROM performance_schema.setup_threads\G
*************************** 1. row ***************************
         NAME: thread/performance_schema/setup
      ENABLED: YES
      HISTORY: YES
   PROPERTIES: singleton
   VOLATILITY: 0
DOCUMENTATION: NULL
...
*************************** 4. row ***************************
         NAME: thread/sql/main
      ENABLED: YES
      HISTORY: YES
   PROPERTIES: singleton
   VOLATILITY: 0
DOCUMENTATION: NULL
*************************** 5. row ***************************
         NAME: thread/sql/one_connection
      ENABLED: YES
      HISTORY: YES
   PROPERTIES: user
   VOLATILITY: 0
DOCUMENTATION: NULL
...
*************************** 10. row ***************************
         NAME: thread/sql/event_scheduler
      ENABLED: YES
      HISTORY: YES
   PROPERTIES: singleton
   VOLATILITY: 0
DOCUMENTATION: NULL
```

A tabela `setup_threads` tem essas colunas:

* `NAME`

O nome do instrumento. Os instrumentos de rosca começam com `thread` (por exemplo, `thread/sql/parser_service` ou `thread/performance_schema/setup`).

* `ENABLED`

Se o instrumento está habilitado. O valor é `YES` ou `NO`. Esta coluna pode ser modificada, embora a definição de `ENABLED` não tenha efeito para os threads que já estão em execução.

Para os threads de fundo, definir o valor de `ENABLED` controla se `INSTRUMENTED` é definido como `YES` ou `NO` para os threads que são posteriormente criados para este instrumento e listados na tabela `threads`. Para os threads de primeiro plano, esta coluna não tem efeito; a tabela `setup_actors` tem precedência.

* `HISTORY`

Se deve registrar eventos históricos para o instrumento. O valor é `YES` ou `NO`. Esta coluna pode ser modificada, embora a configuração de `HISTORY` não tenha efeito para os threads que já estão em execução.

Para os threads de fundo, definir o valor de `HISTORY` controla se `HISTORY` é definido como `YES` ou `NO` para os threads que são posteriormente criados para este instrumento e listados na tabela `threads`. Para os threads de primeiro plano, esta coluna não tem efeito; a tabela `setup_actors` tem precedência.

* `PROPERTIES`

Propriedades do instrumento. Esta coluna utiliza o tipo de dados `SET`, portanto, várias bandeiras da lista a seguir podem ser definidas por instrumento:

+ `singleton`: O instrumento tem uma única instância. Por exemplo, há apenas um fio para o instrumento `thread/sql/main`.

+ `user`: O instrumento está diretamente relacionado ao trabalho do usuário (ao contrário do trabalho do sistema). Por exemplo, os threads como `thread/sql/one_connection` que executam uma sessão do usuário têm a propriedade `user` para diferenciá-los dos threads do sistema.

* `VOLATILITY`

A volatilidade do instrumento. Esta coluna tem o mesmo significado que na tabela `setup_instruments`. Veja a Seção 29.12.2.3, “A tabela setup_instruments”.

* `DOCUMENTATION`

Uma cadeia que descreve o propósito do instrumento. O valor é `NULL` se nenhuma descrição estiver disponível.

A tabela `setup_threads` tem esses índices:

* Chave primária ativada (`NAME`)

`TRUNCATE TABLE` não é permitido para a tabela `setup_threads`.

### 29.12.3 Tabelas de Instância do Schema de Desempenho

As tabelas de instância documentam os tipos de objetos que são instrumentados. Elas fornecem nomes de eventos e notas explicativas ou informações de status:

* `cond_instances`: Instâncias de objetos de sincronização de condição

* `file_instances`: Instâncias de arquivo * `mutex_instances`: Instâncias de objetos de sincronização de mutex

* `rwlock_instances`: Objetos de sincronização de bloqueio

* `socket_instances`: Instâncias de conexão ativa

Essas tabelas listam objetos de sincronização instrumentados, arquivos e conexões. Existem três tipos de objetos de sincronização: `cond`, `mutex` e `rwlock`. Cada tabela de instância tem uma coluna `EVENT_NAME` ou `NAME` para indicar o instrumento associado a cada linha. Os nomes dos instrumentos podem ter várias partes e formar uma hierarquia, conforme discutido na Seção 29.6, “Convenções de Nomenclatura de Instrumentos do Schema de Desempenho”.

As colunas `mutex_instances.LOCKED_BY_THREAD_ID` e `rwlock_instances.WRITE_LOCKED_BY_THREAD_ID` são extremamente importantes para investigar gargalos de desempenho ou deadlocks. Para exemplos de como usá-las para esse propósito, consulte a Seção 29.19, “Usando o Schema de Desempenho para Diagnosticar Problemas”

#### 29.12.3.1 A tabela cond_instances

A tabela `cond_instances` lista todas as condições observadas pelo Schema de Desempenho enquanto o servidor está sendo executado. Uma condição é um mecanismo de sincronização usado no código para sinalizar que um evento específico ocorreu, de modo que um thread que está esperando por essa condição possa retomar o trabalho.

Quando um fio está esperando algo acontecer, o nome da condição é uma indicação do que o fio está esperando, mas não há uma maneira imediata de saber qual outro fio, ou quais outros fios, causa a condição de acontecer.

A tabela `cond_instances` tem essas colunas:

* `NAME`

O nome do instrumento associado à condição.

* `OBJECT_INSTANCE_BEGIN`

O endereço em memória à condição instrumentada.

A tabela `cond_instances` tem esses índices:

* Chave primária em (`OBJECT_INSTANCE_BEGIN`)
* Índice em (`NAME`)

`TRUNCATE TABLE` não é permitido para a tabela `cond_instances`.

#### 29.12.3.2 A tabela file_instances

A tabela `file_instances` lista todos os arquivos vistos pelo Schema de Desempenho ao executar a instrumentação de E/S de arquivo. Se um arquivo no disco nunca tiver sido aberto, ele não é mostrado em `file_instances`. Quando um arquivo é excluído do disco, ele também é removido da tabela `file_instances`.

A tabela `file_instances` tem essas colunas:

* `FILE_NAME`

O nome do arquivo.

* `EVENT_NAME`

O nome do instrumento associado ao arquivo.

* `OPEN_COUNT`

O número de manipulações abertas no arquivo. Se um arquivo foi aberto e depois fechado, ele foi aberto 1 vez, mas `OPEN_COUNT` é 0. Para listar todos os arquivos atualmente abertos pelo servidor, use `WHERE OPEN_COUNT > 0`.

A tabela `file_instances` tem esses índices:

* Chave primária em (`FILE_NAME`)
* Índice em (`EVENT_NAME`)

`TRUNCATE TABLE` não é permitido para a tabela `file_instances`.

#### 29.12.3.3 A tabela mutex_instances

A tabela `mutex_instances` lista todos os mutexes vistos pelo Schema de Desempenho enquanto o servidor está sendo executado. Um mutex é um mecanismo de sincronização usado no código para garantir que apenas um thread, em um determinado momento, possa ter acesso a algum recurso comum. O recurso é dito estar "protegido" pelo mutex.

Quando dois threads estão executando no servidor (por exemplo, duas sessões de usuário executando uma consulta simultaneamente) precisam acessar o mesmo recurso (um arquivo, um buffer ou algum pedaço de dados), esses dois threads competem entre si, de modo que a primeira consulta que obtém um bloqueio no mutex faz com que a outra consulta espere até que a primeira esteja pronta e desbloqueie o mutex.

O trabalho realizado enquanto se mantém um mutex é dito estar em uma "seção crítica", e múltiplas consultas executam essa seção crítica de uma maneira serializada (uma de cada vez), o que é um gargalo potencial.

A tabela `mutex_instances` tem essas colunas:

* `NAME`

O nome do instrumento associado ao mutex.

* `OBJECT_INSTANCE_BEGIN`

O endereço em memória do mutex instrumentado.

* `LOCKED_BY_THREAD_ID`

Quando um fio atualmente tem um mutex bloqueado, `LOCKED_BY_THREAD_ID` é o `THREAD_ID` do fio de bloqueio, caso contrário, é `NULL`.

A tabela `mutex_instances` tem esses índices:

* Chave primária em (`OBJECT_INSTANCE_BEGIN`)
* Índice em (`NAME`)
* Índice em (`LOCKED_BY_THREAD_ID`)

`TRUNCATE TABLE` não é permitido para a tabela `mutex_instances`.

Para cada mutex instrumentado no código, o Gerador de Desempenho fornece as seguintes informações.

* A tabela `setup_instruments` lista o nome do ponto de instrumentação, com o prefixo `wait/synch/mutex/`.

* Quando algum código cria um mutex, uma linha é adicionada à tabela `mutex_instances`. A coluna `OBJECT_INSTANCE_BEGIN` é uma propriedade que identifica de forma única o mutex.

* Quando um fio tenta bloquear um mutex, a tabela `events_waits_current` mostra uma linha para esse fio, indicando que ele está esperando por um mutex (na coluna `EVENT_NAME`) e indicando qual mutex está sendo aguardado (na coluna `OBJECT_INSTANCE_BEGIN`).

* Quando um fio consegue bloquear um mutex:

+ `events_waits_current` indica que a espera no mutex foi concluída (nas colunas `TIMER_END` e `TIMER_WAIT`)

+ O evento de espera concluído é adicionado às tabelas `events_waits_history` e `events_waits_history_long`

+ `mutex_instances` mostra que o mutex agora pertence ao thread (na coluna `THREAD_ID`).

* Quando um fio desbloqueia um mutex, `mutex_instances` mostra que o mutex não tem mais proprietário (a coluna `THREAD_ID` é `NULL`).

* Quando um objeto de mutex é destruído, a linha correspondente é removida de `mutex_instances`.

Ao realizar consultas em ambas as seguintes tabelas, um aplicativo de monitoramento ou um DBA pode detectar gargalos ou bloqueios entre os threads que envolvem mútuos:

* `events_waits_current`, para ver qual mutex um thread está esperando

* `mutex_instances`, para ver qual outro fio atualmente possui um mutex

#### 29.12.3.4 A tabela rwlock_instances

A tabela `rwlock_instances` lista todas as instâncias de rwlock (bloqueio de leitura e escrita) observadas pelo Schema de Desempenho enquanto o servidor está sendo executado. Um `rwlock` é um mecanismo de sincronização usado no código para garantir que os threads em um determinado momento possam ter acesso a algum recurso comum seguindo certas regras. O recurso é dito estar “protegido” pelo `rwlock`. O acesso é compartilhado (muitos threads podem ter um bloqueio de leitura ao mesmo tempo), exclusivo (apenas um thread pode ter um bloqueio de escrita em um determinado momento) ou compartilhado-exclusivo (um thread pode ter um bloqueio de escrita enquanto permite leituras inconsistentes por outros threads). O acesso compartilhado-exclusivo é conhecido como `sxlock` e otimiza a concorrência e melhora a escalabilidade para cargas de trabalho de leitura e escrita.

Dependendo de quantas threads estão solicitando um bloqueio e da natureza dos bloqueios solicitados, o acesso pode ser concedido em modo compartilhado, modo exclusivo, modo compartilhado-exclusivo ou não concedido, aguardando que outras threads terminem primeiro.

A tabela `rwlock_instances` tem essas colunas:

* `NAME`

O nome do instrumento associado ao bloqueio.

* `OBJECT_INSTANCE_BEGIN`

O endereço em memória do bloqueio instrumentado.

* `WRITE_LOCKED_BY_THREAD_ID`

Quando um fio atualmente tem um `rwlock` bloqueado no modo exclusivo (de escrita), `WRITE_LOCKED_BY_THREAD_ID` é o `THREAD_ID` do fio de bloqueio, caso contrário, é `NULL`.

* `READ_LOCKED_BY_COUNT`

Quando um fio atualmente tem um `rwlock` bloqueado no modo compartilhado (leitura), `READ_LOCKED_BY_COUNT` é incrementado por

1. Este é um contador apenas, portanto, não pode ser usado diretamente para descobrir qual fio mantém um bloqueio de leitura, mas pode ser usado para verificar se há uma disputa de leitura em um `rwlock`, e ver quantos leitores estão atualmente ativos.

A tabela `rwlock_instances` tem esses índices:

* Chave primária em (`OBJECT_INSTANCE_BEGIN`)
* Índice em (`NAME`)
* Índice em (`WRITE_LOCKED_BY_THREAD_ID`)

`TRUNCATE TABLE` não é permitido para a tabela `rwlock_instances`.

Ao realizar consultas em ambas as seguintes tabelas, um aplicativo de monitoramento ou um DBA pode detectar alguns gargalos ou bloqueios entre os threads que envolvem bloqueios:

* `events_waits_current`, para ver o que a `rwlock` uma thread está esperando

* `rwlock_instances`, para ver qual outro fio atualmente possui um `rwlock`

Há uma limitação: o `rwlock_instances` pode ser usado apenas para identificar o thread que detém um bloqueio de escrita, mas não os threads que detêm um bloqueio de leitura.

#### 29.12.3.5 A tabela socket_instances

A tabela `socket_instances` fornece um instantâneo em tempo real das conexões ativas no servidor MySQL. A tabela contém uma linha por conexão de arquivo de rede TCP/IP ou Unix. As informações disponíveis nesta tabela fornecem um instantâneo em tempo real das conexões ativas no servidor. (Informações adicionais estão disponíveis em tabelas de resumo de soquetes, incluindo atividade de rede, como operações de soquete e número de bytes transmitidos e recebidos; consulte Seção 29.12.20.9, “Tabelas de Resumo de Soquetes”).

```
mysql> SELECT * FROM performance_schema.socket_instances\G
*************************** 1. row ***************************
           EVENT_NAME: wait/io/socket/sql/server_unix_socket
OBJECT_INSTANCE_BEGIN: 4316619408
            THREAD_ID: 1
            SOCKET_ID: 16
                   IP:
                 PORT: 0
                STATE: ACTIVE
*************************** 2. row ***************************
           EVENT_NAME: wait/io/socket/sql/client_connection
OBJECT_INSTANCE_BEGIN: 4316644608
            THREAD_ID: 21
            SOCKET_ID: 39
                   IP: 127.0.0.1
                 PORT: 55233
                STATE: ACTIVE
*************************** 3. row ***************************
           EVENT_NAME: wait/io/socket/sql/server_tcpip_socket
OBJECT_INSTANCE_BEGIN: 4316699040
            THREAD_ID: 1
            SOCKET_ID: 14
                   IP: 0.0.0.0
                 PORT: 50603
                STATE: ACTIVE
```

Os instrumentos de soquete têm nomes na forma `wait/io/socket/sql/socket_type` e são usados da seguinte forma:

1. O servidor possui um soquete de escuta para cada protocolo de rede que ele suporta. Os instrumentos associados aos soquetes de escuta para conexões de arquivos de soquete TCP/IP ou Unix têm um valor *`socket_type`* de `server_tcpip_socket`, respectivamente.

2. Quando um soquete de escuta detecta uma conexão, o servidor transfere a conexão para um novo soquete gerenciado por um fio separado. O instrumento para o novo fio de conexão tem um valor *`socket_type`* de `client_connection`.

3. Quando uma conexão é encerrada, a linha em `socket_instances` correspondente a ela é excluída.

A tabela `socket_instances` tem essas colunas:

* `EVENT_NAME`

O nome do instrumento `wait/io/socket/*` que produziu o evento. Este é um valor `NAME` da tabela `setup_instruments`. Os nomes dos instrumentos podem ter várias partes e formar uma hierarquia, conforme discutido na Seção 29.6, “Convenções de Nomenclatura de Instrumentos do Schema de Desempenho”.

* `OBJECT_INSTANCE_BEGIN`

Esta coluna identifica exclusivamente o soquete. O valor é o endereço de um objeto na memória.

* `THREAD_ID`

O identificador de fio interno atribuído pelo servidor. Cada soquete é gerenciado por um único fio, portanto, cada soquete pode ser mapeado para um fio que pode ser mapeado para um processo do servidor.

* `SOCKET_ID`

O identificador interno do arquivo atribuído ao socket.

* `IP`

O endereço IP do cliente. O valor pode ser um endereço IPv4 ou IPv6, ou pode ser em branco para indicar uma conexão com um arquivo de soquete Unix.

* `PORT`

O número do port TCP/IP, na faixa de 0 a 65535.

* `STATE`

O status do soquete, seja `IDLE` ou `ACTIVE`. Os tempos de espera para soquetes ativos são rastreados usando o instrumento de soquete correspondente. Os tempos de espera para soquetes ociosos são rastreados usando o instrumento `idle`.

Um soquete está inativo se estiver aguardando uma solicitação do cliente. Quando um soquete se torna inativo, a linha de evento em `socket_instances` que está monitorando o soquete muda de um estado de `ACTIVE` para `IDLE`. O valor de `EVENT_NAME` permanece `wait/io/socket/*`, mas o temporizador do instrumento é suspenso. Em vez disso, um evento é gerado na tabela `events_waits_current` com um valor de `EVENT_NAME` de `idle`.

Quando o próximo pedido for recebido, o evento `idle` é encerrado, a instância da porta de rede muda de `IDLE` para `ACTIVE`, e o cronometramento do instrumento da porta de rede é retomado.

A tabela `socket_instances` tem esses índices:

* Chave primária em (`OBJECT_INSTANCE_BEGIN`)
* Índice em (`THREAD_ID`)
* Índice em (`SOCKET_ID`)
* Índice em (`IP`, `PORT`)

`TRUNCATE TABLE` não é permitido para a tabela `socket_instances`.

O valor da combinação da coluna `IP:PORT` identifica a conexão. Esse valor de combinação é usado na coluna `OBJECT_NAME` das tabelas `events_waits_xxx`, para identificar a conexão de onde vêm os eventos de soquete:

* Para o socket de escuta de domínio Unix (`server_unix_socket`), a porta é 0 e o IP é `''`.

* Para conexões de clientes via o ouvinte de domínio Unix (`client_connection`), a porta é 0 e o IP é `''`.

* Para o socket do servidor de escuta TCP/IP (`server_tcpip_socket`), a porta é sempre a porta mestre (por exemplo, 3306), e o IP é sempre `0.0.0.0`.

* Para conexões de clientes via o ouvinte TCP/IP (`client_connection`), a porta é a que o servidor atribui, mas nunca 0. O IP é o IP do host de origem (`127.0.0.1` ou `::1` para o host local)

### 29.12.4 Tabelas de Eventos de Aguarda do Schema de Desempenho

Os instrumentos de esquema de desempenho que aguardam, que são eventos que levam tempo. Na hierarquia de eventos, os eventos de espera estão dentro dos eventos de estágio, que estão dentro dos eventos de declaração, que estão dentro dos eventos de transação.

Esses quadros armazenam eventos de espera:

* `events_waits_current`: O evento atual de espera para cada thread.

* `events_waits_history`: Os eventos de espera mais recentes que terminaram por fio.

* `events_waits_history_long`: Os eventos de espera mais recentes que terminaram globalmente (em todas as threads).

As seções a seguir descrevem as tabelas de eventos de espera. Há também tabelas resumidas que agregam informações sobre eventos de espera; veja a Seção 29.12.20.1, “Tabelas Resumo de Eventos de Espera”.

Para mais informações sobre a relação entre as três tabelas de eventos de espera, consulte a Seção 29.9, “Tabelas do Schema de Desempenho para Eventos Atuais e Históricos”.

#### Configurando a Coleta de Eventos de Aguardar

Para controlar se os eventos de espera devem ser coletados, defina o estado dos instrumentos e dos consumidores relevantes:

* A tabela `setup_instruments` contém instrumentos com nomes que começam com `wait`. Use esses instrumentos para habilitar ou desabilitar a coleta de classes individuais de eventos de espera.

* A tabela `setup_consumers` contém valores de consumidor com nomes correspondentes aos nomes atuais e históricos das tabelas de eventos de espera. Use esses consumidores para filtrar a coleção de eventos de espera.

Alguns instrumentos de espera são habilitados por padrão; outros são desabilitados. Por exemplo:

```
mysql> SELECT NAME, ENABLED, TIMED
       FROM performance_schema.setup_instruments
       WHERE NAME LIKE 'wait/io/file/innodb%';
+-------------------------------------------------+---------+-------+
| NAME                                            | ENABLED | TIMED |
+-------------------------------------------------+---------+-------+
| wait/io/file/innodb/innodb_tablespace_open_file | YES     | YES   |
| wait/io/file/innodb/innodb_data_file            | YES     | YES   |
| wait/io/file/innodb/innodb_log_file             | YES     | YES   |
| wait/io/file/innodb/innodb_temp_file            | YES     | YES   |
| wait/io/file/innodb/innodb_arch_file            | YES     | YES   |
| wait/io/file/innodb/innodb_clone_file           | YES     | YES   |
+-------------------------------------------------+---------+-------+
mysql> SELECT NAME, ENABLED, TIMED
       FROM performance_schema.setup_instruments
       WHERE NAME LIKE 'wait/io/socket/%';
+----------------------------------------+---------+-------+
| NAME                                   | ENABLED | TIMED |
+----------------------------------------+---------+-------+
| wait/io/socket/sql/server_tcpip_socket | NO      | NO    |
| wait/io/socket/sql/server_unix_socket  | NO      | NO    |
| wait/io/socket/sql/client_connection   | NO      | NO    |
+----------------------------------------+---------+-------+
```

A espera dos consumidores é desabilitada por padrão:

```
mysql> SELECT *
       FROM performance_schema.setup_consumers
       WHERE NAME LIKE 'events_waits%';
+---------------------------+---------+
| NAME                      | ENABLED |
+---------------------------+---------+
| events_waits_current      | NO      |
| events_waits_history      | NO      |
| events_waits_history_long | NO      |
+---------------------------+---------+
```

Para controlar a coleta de eventos de espera na inicialização do servidor, use linhas como essas em seu arquivo `my.cnf`:

* Habilitar:

  ```
  [mysqld]
  performance-schema-instrument='wait/%=ON'
  performance-schema-consumer-events-waits-current=ON
  performance-schema-consumer-events-waits-history=ON
  performance-schema-consumer-events-waits-history-long=ON
  ```

* Desativar:

  ```
  [mysqld]
  performance-schema-instrument='wait/%=OFF'
  performance-schema-consumer-events-waits-current=OFF
  performance-schema-consumer-events-waits-history=OFF
  performance-schema-consumer-events-waits-history-long=OFF
  ```

Para controlar a coleta de eventos de espera no tempo de execução, atualize as tabelas `setup_instruments` e `setup_consumers`:

* Habilitar:

  ```
  UPDATE performance_schema.setup_instruments
  SET ENABLED = 'YES', TIMED = 'YES'
  WHERE NAME LIKE 'wait/%';

  UPDATE performance_schema.setup_consumers
  SET ENABLED = 'YES'
  WHERE NAME LIKE 'events_waits%';
  ```

* Desativar:

  ```
  UPDATE performance_schema.setup_instruments
  SET ENABLED = 'NO', TIMED = 'NO'
  WHERE NAME LIKE 'wait/%';

  UPDATE performance_schema.setup_consumers
  SET ENABLED = 'NO'
  WHERE NAME LIKE 'events_waits%';
  ```

Para coletar apenas eventos de espera específicos, habilite apenas os instrumentos de espera correspondentes. Para coletar eventos de espera apenas para tabelas específicas de eventos de espera, habilite os instrumentos de espera, mas apenas os consumidores de espera correspondentes às tabelas desejadas.

Para obter informações adicionais sobre a configuração da coleta de eventos, consulte a Seção 29.3, “Configuração de inicialização do Schema de desempenho”, e a Seção 29.4, “Configuração de execução do Schema de desempenho”.

#### 29.12.4.1 A tabela events_waits_current

A tabela `events_waits_current` contém eventos de espera atuais. A tabela armazena uma linha por thread, mostrando o status atual do evento de espera mais recente monitorado da thread, portanto, não há uma variável do sistema para configurar o tamanho da tabela.

Dos quadros que contêm linhas de eventos de espera, `events_waits_current` é o mais fundamental. Outras tabelas que contêm linhas de eventos de espera são derivadas logicamente dos eventos atuais. Por exemplo, as tabelas `events_waits_history` e `events_waits_history_long` são coleções dos eventos de espera mais recentes que terminaram, até um número máximo de linhas por fio e globalmente em todos os fios, respectivamente.

Para mais informações sobre a relação entre as três tabelas de eventos de espera, consulte a Seção 29.9, “Tabelas do Schema de Desempenho para Eventos Atuais e Históricos”.

Para obter informações sobre a configuração de se os eventos de espera devem ser coletados, consulte a Seção 29.12.4, “Tabelas de Eventos de Espera do Schema de Desempenho”.

A tabela `events_waits_current` tem essas colunas:

* `THREAD_ID`, `EVENT_ID`

O fio associado ao evento e o número do evento atual do fio quando o evento começa. Os valores `THREAD_ID` e `EVENT_ID` tomados juntos identificam de forma única a linha. Nenhuma linha tem o mesmo par de valores.

* `END_EVENT_ID`

Essa coluna é definida como `NULL` quando o evento começa e atualizada para o número atual do evento do tópico quando o evento termina.

* `EVENT_NAME`

O nome do instrumento que produziu o evento. Este é um valor `NAME` da tabela `setup_instruments`. Os nomes dos instrumentos podem ter várias partes e formar uma hierarquia, conforme discutido na Seção 29.6, “Convenções de Nomenclatura de Instrumentos do Schema de Desempenho”.

* `SOURCE`

O nome do arquivo de origem que contém o código instrumentado que produziu o evento e o número da linha no arquivo em que a instrumentação ocorre. Isso permite que você verifique a fonte para determinar exatamente qual código está envolvido. Por exemplo, se um mutex ou bloqueio está sendo bloqueado, você pode verificar o contexto em que isso ocorre.

* `TIMER_START`, `TIMER_END`, `TIMER_WAIT`

Informações de cronometragem para o evento. A unidade desses valores é picosegundo (trilhão de um segundo). Os valores `TIMER_START` e `TIMER_END` indicam quando o cronometramento do evento começou e terminou. `TIMER_WAIT` é o tempo decorrido do evento (duração).

Se um evento não tiver terminado, `TIMER_END` é o valor atual do temporizador e `TIMER_WAIT` é o tempo que já passou (`TIMER_END` − `TIMER_START`).

Se um evento for produzido a partir de um instrumento que tem `TIMED = NO`, as informações de cronometragem não são coletadas, e `TIMER_START`, `TIMER_END` e `TIMER_WAIT` são todos `NULL`.

Para discussão sobre picossegundos como unidade para os tempos dos eventos e fatores que afetam os valores de tempo, consulte a Seção 29.4.1, “Tempo de Ocorrência do Schema de Desempenho”.

* `SPINS`

Para um mutex, o número de rodadas de rotação. Se o valor for `NULL`, o código não usa rodadas de rotação ou a rotação não é instrumentada.

* `OBJECT_SCHEMA`, `OBJECT_NAME`, `OBJECT_TYPE`, `OBJECT_INSTANCE_BEGIN`

Essas colunas identificam o objeto "sobre o qual está sendo realizada a ação". O que isso significa depende do tipo de objeto.

Para um objeto de sincronização (`cond`, `mutex`, `rwlock`):

+ `OBJECT_SCHEMA`, `OBJECT_NAME` e `OBJECT_TYPE` são `NULL`.

+ `OBJECT_INSTANCE_BEGIN` é o endereço do objeto de sincronização na memória.

Para um objeto de E/S de arquivo:

+ `OBJECT_SCHEMA` é `NULL`.

+ `OBJECT_NAME` é o nome do arquivo.
  + `OBJECT_TYPE` é `FILE`.

+ `OBJECT_INSTANCE_BEGIN` é um endereço de memória.

Para um objeto socket:

+ `OBJECT_NAME` é o valor `IP:PORT` para o soquete.

+ `OBJECT_INSTANCE_BEGIN` é um endereço de memória.

Para um objeto de I/O de tabela:

+ `OBJECT_SCHEMA` é o nome do esquema que contém a tabela.

+ `OBJECT_NAME` é o nome da tabela.  
  + `OBJECT_TYPE` é `TABLE` para uma tabela de base persistente ou `TEMPORARY TABLE` para uma tabela temporária.

+ `OBJECT_INSTANCE_BEGIN` é um endereço de memória.

Um valor de `OBJECT_INSTANCE_BEGIN` em si não tem significado, exceto que diferentes valores indicam diferentes objetos. `OBJECT_INSTANCE_BEGIN` pode ser usado para depuração. Por exemplo, pode ser usado com `GROUP BY OBJECT_INSTANCE_BEGIN` para verificar se a carga em 1.000 mutexes (que protegem, por exemplo, 1.000 páginas ou blocos de dados) é distribuída uniformemente ou apenas atingindo alguns gargalos. Isso pode ajudá-lo a correlacionar com outras fontes de informações se você ver o mesmo endereço de objeto em um arquivo de registro ou em outra ferramenta de depuração ou de desempenho.

* `INDEX_NAME`

O nome do índice utilizado. `PRIMARY` indica o índice primário da tabela. `NULL` significa que não foi utilizado nenhum índice.

* `NESTING_EVENT_ID`

O valor `EVENT_ID` do evento no qual este evento está aninhado.

* `NESTING_EVENT_TYPE`

O tipo de evento de nidificação. O valor é `TRANSACTION`, `STATEMENT`, `STAGE` ou `WAIT`.

* `OPERATION`

O tipo de operação realizada, como `lock`, `read` ou `write`.

* `NUMBER_OF_BYTES`

O número de bytes lidos ou escritos pela operação. Para espera de I/O de tabela (eventos para o instrumento `wait/io/table/sql/handler`), `NUMBER_OF_BYTES` indica o número de linhas. Se o valor for maior que 1, o evento é para uma operação de I/O em lote. A discussão a seguir descreve a diferença entre o relatório exclusivamente de uma única linha e o relatório que reflete o I/O em lote.

O MySQL executa junções usando uma implementação de loop aninhado. O trabalho da instrumentação do Schema de Desempenho é fornecer o número de linhas e o tempo de execução acumulado por tabela na junção. Suponha uma consulta de junção da seguinte forma que é executada usando uma ordem de junção de tabela de `t1`, `t2`, `t3`:

  ```
  SELECT ... FROM t1 JOIN t2 ON ... JOIN t3 ON ...
  ```

A tabela “fanout” é o aumento ou diminuição no número de linhas ao adicionar uma tabela durante o processamento de junção. Se o fanout da tabela `t3` for maior que 1, a maioria das operações de obtenção de linhas é para essa tabela. Suponha que a junção acesse 10 linhas de `t1`, 20 linhas de `t2` por linha de `t1`, e 30 linhas de `t3` por linha da tabela `t2`. Com relatórios de uma única linha, o número total de operações instrumentadas é:

  ```
  10 + (10 * 20) + (10 * 20 * 30) = 6210
  ```

Uma redução significativa no número de operações instrumentadas pode ser alcançada agregando-as por varredura (ou seja, por combinação única de linhas de `t1` e `t2`). Com o relatório de I/O em lote, o Schema de Desempenho produz um evento para cada varredura da tabela mais interna `t3`, em vez de para cada linha, e o número de operações de linha instrumentadas é reduzido para:

  ```
  10 + (10 * 20) + (10 * 20) = 410
  ```

Isso é uma redução de 93%, ilustrando como a estratégia de relatórios por lote reduz significativamente o overhead do Schema de Desempenho para o I/O de tabelas, reduzindo o número de chamadas de relatório. O contraponto é uma menor precisão para o tempo de eventos. Em vez de tempo para uma operação individual de linha, como no relatório por linha, o tempo para I/O por lote inclui o tempo gasto em operações como buffer de junção, agregação e retorno de linhas ao cliente.

Para que o relatório de I/O em lote ocorra, essas condições devem ser verdadeiras:

+ A execução da consulta acessa a tabela mais interna de um bloco de consulta (para uma consulta de uma única tabela, essa tabela é considerada a mais interna)

+ A execução da consulta não solicita uma única linha da tabela (por exemplo, o acesso a `eq_ref` impede o uso de relatórios em lote)

+ A execução da consulta não avalia uma subconsulta que contém acesso a tabela para a tabela

* `FLAGS`

Reservado para uso futuro.

A tabela `events_waits_current` tem esses índices:

* Chave primária em (`THREAD_ID`, `EVENT_ID`)

`TRUNCATE TABLE` é permitido para a tabela `events_waits_current`. Ele remove as linhas.

#### 29.12.4.2 A tabela events_waits_history

A tabela `events_waits_history` contém os eventos de espera *`N`* mais recentes que terminaram por fio. Os eventos de espera não são adicionados à tabela até que tenham terminado. Quando a tabela contém o número máximo de linhas para um determinado fio, a linha mais antiga do fio é descartada quando uma nova linha para esse fio é adicionada. Quando um fio termina, todas as suas linhas são descartadas.

O Schema de Desempenho autodimensiona o valor de *`N`* durante o arranque do servidor. Para definir explicitamente o número de linhas por fio, defina a variável de sistema `performance_schema_events_waits_history_size` durante o arranque do servidor.

A tabela `events_waits_history` tem as mesmas colunas e indexação que a tabela `events_waits_current`. Veja a Seção 29.12.4.1, “A tabela events_waits_current”.

`TRUNCATE TABLE` é permitido para a tabela `events_waits_history`. Ele remove as linhas.

Para mais informações sobre a relação entre as três tabelas de eventos de espera, consulte a Seção 29.9, “Tabelas do Schema de Desempenho para Eventos Atuais e Históricos”.

Para obter informações sobre a configuração de se os eventos de espera devem ser coletados, consulte a Seção 29.12.4, “Tabelas de Eventos de Espera do Schema de Desempenho”.

#### 29.12.4.3 A tabela events_waits_history_long

A tabela `events_waits_history_long` contém *`N`* os eventos de espera mais recentes que terminaram globalmente, em todas as threads. Os eventos de espera não são adicionados à tabela até que tenham terminado. Quando a tabela se torna cheia, a linha mais antiga é descartada quando uma nova linha é adicionada, independentemente de qual thread gerou a linha.

O Schema de Desempenho autodimensiona o valor de *`N`* durante o arranque do servidor. Para definir explicitamente o tamanho da tabela, defina a variável de sistema `performance_schema_events_waits_history_long_size` durante o arranque do servidor.

A tabela `events_waits_history_long` tem as mesmas colunas que a tabela `events_waits_current`. Veja a Seção 29.12.4.1, “A tabela events_waits_current”. Ao contrário de `events_waits_current`, a tabela `events_waits_history_long` não tem indexação.

`TRUNCATE TABLE` é permitido para a tabela `events_waits_history_long`. Ele remove as linhas.

Para mais informações sobre a relação entre as três tabelas de eventos de espera, consulte a Seção 29.9, “Tabelas do Schema de Desempenho para Eventos Atuais e Históricos”.

Para obter informações sobre a configuração de se os eventos de espera devem ser coletados, consulte a Seção 29.12.4, “Tabelas de Eventos de Espera do Schema de Desempenho”.

### 29.12.5 Tabelas de eventos de estágio do Schema de desempenho

Os instrumentos do esquema de desempenho representam etapas, que são os passos durante o processo de execução de uma declaração, como a análise de uma declaração, a abertura de uma tabela ou a realização de uma operação `filesort`. As etapas correspondem aos estados de thread exibidos pelo `SHOW PROCESSLIST` ou que são visíveis na tabela do esquema de informações `PROCESSLIST`. As etapas começam e terminam quando os valores dos estados mudam.

Na hierarquia de eventos, os eventos de espera estão dentro dos eventos de estágio, que estão dentro dos eventos de declaração, que estão dentro dos eventos de transação.

Essas tabelas armazenam eventos de estágio:

* `events_stages_current`: O evento atual de estágio para cada fio.

* `events_stages_history`: Os eventos mais recentes que terminaram por fio.

* `events_stages_history_long`: Os eventos mais recentes que terminaram globalmente (em todas as threads).

As seções a seguir descrevem as tabelas de eventos de palco. Há também tabelas resumidas que agregam informações sobre eventos de palco; veja Seção 29.12.20.2, “Tabelas Resumo de Palco”.

Para mais informações sobre a relação entre as três tabelas de eventos em etapas, consulte a Seção 29.9, “Tabelas do Schema de Desempenho para Eventos Atuais e Históricos”.

* Configuração da coleta de eventos de palco * Informações sobre o progresso do evento de palco

#### Configurando a Coleta de Eventos de Estágio

Para controlar se os eventos de estágio devem ser coletados, defina o estado dos instrumentos e dos consumidores relevantes:

* A tabela `setup_instruments` contém instrumentos com nomes que começam com `stage`. Use esses instrumentos para habilitar ou desabilitar a coleta de classes de eventos de estágio individual.

* A tabela `setup_consumers` contém valores de consumidor com nomes correspondentes aos nomes dos eventos da tabela de estágios atuais e históricos. Use esses consumidores para filtrar a coleção de eventos de estágio.

Exceto para os instrumentos que fornecem informações sobre o progresso da declaração, os instrumentos do palco são desabilitados por padrão. Por exemplo:

```
mysql> SELECT NAME, ENABLED, TIMED
       FROM performance_schema.setup_instruments
       WHERE NAME RLIKE 'stage/sql/[a-c]';
+----------------------------------------------------+---------+-------+
| NAME                                               | ENABLED | TIMED |
+----------------------------------------------------+---------+-------+
| stage/sql/After create                             | NO      | NO    |
| stage/sql/allocating local table                   | NO      | NO    |
| stage/sql/altering table                           | NO      | NO    |
| stage/sql/committing alter table to storage engine | NO      | NO    |
| stage/sql/Changing master                          | NO      | NO    |
| stage/sql/Checking master version                  | NO      | NO    |
| stage/sql/checking permissions                     | NO      | NO    |
| stage/sql/cleaning up                              | NO      | NO    |
| stage/sql/closing tables                           | NO      | NO    |
| stage/sql/Connecting to master                     | NO      | NO    |
| stage/sql/converting HEAP to MyISAM                | NO      | NO    |
| stage/sql/Copying to group table                   | NO      | NO    |
| stage/sql/Copying to tmp table                     | NO      | NO    |
| stage/sql/copy to tmp table                        | NO      | NO    |
| stage/sql/Creating sort index                      | NO      | NO    |
| stage/sql/creating table                           | NO      | NO    |
| stage/sql/Creating tmp table                       | NO      | NO    |
+----------------------------------------------------+---------+-------+
```

Os instrumentos de eventos em palco que fornecem informações sobre o progresso da declaração são habilitados e temporizados por padrão:

```
mysql> SELECT NAME, ENABLED, TIMED
       FROM performance_schema.setup_instruments
       WHERE ENABLED='YES' AND NAME LIKE "stage/%";
+------------------------------------------------------+---------+-------+
| NAME                                                 | ENABLED | TIMED |
+------------------------------------------------------+---------+-------+
| stage/sql/copy to tmp table                          | YES     | YES   |
| stage/sql/Applying batch of row changes (write)      | YES     | YES   |
| stage/sql/Applying batch of row changes (update)     | YES     | YES   |
| stage/sql/Applying batch of row changes (delete)     | YES     | YES   |
| stage/innodb/alter table (end)                       | YES     | YES   |
| stage/innodb/alter table (flush)                     | YES     | YES   |
| stage/innodb/alter table (insert)                    | YES     | YES   |
| stage/innodb/alter table (log apply index)           | YES     | YES   |
| stage/innodb/alter table (log apply table)           | YES     | YES   |
| stage/innodb/alter table (merge sort)                | YES     | YES   |
| stage/innodb/alter table (read PK and internal sort) | YES     | YES   |
| stage/innodb/buffer pool load                        | YES     | YES   |
| stage/innodb/clone (file copy)                       | YES     | YES   |
| stage/innodb/clone (redo copy)                       | YES     | YES   |
| stage/innodb/clone (page copy)                       | YES     | YES   |
+------------------------------------------------------+---------+-------+
```

Os consumidores em andamento são desabilitados por padrão:

```
mysql> SELECT *
       FROM performance_schema.setup_consumers
       WHERE NAME LIKE 'events_stages%';
+----------------------------+---------+
| NAME                       | ENABLED |
+----------------------------+---------+
| events_stages_current      | NO      |
| events_stages_history      | NO      |
| events_stages_history_long | NO      |
+----------------------------+---------+
```

Para controlar a coleta de eventos de estágio no início da inicialização do servidor, use linhas como essas em seu arquivo `my.cnf`:

* Habilitar:

  ```
  [mysqld]
  performance-schema-instrument='stage/%=ON'
  performance-schema-consumer-events-stages-current=ON
  performance-schema-consumer-events-stages-history=ON
  performance-schema-consumer-events-stages-history-long=ON
  ```

* Desativar:

  ```
  [mysqld]
  performance-schema-instrument='stage/%=OFF'
  performance-schema-consumer-events-stages-current=OFF
  performance-schema-consumer-events-stages-history=OFF
  performance-schema-consumer-events-stages-history-long=OFF
  ```

Para controlar a coleta de eventos de estágio em tempo de execução, atualize as tabelas `setup_instruments` e `setup_consumers`:

* Habilitar:

  ```
  UPDATE performance_schema.setup_instruments
  SET ENABLED = 'YES', TIMED = 'YES'
  WHERE NAME LIKE 'stage/%';

  UPDATE performance_schema.setup_consumers
  SET ENABLED = 'YES'
  WHERE NAME LIKE 'events_stages%';
  ```

* Desativar:

  ```
  UPDATE performance_schema.setup_instruments
  SET ENABLED = 'NO', TIMED = 'NO'
  WHERE NAME LIKE 'stage/%';

  UPDATE performance_schema.setup_consumers
  SET ENABLED = 'NO'
  WHERE NAME LIKE 'events_stages%';
  ```

Para coletar apenas eventos específicos de palco, habilite apenas os instrumentos de palco correspondentes. Para coletar eventos de palco apenas para tabelas específicas de eventos de palco, habilite os instrumentos de palco, mas apenas os consumidores de palco correspondentes às tabelas desejadas.

Para obter informações adicionais sobre a configuração da coleta de eventos, consulte a Seção 29.3, “Configuração de inicialização do Schema de desempenho”, e a Seção 29.4, “Configuração de execução do Schema de desempenho”.

#### Informações sobre o progresso do evento de estágio

As tabelas de eventos de etapa do Schema de desempenho contêm duas colunas que, juntas, fornecem um indicador de progresso de etapa para cada linha:

* `WORK_COMPLETED`: Número de unidades de trabalho concluídas para a etapa

* `WORK_ESTIMATED`: O número de unidades de trabalho esperado para a etapa

Cada coluna é `NULL` se nenhuma informação sobre progresso for fornecida para um instrumento. A interpretação da informação, se estiver disponível, depende inteiramente da implementação do instrumento. As tabelas do Schema de Desempenho fornecem um recipiente para armazenar dados de progresso, mas não fazem suposições sobre a semântica da própria métrica:

* Uma "unidade de trabalho" é uma métrica inteira que aumenta ao longo do tempo durante a execução, como o número de bytes, linhas, arquivos ou tabelas processadas. A definição de "unidade de trabalho" para um instrumento específico é deixada para o código de instrumentação que fornece os dados.

* O valor `WORK_COMPLETED` pode aumentar uma ou várias unidades de cada vez, dependendo do código instrumentado.

* O valor `WORK_ESTIMATED` pode mudar durante a etapa, dependendo do código instrumentado.

O instrumentação para um indicador de progresso de evento de palco pode implementar qualquer um dos seguintes comportamentos:

* Sem instrumentação de progresso

Este é o caso mais típico, onde não são fornecidos dados de progresso. As colunas `WORK_COMPLETED` e `WORK_ESTIMATED` são ambas `NULL`.

* Instrumentação de progresso ilimitado

Apenas a coluna `WORK_COMPLETED` é significativa. Não há dados fornecidos para a coluna `WORK_ESTIMATED`, que exibe 0.

Ao consultar a tabela `events_stages_current` para a sessão monitorada, um aplicativo de monitoramento pode relatar quanto trabalho foi realizado até o momento, mas não pode relatar se o estágio está próximo de ser concluído. Atualmente, nenhum estágio é instrumentado dessa forma.

* Instrumentação de progresso limitado

As colunas `WORK_COMPLETED` e `WORK_ESTIMATED` são ambas significativas.

Este tipo de indicador de progresso é apropriado para uma operação com um critério de conclusão definido, como o instrumento de cópia de tabela descrito mais adiante. Ao consultar a tabela `events_stages_current` para a sessão monitorada, um aplicativo de monitoramento pode relatar quanto trabalho já foi realizado até então e pode relatar a porcentagem geral de conclusão para a etapa, calculando a razão `WORK_COMPLETED` / `WORK_ESTIMATED`.

O instrumento `stage/sql/copy to tmp table` ilustra como os indicadores de progresso funcionam. Durante a execução de uma declaração `ALTER TABLE`, o estágio `stage/sql/copy to tmp table` é utilizado, e este estágio pode executar potencialmente por um longo tempo, dependendo do tamanho dos dados a serem copiados.

A tarefa de cópia de tabela tem uma finalização definida (todas as linhas copiadas), e a etapa `stage/sql/copy to tmp table` é instrumentada para fornecer informações de progresso limitado: A unidade de trabalho usada é o número de linhas copiadas, `WORK_COMPLETED` e `WORK_ESTIMATED` são ambos significativos, e sua proporção indica o percentual de tarefa concluída.

Para habilitar o instrumento e os consumidores relevantes, execute essas declarações:

```
UPDATE performance_schema.setup_instruments
SET ENABLED='YES'
WHERE NAME='stage/sql/copy to tmp table';

UPDATE performance_schema.setup_consumers
SET ENABLED='YES'
WHERE NAME LIKE 'events_stages_%';
```

Para ver o progresso de uma declaração em andamento `ALTER TABLE`(alter-table.html "15.1.9 ALTER TABLE Statement"), selecione a partir da tabela `events_stages_current`.

#### 29.12.5.1 A tabela events_stages_current

A tabela `events_stages_current` contém eventos de estágio atual. A tabela armazena uma linha por thread, mostrando o status atual do evento de estágio mais recente monitorado da thread, portanto, não há uma variável do sistema para configurar o tamanho da tabela.

Dos quadros que contêm linhas de eventos de estágio, `events_stages_current` é o mais fundamental. Outras tabelas que contêm linhas de eventos de estágio são derivadas logicamente dos eventos atuais. Por exemplo, as tabelas `events_stages_history` e `events_stages_history_long` são coleções dos eventos de estágio mais recentes que terminaram, até um número máximo de linhas por fio e globalmente em todos os fios, respectivamente.

Para mais informações sobre a relação entre as três tabelas de eventos em etapas, consulte a Seção 29.9, “Tabelas do Schema de Desempenho para Eventos Atuais e Históricos”.

Para obter informações sobre a configuração de se os eventos de estágio devem ser coletados, consulte a Seção 29.12.5, “Tabelas de Eventos de Estágio do Schema de Desempenho”.

A tabela `events_stages_current` tem essas colunas:

* `THREAD_ID`, `EVENT_ID`

O fio associado ao evento e o número do evento atual do fio quando o evento começa. Os valores `THREAD_ID` e `EVENT_ID`, quando tomados juntos, identificam de forma única a linha. Nenhuma linha tem o mesmo par de valores.

* `END_EVENT_ID`

Essa coluna é definida como `NULL` quando o evento começa e atualizada para o número atual do evento do thread quando o evento termina.

* `EVENT_NAME`

O nome do instrumento que produziu o evento. Este é um valor `NAME` da tabela `setup_instruments`. Os nomes dos instrumentos podem ter várias partes e formar uma hierarquia, conforme discutido na Seção 29.6, “Convenções de Nomenclatura de Instrumentos do Schema de Desempenho”.

* `SOURCE`

O nome do arquivo fonte que contém o código instrumentado que produziu o evento e o número da linha no arquivo onde a instrumentação ocorre. Isso permite que você verifique a fonte para determinar exatamente qual código está envolvido.

* `TIMER_START`, `TIMER_END`, `TIMER_WAIT`

Informações de temporização para o evento. A unidade desses valores é picosegundo (trilhões de um segundo). Os valores `TIMER_START` e `TIMER_END` indicam quando o temporizador do evento começou e terminou. `TIMER_WAIT` é o tempo decorrido do evento (duração).

Se um evento não tiver terminado, `TIMER_END` é o valor atual do temporizador e `TIMER_WAIT` é o tempo que já passou (`TIMER_END` − `TIMER_START`).

Se um evento for produzido a partir de um instrumento que tem `TIMED = NO`, as informações de cronometragem não são coletadas, e `TIMER_START`, `TIMER_END` e `TIMER_WAIT` são todos `NULL`.

Para discussão sobre picossegundos como unidade para os tempos dos eventos e fatores que afetam os valores de tempo, consulte a Seção 29.4.1, “Tempo de Ocorrência do Schema de Desempenho”.

* `WORK_COMPLETED`, `WORK_ESTIMATED`

Essas colunas fornecem informações sobre o progresso da etapa, para instrumentos que foram implementados para produzir essas informações. `WORK_COMPLETED` indica quantos trabalhos foram concluídos para a etapa, e `WORK_ESTIMATED` indica quantos trabalhos são esperados para a etapa. Para mais informações, consulte Informações sobre o progresso do evento da etapa.

* `NESTING_EVENT_ID`

O valor `EVENT_ID` do evento dentro do qual este evento está aninhado. O evento aninhado para um evento de estágio geralmente é um evento de declaração.

* `NESTING_EVENT_TYPE`

O tipo de evento de nidificação. O valor é `TRANSACTION`, `STATEMENT`, `STAGE` ou `WAIT`.

A tabela `events_stages_current` tem esses índices:

* Chave primária em (`THREAD_ID`, `EVENT_ID`)

`TRUNCATE TABLE` é permitido para a tabela `events_stages_current`. Ele remove as linhas.

#### 29.12.5.2 A tabela events_stages_history

A tabela `events_stages_history` contém os eventos de estágio mais recentes do *`N`* que terminaram por fio. Os eventos de estágio não são adicionados à tabela até que tenham terminado. Quando a tabela contém o número máximo de linhas para um determinado fio, a linha mais antiga do fio é descartada quando uma nova linha para esse fio é adicionada. Quando um fio termina, todas as suas linhas são descartadas.

O Schema de Desempenho autodimensiona o valor de *`N`* durante o arranque do servidor. Para definir explicitamente o número de linhas por fio, defina a variável de sistema `performance_schema_events_stages_history_size` durante o arranque do servidor.

A tabela `events_stages_history` tem as mesmas colunas e indexação que a tabela `events_stages_current`. Veja a Seção 29.12.5.1, “A tabela events_stages_current”.

`TRUNCATE TABLE` é permitido para a tabela `events_stages_history`. Ele remove as linhas.

Para mais informações sobre a relação entre as três tabelas de eventos em etapas, consulte a Seção 29.9, “Tabelas do Schema de Desempenho para Eventos Atuais e Históricos”.

Para obter informações sobre a configuração de se os eventos de estágio devem ser coletados, consulte a Seção 29.12.5, “Tabelas de Eventos de Estágio do Schema de Desempenho”.

#### 29.12.5.3 A tabela events_stages_history_long

A tabela `events_stages_history_long` contém os eventos de estágio mais recentes do *`N`* que terminaram globalmente, em todas as threads. Os eventos de estágio não são adicionados à tabela até que tenham terminado. Quando a tabela se torna cheia, a linha mais antiga é descartada quando uma nova linha é adicionada, independentemente de qual thread gerou essa linha.

O Schema de Desempenho autodimensiona o valor de *`N`* durante o arranque do servidor. Para definir explicitamente o tamanho da tabela, defina a variável de sistema `performance_schema_events_stages_history_long_size` durante o arranque do servidor.

A tabela `events_stages_history_long` tem as mesmas colunas que a tabela `events_stages_current`. Veja a Seção 29.12.5.1, “A tabela events_stages_current”. Ao contrário de `events_stages_current`, a tabela `events_stages_history_long` não tem indexação.

`TRUNCATE TABLE` é permitido para a tabela `events_stages_history_long`. Ele remove as linhas.

Para mais informações sobre a relação entre as três tabelas de eventos em etapas, consulte a Seção 29.9, “Tabelas do Schema de Desempenho para Eventos Atuais e Históricos”.

Para obter informações sobre a configuração de se os eventos de estágio devem ser coletados, consulte a Seção 29.12.5, “Tabelas de Eventos de Estágio do Schema de Desempenho”.

### 29.12.6 Tabelas de Eventos de Declaração do Schema de Desempenho

A declaração de execução dos instrumentos do Schema de Desempenho. Os eventos de declaração ocorrem em um alto nível da hierarquia de eventos. Dentro da hierarquia de eventos, os eventos de espera se encontram dentro dos eventos de estágio, que se encontram dentro dos eventos de declaração, que se encontram dentro dos eventos de transação.

Essas tabelas armazenam eventos de declaração:

* `events_statements_current`: O evento atual de declaração para cada fio.

* `events_statements_history`: Os eventos mais recentes que terminaram por fio.

* `events_statements_history_long`: Os eventos mais recentes que terminaram globalmente (em todas as threads).

* `prepared_statements_instances`: Instâncias de declaração preparada e estatísticas

As seções a seguir descrevem as tabelas de eventos de declaração. Há também tabelas resumidas que agregam informações sobre eventos de declaração; veja a Seção 29.12.20.3, “Tabelas Resumo de Declaração”.

Para mais informações sobre a relação entre as três tabelas de eventos `events_statements_xxx`, consulte a Seção 29.9, “Tabelas do Schema de Desempenho para Eventos Atuais e Históricos”.

* Configuração da coleta de eventos de declaração
* Monitoramento de declarações

#### Configurando a Coleta de Eventos de Declaração

Para controlar se deve coletar eventos de declaração, defina o estado dos instrumentos e dos consumidores relevantes:

* A tabela `setup_instruments` contém instrumentos com nomes que começam com `statement`. Use esses instrumentos para habilitar ou desabilitar a coleta de classes de eventos de declaração individual.

* A tabela `setup_consumers` contém valores de consumidor com nomes correspondentes aos nomes atuais e históricos das tabelas de eventos de declaração, e ao consumidor de digestão de declaração. Use esses consumidores para filtrar a coleção de eventos de declaração e a digestão de declaração.

Os instrumentos de declaração são habilitados por padrão, e os consumidores de declaração `events_statements_current`, `events_statements_history` e `statements_digest` são habilitados por padrão:

```
mysql> SELECT NAME, ENABLED, TIMED
       FROM performance_schema.setup_instruments
       WHERE NAME LIKE 'statement/%';
+---------------------------------------------+---------+-------+
| NAME                                        | ENABLED | TIMED |
+---------------------------------------------+---------+-------+
| statement/sql/select                        | YES     | YES   |
| statement/sql/create_table                  | YES     | YES   |
| statement/sql/create_index                  | YES     | YES   |
...
| statement/sp/stmt                           | YES     | YES   |
| statement/sp/set                            | YES     | YES   |
| statement/sp/set_trigger_field              | YES     | YES   |
| statement/scheduler/event                   | YES     | YES   |
| statement/com/Sleep                         | YES     | YES   |
| statement/com/Quit                          | YES     | YES   |
| statement/com/Init DB                       | YES     | YES   |
...
| statement/abstract/Query                    | YES     | YES   |
| statement/abstract/new_packet               | YES     | YES   |
| statement/abstract/relay_log                | YES     | YES   |
+---------------------------------------------+---------+-------+
```

```
mysql> SELECT *
       FROM performance_schema.setup_consumers
       WHERE NAME LIKE '%statements%';
+--------------------------------+---------+
| NAME                           | ENABLED |
+--------------------------------+---------+
| events_statements_current      | YES     |
| events_statements_history      | YES     |
| events_statements_history_long | NO      |
| statements_digest              | YES     |
+--------------------------------+---------+
```

Para controlar a coleta de eventos de declaração no início da inicialização do servidor, use linhas como essas em seu arquivo `my.cnf`:

* Habilitar:

  ```
  [mysqld]
  performance-schema-instrument='statement/%=ON'
  performance-schema-consumer-events-statements-current=ON
  performance-schema-consumer-events-statements-history=ON
  performance-schema-consumer-events-statements-history-long=ON
  performance-schema-consumer-statements-digest=ON
  ```

* Desativar:

  ```
  [mysqld]
  performance-schema-instrument='statement/%=OFF'
  performance-schema-consumer-events-statements-current=OFF
  performance-schema-consumer-events-statements-history=OFF
  performance-schema-consumer-events-statements-history-long=OFF
  performance-schema-consumer-statements-digest=OFF
  ```

Para controlar a coleta de eventos de declaração no tempo de execução, atualize as tabelas `setup_instruments` e `setup_consumers`:

* Habilitar:

  ```
  UPDATE performance_schema.setup_instruments
  SET ENABLED = 'YES', TIMED = 'YES'
  WHERE NAME LIKE 'statement/%';

  UPDATE performance_schema.setup_consumers
  SET ENABLED = 'YES'
  WHERE NAME LIKE '%statements%';
  ```

* Desativar:

  ```
  UPDATE performance_schema.setup_instruments
  SET ENABLED = 'NO', TIMED = 'NO'
  WHERE NAME LIKE 'statement/%';

  UPDATE performance_schema.setup_consumers
  SET ENABLED = 'NO'
  WHERE NAME LIKE '%statements%';
  ```

Para coletar apenas eventos de declaração específicos, habilite apenas os instrumentos de declaração correspondentes. Para coletar eventos de declaração apenas para tabelas específicas de eventos de declaração, habilite os instrumentos de declaração, mas apenas os consumidores de declaração correspondentes às tabelas desejadas.

Para obter informações adicionais sobre a configuração da coleta de eventos, consulte a Seção 29.3, “Configuração de inicialização do Schema de desempenho”, e a Seção 29.4, “Configuração de execução do Schema de desempenho”.

#### Monitoramento de declarações

O monitoramento das declarações começa no momento em que o servidor percebe que a atividade é solicitada em um fio, até o momento em que toda a atividade cessa. Normalmente, isso significa desde o momento em que o servidor recebe o primeiro pacote do cliente até o momento em que o servidor concluiu a transmissão da resposta. As declarações dentro dos programas armazenados são monitoradas como outras declarações.

Quando o Schema de Desempenho instrumenta uma solicitação (comando do servidor ou declaração SQL), ele utiliza nomes de instrumentos que progridem em etapas, de mais gerais (ou "abstratos") para mais específicos, até chegar a um nome de instrumento final.

Os nomes dos instrumentos finais correspondem a comandos do servidor e declarações SQL:

* Os comandos do servidor correspondem ao `COM_xxx codes` definido no arquivo de cabeçalho `mysql_com.h` e processado em `sql/sql_parse.cc`. Exemplos são `COM_PING` e `COM_QUIT`. Os instrumentos para comandos têm nomes que começam com `statement/com`, como `statement/com/Ping` e `statement/com/Quit`.

* As instruções SQL são expressas como texto, como `DELETE FROM t1` ou `SELECT * FROM t2`. Os instrumentos para instruções SQL têm nomes que começam com `statement/sql`, como `statement/sql/delete` e `statement/sql/select`.

Alguns nomes de instrumentos finais são específicos para o tratamento de erros:

* `statement/com/Error` lida com mensagens recebidas pelo servidor que estão fora da banda. Pode ser usado para detectar comandos enviados por clientes que o servidor não entende. Isso pode ser útil para fins como identificar clientes que estão mal configurados ou usando uma versão do MySQL mais recente do que a do servidor, ou clientes que estão tentando atacar o servidor.

* `statement/sql/error` contabiliza declarações SQL que não conseguem ser analisadas. Pode ser usado para detectar consultas malformadas enviadas por clientes. Uma consulta que não consegue ser analisada difere de uma consulta que é analisada, mas falha devido a um erro durante a execução. Por exemplo, `SELECT * FROM` é malformado, e o instrumento `statement/sql/error` é usado. Em contraste, `SELECT *` é analisado, mas falha com um erro `No tables used`. Neste caso, `statement/sql/select` é usado e o evento da declaração contém informações para indicar a natureza do erro.

Um pedido pode ser obtido em qualquer uma dessas fontes:

* Como um comando ou solicitação de declaração de um cliente, que envia a solicitação como pacotes

* Como uma string de declaração lida do log do relé em uma réplica
* Como um evento do Agendamento de Eventos

Os detalhes de um pedido não são conhecidos inicialmente e o Schema de Desempenho passa de nomes de instrumentos abstratos para específicos em uma sequência que depende da fonte do pedido.

Para um pedido recebido de um cliente:

1. Quando o servidor detecta um novo pacote no nível de soquete, uma nova declaração é iniciada com o nome de instrumento abstrato `statement/abstract/new_packet`.

2. Quando o servidor lê o número do pacote, ele sabe mais sobre o tipo de solicitação recebida, e o Schema de Desempenho refina o nome do instrumento. Por exemplo, se a solicitação for um pacote `COM_PING`, o nome do instrumento se torna `statement/com/Ping` e esse é o nome final. Se a solicitação for um pacote `COM_QUERY`, sabe-se que ela corresponde a uma declaração SQL, mas não ao tipo específico de declaração. Neste caso, o instrumento muda de um nome abstrato para um nome mais específico, mas ainda abstrato, `statement/abstract/Query`, e a solicitação requer uma classificação adicional.

3. Se o pedido for uma declaração, o texto da declaração é lido e dado ao analisador. Após a análise, o tipo exato da declaração é conhecido. Se o pedido, por exemplo, for uma declaração `INSERT`, o Schema de Desempenho refina o nome do instrumento de `statement/abstract/Query` para `statement/sql/insert`, que é o nome final.

Para uma solicitação lida como uma declaração do log de retransmissão em uma réplica:

1. As declarações no registro de retransmissão são armazenadas como texto e são lidas como tal. Não há protocolo de rede, portanto, o instrumento `statement/abstract/new_packet` não é utilizado. Em vez disso, o instrumento inicial é `statement/abstract/relay_log`.

2. Quando a declaração é analisada, o tipo exato da declaração é conhecido. Se o pedido, por exemplo, for uma declaração `INSERT`, o Schema de Desempenho refina o nome do instrumento de `statement/abstract/Query` para `statement/sql/insert`, que é o nome final.

A descrição anterior se aplica apenas à replicação baseada em declarações. Para a replicação baseada em linhas, o I/O de tabela realizado na replica enquanto processa alterações de linha pode ser instrumentado, mas os eventos de linha no log de relevo não aparecem como declarações discretas.

Para um pedido recebido do Agendamento de Eventos:

A execução do evento é instrumentada usando o nome `statement/scheduler/event`. Este é o nome final.

As declarações executadas dentro do corpo do evento são instrumentadas usando nomes `statement/sql/*`, sem o uso de qualquer instrumento abstrato anterior. Um evento é um programa armazenado, e os programas armazenados são pré-compilados na memória antes da execução. Consequentemente, não há análise em tempo real e o tipo de cada declaração é conhecido no momento em que ela é executada.

As declarações executadas dentro do corpo do evento são declarações filhas. Por exemplo, se um evento executa uma declaração `INSERT`, a execução do próprio evento é a mãe, instrumentada usando `statement/scheduler/event`, e o `INSERT` é a filha, instrumentada usando `statement/sql/insert`. A relação mãe/filha ocorre *entre* operações instrumentadas separadas. Isso difere da sequência de refinamento que ocorre *dentro* de uma única operação instrumentada, de nomes abstratos a nomes finais.

Para que as estatísticas sejam coletadas para declarações, não é suficiente habilitar apenas os instrumentos finais `statement/sql/*` usados para tipos de declaração individuais. Os instrumentos abstratos `statement/abstract/*` também devem ser habilitados. Isso normalmente não deve ser um problema, pois todos os instrumentos de declaração são habilitados por padrão. No entanto, uma aplicação que habilita ou desabilita seletivamente os instrumentos de declaração deve levar em conta que a desabilitação dos instrumentos abstratos também desabilita a coleta de estatísticas para os instrumentos de declaração individuais. Por exemplo, para coletar estatísticas para declarações `INSERT`, `statement/sql/insert` deve ser habilitado, mas também `statement/abstract/new_packet` e `statement/abstract/Query`. Da mesma forma, para que as declarações replicadas sejam instrumentadas, `statement/abstract/relay_log` deve ser habilitado.

Não são agregadas estatísticas para instrumentos abstratos, como `statement/abstract/Query`, porque nenhuma declaração é classificada com um instrumento abstrato como o nome final da declaração.

#### 29.12.6.1 A tabela events_statements_current

A tabela `events_statements_current` contém eventos de declaração atuais. A tabela armazena uma linha por thread, mostrando o status atual do evento de declaração mais recente monitorado pela thread, portanto, não há uma variável do sistema para configurar o tamanho da tabela.

Dos quadros que contêm linhas de eventos de declaração, `events_statements_current` é o mais fundamental. Outros quadros que contêm linhas de eventos de declaração são derivados logicamente dos eventos atuais. Por exemplo, os quadros `events_statements_history` e `events_statements_history_long` são coleções dos eventos de declaração mais recentes que terminaram, até um número máximo de linhas por fio e globalmente em todos os fios, respectivamente.

Para mais informações sobre a relação entre as três tabelas de eventos `events_statements_xxx`, consulte a Seção 29.9, “Tabelas do Schema de Desempenho para Eventos Atuais e Históricos”.

Para obter informações sobre a configuração de coleta de eventos de declaração, consulte a Seção 29.12.6, “Tabelas de Eventos de Declaração do Schema de Desempenho”.

A tabela `events_statements_current` tem essas colunas:

* `THREAD_ID`, `EVENT_ID`

O fio associado ao evento e o número do evento atual do fio quando o evento começa. Os valores `THREAD_ID` e `EVENT_ID` tomados juntos identificam de forma única a linha. Nenhuma linha tem o mesmo par de valores.

* `END_EVENT_ID`

Essa coluna é definida como `NULL` quando o evento começa e atualizada para o número atual do evento do thread quando o evento termina.

* `EVENT_NAME`

O nome do instrumento do qual o evento foi coletado. Este é um valor `NAME` da tabela `setup_instruments`. Os nomes dos instrumentos podem ter várias partes e formar uma hierarquia, conforme discutido na Seção 29.6, “Convenções de Nomenclatura de Instrumentos do Schema de Desempenho”.

Para as instruções SQL, o valor `EVENT_NAME` é inicialmente `statement/com/Query` até que a instrução seja analisada, e, em seguida, muda para um valor mais apropriado, conforme descrito na Seção 29.12.6, “Tabelas de Eventos de Instrução do Schema de Desempenho”.

* `SOURCE`

O nome do arquivo fonte que contém o código instrumentado que produziu o evento e o número da linha no arquivo onde a instrumentação ocorre. Isso permite que você verifique a fonte para determinar exatamente qual código está envolvido.

* `TIMER_START`, `TIMER_END`, `TIMER_WAIT`

Informações de cronometragem para o evento. A unidade desses valores é picosegundo (trilhão de um segundo). Os valores `TIMER_START` e `TIMER_END` indicam quando o cronometramento do evento começou e terminou. `TIMER_WAIT` é o tempo decorrido do evento (duração).

Se um evento ainda não tiver terminado, `TIMER_END` é o valor atual do temporizador e `TIMER_WAIT` é o tempo que já passou (`TIMER_END` − `TIMER_START`).

Se um evento for produzido a partir de um instrumento que tem `TIMED = NO`, as informações de temporização não são coletadas, e `TIMER_START`, `TIMER_END` e `TIMER_WAIT` são todos `NULL`.

Para discussão sobre picossegundos como unidade para os tempos dos eventos e fatores que afetam os valores de tempo, consulte a Seção 29.4.1, “Tempo de Ocorrência do Schema de Desempenho”.

* `LOCK_TIME`

O tempo gasto esperando por bloqueios de tabela. Esse valor é calculado em microsegundos, mas normalizado em picosegundos para facilitar a comparação com outros temporizadores do Schema de Desempenho.

* `SQL_TEXT`

O texto da declaração SQL. Para um comando não associado a uma declaração SQL, o valor é `NULL`.

O espaço máximo disponível para exibição de declaração é de 1024 bytes por padrão. Para alterar esse valor, defina a variável de sistema `performance_schema_max_sql_text_length` na inicialização do servidor. (Alterar esse valor afeta as colunas em outras tabelas do Schema de Desempenho. Veja Seção 29.10, “Digestas e Amostragem de Declarações do Schema de Desempenho”).

* `DIGEST`

O valor do digest SHA-256 é apresentado como uma cadeia de 64 caracteres hexadecimais, ou `NULL` se o consumidor `statements_digest` for `no`. Para mais informações sobre o digest de declaração, consulte a Seção 29.10, “Digests e Amostragem de Declarações do Schema de Desempenho”.

* `DIGEST_TEXT`

O texto normalizado do digest do relatório, ou `NULL` se o consumidor `statements_digest` for `no`. Para mais informações sobre o digest do relatório, consulte a Seção 29.10, “Digests e Amostragem de Declarações do Schema de Desempenho”.

A variável de sistema `performance_schema_max_digest_length` determina o número máximo de bytes disponíveis por sessão para armazenamento do valor do digest. No entanto, o comprimento de exibição dos digests dos eventos de declaração pode ser mais longo que o tamanho do buffer disponível devido à codificação dos elementos da declaração, como palavras-chave e valores literais, no buffer do digest. Consequentemente, os valores selecionados da coluna `DIGEST_TEXT` das tabelas de eventos de declaração podem parecer exceder o valor do `performance_schema_max_digest_length`.

* `CURRENT_SCHEMA`

O banco de dados padrão para a declaração, `NULL` se não houver nenhum.

* `OBJECT_SCHEMA`, `OBJECT_NAME`, `OBJECT_TYPE`

Para declarações aninhadas (programas armazenados), essas colunas contêm informações sobre a declaração pai. Caso contrário, são `NULL`.

* `OBJECT_INSTANCE_BEGIN`

Esta coluna identifica a declaração. O valor é o endereço de um objeto na memória.

* `MYSQL_ERRNO`

O número do erro de declaração, da área de diagnóstico de declaração.

* `RETURNED_SQLSTATE`

O valor SQLSTATE da declaração, da área de diagnóstico da declaração.

* `MESSAGE_TEXT`

Mensagem de erro de declaração, da área de diagnóstico de declaração.

* `ERRORS`

Se ocorreu um erro para a declaração. O valor é 0 se o valor SQLSTATE começa com `00` (completar) ou `01` (aviso). O valor é 1 se o valor SQLSTATE for qualquer outra coisa.

* `WARNINGS`

O número de avisos, da área de diagnóstico de declaração.

* `ROWS_AFFECTED`

O número de linhas afetadas pela declaração. Para uma descrição do significado de "afetada", consulte mysql_affected_rows().

* `ROWS_SENT`

O número de linhas devolvidas pelo comando.

* `ROWS_EXAMINED`

O número de linhas examinadas pela camada de servidor (não contando qualquer processamento interno dos motores de armazenamento).

* `CREATED_TMP_DISK_TABLES`

Como a variável de status `Created_tmp_disk_tables`, mas específica para a declaração.

* `CREATED_TMP_TABLES`

Como a variável de status `Created_tmp_tables`, mas específica para a declaração.

* `SELECT_FULL_JOIN`

Como a variável de status `Select_full_join`, mas específica para a declaração.

* `SELECT_FULL_RANGE_JOIN`

Como a variável de status `Select_full_range_join`, mas específica para a declaração.

* `SELECT_RANGE`

Como a variável de status `Select_range`, mas específica para a declaração.

* `SELECT_RANGE_CHECK`

Como a variável de status `Select_range_check`, mas específica para a declaração.

* `SELECT_SCAN`

Como a variável de status `Select_scan`, mas específica para a declaração.

* `SORT_MERGE_PASSES`

Como a variável de status `Sort_merge_passes`, mas específica para a declaração.

* `SORT_RANGE`

Como a variável de status `Sort_range`, mas específica para a declaração.

* `SORT_ROWS`

Como a variável de status `Sort_rows`, mas específica para a declaração.

* `SORT_SCAN`

Como a variável de status `Sort_scan`, mas específica para a declaração.

* `NO_INDEX_USED`

1 se a declaração realizar uma varredura de tabela sem usar um índice, 0 caso contrário.

* `NO_GOOD_INDEX_USED`

1 se o servidor não encontrou um bom índice para usar para a declaração, 0 caso contrário. Para informações adicionais, consulte a descrição da coluna `Extra` do `EXPLAIN` de saída para o valor `Range checked for each record` na Seção 10.8.2, “Formato de Saída EXPLAIN”.

* `NESTING_EVENT_ID`, `NESTING_EVENT_TYPE`, `NESTING_EVENT_LEVEL`

Essas três colunas são usadas com outras colunas para fornecer informações conforme segue para declarações de nível superior (não aninhadas) e declarações aninhadas (executadas dentro de um programa armazenado).

Para declarações de nível superior:

  ```
  OBJECT_TYPE = NULL
  OBJECT_SCHEMA = NULL
  OBJECT_NAME = NULL
  NESTING_EVENT_ID = the parent transaction EVENT_ID
  NESTING_EVENT_TYPE = 'TRANSACTION'
  NESTING_LEVEL = 0
  ```

Para declarações aninhadas:

  ```
  OBJECT_TYPE = the parent statement object type
  OBJECT_SCHEMA = the parent statement object schema
  OBJECT_NAME = the parent statement object name
  NESTING_EVENT_ID = the parent statement EVENT_ID
  NESTING_EVENT_TYPE = 'STATEMENT'
  NESTING_LEVEL = the parent statement NESTING_LEVEL plus one
  ```

* `STATEMENT_ID`

O ID da consulta mantido pelo servidor no nível SQL. O valor é único para a instância do servidor, pois esses IDs são gerados usando um contador global que é incrementado de forma atômica. Esta coluna foi adicionada no MySQL 8.0.14.

* `CPU_TIME`

O tempo gasto na CPU para o thread atual, expresso em picosegundos. Esta coluna foi adicionada no MySQL 8.0.28.

* `MAX_CONTROLLED_MEMORY`

Relata o valor máximo de memória controlada utilizada por uma declaração durante a execução.

Esta coluna foi adicionada no MySQL 8.0.31.

* `MAX_TOTAL_MEMORY`

Relata o valor máximo de memória utilizado por uma declaração durante a execução.

Esta coluna foi adicionada no MySQL 8.0.31.

* `EXECUTION_ENGINE`

O motor de execução de consulta. O valor é `PRIMARY` ou `SECONDARY`. Para uso com o MySQL HeatWave Service e o MySQL HeatWave, onde o motor `PRIMARY` é `InnoDB` e o motor `SECONDARY` é MySQL HeatWave (`RAPID`). Para o MySQL Community Edition Server, MySQL Enterprise Edition Server (on-premise) e o MySQL HeatWave Service sem o MySQL HeatWave, o valor é sempre `PRIMARY`. Esta coluna foi adicionada no MySQL 8.0.29.

A tabela `events_statements_current` tem esses índices:

* Chave primária em (`THREAD_ID`, `EVENT_ID`)

`TRUNCATE TABLE` é permitido para a tabela `events_statements_current`. Ele remove as linhas.

#### 29.12.6.2 A tabela eventos_statements_history

A tabela `events_statements_history` contém os eventos de declaração mais recentes do *`N`* que terminaram por fio. Os eventos de declaração não são adicionados à tabela até que tenham terminado. Quando a tabela contém o número máximo de linhas para um determinado fio, a linha mais antiga do fio é descartada quando uma nova linha para esse fio é adicionada. Quando um fio termina, todas as suas linhas são descartadas.

O Schema de Desempenho autodimensiona o valor de *`N`* durante o arranque do servidor. Para definir explicitamente o número de linhas por fio, defina a variável de sistema `performance_schema_events_statements_history_size` durante o arranque do servidor.

A tabela `events_statements_history` tem as mesmas colunas e indexação que a tabela `events_statements_current`. Veja a Seção 29.12.6.1, “A tabela events_statements_current”.

`TRUNCATE TABLE` é permitido para a tabela `events_statements_history`. Ele remove as linhas.

Para mais informações sobre a relação entre as três tabelas de eventos `events_statements_xxx`, consulte a Seção 29.9, “Tabelas do Schema de Desempenho para Eventos Atuais e Históricos”.

Para obter informações sobre a configuração de coleta de eventos de declaração, consulte a Seção 29.12.6, “Tabelas de Eventos de Declaração do Schema de Desempenho”.

#### 29.12.6.3 A tabela eventos_statements_history_long

A tabela `events_statements_history_long` contém os eventos de declaração mais recentes que ocorreram globalmente em todas as threads. Os eventos de declaração não são adicionados à tabela até que tenham terminado. Quando a tabela se torna cheia, a linha mais antiga é descartada quando uma nova linha é adicionada, independentemente de qual thread gerou essa linha.

O valor de *`N`* é dimensionado automaticamente no início do servidor. Para definir explicitamente o tamanho da tabela, defina a variável de sistema `performance_schema_events_statements_history_long_size` no início do servidor.

A tabela `events_statements_history_long` tem as mesmas colunas que a tabela `events_statements_current`. Veja a Seção 29.12.6.1, “A tabela events_statements_current”. Ao contrário de `events_statements_current`, `events_statements_history_long` não tem indexação.

`TRUNCATE TABLE` é permitido para a tabela `events_statements_history_long`. Ele remove as linhas.

Para mais informações sobre a relação entre as três tabelas de eventos `events_statements_xxx`, consulte a Seção 29.9, “Tabelas do Schema de Desempenho para Eventos Atuais e Históricos”.

Para obter informações sobre a configuração de coleta de eventos de declaração, consulte a Seção 29.12.6, “Tabelas de Eventos de Declaração do Schema de Desempenho”.

#### 29.12.6.4 A tabela prepared_statements_instances

O Schema de Desempenho oferece instrumentação para declarações preparadas, para as quais existem dois protocolos:

* O protocolo binário. Este é acessado através da API C do MySQL e é mapeado em comandos de servidor subjacentes, conforme mostrado na tabela a seguir.

  <table summary="How the binary protocol accessed through the MySQL C API maps onto underlying server commands."><col style="width: 50%"/><col style="width: 50%"/><thead><tr> <th>C API Function</th> <th>Corresponding Server Command</th> </tr></thead><tbody><tr> <td><code>mysql_stmt_prepare()</code></td> <td><code>COM_STMT_PREPARE</code></td> </tr><tr> <td><code>mysql_stmt_execute()</code></td> <td><code>COM_STMT_EXECUTE</code></td> </tr><tr> <td><code>mysql_stmt_close()</code></td> <td><code>COM_STMT_CLOSE</code></td> </tr></tbody></table>

* Protocolo de texto. Este é acessado usando declarações SQL e mapeado em comandos de servidor subjacentes, conforme mostrado na tabela a seguir.

  <table summary="How the text protocol accessed using SQL statements maps onto underlying server commands."><col style="width: 50%"/><col style="width: 50%"/><thead><tr> <th>SQL Statement</th> <th>Corresponding Server Command</th> </tr></thead><tbody><tr> <td><code>PREPARE</code></td> <td><code>SQLCOM_PREPARE</code></td> </tr><tr> <td><code>EXECUTE</code></td> <td><code>SQLCOM_EXECUTE</code></td> </tr><tr> <td><code>DEALLOCATE PREPARE</code>, <a class="link" href="deallocate-prepare.html" title="15.5.3 DEALLOCATE PREPARE Statement"><code class="literal">DROP PREPARE</code></a></td> <td><code>SQLCOM_DEALLOCATE PREPARE</code></td> </tr></tbody></table>

A instrumentação de declaração preparada do Schema de desempenho cobre ambos os protocolos. A discussão a seguir se refere aos comandos do servidor, e não às funções da API C ou às declarações SQL.

Informações sobre declarações preparadas estão disponíveis na tabela `prepared_statements_instances`. Esta tabela permite a inspeção de declarações preparadas usadas no servidor e fornece estatísticas agregadas sobre elas. Para controlar o tamanho desta tabela, defina a variável de sistema `performance_schema_max_prepared_statements_instances` na inicialização do servidor.

A coleta de informações de declaração preparadas depende dos instrumentos de declaração mostrados na tabela a seguir. Esses instrumentos são habilitados por padrão. Para modificá-los, atualize a tabela `setup_instruments`.

<table summary="Collection of prepared statement information depends on the statement instruments shown in this table."><col style="width: 50%"/><col style="width: 50%"/><thead><tr> <th>Instrument</th> <th>Server Command</th> </tr></thead><tbody><tr> <td><code>statement/com/Prepare</code></td> <td><code>COM_STMT_PREPARE</code></td> </tr><tr> <td><code>statement/com/Execute</code></td> <td><code>COM_STMT_EXECUTE</code></td> </tr><tr> <td><code>statement/sql/prepare_sql</code></td> <td><code>SQLCOM_PREPARE</code></td> </tr><tr> <td><code>statement/sql/execute_sql</code></td> <td><code>SQLCOM_EXECUTE</code></td> </tr></tbody></table>

O Schema de Desempenho gerencia os conteúdos da tabela `prepared_statements_instances` da seguinte forma:

* Preparação de declarações

Um comando `COM_STMT_PREPARE` ou `SQLCOM_PREPARE` cria uma declaração preparada no servidor. Se a declaração for instrumentada com sucesso, uma nova linha é adicionada à tabela `prepared_statements_instances`. Se a declaração não puder ser instrumentada, a variável de status `Performance_schema_prepared_statements_lost` é incrementada.

* Execução de declarações preparadas

A execução de um comando `COM_STMT_EXECUTE` ou `SQLCOM_PREPARE` para uma instância de declaração preparada instrumentada atualiza a linha correspondente da tabela `prepared_statements_instances`.

* Deslocamento de declaração preparada

A execução de um comando `COM_STMT_CLOSE` ou `SQLCOM_DEALLOCATE_PREPARE` para uma instância de declaração preparada instrumentada remove a linha correspondente da tabela `prepared_statements_instances`. Para evitar vazamentos de recursos, a remoção ocorre mesmo se os instrumentos de declaração preparada descritos anteriormente forem desativados.

A tabela `prepared_statements_instances` tem essas colunas:

* `OBJECT_INSTANCE_BEGIN`

O endereço em memória do depoimento instrumentado preparado.

* `STATEMENT_ID`

A declaração interna ID atribuída pelo servidor. Os protocolos de texto e binário utilizam ambos IDs de declaração.

* `STATEMENT_NAME`

Para o protocolo binário, esta coluna é `NULL`. Para o protocolo de texto, esta coluna é o nome da declaração externa atribuído pelo usuário. Por exemplo, para a seguinte declaração SQL, o nome da declaração preparada é `stmt`:

  ```
  PREPARE stmt FROM 'SELECT 1';
  ```

* `SQL_TEXT`

O texto da declaração preparada, com marcadores de substituição `?`.

* `OWNER_THREAD_ID`, `OWNER_EVENT_ID`

Essas colunas indicam o evento que criou a declaração preparada.

* `OWNER_OBJECT_TYPE`, `OWNER_OBJECT_SCHEMA`, `OWNER_OBJECT_NAME`

Para uma declaração preparada criada por uma sessão de cliente, essas colunas são `NULL`. Para uma declaração preparada criada por um programa armazenado, essas colunas apontam para o programa armazenado. Um erro típico do usuário é esquecer de liberar declarações preparadas. Essas colunas podem ser usadas para encontrar programas armazenados que vazam declarações preparadas:

  ```
  SELECT
    OWNER_OBJECT_TYPE, OWNER_OBJECT_SCHEMA, OWNER_OBJECT_NAME,
    STATEMENT_NAME, SQL_TEXT
  FROM performance_schema.prepared_statements_instances
  WHERE OWNER_OBJECT_TYPE IS NOT NULL;
  ```

* O motor de execução de consulta. O valor é `PRIMARY` ou `SECONDARY`. Para uso com o MySQL HeatWave Service e o MySQL HeatWave, onde o motor `PRIMARY` é `InnoDB` e o motor `SECONDARY` é MySQL HeatWave (`RAPID`). Para o MySQL Community Edition Server, MySQL Enterprise Edition Server (on-premise) e o MySQL HeatWave Service sem o MySQL HeatWave, o valor é sempre `PRIMARY`. Esta coluna foi adicionada no MySQL 8.0.29.

* `TIMER_PREPARE`

O tempo gasto na execução da preparação da própria declaração.

* `COUNT_REPREPARE`

O número de vezes que a declaração foi preparada internamente (veja a Seção 10.10.3, "Cache de declarações preparadas e programas armazenados") As estatísticas de tempo para a preparação não estão disponíveis porque são contadas como parte da execução da declaração, não como uma operação separada.

* `COUNT_EXECUTE`, `SUM_TIMER_EXECUTE`, `MIN_TIMER_EXECUTE`, `AVG_TIMER_EXECUTE`, `MAX_TIMER_EXECUTE`

Estatísticas agregadas para execuções da declaração preparada.

* `SUM_xxx`

As colunas restantes do `SUM_xxx` são as mesmas das tabelas de resumo de declaração (ver Seção 29.12.20.3, “Tabelas de Resumo de Declaração”).

* `MAX_CONTROLLED_MEMORY`

Relata o valor máximo de memória controlada utilizada por uma declaração preparada durante a execução.

Esta coluna foi adicionada no MySQL 8.0.31.

* `MAX_TOTAL_MEMORY`

Relata o valor máximo de memória utilizado por uma declaração preparada durante a execução.

Esta coluna foi adicionada no MySQL 8.0.31.

A tabela `prepared_statements_instances` tem esses índices:

* Chave primária em (`OBJECT_INSTANCE_BEGIN`)
* Índice em (`STATEMENT_ID`)
* Índice em (`STATEMENT_NAME`)
* Índice em (`OWNER_THREAD_ID`, `OWNER_EVENT_ID`)

* Índice de (`OWNER_OBJECT_TYPE`, `OWNER_OBJECT_SCHEMA`, `OWNER_OBJECT_NAME`)

`TRUNCATE TABLE` redefiniu as colunas de estatísticas da tabela `prepared_statements_instances`.

### 29.12.7 Tabelas de Transações do Schema de Desempenho

O esquema de desempenho registra as transações. Na hierarquia de eventos, os eventos de espera estão dentro dos eventos de estágio, que estão dentro dos eventos de declaração, que estão dentro dos eventos de transação.

Essas tabelas armazenam eventos de transação:

* `events_transactions_current`: O evento de transação atual para cada fio.

* `events_transactions_history`: Os eventos de transação mais recentes que terminaram por fio.

* `events_transactions_history_long`: Os eventos de transação mais recentes que terminaram globalmente (em todas as threads).

As seções a seguir descrevem as tabelas de eventos de transação. Há também tabelas resumidas que agregam informações sobre eventos de transação; veja a Seção 29.12.20.5, “Tabelas de Resumo de Transação”.

Para mais informações sobre a relação entre as três tabelas de eventos de transação, consulte a Seção 29.9, “Tabelas do Schema de Desempenho para Eventos Atuais e Históricos”.

* Configuração da coleta de eventos de transação
* Limites de transação
* Instrumentação de transação
* Transações e eventos aninhados
* Transações e programas armazenados
* Transações e pontos de salvamento
* Transações e erros

#### Configurando a Coleta de Eventos de Transação

Para controlar se deve coletar eventos de transação, defina o estado dos instrumentos e dos consumidores relevantes:

* A tabela `setup_instruments` contém um instrumento denominado `transaction`. Use este instrumento para habilitar ou desabilitar a coleta de classes individuais de eventos de transação.

* A tabela `setup_consumers` contém valores de consumidor com nomes correspondentes aos nomes atuais e históricos das tabelas de eventos de transação. Use esses consumidores para filtrar a coleção de eventos de transação.

Os instrumentos `transaction` e os consumidores de transações `events_transactions_current` e `events_transactions_history` são habilitados por padrão:

```
mysql> SELECT NAME, ENABLED, TIMED
       FROM performance_schema.setup_instruments
       WHERE NAME = 'transaction';
+-------------+---------+-------+
| NAME        | ENABLED | TIMED |
+-------------+---------+-------+
| transaction | YES     | YES   |
+-------------+---------+-------+
mysql> SELECT *
       FROM performance_schema.setup_consumers
       WHERE NAME LIKE 'events_transactions%';
+----------------------------------+---------+
| NAME                             | ENABLED |
+----------------------------------+---------+
| events_transactions_current      | YES     |
| events_transactions_history      | YES     |
| events_transactions_history_long | NO      |
+----------------------------------+---------+
```

Para controlar a coleta de eventos de transação na inicialização do servidor, use linhas como essas em seu arquivo `my.cnf`:

* Habilitar:

  ```
  [mysqld]
  performance-schema-instrument='transaction=ON'
  performance-schema-consumer-events-transactions-current=ON
  performance-schema-consumer-events-transactions-history=ON
  performance-schema-consumer-events-transactions-history-long=ON
  ```

* Desativar:

  ```
  [mysqld]
  performance-schema-instrument='transaction=OFF'
  performance-schema-consumer-events-transactions-current=OFF
  performance-schema-consumer-events-transactions-history=OFF
  performance-schema-consumer-events-transactions-history-long=OFF
  ```

Para controlar a coleta de eventos de transação no tempo de execução, atualize as tabelas `setup_instruments` e `setup_consumers`:

* Habilitar:

  ```
  UPDATE performance_schema.setup_instruments
  SET ENABLED = 'YES', TIMED = 'YES'
  WHERE NAME = 'transaction';

  UPDATE performance_schema.setup_consumers
  SET ENABLED = 'YES'
  WHERE NAME LIKE 'events_transactions%';
  ```

* Desativar:

  ```
  UPDATE performance_schema.setup_instruments
  SET ENABLED = 'NO', TIMED = 'NO'
  WHERE NAME = 'transaction';

  UPDATE performance_schema.setup_consumers
  SET ENABLED = 'NO'
  WHERE NAME LIKE 'events_transactions%';
  ```

Para coletar eventos de transação apenas para tabelas específicas de eventos de transação, habilite o instrumento `transaction`, mas apenas os consumidores de transação correspondentes às tabelas desejadas.

Para obter informações adicionais sobre a configuração da coleta de eventos, consulte a Seção 29.3, “Configuração de inicialização do Schema de desempenho”, e a Seção 29.4, “Configuração de execução do Schema de desempenho”.

#### Limites de Transação

No MySQL Server, as transações começam explicitamente com essas declarações:

```
START TRANSACTION | BEGIN | XA START | XA BEGIN
```

As transações também começam implicitamente. Por exemplo, quando a variável de sistema `autocommit` é habilitada, o início de cada declaração inicia uma nova transação.

Quando o `autocommit` é desativado, a primeira declaração que segue uma transação comprometida marca o início de uma nova transação. As declarações subsequentes fazem parte da transação até que ela seja comprometida.

As transações terminam explicitamente com essas declarações:

```
COMMIT | ROLLBACK | XA COMMIT | XA ROLLBACK
```

As transações também terminam implicitamente, pela execução de declarações DDL, declarações de bloqueio e declarações de administração do servidor.

Na discussão a seguir, as referências a `START TRANSACTION`](commit.html "15.3.1 START TRANSACTION, COMMIT, and ROLLBACK Statements") também se aplicam a `BEGIN`, [`XA START`](xa-statements.html "15.3.8.1 XA Transaction SQL Statements") e [`XA BEGIN`](xa-statements.html "15.3.8.1 XA Transaction SQL Statements"). Da mesma forma, as referências a `COMMIT` e `ROLLBACK` se aplicam a [`XA COMMIT`](xa-statements.html "15.3.8.1 XA Transaction SQL Statements") e [`XA ROLLBACK`](xa-statements.html "15.3.8.1 XA Transaction SQL Statements"), respectivamente.

O Schema de Desempenho define os limites das transações de forma semelhante ao do servidor. O início e o fim de um evento de transação correspondem de perto às transições de estado correspondentes no servidor:

* Para uma transação explicitamente iniciada, o evento da transação começa durante o processamento da declaração `START TRANSACTION` (commit.html "15.3.1 START TRANSACTION, COMMIT, and ROLLBACK Statements").

* Para uma transação iniciada implicitamente, o evento da transação começa na primeira declaração que utiliza um motor transacional após a conclusão da transação anterior.

* Para qualquer transação, seja explicitamente ou implicitamente encerrada, o evento da transação termina quando o servidor sai do estado de transação ativa durante o processamento de `COMMIT` ou `ROLLBACK`.

Há implicações sutis nessa abordagem:

* Os eventos de transação no Schema de Desempenho não incluem totalmente os eventos de declaração associados às declarações correspondentes `START TRANSACTION`, (commit.html "15.3.1 START TRANSACTION, COMMIT, and ROLLBACK Statements"), `COMMIT` ou `ROLLBACK`. Há uma quantidade trivial de sobreposição de temporização entre o evento de transação e essas declarações.

* As declarações que trabalham com motores não transacionais não têm efeito sobre o estado da transação da conexão. Para transações implícitas, o evento da transação começa com a primeira declaração que utiliza um motor transacional. Isso significa que as declarações que operam exclusivamente em tabelas não transacionais são ignoradas, mesmo seguindo `START TRANSACTION`(commit.html "15.3.1 START TRANSACTION, COMMIT, and ROLLBACK Statements").

Para ilustrar, considere o seguinte cenário:

```
1. SET autocommit = OFF;
2. CREATE TABLE t1 (a INT) ENGINE = InnoDB;
3. START TRANSACTION;                       -- Transaction 1 START
4. INSERT INTO t1 VALUES (1), (2), (3);
5. CREATE TABLE t2 (a INT) ENGINE = MyISAM; -- Transaction 1 COMMIT
                                            -- (implicit; DDL forces commit)
6. INSERT INTO t2 VALUES (1), (2), (3);     -- Update nontransactional table
7. UPDATE t2 SET a = a + 1;                 -- ... and again
8. INSERT INTO t1 VALUES (4), (5), (6);     -- Write to transactional table
                                            -- Transaction 2 START (implicit)
9. COMMIT;                                  -- Transaction 2 COMMIT
```

Do ponto de vista do servidor, a Transação 1 termina quando a tabela `t2` é criada. A Transação 2 não começa até que uma tabela transacional seja acessada, apesar das atualizações intermédias em tabelas não transacionais.

Do ponto de vista do Schema de Desempenho, a Transação 2 começa quando o servidor transiciona para um estado de transação ativa. As declarações 6 e 7 não estão incluídas nos limites da Transação 2, o que é consistente com a forma como o servidor escreve as transações no log binário.

#### Instrumentação de Transação

Três atributos definem as transações:

* Modo de acesso (somente leitura, leitura e escrita) * Nível de isolamento (`SERIALIZABLE`, `REPEATABLE READ`, e assim por diante)

* Implícito (`autocommit` ativado) ou explícito (`autocommit` desativado)

Para reduzir a complexidade da instrumentação das transações e garantir que os dados de transação coletados forneçam resultados completos e significativos, todas as transações são instrumentadas independentemente do modo de acesso, do nível de isolamento ou do modo de autocommit.

Para examinar seletivamente o histórico de transações, use as colunas de atributos nas tabelas de eventos de transação: `ACCESS_MODE`, `ISOLATION_LEVEL` e `AUTOCOMMIT`.

O custo da instrumentação de transações pode ser reduzido de várias maneiras, como habilitar ou desabilitar a instrumentação de transações de acordo com o usuário, a conta, o host ou o fio (conexão do cliente).

#### Transações e Eventos Aninhados

O progenitor de um evento de transação é o evento que iniciou a transação. Para uma transação explicitamente iniciada, isso inclui as declarações `START TRANSACTION` (commit.html "15.3.1 START TRANSACTION, COMMIT, and ROLLBACK Statements") e `COMMIT AND CHAIN` (commit.html "15.3.1 START TRANSACTION, COMMIT, and ROLLBACK Statements"). Para uma transação implicitamente iniciada, é a primeira declaração que usa um motor transacional após o término da transação anterior.

Em geral, uma transação é o nível superior dos pais de todos os eventos iniciados durante a transação, incluindo declarações que explicitamente encerram a transação, como `COMMIT` e `ROLLBACK`. As exceções são as declarações que encerram implicitamente uma transação, como as declarações DDL, no caso, a transação atual deve ser comprometida antes de a nova declaração ser executada.

#### Transações e Programas Armazenados

As transações e os eventos de programa armazenado estão relacionados da seguinte forma:

* Procedimentos Armazenados

Os procedimentos armazenados operam independentemente das transações. Um procedimento armazenado pode ser iniciado dentro de uma transação, e uma transação pode ser iniciada ou encerrada dentro de um procedimento armazenado. Se chamado dentro de uma transação, um procedimento armazenado pode executar instruções que forçam o commit da transação pai e, em seguida, iniciar uma nova transação.

Se um procedimento armazenado for iniciado dentro de uma transação, essa transação é o evento do procedimento armazenado.

Se uma transação é iniciada por um procedimento armazenado, o procedimento armazenado é o pai do evento de transação.

* Funções Armazenadas

As funções armazenadas não podem causar um commit ou rollback explícito ou implícito. Os eventos de função armazenada podem residir dentro de um evento de transação pai.

* Gatilhos

Os gatilhos são ativados como parte de uma declaração que acessa a tabela com a qual está associado, portanto, o pai de um evento de gatilho é sempre a declaração que o ativa.

Os gatilhos não podem emitir declarações que causem um compromisso explícito ou implícito ou um rollback de uma transação.

* Eventos agendados

A execução das declarações no corpo de um evento agendado ocorre em uma nova conexão. A aninhamento de um evento agendado dentro de uma transação principal não é aplicável.

#### Transações e pontos de salvamento

As declarações de Savepoint são registradas como eventos de declaração separados. Os eventos de transação incluem contadores separados para as declarações `SAVEPOINT`, `ROLLBACK TO SAVEPOINT` (savepoint.html "15.3.4 SAVEPOINT, ROLLBACK TO SAVEPOINT, and RELEASE SAVEPOINT Statements") e `RELEASE SAVEPOINT` (savepoint.html "15.3.4 SAVEPOINT, ROLLBACK TO SAVEPOINT, and RELEASE SAVEPOINT Statements") emitidas durante a transação.

#### Transações e Erros

Erros e avisos que ocorrem dentro de uma transação são registrados em eventos de declaração, mas não no evento de transação correspondente. Isso inclui erros e avisos específicos da transação, como um rollback em uma tabela não transacional ou erros de consistência GTID.

#### 29.12.7.1 A tabela events_transactions_current

A tabela `events_transactions_current` contém eventos de transação atual. A tabela armazena uma linha por thread, mostrando o status atual do evento de transação mais recente monitorado da thread, portanto, não há uma variável do sistema para configurar o tamanho da tabela. Por exemplo:

```
mysql> SELECT *
       FROM performance_schema.events_transactions_current LIMIT 1\G
*************************** 1. row ***************************
                      THREAD_ID: 26
                       EVENT_ID: 7
                   END_EVENT_ID: NULL
                     EVENT_NAME: transaction
                          STATE: ACTIVE
                         TRX_ID: NULL
                           GTID: 3E11FA47-71CA-11E1-9E33-C80AA9429562:56
                            XID: NULL
                       XA_STATE: NULL
                         SOURCE: transaction.cc:150
                    TIMER_START: 420833537900000
                      TIMER_END: NULL
                     TIMER_WAIT: NULL
                    ACCESS_MODE: READ WRITE
                ISOLATION_LEVEL: REPEATABLE READ
                     AUTOCOMMIT: NO
           NUMBER_OF_SAVEPOINTS: 0
NUMBER_OF_ROLLBACK_TO_SAVEPOINT: 0
    NUMBER_OF_RELEASE_SAVEPOINT: 0
          OBJECT_INSTANCE_BEGIN: NULL
               NESTING_EVENT_ID: 6
             NESTING_EVENT_TYPE: STATEMENT
```

Dos quadros que contêm linhas de eventos de transação, `events_transactions_current` é o mais fundamental. Outras tabelas que contêm linhas de eventos de transação são derivadas logicamente dos eventos atuais. Por exemplo, as tabelas `events_transactions_history` e `events_transactions_history_long` são coleções dos eventos de transação mais recentes que terminaram, até um número máximo de linhas por fio e globalmente em todos os fios, respectivamente.

Para mais informações sobre a relação entre as três tabelas de eventos de transação, consulte a Seção 29.9, “Tabelas do Schema de Desempenho para Eventos Atuais e Históricos”.

Para obter informações sobre a configuração de coleta de eventos de transação, consulte a Seção 29.12.7, “Tabelas de Transação do Schema de Desempenho”.

A tabela `events_transactions_current` tem essas colunas:

* `THREAD_ID`, `EVENT_ID`

O fio associado ao evento e o número do evento atual do fio quando o evento começa. Os valores `THREAD_ID` e `EVENT_ID`, quando tomados juntos, identificam de forma única a linha. Nenhuma outra linha tem o mesmo par de valores.

* `END_EVENT_ID`

Essa coluna é definida como `NULL` quando o evento começa e atualizada para o número atual do evento do tópico quando o evento termina.

* `EVENT_NAME`

O nome do instrumento do qual o evento foi coletado. Este é um valor `NAME` da tabela `setup_instruments`. Os nomes dos instrumentos podem ter várias partes e formar uma hierarquia, conforme discutido na Seção 29.6, “Convenções de Nomenclatura de Instrumentos do Schema de Desempenho”.

* `STATE`

O estado atual da transação. O valor é `ACTIVE` (após `START TRANSACTION` (commit.html "15.3.1 START TRANSACTION, COMMIT, and ROLLBACK Statements") ou `BEGIN`), `COMMITTED` (após `COMMIT`), ou `ROLLED BACK` (após `ROLLBACK`).

* `TRX_ID`

  Unused.

* `GTID`

A coluna GTID contém o valor de `gtid_next`, que pode ser um dos valores de `ANONYMOUS`, `AUTOMATIC`, ou um GTID usando o formato `UUID:NUMBER`. Para transações que utilizam `gtid_next=AUTOMATIC`, que são todas as transações normais de clientes, a coluna GTID muda quando a transação é confirmada e o GTID real é atribuído. Se `gtid_mode` é `ON` ou `ON_PERMISSIVE`, a coluna GTID muda para o GTID da transação. Se `gtid_mode` é `OFF` ou `OFF_PERMISSIVE`, a coluna GTID muda para `ANONYMOUS`.

* `XID_FORMAT_ID`, `XID_GTRID` e `XID_BQUAL`

Os elementos do identificador de transação XA. Eles têm o formato descrito na Seção 15.3.8.1, “Ensaios de SQL de Transação XA”.

* `XA_STATE`

O estado da transação XA. O valor é `ACTIVE` (após [`XA START`](xa-statements.html "15.3.8.1 XA Transaction SQL Statements")), `IDLE` (após [`XA END`](xa-statements.html "15.3.8.1 XA Transaction SQL Statements")), `PREPARED` (após [`XA PREPARE`](xa-statements.html "15.3.8.1 XA Transaction SQL Statements")), `ROLLED BACK` (após [`XA ROLLBACK`](xa-statements.html "15.3.8.1 XA Transaction SQL Statements")), ou `COMMITTED` (após [`XA COMMIT`](xa-statements.html "15.3.8.1 XA Transaction SQL Statements")).

Em uma réplica, a mesma transação XA pode aparecer na tabela `events_transactions_current` com diferentes estados em diferentes threads. Isso ocorre porque, imediatamente após a transação XA ser preparada, ela é desvinculada do thread do aplicador da réplica e pode ser comprometida ou revertida por qualquer thread na réplica. A tabela `events_transactions_current` exibe o status atual do evento de transação mais recente monitorado no thread, e não atualiza esse status quando o thread está parado. Portanto, a transação XA ainda pode ser exibida no estado `PREPARED` para o thread original do aplicador, após ter sido processada por outro thread. Para identificar positivamente as transações XA que ainda estão no estado `PREPARED` e precisam ser recuperadas, use a declaração `XA RECOVER`(xa-statements.html "15.3.8.1 XA Transaction SQL Statements") em vez das tabelas de transação do Schema de Desempenho.

* `SOURCE`

O nome do arquivo fonte que contém o código instrumentado que produziu o evento e o número da linha no arquivo onde a instrumentação ocorre. Isso permite que você verifique a fonte para determinar exatamente qual código está envolvido.

* `TIMER_START`, `TIMER_END`, `TIMER_WAIT`

Informações de cronometragem para o evento. A unidade desses valores é picosegundo (trilhão de um segundo). Os valores `TIMER_START` e `TIMER_END` indicam quando o cronometramento do evento começou e terminou. `TIMER_WAIT` é o tempo decorrido do evento (duração).

Se um evento ainda não tiver terminado, `TIMER_END` é o valor atual do temporizador e `TIMER_WAIT` é o tempo que já passou (`TIMER_END` − `TIMER_START`).

Se um evento for produzido a partir de um instrumento que tem `TIMED = NO`, as informações de cronometragem não são coletadas, e `TIMER_START`, `TIMER_END` e `TIMER_WAIT` são todos `NULL`.

Para discussão sobre picossegundos como unidade para os tempos dos eventos e fatores que afetam os valores de tempo, consulte a Seção 29.4.1, “Tempo de Ocorrência do Schema de Desempenho”.

* `ACCESS_MODE`

O modo de acesso à transação. O valor é `READ WRITE` ou `READ ONLY`.

* `ISOLATION_LEVEL`

O nível de isolamento de transação. O valor é `REPEATABLE READ`, `READ COMMITTED`, `READ UNCOMMITTED` ou `SERIALIZABLE`.

* `AUTOCOMMIT`

Se o modo de autocommit foi habilitado quando a transação foi iniciada.

* `NUMBER_OF_SAVEPOINTS`, `NUMBER_OF_ROLLBACK_TO_SAVEPOINT`, `NUMBER_OF_RELEASE_SAVEPOINT`

O número de declarações `SAVEPOINT`, `ROLLBACK TO SAVEPOINT` e (savepoint.html "15.3.4 SAVEPOINT, ROLLBACK TO SAVEPOINT, and RELEASE SAVEPOINT Statements"), e `RELEASE SAVEPOINT` (savepoint.html "15.3.4 SAVEPOINT, ROLLBACK TO SAVEPOINT, and RELEASE SAVEPOINT Statements") emitidas durante a transação.

* `OBJECT_INSTANCE_BEGIN`

  Unused.

* `NESTING_EVENT_ID`

O valor `EVENT_ID` do evento dentro do qual este evento está aninhado.

* `NESTING_EVENT_TYPE`

O tipo de evento de nidificação. O valor é `TRANSACTION`, `STATEMENT`, `STAGE` ou `WAIT`. (`TRANSACTION` não aparece porque as transações não podem ser nidificadas.)

A tabela `events_transactions_current` tem esses índices:

* Chave primária em (`THREAD_ID`, `EVENT_ID`)

`TRUNCATE TABLE` é permitido para a tabela `events_transactions_current`. Ele remove as linhas.

#### 29.12.7.2 A tabela eventos_transacoes_historico

A tabela `events_transactions_history` contém os eventos de transação *`N`* mais recentes que terminaram por fio. Os eventos de transação não são adicionados à tabela até que tenham terminado. Quando a tabela contém o número máximo de linhas para um determinado fio, a linha mais antiga do fio é descartada quando uma nova linha para esse fio é adicionada. Quando um fio termina, todas as suas linhas são descartadas.

O Schema de Desempenho autodimensiona o valor de *`N`* durante o arranque do servidor. Para definir explicitamente o número de linhas por fio, defina a variável de sistema `performance_schema_events_transactions_history_size` durante o arranque do servidor.

A tabela `events_transactions_history` tem as mesmas colunas e indexação que a tabela `events_transactions_current`. Veja a Seção 29.12.7.1, “A tabela events_transactions_current”.

`TRUNCATE TABLE` é permitido para a tabela `events_transactions_history`. Ele remove as linhas.

Para mais informações sobre a relação entre as três tabelas de eventos de transação, consulte a Seção 29.9, “Tabelas do Schema de Desempenho para Eventos Atuais e Históricos”.

Para obter informações sobre a configuração de coleta de eventos de transação, consulte a Seção 29.12.7, “Tabelas de Transação do Schema de Desempenho”.

#### 29.12.7.3 A tabela eventos_transacoes_historico_long

A tabela `events_transactions_history_long` contém os eventos de transação *`N`* mais recentes que terminaram globalmente, em todas as threads. Os eventos de transação não são adicionados à tabela até que tenham terminado. Quando a tabela se torna cheia, a linha mais antiga é descartada quando uma nova linha é adicionada, independentemente de qual thread gerou a linha.

O Schema de desempenho autodimensiona o valor de *`N`* é autodimensionado no início do servidor. Para definir explicitamente o tamanho da tabela, defina a variável de sistema `performance_schema_events_transactions_history_long_size` no início do servidor.

A tabela `events_transactions_history_long` tem as mesmas colunas que a tabela `events_transactions_current`. Veja a Seção 29.12.7.1, “A tabela events_transactions_current”. Ao contrário de `events_transactions_current`, `events_transactions_history_long` não tem indexação.

`TRUNCATE TABLE` é permitido para a tabela `events_transactions_history_long`. Ele remove as linhas.

Para mais informações sobre a relação entre as três tabelas de eventos de transação, consulte a Seção 29.9, “Tabelas do Schema de Desempenho para Eventos Atuais e Históricos”.

Para obter informações sobre a configuração de coleta de eventos de transação, consulte a Seção 29.12.7, “Tabelas de Transação do Schema de Desempenho”.

### 29.12.8 Tabelas de Conexão do Schema de Desempenho

Quando um cliente se conecta ao servidor MySQL, ele faz isso sob um nome de usuário específico e a partir de um host específico. O Schema de Desempenho fornece estatísticas sobre essas conexões, rastreando-as por conta (combinação de usuário e host), bem como separadamente por nome de usuário e nome de host, usando essas tabelas:

* `accounts`: Estatísticas de conexão por conta de cliente

* `hosts`: Estatísticas de conexão por nome de host do cliente

* `users`: Estatísticas de conexão por nome de usuário do cliente

O significado de “conta” nas tabelas de conexão é semelhante ao seu significado nas tabelas de concessão de permissão do sistema `mysql`, no sentido de que o termo se refere a uma combinação de valores de usuário e host. Eles diferem na medida em que, para as tabelas de concessão de permissão, a parte do host de uma conta pode ser um padrão, enquanto para as tabelas do Schema de Desempenho, o valor do host é sempre um nome de host específico não padrão.

Cada tabela de conexão tem as colunas `CURRENT_CONNECTIONS` e `TOTAL_CONNECTIONS` para rastrear o número atual e total de conexões por “valor de rastreamento” sobre o qual suas estatísticas são baseadas. As tabelas diferem no que elas usam para o valor de rastreamento. A tabela `accounts` tem as colunas `USER` e `HOST` para rastrear conexões por combinação de usuário e host. As tabelas `users` e `hosts` têm uma coluna `USER` e `HOST`, respectivamente, para rastrear conexões por nome de usuário e nome de host.

O Schema de Desempenho também conta as threads internas e as threads para sessões de usuários que não conseguiram se autenticar, usando linhas com os valores das colunas `USER` e `HOST` de `NULL`.

Suponha que os clientes com os nomes `user1` e `user2` se conectem uma vez a partir de `hosta` e `hostb`. O Schema de Desempenho rastreia as conexões da seguinte forma:

* A tabela `accounts` tem quatro linhas, para os valores das contas `user1`/`hosta`, `user1`/`hostb`, `user2`/`hosta` e `user2`/`hostb`, cada linha contando uma conexão por conta.

* A tabela `hosts` tem duas linhas, para `hosta` e `hostb`, cada linha contando duas conexões por nome de host.

* A tabela `users` tem duas linhas, para `user1` e `user2`, cada linha contando duas conexões por nome de usuário.

Quando um cliente se conecta, o Schema de Desempenho determina qual linha na tabela de conexão se aplica, usando o valor de rastreamento apropriado para cada tabela. Se não houver tal linha, uma é adicionada. Em seguida, o Schema de Desempenho incrementa em um os campos `CURRENT_CONNECTIONS` e `TOTAL_CONNECTIONS` naquela linha.

Quando um cliente se desconecta, o Schema de Desempenho decrementa em um a coluna `CURRENT_CONNECTIONS` na linha e deixa a coluna `TOTAL_CONNECTIONS` inalterada.

`TRUNCATE TABLE` é permitido para tabelas de conexão. Tem esses efeitos:

* As linhas são removidas para contas, anfitriões ou usuários que não têm conexões atuais (linhas com `CURRENT_CONNECTIONS = 0`).

* As linhas não removidas são redefinidas para contar apenas as conexões atuais: Para as linhas com `CURRENT_CONNECTIONS > 0`, `TOTAL_CONNECTIONS` é redefinido para `CURRENT_CONNECTIONS`.

* As tabelas de resumo que dependem da tabela de conexão são implicitamente truncadas, conforme descrito mais adiante nesta seção.

O Schema de Desempenho mantém tabelas resumidas que agregam estatísticas de conexão para vários tipos de eventos por conta, host ou usuário. Essas tabelas têm `_summary_by_account`, `_summary_by_host` ou `_summary_by_user` no nome. Para identificá-las, use esta consulta:

```
mysql> SELECT TABLE_NAME FROM INFORMATION_SCHEMA.TABLES
       WHERE TABLE_SCHEMA = 'performance_schema'
       AND TABLE_NAME REGEXP '_summary_by_(account|host|user)'
       ORDER BY TABLE_NAME;
+------------------------------------------------------+
| TABLE_NAME                                           |
+------------------------------------------------------+
| events_errors_summary_by_account_by_error            |
| events_errors_summary_by_host_by_error               |
| events_errors_summary_by_user_by_error               |
| events_stages_summary_by_account_by_event_name       |
| events_stages_summary_by_host_by_event_name          |
| events_stages_summary_by_user_by_event_name          |
| events_statements_summary_by_account_by_event_name   |
| events_statements_summary_by_host_by_event_name      |
| events_statements_summary_by_user_by_event_name      |
| events_transactions_summary_by_account_by_event_name |
| events_transactions_summary_by_host_by_event_name    |
| events_transactions_summary_by_user_by_event_name    |
| events_waits_summary_by_account_by_event_name        |
| events_waits_summary_by_host_by_event_name           |
| events_waits_summary_by_user_by_event_name           |
| memory_summary_by_account_by_event_name              |
| memory_summary_by_host_by_event_name                 |
| memory_summary_by_user_by_event_name                 |
+------------------------------------------------------+
```

Para obter detalhes sobre as tabelas de resumo de conexão individual, consulte a seção que descreve as tabelas para o tipo de evento resumido:

* Resumos de eventos: Seção 29.12.20.1, “Tabelas de Resumo de Eventos de Aguardar”

* Resumos de eventos em palco: Seção 29.12.20.2, “Tabelas de Resumo em Palco”

* Resumos de eventos de declaração: Seção 29.12.20.3, “Tabelas de Resumo de Declaração”

* Resumos de eventos de transação: Seção 29.12.20.5, “Tabelas de Resumo de Transação”

* Resumos de eventos de memória: Seção 29.12.20.10, “Tabelas de Resumo de Memória”

* Resumos de eventos de erro: Seção 29.12.20.11, “Tabelas de Resumo de Erro”

`TRUNCATE TABLE` é permitido para tabelas de resumo de conexão. Ele remove linhas para contas, hosts ou usuários sem conexões e redefre o número de colunas de resumo para zero para as linhas restantes. Além disso, cada tabela de resumo que é agregada por conta, host, usuário ou thread é implicitamente truncada pela truncagem da tabela de conexão na qual depende. O seguinte quadro descreve a relação entre a truncagem da tabela de conexão e as tabelas implicitamente truncadas.

**Tabela 29.2 Efeitos Implícitos da Truncagem da Tabela de Conexão**

<table summary="Which Performance Schema summary tables are implicity truncated by connection table truncation."><col style="width: 40%"/><col style="width: 60%"/><thead><tr> <th>Truncated Connection Table</th> <th>Implicitly Truncated Summary Tables</th> </tr></thead><tbody><tr> <td><code>accounts</code></td> <td>Tables with names containing <code>_summary_by_account</code>, <code>_summary_by_thread</code></td> </tr><tr> <td><code>hosts</code></td> <td>Tables with names containing <code>_summary_by_account</code>, <code>_summary_by_host</code>, <code>_summary_by_thread</code></td> </tr><tr> <td><code>users</code></td> <td>Tables with names containing <code>_summary_by_account</code>, <code>_summary_by_user</code>, <code>_summary_by_thread</code></td> </tr></tbody></table>

O truncamento de uma tabela de resumo `_summary_global` também trunca implicitamente suas tabelas de resumo de conexão e de thread correspondentes. Por exemplo, o truncamento de `events_waits_summary_global_by_event_name` trunca implicitamente as tabelas de resumo de eventos de espera que são agregadas por conta, host, usuário ou thread.

#### 29.12.8.1 Tabela de contas

A tabela `accounts` contém uma linha para cada conta que se conectou ao servidor MySQL. Para cada conta, a tabela conta o número atual e total de conexões. O tamanho da tabela é dimensionado automaticamente no início do servidor. Para definir o tamanho da tabela explicitamente, defina a variável de sistema `performance_schema_accounts_size` no início do servidor. Para desabilitar as estatísticas da conta, defina essa variável para 0.

A tabela `accounts` tem as seguintes colunas. Para uma descrição de como o Gerador de Desempenho mantém as linhas nesta tabela, incluindo o efeito de `TRUNCATE TABLE`, consulte a Seção 29.12.8, “Tabelas de Conexão do Gerador de Desempenho”.

* `USER`

O nome de usuário do cliente para a conexão. Este é `NULL` para um fio interno, ou para uma sessão de usuário que não conseguiu autenticar.

* `HOST`

O host a partir do qual o cliente se conectou. Isso é `NULL` para um fio interno, ou para uma sessão de usuário que não conseguiu se autenticar.

* `CURRENT_CONNECTIONS`

O número atual de conexões para a conta.

* `TOTAL_CONNECTIONS`

O número total de conexões para a conta.

* `MAX_SESSION_CONTROLLED_MEMORY`

Relata o valor máximo de memória controlada utilizada por uma sessão pertencente à conta.

Esta coluna foi adicionada no MySQL 8.0.31.

* `MAX_SESSION_TOTAL_MEMORY`

Relata o valor máximo de memória utilizado por uma sessão pertencente à conta.

Esta coluna foi adicionada no MySQL 8.0.31.

A tabela `accounts` tem esses índices:

* Chave primária em (`USER`, `HOST`)

#### 29.12.8.2 A tabela de anfitriões

A tabela `hosts` contém uma linha para cada host a partir do qual os clientes se conectaram ao servidor MySQL. Para cada nome de host, a tabela conta o número atual e total de conexões. O tamanho da tabela é dimensionado automaticamente no início do servidor. Para definir explicitamente o tamanho da tabela, defina a variável de sistema `performance_schema_hosts_size` no início do servidor. Para desabilitar as estatísticas do host, defina essa variável para 0.

A tabela `hosts` tem as seguintes colunas. Para uma descrição de como o Gerador de Desempenho mantém as linhas nesta tabela, incluindo o efeito de `TRUNCATE TABLE`, consulte a Seção 29.12.8, “Tabelas de Conexão do Gerador de Desempenho”.

* `HOST`

O host a partir do qual o cliente se conectou. Isso é `NULL` para um fio interno, ou para uma sessão de usuário que não conseguiu se autenticar.

* `CURRENT_CONNECTIONS`

O número atual de conexões para o host.

* `TOTAL_CONNECTIONS`

O número total de conexões para o host.

* `MAX_SESSION_CONTROLLED_MEMORY`

Relata o valor máximo de memória controlada utilizada por uma sessão pertencente ao host.

Esta coluna foi adicionada no MySQL 8.0.31.

* `MAX_SESSION_TOTAL_MEMORY`

Relata o máximo de memória utilizado por uma sessão pertencente ao host.

Esta coluna foi adicionada no MySQL 8.0.31.

A tabela `hosts` tem esses índices:

* Chave primária ativada (`HOST`)

#### 29.12.8.3 A Tabela de usuários

A tabela `users` contém uma linha para cada usuário que se conectou ao servidor MySQL. Para cada nome de usuário, a tabela conta o número atual e total de conexões. O tamanho da tabela é dimensionado automaticamente no início do servidor. Para definir o tamanho da tabela explicitamente, defina a variável de sistema `performance_schema_users_size` no início do servidor. Para desabilitar estatísticas de usuário, defina essa variável para 0.

A tabela `users` tem as seguintes colunas. Para uma descrição de como o Gerador de Desempenho mantém as linhas nesta tabela, incluindo o efeito de `TRUNCATE TABLE`, consulte a Seção 29.12.8, “Tabelas de Conexão do Gerador de Desempenho”.

* `USER`

O nome de usuário do cliente para a conexão. Este é `NULL` para um fio interno, ou para uma sessão de usuário que não conseguiu autenticar.

* `CURRENT_CONNECTIONS`

O número atual de conexões para o usuário.

* `TOTAL_CONNECTIONS`

O número total de conexões para o usuário.

* `MAX_SESSION_CONTROLLED_MEMORY`

Relata o valor máximo de memória controlada utilizada por uma sessão pertencente ao usuário.

Esta coluna foi adicionada no MySQL 8.0.31.

* `MAX_SESSION_TOTAL_MEMORY`

Relata o valor máximo de memória utilizado por uma sessão pertencente ao usuário.

Esta coluna foi adicionada no MySQL 8.0.31.

A tabela `users` tem esses índices:

* Chave primária ativada (`USER`)

### 29.12.9 Tabelas de atributos de conexão do esquema de desempenho

Os atributos de conexão são pares chave-valor que os programas de aplicação podem passar ao servidor no momento da conexão. Para aplicações baseadas na API C implementada pela biblioteca de clientes `libmysqlclient`, as funções `mysql_options()` e `mysql_options4()` definem o conjunto de atributos de conexão. Outros Conectadores MySQL podem fornecer seus próprios métodos de definição de atributos.

Essas tabelas do Schema de Desempenho exibem informações de atributos:

* `session_account_connect_attrs`: Atributos de conexão para a sessão atual e outras sessões associadas à conta da sessão

* `session_connect_attrs`: Atributos de conexão para todas as sessões

Além disso, os eventos registrados no log de auditoria podem incluir atributos de conexão. Veja a Seção 8.4.5.4, “Formatos de arquivos do log de auditoria”.

Os nomes de atributos que começam com um underscore (`_`) são reservados para uso interno e não devem ser criados por programas de aplicação. Essa convenção permite que novos atributos sejam introduzidos pelo MySQL sem colidir com atributos de aplicação, e permite que os programas de aplicação definam seus próprios atributos que não colidem com atributos internos.

* Atributos de conexão disponíveis
* Limites de atributos de conexão

#### Atributos de Conexão Disponíveis

O conjunto de atributos de conexão visíveis dentro de uma conexão dada varia de acordo com fatores como sua plataforma, o Conectador MySQL usado para estabelecer a conexão ou o programa cliente.

A biblioteca de clientes `libmysqlclient` define esses atributos:

* `_client_name`: O nome do cliente (`libmysql` para a biblioteca de clientes).

* `_client_version`: A versão da biblioteca do cliente.

* `_os`: O sistema operacional (por exemplo, `Linux`, `Win64`).

* `_pid`: O ID do processo do cliente. * `_platform`: A plataforma da máquina (por exemplo, `x86_64`).

* `_thread`: O ID do fio do cliente (apenas no Windows).

Outros Conectadores MySQL podem definir seus próprios atributos de conexão.

O MySQL Connector/C++ 8.0.16 e versões posteriores definem esses atributos para aplicações que utilizam X DevAPI ou X DevAPI para C:

* `_client_license`: A licença do conector (por exemplo, `GPL-2.0`).

* `_client_name`: O nome do conector (`mysql-connector-cpp`).

* `_client_version`: A versão do conector.
* `_os`: O sistema operacional (por exemplo, `Linux`, `Win64`).

* `_pid`: O ID do processo do cliente. * `_platform`: A plataforma da máquina (por exemplo, `x86_64`).

* `_source_host`: O nome do host da máquina na qual o cliente está sendo executado.

* `_thread`: O ID do fio do cliente (apenas no Windows).

O MySQL Connector/J define esses atributos:

* `_client_name`: Nome do cliente
* `_client_version`: Versão da biblioteca do cliente

* `_os`: O sistema operacional (por exemplo, `Linux`, `Win64`)

* `_client_license`: O tipo de licença do conector

* `_platform`: A plataforma da máquina (por exemplo, `x86_64`)

* `_runtime_vendor`: O fornecedor do ambiente de tempo de execução Java (JRE)

* `_runtime_version`: Versão do ambiente de tempo de execução Java (JRE)

O MySQL Connector/NET define esses atributos:

* `_client_version`: A versão da biblioteca do cliente.

* `_os`: O sistema operacional (por exemplo, `Linux`, `Win64`).

* `_pid`: O ID do processo do cliente. * `_platform`: A plataforma da máquina (por exemplo, `x86_64`).

* `_program_name`: O nome do cliente.  
* `_thread`: O ID do fio do cliente (apenas no Windows).

A implementação do Connector/Python 8.0.17 e superior define esses atributos; alguns valores e atributos dependem da implementação do Connector/Python (python puro ou c-ext):

* `_client_license`: O tipo de licença do conector; `GPL-2.0` ou `Commercial`. (apenas para Python puro)

* `_client_name`: Definido para `mysql-connector-python` (python puro) ou `libmysql` (c-ext)

* `_client_version`: A versão do conector (python puro) ou a versão da biblioteca mysqlclient (c-ext).

* `_os`: O sistema operacional com o conector (por exemplo, `Linux`, `Win64`).

* `_pid`: O identificador do processo na máquina de origem (por exemplo, `26955`)

* `_platform`: A plataforma da máquina (por exemplo, `x86_64`).

* `_source_host`: O nome do host da máquina na qual o conector está se conectando.

* `_connector_version`: A versão do conector (por exemplo, `8.0.44`) (apenas c-ext).

* `_connector_license`: O tipo de licença do conector; `GPL-2.0` ou `Commercial` (apenas c-ext).

* `_connector_name`: Sempre definido para `mysql-connector-python` (apenas c-ext).

O PHP define atributos que dependem de como ele foi compilado:

* Compilado usando `libmysqlclient`: Os atributos padrão `libmysqlclient` descritos anteriormente.

* Compilado usando `mysqlnd`: Apenas o atributo `_client_name`, com um valor de `mysqlnd`.

Muitos programas clientes do MySQL definem um atributo `program_name` com um valor igual ao nome do cliente. Por exemplo, **mysqladmin** e **mysqldump** definem `program_name` como `mysqladmin` e `mysqldump`, respectivamente. O MySQL Shell define `program_name` como `mysqlsh`.

Alguns programas clientes do MySQL definem atributos adicionais:

* **mysql** (a partir da versão 8.0.17 do MySQL):

+ `os_user`: O nome do usuário do sistema operacional que está executando o programa. Disponível em sistemas Unix e Unix-like e Windows.

+ `os_sudouser`: O valor da variável de ambiente `SUDO_USER`. Disponível em sistemas Unix e similares.

Os atributos de conexão **mysql** para os quais o valor está vazio não são enviados.

* **mysqlbinlog**:

+ `_client_role`: `binary_log_listener`

* Conexões de réplica:

+ `program_name`: `mysqld`

+ `_client_role`: `binary_log_listener`

+ `_client_replication_channel_name`: O nome do canal.

* `FEDERATED` conexões do motor de armazenamento:

+ `program_name`: `mysqld`

+ `_client_role`: `federated_storage`

#### Limites de atributos de conexão

Há limites para a quantidade de dados do atributo de conexão transmitidos do cliente para o servidor:

* Um limite fixo imposto pelo cliente antes do horário de conexão. * Um limite fixo imposto pelo servidor no horário de conexão. * Um limite configurável imposto pelo Schema de Desempenho no horário de conexão.

Para conexões iniciadas usando a API C, a biblioteca `libmysqlclient` impõe um limite de 64 KB no tamanho agregado dos dados do atributo de conexão no lado do cliente: Chamadas a `mysql_options()` que causem o excedente desse limite produzem um erro [[`CR_INVALID_PARAMETER_NO`]. Outros Conectadores MySQL podem impor seus próprios limites no lado do cliente sobre o quanto os dados do atributo de conexão podem ser transmitidos ao servidor.

No lado do servidor, essas verificações de tamanho nos dados do atributo de conexão ocorrem:

* O servidor impõe um limite de 64 KB ao tamanho agregado dos dados do atributo de conexão que aceita. Se um cliente tentar enviar mais de 64 KB de dados do atributo, o servidor rejeita a conexão. Caso contrário, o servidor considera o buffer do atributo válido e registra o tamanho do buffer mais longo nesse `Performance_schema_session_connect_attrs_longest_seen` variável de status.

* Para conexões aceitas, o Schema de Desempenho verifica o tamanho do atributo agregado contra o valor da variável de sistema `performance_schema_session_connect_attrs_size`. Se o tamanho do atributo exceder esse valor, essas ações ocorrem:

+ O Schema de Desempenho trunca os dados do atributo e incrementa a variável de status `Performance_schema_session_connect_attrs_lost`, que indica o número de conexões para as quais ocorreu a truncagem do atributo.

+ O Schema de Desempenho escreve uma mensagem no log de erro se a variável de sistema `log_error_verbosity` for maior que 1:

    ```
    Connection attributes of length N were truncated
    (N bytes lost)
    for connection N, user user_name@host_name
    (as user_name), auth: {yes|no}
    ```

As informações da mensagem de alerta são destinadas a ajudar os administradores de banco de dados a identificar clientes para os quais ocorreu a redução de atributos.

+ Um atributo `_truncated` é adicionado aos atributos de sessão com um valor que indica quantos bytes foram perdidos, se o buffer do atributo tiver espaço suficiente. Isso permite que o Gerador de Desempenho exiba informações de truncação por conexão nas tabelas de atributos de conexão. Essas informações podem ser examinadas sem precisar verificar o log de erro.

#### 29.12.9.1 Tabela session_account_connect_attrs

Os programas de aplicação podem fornecer atributos de conexão de chave-valor que devem ser passados ao servidor no momento da conexão. Para descrições de atributos comuns, consulte a Seção 29.12.9, “Tabelas de atributos de conexão do Schema de desempenho”.

A tabela `session_account_connect_attrs` contém atributos de conexão apenas para a sessão atual e outras sessões associadas à conta da sessão. Para ver os atributos de conexão para todas as sessões, use a tabela `session_connect_attrs`.

A tabela `session_account_connect_attrs` tem essas colunas:

* `PROCESSLIST_ID`

O identificador de conexão para a sessão.

* `ATTR_NAME`

O nome do atributo.

* `ATTR_VALUE`

O valor do atributo.

* `ORDINAL_POSITION`

A ordem na qual o atributo foi adicionado ao conjunto de atributos de conexão.

A tabela `session_account_connect_attrs` tem esses índices:

* Chave primária em (`PROCESSLIST_ID`, `ATTR_NAME`)

`TRUNCATE TABLE` não é permitido para a tabela `session_account_connect_attrs`.

#### 29.12.9.2 Tabela session_connect_attrs

Os programas de aplicação podem fornecer atributos de conexão de chave-valor que devem ser passados ao servidor no momento da conexão. Para descrições de atributos comuns, consulte a Seção 29.12.9, “Tabelas de atributos de conexão do Schema de desempenho”.

A tabela `session_connect_attrs` contém atributos de conexão para todas as sessões. Para ver os atributos de conexão apenas para a sessão atual e outras sessões associadas à conta da sessão, use a tabela `session_account_connect_attrs`.

A tabela `session_connect_attrs` tem essas colunas:

* `PROCESSLIST_ID`

O identificador de conexão para a sessão.

* `ATTR_NAME`

O nome do atributo.

* `ATTR_VALUE`

O valor do atributo.

* `ORDINAL_POSITION`

A ordem na qual o atributo foi adicionado ao conjunto de atributos de conexão.

A tabela `session_connect_attrs` tem esses índices:

* Chave primária em (`PROCESSLIST_ID`, `ATTR_NAME`)

`TRUNCATE TABLE` não é permitido para a tabela `session_connect_attrs`.

### 29.12.10 Tabelas de variáveis definidas pelo usuário do esquema de desempenho

O Schema de Desempenho fornece uma tabela `user_variables_by_thread` que expõe variáveis definidas pelo usuário. Estas são variáveis definidas dentro de uma sessão específica e incluem um caractere `@` antes do nome; veja a Seção 11.4, “Variáveis Definidas pelo Usuário”.

A tabela `user_variables_by_thread` tem essas colunas:

* `THREAD_ID`

O identificador do fio da sessão na qual a variável é definida.

* `VARIABLE_NAME`

O nome da variável, sem o caractere inicial `@`.

* `VARIABLE_VALUE`

O valor variável.

A tabela `user_variables_by_thread` tem esses índices:

* Chave primária em (`THREAD_ID`, `VARIABLE_NAME`)

`TRUNCATE TABLE` não é permitido para a tabela `user_variables_by_thread`.

### 29.12.11 Tabelas de Replicação do Schema de Desempenho

O Schema de Desempenho fornece tabelas que exibem informações de replicação. Isso é semelhante às informações disponíveis na declaração `SHOW REPLICA STATUS` (show-replica-status.html "15.7.7.35 SHOW REPLICA STATUS Statement"), mas a representação em formato de tabela é mais acessível e oferece benefícios de usabilidade:

* A saída `SHOW REPLICA STATUS`(show-replica-status.html "15.7.7.35 SHOW REPLICA STATUS Statement") é útil para inspeção visual, mas não tanto para uso programático. Em contraste, ao usar as tabelas do Schema de Desempenho, as informações sobre o status da replicação podem ser pesquisadas usando consultas gerais `SELECT`, incluindo condições complexas `WHERE`, junções, etc.

* Os resultados das consultas podem ser salvos em tabelas para análise adicional, ou atribuídos a variáveis e, assim, utilizados em procedimentos armazenados.

* As tabelas de replicação fornecem informações de diagnóstico melhores. Para operação de replicação multithread, `SHOW REPLICA STATUS` (show-replica-status.html "15.7.7.35 SHOW REPLICA STATUS Statement") relata todos os erros de thread do coordenador e do trabalhador usando os campos `Last_SQL_Errno` e `Last_SQL_Error`, então apenas o mais recente desses erros é visível e informações podem ser perdidas. As tabelas de replicação armazenam erros em uma base por thread sem perda de informações.

* A última transação vista é visível nas tabelas de replicação por trabalhador. Essa é uma informação que não está disponível em `SHOW REPLICA STATUS` (show-replica-status.html "15.7.7.35 SHOW REPLICA STATUS Statement").

* Os desenvolvedores familiarizados com a interface do Schema de Desempenho podem estender as tabelas de replicação para fornecer informações adicionais, adicionando linhas às tabelas.

#### Descrições das tabelas de replicação

O Schema de Desempenho fornece as seguintes tabelas relacionadas à replicação:

* Tabelas que contêm informações sobre a conexão da réplica com a fonte:

+ `replication_connection_configuration`: Parâmetros de configuração para conectar-se à fonte

+ `replication_connection_status`: Status atual da conexão com a fonte

+ `replication_asynchronous_connection_failover`: Listas de fontes para o mecanismo de falha de sobrevivência de conexão assíncrona

*Tabelas que contêm informações gerais (não específicas para o fórum) sobre o aplicativo de aplicação de transações:

+ `replication_applier_configuration`: Parâmetros de configuração para o aplicativo de aplicação de transação na replica.

+ `replication_applier_status`: Status atual do aplicativo de aplicação de transação na replica.

*Tabelas que contêm informações sobre os threads específicos responsáveis pela aplicação de transações recebidas da fonte:

+ `replication_applier_status_by_coordinator`: Status do fio do coordenador (vazio, a menos que a replica seja multithread).

+ `replication_applier_status_by_worker`: Status do fio de aplicação ou dos fios de trabalho, se a replica for multithread.

* Tabelas que contêm informações sobre filtros de replicação baseados em canal:

+ `replication_applier_filters`: Fornece informações sobre os filtros de replicação configurados em canais de replicação específicos.

+ `replication_applier_global_filters`: Fornece informações sobre filtros de replicação global, que se aplicam a todos os canais de replicação.

* Tabelas que contêm informações sobre membros da Replicação de Grupo:

+ `replication_group_members`: Fornece informações de rede e status para os membros do grupo.

+ `replication_group_member_stats`: Fornece informações estatísticas sobre os membros do grupo e as transações nas quais eles participam.

Para mais informações, consulte a Seção 20.4, “Replicação do Grupo de Monitoramento”.

As seguintes tabelas de replicação do Schema de Desempenho continuam a ser preenchidas quando o Schema de Desempenho é desativado:

* `replication_connection_configuration`
* `replication_connection_status`
* `replication_asynchronous_connection_failover`
* `replication_applier_configuration`
* `replication_applier_status`
* `replication_applier_status_by_coordinator`
* `replication_applier_status_by_worker`

A exceção é a informação de sincronização local (horários de início e término das transações) nas tabelas de replicação `replication_connection_status`, `replication_applier_status_by_coordinator` e `replication_applier_status_by_worker`. Essa informação não é coletada quando o Gerador de Sinais de Desempenho está desativado.

As seções a seguir descrevem cada tabela de replicação com mais detalhes, incluindo a correspondência entre as colunas produzidas por `SHOW REPLICA STATUS` e as colunas da tabela de replicação na qual as mesmas informações aparecem.

O restante desta introdução sobre as tabelas de replicação descreve como o Schema de Desempenho as preenche e quais campos do `SHOW REPLICA STATUS` não são representados nas tabelas.

#### Ciclo de Vida da Tabela de Replicação

O Schema de Desempenho preenche as tabelas de replicação da seguinte forma:

* Antes da execução de `CHANGE REPLICATION SOURCE TO`(change-replication-source-to.html "15.4.2.3 CHANGE REPLICATION SOURCE TO Statement") | `CHANGE MASTER TO`, as tabelas estão vazias.

* Após `CHANGE REPLICATION SOURCE TO`(change-replication-source-to.html "15.4.2.3 CHANGE REPLICATION SOURCE TO Statement") | `CHANGE MASTER TO`(change-master-to.html "15.4.2.1 CHANGE MASTER TO Statement"), os parâmetros de configuração podem ser vistos nas tabelas. Neste momento, não há threads de replicação ativas, portanto, as colunas `THREAD_ID` são `NULL` e as colunas `SERVICE_STATE` têm um valor de `OFF`.

* Após `START REPLICA`(start-replica.html "15.4.2.6 START REPLICA Statement") (ou antes do MySQL 8.0.22, `START SLAVE`(start-slave.html "15.4.2.7 START SLAVE Statement")), os valores não `NULL``THREAD_ID` podem ser vistos. Os threads que estão ociosos ou ativos têm um valor de `SERVICE_STATE``ON`. O thread que se conecta à fonte tem um valor de `CONNECTING` enquanto está estabelecendo a conexão, e `ON` posteriormente, enquanto a conexão durar.

* Após `STOP REPLICA`(stop-replica.html "15.4.2.8 STOP REPLICA Statement"), as colunas `THREAD_ID` se tornam `NULL` e as colunas `SERVICE_STATE` para os fios que não existem mais têm um valor de `OFF`.

* As tabelas são preservadas após `STOP REPLICA`(stop-replica.html "15.4.2.8 STOP REPLICA Statement") ou quando os fios param devido a um erro.

* A tabela `replication_applier_status_by_worker` não está vazia apenas quando a replica está operando no modo multithread. Ou seja, se a variável de sistema `replica_parallel_workers` ou `slave_parallel_workers` for maior que 0, esta tabela é preenchida quando `START REPLICA` é executado, e o número de linhas mostra o número de trabalhadores.

#### Informações de status de replicação não estão nas tabelas de replicação

As informações nas tabelas de replicação do Schema de Desempenho diferem um pouco das informações disponíveis em `SHOW REPLICA STATUS`](show-replica-status.html "15.7.7.35 SHOW REPLICA STATUS Statement") porque as tabelas são orientadas para o uso de identificadores de transação global (GTIDs), não de nomes e posições de arquivos, e elas representam valores de UUID do servidor, não de valores de ID do servidor. Devido a essas diferenças, várias colunas em `SHOW REPLICA STATUS`](show-replica-status.html "15.7.7.35 SHOW REPLICA STATUS Statement") não são preservadas nas tabelas de replicação do Schema de Desempenho, ou são representadas de uma maneira diferente:

* Os campos a seguir se referem a nomes de arquivos e posições e não são preservados:

  ```
  Master_Log_File
  Read_Master_Log_Pos
  Relay_Log_File
  Relay_Log_Pos
  Relay_Master_Log_File
  Exec_Master_Log_Pos
  Until_Condition
  Until_Log_File
  Until_Log_Pos
  ```

* O campo `Master_Info_File` não é preservado. Ele se refere ao arquivo `master.info`, usado para o repositório de metadados da fonte da réplica, que foi substituído pelo uso de tabelas seguras em caso de falha para o repositório.

* Os campos a seguir são baseados em `server_id`, não em `server_uuid`, e não são preservados:

  ```
  Master_Server_Id
  Replicate_Ignore_Server_Ids
  ```

* O campo `Skip_Counter` é baseado em contagem de eventos, não em GTIDs, e não é preservado.

* Esses campos de erro são sinônimos de `Last_SQL_Errno` e `Last_SQL_Error`, portanto, não são preservados:

  ```
  Last_Errno
  Last_Error
  ```

No Schema de Desempenho, essas informações de erro estão disponíveis nas colunas `LAST_ERROR_NUMBER` e `LAST_ERROR_MESSAGE` da tabela `replication_applier_status_by_worker` (e `replication_applier_status_by_coordinator` se a replica for multithread). Essas tabelas fornecem informações de erro mais específicas por thread do que as disponíveis em `Last_Errno` e `Last_Error`.

* Os campos que fornecem informações sobre as opções de filtragem de linha de comando não são preservados:

  ```
  Replicate_Do_DB
  Replicate_Ignore_DB
  Replicate_Do_Table
  Replicate_Ignore_Table
  Replicate_Wild_Do_Table
  Replicate_Wild_Ignore_Table
  ```

* Os campos `Replica_IO_State` e `Replica_SQL_Running_State` não são preservados. Se necessário, esses valores podem ser obtidos da lista de processos usando a coluna `THREAD_ID` da tabela de replicação apropriada e combinando-a com a coluna `ID` na tabela `INFORMATION_SCHEMA` `PROCESSLIST` para selecionar a coluna `STATE` da última tabela.

* O campo `Executed_Gtid_Set` pode mostrar um grande conjunto com uma grande quantidade de texto. Em vez disso, as tabelas do Schema de Desempenho mostram GTIDs de transações que estão atualmente sendo aplicadas pela replica. Alternativamente, o conjunto de GTIDs executados pode ser obtido pelo valor da variável de sistema `gtid_executed`.

* Os campos `Seconds_Behind_Master` e `Relay_Log_Space` estão em status a ser decidido e não são preservados.

#### Canais de Replicação

A primeira coluna das tabelas do Schema de desempenho de replicação é `CHANNEL_NAME`. Isso permite que as tabelas sejam visualizadas por canal de replicação. Em uma configuração de replicação não multifonte, há um único canal de replicação padrão. Quando você está usando vários canais de replicação em uma réplica, você pode filtrar as tabelas por canal de replicação para monitorar um canal de replicação específico. Consulte a Seção 19.2.2, “Canais de replicação”, e a Seção 19.1.5.8, “Monitoramento de replicação multifonte”, para obter mais informações.

#### 29.12.11.1 A tabela binary_log_transaction_compression_stats

Esta tabela mostra informações estatísticas para cargas de trabalho de transações escritas no log binário e no log de retransmissão, e pode ser usada para calcular os efeitos da ativação da compressão de transações de log binário. Para informações sobre compressão de transações de log binário, consulte a Seção 7.4.4.5, “Compressão de Transações de Log Binário”.

A tabela `binary_log_transaction_compression_stats` é preenchida apenas quando a instância do servidor tem um log binário e a variável de sistema `binlog_transaction_compression` está definida como `ON`. As estatísticas cobrem todas as transações escritas no log binário e no log de releio desde o momento em que o servidor foi iniciado ou a tabela foi truncada. As transações comprimidas são agrupadas pelo algoritmo de compressão utilizado, e as transações não comprimidas são agrupadas juntamente com o algoritmo de compressão indicado como `NONE`, para que o índice de compressão possa ser calculado.

A tabela `binary_log_transaction_compression_stats` tem essas colunas:

* `LOG_TYPE`

Se essas transações foram escritas no log binário ou no log de retransmissão.

* `COMPRESSION_TYPE`

O algoritmo de compressão utilizado para comprimir os payloads das transações. `NONE` significa que os payloads dessas transações não foram comprimidos, o que é correto em várias situações (ver Seção 7.4.4.5, "Compressão de Transações de Registro Binário").

* `TRANSACTION_COUNTER`

O número de transações escritas neste tipo de log com este tipo de compressão.

* `COMPRESSED_BYTES`

O número total de bytes que foram comprimidos e, em seguida, escritos neste tipo de registro com este tipo de compressão, contado após a compressão.

* `UNCOMPRESSED_BYTES`

O número total de bytes antes da compressão para este tipo de log e este tipo de compressão.

* `COMPRESSION_PERCENTAGE`

A relação de compressão para este tipo de registro e este tipo de compressão, expressa em porcentagem.

* `FIRST_TRANSACTION_ID`

O ID da primeira transação que foi escrita nesse tipo de registro com esse tipo de compressão.

* `FIRST_TRANSACTION_COMPRESSED_BYTES`

O número total de bytes que foram comprimidos e, em seguida, escritos no log para a primeira transação, contado após a compressão.

* `FIRST_TRANSACTION_UNCOMPRESSED_BYTES`

O número total de bytes antes da compressão para a primeira transação.

* `FIRST_TRANSACTION_TIMESTAMP`

O horário em que a primeira transação foi registrada no log.

* `LAST_TRANSACTION_ID`

O ID da transação mais recente que foi escrita nesse tipo de registro com esse tipo de compressão.

* `LAST_TRANSACTION_COMPRESSED_BYTES`

O número total de bytes que foram comprimidos e, em seguida, escritos no log para a transação mais recente, contado após a compressão.

* `LAST_TRANSACTION_UNCOMPRESSED_BYTES`

O número total de bytes antes da compressão para a transação mais recente.

* `LAST_TRANSACTION_TIMESTAMP`

O horário em que a transação mais recente foi registrada no log.

A tabela `binary_log_transaction_compression_stats` não tem índices.

`TRUNCATE TABLE` é permitido para a tabela `binary_log_transaction_compression_stats`.

#### 29.12.11.2 A tabela replication_applier_configuration

Esta tabela mostra os parâmetros de configuração que afetam as transações aplicadas pela replica. Os parâmetros armazenados na tabela podem ser alterados em tempo real com a declaração `CHANGE REPLICATION SOURCE TO` (a partir do MySQL 8.0.23) ou a declaração `CHANGE MASTER TO` (change-master-to.html "15.4.2.1 CHANGE MASTER TO Statement") (antes do MySQL 8.0.23).

A tabela `replication_applier_configuration` tem essas colunas:

* `CHANNEL_NAME`

O canal de replicação que esta linha está exibindo. Sempre há um canal de replicação padrão, e mais canais de replicação podem ser adicionados. Consulte a Seção 19.2.2, “Canais de replicação”, para obter mais informações.

* `DESIRED_DELAY`

O número de segundos que a réplica deve ficar em atraso em relação à fonte. (Opção `CHANGE REPLICATION SOURCE TO`: `SOURCE_DELAY`, Opção `CHANGE MASTER TO`: `MASTER_DELAY`) Consulte a Seção 19.4.11, “Replicação Atropelada”, para obter mais informações.

* `PRIVILEGE_CHECKS_USER`

A conta de usuário que fornece o contexto de segurança para o canal (opção `CHANGE REPLICATION SOURCE TO`: `PRIVILEGE_CHECKS_USER`, opção `CHANGE MASTER TO`: `PRIVILEGE_CHECKS_USER`). Isso é escapado para que possa ser copiado em uma declaração SQL para executar transações individuais. Consulte a Seção 19.3.3, “Verificação de Privilégios de Replicação” para mais informações.

* `REQUIRE_ROW_FORMAT`

Se o canal aceita apenas eventos baseados em linha (opção `CHANGE REPLICATION SOURCE TO`: `REQUIRE_ROW_FORMAT`, opção `CHANGE MASTER TO`: `REQUIRE_ROW_FORMAT`). Consulte a Seção 19.3.3, “Verificações de Privilégio de Replicação” para mais informações.

* `REQUIRE_TABLE_PRIMARY_KEY_CHECK`

Se o canal exige chaves primárias sempre, nunca ou de acordo com a configuração da fonte (opção `CHANGE REPLICATION SOURCE TO`: `REQUIRE_TABLE_PRIMARY_KEY_CHECK`, opção `CHANGE MASTER TO`: `REQUIRE_TABLE_PRIMARY_KEY_CHECK`). Consulte a Seção 19.3.3, “Verificação de privilégios de replicação” para mais informações.

* `ASSIGN_GTIDS_TO_ANONYMOUS_TRANSACTIONS_TYPE`

Se o canal atribuir um GTID a transações replicadas que não possuem um já (opção `CHANGE REPLICATION SOURCE TO`: `ASSIGN_GTIDS_TO_ANONYMOUS_TRANSACTIONS`, opção `CHANGE MASTER TO`: `ASSIGN_GTIDS_TO_ANONYMOUS_TRANSACTIONS`). `OFF` significa que não são atribuídos GTIDs. `LOCAL` significa que é atribuído um GTID que inclui o próprio UUID da replica (a configuração `server_uuid`). `UUID` significa que é atribuído um GTID que inclui um UUID definido manualmente. Consulte a Seção 19.1.3.6, “Replicação a partir de uma fonte sem GTIDs para uma réplica com GTIDs”, para obter mais informações.

* `ASSIGN_GTIDS_TO_ANONYMOUS_TRANSACTIONS_VALUE`

O UUID que é usado como parte dos GTIDs atribuídos a transações anônimas (opção `CHANGE REPLICATION SOURCE TO`: `ASSIGN_GTIDS_TO_ANONYMOUS_TRANSACTIONS`, opção `CHANGE MASTER TO`: `ASSIGN_GTIDS_TO_ANONYMOUS_TRANSACTIONS`). Consulte a Seção 19.1.3.6, “Replicação a partir de uma fonte sem GTIDs para uma réplica com GTIDs”, para obter mais informações.

A tabela `replication_applier_configuration` tem esses índices:

* Chave primária ativada (`CHANNEL_NAME`)

`TRUNCATE TABLE` não é permitido para a tabela `replication_applier_configuration`.

A tabela a seguir mostra a correspondência entre as colunas `replication_applier_configuration` e as colunas [`SHOW REPLICA STATUS`](show-replica-status.html "15.7.7.35 SHOW REPLICA STATUS Statement").

<table summary="Correspondence between replication_applier_configuration columns and SHOW REPLICA STATUS columns"><col style="width: 60%"/><col style="width: 40%"/><thead><tr> <th><code>replication_applier_configuration</code> Column</th> <th><code>SHOW REPLICA STATUS</code>Coluna</th> </tr></thead><tbody><tr> <td><code>DESIRED_DELAY</code></td> <td><code>SQL_Delay</code></td> </tr></tbody></table>

#### 29.12.11.3 A tabela replication_applier_status

Esta tabela mostra o status atual da execução de transações gerais na replica. A tabela fornece informações sobre aspectos gerais do status do aplicador de transações que não são específicos a qualquer fio envolvido. Informações de status específicas para cada fio estão disponíveis na tabela `replication_applier_status_by_coordinator` (e `replication_applier_status_by_worker` se a replica for multifilamentar).

A tabela `replication_applier_status` tem essas colunas:

* `CHANNEL_NAME`

O canal de replicação que esta linha está exibindo. Sempre há um canal de replicação padrão, e mais canais de replicação podem ser adicionados. Consulte a Seção 19.2.2, “Canais de replicação”, para obter mais informações.

* `SERVICE_STATE`

Mostra `ON` quando as threads do aplicador do canal de replicação estão ativas ou em repouso, `OFF` significa que as threads do aplicador não estão ativas.

* `REMAINING_DELAY`

Se a replica estiver esperando que `DESIRED_DELAY` segundos passem desde que a fonte aplicou uma transação, este campo contém o número de segundos de atraso restantes. Em outros momentos, este campo é `NULL`. (O valor `DESIRED_DELAY` é armazenado na tabela `replication_applier_configuration`. Consulte a Seção 19.4.11, “Replicação Atrasada”, para obter mais informações.

* `COUNT_TRANSACTIONS_RETRIES`

Mostra o número de tentativas que foram feitas porque o thread de replicação SQL não conseguiu aplicar uma transação. O número máximo de tentativas para uma transação específica é definido pela variável do sistema `replica_transaction_retries` e `slave_transaction_retries`. A tabela `replication_applier_status_by_worker` mostra informações detalhadas sobre as tentativas de transação para uma replica de um único ou vários threads.

A tabela `replication_applier_status` tem esses índices:

* Chave primária ativada (`CHANNEL_NAME`)

`TRUNCATE TABLE` não é permitido para a tabela `replication_applier_status`.

A tabela a seguir mostra a correspondência entre as colunas `replication_applier_status` e as colunas [`SHOW REPLICA STATUS`](show-replica-status.html "15.7.7.35 SHOW REPLICA STATUS Statement").

<table summary="Correspondence between replication_applier_status columns and SHOW REPLICA STATUS columns"><col style="width: 60%"/><col style="width: 40%"/><thead><tr> <th><code>replication_applier_status</code> Column</th> <th><code>SHOW REPLICA STATUS</code> Column</th> </tr></thead><tbody><tr> <td><code>SERVICE_STATE</code></td> <td>None</td> </tr><tr> <td><code>REMAINING_DELAY</code></td> <td><code>SQL_Remaining_Delay</code></td> </tr></tbody></table>

#### 29.12.11.4 A tabela replication_applier_status_by_coordinator

Para uma replica multithread, a replica utiliza vários threads de trabalho e um thread de coordenador para gerenciá-los, e esta tabela mostra o status do thread de coordenador. Para uma replica de único thread, esta tabela está vazia. Para uma replica multithread, a tabela `replication_applier_status_by_worker` mostra o status dos threads de trabalho. Esta tabela fornece informações sobre a última transação que foi armazenada pelo thread de coordenador em uma fila de trabalho, bem como a transação que está atualmente armazenando. O timestamp de início refere-se ao momento em que este thread leu o primeiro evento da transação do log de relevo para armazená-lo em uma fila de trabalho, enquanto o timestamp de fim refere-se ao momento em que o último evento terminou de armazenar na fila de trabalho.

A tabela `replication_applier_status_by_coordinator` tem essas colunas:

* `CHANNEL_NAME`

O canal de replicação que esta linha está exibindo. Sempre há um canal de replicação padrão, e mais canais de replicação podem ser adicionados. Consulte a Seção 19.2.2, “Canais de replicação”, para obter mais informações.

* `THREAD_ID`

O ID do fio do SQL/coordenador.

* `SERVICE_STATE`

`ON` (o fio existe e está ativo ou em repouso) ou `OFF` (o fio não existe mais).

* `LAST_ERROR_NUMBER`, `LAST_ERROR_MESSAGE`

O número do erro e a mensagem de erro do erro mais recente que causou o término do thread do SQL/coordenador. Um número de erro de 0 e uma mensagem que é uma string vazia significa “sem erro”. Se o valor `LAST_ERROR_MESSAGE` não estiver vazio, os valores dos erros também aparecem no log de erro da replica.

A emissão de `RESET MASTER` ou `RESET REPLICA`(reset-replica.html "15.4.2.4 RESET REPLICA Statement") redefinirá os valores exibidos nessas colunas.

Todos os códigos e mensagens de erro exibidos nas colunas `LAST_ERROR_NUMBER` e `LAST_ERROR_MESSAGE` correspondem aos valores de erro listados na Referência de Mensagem de Erro do Servidor.

* `LAST_ERROR_TIMESTAMP`

Um marcador de tempo no formato `'YYYY-MM-DD hh:mm:ss[.fraction]'` que mostra quando ocorreu o erro mais recente do SQL/coordenador.

* `LAST_PROCESSED_TRANSACTION`

O ID global de transação (GTID) da última transação processada por este coordenador.

* `LAST_PROCESSED_TRANSACTION_ORIGINAL_COMMIT_TIMESTAMP`

Um marcador de tempo no formato `'YYYY-MM-DD hh:mm:ss[.fraction]'` que mostra quando a última transação processada por este coordenador foi comprometida na fonte original.

* `LAST_PROCESSED_TRANSACTION_IMMEDIATE_COMMIT_TIMESTAMP`

Um marcador de tempo no formato `'YYYY-MM-DD hh:mm:ss[.fraction]'` que indica quando a última transação processada por este coordenador foi comprometida na fonte imediata.

* `LAST_PROCESSED_TRANSACTION_START_BUFFER_TIMESTAMP`

Um marcador de tempo no formato `'YYYY-MM-DD hh:mm:ss[.fraction]'` que mostra quando este fio de coordenador começou a escrever a última transação no buffer de um fio de trabalhador.

* `LAST_PROCESSED_TRANSACTION_END_BUFFER_TIMESTAMP`

Um marcador de tempo no formato `'YYYY-MM-DD hh:mm:ss[.fraction]'` que mostra quando a última transação foi escrita no buffer de um thread de trabalhador por este thread do coordenador.

* `PROCESSING_TRANSACTION`

O ID global de transação (GTID) da transação que este fio de coordenador está atualmente processando.

* `PROCESSING_TRANSACTION_ORIGINAL_COMMIT_TIMESTAMP`

Um marcador de tempo no formato `'YYYY-MM-DD hh:mm:ss[.fraction]'` que mostra quando a transação atualmente processada foi comprometida na fonte original.

* `PROCESSING_TRANSACTION_IMMEDIATE_COMMIT_TIMESTAMP`

Um marcador de tempo no formato `'YYYY-MM-DD hh:mm:ss[.fraction]'` que mostra quando a transação atualmente processada foi comprometida na fonte imediata.

* `PROCESSING_TRANSACTION_START_BUFFER_TIMESTAMP`

Um marcador de tempo no formato `'YYYY-MM-DD hh:mm:ss[.fraction]'` que mostra quando este fio de coordenador começou a escrever a transação atualmente processada no buffer de um fio de trabalhador.

Quando o Schema de desempenho é desativado, as informações de temporização locais não são coletadas, portanto, os campos que mostram os timestamps de início e fim para transações em buffer são zero.

A tabela `replication_applier_status_by_coordinator` tem esses índices:

* Chave primária em (`CHANNEL_NAME`)
* Índice em (`THREAD_ID`)

A tabela a seguir mostra a correspondência entre as colunas `replication_applier_status_by_coordinator` e as colunas [`SHOW REPLICA STATUS`](show-replica-status.html "15.7.7.35 SHOW REPLICA STATUS Statement").

<table summary="Correspondence between replication_applier_status_by_coordinator columns and SHOW SLAVE STATUS columns"><col style="width: 60%"/><col style="width: 40%"/><thead><tr> <th><code>replication_applier_status_by_coordinator</code> Column</th> <th><code>SHOW REPLICA STATUS</code> Column</th> </tr></thead><tbody><tr> <td><code>THREAD_ID</code></td> <td>None</td> </tr><tr> <td><code>SERVICE_STATE</code></td> <td><code>Replica_SQL_Running</code></td> </tr><tr> <td><code>LAST_ERROR_NUMBER</code></td> <td><code>Last_SQL_Errno</code></td> </tr><tr> <td><code>LAST_ERROR_MESSAGE</code></td> <td><code>Last_SQL_Error</code></td> </tr><tr> <td><code>LAST_ERROR_TIMESTAMP</code></td> <td><code>Last_SQL_Error_Timestamp</code></td> </tr></tbody></table>

#### 29.12.11.5 A tabela replication_applier_status_by_worker

Esta tabela fornece detalhes das transações manipuladas por threads do aplicativo em um membro do grupo de replicação ou de grupo de replicação por grupo. Para uma replica de único fio, os dados são mostrados para o único fio do aplicativo da replica. Para uma replica multifilamentar, os dados são mostrados individualmente para cada fio do aplicativo. Os fios do aplicativo em uma replica multifilamentar são às vezes chamados de trabalhadores. O número de fios do aplicativo em um membro de replicação ou de grupo de replicação por grupo é definido pela variável de sistema `replica_parallel_workers` ou `slave_parallel_workers`, que é definida como zero para uma replica de único fio. Uma replica multifilamentar também tem um fio coordenador para gerenciar os fios do aplicativo, e o status deste fio é mostrado na tabela `replication_applier_status_by_coordinator`.

Todos os códigos e mensagens de erro exibidos nas colunas relacionadas a erros correspondem aos valores de erro listados na Referência de Mensagem de Erro do Servidor.

Quando o Schema de desempenho é desativado, as informações de temporização locais não são coletadas, portanto, os campos que mostram os timestamps de início e fim para as transações aplicadas são zero. Os timestamps de início nesta tabela referem-se ao momento em que o trabalhador começou a aplicar o primeiro evento, e os timestamps de fim referem-se ao momento em que o último evento da transação foi aplicado.

Quando uma réplica é reiniciada por uma declaração `START REPLICA`(start-replica.html "15.4.2.6 START REPLICA Statement"), as colunas que começam em `APPLYING_TRANSACTION` são redefinidas. Antes do MySQL 8.0.13, essas colunas não eram redefinidas em uma réplica que estava operando no modo de único fluxo, apenas em uma réplica multithread.

A tabela `replication_applier_status_by_worker` tem essas colunas:

* `CHANNEL_NAME`

O canal de replicação que esta linha está exibindo. Sempre há um canal de replicação padrão, e mais canais de replicação podem ser adicionados. Consulte a Seção 19.2.2, “Canais de replicação”, para obter mais informações.

* `WORKER_ID`

O identificador do trabalhador (mesmo valor que a coluna `id` na tabela `mysql.slave_worker_info`). Após [`STOP REPLICA`(stop-replica.html "15.4.2.8 STOP REPLICA Statement"), a coluna `THREAD_ID` se torna `NULL`, mas o valor `WORKER_ID` é preservado.

* `THREAD_ID`

O ID do fio do trabalhador.

* `SERVICE_STATE`

`ON` (o fio existe e está ativo ou em repouso) ou `OFF` (o fio não existe mais).

* `LAST_ERROR_NUMBER`, `LAST_ERROR_MESSAGE`

O número do erro e a mensagem de erro do erro mais recente que fez o fio do trabalhador parar. Um número de erro de 0 e uma mensagem de string vazia significam “sem erro”. Se o valor `LAST_ERROR_MESSAGE` não estiver vazio, os valores de erro também aparecem no log de erro da replica.

A emissão de `RESET MASTER` ou `RESET REPLICA`(reset-replica.html "15.4.2.4 RESET REPLICA Statement") redefinirá os valores exibidos nessas colunas.

* `LAST_ERROR_TIMESTAMP`

Um marcador de tempo no formato `'YYYY-MM-DD hh:mm:ss[.fraction]'` que mostra quando ocorreu o erro mais recente do trabalhador.

* `LAST_APPLIED_TRANSACTION`

O ID global de transação (GTID) da última transação aplicada por este trabalhador.

* `LAST_APPLIED_TRANSACTION_ORIGINAL_COMMIT_TIMESTAMP`

Um marcador de tempo no formato `'YYYY-MM-DD hh:mm:ss[.fraction]'` que mostra quando a última transação aplicada por este trabalhador foi comprometida na fonte original.

* `LAST_APPLIED_TRANSACTION_IMMEDIATE_COMMIT_TIMESTAMP`

Um marcador de tempo no formato `'YYYY-MM-DD hh:mm:ss[.fraction]'` que mostra quando a última transação aplicada por este trabalhador foi comprometida na fonte imediata.

* `LAST_APPLIED_TRANSACTION_START_APPLY_TIMESTAMP`

Um marcador de tempo no formato `'YYYY-MM-DD hh:mm:ss[.fraction]'` que mostra quando esse trabalhador começou a aplicar a última transação aplicada.

* `LAST_APPLIED_TRANSACTION_END_APPLY_TIMESTAMP`

Um marcador de tempo no formato `'YYYY-MM-DD hh:mm:ss[.fraction]'` que mostra quando esse trabalhador terminou de aplicar a última transação aplicada.

* `APPLYING_TRANSACTION`

O ID global de transação (GTID) da transação que o(a) trabalhador(a) está aplicando atualmente.

* `APPLYING_TRANSACTION_ORIGINAL_COMMIT_TIMESTAMP`

Um marcador de tempo no formato `'YYYY-MM-DD hh:mm:ss[.fraction]'` que mostra quando a transação que o trabalhador está aplicando foi comprometida na fonte original.

* `APPLYING_TRANSACTION_IMMEDIATE_COMMIT_TIMESTAMP`

Um marcador de tempo no formato `'YYYY-MM-DD hh:mm:ss[.fraction]'` que mostra quando a transação que o trabalhador está aplicando foi comprometida na fonte imediata.

* `APPLYING_TRANSACTION_START_APPLY_TIMESTAMP`

Um marcador de tempo no formato `'YYYY-MM-DD hh:mm:ss[.fraction]'` que mostra quando esse trabalhador iniciou sua primeira tentativa de aplicar a transação que está sendo aplicada atualmente. Antes do MySQL 8.0.13, esse marcador de tempo era atualizado quando uma transação era retente devido a um erro transitório, então ele mostrava o marcador de tempo para a tentativa mais recente de aplicar a transação.

* `LAST_APPLIED_TRANSACTION_RETRIES_COUNT`

O número de vezes que a última transação aplicada foi retenteida pelo trabalhador após a primeira tentativa. Se a transação foi aplicada na primeira tentativa, este número é zero.

* `LAST_APPLIED_TRANSACTION_LAST_TRANSIENT_ERROR_NUMBER`

O número de erro do último erro transitório que fez com que a transação fosse repetida.

* `LAST_APPLIED_TRANSACTION_LAST_TRANSIENT_ERROR_MESSAGE`

O texto da mensagem para o último erro transitório que fez com que a transação fosse repetida.

* `LAST_APPLIED_TRANSACTION_LAST_TRANSIENT_ERROR_TIMESTAMP`

Um marcador de tempo no formato `'YYYY-MM-DD hh:mm:ss[.fraction]'` para o último erro transitório que fez com que a transação fosse repetida.

* `APPLYING_TRANSACTION_RETRIES_COUNT`

O número de vezes que a transação que está sendo aplicada foi retente até este momento. Se a transação foi aplicada na primeira tentativa, este número é zero.

* `APPLYING_TRANSACTION_LAST_TRANSIENT_ERROR_NUMBER`

O número de erro do último erro transitório que fez com que a transação atual fosse repetida.

* `APPLYING_TRANSACTION_LAST_TRANSIENT_ERROR_MESSAGE`

O texto da mensagem para o último erro transitório que fez com que a transação atual fosse repetida.

* `APPLYING_TRANSACTION_LAST_TRANSIENT_ERROR_TIMESTAMP`

Um marcador de tempo no formato `'YYYY-MM-DD hh:mm:ss[.fraction]'` para o último erro transitório que fez com que a transação atual fosse repetida.

A tabela `replication_applier_status_by_worker` tem esses índices:

* Chave primária em (`CHANNEL_NAME`, `WORKER_ID`)

* Índice sobre (`THREAD_ID`)

A tabela a seguir mostra a correspondência entre as colunas `replication_applier_status_by_worker` e as colunas [`SHOW REPLICA STATUS`](show-replica-status.html "15.7.7.35 SHOW REPLICA STATUS Statement").

<table summary="Correspondence between replication_applier_status_by_worker columns and SHOW REPLICA STATUS columns"><col style="width: 60%"/><col style="width: 40%"/><thead><tr> <th><code>replication_applier_status_by_worker</code> Column</th> <th><code>SHOW REPLICA STATUS</code> Column</th> </tr></thead><tbody><tr> <td><code>WORKER_ID</code></td> <td>None</td> </tr><tr> <td><code>THREAD_ID</code></td> <td>None</td> </tr><tr> <td><code>SERVICE_STATE</code></td> <td>None</td> </tr><tr> <td><code>LAST_ERROR_NUMBER</code></td> <td><code>Last_SQL_Errno</code></td> </tr><tr> <td><code>LAST_ERROR_MESSAGE</code></td> <td><code>Last_SQL_Error</code></td> </tr><tr> <td><code>LAST_ERROR_TIMESTAMP</code></td> <td><code>Last_SQL_Error_Timestamp</code></td> </tr></tbody></table>

#### 29.12.11.6 A tabela replication_applier_filters

Esta tabela mostra os filtros específicos do canal de replicação configurados nesta replica. Cada linha fornece informações sobre o tipo de filtro configurado do canal de replicação. A tabela `replication_applier_filters` tem as seguintes colunas:

* `CHANNEL_NAME`

O nome do canal de replicação com um filtro de replicação configurado.

* `FILTER_NAME`

O tipo de filtro de replicação que foi configurado para este canal de replicação.

* `FILTER_RULE`

As regras configuradas para o tipo de filtro de replicação usando as opções de comando `--replicate-*` ou `CHANGE REPLICATION FILTER`.

* `CONFIGURED_BY`

O método utilizado para configurar o filtro de replicação pode ser um dos seguintes:

+ `CHANGE_REPLICATION_FILTER` configurado por um filtro de replicação global usando uma declaração `CHANGE REPLICATION FILTER`(change-replication-filter.html "15.4.2.2 CHANGE REPLICATION FILTER Statement").

+ `STARTUP_OPTIONS` configurado por um filtro de replicação global usando uma opção `--replicate-*`.

+ `CHANGE_REPLICATION_FILTER_FOR_CHANNEL` configurado por um filtro de replicação específico de canal usando uma declaração `CHANGE REPLICATION FILTER FOR CHANNEL`.

+ `STARTUP_OPTIONS_FOR_CHANNEL` configurado por um filtro de replicação específico de canal usando uma opção `--replicate-*`.

* `ACTIVE_SINCE`

Data e hora em que o filtro de replicação foi configurado.

* `COUNTER`

O número de vezes que o filtro de replicação foi usado desde que foi configurado.

#### 29.12.11.7 A tabela replication_applier_global_filters

Esta tabela mostra os filtros de replicação global configurados nesta replica. A tabela `replication_applier_global_filters` tem as seguintes colunas:

* `FILTER_NAME`

O tipo de filtro de replicação que foi configurado.

* `FILTER_RULE`

As regras configuradas para o tipo de filtro de replicação usando as opções de comando `--replicate-*` ou `CHANGE REPLICATION FILTER`.

* `CONFIGURED_BY`

O método utilizado para configurar o filtro de replicação pode ser um dos seguintes:

+ `CHANGE_REPLICATION_FILTER` configurado por um filtro de replicação global usando uma declaração `CHANGE REPLICATION FILTER`(change-replication-filter.html "15.4.2.2 CHANGE REPLICATION FILTER Statement").

+ `STARTUP_OPTIONS` configurado por um filtro de replicação global usando uma opção `--replicate-*`.

* `ACTIVE_SINCE`

Data e hora em que o filtro de replicação foi configurado.

#### 29.12.11.8 A tabela replication_asynchronous_connection_failover

Esta tabela contém as listas de origem da réplica para cada canal de replicação para o mecanismo de falha de conexão assíncrona. O mecanismo de falha de conexão assíncrona estabelece automaticamente uma conexão de replicação assíncrona (da origem à réplica) para uma nova origem da lista apropriada após a conexão existente da réplica para sua origem falhar. Quando a falha de conexão assíncrona é habilitada para um grupo de réplicas gerenciadas pela Replicação por Grupo, as listas de origem são transmitidas para todos os membros do grupo quando eles se juntam e também quando as listas são alteradas.

Você define e gerencia listas de fontes usando as funções `asynchronous_connection_failover_add_source` e `asynchronous_connection_failover_delete_source` para adicionar e remover servidores de fonte de replicação da lista de fontes para um canal de replicação. Para adicionar e remover grupos gerenciados de servidores, use as funções `asynchronous_connection_failover_add_managed` e `asynchronous_connection_failover_delete_managed` em vez disso.

Para mais informações, consulte a Seção 19.4.9, “Alternar fontes e réplicas com failover de conexão assíncrona”.

A tabela `replication_asynchronous_connection_failover` tem essas colunas:

* `CHANNEL_NAME`

O canal de replicação para o qual este servidor de fonte de replicação faz parte da lista de fontes. Se a conexão deste canal com sua fonte atual falhar, este servidor de fonte de replicação é uma de suas potenciais novas fontes.

* `HOST`

O nome do host para este servidor de origem de replicação.

* `PORT`

O número do porto para este servidor de origem de replicação.

* `NETWORK_NAMESPACE`

O espaço de rede para este servidor de origem de replicação. Se este valor estiver vazio, as conexões utilizam o espaço de rede padrão (global).

* `WEIGHT`

A prioridade deste servidor de origem da fonte no elenco de origem do canal de replicação. O peso varia de 1 a 100, sendo 100 o maior e 50 o padrão. Quando o mecanismo de failover de conexão assíncrona é ativado, a fonte com o maior ajuste de peso entre as fontes alternativas listadas no elenco de origem para o canal é escolhida para a primeira tentativa de conexão. Se essa tentativa não funcionar, a réplica tenta com todas as fontes listadas em ordem decrescente de peso, depois começa novamente a partir da fonte com o peso mais alto. Se várias fontes tiverem o mesmo peso, a réplica as ordena aleatoriamente.

* `MANAGED_NAME`

O identificador do grupo gerenciado do qual o servidor faz parte. Para o serviço gerenciado `GroupReplication`, o identificador é o valor da variável de sistema `group_replication_group_name`.

A tabela `replication_asynchronous_connection_failover` tem esses índices:

* Chave primária ativada (`CHANNEL_NAME, HOST, PORT, NETWORK_NAMESPACE, MANAGED_NAME`)

`TRUNCATE TABLE` não é permitido para a tabela `replication_asynchronous_connection_failover`.

#### 29.12.11.9 A tabela replication_asynchronous_connection_failover_managed

Esta tabela contém informações de configuração usadas pelo mecanismo de falha de conexão assíncrona da replica para lidar com grupos gerenciados, incluindo topologias de replicação de grupo.

Quando você adiciona um membro do grupo à lista de fontes e o define como parte de um grupo gerenciado, o mecanismo de falha de conexão assíncrona atualiza a lista de fontes para mantê-la alinhada com as mudanças de membros, adicionando e removendo membros do grupo automaticamente à medida que se juntam ou saem. Quando a falha de conexão assíncrona é habilitada para um grupo de réplicas gerenciadas pela Replicação de Grupo, as listas de fontes são transmitidas a todos os membros do grupo quando eles se juntam e também quando as listas são alteradas.

O mecanismo de falha de conexão assíncrona falha na conexão se outro servidor disponível na lista de origem tiver um conjunto de prioridade (peso) mais alto. Para um grupo gerenciado, o peso de uma origem é atribuído dependendo se é um servidor primário ou secundário. Portanto, assumindo que você configurou o grupo gerenciado para dar um peso mais alto a um servidor primário e um peso mais baixo a um secundário, quando o primário muda, o peso mais alto é atribuído ao novo primário, então a replica muda para a conexão com ele. O mecanismo de falha de conexão de conexão assíncrona também muda a conexão se o servidor de origem gerenciado conectado atualmente deixar o grupo gerenciado ou não estiver mais na maioria do grupo gerenciado. Para mais informações, consulte a Seção 19.4.9, “Alternar fontes e réplicas com falha de conexão de conexão assíncrona”.

A tabela `replication_asynchronous_connection_failover_managed` tem essas colunas:

* `CHANNEL_NAME`

O canal de replicação onde os servidores deste grupo gerenciado operam.

* `MANAGED_NAME`

O identificador do grupo gerenciado. Para o serviço gerenciado `GroupReplication`, o identificador é o valor da variável de sistema `group_replication_group_name`.

* `MANAGED_TYPE`

O tipo de serviço gerenciado que o mecanismo de falha de conexão assíncrona oferece para este grupo. O único valor atualmente disponível é `GroupReplication`.

* `CONFIGURATION`

As informações de configuração para este grupo gerenciado. Para o serviço gerenciado `GroupReplication`, a configuração mostra os pesos atribuídos ao servidor primário do grupo e aos servidores secundários do grupo. Por exemplo: `{"Primary_weight": 80, "Secondary_weight": 60}`

+ `Primary_weight`: Número inteiro entre 0 e 100. Valor padrão é 80.

+ `Secondary_weight`: Número inteiro entre 0 e 100. Valor padrão é 60.

A tabela `replication_asynchronous_connection_failover_managed` tem esses índices:

* Chave primária ativada (`CHANNEL_NAME, MANAGED_NAME`)

`TRUNCATE TABLE` não é permitido para a tabela `replication_asynchronous_connection_failover_managed`.

#### 29.12.11.10 A tabela de configuração de replicação_connection

Esta tabela mostra os parâmetros de configuração usados pela replica para se conectar à fonte. Os parâmetros armazenados na tabela podem ser alterados em tempo real com a declaração `CHANGE REPLICATION SOURCE TO` (a partir do MySQL 8.0.23) ou a declaração `CHANGE MASTER TO`(change-master-to.html "15.4.2.1 CHANGE MASTER TO Statement") (antes do MySQL 8.0.23).

Comparado à tabela `replication_connection_status`, a tabela `replication_connection_configuration` muda com menos frequência. Ela contém valores que definem como a replica se conecta à fonte e que permanecem constantes durante a conexão, enquanto que a tabela `replication_connection_status` contém valores que mudam durante a conexão.

A tabela `replication_connection_configuration` tem as seguintes colunas. As descrições das colunas indicam as opções correspondentes `CHANGE REPLICATION SOURCE TO`(change-replication-source-to.html "15.4.2.3 CHANGE REPLICATION SOURCE TO Statement") | `CHANGE MASTER TO` das quais os valores das colunas são tomados, e a tabela dada mais tarde nesta seção mostra a correspondência entre as colunas `replication_connection_configuration` e as colunas `SHOW REPLICA STATUS`(show-replica-status.html "15.7.7.35 SHOW REPLICA STATUS Statement").

* `CHANNEL_NAME`

O canal de replicação que esta linha está exibindo. Sempre há um canal de replicação padrão, e mais canais de replicação podem ser adicionados. Consulte a Seção 19.2.2, “Canais de Replicação”, para mais informações. (Opção `CHANGE REPLICATION SOURCE TO`: `FOR CHANNEL`, Opção `CHANGE MASTER TO`: `FOR CHANNEL`)

* `HOST`

O nome do host da fonte a qual a replica está conectada. (Opção `CHANGE REPLICATION SOURCE TO`: Opção `SOURCE_HOST`, `CHANGE MASTER TO`: Opção `MASTER_HOST`)

* `PORT`

O porto costumava se conectar à fonte. (Opção `CHANGE REPLICATION SOURCE TO`: `SOURCE_PORT`, Opção `CHANGE MASTER TO`: `MASTER_PORT`)

* `USER`

O nome de usuário da conta de usuário de replicação usada para se conectar à fonte. (Opção `CHANGE REPLICATION SOURCE TO`: Opção `SOURCE_USER`, `CHANGE MASTER TO`: Opção `MASTER_USER`)

* `NETWORK_INTERFACE`

A interface de rede à qual a réplica está vinculada, se houver. (Opção `CHANGE REPLICATION SOURCE TO`: `SOURCE_BIND`, Opção `CHANGE MASTER TO`: `MASTER_BIND`)

* `AUTO_POSITION`

1 se o autoposicionamento GTID estiver em uso; caso contrário, 0. (Opção `CHANGE REPLICATION SOURCE TO`: `SOURCE_AUTO_POSITION`, opção `CHANGE MASTER TO`: `MASTER_AUTO_POSITION`)

* `SSL_ALLOWED`, `SSL_CA_FILE`, `SSL_CA_PATH`, `SSL_CERTIFICATE`, `SSL_CIPHER`, `SSL_KEY`, `SSL_VERIFY_SERVER_CERTIFICATE`, `SSL_CRL_FILE`, `SSL_CRL_PATH`

Essas colunas mostram os parâmetros SSL usados pela replica para se conectar à fonte, se houver.

`SSL_ALLOWED` tem esses valores:

+ `Yes` se uma conexão SSL com a fonte for permitida

+ `No` se uma conexão SSL com a fonte não for permitida

+ `Ignored` se uma conexão SSL for permitida, mas a replica não tiver o suporte SSL habilitado

(`CHANGE REPLICATION SOURCE TO` opções para as outras colunas do SSL: `SOURCE_SSL_CA`, `SOURCE_SSL_CAPATH`, `SOURCE_SSL_CERT`, `SOURCE_SSL_CIPHER`, `SOURCE_SSL_CRL`, `SOURCE_SSL_CRLPATH`, `SOURCE_SSL_KEY`, `SOURCE_SSL_VERIFY_SERVER_CERT`.

Opções para as outras colunas do SSL: `MASTER_SSL_CA`, `MASTER_SSL_CAPATH`, `MASTER_SSL_CERT`, `MASTER_SSL_CIPHER`, `MASTER_SSL_CRL`, `MASTER_SSL_CRLPATH`, `MASTER_SSL_KEY`, `MASTER_SSL_VERIFY_SERVER_CERT`.

* `CONNECTION_RETRY_INTERVAL`

O número de segundos entre as tentativas de reconexão. (Opção `CHANGE REPLICATION SOURCE TO`: `SOURCE_CONNECT_RETRY`, Opção `CHANGE MASTER TO`: `MASTER_CONNECT_RETRY`)

* `CONNECTION_RETRY_COUNT`

O número de vezes que a réplica pode tentar se reconectar à fonte em caso de perda de conexão. (Opção `CHANGE REPLICATION SOURCE TO`: `SOURCE_RETRY_COUNT`, Opção `CHANGE MASTER TO`: `MASTER_RETRY_COUNT`)

* `HEARTBEAT_INTERVAL`

O intervalo de batida de replicação em uma replica, medido em segundos. (Opção `CHANGE REPLICATION SOURCE TO`: Opção `SOURCE_HEARTBEAT_PERIOD`, `CHANGE MASTER TO`: Opção `MASTER_HEARTBEAT_PERIOD`)

* `TLS_VERSION`

A lista das versões do protocolo TLS permitidas pela replica para a conexão de replicação. Para informações sobre a versão do TLS, consulte a Seção 8.3.2, “Protocolos e cifras de conexão TLS criptografados”. (Opção `CHANGE REPLICATION SOURCE TO`: Opção `SOURCE_TLS_VERSION`, `CHANGE MASTER TO`: Opção `MASTER_TLS_VERSION`)

* `TLS_CIPHERSUITES`

A lista de conjuntos de cifras permitidos pela réplica para a conexão de replicação. Para informações sobre conjuntos de cifras TLS, consulte a Seção 8.3.2, “Protocolos e cifras de conexão criptografada TLS” (opção `CHANGE REPLICATION SOURCE TO`): `SOURCE_TLS_CIPHERSUITES`, `CHANGE MASTER TO` opção: `MASTER_TLS_CIPHERSUITES`)

* `PUBLIC_KEY_PATH`

O nome do caminho de um arquivo que contém uma cópia do lado do replicador da chave pública necessária pelo fonte para a troca de senha baseada em par de chaves RSA. O arquivo deve estar no formato PEM. Esta coluna se aplica a réplicas que se autenticam com o plugin de autenticação `sha256_password` ou `caching_sha2_password`. (Opção `CHANGE REPLICATION SOURCE TO`: `SOURCE_PUBLIC_KEY_PATH`, Opção `CHANGE MASTER TO`: `MASTER_PUBLIC_KEY_PATH`)

Se `PUBLIC_KEY_PATH` for fornecido e especificar um arquivo de chave pública válido, ele terá precedência sobre `GET_PUBLIC_KEY`.

* `GET_PUBLIC_KEY`

Se deve solicitar à fonte a chave pública necessária para a troca de senha baseada em par de chaves RSA. Esta coluna se aplica a réplicas que se autenticam com o plugin de autenticação `caching_sha2_password`. Para esse plugin, a fonte não envia a chave pública a menos que seja solicitada. (Opção `CHANGE REPLICATION SOURCE TO`: `GET_SOURCE_PUBLIC_KEY`, Opção `CHANGE MASTER TO`: `GET_MASTER_PUBLIC_KEY`)

Se `PUBLIC_KEY_PATH` for fornecido e especificar um arquivo de chave pública válido, ele terá precedência sobre `GET_PUBLIC_KEY`.

* `NETWORK_NAMESPACE`

O nome do espaço de rede; vazio se a conexão usa o espaço de rede padrão (global). Para informações sobre namespaces de rede, consulte a Seção 7.1.14, “Suporte a Namespace de Rede”. Esta coluna foi adicionada no MySQL 8.0.22.

* `COMPRESSION_ALGORITHM`

Os algoritmos de compressão permitidos para conexões à fonte. (Opção `CHANGE REPLICATION SOURCE TO`: Opção `SOURCE_COMPRESSION_ALGORITHMS`, `CHANGE MASTER TO` Opção: `MASTER_COMPRESSION_ALGORITHMS`)

Para mais informações, consulte a Seção 6.2.8, “Controle de Compressão de Conexão”.

Esta coluna foi adicionada no MySQL 8.0.18.

* `ZSTD_COMPRESSION_LEVEL`

O nível de compressão a ser usado para conexões à fonte que utilizam o algoritmo de compressão `zstd`. (Opção `CHANGE REPLICATION SOURCE TO`: `SOURCE_ZSTD_COMPRESSION_LEVEL`, Opção `CHANGE MASTER TO`: `MASTER_ZSTD_COMPRESSION_LEVEL`)

Para mais informações, consulte a Seção 6.2.8, “Controle de Compressão de Conexão”.

Esta coluna foi adicionada no MySQL 8.0.18.

* `SOURCE_CONNECTION_AUTO_FAILOVER`

Se o mecanismo de falha de conexão assíncrona está ativado para este canal de replicação. (Opção `CHANGE REPLICATION SOURCE TO`: Opção `SOURCE_CONNECTION_AUTO_FAILOVER`, `CHANGE MASTER TO`: Opção `SOURCE_CONNECTION_AUTO_FAILOVER`)

Para mais informações, consulte a Seção 19.4.9, “Alternar fontes e réplicas com falha de transição de conexão assíncrona”.

Esta coluna foi adicionada no MySQL 8.0.22.

* `GTID_ONLY`

Indica se este canal utiliza apenas GTIDs para a fila de transações e o processo de aplicação e para recuperação, e não persistiu nomes e posições de arquivos de registro binário e registro de relevo nos repositórios de metadados de replicação. (Opção `CHANGE REPLICATION SOURCE TO`: Opção `GTID_ONLY`, `CHANGE MASTER TO`: Opção `GTID_ONLY`)

Para mais informações, consulte a Seção 20.4.1, “GTIDs e Replicação de Grupo”.

Esta coluna foi adicionada no MySQL 8.0.27.

A tabela `replication_connection_configuration` tem esses índices:

* Chave primária ativada (`CHANNEL_NAME`)

`TRUNCATE TABLE` não é permitido para a tabela `replication_connection_configuration`.

A tabela a seguir mostra a correspondência entre as colunas `replication_connection_configuration` e as colunas `SHOW REPLICA STATUS`(show-replica-status.html "15.7.7.35 SHOW REPLICA STATUS Statement").

<table summary="Correspondence between replication_connection_configuration columns and SHOW REPLICA STATUS columns"><col style="width: 60%"/><col style="width: 40%"/><thead><tr> <th><code>replication_connection_configuration</code> Column</th> <th><code>SHOW REPLICA STATUS</code> Column</th> </tr></thead><tbody><tr> <td><code>CHANNEL_NAME</code></td> <td><code>Channel_name</code></td> </tr><tr> <td><code>HOST</code></td> <td><code>Source_Host</code></td> </tr><tr> <td><code>PORT</code></td> <td><code>Source_Port</code></td> </tr><tr> <td><code>USER</code></td> <td><code>Source_User</code></td> </tr><tr> <td><code>NETWORK_INTERFACE</code></td> <td><code>Source_Bind</code></td> </tr><tr> <td><code>AUTO_POSITION</code></td> <td><code>Auto_Position</code></td> </tr><tr> <td><code>SSL_ALLOWED</code></td> <td><code>Source_SSL_Allowed</code></td> </tr><tr> <td><code>SSL_CA_FILE</code></td> <td><code>Source_SSL_CA_File</code></td> </tr><tr> <td><code>SSL_CA_PATH</code></td> <td><code>Source_SSL_CA_Path</code></td> </tr><tr> <td><code>SSL_CERTIFICATE</code></td> <td><code>Source_SSL_Cert</code></td> </tr><tr> <td><code>SSL_CIPHER</code></td> <td><code>Source_SSL_Cipher</code></td> </tr><tr> <td><code>SSL_KEY</code></td> <td><code>Source_SSL_Key</code></td> </tr><tr> <td><code>SSL_VERIFY_SERVER_CERTIFICATE</code></td> <td><code>Source_SSL_Verify_Server_Cert</code></td> </tr><tr> <td><code>SSL_CRL_FILE</code></td> <td><code>Source_SSL_Crl</code></td> </tr><tr> <td><code>SSL_CRL_PATH</code></td> <td><code>Source_SSL_Crlpath</code></td> </tr><tr> <td><code>CONNECTION_RETRY_INTERVAL</code></td> <td><code>Source_Connect_Retry</code></td> </tr><tr> <td><code>CONNECTION_RETRY_COUNT</code></td> <td><code>Source_Retry_Count</code></td> </tr><tr> <td><code>HEARTBEAT_INTERVAL</code></td> <td>None</td> </tr><tr> <td><code>TLS_VERSION</code></td> <td><code>Source_TLS_Version</code></td> </tr><tr> <td><code>PUBLIC_KEY_PATH</code></td> <td><code>Source_public_key_path</code></td> </tr><tr> <td><code>GET_PUBLIC_KEY</code></td> <td><code>Get_source_public_key</code></td> </tr><tr> <td><code>NETWORK_NAMESPACE</code></td> <td><code>Network_Namespace</code></td> </tr><tr> <td><code>COMPRESSION_ALGORITHM</code></td> <td>[None]</td> </tr><tr> <td><code>ZSTD_COMPRESSION_LEVEL</code></td> <td>[None]</td> </tr><tr> <td><code>GTID_ONLY</code></td> <td>[None]</td> </tr></tbody></table>

#### 29.12.11.11 A tabela replication_connection_status

Esta tabela mostra o status atual da thread de E/S que lida com a conexão da réplica com a fonte, informações sobre a última transação em fila no log de relevo e informações sobre a transação atualmente em fila no log de relevo.

Comparado à tabela `replication_connection_configuration`, a tabela `replication_connection_status` muda com mais frequência. Ela contém valores que mudam durante a conexão, enquanto a tabela `replication_connection_configuration` contém valores que definem como a replica se conecta à fonte e que permanecem constantes durante a conexão.

A tabela `replication_connection_status` tem essas colunas:

* `CHANNEL_NAME`

O canal de replicação que esta linha está exibindo. Sempre há um canal de replicação padrão, e mais canais de replicação podem ser adicionados. Consulte a Seção 19.2.2, “Canais de replicação”, para obter mais informações.

* `GROUP_NAME`

Se este servidor é membro de um grupo, mostra o nome do grupo ao qual o servidor pertence.

* `SOURCE_UUID`

O valor `server_uuid` da fonte.

* `THREAD_ID`

O ID do fio de E/S.

* `SERVICE_STATE`

`ON` (o fio existe e está ativo ou em espera), `OFF` (o fio não existe mais) ou `CONNECTING` (o fio existe e está se conectando à fonte).

* `RECEIVED_TRANSACTION_SET`

O conjunto de IDs de transação global (GTIDs) correspondentes a todas as transações recebidas por esta réplica. Vazio se os GTIDs não estiverem em uso. Consulte Conjuntos de GTIDs para obter mais informações.

* `LAST_ERROR_NUMBER`, `LAST_ERROR_MESSAGE`

O número do erro e a mensagem de erro do erro mais recente que fez com que o thread de I/O parasse. Um número de erro de 0 e uma mensagem de string vazia significam “sem erro”. Se o valor `LAST_ERROR_MESSAGE` não estiver vazio, os valores de erro também aparecem no log de erro da replica.

A emissão de `RESET MASTER` ou `RESET REPLICA` (reset-replica.html "15.4.2.4 RESET REPLICA Statement") redefinirá os valores exibidos nessas colunas.

* `LAST_ERROR_TIMESTAMP`

Um marcador de tempo no formato `'YYYY-MM-DD hh:mm:ss[.fraction]'` que mostra quando a última falha de E/S ocorreu.

* `LAST_HEARTBEAT_TIMESTAMP`

Um marcador de tempo no formato `'YYYY-MM-DD hh:mm:ss[.fraction]'` que indica quando o sinal mais recente do batimento cardíaco foi recebido por uma réplica.

* `COUNT_RECEIVED_HEARTBEATS`

O número total de sinais de batimento cardíaco que uma réplica recebeu desde a última vez que foi reiniciado ou uma declaração (change-replication-source-to.html "15.4.2.3 CHANGE REPLICATION SOURCE TO Statement") foi emitida.

* `LAST_QUEUED_TRANSACTION`

O ID global de transação (GTID) da última transação que foi colocada na log de retransmissão.

* `LAST_QUEUED_TRANSACTION_ORIGINAL_COMMIT_TIMESTAMP`

Um marcador de tempo no formato `'YYYY-MM-DD hh:mm:ss[.fraction]'` que mostra quando a última transação em fila no log de retransmissão foi comprometida na fonte original.

* `LAST_QUEUED_TRANSACTION_IMMEDIATE_COMMIT_TIMESTAMP`

Um marcador de tempo no formato `'YYYY-MM-DD hh:mm:ss[.fraction]'` que mostra quando a última transação em fila no log de retransmissão foi comprometida na fonte imediata.

* `LAST_QUEUED_TRANSACTION_START_QUEUE_TIMESTAMP`

Um marcador de tempo no formato `'YYYY-MM-DD hh:mm:ss[.fraction]'` que mostra quando a última transação foi colocada na fila de registro de retransmissão por esta thread de E/S.

* `LAST_QUEUED_TRANSACTION_END_QUEUE_TIMESTAMP`

Um marcador de tempo no formato `'YYYY-MM-DD hh:mm:ss[.fraction]'` que mostra quando a última transação foi colocada na fila dos arquivos de log do relé.

* `QUEUEING_TRANSACTION`

O ID global de transação (GTID) da transação atualmente em fila no log de retransmissão.

* `QUEUEING_TRANSACTION_ORIGINAL_COMMIT_TIMESTAMP`

Um marcador de tempo no formato `'YYYY-MM-DD hh:mm:ss[.fraction]'` que mostra quando a transação atualmente em fila foi comprometida na fonte original.

* `QUEUEING_TRANSACTION_IMMEDIATE_COMMIT_TIMESTAMP`

Um marcador de tempo no formato `'YYYY-MM-DD hh:mm:ss[.fraction]'` que mostra quando a transação atualmente em fila foi comprometida na fonte imediata.

* `QUEUEING_TRANSACTION_START_QUEUE_TIMESTAMP`

Um marcador de tempo no formato `'YYYY-MM-DD hh:mm:ss[.fraction]'` que mostra quando o primeiro evento da transação atualmente em fila foi escrito no log de retransmissão por esta thread de E/S.

Quando o Schema de desempenho é desativado, as informações de temporização locais não são coletadas, portanto, os campos que mostram os timestamps de início e fim para as transações em fila são zero.

A tabela `replication_connection_status` tem esses índices:

* Chave primária em (`CHANNEL_NAME`)
* Índice em (`THREAD_ID`)

A tabela a seguir mostra a correspondência entre as colunas `replication_connection_status` e as colunas [`SHOW REPLICA STATUS`](show-replica-status.html "15.7.7.35 SHOW REPLICA STATUS Statement").

<table summary="Correspondence between replication_connection_status columns and SHOW REPLICA STATUS columns"><col style="width: 60%"/><col style="width: 40%"/><thead><tr> <th><code>replication_connection_status</code> Column</th> <th><code>SHOW REPLICA STATUS</code> Column</th> </tr></thead><tbody><tr> <td><code>SOURCE_UUID</code></td> <td><code>Master_UUID</code></td> </tr><tr> <td><code>THREAD_ID</code></td> <td>None</td> </tr><tr> <td><code>SERVICE_STATE</code></td> <td><code>Replica_IO_Running</code></td> </tr><tr> <td><code>RECEIVED_TRANSACTION_SET</code></td> <td><code>Retrieved_Gtid_Set</code></td> </tr><tr> <td><code>LAST_ERROR_NUMBER</code></td> <td><code>Last_IO_Errno</code></td> </tr><tr> <td><code>LAST_ERROR_MESSAGE</code></td> <td><code>Last_IO_Error</code></td> </tr><tr> <td><code>LAST_ERROR_TIMESTAMP</code></td> <td><code>Last_IO_Error_Timestamp</code></td> </tr></tbody></table>

#### 29.12.11.12 A tabela de informações de comunicação do grupo de replicação

Esta tabela mostra as opções de configuração do grupo para todo o grupo de replicação. A tabela está disponível apenas quando a Replicação de Grupo está instalada.

A tabela `replication_group_communication_information` tem essas colunas:

* `WRITE_CONCURRENCY`

O número máximo de instâncias de consenso que o grupo pode executar em paralelo. O valor padrão é 10. Veja a Seção 20.5.1.3, “Usando o consenso de escrita de replicação de grupo”.

* `PROTOCOL_VERSION`

A versão do protocolo de comunicação de replicação do grupo, que determina quais capacidades de mensagens são usadas. Isso é definido para acomodar a versão mais antiga do servidor MySQL que você deseja que o grupo suporte. Veja a Seção 20.5.1.4, “Definindo a versão do protocolo de comunicação de um grupo”.

* `WRITE_CONSENSUS_LEADERS_PREFERRED`

O líder ou líderes que o Grupo de Replicação instruiu para usar no motor de comunicação do grupo para gerar consenso. Para um grupo no modo de única primária com a variável de sistema `group_replication_paxos_single_leader` definida como `ON` e a versão do protocolo de comunicação definida como 8.0.27 ou superior, o único líder de consenso é o primário do grupo. Caso contrário, todos os membros do grupo são usados como líderes, então todos eles são mostrados aqui. Veja a Seção 20.7.3, “Líder de Consenso Único”.

* `WRITE_CONSENSUS_LEADERS_ACTUAL`

O líder real ou o líder que o motor de comunicação de grupo está usando para impulsionar o consenso. Se um único líder de consenso estiver sendo usado para o grupo e o primário não estiver saudável, a comunicação de grupo seleciona um líder de consenso alternativo. Nesta situação, o membro do grupo especificado aqui pode diferir do membro do grupo preferido.

* `WRITE_CONSENSUS_SINGLE_LEADER_CAPABLE`

Se o grupo de replicação é capaz de usar um único líder de consenso. 1 significa que o grupo foi iniciado com o uso de um único líder habilitado (`group_replication_paxos_single_leader = ON`](group-replication-system-variables.html#sysvar_group_replication_paxos_single_leader)), e isso ainda é mostrado se o valor de `group_replication_paxos_single_leader` tiver sido alterado desde então neste membro do grupo. 0 significa que o grupo foi iniciado com o modo de líder único desativado (`group_replication_paxos_single_leader = OFF`](group-replication-system-variables.html#sysvar_group_replication_paxos_single_leader)), ou tem uma versão do protocolo de comunicação de replicação de grupo que não suporta o uso de um único líder de consenso (abaixo de 8.0.27). Esta informação é apenas retornada para membros do grupo no estado de `ONLINE` ou `RECOVERING`.

A tabela `replication_group_communication_information` não tem índices.

`TRUNCATE TABLE` não é permitido para a tabela `replication_group_communication_information`.

#### 29.12.11.13 A tabela replication_group_configuration_version

Esta tabela exibe a versão da configuração de ações de membros para membros do grupo de replicação. A tabela está disponível apenas quando a Replicação de Grupo está instalada. Sempre que uma ação de membro é habilitada ou desabilitada usando as funções `group_replication_enable_member_action()` e `group_replication_disable_member_action()`, o número da versão é incrementado. Você pode redefinir a configuração de ações de membros usando a função `group_replication_reset_member_actions()`, que redefere a configuração de ações de membros para as configurações padrão e redefere seu número de versão para 1. Para mais informações, consulte a Seção 20.5.1.5, “Configurando Ações de Membros”.

A tabela `replication_group_configuration_version` tem essas colunas:

* `NAME`

O nome da configuração.

* `VERSION`

O número da versão da configuração.

A tabela `replication_group_configuration_version` não tem índices.

`TRUNCATE TABLE` não é permitido para a tabela `replication_group_configuration_version`.

#### 29.12.11.14 A tabela replication_group_member_actions

Esta tabela lista as ações do membro que estão incluídas na configuração de ações do membro para membros do grupo de replicação. A tabela está disponível apenas quando a Replicação de grupo está instalada. Você pode redefinir a configuração das ações do membro usando a função `group_replication_reset_member_actions()`. Para mais informações, consulte a Seção 20.5.1.5, “Configurando ações do membro”.

A tabela `replication_group_member_actions` tem essas colunas:

* `NAME`

O nome da ação do membro.

* `EVENT`

O evento que desencadeia a ação do membro.

* `ENABLED`

Se a ação do membro está atualmente habilitada. As ações do membro podem ser habilitadas usando a função `group_replication_enable_member_action()` e desabilitadas usando a função `group_replication_disable_member_action()`.

* `TYPE`

O tipo de ação do membro. `INTERNAL` é uma ação que é fornecida pelo plugin de replicação de grupo.

* `PRIORITY`

A prioridade da ação do membro. As ações com valores de prioridade mais baixos são executadas primeiro.

* `ERROR_HANDLING`

A ação que o Replicação por Grupo realiza se ocorrer um erro durante a execução da ação do membro. `IGNORE` significa que uma mensagem de erro é registrada para indicar que a ação do membro falhou, mas nenhuma ação adicional é realizada. `CRITICAL` significa que o membro passa para o estado `ERROR` e realiza a ação especificada pela variável do sistema `group_replication_exit_state_action`.

A tabela `replication_group_member_actions` não tem índices.

`TRUNCATE TABLE` não é permitido para a tabela `replication_group_member_actions`.

#### 29.12.11.15 A tabela replication_group_member_stats

Esta tabela exibe informações estatísticas para os membros do grupo de replicação. Ela é preenchida apenas quando a Replicação de grupo está em execução.

A tabela `replication_group_member_stats` tem essas colunas:

* `CHANNEL_NAME`

Nome do canal de replicação do grupo

* `VIEW_ID`

Identificador da visão atual para este grupo.

* `MEMBER_ID`

O UUID do servidor membro. Este tem um valor diferente para cada membro do grupo. Também serve como uma chave porque é único para cada membro.

* `COUNT_TRANSACTIONS_IN_QUEUE`

O número de transações na fila de espera para verificações de detecção de conflitos. Uma vez que as transações tenham sido verificadas quanto a conflitos, se passarem na verificação, elas são colocadas na fila para serem aplicadas também.

* `COUNT_TRANSACTIONS_CHECKED`

O número de transações que foram verificadas quanto a conflitos.

* `COUNT_CONFLICTS_DETECTED`

O número de transações que não passaram na verificação de detecção de conflitos.

* `COUNT_TRANSACTIONS_ROWS_VALIDATING`

Número de linhas de transação que podem ser usadas para certificação, mas que não foram coletadas como lixo. Pode ser pensado como o tamanho atual do banco de dados de detecção de conflitos contra o qual cada transação é certificada.

* `TRANSACTIONS_COMMITTED_ALL_MEMBERS`

As transações que foram comprometidas com sucesso em todos os membros do grupo de replicação, mostradas como Conjuntos GTID. Isso é atualizado em um intervalo de tempo fixo.

* `LAST_CONFLICT_FREE_TRANSACTION`

O identificador de transação da última transação livre de conflitos que foi verificada.

* `COUNT_TRANSACTIONS_REMOTE_IN_APPLIER_QUEUE`

O número de transações que este membro recebeu do grupo de replicação e que estão aguardando aplicação.

* `COUNT_TRANSACTIONS_REMOTE_APPLIED`

Número de transações que esse membro recebeu do grupo e aplicou.

* `COUNT_TRANSACTIONS_LOCAL_PROPOSED`

Número de transações que se originaram neste membro e foram enviadas para o grupo.

* `COUNT_TRANSACTIONS_LOCAL_ROLLBACK`

Número de transações que se originaram neste membro e foram revertidas pelo grupo.

A tabela `replication_group_member_stats` não tem índices.

`TRUNCATE TABLE` não é permitido para a tabela `replication_group_member_stats`.

#### 29.12.11.16 A tabela replication_group_members

Esta tabela mostra informações de rede e status dos membros do grupo de replicação. Os endereços de rede mostrados são os endereços usados para conectar os clientes ao grupo e não devem ser confundidos com o endereço interno de comunicação do grupo do membro especificado por `group_replication_local_address`.

A tabela `replication_group_members` tem essas colunas:

* `CHANNEL_NAME`

Nome do canal de replicação do grupo.

* `MEMBER_ID`

O UUID do servidor membro. Este tem um valor diferente para cada membro do grupo. Também serve como uma chave porque é único para cada membro.

* `MEMBER_HOST`

Endereço de rede deste membro (nome de host ou endereço IP). Retirado da variável `hostname` do membro. Este é o endereço ao qual os clientes se conectam, ao contrário do grupo_replication_local_address, que é usado para comunicação interna do grupo.

* `MEMBER_PORT`

Porto no qual o servidor está ouvindo. Retirado da variável `port` do membro.

* `MEMBER_STATE`

Estado atual deste membro; pode ser qualquer um dos seguintes:

+ `ONLINE`: O membro está em estado totalmente funcional.

+ `RECOVERING`: O servidor se juntou a um grupo do qual está obtendo dados.

+ `OFFLINE`: O plugin de replicação de grupo foi instalado, mas não foi iniciado.

+ `ERROR`: O membro encontrou um erro, seja durante a aplicação de transações ou durante a fase de recuperação, e não está participando das transações do grupo.

+ `UNREACHABLE`: O processo de detecção de falha suspeita que este membro não pode ser contatado, porque as mensagens do grupo expiraram.

Veja a Seção 20.4.2, “Estados dos servidores de replicação em grupo”.

* `MEMBER_ROLE`

Papel do membro no grupo, seja `PRIMARY` ou `SECONDARY`.

* `MEMBER_VERSION`

Versão MySQL do membro.

* `MEMBER_COMMUNICATION_STACK`

A pilha de comunicação utilizada para o grupo, seja a pilha de comunicação `XCOM` ou a pilha de comunicação `MYSQL`.

Esta coluna foi adicionada no MySQL 8.0.27.

A tabela `replication_group_members` não tem índices.

`TRUNCATE TABLE` não é permitido para a tabela `replication_group_members`.

### 29.12.12 Tabelas do Schema de Desempenho NDB Cluster

A tabela a seguir mostra todas as tabelas do Schema de Desempenho relacionadas ao motor de armazenamento `NDBCLUSTER`.

**Tabela 29.3 Schema de desempenho de tabelas NDB**

<table frame="box" rules="all" summary="A reference that lists all Performance Schema tables relating to NDB Cluster."><col style="width: 25%"/><col style="width: 62%"/><col style="width: 12%"/><thead><tr><th>Table Name</th> <th>Description</th> <th>Introduced</th> </tr></thead><tbody><tr><th scope="row"><code>ndb_sync_excluded_objects</code></th> <td>Objetos do NDB que não podem ser sincronizados</td> <td>8.0.21</td> </tr><tr><th scope="row"><code>ndb_sync_pending_objects</code></th> <td>NDB objects waiting for synchronization</td> <td>8.0.21</td> </tr></tbody></table>

Começando com o NDB 8.0.16, a sincronização automática em `NDB` tenta detectar e sincronizar automaticamente todos os desalinhamentos nos metadados entre o dicionário interno do NDB Cluster e a datadictionary do MySQL Server. Isso é feito por padrão em segundo plano em intervalos regulares, conforme determinado pela variável de sistema `ndb_metadata_check_interval`, a menos que seja desativada usando `ndb_metadata_check` ou substituída definindo `ndb_metadata_sync`. Antes do NDB 8.0.21, a única informação facilmente acessível aos usuários sobre esse processo estava na forma de mensagens de registro e contagens de objetos disponíveis (começando com o NDB 8.0.18), como as variáveis de status `Ndb_metadata_detected_count`, `Ndb_metadata_synced_count` e `Ndb_metadata_excluded_count` (antes do NDB 8.0.22, essa variável era chamada `Ndb_metadata_blacklist_size`). Começando com o NDB 8.0.21, informações mais detalhadas sobre o estado atual da sincronização automática são exibidas por um servidor MySQL que atua como um nó SQL em um NDB Cluster nessas duas tabelas do Schema de Desempenho:

* `ndb_sync_pending_objects`: Exibe informações sobre os objetos do banco de dados `NDB` para os quais foram detectados desalinhamentos entre o dicionário `NDB` e o dicionário de dados MySQL. Ao tentar sincronizar esses objetos, `NDB` remove o objeto da fila de espera para sincronização e desta tabela e tenta conciliar o desalinhamento. Se a sincronização do objeto falhar devido a um erro temporário, ele é recuperado e adicionado novamente à fila (e a esta tabela) na próxima vez que `NDB` realiza a detecção de desalinhamento; se as tentativas falharem devido a um erro permanente, o objeto é adicionado à tabela `ndb_sync_excluded_objects`.

* `ndb_sync_excluded_objects`: Mostra informações sobre os objetos do banco de dados `NDB` para os quais a sincronização automática falhou devido a erros permanentes resultantes de desalinhamentos que não podem ser reconciliados sem intervenção manual; esses objetos estão bloqueados e não são considerados novamente para detecção de desalinhamento até que isso tenha sido feito.

As tabelas `ndb_sync_pending_objects` e `ndb_sync_excluded_objects` estão presentes apenas se o MySQL tiver suporte habilitado para o mecanismo de armazenamento `NDBCLUSTER`.

Essas tabelas são descritas com mais detalhes nas duas seções a seguir.

#### 29.12.12.1 A tabela ndb_sync_pending_objects

Esta tabela fornece informações sobre os objetos do banco de dados `NDB` para os quais foram detectados desalinhamentos e que estão aguardando sincronização entre o dicionário `NDB` e o dicionário de dados MySQL.

Informações exemplares sobre os objetos do banco de dados `NDB` aguardando sincronização:

```
mysql> SELECT * FROM performance_schema.ndb_sync_pending_objects;
+-------------+------+----------------+
| SCHEMA_NAME | NAME |  TYPE          |
+-------------+------+----------------+
| NULL        | lg1  |  LOGFILE GROUP |
| NULL        | ts1  |  TABLESPACE    |
| db1         | NULL |  SCHEMA        |
| test        | t1   |  TABLE         |
| test        | t2   |  TABLE         |
| test        | t3   |  TABLE         |
+-------------+------+----------------+
```

A tabela `ndb_sync_pending_objects` tem essas colunas:

* `SCHEMA_NAME`: O nome do esquema (banco de dados) no qual o objeto que está aguardando sincronização reside; isso é `NULL` para espaços de tabela e grupos de arquivos de registro

* `NAME`: O nome do objeto que está aguardando sincronização; este é `NULL` se o objeto for um esquema

* `TYPE`: O tipo do objeto que está aguardando sincronização; este é um dos `LOGFILE GROUP`, `TABLESPACE`, `SCHEMA` ou `TABLE`

A tabela `ndb_sync_pending_objects` foi adicionada no NDB 8.0.21.

#### 29.12.12.2 A tabela ndb_sync_excluded_objects

Esta tabela fornece informações sobre os objetos do banco de dados `NDB` que não podem ser sincronizados automaticamente entre o dicionário do NDB Cluster e o dicionário de dados do MySQL.

Informações exemplares sobre os objetos do banco de dados `NDB` que não podem ser sincronizados com o dicionário de dados MySQL:

```
mysql> SELECT * FROM performance_schema.ndb_sync_excluded_objects\G
*************************** 1. row ***************************
SCHEMA_NAME: NULL
       NAME: lg1
       TYPE: LOGFILE GROUP
     REASON: Injected failure
*************************** 2. row ***************************
SCHEMA_NAME: NULL
       NAME: ts1
       TYPE: TABLESPACE
     REASON: Injected failure
*************************** 3. row ***************************
SCHEMA_NAME: db1
       NAME: NULL
       TYPE: SCHEMA
     REASON: Injected failure
*************************** 4. row ***************************
SCHEMA_NAME: test
       NAME: t1
       TYPE: TABLE
     REASON: Injected failure
*************************** 5. row ***************************
SCHEMA_NAME: test
       NAME: t2
       TYPE: TABLE
     REASON: Injected failure
*************************** 6. row ***************************
SCHEMA_NAME: test
       NAME: t3
       TYPE: TABLE
     REASON: Injected failure
```

A tabela `ndb_sync_excluded_objects` tem essas colunas:

* `SCHEMA_NAME`: O nome do esquema (banco de dados) no qual o objeto que não conseguiu sincronizar reside; isso é `NULL` para espaços de tabela e grupos de arquivos de registro

* `NAME`: O nome do objeto que não conseguiu se sincronizar; este é `NULL` se o objeto for um esquema

* `TYPE`: O tipo do objeto não conseguiu se sincronizar; este é um dos `LOGFILE GROUP`, `TABLESPACE`, `SCHEMA` ou `TABLE`

* `REASON`: A razão da exclusão (bloqueamento) do objeto; ou seja, a razão da falha na sincronização deste objeto

As possíveis razões incluem as seguintes:

+ `Injected failure`
  + `Failed to determine if object existed in NDB`

+ `Failed to determine if object existed in DD`

+ `Failed to drop object in DD`
  + `Failed to get undofiles assigned to logfile group`

+ `Failed to get object id and version`
  + `Failed to install object in DD`
  + `Failed to get datafiles assigned to tablespace`

+ `Failed to create schema`
  + `Failed to determine if object was a local table`

+ `Failed to invalidate table references`

+ `Failed to set database name of NDB object`

+ `Failed to get extra metadata of table`

+ `Failed to migrate table with extra metadata version 1`

+ `Failed to get object from DD`
  + `Definition of table has changed in NDB Dictionary`

+ `Failed to setup binlogging for table`

Essa lista não é necessariamente exaustiva e está sujeita a alterações em futuras edições do `NDB`.

A tabela `ndb_sync_excluded_objects` foi adicionada no NDB 8.0.21.

### 29.12.13 Tabelas de bloqueio do Schema de desempenho

O Schema de Desempenho expõe informações de bloqueio através dessas tabelas:

* `data_locks`: Fechamentos e solicitações de dados bloqueados

* `data_lock_waits`: Relações entre os proprietários de bloqueio de dados e os solicitantes de bloqueio de dados bloqueados por esses proprietários

* `metadata_locks`: Lâminas de bloqueio de metadados mantidas e solicitadas

* `table_handles`: Chaves de mesa mantidas e solicitadas

As seções a seguir descrevem essas tabelas com mais detalhes.

#### 29.12.13.1 Tabela data_locks

A tabela `data_locks` mostra os bloqueios de dados mantidos e solicitados. Para informações sobre quais solicitações de bloqueio são bloqueadas por quais bloqueios mantidos, consulte a Seção 29.12.13.2, “A tabela data_lock_waits”.

Exemplo de informações sobre bloqueio de dados:

```
mysql> SELECT * FROM performance_schema.data_locks\G
*************************** 1. row ***************************
               ENGINE: INNODB
       ENGINE_LOCK_ID: 139664434886512:1059:139664350547912
ENGINE_TRANSACTION_ID: 2569
            THREAD_ID: 46
             EVENT_ID: 12
        OBJECT_SCHEMA: test
          OBJECT_NAME: t1
       PARTITION_NAME: NULL
    SUBPARTITION_NAME: NULL
           INDEX_NAME: NULL
OBJECT_INSTANCE_BEGIN: 139664350547912
            LOCK_TYPE: TABLE
            LOCK_MODE: IX
          LOCK_STATUS: GRANTED
            LOCK_DATA: NULL
*************************** 2. row ***************************
               ENGINE: INNODB
       ENGINE_LOCK_ID: 139664434886512:2:4:1:139664350544872
ENGINE_TRANSACTION_ID: 2569
            THREAD_ID: 46
             EVENT_ID: 12
        OBJECT_SCHEMA: test
          OBJECT_NAME: t1
       PARTITION_NAME: NULL
    SUBPARTITION_NAME: NULL
           INDEX_NAME: GEN_CLUST_INDEX
OBJECT_INSTANCE_BEGIN: 139664350544872
            LOCK_TYPE: RECORD
            LOCK_MODE: X
          LOCK_STATUS: GRANTED
            LOCK_DATA: supremum pseudo-record
```

Ao contrário da maioria dos dados coletados pelo Schema de Desempenho, não há instrumentos para controlar se as informações de bloqueio de dados são coletadas ou variáveis do sistema para controlar o tamanho das tabelas de bloqueio de dados. O Schema de Desempenho coleta informações que já estão disponíveis no servidor, portanto, não há sobrecarga de memória ou CPU para gerar essas informações ou necessidade de parâmetros que controlem sua coleta.

Utilize a tabela `data_locks` para ajudar a diagnosticar problemas de desempenho que ocorrem em períodos de carga concorrente intensa. Para `InnoDB`, consulte a discussão sobre esse tópico na Seção 17.15.2, “Informações de Transação e Rastreamento do InnoDB do Schema de Informações”.

A tabela `data_locks` tem essas colunas:

* `ENGINE`

O mecanismo de armazenamento que detém ou solicitou o bloqueio.

* `ENGINE_LOCK_ID`

O ID do bloqueio que está sendo mantido ou solicitado pelo motor de armazenamento. Os tuplos de valores (`ENGINE_LOCK_ID`, `ENGINE`) são únicos.

Os formatos de ID de bloqueio são internos e estão sujeitos a alterações a qualquer momento. As aplicações não devem depender de IDs de bloqueio terem um formato específico.

* `ENGINE_TRANSACTION_ID`

O ID interno do motor de armazenamento da transação que solicitou o bloqueio. Isso pode ser considerado o proprietário do bloqueio, embora o bloqueio ainda possa estar pendente, não concedido ainda (`LOCK_STATUS='WAITING'`).

Se a transação ainda não tiver realizado nenhuma operação de escrita (ainda é considerada apenas de leitura), a coluna contém dados internos que os usuários não devem tentar interpretar. Caso contrário, a coluna é o ID da transação.

Para `InnoDB`, para obter detalhes sobre a transação, combine esta coluna com a coluna `TRX_ID` da tabela `INFORMATION_SCHEMA` `INNODB_TRX`.

* `THREAD_ID`

O ID do fio da sessão que criou o bloqueio. Para obter detalhes sobre o fio, junte esta coluna com a coluna `THREAD_ID` da tabela do Schema de Desempenho `threads`.

`THREAD_ID` pode ser usado em conjunto com `EVENT_ID` para determinar o evento durante o qual a estrutura de dados de bloqueio foi criada na memória. (Esse evento pode ter ocorrido antes desse pedido de bloqueio específico, se a estrutura de dados for usada para armazenar múltiplos bloqueios.)

* `EVENT_ID`

O evento do Schema de Desempenho que causou o bloqueio. Os tuplos de valores (`THREAD_ID`, `EVENT_ID`) identificam implicitamente um evento pai em outras tabelas do Schema de Desempenho:

+ O evento de espera do pai nas tabelas `events_waits_xxx`

+ O evento principal na tabela `events_stages_xxx`

+ O evento de declaração principal nas tabelas `events_statements_xxx`

+ O evento da transação principal na tabela `events_transactions_current`

Para obter detalhes sobre o evento principal, conecte as colunas `THREAD_ID` e `EVENT_ID` às colunas com o mesmo nome na tabela do evento principal apropriada. Veja a Seção 29.19.2, “Obtenção de Informações sobre o Evento Principal”.

* `OBJECT_SCHEMA`

O esquema que contém a tabela bloqueada.

* `OBJECT_NAME`

O nome da tabela bloqueada.

* `PARTITION_NAME`

O nome da partição bloqueada, se houver; `NULL` caso contrário.

* `SUBPARTITION_NAME`

O nome da subpartição bloqueada, se houver; `NULL` caso contrário.

* `INDEX_NAME`

O nome do índice bloqueado, se houver; `NULL` caso contrário.

Na prática, `InnoDB` sempre cria um índice (`GEN_CLUST_INDEX`), portanto, `INDEX_NAME` não é `NULL` para as tabelas `InnoDB`.

* `OBJECT_INSTANCE_BEGIN`

O endereço em memória do bloqueio.

* `LOCK_TYPE`

O tipo de fechadura.

O valor depende do mecanismo de armazenamento. Para `InnoDB`, os valores permitidos são `RECORD` para um bloqueio de nível de linha, `TABLE` para um bloqueio de nível de tabela.

* `LOCK_MODE`

Como o bloqueio é solicitado.

O valor depende do mecanismo de armazenamento. Para `InnoDB`, os valores permitidos são `S[,GAP]`, `X[,GAP]`, `IS[,GAP]`, `IX[,GAP]`, `AUTO_INC` e `UNKNOWN`. Modos de bloqueio que não sejam `AUTO_INC` e `UNKNOWN` indicam bloqueios de lacuna, se presentes. Para informações sobre `S`, `X`, `IS`, `IX` e bloqueios de lacuna, consulte a Seção 17.7.1, “Bloqueio InnoDB”.

* `LOCK_STATUS`

O status do pedido de bloqueio.

O valor depende do motor de armazenamento. Para `InnoDB`, os valores permitidos são `GRANTED` (bloqueio é mantido) e `WAITING` (bloqueio está sendo aguardado).

* `LOCK_DATA`

Os dados associados ao bloqueio, se houver. O valor depende do mecanismo de armazenamento. Para `InnoDB`, um valor é mostrado se o `LOCK_TYPE` é `RECORD`, caso contrário, o valor é `NULL`. Os valores da chave primária do registro bloqueado são mostrados para um bloqueio colocado no índice da chave primária. Os valores do índice secundário do registro bloqueado são mostrados com os valores da chave primária anexados para um bloqueio colocado em um índice secundário. Se não houver chave primária, `LOCK_DATA` mostra os valores da chave de um índice único selecionado ou o número de ID de linha interno único `InnoDB`, de acordo com as regras que regem o uso de índice agrupado `InnoDB` (ver Seção 17.6.2.1, “Indizes Agrupados e Secundários”). `LOCK_DATA` relata “pseudo-registro supremo” para um bloqueio tomado em um pseudo-registro supremo. Se a página contendo o registro bloqueado não estiver na piscina de buffer porque foi escrita no disco enquanto o bloqueio era mantido, `InnoDB` não busca a página no disco. Em vez disso, `LOCK_DATA` relata `NULL`.

A tabela `data_locks` tem esses índices:

* Chave primária em (`ENGINE_LOCK_ID`, `ENGINE`)

* Índice sobre (`ENGINE_TRANSACTION_ID`, `ENGINE`)

* Índice sobre (`THREAD_ID`, `EVENT_ID`)

* Índice de (`OBJECT_SCHEMA`, `OBJECT_NAME`, `PARTITION_NAME`, `SUBPARTITION_NAME`)

`TRUNCATE TABLE` não é permitido para a tabela `data_locks`.

Nota

Antes do MySQL 8.0.1, informações semelhantes às da tabela do Gerador de Desempenho `data_locks` estão disponíveis na tabela `INFORMATION_SCHEMA.INNODB_LOCKS`, que fornece informações sobre cada bloqueio que uma transação `InnoDB` solicitou, mas ainda não adquiriu, e cada bloqueio mantido por uma transação que está bloqueando outra transação. `INFORMATION_SCHEMA.INNODB_LOCKS` é desatualizado e é removido a partir do MySQL 8.0.1. `data_locks` deve ser usado em vez disso.

Diferenças entre `INNODB_LOCKS` e `data_locks`:

* Se uma transação tiver um bloqueio, `INNODB_LOCKS` exibe o bloqueio apenas se outra transação estiver aguardando por ele. `data_locks` exibe o bloqueio, independentemente de qualquer transação estar aguardando por ele.

* A tabela `data_locks` não possui colunas correspondentes a `LOCK_SPACE`, `LOCK_PAGE` ou `LOCK_REC`.

* A tabela `INNODB_LOCKS` requer o privilégio global `PROCESS`. A tabela `data_locks` requer o privilégio padrão do Schema de Desempenho de `SELECT` sobre a tabela que deve ser selecionada.

A tabela a seguir mostra a correspondência entre as colunas de `INNODB_LOCKS` e as colunas de `data_locks`. Use essas informações para migrar aplicativos de uma tabela para a outra.

**Tabela 29.4 Mapeamento de INNODB_LOCKS para colunas data_locks**

<table summary="Mapping from INNODB_LOCKS to data_locks columns."><col style="width: 50%"/><col style="width: 50%"/><thead><tr> <th>INNODB_LOCKS Column</th> <th>data_locks Column</th> </tr></thead><tbody><tr> <td><code>LOCK_ID</code></td> <td><code>ENGINE_LOCK_ID</code></td> </tr><tr> <td><code>LOCK_TRX_ID</code></td> <td><code>ENGINE_TRANSACTION_ID</code></td> </tr><tr> <td><code>LOCK_MODE</code></td> <td><code>LOCK_MODE</code></td> </tr><tr> <td><code>LOCK_TYPE</code></td> <td><code>LOCK_TYPE</code></td> </tr><tr> <td><code>LOCK_TABLE</code> (combined schema/table names)</td> <td><code>OBJECT_SCHEMA</code> (schema name), <code>OBJECT_NAME</code> (table name)</td> </tr><tr> <td><code>LOCK_INDEX</code></td> <td><code>INDEX_NAME</code></td> </tr><tr> <td><code>LOCK_SPACE</code></td> <td>None</td> </tr><tr> <td><code>LOCK_PAGE</code></td> <td>None</td> </tr><tr> <td><code>LOCK_REC</code></td> <td>None</td> </tr><tr> <td><code>LOCK_DATA</code></td> <td><code>LOCK_DATA</code></td> </tr></tbody></table>

#### 29.12.13.2 A tabela data_lock_waits

A tabela `data_lock_waits` implementa uma relação de muitos para muitos que mostra quais solicitações de bloqueio de dados na tabela `data_locks` são bloqueadas por quais bloqueios de dados mantidos na tabela `data_locks`. Os bloqueios mantidos em `data_locks` aparecem em `data_lock_waits` apenas se eles bloqueiam alguma solicitação de bloqueio.

Essa informação permite que você entenda as dependências de bloqueio de dados entre as sessões. A tabela expõe não apenas qual bloqueio uma sessão ou transação está esperando, mas também qual sessão ou transação atualmente detém esse bloqueio.

Exemplo de informações de espera para bloqueio de dados:

```
mysql> SELECT * FROM performance_schema.data_lock_waits\G
*************************** 1. row ***************************
                          ENGINE: INNODB
       REQUESTING_ENGINE_LOCK_ID: 140211201964816:2:4:2:140211086465800
REQUESTING_ENGINE_TRANSACTION_ID: 1555
            REQUESTING_THREAD_ID: 47
             REQUESTING_EVENT_ID: 5
REQUESTING_OBJECT_INSTANCE_BEGIN: 140211086465800
         BLOCKING_ENGINE_LOCK_ID: 140211201963888:2:4:2:140211086459880
  BLOCKING_ENGINE_TRANSACTION_ID: 1554
              BLOCKING_THREAD_ID: 46
               BLOCKING_EVENT_ID: 12
  BLOCKING_OBJECT_INSTANCE_BEGIN: 140211086459880
```

Ao contrário da maioria dos dados coletados pelo Schema de Desempenho, não há instrumentos para controlar se as informações de bloqueio de dados são coletadas ou variáveis do sistema para controlar o tamanho das tabelas de bloqueio de dados. O Schema de Desempenho coleta informações que já estão disponíveis no servidor, portanto, não há sobrecarga de memória ou CPU para gerar essas informações ou necessidade de parâmetros que controlem sua coleta.

Utilize a tabela `data_lock_waits` para ajudar a diagnosticar problemas de desempenho que ocorrem em períodos de carga concorrente intensa. Para `InnoDB`, consulte a discussão sobre esse tópico na Seção 17.15.2, “Informações de Transação e Rastreamento do InnoDB do Schema de Informações”.

Como as colunas da tabela `data_lock_waits` são semelhantes às da tabela `data_locks`, as descrições das colunas aqui são abreviadas. Para descrições mais detalhadas das colunas, consulte a Seção 29.12.13.1, “A tabela data_locks”.

A tabela `data_lock_waits` tem essas colunas:

* `ENGINE`

O mecanismo de armazenamento que solicitou o bloqueio.

* `REQUESTING_ENGINE_LOCK_ID`

O ID do bloqueio solicitado pelo motor de armazenamento. Para obter detalhes sobre o bloqueio, combine esta coluna com a coluna `ENGINE_LOCK_ID` da tabela `data_locks`.

* `REQUESTING_ENGINE_TRANSACTION_ID`

O ID interno do motor de armazenamento da transação que solicitou o bloqueio.

* `REQUESTING_THREAD_ID`

O ID do fio da sessão que solicitou o bloqueio.

* `REQUESTING_EVENT_ID`

O evento do Schema de Desempenho que causou o pedido de bloqueio na sessão que solicitou o bloqueio.

* `REQUESTING_OBJECT_INSTANCE_BEGIN`

O endereço em memória do bloqueio solicitado.

* `BLOCKING_ENGINE_LOCK_ID`

O ID do bloqueio. Para obter detalhes sobre o bloqueio, combine esta coluna com a coluna `ENGINE_LOCK_ID` da tabela `data_locks`.

* `BLOCKING_ENGINE_TRANSACTION_ID`

O ID interno do motor de armazenamento da transação que detém o bloqueio.

* `BLOCKING_THREAD_ID`

O ID do fio da sessão que detém o bloqueio.

* `BLOCKING_EVENT_ID`

O evento do Schema de desempenho que causou o bloqueio do bloqueio na sessão que o contém.

* `BLOCKING_OBJECT_INSTANCE_BEGIN`

O endereço em memória do bloqueio de fechadura.

A tabela `data_lock_waits` tem esses índices:

* Índice sobre (`REQUESTING_ENGINE_LOCK_ID`, `ENGINE`)

* Índice sobre (`BLOCKING_ENGINE_LOCK_ID`, `ENGINE`)

* Índice sobre (`REQUESTING_ENGINE_TRANSACTION_ID`, `ENGINE`)

* Índice sobre (`BLOCKING_ENGINE_TRANSACTION_ID`, `ENGINE`)

* Índice sobre (`REQUESTING_THREAD_ID`, `REQUESTING_EVENT_ID`)

* Índice sobre (`BLOCKING_THREAD_ID`, `BLOCKING_EVENT_ID`)

`TRUNCATE TABLE` não é permitido para a tabela `data_lock_waits`.

Nota

Antes do MySQL 8.0.1, informações semelhantes às da tabela do Gerador de Desempenho `data_lock_waits` estão disponíveis na tabela `INFORMATION_SCHEMA.INNODB_LOCK_WAITS`, que fornece informações sobre cada transação bloqueada `InnoDB`, indicando o bloqueio que ela solicitou e quaisquer bloqueios que estão bloqueando esse pedido. `INFORMATION_SCHEMA.INNODB_LOCK_WAITS` é desatualizado e é removido a partir do MySQL 8.0.1. `data_lock_waits` deve ser usado em vez disso.

As tabelas diferem nos privilégios necessários: A tabela `INNODB_LOCK_WAITS` requer o privilégio global `PROCESS`. A tabela `data_lock_waits` requer o privilégio habitual do Schema de Desempenho de `SELECT` sobre a tabela que deve ser selecionada.

A tabela a seguir mostra a mapeo das colunas de `INNODB_LOCK_WAITS` para as colunas de `data_lock_waits`. Use essas informações para migrar aplicativos de uma tabela para a outra.

**Tabela 29.5 Mapeamento de INNODB_LOCK_WAITS para colunas data_lock_waits**

<table summary="Mapping from INNODB_LOCK_WAITS to data_lock_waits columns."><col style="width: 50%"/><col style="width: 50%"/><thead><tr> <th>INNODB_LOCK_WAITS Column</th> <th>data_lock_waits Column</th> </tr></thead><tbody><tr> <td><code>REQUESTING_TRX_ID</code></td> <td><code>REQUESTING_ENGINE_TRANSACTION_ID</code></td> </tr><tr> <td><code>REQUESTED_LOCK_ID</code></td> <td><code>REQUESTING_ENGINE_LOCK_ID</code></td> </tr><tr> <td><code>BLOCKING_TRX_ID</code></td> <td><code>BLOCKING_ENGINE_TRANSACTION_ID</code></td> </tr><tr> <td><code>BLOCKING_LOCK_ID</code></td> <td><code>BLOCKING_ENGINE_LOCK_ID</code></td> </tr></tbody></table>

#### 29.12.13.3 A tabela metadata_locks

O MySQL utiliza o bloqueio de metadados para gerenciar o acesso concorrente a objetos do banco de dados e garantir a consistência dos dados; veja a Seção 10.11.4, “Bloqueio de Metadados”. O bloqueio de metadados não se aplica apenas a tabelas, mas também a esquemas, programas armazenados (procedimentos, funções, gatilhos, eventos agendados), espaços de tabela, bloqueios de usuário adquiridos com a função `GET_LOCK()` (veja a Seção 14.14, “Funções de Bloqueio”) e bloqueios adquiridos com o serviço de bloqueio descrito na Seção 7.6.9.1, “O Serviço de Bloqueio”.

O Schema de Desempenho expõe informações de bloqueio de metadados através da tabela `metadata_locks`:

* Lâminas que foram concedidas (mostra quais sessões possuem quais trancas de metadados atuais).

* Lâminas que foram solicitadas, mas ainda não concedidas (mostra quais sessões estão esperando por quais lâminas de metadados).

* Bloqueios que foram eliminados pelo detector de travamento.

* Bloqueios que expiraram e estão aguardando que a solicitação de bloqueio da sessão solicitante seja descartada.

Essa informação permite que você entenda as dependências de bloqueio de metadados entre as sessões. Você pode ver não apenas qual bloqueio uma sessão está esperando, mas também qual sessão atualmente detém esse bloqueio.

A tabela `metadata_locks` é somente leitura e não pode ser atualizada. Ela é dimensionada automaticamente por padrão; para configurar o tamanho da tabela, defina a variável de sistema `performance_schema_max_metadata_locks` na inicialização do servidor.

A instrumentação de bloqueio de metadados utiliza o instrumento `wait/lock/metadata/sql/mdl`, que é habilitado por padrão.

Para controlar o estado de instrumentação de bloqueio de metadados no início do servidor, use linhas como essas no seu arquivo `my.cnf`:

* Habilitar:

  ```
  [mysqld]
  performance-schema-instrument='wait/lock/metadata/sql/mdl=ON'
  ```

* Desativar:

  ```
  [mysqld]
  performance-schema-instrument='wait/lock/metadata/sql/mdl=OFF'
  ```

Para controlar o estado de instrumentação de bloqueio de metadados no tempo de execução, atualize a tabela `setup_instruments`:

* Habilitar:

  ```
  UPDATE performance_schema.setup_instruments
  SET ENABLED = 'YES', TIMED = 'YES'
  WHERE NAME = 'wait/lock/metadata/sql/mdl';
  ```

* Desativar:

  ```
  UPDATE performance_schema.setup_instruments
  SET ENABLED = 'NO', TIMED = 'NO'
  WHERE NAME = 'wait/lock/metadata/sql/mdl';
  ```

O Schema de Desempenho mantém o conteúdo da tabela `metadata_locks` da seguinte forma, utilizando a coluna `LOCK_STATUS` para indicar o status de cada bloqueio:

* Quando uma restrição de metadados é solicitada e obtida imediatamente, uma linha com um status de `GRANTED` é inserida.

* Quando uma restrição de metadados é solicitada e não obtida imediatamente, uma linha com um status de `PENDING` é inserida.

* Quando uma restrição de metadados solicitada anteriormente é concedida, seu status de linha é atualizado para `GRANTED`.

* Quando uma restrição de metadados é liberada, sua linha é excluída.
* Quando um pedido de bloqueio pendente é cancelado pelo detector de bloqueio para quebrar um bloqueio (`ER_LOCK_DEADLOCK`), seu status de linha é atualizado de `PENDING` para `VICTIM`.

* Quando um pedido de bloqueio pendente expira (`ER_LOCK_WAIT_TIMEOUT`), seu status de linha é atualizado de `PENDING` para `TIMEOUT`.

* Quando a solicitação de bloqueio ou bloqueio pendente é cancelada, seu status de linha é atualizado de `GRANTED` ou `PENDING` para `KILLED`.

* Os valores de status `VICTIM`, `TIMEOUT` e `KILLED` são breves e indicam que a linha de bloqueio está prestes a ser excluída.

* Os valores de status `PRE_ACQUIRE_NOTIFY` e `POST_RELEASE_NOTIFY` são breves e indicam que o subsistema de bloqueio de metadados está notificando os motores de armazenamento interessados enquanto realiza operações de aquisição de bloqueio ou deixa operações de liberação de bloqueio.

A tabela `metadata_locks` tem essas colunas:

* `OBJECT_TYPE`

O tipo de fechadura utilizado no subsistema de bloqueio de metadados. O valor é um dos `GLOBAL`, `SCHEMA`, `TABLE`, `FUNCTION`, `PROCEDURE`, `TRIGGER` (atualmente não utilizado), `EVENT`, `COMMIT`, `USER LEVEL LOCK`, `TABLESPACE`, `BACKUP LOCK`, ou `LOCKING SERVICE`.

Um valor de `USER LEVEL LOCK` indica uma trava adquirida com `GET_LOCK()`. Um valor de `LOCKING SERVICE` indica uma trava adquirida com o serviço de bloqueio descrito na Seção 7.6.9.1, “O Serviço de Bloqueio”.

* `OBJECT_SCHEMA`

O esquema que contém o objeto.

* `OBJECT_NAME`

O nome do objeto instrumentado.

* `OBJECT_INSTANCE_BEGIN`

O endereço na memória do objeto instrumentado.

* `LOCK_TYPE`

O tipo de bloqueio do subsistema de bloqueio de metadados. O valor é um dos `INTENTION_EXCLUSIVE`, `SHARED`, `SHARED_HIGH_PRIO`, `SHARED_READ`, `SHARED_WRITE`, `SHARED_UPGRADABLE`, `SHARED_NO_WRITE`, `SHARED_NO_READ_WRITE`, ou `EXCLUSIVE`.

* `LOCK_DURATION`

A duração do bloqueio do subsistema de bloqueio de metadados. O valor é um dos `STATEMENT`, `TRANSACTION` ou `EXPLICIT`. Os valores `STATEMENT` e `TRANSACTION` indicam blocos que são liberados implicitamente no final da declaração ou transação, respectivamente. O valor `EXPLICIT` indica blocos que sobrevivem ao final da declaração ou transação e são liberados por ação explícita, como bloqueios globais adquiridos com [`FLUSH TABLES WITH READ LOCK`](flush.html#flush-tables-with-read-lock).

* `LOCK_STATUS`

O status do bloqueio do subsistema de bloqueio de metadados. O valor é um dos `PENDING`, `GRANTED`, `VICTIM`, `TIMEOUT`, `KILLED`, `PRE_ACQUIRE_NOTIFY` ou `POST_RELEASE_NOTIFY`. O Schema de Desempenho atribui esses valores conforme descrito anteriormente.

* `SOURCE`

O nome do arquivo fonte que contém o código instrumentado que produziu o evento e o número da linha no arquivo onde a instrumentação ocorre. Isso permite que você verifique a fonte para determinar exatamente qual código está envolvido.

* `OWNER_THREAD_ID`

O fio que solicita uma bloqueio de metadados.

* `OWNER_EVENT_ID`

O evento que solicita uma bloqueio de metadados.

A tabela `metadata_locks` tem esses índices:

* Chave primária em (`OBJECT_INSTANCE_BEGIN`)
* Índice em (`OBJECT_TYPE`, `OBJECT_SCHEMA`, `OBJECT_NAME`)

* Índice sobre (`OWNER_THREAD_ID`, `OWNER_EVENT_ID`)

`TRUNCATE TABLE` não é permitido para a tabela `metadata_locks`.

#### 29.12.13.4 A tabela_handles

O Schema de Desempenho expõe informações sobre bloqueio de tabela através da tabela `table_handles` para mostrar os bloqueios de tabela atualmente em vigor para cada manipulador de tabela aberto. `table_handles` relata o que é registrado pelo instrumento de bloqueio de tabela. Essas informações mostram quais manipuladores de tabela o servidor tem aberto, como eles estão bloqueados e por quais sessões.

A tabela `table_handles` é somente de leitura e não pode ser atualizada. Ela é dimensionada automaticamente por padrão; para configurar o tamanho da tabela, defina a variável de sistema `performance_schema_max_table_handles` na inicialização do servidor.

A instrumentação de bloqueio de mesa utiliza o instrumento `wait/lock/table/sql/handler`, que é habilitado por padrão.

Para controlar o estado de instrumentação de bloqueio de tabela no início do servidor, use linhas como essas no seu arquivo `my.cnf`:

* Habilitar:

  ```
  [mysqld]
  performance-schema-instrument='wait/lock/table/sql/handler=ON'
  ```

* Desativar:

  ```
  [mysqld]
  performance-schema-instrument='wait/lock/table/sql/handler=OFF'
  ```

Para controlar o estado do instrumento de bloqueio de tabela no tempo de execução, atualize a tabela `setup_instruments`:

* Habilitar:

  ```
  UPDATE performance_schema.setup_instruments
  SET ENABLED = 'YES', TIMED = 'YES'
  WHERE NAME = 'wait/lock/table/sql/handler';
  ```

* Desativar:

  ```
  UPDATE performance_schema.setup_instruments
  SET ENABLED = 'NO', TIMED = 'NO'
  WHERE NAME = 'wait/lock/table/sql/handler';
  ```

A tabela `table_handles` tem essas colunas:

* `OBJECT_TYPE`

A mesa aberta por uma alça de mesa.

* `OBJECT_SCHEMA`

O esquema que contém o objeto.

* `OBJECT_NAME`

O nome do objeto instrumentado.

* `OBJECT_INSTANCE_BEGIN`

O endereço do cabo da mesa é na memória.

* `OWNER_THREAD_ID`

O fio que possui o controle da tabela.

* `OWNER_EVENT_ID`

O evento que causou a abertura da alça da mesa.

* `INTERNAL_LOCK`

O bloqueio de tabela utilizado no nível SQL. O valor é um dos `READ`, `READ WITH SHARED LOCKS`, `READ HIGH PRIORITY`, `READ NO INSERT`, `WRITE ALLOW WRITE`, `WRITE CONCURRENT INSERT`, `WRITE LOW PRIORITY` ou `WRITE`. Para informações sobre esses tipos de bloqueio, consulte o arquivo fonte `include/thr_lock.h`.

* `EXTERNAL_LOCK`

O bloqueio de tabela utilizado no nível do motor de armazenamento. O valor é um dos `READ EXTERNAL` ou `WRITE EXTERNAL`.

A tabela `table_handles` tem esses índices:

* Chave primária em (`OBJECT_INSTANCE_BEGIN`)
* Índice em (`OBJECT_TYPE`, `OBJECT_SCHEMA`, `OBJECT_NAME`)

* Índice sobre (`OWNER_THREAD_ID`, `OWNER_EVENT_ID`)

`TRUNCATE TABLE` não é permitido para a tabela `table_handles`.

### 29.12.14 Tabelas de variáveis do sistema do esquema de desempenho

O servidor MySQL mantém muitas variáveis de sistema que indicam como ele está configurado (veja Seção 7.1.8, “Variáveis de sistema do servidor”). As informações das variáveis de sistema estão disponíveis nessas tabelas do Gerador de desempenho:

* `global_variables`: Variáveis do sistema global. Uma aplicação que deseja apenas valores globais deve usar esta tabela.

* `session_variables`: Variáveis do sistema para a sessão atual. Uma aplicação que deseja todos os valores das variáveis do sistema para sua própria sessão deve usar esta tabela. Inclui as variáveis da sessão para sua sessão, bem como os valores das variáveis globais que não têm contraparte de sessão.

* `variables_by_thread`: Variáveis do sistema de sessão para cada sessão ativa. Uma aplicação que deseja saber os valores das variáveis de sessão para sessões específicas deve usar esta tabela. Ela inclui apenas as variáveis de sessão, identificadas pelo ID do thread.

* `persisted_variables`: Fornece uma interface SQL para o arquivo `mysqld-auto.cnf` que armazena configurações persistentes de variáveis de sistema global. Veja a Seção 29.12.14.1, “Tabela persistentes_variables do Performance Schema”.

* `variables_info`: Mostre, para cada variável do sistema, a fonte de onde foi definida mais recentemente e sua faixa de valores. Veja a Seção 29.12.14.2, “Tabela variáveis_info do Schema de Desempenho”.

O privilégio `SENSITIVE_VARIABLES_OBSERVER` é necessário para visualizar os valores das variáveis de sistema sensíveis nessas tabelas.

As tabelas de variáveis de sessão (`session_variables`, `variables_by_thread`) contêm informações apenas para sessões ativas, não para sessões terminadas.

As tabelas `global_variables` e `session_variables` possuem essas colunas:

* `VARIABLE_NAME`

O nome da variável do sistema.

* `VARIABLE_VALUE`

O valor da variável do sistema. Para `global_variables`, esta coluna contém o valor global. Para `session_variables`, esta coluna contém o valor da variável em vigor para a sessão atual.

As tabelas `global_variables` e `session_variables` possuem esses índices:

* Chave primária ativada (`VARIABLE_NAME`)

A tabela `variables_by_thread` tem essas colunas:

* `THREAD_ID`

O identificador do fio da sessão na qual a variável do sistema é definida.

* `VARIABLE_NAME`

O nome da variável do sistema.

* `VARIABLE_VALUE`

O valor da variável de sessão para a sessão nomeada pela coluna `THREAD_ID`.

A tabela `variables_by_thread` tem esses índices:

* Chave primária em (`THREAD_ID`, `VARIABLE_NAME`)

A tabela `variables_by_thread` contém informações de variáveis de sistema apenas sobre os threads de primeiro plano. Se nem todos os threads não forem instrumentados pelo Schema de Desempenho, esta tabela perde algumas linhas. Neste caso, a variável de status `Performance_schema_thread_instances_lost` é maior que zero.

`TRUNCATE TABLE` não é suportado para as tabelas de variáveis do sistema do Performance Schema.

#### 29.12.14.1 Tabela de variáveis persistentes do Schema de desempenho

A tabela `persisted_variables` fornece uma interface SQL para o arquivo `mysqld-auto.cnf`, que armazena configurações persistentes de variáveis globais do sistema, permitindo que o conteúdo do arquivo seja inspecionado em tempo real usando as instruções `SELECT`. As variáveis são persistidas usando as instruções `SET PERSIST` ou (set-variable.html "15.7.6.1 SET Syntax for Variable Assignment") ou `PERSIST_ONLY`; veja a Seção 15.7.6.1, “Sintaxe SET para atribuição de variáveis”. A tabela contém uma linha para cada variável persistente no arquivo. As variáveis não persistidas não aparecem na tabela.

O privilégio `SENSITIVE_VARIABLES_OBSERVER` é necessário para visualizar os valores das variáveis de sistema sensíveis nesta tabela.

Para informações sobre as variáveis de sistema persistentes, consulte a Seção 7.1.9.3, “Variáveis de sistema persistentes”.

Suponha que `mysqld-auto.cnf` pareça assim (um pouco reformatado):

```
{
  "Version": 1,
  "mysql_server": {
    "max_connections": {
      "Value": "1000",
      "Metadata": {
        "Timestamp": 1.519921706e+15,
        "User": "root",
        "Host": "localhost"
      }
    },
    "autocommit": {
      "Value": "ON",
      "Metadata": {
        "Timestamp": 1.519921707e+15,
        "User": "root",
        "Host": "localhost"
      }
    }
  }
}
```

Então, o `persisted_variables` tem esses conteúdos:

```
mysql> SELECT * FROM performance_schema.persisted_variables;
+-----------------+----------------+
| VARIABLE_NAME   | VARIABLE_VALUE |
+-----------------+----------------+
| autocommit      | ON             |
| max_connections | 1000           |
+-----------------+----------------+
```

A tabela `persisted_variables` tem essas colunas:

* `VARIABLE_NAME`

O nome da variável listado em `mysqld-auto.cnf`.

* `VARIABLE_VALUE`

O valor listado para a variável em `mysqld-auto.cnf`.

`persisted_variables` tem esses índices:

* Chave primária ativada (`VARIABLE_NAME`)

`TRUNCATE TABLE` não é permitido para a tabela `persisted_variables`.

#### 29.12.14.2 Tabela de variáveis performance_schema_info

A tabela `variables_info` mostra, para cada variável do sistema, a fonte de onde ela foi definida mais recentemente e sua faixa de valores.

A tabela `variables_info` tem essas colunas:

* `VARIABLE_NAME`

O nome da variável.

* `VARIABLE_SOURCE`

A fonte da qual a variável foi definida mais recentemente:

+ `COMMAND_LINE`

A variável foi definida na linha de comando.

+ `COMPILED`

A variável tem seu valor padrão embutido. `COMPILED` é o valor usado para variáveis que não foram definidas de outra forma.

+ `DYNAMIC`

A variável é definida no momento da execução. Isso inclui variáveis definidas dentro de arquivos especificados usando a variável de sistema `init_file`.

+ `EXPLICIT`

A variável foi definida a partir de um arquivo de opções com o nome `--defaults-file`.

+ `EXTRA`

A variável foi definida a partir de um arquivo de opções com o nome `--defaults-extra-file`.

+ `GLOBAL`

A variável foi definida a partir de um arquivo de opção global. Isso inclui arquivos de opção não cobertos por `EXPLICIT`, `EXTRA`, `LOGIN`, `PERSISTED`, `SERVER` ou `USER`.

+ `LOGIN`

A variável foi definida a partir de um arquivo de caminho de login específico do usuário (`~/.mylogin.cnf`).

+ `PERSISTED`

A variável foi definida a partir de um arquivo de opção específico do servidor `mysqld-auto.cnf`. Nenhuma linha tem esse valor se o servidor foi iniciado com `persisted_globals_load` desativado.

+ `SERVER`

A variável foi definida a partir de um arquivo de opção específico do servidor `$MYSQL_HOME/my.cnf`. Para obter detalhes sobre como `MYSQL_HOME` é definido, consulte a Seção 6.2.2.2, “Usando arquivos de opção”.

+ `USER`

A variável foi definida a partir de um arquivo de opção `~/.my.cnf` específico do usuário.

* `VARIABLE_PATH`

Se a variável foi definida a partir de um arquivo de opções, `VARIABLE_PATH` é o nome do caminho desse arquivo. Caso contrário, o valor é a string vazia.

* `MIN_VALUE`

O valor mínimo permitido para a variável. Para uma variável cujo tipo não é numérico, este é sempre 0.

* `MAX_VALUE`

O valor máximo permitido para a variável. Para uma variável cujo tipo não é numérico, este é sempre 0.

* `SET_TIME`

O horário em que a variável foi definida pela última vez. O padrão é o horário em que o servidor inicializou as variáveis do sistema global durante a inicialização.

* `SET_USER`, `SET_HOST`

O nome de usuário e o nome do host do usuário do cliente que definiu a variável mais recentemente. Se um cliente se conectar como `user17` do host `host34.example.com` usando a conta `'user17'@'%.example.com`, `SET_USER` e `SET_HOST` são `user17` e `host34.example.com`, respectivamente. Para conexões de usuários proxy, esses valores correspondem ao usuário externo (proxy), e não ao usuário proxy contra o qual a verificação de privilégios é realizada. O padrão para cada coluna é a string vazia, indicando que a variável não foi definida desde o início do servidor.

A tabela `variables_info` não tem índices.

`TRUNCATE TABLE` não é permitido para a tabela `variables_info`.

Se uma variável com um valor de `VARIABLE_SOURCE` diferente de `DYNAMIC` for definida em tempo de execução, `VARIABLE_SOURCE` se torna `DYNAMIC` e `VARIABLE_PATH` se torna a string vazia.

Uma variável de sistema que tem apenas um valor de sessão (como `debug_sync`) não pode ser definida no início ou persistida. Para variáveis de sistema que são apenas de sessão, `VARIABLE_SOURCE` pode ser apenas `COMPILED` ou `DYNAMIC`.

Se uma variável do sistema tiver um valor inesperado `VARIABLE_SOURCE`, considere o método de inicialização do seu servidor. Por exemplo, o **mysqld_safe** lê os arquivos de opção e passa certas opções que encontra lá como parte do comando que ele usa para iniciar o **mysqld**. Consequentemente, algumas variáveis do sistema que você define em arquivos de opção podem ser exibidas em `variables_info` como `COMMAND_LINE`, em vez de como `GLOBAL` ou `SERVER`, conforme você poderia esperar.

Algumas consultas de amostra que utilizam a tabela `variables_info`, com saída representativa:

* Exibir variáveis definidas na linha de comando:

  ```
  mysql> SELECT VARIABLE_NAME
         FROM performance_schema.variables_info
         WHERE VARIABLE_SOURCE = 'COMMAND_LINE'
         ORDER BY VARIABLE_NAME;
  +---------------+
  | VARIABLE_NAME |
  +---------------+
  | basedir       |
  | datadir       |
  | log_error     |
  | pid_file      |
  | plugin_dir    |
  | port          |
  +---------------+
  ```

* Exibir variáveis definidas a partir de armazenamento persistente:

  ```
  mysql> SELECT VARIABLE_NAME
         FROM performance_schema.variables_info
         WHERE VARIABLE_SOURCE = 'PERSISTED'
         ORDER BY VARIABLE_NAME;
  +--------------------------+
  | VARIABLE_NAME            |
  +--------------------------+
  | event_scheduler          |
  | max_connections          |
  | validate_password.policy |
  +--------------------------+
  ```

* Junte-se à tabela `variables_info` com a tabela `global_variables` para exibir os valores atuais das variáveis persistidas, juntamente com sua faixa de valores:

  ```
  mysql> SELECT
           VI.VARIABLE_NAME, GV.VARIABLE_VALUE,
           VI.MIN_VALUE,VI.MAX_VALUE
         FROM performance_schema.variables_info AS VI
           INNER JOIN performance_schema.global_variables AS GV
           USING(VARIABLE_NAME)
         WHERE VI.VARIABLE_SOURCE = 'PERSISTED'
         ORDER BY VARIABLE_NAME;
  +--------------------------+----------------+-----------+-----------+
  | VARIABLE_NAME            | VARIABLE_VALUE | MIN_VALUE | MAX_VALUE |
  +--------------------------+----------------+-----------+-----------+
  | event_scheduler          | ON             | 0         | 0         |
  | max_connections          | 200            | 1         | 100000    |
  | validate_password.policy | STRONG         | 0         | 0         |
  +--------------------------+----------------+-----------+-----------+
  ```

### 29.12.15 Tabelas de variáveis de status do esquema de desempenho

O servidor MySQL mantém muitas variáveis de status que fornecem informações sobre sua operação (veja Seção 7.1.10, “Variáveis de Status do Servidor”). As informações das variáveis de status estão disponíveis nessas tabelas do Gerador de Desempenho:

* `global_status`: Variáveis de status global. Uma aplicação que deseja apenas valores globais deve usar esta tabela.

* `session_status`: Variáveis de status para a sessão atual. Uma aplicação que deseja todos os valores das variáveis de status para sua própria sessão deve usar esta tabela. Ela inclui as variáveis de sessão para sua sessão, bem como os valores das variáveis globais que não têm contraparte de sessão.

* `status_by_thread`: Variáveis de status de sessão para cada sessão ativa. Uma aplicação que deseja saber os valores das variáveis de sessão para sessões específicas deve usar esta tabela. Ela inclui apenas as variáveis de sessão, identificadas pelo ID de thread.

Há também tabelas resumidas que fornecem informações sobre variáveis de status agregadas por conta, nome de host e nome de usuário. Veja a Seção 29.12.20.12, “Tabelas Resumo de Variáveis de Status”.

As tabelas de variáveis de sessão (`session_status`, `status_by_thread`) contêm informações apenas para sessões ativas, não para sessões terminadas.

O Schema de Desempenho coleta estatísticas para variáveis de status globais apenas para os threads para os quais o valor `INSTRUMENTED` é `YES` na tabela `threads`. As estatísticas para variáveis de status de sessão são sempre coletadas, independentemente do valor `INSTRUMENTED`.

O Schema de Desempenho não coleta estatísticas para as variáveis de status `Com_xxx` nas tabelas de variáveis de status. Para obter contagens globais e por execução de declarações de sessão, use as tabelas `events_statements_summary_global_by_event_name` e `events_statements_summary_by_thread_by_event_name`, respectivamente. Por exemplo:

```
SELECT EVENT_NAME, COUNT_STAR
FROM performance_schema.events_statements_summary_global_by_event_name
WHERE EVENT_NAME LIKE 'statement/sql/%';
```

As tabelas `global_status` e `session_status` possuem essas colunas:

* `VARIABLE_NAME`

O nome da variável de status.

* `VARIABLE_VALUE`

O valor da variável de status. Para `global_status`, esta coluna contém o valor global. Para `session_status`, esta coluna contém o valor da variável para a sessão atual.

As tabelas `global_status` e `session_status` possuem esses índices:

* Chave primária ativada (`VARIABLE_NAME`)

A tabela `status_by_thread` contém o status de cada fio ativo. Ela tem as seguintes colunas:

* `THREAD_ID`

O identificador do fio da sessão na qual a variável de status é definida.

* `VARIABLE_NAME`

O nome da variável de status.

* `VARIABLE_VALUE`

O valor da variável de sessão para a sessão nomeada pela coluna `THREAD_ID`.

A tabela `status_by_thread` tem esses índices:

* Chave primária em (`THREAD_ID`, `VARIABLE_NAME`)

A tabela `status_by_thread` contém informações sobre variáveis de status apenas sobre os threads de primeiro plano. Se a variável de sistema `performance_schema_max_thread_instances` não estiver ajustada automaticamente (indicada por um valor de −1) e o número máximo permitido de objetos de thread instrumentados não for maior que o número de threads de segundo plano, a tabela estará vazia.

O Schema de Desempenho suporta `TRUNCATE TABLE`(truncate-table.html "15.1.37 TRUNCATE TABLE Statement") para tabelas de variáveis de status da seguinte forma:

* `global_status`: Redefine o estado do fio, da conta, do host e do usuário. Redefine as variáveis de status globais, exceto aquelas que o servidor nunca redefine.

* `session_status`: Não é suportado.
* `status_by_thread`: Agrupa o status de todas as threads no status global e no status da conta, e, em seguida, redefine o status da thread. Se as estatísticas da conta não forem coletadas, o status da sessão é adicionado ao status do host e do usuário, se o status do host e do usuário forem coletados.

As estatísticas de conta, hospedagem e usuário não são coletadas se as variáveis de sistema `performance_schema_accounts_size`, `performance_schema_hosts_size` e `performance_schema_users_size`, respectivamente, forem definidas como 0.

`FLUSH STATUS` adiciona o status da sessão de todas as sessões ativas às variáveis de status globais, refaz o status de todas as sessões ativas e refaz os valores de status de conta, host e usuário agregados de sessões desconectadas.

### 29.12.16 Tabelas do Pool de Fuso de Programação de Desempenho

Nota

As tabelas do Schema de Desempenho descritas aqui estão disponíveis a partir do MySQL 8.0.14. Antes do MySQL 8.0.14, use as tabelas correspondentes `INFORMATION_SCHEMA` em vez disso; veja a Seção 28.5, “Tabelas do Pool de Spool de INFORMAÇÃO_SCHEMA”.

As seções a seguir descrevem as tabelas do Schema de Desempenho associadas ao plugin de pool de threads (consulte a Seção 7.6.3, “MySQL Enterprise Thread Pool”). Elas fornecem informações sobre a operação do pool de threads:

* `tp_thread_group_state`: Informações sobre os estados do grupo de threads do pool de threads.

* `tp_thread_group_stats`: Estatísticas do grupo de fios.

* `tp_thread_state`: Informações sobre os estados dos threads do pool de threads.

As linhas nessas tabelas representam instantâneos no tempo. No caso de `tp_thread_state`, todas as linhas de um grupo de threads compreendem um instantâneo no tempo. Assim, o servidor MySQL mantém o mutex do grupo de threads enquanto produz o instantâneo. Mas ele não mantém mutexes em todos os grupos de threads ao mesmo tempo, para evitar que uma declaração contra `tp_thread_state` bloqueie todo o servidor MySQL.

As tabelas do pool de threads do Schema de desempenho são implementadas pelo plugin de pool de threads e são carregadas e descarregadas quando esse plugin é carregado e descarregado (consulte a Seção 7.6.3.2, “Instalação do Pool de Threads”). Não é necessário realizar nenhuma etapa de configuração especial para as tabelas. No entanto, as tabelas dependem do plugin de pool de threads estar habilitado. Se o plugin de pool de threads for carregado, mas desabilitado, as tabelas não serão criadas.

#### 29.12.16.1 A tabela tp_thread_group_state

Nota

A tabela do Schema de desempenho descrita aqui está disponível a partir do MySQL 8.0.14. Antes do MySQL 8.0.14, use a tabela correspondente `INFORMATION_SCHEMA` em vez disso; veja a Seção 28.5.2, “A tabela TP_THREAD_GROUP_STATE do INFORMATION_SCHEMA”.

A tabela `tp_thread_group_state` tem uma linha por grupo de thread no pool de threads. Cada linha fornece informações sobre o estado atual de um grupo.

A tabela `tp_thread_group_state` tem essas colunas:

* `TP_GROUP_ID`

O ID do grupo de fios. É uma chave única dentro da tabela.

* `CONSUMER THREADS`

O número de threads de consumo. Há, no máximo, uma thread pronta para começar a executar se as threads ativas ficarem paradas ou bloqueadas.

* `RESERVE_THREADS`

O número de threads no estado reservado. Isso significa que elas não são iniciadas até que haja a necessidade de despertar um novo thread e não haja um thread consumidor. É onde a maioria das threads acaba quando o grupo de threads criou mais threads do que o necessário para o funcionamento normal. Muitas vezes, um grupo de threads precisa de threads adicionais por um curto período e, em seguida, não as precisa novamente por um tempo. Neste caso, elas entram no estado reservado e permanecem até serem necessárias novamente. Elas ocupam alguns recursos de memória extras, mas não recursos de computação extras.

* `CONNECT_THREAD_COUNT`

O número de threads que estão processando ou aguardando para processar a inicialização e autenticação da conexão. Pode haver um máximo de quatro threads de conexão por grupo de threads; essas threads expiram após um período de inatividade.

* `CONNECTION_COUNT`

O número de conexões que utilizam este grupo de fios.

* `QUEUED_QUERIES`

O número de declarações que estão na fila de alta prioridade.

* `QUEUED_TRANSACTIONS`

O número de declarações esperando na fila de baixa prioridade. Estas são as declarações iniciais para transações que não foram iniciadas, portanto, elas também representam transações em fila.

* `STALL_LIMIT`

O valor da variável de sistema `thread_pool_stall_limit` para o grupo de threads. Este é o mesmo valor para todos os grupos de threads.

* `PRIO_KICKUP_TIMER`

O valor da variável de sistema `thread_pool_prio_kickup_timer` para o grupo de threads. Este é o mesmo valor para todos os grupos de threads.

* `ALGORITHM`

O valor da variável de sistema `thread_pool_algorithm` para o grupo de threads. Este é o mesmo valor para todos os grupos de threads.

* `THREAD_COUNT`

O número de threads iniciadas na fila de threads como parte deste grupo de threads.

* `ACTIVE_THREAD_COUNT`

O número de threads ativas para executar instruções.

* `STALLED_THREAD_COUNT`

O número de declarações paralisadas no grupo de threads. Uma declaração paralisada pode estar sendo executada, mas, do ponto de vista de um pool de threads, está paralisada e não está progredindo. Uma declaração de longa duração acaba rapidamente nesta categoria.

* `WAITING_THREAD_NUMBER`

Se houver um fio que lida com a verificação de declarações no grupo de fios, isso especifica o número do fio dentro deste grupo de fios. É possível que este fio possa estar executando uma declaração.

* `OLDEST_QUEUED`

Quanto tempo, em milissegundos, a declaração mais antiga na fila de espera está esperando para ser executada.

* `MAX_THREAD_IDS_IN_GROUP`

O ID máximo do fio dos fios do grupo. Isso é o mesmo que `MAX(TP_THREAD_NUMBER)` para os fios quando selecionados da tabela `tp_thread_state`. Ou seja, essas duas consultas são equivalentes:

  ```
  SELECT TP_GROUP_ID, MAX_THREAD_IDS_IN_GROUP
  FROM tp_thread_group_state;

  SELECT TP_GROUP_ID, MAX(TP_THREAD_NUMBER)
  FROM tp_thread_state GROUP BY TP_GROUP_ID;
  ```

A tabela `tp_thread_group_state` tem esses índices:

* Índice único em (`TP_GROUP_ID`)

`TRUNCATE TABLE` não é permitido para a tabela `tp_thread_group_state`.

#### 29.12.16.2 A tabela tp_thread_group_stats

Nota

A tabela do Schema de desempenho descrita aqui está disponível a partir do MySQL 8.0.14. Antes do MySQL 8.0.14, use a tabela correspondente `INFORMATION_SCHEMA` em vez disso; veja a Seção 28.5.3, “A tabela TP_THREAD_GROUP_STATS do INFORMATION_SCHEMA”.

A tabela `tp_thread_group_stats` reporta estatísticas por grupo de thread. Há uma linha por grupo.

A tabela `tp_thread_group_stats` tem essas colunas:

* `TP_GROUP_ID`

O ID do grupo de fios. É uma chave única dentro da tabela.

* `CONNECTIONS_STARTED`

O número de conexões iniciadas.

* `CONNECTIONS_CLOSED`

Número de conexões fechadas.

* `QUERIES_EXECUTED`

O número de declarações executadas. Esse número é incrementado quando uma declaração começa a ser executada, não quando ela termina.

* `QUERIES_QUEUED`

O número de declarações recebidas que estavam em fila para execução. Isso não conta as declarações que o grupo de threads conseguiu começar a executar imediatamente sem colocar em fila, o que pode acontecer nas condições descritas na Seção 7.6.3.3, "Operação do Pool de Threads".

* `THREADS_STARTED`

Número de threads iniciadas.

* `PRIO_KICKUPS`

O número de declarações que foram movidas da fila de baixa prioridade para a fila de alta prioridade com base no valor da variável de sistema `thread_pool_prio_kickup_timer`. Se esse número aumentar rapidamente, considere aumentar o valor dessa variável. Um contador que aumenta rapidamente significa que o sistema de priorização não está impedindo que as transações comecem muito cedo. Para `InnoDB`, isso provavelmente significa um desempenho deteriorado devido ao número excessivo de transações concorrentes.

* `STALLED_QUERIES_EXECUTED`

O número de declarações que se tornaram definidas como travadas devido à execução por mais tempo do que o valor da variável de sistema `thread_pool_stall_limit`.

* `BECOME_CONSUMER_THREAD`

O número de vezes que o fio foi atribuído ao papel de fio consumidor.

* `BECOME_RESERVE_THREAD`

O número de vezes que os threads receberam o papel de thread de reserva.

* `BECOME_WAITING_THREAD`

O número de vezes em que os threads receberam o papel de servidor. Quando as instruções são colocadas em fila, isso acontece com frequência, mesmo em operação normal, então aumentos rápidos neste valor são normais no caso de um sistema altamente carregado, onde as instruções estão em fila.

* `WAKE_THREAD_STALL_CHECKER`

O número de vezes que o thread de verificação do ponto de venda decidiu acordar ou criar um thread para possivelmente lidar com algumas declarações ou cuidar do papel do thread do garçom.

* `SLEEP_WAITS`

O número de espera `THD_WAIT_SLEEP`. Esses ocorrem quando os threads entram em sono (por exemplo, ao chamar a função `SLEEP()`).

* `DISK_IO_WAITS`

O número de espera `THD_WAIT_DISKIO`. Esses ocorrem quando os threads realizam operações de E/S de disco que provavelmente não atingem o cache do sistema de arquivos. Tais espera ocorrem quando o pool de buffers lê e escreve dados no disco, e não para leituras normais de e para arquivos.

* `ROW_LOCK_WAITS`

O número de espera `THD_WAIT_ROW_LOCK` para a liberação de um bloqueio de linha por outra transação.

* `GLOBAL_LOCK_WAITS`

O número de espera `THD_WAIT_GLOBAL_LOCK` aguarda que um bloqueio global seja liberado.

* `META_DATA_LOCK_WAITS`

O número de espera `THD_WAIT_META_DATA_LOCK` aguarda que uma trava de metadados seja liberada.

* `TABLE_LOCK_WAITS`

O número de espera `THD_WAIT_TABLE_LOCK` por uma tabela que precisa ser desbloqueada para que a declaração acesse.

* `USER_LOCK_WAITS`

O número de espera `THD_WAIT_USER_LOCK` aguarda por um bloqueio especial construído pelo thread do usuário.

* `BINLOG_WAITS`

O número de espera `THD_WAIT_BINLOG_WAITS` aguarda que o log binário se torne livre.

* `GROUP_COMMIT_WAITS`

O número de espera `THD_WAIT_GROUP_COMMIT`. Esses ocorrem quando um compromisso de grupo deve esperar que as outras partes completem sua parte de uma transação.

* `FSYNC_WAITS`

O número de espera de `THD_WAIT_SYNC` por uma operação de sincronização de arquivos.

A tabela `tp_thread_group_stats` tem esses índices:

* Índice único sobre (`TP_GROUP_ID`)

`TRUNCATE TABLE` não é permitido para a tabela `tp_thread_group_stats`.

#### 29.12.16.3 A tabela tp_thread_state

Nota

A tabela do Schema de desempenho descrita aqui está disponível a partir do MySQL 8.0.14. Antes do MySQL 8.0.14, use a tabela correspondente `INFORMATION_SCHEMA` em vez disso; veja a Seção 28.5.4, “A tabela TP_THREAD_STATE do INFORMATION_SCHEMA”.

A tabela `tp_thread_state` tem uma linha por fio criado pelo pool de threads para lidar com as conexões.

A tabela `tp_thread_state` tem essas colunas:

* `TP_GROUP_ID`

O ID do grupo de fios.

* `TP_THREAD_NUMBER`

O ID do fio dentro de seu grupo de fios. `TP_GROUP_ID` e `TP_THREAD_NUMBER` fornecem juntos uma chave única na tabela.

* `PROCESS_COUNT`

O intervalo de 10 ms no qual a declaração que utiliza este fio está atualmente sendo executada. 0 significa que nenhuma declaração está sendo executada, 1 significa que está nos primeiros 10 ms, e assim por diante.

* `WAIT_TYPE`

O tipo de espera do fio. `NULL` significa que o fio não está bloqueado. Caso contrário, o fio está bloqueado por uma chamada para `thd_wait_begin()` e o valor especifica o tipo de espera. As colunas `xxx_WAIT` da tabela `tp_thread_group_stats` acumulam contagens para cada tipo de espera.

O valor `WAIT_TYPE` é uma string que descreve o tipo de espera, conforme mostrado na tabela a seguir.

**Tabela 29.6 tp_thread_state Tabela WAIT_TYPE Valores**

  <table summary="tp_thread_state table WAIT_TYPE values. The first column is the wait type. The second column describes the wait type."><col style="width: 35%"/><col style="width: 65%"/><thead><tr> <th>Wait Type</th> <th>Significado</th> </tr></thead><tbody><tr> <td><code>THD_WAIT_SLEEP</code></td> <td>Esperando dormir</td> </tr><tr> <td><code>THD_WAIT_DISKIO</code></td> <td>Esperando por IO de disco</td> </tr><tr> <td><code>THD_WAIT_ROW_LOCK</code></td> <td>Esperando por bloqueio de linha</td> </tr><tr> <td><code>THD_WAIT_GLOBAL_LOCK</code></td> <td>Esperando por bloqueio global</td> </tr><tr> <td><code>THD_WAIT_META_DATA_LOCK</code></td> <td>Esperando por bloqueio de metadados</td> </tr><tr> <td><code>THD_WAIT_TABLE_LOCK</code></td> <td>Esperando por bloqueio de mesa</td> </tr><tr> <td><code>THD_WAIT_USER_LOCK</code></td> <td>Esperando bloqueio do usuário</td> </tr><tr> <td><code>THD_WAIT_BINLOG</code></td> <td>Esperando binlog</td> </tr><tr> <td><code>THD_WAIT_GROUP_COMMIT</code></td> <td>Esperando pelo commit do grupo</td> </tr><tr> <td><code>THD_WAIT_SYNC</code></td> <td>Esperando por fsync</td> </tr></tbody></table>

* `TP_THREAD_TYPE`

O tipo de fio. O valor mostrado nesta coluna é um dos `CONNECTION_HANDLER_WORKER_THREAD`, `LISTENER_WORKER_THREAD`, `QUERY_WORKER_THREAD` ou `TIMER_WORKER_THREAD`.

Esta coluna foi adicionada no MySQL 8.0.32.

* `THREAD_ID`

Identificador único deste fio. O valor é o mesmo que o utilizado na coluna `THREAD_ID` da tabela do Schema de Desempenho `threads`.

Esta coluna foi adicionada no MySQL 8.0.32.

A tabela `tp_thread_state` tem esses índices:

* Índice único em (`TP_GROUP_ID`, `TP_THREAD_NUMBER`)

`TRUNCATE TABLE` não é permitido para a tabela `tp_thread_state`.

### 29.12.17 Tabelas do Firewall do Schema de Desempenho

Nota

As tabelas do Schema de desempenho descritas aqui estão disponíveis a partir do MySQL 8.0.23. Antes do MySQL 8.0.23, use as tabelas correspondentes `INFORMATION_SCHEMA` em vez disso; veja as tabelas do Firewall Empresarial do MySQL.

As seções a seguir descrevem as tabelas do Schema de Desempenho associadas ao Firewall Empresarial MySQL (consulte a Seção 8.4.7, “Firewall Empresarial MySQL”). Elas fornecem informações sobre o funcionamento do firewall:

* `firewall_groups`: Informações sobre perfis de grupos de firewall.

* `firewall_group_allowlist`: Regras de lista de permissão de perfis de grupo de firewall registrados.

* `firewall_membership`: Membros (contas) de perfis de grupos de firewall registrados.

#### 29.12.17.1 A tabela firewall_groups

A tabela `firewall_groups` fornece uma visão do cache de dados em memória para o MySQL Enterprise Firewall. Ela lista os nomes e os modos operacionais dos perfis de grupo de firewall registrados. Ela é usada em conjunto com a tabela do sistema `mysql.firewall_groups` que fornece armazenamento persistente dos dados do firewall; veja Tabelas do MySQL Enterprise Firewall.

A tabela `firewall_groups` tem essas colunas:

* `NAME`

O nome do perfil do grupo.

* `MODE`

O modo operacional atual para o perfil. Os valores permitidos para o modo são `OFF`, `DETECTING`, `PROTECTING` e `RECORDING`. Para obter detalhes sobre seus significados, consulte Conceitos de Firewall.

* `USERHOST`

A conta de treinamento para o perfil do grupo, a ser usada quando o perfil estiver no modo `RECORDING`. O valor é `NULL`, ou uma conta que não seja `NULL` e que tenha o formato `user_name@host_name`:

+ Se o valor for `NULL`, as regras de permissão do firewall permitem listas de endereços para declarações recebidas de qualquer conta que seja membro do grupo.

+ Se o valor não for `NULL`, as regras de permissão do firewall permitem apenas declarações recebidas da conta designada (que deve ser membro do grupo).

A tabela `firewall_groups` não tem índices.

`TRUNCATE TABLE` não é permitido para a tabela `firewall_groups`.

A tabela `firewall_groups` foi adicionada no MySQL 8.0.23.

#### 29.12.17.2 Tabela firewall_group_allowlist

A tabela `firewall_group_allowlist` fornece uma visão do cache de dados em memória para o MySQL Enterprise Firewall. Ela lista as regras da lista de permissão dos perfis de grupo de firewall registrados. Ela é usada em conjunto com a tabela do sistema `mysql.firewall_group_allowlist` que fornece armazenamento persistente dos dados do firewall; veja Tabelas do MySQL Enterprise Firewall.

A tabela `firewall_group_allowlist` tem essas colunas:

* `NAME`

O nome do perfil do grupo.

* `RULE`

Uma declaração normalizada que indica um padrão de declaração aceitável para o perfil. Um allowlist de perfil é a união de suas regras.

A tabela `firewall_group_allowlist` não tem índices.

`TRUNCATE TABLE` não é permitido para a tabela `firewall_group_allowlist`.

A tabela `firewall_group_allowlist` foi adicionada no MySQL 8.0.23.

#### 29.12.17.3 A tabela firewall_membership

A tabela `firewall_membership` fornece uma visão do cache de dados em memória para o MySQL Enterprise Firewall. Ela lista os membros (contas) dos perfis de grupo de firewall registrados. Ela é usada em conjunto com a tabela do sistema `mysql.firewall_membership` que fornece armazenamento persistente dos dados do firewall; veja Tabelas do MySQL Enterprise Firewall.

A tabela `firewall_membership` tem essas colunas:

* `GROUP_ID`

O nome do perfil do grupo.

* `MEMBER_ID`

O nome de uma conta que é membro do perfil.

A tabela `firewall_membership` não tem índices.

`TRUNCATE TABLE` não é permitido para a tabela `firewall_membership`.

A tabela `firewall_membership` foi adicionada no MySQL 8.0.23.

### 29.12.18 Tabelas do Keychain de Schema de Desempenho

As seções a seguir descrevem as tabelas do Schema de Desempenho associadas ao chaveiro MySQL (consulte a Seção 8.4.4, “O Chaveiro MySQL”). Elas fornecem informações sobre as operações do chaveiro:

* `keyring_component_status`: Informações sobre o componente do chaveiro em uso.

* `keyring_keys`: Metadados para as chaves no chaveiro MySQL.

#### 29.12.18.1 A tabela keyring_component_status

A tabela `keyring_component_status` (disponível a partir do MySQL 8.0.24) fornece informações de status sobre as propriedades do componente de chaveiro em uso, se um deles estiver instalado. A tabela está vazia se nenhum componente de chaveiro estiver instalado (por exemplo, se o chaveiro não estiver sendo usado ou estiver configurado para gerenciar a chave de armazenamento usando um plugin de chaveiro em vez de um componente de chaveiro).

Não há um conjunto fixo de propriedades. Cada componente do chaveiro é livre para definir seu próprio conjunto.

Exemplo `keyring_component_status` de conteúdo:

```
mysql> SELECT * FROM performance_schema.keyring_component_status;
+---------------------+-------------------------------------------------+
| STATUS_KEY          | STATUS_VALUE                                    |
+---------------------+-------------------------------------------------+
| Component_name      | component_keyring_file                          |
| Author              | Oracle Corporation                              |
| License             | GPL                                             |
| Implementation_name | component_keyring_file                          |
| Version             | 1.0                                             |
| Component_status    | Active                                          |
| Data_file           | /usr/local/mysql/keyring/component_keyring_file |
| Read_only           | No                                              |
+---------------------+-------------------------------------------------+
```

A tabela `keyring_component_status` tem essas colunas:

* `STATUS_KEY`

O nome do item de status.

* `STATUS_VALUE`

O valor do item de status.

A tabela `keyring_component_status` não tem índices.

`TRUNCATE TABLE` não é permitido para a tabela `keyring_component_status`.

#### 29.12.18.2 A tabela keyring_keys

O MySQL Server suporta um chaveiro que permite que os componentes internos do servidor e os plugins armazenem informações sensíveis de forma segura para recuperação posterior. Veja a Seção 8.4.4, “O chaveiro MySQL”.

A partir do MySQL 8.0.16, a tabela `keyring_keys` exibe metadados para as chaves no chaveiro. Os metadados das chaves incluem IDs de chave, proprietários de chave e IDs de chave de backend. A tabela `keyring_keys` *não* exibe nenhum dado sensível do chaveiro, como o conteúdo das chaves.

A tabela `keyring_keys` tem essas colunas:

* `KEY_ID`

O identificador chave.

* `KEY_OWNER`

O proprietário da chave.

* `BACKEND_KEY_ID`

O ID usado para a chave pelo backend do chaveiro.

A tabela `keyring_keys` não tem índices.

`TRUNCATE TABLE` não é permitido para a tabela `keyring_keys`.

### 29.12.19 Clonar tabelas do Schema de desempenho

Nota

As tabelas do Schema de Desempenho descritas aqui estão disponíveis a partir do MySQL 8.0.17.

As seções a seguir descrevem as tabelas do Schema de Desempenho associadas ao plugin de clonagem (consulte a Seção 7.6.7, “O Plugin de Clonagem”). As tabelas fornecem informações sobre operações de clonagem.

* `clone_status`: informações de status sobre a operação de clonagem atual ou a última executada.

* `clone_progress`: informações sobre o progresso da operação de clonagem atual ou da última operação executada.

As tabelas de clone do Schema de Desempenho são implementadas pelo plugin clone e são carregadas e descarregadas quando esse plugin é carregado e descarregado (consulte a Seção 7.6.7.1, “Instalando o Plugin Clone”). Não é necessário realizar nenhuma etapa de configuração especial para as tabelas. No entanto, as tabelas dependem do plugin clone estar habilitado. Se o plugin clone estiver carregado, mas desabilitado, as tabelas não serão criadas.

As tabelas das tabelas de clonagem do esquema de desempenho são usadas apenas na instância do servidor MySQL do destinatário. Os dados são persistidos mesmo após o desligamento e o reinício do servidor.

#### 29.12.19.1 Tabela clone_status

Nota

A tabela Schema de desempenho descrita aqui está disponível a partir do MySQL 8.0.17.

A tabela `clone_status` mostra o status da operação de clonagem atual ou da última operação executada. A tabela sempre contém apenas uma linha de dados, ou está vazia.

A tabela `clone_status` tem essas colunas:

* `ID`

Um identificador único de operação de clonagem na instância atual do servidor MySQL.

* `PID`

Lista de ID do processo da sessão que executa a operação de clonagem.

* `STATE`

Estado atual da operação de clonagem. Os valores incluem `Not Started`, `In Progress`, `Completed` e `Failed`.

* `BEGIN_TIME`

Um marcador de tempo no formato `'YYYY-MM-DD hh:mm:ss[.fraction]'` que mostra quando a operação de clonagem começou.

* `END_TIME`

Um marcador de tempo no formato `'YYYY-MM-DD hh:mm:ss[.fraction]'` que mostra quando a operação de clonagem foi concluída. Representa NULL se a operação não tiver sido concluída.

* `SOURCE`

O endereço do servidor MySQL do doador no formato '`HOST:PORT`'. A coluna exibe '`LOCAL INSTANCE`' para uma operação de clonagem local.

* `DESTINATION`

O diretório que será clonado.

* `ERROR_NO`

O número de erro relatado para uma operação de clonagem falha.

* `ERROR_MESSAGE`

A string de mensagem de erro para uma operação de clonagem falha.

* `BINLOG_FILE`

O nome do arquivo de registro binário até o qual os dados são clonados.

* `BINLOG_POSITION`

O deslocamento do arquivo de registro binário até o qual os dados são clonados.

* `GTID_EXECUTED`

O valor GTID para a última transação clonada.

A tabela `clone_status` é somente de leitura. DDL, incluindo `TRUNCATE TABLE`, não é permitido.

#### 29.12.19.2 Tabela clone_progress

Nota

A tabela Schema de desempenho descrita aqui está disponível a partir do MySQL 8.0.17.

A tabela `clone_progress` mostra informações de progresso apenas para a operação de clonagem atual ou a última executada.

As etapas de uma operação de clonagem incluem `DROP DATA`, `FILE COPY`, `PAGE_COPY`, `REDO_COPY`, `FILE_SYNC`, `RESTART` e `RECOVERY`. Uma operação de clonagem produz um registro para cada etapa. Portanto, a tabela nunca contém mais que sete linhas de dados, ou está vazia.

A tabela `clone_progress` tem essas colunas:

* `ID`

Um identificador único de operação de clonagem na instância atual do servidor MySQL.

* `STAGE`

O nome da etapa atual de clonagem. As etapas incluem `DROP DATA`, `FILE COPY`, `PAGE_COPY`, `REDO_COPY`, `FILE_SYNC`, `RESTART` e `RECOVERY`.

* `STATE`

O estado atual da fase de clonagem. Os estados incluem `Not Started`, `In Progress` e `Completed`.

* `BEGIN_TIME`

Um marcador de tempo no formato `'YYYY-MM-DD hh:mm:ss[.fraction]'` que mostra quando a fase de clonagem começou. Representa NULL se a fase não tiver começado.

* `END_TIME`

Um marcador de tempo no formato `'YYYY-MM-DD hh:mm:ss[.fraction]'` que mostra quando a fase de clonagem terminou. Representa NULL se a fase não tiver terminado.

* `THREADS`

O número de threads concorrentes utilizadas na etapa.

* `ESTIMATE`

O valor estimado de dados para a etapa atual, em bytes.

* `DATA`

A quantidade de dados transferidos no estado atual, em bytes.

* `NETWORK`

A quantidade de dados de rede transferidos no estado atual, em bytes.

* `DATA_SPEED`

A velocidade atual de transferência de dados, em bytes por segundo. Esse valor pode diferir da taxa máxima de transferência de dados solicitada definida por `clone_max_data_bandwidth`.

* `NETWORK_SPEED`

A velocidade atual de transferência de rede em bytes por segundo.

A tabela `clone_progress` é somente de leitura. DDL, incluindo `TRUNCATE TABLE`, não é permitido.

### 29.12.20 Tabelas de Resumo do Schema de Desempenho

As tabelas resumidas fornecem informações agregadas para eventos terminados ao longo do tempo. As tabelas deste grupo resumem os dados dos eventos de diferentes maneiras.

Cada tabela de resumo tem colunas de agrupamento que determinam como os dados devem ser agrupados e colunas de resumo que contêm os valores agregados. Tabelas que resumem eventos de maneiras semelhantes geralmente têm conjuntos semelhantes de colunas de resumo e diferem apenas nas colunas de agrupamento usadas para determinar como os eventos são agregados.

As tabelas resumidas podem ser truncadas com `TRUNCATE TABLE`. Geralmente, o efeito é redefinir as colunas resumidas para 0 ou `NULL`, e não remover linhas. Isso permite que você limpe os valores coletados e reinicie a agregação. Isso pode ser útil, por exemplo, depois de ter feito uma alteração na configuração de execução. Exceções a esse comportamento de truncação são mencionadas nas seções individuais das tabelas resumidas.

#### Resumos de eventos de espera

**Tabela 29.7 Tabelas de Resumo de Eventos de Aguarda do Schema de Desempenho**

<table frame="box" rules="all" summary="A reference that lists all Performance Schema wait event summary tables."><col style="width: 28%"/><col style="width: 71%"/><thead><tr><th>Table Name</th> <th>Descrição</th> </tr></thead><tbody><tr><td><code>events_waits_summary_by_account_by_event_name</code></td> <td>Eventos esperados por conta e nome do evento</td> </tr><tr><td><code>events_waits_summary_by_host_by_event_name</code></td> <td>Eventos esperados por nome de host e nome de evento</td> </tr><tr><td><code>events_waits_summary_by_instance</code></td> <td>Eventos de espera por instância</td> </tr><tr><td><code>events_waits_summary_by_thread_by_event_name</code></td> <td>Eventos de espera por fio e nome do evento</td> </tr><tr><td><code>events_waits_summary_by_user_by_event_name</code></td> <td>Eventos esperados por nome de usuário e nome de evento</td> </tr><tr><td><code>events_waits_summary_global_by_event_name</code></td> <td>Eventos esperados por nome de evento</td> </tr></tbody></table>

#### Resumos das etapas

**Tabela 29.8 Tabelas de Resumo de Eventos de Etapas do Schema de Desempenho**

<table frame="box" rules="all" summary="A reference that lists all Performance Schema stage event summary tables."><col style="width: 28%"/><col style="width: 71%"/><thead><tr><th>Table Name</th> <th>Descrição</th> </tr></thead><tbody><tr><td><code>events_stages_summary_by_account_by_event_name</code></td> <td>Eventos em andamento por conta e nome do evento</td> </tr><tr><td><code>events_stages_summary_by_host_by_event_name</code></td> <td>Eventos em andamento por nome do anfitrião e nome do evento</td> </tr><tr><td><code>events_stages_summary_by_thread_by_event_name</code></td> <td>Espera de palco por thread e nome de evento</td> </tr><tr><td><code>events_stages_summary_by_user_by_event_name</code></td> <td>Eventos em andamento por nome do usuário e nome do evento</td> </tr><tr><td><code>events_stages_summary_global_by_event_name</code></td> <td>Esperas de palco por nome de evento</td> </tr></tbody></table>

#### Resumos de declarações

**Tabela 29.9 Tabelas de Resumo de Eventos de Declaração do Schema de Desempenho**

<table frame="box" rules="all" summary="A reference that lists all Performance Schema statement event summary tables."><col style="width: 28%"/><col style="width: 71%"/><thead><tr><th>Table Name</th> <th>Descrição</th> </tr></thead><tbody><tr><td><code>events_statements_histogram_by_digest</code></td> <td>Histograma de declaração por esquema e valor de digestão</td> </tr><tr><td><code>events_statements_histogram_global</code></td> <td>Histograma de declaração resumido globalmente</td> </tr><tr><td><code>events_statements_summary_by_account_by_event_name</code></td> <td>Eventos declarados por conta e nome de evento</td> </tr><tr><td><code>events_statements_summary_by_digest</code></td> <td>Eventos declarativos por esquema e valor de digestão</td> </tr><tr><td><code>events_statements_summary_by_host_by_event_name</code></td> <td>Eventos declarados por nome de anfitrião e nome do evento</td> </tr><tr><td><code>events_statements_summary_by_program</code></td> <td>Eventos declarados por programa armazenado</td> </tr><tr><td><code>events_statements_summary_by_thread_by_event_name</code></td> <td>Eventos declarados por fio e nome de evento</td> </tr><tr><td><code>events_statements_summary_by_user_by_event_name</code></td> <td>Eventos declarativos por nome de usuário e nome de evento</td> </tr><tr><td><code>events_statements_summary_global_by_event_name</code></td> <td>Eventos declarativos por nome de evento</td> </tr><tr><td><code>prepared_statements_instances</code></td> <td>Instâncias de declaração preparada e estatísticas</td> </tr></tbody></table>

#### Resumos de transações

**Tabela 29.10 Tabelas de Resumo de Eventos de Transação do Schema de Desempenho**

<table frame="box" rules="all" summary="A reference that lists all Performance Schema transaction event summary tables."><col style="width: 28%"/><col style="width: 71%"/><thead><tr><th>Table Name</th> <th>Descrição</th> </tr></thead><tbody><tr><td><code>events_transactions_summary_by_account_by_event_name</code></td> <td>Eventos de transação por conta e nome do evento</td> </tr><tr><td><code>events_transactions_summary_by_host_by_event_name</code></td> <td>Eventos de transação por nome de host e nome de evento</td> </tr><tr><td><code>events_transactions_summary_by_thread_by_event_name</code></td> <td>Eventos de transação por fio e nome de evento</td> </tr><tr><td><code>events_transactions_summary_by_user_by_event_name</code></td> <td>Eventos de transação por nome de usuário e nome de evento</td> </tr><tr><td><code>events_transactions_summary_global_by_event_name</code></td> <td>Eventos de transação por nome de evento</td> </tr></tbody></table>

#### Resumos de espera de objetos

**Tabela 29.11 Tabelas de Resumo de Eventos de Objeto do Schema de Desempenho**

<table frame="box" rules="all" summary="A reference that lists all Performance Schema object event summary tables."><col style="width: 28%"/><col style="width: 71%"/><thead><tr><th>Table Name</th> <th>Description</th> </tr></thead><tbody><tr><td><code>objects_summary_global_by_type</code></td> <td>Object summaries</td> </tr></tbody></table>

#### Resumos de E/S de Arquivo

**Tabela 29.12 Tabelas de Resumo de Eventos de E/S do Schema de Desempenho**

<table frame="box" rules="all" summary="A reference that lists all Performance Schema file I/O event summary tables."><col style="width: 28%"/><col style="width: 71%"/><thead><tr><th>Table Name</th> <th>Descrição</th> </tr></thead><tbody><tr><td><code>file_summary_by_event_name</code></td> <td>Filtre os eventos por nome de evento</td> </tr><tr><td><code>file_summary_by_instance</code></td> <td>Eventos por instância do arquivo</td> </tr></tbody></table>

#### Resumo de espera de entrada/saída de tabela e bloqueio

**Tabela 29.13 Tabela de desempenho do Schema I/O e tabelas de resumo de eventos de espera de bloqueio**

<table frame="box" rules="all" summary="A reference that lists all Performance Schema table I/O and lock event summary tables."><col style="width: 28%"/><col style="width: 71%"/><thead><tr><th>Table Name</th> <th>Description</th> </tr></thead><tbody><tr><td><code>table_io_waits_summary_by_index_usage</code></td> <td>Table I/O waits per index</td> </tr><tr><td><code>table_io_waits_summary_by_table</code></td> <td>Table I/O waits per table</td> </tr><tr><td><code>table_lock_waits_summary_by_table</code></td> <td>Table lock waits per table</td> </tr></tbody></table>

#### Resumos de Sockets

**Tabela 29.14 Tabelas de Resumo de Eventos de Soquete do Schema de Desempenho**

<table frame="box" rules="all" summary="A reference that lists all Performance Schema socket event summary tables."><col style="width: 28%"/><col style="width: 71%"/><thead><tr><th>Table Name</th> <th>Description</th> </tr></thead><tbody><tr><td><code>socket_summary_by_event_name</code></td> <td>Socket waits and I/O per event name</td> </tr><tr><td><code>socket_summary_by_instance</code></td> <td>Socket waits and I/O per instance</td> </tr></tbody></table>

#### Resumos de Memória

**Tabela 29.15 Tabelas de Resumo de Operações de Memória do Schema de Desempenho**

<table frame="box" rules="all" summary="A reference that lists all Performance Schema memory operation summary tables."><col style="width: 28%"/><col style="width: 71%"/><thead><tr><th>Table Name</th> <th>Descrição</th> </tr></thead><tbody><tr><td><code>memory_summary_by_account_by_event_name</code></td> <td>Operações de memória por conta e nome de evento</td> </tr><tr><td><code>memory_summary_by_host_by_event_name</code></td> <td>Operações de memória por host e nome de evento</td> </tr><tr><td><code>memory_summary_by_thread_by_event_name</code></td> <td>Operações de memória por fio e nome de evento</td> </tr><tr><td><code>memory_summary_by_user_by_event_name</code></td> <td>Operações de memória por usuário e nome de evento</td> </tr><tr><td><code>memory_summary_global_by_event_name</code></td> <td>Operações de memória globalmente por nome de evento</td> </tr></tbody></table>

#### Resumos de Erros

**Tabela 29.16 Tabelas de Resumo de Erros do Schema de Desempenho**

<table frame="box" rules="all" summary="A reference that lists all Performance Schema error summary tables."><col style="width: 28%"/><col style="width: 71%"/><thead><tr><th>Table Name</th> <th>Descrição</th> </tr></thead><tbody><tr><td><code>events_errors_summary_by_account_by_error</code></td> <td>Erros por conta e código de erro</td> </tr><tr><td><code>events_errors_summary_by_host_by_error</code></td> <td>Erros por host e código de erro</td> </tr><tr><td><code>events_errors_summary_by_thread_by_error</code></td> <td>Erros por fio e código de erro</td> </tr><tr><td><code>events_errors_summary_by_user_by_error</code></td> <td>Erros por usuário e código de erro</td> </tr><tr><td><code>events_errors_summary_global_by_error</code></td> <td>Erros por código de erro</td> </tr></tbody></table>

#### Resumos de variáveis de status

**Tabela 29.17 Resumo das tabelas de variáveis de status de erro do esquema de desempenho**

<table frame="box" rules="all" summary="A reference that lists all Performance Schema stage event summary tables."><col style="width: 28%"/><col style="width: 71%"/><thead><tr><th>Table Name</th> <th>Descrição</th> </tr></thead><tbody><tr><td><code>events_stages_summary_by_account_by_event_name</code></td> <td>Eventos em andamento por conta e nome do evento</td> </tr><tr><td><code>events_stages_summary_by_host_by_event_name</code></td> <td>Eventos em andamento por nome do anfitrião e nome do evento</td> </tr><tr><td><code>events_stages_summary_by_thread_by_event_name</code></td> <td>Espera de palco por thread e nome de evento</td> </tr><tr><td><code>events_stages_summary_by_user_by_event_name</code></td> <td>Eventos em andamento por nome do usuário e nome do evento</td> </tr><tr><td><code>events_stages_summary_global_by_event_name</code></td> <td>Esperas de palco por nome de evento</td> </tr></tbody></table>0

#### 29.12.20.1 Tabelas de Resumo de Eventos de Aguardar

O Schema de Desempenho mantém tabelas para coletar eventos de espera atuais e recentes, e agrega essas informações em tabelas resumidas. A Seção 29.12.4, “Tabelas de Eventos de Espera do Schema de Desempenho”, descreve os eventos sobre os quais os resumos de espera são baseados. Consulte essa discussão para obter informações sobre o conteúdo dos eventos de espera, as tabelas de eventos de espera atuais e recentes, e como controlar a coleta de eventos de espera, que é desativada por padrão.

Exemplo de informações de resumo de evento de espera:

```
mysql> SELECT *
       FROM performance_schema.events_waits_summary_global_by_event_name\G
...
*************************** 6. row ***************************
    EVENT_NAME: wait/synch/mutex/sql/BINARY_LOG::LOCK_index
    COUNT_STAR: 8
SUM_TIMER_WAIT: 2119302
MIN_TIMER_WAIT: 196092
AVG_TIMER_WAIT: 264912
MAX_TIMER_WAIT: 569421
...
*************************** 9. row ***************************
    EVENT_NAME: wait/synch/mutex/sql/hash_filo::lock
    COUNT_STAR: 69
SUM_TIMER_WAIT: 16848828
MIN_TIMER_WAIT: 0
AVG_TIMER_WAIT: 244185
MAX_TIMER_WAIT: 735345
...
```

Cada tabela de resumo de eventos de espera tem uma ou mais colunas de agrupamento para indicar como a tabela agrega os eventos. Os nomes dos eventos se referem aos nomes dos instrumentos de evento na tabela `setup_instruments`:

* A coluna `events_waits_summary_by_account_by_event_name` possui as colunas `EVENT_NAME`, `USER` e `HOST`. Cada linha resume os eventos para uma combinação específica de conta (usuário e host) e nome de evento.

* A coluna `events_waits_summary_by_host_by_event_name` possui as colunas `EVENT_NAME` e `HOST`. Cada linha resume os eventos para um determinado hospedeiro e nome de evento.

* A coluna `events_waits_summary_by_instance` possui as colunas `EVENT_NAME` e `OBJECT_INSTANCE_BEGIN`. Cada linha resume os eventos para um nome de evento e objeto específicos. Se um instrumento é usado para criar múltiplas instâncias, cada instância tem um valor único `OBJECT_INSTANCE_BEGIN` e é resumida separadamente nesta tabela.

* A coluna `events_waits_summary_by_thread_by_event_name` possui as colunas `THREAD_ID` e `EVENT_NAME`. Cada linha resume os eventos para um determinado fio e nome de evento.

* A coluna `events_waits_summary_by_user_by_event_name` possui as colunas `EVENT_NAME` e `USER`. Cada linha resume os eventos para um usuário e um nome de evento específicos.

* `events_waits_summary_global_by_event_name` possui uma coluna `EVENT_NAME`. Cada linha resume os eventos para um nome de evento específico. Um instrumento pode ser usado para criar múltiplas instâncias do objeto instrumentado. Por exemplo, se houver um instrumento para um mutex que é criado para cada conexão, há tantas instâncias quanto conexões. A linha de resumo para o instrumento resume todas essas instâncias.

Cada tabela de resumo de evento de espera tem essas colunas de resumo contendo valores agregados:

* `COUNT_STAR`

O número de eventos resumidos. Esse valor inclui todos os eventos, sejam eles cronometrados ou

* `SUM_TIMER_WAIT`

O tempo total de espera dos eventos cronometrados resumidos. Esse valor é calculado apenas para eventos cronometrados, pois os eventos não cronometrados têm um tempo de espera de `NULL`. O mesmo vale para os outros valores `xxx_TIMER_WAIT`.

* `MIN_TIMER_WAIT`

O tempo mínimo de espera dos eventos cronometrados resumidos.

* `AVG_TIMER_WAIT`

O tempo médio de espera dos eventos cronometrados resumidos.

* `MAX_TIMER_WAIT`

O tempo máximo de espera dos eventos cronometrados resumidos.

As tabelas de resumo dos eventos de espera têm esses índices:

* `events_waits_summary_by_account_by_event_name`:

+ Chave primária em (`USER`, `HOST`, `EVENT_NAME`)

* `events_waits_summary_by_host_by_event_name`:

+ Chave primária em (`HOST`, `EVENT_NAME`)

* `events_waits_summary_by_instance`:

+ Chave primária em (`OBJECT_INSTANCE_BEGIN`)

+ Índice de (`EVENT_NAME`)
* `events_waits_summary_by_thread_by_event_name`:

+ Chave primária em (`THREAD_ID`, `EVENT_NAME`)

* `events_waits_summary_by_user_by_event_name`:

+ Chave primária em (`USER`, `EVENT_NAME`)

* `events_waits_summary_global_by_event_name`:

+ Chave primária em (`EVENT_NAME`)

`TRUNCATE TABLE` é permitido para tabelas de resumo de espera. Tem esses efeitos:

* Para tabelas resumidas que não são agregadas por conta, host ou usuário, o truncamento redefere as colunas resumidas para zero, em vez de remover as linhas.

* Para tabelas resumidas agregadas por conta, host ou usuário, o truncamento remove as linhas de contas, hosts ou usuários sem conexões e redefre as colunas resumidas para zero nas linhas restantes.

Além disso, cada tabela de resumo de espera que é agregada por conta, host, usuário ou thread é implicitamente truncada pela truncagem da tabela de conexão na qual ela depende, ou pela truncagem de [[`events_waits_summary_global_by_event_name`]. Para detalhes, consulte a Seção 29.12.8, “Tabelas de Conexão do Schema de Desempenho”.

#### 29.12.20.2 Tabelas de Resumo de Etapas

O Schema de Desempenho mantém tabelas para coletar eventos de estágio atuais e recentes, e agrega essas informações em tabelas resumidas. A Seção 29.12.5, “Tabelas de Eventos de Estágio do Schema de Desempenho”, descreve os eventos sobre os quais os resumos de estágio são baseados. Consulte essa discussão para obter informações sobre o conteúdo dos eventos de estágio, as tabelas de eventos de estágio atuais e históricas, e como controlar a coleta de eventos de estágio, que é desativada por padrão.

Exemplo de informações de resumo de evento de estágio:

```
mysql> SELECT *
       FROM performance_schema.events_stages_summary_global_by_event_name\G
...
*************************** 5. row ***************************
    EVENT_NAME: stage/sql/checking permissions
    COUNT_STAR: 57
SUM_TIMER_WAIT: 26501888880
MIN_TIMER_WAIT: 7317456
AVG_TIMER_WAIT: 464945295
MAX_TIMER_WAIT: 12858936792
...
*************************** 9. row ***************************
    EVENT_NAME: stage/sql/closing tables
    COUNT_STAR: 37
SUM_TIMER_WAIT: 662606568
MIN_TIMER_WAIT: 1593864
AVG_TIMER_WAIT: 17907891
MAX_TIMER_WAIT: 437977248
...
```

Cada tabela de resumo de etapa tem uma ou mais colunas de agrupamento para indicar como a tabela agrega eventos. Os nomes dos eventos se referem aos nomes dos instrumentos de evento na tabela `setup_instruments`:

* A coluna `events_stages_summary_by_account_by_event_name` possui as colunas `EVENT_NAME`, `USER` e `HOST`. Cada linha resume os eventos para uma combinação específica de conta (usuário e host) e nome de evento.

* A coluna `events_stages_summary_by_host_by_event_name` possui as colunas `EVENT_NAME` e `HOST`. Cada linha resume os eventos para um determinado hospedeiro e nome de evento.

* A coluna `events_stages_summary_by_thread_by_event_name` possui as colunas `THREAD_ID` e `EVENT_NAME`. Cada linha resume os eventos para um determinado fio e nome de evento.

* A coluna `events_stages_summary_by_user_by_event_name` possui as colunas `EVENT_NAME` e `USER`. Cada linha resume os eventos para um usuário e um nome de evento específicos.

* `events_stages_summary_global_by_event_name` possui uma coluna `EVENT_NAME`. Cada linha resume os eventos para um nome de evento específico.

Cada tabela de resumo de estágio tem essas colunas de resumo contendo valores agregados: `COUNT_STAR`, `SUM_TIMER_WAIT`, `MIN_TIMER_WAIT`, `AVG_TIMER_WAIT` e `MAX_TIMER_WAIT`. Essas colunas são análogas às colunas dos mesmos nomes nas tabelas de resumo de eventos de espera (ver Seção 29.12.20.1, “Tabelas de Resumo de Eventos de Espera”), exceto que as tabelas de resumo de estágio agregam eventos de `events_stages_current` em vez de `events_waits_current`.

As tabelas de resumo do estádio têm esses índices:

* `events_stages_summary_by_account_by_event_name`:

+ Chave primária em (`USER`, `HOST`, `EVENT_NAME`)

* `events_stages_summary_by_host_by_event_name`:

+ Chave primária em (`HOST`, `EVENT_NAME`)

* `events_stages_summary_by_thread_by_event_name`:

+ Chave primária em (`THREAD_ID`, `EVENT_NAME`)

* `events_stages_summary_by_user_by_event_name`:

+ Chave primária em (`USER`, `EVENT_NAME`)

* `events_stages_summary_global_by_event_name`:

+ Chave primária em (`EVENT_NAME`)

`TRUNCATE TABLE` é permitido para as tabelas de resumo de estágios. Tem esses efeitos:

* Para tabelas resumidas que não são agregadas por conta, host ou usuário, o truncamento redefere as colunas resumidas para zero, em vez de remover as linhas.

* Para tabelas resumidas agregadas por conta, host ou usuário, o truncamento remove as linhas de contas, hosts ou usuários sem conexões e redefre as colunas resumidas para zero nas linhas restantes.

Além disso, cada tabela de resumo de etapa que é agregada por conta, host, usuário ou thread é implicitamente truncada pela truncagem da tabela de conexão na qual depende, ou pela truncagem de `events_stages_summary_global_by_event_name`. Para detalhes, consulte a Seção 29.12.8, “Tabelas de Conexão do Schema de Desempenho”.

#### 29.12.20.3 Tabelas de Resumo de Declarações

O Schema de Desempenho mantém tabelas para coletar eventos de declaração atuais e recentes, e agrega essas informações em tabelas resumidas. A Seção 29.12.6, “Tabelas de Eventos de Declaração do Schema de Desempenho”, descreve os eventos sobre os quais os resumos de declaração são baseados. Consulte essa discussão para obter informações sobre o conteúdo dos eventos de declaração, as tabelas de eventos de declaração atuais e históricas, e como controlar a coleta de eventos de declaração, que é parcialmente desativada por padrão.

Exemplo de resumo de informações sobre eventos de declaração:

```
mysql> SELECT *
       FROM performance_schema.events_statements_summary_global_by_event_name\G
*************************** 1. row ***************************
                 EVENT_NAME: statement/sql/select
                 COUNT_STAR: 54
             SUM_TIMER_WAIT: 38860400000
             MIN_TIMER_WAIT: 52400000
             AVG_TIMER_WAIT: 719600000
             MAX_TIMER_WAIT: 12631800000
              SUM_LOCK_TIME: 88000000
                 SUM_ERRORS: 0
               SUM_WARNINGS: 0
          SUM_ROWS_AFFECTED: 0
              SUM_ROWS_SENT: 60
          SUM_ROWS_EXAMINED: 120
SUM_CREATED_TMP_DISK_TABLES: 0
     SUM_CREATED_TMP_TABLES: 21
       SUM_SELECT_FULL_JOIN: 16
 SUM_SELECT_FULL_RANGE_JOIN: 0
           SUM_SELECT_RANGE: 0
     SUM_SELECT_RANGE_CHECK: 0
            SUM_SELECT_SCAN: 41
      SUM_SORT_MERGE_PASSES: 0
             SUM_SORT_RANGE: 0
              SUM_SORT_ROWS: 0
              SUM_SORT_SCAN: 0
          SUM_NO_INDEX_USED: 22
     SUM_NO_GOOD_INDEX_USED: 0
               SUM_CPU_TIME: 0
      MAX_CONTROLLED_MEMORY: 2028360
           MAX_TOTAL_MEMORY: 2853429
            COUNT_SECONDARY: 0
...
```

Cada tabela de resumo de declaração tem uma ou mais colunas de agrupamento para indicar como a tabela agrega eventos. Os nomes dos eventos se referem aos nomes dos instrumentos de evento na tabela `setup_instruments`:

* A coluna `events_statements_summary_by_account_by_event_name` possui as colunas `EVENT_NAME`, `USER` e `HOST`. Cada linha resume os eventos para uma combinação específica de conta (usuário e host) e nome de evento.

* A coluna `events_statements_summary_by_digest` tem as colunas `SCHEMA_NAME` e `DIGEST`. Cada linha resume os eventos por esquema e valor de digestão. (A coluna `DIGEST_TEXT` contém o texto correspondente do digestão de declaração normalizado, mas não é uma coluna de agrupamento nem de resumo. As colunas `QUERY_SAMPLE_TEXT`, `QUERY_SAMPLE_SEEN` e `QUERY_SAMPLE_TIMER_WAIT` também não são colunas de agrupamento nem de resumo; elas suportam a amostragem de declarações.)

O número máximo de linhas na tabela é dimensionado automaticamente no início do servidor. Para definir explicitamente esse máximo, defina a variável de sistema `performance_schema_digests_size` no início do servidor.

* A coluna `events_statements_summary_by_host_by_event_name` possui as colunas `EVENT_NAME` e `HOST`. Cada linha resume os eventos para um determinado hospedeiro e nome de evento.

* A coluna `events_statements_summary_by_program` possui as colunas `OBJECT_TYPE`, `OBJECT_SCHEMA` e `OBJECT_NAME`. Cada linha resume os eventos para um programa armazenado específico (procedimento ou função armazenada, gatilho ou evento).

* A coluna `events_statements_summary_by_thread_by_event_name` possui as colunas `THREAD_ID` e `EVENT_NAME`. Cada linha resume os eventos para um determinado fio e nome de evento.

* A coluna `events_statements_summary_by_user_by_event_name` possui as colunas `EVENT_NAME` e `USER`. Cada linha resume os eventos para um usuário e um nome de evento específicos.

* `events_statements_summary_global_by_event_name` possui uma coluna `EVENT_NAME`. Cada linha resume os eventos para um nome de evento específico.

* `prepared_statements_instances` possui uma coluna `OBJECT_INSTANCE_BEGIN`. Cada linha resume os eventos para uma declaração preparada específica.

Cada tabela de resumo de declaração tem essas colunas de resumo contendo valores agregados (com exceções conforme indicado):

* `COUNT_STAR`, `SUM_TIMER_WAIT`, `MIN_TIMER_WAIT`, `AVG_TIMER_WAIT`, `MAX_TIMER_WAIT`

Essas colunas são análogas às colunas dos mesmos nomes nas tabelas de resumo de eventos de espera (ver Seção 29.12.20.1, “Tabelas de Resumo de Eventos de Espera”), exceto pelo fato de que as tabelas de resumo de declarações agregam eventos de `events_statements_current` em vez de `events_waits_current`.

A tabela `prepared_statements_instances` não possui essas colunas.

* `SUM_xxx`

O agregado da coluna correspondente ao *`xxx`* na tabela `events_statements_current`. Por exemplo, as colunas `SUM_LOCK_TIME` e `SUM_ERRORS` nos quadros de resumo das declarações são os agregados das colunas `LOCK_TIME` e `ERRORS` na tabela `events_statements_current`.

* `MAX_CONTROLLED_MEMORY`

Relata o valor máximo de memória controlada utilizada por uma declaração durante a execução.

Esta coluna foi adicionada no MySQL 8.0.31.

* `MAX_TOTAL_MEMORY`

Relata o valor máximo de memória utilizado por uma declaração durante a execução.

Esta coluna foi adicionada no MySQL 8.0.31.

* `COUNT_SECONDARY`

O número de vezes que uma consulta foi processada no motor `SECONDARY`. Para uso com o MySQL HeatWave Service e o MySQL HeatWave, onde o motor `InnoDB` é `SECONDARY` e o motor `RAPID` é MySQL HeatWave. Para o MySQL Community Edition Server, MySQL Enterprise Edition Server (on-premise) e o MySQL HeatWave Service sem o MySQL HeatWave, as consultas são sempre processadas no motor `PRIMARY`, o que significa que o valor é sempre 0 nesses servidores MySQL. A coluna `COUNT_SECONDARY` foi adicionada no MySQL 8.0.29.

A tabela `events_statements_summary_by_digest` tem essas colunas de resumo adicionais:

* `FIRST_SEEN`, `LAST_SEEN`

Marcadores de tempo que indicam quando as declarações com o valor de digestão dado foram vistas pela primeira vez e mais recentemente.

* `QUANTILE_95`: O 95º percentil da latência da declaração, em picosegundos. Esse percentil é uma estimativa alta, calculada a partir dos dados do histograma coletados. Em outras palavras, para um determinado digest, 95% das declarações medidas têm uma latência menor que `QUANTILE_95`.

Para acessar os dados do histograma, use as tabelas descritas na Seção 29.12.20.4, “Tabelas de Resumo de Histograma de Relatório”.

* `QUANTILE_99`: Semelhante a `QUANTILE_95`, mas para o 99º percentil.

* `QUANTILE_999`: Semelhante a `QUANTILE_95`, mas para o 99,9º percentil.

A tabela `events_statements_summary_by_digest` contém as seguintes colunas. Essas colunas não são colunas de agregação ou resumo; elas suportam a amostragem de declarações:

* `QUERY_SAMPLE_TEXT`

Uma declaração SQL de amostra que produz o valor do digest em uma linha. Esta coluna permite que as aplicações acessem, para um valor de digest dado, uma declaração realmente vista pelo servidor que produz esse digest. Uma utilização para isso pode ser executar `EXPLAIN` na declaração para examinar o plano de execução de uma declaração representativa associada a um digest que ocorre com frequência.

Quando a coluna `QUERY_SAMPLE_TEXT` recebe um valor, as colunas `QUERY_SAMPLE_SEEN` e `QUERY_SAMPLE_TIMER_WAIT` também recebem valores.

O espaço máximo disponível para exibição de declaração é de 1024 bytes por padrão. Para alterar esse valor, defina a variável de sistema `performance_schema_max_sql_text_length` na inicialização do servidor. (Alterar esse valor afeta as colunas em outras tabelas do Schema de Desempenho. Veja a Seção 29.10, “Digestas e Amostragem de Declarações do Schema de Desempenho”).

Para informações sobre amostragem de declarações, consulte a Seção 29.10, “Resumo de declarações do Schema de desempenho e amostragem”.

* `QUERY_SAMPLE_SEEN`

Um marcador de tempo que indica quando a declaração na coluna `QUERY_SAMPLE_TEXT` foi vista.

* `QUERY_SAMPLE_TIMER_WAIT`

O tempo de espera para a declaração de amostra na coluna `QUERY_SAMPLE_TEXT`.

A tabela `events_statements_summary_by_program` tem essas colunas de resumo adicionais:

* `COUNT_STATEMENTS`, `SUM_STATEMENTS_WAIT`, `MIN_STATEMENTS_WAIT`, `AVG_STATEMENTS_WAIT`, `MAX_STATEMENTS_WAIT`

Estatísticas sobre declarações aninhadas invocadas durante a execução de programas armazenados.

A tabela `prepared_statements_instances` tem essas colunas de resumo adicionais:

* `COUNT_EXECUTE`, `SUM_TIMER_EXECUTE`, `MIN_TIMER_EXECUTE`, `AVG_TIMER_EXECUTE`, `MAX_TIMER_EXECUTE`

Estatísticas agregadas para execuções da declaração preparada.

As tabelas de resumo das declarações têm esses índices:

* `events_transactions_summary_by_account_by_event_name`:

+ Chave primária em (`USER`, `HOST`, `EVENT_NAME`)

* `events_statements_summary_by_digest`:

+ Chave primária em (`SCHEMA_NAME`, `DIGEST`)

* `events_transactions_summary_by_host_by_event_name`:

+ Chave primária em (`HOST`, `EVENT_NAME`)

* `events_statements_summary_by_program`:

+ Chave primária em (`OBJECT_TYPE`, `OBJECT_SCHEMA`, `OBJECT_NAME`)

* `events_statements_summary_by_thread_by_event_name`:

+ Chave primária em (`THREAD_ID`, `EVENT_NAME`)

* `events_transactions_summary_by_user_by_event_name`:

+ Chave primária em (`USER`, `EVENT_NAME`)

* `events_statements_summary_global_by_event_name`:

+ Chave primária em (`EVENT_NAME`)

`TRUNCATE TABLE` é permitido para tabelas de resumo de declaração. Tem esses efeitos:

* Para `events_statements_summary_by_digest`, ele remove as linhas.

* Para outras tabelas resumidas que não são agregadas por conta, host ou usuário, o truncamento redefere as colunas resumidas para zero em vez de remover as linhas.

* Para outras tabelas resumidas agregadas por conta, host ou usuário, o truncamento remove as linhas das contas, hosts ou usuários sem conexões e redefre as colunas resumidas para zero nas linhas restantes.

Além disso, cada tabela de resumo de declaração que é agregada por conta, host, usuário ou thread é implicitamente truncada pela truncagem da tabela de conexão na qual ela depende, ou pela truncagem de `events_statements_summary_global_by_event_name`. Para detalhes, consulte a Seção 29.12.8, “Tabelas de Conexão do Schema de Desempenho”.

Além disso, a truncação de `events_statements_summary_by_digest` implicitamente trunca `events_statements_histogram_by_digest`, e a truncação de `events_statements_summary_global_by_event_name` implicitamente trunca `events_statements_histogram_global`.

Resumo das regras de agregação de declarações #####

Se o consumidor `statements_digest` estiver habilitado, a agregação no `events_statements_summary_by_digest` ocorre da seguinte forma quando uma declaração é concluída. A agregação é baseada no valor do `DIGEST` calculado para a declaração.

* Se uma linha `events_statements_summary_by_digest` já existir com o valor de digestão para a declaração que acabou de ser concluída, as estatísticas para a declaração são agregadas a essa linha. A coluna `LAST_SEEN` é atualizada para a hora atual.

* Se nenhuma linha tiver o valor do digest para a declaração que acabou de ser completada e a tabela não estiver cheia, uma nova linha é criada para a declaração. As colunas `FIRST_SEEN` e `LAST_SEEN` são inicializadas com a hora atual.

* Se nenhuma linha tiver o valor do resumo da declaração para a declaração que acabou de ser concluída e a tabela estiver cheia, as estatísticas para a declaração que acabou de ser concluída são adicionadas a uma linha especial de "captura geral" com `DIGEST` = `NULL`, que é criada, se necessário. Se a linha for criada, as colunas `FIRST_SEEN` e `LAST_SEEN` são inicializadas com a hora atual. Caso contrário, a coluna `LAST_SEEN` é atualizada com a hora atual.

A linha com `DIGEST` = `NULL` é mantida porque as tabelas do Schema de Desempenho têm um tamanho máximo devido a restrições de memória. A linha `DIGEST` = `NULL` permite que os digests que não correspondem a outras linhas sejam contados mesmo que a tabela de resumo esteja cheia, usando um compartimento comum de "outro". Esta linha ajuda a estimar se o resumo do digest é representativo:

* Uma linha `DIGEST` que tem um valor `COUNT_STAR` que representa 5% de todos os digestos mostra que a tabela de resumo do digest é muito representativa; as outras linhas cobrem 95% das declarações vistas.

* Uma linha `DIGEST` que tem um valor `COUNT_STAR` que representa 50% de todos os digestos indica que a tabela de resumo do digest não é muito representativa; as outras linhas cobrem apenas metade das declarações vistas. Muito provavelmente, o DBA deve aumentar o tamanho máximo da tabela para que mais das linhas contadas na linha `DIGEST` = `NULL` sejam contadas usando linhas mais específicas. Por padrão, a tabela é dimensionada automaticamente, mas se esse tamanho for muito pequeno, defina a variável de sistema `performance_schema_digests_size` para um valor maior na inicialização do servidor.

Comportamento do Instrumento de Programa Armazenado

Para os tipos de programas armazenados para os quais a instrumentação está habilitada na tabela `setup_objects`, `events_statements_summary_by_program` mantém estatísticas para programas armazenados da seguinte forma:

* Uma linha é adicionada para um objeto quando ele é usado pela primeira vez no servidor.

* A linha para um objeto é removida quando o objeto é descartado.

* As estatísticas são agregadas na linha para um objeto conforme ele é executado.

Veja também a Seção 29.4.3, “Pré-filtragem de Eventos”.

#### 29.12.20.4 Tabelas de resumo de histograma de declaração

O Schema de Desempenho mantém tabelas de resumo de eventos de declaração que contêm informações sobre latência mínima, máxima e média da declaração (ver Seção 29.12.20.3, “Tabelas de Resumo de Declaração”). Essas tabelas permitem uma avaliação de alto nível do desempenho do sistema. Para permitir uma avaliação em um nível mais detalhado, o Schema de Desempenho também coleta dados de histograma para as latências das declarações. Esses histogramas fornecem informações adicionais sobre as distribuições de latência.

A Seção 29.12.6, “Tabelas de Eventos de Declaração do Schema de Desempenho”, descreve os eventos sobre os quais os resumos de declaração são baseados. Consulte essa discussão para obter informações sobre o conteúdo dos eventos de declaração, as tabelas de eventos de declaração atuais e históricas, e como controlar a coleta de eventos de declaração, que é parcialmente desativada por padrão.

Exemplo de declaração de informações de histograma:

```
mysql> SELECT *
       FROM performance_schema.events_statements_histogram_by_digest
       WHERE SCHEMA_NAME = 'mydb' AND DIGEST = 'bb3f69453119b2d7b3ae40673a9d4c7c'
       AND COUNT_BUCKET > 0 ORDER BY BUCKET_NUMBER\G
*************************** 1. row ***************************
           SCHEMA_NAME: mydb
                DIGEST: bb3f69453119b2d7b3ae40673a9d4c7c
         BUCKET_NUMBER: 42
      BUCKET_TIMER_LOW: 66069344
     BUCKET_TIMER_HIGH: 69183097
          COUNT_BUCKET: 1
COUNT_BUCKET_AND_LOWER: 1
       BUCKET_QUANTILE: 0.058824
*************************** 2. row ***************************
           SCHEMA_NAME: mydb
                DIGEST: bb3f69453119b2d7b3ae40673a9d4c7c
         BUCKET_NUMBER: 43
      BUCKET_TIMER_LOW: 69183097
     BUCKET_TIMER_HIGH: 72443596
          COUNT_BUCKET: 1
COUNT_BUCKET_AND_LOWER: 2
       BUCKET_QUANTILE: 0.117647
*************************** 3. row ***************************
           SCHEMA_NAME: mydb
                DIGEST: bb3f69453119b2d7b3ae40673a9d4c7c
         BUCKET_NUMBER: 44
      BUCKET_TIMER_LOW: 72443596
     BUCKET_TIMER_HIGH: 75857757
          COUNT_BUCKET: 2
COUNT_BUCKET_AND_LOWER: 4
       BUCKET_QUANTILE: 0.235294
*************************** 4. row ***************************
           SCHEMA_NAME: mydb
                DIGEST: bb3f69453119b2d7b3ae40673a9d4c7c
         BUCKET_NUMBER: 45
      BUCKET_TIMER_LOW: 75857757
     BUCKET_TIMER_HIGH: 79432823
          COUNT_BUCKET: 6
COUNT_BUCKET_AND_LOWER: 10
       BUCKET_QUANTILE: 0.625000
...
```

Por exemplo, na linha 3, esses valores indicam que 23,52% das consultas são executadas em menos de 75,86 microsegundos:

```
BUCKET_TIMER_HIGH: 75857757
  BUCKET_QUANTILE: 0.235294
```

Na linha 4, esses valores indicam que 62,50% das consultas são executadas em menos de 79,44 microsegundos:

```
BUCKET_TIMER_HIGH: 79432823
  BUCKET_QUANTILE: 0.625000
```

Cada tabela de resumo de histograma de declaração tem uma ou mais colunas de agrupamento para indicar como a tabela agrega eventos:

* A coluna `events_statements_histogram_by_digest` possui as colunas `SCHEMA_NAME`, `DIGEST` e `BUCKET_NUMBER`:

As colunas `SCHEMA_NAME` e `DIGEST` identificam uma linha de digestão de declaração na tabela `events_statements_summary_by_digest`.

+ As linhas `events_statements_histogram_by_digest` com os mesmos valores de `SCHEMA_NAME` e `DIGEST` compõem o histograma para aquela combinação de esquema/digest.

+ Dentro de um histograma dado, a coluna `BUCKET_NUMBER` indica o número do recipiente.

* `events_statements_histogram_global` possui uma coluna `BUCKET_NUMBER`. Esta tabela resume as latências globalmente em termos de nome do esquema e valores de digest, utilizando um único histograma. A coluna `BUCKET_NUMBER` indica o número de bucket dentro deste histograma global.

Um histograma é composto por *`N`* buckets, onde cada linha representa um bucket, com o número do bucket indicado pela coluna `BUCKET_NUMBER`. Os números dos buckets começam com 0.

Cada tabela de resumo do histograma de declaração tem essas colunas de resumo contendo valores agregados:

* `BUCKET_TIMER_LOW`, `BUCKET_TIMER_HIGH`

Um balde conta declarações que têm uma latência, em picosegundos, medida entre `BUCKET_TIMER_LOW` e `BUCKET_TIMER_HIGH`:

+ O valor de `BUCKET_TIMER_LOW` para o primeiro recipiente (`BUCKET_NUMBER` =
    0) é 0.

+ O valor de `BUCKET_TIMER_LOW` para um bucket (`BUCKET_NUMBER` = *`k`*) é o mesmo que `BUCKET_TIMER_HIGH` para o bucket anterior (`BUCKET_NUMBER` = *`k`−1)

+ O último balde é uma categoria genérica para declarações que têm uma latência superior às categorias anteriores no histograma.

* `COUNT_BUCKET`

O número de declarações medido com uma latência no intervalo de `BUCKET_TIMER_LOW` até, mas não incluindo `BUCKET_TIMER_HIGH`.

* `COUNT_BUCKET_AND_LOWER`

O número de declarações medido com uma latência no intervalo de 0 até, mas não incluindo `BUCKET_TIMER_HIGH`.

* `BUCKET_QUANTILE`

A proporção de declarações que caem nesta ou em um bucket inferior. Essa proporção corresponde, por definição, a `COUNT_BUCKET_AND_LOWER / SUM(COUNT_BUCKET)` e é exibida como uma coluna de conveniência.

As tabelas de resumo do histograma de declaração têm esses índices:

* `events_statements_histogram_by_digest`:

+ Índice único em (`SCHEMA_NAME`, `DIGEST`, `BUCKET_NUMBER`)

* `events_statements_histogram_global`:

+ Chave primária em (`BUCKET_NUMBER`)

`TRUNCATE TABLE` é permitido para tabelas de resumo de histograma de declaração. A truncação define as colunas `COUNT_BUCKET` e `COUNT_BUCKET_AND_LOWER` como 0.

Além disso, a truncação de `events_statements_summary_by_digest` implicitamente trunca `events_statements_histogram_by_digest`, e a truncação de `events_statements_summary_global_by_event_name` implicitamente trunca `events_statements_histogram_global`.

#### 29.12.20.5 Tabelas de Resumo de Transações

O Schema de Desempenho mantém tabelas para coletar eventos de transação atuais e recentes, e agrega essas informações em tabelas resumidas. A Seção 29.12.7, “Tabelas de Transação do Schema de Desempenho”, descreve os eventos sobre os quais os resumos de transação são baseados. Consulte essa discussão para obter informações sobre o conteúdo dos eventos de transação, as tabelas de eventos de transação atuais e históricas, e como controlar a coleta de eventos de transação, que é desativada por padrão.

Exemplo de informações de resumo de eventos de transação:

```
mysql> SELECT *
       FROM performance_schema.events_transactions_summary_global_by_event_name
       LIMIT 1\G
*************************** 1. row ***************************
          EVENT_NAME: transaction
          COUNT_STAR: 5
      SUM_TIMER_WAIT: 19550092000
      MIN_TIMER_WAIT: 2954148000
      AVG_TIMER_WAIT: 3910018000
      MAX_TIMER_WAIT: 5486275000
    COUNT_READ_WRITE: 5
SUM_TIMER_READ_WRITE: 19550092000
MIN_TIMER_READ_WRITE: 2954148000
AVG_TIMER_READ_WRITE: 3910018000
MAX_TIMER_READ_WRITE: 5486275000
     COUNT_READ_ONLY: 0
 SUM_TIMER_READ_ONLY: 0
 MIN_TIMER_READ_ONLY: 0
 AVG_TIMER_READ_ONLY: 0
 MAX_TIMER_READ_ONLY: 0
```

Cada tabela de resumo de transação tem uma ou mais colunas de agrupamento para indicar como a tabela agrega eventos. Os nomes dos eventos se referem aos nomes dos instrumentos de evento na tabela `setup_instruments`:

* A coluna `events_transactions_summary_by_account_by_event_name` possui as colunas `USER`, `HOST` e `EVENT_NAME`. Cada linha resume os eventos para uma combinação específica de conta (usuário e host) e nome de evento.

* A coluna `events_transactions_summary_by_host_by_event_name` possui as colunas `HOST` e `EVENT_NAME`. Cada linha resume os eventos para um determinado hospedeiro e nome de evento.

* A coluna `events_transactions_summary_by_thread_by_event_name` possui as colunas `THREAD_ID` e `EVENT_NAME`. Cada linha resume os eventos para um determinado fio e nome de evento.

* A coluna `events_transactions_summary_by_user_by_event_name` possui as colunas `USER` e `EVENT_NAME`. Cada linha resume os eventos para um usuário e um nome de evento específicos.

* `events_transactions_summary_global_by_event_name` possui uma coluna `EVENT_NAME`. Cada linha resume os eventos para um nome de evento específico.

Cada tabela de resumo de transação tem essas colunas de resumo contendo valores agregados:

* `COUNT_STAR`, `SUM_TIMER_WAIT`, `MIN_TIMER_WAIT`, `AVG_TIMER_WAIT`, `MAX_TIMER_WAIT`

Essas colunas são análogas às colunas dos mesmos nomes nas tabelas de resumo de eventos de espera (ver Seção 29.12.20.1, “Tabelas de Resumo de Eventos de Espera”), exceto pelo fato de que as tabelas de resumo de transações agregam eventos de `events_transactions_current` em vez de `events_waits_current`. Essas colunas resumem as transações de leitura, escrita e apenas leitura.

* `COUNT_READ_WRITE`, `SUM_TIMER_READ_WRITE`, `MIN_TIMER_READ_WRITE`, `AVG_TIMER_READ_WRITE`, `MAX_TIMER_READ_WRITE`

Esses são semelhantes às colunas `COUNT_STAR` e `xxx_TIMER_WAIT`, mas resumem apenas as transações de leitura e escrita. O modo de acesso à transação especifica se as transações operam em modo de leitura/escrita ou apenas de leitura.

* `COUNT_READ_ONLY`, `SUM_TIMER_READ_ONLY`, `MIN_TIMER_READ_ONLY`, `AVG_TIMER_READ_ONLY`, `MAX_TIMER_READ_ONLY`

Esses são semelhantes às colunas `COUNT_STAR` e `xxx_TIMER_WAIT`, mas resumem apenas as transações de leitura somente. O modo de acesso à transação especifica se as transações operam em modo de leitura/escrita ou de leitura somente.

As tabelas de resumo de transação têm esses índices:

* `events_transactions_summary_by_account_by_event_name`:

+ Chave primária em (`USER`, `HOST`, `EVENT_NAME`)

* `events_transactions_summary_by_host_by_event_name`:

+ Chave primária em (`HOST`, `EVENT_NAME`)

* `events_transactions_summary_by_thread_by_event_name`:

+ Chave primária em (`THREAD_ID`, `EVENT_NAME`)

* `events_transactions_summary_by_user_by_event_name`:

+ Chave primária em (`USER`, `EVENT_NAME`)

* `events_transactions_summary_global_by_event_name`:

+ Chave primária em (`EVENT_NAME`)

`TRUNCATE TABLE` é permitido para tabelas de resumo de transações. Tem esses efeitos:

* Para tabelas resumidas que não são agregadas por conta, host ou usuário, o truncamento redefere as colunas resumidas para zero, em vez de remover as linhas.

* Para tabelas resumidas agregadas por conta, host ou usuário, o truncamento remove as linhas de contas, hosts ou usuários sem conexões e redefre as colunas resumidas para zero nas linhas restantes.

Além disso, cada tabela de resumo de transação que é agregada por conta, host, usuário ou thread é implicitamente truncada pela truncagem da tabela de conexão na qual ela depende, ou pela truncagem de [[`events_transactions_summary_global_by_event_name`]. Para detalhes, consulte a Seção 29.12.8, “Tabelas de Conexão do Schema de Desempenho”.

##### Regras de Agregação de Transações

A coleta de eventos de transação ocorre sem considerar o nível de isolamento, o modo de acesso ou o modo de autocommit.

A coleta de eventos de transação ocorre para todas as transações não aborridas iniciadas pelo servidor, incluindo as transações vazias.

As transações de leitura e escrita geralmente são mais intensivas em recursos do que as transações de leitura somente, portanto, as tabelas de resumo de transação incluem colunas agregadas separadas para transações de leitura e escrita.

Os requisitos de recursos também podem variar com o nível de isolamento de transação. No entanto, supondo que apenas um nível de isolamento seria usado por servidor, a agregação por nível de isolamento não é fornecida.

#### 29.12.20.6 Tabela de Resumo de Aguarda de Objeto

O Schema de Desempenho mantém a tabela `objects_summary_global_by_type` para agregação de eventos de espera de objetos.

Resumo das informações do evento de espera do objeto exemplo:

```
mysql> SELECT * FROM performance_schema.objects_summary_global_by_type\G
...
*************************** 3. row ***************************
   OBJECT_TYPE: TABLE
 OBJECT_SCHEMA: test
   OBJECT_NAME: t
    COUNT_STAR: 3
SUM_TIMER_WAIT: 263126976
MIN_TIMER_WAIT: 1522272
AVG_TIMER_WAIT: 87708678
MAX_TIMER_WAIT: 258428280
...
*************************** 10. row ***************************
   OBJECT_TYPE: TABLE
 OBJECT_SCHEMA: mysql
   OBJECT_NAME: user
    COUNT_STAR: 14
SUM_TIMER_WAIT: 365567592
MIN_TIMER_WAIT: 1141704
AVG_TIMER_WAIT: 26111769
MAX_TIMER_WAIT: 334783032
...
```

A tabela `objects_summary_global_by_type` tem essas colunas de agrupamento para indicar como a tabela agrega eventos: `OBJECT_TYPE`, `OBJECT_SCHEMA` e `OBJECT_NAME`. Cada linha resume os eventos para o objeto especificado.

`objects_summary_global_by_type` tem as mesmas colunas de resumo que as tabelas `events_waits_summary_by_xxx`. Veja a Seção 29.12.20.1, “Tabelas de Resumo de Eventos de Aguardar”.

A tabela `objects_summary_global_by_type` tem esses índices:

* Chave primária em (`OBJECT_TYPE`, `OBJECT_SCHEMA`, `OBJECT_NAME`)

`TRUNCATE TABLE` é permitido para a tabela de resumo do objeto. Ele redefiniu as colunas de resumo para zero em vez de remover as linhas.

#### 29.12.20.7 Tabelas de Resumo de E/S de Arquivo

O Schema de Desempenho mantém tabelas de resumo de I/O de arquivo que agregam informações sobre operações de I/O.

Exemplo de informações de resumo de eventos de E/S de arquivo:

```
mysql> SELECT * FROM performance_schema.file_summary_by_event_name\G
...
*************************** 2. row ***************************
               EVENT_NAME: wait/io/file/sql/binlog
               COUNT_STAR: 31
           SUM_TIMER_WAIT: 8243784888
           MIN_TIMER_WAIT: 0
           AVG_TIMER_WAIT: 265928484
           MAX_TIMER_WAIT: 6490658832
...
mysql> SELECT * FROM performance_schema.file_summary_by_instance\G
...
*************************** 2. row ***************************
                FILE_NAME: /var/mysql/share/english/errmsg.sys
               EVENT_NAME: wait/io/file/sql/ERRMSG
               EVENT_NAME: wait/io/file/sql/ERRMSG
    OBJECT_INSTANCE_BEGIN: 4686193384
               COUNT_STAR: 5
           SUM_TIMER_WAIT: 13990154448
           MIN_TIMER_WAIT: 26349624
           AVG_TIMER_WAIT: 2798030607
           MAX_TIMER_WAIT: 8150662536
...
```

Cada tabela de resumo de I/O de arquivo tem uma ou mais colunas de agrupamento para indicar como a tabela agrega eventos. Os nomes dos eventos se referem aos nomes dos instrumentos de evento na tabela `setup_instruments`:

* `file_summary_by_event_name` possui uma coluna `EVENT_NAME`. Cada linha resume os eventos para um nome de evento específico.

* A coluna `file_summary_by_instance` possui as colunas `FILE_NAME`, `EVENT_NAME` e `OBJECT_INSTANCE_BEGIN`. Cada linha resume os eventos para um arquivo e nome de evento específicos.

Cada tabela de resumo de I/O de arquivo tem as seguintes colunas de resumo que contêm valores agregados. Algumas colunas são mais gerais e têm valores que são iguais à soma dos valores de colunas mais detalhadas. Dessa forma, as agregações em níveis mais altos estão disponíveis diretamente, sem a necessidade de visualizações definidas pelo usuário que somarão colunas de nível mais baixo.

* `COUNT_STAR`, `SUM_TIMER_WAIT`, `MIN_TIMER_WAIT`, `AVG_TIMER_WAIT`, `MAX_TIMER_WAIT`

Essas colunas agregam todas as operações de E/S.

* `COUNT_READ`, `SUM_TIMER_READ`, `MIN_TIMER_READ`, `AVG_TIMER_READ`, `MAX_TIMER_READ`, `SUM_NUMBER_OF_BYTES_READ`

Essas colunas agregam todas as operações de leitura, incluindo `FGETS`, `FGETC`, `FREAD` e `READ`.

* `COUNT_WRITE`, `SUM_TIMER_WRITE`, `MIN_TIMER_WRITE`, `AVG_TIMER_WRITE`, `MAX_TIMER_WRITE`, `SUM_NUMBER_OF_BYTES_WRITE`

Essas colunas agregam todas as operações de escrita, incluindo `FPUTS`, `FPUTC`, `FPRINTF`, `VFPRINTF`, `FWRITE` e `PWRITE`.

* `COUNT_MISC`, `SUM_TIMER_MISC`, `MIN_TIMER_MISC`, `AVG_TIMER_MISC`, `MAX_TIMER_MISC`

Essas colunas agregam todas as outras operações de E/S, incluindo `CREATE`, `DELETE`, `OPEN`, `CLOSE`, `STREAM_OPEN`, `STREAM_CLOSE`, `SEEK`, `TELL`, `FLUSH`, `STAT`, `FSTAT`, `CHSIZE`, `RENAME` e `SYNC`. Não há contagem de bytes para essas operações.

As tabelas de resumo de I/O de arquivo possuem esses índices:

* `file_summary_by_event_name`:

+ Chave primária em (`EVENT_NAME`)
* `file_summary_by_instance`:

+ Chave primária em (`OBJECT_INSTANCE_BEGIN`)

+ Índice sobre (`FILE_NAME`)
+ Índice sobre (`EVENT_NAME`)

`TRUNCATE TABLE` é permitido para tabelas de resumo de I/O de arquivo. Ele redefiniu as colunas de resumo para zero em vez de remover linhas.

O servidor MySQL utiliza várias técnicas para evitar operações de E/S, armazenando informações lidas a partir de arquivos, portanto, é possível que as instruções que você espera resultar em eventos de E/S não o façam. Você pode garantir que o E/S ocorra, limpando os caches ou reiniciando o servidor para redefinir seu estado.

#### 29.12.20.8 Tabelas de Resumo de Wait de Entrada/Saída e Bloqueio #### 29.12.20.8 Tabelas de Resumo de Wait de Entrada/Saída e Bloqueio

As seções a seguir descrevem as tabelas de resumo de espera de I/O e bloqueio:

* `table_io_waits_summary_by_index_usage`: Espera de entrada/saída de tabela por índice

* `table_io_waits_summary_by_table`: Espera de I/O de tabela por tabela

* `table_lock_waits_summary_by_table`: Espera de bloqueio de tabela por tabela

##### 29.12.20.8.1 A tabela table_io_waits_summary_by_table

A tabela `table_io_waits_summary_by_table` agrega todos os eventos de espera de I/O de tabela, conforme gerado pelo instrumento `wait/io/table/sql/handler`. O agrupamento é por tabela.

A tabela `table_io_waits_summary_by_table` tem essas colunas de agrupamento para indicar como a tabela agrega eventos: `OBJECT_TYPE`, `OBJECT_SCHEMA` e `OBJECT_NAME`. Essas colunas têm o mesmo significado que na tabela `events_waits_current`. Elas identificam a tabela à qual a linha se aplica.

`table_io_waits_summary_by_table` tem as seguintes colunas de resumo que contêm valores agregados. Como indicado nas descrições das colunas, algumas colunas são mais gerais e têm valores que são os mesmos que a soma dos valores de colunas mais detalhadas. Por exemplo, as colunas que agregam todos os registros contêm a soma das colunas correspondentes que agregam inserções, atualizações e exclusões. Dessa forma, as agregações em níveis mais altos estão disponíveis diretamente, sem a necessidade de visualizações definidas pelo usuário que somaram colunas de nível mais baixo.

* `COUNT_STAR`, `SUM_TIMER_WAIT`, `MIN_TIMER_WAIT`, `AVG_TIMER_WAIT`, `MAX_TIMER_WAIT`

Essas colunas agregam todas as operações de E/S. Elas são iguais à soma das colunas correspondentes `xxx_READ` e `xxx_WRITE`.

* `COUNT_READ`, `SUM_TIMER_READ`, `MIN_TIMER_READ`, `AVG_TIMER_READ`, `MAX_TIMER_READ`

Essas colunas agregam todas as operações de leitura. Elas são iguais à soma das colunas correspondentes a `xxx_FETCH`.

* `COUNT_WRITE`, `SUM_TIMER_WRITE`, `MIN_TIMER_WRITE`, `AVG_TIMER_WRITE`, `MAX_TIMER_WRITE`

Essas colunas agregam todas as operações de escrita. Elas são iguais à soma das colunas correspondentes `xxx_INSERT`, `xxx_UPDATE` e `xxx_DELETE`.

* `COUNT_FETCH`, `SUM_TIMER_FETCH`, `MIN_TIMER_FETCH`, `AVG_TIMER_FETCH`, `MAX_TIMER_FETCH`

Essas colunas agregam todas as operações de busca.

* `COUNT_INSERT`, `SUM_TIMER_INSERT`, `MIN_TIMER_INSERT`, `AVG_TIMER_INSERT`, `MAX_TIMER_INSERT`

Essas colunas agregam todas as operações de inserção.

* `COUNT_UPDATE`, `SUM_TIMER_UPDATE`, `MIN_TIMER_UPDATE`, `AVG_TIMER_UPDATE`, `MAX_TIMER_UPDATE`

Essas colunas agregam todas as operações de atualização.

* `COUNT_DELETE`, `SUM_TIMER_DELETE`, `MIN_TIMER_DELETE`, `AVG_TIMER_DELETE`, `MAX_TIMER_DELETE`

Essas colunas agregam todas as operações de exclusão.

A tabela `table_io_waits_summary_by_table` tem esses índices:

* Índice único em (`OBJECT_TYPE`, `OBJECT_SCHEMA`, `OBJECT_NAME`)

`TRUNCATE TABLE` é permitido para as tabelas de resumo de I/O de tabela. Ele redefiniu as colunas de resumo para zero em vez de remover linhas. O truncar desta tabela também trunca a tabela `table_io_waits_summary_by_index_usage`.

##### 29.12.20.8.2 Tabela_io_waits_summary_by_index_usage Tabela

A tabela `table_io_waits_summary_by_index_usage` agrega todos os eventos de espera de I/O de índice de tabela, conforme gerado pelo instrumento `wait/io/table/sql/handler`. O agrupamento é por índice de tabela.

As colunas de `table_io_waits_summary_by_index_usage` são quase idênticas a `table_io_waits_summary_by_table`. A única diferença é a coluna adicional de grupo, `INDEX_NAME`, que corresponde ao nome do índice que foi usado quando o evento de espera de I/O da tabela foi registrado:

* Um valor de `PRIMARY` indica que a tabela de E/S utilizou o índice primário.

* Um valor de `NULL` significa que a tabela de E/S não usou índice.

* Os insertos são contados contra `INDEX_NAME = NULL`.

A tabela `table_io_waits_summary_by_index_usage` tem esses índices:

* Índice único sobre (`OBJECT_TYPE`, `OBJECT_SCHEMA`, `OBJECT_NAME`, `INDEX_NAME`)

`TRUNCATE TABLE` é permitido para as tabelas de resumo de I/O de tabela. Ele redefiniu as colunas de resumo para zero em vez de remover linhas. Esta tabela também é truncada pelo truncar da tabela `table_io_waits_summary_by_table`. Uma operação DDL que altera a estrutura de índice de uma tabela pode causar o reajuste das estatísticas por índice.

##### 29.12.20.8.3 Tabela_lock_waits_summary_by_table

A tabela `table_lock_waits_summary_by_table` agrega todos os eventos de espera por bloqueio de tabela, conforme gerado pelo instrumento `wait/lock/table/sql/handler`. O agrupamento é por tabela.

Esta tabela contém informações sobre trancas internas e externas:

* Uma chave interna corresponde a uma chave na camada SQL. Isso é atualmente implementado por uma chamada a `thr_lock()`. Nas linhas de evento, essas chaves são distinguidas pela coluna `OPERATION`, que tem um desses valores:

  ```
  read normal
  read with shared locks
  read high priority
  read no insert
  write allow write
  write concurrent insert
  write delayed
  write low priority
  write normal
  ```

* Uma chave externa corresponde a uma chave na camada do motor de armazenamento. Isso é atualmente implementado por uma chamada a `handler::external_lock()`. Nas linhas de evento, essas chaves são distinguidas pela coluna `OPERATION`, que tem um desses valores:

  ```
  read external
  write external
  ```

A tabela `table_lock_waits_summary_by_table` tem essas colunas de agrupamento para indicar como a tabela agrega eventos: `OBJECT_TYPE`, `OBJECT_SCHEMA` e `OBJECT_NAME`. Essas colunas têm o mesmo significado que na tabela `events_waits_current`. Elas identificam a tabela à qual a linha se aplica.

`table_lock_waits_summary_by_table` tem as seguintes colunas de resumo que contêm valores agregados. Como indicado nas descrições das colunas, algumas colunas são mais gerais e têm valores que são os mesmos que a soma dos valores de colunas mais detalhadas. Por exemplo, as colunas que agregam todos os bloqueios retêm a soma das colunas correspondentes que agregam bloqueios de leitura e escrita. Dessa forma, as agregações em níveis mais altos estão disponíveis diretamente, sem a necessidade de visualizações definidas pelo usuário que somaram colunas de nível mais baixo.

* `COUNT_STAR`, `SUM_TIMER_WAIT`, `MIN_TIMER_WAIT`, `AVG_TIMER_WAIT`, `MAX_TIMER_WAIT`

Essas colunas agregam todas as operações de bloqueio. Elas são iguais à soma das colunas correspondentes `xxx_READ` e `xxx_WRITE`.

* `COUNT_READ`, `SUM_TIMER_READ`, `MIN_TIMER_READ`, `AVG_TIMER_READ`, `MAX_TIMER_READ`

Essas colunas agregam todas as operações de bloqueio de leitura. Elas são iguais à soma das colunas correspondentes aos valores de `xxx_READ_NORMAL`, `xxx_READ_WITH_SHARED_LOCKS`, `xxx_READ_HIGH_PRIORITY` e `xxx_READ_NO_INSERT`.

* `COUNT_WRITE`, `SUM_TIMER_WRITE`, `MIN_TIMER_WRITE`, `AVG_TIMER_WRITE`, `MAX_TIMER_WRITE`

Essas colunas agregam todas as operações de bloqueio de escrita. Elas são iguais à soma das colunas correspondentes aos valores de `xxx_WRITE_ALLOW_WRITE`, `xxx_WRITE_CONCURRENT_INSERT`, `xxx_WRITE_LOW_PRIORITY` e `xxx_WRITE_NORMAL`.

* `COUNT_READ_NORMAL`, `SUM_TIMER_READ_NORMAL`, `MIN_TIMER_READ_NORMAL`, `AVG_TIMER_READ_NORMAL`, `MAX_TIMER_READ_NORMAL`

Essas colunas agregam bloqueios de leitura internos.

* `COUNT_READ_WITH_SHARED_LOCKS`, `SUM_TIMER_READ_WITH_SHARED_LOCKS`, `MIN_TIMER_READ_WITH_SHARED_LOCKS`, `AVG_TIMER_READ_WITH_SHARED_LOCKS`, `MAX_TIMER_READ_WITH_SHARED_LOCKS`

Essas colunas agregam bloqueios de leitura internos.

* `COUNT_READ_HIGH_PRIORITY`, `SUM_TIMER_READ_HIGH_PRIORITY`, `MIN_TIMER_READ_HIGH_PRIORITY`, `AVG_TIMER_READ_HIGH_PRIORITY`, `MAX_TIMER_READ_HIGH_PRIORITY`

Essas colunas agregam bloqueios de leitura internos.

* `COUNT_READ_NO_INSERT`, `SUM_TIMER_READ_NO_INSERT`, `MIN_TIMER_READ_NO_INSERT`, `AVG_TIMER_READ_NO_INSERT`, `MAX_TIMER_READ_NO_INSERT`

Essas colunas agregam bloqueios de leitura internos.

* `COUNT_READ_EXTERNAL`, `SUM_TIMER_READ_EXTERNAL`, `MIN_TIMER_READ_EXTERNAL`, `AVG_TIMER_READ_EXTERNAL`, `MAX_TIMER_READ_EXTERNAL`

Essas colunas agregam bloqueios de leitura externos.

* `COUNT_WRITE_ALLOW_WRITE`, `SUM_TIMER_WRITE_ALLOW_WRITE`, `MIN_TIMER_WRITE_ALLOW_WRITE`, `AVG_TIMER_WRITE_ALLOW_WRITE`, `MAX_TIMER_WRITE_ALLOW_WRITE`

Essas colunas agregam bloqueios de escrita internos.

* `COUNT_WRITE_CONCURRENT_INSERT`, `SUM_TIMER_WRITE_CONCURRENT_INSERT`, `MIN_TIMER_WRITE_CONCURRENT_INSERT`, `AVG_TIMER_WRITE_CONCURRENT_INSERT`, `MAX_TIMER_WRITE_CONCURRENT_INSERT`

Essas colunas agregam bloqueios de escrita internos.

* `COUNT_WRITE_LOW_PRIORITY`, `SUM_TIMER_WRITE_LOW_PRIORITY`, `MIN_TIMER_WRITE_LOW_PRIORITY`, `AVG_TIMER_WRITE_LOW_PRIORITY`, `MAX_TIMER_WRITE_LOW_PRIORITY`

Essas colunas agregam bloqueios de escrita internos.

* `COUNT_WRITE_NORMAL`, `SUM_TIMER_WRITE_NORMAL`, `MIN_TIMER_WRITE_NORMAL`, `AVG_TIMER_WRITE_NORMAL`, `MAX_TIMER_WRITE_NORMAL`

Essas colunas agregam bloqueios de escrita internos.

* `COUNT_WRITE_EXTERNAL`, `SUM_TIMER_WRITE_EXTERNAL`, `MIN_TIMER_WRITE_EXTERNAL`, `AVG_TIMER_WRITE_EXTERNAL`, `MAX_TIMER_WRITE_EXTERNAL`

Essas colunas agregam bloqueios de escrita externa.

A tabela `table_lock_waits_summary_by_table` tem esses índices:

* Índice único sobre (`OBJECT_TYPE`, `OBJECT_SCHEMA`, `OBJECT_NAME`)

`TRUNCATE TABLE` é permitido para tabelas de resumo de bloqueio de tabela. Ele redefre as colunas de resumo para zero em vez de remover linhas.

#### 29.12.20.9 Tabelas Resumo de Soquetes

Essas tabelas de resumo de soquetes agregam informações de temporizador e contagem de bytes para operações de soquete:

* `socket_summary_by_event_name`: Estatísticas de contagem de temporizador agregado e bytes geradas pelos instrumentos `wait/io/socket/*` para todas as operações de E/S de soquete, por instrumento de soquete.

* `socket_summary_by_instance`: Estatísticas de contagem de temporizador agregado e bytes geradas pelos instrumentos `wait/io/socket/*` para todas as operações de E/S de soquete, por instância de soquete. Quando uma conexão é encerrada, a linha em `socket_summary_by_instance` correspondente a ela é excluída.

As tabelas de resumo de espera não agregam as esperas geradas por eventos `idle` enquanto os sockets estão aguardando o próximo pedido do cliente. Para agregações de eventos `idle`, use as tabelas de resumo de evento de espera; veja Seção 29.12.20.1, “Tabelas de Resumo de Evento de Espera”.

Cada tabela de resumo de soquete tem uma ou mais colunas de agrupamento para indicar como a tabela agrega eventos. Os nomes dos eventos referem-se aos nomes dos instrumentos de evento na tabela `setup_instruments`:

* `socket_summary_by_event_name` possui uma coluna `EVENT_NAME`. Cada linha resume os eventos para um nome de evento específico.

* `socket_summary_by_instance` possui uma coluna `OBJECT_INSTANCE_BEGIN`. Cada linha resume os eventos para um objeto específico.

Cada tabela de resumo de soquete tem essas colunas de resumo contendo valores agregados:

* `COUNT_STAR`, `SUM_TIMER_WAIT`, `MIN_TIMER_WAIT`, `AVG_TIMER_WAIT`, `MAX_TIMER_WAIT`

Essas colunas agregam todas as operações.

* `COUNT_READ`, `SUM_TIMER_READ`, `MIN_TIMER_READ`, `AVG_TIMER_READ`, `MAX_TIMER_READ`, `SUM_NUMBER_OF_BYTES_READ`

Essas colunas agregam todas as operações de recebimento (`RECV`, `RECVFROM` e `RECVMSG`).

* `COUNT_WRITE`, `SUM_TIMER_WRITE`, `MIN_TIMER_WRITE`, `AVG_TIMER_WRITE`, `MAX_TIMER_WRITE`, `SUM_NUMBER_OF_BYTES_WRITE`

Essas colunas agregam todas as operações de envio (`SEND`, `SENDTO` e `SENDMSG`).

* `COUNT_MISC`, `SUM_TIMER_MISC`, `MIN_TIMER_MISC`, `AVG_TIMER_MISC`, `MAX_TIMER_MISC`

Essas colunas agregam todas as outras operações de soquete, como `CONNECT`, `LISTEN`, `ACCEPT`, `CLOSE` e `SHUTDOWN`. Não há contagem de bytes para essas operações.

A tabela `socket_summary_by_instance` também possui uma coluna `EVENT_NAME` que indica a classe do soquete: `client_connection`, `server_tcpip_socket`, `server_unix_socket`. Essa coluna pode ser agrupada para isolar, por exemplo, a atividade do cliente daquela dos soquetes de escuta do servidor.

As tabelas de resumo de soquetes têm esses índices:

* `socket_summary_by_event_name`:

+ Chave primária em (`EVENT_NAME`)
* `socket_summary_by_instance`:

+ Chave primária em (`OBJECT_INSTANCE_BEGIN`)

+ Índice sobre (`EVENT_NAME`)

`TRUNCATE TABLE` é permitido para tabelas de resumo de soquetes. Exceto para `events_statements_summary_by_digest`, ele refaz as colunas de resumo para zero em vez de remover linhas.

#### 29.12.20.10 Tabelas Resumo de Memória

Os instrumentos do Schema de Desempenho utilizam a memória e agregam estatísticas de uso de memória, detalhados por esses fatores:

* Tipo de memória utilizada (várias caches, buffers internos, etc.)

* Fio, conta, usuário, host que indiretamente executa a operação de memória

O Schema de Desempenho instrumentaliza os seguintes aspectos do uso da memória

* tamanhos de memória utilizados * contagens de operação * marcas de água baixa e alta

Os tamanhos de memória ajudam a entender ou ajustar o consumo de memória do servidor.

As contagens de operação ajudam a entender ou ajustar a pressão geral que o servidor está exercendo sobre o alocador de memória, o que tem impacto no desempenho. Atribuir um único byte um milhão de vezes não é o mesmo que atribuir um milhão de bytes de uma única vez; rastrear tanto os tamanhos quanto as contagens pode expor a diferença.

As marcas de água baixa e alta são críticas para detectar picos de carga de trabalho, estabilidade geral da carga de trabalho e possíveis vazamentos de memória.

As tabelas de resumo de memória não contêm informações de temporização, pois os eventos de memória não são temporizados.

Para obter informações sobre a coleta de dados de uso de memória, consulte Comportamento de Instrumentação de Memória.

Exemplo de informações de resumo de eventos de memória:

```
mysql> SELECT *
       FROM performance_schema.memory_summary_global_by_event_name
       WHERE EVENT_NAME = 'memory/sql/TABLE'\G
*************************** 1. row ***************************
                  EVENT_NAME: memory/sql/TABLE
                 COUNT_ALLOC: 1381
                  COUNT_FREE: 924
   SUM_NUMBER_OF_BYTES_ALLOC: 2059873
    SUM_NUMBER_OF_BYTES_FREE: 1407432
              LOW_COUNT_USED: 0
          CURRENT_COUNT_USED: 457
             HIGH_COUNT_USED: 461
    LOW_NUMBER_OF_BYTES_USED: 0
CURRENT_NUMBER_OF_BYTES_USED: 652441
   HIGH_NUMBER_OF_BYTES_USED: 669269
```

Cada tabela de resumo de memória tem uma ou mais colunas de agrupamento para indicar como a tabela agrega eventos. Os nomes dos eventos se referem aos nomes dos instrumentos de evento na tabela `setup_instruments`:

* `memory_summary_by_account_by_event_name` possui as colunas `USER`, `HOST` e `EVENT_NAME`. Cada linha resume os eventos para uma combinação específica de conta (usuário e host) e nome de evento.

* A coluna `memory_summary_by_host_by_event_name` possui as colunas `HOST` e `EVENT_NAME`. Cada linha resume os eventos para um determinado hospedeiro e nome de evento.

* A coluna `memory_summary_by_thread_by_event_name` possui as colunas `THREAD_ID` e `EVENT_NAME`. Cada linha resume os eventos para um determinado fio e nome de evento.

* A coluna `memory_summary_by_user_by_event_name` possui as colunas `USER` e `EVENT_NAME`. Cada linha resume os eventos para um usuário e um nome de evento específicos.

* `memory_summary_global_by_event_name` possui uma coluna `EVENT_NAME`. Cada linha resume os eventos para um nome de evento específico.

Cada tabela de resumo de memória tem essas colunas de resumo contendo valores agregados:

* `COUNT_ALLOC`, `COUNT_FREE`

Os números agregados de chamadas para funções de alocação de memória e memória livre.

* `SUM_NUMBER_OF_BYTES_ALLOC`, `SUM_NUMBER_OF_BYTES_FREE`

Os tamanhos agregados dos blocos de memória alocados e liberados.

* `CURRENT_COUNT_USED`

O número agregado de blocos atualmente alocados que ainda não foram liberados. Esta é uma coluna de conveniência, igual a `COUNT_ALLOC` − `COUNT_FREE`.

* `CURRENT_NUMBER_OF_BYTES_USED`

O tamanho agregado dos blocos de memória atualmente alocados que ainda não foram liberados. Essa é uma coluna de conveniência, igual a `SUM_NUMBER_OF_BYTES_ALLOC` − `SUM_NUMBER_OF_BYTES_FREE`.

* `LOW_COUNT_USED`, `HIGH_COUNT_USED`

As marcas de água baixa e alta correspondentes à coluna `CURRENT_COUNT_USED`.

* `LOW_NUMBER_OF_BYTES_USED`, `HIGH_NUMBER_OF_BYTES_USED`

As marcas de água baixa e alta correspondentes à coluna `CURRENT_NUMBER_OF_BYTES_USED`.

As tabelas de resumo de memória têm esses índices:

* `memory_summary_by_account_by_event_name`:

+ Chave primária em (`USER`, `HOST`, `EVENT_NAME`)

* `memory_summary_by_host_by_event_name`:

+ Chave primária em (`HOST`, `EVENT_NAME`)

* `memory_summary_by_thread_by_event_name`:

+ Chave primária em (`THREAD_ID`, `EVENT_NAME`)

* `memory_summary_by_user_by_event_name`:

+ Chave primária em (`USER`, `EVENT_NAME`)

* `memory_summary_global_by_event_name`:

+ Chave primária em (`EVENT_NAME`)

`TRUNCATE TABLE` é permitido para tabelas de resumo de memória. Tem esses efeitos:

* Em geral, a truncação redefre o nível de referência para as estatísticas, mas não altera o estado do servidor. Isso significa que a truncação de uma tabela de memória não libera memória.

* `COUNT_ALLOC` e `COUNT_FREE` são redefinidos em uma nova linha de base, reduzindo cada contador pelo mesmo valor.

* Da mesma forma, `SUM_NUMBER_OF_BYTES_ALLOC` e `SUM_NUMBER_OF_BYTES_FREE` são redefinidos em uma nova linha de base.

* `LOW_COUNT_USED` e `HIGH_COUNT_USED` são redefinidos para `CURRENT_COUNT_USED`.

* `LOW_NUMBER_OF_BYTES_USED` e `HIGH_NUMBER_OF_BYTES_USED` são redefinidos para `CURRENT_NUMBER_OF_BYTES_USED`.

Além disso, cada tabela de resumo de memória que é agregada por conta, host, usuário ou thread é implicitamente truncada pela truncagem da tabela de conexão na qual ela depende, ou pela truncagem de [[`memory_summary_global_by_event_name`]. Para detalhes, consulte a Seção 29.12.8, “Tabelas de Conexão do Schema de Desempenho”.

##### Comportamento de Instrumento de Memória

Os instrumentos de memória estão listados na tabela `setup_instruments` e têm nomes na forma `memory/code_area/instrument_name`. A instrumentação de memória é habilitada por padrão.

Os instrumentos com o prefixo `memory/performance_schema/` mostram quanto memória é alocada para buffers internos no próprio Schema de Desempenho. Os instrumentos `memory/performance_schema/` são construídos, sempre ativados e não podem ser desativados no início ou no runtime. Os instrumentos de memória embutidos são exibidos apenas na tabela `memory_summary_global_by_event_name`.

Para controlar o estado da instrumentação de memória na inicialização do servidor, use linhas como essas no seu arquivo `my.cnf`:

* Habilitar:

  ```
  [mysqld]
  performance-schema-instrument='memory/%=ON'
  ```

* Desativar:

  ```
  [mysqld]
  performance-schema-instrument='memory/%=OFF'
  ```

Para controlar o estado da instrumentação de memória no tempo de execução, atualize a coluna `ENABLED` dos instrumentos relevantes na tabela `setup_instruments`:

* Habilitar:

  ```
  UPDATE performance_schema.setup_instruments
  SET ENABLED = 'YES'
  WHERE NAME LIKE 'memory/%';
  ```

* Desativar:

  ```
  UPDATE performance_schema.setup_instruments
  SET ENABLED = 'NO'
  WHERE NAME LIKE 'memory/%';
  ```

Para instrumentos de memória, a coluna `TIMED` em `setup_instruments` é ignorada porque as operações de memória não são temporizadas.

Quando um fio no servidor executa uma alocação de memória que foi instrumentada, essas regras se aplicam:

* Se o fio não for instrumentado ou o instrumento de memória não estiver habilitado, o bloco de memória alocado não será instrumentado.

* Caso contrário (ou seja, tanto o fio quanto o instrumento estão habilitados), o bloco de memória alocado é instrumentado.

Para a realocação, essas regras se aplicam:

* Se uma operação de alocação de memória foi instrumentada, a operação correspondente de liberação é instrumentada, independentemente do status atual do instrumento ou do fio habilitado.

* Se uma operação de alocação de memória não foi instrumentada, a operação correspondente de liberação não é instrumentada, independentemente do status atual do instrumento ou do fio habilitado.

Para as estatísticas por fio, as seguintes regras se aplicam.

Quando um bloco de memória instrumentado de tamanho *`N`* é alocado, o Schema de Desempenho faz essas atualizações nas colunas da tabela de resumo de memória:

* `COUNT_ALLOC`: Aumentada em 1
* `CURRENT_COUNT_USED`: Aumentada em 1
* `HIGH_COUNT_USED`: Aumentada se `CURRENT_COUNT_USED` é um novo máximo
* `CURRENT_COUNT_USED`: Aumentada se `HIGH_COUNT_USED` é um novo máximo

* `SUM_NUMBER_OF_BYTES_ALLOC`: Aumentada por *`N`*

* `CURRENT_NUMBER_OF_BYTES_USED`: Aumentada por *`N`*

* `HIGH_NUMBER_OF_BYTES_USED`: Aumenta se `CURRENT_NUMBER_OF_BYTES_USED` for um novo máximo

Quando um bloco de memória instrumentado é realocado, o Schema de Desempenho faz essas atualizações nas colunas da tabela de resumo de memória:

* `COUNT_FREE`: Aumentada em 1
* `CURRENT_COUNT_USED`: Reduzida em 1
* `LOW_COUNT_USED`: Reduzida se `CURRENT_COUNT_USED` é um novo mínimo

* `SUM_NUMBER_OF_BYTES_FREE`: Aumentada por *`N`*

* `CURRENT_NUMBER_OF_BYTES_USED`: Reduzida em *`N`*

* `LOW_NUMBER_OF_BYTES_USED`: Reduzida se `CURRENT_NUMBER_OF_BYTES_USED` for um novo mínimo

Para agregados de nível superior (global, por conta, por usuário, por host), as mesmas regras se aplicam conforme esperado para marcas de água baixas e altas.

* `LOW_COUNT_USED` e `LOW_NUMBER_OF_BYTES_USED` são estimativas mais baixas. O valor reportado pelo Performance Schema é garantido para ser menor ou igual ao menor número ou tamanho de memória efetivamente utilizada durante a execução.

* `HIGH_COUNT_USED` e `HIGH_NUMBER_OF_BYTES_USED` são estimativas mais altas. O valor reportado pelo Performance Schema é garantido para ser maior ou igual ao maior número ou tamanho de memória efetivamente utilizada durante a execução.

Para estimativas mais baixas em tabelas resumidas, exceto `memory_summary_global_by_event_name`, é possível que os valores sejam negativos se a propriedade da memória for transferida entre os threads.

Aqui está um exemplo de cálculo de estimativa; mas observe que a implementação da estimativa está sujeita a alterações:

O fio 1 utiliza memória na faixa de 1 MB a 2 MB durante a execução, conforme relatado pelas colunas `LOW_NUMBER_OF_BYTES_USED` e `HIGH_NUMBER_OF_BYTES_USED` da tabela `memory_summary_by_thread_by_event_name`.

O fio 2 utiliza memória na faixa de 10 MB a 12 MB durante a execução, conforme relatado igualmente.

Quando esses dois fios pertencem à mesma conta de usuário, o resumo por conta estima que essa conta usou memória na faixa de 11 MB a 14 MB. Ou seja, o `LOW_NUMBER_OF_BYTES_USED` para o agregado de nível superior é a soma de cada `LOW_NUMBER_OF_BYTES_USED` (assumindo o pior caso). Da mesma forma, o `HIGH_NUMBER_OF_BYTES_USED` para o agregado de nível superior é a soma de cada `HIGH_NUMBER_OF_BYTES_USED` (assumindo o pior caso).

11 MB é uma estimativa mais baixa que pode ocorrer apenas se ambos os threads atingirem a marca de baixo uso ao mesmo tempo.

14 MB é uma estimativa mais alta que pode ocorrer apenas se ambos os threads atingirem a marca de alto uso ao mesmo tempo.

O uso real da memória para esta conta poderia ter ficado na faixa de 11,5 MB a 13,5 MB.

Para o planejamento de capacidade, relatar o pior cenário é, na verdade, o comportamento desejado, pois mostra o que pode potencialmente acontecer quando as sessões não estão correlacionadas, o que é o caso típico.

#### 29.12.20.11 Tabelas de Resumo de Erros

O Schema de Desempenho mantém tabelas resumidas para agregação de informações estatísticas sobre erros de servidor (e avisos). Para uma lista de erros de servidor, consulte o Referência de Mensagem de Erro de Servidor.

A coleta de informações de erro é controlada pelo instrumento `error`, que é ativado por padrão. As informações de temporização não são coletadas.

Cada tabela de resumo de erros tem três colunas que identificam o erro:

* `ERROR_NUMBER` é o valor numérico do erro. O valor é único.

* `ERROR_NAME` é o nome simbólico do erro correspondente ao valor `ERROR_NUMBER`. O valor é único.

* `SQLSTATE` é o valor SQLSTATE correspondente ao valor `ERROR_NUMBER`. O valor não é necessariamente único.

Por exemplo, se `ERROR_NUMBER` é 1050, `ERROR_NAME` é `ER_TABLE_EXISTS_ERROR` e `SQLSTATE` é `42S01`.

Resumo das informações sobre eventos de erro de exemplo:

```
mysql> SELECT *
       FROM performance_schema.events_errors_summary_global_by_error
       WHERE SUM_ERROR_RAISED <> 0\G
*************************** 1. row ***************************
     ERROR_NUMBER: 1064
       ERROR_NAME: ER_PARSE_ERROR
        SQL_STATE: 42000
 SUM_ERROR_RAISED: 1
SUM_ERROR_HANDLED: 0
       FIRST_SEEN: 2016-06-28 07:34:02
        LAST_SEEN: 2016-06-28 07:34:02
*************************** 2. row ***************************
     ERROR_NUMBER: 1146
       ERROR_NAME: ER_NO_SUCH_TABLE
        SQL_STATE: 42S02
 SUM_ERROR_RAISED: 2
SUM_ERROR_HANDLED: 0
       FIRST_SEEN: 2016-06-28 07:34:05
        LAST_SEEN: 2016-06-28 07:36:18
*************************** 3. row ***************************
     ERROR_NUMBER: 1317
       ERROR_NAME: ER_QUERY_INTERRUPTED
        SQL_STATE: 70100
 SUM_ERROR_RAISED: 1
SUM_ERROR_HANDLED: 0
       FIRST_SEEN: 2016-06-28 11:01:49
        LAST_SEEN: 2016-06-28 11:01:49
```

Cada tabela de resumo de erros tem uma ou mais colunas de agrupamento para indicar como a tabela agrega os erros:

* A coluna `events_errors_summary_by_account_by_error` possui as colunas `USER`, `HOST` e `ERROR_NUMBER`. Cada linha resume os eventos para uma combinação específica de conta (usuário e host) e erro.

* A coluna `events_errors_summary_by_host_by_error` possui as colunas `HOST` e `ERROR_NUMBER`. Cada linha resume os eventos para um host e erro específicos.

* A coluna `events_errors_summary_by_thread_by_error` possui as colunas `THREAD_ID` e `ERROR_NUMBER`. Cada linha resume os eventos para um determinado fio e erro.

* A coluna `events_errors_summary_by_user_by_error` possui as colunas `USER` e `ERROR_NUMBER`. Cada linha resume os eventos para um usuário e erro específicos.

* `events_errors_summary_global_by_error` possui uma coluna `ERROR_NUMBER`. Cada linha resume os eventos para um erro específico.

Cada tabela de resumo de erros tem essas colunas de resumo contendo valores agregados:

* `SUM_ERROR_RAISED`

Esta coluna agrega o número de vezes em que o erro ocorreu.

* `SUM_ERROR_HANDLED`

Esta coluna agrega o número de vezes que o erro foi tratado por um manipulador de exceção do SQL.

* `FIRST_SEEN`, `LAST_SEEN`

Data e hora em que o erro foi visto pela primeira vez e mais recentemente.

Uma linha `NULL` em cada tabela de resumo de erros é usada para agregar estatísticas para todos os erros que estão fora do intervalo dos erros instrumentados. Por exemplo, se os erros do MySQL Server estiverem no intervalo de *`M`* a *`N`* e um erro for gerado com o número *`Q`* que não está nesse intervalo, o erro é agregado na linha `NULL`. A linha `NULL` é a linha com `ERROR_NUMBER=0`, `ERROR_NAME=NULL` e `SQLSTATE=NULL`.

As tabelas de resumo de erros têm esses índices:

* `events_errors_summary_by_account_by_error`:

+ Chave primária em (`USER`, `HOST`, `ERROR_NUMBER`)

* `events_errors_summary_by_host_by_error`:

+ Chave primária em (`HOST`, `ERROR_NUMBER`)

* `events_errors_summary_by_thread_by_error`:

+ Chave primária em (`THREAD_ID`, `ERROR_NUMBER`)

* `events_errors_summary_by_user_by_error`:

+ Chave primária em (`USER`, `ERROR_NUMBER`)

* `events_errors_summary_global_by_error`:

+ Chave primária em (`ERROR_NUMBER`)

`TRUNCATE TABLE` é permitido para tabelas de resumo de erros. Tem esses efeitos:

* Para tabelas resumidas que não são agregadas por conta, host ou usuário, o truncamento redefere as colunas resumidas para zero ou `NULL` em vez de remover as linhas.

* Para tabelas resumidas agregadas por conta, host ou usuário, o truncamento remove as linhas de contas, hosts ou usuários sem conexões e redefre as colunas resumidas para zero ou `NULL` para as linhas restantes.

Além disso, cada tabela de resumo de erros que é agregada por conta, host, usuário ou thread é implicitamente truncada pela truncagem da tabela de conexão na qual depende, ou pela truncagem de `events_errors_summary_global_by_error`. Para detalhes, consulte a Seção 29.12.8, “Tabelas de Conexão do Schema de Desempenho”.

#### 29.12.20.12 Tabelas de Resumo de Estatuto Variável

O Schema de Desempenho disponibiliza informações de variáveis de status nas tabelas descritas na Seção 29.12.15, “Tabelas de Variáveis de Status do Schema de Desempenho”. Também disponibiliza informações agregadas de variáveis de status em tabelas resumidas, descritas aqui. Cada tabela de resumo de variáveis de status tem uma ou mais colunas de agrupamento para indicar como a tabela agrega os valores de status:

* A coluna `status_by_account` possui as colunas `USER`, `HOST` e `VARIABLE_NAME` para resumir as variáveis de status por conta.

* A coluna `status_by_host` possui as colunas `HOST` e `VARIABLE_NAME` para resumir as variáveis de status por meio do host a partir do qual os clientes se conectaram.

* A coluna `status_by_user` possui as colunas `USER` e `VARIABLE_NAME` para resumir as variáveis de status por nome do usuário do cliente.

Cada tabela de resumo das variáveis de status tem essa coluna de resumo contendo valores agregados:

* `VARIABLE_VALUE`

O valor da variável de status agregado para sessões ativas e encerradas.

As tabelas de resumo das variáveis de status têm esses índices:

* `status_by_account`:

+ Chave primária em (`USER`, `HOST`, `VARIABLE_NAME`)

* `status_by_host`:

+ Chave primária em (`HOST`, `VARIABLE_NAME`)

* `status_by_user`:

+ Chave primária em (`USER`, `VARIABLE_NAME`)

O significado de “conta” nessas tabelas é semelhante ao seu significado nas tabelas de concessão de permissão do sistema `mysql`, no sentido de que o termo se refere a uma combinação de valores de usuário e host. Eles diferem na medida em que, para as tabelas de concessão de permissão, a parte do host de uma conta pode ser um padrão, enquanto para as tabelas do Schema de Desempenho, o valor do host é sempre um nome de host específico não padrão.

O status da conta é coletado quando as sessões terminam. Os contadores de status de sessão são adicionados aos contadores de status global e aos contadores de status correspondentes da conta. Se as estatísticas da conta não forem coletadas, o status da sessão é adicionado ao status do host e do usuário, se o status do host e do usuário forem coletados.

As estatísticas de conta, hospedagem e usuário não são coletadas se as variáveis de sistema `performance_schema_accounts_size`, `performance_schema_hosts_size` e `performance_schema_users_size`, respectivamente, forem definidas como 0.

O Schema de Desempenho suporta `TRUNCATE TABLE` (truncate-table.html "15.1.37 TRUNCATE TABLE Statement") para tabelas de resumo de variáveis de status da seguinte forma; em todos os casos, o status das sessões ativas não é afetado:

* `status_by_account`: Agrupa o status da conta a partir de sessões terminadas para o status do usuário e do host, e depois redefine o status da conta.

* `status_by_host`: Redefine o status agregado do host a partir de sessões terminadas.

* `status_by_user`: Redefine o status do usuário agregado a partir de sessões terminadas.

`FLUSH STATUS` adiciona o status da sessão de todas as sessões ativas às variáveis de status globais, refaz o status de todas as sessões ativas e refaz os valores de status de conta, host e usuário agregados de sessões desconectadas.

### 29.12.21 Tabelas Diversas do Schema de Desempenho

As seções a seguir descrevem tabelas que não se enquadram nas categorias de tabelas discutidas nas seções anteriores:

* `component_scheduler_tasks`: O status atual de cada tarefa agendada.

* `error_log`: Os eventos mais recentes registrados no log de erro.

* `host_cache`: Informações do cache de hospedagem interna.

* `innodb_redo_log_files`: Informações sobre os arquivos de registro de refazer do InnoDB.

* `log_status`: Informações sobre os registros do servidor para fins de backup.

* `performance_timers`: Quais temporizadores estão disponíveis.

* `processlist`: Informações sobre os processos do servidor.

* `threads`: Informações sobre os threads do servidor.

* `tls_channel_status`: Propriedades do contexto TLS para interfaces de conexão.

* `user_defined_functions`: Funções carregáveis registradas por um componente, plugin ou declaração `CREATE FUNCTION` (create-function-loadable.html "15.7.4.1 CREATE FUNCTION Statement for Loadable Functions").

#### 29.12.21.1 A tabela component_scheduler_tasks

A tabela `component_scheduler_tasks` contém uma linha para cada tarefa agendada. Cada linha contém informações sobre o progresso em andamento de uma tarefa que aplicativos, componentes e plugins podem implementar, opcionalmente, utilizando o componente `scheduler` (ver Seção 7.5.5, “Componente do Cronograma”). Por exemplo, o plugin de servidor `audit_log` utiliza o componente `scheduler` para executar um esvaziamento regular e recorrente de sua cache de memória:

```
mysql> select * from performance_schema.component_scheduler_tasks\G
*************************** 1. row ***************************
            NAME: plugin_audit_log_flush_scheduler
          STATUS: WAITING
         COMMENT: Registered by the audit log plugin. Does a periodic refresh of the audit log
                  in-memory rules cache by calling audit_log_flush
INTERVAL_SECONDS: 100
       TIMES_RUN: 5
    TIMES_FAILED: 0
1 row in set (0.02 sec)
```

A tabela `component_scheduler_tasks` tem as seguintes colunas:

* `NAME`

O nome fornecido durante o registro.

* `STATUS`

Os valores são:

+ `RUNNING` se a tarefa estiver ativa e sendo executada.

+ `WAITING` se a tarefa estiver parada e esperando que o thread de fundo a pegue ou esperando que a próxima vez que ela precise ser executada, ela chegue.

* `COMMENT`

Um comentário fornecido por uma aplicação, componente ou plugin durante a compilação. No exemplo anterior, o MySQL Enterprise Audit fornece o comentário usando um plugin do servidor chamado `audit_log`.

* `INTERVAL_SECONDS`

O tempo em segundos para executar uma tarefa, que um aplicativo, componente ou plugin fornece. O MySQL Enterprise Audit permite que você especifique esse valor usando a variável de sistema `audit_log_flush_interval_seconds`.

* `TIMES_RUN`

Um contador que incrementa em um a cada vez que a tarefa é executada com sucesso. Ele envolve.

* `TIMES_FAILED`

Um contador que incrementa em um a cada vez que a execução da tarefa falha. Ele envolve.

#### 29.12.21.2 Tabela error_log

Dos logs que o servidor MySQL mantém, um deles é o log de erro, para o qual ele escreve mensagens de diagnóstico (veja a Seção 7.4.2, “O Log de Erro”). Normalmente, o servidor escreve diagnósticos em um arquivo no host do servidor ou em um serviço de log do sistema. A partir do MySQL 8.0.22, dependendo da configuração do log de erro, o servidor também pode escrever os eventos de erro mais recentes na tabela do Schema de Desempenho `error_log`. Conceder o privilégio `SELECT` para a tabela `error_log` permite, assim, que clientes e aplicativos acessem o conteúdo do log usando consultas SQL, permitindo que os DBAs forneçam acesso ao log sem a necessidade de permitir acesso direto ao sistema de arquivos no host do servidor.

A tabela `error_log` suporta consultas focadas com base em suas colunas mais estruturadas. Ela também inclui o texto completo das mensagens de erro para suportar uma análise mais livre.

A implementação da tabela utiliza um buffer de anel de memória com tamanho fixo, com eventos antigos descartados automaticamente conforme necessário para fazer espaço para novos eventos.

Exemplo `error_log` de conteúdo:

```
mysql> SELECT * FROM performance_schema.error_log\G
*************************** 1. row ***************************
    LOGGED: 2020-08-06 09:25:00.338624
 THREAD_ID: 0
      PRIO: System
ERROR_CODE: MY-010116
 SUBSYSTEM: Server
      DATA: mysqld (mysqld 8.0.23) starting as process 96344
*************************** 2. row ***************************
    LOGGED: 2020-08-06 09:25:00.363521
 THREAD_ID: 1
      PRIO: System
ERROR_CODE: MY-013576
 SUBSYSTEM: InnoDB
      DATA: InnoDB initialization has started.
...
*************************** 65. row ***************************
    LOGGED: 2020-08-06 09:25:02.936146
 THREAD_ID: 0
      PRIO: Warning
ERROR_CODE: MY-010068
 SUBSYSTEM: Server
      DATA: CA certificate /var/mysql/sslinfo/cacert.pem is self signed.
...
*************************** 89. row ***************************
    LOGGED: 2020-08-06 09:25:03.112801
 THREAD_ID: 0
      PRIO: System
ERROR_CODE: MY-013292
 SUBSYSTEM: Server
      DATA: Admin interface ready for connections, address: '127.0.0.1' port: 33062
```

A tabela `error_log` tem as seguintes colunas. Como indicado nas descrições, todas, exceto a coluna `DATA`, correspondem a campos da estrutura subjacente do evento de erro, que é descrito na Seção 7.4.2.3, “Campos de Evento de Erro”.

* `LOGGED`

O timestamp do evento, com precisão de microsegundo. `LOGGED` corresponde ao campo de eventos de erro `time`, embora com algumas diferenças potenciais:

Os valores de `time` no registro de erro são exibidos de acordo com a configuração da variável de sistema `log_timestamps`; veja o Formato de Saída de Registro de Inicialização Antecipada.

+ A coluna `LOGGED` armazena valores usando o tipo de dados `TIMESTAMP`, para os quais os valores são armazenados em UTC, mas exibidos quando recuperados no fuso horário da sessão atual; consulte a Seção 13.2.2, “Os tipos DATE, DATETIME e TIMESTAMP”.

Para exibir os valores de `LOGGED` no mesmo fuso horário exibido no arquivo de registro de erro, primeiro defina o fuso horário da sessão da seguinte forma:

  ```
  SET @@session.time_zone = @@global.log_timestamps;
  ```

Se o valor `log_timestamps` for `UTC` e o seu sistema não tenha suporte para fuso horário nomeado instalado (consulte a Seção 7.1.15, “Suporte para Fuso Horário do MySQL Server”), defina o fuso horário da seguinte forma:

  ```
  SET @@session.time_zone = '+00:00';
  ```

* `THREAD_ID`

O ID do fio MySQL. `THREAD_ID` corresponde ao campo de eventos de erro `thread`.

Dentro do Schema de Desempenho, a coluna `THREAD_ID` na tabela `error_log` é mais semelhante à coluna `PROCESSLIST_ID` da tabela `threads`:

+ Para os threads de primeiro plano, `THREAD_ID` e `PROCESSLIST_ID` representam um identificador de conexão. Esse é o mesmo valor exibido na coluna `ID` da tabela `INFORMATION_SCHEMA` `PROCESSLIST`, exibida na coluna `Id` da saída `SHOW PROCESSLIST`, e retornada pela função `CONNECTION_ID()` dentro do thread.

+ Para os fios de fundo, `THREAD_ID` é 0 e `PROCESSLIST_ID` é `NULL`.

Muitas tabelas do Schema de Desempenho, além da `error_log`, possuem uma coluna denominada `THREAD_ID`, mas, nessas tabelas, a coluna `THREAD_ID` é um valor atribuído internamente pelo Schema de Desempenho.

* `PRIO`

A prioridade do evento. Os valores permitidos são `System`, `Error`, `Warning`, `Note`. A coluna `PRIO` é baseada no campo de eventos de erro `label`, que por sua vez é baseado no valor subjacente do campo numérico `prio`.

* `ERROR_CODE`

O código numérico do erro de evento. `ERROR_CODE` corresponde ao campo de eventos de erro `error_code`.

* `SUBSYSTEM`

O subsistema em que o evento ocorreu. `SUBSYSTEM` corresponde ao campo de eventos de erro `subsystem`.

* `DATA`

A representação textual do evento de erro. O formato deste valor depende do formato produzido pelo componente de descarga de logs que gera a linha `error_log`. Por exemplo, se o componente de descarga de logs for `log_sink_internal` ou `log_sink_json`, os valores `DATA` representam eventos de erro em formato tradicional ou JSON, respectivamente. (Veja a Seção 7.4.2.9, “Formato de Saída do Log de Erro”.)

Como o log de erro pode ser reconfigurado para alterar o componente de descarga de logs que fornece linhas para a tabela `error_log`, e porque diferentes descargas produzem diferentes formatos de saída, é possível que as linhas escritas na tabela `error_log` em diferentes momentos tenham diferentes formatos de `DATA`.

A tabela `error_log` tem esses índices:

* Chave primária em (`LOGGED`)
* Índice em (`THREAD_ID`)
* Índice em (`PRIO`)
* Índice em (`ERROR_CODE`)
* Índice em (`SUBSYSTEM`)

`TRUNCATE TABLE` não é permitido para a tabela `error_log`.

##### Implementação e Configuração da tabela error_log

A tabela do Schema de Desempenho `error_log` é preenchida por componentes de canal de registro de erro que escrevem na tabela, além de escrever eventos de erro formatados no registro de erro. O suporte do Schema de Desempenho por canais de registro tem duas partes:

* Um sink de registro pode escrever novos eventos de erro na tabela `error_log` à medida que ocorrem.

* Um repositório de logs pode fornecer um analisador para a extração de mensagens de erro previamente escritas. Isso permite que uma instância do servidor leia mensagens escritas em um arquivo de log de erro pela instância anterior e as armazene na tabela `error_log`. Mensagens escritas durante o desligamento pela instância anterior podem ser úteis para diagnosticar por que o desligamento ocorreu.

Atualmente, os rebatentes no formato tradicional `log_sink_internal` e no formato JSON `log_sink_json` permitem a escrita de novos eventos na tabela `error_log` e fornecem um analisador para leitura de arquivos de registro de erros previamente escritos.

A variável de sistema `log_error_services` controla quais componentes de log devem ser habilitados para registro de erros. Seu valor é uma sequência de componentes de filtro de log e de canal de saída de log que serão executados em ordem de esquerda para direita quando eventos de erro ocorrerem. O valor `log_error_services` se refere à preenchimento da tabela `error_log` da seguinte forma:

* Ao inicializar, o servidor examina o valor `log_error_services` e escolhe o canal de saída de registro mais à esquerda que satisfaça essas condições:

+ Um retalho que suporte a tabela `error_log` e forneça um analisador.

+ Se nenhum, um retalho que suporte a tabela `error_log`, mas não forneça um analisador.

Se nenhuma tabela de armazenamento de logs satisfaça essas condições, a tabela `error_log` permanece vazia. Caso contrário, se o armazenamento de logs fornecer um analisador e a configuração de logs permita encontrar um arquivo de log de erro previamente escrito, o servidor usa o analisador do armazenamento de logs para ler a última parte do arquivo e escreve os eventos antigos que ele contém na tabela. O armazenamento de logs, em seguida, escreve novos eventos de erro na tabela à medida que ocorrem.

* Durante a execução, se o valor de `log_error_services` mudar, o servidor o examinará novamente, desta vez procurando o canal de saída habilitado mais à esquerda que suporte a tabela `error_log`, independentemente de ele fornecer um analisador.

Se não existir tal canal de descarte de logs, não serão registrados eventos de erro adicionais na tabela [[`error_log`]. Caso contrário, o canal de descarte recém-configurado escreve novos eventos de erro na tabela à medida que ocorrem.

Qualquer configuração que afete a saída escrita no log de erro afeta o conteúdo da tabela `error_log`. Isso inclui configurações como as de verbosidade, supressão de mensagens e filtragem de mensagens. Isso também se aplica às informações lidas no início de um arquivo de registro anterior. Por exemplo, as mensagens não escritas durante uma instância anterior do servidor configurada com baixa verbosidade não se tornam disponíveis se o arquivo for lido por uma instância atual configurada com maior verbosidade.

A tabela `error_log` é uma visão de um buffer de anel de memória de tamanho fixo, com eventos antigos descartados automaticamente conforme necessário para dar lugar a novos. Como mostrado na tabela a seguir, várias variáveis de status fornecem informações sobre a operação em andamento do `error_log`.

<table summary="error_log table status variables."><col style="width: 35%"/><col style="width: 35%"/><thead><tr> <th>Status Variable</th> <th>Significado</th> </tr></thead><tbody><tr> <td><code>Error_log_buffered_bytes</code></td> <td>Bytes utilizados na tabela</td> </tr><tr> <td><code>Error_log_buffered_events</code></td> <td>Eventos presentes na tabela</td> </tr><tr> <td><code>Error_log_expired_events</code></td> <td>Eventos descartados da tabela</td> </tr><tr> <td><code>Error_log_latest_write</code></td> <td>Tempo da última escrita na tabela</td> </tr></tbody></table>

#### 29.12.21.3 Tabela host_cache

O servidor MySQL mantém um cache de hosts em memória que contém informações sobre o nome do host e o endereço IP do cliente e é usado para evitar pesquisas no Sistema de Nomes de Domínio (DNS). A tabela `host_cache` expõe o conteúdo desse cache. A variável de sistema `host_cache_size` controla o tamanho do cache de hosts, bem como o tamanho da tabela `host_cache`. Para informações operacionais e de configuração sobre o cache de hosts, consulte a Seção 7.1.12.3, “Consultas de DNS e o Cache de Hosts”.

Como a tabela `host_cache` expõe o conteúdo do cache do host, ela pode ser examinada usando as instruções `SELECT`. Isso pode ajudá-lo a diagnosticar as causas dos problemas de conexão.

A tabela `host_cache` tem essas colunas:

* `IP`

O endereço IP do cliente que se conectou ao servidor, expresso como uma string.

* `HOST`

O nome de host resolvido do DNS para o IP desse cliente, ou `NULL` se o nome for desconhecido.

* `HOST_VALIDATED`

Se a resolução DNS de IP para nome de host para IP foi realizada com sucesso para o IP do cliente. Se `HOST_VALIDATED` é `YES`, a coluna `HOST` é usada como o nome de host correspondente ao IP para evitar chamadas adicionais ao DNS. Enquanto `HOST_VALIDATED` é `NO`, a resolução DNS é realizada para cada tentativa de conexão, até que ela eventualmente seja concluída com um resultado válido ou um erro permanente. Essas informações permitem que o servidor evite o cache de nomes de host ruins ou ausentes durante falhas temporárias no DNS, o que afetaria negativamente os clientes para sempre.

* `SUM_CONNECT_ERRORS`

O número de erros de conexão considerados “bloqueantes” (avaliados em relação à variável de sistema `max_connect_errors`). Apenas os erros de aperto de protocolo são contados e apenas para os hosts que passaram na validação (`HOST_VALIDATED = YES`).

Uma vez que o `SUM_CONNECT_ERRORS` de um determinado host atinja o valor de `max_connect_errors`, novas conexões desse host são bloqueadas. O valor do `SUM_CONNECT_ERRORS` pode exceder o valor do `max_connect_errors`, pois múltiplas tentativas de conexão de um host podem ocorrer simultaneamente, enquanto o host não está bloqueado. Qualquer uma ou todas elas podem falhar, incrementando independentemente o `SUM_CONNECT_ERRORS`, possivelmente além do valor do `max_connect_errors`.

Suponha que `max_connect_errors` seja 200 e `SUM_CONNECT_ERRORS` para um host dado seja 199. Se 10 clientes tentarem se conectar simultaneamente desse host, nenhum deles é bloqueado porque `SUM_CONNECT_ERRORS` não atingiu 200. Se ocorrerem erros de bloqueio para cinco dos clientes, `SUM_CONNECT_ERRORS` é aumentado em um para cada cliente, resultando em um valor de `SUM_CONNECT_ERRORS` de 204. Os outros cinco clientes têm sucesso e não são bloqueados porque o valor de `SUM_CONNECT_ERRORS` quando suas tentativas de conexão começaram não atingiu 200. Novas conexões do host que começam após `SUM_CONNECT_ERRORS` atingir 200 são bloqueadas.

* `COUNT_HOST_BLOCKED_ERRORS`

O número de conexões que foram bloqueadas porque `SUM_CONNECT_ERRORS` excedeu o valor da variável de sistema `max_connect_errors`.

* `COUNT_NAMEINFO_TRANSIENT_ERRORS`

O número de erros transitórios durante a resolução de DNS de nome de host para IP.

* `COUNT_NAMEINFO_PERMANENT_ERRORS`

O número de erros permanentes durante a resolução de nomes de DNS de IP para host.

* `COUNT_FORMAT_ERRORS`

O número de erros no formato do nome do host. O MySQL não realiza a correspondência dos valores das colunas `Host` na tabela `mysql.user` do sistema contra nomes de host para os quais um ou mais dos componentes iniciais do nome são inteiramente numéricos, como `1.2.example.com`. O endereço IP do cliente é usado em vez disso. Para a justificativa de por que esse tipo de correspondência não ocorre, consulte a Seção 8.2.4, “Especificação de Nomes de Conta”.

* `COUNT_ADDRINFO_TRANSIENT_ERRORS`

O número de erros transitórios durante a resolução reversa de DNS de nomes de host para IP.

* `COUNT_ADDRINFO_PERMANENT_ERRORS`

O número de erros permanentes durante a resolução reversa de DNS de nomes de host para IP.

* `COUNT_FCRDNS_ERRORS`

O número de erros de DNS reversa confirmados. Esses erros ocorrem quando a resolução DNS de nome-a-IP para IP-a-nome produz um endereço IP que não corresponde ao endereço IP do cliente que originou a solicitação.

* `COUNT_HOST_ACL_ERRORS`

O número de erros que ocorrem porque nenhum usuário é autorizado a se conectar do host do cliente. Nesses casos, o servidor retorna `ER_HOST_NOT_PRIVILEGED` e nem sequer pede um nome de usuário ou senha.

* `COUNT_NO_AUTH_PLUGIN_ERRORS`

O número de erros devido a solicitações para um plugin de autenticação indisponível. Um plugin pode estar indisponível se, por exemplo, ele nunca tiver sido carregado ou se uma tentativa de carregamento falhou.

* `COUNT_AUTH_PLUGIN_ERRORS`

O número de erros relatados pelos plugins de autenticação.

Um plugin de autenticação pode relatar diferentes códigos de erro para indicar a causa raiz de uma falha. Dependendo do tipo de erro, uma dessas colunas é incrementada: `COUNT_AUTHENTICATION_ERRORS`, `COUNT_AUTH_PLUGIN_ERRORS`, `COUNT_HANDSHAKE_ERRORS`. Novos códigos de retorno são uma extensão opcional da API do plugin existente. Erros de plugin desconhecidos ou inesperados são contados na coluna `COUNT_AUTH_PLUGIN_ERRORS`.

* `COUNT_HANDSHAKE_ERRORS`

O número de erros detectados no nível do protocolo de fios.

* `COUNT_PROXY_USER_ERRORS`

O número de erros detectados quando o usuário proxy A é redirecionado para outro usuário B que não existe.

* `COUNT_PROXY_USER_ACL_ERRORS`

O número de erros detectados quando o usuário proxy A é redirecionado para outro usuário B que existe, mas para o qual A não tem o privilégio `PROXY`.

* `COUNT_AUTHENTICATION_ERRORS`

O número de erros causados por autenticação falha.

* `COUNT_SSL_ERRORS`

O número de erros devido a problemas SSL.

* `COUNT_MAX_USER_CONNECTIONS_ERRORS`

O número de erros causados pelo excedente de cotas de conexão por usuário. Veja a Seção 8.2.21, “Definindo Limites de Recursos da Conta”.

* `COUNT_MAX_USER_CONNECTIONS_PER_HOUR_ERRORS`

O número de erros causados pelo excedente de conexões por usuário por hora. Veja a Seção 8.2.21, “Definindo Limites de Recursos da Conta”.

* `COUNT_DEFAULT_DATABASE_ERRORS`

O número de erros relacionados ao banco de dados padrão. Por exemplo, o banco de dados não existe ou o usuário não tem privilégios para acessá-lo.

* `COUNT_INIT_CONNECT_ERRORS`

O número de erros causados por falhas na execução de declarações na variável de sistema `init_connect`.

* `COUNT_LOCAL_ERRORS`

O número de erros específicos à implementação do servidor e não relacionados à rede, autenticação ou autorização. Por exemplo, as condições de falta de memória pertencem a essa categoria.

* `COUNT_UNKNOWN_ERRORS`

O número de outros erros desconhecidos não considerados por outras colunas nesta tabela. Esta coluna é reservada para uso futuro, caso novas condições de erro precisem ser relatadas, e se for necessário preservar a compatibilidade e a estrutura reversa da tabela `host_cache`.

* `FIRST_SEEN`

O horário de marcação da primeira tentativa de conexão vista pelo cliente na coluna `IP`.

* `LAST_SEEN`

O horário da tentativa de conexão mais recente vista do cliente na coluna `IP`.

* `FIRST_ERROR_SEEN`

O horário do primeiro erro visto pelo cliente na coluna `IP`.

* `LAST_ERROR_SEEN`

O horário do erro mais recente visto do cliente na coluna `IP`.

A tabela `host_cache` tem esses índices:

* Chave primária em (`IP`)
* Índice em (`HOST`)

`TRUNCATE TABLE` é permitido para a tabela `host_cache`. Ele requer o privilégio `DROP` para a tabela. O truncar da tabela esvazia o cache do host, que tem os efeitos descritos em Esvaziar o cache do host.

#### 29.12.21.4 A tabela innodb_redo_log_files

A tabela `innodb_redo_log_files` contém uma linha para cada arquivo de registro de reescrita `InnoDB` ativo. Essa tabela foi introduzida no MySQL 8.0.30.

A tabela `innodb_redo_log_files` tem as seguintes colunas:

* `FILE_ID`

O ID do arquivo de registro de refazer. O valor corresponde ao número do arquivo de registro de refazer.

* `FILE_NAME`

O caminho e o nome do arquivo do log de refazer.

* `START_LSN`

O número de sequência do log do primeiro bloco no arquivo de log de refazer.

* `END_LSN`

O número de sequência do log após o último bloco no arquivo de log de refazer.

* `SIZE_IN_BYTES`

O tamanho dos dados do log de refazer no arquivo, em bytes. O tamanho dos dados é medido a partir do `END_LSN` até o início `>START_LSN`. O tamanho do arquivo de log de refazer no disco é ligeiramente maior devido ao cabeçalho do arquivo (2048 bytes), que não está incluído no valor relatado por esta coluna.

* `IS_FULL`

Se o arquivo de registro de refazer está cheio. Um valor de 0 indica que há espaço livre no arquivo. Um valor de 1 indica que o arquivo está cheio.

* `CONSUMER_LEVEL`

Reservado para uso futuro.

#### 29.12.21.5 Tabela log_status

A tabela `log_status` fornece informações que permitem que uma ferramenta de backup online copie os arquivos de registro necessários sem bloquear esses recursos durante a duração do processo de cópia.

Quando a tabela `log_status` é consultada, o servidor bloqueia o registro e as alterações administrativas relacionadas apenas por um tempo suficiente para preencher a tabela, e depois libera os recursos. A tabela `log_status` informa ao backup online em que ponto ele deve copiar até no log binário da fonte e no registro `gtid_executed`, e o log de relevo para cada canal de replicação. Ela também fornece informações relevantes para motores de armazenamento individuais, como o último número de sequência de log (LSN) e o LSN do último ponto de verificação realizado para o motor de armazenamento `InnoDB`.

A tabela `log_status` tem essas colunas:

* `SERVER_UUID`

O UUID do servidor para esta instância do servidor. Este é o valor único gerado da variável de sistema `server_uuid` que é somente de leitura.

* `LOCAL`

As informações de estado da posição de registro da fonte, fornecidas como um único objeto JSON com as seguintes chaves:

`binary_log_file` :   O nome do arquivo de registro binário atual.

`binary_log_position` :   A posição atual do log binário no momento em que a tabela `log_status` foi acessada.

`gtid_executed` :   O valor atual da variável de servidor global `gtid_executed` no momento em que a tabela `log_status` foi acessada. Esta informação é consistente com as chaves `binary_log_file` e `binary_log_position`.

* `REPLICATION`

Um array JSON de canais, cada um com as seguintes informações:

`channel_name` :   O nome do canal de replicação. O nome do canal de replicação padrão é a string vazia (“”).

`relay_log_file` :   O nome do arquivo de registro atual do relé para o canal de replicação.

`relay_log_pos` :   A posição atual do relé no momento em que a tabela `log_status` foi acessada.

* `STORAGE_ENGINES`

Informações relevantes de motores de armazenamento individuais, fornecidas como um objeto JSON com uma chave para cada motor de armazenamento aplicável.

A tabela `log_status` não tem índices.

O privilégio `BACKUP_ADMIN`, assim como o privilégio `SELECT`, é necessário para acessar a tabela `log_status`.

`TRUNCATE TABLE` não é permitido para a tabela `log_status`.

#### 29.12.21.6 Tabela performance_timers

A tabela `performance_timers` mostra quais temporizadores de evento estão disponíveis:

```
mysql> SELECT * FROM performance_schema.performance_timers;
+-------------+-----------------+------------------+----------------+
| TIMER_NAME  | TIMER_FREQUENCY | TIMER_RESOLUTION | TIMER_OVERHEAD |
+-------------+-----------------+------------------+----------------+
| CYCLE       |      2389029850 |                1 |             72 |
| NANOSECOND  |      1000000000 |                1 |            112 |
| MICROSECOND |         1000000 |                1 |            136 |
| MILLISECOND |            1036 |                1 |            168 |
| THREAD_CPU  |       339101694 |                1 |            798 |
+-------------+-----------------+------------------+----------------+
```

Se os valores associados a um nome de temporizador dado forem `NULL`, esse temporizador não é suportado na sua plataforma. Para uma explicação sobre como o temporizador de eventos ocorre, consulte a Seção 29.4.1, “Temporização de Eventos do Schema de Desempenho”.

A tabela `performance_timers` tem essas colunas:

* `TIMER_NAME`

O nome do temporizador.

* `TIMER_FREQUENCY`

O número de unidades temporizador por segundo. Para um temporizador de ciclo, a frequência geralmente está relacionada à velocidade da CPU. Por exemplo, em um sistema com um processador de 2,4 GHz, o `CYCLE` pode estar próximo a 2400000000.

* `TIMER_RESOLUTION`

Indica o número de unidades de temporizador pelas quais os valores do temporizador aumentam. Se um temporizador tiver uma resolução de 10, seu valor aumenta em 10 cada vez.

* `TIMER_OVERHEAD`

O número mínimo de ciclos de overhead para obter um temporizador com o temporizador dado. O Schema de Desempenho determina esse valor ao invocar o temporizador 20 vezes durante a inicialização e selecionar o menor valor. O overhead total é realmente o dobro desse valor porque a instrumentação invoca o temporizador no início e no fim de cada evento. O código do temporizador é chamado apenas para eventos temporizados, então esse overhead não se aplica para eventos não temporizados.

A tabela `performance_timers` não tem índices.

`TRUNCATE TABLE` não é permitido para a tabela `performance_timers`.

#### 29.12.21.7 Tabela de processos

A lista de processos do MySQL indica as operações atualmente realizadas pelo conjunto de threads que estão sendo executadas dentro do servidor. A tabela `processlist` é uma fonte de informações sobre os processos. Para uma comparação desta tabela com outras fontes, consulte Fontes de Informações sobre Processos.

A tabela `processlist` pode ser consultada diretamente. Se você tiver o privilégio `PROCESS`, poderá ver todos os tópicos, mesmo aqueles pertencentes a outros usuários. Caso contrário (sem o privilégio `PROCESS`, usuários não anônimos têm acesso às informações sobre seus próprios tópicos, mas não a tópicos de outros usuários, e usuários anônimos não têm acesso às informações dos tópicos.

Nota

Se a variável de sistema `performance_schema_show_processlist` estiver habilitada, a tabela `processlist` também serve como base para uma implementação alternativa subjacente à declaração `SHOW PROCESSLIST`. Para obter detalhes, consulte mais adiante nesta seção.

A tabela `processlist` contém uma linha para cada processo do servidor:

```
mysql> SELECT * FROM performance_schema.processlist\G
*************************** 1. row ***************************
     ID: 5
   USER: event_scheduler
   HOST: localhost
     DB: NULL
COMMAND: Daemon
   TIME: 137
  STATE: Waiting on empty queue
   INFO: NULL
*************************** 2. row ***************************
     ID: 9
   USER: me
   HOST: localhost:58812
     DB: NULL
COMMAND: Sleep
   TIME: 95
  STATE:
   INFO: NULL
*************************** 3. row ***************************
     ID: 10
   USER: me
   HOST: localhost:58834
     DB: test
COMMAND: Query
   TIME: 0
  STATE: executing
   INFO: SELECT * FROM performance_schema.processlist
...
```

A tabela `processlist` tem essas colunas:

* `ID`

O identificador de conexão. Este é o mesmo valor exibido na coluna `Id` da declaração `SHOW PROCESSLIST`, exibida na coluna `PROCESSLIST_ID` da tabela do Schema de Desempenho `threads`, e retornada pela função `CONNECTION_ID()` dentro do thread.

* `USER`

O usuário do MySQL que emitiu a declaração. Um valor de `system user` refere-se a um fio não cliente gerado pelo servidor para lidar com tarefas internamente, por exemplo, um fio de manipulação de linha atrasada ou um fio de E/S ou SQL usado em hosts replicados. Para `system user`, não há um host especificado na coluna `Host`. `unauthenticated user` refere-se a um fio que se tornou associado a uma conexão com cliente, mas para o qual a autenticação do usuário do cliente ainda não ocorreu. `event_scheduler` refere-se ao fio que monitora eventos agendados (ver Seção 27.4, “Usando o Cronograma de Eventos”).

Nota

Um valor `USER` de `system user` é distinto do privilégio `SYSTEM_USER`. O primeiro designa os threads internos. Este último distingue as categorias de usuário do sistema e as contas de usuário regulares (consulte a Seção 8.2.11, “Categorias de Conta”).

* `HOST`

O nome do host do cliente que emite a declaração (exceto para `system user`, para o qual não há nenhum nome de host). O nome do host para conexões TCP/IP é relatado no formato `host_name:client_port` para facilitar a determinação de qual cliente está fazendo o que.

* `DB`

O banco de dados padrão para o tópico, ou `NULL` se nenhum tiver sido selecionado.

* `COMMAND`

O tipo de comando que o thread está executando em nome do cliente, ou `Sleep` se a sessão estiver inativa. Para descrições dos comandos do thread, consulte a Seção 10.14, “Examinando Informações do Thread (Processo) do Servidor” (Informações). O valor desta coluna corresponde aos comandos `COM_xxx` do protocolo cliente/servidor e às variáveis de status `Com_xxx`. Consulte a Seção 7.1.10, “Variáveis de Status do Servidor”

* `TIME`

O tempo em segundos que o fio esteve em seu estado atual. Para um fio de replicação SQL, o valor é o número de segundos entre o timestamp do último evento replicado e o tempo real do host da replica. Veja a Seção 19.2.3, “Fios de Replicação”.

* `STATE`

Uma ação, evento ou estado que indica o que o fio está fazendo. Para descrições dos valores de `STATE`, consulte a Seção 10.14, “Examinando informações do fio do servidor (processo”) (Informações).

A maioria dos estados corresponde a operações muito rápidas. Se um fio permanecer em um estado específico por muitos segundos, pode haver um problema que precisa ser investigado.

* `INFO`

A declaração que o fio está executando, ou `NULL` se não estiver executando nenhuma declaração. A declaração pode ser a uma enviada ao servidor, ou uma declaração interna se a declaração executar outras declarações. Por exemplo, se uma declaração `CALL` executar um procedimento armazenado que está executando uma declaração `SELECT`, o valor `INFO` mostra a declaração `SELECT`.

* `EXECUTION_ENGINE`

O motor de execução de consulta. O valor é `PRIMARY` ou `SECONDARY`. Para uso com o MySQL HeatWave Service e o MySQL HeatWave, onde o motor `PRIMARY` é `InnoDB` e o motor `SECONDARY` é MySQL HeatWave (`RAPID`). Para o MySQL Community Edition Server, o MySQL Enterprise Edition Server (on-premise) e o MySQL HeatWave Service sem o MySQL HeatWave, o valor é sempre `PRIMARY`. Esta coluna foi adicionada no MySQL 8.0.29.

A tabela `processlist` tem esses índices:

* Chave primária ativada (`ID`)

`TRUNCATE TABLE` não é permitido para a tabela `processlist`.

Como mencionado anteriormente, se a variável de sistema `performance_schema_show_processlist` estiver habilitada, a tabela `processlist` serve como base para uma implementação alternativa de outras fontes de informações de processo:

* A declaração `SHOW PROCESSLIST`.

* O comando **mysqladmin processlist** (que utiliza a declaração `SHOW PROCESSLIST`(show-processlist.html "15.7.7.29 SHOW PROCESSLIST Statement")).

A implementação padrão `SHOW PROCESSLIST` percorre os threads ativos a partir do gerenciador de threads, mantendo um mutex global. Isso tem consequências negativas de desempenho, especialmente em sistemas ocupados. A implementação alternativa `SHOW PROCESSLIST` é baseada na tabela do Schema de Desempenho `processlist`. Essa implementação consulta os dados dos threads ativos do Schema de Desempenho, em vez do gerenciador de threads, e não requer um mutex.

A configuração do MySQL afeta o conteúdo da tabela `processlist` da seguinte forma:

* Configuração mínima necessária:

+ O servidor MySQL deve ser configurado e construído com a instrumentação de thread habilitada. Isso é verdadeiro por padrão; é controlado usando a opção `DISABLE_PSI_THREAD` **CMake**.

+ O Schema de Desempenho deve ser habilitado na inicialização do servidor. Isso é verdadeiro por padrão; ele é controlado usando a variável de sistema `performance_schema`.

Com essa configuração satisfeita, `performance_schema_show_processlist` habilita ou desativa a implementação alternativa `SHOW PROCESSLIST`. Se a configuração mínima não for satisfeita, a tabela `processlist` (e, portanto, `SHOW PROCESSLIST`(show-processlist.html "15.7.7.29 SHOW PROCESSLIST Statement")) pode não retornar todos os dados.

* Configuração recomendada:

+ Para evitar que alguns tópicos sejam ignorados:

- Deixe a variável de sistema `performance_schema_max_thread_instances` definida como padrão ou definida pelo menos tão grande quanto a variável de sistema `max_connections`.

- Deixe a variável de sistema `performance_schema_max_thread_classes` definida como padrão.

+ Para evitar que alguns valores da coluna `STATE` sejam vazios, deixe a variável de sistema `performance_schema_max_stage_classes` definida como o seu valor padrão.

O padrão para esses parâmetros de configuração é `-1`, que faz com que o Performance Schema os dimensione automaticamente ao iniciar o servidor. Com os parâmetros definidos conforme indicado, a tabela `processlist` (e, portanto, `SHOW PROCESSLIST`) fornece informações completas sobre os processos.

Os parâmetros de configuração anteriores afetam o conteúdo da tabela `processlist`. Para uma configuração dada, no entanto, o conteúdo da `processlist` não é afetado pela configuração da `performance_schema_show_processlist`.

A implementação da lista de processos alternativos não se aplica à tabela `INFORMATION_SCHEMA` `PROCESSLIST` ou ao comando `COM_PROCESS_INFO` do protocolo cliente/servidor MySQL.

#### 29.12.21.8 Tabela de fios

A tabela `threads` contém uma linha para cada fio do servidor. Cada linha contém informações sobre um fio e indica se o monitoramento e o registro de eventos históricos estão habilitados para ele:

```
mysql> SELECT * FROM performance_schema.threads\G
*************************** 1. row ***************************
            THREAD_ID: 1
                 NAME: thread/sql/main
                 TYPE: BACKGROUND
       PROCESSLIST_ID: NULL
     PROCESSLIST_USER: NULL
     PROCESSLIST_HOST: NULL
       PROCESSLIST_DB: mysql
  PROCESSLIST_COMMAND: NULL
     PROCESSLIST_TIME: 418094
    PROCESSLIST_STATE: NULL
     PROCESSLIST_INFO: NULL
     PARENT_THREAD_ID: NULL
                 ROLE: NULL
         INSTRUMENTED: YES
              HISTORY: YES
      CONNECTION_TYPE: NULL
         THREAD_OS_ID: 5856
       RESOURCE_GROUP: SYS_default
     EXECUTION_ENGINE: PRIMARY
    CONTROLLED_MEMORY: 1456
MAX_CONTROLLED_MEMORY: 67480
         TOTAL_MEMORY: 1270430
     MAX_TOTAL_MEMORY: 1307317
     TELEMETRY_ACTIVE: NO
...
```

Quando o Schema de Desempenho é inicializado, ele preenche a tabela `threads` com base nos threads existentes naquela época. Posteriormente, uma nova linha é adicionada a cada vez que o servidor cria um thread.

Os valores das colunas `INSTRUMENTED` e `HISTORY` para novos tópicos são determinados pelo conteúdo da tabela `setup_actors`. Para informações sobre como usar a tabela `setup_actors` para controlar essas colunas, consulte a Seção 29.4.6, “Pré-filtragem por Tópico”.

A remoção de linhas da tabela `threads` ocorre quando os threads terminam. Para um thread associado a uma sessão de cliente, a remoção ocorre quando a sessão termina. Se um cliente tiver o auto-reconexão habilitado e a sessão se reconectar após uma desconexão, a sessão se torna associada a uma nova linha na tabela `threads` que tem um valor diferente de `PROCESSLIST_ID`. Os valores iniciais de `INSTRUMENTED` e `HISTORY` para o novo thread podem ser diferentes daqueles do thread original: A tabela `setup_actors` pode ter sido alterada entretanto, e se o valor de `INSTRUMENTED` ou `HISTORY` para o thread original foi alterado após a linha ser inicializada, a alteração não se transfere para o novo thread.

Você pode habilitar ou desabilitar o monitoramento de threads (ou seja, se os eventos executados pelo thread são instrumentados) e o registro histórico de eventos. Para controlar os valores iniciais dos `INSTRUMENTED` e `HISTORY` para novos threads de primeiro plano, use a tabela `setup_actors`. Para controlar esses aspectos dos threads existentes, defina as colunas `INSTRUMENTED` e `HISTORY` das linhas da tabela `threads`. (Para mais informações sobre as condições sob as quais o monitoramento de threads e o registro histórico de eventos ocorrem, consulte as descrições das colunas `INSTRUMENTED` e `HISTORY`.)

Para uma comparação das colunas da tabela `threads` com nomes que têm um prefixo de `PROCESSLIST_` com outras fontes de informações sobre o processo, consulte as Fontes de Informações sobre o Processo.

Importante

Para fontes de informações sobre threads que não sejam a tabela `threads`, as informações sobre threads para outros usuários são mostradas apenas se o usuário atual tiver o privilégio `PROCESS`. Isso não é verdade para a tabela `threads`; todas as linhas são mostradas para qualquer usuário que tenha o privilégio `SELECT` para a tabela. Os usuários que não devem ser capazes de ver threads para outros usuários ao acessar a tabela `threads` não devem receber o privilégio `SELECT` para ela.

A tabela `threads` tem essas colunas:

* `THREAD_ID`

Um identificador único de fio.

* `NAME`

O nome associado ao código de instrumentação de thread no servidor. Por exemplo, `thread/sql/one_connection` corresponde à função de thread no código responsável por lidar com uma conexão de usuário, e `thread/sql/main` representa a função `main()` do servidor.

* `TYPE`

O tipo de fio, seja `FOREGROUND` ou `BACKGROUND`. Os fios de conexão do usuário são fios de primeiro plano. Os fios associados à atividade do servidor interno são fios de segundo plano. Exemplos são os fios internos `InnoDB`, os fios "dump de binlog" que enviam informações para réplicas e os fios de I/O de replicação e SQL.

* `PROCESSLIST_ID`

Para um fio de primeiro plano (associado a uma conexão de usuário), este é o identificador de conexão. Este é o mesmo valor exibido na coluna `ID` da tabela `INFORMATION_SCHEMA` `PROCESSLIST`, exibida na coluna `Id` de `SHOW PROCESSLIST` saída e devolvida pela função `CONNECTION_ID()` dentro do fio.

Para um fio de fundo (não associado a uma conexão de usuário), `PROCESSLIST_ID` é `NULL`, portanto, os valores não são exclusivos.

* `PROCESSLIST_USER`

O usuário associado a um fio de plano de fundo, `NULL` para um fio de plano de fundo.

* `PROCESSLIST_HOST`

O nome do host do cliente associado a uma thread de primeiro plano, `NULL` para uma thread de segundo plano.

Ao contrário da coluna `HOST` da tabela `INFORMATION_SCHEMA` ou da coluna `PROCESSLIST` da saída `SHOW PROCESSLIST`, a coluna `PROCESSLIST_HOST` não inclui o número do porto para conexões TCP/IP. Para obter essas informações do Gerador de Dados de Desempenho, habilite a instrumentação de soquetes (que não está habilitada por padrão) e examine a tabela `socket_instances`:

  ```
  mysql> SELECT NAME, ENABLED, TIMED
         FROM performance_schema.setup_instruments
         WHERE NAME LIKE 'wait/io/socket%';
  +----------------------------------------+---------+-------+
  | NAME                                   | ENABLED | TIMED |
  +----------------------------------------+---------+-------+
  | wait/io/socket/sql/server_tcpip_socket | NO      | NO    |
  | wait/io/socket/sql/server_unix_socket  | NO      | NO    |
  | wait/io/socket/sql/client_connection   | NO      | NO    |
  +----------------------------------------+---------+-------+
  3 rows in set (0.01 sec)

  mysql> UPDATE performance_schema.setup_instruments
         SET ENABLED='YES'
         WHERE NAME LIKE 'wait/io/socket%';
  Query OK, 3 rows affected (0.00 sec)
  Rows matched: 3  Changed: 3  Warnings: 0

  mysql> SELECT * FROM performance_schema.socket_instances\G
  *************************** 1. row ***************************
             EVENT_NAME: wait/io/socket/sql/client_connection
  OBJECT_INSTANCE_BEGIN: 140612577298432
              THREAD_ID: 31
              SOCKET_ID: 53
                     IP: ::ffff:127.0.0.1
                   PORT: 55642
                  STATE: ACTIVE
  ...
  ```

* `PROCESSLIST_DB`

O banco de dados padrão para o tópico, ou `NULL` se nenhum tiver sido selecionado.

* `PROCESSLIST_COMMAND`

Para os threads de primeiro plano, o tipo de comando que o thread está executando em nome do cliente, ou `Sleep` se a sessão estiver inativa. Para descrições dos comandos dos threads, consulte a Seção 10.14, “Examinando as Informações do Thread (Processo) do Servidor” (Informações). O valor desta coluna corresponde aos comandos `COM_xxx` do protocolo cliente/servidor e às variáveis de status `Com_xxx`. Consulte a Seção 7.1.10, “Variáveis de Status do Servidor”

Os threads de segundo plano não executam comandos em nome dos clientes, portanto, esta coluna pode ser `NULL`.

* `PROCESSLIST_TIME`

O tempo em segundos que o fio esteve em seu estado atual. Para um fio de replicação SQL, o valor é o número de segundos entre o timestamp do último evento replicado e o tempo real do host da replica. Veja a Seção 19.2.3, “Fios de Replicação”.

* `PROCESSLIST_STATE`

Uma ação, evento ou estado que indica o que o fio está fazendo. Para descrições dos valores de `PROCESSLIST_STATE`, consulte a Seção 10.14, “Examinando Informações do Fio (Processo) do Servidor” (Informações). Se o valor for `NULL`, o fio pode corresponder a uma sessão de cliente inativo ou o trabalho que está sendo feito não está instrumentado com etapas.

A maioria dos estados corresponde a operações muito rápidas. Se um fio permanecer em um estado específico por muitos segundos, pode haver um problema que precisa ser investigado.

* `PROCESSLIST_INFO`

A declaração que o fio está executando, ou `NULL` se não estiver executando nenhuma declaração. A declaração pode ser a uma enviada ao servidor, ou uma declaração interna se a declaração executar outras declarações. Por exemplo, se uma declaração `CALL` executar um procedimento armazenado que está executando uma declaração `SELECT`, o valor `PROCESSLIST_INFO` mostra a declaração `SELECT`.

* `PARENT_THREAD_ID`

Se este fio for um subfio (gerado por outro fio), este é o valor `THREAD_ID` do fio gerador.

* `ROLE`

  Unused.

* `INSTRUMENTED`

Se os eventos executados pelo fio são instrumentados. O valor é `YES` ou `NO`.

+ Para os threads de primeiro plano, o valor inicial `INSTRUMENTED` é determinado pelo fato de a conta de usuário associada ao thread corresponder a qualquer linha na tabela `setup_actors`. A correspondência é baseada nos valores das colunas `PROCESSLIST_USER` e `PROCESSLIST_HOST`.

Se o fio gerar um subfio, a correspondência ocorre novamente para a linha da tabela `threads` criada para o subfio.

+ Para os threads de plano de fundo, `INSTRUMENTED` é `YES` por padrão. `setup_actors` não é consultado porque não há um usuário associado para os threads de plano de fundo.

+ Para qualquer thread, seu valor `INSTRUMENTED` pode ser alterado durante a vida útil da thread.

Para que o monitoramento de eventos executados pelo thread ocorra, essas coisas devem ser verdadeiras:

+ O consumidor `thread_instrumentation` na tabela `setup_consumers` deve ser `YES`.

+ A coluna `threads.INSTRUMENTED` deve ser `YES`.

+ O monitoramento ocorre apenas para os eventos de fio produzidos a partir de instrumentos que têm a coluna `ENABLED` definida como `YES` na tabela `setup_instruments`.

* `HISTORY`

Se deve registrar eventos históricos para o tópico. O valor é `YES` ou `NO`.

+ Para os threads de primeiro plano, o valor inicial `HISTORY` é determinado pelo fato de a conta de usuário associada ao thread corresponder a qualquer linha na tabela `setup_actors`. A correspondência é baseada nos valores das colunas `PROCESSLIST_USER` e `PROCESSLIST_HOST`.

Se o fio gerar um subfio, a correspondência ocorre novamente para a linha da tabela `threads` criada para o subfio.

+ Para os threads de plano de fundo, `HISTORY` é `YES` por padrão. `setup_actors` não é consultado porque não há um usuário associado para os threads de plano de fundo.

+ Para qualquer thread, seu valor `HISTORY` pode ser alterado durante a vida útil da thread.

Para que o registro de eventos históricos ocorra para o fio, essas coisas devem ser verdadeiras:

+ Os consumidores apropriados relacionados a histórico no `setup_consumers` tabela devem ser habilitados. Por exemplo, o registro de eventos de espera nas tabelas `events_waits_history` e `events_waits_history_long` requer que os consumidores correspondentes `events_waits_history` e `events_waits_history_long` sejam `YES`.

+ A coluna `threads.HISTORY` deve ser `YES`.

+ O registro ocorre apenas para aqueles eventos de thread produzidos a partir de instrumentos que têm a coluna `ENABLED` definida como `YES` na tabela `setup_instruments`.

* `CONNECTION_TYPE`

O protocolo usado para estabelecer a conexão, ou `NULL` para threads de fundo. Os valores permitidos são `TCP/IP` (conexão TCP/IP estabelecida sem encriptação), `SSL/TLS` (conexão TCP/IP estabelecida com encriptação), `Socket` (conexão de arquivo de soquete Unix), `Named Pipe` (conexão de canal nomeado do Windows) e `Shared Memory` (conexão de memória compartilhada do Windows).

* `THREAD_OS_ID`

O identificador do fio ou tarefa, conforme definido pelo sistema operacional subjacente, se houver um:

+ Quando um fio MySQL está associado ao mesmo fio do sistema operacional durante toda a sua vida útil, `THREAD_OS_ID` contém o ID do fio do sistema operacional.

+ Quando um fio MySQL não está associado ao mesmo fio do sistema operacional ao longo de sua vida útil, `THREAD_OS_ID` contém `NULL`. Isso é típico de sessões de usuário quando o plugin de pool de threads é usado (veja Seção 7.6.3, “MySQL Enterprise Thread Pool”).

Para o Windows, `THREAD_OS_ID` corresponde ao ID de thread visível no Explorador de Processos (<https://technet.microsoft.com/en-us/sysinternals/bb896653.aspx>).

Para o Linux, `THREAD_OS_ID` corresponde ao valor da função `gettid()`. Esse valor é exposto, por exemplo, usando os comandos **perf** ou **ps -L**, ou no sistema de arquivos `proc` (`/proc/[pid]/task/[tid]`). Para mais informações, consulte as páginas de manual `perf-stat(1)`, `ps(1)` e `proc(5)`.

* `RESOURCE_GROUP`

O rótulo do grupo de recursos. Esse valor é `NULL` se os grupos de recursos não forem suportados na configuração atual da plataforma ou do servidor (consulte Restrições de grupo de recursos).

* `EXECUTION_ENGINE`

O motor de execução de consulta. O valor é `PRIMARY` ou `SECONDARY`. Para uso com o MySQL HeatWave Service e o MySQL HeatWave, onde o motor `PRIMARY` é `InnoDB` e o motor `SECONDARY` é MySQL HeatWave (`RAPID`). Para o MySQL Community Edition Server, o MySQL Enterprise Edition Server (on-premise) e o MySQL HeatWave Service sem o MySQL HeatWave, o valor é sempre `PRIMARY`. Esta coluna foi adicionada no MySQL 8.0.29.

* `CONTROLLED_MEMORY`

Quantidade de memória controlada usada pelo thread.

Esta coluna foi adicionada no MySQL 8.0.31.

* `MAX_CONTROLLED_MEMORY`

Valor máximo de `CONTROLLED_MEMORY` observado durante a execução da thread.

Esta coluna foi adicionada no MySQL 8.0.31.

* `TOTAL_MEMORY`

A quantidade atual de memória, controlada ou não, usada pelo thread.

Esta coluna foi adicionada no MySQL 8.0.31.

* `MAX_TOTAL_MEMORY`

O valor máximo de `TOTAL_MEMORY` visto durante a execução da thread.

Esta coluna foi adicionada no MySQL 8.0.31.

* `TELEMETRY_ACTIVE`

Se o fio tem uma sessão de telemetria ativa anexada. O valor é `YES` ou `NO`.

Esta coluna foi adicionada no MySQL 8.0.33.

A tabela `threads` tem esses índices:

* Chave primária em (`THREAD_ID`)
* Índice em (`NAME`)
* Índice em (`PROCESSLIST_ID`)
* Índice em (`PROCESSLIST_USER`, `PROCESSLIST_HOST`)

* Índice sobre (`PROCESSLIST_HOST`)
* Índice sobre (`THREAD_OS_ID`)
* Índice sobre (`RESOURCE_GROUP`)

`TRUNCATE TABLE` não é permitido para a tabela `threads`.

#### 29.12.21.9 A tabela tls_channel_status

As propriedades da interface de conexão TLS são definidas na inicialização do servidor e podem ser atualizadas em tempo de execução usando a declaração `ALTER INSTANCE RELOAD TLS`. Veja [Configuração e monitoramento de configuração em tempo de execução no lado do servidor para conexões criptografadas](using-encrypted-connections.html#using-encrypted-connections-server-side-runtime-configuration "Server-Side Runtime Configuration and Monitoring for Encrypted Connections").

A tabela `tls_channel_status` (disponível a partir do MySQL 8.0.21) fornece informações sobre as propriedades da interface de conexão TLS:

```
mysql> SELECT * FROM performance_schema.tls_channel_status\G
*************************** 1. row ***************************
 CHANNEL: mysql_main
PROPERTY: Enabled
   VALUE: Yes
*************************** 2. row ***************************
 CHANNEL: mysql_main
PROPERTY: ssl_accept_renegotiates
   VALUE: 0
*************************** 3. row ***************************
 CHANNEL: mysql_main
PROPERTY: Ssl_accepts
   VALUE: 2
...
*************************** 29. row ***************************
 CHANNEL: mysql_admin
PROPERTY: Enabled
   VALUE: No
*************************** 30. row ***************************
 CHANNEL: mysql_admin
PROPERTY: ssl_accept_renegotiates
   VALUE: 0
*************************** 31. row ***************************
 CHANNEL: mysql_admin
PROPERTY: Ssl_accepts
   VALUE: 0
...
```

A tabela `tls_channel_status` tem essas colunas:

* `CHANNEL`

O nome da interface de conexão à qual a linha da propriedade TLS se aplica. `mysql_main` e `mysql_admin` são os nomes dos canais para as interfaces de conexão principal e administrativa, respectivamente. Para informações sobre as diferentes interfaces, consulte a Seção 7.1.12.1, “Interfaces de Conexão”.

* `PROPERTY`

O nome da propriedade TLS. A linha para a propriedade `Enabled` indica o status da interface geral, onde a interface e seu status são nomeados nas colunas `CHANNEL` e `VALUE`, respectivamente. Outros nomes de propriedades indicam propriedades TLS particulares. Essas frequentemente correspondem aos nomes das variáveis de status relacionadas ao TLS.

* `VALUE`

O valor da propriedade TLS.

As propriedades exibidas por esta tabela não são fixas e dependem da instrumentação implementada por cada canal.

Para cada canal, a linha com um valor de `PROPERTY` de `Enabled` indica se o canal suporta conexões criptografadas, e outras linhas do canal indicam as propriedades do contexto TLS:

* Para `mysql_main`, a propriedade `Enabled` é `yes` ou `no` para indicar se a interface principal suporta conexões criptografadas. Outras linhas de canal exibem propriedades de contexto TLS para a interface principal.

Para a interface principal, informações semelhantes sobre o status podem ser obtidas usando essas declarações:

  ```
  SHOW GLOBAL STATUS LIKE 'current_tls%';
  SHOW GLOBAL STATUS LIKE 'ssl%';
  ```

* Para `mysql_admin`, a propriedade `Enabled` é `no` se a interface administrativa não estiver habilitada ou estiver habilitada, mas não suporte conexões criptografadas. `Enabled` é `yes` se a interface estiver habilitada e suporte conexões criptografadas.

Quando `Enabled` é `yes`, as outras linhas `mysql_admin` indicam as propriedades do canal para o contexto da interface administrativa TLS apenas se algum valor do parâmetro TLS não padrão for configurado para essa interface. (Este é o caso se alguma variável de sistema `admin_tls_xxx` ou `admin_ssl_xxx` for definida com um valor diferente do seu padrão.) Caso contrário, a interface administrativa usa o mesmo contexto TLS que a interface principal.

A tabela `tls_channel_status` não tem índices.

`TRUNCATE TABLE` não é permitido para a tabela `tls_channel_status`.

#### 29.12.21.10 A tabela user_defined_functions

A tabela `user_defined_functions` contém uma linha para cada função carregável registrada automaticamente por um componente ou plugin, ou manualmente por uma declaração `CREATE FUNCTION`(create-function-loadable.html "15.7.4.1 CREATE FUNCTION Statement for Loadable Functions"). Para informações sobre operações que adicionam ou removem linhas da tabela, consulte a Seção 7.7.1, “Instalando e Desinstalando Funções Carregáveis”.

Nota

O nome da tabela `user_defined_functions` deriva da terminologia utilizada em sua concepção para o tipo de função agora conhecido como função carregável (ou seja, função definida pelo usuário, ou UDF).

A tabela `user_defined_functions` tem essas colunas:

* `UDF_NAME`

O nome da função conforme referido em declarações SQL. O valor é `NULL` se a função foi registrada por uma declaração `CREATE FUNCTION` (create-function.html "15.1.14 CREATE FUNCTION Statement") e está em processo de descarregamento.

* `UDF_RETURN_TYPE`

O tipo do valor de retorno da função. O valor é um dos `int`, `decimal`, `real`, `char` ou `row`.

* `UDF_TYPE`

O tipo de função. O valor é um dos `function` (escalar) ou `aggregate`.

* `UDF_LIBRARY`

O nome do arquivo da biblioteca que contém o código da função executável. O arquivo está localizado no diretório nomeado pela variável de sistema `plugin_dir`. O valor é `NULL` se a função foi registrada por um componente ou plugin em vez de por uma declaração `CREATE FUNCTION`.

* `UDF_USAGE_COUNT`

O número atual de uso da função. Isso é usado para indicar se as declarações estão atualmente acessando a função.

A tabela `user_defined_functions` tem esses índices:

* Chave primária ativada (`UDF_NAME`)

`TRUNCATE TABLE` não é permitido para a tabela `user_defined_functions`.

A tabela do sistema `mysql.func` também lista as funções carregáveis instaladas, mas apenas aquelas instaladas usando [`CREATE FUNCTION`](create-function-loadable.html "15.7.4.1 CREATE FUNCTION Statement for Loadable Functions"). A tabela `user_defined_functions` lista as funções carregáveis instaladas usando [`CREATE FUNCTION`](create-function-loadable.html "15.7.4.1 CREATE FUNCTION Statement for Loadable Functions"), bem como as funções carregáveis instaladas automaticamente por componentes ou plugins. Essa diferença torna `user_defined_functions` preferível a `mysql.func` para verificar quais funções carregáveis estão instaladas.