#### 26.4.3.36 As Views statements_with_errors_or_warnings e x$statements_with_errors_or_warnings

Estas Views exibem statements normalizadas que produziram errors ou warnings. Por padrão, as linhas são ordenadas pela contagem descendente de errors e warnings.

As Views `statements_with_errors_or_warnings` e `x$statements_with_errors_or_warnings` possuem estas colunas:

* `query`

  A string do statement normalizado.

* `db`

  O Database padrão para o statement, ou `NULL` se não houver nenhum.

* `exec_count`

  O número total de vezes que o statement foi executado.

* `errors`

  O número total de errors produzidos pelas ocorrências do statement.

* `error_pct`

  A porcentagem de ocorrências do statement que produziram errors.

* `warnings`

  O número total de warnings produzidos pelas ocorrências do statement.

* `warning_pct`

  A porcentagem de ocorrências do statement que produziram warnings.

* `first_seen`

  O momento em que o statement foi visto pela primeira vez.

* `last_seen`

  O momento em que o statement foi visto mais recentemente.

* `digest`

  O Digest do statement.