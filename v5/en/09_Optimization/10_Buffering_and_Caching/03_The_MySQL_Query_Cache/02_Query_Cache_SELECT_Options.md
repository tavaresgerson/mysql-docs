#### 8.10.3.2 Query Cache SELECT Options

Note

The query cache is deprecated as of MySQL 5.7.20, and is
removed in MySQL 8.0.

Two query cache-related options may be specified in
[`SELECT`](select.html "13.2.9 SELECT Statement") statements:

* `SQL_CACHE`

  The query result is cached if it is cacheable and the
  value of the
  [`query_cache_type`](server-system-variables.html#sysvar_query_cache_type) system
  variable is `ON` or
  `DEMAND`.

* `SQL_NO_CACHE`

  The server does not use the query cache. It neither checks
  the query cache to see whether the result is already
  cached, nor does it cache the query result.

Examples:

```sql
SELECT SQL_CACHE id, name FROM customer;
SELECT SQL_NO_CACHE id, name FROM customer;
```