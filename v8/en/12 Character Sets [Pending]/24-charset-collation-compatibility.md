--- title: MySQL 8.4 Reference Manual :: 12.8.3 Character Set and Collation Compatibility url: https://dev.mysql.com/doc/refman/8.4/en/charset-collation-compatibility.html order: 24 ---



### 12.8.3 Character Set and Collation Compatibility

Each character set has one or more collations, but each collation is associated with one and only one character set. Therefore, the following statement causes an error message because the `latin2_bin` collation is not legal with the `latin1` character set:

```
mysql> SELECT _latin1 'x' COLLATE latin2_bin;
ERROR 1253 (42000): COLLATION 'latin2_bin' is not valid
for CHARACTER SET 'latin1'
```


