### 10.8.2 Precedência da Cláusula COLLATE

A cláusula `COLLATE` tem alta precedência (maior que `||`), portanto, as duas expressões a seguir são equivalentes:

```sql
x || y COLLATE z
x || (y COLLATE z)
```