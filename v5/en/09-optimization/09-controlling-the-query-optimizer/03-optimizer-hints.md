### 8.9.3 Optimizer Hints

One means of control over optimizer strategies is to set the `optimizer_switch` system variable (see Section 8.9.2, “Switchable Optimizations”). Changes to this variable affect execution of all subsequent queries; to affect one query differently from another, it is necessary to change `optimizer_switch` before each one.

another way to control the optimizer is by using optimizer hints, which can be specified within individual statements. Because optimizer hints apply on a per-statement basis, they provide finer control over statement execution plans than can be achieved using `optimizer_switch`. For example, you can enable an optimization for one table in a statement and disable the optimization for a different table. Hints within a statement take precedence over `optimizer_switch` flags.

Examples:

```sql
SELECT /*+ NO_RANGE_OPTIMIZATION(t3 PRIMARY, f2_idx) */ f1
  FROM t3 WHERE f1 > 30 AND f1 < 33;
SELECT /*+ BKA(t1) NO_BKA(t2) */ * FROM t1 INNER JOIN t2 WHERE ...;
SELECT /*+ NO_ICP(t1, t2) */ * FROM t1 INNER JOIN t2 WHERE ...;
SELECT /*+ SEMIJOIN(FIRSTMATCH, LOOSESCAN) */ * FROM t1 ...;
EXPLAIN SELECT /*+ NO_ICP(t1) */ * FROM t1 WHERE ...;
```

Note

The **mysql** client by default strips comments from SQL statements sent to the server (including optimizer hints) until MySQL 5.7.7, when it was changed to pass optimizer hints to the server. To ensure that optimizer hints are not stripped if you are using an older version of the **mysql** client with a version of the server that understands optimizer hints, invoke **mysql** with the `--comments` option.

Optimizer hints, described here, differ from index hints, described in Section 8.9.4, “Index Hints”. Optimizer and index hints may be used separately or together.

* Optimizer Hint Overview
* Optimizer Hint Syntax
* Table-Level Optimizer Hints
* Index-Level Optimizer Hints
* Subquery Optimizer Hints
* Statement Execution Time Optimizer Hints
* Optimizer Hints for Naming Query Blocks

#### Optimizer Hint Overview

Optimizer hints apply at different scope levels:

* Global: The hint affects the entire statement
* Query block: The hint affects a particular query block within a statement

* Table-level: The hint affects a particular table within a query block

* Index-level: The hint affects a particular index within a table

The following table summarizes the available optimizer hints, the optimizer strategies they affect, and the scope or scopes at which they apply. More details are given later.

**Table 8.2 Optimizer Hints Available**

