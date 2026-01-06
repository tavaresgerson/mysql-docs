#### 21.6.15.33 Tabela ndbinfo server\_locks

A tabela `server_locks` tem uma estrutura semelhante à tabela `cluster_locks`, e fornece um subconjunto das informações encontradas na última tabela, mas que é específico ao nó SQL (servidor MySQL) onde reside. (A tabela `cluster_locks` fornece informações sobre todos os bloqueios no clúster.) Mais precisamente, `server_locks` contém informações sobre os bloqueios solicitados por threads pertencentes à instância atual do **mysqld**, e serve como uma tabela complementar à `server_operations`. Isso pode ser útil para correlacionar padrões de bloqueio com sessões de usuários específicos do MySQL, consultas ou casos de uso.

A tabela `server_locks` contém as seguintes colunas:

- `mysql_connection_id`

  ID de conexão MySQL

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

A coluna `mysql_connection_id` mostra o ID da conexão ou do thread do MySQL, conforme exibido em `SHOW PROCESSLIST`.

`block_instance` refere-se a uma instância de um bloco de kernel. Juntamente com o nome do bloco, esse número pode ser usado para procurar uma instância específica na tabela `threadblocks`.

O `tableid` é atribuído à tabela pelo `NDB`; o mesmo ID é usado para essa tabela em outras tabelas `ndbinfo`, bem como na saída do **ndb\_show\_tables**.

O ID da transação exibido na coluna `transid` é o identificador gerado pela API NDB para a transação que solicita ou mantém o bloqueio atual.

A coluna `mode` mostra o modo de bloqueio, que é sempre um dos `S` (bloqueio compartilhado) ou `X` (bloqueio exclusivo). Se uma transação tiver um bloqueio exclusivo em uma determinada linha, todos os outros bloqueios nessa linha terão o mesmo ID de transação.

A coluna `state` mostra o estado do bloqueio. Seu valor é sempre `H` (detenção) ou `W` (esperando). Um pedido de bloqueio em espera aguarda por um bloqueio mantido por uma transação diferente.

A coluna `detail` indica se esse bloqueio é o primeiro bloqueio de retenção na fila de bloqueio da linha afetada, caso em que ela contém um `*` (caractere asterisco); caso contrário, essa coluna está vazia. Essa informação pode ser usada para ajudar a identificar as entradas únicas em uma lista de solicitações de bloqueio.

A coluna `op` mostra o tipo de operação que solicita o bloqueio. Isso é sempre um dos valores `READ`, `INSERT`, `UPDATE`, `DELETE`, `SCAN` ou `REFRESH`.

A coluna `duration_millis` mostra o número de milissegundos em que este pedido de bloqueio estava aguardando ou mantendo o bloqueio. Isso é redefinido para 0 quando um bloqueio é concedido para um pedido em espera.

O ID do bloqueio (`lockid` coluna) é único para este nó e instância de bloco.

Se o valor da coluna `lock_state` for `W`, esse bloqueio está aguardando concessão, e a coluna `waiting_for` mostra o ID do bloqueio do objeto para o qual esse pedido está aguardando. Caso contrário, `waiting_for` está vazio. `waiting_for` pode se referir apenas a bloqueadores na mesma linha (identificados por `node_id`, `block_instance`, `tableid`, `fragmentid` e `rowid`).

A tabela `server_locks` foi adicionada no NDB 7.5.3.
