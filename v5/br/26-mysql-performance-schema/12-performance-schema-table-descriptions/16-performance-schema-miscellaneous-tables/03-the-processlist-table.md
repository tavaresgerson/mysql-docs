#### 25.12.16.3 A Tabela processlist

Nota

A tabela `processlist` é criada automaticamente no Performance Schema para novas instalações do MySQL 5.7.39, ou superior. Ela também é criada automaticamente por meio de um upgrade.

A lista de processos do MySQL indica as operações atualmente em execução pelo conjunto de Threads que estão rodando no servidor. A tabela `processlist` é uma das fontes de informação sobre processos. Para uma comparação desta tabela com outras fontes, consulte [Sources of Process Information](processlist-access.html#processlist-sources "Sources of Process Information").

A tabela `processlist` pode ser consultada (queried) diretamente. Se você tiver o privilégio `PROCESS`, poderá ver todos os Threads, mesmo aqueles pertencentes a outros usuários. Caso contrário (sem o privilégio `PROCESS`), usuários não anônimos têm acesso a informações sobre seus próprios Threads, mas não sobre Threads de outros usuários, e usuários anônimos não têm acesso a informações de Threads.

Nota

Se a variável de sistema `performance_schema_show_processlist` estiver habilitada, a tabela `processlist` também serve como base para uma implementação alternativa subjacente à instrução `SHOW PROCESSLIST`. Para detalhes, consulte mais adiante nesta seção.

A tabela `processlist` contém uma linha para cada processo do servidor:

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

A tabela `processlist` possui as seguintes colunas:

* `ID`

  O identificador da conexão (connection identifier). Este é o mesmo valor exibido na coluna `Id` da instrução `SHOW PROCESSLIST`, exibido na coluna `PROCESSLIST_ID` da tabela `threads` do Performance Schema, e retornado pela função `CONNECTION_ID()` dentro do Thread.

* `USER`

  O usuário MySQL que emitiu a instrução. Um valor de `system user` se refere a um Thread não cliente gerado pelo servidor para lidar com tarefas internamente, por exemplo, um Thread de manipulador de linhas atrasadas ou um Thread de I/O ou SQL usado em hosts de réplica. Para `system user`, não há host especificado na coluna `Host`. `unauthenticated user` refere-se a um Thread que se tornou associado a uma conexão de cliente, mas para o qual a autenticação do usuário cliente ainda não ocorreu. `event_scheduler` refere-se ao Thread que monitora eventos agendados (consulte [Section 23.4, “Using the Event Scheduler”]).

  Nota

  Um valor `USER` de `system user` é distinto do privilégio `SYSTEM_USER`. O primeiro designa Threads internos. O último distingue as categorias de conta de usuário de sistema e usuário regular (consulte [Account Categories](/doc/refman/8.0/en/account-categories.html)).

* `HOST`

  O nome do host do cliente que emitiu a instrução (exceto para `system user`, para o qual não há host). O nome do host para conexões TCP/IP é reportado no formato `host_name:client_port` para facilitar a determinação de qual cliente está fazendo o quê.

* `DB`

  O Database padrão para o Thread, ou `NULL` se nenhum tiver sido selecionado.

* `COMMAND`

  O tipo de comando que o Thread está executando em nome do cliente, ou `Sleep` se a sessão estiver ociosa. Para descrições dos comandos do Thread, consulte [Section 8.14, “Examining Server Thread (Process) Information”]. O valor desta coluna corresponde aos comandos `COM_xxx` do protocolo cliente/servidor e às variáveis de status `Com_xxx`. Consulte [Section 5.1.9, “Server Status Variables”].

* `TIME`

  O tempo em segundos em que o Thread permaneceu em seu estado atual. Para um Thread SQL de réplica, o valor é o número de segundos entre o timestamp do último evento replicado e o tempo real do host de réplica. Consulte [Section 16.2.3, “Replication Threads”].

* `STATE`

  Uma ação, evento ou estado que indica o que o Thread está fazendo. Para descrições dos valores de `STATE`, consulte [Section 8.14, “Examining Server Thread (Process) Information”].

  A maioria dos estados corresponde a operações muito rápidas. Se um Thread permanecer em um determinado estado por muitos segundos, pode haver um problema que precisa ser investigado.

* `INFO`

  A instrução que o Thread está executando, ou `NULL` se não estiver executando nenhuma instrução. A instrução pode ser aquela enviada ao servidor, ou uma instrução mais interna se a instrução executar outras instruções. Por exemplo, se uma instrução `CALL` executa uma stored procedure que está executando uma instrução `SELECT`, o valor `INFO` mostra a instrução `SELECT`.

* `EXECUTION_ENGINE`

  O motor (engine) de execução da Query. O valor é `PRIMARY` ou `SECONDARY`. Para uso com MySQL HeatWave Service e MySQL HeatWave, onde o engine `PRIMARY` é `InnoDB` e o engine `SECONDARY` é MySQL HeatWave (`RAPID`). Para MySQL Community Edition Server, MySQL Enterprise Edition Server (on-premise) e MySQL HeatWave Service sem MySQL HeatWave, o valor é sempre `PRIMARY`. Esta coluna foi adicionada no MySQL 8.0.29.

`TRUNCATE TABLE` não é permitido para a tabela `processlist`.

Conforme mencionado anteriormente, se a variável de sistema `performance_schema_show_processlist` estiver habilitada, a tabela `processlist` serve como base para uma implementação alternativa de outras fontes de informação de processo:

* A instrução `SHOW PROCESSLIST`.

* O comando **mysqladmin processlist** (que usa a instrução `SHOW PROCESSLIST`).

A implementação padrão de `SHOW PROCESSLIST` itera pelos Threads ativos a partir do gerenciador de Thread, enquanto mantém um Mutex global. Isso tem consequências negativas de performance, particularmente em sistemas ocupados. A implementação alternativa de `SHOW PROCESSLIST` é baseada na tabela `processlist` do Performance Schema. Esta implementação faz Query de dados de Thread ativo do Performance Schema em vez de usar o gerenciador de Thread e não requer um Mutex.

A configuração do MySQL afeta o conteúdo da tabela `processlist` da seguinte forma:

* Configuração mínima necessária:

  + O servidor MySQL deve ser configurado e construído com instrumentation de Thread habilitada. Isso é verdadeiro por padrão; é controlado usando a opção `DISABLE_PSI_THREAD` **CMake**.

  + O Performance Schema deve ser habilitado na inicialização do servidor. Isso é verdadeiro por padrão; é controlado usando a variável de sistema `performance_schema`.

  Com essa configuração satisfeita, `performance_schema_show_processlist` habilita ou desabilita a implementação alternativa de `SHOW PROCESSLIST`. Se a configuração mínima não for satisfeita, a tabela `processlist` (e, portanto, `SHOW PROCESSLIST`) pode não retornar todos os dados.

* Configuração recomendada:

  + Para evitar que alguns Threads sejam ignorados:

    - Deixe a variável de sistema `performance_schema_max_thread_instances` definida como o seu padrão ou defina-a para ser pelo menos tão grande quanto a variável de sistema `max_connections`.

    - Deixe a variável de sistema `performance_schema_max_thread_classes` definida como o seu padrão.

  + Para evitar que alguns valores da coluna `STATE` fiquem vazios, deixe a variável de sistema `performance_schema_max_stage_classes` definida como o seu padrão.

  O padrão para esses parâmetros de configuração é `-1`, o que faz com que o Performance Schema os defina automaticamente (autosize) na inicialização do servidor. Com os parâmetros definidos conforme indicado, a tabela `processlist` (e, portanto, `SHOW PROCESSLIST`) produz informações completas sobre o processo.

Os parâmetros de configuração anteriores afetam o conteúdo da tabela `processlist`. Para uma dada configuração, no entanto, o conteúdo de `processlist` não é afetado pela configuração de `performance_schema_show_processlist`.

A implementação alternativa da lista de processos não se aplica à tabela `PROCESSLIST` do `INFORMATION_SCHEMA` ou ao comando `COM_PROCESS_INFO` do protocolo cliente/servidor MySQL.