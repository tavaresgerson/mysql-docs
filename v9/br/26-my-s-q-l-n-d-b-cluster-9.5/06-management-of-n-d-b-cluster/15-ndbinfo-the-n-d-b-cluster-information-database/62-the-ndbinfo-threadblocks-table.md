#### 25.6.15.62 Tabela de threadblocks ndbinfo

A tabela `threadblocks` associa nós de dados, threads e instâncias de blocos de kernel `NDB`.

A tabela `threadblocks` contém as seguintes colunas:

* `node_id`

  ID do nó

* `thr_no`

  ID do thread

* `block_name`

  Nome do bloco

* `block_instance`

  Número de instância do bloco

##### Notas

O valor da `block_name` nesta tabela é um dos valores encontrados na coluna `block_name` ao selecionar a partir da tabela `ndbinfo.blocks`. Embora a lista de valores possíveis seja estática para uma determinada versão do NDB Cluster, a lista pode variar entre as versões.

A coluna `block_instance` fornece o número de instância do bloco de kernel.