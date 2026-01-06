#### 26.4.3.34 A visualização session\_ssl\_status

Para cada conexão, essa visualização exibe a versão SSL, o cifrador e o número de sessões SSL reutilizadas.

A visualização `session_ssl_status` tem essas colunas:

- `thread_id`

  O ID do fio para a conexão.

- `ssl_version`

  A versão do SSL usada para a conexão.

- `ssl_cipher`

  O algoritmo de criptografia SSL usado para a conexão.

- `ssl_sessions_reused`

  O número de sessões SSL reutilizadas para a conexão.
