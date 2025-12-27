#### 15.1.24.9 Índices Secundários e Colunas Geradas

O `InnoDB` suporta índices secundários em colunas geradas virtuais. Outros tipos de índice não são suportados. Um índice secundário definido em uma coluna virtual é às vezes referido como um “índice virtual”.

Um índice secundário pode ser criado em uma ou mais colunas virtuais ou em uma combinação de colunas virtuais e colunas regulares ou colunas geradas armazenadas. Índices secundários que incluem colunas virtuais podem ser definidos como `UNIQUE`.

Quando um índice secundário é criado em uma coluna gerada virtual, os valores da coluna gerada são materializados nos registros do índice. Se o índice for um índice coberto (um que inclui todas as colunas recuperadas por uma consulta), os valores da coluna gerada são recuperados de valores materializados na estrutura do índice em vez de serem calculados “on the fly”.

Há custos de escrita adicionais a serem considerados ao usar um índice secundário em uma coluna virtual devido à computação realizada ao materializar os valores da coluna virtual nos registros do índice durante as operações `INSERT` e `UPDATE`. Mesmo com custos de escrita adicionais, índices secundários em colunas virtuais podem ser preferíveis a colunas *armazenadas* geradas, que são materializadas no índice agrupado, resultando em tabelas maiores que requerem mais espaço em disco e memória. Se um índice secundário não for definido em uma coluna virtual, há custos adicionais para leituras, pois os valores da coluna virtual devem ser calculados cada vez que a linha da coluna é examinada.

Os valores de uma coluna virtual indexada são registrados no MVCC (Multi-Version Concurrency Control) para evitar a recomputação desnecessária dos valores gerados da coluna durante o rollback ou durante uma operação de purga. O comprimento dos dados dos valores registrados é limitado pelo limite de chave de índice de 767 bytes para os formatos de linha `COMPACT` e `REDUNDANT`, e de 3072 bytes para os formatos de linha `DYNAMIC` e `COMPRESSED`.

Adicionar ou excluir um índice secundário em uma coluna virtual é uma operação in-place.

##### Indexação de uma Coluna Gerada para Fornecer um Índice de Coluna JSON

Como mencionado em outro lugar, as colunas `JSON` não podem ser indexadas diretamente. Para criar um índice que faça referência a uma coluna dessa forma indiretamente, você pode definir uma coluna gerada que extraia a informação que deve ser indexada, e então criar um índice na coluna gerada, como mostrado neste exemplo:

```
mysql> CREATE TABLE jemp (
    ->     c JSON,
    ->     g INT GENERATED ALWAYS AS (c->"$.id"),
    ->     INDEX i (g)
    -> );
Query OK, 0 rows affected (0.28 sec)

mysql> INSERT INTO jemp (c) VALUES
     >   ('{"id": "1", "name": "Fred"}'), ('{"id": "2", "name": "Wilma"}'),
     >   ('{"id": "3", "name": "Barney"}'), ('{"id": "4", "name": "Betty"}');
Query OK, 4 rows affected (0.04 sec)
Records: 4  Duplicates: 0  Warnings: 0

mysql> SELECT c->>"$.name" AS name
     >     FROM jemp WHERE g > 2;
+--------+
| name   |
+--------+
| Barney |
| Betty  |
+--------+
2 rows in set (0.00 sec)

mysql> EXPLAIN SELECT c->>"$.name" AS name
     >    FROM jemp WHERE g > 2\G
*************************** 1. row ***************************
           id: 1
  select_type: SIMPLE
        table: jemp
   partitions: NULL
         type: range
possible_keys: i
          key: i
      key_len: 5
          ref: NULL
         rows: 2
     filtered: 100.00
        Extra: Using where
1 row in set, 1 warning (0.00 sec)

mysql> SHOW WARNINGS\G
*************************** 1. row ***************************
  Level: Note
   Code: 1003
Message: /* select#1 */ select json_unquote(json_extract(`test`.`jemp`.`c`,'$.name'))
AS `name` from `test`.`jemp` where (`test`.`jemp`.`g` > 2)
1 row in set (0.00 sec)
```

(Nós envolvemos a saída da última declaração neste exemplo para caber na área de visualização.)

