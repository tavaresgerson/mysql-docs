#### 21.6.15.1 A Tabela ndbinfo arbitrator_validity_detail

A tabela `arbitrator_validity_detail` mostra a visão que cada data node no cluster tem do arbitrator. Ela é um subconjunto da tabela [`membership`](mysql-cluster-ndbinfo-membership.html "21.6.15.25 A Tabela ndbinfo membership").

A tabela `arbitrator_validity_detail` contém as seguintes columns:

* `node_id`

  O Node ID deste nó

* `arbitrator`

  Node ID do arbitrator

* `arb_ticket`

  Identificador interno usado para rastrear a arbitration

* `arb_connected`

  Indica se este nó está conectado ao arbitrator; pode ser `Yes` ou `No`

* `arb_state`

  Estado da arbitration

##### Notas

O Node ID é o mesmo reportado por [**ndb_mgm -e "SHOW"**](mysql-cluster-programs-ndb-mgm.html "21.5.5 ndb_mgm — O Cliente de Gerenciamento do NDB Cluster").

Todos os nós devem mostrar os mesmos valores para `arbitrator` e `arb_ticket`, bem como o mesmo valor para `arb_state`. Os possíveis valores de `arb_state` são `ARBIT_NULL`, `ARBIT_INIT`, `ARBIT_FIND`, `ARBIT_PREP1`, `ARBIT_PREP2`, `ARBIT_START`, `ARBIT_RUN`, `ARBIT_CHOOSE`, `ARBIT_CRASH` e `UNKNOWN`.

`arb_connected` mostra se o nó atual está conectado ao `arbitrator`.