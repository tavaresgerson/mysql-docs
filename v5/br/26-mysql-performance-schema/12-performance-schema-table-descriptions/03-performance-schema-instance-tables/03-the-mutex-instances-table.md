#### 25.12.3.3 A Tabela mutex_instances

A tabela [`mutex_instances`](performance-schema-mutex-instances-table.html "25.12.3.3 The mutex_instances Table") lista todos os mutexes vistos pelo Performance Schema enquanto o servidor executa. Um mutex é um mecanismo de sincronização usado no código para garantir que apenas um Thread por vez possa ter acesso a algum recurso comum. Diz-se que o recurso é “protegido” pelo mutex.

Quando dois Threads em execução no servidor (por exemplo, duas sessões de usuário executando uma Query simultaneamente) precisam acessar o mesmo recurso (um arquivo, um Buffer, ou alguma parte de dados), esses dois Threads competem entre si, de modo que a primeira Query a obter um Lock no mutex faz com que a outra Query espere até que a primeira termine e desbloqueie o mutex.

O trabalho realizado enquanto se mantém um mutex é considerado uma "seção crítica" (critical section), e múltiplas Queries executam esta seção crítica de forma serializada (uma de cada vez), o que é um potencial Bottleneck.

A tabela [`mutex_instances`](performance-schema-mutex-instances-table.html "25.12.3.3 The mutex_instances Table") possui as seguintes colunas:

* `NAME`

  O nome do Instrument associado ao mutex.

* `OBJECT_INSTANCE_BEGIN`

  O endereço na memória do mutex instrumentado.

* `LOCKED_BY_THREAD_ID`

  Quando um Thread atualmente tem um mutex com Lock, `LOCKED_BY_THREAD_ID` é o `THREAD_ID` do Thread que o bloqueou, caso contrário, é `NULL`.

O [`TRUNCATE TABLE`](truncate-table.html "13.1.34 TRUNCATE TABLE Statement") não é permitido para a tabela [`mutex_instances`](performance-schema-mutex-instances-table.html "25.12.3.3 The mutex_instances Table").

Para cada mutex instrumentado no código, o Performance Schema fornece as seguintes informações.

* A tabela [`setup_instruments`](performance-schema-setup-instruments-table.html "25.12.2.3 The setup_instruments Table") lista o nome do ponto de instrumentação, com o prefixo `wait/synch/mutex/`.

* Quando algum código cria um mutex, uma linha é adicionada à tabela [`mutex_instances`](performance-schema-mutex-instances-table.html "25.12.3.3 The mutex_instances Table"). A coluna `OBJECT_INSTANCE_BEGIN` é uma propriedade que identifica o mutex de forma única.

* Quando um Thread tenta obter um Lock em um mutex, a tabela [`events_waits_current`](performance-schema-events-waits-current-table.html "25.12.4.1 The events_waits_current Table") mostra uma linha para esse Thread, indicando que ele está esperando por um mutex (na coluna `EVENT_NAME`), e indicando qual mutex está sendo esperado (na coluna `OBJECT_INSTANCE_BEGIN`).

* Quando um Thread é bem-sucedido em obter um Lock em um mutex:

  + [`events_waits_current`](performance-schema-events-waits-current-table.html "25.12.4.1 The events_waits_current Table") mostra que a espera pelo mutex foi concluída (nas colunas `TIMER_END` e `TIMER_WAIT`)

  + O evento de espera concluído é adicionado às tabelas [`events_waits_history`](performance-schema-events-waits-history-table.html "25.12.4.2 The events_waits_history Table") e [`events_waits_history_long`](performance-schema-events-waits-history-long-table.html "25.12.4.3 The events_waits_history_long Table")

  + [`mutex_instances`](performance-schema-mutex-instances-table.html "25.12.3.3 The mutex_instances Table") mostra que o mutex agora é de propriedade do Thread (na coluna `THREAD_ID`).

* Quando um Thread desbloqueia um mutex, [`mutex_instances`](performance-schema-mutex-instances-table.html "25.12.3.3 The mutex_instances Table") mostra que o mutex agora não tem proprietário (a coluna `THREAD_ID` é `NULL`).

* Quando um objeto mutex é destruído, a linha correspondente é removida de [`mutex_instances`](performance-schema-mutex-instances-table.html "25.12.3.3 The mutex_instances Table").

Ao executar Queries em ambas as tabelas a seguir, um aplicativo de monitoramento ou um DBA pode detectar Bottlenecks ou Deadlocks entre Threads que envolvem mutexes:

* [`events_waits_current`](performance-schema-events-waits-current-table.html "25.12.4.1 The events_waits_current Table"), para ver qual mutex um Thread está esperando

* [`mutex_instances`](performance-schema-mutex-instances-table.html "25.12.3.3 The mutex_instances Table"), para ver qual outro Thread é atualmente o proprietário de um mutex