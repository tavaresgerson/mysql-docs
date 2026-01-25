#### 26.4.3.4 As Views host_summary_by_stages e x$host_summary_by_stages

Essas views resumem os *stage*s de *statement*s, agrupados por *host*. Por padrão, as linhas são classificadas por *host* e pela *total latency* decrescente.

As views `host_summary_by_stages` e `x$host_summary_by_stages` possuem as seguintes colunas:

* `host`

  O *host* a partir do qual o cliente se conectou. Linhas nas quais a coluna `HOST` na tabela subjacente do Performance Schema é `NULL` são assumidas como sendo para *background threads* e são reportadas com um nome de *host* de `background`.

* `event_name`

  O nome do *stage event*.

* `total`

  O número total de ocorrências do *stage event* para o *host*.

* `total_latency`

  O tempo de espera total das ocorrências cronometradas (*timed occurrences*) do *stage event* para o *host*.

* `avg_latency`

  O tempo de espera médio por ocorrência cronometrada (*timed occurrence*) do *stage event* para o *host*.