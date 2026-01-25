## 12.7 Funções de Data e Hora

Esta seção descreve as funções que podem ser usadas para manipular valores temporais. Consulte a Seção 11.2, “Tipos de Dados de Data e Hora”, para uma descrição do intervalo de valores que cada tipo de data e hora possui e os formatos válidos nos quais os valores podem ser especificados.

**Tabela 12.11 Funções de Data e Hora**

<table frame="box" rules="all" summary="Uma referência que lista funções de data e hora."><col style="width: 28%"/><col style="width: 71%"/><thead><tr><th>Nome</th> <th>Descrição</th> </tr></thead><tbody><tr><td><code>ADDDATE()</code></td> <td> Adiciona valores de tempo (INTERVALs) a um valor DATE </td> </tr><tr><td><code>ADDTIME()</code></td> <td> Adiciona tempo </td> </tr><tr><td><code>CONVERT_TZ()</code></td> <td> Converte de um Time Zone para outro </td> </tr><tr><td><code>CURDATE()</code></td> <td> Retorna a data atual </td> </tr><tr><td><code>CURRENT_DATE()</code>, <code>CURRENT_DATE</code></td> <td> Sinônimos para CURDATE() </td> </tr><tr><td><code>CURRENT_TIME()</code>, <code>CURRENT_TIME</code></td> <td> Sinônimos para CURTIME() </td> </tr><tr><td><code>CURRENT_TIMESTAMP()</code>, <code>CURRENT_TIMESTAMP</code></td> <td> Sinônimos para NOW() </td> </tr><tr><td><code>CURTIME()</code></td> <td> Retorna a hora atual </td> </tr><tr><td><code>DATE()</code></td> <td> Extrai a parte DATE de uma expressão DATE ou DATETIME </td> </tr><tr><td><code>DATE_ADD()</code></td> <td> Adiciona valores de tempo (INTERVALs) a um valor DATE </td> </tr><tr><td><code>DATE_FORMAT()</code></td> <td> Formata DATE conforme especificado </td> </tr><tr><td><code>DATE_SUB()</code></td> <td> Subtrai um valor de tempo (INTERVAL) de uma DATE </td> </tr><tr><td><code>DATEDIFF()</code></td> <td> Subtrai duas datas </td> </tr><tr><td><code>DAY()</code></td> <td> Sinônimo para DAYOFMONTH() </td> </tr><tr><td><code>DAYNAME()</code></td> <td> Retorna o nome do dia da semana </td> </tr><tr><td><code>DAYOFMONTH()</code></td> <td> Retorna o dia do mês (0-31) </td> </tr><tr><td><code>DAYOFWEEK()</code></td> <td> Retorna o índice do dia da semana do argumento </td> </tr><tr><td><code>DAYOFYEAR()</code></td> <td> Retorna o dia do ano (1-366) </td> </tr><tr><td><code>EXTRACT()</code></td> <td> Extrai parte de uma DATE </td> </tr><tr><td><code>FROM_DAYS()</code></td> <td> Converte um número de dias para uma DATE </td> </tr><tr><td><code>FROM_UNIXTIME()</code></td> <td> Formata Unix timestamp como uma DATE </td> </tr><tr><td><code>GET_FORMAT()</code></td> <td> Retorna uma string de formato de DATE </td> </tr><tr><td><code>HOUR()</code></td> <td> Extrai a hora </td> </tr><tr><td><code>LAST_DAY</code></td> <td> Retorna o último dia do mês para o argumento </td> </tr><tr><td><code>LOCALTIME()</code>, <code>LOCALTIME</code></td> <td> Sinônimo para NOW() </td> </tr><tr><td><code>LOCALTIMESTAMP</code>, <code>LOCALTIMESTAMP()</code></td> <td> Sinônimo para NOW() </td> </tr><tr><td><code>MAKEDATE()</code></td> <td> Cria uma DATE a partir do ano e do dia do ano </td> </tr><tr><td><code>MAKETIME()</code></td> <td> Cria TIME a partir de hora, minuto, segundo </td> </tr><tr><td><code>MICROSECOND()</code></td> <td> Retorna os microssegundos do argumento </td> </tr><tr><td><code>MINUTE()</code></td> <td> Retorna o minuto do argumento </td> </tr><tr><td><code>MONTH()</code></td> <td> Retorna o mês da DATE fornecida </td> </tr><tr><td><code>MONTHNAME()</code></td> <td> Retorna o nome do mês </td> </tr><tr><td><code>NOW()</code></td> <td> Retorna a DATE e TIME atuais </td> </tr><tr><td><code>PERIOD_ADD()</code></td> <td> Adiciona um período a um ano-mês </td> </tr><tr><td><code>PERIOD_DIFF()</code></td> <td> Retorna o número de meses entre períodos </td> </tr><tr><td><code>QUARTER()</code></td> <td> Retorna o trimestre a partir de um argumento DATE </td> </tr><tr><td><code>SEC_TO_TIME()</code></td> <td> Converte segundos para o formato 'hh:mm:ss' </td> </tr><tr><td><code>SECOND()</code></td> <td> Retorna o segundo (0-59) </td> </tr><tr><td><code>STR_TO_DATE()</code></td> <td> Converte uma string para uma DATE </td> </tr><tr><td><code>SUBDATE()</code></td> <td> Sinônimo para DATE_SUB() quando invocado com três argumentos </td> </tr><tr><td><code>SUBTIME()</code></td> <td> Subtrai tempos </td> </tr><tr><td><code>SYSDATE()</code></td> <td> Retorna o tempo em que a função é executada </td> </tr><tr><td><code>TIME()</code></td> <td> Extrai a porção TIME da expressão fornecida </td> </tr><tr><td><code>TIME_FORMAT()</code></td> <td> Formata como TIME </td> </tr><tr><td><code>TIME_TO_SEC()</code></td> <td> Retorna o argumento convertido para segundos </td> </tr><tr><td><code>TIMEDIFF()</code></td> <td> Subtrai tempo </td> </tr><tr><td><code>TIMESTAMP()</code></td> <td> Com um único argumento, esta função retorna a expressão DATE ou DATETIME; com dois argumentos, a soma dos argumentos </td> </tr><tr><td><code>TIMESTAMPADD()</code></td> <td> Adiciona um INTERVAL a uma expressão DATETIME </td> </tr><tr><td><code>TIMESTAMPDIFF()</code></td> <td> Retorna a diferença de duas expressões DATETIME, usando as UNITs especificadas </td> </tr><tr><td><code>TO_DAYS()</code></td> <td> Retorna o argumento DATE convertido para dias </td> </tr><tr><td><code>TO_SECONDS()</code></td> <td> Retorna o argumento DATE ou DATETIME convertido para segundos desde o Ano 0 </td> </tr><tr><td><code>UNIX_TIMESTAMP()</code></td> <td> Retorna um Unix timestamp </td> </tr><tr><td><code>UTC_DATE()</code></td> <td> Retorna a DATE UTC atual </td> </tr><tr><td><code>UTC_TIME()</code></td> <td> Retorna a TIME UTC atual </td> </tr><tr><td><code>UTC_TIMESTAMP()</code></td> <td> Retorna a DATE e TIME UTC atuais </td> </tr><tr><td><code>WEEK()</code></td> <td> Retorna o número da semana </td> </tr><tr><td><code>WEEKDAY()</code></td> <td> Retorna o índice do dia da semana </td> </tr><tr><td><code>WEEKOFYEAR()</code></td> <td> Retorna a semana calendário da DATE (1-53) </td> </tr><tr><td><code>YEAR()</code></td> <td> Retorna o ano </td> </tr><tr><td><code>YEARWEEK()</code></td> <td> Retorna o ano e a semana </td> </tr></tbody></table>

Aqui está um exemplo que usa funções de DATE. A seguinte Query seleciona todas as linhas com um valor *`date_col`* dentro dos últimos 30 dias:

```sql
mysql> SELECT something FROM tbl_name
    -> WHERE DATE_SUB(CURDATE(),INTERVAL 30 DAY) <= date_col;
```

A Query também seleciona linhas com datas que estão no futuro.

