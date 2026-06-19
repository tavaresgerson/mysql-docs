## 8.15 Tracing the Optimizer

The MySQL optimizer includes the capability to perform tracing; the interface is provided by a set of `optimizer_trace_xxx` system variables and the `INFORMATION_SCHEMA.OPTIMIZER_TRACE` table.


### 8.15.1 Typical Usage

To perform optimizer tracing entails the following steps:

1. Enable tracing by executing `SET` `optimizer_trace="enabled=ON"`.

2. Execute the statement to be traced. See Section 8.15.3, “Traceable Statements”, for a listing of statements which can be traced.

3. Examine the contents of the `INFORMATION_SCHEMA.OPTIMIZER_TRACE` table.

4. To examine traces for multiple queries, repeat the previous two steps as needed.

5. To disable tracing after you have finished, execute `SET optimizer_trace="enabled=OFF"`.

You can trace only statements which are executed within the current session; you cannot see traces from other sessions.


### 8.15.2 System Variables Controlling Tracing

The following system variables affect optimizer tracing:

* `optimizer_trace`: Enables or disables optimizer tracing. See Section 8.15.8, “The optimizer\_trace System Variable”.

* `optimizer_trace_features`: Enables or disables selected features of the MySQL Optimizer, using the syntax shown here:

  ```sql
  SET optimizer_trace_features=option=value[,option=value][,...]

  option:
    {greedy_search | range_optimizer | dynamic_range | repeated_subselect}

  value:
    {on | off | default}
  ```

  See Section 8.15.10, “Selecting Optimizer Features to Trace”, for more information on the effects of these.

* `optimizer_trace_max_mem_size`: Maximum amount of memory that can be used for storing all traces.

* `optimizer_trace_limit`: The maximum number of optimizer traces to be shown. See Section 8.15.4, “Tuning Trace Purging”, for more information.

* `optimizer_trace_offset`: Offset of the first trace shown. See Section 8.15.4, “Tuning Trace Purging”.

* `end_markers_in_json`: If set to `1`, causes the trace to repeat the key (if present) near the closing bracket. This also affects the output of `EXPLAIN FORMAT=JSON` in those versions of MySQL which support this statement. See Section 8.15.9, “The end\_markers\_in\_json System Variable”.


### 8.15.3 Traceable Statements

Statements which are traceable are listed here:

* `SELECT`
* `INSERT`
* `REPLACE`
* `UPDATE`
* `DELETE`
* `EXPLAIN` with any of the preceding statements
* `SET`
* `DO`
* `DECLARE`, `CASE`, `IF`, and `RETURN` as used in stored routines
* `CALL`

Tracing is supported for both `INSERT` and `REPLACE` statements using `VALUES`, `VALUES ROW`, or `SELECT`.

Traces of multi-table `UPDATE` and `DELETE` statements are supported.

Tracing of `SET optimizer_trace` is not supported.

For statements which are prepared and executed in separate steps, preparation and execution are traced separately.


### 8.15.4 Tuning Trace Purging

By default, each new trace overwrites the previous trace. Thus, if a statement contains substatements (such as invoking stored procedures, stored functions, or triggers), the topmost statement and substatements each generate one trace, but at the end of execution, the trace for only the last substatement is visible.

A user who wants to see the trace of a different substatement can enable or disable tracing for the desired substatement, but this requires editing the routine code, which may not always be possible. Another solution is to tune trace purging. This is done by setting the `optimizer_trace_offset` and `optimizer_trace_limit` system variables, like this:

```sql
SET optimizer_trace_offset=offset, optimizer_trace_limit=limit;
```

*`offset`* is a signed integer (default `-1`); *`limit`* is a positive integer (default `1`). Such a `SET` statement has the following effects:

* All traces previously stored are cleared from memory.
* A subsequent `SELECT` from the `OPTIMIZER_TRACE` table returns the first *`limit`* traces of the *`offset`* oldest stored traces (if *`offset`* >= 0), or the first *`limit`* traces of the *`-offset`* newest stored traces (if *`offset`* < 0).

Examples:

* `SET optimizer_trace_offset=-1, optimizer_trace_limit=1`: The most recent trace is shown (the default).

* `SET optimizer_trace_offset=-2, optimizer_trace_limit=1`: The next-to-last trace is shown.

* `SET optimizer_trace_offset=-5, optimizer_trace_limit=5`: The last five traces are shown.

Negative values for *`offset`* can thus prove useful when the substatements of interest are the last few in a stored routine. For example:

```sql
SET optimizer_trace_offset=-5, optimizer_trace_limit=5;

CALL stored_routine(); # more than 5 substatements in this routine

SELECT * FROM information_schema.OPTIMIZER_TRACE; # see only the last 5 traces
```

