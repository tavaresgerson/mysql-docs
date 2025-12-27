#### 10.12.3.2 Monitoramento do Uso de Memória do MySQL

O exemplo a seguir demonstra como usar o Gerenciamento de Desempenho e o esquema sys para monitorar o uso de memória do MySQL.

A maioria das instrumentações de memória do Gerenciamento de Desempenho está desabilitada por padrão. As instrumentações podem ser habilitadas atualizando a coluna `ENABLED` da tabela `setup_instruments` do Gerenciamento de Desempenho. As instrumentações de memória têm nomes na forma `memory/code_area/instrument_name`, onde *`code_area`* é um valor como `sql` ou `innodb`, e *`instrument_name`* é o detalhe do instrumento.

1. Para visualizar as instrumentações de memória do MySQL disponíveis, execute uma consulta na tabela `setup_instruments` do Gerenciamento de Desempenho. A consulta a seguir retorna centenas de instrumentações de memória para todas as áreas de código.

   ```
   mysql> SELECT * FROM performance_schema.setup_instruments
          WHERE NAME LIKE '%memory%';
   ```

   Você pode restringir os resultados especificando uma área de código. Por exemplo, você pode limitar os resultados às instrumentações de memória `InnoDB` especificando `innodb` como a área de código.

   ```
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

2. Para habilitar as instrumentações de memória, adicione uma regra `performance-schema-instrument` ao seu arquivo de configuração do MySQL. Por exemplo, para habilitar todas as instrumentações de memória, adicione esta regra ao seu arquivo de configuração e reinicie o servidor:

   ```
   performance-schema-instrument='memory/%=COUNTED'
   ```

   Observação

   Habilitar as instrumentações de memória no início garante que as alocações de memória que ocorrem no início sejam contadas.

   Após reiniciar o servidor, a coluna `ENABLED` da tabela `setup_instruments` do Gerenciamento de Desempenho deve exibir `YES` para as instrumentações de memória que você habilitou. A coluna `TIMED` na tabela `setup_instruments` é ignorada para as instrumentações de memória porque as operações de memória não são temporizadas.

   ```
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

3. Consultar dados do instrumento de memória. Neste exemplo, os dados do instrumento de memória são consultados na tabela do Schema de Desempenho `memory_summary_global_by_event_name`, que resume os dados por `EVENT_NAME`. O `EVENT_NAME` é o nome do instrumento.

   A seguinte consulta retorna dados de memória para o pool de buffers `InnoDB`. Para descrições de colunas, consulte a Seção 29.12.20.10, “Tabelas de Resumo de Memória”.

   ```
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

   Os mesmos dados subjacentes podem ser consultados usando a tabela do esquema `sys` `memory_global_by_current_bytes`, que mostra o uso atual de memória dentro do servidor globalmente, detalhado por tipo de alocação.

   ```
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

   ```
   mysql> SELECT SUBSTRING_INDEX(event_name,'/',2) AS
          code_area, FORMAT_BYTES(SUM(current_alloc))
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

   Para mais informações sobre o esquema `sys`, consulte o Capítulo 30, *MySQL sys Schema*.