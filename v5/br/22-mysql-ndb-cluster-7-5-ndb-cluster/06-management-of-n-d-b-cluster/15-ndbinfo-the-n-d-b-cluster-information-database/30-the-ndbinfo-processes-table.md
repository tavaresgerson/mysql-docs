#### 21.6.15.30 O ndbinfo processa a tabela

Esta tabela contém informações sobre os processos dos nós do NDB Cluster; cada nó é representado pela linha da tabela. Apenas os nós conectados ao cluster são exibidos nesta tabela. Você pode obter informações sobre nós configurados, mas não conectados ao cluster, nas tabelas `nodes` e `config_nodes`.

A tabela `processes` contém as seguintes colunas:

- `node_id`

  O ID único do nó no cluster

- `tipo_nó`

  Tipo de nó (nó de gerenciamento, de dados ou de API; veja o texto)

- `node_version`

  Versão do programa de software `NDB` em execução neste nó.

- `process_id`

  ID de processo deste nó

- `angel_process_id`

  ID de processo deste processo de anjo do nó

- `process_name`

  Nome do executável

- `service_URI`

  URI de serviço deste nó (ver texto)

##### Notas

`node_id` é o ID atribuído a este nó no cluster.

A coluna `node_type` exibe um dos seguintes três valores:

- `MGM`: Nó de gerenciamento.
- `NDB`: Nó de dados.
- `API`: Nó API ou SQL.

Para um executável entregue com a distribuição do NDB Cluster, `node_version` exibe a string de versão do MySQL NDB Cluster em duas partes, como `5.7.44-ndb-7.5.36` ou `5.7.44-ndb-7.6.36`, com a qual foi compilado. Consulte Strings de versão usadas no software NDB Cluster para obter mais informações.

`process_id` é o ID do processo do executável do nó, conforme exibido pelo sistema operacional do host usando uma aplicação de exibição de processos, como o **top** no Linux, ou o Gerenciador de Tarefas nas plataformas Windows.

`angel_process_id` é o ID do processo do sistema para o processo do anjo do nó, o que garante que um nó de dados ou SQL seja reiniciado automaticamente em caso de falhas. Para nós de gerenciamento e nós de API, exceto nós de SQL, o valor desta coluna é `NULL`.

A coluna `process_name` mostra o nome do executável em execução. Para nós de gerenciamento, isso é `ndb_mgmd`. Para nós de dados, isso é `ndbd` (monossíncrono) ou `ndbmtd` (multissíncrono). Para nós de SQL, isso é `mysqld`. Para outros tipos de nós de API, é o nome do programa executável conectado ao clúster; os aplicativos da API NDB podem definir um valor personalizado para isso usando `Ndb_cluster_connection::set_name()`.

`service_URI` mostra o endereço da rede do serviço. Para nós de gerenciamento e nós de dados, o esquema usado é `ndb://`. Para nós SQL, este é `mysql://`. Por padrão, nós de API, exceto nós SQL, usam `ndb://` para o esquema; os aplicativos da API NDB podem definir este valor personalizado usando `Ndb_cluster_connection::set_service_uri()`. independentemente do tipo do nó, o esquema é seguido pelo endereço IP usado pelo transportador NDB para o nó em questão. Para nós de gerenciamento e nós SQL, este endereço inclui o número de porta (geralmente 1186 para nós de gerenciamento e 3306 para nós SQL). Se o nó SQL foi iniciado com a variável de sistema `bind_address` definida, este endereço é usado em vez do endereço do transportador, a menos que o endereço de vinculação seja definido como `*`, `0.0.0.0` ou `::`.

Informações adicionais sobre o caminho podem ser incluídas no valor `service_URI` para um nó SQL, refletindo várias opções de configuração. Por exemplo, `mysql://198.51.100.3/tmp/mysql.sock` indica que o nó SQL foi iniciado com a variável de sistema `skip_networking` habilitada, e `mysql://198.51.100.3:3306/?server-id=1` mostra que a replicação está habilitada para este nó SQL.

A tabela `processes` foi adicionada no NDB 7.5.7.
