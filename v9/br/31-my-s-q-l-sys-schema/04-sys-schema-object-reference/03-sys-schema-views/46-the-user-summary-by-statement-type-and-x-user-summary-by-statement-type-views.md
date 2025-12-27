#### 30.4.3.46 Resumo de usuários por tipo de declaração e x$Resumo de usuários por tipo de declaração de visualização

Esses visualizações resumem informações sobre declarações executadas, agrupadas por usuário e tipo de declaração. Por padrão, as linhas são ordenadas por usuário e latência total em ordem decrescente.

Os visualizações `user_summary_by_statement_type` e `x$user_summary_by_statement_type` têm essas colunas:

* `user`

  O nome do usuário do cliente. As linhas para as quais a coluna `USER` na tabela subjacente do Schema de Desempenho é `NULL` são assumidas como pertencentes a threads de plano de fundo e são relatadas com o nome do host `background`.

* `statement`

  O componente final do nome do evento da declaração.

* `total`

  O número total de ocorrências do evento da declaração para o usuário.

* `total_latency`

  O tempo total de espera das ocorrências temporizadas do evento da declaração para o usuário.

* `max_latency`

  O tempo máximo de espera de uma única ocorrência temporizada do evento da declaração para o usuário.

* `lock_latency`

  O tempo total de espera por bloqueios das ocorrências temporizadas do evento da declaração para o usuário.

* `cpu_latency`

  O tempo gasto no CPU para o thread atual.

* `rows_sent`

  O número total de linhas retornadas por ocorrências do evento da declaração para o usuário.

* `rows_examined`

  O número total de linhas lidas dos motores de armazenamento por ocorrências do evento da declaração para o usuário.

* `rows_affected`

  O número total de linhas afetadas por ocorrências do evento da declaração para o usuário.

* `full_scans`

  O número total de varreduras completas de tabela por ocorrências do evento da declaração para o usuário.