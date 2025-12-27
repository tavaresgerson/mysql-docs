#### 29.12.22.10 Tabela de threads

A tabela `threads` contém uma linha para cada thread do servidor. Cada linha contém informações sobre um thread e indica se o monitoramento e o registro de eventos históricos estão habilitados para ele:

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

Quando o Schema de Desempenho é inicializado, ele popula a tabela `threads` com base nos threads existentes naquela época. Posteriormente, uma nova linha é adicionada cada vez que o servidor cria um thread.

Os valores das colunas `INSTRUMENTED` e `HISTORY` para novos threads são determinados pelo conteúdo da tabela `setup_actors`. Para obter informações sobre como usar a tabela `setup_actors` para controlar essas colunas, consulte a Seção 29.4.6, “Pre-Filtragem por Thread”.

A remoção de linhas da tabela `threads` ocorre quando os threads terminam. Para um thread associado a uma sessão de cliente, a remoção ocorre quando a sessão termina. Se um cliente tiver o auto-reconexão habilitado e a sessão se reconectar após uma desconexão, a sessão se torna associada a uma nova linha na tabela `threads` que tem um valor de `PROCESSLIST_ID` diferente. Os valores iniciais de `INSTRUMENTED` e `HISTORY` para o novo thread podem ser diferentes dos do thread original: A tabela `setup_actors` pode ter sido alterada entretanto, e se o valor de `INSTRUMENTED` ou `HISTORY` para o thread original foi alterado após a linha ser inicializada, a alteração não é transferida para o novo thread.

Você pode habilitar ou desabilitar o monitoramento de threads (ou seja, se os eventos executados pelo thread são instrumentados) e o registro de eventos históricos. Para controlar os valores iniciais de `INSTRUMENTED` e `HISTORY` para novos threads em primeiro plano, use a tabela `setup_actors`. Para controlar esses aspectos dos threads existentes, defina as colunas `INSTRUMENTED` e `HISTORY` das linhas da tabela `threads`. (Para mais informações sobre as condições sob as quais o monitoramento de threads e o registro de eventos históricos ocorrem, consulte as descrições das colunas `INSTRUMENTED` e `HISTORY`.)

Para uma comparação das colunas da tabela `threads` com nomes que têm um prefixo de `PROCESSLIST_`, com outras fontes de informações sobre processos, consulte Fontes de Informações sobre Processos.

Importante

