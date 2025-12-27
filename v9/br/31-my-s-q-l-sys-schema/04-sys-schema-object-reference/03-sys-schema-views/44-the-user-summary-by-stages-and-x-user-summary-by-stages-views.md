#### 30.4.3.44 Resumo de usuário por estágios e x$user_summary_by_stages Visualizações

Esses visualizações resumem os estágios, agrupados por usuário. Por padrão, as linhas são ordenadas por usuário e por latência total do estágio em ordem decrescente.

Os visualizações `user_summary_by_stages` e `x$user_summary_by_stages` têm essas colunas:

* `user`

  O nome do usuário do cliente. As linhas para as quais a coluna `USER` na tabela subjacente do Schema de Desempenho é `NULL` são assumidas como pertencentes a threads de segundo plano e são relatadas com o nome do host `background`.

* `event_name`

  O nome do evento do estágio.

* `total`

  O número total de ocorrências do evento do estágio para o usuário.

* `total_latency`

  O tempo de espera total das ocorrências temporizadas do evento do estágio para o usuário.

* `avg_latency`

  O tempo de espera médio por ocorrência temporizada do evento do estágio para o usuário.