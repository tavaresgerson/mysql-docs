### 25.12.11 Tabelas de Replicação do Schema de Desempenho

25.12.11.1 Tabela de configuração de conexão de replicação

25.12.11.2 Tabela de status\_de\_conexão\_de\_replicação

25.12.11.3 A tabela replication\_applier\_configuration

25.12.11.4 A tabela replication\_applier\_status

25.12.11.5 A tabela replication\_applier\_status\_by\_coordinator

25.12.11.6 A tabela replication\_applier\_status\_by\_worker

25.12.11.7 A tabela replication\_group\_member\_stats

25.12.11.8 A tabela replication\_group\_members

O Schema de Desempenho fornece tabelas que exibem informações de replicação. Isso é semelhante às informações disponíveis a partir da declaração `SHOW SLAVE STATUS`, mas a representação em formato de tabela é mais acessível e oferece benefícios de usabilidade:

- A saída `SHOW SLAVE STATUS` é útil para inspeção visual, mas não tanto para uso programático. Por outro lado, ao usar as tabelas do Schema de Desempenho, as informações sobre o status da replica podem ser pesquisadas usando consultas gerais de `SELECT` (select.html), incluindo condições `WHERE` complexas, junções e assim por diante.

- Os resultados das consultas podem ser salvos em tabelas para análise posterior ou atribuídos a variáveis e, assim, utilizados em procedimentos armazenados.

- As tabelas de replicação fornecem informações de diagnóstico melhores. Para a operação de replicação multisserial, o `SHOW SLAVE STATUS` (exibir status do escravo) relata todos os erros do thread do coordenador e do trabalhador usando os campos `Last_SQL_Errno` e `Last_SQL_Error`, então apenas o mais recente desses erros é visível e as informações podem ser perdidas. As tabelas de replicação armazenam erros por thread sem perda de informações.

- A última transação vista é visível nas tabelas de replicação por trabalhador. Essa é uma informação que não está disponível no `SHOW SLAVE STATUS`.

- Os desenvolvedores familiarizados com a interface do Schema de Desempenho podem estender as tabelas de replicação para fornecer informações adicionais, adicionando linhas às tabelas.

#### Descrição das tabelas de replicação

O Schema de Desempenho fornece as seguintes tabelas relacionadas à replicação:

- Tabelas que contêm informações sobre a conexão de uma réplica com o servidor de origem de replicação:

  - `configuração_de_conexão_de_replicação`: Parâmetros de configuração para conectar-se à fonte

  - `replicação_conexão_status`: Status atual da conexão com a fonte

- Tabelas que contêm informações gerais (não específicas de um tópico) sobre o aplicativo de transação:

  - `replication_applier_configuration`: Parâmetros de configuração para o aplicador de transações na replica.

  - `replication_applier_status`: Status atual do aplicador de transações na replica.

- Tabelas que contêm informações sobre os threads específicos responsáveis pela aplicação das transações recebidas da fonte:

  - `replication_applier_status_by_coordinator`: Status da thread do coordenador (vazio, a menos que a replica seja multithreading).

  - `replication_applier_status_by_worker`: Status da thread do aplicador ou threads do trabalhador se a replica for multithread.

- Tabelas que contêm informações sobre os membros do grupo de replicação:

  - `replication_group_members`: Fornece informações de rede e status para os membros do grupo.

  - `replication_group_member_stats`: Fornece informações estatísticas sobre os membros do grupo e as transações nas quais eles participam.

As seções a seguir descrevem cada tabela de replicação com mais detalhes, incluindo a correspondência entre as colunas produzidas por `SHOW SLAVE STATUS` e as colunas da tabela de replicação nas quais as mesmas informações aparecem.

O restante desta introdução sobre as tabelas de replicação descreve como o Gerenciamento de Desempenho as preenche e quais campos do `SHOW SLAVE STATUS` não estão representados nas tabelas.

#### Ciclo de vida da tabela de replicação

O esquema de desempenho popula as tabelas de replicação da seguinte forma:

- Antes da execução de `CHANGE MASTER TO`, as tabelas estão vazias.

- Após `CHANGE MASTER TO`, os parâmetros de configuração podem ser vistos nas tabelas. Neste momento, não há threads de replicação ativas, portanto, as colunas `THREAD_ID` são `NULL` e as colunas `SERVICE_STATE` têm um valor de `OFF`.

- Após `START SLAVE`, valores de `THREAD_ID` que não são `NULL` podem ser vistos. Os threads que estão inativos ou ativos têm um valor de `SERVICE_STATE` de `ON`. O thread que se conecta à fonte tem um valor de `CONNECTING` enquanto está estabelecendo a conexão e `ON` depois disso, enquanto a conexão durar.

