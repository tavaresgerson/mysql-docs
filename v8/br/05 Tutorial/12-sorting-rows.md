#### 5.3.4.4 Linhas de classificação

Você pode ter notado nos exemplos anteriores que as linhas de resultados não são exibidas em nenhuma ordem particular. É muitas vezes mais fácil examinar a saída da consulta quando as linhas são classificadas de alguma forma significativa. Para classificar um resultado, use uma cláusula `ORDER BY`.

Aqui estão os aniversários dos animais, ordenados por data:

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

Em colunas de tipo de caracteres, a classificação  como todas as outras operações de comparação  é normalmente executada de forma insensible a maiúsculas e minúsculas. Isso significa que a ordem não é definida para colunas que são idênticas, exceto por suas maiúsculas e minúsculas. Você pode forçar uma classificação sensível a maiúsculas e minúsculas para uma coluna usando `BINARY` assim: `ORDER BY BINARY col_name`.

A ordem de classificação padrão é ascendente, com os valores mais pequenos primeiro. Para classificar em ordem inversa (descendente), adicione a palavra-chave `DESC` ao nome da coluna que você está classificando por:

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

Você pode classificar em várias colunas, e você pode classificar diferentes colunas em diferentes direções. Por exemplo, para classificar por tipo de animal em ordem ascendente, em seguida, por data de nascimento dentro do tipo de animal em ordem decrescente (animais mais jovens primeiro), use a seguinte consulta:

```
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

A palavra-chave `DESC` aplica-se apenas ao nome da coluna imediatamente anterior (`birth`); ela não afeta a ordem de classificação da coluna `species`.
