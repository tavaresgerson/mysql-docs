#### 29.12.3.3 A tabela mutex_instances

A tabela `mutex_instances` lista todos os mútues observados pelo Schema de Desempenho enquanto o servidor está em execução. Um mútuo é um mecanismo de sincronização usado no código para garantir que apenas um thread, em um dado momento, possa ter acesso a um recurso comum. O recurso é dito estar “protegido” pelo mútuo.

Quando dois threads que estão executando no servidor (por exemplo, duas sessões de usuário executando uma consulta simultaneamente) precisam acessar o mesmo recurso (um arquivo, um buffer ou algum pedaço de dados), esses dois threads competem entre si, de modo que a primeira consulta a obter um bloqueio no mútuo faz com que a outra consulta espere até que a primeira termine e desbloqueie o mútuo.

O trabalho realizado enquanto se mantém um mútuo é dito estar em uma “seção crítica”, e múltiplas consultas executam essa seção crítica de forma serializada (uma de cada vez), o que é um potencial gargalo.

A tabela `mutex_instances` tem essas colunas:

* `NAME`

  O nome do instrumento associado ao mútuo.

* `OBJECT_INSTANCE_BEGIN`

  O endereço na memória do mútuo instrumentado.

* `LOCKED_BY_THREAD_ID`

  Quando um thread atualmente tem um mútuo bloqueado, `LOCKED_BY_THREAD_ID` é o `THREAD_ID` do thread que está bloqueando, caso contrário, é `NULL`.

A tabela `mutex_instances` tem esses índices:

* Chave primária em (`OBJECT_INSTANCE_BEGIN`)
* Índice em (`NAME`)
* Índice em (`LOCKED_BY_THREAD_ID`)

A operação `TRUNCATE TABLE` não é permitida para a tabela `mutex_instances`.

Para cada mútuo instrumentado no código, o Schema de Desempenho fornece as seguintes informações.

* A tabela `setup_instruments` lista o nome do ponto de instrumentação, com o prefixo `wait/synch/mutex/`.

* Quando algum código cria um mutex, uma linha é adicionada à tabela `mutex_instances`. A coluna `OBJECT_INSTANCE_BEGIN` é uma propriedade que identifica de forma única o mutex.

* Quando um thread tenta bloquear um mutex, a tabela `events_waits_current` mostra uma linha para esse thread, indicando que ele está aguardando por um mutex (na coluna `EVENT_NAME`) e indicando qual mutex está sendo aguardado (na coluna `OBJECT_INSTANCE_BEGIN`).

* Quando um thread consegue bloquear um mutex:

  + `events_waits_current` mostra que a espera pelo mutex foi concluída (nas colunas `TIMER_END` e `TIMER_WAIT`)

  + O evento de espera concluído é adicionado às tabelas `events_waits_history` e `events_waits_history_long`

  + `mutex_instances` mostra que o mutex agora pertence ao thread (na coluna `THREAD_ID`).

* Quando um thread desbloqueia um mutex, `mutex_instances` mostra que o mutex agora não pertence a nenhum outro thread (a coluna `THREAD_ID` é `NULL`).

* Quando um objeto de mutex é destruído, a linha correspondente é removida de `mutex_instances`.

Ao realizar consultas em ambas as tabelas a seguir, um aplicativo de monitoramento ou um DBA pode detectar gargalos ou bloqueios entre threads que envolvem mutexes:

* `events_waits_current`, para ver qual mutex um thread está esperando

* `mutex_instances`, para ver qual outro thread atualmente possui um mutex