#### 15.2.15.11 Optimizing Subqueries

Development is ongoing, so no optimization tip is reliable for the long term. The following list provides some interesting tricks that you might want to play with. See also Section 10.2.2, “Optimizing Subqueries, Derived Tables, View References, and Common Table Expressions”.

* Move clauses from outside to inside the subquery. For example, use this query:

  ```
  SELECT * FROM t1
    WHERE s1 IN (SELECT s1 FROM t1 UNION ALL SELECT s1 FROM t2);
  ```

  Instead of this query:

  ```
  SELECT * FROM t1
    WHERE s1 IN (SELECT s1 FROM t1) OR s1 IN (SELECT s1 FROM t2);
  ```

  For another example, use this query:

  ```
  SELECT (SELECT column1 + 5 FROM t1) FROM t2;
  ```

  Instead of this query:

  ```
  SELECT (SELECT column1 FROM t1) + 5 FROM t2;
  ```
