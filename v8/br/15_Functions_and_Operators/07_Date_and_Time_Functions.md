## 14.7 Funções de data e hora

Esta seção descreve as funções que podem ser usadas para manipular valores temporais. Consulte a Seção 13.2, “Tipos de dados de data e hora”, para obter uma descrição da faixa de valores de cada tipo de data e hora e dos formatos válidos nos quais os valores podem ser especificados.

**Tabela 14.11 Funções de Data e Hora**

<table summary="Uma referência que lista funções de data e hora."><thead><tr><th>Nome</th> <th>Descrição</th> </tr></thead><tbody><tr><td>[[PH_HTML_CODE_<code>CURTIME()</code>]</td> <td>Adicione valores de tempo (intervalos) a um valor de data</td> </tr><tr><td>[[PH_HTML_CODE_<code>CURTIME()</code>]</td> <td>Adicione tempo</td> </tr><tr><td>[[PH_HTML_CODE_<code>DATE_ADD()</code>]</td> <td>Converter de um fuso horário para outro</td> </tr><tr><td>[[PH_HTML_CODE_<code>DATE_FORMAT()</code>]</td> <td>Retorne a data atual</td> </tr><tr><td>[[PH_HTML_CODE_<code>DATE_SUB()</code>], [[PH_HTML_CODE_<code>DATEDIFF()</code>]</td> <td>Sinônimos para CURDATE()</td> </tr><tr><td>[[PH_HTML_CODE_<code>DAY()</code>], [[PH_HTML_CODE_<code>DAYNAME()</code>]</td> <td>Sinônimos para CURTIME()</td> </tr><tr><td>[[PH_HTML_CODE_<code>DAYOFMONTH()</code>], [[PH_HTML_CODE_<code>DAYOFWEEK()</code>]</td> <td>Sinônimos para NOW()</td> </tr><tr><td>[[<code>CURTIME()</code>]]</td> <td>Retorne a hora atual</td> </tr><tr><td>[[<code>ADDTIME()</code><code>CURTIME()</code>]</td> <td>Extrair a parte da data de uma expressão de data ou datetime</td> </tr><tr><td>[[<code>DATE_ADD()</code>]]</td> <td>Adicione valores de tempo (intervalos) a um valor de data</td> </tr><tr><td>[[<code>DATE_FORMAT()</code>]]</td> <td>Formatar a data conforme especificado</td> </tr><tr><td>[[<code>DATE_SUB()</code>]]</td> <td>Subtraia um valor de tempo (intervalo) de uma data</td> </tr><tr><td>[[<code>DATEDIFF()</code>]]</td> <td>Subtraia duas datas</td> </tr><tr><td>[[<code>DAY()</code>]]</td> <td>Sinônimo de DAYOFMONTH()</td> </tr><tr><td>[[<code>DAYNAME()</code>]]</td> <td>Retorne o nome do dia da semana</td> </tr><tr><td>[[<code>DAYOFMONTH()</code>]]</td> <td>Retorne o dia do mês (0-31)</td> </tr><tr><td>[[<code>DAYOFWEEK()</code>]]</td> <td>Retorne o índice de dia da semana do argumento</td> </tr><tr><td>[[<code>CONVERT_TZ()</code><code>CURTIME()</code>]</td> <td>Retorne o dia do ano (1-366)</td> </tr><tr><td>[[<code>CONVERT_TZ()</code><code>CURTIME()</code>]</td> <td>Extrair parte de uma data</td> </tr><tr><td>[[<code>CONVERT_TZ()</code><code>DATE_ADD()</code>]</td> <td>Converter um número de dia em uma data</td> </tr><tr><td>[[<code>CONVERT_TZ()</code><code>DATE_FORMAT()</code>]</td> <td>Formatar o timestamp Unix como uma data</td> </tr><tr><td>[[<code>CONVERT_TZ()</code><code>DATE_SUB()</code>]</td> <td>Retorne uma string de formato de data</td> </tr><tr><td>[[<code>CONVERT_TZ()</code><code>DATEDIFF()</code>]</td> <td>Extraia a hora</td> </tr><tr><td>[[<code>CONVERT_TZ()</code><code>DAY()</code>]</td> <td>Retorne o último dia do mês para o argumento</td> </tr><tr><td>[[<code>CONVERT_TZ()</code><code>DAYNAME()</code>], [[<code>CONVERT_TZ()</code><code>DAYOFMONTH()</code>]</td> <td>Sinônimo de NOW()</td> </tr><tr><td>[[<code>CONVERT_TZ()</code><code>DAYOFWEEK()</code>], [[<code>CURDATE()</code><code>CURTIME()</code>]</td> <td>Sinônimo de NOW()</td> </tr><tr><td>[[<code>CURDATE()</code><code>CURTIME()</code>]</td> <td>Crie uma data a partir do ano e do dia do ano</td> </tr><tr><td>[[<code>CURDATE()</code><code>DATE_ADD()</code>]</td> <td>Crie tempo a partir de hora, minuto e segundo</td> </tr><tr><td>[[<code>CURDATE()</code><code>DATE_FORMAT()</code>]</td> <td>Retorne os microsegundos do argumento</td> </tr><tr><td>[[<code>CURDATE()</code><code>DATE_SUB()</code>]</td> <td>Devolva o minuto da discussão</td> </tr><tr><td>[[<code>CURDATE()</code><code>DATEDIFF()</code>]</td> <td>Retorne o mês da data passada</td> </tr><tr><td>[[<code>CURDATE()</code><code>DAY()</code>]</td> <td>Retorne o nome do mês</td> </tr><tr><td>[[<code>CURDATE()</code><code>DAYNAME()</code>]</td> <td>Retorne a data e hora atuais</td> </tr><tr><td>[[<code>CURDATE()</code><code>DAYOFMONTH()</code>]</td> <td>Adicione um ponto final a um ano-mês</td> </tr><tr><td>[[<code>CURDATE()</code><code>DAYOFWEEK()</code>]</td> <td>Retorne o número de meses entre os períodos</td> </tr><tr><td>[[<code>CURRENT_DATE()</code><code>CURTIME()</code>]</td> <td>Retorne o quarto de um argumento de data</td> </tr><tr><td>[[<code>CURRENT_DATE()</code><code>CURTIME()</code>]</td> <td>Converte segundos para o formato 'hh:mm:ss'</td> </tr><tr><td>[[<code>CURRENT_DATE()</code><code>DATE_ADD()</code>]</td> <td>Retorne o segundo (0-59)</td> </tr><tr><td>[[<code>CURRENT_DATE()</code><code>DATE_FORMAT()</code>]</td> <td>Converter uma string em uma data</td> </tr><tr><td>[[<code>CURRENT_DATE()</code><code>DATE_SUB()</code>]</td> <td>Sinônimo de DATE_SUB() quando invocado com três argumentos</td> </tr><tr><td>[[<code>CURRENT_DATE()</code><code>DATEDIFF()</code>]</td> <td>Subtraia vezes</td> </tr><tr><td>[[<code>CURRENT_DATE()</code><code>DAY()</code>]</td> <td>Retorne o momento em que a função é executada</td> </tr><tr><td>[[<code>CURRENT_DATE()</code><code>DAYNAME()</code>]</td> <td>Extraia a porção de tempo da expressão passada</td> </tr><tr><td>[[<code>CURRENT_DATE()</code><code>DAYOFMONTH()</code>]</td> <td>Formato como tempo</td> </tr><tr><td>[[<code>CURRENT_DATE()</code><code>DAYOFWEEK()</code>]</td> <td>Retorne o argumento convertido em segundos</td> </tr><tr><td>[[<code>CURRENT_DATE</code><code>CURTIME()</code>]</td> <td>Subtraia o tempo</td> </tr><tr><td>[[<code>CURRENT_DATE</code><code>CURTIME()</code>]</td> <td>Com um único argumento, essa função retorna a expressão de data ou datetime; com dois argumentos, a soma dos argumentos.</td> </tr><tr><td>[[<code>CURRENT_DATE</code><code>DATE_ADD()</code>]</td> <td>Adicione um intervalo a uma expressão de data e hora</td> </tr><tr><td>[[<code>CURRENT_DATE</code><code>DATE_FORMAT()</code>]</td> <td>Retorne a diferença entre duas expressões de data e hora, usando as unidades especificadas</td> </tr><tr><td>[[<code>CURRENT_DATE</code><code>DATE_SUB()</code>]</td> <td>Retorne o argumento de data convertido em dias</td> </tr><tr><td>[[<code>CURRENT_DATE</code><code>DATEDIFF()</code>]</td> <td>Retorne o argumento de data ou datetime convertido em segundos desde o ano 0</td> </tr><tr><td>[[<code>CURRENT_DATE</code><code>DAY()</code>]</td> <td>Retorne um timestamp Unix</td> </tr><tr><td>[[<code>CURRENT_DATE</code><code>DAYNAME()</code>]</td> <td>Retorne a data atual UTC</td> </tr><tr><td>[[<code>CURRENT_DATE</code><code>DAYOFMONTH()</code>]</td> <td>Retorne a hora atual UTC</td> </tr><tr><td>[[<code>CURRENT_DATE</code><code>DAYOFWEEK()</code>]</td> <td>Retorne a data e hora atuais em UTC</td> </tr><tr><td>[[<code>CURRENT_TIME()</code><code>CURTIME()</code>]</td> <td>Retorne o número da semana</td> </tr><tr><td>[[<code>CURRENT_TIME()</code><code>CURTIME()</code>]</td> <td>Retorne o índice do dia da semana</td> </tr><tr><td>[[<code>CURRENT_TIME()</code><code>DATE_ADD()</code>]</td> <td>Retorne a semana do calendário da data (1-53)</td> </tr><tr><td>[[<code>CURRENT_TIME()</code><code>DATE_FORMAT()</code>]</td> <td>Retorne o ano</td> </tr><tr><td>[[<code>CURRENT_TIME()</code><code>DATE_SUB()</code>]</td> <td>Retorne o ano e a semana</td> </tr></tbody></table>

Aqui está um exemplo que usa funções de data. A consulta a seguir seleciona todas as linhas com um valor de `date_col` nas últimas 30 dias:

```
mysql> SELECT something FROM tbl_name
    -> WHERE DATE_SUB(CURDATE(),INTERVAL 30 DAY) <= date_col;
```

A consulta também seleciona linhas com datas que estão no futuro.

Funções que esperam valores de data geralmente aceitam valores datetime e ignoram a parte de hora. Funções que esperam valores de hora geralmente aceitam valores datetime e ignoram a parte de data.

As funções que retornam a data ou hora atuais são avaliadas apenas uma vez por consulta no início da execução da consulta. Isso significa que múltiplas referências a uma função, como `NOW()` dentro de uma única consulta, sempre produzem o mesmo resultado. (Para nossos propósitos, uma única consulta também inclui uma chamada a um programa armazenado (rotina armazenada, gatilho ou evento) e todos os subprogramas chamados por esse programa.) Esse princípio também se aplica a `CURDATE()`, `CURTIME()`, `UTC_DATE()`, `UTC_TIME()`, `UTC_TIMESTAMP()` e a quaisquer de seus sinônimos.

As funções `CURRENT_TIMESTAMP()`, `CURRENT_TIME()`, `CURRENT_DATE()` e `FROM_UNIXTIME()` retornam valores no fuso horário da sessão atual, que está disponível como o valor da sessão da variável de sistema `time_zone`. Além disso, `UNIX_TIMESTAMP()` assume que seu argumento é um valor datetime no fuso horário da sessão. Veja a Seção 7.1.15, “Suporte ao Fuso Horário do MySQL Server”.

Algumas funções de data podem ser usadas com datas "zero" ou datas incompletas, como `'2001-11-00'`, enquanto outras não podem. Funções que extraem partes de datas geralmente funcionam com datas incompletas e, portanto, podem retornar 0 quando você esperaria um valor diferente de zero. Por exemplo:

```
mysql> SELECT DAYOFMONTH('2001-11-00'), MONTH('2005-00-00');
        -> 0, 0
```

Outras funções esperam datas completas e retornam `NULL` para datas incompletas. Essas funções incluem funções que realizam operações aritméticas com datas ou que mapeiam partes de datas para nomes. Por exemplo:

```
mysql> SELECT DATE_ADD('2006-05-00',INTERVAL 1 DAY);
        -> NULL
mysql> SELECT DAYNAME('2006-05-00');
        -> NULL
```

Várias funções são estritas quando passam um valor da função `DATE()` como argumento e rejeitam datas incompletas com uma parte do dia igual a zero: `CONVERT_TZ()`, `DATE_ADD()`, `DATE_SUB()`, `DAYOFYEAR()`, `TIMESTAMPDIFF()`, `TO_DAYS()`, `TO_SECONDS()`, `WEEK()`, `WEEKDAY()`, `WEEKOFYEAR()`, `YEARWEEK()`.

Os segundos fracionários para os valores de `TIME`, `DATETIME` e `TIMESTAMP` são suportados, com precisão de até microsegundos. Funções que aceitam argumentos temporais aceitam valores com segundos fracionários. Os valores de retorno de funções temporais incluem segundos fracionários conforme apropriado.

- `ADDDATE(date,INTERVAL expr unit)`, `ADDDATE(date,days)`

  Quando invocado com a forma `INTERVAL` do segundo argumento, `ADDDATE()` é sinônimo de `DATE_ADD()`. A função relacionada `SUBDATE()` é sinônimo de `DATE_SUB()`. Para informações sobre o argumento \*`INTERVAL` `unit`, consulte Intervalos Temporais.

  ```
  mysql> SELECT DATE_ADD('2008-01-02', INTERVAL 31 DAY);
          -> '2008-02-02'
  mysql> SELECT ADDDATE('2008-01-02', INTERVAL 31 DAY);
          -> '2008-02-02'
  ```

  Quando invocado com a forma `days` do segundo argumento, o MySQL o trata como um número inteiro de dias a ser adicionado a `expr`.

  ```
  mysql> SELECT ADDDATE('2008-01-02', 31);
          -> '2008-02-02'
  ```

  Essa função retorna `NULL` se `date` ou `days` for `NULL`.

- `ADDTIME(expr1,expr2)`

  `ADDTIME()` adiciona `expr2` a `expr1` e retorna o resultado. `expr1` é uma expressão de hora ou data e hora, e `expr2` é uma expressão de hora. Retorna `NULL` se `expr1` ou `expr2` for `NULL`.

  A partir do MySQL 8.0.28, o tipo de retorno dessa função e da função `SUBTIME()` é determinado da seguinte forma:

  - Se o primeiro argumento for um parâmetro dinâmico (como em uma instrução preparada), o tipo de retorno é `TIME`.

  - Caso contrário, o tipo resolvido da função é derivado do tipo resolvido do primeiro argumento.

  ```
  mysql> SELECT ADDTIME('2007-12-31 23:59:59.999999', '1 1:1:1.000002');
          -> '2008-01-02 01:01:01.000001'
  mysql> SELECT ADDTIME('01:00:00.999999', '02:00:00.999998');
          -> '03:00:01.999997'
  ```

- `CONVERT_TZ(dt,from_tz,to_tz)`

  `CONVERT_TZ()` converte um valor de datetime `dt` do fuso horário dado por `from_tz` para o fuso horário dado por `to_tz` e retorna o valor resultante. Os fusos horários são especificados conforme descrito na Seção 7.1.15, “Suporte ao Fuso Horário do MySQL Server”. Esta função retorna `NULL` se algum dos argumentos for inválido ou se algum deles for `NULL`.

  Em plataformas de 32 bits, a faixa de valores suportada por essa função é a mesma que para o tipo `TIMESTAMP` (consulte a Seção 13.2.1, “Sintaxe do Tipo de Dados de Data e Hora”, para obter informações sobre a faixa). Em plataformas de 64 bits, a partir do MySQL 8.0.28, o valor máximo suportado é `'3001-01-18 23:59:59.999999'` UTC.

  Independentemente da plataforma ou da versão do MySQL, se o valor sair do intervalo suportado ao ser convertido de `from_tz` para UTC, nenhuma conversão ocorrerá.

  ```
  mysql> SELECT CONVERT_TZ('2004-01-01 12:00:00','GMT','MET');
          -> '2004-01-01 13:00:00'
  mysql> SELECT CONVERT_TZ('2004-01-01 12:00:00','+00:00','+10:00');
          -> '2004-01-01 22:00:00'
  ```

  Nota

  Para usar fusos horários nomeados, como `'MET'` ou `'Europe/Amsterdam'`, as tabelas de fusos horários devem ser configuradas corretamente. Para obter instruções, consulte a Seção 7.1.15, “Suporte ao Fuso Horário do MySQL Server”.

- `CURDATE()`

  Retorna a data atual como um valor no formato `'YYYY-MM-DD'` ou `YYYYMMDD`, dependendo se a função é usada em contexto de string ou numérico.

  ```
  mysql> SELECT CURDATE();
          -> '2008-06-13'
  mysql> SELECT CURDATE() + 0;
          -> 20080613
  ```

- `CURRENT_DATE`, `CURRENT_DATE()`

  `CURRENT_DATE` e `CURRENT_DATE()` são sinônimos de `CURDATE()`.

- `CURRENT_TIME`, `CURRENT_TIME([fsp])`

  `CURRENT_TIME` e `CURRENT_TIME()` são sinônimos de `CURTIME()`.

- `CURRENT_TIMESTAMP`, `CURRENT_TIMESTAMP([fsp])`

  `CURRENT_TIMESTAMP` e `CURRENT_TIMESTAMP()` são sinônimos de `NOW()`.

- `CURTIME([fsp])`

  Retorna a hora atual como um valor no formato `'hh:mm:ss'` ou `hhmmss`, dependendo se a função é usada em contexto de string ou numérico. O valor é expresso no fuso horário da sessão.

  Se o argumento `fsp` for fornecido para especificar uma precisão de segundos fracionários de 0 a 6, o valor de retorno inclui uma parte de segundos fracionários com tantos dígitos quanto especificado.

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

- `DATE(expr)`

  Extrai a parte da data da expressão de data ou datetime `expr`. Retorna `NULL` se `expr` for `NULL`.

  ```
  mysql> SELECT DATE('2003-12-31 01:02:03');
          -> '2003-12-31'
  ```

- `DATEDIFF(expr1,expr2)`

  `DATEDIFF()` retorna `expr1` − `expr2` expresso como um valor em dias de uma data para outra. `expr1` e `expr2` são expressões de data ou data e hora. Apenas as partes de data dos valores são usadas no cálculo.

  ```
  mysql> SELECT DATEDIFF('2007-12-31 23:59:59','2007-12-30');
          -> 1
  mysql> SELECT DATEDIFF('2010-11-30 23:59:59','2010-12-31');
          -> -31
  ```

  Essa função retorna `NULL` se `expr1` ou `expr2` for `NULL`.

- `DATE_ADD(date,INTERVAL expr unit)`, `DATE_SUB(date,INTERVAL expr unit)`

  Essas funções realizam operações aritméticas com datas. O argumento `date` especifica a data ou o valor de data e hora de início. `expr` é uma expressão que especifica o valor do intervalo a ser adicionado ou subtraído da data de início. `expr` é avaliado como uma string; ele pode começar com um `-` para intervalos negativos. `unit` é uma palavra-chave que indica as unidades nas quais a expressão deve ser interpretada.

  Para obter mais informações sobre a sintaxe de intervalos temporais, incluindo uma lista completa dos especificadores `unit`, a forma esperada do argumento `expr` para cada valor de `unit` e as regras para a interpretação dos operandos em aritmética temporal, consulte Intervalos Temporais.

  O valor de retorno depende dos argumentos:

  - Se `date` for `NULL`, a função retorna `NULL`.

  - `DATE` se o argumento `date` for um valor `DATE` e seus cálculos envolvam apenas as partes `YEAR`, `MONTH` e `DAY` (ou seja, sem partes de tempo).

  - (*MySQL 8.0.28 e versões posteriores*:) `TIME` se o argumento `date` for um valor de `TIME` e os cálculos envolvam apenas as partes `HOURS`, `MINUTES` e `SECONDS` (ou seja, sem partes de data).

  - `DATETIME` se o primeiro argumento for um valor `DATETIME` (ou `TIMESTAMP`) ou se o primeiro argumento for um `DATE` e o valor de `unit` usar `HOURS`, `MINUTES` ou `SECONDS`, ou se o primeiro argumento for do tipo `TIME` e o valor de `unit` usar `YEAR`, `MONTH` ou `DAY`.

  - (*MySQL 8.0.28 e versões posteriores*:) Se o primeiro argumento for um parâmetro dinâmico (por exemplo, de uma instrução preparada), seu tipo resolvido é `DATE` se o segundo argumento for um intervalo que contenha apenas uma combinação de valores de `YEAR`, `MONTH` ou `DAY`; caso contrário, seu tipo é `DATETIME`.

  - Cadeia de caracteres de outra forma (tipo `VARCHAR`).

  Nota

  Nos MySQL 8.0.22 a 8.0.27, quando usadas em instruções preparadas, essas funções retornavam valores `DATETIME`, independentemente dos tipos de argumentos. (Bug #103781)

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

  Ao adicionar um intervalo `MONTH` a um valor `DATE` ou `DATETIME` e a data resultante incluir um dia que não existe no mês fornecido, o dia é ajustado para o último dia do mês, conforme mostrado aqui:

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

- `DATE_FORMAT(date,format)`

  Formata o valor `date` de acordo com a string `format`. Se qualquer um dos argumentos for `NULL`, a função retorna `NULL`.

  Os especificadores mostrados na tabela a seguir podem ser usados na string `format`. O caractere `%` é necessário antes dos caracteres do especificador de formato. Os especificadores se aplicam também a outras funções: `STR_TO_DATE()`, `TIME_FORMAT()`, `UNIX_TIMESTAMP()`.

  <table summary="Caracteres especificadores para a função DATE_FORMAT que podem ser usados na string de formato e fornece uma descrição de cada caractere especificador."><thead><tr> <th>Especificador</th> <th>Descrição</th> </tr></thead><tbody><tr> <td>[[PH_HTML_CODE_<code>0th</code>]</td> <td>Nome abreviado do dia da semana ([[PH_HTML_CODE_<code>0th</code>]..[[PH_HTML_CODE_<code>2nd</code>])</td> </tr><tr> <td>[[PH_HTML_CODE_<code>3rd</code>]</td> <td>Nome do mês abreviado ([[PH_HTML_CODE_<code>%d</code>]..[[PH_HTML_CODE_<code>00</code>])</td> </tr><tr> <td>[[PH_HTML_CODE_<code>31</code>]</td> <td>Mês, numérico ([[PH_HTML_CODE_<code>%e</code>]..[[PH_HTML_CODE_<code>0</code>])</td> </tr><tr> <td>[[PH_HTML_CODE_<code>31</code>]</td> <td>Dia do mês com sufixo em inglês ([[<code>0th</code>]], [[<code>Sun</code><code>0th</code>], [[<code>2nd</code>]], [[<code>3rd</code>]], …)</td> </tr><tr> <td>[[<code>%d</code>]]</td> <td>Dia do mês, numérico ([[<code>00</code>]]..[[<code>31</code>]])</td> </tr><tr> <td>[[<code>%e</code>]]</td> <td>Dia do mês, numérico ([[<code>0</code>]]..[[<code>31</code>]])</td> </tr><tr> <td>[[<code>Sat</code><code>0th</code>]</td> <td>Microssegundos ([[<code>Sat</code><code>0th</code>]..[[<code>Sat</code><code>2nd</code>])</td> </tr><tr> <td>[[<code>Sat</code><code>3rd</code>]</td> <td>Hora ([[<code>Sat</code><code>%d</code>]..[[<code>Sat</code><code>00</code>])</td> </tr><tr> <td>[[<code>Sat</code><code>31</code>]</td> <td>Hora ([[<code>Sat</code><code>%e</code>]..[[<code>Sat</code><code>0</code>])</td> </tr><tr> <td>[[<code>Sat</code><code>31</code>]</td> <td>Hora ([[<code>%b</code><code>0th</code>]..[[<code>%b</code><code>0th</code>])</td> </tr><tr> <td>[[<code>%b</code><code>2nd</code>]</td> <td>Minutos, numéricos ([[<code>%b</code><code>3rd</code>]..[[<code>%b</code><code>%d</code>])</td> </tr><tr> <td>[[<code>%b</code><code>00</code>]</td> <td>Dia do ano ([[<code>%b</code><code>31</code>]..[[<code>%b</code><code>%e</code>])</td> </tr><tr> <td>[[<code>%b</code><code>0</code>]</td> <td>Hora ([[<code>%b</code><code>31</code>]..[[<code>Jan</code><code>0th</code>])</td> </tr><tr> <td>[[<code>Jan</code><code>0th</code>]</td> <td>Hora ([[<code>Jan</code><code>2nd</code>]..[[<code>Jan</code><code>3rd</code>])</td> </tr><tr> <td>[[<code>Jan</code><code>%d</code>]</td> <td>Nome do mês ([[<code>Jan</code><code>00</code>]..[[<code>Jan</code><code>31</code>])</td> </tr><tr> <td>[[<code>Jan</code><code>%e</code>]</td> <td>Mês, numérico ([[<code>Jan</code><code>0</code>]..[[<code>Jan</code><code>31</code>])</td> </tr><tr> <td>[[<code>Dec</code><code>0th</code>]</td> <td>[[<code>Dec</code><code>0th</code>] ou [[<code>Dec</code><code>2nd</code>]</td> </tr><tr> <td>[[<code>Dec</code><code>3rd</code>]</td> <td>Hora, 12 horas (<em class="replaceable">[[<code>Dec</code><code>%d</code>]</em>seguido por [[<code>Dec</code><code>00</code>] ou [[<code>Dec</code><code>31</code>])</td> </tr><tr> <td>[[<code>Dec</code><code>%e</code>]</td> <td>Segundos ([[<code>Dec</code><code>0</code>]..[[<code>Dec</code><code>31</code>])</td> </tr><tr> <td>[[<code>%c</code><code>0th</code>]</td> <td>Segundos ([[<code>%c</code><code>0th</code>]..[[<code>%c</code><code>2nd</code>])</td> </tr><tr> <td>[[<code>%c</code><code>3rd</code>]</td> <td>Tempo, 24 horas (<em class="replaceable">[[<code>%c</code><code>%d</code>]</em>)</td> </tr><tr> <td>[[<code>%c</code><code>00</code>]</td> <td>Semana ([[<code>%c</code><code>31</code>]..[[<code>%c</code><code>%e</code>]), onde o domingo é o primeiro dia da semana; modo 0 [[<code>%c</code><code>0</code>]</td> </tr><tr> <td>[[<code>%c</code><code>31</code>]</td> <td>Semana ([[<code>0</code><code>0th</code>]..[[<code>0</code><code>0th</code>]), onde segunda-feira é o primeiro dia da semana; modo 1 [[<code>0</code><code>2nd</code>]</td> </tr><tr> <td>[[<code>0</code><code>3rd</code>]</td> <td>Semana ([[<code>0</code><code>%d</code>]..[[<code>0</code><code>00</code>]), onde o domingo é o primeiro dia da semana; [[<code>0</code><code>31</code>] modo 2; usado com [[<code>0</code><code>%e</code>]</td> </tr><tr> <td>[[<code>0</code><code>0</code>]</td> <td>Semana ([[<code>0</code><code>31</code>]..[[<code>12</code><code>0th</code>]), onde segunda-feira é o primeiro dia da semana; modo 3 [[<code>12</code><code>0th</code>]; usado com [[<code>12</code><code>2nd</code>]</td> </tr><tr> <td>[[<code>12</code><code>3rd</code>]</td> <td>Nome do dia da semana ([[<code>12</code><code>%d</code>]..[[<code>12</code><code>00</code>])</td> </tr><tr> <td>[[<code>12</code><code>31</code>]</td> <td>Dia da semana ([[<code>12</code><code>%e</code>]=Domingo..[[<code>12</code><code>0</code>]=Sábado)</td> </tr><tr> <td>[[<code>12</code><code>31</code>]</td> <td>Ano da semana em que o domingo é o primeiro dia da semana, numérico, quatro dígitos; usado com [[<code>%D</code><code>0th</code>]</td> </tr><tr> <td>[[<code>%D</code><code>0th</code>]</td> <td>Ano da semana, onde segunda-feira é o primeiro dia da semana, numérico, quatro dígitos; usado com [[<code>%D</code><code>2nd</code>]</td> </tr><tr> <td>[[<code>%D</code><code>3rd</code>]</td> <td>Ano, número, quatro dígitos</td> </tr><tr> <td>[[<code>%D</code><code>%d</code>]</td> <td>Ano, numérico (dois dígitos)</td> </tr><tr> <td>[[<code>%D</code><code>00</code>]</td> <td>Um caractere literal [[<code>%D</code><code>31</code>]</td> </tr><tr> <td>[[<code>%D</code><code>%e</code>]</em></code></td> <td><em class="replaceable">[[<code>%D</code><code>0</code>]</em>, para qualquer<span class="quote">“<span class="quote"><em class="replaceable">[[<code>%D</code><code>31</code>]</em></span>”</span>não listado acima</td> </tr></tbody></table>

  Os intervalos para os especificadores de mês e dia começam com zero, devido ao fato de que o MySQL permite o armazenamento de datas incompletas, como `'2014-00-00'`.

  A linguagem usada para nomes de dia e mês e abreviações é controlada pelo valor da variável de sistema `lc_time_names` (Seção 12.16, “Suporte ao Local do Servidor MySQL”).

  Para os especificadores `%U`, `%u`, `%V` e `%v`, consulte a descrição da função `WEEK()` para obter informações sobre os valores do modo. O modo afeta a forma como a numeração da semana ocorre.

  `DATE_FORMAT()` retorna uma string com um conjunto de caracteres e uma ordenação definidos por `character_set_connection` e `collation_connection`, para que possa retornar nomes de mês e dia da semana contendo caracteres não ASCII.

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

- `DATE_SUB(date,INTERVAL expr unit)`

  Veja a descrição para `DATE_ADD()`.

- `DAY(date)`

  `DAY()` é sinônimo de `DAYOFMONTH()`.

- `DAYNAME(date)`

  Retorna o nome do dia da semana para `date`. A linguagem usada para o nome é controlada pelo valor da variável de sistema `lc_time_names` (consulte a Seção 12.16, “Suporte ao Local do Servidor MySQL”). Retorna `NULL` se `date` for `NULL`.

  ```
  mysql> SELECT DAYNAME('2007-02-03');
          -> 'Saturday'
  ```

- `DAYOFMONTH(date)`

  Retorna o dia do mês para `date`, na faixa de `1` a `31` ou `0` para datas como `'0000-00-00'` ou `'2008-00-00'` que têm uma parte do dia zero. Retorna `NULL` se `date` for `NULL`.

  ```
  mysql> SELECT DAYOFMONTH('2007-02-03');
          -> 3
  ```

- `DAYOFWEEK(date)`

  Retorna o índice do dia da semana para `date` (`1` = domingo, `2` = segunda-feira, …, `7` = sábado). Esses valores de índice correspondem ao padrão ODBC. Retorna `NULL` se `date` for `NULL`.

  ```
  mysql> SELECT DAYOFWEEK('2007-02-03');
          -> 7
  ```

- `DAYOFYEAR(date)`

  Retorna o dia do ano para `date`, na faixa de `1` a `366`. Retorna `NULL` se `date` for `NULL`.

  ```
  mysql> SELECT DAYOFYEAR('2007-02-03');
          -> 34
  ```

- `EXTRACT(unit FROM date)`

  A função `EXTRACT()` usa os mesmos tipos de especificadores `unit` que `DATE_ADD()` ou `DATE_SUB()`, mas extrai partes da data em vez de realizar operações aritméticas com a data. Para informações sobre o argumento `unit`, consulte Intervalos Temporais. Retorna `NULL` se `date` for `NULL`.

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

- `FROM_DAYS(N)`

  Dado um número de dia `N`, retorna um valor `DATE`. Retorna `NULL` se `N` for `NULL`.

  ```
  mysql> SELECT FROM_DAYS(730669);
          -> '2000-07-03'
  ```

  Use `FROM_DAYS()` com cautela em datas antigas. Ele não é destinado para uso com valores que precedem o advento do calendário gregoriano (1582). Veja a Seção 13.2.7, “Qual calendário é usado pelo MySQL?”.

- `FROM_UNIXTIME(unix_timestamp[,format])`

  Retorna uma representação de `unix_timestamp` como um valor de data/hora ou string de caracteres. O valor retornado é expresso usando o fuso horário da sessão. (Os clientes podem definir o fuso horário da sessão conforme descrito na Seção 7.1.15, “Suporte ao Fuso Horário do MySQL Server”.) `unix_timestamp` é um valor de timestamp interno que representa segundos desde o `'1970-01-01 00:00:00'` UTC, como produzido pela função `UNIX_TIMESTAMP()`.

  Se `format` for omitido, essa função retorna um valor `DATETIME`.

  Se `unix_timestamp` ou `format` for `NULL`, esta função retorna `NULL`.

  Se `unix_timestamp` for um inteiro, a precisão de segundos fracionários do `DATETIME` é zero. Quando `unix_timestamp` for um valor decimal, a precisão de segundos fracionários do `DATETIME` será a mesma da precisão do valor decimal, até um máximo de 6. Quando `unix_timestamp` for um número de ponto flutuante, a precisão de segundos fracionários do datetime será de 6.

  Em plataformas de 32 bits, o valor máximo útil para `unix_timestamp` é 2147483647.999999, que retorna `'2038-01-19 03:14:07.999999'` UTC. Em plataformas de 64 bits com o MySQL 8.0.28 ou posterior, o valor máximo efetivo é 32536771199.999999, que retorna `'3001-01-18 23:59:59.999999'` UTC. Independentemente da plataforma ou versão, um valor maior para `unix_timestamp` do que o máximo efetivo retorna `0`.

  `format` é usado para formatar o resultado da mesma forma que a string de formato usada para a função `DATE_FORMAT()`. Se `format` for fornecido, o valor retornado é um `VARCHAR`.

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

  Se você usar `UNIX_TIMESTAMP()` e `FROM_UNIXTIME()` para converter entre valores em um fuso horário não UTC e valores de timestamp Unix, a conversão é perda de dados porque a correspondência não é um para um em ambas as direções. Para obter detalhes, consulte a descrição da função `UNIX_TIMESTAMP()`.

- `GET_FORMAT({DATE|TIME|DATETIME}, {'EUR'|'USA'|'JIS'|'ISO'|'INTERNAL'})`

  Retorna uma string de formato. Esta função é útil em combinação com as funções `DATE_FORMAT()` e `STR_TO_DATE()`.

  Se `format` for `NULL`, esta função retorna `NULL`.

  Os possíveis valores para o primeiro e segundo argumentos resultam em várias strings de formato possíveis (para os especificadores usados, consulte a tabela na descrição da função `DATE_FORMAT()`). O formato ISO refere-se à ISO 9715, não à ISO 8601.

  <table summary="As funções solicitam a função GET_FORMAT, juntamente com os resultados de cada chamada de função."><thead><tr> <th>Chamada de função</th> <th>Resultado</th> </tr></thead><tbody><tr> <td>[[PH_HTML_CODE_<code>GET_FORMAT(DATETIME,'USA')</code>]</td> <td>[[PH_HTML_CODE_<code>GET_FORMAT(DATETIME,'USA')</code>]</td> </tr><tr> <td>[[PH_HTML_CODE_<code>GET_FORMAT(DATETIME,'JIS')</code>]</td> <td>[[PH_HTML_CODE_<code>'%Y-%m-%d %H:%i:%s'</code>]</td> </tr><tr> <td>[[PH_HTML_CODE_<code>GET_FORMAT(DATETIME,'ISO')</code>]</td> <td>[[PH_HTML_CODE_<code>'%Y-%m-%d %H:%i:%s'</code>]</td> </tr><tr> <td>[[PH_HTML_CODE_<code>GET_FORMAT(DATETIME,'EUR')</code>]</td> <td>[[PH_HTML_CODE_<code>'%Y-%m-%d %H.%i.%s'</code>]</td> </tr><tr> <td>[[PH_HTML_CODE_<code>GET_FORMAT(DATETIME,'INTERNAL')</code>]</td> <td>[[PH_HTML_CODE_<code>'%Y%m%d%H%i%s'</code>]</td> </tr><tr> <td>[[<code>GET_FORMAT(DATETIME,'USA')</code>]]</td> <td>[[<code>'%m.%d.%Y'</code><code>GET_FORMAT(DATETIME,'USA')</code>]</td> </tr><tr> <td>[[<code>GET_FORMAT(DATETIME,'JIS')</code>]]</td> <td>[[<code>'%Y-%m-%d %H:%i:%s'</code>]]</td> </tr><tr> <td>[[<code>GET_FORMAT(DATETIME,'ISO')</code>]]</td> <td>[[<code>'%Y-%m-%d %H:%i:%s'</code>]]</td> </tr><tr> <td>[[<code>GET_FORMAT(DATETIME,'EUR')</code>]]</td> <td>[[<code>'%Y-%m-%d %H.%i.%s'</code>]]</td> </tr><tr> <td>[[<code>GET_FORMAT(DATETIME,'INTERNAL')</code>]]</td> <td>[[<code>'%Y%m%d%H%i%s'</code>]]</td> </tr><tr> <td>[[<code>GET_FORMAT(DATE,'JIS')</code><code>GET_FORMAT(DATETIME,'USA')</code>]</td> <td>[[<code>GET_FORMAT(DATE,'JIS')</code><code>GET_FORMAT(DATETIME,'USA')</code>]</td> </tr><tr> <td>[[<code>GET_FORMAT(DATE,'JIS')</code><code>GET_FORMAT(DATETIME,'JIS')</code>]</td> <td>[[<code>GET_FORMAT(DATE,'JIS')</code><code>'%Y-%m-%d %H:%i:%s'</code>]</td> </tr><tr> <td>[[<code>GET_FORMAT(DATE,'JIS')</code><code>GET_FORMAT(DATETIME,'ISO')</code>]</td> <td>[[<code>GET_FORMAT(DATE,'JIS')</code><code>'%Y-%m-%d %H:%i:%s'</code>]</td> </tr><tr> <td>[[<code>GET_FORMAT(DATE,'JIS')</code><code>GET_FORMAT(DATETIME,'EUR')</code>]</td> <td>[[<code>GET_FORMAT(DATE,'JIS')</code><code>'%Y-%m-%d %H.%i.%s'</code>]</td> </tr><tr> <td>[[<code>GET_FORMAT(DATE,'JIS')</code><code>GET_FORMAT(DATETIME,'INTERNAL')</code>]</td> <td>[[<code>GET_FORMAT(DATE,'JIS')</code><code>'%Y%m%d%H%i%s'</code>]</td> </tr></tbody></table>

  `TIMESTAMP` também pode ser usado como o primeiro argumento para `GET_FORMAT()`, nesse caso, a função retorna os mesmos valores que para `DATETIME`.

  ```
  mysql> SELECT DATE_FORMAT('2003-10-03',GET_FORMAT(DATE,'EUR'));
          -> '03.10.2003'
  mysql> SELECT STR_TO_DATE('10.31.2003',GET_FORMAT(DATE,'USA'));
          -> '2003-10-31'
  ```

- `HOUR(time)`

  Retorna a hora para `time`. O intervalo do valor de retorno é `0` a `23` para valores de hora do dia. No entanto, o intervalo dos valores de `TIME` é realmente muito maior, então `HOUR` pode retornar valores maiores que `23`. Retorna `NULL` se `time` for `NULL`.

  ```
  mysql> SELECT HOUR('10:05:03');
          -> 10
  mysql> SELECT HOUR('272:59:59');
          -> 272
  ```

- `LAST_DAY(date)`

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

- `LOCALTIME`, `LOCALTIME([fsp])`

  `LOCALTIME` e `LOCALTIME()` são sinônimos de `NOW()`.

- `LOCALTIMESTAMP`, `LOCALTIMESTAMP([fsp])`

  `LOCALTIMESTAMP` e `LOCALTIMESTAMP()` são sinônimos de `NOW()`.

- `MAKEDATE(year,dayofyear)`

  Retorna uma data, com base em valores de ano e dia do ano. `dayofyear` deve ser maior que 0 ou o resultado é `NULL`. O resultado também é `NULL` se qualquer um dos argumentos for `NULL`.

  ```
  mysql> SELECT MAKEDATE(2011,31), MAKEDATE(2011,32);
          -> '2011-01-31', '2011-02-01'
  mysql> SELECT MAKEDATE(2011,365), MAKEDATE(2014,365);
          -> '2011-12-31', '2014-12-31'
  mysql> SELECT MAKEDATE(2011,0);
          -> NULL
  ```

- `MAKETIME(hour,minute,second)`

  Retorna um valor de tempo calculado a partir dos argumentos `hour`, `minute` e `second`. Retorna `NULL` se qualquer um dos seus argumentos for `NULL`.

  O argumento `second` pode ter uma parte fracionária.

  ```
  mysql> SELECT MAKETIME(12,15,30);
          -> '12:15:30'
  ```

- `MICROSECOND(expr)`

  Retorna os microsegundos a partir da expressão de data e hora `expr` como um número no intervalo de `0` a `999999`. Retorna `NULL` se `expr` for `NULL`.

  ```
  mysql> SELECT MICROSECOND('12:00:00.123456');
          -> 123456
  mysql> SELECT MICROSECOND('2019-12-31 23:59:59.000010');
          -> 10
  ```

- `MINUTE(time)`

  Retorna o minuto para `time`, na faixa de `0` a `59` ou `NULL` se `time` for `NULL`.

  ```
  mysql> SELECT MINUTE('2008-02-03 10:05:03');
          -> 5
  ```

- `MONTH(date)`

  Retorna o mês para `date`, na faixa de `1` a `12` para janeiro a dezembro, ou `0` para datas como `'0000-00-00'` ou `'2008-00-00'` que têm uma parte de mês zero. Retorna `NULL` se `date` for `NULL`.

  ```
  mysql> SELECT MONTH('2008-02-03');
          -> 2
  ```

- `MONTHNAME(date)`

  Retorna o nome completo do mês para `date`. A linguagem usada para o nome é controlada pelo valor da variável de sistema `lc_time_names` (Seção 12.16, “Suporte ao Local do Servidor MySQL”). Retorna `NULL` se `date` for `NULL`.

  ```
  mysql> SELECT MONTHNAME('2008-02-03');
          -> 'February'
  ```

- `NOW([fsp])`

  Retorna a data e hora atuais como um valor no formato `'YYYY-MM-DD hh:mm:ss'` ou `YYYYMMDDhhmmss`, dependendo se a função é usada em contexto de string ou numérico. O valor é expresso no fuso horário da sessão.

  Se o argumento `fsp` for fornecido para especificar uma precisão de segundos fracionários de 0 a 6, o valor de retorno inclui uma parte de segundos fracionários com tantos dígitos quanto especificado.

  ```
  mysql> SELECT NOW();
          -> '2007-12-15 23:50:26'
  mysql> SELECT NOW() + 0;
          -> 20071215235026.000000
  ```

  `NOW()` retorna um tempo constante que indica o momento em que a instrução começou a ser executada. (Dentro de uma função armazenada ou gatilho, `NOW()` retorna o momento em que a função ou a instrução de gatilho começou a ser executada.) Isso difere do comportamento de `SYSDATE()`, que retorna o tempo exato em que ele é executado.

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

  Além disso, a declaração `SET TIMESTAMP` afeta o valor retornado por `NOW()`, mas não por `SYSDATE()`. Isso significa que as configurações de data e hora no log binário não têm efeito nas invocações de `SYSDATE()`. Definir a data e hora para um valor não nulo faz com que cada invocação subsequente de `NOW()` retorne esse valor. Definir a data e hora para zero cancela esse efeito, de modo que `NOW()` novamente retorne a data e hora atuais.

  Consulte a descrição de `SYSDATE()` para obter informações adicionais sobre as diferenças entre as duas funções.

- `PERIOD_ADD(P,N)`

  Aumenta `N` meses ao período `P` (no formato `YYMM` ou `YYYYMM`). Retorna um valor no formato `YYYYMM`.

  Nota

  O argumento de período `P` *não* é um valor de data.

  Essa função retorna `NULL` se `P` ou `N` for `NULL`.

  ```
  mysql> SELECT PERIOD_ADD(200801,2);
          -> 200803
  ```

- `PERIOD_DIFF(P1,P2)`

  Retorna o número de meses entre os períodos `P1` e `P2`. `P1` e `P2` devem estar no formato `YYMM` ou `YYYYMM`. Observe que os argumentos de período `P1` e `P2` *não* são valores de data.

  Essa função retorna `NULL` se `P1` ou `P2` for `NULL`.

  ```
  mysql> SELECT PERIOD_DIFF(200802,200703);
          -> 11
  ```

- `QUARTER(date)`

  Retorna o trimestre do ano para `date`, na faixa de `1` a `4` ou `NULL` se `date` for `NULL`.

  ```
  mysql> SELECT QUARTER('2008-04-01');
          -> 2
  ```

- `SECOND(time)`

  Retorna o segundo para `time`, na faixa de `0` a `59` ou `NULL` se `time` for `NULL`.

  ```
  mysql> SELECT SECOND('10:05:03');
          -> 3
  ```

- `SEC_TO_TIME(seconds)`

  Retorna o argumento `seconds`, convertido em horas, minutos e segundos, como um valor `TIME`. A faixa do resultado é limitada à do tipo de dados `TIME`. Um aviso é exibido se o argumento corresponder a um valor fora dessa faixa.

  A função retorna `NULL` se `seconds` for `NULL`.

  ```
  mysql> SELECT SEC_TO_TIME(2378);
          -> '00:39:38'
  mysql> SELECT SEC_TO_TIME(2378) + 0;
          -> 3938
  ```

- `STR_TO_DATE(str,format)`

  Este é o inverso da função `DATE_FORMAT()`. Ela recebe uma string `str` e uma string de formato `format`. `STR_TO_DATE()` retorna um valor `DATETIME` se a string de formato contiver partes de data e hora, ou um valor `DATE` ou `TIME` se a string contiver apenas partes de data ou hora. Se `str` ou `format` for `NULL`, a função retorna `NULL`. Se o valor de data, hora ou datetime extraído de `str` não puder ser analisado de acordo com as regras seguidas pelo servidor, `STR_TO_DATE()` retorna `NULL` e emite uma mensagem de aviso.

  O servidor verifica `str` tentando combinar `format` com ele. A string de formato pode conter caracteres literais e especificadores de formato que começam com `%`. Os caracteres literais em `format` devem corresponder literalmente em `str`. Os especificadores de formato em `format` devem corresponder a uma parte de data ou hora em `str`. Para os especificadores que podem ser usados em `format`, consulte a descrição da função `DATE_FORMAT()`.

  ```
  mysql> SELECT STR_TO_DATE('01,5,2013','%d,%m,%Y');
          -> '2013-05-01'
  mysql> SELECT STR_TO_DATE('May 1, 2013','%M %d,%Y');
          -> '2013-05-01'
  ```

  A varredura começa no início de `str` e falha se `format` não corresponder. Os caracteres extras no final de `str` são ignorados.

  ```
  mysql> SELECT STR_TO_DATE('a09:30:17','a%h:%i:%s');
          -> '09:30:17'
  mysql> SELECT STR_TO_DATE('a09:30:17','%h:%i:%s');
          -> NULL
  mysql> SELECT STR_TO_DATE('09:30:17a','%h:%i:%s');
          -> '09:30:17'
  ```

  As partes de data ou hora não especificadas têm um valor de 0, portanto, valores incompletamente especificados em `str` produzem um resultado com algumas ou todas as partes definidas como 0:

  ```
  mysql> SELECT STR_TO_DATE('abc','abc');
          -> '0000-00-00'
  mysql> SELECT STR_TO_DATE('9','%m');
          -> '0000-09-00'
  mysql> SELECT STR_TO_DATE('9','%s');
          -> '00:00:09'
  ```

  A verificação de intervalo das partes dos valores de data é conforme descrito na Seção 13.2.2, “Os tipos DATE, DATETIME e TIMESTAMP”. Isso significa, por exemplo, que datas “zero” ou datas com valores de parte de 0 são permitidas, a menos que o modo SQL esteja configurado para não permitir tais valores.

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

  Antes do MySQL 8.0.35, era possível passar uma string de data inválida, como `'2021-11-31'`, para essa função. No MySQL 8.0.35 e versões posteriores, `STR_TO_DATE()` realiza verificação completa de intervalo e levanta um erro se a data após a conversão for inválida.

  Nota

  Você não pode usar o formato `"%X%V"` para converter uma string de ano-semana em uma data, porque a combinação de um ano e uma semana não identifica de forma única um ano e um mês se a semana atravessar uma fronteira de mês. Para converter um ano-semana em uma data, você também deve especificar o dia da semana:

  ```
  mysql> SELECT STR_TO_DATE('200442 Monday', '%X%V %W');
          -> '2004-10-18'
  ```

  Você também deve estar ciente de que, para datas e partes da data de valores datetime, `STR_TO_DATE()` verifica (apenas) o ano, mês e dia do mês individualmente para validade. Mais precisamente, isso significa que o ano é verificado para garantir que esteja no intervalo de 0-9999, inclusive, o mês é verificado para garantir que esteja no intervalo de 1-12, inclusive, e o dia do mês é verificado para garantir que esteja no intervalo de 1-31, inclusive, mas o servidor não verifica os valores em combinação. Por exemplo, `SELECT STR_TO_DATE('23-2-31', '%Y-%m-%d')` retorna `2023-02-31`. Ativação ou desativação do modo SQL do servidor `ALLOW_INVALID_DATES` não tem efeito sobre esse comportamento. Consulte a Seção 13.2.2, “Os tipos DATE, DATETIME e TIMESTAMP”, para obter mais informações.

- `SUBDATE(date,INTERVAL expr unit)`, `SUBDATE(expr,days)`

  Quando invocado com a forma `INTERVAL` do segundo argumento, `SUBDATE()` é sinônimo de `DATE_SUB()`. Para informações sobre o argumento \*`INTERVAL` `unit`, consulte a discussão sobre `DATE_ADD()`.

  ```
  mysql> SELECT DATE_SUB('2008-01-02', INTERVAL 31 DAY);
          -> '2007-12-02'
  mysql> SELECT SUBDATE('2008-01-02', INTERVAL 31 DAY);
          -> '2007-12-02'
  ```

  A segunda forma permite o uso de um valor inteiro para `days`. Nesse caso, ele é interpretado como o número de dias a serem subtraídos da data ou expressão de data e hora `expr`.

  ```
  mysql> SELECT SUBDATE('2008-01-02 12:00:00', 31);
          -> '2007-12-02 12:00:00'
  ```

  Essa função retorna `NULL` se qualquer um de seus argumentos for `NULL`.

- `SUBTIME(expr1,expr2)`

  `SUBTIME()` retorna `expr1` − `expr2` expresso como um valor no mesmo formato que `expr1`. `expr1` é uma expressão de tempo ou data e hora, e `expr2` é uma expressão de data e hora.

  A resolução do tipo de retorno dessa função é realizada da mesma forma que para a função `ADDTIME()`; consulte a descrição dessa função para obter mais informações.

  ```
  mysql> SELECT SUBTIME('2007-12-31 23:59:59.999999','1 1:1:1.000002');
          -> '2007-12-30 22:58:58.999997'
  mysql> SELECT SUBTIME('01:00:00.999999', '02:00:00.999998');
          -> '-00:59:59.999999'
  ```

  Essa função retorna `NULL` se `expr1` ou `expr2` for `NULL`.

- `SYSDATE([fsp])`

  Retorna a data e hora atuais como um valor no formato `'YYYY-MM-DD hh:mm:ss'` ou `YYYYMMDDhhmmss`, dependendo se a função é usada em contexto de string ou numérico.

  Se o argumento `fsp` for fornecido para especificar uma precisão de segundos fracionários de 0 a 6, o valor de retorno inclui uma parte de segundos fracionários com tantos dígitos quanto especificado.

  `SYSDATE()` retorna o momento em que ele é executado. Isso difere do comportamento de `NOW()`, que retorna um tempo constante que indica o momento em que a instrução começou a ser executada. (Dentro de uma função armazenada ou gatilho, `NOW()` retorna o momento em que a função ou a instrução de gatilho começou a ser executada.)

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

  Além disso, a declaração `SET TIMESTAMP` afeta o valor retornado por `NOW()`, mas não por `SYSDATE()`. Isso significa que as configurações de marcação de tempo no log binário não têm efeito nas invocações de `SYSDATE()`.

  Como o `SYSDATE()` pode retornar valores diferentes mesmo dentro da mesma instrução e não é afetado pelo `SET TIMESTAMP`, ele é não determinístico e, portanto, inseguro para replicação se o registro binário baseado em instruções for usado. Se isso for um problema, você pode usar o registro baseado em linhas.

  Alternativamente, você pode usar a opção `--sysdate-is-now` para fazer com que `SYSDATE()` seja um alias para `NOW()`. Isso funciona se a opção for usada tanto no servidor de origem da replicação quanto na replica.

  A natureza não determinística do `SYSDATE()` também significa que os índices não podem ser usados para avaliar expressões que se referem a ele.

- `TIME(expr)`

  Extrai a parte de tempo da expressão de data e hora `expr` e retorna como uma string. Retorna `NULL` se `expr` for `NULL`.

  Essa função não é segura para a replicação baseada em declarações. Um aviso é registrado se você usar essa função quando `binlog_format` estiver definido como `STATEMENT`.

  ```
  mysql> SELECT TIME('2003-12-31 01:02:03');
          -> '01:02:03'
  mysql> SELECT TIME('2003-12-31 01:02:03.000123');
          -> '01:02:03.000123'
  ```

- `TIMEDIFF(expr1,expr2)`

  `TIMEDIFF()` retorna `expr1` − `expr2` expresso como um valor de tempo. `expr1` e `expr2` são strings que são convertidas em expressões de `TIME` ou `DATETIME`; essas devem ser do mesmo tipo após a conversão. Retorna `NULL` se `expr1` ou `expr2` for `NULL`.

  O resultado retornado por `TIMEDIFF()` está limitado ao intervalo permitido para os valores de `TIME`. Alternativamente, você pode usar qualquer uma das funções `TIMESTAMPDIFF()` e `UNIX_TIMESTAMP()`, ambas as quais retornam inteiros.

  ```
  mysql> SELECT TIMEDIFF('2000-01-01 00:00:00',
      ->                 '2000-01-01 00:00:00.000001');
          -> '-00:00:00.000001'
  mysql> SELECT TIMEDIFF('2008-12-31 23:59:59.000001',
      ->                 '2008-12-30 01:01:01.000002');
          -> '46:58:57.999999'
  ```

- `TIMESTAMP(expr)`, `TIMESTAMP(expr1,expr2)`

  Com um único argumento, essa função retorna a expressão de data ou datetime `expr` como um valor datetime. Com dois argumentos, ela adiciona a expressão de hora `expr2` à expressão de data ou datetime `expr1` e retorna o resultado como um valor datetime. Retorna `NULL` se `expr`, `expr1` ou `expr2` for `NULL`.

  ```
  mysql> SELECT TIMESTAMP('2003-12-31');
          -> '2003-12-31 00:00:00'
  mysql> SELECT TIMESTAMP('2003-12-31 12:00:00','12:00:00');
          -> '2004-01-01 00:00:00'
  ```

- `TIMESTAMPADD(unit,interval,datetime_expr)`

  A soma da expressão inteira `interval` com a expressão de data ou hora `datetime_expr`. A unidade para `interval` é determinada pelo argumento `unit`, que deve ser um dos seguintes valores: `MICROSECOND` (microsegundos), `SECOND`, `MINUTE`, `HOUR`, `DAY`, `WEEK`, `MONTH`, `QUARTER` ou `YEAR`.

  O valor `unit` pode ser especificado usando uma das palavras-chave conforme mostrado, ou com um prefixo de `SQL_TSI_`. Por exemplo, `DAY` e `SQL_TSI_DAY` são ambos válidos.

  Essa função retorna `NULL` se `interval` ou `datetime_expr` for `NULL`.

  ```
  mysql> SELECT TIMESTAMPADD(MINUTE, 1, '2003-01-02');
          -> '2003-01-02 00:01:00'
  mysql> SELECT TIMESTAMPADD(WEEK,1,'2003-01-02');
          -> '2003-01-09'
  ```

  Ao adicionar um intervalo `MONTH` a um valor `DATE` ou `DATETIME` e a data resultante incluir um dia que não existe no mês fornecido, o dia é ajustado para o último dia do mês, conforme mostrado aqui:

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

- `TIMESTAMPDIFF(unit,datetime_expr1,datetime_expr2)`

  Retornar `datetime_expr2` − `datetime_expr1`, onde `datetime_expr1` e `datetime_expr2` são expressões de data ou datetime. Uma expressão pode ser uma data e a outra um datetime; um valor de data é tratado como um datetime com a parte de hora `'00:00:00'` quando necessário. A unidade para o resultado (um inteiro) é dada pelo argumento `unit`. Os valores legais para `unit` são os mesmos listados na descrição da função `TIMESTAMPADD()`.

  Essa função retorna `NULL` se `datetime_expr1` ou `datetime_expr2` for `NULL`.

  ```
  mysql> SELECT TIMESTAMPDIFF(MONTH,'2003-02-01','2003-05-01');
          -> 3
  mysql> SELECT TIMESTAMPDIFF(YEAR,'2002-05-01','2001-01-01');
          -> -1
  mysql> SELECT TIMESTAMPDIFF(MINUTE,'2003-02-01','2003-05-01 12:05:55');
          -> 128885
  ```

  Nota

  A ordem dos argumentos de data ou datetime para essa função é o oposto da usada com a função `TIMESTAMP()` quando invocada com 2 argumentos.

- `TIME_FORMAT(time,format)`

  Isto é usado como a função `DATE_FORMAT()` (código de hora), mas a string `format` pode conter especificadores de formato apenas para horas, minutos, segundos e microsegundos. Outros especificadores produzem um `NULL` ou `0`. `TIME_FORMAT()` retorna `NULL` se `time` ou `format` for `NULL`.

  Se o valor de `time` contiver uma parte da hora que é maior que `23`, os especificadores de formato de hora `%H` e `%k` produzem um valor maior que o intervalo usual de `0..23`. Os outros especificadores de formato de hora produzem o valor da hora módulo 12.

  ```
  mysql> SELECT TIME_FORMAT('100:00:00', '%H %k %h %I %l');
          -> '100 100 04 04 4'
  ```

- `TIME_TO_SEC(time)`

  Retorna o argumento `time`, convertido em segundos. Retorna `NULL` se `time` for `NULL`.

  ```
  mysql> SELECT TIME_TO_SEC('22:23:00');
          -> 80580
  mysql> SELECT TIME_TO_SEC('00:39:38');
          -> 2378
  ```

- `TO_DAYS(date)`

  Dado uma data `date`, retorna um número de dia (o número de dias desde o ano 0). Retorna `NULL` se `date` for `NULL`.

  ```
  mysql> SELECT TO_DAYS(950501);
          -> 728779
  mysql> SELECT TO_DAYS('2007-10-07');
          -> 733321
  ```

  `TO_DAYS()` não é destinado para uso com valores que precedem o advento do calendário gregoriano (1582), porque ele não leva em conta os dias que foram perdidos quando o calendário foi alterado. Para datas anteriores a 1582 (e possivelmente um ano posterior em outros locais), os resultados dessa função não são confiáveis. Consulte a Seção 13.2.7, “Qual calendário é usado pelo MySQL?”, para obter detalhes.

  Lembre-se de que o MySQL converte valores de ano de duas casas decimais em datas para a forma de quatro casas decimais usando as regras na Seção 13.2, “Tipos de Dados de Data e Hora”. Por exemplo, `'2008-10-07'` e `'08-10-07'` são vistos como datas idênticas:

  ```
  mysql> SELECT TO_DAYS('2008-10-07'), TO_DAYS('08-10-07');
          -> 733687, 733687
  ```

  No MySQL, a data zero é definida como `'0000-00-00'`, embora essa data seja considerada inválida. Isso significa que, para `'0000-00-00'` e `'0000-01-01'`, `TO_DAYS()` retorna os valores mostrados aqui:

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

  Isso é verdade, independentemente de o modo de servidor SQL `ALLOW_INVALID_DATES` estar habilitado ou

- `TO_SECONDS(expr)`

  Dado uma data ou datetime `expr`, retorna o número de segundos desde o ano 0. Se `expr` não for um valor de data ou datetime válido (incluindo `NULL`), ele retorna `NULL`.

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

  Assim como `TO_DAYS()`, `TO_SECONDS()` não é destinado para uso com valores que precedem o advento do calendário gregoriano (1582), porque ele não leva em conta os dias que foram perdidos quando o calendário foi alterado. Para datas anteriores a 1582 (e possivelmente um ano posterior em outros locais), os resultados dessa função não são confiáveis. Consulte a Seção 13.2.7, “Qual calendário é usado pelo MySQL?”, para obter detalhes.

  Assim como `TO_DAYS()`, `TO_SECONDS()`, o \[\[PH\_CODE\_2]] converte valores de ano de duas casas decimais em datas para a forma de quatro casas decimais, seguindo as regras da Seção 13.2, “Tipos de dados de data e hora”.

  No MySQL, a data zero é definida como `'0000-00-00'`, embora essa data seja considerada inválida. Isso significa que, para `'0000-00-00'` e `'0000-01-01'`, `TO_SECONDS()` retorna os valores mostrados aqui:

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

  Isso é verdade, independentemente de o modo de servidor SQL `ALLOW_INVALID_DATES` estar habilitado ou

- `UNIX_TIMESTAMP([date])`

  Se `UNIX_TIMESTAMP()` for chamado sem o argumento `date`, ele retornará um timestamp Unix que representa segundos desde `'1970-01-01 00:00:00'` UTC.

  Se `UNIX_TIMESTAMP()` for chamado com um argumento `date`, ele retorna o valor do argumento em segundos desde `'1970-01-01 00:00:00'` UTC. O servidor interpreta `date` como um valor no fuso horário da sessão e o converte em um valor de timestamp Unix interno em UTC. (Os clientes podem definir o fuso horário da sessão conforme descrito na Seção 7.1.15, “Suporte ao Fuso Horário do MySQL Server”.) O argumento `date` pode ser uma string de `DATE`, `DATETIME` ou `TIMESTAMP`, ou um número no formato `YYMMDD`, `YYMMDDhhmmss`, `YYYYMMDD` ou `YYYYMMDDhhmmss`. Se o argumento incluir uma parte de hora, ele pode opcionalmente incluir uma parte de segundos fracionários.

  O valor de retorno é um inteiro se nenhum argumento for fornecido ou se o argumento não incluir uma parte de segundos fracionários, ou `DECIMAL` - DECIMAL, NUMERIC") se um argumento for fornecido que inclua uma parte de segundos fracionários.

  Quando o argumento `date` é uma coluna `TIMESTAMP`, `UNIX_TIMESTAMP()` retorna o valor do timestamp interno diretamente, sem a conversão implícita de “string para timestamp Unix”.

  Antes do MySQL 8.0.28, o intervalo válido de valores de argumento é o mesmo que para o tipo de dados `TIMESTAMP`: `'1970-01-01 00:00:01.000000'` UTC a `'2038-01-19 03:14:07.999999'` UTC. Este é também o caso no MySQL 8.0.28 e versões posteriores para plataformas de 32 bits. Para o MySQL 8.0.28 e versões posteriores em plataformas de 64 bits, o intervalo válido de valores de argumento para `UNIX_TIMESTAMP()` é `'1970-01-01 00:00:01.000000'` UTC a `'3001-01-19 03:14:07.999999'` UTC (correspondente a 32536771199,999999 segundos).

  Independentemente da versão do MySQL ou da arquitetura da plataforma, se você passar uma data fora do intervalo para `UNIX_TIMESTAMP()`, ele retornará `0`. Se `date` for `NULL`, ele retornará `NULL`.

  ```
  mysql> SELECT UNIX_TIMESTAMP();
          -> 1447431666
  mysql> SELECT UNIX_TIMESTAMP('2015-11-13 10:20:19');
          -> 1447431619
  mysql> SELECT UNIX_TIMESTAMP('2015-11-13 10:20:19.012');
          -> 1447431619.012
  ```

  Se você usar `UNIX_TIMESTAMP()` e `FROM_UNIXTIME()` para converter entre valores em um fuso horário não UTC e valores de timestamp Unix, a conversão é perda de dados porque a correspondência não é um para um em ambas as direções. Por exemplo, devido a convenções para mudanças de fuso horário local, como o horário de verão (DST), é possível que `UNIX_TIMESTAMP()` mapeie dois valores que são distintos em um fuso horário não UTC para o mesmo valor de timestamp Unix. `FROM_UNIXTIME()` mapeia esse valor de volta para apenas um dos valores originais. Aqui está um exemplo, usando valores que são distintos no fuso horário `MET`:

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

  Para usar fusos horários nomeados, como `'MET'` ou `'Europe/Amsterdam'`, as tabelas de fusos horários devem ser configuradas corretamente. Para obter instruções, consulte a Seção 7.1.15, “Suporte ao Fuso Horário do MySQL Server”.

  Se você quiser subtrair colunas `UNIX_TIMESTAMP()`, talvez queira convertê-las em inteiros assinados. Veja a Seção 14.10, “Funções e Operadores de Conversão”.

- `UTC_DATE`, `UTC_DATE()`

  Retorna a data atual UTC como um valor no formato `'YYYY-MM-DD'` ou `YYYYMMDD`, dependendo se a função é usada em contexto de string ou numérico.

  ```
  mysql> SELECT UTC_DATE(), UTC_DATE() + 0;
          -> '2003-08-14', 20030814
  ```

- `UTC_TIME`, `UTC_TIME([fsp])`

  Retorna a hora UTC atual como um valor no formato `'hh:mm:ss'` ou `hhmmss`, dependendo se a função é usada em contexto de string ou numérico.

  Se o argumento `fsp` for fornecido para especificar uma precisão de segundos fracionários de 0 a 6, o valor de retorno inclui uma parte de segundos fracionários com tantos dígitos quanto especificado.

  ```
  mysql> SELECT UTC_TIME(), UTC_TIME() + 0;
          -> '18:07:53', 180753.000000
  ```

- `UTC_TIMESTAMP`, `UTC_TIMESTAMP([fsp])`

  Retorna a data e hora atuais em UTC como um valor no formato `'YYYY-MM-DD hh:mm:ss'` ou `YYYYMMDDhhmmss`, dependendo se a função é usada em contexto de string ou numérico.

  Se o argumento `fsp` for fornecido para especificar uma precisão de segundos fracionários de 0 a 6, o valor de retorno inclui uma parte de segundos fracionários com tantos dígitos quanto especificado.

  ```
  mysql> SELECT UTC_TIMESTAMP(), UTC_TIMESTAMP() + 0;
          -> '2003-08-14 18:08:04', 20030814180804.000000
  ```

- `WEEK(date[,mode])`

  Essa função retorna o número da semana para `date`. A forma de dois argumentos de `WEEK()` permite que você especifique se a semana começa no domingo ou no domingo e se o valor de retorno deve estar no intervalo de `0` a `53` ou de `1` a `53`. Se o argumento `mode` for omitido, o valor da variável de sistema `default_week_format` é usado. Veja a Seção 7.1.8, “Variáveis do Sistema do Servidor”. Para um valor de data de `NULL`, a função retorna `NULL`.

  A tabela a seguir descreve como o argumento `mode` funciona.

  <table summary="Agora o argumento de modo da função WEEK funciona. Para cada valor de modo, a tabela lista o primeiro dia da semana, a faixa e uma descrição da semana 1."><thead><tr> <th scope="col">Modo</th> <th scope="col">Primeiro dia da semana</th> <th scope="col">Gama</th> <th scope="col">A primeira semana é a primeira semana...</th> </tr></thead><tbody><tr> <th>0</th> <td>Domingo</td> <td>0-53</td> <td>com um domingo neste ano</td> </tr><tr> <th>1</th> <td>Segunda-feira</td> <td>0-53</td> <td>com 4 ou mais dias este ano</td> </tr><tr> <th>2</th> <td>Domingo</td> <td>1-53</td> <td>com um domingo neste ano</td> </tr><tr> <th>3</th> <td>Segunda-feira</td> <td>1-53</td> <td>com 4 ou mais dias este ano</td> </tr><tr> <th>4</th> <td>Domingo</td> <td>0-53</td> <td>com 4 ou mais dias este ano</td> </tr><tr> <th>5</th> <td>Segunda-feira</td> <td>0-53</td> <td>com um domingo neste ano</td> </tr><tr> <th>6</th> <td>Domingo</td> <td>1-53</td> <td>com 4 ou mais dias este ano</td> </tr><tr> <th>7</th> <td>Segunda-feira</td> <td>1-53</td> <td>com um domingo neste ano</td> </tr></tbody></table>

  Para os valores de `mode` com o significado de “com 4 ou mais dias este ano”, as semanas são numeradas de acordo com a norma ISO 8601:1988:

  - Se a semana que contém o dia 1 de janeiro tiver 4 dias ou mais no novo ano, ela será a semana 1.

  - Caso contrário, é a última semana do ano anterior, e a próxima semana é a semana 1.

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

  Se uma data cair na última semana do ano anterior, o MySQL retorna `0` se você não usar `2`, `3`, `6` ou `7` como o argumento opcional `mode`:

  ```
  mysql> SELECT YEAR('2000-01-01'), WEEK('2000-01-01',0);
          -> 2000, 0
  ```

  Pode-se argumentar que `WEEK()` deveria retornar `52` porque a data fornecida ocorre na 52ª semana de 1999. `WEEK()` retorna `0` em vez disso, para que o valor de retorno seja “o número da semana no ano fornecido”. Isso torna o uso da função `WEEK()` confiável quando combinada com outras funções que extraem uma parte da data de uma data.

  Se você preferir um resultado avaliado em relação ao ano que contém o primeiro dia da semana para a data fornecida, use `0`, `2`, `5` ou `7` como o argumento opcional `mode`.

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

- `WEEKDAY(date)`

  Retorna o índice do dia da semana para `date` (`0` = Segunda-feira, `1` = Terça-feira, … `6` = Domingo). Retorna `NULL` se `date` for `NULL`.

  ```
  mysql> SELECT WEEKDAY('2008-02-03 22:23:00');
          -> 6
  mysql> SELECT WEEKDAY('2007-11-06');
          -> 1
  ```

- `WEEKOFYEAR(date)`

  Retorna a semana do calendário da data como um número no intervalo de `1` a `53`. Retorna `NULL` se `date` for `NULL`.

  `WEEKOFYEAR()` é uma função de compatibilidade que é equivalente a `WEEK(date,3)`.

  ```
  mysql> SELECT WEEKOFYEAR('2008-02-20');
          -> 8
  ```

- `YEAR(date)`

  Retorna o ano para `date`, na faixa de `1000` a `9999`, ou `0` para a data “zero”. Retorna `NULL` se `date` for `NULL`.

  ```
  mysql> SELECT YEAR('1987-01-01');
          -> 1987
  ```

- `YEARWEEK(date)`, `YEARWEEK(date,mode)`

  Retorna o ano e a semana para uma data. O ano no resultado pode ser diferente do ano no argumento de data para a primeira e a última semana do ano. Retorna `NULL` se `date` for `NULL`.

  O argumento `mode` funciona exatamente como o argumento `mode` para `WEEK()`. Para a sintaxe de um único argumento, um valor de `mode` de 0 é usado. Ao contrário de `WEEK()`, o valor de `default_week_format` não influencia `YEARWEEK()`.

  ```
  mysql> SELECT YEARWEEK('1987-01-01');
          -> 198652
  ```

  O número da semana é diferente do que a função `WEEK()` retornaria (`0`) para os argumentos opcionais `0` ou `1`, pois `WEEK()` então retorna a semana no contexto do ano dado.
