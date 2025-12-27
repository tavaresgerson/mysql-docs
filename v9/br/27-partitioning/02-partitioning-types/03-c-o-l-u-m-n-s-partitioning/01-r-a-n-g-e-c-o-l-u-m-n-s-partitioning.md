#### 26.2.3.1 Partição de colunas de intervalo

A partição de colunas de intervalo é semelhante à partição de intervalo, mas permite que você defina partições usando intervalos baseados em múltiplos valores de coluna. Além disso, você pode definir os intervalos usando colunas de tipos diferentes dos inteiros.

A partição `RANGE COLUMNS` difere significativamente da partição `RANGE` das seguintes maneiras:

* A `RANGE COLUMNS` não aceita expressões, apenas nomes de colunas.

* A `RANGE COLUMNS` aceita uma lista de uma ou mais colunas.

As partições `RANGE COLUMNS` são baseadas em comparações entre tuplas (listas de valores de coluna) em vez de comparações entre valores escalares. O posicionamento das linhas nas partições `RANGE COLUMNS` também é baseado em comparações entre tuplas; isso é discutido mais adiante nesta seção.

As colunas de partição `RANGE COLUMNS` não são restritas a colunas inteiras; colunas de tipo `STRING`, `DATE` e `DATETIME` também podem ser usadas como colunas de partição. (Consulte a Seção 26.2.3, “Partição de Colunas”, para detalhes.)

A sintaxe básica para criar uma tabela particionada por `RANGE COLUMNS` é mostrada aqui:

```
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

Nem todas as opções de `CREATE TABLE` que podem ser usadas ao criar tabelas particionadas estão mostradas aqui. Para informações completas, consulte a Seção 15.1.24, “Instrução CREATE TABLE”.

Na sintaxe mostrada acima, *`column_list`* é uma lista de uma ou mais colunas (às vezes chamada de lista de colunas de particionamento) e *`value_list`* é uma lista de valores (ou seja, é uma lista de valores de definição de particionamento). Uma *`value_list`* deve ser fornecida para cada definição de particionamento, e cada *`value_list`* deve ter o mesmo número de valores que a *`column_list`* tem colunas. De modo geral, se você usar *`N`* colunas na cláusula `COLUMNS`, então cada cláusula `VALUES LESS THAN` também deve ser fornecida com uma lista de *`N`* valores.

Os elementos na lista de colunas de particionamento e na lista de valores que definem cada particionamento devem ocorrer na mesma ordem. Além disso, cada elemento na lista de valores deve ser do mesmo tipo de dado que o elemento correspondente na lista de colunas. No entanto, a ordem dos nomes das colunas na lista de colunas de particionamento e nas listas de valores não precisa ser a mesma que a ordem das definições de colunas da tabela na parte principal da declaração `CREATE TABLE`. Assim como na particionamento da tabela por `RANGE`, você pode usar `MAXVALUE` para representar um valor de modo que qualquer valor legal inserido em uma coluna dada seja sempre menor que esse valor. Aqui está um exemplo de uma declaração `CREATE TABLE` que ajuda a ilustrar todos esses pontos:

```
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

A tabela `rcx` contém as colunas `a`, `b`, `c`, `d`. A lista de colunas de particionamento fornecida à cláusula `COLUMNS` usa 3 dessas colunas, na ordem `a`, `d`, `c`. Cada lista de valores usada para definir uma particionamento contém 3 valores na mesma ordem; ou seja, cada tupla da lista de valores tem a forma (`INT`, `INT`, `CHAR(3)`), o que corresponde aos tipos de dados usados pelas colunas `a`, `d` e `c` (naquela ordem).

A colocação de linhas em partições é determinada ao comparar o tuplo de uma linha a ser inserida que corresponde à lista de colunas na cláusula `COLUMNS` com os tuplos usados nas cláusulas `VALUES LESS THAN` para definir partições da tabela. Como estamos comparando tuplos (ou seja, listas ou conjuntos de valores) em vez de valores escalares, a semântica de `VALUES LESS THAN` quando usada com partições `RANGE COLUMNS` difere um pouco do caso com partições simples `RANGE`. Na partição `RANGE`, uma linha que gera um valor de expressão que é igual a um valor limite em uma cláusula `VALUES LESS THAN` nunca é colocada na partição correspondente; no entanto, ao usar a partição `RANGE COLUMNS`, às vezes é possível que uma linha cujo primeiro elemento da lista de colunas de partição tenha o mesmo valor que o primeiro elemento em uma lista de valores de `VALUES LESS THAN` seja colocada na partição correspondente.