Para fontes de informações sobre threads que não sejam a tabela `threads`, as informações sobre threads para outros usuários são exibidas apenas se o usuário atual tiver o privilégio `PROCESS`. Isso não é verdade para a tabela `threads; todas as linhas são exibidas para qualquer usuário que tenha o privilégio `SELECT` para a tabela. Os usuários que não devem ser capazes de ver threads de outros usuários ao acessar a tabela `threads` não devem ter o privilégio `SELECT` para ela.

A tabela `threads` tem essas colunas:

* `THREAD_ID`

  Um identificador único do thread.

* `NAME`

  O nome associado ao código de instrumentação do thread no servidor. Por exemplo, `thread/sql/one_connection` corresponde à função de thread no código responsável por lidar com uma conexão de usuário, e `thread/sql/main` representa a função `main()` do servidor.

* `TYPE`

O tipo de processo, `FOREGROUND` ou `BACKGROUND`. Os processos de conexão do usuário são processos em primeiro plano. Os processos associados à atividade do servidor interno são processos em segundo plano. Exemplos são os processos `InnoDB` internos, os processos de "dump de binlog" que enviam informações para réplicas e os processos de I/O de replicação e SQL.

* `PROCESSLIST_ID`

  Para um processo em primeiro plano (associado a uma conexão do usuário), este é o identificador de conexão. Este é o mesmo valor exibido na coluna `ID` da tabela `INFORMATION_SCHEMA` `PROCESSLIST`, exibida na coluna `Id` da saída `SHOW PROCESSLIST` e retornada pela função `CONNECTION_ID()` dentro do processo.

  Para um processo em segundo plano (não associado a uma conexão do usuário), `PROCESSLIST_ID` é `NULL`, portanto, os valores não são únicos.

* `PROCESSLIST_USER`

  O usuário associado a um processo em primeiro plano, `NULL` para um processo em segundo plano.

* `PROCESSLIST_HOST`

  O nome do host do cliente associado a um processo em primeiro plano, `NULL` para um processo em segundo plano.

  Ao contrário da coluna `HOST` da tabela `INFORMATION_SCHEMA` `PROCESSLIST` ou da coluna `Host` da saída `SHOW PROCESSLIST`, a coluna `PROCESSLIST_HOST` não inclui o número de porta para conexões TCP/IP. Para obter essa informação do Schema de Desempenho, habilite a instrumentação de socket (que não está habilitada por padrão) e examine a tabela `socket_instances`:

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

  O banco de dados padrão para o processo, ou `NULL` se nenhum tiver sido selecionado.

* `PROCESSLIST_COMMAND`

Para os threads de primeiro plano, o tipo de comando que o thread está executando em nome do cliente, ou `Sleep` se a sessão estiver inativa. Para descrições dos comandos do thread, consulte a Seção 10.14, “Examinando Informações do Thread (Processo) do Servidor” (Informações”). O valor desta coluna corresponde aos comandos `COM_xxx` do protocolo cliente/servidor e às variáveis de status `Com_xxx`. Consulte a Seção 7.1.10, “Variáveis de Status do Servidor”

  Os threads de segundo plano não executam comandos em nome dos clientes, portanto, esta coluna pode ser `NULL`.

* `PROCESSLIST_TIME`

  O tempo em segundos que o thread está em seu estado atual. Para um thread SQL de replica, o valor é o número de segundos entre o timestamp do último evento replicado e o tempo real do host da replica. Consulte a Seção 19.2.3, “Threads de Replicação”.

* `PROCESSLIST_STATE`

  Uma ação, evento ou estado que indica o que o thread está fazendo. Para descrições dos valores de `PROCESSLIST_STATE`, consulte a Seção 10.14, “Examinando Informações do Thread (Processo) do Servidor” (Informações”). Se o valor for `NULL`, o thread pode corresponder a uma sessão de cliente inativa ou o trabalho que ele está fazendo não está instrumentado com etapas.

  A maioria dos estados corresponde a operações muito rápidas. Se um thread permanecer em um determinado estado por muitos segundos, pode haver um problema que precisa ser investigado.

* `PROCESSLIST_INFO`

  A instrução que o thread está executando, ou `NULL` se não estiver executando nenhuma instrução. A instrução pode ser a enviada ao servidor, ou uma instrução mais interna se a instrução executar outras instruções. Por exemplo, se uma instrução `CALL` executar uma procedura armazenada que está executando uma instrução `SELECT`, o valor de `PROCESSLIST_INFO` mostra a instrução `SELECT`.

* `PARENT_THREAD_ID`

Se este fio for um subfio (gerado por outro fio), este é o valor `THREAD_ID` do fio gerador.

* `ROLE`

  Não utilizado.

* `INSTRUMENTED`

  Se os eventos executados pelo fio são instrumentados. O valor é `YES` ou `NO`.

  + Para fios de primeiro plano, o valor inicial `INSTRUMENTED` é determinado se a conta de usuário associada ao fio corresponde a qualquer linha na tabela `setup_actors`. A correspondência é baseada nos valores das colunas `PROCESSLIST_USER` e `PROCESSLIST_HOST`.

    Se o fio gerar um subfio, a correspondência ocorre novamente para a linha da tabela `threads` criada para o subfio.

  + Para fios de segundo plano, `INSTRUMENTED` é `YES` por padrão. `setup_actors` não é consultado porque não há um usuário associado aos fios de segundo plano.

  + Para qualquer fio, seu valor `INSTRUMENTED` pode ser alterado durante a vida útil do fio.

  Para que a monitorização dos eventos executados pelo fio ocorra, essas coisas devem ser verdadeiras:

  + O consumidor `thread_instrumentation` na tabela `setup_consumers` deve ser `YES`.

  + A coluna `threads.INSTRUMENTED` deve ser `YES`.

  + A monitorização ocorre apenas para aqueles eventos de fio produzidos a partir de instrumentos que têm a coluna `ENABLED` definida como `YES` na tabela `setup_instruments`.

* `HISTORY`

  Se os eventos históricos devem ser registrados para o fio. O valor é `YES` ou `NO`.

  + Para fios de primeiro plano, o valor inicial `HISTORY` é determinado se a conta de usuário associada ao fio corresponde a qualquer linha na tabela `setup_actors`. A correspondência é baseada nos valores das colunas `PROCESSLIST_USER` e `PROCESSLIST_HOST`.

    Se o fio gerar um subfio, a correspondência ocorre novamente para a linha da tabela `threads` criada para o subfio.

+ Para threads de segundo plano, o valor `HISTORY` é `YES` por padrão. `setup_actors` não é consultado porque não há um usuário associado para threads de segundo plano.

+ Para qualquer thread, seu valor `HISTORY` pode ser alterado durante a vida útil da thread.

Para que o registro de eventos históricos da thread ocorra, essas coisas devem ser verdadeiras:

+ Os consumidores relacionados à história apropriados na tabela `setup_consumers` devem estar habilitados. Por exemplo, o registro de eventos de espera na tabelas `events_waits_history` e `events_waits_history_long` requer que os consumidores `events_waits_history` e `events_waits_history_long` estejam em `YES`.

+ A coluna `threads.HISTORY` deve estar em `YES`.

+ O registro ocorre apenas para aqueles eventos de thread produzidos a partir de instrumentos que têm a coluna `ENABLED` definida como `YES` na tabela `setup_instruments`.

* `CONNECTION_TYPE`

  O protocolo usado para estabelecer a conexão, ou `NULL` para threads de segundo plano. Os valores permitidos são `TCP/IP` (conexão TCP/IP estabelecida sem criptografia), `SSL/TLS` (conexão TCP/IP estabelecida com criptografia), `Socket` (conexão de arquivo socket Unix), `Named Pipe` (conexão de pipe nomeada do Windows) e `Shared Memory` (conexão de memória compartilhada do Windows).

* `THREAD_OS_ID`

  O identificador da thread ou tarefa, conforme definido pelo sistema operacional subjacente, se houver:

  + Quando uma thread MySQL está associada à mesma thread do sistema operacional por toda a sua vida útil, `THREAD_OS_ID` contém o ID da thread do sistema operacional.

  + Quando uma thread MySQL não está associada à mesma thread do sistema operacional por toda a sua vida útil, `THREAD_OS_ID` contém `NULL`. Isso é típico para sessões de usuário quando o plugin do pool de threads é usado (veja a Seção 7.6.3, “MySQL Enterprise Thread Pool”).

Para o Windows, `THREAD_OS_ID` corresponde ao ID de thread visível no Explorador de Processos (<https://technet.microsoft.com/en-us/sysinternals/bb896653.aspx>).

Para o Linux, `THREAD_OS_ID` corresponde ao valor da função `gettid()`. Esse valor é exposto, por exemplo, usando os comandos **perf** ou **ps -L**, ou no sistema de arquivos **proc** (`/proc/[pid]/task/[tid]`). Para mais informações, consulte as páginas de manual `perf-stat(1)`, `ps(1)` e `proc(5)`.

* `RESOURCE_GROUP`

  O rótulo do grupo de recursos. Esse valor é `NULL` se os grupos de recursos não forem suportados na configuração atual da plataforma ou do servidor (consulte Restrições de Grupo de Recursos).

* `EXECUTION_ENGINE`

  O motor de execução da consulta. O valor é `PRIMARY` ou `SECONDARY`. Para uso com o MySQL HeatWave Service e o MySQL HeatWave, onde o motor `PRIMARY` é `InnoDB` e o motor `SECONDARY` é MySQL HeatWave (`RAPID`). Para o MySQL Community Edition Server, MySQL Enterprise Edition Server (on-premise) e o MySQL HeatWave Service sem o MySQL HeatWave, o valor é sempre `PRIMARY`.

* `CONTROLLED_MEMORY`

  Quantidade de memória controlada usada pelo thread.

* `MAX_CONTROLLED_MEMORY`

  Valor máximo de `CONTROLLED_MEMORY` visto durante a execução do thread.

* `TOTAL_MEMORY`

  A quantidade atual de memória, controlada ou não, usada pelo thread.

* `MAX_TOTAL_MEMORY`

  O valor máximo de `TOTAL_MEMORY` visto durante a execução do thread.

* `TELEMETRY_ACTIVE`

  Se o thread tem uma sessão de telemetria ativa anexada. O valor é `YES` ou `NO`.

A tabela `threads` tem esses índices:

* Chave primária em (`THREAD_ID`)
* Índice em (`NAME`)
* Índice em (`PROCESSLIST_ID`)
* Índice em (`PROCESSLIST_USER`, `PROCESSLIST_HOST`)

* Índice em (`PROCESSLIST_HOST`)
* Índice em (`THREAD_OS_ID`)
* Índice em (`RESOURCE_GROUP`)

A operação `TRUNCATE TABLE` não é permitida para a tabela `threads`.