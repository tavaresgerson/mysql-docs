### 10.3.10 Compatibility with Other DBMSs

For MaxDB compatibility these two statements are the same:

```sql
CREATE TABLE t1 (f1 CHAR(N) UNICODE);
CREATE TABLE t1 (f1 CHAR(N) CHARACTER SET ucs2);
```
