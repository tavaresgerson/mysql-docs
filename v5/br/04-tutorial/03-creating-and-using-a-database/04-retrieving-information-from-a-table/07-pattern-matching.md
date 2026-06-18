#### 3.3.4.7 Correspondência de Padrões

O MySQL oferece correspondência padrão de padrões SQL, bem como uma forma de correspondência de padrões baseada em expressões regulares extensas, semelhantes às usadas por utilitários Unix como **vi**, **grep** e **sed**.

A correspondência de padrões SQL permite que você use `_` para corresponder a qualquer caractere único e `%` para corresponder a um número arbitrário de caracteres (incluindo zero caracteres). No MySQL, os padrões SQL são case-insensitive por padrão. Alguns exemplos são mostrados aqui. Não use `=` ou `<>` quando você usar padrões SQL. Use os operadores de comparação `LIKE` ou `NOT LIKE` em vez disso.

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

Para encontrar nomes que contenham uma `w`:

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

Para encontrar nomes que contenham exatamente cinco caracteres, use cinco instâncias do caractere `_` no padrão:

```sql
mysql> SELECT * FROM pet WHERE name LIKE '_____';
+-------+--------+---------+------+------------+-------+
| name  | owner  | species | sex  | birth      | death |
+-------+--------+---------+------+------------+-------+
| Claws | Gwen   | cat     | m    | 1994-03-17 | NULL  |
| Buffy | Harold | dog     | f    | 1989-05-13 | NULL  |
+-------+--------+---------+------+------------+-------+
```

O outro tipo de correspondência de padrões fornecido pelo MySQL usa expressões regulares estendidas. Quando você testa uma correspondência para esse tipo de padrão, use os operadores `REGEXP` e `NOT REGEXP` (ou `RLIKE` e `NOT RLIKE`, que são sinônimos).

A lista a seguir descreve algumas características das expressões regulares estendidas:

- `.`, corresponde a qualquer caractere único.

- Uma classe de caracteres `[...]` corresponde a qualquer caractere dentro dos colchetes. Por exemplo, `[abc]` corresponde a `a`, `b` ou `c`. Para nomear uma faixa de caracteres, use uma barra. `[a-z]` corresponde a qualquer letra, enquanto `[0-9]` corresponde a qualquer dígito.

- `*` corresponde a zero ou mais instâncias da coisa que o precede. Por exemplo, `x*` corresponde a qualquer número de caracteres `x`, `[0-9]*` corresponde a qualquer número de dígitos e `.*` corresponde a qualquer número de qualquer coisa.

- Uma correspondência com um padrão de expressão regular é bem-sucedida se o padrão corresponder em qualquer lugar no valor que está sendo testado. (Isso difere de uma correspondência com um padrão de expressão regular `LIKE`, que só é bem-sucedida se o padrão corresponder ao valor inteiro.)

- Para ancorar um padrão de modo que ele deva corresponder ao início ou ao fim do valor que está sendo testado, use `^` no início ou `$` no final do padrão.

Para demonstrar como funcionam as expressões regulares extensas, as consultas de `LIKE` mostradas anteriormente são reescritas aqui para usar `REGEXP`.

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

Para forçar uma comparação de tipo `REGEXP` a ser case-sensitive, use a palavra-chave `BINARY` para tornar uma das strings uma string binária. Esta consulta corresponde apenas ao `b` minúsculo no início de um nome:

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

Para encontrar nomes que contenham a letra `w`, use esta consulta:

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

Como um padrão de expressão regular corresponde se ele ocorrer em qualquer lugar no valor, não é necessário colocar um caractere curinga em qualquer um dos lados do padrão na consulta anterior para que ele corresponda ao valor inteiro, como seria o caso com um padrão SQL.

Para encontrar nomes que contenham exatamente cinco caracteres, use `^` e `$` para corresponder ao início e ao fim do nome, e cinco instâncias de `.` entre eles:

```sql
mysql> SELECT * FROM pet WHERE name REGEXP '^.....$';
+-------+--------+---------+------+------------+-------+
| name  | owner  | species | sex  | birth      | death |
+-------+--------+---------+------+------------+-------+
| Claws | Gwen   | cat     | m    | 1994-03-17 | NULL  |
| Buffy | Harold | dog     | f    | 1989-05-13 | NULL  |
+-------+--------+---------+------+------------+-------+
```

Você também pode escrever a consulta anterior usando o operador `{n}` (“repetir-*n*”):

```sql
mysql> SELECT * FROM pet WHERE name REGEXP '^.{5}$';
+-------+--------+---------+------+------------+-------+
| name  | owner  | species | sex  | birth      | death |
+-------+--------+---------+------+------------+-------+
| Claws | Gwen   | cat     | m    | 1994-03-17 | NULL  |
| Buffy | Harold | dog     | f    | 1989-05-13 | NULL  |
+-------+--------+---------+------+------------+-------+
```

Para obter mais informações sobre a sintaxe de expressões regulares, consulte Seção 12.8.2, “Expressões Regulares”.
