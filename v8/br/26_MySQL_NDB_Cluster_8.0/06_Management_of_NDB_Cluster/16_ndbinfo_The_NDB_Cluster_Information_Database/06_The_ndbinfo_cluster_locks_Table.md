#### 25.6.16.6 A tabela ndbinfo cluster\_locks

A tabela `cluster_locks` fornece informações sobre solicitações de bloqueio atuais e espera por bloqueios em tabelas `NDB` em um NDB Cluster, e é destinada como uma tabela complementar a `cluster_operations`. As informações obtidas a partir da tabela `cluster_locks` podem ser úteis na investigação de travamentos e deadlocks.

A tabela `cluster_locks` contém as seguintes colunas:

- `node_id`

  ID do nó de relatório

- `block_instance`

  ID da instância de LDM que está sendo relatada

- `tableid`

  ID da tabela que contém esta linha

- `fragmentid`

  ID do fragmento que contém a linha bloqueada

- `rowid`

  ID da linha bloqueada

- `transid`

  ID da transação

- `mode`

  Modo de solicitação de bloqueio

- `state`

  Estado de bloqueio

- `detail`

  Se esta é a primeira retenção de bloqueio na fila de bloqueio de linha

- `op`

  Tipo de operação

- `duration_millis`

  Milissegundos gastos esperando ou segurando o bloqueio

- `lock_num`

  ID do objeto de bloqueio

- `waiting_for`

  Esperando por bloqueio com este ID

##### Notas

O ID da tabela (coluna `tableid`) é atribuído internamente e é o mesmo usado em outras tabelas `ndbinfo`. Ele também é exibido na saída do **ndb\_show\_tables**.

O ID da transação (coluna `transid`) é o identificador gerado pela API NDB para a transação que solicita ou mantém o bloqueio atual.

A coluna `mode` mostra o modo de bloqueio; este é sempre um dos `S` (indicando um bloqueio compartilhado) ou `X` (um bloqueio exclusivo). Se uma transação mantém um bloqueio exclusivo em uma determinada linha, todos os outros bloqueios nessa linha têm o mesmo ID de transação.

A coluna `state` mostra o estado do bloqueio. Seu valor é sempre um dos `H` (detenção) ou `W` (espera). Um pedido de bloqueio em espera aguarda por um bloqueio mantido por uma transação diferente.

Quando a coluna `detail` contém um `*` (caractere asterisco), isso significa que essa tranca é a primeira tranca de retenção na fila de trancas da linha afetada; caso contrário, essa coluna está vazia. Essa informação pode ser usada para ajudar a identificar as entradas únicas em uma lista de solicitações de tranca.

A coluna `op` mostra o tipo de operação que solicita o bloqueio. Este é sempre um dos valores `READ`, `INSERT`, `UPDATE`, `DELETE`, `SCAN` ou `REFRESH`.

A coluna `duration_millis` mostra o número de milissegundos em que este pedido de bloqueio está aguardando ou mantendo o bloqueio. Isso é zerado para 0 quando um bloqueio é concedido para um pedido em espera.

O ID do bloqueio (coluna `lockid`) é único para este nó e para a instância do bloco.

O estado do bloqueio é mostrado na coluna `lock_state`; se for `W`, o bloqueio está aguardando para ser concedido, e a coluna `waiting_for` mostra o ID do bloqueio do objeto de bloqueio que este pedido está aguardando. Caso contrário, a coluna `waiting_for` está vazia. `waiting_for` pode se referir apenas a bloqueios na mesma linha, identificados por `node_id`, `block_instance`, `tableid`, `fragmentid` e `rowid`.
