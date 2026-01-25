### 22.3.5 Obtendo Informações Sobre Partitions

Esta seção discute a obtenção de informações sobre os partitions existentes, o que pode ser feito de várias maneiras. Os métodos para obter tais informações incluem o seguinte:

* Usando o statement [`SHOW CREATE TABLE`](show-create-table.html "13.7.5.10 SHOW CREATE TABLE Statement") para visualizar as cláusulas de partitioning usadas na criação de uma tabela partitioned.

* Usando o statement [`SHOW TABLE STATUS`](show-table-status.html "13.7.5.36 SHOW TABLE STATUS Statement") para determinar se uma tabela é partitioned.

* Executando uma Query na tabela [`PARTITIONS`](information-schema-partitions-table.html "24.3.16 The INFORMATION_SCHEMA PARTITIONS Table") do Information Schema.

* Usando o statement [`EXPLAIN SELECT`](explain.html "13.8.2 EXPLAIN Statement") para ver quais partitions são usados por um determinado [`SELECT`](select.html "13.2.9 SELECT Statement").

Conforme discutido em outras partes deste capítulo, [`SHOW CREATE TABLE`](show-create-table.html "13.7.5.10 SHOW CREATE TABLE Statement") inclui em seu output a cláusula `PARTITION BY` usada para criar uma tabela partitioned. Por exemplo:

```sql
mysql> SHOW CREATE TABLE trb3\G
*************************** 1. row ***************************
       Table: trb3
Create Table: CREATE TABLE `trb3` (
  `id` int(11) default NULL,
  `name` varchar(50) default NULL,
  `purchased` date default NULL
) ENGINE=MyISAM DEFAULT CHARSET=latin1
PARTITION BY RANGE (YEAR(purchased)) (
  PARTITION p0 VALUES LESS THAN (1990) ENGINE = MyISAM,
  PARTITION p1 VALUES LESS THAN (1995) ENGINE = MyISAM,
  PARTITION p2 VALUES LESS THAN (2000) ENGINE = MyISAM,
  PARTITION p3 VALUES LESS THAN (2005) ENGINE = MyISAM
)
1 row in set (0.00 sec)
```

O output de [`SHOW TABLE STATUS`](show-table-status.html "13.7.5.36 SHOW TABLE STATUS Statement") para tabelas partitioned é o mesmo que para tabelas não-partitioned, exceto que a coluna `Create_options` contém a string `partitioned`. A coluna `Engine` contém o nome da storage engine usada por todos os partitions da tabela. (Consulte [Section 13.7.5.36, “SHOW TABLE STATUS Statement”](show-table-status.html "13.7.5.36 SHOW TABLE STATUS Statement"), para obter mais informações sobre este statement.)

Você também pode obter informações sobre partitions do `INFORMATION_SCHEMA`, que contém uma tabela [`PARTITIONS`](information-schema-partitions-table.html "24.3.16 The INFORMATION_SCHEMA PARTITIONS Table"). Consulte [Section 24.3.16, “The INFORMATION_SCHEMA PARTITIONS Table”](information-schema-partitions-table.html "24.3.16 The INFORMATION_SCHEMA PARTITIONS Table").

É possível determinar quais partitions de uma tabela partitioned estão envolvidos em uma determinada Query [`SELECT`](select.html "13.2.9 SELECT Statement") usando [`EXPLAIN`](explain.html "13.8.2 EXPLAIN Statement"). A coluna `partitions` no output do [`EXPLAIN`](explain.html "13.8.2 EXPLAIN Statement") lista os partitions a partir dos quais os records seriam matched pela Query.

Suponha que você tenha uma tabela `trb1` criada e populada da seguinte forma:

```sql
CREATE TABLE trb1 (id INT, name VARCHAR(50), purchased DATE)
    PARTITION BY RANGE(id)
    (
        PARTITION p0 VALUES LESS THAN (3),
        PARTITION p1 VALUES LESS THAN (7),
        PARTITION p2 VALUES LESS THAN (9),
        PARTITION p3 VALUES LESS THAN (11)
    );

INSERT INTO trb1 VALUES
    (1, 'desk organiser', '2003-10-15'),
    (2, 'CD player', '1993-11-05'),
    (3, 'TV set', '1996-03-10'),
    (4, 'bookcase', '1982-01-10'),
    (5, 'exercise bike', '2004-05-09'),
    (6, 'sofa', '1987-06-05'),
    (7, 'popcorn maker', '2001-11-22'),
    (8, 'aquarium', '1992-08-04'),
    (9, 'study desk', '1984-09-16'),
    (10, 'lava lamp', '1998-12-25');
```

Você pode ver quais partitions são usados em uma Query como `SELECT * FROM trb1;`, conforme mostrado aqui:

```sql
mysql> EXPLAIN SELECT * FROM trb1\G
*************************** 1. row ***************************
           id: 1
  select_type: SIMPLE
        table: trb1
   partitions: p0,p1,p2,p3
         type: ALL
possible_keys: NULL
          key: NULL
      key_len: NULL
          ref: NULL
         rows: 10
        Extra: Using filesort
```

Neste caso, todos os quatro partitions são pesquisados. No entanto, quando uma condição limitadora que faz uso da partitioning key é adicionada à Query, você pode ver que apenas aqueles partitions contendo matching values são escaneados, conforme mostrado aqui:

```sql
mysql> EXPLAIN SELECT * FROM trb1 WHERE id < 5\G
*************************** 1. row ***************************
           id: 1
  select_type: SIMPLE
        table: trb1
   partitions: p0,p1
         type: ALL
possible_keys: NULL
          key: NULL
      key_len: NULL
          ref: NULL
         rows: 10
        Extra: Using where
```

[`EXPLAIN`](explain.html "13.8.2 EXPLAIN Statement") também fornece informações sobre keys usadas e possible keys:

```sql
mysql> ALTER TABLE trb1 ADD PRIMARY KEY (id);
Query OK, 10 rows affected (0.03 sec)
Records: 10  Duplicates: 0  Warnings: 0

mysql> EXPLAIN SELECT * FROM trb1 WHERE id < 5\G
*************************** 1. row ***************************
           id: 1
  select_type: SIMPLE
        table: trb1
   partitions: p0,p1
         type: range
possible_keys: PRIMARY
          key: PRIMARY
      key_len: 4
          ref: NULL
         rows: 7
        Extra: Using where
```

Se [`EXPLAIN PARTITIONS`](explain.html "13.8.2 EXPLAIN Statement") for usado para examinar uma Query em uma tabela não-partitioned, nenhum error é produzido, mas o valor da coluna `partitions` é sempre `NULL`.

A coluna `rows` do output de [`EXPLAIN`](explain.html "13.8.2 EXPLAIN Statement") exibe o número total de rows na tabela.

Consulte também [Section 13.8.2, “EXPLAIN Statement”](explain.html "13.8.2 EXPLAIN Statement").