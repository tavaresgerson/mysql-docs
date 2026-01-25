### 11.1.7 Tratamento de Valores Fora do Intervalo (Out-of-Range) e Overflow

Quando o MySQL armazena um valor em uma coluna numérica que está fora do intervalo permitido para o tipo de dado da coluna, o resultado depende do `SQL mode` em vigor no momento:

* Se o `strict SQL mode` estiver habilitado, o MySQL rejeita o valor *out-of-range* com um erro, e a operação `INSERT` falha, de acordo com o padrão SQL.

* Se nenhum modo restritivo estiver habilitado, o MySQL limita (*clips*) o valor ao ponto final apropriado do intervalo do tipo de dado da coluna e armazena esse valor resultante.

  Quando um valor *out-of-range* é atribuído a uma coluna `INTEGER`, o MySQL armazena o valor que representa o ponto final correspondente do intervalo do tipo de dado da coluna.

  Quando uma coluna de ponto flutuante (*floating-point*) ou ponto fixo (*fixed-point*) recebe um valor que excede o intervalo implícito pela precisão e escala especificadas (ou padrão), o MySQL armazena o valor que representa o ponto final correspondente desse intervalo.

Suponha que uma tabela `t1` tenha a seguinte definição:

```sql
CREATE TABLE t1 (i1 TINYINT, i2 TINYINT UNSIGNED);
```

Com o `strict SQL mode` habilitado, ocorre um erro de *out-of-range*:

```sql
mysql> SET sql_mode = 'TRADITIONAL';
mysql> INSERT INTO t1 (i1, i2) VALUES(256, 256);
ERROR 1264 (22003): Out of range value for column 'i1' at row 1
mysql> SELECT * FROM t1;
Empty set (0.00 sec)
```

Com o `strict SQL mode` não habilitado, ocorre a limitação (*clipping*) com avisos (`warnings`):

```sql
mysql> SET sql_mode = '';
mysql> INSERT INTO t1 (i1, i2) VALUES(256, 256);
mysql> SHOW WARNINGS;
+---------+------+---------------------------------------------+
| Level   | Code | Message                                     |
+---------+------+---------------------------------------------+
| Warning | 1264 | Out of range value for column 'i1' at row 1 |
| Warning | 1264 | Out of range value for column 'i2' at row 1 |
+---------+------+---------------------------------------------+
mysql> SELECT * FROM t1;
+------+------+
| i1   | i2   |
+------+------+
|  127 |  255 |
+------+------+
```

Quando o `strict SQL mode` não está habilitado, as conversões de atribuição de coluna que ocorrem devido à limitação (*clipping*) são relatadas como avisos (`warnings`) para as instruções `ALTER TABLE`, `LOAD DATA`, `UPDATE` e `INSERT` de múltiplas linhas. No modo estrito, essas instruções falham, e alguns ou todos os valores não são inseridos ou alterados, dependendo se a tabela é uma tabela transacional e de outros fatores. Para detalhes, consulte a Seção 5.1.10, “Server SQL Modes”.

O `overflow` (estouro) durante a avaliação de uma expressão numérica resulta em um erro. Por exemplo, o maior valor `BIGINT` (assinado - `SIGNED`) é 9223372036854775807, portanto, a seguinte expressão produz um erro:

```sql
mysql> SELECT 9223372036854775807 + 1;
ERROR 1690 (22003): BIGINT value is out of range in '(9223372036854775807 + 1)'
```

Para permitir que a operação seja bem-sucedida neste caso, converta o valor para `UNSIGNED` (não assinado):

```sql
mysql> SELECT CAST(9223372036854775807 AS UNSIGNED) + 1;
+-------------------------------------------+
| CAST(9223372036854775807 AS UNSIGNED) + 1 |
+-------------------------------------------+
|                       9223372036854775808 |
+-------------------------------------------+
```

Se o `overflow` ocorre depende do intervalo dos operandos. Portanto, outra maneira de lidar com a expressão anterior é usar aritmética de valor exato, pois os valores `DECIMAL` têm um intervalo maior que os inteiros:

```sql
mysql> SELECT 9223372036854775807.0 + 1;
+---------------------------+
| 9223372036854775807.0 + 1 |
+---------------------------+
|     9223372036854775808.0 |
+---------------------------+
```

A subtração entre valores inteiros, onde um deles é do tipo `UNSIGNED`, produz um resultado não assinado por padrão. Se o resultado fosse negativo, ocorreria um erro:

```sql
mysql> SET sql_mode = '';
Query OK, 0 rows affected (0.00 sec)

mysql> SELECT CAST(0 AS UNSIGNED) - 1;
ERROR 1690 (22003): BIGINT UNSIGNED value is out of range in '(cast(0 as unsigned) - 1)'
```

Se o `SQL mode` `NO_UNSIGNED_SUBTRACTION` estiver habilitado, o resultado é negativo:

```sql
mysql> SET sql_mode = 'NO_UNSIGNED_SUBTRACTION';
mysql> SELECT CAST(0 AS UNSIGNED) - 1;
+-------------------------+
| CAST(0 AS UNSIGNED) - 1 |
+-------------------------+
|                      -1 |
+-------------------------+
```

Se o resultado de tal operação for usado para atualizar uma coluna `INTEGER UNSIGNED`, o resultado é limitado (clip) ao valor máximo para o tipo de coluna, ou limitado a 0 se `NO_UNSIGNED_SUBTRACTION` estiver habilitado. Se o `strict SQL mode` estiver habilitado, ocorrerá um erro e a coluna permanecerá inalterada.