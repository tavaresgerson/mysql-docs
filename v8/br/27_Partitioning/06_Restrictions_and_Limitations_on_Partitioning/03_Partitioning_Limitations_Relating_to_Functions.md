### 26.6.3 Limitações de Partição Relacionadas a Funções

Esta seção discute as limitações na Partição do MySQL relacionadas especificamente às funções usadas em expressões de partição.

Apenas as funções MySQL mostradas na lista a seguir são permitidas em expressões de particionamento:

- `ABS()`

- `CEILING()` (consulte CEILING() e FLOOR() e FLOOR()"))

- `DATEDIFF()`

- `DAY()`

- `DAYOFMONTH()`

- `DAYOFWEEK()`

- `DAYOFYEAR()`

- `EXTRACT()` (veja a função EXTRACT() com o especificador WEEK)

- `FLOOR()` (consulte CEILING() e FLOOR() e FLOOR()"))

- `HOUR()`

- `MICROSECOND()`

- `MINUTE()`

- `MOD()`

- `MONTH()`

- `QUARTER()`

- `SECOND()`

- `TIME_TO_SEC()`

- `TO_DAYS()`

- `TO_SECONDS()`

- `UNIX_TIMESTAMP()` (com colunas `TIMESTAMP`).

- `WEEKDAY()`

- `YEAR()`

- `YEARWEEK()`

No MySQL 8.0, o corte de partições é suportado para as funções `TO_DAYS()`, `TO_SECONDS()`, `YEAR()` e `UNIX_TIMESTAMP()`. Consulte a Seção 26.4, “Corte de Partições”, para obter mais informações.

**CEILING() e FLOOR().** Cada uma dessas funções retorna um inteiro apenas se receber um argumento de um tipo numérico exato, como um dos tipos `INT` - INTEGER, INT, SMALLINT, TINYINT, MEDIUMINT, BIGINT") ou `DECIMAL` - DECIMAL, NUMERIC"). Isso significa, por exemplo, que a seguinte instrução `CREATE TABLE` falha com um erro, conforme mostrado aqui:

```
mysql> CREATE TABLE t (c FLOAT) PARTITION BY LIST( FLOOR(c) )(
    ->     PARTITION p0 VALUES IN (1,3,5),
    ->     PARTITION p1 VALUES IN (2,4,6)
    -> );
ERROR 1490 (HY000): The PARTITION function returns the wrong type
```

**Função EXTRACT() com especificador WEEK.** O valor retornado pela função `EXTRACT()`, quando usada como `EXTRACT(WEEK FROM col)`, depende do valor da variável de sistema `default_week_format`. Por essa razão, `EXTRACT()` não é permitido como função de partição quando especifica a unidade como `WEEK`. (Bug #54483)

Consulte a Seção 14.6.2, “Funções Matemáticas”, para obter mais informações sobre os tipos de retorno dessas funções, bem como a Seção 13.1, “Tipos de Dados Numéricos”.
