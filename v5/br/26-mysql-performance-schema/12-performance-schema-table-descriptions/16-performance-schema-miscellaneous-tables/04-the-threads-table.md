#### 25.12.16.4 A Tabela threads

A tabela [`threads`](performance-schema-threads-table.html "25.12.16.4 The threads Table") contém uma linha para cada Thread do servidor. Cada linha contém informações sobre um Thread e indica se o monitoramento e o log de eventos históricos estão ativados para ele:

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

Quando o Performance Schema é inicializado, ele popula a tabela [`threads`](performance-schema-threads-table.html "25.12.16.4 The threads Table") com base nos Threads existentes naquele momento. A partir daí, uma nova linha é adicionada sempre que o servidor cria um Thread.

Os valores das colunas `INSTRUMENTED` e `HISTORY` para novos Threads são determinados pelo conteúdo da tabela [`setup_actors`](performance-schema-setup-actors-table.html "25.12.2.1 The setup_actors Table"). Para obter informações sobre como usar a tabela [`setup_actors`](performance-schema-setup-actors-table.html "25.12.2.1 The setup_actors Table") para controlar essas colunas, consulte [Seção 25.4.6, “Pre-Filtering by Thread”](performance-schema-thread-filtering.html "25.4.6 Pre-Filtering by Thread").

A remoção de linhas da tabela [`threads`](performance-schema-threads-table.html "25.12.16.4 The threads Table") ocorre quando os Threads terminam. Para um Thread associado a uma sessão de cliente, a remoção ocorre quando a sessão termina. Se um cliente tiver o auto-reconnect ativado e a sessão reconectar após uma desconexão, a sessão será associada a uma nova linha na tabela [`threads`](performance-schema-threads-table.html "25.12.16.4 The threads Table") que possui um valor `PROCESSLIST_ID` diferente. Os valores iniciais de `INSTRUMENTED` e `HISTORY` para o novo Thread podem ser diferentes dos do Thread original: A tabela [`setup_actors`](performance-schema-setup-actors-table.html "25.12.2.1 The setup_actors Table") pode ter mudado nesse ínterim e, se o valor `INSTRUMENTED` ou `HISTORY` do Thread original foi alterado após a inicialização da linha, a alteração não é transferida para o novo Thread.

Você pode ativar ou desativar o monitoramento de Thread (ou seja, se os eventos executados pelo Thread são instrumentados) e o log de eventos históricos. Para controlar os valores iniciais de `INSTRUMENTED` e `HISTORY` para novos *foreground* threads, use a tabela [`setup_actors`](performance-schema-setup-actors-table.html "25.12.2.1 The setup_actors Table"). Para controlar esses aspectos dos Threads existentes, defina as colunas `INSTRUMENTED` e `HISTORY` das linhas da tabela [`threads`](performance-schema-threads-table.html "25.12.16.4 The threads Table"). (Para obter mais informações sobre as condições sob as quais o monitoramento de Thread e o log de eventos históricos ocorrem, consulte as descrições das colunas `INSTRUMENTED` e `HISTORY`.)

