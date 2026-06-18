### 22.6.3 Limitações de Partitioning Relacionadas a Funções

Esta seção discute limitações no Partitioning do MySQL relacionadas especificamente a funções usadas em expressões de partitioning.

Apenas as funções do MySQL mostradas na lista a seguir são permitidas em expressões de partitioning:

* `ABS()`
* `CEILING()` (veja CEILING() e FLOOR() and FLOOR()"))

* `DATEDIFF()`
* `DAY()`
* `DAYOFMONTH()`
* `DAYOFWEEK()`
* `DAYOFYEAR()`
* `EXTRACT()` (veja Função EXTRACT() com especificador WEEK function with WEEK specifier"))

* `FLOOR()` (veja CEILING() e FLOOR() and FLOOR()"))

* `HOUR()`
* `MICROSECOND()`
* `MINUTE()`
* `MOD()`
* `MONTH()`
* `QUARTER()`
* `SECOND()`
* `TIME_TO_SEC()`
* `TO_DAYS()`
* `TO_SECONDS()`
* `UNIX_TIMESTAMP()` (com colunas `TIMESTAMP`)

* `WEEKDAY()`
* `YEAR()`
* `YEARWEEK()`

No MySQL 5.7, o *partition pruning* é suportado para as funções `TO_DAYS()`, `TO_SECONDS()`, `YEAR()` e `UNIX_TIMESTAMP()`. Consulte Seção 22.4, “Partition Pruning”, para mais informações.

**CEILING() e FLOOR().** Cada uma dessas funções retorna um *integer* somente se for passado a ela um argumento de um tipo numérico exato, como um dos tipos `INT` - INTEGER, INT, SMALLINT, TINYINT, MEDIUMINT, BIGINT") ou `DECIMAL` - DECIMAL, NUMERIC"). Isso significa, por exemplo, que a seguinte instrução `CREATE TABLE` falha com um erro, conforme mostrado aqui:

```sql
mysql> CREATE TABLE t (c FLOAT) PARTITION BY LIST( FLOOR(c) )(
    ->     PARTITION p0 VALUES IN (1,3,5),
    ->     PARTITION p1 VALUES IN (2,4,6)
    -> );
ERROR 1490 (HY000): The PARTITION function returns the wrong type
```

**Função EXTRACT() com especificador WEEK.** O valor retornado pela função `EXTRACT()`, quando usada como `EXTRACT(WEEK FROM col)`, depende do valor da variável de sistema `default_week_format`. Por esse motivo, `EXTRACT()` não é permitida como função de partitioning quando especifica a unidade como `WEEK`. (Bug #54483)

Consulte Seção 12.6.2, “Mathematical Functions”, para mais informações sobre os tipos de retorno dessas funções, bem como Seção 11.1, “Numeric Data Types”.