#### 3.3.4.3 Selecionando Colunas Específicas

Se você não quiser ver linhas inteiras da sua tabela, basta nomear as columns nas quais você está interessado, separadas por vírgulas. Por exemplo, se você quiser saber quando seus animais nasceram, use SELECT nas columns `name` e `birth`:

```sql
mysql> SELECT name, birth FROM pet;
+----------+------------+
| name     | birth      |
+----------+------------+
| Fluffy   | 1993-02-04 |
| Claws    | 1994-03-17 |
| Buffy    | 1989-05-13 |
| Fang     | 1990-08-27 |
| Bowser   | 1989-08-31 |
| Chirpy   | 1998-09-11 |
| Whistler | 1997-12-09 |
| Slim     | 1996-04-29 |
| Puffball | 1999-03-30 |
+----------+------------+
```

Para descobrir quem possui os pets, utilize esta Query:

```sql
mysql> SELECT owner FROM pet;
+--------+
| owner  |
+--------+
| Harold |
| Gwen   |
| Harold |
| Benny  |
| Diane  |
| Gwen   |
| Gwen   |
| Benny  |
| Diane  |
+--------+
```

Observe que a Query simplesmente recupera a column `owner` de cada registro, e alguns deles aparecem mais de uma vez. Para minimizar a saída (output), recupere cada registro de saída exclusivo apenas uma vez, adicionando a palavra-chave `DISTINCT`:

```sql
mysql> SELECT DISTINCT owner FROM pet;
+--------+
| owner  |
+--------+
| Benny  |
| Diane  |
| Gwen   |
| Harold |
+--------+
```

Você pode usar uma cláusula `WHERE` para combinar a seleção de linha com a seleção de column. Por exemplo, para obter as datas de nascimento apenas para cães e gatos, utilize esta Query:

```sql
mysql> SELECT name, species, birth FROM pet
       WHERE species = 'dog' OR species = 'cat';
+--------+---------+------------+
| name   | species | birth      |
+--------+---------+------------+
| Fluffy | cat     | 1993-02-04 |
| Claws  | cat     | 1994-03-17 |
| Buffy  | dog     | 1989-05-13 |
| Fang   | dog     | 1990-08-27 |
| Bowser | dog     | 1989-08-31 |
+--------+---------+------------+
```