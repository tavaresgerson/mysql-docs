#### 26.4.3.45 As Views user_summary_by_statement_latency e x$user_summary_by_statement_latency

Essas Views resumem as estatísticas gerais de *statements*, agrupadas por *user*. Por padrão, as linhas são ordenadas pela *total latency* decrescente.

As Views `user_summary_by_statement_latency` e `x$user_summary_by_statement_latency` possuem estas colunas:

* `user`

  O nome do *user* cliente. Linhas para as quais a coluna `USER` na tabela subjacente do *Performance Schema* é `NULL` são presumidas como sendo de *background threads* e são reportadas com um nome de *host* de `background`.

* `total`

  O número total de *statements* para o *user*.

* `total_latency`

  O tempo total de espera (*wait time*) de *statements* cronometrados para o *user*.

* `max_latency`

  O tempo máximo de espera (*wait time*) única de *statements* cronometrados para o *user*.

* `lock_latency`

  O tempo total de espera por *Locks* (*waiting for Locks*) por *statements* cronometrados para o *user*.

* `rows_sent`

  O número total de *rows* retornadas pelos *statements* para o *user*.

* `rows_examined`

  O número total de *rows* lidas dos *storage engines* pelos *statements* para o *user*.

* `rows_affected`

  O número total de *rows* afetadas pelos *statements* para o *user*.

* `full_scans`

  O número total de *full table scans* (varreduras completas de tabela) pelos *statements* para o *user*.