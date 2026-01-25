#### 22.2.3.1 Particionamento RANGE COLUMNS

O particionamento Range columns é semelhante ao particionamento RANGE, mas permite que você defina partições usando Ranges baseados em múltiplos valores de coluna. Além disso, você pode definir os Ranges usando colunas de tipos diferentes dos tipos inteiros.

O particionamento `RANGE COLUMNS` difere significativamente do particionamento `RANGE` das seguintes maneiras:

* `RANGE COLUMNS` não aceita expressões, apenas nomes de colunas.

* `RANGE COLUMNS` aceita uma lista de uma ou mais colunas.

  As partições `RANGE COLUMNS` são baseadas em comparações entre tuplas (listas de valores de coluna) em vez de comparações entre valores escalares. A colocação de linhas em partições `RANGE COLUMNS` também é baseada em comparações entre tuplas; isso será discutido adiante nesta seção.

* As colunas de particionamento `RANGE COLUMNS` não estão restritas a colunas de inteiros; colunas de strings, [`DATE`](datetime.html "11.2.2 The DATE, DATETIME, and TIMESTAMP Types") e [`DATETIME`](datetime.html "11.2.2 The DATE, DATETIME, and TIMESTAMP Types") também podem ser usadas como colunas de particionamento. (Consulte [Seção 22.2.3, “COLUMNS Partitioning”](partitioning-columns.html "22.2.3 COLUMNS Partitioning"), para detalhes.)

A sintaxe básica para criar uma tabela particionada por `RANGE COLUMNS` é mostrada aqui:

```sql
CREATE TABLE table_name
PARTITION BY RANGE COLUMNS(column_list) (
    PARTITION partition_name VALUES LESS THAN (value_list)[,
    PARTITION partition_name VALUES LESS THAN (value_list)][,
    ...]
)

column_list:
    column_name[, column_name][, ...]

value_list:
    value[, value][, ...]
```

Nota

Nem todas as opções de [`CREATE TABLE`](create-table.html "13.1.18 CREATE TABLE Statement") que podem ser usadas ao criar tabelas particionadas são mostradas aqui. Para informações completas, consulte [Seção 13.1.18, “CREATE TABLE Statement”](create-table.html "13.1.18 CREATE TABLE Statement").

Na sintaxe que acabou de ser mostrada, *`column_list`* é uma lista de uma ou mais colunas (às vezes chamada de lista de colunas de particionamento), e *`value_list`* é uma lista de valores (ou seja, é uma lista de valores de definição de partição). Uma *`value_list`* deve ser fornecida para cada definição de partição, e cada *`value_list`* deve ter o mesmo número de valores que a *`column_list`* tem colunas. Em geral, se você usar *`N`* colunas na cláusula `COLUMNS`, então cada cláusula `VALUES LESS THAN` também deve ser fornecida com uma lista de *`N`* valores.

Os elementos na lista de colunas de particionamento e na lista de valores que define cada partição devem ocorrer na mesma ordem. Além disso, cada elemento na lista de valores deve ser do mesmo tipo de dados que o elemento correspondente na lista de colunas. No entanto, a ordem dos nomes das colunas na lista de colunas de particionamento e nas listas de valores não precisa ser a mesma que a ordem das definições de coluna da tabela na parte principal da instrução [`CREATE TABLE`](create-table.html "13.1.18 CREATE TABLE Statement"). Assim como nas tabelas particionadas por `RANGE`, você pode usar `MAXVALUE` para representar um valor tal que qualquer valor legal inserido em uma determinada coluna seja sempre menor que esse valor. Aqui está um exemplo de uma instrução [`CREATE TABLE`](create-table.html "13.1.18 CREATE TABLE Statement") que ajuda a ilustrar todos esses pontos:

```sql
mysql> CREATE TABLE rcx (
    ->     a INT,
    ->     b INT,
    ->     c CHAR(3),
    ->     d INT
    -> )
    -> PARTITION BY RANGE COLUMNS(a,d,c) (
    ->     PARTITION p0 VALUES LESS THAN (5,10,'ggg'),
    ->     PARTITION p1 VALUES LESS THAN (10,20,'mmm'),
    ->     PARTITION p2 VALUES LESS THAN (15,30,'sss'),
    ->     PARTITION p3 VALUES LESS THAN (MAXVALUE,MAXVALUE,MAXVALUE)
    -> );
Query OK, 0 rows affected (0.15 sec)
```

