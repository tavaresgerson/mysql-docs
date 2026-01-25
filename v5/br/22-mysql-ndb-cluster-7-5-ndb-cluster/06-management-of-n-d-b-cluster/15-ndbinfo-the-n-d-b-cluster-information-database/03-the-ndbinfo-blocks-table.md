#### 21.6.15.3 A Tabela ndbinfo blocks

A tabela `blocks` é uma tabela estática que simplesmente contém os nomes e IDs internos de todos os NDB kernel blocks (consulte [NDB Kernel Blocks](/doc/ndb-internals/en/ndb-internals-kernel-blocks.html)). Ela é usada pelas outras tabelas ([`ndbinfo`](mysql-cluster-ndbinfo.html "21.6.15 ndbinfo: The NDB Cluster Information Database")) (a maioria das quais são, na verdade, views) para mapear números de block para nomes de block, a fim de produzir output legível por humanos.

A tabela `blocks` contém as seguintes colunas:

* `block_number`

  Número do Block

* `block_name`

  Nome do Block

##### Notas

Para obter uma lista de todos os nomes de block, basta executar `SELECT block_name FROM ndbinfo.blocks`. Embora esta seja uma tabela estática, seu conteúdo pode variar entre diferentes releases do NDB Cluster.