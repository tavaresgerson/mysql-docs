#### 25.6.16.5 Blocos ndbinfo da Tabela

A tabela `blocks` é uma tabela estática que contém simplesmente os nomes e os IDs internos de todos os blocos do kernel NDB (veja Blocos do Kernel NDB). Ela é usada pelas outras tabelas `ndbinfo` (a maioria das quais são, na verdade, visualizações) para mapear os números dos blocos aos nomes dos blocos para produzir saída legível para humanos.

A tabela `blocks` contém as seguintes colunas:

- `block_number`

  Número do bloco

- `block_name`

  Nome do bloco

##### Notas

Para obter uma lista de todos os nomes de blocos, basta executar `SELECT block_name FROM ndbinfo.blocks`. Embora seja uma tabela estática, seu conteúdo pode variar entre diferentes versões do NDB Cluster.
