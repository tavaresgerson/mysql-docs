#### 25.6.16.64 A tabela ndbinfo transporter\_details

Esta tabela contém informações sobre os transportadores individuais do NDB, em vez de informações agregadas, como mostrado na tabela `transporters`. A tabela `transporter_details` foi adicionada no NDB 8.0.37.

A tabela `transporter_details` contém as seguintes colunas:

- `node_id`

  ID de nó único deste nó de dados no cluster

- `block_instance`

- `trp_id`

  O ID do transportador

- `remote_node_id`

  O ID do nó do nó de dados remoto

- `status`

  Status da conexão

- `remote_address`

  Nome ou endereço IP do host remoto

- `bytes_sent`

  Número de bytes enviados usando essa conexão

- `bytes_received`

  Número de bytes recebidos usando essa conexão

- `connect_count`

  Número de vezes que a conexão foi estabelecida neste transportador

- `overloaded`

  1 se este transportador estiver sobrecarregado atualmente, caso contrário, 0

- `overload_count`

  Número de vezes que este transportador entrou em estado de sobrecarga desde a conexão

- `slowdown`

  1 se este transportador estiver no estado de desaceleração, caso contrário, 0

- `slowdown_count`

  Número de vezes que este transportador entrou no estado de desaceleração desde a conexão

- `encrypted`

  Se este transportador estiver conectado usando TLS, esta coluna é `1`, caso contrário, é `0`.

- `sendbuffer_used_bytes`

  A quantidade, em bytes, de dados de sinal atualmente aguardando envio por este transportador.

- `sendbuffer_max_used_bytes`

  O valor máximo, em bytes, de dados de sinal aguardando envio em qualquer momento por este transportador.

- `sendbuffer_alloc_bytes`

  Quantidade de buffer de envio, em bytes, atualmente alocada para armazenamento de dados de sinal para este transportador.

- `sendbuffer_max_alloc_bytes`

  Quantidade máxima de buffer de envio, em bytes, alocada para armazenamento de dados de sinal em qualquer momento para este transportador.

- `type`

  O tipo de conexão utilizado por este transportador (`TCP` ou `SHM`).

A tabela `transporter_details` exibe uma linha que mostra o status de cada transportador no clúster. Consulte as Notas da tabela `transporters` para obter mais informações sobre cada uma das colunas desta tabela.

As colunas `sendbuffer_used_bytes`, `sendbuffer_max_used_bytes`, `sendbuffer_alloc_bytes`, `sendbuffer_max_alloc_bytes` e `type` foram adicionadas no NDB 8.0.38.
