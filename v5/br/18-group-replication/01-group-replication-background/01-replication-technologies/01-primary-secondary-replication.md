#### 17.1.1.1 Replication Primary-Secondary

A Traditional MySQL Replication fornece uma abordagem Primary-Secondary simples para a replication. Existe um primary (source) e há um ou mais secondaries (replicas). O primary executa transactions, faz o commit delas e, em seguida, elas são posteriormente (portanto, assincronamente) enviadas aos secondaries para serem reexecutadas (na statement-based replication) ou aplicadas (na row-based replication). É um sistema shared-nothing, onde todos os servers têm uma cópia completa dos data por padrão.

**Figura 17.1 Replication Assíncrona do MySQL**

![Uma transaction recebida pelo source é executada, escrita no binary log, depois committed, e uma resposta é enviada para a aplicação cliente. O registro do binary log é enviado para os relay logs na Replica 1 e na Replica 2 antes que o commit ocorra no source. Em cada uma das replicas, a transaction é aplicada, escrita no binary log da replica, e committed. O commit no source e os commits nas replicas são todos independentes e assíncronos.](images/async-replication-diagram.png)

Existe também a semisynchronous replication (replication semissíncrona), que adiciona uma etapa de sincronização ao protocolo. Isso significa que o Primary espera, no momento do commit, pelo secondary confirmar que *recebeu* a transaction. Somente então o Primary retoma a operação de commit.

**Figura 17.2 Replication Semissíncrona do MySQL**

![Uma transaction recebida pelo source é executada e escrita no binary log. O registro do binary log é enviado para os relay logs na Replica 1 e na Replica 2. O source, então, aguarda um acknowledgement das replicas. Quando ambas as replicas retornam o acknowledgement, o source faz o commit da transaction, e uma resposta é enviada para a aplicação cliente. Depois que cada replica retorna seu acknowledgement, ela aplica a transaction, a escreve no binary log, e faz o commit. O commit no source depende do acknowledgement das replicas, mas os commits nas replicas são independentes um do outro e do commit no source.](images/semisync-replication-diagram.png)

Nas duas figuras acima, você pode ver um diagrama do protocolo clássico da MySQL Replication assíncrona (e sua variante semissíncrona também). As setas entre as diferentes instâncias representam mensagens trocadas entre servers ou mensagens trocadas entre servers e a aplicação cliente.