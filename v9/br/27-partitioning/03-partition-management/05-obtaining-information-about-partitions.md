### 26.3.5 Obter Informações sobre Partições

Esta seção discute a obtenção de informações sobre as partições existentes, o que pode ser feito de várias maneiras. Os métodos de obtenção dessas informações incluem os seguintes:

* Usar a instrução `SHOW CREATE TABLE` para visualizar as cláusulas de partição usadas na criação de uma tabela particionada.

* Usar a instrução `SHOW TABLE STATUS` para determinar se uma tabela está particionada.

* Consultar a tabela do esquema de informações `PARTITIONS`.

* Usar a instrução `EXPLAIN SELECT` para ver quais partições são usadas por um `SELECT` específico.

Quando inserções, deletações ou atualizações são feitas em tabelas particionadas, o log binário registra informações sobre a partição e (se houver) a subpartição na qual o evento da linha ocorreu. Um novo evento de linha é criado para uma modificação que ocorre em uma partição ou subpartição diferente, mesmo que a tabela envolvida seja a mesma. Portanto, se uma transação envolve três partições ou subpartições, três eventos de linha são gerados. Para um evento de atualização, as informações da partição são registradas tanto para a imagem "antes" quanto para a imagem "depois". As informações da partição são exibidas se você especificar a opção `-v` ou `--verbose` ao visualizar o log binário usando **mysqlbinlog**. As informações da partição são registradas apenas quando o registro baseado em linha está em uso (`binlog_format=ROW`).

Como discutido em outro lugar neste capítulo, `SHOW CREATE TABLE` inclui em sua saída a cláusula `PARTITION BY` usada para criar uma tabela particionada. Por exemplo:

```
mysql> SHOW CREATE TABLE trb3\G
*************************** 1. row ***************************
       Table: trb3
Create Table: CREATE TABLE `trb3` (
  `id` int(11) DEFAULT NULL,
  `name` varchar(50) DEFAULT NULL,
  `purchased` date DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci
/*!50100 PARTITION BY RANGE (YEAR(purchased))
(PARTITION p0 VALUES LESS THAN (1990) ENGINE = InnoDB,
 PARTITION p1 VALUES LESS THAN (1995) ENGINE = InnoDB,
 PARTITION p2 VALUES LESS THAN (2000) ENGINE = InnoDB,
 PARTITION p3 VALUES LESS THAN (2005) ENGINE = InnoDB) */
0 row in set (0.00 sec)
```

A saída do comando `SHOW TABLE STATUS` para tabelas particionadas é a mesma que para tabelas não particionadas, exceto que a coluna `Create_options` contém a string `partitioned`. A coluna `Engine` contém o nome do motor de armazenamento usado por todas as partições da tabela. (Veja a Seção 15.7.7.39, “Instrução SHOW TABLE STATUS”, para mais informações sobre essa instrução.)

Você também pode obter informações sobre as partições do `INFORMATION_SCHEMA`, que contém uma tabela `PARTITIONS`. Veja a Seção 28.3.26, “A Tabela INFORMATION_SCHEMA PARTITIONS”.

É possível determinar quais partições de uma tabela particionada estão envolvidas em uma consulta `SELECT` específica usando `EXPLAIN`. A coluna `partitions` no resultado do `EXPLAIN` lista as partições das quais os registros seriam correspondidos pela consulta.

Suponha que uma tabela `trb1` seja criada e preenchida da seguinte forma:

```
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

Você pode ver quais partições são usadas em uma consulta como `SELECT * FROM trb1;`, como mostrado aqui:

```
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

Neste caso, todas as quatro partições são pesquisadas. No entanto, quando uma condição limitante que faz uso da chave de particionamento é adicionada à consulta, você pode ver que apenas aquelas partições que contêm valores correspondentes são verificadas, como mostrado aqui:

```
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

O `EXPLAIN` também fornece informações sobre chaves usadas e possíveis chaves:

```
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

Se o `EXPLAIN` for usado para examinar uma consulta contra uma tabela não particionada, não será produzido nenhum erro, mas o valor da coluna `partitions` será sempre `NULL`.

A coluna `rows` do resultado do `EXPLAIN` exibe o número total de linhas na tabela.

Veja também a Seção 15.8.2, “Instrução EXPLAIN”.