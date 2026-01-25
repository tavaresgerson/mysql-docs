### 25.12.11 Tabelas de Replication do Performance Schema

[25.12.11.1 A Tabela replication_connection_configuration](performance-schema-replication-connection-configuration-table.html)

[25.12.11.2 A Tabela replication_connection_status](performance-schema-replication-connection-status-table.html)

[25.12.11.3 A Tabela replication_applier_configuration](performance-schema-replication-applier-configuration-table.html)

[25.12.11.4 A Tabela replication_applier_status](performance-schema-replication-applier-status-table.html)

[25.12.11.5 A Tabela replication_applier_status_by_coordinator](performance-schema-replication-applier-status-by-coordinator-table.html)

[25.12.11.6 A Tabela replication_applier_status_by_worker](performance-schema-replication-applier-status-by-worker-table.html)

[25.12.11.7 A Tabela replication_group_member_stats](performance-schema-replication-group-member-stats-table.html)

[25.12.11.8 A Tabela replication_group_members](performance-schema-replication-group-members-table.html)

O Performance Schema fornece tabelas que expõem informações de Replication. Isso é similar à informação disponível a partir da instrução [`SHOW SLAVE STATUS`], mas a representação em formato de tabela é mais acessível e oferece benefícios de usabilidade:

* O output de [`SHOW SLAVE STATUS`] é útil para inspeção visual, mas não tanto para uso programático. Em contraste, usando as tabelas do Performance Schema, a informação sobre o Status da replica pode ser pesquisada usando Queries [`SELECT`] gerais, incluindo condições `WHERE` complexas, joins, e assim por diante.

* Resultados de Query podem ser salvos em tabelas para análise posterior, ou atribuídos a variáveis e, assim, usados em stored procedures.

* As tabelas de Replication fornecem melhores informações de diagnóstico. Para a operação multithreaded da replica, [`SHOW SLAVE STATUS`] reporta todos os erros do Thread Coordinator e Worker usando os campos `Last_SQL_Errno` e `Last_SQL_Error`, de modo que apenas o mais recente desses erros é visível e a informação pode ser perdida. As tabelas de Replication armazenam erros numa base por Thread (per-thread) sem perda de informação.

* A última transaction vista é visível nas tabelas de Replication numa base por Worker (per-worker). Esta é uma informação não disponível a partir de [`SHOW SLAVE STATUS`].

* Desenvolvedores familiarizados com a interface do Performance Schema podem estender as tabelas de Replication para fornecer informações adicionais, adicionando linhas às tabelas.

#### Descrições das Tabelas de Replication

O Performance Schema fornece as seguintes tabelas relacionadas à Replication:

* Tabelas que contêm informações sobre a conexão de uma replica ao servidor Source de Replication:

  + [`replication_connection_configuration`]: Parâmetros de configuração para conexão com o Source.

  + [`replication_connection_status`]: Status atual da conexão com o Source.

* Tabelas que contêm informações gerais (não específicas de Thread) sobre o Applier de Transaction:

  + [`replication_applier_configuration`]: Parâmetros de configuração para o Applier de Transaction na replica.

  + [`replication_applier_status`]: Status atual do Applier de Transaction na replica.

* Tabelas que contêm informações sobre Threads específicos responsáveis por aplicar Transactions recebidas do Source:

  + [`replication_applier_status_by_coordinator`]: Status do Thread Coordinator (vazio, a menos que a replica seja multithreaded).

  + [`replication_applier_status_by_worker`]: Status do Thread Applier ou Worker Threads se a replica for multithreaded.

* Tabelas que contêm informações sobre membros do Replication Group:

  + [`replication_group_members`]: Fornece informações de rede e Status para os membros do Group.

  + [`replication_group_member_stats`]: Fornece informações estatísticas sobre os membros do Group e as Transactions nas quais eles participam.

As seções a seguir descrevem cada tabela de Replication com mais detalhes, incluindo a correspondência entre as colunas produzidas pela instrução [`SHOW SLAVE STATUS`] e as colunas das tabelas de Replication nas quais a mesma informação aparece.

O restante desta introdução às tabelas de Replication descreve como o Performance Schema as preenche e quais campos de [`SHOW SLAVE STATUS`] não são representados nas tabelas.

#### Ciclo de Vida das Tabelas de Replication

O Performance Schema preenche as tabelas de Replication da seguinte forma:

* Antes da execução de [`CHANGE MASTER TO`], as tabelas estão vazias.

* Após [`CHANGE MASTER TO`], os parâmetros de configuração podem ser vistos nas tabelas. Neste momento, não há Threads de replica ativos, portanto, as colunas `THREAD_ID` são `NULL` e as colunas `SERVICE_STATE` têm o valor `OFF`.

* Após [`START SLAVE`], valores não-`NULL` de `THREAD_ID` podem ser vistos. Threads que estão idle ou ativos têm um valor `SERVICE_STATE` de `ON`. O Thread que se conecta ao Source tem um valor de `CONNECTING` enquanto estabelece a conexão, e `ON` depois, enquanto a conexão durar.

