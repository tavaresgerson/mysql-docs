### 8.14.5 Estados da Thread Source da Replicação

A lista a seguir mostra os estados mais comuns que você pode ver na coluna `State` para a `Binlog Dump` thread da source de replicação. Se você não vir nenhuma `Binlog Dump` thread em uma source, isso significa que a replicação não está sendo executada; ou seja, que nenhuma réplica está conectada no momento.

* `Finished reading one binlog; switching to next binlog`

  A thread terminou de ler um arquivo de binary log e está abrindo o próximo para enviar para a réplica.

* `Master has sent all binlog to slave; waiting for more updates`

  A thread leu todos os updates restantes dos binary logs e os enviou para a réplica. A thread agora está ociosa, esperando que novos events apareçam no binary log, resultantes de novos updates ocorrendo na source.

* `Sending binlog event to slave`

  Binary logs consistem em *events*, onde um event é geralmente um update mais alguma outra informação. A thread leu um event do binary log e agora está enviando-o para a réplica.

* `Waiting to finalize termination`

  Um estado muito breve que ocorre enquanto a thread está sendo interrompida.