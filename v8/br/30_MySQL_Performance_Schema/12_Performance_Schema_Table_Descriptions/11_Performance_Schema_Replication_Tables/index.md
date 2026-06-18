### 29.12.11 Tabelas de Replicação do Schema de Desempenho

29.12.11.1 A tabela binary\_log\_transaction\_compression\_stats

29.12.11.2 A tabela replication\_applier\_configuration

29.12.11.3 A tabela replication\_applier\_status

29.12.11.4 A tabela replication\_applier\_status\_by\_coordinator

29.12.11.5 A tabela replication\_applier\_status\_by\_worker

29.12.11.6 A tabela replication\_applier\_filters

29.12.11.7 A tabela replication\_applier\_global\_filters

29.12.11.8 A tabela replication\_asynchronous\_connection\_failover

29.12.11.9 A tabela replication\_asynchronous\_connection\_failover\_managed

29.12.11.10 A tabela de configuração de conexão de replicação

29.12.11.11 A tabela replication\_connection\_status

29.12.11.12 A tabela replication\_group\_communication\_information

29.12.11.13 A tabela replication\_group\_configuration\_version

29.12.11.14 A tabela replication\_group\_member\_actions

29.12.11.15 A tabela replication\_group\_member\_stats

29.12.11.16 A tabela replication\_group\_members

O Schema de Desempenho fornece tabelas que exibem informações de replicação. Isso é semelhante às informações disponíveis a partir da declaração `SHOW REPLICA STATUS`, mas a representação em forma de tabela é mais acessível e oferece benefícios de usabilidade:

- A saída `SHOW REPLICA STATUS` é útil para inspeção visual, mas não tanto para uso programático. Por outro lado, ao usar as tabelas do Gerenciamento de Desempenho, as informações sobre o status da replicação podem ser pesquisadas usando consultas gerais `SELECT`, incluindo condições `WHERE` complexas, junções e assim por diante.

- Os resultados das consultas podem ser salvos em tabelas para análise posterior ou atribuídos a variáveis e, assim, utilizados em procedimentos armazenados.

- As tabelas de replicação fornecem informações de diagnóstico melhores. Para a operação de replicação multisserial, o `SHOW REPLICA STATUS` relata todos os erros do thread do coordenador e do trabalhador usando os campos `Last_SQL_Errno` e `Last_SQL_Error`, então apenas o mais recente desses erros é visível e as informações podem ser perdidas. As tabelas de replicação armazenam erros por thread sem perda de informações.

- A última transação vista é visível nas tabelas de replicação por trabalhador. Essa é uma informação que não está disponível no `SHOW REPLICA STATUS`.

- Os desenvolvedores familiarizados com a interface do Schema de Desempenho podem estender as tabelas de replicação para fornecer informações adicionais, adicionando linhas às tabelas.

#### Descrição das tabelas de replicação

O Schema de Desempenho fornece as seguintes tabelas relacionadas à replicação:

- Tabelas que contêm informações sobre a conexão da replica com a fonte:

  - `replication_connection_configuration`: Parâmetros de configuração para conectar-se à fonte

  - `replication_connection_status`: Status atual da conexão com a fonte

  - `replication_asynchronous_connection_failover`: Listas de fontes para o mecanismo de failover de conexão assíncrona

- Tabelas que contêm informações gerais (não específicas de um tópico) sobre o aplicativo de transação:

  - `replication_applier_configuration`: Parâmetros de configuração para o aplicativo de transação na replica.

  - `replication_applier_status`: Status atual do aplicativo de transação na replica.

- Tabelas que contêm informações sobre os threads específicos responsáveis pela aplicação das transações recebidas da fonte:

  - `replication_applier_status_by_coordinator`: Status da thread do coordenador (vazio, a menos que a replica seja multithreading).

  - `replication_applier_status_by_worker`: Status da thread do solicitante ou threads do trabalhador, se a replica for multithread.

- Tabelas que contêm informações sobre filtros de replicação baseados em canais:

  - `replication_applier_filters`: Fornece informações sobre os filtros de replicação configurados em canais de replicação específicos.

  - `replication_applier_global_filters`: Fornece informações sobre filtros de replicação global, que se aplicam a todos os canais de replicação.

- Tabelas que contêm informações sobre os membros da replicação em grupo:

  - `replication_group_members`: Fornece informações de rede e status para os membros do grupo.

  - `replication_group_member_stats`: Fornece informações estatísticas sobre os membros do grupo e as transações nas quais eles participam.

  Para mais informações, consulte a Seção 20.4, “Monitoramento da Replicação do Grupo”.

As seguintes tabelas de replicação do Schema de Desempenho continuam a ser preenchidas quando o Schema de Desempenho é desativado:

- `replication_connection_configuration`
- `replication_connection_status`
- `replication_asynchronous_connection_failover`
- `replication_applier_configuration`
- `replication_applier_status`
- `replication_applier_status_by_coordinator`
- `replication_applier_status_by_worker`

A exceção é a informação de sincronização local (horários de início e término das transações) nas tabelas de replicação `replication_connection_status`, `replication_applier_status_by_coordinator` e `replication_applier_status_by_worker`. Essa informação não é coletada quando o Schema de Desempenho está desativado.

As seções a seguir descrevem cada tabela de replicação com mais detalhes, incluindo a correspondência entre as colunas produzidas por `SHOW REPLICA STATUS` e as colunas da tabela de replicação nas quais as mesmas informações aparecem.

