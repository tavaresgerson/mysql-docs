#### 21.6.15.7 A Tabela ndbinfo config_nodes

A tabela `config_nodes` mostra os nodes configurados em um arquivo `config.ini` do NDB Cluster. Para cada node, a tabela exibe uma linha contendo o ID do node, o tipo de node (node de gerenciamento, node de dados ou node API), e o nome ou endereço IP do host onde o node está configurado para ser executado.

Esta tabela não indica se um determinado node está realmente em execução ou se está atualmente conectado ao cluster. Informações sobre nodes conectados a um NDB Cluster podem ser obtidas nas tabelas [`nodes`](mysql-cluster-ndbinfo-nodes.html "21.6.15.28 A Tabela ndbinfo nodes") e [`processes`](mysql-cluster-ndbinfo-processes.html "21.6.15.30 A Tabela ndbinfo processes").

A tabela `config_nodes` contém as seguintes colunas:

* `node_id`

  O ID do node

* `node_type`

  O tipo de node

* `node_hostname`

  O nome ou endereço IP do host onde o node reside

##### Notas

A coluna `node_id` mostra o ID do node usado no arquivo `config.ini` para este node; se nenhum for especificado, o ID do node que seria atribuído automaticamente a este node é exibido.

A coluna `node_type` exibe um dos três valores a seguir:

* `MGM`: Node de gerenciamento.
* `NDB`: Node de dados.
* `API`: Node API; isso inclui nodes SQL.

A coluna `node_hostname` mostra o host do node conforme especificado no arquivo `config.ini`. Isso pode estar vazio para um node API, se [`HostName`](mysql-cluster-api-definition.html#ndbparam-api-hostname) não tiver sido definido no arquivo de configuração do cluster. Se [`HostName`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-hostname) não tiver sido definido para um node de dados no arquivo de configuração, `localhost` será usado aqui. `localhost` também é usado se [`HostName`](mysql-cluster-mgm-definition.html#ndbparam-mgmd-hostname) não tiver sido especificado para um node de gerenciamento.

A tabela `config_nodes` foi adicionada no NDB 7.5.7.