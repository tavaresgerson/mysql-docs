### 10.9.2 Switchable Optimizations

The `optimizer_switch` system variable enables control over optimizer behavior. Its value is a set of flags, each of which has a value of `on` or `off` to indicate whether the corresponding optimizer behavior is enabled or disabled. This variable has global and session values and can be changed at runtime. The global default can be set at server startup.

To see the current set of optimizer flags, select the variable value:

```
mysql> SELECT @@optimizer_switch\G
*************************** 1. row ***************************
@@optimizer_switch: index_merge=on,index_merge_union=on,
                    index_merge_sort_union=on,index_merge_intersection=on,
                    engine_condition_pushdown=on,index_condition_pushdown=on,
                    mrr=on,mrr_cost_based=on,block_nested_loop=on,
                    batched_key_access=off,materialization=on,semijoin=on,
                    loosescan=on,firstmatch=on,duplicateweedout=on,
                    subquery_materialization_cost_based=on,
                    use_index_extensions=on,condition_fanout_filter=on,
                    derived_merge=on,use_invisible_indexes=off,skip_scan=on,
                    hash_join=on,subquery_to_derived=off,
                    prefer_ordering_index=on,hypergraph_optimizer=off,
                    derived_condition_pushdown=on,hash_set_operations=on
1 row in set (0.00 sec)
```

To change the value of `optimizer_switch`, assign a value consisting of a comma-separated list of one or more commands:

```
SET [GLOBAL|SESSION] optimizer_switch='command[,command]...';
```

Each *`command`* value should have one of the forms shown in the following table.

<table><thead><tr> <th>Command Syntax</th> <th>Meaning</th> </tr></thead><tbody><tr> <td><code>default</code></td> <td>Reset every optimization to its default value</td> </tr><tr> <td><code><em><code>opt_name</code></em>=default</code></td> <td>Set the named optimization to its default value</td> </tr><tr> <td><code><em><code>opt_name</code></em>=off</code></td> <td>Disable the named optimization</td> </tr><tr> <td><code><em><code>opt_name</code></em>=on</code></td> <td>Enable the named optimization</td> </tr></tbody></table>

The order of the commands in the value does not matter, although the `default` command is executed first if present. Setting an *`opt_name`* flag to `default` sets it to whichever of `on` or `off` is its default value. Specifying any given *`opt_name`* more than once in the value is not permitted and causes an error. Any errors in the value cause the assignment to fail with an error, leaving the value of `optimizer_switch` unchanged.

The following list describes the permissible *`opt_name`* flag names, grouped by optimization strategy:

* Batched Key Access Flags

  +  `batched_key_access` (default `off`)

    Controls use of BKA join algorithm.

  For  `batched_key_access` to have any effect when set to `on`, the `mrr` flag must also be `on`. Currently, the cost estimation for MRR is too pessimistic. Hence, it is also necessary for `mrr_cost_based` to be `off` for BKA to be used.

  For more information, see Section 10.2.1.12, “Block Nested-Loop and Batched Key Access Joins”.
* Block Nested-Loop Flags

  +  `block_nested_loop` (default `on`)

    Controls use of hash joins, as do the `BNL` and `NO_BNL` optimizer hints.

  For more information, see Section 10.2.1.12, “Block Nested-Loop and Batched Key Access Joins”.
* Condition Filtering Flags

  +  `condition_fanout_filter` (default `on`)

    Controls use of condition filtering.

  For more information, see Section 10.2.1.13, “Condition Filtering”.
* Derived Condition Pushdown Flags

  +  `derived_condition_pushdown` (default `on`)

    Controls derived condition pushdown.

  For more information, see Section 10.2.2.5, “Derived Condition Pushdown Optimization”
