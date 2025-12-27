### 17.15.5 Tabelas do Banco de Buffer do Schema de Informação do InnoDB

As tabelas do banco de buffer do Schema de Informação do InnoDB fornecem informações sobre o status do banco de buffer e metadados sobre as páginas dentro do banco de buffer do InnoDB.

As tabelas do banco de buffer do Schema de Informação do InnoDB incluem as listadas abaixo:

```
mysql> SHOW TABLES FROM INFORMATION_SCHEMA LIKE 'INNODB_BUFFER%';
+-----------------------------------------------+
| Tables_in_INFORMATION_SCHEMA (INNODB_BUFFER%) |
+-----------------------------------------------+
| INNODB_BUFFER_PAGE_LRU                        |
| INNODB_BUFFER_PAGE                            |
| INNODB_BUFFER_POOL_STATS                      |
+-----------------------------------------------+
```

#### Visão Geral da Tabela

* `INNODB_BUFFER_PAGE`: Armazena informações sobre cada página no banco de buffer do InnoDB.

* `INNODB_BUFFER_PAGE_LRU`: Armazena informações sobre as páginas no banco de buffer do InnoDB, em particular, como elas estão ordenadas na lista LRU que determina quais páginas serão removidas do banco de buffer quando ele ficar cheio. A tabela `INNODB_BUFFER_PAGE_LRU` tem as mesmas colunas que a tabela `INNODB_BUFFER_PAGE`, exceto que a tabela `INNODB_BUFFER_PAGE_LRU` tem uma coluna `LRU_POSITION` em vez de uma coluna `BLOCK_ID`.

* `INNODB_BUFFER_POOL_STATS`: Fornece informações sobre o status do banco de buffer. Grande parte das mesmas informações é fornecida pelo comando `SHOW ENGINE INNODB STATUS`, ou pode ser obtida usando as variáveis de status do servidor do banco de buffer do InnoDB.

Aviso

Fazer consultas na tabela `INNODB_BUFFER_PAGE` ou `INNODB_BUFFER_PAGE_LRU` pode afetar o desempenho. Não faça consultas a essas tabelas em um sistema de produção, a menos que você esteja ciente do impacto no desempenho e tenha determinado que ele é aceitável. Para evitar afetar o desempenho em um sistema de produção, reproduza o problema que você deseja investigar e faça consultas às estatísticas do banco de buffer em uma instância de teste.

**Exemplo 17.6 Consulta de Dados do Sistema na Tabela INNODB\_BUFFER\_PAGE**

Esta consulta fornece um contagem aproximada de páginas que contêm dados do sistema, excluindo páginas onde o valor `TABLE_NAME` é `NULL` ou inclui uma barra `/` ou ponto `.` no nome da tabela, o que indica uma tabela definida pelo usuário.

```
mysql> SELECT COUNT(*) FROM INFORMATION_SCHEMA.INNODB_BUFFER_PAGE
       WHERE TABLE_NAME IS NULL OR (INSTR(TABLE_NAME, '/') = 0 AND INSTR(TABLE_NAME, '.') = 0);
+----------+
| COUNT(*) |
+----------+
|     1516 |
+----------+
```

Esta consulta retorna o número aproximado de páginas que contêm dados do sistema, o número total de páginas do pool de buffers e uma porcentagem aproximada de páginas que contêm dados do sistema.

```
mysql> SELECT
       (SELECT COUNT(*) FROM INFORMATION_SCHEMA.INNODB_BUFFER_PAGE
       WHERE TABLE_NAME IS NULL OR (INSTR(TABLE_NAME, '/') = 0 AND INSTR(TABLE_NAME, '.') = 0)
       ) AS system_pages,
       (
       SELECT COUNT(*)
       FROM INFORMATION_SCHEMA.INNODB_BUFFER_PAGE
       ) AS total_pages,
       (
       SELECT ROUND((system_pages/total_pages) * 100)
       ) AS system_page_percentage;
+--------------+-------------+------------------------+
| system_pages | total_pages | system_page_percentage |
+--------------+-------------+------------------------+
|          295 |        8192 |                      4 |
+--------------+-------------+------------------------+
```

O tipo de dados do sistema no pool de buffers pode ser determinado consultando o valor `PAGE_TYPE`. Por exemplo, a seguinte consulta retorna oito valores distintos de `PAGE_TYPE` entre as páginas que contêm dados do sistema:

```
mysql> SELECT DISTINCT PAGE_TYPE FROM INFORMATION_SCHEMA.INNODB_BUFFER_PAGE
       WHERE TABLE_NAME IS NULL OR (INSTR(TABLE_NAME, '/') = 0 AND INSTR(TABLE_NAME, '.') = 0);
+-------------------+
| PAGE_TYPE         |
+-------------------+
| SYSTEM            |
| IBUF_BITMAP       |
| UNKNOWN           |
| FILE_SPACE_HEADER |
| INODE             |
| UNDO_LOG          |
| ALLOCATED         |
+-------------------+
```

