### 8.14.7 Replicação Estados de thread de replicação SQL

A lista a seguir mostra os estados mais comuns que você pode ver na coluna `State` para um tópico de servidor de replicação SQL:

* `Making temporary file (append) before replaying LOAD DATA INFILE`

  O thread está executando uma instrução `LOAD DATA` e está anexando os dados a um arquivo temporário que contém os dados a partir dos quais a replica lê as linhas.

* `Making temporary file (create) before replaying LOAD DATA INFILE`

  O thread está executando uma instrução `LOAD DATA` e está criando um arquivo temporário contendo os dados a partir dos quais a replica lê as linhas. Esse estado só pode ser encontrado se a instrução `LOAD DATA` original foi registrada por uma fonte executando uma versão do MySQL inferior a MySQL 5.0.3.

* `Reading event from the relay log`

  O thread leu um evento do log de relay para que o evento possa ser processado.

* `Slave has read all relay log; waiting for more updates`

  O thread processou todos os eventos nos arquivos de log do relay e agora está aguardando que o thread de E/S escreva novos eventos no log do relay.

* `Waiting for an event from Coordinator`

  Usando a replica multithreading (`slave_parallel_workers` é maior que 1), um dos threads de trabalho da replica está aguardando um evento da thread do coordenador.

* `Waiting for slave mutex on exit`

  Um estado muito breve que ocorre quando o thread está parando.

* `Waiting for Slave Workers to free pending events`

  Essa ação de espera ocorre quando o tamanho total dos eventos sendo processados pelos Workers excede o tamanho da variável de sistema `slave_pending_jobs_size_max`. O Coordenador retoma a agendamento quando o tamanho cai abaixo desse limite. Esse estado ocorre apenas quando `slave_parallel_workers` é definido como maior que 0.

* `Waiting for the next event in relay log`

  O estado inicial antes do evento de leitura do log do relay.

* `Waiting until MASTER_DELAY seconds after master executed event`

  O thread SQL leu um evento, mas está aguardando o término do atraso da replica. Esse atraso é definido com a opção `MASTER_DELAY` de `CHANGE MASTER TO`.

A coluna `Info` do thread de SQL também pode exibir o texto de uma instrução. Isso indica que o thread leu um evento do log de retransmissão, extraiu a instrução dele e pode estar executando-a.
