### 22.6.3 Limitações de Partitioning Relacionadas a Funções

Esta seção discute limitações no Partitioning do MySQL relacionadas especificamente a funções usadas em expressões de partitioning.

Apenas as funções do MySQL mostradas na lista a seguir são permitidas em expressões de partitioning:

* [`ABS()`](mathematical-functions.html#function_abs)
* [`CEILING()`](mathematical-functions.html#function_ceiling) (veja [CEILING() e FLOOR()](partitioning-limitations-functions.html#partitioning-limitations-ceiling-floor "CEILING() and FLOOR()"))

* [`DATEDIFF()`](date-and-time-functions.html#function_datediff)
* [`DAY()`](date-and-time-functions.html#function_day)
* [`DAYOFMONTH()`](date-and-time-functions.html#function_dayofmonth)
* [`DAYOFWEEK()`](date-and-time-functions.html#function_dayofweek)
* [`DAYOFYEAR()`](date-and-time-functions.html#function_dayofyear)
* [`EXTRACT()`](date-and-time-functions.html#function_extract) (veja [Função EXTRACT() com especificador WEEK](partitioning-limitations-functions.html#partitioning-limitations-extract "EXTRACT() function with WEEK specifier"))

* [`FLOOR()`](mathematical-functions.html#function_floor) (veja [CEILING() e FLOOR()](partitioning-limitations-functions.html#partitioning-limitations-ceiling-floor "CEILING() and FLOOR()"))

* [`HOUR()`](date-and-time-functions.html#function_hour)
* [`MICROSECOND()`](date-and-time-functions.html#function_microsecond)
* [`MINUTE()`](date-and-time-functions.html#function_minute)
* [`MOD()`](mathematical-functions.html#function_mod)
* [`MONTH()`](date-and-time-functions.html#function_month)
* [`QUARTER()`](date-and-time-functions.html#function_quarter)
* [`SECOND()`](date-and-time-functions.html#function_second)
* [`TIME_TO_SEC()`](date-and-time-functions.html#function_time-to-sec)
* [`TO_DAYS()`](date-and-time-functions.html#function_to-days)
* [`TO_SECONDS()`](date-and-time-functions.html#function_to-seconds)
* [`UNIX_TIMESTAMP()`](date-and-time-functions.html#function_unix-timestamp) (com colunas [`TIMESTAMP`](datetime.html "11.2.2 The DATE, DATETIME, and TIMESTAMP Types"))

* [`WEEKDAY()`](date-and-time-functions.html#function_weekday)
* [`YEAR()`](date-and-time-functions.html#function_year)
* [`YEARWEEK()`](date-and-time-functions.html#function_yearweek)

No MySQL 5.7, o *partition pruning* é suportado para as funções [`TO_DAYS()`](date-and-time-functions.html#function_to-days), [`TO_SECONDS()`](date-and-time-functions.html#function_to-seconds), [`YEAR()`](date-and-time-functions.html#function_year) e [`UNIX_TIMESTAMP()`](date-and-time-functions.html#function_unix-timestamp). Consulte [Seção 22.4, “Partition Pruning”](partitioning-pruning.html "22.4 Partition Pruning"), para mais informações.

**CEILING() e FLOOR().** Cada uma dessas funções retorna um *integer* somente se for passado a ela um argumento de um tipo numérico exato, como um dos tipos [`INT`](integer-types.html "11.1.2 Integer Types (Exact Value) - INTEGER, INT, SMALLINT, TINYINT, MEDIUMINT, BIGINT") ou [`DECIMAL`](fixed-point-types.html "11.1.3 Fixed-Point Types (Exact Value) - DECIMAL, NUMERIC"). Isso significa, por exemplo, que a seguinte instrução [`CREATE TABLE`](create-table.html "13.1.18 CREATE TABLE Statement") falha com um erro, conforme mostrado aqui:

```sql
mysql> CREATE TABLE t (c FLOAT) PARTITION BY LIST( FLOOR(c) )(
    ->     PARTITION p0 VALUES IN (1,3,5),
    ->     PARTITION p1 VALUES IN (2,4,6)
    -> );
ERROR 1490 (HY000): The PARTITION function returns the wrong type
```

**Função EXTRACT() com especificador WEEK.** O valor retornado pela função [`EXTRACT()`](date-and-time-functions.html#function_extract), quando usada como [`EXTRACT(WEEK FROM col)`](date-and-time-functions.html#function_extract), depende do valor da variável de sistema [`default_week_format`](server-system-variables.html#sysvar_default_week_format). Por esse motivo, [`EXTRACT()`](date-and-time-functions.html#function_extract) não é permitida como função de partitioning quando especifica a unidade como `WEEK`. (Bug #54483)

Consulte [Seção 12.6.2, “Mathematical Functions”](mathematical-functions.html "12.6.2 Mathematical Functions"), para mais informações sobre os tipos de retorno dessas funções, bem como [Seção 11.1, “Numeric Data Types”](numeric-types.html "11.1 Numeric Data Types").