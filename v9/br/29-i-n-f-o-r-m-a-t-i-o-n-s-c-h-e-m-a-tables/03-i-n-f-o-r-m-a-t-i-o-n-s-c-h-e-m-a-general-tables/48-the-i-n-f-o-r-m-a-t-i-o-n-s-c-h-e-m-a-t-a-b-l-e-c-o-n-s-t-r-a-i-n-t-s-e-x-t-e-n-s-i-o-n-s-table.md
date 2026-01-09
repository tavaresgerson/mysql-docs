### 28.3.48 A tabela TABLE_CONSTRAINTS_EXTENSIONS da tabela INFORMATION_SCHEMA

A tabela `TABLE_CONSTRAINTS_EXTENSIONS` fornece informações sobre os atributos de restrições de tabela definidos para os motores de armazenamento primário e secundário.

Observação

A tabela `TABLE_CONSTRAINTS_EXTENSIONS` está reservada para uso futuro.

A tabela `TABLE_CONSTRAINTS_EXTENSIONS` possui as seguintes colunas:

* `CONSTRAINT_CATALOG`

  O nome do catálogo ao qual a tabela pertence.

* `CONSTRAINT_SCHEMA`

  O nome do esquema (banco de dados) ao qual a tabela pertence.

* `CONSTRAINT_NAME`

  O nome da restrição.

* `TABLE_NAME`

  O nome da tabela.

* `ENGINE_ATTRIBUTE`

  Atributos de restrição definidos para o motor de armazenamento primário. Reservado para uso futuro.

* `SECONDARY_ENGINE_ATTRIBUTE`

  Atributos de restrição definidos para o motor de armazenamento secundário. Reservado para uso futuro.