* Após [`STOP SLAVE`], as colunas `THREAD_ID` se tornam `NULL` e as colunas `SERVICE_STATE` para Threads que não existem mais têm o valor `OFF`.

* As tabelas são preservadas após [`STOP SLAVE`] ou Threads morrendo devido a um erro.

* A tabela [`replication_applier_status_by_worker`] só não está vazia quando a replica está operando em modo multithreaded. Ou seja, se a variável de sistema [`slave_parallel_workers`] for maior que 0, esta tabela é preenchida quando [`START SLAVE`] é executado, e o número de linhas mostra o número de Workers.

#### Informações de [`SHOW SLAVE STATUS`] Não Presentes nas Tabelas de Replication

A informação nas tabelas de Replication do Performance Schema difere um pouco da informação disponível a partir de [`SHOW SLAVE STATUS`] porque as tabelas são orientadas para o uso de GTIDs (global transaction identifiers), e não para nomes de arquivos e posições, e elas representam valores de `server UUID`, e não valores de `server ID`. Devido a essas diferenças, várias colunas de [`SHOW SLAVE STATUS`] não são preservadas nas tabelas de Replication do Performance Schema, ou são representadas de uma forma diferente:

* Os seguintes campos referem-se a nomes de arquivos e posições e não são preservados:

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

* O campo `Master_Info_File` não é preservado. Ele se refere ao arquivo `master.info`, que foi substituído por tabelas crash-safe.

* Os seguintes campos são baseados em [`server_id`], não em [`server_uuid`], e não são preservados:

  ```sql
  Master_Server_Id
  Replicate_Ignore_Server_Ids
  ```

* O campo `Skip_Counter` é baseado em contagens de event, não em GTIDs, e não é preservado.

* Estes campos de erro são aliases para `Last_SQL_Errno` e `Last_SQL_Error`, então eles não são preservados:

  ```sql
  Last_Errno
  Last_Error
  ```

  No Performance Schema, esta informação de erro está disponível nas colunas `LAST_ERROR_NUMBER` e `LAST_ERROR_MESSAGE` da tabela [`replication_applier_status_by_worker`] (e [`replication_applier_status_by_coordinator`] se a replica for multithreaded). Essas tabelas fornecem informações de erro por Thread mais específicas do que as disponíveis em `Last_Errno` e `Last_Error`.

* Campos que fornecem informações sobre opções de filtragem de linha de comando não são preservados:

  ```sql
  Replicate_Do_DB
  Replicate_Ignore_DB
  Replicate_Do_Table
  Replicate_Ignore_Table
  Replicate_Wild_Do_Table
  Replicate_Wild_Ignore_Table
  ```

* Os campos `Slave_IO_State` e `Slave_SQL_Running_State` não são preservados. Se necessário, esses valores podem ser obtidos a partir da process list usando a coluna `THREAD_ID` da tabela de Replication apropriada e fazendo Join com a coluna `ID` na tabela [`PROCESSLIST`] do `INFORMATION_SCHEMA` para selecionar a coluna `STATE` desta última tabela.

* O campo `Executed_Gtid_Set` pode mostrar um conjunto grande com uma quantidade extensa de texto. Em vez disso, as tabelas do Performance Schema mostram os GTIDs de Transactions que estão sendo aplicadas atualmente pela replica. Alternativamente, o conjunto de GTIDs executados pode ser obtido a partir do valor da variável de sistema [`gtid_executed`].

* Os campos `Seconds_Behind_Master` e `Relay_Log_Space` estão em status de "a ser decidido" e não são preservados.

#### Variáveis de Status Movidas para as Tabelas de Replication

A partir da versão 5.7.5 do MySQL, as seguintes variáveis de Status (anteriormente monitoradas usando [`SHOW STATUS`]) foram movidas para as tabelas de Replication do Performance Schema:

* [`Slave_retried_transactions`]
* [`Slave_last_heartbeat`]
* [`Slave_received_heartbeats`]
* [`Slave_heartbeat_period`]
* [`Slave_running`]

Estas variáveis de Status agora são relevantes apenas quando um único Replication Channel está sendo usado, pois elas *apenas* reportam o Status do Replication Channel padrão. Quando múltiplos Replication Channels existem, utilize as tabelas de Replication do Performance Schema descritas nesta seção, que reportam estas variáveis para cada Replication Channel existente.

#### Replication Channels

A primeira coluna das tabelas de Replication do Performance Schema é `CHANNEL_NAME`. Isso permite que as tabelas sejam visualizadas por Replication Channel. Em uma configuração de Replication não-multisource, há um único Replication Channel padrão. Quando você está usando múltiplos Replication Channels em uma replica, você pode filtrar as tabelas por Replication Channel para monitorar um Replication Channel específico. Consulte [Seção 16.2.2, “Replication Channels”] e [Seção 16.1.5.8, “Multi-Source Replication Monitoring”] para obter mais informações.