### 14.16.5 Tabelas INFORMATION_SCHEMA do Buffer Pool do InnoDB

As tabelas `INFORMATION_SCHEMA` do Buffer Pool do `InnoDB` fornecem informações de status do Buffer Pool e metadados sobre as páginas dentro do Buffer Pool do `InnoDB`.

As tabelas `INFORMATION_SCHEMA` do Buffer Pool do `InnoDB` incluem as listadas abaixo:

```sql
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

* `INNODB_BUFFER_PAGE`: Contém informações sobre cada página no Buffer Pool do `InnoDB`.

* `INNODB_BUFFER_PAGE_LRU`: Contém informações sobre as páginas no Buffer Pool do `InnoDB`, em particular como elas são ordenadas na lista LRU que determina quais páginas devem ser despejadas do Buffer Pool quando ele se enche. A tabela `INNODB_BUFFER_PAGE_LRU` tem as mesmas colunas que a tabela `INNODB_BUFFER_PAGE`, exceto que a tabela `INNODB_BUFFER_PAGE_LRU` tem uma coluna `LRU_POSITION` em vez de uma coluna `BLOCK_ID`.

* `INNODB_BUFFER_POOL_STATS`: Fornece informações de status do Buffer Pool. Grande parte dessa informação é fornecida pela saída de `SHOW ENGINE INNODB STATUS`, ou pode ser obtida usando variáveis de status do servidor do Buffer Pool do `InnoDB`.

Aviso

Consultar a tabela `INNODB_BUFFER_PAGE` ou `INNODB_BUFFER_PAGE_LRU` pode afetar o desempenho. Não consulte essas tabelas em um sistema de produção, a menos que você esteja ciente do impacto no desempenho e tenha determinado que ele é aceitável. Para evitar o impacto no desempenho em um sistema de produção, reproduza o problema que você deseja investigar e consulte as estatísticas do Buffer Pool em uma instância de teste.

**Exemplo 14.6 Consultando Dados do Sistema na Tabela INNODB_BUFFER_PAGE**

Esta Query fornece uma contagem aproximada de páginas que contêm dados do sistema, excluindo páginas onde o valor de `TABLE_NAME` é `NULL` ou inclui uma barra `/` ou ponto `.` no nome da tabela, o que indica uma tabela definida pelo usuário.

```sql
mysql> SELECT COUNT(*) FROM INFORMATION_SCHEMA.INNODB_BUFFER_PAGE
       WHERE TABLE_NAME IS NULL OR (INSTR(TABLE_NAME, '/') = 0 AND INSTR(TABLE_NAME, '.') = 0);
+----------+
| COUNT(*) |
+----------+
|     1516 |
+----------+
```

Esta Query retorna o número aproximado de páginas que contêm dados do sistema, o número total de páginas do Buffer Pool e uma porcentagem aproximada de páginas que contêm dados do sistema.

```sql
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

O tipo de dados do sistema no Buffer Pool pode ser determinado consultando o valor de `PAGE_TYPE`. Por exemplo, a Query a seguir retorna oito valores distintos de `PAGE_TYPE` entre as páginas que contêm dados do sistema:

```sql
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

**Exemplo 14.7 Consultando Dados do Usuário na Tabela INNODB_BUFFER_PAGE**

Esta Query fornece uma contagem aproximada de páginas contendo dados do usuário, contando as páginas onde o valor de `TABLE_NAME` é `NOT NULL` e `NOT LIKE '%INNODB_SYS_TABLES%'`.

```sql
mysql> SELECT COUNT(*) FROM INFORMATION_SCHEMA.INNODB_BUFFER_PAGE
       WHERE TABLE_NAME IS NOT NULL AND TABLE_NAME NOT LIKE '%INNODB_SYS_TABLES%';
+----------+
| COUNT(*) |
+----------+
|     7897 |
+----------+
```

Esta Query retorna o número aproximado de páginas que contêm dados do usuário, o número total de páginas do Buffer Pool e uma porcentagem aproximada de páginas que contêm dados do usuário.

```sql
mysql> SELECT
       (SELECT COUNT(*) FROM INFORMATION_SCHEMA.INNODB_BUFFER_PAGE
       WHERE TABLE_NAME IS NOT NULL AND (INSTR(TABLE_NAME, '/') > 0 OR INSTR(TABLE_NAME, '.') > 0)
       ) AS user_pages,
       (
       SELECT COUNT(*)
       FROM INFORMATION_SCHEMA.INNODB_BUFFER_PAGE
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

Esta Query identifica tabelas definidas pelo usuário com páginas no Buffer Pool:

```sql
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

**Exemplo 14.8 Consultando Dados de Index na Tabela INNODB_BUFFER_PAGE**

Para obter informações sobre páginas de Index, consulte a coluna `INDEX_NAME` usando o nome do Index. Por exemplo, a Query a seguir retorna o número de páginas e o tamanho total dos dados das páginas para o Index `emp_no` que está definido na tabela `employees.salaries`:

```sql
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

Esta Query retorna o número de páginas e o tamanho total dos dados das páginas para todos os Indexes definidos na tabela `employees.salaries`:

```sql
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

**Exemplo 14.9 Consultando Dados de LRU_POSITION na Tabela INNODB_BUFFER_PAGE_LRU**

A tabela `INNODB_BUFFER_PAGE_LRU` contém informações sobre as páginas no Buffer Pool do `InnoDB`, em particular como elas estão ordenadas, o que determina quais páginas devem ser despejadas do Buffer Pool quando ele se enche. A definição para esta página é a mesma para `INNODB_BUFFER_PAGE`, exceto que esta tabela tem uma coluna `LRU_POSITION` em vez de uma coluna `BLOCK_ID`.

Esta Query conta o número de posições em um local específico na lista LRU ocupadas por páginas da tabela `employees.employees`.

```sql
mysql> SELECT COUNT(LRU_POSITION) FROM INFORMATION_SCHEMA.INNODB_BUFFER_PAGE_LRU
       WHERE TABLE_NAME='`employees`.`employees`' AND LRU_POSITION < 3072;
+---------------------+
| COUNT(LRU_POSITION) |
+---------------------+
|                 548 |
+---------------------+
```

**Exemplo 14.10 Consultando a Tabela INNODB_BUFFER_POOL_STATS**

A tabela `INNODB_BUFFER_POOL_STATS` fornece informações semelhantes a `SHOW ENGINE INNODB STATUS` e às variáveis de status do Buffer Pool do `InnoDB`.

```sql
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

Para comparação, a saída de `SHOW ENGINE INNODB STATUS` e a saída da variável de status do Buffer Pool do `InnoDB` são mostradas abaixo, com base no mesmo conjunto de dados.

Para mais informações sobre a saída de `SHOW ENGINE INNODB STATUS`, consulte a Seção 14.18.3, “Saída do Monitor Padrão e Monitor de Lock do InnoDB”.

```sql
mysql> SHOW ENGINE INNODB STATUS \G
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

Para descrições das variáveis de status, consulte a Seção 5.1.9, “Variáveis de Status do Servidor”.

```sql
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