#### 26.4.5.21 A função version_minor()

Essa função retorna a versão menor do servidor MySQL.

##### Parâmetros

Nenhum.

##### Valor de retorno

Um valor `TINYINT UNSIGNED`.

##### Exemplo

```sql
mysql> SELECT VERSION(), sys.version_minor();
+------------------+---------------------+
| VERSION()        | sys.version_minor() |
+------------------+---------------------+
| 5.7.24-debug-log |                   7 |
+------------------+---------------------+
```
