### 10.14.5 Estados de threads de I/O de replicação (receptor)

A lista a seguir mostra os estados mais comuns que você vê na coluna `State` para um fio de I/O de replicação (receptor) em um servidor replica. Esse estado também aparece na coluna `Replica_IO_State` exibida pelo `SHOW REPLICA STATUS` (ou antes do MySQL 8.0.22, `SHOW REPLICA STATUS`), então você pode ter uma boa visão do que está acontecendo usando essa declaração.

No MySQL 8.0.26, foram feitas alterações incompatíveis nos nomes das instrumentações, incluindo os nomes das etapas do thread, que contêm os termos “master”, que foi alterado para “source”, “slave”, que foi alterado para “replica” e “mts” (para “multithreaded slave”), que foi alterado para “mta” (para “multithreaded applier”). Ferramentas de monitoramento que trabalham com esses nomes de instrumentação podem ser afetadas. Se as alterações incompatíveis tiverem um impacto para você, defina a variável de sistema `terminology_use_previous` para `BEFORE_8_0_26` para fazer o MySQL Server usar as versões antigas dos nomes para os objetos especificados na lista anterior. Isso permite que as ferramentas de monitoramento que dependem dos nomes antigos continuem funcionando até que possam ser atualizadas para usar os novos nomes.

Defina a variável de sistema `terminology_use_previous` com escopo de sessão para suportar funções individuais ou escopo global para ser o padrão para todas as novas sessões. Quando o escopo global é usado, o log de consultas lentas contém as versões antigas dos nomes.

- `Checking master version`

  A partir do MySQL 8.0.26: `Checking source version`

  Um estado que ocorre muito brevemente, após a conexão com a fonte ser estabelecida.

- `Connecting to master`

  A partir do MySQL 8.0.26: `Connecting to source`

  O fio está tentando se conectar à fonte.

- `Queueing master event to the relay log`

  A partir do MySQL 8.0.26: `Queueing source event to the relay log`

  O fio leu um evento e está copiando-o para o log do relé para que o fio SQL possa processá-lo.

- `Reconnecting after a failed binlog dump request`

  O fio está tentando se reconectar à fonte.

- `Reconnecting after a failed master event read`

  A partir do MySQL 8.0.26: `Reconnecting after a failed source event read`

  O fio está tentando se reconectar à fonte. Quando a conexão for restabelecida, o estado se tornará `Waiting for master to send event`.

- `Registering slave on master`

  A partir do MySQL 8.0.26: `Registering replica on source`

  Um estado que ocorre muito brevemente após a conexão com a fonte ser estabelecida.

- `Requesting binlog dump`

  Um estado que ocorre muito brevemente, após a conexão com a fonte ser estabelecida. O thread envia para a fonte um pedido para os conteúdos de seus logs binários, começando pelo nome e posição do arquivo de log binário solicitado.

- `Waiting for its turn to commit`

  Um estado que ocorre quando o fio de replicação está aguardando que os fios de trabalhador mais antigos se comprometam se `replica_preserve_commit_order` ou `slave_preserve_commit_order` estiverem habilitados.

- `Waiting for master to send event`

  A partir do MySQL 8.0.26: `Waiting for source to send event`

  O fio se conectou à fonte e está aguardando por eventos de log binário para chegarem. Isso pode durar muito tempo se a fonte estiver inativa. Se a espera durar `replica_net_timeout` ou `slave_net_timeout` segundos, ocorre um tempo de espera. Nesse ponto, o fio considera a conexão como interrompida e tenta reconectar.

- `Waiting for master update`

  A partir do MySQL 8.0.26: `Waiting for source update`

  O estado inicial antes de `Connecting to master` ou `Connecting to source`.

- `Waiting for slave mutex on exit`

  A partir do MySQL 8.0.26: `Waiting for replica mutex on exit`

  Um estado que ocorre brevemente enquanto o fio está parando.

- `Waiting for the slave SQL thread to free enough relay log space`

  A partir do MySQL 8.0.26: `Waiting for the replica SQL thread to free enough relay log space`

  Você está usando um valor `relay_log_space_limit` não nulo, e os registros do relé cresceram o suficiente para que seu tamanho combinado exceda esse valor. O fio de entrada/saída (receptor) está aguardando até que o fio de SQL (aplicativo) libere espaço suficiente ao processar o conteúdo dos registros do relé, para que possa excluir alguns arquivos de registro do relé.

- `Waiting to reconnect after a failed binlog dump request`

  Se o pedido de exclusão de registro binário falhou (devido à desconexão), o fio entra neste estado enquanto dorme e, em seguida, tenta se reconectar periodicamente. O intervalo entre os tentativos de reconexão pode ser especificado usando a instrução `CHANGE REPLICATION SOURCE TO` (a partir do MySQL 8.0.23) ou a instrução `CHANGE MASTER TO` (antes do MySQL 8.0.23).

- `Waiting to reconnect after a failed master event read`

  A partir do MySQL 8.0.26: `Waiting to reconnect after a failed source event read`

  Um erro ocorreu durante a leitura (devido à desconexão). O fio está dormindo por um número de segundos definido pela declaração `CHANGE REPLICATION SOURCE TO` (a partir do MySQL 8.0.23) ou pela declaração `CHANGE MASTER TO` (antes do MySQL 8.0.23), que tem um valor padrão de 60, antes de tentar se reconectar.
