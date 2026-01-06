#### 13.1.18.8 Índices Secundários e Colunas Geradas

O `InnoDB` suporta índices secundários em colunas geradas virtualmente. Outros tipos de índice não são suportados. Um índice secundário definido em uma coluna virtual é às vezes chamado de "índice virtual".

Um índice secundário pode ser criado em uma ou mais colunas virtuais ou em uma combinação de colunas virtuais e colunas regulares ou colunas geradas armazenadas. Índices secundários que incluem colunas virtuais podem ser definidos como `UNIQUE`.

Quando um índice secundário é criado em uma coluna gerada virtualmente, os valores da coluna gerada são materializados nos registros do índice. Se o índice for um índice coberto (um que inclui todas as colunas recuperadas por uma consulta), os valores da coluna gerada são recuperados a partir de valores materializados na estrutura do índice, em vez de serem calculados “on the fly”.

Há custos adicionais de escrita a serem considerados ao usar um índice secundário em uma coluna virtual devido à computação realizada ao materializar os valores da coluna virtual nos registros do índice secundário durante as operações de `INSERT` e `UPDATE`. Mesmo com custos adicionais de escrita, índices secundários em colunas virtuais podem ser preferíveis a colunas *armazenadas* geradas, que são materializadas no índice agrupado, resultando em tabelas maiores que requerem mais espaço em disco e memória. Se um índice secundário não for definido em uma coluna virtual, há custos adicionais para leituras, pois os valores da coluna virtual devem ser calculados cada vez que a linha da coluna é examinada.

Os valores de uma coluna virtual indexada são registrados no MVCC para evitar a recomputação desnecessária dos valores gerados da coluna durante o rollback ou durante uma operação de purga. O comprimento dos dados dos valores registrados é limitado pelo limite da chave do índice de 767 bytes para os formatos de linha `COMPACT` e `REDUNDANT`, e 3072 bytes para os formatos de linha `DYNAMIC` e `COMPRESSED`.

Adicionar ou excluir um índice secundário em uma coluna virtual é uma operação in-place.

Antes da versão 5.7.16, uma restrição de chave estrangeira não pode referenciar um índice secundário definido em uma coluna gerada virtualmente.

No MySQL 5.7.13 e versões anteriores, o `InnoDB` não permite definir uma restrição de chave estrangeira com uma ação de referência em cascata na coluna base de uma coluna virtual gerada por índice. Essa restrição é removida no MySQL 5.7.14.

##### Indexar uma coluna gerada para fornecer um índice de coluna JSON

Como mencionado em outro lugar, as colunas de `JSON` não podem ser indexadas diretamente. Para criar um índice que faça referência a uma coluna dessa forma indireta, você pode definir uma coluna gerada que extraia as informações que devem ser indexadas, e depois criar um índice na coluna gerada, como mostrado neste exemplo:

```sql
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

(Envolvemos o resultado da última declaração neste exemplo para caber na área de visualização.)

O operador `->` é suportado no MySQL 5.7.9 e versões posteriores. O operador `->>` é suportado a partir do MySQL 5.7.13.

Quando você usa `EXPLAIN` em uma instrução `SELECT` ou em outra instrução SQL que contém uma ou mais expressões que usam o operador `->` ou `->>` , essas expressões são traduzidas para seus equivalentes usando `JSON_EXTRACT()` e (se necessário) `JSON_UNQUOTE()` , como mostrado aqui na saída de `SHOW WARNINGS` imediatamente após essa instrução `EXPLAIN`:

```sql
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

Consulte as descrições dos operadores `->` e `->>`, bem como as das funções `JSON_EXTRACT()` e `JSON_UNQUOTE()`, para obter informações e exemplos adicionais.

Essa técnica também pode ser usada para fornecer índices que fazem referência indiretamente a colunas de outros tipos que não podem ser indexadas diretamente, como as colunas `GEOMETRY`.

###### Colunas JSON e indexação indireta no NDB Cluster

É também possível usar indexação indireta de colunas JSON no MySQL NDB Cluster, sujeito às seguintes condições:

1. O `NDB` lida internamente com o valor de uma coluna `JSON` como um `BLOB`. Isso significa que qualquer tabela `NDB` que tenha uma ou mais colunas JSON deve ter uma chave primária, caso contrário, não poderá ser registrada no log binário.

2. O mecanismo de armazenamento `NDB` não suporta a indexação de colunas virtuais. Como o padrão para colunas geradas é `VIRTUAL`, você deve especificar explicitamente a coluna gerada à qual aplicar o índice indireto como `STORED`.

A instrução **`CREATE TABLE`** usada para criar a tabela `jempn` mostrada aqui é uma versão da tabela `jemp` mostrada anteriormente, com modificações que a tornam compatível com o `NDB`:

```sql
CREATE TABLE jempn (
  a BIGINT(20) NOT NULL AUTO_INCREMENT PRIMARY KEY,
  c JSON DEFAULT NULL,
  g INT GENERATED ALWAYS AS (c->"$.name") STORED,
  INDEX i (g)
) ENGINE=NDB;
```

Podemos preencher esta tabela usando a seguinte instrução `INSERT`:

```sql
INSERT INTO jempn (a, c) VALUES
  (NULL, '{"id": "1", "name": "Fred"}'),
  (NULL, '{"id": "2", "name": "Wilma"}'),
  (NULL, '{"id": "3", "name": "Barney"}'),
  (NULL, '{"id": "4", "name": "Betty"}');
```

Agora, o `NDB` pode usar o índice `i`, como mostrado aqui:

```sql
mysql> EXPLAIN SELECT c->>"$.name" AS name
          FROM jempn WHERE g > 2\G
*************************** 1. row ***************************
           id: 1
  select_type: SIMPLE
        table: jempn
   partitions: p0,p1
         type: range
possible_keys: i
          key: i
      key_len: 5
          ref: NULL
         rows: 3
     filtered: 100.00
        Extra: Using where with pushed condition (`test`.`jempn`.`g` > 2)
1 row in set, 1 warning (0.00 sec)

mysql> SHOW WARNINGS\G
*************************** 1. row ***************************
  Level: Note
   Code: 1003
Message: /* select#1 */ select
json_unquote(json_extract(`test`.`jempn`.`c`,'$.name')) AS `name` from
`test`.`jempn` where (`test`.`jempn`.`g` > 2)
1 row in set (0.00 sec)
```

Você deve ter em mente que uma coluna gerada armazenada, assim como qualquer índice em uma coluna desse tipo, usa `DataMemory`. No NDB 7.5, um índice em uma coluna gerada armazenada também usa `IndexMemory`.
