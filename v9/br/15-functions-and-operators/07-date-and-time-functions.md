## 14.7 Funções de Data e Hora

Esta seção descreve as funções que podem ser usadas para manipular valores temporais. Consulte a Seção 13.2, “Tipos de Dados de Data e Hora”, para uma descrição da faixa de valores que cada tipo de data e hora tem e dos formatos válidos nos quais os valores podem ser especificados.

**Tabela 14.11 Funções de Data e Hora**

<table frame="box" rules="all" summary="Uma referência que lista funções de data e hora.">
<tr><th>Nome</th> <th>Descrição</th> </tr>
<tr><td><code>ADDDATE()</code></td> <td> Adicione valores de tempo (intervalos) a um valor de data </td> </tr>
<tr><td><code>ADDTIME()</code></td> <td> Adicione tempo </td> </tr>
<tr><td><code>CONVERT_TZ()</code></td> <td> Converta de um fuso horário para outro </td> </tr>
<tr><td><code>CURDATE()</code></td> <td> Retorne a data atual </td> </tr>
<tr><td><code>CURRENT_DATE()</code>, <code>CURRENT_DATE</code></td> <td> Sinônimos para CURDATE() </td> </tr>
<tr><td><code>CURRENT_TIME()</code>, <code>CURRENT_TIME</code></td> <td> Sinônimos para CURDATE() </td> </tr>
<tr><td><code>CURRENT_TIMESTAMP()</code>, <code>CURRENT_TIMESTAMP</code></td> <td> Sinônimos para NOW() </td> </tr>
<tr><td><code>CURTIME()</code></td> <td> Retorne a hora atual </td> </tr>
<tr><td><code>DATE()</code></td> <td> Extraia a parte de data de uma expressão de data ou datetime </td> </tr>
<tr><td><code>DATE_ADD()</code></td> <td> Adicione valores de tempo (intervalos) a um valor de data </td> </tr>
<tr><td><code>DATE_FORMAT()</code></td> <td> Formatar a data como especificado </td> </tr>
<tr><td><code>DATE_SUB()</code></td> <td> Subtraia um valor de tempo (intervalo) de um valor de data </td> </tr>
<tr><td><code>DATEDIFF()</code></td> <td> Subtraia duas datas </td> </tr>
<tr><td><code>DAY()</code></td> <td> Símbolo para DAYOFMONTH() </td> </tr>
<tr><td><code>DAYNAME()</code></td> <td> Retorne o nome do dia da semana </td> </tr>
<tr><td><code>DAYOFMONTH()</code></td> <td> Retorne o dia do mês (0-31) </td> </tr>
<tr><td><code>DAYOFWEEK()</code></td> <td> Retorne o índice do dia da semana do argumento </td> </tr>
<tr><td><a class="link" href="date-and-time-functions.html#function_dayofyear"><

Aqui está um exemplo que usa funções de data. A consulta a seguir seleciona todas as linhas com um valor de `date_col` dentro dos últimos 30 dias:

```
mysql> SELECT something FROM tbl_name
    -> WHERE DATE_SUB(CURDATE(),INTERVAL 30 DAY) <= date_col;
```

A consulta também seleciona linhas com datas que estão no futuro.

Funções que esperam valores de data geralmente aceitam valores datetime e ignoram a parte de hora. Funções que esperam valores de hora geralmente aceitam valores datetime e ignoram a parte de data.

Funções que retornam a data ou hora atuais são avaliadas apenas uma vez por consulta no início da execução da consulta. Isso significa que múltiplas referências a uma função, como `NOW()` dentro de uma única consulta, sempre produzem o mesmo resultado. (Para nossos propósitos, uma única consulta também inclui uma chamada a um programa armazenado (rotina armazenada, gatilho ou evento) e todos os subprogramas chamados por esse programa.) Esse princípio também se aplica a `CURDATE()`, `CURTIME()`, `UTC_DATE()`, `UTC_TIME()`, `UTC_TIMESTAMP()` e a qualquer um de seus sinônimos.

As funções `CURRENT_TIMESTAMP()`, `CURRENT_TIME()`, `CURRENT_DATE()` e `FROM_UNIXTIME()` retornam valores no fuso horário de sessão atual, que está disponível como o valor de sessão da variável de sistema `time_zone`. Além disso, `UNIX_TIMESTAMP()` assume que seu argumento é um valor datetime no fuso horário de sessão. Veja a Seção 7.1.15, “Suporte ao Fuso Horário do MySQL Server”.

