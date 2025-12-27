#### 20.1.1.1 Fonte para Replicação de Replicação

A Replicação Asíncrona do MySQL oferece uma abordagem simples de fonte para replica. A fonte é o primário, e há uma ou mais réplicas, que são secundários. A fonte aplica transações, as confirma e, em seguida, são enviadas posteriormente (assim, de forma assíncrona) para as réplicas para serem reexecutadas (na replicação baseada em declarações) ou aplicadas (na replicação baseada em linhas). É um sistema sem compartilhamento de recursos, onde todos os servidores têm uma cópia completa dos dados por padrão.

**Figura 20.1 Replicação Asíncrona do MySQL**

![Uma transação recebida pela fonte é executada, escrita no log binário, então confirmada e uma resposta é enviada para o aplicativo cliente. O registro do log binário é enviado para os logs de relevo nas réplicas 1 e 2 antes que o commit ocorra na fonte. Em cada uma das réplicas, a transação é aplicada, escrita no log binário da replica e confirmada. O commit na fonte e os commits nas réplicas são todos independentes e assíncronos.](images/async-replication-diagram.png)

Há também a replicação semisoincronizada, que adiciona uma etapa de sincronização ao protocolo. Isso significa que o primário espera, no momento da aplicação, que o secundário confirme que ele *recebeu* a transação. Só então o primário retoma a operação de commit.

**Figura 20.2 Replicação Semisoincronizada do MySQL**

![Uma transação recebida pela fonte é executada e escrita no log binário. O registro do log binário é enviado para os logs de retransmissão na Replica 1 e na Replica 2. A fonte então aguarda um reconhecimento das réplicas. Quando ambas as réplicas devolveram o reconhecimento, a fonte confirma a transação e uma resposta é enviada ao aplicativo cliente. Após cada replica ter devolvido seu reconhecimento, ela aplica a transação, a escreve no log binário e a confirma. O commit na fonte depende do reconhecimento das réplicas, mas os commits nas réplicas são independentes uns dos outros e do commit na fonte.](images/semisync-replication-diagram.png)

Nas duas imagens há um diagrama do protocolo clássico de replicação assíncrona do MySQL (e também de sua variante semissíncrona). As setas entre as diferentes instâncias representam as mensagens trocadas entre servidores ou as mensagens trocadas entre servidores e o aplicativo cliente.