## 12.14 Locking Functions

This section describes functions used to manipulate user-level locks.

**Table 12.19 Locking Functions**

<table frame="box" rules="all" summary="A reference that lists locking functions."><col style="width: 28%"/><col style="width: 71%"/><thead><tr><th>Name</th> <th>Description</th> </tr></thead><tbody><tr><td><a class="link" href="locking-functions.html#function_get-lock"><code>GET_LOCK()</code></a></td> <td> Get a named lock </td> </tr><tr><td><a class="link" href="locking-functions.html#function_is-free-lock"><code>IS_FREE_LOCK()</code></a></td> <td> Whether the named lock is free </td> </tr><tr><td><a class="link" href="locking-functions.html#function_is-used-lock"><code>IS_USED_LOCK()</code></a></td> <td> Whether the named lock is in use; return connection identifier if true </td> </tr><tr><td><a class="link" href="locking-functions.html#function_release-all-locks"><code>RELEASE_ALL_LOCKS()</code></a></td> <td> Release all current named locks </td> </tr><tr><td><a class="link" href="locking-functions.html#function_release-lock"><code>RELEASE_LOCK()</code></a></td> <td> Release the named lock </td> </tr></tbody></table>

* `GET_LOCK(str,timeout)`

  Tries to obtain a lock with a name given by the string *`str`*, using a timeout of *`timeout`* seconds. A negative *`timeout`* value means infinite timeout. The lock is exclusive. While held by one session, other sessions cannot obtain a lock of the same name.

  Returns `1` if the lock was obtained successfully, `0` if the attempt timed out (for example, because another client has previously locked the name), or `NULL` if an error occurred (such as running out of memory or the thread was killed with **mysqladmin kill**).

  A lock obtained with `GET_LOCK()` is released explicitly by executing `RELEASE_LOCK()` or implicitly when your session terminates (either normally or abnormally). Locks obtained with `GET_LOCK()` are not released when transactions commit or roll back.

  In MySQL 5.7, `GET_LOCK()` was reimplemented using the metadata locking (MDL) subsystem and its capabilities were extended. Multiple simultaneous locks can be acquired and `GET_LOCK()` does not release any existing locks.

  It is even possible for a given session to acquire multiple locks for the same name. Other sessions cannot acquire a lock with that name until the acquiring session releases all its locks for the name.

  As a result of the MDL reimplementation, uniquely named locks acquired with `GET_LOCK()` appear in the Performance Schema `metadata_locks` table. The `OBJECT_TYPE` column says `USER LEVEL LOCK` and the `OBJECT_NAME` column indicates the lock name. In the case that multiple locks are acquired for the *same* name, only the first lock for the name registers a row in the `metadata_locks` table. Subsequent locks for the name increment a counter in the lock but do not acquire additional metadata locks. The `metadata_locks` row for the lock is deleted when the last lock instance on the name is released.

  The capability of acquiring multiple locks means there is the possibility of deadlock among clients. When this happens, the server chooses a caller and terminates its lock-acquisition request with an `ER_USER_LOCK_DEADLOCK` error. This error does not cause transactions to roll back.

  Before MySQL 5.7, only a single simultaneous lock can be acquired and `GET_LOCK()` releases any existing lock. The difference in lock acquisition behavior as of MySQL 5.7 can be seen by the following example. Suppose that you execute these statements:

  ```sql
  SELECT GET_LOCK('lock1',10);
  SELECT GET_LOCK('lock2',10);
  SELECT RELEASE_LOCK('lock2');
  SELECT RELEASE_LOCK('lock1');
  ```

  In MySQL 5.7 or later, the second `GET_LOCK()` acquires a second lock and both `RELEASE_LOCK()` calls return 1 (success). Before MySQL 5.7, the second `GET_LOCK()` releases the first lock (`'lock1')` and the second `RELEASE_LOCK()` returns `NULL` (failure) because there is no `'lock1'` to release.

  MySQL 5.7 and later enforces a maximum length on lock names of 64 characters. Previously, no limit was enforced.

  `GET_LOCK()` can be used to implement application locks or to simulate record locks. Names are locked on a server-wide basis. If a name has been locked within one session, `GET_LOCK()` blocks any request by another session for a lock with the same name. This enables clients that agree on a given lock name to use the name to perform cooperative advisory locking. But be aware that it also enables a client that is not among the set of cooperating clients to lock a name, either inadvertently or deliberately, and thus prevent any of the cooperating clients from locking that name. One way to reduce the likelihood of this is to use lock names that are database-specific or application-specific. For example, use lock names of the form *`db_name.str`* or *`app_name.str`*.

  If multiple clients are waiting for a lock, the order in which they acquire it is undefined. Applications should not assume that clients acquire the lock in the same order that they issued the lock requests.

  `GET_LOCK()` is unsafe for statement-based replication. A warning is logged if you use this function when `binlog_format` is set to `STATEMENT`.

  Since `GET_LOCK()` establishes a lock only on a single **mysqld**, it is not suitable for use with NDB Cluster, which has no way of enforcing an SQL lock across multiple MySQL servers. See Section 21.2.7.10, “Limitations Relating to Multiple NDB Cluster Nodes”, for more information.

  Caution

  With the capability of acquiring multiple named locks, it is possible for a single statement to acquire a large number of locks. For example:

  ```sql
  INSERT INTO ... SELECT GET_LOCK(t1.col_name) FROM t1;
  ```

  These types of statements may have certain adverse effects. For example, if the statement fails part way through and rolls back, locks acquired up to the point of failure still exist. If the intent is for there to be a correspondence between rows inserted and locks acquired, that intent is not satisfied. Also, if it is important that locks are granted in a certain order, be aware that result set order may differ depending on which execution plan the optimizer chooses. For these reasons, it may be best to limit applications to a single lock-acquisition call per statement.

  A different locking interface is available as either a plugin service or a set of loadable functions. This interface provides lock namespaces and distinct read and write locks, unlike the interface provided by `GET_LOCK()` and related functions. For details, see Section 5.5.6.1, “The Locking Service”.

* `IS_FREE_LOCK(str)`

  Checks whether the lock named *`str`* is free to use (that is, not locked). Returns `1` if the lock is free (no one is using the lock), `0` if the lock is in use, and `NULL` if an error occurs (such as an incorrect argument).

  This function is unsafe for statement-based replication. A warning is logged if you use this function when `binlog_format` is set to `STATEMENT`.

* `IS_USED_LOCK(str)`

  Checks whether the lock named *`str`* is in use (that is, locked). If so, it returns the connection identifier of the client session that holds the lock. Otherwise, it returns `NULL`.

  This function is unsafe for statement-based replication. A warning is logged if you use this function when `binlog_format` is set to `STATEMENT`.

* `RELEASE_ALL_LOCKS()`

  Releases all named locks held by the current session and returns the number of locks released (0 if there were none)

  This function is unsafe for statement-based replication. A warning is logged if you use this function when `binlog_format` is set to `STATEMENT`.

* `RELEASE_LOCK(str)`

  Releases the lock named by the string *`str`* that was obtained with `GET_LOCK()`. Returns `1` if the lock was released, `0` if the lock was not established by this thread (in which case the lock is not released), and `NULL` if the named lock did not exist. The lock does not exist if it was never obtained by a call to `GET_LOCK()` or if it has previously been released.

  The `DO` statement is convenient to use with `RELEASE_LOCK()`. See Section 13.2.3, “DO Statement”.

  This function is unsafe for statement-based replication. A warning is logged if you use this function when `binlog_format` is set to `STATEMENT`.
