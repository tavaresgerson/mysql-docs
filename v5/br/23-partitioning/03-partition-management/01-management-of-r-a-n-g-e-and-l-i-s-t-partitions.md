### 22.3.1 Gerenciamento de Partições RANGE e LIST

Adicionar e remover partições range e list são operações tratadas de maneira similar, portanto, discutiremos o gerenciamento de ambos os tipos de Partitioning nesta seção. Para informações sobre como trabalhar com tabelas particionadas por hash ou key, consulte [Seção 22.3.2, “Gerenciamento de Partições HASH e KEY”](partitioning-management-hash-key.html "22.3.2 Management of HASH and KEY Partitions").

Remover uma Partition de uma tabela que é particionada por `RANGE` ou por `LIST` pode ser realizado usando a instrução [`ALTER TABLE`](alter-table-partition-operations.html "13.1.8.1 ALTER TABLE Partition Operations") com a opção `DROP PARTITION`. Suponha que você tenha criado uma tabela particionada por range e preenchida com 10 records usando as seguintes instruções [`CREATE TABLE`](create-table.html "13.1.18 CREATE TABLE Statement") e [`INSERT`](insert.html "13.2.5 INSERT Statement"):

```sql
mysql> CREATE TABLE tr (id INT, name VARCHAR(50), purchased DATE)
    ->     PARTITION BY RANGE( YEAR(purchased) ) (
    ->         PARTITION p0 VALUES LESS THAN (1990),
    ->         PARTITION p1 VALUES LESS THAN (1995),
    ->         PARTITION p2 VALUES LESS THAN (2000),
    ->         PARTITION p3 VALUES LESS THAN (2005),
    ->         PARTITION p4 VALUES LESS THAN (2010),
    ->         PARTITION p5 VALUES LESS THAN (2015)
    ->     );
Query OK, 0 rows affected (0.28 sec)

mysql> INSERT INTO tr VALUES
    ->     (1, 'desk organiser', '2003-10-15'),
    ->     (2, 'alarm clock', '1997-11-05'),
    ->     (3, 'chair', '2009-03-10'),
    ->     (4, 'bookcase', '1989-01-10'),
    ->     (5, 'exercise bike', '2014-05-09'),
    ->     (6, 'sofa', '1987-06-05'),
    ->     (7, 'espresso maker', '2011-11-22'),
    ->     (8, 'aquarium', '1992-08-04'),
    ->     (9, 'study desk', '2006-09-16'),
    ->     (10, 'lava lamp', '1998-12-25');
Query OK, 10 rows affected (0.05 sec)
Records: 10  Duplicates: 0  Warnings: 0
```

Você pode ver quais itens deveriam ter sido inseridos na partition `p2`, conforme mostrado aqui:

```sql
mysql> SELECT * FROM tr
    ->     WHERE purchased BETWEEN '1995-01-01' AND '1999-12-31';
+------+-------------+------------+
| id   | name        | purchased  |
+------+-------------+------------+
|    2 | alarm clock | 1997-11-05 |
|   10 | lava lamp   | 1998-12-25 |
+------+-------------+------------+
2 rows in set (0.00 sec)
```

Você também pode obter essa informação usando partition selection, como mostrado aqui:

```sql
mysql> SELECT * FROM tr PARTITION (p2);
+------+-------------+------------+
| id   | name        | purchased  |
+------+-------------+------------+
|    2 | alarm clock | 1997-11-05 |
|   10 | lava lamp   | 1998-12-25 |
+------+-------------+------------+
2 rows in set (0.00 sec)
```

Consulte [Seção 22.5, “Partition Selection”](partitioning-selection.html "22.5 Partition Selection"), para mais informações.

Para remover a partition chamada `p2`, execute o seguinte comando:

```sql
mysql> ALTER TABLE tr DROP PARTITION p2;
Query OK, 0 rows affected (0.03 sec)
```

Nota

A Storage Engine [`NDBCLUSTER`](mysql-cluster.html "Chapter 21 MySQL NDB Cluster 7.5 and NDB Cluster 7.6") não suporta `ALTER TABLE ... DROP PARTITION`. No entanto, ela suporta as outras extensões relacionadas a Partitioning para [`ALTER TABLE`](alter-table-partition-operations.html "13.1.8.1 ALTER TABLE Partition Operations") descritas neste capítulo.

