#### 26.4.3.34 A View session_ssl_status

Para cada conexão, esta view exibe a versão SSL, o cipher, e a contagem de sessões SSL reutilizadas.

A view `session_ssl_status` possui estas colunas:

* `thread_id`

  O thread ID para a conexão.

* `ssl_version`

  A versão de SSL usada para a conexão.

* `ssl_cipher`

  O cipher SSL usado para a conexão.

* `ssl_sessions_reused`

  O número de sessões SSL reutilizadas para a conexão.