#### 29.12.11.4 A tabela replication_applier_global_filters

Esta tabela mostra os filtros de replicação global configurados nesta replica. A tabela `replication_applier_global_filters` tem as seguintes colunas:

* `FILTER_NAME`

  O tipo de filtro de replicação que foi configurado.

* `FILTER_RULE`

  As regras configuradas para o tipo de filtro de replicação usando as opções de comando `--replicate-*` ou `ALTERAR FILTRO DE REPLICAÇÃO`.

* `CONFIGURED_BY`

  O método usado para configurar o filtro de replicação, pode ser um dos seguintes:

  + `ALTERAR_FILTRO_DE_REPLICAÇÃO` configurado por um filtro de replicação global usando uma declaração `ALTERAR FILTRO DE REPLICAÇÃO`.

  + `STARTUP_OPTIONS` configurado por um filtro de replicação global usando uma opção `--replicate-*`.

* `ACTIVE_SINCE`

  O timestamp de quando o filtro de replicação foi configurado.