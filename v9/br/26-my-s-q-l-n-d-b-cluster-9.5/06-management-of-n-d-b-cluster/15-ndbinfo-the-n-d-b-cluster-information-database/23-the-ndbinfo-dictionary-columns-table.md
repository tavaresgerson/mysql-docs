#### 25.6.15.23 A tabela ndbinfo dictionary_columns

A tabela fornece informações do dicionário `NDB` sobre as colunas das tabelas `NDB`. `dictionary_columns` tem as colunas listadas aqui (com descrições breves):

* `table_id`

  ID da tabela que contém a coluna

* `column_id`

  ID único da coluna

* `name`

  Nome da coluna

* `column_type`

  Tipo de dados da coluna da API NDB; consulte Column::Type, para valores possíveis

* `default_value`

  Valor padrão da coluna, se houver

* `nullable`

  `NULL` ou `NOT NULL`

* `array_type`

  Formato de armazenamento de atributo interno da coluna; um dos `FIXED`, `SHORT_VAR` ou `MEDIUM_VAR`; para mais informações, consulte Column::ArrayType, na documentação da API NDB

* `storage_type`

  Tipo de armazenamento usado pela tabela; `MEMORY` ou `DISK`

* `primary_key`

  `1` se esta for uma coluna de chave primária, caso contrário `0`

* `partition_key`

  `1` se esta for uma coluna de chave de partição, caso contrário `0`

* `dynamic`

  `1` se a coluna for dinâmica, caso contrário `0`

* `auto_inc`

  `1` se esta for uma coluna `AUTO_INCREMENT`, caso contrário `0`

Você pode obter informações sobre todas as colunas de uma tabela específica, juntando `dictionary_columns` com a tabela `dictionary_tables`, assim:

```
SELECT dc.*
  FROM dictionary_columns dc
JOIN dictionary_tables dt
  ON dc.table_id=dt.table_id
WHERE dt.table_name='t1'
  AND dt.database_name='mydb';
```

Nota

Colunas de blob não são mostradas nesta tabela. Este é um problema conhecido.