A positive *`offset`* can be useful when one knows that the interesting substatements are the first few in a stored routine.

The more accurately these two variables are set, the less memory is used. For example, `SET optimizer_trace_offset=0, optimizer_trace_limit=5` requires sufficient memory to store five traces, so if only the three first are needed, is is better to use `SET optimizer_trace_offset=0, optimizer_trace_limit=3`, since tracing stops after *`limit`* traces. A stored routine may have a loop which executes many substatements and thus generates many traces, which can use a lot of memory; in such cases, choosing appropriate values for *`offset`* and *`limit`* can restrict tracing to, for example, a single iteration of the loop. This also decreases the impact of tracing on execution speed.

If *`offset`* is greater than or equal to 0, only *`limit`* traces are kept in memory. If *`offset`* is less than 0, that is not true: instead, *`-offset`* traces are kept in memory. Even if *`limit`* is smaller than *`-offset`*, excluding the last statement, the last statement must still be traced because it will be within the limit after executing one more statement. Since an offset less than 0 is counted from the end, the “window” moves as more statements execute.

Using `optimizer_trace_offset` and `optimizer_trace_limit`, which are restrictions at the trace producer level, provide better (greater) speed and (less) memory usage than setting offsets or limits at the trace consumer (SQL) level with `SELECT * FROM OPTIMIZER_TRACE LIMIT limit OFFSET offset`, which saves almost nothing.


### 8.15.5 Tracing Memory Usage

Each stored trace is a string, which is extended (using `realloc()`) as optimization progresses by appending more data to it. The `optimizer_trace_max_mem_size` server system variable sets a limit on the total amount of memory used by all traces currently being stored. If this limit is reached, the current trace is not extended, which means the trace is incomplete; in this case the `MISSING_BYTES_BEYOND_MAX_MEM_SIZE` column shows the number of bytes missing from the trace.


### 8.15.6 Privilege Checking

In complex scenarios where the query uses SQL SECURITY DEFINER views or stored routines, it may be that a user is denied from seeing the trace of its query because it lacks some extra privileges on those objects. In that case, the trace will be shown as empty and the INSUFFICIENT\_PRIVILEGES column will show "1".


### 8.15.7 Interaction with the --debug Option

Anything written to the trace is automatically written to the debug file.


### 8.15.8 The optimizer\_trace System Variable

The optimizer\_trace system variable has these on/off switches:

* `enabled`: Enables (`ON`) or disables (`OFF`) tracing

* `one_line`: If set to `ON`, the trace contains no whitespace, thus conserving space. This renders the trace difficult to read for humans, still usable by JSON parsers, since they ignore whitespace.


### 8.15.9 The end\_markers\_in\_json System Variable

When reading a very large JSON document, it can be difficult to pair its closing bracket and opening brackets; setting `end_markers_in_json=ON` repeats the structure's key, if it has one, near the closing bracket. This variable affects both optimizer traces and the output of `EXPLAIN FORMAT=JSON`.

Note

If `end_markers_in_json` is enabled, the repetition of the key means the result is not a valid JSON document, and causes JSON parsers to throw an error.


### 8.15.10 Selecting Optimizer Features to Trace

Some features in the optimizer can be invoked many times during statement optimization and execution, and thus can make the trace grow beyond reason. They are:

* *Greedy search*: With an *`N`*-table join, this could explore factorial(*`N`*) plans.
* *Range optimizer*
* *Dynamic range optimization*: Shown as `range checked for each record` in `EXPLAIN` output; each outer row causes a re-run of the range optimizer.
* *Subqueries*: A subquery in which the `WHERE` clause may be executed once per row.

Those features can be excluded from tracing by setting one or more switches of the `optimizer_trace_features` system variable to `OFF`. These switches are listed here:

* `greedy_search`: Greedy search is not traced.
* `range_optimizer`: The range optimizer is not traced.
* `dynamic_range`: Only the first call to the range optimizer on this `JOIN_TAB::SQL_SELECT` is traced.
* `repeated_subselect`: Only the first execution of this `Item_subselect` is traced.


### 8.15.11 Trace General Structure

A trace follows the actual execution path very closely; for each join, there is a join preparation object, a join optimization object, and a join execution object. Query transformations (`IN` to `EXISTS`, outer join to inner join, and so on), simplifications (elimination of clauses), and equality propagation are shown in subobjects. Calls to the range optimizer, cost evaluations, reasons why an access path is chosen over another one, or why a sorting method is chosen over another one, are shown as well.


### 8.15.12 Example

