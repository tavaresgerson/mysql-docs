### 22.3.5 Obter informações sobre partições

Esta seção discute a obtenção de informações sobre partições existentes, o que pode ser feito de várias maneiras. Os métodos de obtenção dessas informações incluem os seguintes:

- Use a instrução `SHOW CREATE TABLE` para visualizar as cláusulas de particionamento usadas na criação de uma tabela particionada.

- Use a instrução `SHOW TABLE STATUS` para determinar se uma tabela está particionada.

- Consultando a tabela do esquema de informações `PARTITIONS`.

- Use a instrução `EXPLAIN SELECT` (explain.html) para ver quais partições são usadas por um `SELECT` (select.html) específico.

Como discutido em outro lugar neste capítulo, `SHOW CREATE TABLE` inclui na sua saída a cláusula `PARTITION BY` usada para criar uma tabela particionada. Por exemplo:

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

A saída do comando `SHOW TABLE STATUS` para tabelas particionadas é a mesma da saída para tabelas não particionadas, exceto que a coluna `Create_options` contém a string `partitioned`. A coluna `Engine` contém o nome do motor de armazenamento usado por todas as partições da tabela. (Consulte Seção 13.7.5.36, “Instrução SHOW TABLE STATUS” para obter mais informações sobre essa instrução.)

Você também pode obter informações sobre partições do `INFORMATION_SCHEMA`, que contém uma tabela `PARTITIONS`. Veja Seção 24.3.16, “A Tabela INFORMATION_SCHEMA PARTITIONS”.

É possível determinar quais partições de uma tabela particionada estão envolvidas em uma consulta específica do `SELECT` usando o `EXPLAIN`. A coluna `partitions` no resultado do `EXPLAIN` lista as partições das quais os registros seriam correspondidos pela consulta.

Suponha que você tenha uma tabela `trb1` criada e preenchida da seguinte forma:

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

Você pode ver quais partições estão sendo usadas em uma consulta como `SELECT * FROM trb1;`, como mostrado aqui:

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

Neste caso, todas as quatro partições são pesquisadas. No entanto, quando uma condição limitante que faz uso da chave de partição é adicionada à consulta, você pode ver que apenas aquelas partições que contêm valores correspondentes são analisadas, como mostrado aqui:

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

`EXPLAIN` também fornece informações sobre as chaves usadas e as possíveis chaves:

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

Se o comando `EXPLAIN PARTITIONS` for usado para examinar uma consulta em uma tabela não particionada, não será gerado nenhum erro, mas o valor da coluna `partitions` será sempre `NULL`.

A coluna `rows` da saída do `EXPLAIN` (explain.html) exibe o número total de linhas na tabela.

Veja também Seção 13.8.2, “Instrução EXPLAIN”.
