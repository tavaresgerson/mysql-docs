### 8.14.4 Query Cache Thread States

These thread states are associated with the query cache (see
[Section 8.10.3, “The MySQL Query Cache”](query-cache.html "8.10.3 The MySQL Query Cache")).

* `checking privileges on cached query`

  The server is checking whether the user has privileges to
  access a cached query result.

* `checking query cache for query`

  The server is checking whether the current query is present
  in the query cache.

* `invalidating query cache entries`

  Query cache entries are being marked invalid because the
  underlying tables have changed.

* `sending cached result to client`

  The server is taking the result of a query from the query
  cache and sending it to the client.

* `storing result in query cache`

  The server is storing the result of a query in the query
  cache.

* `Waiting for query cache lock`

  This state occurs while a session is waiting to take the
  query cache lock. This can happen for any statement that
  needs to perform some query cache operation, such as an
  [`INSERT`](insert.html "13.2.5 INSERT Statement") or
  [`DELETE`](delete.html "13.2.2 DELETE Statement") that invalidates the
  query cache, a [`SELECT`](select.html "13.2.9 SELECT Statement") that
  looks for a cached entry,
  [`RESET QUERY
  CACHE`](reset.html "13.7.6.6 RESET Statement"), and so forth.