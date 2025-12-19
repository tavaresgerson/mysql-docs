--- title: MySQL 8.4 Reference Manual :: 11.1.6 Boolean Literals url: https://dev.mysql.com/doc/refman/8.4/en/boolean-literals.html order: 8 ---



### 11.1.6 Boolean Literals

The constants `TRUE` and `FALSE` evaluate to `1` and `0`, respectively. The constant names can be written in any lettercase.

```
mysql> SELECT TRUE, true, FALSE, false;
        -> 1, 1, 0, 0
```


