### 29.12.11 Tabelas de Replicação do Schema de Desempenho

29.12.11.1 A tabela `binary\_log\_transaction\_compression\_stats`

29.12.11.2 A tabela `replication\_applier\_configuration`

29.12.11.3 A tabela `replication\_applier\_filters`

29.12.11.4 A tabela `replication\_applier\_global\_filters`

29.12.11.5 A tabela `replication\_applier\_metrics`

29.12.11.6 A tabela `replication\_applier\_progress\_by\_worker`

29.12.11.7 A tabela `replication\_applier\_status`

29.12.11.8 A tabela `replication\_applier\_status\_by\_coordinator`

29.12.11.9 A tabela `replication\_applier\_status\_by\_worker`

29.12.11.10 A tabela `replication\_asynchronous\_connection\_failover`

29.12.11.11 A tabela `replication\_asynchronous\_connection\_failover\_managed`

29.12.11.12 A tabela `replication\_connection\_configuration`

29.12.11.13 A tabela `replication\_connection\_status`

29.12.11.14 A tabela `replication\_group\_communication\_information`

29.12.11.15 A tabela `replication\_group\_configuration\_version`

29.12.11.16 A tabela `replication\_group\_member\_actions`

29.12.11.17 A tabela `replication\_group\_member\_stats`

29.12.11.18 A tabela `replication\_group\_members`

O Schema de Desempenho fornece tabelas que exibem informações de replicação. Isso é semelhante às informações disponíveis a partir da instrução `SHOW REPLICA STATUS`, mas a representação em formato de tabela é mais acessível e tem benefícios de usabilidade:

* A saída da instrução `SHOW REPLICA STATUS` é útil para inspeção visual, mas não tanto para uso programático. Em contraste, ao usar as tabelas do Schema de Desempenho, as informações sobre o status da replicação podem ser pesquisadas usando consultas `SELECT` gerais, incluindo condições `WHERE` complexas, junções e assim por diante.

* Os resultados das consultas podem ser salvos em tabelas para análise posterior ou atribuídos a variáveis e, assim, utilizados em procedimentos armazenados.

* As tabelas de replicação fornecem informações de diagnóstico melhores. Para a operação de replicação multithread, o `SHOW REPLICA STATUS` relata todos os erros de thread do coordenador e do trabalhador usando os campos `Last_SQL_Errno` e `Last_SQL_Error`, de modo que apenas o erro mais recente desses erros é visível e as informações podem ser perdidas. As tabelas de replicação armazenam erros por thread sem perda de informações.

* A última transação vista é visível nas tabelas de replicação por trabalhador. Esta é uma informação não disponível no `SHOW REPLICA STATUS`.

* Desenvolvedores familiarizados com a interface do Schema de Desempenho podem estender as tabelas de replicação para fornecer informações adicionais, adicionando linhas às tabelas.

Nota

A Edição Empresarial do MySQL inclui dois componentes que fornecem informações relacionadas ao desempenho da replicação. O componente de Estatísticas de Controle de Fluxo de Replicação em Grupo permite várias variáveis de status do servidor que fornecem informações sobre a execução do controle de fluxo de replicação em grupo; consulte a Seção 7.5.6.2, “Componente de Estatísticas de Controle de Fluxo de Replicação em Grupo”. O componente de Métricas do Aplicador de Replicação implementa duas tabelas do Schema de Desempenho `replication_applier_metrics` e `replication_applier_progress_by_worker`, ambas descritas mais adiante nesta seção; para informações sobre o componente, consulte a Seção 7.5.6.1, “Componente de Métricas do Aplicador de Replicação”.

#### Descrições das Tabelas de Replicação

O Schema de Desempenho fornece as seguintes tabelas relacionadas à replicação:

* Tabelas que contêm informações sobre a conexão da replica com a fonte:

  + `replication_connection_configuration`: Parâmetros de configuração para conectar-se à fonte


+ `replication_connection_status`: Status atual da conexão com a fonte

  + `replication_asynchronous_connection_failover`: Listas de fontes para o mecanismo de failover de conexão assíncrona

* Tabelas que contêm informações gerais (não específicas de thread) sobre o aplicador de transações:

  + `replication_applier_configuration`: Parâmetros de configuração para o aplicador de transações na replica.

  + `replication_applier_status`: Status atual do aplicador de transações na replica.

* Tabelas que contêm informações sobre threads específicos responsáveis pela aplicação de transações recebidas da fonte:

  + `replication_applier_status_by_coordinator`: Status da thread do coordenador (vazio a menos que a replica seja multithread).

  + `replication_applier_status_by_worker`: Status da thread do aplicador ou dos threads do trabalhador, se a replica for multithread.

* Tabelas que contêm informações sobre filtros de replicação baseados em canais:

  + `replication_applier_filters`: Fornece informações sobre os filtros de replicação configurados em canais de replicação específicos.

  + `replication_applier_global_filters`: Fornece informações sobre filtros de replicação globais, que se aplicam a todos os canais de replicação.

* Tabelas que contêm informações sobre membros da replicação por grupo:

  + `replication_group_members`: Fornece informações de rede e status para os membros do grupo.

  + `replication_group_member_stats`: Fornece informações estatísticas sobre os membros do grupo e as transações nas quais eles participam.

Para mais informações, consulte a Seção 20.4, “Monitoramento da Replicação por Grupo”.

