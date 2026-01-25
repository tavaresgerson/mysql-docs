#### 21.6.15.4 A Tabela ndbinfo cluster_locks

A tabela `cluster_locks` fornece informações sobre as solicitações atuais de Lock que estão mantendo (holding) e esperando (waiting) por Locks em Tables `NDB` em um NDB Cluster, e é destinada a ser uma tabela complementar à [`cluster_operations`](mysql-cluster-ndbinfo-cluster-operations.html "21.6.15.5 A Tabela ndbinfo cluster_operations"). As informações obtidas da tabela `cluster_locks` podem ser úteis para investigar paralisações (stalls) e deadlocks.

A tabela `cluster_locks` contém as seguintes colunas:

* `node_id`

  ID do Node reportador

* `block_instance`

  ID da Instance LDM reportadora

* `tableid`

  ID da Table contendo esta Row

* `fragmentid`

  ID do Fragment contendo a Row com Lock

* `rowid`

  ID da Row com Lock

* `transid`

  Transaction ID

* `mode`

  Modo da solicitação de Lock

* `state`

  Estado do Lock

* `detail`

  Indica se este é o primeiro Lock de holding na fila de Locks da Row

* `op`

  Tipo de Operation

* `duration_millis`

  Milissegundos gastos esperando ou mantendo o Lock

* `lock_num`

  ID do objeto Lock

* `waiting_for`

  Esperando por Lock com este ID

##### Notas

O ID da Table (coluna `tableid`) é atribuído internamente e é o mesmo usado em outras tabelas `ndbinfo`. Ele também é exibido na saída de [**ndb_show_tables**](mysql-cluster-programs-ndb-show-tables.html "21.5.27 ndb_show_tables — Display List of NDB Tables").

O Transaction ID (coluna `transid`) é o identificador gerado pela NDB API para a Transaction que está solicitando ou mantendo o Lock atual.

A coluna `mode` mostra o modo de Lock; este é sempre um de `S` (indicando um shared lock) ou `X` (um exclusive lock). Se uma Transaction mantém um exclusive lock em uma determinada Row, todos os outros Locks nessa Row têm o mesmo Transaction ID.

A coluna `state` mostra o estado do Lock. Seu valor é sempre um de `H` (holding/mantendo) ou `W` (waiting/esperando). Uma solicitação de Lock waiting espera por um Lock mantido por uma Transaction diferente.

Quando a coluna `detail` contém um `*` (caractere asterisco), isso significa que este Lock é o primeiro Lock de holding na fila de Locks da Row afetada; caso contrário, esta coluna está vazia. Essa informação pode ser usada para ajudar a identificar as entradas únicas em uma lista de solicitações de Lock.

A coluna `op` mostra o tipo de Operation solicitando o Lock. Este é sempre um dos valores `READ`, `INSERT`, `UPDATE`, `DELETE`, `SCAN` ou `REFRESH`.

A coluna `duration_millis` mostra o número de milissegundos pelos quais esta solicitação de Lock tem esperado ou mantido o Lock. Este valor é redefinido para 0 quando um Lock é concedido para uma solicitação waiting.

O ID do Lock (coluna `lock_num`) é exclusivo para este Node e Instance de bloco.

O estado do Lock é mostrado na coluna `state`; se este for `W`, o Lock está esperando para ser concedido, e a coluna `waiting_for` mostra o ID do objeto Lock que esta solicitação está esperando. Caso contrário, a coluna `waiting_for` está vazia. `waiting_for` pode referir-se apenas a Locks na mesma Row, conforme identificado por `node_id`, `block_instance`, `tableid`, `fragmentid` e `rowid`.

A tabela `cluster_locks` foi adicionada no NDB 7.5.3.