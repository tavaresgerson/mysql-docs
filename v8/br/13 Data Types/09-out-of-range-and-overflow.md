### 13.1.7 Gerenciamento de Saída de Faixa e Excedência

Quando o MySQL armazena um valor em uma coluna numérica que está fora da faixa permitida do tipo de dados da coluna, o resultado depende do modo SQL em vigor no momento:

* Se o modo SQL rigoroso estiver habilitado, o MySQL rejeita o valor fora da faixa com um erro e a inserção falha, de acordo com o padrão SQL.
* Se nenhum modo restritivo estiver habilitado, o MySQL corta o valor para o ponto final apropriado da faixa do tipo de dados da coluna e armazena o valor resultante.

Quando um valor fora da faixa é atribuído a uma coluna inteira, o MySQL armazena o valor que representa o ponto final correspondente da faixa do tipo de dados da coluna.

Quando uma coluna de ponto flutuante ou ponto fixo recebe um valor que excede a faixa implícita pela precisão e escala especificadas (ou padrão), o MySQL armazena o valor que representa o ponto final dessa faixa.

Suponha que uma tabela `t1` tenha esta definição:

```
CREATE TABLE t1 (i1 TINYINT, i2 TINYINT UNSIGNED);
```

Com o modo SQL rigoroso habilitado, ocorre um erro de fora da faixa:

```
mysql> SET sql_mode = 'TRADITIONAL';
mysql> INSERT INTO t1 (i1, i2) VALUES(256, 256);
ERROR 1264 (22003): Out of range value for column 'i1' at row 1
mysql> SELECT * FROM t1;
Empty set (0.00 sec)
```

Com o modo SQL rigoroso não habilitado, ocorre uma poda com avisos:

```
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

Quando o modo SQL não é habilitado, as conversões de atribuição de coluna que ocorrem devido à poda são relatadas como avisos para as instruções `ALTER TABLE`, `LOAD DATA`, `UPDATE` e `INSERT` de múltiplas linhas. No modo rigoroso, essas instruções falham e alguns ou todos os valores não são inseridos ou alterados, dependendo se a tabela é uma tabela transacional e outros fatores. Para detalhes, consulte a Seção 7.1.11, “Modos SQL do Servidor”.

A excedência durante a avaliação de expressões numéricas resulta em um erro. Por exemplo, o maior valor assinado `BIGINT` - `INTEGER`, `INT`, `SMALLINT`, `TINYINT`, `MEDIUMINT`, `BIGINT`) é 9223372036854775807, então a seguinte expressão produz um erro:

```
mysql> SELECT 9223372036854775807 + 1;
ERROR 1690 (22003): BIGINT value is out of range in '(9223372036854775807 + 1)'
```

Para permitir que a operação seja bem-sucedida neste caso, converta o valor para não assinado;

```
mysql> SELECT CAST(9223372036854775807 AS UNSIGNED) + 1;
+-------------------------------------------+
| CAST(9223372036854775807 AS UNSIGNED) + 1 |
+-------------------------------------------+
|                       9223372036854775808 |
+-------------------------------------------+
```

Se ocorrer overflow, isso depende da faixa dos operadores, então outra maneira de lidar com a expressão anterior é usar aritmética de valor exato porque os valores `DECIMAL` - `DECIMAL`, `NUMERIC") têm uma faixa maior do que os inteiros:

```
mysql> SELECT 9223372036854775807.0 + 1;
+---------------------------+
| 9223372036854775807.0 + 1 |
+---------------------------+
|     9223372036854775808.0 |
+---------------------------+
```

A subtração entre valores inteiros, onde um deles é do tipo `UNSIGNED`, produz um resultado não assinado por padrão. Se o resultado de outra forma fosse negativo, ocorre um erro:

```
mysql> SET sql_mode = '';
Query OK, 0 rows affected (0.00 sec)

mysql> SELECT CAST(0 AS UNSIGNED) - 1;
ERROR 1690 (22003): BIGINT UNSIGNED value is out of range in '(cast(0 as unsigned) - 1)'
```

Se o modo SQL `NO_UNSIGNED_SUBTRACTION` estiver habilitado, o resultado é negativo:

```
mysql> SET sql_mode = 'NO_UNSIGNED_SUBTRACTION';
mysql> SELECT CAST(0 AS UNSIGNED) - 1;
+-------------------------+
| CAST(0 AS UNSIGNED) - 1 |
+-------------------------+
|                      -1 |
+-------------------------+
```

Se o resultado de uma operação desse tipo for usado para atualizar uma coluna `UNSIGNED` inteira, o resultado é recortado para o valor máximo do tipo da coluna, ou recortado para 0 se o `NO_UNSIGNED_SUBTRACTION` estiver habilitado. Se o modo SQL rigoroso estiver habilitado, ocorre um erro e a coluna permanece inalterada.