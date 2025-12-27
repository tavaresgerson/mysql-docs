## 14.7 Funções de Data e Hora

Esta seção descreve as funções que podem ser usadas para manipular valores temporais. Consulte a Seção 13.2, “Tipos de Dados de Data e Hora”, para uma descrição da faixa de valores que cada tipo de data e hora possui e dos formatos válidos nos quais os valores podem ser especificados.

**Tabela 14.11 Funções de Data e Hora**

<table>
   <thead>
      <tr>
         <th>Nome</th>
         <th>Descrição</th>
      </tr>
   </thead>
   <tbody>
      <tr>
         <td><code>ADDDATE()</code></td>
         <td> Adicione valores de tempo (intervalos) a um valor de data </td>
      </tr>
      <tr>
         <td><code>ADDTIME()</code></td>
         <td> Adicione tempo </td>
      </tr>
      <tr>
         <td><code>CONVERT_TZ()</code></td>
         <td> Converte de uma zona horária para outra </td>
      </tr>
      <tr>
         <td><code>CURDATE()</code></td>
         <td> Retorna a data atual </td>
      </tr>
      <tr>
         <td><code>CURRENT_DATE()</code>, <code>CURRENT_DATE</code></td>
         <td> Sinônimos para CURDATE() </td>
      </tr>
      <tr>
         <td><code>CURRENT_TIME()</code>, <code>CURRENT_TIME</code></td>
         <td> Sinônimos para CURTIME() </td>
      </tr>
      <tr>
         <td><code>CURRENT_TIMESTAMP()</code>, <code>CURRENT_TIMESTAMP</code></td>
         <td> Sinônimos para NOW() </td>
      </tr>
      <tr>
         <td><code>CURTIME()</code></td>
         <td> Retorna a hora atual </td>
      </tr>
      <tr>
         <td><code>DATE()</code></td>
         <td> Extrai a parte da data de uma expressão de data ou datetime </td>
      </tr>
      <tr>
         <td><code>DATE_ADD()</code></td>
         <td> Adicione valores de tempo (intervalos) a um valor de data </td>
      </tr>
      <tr>
         <td><code>DATE_FORMAT()</code></td>
         <td> Formata a data conforme especificado </td>
      </tr>
      <tr>
         <td><code>DATE_SUB()</code></td>
         <td> Subtraia um valor de tempo (intervalo) de um valor de data </td>
      </tr>
      <tr>
         <td><code>DATEDIFF()</code></td>
         <td> Subtraia duas datas </td>
      </tr>
      <tr>
         <td><code>DAY()</code></td>
         <td> Símbolo para DAYOFMONTH() </td>
      </tr>
      <tr>
         <td><code>DAYNAME()</code></td>
         <td> Retorna o nome do dia da semana </td>
      </tr>
      <tr>
         <td><code>DAYOFMONTH()</code></td>
         <td> Retorna o dia do mês (0-31) </td>
      </tr>
      <tr>
         <td><code>DAYOFWEEK()</code></td>
         <td> Retorna o índice do dia da semana do argumento </td>
      </tr>
      <tr>
         <td><code>DAYOFYEAR()</code></td>
         <td> Retorna o dia do ano (1-366) </td>
      </tr>
      <tr>
         <td><code>EXTRACT()</code></td>
         <td> Extrai parte de uma data </td>
      </tr>
      <tr>
         <td><code>FROM_DAYS()</code></td>
         <td> Converte um número de dia em uma data </td>
      </tr>
      <tr>
         <td><code>FROM_UNIXTIME()</code></td>
         <td> Formata o timestamp Unix como uma data </td>
      </tr>
      <tr>
         <td><code>GET_FORMAT()</code></td>
         <td> Retorna uma string de formato de data </td>
      </tr>
      <tr>
         <td><code>HOUR()</code></td>
         <td> Extrai a parte da hora </td>
      </tr>
      <tr>
         <td><code>LAST_DAY</code></td>
         <td> Retorna o último dia do mês para o argumento </td>
      </tr>
      <tr>
         <td><code>LOCALTIME()</code>, <code>LOCALTIME</code></td>
         <td> Símbolo para NOW() </td>
      </tr>
      <tr>
         <td><code>LOCALTIMESTAMP</code>, <code>LOCALTIMESTAMP()</code></td>
         <td> Símbolo para NOW() </td>
      </tr>
      <tr>
         <td><code>MAKEDATE()</code></td>
         <td> Cria uma data a partir do ano e do dia do ano </td>
      </tr>
      <tr>
         <td><code>MAKETIME()</code></td>
         <td> Cria uma hora a partir da hora, minuto e segundo </td>
      </tr>
      <tr>
         <td><code>MICROSECOND()</code></td>
         <td> Retorna os microsegundos do argumento </td>
      </tr>
      <tr>
         <td><code>MINUTE()</code></td>
         <td> Retorna o minuto do argumento </td>
      </tr>
      <tr>
         <td><code>MONTH()</code></td>
         <td> Retorna o mês do argumento </td>
      </tr>
      <tr>
         <td><code>MONTHNAME()</code></td>
         <td> Retorna o nome do mês </td>
      </tr>
      <tr>
         <td><code>NOW()</code></td>
         <td> Retorna a data e a hora atuais </td>
      </tr>
      <tr>
         <td><code>PERIOD_ADD()</code></td>
         <td>

Aqui está um exemplo que usa funções de data. A seguinte consulta seleciona todas as linhas com um valor em `date_col` dentro dos últimos 30 dias:

```
mysql> SELECT something FROM tbl_name
    -> WHERE DATE_SUB(CURDATE(),INTERVAL 30 DAY) <= date_col;
```

A consulta também seleciona linhas com datas que estão no futuro.

Funções que esperam valores de data geralmente aceitam valores datetime e ignoram a parte de hora. Funções que esperam valores de hora geralmente aceitam valores datetime e ignoram a parte de data.

Funções que retornam a data ou hora atuais são avaliadas apenas uma vez por consulta no início da execução da consulta. Isso significa que múltiplas referências a uma função como `NOW()` dentro de uma única consulta sempre produzem o mesmo resultado. (Para nossos propósitos, uma única consulta também inclui uma chamada a um programa armazenado (rotina armazenada, gatilho ou evento) e todos os subprogramas chamados por esse programa.) Esse princípio também se aplica a `CURDATE()`, `CURTIME()`, `UTC_DATE()`, `UTC_TIME()`, `UTC_TIMESTAMP()` e a qualquer um de seus sinônimos.

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

