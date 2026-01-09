#### 26.4.3.43 As visualizações user_summary_by_file_io_type e x$user_summary_by_file_io_type do usuário

Essas visualizações resumem o acesso e a gravação de arquivos, agrupados por usuário e tipo de evento. Por padrão, as linhas são ordenadas por usuário e por latência total decrescente.

As views `user_summary_by_file_io_type` e `x$user_summary_by_file_io_type` possuem essas colunas:

- `usuário`

  O nome de usuário do cliente. As linhas para as quais a coluna `USER` na tabela subjacente do Schema de Desempenho é `NULL` são assumidas como pertencentes a threads de segundo plano e são relatadas com o nome do host `background`.

- `nome_do_evento`

  O nome do evento de E/S do arquivo.

- `total`

  O número total de ocorrências do evento de E/S de arquivo para o usuário.

- latência

  O tempo total de espera de ocorrências temporizadas do evento de E/S do arquivo para o usuário.

- `max_latency`

  O tempo de espera máximo de uma única ocorrência temporizada do evento de E/S do arquivo para o usuário.