* Derived Table Merging Flags

  +  `derived_merge` (default `on`)

    Controls merging of derived tables and views into outer query block.

  The  `derived_merge` flag controls whether the optimizer attempts to merge derived tables, view references, and common table expressions into the outer query block, assuming that no other rule prevents merging; for example, an `ALGORITHM` directive for a view takes precedence over the `derived_merge` setting. By default, the flag is `on` to enable merging.

  For more information, see Section 10.2.2.4, “Optimizing Derived Tables, View References, and Common Table Expressions with Merging or Materialization”.
* Engine Condition Pushdown Flags

  +  `engine_condition_pushdown` (default `on`)

    Controls engine condition pushdown.

  For more information, see Section 10.2.1.5, “Engine Condition Pushdown Optimization”.
* Hash Join Flags

  +  `hash_join` (default `on`)

    Has no effect in MySQL 8.4. Use the `block_nested_loop` flag, instead.

  For more information, see  Section 10.2.1.4, “Hash Join Optimization”.
* Index Condition Pushdown Flags

  +  `index_condition_pushdown` (default `on`)

    Controls index condition pushdown.

  For more information, see Section 10.2.1.6, “Index Condition Pushdown Optimization”.
* Index Extensions Flags

  +  `use_index_extensions` (default `on`)

    Controls use of index extensions.

  For more information, see Section 10.3.10, “Use of Index Extensions”.
* Index Merge Flags

  +  `index_merge` (default `on`)

    Controls all Index Merge optimizations.
  +  `index_merge_intersection` (default `on`)

    Controls the Index Merge Intersection Access optimization.
  +  `index_merge_sort_union` (default `on`)

    Controls the Index Merge Sort-Union Access optimization.
  +  `index_merge_union` (default `on`)

    Controls the Index Merge Union Access optimization.

  For more information, see Section 10.2.1.3, “Index Merge Optimization”.
* Index Visibility Flags

  +  `use_invisible_indexes` (default `off`)

    Controls use of invisible indexes.

  For more information, see Section 10.3.12, “Invisible Indexes”.
* Limit Optimization Flags

  +  `prefer_ordering_index` (default `on`)

    Controls whether, in the case of a query having an `ORDER BY` or `GROUP BY` with a `LIMIT` clause, the optimizer tries to use an ordered index instead of an unordered index, a filesort, or some other optimization. This optimization is performed by default whenever the optimizer determines that using it would allow for faster execution of the query.

    Because the algorithm that makes this determination cannot handle every conceivable case (due in part to the assumption that the distribution of data is always more or less uniform), there are cases in which this optimization may not be desirable. This optimization can be disabled by setting the `prefer_ordering_index` flag to `off`.

  For more information and examples, see Section 10.2.1.19, “LIMIT Query Optimization”.
* Multi-Range Read Flags

  +  `mrr` (default `on`)

    Controls the Multi-Range Read strategy.
  +  `mrr_cost_based` (default `on`)

    Controls use of cost-based MRR if `mrr=on`.

  For more information, see Section 10.2.1.11, “Multi-Range Read Optimization”.
* Semijoin Flags

  +  `duplicateweedout` (default `on`)

    Controls the semijoin Duplicate Weedout strategy.
  +  `firstmatch` (default `on`)

    Controls the semijoin FirstMatch strategy.
  +  `loosescan` (default `on`)

    Controls the semijoin LooseScan strategy (not to be confused with Loose Index Scan for `GROUP BY`).
  +  `semijoin` (default `on`)

    Controls all semijoin strategies.

    This also applies to the antijoin optimization.

  The  `semijoin`, `firstmatch`, `loosescan`, and `duplicateweedout` flags enable control over semijoin strategies. The `semijoin` flag controls whether semijoins are used. If it is set to `on`, the `firstmatch` and `loosescan` flags enable finer control over the permitted semijoin strategies.

  If the  `duplicateweedout` semijoin strategy is disabled, it is not used unless all other applicable strategies are also disabled.

  If  `semijoin` and `materialization` are both `on`, semijoins also use materialization where applicable. These flags are `on` by default.

  For more information, see  Optimizing IN and EXISTS Subquery Predicates with Semijoin Transformations.
