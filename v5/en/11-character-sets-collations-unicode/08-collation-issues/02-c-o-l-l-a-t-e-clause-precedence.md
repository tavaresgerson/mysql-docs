### 10.8.2 COLLATE Clause Precedence

The `COLLATE` clause has high precedence (higher than `||`), so the following two expressions are equivalent:

```sql
x || y COLLATE z
x || (y COLLATE z)
```
