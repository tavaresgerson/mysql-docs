#### 25.6.15.2 A tabela `arbitrator_validity_summary` (Resumo de validade do árbitro)

A tabela `arbitrator_validity_summary` fornece uma visão composta do árbitro em relação aos nós de dados do clúster.

A tabela `arbitrator_validity_summary` contém as seguintes colunas:

* `arbitrator`

  ID do nó do árbitro

* `arb_ticket`

  Identificador interno usado para rastrear a arbitragem

* `arb_connected`

  Se este árbitro está conectado ao clúster

* `consensus_count`

  Número de nós de dados que veem este nó como árbitro; "Sim" ou "Não"

##### Notas

Em operações normais, esta tabela deve ter apenas 1 linha por um período apreciável de tempo. Se tiver mais de 1 linha por mais de alguns momentos, então ou todos os nós não estão conectados ao árbitro, ou todos os nós estão conectados, mas não concordam no mesmo árbitro.

A coluna `arbitrator` mostra o ID do nó do árbitro.

`arb_ticket` é o identificador interno usado por este árbitro.

`arb_connected` mostra se este nó está conectado ao clúster como árbitro.