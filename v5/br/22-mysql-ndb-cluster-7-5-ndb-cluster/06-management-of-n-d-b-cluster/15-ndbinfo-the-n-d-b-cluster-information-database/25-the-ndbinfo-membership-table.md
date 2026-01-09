#### 21.6.15.25 Tabela de associação ndbinfo

A tabela `membership` descreve a visão que cada nó de dados tem de todos os outros no clúster, incluindo a associação ao grupo de nós, o nó presidente, o árbitro, o sucessor do árbitro, os estados de conexão do árbitro e outras informações.

A tabela `membership` contém as seguintes colunas:

- `node_id`

  ID do nó deste nó

- `grupo_id`

  Grupo de nós ao qual este nó pertence

- "nó esquerdo"

  ID do nó do nó anterior

- `direita_nó`

  ID do nó do próximo nó

- presidente

  ID do nó do presidente

- "sucessor"

  ID do nó do sucessor do presidente

- ordem de sucessão

  Ordem em que este nó sucede à presidência

- `Conf_HB_order`

  -

- "arbitrador"

  ID do nó do árbitro

- `arb_ticket`

  Identificador interno usado para rastrear a arbitragem

- `arb_state`

  Estado de arbitragem

- `arb_connected`

  Se este nó está conectado ao árbitro; seja `Sim` ou `Não`

- `connected_rank1_arbs`

  Arbitros conectados de nível 1

- `connected_rank2_arbs`

  Arbitros conectados de nível 1

##### Notas

O ID do nó e o ID do grupo de nós são os mesmos relatados por **ndb_mgm -e "SHOW"**.

`left_node` e `right_node` são definidos em termos de um modelo que conecta todos os nós de dados em um círculo, na ordem de seus IDs de nó, semelhante à ordem dos números em um mostrador de relógio, como mostrado aqui:

**Figura 21.8. Disposição Circular dos Nodos do Agrupamento NDB**

![O conteúdo é descrito no texto ao redor.](images/cluster-left-right.png)

Neste exemplo, temos 8 nós de dados, numerados 5, 6, 7, 8, 12, 13, 14 e 15, ordenados no sentido horário em um círculo. Determinamos “esquerda” e “direita” a partir do interior do círculo. O nó à esquerda do nó 5 é o nó 15, e o nó à direita do nó 5 é o nó 6. Você pode ver todas essas relações executando a seguinte consulta e observando a saída:

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

As designações “esquerda” e “direita” são usadas no log de eventos da mesma forma.

O nó `presidente` é o nó que o nó atual considera responsável por definir um árbitro (consulte Fases de Início do Clúster NDB). Se o presidente falhar ou se desconectar, o nó atual espera que o nó cujo ID é exibido na coluna `sucessor` se torne o novo presidente. A coluna `ordem_sucessão` mostra o lugar na fila de sucessão que o nó atual considera que tem.

Em um cluster NDB normal, todos os nós de dados devem ver o mesmo nó como `presidente`, e o mesmo nó (diferente do presidente) como seu `sucessor`. Além disso, o atual presidente deve se ver como `1` na ordem de sucessão, o nó `sucessor` deve se ver como `2`, e assim por diante.

Todos os nós devem exibir os mesmos valores de `arb_ticket` e os mesmos valores de `arb_state`. Os possíveis valores de `arb_state` são `ARBIT_NULL`, `ARBIT_INIT`, `ARBIT_FIND`, `ARBIT_PREP1`, `ARBIT_PREP2`, `ARBIT_START`, `ARBIT_RUN`, `ARBIT_CHOOSE`, `ARBIT_CRASH` e `UNKNOWN`.

`arb_connected` mostra se este nó está conectado ao nó mostrado como o `arbitrador` deste nó.

As colunas `connected_rank1_arbs` e `connected_rank2_arbs` exibem, cada uma, uma lista de 0 ou mais árbitros que têm um `ArbitrationRank` (mysql-cluster-mgm-definition.html#ndbparam-mgmd-arbitrationrank) igual a 1, ou a 2, respectivamente.

Nota

Tanto os nós de gerenciamento quanto os nós de API são elegíveis para se tornarem árbitros.
