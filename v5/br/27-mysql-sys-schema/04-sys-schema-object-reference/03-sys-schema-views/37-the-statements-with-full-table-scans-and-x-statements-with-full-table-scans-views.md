#### 26.4.3.37 As declarações com varreduras completas da tabela e as visualizações x$declarativas_com_varreduras_completos_da_tabela

Essas visualizações exibem declarações normalizadas que realizaram varreduras completas da tabela. Por padrão, as linhas são ordenadas por porcentagem decrescente de tempo em que uma varredura completa foi realizada e latência total decrescente.

As views `statements_with_full_table_scans` e `x$statements_with_full_table_scans` possuem essas colunas:

- `consulta`

  A string de declaração normalizada.

- `db`

  O banco de dados padrão para a declaração, ou `NULL` se não houver nenhum.

- `exec_count`

  O número total de vezes que a declaração foi executada.

- `total_latency`

  O tempo total de espera de eventos de declaração cronometrados para a declaração.

- `no_index_used_count`

  O número total de vezes em que não foi usado um índice para pesquisar a tabela.

- `no_good_index_used_count`

  O número total de vezes em que não foi usado um bom índice para escanear a tabela.

- `no_index_used_pct`

  A porcentagem do tempo em que não foi usado um índice para pesquisar a tabela.

- `rows_sent`

  O número total de linhas devolvidas da tabela.

- `rows_examined`

  O número total de linhas lidas do mecanismo de armazenamento para a tabela.

- `rows_sent_avg`

  O número médio de linhas devolvidas da tabela.

- `rows_examined_avg`

  O número médio de linhas lidas do mecanismo de armazenamento para a tabela.

- `primeiro_avistado`

  O momento em que a declaração foi vista pela primeira vez.

- `última_visualização`

  O horário em que a declaração foi vista pela última vez.

- `digest`

  O resumo da declaração.
