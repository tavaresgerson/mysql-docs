### 8.14.4 Estados de Thread do Query Cache

Estes estados de Thread estão associados ao Query Cache (consulte Seção 8.10.3, “O MySQL Query Cache”).

* `checking privileges on cached query`

  O server está verificando se o usuário tem privileges para acessar um resultado de Query em cache.

* `checking query cache for query`

  O server está verificando se a Query atual está presente no Query Cache.

* `invalidating query cache entries`

  Entradas do Query Cache estão sendo marcadas como inválidas porque as tables subjacentes foram alteradas.

* `sending cached result to client`

  O server está pegando o resultado de uma Query do Query Cache e enviando-o para o client.

* `storing result in query cache`

  O server está armazenando o resultado de uma Query no Query Cache.

* `Waiting for query cache lock`

  Este estado ocorre enquanto uma session está esperando para obter o Query Cache Lock. Isso pode acontecer para qualquer statement que precise executar alguma operação no Query Cache, como um `INSERT` ou `DELETE` que invalida o Query Cache, um `SELECT` que procura por uma entrada em cache, `RESET QUERY CACHE`, e assim por diante.