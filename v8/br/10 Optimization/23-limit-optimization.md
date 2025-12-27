#### 10.2.1.19 Otimização da consulta `LIMIT`

Se você precisar apenas de um número especificado de linhas de um conjunto de resultados, use uma cláusula `LIMIT` na consulta, em vez de buscar todo o conjunto de resultados e descartar os dados extras.

O MySQL às vezes otimiza uma consulta que tem uma cláusula `LIMIT row_count` e nenhuma cláusula `HAVING`:

* Se você selecionar apenas algumas linhas com `LIMIT`, o MySQL usa índices em alguns casos, quando normalmente preferiria fazer uma varredura completa da tabela.
* Se você combinar `LIMIT row_count` com `ORDER BY`, o MySQL para de ordenar assim que encontrar as primeiras *`row_count`* linhas do resultado ordenado, em vez de ordenar todo o resultado. Se a ordenação for feita usando um índice, isso é muito rápido. Se uma ordenação por arquivos precisar ser feita, todas as linhas que correspondem à consulta sem a cláusula `LIMIT` são selecionadas e a maioria ou todas são ordenadas antes que as primeiras *`row_count`* sejam encontradas. Após as primeiras linhas terem sido encontradas, o MySQL não ordena nenhum restante do conjunto de resultados.

Uma manifestação desse comportamento é que uma consulta `ORDER BY` com e sem `LIMIT` pode retornar linhas em ordem diferente, conforme descrito mais adiante nesta seção.
* Se você combinar `LIMIT row_count` com `DISTINCT`, o MySQL pára assim que encontrar *`row_count`* linhas únicas.
* Em alguns casos, uma `GROUP BY` pode ser resolvida lendo o índice em ordem (ou fazendo uma ordenação no índice), calculando os resumos até que o valor do índice mude. Nesse caso, `LIMIT row_count` não calcula quaisquer valores de `GROUP BY` desnecessários.
* Assim que o MySQL enviar o número necessário de linhas ao cliente, ele interrompe a consulta, a menos que você esteja usando `SQL_CALC_FOUND_ROWS`. Nesse caso, o número de linhas pode ser recuperado com `SELECT FOUND_ROWS()`. Veja a Seção 14.15, “Funções de Informação”.
* `LIMIT 0` retorna rapidamente um conjunto vazio. Isso pode ser útil para verificar a validade de uma consulta. Também pode ser empregado para obter os tipos das colunas do resultado dentro de aplicações que usam uma API do MySQL que disponibiliza metadados do conjunto de resultados. Com o programa cliente `mysql`, você pode usar a opção `--column-type-info` para exibir os tipos de colunas do resultado.
* Se o servidor usar tabelas temporárias para resolver uma consulta, ele usa a cláusula `LIMIT row_count` para calcular o espaço necessário.
* Se um índice não for usado para `ORDER BY`, mas uma cláusula `LIMIT` também estiver presente, o otimizador pode ser capaz de evitar usar um arquivo de junção e ordenar as linhas na memória usando uma operação `filesort` em memória.

Se várias linhas tiverem valores idênticos nas colunas de `ORDER BY`, o servidor é livre para retornar essas linhas em qualquer ordem e pode fazer isso de maneira diferente dependendo do plano de execução geral. Em outras palavras, a ordem de ordenação dessas linhas é não determinística em relação às colunas não ordenadas.

Um fator que afeta o plano de execução é o `LIMIT`, portanto, uma consulta `ORDER BY` com e sem `LIMIT` pode retornar linhas em ordens diferentes. Considere esta consulta, que é ordenada pela coluna `category`, mas não determinística em relação às colunas `id` e `rating`:

```
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

Incluir `LIMIT` pode afetar a ordem das linhas dentro de cada valor de `category`. Por exemplo, este é um resultado de consulta válido:

```
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

Em cada caso, as linhas são ordenadas pela coluna `ORDER BY`, o que é tudo o que é exigido pelo padrão SQL.

Se for importante garantir a mesma ordem de linha com e sem `LIMIT`, inclua colunas adicionais na cláusula `ORDER BY` para tornar a ordem determinística. Por exemplo, se os valores de `id` forem únicos, você pode fazer com que as linhas para um dado valor de `category` apareçam na ordem de `id` ordenando assim:

```
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

Para uma consulta com uma cláusula `ORDER BY` ou `GROUP BY` e uma cláusula `LIMIT`, o otimizador tenta escolher um índice ordenado por padrão quando isso parece acelerar a execução da consulta. Em casos onde usar outra otimização pode ser mais rápido, é possível desativar essa otimização definindo o sinalizador `prefer_ordering_index` da variável de sistema `optimizer_switch` para `off`.

*Exemplo*: Primeiro, criamos e preenchemos uma tabela `t` como mostrado aqui:

```
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

Verifique se o sinalizador `prefer_ordering_index` está habilitado:

```
mysql> SELECT @@optimizer_switch LIKE '%prefer_ordering_index=on%';
+------------------------------------------------------+
| @@optimizer_switch LIKE '%prefer_ordering_index=on%' |
+------------------------------------------------------+
|                                                    1 |
+------------------------------------------------------+
```

Como a consulta seguinte tem uma cláusula `LIMIT`, esperamos que use um índice ordenado, se possível. Neste caso, como podemos ver pelo resultado `EXPLAIN`, ele usa a chave primária da tabela.

```
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

Agora, desabilitamos o sinalizador `prefer_ordering_index` e executamos a mesma consulta novamente; desta vez, ele usa o índice `i` (que inclui a coluna `id2` usada na cláusula `WHERE`) e um filesort:

```
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

Veja também a Seção 10.9.2, “Otimizações Alternativas”.