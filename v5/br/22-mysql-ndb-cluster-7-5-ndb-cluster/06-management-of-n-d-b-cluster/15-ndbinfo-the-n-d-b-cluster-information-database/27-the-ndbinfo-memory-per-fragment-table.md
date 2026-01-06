#### 21.6.15.27 Tabela ndbinfo memory\_per\_fragment

- tabela de memória por fragmento: Notas
- tabela memória\_por\_fragmento: exemplos

A tabela `memory_per_fragment` fornece informações sobre o uso da memória por fragmentos individuais. Veja as Notas mais adiante nesta seção para ver como você pode usar isso para descobrir quanto memória é usada pelas tabelas `NDB`.

A tabela `memory_per_fragment` contém as seguintes colunas:

- `fq_name`

  Nome deste fragmento

- `parent_fq_name`

  Nome do fragmento pai

- `tipo`

  Tipo de objeto do dicionário (`Object::Type`, na API NDB) usado para este fragmento; um dos `Tabela Sistema`, `Tabela Usuário`, `Índice Hash Único`, `Índice Hash`, `Índice Ordenado Único`, `Índice Ordenado`, `Trigger de Índice Hash`, `Trigger de Subscrição`, `Restrição de Apenas Leitura`, `Trigger de Índice`, `Trigger de Reorganização`, `Tablespace`, `Grupo de Arquivo de Log`, `Arquivo de Dados`, `Arquivo de Reversão`, `Mapa Hash`, `Definição de Chave Estrangeira`, `Trigger de Chave Estrangeira Filha`, `Trigger de Chave Estrangeira Filho`, ou `Transação de Esquema`.

  Você também pode obter essa lista executando `TABLE` `ndbinfo.dict_obj_types` no cliente **mysql**.

- `table_id`

  ID da tabela para esta tabela

- `node_id`

  ID do nó para este nó

- `block_instance`

  ID do bloco do kernel do NDB; você pode usar esse número para obter informações sobre threads específicas da tabela `threadblocks`.

- `fragment_num`

  ID de fragmento (número)

- `fixed_elem_alloc_bytes`

  Número de bytes alocados para elementos de tamanho fixo

- `fixed_elem_free_bytes`

  Bytes livres restantes nas páginas alocadas para elementos de tamanho fixo

- `tamanho_elemento_fixo_bytes`

  Comprimento de cada elemento de tamanho fixo em bytes

- `fixed_elem_count`

  Número de elementos de tamanho fixo

- `fixed_elem_free_count`

  Número de linhas livres para elementos de tamanho fixo

- `var_elem_alloc_bytes`

  Número de bytes alocados para elementos de tamanho variável

- `var_elem_free_bytes`

  Bytes livres restantes nas páginas alocadas para elementos de tamanho variável

- `var_elem_count`

  Número de elementos de tamanho variável

- `hash_index_alloc_bytes`

  Número de bytes alocados para índices de hash

##### tabela memory\_per\_fragment: Notas

A tabela `memory_per_fragment` contém uma linha para cada replica de fragmento de tabela e cada replica de fragmento de índice no sistema; isso significa que, por exemplo, quando `NoOfReplicas=2`, normalmente existem duas réplicas de fragmento para cada fragmento. Isso é verdade enquanto todos os nós de dados estiverem em execução e conectados ao cluster; para um nó de dados que está ausente, não existem linhas para as réplicas de fragmento que ele hospeda.

As colunas da tabela `memory_per_fragment` podem ser agrupadas de acordo com sua função ou propósito da seguinte forma:

- *Colunas principais*: `fq_name`, `type`, `table_id`, `node_id`, `block_instance` e `fragment_num`

- *Coluna de relacionamento*: `parent_fq_name`

- Colunas de armazenamento de tamanho fixo: `fixed_elem_alloc_bytes`, `fixed_elem_free_bytes`, `fixed_elem_size_bytes`, `fixed_elem_count` e `fixed_elem_free_count`

- Colunas de armazenamento de tamanho variável: `var_elem_alloc_bytes`, `var_elem_free_bytes` e `var_elem_count`

- *Coluna de índice hash*: `hash_index_alloc_bytes`

As colunas `parent_fq_name` e `fq_name` podem ser usadas para identificar índices associados a uma tabela. Informações semelhantes sobre a hierarquia de objetos de esquema estão disponíveis em outras tabelas `ndbinfo`.

As réplicas de fragmentos de tabela e índice alocam `DataMemory` em páginas de 32 KB. Essas páginas de memória são gerenciadas conforme listadas aqui:

- *Páginas de tamanho fixo*: Elas armazenam as partes de tamanho fixo das linhas armazenadas em um fragmento específico. Cada linha tem uma parte de tamanho fixo.

- *Páginas de tamanho variável*: Elas armazenam partes de tamanho variável para as linhas no fragmento. Cada linha que possui uma ou mais colunas dinâmicas de tamanho variável (ou ambas) tem uma parte de tamanho variável.

- *Páginas de índice de hash*: Elas são alocadas como subpáginas de 8 KB e armazenam a estrutura do índice de hash da chave primária.

