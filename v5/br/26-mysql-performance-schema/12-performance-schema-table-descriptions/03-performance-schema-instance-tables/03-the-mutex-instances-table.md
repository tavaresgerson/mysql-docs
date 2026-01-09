#### 25.12.3.3 A tabela mutex_instances

A tabela `mutex_instances` lista todos os mutexes vistos pelo Schema de Desempenho enquanto o servidor está em execução. Um mutex é um mecanismo de sincronização usado no código para garantir que apenas um thread, de cada vez, possa ter acesso a um recurso comum. O recurso é dito estar "protegido" pelo mutex.

Quando dois threads estão executando no servidor (por exemplo, duas sessões de usuário executando uma consulta simultaneamente) precisam acessar o mesmo recurso (um arquivo, um buffer ou algum pedaço de dados), esses dois threads competem entre si, de modo que a primeira consulta a obter um bloqueio no mutex faz com que a outra consulta espere até que a primeira termine e desbloqueie o mutex.

O trabalho realizado enquanto se mantém um mutex é chamado de "seção crítica", e múltiplas consultas executam essa seção crítica de forma serializada (uma de cada vez), o que pode ser um gargalo potencial.

A tabela `mutex_instances` tem as seguintes colunas:

- `NOME`

  O nome do instrumento associado ao mutex.

- `OBJECT_INSTANCE_BEGIN`

  O endereço em memória do mutex instrumentado.

- `LOCKED_BY_THREAD_ID`

  Quando um fio atualmente tem um mutex bloqueado, `LOCKED_BY_THREAD_ID` é o `THREAD_ID` do fio de bloqueio, caso contrário, é `NULL`.

A operação `TRUNCATE TABLE` não é permitida para a tabela `mutex_instances`.

Para cada mutex instrumentado no código, o Gerenciamento de Desempenho fornece as seguintes informações.

- A tabela `setup_instruments` lista o nome do ponto de instrumentação, com o prefixo `wait/synch/mutex/`.

- Quando algum código cria um mutex, uma linha é adicionada à tabela `mutex_instances`. A coluna `OBJECT_INSTANCE_BEGIN` é uma propriedade que identifica de forma única o mutex.

- Quando um fio tenta bloquear um mutex, a tabela `events_waits_current` mostra uma linha para esse fio, indicando que ele está aguardando um mutex (na coluna `EVENT_NAME`) e indicando qual mutex está sendo aguardado (na coluna `OBJECT_INSTANCE_BEGIN`).

- Quando um fio consegue bloquear um mutex:

  - `eventos_waits_current` mostra que a espera no mutex foi concluída (nas colunas `TIMER_END` e `TIMER_WAIT`)

  - O evento de espera concluído é adicionado às tabelas `events_waits_history` e `events_waits_history_long`

  - `mutex_instances` mostra que o mutex agora pertence ao thread (na coluna `THREAD_ID`).

- Quando um fio desbloqueia um mutex, `mutex_instances` mostra que o mutex agora não tem proprietário (a coluna `THREAD_ID` é `NULL`).

- Quando um objeto de mutex é destruído, a linha correspondente é removida de `mutex_instances`.

Ao realizar consultas em ambas as tabelas a seguir, um aplicativo de monitoramento ou um DBA pode detectar gargalos ou bloqueios entre threads que envolvem mútuos:

- `eventos_waits_current`, para ver qual mutex um thread está esperando

- `mutex_instances`, para ver qual outro thread atualmente possui um mutex
