### 12.21.5 Exemplos de Matemática de Precisão

Esta seção fornece alguns exemplos que mostram resultados de Querys de matemática de precisão no MySQL. Estes exemplos demonstram os princípios descritos na Seção 12.21.3, “Tratamento de Expressões”, e na Seção 12.21.4, “Comportamento de Arredondamento”.

**Exemplo 1**. Os números são usados com seu valor exato, conforme fornecido, sempre que possível:

```sql
mysql> SELECT (.1 + .2) = .3;
+----------------+
| (.1 + .2) = .3 |
+----------------+
|              1 |
+----------------+
```

Para valores de ponto flutuante, os resultados são inexatos:

```sql
mysql> SELECT (.1E0 + .2E0) = .3E0;
+----------------------+
| (.1E0 + .2E0) = .3E0 |
+----------------------+
|                    0 |
+----------------------+
```

Outra forma de ver a diferença no tratamento de valores exatos e aproximados é adicionar um número pequeno a uma soma várias vezes. Considere o seguinte stored procedure, que adiciona `.0001` a uma variável 1.000 vezes.

```sql
CREATE PROCEDURE p ()
BEGIN
  DECLARE i INT DEFAULT 0;
  DECLARE d DECIMAL(10,4) DEFAULT 0;
  DECLARE f FLOAT DEFAULT 0;
  WHILE i < 10000 DO
    SET d = d + .0001;
    SET f = f + .0001E0;
    SET i = i + 1;
  END WHILE;
  SELECT d, f;
END;
```

A soma para ambos `d` e `f` logicamente deveria ser 1, mas isso é verdadeiro apenas para o cálculo decimal. O cálculo de ponto flutuante introduz pequenos erros:

```sql
+--------+------------------+
| d      | f                |
+--------+------------------+
| 1.0000 | 0.99999999999991 |
+--------+------------------+
```

**Exemplo 2**. A multiplicação é realizada com a escala exigida pelo SQL padrão. Ou seja, para dois números *`X1`* e *`X2`* que possuem escala *`S1`* e *`S2`*, a escala do resultado é `S1 + S2`:

```sql
mysql> SELECT .01 * .01;
+-----------+
| .01 * .01 |
+-----------+
| 0.0001    |
+-----------+
```

**Exemplo 3**. O comportamento de arredondamento para números de valor exato é bem definido:

O comportamento de arredondamento (por exemplo, com a função `ROUND()`) é independente da implementação da biblioteca C subjacente, o que significa que os resultados são consistentes de plataforma para plataforma.

