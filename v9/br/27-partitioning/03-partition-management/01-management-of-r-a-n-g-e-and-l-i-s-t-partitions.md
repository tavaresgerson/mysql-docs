### 26.3.1 Gerenciamento de Partições RANGE e LIST

A adição e remoção de partições RANGE e LIST são tratadas de maneira semelhante, então discutiremos o gerenciamento de ambos os tipos de particionamento nesta seção. Para informações sobre o trabalho com tabelas particionadas por hash ou chave, consulte a Seção 26.3.2, “Gerenciamento de Partições HASH e KEY”.

A remoção de uma partição de uma tabela particionada por `RANGE` ou por `LIST` pode ser realizada usando a instrução `ALTER TABLE` com a opção `DROP PARTITION`. Suponha que você tenha criado uma tabela particionada por intervalo e depois preenchida com 10 registros usando as seguintes instruções `CREATE TABLE` e `INSERT`:

```
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

Você pode ver quais itens deveriam ter sido inseridos na partição `p2`, conforme mostrado aqui:

```
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

Você também pode obter essas informações usando a seleção de partições, conforme mostrado aqui:

```
mysql> SELECT * FROM tr PARTITION (p2);
+------+-------------+------------+
| id   | name        | purchased  |
+------+-------------+------------+
|    2 | alarm clock | 1997-11-05 |
|   10 | lava lamp   | 1998-12-25 |
+------+-------------+------------+
2 rows in set (0.00 sec)
```

Consulte a Seção 26.5, “Seleção de Partições”, para mais informações.

Para remover a partição nomeada `p2`, execute o seguinte comando:

```
mysql> ALTER TABLE tr DROP PARTITION p2;
Query OK, 0 rows affected (0.03 sec)
```

Observação

O mecanismo de armazenamento `NDBCLUSTER` não suporta `ALTER TABLE ... DROP PARTITION`. No entanto, ele suporta as outras extensões relacionadas à particionamento de `ALTER TABLE` descritas neste capítulo.

É muito importante lembrar que, *quando você remove uma partição, também exclui todos os dados que foram armazenados nessa partição*. Você pode ver que isso é o caso ao executar novamente a consulta `SELECT` anterior:

```
mysql> SELECT * FROM tr WHERE purchased
    -> BETWEEN '1995-01-01' AND '1999-12-31';
Empty set (0.00 sec)
```

Observação

A instrução `DROP PARTITION` é suportada pelas APIs nativas de particionamento in-place e pode ser usada com o parâmetro `ALGORITHM={COPY|INPLACE}`. A instrução `DROP PARTITION` com `ALGORITHM=INPLACE` exclui os dados armazenados na partição e elimina a partição. No entanto, a instrução `DROP PARTITION` com `ALGORITHM=COPY` ou `old_alter_table=ON` reconstrui a tabela particionada e tenta mover os dados da partição excluída para outra partição com uma definição de `PARTITION ... VALUES` compatível. Os dados que não podem ser movidos para outra partição são excluídos.

Por isso, você deve ter o privilégio `DROP` para uma tabela antes de poder executar a instrução `ALTER TABLE ... DROP PARTITION` nessa tabela.

Se você deseja excluir todos os dados de todas as partições, preservando a definição da tabela e seu esquema de particionamento, use a instrução `TRUNCATE TABLE`. (Consulte a Seção 15.1.42, “Instrução TRUNCATE TABLE”.)

Se você pretende alterar o particionamento de uma tabela *sem* perder dados, use a instrução `ALTER TABLE ... REORGANIZE PARTITION` em vez disso. Consulte abaixo ou na Seção 15.1.11, “Instrução ALTER TABLE”, para obter informações sobre `REORGANIZE PARTITION`.

Se você executar agora a instrução `SHOW CREATE TABLE`, poderá ver como a composição da particionamento da tabela foi alterada:

```
mysql> SHOW CREATE TABLE tr\G
*************************** 1. row ***************************
       Table: tr
Create Table: CREATE TABLE `tr` (
  `id` int(11) DEFAULT NULL,
  `name` varchar(50) DEFAULT NULL,
  `purchased` date DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci
/*!50100 PARTITION BY RANGE ( YEAR(purchased))
(PARTITION p0 VALUES LESS THAN (1990) ENGINE = InnoDB,
 PARTITION p1 VALUES LESS THAN (1995) ENGINE = InnoDB,
 PARTITION p3 VALUES LESS THAN (2005) ENGINE = InnoDB,
 PARTITION p4 VALUES LESS THAN (2010) ENGINE = InnoDB,
 PARTITION p5 VALUES LESS THAN (2015) ENGINE = InnoDB) */
1 row in set (0.00 sec)
```

