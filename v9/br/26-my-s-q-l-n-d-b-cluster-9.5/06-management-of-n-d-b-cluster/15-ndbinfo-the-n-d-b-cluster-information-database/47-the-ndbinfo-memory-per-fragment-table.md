#### 25.6.15.47 A tabela ndbinfo memory\_per\_fragment

* tabela memory\_per\_fragment: Notas
* tabela memory\_per\_fragment: Exemplos

A tabela `memory_per_fragment` fornece informações sobre o uso da memória por fragmentos individuais. Veja as Notas mais adiante nesta seção para ver como você pode usar isso para descobrir quanto memória é usada pelas tabelas `NDB`.

A tabela `memory_per_fragment` contém as seguintes colunas:

* `fq_name`

  Nome deste fragmento

* `parent_fq_name`

  Nome do fragmento pai deste

* `type`

  Tipo de objeto de dicionário (`Object::Type`, na API NDB) usado para este fragmento; um dos `Tabela do sistema`, `Tabela do usuário`, `Índice hash único`, `Índice hash`, `Índice ordenado único`, `Índice ordenado`, `Trigger de índice hash`, `Trigger de assinatura`, `Restrição de leitura`, `Trigger de índice`, `Trigger de reorganização`, `Espaço de tabelas`, `Grupo de arquivo de log`, `Arquivo de dados`, `Arquivo de desfazer`, `Mapa de hash`, `Definição de chave estrangeira`, `Trigger de chave estrangeira pai`, `Trigger de chave estrangeira filho` ou `Transação de esquema`.

  Você também pode obter essa lista executando `TABLE` `ndbinfo.dict_obj_types` no cliente **mysql**.

* `table_id`

  ID da tabela para esta tabela

* `node_id`

  ID do nó para este nó

* `block_instance`

  ID de instância de bloco do kernel NDB; você pode usar esse número para obter informações sobre threads específicos da tabela `threadblocks`.

* `fragment_num`

  ID de fragmento (número)

* `fixed_elem_alloc_bytes`

  Número de bytes alocados para elementos de tamanho fixo

* `fixed_elem_free_bytes`

  Bytes livres restantes em páginas alocadas para elementos de tamanho fixo

* `fixed_elem_size_bytes`

  Comprimento de cada elemento de tamanho fixo em bytes

* `fixed_elem_count`

  Número de elementos de tamanho fixo

* `fixed_elem_free_count`

  Número de linhas livres para elementos de tamanho fixo

* `var_elem_alloc_bytes`

Número de bytes alocados para elementos de tamanho variável

* `var_elem_free_bytes`

  Bytes livres restantes em páginas alocadas para elementos de tamanho variável

* `var_elem_count`

  Número de elementos de tamanho variável

* `hash_index_alloc_bytes`

  Número de bytes alocados para índices de hash

##### tabela memory\_per\_fragment: Notas

A tabela `memory_per_fragment` contém uma linha para cada replica de fragmento de tabela e cada replica de fragmento de índice no sistema; isso significa que, por exemplo, quando `NoOfReplicas=2`, normalmente existem duas réplicas de fragmento para cada fragmento. Isso é verdade enquanto todos os nós de dados estiverem em execução e conectados ao clúster; para um nó de dados ausente, não existem linhas para as réplicas de fragmento que ele hospeda.

As colunas da tabela `memory_per_fragment` podem ser agrupadas de acordo com sua função ou propósito da seguinte forma:

* *Colunas chave*: `fq_name`, `type`, `table_id`, `node_id`, `block_instance` e `fragment_num`

* *Coluna de relação*: `parent_fq_name`

* *Colunas de armazenamento de tamanho fixo*: `fixed_elem_alloc_bytes`, `fixed_elem_free_bytes`, `fixed_elem_size_bytes`, `fixed_elem_count` e `fixed_elem_free_count`

* *Colunas de armazenamento de tamanho variável*: `var_elem_alloc_bytes`, `var_elem_free_bytes` e `var_elem_count`

* *Coluna de índice de hash*: `hash_index_alloc_bytes`

As colunas `parent_fq_name` e `fq_name` podem ser usadas para identificar índices associados a uma tabela. Informações semelhantes sobre a hierarquia de objetos de esquema estão disponíveis em outras tabelas `ndbinfo`.

As réplicas de fragmentos de tabela e índice alocam `DataMemory` em páginas de 32 KB. Essas páginas de memória são gerenciadas conforme listadas aqui:

* *Páginas de tamanho fixo*: Essas armazenam as partes de tamanho fixo das linhas armazenadas em um determinado fragmento. Cada linha tem uma parte de tamanho fixo.

