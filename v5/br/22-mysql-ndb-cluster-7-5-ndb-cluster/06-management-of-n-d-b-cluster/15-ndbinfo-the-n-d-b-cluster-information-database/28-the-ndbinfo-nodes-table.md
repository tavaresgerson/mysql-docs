#### 21.6.15.28 A Tabela ndbinfo nodes

Esta tabela contém informações sobre o status dos nós de dados. Para cada nó de dados que está em execução no cluster, uma linha correspondente nesta tabela fornece o ID do nó (*node ID*), o status e o tempo de atividade (*uptime*) do nó. Para nós que estão inicializando, ela também mostra a fase de inicialização atual.

A tabela `nodes` contém as seguintes colunas:

* `node_id`

  O ID de nó exclusivo (*unique node ID*) do nó de dados no cluster.

* `uptime`

  Tempo desde a última inicialização do nó, em segundos.

* `status`

  Status atual do nó de dados; veja o texto para valores possíveis.

* `start_phase`

  Se o nó de dados estiver inicializando, a fase de inicialização atual.

* `config_generation`

  A versão do arquivo de configuração do cluster em uso neste nó de dados.

##### Notas

A coluna `uptime` mostra o tempo em segundos que este nó está em execução desde que foi iniciado ou reiniciado pela última vez. Este é um valor [`BIGINT`](integer-types.html "11.1.2 Tipos de Inteiro (Valor Exato) - INTEGER, INT, SMALLINT, TINYINT, MEDIUMINT, BIGINT"). Este valor inclui o tempo realmente necessário para iniciar o nó; em outras palavras, este contador começa a funcionar no momento em que [**ndbd**](mysql-cluster-programs-ndbd.html "21.5.1 ndbd — O Daemon do Nó de Dados do NDB Cluster") ou [**ndbmtd**](mysql-cluster-programs-ndbmtd.html "21.5.3 ndbmtd — O Daemon do Nó de Dados do NDB Cluster (Multi-Threaded)") é invocado pela primeira vez; assim, mesmo para um nó que ainda não terminou de inicializar, `uptime` pode mostrar um valor diferente de zero.

A coluna `status` mostra o status atual do nó. Este pode ser um dos seguintes: `NOTHING`, `CMVMI`, `STARTING`, `STARTED`, `SINGLEUSER`, `STOPPING_1`, `STOPPING_2`, `STOPPING_3` ou `STOPPING_4`. Quando o status é `STARTING`, você pode ver a fase de inicialização atual na coluna `start_phase` (consulte mais adiante nesta seção). `SINGLEUSER` é exibido na coluna `status` para todos os nós de dados quando o cluster está no modo de usuário único (*single user mode*) (consulte [Seção 21.6.6, “Modo de Usuário Único do NDB Cluster”](mysql-cluster-single-user-mode.html "21.6.6 Modo de Usuário Único do NDB Cluster")). Ver um dos estados `STOPPING` não significa necessariamente que o nó está sendo desligado, mas pode significar que ele está entrando em um novo estado. Por exemplo, se você colocar o cluster no modo de usuário único, às vezes você pode ver os nós de dados relatarem brevemente seu estado como `STOPPING_2` antes que o status mude para `SINGLEUSER`.

A coluna `start_phase` usa o mesmo intervalo de valores usados na saída do comando [`node_id STATUS`](mysql-cluster-mgm-client-commands.html#ndbclient-status) do cliente [**ndb_mgm**](mysql-cluster-programs-ndb-mgm.html "21.5.5 ndb_mgm — O Cliente de Gerenciamento do NDB Cluster") (consulte [Seção 21.6.1, “Comandos no Cliente de Gerenciamento do NDB Cluster”](mysql-cluster-mgm-client-commands.html "21.6.1 Comandos no Cliente de Gerenciamento do NDB Cluster")). Se o nó não estiver atualmente em inicialização, esta coluna mostrará `0`. Para uma lista das fases de inicialização do NDB Cluster com descrições, consulte [Seção 21.6.4, “Resumo das Fases de Inicialização do NDB Cluster”](mysql-cluster-start-phases.html "21.6.4 Resumo das Fases de Inicialização do NDB Cluster").

A coluna `config_generation` mostra qual versão da configuração do cluster está em vigor em cada nó de dados. Isso pode ser útil ao realizar uma reinicialização contínua (*rolling restart*) do cluster para fazer alterações nos parâmetros de configuração. Por exemplo, na saída da seguinte instrução [`SELECT`](select.html "13.2.9 Instrução SELECT"), você pode ver que o nó 3 ainda não está usando a versão mais recente da configuração do cluster (`6`), embora os nós 1, 2 e 4 estejam:

```sql
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

Portanto, para o caso mostrado, você deve reiniciar o nó 3 para concluir a reinicialização contínua do cluster.

Nós que estão parados não são contabilizados nesta tabela. Suponha que você tenha um NDB Cluster com 4 nós de dados (IDs de nó 1, 2, 3 e 4) e todos os nós estejam em execução normalmente, esta tabela contém 4 linhas, 1 para cada nó de dados:

```sql
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

Se você desligar um dos nós, apenas os nós que ainda estão em execução são representados na saída desta instrução [`SELECT`](select.html "13.2.9 Instrução SELECT"), conforme mostrado aqui:

```sql
ndb_mgm> 2 STOP
Node 2: Node shutdown initiated
Node 2: Node shutdown completed.
Node 2 has shutdown.
```

```sql
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
