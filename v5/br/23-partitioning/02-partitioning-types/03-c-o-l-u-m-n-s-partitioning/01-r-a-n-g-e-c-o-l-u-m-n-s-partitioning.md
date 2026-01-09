#### 22.2.3.1 Partição de colunas de intervalo

A partição por intervalo de colunas é semelhante à partição por intervalo, mas permite que você defina partições usando intervalos baseados em múltiplos valores de coluna. Além disso, você pode definir os intervalos usando colunas de tipos diferentes dos inteiros.

A partição `RANGE COLUMNS` difere significativamente da partição `RANGE` das seguintes maneiras:

- `RANGE COLUMNS` não aceita expressões, apenas nomes de colunas.

- `RANGE COLUMNS` aceita uma lista de uma ou mais colunas.

  As partições `RANGE COLUMNS` são baseadas em comparações entre tuplas (listas de valores de coluna) e não em comparações entre valores escalares. O posicionamento das linhas nas partições `RANGE COLUMNS` também é baseado em comparações entre tuplas; isso é discutido mais adiante nesta seção.

- As colunas de particionamento `RANGE COLUMNS` não são restritas a colunas inteiras; colunas de texto, `DATE` e `DATETIME` também podem ser usadas como colunas de particionamento. (Veja Seção 22.2.3, “COLUNAS DE PARTICIONAMENTO”, para detalhes.)

A sintaxe básica para criar uma tabela particionada por `COLUNAS DE CAMPO` está mostrada aqui:

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

Nem todas as opções de `CREATE TABLE` que podem ser usadas ao criar tabelas particionadas estão mostradas aqui. Para informações completas, consulte Seção 13.1.18, “Instrução CREATE TABLE”.

Na sintaxe mostrada acima, *`column_list`* é uma lista de uma ou mais colunas (às vezes chamada de lista de colunas de particionamento) e *`value_list`* é uma lista de valores (ou seja, é uma lista de valores de definição de particionamento). Uma *`value_list`* deve ser fornecida para cada definição de particionamento e cada *`value_list`* deve ter o mesmo número de valores que a *`column_list`* tem colunas. De forma geral, se você usar *`N`* colunas na cláusula `COLUMNS`, então cada cláusula `VALUES LESS THAN` também deve ser fornecida com uma lista de *`N`* valores.

Os elementos na coluna de partição da lista e na lista de valores que definem cada partição devem ocorrer na mesma ordem. Além disso, cada elemento na lista de valores deve ser do mesmo tipo de dado que o elemento correspondente na lista de colunas. No entanto, a ordem dos nomes das colunas na lista de colunas de partição e nas listas de valores não precisa ser a mesma que a ordem das definições de colunas da tabela na parte principal da declaração `CREATE TABLE`. Assim como na partição da tabela por `RANGE`, você pode usar `MAXVALUE` para representar um valor de modo que qualquer valor legal inserido em uma coluna dada seja sempre menor que esse valor. Aqui está um exemplo de uma declaração `CREATE TABLE` que ajuda a ilustrar todos esses pontos:

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

A tabela `rcx` contém as colunas `a`, `b`, `c`, `d`. A lista de colunas de partição fornecida na cláusula `COLUMNS` usa 3 dessas colunas, na ordem `a`, `d`, `c`. Cada lista de valores usada para definir uma partição contém 3 valores na mesma ordem; ou seja, cada tupla da lista de valores tem a forma (`INT`, `INT`, `CHAR(3)`), o que corresponde aos tipos de dados usados pelas colunas `a`, `d` e `c` (naquela ordem).

A colocação de linhas em partições é determinada pela comparação do tuplo de uma linha a ser inserida que corresponde à lista de colunas na cláusula `COLUMNS` com os tuplos usados nas cláusulas `VALUES LESS THAN` para definir as partições da tabela. Como estamos comparando tuplos (ou seja, listas ou conjuntos de valores) em vez de valores escalares, a semântica de `VALUES LESS THAN` quando usada com partições `RANGE COLUMNS` difere um pouco do caso com partições simples `RANGE`. Na partição `RANGE`, uma linha que gera um valor de expressão que é igual a um valor limite em uma `VALUES LESS THAN` nunca é colocada na partição correspondente; no entanto, ao usar a partição `RANGE COLUMNS`, às vezes é possível que uma linha cujo primeiro elemento da lista de colunas de partição tenha o mesmo valor que o primeiro elemento em uma lista de valores `VALUES LESS THAN` seja colocada na partição correspondente.