* *Páginas de tamanhos variáveis*: Essas armazenam partes de tamanhos variáveis para as linhas no fragmento. Cada linha que possui uma ou mais colunas dinâmicas de tamanhos variáveis, ou ambas, tem uma parte de tamanho variável.

* *Páginas de índice de hash*: Essas são alocadas como subpáginas de 8 KB e armazenam a estrutura do índice de hash da chave primária.

Cada linha em uma tabela `NDB` tem uma parte de tamanho fixo, composta por um cabeçalho de linha e uma ou mais colunas de tamanho fixo. A linha também pode conter uma ou mais referências de partes de tamanho variável, uma ou mais referências de partes de disco ou ambas. Cada linha também tem uma entrada de índice de hash da chave primária (correspondente à chave primária oculta que faz parte de cada tabela `NDB`).

A partir do que foi dito, podemos ver que cada fragmento de tabela e índice alocam juntos a quantidade de `DataMemory` calculada como mostrado aqui:

```
DataMemory =
  (number_of_fixed_pages + number_of_var_pages) * 32KB
    + number_of_hash_pages * 8KB
```

Como `fixed_elem_alloc_bytes` e `var_elem_alloc_bytes` são sempre múltiplos de 32768 bytes, podemos determinar ainda que `number_of_fixed_pages = fixed_elem_alloc_bytes / 32768` e `number_of_var_pages = var_elem_alloc_bytes / 32768`. `hash_index_alloc_bytes` é sempre um múltiplo de 8192 bytes, então `number_of_hash_pages = hash_index_alloc_bytes / 8192`.

Uma página de tamanho fixo tem um cabeçalho interno e um número de slots de tamanho fixo, cada um dos quais pode conter a parte de tamanho fixo de uma linha. O tamanho da parte de tamanho fixo de uma determinada linha depende do esquema e é fornecido pela coluna `fixed_elem_size_bytes`; o número de slots de tamanho fixo por página pode ser determinado calculando o número total de slots e o número total de páginas, da seguinte forma:

```
fixed_slots = fixed_elem_count + fixed_elem_free_count

fixed_pages = fixed_elem_alloc_bytes / 32768

slots_per_page = total_slots / total_pages
```

`fixed_elem_count` é, na verdade, o número de linhas de um fragmento de tabela específico, já que cada linha tem 1 elemento fixo. `fixed_elem_free_count` é o número total de slots de tamanho fixo livres em todas as páginas alocadas. `fixed_elem_free_bytes` é igual a `fixed_elem_free_count * fixed_elem_size_bytes`.

Um fragmento pode ter qualquer número de páginas de tamanho fixo; quando a última linha de uma página de tamanho fixo é excluída, a página é liberada para o pool de páginas `DataMemory`. Páginas de tamanho fixo podem ser fragmentadas, com mais páginas alocadas do que o necessário pelo número de slots de tamanho fixo em uso. Você pode verificar se isso é o caso comparando as páginas necessárias com as páginas alocadas, que você pode calcular da seguinte forma:

```
fixed_pages_required = 1 + (fixed_elem_count / slots_per_page)

fixed_page_utilization = fixed_pages_required / fixed_pages
```

Uma página de tamanho variável tem um cabeçalho interno e usa o espaço restante para armazenar uma ou mais partes de linha de tamanho variável; o número de partes armazenadas depende do esquema e dos dados reais armazenados. Como nem todos os esquemas ou linhas têm uma parte de tamanho variável, `var_elem_count` pode ser menor que `fixed_elem_count`. O espaço livre total disponível em todas as páginas de tamanho variável no fragmento é mostrado pela coluna `var_elem_free_bytes`; como esse espaço pode ser distribuído em várias páginas, ele não pode necessariamente ser usado para armazenar uma entrada de um tamanho específico. Cada página de tamanho variável é reorganizada conforme necessário para se adequar ao tamanho variável das partes de linha de tamanho variável à medida que elas são inseridas, atualizadas e excluídas; se uma parte de linha específica crescer demais para a página em que está, ela pode ser movida para uma página diferente.

A utilização de páginas de tamanho variável pode ser calculada como mostrado aqui:

```
var_page_used_bytes =  var_elem_alloc_bytes - var_elem_free_bytes

var_page_utilisation = var_page_used_bytes / var_elem_alloc_bytes

avg_row_var_part_size = var_page_used_bytes / fixed_elem_count
```

Podemos obter o tamanho médio da parte variável por linha da seguinte forma:

```
avg_row_var_part_size = var_page_used_bytes / fixed_elem_count
```

Indeksos únicos secundários são implementados internamente como tabelas independentes com o seguinte esquema:

* *Chave primária*: Colunas indexadas na tabela base.

