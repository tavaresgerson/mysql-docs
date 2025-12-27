#### 5.3.4.8 Contagem de Linhas

As bases de dados são frequentemente usadas para responder à pergunta: “Com que frequência um determinado tipo de dado ocorre em uma tabela?” Por exemplo, você pode querer saber quantos animais você tem ou quantos animais cada proprietário tem, ou pode querer realizar vários tipos de operações de censo em seus animais.

Contar o número total de animais que você tem é a mesma pergunta que “Quantas linhas existem na tabela `pet`?” porque há um registro por animal. `COUNT(*)` conta o número de linhas, então a consulta para contar seus animais parece assim:

```
mysql> SELECT COUNT(*) FROM pet;
+----------+
| COUNT(*) |
+----------+
|        9 |
+----------+
```

Anteriormente, você recuperou os nomes das pessoas que possuíam animais. Você pode usar `COUNT()` se quiser descobrir quantos animais cada proprietário tem:

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

A consulta anterior usa `GROUP BY` para agrupar todos os registros para cada `owner`. O uso de `COUNT()` em conjunto com `GROUP BY` é útil para caracterizar seus dados sob vários agrupamentos. Os exemplos seguintes mostram diferentes maneiras de realizar operações de censo de animais.

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

(Neste resultado, `NULL` indica que o sexo é desconhecido.)

Número de animais por combinação de espécie e sexo:

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

Você não precisa recuperar uma tabela inteira quando usa `COUNT()`. Por exemplo, a consulta anterior, quando realizada apenas em cães e gatos, parece assim:

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

Ou, se você quisesse o número de animais por sexo apenas para animais cujos sexos são conhecidos:

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

Se você nomear as colunas para selecionar além do valor de `COUNT()`, uma cláusula `GROUP BY` deve estar presente que nomeie essas mesmas colunas. Caso contrário, o seguinte ocorre:

* Se o modo SQL `ONLY_FULL_GROUP_BY` estiver habilitado, um erro ocorre:

  ```
  mysql> SET sql_mode = 'ONLY_FULL_GROUP_BY';
  Query OK, 0 rows affected (0.00 sec)

  mysql> SELECT owner, COUNT(*) FROM pet;
  ERROR 1140 (42000): In aggregated query without GROUP BY, expression
  #1 of SELECT list contains nonaggregated column 'menagerie.pet.owner';
  this is incompatible with sql_mode=only_full_group_by
  ```

* Se `ONLY_FULL_GROUP_BY` não estiver habilitado, a consulta é processada tratando todas as linhas como um único grupo, mas o valor selecionado para cada coluna nomeada é não determinístico. O servidor tem liberdade para selecionar o valor de qualquer linha:

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

Consulte também a Seção 14.19.3, “Tratamento do MySQL do GROUP BY”. Consulte a Seção 14.19.1, “Descrição das Funções Agregadas” para informações sobre o comportamento de `COUNT(expr)` e otimizações relacionadas.