#### 25.6.15.7 Tabela ndbinfo cluster_locks

A tabela `cluster_locks` fornece informações sobre os pedidos de bloqueio atuais e os bloqueios aguardando em blocos de tabelas `NDB` em um NDB Cluster, e é destinada como uma tabela complementar à `cluster_operations`. As informações obtidas da tabela `cluster_locks` podem ser úteis para investigar travamentos e bloqueios.

A tabela `cluster_locks` contém as seguintes colunas:

* `node_id`

  ID do nó relatador

* `block_instance`

  ID da instância LDM relatada

* `tableid`

  ID da tabela que contém esta linha

* `fragmentid`

  ID do fragmento que contém a linha bloqueada

* `rowid`

  ID da linha bloqueada

* `transid`

  ID da transação

* `mode`

  Modo do pedido de bloqueio

* `state`

  Estado do bloqueio

* `detail`

  Se este é o primeiro bloqueio na fila de bloqueio da linha

* `op`

  Tipo de operação

* `duration_millis`

  Milissegundos gastos esperando ou segurando o bloqueio

* `lock_num`

  ID do objeto de bloqueio

* `waiting_for`

  Esperando por um bloqueio com este ID

##### Notas

O ID da tabela (`tableid` coluna) é atribuído internamente e é o mesmo usado em outras tabelas `ndbinfo`. Também é exibido na saída do **ndb\_show\_tables**.

O ID da transação (`transid` coluna) é o identificador gerado pela API NDB para a transação solicitando ou segurando o bloqueio atual.

A coluna `mode` mostra o modo de bloqueio; isso é sempre um dos `S` (indicando um bloqueio compartilhado) ou `X` (um bloqueio exclusivo). Se uma transação segura um bloqueio exclusivo em uma determinada linha, todos os outros bloqueios nessa linha têm o mesmo ID de transação.

A coluna `state` mostra o estado do bloqueio. Seu valor é sempre um dos `H` (seguindo) ou `W` (esperando). Um pedido de bloqueio em espera aguarda por um bloqueio mantido por uma transação diferente.

Quando a coluna `detail` contém um `*` (caractere asterisco), isso significa que este bloqueio é o primeiro bloqueio de retenção na fila de bloqueio da linha afetada; caso contrário, esta coluna está vazia. Esta informação pode ser usada para ajudar a identificar as entradas únicas em uma lista de solicitações de bloqueio.

A coluna `op` mostra o tipo de operação que está solicitando o bloqueio. Isso é sempre um dos valores `READ`, `INSERT`, `UPDATE`, `DELETE`, `SCAN` ou `REFRESH`.

A coluna `duration_millis` mostra o número de milissegundos por quanto tempo este pedido de bloqueio está aguardando ou retendo o bloqueio. Isso é zerado para 0 quando um bloqueio é concedido para um pedido em espera.

O ID do bloqueio (`lockid` coluna) é único para este nó e instância de bloco.

O estado do bloqueio é mostrado na coluna `lock_state`; se este for `W`, o bloqueio está aguardando para ser concedido, e a coluna `waiting_for` mostra o ID do bloqueio do objeto de bloqueio que este pedido está aguardando. Caso contrário, a coluna `waiting_for` está vazia. `waiting_for` pode se referir apenas a bloqueios na mesma linha, conforme identificado por `node_id`, `block_instance`, `tableid`, `fragmentid` e `rowid`.