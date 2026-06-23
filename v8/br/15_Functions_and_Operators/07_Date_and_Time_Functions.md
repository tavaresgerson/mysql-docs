## 14.7 Funções de Data e Hora

Esta seção descreve as funções que podem ser usadas para manipular valores temporais. Consulte a Seção 13.2, “Tipos de dados de data e hora”, para uma descrição da faixa de valores que cada tipo de data e hora tem e dos formatos válidos nos quais os valores podem ser especificados.

**Tabela 14.11 Funções de data e hora**

<table frame="box" rules="all" summary="A reference that lists date and time functions."><col style="width: 28%"/><col style="width: 71%"/><thead><tr><th>Name</th> <th>Descrição</th> </tr></thead><tbody><tr><td><code>ADDDATE()</code></td> <td>Adicione valores de tempo (intervalos) a um valor de data</td> </tr><tr><td><code>ADDTIME()</code></td> <td>Adicione tempo</td> </tr><tr><td><code>CONVERT_TZ()</code></td> <td>Converter de um fuso horário para outro</td> </tr><tr><td><code>CURDATE()</code></td> <td>Retorne a data atual</td> </tr><tr><td><code>CURRENT_DATE()</code>, <code>CURRENT_DATE</code></td> <td>Sinônimos para CURDATE()</td> </tr><tr><td><code>CURRENT_TIME()</code>, <code>CURRENT_TIME</code></td> <td>Sinônimos para CURTIME()</td> </tr><tr><td><code>CURRENT_TIMESTAMP()</code>, <code>CURRENT_TIMESTAMP</code></td> <td>Sinônimos para NOW()</td> </tr><tr><td><code>CURTIME()</code></td> <td>Retorne a hora atual</td> </tr><tr><td><code>DATE()</code></td> <td>Extrair a parte de data de uma expressão de data ou datetime</td> </tr><tr><td><code>DATE_ADD()</code></td> <td>Adicione valores de tempo (intervalos) a um valor de data</td> </tr><tr><td><code>DATE_FORMAT()</code></td> <td>Formatar a data conforme especificado</td> </tr><tr><td><code>DATE_SUB()</code></td> <td>Subtrair um valor de tempo (intervalo) de uma data</td> </tr><tr><td><code>DATEDIFF()</code></td> <td>Subtraia duas datas</td> </tr><tr><td><code>DAY()</code></td> <td>Sinônimo de DAYOFMONTH()</td> </tr><tr><td><code>DAYNAME()</code></td> <td>Retorne o nome do dia da semana</td> </tr><tr><td><code>DAYOFMONTH()</code></td> <td>Retorno do dia do mês (0-31)</td> </tr><tr><td><code>DAYOFWEEK()</code></td> <td>Retorne o índice de dia da semana do argumento</td> </tr><tr><td><code>DAYOFYEAR()</code></td> <td>Retorno do dia do ano (1-366)</td> </tr><tr><td><code>EXTRACT()</code></td> <td>Extrair parte de uma data</td> </tr><tr><td><code>FROM_DAYS()</code></td> <td>Converta um número de dia em uma data</td> </tr><tr><td><code>FROM_UNIXTIME()</code></td> <td>Formatar o timestamp Unix como uma data</td> </tr><tr><td><code>GET_FORMAT()</code></td> <td>Retorne uma string de formato de data</td> </tr><tr><td><code>HOUR()</code></td> <td>Extraia a hora</td> </tr><tr><td><code>LAST_DAY</code></td> <td>Devolva o último dia do mês para o argumento</td> </tr><tr><td><code>LOCALTIME()</code>, <code>LOCALTIME</code></td> <td>Sinônimo de NOW()</td> </tr><tr><td><code>LOCALTIMESTAMP</code>, <code>LOCALTIMESTAMP()</code></td> <td>Sinônimo de NOW()</td> </tr><tr><td><code>MAKEDATE()</code></td> <td>Crie uma data a partir do ano e do dia do ano</td> </tr><tr><td><code>MAKETIME()</code></td> <td>Crie tempo a partir de hora, minuto e segundo</td> </tr><tr><td><code>MICROSECOND()</code></td> <td>Retorne os microsegundos do argumento</td> </tr><tr><td><code>MINUTE()</code></td> <td>Retorne o minuto do argumento</td> </tr><tr><td><code>MONTH()</code></td> <td>Retorne o mês da data passada</td> </tr><tr><td><code>MONTHNAME()</code></td> <td>Retorne o nome do mês</td> </tr><tr><td><code>NOW()</code></td> <td>Retorne a data e a hora atuais</td> </tr><tr><td><code>PERIOD_ADD()</code></td> <td>Adicione um período a um ano-mês</td> </tr><tr><td><code>PERIOD_DIFF()</code></td> <td>Retorne o número de meses entre os períodos</td> </tr><tr><td><code>QUARTER()</code></td> <td>Retorne o quarto de um argumento de data</td> </tr><tr><td><code>SEC_TO_TIME()</code></td> <td>Converte segundos para o formato 'hh:mm:ss'</td> </tr><tr><td><code>SECOND()</code></td> <td>Retorne o segundo (0-59)</td> </tr><tr><td><code>STR_TO_DATE()</code></td> <td>Converter uma string em uma data</td> </tr><tr><td><code>SUBDATE()</code></td> <td>Símil para DATE_SUB() quando invocado com três argumentos</td> </tr><tr><td><code>SUBTIME()</code></td> <td>Subtraia os tempos</td> </tr><tr><td><code>SYSDATE()</code></td> <td>Retorne o tempo em que a função é executada</td> </tr><tr><td><code>TIME()</code></td> <td>Extraia a porção de tempo da expressão passada</td> </tr><tr><td><code>TIME_FORMAT()</code></td> <td>Formato como tempo</td> </tr><tr><td><code>TIME_TO_SEC()</code></td> <td>Retorne o argumento convertido em segundos</td> </tr><tr><td><code>TIMEDIFF()</code></td> <td>Subtraia o tempo</td> </tr><tr><td><code>TIMESTAMP()</code></td> <td>Com um único argumento, essa função retorna a expressão de data ou datetime; com dois argumentos, a soma dos argumentos</td> </tr><tr><td><code>TIMESTAMPADD()</code></td> <td>Adicione um intervalo a uma expressão de data e hora</td> </tr><tr><td><code>TIMESTAMPDIFF()</code></td> <td>Retorne a diferença entre duas expressões datetime, usando as unidades especificadas</td> </tr><tr><td><code>TO_DAYS()</code></td> <td>Retorne o argumento de data convertido em dias</td> </tr><tr><td><code>TO_SECONDS()</code></td> <td>Retorne o argumento de data ou datetime convertido em segundos desde o Ano 0</td> </tr><tr><td><code>UNIX_TIMESTAMP()</code></td> <td>Retorne um timestamp Unix</td> </tr><tr><td><code>UTC_DATE()</code></td> <td>Retorne a data atual do UTC</td> </tr><tr><td><code>UTC_TIME()</code></td> <td>Retorne o horário atual do UTC</td> </tr><tr><td><code>UTC_TIMESTAMP()</code></td> <td>Retorne a data e a hora atuais do UTC</td> </tr><tr><td><code>WEEK()</code></td> <td>Retorne o número da semana</td> </tr><tr><td><code>WEEKDAY()</code></td> <td>Retorne o índice do dia da semana</td> </tr><tr><td><code>WEEKOFYEAR()</code></td> <td>Retorne a semana do calendário da data (1-53)</td> </tr><tr><td><code>YEAR()</code></td> <td>Retorne o ano</td> </tr><tr><td><code>YEARWEEK()</code></td> <td>Retorne o ano e a semana</td> </tr></tbody></table>

Aqui está um exemplo que usa funções de data. A consulta a seguir seleciona todas as linhas com um valor *`date_col`* nos últimos 30 dias:

```
mysql> SELECT something FROM tbl_name
    -> WHERE DATE_SUB(CURDATE(),INTERVAL 30 DAY) <= date_col;
```

A consulta também seleciona linhas com datas que estão no futuro.

Funções que esperam valores de data geralmente aceitam valores datetime e ignoram a parte de hora. Funções que esperam valores de hora geralmente aceitam valores datetime e ignoram a parte de data.

As funções que retornam a data ou a hora atual são avaliadas apenas uma vez por consulta no início da execução da consulta. Isso significa que múltiplas referências a uma função, como `NOW()` dentro de uma única consulta, sempre produzem o mesmo resultado. (Para nossos propósitos, uma única consulta também inclui uma chamada a um programa armazenado (rotina armazenada, gatilho ou evento) e todos os subprogramas chamados por esse programa.) Esse princípio também se aplica a `CURDATE()`, `CURTIME()`, `UTC_DATE()`, `UTC_TIME()`, `UTC_TIMESTAMP()` e a qualquer um de seus sinônimos.

As funções `CURRENT_TIMESTAMP()`, `CURRENT_TIME()`, `CURRENT_DATE()` e `FROM_UNIXTIME()` retornam valores no fuso horário da sessão atual, que está disponível como o valor da sessão da variável de sistema `time_zone`. Além disso, `UNIX_TIMESTAMP()` assume que seu argumento é um valor datetime no fuso horário da sessão. Veja a Seção 7.1.15, “Suporte ao Fuso Horário do MySQL Server”.

Algumas funções de data podem ser usadas com datas "zero" ou datas incompletas, como `'2001-11-00'`, enquanto outras não podem. As funções que extraem partes de datas geralmente funcionam com datas incompletas e, portanto, podem retornar 0 quando você poderia esperar um valor não nulo. Por exemplo:

```
mysql> SELECT DAYOFMONTH('2001-11-00'), MONTH('2005-00-00');
        -> 0, 0
```

Outras funções esperam datas completas e retornam `NULL` para datas incompletas. Essas funções incluem funções que realizam cálculos de data ou que mapeiam partes das datas para nomes. Por exemplo:

```
mysql> SELECT DATE_ADD('2006-05-00',INTERVAL 1 DAY);
        -> NULL
mysql> SELECT DAYNAME('2006-05-00');
        -> NULL
```

Várias funções são estritas quando passam um valor da função `DATE()` como argumento e rejeitam datas incompletas com uma parte do dia de zero: `CONVERT_TZ()`, `DATE_ADD()`, `DATE_SUB()`, `DAYOFYEAR()`, `TIMESTAMPDIFF()`, `TO_DAYS()`, `TO_SECONDS()`, `WEEK()`, `WEEKDAY()`, `WEEKOFYEAR()`, `YEARWEEK()`.

Os segundos fracionários para os valores de `TIME`, `DATETIME` e `TIMESTAMP` são suportados, com precisão de até microsegundos. As funções que aceitam argumentos temporais aceitam valores com segundos fracionários. Os valores de retorno das funções temporais incluem segundos fracionários conforme apropriado.

* `ADDDATE(date,INTERVAL expr unit)`(date-and-time-functions.html#function_adddate), `ADDDATE(date,days)`

Quando invocado com a forma `INTERVAL` do segundo argumento, `ADDDATE()` é sinônimo de `DATE_ADD()`. A função relacionada `SUBDATE()` é sinônimo de `DATE_SUB()`. Para informações sobre o argumento *`INTERVAL` *`unit`, consulte Intervalos Temporais.

  ```
  mysql> SELECT DATE_ADD('2008-01-02', INTERVAL 31 DAY);
          -> '2008-02-02'
  mysql> SELECT ADDDATE('2008-01-02', INTERVAL 31 DAY);
          -> '2008-02-02'
  ```

Quando invocado com a forma *`days`* do segundo argumento, o MySQL o trata como um número inteiro de dias a ser adicionado a *`expr`*.

  ```
  mysql> SELECT ADDDATE('2008-01-02', 31);
          -> '2008-02-02'
  ```

Essa função retorna `NULL` se *`date`* ou *`days`* é `NULL`.

* `ADDTIME(expr1,expr2)`

`ADDTIME()` adiciona *`expr2`* a *`expr1`* e retorna o resultado. *`expr1`* é uma expressão de tempo ou data e hora, e *`expr2`* é uma expressão de tempo. Retorna `NULL` se *`expr1`* ou *`expr2`* é `NULL`.

A partir do MySQL 8.0.28, o tipo de retorno dessa função e da função `SUBTIME()` é determinado da seguinte forma:

+ Se o primeiro argumento for um parâmetro dinâmico (como em uma declaração preparada), o tipo de retorno é `TIME`.

+ Caso contrário, o tipo resolvido da função é derivado do tipo resolvido do primeiro argumento.

  ```
  mysql> SELECT ADDTIME('2007-12-31 23:59:59.999999', '1 1:1:1.000002');
          -> '2008-01-02 01:01:01.000001'
  mysql> SELECT ADDTIME('01:00:00.999999', '02:00:00.999998');
          -> '03:00:01.999997'
  ```

* `CONVERT_TZ(dt,from_tz,to_tz)`

`CONVERT_TZ()` converte um valor de datetime *`dt`* do fuso horário dado por *`from_tz`* para o fuso horário dado por *`to_tz`* e retorna o valor resultante. Os fusos horários são especificados conforme descrito na Seção 7.1.15, “Suporte ao Fuso Horário do MySQL Server”. Esta função retorna `NULL` se algum dos argumentos for inválido ou se algum deles for `NULL`.

Nas plataformas de 32 bits, a faixa de valores compatível para essa função é a mesma que para o tipo `TIMESTAMP` (consulte a Seção 13.2.1, “Sintaxe do Tipo de Dados de Data e Hora”, para informações sobre a faixa). Nas plataformas de 64 bits, a partir do MySQL 8.0.28, o valor máximo compatível é `'3001-01-18 23:59:59.999999'` UTC.

Independentemente da plataforma ou da versão do MySQL, se o valor sair do intervalo suportado ao ser convertido de *`from_tz`* para UTC, não ocorrerá nenhuma conversão.

  ```
  mysql> SELECT CONVERT_TZ('2004-01-01 12:00:00','GMT','MET');
          -> '2004-01-01 13:00:00'
  mysql> SELECT CONVERT_TZ('2004-01-01 12:00:00','+00:00','+10:00');
          -> '2004-01-01 22:00:00'
  ```

Nota

Para usar fusos horários nomeados, como `'MET'` ou `'Europe/Amsterdam'`, as tabelas de fuso horário devem ser configuradas corretamente. Para obter instruções, consulte a Seção 7.1.15, “Suporte de Fuso Horário do MySQL Server”.

* `CURDATE()`

Retorna a data atual como um valor no formato `'YYYY-MM-DD'` ou *`YYYYMMDD`*, dependendo se a função é usada em contexto de string ou numérico.

  ```
  mysql> SELECT CURDATE();
          -> '2008-06-13'
  mysql> SELECT CURDATE() + 0;
          -> 20080613
  ```

* `CURRENT_DATE`, `CURRENT_DATE()`

`CURRENT_DATE` e `CURRENT_DATE()` são sinônimos de `CURDATE()`.

* `CURRENT_TIME`, `CURRENT_TIME([fsp])`

`CURRENT_TIME` e `CURRENT_TIME()` são sinônimos de `CURTIME()`.

* `CURRENT_TIMESTAMP`, `CURRENT_TIMESTAMP([fsp])`

`CURRENT_TIMESTAMP` e `CURRENT_TIMESTAMP()` são sinônimos de `NOW()`.

* `CURTIME([fsp])`

Retorna a hora atual como um valor no formato *`'hh:mm:ss'`* ou *`hhmmss`*, dependendo se a função é usada em contexto de string ou numérico. O valor é expresso no fuso horário da sessão.

Se o argumento *`fsp`* for fornecido para especificar uma precisão de segundos fracionários de 0 a 6, o valor de retorno inclui uma parte de segundos fracionários dessa quantidade de dígitos.

  ```
  mysql> SELECT CURTIME();
  +-----------+
  | CURTIME() |
  +-----------+
  | 19:25:37  |
  +-----------+

  mysql> SELECT CURTIME() + 0;
  +---------------+
  | CURTIME() + 0 |
  +---------------+
  |        192537 |
  +---------------+

  mysql> SELECT CURTIME(3);
  +--------------+
  | CURTIME(3)   |
  +--------------+
  | 19:25:37.840 |
  +--------------+
  ```

* `DATE(expr)`

Extrai a parte de data da expressão de data ou datetime *`expr`*. Retorna `NULL` se *`expr`* é `NULL`.

  ```
  mysql> SELECT DATE('2003-12-31 01:02:03');
          -> '2003-12-31'
  ```

* `DATEDIFF(expr1,expr2)`

`DATEDIFF()` retorna *`expr1`* − *`expr2`* expresso como um valor em dias de uma data para outra. *`expr1`* e *`expr2`* são expressões de data ou data e hora. Apenas as partes de data dos valores são usadas no cálculo.

  ```
  mysql> SELECT DATEDIFF('2007-12-31 23:59:59','2007-12-30');
          -> 1
  mysql> SELECT DATEDIFF('2010-11-30 23:59:59','2010-12-31');
          -> -31
  ```

Essa função retorna `NULL` se *`expr1`* ou *`expr2`* é `NULL`.

* `DATE_ADD(date,INTERVAL expr unit)`(date-and-time-functions.html#function_date-add), `DATE_SUB(date,INTERVAL expr unit)`(date-and-time-functions.html#function_date-sub)

Essas funções realizam cálculos de data. O argumento *`date`* especifica a data inicial ou o valor de data e hora. *`expr`* é uma expressão que especifica o valor do intervalo a ser adicionado ou subtraído da data inicial. *`expr`* é avaliado como uma string; pode começar com um `-` para intervalos negativos. *`unit`* é uma palavra-chave que indica as unidades nas quais a expressão deve ser interpretada.

Para mais informações sobre a sintaxe de intervalo temporal, incluindo uma lista completa dos especificadores *`unit`*, a forma esperada do argumento *`expr`* para cada valor *`unit`* e as regras para interpretação do operador em aritmética temporal, consulte Intervalos Temporais.

O valor de retorno depende dos argumentos:

+ Se *`date`* for `NULL`, a função retorna `NULL`.

+ `DATE` se o argumento *`date`* for um valor de `DATE` e seus cálculos envolvam apenas as partes `YEAR`, `MONTH` e `DAY` (ou seja, sem partes de tempo).

+ (*MySQL 8.0.28 e posterior*:) `TIME` se o argumento *`date`* for um valor de `TIME` e os cálculos envolvam apenas as partes `HOURS`, `MINUTES` e `SECONDS` (ou seja, sem partes de data).

+ `DATETIME` se o primeiro argumento for um valor de `DATETIME` (ou `TIMESTAMP`) ou se o primeiro argumento for um valor de `DATE` e o valor de *`unit`* usa `HOURS`, `MINUTES` ou `SECONDS`, ou se o primeiro argumento é do tipo `TIME` e o valor de *`unit`* usa `YEAR`, `MONTH` ou `DAY`.

+ (*MySQL 8.0.28 e posterior*:) Se o primeiro argumento for um parâmetro dinâmico (por exemplo, de uma declaração preparada), seu tipo resolvido é `DATE` se o segundo argumento for um intervalo que contenha apenas alguma combinação de valores de `YEAR`, `MONTH` ou `DAY`; caso contrário, seu tipo é `DATETIME`.

+ String de outra forma (tipo `VARCHAR`).

Nota

Em MySQL 8.0.22 a 8.0.27, quando usadas em declarações preparadas, essas funções retornavam valores `DATETIME`, independentemente dos tipos de argumentos. (Bug #103781)

Para garantir que o resultado seja `DATETIME`, você pode usar `CAST()` para converter o primeiro argumento em `DATETIME`.

  ```
  mysql> SELECT DATE_ADD('2018-05-01',INTERVAL 1 DAY);
          -> '2018-05-02'
  mysql> SELECT DATE_SUB('2018-05-01',INTERVAL 1 YEAR);
          -> '2017-05-01'
  mysql> SELECT DATE_ADD('2020-12-31 23:59:59',
      ->                 INTERVAL 1 SECOND);
          -> '2021-01-01 00:00:00'
  mysql> SELECT DATE_ADD('2018-12-31 23:59:59',
      ->                 INTERVAL 1 DAY);
          -> '2019-01-01 23:59:59'
  mysql> SELECT DATE_ADD('2100-12-31 23:59:59',
      ->                 INTERVAL '1:1' MINUTE_SECOND);
          -> '2101-01-01 00:01:00'
  mysql> SELECT DATE_SUB('2025-01-01 00:00:00',
      ->                 INTERVAL '1 1:1:1' DAY_SECOND);
          -> '2024-12-30 22:58:59'
  mysql> SELECT DATE_ADD('1900-01-01 00:00:00',
      ->                 INTERVAL '-1 10' DAY_HOUR);
          -> '1899-12-30 14:00:00'
  mysql> SELECT DATE_SUB('1998-01-02', INTERVAL 31 DAY);
          -> '1997-12-02'
  mysql> SELECT DATE_ADD('1992-12-31 23:59:59.000002',
      ->            INTERVAL '1.999999' SECOND_MICROSECOND);
          -> '1993-01-01 00:00:01.000001'
  ```

Quando se adiciona um intervalo `MONTH` a um valor `DATE` ou `DATETIME`, e a data resultante inclui um dia que não existe no mês dado, o dia é ajustado para o último dia do mês, conforme mostrado aqui:

  ```
  mysql> SELECT DATE_ADD('2024-03-30', INTERVAL 1 MONTH) AS d1,
       >        DATE_ADD('2024-03-31', INTERVAL 1 MONTH) AS d2;
  +------------+------------+
  | d1         | d2         |
  +------------+------------+
  | 2024-04-30 | 2024-04-30 |
  +------------+------------+
  1 row in set (0.00 sec)
  ```

* `DATE_FORMAT(date,format)`

Formata o valor *`date`* de acordo com a string *`format`*. Se qualquer um dos argumentos for `NULL`, a função retorna `NULL`.

Os especificadores mostrados na tabela a seguir podem ser usados na string *`format`*. O caractere `%` é necessário antes dos caracteres do especificador de formato. Os especificadores se aplicam também a outras funções: `STR_TO_DATE()`, `TIME_FORMAT()`, `UNIX_TIMESTAMP()`.

  <table summary="Specifier characters for the DATE_FORMAT function that may be used in the format string and provides a description of each specifier character."><col style="width: 20%"/><col style="width: 70%"/><thead><tr> <th>Specifier</th> <th>Descrição</th> </tr></thead><tbody><tr> <td><code>%a</code></td> <td>Nome abreviado do dia da semana (<code>Sun</code>..<code>Sat</code>)</td> </tr><tr> <td><code>%b</code></td> <td>Abreviado nome do mês (<code>Jan</code>..<code>Dec</code>)</td> </tr><tr> <td><code>%c</code></td> <td>Mês, numérico (<code>0</code>..<code>12</code>)</td> </tr><tr> <td><code>%D</code></td> <td>Dia do mês com sufixo em inglês (<code>0th</code>,<code>1st</code>,<code>2nd</code>,<code>3rd</code>, …)</td> </tr><tr> <td><code>%d</code></td> <td>Dia do mês, numérico (<code>00</code>..<code>31</code>)</td> </tr><tr> <td><code>%e</code></td> <td>Dia do mês, numérico (<code>0</code>..<code>31</code>)</td> </tr><tr> <td><code>%f</code></td> <td>Microssegundos (<code>000000</code>..<code>999999</code>)</td> </tr><tr> <td><code>%H</code></td> <td>Hora (<code>00</code>..<code>23</code>)</td> </tr><tr> <td><code>%h</code></td> <td>Hora (<code>01</code>..<code>12</code>)</td> </tr><tr> <td><code>%I</code></td> <td>Hora (<code>01</code>..<code>12</code>)</td> </tr><tr> <td><code>%i</code></td> <td>Minutos, numéricos (<code>00</code>..<code>59</code>)</td> </tr><tr> <td><code>%j</code></td> <td>Dia do ano (<code>001</code>..<code>366</code>)</td> </tr><tr> <td><code>%k</code></td> <td>Hora (<code>0</code>..<code>23</code>)</td> </tr><tr> <td><code>%l</code></td> <td>Hora (<code>1</code>..<code>12</code>)</td> </tr><tr> <td><code>%M</code></td> <td>Nome do mês (<code>January</code>..<code>December</code>)</td> </tr><tr> <td><code>%m</code></td> <td>Mês, numérico (<code>00</code>..<code>12</code>)</td> </tr><tr> <td><code>%p</code></td> <td><code>AM</code>ou<code>PM</code></td> </tr><tr> <td><code>%r</code></td> <td>Tempo, 12 horas (<em class="replaceable"><code>hh:mm:ss</code></em>seguido por<code>AM</code>ou<code>PM</code>)</td> </tr><tr> <td><code>%S</code></td> <td>Segundos (<code>00</code>..<code>59</code>)</td> </tr><tr> <td><code>%s</code></td> <td>Segundos (<code>00</code>..<code>59</code>)</td> </tr><tr> <td><code>%T</code></td> <td>Tempo, 24 horas (<em class="replaceable"><code>hh:mm:ss</code></em>)</td> </tr><tr> <td><code>%U</code></td> <td>Semana (<code>00</code>..<code>53</code>), onde o domingo é o primeiro dia da semana;<code>WEEK()</code>modo 0</td> </tr><tr> <td><code>%u</code></td> <td>Semana (<code>00</code>..<code>53</code>), onde segunda-feira é o primeiro dia da semana;<code>WEEK()</code>modo 1</td> </tr><tr> <td><code>%V</code></td> <td>Semana (<code>01</code>..<code>53</code>), onde o domingo é o primeiro dia da semana;<code>WEEK()</code>modo 2; utilizado com<code>%X</code></td> </tr><tr> <td><code>%v</code></td> <td>Semana (<code>01</code>..<code>53</code>), onde segunda-feira é o primeiro dia da semana;<code>WEEK()</code>modo 3; utilizado com<code>%x</code></td> </tr><tr> <td><code>%W</code></td> <td>Nome do dia da semana (<code>Sunday</code>..<code>Saturday</code>)</td> </tr><tr> <td><code>%w</code></td> <td>Dia da semana (<code>0</code>=Sunday..<code>6</code>= Sábado)</td> </tr><tr> <td><code>%X</code></td> <td>Ano para a semana onde o domingo é o primeiro dia da semana, numérico, quatro dígitos; usado com<code>%V</code></td> </tr><tr> <td><code>%x</code></td> <td>Ano da semana, onde o primeiro dia da semana é o primeiro dia da semana, numérico, quatro dígitos; usado com<code>%v</code></td> </tr><tr> <td><code>%Y</code></td> <td>Ano, numérico, quatro dígitos</td> </tr><tr> <td><code>%y</code></td> <td>Ano, numérico (dois dígitos)</td> </tr><tr> <td><code>%%</code></td> <td>Literalmente<code>%</code>personagem</td> </tr><tr> <td><code>%<em class="replaceable"><code>x</code></em></code></td> <td><em class="replaceable"><code>x</code></em>, para qualquer “<em class="replaceable"><code>x</code></em>“não listado acima</td> </tr></tbody></table>

As faixas para os especificadores de mês e dia começam com zero devido ao fato de que o MySQL permite o armazenamento de datas incompletas, como `'2014-00-00'`.

A linguagem usada para os nomes de dia e mês e abreviações é controlada pelo valor da variável do sistema `lc_time_names` (Seção 12.16, “Suporte de localização do servidor MySQL”).

Para os especificadores `%U`, `%u`, `%V` e `%v`, consulte a descrição da função `WEEK()` para obter informações sobre os valores do modo. O modo afeta a forma como a numeração da semana ocorre.

`DATE_FORMAT()` retorna uma string com um conjunto de caracteres e uma ordenação dados por `character_set_connection` e `collation_connection`, para que possa retornar nomes de mês e dia da semana contendo caracteres não ASCII.

  ```
  mysql> SELECT DATE_FORMAT('2009-10-04 22:23:00', '%W %M %Y');
          -> 'Sunday October 2009'
  mysql> SELECT DATE_FORMAT('2007-10-04 22:23:00', '%H:%i:%s');
          -> '22:23:00'
  mysql> SELECT DATE_FORMAT('1900-10-04 22:23:00',
      ->                 '%D %y %a %d %m %b %j');
          -> '4th 00 Thu 04 10 Oct 277'
  mysql> SELECT DATE_FORMAT('1997-10-04 22:23:00',
      ->                 '%H %k %I %r %T %S %w');
          -> '22 22 10 10:23:00 PM 22:23:00 00 6'
  mysql> SELECT DATE_FORMAT('1999-01-01', '%X %V');
          -> '1998 52'
  mysql> SELECT DATE_FORMAT('2006-06-00', '%d');
          -> '00'
  ```

* `DATE_SUB(date,INTERVAL expr unit)`(date-and-time-functions.html#function_date-sub)

Veja a descrição para `DATE_ADD()`.

* `DAY(date)`

`DAY()` é sinônimo de `DAYOFMONTH()`.

* `DAYNAME(date)`

Retorna o nome do dia da semana para *`date`*. A linguagem usada para o nome é controlada pelo valor da variável de sistema `lc_time_names` (consulte Seção 12.16, “Suporte ao Local do MySQL Server”). Retorna `NULL` se *`date`* é `NULL`.

  ```
  mysql> SELECT DAYNAME('2007-02-03');
          -> 'Saturday'
  ```

* `DAYOFMONTH(date)`

Retorna o dia do mês para *`date`*, na faixa de `1` a `31`, ou `0` para datas como `'0000-00-00'` ou `'2008-00-00'` que têm uma parte do dia em zero. Retorna `NULL` se *`date`* é `NULL`.

  ```
  mysql> SELECT DAYOFMONTH('2007-02-03');
          -> 3
  ```

* `DAYOFWEEK(date)`

Retorna o índice do dia da semana para *`date`* (`1` = domingo, `2` = segunda-feira, etc., `7` = sábado). Esses valores de índice correspondem ao padrão ODBC. Retorna `NULL` se *`date`* é `NULL`.

  ```
  mysql> SELECT DAYOFWEEK('2007-02-03');
          -> 7
  ```

* `DAYOFYEAR(date)`

Retorna o dia do ano para *`date`*, na faixa de `1` a `366`. Retorna `NULL` se *`date`* é `NULL`.

  ```
  mysql> SELECT DAYOFYEAR('2007-02-03');
          -> 34
  ```

* `EXTRACT(unit FROM date)`(date-and-time-functions.html#function_extract)

A função `EXTRACT()` utiliza os mesmos tipos de especificadores *`unit`* que `DATE_ADD()` ou `DATE_SUB()`, mas extrai partes da data em vez de realizar cálculos de data. Para informações sobre o argumento *`unit`*, consulte Intervalos Temporais. Retorna `NULL` se *`date`* é `NULL`.

  ```
  mysql> SELECT EXTRACT(YEAR FROM '2019-07-02');
          -> 2019
  mysql> SELECT EXTRACT(YEAR_MONTH FROM '2019-07-02 01:02:03');
          -> 201907
  mysql> SELECT EXTRACT(DAY_MINUTE FROM '2019-07-02 01:02:03');
          -> 20102
  mysql> SELECT EXTRACT(MICROSECOND
      ->                FROM '2003-01-02 10:30:00.000123');
          -> 123
  ```

* `FROM_DAYS(N)`

Dado um número de dia *`N`*, retorna um valor de `DATE`. Retorna `NULL` se *`N`* é `NULL`.

  ```
  mysql> SELECT FROM_DAYS(730669);
          -> '2000-07-03'
  ```

Use `FROM_DAYS()` com cautela em datas antigas. Não é destinado para uso com valores que precedem o advento do calendário gregoriano (1582). Veja a Seção 13.2.7, “Que calendário é usado pelo MySQL?”.

* `FROM_UNIXTIME(unix_timestamp[,format])`

Retorna uma representação de *`unix_timestamp`* como um valor de data/hora ou cadeia de caracteres. O valor retornado é expresso usando o fuso horário da sessão. (Os clientes podem definir o fuso horário da sessão conforme descrito na Seção 7.1.15, “Suporte ao Fuso Horário do MySQL Server”.) *`unix_timestamp`* é um valor de marca-passo interno que representa segundos desde `'1970-01-01 00:00:00'` UTC, como produzido pela função `UNIX_TIMESTAMP()`.

Se *`format`* for omitido, essa função retorna um valor de `DATETIME`.

Se *`unix_timestamp`* ou *`format`* é `NULL`, esta função retorna `NULL`.

Se *`unix_timestamp`* for um inteiro, a precisão de segundos fracionários do `DATETIME` é zero. Quando *`unix_timestamp`* for um valor decimal, a precisão de segundos fracionários do `DATETIME` é a mesma que a precisão do valor decimal, até um máximo de 6. Quando *`unix_timestamp`* for um número em ponto flutuante, a precisão de segundos fracionários do datetime é 6.

Nas plataformas de 32 bits, o valor útil máximo para *`unix_timestamp`* é 2147483647.999999, que retorna `'2038-01-19 03:14:07.999999'` UTC. Nas plataformas de 64 bits que executam o MySQL 8.0.28 ou posterior, o valor máximo efetivo é 32536771199.999999, que retorna `'3001-01-18 23:59:59.999999'` UTC. Independentemente da plataforma ou versão, um valor maior para *`unix_timestamp`* do que o máximo efetivo retorna `0`.

*`format`* é usado para formatar o resultado da mesma maneira que a string de formato usada para a função `DATE_FORMAT()`. Se *`format`* for fornecido, o valor retornado é um `VARCHAR`.

  ```
  mysql> SELECT FROM_UNIXTIME(1447430881);
          -> '2015-11-13 10:08:01'
  mysql> SELECT FROM_UNIXTIME(1447430881) + 0;
          -> 20151113100801
  mysql> SELECT FROM_UNIXTIME(1447430881,
      ->                      '%Y %D %M %h:%i:%s %x');
          -> '2015 13th November 10:08:01 2015'
  ```

Nota

Se você usar `UNIX_TIMESTAMP()` e `FROM_UNIXTIME()` para converter entre valores em um fuso horário não UTC e valores de timestamp Unix, a conversão é perda de dados, porque a mapeo não é um para um em ambas as direções. Para detalhes, consulte a descrição da função `UNIX_TIMESTAMP()`.

* `GET_FORMAT({DATE|TIME|DATETIME}, {'EUR'|'USA'|'JIS'|'ISO'|'INTERNAL'})`(date-and-time-functions.html#function_get-format)

Retorna uma string de formato. Esta função é útil em combinação com as funções `DATE_FORMAT()` e `STR_TO_DATE()`.

Se *`format`* for `NULL`, esta função retorna `NULL`.

Os possíveis valores para o primeiro e segundo argumentos resultam em várias possíveis strings de formato (para os especificadores utilizados, veja a tabela na descrição da função `DATE_FORMAT()`). O formato ISO refere-se ao ISO 9765, não ao ISO 8601.

  <table summary="Function calls for the GET_FORMAT function along with results for each function call."><col style="width: 60%"/><col style="width: 40%"/><thead><tr> <th>Function Call</th> <th>Result</th> </tr></thead><tbody><tr> <td><code>GET_FORMAT(DATE,'USA')</code></td> <td><code>'%m.%d.%Y'</code></td> </tr><tr> <td><code>GET_FORMAT(DATE,'JIS')</code></td> <td><code>'%Y-%m-%d'</code></td> </tr><tr> <td><code>GET_FORMAT(DATE,'ISO')</code></td> <td><code>'%Y-%m-%d'</code></td> </tr><tr> <td><code>GET_FORMAT(DATE,'EUR')</code></td> <td><code>'%d.%m.%Y'</code></td> </tr><tr> <td><code>GET_FORMAT(DATE,'INTERNAL')</code></td> <td><code>'%Y%m%d'</code></td> </tr><tr> <td><code>GET_FORMAT(DATETIME,'USA')</code></td> <td><code>'%Y-%m-%d %H.%i.%s'</code></td> </tr><tr> <td><code>GET_FORMAT(DATETIME,'JIS')</code></td> <td><code>'%Y-%m-%d %H:%i:%s'</code></td> </tr><tr> <td><code>GET_FORMAT(DATETIME,'ISO')</code></td> <td><code>'%Y-%m-%d %H:%i:%s'</code></td> </tr><tr> <td><code>GET_FORMAT(DATETIME,'EUR')</code></td> <td><code>'%Y-%m-%d %H.%i.%s'</code></td> </tr><tr> <td><code>GET_FORMAT(DATETIME,'INTERNAL')</code></td> <td><code>'%Y%m%d%H%i%s'</code></td> </tr><tr> <td><code>GET_FORMAT(TIME,'USA')</code></td> <td><code>'%h:%i:%s %p'</code></td> </tr><tr> <td><code>GET_FORMAT(TIME,'JIS')</code></td> <td><code>'%H:%i:%s'</code></td> </tr><tr> <td><code>GET_FORMAT(TIME,'ISO')</code></td> <td><code>'%H:%i:%s'</code></td> </tr><tr> <td><code>GET_FORMAT(TIME,'EUR')</code></td> <td><code>'%H.%i.%s'</code></td> </tr><tr> <td><code>GET_FORMAT(TIME,'INTERNAL')</code></td> <td><code>'%H%i%s'</code></td> </tr></tbody></table>

`TIMESTAMP` também pode ser usado como o primeiro argumento para `GET_FORMAT()`, nesse caso, a função retorna os mesmos valores que para `DATETIME`.

  ```
  mysql> SELECT DATE_FORMAT('2003-10-03',GET_FORMAT(DATE,'EUR'));
          -> '03.10.2003'
  mysql> SELECT STR_TO_DATE('10.31.2003',GET_FORMAT(DATE,'USA'));
          -> '2003-10-31'
  ```

* `HOUR(time)`

Retorna a hora para *`time`*. A faixa do valor de retorno é `0` a `23` para valores de hora do dia. No entanto, a faixa dos valores de `TIME` é realmente muito maior, então `HOUR` pode retornar valores maiores que `23`. Retorna `NULL` se *`time`* é `NULL`.

  ```
  mysql> SELECT HOUR('10:05:03');
          -> 10
  mysql> SELECT HOUR('272:59:59');
          -> 272
  ```

* `LAST_DAY(date)`

Toma um valor de data ou datetime e retorna o valor correspondente para o último dia do mês. Retorna `NULL` se o argumento for inválido ou `NULL`.

  ```
  mysql> SELECT LAST_DAY('2003-02-05');
          -> '2003-02-28'
  mysql> SELECT LAST_DAY('2004-02-05');
          -> '2004-02-29'
  mysql> SELECT LAST_DAY('2004-01-01 01:01:01');
          -> '2004-01-31'
  mysql> SELECT LAST_DAY('2003-03-32');
          -> NULL
  ```

* `LOCALTIME`, `LOCALTIME([fsp])`

`LOCALTIME` e `LOCALTIME()` são sinônimos de `NOW()`.

* `LOCALTIMESTAMP`, `LOCALTIMESTAMP([fsp])`

`LOCALTIMESTAMP` e `LOCALTIMESTAMP()` são sinônimos de `NOW()`.

* `MAKEDATE(year,dayofyear)`

Retorna uma data, dados o ano e o dia do ano. *`dayofyear`* deve ser maior que 0 ou o resultado é `NULL`. O resultado também é `NULL` se qualquer argumento for `NULL`.

  ```
  mysql> SELECT MAKEDATE(2011,31), MAKEDATE(2011,32);
          -> '2011-01-31', '2011-02-01'
  mysql> SELECT MAKEDATE(2011,365), MAKEDATE(2014,365);
          -> '2011-12-31', '2014-12-31'
  mysql> SELECT MAKEDATE(2011,0);
          -> NULL
  ```

* `MAKETIME(hour,minute,second)`

Retorna um valor de tempo calculado a partir dos argumentos *`hour`*, *`minute`* e *`second`*. Retorna `NULL` se qualquer um de seus argumentos for `NULL`.

O argumento *`second`* pode ter uma parte fracionária.

  ```
  mysql> SELECT MAKETIME(12,15,30);
          -> '12:15:30'
  ```

* `MICROSECOND(expr)`

Retorna os microsegundos a partir do tempo ou expressão datetime *`expr`* como um número no intervalo de `0` a `999999`. Retorna `NULL` se *`expr`* é `NULL`.

  ```
  mysql> SELECT MICROSECOND('12:00:00.123456');
          -> 123456
  mysql> SELECT MICROSECOND('2019-12-31 23:59:59.000010');
          -> 10
  ```

* `MINUTE(time)`

Retorna o minuto para *`time`*, na faixa de `0` a `59`, ou `NULL` se *`time`* é `NULL`.

  ```
  mysql> SELECT MINUTE('2008-02-03 10:05:03');
          -> 5
  ```

* `MONTH(date)`

Retorna o mês de *`date`*, na faixa de `1` a `12` para janeiro a dezembro, ou `0` para datas como `'0000-00-00'` ou `'2008-00-00'` que têm uma parte de mês zero. Retorna `NULL` se *`date`* é `NULL`.

  ```
  mysql> SELECT MONTH('2008-02-03');
          -> 2
  ```

* `MONTHNAME(date)`

Retorna o nome completo do mês para *`date`*. A linguagem usada para o nome é controlada pelo valor da variável de sistema `lc_time_names` (Seção 12.16, “Suporte de localização do servidor MySQL”). Retorna `NULL` se *`date`* é `NULL`.

  ```
  mysql> SELECT MONTHNAME('2008-02-03');
          -> 'February'
  ```

* `NOW([fsp])`

Retorna a data e a hora atuais como um valor no formato `'YYYY-MM-DD hh:mm:ss'` ou *`YYYYMMDDhhmmss`*, dependendo se a função é usada em contexto de string ou numérico. O valor é expresso no fuso horário da sessão.

Se o argumento *`fsp`* for fornecido para especificar uma precisão de segundos fracionários de 0 a 6, o valor de retorno inclui uma parte de segundos fracionários dessa quantidade de dígitos.

  ```
  mysql> SELECT NOW();
          -> '2007-12-15 23:50:26'
  mysql> SELECT NOW() + 0;
          -> 20071215235026.000000
  ```

`NOW()` retorna um tempo constante que indica o momento em que a declaração começou a ser executada. (Dentro de uma função armazenada ou gatilho, `NOW()` retorna o momento em que a função ou a declaração de gatilho começou a ser executada.) Isso difere do comportamento de `SYSDATE()`, que retorna o tempo exato em que é executado.

  ```
  mysql> SELECT NOW(), SLEEP(2), NOW();
  +---------------------+----------+---------------------+
  | NOW()               | SLEEP(2) | NOW()               |
  +---------------------+----------+---------------------+
  | 2006-04-12 13:47:36 |        0 | 2006-04-12 13:47:36 |
  +---------------------+----------+---------------------+

  mysql> SELECT SYSDATE(), SLEEP(2), SYSDATE();
  +---------------------+----------+---------------------+
  | SYSDATE()           | SLEEP(2) | SYSDATE()           |
  +---------------------+----------+---------------------+
  | 2006-04-12 13:47:44 |        0 | 2006-04-12 13:47:46 |
  +---------------------+----------+---------------------+
  ```

Além disso, a declaração `SET TIMESTAMP` afeta o valor retornado por `NOW()`, mas não por `SYSDATE()`. Isso significa que as configurações de marcação de tempo no log binário não têm efeito nas invocações de `SYSDATE()`. Definir o timestamp para um valor não nulo faz com que cada invocação subsequente de `NOW()` retorne esse valor. Definir o timestamp para zero cancela esse efeito, de modo que `NOW()` novamente retorne a data e a hora atuais.

Veja a descrição para `SYSDATE()` para obter informações adicionais sobre as diferenças entre as duas funções.

* `PERIOD_ADD(P,N)`

Adicione *`N`* meses ao período *`P`* (no formato *`YYMM`* ou *`YYYYMM`*). Retorna um valor no formato *`YYYYMM`*.

Nota

O argumento de período *`P`* *não* é um valor de data.

Essa função retorna `NULL` se *`P`* ou *`N`* é `NULL`.

  ```
  mysql> SELECT PERIOD_ADD(200801,2);
          -> 200803
  ```

* `PERIOD_DIFF(P1,P2)`

Retorna o número de meses entre os períodos *`P1`* e *`P2`*. *`P1`* e *`P2`* devem estar no formato *`YYMM`* ou *`YYYYMM`*. Note que os argumentos de período *`P1`* e *`P2`* *não são* valores de data.

Essa função retorna `NULL` se *`P1`* ou *`P2`* é `NULL`.

  ```
  mysql> SELECT PERIOD_DIFF(200802,200703);
          -> 11
  ```

* `QUARTER(date)`

Retorna o trimestre do ano para *`date`*, na faixa de `1` a `4`, ou `NULL` se *`date`* é `NULL`.

  ```
  mysql> SELECT QUARTER('2008-04-01');
          -> 2
  ```

* `SECOND(time)`

Retorna o segundo para *`time`*, na faixa de `0` a `59`, ou `NULL` se *`time`* é `NULL`.

  ```
  mysql> SELECT SECOND('10:05:03');
          -> 3
  ```

* `SEC_TO_TIME(seconds)`

Retorna o argumento *`seconds`*, convertido em horas, minutos e segundos, como um valor de `TIME`. A faixa do resultado é limitada àquela do tipo de dados `TIME`. Um aviso ocorre se o argumento corresponder a um valor fora dessa faixa.

A função retorna `NULL` se *`seconds`* é `NULL`.

  ```
  mysql> SELECT SEC_TO_TIME(2378);
          -> '00:39:38'
  mysql> SELECT SEC_TO_TIME(2378) + 0;
          -> 3938
  ```

* `STR_TO_DATE(str,format)`

Este é o inverso da função `DATE_FORMAT()`. Ela recebe uma string *`str`* e uma string de formato *`format`*. `STR_TO_DATE()` retorna um valor de `DATETIME` se a string de formato contiver partes de data e hora, ou um valor de `DATE` ou `TIME` se a string contiver apenas partes de data ou hora. Se *`str`* ou *`format`* é `NULL`, a função retorna `NULL`. Se o valor de data, hora ou datetime extraído de *`str`* não puder ser analisado de acordo com as regras seguidas pelo servidor, `STR_TO_DATE()` retorna `NULL` e produz um aviso.

O servidor verifica *`str`* tentando combinar *`format`* com ele. A string de formato pode conter caracteres literais e especificadores de formato que começam com `%`. Os caracteres literais em *`format`* devem corresponder literalmente em *`str`*. Os especificadores de formato em *`format`* devem corresponder a uma parte de data ou hora em *`str`*. Para os especificadores que podem ser usados em *`format`*, consulte a descrição da função `DATE_FORMAT()`.

  ```
  mysql> SELECT STR_TO_DATE('01,5,2013','%d,%m,%Y');
          -> '2013-05-01'
  mysql> SELECT STR_TO_DATE('May 1, 2013','%M %d,%Y');
          -> '2013-05-01'
  ```

A digitalização começa no início de *`str`* e falha se *`format`* não corresponder. Os caracteres extras no final de *`str`* são ignorados.

  ```
  mysql> SELECT STR_TO_DATE('a09:30:17','a%h:%i:%s');
          -> '09:30:17'
  mysql> SELECT STR_TO_DATE('a09:30:17','%h:%i:%s');
          -> NULL
  mysql> SELECT STR_TO_DATE('09:30:17a','%h:%i:%s');
          -> '09:30:17'
  ```

As partes com data ou hora não especificadas têm um valor de 0, portanto, os valores incompletamente especificados em *`str`* produzem um resultado com algumas ou todas as partes definidas como 0:

  ```
  mysql> SELECT STR_TO_DATE('abc','abc');
          -> '0000-00-00'
  mysql> SELECT STR_TO_DATE('9','%m');
          -> '0000-09-00'
  mysql> SELECT STR_TO_DATE('9','%s');
          -> '00:00:09'
  ```

A verificação de intervalo das partes dos valores de data é conforme descrito na Seção 13.2.2, “Os tipos DATE, DATETIME e TIMESTAMP”. Isso significa, por exemplo, que datas “zero” ou datas com valores de parte de 0 são permitidas, a menos que o modo SQL seja configurado para não permitir tais valores.

  ```
  mysql> SELECT STR_TO_DATE('00/00/0000', '%m/%d/%Y');
          -> '0000-00-00'
  mysql> SELECT STR_TO_DATE('04/31/2004', '%m/%d/%Y');
          -> '2004-04-31'
  ```

Se o modo SQL `NO_ZERO_DATE` estiver habilitado, datas nulos não são permitidas. Nesse caso, `STR_TO_DATE()` retorna `NULL` e gera um aviso:

  ```
  mysql> SET sql_mode = '';
  mysql> SELECT STR_TO_DATE('00/00/0000', '%m/%d/%Y');
  +---------------------------------------+
  | STR_TO_DATE('00/00/0000', '%m/%d/%Y') |
  +---------------------------------------+
  | 0000-00-00                            |
  +---------------------------------------+
  mysql> SET sql_mode = 'NO_ZERO_DATE';
  mysql> SELECT STR_TO_DATE('00/00/0000', '%m/%d/%Y');
  +---------------------------------------+
  | STR_TO_DATE('00/00/0000', '%m/%d/%Y') |
  +---------------------------------------+
  | NULL                                  |
  +---------------------------------------+
  mysql> SHOW WARNINGS\G
  *************************** 1. row ***************************
    Level: Warning
     Code: 1411
  Message: Incorrect datetime value: '00/00/0000' for function str_to_date
  ```

Antes do MySQL 8.0.35, era possível passar uma string de data inválida, como `'2021-11-31'`, para essa função. No MySQL 8.0.35 e versões posteriores, `STR_TO_DATE()` realiza verificação completa da faixa e levanta um erro se a data após a conversão for inválida.

Nota

Você não pode usar o formato `"%X%V"` para converter uma string de ano-semana em uma data, porque a combinação de um ano e uma semana não identifica de forma única um ano e um mês se a semana atravessa uma fronteira de mês. Para converter um ano-semana em uma data, você também deve especificar o dia da semana:

  ```
  mysql> SELECT STR_TO_DATE('200442 Monday', '%X%V %W');
          -> '2004-10-18'
  ```

Você também deve estar ciente de que, para datas e partes da data de valores datetime, `STR_TO_DATE()` verifica (apenas) o ano, mês e dia do mês dos valores de validade. Mais precisamente, isso significa que o ano é verificado para garantir que esteja no intervalo de 0-9999 inclusive, o mês é verificado para garantir que esteja no intervalo de 1-12 inclusive, e o dia do mês é verificado para garantir que esteja no intervalo de 1-31 inclusive, mas o servidor não verifica os valores em combinação. Por exemplo, `SELECT STR_TO_DATE('23-2-31', '%Y-%m-%d')` retorna `2023-02-31`. Ativação ou desativação do modo SQL do servidor `ALLOW_INVALID_DATES` não tem efeito sobre esse comportamento. Consulte a Seção 13.2.2, “Os tipos DATE, DATETIME e TIMESTAMP”, para obter mais informações.

* `SUBDATE(date,INTERVAL expr unit)`(date-and-time-functions.html#function_subdate), `SUBDATE(expr,days)`

Quando invocado com a forma `INTERVAL` do segundo argumento, `SUBDATE()` é sinônimo de `DATE_SUB()`. Para informações sobre o argumento *`unit`* do `INTERVAL`, consulte a discussão para `DATE_ADD()`.

  ```
  mysql> SELECT DATE_SUB('2008-01-02', INTERVAL 31 DAY);
          -> '2007-12-02'
  mysql> SELECT SUBDATE('2008-01-02', INTERVAL 31 DAY);
          -> '2007-12-02'
  ```

A segunda forma permite o uso de um valor inteiro para *`days`*. Nesses casos, é interpretado como o número de dias a serem subtraídos da data ou expressão de data e hora *`expr`*.

  ```
  mysql> SELECT SUBDATE('2008-01-02 12:00:00', 31);
          -> '2007-12-02 12:00:00'
  ```

Essa função retorna `NULL` se qualquer um de seus argumentos for `NULL`.

* `SUBTIME(expr1,expr2)`

`SUBTIME()` retorna *`expr1`* − *`expr2`* expresso como um valor no mesmo formato que *`expr1`*. *`expr1`* é uma expressão de tempo ou data e hora, e *`expr2`* é uma expressão de tempo.

A resolução do tipo de retorno desse tipo de função é realizada da mesma forma que para a função `ADDTIME()`; consulte a descrição dessa função para obter mais informações.

  ```
  mysql> SELECT SUBTIME('2007-12-31 23:59:59.999999','1 1:1:1.000002');
          -> '2007-12-30 22:58:58.999997'
  mysql> SELECT SUBTIME('01:00:00.999999', '02:00:00.999998');
          -> '-00:59:59.999999'
  ```

Essa função retorna `NULL` se *`expr1`* ou *`expr2`* é `NULL`.

* `SYSDATE([fsp])`

Retorna a data e a hora atuais como um valor no formato `'YYYY-MM-DD hh:mm:ss'` ou *`YYYYMMDDhhmmss`*, dependendo se a função é usada em contexto de string ou numérico.

Se o argumento *`fsp`* for fornecido para especificar uma precisão de segundos fracionários de 0 a 6, o valor de retorno inclui uma parte de segundos fracionários dessa quantidade de dígitos.

`SYSDATE()` retorna o momento em que é executado. Isso difere do comportamento de `NOW()`, que retorna um tempo constante que indica o momento em que a declaração começou a ser executada. (Dentro de uma função armazenada ou gatilho, `NOW()` retorna o momento em que a função ou a declaração de gatilho começou a ser executada.)

  ```
  mysql> SELECT NOW(), SLEEP(2), NOW();
  +---------------------+----------+---------------------+
  | NOW()               | SLEEP(2) | NOW()               |
  +---------------------+----------+---------------------+
  | 2006-04-12 13:47:36 |        0 | 2006-04-12 13:47:36 |
  +---------------------+----------+---------------------+

  mysql> SELECT SYSDATE(), SLEEP(2), SYSDATE();
  +---------------------+----------+---------------------+
  | SYSDATE()           | SLEEP(2) | SYSDATE()           |
  +---------------------+----------+---------------------+
  | 2006-04-12 13:47:44 |        0 | 2006-04-12 13:47:46 |
  +---------------------+----------+---------------------+
  ```

Além disso, a declaração `SET TIMESTAMP` afeta o valor retornado por `NOW()`, mas não por `SYSDATE()`. Isso significa que as configurações de marcação de tempo no log binário não têm efeito em invocações de `SYSDATE()`.

Como o `SYSDATE()` pode retornar diferentes valores mesmo dentro da mesma declaração e não é afetado pelo `SET TIMESTAMP`, ele é não determinístico e, portanto, inseguro para replicação se o registro binário baseado em declaração for usado. Se isso for um problema, você pode usar o registro baseado em linha.

Como alternativa, você pode usar a opção `--sysdate-is-now` para fazer com que `SYSDATE()` seja um alias para `NOW()`. Isso funciona se a opção for usada tanto no servidor de origem de replicação quanto na replica.

A natureza não determinística de `SYSDATE()` também significa que os índices não podem ser usados para avaliar expressões que se referem a ele.

* `TIME(expr)`

Extrai a parte de tempo da expressão de data e hora *`expr`* e retorna como uma string. Retorna `NULL` se *`expr`* é `NULL`.

Essa função não é segura para replicação baseada em declarações. Um aviso é registrado se você usar essa função quando `binlog_format` está definido como `STATEMENT`.

  ```
  mysql> SELECT TIME('2003-12-31 01:02:03');
          -> '01:02:03'
  mysql> SELECT TIME('2003-12-31 01:02:03.000123');
          -> '01:02:03.000123'
  ```

* `TIMEDIFF(expr1,expr2)`

`TIMEDIFF()` retorna *`expr1`* − *`expr2`* expresso como um valor de tempo. *`expr1`* e *`expr2`* são cadeias de caracteres que são convertidas em expressões de `TIME` ou `DATETIME`; essas devem ser do mesmo tipo após a conversão. Retorna `NULL` se *`expr1`* ou *`expr2`* é `NULL`.

O resultado retornado por `TIMEDIFF()` está limitado à faixa permitida para os valores de `TIME`. Alternativamente, você pode usar qualquer uma das funções `TIMESTAMPDIFF()` e `UNIX_TIMESTAMP()`, ambas que retornam inteiros.

  ```
  mysql> SELECT TIMEDIFF('2000-01-01 00:00:00',
      ->                 '2000-01-01 00:00:00.000001');
          -> '-00:00:00.000001'
  mysql> SELECT TIMEDIFF('2008-12-31 23:59:59.000001',
      ->                 '2008-12-30 01:01:01.000002');
          -> '46:58:57.999999'
  ```

* `TIMESTAMP(expr)`, `TIMESTAMP(expr1,expr2)`

Com um único argumento, essa função retorna a expressão de data ou datetime *`expr`* como um valor de datetime. Com dois argumentos, ela adiciona a expressão de hora *`expr2`* à expressão de data ou datetime *`expr1`* e retorna o resultado como um valor de datetime. Retorna *`NULL` se *`expr`*, *`expr1`* ou *`expr2`* é *`NULL`*.

  ```
  mysql> SELECT TIMESTAMP('2003-12-31');
          -> '2003-12-31 00:00:00'
  mysql> SELECT TIMESTAMP('2003-12-31 12:00:00','12:00:00');
          -> '2004-01-01 00:00:00'
  ```

* `TIMESTAMPADD(unit,interval,datetime_expr)`

Adicione a expressão inteira *`interval`* à expressão de data ou datetime *`datetime_expr`*. A unidade para *`interval`* é dada pelo argumento *`unit`*, que deve ser um dos seguintes valores: `MICROSECOND` (microssegundos), `SECOND`, `MINUTE`, `HOUR`, `DAY`, `WEEK`, `MONTH`, `QUARTER` ou `YEAR`.

O valor *`unit`* pode ser especificado usando um dos termos conforme mostrado, ou com um prefixo de `SQL_TSI_`. Por exemplo, `DAY` e `SQL_TSI_DAY` são ambos válidos.

Essa função retorna `NULL` se *`interval`* ou *`datetime_expr`* é `NULL`.

  ```
  mysql> SELECT TIMESTAMPADD(MINUTE, 1, '2003-01-02');
          -> '2003-01-02 00:01:00'
  mysql> SELECT TIMESTAMPADD(WEEK,1,'2003-01-02');
          -> '2003-01-09'
  ```

Quando se adiciona um intervalo `MONTH` a um valor `DATE` ou `DATETIME`, e a data resultante inclui um dia que não existe no mês dado, o dia é ajustado para o último dia do mês, conforme mostrado aqui:

  ```
  mysql> SELECT TIMESTAMPADD(MONTH, 1, DATE '2024-03-30') AS t1,
       >        TIMESTAMPADD(MONTH, 1, DATE '2024-03-31') AS t2;
  +------------+------------+
  | t1         | t2         |
  +------------+------------+
  | 2024-04-30 | 2024-04-30 |
  +------------+------------+
  1 row in set (0.00 sec)
  ```

* `TIMESTAMPDIFF(unit,datetime_expr1,datetime_expr2)`

Retorna *`datetime_expr2`* − *`datetime_expr1`*, onde *`datetime_expr1`* e *`datetime_expr2`* são expressões de data ou datetime. Uma expressão pode ser uma data e a outra um datetime; um valor de data é tratado como um datetime com a parte de hora `'00:00:00'` quando necessário. A unidade do resultado (um inteiro) é dada pelo argumento *`unit`*. Os valores legais para *`unit`* são os mesmos listados na descrição da função `TIMESTAMPADD()`.

Essa função retorna `NULL` se *`datetime_expr1`* ou *`datetime_expr2`* é `NULL`.

  ```
  mysql> SELECT TIMESTAMPDIFF(MONTH,'2003-02-01','2003-05-01');
          -> 3
  mysql> SELECT TIMESTAMPDIFF(YEAR,'2002-05-01','2001-01-01');
          -> -1
  mysql> SELECT TIMESTAMPDIFF(MINUTE,'2003-02-01','2003-05-01 12:05:55');
          -> 128885
  ```

Nota

A ordem dos argumentos de data ou datetime para essa função é o oposto daquela usada com a função `TIMESTAMP()` quando invocada com 2 argumentos.

* `TIME_FORMAT(time,format)`

Este é usado como a função `DATE_FORMAT()` , mas a string *`format`* pode conter especificadores de formato apenas para horas, minutos, segundos e microsegundos. Outros especificadores produzem um `NULL` ou `0`. `TIME_FORMAT()` retorna `NULL` se *`time`* ou *`format`* é `NULL`.

Se o valor *`time`* contiver uma parte horária maior que `23`, os especificadores de formato de hora `%H` e `%k` produzem um valor maior que o intervalo usual de `0..23`. Os outros especificadores de formato de hora produzem o valor da hora modulo 12.

  ```
  mysql> SELECT TIME_FORMAT('100:00:00', '%H %k %h %I %l');
          -> '100 100 04 04 4'
  ```

* `TIME_TO_SEC(time)`

Retorna o argumento *`time`*, convertido em segundos. Retorna `NULL` se *`time`* é `NULL`.

  ```
  mysql> SELECT TIME_TO_SEC('22:23:00');
          -> 80580
  mysql> SELECT TIME_TO_SEC('00:39:38');
          -> 2378
  ```

* `TO_DAYS(date)`

Dado uma data *`date`*, retorna um número de dia (o número de dias desde o ano 0). Retorna `NULL` se *`date`* é `NULL`.

  ```
  mysql> SELECT TO_DAYS(950501);
          -> 728779
  mysql> SELECT TO_DAYS('2007-10-07');
          -> 733321
  ```

`TO_DAYS()` não é destinado para uso com valores que precedem o advento do calendário gregoriano (1582), porque ele não leva em conta os dias que foram perdidos quando o calendário foi alterado. Para datas anteriores a 1582 (e possivelmente um ano posterior em outros locais), os resultados desta função não são confiáveis. Consulte a Seção 13.2.7, “Que calendário é usado pelo MySQL?”, para detalhes.

Lembre-se de que o MySQL converte valores de ano de duas casas decimais em datas para formato de quatro casas decimais usando as regras da Seção 13.2, “Tipos de dados de data e hora”. Por exemplo, `'2008-10-07'` e `'08-10-07'` são vistos como datas idênticas:

  ```
  mysql> SELECT TO_DAYS('2008-10-07'), TO_DAYS('08-10-07');
          -> 733687, 733687
  ```

Em MySQL, a data zero é definida como `'0000-00-00'`, embora essa data seja considerada inválida. Isso significa que, para `'0000-00-00'` e `'0000-01-01'`, `TO_DAYS()` retorna os valores mostrados aqui:

  ```
  mysql> SELECT TO_DAYS('0000-00-00');
  +-----------------------+
  | to_days('0000-00-00') |
  +-----------------------+
  |                  NULL |
  +-----------------------+
  1 row in set, 1 warning (0.00 sec)

  mysql> SHOW WARNINGS;
  +---------+------+----------------------------------------+
  | Level   | Code | Message                                |
  +---------+------+----------------------------------------+
  | Warning | 1292 | Incorrect datetime value: '0000-00-00' |
  +---------+------+----------------------------------------+
  1 row in set (0.00 sec)


  mysql> SELECT TO_DAYS('0000-01-01');
  +-----------------------+
  | to_days('0000-01-01') |
  +-----------------------+
  |                     1 |
  +-----------------------+
  1 row in set (0.00 sec)
  ```

Isso é verdade, independentemente de o modo do servidor SQL `ALLOW_INVALID_DATES` estar habilitado ou

* `TO_SECONDS(expr)`

Dado uma data ou datetime *`expr`*, retorna o número de segundos desde o ano 0. Se *`expr`* não for um valor de data ou datetime válido (incluindo `NULL`,) ele retorna `NULL`.

  ```
  mysql> SELECT TO_SECONDS(950501);
          -> 62966505600
  mysql> SELECT TO_SECONDS('2009-11-29');
          -> 63426672000
  mysql> SELECT TO_SECONDS('2009-11-29 13:43:32');
          -> 63426721412
  mysql> SELECT TO_SECONDS( NOW() );
          -> 63426721458
  ```

Assim como `TO_DAYS()`, `TO_SECONDS()` não é destinado para uso com valores que precedem o advento do calendário gregoriano (1582), porque ele não leva em conta os dias que foram perdidos quando o calendário foi alterado. Para datas anteriores a 1582 (e possivelmente um ano posterior em outros locais), os resultados desta função não são confiáveis. Consulte a Seção 13.2.7, “Que calendário é usado pelo MySQL?”, para detalhes.

Assim como `TO_DAYS()`, `TO_SECONDS()`, converte valores de ano de duas dígitos em datas para formato de quatro dígitos usando as regras na Seção 13.2, “Tipos de dados de data e hora”.

Em MySQL, a data zero é definida como `'0000-00-00'`, embora essa data seja considerada inválida. Isso significa que, para `'0000-00-00'` e `'0000-01-01'`, `TO_SECONDS()` retorna os valores mostrados aqui:

  ```
  mysql> SELECT TO_SECONDS('0000-00-00');
  +--------------------------+
  | TO_SECONDS('0000-00-00') |
  +--------------------------+
  |                     NULL |
  +--------------------------+
  1 row in set, 1 warning (0.00 sec)

  mysql> SHOW WARNINGS;
  +---------+------+----------------------------------------+
  | Level   | Code | Message                                |
  +---------+------+----------------------------------------+
  | Warning | 1292 | Incorrect datetime value: '0000-00-00' |
  +---------+------+----------------------------------------+
  1 row in set (0.00 sec)


  mysql> SELECT TO_SECONDS('0000-01-01');
  +--------------------------+
  | TO_SECONDS('0000-01-01') |
  +--------------------------+
  |                    86400 |
  +--------------------------+
  1 row in set (0.00 sec)
  ```

Isso é verdade, independentemente de o modo do servidor SQL `ALLOW_INVALID_DATES` estar habilitado ou

* `UNIX_TIMESTAMP([date])`

Se `UNIX_TIMESTAMP()` for chamado sem o argumento *`date`*, ele retorna um timestamp Unix que representa segundos desde `'1970-01-01 00:00:00'` UTC.

Se `UNIX_TIMESTAMP()` for chamado com um argumento *`date`*, ele retorna o valor do argumento em segundos desde `'1970-01-01 00:00:00'` UTC. O servidor interpreta *`date`* como um valor no fuso horário da sessão e o converte em um valor de timestamp interno em UTC. (Os clientes podem definir o fuso horário da sessão conforme descrito na Seção 7.1.15, “Suporte ao Fuso Horário do MySQL Server.”) O argumento *`date`* pode ser uma cadeia de caracteres `DATE`, `DATETIME`, ou `TIMESTAMP` ou um número no formato de *`YYMMDD`*, *`YYMMDDhhmmss`*, *`YYYYMMDD`*, ou *`YYYYMMDDhhmmss`*. Se o argumento incluir uma parte de tempo, ele pode opcionalmente incluir uma parte de segundos fracionários.

O valor de retorno é um inteiro se nenhum argumento for fornecido ou o argumento não incluir uma parte de segundos fracionários, ou `DECIMAL` - DECIMAL, NUMERIC") se um argumento for fornecido que inclua uma parte de segundos fracionários.

Quando o argumento *`date`* é uma coluna `TIMESTAMP`, `UNIX_TIMESTAMP()` retorna o valor do timestamp interno diretamente, sem conversão implícita de “string para timestamp Unix”.

Antes do MySQL 8.0.28, a faixa válida de valores de argumento é a mesma que para o tipo de dados `TIMESTAMP`: UTC de `'1970-01-01 00:00:01.000000'` a UTC de `'2038-01-19 03:14:07.999999'`. Este é também o caso no MySQL 8.0.28 e posterior para plataformas de 32 bits. Para o MySQL 8.0.28 e posterior que funciona em plataformas de 64 bits, a faixa válida de valores de argumento para `UNIX_TIMESTAMP()` é de UTC de `'1970-01-01 00:00:01.000000'` a UTC de `'3001-01-19 03:14:07.999999'` (correspondente a 32536771199,999999 segundos).

Independentemente da versão do MySQL ou da arquitetura da plataforma, se você passar uma data fora do intervalo para `UNIX_TIMESTAMP()`, ele retornará `0`. Se *`date`* é `NULL`, ele retornará `NULL`.

  ```
  mysql> SELECT UNIX_TIMESTAMP();
          -> 1447431666
  mysql> SELECT UNIX_TIMESTAMP('2015-11-13 10:20:19');
          -> 1447431619
  mysql> SELECT UNIX_TIMESTAMP('2015-11-13 10:20:19.012');
          -> 1447431619.012
  ```

Se você usar `UNIX_TIMESTAMP()` e `FROM_UNIXTIME()` para converter entre valores em um fuso horário não UTC e valores de timestamp Unix, a conversão é perda de dados, porque a mapeo não é um para um em ambas as direções. Por exemplo, devido a convenções para mudanças de fuso horário local, como o Horário de Verão (DST), é possível que `UNIX_TIMESTAMP()` mapeie dois valores que são distintos em um fuso horário não UTC para o mesmo valor de timestamp Unix. `FROM_UNIXTIME()` mapeia esse valor de volta apenas para um dos valores originais. Aqui está um exemplo, usando valores que são distintos no fuso horário `MET`:

  ```
  mysql> SET time_zone = 'MET';
  mysql> SELECT UNIX_TIMESTAMP('2005-03-27 03:00:00');
  +---------------------------------------+
  | UNIX_TIMESTAMP('2005-03-27 03:00:00') |
  +---------------------------------------+
  |                            1111885200 |
  +---------------------------------------+
  mysql> SELECT UNIX_TIMESTAMP('2005-03-27 02:00:00');
  +---------------------------------------+
  | UNIX_TIMESTAMP('2005-03-27 02:00:00') |
  +---------------------------------------+
  |                            1111885200 |
  +---------------------------------------+
  mysql> SELECT FROM_UNIXTIME(1111885200);
  +---------------------------+
  | FROM_UNIXTIME(1111885200) |
  +---------------------------+
  | 2005-03-27 03:00:00       |
  +---------------------------+
  ```

Nota

Para usar fusos horários nomeados, como `'MET'` ou `'Europe/Amsterdam'`, as tabelas de fuso horário devem ser configuradas corretamente. Para obter instruções, consulte a Seção 7.1.15, “Suporte de Fuso Horário do MySQL Server”.

Se você quiser subtrair as colunas `UNIX_TIMESTAMP()`, talvez queira convertê-las em inteiros assinados. Veja a Seção 14.10, “Funções e Operadores de Conversão”.

* `UTC_DATE`, `UTC_DATE()`

Retorna a data atual UTC como um valor no formato `'YYYY-MM-DD'` ou *`YYYYMMDD`*, dependendo se a função é usada em contexto de string ou numérico.

  ```
  mysql> SELECT UTC_DATE(), UTC_DATE() + 0;
          -> '2003-08-14', 20030814
  ```

* `UTC_TIME`, `UTC_TIME([fsp])`

Retorna o horário UTC atual como um valor no formato *`'hh:mm:ss'`* ou *`hhmmss`*, dependendo se a função é usada em contexto de string ou numérico.

Se o argumento *`fsp`* for fornecido para especificar uma precisão de segundos fracionários de 0 a 6, o valor de retorno inclui uma parte de segundos fracionários dessa quantidade de dígitos.

  ```
  mysql> SELECT UTC_TIME(), UTC_TIME() + 0;
          -> '18:07:53', 180753.000000
  ```

* `UTC_TIMESTAMP`, `UTC_TIMESTAMP([fsp])`

Retorna a data e a hora atuais do UTC como um valor no formato `'YYYY-MM-DD hh:mm:ss'` ou *`YYYYMMDDhhmmss`*, dependendo se a função é usada em contexto de string ou numérico.

Se o argumento *`fsp`* for fornecido para especificar uma precisão de segundos fracionários de 0 a 6, o valor de retorno inclui uma parte de segundos fracionários dessa quantidade de dígitos.

  ```
  mysql> SELECT UTC_TIMESTAMP(), UTC_TIMESTAMP() + 0;
          -> '2003-08-14 18:08:04', 20030814180804.000000
  ```

* `WEEK(date[,mode])`

Esta função retorna o número da semana para *`date`*. A forma de dois argumentos de `WEEK()` permite que você especifique se a semana começa no domingo ou no domingo e se o valor de retorno deve estar na faixa de `0` a `53` ou de `1` a `53`. Se o argumento *`mode`* for omitido, o valor da variável do sistema `default_week_format` é usado. Veja a Seção 7.1.8, “Variáveis do Sistema do Servidor”. Para um valor de data de `NULL`, a função retorna `NULL`.

A tabela a seguir descreve como o argumento *`mode`* funciona.

  <table summary="Now the mode argument of the WEEK function works. For each mode value, the table lists the first day of the week, the range, and a description of week 1."><col style="width: 10%"/><col style="width: 20%"/><col style="width: 20%"/><col style="width: 50%"/><thead><tr> <th scope="col">Modo</th> <th scope="col">Primeiro dia da semana</th> <th scope="col">Gama</th> <th scope="col">A primeira semana é a primeira semana...</th> </tr></thead><tbody><tr> <th scope="row">0</th> <td>Sunday</td> <td>0-53</td> <td>with a Sunday in this year</td> </tr><tr> <th scope="row">1</th> <td>Monday</td> <td>0-53</td> <td>with 4 or more days this year</td> </tr><tr> <th scope="row">2</th> <td>Sunday</td> <td>1-53</td> <td>with a Sunday in this year</td> </tr><tr> <th scope="row">3</th> <td>Monday</td> <td>1-53</td> <td>with 4 or more days this year</td> </tr><tr> <th scope="row">4</th> <td>Sunday</td> <td>0-53</td> <td>with 4 or more days this year</td> </tr><tr> <th scope="row">5</th> <td>Monday</td> <td>0-53</td> <td>with a Monday in this year</td> </tr><tr> <th scope="row">6</th> <td>Sunday</td> <td>1-53</td> <td>with 4 or more days this year</td> </tr><tr> <th scope="row">7</th> <td>Monday</td> <td>1-53</td> <td>with a Monday in this year</td> </tr></tbody></table>

Para os valores de *`mode`* com significado de “com 4 ou mais dias neste ano”, as semanas são numeradas de acordo com a ISO 8601:1988:

+ Se a semana que contém o dia 1 de janeiro tiver 4 ou mais dias no novo ano, é a semana 1.

+ Caso contrário, é a última semana do ano anterior, e a próxima semana é a semana 1.

  ```
  mysql> SELECT WEEK('2008-02-20');
          -> 7
  mysql> SELECT WEEK('2008-02-20',0);
          -> 7
  mysql> SELECT WEEK('2008-02-20',1);
          -> 8
  mysql> SELECT WEEK('2008-12-31',1);
          -> 53
  ```

Se uma data cair na última semana do ano anterior, o MySQL retorna `0` se você não usar `2`, `3`, `6` ou `7` como o argumento opcional *`mode`*:

  ```
  mysql> SELECT YEAR('2000-01-01'), WEEK('2000-01-01',0);
          -> 2000, 0
  ```

Pode-se argumentar que `WEEK()` deve retornar `52`, porque a data dada ocorre na verdade na 52ª semana de 1999. `WEEK()` retorna `0` em vez disso, para que o valor de retorno seja “o número de semana no ano dado”. Isso torna a função `WEEK()` confiável quando combinada com outras funções que extraem uma parte de uma data.

Se você prefere um resultado avaliado em relação ao ano que contém o primeiro dia da semana para a data dada, use `0`, `2`, `5` ou `7` como o argumento opcional *`mode`*.

  ```
  mysql> SELECT WEEK('2000-01-01',2);
          -> 52
  ```

Alternativamente, use a função `YEARWEEK()`:

  ```
  mysql> SELECT YEARWEEK('2000-01-01');
          -> 199952
  mysql> SELECT MID(YEARWEEK('2000-01-01'),5,2);
          -> '52'
  ```

* `WEEKDAY(date)`

Retorna o índice do dia da semana para *`date`* (`0` = Segunda-feira, `1` = Terça-feira, … `6` = Domingo). Retorna `NULL` se *`date`* é `NULL`.

  ```
  mysql> SELECT WEEKDAY('2008-02-03 22:23:00');
          -> 6
  mysql> SELECT WEEKDAY('2007-11-06');
          -> 1
  ```

* `WEEKOFYEAR(date)`

Retorna a semana do calendário da data como um número no intervalo de `1` a `53`. Retorna `NULL` se *`date`* é `NULL`.

`WEEKOFYEAR()` é uma função de compatibilidade que é equivalente a `WEEK(date,3)`.

  ```
  mysql> SELECT WEEKOFYEAR('2008-02-20');
          -> 8
  ```

* `YEAR(date)`

Retorna o ano para *`date`*, na faixa de `1000` a `9999`, ou `0` para a data “zero”. Retorna `NULL` se *`date`* é `NULL`.

  ```
  mysql> SELECT YEAR('1987-01-01');
          -> 1987
  ```

* `YEARWEEK(date)`, `YEARWEEK(date,mode)`

Retorna o ano e a semana para uma data. O ano no resultado pode ser diferente do ano no argumento de data para a primeira e a última semana do ano. Retorna `NULL` se *`date`* é `NULL`.

O argumento *`mode`* funciona exatamente como o argumento *`mode`* para `WEEK()`. Para a sintaxe de um argumento, um valor de *`mode`* de 0 é usado. Ao contrário de `WEEK()`, o valor de `default_week_format` não influencia `YEARWEEK()`.

  ```
  mysql> SELECT YEARWEEK('1987-01-01');
          -> 198652
  ```

O número da semana é diferente do que a função `WEEK()` retornaria (`0`) para os argumentos opcionais `0` ou `1`, pois `WEEK()` então retorna a semana no contexto do ano dado.