Considere a tabela `RANGE` particionada criada por esta declaração:

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

Se inserirmos 3 linhas nesta tabela de modo que o valor da coluna para `a` seja `5` para cada linha, todas as 3 linhas serão armazenadas na partição `p1` porque o valor da coluna `a` em cada caso não é menor que 5, como podemos ver ao executar a consulta adequada na tabela do Schema de Informações `PARTITIONS`:

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

Agora, considere uma tabela semelhante `rc1` que usa a partição `RANGE COLUMNS` com ambas as colunas `a` e `b` referenciadas na cláusula `COLUMNS`, criada conforme mostrado aqui:

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

Se inserirmos exatamente as mesmas linhas em `rc1` que acabamos de inserir em `r1`, a distribuição das linhas será bastante diferente:

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

Isso ocorre porque estamos comparando linhas em vez de valores escalares. Podemos comparar os valores das linhas inseridos com o valor máximo da linha da cláusula `VALUES THAN LESS THAN` usada para definir a partição `p0` na tabela `rc1`, da seguinte forma:

```sql
mysql> SELECT (5,10) < (5,12), (5,11) < (5,12), (5,12) < (5,12);
+-----------------+-----------------+-----------------+
| (5,10) < (5,12) | (5,11) < (5,12) | (5,12) < (5,12) |
+-----------------+-----------------+-----------------+
|               1 |               1 |               0 |
+-----------------+-----------------+-----------------+
1 row in set (0.00 sec)
```

Os tuplos `(5,10)` e `(5,11)` são avaliados como menores que `(5,12)`, então eles são armazenados na partição `p0`. Como 5 não é menor que 5 e 12 não é menor que 12, `(5,12)` é considerado não menor que `(5,12)`, e é armazenado na partição `p1`.

A instrução `SELECT` no exemplo anterior também poderia ter sido escrita usando construtores de linha explícitos, como este:

```sql
SELECT ROW(5,10) < ROW(5,12), ROW(5,11) < ROW(5,12), ROW(5,12) < ROW(5,12);
```

Para obter mais informações sobre o uso de construtores de linhas no MySQL, consulte Seção 13.2.10.5, “Subconsultas de Linhas”.

Para uma tabela particionada por `COLUMNS DE CAMPO DE CAMADA DE GRUPO` usando apenas uma única coluna de particionamento, o armazenamento de linhas nas partições é o mesmo que o de uma tabela equivalente que é particionada por `RANGE`. A seguinte instrução `CREATE TABLE` cria uma tabela particionada por `COLUMNS DE CAMPO DE CAMADA DE GRUPO` usando 1 coluna de particionamento:

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

Se inserirmos as linhas `(5,10)`, `(5,11)` e `(5,12)` nesta tabela, podemos ver que seu posicionamento é o mesmo do que para a tabela `r` que criamos e preenchimos anteriormente:

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

Também é possível criar tabelas particionadas por `COLUMNS RANGE` onde os valores de limite para uma ou mais colunas são repetidos em definições de particionamento sucessivas. Você pode fazer isso desde que os tuplos de valores de coluna usados para definir as particionações sejam estritamente crescentes. Por exemplo, cada uma das seguintes instruções de `CREATE TABLE` (create-table.html) é válida:

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

A seguinte declaração também é válida, embora possa parecer, à primeira vista, que não seria, uma vez que o valor limite da coluna `b` é de 25 para a partição `p0` e de 20 para a partição `p1`, e o valor limite da coluna `c` é de 100 para a partição `p1` e de 50 para a partição `p2`:

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

Ao projetar tabelas particionadas por `COLUNAS DE CAMPO DE Variação`, você sempre pode testar definições de particionamento sucessivas comparando os tuplos desejados usando o cliente **mysql**, da seguinte maneira:

