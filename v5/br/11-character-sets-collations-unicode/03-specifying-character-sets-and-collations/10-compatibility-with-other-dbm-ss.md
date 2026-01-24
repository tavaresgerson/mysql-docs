### 10.3.10 Compatibilidade com Outros DBMSs

Para compatibilidade com MaxDB, estas duas instruções são as mesmas:

```sql
CREATE TABLE t1 (f1 CHAR(N) UNICODE);
CREATE TABLE t1 (f1 CHAR(N) CHARACTER SET ucs2);
```