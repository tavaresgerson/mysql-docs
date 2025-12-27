#### 5.3.4.7 Correspondência de Padrões

O MySQL oferece correspondência de padrões SQL padrão, bem como uma forma de correspondência de padrões baseada em expressões regulares extensas, semelhantes às usadas por utilitários do Unix, como `vi`, `grep` e `sed`.

A correspondência de padrões SQL permite que você use `_` para corresponder a qualquer caractere único e `%` para corresponder a um número arbitrário de caracteres (incluindo zero caracteres). No MySQL, os padrões SQL são case-insensitive por padrão. Alguns exemplos são mostrados aqui. Não use `=` ou `<>` ao usar padrões SQL. Use os operadores de comparação  `LIKE` ou `NOT LIKE` em vez disso.

Para encontrar nomes que começam com `b`:

```
mysql> SELECT * FROM pet WHERE name LIKE 'b%';
+--------+--------+---------+------+------------+------------+
| name   | owner  | species | sex  | birth      | death      |
+--------+--------+---------+------+------------+------------+
| Buffy  | Harold | dog     | f    | 1989-05-13 | NULL       |
| Bowser | Diane  | dog     | m    | 1989-08-31 | 1995-07-29 |
+--------+--------+---------+------+------------+------------+
```

Para encontrar nomes que terminam com `fy`:

```
mysql> SELECT * FROM pet WHERE name LIKE '%fy';
+--------+--------+---------+------+------------+-------+
| name   | owner  | species | sex  | birth      | death |
+--------+--------+---------+------+------------+-------+
| Fluffy | Harold | cat     | f    | 1993-02-04 | NULL  |
| Buffy  | Harold | dog     | f    | 1989-05-13 | NULL  |
+--------+--------+---------+------+------------+-------+
```

Para encontrar nomes que contêm uma `w`:

```
mysql> SELECT * FROM pet WHERE name LIKE '%w%';
+----------+-------+---------+------+------------+------------+
| name     | owner | species | sex  | birth      | death      |
+----------+-------+---------+------+------------+------------+
| Claws    | Gwen  | cat     | m    | 1994-03-17 | NULL       |
| Bowser   | Diane | dog     | m    | 1989-08-31 | 1995-07-29 |
| Whistler | Gwen  | bird    | NULL | 1997-12-09 | NULL       |
+----------+-------+---------+------+------------+------------+
```

Para encontrar nomes que contêm exatamente cinco caracteres, use cinco instâncias do caractere de padrão `_`:

```
mysql> SELECT * FROM pet WHERE name LIKE '_____';
+-------+--------+---------+------+------------+-------+
| name  | owner  | species | sex  | birth      | death |
+-------+--------+---------+------+------------+-------+
| Claws | Gwen   | cat     | m    | 1994-03-17 | NULL  |
| Buffy | Harold | dog     | f    | 1989-05-13 | NULL  |
+-------+--------+---------+------+------------+-------+
```

O outro tipo de correspondência de padrões fornecido pelo MySQL usa expressões regulares extensas. Ao testar uma correspondência para esse tipo de padrão, use a função `REGEXP_LIKE()` (ou os operadores `REGEXP` ou `RLIKE`, que são sinônimos de `REGEXP_LIKE()`).

A lista a seguir descreve algumas características das expressões regulares extensas:

* `.` corresponde a qualquer caractere único.
* Uma classe de caracteres `[...]` corresponde a qualquer caractere dentro dos colchetes. Por exemplo, `[abc]` corresponde a `a`, `b` ou `c`. Para nomear uma faixa de caracteres, use uma barra. `[a-z]` corresponde a qualquer letra, enquanto `[0-9]` corresponde a qualquer dígito.
* `*` corresponde a zero ou mais instâncias da coisa que o precede. Por exemplo, `x*` corresponde a qualquer número de caracteres `x`, `[0-9]*` corresponde a qualquer número de dígitos, e `.*` corresponde a qualquer número de qualquer coisa.
* Uma correspondência de padrão de expressão regular é bem-sucedida se o padrão corresponder em qualquer lugar no valor sendo testado. (Isso difere de uma correspondência de padrão `LIKE`, que é bem-sucedida apenas se o padrão corresponder ao valor inteiro.)
* Para ancorar um padrão de modo que ele deva corresponder ao início ou fim do valor sendo testado, use `^` no início ou `$` no fim do padrão.