* `ADDDATE(data, INTERVAL expr unit)`, `ADDDATE(data, dias)`

  Quando invocado com a forma `INTERVAL` do segundo argumento, `ADDDATE()` é sinônimo de `DATE_ADD()`. A função relacionada `SUBDATE()` é sinônimo de `DATE_SUB()`. Para informações sobre o argumento `INTERVAL *``unit`*, consulte Intervalos Temporais.

  ```
  mysql> SELECT DATE_ADD('2008-01-02', INTERVAL 31 DAY);
          -> '2008-02-02'
  mysql> SELECT ADDDATE('2008-01-02', INTERVAL 31 DAY);
          -> '2008-02-02'
  ```

  Quando invocado com a forma *`dias`* do segundo argumento, o MySQL o trata como um número inteiro de dias a ser adicionado a *`expr`*.

  ```
  mysql> SELECT ADDDATE('2008-01-02', 31);
          -> '2008-02-02'
  ```

  Esta função retorna `NULL` se *`data`* ou *`dias`* for `NULL`.
*  `ADDTIME(expr1, expr2)`

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
*  `CONVERT_TZ(dt, from_tz, to_tz)`
*  `DATE_FORMAT(dt, 'YYYY-MM-DD')`

  Este é um exemplo de como converter uma data entre diferentes formatos de data e hora.

`CONVERT_TZ()` converte um valor de data e hora `dt` do fuso horário especificado por `from_tz` para o fuso horário especificado por `to_tz` e retorna o valor resultante. Os fusos horários são especificados conforme descrito na Seção 7.1.15, “Suporte de Fuso Horário do Servidor MySQL”. Esta função retorna `NULL` se qualquer um dos argumentos for inválido ou se algum deles for `NULL`.

Em plataformas de 32 bits, o intervalo de valores suportado por esta função é o mesmo que para o tipo `TIMESTAMP` (consulte a Seção 13.2.1, “Sintaxe do Tipo de Dados de Data e Hora” para informações sobre o intervalo). Em plataformas de 64 bits, o valor máximo suportado é `'3001-01-18 23:59:59.999999'` UTC.

Independentemente da plataforma ou da versão do MySQL, se o valor sair do intervalo suportado durante a conversão de `from_tz` para UTC, nenhuma conversão ocorrerá.

```
  mysql> SELECT CONVERT_TZ('2004-01-01 12:00:00','GMT','MET');
          -> '2004-01-01 13:00:00'
  mysql> SELECT CONVERT_TZ('2004-01-01 12:00:00','+00:00','+10:00');
          -> '2004-01-01 22:00:00'
  ```

::: info Nota

Para usar fusos horários nomeados, como `'MET'` ou `'Europe/Amsterdam'`, as tabelas de fuso horário devem estar corretamente configuradas. Para instruções, consulte a Seção 7.1.15, “Suporte de Fuso Horário do Servidor MySQL”.


:::

Extrai a parte da data da expressão de data ou datetime *`expr`*. Retorna `NULL` se *`expr`* for `NULL`.

  ```
  mysql> SELECT CURDATE();
          -> '2008-06-13'
  mysql> SELECT CURDATE() + 0;
          -> 20080613
  ```
*  `DATEDIFF(expr1,expr2)`

  `DATEDIFF()` retorna *`expr1`* − *`expr2`* expresso como um valor em dias de uma data para a outra. *`expr1`* e *`expr2`* são expressões de data ou data e hora. Apenas as partes da data dos valores são usadas no cálculo.

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

  Esta função retorna `NULL` se *`expr1`* ou *`expr2`* for `NULL`.
* `DATE_ADD(data,INTERVAL expr unidade)` e `DATE_SUB(data,INTERVAL expr unidade)`

  Estas funções realizam cálculos de data. O argumento *`data`* especifica o valor de data ou datetime inicial. *`expr`* é uma expressão que especifica o valor do intervalo a ser adicionado ou subtraído da data inicial. *`expr`* é avaliado como uma string; pode começar com um `-` para intervalos negativos. *`unidade`* é uma palavra-chave que indica as unidades nas quais a expressão deve ser interpretada.

  Para mais informações sobre a sintaxe de intervalos temporais, incluindo uma lista completa dos especificadores de *`unidade`*, a forma esperada do argumento *`expr`* para cada valor de *`unidade`* e as regras para a interpretação dos operandos em aritmética temporal, consulte Intervalos Temporais.

  O valor de retorno depende dos argumentos:

+ Se *`data`* for `NULL`, a função retorna `NULL`.
+ `DATE` se o argumento *`data`* for um valor `DATE` e seus cálculos envolverem apenas as partes `ANO`, `MÊS` e `DIA` (ou seja, sem partes de hora).
+ `TIME` se o argumento *`data`* for um valor `TIME` e os cálculos envolverem apenas as partes `HORAS`, `MINUTOS` e `SEGundos` (ou seja, sem partes de data).
+ `DATETIME` se o primeiro argumento for um valor `DATETIME` (ou `TIMESTAMP`), ou se o primeiro argumento for um `DATE` e o valor de *`unidade`* usar `HORAS`, `MINUTOS` ou `SEGundos`, ou se o primeiro argumento for do tipo `TIME` e o valor de *`unidade`* usar `ANO`, `MÊS` ou `DIA`.
+ Se o primeiro argumento for um parâmetro dinâmico (por exemplo, de uma instrução preparada), seu tipo resolvido é `DATE` se o segundo argumento for um intervalo que contenha apenas combinações de valores `ANO`, `MÊS` ou `DIA`; caso contrário, seu tipo é `DATETIME`.
+ String caso contrário (tipo `VARCHAR`).

Para garantir que o resultado seja `DATETIME`, você pode usar `CAST()` para converter o primeiro argumento para `DATETIME`.

```
  mysql> SELECT DATE('2003-12-31 01:02:03');
          -> '2003-12-31'
  ```

Ao adicionar um intervalo `MÊS` a um valor `DATE` ou `DATETIME`, e a data resultante incluir um dia que não existe no mês dado, o dia é ajustado para o último dia do mês, como mostrado aqui:

```
  mysql> SELECT DATEDIFF('2007-12-31 23:59:59','2007-12-30');
          -> 1
  mysql> SELECT DATEDIFF('2010-11-30 23:59:59','2010-12-31');
          -> -31
  ```
* `DATE_FORMAT(data, formato)`

Formata o valor de *`data`* de acordo com a string de *`formato`*. Se qualquer um dos argumentos for `NULL`, a função retorna `NULL`.

Os especificadores mostrados na tabela a seguir podem ser usados na string de *`formato`*. O caractere `%` é necessário antes dos caracteres de especificador de formato. Os especificadores se aplicam também a outras funções: `STR_TO_DATE()`, `TIME_FORMAT()`, `UNIX_TIMESTAMP()`.

<table><col style="width: 20%"/><col style="width: 70%"/><thead><tr> <th>Especificador</th> <th>Descrição</th> </tr></thead><tbody><tr> <td><code>%a</code></td> <td>Nome abreviado do dia da semana (<code>Sun</code>..<code>Sat</code>)</td> </tr><tr> <td><code>%b</code></td> <td>Nome abreviado do mês (<code>Jan</code>..<code>Dec</code>)</td> </tr><tr> <td><code>%c</code></td> <td>Mês, numérico (<code>0</code>..<code>12</code>)</td> </tr><tr> <td><code>%D</code></td> <td>Dia do mês com sufixo em inglês (<code>0th</code>, <code>1st</code>, <code>2nd</code>, <code>3rd</code>, ...)</td> </tr><tr> <td><code>%d</code></td> <td>Dia do mês, numérico (<code>00</code>..<code>31</code>)</td> </tr><tr> <td><code>%e</code></td> <td>Dia do mês, numérico (<code>0</code>..<code>31</code>)</td> </tr><tr> <td><code>%f</code></td> <td>Microsegundos (<code>000000</code>..<code>999999</code>)</td> </tr><tr> <td><code>%H</code></td> <td>Hora (<code>00</code>..<code>23</code>)</td> </tr><tr> <td><code>%h</code></td> <td>Hora (<code>01</code>..<code>12</code>)</td> </tr><tr> <td><code>%I</code></td> <td>Hora (<code>01</code>..<code>12</code>)</td> </tr><tr> <td><code>%i</code></td> <td>Minutos, numérico (<code>00</code>..<code>59</code>)</td> </tr><tr> <td><code>%j</code></td> <td>Dia do ano (<code>001</code>..<code>366</code>)</td> </tr><tr> <td><code>%k</code></td> <td>Hora (<code>0</code>..<code>23</code>)</td> </tr><tr> <td><code>%l</code></td> <td>Hora (<code>1</code>..<code>12</code>)</td> </tr><tr> <td><code>%M</code></td> <td>Nome do mês (<code>January</code>..<code>December</code>)</td> </tr><tr> <td><code>%m</code></td> <td>Mês, numérico (<code>00</code>..<code>12</code>)</td> </tr><tr> <td><code>%p</code></td> <td><code>AM</code> ou <code>PM</code></td> </tr><tr> <td><code>%r</code></td> <td>Hora, 12 horas (<em><code>hh:mm:ss</code></em> seguido por <code>AM</code> ou <code>PM</code>)</td> </tr><tr> <td><code>%S</code></td> <td>Segundos (<code>00</code>..<code>59</code>)</td> </tr><tr> <td><code>%s</code></td> <td>Segundos (<code>00</code>..<code>59</code>)</td> </tr><tr> <td><code>%T</code></td> <td>Hora, 24 horas (<em><code>hh:mm:ss</code></em>)</td> </tr><tr> <td><code>%U</code></td> <td>Semana (<code>00</code>..<code>53</code>), onde o domingo é o primeiro dia da semana; modo <code>WEEK()</code> 0</td> </tr><tr> <td><code>%u</code></td> <td>Semana (<code>00</code>..<code>53</code>), onde a segunda-feira é o primeiro dia da semana; modo <code>WEEK()</code> 1</td> </tr><tr> <td><code>%V</code></td> <td>Semana (<code>01</code>..<code>53</code>), onde o domingo é o primeiro dia da semana; modo <code>WEEK()</code> 2; usado com <code>%X</code></td> </tr><tr> <td><code>%v</code></td> <td>Semana (<code>01</code>..<code>53</code>), onde a segunda-feira é o primeiro dia da semana; modo <code>WEEK()</code> 3; usado com <code>%x</code></td> </tr><tr> <td><code>%W</code></td> <td>Nome do dia da semana (<code>Sunday</code>..<code>Saturday</code>)</td> </tr><tr> <td><code>%w</code></td> <td>Dia da semana (<code>0</code>=Domingo..<code>6</code>=Sábado)</td> </tr><tr> <td><code>%X</code></td> <td>Ano para a semana onde o domingo é o primeiro dia da semana, numérico, quatro dígitos; usado com <code>%V</code></td> </tr><tr> <td><code>%x</code></td> <td>Ano para a semana, onde a segunda-feira é o primeiro dia da semana, numérico, quatro dígitos; usado com <code>%v</code></td> </tr><tr> <td><code>%Y</code></td> <td>Ano, numérico, quatro dígitos</td> </tr><tr> <td><code>%y</code></td> <td>Ano, numérico (dois dígitos)</td> </tr><tr> <td><code>%%</code>

Os intervalos para os especificadores de mês e dia começam com zero devido ao fato de que o MySQL permite o armazenamento de datas incompletas, como `'2014-00-00'`.

A linguagem usada para os nomes e abreviações de dia e mês é controlada pelo valor da variável de sistema `lc_time_names` (seção 12.16, “Suporte de localização do servidor MySQL”).

Para os especificadores `%U`, `%u`, `%V` e `%v`, consulte a descrição da função `WEEK()` para obter informações sobre os valores de modo. O modo afeta como a numeração da semana ocorre.

`DATE_FORMAT()` retorna uma string com um conjunto de caracteres e uma collation definidos por `character_set_connection` e `collation_connection`, para que possa retornar nomes de mês e dia úteis contendo caracteres não ASCII.

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
* `DATE_SUB(date, INTERVAL expr unit)`

Consulte a descrição de `DATE_ADD()`.
*  `DAY(date)`

`DAY()` é um sinônimo de `DAYOFMONTH()`.
*  `DAYNAME(date)`

