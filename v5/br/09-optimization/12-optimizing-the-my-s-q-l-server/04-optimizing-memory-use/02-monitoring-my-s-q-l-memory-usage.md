#### 8.12.4.2 Monitoramento do uso de memória do MySQL

O exemplo a seguir demonstra como usar o Schema de Desempenho e o esquema sys para monitorar o uso de memória do MySQL.

A maioria das ferramentas de instrumentação de memória do Schema de Desempenho está desativada por padrão. As ferramentas podem ser ativadas atualizando a coluna `ENABLED` da tabela `setup_instruments` do Schema de Desempenho. As ferramentas de memória têm nomes na forma `memory/code_area/instrument_name`, onde *`code_area`* é um valor como `sql` ou `innodb`, e *`instrument_name`* é o detalhe do instrumento.

1. Para visualizar os instrumentos de memória MySQL disponíveis, consulte a tabela `setup_instruments` do Gerenciamento de Desempenho. A seguinte consulta retorna centenas de instrumentos de memória para todas as áreas de código.

   ```sql
   mysql> SELECT * FROM performance_schema.setup_instruments
          WHERE NAME LIKE '%memory%';
   ```

   Você pode restringir os resultados especificando uma área de código. Por exemplo, você pode limitar os resultados aos instrumentos de memória `InnoDB` especificando `innodb` como a área de código.

   ```sql
   mysql> SELECT * FROM performance_schema.setup_instruments
          WHERE NAME LIKE '%memory/innodb%';
   +-------------------------------------------+---------+-------+
   | NAME                                      | ENABLED | TIMED |
   +-------------------------------------------+---------+-------+
   | memory/innodb/adaptive hash index         | NO      | NO    |
   | memory/innodb/buf_buf_pool                | NO      | NO    |
   | memory/innodb/dict_stats_bg_recalc_pool_t | NO      | NO    |
   | memory/innodb/dict_stats_index_map_t      | NO      | NO    |
   | memory/innodb/dict_stats_n_diff_on_level  | NO      | NO    |
   | memory/innodb/other                       | NO      | NO    |
   | memory/innodb/row_log_buf                 | NO      | NO    |
   | memory/innodb/row_merge_sort              | NO      | NO    |
   | memory/innodb/std                         | NO      | NO    |
   | memory/innodb/trx_sys_t::rw_trx_ids       | NO      | NO    |
   ...
   ```

   Dependendo da sua instalação do MySQL, as áreas de código podem incluir `performance_schema`, `sql`, `client`, `innodb`, `myisam`, `csv`, `memory`, `blackhole`, `archive`, `partition` e outras.

2. Para habilitar os instrumentos de memória, adicione uma regra `performance-schema-instrument` ao seu arquivo de configuração do MySQL. Por exemplo, para habilitar todos os instrumentos de memória, adicione esta regra ao seu arquivo de configuração e reinicie o servidor:

   ```sql
   performance-schema-instrument='memory/%=COUNTED'
   ```

   Nota

   Ativar os instrumentos de memória no início garante que as alocações de memória que ocorrem no início sejam contadas.

   Após reiniciar o servidor, a coluna `ENABLED` da tabela `setup_instruments` do Gerenciamento de Desempenho deve exibir `YES` para os instrumentos de memória que você habilitou. A coluna `TIMED` na tabela `setup_instruments` é ignorada para instrumentos de memória porque as operações de memória não são temporizadas.

   ```sql
   mysql> SELECT * FROM performance_schema.setup_instruments
          WHERE NAME LIKE '%memory/innodb%';
   +-------------------------------------------+---------+-------+
   | NAME                                      | ENABLED | TIMED |
   +-------------------------------------------+---------+-------+
   | memory/innodb/adaptive hash index         | NO      | NO    |
   | memory/innodb/buf_buf_pool                | NO      | NO    |
   | memory/innodb/dict_stats_bg_recalc_pool_t | NO      | NO    |
   | memory/innodb/dict_stats_index_map_t      | NO      | NO    |
   | memory/innodb/dict_stats_n_diff_on_level  | NO      | NO    |
   | memory/innodb/other                       | NO      | NO    |
   | memory/innodb/row_log_buf                 | NO      | NO    |
   | memory/innodb/row_merge_sort              | NO      | NO    |
   | memory/innodb/std                         | NO      | NO    |
   | memory/innodb/trx_sys_t::rw_trx_ids       | NO      | NO    |
   ...
   ```

3. Pergunte dados do instrumento de memória. Neste exemplo, os dados do instrumento de memória são solicitados na tabela do Schema de Desempenho `memory_summary_global_by_event_name`, que resume os dados por `EVENT_NAME`. O `EVENT_NAME` é o nome do instrumento.

   A consulta a seguir retorna dados de memória para o pool de buffer do `InnoDB`. Para descrições de colunas, consulte a Seção 25.12.15.9, “Tabelas de Resumo de Memória”.

   ```sql
   mysql> SELECT * FROM performance_schema.memory_summary_global_by_event_name
          WHERE EVENT_NAME LIKE 'memory/innodb/buf_buf_pool'\G
                     EVENT_NAME: memory/innodb/buf_buf_pool
                    COUNT_ALLOC: 1
                     COUNT_FREE: 0
      SUM_NUMBER_OF_BYTES_ALLOC: 137428992
       SUM_NUMBER_OF_BYTES_FREE: 0
                 LOW_COUNT_USED: 0
             CURRENT_COUNT_USED: 1
                HIGH_COUNT_USED: 1
       LOW_NUMBER_OF_BYTES_USED: 0
   CURRENT_NUMBER_OF_BYTES_USED: 137428992
      HIGH_NUMBER_OF_BYTES_USED: 137428992
   ```

   Os mesmos dados subjacentes podem ser consultados usando a tabela do esquema `sys` `memory_global_by_current_bytes`, que mostra o uso atual da memória dentro do servidor globalmente, detalhado por tipo de alocação.

   ```sql
   mysql> SELECT * FROM sys.memory_global_by_current_bytes
          WHERE event_name LIKE 'memory/innodb/buf_buf_pool'\G
   *************************** 1. row ***************************
          event_name: memory/innodb/buf_buf_pool
       current_count: 1
       current_alloc: 131.06 MiB
   current_avg_alloc: 131.06 MiB
          high_count: 1
          high_alloc: 131.06 MiB
      high_avg_alloc: 131.06 MiB
   ```

   Esta consulta do esquema `sys` agrega a memória atualmente alocada (`current_alloc`) por área de código:

   ```sql
   mysql> SELECT SUBSTRING_INDEX(event_name,'/',2) AS
          code_area, sys.format_bytes(SUM(current_alloc))
          AS current_alloc
          FROM sys.x$memory_global_by_current_bytes
          GROUP BY SUBSTRING_INDEX(event_name,'/',2)
          ORDER BY SUM(current_alloc) DESC;
   +---------------------------+---------------+
   | code_area                 | current_alloc |
   +---------------------------+---------------+
   | memory/innodb             | 843.24 MiB    |
   | memory/performance_schema | 81.29 MiB     |
   | memory/mysys              | 8.20 MiB      |
   | memory/sql                | 2.47 MiB      |
   | memory/memory             | 174.01 KiB    |
   | memory/myisam             | 46.53 KiB     |
   | memory/blackhole          | 512 bytes     |
   | memory/federated          | 512 bytes     |
   | memory/csv                | 512 bytes     |
   | memory/vio                | 496 bytes     |
   +---------------------------+---------------+
   ```

   Para obter mais informações sobre o esquema `sys`, consulte o Capítulo 26, *Esquema MySQL sys*.
