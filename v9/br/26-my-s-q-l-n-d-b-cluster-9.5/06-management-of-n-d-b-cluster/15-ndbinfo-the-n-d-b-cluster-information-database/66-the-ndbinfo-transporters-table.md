#### 25.6.15.66 Tabela de transportadores ndbinfo

Esta tabela contém informações sobre os transportadores NDB. Para informações semelhantes sobre transportadores individuais, consulte a tabela `transportador_detalhes`.

A tabela `transportadores` contém as seguintes colunas:

* `node_id`

  O ID de nó único desse nó de dados no cluster

* `remote_node_id`

  O ID de nó do nó de dados remoto

* `status`

  Status da conexão

* `remote_address`

  Nome ou endereço IP do host remoto

* `bytes_sent`

  Número de bytes enviados usando essa conexão

* `bytes_received`

  Número de bytes recebidos usando essa conexão

* `connect_count`

  Número de vezes que a conexão foi estabelecida nesse transportador

* `overloaded`

  1 se esse transportador estiver sobrecarregado atualmente, caso contrário, 0

* `overload_count`

  Número de vezes que esse transportador entrou no estado de sobrecarga desde a conexão

* `slowdown`

  1 se esse transportador estiver no estado de desaceleração, caso contrário, 0

* `slowdown_count`

  Número de vezes que esse transportador entrou no estado de desaceleração desde a conexão

* `encrypted`

  Se esse transportador estiver conectado usando TLS, esta coluna é `1`, caso contrário, é `0`.

##### Notas

Para cada nó de dados em execução no cluster, a tabela `transportadores` exibe uma linha mostrando o status de cada uma das conexões desse nó com todos os nós no cluster, *incluindo ele mesmo*. Essa informação é mostrada na coluna *status* da tabela, que pode ter qualquer um dos seguintes valores: `CONNECTING`, `CONNECTED`, `DISCONNECTING` ou `DISCONNECTED`.

