#### 5.3.4.5 Cálculos de Datas

O MySQL fornece várias funções que você pode usar para realizar cálculos com datas, por exemplo, para calcular idades ou extrair partes de datas.

Para determinar quantos anos cada um de seus animais de estimação tem, use a função `TIMESTAMPDIFF()`. Seus argumentos são a unidade na qual você deseja que o resultado seja expresso e as duas datas para as quais deseja-se calcular a diferença. A consulta a seguir mostra, para cada animal de estimação, a data de nascimento, a data atual e a idade em anos. Uma *alias* (`idade`) é usada para tornar a etiqueta da coluna de saída mais significativa.

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

A consulta funciona, mas o resultado poderia ser lido mais facilmente se as linhas fossem apresentadas em algum tipo de ordem. Isso pode ser feito adicionando uma cláusula `ORDER BY nome` para ordenar a saída por nome:

```
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

Para ordenar a saída por `idade` em vez de `nome`, basta usar uma cláusula `ORDER BY` diferente:

```
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

Uma consulta semelhante pode ser usada para determinar a idade na morte para animais que morreram. Você determina quais são esses animais verificando se o valor `morte` é `NULL`. Em seguida, para aqueles com valores não `NULL`, calcule a diferença entre os valores `morte` e `nascimento`:

```
mysql> SELECT name, birth, death,
       TIMESTAMPDIFF(YEAR,birth,death) AS age
       FROM pet WHERE death IS NOT NULL ORDER BY age;
+--------+------------+------------+------+
| name   | birth      | death      | age  |
+--------+------------+------------+------+
| Bowser | 1989-08-31 | 1995-07-29 |    5 |
+--------+------------+------------+------+
```

A consulta usa `morte IS NOT NULL` em vez de `morte <> NULL` porque `NULL` é um valor especial que não pode ser comparado usando os operadores de comparação usuais. Isso é discutido mais adiante. Veja  Seção 5.3.4.6, “Trabalhando com Valores NULL”.

E se você quiser saber quais animais têm aniversários no próximo mês? Para esse tipo de cálculo, ano e dia são irrelevantes; você simplesmente deseja extrair a parte do mês da coluna `nascimento`. O MySQL fornece várias funções para extrair partes de datas, como `YEAR()`, `MONTH()` e `DAYOFMONTH()`. `MONTH()` é a função apropriada aqui. Para ver como funciona, execute uma consulta simples que exiba o valor de `nascimento` e `MONTH(nascimento)`:

```
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

Encontrar animais com aniversários no próximo mês também é simples. Suponha que o mês atual seja abril. Então, o valor do mês é `4` e você pode procurar por animais nascidos em maio (mês `5`) da seguinte forma:

```
mysql> SELECT name, birth FROM pet WHERE MONTH(birth) = 5;
+-------+------------+
| name  | birth      |
+-------+------------+
| Buffy | 1989-05-13 |
+-------+------------+
```

Há uma pequena complicação se o mês atual for dezembro. Você não pode simplesmente adicionar um ao número do mês (`12`) e procurar por animais nascidos no mês `13`, porque não existe tal mês. Em vez disso, você procura por animais nascidos em janeiro (mês `1`).

Você pode escrever a consulta para que ela funcione independentemente do mês atual, para que você não precise usar o número de um mês específico. `DATE_ADD()` permite que você adicione um intervalo de tempo a uma data dada. Se você adicionar um mês ao valor de `CURDATE()`, e depois extrair a parte do mês com `MONTH()`, o resultado produzirá o mês em que procurar por aniversários:

```
mysql> SELECT name, birth FROM pet
       WHERE MONTH(birth) = MONTH(DATE_ADD(CURDATE(),INTERVAL 1 MONTH));
```

Uma maneira diferente de realizar a mesma tarefa é adicionar `1` para obter o próximo mês após o atual, após usar a função módulo (`MOD`) para encurtar o valor do mês para `0` se ele estiver atualmente `12`:

```
mysql> SELECT name, birth FROM pet
       WHERE MONTH(birth) = MOD(MONTH(CURDATE()), 12) + 1;
```

`MONTH()` retorna um número entre `1` e `12`. E `MOD(algo, 12)` retorna um número entre `0` e `11`. Então, a adição tem que ser depois do `MOD()`, caso contrário, iremos de novembro (`11`) para janeiro (`1`).

Se um cálculo usa datas inválidas, o cálculo falha e produz avisos:

```
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