* *Valores*: Colunas da chave primária da tabela base.

Essas tabelas são distribuídas e fragmentadas normalmente. Isso significa que suas réplicas de fragmentos usam páginas de índice fixo, variável e hash, como qualquer outra tabela `NDB`.

Índices ordenados secundários são fragmentados e distribuídos da mesma maneira que a tabela base. Os fragmentos do índice ordenado são estruturas de T-tree que mantêm uma árvore equilibrada contendo referências de linha na ordem implícita pelas colunas indexadas. Como a árvore contém referências em vez de dados reais, o custo de armazenamento do T-tree não depende do tamanho ou número de colunas indexadas, mas é uma função do número de linhas. A árvore é construída usando estruturas de nó de tamanho fixo, cada uma das quais pode conter um número de referências de linha; o número de nós necessários depende do número de linhas na tabela e da estrutura de árvore necessária para representar a ordenação. Na tabela `memory\_per\_fragment`, podemos ver que os índices ordenados alocam apenas páginas de tamanho fixo, então, como de costume, as colunas relevantes desta tabela estão listadas aqui:

* `fixed_elem_alloc_bytes`: Isso é igual a 32768 vezes o número de páginas de tamanho fixo.

* `fixed_elem_count`: O número de nós T-tree em uso.

* `fixed_elem_size_bytes`: O número de bytes por nó T-tree.

* `fixed_elem_free_count`: O número de slots de nó T-tree disponíveis nas páginas alocadas.

* `fixed_elem_free_bytes`: Isso é igual a `fixed_elem_free_count * fixed_elem_size_bytes`.

Se o espaço livre em uma página for fragmentado, a página é desfragmentada. `OPTIMIZE TABLE` pode ser usado para desfragmentar páginas de tamanho variável de uma tabela; isso move partes variáveis de linha entre páginas para que algumas páginas inteiras possam ser liberadas para reutilização.

##### tabela memory\_per\_fragment: Exemplos

* Obter informações gerais sobre fragmentos e uso de memória
* Encontrar uma tabela e seus índices
* Encontrar a memória alocada por elementos do esquema
* Encontrar a memória alocada para uma tabela e todos os índices
* Encontrar a memória alocada por linha
* Encontrar a memória total em uso por linha
* Encontrar a memória alocada por elemento
* Encontrar a memória média alocada por linha, por elemento
* Encontrar a memória média alocada por linha
* Encontrar a memória média alocada por linha para uma tabela
* Encontrar a memória em uso por cada elemento do esquema
* Encontrar a memória média em uso por cada elemento do esquema
* Encontrar a memória média em uso por linha, por elemento
* Encontrar a memória média total em uso por linha

A soma da memória alocada para a tabela e todos os seus índices (no total em todas as réplicas) pode ser obtida usando a consulta mostrada aqui:

```
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

Esta é uma versão abreviada da consulta anterior que mostra apenas a memória total usada pela tabela:

```
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

###### Encontrando a memória alocada por linha

A seguinte consulta mostra a memória total alocada por linha (em todas as réplicas):

```
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

###### Encontrando a memória total em uso por linha

Para obter a memória total em uso por linha (em todas as réplicas), precisamos da memória total usada dividida pelo número de linhas, que é o `fixed_elem_count` para a tabela base da seguinte forma:

```
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

###### Encontrando a memória alocada por elemento

A memória alocada por cada elemento do esquema (no total em todas as réplicas) pode ser encontrada usando a seguinte consulta:

```
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

###### Encontrando a memória alocada por linha, por elemento médio

Para obter a memória média alocada por linha por cada elemento do esquema (no total em todas as réplicas), usamos uma subconsulta para obter o número de elementos fixos da tabela base cada vez para obter uma média por linha, já que `fixed_elem_count` para os índices não é necessariamente o mesmo que para a tabela base, como mostrado aqui:

```
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

###### Encontrando a memória alocada por linha média

Memória média alocada por linha (no total em todas as réplicas):

```
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

###### Encontrando a memória em uso por cada elemento do esquema
```
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

###### Encontrando a memória em uso por cada elemento do esquema
```
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

Para obter a memória em uso por elemento de esquema em todas as réplicas, precisamos somar a diferença entre a memória alocada e a memória livre para cada elemento, da seguinte forma:

```
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

###### Encontrar a memória média em uso por cada elemento de esquema

Esta consulta obtém a memória média em uso por elemento de esquema em todas as réplicas:

```
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

###### Encontrar a memória média em uso por linha, por elemento

Esta consulta obtém a memória média em uso por linha, por elemento, em todas as réplicas:

```
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

###### Encontrar a memória média total em uso por linha

Esta consulta obtém a memória média total em uso, por linha:

```
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