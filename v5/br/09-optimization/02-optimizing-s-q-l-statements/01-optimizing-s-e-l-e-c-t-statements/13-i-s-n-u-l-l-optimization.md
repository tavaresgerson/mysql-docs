#### 8.2.1.13 Otimização IS NULL

O MySQL pode realizar a mesma otimização em *`col_name`* `IS NULL` que ele pode usar para *`col_name`* `=` *`constant_value`*. Por exemplo, o MySQL pode usar índices e faixas para pesquisar por `NULL` com `IS NULL`.

Exemplos:

```sql
SELECT * FROM tbl_name WHERE key_col IS NULL;

SELECT * FROM tbl_name WHERE key_col <=> NULL;

SELECT * FROM tbl_name
  WHERE key_col=const1 OR key_col=const2 OR key_col IS NULL;
```

Se uma cláusula `WHERE` incluir uma condição `*col_name* IS NULL` para uma coluna declarada como `NOT NULL`, essa expressão é otimizada. Essa otimização não ocorre em casos em que a coluna pode gerar `NULL` de qualquer maneira (por exemplo, se ela vier de uma tabela do lado direito de uma `LEFT JOIN`).

O MySQL também pode otimizar a combinação `col_name = expr OR col_name IS NULL`, uma forma comum em subconsultas resolvidas. O `EXPLAIN` mostra `ref_or_null` quando essa otimização é usada.

Essa otimização pode lidar com um `IS NULL` para qualquer parte da chave.

Alguns exemplos de consultas otimizadas, assumindo que há um índice nas colunas `a` e `b` da tabela `t2`:

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

O `ref_or_null` funciona fazendo uma leitura na chave de referência e, em seguida, uma busca separada por linhas com um valor de chave `NULL`.

A otimização pode lidar apenas com um nível de `IS NULL`. Na seguinte consulta, o MySQL usa buscas por chave apenas na expressão `(t1.a=t2.a E t2.a IS NULL)` e não consegue usar a parte da chave em `b`:

```sql
SELECT * FROM t1, t2
  WHERE (t1.a=t2.a AND t2.a IS NULL)
  OR (t1.b=t2.b AND t2.b IS NULL);
```
