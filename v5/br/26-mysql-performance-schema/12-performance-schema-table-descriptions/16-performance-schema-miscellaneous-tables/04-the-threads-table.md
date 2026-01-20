#### 25.12.16.4 A tabela de fios

A tabela `threads` contém uma linha para cada thread do servidor. Cada linha contém informações sobre uma thread e indica se o monitoramento e o registro de eventos históricos estão habilitados para ela:

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

Quando o Schema de Desempenho é inicializado, ele preenche a tabela `threads` com base nos threads existentes naquela época. Posteriormente, uma nova linha é adicionada sempre que o servidor cria um thread.

Os valores das colunas `INSTRUMENTED` e `HISTORY` para novos tópicos são determinados pelo conteúdo da tabela `setup_actors`. Para obter informações sobre como usar a tabela `setup_actors` para controlar essas colunas, consulte Seção 25.4.6, “Pré-filtragem por Tópico”.

A remoção de linhas da tabela `threads` ocorre quando os threads terminam. Para um thread associado a uma sessão de cliente, a remoção ocorre quando a sessão termina. Se um cliente tiver o recurso de reconexão automática habilitado e a sessão se reconectar após uma desconexão, a sessão se torna associada a uma nova linha na tabela `threads` que tem um valor diferente para o `PROCESSLIST_ID`. Os valores iniciais `INSTRUMENTED` e `HISTORY` para o novo thread podem ser diferentes dos do thread original: A tabela `setup_actors` pode ter sido alterada entretanto, e se o valor `INSTRUMENTED` ou `HISTORY` para o thread original foi alterado após a linha ter sido inicializada, a alteração não se aplica ao novo thread.

Você pode habilitar ou desabilitar o monitoramento de threads (ou seja, se os eventos executados pelo thread são instrumentados) e o registro de eventos históricos. Para controlar os valores iniciais de `INSTRUMENTED` e `HISTORY` para novos threads em primeiro plano, use a tabela `setup_actors`. Para controlar esses aspectos dos threads existentes, defina as colunas `INSTRUMENTED` e `HISTORY` das linhas da tabela `threads`. (Para mais informações sobre as condições sob as quais o monitoramento de threads e o registro de eventos históricos ocorrem, consulte as descrições das colunas `INSTRUMENTED` e `HISTORY`.)

Para uma comparação das colunas da tabela `threads` com nomes que têm um prefixo de `PROCESSLIST_`, consulte Fontes de informações sobre processos.

Importante

Para fontes de informações sobre threads que não sejam a tabela `threads`, as informações sobre threads para outros usuários são exibidas apenas se o usuário atual tiver o privilégio `PROCESS`. Isso não é verdade para a tabela `threads`; todas as linhas são exibidas para qualquer usuário que tenha o privilégio `SELECT` para a tabela. Os usuários que não devem ser capazes de ver threads de outros usuários ao acessar a tabela `threads` não devem ter o privilégio `SELECT` para isso.

A tabela `threads` tem essas colunas:

- `THREAD_ID`

  Um identificador único de thread.

- `NOME`

  O nome associado ao código de instrumentação de thread no servidor. Por exemplo, `thread/sql/one_connection` corresponde à função de thread no código responsável por gerenciar uma conexão de usuário, e `thread/sql/main` representa a função `main()` do servidor.

- `TIPO`

  O tipo de thread, `FOREGROUND` ou `BACKGROUND`. Os fios de conexão do usuário são fios de primeiro plano. Os fios associados à atividade do servidor interno são fios de segundo plano. Exemplos são os fios internos do `InnoDB`, os fios de "dump do binlog" que enviam informações para as réplicas e os fios de I/O de replicação e SQL.