Considere a tabela particionada `RANGE` criada por esta declaração:

```
CREATE TABLE r1 (
    a INT,
    b INT
)
PARTITION BY RANGE (a)  (
    PARTITION p0 VALUES LESS THAN (5),
    PARTITION p1 VALUES LESS THAN (MAXVALUE)
);
```

Se inserirmos 3 linhas nesta tabela de modo que o valor da coluna para `a` seja `5` para cada linha, todas as 3 linhas são armazenadas na partição `p1` porque o valor da coluna `a` em cada caso não é menor que 5, como podemos ver executando a consulta adequada contra a tabela `PARTITIONS` do Schema de Informações:

```
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

Agora, considere uma tabela semelhante `rc1` que usa a partição `RANGE COLUMNS` com as colunas `a` e `b` referenciadas na cláusula `COLUMNS`, criada como mostrado aqui:

```
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

```
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

Isso ocorre porque estamos comparando linhas em vez de valores escalares. Podemos comparar os valores das linhas inseridos com o valor máximo da linha da cláusula `VALUES THAN LESS THAN` usada para definir a partição `p0` na tabela `rc1`, da seguinte forma:

```
mysql> SELECT (5,10) < (5,12), (5,11) < (5,12), (5,12) < (5,12);
+-----------------+-----------------+-----------------+
| (5,10) < (5,12) | (5,11) < (5,12) | (5,12) < (5,12) |
+-----------------+-----------------+-----------------+
|               1 |               1 |               0 |
+-----------------+-----------------+-----------------+
1 row in set (0.00 sec)
```

Os 2 tuplos `(5,10)` e `(5,11)` avaliam como sendo menores que `(5,12)`, então eles são armazenados na partição `p0`. Como 5 não é menor que 5 e 12 não é menor que 12, `(5,12)` é considerado não menor que `(5,12)`, e é armazenado na partição `p1`.

A instrução `SELECT` no exemplo anterior também poderia ter sido escrita usando construtores de linha explícitos, da seguinte forma:

```
SELECT ROW(5,10) < ROW(5,12), ROW(5,11) < ROW(5,12), ROW(5,12) < ROW(5,12);
```

Para mais informações sobre o uso de construtores de linha no MySQL, consulte a Seção 15.2.15.5, “Subconsultas de Linha”.

Para uma tabela particionada por `COLUMNS RANGE` usando apenas uma única coluna de particionamento, o armazenamento das linhas nas partições é o mesmo que o de uma tabela equivalente que é particionada por `RANGE`. A seguinte instrução `CREATE TABLE` cria uma tabela particionada por `COLUMNS RANGE` usando 1 coluna de particionamento:

```
CREATE TABLE rx (
    a INT,
    b INT
)
PARTITION BY RANGE COLUMNS (a)  (
    PARTITION p0 VALUES LESS THAN (5),
    PARTITION p1 VALUES LESS THAN (MAXVALUE)
);
```

Se inserirmos as linhas `(5,10)`, `(5,11)` e `(5,12)` nesta tabela, podemos ver que seu posicionamento é o mesmo que o da tabela `r` que criamos e populamos anteriormente:

```
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

Também é possível criar tabelas particionadas por `COLUMNS RANGE` onde os valores limítrofes de uma ou mais colunas são repetidos em definições de partição sucessivas. Você pode fazer isso desde que os tuplos de valores de coluna usados para definir as partições sejam estritamente crescentes. Por exemplo, cada uma das seguintes instruções `CREATE TABLE` é válida:

```
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

A seguinte declaração também é válida, embora possa parecer, à primeira vista, que não seria, uma vez que o valor limite da coluna `b` é 25 para a partição `p0` e 20 para a partição `p1`, e o valor limite da coluna `c` é 100 para a partição `p1` e 50 para a partição `p2`:

```
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

Ao projetar tabelas particionadas por `COLUMNS DE LIMITE`, você sempre pode testar definições de partição sucessivas comparando os tuplos desejados usando o cliente **mysql**, assim:

```
mysql> SELECT (0,25,50) < (10,20,100), (10,20,100) < (10,30,50);
+-------------------------+--------------------------+
| (0,25,50) < (10,20,100) | (10,20,100) < (10,30,50) |
+-------------------------+--------------------------+
|                       1 |                        1 |
+-------------------------+--------------------------+
1 row in set (0.00 sec)
```

