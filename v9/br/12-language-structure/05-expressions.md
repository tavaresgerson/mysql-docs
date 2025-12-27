## 11.5 Expressões

Esta seção lista as regras gramaticais que as expressões devem seguir no MySQL e fornece informações adicionais sobre os tipos de termos que podem aparecer em expressões.

* Sintaxe da Expressão
* Notas sobre Termos da Expressão
* Intervalos Temporais

### Sintaxe da Expressão

As seguintes regras gramaticais definem a sintaxe da expressão no MySQL. A sintaxe mostrada aqui é baseada naquela fornecida no arquivo `sql/sql_yacc.yy` das distribuições-fonte do MySQL. Para informações adicionais sobre alguns dos termos da expressão, consulte Notas sobre Termos da Expressão.

```
expr:
    expr OR expr
  | expr || expr
  | expr XOR expr
  | expr AND expr
  | expr && expr
  | NOT expr
  | ! expr
  | boolean_primary IS [NOT] {TRUE | FALSE | UNKNOWN}
  | boolean_primary

boolean_primary:
    boolean_primary IS [NOT] NULL
  | boolean_primary <=> predicate
  | boolean_primary comparison_operator predicate
  | boolean_primary comparison_operator {ALL | ANY} (subquery)
  | predicate

comparison_operator: = | >= | > | <= | < | <> | !=

predicate:
    bit_expr [NOT] IN (subquery)
  | bit_expr [NOT] IN (expr [, expr] ...)
  | bit_expr [NOT] BETWEEN bit_expr AND predicate
  | bit_expr SOUNDS LIKE bit_expr
  | bit_expr [NOT] LIKE simple_expr [ESCAPE simple_expr]
  | bit_expr [NOT] REGEXP bit_expr
  | bit_expr

bit_expr:
    bit_expr | bit_expr
  | bit_expr & bit_expr
  | bit_expr << bit_expr
  | bit_expr >> bit_expr
  | bit_expr + bit_expr
  | bit_expr - bit_expr
  | bit_expr * bit_expr
  | bit_expr / bit_expr
  | bit_expr DIV bit_expr
  | bit_expr MOD bit_expr
  | bit_expr % bit_expr
  | bit_expr ^ bit_expr
  | bit_expr + interval_expr
  | bit_expr - interval_expr
  | simple_expr

simple_expr:
    literal
  | identifier
  | function_call
  | simple_expr COLLATE collation_name
  | param_marker
  | variable
  | simple_expr || simple_expr
  | + simple_expr
  | - simple_expr
  | ~ simple_expr
  | ! simple_expr
  | BINARY simple_expr
  | (expr [, expr] ...)
  | ROW (expr, expr [, expr] ...)
  | (subquery)
  | EXISTS (subquery)
  | {identifier expr}
  | match_expr
  | case_expr
  | interval_expr
```

Para a precedência dos operadores, consulte Seção 14.4.1, “Precedência dos Operadores”. A precedência e o significado de alguns operadores dependem do modo SQL:

* Por padrão, `||` é um operador lógico `OR`. Com `PIPES_AS_CONCAT` habilitado, `||` é concatenação de strings, com uma precedência entre `^` e os operadores unários.

* Por padrão, `!` tem uma precedência maior que `NOT`. Com `HIGH_NOT_PRECEDENCE` habilitado, `!` e `NOT` têm a mesma precedência.

Consulte Seção 7.1.11, “Modos SQL do Servidor”.

### Notas sobre Termos da Expressão

Para a sintaxe de valor literal, consulte Seção 11.1, “Valores Literais”.

Para a sintaxe de identificadores, consulte Seção 11.2, “Nomes de Objetos do Esquema”.

Variáveis podem ser variáveis de usuário, variáveis de sistema ou variáveis locais de programas armazenados ou parâmetros:

* Variáveis de usuário: Seção 11.4, “Variáveis Definidas pelo Usuário”
* Variáveis de sistema: Seção 7.1.9, “Usando Variáveis de Sistema”
* Variáveis locais de programas armazenados: Seção 15.6.4.1, “Instrução DECLARE de Variável Local”

* `param_marker`* é `?` como usado em declarações preparadas para marcadores. Consulte Seção 15.5.1, “Instrução PREPARE”.

`(subquery)` indica uma subconsulta que retorna um único valor; ou seja, uma subconsulta escalar. Veja a Seção 15.2.15.1, “A Subconsulta como Operando Escalar”.

`{identifier expr}` é a sintaxe de escape ODBC e é aceita para compatibilidade com ODBC. O valor é *`expr`*. As chaves `{` e `}` no formato da sintaxe devem ser escritas literalmente; elas não são sintaxes de metacaracteres como usadas em outras descrições de sintaxe.