- `PROCESSLIST_ID`

  Para um thread de plano de fundo (associado a uma conexão de usuário), este é o identificador de conexão. Este é o mesmo valor exibido na coluna `ID` da tabela `INFORMATION_SCHEMA `PROCESSLIST``, exibida na coluna `Id` do `SHOW PROCESSLIST` (show-processlist.html) saída, e retornada pela função `[`CONNECTION_ID()\`]\(information-functions.html#function_connection-id) dentro do thread.

  Para um thread de plano de fundo (não associado a uma conexão de usuário), `PROCESSLIST_ID` é `NULL`, então os valores não são únicos.

- `PROCESSLIST_USER`

  O usuário associado a uma thread de primeiro plano, `NULL` para uma thread de segundo plano.

- `PROCESSLIST_HOST`

  O nome do host do cliente associado a uma thread em primeiro plano, `NULL` para uma thread em segundo plano.

  Ao contrário da coluna `HOST` da tabela `INFORMATION_SCHEMA `PROCESSLIST` ou da coluna `Host`da saída de`SHOW PROCESSLIST`(show-processlist.html), a coluna`PROCESSLIST_HOST`não inclui o número da porta para conexões TCP/IP. Para obter essa informação do Schema de Desempenho, habilite a instrumentação de soquetes (que não está habilitada por padrão) e examine a tabela`socket_instances\` (performance-schema-socket-instances-table.html):

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

- `PROCESSLIST_DB`

  O banco de dados padrão para o tópico, ou `NULL` se nenhum tiver sido selecionado.

- `PROCESSLIST_COMMAND`

  Para os threads de primeiro plano, o tipo de comando que o thread está executando em nome do cliente, ou `Sleep` se a sessão estiver inativa. Para descrições dos comandos do thread, consulte Seção 8.14, “Examinando Informações do Thread (Processo) do Servidor”. O valor desta coluna corresponde aos comandos `COM_xxx` do protocolo cliente/servidor e às variáveis de status `Com_xxx`. Consulte Seção 5.1.9, “Variáveis de Status do Servidor”

  Os threads de segundo plano não executam comandos em nome dos clientes, portanto, essa coluna pode ser `NULL`.

- `PROCESSLIST_TIME`

  O tempo em segundos que o thread esteve em seu estado atual. Para um thread de replicação SQL, o valor é o número de segundos entre o timestamp do último evento replicado e o horário real do host da replica. Veja Seção 16.2.3, “Fios de Replicação”.

- `PROCESSLIST_STATE`

  Uma ação, evento ou estado que indica o que o thread está fazendo. Para descrições dos valores de `PROCESSLIST_STATE`, consulte [Seção 8.14, “Examinando Informações do Fio do Servidor (Processo”] (thread-information.html). Se o valor for `NULL`, o thread pode corresponder a uma sessão de cliente inativo ou o trabalho que ele está fazendo não está instrumentado com estágios.

  A maioria dos estados corresponde a operações muito rápidas. Se um thread permanecer em um determinado estado por muitos segundos, pode haver um problema que precisa ser investigado.

- `PROCESSLIST_INFO`

  A declaração que o thread está executando, ou `NULL` se não estiver executando nenhuma declaração. A declaração pode ser a enviada ao servidor ou uma declaração mais interna se a declaração executar outras declarações. Por exemplo, se uma declaração `CALL` executar um procedimento armazenado que está executando uma declaração `SELECT`, o valor `PROCESSLIST_INFO` mostrará a declaração `SELECT`.

- `PARENT_THREAD_ID`

  Se este thread for um subfio (gerado por outro thread), este é o valor `THREAD_ID` do thread gerador.

- `ROL`

  Inexercitado.

- `INSTRUMENTADO`

  Se os eventos executados pelo thread estão instrumentados. O valor é `SIM` ou `NÃO`.

  - Para os threads de primeiro plano, o valor inicial `INSTRUMENTED` é determinado se a conta de usuário associada ao thread corresponde a qualquer linha na tabela `setup_actors`. A correspondência é baseada nos valores das colunas `PROCESSLIST_USER` e `PROCESSLIST_HOST`.

    Se o thread gerar um subfio, a correspondência ocorre novamente para a linha da tabela `threads` criada para o subfio.

  - Para os threads de segundo plano, `INSTRUMENTED` é `YES` por padrão. `setup_actors` não é consultado porque não há um usuário associado aos threads de segundo plano.

  - Para qualquer thread, seu valor `INSTRUMENTED` pode ser alterado durante a vida útil da thread.

  Para que o monitoramento de eventos executados pelo thread ocorra, essas coisas devem ser verdadeiras:

  - O consumidor `thread_instrumentation` na tabela `setup_consumers` (performance-schema-setup-consumers-table.html) deve ser `YES`.

  - A coluna `threads.INSTRUMENTED` deve ser `YES`.

  - O monitoramento ocorre apenas para os eventos de thread gerados a partir de instrumentos que têm a coluna `ENABLED` definida como `YES` na tabela `setup_instruments`.

- `HISTÓRIA`

  Se deve registrar eventos históricos para o tópico. O valor é `SIM` ou `NÃO`.

  - Para os threads de primeiro plano, o valor inicial de `HISTORY` é determinado se a conta de usuário associada ao thread corresponde a qualquer linha na tabela `setup_actors`. A correspondência é baseada nos valores das colunas `PROCESSLIST_USER` e `PROCESSLIST_HOST`.

    Se o thread gerar um subfio, a correspondência ocorre novamente para a linha da tabela `threads` criada para o subfio.

  - Para os threads de segundo plano, `HISTORY` é `YES` por padrão. O `setup_actors` não é consultado porque não há um usuário associado aos threads de segundo plano.

  - Para qualquer thread, seu valor `HISTORY` pode ser alterado durante a vida útil da thread.

  Para que o registro de eventos históricos ocorra no tópico, essas coisas devem ser verdadeiras:

  - Os consumidores apropriados relacionados à história na tabela `setup_consumers` devem estar habilitados. Por exemplo, para registrar eventos de espera na tabela `events_waits_history` e na tabela `events_waits_history_long`, é necessário que os consumidores `events_waits_history` e `events_waits_history_long` correspondentes estejam configurados como `YES`.

  - A coluna `threads.HISTORY` deve ser `YES`.

  - O registro ocorre apenas para aqueles eventos de thread gerados a partir de instrumentos que têm a coluna `ENABLED` definida como `YES` na tabela `setup_instruments`.

- `TIPO_CONEXÃO`

  O protocolo usado para estabelecer a conexão, ou `NULL` para threads em segundo plano. Os valores permitidos são `TCP/IP` (conexão TCP/IP estabelecida sem criptografia), `SSL/TLS` (conexão TCP/IP estabelecida com criptografia), `Socket` (conexão de arquivo de socket Unix), `Named Pipe` (conexão de named pipe do Windows) e `Shared Memory` (conexão de memória compartilhada do Windows).

- `THREAD_OS_ID`

  O identificador do thread ou tarefa, conforme definido pelo sistema operacional subjacente, se houver:

  - Quando um thread MySQL está associado ao mesmo thread do sistema operacional durante toda a sua vida útil, o `THREAD_OS_ID` contém o ID do thread do sistema operacional.

  - Quando um thread MySQL não está associado ao mesmo thread do sistema operacional ao longo de sua vida útil, o `THREAD_OS_ID` contém `NULL`. Isso é típico de sessões de usuário quando o plugin do pool de threads é usado (veja Seção 5.5.3, “MySQL Enterprise Thread Pool”).

  Para o Windows, `THREAD_OS_ID` corresponde ao ID de thread visível no Process Explorer (<https://technet.microsoft.com/en-us/sysinternals/bb896653.aspx>).

  Para Linux, `THREAD_OS_ID` corresponde ao valor da função `gettid()`. Esse valor é exibido, por exemplo, usando os comandos **perf** ou **ps -L**, ou no sistema de arquivos `proc` (`/proc/[pid]/task/[tid]`). Para mais informações, consulte as páginas de manual `perf-stat(1)`, `ps(1)` e `proc(5)`.

A operação `TRUNCATE TABLE` não é permitida para a tabela `threads`.
