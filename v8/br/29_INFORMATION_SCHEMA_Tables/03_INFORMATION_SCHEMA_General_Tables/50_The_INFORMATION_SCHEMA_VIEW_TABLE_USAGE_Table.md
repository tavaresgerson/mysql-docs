### 28.3.50 A tabela INFORMATION\_SCHEMA VIEW\_TABLE\_USAGE

A tabela `VIEW_TABLE_USAGE` (disponível a partir do MySQL 8.0.13) fornece acesso a informações sobre as tabelas e visualizações usadas nas definições de visualizações.

Você pode ver informações apenas para visualizações para as quais você tenha algum privilégio e apenas para tabelas para as quais você tenha algum privilégio.

A tabela `VIEW_TABLE_USAGE` tem essas colunas:

- `VIEW_CATALOG`

  O nome do catálogo ao qual a visualização pertence. Esse valor é sempre `def`.

- `VIEW_SCHEMA`

  O nome do esquema (banco de dados) ao qual a visualização pertence.

- `VIEW_NAME`

  O nome da vista.

- `TABLE_CATALOG`

  O nome do catálogo ao qual a tabela ou a visão utilizada na definição da visão pertence. Esse valor é sempre `def`.

- `TABLE_SCHEMA`

  O nome do esquema (banco de dados) ao qual a tabela ou a visão utilizada na definição da visão pertence.

- `TABLE_NAME`

  O nome da tabela ou da visualização usada na definição da visualização.
