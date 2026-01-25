## 9.5 Expressões

Esta seção lista as regras gramaticais que as expressões devem seguir no MySQL e fornece informações adicionais sobre os tipos de termos que podem aparecer nas expressões.

* Sintaxe de Expressões
* Notas sobre Termos de Expressões
* Intervalos Temporais

### Sintaxe de Expressões

As seguintes regras gramaticais definem a sintaxe de expressões no MySQL. A gramática mostrada aqui é baseada naquela fornecida no arquivo `sql/sql_yacc.yy` das distribuições do código-fonte do MySQL. Para informações adicionais sobre alguns dos termos das expressões, veja Notas sobre Termos de Expressões.

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

Para precedência de operadores, veja Seção 12.4.1, “Operator Precedence”. A precedência e o significado de alguns operadores dependem do modo SQL:

* Por padrão, `||` é um operador lógico `OR`. Com `PIPES_AS_CONCAT` habilitado, `||` é concatenação de strings, com uma precedência entre `^` e os operadores unários.

* Por padrão, `!` tem uma precedência maior que `NOT`. Com `HIGH_NOT_PRECEDENCE` habilitado, `!` e `NOT` têm a mesma precedência.

Veja Seção 5.1.10, “Server SQL Modes”.

### Notas sobre Termos de Expressões

Para sintaxe de valores literais, veja Seção 9.1, “Literal Values”.

Para sintaxe de identificadores, veja Seção 9.2, “Schema Object Names”.

Variáveis podem ser variáveis de usuário, variáveis de sistema ou variáveis locais ou parâmetros de programas armazenados (stored programs):

* Variáveis de usuário: Seção 9.4, “User-Defined Variables”
* Variáveis de sistema: Seção 5.1.8, “Using System Variables”
* Variáveis locais de programas armazenados: Seção 13.6.4.1, “Local Variable DECLARE Statement”

* Parâmetros de programas armazenados: Seção 13.1.16, “CREATE PROCEDURE and CREATE FUNCTION Statements”

*`param_marker`* é `?` conforme usado em prepared statements para placeholders. Veja Seção 13.5.1, “PREPARE Statement”.

`(subquery)` indica uma subquery que retorna um único valor; ou seja, uma scalar subquery. Veja Seção 13.2.10.1, “The Subquery as Scalar Operand”.

`{identifier expr}` é sintaxe de escape ODBC e é aceita para compatibilidade ODBC. O valor é *`expr`*. As chaves `{` e `}` na sintaxe devem ser escritas literalmente; elas não são metassintaxe como usado em outras partes das descrições de sintaxe.

*`match_expr`* indica uma expressão `MATCH`. Veja Seção 12.9, “Full-Text Search Functions”.

*`case_expr`* indica uma expressão `CASE`. Veja Seção 12.5, “Flow Control Functions”.

*`interval_expr`* representa um intervalo temporal. Veja Intervalos Temporais.

### Intervalos Temporais

*`interval_expr`* em expressões representa um intervalo temporal. Os INTERVALs têm esta sintaxe:

```sql
INTERVAL expr unit
```

*`expr`* representa uma quantidade. *`unit`* representa a unidade para interpretar a quantidade; é um especificador como `HOUR`, `DAY` ou `WEEK`. A palavra-chave `INTERVAL` e o especificador *`unit`* não diferenciam maiúsculas de minúsculas (case-sensitive).

A tabela a seguir mostra o formato esperado do argumento *`expr`* para cada valor de *`unit`*.

**Tabela 9.2 Argumentos de Unidade e Expressão de Intervalo Temporal**

| Valor de *`unit`* | Formato esperado de *`expr`* |
|---|---|
| `MICROSECOND` | `MICROSECONDS` |
| `SECOND` | `SECONDS` |
| `MINUTE` | `MINUTES` |
| `HOUR` | `HOURS` |
| `DAY` | `DAYS` |
| `WEEK` | `WEEKS` |
| `MONTH` | `MONTHS` |
| `QUARTER` | `QUARTERS` |
| `YEAR` | `YEARS` |
| `SECOND_MICROSECOND` | `'SECONDS.MICROSECONDS'` |
| `MINUTE_MICROSECOND` | `'MINUTES:SECONDS.MICROSECONDS'` |
| `MINUTE_SECOND` | `'MINUTES:SECONDS'` |
| `HOUR_MICROSECOND` | `'HOURS:MINUTES:SECONDS.MICROSECONDS'` |
| `HOUR_SECOND` | `'HOURS:MINUTES:SECONDS'` |
| `HOUR_MINUTE` | `'HOURS:MINUTES'` |
| `DAY_MICROSECOND` | `'DAYS HOURS:MINUTES:SECONDS.MICROSECONDS'` |
| `DAY_SECOND` | `'DAYS HOURS:MINUTES:SECONDS'` |
| `DAY_MINUTE` | `'DAYS HOURS:MINUTES'` |
| `DAY_HOUR` | `'DAYS HOURS'` |
| `YEAR_MONTH` | `'YEARS-MONTHS'` |

