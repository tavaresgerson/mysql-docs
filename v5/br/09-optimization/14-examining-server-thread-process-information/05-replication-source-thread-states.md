### 8.14.5 Estados de fios de fonte de replicação

A lista a seguir mostra os estados mais comuns que você pode ver na coluna `State` para o tópico `Binlog Dump` da fonte de replicação. Se você não vir nenhum tópico `Binlog Dump` em uma fonte, isso significa que a replicação não está sendo executada; ou seja, que nenhuma réplica está conectada atualmente.

* `Finished reading one binlog; switching to next binlog`

  O thread terminou de ler um arquivo de log binário e está abrindo o próximo para enviar para a replica.

* `Master has sent all binlog to slave; waiting for more updates`

  O thread leu todas as atualizações restantes dos logs binários e enviou-as para a replica. O thread agora está parado, aguardando novos eventos aparecerem no log binário resultantes de novas atualizações ocorrendo na fonte.

* `Sending binlog event to slave`

  Os logs binários consistem em *eventos*, onde um evento geralmente é uma atualização mais algumas outras informações. O thread leu um evento do log binário e agora está enviando-o para a replica.

* `Waiting to finalize termination`

  Um estado muito breve que ocorre quando o thread está parando.
