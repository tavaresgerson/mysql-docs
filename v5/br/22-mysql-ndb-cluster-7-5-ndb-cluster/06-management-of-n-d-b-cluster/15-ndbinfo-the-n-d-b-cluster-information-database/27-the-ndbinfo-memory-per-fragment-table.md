#### 21.6.15.27 A Tabela ndbinfo memory_per_fragment

* [Tabela memory_per_fragment: Notas](mysql-cluster-ndbinfo-memory-per-fragment.html#mysql-cluster-ndbinfo-memory-per-fragment-notes "memory_per_fragment Table: Notes")
* [Tabela memory_per_fragment: Exemplos](mysql-cluster-ndbinfo-memory-per-fragment.html#mysql-cluster-ndbinfo-memory-per-fragment-examples "memory_per_fragment Table: Examples")

A tabela `memory_per_fragment` fornece informações sobre o uso de memória por `fragments` individuais. Consulte as [Notas](mysql-cluster-ndbinfo-memory-per-fragment.html#mysql-cluster-ndbinfo-memory-per-fragment-notes "memory_per_fragment Table: Notes") mais adiante nesta seção para ver como você pode usar isso para descobrir quanta memória é usada pelas tabelas `NDB`.

A tabela `memory_per_fragment` contém as seguintes colunas:

* `fq_name`

  Nome deste `fragment`

* `parent_fq_name`

  Nome do pai (`parent`) deste `fragment`

* `type`

  Tipo de objeto de dicionário ([`Object::Type`](/doc/ndbapi/en/ndb-object.html#ndb-object-type), na NDB API) usado para este `fragment`; um dos seguintes: `System table`, `User table`, `Unique hash index`, `Hash index`, `Unique ordered index`, `Ordered index`, `Hash index trigger`, `Subscription trigger`, `Read only constraint`, `Index trigger`, `Reorganize trigger`, `Tablespace`, `Log file group`, `Data file`, `Undo file`, `Hash map`, `Foreign key definition`, `Foreign key parent trigger`, `Foreign key child trigger`, ou `Schema transaction`.

  Você também pode obter esta lista executando [`TABLE`](/doc/refman/8.0/en/table.html) [`ndbinfo.dict_obj_types`](mysql-cluster-ndbinfo-dict-obj-types.html "21.6.15.16 The ndbinfo dict_obj_types Table") no cliente [**mysql**](mysql.html "4.5.1 mysql — The MySQL Command-Line Client").

* `table_id`

  ID da Tabela para esta tabela

* `node_id`

  ID do Node para este `node`

* `block_instance`

  ID da instância do bloco do kernel NDB; você pode usar este número para obter informações sobre `threads` específicos da tabela [`threadblocks`](mysql-cluster-ndbinfo-threadblocks.html "21.6.15.41 The ndbinfo threadblocks Table").

* `fragment_num`

  ID (número) do Fragment

* `fixed_elem_alloc_bytes`

  Número de bytes alocados para elementos de tamanho fixo

* `fixed_elem_free_bytes`

  Bytes livres restantes nas páginas alocadas para elementos de tamanho fixo

* `fixed_elem_size_bytes`

  Comprimento de cada elemento de tamanho fixo em bytes

* `fixed_elem_count`

  Número de elementos de tamanho fixo

* `fixed_elem_free_count`

  Número de linhas livres para elementos de tamanho fixo

* `var_elem_alloc_bytes`

  Número de bytes alocados para elementos de tamanho variável

* `var_elem_free_bytes`

  Bytes livres restantes nas páginas alocadas para elementos de tamanho variável

* `var_elem_count`

  Número de elementos de tamanho variável

* `hash_index_alloc_bytes`

  Número de bytes alocados para `hash indexes`

##### Tabela memory_per_fragment: Notas

A tabela `memory_per_fragment` contém uma linha para cada `replica` de `fragment` de tabela e cada `replica` de `fragment` de `Index` no sistema; isto significa que, por exemplo, quando [`NoOfReplicas=2`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-noofreplicas), há normalmente duas `replicas` de `fragment` para cada `fragment`. Isso é verdade enquanto todos os `Data Nodes` estiverem em execução e conectados ao `cluster`; para um `Data Node` ausente, não há linhas para as `replicas` de `fragment` que ele hospeda.

As colunas da tabela `memory_per_fragment` podem ser agrupadas de acordo com sua função ou propósito da seguinte forma:

* *Colunas Chave*: `fq_name`, `type`, `table_id`, `node_id`, `block_instance` e `fragment_num`

* *Coluna de Relacionamento*: `parent_fq_name`

* *Colunas de Armazenamento de Tamanho Fixo*: `fixed_elem_alloc_bytes`, `fixed_elem_free_bytes`, `fixed_elem_size_bytes`, `fixed_elem_count` e `fixed_elem_free_count`

* *Colunas de Armazenamento de Tamanho Variável*: `var_elem_alloc_bytes`, `var_elem_free_bytes` e `var_elem_count`

* *Coluna de Hash Index*: `hash_index_alloc_bytes`

As colunas `parent_fq_name` e `fq_name` podem ser usadas para identificar `indexes` associados a uma tabela. Informações de hierarquia de objetos de esquema semelhantes estão disponíveis em outras tabelas `ndbinfo`.

`Replicas` de `fragment` de tabela e `index` alocam [`DataMemory`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-datamemory) em páginas de 32KB. Essas páginas de memória são gerenciadas conforme listado aqui:

* *Páginas de Tamanho Fixo*: Armazenam as partes de tamanho fixo das linhas armazenadas em um determinado `fragment`. Toda linha possui uma parte de tamanho fixo.

* *Páginas de Tamanho Variável*: Armazenam as partes de tamanho variável para as linhas no `fragment`. Toda linha que possui uma ou mais colunas de tamanho variável, uma ou mais colunas dinâmicas (ou ambas) tem uma parte de tamanho variável.

* *Páginas de Hash Index*: São alocadas como subpáginas de 8 KB e armazenam a estrutura do `Primary Key Hash Index`.

Cada linha em uma tabela `NDB` tem uma parte de tamanho fixo, consistindo em um cabeçalho de linha e uma ou mais colunas de tamanho fixo. A linha também pode conter uma ou mais referências de partes de tamanho variável, uma ou mais referências de partes em disco, ou ambas. Cada linha também possui uma entrada de `Primary Key Hash Index` (correspondente à `Primary Key` oculta que faz parte de toda tabela `NDB`).

A partir do exposto, podemos ver que cada `fragment` de tabela e `fragment` de `index` juntos alocam a quantidade de [`DataMemory`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-datamemory) calculada conforme mostrado aqui:

```sql
DataMemory =
  (number_of_fixed_pages + number_of_var_pages) * 32KB
    + number_of_hash_pages * 8KB
```

Como `fixed_elem_alloc_bytes` e `var_elem_alloc_bytes` são sempre múltiplos de 32768 bytes, podemos determinar ainda que `number_of_fixed_pages = fixed_elem_alloc_bytes / 32768` e `number_of_var_pages = var_elem_alloc_bytes / 32768`. `hash_index_alloc_bytes` é sempre um múltiplo de 8192 bytes, então `number_of_hash_pages = hash_index_alloc_bytes / 8192`.

Uma página de tamanho fixo tem um cabeçalho interno e vários *slots* de tamanho fixo, cada um dos quais pode conter a parte de tamanho fixo de uma linha. O tamanho da parte de tamanho fixo de uma determinada linha depende do esquema e é fornecido pela coluna `fixed_elem_size_bytes`; o número de *slots* de tamanho fixo por página pode ser determinado calculando o número total de *slots* e o número total de páginas, assim:

```sql
fixed_slots = fixed_elem_count + fixed_elem_free_count

fixed_pages = fixed_elem_alloc_bytes / 32768

slots_per_page = total_slots / total_pages
```

`fixed_elem_count` é, na verdade, a contagem de linhas para um determinado `fragment` de tabela, visto que cada linha tem 1 elemento fixo. `fixed_elem_free_count` é o número total de *slots* de tamanho fixo livres nas páginas alocadas. `fixed_elem_free_bytes` é igual a `fixed_elem_free_count * fixed_elem_size_bytes`.

Um `fragment` pode ter qualquer número de páginas de tamanho fixo; quando a última linha em uma página de tamanho fixo é excluída, a página é liberada para o `page pool` do `DataMemory`. Páginas de tamanho fixo podem ser fragmentadas, com mais páginas alocadas do que o necessário pelo número de *slots* de tamanho fixo em uso. Você pode verificar se este é o caso comparando as páginas necessárias com as páginas alocadas, o que você pode calcular assim:

```sql
fixed_pages_required = 1 + (fixed_elem_count / slots_per_page)

fixed_page_utilization = fixed_pages_required / fixed_pages
```

Uma página de tamanho variável possui um cabeçalho interno e usa o espaço restante para armazenar uma ou mais partes de linha de tamanho variável; o número de partes armazenadas depende do esquema e dos dados reais armazenados. Visto que nem todos os esquemas ou linhas possuem uma parte de tamanho variável, `var_elem_count` pode ser menor que `fixed_elem_count`. O espaço livre total disponível em todas as páginas de tamanho variável no `fragment` é mostrado pela coluna `var_elem_free_bytes`; como esse espaço pode estar espalhado por várias páginas, ele não pode ser necessariamente usado para armazenar uma entrada de um tamanho específico. Cada página de tamanho variável é reorganizada conforme necessário para se adequar ao tamanho variável das partes da linha de tamanho variável à medida que são inseridas, atualizadas e excluídas; se uma determinada parte da linha ficar muito grande para a página em que está, ela poderá ser movida para uma página diferente.

A utilização da página de tamanho variável pode ser calculada conforme mostrado aqui:

```sql
var_page_used_bytes =  var_elem_alloc_bytes - var_elem_free_bytes

var_page_utilisation = var_page_used_bytes / var_elem_alloc_bytes

avg_row_var_part_size = var_page_used_bytes / fixed_elem_count
```

Podemos obter o tamanho médio da parte variável por linha assim:

```sql
avg_row_var_part_size = var_page_used_bytes / fixed_elem_count
```

`Secondary Unique Indexes` são implementados internamente como tabelas independentes com o seguinte esquema:

* *Primary Key*: Colunas indexadas na tabela base.

* *Valores*: Colunas de `Primary Key` da tabela base.

Essas tabelas são distribuídas e fragmentadas normalmente. Isso significa que suas `replicas` de `fragment` usam páginas fixas, variáveis e de `hash index`, assim como qualquer outra tabela `NDB`.

`Secondary Ordered Indexes` são fragmentados e distribuídos da mesma forma que a tabela base. `Fragments` de `Ordered Index` são estruturas T-tree que mantêm uma árvore balanceada contendo referências de linha na ordem implícita pelas colunas indexadas. Como a árvore contém referências em vez de dados reais, o custo de armazenamento da T-tree não depende do tamanho ou número de colunas indexadas, mas sim de uma função do número de linhas. A árvore é construída usando estruturas de `node` de tamanho fixo, cada uma das quais pode conter um número de referências de linha; o número de `nodes` necessários depende do número de linhas na tabela e da estrutura da árvore necessária para representar a ordenação. Na tabela `memory_per_fragment`, podemos ver que os `ordered indexes` alocam apenas páginas de tamanho fixo, portanto, como de costume, as colunas relevantes desta tabela são as listadas aqui:

* `fixed_elem_alloc_bytes`: Isto é igual a 32768 vezes o número de páginas de tamanho fixo.

* `fixed_elem_count`: O número de `nodes` T-tree em uso.

* `fixed_elem_size_bytes`: O número de bytes por `node` T-tree.

* `fixed_elem_free_count`: O número de *slots* de `node` T-tree disponíveis nas páginas alocadas.

* `fixed_elem_free_bytes`: Isto é igual a `fixed_elem_free_count * fixed_elem_size_bytes`.

Se o espaço livre em uma página estiver fragmentado, a página é desfragmentada. [`OPTIMIZE TABLE`](optimize-table.html "13.7.2.4 OPTIMIZE TABLE Statement") pode ser usado para desfragmentar as páginas de tamanho variável de uma tabela; isso move as partes de tamanho variável das linhas entre as páginas para que algumas páginas inteiras possam ser liberadas para reutilização.

##### Tabela memory_per_fragment: Exemplos

* [Obtendo informações gerais sobre fragments e uso de memória](mysql-cluster-ndbinfo-memory-per-fragment.html#memory-per-fragment-memory-general "Getting general information about fragments and memory usage")
* [Encontrando uma tabela e seus indexes](mysql-cluster-ndbinfo-memory-per-fragment.html#memory-per-fragment-table-indexes "Finding a table and its indexes")
* [Encontrando a memória alocada por elementos do esquema](mysql-cluster-ndbinfo-memory-per-fragment.html#memory-per-fragment-memory-allocated-per-element "Finding the memory allocated by schema elements")
* [Encontrando a memória alocada para uma tabela e todos os indexes](mysql-cluster-ndbinfo-memory-per-fragment.html#memory-per-fragment-table-indexes-all "Finding the memory allocated for a table and all indexes")
* [Encontrando a memória alocada por linha](mysql-cluster-ndbinfo-memory-per-fragment.html#memory-per-fragment-total-per-row "Finding the memory allocated per row")
* [Encontrando o total de memória em uso por linha](mysql-cluster-ndbinfo-memory-per-fragment.html#memory-per-fragment-total-in-use-per-row "Finding the total memory in use per row")
* [Encontrando a memória alocada por elemento](mysql-cluster-ndbinfo-memory-per-fragment.html#memory-per-fragment-allocated-per-element "Finding the memory allocated per element")
* [Encontrando a memória média alocada por linha, por elemento](mysql-cluster-ndbinfo-memory-per-fragment.html#memory-per-fragment-average-allocated-per-row-by-element "Finding the average memory allocated per row, by element")
* [Encontrando a memória média alocada por linha](mysql-cluster-ndbinfo-memory-per-fragment.html#memory-per-fragment-average-allocated-per-row "Finding the average memory allocated per row")
* [Encontrando a memória média alocada por linha para uma tabela](mysql-cluster-ndbinfo-memory-per-fragment.html#memory-per-fragment-allocated-per-row-for-table "Finding the average memory allocated per row for a table")
* [Encontrando a memória em uso por cada elemento do esquema](mysql-cluster-ndbinfo-memory-per-fragment.html#memory-per-fragment-in-use-per-element "Finding the memory in use by each schema element")
* [Encontrando a memória média em uso por cada elemento do esquema](mysql-cluster-ndbinfo-memory-per-fragment.html#memory-per-fragment-avaerage-in-use-per-element "Finding the average memory in use by each schema element")
* [Encontrando a memória média em uso por linha, por elemento](mysql-cluster-ndbinfo-memory-per-fragment.html#memory-per-fragment-average-in-use-per-row-by-element "Finding the average memory in use per row, by element")
* [Encontrando o total de memória média em uso por linha](mysql-cluster-ndbinfo-memory-per-fragment.html#memory-per-fragment-total-average-in-use-per-row "Finding the total average memory in use per row")

Para os exemplos a seguir, criamos uma tabela simples com três colunas `integer`, uma das quais tem uma `Primary Key`, uma com um `Unique Index` e uma sem `indexes`, bem como uma coluna [`VARCHAR`](char.html "11.3.2 The CHAR and VARCHAR Types") sem `indexes`, conforme mostrado aqui:

```sql
mysql> CREATE DATABASE IF NOT EXISTS test;
Query OK, 1 row affected (0.06 sec)

mysql> USE test;
Database changed

mysql> CREATE TABLE t1 (
    ->    c1 BIGINT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    ->    c2 INT,
    ->    c3 INT UNIQUE,
    -> )  ENGINE=NDBCLUSTER;
Query OK, 0 rows affected (0.27 sec)
```

Após a criação da tabela, inserimos 50.000 linhas contendo dados aleatórios; o método preciso de geração e inserção dessas linhas não faz diferença prática, e deixamos o método de realização como um exercício para o usuário.

###### Obtendo informações gerais sobre fragments e uso de memória

Esta `Query` mostra informações gerais sobre o uso de memória para cada `fragment`:

```sql
mysql> SELECT
    ->   fq_name, node_id, block_instance, fragment_num, fixed_elem_alloc_bytes,
    ->   fixed_elem_free_bytes, fixed_elem_size_bytes, fixed_elem_count,
    ->   fixed_elem_free_count, var_elem_alloc_bytes, var_elem_free_bytes,
    ->   var_elem_count
    -> FROM ndbinfo.memory_per_fragment
    -> WHERE fq_name = "test/def/t1"\G
*************************** 1. row ***************************
               fq_name: test/def/t1
               node_id: 5
        block_instance: 1
          fragment_num: 0
fixed_elem_alloc_bytes: 1114112
 fixed_elem_free_bytes: 11836
 fixed_elem_size_bytes: 44
      fixed_elem_count: 24925
 fixed_elem_free_count: 269
  var_elem_alloc_bytes: 1245184
   var_elem_free_bytes: 32552
        var_elem_count: 24925
*************************** 2. row ***************************
               fq_name: test/def/t1
               node_id: 5
        block_instance: 1
          fragment_num: 1
fixed_elem_alloc_bytes: 1114112
 fixed_elem_free_bytes: 5236
 fixed_elem_size_bytes: 44
      fixed_elem_count: 25075
 fixed_elem_free_count: 119
  var_elem_alloc_bytes: 1277952
   var_elem_free_bytes: 54232
        var_elem_count: 25075
*************************** 3. row ***************************
               fq_name: test/def/t1
               node_id: 6
        block_instance: 1
          fragment_num: 0
fixed_elem_alloc_bytes: 1114112
 fixed_elem_free_bytes: 11836
 fixed_elem_size_bytes: 44
      fixed_elem_count: 24925
 fixed_elem_free_count: 269
  var_elem_alloc_bytes: 1245184
   var_elem_free_bytes: 32552
        var_elem_count: 24925
*************************** 4. row ***************************
               fq_name: test/def/t1
               node_id: 6
        block_instance: 1
          fragment_num: 1
fixed_elem_alloc_bytes: 1114112
 fixed_elem_free_bytes: 5236
 fixed_elem_size_bytes: 44
      fixed_elem_count: 25075
 fixed_elem_free_count: 119
  var_elem_alloc_bytes: 1277952
   var_elem_free_bytes: 54232
        var_elem_count: 25075
4 rows in set (0.12 sec)
```

###### Encontrando uma tabela e seus indexes

Esta `Query` pode ser usada para encontrar uma tabela específica e seus `indexes`:

```sql
mysql> SELECT fq_name
    -> FROM ndbinfo.memory_per_fragment
    -> WHERE fq_name = 'test/def/t1' OR parent_fq_name='test/def/t1'
    -> GROUP BY fq_name;
+----------------------+
| fq_name              |
+----------------------+
| test/def/t1          |
| sys/def/13/PRIMARY   |
| sys/def/13/c3        |
| sys/def/13/c3$unique |
+----------------------+
4 rows in set (0.13 sec)

mysql> SELECT COUNT(*) FROM t1;
+----------+
| COUNT(*) |
+----------+
|    50000 |
+----------+
1 row in set (0.00 sec)
```

###### Encontrando a memória alocada por elementos do esquema

Esta `Query` mostra a memória alocada por cada elemento do esquema (no total em todas as `replicas`):

```sql
mysql> SELECT
    ->   fq_name AS Name,
    ->   SUM(fixed_elem_alloc_bytes) AS Fixed,
    ->   SUM(var_elem_alloc_bytes) AS Var,
    ->   SUM(hash_index_alloc_bytes) AS Hash,
    ->   SUM(fixed_elem_alloc_bytes+var_elem_alloc_bytes+hash_index_alloc_bytes) AS Total
    -> FROM ndbinfo.memory_per_fragment
    -> WHERE fq_name = 'test/def/t1' OR parent_fq_name='test/def/t1'
    -> GROUP BY fq_name;
+----------------------+---------+---------+---------+----------+
| Name                 | Fixed   | Var     | Hash    | Total    |
+----------------------+---------+---------+---------+----------+
| test/def/t1          | 4456448 | 5046272 | 1425408 | 10928128 |
| sys/def/13/PRIMARY   | 1966080 |       0 |       0 |  1966080 |
| sys/def/13/c3        | 1441792 |       0 |       0 |  1441792 |
| sys/def/13/c3$unique | 3276800 |       0 | 1425408 |  4702208 |
+----------------------+---------+---------+---------+----------+
4 rows in set (0.11 sec)
```

###### Encontrando a memória alocada para uma tabela e todos os indexes

A soma da memória alocada para a tabela e todos os seus `indexes` (no total em todas as `replicas`) pode ser obtida usando a `Query` mostrada aqui:

```sql
mysql> SELECT
    ->   SUM(fixed_elem_alloc_bytes) AS Fixed,
    ->   SUM(var_elem_alloc_bytes) AS Var,
    ->   SUM(hash_index_alloc_bytes) AS Hash,
    ->   SUM(fixed_elem_alloc_bytes+var_elem_alloc_bytes+hash_index_alloc_bytes) AS Total
    -> FROM ndbinfo.memory_per_fragment
    -> WHERE fq_name = 'test/def/t1' OR parent_fq_name='test/def/t1';
+----------+---------+---------+----------+
| Fixed    | Var     | Hash    | Total    |
+----------+---------+---------+----------+
| 11141120 | 5046272 | 2850816 | 19038208 |
+----------+---------+---------+----------+
1 row in set (0.12 sec)
```

Esta é uma versão abreviada da `Query` anterior que mostra apenas o total de memória usada pela tabela:

```sql
mysql> SELECT
    ->   SUM(fixed_elem_alloc_bytes+var_elem_alloc_bytes+hash_index_alloc_bytes) AS Total
    -> FROM ndbinfo.memory_per_fragment
    -> WHERE fq_name = 'test/def/t1' OR parent_fq_name='test/def/t1';
+----------+
| Total    |
+----------+
| 19038208 |
+----------+
1 row in set (0.12 sec)
```

###### Encontrando a memória alocada por linha

A seguinte `Query` mostra a memória total alocada por linha (em todas as `replicas`):

```sql
mysql> SELECT
    ->   SUM(fixed_elem_alloc_bytes+var_elem_alloc_bytes+hash_index_alloc_bytes)
    ->   /
    ->   SUM(fixed_elem_count) AS Total_alloc_per_row
    -> FROM ndbinfo.memory_per_fragment
    -> WHERE fq_name = 'test/def/t1';
+---------------------+
| Total_alloc_per_row |
+---------------------+
|            109.2813 |
+---------------------+
1 row in set (0.12 sec)
```

###### Encontrando o total de memória em uso por linha

Para obter o total de memória em uso por linha (em todas as `replicas`), precisamos do total de memória usada dividido pela contagem de linhas, que é o `fixed_elem_count` para a tabela base, assim:

```sql
mysql> SELECT
    ->   SUM(
    ->     (fixed_elem_alloc_bytes - fixed_elem_free_bytes)
    ->     + (var_elem_alloc_bytes - var_elem_free_bytes)
    ->     + hash_index_alloc_bytes
    ->   )
    ->   /
    ->   SUM(fixed_elem_count)
    ->   AS total_in_use_per_row
    -> FROM ndbinfo.memory_per_fragment
    -> WHERE fq_name = 'test/def/t1';
+----------------------+
| total_in_use_per_row |
+----------------------+
|             107.2042 |
+----------------------+
1 row in set (0.12 sec)
```

###### Encontrando a memória alocada por elemento

A memória alocada por cada elemento do esquema (no total em todas as `replicas`) pode ser encontrada usando a seguinte `Query`:

```sql
mysql> SELECT
    ->   fq_name AS Name,
    ->   SUM(fixed_elem_alloc_bytes) AS Fixed,
    ->   SUM(var_elem_alloc_bytes) AS Var,
    ->   SUM(hash_index_alloc_bytes) AS Hash,
    ->   SUM(fixed_elem_alloc_bytes + var_elem_alloc_bytes + hash_index_alloc_bytes)
    ->     AS Total_alloc
    -> FROM ndbinfo.memory_per_fragment
    -> WHERE fq_name = 'test/def/t1' OR parent_fq_name='test/def/t1'
    -> GROUP BY fq_name;
+----------------------+---------+---------+---------+-------------+
| Name                 | Fixed   | Var     | Hash    | Total_alloc |
+----------------------+---------+---------+---------+-------------+
| test/def/t1          | 4456448 | 5046272 | 1425408 |    10928128 |
| sys/def/13/PRIMARY   | 1966080 |       0 |       0 |     1966080 |
| sys/def/13/c3        | 1441792 |       0 |       0 |     1441792 |
| sys/def/13/c3$unique | 3276800 |       0 | 1425408 |     4702208 |
+----------------------+---------+---------+---------+-------------+
4 rows in set (0.11 sec)
```

###### Encontrando a memória média alocada por linha, por elemento

Para obter a memória média alocada por linha por cada elemento do esquema (no total em todas as `replicas`), usamos uma subquery para obter a contagem de elementos fixos da tabela base cada vez para obter uma média por linha, já que `fixed_elem_count` para os `indexes` não é necessariamente o mesmo que para a tabela base, conforme mostrado aqui:

```sql
mysql> SELECT
    ->   fq_name AS Name,
    ->   ( SELECT SUM(fixed_elem_count)
    ->     FROM ndbinfo.memory_per_fragment
    ->     WHERE fq_name='test/def/t1') AS Table_rows,
    ->
    ->   SUM(fixed_elem_alloc_bytes)
    ->   /
    ->   ( SELECT SUM(fixed_elem_count)
    ->     FROM ndbinfo.memory_per_fragment
    ->     WHERE fq_name='test/def/t1') AS Avg_fixed_alloc,
    ->
    ->   SUM(var_elem_alloc_bytes)
    ->   /
    ->   ( SELECT SUM(fixed_elem_count)
    ->     FROM ndbinfo.memory_per_fragment
    ->     WHERE fq_name='test/def/t1') as Avg_var_alloc,
    ->
    ->   SUM(hash_index_alloc_bytes)
    ->   /
    ->   ( SELECT SUM(fixed_elem_count)
    ->     FROM ndbinfo.memory_per_fragment
    ->     WHERE fq_name='test/def/t1') as Avg_hash_alloc,
    ->
    ->   SUM(fixed_elem_alloc_bytes+var_elem_alloc_bytes+hash_index_alloc_bytes)
    ->   /
    ->   ( SELECT SUM(fixed_elem_count)
    ->     FROM ndbinfo.memory_per_fragment
    ->     WHERE fq_name='test/def/t1') as Avg_total_alloc
    ->
    -> FROM ndbinfo.memory_per_fragment
    -> WHERE fq_name = 'test/def/t1' or parent_fq_name='test/def/t1'
    -> GROUP BY fq_name;
+----------------------+------------+-----------------+---------------+----------------+-----------------+
| Name                 | Table_rows | Avg_fixed_alloc | Avg_var_alloc | Avg_hash_alloc | Avg_total_alloc |
+----------------------+------------+-----------------+---------------+----------------+-----------------+
| test/def/t1          |     100000 |         44.5645 |       50.4627 |        14.2541 |        109.2813 |
| sys/def/13/PRIMARY   |     100000 |         19.6608 |        0.0000 |         0.0000 |         19.6608 |
| sys/def/13/c3        |     100000 |         14.4179 |        0.0000 |         0.0000 |         14.4179 |
| sys/def/13/c3$unique |     100000 |         32.7680 |        0.0000 |        14.2541 |         47.0221 |
+----------------------+------------+-----------------+---------------+----------------+-----------------+
4 rows in set (0.70 sec)
```

###### Encontrando a memória média alocada por linha

Memória média alocada por linha (no total em todas as `replicas`):

```sql
mysql> SELECT
    ->   ( SELECT SUM(fixed_elem_count)
    ->     FROM ndbinfo.memory_per_fragment
    ->     WHERE fq_name='test/def/t1') AS Table_rows,
    ->
    ->   SUM(fixed_elem_alloc_bytes)
    ->   /
    ->   ( SELECT SUM(fixed_elem_count)
    ->     FROM ndbinfo.memory_per_fragment
    ->     WHERE fq_name='test/def/t1') AS Avg_fixed_alloc,
    ->
    ->   SUM(var_elem_alloc_bytes)
    ->   /
    ->   ( SELECT SUM(fixed_elem_count)
    ->     FROM ndbinfo.memory_per_fragment
    ->     WHERE fq_name='test/def/t1') AS Avg_var_alloc,
    ->
    ->   SUM(hash_index_alloc_bytes)
    ->   /
    ->   ( SELECT SUM(fixed_elem_count)
    ->     FROM ndbinfo.memory_per_fragment
    ->     WHERE fq_name='test/def/t1') AS Avg_hash_alloc,
    ->
    ->   SUM(fixed_elem_alloc_bytes + var_elem_alloc_bytes + hash_index_alloc_bytes)
    ->   /
    ->   ( SELECT SUM(fixed_elem_count)
    ->     FROM ndbinfo.memory_per_fragment
    ->     WHERE fq_name='test/def/t1') AS Avg_total_alloc
    ->
    -> FROM ndbinfo.memory_per_fragment
    -> WHERE fq_name = 'test/def/t1' OR parent_fq_name='test/def/t1';
+------------+-----------------+---------------+----------------+-----------------+
| Table_rows | Avg_fixed_alloc | Avg_var_alloc | Avg_hash_alloc | Avg_total_alloc |
+------------+-----------------+---------------+----------------+-----------------+
|     100000 |        111.4112 |       50.4627 |        28.5082 |        190.3821 |
+------------+-----------------+---------------+----------------+-----------------+
1 row in set (0.71 sec)
```

###### Encontrando a memória média alocada por linha para uma tabela

Para obter a quantidade média de memória alocada por linha para toda a tabela em todas as `replicas`, podemos usar a `Query` mostrada aqui:

```sql
mysql> SELECT
    ->   ( SELECT SUM(fixed_elem_count)
    ->     FROM ndbinfo.memory_per_fragment
    ->     WHERE fq_name='test/def/t1') AS table_rows,
    ->
    ->   SUM(fixed_elem_alloc_bytes + var_elem_alloc_bytes + hash_index_alloc_bytes)
    ->   /
    ->   ( SELECT SUM(fixed_elem_count)
    ->     FROM ndbinfo.memory_per_fragment
    ->     WHERE fq_name='test/def/t1') AS avg_total_alloc
    ->
    -> FROM ndbinfo.memory_per_fragment
    -> WHERE fq_name = 'test/def/t1' OR parent_fq_name='test/def/t1';
+------------+-----------------+
| table_rows | avg_total_alloc |
+------------+-----------------+
|     100000 |        190.3821 |
+------------+-----------------+
1 row in set (0.33 sec)
```

###### Encontrando a memória em uso por cada elemento do esquema

Para obter a memória em uso por elemento do esquema em todas as `replicas`, precisamos somar a diferença entre a memória alocada e a memória livre para cada elemento, assim:

```sql
mysql> SELECT
    ->   fq_name AS Name,
    ->   SUM(fixed_elem_alloc_bytes - fixed_elem_free_bytes) AS fixed_inuse,
    ->   SUM(var_elem_alloc_bytes-var_elem_free_bytes) AS var_inuse,
    ->   SUM(hash_index_alloc_bytes) AS hash_memory,
    ->   SUM(  (fixed_elem_alloc_bytes - fixed_elem_free_bytes)
    ->       + (var_elem_alloc_bytes - var_elem_free_bytes)
    ->       + hash_index_alloc_bytes) AS total_alloc
    -> FROM ndbinfo.memory_per_fragment
    -> WHERE fq_name = 'test/def/t1' OR parent_fq_name='test/def/t1'
    -> GROUP BY fq_name;
+----------------------+-------------+-----------+---------+-------------+
| fq_name              | fixed_inuse | var_inuse | hash    | total_alloc |
+----------------------+-------------+-----------+---------+-------------+
| test/def/t1          |     4422304 |   4872704 | 1425408 |    10720416 |
| sys/def/13/PRIMARY   |     1950848 |         0 |       0 |     1950848 |
| sys/def/13/c3        |     1428736 |         0 |       0 |     1428736 |
| sys/def/13/c3$unique |     3212800 |         0 | 1425408 |     4638208 |
+----------------------+-------------+-----------+---------+-------------+
4 rows in set (0.13 sec)
```

###### Encontrando a memória média em uso por cada elemento do esquema

Esta `Query` obtém a memória média em uso por elemento do esquema em todas as `replicas`:

```sql
mysql> SELECT
    ->   fq_name AS Name,
    ->
    ->   ( SELECT SUM(fixed_elem_count)
    ->     FROM ndbinfo.memory_per_fragment
    ->     WHERE fq_name='test/def/t1') AS table_rows,
    ->
    ->   SUM(fixed_elem_alloc_bytes - fixed_elem_free_bytes)
    ->   /
    ->   ( SELECT SUM(fixed_elem_count)
    ->     FROM ndbinfo.memory_per_fragment
    ->     WHERE fq_name='test/def/t1') AS avg_fixed_inuse,
    ->
    ->   SUM(var_elem_alloc_bytes - var_elem_free_bytes)
    ->   /
    ->   ( SELECT SUM(fixed_elem_count)
    ->     FROM ndbinfo.memory_per_fragment
    ->     WHERE fq_name='test/def/t1') AS avg_var_inuse,
    ->
    ->   SUM(hash_index_alloc_bytes)
    ->   /
    ->   ( SELECT SUM(fixed_elem_count)
    ->     FROM ndbinfo.memory_per_fragment
    ->     WHERE fq_name='test/def/t1') AS avg_hash,
    ->
    ->   SUM(
    ->       (fixed_elem_alloc_bytes - fixed_elem_free_bytes)
    ->     + (var_elem_alloc_bytes - var_elem_free_bytes) + hash_index_alloc_bytes)
    ->   /
    ->   ( SELECT SUM(fixed_elem_count)
    ->     FROM ndbinfo.memory_per_fragment
    ->     WHERE fq_name='test/def/t1') AS avg_total_inuse
    ->
    -> FROM ndbinfo.memory_per_fragment
    -> WHERE fq_name = 'test/def/t1' OR parent_fq_name='test/def/t1'
    -> GROUP BY fq_name;
+----------------------+------------+-----------------+---------------+----------+-----------------+
| Name                 | table_rows | avg_fixed_inuse | avg_var_inuse | avg_hash | avg_total_inuse |
+----------------------+------------+-----------------+---------------+----------+-----------------+
| test/def/t1          |     100000 |         44.2230 |       48.7270 |  14.2541 |        107.2042 |
| sys/def/13/PRIMARY   |     100000 |         19.5085 |        0.0000 |   0.0000 |         19.5085 |
| sys/def/13/c3        |     100000 |         14.2874 |        0.0000 |   0.0000 |         14.2874 |
| sys/def/13/c3$unique |     100000 |         32.1280 |        0.0000 |  14.2541 |         46.3821 |
+----------------------+------------+-----------------+---------------+----------+-----------------+
4 rows in set (0.72 sec)
```

###### Encontrando a memória média em uso por linha, por elemento

Esta `Query` obtém a memória média em uso por linha, por elemento, em todas as `replicas`:

```sql
mysql> SELECT
    ->   ( SELECT SUM(fixed_elem_count)
    ->     FROM ndbinfo.memory_per_fragment
    ->     WHERE fq_name='test/def/t1') AS table_rows,
    ->
    ->   SUM(fixed_elem_alloc_bytes - fixed_elem_free_bytes)
    ->   /
    ->   ( SELECT SUM(fixed_elem_count)
    ->     FROM ndbinfo.memory_per_fragment
    ->     WHERE fq_name='test/def/t1') AS avg_fixed_inuse,
    ->
    ->   SUM(var_elem_alloc_bytes - var_elem_free_bytes)
    ->   /
    ->   ( SELECT SUM(fixed_elem_count)
    ->     FROM ndbinfo.memory_per_fragment
    ->     WHERE fq_name='test/def/t1') AS avg_var_inuse,
    ->
    ->   SUM(hash_index_alloc_bytes)
    ->   /
    ->   ( SELECT SUM(fixed_elem_count)
    ->     FROM ndbinfo.memory_per_fragment
    ->     WHERE fq_name='test/def/t1') AS avg_hash,
    ->
    ->   SUM(
    ->     (fixed_elem_alloc_bytes - fixed_elem_free_bytes)
    ->     + (var_elem_alloc_bytes - var_elem_free_bytes)
    ->     + hash_index_alloc_bytes)
    ->   /
    ->   ( SELECT SUM(fixed_elem_count)
    ->     FROM ndbinfo.memory_per_fragment
    ->     WHERE fq_name='test/def/t1') AS avg_total_inuse
    ->
    -> FROM ndbinfo.memory_per_fragment
    -> WHERE fq_name = 'test/def/t1' OR parent_fq_name='test/def/t1';
+------------+-----------------+---------------+----------+-----------------+
| table_rows | avg_fixed_inuse | avg_var_inuse | avg_hash | avg_total_inuse |
+------------+-----------------+---------------+----------+-----------------+
|     100000 |        110.1469 |       48.7270 |  28.5082 |        187.3821 |
+------------+-----------------+---------------+----------+-----------------+
1 row in set (0.68 sec)
```

###### Encontrando o total de memória média em uso por linha

Esta `Query` obtém o total de memória média em uso, por linha:

```sql
mysql> SELECT
    ->   SUM(
    ->     (fixed_elem_alloc_bytes - fixed_elem_free_bytes)
    ->     + (var_elem_alloc_bytes - var_elem_free_bytes)
    ->     + hash_index_alloc_bytes)
    ->   /
    ->   ( SELECT
    ->       SUM(fixed_elem_count)
    ->       FROM ndbinfo.memory_per_fragment
    ->       WHERE fq_name='test/def/t1') AS avg_total_in_use
    -> FROM ndbinfo.memory_per_fragment
    -> WHERE fq_name = 'test/def/t1' OR parent_fq_name='test/def/t1';
+------------------+
| avg_total_in_use |
+------------------+
|         187.3821 |
+------------------+
1 row in set (0.24 sec)
```