<table summary="Optimizer hint names, descriptions, and contexts in which they apply."><col style="width: 30%"/><col style="width: 40%"/><col style="width: 30%"/><thead><tr> <th>Hint Name</th> <th>Description</th> <th>Applicable Scopes</th> </tr></thead><tbody><tr> <th><a class="link" href="optimizer-hints.html#optimizer-hints-table-level" title="Table-Level Optimizer Hints"><code>BKA</code></a>, <a class="link" href="optimizer-hints.html#optimizer-hints-table-level" title="Table-Level Optimizer Hints"><code>NO_BKA</code></a></th> <td>Affects Batched Key Access join processing</td> <td>Query block, table</td> </tr><tr> <th><a class="link" href="optimizer-hints.html#optimizer-hints-table-level" title="Table-Level Optimizer Hints"><code>BNL</code></a>, <a class="link" href="optimizer-hints.html#optimizer-hints-table-level" title="Table-Level Optimizer Hints"><code>NO_BNL</code></a></th> <td>Affects Block Nested-Loop join processing</td> <td>Query block, table</td> </tr><tr> <th><a class="link" href="optimizer-hints.html#optimizer-hints-execution-time" title="Statement Execution Time Optimizer Hints"><code>MAX_EXECUTION_TIME</code></a></th> <td>Limits statement execution time</td> <td>Global</td> </tr><tr> <th><a class="link" href="optimizer-hints.html#optimizer-hints-index-level" title="Index-Level Optimizer Hints"><code>MRR</code></a>, <a class="link" href="optimizer-hints.html#optimizer-hints-index-level" title="Index-Level Optimizer Hints"><code>NO_MRR</code></a></th> <td>Affects Multi-Range Read optimization</td> <td>Table, index</td> </tr><tr> <th><a class="link" href="optimizer-hints.html#optimizer-hints-index-level" title="Index-Level Optimizer Hints"><code>NO_ICP</code></a></th> <td>Affects Index Condition Pushdown optimization</td> <td>Table, index</td> </tr><tr> <th><a class="link" href="optimizer-hints.html#optimizer-hints-index-level" title="Index-Level Optimizer Hints"><code>NO_RANGE_OPTIMIZATION</code></a></th> <td>Affects range optimization</td> <td>Table, index</td> </tr><tr> <th><a class="link" href="optimizer-hints.html#optimizer-hints-query-block-naming" title="Optimizer Hints for Naming Query Blocks"><code>QB_NAME</code></a></th> <td>Assigns name to query block</td> <td>Query block</td> </tr><tr> <th><a class="link" href="optimizer-hints.html#optimizer-hints-subquery" title="Subquery Optimizer Hints"><code>SEMIJOIN</code></a>, <a class="link" href="optimizer-hints.html#optimizer-hints-subquery" title="Subquery Optimizer Hints"><code>NO_SEMIJOIN</code></a></th> <td>semijoin strategies</td> <td>Query block</td> </tr><tr> <th><a class="link" href="optimizer-hints.html#optimizer-hints-subquery" title="Subquery Optimizer Hints"><code>SUBQUERY</code></a></th> <td>Affects materialization, <code>IN</code>-to-<code>EXISTS</code> subquery stratgies</td> <td>Query block</td> </tr></tbody></table>

Disabling an optimization prevents the optimizer from using it. Enabling an optimization means the optimizer is free to use the strategy if it applies to statement execution, not that the optimizer necessarily uses it.

#### Optimizer Hint Syntax

MySQL supports comments in SQL statements as described in Section 9.6, “Comments”. Optimizer hints must be specified within `/*+ ... */` comments. That is, optimizer hints use a variant of `/* ... */` C-style comment syntax, with a `+` character following the `/*` comment opening sequence. Examples:

```sql
/*+ BKA(t1) */
/*+ BNL(t1, t2) */
/*+ NO_RANGE_OPTIMIZATION(t4 PRIMARY) */
/*+ QB_NAME(qb2) */
```

Whitespace is permitted after the `+` character.

The parser recognizes optimizer hint comments after the initial keyword of `SELECT`, `UPDATE`, `INSERT`, `REPLACE`, and `DELETE` statements. Hints are permitted in these contexts:

* At the beginning of query and data change statements:

  ```sql
  SELECT /*+ ... */ ...
  INSERT /*+ ... */ ...
  REPLACE /*+ ... */ ...
  UPDATE /*+ ... */ ...
  DELETE /*+ ... */ ...
  ```

* At the beginning of query blocks:

  ```sql
  (SELECT /*+ ... */ ... )
  (SELECT ... ) UNION (SELECT /*+ ... */ ... )
  (SELECT /*+ ... */ ... ) UNION (SELECT /*+ ... */ ... )
  UPDATE ... WHERE x IN (SELECT /*+ ... */ ...)
  INSERT ... SELECT /*+ ... */ ...
  ```

* In hintable statements prefaced by `EXPLAIN`. For example:

  ```sql
  EXPLAIN SELECT /*+ ... */ ...
  EXPLAIN UPDATE ... WHERE x IN (SELECT /*+ ... */ ...)
  ```

  The implication is that you can use `EXPLAIN` to see how optimizer hints affect execution plans. Use `SHOW WARNINGS` immediately after `EXPLAIN` to see how hints are used. The extended `EXPLAIN` output displayed by a following `SHOW WARNINGS` indicates which hints were used. Ignored hints are not displayed.

A hint comment may contain multiple hints, but a query block cannot contain multiple hint comments. This is valid:

```sql
SELECT /*+ BNL(t1) BKA(t2) */ ...
```

