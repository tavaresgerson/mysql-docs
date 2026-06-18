#### 30.4.3.36 As visualizações statements\_with\_errors\_or\_warnings e x$statements\_with\_errors\_or\_warnings

Essas visualizações exibem declarações normalizadas que produziram erros ou avisos. Por padrão, as linhas são ordenadas por contagem descendente de erros e avisos.

As visualizações `statements_with_errors_or_warnings` e `x$statements_with_errors_or_warnings` possuem essas colunas:

- `query`

  A string de declaração normalizada.

- `db`

  O banco de dados padrão para a declaração, ou `NULL` se não houver nenhum.

- `exec_count`

  O número total de vezes que a declaração foi executada.

- `errors`

  O número total de erros produzidos por ocorrências da declaração.

- `error_pct`

  A porcentagem de ocorrências de declarações que produziram erros.

- `warnings`

  O número total de avisos gerados por ocorrências da declaração.

- `warning_pct`

  A porcentagem de ocorrências de declarações que produziram avisos.

- `first_seen`

  O momento em que a declaração foi vista pela primeira vez.

- `last_seen`

  O horário em que a declaração foi vista pela última vez.

- `digest`

  O resumo da declaração.
