#### 13.7.5.29 Instrução SHOW PROCESSLIST

```sql
SHOW [FULL] PROCESSLIST
```

A lista de processos do MySQL indica as operações atualmente sendo executadas pelo conjunto de Threads em execução no servidor. A instrução [`SHOW PROCESSLIST`](show-processlist.html "13.7.5.29 SHOW PROCESSLIST Statement") é uma fonte de informação sobre processos. Para uma comparação desta instrução com outras fontes, consulte [Sources of Process Information](processlist-access.html#processlist-sources "Sources of Process Information").

Se você tiver o privilégio [`PROCESS`](privileges-provided.html#priv_process), você pode ver todos os Threads, mesmo aqueles pertencentes a outros usuários. Caso contrário (sem o privilégio [`PROCESS`](privileges-provided.html#priv_process)), usuários não anônimos têm acesso a informações sobre seus próprios Threads, mas não sobre Threads de outros usuários, e usuários anônimos não têm acesso a informações de Threads.

Sem a palavra-chave `FULL`, [`SHOW PROCESSLIST`](show-processlist.html "13.7.5.29 SHOW PROCESSLIST Statement") exibe apenas os primeiros 100 caracteres de cada instrução no campo `Info`.

A instrução [`SHOW PROCESSLIST`](show-processlist.html "13.7.5.29 SHOW PROCESSLIST Statement") é muito útil se você receber a mensagem de erro “too many connections” e quiser descobrir o que está acontecendo. O MySQL reserva uma conexão extra para ser usada por contas que possuem o privilégio [`SUPER`](privileges-provided.html#priv_super), garantindo que os administradores possam sempre se conectar e verificar o sistema (assumindo que você não está concedendo este privilégio a todos os seus usuários).

Threads podem ser encerrados (killed) com a instrução [`KILL`](kill.html "13.7.6.4 KILL Statement"). Consulte [Section 13.7.6.4, “KILL Statement”](kill.html "13.7.6.4 KILL Statement").

Exemplo de saída de [`SHOW PROCESSLIST`](show-processlist.html "13.7.5.29 SHOW PROCESSLIST Statement"):

```sql
mysql> SHOW FULL PROCESSLIST\G
*************************** 1. row ***************************
     Id: 1
   User: system user
   Host:
     db: NULL
Command: Connect
   Time: 1030455
  State: Waiting for master to send event
   Info: NULL
*************************** 2. row ***************************
     Id: 2
   User: system user
   Host:
     db: NULL
Command: Connect
   Time: 1004
  State: Has read all relay log; waiting for the slave
         I/O thread to update it
   Info: NULL
*************************** 3. row ***************************
     Id: 3112
   User: replikator
   Host: artemis:2204
     db: NULL
Command: Binlog Dump
   Time: 2144
  State: Has sent all binlog to slave; waiting for binlog to be updated
   Info: NULL
*************************** 4. row ***************************
     Id: 3113
   User: replikator
   Host: iconnect2:45781
     db: NULL
Command: Binlog Dump
   Time: 2086
  State: Has sent all binlog to slave; waiting for binlog to be updated
   Info: NULL
*************************** 5. row ***************************
     Id: 3123
   User: stefan
   Host: localhost
     db: apollon
Command: Query
   Time: 0
  State: NULL
   Info: SHOW FULL PROCESSLIST
```

A saída de [`SHOW PROCESSLIST`](show-processlist.html "13.7.5.29 SHOW PROCESSLIST Statement") possui estas colunas:

* `Id`

  O identificador da conexão. É o mesmo valor exibido na coluna `ID` da tabela `INFORMATION_SCHEMA` [`PROCESSLIST`](information-schema-processlist-table.html "24.3.18 The INFORMATION_SCHEMA PROCESSLIST Table"), exibido na coluna `PROCESSLIST_ID` da tabela Performance Schema [`threads`](performance-schema-threads-table.html "25.12.16.4 The threads Table") e retornado pela função [`CONNECTION_ID()`](information-functions.html#function_connection-id) dentro do Thread.

* `User`

  O usuário MySQL que emitiu a instrução. Um valor de `system user` se refere a um Thread não-cliente gerado pelo servidor para lidar com tarefas internas, por exemplo, um Thread de manipulador de linha atrasada (delayed-row handler thread) ou um Thread de I/O ou SQL usado em hosts Replica. Para `system user`, não há host especificado na coluna `Host`. `unauthenticated user` refere-se a um Thread que se associou a uma conexão de cliente, mas para o qual a autenticação do usuário cliente ainda não ocorreu. `event_scheduler` refere-se ao Thread que monitora eventos agendados (consulte [Section 23.4, “Using the Event Scheduler”](event-scheduler.html "23.4 Using the Event Scheduler")).

* `Host`

  O nome do host do cliente que emitiu a instrução (exceto para `system user`, para o qual não há host). O nome do host para conexões TCP/IP é relatado no formato `host_name:client_port` para facilitar a determinação de qual cliente está fazendo o quê.

* `db`

  O Database padrão para o Thread, ou `NULL` se nenhum tiver sido selecionado.

* `Command`

  O tipo de comando que o Thread está executando em nome do cliente, ou `Sleep` se a sessão estiver ociosa. Para descrições dos comandos do Thread, consulte [Section 8.14, “Examining Server Thread (Process) Information”](thread-information.html "8.14 Examining Server Thread (Process) Information"). O valor desta coluna corresponde aos comandos `COM_xxx` do protocolo cliente/servidor e às variáveis de status `Com_xxx`. Consulte [Section 5.1.9, “Server Status Variables”](server-status-variables.html "5.1.9 Server Status Variables").

* `Time`

  O tempo em segundos que o Thread permaneceu em seu estado atual. Para um Thread SQL de Replica, o valor é o número de segundos entre o timestamp do último evento replicado e o tempo real do host Replica. Consulte [Section 16.2.3, “Replication Threads”](replication-threads.html "16.2.3 Replication Threads").

* `State`

  Uma ação, evento ou State que indica o que o Thread está fazendo. Para descrições dos valores de `State`, consulte [Section 8.14, “Examining Server Thread (Process) Information”](thread-information.html "8.14 Examining Server Thread (Process) Information").

  A maioria dos States corresponde a operações muito rápidas. Se um Thread permanecer em um determinado State por muitos segundos, pode haver um problema que precisa ser investigado.

* `Info`

  A instrução que o Thread está executando, ou `NULL` se não estiver executando nenhuma instrução. A instrução pode ser aquela enviada ao servidor, ou uma instrução aninhada se a instrução executar outras instruções. Por exemplo, se uma instrução `CALL` executa uma stored procedure que está executando uma instrução [`SELECT`](select.html "13.2.9 SELECT Statement"), o valor de `Info` mostra a instrução [`SELECT`](select.html "13.2.9 SELECT Statement").