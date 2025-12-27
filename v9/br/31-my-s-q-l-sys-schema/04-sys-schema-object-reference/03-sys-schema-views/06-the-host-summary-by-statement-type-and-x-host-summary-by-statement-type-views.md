#### 30.4.3.6 Visões `host_summary_by_statement_type` e `x$host_summary_by_statement_type`

Essas visões resumem informações sobre declarações executadas, agrupadas por host e tipo de declaração. Por padrão, as linhas são ordenadas por host e latência total em ordem decrescente.

As visões `host_summary_by_statement_type` e `x$host_summary_by_statement_type` têm as seguintes colunas:

* `host`

  O host a partir do qual o cliente se conectou. As linhas para as quais a coluna `HOST` na tabela subjacente do Schema de Desempenho é `NULL` são assumidas como pertencentes a threads de segundo plano e são relatadas com o nome do host `background`.

* `statement`

  O componente final do nome do evento da declaração.

* `total`

  O número total de ocorrências do evento da declaração para o host.

* `total_latency`

  O tempo total de espera das ocorrências temporizadas do evento da declaração para o host.

* `max_latency`

  O tempo máximo de espera de uma única ocorrência temporizada do evento da declaração para o host.

* `lock_latency`

  O tempo total de espera por bloqueios das ocorrências temporizadas do evento da declaração para o host.

* `cpu_latency`

  O tempo gasto no CPU para o thread atual.

* `rows_sent`

  O número total de linhas devolvidas por ocorrências do evento da declaração para o host.

* `rows_examined`

  O número total de linhas lidas dos motores de armazenamento por ocorrências do evento da declaração para o host.

* `rows_affected`

  O número total de linhas afetadas por ocorrências do evento da declaração para o host.

* `full_scans`

  O número total de varreduras completas de tabela por ocorrências do evento da declaração para o host.