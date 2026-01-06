#### 21.6.15.1 Tabela ndbinfo arbitrator\_validity\_detail

A tabela `arbitrator_validity_detail` mostra a visão que cada nó de dados no clúster tem do árbitro. É um subconjunto da tabela `membership`.

A tabela `arbitrator_validity_detail` contém as seguintes colunas:

- `node_id`

  ID do nó deste nó

- "arbitrador"

  ID do nó do árbitro

- `arb_ticket`

  Identificador interno usado para rastrear a arbitragem

- `arb_connected`

  Se este nó está conectado ao árbitro; seja `Sim` ou `Não`

- `arb_state`

  Estado de arbitragem

##### Notas

O ID do nó é o mesmo que o relatado por **ndb\_mgm -e "SHOW"**.

Todos os nós devem exibir os mesmos valores de `arbitrator` e `arb_ticket`, bem como o mesmo valor de `arb_state`. Os valores possíveis de `arb_state` são `ARBIT_NULL`, `ARBIT_INIT`, `ARBIT_FIND`, `ARBIT_PREP1`, `ARBIT_PREP2`, `ARBIT_START`, `ARBIT_RUN`, `ARBIT_CHOOSE`, `ARBIT_CRASH` e `UNKNOWN`.

`arb_connected` mostra se o nó atual está conectado ao `arbitrador`.