Quando você inserir novas linhas na tabela alterada com valores da coluna `purchased` entre `'1995-01-01'` e `'2004-12-31'` inclusivos, essas linhas são armazenadas na partição `p3`. Você pode verificar isso da seguinte forma:

```
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

O número de linhas excluídas da tabela como resultado da instrução `ALTER TABLE ... DROP PARTITION` não é reportado pelo servidor como seria pela consulta `DELETE` equivalente.

A remoção de partições `LIST` usa exatamente a mesma sintaxe de `ALTER TABLE ... DROP PARTITION` usada para a remoção de partições `RANGE`. No entanto, há uma diferença importante no efeito que isso tem no uso da tabela posteriormente: você não pode mais inserir na tabela quaisquer linhas que tenham algum dos valores incluídos na lista de valores que definem a partição excluída. (Veja a Seção 26.2.2, “Partição LIST”, para um exemplo.)

Para adicionar uma nova partição de intervalo ou lista a uma tabela previamente particionada, use a instrução `ALTER TABLE ... ADD PARTITION`. Para tabelas que são particionadas por `RANGE`, isso pode ser usado para adicionar um novo intervalo ao final da lista de partições existentes. Suponha que você tenha uma tabela particionada que contém dados de membros para sua organização, definida da seguinte forma:

```
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

Suponha ainda que a idade mínima para os membros seja de 16 anos. À medida que o calendário se aproxima do final de 2015, você percebe que deve estar pronto para admitir membros que nasceram em 2000 (e depois). Você pode modificar a tabela `members` para acomodar novos membros nascidos nos anos de 2000 a 2010, como mostrado aqui:

```
ALTER TABLE members ADD PARTITION (PARTITION p3 VALUES LESS THAN (2010));
```

Com tabelas que são particionadas por intervalo, você pode usar `ADD PARTITION` para adicionar novas partições ao final da lista de partições. Tentar adicionar uma nova partição dessa maneira entre ou antes das partições existentes resulta em um erro, como mostrado aqui:

```
mysql> ALTER TABLE members
     >     ADD PARTITION (
     >     PARTITION n VALUES LESS THAN (1970));
ERROR 1463 (HY000): VALUES LESS THAN value must be strictly »
   increasing for each partition
```

Você pode contornar esse problema reorganizando a primeira partição em duas novas que dividem o intervalo entre elas, assim:

```
ALTER TABLE members
    REORGANIZE PARTITION p0 INTO (
        PARTITION n0 VALUES LESS THAN (1970),
        PARTITION n1 VALUES LESS THAN (1980)
);
```

Usando `SHOW CREATE TABLE`, você pode ver que a instrução `ALTER TABLE` teve o efeito desejado:

```
mysql> SHOW CREATE TABLE members\G
*************************** 1. row ***************************
       Table: members
Create Table: CREATE TABLE `members` (
  `id` int(11) DEFAULT NULL,
  `fname` varchar(25) DEFAULT NULL,
  `lname` varchar(25) DEFAULT NULL,
  `dob` date DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci
/*!50100 PARTITION BY RANGE ( YEAR(dob))
(PARTITION n0 VALUES LESS THAN (1970) ENGINE = InnoDB,
 PARTITION n1 VALUES LESS THAN (1980) ENGINE = InnoDB,
 PARTITION p1 VALUES LESS THAN (1990) ENGINE = InnoDB,
 PARTITION p2 VALUES LESS THAN (2000) ENGINE = InnoDB,
 PARTITION p3 VALUES LESS THAN (2010) ENGINE = InnoDB) */
1 row in set (0.00 sec)
```

Veja também a Seção 15.1.11.1, “Operações de Partição ALTER TABLE”.

Você também pode usar `ALTER TABLE ... ADD PARTITION` para adicionar novas partições a uma tabela que está particionada por `LIST`. Suponha que uma tabela `tt` seja definida usando a seguinte instrução `CREATE TABLE`:

