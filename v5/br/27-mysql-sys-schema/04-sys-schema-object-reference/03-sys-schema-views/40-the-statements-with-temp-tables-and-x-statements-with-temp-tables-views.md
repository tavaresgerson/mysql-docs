#### 26.4.3.40 As Views statements_with_temp_tables e x$statements_with_temp_tables

Essas views listam statements normalizados que usaram temporary tables. Por padrão, as linhas são ordenadas pelo número decrescente de temporary tables em disco utilizadas e pelo número decrescente de temporary tables em memória utilizadas.

As views `statements_with_temp_tables` e `x$statements_with_temp_tables` possuem estas colunas:

* `query`

  A string do statement normalizado.

* `db`

  O Database padrão para o statement, ou `NULL` se não houver nenhum.

* `exec_count`

  O número total de vezes que o statement foi executado.

* `total_latency`

  O tempo total de espera (wait time) de ocorrências cronometradas do statement.

* `memory_tmp_tables`

  O número total de temporary tables internas em memória criadas pelas ocorrências do statement.

* `disk_tmp_tables`

  O número total de temporary tables internas em disco criadas pelas ocorrências do statement.

* `avg_tmp_tables_per_query`

  O número médio de temporary tables internas criadas por ocorrência do statement.

* `tmp_tables_to_disk_pct`

  A porcentagem de temporary tables internas em memória que foram convertidas para tabelas em disco.

* `first_seen`

  O horário em que o statement foi visto pela primeira vez.

* `last_seen`

  O horário em que o statement foi visto mais recentemente.

* `digest`

  O statement digest.