O MySQL permite qualquer delimitador de pontuação no formato *`expr`*. Aqueles mostrados na tabela são os delimitadores sugeridos.

Intervalos temporais são usados para certas funções, como `DATE_ADD()` e `DATE_SUB()`:

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

Aritmética temporal também pode ser realizada em expressões usando `INTERVAL` juntamente com o operador `+` ou `-`:

```sql
date + INTERVAL expr unit
date - INTERVAL expr unit
```

`INTERVAL expr unit` é permitido em ambos os lados do operador `+` se a expressão do outro lado for um valor de date ou datetime. Para o operador `-`, `INTERVAL expr unit` é permitido apenas no lado direito, porque não faz sentido subtrair um valor de date ou datetime de um intervalo.

```sql
mysql> SELECT '2018-12-31 23:59:59' + INTERVAL 1 SECOND;
        -> '2019-01-01 00:00:00'
mysql> SELECT INTERVAL 1 DAY + '2018-12-31';
        -> '2019-01-01'
mysql> SELECT '2025-01-01' - INTERVAL 1 SECOND;
        -> '2024-12-31 23:59:59'
```

A função `EXTRACT()` usa os mesmos tipos de especificadores *`unit`* que `DATE_ADD()` ou `DATE_SUB()`, mas extrai partes da data em vez de realizar aritmética de data:

```sql
mysql> SELECT EXTRACT(YEAR FROM '2019-07-02');
        -> 2019
mysql> SELECT EXTRACT(YEAR_MONTH FROM '2019-07-02 01:02:03');
        -> 201907
```

Intervalos temporais podem ser usados em comandos `CREATE EVENT`:

```sql
CREATE EVENT myevent
    ON SCHEDULE AT CURRENT_TIMESTAMP + INTERVAL 1 HOUR
    DO
      UPDATE myschema.mytable SET mycol = mycol + 1;
```

Se você especificar um valor de intervalo que é muito curto (não inclui todas as partes do intervalo que seriam esperadas da palavra-chave *`unit`*), o MySQL assume que você omitiu as partes mais à esquerda do valor do intervalo. Por exemplo, se você especificar um *`unit`* de `DAY_SECOND`, espera-se que o valor de *`expr`* tenha partes de dias, horas, minutos e segundos. Se você especificar um valor como `'1:10'`, o MySQL assume que as partes de dias e horas estão faltando e o valor representa minutos e segundos. Em outras palavras, `'1:10' DAY_SECOND` é interpretado de forma que seja equivalente a `'1:10' MINUTE_SECOND`. Isso é análogo à maneira como o MySQL interpreta valores `TIME` como representando tempo decorrido, e não como uma hora do dia.

*`expr`* é tratado como uma string, então tenha cuidado se você especificar um valor que não seja string com `INTERVAL`. Por exemplo, com um especificador de intervalo `HOUR_MINUTE`, '6/4' é tratado como 6 horas, quatro minutos, enquanto `6/4` é avaliado como `1.5000` e é tratado como 1 hora, 5000 minutos:

```sql
mysql> SELECT '6/4', 6/4;
        -> 1.5000
mysql> SELECT DATE_ADD('2019-01-01', INTERVAL '6/4' HOUR_MINUTE);
        -> '2019-01-01 06:04:00'
mysql> SELECT DATE_ADD('2019-01-01', INTERVAL 6/4 HOUR_MINUTE);
        -> '2019-01-04 12:20:00'
```

Para garantir que a interpretação do valor do intervalo seja a que você espera, uma operação `CAST()` pode ser usada. Para tratar `6/4` como 1 hora, 5 minutos, converta-o (cast) para um valor `DECIMAL` com um único dígito fracionário:

```sql
mysql> SELECT CAST(6/4 AS DECIMAL(3,1));
        -> 1.5
mysql> SELECT DATE_ADD('1970-01-01 12:00:00',
    ->                 INTERVAL CAST(6/4 AS DECIMAL(3,1)) HOUR_MINUTE);
        -> '1970-01-01 13:05:00'
```

Se você adicionar ou subtrair de um valor de data algo que contenha uma parte de tempo, o resultado é automaticamente convertido em um valor datetime:

```sql
mysql> SELECT DATE_ADD('2023-01-01', INTERVAL 1 DAY);
        -> '2023-01-02'
mysql> SELECT DATE_ADD('2023-01-01', INTERVAL 1 HOUR);
        -> '2023-01-01 01:00:00'
```

Se você adicionar `MONTH`, `YEAR_MONTH` ou `YEAR` e a data resultante tiver um dia maior que o dia máximo para o novo mês, o dia é ajustado para o máximo de dias no novo mês:

```sql
mysql> SELECT DATE_ADD('2019-01-30', INTERVAL 1 MONTH);
        -> '2019-02-28'
```

Operações de aritmética de data requerem datas completas e não funcionam com datas incompletas, como `'2016-07-00'` ou datas malformadas:

```sql
mysql> SELECT DATE_ADD('2016-07-00', INTERVAL 1 DAY);
        -> NULL
mysql> SELECT '2005-03-32' + INTERVAL 1 MONTH;
        -> NULL
```