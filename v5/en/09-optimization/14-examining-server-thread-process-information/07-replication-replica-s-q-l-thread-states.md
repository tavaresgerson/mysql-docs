### 8.14.7 Estados da Thread SQL da Replica de Replicação

A lista a seguir exibe os estados mais comuns que você pode ver na coluna `State` para uma thread SQL de um servidor replica:

* `Making temporary file (append) before replaying LOAD DATA INFILE`

  A thread está executando uma instrução `LOAD DATA` e está anexando (append) os dados a um arquivo temporário que contém os dados a partir dos quais a replica lê as linhas.

* `Making temporary file (create) before replaying LOAD DATA INFILE`

  A thread está executando uma instrução `LOAD DATA` e está criando um arquivo temporário que contém os dados a partir dos quais a replica lê as linhas. Este estado só pode ser encontrado se a instrução `LOAD DATA` original foi registrada por um source executando uma versão do MySQL inferior à MySQL 5.0.3.

* `Reading event from the relay log`

  A thread leu um event do relay log para que o event possa ser processado.

* `Slave has read all relay log; waiting for more updates`

  A thread processou todos os events nos arquivos do relay log e agora está aguardando a thread de I/O escrever novos events no relay log.

* `Waiting for an event from Coordinator`

  Usando a replica multithreaded (`slave_parallel_workers` é maior que 1), uma das threads worker da replica está aguardando um event da thread coordinator.

* `Waiting for slave mutex on exit`

  Um estado muito breve que ocorre quando a thread está parando.

* `Waiting for Slave Workers to free pending events`

  Essa ação de espera ocorre quando o tamanho total dos events sendo processados pelos Workers excede o tamanho da variável de sistema `slave_pending_jobs_size_max`. O Coordinator retoma o agendamento quando o tamanho cai abaixo deste limite. Este estado ocorre somente quando `slave_parallel_workers` está definido com um valor maior que 0.

* `Waiting for the next event in relay log`

  O estado inicial antes de `Reading event from the relay log`.

* `Waiting until MASTER_DELAY seconds after master executed event`

  A thread SQL leu um event, mas está aguardando o lapso de tempo do delay da replica. Este delay é definido com a opção `MASTER_DELAY` de `CHANGE MASTER TO`.

A coluna `Info` para a thread SQL também pode mostrar o texto de uma instrução. Isso indica que a thread leu um event do relay log, extraiu a instrução dele e pode estar executando-a.