Funções que esperam valores de DATE geralmente aceitam valores DATETIME e ignoram a parte TIME. Funções que esperam valores de TIME geralmente aceitam valores DATETIME e ignoram a parte DATE.

Funções que retornam a DATE ou TIME atuais são avaliadas apenas uma vez por Query, no início da execução da Query. Isso significa que múltiplas referências a uma função como `NOW()` dentro de uma única Query sempre produzirão o mesmo resultado. (Para nossos propósitos, uma única Query também inclui uma chamada para um stored program (stored routine, trigger ou event) e todos os subprogramas chamados por esse programa.) Este princípio também se aplica a `CURDATE()`, `CURTIME()`, `UTC_DATE()`, `UTC_TIME()`, `UTC_TIMESTAMP()` e a quaisquer de seus sinônimos.

As funções `CURRENT_TIMESTAMP()`, `CURRENT_TIME()`, `CURRENT_DATE()` e `FROM_UNIXTIME()` retornam valores no Time Zone da sessão atual, que está disponível como o valor de sessão da variável de sistema `time_zone`. Além disso, `UNIX_TIMESTAMP()` assume que seu argumento é um valor DATETIME no Time Zone da sessão. Consulte a Seção 5.1.13, “Suporte a Time Zone do Servidor MySQL”.

Algumas funções de DATE podem ser usadas com datas "zero" ou datas incompletas, como `'2001-11-00'`, enquanto outras não. Funções que extraem partes de datas geralmente funcionam com datas incompletas e, portanto, podem retornar 0 quando você poderia esperar um valor diferente de zero. Por exemplo:

```sql
mysql> SELECT DAYOFMONTH('2001-11-00'), MONTH('2005-00-00');
        -> 0, 0
```

Outras funções esperam datas completas e retornam `NULL` para datas incompletas. Isso inclui funções que realizam aritmética de DATE ou que mapeiam partes de datas para nomes. Por exemplo:

```sql
mysql> SELECT DATE_ADD('2006-05-00',INTERVAL 1 DAY);
        -> NULL
mysql> SELECT DAYNAME('2006-05-00');
        -> NULL
```

Várias funções são estritas ao receber um valor de função `DATE()` como argumento e rejeitam datas incompletas com uma parte do dia igual a zero: `CONVERT_TZ()`, `DATE_ADD()`, `DATE_SUB()`, `DAYOFYEAR()`, `TIMESTAMPDIFF()`, `TO_DAYS()`, `TO_SECONDS()`, `WEEK()`, `WEEKDAY()`, `WEEKOFYEAR()`, `YEARWEEK()`.

Segundos fracionários para valores `TIME`, `DATETIME` e `TIMESTAMP` são suportados, com precisão de até microssegundos. Funções que aceitam argumentos temporais aceitam valores com segundos fracionários. Os valores de retorno das funções temporais incluem segundos fracionários conforme apropriado.

* `ADDDATE(date,INTERVAL expr unit)`, `ADDDATE(expr,days)`

  Quando invocada com a forma `INTERVAL` do segundo argumento, `ADDDATE()` é um sinônimo para `DATE_ADD()`. A função relacionada `SUBDATE()` é um sinônimo para `DATE_SUB()`. Para informações sobre o argumento `INTERVAL` *`unit`*, consulte Temporal Intervals.

  ```sql
  mysql> SELECT DATE_ADD('2008-01-02', INTERVAL 31 DAY);
          -> '2008-02-02'
  mysql> SELECT ADDDATE('2008-01-02', INTERVAL 31 DAY);
          -> '2008-02-02'
  ```

  Quando invocada com a forma *`days`* do segundo argumento, o MySQL o trata como um número inteiro de dias a serem adicionados a *`expr`*.

  ```sql
  mysql> SELECT ADDDATE('2008-01-02', 31);
          -> '2008-02-02'
  ```

* `ADDTIME(expr1,expr2)`

  `ADDTIME()` adiciona *`expr2`* a *`expr1`* e retorna o resultado. *`expr1`* é uma expressão de TIME ou DATETIME, e *`expr2`* é uma expressão de TIME.

  ```sql
  mysql> SELECT ADDTIME('2007-12-31 23:59:59.999999', '1 1:1:1.000002');
          -> '2008-01-02 01:01:01.000001'
  mysql> SELECT ADDTIME('01:00:00.999999', '02:00:00.999998');
          -> '03:00:01.999997'
  ```

* `CONVERT_TZ(dt,from_tz,to_tz)`

  `CONVERT_TZ()` converte um valor DATETIME *`dt`* do Time Zone fornecido por *`from_tz`* para o Time Zone fornecido por *`to_tz`* e retorna o valor resultante. Os Time Zones são especificados conforme descrito na Seção 5.1.13, “Suporte a Time Zone do Servidor MySQL”. Esta função retorna `NULL` se os argumentos forem inválidos.

  Se o valor estiver fora do intervalo suportado pelo tipo `TIMESTAMP` quando convertido de *`from_tz`* para UTC, nenhuma conversão ocorrerá. O intervalo `TIMESTAMP` é descrito na Seção 11.2.1, “Sintaxe de Tipos de Dados de Data e Hora”.

  ```sql
  mysql> SELECT CONVERT_TZ('2004-01-01 12:00:00','GMT','MET');
          -> '2004-01-01 13:00:00'
  mysql> SELECT CONVERT_TZ('2004-01-01 12:00:00','+00:00','+10:00');
          -> '2004-01-01 22:00:00'
  ```

  Nota

  Para usar Time Zones nomeados, como `'MET'` ou `'Europe/Amsterdam'`, as tabelas de Time Zone devem estar configuradas corretamente. Para instruções, consulte a Seção 5.1.13, “Suporte a Time Zone do Servidor MySQL”.

* `CURDATE()`

  Retorna a DATE atual como um valor no formato `'YYYY-MM-DD'` ou *`YYYYMMDD`*, dependendo se a função é usada em um contexto de string ou numérico.

  ```sql
  mysql> SELECT CURDATE();
          -> '2008-06-13'
  mysql> SELECT CURDATE() + 0;
          -> 20080613
  ```

* `CURRENT_DATE`, `CURRENT_DATE()`

  `CURRENT_DATE` e `CURRENT_DATE()` são sinônimos para `CURDATE()`.

* `CURRENT_TIME`, `CURRENT_TIME([fsp])`

  `CURRENT_TIME` e `CURRENT_TIME()` são sinônimos para `CURTIME()`.

* `CURRENT_TIMESTAMP`, `CURRENT_TIMESTAMP([fsp])`

  `CURRENT_TIMESTAMP` e `CURRENT_TIMESTAMP()` são sinônimos para `NOW()`.

* `CURTIME([fsp])`

  Retorna a TIME atual como um valor no formato *`'hh:mm:ss'`* ou *`hhmmss`*, dependendo se a função é usada em um contexto de string ou numérico. O valor é expresso no Time Zone da sessão.

  Se o argumento *`fsp`* for fornecido para especificar uma precisão de segundos fracionários de 0 a 6, o valor de retorno incluirá uma parte de segundos fracionários com essa quantidade de dígitos.

  ```sql
  mysql> SELECT CURTIME();
          -> '23:50:26'
  mysql> SELECT CURTIME() + 0;
          -> 235026.000000
  ```

* `DATE(expr)`

  Extrai a parte DATE da expressão DATE ou DATETIME *`expr`*.

  ```sql
  mysql> SELECT DATE('2003-12-31 01:02:03');
          -> '2003-12-31'
  ```

* `DATEDIFF(expr1,expr2)`

  `DATEDIFF()` retorna *`expr1`* − *`expr2`* expresso como um valor em dias de uma DATE para a outra. *`expr1`* e *`expr2`* são expressões de DATE ou DATE-e-TIME. Apenas as partes DATE dos valores são usadas no cálculo.

  ```sql
  mysql> SELECT DATEDIFF('2007-12-31 23:59:59','2007-12-30');
          -> 1
  mysql> SELECT DATEDIFF('2010-11-30 23:59:59','2010-12-31');
          -> -31
  ```