**Exemplo 17.7 Consulta de Dados do Usuário na Tabela INNODB\_BUFFER\_PAGE**

Esta consulta fornece um contagem aproximada de páginas contendo dados do usuário, contando páginas onde o valor `TABLE_NAME` é `NOT NULL` e `NOT LIKE '%INNODB_TABLES%'`.

```
mysql> SELECT COUNT(*) FROM INFORMATION_SCHEMA.INNODB_BUFFER_PAGE
       WHERE TABLE_NAME IS NOT NULL AND TABLE_NAME NOT LIKE '%INNODB_TABLES%';
+----------+
| COUNT(*) |
+----------+
|     7897 |
+----------+
```

Esta consulta retorna o número aproximado de páginas que contêm dados do usuário, o número total de páginas do pool de buffers e uma porcentagem aproximada de páginas que contêm dados do usuário.

```
mysql> SELECT
       (SELECT COUNT(*) FROM INFORMATION_SCHEMA.INNODB_BUFFER_PAGE
       WHERE TABLE_NAME IS NOT NULL AND (INSTR(TABLE_NAME, '/') > 0 OR INSTR(TABLE_NAME, '.') > 0)
       ) AS user_pages,
       (
       SELECT COUNT(*)
       FROM information_schema.INNODB_BUFFER_PAGE
       ) AS total_pages,
       (
       SELECT ROUND((user_pages/total_pages) * 100)
       ) AS user_page_percentage;
+------------+-------------+----------------------+
| user_pages | total_pages | user_page_percentage |
+------------+-------------+----------------------+
|       7897 |        8192 |                   96 |
+------------+-------------+----------------------+
```

Esta consulta identifica tabelas definidas pelo usuário com páginas no pool de buffers:

```
mysql> SELECT DISTINCT TABLE_NAME FROM INFORMATION_SCHEMA.INNODB_BUFFER_PAGE
       WHERE TABLE_NAME IS NOT NULL AND (INSTR(TABLE_NAME, '/') > 0 OR INSTR(TABLE_NAME, '.') > 0)
       AND TABLE_NAME NOT LIKE '`mysql`.`innodb_%';
+-------------------------+
| TABLE_NAME              |
+-------------------------+
| `employees`.`salaries`  |
| `employees`.`employees` |
+-------------------------+
```

**Exemplo 17.8 Consulta de Dados de Índices na Tabela INNODB\_BUFFER\_PAGE**

Para obter informações sobre páginas de índice, consulte a coluna `INDEX_NAME` usando o nome do índice. Por exemplo, a seguinte consulta retorna o número de páginas e o tamanho total de dados das páginas para o índice `emp_no` que é definido na tabela `employees.salaries`:

```
mysql> SELECT INDEX_NAME, COUNT(*) AS Pages,
ROUND(SUM(IF(COMPRESSED_SIZE = 0, @@GLOBAL.innodb_page_size, COMPRESSED_SIZE))/1024/1024)
AS 'Total Data (MB)'
FROM INFORMATION_SCHEMA.INNODB_BUFFER_PAGE
WHERE INDEX_NAME='emp_no' AND TABLE_NAME = '`employees`.`salaries`';
+------------+-------+-----------------+
| INDEX_NAME | Pages | Total Data (MB) |
+------------+-------+-----------------+
| emp_no     |  1609 |              25 |
+------------+-------+-----------------+
```

Esta consulta retorna o número de páginas e o tamanho total de dados das páginas para todos os índices definidos na tabela `employees.salaries`:

```
mysql> SELECT INDEX_NAME, COUNT(*) AS Pages,
       ROUND(SUM(IF(COMPRESSED_SIZE = 0, @@GLOBAL.innodb_page_size, COMPRESSED_SIZE))/1024/1024)
       AS 'Total Data (MB)'
       FROM INFORMATION_SCHEMA.INNODB_BUFFER_PAGE
       WHERE TABLE_NAME = '`employees`.`salaries`'
       GROUP BY INDEX_NAME;
+------------+-------+-----------------+
| INDEX_NAME | Pages | Total Data (MB) |
+------------+-------+-----------------+
| emp_no     |  1608 |              25 |
| PRIMARY    |  6086 |              95 |
+------------+-------+-----------------+
```

**Exemplo 17.9 Consulta de Dados LRU\_POSITION na Tabela INNODB\_BUFFER\_PAGE\_LRU**

A tabela `INNODB_BUFFER_PAGE_LRU` contém informações sobre as páginas no pool de buffer do `InnoDB`, especificamente como elas são ordenadas, o que determina quais páginas devem ser removidas do pool de buffer quando ele ficar cheio. A definição para essa página é a mesma da `INNODB_BUFFER_PAGE`, exceto que essa tabela tem uma coluna `LRU_POSITION` em vez de uma coluna `BLOCK_ID`.

Esta consulta conta o número de posições em um local específico na lista LRU ocupadas por páginas da tabela `employees.employees`.

```
mysql> SELECT COUNT(LRU_POSITION) FROM INFORMATION_SCHEMA.INNODB_BUFFER_PAGE_LRU
       WHERE TABLE_NAME='`employees`.`employees`' AND LRU_POSITION < 3072;
