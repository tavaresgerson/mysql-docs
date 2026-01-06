#### 17.1.1.1 Replicação primária-secundária

A replicação tradicional do MySQL oferece uma abordagem simples de primário-secundário. Há um primário (fonte) e um ou mais secundários (cópias). O primário executa as transações, as confirma e, em seguida, são enviadas posteriormente (assim, de forma assíncrona) aos secundários para serem reexecutadas (na replicação baseada em declarações) ou aplicadas (na replicação baseada em linhas). É um sistema sem compartilhamento, onde todos os servidores têm uma cópia completa dos dados por padrão.

**Figura 17.1 Replicação Assíncrona do MySQL**

![Uma transação recebida pela fonte é executada, escrita no log binário, então confirmada e uma resposta é enviada ao aplicativo do cliente. O registro do log binário é enviado para os logs de retransmissão nas réplicas 1 e 2 antes que o commit ocorra na fonte. Em cada uma das réplicas, a transação é aplicada, escrita no log binário da réplica e confirmada. O commit na fonte e os commits nas réplicas são independentes e assíncronos.](images/async-replication-diagram.png)

Há também a replicação semissíncrona, que adiciona uma etapa de sincronização ao protocolo. Isso significa que o Primário aguarda, no momento do commit, que o Secundário confirme que ele *recebeu* a transação. Somente então o Primário retoma a operação de commit.

**Figura 17.2 Replicação Semisincronizada do MySQL**

![Uma transação recebida pela fonte é executada e escrita no log binário. O registro do log binário é enviado para os logs de retransmissão nas réplicas 1 e 2. A fonte então aguarda um reconhecimento das réplicas. Quando ambas as réplicas devolveram o reconhecimento, a fonte confirma a transação e uma resposta é enviada ao aplicativo cliente. Após cada replica ter devolvido seu reconhecimento, ela aplica a transação, a escreve no log binário e a confirma. O commit na fonte depende do reconhecimento das réplicas, mas os commits nas réplicas são independentes uns dos outros e do commit na fonte.](images/semisync-replication-diagram.png)

Nas duas imagens acima, você pode ver um diagrama do protocolo clássico de replicação assíncrona do MySQL (e também de sua variante semiesincrônica). As setas entre as diferentes instâncias representam as mensagens trocadas entre os servidores ou as mensagens trocadas entre os servidores e o aplicativo do cliente.