* `DATE_ADD(date,INTERVAL expr unit)`, `DATE_SUB(date,INTERVAL expr unit)`

  Estas funções realizam aritmética de DATE. O argumento *`date`* especifica a DATE inicial ou o valor DATETIME. *`expr`* é uma expressão que especifica o valor INTERVAL a ser adicionado ou subtraído da DATE inicial. *`expr`* é avaliado como uma string; pode começar com um `-` para INTERVALs negativos. *`unit`* é uma palavra-chave que indica as unidades nas quais a expressão deve ser interpretada.

  Para obter mais informações sobre a sintaxe de INTERVAL temporal, incluindo uma lista completa de especificadores *`unit`*, a forma esperada do argumento *`expr`* para cada valor *`unit`*, e regras para interpretação de operandos em aritmética temporal, consulte Temporal Intervals.

  O valor de retorno depende dos argumentos:

  + `DATE` se o argumento *`date`* for um valor `DATE` e seus cálculos envolverem apenas partes `YEAR`, `MONTH` e `DAY` (ou seja, sem partes TIME).

  + `DATETIME` se o primeiro argumento for um valor `DATETIME` (ou `TIMESTAMP`), ou se o primeiro argumento for uma `DATE` e o valor *`unit`* usar `HOURS`, `MINUTES` ou `SECONDS`.

  + String caso contrário.

  Para garantir que o resultado seja `DATETIME`, você pode usar `CAST()` para converter o primeiro argumento para `DATETIME`.

  ```sql
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

  Ao adicionar um INTERVAL `MONTH` a um valor `DATE` ou `DATETIME`, e a DATE resultante incluir um dia que não existe no mês fornecido, o dia é ajustado para o último dia do mês, conforme mostrado aqui:

  ```sql
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

  Formata o valor *`date`* de acordo com a string de *`format`*.

  Os especificadores mostrados na tabela a seguir podem ser usados na string de *`format`*. O caractere `%` é obrigatório antes dos caracteres especificadores de formato. Os especificadores também se aplicam a outras funções: `STR_TO_DATE()`, `TIME_FORMAT()`, `UNIX_TIMESTAMP()`.

  <table summary="Caracteres especificadores para a função DATE_FORMAT que podem ser usados na string de formato e fornecem uma descrição de cada caractere especificador."><col style="width: 20%"/><col style="width: 70%"/><thead><tr> <th>Especificador</th> <th>Descrição</th> </tr></thead><tbody><tr> <td><code>%a</code></td> <td>Nome abreviado do dia da semana (<code>Sun</code>..<code>Sat</code>)</td> </tr><tr> <td><code>%b</code></td> <td>Nome abreviado do mês (<code>Jan</code>..<code>Dec</code>)</td> </tr><tr> <td><code>%c</code></td> <td>Mês, numérico (<code>0</code>..<code>12</code>)</td> </tr><tr> <td><code>%D</code></td> <td>Dia do mês com sufixo em inglês (<code>0th</code>, <code>1st</code>, <code>2nd</code>, <code>3rd</code>, …)</td> </tr><tr> <td><code>%d</code></td> <td>Dia do mês, numérico (<code>00</code>..<code>31</code>)</td> </tr><tr> <td><code>%e</code></td> <td>Dia do mês, numérico (<code>0</code>..<code>31</code>)</td> </tr><tr> <td><code>%f</code></td> <td>Microssegundos (<code>000000</code>..<code>999999</code>)</td> </tr><tr> <td><code>%H</code></td> <td>Hora (<code>00</code>..<code>23</code>)</td> </tr><tr> <td><code>%h</code></td> <td>Hora (<code>01</code>..<code>12</code>)</td> </tr><tr> <td><code>%I</code></td> <td>Hora (<code>01</code>..<code>12</code>)</td> </tr><tr> <td><code>%i</code></td> <td>Minutos, numérico (<code>00</code>..<code>59</code>)</td> </tr><tr> <td><code>%j</code></td> <td>Dia do ano (<code>001</code>..<code>366</code>)</td> </tr><tr> <td><code>%k</code></td> <td>Hora (<code>0</code>..<code>23</code>)</td> </tr><tr> <td><code>%l</code></td> <td>Hora (<code>1</code>..<code>12</code>)</td> </tr><tr> <td><code>%M</code></td> <td>Nome do mês (<code>January</code>..<code>December</code>)</td> </tr><tr> <td><code>%m</code></td> <td>Mês, numérico (<code>00</code>..<code>12</code>)</td> </tr><tr> <td><code>%p</code></td> <td><code>AM</code> ou <code>PM</code></td> </tr><tr> <td><code>%r</code></td> <td>Hora, 12 horas (<em><code>hh:mm:ss</code></em> seguido por <code>AM</code> ou <code>PM</code>)</td> </tr><tr> <td><code>%S</code></td> <td>Segundos (<code>00</code>..<code>59</code>)</td> </tr><tr> <td><code>%s</code></td> <td>Segundos (<code>00</code>..<code>59</code>)</td> </tr><tr> <td><code>%T</code></td> <td>Hora, 24 horas (<em><code>hh:mm:ss</code></em>)</td> </tr><tr> <td><code>%U</code></td> <td>Semana (<code>00</code>..<code>53</code>), onde Domingo é o primeiro dia da semana; modo <code>WEEK()</code> 0</td> </tr><tr> <td><code>%u</code></td> <td>Semana (<code>00</code>..<code>53</code>), onde Segunda-feira é o primeiro dia da semana; modo <code>WEEK()</code> 1</td> </tr><tr> <td><code>%V</code></td> <td>Semana (<code>01</code>..<code>53</code>), onde Domingo é o primeiro dia da semana; modo <code>WEEK()</code> 2; usado com <code>%X</code></td> </tr><tr> <td><code>%v</code></td> <td>Semana (<code>01</code>..<code>53</code>), onde Segunda-feira é o primeiro dia da semana; modo <code>WEEK()</code> 3; usado com <code>%x</code></td> </tr><tr> <td><code>%W</code></td> <td>Nome do dia da semana (<code>Sunday</code>..<code>Saturday</code>)</td> </tr><tr> <td><code>%w</code></td> <td>Dia da semana (<code>0</code>=Sunday..<code>6</code>=Saturday)</td> </tr><tr> <td><code>%X</code></td> <td>Ano da semana onde Domingo é o primeiro dia da semana, numérico, quatro dígitos; usado com <code>%V</code></td> </tr><tr> <td><code>%x</code></td> <td>Ano da semana onde Segunda-feira é o primeiro dia da semana, numérico, quatro dígitos; usado com <code>%v</code></td> </tr><tr> <td><code>%Y</code></td> <td>Ano, numérico, quatro dígitos</td> </tr><tr> <td><code>%y</code></td> <td>Ano, numérico (dois dígitos)</td> </tr><tr> <td><code>%%</code></td> <td>Um caractere literal <code>%</code></td> </tr><tr> <td><code>%<em><code>x</code></em></code></td> <td><em><code>x</code></em>, para qualquer *`x`* não listado acima</td> </tr></tbody></table>

Os intervalos para os especificadores de mês e dia começam com zero devido ao fato de que o MySQL permite o armazenamento de datas incompletas, como `'2014-00-00'`.

O idioma usado para os nomes e abreviações de dias e meses é controlado pelo valor da variável de sistema `lc_time_names` (Seção 10.16, “Suporte a Localização do Servidor MySQL”).

Para os especificadores `%U`, `%u`, `%V` e `%v`, consulte a descrição da função `WEEK()` para obter informações sobre os valores de modo. O modo afeta como a numeração da semana ocorre.

`DATE_FORMAT()` retorna uma string com um conjunto de caracteres e collation dados por `character_set_connection` e `collation_connection`, para que possa retornar nomes de meses e dias da semana contendo caracteres não ASCII.

