### 10.2.3 Otimizando consultas do INFORMATION\_SCHEMA

Aplicações que monitoram bancos de dados podem fazer uso frequente das tabelas `INFORMATION_SCHEMA`. Para escrever consultas para essas tabelas de forma mais eficiente, use as seguintes diretrizes gerais:

- Tente consultar apenas as tabelas `INFORMATION_SCHEMA` que são visualizações de tabelas do dicionário de dados.

- Tente consultar apenas os metadados estáticos. Selecionar colunas ou usar condições de recuperação para metadados dinâmicos, juntamente com metadados estáticos, adiciona um overhead ao processamento dos metadados dinâmicos.

Nota

O comportamento de comparação para nomes de banco de dados e tabelas em consultas do `INFORMATION_SCHEMA` pode diferir do que você espera. Para obter detalhes, consulte a Seção 12.8.7, “Usando a Cotação em Pesquisas do INFORMATION\_SCHEMA”.

Essas tabelas `INFORMATION_SCHEMA` são implementadas como visualizações em tabelas do dicionário de dados, portanto, as consultas sobre elas obtêm informações do dicionário de dados:

```
CHARACTER_SETS
CHECK_CONSTRAINTS
COLLATIONS
COLLATION_CHARACTER_SET_APPLICABILITY
COLUMNS
EVENTS
FILES
INNODB_COLUMNS
INNODB_DATAFILES
INNODB_FIELDS
INNODB_FOREIGN
INNODB_FOREIGN_COLS
INNODB_INDEXES
INNODB_TABLES
INNODB_TABLESPACES
INNODB_TABLESPACES_BRIEF
INNODB_TABLESTATS
KEY_COLUMN_USAGE
PARAMETERS
PARTITIONS
REFERENTIAL_CONSTRAINTS
RESOURCE_GROUPS
ROUTINES
SCHEMATA
STATISTICS
TABLES
TABLE_CONSTRAINTS
TRIGGERS
VIEWS
VIEW_ROUTINE_USAGE
VIEW_TABLE_USAGE
```

Alguns tipos de valores, mesmo para uma tabela não visualizada `INFORMATION_SCHEMA`, são recuperados por meio de consultas no dicionário de dados. Isso inclui nomes de banco de dados e tabelas, tipos de tabela e motores de armazenamento.

Algumas tabelas `INFORMATION_SCHEMA` contêm colunas que fornecem estatísticas da tabela:

```
STATISTICS.CARDINALITY
TABLES.AUTO_INCREMENT
TABLES.AVG_ROW_LENGTH
TABLES.CHECKSUM
TABLES.CHECK_TIME
TABLES.CREATE_TIME
TABLES.DATA_FREE
TABLES.DATA_LENGTH
TABLES.INDEX_LENGTH
TABLES.MAX_DATA_LENGTH
TABLES.TABLE_ROWS
TABLES.UPDATE_TIME
```

Essas colunas representam metadados dinâmicos da tabela; ou seja, informações que mudam conforme o conteúdo da tabela muda.

Por padrão, o MySQL recupera valores armazenados em cache para essas colunas das tabelas de dicionário `mysql.index_stats` e `mysql.innodb_table_stats` quando as colunas são consultadas, o que é mais eficiente do que recuperar estatísticas diretamente do mecanismo de armazenamento. Se as estatísticas armazenadas em cache não estiverem disponíveis ou tiverem expirado, o MySQL recupera as estatísticas mais recentes do mecanismo de armazenamento e as armazena nas tabelas de dicionário `mysql.index_stats` e `mysql.innodb_table_stats`. Consultas subsequentes recuperam as estatísticas armazenadas em cache até que as estatísticas armazenadas em cache expirem. Uma reinicialização do servidor ou a primeira abertura das tabelas `mysql.index_stats` e `mysql.innodb_table_stats` não atualizam automaticamente as estatísticas armazenadas em cache.

A variável de sessão `information_schema_stats_expiry` define o período de tempo antes que as estatísticas armazenadas em cache expiram. O valor padrão é de 86400 segundos (24 horas), mas o período de tempo pode ser estendido por até um ano.

Para atualizar os valores armazenados em cache a qualquer momento para uma tabela específica, use `ANALYZE TABLE`.

