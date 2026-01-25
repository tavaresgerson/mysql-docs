#### 8.2.1.13 Otimização IS NULL

O MySQL pode realizar a mesma otimização em *`col_name`* `IS NULL` que pode ser usada para *`col_name`* `=` *`constant_value`*. Por exemplo, o MySQL pode usar Indexes e ranges para buscar por `NULL` com `IS NULL`.

Exemplos:

```sql
SELECT * FROM tbl_name WHERE key_col IS NULL;

SELECT * FROM tbl_name WHERE key_col <=> NULL;

SELECT * FROM tbl_name
  WHERE key_col=const1 OR key_col=const2 OR key_col IS NULL;
```

Se uma `WHERE clause` incluir uma condição *`col_name`* `IS NULL` para uma coluna que é declarada como `NOT NULL`, essa expressão é otimizada e removida. Essa otimização não ocorre em casos em que a coluna possa produzir `NULL` de qualquer forma (por exemplo, se vier de uma tabela no lado direito de um `LEFT JOIN`).

O MySQL também pode otimizar a combinação `col_name = expr OR col_name IS NULL`, uma forma comum em subqueries resolvidas. O `EXPLAIN` mostra `ref_or_null` quando esta otimização é utilizada.

Esta otimização pode lidar com um `IS NULL` para qualquer Key Part.

Alguns exemplos de Queries que são otimizadas, assumindo que existe um Index nas colunas `a` e `b` da tabela `t2`:

```sql
SELECT * FROM t1 WHERE t1.a=expr OR t1.a IS NULL;

SELECT * FROM t1, t2 WHERE t1.a=t2.a OR t2.a IS NULL;

SELECT * FROM t1, t2
  WHERE (t1.a=t2.a OR t2.a IS NULL) AND t2.b=t1.b;

SELECT * FROM t1, t2
  WHERE t1.a=t2.a AND (t2.b=t1.b OR t2.b IS NULL);

SELECT * FROM t1, t2
  WHERE (t1.a=t2.a AND t2.a IS NULL AND ...)
  OR (t1.a=t2.a AND t2.a IS NULL AND ...);
```

`ref_or_null` funciona primeiro fazendo uma leitura na chave de referência (reference key) e, em seguida, uma busca separada por linhas com um valor de chave `NULL`.

A otimização pode lidar com apenas um nível `IS NULL`. Na Query a seguir, o MySQL usa Key Lookups apenas na expressão `(t1.a=t2.a AND t2.a IS NULL)` e não consegue usar a Key Part em `b`:

```sql
SELECT * FROM t1, t2
  WHERE (t1.a=t2.a AND t2.a IS NULL)
  OR (t1.b=t2.b AND t2.b IS NULL);
```