### 12.8.1 Usando `COLLATE` em Instruções SQL

Com a cláusula `COLLATE`, você pode substituir o collation padrão para uma comparação. `COLLATE` pode ser usado em várias partes das instruções SQL. Aqui estão alguns exemplos:

* Com `ORDER BY`:

  ```
  SELECT k
  FROM t1
  ORDER BY k COLLATE latin1_german2_ci;
  ```

* Com `AS`:

  ```
  SELECT k COLLATE latin1_german2_ci AS k1
  FROM t1
  ORDER BY k1;
  ```

* Com `GROUP BY`:

  ```
  SELECT k
  FROM t1
  GROUP BY k COLLATE latin1_german2_ci;
  ```

* Com funções agregadas:

  ```
  SELECT MAX(k COLLATE latin1_german2_ci)
  FROM t1;
  ```

* Com `DISTINCT`:

  ```
  SELECT DISTINCT k COLLATE latin1_german2_ci
  FROM t1;
  ```

* Com `WHERE`:

  ```
  SELECT *
  FROM t1
  WHERE _latin1 'Müller' COLLATE latin1_german2_ci = k;
  ```

  ```
  SELECT *
  FROM t1
  WHERE k LIKE _latin1 'Müller' COLLATE latin1_german2_ci;
  ```

* Com `HAVING`:

  ```
  SELECT k
  FROM t1
  GROUP BY k
  HAVING k = _latin1 'Müller' COLLATE latin1_german2_ci;
  ```