A consulta de colunas de estatísticas não armazena nem atualiza estatísticas nas tabelas de dicionário `mysql.index_stats` e `mysql.innodb_table_stats` nessas circunstâncias:

- Quando as estatísticas armazenadas em cache não expiraram.

- Quando `information_schema_stats_expiry` estiver definido como 0.

- Quando o servidor estiver no modo `read_only`, `super_read_only`, `transaction_read_only` ou `innodb_read_only`.

- Quando a consulta também recupera dados do Gerenciamento de Desempenho.

`information_schema_stats_expiry` é uma variável de sessão, e cada sessão de cliente pode definir seu próprio valor de expiração. Estatísticas recuperadas do motor de armazenamento e armazenadas em cache por uma sessão estão disponíveis para outras sessões.

Nota

Se a variável de sistema `innodb_read_only` estiver habilitada, o `ANALYZE TABLE` pode falhar porque ele não pode atualizar as tabelas de estatísticas no dicionário de dados, que usam `InnoDB`. Para operações `ANALYZE TABLE` que atualizam a distribuição de chaves, o erro pode ocorrer mesmo se a operação atualizar a própria tabela (por exemplo, se for uma tabela `MyISAM`). Para obter as estatísticas de distribuição atualizadas, defina `information_schema_stats_expiry=0`.

Para tabelas `INFORMATION_SCHEMA` implementadas como visualizações em tabelas do dicionário de dados, índices nas tabelas subjacentes do dicionário de dados permitem que o otimizador construa planos de execução de consultas eficientes. Para ver as escolhas feitas pelo otimizador, use `EXPLAIN`. Para ver também a consulta usada pelo servidor para executar uma consulta `INFORMATION_SCHEMA`, use `SHOW WARNINGS` imediatamente após `EXPLAIN`.

Considere esta declaração, que identifica as collation para o conjunto de caracteres `utf8mb4`:

```
mysql> SELECT COLLATION_NAME
       FROM INFORMATION_SCHEMA.COLLATION_CHARACTER_SET_APPLICABILITY
       WHERE CHARACTER_SET_NAME = 'utf8mb4';
+----------------------------+
| COLLATION_NAME             |
+----------------------------+
| utf8mb4_general_ci         |
| utf8mb4_bin                |
| utf8mb4_unicode_ci         |
| utf8mb4_icelandic_ci       |
| utf8mb4_latvian_ci         |
| utf8mb4_romanian_ci        |
| utf8mb4_slovenian_ci       |
...
```

Como o servidor processa essa declaração? Para descobrir, use `EXPLAIN`:

```
mysql> EXPLAIN SELECT COLLATION_NAME
       FROM INFORMATION_SCHEMA.COLLATION_CHARACTER_SET_APPLICABILITY
       WHERE CHARACTER_SET_NAME = 'utf8mb4'\G
*************************** 1. row ***************************
           id: 1
  select_type: SIMPLE
        table: cs
   partitions: NULL
         type: const
possible_keys: PRIMARY,name
          key: name
      key_len: 194
          ref: const
         rows: 1
     filtered: 100.00
        Extra: Using index
*************************** 2. row ***************************
           id: 1
  select_type: SIMPLE
        table: col
   partitions: NULL
         type: ref
possible_keys: character_set_id
          key: character_set_id
      key_len: 8
          ref: const
         rows: 68
     filtered: 100.00
        Extra: NULL
2 rows in set, 1 warning (0.01 sec)
```

Para ver a consulta usada para satisfazer essa declaração, use `SHOW WARNINGS`:

```
mysql> SHOW WARNINGS\G
*************************** 1. row ***************************
  Level: Note
   Code: 1003
Message: /* select#1 */ select `mysql`.`col`.`name` AS `COLLATION_NAME`
         from `mysql`.`character_sets` `cs`
         join `mysql`.`collations` `col`
         where ((`mysql`.`col`.`character_set_id` = '45')
         and ('utf8mb4' = 'utf8mb4'))
```

Como indicado pelo `SHOW WARNINGS`, o servidor processa a consulta em `COLLATION_CHARACTER_SET_APPLICABILITY` como uma consulta nas tabelas do dicionário de dados `character_sets` e `collations` no banco de dados do sistema `mysql`.
