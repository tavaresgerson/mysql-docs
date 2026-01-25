#### 21.6.15.33 A Tabela ndbinfo server\_locks

A tabela `server_locks` tem uma estrutura semelhante à tabela `cluster_locks` e fornece um subconjunto das informações encontradas nesta última, mas que são específicas para o nó SQL (servidor MySQL) onde reside. (A tabela `cluster_locks` fornece informações sobre todos os Locks no Cluster.) Mais precisamente, `server_locks` contém informações sobre Locks solicitados por Threads pertencentes à instância atual do [**mysqld**](mysqld.html "4.3.1 mysqld — The MySQL Server") e serve como uma tabela complementar a [`server_operations`](mysql-cluster-ndbinfo-server-operations.html "21.6.15.34 The ndbinfo server_operations Table"). Isso pode ser útil para correlacionar padrões de Lock com sessões de usuário MySQL específicas, Queries ou casos de uso.

A tabela `server_locks` contém as seguintes colunas:

* `mysql_connection_id`

  ID de Connection MySQL

* `node_id`

  ID do Node que está reportando

* `block_instance`

  ID da instância LDM que está reportando

* `tableid`

  ID da Table contendo esta Row

* `fragmentid`

  ID do Fragment contendo a Row com Lock

* `rowid`

  ID da Row com Lock

* `transid`

  ID da Transaction

* `mode`

  Mode da solicitação de Lock

* `state`

  State do Lock

* `detail`

  Indica se este é o primeiro Lock de retenção na fila de Row Lock

* `op`

  Tipo de Operation

* `duration_millis`

  Milissegundos gastos esperando ou retendo o Lock

* `lock_num`

  ID do objeto Lock

* `waiting_for`

  Esperando pelo Lock com este ID

##### Notas

A coluna `mysql_connection_id` mostra o ID de Connection ou Thread do MySQL, conforme exibido por [`SHOW PROCESSLIST`](show-processlist.html "13.7.5.29 SHOW PROCESSLIST Statement").

`block_instance` refere-se a uma instância de um Kernel Block. Juntamente com o nome do Block, este número pode ser usado para procurar uma determinada instância na tabela [`threadblocks`](mysql-cluster-ndbinfo-threadblocks.html "21.6.15.41 The ndbinfo threadblocks Table").

O `tableid` é atribuído à Table pelo `NDB`; o mesmo ID é usado para esta Table em outras tabelas `ndbinfo`, bem como na saída de [**ndb_show_tables**](mysql-cluster-programs-ndb-show-tables.html "21.5.27 ndb_show_tables — Display List of NDB Tables").

O Transaction ID exibido na coluna `transid` é o identificador gerado pela NDB API para a Transaction que solicita ou retém o Lock atual.

A coluna `mode` mostra o Lock Mode, que é sempre um dos seguintes: `S` (shared lock) ou `X` (exclusive lock). Se uma Transaction tiver um Exclusive Lock em uma determinada Row, todos os outros Locks nessa Row terão o mesmo Transaction ID.

A coluna `state` mostra o Lock State. Seu valor é sempre um dos seguintes: `H` (holding/retendo) ou `W` (waiting/esperando). Uma solicitação de Lock em Waiting espera por um Lock retido por uma Transaction diferente.

A coluna `detail` indica se este Lock é o primeiro Lock de retenção na Lock Queue da Row afetada, caso em que contém um `*` (caractere de asterisco); caso contrário, esta coluna fica vazia. Esta informação pode ser usada para ajudar a identificar as entradas únicas em uma lista de solicitações de Lock.

A coluna `op` mostra o tipo de Operation solicitando o Lock. Este é sempre um dos valores `READ`, `INSERT`, `UPDATE`, `DELETE`, `SCAN` ou `REFRESH`.

A coluna `duration_millis` mostra o número de milissegundos pelos quais esta solicitação de Lock esteve esperando ou retendo o Lock. Isso é redefinido para 0 quando um Lock é concedido para uma solicitação em Waiting.

O Lock ID (coluna `lock_num`) é único para este Node e Block Instance.

Se o valor da coluna `lock_state` for `W`, este Lock está esperando para ser concedido, e a coluna `waiting_for` mostra o Lock ID do objeto Lock pelo qual esta solicitação está esperando. Caso contrário, `waiting_for` fica vazio. `waiting_for` pode referir-se apenas a Locks na mesma Row (conforme identificada por `node_id`, `block_instance`, `tableid`, `fragmentid` e `rowid`).

A tabela `server_locks` foi adicionada no NDB 7.5.3.