Retorna o nome do dia útil para *`date`*. A linguagem usada para o nome é controlada pelo valor da variável de sistema `lc_time_names` (consulte a seção 12.16, “Suporte de localização do servidor MySQL”). Retorna `NULL` se *`date`* for `NULL`.

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
*  `DAYOFMONTH(date)`

Retorna o dia do mês para *`date`*, no intervalo de `1` a `31`, ou `0` para datas como `'0000-00-00'` ou `'2008-00-00'` que têm uma parte de dia zero. Retorna `NULL` se *`date`* for `NULL`.

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
*  `DAYOFWEEK(date)`

Retorna o índice do dia útil para *`date`* (`1` = Domingo, `2` = Segunda-feira, …, `7` = Sábado). Esses valores de índice correspondem ao padrão ODBC. Retorna `NULL` se *`date`* for `NULL`.

```
  mysql> SELECT DAYNAME('2007-02-03');
          -> 'Saturday'
  ```
*  `DAYOFYEAR(date)`

Retorna o dia do ano para *`date`*, no intervalo de `1` a `366`. Retorna `NULL` se *`date`* for `NULL`.

```
  mysql> SELECT DAYOFMONTH('2007-02-03');
          -> 3
  ```
* `EXTRACT(unit FROM date)`


A função `EXTRACT()` usa os mesmos tipos de especificadores de *`unidade`* que `DATE_ADD()` ou `DATE_SUB()`, mas extrai partes da data em vez de realizar operações aritméticas com datas. Para informações sobre o argumento *`unidade`*, consulte Intervalos Temporais. Retorna `NULL` se *`date`* for `NULL`.

```
  mysql> SELECT DAYOFWEEK('2007-02-03');
          -> 7
  ```
*  `FROM_DAYS(N)`

  Dado um número de dia *`N`*, retorna um valor `DATE`. Retorna `NULL` se *`N`* for `NULL`.

  ```
  mysql> SELECT DAYOFYEAR('2007-02-03');
          -> 34
  ```

  Use `FROM_DAYS()` com cautela em datas antigas. Não é destinado para uso com valores que precedem o advento do calendário gregoriano (1582). Consulte a Seção 13.2.7, “Qual Calendário é Usado pelo MySQL?”.
*  `FROM_UNIXTIME(unix_timestamp[,format])`

  Retorna uma representação de *`unix_timestamp`* como um valor `DATETIME` ou string de caracteres. O valor retornado é expresso usando a zona horária da sessão. (Os clientes podem definir a zona horária da sessão conforme descrito na Seção 7.1.15, “Suporte à Zona Horária do Servidor MySQL.”). *`unix_timestamp`* é um valor de timestamp interno que representa segundos desde `'1970-01-01 00:00:00'` UTC, como produzido pela função `UNIX_TIMESTAMP()`.

  Se *`format`* for omitido, esta função retorna um valor `DATETIME`.

  Se *`unix_timestamp`* ou *`format`* for `NULL`, esta função retorna `NULL`.

  Se *`unix_timestamp`* for um inteiro, a precisão fracionária de segundos do `DATETIME` é zero. Quando *`unix_timestamp`* é um valor decimal, a precisão fracionária do `DATETIME` é a mesma que a precisão do valor decimal, até um máximo de 6. Quando *`unix_timestamp`* é um número de ponto flutuante, a precisão fracionária do `DATETIME` é 6.

  Em plataformas de 32 bits, o valor máximo útil para *`unix_timestamp`* é 2147483647.999999, o que retorna `'2038-01-19 03:14:07.999999'` UTC. Em plataformas de 64 bits, o máximo efetivo é 32536771199.999999, o que retorna `'3001-01-18 23:59:59.999999'` UTC. Independentemente da plataforma ou versão, um valor maior para *`unix_timestamp`* do que o máximo efetivo retorna `0`.

*`format`* é usado para formatar o resultado da mesma maneira que a string de formato usada para a função `DATE_FORMAT()`. Se *`format`* for fornecido, o valor retornado é um `VARCHAR`.

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

::: info Nota

Se você usar `UNIX_TIMESTAMP()` e `FROM_UNIXTIME()` para converter entre valores em um fuso horário não UTC e valores de timestamp Unix, a conversão é perda de dados porque a correspondência não é um para um em ambas as direções. Para detalhes, consulte a descrição da função `UNIX_TIMESTAMP()`.


:::
* `GET_FORMAT({DATE|TIME|DATETIME}, {'EUR'|'USA'|'JIS'|'ISO'|'INTERNAL'})`

Retorna uma string de formato. Esta função é útil em combinação com as funções `DATE_FORMAT()` e `STR_TO_DATE()`.

Se *`format`* for `NULL`, esta função retorna `NULL`.

Os valores possíveis para os primeiros e segundos argumentos resultam em várias strings de formato possíveis (para os especificadores usados, consulte a tabela na descrição da função `DATE_FORMAT()`). O formato ISO refere-se à ISO 9715, não à ISO 8601.

<table><col style="width: 60%"/><col style="width: 40%"/><thead><tr> <th>Chamada de Função</th> <th>Resultado</th> </tr></thead><tbody><tr> <td><code>GET_FORMAT(DATA, 'USA')</code></td> <td><code>'%m.%d.%Y'</code></td> </tr><tr> <td><code>GET_FORMAT(DATA, 'JIS')</code></td> <td><code>'%Y-%m-%d'</code></td> </tr><tr> <td><code>GET_FORMAT(DATA, 'ISO')</code></td> <td><code>'%Y-%m-%d'</code></td> </tr><tr> <td><code>GET_FORMAT(DATA, 'EUR')</code></td> <td><code>'%d.%m.%Y'</code></td> </tr><tr> <td><code>GET_FORMAT(DATA, 'INTERNO')</code></td> <td><code>'%Y%m%d'</code></td> </tr><tr> <td><code>GET_FORMAT(DATA_HORÁRIA, 'USA')</code></td> <td><code>'%Y-%m-%d %H.%i.%s'</code></td> </tr><tr> <td><code>GET_FORMAT(DATA_HORÁRIA, 'JIS')</code></td> <td><code>'%Y-%m-%d %H:%i:%s'</code></td> </tr><tr> <td><code>GET_FORMAT(DATA_HORÁRIA, 'ISO')</code></td> <td><code>'%Y-%m-%d %H:%i:%s'</code></td> </tr><tr> <td><code>GET_FORMAT(DATA_HORÁRIA, 'EUR')</code></td> <td><code>'%Y-%m-%d %H.%i.%s'</code></td> </tr><tr> <td><code>GET_FORMAT(DATA_HORÁRIA, 'INTERNO')</code></td> <td><code>'%Y%m%d%H%i%s'</code></td> </tr><tr> <td><code>HOUR(tempo)</code></td> <td>Retorna a hora para o *`tempo`*. O intervalo do valor de retorno é `0` a `23` para valores de hora do dia. No entanto, o intervalo dos valores de *`TIME` é muito maior, então `HOUR` pode retornar valores maiores que `23`. Retorna `NULL` se o *`tempo`* for `NULL`.</td> </tr></tbody></table>

  `TIMESTAMP` também pode ser usado como o primeiro argumento de `GET_FORMAT()`, nesse caso, a função retorna os mesmos valores que para `DATA_HORÁRIA`.

  ```
  mysql> SELECT FROM_DAYS(730669);
          -> '2000-07-03'
  ```