Here we take an example from the test suite.

```sql
#
# Tracing of ORDER BY & GROUP BY simplification.
#
SET optimizer_trace="enabled=on",end_markers_in_json=on; # make readable
SET optimizer_trace_max_mem_size=1000000; # avoid small default

CREATE TABLE t1 (
  pk INT, col_int_key INT,
  col_varchar_key VARCHAR(1),
  col_varchar_nokey VARCHAR(1)
);

INSERT INTO t1 VALUES
  (10,7,'v','v'),(11,0,'s','s'),(12,9,'l','l'),(13,3,'y','y'),(14,4,'c','c'),
  (15,2,'i','i'),(16,5,'h','h'),(17,3,'q','q'),(18,1,'a','a'),(19,3,'v','v'),
  (20,6,'u','u'),(21,7,'s','s'),(22,5,'y','y'),(23,1,'z','z'),(24,204,'h','h'),
  (25,224,'p','p'),(26,9,'e','e'),(27,5,'i','i'),(28,0,'y','y'),(29,3,'w','w');

CREATE TABLE t2 (
  pk INT, col_int_key INT,
  col_varchar_key VARCHAR(1),
  col_varchar_nokey VARCHAR(1),
  PRIMARY KEY (pk)
);

INSERT INTO t2 VALUES
  (1,4,'b','b'),(2,8,'y','y'),(3,0,'p','p'),(4,0,'f','f'),(5,0,'p','p'),
  (6,7,'d','d'),(7,7,'f','f'),(8,5,'j','j'),(9,3,'e','e'),(10,188,'u','u'),
  (11,4,'v','v'),(12,9,'u','u'),(13,6,'i','i'),(14,1,'x','x'),(15,5,'l','l'),
  (16,6,'q','q'),(17,2,'n','n'),(18,4,'r','r'),(19,231,'c','c'),(20,4,'h','h'),
  (21,3,'k','k'),(22,3,'t','t'),(23,7,'t','t'),(24,6,'k','k'),(25,7,'g','g'),
  (26,9,'z','z'),(27,4,'n','n'),(28,4,'j','j'),(29,2,'l','l'),(30,1,'d','d'),
  (31,2,'t','t'),(32,194,'y','y'),(33,2,'i','i'),(34,3,'j','j'),(35,8,'r','r'),
  (36,4,'b','b'),(37,9,'o','o'),(38,4,'k','k'),(39,5,'a','a'),(40,5,'f','f'),
  (41,9,'t','t'),(42,3,'c','c'),(43,8,'c','c'),(44,0,'r','r'),(45,98,'k','k'),
  (46,3,'l','l'),(47,1,'o','o'),(48,0,'t','t'),(49,189,'v','v'),(50,8,'x','x'),
  (51,3,'j','j'),(52,3,'x','x'),(53,9,'k','k'),(54,6,'o','o'),(55,8,'z','z'),
  (56,3,'n','n'),(57,9,'c','c'),(58,5,'d','d'),(59,9,'s','s'),(60,2,'j','j'),
  (61,2,'w','w'),(62,5,'f','f'),(63,8,'p','p'),(64,6,'o','o'),(65,9,'f','f'),
  (66,0,'x','x'),(67,3,'q','q'),(68,6,'g','g'),(69,5,'x','x'),(70,8,'p','p'),
  (71,2,'q','q'),(72,120,'q','q'),(73,25,'v','v'),(74,1,'g','g'),(75,3,'l','l'),
  (76,1,'w','w'),(77,3,'h','h'),(78,153,'c','c'),(79,5,'o','o'),(80,9,'o','o'),
  (81,1,'v','v'),(82,8,'y','y'),(83,7,'d','d'),(84,6,'p','p'),(85,2,'z','z'),
  (86,4,'t','t'),(87,7,'b','b'),(88,3,'y','y'),(89,8,'k','k'),(90,4,'c','c'),
  (91,6,'z','z'),(92,1,'t','t'),(93,7,'o','o'),(94,1,'u','u'),(95,0,'t','t'),
  (96,2,'k','k'),(97,7,'u','u'),(98,2,'b','b'),(99,1,'m','m'),(100,5,'o','o');

SELECT SUM(alias2.col_varchar_nokey) AS c1, alias2.pk AS c2
  FROM t1 AS alias1
  STRAIGHT_JOIN t2 AS alias2
  ON alias2.pk = alias1.col_int_key
  WHERE alias1.pk
  GROUP BY c2
  ORDER BY alias1.col_int_key, alias2.pk;

+------+----+
| c1   | c2 |
+------+----+
|    0 |  1 |
|    0 |  2 |
|    0 |  3 |
|    0 |  4 |
|    0 |  5 |
|    0 |  6 |
|    0 |  7 |
|    0 |  9 |
+------+----+
```

