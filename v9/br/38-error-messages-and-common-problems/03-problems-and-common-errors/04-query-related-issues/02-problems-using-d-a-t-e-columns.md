#### B.3.4.2 Problemas ao usar colunas de tipo `DATE`

O formato de um valor `DATE` é `'YYYY-MM-DD'`. De acordo com o SQL padrão, nenhum outro formato é permitido. Você deve usar esse formato nas expressões de `UPDATE` e na cláusula `WHERE` das instruções `SELECT`. Por exemplo:

```
SELECT * FROM t1 WHERE date >= '2003-05-05';
```

Como uma conveniência, o MySQL converte automaticamente uma data em um número se a data for usada em um contexto numérico e vice-versa. O MySQL também permite um formato de string "relaxado" ao atualizar e em uma cláusula `WHERE` que compara uma data a uma coluna `DATE`, `DATETIME` ou `TIMESTAMP`. O formato "relaxado" significa que qualquer caractere de pontuação pode ser usado como separador entre partes. Por exemplo, `'2004-08-15'` e `'2004#08#15'` são equivalentes. O MySQL também pode converter uma string que não contém separadores (como `'20040815'`), desde que faça sentido como uma data.

Ao comparar uma `DATE`, `TIME`, `DATETIME` ou `TIMESTAMP` a uma string constante com os operadores `<`, `<=`, `=`, `>=`, `>` ou `BETWEEN`, o MySQL normalmente converte a string em um inteiro longo interno para uma comparação mais rápida (e também para uma verificação de string um pouco mais "relaxada"). No entanto, essa conversão está sujeita às seguintes exceções:

* Quando você compara duas colunas
* Quando você compara uma coluna `DATE`, `TIME`, `DATETIME` ou `TIMESTAMP` a uma expressão

* Quando você usa qualquer método de comparação diferente dos listados acima, como `IN` ou `STRCMP()`.

Para essas exceções, a comparação é feita convertendo os objetos em strings e realizando uma comparação de strings.

Para ter certeza, assuma que as strings são comparadas como strings e use as funções de string apropriadas se você quiser comparar um valor temporal a uma string.

A data especial "zero" `'0000-00-00'` pode ser armazenada e recuperada como `'0000-00-00'`. Quando uma data `'0000-00-00'` é usada através do Connector/ODBC, ela é automaticamente convertida em `NULL` porque o ODBC não pode lidar com esse tipo de data.

Como o MySQL realiza as conversões descritas acima, as seguintes instruções funcionam (suponha que `idate` seja uma coluna `DATE`):

```
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

```
SELECT idate FROM t1 WHERE STRCMP(idate,'20030505')=0;
```

`STRCMP()` é uma função de string, então ela converte `idate` para uma string no formato `'YYYY-MM-DD'` e realiza uma comparação de strings. Ela não converte `'20030505'` para a data `'2003-05-05'` e realiza uma comparação de datas.

Se você habilitar o modo SQL `ALLOW_INVALID_DATES`, o MySQL permite que você armazene datas que são fornecidas apenas com verificações limitadas: o MySQL exige apenas que o dia esteja no intervalo de 1 a 31 e o mês esteja no intervalo de 1 a 12. Isso torna o MySQL muito conveniente para aplicações web onde você obtém ano, mês e dia em três campos diferentes e deseja armazenar exatamente o que o usuário inseriu (sem validação de data).

O MySQL permite que você armazene datas onde o dia ou o mês e o dia são zero. Isso é conveniente se você quiser armazenar uma data de nascimento em uma coluna `DATE` e souber apenas parte da data. Para não permitir partes de mês ou dia zero em datas, habilite o modo `NO_ZERO_IN_DATE`.

O MySQL permite que você armazene um valor "zero" de `'0000-00-00'` como uma "data fictícia". Isso é, em alguns casos, mais conveniente do que usar valores `NULL`. Se uma data a ser armazenada em uma coluna `DATE` não puder ser convertida em qualquer valor razoável, o MySQL armazena `'0000-00-00'`. Para não permitir `'0000-00-00'`, habilite o modo `NO_ZERO_DATE`.

Para que o MySQL verifique todas as datas e aceite apenas datas válidas (a menos que seja ignorado pela opção `IGNORE`), defina a variável de sistema `sql_mode` para `"NO_ZERO_IN_DATE,NO_ZERO_DATE"`.