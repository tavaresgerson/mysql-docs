#### 21.6.15.41 Blocos de execução de threads ndbinfo Tabela

A tabela `threadblocks` associa nós de dados, threads e instâncias de blocos de kernel `NDB`.

A tabela `threadblocks` contém as seguintes colunas:

- `node_id`

  ID do nó

- `thr_no`

  ID do fio

- `nome_do_bloco`

  Nome do bloco

- `block_instance`

  Número de instância bloqueado

##### Notas

O valor do `block_name` nesta tabela é um dos valores encontrados na coluna `block_name` ao selecionar a partir da tabela `ndbinfo.blocks`. Embora a lista de valores possíveis seja estática para uma determinada versão do NDB Cluster, a lista pode variar entre as versões.

A coluna `block_instance` fornece o número da instância de bloco do kernel.
