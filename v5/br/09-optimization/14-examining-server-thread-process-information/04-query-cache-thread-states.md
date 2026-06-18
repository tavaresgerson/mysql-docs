### 8.14.4 Estados de threads do cache de consultas

Estes estados de thread estão associados ao cache de consultas (consulte a Seção 8.10.3, “O Cache de Consultas do MySQL”).

* `checking privileges on cached query`

  O servidor está verificando se o usuário tem privilégios para acessar um resultado de consulta armazenado em cache.

* `checking query cache for query`

  O servidor está verificando se a consulta atual está presente no cache de consultas.

* `invalidating query cache entries`

  As entradas do cache de consultas estão sendo marcadas como inválidas porque as tabelas subjacentes foram alteradas.

* `sending cached result to client`

  O servidor está recebendo o resultado de uma consulta do cache de consultas e enviando-o ao cliente.

* `storing result in query cache`

  O servidor está armazenando o resultado de uma consulta no cache de consultas.

* `Waiting for query cache lock`

  Esse estado ocorre enquanto uma sessão está aguardando para obter o bloqueio do cache de consulta. Isso pode acontecer para qualquer declaração que precise realizar alguma operação no cache de consulta, como uma `INSERT` ou `DELETE` que invalida o cache de consulta, uma `SELECT` que procura uma entrada armazenada no cache, `RESET QUERY CACHE`, e assim por diante.