+---------------------+
| COUNT(LRU_POSITION) |
+---------------------+
|                 548 |
+---------------------+
```

**Exemplo 17.10 Consultando a Tabela INNODB\_BUFFER\_POOL\_STATS**

A tabela `INNODB_BUFFER_POOL_STATS` fornece informações semelhantes às variáveis `SHOW ENGINE INNODB STATUS` e `InnoDB` pool de buffer status.

```
mysql> SELECT * FROM information_schema.INNODB_BUFFER_POOL_STATS \G
*************************** 1. row ***************************
                         POOL_ID: 0
                       POOL_SIZE: 8192
                    FREE_BUFFERS: 1
                  DATABASE_PAGES: 8173
              OLD_DATABASE_PAGES: 3014
         MODIFIED_DATABASE_PAGES: 0
              PENDING_DECOMPRESS: 0
                   PENDING_READS: 0
               PENDING_FLUSH_LRU: 0
              PENDING_FLUSH_LIST: 0
                PAGES_MADE_YOUNG: 15907
            PAGES_NOT_MADE_YOUNG: 3803101
           PAGES_MADE_YOUNG_RATE: 0
       PAGES_MADE_NOT_YOUNG_RATE: 0
               NUMBER_PAGES_READ: 3270
            NUMBER_PAGES_CREATED: 13176
            NUMBER_PAGES_WRITTEN: 15109
                 PAGES_READ_RATE: 0
               PAGES_CREATE_RATE: 0
              PAGES_WRITTEN_RATE: 0
                NUMBER_PAGES_GET: 33069332
                        HIT_RATE: 0
    YOUNG_MAKE_PER_THOUSAND_GETS: 0
NOT_YOUNG_MAKE_PER_THOUSAND_GETS: 0
         NUMBER_PAGES_READ_AHEAD: 2713
       NUMBER_READ_AHEAD_EVICTED: 0
                 READ_AHEAD_RATE: 0
         READ_AHEAD_EVICTED_RATE: 0
                    LRU_IO_TOTAL: 0
                  LRU_IO_CURRENT: 0
                UNCOMPRESS_TOTAL: 0
              UNCOMPRESS_CURRENT: 0
```

Para comparação, a saída da consulta `SHOW ENGINE INNODB STATUS` e a saída da variável de status do pool de buffer `InnoDB` são mostradas abaixo, com base no mesmo conjunto de dados.

Para mais informações sobre a saída da consulta `SHOW ENGINE INNODB STATUS`, consulte a Seção 17.17.3, “Saída do Monitor Padrão do InnoDB e do Monitor de Bloqueio”.

```
mysql> SHOW ENGINE INNODB STATUS\G
...
----------------------
BUFFER POOL AND MEMORY
----------------------
Total large memory allocated 137428992
Dictionary memory allocated 579084
Buffer pool size   8192
Free buffers       1
Database pages     8173
Old database pages 3014
Modified db pages  0
Pending reads 0
Pending writes: LRU 0, flush list 0, single page 0
Pages made young 15907, not young 3803101
0.00 youngs/s, 0.00 non-youngs/s
Pages read 3270, created 13176, written 15109
0.00 reads/s, 0.00 creates/s, 0.00 writes/s
No buffer pool page gets since the last printout
Pages read ahead 0.00/s, evicted without access 0.00/s, Random read ahead 0.00/s
LRU len: 8173, unzip_LRU len: 0
I/O sum[0]:cur[0], unzip sum[0]:cur[0]
...
```

Para descrições das variáveis de status, consulte a Seção 7.1.10, “Variáveis de Status do Servidor”.

```
mysql> SHOW STATUS LIKE 'Innodb_buffer%';
+---------------------------------------+-------------+
| Variable_name                         | Value       |
+---------------------------------------+-------------+
| Innodb_buffer_pool_dump_status        | not started |
| Innodb_buffer_pool_load_status        | not started |
| Innodb_buffer_pool_resize_status      | not started |
| Innodb_buffer_pool_pages_data         | 8173        |
| Innodb_buffer_pool_bytes_data         | 133906432   |
| Innodb_buffer_pool_pages_dirty        | 0           |
| Innodb_buffer_pool_bytes_dirty        | 0           |
| Innodb_buffer_pool_pages_flushed      | 15109       |
| Innodb_buffer_pool_pages_free         | 1           |
| Innodb_buffer_pool_pages_misc         | 18          |
| Innodb_buffer_pool_pages_total        | 8192        |
| Innodb_buffer_pool_read_ahead_rnd     | 0           |
| Innodb_buffer_pool_read_ahead         | 2713        |
| Innodb_buffer_pool_read_ahead_evicted | 0           |
| Innodb_buffer_pool_read_requests      | 33069332    |
| Innodb_buffer_pool_reads              | 558         |
| Innodb_buffer_pool_wait_free          | 0           |
| Innodb_buffer_pool_write_requests     | 11985961    |
+---------------------------------------+-------------+
```