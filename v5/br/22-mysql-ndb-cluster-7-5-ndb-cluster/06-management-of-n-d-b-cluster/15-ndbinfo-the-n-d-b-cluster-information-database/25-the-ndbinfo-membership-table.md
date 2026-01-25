#### 21.6.15.25 A Tabela ndbinfo membership

A tabela `membership` descreve a visão que cada data node tem de todos os outros no Cluster, incluindo a participação em grupos de nodes, o node `president`, o `arbitrator`, o sucessor do `arbitrator`, os estados de conexão do `arbitrator` e outras informações.

A tabela `membership` contém as seguintes colunas:

* `node_id`

  ID do `node` deste `node`.

* `group_id`

  Grupo de `node` ao qual este `node` pertence.

* `left_node`

  ID do `node` do `node` anterior.

* `right_node`

  ID do `node` do próximo `node`.

* `president`

  ID do `node` do `president`.

* `successor`

  ID do `node` do sucessor do `president`.

* `succession_order`

  Ordem na qual este `node` sucede à presidência.

* `Conf_HB_order`

  -

* `arbitrator`

  ID do `node` do `arbitrator`.

* `arb_ticket`

  Identificador interno usado para rastrear a arbitragem.

* `arb_state`

  Estado da arbitragem.

* `arb_connected`

  Se este `node` está conectado ao `arbitrator`; sendo `Yes` ou `No`.

* `connected_rank1_arbs`

  Arbitrators conectados de Rank 1.

* `connected_rank2_arbs`

  Arbitrators conectados de Rank 1.

##### Notas

O ID do `node` e o ID do grupo de `node` são os mesmos reportados por [**ndb_mgm -e "SHOW"**](mysql-cluster-programs-ndb-mgm.html "21.5.5 ndb_mgm — The NDB Cluster Management Client").

`left_node` e `right_node` são definidos em termos de um modelo que conecta todos os data nodes em um círculo, na ordem de seus IDs de `node`, similar à ordem dos números no mostrador de um relógio, conforme mostrado aqui:

**Figura 21.8 Disposição Circular de NDB Cluster Nodes**

![O conteúdo é descrito no texto circundante.](images/cluster-left-right.png)

Neste exemplo, temos 8 data nodes, numerados 5, 6, 7, 8, 12, 13, 14 e 15, ordenados no sentido horário em um círculo. Determinamos “esquerda” (`left`) e “direita” (`right`) a partir do interior do círculo. O `node` à esquerda do `node` 5 é o `node` 15, e o `node` à direita do `node` 5 é o `node` 6. Você pode ver todas essas relações executando a seguinte Query e observando a saída:

```sql
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

As designações “esquerda” (`left`) e “direita” (`right`) são usadas no log de eventos da mesma maneira.

O `president` node é o `node` visto pelo `node` atual como responsável por definir um `arbitrator` (consulte [NDB Cluster Start Phases](/doc/ndb-internals/en/ndb-internals-start-phases.html)). Se o `president` falhar ou for desconectado, o `node` atual espera que o `node` cujo ID é mostrado na coluna `successor` se torne o novo `president`. A coluna `succession_order` mostra o lugar que o `node` atual se vê ocupando na fila de sucessão.

Em um NDB Cluster normal, todos os data nodes devem ver o mesmo `node` como `president`, e o mesmo `node` (diferente do `president`) como seu `successor`. Além disso, o `president` atual deve se ver como `1` na ordem de sucessão, o `successor` node deve se ver como `2`, e assim por diante.

Todos os nodes devem exibir os mesmos valores de `arb_ticket`, bem como os mesmos valores de `arb_state`. Os valores possíveis para `arb_state` são `ARBIT_NULL`, `ARBIT_INIT`, `ARBIT_FIND`, `ARBIT_PREP1`, `ARBIT_PREP2`, `ARBIT_START`, `ARBIT_RUN`, `ARBIT_CHOOSE`, `ARBIT_CRASH` e `UNKNOWN`.

`arb_connected` mostra se este `node` está conectado ao `node` exibido como o `arbitrator` deste `node`.

As colunas `connected_rank1_arbs` e `connected_rank2_arbs` exibem, cada uma, uma lista de 0 ou mais `arbitrators` que possuem um [`ArbitrationRank`](mysql-cluster-mgm-definition.html#ndbparam-mgmd-arbitrationrank) igual a 1, ou a 2, respectivamente.

Nota

Tanto os management nodes quanto os API nodes são elegíveis para se tornarem `arbitrators`.