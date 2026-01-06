### 10.8.2 Cláusula de Precedência da cláusula COLLATE

A cláusula `COLLATE` tem precedência alta (maior que `||`), então as duas expressões seguintes são equivalentes:

```sql
x || y COLLATE z
x || (y COLLATE z)
```
