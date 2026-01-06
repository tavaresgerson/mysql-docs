#### 21.6.15.7 Tabela ndbinfo config\_nodes

A tabela `config_nodes` mostra os nós configurados em um arquivo `config.ini` de um NDB Cluster. Para cada nó, a tabela exibe uma linha contendo o ID do nó, o tipo de nó (nó de gerenciamento, nó de dados ou nó de API) e o nome ou endereço IP do host no qual o nó está configurado para ser executado.

Esta tabela não indica se um nó está realmente em execução ou se está conectado ao cluster. Informações sobre os nós conectados a um NDB Cluster podem ser obtidas nas tabelas `nodes` e `processes`.

A tabela `config_nodes` contém as seguintes colunas:

- `node_id`

  O ID do nó

- `tipo_nó`

  O tipo de nó

- `node_hostname`

  O nome ou endereço IP do host em que o nó reside

##### Notas

A coluna `node_id` mostra o ID do nó usado no arquivo `config.ini` para esse nó; se nenhum for especificado, o ID do nó que seria atribuído automaticamente a esse nó será exibido.

A coluna `node_type` exibe um dos seguintes três valores:

- `MGM`: Nó de gerenciamento.
- `NDB`: Nó de dados.
- `API`: Nó da API; isso inclui nós SQL.

A coluna `node_hostname` mostra o host do nó conforme especificado no arquivo `config.ini`. Isso pode estar vazio para um nó de API, se `HostName` não tiver sido definido no arquivo de configuração do cluster. Se `HostName` não tiver sido definido para um nó de dados no arquivo de configuração, `localhost` é usado aqui. `localhost` também é usado se `HostName` não tiver sido especificado para um nó de gerenciamento.

A tabela `config_nodes` foi adicionada no NDB 7.5.7.