As seguintes tabelas de replicação do Schema de Desempenho continuam a ser preenchidas quando o Schema de Desempenho é desativado:

* `configuração_de_conexão_de_replicação`
* `status_de_conexão_de_replicação`
* `failover_de_conexão_asíncrona_de_replicação`
* `configuração_de_aplicador_de_replicação`
* `status_de_aplicador_de_replicação`
* `status_de_aplicador_de_replicação_por_coordenador`
* `status_de_aplicador_de_replicação_por_operador`

A exceção são as informações de temporização local (datas e horas de início e fim das transações) nas tabelas de replicação `status_de_conexão_de_replicação`, `status_de_aplicador_de_replicação_por_coordenador` e `status_de_aplicador_de_replicação_por_operador`. Essas informações não são coletadas quando o Schema de Desempenho está desativado.

As seções a seguir descrevem cada tabela de replicação com mais detalhes, incluindo a correspondência entre as colunas produzidas pelo `SHOW REPLICA STATUS` e as colunas da tabela de replicação nas quais as mesmas informações aparecem.

O restante desta introdução às tabelas de replicação descreve como o Schema de Desempenho as popula e quais campos do `SHOW REPLICA STATUS` não são representados nas tabelas.

#### Ciclo de Vida da Tabela de Replicação

O Schema de Desempenho popula as tabelas de replicação da seguinte forma:

* Antes da execução de `CHANGE REPLICATION SOURCE TO`, as tabelas estão vazias.

* Após `CHANGE REPLICATION SOURCE TO`, os parâmetros de configuração podem ser vistos nas tabelas. Neste momento, não há threads de replicação ativas, então as colunas `THREAD_ID` são `NULL` e as colunas `SERVICE_STATE` têm um valor de `OFF`.

* Após `START REPLICA`, valores não nulos de `THREAD_ID` podem ser vistos. Os threads que estão inativos ou ativos têm um valor de `SERVICE_STATE` de `ON`. O thread que se conecta à fonte tem um valor de `CONNECTING` enquanto estabelece a conexão e `ON` posteriormente enquanto a conexão durar.

* Após `STOP REPLICA`, as colunas `THREAD_ID` tornam-se `NULL` e as colunas `SERVICE_STATE` para os threads que não existem mais têm um valor de `OFF`.

* As tabelas são preservadas após `STOP REPLICA` ou quando os threads param devido a um erro.

* Esta tabela é preenchida quando `START REPLICA` é executado, e o número de linhas mostra o número de trabalhadores.

#### Informações de Status da Replica Não estão nas Tabelas de Replicação

As informações nas tabelas de replicação do Performance Schema diferem um pouco das informações disponíveis no `SHOW REPLICA STATUS` porque as tabelas são orientadas para o uso de identificadores de transações globais (GTIDs), não de nomes e posições de arquivos, e representam valores de UUID do servidor, não de valores de ID do servidor. Devido a essas diferenças, várias colunas do `SHOW REPLICA STATUS` não são preservadas nas tabelas de replicação do Performance Schema, ou são representadas de maneira diferente:

* Os seguintes campos referem-se a nomes e posições de arquivos e não são preservados:

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

* O campo `Master_Info_File` não é preservado. Ele se refere ao arquivo `master.info` usado para o repositório de metadados da replica, que foi substituído pelo uso de tabelas seguras em caso de falha para o repositório.

* Os seguintes campos são baseados em `server_id`, não em `server_uuid`, e não são preservados:

  ```
  Master_Server_Id
  Replicate_Ignore_Server_Ids
  ```

* O campo `Skip_Counter` é baseado em contagem de eventos, não em GTIDs, e não é preservado.

* Esses campos de erro são aliases para `Last_SQL_Errno` e `Last_SQL_Error`, então não são preservados:

  ```
  Last_Errno
  Last_Error
  ```

No Schema de Desempenho, essas informações de erro estão disponíveis nas colunas `LAST_ERROR_NUMBER` e `LAST_ERROR_MESSAGE` da tabela `replication_applier_status_by_worker` (e `replication_applier_status_by_coordinator` se a replica for multithreading). Essas tabelas fornecem informações de erro específicas por thread, o que é mais detalhado do que o disponível em `Last_Errno` e `Last_Error`.

* Os campos que fornecem informações sobre opções de filtragem de linha de comando não são preservados:

  ```
  Replicate_Do_DB
  Replicate_Ignore_DB
  Replicate_Do_Table
  Replicate_Ignore_Table
  Replicate_Wild_Do_Table
  Replicate_Wild_Ignore_Table
  ```

* Os campos `Replica_IO_State` e `Replica_SQL_Running_State` não são preservados. Se necessário, esses valores podem ser obtidos da lista de processos usando a coluna `THREAD_ID` da tabela de replicação apropriada e realizando uma junção com a coluna `ID` na tabela `PROCESSLIST` do `INFORMATION_SCHEMA` para selecionar a coluna `STATE` da última tabela.

* O campo `Executed_Gtid_Set` pode exibir um grande conjunto com uma quantidade significativa de texto. Em vez disso, as tabelas do Schema de Desempenho mostram GTIDs de transações que estão atualmente sendo aplicadas pela replica. Alternativamente, o conjunto de GTIDs executados pode ser obtido pelo valor da variável de sistema `gtid_executed`.

* Os campos `Seconds_Behind_Master` e `Relay_Log_Space` estão em status a ser decidido e não são preservados.