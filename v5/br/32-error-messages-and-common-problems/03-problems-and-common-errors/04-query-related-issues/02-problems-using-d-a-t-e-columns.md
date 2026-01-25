#### B.3.4.2 Problemas ao Usar Colunas DATE

O formato de um valor [`DATE`](datetime.html "11.2.2 The DATE, DATETIME, and TIMESTAMP Types") é `'YYYY-MM-DD'`. De acordo com o SQL padrão, nenhum outro formato é permitido. Você deve usar este formato em expressões [`UPDATE`](update.html "13.2.11 UPDATE Statement") e na `WHERE clause` de instruções [`SELECT`](select.html "13.2.9 SELECT Statement"). Por exemplo:

```sql
SELECT * FROM t1 WHERE date >= '2003-05-05';
```

Como conveniência, o MySQL converte automaticamente uma data para um número se a data for usada em contexto numérico e vice-versa. O MySQL também permite um formato de string "flexível" (relaxed) ao fazer `UPDATE` e em uma `WHERE clause` que compara uma data com uma coluna [`DATE`](datetime.html "11.2.2 The DATE, DATETIME, and TIMESTAMP Types"), [`DATETIME`](datetime.html "11.2.2 The DATE, DATETIME, and TIMESTAMP Types") ou [`TIMESTAMP`](datetime.html "11.2.2 The DATE, DATETIME, and TIMESTAMP Types"). O formato "flexível" significa que qualquer caractere de pontuação pode ser usado como separador entre as partes. Por exemplo, `'2004-08-15'` e `'2004#08#15'` são equivalentes. O MySQL também pode converter uma string que não contenha separadores (como `'20040815'`), desde que faça sentido como uma data.

Quando você compara um [`DATE`](datetime.html "11.2.2 The DATE, DATETIME, and TIMESTAMP Types"), [`TIME`](time.html "11.2.3 The TIME Type"), [`DATETIME`](datetime.html "11.2.2 The DATE, DATETIME, and TIMESTAMP Types") ou [`TIMESTAMP`](datetime.html "11.2.2 The DATE, DATETIME, and TIMESTAMP Types") com uma string constante usando os operadores `<`, `<=`, `=`, `>=`, `>`, ou `BETWEEN`, o MySQL normalmente converte a string para um long integer interno para uma comparação mais rápida (e também para uma checagem de string um pouco mais "flexível"). No entanto, esta conversão está sujeita às seguintes exceções:

* Quando você compara duas colunas
* Quando você compara uma coluna [`DATE`](datetime.html "11.2.2 The DATE, DATETIME, and TIMESTAMP Types"), [`TIME`](time.html "11.2.3 The TIME Type"), [`DATETIME`](datetime.html "11.2.2 The DATE, DATETIME, and TIMESTAMP Types") ou [`TIMESTAMP`](datetime.html "11.2.2 The DATE, DATETIME, and TIMESTAMP Types") com uma expressão

* Quando você usa qualquer método de comparação diferente dos listados, como `IN` ou [`STRCMP()`](string-comparison-functions.html#function_strcmp).

Nessas exceções, a comparação é feita convertendo os objetos para strings e realizando uma string comparison.

Para garantir a segurança, assuma que as strings são comparadas como strings e use as funções de string apropriadas se desejar comparar um valor temporal com uma string.

A data especial "zero" `'0000-00-00'` pode ser armazenada e recuperada como `'0000-00-00'`. Quando uma data `'0000-00-00'` é usada através do Connector/ODBC, ela é automaticamente convertida para `NULL` porque o ODBC não consegue lidar com esse tipo de data.

Como o MySQL executa as conversões descritas, as seguintes instruções funcionam (assumindo que `idate` é uma coluna [`DATE`](datetime.html "11.2.2 The DATE, DATETIME, and TIMESTAMP Types")):

```sql
INSERT INTO t1 (idate) VALUES (19970505);
INSERT INTO t1 (idate) VALUES ('19970505');
INSERT INTO t1 (idate) VALUES ('97-05-05');
INSERT INTO t1 (idate) VALUES ('1997.05.05');
INSERT INTO t1 (idate) VALUES ('1997 05 05');
INSERT INTO t1 (idate) VALUES ('0000-00-00');

SELECT idate FROM t1 WHERE idate >= '1997-05-05';
SELECT idate FROM t1 WHERE idate >= 19970505;
SELECT MOD(idate,100) FROM t1 WHERE idate >= 19970505;
SELECT idate FROM t1 WHERE idate >= '19970505';
```

No entanto, a seguinte instrução não funciona:

```sql
SELECT idate FROM t1 WHERE STRCMP(idate,'20030505')=0;
```

[`STRCMP()`](string-comparison-functions.html#function_strcmp) é uma função de string, então ela converte `idate` para uma string no formato `'YYYY-MM-DD'` e realiza uma string comparison. Ela não converte `'20030505'` para a data `'2003-05-05'` e realiza uma date comparison.

Se você habilitar o SQL mode [`ALLOW_INVALID_DATES`](sql-mode.html#sqlmode_allow_invalid_dates), o MySQL permite que você armazene datas que recebem apenas uma checagem limitada: o MySQL exige apenas que o dia esteja no intervalo de 1 a 31 e o mês no intervalo de 1 a 12. Isso torna o MySQL muito conveniente para aplicações Web onde você obtém ano, mês e dia em três campos diferentes e deseja armazenar exatamente o que o usuário inseriu (sem date validation).

O MySQL permite que você armazene datas onde o dia ou o mês e o dia são zero. Isso é conveniente se você deseja armazenar uma data de nascimento em uma coluna [`DATE`](datetime.html "11.2.2 The DATE, DATETIME, and TIMESTAMP Types") e conhece apenas parte da data. Para não permitir partes de mês ou dia zero em datas, habilite o mode [`NO_ZERO_IN_DATE`](sql-mode.html#sqlmode_no_zero_in_date).

O MySQL permite que você armazene um valor "zero" de `'0000-00-00'` como uma "dummy date" (data fictícia). Isso é, em alguns casos, mais conveniente do que usar valores `NULL`. Se uma data a ser armazenada em uma coluna [`DATE`](datetime.html "11.2.2 The DATE, DATETIME, and TIMESTAMP Types") não puder ser convertida para nenhum valor razoável, o MySQL armazena `'0000-00-00'`. Para não permitir `'0000-00-00'`, habilite o mode [`NO_ZERO_DATE`](sql-mode.html#sqlmode_no_zero_date).

Para que o MySQL cheque todas as datas e aceite apenas datas válidas (a menos que seja substituído por `IGNORE`), defina a variável de sistema [`sql_mode`](server-system-variables.html#sysvar_sql_mode) como `"NO_ZERO_IN_DATE,NO_ZERO_DATE"`.