```
  mysql> SELECT FROM_UNIXTIME(1447430881);
          -> '2015-11-13 10:08:01'
  mysql> SELECT FROM_UNIXTIME(1447430881) + 0;
          -> 20151113100801
  mysql> SELECT FROM_UNIXTIME(1447430881,
      ->                      '%Y %D %M %h:%i:%s %x');
          -> '2015 13th November 10:08:01 2015'
  ```
*  `LAST_DAY(data)`

  Retorna o valor correspondente ao último dia do mês de uma data ou valor datetime. Retorna `NULL` se o argumento for inválido ou `NULL`.

  ```
  mysql> SELECT DATE_FORMAT('2003-10-03',GET_FORMAT(DATE,'EUR'));
          -> '03.10.2003'
  mysql> SELECT STR_TO_DATE('10.31.2003',GET_FORMAT(DATE,'USA'));
          -> '2003-10-31'
  ```
*  `LOCALTIME`, `LOCALTIME([fsp])`

   `LOCALTIME` e `LOCALTIME()` são sinônimos de `NOW()`.
*  `LOCALTIMESTAMP`, `LOCALTIMESTAMP([fsp])`

   `LOCALTIMESTAMP` e `LOCALTIMESTAMP()` são sinônimos de  `NOW()`.
*  `MAKEDATE(ano,dia_do_ano)`

  Retorna uma data, dados os valores de `ano` e `dia_do_ano`. *`dia_do_ano`* deve ser maior que 0 ou o resultado é `NULL`. O resultado também é `NULL` se qualquer um dos argumentos for `NULL`.

  ```
  mysql> SELECT HOUR('10:05:03');
          -> 10
  mysql> SELECT HOUR('272:59:59');
          -> 272
  ```
*  `MAKETIME(hora,minuto,segundo)`

  Retorna um valor de tempo calculado a partir dos argumentos *`hora`*, *`minuto`* e *`segundo`*. Retorna `NULL` se algum dos seus argumentos for `NULL`.

  O argumento *`segundo`* pode ter uma parte fracionária.

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
*  `MICROSECOND(expr)`

  Retorna os microsegundos a partir da expressão de tempo ou datetime *`expr`* como um número no intervalo de `0` a `999999`. Retorna `NULL` se *`expr`* for `NULL`.

  ```
  mysql> SELECT MAKEDATE(2011,31), MAKEDATE(2011,32);
          -> '2011-01-31', '2011-02-01'
  mysql> SELECT MAKEDATE(2011,365), MAKEDATE(2014,365);
          -> '2011-12-31', '2014-12-31'
  mysql> SELECT MAKEDATE(2011,0);
          -> NULL
  ```
*  `MINUTE(tempo)`

  Retorna o minuto para *`tempo`*, no intervalo de `0` a `59`, ou `NULL` se *`tempo`* for `NULL`.

  ```
  mysql> SELECT MAKETIME(12,15,30);
          -> '12:15:30'
  ```
*  `MONTH(data)`

  Retorna o mês de *`data`*, no intervalo de `1` a `12` para janeiro a dezembro, ou `0` para datas como `'0000-00-00'` ou `'2008-00-00'` que têm uma parte de mês zero. Retorna `NULL` se *`data`* for `NULL`.

  ```
  mysql> SELECT MICROSECOND('12:00:00.123456');
          -> 123456
  mysql> SELECT MICROSECOND('2019-12-31 23:59:59.000010');
          -> 10
  ```
*  `MONTHNAME(data)`

  Retorna o nome completo do mês de *`data`*. A linguagem usada para o nome é controlada pelo valor da variável de sistema `lc_time_names` ( Seção 12.16, “Suporte de Localização do Servidor MySQL”). Retorna `NULL` se *`data`* for `NULL`.

  ```
  mysql> SELECT MINUTE('2008-02-03 10:05:03');
          -> 5
  ```
*  `NOW([fsp])`

  Retorna a data e hora atuais como um valor no formato `'YYYY-MM-DD hh:mm:ss'` ou *`YYYYMMDDhhmmss`, dependendo se a função é usada em contexto de string ou numérico. O valor é expresso na zona horária da sessão.

Se o argumento *`fsp`* for fornecido para especificar uma precisão de segundos fracionários de 0 a 6, o valor de retorno inclui uma parte de segundos fracionários dessa quantidade de dígitos.

```
  mysql> SELECT MONTH('2008-02-03');
          -> 2
  ```

`NOW()` retorna um tempo constante que indica a hora em que a instrução começou a ser executada. (Dentro de uma função armazenada ou um gatilho, `NOW()` retorna a hora em que a função ou a instrução de gatilho começou a ser executada.) Isso difere do comportamento do `SYSDATE()`, que retorna o tempo exato em que ele é executado.

```
  mysql> SELECT MONTHNAME('2008-02-03');
          -> 'February'
  ```

Além disso, a instrução `SET TIMESTAMP` afeta o valor retornado por `NOW()` mas não por `SYSDATE()`. Isso significa que as configurações de data e hora no log binário não têm efeito nas invocações de  `SYSDATE()`. Definir o timestamp para um valor não nulo faz com que cada invocação subsequente de  `NOW()` retorne esse valor. Definir o timestamp para zero cancela esse efeito, de modo que `NOW()` novamente retorne a data e hora atuais.

