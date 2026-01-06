### 8.14.4 Estados de threads do cache de consultas

Estes estados de thread estão associados ao cache de consultas (consulte a Seção 8.10.3, “O Cache de Consultas do MySQL”).

- `verificando privilégios na consulta armazenada em cache`

  O servidor está verificando se o usuário tem privilégios para acessar um resultado de consulta armazenado em cache.

- `verificar o cache de consultas do banco de dados`

  O servidor está verificando se a consulta atual está presente no cache de consultas.

- `desativar entradas do cache de consultas`

  As entradas do cache de consultas estão sendo marcadas como inválidas porque as tabelas subjacentes foram alteradas.

- `enviar o resultado armazenado em cache para o cliente`

  O servidor está recebendo o resultado de uma consulta do cache de consultas e enviando-o ao cliente.

- "armazenar resultado no cache de consulta"

  O servidor está armazenando o resultado de uma consulta no cache de consultas.

- `Aguardando bloqueio do cache de consulta`

  Esse estado ocorre enquanto uma sessão está aguardando para obter o bloqueio do cache de consulta. Isso pode acontecer para qualquer declaração que precise realizar alguma operação no cache de consulta, como uma `INSERT` ou `DELETE` que invalida o cache de consulta, uma `SELECT` que procura uma entrada armazenada no cache, `RESET QUERY CACHE`, e assim por diante.