```sql
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

  Consulte a descrição de `DATE_ADD()`.

* `DAY(date)`

  `DAY()` é um sinônimo para `DAYOFMONTH()`.

* `DAYNAME(date)`

  Retorna o nome do dia da semana para *`date`*. O idioma usado para o nome é controlado pelo valor da variável de sistema `lc_time_names` (Seção 10.16, “Suporte a Localização do Servidor MySQL”).

  ```sql
  mysql> SELECT DAYNAME('2007-02-03');
          -> 'Saturday'
  ```

* `DAYOFMONTH(date)`

  Retorna o dia do mês para *`date`*, no intervalo de `1` a `31`, ou `0` para datas como `'0000-00-00'` ou `'2008-00-00'` que têm uma parte do dia zero.

  ```sql
  mysql> SELECT DAYOFMONTH('2007-02-03');
          -> 3
  ```

* `DAYOFWEEK(date)`

  Retorna o índice do dia da semana para *`date`* (`1` = Domingo, `2` = Segunda-feira, …, `7` = Sábado). Estes valores de índice correspondem ao padrão ODBC.

  ```sql
  mysql> SELECT DAYOFWEEK('2007-02-03');
          -> 7
  ```

* `DAYOFYEAR(date)`

  Retorna o dia do ano para *`date`*, no intervalo de `1` a `366`.

  ```sql
  mysql> SELECT DAYOFYEAR('2007-02-03');
          -> 34
  ```

* `EXTRACT(unit FROM date)`

  A função `EXTRACT()` usa os mesmos tipos de especificadores *`unit`* que `DATE_ADD()` ou `DATE_SUB()`, mas extrai partes da DATE em vez de realizar aritmética de DATE. Para obter informações sobre o argumento *`unit`*, consulte Temporal Intervals.

  ```sql
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

  Dado um número de dias *`N`*, retorna um valor `DATE`.

  ```sql
  mysql> SELECT FROM_DAYS(730669);
          -> '2000-07-03'
  ```

  Use `FROM_DAYS()` com cautela em datas antigas. Não se destina ao uso com valores que precedem o advento do calendário Gregoriano (1582). Consulte a Seção 11.2.8, “Qual Calendário é Usado pelo MySQL?”.

* `FROM_UNIXTIME(unix_timestamp[,format])`

  Retorna uma representação de *`unix_timestamp`* como um valor DATETIME ou string de caractere. O valor retornado é expresso usando o Time Zone da sessão. (Clientes podem definir o Time Zone da sessão conforme descrito na Seção 5.1.13, “Suporte a Time Zone do Servidor MySQL”.) *`unix_timestamp`* é um valor de timestamp interno que representa segundos desde `'1970-01-01 00:00:00'` UTC, como o produzido pela função `UNIX_TIMESTAMP()`.

  Se *`format`* for omitido, esta função retorna um valor `DATETIME`.

  Se *`unix_timestamp`* for um inteiro, a precisão dos segundos fracionários do `DATETIME` é zero. Quando *`unix_timestamp`* é um valor decimal, a precisão dos segundos fracionários do `DATETIME` é a mesma da precisão do valor decimal, até um máximo de 6. Quando *`unix_timestamp`* é um número de ponto flutuante, a precisão dos segundos fracionários do DATETIME é 6.

  *`format`* é usado para formatar o resultado da mesma forma que a string de formato usada para a função `DATE_FORMAT()`. Se *`format`* for fornecido, o valor retornado será um `VARCHAR`.

  ```sql
  mysql> SELECT FROM_UNIXTIME(1447430881);
          -> '2015-11-13 10:08:01'
  mysql> SELECT FROM_UNIXTIME(1447430881) + 0;
          -> 20151113100801
  mysql> SELECT FROM_UNIXTIME(1447430881,
      ->                      '%Y %D %M %h:%i:%s %x');
          -> '2015 13th November 10:08:01 2015'
  ```

  Nota

  Se você usar `UNIX_TIMESTAMP()` e `FROM_UNIXTIME()` para converter entre valores em um Time Zone não-UTC e valores Unix timestamp, a conversão é com perda (lossy) porque o mapeamento não é um-para-um em ambas as direções. Para detalhes, consulte a descrição da função `UNIX_TIMESTAMP()`.

* `GET_FORMAT({DATE|TIME|DATETIME}, {'EUR'|'USA'|'JIS'|'ISO'|'INTERNAL'})`

  Retorna uma string de formato. Esta função é útil em combinação com as funções `DATE_FORMAT()` e `STR_TO_DATE()`.

  Os possíveis valores para o primeiro e segundo argumentos resultam em várias strings de formato possíveis (para os especificadores usados, consulte a tabela na descrição da função `DATE_FORMAT()`). O formato ISO se refere ao ISO 9075, não ao ISO 8601.

  <table summary="Chamadas de função para a função GET_FORMAT juntamente com os resultados para cada chamada de função."><col style="width: 60%"/><col style="width: 40%"/><thead><tr> <th>Chamada da Função</th> <th>Resultado</th> </tr></thead><tbody><tr> <td><code>GET_FORMAT(DATE,'USA')</code></td> <td><code>'%m.%d.%Y'</code></td> </tr><tr> <td><code>GET_FORMAT(DATE,'JIS')</code></td> <td><code>'%Y-%m-%d'</code></td> </tr><tr> <td><code>GET_FORMAT(DATE,'ISO')</code></td> <td><code>'%Y-%m-%d'</code></td> </tr><tr> <td><code>GET_FORMAT(DATE,'EUR')</code></td> <td><code>'%d.%m.%Y'</code></td> </tr><tr> <td><code>GET_FORMAT(DATE,'INTERNAL')</code></td> <td><code>'%Y%m%d'</code></td> </tr><tr> <td><code>GET_FORMAT(DATETIME,'USA')</code></td> <td><code>'%Y-%m-%d %H.%i.%s'</code></td> </tr><tr> <td><code>GET_FORMAT(DATETIME,'JIS')</code></td> <td><code>'%Y-%m-%d %H:%i:%s'</code></td> </tr><tr> <td><code>GET_FORMAT(DATETIME,'ISO')</code></td> <td><code>'%Y-%m-%d %H:%i:%s'</code></td> </tr><tr> <td><code>GET_FORMAT(DATETIME,'EUR')</code></td> <td><code>'%Y-%m-%d %H.%i.%s'</code></td> </tr><tr> <td><code>GET_FORMAT(DATETIME,'INTERNAL')</code></td> <td><code>'%Y%m%d%H%i%s'</code></td> </tr><tr> <td><code>GET_FORMAT(TIME,'USA')</code></td> <td><code>'%h:%i:%s %p'</code></td> </tr><tr> <td><code>GET_FORMAT(TIME,'JIS')</code></td> <td><code>'%H:%i:%s'</code></td> </tr><tr> <td><code>GET_FORMAT(TIME,'ISO')</code></td> <td><code>'%H:%i:%s'</code></td> </tr><tr> <td><code>GET_FORMAT(TIME,'EUR')</code></td> <td><code>'%H.%i.%s'</code></td> </tr><tr> <td><code>GET_FORMAT(TIME,'INTERNAL')</code></td> <td><code>'%H%i%s'</code></td> </tr></tbody></table>

`TIMESTAMP` também pode ser usado como o primeiro argumento para `GET_FORMAT()`, neste caso a função retorna os mesmos valores que para `DATETIME`.

```sql
  mysql> SELECT DATE_FORMAT('2003-10-03',GET_FORMAT(DATE,'EUR'));
          -> '03.10.2003'
  mysql> SELECT STR_TO_DATE('10.31.2003',GET_FORMAT(DATE,'USA'));
          -> '2003-10-31'
  ```

* `HOUR(time)`

  Retorna a hora para *`time`*. O intervalo do valor de retorno é de `0` a `23` para valores de hora do dia. No entanto, o intervalo de valores `TIME` é, na verdade, muito maior, então `HOUR` pode retornar valores maiores que `23`.

  ```sql
  mysql> SELECT HOUR('10:05:03');
          -> 10
  mysql> SELECT HOUR('272:59:59');
          -> 272
  ```

