#### 21.6.15.8 Tabela ndbinfo config_params

A tabela `config_params` é uma tabela estática que fornece os nomes e os números de ID internos dos parâmetros de configuração do NDB Cluster, além de outras informações sobre esses parâmetros.

A tabela `config_params` contém as seguintes colunas:

- `param_number`

  O número de ID interno do parâmetro

- `param_name`

  O nome do parâmetro

- `param_description`

  Uma breve descrição do parâmetro

- `param_type`

  O tipo de dado do parâmetro

- `param_default`

  O valor padrão do parâmetro, se houver

- `param_min`

  O valor máximo do parâmetro, se houver

- `param_max`

  O valor mínimo do parâmetro, se houver

- `param_mandatory`

  1 se o parâmetro for obrigatório, caso contrário, 0

- `param_status`

  Atualmente, não utilizada

##### Notas

No NDB Cluster 7.5 (e versões posteriores), essa tabela é de leitura somente. As colunas `param_description`, `param_type`, `param_default`, `param_min`, `param_max`, `param_mandatory` e `param_status` foram adicionadas no NDB 7.5.0.

Embora esta seja uma tabela estática, seu conteúdo pode variar entre as instalações do NDB Cluster, uma vez que os parâmetros suportados podem variar devido a diferenças entre as versões do software, configurações de hardware do cluster e outros fatores.
