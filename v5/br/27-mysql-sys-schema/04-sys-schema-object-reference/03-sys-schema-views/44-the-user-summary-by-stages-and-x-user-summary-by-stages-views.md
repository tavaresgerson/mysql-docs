#### 26.4.3.44 As Views user_summary_by_stages e x$user_summary_by_stages

Estas views resumem os stages, agrupados por user. Por padrão, as linhas são ordenadas por user e total stage latency decrescente.

As views `user_summary_by_stages` e `x$user_summary_by_stages` possuem estas colunas:

* `user`

  O nome do user cliente. As linhas para as quais a coluna `USER` na tabela Performance Schema subjacente é `NULL` são assumidas como sendo para threads de background e são reportadas com um nome de host de `background`.

* `event_name`

  O nome do evento de stage.

* `total`

  O número total de ocorrências do evento de stage para o user.

* `total_latency`

  O tempo total de espera das ocorrências cronometradas (timed occurrences) do evento de stage para o user.

* `avg_latency`

  O tempo médio de espera por ocorrência cronometrada (timed occurrence) do evento de stage para o user.