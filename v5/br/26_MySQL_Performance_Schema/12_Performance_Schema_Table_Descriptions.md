## 25.12 Descritores de tabela do esquema de desempenho

As tabelas no banco de dados `performance_schema` podem ser agrupadas da seguinte forma:

* Configurar tabelas. Essas tabelas são usadas para configurar e exibir características de monitoramento.

* Tabelas de eventos atuais. A tabela `events_waits_current` contém o evento mais recente para cada tópico. Outras tabelas semelhantes contêm eventos atuais em diferentes níveis da hierarquia de eventos: `events_stages_current` para eventos de estágio, `events_statements_current` para eventos de declaração e `events_transactions_current` para eventos de transação.

* Tabelas de histórico. Essas tabelas têm a mesma estrutura das tabelas de eventos atuais, mas contêm mais strings. Por exemplo, para eventos de espera, a tabela `events_waits_history` contém os 10 eventos mais recentes por thread. `events_waits_history_long` contém os 10.000 eventos mais recentes. Existem outras tabelas semelhantes para históricos de estágios, declarações e transações.

Para alterar os tamanhos das tabelas de histórico, defina as variáveis de sistema apropriadas na inicialização do servidor. Por exemplo, para definir os tamanhos das tabelas de histórico de eventos de espera, defina `performance_schema_events_waits_history_size` e `performance_schema_events_waits_history_long_size`.

* Tabelas de resumo. Essas tabelas contêm informações agregadas em grupos de eventos, incluindo aqueles que foram descartados das tabelas de histórico.

* Tabelas de instância. Essas tabelas documentam os tipos de objetos que são instrumentados. Um objeto instrumentado, quando usado pelo servidor, produz um evento. Essas tabelas fornecem nomes de eventos e notas explicativas ou informações de status.

* Tabelas mistas. Essas não se enquadram em nenhum dos outros grupos de tabelas.

### 25.12.1 Referência à Tabela do Schema de Desempenho

A tabela a seguir resume todas as tabelas do Schema de Desempenho disponíveis. Para mais detalhes, consulte as descrições individuais das tabelas.

**Tabela 25.1 Tabelas do Schema de Desempenho**

<table frame="box" rules="all" summary="A reference that lists all Performance Schema tables."><col style="width: 25%"/><col style="width: 62%"/><col style="width: 12%"/><thead><tr><th>Table Name</th> <th>Description</th> <th>Deprecated</th> </tr></thead><tbody><tr><th><code>accounts</code></th> <td>Estatísticas de conexão por conta do cliente</td> <td></td> </tr><tr><th><code>cond_instances</code></th> <td>Synchronization object instances</td> <td></td> </tr><tr><th><code>events_stages_current</code></th> <td>Current stage events</td> <td></td> </tr><tr><th><code>events_stages_history</code></th> <td>Eventos mais recentes por thread</td> <td></td> </tr><tr><th><code>events_stages_history_long</code></th> <td>Eventos mais recentes em estádio no geral</td> <td></td> </tr><tr><th><code>events_stages_summary_by_account_by_event_name</code></th> <td>Eventos em andamento por conta e nome do evento</td> <td></td> </tr><tr><th><code>events_stages_summary_by_host_by_event_name</code></th> <td>Eventos em andamento por nome do anfitrião e nome do evento</td> <td></td> </tr><tr><th><code>events_stages_summary_by_thread_by_event_name</code></th> <td>Espera de palco por thread e nome de evento</td> <td></td> </tr><tr><th><code>events_stages_summary_by_user_by_event_name</code></th> <td>Eventos em andamento por nome do usuário e nome do evento</td> <td></td> </tr><tr><th><code>events_stages_summary_global_by_event_name</code></th> <td>Esperas de palco por nome de evento</td> <td></td> </tr><tr><th><code>events_statements_current</code></th> <td>Current statement events</td> <td></td> </tr><tr><th><code>events_statements_history</code></th> <td>Eventos de declaração mais recentes por thread</td> <td></td> </tr><tr><th><code>events_statements_history_long</code></th> <td>Eventos mais recentes em geral</td> <td></td> </tr><tr><th><code>events_statements_summary_by_account_by_event_name</code></th> <td>Eventos declarados por conta e nome de evento</td> <td></td> </tr><tr><th><code>events_statements_summary_by_digest</code></th> <td>Eventos declarativos por esquema e valor de digestão</td> <td></td> </tr><tr><th><code>events_statements_summary_by_host_by_event_name</code></th> <td>Eventos declarados por nome de anfitrião e nome do evento</td> <td></td> </tr><tr><th><code>events_statements_summary_by_program</code></th> <td>Eventos declarados por programa armazenado</td> <td></td> </tr><tr><th><code>events_statements_summary_by_thread_by_event_name</code></th> <td>Eventos declarados por thread e nome de evento</td> <td></td> </tr><tr><th><code>events_statements_summary_by_user_by_event_name</code></th> <td>Eventos declarativos por nome de usuário e nome de evento</td> <td></td> </tr><tr><th><code>events_statements_summary_global_by_event_name</code></th> <td>Eventos declarativos por nome de evento</td> <td></td> </tr><tr><th><code>events_transactions_current</code></th> <td>Current transaction events</td> <td></td> </tr><tr><th><code>events_transactions_history</code></th> <td>Eventos de transação mais recentes por thread</td> <td></td> </tr><tr><th><code>events_transactions_history_long</code></th> <td>Eventos de transação mais recentes no geral</td> <td></td> </tr><tr><th><code>events_transactions_summary_by_account_by_event_name</code></th> <td>Eventos de transação por conta e nome do evento</td> <td></td> </tr><tr><th><code>events_transactions_summary_by_host_by_event_name</code></th> <td>Eventos de transação por nome de host e nome de evento</td> <td></td> </tr><tr><th><code>events_transactions_summary_by_thread_by_event_name</code></th> <td>Eventos de transação por thread e nome de evento</td> <td></td> </tr><tr><th><code>events_transactions_summary_by_user_by_event_name</code></th> <td>Eventos de transação por nome de usuário e nome de evento</td> <td></td> </tr><tr><th><code>events_transactions_summary_global_by_event_name</code></th> <td>Eventos de transação por nome de evento</td> <td></td> </tr><tr><th><code>events_waits_current</code></th> <td>Current wait events</td> <td></td> </tr><tr><th><code>events_waits_history</code></th> <td>Eventos de espera mais recentes por thread</td> <td></td> </tr><tr><th><code>events_waits_history_long</code></th> <td>Eventos de espera mais recentes no geral</td> <td></td> </tr><tr><th><code>events_waits_summary_by_account_by_event_name</code></th> <td>Eventos esperados por conta e nome do evento</td> <td></td> </tr><tr><th><code>events_waits_summary_by_host_by_event_name</code></th> <td>Eventos esperados por nome de host e nome de evento</td> <td></td> </tr><tr><th><code>events_waits_summary_by_instance</code></th> <td>Eventos de espera por instância</td> <td></td> </tr><tr><th><code>events_waits_summary_by_thread_by_event_name</code></th> <td>Eventos de espera por thread e nome do evento</td> <td></td> </tr><tr><th><code>events_waits_summary_by_user_by_event_name</code></th> <td>Eventos esperados por nome de usuário e nome de evento</td> <td></td> </tr><tr><th><code>events_waits_summary_global_by_event_name</code></th> <td>Eventos esperados por nome de evento</td> <td></td> </tr><tr><th><code>file_instances</code></th> <td>File instances</td> <td></td> </tr><tr><th><code>file_summary_by_event_name</code></th> <td>Filtre os eventos por nome de evento</td> <td></td> </tr><tr><th><code>file_summary_by_instance</code></th> <td>Eventos por instância do arquivo</td> <td></td> </tr><tr><th><code>global_status</code></th> <td>Global status variables</td> <td></td> </tr><tr><th><code>global_variables</code></th> <td>Global system variables</td> <td></td> </tr><tr><th><code>host_cache</code></th> <td>Informações do cache de hospedagem interna</td> <td></td> </tr><tr><th><code>hosts</code></th> <td>Estatísticas de conexão por nome de host do cliente</td> <td></td> </tr><tr><th><code>memory_summary_by_account_by_event_name</code></th> <td>Operações de memória por conta e nome de evento</td> <td></td> </tr><tr><th><code>memory_summary_by_host_by_event_name</code></th> <td>Operações de memória por host e nome de evento</td> <td></td> </tr><tr><th><code>memory_summary_by_thread_by_event_name</code></th> <td>Operações de memória por thread e nome de evento</td> <td></td> </tr><tr><th><code>memory_summary_by_user_by_event_name</code></th> <td>Operações de memória por usuário e nome de evento</td> <td></td> </tr><tr><th><code>memory_summary_global_by_event_name</code></th> <td>Operações de memória globalmente por nome de evento</td> <td></td> </tr><tr><th><code>metadata_locks</code></th> <td>Lâminas de bloqueio de metadados e solicitações de bloqueio</td> <td></td> </tr><tr><th><code>mutex_instances</code></th> <td>Objetos de sincronização Mutex</td> <td></td> </tr><tr><th><code>objects_summary_global_by_type</code></th> <td>Object summaries</td> <td></td> </tr><tr><th><code>performance_timers</code></th> <td>Quais temporizadores estão disponíveis</td> <td></td> </tr><tr><th><code>prepared_statements_instances</code></th> <td>Instâncias de declaração preparada e estatísticas</td> <td></td> </tr><tr><th><code>replication_applier_configuration</code></th> <td>Parâmetros de configuração para o aplicativo de replicação no replica</td> <td></td> </tr><tr><th><code>replication_applier_status</code></th> <td>Status atual do aplicativo de replicação no replica</td> <td></td> </tr><tr><th><code>replication_applier_status_by_coordinator</code></th> <td>Status do aplicativo de aplicação de thread SQL ou coordenador</td> <td></td> </tr><tr><th><code>replication_applier_status_by_worker</code></th> <td>Status do aplicativo de aplicação de thread do trabalhador</td> <td></td> </tr><tr><th><code>replication_connection_configuration</code></th> <td>Parâmetros de configuração para conectar-se à fonte</td> <td></td> </tr><tr><th><code>replication_connection_status</code></th> <td>Status atual da conexão com a fonte</td> <td></td> </tr><tr><th><code>replication_group_member_stats</code></th> <td>Estatísticas dos membros do grupo de replicação</td> <td></td> </tr><tr><th><code>replication_group_members</code></th> <td>Rede e status do membro do grupo de replicação</td> <td></td> </tr><tr><th><code>rwlock_instances</code></th> <td>Bloquear instâncias de objetos de sincronização</td> <td></td> </tr><tr><th><code>session_account_connect_attrs</code></th> <td>Atributos de conexão por sessão atual</td> <td></td> </tr><tr><th><code>session_connect_attrs</code></th> <td>Atributos de conexão para todas as sessões</td> <td></td> </tr><tr><th><code>session_status</code></th> <td>Variáveis de status para a sessão atual</td> <td></td> </tr><tr><th><code>session_variables</code></th> <td>Variáveis do sistema para a sessão atual</td> <td></td> </tr><tr><th><code>setup_actors</code></th> <td>Como inicializar o monitoramento para novos threads de primeiro plano</td> <td></td> </tr><tr><th><code>setup_consumers</code></th> <td>Consumidores para os quais as informações sobre o evento podem ser armazenadas</td> <td></td> </tr><tr><th><code>setup_instruments</code></th> <td>Classes de objetos instrumentados para os quais eventos podem ser coletados</td> <td></td> </tr><tr><th><code>setup_objects</code></th> <td>Quais objetos devem ser monitorados</td> <td></td> </tr><tr><th><code>setup_timers</code></th> <td>Currently selected event timers</td> <td>5.7.21</td> </tr><tr><th><code>socket_instances</code></th> <td>Active connection instances</td> <td></td> </tr><tr><th><code>socket_summary_by_event_name</code></th> <td>Socket waits and I/O per event name</td> <td></td> </tr><tr><th><code>socket_summary_by_instance</code></th> <td>Socket waits and I/O per instance</td> <td></td> </tr><tr><th><code>status_by_account</code></th> <td>Variáveis de status de sessão por conta</td> <td></td> </tr><tr><th><code>status_by_host</code></th> <td>Variáveis de status de sessão por nome de host</td> <td></td> </tr><tr><th><code>status_by_thread</code></th> <td>Variáveis de status de sessão por sessão</td> <td></td> </tr><tr><th><code>status_by_user</code></th> <td>Variáveis de status de sessão por nome de usuário</td> <td></td> </tr><tr><th><code>table_handles</code></th> <td>Lâminas de fechamento e solicitações de fechamento</td> <td></td> </tr><tr><th><code>table_io_waits_summary_by_index_usage</code></th> <td>Table I/O waits per index</td> <td></td> </tr><tr><th><code>table_io_waits_summary_by_table</code></th> <td>Table I/O waits per table</td> <td></td> </tr><tr><th><code>table_lock_waits_summary_by_table</code></th> <td>Esperas de bloqueio de tabela por tabela</td> <td></td> </tr><tr><th><code>threads</code></th> <td>Informações sobre os threads do servidor</td> <td></td> </tr><tr><th><code>user_variables_by_thread</code></th> <td>Variáveis definidas pelo usuário por thread</td> <td></td> </tr><tr><th><code>users</code></th> <td>Estatísticas de conexão por nome de usuário do cliente</td> <td></td> </tr><tr><th><code>variables_by_thread</code></th> <td>Variáveis do sistema de sessão por sessão</td> <td></td> </tr></tbody></table>

### 25.12.1 Tabelas de Configuração do Schema de Desempenho

As tabelas de configuração fornecem informações sobre a instrumentação atual e permitem que a configuração de monitoramento seja alterada. Por essa razão, algumas colunas nessas tabelas podem ser alteradas se você tiver o privilégio `UPDATE`.

O uso de tabelas em vez de variáveis individuais para informações de configuração oferece um alto grau de flexibilidade na modificação da configuração do Performance Schema. Por exemplo, você pode usar uma única declaração com sintaxe SQL padrão para fazer várias alterações de configuração simultâneas.

Estes são os modelos disponíveis:

* `setup_actors`: Como inicializar o monitoramento para novos threads de primeiro plano

* `setup_consumers`: Os destinos para os quais as informações do evento podem ser enviadas e armazenadas

* `setup_instruments`: As classes de objetos instrumentados para os quais eventos podem ser coletados

* `setup_objects`: Quais objetos devem ser monitorados

* `setup_timers`: O temporizador do evento atual

#### 25.12.2.1 A tabela setup_actors

A tabela `setup_actors` contém informações que determinam se é necessário habilitar o monitoramento e o registro de eventos históricos para novos threads de servidor de primeiro plano (threads associados a conexões de cliente). Essa tabela tem um tamanho máximo de 100 strings por padrão. Para alterar o tamanho da tabela, modifique a variável de sistema `performance_schema_setup_actors_size` na inicialização do servidor.

Para cada novo thread de plano de fundo, o Schema de Desempenho corresponde o usuário e o host do thread às strings da tabela `setup_actors`. Se uma string dessa tabela corresponder, seus valores nas colunas `ENABLED` e `HISTORY` são usados para definir as colunas `INSTRUMENTED` e `HISTORY`, respectivamente, da string da tabela `threads` para o thread. Isso permite que a instrumentação e o registro de eventos históricos sejam aplicados seletivamente por host, usuário ou conta (combinação de usuário e host). Se não houver correspondência, as colunas `INSTRUMENTED` e `HISTORY` para o thread são definidas como `NO`.

Para os threads de fundo, não há um usuário associado. `INSTRUMENTED` e `HISTORY` são `YES` por padrão e `setup_actors` não é consultado.

Os conteúdos iniciais da tabela `setup_actors` correspondem a qualquer combinação de usuário e host, portanto, o monitoramento e a coleta de eventos históricos são habilitados por padrão para todos os threads de primeiro plano:

```sql
mysql> SELECT * FROM performance_schema.setup_actors;
+------+------+------+---------+---------+
| HOST | USER | ROLE | ENABLED | HISTORY |
+------+------+------+---------+---------+
| %    | %    | %    | YES     | YES     |
+------+------+------+---------+---------+
```

Para obter informações sobre como usar a tabela `setup_actors` para afetar o monitoramento de eventos, consulte a Seção 25.4.6, “Pré-filtragem por Fuso Horário”.

As modificações na tabela `setup_actors` afetam apenas os threads de primeiro plano criados após a modificação, e não os threads existentes. Para afetar os threads existentes, modifique as colunas `INSTRUMENTED` e `HISTORY` das strings da tabela `threads`.

A tabela `setup_actors` tem essas colunas:

* `HOST`

O nome do host. Isso deve ser um nome literal, ou `'%'` para significar “qualquer host”.

* `USER`

O nome do usuário. Isso deve ser um nome literal, ou `'%'` para significar “qualquer usuário”.

* `ROLE`

  Unused.

* `ENABLED`

Se deve habilitar a instrumentação para os threads de primeiro plano correspondentes à string. O valor é `YES` ou `NO`.

* `HISTORY`

Se deve registrar eventos históricos para os threads de primeiro plano correspondentes à string. O valor é `YES` ou `NO`.

`TRUNCATE TABLE` é permitido para a tabela `setup_actors`. Ele remove as strings.

#### 25.12.2.2 A tabela setup_consumers

A tabela `setup_consumers` lista os tipos de consumidores para os quais as informações de evento podem ser armazenadas e que estão habilitados:

```sql
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
| events_transactions_current      | NO      |
| events_transactions_history      | NO      |
| events_transactions_history_long | NO      |
| events_waits_current             | NO      |
| events_waits_history             | NO      |
| events_waits_history_long        | NO      |
| global_instrumentation           | YES     |
| thread_instrumentation           | YES     |
| statements_digest                | YES     |
+----------------------------------+---------+
```

As configurações de consumo na tabela `setup_consumers` formam uma hierarquia de níveis mais altos para níveis mais baixos. Para informações detalhadas sobre o efeito da ativação de diferentes consumidores, consulte a Seção 25.4.7, “Pré-filtragem por Consumidor”.

As modificações na tabela `setup_consumers` afetam o monitoramento imediatamente.

A tabela `setup_consumers` tem essas colunas:

* `NAME`

O nome do consumidor.

* `ENABLED`

Se o consumidor está habilitado. O valor é `YES` ou `NO`. Esta coluna pode ser modificada. Se você desabilitar um consumidor, o servidor não gasta tempo adicionando informações de evento a ele.

`TRUNCATE TABLE` não é permitido para a tabela `setup_consumers`.

#### 25.12.2.3 A tabela setup_instruments

A tabela `setup_instruments` lista as classes de objetos instrumentados para os quais eventos podem ser coletados:

```sql
mysql> SELECT * FROM performance_schema.setup_instruments;
+---------------------------------------------------+---------+-------+
| NAME                                              | ENABLED | TIMED |
+---------------------------------------------------+---------+-------+
...
| stage/sql/end                                     | NO      | NO    |
| stage/sql/executing                               | NO      | NO    |
| stage/sql/init                                    | NO      | NO    |
| stage/sql/insert                                  | NO      | NO    |
...
| statement/sql/load                                | YES     | YES   |
| statement/sql/grant                               | YES     | YES   |
| statement/sql/check                               | YES     | YES   |
| statement/sql/flush                               | YES     | YES   |
...
| wait/synch/mutex/sql/LOCK_global_read_lock        | YES     | YES   |
| wait/synch/mutex/sql/LOCK_global_system_variables | YES     | YES   |
| wait/synch/mutex/sql/LOCK_lock_db                 | YES     | YES   |
| wait/synch/mutex/sql/LOCK_manager                 | YES     | YES   |
...
| wait/synch/rwlock/sql/LOCK_grant                  | YES     | YES   |
| wait/synch/rwlock/sql/LOGGER::LOCK_logger         | YES     | YES   |
| wait/synch/rwlock/sql/LOCK_sys_init_connect       | YES     | YES   |
| wait/synch/rwlock/sql/LOCK_sys_init_slave         | YES     | YES   |
...
| wait/io/file/sql/binlog                           | YES     | YES   |
| wait/io/file/sql/binlog_index                     | YES     | YES   |
| wait/io/file/sql/casetest                         | YES     | YES   |
| wait/io/file/sql/dbopt                            | YES     | YES   |
...
```

Cada instrumento adicionado ao código-fonte fornece uma string para a tabela `setup_instruments`, mesmo quando o código instrumentado não é executado. Quando um instrumento é habilitado e executado, instâncias instrumentadas são criadas, que são visíveis nas tabelas `xxx_instances`, como `file_instances` ou `rwlock_instances`.

As modificações na maioria das strings de `setup_instruments` afetam o monitoramento imediatamente. Para alguns instrumentos, as modificações só são eficazes apenas no início da inicialização do servidor; alterá-las durante a execução não tem efeito. Isso afeta principalmente os mutexes, condições e rwlocks no servidor, embora possa haver outros instrumentos para os quais isso seja verdade.

Para mais informações sobre o papel da tabela `setup_instruments` no filtro de eventos, consulte a Seção 25.4.3, “Pré-filtro de eventos”.

A tabela `setup_instruments` tem essas colunas:

* `NAME`

O nome do instrumento. Os nomes dos instrumentos podem ter várias partes e formar uma hierarquia, conforme discutido na Seção 25.6, “Convenções de Nomenclatura de Instrumentos do Schema de Desempenho”. Os eventos produzidos pela execução de um instrumento têm um valor `EVENT_NAME` que é retirado do valor do instrumento `NAME`. (Os eventos não têm realmente um “nome”, mas isso fornece uma maneira de associar eventos com instrumentos.)

* `ENABLED`

Se o instrumento está habilitado. O valor é `YES` ou `NO`. Um instrumento desabilitado não produz eventos. Esta coluna pode ser modificada, embora a definição de `ENABLED` não tenha efeito para instrumentos que já foram criados.

* `TIMED`

Se o instrumento é cronometrado. O valor é `YES` ou `NO`. Esta coluna pode ser modificada, embora a definição de `TIMED` não tenha efeito para instrumentos que já foram criados.

Para instrumentos de memória, a coluna `TIMED` em `setup_instruments` é ignorada porque as operações de memória não são temporizadas.

Se um instrumento habilitado não estiver cronometrado, o código do instrumento é habilitado, mas o temporizador não está. Os eventos produzidos pelo instrumento têm `NULL` para os valores do temporizador `TIMER_START`, `TIMER_END` e `TIMER_WAIT`. Isso, por sua vez, faz com que esses valores sejam ignorados ao calcular os valores de soma, mínimo, máximo e média de tempo em tabelas resumidas.

`TRUNCATE TABLE` não é permitido para a tabela `setup_instruments`.

#### 25.12.2.4 A tabela setup_objects

A tabela `setup_objects` controla se o Schema de Desempenho monitora objetos específicos. Essa tabela tem um tamanho máximo de 100 strings por padrão. Para alterar o tamanho da tabela, modifique a variável de sistema `performance_schema_setup_objects_size` na inicialização do servidor.

O conteúdo inicial do `setup_objects` parece assim:

```sql
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

O efeito da configuração padrão do objeto é instrumentar todas as tabelas, exceto aquelas nos bancos de dados `mysql`, `INFORMATION_SCHEMA` e `performance_schema`. (As tabelas no banco de dados `INFORMATION_SCHEMA` não são instrumentadas, independentemente do conteúdo de `setup_objects`; a string para `information_schema.%` faz isso explícito por padrão.)

Quando o Schema de Desempenho verifica uma correspondência em `setup_objects`, ele tenta encontrar correspondências mais específicas primeiro. Por exemplo, com uma tabela `db1.t1`, ele procura uma correspondência para `'db1'` e `'t1'`, depois para `'db1'` e `'%'`, depois para `'%'` e `'%'`. A ordem em que ocorre a correspondência é importante porque diferentes strings de correspondência em `setup_objects` podem ter diferentes valores em `ENABLED` e `TIMED`.

As strings podem ser inseridas ou excluídas de `setup_objects` por usuários com o privilégio `INSERT` ou `DELETE` na tabela. Para as strings existentes, apenas as colunas `ENABLED` e `TIMED` podem ser modificadas, por usuários com o privilégio `UPDATE` na tabela.

Para mais informações sobre o papel da tabela `setup_objects` no filtro de eventos, consulte a Seção 25.4.3, “Pré-filtro de eventos”.

A tabela `setup_objects` tem essas colunas:

* `OBJECT_TYPE`

O tipo de objeto a ser instrumentado. O valor é um dos `'EVENT'` (evento do Agendamento de Eventos), `'FUNCTION'` (função armazenada), `'PROCEDURE'` (procedimento armazenado), `'TABLE'` (tabela base) ou `'TRIGGER'` (trigger).

O filtro `TABLE` afeta eventos de I/O de tabela (instrumento `wait/io/table/sql/handler`) e eventos de bloqueio de tabela (instrumento `wait/lock/table/sql/handler`).

* `OBJECT_SCHEMA`

O esquema que contém o objeto. Isso deve ser um nome literal, ou `'%'` para significar “qualquer esquema”.

* `OBJECT_NAME`

O nome do objeto instrumentado. Isso deve ser um nome literal, ou `'%'` para significar “qualquer objeto”.

* `ENABLED`

Se os eventos para o objeto estão instrumentados. O valor é `YES` ou `NO`. Esta coluna pode ser modificada.

* `TIMED`

Se os eventos para o objeto são temporizados. O valor é `YES` ou `NO`. Esta coluna pode ser modificada.

`TRUNCATE TABLE` é permitido para a tabela `setup_objects`. Ele remove as strings.

#### 25.12.2.5 A tabela setup_timers

A tabela `setup_timers` mostra os temporizadores de evento atualmente selecionados:

```sql
mysql> SELECT * FROM performance_schema.setup_timers;
+-------------+-------------+
| NAME        | TIMER_NAME  |
+-------------+-------------+
| idle        | MICROSECOND |
| wait        | CYCLE       |
| stage       | NANOSECOND  |
| statement   | NANOSECOND  |
| transaction | NANOSECOND  |
+-------------+-------------+
```

Nota

A partir do MySQL 5.7.21, a tabela do Gerador de Desempenho `setup_timers` é descontinuada e é removida no MySQL 8.0, assim como a string `TICKS` na tabela `performance_timers`.

O valor `setup_timers.TIMER_NAME` pode ser alterado para selecionar um temporizador diferente. O valor pode ser qualquer um dos valores na coluna `performance_timers.TIMER_NAME`. Para uma explicação sobre como o temporizador de eventos ocorre, consulte a Seção 25.4.1, “Temporizador de Eventos do Schema de Desempenho”.

As modificações na tabela `setup_timers` afetam o monitoramento imediatamente. Eventos já em andamento podem usar o temporizador original para a hora de início e o novo temporizador para a hora de término. Para evitar resultados imprevisíveis após fazer alterações no temporizador, use `TRUNCATE TABLE` para redefinir as estatísticas do Gerador de Desempenho.

A tabela `setup_timers` tem essas colunas:

* `NAME`

O tipo de instrumento para o qual o temporizador é utilizado.

* `TIMER_NAME`

O temporizador que se aplica ao tipo de instrumento. Essa coluna pode ser modificada.

`TRUNCATE TABLE` não é permitido para a tabela `setup_timers`.

### 25.12.3 Tabelas de Instância do Schema de Desempenho

As tabelas de instância documentam os tipos de objetos que são instrumentados. Elas fornecem nomes de eventos e notas explicativas ou informações de status:

* `cond_instances`: Instâncias de objetos de sincronização de condição

* `file_instances`: Instâncias de arquivo * `mutex_instances`: Instâncias de objetos de sincronização de mutex

* `rwlock_instances`: Instâncias de objetos de sincronização de bloqueio

* `socket_instances`: Instâncias de conexão ativa

Essas tabelas listam objetos de sincronização instrumentados, arquivos e conexões. Existem três tipos de objetos de sincronização: `cond`, `mutex` e `rwlock`. Cada tabela de instância tem uma coluna `EVENT_NAME` ou `NAME` para indicar o instrumento associado a cada string. Os nomes dos instrumentos podem ter várias partes e formar uma hierarquia, conforme discutido na Seção 25.6, “Convenções de Nomenclatura de Instrumentos do Schema de Desempenho”.

As colunas `mutex_instances.LOCKED_BY_THREAD_ID` e `rwlock_instances.WRITE_LOCKED_BY_THREAD_ID` são extremamente importantes para investigar gargalos de desempenho ou deadlocks. Para exemplos de como usá-las para esse propósito, consulte a Seção 25.19, “Usando o Schema de Desempenho para Diagnosticar Problemas”

#### 25.12.3.1 A tabela cond_instances

A tabela `cond_instances` lista todas as condições observadas pelo Schema de Desempenho enquanto o servidor está sendo executado. Uma condição é um mecanismo de sincronização usado no código para sinalizar que um evento específico ocorreu, de modo que um thread que está esperando por essa condição possa retomar o trabalho.

Quando um thread está esperando algo acontecer, o nome da condição é uma indicação do que o thread está esperando, mas não há uma maneira imediata de saber quais outros threads causam a condição de acontecer.

A tabela `cond_instances` tem essas colunas:

* `NAME`

O nome do instrumento associado à condição.

* `OBJECT_INSTANCE_BEGIN`

O endereço em memória à condição instrumentada.

`TRUNCATE TABLE` não é permitido para a tabela `cond_instances`.

#### 25.12.3.2 A tabela file_instances

A tabela `file_instances` lista todos os arquivos vistos pelo Schema de Desempenho ao executar a instrumentação de E/S de arquivo. Se um arquivo no disco nunca tiver sido aberto, ele não está no `file_instances`. Quando um arquivo é excluído do disco, ele também é removido da tabela `file_instances`.

A tabela `file_instances` tem essas colunas:

* `FILE_NAME`

O nome do arquivo.

* `EVENT_NAME`

O nome do instrumento associado ao arquivo.

* `OPEN_COUNT`

O número de manipulações abertas no arquivo. Se um arquivo foi aberto e depois fechado, ele foi aberto 1 vez, mas `OPEN_COUNT` é 0. Para listar todos os arquivos atualmente abertos pelo servidor, use `WHERE OPEN_COUNT > 0`.

`TRUNCATE TABLE` não é permitido para a tabela `file_instances`.

#### 25.12.3.3 A tabela mutex_instances

A tabela `mutex_instances` lista todos os mutexes vistos pelo Schema de Desempenho enquanto o servidor está sendo executado. Um mutex é um mecanismo de sincronização usado no código para garantir que apenas um thread, em um determinado momento, possa ter acesso a algum recurso comum. O recurso é dito estar "protegido" pelo mutex.

Quando dois threads estão executando no servidor (por exemplo, duas sessões de usuário executando uma consulta simultaneamente) precisam acessar o mesmo recurso (um arquivo, um buffer ou algum pedaço de dados), esses dois threads competem entre si, de modo que a primeira consulta que obtém um bloqueio no mutex faz com que a outra consulta espere até que a primeira esteja pronta e desbloqueie o mutex.

O trabalho realizado enquanto se mantém um mutex é dito estar em uma "seção crítica", e múltiplas consultas executam essa seção crítica de uma maneira serializada (uma de cada vez), o que é um gargalo potencial.

A tabela `mutex_instances` tem essas colunas:

* `NAME`

O nome do instrumento associado ao mutex.

* `OBJECT_INSTANCE_BEGIN`

O endereço em memória do mutex instrumentado.

* `LOCKED_BY_THREAD_ID`

Quando um thread atualmente tem um mutex bloqueado, `LOCKED_BY_THREAD_ID` é o `THREAD_ID` do thread de bloqueio, caso contrário, é `NULL`.

`TRUNCATE TABLE` não é permitido para a tabela `mutex_instances`.

Para cada mutex instrumentado no código, o Gerador de Desempenho fornece as seguintes informações.

* A tabela `setup_instruments` lista o nome do ponto de instrumentação, com o prefixo `wait/synch/mutex/`.

* Quando algum código cria um mutex, uma string é adicionada à tabela `mutex_instances`. A coluna `OBJECT_INSTANCE_BEGIN` é uma propriedade que identifica de forma única o mutex.

* Quando um thread tenta bloquear um mutex, a tabela `events_waits_current` mostra uma string para esse thread, indicando que ele está aguardando um mutex (na coluna `EVENT_NAME`) e indicando qual mutex está sendo aguardado (na coluna `OBJECT_INSTANCE_BEGIN`).

* Quando um thread consegue bloquear um mutex:

+ `events_waits_current` indica que a espera no mutex foi concluída (nas colunas `TIMER_END` e `TIMER_WAIT`)

+ O evento de espera concluído é adicionado às tabelas `events_waits_history` e `events_waits_history_long`

+ `mutex_instances` mostra que o mutex agora pertence ao thread (na coluna `THREAD_ID`).

* Quando um thread desbloqueia um mutex, `mutex_instances` mostra que o mutex não tem mais proprietário (a coluna `THREAD_ID` é `NULL`).

* Quando um objeto de mutex é destruído, a string correspondente é removida de `mutex_instances`.

Ao realizar consultas em ambas as seguintes tabelas, um aplicativo de monitoramento ou um DBA pode detectar gargalos ou bloqueios entre os threads que envolvem mútuos:

* `events_waits_current`, para ver qual mutex um thread está esperando

* `mutex_instances`, para ver qual outro thread atualmente possui um mutex

#### 25.12.3.4 A tabela rwlock_instances

A tabela `rwlock_instances` lista todas as instâncias de rwlock (bloqueio de leitura e escrita) observadas pelo Schema de Desempenho enquanto o servidor está sendo executado. Um `rwlock` é um mecanismo de sincronização usado no código para garantir que os threads em um determinado momento possam ter acesso a algum recurso comum seguindo certas regras. O recurso é dito estar “protegido” pelo `rwlock`. O acesso é compartilhado (muitos threads podem ter um bloqueio de leitura ao mesmo tempo), exclusivo (apenas um thread pode ter um bloqueio de escrita em um determinado momento) ou compartilhado-exclusivo (um thread pode ter um bloqueio de escrita enquanto permite leituras inconsistentes por outros threads). O acesso compartilhado-exclusivo é conhecido como `sxlock` e otimiza a concorrência e melhora a escalabilidade para cargas de trabalho de leitura e escrita.

Dependendo de quantas threads estão solicitando um bloqueio e da natureza dos bloqueios solicitados, o acesso pode ser concedido em modo compartilhado, modo exclusivo, modo compartilhado-exclusivo ou não concedido, aguardando que outras threads terminem primeiro.

A tabela `rwlock_instances` tem essas colunas:

* `NAME`

O nome do instrumento associado ao bloqueio.

* `OBJECT_INSTANCE_BEGIN`

O endereço em memória do bloqueio instrumentado.

* `WRITE_LOCKED_BY_THREAD_ID`

Quando um thread atualmente tem um `rwlock` bloqueado no modo exclusivo (de escrita), `WRITE_LOCKED_BY_THREAD_ID` é o `THREAD_ID` do thread de bloqueio, caso contrário, é `NULL`.

* `READ_LOCKED_BY_COUNT`

Quando um thread atualmente tem um `rwlock` bloqueado no modo compartilhado (leitura), `READ_LOCKED_BY_COUNT` é incrementado por

1. Este é um contador apenas, portanto, não pode ser usado diretamente para descobrir qual thread mantém um bloqueio de leitura, mas pode ser usado para verificar se há uma disputa de leitura em um `rwlock`, e ver quantos leitores estão atualmente ativos.

`TRUNCATE TABLE` não é permitido para a tabela `rwlock_instances`.

Ao realizar consultas em ambas as seguintes tabelas, um aplicativo de monitoramento ou um DBA pode detectar alguns gargalos ou bloqueios entre os threads que envolvem bloqueios:

* `events_waits_current`, para ver o que a `rwlock` uma thread está esperando

* `rwlock_instances`, para ver qual outro thread atualmente possui um `rwlock`

Há uma limitação: o `rwlock_instances` pode ser usado apenas para identificar o thread que detém um bloqueio de escrita, mas não os threads que detêm um bloqueio de leitura.

#### 25.12.3.5 A tabela socket_instances

A tabela `socket_instances` fornece um instantâneo em tempo real das conexões ativas no servidor MySQL. A tabela contém uma string por conexão de arquivo de rede TCP/IP ou Unix. As informações disponíveis nesta tabela fornecem um instantâneo em tempo real das conexões ativas no servidor. (Informações adicionais estão disponíveis em tabelas de resumo de soquetes, incluindo atividade de rede, como operações de soquete e número de bytes transmitidos e recebidos; consulte Seção 25.12.15.8, “Tabelas de Resumo de Soquetes”).

```sql
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