A tabela `rcx` contém as colunas `a`, `b`, `c`, `d`. A lista de colunas de particionamento fornecida à cláusula `COLUMNS` usa 3 dessas colunas, na ordem `a`, `d`, `c`. Cada lista de valores usada para definir uma partição contém 3 valores na mesma ordem; ou seja, cada tupla de lista de valores tem o formato (`INT`, `INT`, `CHAR(3)`), que corresponde aos tipos de dados usados pelas colunas `a`, `d` e `c` (nessa ordem).

A colocação de linhas em partições é determinada pela comparação da tupla de uma linha a ser inserida que corresponde à lista de colunas na cláusula `COLUMNS` com as tuplas usadas nas cláusulas `VALUES LESS THAN` para definir as partições da tabela. Como estamos comparando tuplas (ou seja, listas ou conjuntos de valores) em vez de valores escalares, a semântica de `VALUES LESS THAN` usada com partições `RANGE COLUMNS` difere um pouco do caso com partições `RANGE` simples. No particionamento `RANGE`, uma linha que gera um valor de expressão que é igual a um valor limitante em um `VALUES LESS THAN` nunca é colocada na partição correspondente; no entanto, ao usar o particionamento `RANGE COLUMNS`, às vezes é possível que uma linha cujo primeiro elemento da lista de colunas de particionamento seja igual em valor ao do primeiro elemento em uma lista de valores `VALUES LESS THAN` seja colocada na partição correspondente.

Considere a tabela particionada `RANGE` criada por esta instrução:

```sql
CREATE TABLE r1 (
    a INT,
    b INT
)
PARTITION BY RANGE (a)  (
    PARTITION p0 VALUES LESS THAN (5),
    PARTITION p1 VALUES LESS THAN (MAXVALUE)
);
```

Se inserirmos 3 linhas nesta tabela de modo que o valor da coluna `a` seja `5` para cada linha, todas as 3 linhas serão armazenadas na partição `p1` porque o valor da coluna `a` não é, em cada caso, menor que 5, como podemos ver executando a Query apropriada na tabela [`PARTITIONS`](information-schema-partitions-table.html "24.3.16 The INFORMATION_SCHEMA PARTITIONS Table") do Information Schema:

```sql
mysql> INSERT INTO r1 VALUES (5,10), (5,11), (5,12);
Query OK, 3 rows affected (0.00 sec)
Records: 3  Duplicates: 0  Warnings: 0

mysql> SELECT PARTITION_NAME, TABLE_ROWS
    ->     FROM INFORMATION_SCHEMA.PARTITIONS
    ->     WHERE TABLE_NAME = 'r1';
+----------------+------------+
| PARTITION_NAME | TABLE_ROWS |
+----------------+------------+
| p0             |          0 |
| p1             |          3 |
+----------------+------------+
2 rows in set (0.00 sec)
```

Agora considere uma tabela semelhante `rc1` que usa o particionamento `RANGE COLUMNS` com as colunas `a` e `b` referenciadas na cláusula `COLUMNS`, criada como mostrado aqui:

```sql
CREATE TABLE rc1 (
    a INT,
    b INT
)
PARTITION BY RANGE COLUMNS(a, b) (
    PARTITION p0 VALUES LESS THAN (5, 12),
    PARTITION p3 VALUES LESS THAN (MAXVALUE, MAXVALUE)
);
```

Se inserirmos exatamente as mesmas linhas em `rc1` que acabamos de inserir em `r1`, a distribuição das linhas é bastante diferente:

```sql
mysql> INSERT INTO rc1 VALUES (5,10), (5,11), (5,12);
Query OK, 3 rows affected (0.00 sec)
Records: 3  Duplicates: 0  Warnings: 0

mysql> SELECT PARTITION_NAME, TABLE_ROWS
    ->     FROM INFORMATION_SCHEMA.PARTITIONS
    ->     WHERE TABLE_NAME = 'rc1';
+----------------+------------+
| PARTITION_NAME | TABLE_ROWS |
+----------------+------------+
| p0             |          2 |
| p3             |          1 |
+----------------+------------+
2 rows in set (0.00 sec)
```

