#### 8.10.3.2 Opções SELECT do Query Cache

Nota

O query cache está obsoleto desde o MySQL 5.7.20 e foi removido no MySQL 8.0.

Duas opções relacionadas ao query cache podem ser especificadas em comandos `SELECT`:

* `SQL_CACHE`

  O resultado da Query é armazenado em cache se for "cacheável" (cacheable) e o valor da variável de sistema `query_cache_type` for `ON` ou `DEMAND`.

* `SQL_NO_CACHE`

  O servidor não utiliza o query cache. Ele não verifica o query cache para ver se o resultado já está em cache, nem armazena o resultado da Query em cache.

Exemplos:

```sql
SELECT SQL_CACHE id, name FROM customer;
SELECT SQL_NO_CACHE id, name FROM customer;
```