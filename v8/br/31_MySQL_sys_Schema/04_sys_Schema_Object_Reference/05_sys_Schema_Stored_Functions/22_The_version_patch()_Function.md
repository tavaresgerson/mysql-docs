#### 30.4.5.22 A função version\_patch()

Essa função retorna a versão de lançamento do patch do servidor MySQL.

##### Parâmetros

None.

##### Valor de retorno

Um valor `TINYINT UNSIGNED`.

##### Exemplo

```
mysql> SELECT VERSION(), sys.version_patch();
+--------------+---------------------+
| VERSION()    | sys.version_patch() |
+--------------+---------------------+
| 8.0.26-debug |                  26 |
+--------------+---------------------+
```
