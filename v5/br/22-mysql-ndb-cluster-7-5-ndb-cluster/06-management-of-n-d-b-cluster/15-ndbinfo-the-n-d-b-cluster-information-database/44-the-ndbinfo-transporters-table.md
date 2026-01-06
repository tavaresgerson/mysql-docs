#### 21.6.15.44 Tabela de transportadores ndbinfo

Esta tabela contém informações sobre os transportadores NDB.

A tabela `transporters` contém as seguintes colunas:

- `node_id`

  ID de nó único deste nó de dados no cluster

- `remote_node_id`

  O ID do nó do nó de dados remoto

- `status`

  Status da conexão

- `endereço_remoto`

  Nome ou endereço IP do host remoto

- `bytes_sent`

  Número de bytes enviados usando essa conexão

- `bytes_received`

  Número de bytes recebidos usando essa conexão

- `connect_count`

  Número de vezes que a conexão foi estabelecida neste transportador

- sobrecarregado

  1 se este transportador estiver sobrecarregado atualmente, caso contrário, 0

- `sobrecarga_count`

  Número de vezes que este transportador entrou em estado de sobrecarga desde a conexão

- `baixa a velocidade`

  1 se este transportador estiver no estado de desaceleração, caso contrário, 0

- `slowdown_count`

  Número de vezes que este transportador entrou no estado de desaceleração desde a conexão

##### Notas

Para cada nó de dados em execução no clúster, a tabela `transporters` exibe uma linha que mostra o status de cada uma das conexões desse nó com todos os nós no clúster, *incluindo ele mesmo*. Essa informação é exibida na coluna *status* da tabela, que pode ter qualquer um dos seguintes valores: `CONNECTING`, `CONNECTED`, `DISCONNECTING` ou `DISCONNECTED`.

As conexões aos nós de API e de gerenciamento que estão configurados, mas atualmente não conectados ao clúster, são exibidas com o status `DESCONECTADO`. As linhas onde o `node_id` é o de um nó de dados que não está atualmente conectado não são exibidas nesta tabela. (Essa é uma omissão semelhante de nós desconectados na tabela `ndbinfo.nodes`.

O `remote_address` é o nome do host ou endereço do nó cujo ID está exibido na coluna `remote_node_id`. Os valores `bytes_sent` (bytes enviados) e `bytes_received` (bytes recebidos) desse nó são, respectivamente, o número de bytes enviados e recebidos pelo nó usando essa conexão desde que ela foi estabelecida. Para nós cujo status é `CONNECTING` (conectando) ou `DISCONNECTED` (desconectado), essas colunas sempre exibem `0`.

Suponha que você tenha um clúster de 5 nós, composto por 2 nós de dados, 2 nós SQL e 1 nó de gerenciamento, conforme mostrado na saída do comando `SHOW` no cliente **ndb\_mgm**:

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

Há 10 linhas na tabela `transporters` — 5 para o primeiro nó de dados e 5 para o segundo — assumindo que todos os nós de dados estão em funcionamento, conforme mostrado aqui:

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

Se você desligar um dos nós de dados neste clúster usando o comando `2 STOP` no cliente **ndb\_mgm**, então repita a consulta anterior (novamente usando o cliente **mysql**), esta tabela agora mostra apenas 5 linhas — 1 linha para cada conexão do nó de gerenciamento restante para outro nó, incluindo tanto ele quanto o nó de dados que está atualmente offline — e exibe `CONNECTING` (conectando) para o status de cada conexão restante ao nó de dados que está atualmente offline, como mostrado aqui:

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

Os contadores `connect_count`, `overloaded`, `overload_count`, `slowdown` e `slowdown_count` são zerados na conexão e mantêm seus valores após o nó remoto se desconectar. Os contadores `bytes_sent` e `bytes_received` também são zerados na conexão e, portanto, mantêm seus valores após a desconexão (até que a próxima conexão os redefina).

O estado de *sobrecarga* referido pelas colunas `overloaded` e `overload_count` ocorre quando o buffer de envio deste transportador contém mais de \[`OVerloadLimit`]\(mysql-cluster-tcp-definition.html#ndbparam-tcp-overloadlimit] bytes (o valor padrão é 80% de `SendBufferMemory`, ou seja, 0,8 \* 2097152 = 1677721 bytes). Quando um transportador específico está em estado de sobrecarga, qualquer nova transação que tente usar este transportador falha com o erro 1218 (Buffers de envio sobrecarregados no kernel NDB). Isso afeta tanto as pesquisas quanto as operações de chave primária.

O estado de *redução de velocidade* referido pelas colunas `slowdown` e `slowdown_count` desta tabela ocorre quando o buffer de envio do transportador contém mais de 60% do limite de sobrecarga (igual a 0,6 \* 2097152 = 1258291 bytes por padrão). Nesse estado, qualquer nova varredura usando este transportador reduz o tamanho do lote para minimizar a carga no transportador.

As causas comuns de lentidão ou sobrecarga do buffer de envio incluem as seguintes:

- Tamanho dos dados, em particular a quantidade de dados armazenados nas colunas `TEXT` ou nas colunas `BLOB` (ou em ambos os tipos de colunas)

- Ter um nó de dados (ndbd ou ndbmtd) no mesmo host que um nó SQL que está envolvido no registro binário

- Grande número de linhas por transação ou lote de transações

- Problemas de configuração, como insuficiente `SendBufferMemory`

- Problemas de hardware, como memória RAM insuficiente ou conectividade de rede ruim

Veja também Seção 21.4.3.13, “Configurando Parâmetros do Buffer de Envio do NDB Cluster”.
