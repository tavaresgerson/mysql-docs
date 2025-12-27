#### 25.6.15.35 Tabela de eventos ndbinfo

Esta tabela fornece informações sobre as assinaturas de eventos no `NDB`. As colunas da tabela `events` estão listadas aqui, com descrições breves de cada uma:

* `event_id`

  O ID do evento

* `name`

  O nome do evento

* `table_id`

  O ID da tabela em que o evento ocorreu

* `reporting`

  Um dos valores `updated`, `all`, `subscribe` ou `DDL`

* `columns`

  Uma lista separada por vírgula das colunas afetadas pelo evento

* `table_event`

  Um ou mais dos valores `INSERT`, `DELETE`, `UPDATE`, `SCAN`, `DROP`, `ALTER`, `CREATE`, `GCP_COMPLETE`, `CLUSTER_FAILURE`, `STOP`, `NODE_FAILURE`, `SUBSCRIBE`, `UNSUBSCRIBE` e `ALL` (definidos por `Event::TableEvent` na API NDB)