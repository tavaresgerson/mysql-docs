### 14.20.4 Named Windows

Windows can be defined and given names by which to refer to them in `OVER` clauses. To do this, use a `WINDOW` clause. If present in a query, the `WINDOW` clause falls between the positions of the `HAVING` and `ORDER BY` clauses, and has this syntax:

```
WINDOW window_name AS (window_spec)
    [, window_name AS (window_spec)] ...
```

For each window definition, *`window_name`* is the window name, and *`window_spec`* is the same type of window specification as given between the parentheses of an `OVER` clause, as described in Section 14.20.2, “Window Function Concepts and Syntax”:

```
window_spec:
    [window_name] [partition_clause] [order_clause] [frame_clause]
```

A `WINDOW` clause is useful for queries in which multiple `OVER` clauses would otherwise define the same window. Instead, you can define the window once, give it a name, and refer to the name in the `OVER` clauses. Consider this query, which defines the same window multiple times:

```
SELECT
  val,
  ROW_NUMBER() OVER (ORDER BY val) AS 'row_number',
  RANK()       OVER (ORDER BY val) AS 'rank',
  DENSE_RANK() OVER (ORDER BY val) AS 'dense_rank'
FROM numbers;
```

The query can be written more simply by using `WINDOW` to define the window once and referring to the window by name in the `OVER` clauses:

```
SELECT
  val,
  ROW_NUMBER() OVER w AS 'row_number',
  RANK()       OVER w AS 'rank',
  DENSE_RANK() OVER w AS 'dense_rank'
FROM numbers
WINDOW w AS (ORDER BY val);
```

A named window also makes it easier to experiment with the window definition to see the effect on query results. You need only modify the window definition in the `WINDOW` clause, rather than multiple `OVER` clause definitions.

If an `OVER` clause uses `OVER (window_name ...)` rather than `OVER window_name`, the named window can be modified by the addition of other clauses. For example, this query defines a window that includes partitioning, and uses `ORDER BY` in the `OVER` clauses to modify the window in different ways:

```
SELECT
  DISTINCT year, country,
  FIRST_VALUE(year) OVER (w ORDER BY year ASC) AS first,
  FIRST_VALUE(year) OVER (w ORDER BY year DESC) AS last
FROM sales
WINDOW w AS (PARTITION BY country);
```

An `OVER` clause can only add properties to a named window, not modify them. If the named window definition includes a partitioning, ordering, or framing property, the `OVER` clause that refers to the window name cannot also include the same kind of property or an error occurs:

* This construct is permitted because the window definition and the referring `OVER` clause do not contain the same kind of properties:

  ```
  OVER (w ORDER BY country)
  ... WINDOW w AS (PARTITION BY country)
  ```
* This construct is not permitted because the `OVER` clause specifies `PARTITION BY` for a named window that already has `PARTITION BY`:

  ```
  OVER (w PARTITION BY year)
  ... WINDOW w AS (PARTITION BY country)
  ```

The definition of a named window can itself begin with a *`window_name`*. In such cases, forward and backward references are permitted, but not cycles:

* This is permitted; it contains forward and backward references but no cycles:

  ```
  WINDOW w1 AS (w2), w2 AS (), w3 AS (w1)
  ```
* This is not permitted because it contains a cycle:

  ```
  WINDOW w1 AS (w2), w2 AS (w3), w3 AS (w1)
  ```

