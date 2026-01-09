#### 29.12.11.3 A tabela replication_applier_filters

Esta tabela mostra os filtros específicos do canal de replicação configurados nesta replica. Cada linha fornece informações sobre o tipo de filtro configurado para um canal de replicação. A tabela `replication_applier_filters` tem as seguintes colunas:

* `CHANNEL_NAME`

  O nome do canal de replicação com um filtro de replicação configurado.

* `FILTER_NAME`

  O tipo de filtro de replicação que foi configurado para este canal de replicação.

* `FILTER_RULE`

  As regras configuradas para o tipo de filtro de replicação usando as opções de comando `--replicate-*` ou `CHANGE REPLICATION FILTER`.

* `CONFIGURED_BY`

  O método usado para configurar o filtro de replicação, pode ser um dos seguintes:

  + `CHANGE_REPLICATION_FILTER` configurado por um filtro de replicação global usando uma declaração `CHANGE REPLICATION FILTER`.

  + `STARTUP_OPTIONS` configurado por um filtro de replicação global usando uma opção `--replicate-*`.

  + `CHANGE_REPLICATION_FILTER_FOR_CHANNEL` configurado por um filtro de replicação específico do canal usando uma declaração `CHANGE REPLICATION FILTER FOR CHANNEL`.

  + `STARTUP_OPTIONS_FOR_CHANNEL` configurado por um filtro de replicação específico do canal usando uma opção `--replicate-*`.

* `ACTIVE_SINCE`

  O timestamp de quando o filtro de replicação foi configurado.

* `COUNTER`

  O número de vezes que o filtro de replicação foi usado desde que foi configurado.