#### 21.6.15.44 A Tabela ndbinfo transporters

Esta tabela contém informações sobre os *transporters* NDB.

A tabela `transporters` contém as seguintes colunas:

* `node_id`

  O ID de *node* único deste *data node* no Cluster

* `remote_node_id`

  O ID de *node* do *data node* remoto

* `status`

  *Status* da conexão

* `remote_address`

  Nome ou endereço IP do *host* remoto

* `bytes_sent`

  Número de *bytes* enviados usando esta conexão

* `bytes_received`

  Número de *bytes* recebidos usando esta conexão

* `connect_count`

  Número de vezes que a conexão foi estabelecida neste *transporter*

* `overloaded`

  1 se este *transporter* está atualmente em *overload* (sobrecarga), caso contrário 0

* `overload_count`

  Número de vezes que este *transporter* entrou no estado de *overload* desde a conexão

* `slowdown`

  1 se este *transporter* está no estado de *slowdown* (desaceleração), caso contrário 0

* `slowdown_count`

  Número de vezes que este *transporter* entrou no estado de *slowdown* desde a conexão

##### Notas

Para cada *data node* em execução no Cluster, a tabela `transporters` exibe uma linha mostrando o *status* de cada conexão daquele *node* com todos os *nodes* no Cluster, *incluindo ele mesmo*. Esta informação é mostrada na coluna *status* da tabela, que pode ter qualquer um dos seguintes valores: `CONNECTING`, `CONNECTED`, `DISCONNECTING` ou `DISCONNECTED`.

