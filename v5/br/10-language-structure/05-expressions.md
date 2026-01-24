## 9.5 Expressões

Esta seção lista as regras gramaticais que as expressões devem seguir no MySQL e fornece informações adicionais sobre os tipos de termos que podem aparecer nas expressões.

- Sintaxe de Expressão
- Notas sobre termos de expressão
- Intervalo Temporal

### Sintaxe de Expressão

As regras gramaticais a seguir definem a sintaxe de expressões no MySQL. A gramática apresentada aqui é baseada naquela fornecida no arquivo `sql/sql_yacc.yy` das distribuições-fonte do MySQL. Para obter informações adicionais sobre alguns dos termos de expressão, consulte Notas sobre termos de expressão.

```sql
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

Para a precedência dos operadores, consulte a Seção 12.4.1, “Precedência dos Operadores”. A precedência e o significado de alguns operadores dependem do modo SQL:

- Por padrão, `||` é um operador `OR` lógico. Com `PIPES_AS_CONCAT` habilitado, `||` é concatenação de strings, com precedência entre `^` e os operadores unários.

- Por padrão, o `!` tem precedência maior que o `NOT`. Com `HIGH_NOT_PRECEDENCE` ativado, `!` e `NOT` têm a mesma precedência.

Consulte a Seção 5.1.10, “Modos SQL do Servidor”.

### Notas sobre termos de expressão

Para a sintaxe de valor literal, consulte a Seção 9.1, “Valores Literais”.

Para a sintaxe de identificadores, consulte a Seção 9.2, “Nomes de Objetos de Esquema”.

As variáveis podem ser variáveis do usuário, variáveis do sistema ou variáveis locais ou parâmetros de programas armazenados:

- Variáveis do usuário: Seção 9.4, “Variáveis Definidas pelo Usuário”

- Variáveis do sistema: Seção 5.1.8, “Usando variáveis do sistema”

- Variáveis locais de programa armazenado: Seção 13.6.4.1, “Instrução DECLARE de Variável Local”

- Parâmetros de programas armazenados: Seção 13.1.16, “Instruções CREATE PROCEDURE e CREATE FUNCTION”

*`param_marker`* é `?`, conforme usado em instruções preparadas para marcadores. Veja a Seção 13.5.1, “Instrução PREPARE”.

`(subquery)` indica uma subconsulta que retorna um único valor; ou seja, uma subconsulta escalar. Veja a Seção 13.2.10.1, “A subconsulta como operando escalar”.

`{identificador expr}` é a sintaxe de escape ODBC e é aceita para compatibilidade com ODBC. O valor é *`expr`*. As chaves curvadas `{` e `}` na sintaxe devem ser escritas literalmente; elas não são sintaxes meta, como usadas em outras descrições de sintaxe.

*`match_expr`* indica uma expressão `MATCH`. Veja a Seção 12.9, “Funções de Busca de Texto Completo”.

*`case_expr`* indica uma expressão `CASE`. Veja a Seção 12.5, "Funções de controle de fluxo".

*`interval_expr`* representa um intervalo temporal. Veja Intervalos Temporais.

### Intervalo Temporal

*`interval_expr`* em expressões representa um intervalo temporal. Os intervalos têm a seguinte sintaxe:

```sql
INTERVAL expr unit
```

*`expr`* representa uma quantidade. *`unit`* representa a unidade para interpretar a quantidade; é um especificador como `HOUR`, `DAY` ou `WEEK`. A palavra-chave `INTERVAL` e o especificador *`unit`* não são sensíveis ao caso.

A tabela a seguir mostra a forma esperada do argumento *`expr`* para cada valor de *`unit`*.

**Tabela 9.2 Expressão de Intervalo Temporal e Argumentos de Unidade**

<table summary="valores unitários e o argumento expr esperado para cada valor unitário."><thead><tr><th><em><code>unit</code></em> Value</th><th>Formato <em><code>expr</code></em> esperado</th></tr></thead><tbody><tr><td><code>MICROSECOND</code></td><td><code>MICROSECONDS</code></td></tr><tr><td><code>SECOND</code></td><td><code>SECONDS</code></td></tr><tr><td><code>MINUTE</code></td><td><code>MINUTES</code></td></tr><tr><td><code>HOUR</code></td><td><code>HOURS</code></td></tr><tr><td><code>DAY</code></td><td><code>DAYS</code></td></tr><tr><td><code>WEEK</code></td><td><code>WEEKS</code></td></tr><tr><td><code>MONTH</code></td><td><code>MONTHS</code></td></tr><tr><td><code>QUARTER</code></td><td><code>QUARTERS</code></td></tr><tr><td><code>YEAR</code></td><td><code>YEARS</code></td></tr><tr><td><code>SECOND_MICROSECOND</code></td><td><code>'SECONDS.MICROSECONDS'</code></td></tr><tr><td><code>MINUTE_MICROSECOND</code></td><td><code>'MINUTES:SECONDS.MICROSECONDS'</code></td></tr><tr><td><code>MINUTE_SECOND</code></td><td><code>'MINUTES:SECONDS'</code></td></tr><tr><td><code>HOUR_MICROSECOND</code></td><td><code>'HOURS:MINUTES:SECONDS.MICROSECONDS'</code></td></tr><tr><td><code>HOUR_SECOND</code></td><td><code>'HOURS:MINUTES:SECONDS'</code></td></tr><tr><td><code>HOUR_MINUTE</code></td><td><code>'HOURS:MINUTES'</code></td></tr><tr><td><code>DAY_MICROSECOND</code></td><td><code>'DAYS HOURS:MINUTES:SECONDS.MICROSECONDS'</code></td></tr><tr><td><code>DAY_SECOND</code></td><td><code>'DAYS HOURS:MINUTES:SECONDS'</code></td></tr><tr><td><code>DAY_MINUTE</code></td><td><code>'DAYS HOURS:MINUTES'</code></td></tr><tr><td><code>DAY_HOUR</code></td><td><code>'DAYS HOURS'</code></td></tr><tr><td><code>YEAR_MONTH</code></td><td><code>'YEARS-MONTHS'</code></td></tr></tbody></table>

O MySQL permite qualquer delimitador de pontuação no formato *`expr`*. Os mostrados na tabela são os delimitadores sugeridos.

Intervalo temporal é usado para certas funções, como `DATE_ADD()` e `DATE_SUB()`:

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

A aritmética temporal também pode ser realizada em expressões usando `INTERVAL` junto com o operador `+` ou `-`:

```sql
date + INTERVAL expr unit
date - INTERVAL expr unit
```

`INTERVAL expr unit` é permitido em qualquer lado do operador `+` se a expressão do outro lado for um valor de data ou datetime. Para o operador `-`, `INTERVAL expr unit` é permitido apenas no lado direito, porque não faz sentido subtrair um valor de data ou datetime de um intervalo.

```sql
mysql> SELECT '2018-12-31 23:59:59' + INTERVAL 1 SECOND;
        -> '2019-01-01 00:00:00'