Veja a descrição do `SYSDATE()` para obter informações adicionais sobre as diferenças entre as duas funções.
*  `PERIOD_ADD(P,N)`

  Aumenta *`N`* meses ao período *`P`* (no formato *`YYMM`* ou *`YYYYMM`*). Retorna um valor no formato *`YYYYMM`*.

  ::: info Nota

  O argumento de período *`P`* não é um valor de data.


  :::

  Esta função retorna `NULL` se *`P`* ou *`N`* for `NULL`.

  ```
  mysql> SELECT NOW();
          -> '2007-12-15 23:50:26'
  mysql> SELECT NOW() + 0;
          -> 20071215235026.000000
  ```
*  `PERIOD_DIFF(P1,P2)`

  Retorna o número de meses entre os períodos *`P1`* e *`P2`*. *`P1`* e *`P2`* devem estar no formato *`YYMM`* ou *`YYYYMM`*. Note que os argumentos de período *`P1`* e *`P2`* não são valores de data.

  Esta função retorna `NULL` se *`P1`* ou *`P2`* for `NULL`.

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
*  `QUARTER(data)`

  Retorna o trimestre do ano para *`data`*, no intervalo `1` a `4`, ou `NULL` se *`data`* for `NULL`.

  ```
  mysql> SELECT PERIOD_ADD(200801,2);
          -> 200803
  ```
*  `SECOND(time)`

  Retorna o segundo para *`time`*, no intervalo `0` a `59`, ou `NULL` se *`time`* for `NULL`.

  ```
  mysql> SELECT PERIOD_DIFF(200802,200703);
          -> 11
  ```
*  `SEC_TO_TIME(segundos)`

Retorna o argumento *`seconds`*, convertido em horas, minutos e segundos, como um valor `TIME`. A faixa do resultado é limitada à do tipo de dados `TIME`. Uma mensagem de aviso é exibida se o argumento corresponder a um valor fora dessa faixa.

A função retorna `NULL` se *`seconds`* for `NULL`.

```
  mysql> SELECT QUARTER('2008-04-01');
          -> 2
  ```
*  `STR_TO_DATE(str,format)`

  Isto é o inverso da função `DATE_FORMAT()`. Ela recebe uma string *`str`* e uma string de formato *`format`*. `STR_TO_DATE()` retorna um valor `DATETIME` se a string de formato contiver partes de data e hora, ou um valor `DATE` ou `TIME` se a string contiver apenas partes de data ou hora. Se *`str`* ou *`format`* for `NULL`, a função retorna `NULL`. Se o valor de data, hora ou `DATETIME` extraído de *`str`* não puder ser analisado de acordo com as regras seguidas pelo servidor, `STR_TO_DATE()` retorna `NULL` e produz um aviso.

O servidor analisa *`str`* tentando corresponder *`format`* a ele. A string de formato pode conter caracteres literais e especificadores de formato que começam com `%`. Os caracteres literais na *`format`* devem corresponder literalmente em *`str`*. Os especificadores de formato na *`format`* devem corresponder a uma parte de data ou hora em *`str`*. Para os especificadores que podem ser usados na *`format`*, consulte a descrição da função `DATE_FORMAT()`.

```
  mysql> SELECT SECOND('10:05:03');
          -> 3
  ```

A varredura começa no início de *`str`* e falha se *`format`* não corresponder. Caracteres extras no final de *`str`* são ignorados.

```
  mysql> SELECT SEC_TO_TIME(2378);
          -> '00:39:38'
  mysql> SELECT SEC_TO_TIME(2378) + 0;
          -> 3938
  ```

Partes de data ou hora não especificadas têm um valor de 0, portanto, valores incompletamente especificados em *`str`* produzem um resultado com algumas ou todas as partes definidas como 0:

```
  mysql> SELECT STR_TO_DATE('01,5,2013','%d,%m,%Y');
          -> '2013-05-01'
  mysql> SELECT STR_TO_DATE('May 1, 2013','%M %d,%Y');
          -> '2013-05-01'
  ```

A verificação de faixa nas partes dos valores de data é conforme descrito na Seção 13.2.2, “Os tipos DATE, DATETIME e TIMESTAMP”. Isso significa, por exemplo, que datas “zero” ou datas com valores de parte de 0 são permitidas, a menos que o modo SQL seja configurado para não permitir tais valores.

```
  mysql> SELECT STR_TO_DATE('a09:30:17','a%h:%i:%s');
          -> '09:30:17'
  mysql> SELECT STR_TO_DATE('a09:30:17','%h:%i:%s');
          -> NULL
  mysql> SELECT STR_TO_DATE('09:30:17a','%h:%i:%s');
          -> '09:30:17'
  ```

Se o modo SQL `NO_ZERO_DATE` estiver habilitado, datas nulos são desaconselhados. Nesse caso, `STR_TO_DATE()` retorna `NULL` e gera uma mensagem de aviso:

```
  mysql> SELECT STR_TO_DATE('abc','abc');
          -> '0000-00-00'
  mysql> SELECT STR_TO_DATE('9','%m');
          -> '0000-09-00'
  mysql> SELECT STR_TO_DATE('9','%s');
          -> '00:00:09'
  ```

Em algumas versões anteriores do MySQL, era possível passar uma string de data inválida, como `'2021-11-31'`, para essa função. No MySQL 8.4, `STR_TO_DATE()` realiza verificação completa de intervalo e levanta um erro se a data após a conversão for inválida.

::: info Nota

Você não pode usar o formato `"%X%V"` para converter uma string de ano-semana para uma data porque a combinação de um ano e semana não identifica de forma única um ano e mês se a semana atravessar uma fronteira de mês. Para converter um ano-semana para uma data, você também deve especificar o dia da semana:

```
  mysql> SELECT STR_TO_DATE('00/00/0000', '%m/%d/%Y');
          -> '0000-00-00'
  mysql> SELECT STR_TO_DATE('04/31/2004', '%m/%d/%Y');
          -> '2004-04-31'
  ```


:::

