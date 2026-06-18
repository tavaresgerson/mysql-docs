#### 26.4.3.42 As Views user_summary_by_file_io e x$user_summary_by_file_io

Essas views resumem o file I/O, agrupado por user. Por padrão, as linhas são ordenadas pela latência total de file I/O em ordem decrescente.

As views `user_summary_by_file_io` e `x$user_summary_by_file_io` possuem as seguintes colunas:

* `user`

  O nome do user cliente. As linhas para as quais a coluna `USER` na tabela subjacente do Performance Schema é `NULL` são consideradas como pertencentes a background threads e são reportadas com um host name de `background`.

* `ios`

  O número total de eventos de file I/O para o user.

* `io_latency`

  O tempo total de espera de eventos cronometrados de file I/O para o user.