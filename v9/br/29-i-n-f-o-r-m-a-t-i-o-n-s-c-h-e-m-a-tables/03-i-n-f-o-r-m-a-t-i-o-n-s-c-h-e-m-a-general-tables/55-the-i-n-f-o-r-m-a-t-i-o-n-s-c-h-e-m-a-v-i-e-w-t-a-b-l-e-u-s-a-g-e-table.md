### 28.3.55 A tabela INFORMATION_SCHEMA VIEW_TABLE_USAGE

A tabela `VIEW_TABLE_USAGE` fornece acesso a informações sobre tabelas e visualizações usadas nas definições de visualizações.

Você pode ver informações apenas para visualizações para as quais você tenha algum privilégio e apenas para tabelas para as quais você tenha algum privilégio.

A tabela `VIEW_TABLE_USAGE` tem as seguintes colunas:

* `VIEW_CATALOG`

  O nome do catálogo ao qual a visualização pertence. Esse valor é sempre `def`.

* `VIEW_SCHEMA`

  O nome do esquema (banco de dados) ao qual a visualização pertence.

* `VIEW_NAME`

  O nome da visualização.

* `TABLE_CATALOG`

  O nome do catálogo ao qual a tabela ou a visualização usada na definição da visualização pertence. Esse valor é sempre `def`.

* `TABLE_SCHEMA`

  O nome do esquema (banco de dados) ao qual a tabela ou a visualização usada na definição da visualização pertence.

* `TABLE_NAME`

  O nome da tabela ou da visualização usada na definição da visualização.