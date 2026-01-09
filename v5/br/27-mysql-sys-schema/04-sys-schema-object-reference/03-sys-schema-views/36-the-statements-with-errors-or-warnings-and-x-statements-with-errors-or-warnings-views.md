#### 26.4.3.36 As visualizações statements_with_errors_or_warnings e x$statements_with_errors_or_warnings

Essas visualizações exibem declarações normalizadas que produziram erros ou avisos. Por padrão, as linhas são ordenadas por contagem descendente de erros e avisos.

As views `statements_with_errors_or_warnings` e `x$statements_with_errors_or_warnings` possuem essas colunas:

- `consulta`

  A string de declaração normalizada.

- `db`

  O banco de dados padrão para a declaração, ou `NULL` se não houver nenhum.

- `exec_count`

  O número total de vezes que a declaração foi executada.

- `erros`

  O número total de erros produzidos por ocorrências da declaração.

- `error_pct`

  A porcentagem de ocorrências de declarações que produziram erros.

- `avaliações de risco`

  O número total de avisos gerados por ocorrências da declaração.

- `warning_pct`

  A porcentagem de ocorrências de declarações que produziram avisos.

- `primeiro_avistado`

  O momento em que a declaração foi vista pela primeira vez.

- `última_visualização`

  O horário em que a declaração foi vista pela última vez.

- `digest`

  O resumo da declaração.
