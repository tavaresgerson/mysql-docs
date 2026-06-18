#### 26.4.5.20 A Função version_major()

Esta Function retorna a versão principal do servidor MySQL.

##### Parâmetros

Nenhum.

##### Valor de Retorno

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