* `LAST_DAY(date)`

  Aceita um valor DATE ou DATETIME e retorna o valor correspondente para o último dia do mês. Retorna `NULL` se o argumento for inválido.

  ```sql
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

  `LOCALTIME` e `LOCALTIME()` são sinônimos para `NOW()`.

* `LOCALTIMESTAMP`, `LOCALTIMESTAMP([fsp])`

  `LOCALTIMESTAMP` e `LOCALTIMESTAMP()` são sinônimos para `NOW()`.

* `MAKEDATE(year,dayofyear)`

  Retorna uma DATE, dados os valores de ano e dia do ano. *`dayofyear`* deve ser maior que 0, caso contrário o resultado é `NULL`.

  ```sql
  mysql> SELECT MAKEDATE(2011,31), MAKEDATE(2011,32);
          -> '2011-01-31', '2011-02-01'
  mysql> SELECT MAKEDATE(2011,365), MAKEDATE(2014,365);
          -> '2011-12-31', '2014-12-31'
  mysql> SELECT MAKEDATE(2011,0);
          -> NULL
  ```

* `MAKETIME(hour,minute,second)`

  Retorna um valor TIME calculado a partir dos argumentos *`hour`*, *`minute`* e *`second`*.

  O argumento *`second`* pode ter uma parte fracionária.

  ```sql
  mysql> SELECT MAKETIME(12,15,30);
          -> '12:15:30'
  ```

* `MICROSECOND(expr)`

  Retorna os microssegundos da expressão TIME ou DATETIME *`expr`* como um número no intervalo de `0` a `999999`.

  ```sql
  mysql> SELECT MICROSECOND('12:00:00.123456');
          -> 123456
  mysql> SELECT MICROSECOND('2019-12-31 23:59:59.000010');
          -> 10
  ```

* `MINUTE(time)`

  Retorna o minuto para *`time`*, no intervalo de `0` a `59`.

  ```sql
  mysql> SELECT MINUTE('2008-02-03 10:05:03');
          -> 5
  ```

* `MONTH(date)`

  Retorna o mês para *`date`*, no intervalo de `1` a `12` para Janeiro a Dezembro, ou `0` para datas como `'0000-00-00'` ou `'2008-00-00'` que têm uma parte do mês zero.

  ```sql
  mysql> SELECT MONTH('2008-02-03');
          -> 2
  ```

* `MONTHNAME(date)`

  Retorna o nome completo do mês para *`date`*. O idioma usado para o nome é controlado pelo valor da variável de sistema `lc_time_names` (Seção 10.16, “Suporte a Localização do Servidor MySQL”).

  ```sql
  mysql> SELECT MONTHNAME('2008-02-03');
          -> 'February'
  ```

* `NOW([fsp])`

  Retorna a DATE e TIME atuais como um valor no formato `'YYYY-MM-DD hh:mm:ss'` ou *`YYYYMMDDhhmmss`*, dependendo se a função é usada em um contexto de string ou numérico. O valor é expresso no Time Zone da sessão.

  Se o argumento *`fsp`* for fornecido para especificar uma precisão de segundos fracionários de 0 a 6, o valor de retorno incluirá uma parte de segundos fracionários com essa quantidade de dígitos.

  ```sql
  mysql> SELECT NOW();
          -> '2007-12-15 23:50:26'
  mysql> SELECT NOW() + 0;
          -> 20071215235026.000000
  ```

  `NOW()` retorna uma TIME constante que indica o momento em que a instrução começou a ser executada. (Dentro de uma stored function ou trigger, `NOW()` retorna o momento em que a função ou instrução de disparo começou a ser executada.) Isso difere do comportamento de `SYSDATE()`, que retorna a hora exata em que é executada.

  ```sql
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

  Além disso, a instrução `SET TIMESTAMP` afeta o valor retornado por `NOW()`, mas não por `SYSDATE()`. Isso significa que as configurações de timestamp no binary log não têm efeito nas invocações de `SYSDATE()`. Definir o timestamp para um valor diferente de zero faz com que cada invocação subsequente de `NOW()` retorne esse valor. Definir o timestamp para zero cancela esse efeito, de modo que `NOW()` mais uma vez retorna a DATE e TIME atuais.

  Consulte a descrição de `SYSDATE()` para obter informações adicionais sobre as diferenças entre as duas funções.

* `PERIOD_ADD(P,N)`

  Adiciona *`N`* meses ao período *`P`* (no formato *`YYMM`* ou *`YYYYMM`*). Retorna um valor no formato *`YYYYMM`*.

  Nota

  O argumento de período *`P`* *não* é um valor DATE.

  ```sql
  mysql> SELECT PERIOD_ADD(200801,2);
          -> 200803
  ```

* `PERIOD_DIFF(P1,P2)`

  Retorna o número de meses entre os períodos *`P1`* e *`P2`*. *`P1`* e *`P2`* devem estar no formato *`YYMM`* ou *`YYYYMM`*. Observe que os argumentos de período *`P1`* e *`P2`* *não* são valores DATE.

  ```sql
  mysql> SELECT PERIOD_DIFF(200802,200703);
          -> 11
  ```

* `QUARTER(date)`

  Retorna o trimestre do ano para *`date`*, no intervalo de `1` a `4`.

  ```sql
  mysql> SELECT QUARTER('2008-04-01');
          -> 2
  ```

* `SECOND(time)`

  Retorna o segundo para *`time`*, no intervalo de `0` a `59`.

  ```sql
  mysql> SELECT SECOND('10:05:03');
          -> 3
  ```

* `SEC_TO_TIME(seconds)`

  Retorna o argumento *`seconds`*, convertido para horas, minutos e segundos, como um valor `TIME`. O intervalo do resultado é limitado ao do tipo de dado `TIME`. Um warning ocorre se o argumento corresponder a um valor fora desse intervalo.

  ```sql
  mysql> SELECT SEC_TO_TIME(2378);
          -> '00:39:38'
  mysql> SELECT SEC_TO_TIME(2378) + 0;
          -> 3938
  ```

