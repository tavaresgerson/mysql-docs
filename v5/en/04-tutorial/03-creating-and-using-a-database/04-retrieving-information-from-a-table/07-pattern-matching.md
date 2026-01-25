#### 3.3.4.7 Correspondência de Padrões

O MySQL fornece correspondência de padrões SQL padrão, bem como uma forma de correspondência de padrões baseada em expressões regulares estendidas, similar àquelas usadas por utilitários Unix como **vi**, **grep** e **sed**.

A correspondência de padrões SQL permite que você use `_` para corresponder a qualquer caractere único e `%` para corresponder a um número arbitrário de caracteres (incluindo zero caracteres). No MySQL, os padrões SQL não diferenciam maiúsculas de minúsculas (case-insensitive) por padrão. Alguns exemplos são mostrados aqui. Não use `=` ou `<>` ao usar padrões SQL. Em vez disso, use os operadores de comparação [`LIKE`](string-comparison-functions.html#operator_like) ou [`NOT LIKE`](string-comparison-functions.html#operator_not-like).

Para encontrar nomes que começam com `b`:

```sql
mysql> SELECT * FROM pet WHERE name LIKE 'b%';
+--------+--------+---------+------+------------+------------+
| name   | owner  | species | sex  | birth      | death      |
+--------+--------+---------+------+------------+------------+
| Buffy  | Harold | dog     | f    | 1989-05-13 | NULL       |
| Bowser | Diane  | dog     | m    | 1989-08-31 | 1995-07-29 |
+--------+--------+---------+------+------------+------------+
```

Para encontrar nomes que terminam com `fy`:

```sql
mysql> SELECT * FROM pet WHERE name LIKE '%fy';
+--------+--------+---------+------+------------+-------+
| name   | owner  | species | sex  | birth      | death |
+--------+--------+---------+------+------------+-------+
| Fluffy | Harold | cat     | f    | 1993-02-04 | NULL  |
| Buffy  | Harold | dog     | f    | 1989-05-13 | NULL  |
+--------+--------+---------+------+------------+-------+
```

Para encontrar nomes que contêm um `w`:

```sql
mysql> SELECT * FROM pet WHERE name LIKE '%w%';
+----------+-------+---------+------+------------+------------+
| name     | owner | species | sex  | birth      | death      |
+----------+-------+---------+------+------------+------------+
| Claws    | Gwen  | cat     | m    | 1994-03-17 | NULL       |
| Bowser   | Diane | dog     | m    | 1989-08-31 | 1995-07-29 |
| Whistler | Gwen  | bird    | NULL | 1997-12-09 | NULL       |
+----------+-------+---------+------+------------+------------+
```

Para encontrar nomes contendo exatamente cinco caracteres, use cinco instâncias do caractere padrão `_`:

```sql
mysql> SELECT * FROM pet WHERE name LIKE '_____';
+-------+--------+---------+------+------------+-------+
| name  | owner  | species | sex  | birth      | death |
+-------+--------+---------+------+------------+-------+
| Claws | Gwen   | cat     | m    | 1994-03-17 | NULL  |
| Buffy | Harold | dog     | f    | 1989-05-13 | NULL  |
+-------+--------+---------+------+------------+-------+
```

O outro tipo de correspondência de padrões fornecido pelo MySQL usa expressões regulares estendidas. Ao testar uma correspondência para este tipo de padrão, use os operadores [`REGEXP`](regexp.html#operator_regexp) e [`NOT REGEXP`](regexp.html#operator_not-regexp) (ou [`RLIKE`](regexp.html#operator_regexp) e [`NOT RLIKE`](regexp.html#operator_not-regexp), que são sinônimos).

A lista a seguir descreve algumas características das expressões regulares estendidas:

* `.` corresponde a qualquer caractere único.
* Uma character class `[...]` corresponde a qualquer caractere dentro dos colchetes. Por exemplo, `[abc]` corresponde a `a`, `b`, ou `c`. Para nomear um intervalo de caracteres (range), use um traço. `[a-z]` corresponde a qualquer letra, enquanto `[0-9]` corresponde a qualquer dígito.

* `*` corresponde a zero ou mais instâncias do elemento que o precede. Por exemplo, `x*` corresponde a qualquer número de caracteres `x`, `[0-9]*` corresponde a qualquer número de dígitos, e `.*`, a qualquer número de qualquer coisa.

* Uma correspondência de padrão de expressão regular é bem-sucedida se o padrão corresponder em qualquer lugar no valor que está sendo testado. (Isso difere de uma correspondência de padrão [`LIKE`](string-comparison-functions.html#operator_like), que é bem-sucedida apenas se o padrão corresponder ao valor inteiro.)

* Para ancorar um padrão de forma que ele deva corresponder ao início ou ao final do valor que está sendo testado, use `^` no início ou `$` no final do padrão.

Para demonstrar como as expressões regulares estendidas funcionam, as Queries [`LIKE`](string-comparison-functions.html#operator_like) mostradas anteriormente são reescritas aqui para usar [`REGEXP`](regexp.html#operator_regexp).

Para encontrar nomes que começam com `b`, use `^` para corresponder ao início do nome:

```sql
mysql> SELECT * FROM pet WHERE name REGEXP '^b';
+--------+--------+---------+------+------------+------------+
| name   | owner  | species | sex  | birth      | death      |
+--------+--------+---------+------+------------+------------+
| Buffy  | Harold | dog     | f    | 1989-05-13 | NULL       |
| Bowser | Diane  | dog     | m    | 1989-08-31 | 1995-07-29 |
+--------+--------+---------+------+------------+------------+
```

Para forçar uma comparação [`REGEXP`](regexp.html#operator_regexp) a diferenciar maiúsculas de minúsculas (case-sensitive), use a palavra-chave [`BINARY`](cast-functions.html#operator_binary) para transformar uma das strings em uma binary string. Esta Query corresponde apenas ao `b` em minúsculo no início de um nome:

```sql
SELECT * FROM pet WHERE name REGEXP BINARY '^b';
```

Para encontrar nomes que terminam com `fy`, use `$` para corresponder ao final do nome:

```sql
mysql> SELECT * FROM pet WHERE name REGEXP 'fy$';
+--------+--------+---------+------+------------+-------+
| name   | owner  | species | sex  | birth      | death |
+--------+--------+---------+------+------------+-------+
| Fluffy | Harold | cat     | f    | 1993-02-04 | NULL  |
| Buffy  | Harold | dog     | f    | 1989-05-13 | NULL  |
+--------+--------+---------+------+------------+-------+
```

Para encontrar nomes que contêm um `w`, use esta Query:

```sql
mysql> SELECT * FROM pet WHERE name REGEXP 'w';
+----------+-------+---------+------+------------+------------+
| name     | owner | species | sex  | birth      | death      |
+----------+-------+---------+------+------------+------------+
| Claws    | Gwen  | cat     | m    | 1994-03-17 | NULL       |
| Bowser   | Diane | dog     | m    | 1989-08-31 | 1995-07-29 |
| Whistler | Gwen  | bird    | NULL | 1997-12-09 | NULL       |
+----------+-------+---------+------+------------+------------+
```

Como um padrão de expressão regular corresponde se ocorrer em qualquer lugar no valor, não é necessário na Query anterior colocar um wildcard em qualquer lado do padrão para fazê-lo corresponder ao valor inteiro, como seria necessário com um padrão SQL.

Para encontrar nomes contendo exatamente cinco caracteres, use `^` e `$` para corresponder ao início e ao final do nome, e cinco instâncias de `.` no meio:

```sql
mysql> SELECT * FROM pet WHERE name REGEXP '^.....$';
+-------+--------+---------+------+------------+-------+
| name  | owner  | species | sex  | birth      | death |
+-------+--------+---------+------+------------+-------+
| Claws | Gwen   | cat     | m    | 1994-03-17 | NULL  |
| Buffy | Harold | dog     | f    | 1989-05-13 | NULL  |
+-------+--------+---------+------+------------+-------+
```

Você também pode escrever a Query anterior usando o operador `{n}` (“repetir-`n`-vezes”):

```sql
mysql> SELECT * FROM pet WHERE name REGEXP '^.{5}$';
+-------+--------+---------+------+------------+-------+
| name  | owner  | species | sex  | birth      | death |
+-------+--------+---------+------+------------+-------+
| Claws | Gwen   | cat     | m    | 1994-03-17 | NULL  |
| Buffy | Harold | dog     | f    | 1989-05-13 | NULL  |
+-------+--------+---------+------+------------+-------+
```

Para mais informações sobre a sintaxe de expressões regulares, consulte [Section 12.8.2, “Regular Expressions”](regexp.html "12.8.2 Regular Expressions").