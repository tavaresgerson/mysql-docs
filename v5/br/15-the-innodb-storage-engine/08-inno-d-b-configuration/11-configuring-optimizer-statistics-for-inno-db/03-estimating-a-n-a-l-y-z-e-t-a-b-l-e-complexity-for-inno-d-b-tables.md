#### 14.8.11.3 Estimando a Complexidade de ANALYZE TABLE para Tabelas InnoDB

A complexidade de `ANALYZE TABLE` para tabelas `InnoDB` depende de:

*   O número de páginas amostradas, conforme definido por `innodb_stats_persistent_sample_pages`.
*   O número de colunas indexadas em uma table
*   O número de partitions. Se uma table não tiver partitions, o número de partitions é considerado 1.

Usando esses parâmetros, uma fórmula aproximada para estimar a complexidade de `ANALYZE TABLE` seria:

O valor de `innodb_stats_persistent_sample_pages` \* número de colunas indexadas em uma table \* o número de partitions

Geralmente, quanto maior o valor resultante, maior será o tempo de execução para `ANALYZE TABLE`.

Nota

`innodb_stats_persistent_sample_pages` define o número de páginas amostradas em um nível global. Para definir o número de páginas amostradas para uma table individual, use a opção `STATS_SAMPLE_PAGES` com `CREATE TABLE` ou `ALTER TABLE`. Para mais informações, consulte a Seção 14.8.11.1, “Configurando Parâmetros de Estatísticas Persistentes do Optimizer”.

Se `innodb_stats_persistent=OFF`, o número de páginas amostradas é definido por `innodb_stats_transient_sample_pages`. Consulte a Seção 14.8.11.2, “Configurando Parâmetros de Estatísticas Não-Persistentes do Optimizer” para informações adicionais.

Para uma abordagem mais aprofundada para estimar a complexidade de `ANALYZE TABLE`, considere o seguinte exemplo.

Na notação Big O, a complexidade de `ANALYZE TABLE` é descrita como:

```sql
O(n_sample
  * (n_cols_in_uniq_i
     + n_cols_in_non_uniq_i
     + n_cols_in_pk * (1 + n_non_uniq_i))
  * n_part)
```

onde:

*   `n_sample` é o número de páginas amostradas (definido por `innodb_stats_persistent_sample_pages`)

*   `n_cols_in_uniq_i` é o número total de todas as colunas em todos os unique indexes (sem contar as colunas da primary key)

*   `n_cols_in_non_uniq_i` é o número total de todas as colunas em todos os nonunique indexes

*   `n_cols_in_pk` é o número de colunas na primary key (se uma primary key não for definida, o `InnoDB` cria internamente uma primary key de coluna única)

*   `n_non_uniq_i` é o número de nonunique indexes na table

*   `n_part` é o número de partitions. Se nenhuma partition for definida, a table é considerada uma única partition.

Agora, considere a seguinte table (table `t`), que possui uma primary key (2 colunas), um unique index (2 colunas) e dois nonunique indexes (duas colunas cada):

```sql
CREATE TABLE t (
  a INT,
  b INT,
  c INT,
  d INT,
  e INT,
  f INT,
  g INT,
  h INT,
  PRIMARY KEY (a, b),
  UNIQUE KEY i1uniq (c, d),
  KEY i2nonuniq (e, f),
  KEY i3nonuniq (g, h)
);
```

Para os dados de coluna e index exigidos pelo algoritmo descrito acima, consulte a table de estatísticas de index persistentes `mysql.innodb_index_stats` para a table `t`. As estatísticas `n_diff_pfx%` mostram as colunas que são contadas para cada index. Por exemplo, as colunas `a` e `b` são contadas para o index da primary key. Para os nonunique indexes, as colunas da primary key (`a`, `b`) são contadas além das colunas definidas pelo usuário.

Nota

Para informações adicionais sobre as tables de estatísticas persistentes `InnoDB`, consulte a Seção 14.8.11.1, “Configurando Parâmetros de Estatísticas Persistentes do Optimizer”.

```sql
mysql> SELECT index_name, stat_name, stat_description
       FROM mysql.innodb_index_stats WHERE
       database_name='test' AND
       table_name='t' AND
       stat_name like 'n_diff_pfx%';
  +------------+--------------+------------------+
  | index_name | stat_name    | stat_description |
  +------------+--------------+------------------+
  | PRIMARY    | n_diff_pfx01 | a                |
  | PRIMARY    | n_diff_pfx02 | a,b              |
  | i1uniq     | n_diff_pfx01 | c                |
  | i1uniq     | n_diff_pfx02 | c,d              |
  | i2nonuniq  | n_diff_pfx01 | e                |
  | i2nonuniq  | n_diff_pfx02 | e,f              |
  | i2nonuniq  | n_diff_pfx03 | e,f,a            |
  | i2nonuniq  | n_diff_pfx04 | e,f,a,b          |
  | i3nonuniq  | n_diff_pfx01 | g                |
  | i3nonuniq  | n_diff_pfx02 | g,h              |
  | i3nonuniq  | n_diff_pfx03 | g,h,a            |
  | i3nonuniq  | n_diff_pfx04 | g,h,a,b          |
  +------------+--------------+------------------+
```

Com base nos dados das estatísticas de index mostradas acima e na definição da table, os seguintes valores podem ser determinados:

*   `n_cols_in_uniq_i`, o número total de todas as colunas em todos os unique indexes sem contar as colunas da primary key, é 2 (`c` e `d`)

*   `n_cols_in_non_uniq_i`, o número total de todas as colunas em todos os nonunique indexes, é 4 (`e`, `f`, `g` e `h`)

*   `n_cols_in_pk`, o número de colunas na primary key, é 2 (`a` e `b`)

*   `n_non_uniq_i`, o número de nonunique indexes na table, é 2 (`i2nonuniq` e `i3nonuniq`))

*   `n_part`, o número de partitions, é 1.

Agora você pode calcular `innodb_stats_persistent_sample_pages` \* (2 + 4 + 2 \* (1 + 2)) \* 1 para determinar o número de páginas leaf que são escaneadas. Com `innodb_stats_persistent_sample_pages` definido para o valor padrão de `20`, e com um page size padrão de 16 `KiB` (`innodb_page_size`=16384), você pode estimar que 20 \* 12 \* 16384 `bytes` são lidos para a table `t`, ou cerca de 4 `MiB`.

Nota

Nem todos os 4 `MiB` podem ser lidos do disk, visto que algumas páginas leaf podem já estar armazenadas em cache no buffer pool.