Algumas funções de data podem ser usadas com datas “zero” ou datas incompletas, como `'2001-11-00'`, enquanto outras não podem. Funções que extraem partes de datas geralmente trabalham com datas incompletas e, portanto, podem retornar 0 quando você poderia esperar um valor não nulo. Por exemplo:

```
mysql> SELECT DAYOFMONTH('2001-11-00'), MONTH('2005-00-00');
        -> 0, 0
```

Outras funções esperam datas completas e retornam `NULL` para datas incompletas. Essas incluem funções que realizam cálculos de data ou que mapeiam partes de datas para nomes. Por exemplo:

```
mysql> SELECT DATE_ADD('2006-05-00',INTERVAL 1 DAY);
        -> NULL
mysql> SELECT DAYNAME('2006-05-00');
        -> NULL
```

Várias funções são estritas quando passam um valor da função `DATE()` como argumento e rejeitam datas incompletas com uma parte do dia de zero: `CONVERT_TZ()`, `DATE_ADD()`, `DATE_SUB()`, `DAYOFYEAR()`, `TIMESTAMPDIFF()`, `TO_DAYS()`, `TO_SECONDS()`, `WEEK()`, `WEEKDAY()`, `WEEKOFYEAR()`, `YEARWEEK()`.

Segundos fracionários para valores de `TIME`, `DATETIME` e `TIMESTAMP` são suportados, com precisão de até microsegundos. Funções que aceitam argumentos temporais aceitam valores com segundos fracionários. Os valores de retorno das funções temporais incluem segundos fracionários conforme apropriado.

* `ADDDATE(date,INTERVAL expr unit)`, `ADDDATE(date,days)`

  Quando invocado com a forma `INTERVAL` do segundo argumento, `ADDDATE()` é um sinônimo de `DATE_ADD()`. A função relacionada `SUBDATE()` é um sinônimo de `DATE_SUB()`. Para informações sobre o argumento `INTERVAL *``unit`*, consulte Intervalos Temporais.

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

  Esta função retorna `NULL` se *`date`* ou *`days`* for `NULL`.

* `ADDTIME(expr1,expr2)`

  `ADDTIME()` adiciona *`expr2`* a *`expr1`* e retorna o resultado. *`expr1`* é uma expressão de tempo ou `DATETIME` e *`expr2`* é uma expressão de tempo. Retorna `NULL` se *`expr1`* ou *`expr2`* for `NULL`.

  O tipo de retorno desta função e da função `SUBTIME()` é determinado da seguinte forma:

  + Se o primeiro argumento for um parâmetro dinâmico (como em uma instrução preparada), o tipo de retorno é `TIME`.

  + Caso contrário, o tipo resolvido da função é derivado do tipo resolvido do primeiro argumento.

  ```
  mysql> SELECT ADDTIME('2007-12-31 23:59:59.999999', '1 1:1:1.000002');
          -> '2008-01-02 01:01:01.000001'
  mysql> SELECT ADDTIME('01:00:00.999999', '02:00:00.999998');
          -> '03:00:01.999997'
  ```

* `CONVERT_TZ(dt,from_tz,to_tz)`

`CONVERT_TZ()` converte um valor de data e hora *`dt`* do fuso horário especificado por *`from_tz`* para o fuso horário especificado por *`to_tz`* e retorna o valor resultante. Os fusos horários são especificados conforme descrito na Seção 7.1.15, “Suporte de Fuso Horário do MySQL Server”. Esta função retorna `NULL` se qualquer um dos argumentos for inválido ou se algum deles for `NULL`.

Em plataformas de 32 bits, o intervalo de valores suportado por esta função é o mesmo que para o tipo `TIMESTAMP` (consulte a Seção 13.2.1, “Sintaxe do Tipo de Dados de Data e Hora”, para informações sobre o intervalo). Em plataformas de 64 bits, o valor máximo suportado é `'3001-01-18 23:59:59.999999'` UTC.

Independentemente da plataforma ou da versão do MySQL, se o valor sair do intervalo suportado durante a conversão de *`from_tz`* para UTC, nenhuma conversão ocorrerá.

```
  mysql> SELECT CONVERT_TZ('2004-01-01 12:00:00','GMT','MET');
          -> '2004-01-01 13:00:00'
  mysql> SELECT CONVERT_TZ('2004-01-01 12:00:00','+00:00','+10:00');
          -> '2004-01-01 22:00:00'
  ```

