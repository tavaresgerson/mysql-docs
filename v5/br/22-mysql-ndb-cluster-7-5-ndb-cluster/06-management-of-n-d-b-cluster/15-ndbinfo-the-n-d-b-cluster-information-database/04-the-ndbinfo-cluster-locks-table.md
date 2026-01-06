#### 21.6.15.4 A tabela ndbinfo cluster\_locks

A tabela `cluster_locks` fornece informações sobre os pedidos de bloqueio atuais que estão mantendo e aguardando por bloqueios em tabelas `NDB` em um NDB Cluster, e é destinada como uma tabela complementar à `cluster_operations`. As informações obtidas da tabela `cluster_locks` podem ser úteis para investigar travamentos e bloqueios.

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

- `modo`

  Modo de solicitação de bloqueio

- "estado"

  Estado de bloqueio

- `detalhe`

  Se esta é a primeira retenção de bloqueio na fila de bloqueio de linha

- `op`

  Tipo de operação

- `duração_millis`

  Milissegundos gastos esperando ou segurando o bloqueio

- `lock_num`

  ID do objeto de bloqueio

- `esperando por`

  Esperando por bloqueio com este ID

##### Notas

O ID da tabela (`tableid` coluna) é atribuído internamente e é o mesmo usado em outras tabelas `ndbinfo`. Ele também é exibido na saída de **ndb\_show\_tables**.

O ID da transação (`transid` coluna) é o identificador gerado pela API NDB para a transação que solicita ou mantém o bloqueio atual.

A coluna `mode` mostra o modo de bloqueio; este é sempre um dos `S` (indicando um bloqueio compartilhado) ou `X` (um bloqueio exclusivo). Se uma transação mantém um bloqueio exclusivo em uma determinada linha, todos os outros bloqueios nessa linha têm o mesmo ID de transação.

A coluna `state` mostra o estado do bloqueio. Seu valor é sempre `H` (detenção) ou `W` (esperando). Um pedido de bloqueio em espera aguarda por um bloqueio mantido por uma transação diferente.

Quando a coluna `detail` contém um `*` (caractere asterisco), isso significa que essa trava é a primeira trava de retenção na fila de trava da linha afetada; caso contrário, essa coluna está vazia. Essa informação pode ser usada para ajudar a identificar as entradas únicas em uma lista de solicitações de trava.

A coluna `op` mostra o tipo de operação que solicita o bloqueio. Isso é sempre um dos valores `READ`, `INSERT`, `UPDATE`, `DELETE`, `SCAN` ou `REFRESH`.

A coluna `duration_millis` mostra o número de milissegundos em que este pedido de bloqueio estava aguardando ou mantendo o bloqueio. Isso é redefinido para 0 quando um bloqueio é concedido para um pedido em espera.

O ID do bloqueio (`lockid` coluna) é único para este nó e instância de bloco.

O estado do bloqueio é exibido na coluna `lock_state`; se este for `W`, o bloqueio está aguardando para ser concedido, e a coluna `waiting_for` mostra o ID do bloqueio do objeto para o qual este pedido está aguardando. Caso contrário, a coluna `waiting_for` está vazia. `waiting_for` pode se referir apenas a blocos na mesma linha, identificados por `node_id`, `block_instance`, `tableid`, `fragmentid` e `rowid`.

A tabela `cluster_locks` foi adicionada no NDB 7.5.3.
