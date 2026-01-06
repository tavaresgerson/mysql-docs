### 10.3.10 Compatibilidade com outros SGBDs

Para compatibilidade com o MaxDB, essas duas instruções são iguais:

```sql
CREATE TABLE t1 (f1 CHAR(N) UNICODE);
CREATE TABLE t1 (f1 CHAR(N) CHARACTER SET ucs2);
```
