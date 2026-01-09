#### 30.4.3.42 Visitas `user_summary_by_file_io` e `x$user_summary_by_file_io`

Essas visualizações resumem o I/O de arquivos, agrupados por usuário. Por padrão, as linhas são ordenadas em ordem decrescente de latência total de I/O de arquivos.

As visualizações `user_summary_by_file_io` e `x$user_summary_by_file_io` têm essas colunas:

* `user`

  O nome do usuário do cliente. As linhas para as quais a coluna `USER` na tabela subjacente do Schema de Desempenho é `NULL` são assumidas como pertencentes a threads de segundo plano e são relatadas com o nome do host `background`.

* `ios`

  O número total de eventos de I/O de arquivos para o usuário.

* `io_latency`

  O tempo total de espera dos eventos de I/O de arquivos com temporizador para o usuário.