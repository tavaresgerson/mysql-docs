### 12.8.3 Conjunto de caracteres e compatibilidade de ordenação

Cada conjunto de caracteres tem uma ou mais ordenações, mas cada ordenação está associada a apenas um conjunto de caracteres. Portanto, a seguinte declaração causa uma mensagem de erro porque a ordenação `latin2_bin` não é válida com o conjunto de caracteres `latin1`:

```
mysql> SELECT _latin1 'x' COLLATE latin2_bin;
ERROR 1253 (42000): COLLATION 'latin2_bin' is not valid
for CHARACTER SET 'latin1'
```