- Após `STOP SLAVE`, as colunas `THREAD_ID` tornam-se `NULL` e as colunas `SERVICE_STATE` para os threads que não existem mais têm um valor de `OFF`.

- As tabelas são preservadas após `STOP SLAVE` ou quando os threads morrem devido a um erro.

- A tabela `replication_applier_status_by_worker` não está vazia apenas quando a replica está operando no modo multithreading. Ou seja, se a variável de sistema \[`slave_parallel_workers`]\(replication-options-replica.html#sysvar\_slave\_parallel\_workers] for maior que 0, esta tabela é preenchida quando o comando `START SLAVE` é executado, e o número de linhas mostra o número de trabalhadores.

#### `Mostrar Status de Escravo` Informações Não na Tabelas de Replicação

As informações nas tabelas de replicação do Schema de Desempenho diferem um pouco das informações disponíveis no `SHOW SLAVE STATUS`, pois as tabelas são orientadas para o uso de identificadores de transações globais (GTIDs), não para nomes e posições de arquivos, e representam valores de UUID do servidor, não de IDs de servidor. Devido a essas diferenças, várias colunas do `SHOW SLAVE STATUS` não são preservadas nas tabelas de replicação do Schema de Desempenho ou são representadas de maneira diferente:

- Os campos a seguir referem-se a nomes de arquivos e posições e não são preservados:

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

- O campo `Master_Info_File` não é preservado. Ele se refere ao arquivo `master.info`, que foi substituído por tabelas seguras em caso de falha.

- Os campos a seguir são baseados em `server_id`, e não em `server_uuid`, e não são preservados:

  ```sql
  Master_Server_Id
  Replicate_Ignore_Server_Ids
  ```

- O campo `Skip_Counter` é baseado em contagem de eventos, não em GTIDs, e não é preservado.

- Esses campos de erro são aliases para `Last_SQL_Errno` e `Last_SQL_Error`, então eles não são preservados:

  ```sql
  Last_Errno
  Last_Error
  ```

  No Schema de Desempenho, essas informações de erro estão disponíveis nas colunas `LAST_ERROR_NUMBER` e `LAST_ERROR_MESSAGE` da tabela `replication_applier_status_by_worker. Essas tabelas fornecem informações de erro mais específicas por thread do que as disponíveis em `Last_Errno` e `Last_Error`.

- Os campos que fornecem informações sobre as opções de filtragem da linha de comando não são preservados:

  ```sql
  Replicate_Do_DB
  Replicate_Ignore_DB
  Replicate_Do_Table
  Replicate_Ignore_Table
  Replicate_Wild_Do_Table
  Replicate_Wild_Ignore_Table
  ```

- Os campos `Slave_IO_State` e `Slave_SQL_Running_State` não são preservados. Se necessário, esses valores podem ser obtidos da lista de processos usando a coluna `THREAD_ID` da tabela de replicação apropriada e realizando uma junção com a coluna `ID` na tabela `INFORMATION_SCHEMA `PROCESSLIST` para selecionar a coluna `STATE\` da última tabela.

- O campo `Executed_Gtid_Set` pode exibir um conjunto grande com uma grande quantidade de texto. Em vez disso, as tabelas do Schema de Desempenho mostram GTIDs de transações que estão sendo aplicadas atualmente pela replica. Alternativamente, o conjunto de GTIDs executados pode ser obtido a partir do valor da variável de sistema `gtid_executed`.

- Os campos `Seconds_Behind_Master` e `Relay_Log_Space` estão em status a ser decidido e não são preservados.

#### Variáveis de status movidas para tabelas de replicação

A partir da versão 5.7.5 do MySQL, as seguintes variáveis de status (anteriormente monitoradas usando `SHOW STATUS`) foram movidas para as tabelas de replicação do Schema de Desempenho:

- `Slave_retried_transactions`
- `Slave_last_heartbeat`
- `Slave_received_heartbeats`
- `Slave_heartbeat_period`
- `Slave_running`

Essas variáveis de status são agora relevantes apenas quando um único canal de replicação está sendo usado, pois elas *apenas* relatam o status do canal de replicação padrão. Quando existem vários canais de replicação, use as tabelas de replicação do Schema de Desempenho descritas nesta seção, que relatam essas variáveis para cada canal de replicação existente.

#### Canais de replicação

A primeira coluna das tabelas do Schema de Desempenho de Replicação é `CHANNEL_NAME`. Isso permite que as tabelas sejam visualizadas por canal de replicação. Em uma configuração de replicação não multifonte, há um único canal de replicação padrão. Quando você está usando vários canais de replicação em uma réplica, você pode filtrar as tabelas por canal de replicação para monitorar um canal de replicação específico. Consulte Seção 16.2.2, “Canais de Replicação” e Seção 16.1.5.8, “Monitoramento de Replicação Multifonte” para obter mais informações.
