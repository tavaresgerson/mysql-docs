### 10.14.5 Estados de Filo de I/O de Replicação (Receptor)

A lista a seguir mostra os estados mais comuns que você verá na coluna `Estado` para um fio de I/O de replicação (receptor) em um servidor replica. Esse estado também aparece na coluna `Replica_IO_State` exibida pelo `SHOW REPLICA STATUS`, então você pode ter uma boa visão do que está acontecendo usando essa declaração.

No MySQL 8.0, mudanças incompatíveis foram feitas nos nomes de instrumentação. Ferramentas de monitoramento que trabalham com esses nomes de instrumentação podem ser impactadas. Se as mudanças incompatíveis tiverem um impacto para você, defina a variável de sistema `terminology_use_previous` para `BEFORE_8_0_26` para fazer o MySQL Server usar as versões antigas dos nomes para os objetos especificados na lista anterior. Isso permite que ferramentas de monitoramento que dependem dos nomes antigos continuem funcionando até que possam ser atualizadas para usar os novos nomes.

Defina a variável de sistema `terminology_use_previous` com escopo de sessão para suportar funções individuais ou escopo global para ser a padrão para todas as novas sessões. Quando o escopo global é usado, o log de consultas lentas contém as versões antigas dos nomes.

* `Verificando a versão do mestre`

  `Verificando a versão da fonte`

  Um estado que ocorre muito brevemente, após a conexão com a fonte ser estabelecida.
* `Conectando-se ao mestre`

  `Conectando-se à fonte`

  O fio está tentando se conectar à fonte.
* `Colocando o evento do mestre na log de retransmissão`

  `Colocando o evento da fonte na log de retransmissão`

  O fio leu um evento e está copiando-o para a log de retransmissão para que o fio SQL possa processá-lo.
* `Reconectando-se após uma solicitação de dump de binlog falha`

  O fio está tentando se reconectar à fonte.
* `Reconectando-se após uma leitura de evento mestre falha`

  `Reconectando-se após uma leitura de evento fonte falha`

  O fio está tentando se reconectar à fonte. Quando a conexão é estabelecida novamente, o estado se torna `Aguardando evento do mestre para enviar`.
* `Registrando o escravo no mestre`

  `Registrando a replica na fonte`

Um estado que ocorre muito brevemente após a conexão com a fonte ser estabelecida.
* `Solicitação de dump de binlog`

  Um estado que ocorre muito brevemente, após a conexão com a fonte ser estabelecida. O thread envia para a fonte uma solicitação dos conteúdos de seus logs binários, começando pelo nome e posição do arquivo de log binário solicitado.
* `Aguardando sua vez de comprometer`

  Um estado que ocorre quando o thread da replica está aguardando que os threads de trabalho mais antigos comprometerem, se `replica_preserve_commit_order` estiver habilitado.
* `Aguardando que o mestre envie um evento`

  `Aguardando que a fonte envie um evento`

  O thread se conectou à fonte e está aguardando por eventos de log binário a chegarem. Isso pode durar muito tempo se a fonte estiver inativa. Se a espera durar `replica_net_timeout` segundos, ocorre um tempo de espera. Nesse ponto, o thread considera a conexão como interrompida e tenta reconectar.
* `Aguardando atualização do mestre`

  `Aguardando atualização da fonte`

  O estado inicial antes de `Conectando ao mestre` ou `Conectando à fonte`.
* `Aguardando o mutex do escravo na saída`

  `Aguardando o mutex da replica na saída`

  Um estado que ocorre brevemente enquanto o thread está sendo parado.
* `Aguardando que o thread SQL do escravo libere espaço suficiente para o log de relevo`

  `Aguardando que o thread SQL da replica libere espaço suficiente para o log de relevo`

  Você está usando um valor de `relay_log_space_limit` não nulo e os logs de relevo cresceram o suficiente para que seu tamanho combinado exceda esse valor. O thread de I/O (receptor) está aguardando até que o thread SQL (aplicador) libere espaço suficiente processando o conteúdo do log de relevo, para que possa excluir alguns arquivos de log de relevo.
* `Aguardando para reconectar após uma solicitação de dump de binlog falha`

  Se a solicitação de dump de binlog falhou (devido à desconexão), o thread entra neste estado enquanto dorme, e depois tenta reconectar periodicamente. O intervalo entre os tentativos pode ser especificado usando `ALTERAR A REPRODUÇÃO PARA`.
* `Aguardando para reconectar após uma leitura de evento do mestre falha`

"Esperando reconectar após um evento de origem falhar"

Um erro ocorreu durante a leitura (devido à desconexão). O thread está dormindo por um número de segundos definido pela declaração `ALTERAR A ORIGEM DA REPLICA PARA` antes de tentar reconectar.