As conexões aos nós de API e gerenciamento que estão configurados, mas atualmente desconectados do clúster, são exibidas com o status `DESCONECTADO`. As linhas onde o `node_id` é o de um nó de dados que não está atualmente conectado não são exibidas nesta tabela. (Isso é uma ocorrência semelhante de nós desconectados na tabela `ndbinfo.nodes`.

O `remote_address` é o nome do host ou endereço do nó cujo ID é exibido na coluna `remote_node_id`. Os `bytes_sent` desse nó e `bytes_received` por esse nó são os números, respectivamente, de bytes enviados e recebidos pelo nó usando essa conexão desde que foi estabelecida. Para nós cujo status é `CONNECTING` ou `DISCONNECTED`, essas colunas sempre exibem `0`.

Suponha que você tenha um clúster de 5 nós, composto por 2 nós de dados, 2 nós SQL e 1 nó de gerenciamento, conforme mostrado na saída do comando `SHOW` no cliente **ndb\_mgm**:

```
ndb_mgm> SHOW
Connected to Management Server at: localhost:1186 (using cleartext)
Cluster Configuration
---------------------
[ndbd(NDB)]     2 node(s)
id=1    @10.100.10.1  (9.5.0-ndb-9.5.0, Nodegroup: 0, *)
id=2    @10.100.10.2  (9.5.0-ndb-9.5.0, Nodegroup: 0)

[ndb_mgmd(MGM)] 1 node(s)
id=10   @10.100.10.10  (9.5.0-ndb-9.5.0)

[mysqld(API)]   2 node(s)
id=20   @10.100.10.20  (9.5.0-ndb-9.5.0)
id=21   @10.100.10.21  (9.5.0-ndb-9.5.0)
```

Há 10 linhas na tabela `transporters`—5 para o primeiro nó de dados e 5 para o segundo—assumindo que todos os nós de dados estão em execução, conforme mostrado aqui:

```
+---------+----------------+------------+----------------+------------+----------------+---------------+------------+----------------+----------+----------------+-----------+
| node_id | remote_node_id | status     | remote_address | bytes_sent | bytes_received | connect_count | overloaded | overload_count | slowdown | slowdown_count | encrypted |
+---------+----------------+------------+----------------+------------+----------------+---------------+------------+----------------+----------+----------------+-----------+
|       5 |              6 | CONNECTED  | 127.0.0.1      |   15509748 |       15558204 |             1 |          0 |              0 |        0 |              0 |         0 |
|       5 |             50 | CONNECTED  | 127.0.0.1      |    1058220 |         284316 |             1 |          0 |              0 |        0 |              0 |         0 |
|       5 |            100 | CONNECTED  | 127.0.0.1      |     574796 |         402208 |             1 |          0 |              0 |        0 |              0 |         0 |
|       5 |            101 | CONNECTING | -              |          0 |              0 |             0 |          0 |              0 |        0 |              0 |         0 |
|       6 |              5 | CONNECTED  | 127.0.0.1      |   15558204 |       15509748 |             1 |          0 |              0 |        0 |              0 |         0 |
|       6 |             50 | CONNECTED  | 127.0.0.1      |    1054548 |         283812 |             1 |          0 |              0 |        0 |              0 |         0 |
|       6 |            100 | CONNECTED  | 127.0.0.1      |     529948 |         397444 |             1 |          0 |              0 |        0 |              0 |         0 |
|       6 |            101 | CONNECTING | -              |          0 |              0 |             0 |          0 |              0 |        0 |              0 |         0 |
+---------+----------------+------------+----------------+------------+----------------+---------------+------------+----------------+----------+----------------+-----------+
```

```
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

Se você desligar um dos nós de dados neste clúster usando o comando `2 STOP` no cliente **ndb\_mgm**, então repita a consulta anterior (novamente usando o cliente **mysql**), esta tabela agora mostra apenas 5 linhas—1 linha para cada conexão do nó de gerenciamento restante para outro nó, incluindo tanto ele quanto o nó de dados que está atualmente offline—e exibe `CONNECTING` para o status de cada conexão restante ao nó de dados que está atualmente offline, conforme mostrado aqui:

```
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

Os contadores `connect_count`, `overloaded`, `overload_count`, `slowdown` e `slowdown_count` são reiniciados na conexão e retêm seus valores após o nó remoto se desconectar. Os contadores `bytes_sent` e `bytes_received` também são reiniciados na conexão e, portanto, retêm seus valores após a desconexão (até a próxima conexão os reiniciar).

O estado *overload* referido pelas colunas `overloaded` e `overload_count` ocorre quando o buffer de envio deste transportador contém mais de `OVerloadLimit` bytes (o padrão é 80% de `SendBufferMemory`, ou seja, 0,8 * 2097152 = 1677721 bytes). Quando um transportador específico está em um estado de sobrecarga, qualquer nova transação que tente usar este transportador falha com o erro 1218 (Buffers de envio sobrecarregados no kernel NDB). Isso afeta tanto as varreduras quanto as operações de chave primária.

O estado *slowdown* referenciado pelas colunas `slowdown` e `slowdown_count` desta tabela ocorre quando o buffer de envio deste transportador contém mais de 60% do limite de sobrecarga (igual a 0,6 * 2097152 = 1258291 bytes por padrão). Neste estado, qualquer nova varredura usando este transportador reduz seu tamanho de lote para minimizar a carga no transportador.

Causas comuns de lentidão ou sobrecarga do buffer de envio incluem:

* Tamanho dos dados, em particular a quantidade de dados armazenados nas colunas `TEXT` ou `BLOB` (ou ambos os tipos de colunas)
* Ter um nó de dados (ndbd ou ndbmtd) no mesmo host que um nó SQL que está envolvido em log binário
* Grande número de linhas por transação ou lote de transação
* Problemas de configuração, como memória insuficiente para `SendBufferMemory`
* Problemas de hardware, como RAM insuficiente ou conectividade ruim na rede

Veja também a Seção 25.4.3.14, “Configurando Parâmetros do Buffer de Envio do NDB Cluster”.

Se o TLS for usado para a conexão, a coluna `encrypted` é `1`, como mostrado aqui:

```
mysql> SELECT node_id, remote_node_id, status, encrypted
    -> FROM ndbinfo.transporters;
+---------+----------------+------------+-----------+
| node_id | remote_node_id | status     | encrypted |
+---------+----------------+------------+-----------+
|       5 |              6 | CONNECTED  |         1 |
|       5 |             50 | CONNECTED  |         1 |
|       5 |            100 | CONNECTED  |         1 |
|       5 |            101 | CONNECTING |         0 |
|       6 |              5 | CONNECTED  |         1 |
|       6 |             50 | CONNECTED  |         1 |
|       6 |            100 | CONNECTED  |         1 |
|       6 |            101 | CONNECTING |         0 |
+---------+----------------+------------+-----------+
8 rows in set (0.04 sec)
```

Caso contrário, o valor desta coluna é `0`.

A tabela `certificates` pode ser usada para obter informações de certificado sobre cada nó conectado usando a criptografia de link.

Para mais informações, consulte a Seção 25.6.19.5, “Criptografia de Link TLS para NDB Cluster”.