2. Quando um soquete de escuta detecta uma conexão, o servidor transfere a conexão para um novo soquete gerenciado por um thread separado. O instrumento para o novo thread de conexão tem um valor *`socket_type`* de `client_connection`.

3. Quando uma conexão é encerrada, a string no `socket_instances` correspondente a ela é excluída.

A tabela `socket_instances` tem essas colunas:

* `EVENT_NAME`

O nome do instrumento `wait/io/socket/*` que produziu o evento. Este é um valor `NAME` da tabela `setup_instruments`. Os nomes dos instrumentos podem ter várias partes e formar uma hierarquia, conforme discutido na Seção 25.6, “Convenções de Nomenclatura de Instrumentos do Schema de Desempenho”.

* `OBJECT_INSTANCE_BEGIN`

Esta coluna identifica exclusivamente o soquete. O valor é o endereço de um objeto na memória.

* `THREAD_ID`

O identificador de thread interno atribuído pelo servidor. Cada soquete é gerenciado por um único thread, portanto, cada soquete pode ser mapeado para um thread que pode ser mapeado para um processo do servidor.

* `SOCKET_ID`

O identificador interno do arquivo atribuído ao socket.

* `IP`

O endereço IP do cliente. O valor pode ser um endereço IPv4 ou IPv6, ou pode ser em branco para indicar uma conexão com um arquivo de soquete Unix.

* `PORT`

O número do port TCP/IP, na faixa de 0 a 65535.

* `STATE`

O status do soquete, seja `IDLE` ou `ACTIVE`. Os tempos de espera para soquetes ativos são rastreados usando o instrumento de soquete correspondente. Os tempos de espera para soquetes ociosos são rastreados usando o instrumento `idle`.

Um soquete está inativo se estiver aguardando uma solicitação do cliente. Quando um soquete se torna inativo, a string de evento em `socket_instances` que está monitorando o soquete muda de um estado de `ACTIVE` para `IDLE`. O valor de `EVENT_NAME` permanece `wait/io/socket/*`, mas o temporizador do instrumento é suspenso. Em vez disso, um evento é gerado na tabela `events_waits_current` com um valor de `EVENT_NAME` de `idle`.

Quando o próximo pedido for recebido, o evento `idle` é encerrado, a instância da porta de rede muda de `IDLE` para `ACTIVE`, e o cronometramento do instrumento da porta de rede é retomado.

`TRUNCATE TABLE` não é permitido para a tabela `socket_instances`.

O valor da combinação da coluna `IP:PORT` identifica a conexão. Esse valor de combinação é usado na coluna `OBJECT_NAME` das tabelas `events_waits_xxx`, para identificar a conexão de onde vêm os eventos de soquete:

* Para o socket de escuta de domínio Unix (`server_unix_socket`), a porta é 0 e o IP é `''`.

* Para conexões de clientes via o ouvinte de domínio Unix (`client_connection`), a porta é 0 e o IP é `''`.

* Para o socket do servidor de escuta TCP/IP (`server_tcpip_socket`), a porta é sempre a porta mestre (por exemplo, 3306), e o IP é sempre `0.0.0.0`.

* Para conexões de clientes via o ouvinte TCP/IP (`client_connection`), a porta é a que o servidor atribui, mas nunca 0. O IP é o IP do host de origem (`127.0.0.1` ou `::1` para o host local)

### 25.12.4 Tabelas de Eventos de Aguarda do Schema de Desempenho

Os instrumentos de esquema de desempenho que aguardam, que são eventos que levam tempo. Na hierarquia de eventos, os eventos de espera estão dentro dos eventos de estágio, que estão dentro dos eventos de declaração, que estão dentro dos eventos de transação.

Esses quadros armazenam eventos de espera:

* `events_waits_current`: O evento atual de espera para cada thread.

* `events_waits_history`: Os eventos de espera mais recentes que terminaram por thread.

* `events_waits_history_long`: Os eventos de espera mais recentes que terminaram globalmente (em todas as threads).

As seções a seguir descrevem as tabelas de eventos de espera. Há também tabelas resumidas que agregam informações sobre eventos de espera; veja a Seção 25.12.15.1, “Tabelas Resumo de Eventos de Espera”.

Para mais informações sobre a relação entre as três tabelas de eventos de espera, consulte a Seção 25.9, “Tabelas do Schema de Desempenho para Eventos Atuais e Históricos”.

#### Configurando a Coleta de Eventos de Aguardar

Para controlar se os eventos de espera devem ser coletados, defina o estado dos instrumentos e dos consumidores relevantes:

* A tabela `setup_instruments` contém instrumentos com nomes que começam com `wait`. Use esses instrumentos para habilitar ou desabilitar a coleta de classes individuais de eventos de espera.

* A tabela `setup_consumers` contém valores de consumidor com nomes correspondentes aos nomes atuais e históricos das tabelas de eventos de espera. Use esses consumidores para filtrar a coleção de eventos de espera.

Alguns instrumentos de espera são habilitados por padrão; outros são desabilitados. Por exemplo:

```sql
mysql> SELECT * FROM performance_schema.setup_instruments
       WHERE NAME LIKE 'wait/io/file/innodb%';
+--------------------------------------+---------+-------+
| NAME                                 | ENABLED | TIMED |
+--------------------------------------+---------+-------+
| wait/io/file/innodb/innodb_data_file | YES     | YES   |
| wait/io/file/innodb/innodb_log_file  | YES     | YES   |
| wait/io/file/innodb/innodb_temp_file | YES     | YES   |
+--------------------------------------+---------+-------+
mysql> SELECT *
       FROM performance_schema.setup_instruments WHERE
       NAME LIKE 'wait/io/socket/%';
+----------------------------------------+---------+-------+
| NAME                                   | ENABLED | TIMED |
+----------------------------------------+---------+-------+
| wait/io/socket/sql/server_tcpip_socket | NO      | NO    |
| wait/io/socket/sql/server_unix_socket  | NO      | NO    |
| wait/io/socket/sql/client_connection   | NO      | NO    |
+----------------------------------------+---------+-------+
```

A espera dos consumidores é desabilitada por padrão:

```sql
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

Para controlar a coleta de eventos de espera na inicialização do servidor, use strings como essas em seu arquivo `my.cnf`:

* Habilitar:

  ```sql
  [mysqld]
  performance-schema-instrument='wait/%=ON'
  performance-schema-consumer-events-waits-current=ON
  performance-schema-consumer-events-waits-history=ON
  performance-schema-consumer-events-waits-history-long=ON
  ```

* Desativar:

  ```sql
  [mysqld]
  performance-schema-instrument='wait/%=OFF'
  performance-schema-consumer-events-waits-current=OFF
  performance-schema-consumer-events-waits-history=OFF
  performance-schema-consumer-events-waits-history-long=OFF
  ```

Para controlar a coleta de eventos de espera no tempo de execução, atualize as tabelas `setup_instruments` e `setup_consumers`:

* Habilitar:

  ```sql
  UPDATE performance_schema.setup_instruments
  SET ENABLED = 'YES', TIMED = 'YES'
  WHERE NAME LIKE 'wait/%';

  UPDATE performance_schema.setup_consumers
  SET ENABLED = 'YES'
  WHERE NAME LIKE 'events_waits%';
  ```

* Desativar:

  ```sql
  UPDATE performance_schema.setup_instruments
  SET ENABLED = 'NO', TIMED = 'NO'
  WHERE NAME LIKE 'wait/%';

  UPDATE performance_schema.setup_consumers
  SET ENABLED = 'NO'
  WHERE NAME LIKE 'events_waits%';
  ```

Para coletar apenas eventos de espera específicos, habilite apenas os instrumentos de espera correspondentes. Para coletar eventos de espera apenas para tabelas específicas de eventos de espera, habilite os instrumentos de espera, mas apenas os consumidores de espera correspondentes às tabelas desejadas.

A tabela `setup_timers` contém uma string com um valor `NAME` de `wait` que indica a unidade para o temporizador do evento de espera. A unidade padrão é `CYCLE`:

```sql
mysql> SELECT *
       FROM performance_schema.setup_timers
       WHERE NAME = 'wait';
+------+------------+
| NAME | TIMER_NAME |
+------+------------+
| wait | CYCLE      |
+------+------------+
```

Para alterar a unidade de tempo, modifique o valor `TIMER_NAME`:

```sql
UPDATE performance_schema.setup_timers
SET TIMER_NAME = 'NANOSECOND'
WHERE NAME = 'wait';
```

Para obter informações adicionais sobre a configuração da coleta de eventos, consulte a Seção 25.3, “Configuração de inicialização do Schema de desempenho”, e a Seção 25.4, “Configuração de execução do Schema de desempenho”.

#### 25.12.4.1 A tabela eventos_waits_current

A tabela `events_waits_current` contém eventos de espera atuais. A tabela armazena uma string por thread, mostrando o status atual do evento de espera mais recente monitorado da thread, portanto, não há uma variável do sistema para configurar o tamanho da tabela.

Dos quadros que contêm strings de eventos de espera, `events_waits_current` é o mais fundamental. Outras tabelas que contêm strings de eventos de espera são derivadas logicamente dos eventos atuais. Por exemplo, as tabelas `events_waits_history` e `events_waits_history_long` são coleções dos eventos de espera mais recentes que terminaram, até um número máximo de strings por thread e globalmente em todos os threads, respectivamente.

Para mais informações sobre a relação entre as três tabelas de eventos de espera, consulte a Seção 25.9, “Tabelas do Schema de Desempenho para Eventos Atuais e Históricos”.

Para obter informações sobre a configuração de se os eventos de espera devem ser coletados, consulte a Seção 25.12.4, “Tabelas de Eventos de Espera do Schema de Desempenho”.

A tabela `events_waits_current` tem essas colunas:

* `THREAD_ID`, `EVENT_ID`

O thread associado ao evento e o número do evento atual do thread quando o evento começa. Os valores `THREAD_ID` e `EVENT_ID`, quando tomados juntos, identificam de forma única a string. Nenhuma string tem o mesmo par de valores.

* `END_EVENT_ID`

Essa coluna é definida como `NULL` quando o evento começa e atualizada para o número atual do evento do thread quando o evento termina.

* `EVENT_NAME`

O nome do instrumento que produziu o evento. Este é um valor `NAME` da tabela `setup_instruments`. Os nomes dos instrumentos podem ter várias partes e formar uma hierarquia, conforme discutido na Seção 25.6, “Convenções de Nomenclatura de Instrumentos do Schema de Desempenho”.

* `SOURCE`

O nome do arquivo de origem que contém o código instrumentado que produziu o evento e o número da string no arquivo em que a instrumentação ocorre. Isso permite que você verifique a fonte para determinar exatamente qual código está envolvido. Por exemplo, se um mutex ou bloqueio está sendo bloqueado, você pode verificar o contexto em que isso ocorre.

* `TIMER_START`, `TIMER_END`, `TIMER_WAIT`

Informações de cronometragem para o evento. A unidade desses valores é picosegundo (trilhão de um segundo). Os valores `TIMER_START` e `TIMER_END` indicam quando o cronometramento do evento começou e terminou. `TIMER_WAIT` é o tempo decorrido do evento (duração).

Se um evento não tiver terminado, `TIMER_END` é o valor atual do temporizador e `TIMER_WAIT` é o tempo que já passou (`TIMER_END` − `TIMER_START`).

Se um evento for produzido a partir de um instrumento que possui `TIMED = NO`, as informações de temporização não são coletadas, e `TIMER_START`, `TIMER_END` e `TIMER_WAIT` são todos `NULL`.

Para discussão sobre picossegundos como unidade para os tempos dos eventos e fatores que afetam os valores de tempo, consulte a Seção 25.4.1, “Tempo de Ocorrência do Schema de Desempenho”.

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

Um valor `OBJECT_INSTANCE_BEGIN` em si não tem significado, exceto que diferentes valores indicam diferentes objetos. `OBJECT_INSTANCE_BEGIN` pode ser usado para depuração. Por exemplo, pode ser usado com `GROUP BY OBJECT_INSTANCE_BEGIN` para verificar se a carga em 1.000 mutexes (que protegem, por exemplo, 1.000 páginas ou blocos de dados) é distribuída uniformemente ou apenas atingindo alguns gargalos. Isso pode ajudá-lo a correlacionar com outras fontes de informações se você ver o mesmo endereço de objeto em um arquivo de registro ou em outra ferramenta de depuração ou de desempenho.

* `INDEX_NAME`

O nome do índice utilizado. `PRIMARY` indica o índice primário da tabela. `NULL` significa que não foi utilizado nenhum índice.

* `NESTING_EVENT_ID`

O valor `EVENT_ID` do evento dentro do qual este evento está aninhado.

* `NESTING_EVENT_TYPE`

O tipo de evento de nidificação. O valor é `TRANSACTION`, `STATEMENT`, `STAGE` ou `WAIT`.

* `OPERATION`

O tipo de operação realizada, como `lock`, `read` ou `write`.

* `NUMBER_OF_BYTES`

O número de bytes lidos ou escritos pela operação. Para espera de I/O de tabela (eventos para o instrumento `wait/io/table/sql/handler`), `NUMBER_OF_BYTES` indica o número de strings. Se o valor for maior que 1, o evento é para uma operação de I/O em lote. A discussão a seguir descreve a diferença entre o relatório exclusivamente de uma única string e o relatório que reflete o I/O em lote.

O MySQL executa junções usando uma implementação de loop aninhado. O trabalho da instrumentação do Schema de Desempenho é fornecer o número de strings e o tempo de execução acumulado por tabela na junção. Suponha uma consulta de junção da seguinte forma que é executada usando uma ordem de junção de tabela de `t1`, `t2`, `t3`:

  ```sql
  SELECT ... FROM t1 JOIN t2 ON ... JOIN t3 ON ...
  ```

A tabela “fanout” é o aumento ou diminuição no número de strings ao adicionar uma tabela durante o processamento de junção. Se o fanout da tabela `t3` for maior que 1, a maioria das operações de obtenção de strings é para essa tabela. Suponha que a junção acesse 10 strings de `t1`, 20 strings de `t2` por string de `t1`, e 30 strings de `t3` por string da tabela `t2`. Com relatórios de uma única string, o número total de operações instrumentadas é:

  ```sql
  10 + (10 * 20) + (10 * 20 * 30) = 6210
  ```

Uma redução significativa no número de operações instrumentadas pode ser alcançada agregando-as por varredura (ou seja, por combinação única de strings de `t1` e `t2`). Com o relatório de I/O em lote, o Performance Schema produz um evento para cada varredura da tabela mais interna `t3`, em vez de para cada string, e o número de operações de string instrumentadas é reduzido para:

  ```sql
  10 + (10 * 20) + (10 * 20) = 410
  ```

Isso é uma redução de 93%, ilustrando como a estratégia de relatórios por lote reduz significativamente o overhead do Schema de Desempenho para o I/O de tabelas, reduzindo o número de chamadas de relatório. O contraponto é uma menor precisão para o tempo de eventos. Em vez de tempo para uma operação individual de string, como no relatório por string, o tempo para I/O por lote inclui o tempo gasto em operações como buffer de junção, agregação e retorno de strings ao cliente.

Para que o relatório de I/O em lote ocorra, essas condições devem ser verdadeiras:

+ A execução da consulta acessa a tabela mais interna de um bloco de consulta (para uma consulta de uma única tabela, essa tabela é considerada a mais interna)

+ A execução da consulta não solicita uma única string da tabela (por exemplo, o acesso a `eq_ref` impede o uso de relatórios em lote)

+ A execução da consulta não avalia uma subconsulta que contém acesso a tabela para a tabela

* `FLAGS`

Reservado para uso futuro.

`TRUNCATE TABLE` é permitido para a tabela `events_waits_current`. Ele remove as strings.

#### 25.12.4.2 A tabela eventos_waits_history

A tabela `events_waits_history` contém os eventos de espera mais recentes do *`N`* que terminaram por thread. Os eventos de espera não são adicionados à tabela até que tenham terminado. Quando a tabela contém o número máximo de strings para um determinado thread, a string mais antiga do thread é descartada quando uma nova string para esse thread é adicionada. Quando um thread termina, todas as suas strings são descartadas.

O Schema de Desempenho autodimensiona o valor de *`N`* durante o arranque do servidor. Para definir explicitamente o número de strings por thread, defina a variável de sistema `performance_schema_events_waits_history_size` durante o arranque do servidor.

A tabela `events_waits_history` tem as mesmas colunas que a tabela `events_waits_current`. Veja a Seção 25.12.4.1, “A tabela events_waits_current”.

`TRUNCATE TABLE` é permitido para a tabela `events_waits_history`. Ele remove as strings.

Para mais informações sobre a relação entre as três tabelas de eventos de espera, consulte a Seção 25.9, “Tabelas do Schema de Desempenho para Eventos Atuais e Históricos”.

Para obter informações sobre a configuração de se os eventos de espera devem ser coletados, consulte a Seção 25.12.4, “Tabelas de Eventos de Espera do Schema de Desempenho”.

#### 25.12.4.3 A tabela de eventos_waits_history_long

A tabela `events_waits_history_long` contém *`N`* os eventos de espera mais recentes que terminaram globalmente, em todas as threads. Os eventos de espera não são adicionados à tabela até que tenham terminado. Quando a tabela se torna cheia, a string mais antiga é descartada quando uma nova string é adicionada, independentemente de qual thread gerou a string.

O Schema de Desempenho autodimensiona o valor de *`N`* durante o arranque do servidor. Para definir explicitamente o tamanho da tabela, defina a variável de sistema `performance_schema_events_waits_history_long_size` durante o arranque do servidor.

A tabela `events_waits_history_long` tem as mesmas colunas que a tabela `events_waits_current`. Veja a Seção 25.12.4.1, “A tabela events_waits_current”.

`TRUNCATE TABLE` é permitido para a tabela `events_waits_history_long`. Ele remove as strings.

Para mais informações sobre a relação entre as três tabelas de eventos de espera, consulte a Seção 25.9, “Tabelas do Schema de Desempenho para Eventos Atuais e Históricos”.

Para obter informações sobre a configuração de se os eventos de espera devem ser coletados, consulte a Seção 25.12.4, “Tabelas de Eventos de Espera do Schema de Desempenho”.

### 25.12.5 Tabelas de eventos de estágio do Schema de desempenho

Os instrumentos do esquema de desempenho mostram etapas, que são os passos durante o processo de execução da declaração, como a análise de uma declaração, a abertura de uma tabela ou a realização de uma operação `filesort`. As etapas correspondem aos estados do thread exibidos pelo `SHOW PROCESSLIST` ou que são visíveis na tabela do esquema de informações `PROCESSLIST`. As etapas começam e terminam quando os valores dos estados mudam.

Na hierarquia de eventos, os eventos de espera estão dentro dos eventos de estágio, que estão dentro dos eventos de declaração, que estão dentro dos eventos de transação.

Essas tabelas armazenam eventos de estágio:

* `events_stages_current`: O evento atual de estágio para cada thread.

* `events_stages_history`: Os eventos mais recentes que terminaram por thread.

* `events_stages_history_long`: Os eventos mais recentes que terminaram globalmente (em todas as threads).

As seções a seguir descrevem as tabelas de eventos de palco. Há também tabelas resumidas que agregam informações sobre eventos de palco; veja a Seção 25.12.15.2, “Tabelas Resumo de Palco”.

Para mais informações sobre a relação entre as três tabelas de eventos em etapas, consulte a Seção 25.9, “Tabelas do Schema de Desempenho para Eventos Atuais e Históricos”.

* Configuração da coleta de eventos de palco * Informações sobre o progresso do evento de palco

#### Configurando a Coleta de Eventos de Estágio

Para controlar se os eventos de estágio devem ser coletados, defina o estado dos instrumentos e dos consumidores relevantes:

* A tabela `setup_instruments` contém instrumentos com nomes que começam com `stage`. Use esses instrumentos para habilitar ou desabilitar a coleta de classes de eventos de estágio individual.

* A tabela `setup_consumers` contém valores de consumidor com nomes correspondentes aos nomes dos eventos de estágio atuais e históricos da tabela. Use esses consumidores para filtrar a coleção de eventos de estágio.

Exceto para os instrumentos que fornecem informações sobre o progresso da declaração, os instrumentos do palco são desabilitados por padrão. Por exemplo:

```sql
mysql> SELECT *
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
| stage/sql/checking privileges on cached query      | NO      | NO    |
| stage/sql/checking query cache for query           | NO      | NO    |
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

```sql
mysql> SELECT *
       FROM performance_schema.setup_instruments
       WHERE ENABLED='YES' AND NAME LIKE "stage/%";
+------------------------------------------------------+---------+-------+
| NAME                                                 | ENABLED | TIMED |
+------------------------------------------------------+---------+-------+
| stage/sql/copy to tmp table                          | YES     | YES   |
| stage/innodb/alter table (end)                       | YES     | YES   |
| stage/innodb/alter table (flush)                     | YES     | YES   |
| stage/innodb/alter table (insert)                    | YES     | YES   |
| stage/innodb/alter table (log apply index)           | YES     | YES   |
| stage/innodb/alter table (log apply table)           | YES     | YES   |
| stage/innodb/alter table (merge sort)                | YES     | YES   |
| stage/innodb/alter table (read PK and internal sort) | YES     | YES   |
| stage/innodb/buffer pool load                        | YES     | YES   |
+------------------------------------------------------+---------+-------+
```

Os consumidores em andamento são desabilitados por padrão:

```sql
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

Para controlar a coleta de eventos de estágio no início da inicialização do servidor, use strings como essas em seu arquivo `my.cnf`:

* Habilitar:

  ```sql
  [mysqld]
  performance-schema-instrument='stage/%=ON'
  performance-schema-consumer-events-stages-current=ON
  performance-schema-consumer-events-stages-history=ON
  performance-schema-consumer-events-stages-history-long=ON
  ```

* Desativar:

  ```sql
  [mysqld]
  performance-schema-instrument='stage/%=OFF'
  performance-schema-consumer-events-stages-current=OFF
  performance-schema-consumer-events-stages-history=OFF
  performance-schema-consumer-events-stages-history-long=OFF
  ```

Para controlar a coleta de eventos de estágio em tempo de execução, atualize as tabelas `setup_instruments` e `setup_consumers`:

* Habilitar:

  ```sql
  UPDATE performance_schema.setup_instruments
  SET ENABLED = 'YES', TIMED = 'YES'
  WHERE NAME LIKE 'stage/%';

  UPDATE performance_schema.setup_consumers
  SET ENABLED = 'YES'
  WHERE NAME LIKE 'events_stages%';
  ```

* Desativar:

  ```sql
  UPDATE performance_schema.setup_instruments
  SET ENABLED = 'NO', TIMED = 'NO'
  WHERE NAME LIKE 'stage/%';

  UPDATE performance_schema.setup_consumers
  SET ENABLED = 'NO'
  WHERE NAME LIKE 'events_stages%';
  ```

Para coletar apenas eventos específicos de palco, habilite apenas os instrumentos de palco correspondentes. Para coletar eventos de palco apenas para tabelas específicas de eventos de palco, habilite os instrumentos de palco, mas apenas os consumidores de palco correspondentes às tabelas desejadas.

A tabela `setup_timers` contém uma string com um valor `NAME` de `stage` que indica a unidade para o cronometramento do evento de estágio. A unidade padrão é `NANOSECOND`:

```sql
mysql> SELECT *
       FROM performance_schema.setup_timers
       WHERE NAME = 'stage';
+-------+------------+
| NAME  | TIMER_NAME |
+-------+------------+
| stage | NANOSECOND |
+-------+------------+
```

Para alterar a unidade de tempo, modifique o valor `TIMER_NAME`:

```sql
UPDATE performance_schema.setup_timers
SET TIMER_NAME = 'MICROSECOND'
WHERE NAME = 'stage';
```

Para obter informações adicionais sobre a configuração da coleta de eventos, consulte a Seção 25.3, “Configuração de inicialização do Schema de desempenho”, e a Seção 25.4, “Configuração de execução do Schema de desempenho”.

#### Informações sobre o progresso do evento de estágio

As tabelas de eventos de etapa do Schema de desempenho contêm duas colunas que, juntas, fornecem um indicador de progresso de etapa para cada string:

* `WORK_COMPLETED`: O número de unidades de trabalho concluídas para a etapa

* `WORK_ESTIMATED`: O número de unidades de trabalho esperado para a etapa

Cada coluna é `NULL` se nenhuma informação sobre progresso for fornecida para um instrumento. A interpretação da informação, se estiver disponível, depende inteiramente da implementação do instrumento. As tabelas do Schema de Desempenho fornecem um recipiente para armazenar dados de progresso, mas não fazem suposições sobre a semântica da própria métrica:

* Uma "unidade de trabalho" é uma métrica inteira que aumenta ao longo do tempo durante a execução, como o número de bytes, strings, arquivos ou tabelas processadas. A definição de "unidade de trabalho" para um instrumento específico é deixada para o código de instrumentação que fornece os dados.

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

A tarefa de cópia de tabela tem uma finalização definida (todas as strings copiadas), e a etapa `stage/sql/copy to tmp table` é instrumentada para fornecer informações de progresso limitado: A unidade de trabalho utilizada é o número de strings copiadas, `WORK_COMPLETED` e `WORK_ESTIMATED` são ambos significativos, e sua proporção indica o percentual de tarefa concluída.

Para habilitar o instrumento e os consumidores relevantes, execute essas declarações:

```sql
UPDATE performance_schema.setup_instruments
SET ENABLED='YES'
WHERE NAME='stage/sql/copy to tmp table';

