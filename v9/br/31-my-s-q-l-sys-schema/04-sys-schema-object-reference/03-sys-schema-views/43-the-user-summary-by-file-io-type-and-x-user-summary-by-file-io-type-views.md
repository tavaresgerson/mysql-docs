#### 30.4.3.43 Resumo de usuário por arquivo e tipo de I/O e x$Resumo de usuário por arquivo e tipo de I/O

Esses resumos resumem o I/O de arquivos, agrupados por usuário e tipo de evento. Por padrão, as linhas são ordenadas por usuário e latência total em ordem decrescente.

Os resumos `user_summary_by_file_io_type` e `x$user_summary_by_file_io_type` têm essas colunas:

* `user`

  O nome do usuário do cliente. As linhas para as quais a coluna `USER` na tabela subjacente do Schema de Desempenho é `NULL` são assumidas como pertencentes a threads de segundo plano e são relatadas com o nome do host `background`.

* `event_name`

  O nome do evento de I/O de arquivo.

* `total`

  O número total de ocorrências do evento de I/O de arquivo para o usuário.

* `latency`

  O tempo total de espera das ocorrências temporizadas do evento de I/O de arquivo para o usuário.

* `max_latency`

  O tempo de espera máximo de uma única ocorrência temporizada do evento de I/O de arquivo para o usuário.