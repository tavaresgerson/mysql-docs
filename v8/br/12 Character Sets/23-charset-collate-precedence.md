### 12.8.2 Precedência da Cláusula `COLLATE`

A cláusula `COLLATE` tem alta precedência (maior que `||`), portanto, as seguintes duas expressões são equivalentes:

```
x || y COLLATE z
x || (y COLLATE z)
```