Note

For reference, the complete trace is shown uninterrupted at the end of this section.

Now we can examine the trace, whose first column (`QUERY`), containing the original statement to be traced, is shown here:

```sql
SELECT * FROM INFORMATION_SCHEMA.OPTIMIZER_TRACE\G
*************************** 1. row ***************************
QUERY: SELECT SUM(alias2.col_varchar_nokey) AS c1, alias2.pk AS c2
  FROM t1 AS alias1
  STRAIGHT_JOIN t2 AS alias2
  ON alias2.pk = alias1.col_int_key
  WHERE alias1.pk
  GROUP BY c2
  ORDER BY alias1.col_int_key, alias2.pk
```

This can be useful mark when several traces are stored.

The `TRACE` column begins by showing that execution of the statement is made up of discrete steps, like this:

```sql
"steps": [
  {
```

This is followed by the preparation of the join for the first (and only) `SELECT` in the statement being traced, as shown here:

```sql
"steps": [
  {
    "expanded_query": "/* select#1 */ select \
       sum(`test`.`alias2`.`col_varchar_nokey`) AS \
       `SUM(alias2.col_varchar_nokey)`,`test`.`alias2`.`pk` AS `field2` \
       from (`test`.`t1` `alias1` straight_join `test`.`t2` `alias2` \
       on((`test`.`alias2`.`pk` = `test`.`alias1`.`col_int_key`))) \
       where `test`.`alias1`.`pk` \
       group by `test`.`alias2`.`pk` \
       order by `test`.`alias1`.`col_int_key`,`test`.`alias2`.`pk`"
   }
] /* steps */
       } /* join_preparation */
     },
```

The output just shown displays the query as it is used for preparing the join; all columns (fields) have been resolved to their databases and tables, and each `SELECT` is annotated with a sequence number, which can be useful when studying subqueries.

The next portion of the trace shows how the join is optimized, starting with condition processing:

```sql
     {
      "join_optimization": {
               "select#": 1,
               "steps": [
                 {
                   "condition_processing": {
                     "condition": "WHERE",
                     "original_condition": "(`test`.`alias1`.`pk` and \
                     (`test`.`alias2`.`pk` = `test`.`alias1`.`col_int_key`))",
                     "steps": [
                       {
                         "transformation": "equality_propagation",
                         "resulting_condition": "(`test`.`alias1`.`pk` and \
                         multiple equal(`test`.`alias2`.`pk`, \
                         `test`.`alias1`.`col_int_key`))"
                       },
                       {
                         "transformation": "constant_propagation",
                         "resulting_condition": "(`test`.`alias1`.`pk` and \
                         multiple equal(`test`.`alias2`.`pk`, \
                         `test`.`alias1`.`col_int_key`))"
                       },
                       {
                         "transformation": "trivial_condition_removal",
                         "resulting_condition": "(`test`.`alias1`.`pk` and \
                         multiple equal(`test`.`alias2`.`pk`, \
                         `test`.`alias1`.`col_int_key`))"
                 }
               ] /* steps */
             } /* condition_processing */
           },
```

Next, the optimizer checks for possible `ref` accesses, and identifies one:

```sql
           {
             "ref_optimizer_key_uses": [
               {
                 "database": "test",
                 "table": "alias2",
                 "field": "pk",
                 "equals": "`test`.`alias1`.`col_int_key`",
                 "null_rejecting": true
              }
           ] /* ref_optimizer_key_uses */
         },
```

A `ref` access which rejects `NULL` has been identified: no `NULL` in `test.alias1.col_int_key` can have a match. (Observe that it could have a match, were the operator a null-safe equals `<=>`).

Next, for every table in the query, we estimate the cost of, and number of records returned by, a table scan or a range access.

We need to find an optimal order for the tables. Normally, greedy search is used, but since the statement uses a straight join, only the requested order is explored, and one or more access methods are selected. As shown in this portion of the trace, we can choose a table scan:

