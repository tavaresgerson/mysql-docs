#### 25.6.16.4 A tabela ndbinfo blobs

Esta tabela fornece informações sobre os valores de blob armazenados em `NDB`. A tabela `blobs` tem as colunas listadas aqui:

- `table_id`

  ID único da tabela que contém a coluna

- `database_name`

  Nome do banco de dados em que esta tabela reside

- `table_name`

  Nome da tabela

- `column_id`

  O ID único da coluna dentro da tabela

- `column_name`

  Nome da coluna

- `inline_size`

  Tamanho em linha da coluna

- `part_size`

  Tamanho da peça da coluna

- `stripe_size`

  Tamanho da faixa da coluna

- `blob_table_name`

  Nome da tabela blob que contém os dados blob desta coluna, se houver

Existem linhas nesta tabela para as colunas da tabela `NDB` que armazenam valores de `BLOB`, `TEXT` que ocupam mais de 255 bytes e, portanto, exigem o uso de uma tabela blob. Parte dos valores de `JSON` que excedem 4000 bytes também é armazenada nesta tabela. Para obter mais informações sobre como o NDB Cluster armazena colunas desse tipo, consulte Requisitos de Armazenamento de Tipo de Caractere.

As partes e os tamanhos em linha das colunas de blobs `NDB` (desde a versão 8.0.30 e versões posteriores) podem ser definidas usando as instruções `CREATE TABLE` e `ALTER TABLE`, que contêm comentários de colunas de tabela `NDB` (veja Opções de NDB\_COLUMN); isso também pode ser feito em aplicativos da API NDB (veja `Column::setPartSize()` e `setInlineSize()`).

A tabela `blobs` foi adicionada no NDB 8.0.29.
