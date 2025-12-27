#### 30.4.3.40 Visitas com tabelas temporárias e x$visitas com tabelas temporárias

Essas visitas listam declarações normalizadas que usaram tabelas temporárias. Por padrão, as linhas são ordenadas por número decrescente de tabelas temporárias em disco usadas e número decrescente de tabelas temporárias em memória usadas.

As vistas `statements_with_temp_tables` e `x$statements_with_temp_tables` têm essas colunas:

* `query`

  A string de declaração normalizada.

* `db`

  O banco de dados padrão para a declaração, ou `NULL` se não houver nenhum.

* `exec_count`

  O número total de vezes que a declaração foi executada.

* `total_latency`

  O tempo total de espera das ocorrências temporizadas da declaração.

* `memory_tmp_tables`

  O número total de tabelas temporárias internas em memória criadas por ocorrências da declaração.

* `disk_tmp_tables`

  O número total de tabelas temporárias internas em disco criadas por ocorrências da declaração.

* `avg_tmp_tables_per_query`

  O número médio de tabelas temporárias internas criadas por ocorrência da declaração.

* `tmp_tables_to_disk_pct`

  A porcentagem de tabelas temporárias internas em memória que foram convertidas em tabelas em disco.

* `first_seen`

  O momento em que a declaração foi vista pela primeira vez.

* `last_seen`

  O momento em que a declaração foi vista pela última vez.

* `digest`

  O digest da declaração.