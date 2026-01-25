#### 3.3.4.4 Ordenando Linhas

Você deve ter notado nos exemplos anteriores que as linhas de resultado são exibidas sem uma ordem específica. Geralmente, é mais fácil examinar a saída da Query quando as linhas estão ordenadas de uma maneira significativa. Para ordenar um resultado, use uma cláusula `ORDER BY`.

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

Em colunas do tipo caractere, a ordenação — assim como todas as outras operações de comparação — é normalmente realizada de forma case-insensitive (não sensível a maiúsculas e minúsculas). Isso significa que a ordem é indefinida para colunas que são idênticas, exceto pelo seu case (caixa). Você pode forçar uma ordenação case-sensitive (sensível a maiúsculas e minúsculas) para uma coluna usando [`BINARY`](cast-functions.html#operator_binary) da seguinte forma: `ORDER BY BINARY col_name`.

A ordem de ordenação padrão é ascendente (ascending), com os valores menores primeiro. Para ordenar na ordem inversa (descending), adicione a palavra-chave `DESC` ao nome da coluna pela qual você está ordenando:

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

Você pode ordenar por múltiplas colunas e pode ordenar colunas diferentes em direções diferentes. Por exemplo, para ordenar pelo tipo de animal em ordem ascendente e, em seguida, pela data de nascimento dentro do tipo de animal em ordem descendente (os animais mais jovens primeiro), use a seguinte Query:

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

A palavra-chave `DESC` se aplica apenas ao nome da coluna imediatamente anterior a ela (`birth`); ela não afeta a ordem de ordenação da coluna `species`.