* `STR_TO_DATE(str,format)`

  Esta é a função inversa de `DATE_FORMAT()`. Ela aceita uma string *`str`* e uma string de formato *`format`*. `STR_TO_DATE()` retorna um valor `DATETIME` se a string de formato contiver partes DATE e TIME, ou um valor `DATE` ou `TIME` se a string contiver apenas partes DATE ou TIME. Se *`str`* ou *`format`* for `NULL`, a função retorna `NULL`. Se o valor DATE, TIME ou DATETIME extraído de *`str`* não puder ser analisado de acordo com as regras seguidas pelo servidor, `STR_TO_DATE()` retorna `NULL` e produz um warning.

  O servidor escaneia *`str`* tentando fazer a correspondência com *`format`*. A string de formato pode conter caracteres literais e especificadores de formato começando com `%`. Caracteres literais em *`format`* devem corresponder literalmente em *`str`*. Especificadores de formato em *`format`* devem corresponder a uma parte DATE ou TIME em *`str`*. Para os especificadores que podem ser usados em *`format`*, consulte a descrição da função `DATE_FORMAT()`.

  ```sql
  mysql> SELECT STR_TO_DATE('01,5,2013','%d,%m,%Y');
          -> '2013-05-01'
  mysql> SELECT STR_TO_DATE('May 1, 2013','%M %d,%Y');
          -> '2013-05-01'
  ```

  A varredura começa no início de *`str`* e falha se *`format`* não for encontrado. Caracteres extras no final de *`str`* são ignorados.

  ```sql
  mysql> SELECT STR_TO_DATE('a09:30:17','a%h:%i:%s');
          -> '09:30:17'
  mysql> SELECT STR_TO_DATE('a09:30:17','%h:%i:%s');
          -> NULL
  mysql> SELECT STR_TO_DATE('09:30:17a','%h:%i:%s');
          -> '09:30:17'
  ```

  Partes DATE ou TIME não especificadas têm um valor de 0, portanto, valores incompletamente especificados em *`str`* produzem um resultado com algumas ou todas as partes definidas como 0:

  ```sql
  mysql> SELECT STR_TO_DATE('abc','abc');
          -> '0000-00-00'
  mysql> SELECT STR_TO_DATE('9','%m');
          -> '0000-09-00'
  mysql> SELECT STR_TO_DATE('9','%s');
          -> '00:00:09'
  ```

  A verificação de intervalo nas partes dos valores DATE é conforme descrito na Seção 11.2.2, “Os Tipos DATE, DATETIME e TIMESTAMP”. Isso significa, por exemplo, que datas "zero" ou datas com valores de parte 0 são permitidas, a menos que o SQL mode esteja configurado para não permitir tais valores.

  ```sql
  mysql> SELECT STR_TO_DATE('00/00/0000', '%m/%d/%Y');
          -> '0000-00-00'
  mysql> SELECT STR_TO_DATE('04/31/2004', '%m/%d/%Y');
          -> '2004-04-31'
  ```

  Se o SQL mode `NO_ZERO_DATE` estiver habilitado, datas zero não são permitidas. Nesse caso, `STR_TO_DATE()` retorna `NULL` e gera um warning:

  ```sql
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

  Antes do MySQL 5.7.44, era possível passar uma string de DATE inválida, como `'2021-11-31'`, para esta função. No MySQL 5.7.44 e posterior, `STR_TO_DATE()` realiza uma verificação de intervalo completa e levanta um erro se a DATE após a conversão for inválida.

  Nota

  Você não pode usar o formato `"%X%V"` para converter uma string de ano-semana em uma DATE, porque a combinação de ano e semana não identifica unicamente um ano e mês se a semana cruzar um limite de mês. Para converter um ano-semana em uma DATE, você também deve especificar o dia da semana:

  ```sql
  mysql> SELECT STR_TO_DATE('200442 Monday', '%X%V %W');
          -> '2004-10-18'
  ```

  Você também deve estar ciente de que, para DATEs e as porções de DATE de valores DATETIME, `STR_TO_DATE()` verifica (apenas) a validade dos valores individuais de ano, mês e dia do mês. Mais precisamente, isso significa que o ano é verificado para garantir que esteja no intervalo de 0 a 9999, o mês é verificado para garantir que esteja no intervalo de 1 a 12, e o dia do mês é verificado para garantir que esteja no intervalo de 1 a 31, mas o servidor não verifica os valores em combinação. Por exemplo, `SELECT STR_TO_DATE('23-2-31', '%Y-%m-%d')` retorna `2023-02-31`. Habilitar ou desabilitar o SQL mode do servidor `ALLOW_INVALID_DATES` não tem efeito sobre este comportamento. Consulte a Seção 11.2.2, “Os Tipos DATE, DATETIME e TIMESTAMP”, para obter mais informações.

* `SUBDATE(date,INTERVAL expr unit)`, `SUBDATE(expr,days)`

  Quando invocada com a forma `INTERVAL` do segundo argumento, `SUBDATE()` é um sinônimo para `DATE_SUB()`. Para obter informações sobre o argumento `INTERVAL` *`unit`*, consulte a discussão para `DATE_ADD()`.

  ```sql
  mysql> SELECT DATE_SUB('2008-01-02', INTERVAL 31 DAY);
          -> '2007-12-02'
  mysql> SELECT SUBDATE('2008-01-02', INTERVAL 31 DAY);
          -> '2007-12-02'
  ```

  A segunda forma permite o uso de um valor inteiro para *`days`*. Nesses casos, ele é interpretado como o número de dias a ser subtraído da expressão DATE ou DATETIME *`expr`*.

  ```sql
  mysql> SELECT SUBDATE('2008-01-02 12:00:00', 31);
          -> '2007-12-02 12:00:00'
  ```

* `SUBTIME(expr1,expr2)`

  `SUBTIME()` retorna *`expr1`* − *`expr2`* expresso como um valor no mesmo formato que *`expr1`*. *`expr1`* é uma expressão TIME ou DATETIME, e *`expr2`* é uma expressão TIME.

  ```sql
  mysql> SELECT SUBTIME('2007-12-31 23:59:59.999999','1 1:1:1.000002');
          -> '2007-12-30 22:58:58.999997'
  mysql> SELECT SUBTIME('01:00:00.999999', '02:00:00.999998');
          -> '-00:59:59.999999'
  ```

* `SYSDATE([fsp])`

  Retorna a DATE e TIME atuais como um valor no formato `'YYYY-MM-DD hh:mm:ss'` ou *`YYYYMMDDhhmmss`*, dependendo se a função é usada em um contexto de string ou numérico.

  Se o argumento *`fsp`* for fornecido para especificar uma precisão de segundos fracionários de 0 a 6, o valor de retorno incluirá uma parte de segundos fracionários com essa quantidade de dígitos.

  `SYSDATE()` retorna a hora em que é executada. Isso difere do comportamento de `NOW()`, que retorna uma TIME constante que indica o momento em que a instrução começou a ser executada. (Dentro de uma stored function ou trigger, `NOW()` retorna o momento em que a função ou instrução de disparo começou a ser executada.)

  ```sql
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

  Além disso, a instrução `SET TIMESTAMP` afeta o valor retornado por `NOW()`, mas não por `SYSDATE()`. Isso significa que as configurações de timestamp no binary log não têm efeito nas invocações de `SYSDATE()`.

  Como `SYSDATE()` pode retornar valores diferentes mesmo dentro da mesma instrução e não é afetada por `SET TIMESTAMP`, ela é não determinística e, portanto, insegura para replicação se for usado o log binário baseado em instrução (statement-based binary logging). Se isso for um problema, você pode usar o log baseado em linha (row-based logging).

  Alternativamente, você pode usar a opção `--sysdate-is-now` para fazer com que `SYSDATE()` seja um alias para `NOW()`. Isso funciona se a opção for usada tanto no source quanto na replica.

  A natureza não determinística de `SYSDATE()` também significa que Indexs não podem ser usados para avaliar expressões que se referem a ela.

* `TIME(expr)`

  Extrai a parte TIME da expressão TIME ou DATETIME *`expr`* e a retorna como uma string.

  Esta função é insegura para replicação baseada em instrução. Um warning é registrado se você usar esta função quando `binlog_format` estiver definido como `STATEMENT`.

  ```sql
  mysql> SELECT TIME('2003-12-31 01:02:03');
          -> '01:02:03'
  mysql> SELECT TIME('2003-12-31 01:02:03.000123');
          -> '01:02:03.000123'
  ```

* `TIMEDIFF(expr1,expr2)`

  `TIMEDIFF()` retorna *`expr1`* − *`expr2`* expresso como um valor TIME. *`expr1`* e *`expr2`* são strings que são convertidas em expressões `TIME` ou `DATETIME`; elas devem ser do mesmo tipo após a conversão.

  O resultado retornado por `TIMEDIFF()` é limitado ao intervalo permitido para valores `TIME`. Alternativamente, você pode usar qualquer uma das funções `TIMESTAMPDIFF()` e `UNIX_TIMESTAMP()`, ambas retornam inteiros.

  ```sql
  mysql> SELECT TIMEDIFF('2000:01:01 00:00:00',
      ->                 '2000:01:01 00:00:00.000001');
          -> '-00:00:00.000001'
  mysql> SELECT TIMEDIFF('2008-12-31 23:59:59.000001',
      ->                 '2008-12-30 01:01:01.000002');
          -> '46:58:57.999999'
  ```

* `TIMESTAMP(expr)`, `TIMESTAMP(expr1,expr2)`

  Com um único argumento, esta função retorna a expressão DATE ou DATETIME *`expr`* como um valor DATETIME. Com dois argumentos, ela adiciona a expressão TIME *`expr2`* à expressão DATE ou DATETIME *`expr1`* e retorna o resultado como um valor DATETIME.

  ```sql
  mysql> SELECT TIMESTAMP('2003-12-31');
          -> '2003-12-31 00:00:00'
  mysql> SELECT TIMESTAMP('2003-12-31 12:00:00','12:00:00');
          -> '2004-01-01 00:00:00'
  ```

