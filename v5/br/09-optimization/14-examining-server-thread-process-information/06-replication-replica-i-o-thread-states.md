### 8.14.6 Estados de Threads de E/S de Replicação Replica

A lista a seguir mostra os estados mais comuns que você vê na coluna `State` para uma thread de E/S de servidor replica. Esse estado também aparece na coluna `Slave_IO_State` exibida pelo `SHOW SLAVE STATUS`, então você pode ter uma boa visão do que está acontecendo usando essa declaração.

* `Checking master version`

  Um estado que ocorre muito brevemente, após a conexão com a fonte ser estabelecida.

* `Connecting to master`

  O thread está tentando se conectar à fonte.

* `Queueing master event to the relay log`

  O thread leu um evento e está copiando-o para o log do relay para que o thread SQL possa processá-lo.

* `Reconnecting after a failed binlog dump request`

  O thread está tentando se reconectar à fonte.

* `Reconnecting after a failed master event read`

  O thread está tentando se reconectar à fonte. Quando a conexão for restabelecida, o estado se tornará `Aguardando envio de evento pelo mestre`.

* `Registering slave on master`

  Um estado que ocorre muito brevemente após a conexão com a fonte ser estabelecida.

* `Requesting binlog dump`

  Um estado que ocorre muito brevemente, após a conexão com a fonte ser estabelecida. O thread envia para a fonte um pedido para os conteúdos de seus logs binários, começando pelo nome e posição do arquivo de log binário solicitado.

* `Waiting for its turn to commit`

  Um estado que ocorre quando o thread de replicação está aguardando que os fios de trabalhador mais antigos confirmem se o `slave_preserve_commit_order` estiver habilitado.

* `Waiting for master to send event`

  O thread está conectado à fonte e está aguardando por eventos de log binário para chegarem. Isso pode durar muito tempo se a fonte estiver inativa. Se a espera durar `slave_net_timeout` segundos, ocorre um tempo de espera. Nesse ponto, o thread considera a conexão como interrompida e tenta reconectar.

* `Waiting for master update`

  O estado inicial antes de `Connecting to master`.

* `Waiting for slave mutex on exit`

  Um estado que ocorre brevemente enquanto o thread está parando.

* `Waiting for the slave SQL thread to free enough relay log space`

  Você está usando um valor de `relay_log_space_limit` não nulo, e os logs do retransmissor cresceram o suficiente para que seu tamanho combinado exceda esse valor. O thread de E/S está aguardando até que o thread de SQL libere espaço suficiente ao processar o conteúdo dos logs do retransmissor, para que possa excluir alguns arquivos de log do retransmissor.

* `Waiting to reconnect after a failed binlog dump request`

  Se o pedido de exclusão do log binário falhar (devido à desconexão), o thread entra nesse estado enquanto dorme e, em seguida, tenta se reconectar periodicamente. O intervalo entre os tentativos de reconexão pode ser especificado usando a instrução `CHANGE MASTER TO`.

* `Waiting to reconnect after a failed master event read`

  Um erro ocorreu durante a leitura (devido à desconexão). O thread está dormindo por um número de segundos definido pela instrução `CHANGE MASTER TO` (padrão 60) antes de tentar se reconectar.