Nota

Para usar fusos horários nomeados, como `'MET'` ou `'Europe/Amsterdam'`, as tabelas de fuso horário devem estar corretamente configuradas. Para instruções, consulte a Seção 7.1.15, “Suporte de Fuso Horário do MySQL Server”.

* `CURDATE()`

Retorna a data atual como um valor no formato *`YYYY-MM-DD`* ou *`YYYYMMDD`*, dependendo se a função é usada em contexto de string ou numérico.

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

  Extrai a parte de data da expressão de data ou datetime *`expr`*. Retorna `NULL` se *`expr`* for `NULL`.

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

  Esta função retorna `NULL` se *`expr1`* ou *`expr2`* for `NULL`.

* `DATE_ADD(date,INTERVAL expr unit)`, `DATE_SUB(date,INTERVAL expr unit)`

  Estas funções realizam cálculos de data. O argumento *`date`* especifica o valor de data ou datetime inicial. *`expr`* é uma expressão que especifica o valor do intervalo a ser adicionado ou subtraído da data inicial. *`expr`* é avaliado como uma string; pode começar com um `-` para intervalos negativos. *`unit`* é uma palavra-chave que indica as unidades nas quais a expressão deve ser interpretada.

  Para mais informações sobre a sintaxe de intervalos temporais, incluindo uma lista completa dos especificadores de *`unit`*, a forma esperada do argumento *`expr`* para cada valor de *`unit`* e as regras para interpretação dos operandos em aritmética temporal, consulte Intervalos Temporais.

  O valor de retorno depende dos argumentos:

  + Se *`date`* for `NULL`, a função retorna `NULL`.

  + `DATE` se o argumento *`date`* for um valor `DATE` e seus cálculos envolvam apenas as partes `YEAR`, `MONTH` e `DAY` (ou seja, sem partes de hora).

+ `TIME` se o argumento *`data`* for um valor `TIME` e os cálculos envolverem apenas as partes `HORAS`, `MINUTOS` e `SEGundos` (ou seja, sem partes de data).

+ `DATETIME` se o primeiro argumento for um valor `DATETIME` (ou `TIMESTAMP`) ou se o primeiro argumento for um `DATE` e o valor do *`unidade`* usar `HORAS`, `MINUTOS` ou `SEGundos`, ou se o primeiro argumento for do tipo `TIME` e o valor do *`unidade` usar `ANO`, `MÊS` ou `DIA`.

+ Se o primeiro argumento for um parâmetro dinâmico (por exemplo, de uma instrução preparada), seu tipo resolvido é `DATE` se o segundo argumento for um intervalo que contenha apenas combinações de valores `ANO`, `MÊS` ou `DIA`; caso contrário, seu tipo é `DATETIME`.

+ String caso contrário (tipo `VARCHAR`).

Para garantir que o resultado seja `DATETIME`, você pode usar `CAST()` para converter o primeiro argumento para `DATETIME`.

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

Quando você adiciona um intervalo `MONTH` a um valor `DATE` ou `DATETIME`, e a data resultante inclui um dia que não existe no mês dado, o dia é ajustado para o último dia do mês, como mostrado aqui:

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

* `DATE_FORMAT(data, format)`

Formata o valor de *`data`* de acordo com a string *`format`*. Se qualquer um dos argumentos for `NULL`, a função retorna `NULL`.

Os especificadores mostrados na tabela a seguir podem ser usados na string *`format`*. O caractere `%` é necessário antes dos caracteres dos especificadores de formato. Os especificadores se aplicam também a outras funções: `STR_TO_DATE()`, `TIME_FORMAT()`, `UNIX_TIMESTAMP()`.

