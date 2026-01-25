#### 8.2.1.17 Otimização de Query com LIMIT

Se você precisar apenas de um número especificado de linhas de um *result set*, use uma cláusula `LIMIT` na Query, em vez de buscar o *result set* inteiro e descartar os dados extras.

O MySQL, às vezes, otimiza uma Query que possui uma cláusula `LIMIT row_count` e nenhuma cláusula `HAVING`:

* Se você selecionar apenas algumas linhas com `LIMIT`, o MySQL usa Indexes em alguns casos em que normalmente preferiria fazer um *full table scan*.

* Se você combinar `LIMIT row_count` com `ORDER BY`, o MySQL para de ordenar assim que encontra as primeiras *`row_count`* linhas do resultado ordenado, em vez de ordenar o resultado inteiro. Se a ordenação for feita usando um Index, isso é muito rápido. Se um *filesort* precisar ser executado, todas as linhas que correspondem à Query sem a cláusula `LIMIT` são selecionadas, e a maioria ou todas elas são ordenadas, antes que as primeiras *`row_count`* sejam encontradas. Após as linhas iniciais terem sido encontradas, o MySQL não ordena o restante do *result set*.

  Uma manifestação desse comportamento é que uma Query com `ORDER BY` com e sem `LIMIT` pode retornar linhas em uma ordem diferente, conforme descrito posteriormente nesta seção.

* Se você combinar `LIMIT row_count` com `DISTINCT`, o MySQL para assim que encontra *`row_count`* linhas únicas.

* Em alguns casos, um `GROUP BY` pode ser resolvido lendo o Index em ordem (ou realizando uma ordenação no Index), e depois calculando resumos até que o valor do Index mude. Neste caso, `LIMIT row_count` não calcula valores `GROUP BY` desnecessários.

* Assim que o MySQL envia o número necessário de linhas ao cliente, ele aborta a Query, a menos que você esteja usando `SQL_CALC_FOUND_ROWS`. Nesse caso, o número de linhas pode ser recuperado com `SELECT FOUND_ROWS()`. Consulte a Seção 12.15, “Funções de Informação”.

* `LIMIT 0` retorna rapidamente um *empty set* (conjunto vazio). Isso pode ser útil para verificar a validade de uma Query. Também pode ser empregado para obter os tipos das colunas de resultado dentro de aplicações que usam uma API MySQL que disponibiliza os metadados do *result set*. Com o programa cliente **mysql**, você pode usar a opção `--column-type-info` para exibir os tipos das colunas de resultado.

* Se o servidor usar *temporary tables* (tabelas temporárias) para resolver uma Query, ele usa a cláusula `LIMIT row_count` para calcular quanto espaço é necessário.

* Se um Index não for usado para `ORDER BY`, mas uma cláusula `LIMIT` também estiver presente, o otimizador pode ser capaz de evitar o uso de um *merge file* e ordenar as linhas na memória usando uma operação de *filesort* em memória (*in-memory filesort*).

Se múltiplas linhas tiverem valores idênticos nas colunas `ORDER BY`, o servidor está livre para retornar essas linhas em qualquer ordem, e pode fazê-lo de forma diferente dependendo do plano de execução geral. Em outras palavras, a ordem de ordenação dessas linhas é não determinística em relação às colunas não ordenadas.

Um fator que afeta o plano de execução é o `LIMIT`, portanto, uma Query com `ORDER BY` com e sem `LIMIT` pode retornar linhas em ordens diferentes. Considere esta Query, que é ordenada pela coluna `category`, mas é não determinística em relação às colunas `id` e `rating`:

```sql
mysql> SELECT * FROM ratings ORDER BY category;
+----+----------+--------+
| id | category | rating |
+----+----------+--------+
|  1 |        1 |    4.5 |
|  5 |        1 |    3.2 |
|  3 |        2 |    3.7 |
|  4 |        2 |    3.5 |
|  6 |        2 |    3.5 |
|  2 |        3 |    5.0 |
|  7 |        3 |    2.7 |
+----+----------+--------+
```

Incluir `LIMIT` pode afetar a ordem das linhas dentro de cada valor de `category`. Por exemplo, este é um resultado de Query válido:

```sql
mysql> SELECT * FROM ratings ORDER BY category LIMIT 5;
+----+----------+--------+
| id | category | rating |
+----+----------+--------+
|  1 |        1 |    4.5 |
|  5 |        1 |    3.2 |
|  4 |        2 |    3.5 |
|  3 |        2 |    3.7 |
|  6 |        2 |    3.5 |
+----+----------+--------+
```