```
CREATE TABLE tt (
    id INT,
    data INT
)
PARTITION BY LIST(data) (
    PARTITION p0 VALUES IN (5, 10, 15),
    PARTITION p1 VALUES IN (6, 12, 18)
);
```

Você pode adicionar uma nova partição para armazenar linhas com os valores da coluna `data` `7`, `14` e `21`, conforme mostrado:

```
ALTER TABLE tt ADD PARTITION (PARTITION p2 VALUES IN (7, 14, 21));
```

Lembre-se de que você *não pode* adicionar uma nova partição `LIST` que abranja quaisquer valores que já estejam incluídos na lista de valores de uma partição existente. Se você tentar fazer isso, um erro será gerado:

```
mysql> ALTER TABLE tt ADD PARTITION
     >     (PARTITION np VALUES IN (4, 8, 12));
ERROR 1465 (HY000): Multiple definition of same constant »
                    in list partitioning
```

Como qualquer linha com o valor da coluna `data` `12` já foi atribuída à partição `p1`, você não pode criar uma nova partição na tabela `tt` que inclua `12` em sua lista de valores. Para isso, você poderia excluir `p1` e adicionar `np` e, em seguida, uma nova `p1` com uma definição modificada. No entanto, como discutido anteriormente, isso resultaria na perda de todos os dados armazenados em `p1` — e muitas vezes isso não é o que você realmente deseja fazer. Outra solução pode parecer ser fazer uma cópia da tabela com a nova particionamento e copiar os dados para ela usando `CREATE TABLE ... SELECT ...`, depois excluir a tabela antiga e renomear a nova, mas isso pode ser muito demorado ao lidar com grandes quantidades de dados. Isso também pode não ser viável em situações onde a alta disponibilidade é um requisito.

Você pode adicionar múltiplas partições em uma única instrução `ALTER TABLE ... ADD PARTITION`, como mostrado aqui:

```
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

Felizmente, a implementação de particionamento do MySQL oferece maneiras de redefinir partições sem perder dados. Vamos primeiro olhar para alguns exemplos simples envolvendo particionamento `RANGE`. Lembre-se da tabela `members` que agora é definida como mostrado aqui:

```
mysql> SHOW CREATE TABLE members\G
*************************** 1. row ***************************
       Table: members