Para demonstrar como as expressões regulares estendidas funcionam, as consultas `LIKE` mostradas anteriormente são reescritas aqui para usar `REGEXP_LIKE()`.

Para encontrar nomes que começam com `b`, use `^` para corresponder ao início do nome:

```
mysql> SELECT * FROM pet WHERE REGEXP_LIKE(name, '^b');
+--------+--------+---------+------+------------+------------+
| name   | owner  | species | sex  | birth      | death      |
+--------+--------+---------+------+------------+------------+
| Buffy  | Harold | dog     | f    | 1989-05-13 | NULL       |
| Bowser | Diane  | dog     | m    | 1979-08-31 | 1995-07-29 |
+--------+--------+---------+------+------------+------------+
```

Para forçar uma comparação de expressão regular a ser sensível ao caso, use uma ordenação sensível ao caso, ou use a palavra-chave `BINARY` para tornar uma das strings uma string binária, ou especifique o caractere de controle de correspondência `c`. Cada uma dessas consultas corresponde apenas a `b` minúsculo no início de um nome:

```
SELECT * FROM pet WHERE REGEXP_LIKE(name, '^b' COLLATE utf8mb4_0900_as_cs);
SELECT * FROM pet WHERE REGEXP_LIKE(name, BINARY '^b');
SELECT * FROM pet WHERE REGEXP_LIKE(name, '^b', 'c');
```

Para encontrar nomes que terminam com `fy`, use `$` para corresponder ao fim do nome:

```
mysql> SELECT * FROM pet WHERE REGEXP_LIKE(name, 'fy$');
+--------+--------+---------+------+------------+-------+
| name   | owner  | species | sex  | birth      | death |
+--------+--------+---------+------+------------+-------+
| Fluffy | Harold | cat     | f    | 1993-02-04 | NULL  |
| Buffy  | Harold | dog     | f    | 1989-05-13 | NULL  |
+--------+--------+---------+------+------------+-------+
```

Para encontrar nomes que contenham uma `w`, use esta consulta:

```
mysql> SELECT * FROM pet WHERE REGEXP_LIKE(name, 'w');
+----------+-------+---------+------+------------+------------+
| name     | owner | species | sex  | birth      | death      |
+----------+-------+---------+------+------------+------------+
| Claws    | Gwen  | cat     | m    | 1994-03-17 | NULL       |
| Bowser   | Diane | dog     | m    | 1989-08-31 | 1995-07-29 |
| Whistler | Gwen  | bird    | NULL | 1997-12-09 | NULL       |
+----------+-------+---------+------+------------+------------+
```

Como um padrão de expressão regular corresponde se ocorrer em qualquer lugar no valor, não é necessário na consulta anterior colocar um caractere wildcard em qualquer lado do padrão para fazê-lo corresponder ao valor inteiro, como seria verdadeiro com um padrão SQL.

Para encontrar nomes que contenham exatamente cinco caracteres, use `^` e `$` para corresponder ao início e fim do nome, e cinco instâncias de `.` entre eles:

```
mysql> SELECT * FROM pet WHERE REGEXP_LIKE(name, '^.....$');
+-------+--------+---------+------+------------+-------+
| name  | owner  | species | sex  | birth      | death |
+-------+--------+---------+------+------------+-------+
| Claws | Gwen   | cat     | m    | 1994-03-17 | NULL  |
| Buffy | Harold | dog     | f    | 1989-05-13 | NULL  |
+-------+--------+---------+------+------------+-------+
```

Você também pode escrever a consulta anterior usando o operador `{n}` (`“repeat-*n*-times”`) :

```
mysql> SELECT * FROM pet WHERE REGEXP_LIKE(name, '^.{5}$');
+-------+--------+---------+------+------------+-------+
| name  | owner  | species | sex  | birth      | death |
+-------+--------+---------+------+------------+-------+
| Claws | Gwen   | cat     | m    | 1994-03-17 | NULL  |
| Buffy | Harold | dog     | f    | 1989-05-13 | NULL  |
+-------+--------+---------+------+------------+-------+
```

Para mais informações sobre a sintaxe de expressões regulares, consulte a Seção 14.8.2, “Expressões Regulares”.