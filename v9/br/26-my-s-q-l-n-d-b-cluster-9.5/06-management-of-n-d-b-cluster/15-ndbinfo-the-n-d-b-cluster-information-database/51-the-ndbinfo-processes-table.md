#### 25.6.15.51 Processos do ndbinfo que processam a tabela

Esta tabela contém informações sobre os processos dos nós do NDB Cluster; cada nó é representado pela linha da tabela. Apenas os nós conectados ao cluster são exibidos nesta tabela. Você pode obter informações sobre nós configurados, mas não conectados ao cluster, nas tabelas `nodes` e `config_nodes`.

A tabela `processes` contém as seguintes colunas:

* `node_id`

  O ID de nó único do nó no cluster

* `node_type`

  Tipo de nó (nó de gerenciamento, de dados ou de API; veja o texto)

* `node_version`

  Versão do programa de software `NDB` em execução neste nó.

* `process_id`

  O ID de processo do nó

* `angel_process_id`

  ID de processo do processo anjo deste nó

* `process_name`

  Nome do executável

* `service_URI`

  URI do serviço deste nó (veja o texto)

##### Notas

`node_id` é o ID atribuído a este nó no cluster.

A coluna `node_type` exibe um dos seguintes três valores:

* `MGM`: Nó de gerenciamento.
* `NDB`: Nó de dados.
* `API`: Nó de API ou SQL.

Para um executável fornecido com a distribuição do NDB Cluster, `node_version` mostra a string de versão do software Cluster, como `9.5.0-ndb-9.5.0`.

`process_id` é o ID de processo do executável do nó, conforme exibido pelo sistema operacional do host usando uma aplicação de exibição de processos, como **top** no Linux, ou o Gerenciador de Tarefas nas plataformas Windows.

`angel_process_id` é o ID de processo do sistema para o processo anjo do nó, que garante que um nó de dados ou SQL seja automaticamente reiniciado em caso de falhas. Para nós de gerenciamento e nós de API, exceto nós SQL, o valor desta coluna é `NULL`.

A coluna `process_name` mostra o nome do executável em execução. Para nós de gerenciamento, isso é `ndb_mgmd`. Para nós de dados, isso é `ndbd` (monotrilhado) ou `ndbmtd` (multitrilhado). Para nós de SQL, isso é `mysqld`. Para outros tipos de nós de API, é o nome do programa executável conectado ao clúster; os aplicativos da API NDB podem definir um valor personalizado para isso usando `Ndb_cluster_connection::set_name()`.

`service_URI` mostra o endereço de rede do serviço. Para nós de gerenciamento e nós de dados, o esquema usado é `ndb://`. Para nós de SQL, isso é `mysql://`. Por padrão, nós de API que não são de SQL usam `ndb://` para o esquema; os aplicativos da API NDB podem definir isso para um valor personalizado usando `Ndb_cluster_connection::set_service_uri()`. independentemente do tipo de nó, o esquema é seguido pelo endereço IP usado pelo transportador NDB para o nó em questão. Para nós de gerenciamento e nós de SQL, esse endereço inclui o número de porta (geralmente 1186 para nós de gerenciamento e 3306 para nós de SQL). Se o nó de SQL foi iniciado com a variável de sistema `bind_address` definida, esse endereço é usado em vez do endereço do transportador, a menos que o endereço de vinculação seja definido como `*`, `0.0.0.0` ou `::`.

Informações adicionais de caminho podem ser incluídas no valor `service_URI` para um nó de SQL, refletindo várias opções de configuração. Por exemplo, `mysql://198.51.100.3/tmp/mysql.sock` indica que o nó de SQL foi iniciado com a variável de sistema `skip_networking` habilitada, e `mysql://198.51.100.3:3306/?server-id=1` mostra que a replicação está habilitada para esse nó de SQL.