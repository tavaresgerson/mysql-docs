### 10.8.3 Conjunto de caracteres e compatibilidade de cotação

Cada conjunto de caracteres tem uma ou mais colatações, mas cada colatação está associada a apenas um conjunto de caracteres. Portanto, a seguinte declaração causa uma mensagem de erro porque a colatação `latin2_bin` não é válida com o conjunto de caracteres `latin1`:

```sql
mysql> SELECT _latin1 'x' COLLATE latin2_bin;
ERROR 1253 (42000): COLLATION 'latin2_bin' is not valid
for CHARACTER SET 'latin1'
```
