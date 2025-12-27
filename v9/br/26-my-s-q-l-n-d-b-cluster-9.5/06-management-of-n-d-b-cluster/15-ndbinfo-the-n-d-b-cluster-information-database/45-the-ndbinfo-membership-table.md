#### 25.6.15.45 Tabela de Membros ndbinfo

A tabela `membership` descreve a visão que cada nó de dados tem de todos os outros no clúster, incluindo a filiação ao grupo de nós, o nó presidente, o árbitro, o sucessor do árbitro, os estados de conexão do árbitro e outras informações.

A tabela `membership` contém as seguintes colunas:

* `node_id`

  O ID de nó do nó.

* `group_id`

  O ID do grupo de nós ao qual este nó pertence.

* `left node`

  O ID do nó anterior.

* `right_node`

  O ID do nó seguinte.

* `president`

  O ID do nó presidente.

* `successor`

  O ID do sucessor do presidente.

* `succession_order`

  A ordem em que este nó sucede ao cargo de presidente.

* `Conf_HB_order`

  -

* `arbitrator`

  O ID do árbitro.

* `arb_ticket`

  O identificador interno usado para rastrear a arbitragem.

* `arb_state`

  O estado da arbitragem.

* `arb_connected`

  Se este nó está conectado ao árbitro; pode ser "Yes" ou "No".

* `connected_rank1_arbs`

  Arbitrários conectados de primeiro nível.

* `connected_rank2_arbs`

  Arbitrários conectados de primeiro nível.

##### Notas

O ID de nó e o ID do grupo de nós são os mesmos relatados pelo **ndb\_mgm -e "SHOW"**.

`left_node` e `right_node` são definidos em termos de um modelo que conecta todos os nós de dados em um círculo, em ordem de seus IDs de nó, semelhante à ordem dos números em um mostrador de relógio, conforme mostrado aqui:

**Figura 25.6 Disposição Circular dos Nodos de Clúster do NDB**

![O conteúdo é descrito no texto ao redor.](images/cluster-left-right.png)

Neste exemplo, temos 8 nós de dados, numerados 5, 6, 7, 8, 12, 13, 14 e 15, ordenados no sentido horário em um círculo. Determinamos "esquerda" e "direita" a partir do interior do círculo. O nó à esquerda do nó 5 é o nó 15, e o nó à direita do nó 5 é o nó 6. Você pode ver todas essas relações executando a seguinte consulta e observando a saída:

```
mysql> SELECT node_id,left_node,right_node
    -> FROM ndbinfo.membership;
+---------+-----------+------------+
| node_id | left_node | right_node |
+---------+-----------+------------+
|       5 |        15 |          6 |
|       6 |         5 |          7 |
|       7 |         6 |          8 |
|       8 |         7 |         12 |
|      12 |         8 |         13 |
|      13 |        12 |         14 |
|      14 |        13 |         15 |
|      15 |        14 |          5 |
+---------+-----------+------------+
8 rows in set (0.00 sec)
```

As designações "esquerda" e "direita" são usadas no log de eventos da mesma maneira.

O nó `presidente` é o nó visto pelo nó atual como responsável por definir um árbitro (veja Fases de Início do NDB Cluster). Se o presidente falhar ou se desconectar, o nó atual espera que o nó cujo ID é mostrado na coluna `sucessor` se torne o novo presidente. A coluna `ordem_sucessão` mostra o lugar na fila de sucessão que o nó atual se vê como tendo.

Em um NDB Cluster normal, todos os nós de dados devem ver o mesmo nó como `presidente` e o mesmo nó (diferente do presidente) como seu `sucessor`. Além disso, o presidente atual deve se ver como `1` na ordem de sucessão, o nó `sucessor` deve se ver como `2`, e assim por diante.

Todos os nós devem mostrar os mesmos valores de `arb_ticket` e os mesmos valores de `arb_state`. Os possíveis valores de `arb_state` são `ARBIT_NULL`, `ARBIT_INIT`, `ARBIT_FIND`, `ARBIT_PREP1`, `ARBIT_PREP2`, `ARBIT_START`, `ARBIT_RUN`, `ARBIT_CHOOSE`, `ARBIT_CRASH` e `UNKNOWN`.

`arb_connected` mostra se este nó está conectado ao nó mostrado como o `arbitrator` do nó atual.

As colunas `connected_rank1_arbs` e `connected_rank2_arbs` exibem cada uma uma lista de 0 ou mais árbitros com um `ArbitrationRank` igual a 1, ou a 2, respectivamente.

Nota

Tanto os nós de gerenciamento quanto os nós de API são elegíveis para se tornarem árbitros.