#### 21.6.15.2 A Tabela ndbinfo arbitrator_validity_summary

A tabela `arbitrator_validity_summary` fornece uma visão composta do arbitrator em relação aos data nodes do cluster.

A tabela `arbitrator_validity_summary` contém as seguintes colunas:

* `arbitrator`

  ID do Node (Node ID) do arbitrator

* `arb_ticket`

  Identificador interno usado para rastrear a arbitration

* `arb_connected`

  Indica se este arbitrator está conectado ao cluster; pode ser `Yes` ou `No`

* `consensus_count`

  Número de data nodes que veem este node como arbitrator

##### Notas

Em operações normais, esta tabela deve ter apenas 1 linha por um período de tempo significativo. Se ela tiver mais de 1 linha por mais do que alguns instantes, isso indica que nem todos os nodes estão conectados ao arbitrator, ou que todos os nodes estão conectados, mas não concordam sobre o mesmo arbitrator.

A coluna `arbitrator` mostra o Node ID do arbitrator.

`arb_ticket` é o identificador interno usado por este arbitrator.

`arb_connected` mostra se este node está conectado ao cluster como um arbitrator.