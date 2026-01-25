### 8.14.6 Estados do Thread I/O da Replica de Replicação

A lista a seguir mostra os estados mais comuns que você pode ver na coluna `State` para um I/O Thread do servidor replica. Este estado também aparece na coluna `Slave_IO_State` exibida por `SHOW SLAVE STATUS`, permitindo que você tenha uma boa visão do que está acontecendo ao usar essa instrução.

* `Checking master version`

  Um estado que ocorre muito brevemente, após a conexão com o Source ser estabelecida.

* `Connecting to master`

  O Thread está tentando se conectar ao Source.

* `Queueing master event to the relay log`

  O Thread leu um evento e o está copiando para o relay log para que o SQL Thread possa processá-lo.

* `Reconnecting after a failed binlog dump request`

  O Thread está tentando se reconectar ao Source.

* `Reconnecting after a failed master event read`

  O Thread está tentando se reconectar ao Source. Quando a conexão é estabelecida novamente, o estado se torna `Waiting for master to send event`.

* `Registering slave on master`

  Um estado que ocorre muito brevemente após a conexão com o Source ser estabelecida.

* `Requesting binlog dump`

  Um estado que ocorre muito brevemente, após a conexão com o Source ser estabelecida. O Thread envia ao Source uma solicitação pelo conteúdo de seus binary logs, começando a partir do nome do arquivo de binary log e da posição solicitados.

* `Waiting for its turn to commit`

  Um estado que ocorre quando o Thread da replica está aguardando threads worker mais antigos realizarem o commit, caso `slave_preserve_commit_order` esteja habilitado.

* `Waiting for master to send event`

  O Thread se conectou ao Source e está aguardando a chegada de eventos do binary log. Isso pode durar muito tempo se o Source estiver ocioso. Se a espera durar `slave_net_timeout` segundos, um timeout ocorre. Nesse ponto, o Thread considera que a conexão foi interrompida e tenta se reconectar.

* `Waiting for master update`

  O estado inicial antes de `Connecting to master`.

* `Waiting for slave mutex on exit`

  Um estado que ocorre brevemente enquanto o Thread está parando.

* `Waiting for the slave SQL thread to free enough relay log space`

  Você está usando um valor `relay_log_space_limit` diferente de zero, e os relay logs cresceram o suficiente para que seu tamanho combinado exceda esse valor. O I/O Thread está esperando até que o SQL Thread libere espaço suficiente, processando o conteúdo do relay log, para que possa excluir alguns arquivos de relay log.

* `Waiting to reconnect after a failed binlog dump request`

  Se a solicitação de binary log dump falhou (devido à desconexão), o Thread entra neste estado enquanto dorme, e então tenta se reconectar periodicamente. O intervalo entre as novas tentativas pode ser especificado usando a instrução `CHANGE MASTER TO`.

* `Waiting to reconnect after a failed master event read`

  Ocorreu um erro durante a leitura (devido à desconexão). O Thread está em modo de espera (sleeping) pelo número de segundos definido pela instrução `CHANGE MASTER TO` (padrão 60) antes de tentar se reconectar.