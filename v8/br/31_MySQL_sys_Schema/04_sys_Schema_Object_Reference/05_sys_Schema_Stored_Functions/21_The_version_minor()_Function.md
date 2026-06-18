#### 30.4.5.21 A função version\_minor()

Essa função retorna a versão menor do servidor MySQL.

##### Parâmetros

None.

##### Valor de retorno

Um valor `TINYINT UNSIGNED`.

##### Exemplo

```
mysql> SELECT VERSION(), sys.version_minor();
+--------------+---------------------+
| VERSION()    | sys.version_minor() |
+--------------+---------------------+
| 8.0.26-debug |                   0 |
+--------------+---------------------+
```
