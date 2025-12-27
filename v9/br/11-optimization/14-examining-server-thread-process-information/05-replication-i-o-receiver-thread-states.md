### 10.14.5 Estados de E/S de Replicação (Receptor) de Fuso

A lista a seguir mostra os estados mais comuns que você verá na coluna `Estado` para um fuso de E/S de replicação (receptor) em um servidor replica. Esse estado também aparece na coluna `Replica_IO_State` exibida pelo `SHOW REPLICA STATUS`, então você pode ter uma boa visão do que está acontecendo usando essa declaração.

Defina a variável de sistema `terminology_use_previous` com escopo de sessão para suportar funções individuais ou escopo global para ser a opção padrão para todas as novas sessões. Quando o escopo global é usado, o log de consultas lentas contém as versões antigas dos nomes.

* `Verificando a versão do mestre`

  `Verificando a versão da fonte`

  Um estado que ocorre muito brevemente, após a conexão com a fonte ser estabelecida.

* `Conectando ao mestre`

  `Conectando à fonte`

  O fuso está tentando se conectar à fonte.

* `Colocando o evento do mestre na log de retransmissão`

  `Colocando o evento da fonte na log de retransmissão`

  O fuso leu um evento e está copiando-o para a log de retransmissão para que o fuso de SQL possa processá-lo.

* `Reconectando após uma solicitação de dump de binlog falha`

  O fuso está tentando se reconectar à fonte.

* `Reconectando após uma leitura de evento do mestre falha`

  `Reconectando após uma leitura de evento da fonte falha`

  O fuso está tentando se reconectar à fonte. Quando a conexão é estabelecida novamente, o estado se torna `Aguardando evento do mestre para enviar`.

* `Registrando o escravo no mestre`

  `Registrando a replica na fonte`

  Um estado que ocorre muito brevemente após a conexão com a fonte ser estabelecida.

* `Solicitando o dump de binlog`

Um estado que ocorre muito brevemente, após a conexão com a fonte ser estabelecida. O fio envia para a fonte um pedido dos conteúdos de seus registros binários, começando pelo nome e posição do arquivo de registro binário solicitado.

* `Aguardando sua vez de comprometer`

  Um estado que ocorre quando o fio replica está aguardando que os fios trabalhadore mais antigos comprometerem, se `replica_preserve_commit_order` estiver habilitado.

* `Aguardando que o mestre envie o evento`

  `Aguardando que a fonte envie o evento`

  O fio se conectou à fonte e está aguardando por eventos de logs binários a chegarem. Isso pode durar muito tempo se a fonte estiver inativa. Se a espera durar `replica_net_timeout` segundos, ocorre um tempo de espera. Nesse ponto, o fio considera a conexão como interrompida e tenta se reconectar.

* `Aguardando a atualização do mestre`

  `Aguardando a atualização da fonte`

  O estado inicial antes de `Conectando ao mestre` ou `Conectando à fonte`.

* `Aguardando o mutex do escravo na saída`

  `Aguardando o mutex da replica na saída`

  Um estado que ocorre brevemente enquanto o fio está parando.

* `Aguardando que o fio SQL do escravo libere espaço suficiente para os logs de relevo`

  `Aguardando que o fio SQL da replica libere espaço suficiente para os logs de relevo`

  Você está usando um valor de `relay_log_space_limit` não nulo e os logs de relevo cresceram o suficiente para que seu tamanho combinado exceda esse valor. O fio de I/O (receptor) está aguardando até que o fio de SQL (aplicador) libere espaço suficiente processando o conteúdo dos logs de relevo, para que possa excluir alguns arquivos de log de relevo.

* `Aguardando para se reconectar após uma solicitação de dump de binlog falha`

Se o pedido de exclusão de registro binário falhou (devido à desconexão), o fio entra neste estado enquanto dorme, e depois tenta se reconectar periodicamente. O intervalo entre as tentativas pode ser especificado usando o `ALTERAR A FONTE DE REPLICAÇÃO PARA`.

* `Esperando reconectar após uma leitura de evento mestre falhou`

  `Esperando reconectar após uma leitura de evento fonte falhou`

  Um erro ocorreu durante a leitura (devido à desconexão). O fio dorme por um número de segundos definido pela declaração `ALTERAR A FONTE DE REPLICAÇÃO PARA` antes de tentar se reconectar.