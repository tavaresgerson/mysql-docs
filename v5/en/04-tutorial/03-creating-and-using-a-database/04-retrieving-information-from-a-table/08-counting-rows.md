#### 3.3.4.8 Contando Linhas

Databases são frequentemente usados para responder à pergunta: "Com que frequência um certo tipo de dado ocorre em uma table?" Por exemplo, você pode querer saber quantos pets você tem, ou quantos pets cada owner possui, ou você pode querer realizar vários tipos de operações de censo em seus animais.

Contar o número total de animais que você tem é a mesma pergunta que "Quantas rows existem na table `pet`?" porque há um registro por pet. O [`COUNT(*)`](aggregate-functions.html#function_count) conta o número de rows, então a Query para contar seus animais se parece com isto:

```sql
mysql> SELECT COUNT(*) FROM pet;
+----------+
| COUNT(*) |
+----------+
|        9 |
+----------+
```

Anteriormente, você recuperou os nomes das pessoas que possuíam pets. Você pode usar [`COUNT()`](aggregate-functions.html#function_count) se quiser descobrir quantos pets cada owner tem:

```sql
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

A Query anterior usa `GROUP BY` para agrupar todos os registros para cada `owner`. O uso de [`COUNT()`](aggregate-functions.html#function_count) em conjunto com `GROUP BY` é útil para caracterizar seus dados sob vários agrupamentos. Os exemplos a seguir mostram diferentes maneiras de realizar operações de censo animal.

Número de animais por espécie:

```sql
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

```sql
mysql> SELECT sex, COUNT(*) FROM pet GROUP BY sex;
+------+----------+
| sex  | COUNT(*) |
+------+----------+
| NULL |        1 |
| f    |        4 |
| m    |        4 |
+------+----------+
```

(Nesta saída, `NULL` indica que o sexo é desconhecido.)

Número de animais por combinação de espécie e sexo:

```sql
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

Você não precisa recuperar uma table inteira ao usar [`COUNT()`](aggregate-functions.html#function_count). Por exemplo, a Query anterior, quando executada apenas em cães e gatos, se parece com isto:

```sql
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

Ou, se você quisesse o número de animais por sexo apenas para animais cujo sexo é conhecido:

```sql
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

Se você nomear colunas para selecionar além do valor de [`COUNT()`](aggregate-functions.html#function_count), uma cláusula `GROUP BY` deve estar presente nomeando essas mesmas colunas. Caso contrário, ocorre o seguinte:

* Se o [`ONLY_FULL_GROUP_BY`](sql-mode.html#sqlmode_only_full_group_by) SQL mode estiver habilitado, ocorre um error:

  ```sql
  mysql> SET sql_mode = 'ONLY_FULL_GROUP_BY';
  Query OK, 0 rows affected (0.00 sec)

  mysql> SELECT owner, COUNT(*) FROM pet;
  ERROR 1140 (42000): In aggregated query without GROUP BY, expression
  #1 of SELECT list contains nonaggregated column 'menagerie.pet.owner';
  this is incompatible with sql_mode=only_full_group_by
  ```

* Se [`ONLY_FULL_GROUP_BY`](sql-mode.html#sqlmode_only_full_group_by) não estiver habilitado, a Query é processada tratando todas as rows como um único group, mas o valor selecionado para cada coluna nomeada é não determinístico. O server é livre para selecionar o valor de qualquer row:

  ```sql
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

Veja também [Section 12.19.3, “MySQL Handling of GROUP BY”](group-by-handling.html "12.19.3 MySQL Handling of GROUP BY"). Consulte [Section 12.19.1, “Aggregate Function Descriptions”](aggregate-functions.html "12.19.1 Aggregate Function Descriptions") para obter informações sobre o comportamento do [`COUNT(expr)`](aggregate-functions.html#function_count) e otimizações relacionadas.