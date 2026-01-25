#### 26.4.3.6 As Views host_summary_by_statement_type e x$host_summary_by_statement_type

Essas views resumem informações sobre Statements executados, agrupados por Host e Statement Type. Por padrão, as linhas são ordenadas por Host e pela latência total (total latency) decrescente.

As views `host_summary_by_statement_type` e `x$host_summary_by_statement_type` possuem as seguintes colunas:

* `host`

  O Host a partir do qual o cliente se conectou. Linhas para as quais a coluna `HOST` na tabela subjacente do Performance Schema é `NULL` são consideradas para Background Threads e são reportadas com o nome de Host `background`.

* `statement`

  O componente final do nome do Statement event.

* `total`

  O número total de ocorrências do Statement event para o Host.

* `total_latency`

  O tempo de espera total das ocorrências cronometradas (timed occurrences) do Statement event para o Host.

* `max_latency`

  O tempo máximo de espera individual das ocorrências cronometradas do Statement event para o Host.

* `lock_latency`

  O tempo total de espera por Locks por ocorrências cronometradas do Statement event para o Host.

* `rows_sent`

  O número total de linhas retornadas (rows returned) pelas ocorrências do Statement event para o Host.

* `rows_examined`

  O número total de linhas lidas (rows examined) pelos Storage Engines nas ocorrências do Statement event para o Host.

* `rows_affected`

  O número total de linhas afetadas (rows affected) pelas ocorrências do Statement event para o Host.

* `full_scans`

  O número total de Full Table Scans pelas ocorrências do Statement event para o Host.