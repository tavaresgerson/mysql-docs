#### 30.4.3.37 Consultas com tabelas inteiras e vistas x$consultas com tabelas inteiras

Essas vistas exibem consultas normalizadas que realizaram varreduras completas de tabela. Por padrão, as linhas são ordenadas por porcentagem decrescente de tempo em que uma varredura completa foi realizada e por latência total decrescente.

As vistas `consultas_com_tabelas_inteiras` e `x$consultas_com_tabelas_inteiras` têm as seguintes colunas:

* `query`

  A string normalizada da consulta.

* `db`

  O banco de dados padrão para a consulta, ou `NULL` se não houver nenhum.

* `exec_count`

  O número total de vezes que a consulta foi executada.

* `total_latency`

  O tempo total de espera dos eventos de consulta com temporizador para a consulta.

* `no_index_used_count`

  O número total de vezes em que nenhum índice foi usado para varredura da tabela.

* `no_good_index_used_count`

  O número total de vezes em que nenhum bom índice foi usado para varredura da tabela.

* `no_index_used_pct`

  A porcentagem do tempo em que nenhum índice foi usado para varredura da tabela.

* `rows_sent`

  O número total de linhas retornadas da tabela.

* `rows_examined`

  O número total de linhas lidas do mecanismo de armazenamento para a tabela.

* `rows_sent_avg`

  O número médio de linhas retornadas da tabela.

* `rows_examined_avg`

  O número médio de linhas lidas do mecanismo de armazenamento para a tabela.

* `first_seen`

  O momento em que a consulta foi vista pela primeira vez.

* `last_seen`

  O momento em que a consulta foi vista pela última vez.

* `digest`

  O digest da consulta.