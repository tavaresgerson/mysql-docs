#### 30.4.3.4 Visões `host_summary_by_stages` e `x$host_summary_by_stages`

Essas visualizações resumem os estágios da declaração, agrupados por host. Por padrão, as linhas são ordenadas por host e por latência total em ordem decrescente.

As visualizações `host_summary_by_stages` e `x$host_summary_by_stages` têm as seguintes colunas:

* `host`

  O host a partir do qual o cliente se conectou. As linhas para as quais a coluna `HOST` na tabela subjacente do Schema de Desempenho é `NULL` são assumidas como pertencentes a threads de segundo plano e são relatadas com o nome do host `background`.

* `event_name`

  O nome do evento do estágio.

* `total`

  O número total de ocorrências do evento do estágio para o host.

* `total_latency`

  O tempo de espera total das ocorrências temporizadas do evento do estágio para o host.

* `avg_latency`

  O tempo de espera médio por ocorrência temporizada do evento do estágio para o host.