```sql
           {
"records_estimation": [
               {
                 "database": "test",
                 "table": "alias1",
                 "const_keys_added": {
                   "keys": [
                   ] /* keys */,
                   "cause": "group_by"
                 } /* const_keys_added */,
                 "range_analysis": {
                   "table_scan": {
                     "records": 20,
                     "cost": 8.1977
                   } /* table_scan */
                 } /* range_analysis */
               },
               {
                 "database": "test",
                 "table": "alias2",
                 "const_keys_added": {
                   "keys": [
                     "PRIMARY"
                   ] /* keys */,
                   "cause": "group_by"
                 } /* const_keys_added */,
                 "range_analysis": {
                   "table_scan": {
                     "records": 100,
                     "cost": 24.588
                   } /* table_scan */,
                   "potential_range_indices": [
                     {
                       "index": "PRIMARY",
                       "usable": true,
                       "key_parts": [
                         "pk"
                       ] /* key_parts */
                     }
                   ] /* potential_range_indices */,
                   "setup_range_conditions": [
                   ] /* setup_range_conditions */,
                   "group_index_range": {
                     "chosen": false,
                     "cause": "not_single_table"
                      } /* group_index_range */
                } /* range_analysis */
               }
             ] /* records_estimation */
           },
```

As just shown in the second portion of the range analysis, it is not possible to use `GROUP_MIN_MAX` because it accepts only one table, and we have two in the join. This means that no range access is possible.

The optimizer estimates that reading the first table, and applying any required conditions to it, yields 20 rows:

```sql
           {
"considered_execution_plans": [
               {
                 "database": "test",
                 "table": "alias1",
                 "best_access_path": {
                   "considered_access_paths": [
                     {
                       "access_type": "scan",
                       "records": 20,
                       "cost": 2.0977,
                       "chosen": true
                     }
                   ] /* considered_access_paths */
                 } /* best_access_path */,
                 "cost_for_plan": 6.0977,
                 "records_for_plan": 20,
```

For `alias2`, we choose `ref` access on the primary key rather than a table scan, because the number of records returned by the latter (75) is far greater than that returned by `ref` access (1), as shown here:

```sql
                 "rest_of_plan": [
                   {
                     "database": "test",
                     "table": "alias2",
                     "best_access_path": {
                       "considered_access_paths": [
                         {
                           "access_type": "ref",
                           "index": "PRIMARY",
                           "records": 1,
                           "cost": 20.2,
                           "chosen": true
                         },
                         {
                           "access_type": "scan",
                           "using_join_cache": true,
                           "records": 75,
                           "cost": 7.4917,
                           "chosen": false
                         }
                       ] /* considered_access_paths */
                     } /* best_access_path */,
                     "cost_for_plan": 30.098,
                     "records_for_plan": 20,
                     "chosen": true
                   }
                 ] /* rest_of_plan */
               }
             ] /* considered_execution_plans */
           },
```

Now that the order of tables is fixed, we can split the `WHERE` condition into chunks which can be tested early (pushdown of conditions down the join tree):

```sql
           {
              "attaching_conditions_to_tables": {
                "original_condition": "((`test`.`alias2`.`pk` = \
                `test`.`alias1`.`col_int_key`) and `test`.`alias1`.`pk`)",
                "attached_conditions_computation": [
                ] /* attached_conditions_computation */,
                "attached_conditions_summary": [
                  {
                    "database": "test",
                    "table": "alias1",
                    "attached": "(`test`.`alias1`.`pk` and \
                    (`test`.`alias1`.`col_int_key` is not null))"
           },
```

This condition can be tested on rows of `alias1` without reading rows from `alias2`.

```sql
                 {
                   "database": "test",
                   "table": "alias2",
                   "attached": null
                 }
               ] /* attached_conditions_summary */
             } /* attaching_conditions_to_tables */
           },
           {
```

Now we try to simplify the `ORDER BY`:

```sql
              "clause_processing": {
               "clause": "ORDER BY",
               "original_clause": "`test`.`alias1`.`col_int_key`,`test`.`alias2`.`pk`",
               "items": [
                 {
                   "item": "`test`.`alias1`.`col_int_key`"
                 },
                 {
                   "item": "`test`.`alias2`.`pk`",
                   "eq_ref_to_preceding_items": true
                 }
               ] /* items */,
```

Because the `WHERE` clause contains `alias2.pk=alias1.col_int_key`, ordering by both columns is unnecessary; we can order by the first column alone, since the second column is always equal to it.

```sql
               "resulting_clause_is_simple": true,
               "resulting_clause": "`test`.`alias1`.`col_int_key`"
              } /* clause_processing */
           },
```

The shorter `ORDER BY` clause (which is not visible in in the output of `EXPLAIN`) can be implemented as an index scan, since it uses only a single column of one table.

```sql
           {
             "clause_processing": {
               "clause": "GROUP BY",
               "original_clause": "`test`.`alias2`.`pk`",
               "items": [
                 {
                   "item": "`test`.`alias2`.`pk`"
                 }
               ] /* items */,
               "resulting_clause_is_simple": false,
               "resulting_clause": "`test`.`alias2`.`pk`"
             } /* clause_processing */
           },
           {
             "refine_plan": [
               {
                 "database": "test",
                 "table": "alias1",
                 "scan_type": "table"
               },
               {
                 "database": "test",
                 "table": "alias2"
               }
             ] /* refine_plan */
           }
         ] /* steps */
       } /* join_optimization */
     },
     {
```