* Set Operations Flags

  +  `hash_set_operations` (default `on`)

    Enables the hash table optimization for set operations involving  `EXCEPT` and `INTERSECT`); enabled by default. Otherwise, temporary table based de-duplication is used, as in previous versions of MySQL.

    The amount of memory used for hashing by this optimization can be controlled using the `set_operations_buffer_size` system variable; increasing this generally results in faster execution times for statements using these operations.
* Skip Scan Flags

  +  `skip_scan` (default `on`)

    Controls use of Skip Scan access method.

  For more information, see Skip Scan Range Access Method.
* Subquery Materialization Flags

  +  `materialization` (default `on`)

    Controls materialization (including semijoin materialization).
  +  `subquery_materialization_cost_based` (default `on`)

    Use cost-based materialization choice.

  The  `materialization` flag controls whether subquery materialization is used. If `semijoin` and `materialization` are both `on`, semijoins also use materialization where applicable. These flags are `on` by default.

  The `subquery_materialization_cost_based` flag enables control over the choice between subquery materialization and `IN`-to-`EXISTS` subquery transformation. If the flag is `on` (the default), the optimizer performs a cost-based choice between subquery materialization and `IN`-to-`EXISTS` subquery transformation if either method could be used. If the flag is `off`, the optimizer chooses subquery materialization over `IN`-to-`EXISTS` subquery transformation.

  For more information, see Section 10.2.2, “Optimizing Subqueries, Derived Tables, View References, and Common Table Expressions”.
