--- title: MySQL 8.4 Reference Manual :: 12.8.2 COLLATE Clause Precedence url: https://dev.mysql.com/doc/refman/8.4/en/charset-collate-precedence.html order: 23 ---



### 12.8.2 COLLATE Clause Precedence

The `COLLATE` clause has high precedence (higher than  `||`), so the following two expressions are equivalent:

```
x || y COLLATE z
x || (y COLLATE z)
```


