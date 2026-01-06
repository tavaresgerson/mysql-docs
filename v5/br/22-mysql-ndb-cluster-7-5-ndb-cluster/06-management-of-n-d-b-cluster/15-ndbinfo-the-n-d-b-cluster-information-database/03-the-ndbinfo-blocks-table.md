#### 21.6.15.3 Blocos ndbinfo da Tabela

A tabela `blocks` é uma tabela estática que contém simplesmente os nomes e os IDs internos de todos os blocos do kernel NDB (consulte NDB Kernel Blocks). Ela é usada pelas outras tabelas `ndbinfo` (a maioria das quais são, na verdade, visualizações) para mapear os números dos blocos aos nomes dos blocos para produzir saída legível pelo ser humano.

A tabela `blocks` contém as seguintes colunas:

- `número_de_bloco`

  Número do bloco

- `nome_do_bloco`

  Nome do bloco

##### Notas

Para obter uma lista de todos os nomes de blocos, execute simplesmente `SELECT block_name FROM ndbinfo.blocks`. Embora seja uma tabela estática, seu conteúdo pode variar entre diferentes versões do NDB Cluster.
