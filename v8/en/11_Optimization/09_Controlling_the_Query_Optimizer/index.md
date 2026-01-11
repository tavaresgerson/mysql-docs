## 10.9 Controlling the Query Optimizer

10.9.1 Controlling Query Plan Evaluation

10.9.2 Switchable Optimizations

10.9.3 Optimizer Hints

10.9.4 Index Hints

10.9.5 The Optimizer Cost Model

10.9.6 Optimizer Statistics

MySQL provides optimizer control through system variables that affect how query plans are evaluated, switchable optimizations, optimizer and index hints, and the optimizer cost model.

The server maintains histogram statistics about column values in the `column_statistics` data dictionary table (see Section 10.9.6, “Optimizer Statistics”). Like other data dictionary tables, this table is not directly accessible by users. Instead, you can obtain histogram information by querying `INFORMATION_SCHEMA.COLUMN_STATISTICS`, which is implemented as a view on the data dictionary table. You can also perform histogram management using the `ANALYZE TABLE` statement.
