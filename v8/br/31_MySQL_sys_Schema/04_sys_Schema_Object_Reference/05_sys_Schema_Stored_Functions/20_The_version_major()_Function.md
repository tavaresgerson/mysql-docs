#### 30.4.5.20 A função version\_major()

Essa função retorna a versão principal do servidor MySQL.

##### Parâmetros

None.

##### Valor de retorno

Um valor `TINYINT UNSIGNED`.

##### Exemplo

```
mysql> SELECT VERSION(), sys.version_major();
+--------------+---------------------+
| VERSION()    | sys.version_major() |
+--------------+---------------------+
| 8.0.26-debug |                   8 |
+--------------+---------------------+
```
