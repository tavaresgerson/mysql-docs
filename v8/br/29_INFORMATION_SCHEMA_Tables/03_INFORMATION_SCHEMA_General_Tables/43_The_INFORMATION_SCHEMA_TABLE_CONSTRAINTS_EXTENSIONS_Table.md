### 28.3.43 A tabela INFORMATION\_SCHEMA TABLE\_CONSTRAINTS\_EXTENSIONS

A tabela `TABLE_CONSTRAINTS_EXTENSIONS` (disponível a partir do MySQL 8.0.21) fornece informações sobre os atributos das restrições de tabela definidos para os motores de armazenamento primário e secundário.

Nota

A tabela `TABLE_CONSTRAINTS_EXTENSIONS` está reservada para uso futuro.

A tabela `TABLE_CONSTRAINTS_EXTENSIONS` tem essas colunas:

- `CONSTRAINT_CATALOG`

  O nome do catálogo ao qual a tabela pertence.

- `CONSTRAINT_SCHEMA`

  O nome do esquema (banco de dados) ao qual a tabela pertence.

- `CONSTRAINT_NAME`

  O nome da restrição.

- `TABLE_NAME`

  O nome da tabela.

- `ENGINE_ATTRIBUTE`

  Atributos de restrição definidos para o motor de armazenamento primário. Reservado para uso futuro.

- `SECONDARY_ENGINE_ATTRIBUTE`

  Atributos de restrição definidos para o motor de armazenamento secundário. Reservado para uso futuro.