Em cada caso, as linhas são ordenadas pela coluna `ORDER BY`, que é tudo o que é exigido pelo padrão SQL.

Se for importante garantir a mesma ordem de linhas com e sem `LIMIT`, inclua colunas adicionais na cláusula `ORDER BY` para tornar a ordem determinística. Por exemplo, se os valores de `id` forem únicos, você pode fazer com que as linhas para um determinado valor de `category` apareçam na ordem de `id` ordenando assim:

```sql
mysql> SELECT * FROM ratings ORDER BY category, id;
+----+----------+--------+
| id | category | rating |
+----+----------+--------+
|  1 |        1 |    4.5 |
|  5 |        1 |    3.2 |
|  3 |        2 |    3.7 |
|  4 |        2 |    3.5 |
|  6 |        2 |    3.5 |
|  2 |        3 |    5.0 |
|  7 |        3 |    2.7 |
+----+----------+--------+

mysql> SELECT * FROM ratings ORDER BY category, id LIMIT 5;
+----+----------+--------+
| id | category | rating |
+----+----------+--------+
|  1 |        1 |    4.5 |
|  5 |        1 |    3.2 |
|  3 |        2 |    3.7 |
|  4 |        2 |    3.5 |
|  6 |        2 |    3.5 |
+----+----------+--------+
```

Para uma Query com `ORDER BY` ou `GROUP BY` e uma cláusula `LIMIT`, o otimizador tenta escolher um *ordered index* por padrão quando parece que isso aceleraria a execução da Query. Antes do MySQL 5.7.33, não havia como substituir esse comportamento, mesmo em casos em que o uso de alguma outra otimização pudesse ser mais rápido. A partir do MySQL 5.7.33, é possível desativar essa otimização definindo o *flag* `prefer_ordering_index` da variável de sistema `optimizer_switch` como `off`.

*Exemplo*: Primeiro criamos e populamos uma tabela `t` conforme mostrado aqui:

```sql
# Create and populate a table t:

mysql> CREATE TABLE t (
    ->     id1 BIGINT NOT NULL,
    ->     id2 BIGINT NOT NULL,
    ->     c1 VARCHAR(50) NOT NULL,
    ->     c2 VARCHAR(50) NOT NULL,
    ->  PRIMARY KEY (id1),
    ->  INDEX i (id2, c1)
    -> );

# [Insert some rows into table t - not shown]
```

Verifique se o *flag* `prefer_ordering_index` está habilitado:

```sql
mysql> SELECT @@optimizer_switch LIKE '%prefer_ordering_index=on%';
+------------------------------------------------------+
| @@optimizer_switch LIKE '%prefer_ordering_index=on%' |
+------------------------------------------------------+
|                                                    1 |
+------------------------------------------------------+
```

Uma vez que a Query a seguir possui uma cláusula `LIMIT`, esperamos que ela use um *ordered index*, se possível. Neste caso, como podemos ver na saída do `EXPLAIN`, ela usa a *Primary Key* da tabela.

```sql
mysql> EXPLAIN SELECT c2 FROM t
    ->     WHERE id2 > 3
    ->     ORDER BY id1 ASC LIMIT 2\G
*************************** 1. row ***************************
           id: 1
  select_type: SIMPLE
        table: t
   partitions: NULL
         type: index
possible_keys: i
          key: PRIMARY
      key_len: 8
          ref: NULL
         rows: 2
     filtered: 70.00
        Extra: Using where
```

Agora desativamos o *flag* `prefer_ordering_index` e executamos novamente a mesma Query; desta vez, ela usa o Index `i` (que inclui a coluna `id2` usada na cláusula `WHERE`) e um *filesort*:

```sql
mysql> SET optimizer_switch = "prefer_ordering_index=off";

mysql> EXPLAIN SELECT c2 FROM t
    ->     WHERE id2 > 3
    ->     ORDER BY id1 ASC LIMIT 2\G
*************************** 1. row ***************************
           id: 1
  select_type: SIMPLE
        table: t
   partitions: NULL
         type: range
possible_keys: i
          key: i
      key_len: 8
          ref: NULL
         rows: 14
     filtered: 100.00
        Extra: Using index condition; Using filesort
```

Consulte também a Seção 8.9.2, “Otimizações Alternáveis”.