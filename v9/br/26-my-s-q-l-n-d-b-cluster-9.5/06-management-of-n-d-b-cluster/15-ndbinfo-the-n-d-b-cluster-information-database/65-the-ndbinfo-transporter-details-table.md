#### 25.6.15.65 Tabela ndbinfo transporter_details

Esta tabela contém informações sobre os transportadores NDB individuais, em vez de informações agregadas, como mostra a tabela `transporters`.

A tabela `transporter_details` contém as seguintes colunas:

* `node_id`

  O ID de nó único desse nó de dados no cluster

* `block_instance`
* `trp_id`

  O ID do transportador

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

* `sendbuffer_used_bytes`

  A quantidade, em bytes, de dados de sinal atualmente aguardando envio por esse transportador.

* `sendbuffer_max_used_bytes`

  A quantidade máxima, em bytes, de dados de sinal aguardando envio em qualquer momento por esse transportador.

* `sendbuffer_alloc_bytes`

  Quantidade de buffer de envio, em bytes, atualmente alocada para armazenamento de dados de sinal para esse transportador.

* `sendbuffer_max_alloc_bytes`

  Quantidade máxima de buffer de envio, em bytes, alocada para armazenamento de dados de sinal em qualquer momento para esse transportador.

* `type`

  O tipo de conexão usado por esse transportador (`TCP` ou `SHM`).

A tabela `transportador_detalhes` exibe uma linha que mostra o status de cada transportador no clúster. Consulte as Notas da tabela `transportadores` para obter mais informações sobre cada uma das colunas desta tabela.