### 3.6.7 Searching on Two Keys

An [`OR`](logical-operators.html#operator_or) using a single key is well optimized, as is the handling of [`AND`](logical-operators.html#operator_and).

The one tricky case is that of searching on two different keys combined with [`OR`](logical-operators.html#operator_or):

```sql
SELECT field1_index, field2_index FROM test_table
WHERE field1_index = '1' OR  field2_index = '1'
```

This case is optimized. See [Section 8.2.1.3, “Index Merge Optimization”](index-merge-optimization.html "8.2.1.3 Index Merge Optimization").

You can also solve the problem efficiently by using a [`UNION`](union.html "13.2.9.3 UNION Clause") that combines the output of two separate [`SELECT`](select.html "13.2.9 SELECT Statement") statements. See [Section 13.2.9.3, “UNION Clause”](union.html "13.2.9.3 UNION Clause").

Each [`SELECT`](select.html "13.2.9 SELECT Statement") searches only one key and can be optimized:

```sql
SELECT field1_index, field2_index
    FROM test_table WHERE field1_index = '1'
UNION
SELECT field1_index, field2_index
    FROM test_table WHERE field2_index = '1';
```
