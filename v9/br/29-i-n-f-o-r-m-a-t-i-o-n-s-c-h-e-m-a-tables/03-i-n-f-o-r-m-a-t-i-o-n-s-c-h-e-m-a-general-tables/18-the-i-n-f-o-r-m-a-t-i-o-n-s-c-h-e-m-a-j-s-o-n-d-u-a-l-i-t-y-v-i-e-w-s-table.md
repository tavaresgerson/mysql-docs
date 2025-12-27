### 28.3.18 A Tabela JSON_DUALITY_VIEWS do ESQUEMA DE INFORMAÇÃO

A tabela `JSON_DUALITY_VIEWS` fornece informações sobre as visualizações de dualidade JSON acessíveis pelo usuário atual. Há uma linha nesta tabela para cada uma dessas visualizações.

A tabela `JSON_DUALITY_VIEWS` contém as colunas listadas aqui:

* `TABLE_CATALOG`

  Catalog da visualização; este é sempre `def`.

* `TABLE_SCHEMA`

  Esquema da visualização.

* `TABLE_NAME`

  Nome da visualização.

* `DEFINER`

  Usuário que criou a visualização.

* `SECURITY_TYPE`

  Um dos valores `INVOKER` ou `DEFINER`.

* `JSON_COLUMN_NAME`

  Este é sempre `data`.

* `ROOT_TABLE_CATALOG`

  Catalog da tabela raiz; este é sempre `def`.

* `ROOT_TABLE_SCHEMA`

  Esquema da tabela raiz.

* `ROOT_TABLE_NAME`

  Nome da tabela raiz.

* `ALLOW_INSERT`

  `1` se as inserções são permitidas, caso contrário `0`.

* `ALLOW_UPDATE`

  `1` se as atualizações são permitidas, caso contrário `0`.

* `ALLOW_DELETE`

  `1` se as exclusões são permitidas, caso contrário `0`.

* `READ_ONLY`

  `1` se as inserções, atualizações ou exclusões não são permitidas, caso contrário `0`. (Em outras palavras, este é `1` apenas quando `ALLOW_INSERT`, `ALLOW_UPDATE` e `ALLOW_DELETE` são todos `0`.

* `STATUS`

  Um dos valores `valid` ou `invalid`.

O nome da tabela raiz e outras informações são exibidas apenas se o usuário tiver algum tipo de privilégio na tabela raiz; o usuário também deve ter privilégios de `SHOW VIEW` e `SELECT` na visualização.