Você também deve estar ciente de que, para datas e as partes de data de valores datetime, `STR_TO_DATE()` verifica (apenas) o ano, mês e dia do valor de mês, individualmente. Mais precisamente, isso significa que o ano é verificado para garantir que esteja no intervalo de 0-9999, inclusive, o mês é verificado para garantir que esteja no intervalo de 1-12, inclusive, e o dia do mês é verificado para garantir que esteja no intervalo de 1-31, inclusive, mas o servidor não verifica os valores em combinação. Por exemplo, `SELECT STR_TO_DATE('23-2-31', '%Y-%m-%d')` retorna `2023-02-31`. Habilitar ou desabilitar o modo SQL do servidor `ALLOW_INVALID_DATES` não tem efeito sobre esse comportamento. Consulte a Seção 13.2.2, “Os tipos DATE, DATETIME e TIMESTAMP”, para mais informações.
* `SUBDATE(date,INTERVAL expr unit)`

  Quando invocado com a forma `INTERVAL` do segundo argumento,  `SUBDATE()` é um sinônimo de  `DATE_SUB()`. Para informações sobre o argumento `INTERVAL *``unit``, consulte a discussão para  `DATE_ADD()`.

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

A segunda forma permite o uso de um valor inteiro para *`days`*. Nesse caso, é interpretado como o número de dias a serem subtraídos da expressão de data ou datetime *`expr`*.

```
  mysql> SELECT STR_TO_DATE('200442 Monday', '%X%V %W');
          -> '2004-10-18'
  ```

Esta função retorna `NULL` se qualquer um de seus argumentos for `NULL`.
*  `SUBTIME(expr1,expr2)`

   `SUBTIME()` retorna *`expr1`* − *`expr2`* expresso como um valor no mesmo formato que *`expr1`*. *`expr1`* é uma expressão de hora ou data e hora, e *`expr2`* é uma expressão de hora.

  A resolução do tipo de retorno desta função é realizada da mesma forma que para a função `ADDTIME()`; consulte a descrição dessa função para obter mais informações.

  ```
  mysql> SELECT DATE_SUB('2008-01-02', INTERVAL 31 DAY);
          -> '2007-12-02'
  mysql> SELECT SUBDATE('2008-01-02', INTERVAL 31 DAY);
          -> '2007-12-02'
  ```

  Esta função retorna `NULL` se *`expr1`* ou *`expr2`* for `NULL`.
*  `SYSDATE([fsp])`

   Retorna a data e hora atuais como um valor no formato `'YYYY-MM-DD hh:mm:ss'` ou *`YYYYMMDDhhmmss`*, dependendo se a função é usada em contexto de string ou numérico.

   Se o argumento *`fsp`* for fornecido para especificar uma precisão de segundos fracionários de 0 a 6, o valor de retorno inclui uma parte de segundos fracionários de tantos dígitos.

   `SYSDATE()` retorna a hora na qual é executada. Isso difere do comportamento da função `NOW()`, que retorna uma hora constante que indica a hora em que a instrução começou a ser executada. (Dentro de uma função armazenada ou gatilho, `NOW()` retorna a hora em que a função ou a instrução de gatilho começou a ser executada.)

  ```
  mysql> SELECT SUBDATE('2008-01-02 12:00:00', 31);
          -> '2007-12-02 12:00:00'
  ```

  Além disso, a instrução `SET TIMESTAMP` afeta o valor retornado por `NOW()` mas não por `SYSDATE()`. Isso significa que as configurações de data e hora no log binário não têm efeito nas invocações de `SYSDATE()`.

  Como `SYSDATE()` pode retornar valores diferentes mesmo dentro da mesma instrução e não é afetado por `SET TIMESTAMP`, é não determinístico e, portanto, inseguro para replicação se o registro binário baseado em instruções for usado. Se isso for um problema, você pode usar o registro baseado em linhas.

  Alternativamente, você pode usar a opção `--sysdate-is-now` para fazer com que `SYSDATE()` seja um alias para `NOW()`. Isso funciona se a opção for usada tanto no servidor de origem da replicação quanto na replica.

A natureza não determinística de `SYSDATE()` também significa que índices não podem ser usados para avaliar expressões que a referenciam.
*  `TIME(expr)`

  Extrai a parte de hora da expressão de data e hora *`expr`* e retorna como uma string. Retorna `NULL` se *`expr`* for `NULL`.

  Esta função é insegura para replicação baseada em declarações. Um aviso é registrado se você usar esta função quando `binlog_format` estiver definido como `STATEMENT`.

  ```
  mysql> SELECT SUBTIME('2007-12-31 23:59:59.999999','1 1:1:1.000002');
          -> '2007-12-30 22:58:58.999997'
  mysql> SELECT SUBTIME('01:00:00.999999', '02:00:00.999998');
          -> '-00:59:59.999999'
  ```
*  `TIMEDIFF(expr1,expr2)`

   `TIMEDIFF()` retorna *`expr1`* − *`expr2`* expresso como um valor de hora. *`expr1`* e *`expr2`* são strings que são convertidas em expressões `TIME` ou `DATETIME`; estas devem ser do mesmo tipo após a conversão. Retorna `NULL` se *`expr1`* ou *`expr2`* for `NULL`.

  O resultado retornado por `TIMEDIFF()` está limitado ao intervalo permitido para valores `TIME`. Alternativamente, você pode usar qualquer uma das funções `TIMESTAMPDIFF()` e `UNIX_TIMESTAMP()`, ambas que retornam inteiros.

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
*  `TIMESTAMP(expr)`, `TIMESTAMP(expr1,expr2)`

  Com um único argumento, esta função retorna a expressão de data ou hora *`expr`* como um valor de data e hora. Com dois argumentos, adiciona a expressão de hora *`expr2`* à expressão de data ou hora *`expr1`* e retorna o resultado como um valor de data e hora. Retorna `NULL` se *`expr`*, *`expr1`*, ou *`expr2`* for `NULL`.

  ```
  mysql> SELECT TIME('2003-12-31 01:02:03');
          -> '01:02:03'
  mysql> SELECT TIME('2003-12-31 01:02:03.000123');
          -> '01:02:03.000123'
  ```
*  `TIMESTAMPADD(unit,interval,datetime_expr)`

  Adiciona a expressão inteira *`interval`* à expressão de data ou hora *`datetime_expr`*. O valor da unidade para *`interval`* é dado pelo argumento *`unit`*, que deve ser um dos seguintes valores: `MICROSECOND` (microsegundos), `SECOND`, `MINUTE`, `HOUR`, `DAY`, `WEEK`, `MONTH`, `QUARTER` ou `YEAR`.

  O valor de *`unit`* pode ser especificado usando uma das palavras-chave como mostrado, ou com um prefixo de `SQL_TSI_`. Por exemplo, `DAY` e `SQL_TSI_DAY` são ambos legais.

  Esta função retorna `NULL` se *`interval`* ou *`datetime_expr`* for `NULL`.

  ```
  mysql> SELECT TIMEDIFF('2000-01-01 00:00:00',
      ->                 '2000-01-01 00:00:00.000001');
          -> '-00:00:00.000001'
  mysql> SELECT TIMEDIFF('2008-12-31 23:59:59.000001',
      ->                 '2008-12-30 01:01:01.000002');
          -> '46:58:57.999999'
  ```

Ao adicionar um intervalo `MONTH` a um valor `DATE` ou `DATETIME`, e a data resultante incluir um dia que não existe no mês dado, o dia é ajustado para o último dia do mês, como mostrado aqui:

```
  mysql> SELECT TIMESTAMP('2003-12-31');
          -> '2003-12-31 00:00:00'
  mysql> SELECT TIMESTAMP('2003-12-31 12:00:00','12:00:00');
          -> '2004-01-01 00:00:00'
  ```yXl3nWH9TV
::: info Nota

A ordem dos argumentos de data ou datetime para esta função é o oposto da usada com a função `TIMESTAMP()` quando invocada com 2 argumentos.

:::
*  `TIME_FORMAT(time,format)`

Isto é usado como a função `DATE_FORMAT()`, mas a string *`format`* pode conter especificadores de formato apenas para horas, minutos, segundos e microsegundos. Outros especificadores produzem um `NULL` ou `0`. `TIME_FORMAT()` retorna `NULL` se *`time`* ou *`format`* for `NULL`.

Se o valor de *`time`* contiver uma parte de hora maior que `23`, os especificadores de formato de hora `%H` e `%k` produzem um valor maior que o intervalo usual de `0..23`. Os outros especificadores de hora produzem o valor de hora módulo 12.

```
  mysql> SELECT TIMESTAMPADD(MINUTE, 1, '2003-01-02');
          -> '2003-01-02 00:01:00'
  mysql> SELECT TIMESTAMPADD(WEEK,1,'2003-01-02');
          -> '2003-01-09'
  ```13ImDOlhHC
*  `TO_DAYS(date)`

Dado um dia *`date`*, retorna um número de dia (o número de dias desde o ano 0). Retorna `NULL` se *`date`* for `NULL`.

```
  mysql> SELECT TIMESTAMPADD(MONTH, 1, DATE '2024-03-30') AS t1,
       >        TIMESTAMPADD(MONTH, 1, DATE '2024-03-31') AS t2;
  +------------+------------+
  | t1         | t2         |
  +------------+------------+
  | 2024-04-30 | 2024-04-30 |
  +------------+------------+
  1 row in set (0.00 sec)
  ```ZvDwSKhoTR```
  mysql> SELECT TIMESTAMPDIFF(MONTH,'2003-02-01','2003-05-01');
          -> 3
  mysql> SELECT TIMESTAMPDIFF(YEAR,'2002-05-01','2001-01-01');
          -> -1
  mysql> SELECT TIMESTAMPDIFF(MINUTE,'2003-02-01','2003-05-01 12:05:55');
          -> 128885
  ```e2h9RnLQ3a```
  mysql> SELECT TIME_FORMAT('100:00:00', '%H %k %h %I %l');
          -> '100 100 04 04 4'
  ```XO0bHB8mM6```
  mysql> SELECT TIME_TO_SEC('22:23:00');
          -> 80580
  mysql> SELECT TIME_TO_SEC('00:39:38');
          -> 2378
  ```hHaDrGinzg```
  mysql> SELECT TO_DAYS(950501);
          -> 728779
  mysql> SELECT TO_DAYS('2007-10-07');
          -> 733321
  ```FNZcgsmSsH```
  mysql> SELECT TO_DAYS('2008-10-07'), TO_DAYS('08-10-07');
          -> 733687, 733687
  ```JRlUJHR6H6```
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
  ```8gV0mKNxmv```
  mysql> SELECT TO_SECONDS(950501);
          -> 62966505600
  mysql> SELECT TO_SECONDS('2009-11-29');
          -> 63426672000
  mysql> SELECT TO_SECONDS('2009-11-29 13:43:32');
          -> 63426721412
  mysql> SELECT TO_SECONDS( NOW() );
          -> 63426721458
  ```n39QSwEwDj```
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
  ```hkCgFqSDCw```
  mysql> SELECT UNIX_TIMESTAMP();
          -> 1447431666
  mysql> SELECT UNIX_TIMESTAMP('2015-11-13 10:20:19');
          -> 1447431619
  mysql> SELECT UNIX_TIMESTAMP('2015-11-13 10:20:19.012');
          -> 1447431619.012
  ```8gV0mKNxmv```
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
  ```uZiOkZ2xTb```
  mysql> SELECT UTC_DATE(), UTC_DATE() + 0;
          -> '2003-08-14', 20030814
  ```7Hd4ulFb2w```
  mysql> SELECT UTC_TIME(), UTC_TIME() + 0;
          -> '18:07:53', 180753.000000
  ```TJxnZ4ZImW```
  mysql> SELECT UTC_TIMESTAMP(), UTC_TIMESTAMP() + 0;
          -> '2003-08-14 18:08:04', 20030814180804.000000
  ```Fq9hES2odP```
  mysql> SELECT WEEK('2008-02-20');
          -> 7
  mysql> SELECT WEEK('2008-02-20',0);
          -> 7
  mysql> SELECT WEEK('2008-02-20',1);
          -> 8
  mysql> SELECT WEEK('2008-12-31',1);
          -> 53
  ```vmEgczZVu6```
  mysql> SELECT YEAR('2000-01-01'), WEEK('2000-01-01',0);
          -> 2000, 0
  ```iEig7yUbJl```
  mysql> SELECT WEEK('2000-01-01',2);
          -> 52
  ```b6cxKDbJ07```
  mysql> SELECT YEARWEEK('2000-01-01');
          -> 199952
  mysql> SELECT MID(YEARWEEK('2000-01-01'),5,2);
          -> '52'
  ```rg2XaTOGIV```

O número da semana é diferente do que a função `WEEK()` retornaria (`0`) para os argumentos opcionais `0` ou `1`, pois `WEEK()` então retorna a semana no contexto do ano fornecido.