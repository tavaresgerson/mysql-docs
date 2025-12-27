### 28.3.19 A Tabela JSON_DUALITY_VIEW_COLUMNS do ESQUEMA DE INFORMAÇÃO

A tabela `JSON_DUALITY_VIEW_COLUMNS` exibe informações sobre todas as colunas referenciadas por qualquer visualização de dualidade JSON que seja acessível pelo usuário atual. Há uma linha por referência de tabela.

A tabela `JSON_DUALITY_VIEW_COLUMNS` possui as seguintes colunas:

* `TABLE_CATALOG`

  Catalog do visualizador; este é sempre `def`.

* `TABLE_SCHEMA`

  Esquema do visualizador.

* `TABLE_NAME`

  Nome do visualizador.

* `REFERENCED_TABLE_CATALOG`

  Catalog da tabela; sempre `def`.

* `REFERENCED_TABLE_SCHEMA`

  Esquema da tabela.

* `REFERENCED_TABLE_NAME`

  Nome da tabela.

* `IS_ROOT_TABLE`

  `1` se esta for a tabela raiz, caso contrário `0`.

* `REFERENCED_TABLE_ID`

  ID único da tabela dentro desta visualização.

* `REFERENCED_TABLE_COLUMN_NAME`

  Nome da coluna.

* `JSON_KEY_NAME`

  Nome da chave JSON.

* `ALLOW_INSERT`

  `1` se as inserções são permitidas, caso contrário `0`.

* `ALLOW_UPDATE`

  `1` se as atualizações são permitidas, caso contrário `0`.

* `ALLOW_DELETE`

  `1` se as exclusões são permitidas, caso contrário `0`.

* `READ_ONLY`

  `1` se as inserções, atualizações ou exclusões não são permitidas, caso contrário `0`. (Em outras palavras, isso é `1` apenas quando `ALLOW_INSERT`, `ALLOW_UPDATE` e `ALLOW_DELETE` são todos `0`.