But this is invalid:

```sql
SELECT /*+ BNL(t1) */ /* BKA(t2) */ ...
```

When a hint comment contains multiple hints, the possibility of duplicates and conflicts exists. The following general guidelines apply. For specific hint types, additional rules may apply, as indicated in the hint descriptions.

* Duplicate hints: For a hint such as `/*+ MRR(idx1) MRR(idx1) */`, MySQL uses the first hint and issues a warning about the duplicate hint.

* Conflicting hints: For a hint such as `/*+ MRR(idx1) NO_MRR(idx1) */`, MySQL uses the first hint and issues a warning about the second conflicting hint.

Query block names are identifiers and follow the usual rules about what names are valid and how to quote them (see Section 9.2, “Schema Object Names”).

Hint names, query block names, and strategy names are not case-sensitive. References to table and index names follow the usual identifier case sensitivity rules (see Section 9.2.3, “Identifier Case Sensitivity”).

#### Table-Level Optimizer Hints

Table-level hints affect use of the Block Nested-Loop (BNL) and Batched Key Access (BKA) join-processing algorithms (see Section 8.2.1.11, “Block Nested-Loop and Batched Key Access Joins”). These hint types apply to specific tables, or all tables in a query block.

Syntax of table-level hints:

```sql
hint_name([@query_block_name] [tbl_name [, tbl_name] ...])
hint_name([tbl_name@query_block_name [, tbl_name@query_block_name] ...])
```

The syntax refers to these terms:

* *`hint_name`*: These hint names are permitted:

  + `BKA`, `NO_BKA`: Enable or disable BKA for the specified tables.

  + `BNL`, `NO_BNL`: Enable or disable BNL for the specified tables.

  Note

  To use a BNL or BKA hint to enable join buffering for any inner table of an outer join, join buffering must be enabled for all inner tables of the outer join.

* *`tbl_name`*: The name of a table used in the statement. The hint applies to all tables that it names. If the hint names no tables, it applies to all tables of the query block in which it occurs.

  If a table has an alias, hints must refer to the alias, not the table name.

  Table names in hints cannot be qualified with schema names.

* *`query_block_name`*: The query block to which the hint applies. If the hint includes no leading `@query_block_name`, the hint applies to the query block in which it occurs. For `tbl_name@query_block_name` syntax, the hint applies to the named table in the named query block. To assign a name to a query block, see Optimizer Hints for Naming Query Blocks.

Examples:

```sql
SELECT /*+ NO_BKA(t1, t2) */ t1.* FROM t1 INNER JOIN t2 INNER JOIN t3;
SELECT /*+ NO_BNL() BKA(t1) */ t1.* FROM t1 INNER JOIN t2 INNER JOIN t3;
```

A table-level hint applies to tables that receive records from previous tables, not sender tables. Consider this statement:

```sql
SELECT /*+ BNL(t2) */ FROM t1, t2;
```

If the optimizer chooses to process `t1` first, it applies a Block Nested-Loop join to `t2` by buffering the rows from `t1` before starting to read from `t2`. If the optimizer instead chooses to process `t2` first, the hint has no effect because `t2` is a sender table.

#### Index-Level Optimizer Hints

Index-level hints affect which index-processing strategies the optimizer uses for particular tables or indexes. These hint types affect use of Index Condition Pushdown (ICP), Multi-Range Read (MRR), and range optimizations (see Section 8.2.1, “Optimizing SELECT Statements”).

Syntax of index-level hints:

```sql
hint_name([@query_block_name] tbl_name [index_name [, index_name] ...])
hint_name(tbl_name@query_block_name [index_name [, index_name] ...])
```

The syntax refers to these terms:

* *`hint_name`*: These hint names are permitted:

  + `MRR`, `NO_MRR`: Enable or disable MRR for the specified table or indexes. MRR hints apply only to `InnoDB` and `MyISAM` tables.

  + `NO_ICP`: Disable ICP for the specified table or indexes. By default, ICP is a candidate optimization strategy, so there is no hint for enabling it.

  + `NO_RANGE_OPTIMIZATION`: Disable index range access for the specified table or indexes. This hint also disables Index Merge and Loose Index Scan for the table or indexes. By default, range access is a candidate optimization strategy, so there is no hint for enabling it.

    This hint may be useful when the number of ranges may be high and range optimization would require many resources.

