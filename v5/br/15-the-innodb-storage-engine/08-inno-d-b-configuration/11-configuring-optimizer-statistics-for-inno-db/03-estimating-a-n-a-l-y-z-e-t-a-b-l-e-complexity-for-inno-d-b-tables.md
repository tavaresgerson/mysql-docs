#### 14.8.11.3 Estimação da complexidade da Tabela ANALYZE para tabelas InnoDB

A complexidade da opção `ANALYZE TABLE` para tabelas `InnoDB` depende de:

- O número de páginas amostradas, conforme definido por `innodb_stats_persistent_sample_pages`.

- O número de colunas indexadas em uma tabela

- O número de partições. Se uma tabela não tiver partições, o número de partições é considerado 1.

Usando esses parâmetros, uma fórmula aproximada para estimar a complexidade da consulta `ANALYZE TABLE` seria:

O valor de `innodb_stats_persistent_sample_pages` \* número de colunas indexadas em uma tabela \* número de partições

Normalmente, quanto maior o valor resultante, maior o tempo de execução da consulta `ANALYZE TABLE`.

Nota

`innodb_stats_persistent_sample_pages` define o número de páginas amostradas em nível global. Para definir o número de páginas amostradas para uma tabela individual, use a opção `STATS_SAMPLE_PAGES` com `CREATE TABLE` ou `ALTER TABLE`. Para mais informações, consulte a Seção 14.8.11.1, “Configurando Parâmetros de Estatísticas de Otimizador Persistente”.

Se `innodb_stats_persistent=OFF`, o número de páginas amostradas é definido por `innodb_stats_transient_sample_pages`. Consulte a Seção 14.8.11.2, “Configurando Parâmetros de Estatísticas de Otimizador Não Persistentes”, para obter informações adicionais.

Para uma abordagem mais aprofundada na estimativa da complexidade da função `ANALYZE TABLE`, considere o exemplo a seguir.

Na notação Big O, a complexidade de `ANALYZE TABLE` é descrita como:

```sql
O(n_sample
  * (n_cols_in_uniq_i
     + n_cols_in_non_uniq_i
     + n_cols_in_pk * (1 + n_non_uniq_i))
  * n_part)
```

onde:

- `n_sample` é o número de páginas amostradas (definido por `innodb_stats_persistent_sample_pages`)

- `n_cols_in_uniq_i` é o número total de todas as colunas em todos os índices únicos (não contando as colunas da chave primária)

- `n_cols_in_non_uniq_i` é o número total de todas as colunas em todos os índices não únicos

- `n_cols_in_pk` é o número de colunas na chave primária (se uma chave primária não for definida, o `InnoDB` cria internamente uma chave primária de uma única coluna)

- `n_non_uniq_i` é o número de índices não únicos na tabela

- `n_part` é o número de partições. Se nenhuma partição for definida, a tabela é considerada uma única partição.

Agora, considere a seguinte tabela (tabela `t`), que possui uma chave primária (2 colunas), um índice único (2 colunas) e dois índices não exclusivos (2 colunas cada):

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

Para os dados da coluna e do índice necessários para o algoritmo descrito acima, consulte a tabela de estatísticas persistentes de índices `mysql.innodb_index_stats` da tabela `t`. As estatísticas `n_diff_pfx%` mostram as colunas que são contadas para cada índice. Por exemplo, as colunas `a` e `b` são contadas para o índice de chave primária. Para os índices não únicos, as colunas da chave primária (a, b) são contadas, além das colunas definidas pelo usuário.

Nota

Para obter informações adicionais sobre as tabelas de estatísticas persistentes do InnoDB, consulte a Seção 14.8.11.1, “Configurando Parâmetros de Estatísticas do Otimizador Persistente”.

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

Com base nos dados estatísticos do índice mostrados acima e na definição da tabela, os seguintes valores podem ser determinados:

- `n_cols_in_uniq_i`, o número total de todas as colunas em todos os índices únicos, excluindo as colunas da chave primária, é 2 (`c` e `d`)

- `n_cols_in_non_uniq_i`, o número total de todas as colunas em todos os índices não únicos, é 4 (`e`, `f`, `g` e `h`)

- `n_cols_in_pk`, o número de colunas na chave primária, é 2 (`a` e `b`)

- `n_non_uniq_i`, o número de índices não únicos na tabela, é 2 (`i2nonuniq` e `i3nonuniq`))

- `n_part`, o número de partições, é 1.

Agora você pode calcular `innodb_stats_persistent_sample_pages` \* (2 + 4

- 2 \* (1 + 2)) \* 1 para determinar o número de páginas de folha que são digitalizadas. Com `innodb_stats_persistent_sample_pages` definido para o valor padrão de `20`, e com um tamanho de página padrão de 16 `KiB` (`innodb_page_size`=16384), você pode então estimar que 20 \* 12 \* 16384 `bytes` são lidos para a tabela `t`, ou cerca de 4 `MiB`.

Nota

É possível que todos os 4 `MiB` não sejam lidos do disco, pois algumas páginas de folha podem já estar armazenadas em cache no pool de buffers.