Se uma declaração `CREATE TABLE` contiver definições de partição que não estejam em ordem estritamente crescente, ela falhará com um erro, como mostrado neste exemplo:

```
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

Quando você recebe tal erro, pode deduzir quais definições de partição são inválidas fazendo comparações de “menor que” entre suas listas de colunas. Neste caso, o problema está com a definição da partição `p2`, porque o tuplo usado para defini-la não é menor que o tuplo usado para definir a partição `p3`, como mostrado aqui:

```
mysql> SELECT (0,25,50) < (20,20,100), (20,20,100) < (10,30,50);
+-------------------------+--------------------------+
| (0,25,50) < (20,20,100) | (20,20,100) < (10,30,50) |
+-------------------------+--------------------------+
|                       1 |                        0 |
+-------------------------+--------------------------+
1 row in set (0.00 sec)
```

Também é possível que `MAXVALUE` apareça para a mesma coluna em mais de uma cláusula `VALUES LESS THAN` ao usar `COLUMNS DE LIMITE`. No entanto, os valores limites para colunas individuais em definições de partição sucessivas devem ser, de outra forma, crescentes, não deve haver mais de uma partição definida onde `MAXVALUE` é usado como o limite superior para todos os valores de coluna, e essa definição de partição deve aparecer na última posição na lista de cláusulas `PARTITION ... VALUES LESS THAN`. Além disso, você não pode usar `MAXVALUE` como o valor limite para a primeira coluna em mais de uma definição de partição.

Como mencionado anteriormente, também é possível usar colunas não inteiras como colunas de particionamento com `RANGE COLUMNS`. (Consulte a Seção 26.2.3, “Particionamento de COLUNAS”, para uma lista completa dessas.) Considere uma tabela chamada `employees` (que não está particionada), criada usando a seguinte declaração:

```
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

Usando o particionamento com `RANGE COLUMNS`, você pode criar uma versão dessa tabela que armazena cada linha em uma das quatro partições com base no sobrenome do funcionário, assim:

```
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

Alternativamente, você poderia fazer com que a tabela `employees` criada anteriormente fosse particionada usando esse esquema executando a seguinte declaração `ALTER TABLE`:

```
ALTER TABLE employees PARTITION BY RANGE COLUMNS (lname)  (
    PARTITION p0 VALUES LESS THAN ('g'),
    PARTITION p1 VALUES LESS THAN ('m'),
    PARTITION p2 VALUES LESS THAN ('t'),
    PARTITION p3 VALUES LESS THAN (MAXVALUE)
);
```

Observação

Como diferentes conjuntos de caracteres e colatações têm ordens de classificação diferentes, os conjuntos de caracteres e colatações em uso podem afetar em qual partição de uma tabela particionada por `RANGE COLUMNS` uma determinada linha é armazenada ao usar colunas de texto como colunas de particionamento. Além disso, alterar o conjunto de caracteres ou a colatuação para um determinado banco de dados, tabela ou coluna após a criação de uma tabela pode causar mudanças na forma como as linhas são distribuídas. Por exemplo, ao usar uma colatuação sensível ao caso, `'and'` é classificado antes de `'Andersen'`, mas ao usar uma colatuação que é sensível ao caso, o inverso é verdadeiro.

Para informações sobre como o MySQL lida com conjuntos de caracteres e colatações, consulte o Capítulo 12, *Sets de Caracteres, Colatações, Unicode*.

Da mesma forma, você pode fazer com que a tabela `employees` seja particionada de tal forma que cada linha seja armazenada em uma das várias partições com base na década em que o funcionário foi contratado, usando a declaração `ALTER TABLE` mostrada aqui:

```
ALTER TABLE employees PARTITION BY RANGE COLUMNS (hired)  (
    PARTITION p0 VALUES LESS THAN ('1970-01-01'),
    PARTITION p1 VALUES LESS THAN ('1980-01-01'),
    PARTITION p2 VALUES LESS THAN ('1990-01-01'),
    PARTITION p3 VALUES LESS THAN ('2000-01-01'),
    PARTITION p4 VALUES LESS THAN ('2010-01-01'),
    PARTITION p5 VALUES LESS THAN (MAXVALUE)
);
```

Consulte a Seção 15.1.24, “Instrução CREATE TABLE”, para obter informações adicionais sobre a sintaxe `PARTITION BY RANGE COLUMNS`.