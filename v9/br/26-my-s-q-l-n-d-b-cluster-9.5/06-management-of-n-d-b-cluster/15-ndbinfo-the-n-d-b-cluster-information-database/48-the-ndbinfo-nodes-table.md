#### 25.6.15.48 Tabela de nós ndbinfo

Esta tabela contém informações sobre o status dos nós de dados. Para cada nó de dados que está em execução no clúster, uma linha correspondente nesta tabela fornece o ID do nó, o status e o tempo de atividade. Para nós que estão iniciando, também mostra a fase de início atual.

A tabela `nodes` contém as seguintes colunas:

* `node_id`

  O ID de nó único do nó de dados no clúster.

* `uptime`

  Tempo desde que o nó foi iniciado pela última vez, em segundos.

* `status`

  Status atual do nó de dados; consulte o texto para os valores possíveis.

* `start_phase`

  Se o nó de dados está iniciando, a fase de início atual.

* `config_generation`

  A versão do arquivo de configuração do clúster em uso neste nó de dados.

##### Notas

A coluna `uptime` mostra o tempo em segundos que este nó está em execução desde que foi iniciado ou reiniciado pela última vez. Este é um valor `BIGINT` - INTEGER, INT, SMALLINT, TINYINT, MEDIUMINT, BIGINT"). Este número inclui o tempo realmente necessário para iniciar o nó; em outras palavras, este contador começa a contar a partir do momento em que **ndbd** ou **ndbmtd") é invocado pela primeira vez; assim, mesmo para um nó que ainda não terminou de iniciar, `uptime` pode mostrar um valor não nulo.

A coluna `status` mostra o status atual do nó. Isso é um dos seguintes: `NOTHING`, `CMVMI`, `STARTING`, `STARTED`, `SINGLEUSER`, `STOPPING_1`, `STOPPING_2`, `STOPPING_3` ou `STOPPING_4`. Quando o status é `STARTING`, você pode ver a fase atual de início na coluna `start_phase` (veja mais adiante nesta seção). `SINGLEUSER` é exibido na coluna `status` para todos os nós de dados quando o clúster está no modo de usuário único (veja a Seção 25.6.6, “Modo de Usuário Único do NDB Cluster”). Ver um dos estados `STOPPING` não significa necessariamente que o nó está desligando, mas pode significar que ele está entrando em um novo estado. Por exemplo, se você colocar o clúster no modo de usuário único, às vezes você pode ver os nós de dados relatando seu estado brevemente como `STOPPING_2` antes que o status mude para `SINGLEUSER`.

A coluna `start_phase` usa a mesma faixa de valores que os usados na saída do comando do cliente do NDB Cluster Management **ndb_mgm** `node_id STATUS` (veja a Seção 25.6.1, “Comandos no Cliente de Gerenciamento do NDB Cluster”). Se o nó não estiver começando atualmente, então esta coluna mostra `0`. Para uma lista das fases de início do NDB Cluster com descrições, veja a Seção 25.6.4, “Resumo das Fases de Início do NDB Cluster”.

A coluna `config_generation` mostra qual versão da configuração do clúster está em vigor em cada nó de dados. Isso pode ser útil ao realizar um reinício contínuo do clúster para fazer alterações nos parâmetros de configuração. Por exemplo, a partir da saída da seguinte declaração `SELECT`, você pode ver que o nó 3 ainda não está usando a versão mais recente da configuração do clúster (`6`) embora os nós 1, 2 e 4 estejam fazendo isso:

```
mysql> USE ndbinfo;
Database changed
mysql> SELECT * FROM nodes;
+---------+--------+---------+-------------+-------------------+
| node_id | uptime | status  | start_phase | config_generation |
+---------+--------+---------+-------------+-------------------+
|       1 |  10462 | STARTED |           0 |                 6 |
|       2 |  10460 | STARTED |           0 |                 6 |
|       3 |  10457 | STARTED |           0 |                 5 |
|       4 |  10455 | STARTED |           0 |                 6 |
+---------+--------+---------+-------------+-------------------+
2 rows in set (0.04 sec)
```

Portanto, para o caso mostrado, você deve reiniciar o nó 3 para completar o reinício contínuo do clúster.

Os nós que estão parados não são contabilizados nesta tabela. Suponha que você tenha um NDB Cluster com 4 nós de dados (IDs de nó 1, 2, 3 e 4), e todos os nós estejam funcionando normalmente, então esta tabela contém 4 linhas, 1 para cada nó de dados:

```
mysql> USE ndbinfo;
Database changed
mysql> SELECT * FROM nodes;
+---------+--------+---------+-------------+-------------------+
| node_id | uptime | status  | start_phase | config_generation |
+---------+--------+---------+-------------+-------------------+
|       1 |  11776 | STARTED |           0 |                 6 |
|       2 |  11774 | STARTED |           0 |                 6 |
|       3 |  11771 | STARTED |           0 |                 6 |
|       4 |  11769 | STARTED |           0 |                 6 |
+---------+--------+---------+-------------+-------------------+
4 rows in set (0.04 sec)
```

Se você desligar um dos nós, apenas os nós que ainda estão funcionando são representados na saída desta instrução `SELECT`, como mostrado aqui:

```
ndb_mgm> 2 STOP
Node 2: Node shutdown initiated
Node 2: Node shutdown completed.
Node 2 has shutdown.
```

```
mysql> SELECT * FROM nodes;
+---------+--------+---------+-------------+-------------------+
| node_id | uptime | status  | start_phase | config_generation |
+---------+--------+---------+-------------+-------------------+
|       1 |  11807 | STARTED |           0 |                 6 |
|       3 |  11802 | STARTED |           0 |                 6 |
|       4 |  11800 | STARTED |           0 |                 6 |
+---------+--------+---------+-------------+-------------------+
3 rows in set (0.02 sec)
```