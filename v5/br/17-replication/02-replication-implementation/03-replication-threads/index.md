### 16.2.3 Fios de replicação

16.2.3.1 Monitoramento de Threads Principais de Replicação

16.2.3.2 Monitoramento de Threads do Trabalhador do Aplicativo de Aplicação de Replicação

As capacidades de replicação do MySQL são implementadas usando três threads principais, um no servidor de origem e dois na replica:

- **Thread de exclusão de log binário.** A fonte cria um thread para enviar o conteúdo do log binário para uma réplica quando a réplica se conecta. Esse thread pode ser identificado na saída de `SHOW PROCESSLIST` na fonte como o thread `Exclusão de Log Binário`.

  O fio de exclusão de log binário obtém um bloqueio no log binário da fonte para ler cada evento que será enviado para a réplica. Assim que o evento é lido, o bloqueio é liberado, mesmo antes de o evento ser enviado para a réplica.

- **Spool de I/O de replicação.** Quando uma instrução `START SLAVE` é emitida em um servidor replica, a replica cria um spool de I/O, que se conecta à fonte e pede que ela envie as atualizações registradas em seus logs binários.

  A thread de I/O de replicação lê as atualizações enviadas pela thread `Binlog Dump` da fonte (veja o item anterior) e as copia para arquivos locais que compõem o log de retransmissão da replica.

  O estado deste fio é exibido como `Slave_IO_running` na saída de `SHOW SLAVE STATUS`.

- **Fuso de replicação SQL.** A replica cria um fuso de SQL para ler o log de retransmissão que é escrito pelo fuso de E/S de replicação e executar as transações contidas nele.

Há três fios principais para cada conexão de fonte/replica. Uma fonte que tem múltiplas réplicas cria um fio de exibição de dump de log binário para cada replica conectada atualmente, e cada replica tem seus próprios fios de I/O de replicação e SQL.

Uma replica usa dois threads para separar as atualizações de leitura da fonte e executá-las em tarefas independentes. Assim, a tarefa de leitura das transações não é retardada se o processo de aplicação delas for lento. Por exemplo, se o servidor de replica não estiver em execução há algum tempo, seu thread de I/O pode rapidamente obter todos os conteúdos do log binário da fonte quando a replica começar, mesmo que o thread de SQL esteja muito atrasado. Se a replica parar antes que o thread de SQL tenha executado todas as declarações obtidas, o thread de I/O pelo menos obteve tudo, de modo que uma cópia segura das transações seja armazenada localmente nos logs de retransmissão da replica, pronta para execução na próxima vez que a replica começar.

Você pode habilitar a paralelização adicional para tarefas em uma replica definindo a variável de sistema `slave_parallel_workers` para um valor maior que 0 (o padrão). Quando essa variável de sistema é definida, a replica cria o número especificado de threads de trabalho para aplicar transações, além de um thread de coordenador para gerenciá-las. Se você estiver usando vários canais de replicação, cada canal tem esse número de threads. Uma replica com `slave_parallel_workers` definida para um valor maior que 0 é chamada de replica multithread. Com essa configuração, as transações que falham podem ser reprojetadas.

Nota

As réplicas multithread não são atualmente suportadas pelo NDB Cluster, que ignora silenciosamente a configuração dessa variável. Consulte Seção 21.7.3, “Problemas Conhecidos na Replicação do NDB Cluster” para obter mais informações.