Now the join is executed:

```sql
       "join_execution": {
         "select#": 1,
         "steps": [
         ] /* steps */
       } /* join_execution */
     }
   ] /* steps */
 }	0	0
```

All traces have the same basic structure. If a statement uses subqueries, there can be mutliple preparations, optimizations, and executions, as well as subquery-specific transformations.

The complete trace is shown here:

```sql
mysql> SELECT * FROM INFORMATION_SCHEMA.OPTIMIZER_TRACE\G
*************************** 1. row ***************************
                            QUERY: SELECT SUM(alias2.col_varchar_nokey) AS c1, alias2.pk AS c2
  FROM t1 AS alias1
  STRAIGHT_JOIN t2 AS alias2
  ON alias2.pk = alias1.col_int_key
  WHERE alias1.pk
  GROUP BY c2
  ORDER BY alias1.col_int_key, alias2.pk
                            TRACE: {
  "steps": [
    {
      "join_preparation": {
        "select#": 1,
        "steps": [
          {
            "expanded_query": "/* select#1 */ select sum(`alias2`.`col_varchar_nokey`) AS `c1`,`alias2`.`pk` AS `c2` from (`t1` `alias1` straight_join `t2` `alias2` on((`alias2`.`pk` = `alias1`.`col_int_key`))) where (0 <> `alias1`.`pk`) group by `c2` order by `alias1`.`col_int_key`,`alias2`.`pk`"
          },
          {
            "transformations_to_nested_joins": {
              "transformations": [
                "JOIN_condition_to_WHERE",
                "parenthesis_removal"
              ] /* transformations */,
              "expanded_query": "/* select#1 */ select sum(`alias2`.`col_varchar_nokey`) AS `c1`,`alias2`.`pk` AS `c2` from `t1` `alias1` straight_join `t2` `alias2` where ((0 <> `alias1`.`pk`) and (`alias2`.`pk` = `alias1`.`col_int_key`)) group by `c2` order by `alias1`.`col_int_key`,`alias2`.`pk`"
            } /* transformations_to_nested_joins */
          },
          {
            "functional_dependencies_of_GROUP_columns": {
              "all_columns_of_table_map_bits": [
                1
              ] /* all_columns_of_table_map_bits */,
              "columns": [
                "test.alias2.pk",
                "test.alias1.col_int_key"
              ] /* columns */
            } /* functional_dependencies_of_GROUP_columns */
          }
        ] /* steps */
      } /* join_preparation */
    },
    {
      "join_optimization": {
        "select#": 1,
        "steps": [
          {
            "condition_processing": {
              "condition": "WHERE",
              "original_condition": "((0 <> `alias1`.`pk`) and (`alias2`.`pk` = `alias1`.`col_int_key`))",
              "steps": [
                {
                  "transformation": "equality_propagation",
                  "resulting_condition": "((0 <> `alias1`.`pk`) and multiple equal(`alias2`.`pk`, `alias1`.`col_int_key`))"
                },
                {
                  "transformation": "constant_propagation",
                  "resulting_condition": "((0 <> `alias1`.`pk`) and multiple equal(`alias2`.`pk`, `alias1`.`col_int_key`))"
                },
                {
                  "transformation": "trivial_condition_removal",
                  "resulting_condition": "((0 <> `alias1`.`pk`) and multiple equal(`alias2`.`pk`, `alias1`.`col_int_key`))"
                }
              ] /* steps */
            } /* condition_processing */
          },
          {
            "substitute_generated_columns": {
            } /* substitute_generated_columns */
          },
          {
            "table_dependencies": [
              {
                "table": "`t1` `alias1`",
                "row_may_be_null": false,
                "map_bit": 0,
                "depends_on_map_bits": [
                ] /* depends_on_map_bits */
              },
              {
                "table": "`t2` `alias2`",
                "row_may_be_null": false,
                "map_bit": 1,
                "depends_on_map_bits": [
                  0
                ] /* depends_on_map_bits */
              }
            ] /* table_dependencies */
          },
          {
            "ref_optimizer_key_uses": [
              {
                "table": "`t2` `alias2`",
                "field": "pk",
                "equals": "`alias1`.`col_int_key`",
                "null_rejecting": true
              }
            ] /* ref_optimizer_key_uses */
          },
          {
            "rows_estimation": [
              {
                "table": "`t1` `alias1`",
                "table_scan": {
                  "rows": 20,
                  "cost": 0.25
                } /* table_scan */
              },
              {
                "table": "`t2` `alias2`",
                "const_keys_added": {
                  "keys": [
                    "PRIMARY"
                  ] /* keys */,
                  "cause": "group_by"
                } /* const_keys_added */,
                "range_analysis": {
                  "table_scan": {
                    "rows": 100,
                    "cost": 12.35
                  } /* table_scan */,
                  "potential_range_indexes": [
                    {
                      "index": "PRIMARY",
                      "usable": true,
                      "key_parts": [
                        "pk"
                      ] /* key_parts */
                    }
                  ] /* potential_range_indexes */,
                  "setup_range_conditions": [
                  ] /* setup_range_conditions */,
                  "group_index_skip_scan": {
                    "chosen": false,
                    "cause": "not_single_table"
                  } /* group_index_skip_scan */,
                  "skip_scan_range": {
                    "chosen": false,
                    "cause": "not_single_table"
                  } /* skip_scan_range */
                } /* range_analysis */
              }
            ] /* rows_estimation */
          },
          {
            "considered_execution_plans": [
              {
                "plan_prefix": [
                ] /* plan_prefix */,
                "table": "`t1` `alias1`",
                "best_access_path": {
                  "considered_access_paths": [
                    {
                      "rows_to_scan": 20,
                      "filtering_effect": [
                      ] /* filtering_effect */,
                      "final_filtering_effect": 0.9,
                      "access_type": "scan",
                      "resulting_rows": 18,
                      "cost": 2.25,
                      "chosen": true
                    }
                  ] /* considered_access_paths */
                } /* best_access_path */,
                "condition_filtering_pct": 100,
                "rows_for_plan": 18,
                "cost_for_plan": 2.25,
                "rest_of_plan": [
                  {
                    "plan_prefix": [
                      "`t1` `alias1`"
                    ] /* plan_prefix */,
                    "table": "`t2` `alias2`",
                    "best_access_path": {
                      "considered_access_paths": [
                        {
                          "access_type": "eq_ref",
                          "index": "PRIMARY",
                          "rows": 1,
                          "cost": 6.3,
                          "chosen": true,
                          "cause": "clustered_pk_chosen_by_heuristics"
                        },
                        {
                          "rows_to_scan": 100,
                          "filtering_effect": [
                          ] /* filtering_effect */,
                          "final_filtering_effect": 1,
                          "access_type": "scan",
                          "using_join_cache": true,
                          "buffers_needed": 1,
                          "resulting_rows": 100,
                          "cost": 180.25,
                          "chosen": false
                        }
                      ] /* considered_access_paths */
                    } /* best_access_path */,
                    "condition_filtering_pct": 100,
                    "rows_for_plan": 18,
                    "cost_for_plan": 8.55,
                    "chosen": true
                  }
                ] /* rest_of_plan */
              }
            ] /* considered_execution_plans */
          },
          {
            "attaching_conditions_to_tables": {
              "original_condition": "((`alias2`.`pk` = `alias1`.`col_int_key`) and (0 <> `alias1`.`pk`))",
              "attached_conditions_computation": [
              ] /* attached_conditions_computation */,
              "attached_conditions_summary": [
                {
                  "table": "`t1` `alias1`",
                  "attached": "((0 <> `alias1`.`pk`) and (`alias1`.`col_int_key` is not null))"
                },
                {
                  "table": "`t2` `alias2`",
                  "attached": "(`alias2`.`pk` = `alias1`.`col_int_key`)"
                }
              ] /* attached_conditions_summary */
            } /* attaching_conditions_to_tables */
          },
          {
            "optimizing_distinct_group_by_order_by": {
              "simplifying_order_by": {
                "original_clause": "`alias1`.`col_int_key`,`alias2`.`pk`",
                "items": [
                  {
                    "item": "`alias1`.`col_int_key`"
                  },
                  {
                    "item": "`alias2`.`pk`",
                    "eq_ref_to_preceding_items": true
                  }
                ] /* items */,
                "resulting_clause_is_simple": true,
                "resulting_clause": "`alias1`.`col_int_key`"
              } /* simplifying_order_by */,
              "simplifying_group_by": {
                "original_clause": "`c2`",
                "items": [
                  {
                    "item": "`alias2`.`pk`"
                  }
                ] /* items */,
                "resulting_clause_is_simple": false,
                "resulting_clause": "`c2`"
              } /* simplifying_group_by */
            } /* optimizing_distinct_group_by_order_by */
          },
          {
            "finalizing_table_conditions": [
              {
                "table": "`t1` `alias1`",
                "original_table_condition": "((0 <> `alias1`.`pk`) and (`alias1`.`col_int_key` is not null))",
                "final_table_condition   ": "((0 <> `alias1`.`pk`) and (`alias1`.`col_int_key` is not null))"
              },
              {
                "table": "`t2` `alias2`",
                "original_table_condition": "(`alias2`.`pk` = `alias1`.`col_int_key`)",
                "final_table_condition   ": null
              }
            ] /* finalizing_table_conditions */
          },
          {
            "refine_plan": [
              {
                "table": "`t1` `alias1`"
              },
              {
                "table": "`t2` `alias2`"
              }
            ] /* refine_plan */
          },
          {
            "considering_tmp_tables": [
              {
                "adding_tmp_table_in_plan_at_position": 2,
                "write_method": "continuously_update_group_row"
              },
              {
                "adding_sort_to_table": ""
              } /* filesort */
            ] /* considering_tmp_tables */
          }
        ] /* steps */
      } /* join_optimization */
    },
    {
      "join_execution": {
        "select#": 1,
        "steps": [
          {
            "temp_table_aggregate": {
              "select#": 1,
              "steps": [
                {
                  "creating_tmp_table": {
                    "tmp_table_info": {
                      "table": "<temporary>",
                      "in_plan_at_position": 2,
                      "columns": 3,
                      "row_length": 18,
                      "key_length": 4,
                      "unique_constraint": false,
                      "makes_grouped_rows": true,
                      "cannot_insert_duplicates": false,
                      "location": "TempTable"
                    } /* tmp_table_info */
                  } /* creating_tmp_table */
                }
              ] /* steps */
            } /* temp_table_aggregate */
          },
          {
            "sorting_table": "<temporary>",
            "filesort_information": [
              {
                "direction": "asc",
                "expression": "`alias1`.`col_int_key`"
              }
            ] /* filesort_information */,
            "filesort_priority_queue_optimization": {
              "usable": false,
              "cause": "not applicable (no LIMIT)"
            } /* filesort_priority_queue_optimization */,
            "filesort_execution": [
            ] /* filesort_execution */,
            "filesort_summary": {
              "memory_available": 262144,
              "key_size": 9,
              "row_size": 26,
              "max_rows_per_buffer": 7710,
              "num_rows_estimate": 18446744073709551615,
              "num_rows_found": 8,
              "num_initial_chunks_spilled_to_disk": 0,
              "peak_memory_used": 32832,
              "sort_algorithm": "std::sort",
              "unpacked_addon_fields": "skip_heuristic",
              "sort_mode": "<fixed_sort_key, additional_fields>"
            } /* filesort_summary */
          }
        ] /* steps */
      } /* join_execution */
    }
  ] /* steps */
}
MISSING_BYTES_BEYOND_MAX_MEM_SIZE: 0
          INSUFFICIENT_PRIVILEGES: 0
```