Create Table: CREATE TABLE `members` (
  `id` int(11) DEFAULT NULL,
  `fname` varchar(25) DEFAULT NULL,
  `lname` varchar(25) DEFAULT NULL,
  `dob` date DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci
/*!50100 PARTITION BY RANGE ( YEAR(dob))
(PARTITION n0 VALUES LESS THAN (1970) ENGINE = InnoDB,
 PARTITION n1 VALUES LESS THAN (1980) ENGINE = InnoDB,
 PARTITION p1 VALUES LESS THAN (1990) ENGINE = InnoDB,
 PARTITION p2 VALUES LESS THAN (2000) ENGINE = InnoDB,
 PARTITION p3 VALUES LESS THAN (2010) ENGINE = InnoDB) */
1 row in set (0.00 sec)
```

Suponha que você queira mover todas as linhas que representam membros nascidos antes de 1960 para uma partição separada. Como já vimos, isso não pode ser feito usando `ALTER TABLE ... ADD PARTITION`. No entanto, você pode usar outra extensão relacionada a partições no `ALTER TABLE` para realizar isso:

```
ALTER TABLE members REORGANIZE PARTITION n0 INTO (
    PARTITION s0 VALUES LESS THAN (1960),
    PARTITION s1 VALUES LESS THAN (1970)
);
```

Na verdade, este comando divide a partição `n0` em duas novas partições `s0` e `s1`. Ele também move os dados que estavam armazenados em `n0` para as novas partições de acordo com as regras incorporadas nas duas cláusulas `PARTITION ... VALUES ...`, de modo que `s0` contém apenas aqueles registros para os quais `YEAR(dob)` é menor que 1960 e `s1` contém as linhas nas quais `YEAR(dob)` é maior ou igual a 1960, mas menor que 1970.

Uma cláusula `REORGANIZE PARTITION` também pode ser usada para mesclar partições adjacentes. Você pode reverter o efeito da declaração anterior na tabela `members` como mostrado aqui:

```
ALTER TABLE members REORGANIZE PARTITION s0,s1 INTO (
    PARTITION p0 VALUES LESS THAN (1970)
);
```

Nenhum dado é perdido ao dividir ou mesclar partições usando `REORGANIZE PARTITION`. Ao executar a declaração acima, o MySQL move todos os registros que estavam armazenados nas partições `s0` e `s1` para a partição `p0`.

A sintaxe geral para `REORGANIZE PARTITION` é mostrada aqui:

```
ALTER TABLE tbl_name
    REORGANIZE PARTITION partition_list
    INTO (partition_definitions);
```

Aqui, *`tbl_name`* é o nome da tabela particionada, e *`partition_list`* é uma lista separada por vírgula de nomes de uma ou mais partições existentes a serem alteradas. *`partition_definitions`* é uma lista separada por vírgula de novas definições de partição, que seguem as mesmas regras que as listas de *`partition_definitions`* usadas em `CREATE TABLE`. Você não está limitado a mesclar várias partições em uma, ou a dividir uma partição em muitas, ao usar `REORGANIZE PARTITION`. Por exemplo, você pode reorganizar todas as quatro partições da tabela `members` em duas, assim:

```
ALTER TABLE members REORGANIZE PARTITION p0,p1,p2,p3 INTO (
    PARTITION m0 VALUES LESS THAN (1980),
    PARTITION m1 VALUES LESS THAN (2000)
);
```

Você também pode usar `REORGANIZE PARTITION` com tabelas que são particionadas por `LIST`. Vamos voltar ao problema de adicionar uma nova partição à tabela `tt` particionada por `LIST` e falhar porque a nova partição tinha um valor que já estava presente na lista de valores de uma das partições existentes. Podemos resolver isso adicionando uma partição que contenha apenas valores não conflitantes e, em seguida, reorganizando a nova partição e a existente para que o valor que foi armazenado na existente agora seja movido para a nova:

```
ALTER TABLE tt ADD PARTITION (PARTITION np VALUES IN (4, 8));
ALTER TABLE tt REORGANIZE PARTITION p1,np INTO (
    PARTITION p1 VALUES IN (6, 18),
    PARTITION np VALUES in (4, 8, 12)
);
```

Aqui estão alguns pontos importantes a serem lembrados ao usar `ALTER TABLE ... REORGANIZE PARTITION` para repartir tabelas que são particionadas por `RANGE` ou `LIST`:

* As opções `PARTITION` usadas para determinar o novo esquema de particionamento estão sujeitas às mesmas regras que as usadas com uma declaração `CREATE TABLE`.

  Um novo esquema de particionamento `RANGE` não pode ter nenhum intervalo sobrepostos; um novo esquema de particionamento `LIST` não pode ter nenhum conjunto de valores sobrepostos.

* A combinação de partições na lista *`partition_definitions`* deve considerar o mesmo intervalo ou conjunto de valores no geral que as partições combinadas nomeadas na lista *`partition_list`*.

  Por exemplo, as partições `p1` e `p2` juntas cobrem os anos de 1980 a 1999 na tabela `members` usada como exemplo nesta seção. Qualquer reorganização dessas duas partições deve cobrir o mesmo intervalo de anos no geral.

* Para tabelas particionadas por `RANGE`, você pode reorganizar apenas partições adjacentes; você não pode pular partições de intervalo.

Por exemplo, você não poderia reorganizar a tabela `members` usando uma instrução que comece com `ALTER TABLE members REORGANIZE PARTITION p0,p2 INTO ...`, porque `p0` abrange os anos anteriores a 1970 e `p2` os anos de 1990 a 1999 inclusive, então essas não são partições adjacentes. (Você não pode pular a partição `p1` neste caso.)

* Você não pode usar `REORGANIZE PARTITION` para alterar o tipo de partição usado pela tabela (por exemplo, você não pode alterar partições `RANGE` para partições `HASH` ou vice-versa). Você também não pode usar essa instrução para alterar a expressão de partição ou coluna. Para realizar qualquer uma dessas tarefas sem descartar e recriar a tabela, você pode usar `ALTER TABLE ... PARTITION BY ...`, como mostrado aqui:

  ```
  ALTER TABLE members
      PARTITION BY HASH( YEAR(dob) )
      PARTITIONS 8;
  ```