### 19.2.3 Fios de replicação

19.2.3.1 Monitoramento das Threads Principais de Replicação

19.2.3.2 Monitoramento das Threads do Trabalhador do Aplicativo de Aplicação de Replicação

As capacidades de replicação do MySQL são implementadas usando os seguintes tipos de threads:

- **Cabeçalho de registro binário.** A fonte cria um thread para enviar o conteúdo do registro binário para uma réplica quando a réplica se conecta. Esse thread pode ser identificado na saída do `SHOW PROCESSLIST` na fonte como o thread `Binlog Dump`.

- **Ferramenta de recepção de I/O de replicação.** Quando uma instrução `START REPLICA` é emitida em um servidor replica, a replica cria uma thread de recepção de I/O (receptor), que se conecta à fonte e pede para ela enviar as atualizações registradas em seus logs binários.

  O fio do receptor de replicação lê as atualizações que o fio `Binlog Dump` da fonte envia (veja o item anterior) e as copia para arquivos locais que compõem o log de retransmissão da replica.

  O estado deste fio é mostrado como `Slave_IO_running` na saída de `SHOW REPLICA STATUS`.

- **Thread do aplicativo SQL de replicação.** Quando `replica_parallel_workers` (no MySQL 8.0.26 e versões anteriores, use `slave_parallel_workers`) é igual a 0, a replica cria um thread de aplicativo SQL (aplicador) para ler o log de retransmissão que é escrito pelo thread receptor de replicação e executar as transações contidas nele. Quando `replica_parallel_workers` é `N >= 1`, há `N` threads de aplicador e um thread de coordenador, que lê as transações sequencialmente do log de retransmissão e agrupa-as para serem aplicadas por threads de trabalho. Cada trabalhador aplica as transações que o coordenador lhe atribuiu.

Você pode habilitar a paralelização adicional para tarefas em uma replica definindo a variável de sistema `replica_parallel_workers` (MySQL 8.0.26 ou posterior) ou `slave_parallel_workers` (antes de MySQL 8.0.26) para um valor maior que 0. Quando isso é feito, a replica cria o número especificado de threads de trabalhador para aplicar transações, além de um thread coordenador que lê as transações do log de retransmissão e as atribui aos trabalhadores. Uma replica com `replica_parallel_workers` (`slave_parallel_workers`) definida para um valor maior que 0 é chamada de replica multithread. Se você estiver usando vários canais de replicação, cada canal tem o número de threads especificado usando essa variável.

Nota

As réplicas multitelares são suportadas pelo NDB Cluster a partir do NDB 8.0.33. (Anteriormente, o `NDB` ignorava silenciosamente qualquer configuração para o `replica_parallel_workers`.) Consulte a Seção 25.7.11, “Replicação do NDB Cluster Usando o Aplicador Multitelares”, para obter mais informações.