* Subquery Transformation Flags

  +  `subquery_to_derived` (default `off`)

    The optimizer is able in many cases to transform a scalar subquery in a `SELECT`, `WHERE`, `JOIN`, or `HAVING` clause into a left outer join on a derived table. (Depending on the nullability of the derived table, this can sometimes be simplified further to an inner join.) This can be done for a subquery which meets the following conditions:

    - The subquery does not make use of any nondeterministic functions, such as `RAND()`.
    - The subquery is not an `ANY` or `ALL` subquery which can be rewritten to use `MIN()` or `MAX()`.
    - The parent query does not set a user variable, since rewriting it may affect the order of execution, which could lead to unexpected results if the variable is accessed more than once in the same query.
    - The subquery should not be correlated, that is, it should not reference a column from a table in the outer query, or contain an aggregate that is evaluated in the outer query.

    This optimization can also be applied to a table subquery which is the argument to `IN`, `NOT IN`, `EXISTS`, or `NOT EXISTS`, that does not contain a `GROUP BY`.

    The default value for this flag is `off`, since, in most cases, enabling this optimization does not produce any noticeable improvement in performance (and in many cases can even make queries run more slowly), but you can enable the optimization by setting the `subquery_to_derived` flag to `on`. It is primarily intended for use in testing.

    Example, using a scalar subquery:

    ```
    d
    mysql> CREATE TABLE t1(a INT);

    mysql> CREATE TABLE t2(a INT);

    mysql> INSERT INTO t1 VALUES ROW(1), ROW(2), ROW(3), ROW(4);

    mysql> INSERT INTO t2 VALUES ROW(1), ROW(2);

    mysql> SELECT * FROM t1
        ->     WHERE t1.a > (SELECT COUNT(a) FROM t2);
    +------+
    | a    |
    +------+
    |    3 |
    |    4 |
    +------+

    mysql> SELECT @@optimizer_switch LIKE '%subquery_to_derived=off%';
    +-----------------------------------------------------+
    | @@optimizer_switch LIKE '%subquery_to_derived=off%' |
    +-----------------------------------------------------+
    |                                                   1 |
    +-----------------------------------------------------+

    mysql> EXPLAIN SELECT * FROM t1 WHERE t1.a > (SELECT COUNT(a) FROM t2)\G
    *************************** 1. row ***************************
               id: 1
      select_type: PRIMARY
            table: t1
       partitions: NULL
             type: ALL
    possible_keys: NULL
              key: NULL
          key_len: NULL
              ref: NULL
             rows: 4
         filtered: 33.33
            Extra: Using where
    *************************** 2. row ***************************
               id: 2
      select_type: SUBQUERY
            table: t2
       partitions: NULL
             type: ALL
    possible_keys: NULL
              key: NULL
          key_len: NULL
              ref: NULL
             rows: 2
         filtered: 100.00
            Extra: NULL

    mysql> SET @@optimizer_switch='subquery_to_derived=on';


    mysql> SELECT @@optimizer_switch LIKE '%subquery_to_derived=off%';
    +-----------------------------------------------------+
    | @@optimizer_switch LIKE '%subquery_to_derived=off%' |
    +-----------------------------------------------------+
    |                                                   0 |
    +-----------------------------------------------------+

    mysql> SELECT @@optimizer_switch LIKE '%subquery_to_derived=on%';
    +----------------------------------------------------+
    | @@optimizer_switch LIKE '%subquery_to_derived=on%' |
    +----------------------------------------------------+
    |                                                  1 |
    +----------------------------------------------------+

    mysql> EXPLAIN SELECT * FROM t1 WHERE t1.a > (SELECT COUNT(a) FROM t2)\G
    *************************** 1. row ***************************
               id: 1
      select_type: PRIMARY
            table: <derived2>
       partitions: NULL
             type: ALL
    possible_keys: NULL
              key: NULL
          key_len: NULL
              ref: NULL
             rows: 1
         filtered: 100.00
            Extra: NULL
    *************************** 2. row ***************************
               id: 1
      select_type: PRIMARY
            table: t1
       partitions: NULL
             type: ALL
    possible_keys: NULL
              key: NULL
          key_len: NULL
              ref: NULL
             rows: 4
         filtered: 33.33
            Extra: Using where; Using join buffer (hash join)
    *************************** 3. row ***************************
               id: 2
      select_type: DERIVED
            table: t2
       partitions: NULL
             type: ALL
    possible_keys: NULL
              key: NULL
          key_len: NULL
              ref: NULL
             rows: 2
         filtered: 100.00
            Extra: NULL
    ```

    As can be seen from executing `SHOW WARNINGS` immediately following the second `EXPLAIN` statement, with the optimization enabled, the query `SELECT * FROM t1 WHERE t1.a > (SELECT COUNT(a) FROM t2)` is rewritten in a form similar to what is shown here:

    ```
    SELECT t1.a FROM t1
        JOIN  ( SELECT COUNT(t2.a) AS c FROM t2 ) AS d
                WHERE t1.a > d.c;
    ```

    Example, using a query with `IN (subquery)`:

    ```
    mysql> DROP TABLE IF EXISTS t1, t2;

    mysql> CREATE TABLE t1 (a INT, b INT);
    mysql> CREATE TABLE t2 (a INT, b INT);

    mysql> INSERT INTO t1 VALUES ROW(1,10), ROW(2,20), ROW(3,30);
    mysql> INSERT INTO t2
        ->    VALUES ROW(1,10), ROW(2,20), ROW(3,30), ROW(1,110), ROW(2,120), ROW(3,130);

    mysql> SELECT * FROM t1
        ->     WHERE   t1.b < 0
        ->             OR
        ->             t1.a IN (SELECT t2.a + 1 FROM t2);
    +------+------+
    | a    | b    |
    +------+------+
    |    2 |   20 |
    |    3 |   30 |
    +------+------+

    mysql> SET @@optimizer_switch="subquery_to_derived=off";

    mysql> EXPLAIN SELECT * FROM t1
        ->             WHERE   t1.b < 0
        ->                     OR
        ->                     t1.a IN (SELECT t2.a + 1 FROM t2)\G
    *************************** 1. row ***************************
               id: 1
      select_type: PRIMARY
            table: t1
       partitions: NULL
             type: ALL
    possible_keys: NULL
              key: NULL
          key_len: NULL
              ref: NULL
             rows: 3
         filtered: 100.00
            Extra: Using where
    *************************** 2. row ***************************
               id: 2
      select_type: DEPENDENT SUBQUERY
            table: t2
       partitions: NULL
             type: ALL
    possible_keys: NULL
              key: NULL
          key_len: NULL
              ref: NULL
             rows: 6
         filtered: 100.00
            Extra: Using where

    mysql> SET @@optimizer_switch="subquery_to_derived=on";

    mysql> EXPLAIN SELECT * FROM t1
        ->             WHERE   t1.b < 0
        ->                     OR
        ->                     t1.a IN (SELECT t2.a + 1 FROM t2)\G
    *************************** 1. row ***************************
               id: 1
      select_type: PRIMARY
            table: t1
       partitions: NULL
             type: ALL
    possible_keys: NULL
              key: NULL
          key_len: NULL
              ref: NULL
             rows: 3
         filtered: 100.00
            Extra: NULL
    *************************** 2. row ***************************
               id: 1
      select_type: PRIMARY
            table: <derived2>
       partitions: NULL
             type: ref
    possible_keys: <auto_key0>
              key: <auto_key0>
          key_len: 9
              ref: std2.t1.a
             rows: 2
         filtered: 100.00
            Extra: Using where; Using index
    *************************** 3. row ***************************
               id: 2
      select_type: DERIVED
            table: t2
       partitions: NULL
             type: ALL
    possible_keys: NULL
              key: NULL
          key_len: NULL
              ref: NULL
             rows: 6
         filtered: 100.00
            Extra: Using temporary
    ```

    Checking and simplifying the result of `SHOW WARNINGS` after executing  `EXPLAIN` on this query shows that, when the `subquery_to_derived` flag enabled, `SELECT * FROM t1 WHERE t1.b < 0 OR t1.a IN (SELECT t2.a + 1 FROM t2)` is rewritten in a form similar to what is shown here:

    ```
    SELECT a, b FROM t1
        LEFT JOIN (SELECT DISTINCT a + 1 AS e FROM t2) d
        ON t1.a = d.e
        WHERE   t1.b < 0
                OR
                d.e IS NOT NULL;
    ```

    Example, using a query with `EXISTS (subquery)` and the same tables and data as in the previous example:

    ```
    mysql> SELECT * FROM t1
        ->     WHERE   t1.b < 0
        ->             OR
        ->             EXISTS(SELECT * FROM t2 WHERE t2.a = t1.a + 1);
    +------+------+
    | a    | b    |
    +------+------+
    |    1 |   10 |
    |    2 |   20 |
    +------+------+

    mysql> SET @@optimizer_switch="subquery_to_derived=off";

    mysql> EXPLAIN SELECT * FROM t1
        ->             WHERE   t1.b < 0
        ->                     OR
        ->                     EXISTS(SELECT * FROM t2 WHERE t2.a = t1.a + 1)\G
    *************************** 1. row ***************************
               id: 1
      select_type: PRIMARY
            table: t1
       partitions: NULL
             type: ALL
    possible_keys: NULL
              key: NULL
          key_len: NULL
              ref: NULL
             rows: 3
         filtered: 100.00
            Extra: Using where
    *************************** 2. row ***************************
               id: 2
      select_type: DEPENDENT SUBQUERY
            table: t2
       partitions: NULL
             type: ALL
    possible_keys: NULL
              key: NULL
          key_len: NULL
              ref: NULL
             rows: 6
         filtered: 16.67
            Extra: Using where

    mysql> SET @@optimizer_switch="subquery_to_derived=on";

    mysql> EXPLAIN SELECT * FROM t1
        ->             WHERE   t1.b < 0
        ->                     OR
        ->                     EXISTS(SELECT * FROM t2 WHERE t2.a = t1.a + 1)\G
    *************************** 1. row ***************************
               id: 1
      select_type: PRIMARY
            table: t1
       partitions: NULL
             type: ALL
    possible_keys: NULL
              key: NULL
          key_len: NULL
              ref: NULL
             rows: 3
         filtered: 100.00
            Extra: NULL
    *************************** 2. row ***************************
               id: 1
      select_type: PRIMARY
            table: <derived2>
       partitions: NULL
             type: ALL
    possible_keys: NULL
              key: NULL
          key_len: NULL
              ref: NULL
             rows: 6
         filtered: 100.00
            Extra: Using where; Using join buffer (hash join)
    *************************** 3. row ***************************
               id: 2
      select_type: DERIVED
            table: t2
       partitions: NULL
             type: ALL
    possible_keys: NULL
              key: NULL
          key_len: NULL
              ref: NULL
             rows: 6
         filtered: 100.00
            Extra: Using temporary
    ```

    If we execute `SHOW WARNINGS` after running `EXPLAIN` on the query `SELECT * FROM t1 WHERE t1.b < 0 OR EXISTS(SELECT * FROM t2 WHERE t2.a = t1.a + 1)` when `subquery_to_derived` has been enabled, and simplify the second row of the result, we see that it has been rewritten in a form which resembles this:

    ```
    SELECT a, b FROM t1
    LEFT JOIN (SELECT DISTINCT 1 AS e1, t2.a AS e2 FROM t2) d
    ON t1.a + 1 = d.e2
    WHERE   t1.b < 0
            OR
            d.e1 IS NOT NULL;
    ```

    For more information, see Section 10.2.2.4, “Optimizing Derived Tables, View References, and Common Table Expressions with Merging or Materialization”, as well as Section 10.2.1.19, “LIMIT Query Optimization”, and Optimizing IN and EXISTS Subquery Predicates with Semijoin Transformations.