Quando você usa `EXPLAIN` em uma `SELECT` ou em outra instrução SQL que contenha uma ou mais expressões que usam o operador `->` ou `->>` (em português, `->` ou `->>`), essas expressões são traduzidas para seus equivalentes usando `JSON_EXTRACT()` e (se necessário) `JSON_UNQUOTE()` em vez disso, como mostrado aqui na saída de `SHOW WARNINGS` imediatamente após essa declaração `EXPLAIN`:

```
mysql> EXPLAIN SELECT c->>"$.name"
     > FROM jemp WHERE g > 2 ORDER BY c->"$.name"\G
*************************** 1. row ***************************
           id: 1
  select_type: SIMPLE
        table: jemp
   partitions: NULL
         type: range
possible_keys: i
          key: i
      key_len: 5
          ref: NULL
         rows: 2
     filtered: 100.00
        Extra: Using where; Using filesort
1 row in set, 1 warning (0.00 sec)

mysql> SHOW WARNINGS\G
*************************** 1. row ***************************
  Level: Note
   Code: 1003
Message: /* select#1 */ select json_unquote(json_extract(`test`.`jemp`.`c`,'$.name')) AS
`c->>"$.name"` from `test`.`jemp` where (`test`.`jemp`.`g` > 2) order by
json_extract(`test`.`jemp`.`c`,'$.name')
1 row in set (0.00 sec)
```

Veja as descrições dos operadores `->` e `->>`, bem como as das funções `JSON_EXTRACT()` e `JSON_UNQUOTE()`, para obter informações e exemplos adicionais.

Essa técnica também pode ser usada para fornecer índices que fazem referência indiretamente a colunas de outros tipos que não podem ser indexadas diretamente, como as colunas `GEOMETRY`.

Também é possível criar um índice em uma coluna `JSON` usando a função `JSON_VALUE()` com uma expressão que pode ser usada para otimizar consultas que utilizam a expressão. Veja a descrição dessa função para obter mais informações e exemplos.

###### Colunas `JSON` e indexação indireta no NDB Cluster

Também é possível usar a indexação indireta de colunas `JSON` no MySQL NDB Cluster, sujeito às seguintes condições:

1. O `NDB` lida internamente o valor de uma coluna `JSON` como um `BLOB`. Isso significa que qualquer tabela `NDB` que tenha uma ou mais colunas `JSON` deve ter uma chave primária, caso contrário, não pode ser registrada no log binário.

2. O mecanismo de armazenamento `NDB` não suporta indexação de colunas virtuais. Como o padrão para colunas geradas é `VIRTUAL`, você deve especificar explicitamente a coluna gerada para a qual aplicar o índice indireto como `STORED`.

A declaração `CREATE TABLE` usada para criar a tabela `jempn` mostrada aqui é uma versão da tabela `jemp` mostrada anteriormente, com modificações que a tornam compatível com o `NDB`:

```
CREATE TABLE jempn (
  a BIGINT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  c JSON DEFAULT NULL,
  g INT GENERATED ALWAYS AS (c->"$.id") STORED,
  INDEX i (g)
) ENGINE=NDB;
```

Podemos preencher essa tabela usando a seguinte declaração `INSERT`:

```
INSERT INTO jempn (c) VALUES
  ('{"id": "1", "name": "Fred"}'),
  ('{"id": "2", "name": "Wilma"}'),
  ('{"id": "3", "name": "Barney"}'),
  ('{"id": "4", "name": "Betty"}');
```

Agora o `NDB` pode usar o índice `i`, como mostrado aqui:

```
mysql> EXPLAIN SELECT c->>"$.name" AS name
    ->           FROM jempn WHERE g > 2\G
*************************** 1. row ***************************
           id: 1
  select_type: SIMPLE
        table: jempn
   partitions: p0,p1,p2,p3
         type: range
possible_keys: i
          key: i
      key_len: 5
          ref: NULL
         rows: 3
     filtered: 100.00
        Extra: Using pushed condition (`test`.`jempn`.`g` > 2)
1 row in set, 1 warning (0.01 sec)

mysql> SHOW WARNINGS\G
*************************** 1. row ***************************
  Level: Note
   Code: 1003
Message: /* select#1 */ select
json_unquote(json_extract(`test`.`jempn`.`c`,'$.name')) AS `name` from
`test`.`jempn` where (`test`.`jempn`.`g` > 2)
1 row in set (0.00 sec)
```

Você deve ter em mente que uma coluna gerada armazenada, assim como qualquer índice em tal coluna, usa `DataMemory`.