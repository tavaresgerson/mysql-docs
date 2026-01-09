#### 26.4.5.20 A função version_major()

Essa função retorna a versão principal do servidor MySQL.

##### Parâmetros

Nenhum.

##### Valor de retorno

Um valor `TINYINT UNSIGNED`.

##### Exemplo

```sql
mysql> SELECT VERSION(), sys.version_major();
+------------------+---------------------+
| VERSION()        | sys.version_major() |
+------------------+---------------------+
| 5.7.24-debug-log |                   5 |
+------------------+---------------------+
```
