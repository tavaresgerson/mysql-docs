#### 26.4.3.41 As Views user_summary e x$user_summary

Essas Views resumem a atividade de statement, I/O de arquivo e Connections, agrupadas por usuário. Por padrão, as linhas são ordenadas pela Latency total descendente.

As Views `user_summary` e `x$user_summary` possuem estas colunas:

* `user`

  O nome do usuário cliente. Linhas para as quais a coluna `USER` na tabela subjacente do Performance Schema é `NULL` são assumidas como sendo para Threads em background e são reportadas com um nome de host de `background`.

* `statements`

  O número total de statements para o usuário.

* `statement_latency`

  O tempo de espera total de statements cronometrados para o usuário.

* `statement_avg_latency`

  O tempo de espera médio por statement cronometrado para o usuário.

* `table_scans`

  O número total de Table Scans para o usuário.

* `file_ios`

  O número total de eventos de I/O de arquivo para o usuário.

* `file_io_latency`

  O tempo de espera total de eventos de I/O de arquivo cronometrados para o usuário.

* `current_connections`

  O número atual de Connections para o usuário.

* `total_connections`

  O número total de Connections para o usuário.

* `unique_hosts`

  O número de hosts distintos dos quais as Connections para o usuário se originaram.

* `current_memory`

  A quantidade atual de memória alocada para o usuário.

* `total_memory_allocated`

  A quantidade total de memória alocada para o usuário.