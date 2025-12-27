#### 25.6.15.11 A tabela ndbinfo config_params

A tabela `config_params` é uma tabela estática que fornece os nomes e os números de ID internos dos parâmetros de configuração do NDB Cluster, além de outras informações sobre esses parâmetros. Essa tabela também pode ser usada em conjunto com a tabela `config_values` para obter informações em tempo real sobre os parâmetros de configuração dos nós.

A tabela `config_params` contém as seguintes colunas:

* `param_number`

  O número de ID interno do parâmetro

* `param_name`

  O nome do parâmetro

* `param_description`

  Uma breve descrição do parâmetro

* `param_type`

  O tipo de dados do parâmetro

* `param_default`

  O valor padrão do parâmetro, se houver

* `param_min`

  O valor máximo do parâmetro, se houver

* `param_max`

  O valor mínimo do parâmetro, se houver

* `param_mandatory`

  Este valor é 1 se o parâmetro for obrigatório, caso contrário, 0

* `param_status`

  Atualmente não é usado

##### Notas

Esta tabela é de leitura somente.

Embora seja uma tabela estática, seu conteúdo pode variar entre as instalações do NDB Cluster, pois os parâmetros suportados podem variar devido a diferenças entre as versões do software, as configurações de hardware do cluster e outros fatores.