Isso ocorre porque estamos comparando linhas em vez de valores escalares. Podemos comparar os valores de linha inseridos com o valor de linha limitante da cláusula `VALUES THAN LESS THAN` usada para definir a partição `p0` na tabela `rc1`, assim:

```sql
mysql> SELECT (5,10) < (5,12), (5,11) < (5,12), (5,12) < (5,12);
+-----------------+-----------------+-----------------+
| (5,10) < (5,12) | (5,11) < (5,12) | (5,12) < (5,12) |
+-----------------+-----------------+-----------------+
|               1 |               1 |               0 |
+-----------------+-----------------+-----------------+
1 row in set (0.00 sec)
```

As 2 tuplas `(5,10)` e `(5,11)` são avaliadas como menores que `(5,12)`, então são armazenadas na partição `p0`. Como 5 não é menor que 5 e 12 não é menor que 12, `(5,12)` é considerado não menor que `(5,12)` e é armazenado na partição `p1`.

A instrução [`SELECT`](select.html "13.2.9 SELECT Statement") no exemplo anterior também poderia ter sido escrita usando construtores de linha explícitos, assim:

```sql
SELECT ROW(5,10) < ROW(5,12), ROW(5,11) < ROW(5,12), ROW(5,12) < ROW(5,12);
```

Para obter mais informações sobre o uso de construtores de linha no MySQL, consulte [Seção 13.2.10.5, “Row Subqueries”](row-subqueries.html "13.2.10.5 Row Subqueries").

Para uma tabela particionada por `RANGE COLUMNS` usando apenas uma única coluna de particionamento, o armazenamento de linhas em partições é o mesmo que o de uma tabela equivalente que é particionada por `RANGE`. A seguinte instrução `CREATE TABLE` cria uma tabela particionada por `RANGE COLUMNS` usando 1 coluna de particionamento:

```sql
CREATE TABLE rx (
    a INT,
    b INT
)
PARTITION BY RANGE COLUMNS (a)  (
    PARTITION p0 VALUES LESS THAN (5),
    PARTITION p1 VALUES LESS THAN (MAXVALUE)
);
```

Se inserirmos as linhas `(5,10)`, `(5,11)` e `(5,12)` nesta tabela, podemos ver que sua colocação é a mesma que para a tabela `r` que criamos e populamos anteriormente:

```sql
mysql> INSERT INTO rx VALUES (5,10), (5,11), (5,12);
Query OK, 3 rows affected (0.00 sec)
Records: 3  Duplicates: 0  Warnings: 0

mysql> SELECT PARTITION_NAME,TABLE_ROWS
    ->     FROM INFORMATION_SCHEMA.PARTITIONS
    ->     WHERE TABLE_NAME = 'rx';
+----------------+------------+
| PARTITION_NAME | TABLE_ROWS |
+----------------+------------+
| p0             |          0 |
| p1             |          3 |
+----------------+------------+
2 rows in set (0.00 sec)
```

Também é possível criar tabelas particionadas por `RANGE COLUMNS` onde valores limitantes para uma ou mais colunas são repetidos em definições de partição sucessivas. Você pode fazer isso desde que as tuplas de valores de coluna usadas para definir as partições sejam estritamente crescentes. Por exemplo, cada uma das seguintes instruções [`CREATE TABLE`](create-table.html "13.1.18 CREATE TABLE Statement") é válida:

```sql
CREATE TABLE rc2 (
    a INT,
    b INT
)
PARTITION BY RANGE COLUMNS(a,b) (
    PARTITION p0 VALUES LESS THAN (0,10),
    PARTITION p1 VALUES LESS THAN (10,20),
    PARTITION p2 VALUES LESS THAN (10,30),
    PARTITION p3 VALUES LESS THAN (MAXVALUE,MAXVALUE)
 );

CREATE TABLE rc3 (
    a INT,
    b INT
)
PARTITION BY RANGE COLUMNS(a,b) (
    PARTITION p0 VALUES LESS THAN (0,10),
    PARTITION p1 VALUES LESS THAN (10,20),
    PARTITION p2 VALUES LESS THAN (10,30),
    PARTITION p3 VALUES LESS THAN (10,35),
    PARTITION p4 VALUES LESS THAN (20,40),
    PARTITION p5 VALUES LESS THAN (MAXVALUE,MAXVALUE)
 );
```

