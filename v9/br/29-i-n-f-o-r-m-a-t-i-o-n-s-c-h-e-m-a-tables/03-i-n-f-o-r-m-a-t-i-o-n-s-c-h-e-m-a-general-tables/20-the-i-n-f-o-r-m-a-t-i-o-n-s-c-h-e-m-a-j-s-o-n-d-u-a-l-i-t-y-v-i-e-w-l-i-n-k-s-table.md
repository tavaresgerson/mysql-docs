### 28.3.2.2 A Tabela JSON_DUALITY_VIEW_LINKS do ESQUEMA DE INFORMAÇÃO

A tabela `JSON_DUALITY_VIEW_LINKS` mostra informações sobre as relações entre as tabelas pai e filho para todos os visualizações acessíveis pelo usuário atual. Há uma linha por visualização.

A tabela `JSON_DUALITY_VIEW_LINKS` tem as colunas mostradas aqui:

* `TABLE_CATALOG`

  Catalog da visualização; este é sempre `def`.

* `TABLE_SCHEMA`

  Esquema da visualização.

* `TABLE_NAME`

  Nome da visualização.

* `PARENT_TABLE_CATALOG`

  Catalog do pai; este é sempre `def`.

* `PARENT_TABLE_SCHEMA`

  Esquema do pai.

* `PARENT_TABLE_NAME`

  Tabela do pai.

* `CHILD_TABLE_CATALOG`

  Catalog do filho; este é sempre `def`.

* `CHILD_TABLE_SCHEMA`

  Esquema do filho.

* `CHILD_TABLE_NAME`

  Tabela do filho.

* `PARENT_TABLE_COLUMN_NAME`

  Nome da coluna do pai.

* `CHILD_TABLE_COLUMN_NAME`

  Nome da coluna do filho.

* `JOIN_TYPE`

  Um dos `NESTED` ou `OUTER`.

* `JSON_KEY_NAME`

  Nome da chave JSON aplicável, se houver.