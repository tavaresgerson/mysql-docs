#### 3.3.4.5 Cálculos de Data

O MySQL fornece diversas functions que você pode usar para realizar cálculos em datas, por exemplo, para calcular idades ou extrair partes de datas.

Para determinar quantos anos cada um dos seus pets tem, use a function [`TIMESTAMPDIFF()`](date-and-time-functions.html#function_timestampdiff). Seus argumentos são a unidade na qual você deseja que o resultado seja expresso e as duas datas para as quais se deve calcular a diferença. A seguinte Query mostra, para cada pet, a data de nascimento, a data atual e a idade em anos. Um *alias* (`age`) é usado para tornar o rótulo da coluna de saída final mais significativo.

```sql
mysql> SELECT name, birth, CURDATE(),
       TIMESTAMPDIFF(YEAR,birth,CURDATE()) AS age
       FROM pet;
+----------+------------+------------+------+
| name     | birth      | CURDATE()  | age  |
+----------+------------+------------+------+
| Fluffy   | 1993-02-04 | 2003-08-19 |   10 |
| Claws    | 1994-03-17 | 2003-08-19 |    9 |
| Buffy    | 1989-05-13 | 2003-08-19 |   14 |
| Fang     | 1990-08-27 | 2003-08-19 |   12 |
| Bowser   | 1989-08-31 | 2003-08-19 |   13 |
| Chirpy   | 1998-09-11 | 2003-08-19 |    4 |
| Whistler | 1997-12-09 | 2003-08-19 |    5 |
| Slim     | 1996-04-29 | 2003-08-19 |    7 |
| Puffball | 1999-03-30 | 2003-08-19 |    4 |
+----------+------------+------------+------+
```

A Query funciona, mas o resultado pode ser analisado mais facilmente se as linhas forem apresentadas em alguma ordem. Isso pode ser feito adicionando uma cláusula `ORDER BY name` para ordenar a saída por nome:

```sql
mysql> SELECT name, birth, CURDATE(),
       TIMESTAMPDIFF(YEAR,birth,CURDATE()) AS age
       FROM pet ORDER BY name;
+----------+------------+------------+------+
| name     | birth      | CURDATE()  | age  |
+----------+------------+------------+------+
| Bowser   | 1989-08-31 | 2003-08-19 |   13 |
| Buffy    | 1989-05-13 | 2003-08-19 |   14 |
| Chirpy   | 1998-09-11 | 2003-08-19 |    4 |
| Claws    | 1994-03-17 | 2003-08-19 |    9 |
| Fang     | 1990-08-27 | 2003-08-19 |   12 |
| Fluffy   | 1993-02-04 | 2003-08-19 |   10 |
| Puffball | 1999-03-30 | 2003-08-19 |    4 |
| Slim     | 1996-04-29 | 2003-08-19 |    7 |
| Whistler | 1997-12-09 | 2003-08-19 |    5 |
+----------+------------+------------+------+
```

Para ordenar a saída por `age` em vez de `name`, basta usar uma cláusula `ORDER BY` diferente:

```sql
mysql> SELECT name, birth, CURDATE(),
       TIMESTAMPDIFF(YEAR,birth,CURDATE()) AS age
       FROM pet ORDER BY age;
+----------+------------+------------+------+
| name     | birth      | CURDATE()  | age  |
+----------+------------+------------+------+
| Chirpy   | 1998-09-11 | 2003-08-19 |    4 |
| Puffball | 1999-03-30 | 2003-08-19 |    4 |
| Whistler | 1997-12-09 | 2003-08-19 |    5 |
| Slim     | 1996-04-29 | 2003-08-19 |    7 |
| Claws    | 1994-03-17 | 2003-08-19 |    9 |
| Fluffy   | 1993-02-04 | 2003-08-19 |   10 |
| Fang     | 1990-08-27 | 2003-08-19 |   12 |
| Bowser   | 1989-08-31 | 2003-08-19 |   13 |
| Buffy    | 1989-05-13 | 2003-08-19 |   14 |
+----------+------------+------------+------+
```

Uma Query semelhante pode ser usada para determinar a idade na morte de animais que faleceram. Você determina quais são esses animais verificando se o valor `death` é `NULL`. Em seguida, para aqueles com valores não-`NULL`, calcule a diferença entre os valores `death` e `birth`:

```sql
mysql> SELECT name, birth, death,
       TIMESTAMPDIFF(YEAR,birth,death) AS age
       FROM pet WHERE death IS NOT NULL ORDER BY age;
+--------+------------+------------+------+
| name   | birth      | death      | age  |
+--------+------------+------------+------+
| Bowser | 1989-08-31 | 1995-07-29 |    5 |
+--------+------------+------------+------+
```

A Query usa `death IS NOT NULL` em vez de `death <> NULL` porque `NULL` é um valor especial que não pode ser comparado usando os operadores de comparação usuais. Isso é discutido mais adiante. Consulte [Seção 3.3.4.6, “Trabalhando com Valores NULL”](working-with-null.html "3.3.4.6 Working with NULL Values").

E se você quiser saber quais animais fazem aniversário no próximo mês? Para este tipo de cálculo, ano e dia são irrelevantes; você simplesmente deseja extrair a parte do mês da coluna `birth`. O MySQL fornece diversas functions para extrair partes de datas, como [`YEAR()`](date-and-time-functions.html#function_year), [`MONTH()`](date-and-time-functions.html#function_month) e [`DAYOFMONTH()`](date-and-time-functions.html#function_dayofmonth). [`MONTH()`](date-and-time-functions.html#function_month) é a function apropriada aqui. Para ver como funciona, execute uma Query simples que exibe o valor de `birth` e [`MONTH(birth)`](date-and-time-functions.html#function_month):

```sql
mysql> SELECT name, birth, MONTH(birth) FROM pet;
+----------+------------+--------------+
| name     | birth      | MONTH(birth) |
+----------+------------+--------------+
| Fluffy   | 1993-02-04 |            2 |
| Claws    | 1994-03-17 |            3 |
| Buffy    | 1989-05-13 |            5 |
| Fang     | 1990-08-27 |            8 |
| Bowser   | 1989-08-31 |            8 |
| Chirpy   | 1998-09-11 |            9 |
| Whistler | 1997-12-09 |           12 |
| Slim     | 1996-04-29 |            4 |
| Puffball | 1999-03-30 |            3 |
+----------+------------+--------------+
```

Encontrar animais com aniversários no mês seguinte também é simples. Suponha que o mês atual seja Abril. Então o valor do mês é `4` e você pode procurar por animais nascidos em Maio (mês `5`) assim:

```sql
mysql> SELECT name, birth FROM pet WHERE MONTH(birth) = 5;
+-------+------------+
| name  | birth      |
+-------+------------+
| Buffy | 1989-05-13 |
+-------+------------+
```

Há uma pequena complicação se o mês atual for Dezembro. Você não pode simplesmente adicionar um ao número do mês (`12`) e procurar por animais nascidos no mês `13`, porque esse mês não existe. Em vez disso, você procura por animais nascidos em Janeiro (mês `1`).

Você pode escrever a Query de forma que ela funcione independentemente do mês atual, para que você não precise usar o número de um mês específico. [`DATE_ADD()`](date-and-time-functions.html#function_date-add) permite adicionar um intervalo de tempo a uma determinada data. Se você adicionar um mês ao valor de [`CURDATE()`](date-and-time-functions.html#function_curdate) e, em seguida, extrair a parte do mês com [`MONTH()`](date-and-time-functions.html#function_month), o resultado produzirá o mês no qual procurar por aniversários:

```sql
mysql> SELECT name, birth FROM pet
       WHERE MONTH(birth) = MONTH(DATE_ADD(CURDATE(),INTERVAL 1 MONTH));
```

Uma maneira diferente de realizar a mesma tarefa é adicionar `1` para obter o próximo mês após o atual, após usar a function módulo (`MOD`) para "envolver" (wrap) o valor do mês para `0` se for atualmente `12`:

```sql
mysql> SELECT name, birth FROM pet
       WHERE MONTH(birth) = MOD(MONTH(CURDATE()), 12) + 1;
```

[`MONTH()`](date-and-time-functions.html#function_month) retorna um número entre `1` e `12`. E [`MOD(something,12)`](mathematical-functions.html#function_mod) retorna um número entre `0` e `11`. Portanto, a adição deve ser após o [`MOD()`](mathematical-functions.html#function_mod), caso contrário iríamos de Novembro (`11`) para Janeiro (`1`).

Se um cálculo usar datas inválidas, o cálculo falha e produz warnings:

```sql
mysql> SELECT '2018-10-31' + INTERVAL 1 DAY;
+-------------------------------+
| '2018-10-31' + INTERVAL 1 DAY |
+-------------------------------+
| 2018-11-01                    |
+-------------------------------+
mysql> SELECT '2018-10-32' + INTERVAL 1 DAY;
+-------------------------------+
| '2018-10-32' + INTERVAL 1 DAY |
+-------------------------------+
| NULL                          |
+-------------------------------+
mysql> SHOW WARNINGS;
+---------+------+----------------------------------------+
| Level   | Code | Message                                |
+---------+------+----------------------------------------+
| Warning | 1292 | Incorrect datetime value: '2018-10-32' |
+---------+------+----------------------------------------+
```
