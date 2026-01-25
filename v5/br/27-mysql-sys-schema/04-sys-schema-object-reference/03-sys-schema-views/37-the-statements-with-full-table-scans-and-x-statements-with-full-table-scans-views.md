#### 26.4.3.37 As Views statements_with_full_table_scans e x$statements_with_full_table_scans

Essas views exibem instruções normalizadas que executaram full table scans. Por padrão, as linhas são ordenadas pela porcentagem decrescente do tempo gasto em um full scan e pela total latency decrescente.

As views `statements_with_full_table_scans` e `x$statements_with_full_table_scans` possuem estas colunas:

* `query`

  A string da instrução normalizada.

* `db`

  O Database padrão para a instrução, ou `NULL` se não houver um.

* `exec_count`

  O número total de vezes que a instrução foi executada.

* `total_latency`

  O tempo total de espera (wait time) dos eventos de instrução cronometrados para a instrução.

* `no_index_used_count`

  O número total de vezes que nenhum Index foi usado para realizar o scan da tabela.

* `no_good_index_used_count`

  O número total de vezes que nenhum Index bom foi usado para realizar o scan da tabela.

* `no_index_used_pct`

  A porcentagem do tempo em que nenhum Index foi usado para realizar o scan da tabela.

* `rows_sent`

  O número total de linhas retornadas da tabela.

* `rows_examined`

  O número total de linhas lidas do storage engine para a tabela.

* `rows_sent_avg`

  O número médio de linhas retornadas da tabela.

* `rows_examined_avg`

  O número médio de linhas lidas do storage engine para a tabela.

* `first_seen`

  O momento em que a instrução foi vista pela primeira vez.

* `last_seen`

  O momento em que a instrução foi vista mais recentemente.

* `digest`

  O digest da instrução.