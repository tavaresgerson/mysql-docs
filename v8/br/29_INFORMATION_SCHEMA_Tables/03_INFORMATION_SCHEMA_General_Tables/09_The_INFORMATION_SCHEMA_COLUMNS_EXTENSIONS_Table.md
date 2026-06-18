### 28.3.9 A tabela INFORMATION\_SCHEMA COLUMNS\_EXTENSIONS

A tabela `COLUMNS_EXTENSIONS` (disponível a partir do MySQL 8.0.21) fornece informações sobre os atributos das colunas definidos para os motores de armazenamento primário e secundário.

Nota

A tabela `COLUMNS_EXTENSIONS` está reservada para uso futuro.

A tabela `COLUMNS_EXTENSIONS` tem essas colunas:

- `TABLE_CATALOG`

  O nome do catálogo ao qual a tabela pertence. Esse valor é sempre `def`.

- `TABLE_SCHEMA`

  O nome do esquema (banco de dados) ao qual a tabela pertence.

- `TABLE_NAME`

  O nome da tabela.

- `COLUMN_NAME`

  O nome da coluna.

- `ENGINE_ATTRIBUTE`

  Atributos da coluna definidos para o motor de armazenamento primário. Reservado para uso futuro.

- `SECONDARY_ENGINE_ATTRIBUTE`

  Atributos da coluna definidos para o motor de armazenamento secundário. Reservado para uso futuro.
