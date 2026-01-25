### 24.3.18 A Tabela PROCESSLIST do INFORMATION_SCHEMA

A lista de processos do MySQL indica as operações que estão sendo executadas atualmente pelo conjunto de Threads em execução dentro do servidor. A tabela [`PROCESSLIST`](information-schema-processlist-table.html "24.3.18 The INFORMATION_SCHEMA PROCESSLIST Table") é uma fonte de informações de processo. Para uma comparação desta tabela com outras fontes, consulte [Sources of Process Information](processlist-access.html#processlist-sources "Sources of Process Information").

A tabela [`PROCESSLIST`](information-schema-processlist-table.html "24.3.18 The INFORMATION_SCHEMA PROCESSLIST Table") possui estas colunas:

* `ID`

  O identificador da conexão. Este é o mesmo valor exibido na coluna `Id` da instrução [`SHOW PROCESSLIST`](show-processlist.html "13.7.5.29 SHOW PROCESSLIST Statement"), exibido na coluna `PROCESSLIST_ID` da tabela [`threads`](performance-schema-threads-table.html "25.12.16.4 The threads Table") do Performance Schema, e retornado pela função [`CONNECTION_ID()`](information-functions.html#function_connection-id) dentro do Thread.

* `USER`

  O usuário MySQL que emitiu a instrução. Um valor de `system user` se refere a um Thread não-cliente gerado pelo servidor para lidar com tarefas internas, como, por exemplo, um Thread de manipulador de linha atrasada ou um Thread de I/O ou SQL usado em hosts replica. Para `system user`, não há host especificado na coluna `Host`. `unauthenticated user` se refere a um Thread que se associou a uma conexão de cliente, mas para o qual a autenticação do usuário cliente ainda não ocorreu. `event_scheduler` se refere ao Thread que monitora eventos agendados (consulte [Section 23.4, “Using the Event Scheduler”](event-scheduler.html "23.4 Using the Event Scheduler")).

* `HOST`

  O nome do host do cliente que emite a instrução (exceto para `system user`, para o qual não há host). O nome do host para conexões TCP/IP é reportado no formato `host_name:client_port` para facilitar a determinação de qual cliente está fazendo o quê.

* `DB`

  O Database padrão para o Thread, ou `NULL` se nenhum foi selecionado.

* `COMMAND`

  O tipo de comando que o Thread está executando em nome do cliente, ou `Sleep` se a sessão estiver ociosa. Para descrições de comandos de Thread, consulte [Section 8.14, “Examining Server Thread (Process) Information”](thread-information.html "8.14 Examining Server Thread (Process) Information"). O valor desta coluna corresponde aos comandos `COM_xxx` do protocolo cliente/servidor e às variáveis de status `Com_xxx`. Consulte [Section 5.1.9, “Server Status Variables”](server-status-variables.html "5.1.9 Server Status Variables").

* `TIME`

  O tempo em segundos que o Thread permaneceu em seu estado atual. Para um Thread SQL de réplica, o valor é o número de segundos entre o timestamp do último evento replicado e o tempo real do host réplica. Consulte [Section 16.2.3, “Replication Threads”](replication-threads.html "16.2.3 Replication Threads").

* `STATE`

  Uma ação, evento ou estado que indica o que o Thread está fazendo. Para descrições dos valores de `STATE`, consulte [Section 8.14, “Examining Server Thread (Process) Information”](thread-information.html "8.14 Examining Server Thread (Process) Information").

  A maioria dos estados corresponde a operações muito rápidas. Se um Thread permanecer em um determinado estado por muitos segundos, pode haver um problema que precisa ser investigado.

* `INFO`

  A instrução que o Thread está executando, ou `NULL` se não estiver executando nenhuma instrução. A instrução pode ser aquela enviada ao servidor, ou uma instrução interna (innermost) se a instrução executar outras instruções. Por exemplo, se uma instrução `CALL` executa uma stored procedure que está executando uma instrução [`SELECT`](select.html "13.2.9 SELECT Statement"), o valor `INFO` mostra a instrução [`SELECT`](select.html "13.2.9 SELECT Statement").

#### Observações

* [`PROCESSLIST`](information-schema-processlist-table.html "24.3.18 The INFORMATION_SCHEMA PROCESSLIST Table") é uma tabela `INFORMATION_SCHEMA` não padrão.

* Assim como a saída da instrução [`SHOW PROCESSLIST`](show-processlist.html "13.7.5.29 SHOW PROCESSLIST Statement"), a tabela [`PROCESSLIST`](information-schema-processlist-table.html "24.3.18 The INFORMATION_SCHEMA PROCESSLIST Table") fornece informações sobre todos os Threads, mesmo aqueles pertencentes a outros usuários, se você tiver o privilégio [`PROCESS`](privileges-provided.html#priv_process). Caso contrário (sem o privilégio [`PROCESS`](privileges-provided.html#priv_process)), usuários não anônimos têm acesso a informações sobre seus próprios Threads, mas não Threads de outros usuários, e usuários anônimos não têm acesso a informações de Thread.

* Se uma instrução SQL fizer referência à tabela [`PROCESSLIST`](information-schema-processlist-table.html "24.3.18 The INFORMATION_SCHEMA PROCESSLIST Table"), o MySQL preenche a tabela inteira uma única vez, quando a execução da instrução começa, garantindo assim a consistência de leitura durante a instrução. Não há consistência de leitura para uma transação de múltiplas instruções.

As seguintes instruções são equivalentes:

```sql
SELECT * FROM INFORMATION_SCHEMA.PROCESSLIST

SHOW FULL PROCESSLIST
```