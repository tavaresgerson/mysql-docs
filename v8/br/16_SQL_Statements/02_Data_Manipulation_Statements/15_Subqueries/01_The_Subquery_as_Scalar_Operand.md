#### 15.2.15.1 A subconsulta como operando escalar

Na sua forma mais simples, uma subconsulta é uma subconsulta escalar que retorna um único valor. Uma subconsulta escalar é um operando simples, e você pode usá-la quase em qualquer lugar onde um valor de coluna ou literal seja legal, e você pode esperar que ela tenha as características que todos os operandos têm: um tipo de dados, uma extensão, uma indicação de que pode ser `NULL`, e assim por diante. Por exemplo:

```
CREATE TABLE t1 (s1 INT, s2 CHAR(5) NOT NULL);
INSERT INTO t1 VALUES(100, 'abcde');
SELECT (SELECT s2 FROM t1);
```

A subconsulta nesta `SELECT` retorna um único valor (`'abcde'`) que tem um tipo de dados de `CHAR`, uma comprimento de 5, um conjunto de caracteres e uma ordenação iguais aos padrões em vigor no momento de `CREATE TABLE`, e uma indicação de que o valor na coluna pode ser `NULL`. A nulidade do valor selecionado por uma subconsulta escalar não é copiada porque, se o resultado da subconsulta for vazio, o resultado será `NULL`. Para a subconsulta mostrada anteriormente, se `t1` fosse vazio, o resultado seria `NULL`, mesmo que `s2` seja `NOT NULL`.

Há alguns contextos em que uma subconsulta escalar não pode ser usada. Se uma declaração permite apenas um valor literal, você não pode usar uma subconsulta. Por exemplo, `LIMIT` requer argumentos inteiros literais, e `LOAD DATA` requer um nome de arquivo literal de string. Você não pode usar subconsultas para fornecer esses valores.

Quando você vir exemplos nas seções seguintes que contêm o construtor bastante austero `(SELECT column1 FROM t1)`, imagine que seu próprio código contém construções muito mais diversas e complexas.

Suponha que façamos duas tabelas:

```
CREATE TABLE t1 (s1 INT);
INSERT INTO t1 VALUES (1);
CREATE TABLE t2 (s1 INT);
INSERT INTO t2 VALUES (2);
```

Em seguida, execute um `SELECT`:

```
SELECT (SELECT s1 FROM t2) FROM t1;
```

O resultado é `2` porque há uma linha em `t2` que contém uma coluna `s1` com um valor de `2`.

No MySQL 8.0.19 e versões posteriores, a consulta anterior também pode ser escrita da seguinte forma, usando `TABLE`:

```
SELECT (TABLE t2) FROM t1;
```

Uma subconsulta escalar pode fazer parte de uma expressão, mas lembre-se das chaves, mesmo que a subconsulta seja um operando que forneça um argumento para uma função. Por exemplo:

```
SELECT UPPER((SELECT s1 FROM t1)) FROM t2;
```

O mesmo resultado pode ser obtido no MySQL 8.0.19 e versões posteriores usando `SELECT UPPER((TABLE t1)) FROM t2`.