É muito importante lembrar que, *quando você remove uma partition, você também exclui todos os dados que estavam armazenados nela*. Você pode verificar isso reexecutando a Query [`SELECT`](select.html "13.2.9 SELECT Statement") anterior:

```sql
mysql> SELECT * FROM tr WHERE purchased
    -> BETWEEN '1995-01-01' AND '1999-12-31';
Empty set (0.00 sec)
```

Por causa disso, você deve ter o privilégio [`DROP`](privileges-provided.html#priv_drop) para uma tabela antes de poder executar `ALTER TABLE ... DROP PARTITION` nessa tabela.

Se você deseja remover todos os dados de todas as partitions, preservando a definição da tabela e seu esquema de Partitioning, use a instrução [`TRUNCATE TABLE`](truncate-table.html "13.1.34 TRUNCATE TABLE Statement"). (Consulte [Seção 13.1.34, “Instrução TRUNCATE TABLE”](truncate-table.html "13.1.34 TRUNCATE TABLE Statement").)

Se você pretende alterar o Partitioning de uma tabela *sem* perder dados, use `ALTER TABLE ... REORGANIZE PARTITION` em vez disso. Veja abaixo ou em [Seção 13.1.8, “Instrução ALTER TABLE”](alter-table.html "13.1.8 ALTER TABLE Statement"), para obter informações sobre `REORGANIZE PARTITION`.

Se você agora executar uma instrução [`SHOW CREATE TABLE`](show-create-table.html "13.7.5.10 SHOW CREATE TABLE Statement"), você pode ver como a composição do Partitioning da tabela foi alterada:

```sql
mysql> SHOW CREATE TABLE tr\G
*************************** 1. row ***************************
       Table: tr
Create Table: CREATE TABLE `tr` (
  `id` int(11) DEFAULT NULL,
  `name` varchar(50) DEFAULT NULL,
  `purchased` date DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1
/*!50100 PARTITION BY RANGE ( YEAR(purchased))
(PARTITION p0 VALUES LESS THAN (1990) ENGINE = InnoDB,
 PARTITION p1 VALUES LESS THAN (1995) ENGINE = InnoDB,
 PARTITION p3 VALUES LESS THAN (2005) ENGINE = InnoDB,
 PARTITION p4 VALUES LESS THAN (2010) ENGINE = InnoDB,
 PARTITION p5 VALUES LESS THAN (2015) ENGINE = InnoDB) */
1 row in set (0.00 sec)
```

Quando você insere novas rows na tabela alterada com valores de coluna `purchased` entre `'1995-01-01'` e `'2004-12-31'` (inclusive), essas rows são armazenadas na partition `p3`. Você pode verificar isso da seguinte forma:

```sql
mysql> INSERT INTO tr VALUES (11, 'pencil holder', '1995-07-12');
Query OK, 1 row affected (0.00 sec)

mysql> SELECT * FROM tr WHERE purchased
    -> BETWEEN '1995-01-01' AND '2004-12-31';
+------+----------------+------------+
| id   | name           | purchased  |
+------+----------------+------------+
|    1 | desk organiser | 2003-10-15 |
|   11 | pencil holder  | 1995-07-12 |
+------+----------------+------------+
2 rows in set (0.00 sec)

mysql> ALTER TABLE tr DROP PARTITION p3;
Query OK, 0 rows affected (0.03 sec)

mysql> SELECT * FROM tr WHERE purchased
    -> BETWEEN '1995-01-01' AND '2004-12-31';
Empty set (0.00 sec)
```

O número de rows removidas da tabela como resultado de `ALTER TABLE ... DROP PARTITION` não é reportado pelo server como seria por uma Query [`DELETE`](delete.html "13.2.2 DELETE Statement") equivalente.

Remover partições `LIST` usa exatamente a mesma sintaxe `ALTER TABLE ... DROP PARTITION` usada para remover partições `RANGE`. No entanto, existe uma diferença importante no efeito que isso tem no uso subsequente da tabela: Você não pode mais inserir na tabela nenhuma row que contenha qualquer um dos valores que estavam incluídos na lista de valores que definiam a partition excluída. (Consulte [Seção 22.2.2, “Partitioning LIST”](partitioning-list.html "22.2.2 LIST Partitioning"), para um exemplo.)

Para adicionar uma nova partition range ou list a uma tabela previamente particionada, use a instrução `ALTER TABLE ... ADD PARTITION`. Para tabelas particionadas por `RANGE`, isso pode ser usado para adicionar um novo range ao final da lista de partitions existentes. Suponha que você tenha uma tabela particionada contendo dados de membros para sua organização, que é definida como segue:

```sql
CREATE TABLE members (
    id INT,
    fname VARCHAR(25),
    lname VARCHAR(25),
    dob DATE
)
PARTITION BY RANGE( YEAR(dob) ) (
    PARTITION p0 VALUES LESS THAN (1980),
    PARTITION p1 VALUES LESS THAN (1990),
    PARTITION p2 VALUES LESS THAN (2000)
);
```

Suponha ainda que a idade mínima para membros seja 16. Conforme o calendário se aproxima do final de 2015, você percebe que em breve admitirá membros que nasceram em 2000 (e posteriormente). Você pode modificar a tabela `members` para acomodar novos membros nascidos nos anos de 2000 a 2010, conforme mostrado aqui:

```sql
ALTER TABLE members ADD PARTITION (PARTITION p3 VALUES LESS THAN (2010));
```

Com tabelas particionadas por range, você pode usar `ADD PARTITION` para adicionar novas partitions apenas na extremidade superior da lista de partitions. Tentar adicionar uma nova partition dessa maneira entre ou antes das partitions existentes resulta em um erro, como mostrado aqui:

```sql
mysql> ALTER TABLE members
     >     ADD PARTITION (
     >     PARTITION n VALUES LESS THAN (1970));
ERROR 1463 (HY000): VALUES LESS THAN value must be strictly »
   increasing for each partition
```

Você pode contornar esse problema reorganizando a primeira partition em duas novas que dividem o range entre elas, assim:

```sql
ALTER TABLE members
    REORGANIZE PARTITION p0 INTO (
        PARTITION n0 VALUES LESS THAN (1970),
        PARTITION n1 VALUES LESS THAN (1980)
);
```

Usando [`SHOW CREATE TABLE`](show-create-table.html "13.7.5.10 SHOW CREATE TABLE Statement"), você pode ver que a instrução `ALTER TABLE` teve o efeito desejado:

```sql
mysql> SHOW CREATE TABLE members\G
*************************** 1. row ***************************
       Table: members
Create Table: CREATE TABLE `members` (
  `id` int(11) DEFAULT NULL,
  `fname` varchar(25) DEFAULT NULL,
  `lname` varchar(25) DEFAULT NULL,
  `dob` date DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1
/*!50100 PARTITION BY RANGE ( YEAR(dob))
(PARTITION n0 VALUES LESS THAN (1970) ENGINE = InnoDB,
 PARTITION n1 VALUES LESS THAN (1980) ENGINE = InnoDB,
 PARTITION p1 VALUES LESS THAN (1990) ENGINE = InnoDB,
 PARTITION p2 VALUES LESS THAN (2000) ENGINE = InnoDB,
 PARTITION p3 VALUES LESS THAN (2010) ENGINE = InnoDB) */
1 row in set (0.00 sec)
```

Consulte também [Seção 13.1.8.1, “Operações de Partitioning em ALTER TABLE”](alter-table-partition-operations.html "13.1.8.1 ALTER TABLE Partition Operations").

Você também pode usar `ALTER TABLE ... ADD PARTITION` para adicionar novas partitions a uma tabela particionada por `LIST`. Suponha que uma tabela `tt` seja definida usando a seguinte instrução [`CREATE TABLE`](create-table.html "13.1.18 CREATE TABLE Statement"):

```sql
CREATE TABLE tt (
    id INT,
    data INT
)
PARTITION BY LIST(data) (
    PARTITION p0 VALUES IN (5, 10, 15),
    PARTITION p1 VALUES IN (6, 12, 18)
);
```

Você pode adicionar uma nova partition para armazenar rows que tenham os valores de coluna `data` `7`, `14` e `21`, conforme mostrado:

```sql
ALTER TABLE tt ADD PARTITION (PARTITION p2 VALUES IN (7, 14, 21));
```

Lembre-se de que você *não pode* adicionar uma nova partition `LIST` abrangendo quaisquer valores que já estejam incluídos na lista de valores de uma partition existente. Se você tentar fazer isso, resultará em um erro:

```sql
mysql> ALTER TABLE tt ADD PARTITION
     >     (PARTITION np VALUES IN (4, 8, 12));
ERROR 1465 (HY000): Multiple definition of same constant »
                    in list partitioning
```

Como todas as rows com o valor de coluna `data` igual a `12` já foram atribuídas à partition `p1`, você não pode criar uma nova partition na tabela `tt` que inclua `12` em sua lista de valores. Para realizar isso, você poderia remover `p1`, adicionar `np` e, em seguida, uma nova `p1` com uma definição modificada. No entanto, como discutido anteriormente, isso resultaria na perda de todos os dados armazenados em `p1` — e frequentemente, não é isso que você realmente deseja fazer. Outra solução poderia parecer ser fazer uma cópia da tabela com o novo Partitioning e copiar os dados para ela usando [`CREATE TABLE ... SELECT ...`](create-table.html "13.1.18 CREATE TABLE Statement"), depois remover a tabela antiga e renomear a nova, mas isso pode consumir muito tempo ao lidar com grandes quantidades de dados. Isso também pode não ser viável em situações onde alta disponibilidade é um requisito.

Você pode adicionar múltiplas partitions em uma única instrução `ALTER TABLE ... ADD PARTITION`, como mostrado aqui:

```sql
CREATE TABLE employees (
  id INT NOT NULL,
  fname VARCHAR(50) NOT NULL,
  lname VARCHAR(50) NOT NULL,
  hired DATE NOT NULL
)
PARTITION BY RANGE( YEAR(hired) ) (
  PARTITION p1 VALUES LESS THAN (1991),
  PARTITION p2 VALUES LESS THAN (1996),
  PARTITION p3 VALUES LESS THAN (2001),
  PARTITION p4 VALUES LESS THAN (2005)
);

ALTER TABLE employees ADD PARTITION (
    PARTITION p5 VALUES LESS THAN (2010),
    PARTITION p6 VALUES LESS THAN MAXVALUE
);
```

Felizmente, a implementação de Partitioning do MySQL fornece maneiras de redefinir partitions sem perder dados. Vejamos primeiro alguns exemplos simples envolvendo Partitioning por `RANGE`. Lembre-se da tabela `members`, que agora está definida conforme mostrado aqui:

```sql
mysql> SHOW CREATE TABLE members\G
*************************** 1. row ***************************
       Table: members
Create Table: CREATE TABLE `members` (
  `id` int(11) DEFAULT NULL,
  `fname` varchar(25) DEFAULT NULL,
  `lname` varchar(25) DEFAULT NULL,
  `dob` date DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1
/*!50100 PARTITION BY RANGE ( YEAR(dob))
(PARTITION n0 VALUES LESS THAN (1970) ENGINE = InnoDB,
 PARTITION n1 VALUES LESS THAN (1980) ENGINE = InnoDB,
 PARTITION p1 VALUES LESS THAN (1990) ENGINE = InnoDB,
 PARTITION p2 VALUES LESS THAN (2000) ENGINE = InnoDB,
 PARTITION p3 VALUES LESS THAN (2010) ENGINE = InnoDB) */
1 row in set (0.00 sec)
```

Suponha que você gostaria de mover todas as rows que representam membros nascidos antes de 1960 para uma partition separada. Como já vimos, isso não pode ser feito usando [`ALTER TABLE ... ADD PARTITION`](alter-table-partition-operations.html "13.1.8.1 ALTER TABLE Partition Operations"). No entanto, você pode usar outra extensão relacionada a Partitioning para [`ALTER TABLE`](alter-table-partition-operations.html "13.1.8.1 ALTER TABLE Partition Operations") para realizar isso:

```sql
ALTER TABLE members REORGANIZE PARTITION n0 INTO (
    PARTITION s0 VALUES LESS THAN (1960),
    PARTITION s1 VALUES LESS THAN (1970)
);
```

Na prática, esse comando divide a partition `n0` em duas novas partitions, `s0` e `s1`. Ele também move os dados que estavam armazenados em `n0` para as novas partitions de acordo com as regras incorporadas nas duas cláusulas `PARTITION ... VALUES ...`, de modo que `s0` contenha apenas os records para os quais [`YEAR(dob)`](date-and-time-functions.html#function_year) é menor que 1960 e `s1` contenha as rows nas quais [`YEAR(dob)`](date-and-time-functions.html#function_year) é maior ou igual a 1960, mas menor que 1970.

Uma cláusula `REORGANIZE PARTITION` também pode ser usada para merge de partitions adjacentes. Você pode reverter o efeito da instrução anterior na tabela `members`, como mostrado aqui:

```sql
ALTER TABLE members REORGANIZE PARTITION s0,s1 INTO (
    PARTITION p0 VALUES LESS THAN (1970)
);
```

Nenhum dado é perdido ao dividir ou fazer merge de partitions usando `REORGANIZE PARTITION`. Ao executar a instrução acima, o MySQL move todos os records que estavam armazenados nas partitions `s0` e `s1` para a partition `p0`.

A sintaxe geral para `REORGANIZE PARTITION` é mostrada aqui:

```sql
ALTER TABLE tbl_name
    REORGANIZE PARTITION partition_list
    INTO (partition_definitions);
```

Aqui, *`tbl_name`* é o nome da tabela particionada, e *`partition_list`* é uma lista separada por vírgulas dos nomes de uma ou mais partitions existentes a serem alteradas. *`partition_definitions`* é uma lista separada por vírgulas de novas definições de partition, que seguem as mesmas regras da lista *`partition_definitions`* usada na instrução [`CREATE TABLE`](create-table.html "13.1.18 CREATE TABLE Statement"). Você não está limitado a fazer merge de várias partitions em uma, ou a dividir uma partition em muitas, ao usar `REORGANIZE PARTITION`. Por exemplo, você pode reorganizar todas as quatro partitions da tabela `members` em duas, assim:

```sql
ALTER TABLE members REORGANIZE PARTITION p0,p1,p2,p3 INTO (
    PARTITION m0 VALUES LESS THAN (1980),
    PARTITION m1 VALUES LESS THAN (2000)
);
```

Você também pode usar `REORGANIZE PARTITION` com tabelas particionadas por `LIST`. Voltemos ao problema de adicionar uma nova partition à tabela `tt` particionada por list e o erro ocorrido porque a nova partition tinha um valor que já estava presente na lista de valores de uma das partitions existentes. Podemos lidar com isso adicionando uma partition que contenha apenas valores não conflitantes e, em seguida, reorganizando a nova partition e a partition existente para que o valor que estava armazenado na existente seja agora movido para a nova:

```sql
ALTER TABLE tt ADD PARTITION (PARTITION np VALUES IN (4, 8));
ALTER TABLE tt REORGANIZE PARTITION p1,np INTO (
    PARTITION p1 VALUES IN (6, 18),
    PARTITION np VALUES in (4, 8, 12)
);
```

Aqui estão alguns pontos chave a serem considerados ao usar `ALTER TABLE ... REORGANIZE PARTITION` para reparticionar tabelas que são particionadas por `RANGE` ou `LIST`:

* As opções `PARTITION` usadas para determinar o novo esquema de Partitioning estão sujeitas às mesmas regras daquelas usadas com uma instrução [`CREATE TABLE`](create-table.html "13.1.18 CREATE TABLE Statement").

  Um novo esquema de Partitioning `RANGE` não pode ter ranges sobrepostos; um novo esquema de Partitioning `LIST` não pode ter conjuntos de valores sobrepostos.

* A combinação de partitions na lista *`partition_definitions`* deve abranger o mesmo range ou conjunto de valores geral que as partitions combinadas nomeadas na *`partition_list`*.

  Por exemplo, as partitions `p1` e `p2` juntas cobrem os anos de 1980 a 1999 na tabela `members` usada como exemplo nesta seção. Qualquer reorganização dessas duas partitions deve cobrir o mesmo range de anos no geral.

* Para tabelas particionadas por `RANGE`, você só pode reorganizar partitions adjacentes; você não pode pular partitions range.

  Por exemplo, você não poderia reorganizar a tabela `members` de exemplo usando uma instrução começando com `ALTER TABLE members REORGANIZE PARTITION p0,p2 INTO ...` porque `p0` cobre os anos anteriores a 1970 e `p2` os anos de 1990 a 1999 (inclusive), portanto, não são partitions adjacentes. (Você não pode pular a partition `p1` neste caso.)

* Você não pode usar `REORGANIZE PARTITION` para alterar o tipo de Partitioning usado pela tabela (por exemplo, você não pode mudar partitions `RANGE` para partitions `HASH` ou vice-versa). Você também não pode usar esta instrução para alterar a expression ou column de Partitioning. Para realizar qualquer uma dessas tarefas sem remover e recriar a tabela, você pode usar [`ALTER TABLE ... PARTITION BY ...`](alter-table-partition-operations.html "13.1.8.1 ALTER TABLE Partition Operations"), conforme mostrado aqui:

  ```sql
  ALTER TABLE members
      PARTITION BY HASH( YEAR(dob) )
      PARTITIONS 8;
  ```