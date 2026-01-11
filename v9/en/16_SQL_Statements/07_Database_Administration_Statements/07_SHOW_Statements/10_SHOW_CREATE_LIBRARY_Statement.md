#### 15.7.7.10 SHOW CREATE LIBRARY Statement

```
SHOW CREATE LIBRARY [database_name.]library_name
```

Returns the text that can be used to re-create the named JavaScript or WebAssembly library in the named database; the database defaults to the current database if one is not specified. See Section 15.1.19, “CREATE LIBRARY Statement”, for more information.

For an account other than the account which created the library, access to routine properties depends on the privileges granted to the account, as described here:

* With the `SHOW_ROUTINE` privilege or the global `SELECT` privilege, the account can see all library properties, including its definition. This means that `SHOW CREATE LIBRARY` prints the source code of the library, and all libraries in the Information Schema `libraries` table are visible to this account.

* With the `CREATE ROUTINE`, `ALTER ROUTINE`, or `EXECUTE` privilege granted at a scope that includes the library, the account can see all routine properties except its definition. This means that the associated row in `INFORMATION_SCHEMA.LIBRARIES` is visible but, `SHOW CREATE LIBRARY` does not print the library's source code.

Library code may contain SQL statements (known as a JavaScript SQL callout). The statements are restricted, based on the `INVOKER` and `DEFINER` security contexts of the stored program using that library. Such SQL statements follow the usual restrictions applying to stored functions and stored procedures (see Section 27.10, “Restrictions on Stored Programs”).

```
mysql> SHOW CREATE LIBRARY jslib.lib1\G
*************************** 1. row ***************************
       Library: lib1
      sql_mode: ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,
NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION
Create Library: CREATE LIBRARY `lib1`
    LANGUAGE JAVASCRIPT COMMENT "This is lib1"
AS $$
      export function f(n) {
        return n
      }
    $$
1 row in set (0.00 sec)

mysql> SHOW CREATE LIBRARY jslib.lib2\G
*************************** 1. row ***************************
       Library: lib2
      sql_mode: ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,
NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION
Create Library: CREATE LIBRARY `lib2`
    LANGUAGE JAVASCRIPT COMMENT "This is lib2"
AS $$
      export function g(n) {
        return n * 2
      }
    $$
1 row in set (0.00 sec)

mysql> SHOW CREATE LIBRARY wasmlib.lib1\G
*************************** 1. row ***************************
       Library: lib1
      sql_mode: ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,
NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION
Create Library: CREATE LIBRARY `lib1`
    LANGUAGE WASM
AS $$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$$
1 row in set (0.0002 sec)

mysql> SHOW CREATE LIBRARY wasmlib.lib2\G
*************************** 1. row ***************************
       Library: lib2
      sql_mode: ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,
NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION
Create Library: CREATE LIBRARY `lib2`
    LANGUAGE WASM
AS 0x
1 row in set (0.000 sec)
```

For further information and examples, see Section 27.3.8, “Using JavaScript Libraries”.
