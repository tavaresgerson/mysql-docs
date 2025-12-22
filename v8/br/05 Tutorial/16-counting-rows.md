#### 5.3.4.8 Linhas de contagem

As bases de dados são frequentemente utilizadas para responder à pergunta: "Com que frequência um determinado tipo de dados ocorre numa tabela?" Por exemplo, pode querer saber quantos animais de estimação tem ou quantos animais de estimação tem cada proprietário, ou pode querer realizar vários tipos de operações de censo nos seus animais.

Contar o número total de animais que você tem é a mesma pergunta que Quantas linhas há na tabela `pet`? porque há um registro por animal de estimação. `COUNT(*)` conta o número de linhas, então a consulta para contar seus animais é assim:

```
mysql> SELECT COUNT(*) FROM pet;
+----------+
| COUNT(*) |
+----------+
|        9 |
+----------+
```

Anteriormente, você recuperou os nomes das pessoas que possuíam animais de estimação. Você pode usar `COUNT()` se quiser descobrir quantos animais de estimação cada proprietário tem:

```
mysql> SELECT owner, COUNT(*) FROM pet GROUP BY owner;
+--------+----------+
| owner  | COUNT(*) |
+--------+----------+
| Benny  |        2 |
| Diane  |        2 |
| Gwen   |        3 |
| Harold |        2 |
+--------+----------+
```

A consulta anterior usa `GROUP BY` para agrupar todos os registros para cada `owner`. O uso de `COUNT()` em conjunto com `GROUP BY` é útil para caracterizar seus dados sob vários agrupamentos. Os exemplos a seguir mostram diferentes maneiras de realizar operações de censo de animais.

Número de animais por espécie:

```
mysql> SELECT species, COUNT(*) FROM pet GROUP BY species;
+---------+----------+
| species | COUNT(*) |
+---------+----------+
| bird    |        2 |
| cat     |        2 |
| dog     |        3 |
| hamster |        1 |
| snake   |        1 |
+---------+----------+
```

Número de animais por sexo:

```
mysql> SELECT sex, COUNT(*) FROM pet GROUP BY sex;
+------+----------+
| sex  | COUNT(*) |
+------+----------+
| NULL |        1 |
| f    |        4 |
| m    |        4 |
+------+----------+
```

(Nesta saída, \[`NULL`] indica que o sexo é desconhecido.)

Número de animais por combinação de espécies e sexo:

```
mysql> SELECT species, sex, COUNT(*) FROM pet GROUP BY species, sex;
+---------+------+----------+
| species | sex  | COUNT(*) |
+---------+------+----------+
| bird    | NULL |        1 |
| bird    | f    |        1 |
| cat     | f    |        1 |
| cat     | m    |        1 |
| dog     | f    |        1 |
| dog     | m    |        2 |
| hamster | f    |        1 |
| snake   | m    |        1 |
+---------+------+----------+
```

Você não precisa recuperar uma tabela inteira quando usa `COUNT()`. Por exemplo, a consulta anterior, quando executada apenas em cães e gatos, parece assim:

```
mysql> SELECT species, sex, COUNT(*) FROM pet
       WHERE species = 'dog' OR species = 'cat'
       GROUP BY species, sex;
+---------+------+----------+
| species | sex  | COUNT(*) |
+---------+------+----------+
| cat     | f    |        1 |
| cat     | m    |        1 |
| dog     | f    |        1 |
| dog     | m    |        2 |
+---------+------+----------+
```

Ou, se quiser o número de animais por sexo apenas para animais cujo sexo é conhecido:

```
mysql> SELECT species, sex, COUNT(*) FROM pet
       WHERE sex IS NOT NULL
       GROUP BY species, sex;
+---------+------+----------+
| species | sex  | COUNT(*) |
+---------+------+----------+
| bird    | f    |        1 |
| cat     | f    |        1 |
| cat     | m    |        1 |
| dog     | f    |        1 |
| dog     | m    |        2 |
| hamster | f    |        1 |
| snake   | m    |        1 |
+---------+------+----------+
```

Se você nomear colunas para selecionar além do valor `COUNT()`, uma cláusula `GROUP BY` deve estar presente que nomeia essas mesmas colunas. Caso contrário, ocorre o seguinte:

- Se o modo SQL `ONLY_FULL_GROUP_BY` estiver habilitado, ocorre um erro:

  ```
  mysql> SET sql_mode = 'ONLY_FULL_GROUP_BY';
  Query OK, 0 rows affected (0.00 sec)

  mysql> SELECT owner, COUNT(*) FROM pet;
  ERROR 1140 (42000): In aggregated query without GROUP BY, expression
  #1 of SELECT list contains nonaggregated column 'menagerie.pet.owner';
  this is incompatible with sql_mode=only_full_group_by
  ```
- Se `ONLY_FULL_GROUP_BY` não estiver habilitado, a consulta é processada tratando todas as linhas como um único grupo, mas o valor selecionado para cada coluna nomeada é não determinístico. O servidor é livre para selecionar o valor de qualquer linha:

  ```
  mysql> SET sql_mode = '';
  Query OK, 0 rows affected (0.00 sec)

  mysql> SELECT owner, COUNT(*) FROM pet;
  +--------+----------+
  | owner  | COUNT(*) |
  +--------+----------+
  | Harold |        8 |
  +--------+----------+
  1 row in set (0.00 sec)
  ```

Veja também a Seção 14.19.3, MySQL Handling of GROUP BY. Veja a Seção 14.19.1, Aggregate Function Descriptions para informações sobre o comportamento do `COUNT(expr)` e otimizações relacionadas.