*`match_expr`* indica uma expressão `MATCH`. Veja a Seção 14.9, “Funções de Busca de Texto Completo”.

*`case_expr`* indica uma expressão `CASE`. Veja a Seção 14.5, “Funções de Controle de Fluxo”.

*`interval_expr`* representa um intervalo temporal. Veja Intervalos Temporais.

### Intervalos Temporais

*`interval_expr`* em expressões representa um intervalo temporal. Os intervalos têm a seguinte sintaxe:

```
INTERVAL expr unit
```

*`expr`* representa uma quantidade. *`unit`* representa a unidade para interpretar a quantidade; é um especificador como `HOUR`, `DAY` ou `WEEK`. A palavra-chave `INTERVAL` e o especificador *`unit`* não são sensíveis a maiúsculas e minúsculas.

A tabela a seguir mostra a forma esperada do argumento *`expr`* para cada valor de *`unit`*.

**Tabela 11.2 Expressão de Intervalo Temporal e Argumentos de Unidade**

<table summary="valores de unidade e o argumento esperado <em class="replaceable"><code>expr</code></em> para cada valor de unidade."><col style="width: 50%"/><col style="width: 50%"/><thead><tr> <th><em class="replaceable"><code>unit</code></em> Valor</th> <th>Formato esperado <em class="replaceable"><code>expr</code></em></th> </tr></thead><tbody><tr> <td><code class="literal">MICROSECOND</code></td> <td><code class="literal">MICROSECONDS</code></td> </tr><tr> <td><code class="literal">SECOND</code></td> <td><code class="literal">SECONDS</code></td> </tr><tr> <td><code class="literal">MINUTE</code></td> <td><code class="literal">MINUTES</code></td> </tr><tr> <td><code class="literal">HOUR</code></td> <td><code class="literal">HOURS</code></td> </tr><tr> <td><code class="literal">DAY</code></td> <td><code class="literal">DAYS</code></td> </tr><tr> <td><code class="literal">WEEK</code></td> <td><code class="literal">WEEKS</code></td> </tr><tr> <td><code class="literal">MONTH</code></td> <td><code class="literal">MONTHS</code></td> </tr><tr> <td><code class="literal">QUARTER</code></td> <td><code class="literal">QUARTERS</code></td> </tr><tr> <td><code class="literal">YEAR</code></td> <td><code class="literal">YEARS</code></td> </tr><tr> <td><code class="literal">SECOND_MICROSECOND</code></td> <td><code class="literal">'SECONDS.MICROSECONDS'</code></td> </tr><tr> <td><code class="literal">MINUTE_MICROSECOND</code></td> <td><code class="literal">'MINUTES.SECONDS.MICROSECONDS'</code></td> </tr><tr> <td><code class="literal">MINUTE_SECOND</code></td> <td><code class="literal">'MINUTES.SECONDS'</code></td> </tr><tr> <td><code class="literal">HOUR_MICROSECOND</code></td> <td><code class="literal">'HOURS.MINUTES.SECONDS.MICROSECONDS'</code></td> </tr><tr> <td><code class="literal">HOUR_SECOND</code></td> <td><code class="literal">'HOURS.MINUTES.SECONDS'</code></td> </tr><tr> <td><code class="literal">HOUR_MINUTE</code></td> <td><code class="literal">'HOURS.MINUTES'</code></td> </tr><tr> <td><code class="literal">DAY_MICROSECOND</code></td> <td><code class="literal">'DAYS.HOURS.MINUTES.SECONDS.MICROSECONDS'</code></td> </tr><tr> <td><code class="literal">DAY_SECOND</code></td> <td><code class="literal">'DAYS.HOURS.MINUTES.SECONDS'</code></td> </tr><tr> <td><code class="literal">DAY_MINUTE</code></td> <td><code class="literal">'DAYS.HOURS.MINUTES'</code></td> </tr><tr> <td><code class="literal">DAY_HOUR</code></td> <td><code class="literal">'DAYS.HOURS'</code></td> </tr><tr> <td><code class="literal">YEAR_MONTH</code></td> <td><code class="literal">'YEARS-MONTHS'</code></td> </tr></tbody></table>

O MySQL permite qualquer delimitador de pontuação no formato *`expr`*. Os mostrados na tabela são os delimitadores sugeridos.

Intervalo temporal é usado para certas funções, como `DATE_ADD()` e `DATE_SUB()`:

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

A aritmética temporal também pode ser realizada em expressões usando `INTERVAL` junto com o operador `+` ou `-`:

```
date + INTERVAL expr unit
date - INTERVAL expr unit
```

`INTERVAL expr unit` é permitido em qualquer lado do operador `+` se a expressão do outro lado for um valor de data ou datetime:

```
mysql> SELECT '2018-12-31 23:59:59' + INTERVAL 1 SECOND;
        -> '2019-01-01 00:00:00'
mysql> SELECT INTERVAL 1 DAY + '2018-12-31';
        -> '2019-01-01'
mysql> SELECT '2025-01-01' - INTERVAL 1 SECOND;
        -> '2024-12-31 23:59:59'
```

A função `EXTRACT()` usa os mesmos tipos de especificadores de *`unit`* que `DATE_ADD()` ou `DATE_SUB()`, mas extrai partes da data em vez de realizar aritmética de data:

```
mysql> SELECT EXTRACT(YEAR FROM '2019-07-02');
        -> 2019
mysql> SELECT EXTRACT(YEAR_MONTH FROM '2019-07-02 01:02:03');
        -> 201907
```

Intervalo temporal pode ser usado em declarações `CREATE EVENT`:

```
CREATE EVENT myevent
    ON SCHEDULE AT CURRENT_TIMESTAMP + INTERVAL 1 HOUR
    DO
      UPDATE myschema.mytable SET mycol = mycol + 1;
```

Se você especificar um valor de intervalo que é muito curto (não inclui todas as partes do intervalo que seriam esperadas a partir da palavra-chave *`unit`*), o MySQL assume que você deixou de fora as partes mais à esquerda do valor do intervalo. Por exemplo, se você especificar um *`unit`* de `DAY_SECOND`, o valor de *`expr`* é esperado ter partes de dias, horas, minutos e segundos. Se você especificar um valor como `'1:10'`, o MySQL assume que as partes de dias e horas estão faltando e o valor representa minutos e segundos. Em outras palavras, `'1:10' DAY_SECOND` é interpretado de tal forma que é equivalente a `'1:10' MINUTE_SECOND`. Isso é análogo à maneira como o MySQL interpreta valores `TIME` como representando tempo decorrido em vez de como uma hora do dia.

*`expr`* é tratado como uma string, então tenha cuidado se você especificar um valor não string com `INTERVAL`. Por exemplo, com um especificador de intervalo de `HOUR_MINUTE`, '6/4' é tratado como 6 horas, quatro minutos, enquanto `6/4` avalia-se como `1.5000` e é tratado como 1 hora, 5000 minutos:

```
mysql> SELECT '6/4', 6/4;
        -> 1.5000
mysql> SELECT DATE_ADD('2019-01-01', INTERVAL '6/4' HOUR_MINUTE);
        -> '2019-01-01 06:04:00'
mysql> SELECT DATE_ADD('2019-01-01', INTERVAL 6/4 HOUR_MINUTE);
        -> '2019-01-04 12:20:00'
```

Para garantir a interpretação do valor do intervalo conforme esperado, uma operação `CAST()` pode ser usada. Para tratar `6/4` como 1 hora, 5 minutos, caste-o para um valor `DECIMAL` - DECIMAL, NUMERIC") com uma única casa decimal:

```
mysql> SELECT CAST(6/4 AS DECIMAL(3,1));
        -> 1.5
mysql> SELECT DATE_ADD('1970-01-01 12:00:00',
    ->                 INTERVAL CAST(6/4 AS DECIMAL(3,1)) HOUR_MINUTE);
        -> '1970-01-01 13:05:00'
```

Se você adicionar ou subtrair de um valor de data algo que contenha uma parte de tempo, o resultado é automaticamente convertido para um valor datetime:

```
mysql> SELECT DATE_ADD('2023-01-01', INTERVAL 1 DAY);
        -> '2023-01-02'
mysql> SELECT DATE_ADD('2023-01-01', INTERVAL 1 HOUR);
        -> '2023-01-01 01:00:00'
```

Se você adicionar `MONTH`, `YEAR_MONTH` ou `YEAR` e a data resultante tiver um dia maior que o dia máximo para o novo mês, o dia é ajustado para os dias máximos do novo mês:

```
mysql> SELECT DATE_ADD('2019-01-30', INTERVAL 1 MONTH);
        -> '2019-02-28'
```

As operações aritméticas de data requerem datas completas e não funcionam com datas incompletas, como `'2016-07-00'` ou datas mal formadas:

```
mysql> SELECT DATE_ADD('2016-07-00', INTERVAL 1 DAY);
        -> NULL
mysql> SELECT '2005-03-32' + INTERVAL 1 MONTH;
        -> NULL
```