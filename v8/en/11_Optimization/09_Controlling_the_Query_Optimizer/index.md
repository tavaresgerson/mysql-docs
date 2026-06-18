## 10.9 Controlling the Query Optimizer

[10.9.1 Controlling Query Plan Evaluation](controlling-query-plan-evaluation.html)

[10.9.2 Switchable Optimizations](switchable-optimizations.html)

[10.9.3 Optimizer Hints](optimizer-hints.html)

[10.9.4 Index Hints](index-hints.html)

[10.9.5 The Optimizer Cost Model](cost-model.html)

[10.9.6 Optimizer Statistics](optimizer-statistics.html)

MySQL provides optimizer control through system variables that
affect how query plans are evaluated, switchable optimizations,
optimizer and index hints, and the optimizer cost model.

The server maintains histogram statistics about column values in
the `column_statistics` data dictionary table
(see [Section 10.9.6, “Optimizer Statistics”](optimizer-statistics.html "10.9.6 Optimizer Statistics")). Like other data
dictionary tables, this table is not directly accessible by users.
Instead, you can obtain histogram information by querying
[`INFORMATION_SCHEMA.COLUMN_STATISTICS`](information-schema-column-statistics-table.html "28.3.11 The INFORMATION_SCHEMA COLUMN_STATISTICS Table"),
which is implemented as a view on the data dictionary table. You
can also perform histogram management using the
[`ANALYZE TABLE`](analyze-table.html "15.7.3.1 ANALYZE TABLE Statement") statement.