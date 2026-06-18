#### 26.4.5.21 A Função version_minor()

Esta função retorna a versão minor do MySQL server.

##### Parâmetros

Nenhum.

##### Valor de Retorno

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