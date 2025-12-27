#### 30.4.3.36 Visualizações de declarações com erros ou avisos e x$visualizações de declarações com erros ou avisos

Essas visualizações exibem declarações normalizadas que produziram erros ou avisos. Por padrão, as linhas são ordenadas em ordem decrescente de contagem de erros e avisos.

As visualizações `declaracao_com_erros_ou_avisos` e `x$declaracao_com_erros_ou_avisos` têm essas colunas:

* `query`

  A string normalizada da declaração.

* `db`

  O banco de dados padrão para a declaração, ou `NULL` se não houver nenhum.

* `exec_count`

  O número total de vezes que a declaração foi executada.

* `errors`

  O número total de erros produzidos por ocorrências da declaração.

* `error_pct`

  A porcentagem de ocorrências da declaração que produziram erros.

* `warnings`

  O número total de avisos produzidos por ocorrências da declaração.

* `warning_pct`

  A porcentagem de ocorrências da declaração que produziram avisos.

* `first_seen`

  O momento em que a declaração foi vista pela primeira vez.

* `last_seen`

  O momento em que a declaração foi vista pela última vez.

* `digest`

  O digest da declaração.