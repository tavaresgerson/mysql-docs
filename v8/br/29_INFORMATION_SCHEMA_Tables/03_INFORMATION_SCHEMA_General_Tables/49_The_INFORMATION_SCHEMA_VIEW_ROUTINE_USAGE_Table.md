### 28.3.49 A tabela INFORMATION\_SCHEMA VIEW\_ROUTINE\_USAGE

A tabela `VIEW_ROUTINE_USAGE` (disponível a partir do MySQL 8.0.13) fornece acesso a informações sobre funções armazenadas usadas em definições de visualizações. A tabela não lista informações sobre funções integradas (nativas) ou funções carregáveis usadas nas definições.

Você pode ver informações apenas para visualizações para as quais você tenha algum privilégio e apenas para funções para as quais você tenha algum privilégio.

A tabela `VIEW_ROUTINE_USAGE` tem essas colunas:

- `TABLE_CATALOG`

  O nome do catálogo ao qual a visualização pertence. Esse valor é sempre `def`.

- `TABLE_SCHEMA`

  O nome do esquema (banco de dados) ao qual a visualização pertence.

- `TABLE_NAME`

  O nome da vista.

- `SPECIFIC_CATALOG`

  O nome do catálogo ao qual a função usada na definição da visualização pertence. Esse valor é sempre `def`.

- `SPECIFIC_SCHEMA`

  O nome do esquema (banco de dados) ao qual a função usada na definição da visualização pertence.

- `SPECIFIC_NAME`

  O nome da função usada na definição da visualização.