* O arredondamento para colunas de valor exato (`DECIMAL` - DECIMAL, NUMERIC") e integer) e números de valor exato usa a regra "arredondar metade para longe de zero" (round half away from zero). Um valor com uma parte fracionária de .5 ou maior é arredondado para longe de zero para o inteiro mais próximo, conforme mostrado aqui:

  ```sql
  mysql> SELECT ROUND(2.5), ROUND(-2.5);
  +------------+-------------+
  | ROUND(2.5) | ROUND(-2.5) |
  +------------+-------------+
  | 3          | -3          |
  +------------+-------------+
  ```

* O arredondamento para valores de ponto flutuante usa a biblioteca C, que em muitos sistemas utiliza a regra "arredondar para o par mais próximo" (round to nearest even). Um valor com uma parte fracionária exatamente na metade do caminho entre dois inteiros é arredondado para o inteiro par mais próximo:

  ```sql
  mysql> SELECT ROUND(2.5E0), ROUND(-2.5E0);
  +--------------+---------------+
  | ROUND(2.5E0) | ROUND(-2.5E0) |
  +--------------+---------------+
  |            2 |            -2 |
  +--------------+---------------+
  ```

**Exemplo 4**. Em modo estrito (strict mode), a inserção de um valor que está fora do intervalo (out of range) para uma coluna causa um erro, em vez de truncamento para um valor legal.

Quando o MySQL não está rodando em modo estrito, ocorre o truncamento para um valor legal:

```sql
mysql> SET sql_mode='';
Query OK, 0 rows affected (0.00 sec)

mysql> CREATE TABLE t (i TINYINT);
Query OK, 0 rows affected (0.01 sec)

mysql> INSERT INTO t SET i = 128;
Query OK, 1 row affected, 1 warning (0.00 sec)

mysql> SELECT i FROM t;
+------+
| i    |
+------+
|  127 |
+------+
1 row in set (0.00 sec)
```

No entanto, um erro ocorre se o strict mode estiver em vigor:

```sql
mysql> SET sql_mode='STRICT_ALL_TABLES';
Query OK, 0 rows affected (0.00 sec)

mysql> CREATE TABLE t (i TINYINT);
Query OK, 0 rows affected (0.00 sec)

mysql> INSERT INTO t SET i = 128;
ERROR 1264 (22003): Out of range value adjusted for column 'i' at row 1

mysql> SELECT i FROM t;
Empty set (0.00 sec)
```

**Exemplo 5**: Em modo estrito (strict mode) e com `ERROR_FOR_DIVISION_BY_ZERO` configurado, a divisão por zero causa um erro, e não um resultado `NULL`.

Em modo não estrito (nonstrict mode), a divisão por zero resulta em `NULL`:

```sql
mysql> SET sql_mode='';
Query OK, 0 rows affected (0.01 sec)

mysql> CREATE TABLE t (i TINYINT);
Query OK, 0 rows affected (0.00 sec)

mysql> INSERT INTO t SET i = 1 / 0;
Query OK, 1 row affected (0.00 sec)

mysql> SELECT i FROM t;
+------+
| i    |
+------+
| NULL |
+------+
1 row in set (0.03 sec)
```

No entanto, a divisão por zero é um erro se os modos SQL apropriados estiverem em vigor:

```sql
mysql> SET sql_mode='STRICT_ALL_TABLES,ERROR_FOR_DIVISION_BY_ZERO';
Query OK, 0 rows affected (0.00 sec)

mysql> CREATE TABLE t (i TINYINT);
Query OK, 0 rows affected (0.00 sec)

mysql> INSERT INTO t SET i = 1 / 0;
ERROR 1365 (22012): Division by 0

mysql> SELECT i FROM t;
Empty set (0.01 sec)
```

**Exemplo 6**. Literais de valor exato são avaliados como valores exatos.

Literais de valor aproximado são avaliados usando ponto flutuante, mas literais de valor exato são tratados como `DECIMAL` - DECIMAL, NUMERIC":

```sql
mysql> CREATE TABLE t SELECT 2.5 AS a, 25E-1 AS b;
Query OK, 1 row affected (0.01 sec)
Records: 1  Duplicates: 0  Warnings: 0

mysql> DESCRIBE t;
+-------+-----------------------+------+-----+---------+-------+
| Field | Type                  | Null | Key | Default | Extra |
+-------+-----------------------+------+-----+---------+-------+
| a     | decimal(2,1) unsigned | NO   |     | 0.0     |       |
| b     | double                | NO   |     | 0       |       |
+-------+-----------------------+------+-----+---------+-------+
2 rows in set (0.01 sec)
```

**Exemplo 7**. Se o argumento para uma função agregada for de um tipo numérico exato, o resultado também é de um tipo numérico exato, com uma escala pelo menos igual à do argumento.

Considere estas instruções:

```sql
mysql> CREATE TABLE t (i INT, d DECIMAL, f FLOAT);
mysql> INSERT INTO t VALUES(1,1,1);
mysql> CREATE TABLE y SELECT AVG(i), AVG(d), AVG(f) FROM t;
```

O resultado é um double apenas para o argumento de ponto flutuante. Para argumentos de tipo exato, o resultado também é de um tipo exato:

```sql
mysql> DESCRIBE y;
+--------+---------------+------+-----+---------+-------+
| Field  | Type          | Null | Key | Default | Extra |
+--------+---------------+------+-----+---------+-------+
| AVG(i) | decimal(14,4) | YES  |     | NULL    |       |
| AVG(d) | decimal(14,4) | YES  |     | NULL    |       |
| AVG(f) | double        | YES  |     | NULL    |       |
+--------+---------------+------+-----+---------+-------+
```

O resultado é um double apenas para o argumento de ponto flutuante. Para argumentos de tipo exato, o resultado também é de um tipo exato.