### 8.15.13 Displaying Traces in Other Applications

Examining a trace in the **mysql** command-line client can be made less difficult using the `pager less` command (or your operating platform's equivalent). An alternative can be to send the trace to a file, similarly to what is shown here:

```sql
SELECT TRACE INTO DUMPFILE file
FROM INFORMATION_SCHEMA.OPTIMIZER_TRACE;
```

You can then pass this file to a JSON-aware text editor or other viewer, such as the [JsonView add-on for Firefox and Chrome](https://jsonview.com/), which shows objects in color and allows objects to be expanded or collapsed.

`INTO DUMPFILE` is preferable to `INTO OUTFILE` for this purpose, since the latter escapes newlines. As noted previously, you should ensure that `end_markers_in_json` is `OFF`when executing the `SELECT INTO` statement, so that the output is valid JSON.


### 8.15.14 Preventing the Use of Optimizer Trace

If, for some reason, you wish to prevent users from seeing traces of their queries, start the server with the options shown here:

```sql
--maximum-optimizer-trace-max-mem-size=0 --optimizer-trace-max-mem-size=0
```

This sets the maximum size to 0 and prevents users from changing this limit, thus truncating all traces to 0 bytes.


### 8.15.15 Testing Optimizer Trace

This feature is tested in `mysql-test/suite/opt_trace` and `unittest/gunit/opt_trace-t`.


### 8.15.16 Optimizer Trace Implementation

See the files `sql/opt_trace*`, starting with `sql/opt_trace.h`. A trace is started by creating an instance of `Opt_trace_start`; information is added to this trace by creating instances of `Opt_trace_object` and `Opt_trace_array`, and by using the `add()` methods of these classes.
