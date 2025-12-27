#### 30.4.3.34 A visualização `session_ssl_status`

Para cada conexão, essa visualização exibe a versão SSL, o algoritmo e o número de sessões SSL reutilizadas.

A visualização `session_ssl_status` tem as seguintes colunas:

* `thread_id`

  O ID do thread para a conexão.

* `ssl_version`

  A versão SSL usada para a conexão.

* `ssl_cipher`

  O algoritmo SSL usado para a conexão.

* `ssl_sessions_reused`

  O número de sessões SSL reutilizadas para a conexão.