```sql
mysql> SELECT (0,25,50) < (10,20,100), (10,20,100) < (10,30,50);
+-------------------------+--------------------------+
| (0,25,50) < (10,20,100) | (10,20,100) < (10,30,50) |
+-------------------------+--------------------------+
|                       1 |                        1 |
+-------------------------+--------------------------+
1 row in set (0.00 sec)
```

Se uma instrução `CREATE TABLE` contiver definições de partição que não estejam em ordem estritamente crescente, ela falhará com um erro, como mostrado neste exemplo:

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

Quando você recebe esse erro, pode deduzir quais definições de partição são inválidas fazendo comparações de “menor que” entre suas listas de colunas. Neste caso, o problema está com a definição da partição `p2`, porque o tuplo usado para defini-la não é menor que o tuplo usado para definir a partição `p3`, como mostrado aqui:

```sql
mysql> SELECT (0,25,50) < (20,20,100), (20,20,100) < (10,30,50);
+-------------------------+--------------------------+
| (0,25,50) < (20,20,100) | (20,20,100) < (10,30,50) |
+-------------------------+--------------------------+
|                       1 |                        0 |
+-------------------------+--------------------------+
1 row in set (0.00 sec)
```

Também é possível que `MAXVALUE` apareça para a mesma coluna em mais de uma cláusula `VALUES LESS THAN` ao usar `RANGE COLUMNS`. No entanto, os valores limitantes para colunas individuais em definições de partição consecutivas devem ser, de outra forma, crescentes, não deve haver mais de uma partição definida onde `MAXVALUE` é usado como o limite superior para todos os valores de coluna, e essa definição de partição deve aparecer na última posição na lista de cláusulas `PARTITION ... VALUES LESS THAN`. Além disso, você não pode usar `MAXVALUE` como o valor limitante para a primeira coluna em mais de uma definição de partição.

Como mencionado anteriormente, também é possível usar colunas não inteiras como colunas de particionamento com o particionamento por `RANGE COLUMNS` (Consulte Seção 22.2.3, “Particionamento de COLUNAS” para uma lista completa dessas). Considere uma tabela chamada `employees` (que não está particionada), criada usando a seguinte declaração:

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

Usando a partição `RANGE COLUMNS`, você pode criar uma versão dessa tabela que armazena cada linha em uma das quatro partições com base no sobrenome do funcionário, como este:

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

Como alternativa, você pode fazer com que a tabela `employees`, criada anteriormente, seja particionada usando esse esquema, executando a seguinte instrução `ALTER TABLE`:

```sql
ALTER TABLE employees PARTITION BY RANGE COLUMNS (lname)  (
    PARTITION p0 VALUES LESS THAN ('g'),
    PARTITION p1 VALUES LESS THAN ('m'),
    PARTITION p2 VALUES LESS THAN ('t'),
    PARTITION p3 VALUES LESS THAN (MAXVALUE)
);
```

Nota

Como diferentes conjuntos de caracteres e codificações têm ordens de classificação diferentes, os conjuntos de caracteres e codificações em uso podem afetar em qual partição de uma tabela particionada por `COLUNAS DE CAMPO` uma determinada linha é armazenada ao usar colunas de texto como colunas de particionamento. Além disso, alterar o conjunto de caracteres ou a codificação de um banco de dados, tabela ou coluna específico após a criação de uma tabela pode causar alterações na forma como as linhas são distribuídas. Por exemplo, ao usar uma codificação sensível a maiúsculas e minúsculas, `'and'` é classificado antes de `'Andersen'`, mas ao usar uma codificação que é sensível a maiúsculas e minúsculas, o inverso é verdadeiro.

Para obter informações sobre como o MySQL lida com conjuntos de caracteres e colatações, consulte [Capítulo 10, *Conjunto de caracteres, colatações, Unicode*] (charset.html).

Da mesma forma, você pode fazer com que a tabela `employees` seja particionada de tal forma que cada linha seja armazenada em uma das várias partições com base na década em que o funcionário correspondente foi contratado, usando a instrução `ALTER TABLE` mostrada aqui:

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

Consulte Seção 13.1.18, “Instrução CREATE TABLE” para obter informações adicionais sobre a sintaxe `PARTITION BY RANGE COLUMNS`.
