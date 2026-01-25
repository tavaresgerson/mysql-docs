#### 21.6.15.30 A Tabela ndbinfo processes

Esta tabela contém informações sobre os processos de Node do NDB Cluster; cada Node é representado por uma linha na tabela. Apenas Nodes que estão conectados ao Cluster são exibidos nesta tabela. Você pode obter informações sobre Nodes que estão configurados, mas não conectados ao Cluster, a partir das tabelas [`nodes`](mysql-cluster-ndbinfo-nodes.html "21.6.15.28 A Tabela ndbinfo nodes") e [`config_nodes`](mysql-cluster-ndbinfo-config-nodes.html "21.6.15.7 A Tabela ndbinfo config_nodes").

A tabela `processes` contém as seguintes colunas:

* `node_id`

  O ID único do Node no Cluster.

* `node_type`

  Tipo de Node (management, data, ou API node; veja o texto)

* `node_version`

  Versão do programa de software `NDB` em execução neste Node.

* `process_id`

  O Process ID deste Node.

* `angel_process_id`

  Process ID do *angel process* deste Node.

* `process_name`

  Nome do executável.

* `service_URI`

  Service URI deste Node (veja o texto).

##### Notas

`node_id` é o ID atribuído a este Node no Cluster.

A coluna `node_type` exibe um dos seguintes três valores:

* `MGM`: Node de Management.
* `NDB`: Data Node.
* `API`: API Node ou SQL Node.

Para um executável fornecido com a distribuição NDB Cluster, `node_version` mostra a string de versão do MySQL NDB Cluster de duas partes (como `5.7.44-ndb-7.5.36` ou `5.7.44-ndb-7.6.36`) com a qual ele foi compilado. Consulte [Strings de versão usadas no software NDB Cluster](mysql-cluster-general-info.html#mysql-cluster-version-strings "Version strings used in NDB Cluster software") para obter mais informações.

`process_id` é o Process ID do executável do Node, conforme exibido pelo sistema operacional host usando uma aplicação de visualização de processos, como **top** no Linux ou o Gerenciador de Tarefas (*Task Manager*) em plataformas Windows.

`angel_process_id` é o Process ID do sistema para o *angel process* do Node, que garante que um Data Node ou SQL seja reiniciado automaticamente em casos de falha. Para Nodes de Management e API Nodes que não sejam SQL Nodes, o valor desta coluna é `NULL`.

A coluna `process_name` mostra o nome do executável em execução. Para Nodes de Management, este é `ndb_mgmd`. Para Data Nodes, este é `ndbd` (*single-threaded*) ou `ndbmtd` (*multithreaded*). Para SQL Nodes, este é `mysqld`. Para outros tipos de API Nodes, é o nome do programa executável conectado ao Cluster; aplicações NDB API podem definir um valor personalizado para isso usando [`Ndb_cluster_connection::set_name()`](/doc/ndbapi/en/ndb-ndb-cluster-connection.html#ndb-ndb-cluster-connection-set-name).

`service_URI` mostra o endereço de rede do serviço. Para Nodes de Management e Data Nodes, o esquema usado é `ndb://`. Para SQL Nodes, este é `mysql://`. Por padrão, API Nodes que não sejam SQL Nodes usam `ndb://` para o esquema; aplicações NDB API podem definir um valor personalizado para isso usando `Ndb_cluster_connection::set_service_uri()`. Independentemente do tipo de Node, o esquema é seguido pelo endereço IP usado pelo *transporter* NDB para o Node em questão. Para Nodes de Management e SQL Nodes, este endereço inclui o número da porta (geralmente 1186 para Nodes de Management e 3306 para SQL Nodes). Se o SQL Node foi iniciado com a variável de sistema [`bind_address`](server-system-variables.html#sysvar_bind_address) definida, este endereço é usado em vez do endereço do *transporter*, a menos que o *bind address* esteja definido como `*`, `0.0.0.0` ou `::`.

Informações de caminho adicionais podem ser incluídas no valor de `service_URI` para um SQL Node, refletindo várias opções de configuração. Por exemplo, `mysql://198.51.100.3/tmp/mysql.sock` indica que o SQL Node foi iniciado com a variável de sistema [`skip_networking`](server-system-variables.html#sysvar_skip_networking) habilitada, e `mysql://198.51.100.3:3306/?server-id=1` mostra que a *replication* está habilitada para este SQL Node.

A tabela `processes` foi adicionada no NDB 7.5.7.