<table summary="Caracteres especificadores para a função DATE_FORMAT que podem ser usados na string de formato e fornece uma descrição de cada caractere especificador."><col style="width: 20%"/><col style="width: 70%"/><thead><tr> <th>Especificador</th> <th>Descrição</th> </tr></thead><tbody><tr> <td><code>%a</code></td> <td>Nome do dia da semana abreviado (<code>Sun</code>..<code>Sat</code>)</td> </tr><tr> <td><code>%b</code></td> <td>Nome do mês abreviado (<code>Jan</code>..<code>Dec</code>)</td> </tr><tr> <td><code>%c</code></td> <td>Mês, numérico (<code>0</code>..<code>12</code>)</td> </tr><tr> <td><code>%D</code></td> <td>Dia do mês com sufixo em inglês (<code>0th</code>, <code>1st</code>, <code>2nd</code>, <code>3rd</code>, …)</td> </tr><tr> <td><code>%d</code></td> <td>Dia do mês, numérico (<code>00</code>..<code>31</code>)</td> </tr><tr> <td><code>%e</code></td> <td>Dia do mês, numérico (<code>0</code>..<code>31</code>)</td> </tr><tr> <td><code>%f</code></td> <td>Microsegundos (<code>000000</code>..<code>999999</code>)</td> </tr><tr> <td><code>%H</code></td> <td>Hora (<code>00</code>..<code>23</code>)</td> </tr><tr> <td><code>%h</code></td> <td>Hora (<code>01</code>..<code>12</code>)</td> </tr><tr> <td><code>%I</code></td> <td>Hora (<code>01</code>..<code>12</code>)</td> </tr><tr> <td><code>%i</code></td> <td>Minutos, numérico (<code>00</code>..<code>59</code>)</td> </tr><tr> <td><code>%j</code></td> <td>Dia do ano (<code>001</code>..<code>366</code>)</td> </tr><tr> <td><code>%k</code></td> <td>Hora (<code>0</code>..<code>23</code>)</td> </tr><tr> <td><code>%l</code></td> <td>Hora (<code>1</code>..<code>12</code>)</td> </tr><tr> <td><code>%M</code></td> <td>Nome do mês (<code>January</code>..<code>December</code>)</td> </tr><tr> <td><code>%m</code></td> <td>Mês, numérico (<code>00</code>..<code>12</code>)</td> </tr><tr> <td><code>%p</code></td> <td><code>AM</code> ou <code>PM</code></td> </tr><tr> <td><code>%r</code></td> <td>Tempo, 12 horas (<em class="replaceable"><code>hh:mm:ss</code></em> seguido de <code>AM</code> ou <code>PM</code>)</td> </tr><tr> <td><code>%S</code></td> <td>Segundos (<code>00</code>..<code>59</code>)</td> </tr><tr> <td><code>%s</code></td> <td>Segundos (<code>00</code>..<code>59</code>)</td> </tr><tr> <td><code>%T</code></td> <td>Tempo, 24 horas (<em class="replaceable"><code>hh:mm:ss</code></em>)</td> </tr><tr> <td><code>%U</code></td> <td>Semana (<code>00</code>..<code>53</code>), onde domingo é o primeiro dia da semana; <a class="link" href="date-and-time-functions.html#function_week"><code class

Os intervalos para os especificadores de mês e dia começam com zero devido ao fato de que o MySQL permite o armazenamento de datas incompletas, como `'2014-00-00'`.

A linguagem usada para os nomes e abreviações de dia e mês é controlada pelo valor da variável de sistema `lc_time_names` (Seção 12.16, “Suporte de Localização do Servidor MySQL”).

Para os especificadores `%U`, `%u`, `%V` e `%v`, consulte a descrição da função `WEEK()` para obter informações sobre os valores de modo. O modo afeta como a numeração da semana ocorre.

`DATE_FORMAT()` retorna uma string com um conjunto de caracteres e uma collation definidos por `character_set_connection` e `collation_connection` para que possa retornar nomes de mês e dia úteis contendo caracteres não ASCII.

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

* `DATE_SUB(date,INTERVAL expr unit)`

  Consulte a descrição da função `DATE_ADD()`.

* `DAY(date)`

  `DAY()` é um sinônimo de `DAYOFMONTH()`.

* `DAYNAME(date)`

  Retorna o nome do dia útil para *`date`*. A linguagem usada para o nome é controlada pelo valor da variável de sistema `lc_time_names` (consulte a Seção 12.16, “Suporte de Localização do Servidor MySQL”). Retorna `NULL` se *`date`* for `NULL`.

  ```
  mysql> SELECT DAYNAME('2007-02-03');
          -> 'Saturday'
  ```

* `DAYOFMONTH(date)`

  Retorna o dia do mês para *`date`*, no intervalo de `1` a `31`, ou `0` para datas como `'0000-00-00'` ou `'2008-00-00'` que têm uma parte de dia zero. Retorna `NULL` se *`date`* for `NULL`.

  ```
  mysql> SELECT DAYOFMONTH('2007-02-03');
          -> 3
  ```

