#### 30.4.3.44 As visualizações user\_summary\_by\_stages e x$user\_summary\_by\_stages

Essas visualizações resumem as etapas, agrupadas por usuário. Por padrão, as linhas são ordenadas por usuário e pela latência total da etapa em ordem decrescente.

As visualizações `user_summary_by_stages` e `x$user_summary_by_stages` possuem essas colunas:

- `user`

  O nome de usuário do cliente. As linhas para as quais a coluna `USER` na tabela subjacente do Schema de Desempenho é `NULL` são assumidas para serem para threads de segundo plano e são relatadas com um nome de host de `background`.

- `event_name`

  O nome do evento em palco.

- `total`

  O número total de ocorrências do evento de estágio para o usuário.

- `total_latency`

  O tempo total de espera de eventos cronometrados do evento em andamento para o usuário.

- `avg_latency`

  O tempo médio de espera por ocorrência cronometrada do evento em fase para o usuário.