A seguinte instrução também é bem-sucedida, embora possa parecer à primeira vista que não seria, já que o valor limitante da coluna `b` é 25 para a partição `p0` e 20 para a partição `p1`, e o valor limitante da coluna `c` é 100 para a partição `p1` e 50 para a partição `p2`:

```sql
CREATE TABLE rc4 (
    a INT,
    b INT,
    c INT
)
PARTITION BY RANGE COLUMNS(a,b,c) (
    PARTITION p0 VALUES LESS THAN (0,25,50),
    PARTITION p1 VALUES LESS THAN (10,20,100),
    PARTITION p2 VALUES LESS THAN (10,30,50),
    PARTITION p3 VALUES LESS THAN (MAXVALUE,MAXVALUE,MAXVALUE)
 );
```

Ao projetar tabelas particionadas por `RANGE COLUMNS`, você sempre pode testar definições de partição sucessivas comparando as tuplas desejadas usando o cliente [**mysql**](mysql.html "4.5.1 mysql — The MySQL Command-Line Client"), assim:

```sql
mysql> SELECT (0,25,50) < (10,20,100), (10,20,100) < (10,30,50);
+-------------------------+--------------------------+
| (0,25,50) < (10,20,100) | (10,20,100) < (10,30,50) |
+-------------------------+--------------------------+
|                       1 |                        1 |
+-------------------------+--------------------------+
1 row in set (0.00 sec)
```

Se uma instrução [`CREATE TABLE`](create-table.html "13.1.18 CREATE TABLE Statement") contiver definições de partição que não estejam em ordem estritamente crescente, ela falhará com um erro, como mostrado neste exemplo:

```sql
mysql> CREATE TABLE rcf (
    ->     a INT,
    ->     b INT,
    ->     c INT
    -> )
    -> PARTITION BY RANGE COLUMNS(a,b,c) (
    ->     PARTITION p0 VALUES LESS THAN (0,25,50),
    ->     PARTITION p1 VALUES LESS THAN (20,20,100),
    ->     PARTITION p2 VALUES LESS THAN (10,30,50),
    ->     PARTITION p3 VALUES LESS THAN (MAXVALUE,MAXVALUE,MAXVALUE)
    ->  );
ERROR 1493 (HY000): VALUES LESS THAN value must be strictly increasing for each partition
```

Ao receber tal erro, você pode deduzir quais definições de partição são inválidas fazendo comparações de "menor que" entre suas listas de colunas. Neste caso, o problema está na definição da partição `p2` porque a tupla usada para defini-la não é menor que a tupla usada para definir a partição `p3`, como mostrado aqui:

```sql
mysql> SELECT (0,25,50) < (20,20,100), (20,20,100) < (10,30,50);
+-------------------------+--------------------------+
| (0,25,50) < (20,20,100) | (20,20,100) < (10,30,50) |
+-------------------------+--------------------------+
|                       1 |                        0 |
+-------------------------+--------------------------+
1 row in set (0.00 sec)
```

Também é possível que `MAXVALUE` apareça para a mesma coluna em mais de uma cláusula `VALUES LESS THAN` ao usar `RANGE COLUMNS`. No entanto, os valores limitantes para colunas individuais em definições de partição sucessivas devem ser crescentes, não deve haver mais de uma partição definida onde `MAXVALUE` é usado como limite superior para todos os valores de coluna, e esta definição de partição deve aparecer por último na lista de cláusulas `PARTITION ... VALUES LESS THAN`. Além disso, você não pode usar `MAXVALUE` como valor limitante para a primeira coluna em mais de uma definição de partição.

Conforme declarado anteriormente, também é possível com o particionamento `RANGE COLUMNS` usar colunas não inteiras como colunas de particionamento. (Consulte [Seção 22.2.3, “COLUMNS Partitioning”](partitioning-columns.html "22.2.3 COLUMNS Partitioning"), para uma listagem completa destas.) Considere uma tabela chamada `employees` (que não é particionada), criada usando a seguinte instrução:

```sql
CREATE TABLE employees (
    id INT NOT NULL,
    fname VARCHAR(30),
    lname VARCHAR(30),
    hired DATE NOT NULL DEFAULT '1970-01-01',
    separated DATE NOT NULL DEFAULT '9999-12-31',
    job_code INT NOT NULL,
    store_id INT NOT NULL
);
```

Usando o particionamento `RANGE COLUMNS`, você pode criar uma versão desta tabela que armazena cada linha em uma de quatro partições com base no sobrenome do funcionário, assim:

```sql
CREATE TABLE employees_by_lname (
    id INT NOT NULL,
    fname VARCHAR(30),
    lname VARCHAR(30),
    hired DATE NOT NULL DEFAULT '1970-01-01',
    separated DATE NOT NULL DEFAULT '9999-12-31',
    job_code INT NOT NULL,
    store_id INT NOT NULL
)
PARTITION BY RANGE COLUMNS (lname)  (
    PARTITION p0 VALUES LESS THAN ('g'),
    PARTITION p1 VALUES LESS THAN ('m'),
    PARTITION p2 VALUES LESS THAN ('t'),
    PARTITION p3 VALUES LESS THAN (MAXVALUE)
);
```

Alternativamente, você poderia fazer com que a tabela `employees`, conforme criada anteriormente, fosse particionada usando este esquema, executando a seguinte instrução [`ALTER TABLE`](alter-table-partition-operations.html "13.1.8.1 ALTER TABLE Partition Operations"):

```sql
ALTER TABLE employees PARTITION BY RANGE COLUMNS (lname)  (
    PARTITION p0 VALUES LESS THAN ('g'),
    PARTITION p1 VALUES LESS THAN ('m'),
    PARTITION p2 VALUES LESS THAN ('t'),
    PARTITION p3 VALUES LESS THAN (MAXVALUE)
);
```

Nota

Como diferentes conjuntos de caracteres (character sets) e collations (agrupamentos/ordenações) têm diferentes ordens de classificação (sort orders), os character sets e collations em uso podem afetar em qual partição de uma tabela particionada por `RANGE COLUMNS` uma determinada linha é armazenada ao usar colunas de string como colunas de particionamento. Além disso, alterar o character set ou collation para um determinado Database, tabela ou coluna após a criação de tal tabela pode causar mudanças na forma como as linhas são distribuídas. Por exemplo, ao usar um collation que diferencia maiúsculas de minúsculas (case-sensitive), `'and'` é classificado antes de `'Andersen'`, mas ao usar um collation que não diferencia maiúsculas de minúsculas (case-insensitive), o inverso é verdadeiro.

Para obter informações sobre como o MySQL lida com character sets e collations, consulte [Capítulo 10, *Character Sets, Collations, Unicode*](charset.html "Chapter 10 Character Sets, Collations, Unicode").

Da mesma forma, você pode fazer com que a tabela `employees` seja particionada de tal forma que cada linha seja armazenada em uma de várias partições com base na década em que o funcionário correspondente foi contratado, usando a instrução [`ALTER TABLE`](alter-table-partition-operations.html "13.1.8.1 ALTER TABLE Partition Operations") mostrada aqui:

```sql
ALTER TABLE employees PARTITION BY RANGE COLUMNS (hired)  (
    PARTITION p0 VALUES LESS THAN ('1970-01-01'),
    PARTITION p1 VALUES LESS THAN ('1980-01-01'),
    PARTITION p2 VALUES LESS THAN ('1990-01-01'),
    PARTITION p3 VALUES LESS THAN ('2000-01-01'),
    PARTITION p4 VALUES LESS THAN ('2010-01-01'),
    PARTITION p5 VALUES LESS THAN (MAXVALUE)
);
```

Consulte [Seção 13.1.18, “CREATE TABLE Statement”](create-table.html "13.1.18 CREATE TABLE Statement"), para obter informações adicionais sobre a sintaxe `PARTITION BY RANGE COLUMNS`.