When you assign a value to `optimizer_switch`, flags that are not mentioned keep their current values. This makes it possible to enable or disable specific optimizer behaviors in a single statement without affecting other behaviors. The statement does not depend on what other optimizer flags exist and what their values are. Suppose that all Index Merge optimizations are enabled:

```
mysql> SELECT @@optimizer_switch\G
*************************** 1. row ***************************
@@optimizer_switch: index_merge=on,index_merge_union=on,
                    index_merge_sort_union=on,index_merge_intersection=on,
                    engine_condition_pushdown=on,index_condition_pushdown=on,
                    mrr=on,mrr_cost_based=on,block_nested_loop=on,
                    batched_key_access=off,materialization=on,semijoin=on,
                    loosescan=on, firstmatch=on,
                    subquery_materialization_cost_based=on,
                    use_index_extensions=on,condition_fanout_filter=on,
                    derived_merge=on,use_invisible_indexes=off,skip_scan=on,
                    hash_join=on,subquery_to_derived=off,
                    prefer_ordering_index=on
```

If the server is using the Index Merge Union or Index Merge Sort-Union access methods for certain queries and you want to check whether the optimizer can perform better without them, set the variable value like this:

```
mysql> SET optimizer_switch='index_merge_union=off,index_merge_sort_union=off';

mysql> SELECT @@optimizer_switch\G
*************************** 1. row ***************************
@@optimizer_switch: index_merge=on,index_merge_union=off,
                    index_merge_sort_union=off,index_merge_intersection=on,
                    engine_condition_pushdown=on,index_condition_pushdown=on,
                    mrr=on,mrr_cost_based=on,block_nested_loop=on,
                    batched_key_access=off,materialization=on,semijoin=on,
                    loosescan=on, firstmatch=on,
                    subquery_materialization_cost_based=on,
                    use_index_extensions=on,condition_fanout_filter=on,
                    derived_merge=on,use_invisible_indexes=off,skip_scan=on,
                    hash_join=on,subquery_to_derived=off,
                    prefer_ordering_index=on
```
