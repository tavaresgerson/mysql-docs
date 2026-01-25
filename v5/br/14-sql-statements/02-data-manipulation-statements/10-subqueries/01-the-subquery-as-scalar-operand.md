#### 13.2.10.1 A Subquery como Operando Escalar

Na sua forma mais simples, uma subquery é uma scalar subquery que retorna um único valor. Uma scalar subquery é um operando simples e pode ser usada em praticamente qualquer lugar onde um único valor de coluna ou literal seja permitido. Você pode esperar que ela tenha as características que todos os operandos possuem: um data type, um length, uma indicação de que pode ser `NULL`, e assim por diante. Por exemplo:

```sql
CREATE TABLE t1 (s1 INT, s2 CHAR(5) NOT NULL);
INSERT INTO t1 VALUES(100, 'abcde');
SELECT (SELECT s2 FROM t1);
```

A subquery neste [`SELECT`](select.html "13.2.9 SELECT Statement") retorna um único valor (`'abcde'`) que tem um data type [`CHAR`](char.html "11.3.2 The CHAR and VARCHAR Types"), um length de 5, um character set e collation iguais aos defaults em vigor no momento do [`CREATE TABLE`](create-table.html "13.1.18 CREATE TABLE Statement"), e uma indicação de que o valor na coluna pode ser `NULL`. A nulidade (nullability) do valor selecionado por uma scalar subquery não é copiada porque se o resultado da subquery estiver vazio, o resultado é `NULL`. Para a subquery recém-mostrada, se `t1` estivesse vazia, o resultado seria `NULL`, mesmo que `s2` fosse `NOT NULL`.

Existem alguns contextos nos quais uma scalar subquery não pode ser usada. Se uma instrução permite apenas um valor literal, você não pode usar uma subquery. Por exemplo, `LIMIT` exige argumentos inteiros literais, e [`LOAD DATA`](load-data.html "13.2.6 LOAD DATA Statement") exige um nome de arquivo literal do tipo string. Você não pode usar subqueries para fornecer esses valores.

Quando você vir exemplos nas seções seguintes que contêm a construção bastante espartana `(SELECT column1 FROM t1)`, imagine que seu próprio código contém construções muito mais diversas e complexas.

Suponha que criemos duas tables:

```sql
CREATE TABLE t1 (s1 INT);
INSERT INTO t1 VALUES (1);
CREATE TABLE t2 (s1 INT);
INSERT INTO t2 VALUES (2);
```

Em seguida, execute um [`SELECT`](select.html "13.2.9 SELECT Statement"):

```sql
SELECT (SELECT s1 FROM t2) FROM t1;
```

O resultado é `2` porque há uma row em `t2` contendo uma column `s1` que tem o valor `2`.

Uma scalar subquery pode fazer parte de uma expression, mas lembre-se dos parênteses, mesmo que a subquery seja um operando que fornece um argumento para uma function. Por exemplo:

```sql
SELECT UPPER((SELECT s1 FROM t1)) FROM t2;
```