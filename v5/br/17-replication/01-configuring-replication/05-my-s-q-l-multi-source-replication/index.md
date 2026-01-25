### 16.1.5 Replicação Multi-Source MySQL

[16.1.5.1 Configurando a Replicação Multi-Source](replication-multi-source-configuration.html)

[16.1.5.2 Provisionando uma Replica Multi-Source para Replicação Baseada em GTID](replication-multi-source-provision-replica.html)

[16.1.5.3 Adicionando Sources Baseados em GTID a uma Replica Multi-Source](replication-multi-source-adding-gtid-master.html)

[16.1.5.4 Adicionando um Source Baseado em Binary Log a uma Replica Multi-Source](replication-multi-source-adding-binlog-master.html)

[16.1.5.5 Iniciando Replicas Multi-Source](replication-multi-source-start-replica.html)

[16.1.5.6 Parando Replicas Multi-Source](replication-multi-source-stop-replica.html)

[16.1.5.7 Resetando Replicas Multi-Source](replication-multi-source-reset-replica.html)

[16.1.5.8 Monitoramento da Replicação Multi-Source](replication-multi-source-monitoring.html)

A replicação multi-source MySQL permite que uma replica receba transações de múltiplas sources imediatas em paralelo. Em uma topologia de replicação multi-source, uma replica cria um replication channel para cada source da qual deve receber transações. Para mais informações sobre como os replication channels funcionam, consulte [Seção 16.2.2, “Replication Channels”](replication-channels.html "16.2.2 Replication Channels").

Você pode optar por implementar a replicação multi-source para atingir objetivos como estes:

* Fazer o Backup de múltiplos servers para um único server.
* Fazer o Merge de shards de tabelas.
* Consolidar dados de múltiplos servers para um único server.

A replicação multi-source não implementa nenhuma detecção ou resolução de conflitos ao aplicar transações, e essas tarefas são deixadas para a aplicação, se necessário.

**Nota**

Cada channel em uma replica multi-source deve replicar a partir de uma source diferente. Não é possível configurar múltiplos replication channels de uma única replica para uma única source. Isso ocorre porque os Server IDs das replicas devem ser únicos em uma topologia de replicação. A source distingue as replicas apenas pelos seus Server IDs, e não pelos nomes dos replication channels, portanto, ela não pode reconhecer diferentes replication channels provenientes da mesma replica.

Uma replica multi-source também pode ser configurada como uma replica multi-threaded, definindo a variável de sistema [`slave_parallel_workers`](replication-options-replica.html#sysvar_slave_parallel_workers) para um valor maior que 0. Ao fazer isso em uma replica multi-source, cada channel na replica terá o número especificado de applier threads, mais um coordinator thread para gerenciá-los. Você não pode configurar o número de applier threads para channels individuais.

Esta seção fornece tutoriais sobre como configurar sources e replicas para replicação multi-source, como iniciar, parar e resetar replicas multi-source e como monitorar a replicação multi-source.