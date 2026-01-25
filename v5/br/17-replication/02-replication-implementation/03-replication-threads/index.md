### 16.2.3 Threads de Replication

[16.2.3.1 Monitorando os Threads Principais de Replication](replication-threads-monitor-main.html)

[16.2.3.2 Monitorando os Worker Threads de Aplicação de Replication](replication-threads-monitor-worker.html)

As funcionalidades de Replication do MySQL são implementadas usando três threads principais, um no servidor source e dois na replica:

* **Binary log dump thread.** O source cria um thread para enviar o conteúdo do binary log para uma replica quando a replica se conecta. Este thread pode ser identificado na saída de [`SHOW PROCESSLIST`](show-processlist.html "13.7.5.29 SHOW PROCESSLIST Statement") no source como o thread `Binlog Dump`.

  O binary log dump thread adquire um Lock no binary log do source para ler cada event que deve ser enviado para a replica. Assim que o event é lido, o Lock é liberado, mesmo antes de o event ser enviado para a replica.

* **Replication I/O thread.** Quando uma instrução [`START SLAVE`](start-slave.html "13.4.2.5 START SLAVE Statement") é emitida em um servidor replica, a replica cria um I/O thread, que se conecta ao source e solicita que ele envie as atualizações registradas em seus binary logs.

  O replication I/O thread lê as atualizações que o thread `Binlog Dump` do source envia (veja o item anterior) e as copia para arquivos locais que compõem o relay log da replica.

  O estado deste thread é exibido como `Slave_IO_running` na saída de [`SHOW SLAVE STATUS`](show-slave-status.html "13.7.5.34 SHOW SLAVE STATUS Statement").

* **Replication SQL thread.** A replica cria um SQL thread para ler o relay log que é escrito pelo replication I/O thread e executar as transactions contidas nele.

Existem três threads principais para cada conexão source/replica. Um source que possui múltiplas replicas cria um binary log dump thread para cada replica conectada no momento, e cada replica tem seus próprios replication I/O e SQL threads.

Uma replica usa dois threads para separar a leitura das atualizações do source e a execução delas em tarefas independentes. Assim, a tarefa de ler transactions não é desacelerada se o processo de aplicação for lento. Por exemplo, se o servidor replica não estiver rodando por um tempo, seu I/O thread pode buscar rapidamente todo o conteúdo do binary log do source quando a replica inicia, mesmo que o SQL thread esteja muito atrasado. Se a replica parar antes que o SQL thread tenha executado todas as instruções buscadas, o I/O thread pelo menos buscou tudo, de modo que uma cópia segura das transactions seja armazenada localmente nos relay logs da replica, pronta para execução na próxima vez que a replica iniciar.

Você pode habilitar uma paralelização adicional para tarefas em uma replica definindo a variável de sistema [`slave_parallel_workers`](replication-options-replica.html#sysvar_slave_parallel_workers) para um valor maior que 0 (o padrão). Quando esta variável de sistema é definida, a replica cria o número especificado de worker threads para aplicar transactions, mais um coordinator thread para gerenciá-los. Se você estiver usando múltiplos replication channels, cada channel tem este número de threads. Uma replica com [`slave_parallel_workers`](replication-options-replica.html#sysvar_slave_parallel_workers) definido para um valor maior que 0 é chamada de multithreaded replica. Com essa configuração, transactions que falham podem ser tentadas novamente.

Nota

Multithreaded replicas não são suportadas atualmente pelo NDB Cluster, que ignora silenciosamente a configuração desta variável. Veja [Seção 21.7.3, “Known Issues in NDB Cluster Replication”](mysql-cluster-replication-issues.html "21.7.3 Known Issues in NDB Cluster Replication") para mais informações.