Cada linha de uma tabela `NDB` tem uma parte de tamanho fixo, composta por um cabeçalho de linha e uma ou mais colunas de tamanho fixo. A linha também pode conter uma ou mais referências de partes de tamanho variável, uma ou mais referências de partes de disco ou ambas. Cada linha também tem uma entrada de índice de hash de chave primária (correspondente à chave primária oculta que faz parte de cada tabela `NDB`).

A partir do que foi visto acima, podemos ver que cada fragmento de tabela e cada fragmento de índice alocam juntos a quantidade de `DataMemory` calculada conforme mostrado aqui:

```sql
DataMemory =
  (number_of_fixed_pages + number_of_var_pages) * 32KB
    + number_of_hash_pages * 8KB
```

Como `fixed_elem_alloc_bytes` e `var_elem_alloc_bytes` são sempre múltiplos de 32768 bytes, podemos determinar ainda que `número_de_páginas_fixas = fixed_elem_alloc_bytes / 32768` e `número_de_páginas_variáveis = var_elem_alloc_bytes / 32768`. `hash_index_alloc_bytes` é sempre um múltiplo de 8192 bytes, então `número_de_páginas_hash = hash_index_alloc_bytes / 8192`.

Uma página de tamanho fixo possui um cabeçalho interno e um número de espaços de tamanho fixo, cada um dos quais pode conter a parte de tamanho fixo de uma linha. O tamanho da parte de tamanho fixo de uma determinada linha depende do esquema e é fornecido pela coluna `fixed_elem_size_bytes`; o número de espaços de tamanho fixo por página pode ser determinado calculando o número total de espaços e o número total de páginas, da seguinte forma:

```sql
fixed_slots = fixed_elem_count + fixed_elem_free_count

fixed_pages = fixed_elem_alloc_bytes / 32768

slots_per_page = total_slots / total_pages
```

`fixed_elem_count` é, na verdade, o número de linhas para um fragmento de tabela específico, já que cada linha tem 1 elemento fixo. `fixed_elem_free_count` é o número total de slots de tamanho fixo livres nas páginas alocadas. `fixed_elem_free_bytes` é igual a `fixed_elem_free_count * fixed_elem_size_bytes`.

Um fragmento pode ter qualquer número de páginas de tamanho fixo; quando a última linha de uma página de tamanho fixo é excluída, a página é liberada para o conjunto de páginas `DataMemory`. Páginas de tamanho fixo podem ser fragmentadas, com mais páginas alocadas do que o necessário pelo número de slots de tamanho fixo em uso. Você pode verificar se isso é o caso comparando as páginas necessárias com as páginas alocadas, que você pode calcular da seguinte forma:

```sql
fixed_pages_required = 1 + (fixed_elem_count / slots_per_page)

fixed_page_utilization = fixed_pages_required / fixed_pages
```

Uma página de tamanho variável tem um cabeçalho interno e usa o espaço restante para armazenar uma ou mais partes de linha de tamanho variável; o número de partes armazenadas depende do esquema e dos dados reais armazenados. Como nem todos os esquemas ou linhas têm uma parte de tamanho variável, `var_elem_count` pode ser menor que `fixed_elem_count`. O espaço livre total disponível em todas as páginas de tamanho variável no fragmento é mostrado pela coluna `var_elem_free_bytes`; como esse espaço pode ser distribuído por várias páginas, ele não pode ser necessariamente usado para armazenar uma entrada de um tamanho específico. Cada página de tamanho variável é reorganizada conforme necessário para caber ao tamanho variável das partes de linha à medida que são inseridas, atualizadas e excluídas; se uma parte de linha dada se tornar muito grande para a página em que está, ela pode ser movida para uma página diferente.

A utilização de páginas de tamanhos variáveis pode ser calculada da seguinte forma:

```sql
var_page_used_bytes =  var_elem_alloc_bytes - var_elem_free_bytes

var_page_utilisation = var_page_used_bytes / var_elem_alloc_bytes

avg_row_var_part_size = var_page_used_bytes / fixed_elem_count
```

Podemos obter o tamanho médio da parte variável por linha da seguinte forma:

```sql
avg_row_var_part_size = var_page_used_bytes / fixed_elem_count
```

Os índices únicos secundários são implementados internamente como tabelas independentes com o seguinte esquema:

- *Chave primária*: Colunas indexadas na tabela base.

- *Valores*: Colunas da chave primária da tabela base.

Essas tabelas são distribuídas e fragmentadas normalmente. Isso significa que suas réplicas de fragmento usam páginas de índice fixo, variável e hash, como qualquer outra tabela `NDB`.

Os índices ordenados secundários são fragmentados e distribuídos da mesma maneira que a tabela base. Os fragmentos de índice ordenado são estruturas de árvore T que mantêm uma árvore equilibrada contendo referências de linha na ordem implícita pelas colunas indexadas. Como a árvore contém referências em vez de dados reais, o custo de armazenamento da árvore T não depende do tamanho ou número de colunas indexadas, mas é uma função do número de linhas. A árvore é construída usando estruturas de nó de tamanho fixo, cada uma das quais pode conter um número de referências de linha; o número de nós necessários depende do número de linhas na tabela e da estrutura da árvore necessária para representar a ordenação. Na tabela `memory_per_fragment`, podemos ver que os índices ordenados alocam apenas páginas de tamanho fixo, portanto, como de costume, as colunas relevantes desta tabela estão listadas aqui:

- `fixed_elem_alloc_bytes`: Isso é igual a 32768 vezes o número de páginas de tamanho fixo.

- `fixed_elem_count`: O número de nós do T-tree em uso.

- `fixed_elem_size_bytes`: O número de bytes por nó do T-tree.

- `fixed_elem_free_count`: O número de slots de nós do T-tree disponíveis nas páginas alocadas.

- `fixed_elem_free_bytes`: Isso é igual a `fixed_elem_free_count * fixed_elem_size_bytes`.

Se o espaço livre em uma página estiver fragmentado, a página será desfragmentada. O comando `OPTIMIZE TABLE` pode ser usado para desfragmentar páginas de tamanho variável de uma tabela; isso move partes de linhas de tamanho variável entre páginas, de modo que algumas páginas inteiras possam ser liberadas para uso novamente.

##### tabela memory\_per\_fragment: Exemplos

- Obter informações gerais sobre fragmentos e uso de memória
- Encontrar uma tabela e seus índices
- Encontrar a memória alocada pelos elementos do esquema
- Encontrar a memória alocada para uma tabela e todos os índices
- Encontrar a memória alocada por linha
- Encontrar a memória total em uso por linha
- Encontrar a memória alocada por elemento
- Encontrar a memória média alocada por linha, por elemento
- Encontrar a memória média alocada por linha
- Encontrar a memória média alocada por linha para uma tabela
- Encontrar a memória usada por cada elemento do esquema
- Encontrar a memória média em uso por cada elemento do esquema
- Encontrar a memória média em uso por linha, por elemento
- Encontrar a média total de memória em uso por linha

Para os exemplos seguintes, criamos uma tabela simples com três colunas inteiras, uma das quais tem uma chave primária, outra com um índice único e outra sem índices, além de uma coluna `VARCHAR` sem índices, conforme mostrado aqui:

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

Após a criação da tabela, inserimos 50.000 linhas contendo dados aleatórios; o método preciso de gerar e inserir essas linhas não faz diferença prática, e deixamos o método de realização como um exercício para o usuário.

###### Obter informações gerais sobre fragmentos e uso de memória

Essa consulta mostra informações gerais sobre o uso de memória para cada fragmento:

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

###### Encontrar uma tabela e seus índices

Essa consulta pode ser usada para encontrar uma tabela específica e seus índices:

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

###### Encontrar a memória alocada pelos elementos do esquema

Essa consulta mostra a memória alocada por cada elemento do esquema (no total em todas as réplicas):

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

###### Encontrar a memória alocada para uma tabela e todos os índices

A soma da memória alocada para a tabela e todos os seus índices (no total em todas as réplicas) pode ser obtida usando a consulta mostrada aqui:

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

Esta é uma versão abreviada da consulta anterior, que mostra apenas a memória total usada pela tabela:

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

###### Encontrar a memória alocada por linha

A consulta a seguir mostra a memória total alocada por linha (em todas as réplicas):

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

###### Encontrar a memória total em uso por linha

Para obter a memória total em uso por linha (em todas as réplicas), precisamos dividir a memória total usada pelo número de linhas, que é o `fixed_elem_count` da tabela base, da seguinte forma:

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

###### Encontrar a memória alocada por elemento

A memória alocada por cada elemento do esquema (no total em todas as réplicas) pode ser encontrada usando a seguinte consulta:

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

###### Encontrar a memória média alocada por linha, por elemento

Para obter a memória média alocada por linha de cada elemento do esquema (no total em todas as réplicas), usamos uma subconsulta para obter a contagem fixa do elemento da tabela base cada vez que precisamos calcular a média por linha, já que `fixed_elem_count` para os índices não é necessariamente a mesma que para a tabela base, como mostrado aqui:

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

###### Encontrar a memória média alocada por linha

Memória média alocada por linha (totalmente em todas as réplicas):

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

###### Encontrar a memória média alocada por linha para uma tabela

Para obter a quantidade média de memória alocada por linha para toda a tabela em todas as réplicas, podemos usar a consulta mostrada aqui:

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

###### Encontrar a memória usada por cada elemento do esquema

Para obter a memória em uso por elemento do esquema em todas as réplicas, precisamos somar a diferença entre a memória alocada e a memória livre para cada elemento, da seguinte forma:

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

###### Encontrar a memória média em uso por cada elemento do esquema

Essa consulta obtém a memória média em uso por elemento do esquema em todas as réplicas:

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

###### Encontrar a memória média em uso por linha, por elemento

Essa consulta obtém a memória média em uso por linha, por elemento, em todas as réplicas:

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

###### Encontrar a média total de memória em uso por linha

Essa consulta obtém a média total de memória em uso, por linha:

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
