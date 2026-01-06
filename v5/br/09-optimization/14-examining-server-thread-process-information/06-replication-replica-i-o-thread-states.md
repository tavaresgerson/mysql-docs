### 8.14.6 Estados de Threads de E/S de Replicação Replica

A lista a seguir mostra os estados mais comuns que você vê na coluna `Estado` para uma thread de E/S de servidor replica. Esse estado também aparece na coluna `Slave_IO_State` exibida pelo `SHOW SLAVE STATUS`, então você pode ter uma boa visão do que está acontecendo usando essa declaração.

- `Verificar a versão mestre`

  Um estado que ocorre muito brevemente, após a conexão com a fonte ser estabelecida.

- `Conectando-se ao mestre`

  O fio está tentando se conectar à fonte.

- `Encaminhar o evento do mestre de fila para o log de retransmissão`

  O fio leu um evento e está copiando-o para o log do relé para que o fio SQL possa processá-lo.

- `Reconectar após um pedido de dump de binlog falhado`

  O fio está tentando se reconectar à fonte.

- `Reconnecting after a failed master event read`

  O fio está tentando se reconectar à fonte. Quando a conexão for restabelecida, o estado se tornará `Aguardando envio de evento pelo mestre`.

- `Registrar escravo no mestre`

  Um estado que ocorre muito brevemente após a conexão com a fonte ser estabelecida.

- `Solicitar dump de binlog`

  Um estado que ocorre muito brevemente, após a conexão com a fonte ser estabelecida. O thread envia para a fonte um pedido para os conteúdos de seus logs binários, começando pelo nome e posição do arquivo de log binário solicitado.

- "Esperando sua vez de se comprometer"

  Um estado que ocorre quando o fio de replicação está aguardando que os fios de trabalhador mais antigos confirmem se o `slave_preserve_commit_order` estiver habilitado.

- "Esperando que o mestre envie o evento"

  O fio está conectado à fonte e está aguardando por eventos de log binário para chegarem. Isso pode durar muito tempo se a fonte estiver inativa. Se a espera durar `slave_net_timeout` segundos, ocorre um tempo de espera. Nesse ponto, o fio considera a conexão como interrompida e tenta reconectar.

- "Esperando atualização do mestre"

  O estado inicial antes de "Conectando ao mestre".

- `Esperando por um mutex de escravo na saída`

  Um estado que ocorre brevemente enquanto o fio está parando.

- `Esperando que o fio SQL escravo libere espaço suficiente para o log de relé`

  Você está usando um valor de `relay_log_space_limit` não nulo, e os logs do retransmissor cresceram o suficiente para que seu tamanho combinado exceda esse valor. O fio de E/S está aguardando até que o fio de SQL libere espaço suficiente ao processar o conteúdo dos logs do retransmissor, para que possa excluir alguns arquivos de log do retransmissor.

- `Esperando para se reconectar após um pedido de dump de binlog falhado`

  Se o pedido de exclusão do log binário falhar (devido à desconexão), o fio entra nesse estado enquanto dorme e, em seguida, tenta se reconectar periodicamente. O intervalo entre os tentativos de reconexão pode ser especificado usando a instrução `CHANGE MASTER TO`.

- `Esperando para se reconectar após uma leitura de evento mestre falha`

  Um erro ocorreu durante a leitura (devido à desconexão). O fio está dormindo por um número de segundos definido pela instrução `CHANGE MASTER TO` (padrão 60) antes de tentar se reconectar.
