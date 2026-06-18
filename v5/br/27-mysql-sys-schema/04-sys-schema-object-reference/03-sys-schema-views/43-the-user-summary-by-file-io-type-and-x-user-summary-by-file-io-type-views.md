#### 26.4.3.43 As Views user_summary_by_file_io_type e x$user_summary_by_file_io_type

Essas views resumem o I/O de arquivo (File I/O), agrupado por user e tipo de evento. Por padrão, as linhas são ordenadas por user e total latency descendente.

As views `user_summary_by_file_io_type` e `x$user_summary_by_file_io_type` possuem as seguintes colunas:

* `user`

  O nome do user cliente. Linhas em que a coluna `USER` na tabela subjacente do Performance Schema é `NULL` são presumidas como pertencentes a background threads e são reportadas com um host name de `background`.

* `event_name`

  O nome do evento de I/O de arquivo.

* `total`

  O número total de ocorrências do evento de I/O de arquivo para o user.

* `latency`

  O tempo de espera total (total wait time) de ocorrências cronometradas do evento de I/O de arquivo para o user.

* `max_latency`

  O tempo máximo de espera único (maximum single wait time) de ocorrências cronometradas do evento de I/O de arquivo para o user.