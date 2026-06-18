#### 21.6.15.8 A Tabela ndbinfo config_params

A tabela `config_params` é uma tabela estática que fornece os nomes, números de ID internos e outras informações sobre os parâmetros de configuração do NDB Cluster.

A tabela `config_params` contém as seguintes colunas:

* `param_number`

  O número de ID interno do parâmetro.

* `param_name`

  O nome do parâmetro.

* `param_description`

  Uma breve descrição do parâmetro.

* `param_type`

  O tipo de dado do parâmetro.

* `param_default`

  O valor default (padrão) do parâmetro, se houver.

* `param_min`

  O valor máximo do parâmetro, se houver.

* `param_max`

  O valor mínimo do parâmetro, se houver.

* `param_mandatory`

  É 1 se o parâmetro for obrigatório, caso contrário, 0.

* `param_status`

  Atualmente não utilizado.

##### Notas

No NDB Cluster 7.5 (e posterior), esta tabela é somente leitura (read-only). As colunas `param_description`, `param_type`, `param_default`, `param_min`, `param_max`, `param_mandatory` e `param_status` foram todas adicionadas no NDB 7.5.0.

Embora esta seja uma tabela estática, seu conteúdo pode variar entre instalações do NDB Cluster, visto que os parâmetros suportados podem mudar devido a diferenças entre lançamentos de software (software releases), configurações de hardware do cluster e outros fatores.