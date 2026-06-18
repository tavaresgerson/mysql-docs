#### 25.6.16.22 A tabela ndbinfo dictionary\_columns

A tabela fornece informações do dicionário `NDB` sobre as colunas das tabelas `NDB`. `dictionary_columns` tem as colunas listadas aqui (com descrições breves):

- `table_id`

  ID da tabela que contém a coluna

- `column_id`

  O ID único da coluna

- `name`

  Nome da coluna

- `column_type`

  Tipo de dados da coluna da API NDB; veja Column::Type, para valores possíveis

- `default_value`

  O valor padrão da coluna, se houver

- `nullable`

  Qualquer um dos `NULL` ou `NOT NULL`

- `array_type`

  O formato de armazenamento de atributos internos da coluna; um dos `FIXED`, `SHORT_VAR` ou `MEDIUM_VAR`; para mais informações, consulte Column::ArrayType, na documentação da API NDB

- `storage_type`

  Tipo de armazenamento utilizado pela tabela; `MEMORY` ou `DISK`

- `primary_key`

  `1` se esta for uma coluna de chave primária, caso contrário `0`

- `partition_key`

  `1` se esta for uma coluna de chave de partição, caso contrário `0`

- `dynamic`

  `1` se a coluna for dinâmica, caso contrário `0`

- `auto_inc`

  `1` se esta for uma coluna `AUTO_INCREMENT`, caso contrário `0`

Você pode obter informações sobre todas as colunas de uma tabela específica ao juntar `dictionary_columns` com a tabela `dictionary_tables`, da seguinte maneira:

```
SELECT dc.*
  FROM dictionary_columns dc
JOIN dictionary_tables dt
  ON dc.table_id=dt.table_id
WHERE dt.table_name='t1'
  AND dt.database_name='mydb';
```

A tabela `dictionary_columns` foi adicionada no NDB 8.0.29.

Nota

As colunas de Blob não são exibidas nesta tabela. Este é um problema conhecido.
