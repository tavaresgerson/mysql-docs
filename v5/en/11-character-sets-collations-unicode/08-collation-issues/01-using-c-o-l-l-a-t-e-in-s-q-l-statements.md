### 10.8.1 Using COLLATE in SQL Statements

With the `COLLATE` clause, you can override whatever the default collation is for a comparison. `COLLATE` may be used in various parts of SQL statements. Here are some examples:

* With `ORDER BY`:

  ```sql
  SELECT k
  FROM t1
  ORDER BY k COLLATE latin1_german2_ci;
  ```

* With `AS`:

  ```sql
  SELECT k COLLATE latin1_german2_ci AS k1
  FROM t1
  ORDER BY k1;
  ```

* With `GROUP BY`:

  ```sql
  SELECT k
  FROM t1
  GROUP BY k COLLATE latin1_german2_ci;
  ```

* With aggregate functions:

  ```sql
  SELECT MAX(k COLLATE latin1_german2_ci)
  FROM t1;
  ```

* With `DISTINCT`:

  ```sql
  SELECT DISTINCT k COLLATE latin1_german2_ci
  FROM t1;
  ```

* With `WHERE`:

  ```sql
       SELECT *
       FROM t1
       WHERE _latin1 'Müller' COLLATE latin1_german2_ci = k;
  ```

  ```sql
       SELECT *
       FROM t1
       WHERE k LIKE _latin1 'Müller' COLLATE latin1_german2_ci;
  ```

* With `HAVING`:

  ```sql
  SELECT k
  FROM t1
  GROUP BY k
  HAVING k = _latin1 'Müller' COLLATE latin1_german2_ci;
  ```
