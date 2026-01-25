#### 13.1.18.8 Secondary Indexes e Colunas Geradas

O `InnoDB` suporta Secondary Indexes em colunas geradas virtuais. Outros tipos de Index não são suportados. Um Secondary Index definido em uma coluna virtual é, por vezes, referido como um "virtual index".

Um Secondary Index pode ser criado em uma ou mais colunas virtuais ou em uma combinação de colunas virtuais e colunas regulares ou colunas geradas stored. Secondary Indexes que incluem colunas virtuais podem ser definidos como `UNIQUE`.

Quando um Secondary Index é criado em uma coluna gerada virtual, os valores da coluna gerada são materializados nos registros do Index. Se o Index for um [covering index](glossary.html#glos_covering_index "covering index") (aquele que inclui todas as colunas recuperadas por uma Query), os valores da coluna gerada são recuperados dos valores materializados na estrutura do Index, em vez de serem computados "on the fly".

Existem custos de escrita adicionais a considerar ao usar um Secondary Index em uma coluna virtual devido ao cálculo realizado ao materializar os valores da coluna virtual nos registros do Secondary Index durante as operações de [`INSERT`](insert.html "13.2.5 INSERT Statement") e [`UPDATE`](update.html "13.2.11 UPDATE Statement"). Mesmo com custos de escrita adicionais, Secondary Indexes em colunas virtuais podem ser preferíveis às colunas geradas *stored*, que são materializadas no clustered index, resultando em tabelas maiores que exigem mais disk space e memory. Se um Secondary Index não for definido em uma coluna virtual, há custos adicionais para reads, pois os valores da coluna virtual devem ser computados sempre que a linha da coluna for examinada.

Os valores de uma coluna virtual indexada são registrados via MVCC para evitar o recálculo desnecessário dos valores da coluna gerada durante um rollback ou durante uma operação de purge. O data length dos valores registrados é limitado pelo limite de index key de 767 bytes para os formatos de linha `COMPACT` e `REDUNDANT`, e 3072 bytes para os formatos de linha `DYNAMIC` e `COMPRESSED`.

Adicionar ou remover um Secondary Index em uma coluna virtual é uma operação in-place.

Antes da versão 5.7.16, uma foreign key constraint não pode referenciar um Secondary Index definido em uma coluna gerada virtual.

No MySQL 5.7.13 e versões anteriores, o `InnoDB` não permite definir uma foreign key constraint com uma ação referencial em cascata na coluna base de uma coluna virtual gerada indexada. Essa restrição foi removida no MySQL 5.7.14.

##### Indexando uma Coluna Gerada para Fornecer um Index de Coluna JSON

Conforme observado em outros lugares, colunas [`JSON`](json.html "11.5 The JSON Data Type") não podem ser indexadas diretamente. Para criar um Index que referencie tal coluna indiretamente, você pode definir uma coluna gerada que extrai a informação que deve ser indexada e, em seguida, criar um Index na coluna gerada, conforme mostrado neste exemplo:

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

(Ajustamos a quebra da saída da última instrução neste exemplo para caber na área de visualização.)

O operador [`->`](json-search-functions.html#operator_json-column-path) é suportado no MySQL 5.7.9 e versões posteriores. O operador [`->>`](json-search-functions.html#operator_json-inline-path) é suportado a partir do MySQL 5.7.13.

Quando você usa [`EXPLAIN`](explain.html "13.8.2 EXPLAIN Statement") em uma instrução [`SELECT`](select.html "13.2.9 SELECT Statement") ou outra instrução SQL contendo uma ou mais expressões que utilizam o operador `->` ou `->>`, essas expressões são traduzidas para seus equivalentes usando `JSON_EXTRACT()` e (se necessário) `JSON_UNQUOTE()`, conforme mostrado aqui na saída de [`SHOW WARNINGS`](show-warnings.html "13.7.5.40 SHOW WARNINGS Statement") imediatamente após esta instrução `EXPLAIN`:

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

Consulte as descrições dos operadores [`->`](json-search-functions.html#operator_json-column-path) e [`->>`](json-search-functions.html#operator_json-inline-path), bem como as das funções [`JSON_EXTRACT()`](json-search-functions.html#function_json-extract) e [`JSON_UNQUOTE()`](json-modification-functions.html#function_json-unquote), para obter informações e exemplos adicionais.

Essa técnica também pode ser usada para fornecer Indexes que referenciam indiretamente colunas de outros tipos que não podem ser indexadas diretamente, como colunas `GEOMETRY`.

###### Colunas JSON e Indexação indireta no NDB Cluster

Também é possível usar a indexação indireta de colunas JSON no MySQL NDB Cluster, sujeita às seguintes condições:

1. O [`NDB`](mysql-cluster.html "Chapter 21 MySQL NDB Cluster 7.5 and NDB Cluster 7.6") trata um valor de coluna [`JSON`](json.html "11.5 The JSON Data Type") internamente como um [`BLOB`](blob.html "11.3.4 The BLOB and TEXT Types"). Isso significa que qualquer tabela `NDB` que tenha uma ou mais colunas JSON deve ter uma primary key, caso contrário, não poderá ser registrada no binary log.

2. O storage engine [`NDB`](mysql-cluster.html "Chapter 21 MySQL NDB Cluster 7.5 and NDB Cluster 7.6") não suporta a indexação de colunas virtuais. Como o padrão para colunas geradas é `VIRTUAL`, você deve especificar explicitamente a coluna gerada à qual aplicar o Index indireto como `STORED`.

A instrução **`CREATE TABLE`** usada para criar a tabela `jempn` mostrada aqui é uma versão da tabela `jemp` mostrada anteriormente, com modificações que a tornam compatível com `NDB`:

```sql
CREATE TABLE jempn (
  a BIGINT(20) NOT NULL AUTO_INCREMENT PRIMARY KEY,
  c JSON DEFAULT NULL,
  g INT GENERATED ALWAYS AS (c->"$.name") STORED,
  INDEX i (g)
) ENGINE=NDB;
```

Podemos popular esta tabela usando a seguinte instrução [`INSERT`](insert.html "13.2.5 INSERT Statement"):

```sql
INSERT INTO jempn (a, c) VALUES
  (NULL, '{"id": "1", "name": "Fred"}'),
  (NULL, '{"id": "2", "name": "Wilma"}'),
  (NULL, '{"id": "3", "name": "Barney"}'),
  (NULL, '{"id": "4", "name": "Betty"}');
```

Agora o `NDB` pode usar o index `i`, conforme mostrado aqui:

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

Você deve ter em mente que uma coluna gerada stored, bem como qualquer Index nessa coluna, usa [`DataMemory`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-datamemory). No NDB 7.5, um Index em uma coluna gerada stored também usa [`IndexMemory`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-indexmemory).