#### 5.3.4.7 Correspondência de padrões

O MySQL fornece padrão de correspondência de padrões SQL, bem como uma forma de correspondência de padrões baseada em expressões regulares estendidas semelhantes às usadas por utilitários Unix, como `vi`, `grep`, e `sed`.

A correspondência de padrões SQL permite que você use `_` para corresponder a qualquer caractere e `%` para corresponder a um número arbitrário de caracteres (incluindo zero caracteres). No MySQL, os padrões SQL são case-insensíveis por padrão. Alguns exemplos são mostrados aqui. Não use `=` ou `<>` quando você usa padrões SQL. Use os operadores de comparação `LIKE` ou `NOT LIKE` em vez disso.

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

Para encontrar nomes contendo um `w`:

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

Para encontrar nomes contendo exatamente cinco caracteres, use cinco instâncias do padrão de `_`:

```
mysql> SELECT * FROM pet WHERE name LIKE '_____';
+-------+--------+---------+------+------------+-------+
| name  | owner  | species | sex  | birth      | death |
+-------+--------+---------+------+------------+-------+
| Claws | Gwen   | cat     | m    | 1994-03-17 | NULL  |
| Buffy | Harold | dog     | f    | 1989-05-13 | NULL  |
+-------+--------+---------+------+------------+-------+
```

O outro tipo de correspondência de padrão fornecido pelo MySQL usa expressões regulares estendidas. Quando você testa uma correspondência para este tipo de padrão, use a função `REGEXP_LIKE()` (ou os operadores `REGEXP` ou `RLIKE`, que são sinônimos de `REGEXP_LIKE()`).

A lista a seguir descreve algumas características das expressões regulares estendidas:

- `.` corresponde a qualquer caractere.
- Uma classe de caracteres `[...]` corresponde a qualquer caracter dentro dos parênteses. Por exemplo, `[abc]` corresponde a `a`, `b`, ou `c`. Para nomear um intervalo de caracteres, use um traço. `[a-z]` corresponde a qualquer letra, enquanto `[0-9]` corresponde a qualquer dígito.
- `*` corresponde a zero ou mais instâncias da coisa que o precede. Por exemplo, `x*` corresponde a qualquer número de `x` caracteres, `[0-9]*` corresponde a qualquer número de dígitos, e `.*` corresponde a qualquer número de qualquer coisa.
- Uma correspondência de padrão de expressão regular é bem-sucedida se o padrão corresponder a qualquer lugar no valor sendo testado. (Isso difere de uma correspondência de padrão `LIKE`, que é bem-sucedida apenas se o padrão corresponder ao valor inteiro.)
- Para ancorar um padrão para que ele corresponda ao início ou ao fim do valor a ser testado, use `^` no início ou `$` no final do padrão.

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

Para forçar uma comparação de expressões regulares a ser sensível a maiúsculas e minúsculas, use uma coleta sensível a maiúsculas e minúsculas, ou use a palavra-chave `BINARY` para tornar uma das strings uma string binária, ou especifique o `c` caracter de controle de correspondência. Cada uma dessas consultas corresponde apenas a `b` minúscula no início de um nome:

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

Para encontrar nomes contendo um `w`, use esta consulta:

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

Como um padrão de expressão regular corresponde se ocorrer em qualquer lugar no valor, não é necessário na consulta anterior colocar um wildcard em ambos os lados do padrão para que ele corresponda ao valor inteiro, como seria verdadeiro com um padrão SQL.

Para encontrar nomes contendo exatamente cinco caracteres, use `^` e `$` para combinar o início e o fim do nome, e cinco instâncias de `.` no meio:

```
mysql> SELECT * FROM pet WHERE REGEXP_LIKE(name, '^.....$');
+-------+--------+---------+------+------------+-------+
| name  | owner  | species | sex  | birth      | death |
+-------+--------+---------+------+------------+-------+
| Claws | Gwen   | cat     | m    | 1994-03-17 | NULL  |
| Buffy | Harold | dog     | f    | 1989-05-13 | NULL  |
+-------+--------+---------+------+------------+-------+
```

Você também pode escrever a consulta anterior usando o operador `{n}` (`“repeat-*n*-times”`):

```
mysql> SELECT * FROM pet WHERE REGEXP_LIKE(name, '^.{5}$');
+-------+--------+---------+------+------------+-------+
| name  | owner  | species | sex  | birth      | death |
+-------+--------+---------+------+------------+-------+
| Claws | Gwen   | cat     | m    | 1994-03-17 | NULL  |
| Buffy | Harold | dog     | f    | 1989-05-13 | NULL  |
+-------+--------+---------+------+------------+-------+
```

Para obter mais informações sobre a sintaxe das expressões regulares, ver Secção 14.8.2, "Expressões regulares".
