### 10.8.3 Compatibilidade de Character Set e Collation

Cada Character Set possui um ou mais Collations, mas cada Collation está associado a um e apenas um Character Set. Portanto, a seguinte instrução causa uma mensagem de erro porque a Collation `latin2_bin` não é válida com o Character Set `latin1`:

```sql
mysql> SELECT _latin1 'x' COLLATE latin2_bin;
ERROR 1253 (42000): COLLATION 'latin2_bin' is not valid
for CHARACTER SET 'latin1'
```