Conexões com *nodes* API e de Gerenciamento que estão configurados, mas não conectados atualmente ao Cluster, são mostradas com *status* `DISCONNECTED`. Linhas onde o `node_id` é o de um *data node* que não está conectado atualmente não são exibidas nesta tabela. (Esta é uma omissão semelhante à de *nodes* desconectados na tabela [`ndbinfo.nodes`](mysql-cluster-ndbinfo-nodes.html "21.6.15.28 The ndbinfo nodes Table").

O `remote_address` é o nome do *host* ou endereço para o *node* cujo ID é mostrado na coluna `remote_node_id`. Os `bytes_sent` deste *node* e `bytes_received` por este *node* são os números, respectivamente, de *bytes* enviados e recebidos pelo *node* usando esta conexão desde que foi estabelecida. Para *nodes* cujo *status* é `CONNECTING` ou `DISCONNECTED`, essas colunas sempre exibem `0`.

Assuma que você tem um Cluster de 5 *nodes*, consistindo em 2 *data nodes*, 2 *SQL nodes* e 1 *management node*, conforme mostrado na saída do comando [`SHOW`](mysql-cluster-mgm-client-commands.html#ndbclient-show) no cliente [**ndb_mgm**](mysql-cluster-programs-ndb-mgm.html "21.5.5 ndb_mgm — The NDB Cluster Management Client"):

```sql
ndb_mgm> SHOW
Connected to Management Server at: localhost:1186
Cluster Configuration
---------------------
[ndbd(NDB)]     2 node(s)
id=1    @10.100.10.1  (5.7.44-ndb-7.6.36, Nodegroup: 0, *)
id=2    @10.100.10.2  (5.7.44-ndb-7.6.36, Nodegroup: 0)

[ndb_mgmd(MGM)] 1 node(s)
id=10   @10.100.10.10  (5.7.44-ndb-7.6.36)

[mysqld(API)]   2 node(s)
id=20   @10.100.10.20  (5.7.44-ndb-7.6.36)
id=21   @10.100.10.21  (5.7.44-ndb-7.6.36)
```

Existem 10 linhas na tabela `transporters` — 5 para o primeiro *data node* e 5 para o segundo — assumindo que todos os *data nodes* estão em execução, conforme mostrado aqui:

```sql
mysql> SELECT node_id, remote_node_id, status
    ->   FROM ndbinfo.transporters;
+---------+----------------+---------------+
| node_id | remote_node_id | status        |
+---------+----------------+---------------+
|       1 |              1 | DISCONNECTED  |
|       1 |              2 | CONNECTED     |
|       1 |             10 | CONNECTED     |
|       1 |             20 | CONNECTED     |
|       1 |             21 | CONNECTED     |
|       2 |              1 | CONNECTED     |
|       2 |              2 | DISCONNECTED  |
|       2 |             10 | CONNECTED     |
|       2 |             20 | CONNECTED     |
|       2 |             21 | CONNECTED     |
+---------+----------------+---------------+
10 rows in set (0.04 sec)
```

Se você desligar um dos *data nodes* neste Cluster usando o comando `2 STOP` no cliente [**ndb_mgm**](mysql-cluster-programs-ndb-mgm.html "21.5.5 ndb_mgm — The NDB Cluster Management Client"), e depois repetir a *Query* anterior (usando novamente o cliente [**mysql**](mysql.html "4.5.1 mysql — The MySQL Command-Line Client")), esta tabela agora mostrará apenas 5 linhas — 1 linha para cada conexão do *management node* restante para outro *node*, incluindo ele mesmo e o *data node* que está atualmente *offline* — e exibirá `CONNECTING` para o *status* de cada conexão restante para o *data node* que está atualmente *offline*, conforme mostrado aqui:

```sql
mysql> SELECT node_id, remote_node_id, status
    ->   FROM ndbinfo.transporters;
+---------+----------------+---------------+
| node_id | remote_node_id | status        |
+---------+----------------+---------------+
|       1 |              1 | DISCONNECTED  |
|       1 |              2 | CONNECTING    |
|       1 |             10 | CONNECTED     |
|       1 |             20 | CONNECTED     |
|       1 |             21 | CONNECTED     |
+---------+----------------+---------------+
5 rows in set (0.02 sec)
```

Os contadores `connect_count`, `overloaded`, `overload_count`, `slowdown` e `slowdown_count` são resetados na conexão e retêm seus valores após o *node* remoto se desconectar. Os contadores `bytes_sent` e `bytes_received` também são resetados na conexão, e por isso retêm seus valores após a desconexão (até que a próxima conexão os resete).

O estado de *overload* (sobrecarga) referenciado pelas colunas `overloaded` e `overload_count` ocorre quando o *send buffer* deste *transporter* contém mais *bytes* do que o [`OVerloadLimit`](mysql-cluster-tcp-definition.html#ndbparam-tcp-overloadlimit) (o padrão é 80% do [`SendBufferMemory`](mysql-cluster-tcp-definition.html#ndbparam-tcp-sendbuffermemory), ou seja, 0.8 * 2097152 = 1677721 *bytes*). Quando um determinado *transporter* está em estado de *overload*, qualquer nova *transaction* que tente usar este *transporter* falha com Erro 1218 (*Send Buffers overloaded* no *kernel* NDB). Isso afeta tanto *scans* quanto operações de *Primary Key*.

O estado de *slowdown* (desaceleração) referenciado pelas colunas `slowdown` e `slowdown_count` desta tabela ocorre quando o *send buffer* do *transporter* contém mais de 60% do *overload limit* (igual a 0.6 * 2097152 = 1258291 *bytes* por padrão). Neste estado, qualquer novo *scan* usando este *transporter* tem seu *batch size* reduzido para minimizar a carga no *transporter*.

Causas comuns de *slowdown* ou *overload* do *send buffer* incluem o seguinte:

* O *Data size*, em particular a quantidade de dados armazenados em colunas [`TEXT`](blob.html "11.3.4 The BLOB and TEXT Types") ou colunas [`BLOB`](blob.html "11.3.4 The BLOB and TEXT Types") (ou ambos os tipos de colunas)

* Ter um *data node* (ndbd ou ndbmtd) no mesmo *host* que um *SQL node* que esteja envolvido em *binary logging* (log binário)

* Grande número de linhas por *transaction* ou *transaction batch*

* Problemas de configuração, como [`SendBufferMemory`](mysql-cluster-tcp-definition.html#ndbparam-tcp-sendbuffermemory) insuficiente

* Problemas de *hardware*, como RAM insuficiente ou conectividade de rede ruim

Veja também [Seção 21.4.3.13, “Configurando Parâmetros do Send Buffer do NDB Cluster”](mysql-cluster-config-send-buffers.html "21.4.3.13 Configuring NDB Cluster Send Buffer Parameters").