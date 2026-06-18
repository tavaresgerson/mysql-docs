### 12.8.2 Cláusula de Precedência da cláusula COLLATE

A cláusula `COLLATE` tem precedência alta (maior que `||`), portanto, as duas expressões seguintes são equivalentes:

```
x || y COLLATE z
x || (y COLLATE z)
```
