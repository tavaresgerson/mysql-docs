#### 26.4.5.22 A Função version_patch()

Esta função retorna a versão de patch (lançamento de correção) do servidor MySQL.

##### Parâmetros

Nenhum.

##### Valor de Retorno

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