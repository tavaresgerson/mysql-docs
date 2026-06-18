#### 8.10.3.2 Opções de cache de consulta SELECT

Nota

O cache de consultas é descontinuado a partir do MySQL 5.7.20 e é removido no MySQL 8.0.

Duas opções relacionadas ao cache de consultas podem ser especificadas em instruções `SELECT`:

- `SQL_CACHE`

  O resultado da consulta é armazenado em cache se for possível armazenar em cache e o valor da variável de sistema `query_cache_type` for `ON` ou `DEMAND`.

- `SQL_NO_CACHE`

  O servidor não usa o cache de consultas. Ele não verifica o cache de consultas para ver se o resultado já está em cache, nem o cacheia o resultado da consulta.

Exemplos:

```sql
SELECT SQL_CACHE id, name FROM customer;
SELECT SQL_NO_CACHE id, name FROM customer;
```
