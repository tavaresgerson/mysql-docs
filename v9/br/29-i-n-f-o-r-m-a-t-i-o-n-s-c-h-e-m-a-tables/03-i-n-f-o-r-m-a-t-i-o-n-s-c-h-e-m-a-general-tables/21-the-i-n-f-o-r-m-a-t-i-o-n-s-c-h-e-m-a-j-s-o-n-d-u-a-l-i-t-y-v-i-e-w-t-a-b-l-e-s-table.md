### 28.3.21 A Tabela JSON_DUALITY_VIEW_TABLES do ESQUEMA DE INFORMAÇÃO

A tabela `JSON_DUALITY_VIEW_TABLES` exibe informações sobre todas as tabelas referenciadas por qualquer visualização de dualidade JSON que seja acessível pelo usuário atual. Esta tabela contém uma linha por referência de tabela.

A tabela `JSON_DUALITY_VIEW_TABLES` possui as colunas listadas aqui:

* `TABLE_CATALOG`

  Catalog do visualizador; este é sempre `def`.

* `TABLE_SCHEMA`

  Esquema do visualizador.

* `TABLE_NAME`

  Nome do visualizador.

* `REFERENCED_TABLE_CATALOG`

  Catalog da tabela; este é sempre `def`.

* `REFERENCED_TABLE_SCHEMA`

  Esquema da tabela.

* `REFERENCED_TABLE_NAME`

  Nome da tabela.

* `WHERE_CLAUSE`

  Expressão usada na cláusula `WHERE`.

* `ALLOW_INSERT`

  `1` se as inserções são permitidas, caso contrário `0`.

* `ALLOW_UPDATE`

  `1` se as atualizações são permitidas, caso contrário `0`.

* `ALLOW_DELETE`

  `1` se as exclusões são permitidas, caso contrário `0`.

* `READ_ONLY`

  `1` se as inserções, atualizações ou exclusões não são permitidas, caso contrário `0`. (Em outras palavras, isso é `1` apenas quando `ALLOW_INSERT`, `ALLOW_UPDATE` e `ALLOW_DELETE` são todos `0`.

* `IS_ROOT_TABLE`

  `1` se esta é a tabela raiz, caso contrário `0`.

* `REFERENCED_TABLE_ID`

  ID único da tabela dentro desta visualização.

* `REFERENCED_TABLE_PARENT_ID`

  ID da tabela pai.

* `REFERENCED_TABLE_PARENT_RELATIONSHIP`

  Um dos `nested` (arrays) ou `singleton` (caso contrário).