UPDATE performance_schema.setup_consumers
SET ENABLED='YES'
WHERE NAME LIKE 'events_stages_%';
```

Para ver o progresso de uma declaração em andamento do `ALTER TABLE`, selecione a partir da tabela `events_stages_current`.

#### 25.12.5.1 Tabela eventos_stages_current

A tabela `events_stages_current` contém eventos de estágio atual. A tabela armazena uma string por thread, mostrando o status atual do evento de estágio mais recente monitorado da thread, portanto, não há uma variável do sistema para configurar o tamanho da tabela.

Dos quadros que contêm strings de eventos de estágio, `events_stages_current` é o mais fundamental. Outras tabelas que contêm strings de eventos de estágio são derivadas logicamente dos eventos atuais. Por exemplo, as tabelas `events_stages_history` e `events_stages_history_long` são coleções dos eventos de estágio mais recentes que terminaram, até um número máximo de strings por thread e globalmente em todos os threads, respectivamente.

Para mais informações sobre a relação entre as três tabelas de eventos em etapas, consulte a Seção 25.9, “Tabelas do Schema de Desempenho para Eventos Atuais e Históricos”.

Para obter informações sobre a configuração de se os eventos de estágio devem ser coletados, consulte a Seção 25.12.5, “Tabelas de Eventos de Estágio do Schema de Desempenho”.

A tabela `events_stages_current` tem essas colunas:

* `THREAD_ID`, `EVENT_ID`

O thread associado ao evento e o número do evento atual do thread quando o evento começa. Os valores `THREAD_ID` e `EVENT_ID` tomados juntos identificam de forma única a string. Nenhuma string tem o mesmo par de valores.

* `END_EVENT_ID`

Essa coluna é definida como `NULL` quando o evento começa e atualizada para o número atual do evento do tópico quando o evento termina.

* `EVENT_NAME`

O nome do instrumento que produziu o evento. Este é um valor `NAME` da tabela `setup_instruments`. Os nomes dos instrumentos podem ter várias partes e formar uma hierarquia, conforme discutido na Seção 25.6, “Convenções de Nomenclatura de Instrumentos do Schema de Desempenho”.

* `SOURCE`

O nome do arquivo fonte que contém o código instrumentado que produziu o evento e o número da string no arquivo onde a instrumentação ocorre. Isso permite que você verifique a fonte para determinar exatamente qual código está envolvido.

* `TIMER_START`, `TIMER_END`, `TIMER_WAIT`

Informações de cronometragem para o evento. A unidade desses valores é picosegundo (trilhão de um segundo). Os valores `TIMER_START` e `TIMER_END` indicam quando o cronometramento do evento começou e terminou. `TIMER_WAIT` é o tempo decorrido do evento (duração).

Se um evento não tiver terminado, `TIMER_END` é o valor atual do temporizador e `TIMER_WAIT` é o tempo que já passou (`TIMER_END` − `TIMER_START`).

Se um evento for produzido a partir de um instrumento que tem `TIMED = NO`, as informações de cronometragem não são coletadas, e `TIMER_START`, `TIMER_END` e `TIMER_WAIT` são todos `NULL`.

Para discussão sobre picossegundos como unidade para os tempos dos eventos e fatores que afetam os valores de tempo, consulte a Seção 25.4.1, “Tempo de Ocorrência do Schema de Desempenho”.

* `WORK_COMPLETED`, `WORK_ESTIMATED`

Essas colunas fornecem informações sobre o progresso da etapa, para instrumentos que foram implementados para produzir essas informações. `WORK_COMPLETED` indica quantos trabalhos foram concluídos para a etapa, e `WORK_ESTIMATED` indica quantos trabalhos são esperados para a etapa. Para mais informações, consulte Informações sobre o progresso do evento da etapa.

* `NESTING_EVENT_ID`

O valor `EVENT_ID` do evento dentro do qual este evento está aninhado. O evento aninhado para um evento de estágio é geralmente um evento de declaração.

* `NESTING_EVENT_TYPE`

O tipo de evento de nidificação. O valor é `TRANSACTION`, `STATEMENT`, `STAGE` ou `WAIT`.

`TRUNCATE TABLE` é permitido para a tabela `events_stages_current`. Ele remove as strings.

#### 25.12.5.2 A tabela eventos_stages_history

A tabela `events_stages_history` contém os eventos de estágio mais recentes do *`N`* que terminaram por thread. Os eventos de estágio não são adicionados à tabela até que tenham terminado. Quando a tabela contém o número máximo de strings para um determinado thread, a string mais antiga do thread é descartada quando uma nova string para esse thread é adicionada. Quando um thread termina, todas as suas strings são descartadas.

O Schema de Desempenho autodimensiona o valor de *`N`* durante o arranque do servidor. Para definir explicitamente o número de strings por thread, defina a variável de sistema `performance_schema_events_stages_history_size` durante o arranque do servidor.

A tabela `events_stages_history` tem as mesmas colunas que a tabela `events_stages_current`. Veja a Seção 25.12.5.1, “A tabela eventos_stages_current”.

`TRUNCATE TABLE` é permitido para a tabela `events_stages_history`. Ele remove as strings.

Para mais informações sobre a relação entre as três tabelas de eventos em etapas, consulte a Seção 25.9, “Tabelas do Schema de Desempenho para Eventos Atuais e Históricos”.

Para obter informações sobre a configuração de se os eventos de estágio devem ser coletados, consulte a Seção 25.12.5, “Tabelas de Eventos de Estágio do Schema de Desempenho”.

#### 25.12.5.3 A tabela de histórico de eventos_stages

A tabela `events_stages_history_long` contém os eventos de estágio mais recentes do *`N`* que terminaram globalmente, em todas as threads. Os eventos de estágio não são adicionados à tabela até que tenham terminado. Quando a tabela se torna cheia, a string mais antiga é descartada quando uma nova string é adicionada, independentemente de qual thread gerou essa string.

O Schema de Desempenho autodimensiona o valor de *`N`* durante o arranque do servidor. Para definir explicitamente o tamanho da tabela, defina a variável de sistema `performance_schema_events_stages_history_long_size` durante o arranque do servidor.

A tabela `events_stages_history_long` tem as mesmas colunas que a tabela `events_stages_current`. Veja a Seção 25.12.5.1, “A tabela eventos_stages_current”.

`TRUNCATE TABLE` é permitido para a tabela `events_stages_history_long`. Ele remove as strings.

Para mais informações sobre a relação entre as três tabelas de eventos em etapas, consulte a Seção 25.9, “Tabelas do Schema de Desempenho para Eventos Atuais e Históricos”.

Para obter informações sobre a configuração de se os eventos de estágio devem ser coletados, consulte a Seção 25.12.5, “Tabelas de Eventos de Estágio do Schema de Desempenho”.

### 25.12.6 Tabelas de Eventos de Declaração do Schema de Desempenho

A declaração de execução dos instrumentos do Schema de Desempenho. Os eventos de declaração ocorrem em um alto nível da hierarquia de eventos. Dentro da hierarquia de eventos, os eventos de espera se encontram dentro dos eventos de estágio, que se encontram dentro dos eventos de declaração, que se encontram dentro dos eventos de transação.

Essas tabelas armazenam eventos de declaração:

* `events_statements_current`: O evento atual de declaração para cada thread.

* `events_statements_history`: Os eventos mais recentes que terminaram por thread.

* `events_statements_history_long`: Os eventos mais recentes que terminaram globalmente (em todas as threads).

* `prepared_statements_instances`: Instâncias de declaração preparada e estatísticas

As seções a seguir descrevem as tabelas de eventos de declaração. Há também tabelas resumidas que agregam informações sobre eventos de declaração; veja a Seção 25.12.15.3, “Tabelas Resumo de Declaração”.

Para mais informações sobre a relação entre as três tabelas de eventos `events_statements_xxx`, consulte a Seção 25.9, “Tabelas do Schema de Desempenho para Eventos Atuais e Históricos”.

* Configuração da coleta de eventos de declaração
* Monitoramento de declarações

#### Configurando a Coleta de Eventos de Declaração

Para controlar se deve coletar eventos de declaração, defina o estado dos instrumentos e dos consumidores relevantes:

* A tabela `setup_instruments` contém instrumentos com nomes que começam com `statement`. Use esses instrumentos para habilitar ou desabilitar a coleta de classes de eventos de declaração individual.

* A tabela `setup_consumers` contém valores de consumidor com nomes correspondentes aos nomes atuais e históricos das tabelas de eventos de declaração, e ao consumidor de digestão de declaração. Use esses consumidores para filtrar a coleção de eventos de declaração e a digestão de declaração.

Os instrumentos de declaração são habilitados por padrão, e os consumidores de declaração `events_statements_current`, `events_statements_history` e `statements_digest` são habilitados por padrão:

```sql
mysql> SELECT *
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

```sql
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

Para controlar a coleta de eventos de declaração na inicialização do servidor, use strings como essas em seu arquivo `my.cnf`:

* Habilitar:

  ```sql
  [mysqld]
  performance-schema-instrument='statement/%=ON'
  performance-schema-consumer-events-statements-current=ON
  performance-schema-consumer-events-statements-history=ON
  performance-schema-consumer-events-statements-history-long=ON
  performance-schema-consumer-statements-digest=ON
  ```

* Desativar:

  ```sql
  [mysqld]
  performance-schema-instrument='statement/%=OFF'
  performance-schema-consumer-events-statements-current=OFF
  performance-schema-consumer-events-statements-history=OFF
  performance-schema-consumer-events-statements-history-long=OFF
  performance-schema-consumer-statements-digest=OFF
  ```

Para controlar a coleta de eventos de declaração no tempo de execução, atualize as tabelas `setup_instruments` e `setup_consumers`:

* Habilitar:

  ```sql
  UPDATE performance_schema.setup_instruments
  SET ENABLED = 'YES', TIMED = 'YES'
  WHERE NAME LIKE 'statement/%';

  UPDATE performance_schema.setup_consumers
  SET ENABLED = 'YES'
  WHERE NAME LIKE '%statements%';
  ```

* Desativar:

  ```sql
  UPDATE performance_schema.setup_instruments
  SET ENABLED = 'NO', TIMED = 'NO'
  WHERE NAME LIKE 'statement/%';

  UPDATE performance_schema.setup_consumers
  SET ENABLED = 'NO'
  WHERE NAME LIKE '%statements%';
  ```

Para coletar apenas eventos de declaração específicos, habilite apenas os instrumentos de declaração correspondentes. Para coletar eventos de declaração apenas para tabelas específicas de eventos de declaração, habilite os instrumentos de declaração, mas apenas os consumidores de declaração correspondentes às tabelas desejadas.

A tabela `setup_timers` contém uma string com um valor `NAME` de `statement` que indica a unidade para o tempo de ocorrência do evento de declaração. A unidade padrão é `NANOSECOND`:

```sql
mysql> SELECT *
       FROM performance_schema.setup_timers
       WHERE NAME = 'statement';
