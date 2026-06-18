### 8.9.2 Switchable Optimizations

The [`optimizer_switch`](server-system-variables.html#sysvar_optimizer_switch) system
variable enables control over optimizer behavior. Its value is a
set of flags, each of which has a value of `on`
or `off` to indicate whether the corresponding
optimizer behavior is enabled or disabled. This variable has
global and session values and can be changed at runtime. The
global default can be set at server startup.

To see the current set of optimizer flags, select the variable
value:

```sql
mysql> SELECT @@optimizer_switch\G
*************************** 1. row ***************************
@@optimizer_switch: index_merge=on,index_merge_union=on,
                    index_merge_sort_union=on,
                    index_merge_intersection=on,
                    engine_condition_pushdown=on,
                    index_condition_pushdown=on,
                    mrr=on,mrr_cost_based=on,
                    block_nested_loop=on,batched_key_access=off,
                    materialization=on,semijoin=on,loosescan=on,
                    firstmatch=on,duplicateweedout=on,
                    subquery_materialization_cost_based=on,
                    use_index_extensions=on,
                    condition_fanout_filter=on,derived_merge=on,
                    prefer_ordering_index=on
```

To change the value of
[`optimizer_switch`](server-system-variables.html#sysvar_optimizer_switch), assign a
value consisting of a comma-separated list of one or more
commands:

```sql
SET [GLOBAL|SESSION] optimizer_switch='command[,command]...';
```

Each *`command`* value should have one of
the forms shown in the following table.

<table summary="The syntax of the command value for SET optimizer_switch commands."><col style="width: 25%"/><col style="width: 75%"/><thead><tr>
<th>Command Syntax</th>
<th>Meaning</th>
</tr></thead><tbody><tr>
<td><code>default</code></td>
<td>Reset every optimization to its default value</td>
</tr><tr>
<td><code><em class="replaceable"><code>opt_name</code></em>=default</code></td>
<td>Set the named optimization to its default value</td>
</tr><tr>
<td><code><em class="replaceable"><code>opt_name</code></em>=off</code></td>
<td>Disable the named optimization</td>
</tr><tr>
<td><code><em class="replaceable"><code>opt_name</code></em>=on</code></td>
<td>Enable the named optimization</td>
</tr></tbody></table>

The order of the commands in the value does not matter, although
the `default` command is executed first if
present. Setting an *`opt_name`* flag to
`default` sets it to whichever of
`on` or `off` is its default
value. Specifying any given *`opt_name`*
more than once in the value is not permitted and causes an
error. Any errors in the value cause the assignment to fail with
an error, leaving the value of
[`optimizer_switch`](server-system-variables.html#sysvar_optimizer_switch) unchanged.

The following list describes the permissible
*`opt_name`* flag names, grouped by
optimization strategy:

* Batched Key Access Flags

  + [`batched_key_access`](switchable-optimizations.html#optflag_batched-key-access)
    (default `off`)

    Controls use of BKA join algorithm.

  For [`batched_key_access`](switchable-optimizations.html#optflag_batched-key-access) to
  have any effect when set to `on`, the
  [`mrr`](switchable-optimizations.html#optflag_mrr) flag must also be
  `on`. Currently, the cost estimation for
  MRR is too pessimistic. Hence, it is also necessary for
  [`mrr_cost_based`](switchable-optimizations.html#optflag_mrr-cost-based) to be
  `off` for BKA to be used.

  For more information, see
  [Section 8.2.1.11, “Block Nested-Loop and Batched Key Access Joins”](bnl-bka-optimization.html "8.2.1.11 Block Nested-Loop and Batched Key Access Joins").

* Block Nested-Loop Flags

  + [`block_nested_loop`](switchable-optimizations.html#optflag_block-nested-loop)
    (default `on`)

    Controls use of BNL join algorithm.

  For more information, see
  [Section 8.2.1.11, “Block Nested-Loop and Batched Key Access Joins”](bnl-bka-optimization.html "8.2.1.11 Block Nested-Loop and Batched Key Access Joins").

* Condition Filtering Flags

  + [`condition_fanout_filter`](switchable-optimizations.html#optflag_condition-fanout-filter)
    (default `on`)

    Controls use of condition filtering.

  For more information, see
  [Section 8.2.1.12, “Condition Filtering”](condition-filtering.html "8.2.1.12 Condition Filtering").

* Derived Table Merging Flags

  + [`derived_merge`](switchable-optimizations.html#optflag_derived-merge) (default
    `on`)

    Controls merging of derived tables and views into outer
    query block.

  The [`derived_merge`](switchable-optimizations.html#optflag_derived-merge) flag
  controls whether the optimizer attempts to merge derived
  tables and view references into the outer query block,
  assuming that no other rule prevents merging; for example,
  an `ALGORITHM` directive for a view takes
  precedence over the
  [`derived_merge`](switchable-optimizations.html#optflag_derived-merge) setting. By
  default, the flag is `on` to enable
  merging.

  For more information, see
  [Section 8.2.2.4, “Optimizing Derived Tables and View References with Merging or
  Materialization”](derived-table-optimization.html "8.2.2.4 Optimizing Derived Tables and View References with Merging or Materialization").

* Engine Condition Pushdown Flags

  + [`engine_condition_pushdown`](switchable-optimizations.html#optflag_engine-condition-pushdown)
    (default `on`)

    Controls engine condition pushdown.

  For more information, see
  [Section 8.2.1.4, “Engine Condition Pushdown Optimization”](engine-condition-pushdown-optimization.html "8.2.1.4 Engine Condition Pushdown Optimization").

* Index Condition Pushdown Flags

  + [`index_condition_pushdown`](switchable-optimizations.html#optflag_index-condition-pushdown)
    (default `on`)

    Controls index condition pushdown.

  For more information, see
  [Section 8.2.1.5, “Index Condition Pushdown Optimization”](index-condition-pushdown-optimization.html "8.2.1.5 Index Condition Pushdown Optimization").

* Index Extensions Flags

  + [`use_index_extensions`](switchable-optimizations.html#optflag_use-index-extensions)
    (default `on`)

    Controls use of index extensions.

  For more information, see
  [Section 8.3.9, “Use of Index Extensions”](index-extensions.html "8.3.9 Use of Index Extensions").

* Index Merge Flags

  + [`index_merge`](switchable-optimizations.html#optflag_index-merge) (default
    `on`)

    Controls all Index Merge optimizations.

  + [`index_merge_intersection`](switchable-optimizations.html#optflag_index-merge-intersection)
    (default `on`)

    Controls the Index Merge Intersection Access
    optimization.

  + [`index_merge_sort_union`](switchable-optimizations.html#optflag_index-merge-sort-union)
    (default `on`)

    Controls the Index Merge Sort-Union Access optimization.

  + [`index_merge_union`](switchable-optimizations.html#optflag_index-merge-union)
    (default `on`)

    Controls the Index Merge Union Access optimization.

  For more information, see
  [Section 8.2.1.3, “Index Merge Optimization”](index-merge-optimization.html "8.2.1.3 Index Merge Optimization").

* Limit Optimization Flags

  + [`prefer_ordering_index`](switchable-optimizations.html#optflag_prefer-ordering-index)
    (default `on`)

    Controls whether, in the case of a query having an
    `ORDER BY` or `GROUP
    BY` with a `LIMIT` clause, the
    optimizer tries to use an ordered index instead of an
    unordered index, a filesort, or some other optimization.
    This optimzation is performed by default whenever the
    optimizer determines that using it would allow for
    faster execution of the query.

    Because the algorithm that makes this determination
    cannot handle every conceivable case (due in part to the
    assumption that the distribution of data is always more
    or less uniform), there are cases in which this
    optimization may not be desirable. Prior to MySQL
    5.7.33, it ws not possible to disable this optimization,
    but in MySQL 5.7.33 and later, while it remains the
    default behavior, it can be disabled by setting the
    [`prefer_ordering_index`](switchable-optimizations.html#optflag_prefer-ordering-index)
    flag to `off`.

  For more information and examples, see
  [Section 8.2.1.17, “LIMIT Query Optimization”](limit-optimization.html "8.2.1.17 LIMIT Query Optimization").

* Multi-Range Read Flags

  + [`mrr`](switchable-optimizations.html#optflag_mrr) (default
    `on`)

    Controls the Multi-Range Read strategy.

  + [`mrr_cost_based`](switchable-optimizations.html#optflag_mrr-cost-based)
    (default `on`)

    Controls use of cost-based MRR if
    [`mrr=on`](switchable-optimizations.html#optflag_mrr).

  For more information, see
  [Section 8.2.1.10, “Multi-Range Read Optimization”](mrr-optimization.html "8.2.1.10 Multi-Range Read Optimization").

* Semijoin Flags

  + [`duplicateweedout`](switchable-optimizations.html#optflag_duplicateweedout)
    (default `on`)

    Controls the semijoin Duplicate Weedout strategy.

  + [`firstmatch`](switchable-optimizations.html#optflag_firstmatch) (default
    `on`)

    Controls the semijoin FirstMatch strategy.

  + [`loosescan`](switchable-optimizations.html#optflag_loosescan) (default
    `on`)

    Controls the semijoin LooseScan strategy (not to be
    confused with Loose Index Scan for `GROUP
    BY`).

  + [`semijoin`](switchable-optimizations.html#optflag_semijoin) (default
    `on`)

    Controls all semijoin strategies.

  The [`semijoin`](switchable-optimizations.html#optflag_semijoin),
  [`firstmatch`](switchable-optimizations.html#optflag_firstmatch),
  [`loosescan`](switchable-optimizations.html#optflag_loosescan), and
  [`duplicateweedout`](switchable-optimizations.html#optflag_duplicateweedout) flags
  enable control over semijoin strategies. The
  [`semijoin`](switchable-optimizations.html#optflag_semijoin) flag controls
  whether semijoins are used. If it is set to
  `on`, the
  [`firstmatch`](switchable-optimizations.html#optflag_firstmatch) and
  [`loosescan`](switchable-optimizations.html#optflag_loosescan) flags enable
  finer control over the permitted semijoin strategies.

  If the [`duplicateweedout`](switchable-optimizations.html#optflag_duplicateweedout)
  semijoin strategy is disabled, it is not used unless all
  other applicable strategies are also disabled.

  If [`semijoin`](switchable-optimizations.html#optflag_semijoin) and
  [`materialization`](switchable-optimizations.html#optflag_materialization) are both
  `on`, semijoins also use materialization
  where applicable. These flags are `on` by
  default.

  For more information, see [Section 8.2.2.1, “Optimizing Subqueries, Derived Tables, and View References with Semijoin
  Transformations”](semijoins.html "8.2.2.1 Optimizing Subqueries, Derived Tables, and View References with Semijoin Transformations").

* Subquery Materialization Flags

  + [`materialization`](switchable-optimizations.html#optflag_materialization)
    (default `on`)

    Controls materialization (including semijoin
    materialization).

  + [`subquery_materialization_cost_based`](switchable-optimizations.html#optflag_subquery-materialization-cost-based)
    (default `on`)

    Use cost-based materialization choice.

  The [`materialization`](switchable-optimizations.html#optflag_materialization) flag
  controls whether subquery materialization is used. If
  [`semijoin`](switchable-optimizations.html#optflag_semijoin) and
  [`materialization`](switchable-optimizations.html#optflag_materialization) are both
  `on`, semijoins also use materialization
  where applicable. These flags are `on` by
  default.

  The
  [`subquery_materialization_cost_based`](switchable-optimizations.html#optflag_subquery-materialization-cost-based)
  flag enables control over the choice between subquery
  materialization and
  `IN`-to-`EXISTS` subquery
  transformation. If the flag is `on` (the
  default), the optimizer performs a cost-based choice between
  subquery materialization and
  `IN`-to-`EXISTS` subquery
  transformation if either method could be used. If the flag
  is `off`, the optimizer chooses subquery
  materialization over
  `IN`-to-`EXISTS` subquery
  transformation.

  For more information, see
  [Section 8.2.2, “Optimizing Subqueries, Derived Tables, and View References”](subquery-optimization.html "8.2.2 Optimizing Subqueries, Derived Tables, and View References").

When you assign a value to
[`optimizer_switch`](server-system-variables.html#sysvar_optimizer_switch), flags that
are not mentioned keep their current values. This makes it
possible to enable or disable specific optimizer behaviors in a
single statement without affecting other behaviors. The
statement does not depend on what other optimizer flags exist
and what their values are. Suppose that all Index Merge
optimizations are enabled:

```sql
mysql> SELECT @@optimizer_switch\G
*************************** 1. row ***************************
@@optimizer_switch: index_merge=on,index_merge_union=on,
                    index_merge_sort_union=on,
                    index_merge_intersection=on,
                    engine_condition_pushdown=on,
                    index_condition_pushdown=on,
                    mrr=on,mrr_cost_based=on,
                    block_nested_loop=on,batched_key_access=off,
                    materialization=on,semijoin=on,loosescan=on,
                    firstmatch=on,duplicateweedout=on,
                    subquery_materialization_cost_based=on,
                    use_index_extensions=on,
                    condition_fanout_filter=on,derived_merge=on,
                    prefer_ordering_index=on
```

If the server is using the Index Merge Union or Index Merge
Sort-Union access methods for certain queries and you want to
check whether the optimizer performs better without them, set
the variable value like this:

```sql
mysql> SET optimizer_switch='index_merge_union=off,index_merge_sort_union=off';

mysql> SELECT @@optimizer_switch\G
*************************** 1. row ***************************
@@optimizer_switch: index_merge=on,index_merge_union=off,
                    index_merge_sort_union=off,
                    index_merge_intersection=on,
                    engine_condition_pushdown=on,
                    index_condition_pushdown=on,
                    mrr=on,mrr_cost_based=on,
                    block_nested_loop=on,batched_key_access=off,
                    materialization=on,semijoin=on,loosescan=on,
                    firstmatch=on,duplicateweedout=on,
                    subquery_materialization_cost_based=on,
                    use_index_extensions=on,
                    condition_fanout_filter=on,derived_merge=on,
                    prefer_ordering_index=on
```