* `TIMESTAMPADD(unit,interval,datetime_expr)`

  Adiciona a expressão inteira *`interval`* à expressão DATE ou DATETIME *`datetime_expr`*. A unit para *`interval`* é dada pelo argumento *`unit`*, que deve ser um dos seguintes valores: `MICROSECOND` (microssegundos), `SECOND`, `MINUTE`, `HOUR`, `DAY`, `WEEK`, `MONTH`, `QUARTER` ou `YEAR`.

  O valor *`unit`* pode ser especificado usando uma das palavras-chave conforme mostrado, ou com um prefixo de `SQL_TSI_`. Por exemplo, `DAY` e `SQL_TSI_DAY` são ambos válidos.

  ```sql
  mysql> SELECT TIMESTAMPADD(MINUTE,1,'2003-01-02');
          -> '2003-01-02 00:01:00'
  mysql> SELECT TIMESTAMPADD(WEEK,1,'2003-01-02');
          -> '2003-01-09'
  ```

  Ao adicionar um INTERVAL `MONTH` a um valor `DATE` ou `DATETIME`, e a DATE resultante incluir um dia que não existe no mês fornecido, o dia é ajustado para o último dia do mês, conforme mostrado aqui:

  ```sql
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

  Retorna *`datetime_expr2`* − *`datetime_expr1`*, onde *`datetime_expr1`* e *`datetime_expr2`* são expressões DATE ou DATETIME. Uma expressão pode ser uma DATE e a outra um DATETIME; um valor DATE é tratado como um DATETIME com a parte TIME `'00:00:00'` quando necessário. A unit para o resultado (um inteiro) é dada pelo argumento *`unit`*. Os valores válidos para *`unit`* são os mesmos listados na descrição da função `TIMESTAMPADD()`.

  ```sql
  mysql> SELECT TIMESTAMPDIFF(MONTH,'2003-02-01','2003-05-01');
          -> 3
  mysql> SELECT TIMESTAMPDIFF(YEAR,'2002-05-01','2001-01-01');
          -> -1
  mysql> SELECT TIMESTAMPDIFF(MINUTE,'2003-02-01','2003-05-01 12:05:55');
          -> 128885
  ```

  Nota

  A ordem dos argumentos DATE ou DATETIME para esta função é o oposto da usada com a função `TIMESTAMP()` quando invocada com 2 argumentos.

* `TIME_FORMAT(time,format)`

  É usada como a função `DATE_FORMAT()`, mas a string *`format`* pode conter especificadores de formato apenas para horas, minutos, segundos e microssegundos. Outros especificadores produzem um valor `NULL` ou `0`.

  Se o valor *`time`* contiver uma parte de hora que seja maior que `23`, os especificadores de formato de hora `%H` e `%k` produzirão um valor maior que o intervalo usual de `0..23`. Os outros especificadores de formato de hora produzirão o valor da hora módulo 12.

  ```sql
  mysql> SELECT TIME_FORMAT('100:00:00', '%H %k %h %I %l');
          -> '100 100 04 04 4'
  ```

* `TIME_TO_SEC(time)`

  Retorna o argumento *`time`*, convertido para segundos.

  ```sql
  mysql> SELECT TIME_TO_SEC('22:23:00');
          -> 80580
  mysql> SELECT TIME_TO_SEC('00:39:38');
          -> 2378
  ```

* `TO_DAYS(date)`

  Dada uma DATE *`date`*, retorna um número de dias (o número de dias desde o ano 0).

  ```sql
  mysql> SELECT TO_DAYS(950501);
          -> 728779
  mysql> SELECT TO_DAYS('2007-10-07');
          -> 733321
  ```

  `TO_DAYS()` não se destina ao uso com valores que precedem o advento do calendário Gregoriano (1582), pois não leva em consideração os dias que foram perdidos quando o calendário foi alterado. Para datas anteriores a 1582 (e possivelmente um ano posterior em outras localidades), os resultados desta função não são confiáveis. Consulte a Seção 11.2.8, “Qual Calendário é Usado pelo MySQL?”, para obter detalhes.

  Lembre-se que o MySQL converte valores de ano de dois dígitos em DATEs para o formato de quatro dígitos usando as regras na Seção 11.2, “Tipos de Dados de Data e Hora”. Por exemplo, `'2008-10-07'` e `'08-10-07'` são vistos como DATEs idênticas:

  ```sql
  mysql> SELECT TO_DAYS('2008-10-07'), TO_DAYS('08-10-07');
          -> 733687, 733687
  ```

  No MySQL, a DATE zero é definida como `'0000-00-00'`, embora esta própria DATE seja considerada inválida. Isso significa que, para `'0000-00-00'` e `'0000-01-01'`, `TO_DAYS()` retorna os valores mostrados aqui:

  ```sql
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

  Isso é verdadeiro independentemente de o SQL mode do servidor `ALLOW_INVALID_DATES` estar ou não habilitado.

* `TO_SECONDS(expr)`

  Dada uma DATE ou DATETIME *`expr`*, retorna o número de segundos desde o ano 0. Se *`expr`* não for um valor DATE ou DATETIME válido, retorna `NULL`.

  ```sql
  mysql> SELECT TO_SECONDS(950501);
          -> 62966505600
  mysql> SELECT TO_SECONDS('2009-11-29');
          -> 63426672000
  mysql> SELECT TO_SECONDS('2009-11-29 13:43:32');
          -> 63426721412
  mysql> SELECT TO_SECONDS( NOW() );
          -> 63426721458
  ```

  Assim como `TO_DAYS()`, `TO_SECONDS()` não se destina ao uso com valores que precedem o advento do calendário Gregoriano (1582), pois não leva em consideração os dias que foram perdidos quando o calendário foi alterado. Para datas anteriores a 1582 (e possivelmente um ano posterior em outras localidades), os resultados desta função não são confiáveis. Consulte a Seção 11.2.8, “Qual Calendário é Usado pelo MySQL?”, para obter detalhes.

  Assim como `TO_DAYS()`, `TO_SECONDS()` converte valores de ano de dois dígitos em DATEs para o formato de quatro dígitos usando as regras na Seção 11.2, “Tipos de Dados de Data e Hora”.

  No MySQL, a DATE zero é definida como `'0000-00-00'`, embora esta própria DATE seja considerada inválida. Isso significa que, para `'0000-00-00'` e `'0000-01-01'`, `TO_SECONDS()` retorna os valores mostrados aqui:

  ```sql
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

  Isso é verdadeiro independentemente de o SQL mode do servidor `ALLOW_INVALID_DATES` estar ou não habilitado.

* `UNIX_TIMESTAMP([date])`

  Se `UNIX_TIMESTAMP()` for chamada sem o argumento *`date`*, ela retorna um Unix timestamp representando segundos desde `'1970-01-01 00:00:00'` UTC.

  Se `UNIX_TIMESTAMP()` for chamada com um argumento *`date`*, ela retorna o valor do argumento como segundos desde `'1970-01-01 00:00:00'` UTC. O servidor interpreta *`date`* como um valor no Time Zone da sessão e o converte para um valor interno de Unix timestamp em UTC. (Clientes podem definir o Time Zone da sessão conforme descrito na Seção 5.1.13, “Suporte a Time Zone do Servidor MySQL”.) O argumento *`date`* pode ser uma string `DATE`, `DATETIME` ou `TIMESTAMP`, ou um número no formato *`YYMMDD`*, *`YYMMDDhhmmss`*, *`YYYYMMDD`* ou *`YYYYMMDDhhmmss`*. Se o argumento incluir uma parte TIME, ele pode opcionalmente incluir uma parte de segundos fracionários.

  O valor de retorno é um inteiro se nenhum argumento for fornecido ou se o argumento não incluir uma parte de segundos fracionários, ou `DECIMAL` se um argumento for fornecido que inclua uma parte de segundos fracionários.

  Quando o argumento *`date`* é uma coluna `TIMESTAMP`, `UNIX_TIMESTAMP()` retorna o valor de timestamp interno diretamente, sem conversão implícita de “string para Unix timestamp”.

  O intervalo válido de valores de argumento é o mesmo para o tipo de dado `TIMESTAMP`: `'1970-01-01 00:00:01.000000'` UTC a `'2038-01-19 03:14:07.999999'` UTC. Se você passar uma DATE fora do intervalo para `UNIX_TIMESTAMP()`, ele retorna `0`.

  ```sql
  mysql> SELECT UNIX_TIMESTAMP();
          -> 1447431666
  mysql> SELECT UNIX_TIMESTAMP('2015-11-13 10:20:19');
          -> 1447431619
  mysql> SELECT UNIX_TIMESTAMP('2015-11-13 10:20:19.012');
          -> 1447431619.012
  ```

  Se você usar `UNIX_TIMESTAMP()` e `FROM_UNIXTIME()` para converter entre valores em um Time Zone não-UTC e valores Unix timestamp, a conversão é com perda (lossy) porque o mapeamento não é um-para-um em ambas as direções. Por exemplo, devido às convenções para mudanças de Time Zone local, como Horário de Verão (DST), é possível que `UNIX_TIMESTAMP()` mapeie dois valores que são distintos em um Time Zone não-UTC para o mesmo valor Unix timestamp. `FROM_UNIXTIME()` mapeia esse valor de volta para apenas um dos valores originais. Aqui está um exemplo, usando valores que são distintos no Time Zone `MET`:

  ```sql
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

  Para usar Time Zones nomeados, como `'MET'` ou `'Europe/Amsterdam'`, as tabelas de Time Zone devem estar configuradas corretamente. Para instruções, consulte a Seção 5.1.13, “Suporte a Time Zone do Servidor MySQL”.

  Se você deseja subtrair colunas `UNIX_TIMESTAMP()`, talvez queira convertê-las (cast) para inteiros com sinal. Consulte a Seção 12.10, “Funções e Operadores de Cast”.