* *`tbl_name`*: The table to which the hint applies.

* *`index_name`*: The name of an index in the named table. The hint applies to all indexes that it names. If the hint names no indexes, it applies to all indexes in the table.

  To refer to a primary key, use the name `PRIMARY`. To see the index names for a table, use `SHOW INDEX`.

* *`query_block_name`*: The query block to which the hint applies. If the hint includes no leading `@query_block_name`, the hint applies to the query block in which it occurs. For `tbl_name@query_block_name` syntax, the hint applies to the named table in the named query block. To assign a name to a query block, see Optimizer Hints for Naming Query Blocks.

Examples:

```sql
SELECT /*+ MRR(t1) */ * FROM t1 WHERE f2 <= 3 AND 3 <= f3;
SELECT /*+ NO_RANGE_OPTIMIZATION(t3 PRIMARY, f2_idx) */ f1
  FROM t3 WHERE f1 > 30 AND f1 < 33;
INSERT INTO t3(f1, f2, f3)
  (SELECT /*+ NO_ICP(t2) */ t2.f1, t2.f2, t2.f3 FROM t1,t2
   WHERE t1.f1=t2.f1 AND t2.f2 BETWEEN t1.f1
   AND t1.f2 AND t2.f2 + 1 >= t1.f1 + 1);
```

#### Subquery Optimizer Hints

Subquery hints affect whether to use semijoin transformations and which semijoin strategies to permit, and, when semijoins are not used, whether to use subquery materialization or `IN`-to-`EXISTS` transformations. For more information about these optimizations, see Section 8.2.2, “Optimizing Subqueries, Derived Tables, and View References”.

Syntax of hints that affect semijoin strategies:

```sql
hint_name([@query_block_name] [strategy [, strategy] ...])
```

The syntax refers to these terms:

* *`hint_name`*: These hint names are permitted:

  + `SEMIJOIN`, `NO_SEMIJOIN`: Enable or disable the named semijoin strategies.

* *`strategy`*: A semijoin strategy to be enabled or disabled. These strategy names are permitted: `DUPSWEEDOUT`, `FIRSTMATCH`, `LOOSESCAN`, `MATERIALIZATION`.

  For `SEMIJOIN` hints, if no strategies are named, semijoin is used if possible based on the strategies enabled according to the `optimizer_switch` system variable. If strategies are named but inapplicable for the statement, `DUPSWEEDOUT` is used.

  For `NO_SEMIJOIN` hints, if no strategies are named, semijoin is not used. If strategies are named that rule out all applicable strategies for the statement, `DUPSWEEDOUT` is used.

If one subquery is nested within another and both are merged into a semijoin of an outer query, any specification of semijoin strategies for the innermost query are ignored. `SEMIJOIN` and `NO_SEMIJOIN` hints can still be used to enable or disable semijoin transformations for such nested subqueries.

If `DUPSWEEDOUT` is disabled, on occasion the optimizer may generate a query plan that is far from optimal. This occurs due to heuristic pruning during greedy search, which can be avoided by setting `optimizer_prune_level=0`.

Examples:

```sql
SELECT /*+ NO_SEMIJOIN(@subq1 FIRSTMATCH, LOOSESCAN) */ * FROM t2
  WHERE t2.a IN (SELECT /*+ QB_NAME(subq1) */ a FROM t3);
SELECT /*+ SEMIJOIN(@subq1 MATERIALIZATION, DUPSWEEDOUT) */ * FROM t2
  WHERE t2.a IN (SELECT /*+ QB_NAME(subq1) */ a FROM t3);
```

Syntax of hints that affect whether to use subquery materialization or `IN`-to-`EXISTS` transformations:

```sql
SUBQUERY([@query_block_name] strategy)
```

The hint name is always `SUBQUERY`.

For `SUBQUERY` hints, these *`strategy`* values are permitted: `INTOEXISTS`, `MATERIALIZATION`.

Examples:

```sql
SELECT id, a IN (SELECT /*+ SUBQUERY(MATERIALIZATION) */ a FROM t1) FROM t2;
SELECT * FROM t2 WHERE t2.a IN (SELECT /*+ SUBQUERY(INTOEXISTS) */ a FROM t1);
```

For semijoin and `SUBQUERY` hints, a leading `@query_block_name` specifies the query block to which the hint applies. If the hint includes no leading `@query_block_name`, the hint applies to the query block in which it occurs. To assign a name to a query block, see Optimizer Hints for Naming Query Blocks.

If a hint comment contains multiple subquery hints, the first is used. If there are other following hints of that type, they produce a warning. Following hints of other types are silently ignored.

#### Statement Execution Time Optimizer Hints

The `MAX_EXECUTION_TIME` hint is permitted only for `SELECT` statements. It places a limit *`N`* (a timeout value in milliseconds) on how long a statement is permitted to execute before the server terminates it:

```sql
MAX_EXECUTION_TIME(N)
```

Example with a timeout of 1 second (1000 milliseconds):

```sql
SELECT /*+ MAX_EXECUTION_TIME(1000) */ * FROM t1 INNER JOIN t2 WHERE ...
```

The `MAX_EXECUTION_TIME(N)` hint sets a statement execution timeout of *`N`* milliseconds. If this option is absent or *`N`* is 0, the statement timeout established by the `max_execution_time` system variable applies.

The `MAX_EXECUTION_TIME` hint is applicable as follows:

* For statements with multiple `SELECT` keywords, such as unions or statements with subqueries, `MAX_EXECUTION_TIME` applies to the entire statement and must appear after the first `SELECT`.

* It applies to read-only `SELECT` statements. Statements that are not read only are those that invoke a stored function that modifies data as a side effect.

* It does not apply to `SELECT` statements in stored programs and is ignored.

#### Optimizer Hints for Naming Query Blocks

Table-level, index-level, and subquery optimizer hints permit specific query blocks to be named as part of their argument syntax. To create these names, use the `QB_NAME` hint, which assigns a name to the query block in which it occurs:

```sql
QB_NAME(name)
```

`QB_NAME` hints can be used to make explicit in a clear way which query blocks other hints apply to. They also permit all non-query block name hints to be specified within a single hint comment for easier understanding of complex statements. Consider the following statement:

```sql
SELECT ...
  FROM (SELECT ...
  FROM (SELECT ... FROM ...)) ...
```

`QB_NAME` hints assign names to query blocks in the statement:

```sql
SELECT /*+ QB_NAME(qb1) */ ...
  FROM (SELECT /*+ QB_NAME(qb2) */ ...
  FROM (SELECT /*+ QB_NAME(qb3) */ ... FROM ...)) ...
```

Then other hints can use those names to refer to the appropriate query blocks:

```sql
SELECT /*+ QB_NAME(qb1) MRR(@qb1 t1) BKA(@qb2) NO_MRR(@qb3t1 idx1, id2) */ ...
  FROM (SELECT /*+ QB_NAME(qb2) */ ...
  FROM (SELECT /*+ QB_NAME(qb3) */ ... FROM ...)) ...
```

The resulting effect is as follows:

* `MRR(@qb1 t1)` applies to table `t1` in query block `qb1`.

* `BKA(@qb2)` applies to query block `qb2`.

* `NO_MRR(@qb3 t1 idx1, id2)` applies to indexes `idx1` and `idx2` in table `t1` in query block `qb3`.

Query block names are identifiers and follow the usual rules about what names are valid and how to quote them (see Section 9.2, “Schema Object Names”). For example, a query block name that contains spaces must be quoted, which can be done using backticks:

```sql
SELECT /*+ BKA(@`my hint name`) */ ...
  FROM (SELECT /*+ QB_NAME(`my hint name`) */ ...) ...
```

If the `ANSI_QUOTES` SQL mode is enabled, it is also possible to quote query block names within double quotation marks:

```sql
SELECT /*+ BKA(@"my hint name") */ ...
  FROM (SELECT /*+ QB_NAME("my hint name") */ ...) ...
```
