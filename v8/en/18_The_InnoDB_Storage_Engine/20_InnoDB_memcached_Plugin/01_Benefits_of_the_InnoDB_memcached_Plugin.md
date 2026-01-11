### 17.20.1 Benefits of the InnoDB memcached Plugin

This section outlines advantages the `daemon_memcached` plugin. The combination of `InnoDB` tables and **memcached** offers advantages over using either by themselves.

* Direct access to the `InnoDB` storage engine avoids the parsing and planning overhead of SQL.

* Running **memcached** in the same process space as the MySQL server avoids the network overhead of passing requests back and forth.

* Data written using the **memcached** protocol is transparently written to an `InnoDB` table, without going through the MySQL SQL layer. You can control frequency of writes to achieve higher raw performance when updating non-critical data.

* Data requested through the **memcached** protocol is transparently queried from an `InnoDB` table, without going through the MySQL SQL layer.

* Subsequent requests for the same data is served from the `InnoDB` buffer pool. The buffer pool handles the in-memory caching. You can tune performance of data-intensive operations using `InnoDB` configuration options.

* Data can be unstructured or structured, depending on the type of application. You can create a new table for data, or use existing tables.

* `InnoDB` can handle composing and decomposing multiple column values into a single **memcached** item value, reducing the amount of string parsing and concatenation required in your application. For example, you can store the string value `2|4|6|8` in the **memcached** cache, and have `InnoDB` split the value based on a separator character, then store the result in four numeric columns.

* The transfer between memory and disk is handled automatically, simplifying application logic.

* Data is stored in a MySQL database to protect against crashes, outages, and corruption.

* You can access the underlying `InnoDB` table through SQL for reporting, analysis, ad hoc queries, bulk loading, multi-step transactional computations, set operations such as union and intersection, and other operations suited to the expressiveness and flexibility of SQL.

* You can ensure high availability by using the `daemon_memcached` plugin on a source server in combination with MySQL replication.

* The integration of **memcached** with MySQL provides a way to make in-memory data persistent, so you can use it for more significant kinds of data. You can use more `add`, `incr`, and similar write operations in your application without concern that data could be lost. You can stop and start the **memcached** server without losing updates made to cached data. To guard against unexpected outages, you can take advantage of `InnoDB` crash recovery, replication, and backup capabilities.

* The way `InnoDB` does fast primary key lookups is a natural fit for **memcached** single-item queries. The direct, low-level database access path used by the `daemon_memcached` plugin is much more efficient for key-value lookups than equivalent SQL queries.

* The serialization features of **memcached**, which can turn complex data structures, binary files, or even code blocks into storable strings, offer a simple way to get such objects into a database.

* Because you can access the underlying data through SQL, you can produce reports, search or update across multiple keys, and call functions such as `AVG()` and `MAX()` on **memcached** data. All of these operations are expensive or complicated using **memcached** by itself.

* You do not need to manually load data into **memcached** at startup. As particular keys are requested by an application, values are retrieved from the database automatically, and cached in memory using the `InnoDB` buffer pool.

* Because **memcached** consumes relatively little CPU, and its memory footprint is easy to control, it can run comfortably alongside a MySQL instance on the same system.

* Because data consistency is enforced by mechanisms used for regular `InnoDB` tables, you do not have to worry about stale **memcached** data or fallback logic to query the database in the case of a missing key.
