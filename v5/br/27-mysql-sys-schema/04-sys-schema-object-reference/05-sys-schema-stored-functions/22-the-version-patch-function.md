#### 26.4.5.22 A função version\_patch()

Essa função retorna a versão de lançamento do patch do servidor MySQL.

##### Parâmetros

Nenhum.

##### Valor de retorno

Um valor `TINYINT UNSIGNED`.

##### Exemplo

```sql
mysql> SELECT VERSION(), sys.version_patch();
+------------------+---------------------+
| VERSION()        | sys.version_patch() |
+------------------+---------------------+
| 5.7.24-debug-log |                  24 |
+------------------+---------------------+
```