O restante desta introdução sobre as tabelas de replicação descreve como o Schema de Desempenho as preenche e quais campos do `SHOW REPLICA STATUS` não estão representados nas tabelas.

#### Ciclo de vida da tabela de replicação

O esquema de desempenho popula as tabelas de replicação da seguinte forma:

- Antes da execução de `CHANGE REPLICATION SOURCE TO` | `CHANGE MASTER TO`, as tabelas estão vazias.

- Após `CHANGE REPLICATION SOURCE TO` | `CHANGE MASTER TO`, os parâmetros de configuração podem ser vistos nas tabelas. Neste momento, não há threads de replicação ativas, portanto, as colunas `THREAD_ID` são `NULL` e as colunas `SERVICE_STATE` têm um valor de `OFF`.

- Após `START REPLICA` (ou antes do MySQL 8.0.22, `START SLAVE`), valores não `NULL` `THREAD_ID` podem ser vistos. Fios que estão inativos ou ativos têm um valor de `SERVICE_STATE` de `ON`. O fio que se conecta à fonte tem um valor de `CONNECTING` enquanto estabelece a conexão e `ON` posteriormente, enquanto a conexão durar.

- Após `STOP REPLICA`, as colunas `THREAD_ID` se tornam `NULL` e as colunas `SERVICE_STATE` para os tópicos que não existem mais têm um valor de `OFF`.

- As tabelas são preservadas após `STOP REPLICA` ou quando os threads param devido a um erro.

- A tabela `replication_applier_status_by_worker` não está vazia apenas quando a replica está operando no modo multithreading. Ou seja, se a variável de sistema `replica_parallel_workers` ou `slave_parallel_workers` for maior que 0, esta tabela é preenchida quando o `START REPLICA` é executado, e o número de linhas mostra o número de trabalhadores.

#### Informações de status de réplica não estão nas tabelas de replicação

As informações nas tabelas de replicação do Schema de Desempenho diferem um pouco das informações disponíveis no `SHOW REPLICA STATUS`, pois as tabelas são orientadas para o uso de identificadores de transações globais (GTIDs), não para nomes e posições de arquivos, e representam valores de UUID do servidor, não de IDs de servidor. Devido a essas diferenças, várias colunas do `SHOW REPLICA STATUS` não são preservadas nas tabelas de replicação do Schema de Desempenho ou são representadas de maneira diferente:

- Os campos a seguir referem-se a nomes de arquivos e posições e não são preservados:

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

- O campo `Master_Info_File` não é preservado. Ele se refere ao arquivo `master.info`, usado para o repositório de metadados da fonte da replica, que foi substituído pelo uso de tabelas seguras em caso de falha para o repositório.

- Os campos a seguir são baseados em `server_id`, não em `server_uuid`, e não são preservados:

  ```
  Master_Server_Id
  Replicate_Ignore_Server_Ids
  ```

- O campo `Skip_Counter` é baseado em contagem de eventos, não em GTIDs, e não é preservado.

- Esses campos de erro são aliases para `Last_SQL_Errno` e `Last_SQL_Error`, portanto, eles não são preservados:

  ```
  Last_Errno
  Last_Error
  ```

  No Schema de Desempenho, essas informações de erro estão disponíveis nas colunas `LAST_ERROR_NUMBER` e `LAST_ERROR_MESSAGE` da tabela `replication_applier_status_by_worker` (e `replication_applier_status_by_coordinator` se a replica for multithreading). Essas tabelas fornecem informações de erro específicas por thread mais específicas do que as disponíveis em `Last_Errno` e `Last_Error`.

- Os campos que fornecem informações sobre as opções de filtragem da linha de comando não são preservados:

  ```
  Replicate_Do_DB
  Replicate_Ignore_DB
  Replicate_Do_Table
  Replicate_Ignore_Table
  Replicate_Wild_Do_Table
  Replicate_Wild_Ignore_Table
  ```

- Os campos `Replica_IO_State` e `Replica_SQL_Running_State` não são preservados. Se necessário, esses valores podem ser obtidos da lista de processos usando a coluna `THREAD_ID` da tabela de replicação apropriada e combinando-a com a coluna `ID` na tabela `INFORMATION_SCHEMA` `PROCESSLIST` para selecionar a coluna `STATE` da última tabela.

- O campo `Executed_Gtid_Set` pode exibir um grande conjunto com uma quantidade significativa de texto. Em vez disso, as tabelas do Schema de Desempenho mostram GTIDs de transações que estão sendo aplicadas atualmente pela replica. Alternativamente, o conjunto de GTIDs executados pode ser obtido a partir do valor da variável de sistema `gtid_executed`.

- Os campos `Seconds_Behind_Master` e `Relay_Log_Space` estão em status a ser decidido e não são preservados.

#### Canais de replicação

A primeira coluna das tabelas do Schema de Desempenho de Replicação é `CHANNEL_NAME`. Isso permite que as tabelas sejam visualizadas por canal de replicação. Em uma configuração de replicação não multifonte, há um único canal de replicação padrão. Quando você está usando vários canais de replicação em uma replica, você pode filtrar as tabelas por canal de replicação para monitorar um canal de replicação específico. Consulte a Seção 19.2.2, “Canais de Replicação” e a Seção 19.1.5.8, “Monitoramento de Replicação Multifonte” para obter mais informações.
