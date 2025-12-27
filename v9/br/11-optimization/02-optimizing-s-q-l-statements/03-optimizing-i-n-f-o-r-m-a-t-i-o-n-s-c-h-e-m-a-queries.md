### 10.2.3 Otimizando Consultas do INFORMATION_SCHEMA

Aplicações que monitoram bancos de dados podem fazer uso frequente das tabelas do `INFORMATION_SCHEMA`. Para escrever consultas para essas tabelas de forma mais eficiente, use as seguintes diretrizes gerais:

* Tente consultar apenas as tabelas do `INFORMATION_SCHEMA` que são vistas em tabelas do dicionário de dados.

* Tente consultar apenas para metadados estáticos. Selecionar colunas ou usar condições de recuperação para metadados dinâmicos juntamente com metadados estáticos adiciona sobrecarga ao processamento dos metadados dinâmicos.

Observação

O comportamento de comparação para nomes de banco de dados e tabelas nas consultas do `INFORMATION_SCHEMA` pode diferir do que você espera. Para detalhes, consulte a Seção 12.8.7, “Usando Colagem em Pesquisas do INFORMATION_SCHEMA”.

Essas tabelas do `INFORMATION_SCHEMA` são implementadas como vistas em tabelas do dicionário de dados, então as consultas nelas recuperam informações do dicionário de dados:

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

Alguns tipos de valores, mesmo para uma tabela do `INFORMATION_SCHEMA` que não é uma vista, são recuperados por buscas no dicionário de dados. Isso inclui valores como nomes de banco de dados e tabelas, tipos de tabelas e motores de armazenamento.

Algumas tabelas do `INFORMATION_SCHEMA` contêm colunas que fornecem estatísticas da tabela:

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

Essas colunas representam metadados dinâmicos da tabela; ou seja, informações que mudam à medida que o conteúdo da tabela muda.

Por padrão, o MySQL recupera valores armazenados em cache para essas colunas das tabelas `mysql.index_stats` e `mysql.innodb_table_stats` quando as colunas são consultadas, o que é mais eficiente do que recuperar estatísticas diretamente do mecanismo de armazenamento. Se as estatísticas armazenadas em cache não estiverem disponíveis ou tiverem expirado, o MySQL recupera as estatísticas mais recentes do mecanismo de armazenamento e as armazena nas tabelas `mysql.index_stats` e `mysql.innodb_table_stats`. Consultas subsequentes recuperam as estatísticas armazenadas em cache até que as estatísticas armazenadas em cache expirem. Uma reinicialização do servidor ou a primeira abertura das tabelas `mysql.index_stats` e `mysql.innodb_table_stats` não atualizam automaticamente as estatísticas armazenadas em cache.

A variável de sessão `information_schema_stats_expiry` define o período de tempo antes que as estatísticas armazenadas em cache expirem. O padrão é de 86400 segundos (24 horas), mas o período de tempo pode ser estendido para até um ano.

Para atualizar valores armazenados em cache a qualquer momento para uma determinada tabela, use `ANALYZE TABLE`.

A consulta de estatísticas não armazena ou atualiza estatísticas nas tabelas `mysql.index_stats` e `mysql.innodb_table_stats` em circunstâncias como:

* Quando as estatísticas armazenadas em cache não expiraram.
* Quando `information_schema_stats_expiry` está definido como 0.

* Quando o servidor está no modo `read_only`, `super_read_only`, `transaction_read_only` ou `innodb_read_only`.

* Quando a consulta também recupera dados do Schema de Desempenho.

`information_schema_stats_expiry` é uma variável de sessão, e cada sessão do cliente pode definir seu próprio valor de expiração. Estatísticas recuperadas do mecanismo de armazenamento e armazenadas em cache por uma sessão estão disponíveis para outras sessões.

Nota

Se a variável de sistema `innodb_read_only` estiver habilitada, a operação `ANALYZE TABLE` pode falhar porque não consegue atualizar as tabelas de estatísticas no dicionário de dados, que usam o `InnoDB`. Para operações `ANALYZE TABLE` que atualizam a distribuição de chaves, a falha pode ocorrer mesmo se a operação atualizar a própria tabela (por exemplo, se for uma tabela `MyISAM`). Para obter as estatísticas de distribuição atualizadas, defina `information_schema_stats_expiry=0`.

Para tabelas do `INFORMATION_SCHEMA` implementadas como visualizações em tabelas do dicionário de dados, os índices nas tabelas do dicionário de dados subjacentes permitem que o otimizador construa planos de execução de consultas eficientes. Para ver as escolhas feitas pelo otimizador, use `EXPLAIN`. Para ver também a consulta usada pelo servidor para executar uma consulta do `INFORMATION_SCHEMA`, use `SHOW WARNINGS` imediatamente após `EXPLAIN`.

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

Como indicado pelo `SHOW WARNINGS`, o servidor processa a consulta sobre `COLLATION_CHARACTER_SET_APPLICABILITY` como uma consulta nas tabelas `character_sets` e `collations` do dicionário de dados no banco de dados `mysql` do sistema.