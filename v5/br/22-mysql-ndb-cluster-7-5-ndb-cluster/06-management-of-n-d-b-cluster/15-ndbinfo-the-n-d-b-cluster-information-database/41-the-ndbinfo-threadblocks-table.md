#### 21.6.15.41 A Tabela ndbinfo threadblocks

A tabela `threadblocks` associa data nodes, threads e instâncias de blocks do kernel `NDB`.

A tabela `threadblocks` contém as seguintes colunas:

* `node_id`

  ID do Node

* `thr_no`

  ID da Thread

* `block_name`

  Nome do Block

* `block_instance`

  Número da instância do Block

##### Notas

O valor de `block_name` nesta tabela é um dos valores encontrados na coluna `block_name` ao selecionar da tabela [`ndbinfo.blocks`](mysql-cluster-ndbinfo-blocks.html "21.6.15.3 A Tabela ndbinfo blocks"). Embora a lista de valores possíveis seja estática para um determinado *release* do NDB Cluster, a lista pode variar entre *releases*.

A coluna `block_instance` fornece o número da instância do kernel block.