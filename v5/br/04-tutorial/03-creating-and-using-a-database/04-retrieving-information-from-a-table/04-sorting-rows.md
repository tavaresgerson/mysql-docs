#### 3.3.4.4 Sorter de Linhas

Você pode ter notado nos exemplos anteriores que as linhas de resultado são exibidas sem ordem específica. Muitas vezes é mais fácil examinar o resultado da consulta quando as linhas estão ordenadas de alguma maneira significativa. Para ordenar um resultado, use uma cláusula `ORDER BY`.

Aqui estão os aniversários dos animais, classificados por data:

```sql
mysql> SELECT name, birth FROM pet ORDER BY birth;
+----------+------------+
| name     | birth      |
+----------+------------+
| Buffy    | 1989-05-13 |
| Bowser   | 1989-08-31 |
| Fang     | 1990-08-27 |
| Fluffy   | 1993-02-04 |
| Claws    | 1994-03-17 |
| Slim     | 1996-04-29 |
| Whistler | 1997-12-09 |
| Chirpy   | 1998-09-11 |
| Puffball | 1999-03-30 |
+----------+------------+
```

Em colunas de tipo de caractere, a ordenação, como todas as outras operações de comparação, é normalmente realizada de forma não sensível ao caso. Isso significa que a ordem é indefinida para colunas que são idênticas, exceto pelo seu caso. Você pode forçar uma ordenação sensível ao caso para uma coluna usando [`BINARY`](cast-functions.html#operator_binary) da seguinte forma: `ORDER BY BINARY col_name`.

O padrão é o ordenamento ascendente, com os menores valores primeiro. Para ordenar em ordem inversa (descendente), adicione a palavra-chave `DESC` ao nome da coluna que você está ordenando:

```sql
mysql> SELECT name, birth FROM pet ORDER BY birth DESC;
+----------+------------+
| name     | birth      |
+----------+------------+
| Puffball | 1999-03-30 |
| Chirpy   | 1998-09-11 |
| Whistler | 1997-12-09 |
| Slim     | 1996-04-29 |
| Claws    | 1994-03-17 |
| Fluffy   | 1993-02-04 |
| Fang     | 1990-08-27 |
| Bowser   | 1989-08-31 |
| Buffy    | 1989-05-13 |
+----------+------------+
```

Você pode ordenar por várias colunas e ordenar diferentes colunas em direções diferentes. Por exemplo, para ordenar por tipo de animal em ordem crescente, depois por data de nascimento dentro do tipo de animal em ordem decrescente (animais mais jovens primeiro), use a seguinte consulta:

```sql
mysql> SELECT name, species, birth FROM pet
       ORDER BY species, birth DESC;
+----------+---------+------------+
| name     | species | birth      |
+----------+---------+------------+
| Chirpy   | bird    | 1998-09-11 |
| Whistler | bird    | 1997-12-09 |
| Claws    | cat     | 1994-03-17 |
| Fluffy   | cat     | 1993-02-04 |
| Fang     | dog     | 1990-08-27 |
| Bowser   | dog     | 1989-08-31 |
| Buffy    | dog     | 1989-05-13 |
| Puffball | hamster | 1999-03-30 |
| Slim     | snake   | 1996-04-29 |
+----------+---------+------------+
```

A palavra-chave `DESC` só se aplica ao nome da coluna imediatamente anterior a ela (`birth`); ela não afeta a ordem de classificação da coluna `species`.
