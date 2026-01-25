#### 26.4.3.46 As Views user_summary_by_statement_type e x$user_summary_by_statement_type

Essas Views resumem informações sobre as *statements* executadas, agrupadas por usuário e tipo de *statement*. Por padrão, as linhas são ordenadas por usuário e *total latency* decrescente.

As Views `user_summary_by_statement_type` e `x$user_summary_by_statement_type` possuem as seguintes colunas:

* `user`

  O nome de usuário do cliente. As linhas para as quais a coluna `USER` na tabela subjacente do Performance Schema é `NULL` são consideradas de *background threads* e são reportadas com um nome de *host* de `background`.

* `statement`

  O componente final do nome do evento de *statement*.

* `total`

  O número total de ocorrências do evento de *statement* para o usuário.

* `total_latency`

  O tempo total de espera de ocorrências cronometradas do evento de *statement* para o usuário.

* `max_latency`

  O tempo máximo único de espera de ocorrências cronometradas do evento de *statement* para o usuário.

* `lock_latency`

  O tempo total de espera por *Locks* em ocorrências cronometradas do evento de *statement* para o usuário.

* `rows_sent`

  O número total de linhas retornadas por ocorrências do evento de *statement* para o usuário.

* `rows_examined`

  O número total de linhas lidas dos *storage engines* por ocorrências do evento de *statement* para o usuário.

* `rows_affected`

  O número total de linhas afetadas por ocorrências do evento de *statement* para o usuário.

* `full_scans`

  O número total de *full table scans* por ocorrências do evento de *statement* para o usuário.