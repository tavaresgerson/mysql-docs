### 28.3.45 A tabela INFORMATION_SCHEMA TABLES_EXTENSIONS

A tabela `TABLES_EXTENSIONS` fornece informações sobre os atributos das tabelas definidos para os motores de armazenamento primário e secundário.

Observação

A tabela `TABLES_EXTENSIONS` está reservada para uso futuro.

A tabela `TABLES_EXTENSIONS` tem as seguintes colunas:

* `TABLE_CATALOG`

  O nome do catálogo ao qual a tabela pertence. Esse valor é sempre `def`.

* `TABLE_SCHEMA`

  O nome do esquema (banco de dados) ao qual a tabela pertence.

* `TABLE_NAME`

  O nome da tabela.

* `ENGINE_ATTRIBUTE`

  Atributos da tabela definidos para o motor de armazenamento primário. Reservado para uso futuro.

* `SECONDARY_ENGINE_ATTRIBUTE`

  Atributos da tabela definidos para o motor de armazenamento secundário. Reservado para uso futuro.