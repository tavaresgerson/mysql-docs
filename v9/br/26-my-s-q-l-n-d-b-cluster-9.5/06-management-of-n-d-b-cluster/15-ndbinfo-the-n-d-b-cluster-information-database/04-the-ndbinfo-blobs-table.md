#### 25.6.15.4 Tabela de blobs ndbinfo

Esta tabela fornece informações sobre os valores de blobs armazenados no `NDB`. A tabela `blobs` possui as colunas listadas aqui:

* `table_id`

  ID único da tabela que contém a coluna

* `database_name`

  Nome do banco de dados em que a tabela reside

* `table_name`

  Nome da tabela

* `column_id`

  ID único da coluna dentro da tabela

* `column_name`

  Nome da coluna

* `inline_size`

  Tamanho em linha da coluna

* `part_size`

  Tamanho de parte da coluna

* `stripe_size`

  Tamanho de faixas da coluna

* `blob_table_name`

  Nome da tabela de blobs que contém os dados de blob da coluna, se houver

Existem linhas nesta tabela para as colunas da tabela `NDB` que armazenam valores `BLOB`, `TEXT` que ocupam mais de 255 bytes e, portanto, requerem o uso de uma tabela de blobs. Parte dos valores `JSON` que excedem 4000 bytes de tamanho também são armazenados nesta tabela. Para obter mais informações sobre como o NDB Cluster armazena colunas desse tipo, consulte Requisitos de Armazenamento de Tipo de Caractere.

Os tamanhos de parte e em linha das colunas de blobs `NDB` podem ser definidos usando as instruções `CREATE TABLE` e `ALTER TABLE` contendo comentários de coluna da tabela `NDB` (consulte Opções de Coluna NDB); isso também pode ser feito em aplicações da API NDB (consulte `Column::setPartSize()` e `setInlineSize()`).