+-----------+------------+
| NAME      | TIMER_NAME |
+-----------+------------+
| statement | NANOSECOND |
+-----------+------------+
```

Para alterar a unidade de tempo, modifique o valor `TIMER_NAME`:

```sql
UPDATE performance_schema.setup_timers
SET TIMER_NAME = 'MICROSECOND'
WHERE NAME = 'statement';
```

Para obter informações adicionais sobre a configuração da coleta de eventos, consulte a Seção 25.3, “Configuração de inicialização do Schema de desempenho”, e a Seção 25.4, “Configuração de execução do Schema de desempenho”.

#### Monitoramento de declarações

O monitoramento das declarações começa no momento em que o servidor percebe que a atividade é solicitada em um thread, até o momento em que toda a atividade cessa. Normalmente, isso significa desde o momento em que o servidor recebe o primeiro pacote do cliente até o momento em que o servidor concluiu a transmissão da resposta. As declarações dentro dos programas armazenados são monitoradas como outras declarações.

Quando o Schema de Desempenho instrumenta uma solicitação (comando do servidor ou declaração SQL), ele utiliza nomes de instrumentos que progridem em etapas, de mais gerais (ou "abstratos") para mais específicos, até chegar a um nome de instrumento final.

Os nomes dos instrumentos finais correspondem a comandos do servidor e declarações SQL:

* Os comandos do servidor correspondem ao `COM_xxx codes` definido no arquivo de cabeçalho `mysql_com.h` e processado em `sql/sql_parse.cc`. Exemplos são `COM_PING` e `COM_QUIT`. Os instrumentos para comandos têm nomes que começam com `statement/com`, como `statement/com/Ping` e `statement/com/Quit`.

* As instruções SQL são expressas como texto, como `DELETE FROM t1` ou `SELECT * FROM t2`. Os instrumentos para instruções SQL têm nomes que começam com `statement/sql`, como `statement/sql/delete` e `statement/sql/select`.

Alguns nomes de instrumentos finais são específicos para o tratamento de erros:

* `statement/com/Error` lida com as mensagens recebidas pelo servidor que estão fora da banda. Pode ser usado para detectar comandos enviados por clientes que o servidor não entende. Isso pode ser útil para fins como identificar clientes que estão mal configurados ou usando uma versão do MySQL mais recente do que a do servidor, ou clientes que estão tentando atacar o servidor.

* `statement/sql/error` contabiliza declarações SQL que não conseguem ser analisadas. Pode ser usado para detectar consultas malformadas enviadas por clientes. Uma consulta que não consegue ser analisada difere de uma consulta que é analisada, mas falha devido a um erro durante a execução. Por exemplo, `SELECT * FROM` é malformada, e o instrumento `statement/sql/error` é usado. Em contraste, `SELECT *` é analisada, mas falha com um erro `No tables used`. Neste caso, `statement/sql/select` é usado e o evento da declaração contém informações para indicar a natureza do erro.

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

A descrição anterior se aplica apenas à replicação baseada em declarações. Para a replicação baseada em strings, o I/O de tabela realizado na replica enquanto processa alterações de string pode ser instrumentado, mas os eventos de string no log de relevo não aparecem como declarações discretas.

Para um pedido recebido do Agendamento de Eventos:

A execução do evento é instrumentada usando o nome `statement/scheduler/event`. Este é o nome final.

As declarações executadas dentro do corpo do evento são instrumentadas usando os nomes `statement/sql/*`, sem o uso de qualquer instrumento abstrato anterior. Um evento é um programa armazenado, e os programas armazenados são pré-compilados na memória antes da execução. Consequentemente, não há análise em tempo real e o tipo de cada declaração é conhecido no momento em que ela é executada.

As declarações executadas dentro do corpo do evento são declarações filhas. Por exemplo, se um evento executa uma declaração `INSERT`, a execução do próprio evento é a mãe, instrumentada usando `statement/scheduler/event`, e o `INSERT` é a filha, instrumentada usando `statement/sql/insert`. A relação mãe/filha ocorre *entre* operações instrumentadas separadas. Isso difere da sequência de refinamento que ocorre *dentro* de uma única operação instrumentada, de nomes abstratos a nomes finais.

Para que as estatísticas sejam coletadas para declarações, não é suficiente habilitar apenas os instrumentos finais `statement/sql/*` usados para tipos de declaração individuais. Os instrumentos abstratos `statement/abstract/*` também devem ser habilitados. Isso normalmente não deve ser um problema, pois todos os instrumentos de declaração são habilitados por padrão. No entanto, uma aplicação que habilita ou desabilita seletivamente os instrumentos de declaração deve levar em conta que a desabilitação dos instrumentos abstratos também desabilita a coleta de estatísticas para os instrumentos de declaração individuais. Por exemplo, para coletar estatísticas para declarações `INSERT`, `statement/sql/insert` deve ser habilitado, mas também `statement/abstract/new_packet` e `statement/abstract/Query`. Da mesma forma, para que as declarações replicadas sejam instrumentadas, `statement/abstract/relay_log` deve ser habilitado.

Não são agregadas estatísticas para instrumentos abstratos, como `statement/abstract/Query`, porque nenhuma declaração é classificada com um instrumento abstrato como o nome final da declaração.

#### 25.12.6.1 A tabela eventos_estatuto_atual

A tabela `events_statements_current` contém eventos de declaração atuais. A tabela armazena uma string por thread, mostrando o status atual do evento de declaração mais recente monitorado pela thread, portanto, não há uma variável do sistema para configurar o tamanho da tabela.

Dos quadros que contêm strings de eventos de declaração, `events_statements_current` é o mais fundamental. Outros quadros que contêm strings de eventos de declaração são derivados logicamente dos eventos atuais. Por exemplo, os quadros `events_statements_history` e `events_statements_history_long` são coleções dos eventos de declaração mais recentes que terminaram, até um número máximo de strings por thread e globalmente em todos os threads, respectivamente.

Para mais informações sobre a relação entre as três tabelas de eventos `events_statements_xxx`, consulte a Seção 25.9, “Tabelas do Schema de Desempenho para Eventos Atuais e Históricos”.

Para obter informações sobre a configuração de coleta de eventos de declaração, consulte a Seção 25.12.6, “Tabelas de Eventos de Declaração do Schema de Desempenho”.

A tabela `events_statements_current` tem essas colunas:

* `THREAD_ID`, `EVENT_ID`

O thread associado ao evento e o número do evento atual do thread quando o evento começa. Os valores `THREAD_ID` e `EVENT_ID` tomados juntos identificam de forma única a string. Nenhuma string tem o mesmo par de valores.

* `END_EVENT_ID`

Essa coluna é definida como `NULL` quando o evento começa e atualizada para o número atual do evento do thread quando o evento termina.

* `EVENT_NAME`

O nome do instrumento do qual o evento foi coletado. Este é um valor `NAME` da tabela `setup_instruments`. Os nomes dos instrumentos podem ter várias partes e formar uma hierarquia, conforme discutido na Seção 25.6, “Convenções de Nomenclatura de Instrumentos do Schema de Desempenho”.

Para as instruções SQL, o valor `EVENT_NAME` é inicialmente `statement/com/Query` até que a instrução seja analisada, e, em seguida, muda para um valor mais apropriado, conforme descrito na Seção 25.12.6, “Tabelas de Eventos de Instrução do Schema de Desempenho”.

* `SOURCE`

O nome do arquivo fonte que contém o código instrumentado que produziu o evento e o número da string no arquivo onde a instrumentação ocorre. Isso permite que você verifique a fonte para determinar exatamente qual código está envolvido.

* `TIMER_START`, `TIMER_END`, `TIMER_WAIT`

Informações de cronometragem para o evento. A unidade desses valores é picosegundo (trilhão de um segundo). Os valores `TIMER_START` e `TIMER_END` indicam quando o cronometramento do evento começou e terminou. `TIMER_WAIT` é o tempo decorrido do evento (duração).

Se um evento não tiver terminado, `TIMER_END` é o valor atual do temporizador e `TIMER_WAIT` é o tempo que já passou (`TIMER_END` − `TIMER_START`).

Se um evento for produzido a partir de um instrumento que tem `TIMED = NO`, as informações de temporização não são coletadas, e `TIMER_START`, `TIMER_END` e `TIMER_WAIT` são todos `NULL`.

Para discussão sobre picossegundos como unidade para os tempos dos eventos e fatores que afetam os valores de tempo, consulte a Seção 25.4.1, “Tempo de Ocorrência do Schema de Desempenho”.

* `LOCK_TIME`

O tempo gasto esperando por bloqueios de tabela. Esse valor é calculado em microsegundos, mas normalizado em picosegundos para facilitar a comparação com outros temporizadores do Schema de Desempenho.

* `SQL_TEXT`

O texto da declaração SQL. Para um comando não associado a uma declaração SQL, o valor é `NULL`.

O espaço máximo disponível para exibição de declaração é de 1024 bytes por padrão. Para alterar esse valor, defina a variável de sistema `performance_schema_max_sql_text_length` na inicialização do servidor.

* `DIGEST`

O digest do MD5 é apresentado como uma cadeia de 32 caracteres hexadecimais, ou `NULL` se o consumidor `statements_digest` for `no`. Para mais informações sobre o digest do MD5, consulte a Seção 25.10, “Digests de declarações do Schema de desempenho”.

* `DIGEST_TEXT`

O texto normalizado do digest do relatório, ou `NULL` se o consumidor `statements_digest` for `no`. Para mais informações sobre o digest do relatório, consulte a Seção 25.10, “Digests de Regras do Schema de Desempenho”.

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

O número de strings afetadas pela declaração. Para uma descrição do significado de "afetada", consulte mysql_affected_rows().

* `ROWS_SENT`

O número de strings devolvidas pelo comando.

* `ROWS_EXAMINED`

O número de strings examinadas pela camada de servidor (não contando qualquer processamento interno dos motores de armazenamento).

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

1 se o servidor não encontrou um bom índice para usar para a declaração, 0 caso contrário. Para informações adicionais, consulte a descrição da coluna `Extra` do `EXPLAIN` de saída para o valor `Range checked for each record` na Seção 8.8.2, “Formato de Saída EXPLAIN”.

* `NESTING_EVENT_ID`, `NESTING_EVENT_TYPE`, `NESTING_EVENT_LEVEL`

Essas três colunas são usadas com outras colunas para fornecer informações conforme segue para declarações de nível superior (não aninhadas) e declarações aninhadas (executadas dentro de um programa armazenado).

Para declarações de nível superior:

  ```sql
  OBJECT_TYPE = NULL
  OBJECT_SCHEMA = NULL
  OBJECT_NAME = NULL
  NESTING_EVENT_ID = NULL
  NESTING_EVENT_TYPE = NULL
  NESTING_LEVEL = 0
  ```

Para declarações aninhadas:

  ```sql
  OBJECT_TYPE = the parent statement object type
  OBJECT_SCHEMA = the parent statement object schema
  OBJECT_NAME = the parent statement object name
  NESTING_EVENT_ID = the parent statement EVENT_ID
  NESTING_EVENT_TYPE = 'STATEMENT'
  NESTING_LEVEL = the parent statement NESTING_LEVEL plus one
  ```

`TRUNCATE TABLE` é permitido para a tabela `events_statements_current`. Ele remove as strings.

#### 25.12.6.2 A tabela eventos_estatuto_história

A tabela `events_statements_history` contém os eventos de declaração mais recentes que terminaram por thread. Os eventos de declaração não são adicionados à tabela até que tenham terminado. Quando a tabela contém o número máximo de strings para um determinado thread, a string mais antiga do thread é descartada quando uma nova string para esse thread é adicionada. Quando um thread termina, todas as suas strings são descartadas.

O Schema de Desempenho autodimensiona o valor de *`N`* durante o arranque do servidor. Para definir explicitamente o número de strings por thread, defina a variável de sistema `performance_schema_events_statements_history_size` durante o arranque do servidor.

A tabela `events_statements_history` tem as mesmas colunas que a tabela `events_statements_current`. Veja a Seção 25.12.6.1, “A tabela eventos_estatuto_atual”.

`TRUNCATE TABLE` é permitido para a tabela `events_statements_history`. Ele remove as strings.

Para mais informações sobre a relação entre as três tabelas de eventos `events_statements_xxx`, consulte a Seção 25.9, “Tabelas do Schema de Desempenho para Eventos Atuais e Históricos”.

Para obter informações sobre a configuração de coleta de eventos de declaração, consulte a Seção 25.12.6, “Tabelas de Eventos de Declaração do Schema de Desempenho”.

#### 25.12.6.3 A tabela eventos_declarações_história_longa

A tabela `events_statements_history_long` contém os eventos de declaração mais recentes que ocorreram globalmente em todas as threads. Os eventos de declaração não são adicionados à tabela até que tenham terminado. Quando a tabela se torna cheia, a string mais antiga é descartada quando uma nova string é adicionada, independentemente de qual thread gerou a string.

O valor de *`N`* é dimensionado automaticamente no início do servidor. Para definir explicitamente o tamanho da tabela, defina a variável de sistema `performance_schema_events_statements_history_long_size` no início do servidor.

A tabela `events_statements_history_long` tem as mesmas colunas que a tabela `events_statements_current`. Veja a Seção 25.12.6.1, “A tabela eventos_estatuto_atual”.

`TRUNCATE TABLE` é permitido para a tabela `events_statements_history_long`. Ele remove as strings.

Para mais informações sobre a relação entre as três tabelas de eventos `events_statements_xxx`, consulte a Seção 25.9, “Tabelas do Schema de Desempenho para Eventos Atuais e Históricos”.

Para obter informações sobre a configuração de coleta de eventos de declaração, consulte a Seção 25.12.6, “Tabelas de Eventos de Declaração do Schema de Desempenho”.

#### 25.12.6.4 A tabela prepared_statements_instances

O Schema de Desempenho oferece instrumentação para declarações preparadas, para as quais existem dois protocolos:

* O protocolo binário. Este é acessado através da API C do MySQL e é mapeado em comandos de servidor subjacentes, conforme mostrado na tabela a seguir.

  <table summary="How the binary protocol accessed through the MySQL C API maps onto underlying server commands."><col style="width: 50%"/><col style="width: 50%"/><thead><tr> <th>C API Function</th> <th>Corresponding Server Command</th> </tr></thead><tbody><tr> <td><code>mysql_stmt_prepare()</code></td> <td><code>COM_STMT_PREPARE</code></td> </tr><tr> <td><code>mysql_stmt_execute()</code></td> <td><code>COM_STMT_EXECUTE</code></td> </tr><tr> <td><code>mysql_stmt_close()</code></td> <td><code>COM_STMT_CLOSE</code></td> </tr></tbody></table>

* Protocolo de texto. Este é acessado usando declarações SQL e mapeado em comandos de servidor subjacentes, conforme mostrado na tabela a seguir.

  <table summary="How the text protocol accessed using SQL statements maps onto underlying server commands."><col style="width: 50%"/><col style="width: 50%"/><thead><tr> <th>SQL Statement</th> <th>Corresponding Server Command</th> </tr></thead><tbody><tr> <td><code>PREPARE</code></td> <td><code>SQLCOM_PREPARE</code></td> </tr><tr> <td><code>EXECUTE</code></td> <td><code>SQLCOM_EXECUTE</code></td> </tr><tr> <td><code>DEALLOCATE PREPARE</code>, <a class="link" href="deallocate-prepare.html" title="13.5.3 DEALLOCATE PREPARE Statement"><code>DROP PREPARE</code></a></td> <td><code>SQLCOM_DEALLOCATE PREPARE</code></td> </tr></tbody></table>

A instrumentação de declaração preparada do Schema de desempenho cobre ambos os protocolos. A discussão a seguir se refere aos comandos do servidor, e não às funções da API C ou às declarações SQL.

Informações sobre declarações preparadas estão disponíveis na tabela `prepared_statements_instances`. Esta tabela permite a inspeção de declarações preparadas usadas no servidor e fornece estatísticas agregadas sobre elas. Para controlar o tamanho desta tabela, defina a variável de sistema `performance_schema_max_prepared_statements_instances` na inicialização do servidor.

A coleta de informações de declaração preparadas depende dos instrumentos de declaração mostrados na tabela a seguir. Esses instrumentos são habilitados por padrão. Para modificá-los, atualize a tabela `setup_instruments`.

<table summary="Collection of prepared statement information depends on the statement instruments shown in this table."><col style="width: 50%"/><col style="width: 50%"/><thead><tr> <th>Instrument</th> <th>Server Command</th> </tr></thead><tbody><tr> <td><code>statement/com/Prepare</code></td> <td><code>COM_STMT_PREPARE</code></td> </tr><tr> <td><code>statement/com/Execute</code></td> <td><code>COM_STMT_EXECUTE</code></td> </tr><tr> <td><code>statement/sql/prepare_sql</code></td> <td><code>SQLCOM_PREPARE</code></td> </tr><tr> <td><code>statement/sql/execute_sql</code></td> <td><code>SQLCOM_EXECUTE</code></td> </tr></tbody></table>

O Schema de Desempenho gerencia os conteúdos da tabela `prepared_statements_instances` da seguinte forma:

* Preparação de declarações

Um comando `COM_STMT_PREPARE` ou `SQLCOM_PREPARE` cria uma declaração preparada no servidor. Se a declaração for instrumentada com sucesso, uma nova string é adicionada à tabela `prepared_statements_instances`. Se a declaração não puder ser instrumentada, a variável de status `Performance_schema_prepared_statements_lost` é incrementada.

* Execução de declarações preparadas

A execução de um comando `COM_STMT_EXECUTE` ou `SQLCOM_PREPARE` para uma instância de declaração preparada instrumentada atualiza a string correspondente da tabela `prepared_statements_instances`.

* Deslocamento de declaração preparada

A execução de um comando `COM_STMT_CLOSE` ou `SQLCOM_DEALLOCATE_PREPARE` para uma instância de declaração preparada instrumentada remove a string correspondente da tabela `prepared_statements_instances`. Para evitar vazamentos de recursos, a remoção ocorre mesmo se os instrumentos de declaração preparada descritos anteriormente forem desativados.

A tabela `prepared_statements_instances` tem essas colunas:

* `OBJECT_INSTANCE_BEGIN`

O endereço em memória do depoimento instrumentado preparado.

* `STATEMENT_ID`

A declaração interna ID atribuída pelo servidor. Os protocolos de texto e binário utilizam ambos IDs de declaração.

* `STATEMENT_NAME`

Para o protocolo binário, esta coluna é `NULL`. Para o protocolo de texto, esta coluna é o nome da declaração externa atribuído pelo usuário. Por exemplo, para a seguinte declaração SQL, o nome da declaração preparada é `stmt`:

  ```sql
  PREPARE stmt FROM 'SELECT 1';
  ```

* `SQL_TEXT`

O texto da declaração preparada, com marcadores de marcação `?`.

* `OWNER_THREAD_ID`, `OWNER_EVENT_ID`

Essas colunas indicam o evento que criou a declaração preparada.

* `OWNER_OBJECT_TYPE`, `OWNER_OBJECT_SCHEMA`, `OWNER_OBJECT_NAME`

Para uma declaração preparada criada por uma sessão de cliente, essas colunas são `NULL`. Para uma declaração preparada criada por um programa armazenado, essas colunas apontam para o programa armazenado. Um erro típico do usuário é esquecer de liberar declarações preparadas. Essas colunas podem ser usadas para encontrar programas armazenados que vazam declarações preparadas:

  ```sql
  SELECT
    OWNER_OBJECT_TYPE, OWNER_OBJECT_SCHEMA, OWNER_OBJECT_NAME,
    STATEMENT_NAME, SQL_TEXT
  FROM performance_schema.prepared_statements_instances
  WHERE OWNER_OBJECT_TYPE IS NOT NULL;
  ```

* `TIMER_PREPARE`

O tempo gasto na execução da preparação da própria declaração.

* `COUNT_REPREPARE`

O número de vezes que a declaração foi preparada internamente (veja a Seção 8.10.4, "Cache de declarações preparadas e programas armazenados") as estatísticas de tempo para a preparação não estão disponíveis, pois são contadas como parte da execução da declaração, e não como uma operação separada.

* `COUNT_EXECUTE`, `SUM_TIMER_EXECUTE`, `MIN_TIMER_EXECUTE`, `AVG_TIMER_EXECUTE`, `MAX_TIMER_EXECUTE`

Estatísticas agregadas para execuções da declaração preparada.

* `SUM_xxx`

As colunas restantes do `SUM_xxx` são as mesmas das tabelas de resumo de declaração (ver Seção 25.12.15.3, “Tabelas de Resumo de Declaração”).

`TRUNCATE TABLE` redefiniu as colunas de estatísticas da tabela `prepared_statements_instances`.

### 25.12.7 Tabelas de Transações do Schema de Desempenho

O esquema de desempenho registra as transações. Na hierarquia de eventos, os eventos de espera estão dentro dos eventos de estágio, que estão dentro dos eventos de declaração, que estão dentro dos eventos de transação.

Essas tabelas armazenam eventos de transação:

* `events_transactions_current`: O evento de transação atual para cada thread.

* `events_transactions_history`: Os eventos de transação mais recentes que terminaram por thread.

* `events_transactions_history_long`: Os eventos de transação mais recentes que terminaram globalmente (em todas as threads).

As seções a seguir descrevem as tabelas de eventos de transação. Há também tabelas resumidas que agregam informações sobre eventos de transação; veja a Seção 25.12.15.4, “Tabelas de Resumo de Transação”.

Para mais informações sobre a relação entre as três tabelas de eventos de transação, consulte a Seção 25.9, “Tabelas do Schema de Desempenho para Eventos Atuais e Históricos”.

* Configuração da coleta de eventos de transação
* Limites de transação
* Instrumentação de transação
* Transações e eventos aninhados
* Transações e programas armazenados
* Transações e pontos de salvamento
* Transações e erros

#### Configurando a Coleta de Eventos de Transação

Para controlar se deve coletar eventos de transação, defina o estado dos instrumentos e dos consumidores relevantes:

* A tabela `setup_instruments` contém um instrumento denominado `transaction`. Use este instrumento para habilitar ou desabilitar a coleta de classes de eventos de transação individual.

* A tabela `setup_consumers` contém valores de consumidor com nomes correspondentes aos nomes atuais e históricos das tabelas de eventos de transação. Use esses consumidores para filtrar a coleção de eventos de transação.

O instrumento `transaction` e os consumidores de transação são desabilitados por padrão:

```sql
mysql> SELECT *
       FROM performance_schema.setup_instruments
       WHERE NAME = 'transaction';
+-------------+---------+-------+
| NAME        | ENABLED | TIMED |
+-------------+---------+-------+
| transaction | NO      | NO    |
+-------------+---------+-------+
mysql> SELECT *
       FROM performance_schema.setup_consumers
       WHERE NAME LIKE 'events_transactions%';
+----------------------------------+---------+
| NAME                             | ENABLED |
+----------------------------------+---------+
| events_transactions_current      | NO      |
| events_transactions_history      | NO      |
| events_transactions_history_long | NO      |
+----------------------------------+---------+
```

Para controlar a coleta de eventos de transação na inicialização do servidor, use strings como essas em seu arquivo `my.cnf`:

* Habilitar:

  ```sql
  [mysqld]
  performance-schema-instrument='transaction=ON'
  performance-schema-consumer-events-transactions-current=ON
  performance-schema-consumer-events-transactions-history=ON
  performance-schema-consumer-events-transactions-history-long=ON
  ```

* Desativar:

  ```sql
  [mysqld]
  performance-schema-instrument='transaction=OFF'
  performance-schema-consumer-events-transactions-current=OFF
  performance-schema-consumer-events-transactions-history=OFF
  performance-schema-consumer-events-transactions-history-long=OFF
  ```

Para controlar a coleta de eventos de transação no tempo de execução, atualize as tabelas `setup_instruments` e `setup_consumers`:

* Habilitar:

  ```sql
  UPDATE performance_schema.setup_instruments
  SET ENABLED = 'YES', TIMED = 'YES'
  WHERE NAME = 'transaction';

  UPDATE performance_schema.setup_consumers
  SET ENABLED = 'YES'
  WHERE NAME LIKE 'events_transactions%';
  ```

* Desativar:

  ```sql
  UPDATE performance_schema.setup_instruments
  SET ENABLED = 'NO', TIMED = 'NO'
  WHERE NAME = 'transaction';

  UPDATE performance_schema.setup_consumers
  SET ENABLED = 'NO'
  WHERE NAME LIKE 'events_transactions%';
  ```

Para coletar eventos de transação apenas para tabelas específicas de eventos de transação, habilite o instrumento `transaction`, mas apenas os consumidores de transação correspondentes às tabelas desejadas.

A tabela `setup_timers` contém uma string com um valor `NAME` de `transaction` que indica a unidade para o tempo de eventos de transação. A unidade padrão é `NANOSECOND`:

```sql
mysql> SELECT *
       FROM performance_schema.setup_timers
       WHERE NAME = 'transaction';
+-------------+------------+
| NAME        | TIMER_NAME |
+-------------+------------+
| transaction | NANOSECOND |
+-------------+------------+
```

Para alterar a unidade de tempo, modifique o valor `TIMER_NAME`:

```sql
UPDATE performance_schema.setup_timers
SET TIMER_NAME = 'MICROSECOND'
WHERE NAME = 'transaction';
```

Para obter informações adicionais sobre a configuração da coleta de eventos, consulte a Seção 25.3, “Configuração de inicialização do Schema de desempenho”, e a Seção 25.4, “Configuração de execução do Schema de desempenho”.

#### Limites de Transação

No MySQL Server, as transações começam explicitamente com essas declarações:

```sql
START TRANSACTION | BEGIN | XA START | XA BEGIN
```

As transações também começam implicitamente. Por exemplo, quando a variável de sistema `autocommit` é habilitada, o início de cada declaração inicia uma nova transação.

Quando o `autocommit` é desativado, a primeira declaração que segue uma transação comprometida marca o início de uma nova transação. As declarações subsequentes fazem parte da transação até que ela seja comprometida.

As transações terminam explicitamente com essas declarações:

```sql
COMMIT | ROLLBACK | XA COMMIT | XA ROLLBACK
```

As transações também terminam implicitamente, pela execução de declarações DDL, declarações de bloqueio e declarações de administração do servidor.

Na discussão a seguir, as referências a `START TRANSACTION` também se aplicam a `BEGIN`, `XA START` e `XA BEGIN`. Da mesma forma, as referências a `COMMIT` e `ROLLBACK` se aplicam a `XA COMMIT` e `XA ROLLBACK`, respectivamente.

O Schema de Desempenho define os limites das transações de forma semelhante ao do servidor. O início e o fim de um evento de transação correspondem de perto às transições de estado correspondentes no servidor:

* Para uma transação explicitamente iniciada, o evento da transação começa durante o processamento da declaração `START TRANSACTION`.

* Para uma transação iniciada implicitamente, o evento da transação começa na primeira declaração que utiliza um motor transacional após a conclusão da transação anterior.

* Para qualquer transação, seja explicitamente ou implicitamente encerrada, o evento da transação termina quando o servidor sai do estado de transação ativa durante o processamento de `COMMIT` ou `ROLLBACK`.

Há implicações sutis nessa abordagem:

* Os eventos de transação no Schema de desempenho não incluem totalmente os eventos de declaração associados às declarações correspondentes `START TRANSACTION`, `COMMIT` ou `ROLLBACK`. Há uma quantidade trivial de sobreposição de temporização entre o evento de transação e essas declarações.

* As declarações que trabalham com motores não transacionais não têm efeito sobre o estado da transação da conexão. Para transações implícitas, o evento da transação começa com a primeira declaração que utiliza um motor transacional. Isso significa que as declarações que operam exclusivamente em tabelas não transacionais são ignoradas, mesmo após `START TRANSACTION`.

Para ilustrar, considere o seguinte cenário:

```sql
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

O custo da instrumentação de transações pode ser reduzido de várias maneiras, como habilitar ou desabilitar a instrumentação de transações de acordo com o usuário, a conta, o host ou o thread (conexão do cliente).

#### Transações e Eventos Aninhados

O progenitor de um evento de transação é o evento que iniciou a transação. Para uma transação explicitamente iniciada, isso inclui as declarações `START TRANSACTION` e `COMMIT AND CHAIN`. Para uma transação implicitamente iniciada, é a primeira declaração que usa um motor de transação após o término da transação anterior.

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

As declarações de Savepoint são registradas como eventos de declaração separados. Os eventos de transação incluem contadores separados para as declarações `SAVEPOINT`, `ROLLBACK TO SAVEPOINT` e `RELEASE SAVEPOINT` emitidas durante a transação.

#### Transações e Erros

Erros e avisos que ocorrem dentro de uma transação são registrados em eventos de declaração, mas não no evento de transação correspondente. Isso inclui erros e avisos específicos da transação, como um rollback em uma tabela não transacional ou erros de consistência GTID.

#### 25.12.7.1 Tabela eventos_transações_atual

A tabela `events_transactions_current` contém eventos de transação atual. A tabela armazena uma string por thread, mostrando o status atual do evento de transação mais recente monitorado da thread, portanto, não há uma variável do sistema para configurar o tamanho da tabela. Por exemplo:

```sql
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

Dos quadros que contêm strings de eventos de transação, `events_transactions_current` é o mais fundamental. Outras tabelas que contêm strings de eventos de transação são derivadas logicamente dos eventos atuais. Por exemplo, as tabelas `events_transactions_history` e `events_transactions_history_long` são coleções dos eventos de transação mais recentes que terminaram, até um número máximo de strings por thread e globalmente em todos os threads, respectivamente.

Para mais informações sobre a relação entre as três tabelas de eventos de transação, consulte a Seção 25.9, “Tabelas do Schema de Desempenho para Eventos Atuais e Históricos”.

Para obter informações sobre a configuração de coleta de eventos de transação, consulte a Seção 25.12.7, “Tabelas de Transação do Schema de Desempenho”.

A tabela `events_transactions_current` tem essas colunas:

* `THREAD_ID`, `EVENT_ID`

O thread associado ao evento e o número do evento atual do thread quando o evento começa. Os valores `THREAD_ID` e `EVENT_ID`, quando tomados juntos, identificam de forma única a string. Nenhuma string tem o mesmo par de valores.

* `END_EVENT_ID`

Essa coluna é definida como `NULL` quando o evento começa e atualizada para o número atual do evento do tópico quando o evento termina.

* `EVENT_NAME`

O nome do instrumento do qual o evento foi coletado. Este é um valor `NAME` da tabela `setup_instruments`. Os nomes dos instrumentos podem ter várias partes e formar uma hierarquia, conforme discutido na Seção 25.6, “Convenções de Nomenclatura de Instrumentos do Schema de Desempenho”.

* `STATE`

O estado atual da transação. O valor é `ACTIVE` (após `START TRANSACTION` ou `BEGIN`), `COMMITTED` (após `COMMIT`), ou `ROLLED BACK` (após `ROLLBACK`).

* `TRX_ID`

  Unused.

* `GTID`

A coluna GTID contém o valor de `gtid_next`, que pode ser um dos `ANONYMOUS`, `AUTOMATIC`, ou um GTID usando o formato `UUID:NUMBER`. Para transações que utilizam `gtid_next=AUTOMATIC`, que são todas as transações normais do cliente, a coluna GTID muda quando a transação é confirmada e o GTID real é atribuído. Se `gtid_mode` é `ON` ou `ON_PERMISSIVE`, a coluna GTID muda para o GTID da transação. Se `gtid_mode` é `OFF` ou `OFF_PERMISSIVE`, a coluna GTID muda para `ANONYMOUS`.

* `XID_FORMAT_ID`, `XID_GTRID` e `XID_BQUAL`

Os elementos do identificador de transação XA. Eles têm o formato descrito na Seção 13.3.7.1, “Ensaios de SQL de Transação XA”.

* `XA_STATE`

O estado da transação XA. O valor é `ACTIVE` (após `XA START`, `IDLE` (após `XA END`, `PREPARED` (após `XA PREPARE`, `ROLLED BACK` (após `XA ROLLBACK`, ou `COMMITTED` (após `XA COMMIT`).

Em uma réplica, a mesma transação XA pode aparecer na tabela `events_transactions_current` com diferentes estados em diferentes threads. Isso ocorre porque, imediatamente após a transação XA ser preparada, ela é desprendida do thread do aplicador de replicação e pode ser confirmada ou anulada por qualquer thread na réplica. A tabela `events_transactions_current` exibe o status atual do evento de transação monitorado mais recente no thread, e não atualiza esse status quando o thread está parado. Portanto, a transação XA ainda pode ser exibida no estado `PREPARED` para o thread do aplicador original, após ter sido processada por outro thread. Para identificar positivamente as transações XA que ainda estão no estado `PREPARED` e precisam ser recuperadas, use a declaração `XA RECOVER` em vez das tabelas de transação do Schema de Desempenho.

* `SOURCE`

O nome do arquivo fonte que contém o código instrumentado que produziu o evento e o número da string no arquivo onde a instrumentação ocorre. Isso permite que você verifique a fonte para determinar exatamente qual código está envolvido.

* `TIMER_START`, `TIMER_END`, `TIMER_WAIT`

Informações de cronometragem para o evento. A unidade desses valores é picosegundo (trilhão de um segundo). Os valores `TIMER_START` e `TIMER_END` indicam quando o cronometramento do evento começou e terminou. `TIMER_WAIT` é o tempo decorrido do evento (duração).

Se um evento ainda não tiver terminado, `TIMER_END` é o valor atual do temporizador e `TIMER_WAIT` é o tempo que já passou (`TIMER_END` − `TIMER_START`).

Se um evento for produzido a partir de um instrumento que tem `TIMED = NO`, as informações de cronometragem não são coletadas, e `TIMER_START`, `TIMER_END` e `TIMER_WAIT` são todos `NULL`.

Para discussão sobre picossegundos como unidade para os tempos dos eventos e fatores que afetam os valores de tempo, consulte a Seção 25.4.1, “Tempo de Ocorrência do Schema de Desempenho”.

* `ACCESS_MODE`

O modo de acesso à transação. O valor é `READ WRITE` ou `READ ONLY`.

* `ISOLATION_LEVEL`

O nível de isolamento de transação. O valor é `REPEATABLE READ`, `READ COMMITTED`, `READ UNCOMMITTED` ou `SERIALIZABLE`.

* `AUTOCOMMIT`

Se o modo autcommit foi habilitado quando a transação foi iniciada.

* `NUMBER_OF_SAVEPOINTS`, `NUMBER_OF_ROLLBACK_TO_SAVEPOINT`, `NUMBER_OF_RELEASE_SAVEPOINT`

O número de declarações `SAVEPOINT`, `ROLLBACK TO SAVEPOINT` e `RELEASE SAVEPOINT` emitidas durante a transação.

* `OBJECT_INSTANCE_BEGIN`

  Unused.

* `NESTING_EVENT_ID`

O valor `EVENT_ID` do evento no qual este evento está inserido.

* `NESTING_EVENT_TYPE`

O tipo de evento de nidificação. O valor é `TRANSACTION`, `STATEMENT`, `STAGE` ou `WAIT`. (`TRANSACTION` não aparece porque as transações não podem ser nidificadas.)

`TRUNCATE TABLE` é permitido para a tabela `events_transactions_current`. Ele remove as strings.

#### 25.12.7.2 A tabela de eventos_transações_história

A tabela `events_transactions_history` contém os eventos de transação *`N`* mais recentes que terminaram por thread. Os eventos de transação não são adicionados à tabela até que tenham terminado. Quando a tabela contém o número máximo de strings para um determinado thread, a string mais antiga do thread é descartada quando uma nova string para esse thread é adicionada. Quando um thread termina, todas as suas strings são descartadas.

O Schema de Desempenho autodimensiona o valor de *`N`* durante o arranque do servidor. Para definir explicitamente o número de strings por thread, defina a variável de sistema `performance_schema_events_transactions_history_size` durante o arranque do servidor.

A tabela `events_transactions_history` tem as mesmas colunas que a tabela `events_transactions_current`. Veja a Seção 25.12.7.1, “A tabela eventos_transações_corrente”.

`TRUNCATE TABLE` é permitido para a tabela `events_transactions_history`. Ele remove as strings.

Para mais informações sobre a relação entre as três tabelas de eventos de transação, consulte a Seção 25.9, “Tabelas do Schema de Desempenho para Eventos Atuais e Históricos”.

Para obter informações sobre a configuração de coleta de eventos de transação, consulte a Seção 25.12.7, “Tabelas de Transação do Schema de Desempenho”.

#### 25.12.7.3 A tabela de histórico de eventos, transações e histórico de eventos longo

A tabela `events_transactions_history_long` contém os eventos de transação *`N`* mais recentes que terminaram globalmente em todas as threads. Os eventos de transação não são adicionados à tabela até que tenham terminado. Quando a tabela se torna cheia, a string mais antiga é descartada quando uma nova string é adicionada, independentemente de qual thread gerou a string.

O Schema de desempenho autodimensiona o valor de *`N`* é autodimensionado no início do servidor. Para definir explicitamente o tamanho da tabela, defina a variável de sistema `performance_schema_events_transactions_history_long_size` no início do servidor.

A tabela `events_transactions_history_long` tem as mesmas colunas que a tabela `events_transactions_current`. Veja a Seção 25.12.7.1, “A tabela eventos_transações_corrente”.

`TRUNCATE TABLE` é permitido para a tabela `events_transactions_history_long`. Ele remove as strings.

Para mais informações sobre a relação entre as três tabelas de eventos de transação, consulte a Seção 25.9, “Tabelas do Schema de Desempenho para Eventos Atuais e Históricos”.

Para obter informações sobre a configuração de coleta de eventos de transação, consulte a Seção 25.12.7, “Tabelas de Transação do Schema de Desempenho”.

### 25.12.8 Tabelas de Conexão do Schema de Desempenho

Quando um cliente se conecta ao servidor MySQL, ele faz isso sob um nome de usuário específico e a partir de um host específico. O Schema de Desempenho fornece estatísticas sobre essas conexões, rastreando-as por conta (combinação de usuário e host), bem como separadamente por nome de usuário e nome de host, usando essas tabelas:

* `accounts`: Estatísticas de conexão por conta do cliente

* `hosts`: Estatísticas de conexão por nome de host do cliente

* `users`: Estatísticas de conexão por nome de usuário do cliente

O significado de “conta” nas tabelas de conexão é semelhante ao seu significado nas tabelas de concessão de permissão do sistema `mysql`, no sentido de que o termo se refere a uma combinação de valores de usuário e host. Eles diferem na medida em que, para as tabelas de concessão de permissão, a parte host de uma conta pode ser um padrão, enquanto para as tabelas do Schema de Desempenho, o valor host é sempre um nome de host específico não padrão.

Cada tabela de conexão tem as colunas `CURRENT_CONNECTIONS` e `TOTAL_CONNECTIONS` para rastrear o número atual e total de conexões por “valor de rastreamento” sobre o qual suas estatísticas são baseadas. As tabelas diferem no que elas usam para o valor de rastreamento. A tabela `accounts` tem as colunas `USER` e `HOST` para rastrear conexões por combinação de usuário e host. As tabelas `users` e `hosts` têm uma coluna `USER`, respectivamente, para rastrear conexões por nome de usuário e nome de host.

O Schema de Desempenho também conta as threads internas e as threads para sessões de usuários que não conseguiram se autenticar, usando strings com os valores das colunas `USER` e `HOST` de `NULL`.

Suponha que os clientes com os nomes `user1` e `user2` se conectem uma vez a partir de `hosta` e `hostb`. O Schema de Desempenho rastreia as conexões da seguinte forma:

* A tabela `accounts` tem quatro strings, para os valores das contas `user1`/`hosta`, `user1`/`hostb`, `user2`/`hosta` e `user2`/`hostb`, cada string contando uma conexão por conta.

* A tabela `hosts` tem duas strings, para `hosta` e `hostb`, cada string contando duas conexões por nome de host.

* A tabela `users` tem duas strings, para `user1` e `user2`, cada string contando duas conexões por nome de usuário.

Quando um cliente se conecta, o Schema de Desempenho determina qual string na tabela de conexão se aplica, usando o valor de rastreamento apropriado para cada tabela. Se não houver tal string, uma é adicionada. Em seguida, o Schema de Desempenho incrementa em um os campos `CURRENT_CONNECTIONS` e `TOTAL_CONNECTIONS` naquela string.

Quando um cliente se desconecta, o Schema de Desempenho decrementa em um a coluna `CURRENT_CONNECTIONS` na string e deixa a coluna `TOTAL_CONNECTIONS` inalterada.

`TRUNCATE TABLE` é permitido para tabelas de conexão. Tem esses efeitos:

* As strings são removidas para contas, anfitriões ou usuários que não têm conexões atuais (strings com `CURRENT_CONNECTIONS = 0`).

* As strings não removidas são redefinidas para contar apenas as conexões atuais: Para as strings com `CURRENT_CONNECTIONS > 0`, `TOTAL_CONNECTIONS` é redefinido para `CURRENT_CONNECTIONS`.

* As tabelas de resumo que dependem da tabela de conexão são implicitamente truncadas, conforme descrito mais adiante nesta seção.

O Schema de Desempenho mantém tabelas resumidas que agregam estatísticas de conexão para vários tipos de eventos por conta, host ou usuário. Essas tabelas têm `_summary_by_account`, `_summary_by_host` ou `_summary_by_user` no nome. Para identificá-las, use esta consulta:

```sql
mysql> SELECT TABLE_NAME FROM INFORMATION_SCHEMA.TABLES
       WHERE TABLE_SCHEMA = 'performance_schema'
       AND TABLE_NAME REGEXP '_summary_by_(account|host|user)'
       ORDER BY TABLE_NAME;
+------------------------------------------------------+
| TABLE_NAME                                           |
+------------------------------------------------------+
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

* Resumos de eventos: Seção 25.12.15.1, “Tabelas de Resumo de Eventos de Aguardar”

* Resumos de eventos em palco: Seção 25.12.15.2, “Tabelas de Resumo em Palco”

* Resumos de eventos de declaração: Seção 25.12.15.3, “Tabelas de Resumo de Declaração”

* Resumos de eventos de transação: Seção 25.12.15.4, “Tabelas de Resumo de Transação”

* Resumos de eventos de memória: Seção 25.12.15.9, “Tabelas de Resumo de Memória”

`TRUNCATE TABLE` é permitido para tabelas de resumo de conexão. Ele remove strings para contas, hosts ou usuários sem conexões e redefre o número de colunas de resumo para zero para as strings restantes. Além disso, cada tabela de resumo que é agregada por conta, host, usuário ou thread é implicitamente truncada pela truncagem da tabela de conexão na qual depende. O seguinte quadro descreve a relação entre a truncagem da tabela de conexão e as tabelas implicitamente truncadas.

**Tabela 25.2 Efeitos Implícitos da Truncagem da Tabela de Conexão**

<table summary="Which Performance Schema summary tables are implicity truncated by connection table truncation."><col style="width: 40%"/><col style="width: 60%"/><thead><tr> <th>Truncated Connection Table</th> <th>Implicitly Truncated Summary Tables</th> </tr></thead><tbody><tr> <td><code>accounts</code></td> <td>Tables with names containing <code>_summary_by_account</code>, <code>_summary_by_thread</code></td> </tr><tr> <td><code>hosts</code></td> <td>Tables with names containing <code>_summary_by_account</code>, <code>_summary_by_host</code>, <code>_summary_by_thread</code></td> </tr><tr> <td><code>users</code></td> <td>Tables with names containing <code>_summary_by_account</code>, <code>_summary_by_user</code>, <code>_summary_by_thread</code></td> </tr></tbody></table>

O truncamento de uma tabela de resumo `_summary_global` também trunca implicitamente suas tabelas de resumo de conexão e de thread correspondentes. Por exemplo, o truncamento de `events_waits_summary_global_by_event_name` trunca implicitamente as tabelas de resumo de eventos de espera que são agregadas por conta, host, usuário ou thread.

#### 25.12.8.1 A tabela de contas

A tabela `accounts` contém uma string para cada conta que se conectou ao servidor MySQL. Para cada conta, a tabela conta o número atual e total de conexões. O tamanho da tabela é dimensionado automaticamente no início do servidor. Para definir o tamanho da tabela explicitamente, defina a variável de sistema `performance_schema_accounts_size` no início do servidor. Para desabilitar estatísticas de conta, defina essa variável para 0.

A tabela `accounts` tem as seguintes colunas. Para uma descrição de como o Schema de Desempenho mantém as strings nesta tabela, incluindo o efeito de `TRUNCATE TABLE`, consulte a Seção 25.12.8, “Tabelas de Conexão do Schema de Desempenho”.

* `USER`

O nome de usuário do cliente para a conexão. Isso é `NULL` para um thread interno, ou para uma sessão de usuário que não conseguiu se autenticar.

* `HOST`

O host a partir do qual o cliente se conectou. Isso é `NULL` para um thread interno, ou para uma sessão de usuário que não conseguiu se autenticar.

* `CURRENT_CONNECTIONS`

O número atual de conexões para a conta.

* `TOTAL_CONNECTIONS`

O número total de conexões para a conta.

#### 25.12.8.2 A Tabela de anfitriões

A tabela `hosts` contém uma string para cada host a partir do qual os clientes se conectaram ao servidor MySQL. Para cada nome de host, a tabela conta o número atual e total de conexões. O tamanho da tabela é dimensionado automaticamente no início do servidor. Para definir explicitamente o tamanho da tabela, defina a variável de sistema `performance_schema_hosts_size` no início do servidor. Para desabilitar as estatísticas de host, defina essa variável para 0.

A tabela `hosts` tem as seguintes colunas. Para uma descrição de como o Schema de Desempenho mantém as strings nesta tabela, incluindo o efeito de `TRUNCATE TABLE`, consulte a Seção 25.12.8, “Tabelas de Conexão do Schema de Desempenho”.

* `HOST`

O host a partir do qual o cliente se conectou. Isso é `NULL` para um thread interno, ou para uma sessão de usuário que não conseguiu se autenticar.

* `CURRENT_CONNECTIONS`

O número atual de conexões para o host.

* `TOTAL_CONNECTIONS`

O número total de conexões para o host.

#### 25.12.8.3 A Tabela de usuários

A tabela `users` contém uma string para cada usuário que se conectou ao servidor MySQL. Para cada nome de usuário, a tabela conta o número atual e total de conexões. O tamanho da tabela é dimensionado automaticamente no início do servidor. Para definir o tamanho da tabela explicitamente, defina a variável de sistema `performance_schema_users_size` no início do servidor. Para desabilitar estatísticas de usuário, defina essa variável para 0.

A tabela `users` tem as seguintes colunas. Para uma descrição de como o Schema de Desempenho mantém as strings nesta tabela, incluindo o efeito de `TRUNCATE TABLE`, consulte a Seção 25.12.8, “Tabelas de Conexão do Schema de Desempenho”.

* `USER`

O nome de usuário do cliente para a conexão. Este é `NULL` para um thread interno, ou para uma sessão de usuário que não conseguiu autenticar.

* `CURRENT_CONNECTIONS`

O número atual de conexões para o usuário.

* `TOTAL_CONNECTIONS`

O número total de conexões para o usuário.

### 25.12.9 Tabelas de atributos de conexão do esquema de desempenho

Os atributos de conexão são pares chave-valor que os programas de aplicação podem passar ao servidor no momento da conexão. Para aplicações baseadas na API C implementada pela biblioteca de clientes `libmysqlclient`, as funções `mysql_options()` e `mysql_options4()` definem o conjunto de atributos de conexão. Outros Conectadores MySQL podem fornecer seus próprios métodos de definição de atributos.

Essas tabelas do Schema de Desempenho exibem informações de atributos:

* `session_account_connect_attrs`: Atributos de conexão para a sessão atual e outras sessões associadas à conta da sessão

* `session_connect_attrs`: Atributos de conexão para todas as sessões

Os nomes de atributos que começam com um underscore (`_`) são reservados para uso interno e não devem ser criados por programas de aplicação. Essa convenção permite que novos atributos sejam introduzidos pelo MySQL sem colidir com atributos de aplicação, e permite que os programas de aplicação definam seus próprios atributos que não colidem com atributos internos.

* Atributos de Conexão Disponíveis
* Limites de Atributo de Conexão

#### Atributos da Conexão Disponível

O conjunto de atributos de conexão visíveis dentro de uma conexão dada varia de acordo com fatores como sua plataforma, o Conectador MySQL usado para estabelecer a conexão ou o programa cliente.

A biblioteca de clientes `libmysqlclient` define esses atributos:

* `_client_name`: O nome do cliente (`libmysql` para a biblioteca de clientes).

* `_client_version`: A versão da biblioteca do cliente.

* `_os`: O sistema operacional (por exemplo, `Linux`, `Win64`).

* `_pid`: O ID do processo do cliente. * `_platform`: A plataforma da máquina (por exemplo, `x86_64`).

* `_thread`: O ID do thread do cliente (apenas no Windows).

Outros Conectadores MySQL podem definir seus próprios atributos de conexão.

O MySQL Connector/J define esses atributos:

* `_client_license`: O tipo de licença do conector.

* `_runtime_vendor`: O fornecedor do ambiente de tempo de execução Java (JRE).

* `_runtime_version`: A versão do ambiente de execução Java (JRE).

O MySQL Connector/NET define esses atributos:

* `_client_version`: A versão da biblioteca do cliente.

* `_os`: O sistema operacional (por exemplo, `Linux`, `Win64`).

* `_pid`: O ID do processo do cliente. * `_platform`: A plataforma da máquina (por exemplo, `x86_64`).

* `_program_name`: O nome do cliente.  
* `_thread`: O ID do thread do cliente (apenas no Windows).

O PHP define atributos que dependem de como ele foi compilado:

* Compilado usando `libmysqlclient`: Os atributos padrão do `libmysqlclient`, descritos anteriormente.

* Compilado usando `mysqlnd`: Apenas o atributo `_client_name`, com um valor de `mysqlnd`.

Muitos programas de cliente MySQL definem um atributo `program_name` com um valor igual ao nome do cliente. Por exemplo, **mysqladmin** e **mysqldump** definem `program_name` como `mysqladmin` e `mysqldump`, respectivamente.

Alguns programas clientes do MySQL definem atributos adicionais:

* **mysqlbinlog**:

+ `_client_role`: `binary_log_listener`

* Conexões de réplica:

+ `program_name`: `mysqld`

+ `_client_role`: `binary_log_listener`

+ `_client_replication_channel_name`: O nome do canal.

* `FEDERATED` conexões do motor de armazenamento:

+ `program_name`: `mysqld`

+ `_client_role`: `federated_storage`

#### Limites de atributo de conexão

Há limites para a quantidade de dados do atributo de conexão transmitidos do cliente para o servidor:

* Um limite fixo imposto pelo cliente antes do horário de conexão. * Um limite fixo imposto pelo servidor no horário de conexão. * Um limite configurável imposto pelo Schema de Desempenho no horário de conexão.

Para conexões iniciadas usando a API C, a biblioteca `libmysqlclient` impõe um limite de 64 KB no tamanho agregado dos dados do atributo de conexão no lado do cliente: Chamadas a `mysql_options()` que causem o excedente desse limite produzem um erro `CR_INVALID_PARAMETER_NO`. Outros Conectadores MySQL podem impor seus próprios limites no lado do cliente sobre o quanto os dados do atributo de conexão podem ser transmitidos ao servidor.

No lado do servidor, essas verificações de tamanho nos dados do atributo de conexão ocorrem:

* O servidor impõe um limite de 64 KB no tamanho agregado dos dados do atributo de conexão que ele pode aceitar. Se um cliente tentar enviar mais de 64 KB de dados do atributo, o servidor rejeita a conexão.

* Para conexões aceitas, o Schema de Desempenho verifica o tamanho do atributo agregado contra o valor da variável de sistema `performance_schema_session_connect_attrs_size`. Se o tamanho do atributo exceder esse valor, essas ações ocorrem:

+ O Schema de Desempenho trunca os dados do atributo e incrementa a variável de status `Performance_schema_session_connect_attrs_lost`, que indica o número de conexões para as quais ocorreu a truncagem do atributo.

+ O Schema de Desempenho escreve uma mensagem no log de erro se a variável de sistema `log_error_verbosity` for maior que 1:

    ```sql
    [Warning] Connection attributes of length N were truncated
    ```

#### 25.12.9.1 A tabela session_account_connect_attrs

Os programas de aplicação podem fornecer atributos de conexão de chave-valor que devem ser passados ao servidor no momento da conexão. Para descrições de atributos comuns, consulte a Seção 25.12.9, “Tabelas de atributos de conexão do Schema de desempenho”.

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

`TRUNCATE TABLE` não é permitido para a tabela `session_account_connect_attrs`.

#### 25.12.9.2 A tabela session_connect_attrs

Os programas de aplicação podem fornecer atributos de conexão de chave-valor que devem ser passados ao servidor no momento da conexão. Para descrições de atributos comuns, consulte a Seção 25.12.9, “Tabelas de atributos de conexão do Schema de desempenho”.

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

`TRUNCATE TABLE` não é permitido para a tabela `session_connect_attrs`.

### 25.12.10 Tabelas de variáveis definidas pelo usuário do esquema de desempenho

O Schema de Desempenho fornece uma tabela `user_variables_by_thread` que expõe variáveis definidas pelo usuário. Estas são variáveis definidas dentro de uma sessão específica e incluem um caractere `@` antes do nome; veja a Seção 9.4, “Variáveis Definidas pelo Usuário”.

A tabela `user_variables_by_thread` tem essas colunas:

* `THREAD_ID`

O identificador do thread da sessão na qual a variável é definida.

* `VARIABLE_NAME`

O nome da variável, sem o caractere inicial `@`.

* `VARIABLE_VALUE`

O valor variável.

`TRUNCATE TABLE` não é permitido para a tabela `user_variables_by_thread`.

### 25.12.11 Tabelas de Replicação do Schema de Desempenho

O Schema de Desempenho fornece tabelas que exibem informações de replicação. Isso é semelhante às informações disponíveis na declaração `SHOW SLAVE STATUS`, mas a representação em formato de tabela é mais acessível e oferece benefícios de usabilidade:

* A saída `SHOW SLAVE STATUS` é útil para inspeção visual, mas não tanto para uso programático. Em contraste, ao usar as tabelas do Schema de Desempenho, as informações sobre o status da replicação podem ser pesquisadas usando consultas gerais `SELECT`, incluindo condições complexas `WHERE`, junções, etc.

* Os resultados das consultas podem ser salvos em tabelas para análise adicional, ou atribuídos a variáveis e, assim, utilizados em procedimentos armazenados.

* As tabelas de replicação fornecem informações de diagnóstico melhores. Para operação de replicação multithread, `SHOW SLAVE STATUS` relata todos os erros do thread do coordenador e do trabalhador usando os campos `Last_SQL_Errno` e `Last_SQL_Error`, então apenas o mais recente desses erros é visível e as informações podem ser perdidas. As tabelas de replicação armazenam erros por thread sem perda de informações.

* A última transação vista é visível nas tabelas de replicação por trabalhador. Essa é uma informação que não está disponível em `SHOW SLAVE STATUS`.

* Os desenvolvedores familiarizados com a interface do Schema de Desempenho podem estender as tabelas de replicação para fornecer informações adicionais, adicionando strings às tabelas.

#### Descrições das tabelas de replicação

O Schema de Desempenho fornece as seguintes tabelas relacionadas à replicação:

*Tabelas que contêm informações sobre a conexão de uma réplica ao servidor de origem de replicação:

+ `replication_connection_configuration`: Parâmetros de configuração para conectar-se à fonte

+ `replication_connection_status`: Status atual da conexão com a fonte

*Tabelas que contêm informações gerais (não específicas para o fórum) sobre o aplicativo de aplicação de transações:

+ `replication_applier_configuration`: Parâmetros de configuração para o aplicativo de aplicação de transação na replica.

+ `replication_applier_status`: Status atual do aplicativo de aplicação de transação na replica.

*Tabelas que contêm informações sobre os threads específicos responsáveis pela aplicação de transações recebidas da fonte:

+ `replication_applier_status_by_coordinator`: Status do thread de coordenação (vazio, a menos que a replica seja multithread).

+ `replication_applier_status_by_worker`: Status do thread de aplicação ou dos threads de trabalho, se a replica for multithread.

* Tabelas que contêm informações sobre os membros do grupo de replicação:

+ `replication_group_members`: Fornece informações de rede e status para os membros do grupo.

+ `replication_group_member_stats`: Fornece informações estatísticas sobre os membros do grupo e as transações nas quais eles participam.

As seções a seguir descrevem cada tabela de replicação com mais detalhes, incluindo a correspondência entre as colunas produzidas por `SHOW SLAVE STATUS` e as colunas da tabela de replicação na qual as mesmas informações aparecem.

O restante desta introdução sobre as tabelas de replicação descreve como o Schema de Desempenho as preenche e quais campos do `SHOW SLAVE STATUS` não são representados nas tabelas.

#### Ciclo de Vida da Tabela de Replicação

O Schema de Desempenho preenche as tabelas de replicação da seguinte forma:

* Antes da execução de `CHANGE MASTER TO`, as tabelas estão vazias.

* Após `CHANGE MASTER TO`, os parâmetros de configuração podem ser vistos nas tabelas. Neste momento, não há threads de replica ativa, portanto, as colunas `THREAD_ID` são `NULL` e as colunas `SERVICE_STATE` têm um valor de `OFF`.

* Após `START SLAVE`, os valores não `NULL` `THREAD_ID` podem ser vistos. Os threads que estão ociosos ou ativos têm um valor de `SERVICE_STATE` de `ON`. O thread que se conecta à fonte tem um valor de `CONNECTING` enquanto estabelece a conexão, e `ON` posteriormente, enquanto a conexão durar.

* Após `STOP SLAVE`, as colunas `THREAD_ID` se tornam `NULL` e as colunas `SERVICE_STATE` para os threads que não existem mais têm um valor de `OFF`.

* As tabelas são preservadas após `STOP SLAVE` ou quando os threads morrem devido a um erro.

* A tabela `replication_applier_status_by_worker` não está vazia apenas quando a replica está operando no modo multithread. Isso significa que, se a variável de sistema `START SLAVE` for maior que 0, esta tabela é preenchida quando `START SLAVE` é executada, e o número de strings mostra o número de trabalhadores.

#### `SHOW SLAVE STATUS` Informações não nas tabelas de replicação

As informações nas tabelas de replicação do Schema de Desempenho diferem um pouco das informações disponíveis em `SHOW SLAVE STATUS`, pois as tabelas são orientadas para o uso de identificadores de transação global (GTIDs), não de nomes e posições de arquivos, e elas representam valores de UUID do servidor, não de valores de ID do servidor. Devido a essas diferenças, várias colunas de `SHOW SLAVE STATUS` não são preservadas nas tabelas de replicação do Schema de Desempenho, ou são representadas de uma maneira diferente:

* Os campos a seguir se referem a nomes de arquivos e posições e não são preservados:

  ```sql
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

* O campo `Master_Info_File` não é preservado. Ele se refere ao arquivo `master.info`, que foi substituído por tabelas seguras em caso de falha.

* Os campos a seguir são baseados em `server_id`, não em `server_uuid`, e não são preservados:

  ```sql
  Master_Server_Id
  Replicate_Ignore_Server_Ids
  ```

* O campo `Skip_Counter` é baseado em contagem de eventos, não em GTIDs, e não é preservado.

* Esses campos de erro são sinônimos de `Last_SQL_Errno` e `Last_SQL_Error`, portanto, eles não são preservados:

  ```sql
  Last_Errno
  Last_Error
  ```

No Schema de Desempenho, essas informações de erro estão disponíveis nas colunas `LAST_ERROR_NUMBER` e `LAST_ERROR_MESSAGE` da tabela `replication_applier_status_by_worker` (e `replication_applier_status_by_coordinator` se a replica for multithread). Essas tabelas fornecem informações de erro mais específicas por thread do que as disponíveis em `Last_Errno` e `Last_Error`.

* Os campos que fornecem informações sobre as opções de filtragem de string de comando não são preservados:

  ```sql
  Replicate_Do_DB
  Replicate_Ignore_DB
  Replicate_Do_Table
  Replicate_Ignore_Table
  Replicate_Wild_Do_Table
  Replicate_Wild_Ignore_Table
  ```

* Os campos `Slave_IO_State` e `Slave_SQL_Running_State` não são preservados. Se necessário, esses valores podem ser obtidos da lista de processos usando a coluna `THREAD_ID` da tabela de replicação apropriada e combinando-a com a coluna `ID` na tabela `INFORMATION_SCHEMA` `PROCESSLIST` para selecionar a coluna `STATE` da última tabela.

* O campo `Executed_Gtid_Set` pode exibir um grande conjunto com uma grande quantidade de texto. Em vez disso, as tabelas do Schema de Desempenho mostram GTIDs de transações que estão atualmente sendo aplicadas pela replica. Alternativamente, o conjunto de GTIDs executados pode ser obtido pelo valor da variável de sistema `gtid_executed`.

* Os campos `Seconds_Behind_Master` e `Relay_Log_Space` estão em status a ser decidido e não são preservados.

#### Variáveis de status movidas para tabelas de replicação

A partir da versão 5.7.5 do MySQL, as seguintes variáveis de status (anteriormente monitoradas usando `SHOW STATUS`) foram movidas para as tabelas de replicação do Schema de Desempenho:

* `Slave_retried_transactions`
* `Slave_last_heartbeat`
* `Slave_received_heartbeats`
* `Slave_heartbeat_period`
* `Slave_running`

Essas variáveis de status são agora relevantes apenas quando um único canal de replicação está sendo usado, porque elas *apresentam* apenas o status do canal de replicação padrão. Quando existem vários canais de replicação, use as tabelas de replicação do Schema de desempenho descritas nesta seção, que apresentam essas variáveis para cada canal de replicação existente.

#### Canais de Replicação

A primeira coluna das tabelas do Schema de desempenho de replicação é `CHANNEL_NAME`. Isso permite que as tabelas sejam visualizadas por canal de replicação. Em uma configuração de replicação não multifonte, há um único canal de replicação padrão. Quando você está usando vários canais de replicação em uma réplica, você pode filtrar as tabelas por canal de replicação para monitorar um canal de replicação específico. Consulte a Seção 16.2.2, “Canais de replicação”, e a Seção 16.1.5.8, “Monitoramento de replicação multifonte”, para obter mais informações.

#### 25.12.11.1 A tabela de configuração de conexão de replicação

Esta tabela mostra os parâmetros de configuração usados pela replica para se conectar à fonte. Os parâmetros armazenados na tabela podem ser alterados em tempo real com a declaração `CHANGE MASTER TO`, conforme indicado nas descrições das colunas.

Comparado à tabela `replication_connection_status`, a tabela `replication_connection_configuration` muda com menos frequência. Ela contém valores que definem como a replica se conecta à fonte e que permanecem constantes durante a conexão, enquanto que a tabela `replication_connection_status` contém valores que mudam durante a conexão.

A tabela `replication_connection_configuration` tem as seguintes colunas. As descrições das colunas indicam as opções correspondentes `CHANGE MASTER TO` das quais os valores das colunas são tomados, e a tabela dada mais tarde nesta seção mostra a correspondência entre as colunas `replication_connection_configuration` e as colunas `SHOW SLAVE STATUS`.

* `CHANNEL_NAME`

O canal de replicação que esta string está exibindo. Sempre há um canal de replicação padrão, e mais canais de replicação podem ser adicionados. Consulte a Seção 16.2.2, “Canais de Replicação”, para mais informações. (Opção `CHANGE MASTER TO`: `FOR CHANNEL`)

* `HOST`

O servidor de origem de replicação ao qual a réplica está conectada. (Opção `CHANGE MASTER TO`: `MASTER_HOST`)

* `PORT`

O porto usado para se conectar ao servidor de origem de replicação. (Opção `CHANGE MASTER TO`: `MASTER_PORT`)

* `USER`

O nome de usuário da conta usada para se conectar ao servidor de origem de replicação. (Opção `CHANGE MASTER TO`: `MASTER_USER`)

* `NETWORK_INTERFACE`

A interface de rede à qual a réplica está vinculada, se houver. (Opção `CHANGE MASTER TO`: `MASTER_BIND`)

* `AUTO_POSITION`

1 se o autoposicionamento estiver em uso; caso contrário, 0. (Opção `CHANGE MASTER TO` (`MASTER_AUTO_POSITION`):)

* `SSL_ALLOWED`, `SSL_CA_FILE`, `SSL_CA_PATH`, `SSL_CERTIFICATE`, `SSL_CIPHER`, `SSL_KEY`, `SSL_VERIFY_SERVER_CERTIFICATE`, `SSL_CRL_FILE`, `SSL_CRL_PATH`

Essas colunas mostram os parâmetros SSL usados pela replica para se conectar ao servidor de origem de replicação, se houver.

`SSL_ALLOWED` tem esses valores:

+ `Yes` se uma conexão SSL com a fonte for permitida

+ `No` se uma conexão SSL com a fonte não for permitida

+ `Ignored` se uma conexão SSL for permitida, mas a replica não tiver o suporte SSL habilitado

Opções para as outras colunas do SSL: `MASTER_SSL_CA`, `MASTER_SSL_CAPATH`, `MASTER_SSL_CERT`, `MASTER_SSL_CIPHER`, `MASTER_SSL_CRL`, `MASTER_SSL_CRLPATH`, `MASTER_SSL_KEY`, `MASTER_SSL_VERIFY_SERVER_CERT`.

* `CONNECTION_RETRY_INTERVAL`

O número de segundos entre as tentativas de reconexão. (Opção `CHANGE MASTER TO`: `MASTER_CONNECT_RETRY`)

* `CONNECTION_RETRY_COUNT`

O número de vezes que a réplica pode tentar se reconectar à fonte em caso de perda de conexão. (Opção `CHANGE MASTER TO`: `MASTER_RETRY_COUNT`)

* `HEARTBEAT_INTERVAL`

O intervalo de batida de replicação em uma replica, medido em segundos. (Opção `CHANGE MASTER TO`: `MASTER_HEARTBEAT_PERIOD`)

* `TLS_VERSION`

A versão TLS utilizada na fonte. Para informações sobre a versão TLS, consulte a Seção 6.3.2, “Protocolos e cifras de conexão criptografada TLS” (`CHANGE MASTER TO` opção: `MASTER_TLS_VERSION`).

Esta coluna foi adicionada no MySQL 5.7.10.

`TRUNCATE TABLE` não é permitido para a tabela `replication_connection_configuration`.

A tabela a seguir mostra a correspondência entre as colunas `replication_connection_configuration` e as colunas `SHOW SLAVE STATUS`.

<table summary="Correspondence between replication_connection_configuration columns and SHOW SLAVE STATUS columns"><col style="width: 60%"/><col style="width: 40%"/><thead><tr> <th><code>replication_connection_configuration</code> Column</th> <th><code>SHOW SLAVE STATUS</code> Column</th> </tr></thead><tbody><tr> <td><code>CHANNEL_NAME</code></td> <td><code>Channel_name</code></td> </tr><tr> <td><code>HOST</code></td> <td><code>Master_Host</code></td> </tr><tr> <td><code>PORT</code></td> <td><code>Master_Port</code></td> </tr><tr> <td><code>USER</code></td> <td><code>Master_User</code></td> </tr><tr> <td><code>NETWORK_INTERFACE</code></td> <td><code>Master_Bind</code></td> </tr><tr> <td><code>AUTO_POSITION</code></td> <td><code>Auto_Position</code></td> </tr><tr> <td><code>SSL_ALLOWED</code></td> <td><code>Master_SSL_Allowed</code></td> </tr><tr> <td><code>SSL_CA_FILE</code></td> <td><code>Master_SSL_CA_File</code></td> </tr><tr> <td><code>SSL_CA_PATH</code></td> <td><code>Master_SSL_CA_Path</code></td> </tr><tr> <td><code>SSL_CERTIFICATE</code></td> <td><code>Master_SSL_Cert</code></td> </tr><tr> <td><code>SSL_CIPHER</code></td> <td><code>Master_SSL_Cipher</code></td> </tr><tr> <td><code>SSL_KEY</code></td> <td><code>Master_SSL_Key</code></td> </tr><tr> <td><code>SSL_VERIFY_SERVER_CERTIFICATE</code></td> <td><code>Master_SSL_Verify_Server_Cert</code></td> </tr><tr> <td><code>SSL_CRL_FILE</code></td> <td><code>Master_SSL_Crl</code></td> </tr><tr> <td><code>SSL_CRL_PATH</code></td> <td><code>Master_SSL_Crlpath</code></td> </tr><tr> <td><code>CONNECTION_RETRY_INTERVAL</code></td> <td><code>Connect_Retry</code></td> </tr><tr> <td><code>CONNECTION_RETRY_COUNT</code></td> <td><code>Master_Retry_Count</code></td> </tr><tr> <td><code>HEARTBEAT_INTERVAL</code></td> <td>None</td> </tr><tr> <td><code>TLS_VERSION</code></td> <td><code>Master_TLS_Version</code></td> </tr></tbody></table>

#### 25.12.11.2 A tabela de estado de conexão de replicação

Esta tabela mostra o status atual da thread de I/O de replicação que lida com a conexão da réplica com a fonte.

Comparado à tabela `replication_connection_configuration`, a tabela `replication_connection_status` muda com mais frequência. Ela contém valores que mudam durante a conexão, enquanto a tabela `replication_connection_configuration` contém valores que definem como a replica se conecta à fonte e que permanecem constantes durante a conexão.

A tabela `replication_connection_status` tem essas colunas:

* `CHANNEL_NAME`

O canal de replicação que esta string está exibindo. Sempre há um canal de replicação padrão, e mais canais de replicação podem ser adicionados. Consulte a Seção 16.2.2, “Canais de replicação”, para obter mais informações.

* `GROUP_NAME`

Se este servidor é membro de um grupo, mostra o nome do grupo ao qual o servidor pertence.

* `SOURCE_UUID`

O valor `server_uuid` da fonte.

* `THREAD_ID`

O ID do thread de E/S.

* `SERVICE_STATE`

`ON` (o thread existe e está ativo ou em espera), `OFF` (o thread não existe mais) ou `CONNECTING` (o thread existe e está se conectando à fonte).

* `RECEIVED_TRANSACTION_SET`

O conjunto de IDs de transação global (GTIDs) correspondentes a todas as transações recebidas por esta réplica. Vazio se os GTIDs não estiverem em uso. Consulte Conjuntos de GTIDs para obter mais informações.

* `LAST_ERROR_NUMBER`, `LAST_ERROR_MESSAGE`

O número do erro e a mensagem de erro do erro mais recente que fez com que o thread de I/O parasse. Um número de erro de 0 e uma mensagem de string vazia significam “sem erro”. Se o valor `LAST_ERROR_MESSAGE` não estiver vazio, os valores de erro também aparecem no log de erro da replica.

A emissão de `RESET MASTER` ou `RESET SLAVE` redefinirá os valores mostrados nessas colunas.

* `LAST_ERROR_TIMESTAMP`

Um marcador de tempo no formato *`YYMMDD hh:mm:ss`* que mostra quando ocorreu a última falha de E/S.

* `LAST_HEARTBEAT_TIMESTAMP`

Um marcador de tempo no formato *`YYMMDD hh:mm:ss`* que mostra quando o sinal mais recente do batimento cardíaco foi recebido por uma réplica.

* `COUNT_RECEIVED_HEARTBEATS`

O número total de sinais de batimento cardíaco que uma réplica recebeu desde a última vez que foi reiniciado ou um comunicado `CHANGE MASTER TO` foi emitido.

`TRUNCATE TABLE` não é permitido para a tabela `replication_connection_status`.

A tabela a seguir mostra a correspondência entre as colunas `replication_connection_status` e as colunas `SHOW SLAVE STATUS`.

<table summary="Correspondence between replication_connection_status columns and SHOW SLAVE STATUS columns"><col style="width: 60%"/><col style="width: 40%"/><thead><tr> <th><code>replication_connection_status</code> Column</th> <th><code>SHOW SLAVE STATUS</code> Column</th> </tr></thead><tbody><tr> <td><code>SOURCE_UUID</code></td> <td><code>Master_UUID</code></td> </tr><tr> <td><code>THREAD_ID</code></td> <td>None</td> </tr><tr> <td><code>SERVICE_STATE</code></td> <td><code>Slave_IO_Running</code></td> </tr><tr> <td><code>RECEIVED_TRANSACTION_SET</code></td> <td><code>Retrieved_Gtid_Set</code></td> </tr><tr> <td><code>LAST_ERROR_NUMBER</code></td> <td><code>Last_IO_Errno</code></td> </tr><tr> <td><code>LAST_ERROR_MESSAGE</code></td> <td><code>Last_IO_Error</code></td> </tr><tr> <td><code>LAST_ERROR_TIMESTAMP</code></td> <td><code>Last_IO_Error_Timestamp</code></td> </tr></tbody></table>

#### 25.12.11.3 A tabela de configuração do aplicável_de_replicação

Esta tabela mostra os parâmetros de configuração que afetam as transações aplicadas pela replica. Os parâmetros armazenados na tabela podem ser alterados em tempo real com a declaração `CHANGE MASTER TO`, conforme indicado nas descrições das colunas.

A tabela `replication_applier_configuration` tem essas colunas:

* `CHANNEL_NAME`

O canal de replicação que esta string está exibindo. Sempre há um canal de replicação padrão, e mais canais de replicação podem ser adicionados. Consulte a Seção 16.2.2, “Canais de replicação”, para obter mais informações.

* `DESIRED_DELAY`

O número de segundos que a réplica deve ficar em atraso em relação à fonte. (Opção `CHANGE MASTER TO`: `MASTER_DELAY`)

`TRUNCATE TABLE` não é permitido para a tabela `replication_applier_configuration`.

A tabela a seguir mostra a correspondência entre as colunas `replication_applier_configuration` e as colunas `SHOW SLAVE STATUS`.

<table summary="Correspondence between replication_applier_configuration columns and SHOW SLAVE STATUS columns"><col style="width: 60%"/><col style="width: 40%"/><thead><tr> <th><code>replication_applier_configuration</code> Column</th> <th><code>SHOW SLAVE STATUS</code>Coluna</th> </tr></thead><tbody><tr> <td><code>DESIRED_DELAY</code></td> <td><code>SQL_Delay</code></td> </tr></tbody></table>

#### 25.12.11.4 A tabela de replicação_applier_status

Esta tabela mostra o status atual da execução de transações gerais na replica. A tabela fornece informações sobre aspectos gerais do status do aplicador de transações que não são específicos a qualquer thread envolvido. Informações de status específicas para cada thread estão disponíveis na tabela `replication_applier_status_by_coordinator` (e `replication_applier_status_by_worker` se a replica for multifilamentar).

A tabela `replication_applier_status` tem essas colunas:

* `CHANNEL_NAME`

O canal de replicação que esta string está exibindo. Sempre há um canal de replicação padrão, e mais canais de replicação podem ser adicionados. Consulte a Seção 16.2.2, “Canais de replicação”, para obter mais informações.

* `SERVICE_STATE`

Mostra `ON` quando os threads do aplicador do canal de replicação estão ativos ou em repouso; `OFF` significa que os threads do aplicador não estão ativos.

* `REMAINING_DELAY`

Se a réplica estiver esperando que `DESIRED_DELAY` segundos tenham passado desde que a fonte aplicou um evento, este campo contém o número de segundos de atraso restantes. Em outros momentos, este campo é `NULL`. (O valor `DESIRED_DELAY` é armazenado na tabela `replication_applier_configuration`.

* `COUNT_TRANSACTIONS_RETRIES`

Mostra o número de tentativas que foram feitas, pois o thread de replicação SQL não conseguiu aplicar uma transação. O número máximo de tentativas para uma transação específica é definido pela variável de sistema `slave_transaction_retries`.

`TRUNCATE TABLE` não é permitido para a tabela `replication_applier_status`.

A tabela a seguir mostra a correspondência entre as colunas `replication_applier_status` e as colunas `SHOW SLAVE STATUS`.

<table summary="Correspondence between replication_applier_status columns and SHOW SLAVE STATUS columns"><col style="width: 60%"/><col style="width: 40%"/><thead><tr> <th><code>replication_applier_status</code> Column</th> <th><code>SHOW SLAVE STATUS</code> Column</th> </tr></thead><tbody><tr> <td><code>SERVICE_STATE</code></td> <td>None</td> </tr><tr> <td><code>REMAINING_DELAY</code></td> <td><code>SQL_Remaining_Delay</code></td> </tr></tbody></table>

#### 25.12.11.5 A tabela replic_applier_status_by_coordinator

Para uma replica multithread, a replica utiliza vários threads de trabalho e um thread de coordenador para gerenciá-los, e esta tabela mostra o status do thread de coordenador. Para uma replica de único thread, esta tabela está vazia. Para uma replica multithread, a tabela `replication_applier_status_by_worker` mostra o status dos threads de trabalho.

A tabela `replication_applier_status_by_coordinator` tem essas colunas:

* `CHANNEL_NAME`

O canal de replicação que esta string está exibindo. Sempre há um canal de replicação padrão, e mais canais de replicação podem ser adicionados. Consulte a Seção 16.2.2, “Canais de replicação”, para obter mais informações.

* `THREAD_ID`

O ID do thread do SQL/coordenador.

* `SERVICE_STATE`

`ON` (o thread existe e está ativo ou em repouso) ou `OFF` (o thread não existe mais).

* `LAST_ERROR_NUMBER`, `LAST_ERROR_MESSAGE`

O número do erro e a mensagem de erro do erro mais recente que causou o término do thread do SQL/coordenador. Um número de erro de 0 e uma mensagem que é uma string vazia significa “sem erro”. Se o valor `LAST_ERROR_MESSAGE` não estiver vazio, os valores dos erros também aparecem no log de erro da replica.

A emissão de `RESET MASTER` ou `RESET SLAVE` redefinirá os valores mostrados nessas colunas.

Todos os códigos e mensagens de erro exibidos nas colunas `LAST_ERROR_NUMBER` e `LAST_ERROR_MESSAGE` correspondem aos valores de erro listados na Referência de Mensagem de Erro do Servidor.

* `LAST_ERROR_TIMESTAMP`

Um marcador de tempo no formato *`YYMMDD hh:mm:ss`* que mostra quando ocorreu o erro mais recente do SQL/coordenador.

`TRUNCATE TABLE` não é permitido para a tabela `replication_applier_status_by_coordinator`.

A tabela a seguir mostra a correspondência entre as colunas `replication_applier_status_by_coordinator` e as colunas `SHOW SLAVE STATUS`.

<table summary="Correspondence between replication_applier_status_by_coordinator columns and SHOW SLAVE STATUS columns"><col style="width: 60%"/><col style="width: 40%"/><thead><tr> <th><code>replication_applier_status_by_coordinator</code> Column</th> <th><code>SHOW SLAVE STATUS</code> Column</th> </tr></thead><tbody><tr> <td><code>THREAD_ID</code></td> <td>None</td> </tr><tr> <td><code>SERVICE_STATE</code></td> <td><code>Slave_SQL_Running</code></td> </tr><tr> <td><code>LAST_ERROR_NUMBER</code></td> <td><code>Last_SQL_Errno</code></td> </tr><tr> <td><code>LAST_ERROR_MESSAGE</code></td> <td><code>Last_SQL_Error</code></td> </tr><tr> <td><code>LAST_ERROR_TIMESTAMP</code></td> <td><code>Last_SQL_Error_Timestamp</code></td> </tr></tbody></table>

#### 25.12.11.6 A tabela replic_applier_status_by_worker

Se a replica não for multithreading, esta tabela mostra o status do thread do aplicável. Caso contrário, a replica usa vários threads de trabalho e um thread de coordenador para gerenciá-los, e esta tabela mostra o status dos threads de trabalho. Para uma replica multithreading, a tabela `replication_applier_status_by_coordinator` mostra o status do thread de coordenador.

A tabela `replication_applier_status_by_worker` tem essas colunas:

* `CHANNEL_NAME`

O canal de replicação que esta string está exibindo. Sempre há um canal de replicação padrão, e mais canais de replicação podem ser adicionados. Consulte a Seção 16.2.2, “Canais de replicação”, para obter mais informações.

* `WORKER_ID`

O identificador do trabalhador (mesmo valor que a coluna `id` na tabela `mysql.slave_worker_info`). Após `STOP SLAVE`, a coluna `THREAD_ID` se torna `NULL`, mas o valor `WORKER_ID` é preservado.

* `THREAD_ID`

O identificador do thread do trabalhador.

* `SERVICE_STATE`

`ON` (o thread existe e está ativo ou em repouso) ou `OFF` (o thread não existe mais).

* `LAST_SEEN_TRANSACTION`

A transação que o trabalhador viu pela última vez. O trabalhador não necessariamente aplicou essa transação porque ainda poderia estar em processo de fazê-lo.

Se o valor da variável de sistema `gtid_mode` for `OFF`, esta coluna é `ANONYMOUS`, indicando que as transações não possuem identificadores de transação global (GTIDs) e são identificadas apenas por arquivo e posição.

Se `gtid_mode` for `ON`, o valor da coluna é definido da seguinte forma:

+ Se nenhuma transação tiver sido executada, a coluna está vazia.  + Quando uma transação é executada, a coluna é definida a partir de `gtid_next` assim que `gtid_next` é definido. A partir deste momento, a coluna sempre exibe um GTID.

+ O GTID é preservado até que a próxima transação seja executada. Se ocorrer um erro, o valor da coluna é o GTID da transação que está sendo executada pelo trabalhador quando o erro ocorreu. A seguinte declaração mostra se essa transação foi ou não comprometida:

    ```sql
    SELECT GTID_SUBSET(LAST_SEEN_TRANSACTION, @@GLOBAL.GTID_EXECUTED)
    FROM performance_schema.replication_applier_status_by_worker;
    ```

Se a declaração retornar zero, a transação ainda não foi comprometida, porque ainda está sendo processada ou porque o thread do trabalhador foi interrompido enquanto estava sendo processado. Se a declaração retornar um valor não nulo, a transação foi comprometida.

* `LAST_ERROR_NUMBER`, `LAST_ERROR_MESSAGE`

O número do erro e a mensagem de erro do erro mais recente que fez o thread do trabalhador parar. Um número de erro de 0 e uma mensagem de string vazia significam “sem erro”. Se o valor `LAST_ERROR_MESSAGE` não estiver vazio, os valores de erro também aparecem no log de erro da replica.

A emissão de `RESET MASTER` ou `RESET SLAVE` redefinirá os valores mostrados nessas colunas.

Todos os códigos e mensagens de erro exibidos nas colunas `LAST_ERROR_NUMBER` e `LAST_ERROR_MESSAGE` correspondem aos valores de erro listados na Referência de Mensagem de Erro do Servidor.

* `LAST_ERROR_TIMESTAMP`

Um marcador de tempo no formato *`YYMMDD hh:mm:ss`* que mostra quando ocorreu o erro mais recente do trabalhador.

`TRUNCATE TABLE` não é permitido para a tabela `replication_applier_status_by_worker`.

A tabela a seguir mostra a correspondência entre as colunas `replication_applier_status_by_worker` e as colunas `SHOW SLAVE STATUS`.

<table summary="Correspondence between replication_applier_status_by_worker columns and SHOW SLAVE STATUS columns"><col style="width: 60%"/><col style="width: 40%"/><thead><tr> <th><code>replication_applier_status_by_worker</code> Column</th> <th><code>SHOW SLAVE STATUS</code> Column</th> </tr></thead><tbody><tr> <td><code>WORKER_ID</code></td> <td>None</td> </tr><tr> <td><code>THREAD_ID</code></td> <td>None</td> </tr><tr> <td><code>SERVICE_STATE</code></td> <td>None</td> </tr><tr> <td><code>LAST_SEEN_TRANSACTION</code></td> <td>None</td> </tr><tr> <td><code>LAST_ERROR_NUMBER</code></td> <td><code>Last_SQL_Errno</code></td> </tr><tr> <td><code>LAST_ERROR_MESSAGE</code></td> <td><code>Last_SQL_Error</code></td> </tr><tr> <td><code>LAST_ERROR_TIMESTAMP</code></td> <td><code>Last_SQL_Error_Timestamp</code></td> </tr></tbody></table>

#### 25.12.11.7 A tabela `replicação_grupo_membro_estatísticas`

Esta tabela mostra informações estatísticas para membros da Replicação de grupo do MySQL. Ela é preenchida apenas quando a Replicação de grupo está em execução.

A tabela `replication_group_member_stats` tem essas colunas:

* `CHANNEL_NAME`

Nome do canal de replicação do grupo.

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

Número de strings de transação que podem ser usadas para certificação, mas que não foram coletadas como lixo. Pode ser pensado como o tamanho atual do banco de dados de detecção de conflitos contra o qual cada transação é certificada.

* `TRANSACTIONS_COMMITTED_ALL_MEMBERS`

As transações que foram comprometidas com sucesso em todos os membros do grupo de replicação, mostradas como Conjuntos GTID. Isso é atualizado em um intervalo de tempo fixo.

* `LAST_CONFLICT_FREE_TRANSACTION`

O identificador de transação da última transação livre de conflitos que foi verificada.

`TRUNCATE TABLE` não é permitido para a tabela `replication_group_member_stats`.

#### 25.12.11.8 A tabela membros_grupo_replicação

Esta tabela mostra informações de rede e status dos membros do grupo de replicação. Os endereços de rede mostrados são os endereços usados para conectar os clientes ao grupo e não devem ser confundidos com o endereço interno de comunicação do grupo do membro especificado por `group_replication_local_address`.

A tabela `replication_group_members` tem essas colunas:

* `CHANNEL_NAME`

Nome do canal de replicação do grupo.

* `MEMBER_ID`

Identificador para este membro; o mesmo que o UUID do servidor.

* `MEMBER_HOST`

Endereço de rede deste membro (nome de host ou endereço IP). Retirado da variável `hostname` do membro.

* `MEMBER_PORT`

Porto em que o servidor está ouvindo. Retirado da variável `port` do membro.

* `MEMBER_STATE`

Estado atual deste membro; pode ser qualquer um dos seguintes:

+ `OFFLINE`: O plugin de replicação do grupo está instalado, mas não foi iniciado.

+ `RECOVERING`: O servidor se juntou a um grupo do qual está obtendo dados.

+ `ONLINE`: O membro está em estado totalmente funcional.

+ `ERROR`: O membro encontrou um erro, seja durante a aplicação de transações ou durante a fase de recuperação, e não está participando das transações do grupo.

+ `UNREACHABLE`: O processo de detecção de falha suspeita que este membro não pode ser contatado, porque as mensagens do grupo expiraram.

`TRUNCATE TABLE` não é permitido para a tabela `replication_group_members`.

### 25.12.12 Tabelas de bloqueio do Schema de desempenho

O Schema de Desempenho expõe informações de bloqueio através dessas tabelas:

* `metadata_locks`: Lâminas de bloqueio de metadados mantidas e solicitadas

* `table_handles`: Chaves de mesa mantidas e solicitadas

As seções a seguir descrevem essas tabelas com mais detalhes.

#### 25.12.12.1 A tabela de metadados_locks

O MySQL utiliza o bloqueio de metadados para gerenciar o acesso concorrente a objetos do banco de dados e garantir a consistência dos dados; veja a Seção 8.11.4, “Bloqueio de Metadados”. O bloqueio de metadados não se aplica apenas a tabelas, mas também a esquemas, programas armazenados (procedimentos, funções, gatilhos, eventos agendados), espaços de tabela, bloqueios de usuário adquiridos com a função `GET_LOCK()` (veja a Seção 12.14, “Funções de Bloqueio”) e bloqueios adquiridos com o serviço de bloqueio descrito na Seção 5.5.6.1, “O Serviço de Bloqueio”.

O Schema de Desempenho expõe informações de bloqueio de metadados através da tabela `metadata_locks`:

* Lâminas que foram concedidas (mostra quais sessões possuem quais trancas de metadados atuais).

* Lâminas que foram solicitadas, mas ainda não concedidas (mostra quais sessões estão esperando por quais lâminas de metadados).

* Bloqueios que foram eliminados pelo detector de travamento.

* Bloqueios que expiraram e estão aguardando que a solicitação de bloqueio da sessão solicitante seja descartada.

Essa informação permite que você entenda as dependências de bloqueio de metadados entre as sessões. Você pode ver não apenas qual bloqueio uma sessão está esperando, mas também qual sessão atualmente detém esse bloqueio.

A tabela `metadata_locks` é somente de leitura e não pode ser atualizada. Ela é dimensionada automaticamente por padrão; para configurar o tamanho da tabela, defina a variável de sistema `performance_schema_max_metadata_locks` na inicialização do servidor.

A instrumentação de bloqueio de metadados utiliza o instrumento `wait/lock/metadata/sql/mdl`, que é desativado por padrão.

Para controlar o estado de instrumentação de bloqueio de metadados no início do servidor, use strings como essas no seu arquivo `my.cnf`:

* Habilitar:

  ```sql
  [mysqld]
  performance-schema-instrument='wait/lock/metadata/sql/mdl=ON'
  ```

* Desativar:

  ```sql
  [mysqld]
  performance-schema-instrument='wait/lock/metadata/sql/mdl=OFF'
  ```

Para controlar o estado de instrumentação de bloqueio de metadados no tempo de execução, atualize a tabela `setup_instruments`:

* Habilitar:

  ```sql
  UPDATE performance_schema.setup_instruments
  SET ENABLED = 'YES', TIMED = 'YES'
  WHERE NAME = 'wait/lock/metadata/sql/mdl';
  ```

* Desativar:

  ```sql
  UPDATE performance_schema.setup_instruments
  SET ENABLED = 'NO', TIMED = 'NO'
  WHERE NAME = 'wait/lock/metadata/sql/mdl';
  ```

O Schema de Desempenho mantém o conteúdo da tabela `metadata_locks` da seguinte forma, utilizando a coluna `LOCK_STATUS` para indicar o status de cada bloqueio:

* Quando uma restrição de metadados é solicitada e obtida imediatamente, uma string com um status de `GRANTED` é inserida.

* Quando uma restrição de metadados é solicitada e não obtida imediatamente, uma string com um status de `PENDING` é inserida.

* Quando uma restrição de metadados solicitada anteriormente é concedida, seu status de string é atualizado para `GRANTED`.

* Quando uma restrição de metadados é liberada, sua string é excluída.
* Quando um pedido de bloqueio pendente é cancelado pelo detector de bloqueio para quebrar um bloqueio (`ER_LOCK_DEADLOCK`), seu status de string é atualizado de `PENDING` para `VICTIM`.

* Quando um pedido de bloqueio pendente expira (`ER_LOCK_WAIT_TIMEOUT`), seu status de string é atualizado de `PENDING` para `TIMEOUT`.

* Quando a solicitação de bloqueio ou bloqueio pendente é cancelada, seu status de string é atualizado de `GRANTED` ou `PENDING` para `KILLED`.

* Os valores de status `VICTIM`, `TIMEOUT` e `KILLED` são breves e indicam que a string de bloqueio está prestes a ser excluída.

* Os valores de status `PRE_ACQUIRE_NOTIFY` e `POST_RELEASE_NOTIFY` são breves e indicam que o subsistema de bloqueio de metadados está notificando os motores de armazenamento interessados enquanto entra em operações de aquisição de bloqueio ou sai de operações de liberação de bloqueio. Esses valores de status foram adicionados no MySQL 5.7.11.

A tabela `metadata_locks` tem essas colunas:

* `OBJECT_TYPE`

O tipo de bloqueio utilizado no subsistema de bloqueio de metadados. O valor é um dos `GLOBAL`, `SCHEMA`, `TABLE`, `FUNCTION`, `PROCEDURE`, `TRIGGER` (atualmente não utilizado), `EVENT`, `COMMIT`, `USER LEVEL LOCK`, `TABLESPACE`, ou `LOCKING SERVICE`.

Um valor de `USER LEVEL LOCK` indica uma trava adquirida com `GET_LOCK()`. Um valor de `LOCKING SERVICE` indica uma trava adquirida com o serviço de bloqueio descrito na Seção 5.5.6.1, “O Serviço de Bloqueio”.

* `OBJECT_SCHEMA`

O esquema que contém o objeto.

* `OBJECT_NAME`

O nome do objeto instrumentado.

* `OBJECT_INSTANCE_BEGIN`

O endereço na memória do objeto instrumentado.

* `LOCK_TYPE`

O tipo de bloqueio do subsistema de bloqueio de metadados. O valor é um dos `INTENTION_EXCLUSIVE`, `SHARED`, `SHARED_HIGH_PRIO`, `SHARED_READ`, `SHARED_WRITE`, `SHARED_UPGRADABLE`, `SHARED_NO_WRITE`, `SHARED_NO_READ_WRITE` ou `EXCLUSIVE`.

* `LOCK_DURATION`

A duração do bloqueio do subsistema de bloqueio de metadados. O valor é um dos `STATEMENT`, `TRANSACTION` ou `EXPLICIT`. Os valores `STATEMENT` e `TRANSACTION` significam blocos que são liberados implicitamente no final da declaração ou transação, respectivamente. O valor `EXPLICIT` significa blocos que sobrevivem ao final da declaração ou transação e são liberados por ação explícita, como as blocos globais adquiridos com `FLUSH TABLES WITH READ LOCK`.

* `LOCK_STATUS`

O status do bloqueio do subsistema de bloqueio de metadados. O valor é um dos `PENDING`, `GRANTED`, `VICTIM`, `TIMEOUT`, `KILLED`, `PRE_ACQUIRE_NOTIFY` ou `POST_RELEASE_NOTIFY`. O Schema de Desempenho atribui esses valores conforme descrito anteriormente.

* `SOURCE`

O nome do arquivo fonte que contém o código instrumentado que produziu o evento e o número da string no arquivo onde a instrumentação ocorre. Isso permite que você verifique a fonte para determinar exatamente qual código está envolvido.

* `OWNER_THREAD_ID`

O thread que solicita uma bloqueio de metadados.

* `OWNER_EVENT_ID`

O evento que solicita uma bloqueio de metadados.

`TRUNCATE TABLE` não é permitido para a tabela `metadata_locks`.

#### 25.12.12.2 A tabela de manuseio de alimentos

O Schema de Desempenho expõe informações sobre bloqueio de tabela através da tabela `table_handles` para mostrar os bloqueios de tabela atualmente em vigor para cada manipulador de tabela aberto. `table_handles` relata o que é registrado pelo instrumento de bloqueio de tabela. Esta informação mostra quais manipuladores de tabela o servidor tem aberto, como eles estão bloqueados e por quais sessões.

A tabela `table_handles` é somente de leitura e não pode ser atualizada. Ela é dimensionada automaticamente por padrão; para configurar o tamanho da tabela, defina a variável de sistema `performance_schema_max_table_handles` na inicialização do servidor.

A instrumentação de bloqueio de mesa utiliza o instrumento `wait/lock/table/sql/handler`, que é habilitado por padrão.

Para controlar o estado de instrumentação de bloqueio de tabela no início do servidor, use strings como essas no seu arquivo `my.cnf`:

* Habilitar:

  ```sql
  [mysqld]
  performance-schema-instrument='wait/lock/table/sql/handler=ON'
  ```

* Desativar:

  ```sql
  [mysqld]
  performance-schema-instrument='wait/lock/table/sql/handler=OFF'
  ```

Para controlar o estado do instrumento de bloqueio de tabela no tempo de execução, atualize a tabela `setup_instruments`:

* Habilitar:

  ```sql
  UPDATE performance_schema.setup_instruments
  SET ENABLED = 'YES', TIMED = 'YES'
  WHERE NAME = 'wait/lock/table/sql/handler';
  ```

* Desativar:

  ```sql
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

O thread que possui o controle da tabela.

* `OWNER_EVENT_ID`

O evento que causou a abertura da alça da mesa.

* `INTERNAL_LOCK`

O bloqueio de tabela utilizado no nível SQL. O valor é um dos `READ`, `READ WITH SHARED LOCKS`, `READ HIGH PRIORITY`, `READ NO INSERT`, `WRITE ALLOW WRITE`, `WRITE CONCURRENT INSERT`, `WRITE LOW PRIORITY` ou `WRITE`. Para informações sobre esses tipos de bloqueio, consulte o arquivo fonte `include/thr_lock.h`.

* `EXTERNAL_LOCK`

O bloqueio de tabela utilizado no nível do motor de armazenamento. O valor é um dos `READ EXTERNAL` ou `WRITE EXTERNAL`.

`TRUNCATE TABLE` não é permitido para a tabela `table_handles`.

### 25.12.13 Tabelas de variáveis do sistema do esquema de desempenho

Nota

O valor da variável de sistema `show_compatibility_56` afeta as informações disponíveis nas tabelas descritas aqui. Para detalhes, consulte a descrição dessa variável na Seção 5.1.7, “Variáveis do sistema do servidor”.

O servidor MySQL mantém muitas variáveis de sistema que indicam como ele está configurado (veja Seção 5.1.7, “Variáveis de sistema do servidor”). As informações das variáveis de sistema estão disponíveis nessas tabelas do Gerador de desempenho:

* `global_variables`: Variáveis do sistema global. Uma aplicação que deseja apenas valores globais deve usar esta tabela.

* `session_variables`: Variáveis do sistema para a sessão atual. Uma aplicação que deseja todos os valores das variáveis do sistema para sua própria sessão deve usar esta tabela. Inclui as variáveis da sessão para sua sessão, bem como os valores das variáveis globais que não têm contraparte de sessão.

* `variables_by_thread`: Variáveis do sistema de sessão para cada sessão ativa. Uma aplicação que deseja saber os valores das variáveis de sessão para sessões específicas deve usar esta tabela. Ela inclui apenas as variáveis de sessão, identificadas pelo ID do thread.

As tabelas de variáveis de sessão (`session_variables`, `variables_by_thread`) contêm informações apenas para sessões ativas, não para sessões terminadas.

As tabelas `global_variables` e `session_variables` possuem essas colunas:

* `VARIABLE_NAME`

O nome da variável do sistema.

* `VARIABLE_VALUE`

O valor da variável do sistema. Para `global_variables`, esta coluna contém o valor global. Para `session_variables`, esta coluna contém o valor variável em vigor para a sessão atual.

A tabela `variables_by_thread` tem essas colunas:

* `THREAD_ID`

O identificador do thread da sessão na qual a variável do sistema é definida.

* `VARIABLE_NAME`

O nome da variável do sistema.

* `VARIABLE_VALUE`

O valor da variável de sessão para a sessão nomeada pela coluna `THREAD_ID`.

A tabela `variables_by_thread` contém informações de variáveis de sistema apenas sobre os threads de primeiro plano. Se nem todos os threads não forem instrumentados pelo Schema de Desempenho, esta tabela pode não incluir algumas strings. Neste caso, a variável de status `Performance_schema_thread_instances_lost` é maior que zero.

`TRUNCATE TABLE` não é suportado para as tabelas de variáveis do sistema do Performance Schema.

### 25.12.14 Tabelas de variáveis de status do esquema de desempenho

Nota

O valor da variável de sistema `show_compatibility_56` afeta as informações disponíveis nas tabelas descritas aqui. Para detalhes, consulte a descrição dessa variável na Seção 5.1.7, “Variáveis do sistema do servidor”.

O servidor MySQL mantém muitas variáveis de status que fornecem informações sobre sua operação (veja Seção 5.1.9, “Variáveis de Status do Servidor”). As informações das variáveis de status estão disponíveis nessas tabelas do Gerador de Desempenho:

* `global_status`: Variáveis de status global. Uma aplicação que deseja apenas valores globais deve usar esta tabela.

* `session_status`: Variáveis de status para a sessão atual. Uma aplicação que deseja todos os valores das variáveis de status para sua própria sessão deve usar esta tabela. Ela inclui as variáveis de sessão para sua sessão, bem como os valores das variáveis globais que não têm contraparte de sessão.

* `status_by_thread`: Variáveis de status de sessão para cada sessão ativa. Uma aplicação que deseja saber os valores das variáveis de sessão para sessões específicas deve usar esta tabela. Ela inclui apenas as variáveis de sessão, identificadas pelo ID de thread.

Há também tabelas resumidas que fornecem informações sobre variáveis de status agregadas por conta, nome de host e nome de usuário. Veja a Seção 25.12.15.10, “Tabelas Resumo de Variáveis de Status”.

As tabelas de variáveis de sessão (`session_status`, `status_by_thread`) contêm informações apenas para sessões ativas, não para sessões terminadas.

O Schema de Desempenho coleta estatísticas para variáveis de status globais apenas para os threads para os quais o valor `INSTRUMENTED` é `YES` na tabela `threads`. As estatísticas para variáveis de status de sessão são sempre coletadas, independentemente do valor `INSTRUMENTED`.

O Schema de Desempenho não coleta estatísticas para as variáveis de status `Com_xxx` nas tabelas de variáveis de status. Para obter contagens globais e por execução de declarações de sessão, use as tabelas `events_statements_summary_global_by_event_name` e `events_statements_summary_by_thread_by_event_name`, respectivamente. Por exemplo:

```sql
SELECT EVENT_NAME, COUNT_STAR
FROM performance_schema.events_statements_summary_global_by_event_name
WHERE EVENT_NAME LIKE 'statement/sql/%';
```

As tabelas `global_status` e `session_status` possuem essas colunas:

* `VARIABLE_NAME`

O nome da variável de status.

* `VARIABLE_VALUE`

O valor da variável de status. Para `global_status`, esta coluna contém o valor global. Para `session_status`, esta coluna contém o valor da variável para a sessão atual.

A tabela `status_by_thread` contém o status de cada thread ativo. Ela possui as seguintes colunas:

* `THREAD_ID`

O identificador do thread da sessão na qual a variável de status é definida.

* `VARIABLE_NAME`

O nome da variável de status.

* `VARIABLE_VALUE`

O valor da variável de sessão para a sessão nomeada pela coluna `THREAD_ID`.

A tabela `status_by_thread` contém informações sobre variáveis de status apenas sobre os threads de primeiro plano. Se a variável de sistema `performance_schema_max_thread_instances` não estiver ajustada automaticamente (indicada por um valor de −1) e o número máximo permitido de objetos de thread instrumentados não for maior que o número de threads de segundo plano, a tabela estará vazia.

O Schema de Desempenho suporta `TRUNCATE TABLE` para tabelas de variáveis de status da seguinte forma:

* `global_status`: Redefine o estado do thread, da conta, do host e do usuário. Redefine as variáveis de status globais, exceto aquelas que o servidor nunca redefine.

* `session_status`: Não é suportado.
* `status_by_thread`: Agrupa o status de todas as threads no status global e no status da conta, e, em seguida, redefine o status da thread. Se as estatísticas da conta não forem coletadas, o status da sessão é adicionado ao status do host e do usuário, se o status do host e do usuário forem coletados.

As estatísticas de conta, hospedagem e usuário não são coletadas se as variáveis de sistema `performance_schema_accounts_size`, `performance_schema_hosts_size` e `performance_schema_users_size`, respectivamente, forem definidas como 0.

`FLUSH STATUS` adiciona o status da sessão de todas as sessões ativas às variáveis de status globais, refaz o status de todas as sessões ativas e refaz os valores de status de conta, host e usuário agregados de sessões desconectadas.

### 25.12.15 Tabelas de Resumo do Schema de Desempenho

As tabelas resumidas fornecem informações agregadas para eventos terminados ao longo do tempo. As tabelas deste grupo resumem os dados dos eventos de diferentes maneiras.

Cada tabela de resumo tem colunas de agrupamento que determinam como os dados devem ser agrupados e colunas de resumo que contêm os valores agregados. Tabelas que resumem eventos de maneiras semelhantes geralmente têm conjuntos semelhantes de colunas de resumo e diferem apenas nas colunas de agrupamento usadas para determinar como os eventos são agregados.

As tabelas resumidas podem ser truncadas com `TRUNCATE TABLE`. Geralmente, o efeito é redefinir as colunas resumidas para 0 ou `NULL`, e não remover strings. Isso permite que você limpe os valores coletados e reinicie a agregação. Isso pode ser útil, por exemplo, depois de ter feito uma alteração na configuração de execução. Exceções a esse comportamento de truncação são mencionadas nas seções individuais das tabelas resumidas.

#### Resumos de eventos de espera

**Tabela 25.3 Tabelas de Resumo de Eventos de Aguarda do Schema de Desempenho**

<table frame="box" rules="all" summary="A reference that lists all Performance Schema wait event summary tables."><col style="width: 28%"/><col style="width: 71%"/><thead><tr><th>Table Name</th> <th>Descrição</th> </tr></thead><tbody><tr><td><code>events_waits_summary_by_account_by_event_name</code></td> <td>Eventos esperados por conta e nome do evento</td> </tr><tr><td><code>events_waits_summary_by_host_by_event_name</code></td> <td>Eventos esperados por nome de host e nome de evento</td> </tr><tr><td><code>events_waits_summary_by_instance</code></td> <td>Eventos de espera por instância</td> </tr><tr><td><code>events_waits_summary_by_thread_by_event_name</code></td> <td>Eventos de espera por thread e nome do evento</td> </tr><tr><td><code>events_waits_summary_by_user_by_event_name</code></td> <td>Eventos esperados por nome de usuário e nome de evento</td> </tr><tr><td><code>events_waits_summary_global_by_event_name</code></td> <td>Eventos esperados por nome de evento</td> </tr></tbody></table>

#### Resumos das etapas

**Tabela 25.4 Tabelas de Resumo de Eventos de Etapas do Schema de Desempenho**

<table frame="box" rules="all" summary="A reference that lists all Performance Schema stage event summary tables."><col style="width: 28%"/><col style="width: 71%"/><thead><tr><th>Table Name</th> <th>Descrição</th> </tr></thead><tbody><tr><td><code>events_stages_summary_by_account_by_event_name</code></td> <td>Eventos em andamento por conta e nome do evento</td> </tr><tr><td><code>events_stages_summary_by_host_by_event_name</code></td> <td>Eventos em andamento por nome do anfitrião e nome do evento</td> </tr><tr><td><code>events_stages_summary_by_thread_by_event_name</code></td> <td>Espera de palco por thread e nome de evento</td> </tr><tr><td><code>events_stages_summary_by_user_by_event_name</code></td> <td>Eventos em andamento por nome do usuário e nome do evento</td> </tr><tr><td><code>events_stages_summary_global_by_event_name</code></td> <td>Esperas de palco por nome de evento</td> </tr></tbody></table>

#### Resumos de declarações

**Tabela 25.5 Tabelas de Resumo de Eventos de Declaração do Schema de Desempenho**

<table frame="box" rules="all" summary="A reference that lists all Performance Schema statement event summary tables."><col style="width: 28%"/><col style="width: 71%"/><thead><tr><th>Table Name</th> <th>Descrição</th> </tr></thead><tbody><tr><td><code>events_statements_summary_by_account_by_event_name</code></td> <td>Eventos declarados por conta e nome de evento</td> </tr><tr><td><code>events_statements_summary_by_digest</code></td> <td>Eventos declarativos por esquema e valor de digestão</td> </tr><tr><td><code>events_statements_summary_by_host_by_event_name</code></td> <td>Eventos declarados por nome de anfitrião e nome do evento</td> </tr><tr><td><code>events_statements_summary_by_program</code></td> <td>Eventos declarados por programa armazenado</td> </tr><tr><td><code>events_statements_summary_by_thread_by_event_name</code></td> <td>Eventos declarados por thread e nome de evento</td> </tr><tr><td><code>events_statements_summary_by_user_by_event_name</code></td> <td>Eventos declarativos por nome de usuário e nome de evento</td> </tr><tr><td><code>events_statements_summary_global_by_event_name</code></td> <td>Eventos declarativos por nome de evento</td> </tr><tr><td><code>prepared_statements_instances</code></td> <td>Instâncias de declaração preparada e estatísticas</td> </tr></tbody></table>

#### Resumos de transações

**Tabela 25.6 Tabelas de Resumo de Eventos de Transação do Schema de Desempenho**

<table frame="box" rules="all" summary="A reference that lists all Performance Schema transaction event summary tables."><col style="width: 28%"/><col style="width: 71%"/><thead><tr><th>Table Name</th> <th>Descrição</th> </tr></thead><tbody><tr><td><code>events_transactions_summary_by_account_by_event_name</code></td> <td>Eventos de transação por conta e nome do evento</td> </tr><tr><td><code>events_transactions_summary_by_host_by_event_name</code></td> <td>Eventos de transação por nome de host e nome de evento</td> </tr><tr><td><code>events_transactions_summary_by_thread_by_event_name</code></td> <td>Eventos de transação por thread e nome de evento</td> </tr><tr><td><code>events_transactions_summary_by_user_by_event_name</code></td> <td>Eventos de transação por nome de usuário e nome de evento</td> </tr><tr><td><code>events_transactions_summary_global_by_event_name</code></td> <td>Eventos de transação por nome de evento</td> </tr></tbody></table>

#### Resumos de espera de objetos

**Tabela 25.7 Tabelas de Resumo de Eventos de Objeto do Schema de Desempenho**

<table frame="box" rules="all" summary="A reference that lists all Performance Schema object event summary tables."><col style="width: 28%"/><col style="width: 71%"/><thead><tr><th>Table Name</th> <th>Description</th> </tr></thead><tbody><tr><td><code>objects_summary_global_by_type</code></td> <td>Object summaries</td> </tr></tbody></table>

#### Resumos de E/S de Arquivo

**Tabela 25.8 Tabelas de Resumo de Eventos de E/S do Schema de Desempenho**

<table frame="box" rules="all" summary="A reference that lists all Performance Schema file I/O event summary tables."><col style="width: 28%"/><col style="width: 71%"/><thead><tr><th>Table Name</th> <th>Descrição</th> </tr></thead><tbody><tr><td><code>file_summary_by_event_name</code></td> <td>Filtre os eventos por nome de evento</td> </tr><tr><td><code>file_summary_by_instance</code></td> <td>Eventos por instância do arquivo</td> </tr></tbody></table>

#### Resumo de espera de entrada/saída de tabela e bloqueio

**Tabela 25.9 Tabela de desempenho Schema I/O e tabelas de resumo de eventos de espera de bloqueio**

<table frame="box" rules="all" summary="A reference that lists all Performance Schema table I/O and lock event summary tables."><col style="width: 28%"/><col style="width: 71%"/><thead><tr><th>Table Name</th> <th>Description</th> </tr></thead><tbody><tr><td><code>table_io_waits_summary_by_index_usage</code></td> <td>Table I/O waits per index</td> </tr><tr><td><code>table_io_waits_summary_by_table</code></td> <td>Table I/O waits per table</td> </tr><tr><td><code>table_lock_waits_summary_by_table</code></td> <td>Table lock waits per table</td> </tr></tbody></table>

#### Resumos de Sockets

**Tabela 25.10 Tabelas de Resumo de Eventos de Soquete do Schema de Desempenho**

<table frame="box" rules="all" summary="A reference that lists all Performance Schema socket event summary tables."><col style="width: 28%"/><col style="width: 71%"/><thead><tr><th>Table Name</th> <th>Description</th> </tr></thead><tbody><tr><td><code>socket_summary_by_event_name</code></td> <td>Socket waits and I/O per event name</td> </tr><tr><td><code>socket_summary_by_instance</code></td> <td>Socket waits and I/O per instance</td> </tr></tbody></table>

#### Resumos de Memória

**Tabela 25.11 Tabelas de Resumo de Operações de Memória do Schema de Desempenho**

<table frame="box" rules="all" summary="A reference that lists all Performance Schema memory operation summary tables."><col style="width: 28%"/><col style="width: 71%"/><thead><tr><th>Table Name</th> <th>Descrição</th> </tr></thead><tbody><tr><td><code>memory_summary_by_account_by_event_name</code></td> <td>Operações de memória por conta e nome de evento</td> </tr><tr><td><code>memory_summary_by_host_by_event_name</code></td> <td>Operações de memória por host e nome de evento</td> </tr><tr><td><code>memory_summary_by_thread_by_event_name</code></td> <td>Operações de memória por thread e nome de evento</td> </tr><tr><td><code>memory_summary_by_user_by_event_name</code></td> <td>Operações de memória por usuário e nome de evento</td> </tr><tr><td><code>memory_summary_global_by_event_name</code></td> <td>Operações de memória globalmente por nome de evento</td> </tr></tbody></table>

#### Resumos de variáveis de status

**Tabela 25.12 Tabelas de Resumo das Variáveis de Estado de Erro do Schema de Desempenho**

<table frame="box" rules="all" summary="A reference that lists all Performance Schema status variable summary tables."><col style="width: 28%"/><col style="width: 71%"/><thead><tr><th>Table Name</th> <th>Descrição</th> </tr></thead><tbody><tr><td><code>status_by_account</code></td> <td>Variáveis de status de sessão por conta</td> </tr><tr><td><code>status_by_host</code></td> <td>Variáveis de status de sessão por nome de host</td> </tr><tr><td><code>status_by_user</code></td> <td>Variáveis de status de sessão por nome de usuário</td> </tr></tbody></table>

#### 25.12.15.1 Tabelas de Resumo de Eventos de Aguardar

O Schema de Desempenho mantém tabelas para coletar eventos de espera atuais e recentes, e agrega essas informações em tabelas resumidas. A Seção 25.12.4, “Tabelas de Eventos de Espera do Schema de Desempenho”, descreve os eventos sobre os quais os resumos de espera são baseados. Consulte essa discussão para obter informações sobre o conteúdo dos eventos de espera, as tabelas de eventos de espera atuais e recentes, e como controlar a coleta de eventos de espera, que é desativada por padrão.

Exemplo de informações de resumo de evento de espera:

```sql
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

* `events_waits_summary_by_account_by_event_name` possui as colunas `EVENT_NAME`, `USER` e `HOST`. Cada string resume os eventos para uma combinação específica de conta (usuário e host) e nome do evento.

* `events_waits_summary_by_host_by_event_name` possui as colunas `EVENT_NAME` e `HOST`. Cada string resume os eventos para um determinado hospedeiro e nome de evento.

* A coluna `events_waits_summary_by_instance` possui as colunas `EVENT_NAME` e `OBJECT_INSTANCE_BEGIN`. Cada string resume os eventos para um nome de evento e objeto específicos. Se um instrumento é usado para criar múltiplas instâncias, cada instância tem um valor único `OBJECT_INSTANCE_BEGIN` e é resumida separadamente nesta tabela.

* A coluna `events_waits_summary_by_thread_by_event_name` possui as colunas `THREAD_ID` e `EVENT_NAME`. Cada string resume os eventos para um determinado thread e nome de evento.

* A coluna `events_waits_summary_by_user_by_event_name` possui as colunas `EVENT_NAME` e `USER`. Cada string resume os eventos para um usuário e um nome de evento específicos.

* `events_waits_summary_global_by_event_name` possui uma coluna `EVENT_NAME`. Cada string resume os eventos para um nome de evento específico. Um instrumento pode ser usado para criar múltiplas instâncias do objeto instrumentado. Por exemplo, se houver um instrumento para um mutex que é criado para cada conexão, há tantas instâncias quanto conexões. A string de resumo para o instrumento resume todas essas instâncias.

Cada tabela de resumo de evento de espera tem essas colunas de resumo contendo valores agregados:

* `COUNT_STAR`

O número de eventos resumidos. Esse valor inclui todos os eventos, sejam eles cronometrados ou

* `SUM_TIMER_WAIT`

O tempo total de espera dos eventos cronometrados resumidos. Esse valor é calculado apenas para eventos cronometrados, pois os eventos não cronometrados têm um tempo de espera de `NULL`. O mesmo vale para os outros valores de `xxx_TIMER_WAIT`.

* `MIN_TIMER_WAIT`

O tempo mínimo de espera dos eventos cronometrados resumidos.

* `AVG_TIMER_WAIT`

O tempo médio de espera dos eventos cronometrados resumidos.

* `MAX_TIMER_WAIT`

O tempo máximo de espera dos eventos cronometrados resumidos.

`TRUNCATE TABLE` é permitido para tabelas de resumo de espera. Tem esses efeitos:

* Para tabelas resumidas que não são agregadas por conta, host ou usuário, o truncamento redefere as colunas resumidas para zero, em vez de remover as strings.

* Para tabelas resumidas agregadas por conta, host ou usuário, o truncamento remove as strings de contas, hosts ou usuários sem conexões e redefre as colunas resumidas para zero nas strings restantes.

Além disso, cada tabela de resumo de espera que é agregada por conta, host, usuário ou thread é implicitamente truncada pela truncagem da tabela de conexão na qual ela depende, ou pela truncagem de `events_waits_summary_global_by_event_name`. Para detalhes, consulte a Seção 25.12.8, “Tabelas de Conexão do Schema de Desempenho”.

#### 25.12.15.2 Tabelas de Resumo de Etapas

O Schema de Desempenho mantém tabelas para coletar eventos de estágio atuais e recentes, e agrega essas informações em tabelas resumidas. A Seção 25.12.5, “Tabelas de Eventos de Estágio do Schema de Desempenho”, descreve os eventos sobre os quais os resumos de estágio são baseados. Consulte essa discussão para obter informações sobre o conteúdo dos eventos de estágio, as tabelas de eventos de estágio atuais e históricas, e como controlar a coleta de eventos de estágio, que é desativada por padrão.

Exemplo de informações de resumo de evento de estágio:

```sql
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

* A coluna `events_stages_summary_by_account_by_event_name` possui as colunas `EVENT_NAME`, `USER` e `HOST`. Cada string resume os eventos para uma combinação específica de conta (usuário e host) e nome do evento.

* A coluna `events_stages_summary_by_host_by_event_name` possui as colunas `EVENT_NAME` e `HOST`. Cada string resume os eventos para um determinado hospedeiro e nome de evento.

* A coluna `events_stages_summary_by_thread_by_event_name` possui as colunas `THREAD_ID` e `EVENT_NAME`. Cada string resume os eventos para um determinado thread e nome de evento.

* A coluna `events_stages_summary_by_user_by_event_name` possui as colunas `EVENT_NAME` e `USER`. Cada string resume os eventos para um usuário e um nome de evento específicos.

* `events_stages_summary_global_by_event_name` possui uma coluna `EVENT_NAME`. Cada string resume os eventos para um nome de evento específico.

Cada tabela de resumo de estágio tem essas colunas de resumo contendo valores agregados: `COUNT_STAR`, `SUM_TIMER_WAIT`, `MIN_TIMER_WAIT`, `AVG_TIMER_WAIT` e `MAX_TIMER_WAIT`. Essas colunas são análogas às colunas dos mesmos nomes nas tabelas de resumo de eventos de espera (ver Seção 25.12.15.1, “Tabelas de Resumo de Eventos de Espera”), exceto que as tabelas de resumo de estágio agregam eventos de `events_stages_current` em vez de `events_waits_current`.

`TRUNCATE TABLE` é permitido para as tabelas de resumo de estágios. Tem esses efeitos:

* Para tabelas resumidas que não são agregadas por conta, host ou usuário, o truncamento redefere as colunas resumidas para zero, em vez de remover as strings.

* Para tabelas resumidas agregadas por conta, host ou usuário, o truncamento remove as strings de contas, hosts ou usuários sem conexões e redefre as colunas resumidas para zero nas strings restantes.

Além disso, cada tabela de resumo de etapa que é agregada por conta, host, usuário ou thread é implicitamente truncada pela truncagem da tabela de conexão na qual depende, ou pela truncagem de [[`events_stages_summary_global_by_event_name`]. Para detalhes, consulte a Seção 25.12.8, “Tabelas de Conexão do Schema de Desempenho”.

#### 25.12.15.3 Tabelas de Resumo de Declarações

O Schema de Desempenho mantém tabelas para coletar eventos de declaração atuais e recentes, e agrega essas informações em tabelas resumidas. A Seção 25.12.6, “Tabelas de Eventos de Declaração do Schema de Desempenho”, descreve os eventos sobre os quais os resumos de declaração são baseados. Consulte essa discussão para obter informações sobre o conteúdo dos eventos de declaração, as tabelas de eventos de declaração atuais e históricas, e como controlar a coleta de eventos de declaração, que é parcialmente desativada por padrão.

Exemplo de resumo de informações sobre eventos de declaração:

```sql
mysql> SELECT *
       FROM performance_schema.events_statements_summary_global_by_event_name\G
*************************** 1. row ***************************
                 EVENT_NAME: statement/sql/select
                 COUNT_STAR: 25
             SUM_TIMER_WAIT: 1535983999000
             MIN_TIMER_WAIT: 209823000
             AVG_TIMER_WAIT: 61439359000
             MAX_TIMER_WAIT: 1363397650000
              SUM_LOCK_TIME: 20186000000
                 SUM_ERRORS: 0
               SUM_WARNINGS: 0
          SUM_ROWS_AFFECTED: 0
              SUM_ROWS_SENT: 388
          SUM_ROWS_EXAMINED: 370
SUM_CREATED_TMP_DISK_TABLES: 0
     SUM_CREATED_TMP_TABLES: 0
       SUM_SELECT_FULL_JOIN: 0
 SUM_SELECT_FULL_RANGE_JOIN: 0
           SUM_SELECT_RANGE: 0
     SUM_SELECT_RANGE_CHECK: 0
            SUM_SELECT_SCAN: 6
      SUM_SORT_MERGE_PASSES: 0
             SUM_SORT_RANGE: 0
              SUM_SORT_ROWS: 0
              SUM_SORT_SCAN: 0
          SUM_NO_INDEX_USED: 6
     SUM_NO_GOOD_INDEX_USED: 0
...
```

Cada tabela de resumo de declaração tem uma ou mais colunas de agrupamento para indicar como a tabela agrega eventos. Os nomes dos eventos se referem aos nomes dos instrumentos de evento na tabela `setup_instruments`:

* A coluna `events_statements_summary_by_account_by_event_name` possui as colunas `EVENT_NAME`, `USER` e `HOST`. Cada string resume os eventos para uma combinação específica de conta (usuário e host) e nome do evento.

* A coluna `events_statements_summary_by_digest` tem as colunas `SCHEMA_NAME` e `DIGEST`. Cada string resume os eventos por esquema e valor de digestão. (A coluna `DIGEST_TEXT` contém o texto correspondente do digestão de declaração normalizado, mas não é uma coluna de agrupamento nem de resumo.)

O número máximo de strings na tabela é dimensionado automaticamente no início do servidor. Para definir explicitamente esse máximo, defina a variável de sistema `performance_schema_digests_size` no início do servidor.

* A coluna `events_statements_summary_by_host_by_event_name` possui as colunas `EVENT_NAME` e `HOST`. Cada string resume os eventos para um determinado hospedeiro e nome de evento.

* A coluna `events_statements_summary_by_program` possui as colunas `OBJECT_TYPE`, `OBJECT_SCHEMA` e `OBJECT_NAME`. Cada string resume os eventos para um programa armazenado específico (procedimento ou função armazenada, gatilho ou evento).

* `events_statements_summary_by_thread_by_event_name` possui as colunas `THREAD_ID` e `EVENT_NAME`. Cada string resume os eventos para um determinado thread e nome de evento.

* A coluna `events_statements_summary_by_user_by_event_name` possui as colunas `EVENT_NAME` e `USER`. Cada string resume os eventos para um usuário e um nome de evento específicos.

* `events_statements_summary_global_by_event_name` possui uma coluna `EVENT_NAME`. Cada string resume os eventos para um nome de evento específico.

* `prepared_statements_instances` possui uma coluna `OBJECT_INSTANCE_BEGIN`. Cada string resume os eventos para uma declaração preparada específica.

Cada tabela de resumo de declaração tem essas colunas de resumo contendo valores agregados (com exceções conforme indicado):

* `COUNT_STAR`, `SUM_TIMER_WAIT`, `MIN_TIMER_WAIT`, `AVG_TIMER_WAIT`, `MAX_TIMER_WAIT`

Essas colunas são análogas às colunas dos mesmos nomes nas tabelas de resumo de eventos de espera (ver Seção 25.12.15.1, “Tabelas de Resumo de Eventos de Espera”), exceto pelo fato de que as tabelas de resumo de declarações agregam eventos de `events_statements_current` em vez de `events_waits_current`.

A tabela `prepared_statements_instances` não possui essas colunas.

* `SUM_xxx`

O agregado da coluna correspondente *`xxx`* na tabela `events_statements_current`. Por exemplo, as colunas `SUM_LOCK_TIME` e `SUM_ERRORS` nos quadros de resumo das declarações são os agregados das colunas `LOCK_TIME` e `ERRORS` na tabela `events_statements_current`.

A tabela `events_statements_summary_by_digest` tem essas colunas de resumo adicionais:

* `FIRST_SEEN`, `LAST_SEEN`

Marcadores de tempo que indicam quando as declarações com o valor de digestão dado foram vistas pela primeira vez e mais recentemente.

A tabela `events_statements_summary_by_program` tem essas colunas de resumo adicionais:

* `COUNT_STATEMENTS`, `SUM_STATEMENTS_WAIT`, `MIN_STATEMENTS_WAIT`, `AVG_STATEMENTS_WAIT`, `MAX_STATEMENTS_WAIT`

Estatísticas sobre declarações aninhadas invocadas durante a execução de programas armazenados.

A tabela `prepared_statements_instances` tem essas colunas de resumo adicionais:

* `COUNT_EXECUTE`, `SUM_TIMER_EXECUTE`, `MIN_TIMER_EXECUTE`, `AVG_TIMER_EXECUTE`, `MAX_TIMER_EXECUTE`

Estatísticas agregadas para execuções da declaração preparada.

`TRUNCATE TABLE` é permitido para tabelas de resumo de declaração. Tem esses efeitos:

* Para `events_statements_summary_by_digest`, ele remove as strings.

* Para outras tabelas resumidas que não são agregadas por conta, host ou usuário, o truncamento redefere as colunas resumidas para zero em vez de remover as strings.

* Para outras tabelas resumidas agregadas por conta, host ou usuário, o truncamento remove as strings das contas, hosts ou usuários sem conexões e redefre as colunas resumidas para zero nas strings restantes.

Além disso, cada tabela de resumo de declaração que é agregada por conta, host, usuário ou thread é implicitamente truncada pela truncagem da tabela de conexão na qual ela depende, ou pela truncagem de [[`events_statements_summary_global_by_event_name`]. Para detalhes, consulte a Seção 25.12.8, “Tabelas de Conexão do Schema de Desempenho”.

Resumo das regras de agregação de declarações #####

Se o consumidor `statements_digest` estiver habilitado, a agregação no `events_statements_summary_by_digest` ocorre da seguinte forma quando uma declaração é concluída. A agregação é baseada no valor do `DIGEST` calculado para a declaração.

* Se uma string `events_statements_summary_by_digest` já existir com o valor de digestão para a declaração que acabou de ser concluída, as estatísticas para a declaração são agregadas a essa string. A coluna `LAST_SEEN` é atualizada para a hora atual.

* Se nenhuma string tiver o valor do digest para a declaração que acabou de ser completada e a tabela não estiver cheia, uma nova string é criada para a declaração. As colunas `FIRST_SEEN` e `LAST_SEEN` são inicializadas com a hora atual.

* Se nenhuma string tiver o valor do resumo da declaração para a declaração que acabou de ser concluída e a tabela estiver cheia, as estatísticas para a declaração que acabou de ser concluída são adicionadas a uma string especial de "coleta" com `DIGEST` = `NULL`, que é criada, se necessário. Se a string for criada, as colunas `FIRST_SEEN` e `LAST_SEEN` são inicializadas com a hora atual. Caso contrário, a coluna `LAST_SEEN` é atualizada com a hora atual.

A string com `DIGEST` = `NULL` é mantida porque as tabelas do Schema de Desempenho têm um tamanho máximo devido a restrições de memória. A string `DIGEST` = `NULL` permite que os digests que não correspondem a outras strings sejam contados mesmo que a tabela de resumo esteja cheia, usando um compartimento comum de "outro". Esta string ajuda a estimar se o resumo do digest é representativo:

* Uma string `DIGEST` que tem um valor `COUNT_STAR` que representa 5% de todos os digestos mostra que a tabela de resumo dos digestos é muito representativa; as outras strings cobrem 95% das declarações observadas.

* Uma string `DIGEST` que tem um valor `COUNT_STAR` que representa 50% de todos os digestos indica que a tabela de resumo do digest não é muito representativa; as outras strings cobrem apenas metade das declarações vistas. Muito provavelmente, o DBA deve aumentar o tamanho máximo da tabela para que mais das strings contadas na string `DIGEST` = `NULL` sejam contadas usando strings mais específicas. Por padrão, a tabela é dimensionada automaticamente, mas se esse tamanho for muito pequeno, defina a variável de sistema `performance_schema_digests_size` para um valor maior na inicialização do servidor.

Comportamento do Instrumento de Programa Armazenado

Para os tipos de programas armazenados para os quais a instrumentação está habilitada na tabela `setup_objects`, `events_statements_summary_by_program` mantém estatísticas para programas armazenados da seguinte forma:

* Uma string é adicionada para um objeto quando ele é usado pela primeira vez no servidor.

* A string para um objeto é removida quando o objeto é descartado.

* As estatísticas são agregadas na string para um objeto conforme ele é executado.

Veja também a Seção 25.4.3, “Pré-filtragem de Eventos”.

#### 25.12.15.4 Tabelas de Resumo de Transações

O Schema de Desempenho mantém tabelas para coletar eventos de transação atuais e recentes, e agrega essas informações em tabelas resumidas. A Seção 25.12.7, “Tabelas de Transação do Schema de Desempenho”, descreve os eventos sobre os quais os resumos de transação são baseados. Consulte essa discussão para obter informações sobre o conteúdo dos eventos de transação, as tabelas de eventos de transação atuais e históricas, e como controlar a coleta de eventos de transação, que é desativada por padrão.

Exemplo de informações de resumo de eventos de transação:

```sql
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

* `events_transactions_summary_by_account_by_event_name` possui as colunas `USER`, `HOST` e `EVENT_NAME`. Cada string resume os eventos para uma combinação específica de conta (usuário e host) e nome de evento.

* A coluna `events_transactions_summary_by_host_by_event_name` possui as colunas `HOST` e `EVENT_NAME`. Cada string resume os eventos para um determinado hospedeiro e nome de evento.

* A coluna `events_transactions_summary_by_thread_by_event_name` possui as colunas `THREAD_ID` e `EVENT_NAME`. Cada string resume os eventos para um determinado thread e nome de evento.

* A coluna `events_transactions_summary_by_user_by_event_name` possui as colunas `USER` e `EVENT_NAME`. Cada string resume os eventos para um usuário e um nome de evento específicos.

* `events_transactions_summary_global_by_event_name` possui uma coluna `EVENT_NAME`. Cada string resume os eventos para um nome de evento específico.

Cada tabela de resumo de transação tem essas colunas de resumo contendo valores agregados:

* `COUNT_STAR`, `SUM_TIMER_WAIT`, `MIN_TIMER_WAIT`, `AVG_TIMER_WAIT`, `MAX_TIMER_WAIT`

Essas colunas são análogas às colunas dos mesmos nomes nas tabelas de resumo de eventos de espera (ver Seção 25.12.15.1, “Tabelas de Resumo de Eventos de Espera”), exceto pelo fato de que as tabelas de resumo de transações agregam eventos de `events_transactions_current` em vez de `events_waits_current`. Essas colunas resumem as transações de leitura, escrita e apenas leitura.

* `COUNT_READ_WRITE`, `SUM_TIMER_READ_WRITE`, `MIN_TIMER_READ_WRITE`, `AVG_TIMER_READ_WRITE`, `MAX_TIMER_READ_WRITE`

Esses são semelhantes às colunas `COUNT_STAR` e `xxx_TIMER_WAIT`, mas resumem apenas as transações de leitura e escrita. O modo de acesso à transação especifica se as transações operam em modo de leitura/escrita ou apenas de leitura.

* `COUNT_READ_ONLY`, `SUM_TIMER_READ_ONLY`, `MIN_TIMER_READ_ONLY`, `AVG_TIMER_READ_ONLY`, `MAX_TIMER_READ_ONLY`

Esses são semelhantes às colunas `COUNT_STAR` e `xxx_TIMER_WAIT`, mas resumem apenas as transações de leitura somente. O modo de acesso à transação especifica se as transações operam em modo de leitura/escrita ou de leitura somente.

`TRUNCATE TABLE` é permitido para tabelas de resumo de transações. Tem esses efeitos:

* Para tabelas resumidas que não são agregadas por conta, host ou usuário, o truncamento redefere as colunas resumidas para zero, em vez de remover as strings.

* Para tabelas resumidas agregadas por conta, host ou usuário, o truncamento remove as strings de contas, hosts ou usuários sem conexões e redefre as colunas resumidas para zero nas strings restantes.

Além disso, cada tabela de resumo de transação que é agregada por conta, host, usuário ou thread é implicitamente truncada pela truncagem da tabela de conexão na qual ela depende, ou pela truncagem de `events_transactions_summary_global_by_event_name`. Para detalhes, consulte a Seção 25.12.8, “Tabelas de Conexão do Schema de Desempenho”.

##### Regras de Agregação de Transações

A coleta de eventos de transação ocorre sem considerar o nível de isolamento, o modo de acesso ou o modo de autocommit.

A coleta de eventos de transação ocorre para todas as transações não aborridas iniciadas pelo servidor, incluindo as transações vazias.

As transações de leitura e escrita geralmente são mais intensivas em recursos do que as transações de leitura somente, portanto, as tabelas de resumo de transação incluem colunas agregadas separadas para transações de leitura e escrita.

Os requisitos de recursos também podem variar com o nível de isolamento de transação. No entanto, supondo que apenas um nível de isolamento seria usado por servidor, a agregação por nível de isolamento não é fornecida.

#### 25.12.15.5 Quadro de Resumo de Aguarda de Objeto

O Schema de Desempenho mantém a tabela `objects_summary_global_by_type` para agregação de eventos de espera de objetos.

Resumo das informações do evento de espera do objeto exemplo:

```sql
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

A tabela `objects_summary_global_by_type` tem essas colunas de agrupamento para indicar como a tabela agrega eventos: `OBJECT_TYPE`, `OBJECT_SCHEMA` e `OBJECT_NAME`. Cada string resume os eventos para o objeto especificado.

`objects_summary_global_by_type` tem as mesmas colunas de resumo que as tabelas `events_waits_summary_by_xxx`. Veja a Seção 25.12.15.1, “Tabelas de Resumo de Eventos de Aguardar”.

`TRUNCATE TABLE` é permitido para a tabela de resumo do objeto. Ele redefiniu as colunas de resumo para zero em vez de remover as strings.

#### 25.12.15.6 Tabelas de Resumo de E/S de Arquivo

O Schema de Desempenho mantém tabelas de resumo de I/O de arquivo que agregam informações sobre operações de I/O.

Exemplo de informações de resumo de eventos de E/S de arquivo:

```sql
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

* `file_summary_by_event_name` possui uma coluna `EVENT_NAME`. Cada string resume os eventos para um nome de evento específico.

* `file_summary_by_instance` possui as colunas `FILE_NAME`, `EVENT_NAME` e `OBJECT_INSTANCE_BEGIN`. Cada string resume os eventos para um arquivo e nome de evento específicos.

Cada tabela de resumo de I/O de arquivo tem as seguintes colunas de resumo que contêm valores agregados. Algumas colunas são mais gerais e têm valores que são iguais à soma dos valores de colunas mais detalhadas. Dessa forma, as agregações em níveis mais altos estão disponíveis diretamente, sem a necessidade de visualizações definidas pelo usuário que somarão colunas de nível mais baixo.

* `COUNT_STAR`, `SUM_TIMER_WAIT`, `MIN_TIMER_WAIT`, `AVG_TIMER_WAIT`, `MAX_TIMER_WAIT`

Essas colunas agregam todas as operações de E/S.

* `COUNT_READ`, `SUM_TIMER_READ`, `MIN_TIMER_READ`, `AVG_TIMER_READ`, `MAX_TIMER_READ`, `SUM_NUMBER_OF_BYTES_READ`

Essas colunas agregam todas as operações de leitura, incluindo `FGETS`, `FGETC`, `FREAD` e `READ`.

* `COUNT_WRITE`, `SUM_TIMER_WRITE`, `MIN_TIMER_WRITE`, `AVG_TIMER_WRITE`, `MAX_TIMER_WRITE`, `SUM_NUMBER_OF_BYTES_WRITE`

Essas colunas agregam todas as operações de escrita, incluindo `FPUTS`, `FPUTC`, `FPRINTF`, `VFPRINTF`, `FWRITE` e `PWRITE`.

* `COUNT_MISC`, `SUM_TIMER_MISC`, `MIN_TIMER_MISC`, `AVG_TIMER_MISC`, `MAX_TIMER_MISC`

Essas colunas agregam todas as outras operações de E/S, incluindo `CREATE`, `DELETE`, `OPEN`, `CLOSE`, `STREAM_OPEN`, `STREAM_CLOSE`, `SEEK`, `TELL`, `FLUSH`, `STAT`, `FSTAT`, `CHSIZE`, `RENAME` e `SYNC`. Não há contagem de bytes para essas operações.

`TRUNCATE TABLE` é permitido para tabelas de resumo de I/O de arquivo. Ele redefiniu as colunas de resumo para zero em vez de remover strings.

O servidor MySQL utiliza várias técnicas para evitar operações de E/S, armazenando informações lidas a partir de arquivos, portanto, é possível que as instruções que você espera resultar em eventos de E/S não o façam. Você pode garantir que o E/S ocorra, limpando os caches ou reiniciando o servidor para redefinir seu estado.

#### 25.12.15.7 Tabelas de Resumo de Wait de Entrada/Saída e de Bloqueio

As seções a seguir descrevem as tabelas de resumo de espera de I/O e bloqueio:

* `table_io_waits_summary_by_index_usage`: Espera de entrada/saída de tabela por índice

* `table_io_waits_summary_by_table`: Espera de entrada/saída de tabela por tabela

* `table_lock_waits_summary_by_table`: Espera de bloqueio de tabela por tabela

##### 25.12.15.7.1 tabela_io_waits_summary_by_table Tabela

A tabela `table_io_waits_summary_by_table` agrega todos os eventos de espera de I/O de tabela, conforme gerado pelo instrumento `wait/io/table/sql/handler`. O agrupamento é por tabela.

A tabela `table_io_waits_summary_by_table` tem essas colunas de agrupamento para indicar como a tabela agrega eventos: `OBJECT_TYPE`, `OBJECT_SCHEMA` e `OBJECT_NAME`. Essas colunas têm o mesmo significado que na tabela `events_waits_current`. Elas identificam a tabela à qual a string se aplica.

`table_io_waits_summary_by_table` tem as seguintes colunas de resumo que contêm valores agregados. Como indicado nas descrições das colunas, algumas colunas são mais gerais e têm valores que são os mesmos que a soma dos valores de colunas mais detalhadas. Por exemplo, as colunas que agregam todos os registros contêm a soma das colunas correspondentes que agregam inserções, atualizações e exclusões. Dessa forma, as agregações em níveis mais altos estão disponíveis diretamente, sem a necessidade de visualizações definidas pelo usuário que somaram colunas de nível mais baixo.

* `COUNT_STAR`, `SUM_TIMER_WAIT`, `MIN_TIMER_WAIT`, `AVG_TIMER_WAIT`, `MAX_TIMER_WAIT`

Essas colunas agregam todas as operações de E/S. Elas são iguais à soma das colunas correspondentes `xxx_READ` e `xxx_WRITE`.

* `COUNT_READ`, `SUM_TIMER_READ`, `MIN_TIMER_READ`, `AVG_TIMER_READ`, `MAX_TIMER_READ`

Essas colunas agregam todas as operações de leitura. Elas são iguais à soma das colunas correspondentes a `xxx_FETCH`.

* `COUNT_WRITE`, `SUM_TIMER_WRITE`, `MIN_TIMER_WRITE`, `AVG_TIMER_WRITE`, `MAX_TIMER_WRITE`

Essas colunas agregam todas as operações de escrita. Elas são iguais à soma das colunas correspondentes aos valores de `xxx_INSERT`, `xxx_UPDATE` e `xxx_DELETE`.

* `COUNT_FETCH`, `SUM_TIMER_FETCH`, `MIN_TIMER_FETCH`, `AVG_TIMER_FETCH`, `MAX_TIMER_FETCH`

Essas colunas agregam todas as operações de busca.

* `COUNT_INSERT`, `SUM_TIMER_INSERT`, `MIN_TIMER_INSERT`, `AVG_TIMER_INSERT`, `MAX_TIMER_INSERT`

Essas colunas agregam todas as operações de inserção.

* `COUNT_UPDATE`, `SUM_TIMER_UPDATE`, `MIN_TIMER_UPDATE`, `AVG_TIMER_UPDATE`, `MAX_TIMER_UPDATE`

Essas colunas agregam todas as operações de atualização.

* `COUNT_DELETE`, `SUM_TIMER_DELETE`, `MIN_TIMER_DELETE`, `AVG_TIMER_DELETE`, `MAX_TIMER_DELETE`

Essas colunas agregam todas as operações de exclusão.

`TRUNCATE TABLE` é permitido para as tabelas de resumo de entrada/saída de tabela. Ele redefiniu as colunas de resumo para zero em vez de remover strings. O truncar desta tabela também trunca a tabela `table_io_waits_summary_by_index_usage`.

##### 25.12.15.7.2 Tabela _io _ espera _ resumo _ por _ índice _ uso

A tabela `table_io_waits_summary_by_index_usage` agrega todos os eventos de espera de I/O de índice de tabela, conforme gerado pelo instrumento `wait/io/table/sql/handler`. O agrupamento é por índice de tabela.

As colunas de `table_io_waits_summary_by_index_usage` são quase idênticas a `table_io_waits_summary_by_table`. A única diferença é a coluna adicional de grupo, `INDEX_NAME`, que corresponde ao nome do índice que foi usado quando o evento de espera de I/O da tabela foi registrado:

* Um valor de `PRIMARY` indica que a tabela de E/S utilizou o índice primário.

* Um valor de `NULL` significa que a tabela de E/S não usou índice.

* Os insertos são contados contra `INDEX_NAME = NULL`.

`TRUNCATE TABLE` é permitido para as tabelas de resumo de entrada/saída de tabela. Ele redefiniu as colunas de resumo para zero em vez de remover strings. Esta tabela também é truncada pela truncagem da tabela `table_io_waits_summary_by_table`. Uma operação DDL que altera a estrutura de índice de uma tabela pode causar o reajuste das estatísticas por índice.

##### 25.12.15.7.3 Tabela_esperas_de_bloqueio_por_tabela Tabela

A tabela `table_lock_waits_summary_by_table` agrega todos os eventos de espera por bloqueio de tabela, conforme gerado pelo instrumento `wait/lock/table/sql/handler`. O agrupamento é por tabela.

Esta tabela contém informações sobre trancas internas e externas:

* Uma chave interna corresponde a uma chave na camada SQL. Isso é atualmente implementado por uma chamada a `thr_lock()`. Nas strings de evento, essas chaves são distinguidas pela coluna `OPERATION`, que tem um desses valores:

  ```sql
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

* Uma chave externa corresponde a uma chave na camada do motor de armazenamento. Isso é atualmente implementado por uma chamada a `handler::external_lock()`. Nas strings de evento, essas chaves são distinguidas pela coluna `OPERATION`, que tem um desses valores:

  ```sql
  read external
  write external
  ```

A tabela `table_lock_waits_summary_by_table` tem essas colunas de agrupamento para indicar como a tabela agrega eventos: `OBJECT_TYPE`, `OBJECT_SCHEMA` e `OBJECT_NAME`. Essas colunas têm o mesmo significado que na tabela `events_waits_current`. Elas identificam a tabela à qual a string se aplica.

`table_lock_waits_summary_by_table` tem as seguintes colunas de resumo que contêm valores agregados. Como indicado nas descrições das colunas, algumas colunas são mais gerais e têm valores que são os mesmos que a soma dos valores de colunas mais detalhadas. Por exemplo, as colunas que agregam todos os bloqueios retêm a soma das colunas correspondentes que agregam bloqueios de leitura e escrita. Dessa forma, as agregações em níveis mais altos estão disponíveis diretamente, sem a necessidade de visualizações definidas pelo usuário que somaram colunas de nível mais baixo.

* `COUNT_STAR`, `SUM_TIMER_WAIT`, `MIN_TIMER_WAIT`, `AVG_TIMER_WAIT`, `MAX_TIMER_WAIT`

Essas colunas agregam todas as operações de bloqueio. Elas são iguais à soma das colunas correspondentes `xxx_READ` e `xxx_WRITE`.

* `COUNT_READ`, `SUM_TIMER_READ`, `MIN_TIMER_READ`, `AVG_TIMER_READ`, `MAX_TIMER_READ`

Essas colunas agregam todas as operações de bloqueio de leitura. Elas são iguais à soma das colunas correspondentes aos valores de `xxx_READ_NORMAL`, `xxx_READ_WITH_SHARED_LOCKS`, `xxx_READ_HIGH_PRIORITY` e `xxx_READ_NO_INSERT`.

* `COUNT_WRITE`, `SUM_TIMER_WRITE`, `MIN_TIMER_WRITE`, `AVG_TIMER_WRITE`, `MAX_TIMER_WRITE`

Essas colunas agregam todas as operações de bloqueio de escrita. Elas são iguais à soma das colunas correspondentes a `xxx_WRITE_ALLOW_WRITE`, `xxx_WRITE_CONCURRENT_INSERT`, `xxx_WRITE_LOW_PRIORITY` e `xxx_WRITE_NORMAL`.

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

`TRUNCATE TABLE` é permitido para tabelas de resumo de bloqueio de tabela. Ele redefiniu as colunas de resumo para zero em vez de remover strings.

#### 25.12.15.8 Tabelas Resumo de Soquetes

Essas tabelas de resumo de soquetes agregam informações de temporizador e contagem de bytes para operações de soquete:

* `socket_summary_by_event_name`: Estatísticas de contagem de temporizadores agregados e bytes geradas pelos instrumentos `wait/io/socket/*` para todas as operações de E/S de soquete, por instrumento de soquete.

* `socket_summary_by_instance`: Estatísticas de contagem de temporizadores agregados e bytes geradas pelos instrumentos `wait/io/socket/*` para todas as operações de E/S de soquete, por instância de soquete. Quando uma conexão é encerrada, a string em `socket_summary_by_instance` correspondente a ela é excluída.

As tabelas de resumo de espera não agregam as esperas geradas por eventos `idle` enquanto os sockets estão aguardando a próxima solicitação do cliente. Para agregados de eventos `idle`, use as tabelas de resumo de evento de espera; veja Seção 25.12.15.1, “Tabelas de Resumo de Evento de Espera”.

Cada tabela de resumo de soquete tem uma ou mais colunas de agrupamento para indicar como a tabela agrega eventos. Os nomes dos eventos referem-se aos nomes dos instrumentos de evento na tabela `setup_instruments`:

* `socket_summary_by_event_name` possui uma coluna `EVENT_NAME`. Cada string resume os eventos para um nome de evento específico.

* `socket_summary_by_instance` possui uma coluna `OBJECT_INSTANCE_BEGIN`. Cada string resume os eventos para um objeto específico.

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

`TRUNCATE TABLE` é permitido para tabelas de resumo de soquetes. Exceto para `events_statements_summary_by_digest`, o tt refaz as colunas de resumo para zero em vez de remover strings.

#### 25.12.15.9 Tabelas Resumo de Memória

Os instrumentos do Schema de Desempenho utilizam a memória e agregam estatísticas de uso de memória, detalhados por esses fatores:

* Tipo de memória utilizada (várias caches, buffers internos, etc.)

* Thread, conta, usuário, host que indiretamente executa a operação de memória

O Schema de Desempenho instrumentaliza os seguintes aspectos do uso da memória

* tamanhos de memória utilizados * contagens de operação * marcas de água baixa e alta

Os tamanhos de memória ajudam a entender ou ajustar o consumo de memória do servidor.

As contagens de operação ajudam a entender ou ajustar a pressão geral que o servidor está exercendo sobre o alocador de memória, o que tem impacto no desempenho. Atribuir um único byte um milhão de vezes não é o mesmo que atribuir um milhão de bytes de uma única vez; rastrear tanto os tamanhos quanto as contagens pode expor a diferença.

As marcas de água baixa e alta são críticas para detectar picos de carga de trabalho, estabilidade geral da carga de trabalho e possíveis vazamentos de memória.

As tabelas de resumo de memória não contêm informações de temporização, pois os eventos de memória não são temporizados.

Para obter informações sobre a coleta de dados de uso de memória, consulte Comportamento de Instrumentação de Memória.

Exemplo de informações de resumo de eventos de memória:

```sql
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

* A coluna `memory_summary_by_account_by_event_name` possui as colunas `USER`, `HOST` e `EVENT_NAME`. Cada string resume os eventos para uma combinação específica de conta (usuário e host) e nome do evento.

* A coluna `memory_summary_by_host_by_event_name` possui as colunas `HOST` e `EVENT_NAME`. Cada string resume os eventos para um determinado hospedeiro e nome de evento.

* A coluna `memory_summary_by_thread_by_event_name` possui as colunas `THREAD_ID` e `EVENT_NAME`. Cada string resume os eventos para um determinado thread e nome de evento.

* A coluna `memory_summary_by_user_by_event_name` tem as colunas `USER` e `EVENT_NAME`. Cada string resume os eventos para um usuário e nome de evento específicos.

* `memory_summary_global_by_event_name` possui uma coluna `EVENT_NAME`. Cada string resume os eventos para um nome de evento específico.

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

`TRUNCATE TABLE` é permitido para tabelas de resumo de memória. Tem esses efeitos:

* Em geral, a truncação redefre o nível de referência para as estatísticas, mas não altera o estado do servidor. Isso significa que a truncação de uma tabela de memória não libera memória.

* `COUNT_ALLOC` e `COUNT_FREE` são redefinidos com uma nova string de base, reduzindo cada contador pelo mesmo valor.

* Da mesma forma, `SUM_NUMBER_OF_BYTES_ALLOC` e `SUM_NUMBER_OF_BYTES_FREE` são redefinidos em uma nova string de base.

* `LOW_COUNT_USED` e `HIGH_COUNT_USED` são redefinidos para `CURRENT_COUNT_USED`.

* `LOW_NUMBER_OF_BYTES_USED` e `HIGH_NUMBER_OF_BYTES_USED` são redefinidos para `CURRENT_NUMBER_OF_BYTES_USED`.

Além disso, cada tabela de resumo de memória que é agregada por conta, host, usuário ou thread é implicitamente truncada pela truncagem da tabela de conexão na qual depende, ou pela truncagem de [[`memory_summary_global_by_event_name`]. Para detalhes, consulte a Seção 25.12.8, “Tabelas de Conexão do Schema de Desempenho”.

##### Comportamento de Instrumento de Memória

Os instrumentos de memória estão listados na tabela `setup_instruments` e têm nomes na forma `memory/code_area/instrument_name`. A maioria dos instrumentos de memória é desativada por padrão.

Os instrumentos com o prefixo `memory/performance_schema/` mostram quanto memória é alocada para buffers internos no próprio Schema de Desempenho. Os instrumentos `memory/performance_schema/` são construídos, sempre ativados e não podem ser desativados no início ou no runtime. Os instrumentos de memória embutidos são exibidos apenas na tabela `memory_summary_global_by_event_name`.

Para controlar o estado da instrumentação de memória na inicialização do servidor, use strings como essas no seu arquivo `my.cnf`:

* Habilitar:

  ```sql
  [mysqld]
  performance-schema-instrument='memory/%=ON'
  ```

* Desativar:

  ```sql
  [mysqld]
  performance-schema-instrument='memory/%=OFF'
  ```

Para controlar o estado da instrumentação de memória no tempo de execução, atualize a coluna `ENABLED` dos instrumentos relevantes na tabela `setup_instruments`:

* Habilitar:

  ```sql
  UPDATE performance_schema.setup_instruments
  SET ENABLED = 'YES'
  WHERE NAME LIKE 'memory/%';
  ```

* Desativar:

  ```sql
  UPDATE performance_schema.setup_instruments
  SET ENABLED = 'NO'
  WHERE NAME LIKE 'memory/%';
  ```

Para instrumentos de memória, a coluna `TIMED` em `setup_instruments` é ignorada porque as operações de memória não são temporizadas.

Quando um thread no servidor executa uma alocação de memória que foi instrumentada, essas regras se aplicam:

* Se o thread não for instrumentado ou o instrumento de memória não estiver habilitado, o bloco de memória alocado não será instrumentado.

* Caso contrário (ou seja, tanto o thread quanto o instrumento estão habilitados), o bloco de memória alocado é instrumentado.

Para a realocação, essas regras se aplicam:

* Se uma operação de alocação de memória foi instrumentada, a operação correspondente de liberação é instrumentada, independentemente do status atual do instrumento ou do thread habilitado.

* Se uma operação de alocação de memória não foi instrumentada, a operação correspondente de liberação não é instrumentada, independentemente do status atual do instrumento ou do thread habilitado.

Para as estatísticas por thread, as seguintes regras se aplicam.

Quando um bloco de memória instrumentado de tamanho *`N`* é alocado, o Schema de Desempenho faz essas atualizações nas colunas da tabela de resumo de memória:

* `COUNT_ALLOC`: Aumentada em 1
* `CURRENT_COUNT_USED`: Aumentada em 1
* `HIGH_COUNT_USED`: Aumentada se `CURRENT_COUNT_USED` é o máximo novo

* `SUM_NUMBER_OF_BYTES_ALLOC`: Aumentada por *`N`*

* `CURRENT_NUMBER_OF_BYTES_USED`: Aumentada por *`N`*

* `HIGH_NUMBER_OF_BYTES_USED`: Aumenta se `CURRENT_NUMBER_OF_BYTES_USED` for um novo máximo

Quando um bloco de memória instrumentado é realocado, o Schema de Desempenho faz essas atualizações nas colunas da tabela de resumo de memória:

* `COUNT_FREE`: Aumentada em 1
* `CURRENT_COUNT_USED`: Diminuiu em 1
* `LOW_COUNT_USED`: Diminui se `CURRENT_COUNT_USED` é um novo mínimo

* `SUM_NUMBER_OF_BYTES_FREE`: Aumentada por *`N`*

* `CURRENT_NUMBER_OF_BYTES_USED`: Reduzida em *`N`*

* `LOW_NUMBER_OF_BYTES_USED`: Diminui se `CURRENT_NUMBER_OF_BYTES_USED` for um novo mínimo

Para agregados de nível superior (global, por conta, por usuário, por host), as mesmas regras se aplicam conforme esperado para marcas de água baixas e altas.

* `LOW_COUNT_USED` e `LOW_NUMBER_OF_BYTES_USED` são estimativas mais baixas. O valor reportado pelo Performance Schema é garantido para ser menor ou igual ao menor número ou tamanho de memória efetivamente utilizada durante a execução.

* `HIGH_COUNT_USED` e `HIGH_NUMBER_OF_BYTES_USED` são estimativas mais altas. O valor reportado pelo Schema de Desempenho é garantido para ser maior ou igual ao maior número ou tamanho de memória efetivamente utilizada durante a execução.

Para estimativas mais baixas em tabelas resumidas, exceto `memory_summary_global_by_event_name`, é possível que os valores sejam negativos se a propriedade da memória for transferida entre os threads.

Aqui está um exemplo de cálculo de estimativa; mas observe que a implementação da estimativa está sujeita a alterações:

O thread 1 utiliza memória na faixa de 1 MB a 2 MB durante a execução, conforme relatado pelas colunas `LOW_NUMBER_OF_BYTES_USED` e `HIGH_NUMBER_OF_BYTES_USED` da tabela `memory_summary_by_thread_by_event_name`.

O thread 2 utiliza memória na faixa de 10 MB a 12 MB durante a execução, conforme relatado igualmente.

Quando esses dois threads pertencem à mesma conta de usuário, o resumo por conta estima que essa conta usou memória na faixa de 11 MB a 14 MB. Ou seja, o `LOW_NUMBER_OF_BYTES_USED` para o agregado de nível superior é a soma de cada `LOW_NUMBER_OF_BYTES_USED` (assumindo o pior caso). Da mesma forma, o `HIGH_NUMBER_OF_BYTES_USED` para o agregado de nível superior é a soma de cada `HIGH_NUMBER_OF_BYTES_USED` (assumindo o pior caso).

11 MB é uma estimativa mais baixa que pode ocorrer apenas se ambos os threads atingirem a marca de baixo uso ao mesmo tempo.

14 MB é uma estimativa mais alta que pode ocorrer apenas se ambos os threads atingirem a marca de alto uso ao mesmo tempo.

O uso real da memória para esta conta poderia ter ficado na faixa de 11,5 MB a 13,5 MB.

Para o planejamento de capacidade, relatar o pior cenário é, na verdade, o comportamento desejado, pois mostra o que pode potencialmente acontecer quando as sessões não estão correlacionadas, o que é o caso típico.

#### 25.12.15.10 Tabelas Resumo de Estatuto Variável

Nota

O valor da variável de sistema `show_compatibility_56` afeta as informações disponíveis nas tabelas descritas aqui. Para detalhes, consulte a descrição dessa variável na Seção 5.1.7, “Variáveis do sistema do servidor”.

O Schema de Desempenho disponibiliza informações de variáveis de status nas tabelas descritas na Seção 25.12.14, “Tabelas de Variáveis de Status do Schema de Desempenho”. Também disponibiliza informações agregadas de variáveis de status em tabelas resumidas, descritas aqui. Cada tabela de resumo de variáveis de status tem uma ou mais colunas de agrupamento para indicar como a tabela agrega os valores de status:

* A coluna `status_by_account` possui as colunas `USER`, `HOST` e `VARIABLE_NAME` para resumir as variáveis de status por conta.

* A coluna `status_by_host` possui as colunas `HOST` e `VARIABLE_NAME` para resumir as variáveis de status por meio do host a partir do qual os clientes se conectaram.

* A coluna `status_by_user` possui as colunas `USER` e `VARIABLE_NAME` para resumir as variáveis de status por nome do usuário do cliente.

Cada tabela de resumo das variáveis de status tem essa coluna de resumo contendo valores agregados:

* `VARIABLE_VALUE`

O valor da variável de status agregado para sessões ativas e encerradas.

O significado de “conta” nessas tabelas é semelhante ao seu significado nas tabelas de concessão de permissão do sistema `mysql`, no sentido de que o termo se refere a uma combinação de valores de usuário e host. Eles diferem na medida em que, para as tabelas de concessão de permissão, a parte do host de uma conta pode ser um padrão, enquanto para as tabelas do Schema de Desempenho, o valor do host é sempre um nome de host específico não padrão.

O status da conta é coletado quando as sessões terminam. Os contadores de status de sessão são adicionados aos contadores de status global e aos contadores de status correspondentes da conta. Se as estatísticas da conta não forem coletadas, o status da sessão é adicionado ao status do host e do usuário, se o status do host e do usuário forem coletados.

As estatísticas de conta, hospedagem e usuário não são coletadas se as variáveis de sistema `performance_schema_accounts_size`, `performance_schema_hosts_size` e `performance_schema_users_size`, respectivamente, forem definidas como 0.

O Schema de Desempenho suporta `TRUNCATE TABLE` para tabelas de resumo de variáveis de status da seguinte forma; em todos os casos, o status das sessões ativas não é afetado:

* `status_by_account`: Agrupa o status da conta a partir de sessões terminadas para o status do usuário e do host, e depois redefine o status da conta.

* `status_by_host`: Redefine o status agregado do host a partir de sessões terminadas.

* `status_by_user`: Redefine o status do usuário agregado a partir de sessões terminadas.

`FLUSH STATUS` adiciona o status da sessão de todas as sessões ativas às variáveis de status globais, refaz o status de todas as sessões ativas e refaz os valores de status de conta, host e usuário agregados de sessões desconectadas.

### 25.12.16 Tabelas Diversas do Schema de Desempenho

As seções a seguir descrevem tabelas que não se enquadram nas categorias de tabelas discutidas nas seções anteriores:

* `host_cache`: Informações do cache de host interno.

* `performance_timers`: Quais temporizadores estão disponíveis.

* `threads`: Informações sobre os threads do servidor.

#### 25.12.16.1 Tabela host_cache

O servidor MySQL mantém um cache de hosts em memória que contém informações sobre o nome do host e o endereço IP do cliente e é usado para evitar pesquisas no Sistema de Nomes de Domínio (DNS). A tabela `host_cache` expõe o conteúdo desse cache. A variável de sistema `host_cache_size` controla o tamanho do cache de hosts, bem como o tamanho da tabela `host_cache`. Para informações operacionais e de configuração sobre o cache de hosts, consulte a Seção 5.1.11.2, “Consultas de DNS e o Cache de Hosts”.

Como a tabela `host_cache` expõe o conteúdo do cache do host, ela pode ser examinada usando as instruções `SELECT`. Isso pode ajudá-lo a diagnosticar as causas dos problemas de conexão. O Schema de desempenho deve ser habilitado ou essa tabela estará vazia.

A tabela `host_cache` tem essas colunas:

* `IP`

O endereço IP do cliente que se conectou ao servidor, expresso como uma string.

* `HOST`

O nome de host resolvido do DNS para o IP desse cliente, ou `NULL` se o nome for desconhecido.

* `HOST_VALIDATED`

Se a resolução DNS de IP para nome de host para IP foi realizada com sucesso para o IP do cliente. Se `HOST_VALIDATED` é `YES`, a coluna `HOST` é usada como o nome de host correspondente ao IP para evitar chamadas adicionais ao DNS. Enquanto `HOST_VALIDATED` é `NO`, a resolução DNS é realizada para cada tentativa de conexão, até que ela eventualmente seja concluída com um resultado válido ou um erro permanente. Essas informações permitem que o servidor evite o cache de nomes de host ruins ou ausentes durante falhas temporárias no DNS, o que afetaria negativamente os clientes para sempre.

* `SUM_CONNECT_ERRORS`

O número de erros de conexão considerados “bloqueantes” (avaliados em relação à variável de sistema `max_connect_errors`). Apenas os erros de aperto de protocolo são contados e apenas para os hosts que passaram na validação (`HOST_VALIDATED = YES`).

Uma vez que o `SUM_CONNECT_ERRORS` de um determinado host atinja o valor de `max_connect_errors`, novas conexões desse host são bloqueadas. O valor de `SUM_CONNECT_ERRORS` pode exceder o valor de `max_connect_errors`, pois múltiplas tentativas de conexão de um host podem ocorrer simultaneamente, enquanto o host não está bloqueado. Qualquer uma ou todas elas podem falhar, incrementando independentemente `SUM_CONNECT_ERRORS`, possivelmente além do valor de `max_connect_errors`.

Suponha que `max_connect_errors` seja 200 e `SUM_CONNECT_ERRORS` para um host dado seja 199. Se 10 clientes tentarem se conectar simultaneamente desse host, nenhum deles é bloqueado porque `SUM_CONNECT_ERRORS` não atingiu 200. Se ocorrerem erros de bloqueio para cinco dos clientes, `SUM_CONNECT_ERRORS` é aumentado em um para cada cliente, resultando em um valor de `SUM_CONNECT_ERRORS` de 204. Os outros cinco clientes têm sucesso e não são bloqueados porque o valor de `SUM_CONNECT_ERRORS` quando suas tentativas de conexão começaram não atingiu 200. Novas conexões do host que começam após `SUM_CONNECT_ERRORS` atingir 200 são bloqueadas.

* `COUNT_HOST_BLOCKED_ERRORS`

O número de conexões que foram bloqueadas porque `SUM_CONNECT_ERRORS` excedeu o valor da variável de sistema `max_connect_errors`.

* `COUNT_NAMEINFO_TRANSIENT_ERRORS`

O número de erros transitórios durante a resolução de DNS de nome de host para IP.

* `COUNT_NAMEINFO_PERMANENT_ERRORS`

O número de erros permanentes durante a resolução de nomes de DNS de IP para host.

* `COUNT_FORMAT_ERRORS`

O número de erros no formato do nome do host. O MySQL não realiza a correspondência dos valores das colunas `Host` na tabela `mysql.user` do sistema contra nomes de host para os quais um ou mais dos componentes iniciais do nome são inteiramente numéricos, como `1.2.example.com`. O endereço IP do cliente é usado em vez disso. Para a justificativa de por que esse tipo de correspondência não ocorre, consulte a Seção 6.2.4, “Especificação de Nomes de Conta”.

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

O número de erros detectados no nível do protocolo de threads.

* `COUNT_PROXY_USER_ERRORS`

O número de erros detectados quando o usuário proxy A é redirecionado para outro usuário B que não existe.

* `COUNT_PROXY_USER_ACL_ERRORS`

O número de erros detectados quando o usuário proxy A é redirecionado para outro usuário B que existe, mas para o qual A não tem o privilégio `PROXY`.

* `COUNT_AUTHENTICATION_ERRORS`

O número de erros causados por autenticação falha.

* `COUNT_SSL_ERRORS`

O número de erros devido a problemas SSL.

* `COUNT_MAX_USER_CONNECTIONS_ERRORS`

O número de erros causados pelo excedente de cotas de conexão por usuário. Veja a Seção 6.2.16, “Definindo Limites de Recursos da Conta”.

* `COUNT_MAX_USER_CONNECTIONS_PER_HOUR_ERRORS`

O número de erros causados pelo excedente de conexões por usuário por hora. Veja a Seção 6.2.16, “Definindo Limites de Recursos da Conta”.

* `COUNT_DEFAULT_DATABASE_ERRORS`

O número de erros relacionados ao banco de dados padrão. Por exemplo, o banco de dados não existe ou o usuário não tem privilégios para acessá-lo.

* `COUNT_INIT_CONNECT_ERRORS`

O número de erros causados por falhas na execução de declarações na variável de sistema `init_connect`.

* `COUNT_LOCAL_ERRORS`

O número de erros específicos à implementação do servidor e não relacionados à rede, autenticação ou autorização. Por exemplo, as condições de falta de memória pertencem a essa categoria.

* `COUNT_UNKNOWN_ERRORS`

O número de outros erros desconhecidos não considerados por outras colunas nesta tabela. Esta coluna é reservada para uso futuro, caso novas condições de erro precisem ser relatadas, e se for necessário preservar a compatibilidade e a estrutura reversa da tabela `host_cache`.

* `FIRST_SEEN`

O horário da primeira tentativa de conexão vista pelo cliente na coluna `IP`.

* `LAST_SEEN`

O horário da tentativa de conexão mais recente observada a partir do cliente na coluna `IP`.

* `FIRST_ERROR_SEEN`

O horário do primeiro erro visto pelo cliente na coluna `IP`.

* `LAST_ERROR_SEEN`

O horário do erro mais recente visto do cliente na coluna `IP`.

`TRUNCATE TABLE` é permitido para a tabela `host_cache`. Ele exige o privilégio `DROP` para a tabela. O truncar da tabela esvazia o cache do host, que tem os efeitos descritos em Esvaziar o cache do host.

#### 25.12.16.2 A tabela performance_timers

A tabela `performance_timers` mostra quais temporizadores de evento estão disponíveis:

```sql
mysql> SELECT * FROM performance_schema.performance_timers;
+-------------+-----------------+------------------+----------------+
| TIMER_NAME  | TIMER_FREQUENCY | TIMER_RESOLUTION | TIMER_OVERHEAD |
+-------------+-----------------+------------------+----------------+
| CYCLE       |      2389029850 |                1 |             72 |
| NANOSECOND  |      1000000000 |                1 |            112 |
| MICROSECOND |         1000000 |                1 |            136 |
| MILLISECOND |            1036 |                1 |            168 |
| TICK        |             105 |                1 |           2416 |
+-------------+-----------------+------------------+----------------+
```

Se os valores associados a um nome de temporizador específico forem `NULL`, esse temporizador não é suportado na sua plataforma. As strings que não contêm `NULL` indicam quais temporizadores você pode usar em `setup_timers`. Para uma explicação sobre como o temporizador de eventos ocorre, consulte a Seção 25.4.1, “Temporizador de Eventos do Schema de Desempenho”.

Nota

A partir do MySQL 5.7.21, a tabela do Gerador de Desempenho `setup_timers` é descontinuada e é removida no MySQL 8.0, assim como a string `TICKS` na tabela `performance_timers`.

A tabela `performance_timers` tem essas colunas:

* `TIMER_NAME`

O nome pelo qual se refere ao temporizador ao configurar a tabela `setup_timers`.

* `TIMER_FREQUENCY`

O número de unidades temporizador por segundo. Para um temporizador de ciclo, a frequência geralmente está relacionada à velocidade da CPU. Por exemplo, em um sistema com um processador de 2,4 GHz, o `CYCLE` pode estar próximo a 2400000000.

* `TIMER_RESOLUTION`

Indica o número de unidades de temporizador pelas quais os valores do temporizador aumentam. Se um temporizador tiver uma resolução de 10, seu valor aumenta em 10 cada vez.

* `TIMER_OVERHEAD`

O número mínimo de ciclos de overhead para obter um temporizador com o temporizador dado. O Schema de Desempenho determina esse valor ao invocar o temporizador 20 vezes durante a inicialização e selecionar o menor valor. O overhead total é realmente o dobro desse valor porque a instrumentação invoca o temporizador no início e no fim de cada evento. O código do temporizador é chamado apenas para eventos temporizados, então esse overhead não se aplica para eventos não temporizados.

`TRUNCATE TABLE` não é permitido para a tabela `performance_timers`.

#### 25.12.16.3 A tabela Processolist

Nota

A tabela `processlist` é criada automaticamente no Gerenciamento de Desempenho para novas instalações do MySQL 5.7.39 ou superior. Ela também é criada automaticamente por uma atualização.

A lista de processos do MySQL indica as operações atualmente realizadas pelo conjunto de threads que estão sendo executadas dentro do servidor. A tabela `processlist` é uma fonte de informações sobre os processos. Para uma comparação desta tabela com outras fontes, consulte Fontes de Informações sobre Processos.

A tabela `processlist` pode ser consultada diretamente. Se você tiver o privilégio `PROCESS`, poderá ver todos os tópicos, mesmo aqueles pertencentes a outros usuários. Caso contrário (sem o privilégio `PROCESS`, usuários não anônimos têm acesso às informações sobre seus próprios tópicos, mas não a tópicos de outros usuários, e usuários anônimos não têm acesso às informações dos tópicos.

Nota

Se a variável de sistema `performance_schema_show_processlist` estiver habilitada, a tabela `processlist` também serve como base para uma implementação alternativa subjacente à declaração `SHOW PROCESSLIST`. Para obter detalhes, consulte mais adiante nesta seção.

A tabela `processlist` contém uma string para cada processo do servidor:

```sql
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

O identificador de conexão. Este é o mesmo valor exibido na coluna `Id` da declaração `SHOW PROCESSLIST`, exibida na coluna `PROCESSLIST_ID` da tabela do Gerador de Desempenho `threads`, e retornada pela função `CONNECTION_ID()` dentro do thread.

* `USER`

O usuário do MySQL que emitiu a declaração. Um valor de `system user` refere-se a um thread não cliente gerado pelo servidor para lidar com tarefas internamente, por exemplo, um thread de manipulação de string atrasada ou um thread de E/S ou SQL usado em hosts replicados. Para `system user`, não há um host especificado na coluna `Host`. `unauthenticated user` refere-se a um thread que se tornou associado a uma conexão com cliente, mas para o qual a autenticação do usuário do cliente ainda não ocorreu. `event_scheduler` refere-se ao thread que monitora eventos agendados (ver Seção 23.4, “Usando o Cronograma de Eventos”).

Nota

Um valor `USER` de `system user` é distinto do privilégio `SYSTEM_USER`. O primeiro designa threads internas. Este último distingue as categorias de usuário do sistema e as contas de usuário regulares (veja Categorias de Conta).

* `HOST`

O nome do host do cliente que emite a declaração (exceto para `system user`, para o qual não há nenhum nome de host). O nome do host para conexões TCP/IP é relatado no formato `host_name:client_port` para facilitar a determinação de qual cliente está fazendo o que.

* `DB`

O banco de dados padrão para o tópico, ou `NULL` se nenhum tiver sido selecionado.

* `COMMAND`

O tipo de comando que o thread está executando em nome do cliente, ou `Sleep` se a sessão estiver inativa. Para descrições dos comandos do thread, consulte a Seção 8.14, “Examinando Informações do Thread (Processo) do Servidor” (Informações). O valor desta coluna corresponde aos comandos `COM_xxx` do protocolo cliente/servidor e às variáveis de status `Com_xxx`. Consulte a Seção 5.1.9, “Variáveis de Status do Servidor”.

* `TIME`

O tempo em segundos que o thread esteve em seu estado atual. Para um thread de replicação SQL, o valor é o número de segundos entre o timestamp do último evento replicado e o tempo real do host da replica. Veja a Seção 16.2.3, “Threads de Replicação”.

* `STATE`

Uma ação, evento ou estado que indica o que o thread está fazendo. Para descrições dos valores de `STATE`, consulte a Seção 8.14, “Examinando informações do thread (processo) do servidor” (Informações).

A maioria dos estados corresponde a operações muito rápidas. Se um thread permanecer em um estado específico por muitos segundos, pode haver um problema que precisa ser investigado.

* `INFO`

A declaração que o thread está executando, ou `NULL` se não estiver executando nenhuma declaração. A declaração pode ser a uma enviada ao servidor, ou uma declaração interna se a declaração executar outras declarações. Por exemplo, se uma declaração `CALL` executar um procedimento armazenado que está executando uma declaração `SELECT`, o valor `INFO` mostra a declaração `SELECT`.

* `EXECUTION_ENGINE`

O motor de execução de consulta. O valor é `PRIMARY` ou `SECONDARY`. Para uso com o MySQL HeatWave Service e o MySQL HeatWave, onde o motor `PRIMARY` é `InnoDB` e o motor `SECONDARY` é MySQL HeatWave (`RAPID`). Para o MySQL Community Edition Server, o MySQL Enterprise Edition Server (on-premise) e o MySQL HeatWave Service sem o MySQL HeatWave, o valor é sempre `PRIMARY`. Esta coluna foi adicionada no MySQL 8.0.29.

`TRUNCATE TABLE` não é permitido para a tabela `processlist`.

Como mencionado anteriormente, se a variável de sistema `performance_schema_show_processlist` estiver habilitada, a tabela `processlist` serve como base para uma implementação alternativa de outras fontes de informações de processo:

* A declaração `SHOW PROCESSLIST`.

* O comando **mysqladmin processlist** (que utiliza a declaração `SHOW PROCESSLIST`).

A implementação padrão `SHOW PROCESSLIST` percorre os threads ativos a partir do gerenciador de threads, mantendo um mutex global. Isso tem consequências negativas de desempenho, especialmente em sistemas ocupados. A implementação alternativa `SHOW PROCESSLIST` é baseada na tabela do Schema de Desempenho `processlist`. Essa implementação consulta os dados dos threads ativos do Schema de Desempenho em vez do gerenciador de threads e não requer um mutex.

A configuração do MySQL afeta o conteúdo da tabela `processlist` da seguinte forma:

* Configuração mínima necessária:

+ O servidor MySQL deve ser configurado e construído com a instrumentação de thread habilitada. Isso é verdadeiro por padrão; é controlado usando a opção `DISABLE_PSI_THREAD` **CMake**.

+ O Schema de Desempenho deve ser habilitado na inicialização do servidor. Isso é verdadeiro por padrão; ele é controlado usando a variável de sistema `performance_schema`.

Com essa configuração satisfeita, `performance_schema_show_processlist` habilita ou desativa a implementação alternativa `SHOW PROCESSLIST`. Se a configuração mínima não for satisfeita, a tabela `processlist` (e, portanto, `SHOW PROCESSLIST`) pode não retornar todos os dados.

* Configuração recomendada:

+ Para evitar que alguns tópicos sejam ignorados:

- Deixe a variável de sistema `performance_schema_max_thread_instances` definida como padrão ou definida pelo menos tão grande quanto a variável de sistema `max_connections`.

- Deixe a variável de sistema `performance_schema_max_thread_classes` definida como padrão.

+ Para evitar que alguns valores da coluna `STATE` sejam vazios, deixe a variável de sistema `performance_schema_max_stage_classes` definida como o seu valor padrão.

O padrão para esses parâmetros de configuração é `-1`, que faz com que o Performance Schema os dimensione automaticamente ao iniciar o servidor. Com os parâmetros definidos conforme indicado, a tabela `processlist` (e, portanto, `SHOW PROCESSLIST`) fornece informações completas sobre os processos.

Os parâmetros de configuração anteriores afetam o conteúdo da tabela `processlist`. Para uma configuração dada, no entanto, o conteúdo da `processlist` não é afetado pela configuração da `performance_schema_show_processlist`.

A implementação da lista de processos alternativos não se aplica à tabela `INFORMATION_SCHEMA` `PROCESSLIST` ou ao comando `COM_PROCESS_INFO` do protocolo cliente/servidor MySQL.

#### 25.12.16.4 A tabela de threads

A tabela `threads` contém uma string para cada thread do servidor. Cada string contém informações sobre um thread e indica se o monitoramento e o registro de eventos históricos estão habilitados para ele:

```sql
mysql> SELECT * FROM performance_schema.threads\G
*************************** 1. row ***************************
          THREAD_ID: 1
               NAME: thread/sql/main
               TYPE: BACKGROUND
     PROCESSLIST_ID: NULL
   PROCESSLIST_USER: NULL
   PROCESSLIST_HOST: NULL
     PROCESSLIST_DB: NULL
PROCESSLIST_COMMAND: NULL
   PROCESSLIST_TIME: 80284
  PROCESSLIST_STATE: NULL
   PROCESSLIST_INFO: NULL
   PARENT_THREAD_ID: NULL
               ROLE: NULL
       INSTRUMENTED: YES
            HISTORY: YES
    CONNECTION_TYPE: NULL
       THREAD_OS_ID: 489803
...
*************************** 4. row ***************************
          THREAD_ID: 51
               NAME: thread/sql/one_connection
               TYPE: FOREGROUND
     PROCESSLIST_ID: 34
   PROCESSLIST_USER: isabella
   PROCESSLIST_HOST: localhost
     PROCESSLIST_DB: performance_schema
PROCESSLIST_COMMAND: Query
   PROCESSLIST_TIME: 0
  PROCESSLIST_STATE: Sending data
   PROCESSLIST_INFO: SELECT * FROM performance_schema.threads
   PARENT_THREAD_ID: 1
               ROLE: NULL
       INSTRUMENTED: YES
            HISTORY: YES
    CONNECTION_TYPE: SSL/TLS
       THREAD_OS_ID: 755399
...
```

Quando o Schema de Desempenho é inicializado, ele preenche a tabela `threads` com base nos threads existentes naquela época. Posteriormente, uma nova string é adicionada a cada vez que o servidor cria um thread.

Os valores das colunas `INSTRUMENTED` e `HISTORY` para novos tópicos são determinados pelo conteúdo da tabela `setup_actors`. Para informações sobre como usar a tabela `setup_actors` para controlar essas colunas, consulte a Seção 25.4.6, “Pré-filtragem por Tópico”.

A remoção de strings da tabela `threads` ocorre quando os threads terminam. Para um thread associado a uma sessão de cliente, a remoção ocorre quando a sessão termina. Se um cliente tiver o auto-reconexão habilitado e a sessão se reconectar após uma desconexão, a sessão se torna associada a uma nova string na tabela `threads` que tem um valor diferente de `PROCESSLIST_ID`. Os valores iniciais de `INSTRUMENTED` e `HISTORY` para o novo thread podem ser diferentes daqueles do thread original: A tabela `setup_actors` pode ter mudado entretanto, e se o valor de `INSTRUMENTED` ou `HISTORY` para o thread original foi alterado após a string ser inicializada, a alteração não se transfere para o novo thread.

Você pode habilitar ou desabilitar o monitoramento de threads (ou seja, se os eventos executados pelo thread são instrumentados) e o registro histórico de eventos. Para controlar os valores iniciais dos `INSTRUMENTED` e `HISTORY` para novos threads de primeiro plano, use a tabela `setup_actors`. Para controlar esses aspectos dos threads existentes, defina as colunas `INSTRUMENTED` e `HISTORY` das strings da tabela `threads`. (Para mais informações sobre as condições sob as quais o monitoramento de threads e o registro histórico de eventos ocorrem, consulte as descrições das colunas `INSTRUMENTED` e `HISTORY`.)

Para uma comparação das colunas da tabela `threads` com nomes que têm um prefixo de `PROCESSLIST_` com outras fontes de informações sobre o processo, consulte as Fontes de Informações sobre o Processo.

Importante

Para fontes de informações sobre threads que não sejam a tabela `threads`, as informações sobre threads para outros usuários são mostradas apenas se o usuário atual tiver o privilégio `PROCESS`. Isso não é verdade para a tabela `threads`; todas as strings são mostradas para qualquer usuário que tenha o privilégio `SELECT` para a tabela. Os usuários que não devem ser capazes de ver threads para outros usuários ao acessar a tabela `threads` não devem receber o privilégio `SELECT` para ela.

A tabela `threads` tem essas colunas:

* `THREAD_ID`

Um identificador único de thread.

* `NAME`

O nome associado ao código de instrumentação de thread no servidor. Por exemplo, `thread/sql/one_connection` corresponde à função de thread no código responsável por lidar com uma conexão de usuário, e `thread/sql/main` representa a função `main()` do servidor.

* `TYPE`

O tipo de thread, seja `FOREGROUND` ou `BACKGROUND`. Os threads de conexão do usuário são threads de primeiro plano. Os threads associados à atividade do servidor interno são threads de segundo plano. Exemplos são os threads internos `InnoDB`, os threads "dump de binlog" que enviam informações para réplicas e os threads de I/O de replicação e SQL.

* `PROCESSLIST_ID`

Para um thread de primeiro plano (associado a uma conexão de usuário), este é o identificador de conexão. Este é o mesmo valor exibido na coluna `ID` da tabela `INFORMATION_SCHEMA` `PROCESSLIST`, exibida na coluna `Id` de `SHOW PROCESSLIST` saída e devolvida pela função `CONNECTION_ID()` dentro do thread.

Para um thread de fundo (não associado a uma conexão de usuário), `PROCESSLIST_ID` é `NULL`, portanto, os valores não são exclusivos.

* `PROCESSLIST_USER`

O usuário associado a um thread de plano de fundo, `NULL` para um thread de plano de fundo.

* `PROCESSLIST_HOST`

O nome do host do cliente associado a uma thread de primeiro plano, `NULL`, para uma thread de segundo plano.

Ao contrário da coluna `HOST` da tabela `INFORMATION_SCHEMA` `PROCESSLIST` ou da coluna `Host` da saída `SHOW PROCESSLIST`, a coluna `PROCESSLIST_HOST` não inclui o número do porto para conexões TCP/IP. Para obter essas informações do Gerador de Dados de Desempenho, habilite a instrumentação de soquetes (que não está habilitada por padrão) e examine a tabela `socket_instances`:

  ```sql
  mysql> SELECT * FROM performance_schema.setup_instruments
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

Para os threads de primeiro plano, o tipo de comando que o thread está executando em nome do cliente, ou `Sleep` se a sessão estiver inativa. Para descrições dos comandos dos threads, consulte a Seção 8.14, “Examinando as Informações do Thread (Processo) do Servidor” (Informações). O valor desta coluna corresponde aos comandos `COM_xxx` do protocolo cliente/servidor e às variáveis de status `Com_xxx`. Consulte a Seção 5.1.9, “Variáveis de Status do Servidor”

Os threads de segundo plano não executam comandos em nome dos clientes, portanto, esta coluna pode ser `NULL`.

* `PROCESSLIST_TIME`

O tempo em segundos que o thread esteve em seu estado atual. Para um thread de replicação SQL, o valor é o número de segundos entre o timestamp do último evento replicado e o tempo real do host da replica. Veja a Seção 16.2.3, “Threads de Replicação”.

* `PROCESSLIST_STATE`

Uma ação, evento ou estado que indica o que o thread está fazendo. Para descrições dos valores de `PROCESSLIST_STATE`, consulte a Seção 8.14, “Examinando Informações do Thread (Processo) do Servidor” (Informações). Se o valor for `NULL`, o thread pode corresponder a uma sessão de cliente inativo ou o trabalho que está sendo feito não está instrumentado com etapas.

A maioria dos estados corresponde a operações muito rápidas. Se um thread permanecer em um estado específico por muitos segundos, pode haver um problema que precisa ser investigado.

* `PROCESSLIST_INFO`

A declaração que o thread está executando, ou `NULL` se não estiver executando nenhuma declaração. A declaração pode ser a uma enviada ao servidor, ou uma declaração interna se a declaração executar outras declarações. Por exemplo, se uma declaração `CALL` executar um procedimento armazenado que está executando uma declaração `SELECT`, o valor `PROCESSLIST_INFO` mostra a declaração `SELECT`.

* `PARENT_THREAD_ID`

Se este thread for um subfio (gerado por outro thread), este é o valor `THREAD_ID` do thread gerador.

* `ROLE`

  Unused.

* `INSTRUMENTED`

Se os eventos executados pelo thread são instrumentados. O valor é `YES` ou `NO`.

+ Para os threads de primeiro plano, o valor inicial `INSTRUMENTED` é determinado pelo fato de a conta de usuário associada ao thread corresponder a qualquer string na tabela `setup_actors`. A correspondência é baseada nos valores das colunas `PROCESSLIST_USER` e `PROCESSLIST_HOST`.

Se o thread gerar um subfio, a correspondência ocorre novamente para a string da tabela `threads` criada para o subfio.

+ Para os threads de plano de fundo, `INSTRUMENTED` é `YES` por padrão. `setup_actors` não é consultado porque não há um usuário associado para os threads de plano de fundo.

+ Para qualquer thread, seu valor `INSTRUMENTED` pode ser alterado durante a vida útil da thread.

Para que o monitoramento de eventos executados pelo thread ocorra, essas coisas devem ser verdadeiras:

+ O consumidor `thread_instrumentation` na tabela `setup_consumers` deve ser `YES`.

+ A coluna `threads.INSTRUMENTED` deve ser `YES`.

+ O monitoramento ocorre apenas para os eventos de thread produzidos a partir de instrumentos que têm a coluna `ENABLED` definida como `YES` na tabela `setup_instruments`.

* `HISTORY`

Se deve registrar eventos históricos para o tópico. O valor é `YES` ou `NO`.

+ Para os threads de primeiro plano, o valor inicial `HISTORY` é determinado pelo fato de a conta de usuário associada ao thread corresponder a qualquer string na tabela `setup_actors`. A correspondência é baseada nos valores das colunas `PROCESSLIST_USER` e `PROCESSLIST_HOST`.

Se o thread gerar um subfio, a correspondência ocorre novamente para a string da tabela `threads` criada para o subfio.

+ Para os threads de plano de fundo, `HISTORY` é `YES` por padrão. `setup_actors` não é consultado porque não há um usuário associado para os threads de plano de fundo.

+ Para qualquer thread, seu valor `HISTORY` pode ser alterado durante a vida útil da thread.

Para que o registro de eventos históricos ocorra para o thread, essas coisas devem ser verdadeiras:

+ Os consumidores apropriados relacionados a histórico no `setup_consumers` tabela devem ser habilitados. Por exemplo, o registro de eventos de espera nas tabelas `events_waits_history` e `events_waits_history_long` requer que os consumidores correspondentes `events_waits_history` e `events_waits_history_long` sejam `YES`.

+ A coluna `threads.HISTORY` deve ser `YES`.

+ O registro ocorre apenas para aqueles eventos de thread produzidos a partir de instrumentos que têm a coluna `ENABLED` definida como `YES` na tabela `setup_instruments`.

* `CONNECTION_TYPE`

O protocolo usado para estabelecer a conexão, ou `NULL` para threads de fundo. Os valores permitidos são `TCP/IP` (conexão TCP/IP estabelecida sem encriptação), `SSL/TLS` (conexão TCP/IP estabelecida com encriptação), `Socket` (conexão de arquivo de soquete Unix), `Named Pipe` (conexão de canal nomeado do Windows) e `Shared Memory` (conexão de memória compartilhada do Windows).

* `THREAD_OS_ID`

O identificador do thread ou tarefa, conforme definido pelo sistema operacional subjacente, se houver um:

+ Quando um thread MySQL está associado ao mesmo thread do sistema operacional durante toda a sua vida útil, `THREAD_OS_ID` contém o ID do thread do sistema operacional.

+ Quando um thread MySQL não está associado ao mesmo thread do sistema operacional ao longo de sua vida útil, `THREAD_OS_ID` contém `NULL`. Isso é típico de sessões de usuário quando o plugin de pool de threads é usado (veja Seção 5.5.3, “MySQL Enterprise Thread Pool”).

Para o Windows, `THREAD_OS_ID` corresponde ao ID de thread visível no Explorador de processos (<https://technet.microsoft.com/en-us/sysinternals/bb896653.aspx>).

Para o Linux, `THREAD_OS_ID` corresponde ao valor da função `gettid()`. Esse valor é exposto, por exemplo, usando os comandos **perf** ou **ps -L**, ou no sistema de arquivos `proc` (`/proc/[pid]/task/[tid]`). Para mais informações, consulte as páginas de manual `perf-stat(1)`, `ps(1)` e `proc(5)`.

`TRUNCATE TABLE` não é permitido para a tabela `threads`.