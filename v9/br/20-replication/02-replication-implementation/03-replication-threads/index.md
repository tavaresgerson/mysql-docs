### 19.2.3 Threads de Replicação

19.2.3.1 Monitoramento dos Threads Principais de Replicação

19.2.3.2 Monitoramento dos Threads de Aplicação de Replicação

As capacidades de replicação do MySQL são implementadas usando os seguintes tipos de threads:

* **Thread de exibição de exaustão de log binário.** A fonte cria um thread para enviar o conteúdo do log binário para uma replica quando a replica se conecta. Esse thread pode ser identificado na saída de `SHOW PROCESSLIST` na fonte como o thread `Binlog Dump`.

* **Thread de receptor de I/O de replicação.** Quando uma instrução `START REPLICA` é emitida em um servidor de replica, a replica cria um thread de I/O (receptor), que se conecta à fonte e pede para ela enviar as atualizações registradas em seus logs binários.

  O thread de receptor de replicação lê as atualizações que o thread `Binlog Dump` da fonte envia (veja o item anterior) e as copia para arquivos locais que compõem o log de relevo da replica.

  O estado desse thread é mostrado como `Slave_IO_running` na saída de `SHOW REPLICA STATUS`.

* **Thread de aplicação de SQL de replicação.** Existem *`N`* threads de aplicação e um thread coordenador, que lê as transações sequencialmente do log de relevo e agrupa-as para serem aplicadas por threads de trabalho. Cada trabalhador aplica as transações que o coordenador lhe atribuiu.

  A replica cria o número especificado de threads de trabalho, especificado por `replica_parallel_workers`, para aplicar as transações, mais um thread coordenador que lê as transações do log de relevo e as atribui aos trabalhadores. Se você estiver usando múltiplos canais de replicação, cada canal tem o número de threads especificado usando essa variável.

  Replicas multithread também são suportadas pelo NDB Cluster. Veja a Seção 25.7.11, “NDB Cluster Replication Using the Multithreaded Applier”, para mais informações.