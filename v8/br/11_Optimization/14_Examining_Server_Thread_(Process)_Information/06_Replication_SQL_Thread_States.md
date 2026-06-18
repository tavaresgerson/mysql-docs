### 10.14.6 Estados de fila de threads SQL de replicação

A lista a seguir mostra os estados mais comuns que você pode ver na coluna `State` para um fio de SQL de replicação em um servidor de replica.

No MySQL 8.0.26, foram feitas alterações incompatíveis nos nomes das instrumentações, incluindo os nomes das etapas do thread, que contêm os termos “master”, que foi alterado para “source”, “slave”, que foi alterado para “replica” e “mts” (para “multithreaded slave”), que foi alterado para “mta” (para “multithreaded applier”). Ferramentas de monitoramento que trabalham com esses nomes de instrumentação podem ser afetadas. Se as alterações incompatíveis tiverem um impacto para você, defina a variável de sistema `terminology_use_previous` para `BEFORE_8_0_26` para fazer o MySQL Server usar as versões antigas dos nomes para os objetos especificados na lista anterior. Isso permite que as ferramentas de monitoramento que dependem dos nomes antigos continuem funcionando até que possam ser atualizadas para usar os novos nomes.

Defina a variável de sistema `terminology_use_previous` com escopo de sessão para suportar funções individuais ou escopo global para ser o padrão para todas as novas sessões. Quando o escopo global é usado, o log de consultas lentas contém as versões antigas dos nomes.

- `Making temporary file (append) before replaying LOAD DATA INFILE`

  O fio está executando uma instrução `LOAD DATA` e está anexando os dados a um arquivo temporário que contém os dados a partir dos quais a replica lê as linhas.

- `Making temporary file (create) before replaying LOAD DATA INFILE`

  O fio está executando uma instrução `LOAD DATA` e está criando um arquivo temporário contendo os dados a partir dos quais a replica lê as linhas. Esse estado só pode ser encontrado se a instrução original `LOAD DATA` tiver sido registrada por uma fonte executando uma versão do MySQL inferior a MySQL 5.0.3.

- `Reading event from the relay log`

  O fio leu um evento do log de relé para que o evento possa ser processado.

- `Slave has read all relay log; waiting for more updates`

  A partir do MySQL 8.0.26: `Replica has read all relay log; waiting for more updates`

  O fio processou todos os eventos nos arquivos de log do relé e agora está aguardando que o fio de I/O (receptor) escreva novos eventos no log do relé.

- `Waiting for an event from Coordinator`

  Ao usar a replica multithreading (`replica_parallel_workers` ou `slave_parallel_workers` é maior que 1), um dos threads de trabalho da replica está aguardando um evento do thread do coordenador.

- `Waiting for slave mutex on exit`

  A partir do MySQL 8.0.26: `Waiting for replica mutex on exit`

  Um estado muito breve que ocorre quando o fio está parando.

- `Waiting for Slave Workers to free pending events`

  A partir do MySQL 8.0.26: `Waiting for Replica Workers to free pending events`

  Essa ação de espera ocorre quando o tamanho total dos eventos sendo processados pelos Workers excede o tamanho da variável de sistema `replica_pending_jobs_size_max` ou `slave_pending_jobs_size_max`. O Coordenador retoma a agendamento quando o tamanho cai abaixo desse limite. Esse estado ocorre apenas quando `replica_parallel_workers` ou `slave_parallel_workers` é definido como maior que 0.

- `Waiting for the next event in relay log`

  O estado inicial antes de `Reading event from the relay log`.

- `Waiting until MASTER_DELAY seconds after master executed event`

  A partir do MySQL 8.0.26: `Waiting until SOURCE_DELAY seconds after master executed event`

  O fio SQL leu um evento, mas está aguardando o término do atraso da replica. Esse atraso é definido com a opção `SOURCE_DELAY` | `MASTER_DELAY` da instrução `CHANGE REPLICATION SOURCE TO` (a partir do MySQL 8.0.23) ou da instrução `CHANGE MASTER TO` (antes do MySQL 8.0.23).

A coluna `Info` do fio de SQL também pode exibir o texto de uma instrução. Isso indica que o fio leu um evento do log de relé, extraiu a instrução dele e pode estar executando-a.
