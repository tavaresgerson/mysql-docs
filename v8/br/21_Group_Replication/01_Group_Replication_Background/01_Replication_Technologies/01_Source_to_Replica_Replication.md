#### 20.1.1.1 Fonte para replicação da replicação

A replicação tradicional do MySQL oferece uma abordagem simples de replicação. A fonte é o primário, e há uma ou mais réplicas, que são secundários. A fonte aplica transações, as confirma e, em seguida, são enviadas posteriormente (assim de forma assíncrona) às réplicas para serem reexecutadas (na replicação baseada em declarações) ou aplicadas (na replicação baseada em linhas). É um sistema sem compartilhamento de recursos, onde todos os servidores têm uma cópia completa dos dados por padrão.

**Figura 20.1 Replicação Assíncrona do MySQL**

![A transaction received by the source is executed, written to the binary log, then committed, and a response is sent to the client application. The record from the binary log is sent to the relay logs on Replica 1 and Replica 2 before the commit takes place on the source. On each of the replicas, the transaction is applied, written to the replica's binary log, and committed. The commit on the source and the commits on the replicas are all independent and asynchronous.](images/async-replication-diagram.png)

Há também a replicação semissíncrona, que adiciona uma etapa de sincronização ao protocolo. Isso significa que o primário aguarda, no momento da aplicação, que o secundário confirme que ele *recebeu* a transação. Somente então o primário retoma a operação de commit.

**Figura 20.2 Replicação Semisincronizada do MySQL**

![A transaction received by the source is executed and written to the binary log. The record from the binary log is sent to the relay logs on Replica 1 and Replica 2. The source then waits for an acknowledgement from the replicas. When both of the replicas have returned the acknowledgement, the source commits the transaction, and a response is sent to the client application. After each replica has returned its acknowledgement, it applies the transaction, writes it to the binary log, and commits it. The commit on the source depends on the acknowledgement from the replicas, but the commits on the replicas are independent from each other and from the commit on the source.](images/semisync-replication-diagram.png)

Nas duas imagens, há um diagrama do protocolo clássico de replicação assíncrona do MySQL (e também de sua variante semiesincrônica). As setas entre as diferentes instâncias representam as mensagens trocadas entre os servidores ou as mensagens trocadas entre os servidores e o aplicativo do cliente.
