### 22.6.3 Limitações de Partição Relacionadas a Funções

Esta seção discute as limitações na Partição do MySQL relacionadas especificamente às funções usadas em expressões de partição.

Apenas as funções MySQL mostradas na lista a seguir são permitidas em expressões de particionamento:

- [`ABS()`](https://math-functions.html#function_abs)

- [`CEILING()`](https://pt.math-functions.com/pt/funcao_ceiling) (veja [CEILING() e FLOOR()](https://pt.math-functions.com/pt/limitacoes-de-particao-funcoes_ceiling_floor))

- `DATEDIFF()`

- `DAY()`

- `DAYOFMONTH()`

- `DAYOFWEEK()`

- [`DAYOFYEAR()`](https://pt.wikibooks.org/wiki/Funções_de_data_e_hora/Função_DAYOFYEAR)

- `EXTRACT()` (veja a função `EXTRACT()` com o especificador `WEEK`]\(partitioning-limitations-functions.html#partitioning-limitations-extract)

- [`FLOOR()`](https://pt.math-functions.com/pt/funcao_floor) (veja [CEILING() e FLOOR()](https://pt.math-functions.com/pt/limitacoes-de-particao-funcoes-ceil-floor))

- `HOUR()`

- `MICROSECOND()`

- `MINUTE()`

- `MOD()`

- `MÊS()`

- `QUARTER()_`

- `SECOND()`

- `TIME_TO_SEC()`

- `TO_DAYS()_`

- `TO_SECONDS()`

- `UNIX_TIMESTAMP()` (com as colunas `TIMESTAMP`)

- `WEEKDAY()`

- `YEAR()`

- [`YEARWEEK()`](https://pt.docs.oracle.com/database/12/TDB/FUNCTIONS.HTML#function_yearweek)

No MySQL 5.7, o corte de partições é suportado para as funções `TO_DAYS()`, `TO_SECONDS()`, `YEAR()` e `UNIX_TIMESTAMP()`. Consulte Seção 22.4, “Corte de Partições” para obter mais informações.

**CEILING() e FLOOR().** Cada uma dessas funções retorna um inteiro apenas se receber um argumento de um tipo numérico exato, como um dos tipos `INT` ou `DECIMAL`. Isso significa, por exemplo, que a seguinte instrução `CREATE TABLE` falha com um erro, conforme mostrado aqui:

```sql
mysql> CREATE TABLE t (c FLOAT) PARTITION BY LIST( FLOOR(c) )(
    ->     PARTITION p0 VALUES IN (1,3,5),
    ->     PARTITION p1 VALUES IN (2,4,6)
    -> );
ERROR 1490 (HY000): The PARTITION function returns the wrong type
```

**Função `EXTRACT()` com o especificador `WEEK`.** O valor retornado pela função `EXTRACT()` (date-and-time-functions.html#function_extract), quando usada como `EXTRACT(WEEK FROM col)` (date-and-time-functions.html#function_extract), depende do valor da variável de sistema `default_week_format` (server-system-variables.html#sysvar_default_week_format). Por essa razão, `EXTRACT()` (date-and-time-functions.html#function_extract) não é permitido como função de partição quando especifica a unidade como `WEEK`. (Bug #54483)

Consulte a Seção 12.6.2, “Funções Matemáticas” para obter mais informações sobre os tipos de retorno dessas funções, bem como a Seção 11.1, “Tipos de Dados Numéricos”.
