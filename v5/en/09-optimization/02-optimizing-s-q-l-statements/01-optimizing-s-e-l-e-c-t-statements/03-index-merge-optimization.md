#### 8.2.1.3 Otimização Index Merge

O método de acesso Index Merge recupera linhas com múltiplos `range` scans e une seus resultados em um só. Este método de acesso mescla (merge) scans de Index de uma única tabela apenas, e não scans de múltiplas tabelas. A mesclagem pode produzir unions, intersections ou unions-of-intersections dos seus scans subjacentes.

Exemplos de Queries para as quais o Index Merge pode ser usado:

```sql
SELECT * FROM tbl_name WHERE key1 = 10 OR key2 = 20;

SELECT * FROM tbl_name
  WHERE (key1 = 10 OR key2 = 20) AND non_key = 30;

SELECT * FROM t1, t2
  WHERE (t1.key1 IN (1,2) OR t1.key2 LIKE 'value%')
  AND t2.key1 = t1.some_col;

SELECT * FROM t1, t2
  WHERE t1.key1 = 1
  AND (t2.key1 = t1.some_col OR t2.key2 = t1.some_col2);
```

Nota

O algoritmo de otimização Index Merge possui as seguintes limitações conhecidas:

* Se sua Query tiver uma cláusula `WHERE` complexa com aninhamento profundo de `AND`/`OR` e o MySQL não escolher o plano ideal, tente distribuir os termos usando as seguintes transformações de identidade:

  ```sql
  (x AND y) OR z => (x OR z) AND (y OR z)
  (x OR y) AND z => (x AND z) OR (y AND z)
  ```

* Index Merge não é aplicável a full-text Indexes.

Na saída do `EXPLAIN`, o método Index Merge aparece como `index_merge` na coluna `type`. Neste caso, a coluna `key` contém uma lista dos Indexes utilizados, e `key_len` contém uma lista das partes mais longas do Key para esses Indexes.

O método de acesso Index Merge possui vários algoritmos, que são exibidos no campo `Extra` da saída do `EXPLAIN`:

* `Using intersect(...)`
* `Using union(...)`
* `Using sort_union(...)`

As seções a seguir descrevem esses algoritmos em mais detalhes. O optimizer escolhe entre diferentes algoritmos Index Merge possíveis e outros métodos de acesso com base nas estimativas de custo (cost estimates) das várias opções disponíveis.

O uso do Index Merge está sujeito ao valor das flags `index_merge`, `index_merge_intersection`, `index_merge_union` e `index_merge_sort_union` da variável de sistema `optimizer_switch`. Consulte a Seção 8.9.2, “Otimizações Comutáveis” (Switchable Optimizations). Por padrão, todas essas flags estão `on`. Para habilitar apenas certos algoritmos, defina `index_merge` como `off` e habilite apenas aquelas outras que devem ser permitidas.

* Algoritmo de Acesso Index Merge Intersection
* Algoritmo de Acesso Index Merge Union
* Algoritmo de Acesso Index Merge Sort-Union

##### Algoritmo de Acesso Index Merge Intersection

Este algoritmo de acesso é aplicável quando uma cláusula `WHERE` é convertida em várias condições de range em diferentes Keys combinadas com `AND`, e cada condição é uma das seguintes:

* Uma expressão de *`N`* partes desta forma, onde o Index tem exatamente *`N`* partes (ou seja, todas as partes do Index são cobertas):

  ```sql
  key_part1 = const1 AND key_part2 = const2 ... AND key_partN = constN
  ```

* Qualquer condição de range sobre a Primary Key de uma tabela `InnoDB`.

Exemplos:

```sql
SELECT * FROM innodb_table
  WHERE primary_key < 10 AND key_col1 = 20;

SELECT * FROM tbl_name
  WHERE key1_part1 = 1 AND key1_part2 = 2 AND key2 = 2;
```

O algoritmo Index Merge intersection executa scans simultâneos em todos os Indexes utilizados e produz a interseção das sequências de linha que recebe dos scans de Index mesclados.

Se todas as colunas usadas na Query forem cobertas pelos Indexes utilizados, as linhas completas da tabela não são recuperadas (a saída do `EXPLAIN` contém `Using index` no campo `Extra` neste caso). Aqui está um exemplo de tal Query:

```sql
SELECT COUNT(*) FROM t1 WHERE key1 = 1 AND key2 = 1;
```

Se os Indexes utilizados não cobrirem todas as colunas usadas na Query, as linhas completas são recuperadas somente quando as condições de range para todas as Keys utilizadas forem satisfeitas.

Se uma das condições mescladas for uma condição sobre a Primary Key de uma tabela `InnoDB`, ela não será usada para recuperação de linha, mas será usada para filtrar linhas recuperadas usando outras condições.

##### Algoritmo de Acesso Index Merge Union

Os critérios para este algoritmo são semelhantes aos do algoritmo Index Merge intersection. O algoritmo é aplicável quando a cláusula `WHERE` da tabela é convertida em várias condições de range em diferentes Keys combinadas com `OR`, e cada condição é uma das seguintes:

* Uma expressão de *`N`* partes desta forma, onde o Index tem exatamente *`N`* partes (ou seja, todas as partes do Index são cobertas):

  ```sql
  key_part1 = const1 OR key_part2 = const2 ... OR key_partN = constN
  ```

* Qualquer condição de range sobre uma Primary Key de uma tabela `InnoDB`.

* Uma condição para a qual o algoritmo Index Merge intersection é aplicável.

Exemplos:

```sql
SELECT * FROM t1
  WHERE key1 = 1 OR key2 = 2 OR key3 = 3;

SELECT * FROM innodb_table
  WHERE (key1 = 1 AND key2 = 2)
     OR (key3 = 'foo' AND key4 = 'bar') AND key5 = 5;
```

##### Algoritmo de Acesso Index Merge Sort-Union

Este algoritmo de acesso é aplicável quando a cláusula `WHERE` é convertida em várias condições de range combinadas por `OR`, mas o algoritmo Index Merge union não é aplicável.

Exemplos:

```sql
SELECT * FROM tbl_name
  WHERE key_col1 < 10 OR key_col2 < 20;

SELECT * FROM tbl_name
  WHERE (key_col1 > 10 OR key_col2 = 20) AND nonkey_col = 30;
```

A diferença entre o algoritmo sort-union e o algoritmo union é que o algoritmo sort-union deve primeiro buscar os IDs das linhas (row IDs) para todas as linhas e classificá-las antes de retornar quaisquer linhas.