Para uma comparação das colunas da tabela [`threads`](performance-schema-threads-table.html "25.12.16.4 The threads Table") com nomes que possuem um prefixo `PROCESSLIST_` com outras fontes de informação de processo, consulte [Sources of Process Information](processlist-access.html#processlist-sources "Sources of Process Information").

Importante

Para fontes de informação de Thread diferentes da tabela [`threads`](performance-schema-threads-table.html "25.12.16.4 The threads Table"), as informações sobre Threads para outros usuários são mostradas apenas se o usuário atual tiver o privilégio [`PROCESS`](privileges-provided.html#priv_process). Isso não é verdade para a tabela [`threads`](performance-schema-threads-table.html "25.12.16.4 The threads Table"); todas as linhas são mostradas a qualquer usuário que tenha o privilégio [`SELECT`](privileges-provided.html#priv_select) para a tabela. Usuários que não devem poder ver Threads para outros usuários acessando a tabela [`threads`](performance-schema-threads-table.html "25.12.16.4 The threads Table") não devem receber o privilégio [`SELECT`](privileges-provided.html#priv_select) para ela.

A tabela [`threads`](performance-schema-threads-table.html "25.12.16.4 The threads Table") possui as seguintes colunas:

* `THREAD_ID`

  Um identificador de Thread exclusivo.

* `NAME`

  O nome associado ao código de instrumentação do Thread no servidor. Por exemplo, `thread/sql/one_connection` corresponde à função do Thread no código responsável por lidar com uma conexão de usuário, e `thread/sql/main` representa a função `main()` do servidor.

* `TYPE`

  O tipo de Thread, sendo `FOREGROUND` ou `BACKGROUND`. Threads de conexão de usuário são *foreground* threads. Threads associados a atividades internas do servidor são *background* threads. Exemplos são Threads internos do `InnoDB`, Threads de “binlog dump” que enviam informações para réplicas, e Threads de I/O e SQL de replicação.

* `PROCESSLIST_ID`

  Para um *foreground* Thread (associado a uma conexão de usuário), este é o identificador da conexão. Este é o mesmo valor exibido na coluna `ID` da tabela [`PROCESSLIST`](information-schema-processlist-table.html "24.3.18 The INFORMATION_SCHEMA PROCESSLIST Table") do `INFORMATION_SCHEMA`, exibido na coluna `Id` da saída de [`SHOW PROCESSLIST`](show-processlist.html "13.7.5.29 SHOW PROCESSLIST Statement"), e retornado pela função [`CONNECTION_ID()`](information-functions.html#function_connection-id) dentro do Thread.

  Para um *background* Thread (não associado a uma conexão de usuário), `PROCESSLIST_ID` é `NULL`, então os valores não são exclusivos.

* `PROCESSLIST_USER`

  O usuário associado a um *foreground* Thread, `NULL` para um *background* Thread.

* `PROCESSLIST_HOST`

  O nome do host do cliente associado a um *foreground* Thread, `NULL` para um *background* Thread.

  Diferente da coluna `HOST` da tabela [`PROCESSLIST`](information-schema-processlist-table.html "24.3.18 The INFORMATION_SCHEMA PROCESSLIST Table") do `INFORMATION_SCHEMA` ou da coluna `Host` da saída de [`SHOW PROCESSLIST`](show-processlist.html "13.7.5.29 SHOW PROCESSLIST Statement"), a coluna `PROCESSLIST_HOST` não inclui o número da porta para conexões TCP/IP. Para obter esta informação do Performance Schema, habilite a instrumentação de socket (que não está habilitada por padrão) e examine a tabela [`socket_instances`](performance-schema-socket-instances-table.html "25.12.3.5 The socket_instances Table"):

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

  O Database padrão para o Thread, ou `NULL` se nenhum tiver sido selecionado.

* `PROCESSLIST_COMMAND`

  Para *foreground* threads, o tipo de comando que o Thread está executando em nome do cliente, ou `Sleep` se a sessão estiver ociosa. Para descrições dos comandos de Thread, consulte [Seção 8.14, “Examining Server Thread (Process) Information”](thread-information.html "8.14 Examining Server Thread (Process) Information"). O valor desta coluna corresponde aos comandos `COM_xxx` do protocolo cliente/servidor e às variáveis de status `Com_xxx`. Consulte [Seção 5.1.9, “Server Status Variables”](server-status-variables.html "5.1.9 Server Status Variables").

  *Background* Threads não executam comandos em nome de clientes, então esta coluna pode ser `NULL`.

* `PROCESSLIST_TIME`

  O tempo em segundos que o Thread permaneceu em seu estado atual. Para um SQL thread de réplica, o valor é o número de segundos entre o timestamp do último evento replicado e o tempo real do host da réplica. Consulte [Seção 16.2.3, “Replication Threads”](replication-threads.html "16.2.3 Replication Threads").

* `PROCESSLIST_STATE`

  Uma ação, evento ou estado que indica o que o Thread está fazendo. Para descrições dos valores de `PROCESSLIST_STATE`, consulte [Seção 8.14, “Examining Server Thread (Process) Information”](thread-information.html "8.14 Examining Server Thread (Process) Information"). Se o valor for `NULL`, o Thread pode corresponder a uma sessão de cliente ociosa ou o trabalho que ele está fazendo não está instrumentado com estágios.

  A maioria dos estados corresponde a operações muito rápidas. Se um Thread permanecer em um determinado estado por muitos segundos, pode haver um problema que mereça investigação.

* `PROCESSLIST_INFO`

  A Statement que o Thread está executando, ou `NULL` se não estiver executando nenhuma Statement. A Statement pode ser aquela enviada ao servidor, ou uma Statement mais interna se a Statement executar outras Statements. Por exemplo, se uma Statement `CALL` executar um stored procedure que está executando uma Statement [`SELECT`](select.html "13.2.9 SELECT Statement"), o valor de `PROCESSLIST_INFO` mostra a Statement [`SELECT`](select.html "13.2.9 SELECT Statement").

* `PARENT_THREAD_ID`

  Se este Thread for um subthread (gerado por outro Thread), este é o valor `THREAD_ID` do Thread gerador.

* `ROLE`

  Não utilizado.

* `INSTRUMENTED`

  Indica se os eventos executados pelo Thread são instrumentados. O valor é `YES` ou `NO`.

  + Para *foreground* threads, o valor inicial de `INSTRUMENTED` é determinado por se a conta de usuário associada ao Thread corresponde a alguma linha na tabela [`setup_actors`](performance-schema-setup-actors-table.html "25.12.2.1 The setup_actors Table"). A correspondência é baseada nos valores das colunas `PROCESSLIST_USER` e `PROCESSLIST_HOST`.

    Se o Thread gerar um subthread, a correspondência ocorre novamente para a linha da tabela [`threads`](performance-schema-threads-table.html "25.12.16.4 The threads Table") criada para o subthread.

  + Para *background* threads, `INSTRUMENTED` é `YES` por padrão. A tabela [`setup_actors`](performance-schema-setup-actors-table.html "25.12.2.1 The setup_actors Table") não é consultada porque não há usuário associado para *background* threads.

  + Para qualquer Thread, seu valor `INSTRUMENTED` pode ser alterado durante o tempo de vida do Thread.

  Para que o monitoramento de eventos executados pelo Thread ocorra, o seguinte deve ser verdadeiro:

  + O consumidor `thread_instrumentation` na tabela [`setup_consumers`](performance-schema-setup-consumers-table.html "25.12.2.2 The setup_consumers Table") deve ser `YES`.

  + A coluna `threads.INSTRUMENTED` deve ser `YES`.

  + O monitoramento ocorre apenas para aqueles eventos de Thread produzidos a partir de instrumentos que têm a coluna `ENABLED` definida como `YES` na tabela [`setup_instruments`](performance-schema-setup-instruments-table.html "25.12.2.3 The setup_instruments Table").

* `HISTORY`

  Indica se deve ser feito o log de eventos históricos para o Thread. O valor é `YES` ou `NO`.

  + Para *foreground* threads, o valor inicial de `HISTORY` é determinado por se a conta de usuário associada ao Thread corresponde a alguma linha na tabela [`setup_actors`](performance-schema-setup-actors-table.html "25.12.2.1 The setup_actors Table"). A correspondência é baseada nos valores das colunas `PROCESSLIST_USER` e `PROCESSLIST_HOST`.

    Se o Thread gerar um subthread, a correspondência ocorre novamente para a linha da tabela [`threads`](performance-schema-threads-table.html "25.12.16.4 The threads Table") criada para o subthread.

  + Para *background* threads, `HISTORY` é `YES` por padrão. A tabela [`setup_actors`](performance-schema-setup-actors-table.html "25.12.2.1 The setup_actors Table") não é consultada porque não há usuário associado para *background* threads.

  + Para qualquer Thread, seu valor `HISTORY` pode ser alterado durante o tempo de vida do Thread.

  Para que o log de eventos históricos para o Thread ocorra, o seguinte deve ser verdadeiro:

  + Os consumidores apropriados relacionados ao histórico na tabela [`setup_consumers`](performance-schema-setup-consumers-table.html "25.12.2.2 The setup_consumers Table") devem estar habilitados. Por exemplo, o log de eventos de *wait* nas tabelas [`events_waits_history`](performance-schema-events-waits-history-table.html "25.12.4.2 The events_waits_history Table") e [`events_waits_history_long`](performance-schema-events-waits-history-long-table.html "25.12.4.3 The events_waits_history_long Table") requer que os consumidores correspondentes `events_waits_history` e `events_waits_history_long` sejam `YES`.

  + A coluna `threads.HISTORY` deve ser `YES`.

  + O log ocorre apenas para aqueles eventos de Thread produzidos a partir de instrumentos que têm a coluna `ENABLED` definida como `YES` na tabela [`setup_instruments`](performance-schema-setup-instruments-table.html "25.12.2.3 The setup_instruments Table").

* `CONNECTION_TYPE`

  O protocolo usado para estabelecer a conexão, ou `NULL` para *background* threads. Os valores permitidos são `TCP/IP` (conexão TCP/IP estabelecida sem criptografia), `SSL/TLS` (conexão TCP/IP estabelecida com criptografia), `Socket` (conexão de arquivo de socket Unix), `Named Pipe` (conexão de pipe nomeado Windows) e `Shared Memory` (conexão de memória compartilhada Windows).

* `THREAD_OS_ID`

  O identificador do Thread ou tarefa conforme definido pelo sistema operacional subjacente, se houver:

  + Quando um Thread MySQL está associado ao mesmo Thread do sistema operacional durante toda a sua vida útil, `THREAD_OS_ID` contém o ID do Thread do sistema operacional.

  + Quando um Thread MySQL não está associado ao mesmo Thread do sistema operacional durante toda a sua vida útil, `THREAD_OS_ID` contém `NULL`. Isso é típico para sessões de usuário quando o plugin thread pool é usado (consulte [Seção 5.5.3, “MySQL Enterprise Thread Pool”](thread-pool.html "5.5.3 MySQL Enterprise Thread Pool")).

  + Para Windows, `THREAD_OS_ID` corresponde ao ID do Thread visível no Process Explorer (<https://technet.microsoft.com/en-us/sysinternals/bb896653.aspx>).

  + Para Linux, `THREAD_OS_ID` corresponde ao valor da função `gettid()`. Este valor é exposto, por exemplo, usando os comandos **perf** ou **ps -L**, ou no sistema de arquivos `proc` (`/proc/[pid]/task/[tid]`). Para mais informações, consulte as páginas man `perf-stat(1)`, `ps(1)` e `proc(5)`.

[`TRUNCATE TABLE`](truncate-table.html "13.1.34 TRUNCATE TABLE Statement") não é permitido para a tabela [`threads`](performance-schema-threads-table.html "25.12.16.4 The threads Table").