* `DAYOFWEEK(date)`

  Retorna o índice do dia útil para *`date`* (`1` = Domingo, `2` = Segunda-feira, …, `7` = Sábado). Esses valores de índice correspondem ao padrão ODBC. Retorna `NULL` se *`date`* for `NULL`.

  ```
  mysql> SELECT DAYOFWEEK('2007-02-03');
          -> 7
  ```

* `DAYOFYEAR(date)`

  Retorna o dia do ano para *`date`*, no intervalo de `1` a `366`. Retorna `NULL` se *`date`* for `NULL`.

  ```
  mysql> SELECT DAYOFYEAR('2007-02-03');
          -> 34
  ```

* `EXTRACT(unit FROM date)`


A função `EXTRACT()` usa os mesmos tipos de especificadores de *`unidade`* que `DATE_ADD()` ou `DATE_SUB()`, mas extrai partes da data em vez de realizar operações aritméticas com datas. Para informações sobre o argumento *`unidade`*, consulte Intervalos Temporais. Retorna `NULL` se *`data`* for `NULL`.

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

  Dado um número de dia *`N`*, retorna um valor `DATE`. Retorna `NULL` se *`N`* for `NULL`.

  ```
  mysql> SELECT FROM_DAYS(730669);
          -> '2000-07-03'
  ```

  Use `FROM_DAYS()` com cautela em datas antigas. Não é destinado para uso com valores anteriores à adoção do calendário gregoriano (1582). Consulte a Seção 13.2.7, “Qual Calendário é Usado pelo MySQL?”.

* `FROM_UNIXTIME(unix_timestamp[,format])`

  Retorna uma representação de *`unix_timestamp`* como um valor `DATETIME` ou string de caracteres. O valor retornado é expresso usando a zona horária da sessão. (Os clientes podem definir a zona horária do servidor MySQL conforme descrito na Seção 7.1.15, “Suporte à Zona Horária do Servidor MySQL”.) *`unix_timestamp`* é um valor de timestamp interno que representa segundos desde `'1970-01-01 00:00:00'` UTC, como produzido pela função `UNIX_TIMESTAMP()`.

  Se *`format`* for omitido, esta função retorna um valor `DATETIME`.

  Se *`unix_timestamp`* ou *`format`* for `NULL`, esta função retorna `NULL`.

  Se *`unix_timestamp`* for um inteiro, a precisão de frações de segundo do `DATETIME` é zero. Quando *`unix_timestamp`* é um valor decimal, a precisão de frações de segundo do `DATETIME` é a mesma da precisão do valor decimal, até um máximo de 6. Quando *`unix_timestamp`* é um número de ponto flutuante, a precisão de frações de segundo do `DATETIME` é 6.

Em plataformas de 32 bits, o valor máximo útil para *`unix_timestamp`* é 2147483647.999999, que retorna `'2038-01-19 03:14:07.999999'` UTC. Em plataformas de 64 bits, o valor máximo efetivo é 32536771199.999999, que retorna `'3001-01-18 23:59:59.999999'` UTC. Independentemente da plataforma ou versão, um valor maior para *`unix_timestamp`* do que o máximo efetivo retorna `0`.

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

Se você usar `UNIX_TIMESTAMP()` e `FROM_UNIXTIME()` para converter entre valores em uma zona horária não UTC e valores de timestamp Unix, a conversão é perda de dados porque a correspondência não é um para um em ambas as direções. Para detalhes, consulte a descrição da função `UNIX_TIMESTAMP()`.

* `GET_FORMAT({DATE|TIME|DATETIME}, {'EUR'|'USA'|'JIS'|'ISO'|'INTERNAL'})`

Retorna uma string de formato. Esta função é útil em combinação com as funções `DATE_FORMAT()` e `STR_TO_DATE()`.

Se *`format`* for `NULL`, esta função retorna `NULL`.