* `UTC_DATE`, `UTC_DATE()`

  Retorna a DATE UTC atual como um valor no formato `'YYYY-MM-DD'` ou *`YYYYMMDD`*, dependendo se a função é usada em um contexto de string ou numérico.

  ```sql
  mysql> SELECT UTC_DATE(), UTC_DATE() + 0;
          -> '2003-08-14', 20030814
  ```

* `UTC_TIME`, `UTC_TIME([fsp])`

  Retorna a TIME UTC atual como um valor no formato *`'hh:mm:ss'`* ou *`hhmmss`*, dependendo se a função é usada em um contexto de string ou numérico.

  Se o argumento *`fsp`* for fornecido para especificar uma precisão de segundos fracionários de 0 a 6, o valor de retorno incluirá uma parte de segundos fracionários com essa quantidade de dígitos.

  ```sql
  mysql> SELECT UTC_TIME(), UTC_TIME() + 0;
          -> '18:07:53', 180753.000000
  ```

* `UTC_TIMESTAMP`, `UTC_TIMESTAMP([fsp])`

  Retorna a DATE e TIME UTC atuais como um valor no formato `'YYYY-MM-DD hh:mm:ss'` ou *`YYYYMMDDhhmmss`*, dependendo se a função é usada em um contexto de string ou numérico.

  Se o argumento *`fsp`* for fornecido para especificar uma precisão de segundos fracionários de 0 a 6, o valor de retorno incluirá uma parte de segundos fracionários com essa quantidade de dígitos.

  ```sql
  mysql> SELECT UTC_TIMESTAMP(), UTC_TIMESTAMP() + 0;
          -> '2003-08-14 18:08:04', 20030814180804.000000
  ```

* `WEEK(date[,mode])`

  Esta função retorna o número da semana para *`date`*. A forma de dois argumentos de `WEEK()` permite que você especifique se a semana começa no Domingo ou Segunda-feira e se o valor de retorno deve estar no intervalo de `0` a `53` ou de `1` a `53`. Se o argumento *`mode`* for omitido, o valor da variável de sistema `default_week_format` será usado. Consulte a Seção 5.1.7, “Variáveis de Sistema do Servidor”.

  A tabela a seguir descreve como o argumento *`mode`* funciona.

  <table summary="Como o argumento mode da função WEEK funciona. Para cada valor de modo, a tabela lista o primeiro dia da semana, o intervalo e uma descrição da semana 1."><col style="width: 10%"/><col style="width: 20%"/><col style="width: 20%"/><col style="width: 50%"/><thead><tr> <th>Modo</th> <th>Primeiro dia da semana</th> <th>Intervalo</th> <th>A Semana 1 é a primeira semana...</th> </tr></thead><tbody><tr> <th>0</th> <td>Domingo</td> <td>0-53</td> <td>com um Domingo neste ano</td> </tr><tr> <th>1</th> <td>Segunda-feira</td> <td>0-53</td> <td>com 4 ou mais dias neste ano</td> </tr><tr> <th>2</th> <td>Domingo</td> <td>1-53</td> <td>com um Domingo neste ano</td> </tr><tr> <th>3</th> <td>Segunda-feira</td> <td>1-53</td> <td>com 4 ou mais dias neste ano</td> </tr><tr> <th>4</th> <td>Domingo</td> <td>0-53</td> <td>com 4 ou mais dias neste ano</td> </tr><tr> <th>5</th> <td>Segunda-feira</td> <td>0-53</td> <td>com uma Segunda-feira neste ano</td> </tr><tr> <th>6</th> <td>Domingo</td> <td>1-53</td> <td>com 4 ou mais dias neste ano</td> </tr><tr> <th>7</th> <td>Segunda-feira</td> <td>1-53</td> <td>com uma Segunda-feira neste ano</td> </tr></tbody></table>

  Para valores *`mode`* com o significado de "com 4 ou mais dias neste ano", as semanas são numeradas de acordo com a ISO 8601:1988:

  + Se a semana contendo 1º de Janeiro tiver 4 ou mais dias no novo ano, ela é a Semana 1.

  + Caso contrário, é a última semana do ano anterior, e a próxima semana é a Semana 1.

  ```sql
  mysql> SELECT WEEK('2008-02-20');
          -> 7
  mysql> SELECT WEEK('2008-02-20',0);
          -> 7
  mysql> SELECT WEEK('2008-02-20',1);
          -> 8
  mysql> SELECT WEEK('2008-12-31',1);
          -> 53
  ```

  Se uma DATE cair na última semana do ano anterior, o MySQL retorna `0` se você não usar `2`, `3`, `6` ou `7` como o argumento *`mode`* opcional:

  ```sql
  mysql> SELECT YEAR('2000-01-01'), WEEK('2000-01-01',0);
          -> 2000, 0
  ```

  Alguém poderia argumentar que `WEEK()` deveria retornar `52` porque a DATE fornecida realmente ocorre na 52ª semana de 1999. `WEEK()` retorna `0` em vez disso, para que o valor de retorno seja "o número da semana no ano fornecido". Isso torna o uso da função `WEEK()` confiável quando combinada com outras funções que extraem uma parte da DATE.

  Se você preferir um resultado avaliado em relação ao ano que contém o primeiro dia da semana para a DATE fornecida, use `0`, `2`, `5` ou `7` como o argumento *`mode`* opcional.

  ```sql
  mysql> SELECT WEEK('2000-01-01',2);
          -> 52
  ```

  Alternativamente, use a função `YEARWEEK()`:

  ```sql
  mysql> SELECT YEARWEEK('2000-01-01');
          -> 199952
  mysql> SELECT MID(YEARWEEK('2000-01-01'),5,2);
          -> '52'
  ```

* `WEEKDAY(date)`

  Retorna o índice do dia da semana para *`date`* (`0` = Segunda-feira, `1` = Terça-feira, … `6` = Domingo).

  ```sql
  mysql> SELECT WEEKDAY('2008-02-03 22:23:00');
          -> 6
  mysql> SELECT WEEKDAY('2007-11-06');
          -> 1
  ```

* `WEEKOFYEAR(date)`

  Retorna a semana calendário da DATE como um número no intervalo de `1` a `53`. `WEEKOFYEAR()` é uma função de compatibilidade que é equivalente a `WEEK(date,3)`.

  ```sql
  mysql> SELECT WEEKOFYEAR('2008-02-20');
          -> 8
  ```

* `YEAR(date)`

  Retorna o ano para *`date`*, no intervalo de `1000` a `9999`, ou `0` para a DATE "zero".

  ```sql
  mysql> SELECT YEAR('1987-01-01');
          -> 1987
  ```

* `YEARWEEK(date)`, `YEARWEEK(date,mode)`

  Retorna ano e semana para uma DATE. O ano no resultado pode ser diferente do ano no argumento DATE para a primeira e a última semana do ano.

  O argumento *`mode`* funciona exatamente como o argumento *`mode`* para `WEEK()`. Para a sintaxe de argumento único, um valor *`mode`* de 0 é usado. Diferente de `WEEK()`, o valor de `default_week_format` não influencia `YEARWEEK()`.

  ```sql
  mysql> SELECT YEARWEEK('1987-01-01');
          -> 198652
  ```

  O número da semana é diferente do que a função `WEEK()` retornaria (`0`) para os argumentos opcionais `0` ou `1`, pois `WEEK()` retorna então a semana no contexto do ano fornecido.