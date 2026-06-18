#### 29.12.21.7 Tabela processlist

A lista de processos do MySQL indica as operações atualmente realizadas pelo conjunto de threads que estão sendo executadas no servidor. A tabela `processlist` é uma fonte de informações sobre os processos. Para uma comparação desta tabela com outras fontes, consulte Fontes de Informações sobre Processos.

A tabela `processlist` pode ser consultada diretamente. Se você tiver o privilégio `PROCESS`, poderá ver todos os tópicos, mesmo aqueles pertencentes a outros usuários. Caso contrário (sem o privilégio `PROCESS`), os usuários não anônimos têm acesso às informações sobre seus próprios tópicos, mas não a tópicos de outros usuários, e os usuários anônimos não têm acesso às informações dos tópicos.

Nota

Se a variável de sistema `performance_schema_show_processlist` estiver habilitada, a tabela `processlist` também servirá como base para uma implementação alternativa subjacente à instrução `SHOW PROCESSLIST`. Para obter detalhes, consulte mais adiante nesta seção.

A tabela `processlist` contém uma linha para cada processo do servidor:

```
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

A tabela `processlist` tem essas colunas:

- `ID`

  O identificador de conexão. Este é o mesmo valor exibido na coluna `Id` da declaração `SHOW PROCESSLIST`, exibida na coluna `PROCESSLIST_ID` da tabela do Schema de Desempenho `threads`, e retornada pela função `CONNECTION_ID()` dentro do thread.

- `USER`

  O usuário do MySQL que emitiu a declaração. Um valor de `system user` refere-se a um fio não cliente gerado pelo servidor para lidar com tarefas internamente, por exemplo, um fio de manipulação de linha atrasada ou um fio de I/O ou SQL usado em hosts replicados. Para `system user`, não há nenhum host especificado na coluna `Host`. `unauthenticated user` refere-se a um fio que se tornou associado a uma conexão com o cliente, mas para o qual a autenticação do usuário do cliente ainda não ocorreu. `event_scheduler` refere-se ao fio que monitora eventos agendados (veja a Seção 27.4, “Usando o Agendador de Eventos”).

  Nota

  Um valor `USER` de `system user` é distinto do privilégio `SYSTEM_USER`. O primeiro designa threads internas. O segundo distingue as categorias de contas de usuário do sistema e as contas de usuário regulares (consulte a Seção 8.2.11, “Categorias de Conta”).

- `HOST`

  O nome do host do cliente que emite a declaração (exceto para `system user`, para o qual não há um host). O nome do host para conexões TCP/IP é relatado no formato `host_name:client_port` para facilitar a determinação de qual cliente está fazendo o que.

- `DB`

  O banco de dados padrão para o tópico, ou `NULL` se nenhum tiver sido selecionado.

- `COMMAND`

  O tipo de comando que o fio está executando em nome do cliente, ou `Sleep` se a sessão estiver inativa. Para descrições dos comandos do fio, consulte a Seção 10.14, “Examinando Informações do Fio (Processo) do Servidor” (Informações”). O valor desta coluna corresponde aos comandos `COM_xxx` do protocolo cliente/servidor e às variáveis de status `Com_xxx`. Consulte a Seção 7.1.10, “Variáveis de Status do Servidor”

- `TIME`

  O tempo em segundos que o fio esteve em seu estado atual. Para um fio de replicação SQL, o valor é o número de segundos entre o timestamp do último evento replicado e o horário real do host da replica. Veja a Seção 19.2.3, “Fios de Replicação”.

- `STATE`

  Uma ação, evento ou estado que indica o que o fio está fazendo. Para descrições dos valores de `STATE`, consulte a Seção 10.14, “Examinando Informações do Fio do Servidor (Processo”) (Informações”).

  A maioria dos estados corresponde a operações muito rápidas. Se um fio permanecer em um determinado estado por muitos segundos, pode haver um problema que precisa ser investigado.

- `INFO`

  A declaração que o fio está executando, ou `NULL` se não estiver executando nenhuma declaração. A declaração pode ser a enviada ao servidor ou uma declaração mais interna se a declaração executar outras declarações. Por exemplo, se uma declaração `CALL` executar um procedimento armazenado que está executando uma declaração `SELECT`, o valor `INFO` mostrará a declaração `SELECT`.

- `EXECUTION_ENGINE`

  O motor de execução de consultas. O valor é `PRIMARY` ou `SECONDARY`. Para uso com o MySQL HeatWave Service e o MySQL HeatWave, onde o motor `PRIMARY` é `InnoDB` e o motor `SECONDARY` é o MySQL HeatWave (`RAPID`). Para o MySQL Community Edition Server, o MySQL Enterprise Edition Server (on-premise) e o MySQL HeatWave Service sem o MySQL HeatWave, o valor é sempre `PRIMARY`. Esta coluna foi adicionada no MySQL 8.0.29.

A tabela `processlist` tem esses índices:

- Chave primária em (`ID`)

`TRUNCATE TABLE` não é permitido para a tabela `processlist`.

Como mencionado anteriormente, se a variável de sistema `performance_schema_show_processlist` estiver habilitada, a tabela `processlist` serve como base para uma implementação alternativa de outras fontes de informações do processo:

- A declaração `SHOW PROCESSLIST`.

- O comando **mysqladmin processlist** (que usa a instrução `SHOW PROCESSLIST`).

A implementação padrão `SHOW PROCESSLIST` itera pelos threads ativos a partir do gerenciador de threads, mantendo um mutex global. Isso tem consequências negativas no desempenho, especialmente em sistemas ocupados. A implementação alternativa `SHOW PROCESSLIST` é baseada na tabela do Schema de Desempenho `processlist`. Essa implementação consulta os dados dos threads ativos do Schema de Desempenho, em vez do gerenciador de threads, e não requer um mutex.

A configuração do MySQL afeta o conteúdo da tabela `processlist` da seguinte forma:

- Configuração mínima necessária:

  - O servidor MySQL deve ser configurado e compilado com a instrumentação de threads habilitada. Isso é feito por padrão; isso é controlado usando a opção `DISABLE_PSI_THREAD` **CMake**.

  - O Schema de Desempenho deve ser habilitado na inicialização do servidor. Isso é verdadeiro por padrão; ele é controlado usando a variável de sistema `performance_schema`.

  Com essa configuração atendida, `performance_schema_show_processlist` habilita ou desabilita a implementação alternativa `SHOW PROCESSLIST`. Se a configuração mínima não for atendida, a tabela `processlist` (e, portanto, `SHOW PROCESSLIST`) pode não retornar todos os dados.

- Configuração recomendada:

  - Para evitar que alguns tópicos sejam ignorados:

    - Mantenha a variável de sistema `performance_schema_max_thread_instances` definida como padrão ou configure-a pelo menos tão grande quanto a variável de sistema `max_connections`.

    - Mantenha a variável de sistema `performance_schema_max_thread_classes` definida como padrão.

  - Para evitar que alguns valores da coluna `STATE` sejam vazios, deixe a variável de sistema `performance_schema_max_stage_classes` definida como padrão.

  O valor padrão para esses parâmetros de configuração é `-1`, que faz com que o Performance Schema os dimensione automaticamente ao iniciar o servidor. Com os parâmetros definidos conforme indicado, a tabela `processlist` (e, portanto, `SHOW PROCESSLIST`) fornece informações completas sobre os processos.

Os parâmetros de configuração anteriores afetam o conteúdo da tabela `processlist`. Para uma configuração específica, no entanto, o conteúdo da `processlist` não é afetado pela configuração da `performance_schema_show_processlist`.

A implementação da lista de processos alternativos não se aplica à tabela `INFORMATION_SCHEMA` `PROCESSLIST` ou ao comando `COM_PROCESS_INFO` do protocolo cliente/servidor do MySQL.