Os valores possíveis para os primeiros e segundos argumentos resultam em várias strings de formato possíveis (para os especificadores usados, consulte a tabela na descrição da função `DATE_FORMAT()`. O formato ISO refere-se à ISO 9715, não à ISO 8601.

<table summary="Chamadas de função para a função GET_FORMAT, juntamente com os resultados para cada chamada de função."><col style="width: 60%"/><col style="width: 40%"/><thead><tr> <th>Chamada de Função</th> <th>Resultado</th> </tr></thead><tbody><tr> <td><code>GET_FORMAT(DATE,'USA')</code></td> <td><code>'%m.%d.%Y'</code></td> </tr><tr> <td><code>GET_FORMAT(DATE,'JIS')</code></td> <td><code>'%Y-%m-%d'</code></td> </tr><tr> <td><code>GET_FORMAT(DATE,'ISO')</code></td> <td><code>'%Y-%m-%d'</code></td> </tr><tr> <td><code>GET_FORMAT(DATE,'EUR')</code></td> <td><code>'%d.%m.%Y'</code></td> </tr><tr> <td><code>GET_FORMAT(DATE,'INTERNAL')</code></td> <td><code>'%Y%m%d'</code></td> </tr><tr> <td><code>GET_FORMAT(DATETIME,'USA')</code></td> <td><code>'%Y-%m-%d %H.%i.%s'</code></td> </tr><tr> <td><code>GET_FORMAT(DATETIME,'JIS')</code></td> <td><code>'%Y-%m-%d %H:%i:%s'</code></td> </tr><tr> <td><code>GET_FORMAT(DATETIME,'ISO')</code></td> <td><code>'%Y-%m-%d %H:%i:%s'</code></td> </tr><tr> <td><code>GET_FORMAT(DATETIME,'EUR')</code></td> <td><code>'%Y-%m-%d %H.%i.%s'</code></td> </tr><tr> <td><code>GET_FORMAT(DATETIME,'INTERNAL')</code></td> <td><code>'%Y%m%d%H%i%s'</code></td> </tr><tr> <td><code>GET_FORMAT(TIME,'USA')</code></td> <td><code>'%h:%i:%s %p'</code></td> </tr><tr> <td><code>GET_FORMAT(TIME,'JIS')</code></td> <td><code>'%H:%i:%s'</code></td> </tr><tr> <td><code>GET_FORMAT(TIME,'ISO')</code></td> <td><code>'%H:%i:%s'</code></td> </tr><tr> <td><code>GET_FORMAT(TIME,'EUR')</code></td> <td><code>'%H.%i.%s'</code></td> </tr><tr> <td><a class="link" href="date-and-time-functions.html#function_get-format"><code class="literal

`TIMESTAMP` também pode ser usado como o primeiro argumento de `GET_FORMAT()`, nesse caso, a função retorna os mesmos valores que para `DATETIME`.

```
  mysql> SELECT DATE_FORMAT('2003-10-03',GET_FORMAT(DATE,'EUR'));
          -> '03.10.2003'
  mysql> SELECT STR_TO_DATE('10.31.2003',GET_FORMAT(DATE,'USA'));
          -> '2003-10-31'
  ```

* `HOUR(time)`

  Retorna a hora para *`time`*. A faixa do valor de retorno é `0` a `23` para valores de hora. No entanto, a faixa dos valores de `TIME` é muito maior, então `HOUR` pode retornar valores maiores que `23`. Retorna `NULL` se *`time`* for `NULL`.

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

  Retorna uma data, dados os valores de ano e dia do ano. *`dayofyear`* deve ser maior que 0 ou o resultado é `NULL`. O resultado também é `NULL` se qualquer um dos argumentos for `NULL`.

  ```
  mysql> SELECT MAKEDATE(2011,31), MAKEDATE(2011,32);
          -> '2011-01-31', '2011-02-01'
  mysql> SELECT MAKEDATE(2011,365), MAKEDATE(2014,365);
          -> '2011-12-31', '2014-12-31'
  mysql> SELECT MAKEDATE(2011,0);
          -> NULL
  ```

* `MAKETIME(hour,minute,second)`

  Retorna um valor de hora calculado a partir dos argumentos *`hour`*, *`minute`* e *`second`*. Retorna `NULL` se algum dos seus argumentos for `NULL`.

  O argumento *`second`* pode ter uma parte fracionária.

  ```
  mysql> SELECT MAKETIME(12,15,30);
          -> '12:15:30'
  ```

* `MICROSECOND(expr)`

  Retorna os microsegundos a partir da expressão de hora ou datetime *`expr`* como um número no intervalo de `0` a `999999`. Retorna `NULL` se *`expr`* for `NULL`.

  ```
  mysql> SELECT MICROSECOND('12:00:00.123456');
          -> 123456
  mysql> SELECT MICROSECOND('2019-12-31 23:59:59.000010');
          -> 10
  ```

* `MINUTE(time)`
```
  mysql> SELECT MINUTE('2008-02-03 10:05:03');
          -> 5
  ```FaXH6KtRM4```
  mysql> SELECT MONTH('2008-02-03');
          -> 2
  ```sUNWA6xjIG```
  mysql> SELECT MONTHNAME('2008-02-03');
          -> 'February'
  ```B1JvameySh```
  mysql> SELECT NOW();
          -> '2007-12-15 23:50:26'
  mysql> SELECT NOW() + 0;
          -> 20071215235026.000000
  ```rXLhUrn7gJ```
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
  ```03oDam6tzZ```
  mysql> SELECT PERIOD_ADD(200801,2);
          -> 200803
  ```J8VI8eQQe```
  mysql> SELECT PERIOD_DIFF(200802,200703);
          -> 11
  ```4DOH9REgeb```
  mysql> SELECT QUARTER('2008-04-01');
          -> 2
  ```f2piVYmZUV```
  mysql> SELECT SECOND('10:05:03');
          -> 3
  ```wm5KKHsrhA```
  mysql> SELECT SEC_TO_TIME(2378);
          -> '00:39:38'
  mysql> SELECT SEC_TO_TIME(2378) + 0;
          -> 3938
  ```SUOrBptygM```
  mysql> SELECT STR_TO_DATE('01,5,2013','%d,%m,%Y');
          -> '2013-05-01'
  mysql> SELECT STR_TO_DATE('May 1, 2013','%M %d,%Y');
          -> '2013-05-01'
  ```tLfXE6wPMr```
  mysql> SELECT STR_TO_DATE('a09:30:17','a%h:%i:%s');
          -> '09:30:17'
  mysql> SELECT STR_TO_DATE('a09:30:17','%h:%i:%s');
          -> NULL
  mysql> SELECT STR_TO_DATE('09:30:17a','%h:%i:%s');
          -> '09:30:17'
  ```yK7OkIt2rk```
  mysql> SELECT STR_TO_DATE('abc','abc');
          -> '0000-00-00'
  mysql> SELECT STR_TO_DATE('9','%m');
          -> '0000-09-00'
  mysql> SELECT STR_TO_DATE('9','%s');
          -> '00:00:09'
  ```gJG1UZbLWW```
  mysql> SELECT STR_TO_DATE('00/00/0000', '%m/%d/%Y');
          -> '0000-00-00'
  mysql> SELECT STR_TO_DATE('04/31/2004', '%m/%d/%Y');
          -> '2004-04-31'
  ```vV5ZHoDtWe```
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
  ```4EBIlCCRaq```
  mysql> SELECT STR_TO_DATE('200442 Monday', '%X%V %W');
          -> '2004-10-18'
  ```MsP7EHWezj```
  mysql> SELECT DATE_SUB('2008-01-02', INTERVAL 31 DAY);
          -> '2007-12-02'
  mysql> SELECT SUBDATE('2008-01-02', INTERVAL 31 DAY);
          -> '2007-12-02'
  ```cyzYeeYy4W```
  mysql> SELECT SUBDATE('2008-01-02 12:00:00', 31);
          -> '2007-12-02 12:00:00'
  ```JMCUaxZnMx```
  mysql> SELECT SUBTIME('2007-12-31 23:59:59.999999','1 1:1:1.000002');
          -> '2007-12-30 22:58:58.999997'
  mysql> SELECT SUBTIME('01:00:00.999999', '02:00:00.999998');
          -> '-00:59:59.999999'
  ```yxZT4svO6e```
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
  ```Kn9SABhitn```
  mysql> SELECT TIME('2003-12-31 01:02:03');
          -> '01:02:03'
  mysql> SELECT TIME('2003-12-31 01:02:03.000123');
          -> '01:02:03.000123'
  ```obTRIeWtdB```
  mysql> SELECT TIMEDIFF('2000-01-01 00:00:00',
      ->                 '2000-01-01 00:00:00.000001');
          -> '-00:00:00.000001'
  mysql> SELECT TIMEDIFF('2008-12-31 23:59:59.000001',
      ->                 '2008-12-30 01:01:01.000002');
          -> '46:58:57.999999'
  ```9XkBWxHYy1```
  mysql> SELECT TIMESTAMP('2003-12-31');
          -> '2003-12-31 00:00:00'
  mysql> SELECT TIMESTAMP('2003-12-31 12:00:00','12:00:00');
          -> '2004-01-01 00:00:00'
  ```gyrX1lWw1w```
  mysql> SELECT TIMESTAMPADD(MINUTE, 1, '2003-01-02');
          -> '2003-01-02 00:01:00'
  mysql> SELECT TIMESTAMPADD(WEEK,1,'2003-01-02');
          -> '2003-01-09'
  ```rV97bxG2AY```
  mysql> SELECT TIMESTAMPADD(MONTH, 1, DATE '2024-03-30') AS t1,
       >        TIMESTAMPADD(MONTH, 1, DATE '2024-03-31') AS t2;
  +------------+------------+
  | t1         | t2         |
  +------------+------------+
  | 2024-04-30 | 2024-04-30 |
  +------------+------------+
  1 row in set (0.00 sec)
  ```ajypKHKv5e```
  mysql> SELECT TIMESTAMPDIFF(MONTH,'2003-02-01','2003-05-01');
          -> 3
  mysql> SELECT TIMESTAMPDIFF(YEAR,'2002-05-01','2001-01-01');
          -> -1
  mysql> SELECT TIMESTAMPDIFF(MINUTE,'2003-02-01','2003-05-01 12:05:55');
          -> 128885
  ```kByH8diSbK```
  mysql> SELECT TIME_FORMAT('100:00:00', '%H %k %h %I %l');
          -> '100 100 04 04 4'
  ```uww6wBU0CZ```
  mysql> SELECT TIME_TO_SEC('22:23:00');
          -> 80580
  mysql> SELECT TIME_TO_SEC('00:39:38');
          -> 2378
  ```nJIGhbkctw```
  mysql> SELECT TO_DAYS(950501);
          -> 728779
  mysql> SELECT TO_DAYS('2007-10-07');
          -> 733321
  ```ZqT7ATTb1h```
  mysql> SELECT TO_DAYS('2008-10-07'), TO_DAYS('08-10-07');
          -> 733687, 733687
  ```NLYEKmf31n```
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
  ```JwplL3Maxb```
  mysql> SELECT TO_SECONDS(950501);
          -> 62966505600
  mysql> SELECT TO_SECONDS('2009-11-29');
          -> 63426672000
  mysql> SELECT TO_SECONDS('2009-11-29 13:43:32');
          -> 63426721412
  mysql> SELECT TO_SECONDS( NOW() );
          -> 63426721458
  ```8fXCG6DJna```
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
  ```m71XtAi3Et```
  mysql> SELECT UNIX_TIMESTAMP();
          -> 1447431666
  mysql> SELECT UNIX_TIMESTAMP('2015-11-13 10:20:19');
          -> 1447431619
  mysql> SELECT UNIX_TIMESTAMP('2015-11-13 10:20:19.012');
          -> 1447431619.012
  ```8RdUzOdzR2```
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
  ```sle1dvNlbv```
  mysql> SELECT UTC_DATE(), UTC_DATE() + 0;
          -> '2003-08-14', 20030814
  ```ySNF7aR23V```
  mysql> SELECT UTC_TIME(), UTC_TIME() + 0;
          -> '18:07:53', 180753.000000
  ```0KQNbjKGIe```
  mysql> SELECT UTC_TIMESTAMP(), UTC_TIMESTAMP() + 0;
          -> '2003-08-14 18:08:04', 20030814180804.000000
  ```sGjSphRQHZ```
  mysql> SELECT WEEK('2008-02-20');
          -> 7
  mysql> SELECT WEEK('2008-02-20',0);
          -> 7
  mysql> SELECT WEEK('2008-02-20',1);
          -> 8
  mysql> SELECT WEEK('2008-12-31',1);
          -> 53
  ```rwsv63xq09```
  mysql> SELECT YEAR('2000-01-01'), WEEK('2000-01-01',0);
          -> 2000, 0
  ```bFhpagPnuQ```
  mysql> SELECT WEEK('2000-01-01',2);
          -> 52
  ```KcMFJnWuwf```
  mysql> SELECT YEARWEEK('2000-01-01');
          -> 199952
  mysql> SELECT MID(YEARWEEK('2000-01-01'),5,2);
          -> '52'
  ```LmPzLAdWwp```
  mysql> SELECT WEEKDAY('2008-02-03 22:23:00');
          -> 6
  mysql> SELECT WEEKDAY('2007-11-06');
          -> 1
  ```zNlLJn11Pb```
  mysql> SELECT WEEKOFYEAR('2008-02-20');
          -> 8
  ```zuRrqeiPQV```
  mysql> SELECT YEAR('1987-01-01');
          -> 1987
  ```xCtnA0yGbC```

O número da semana é diferente do que a função `WEEK()` retornaria (`0`) para argumentos opcionais `0` ou `1`, pois `WEEK()` então retorna a semana no contexto do ano dado.