mysql> SELECT INTERVAL 1 DAY + '2018-12-31';
        -> '2019-01-01'
mysql> SELECT '2025-01-01' - INTERVAL 1 SECOND;
        -> '2024-12-31 23:59:59'
```

A função `EXTRACT()` usa os mesmos tipos de especificadores de *`unidade`* que `DATE_ADD()` ou `DATE_SUB()`, mas extrai partes da data em vez de realizar operações aritméticas com datas:

```sql
mysql> SELECT EXTRACT(YEAR FROM '2019-07-02');
        -> 2019
mysql> SELECT EXTRACT(YEAR_MONTH FROM '2019-07-02 01:02:03');
        -> 201907
```

Os intervalos temporais podem ser usados nas declarações `CREATE EVENT`:

```sql
CREATE EVENT myevent
    ON SCHEDULE AT CURRENT_TIMESTAMP + INTERVAL 1 HOUR
    DO
      UPDATE myschema.mytable SET mycol = mycol + 1;
```

Se você especificar um valor de intervalo que é muito curto (não inclui todas as partes do intervalo que seriam esperadas a partir da palavra-chave *`unit`*), o MySQL assume que você omitiu as partes mais à esquerda do valor do intervalo. Por exemplo, se você especificar uma *`unit`* de `DAY_SECOND`, o valor de *`expr`* deve ter partes de dias, horas, minutos e segundos. Se você especificar um valor como `'1:10'`, o MySQL assume que as partes de dias e horas estão faltando e o valor representa minutos e segundos. Em outras palavras, `'1:10' DAY_SECOND` é interpretado de tal forma que é equivalente a `'1:10' MINUTE_SECOND`. Isso é análogo à maneira como o MySQL interpreta os valores de \*`TIME` como representando tempo decorrido, em vez de ser um horário do dia.

*`expr`* é tratado como uma string, então tenha cuidado se você especificar um valor que não seja uma string com `INTERVAL`. Por exemplo, com um especificador de intervalo de `HOUR_MINUTE`, '6/4' é tratado como 6 horas, quatro minutos, enquanto `6/4` é avaliado como `1.5000` e é tratado como 1 hora, 5000 minutos:

```sql
mysql> SELECT '6/4', 6/4;
        -> 1.5000
mysql> SELECT DATE_ADD('2019-01-01', INTERVAL '6/4' HOUR_MINUTE);
        -> '2019-01-01 06:04:00'
mysql> SELECT DATE_ADD('2019-01-01', INTERVAL 6/4 HOUR_MINUTE);
        -> '2019-01-04 12:20:00'
```

Para garantir a interpretação do valor do intervalo conforme esperado, pode-se usar uma operação `CAST()`. Para tratar `6/4` como 1 hora e 5 minutos, caste-o para um valor `DECIMAL` - DECIMAL, NUMERIC") com um único dígito fracionário:

```sql
mysql> SELECT CAST(6/4 AS DECIMAL(3,1));
        -> 1.5
mysql> SELECT DATE_ADD('1970-01-01 12:00:00',
    ->                 INTERVAL CAST(6/4 AS DECIMAL(3,1)) HOUR_MINUTE);
        -> '1970-01-01 13:05:00'
```

Se você adicionar ou subtrair de um valor de data algo que contenha uma parte de hora, o resultado é automaticamente convertido em um valor datetime:

```sql
mysql> SELECT DATE_ADD('2023-01-01', INTERVAL 1 DAY);
        -> '2023-01-02'
mysql> SELECT DATE_ADD('2023-01-01', INTERVAL 1 HOUR);
        -> '2023-01-01 01:00:00'
```

Se você adicionar `MÊS`, `MÊS_ANO` ou `ANO` e a data resultante tiver um dia maior que o número máximo de dias do novo mês, o dia é ajustado para o número máximo de dias do novo mês:

```sql
mysql> SELECT DATE_ADD('2019-01-30', INTERVAL 1 MONTH);
        -> '2019-02-28'
```

As operações aritméticas de data exigem datas completas e não funcionam com datas incompletas, como `'2016-07-00'` ou datas mal formatadas:

```sql
mysql> SELECT DATE_ADD('2016-07-00', INTERVAL 1 DAY);
        -> NULL
mysql> SELECT '2005-03-32' + INTERVAL 1 MONTH;
        -> NULL
```
