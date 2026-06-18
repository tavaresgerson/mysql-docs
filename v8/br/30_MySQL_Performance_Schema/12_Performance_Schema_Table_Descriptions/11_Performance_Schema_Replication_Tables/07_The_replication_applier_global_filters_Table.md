#### 29.12.11.7 Tabela replication\_applier\_global\_filters

Esta tabela mostra os filtros de replicação global configurados nesta replica. A tabela `replication_applier_global_filters` tem as seguintes colunas:

- `FILTER_NAME`

  O tipo de filtro de replicação que foi configurado.

- `FILTER_RULE`

  As regras configuradas para o tipo de filtro de replicação usando as opções de comando `--replicate-*` ou `CHANGE REPLICATION FILTER`.

- `CONFIGURED_BY`

  O método usado para configurar o filtro de replicação pode ser um dos seguintes:

  - `CHANGE_REPLICATION_FILTER` configurado por um filtro de replicação global usando uma declaração `CHANGE REPLICATION FILTER`.

  - `STARTUP_OPTIONS` configurado por um filtro de replicação global usando uma opção `--replicate-*`.

- `ACTIVE_SINCE`

  Data e hora em que o filtro de replicação foi configurado.
