#### 30.4.5.20 A função version_major()

Esta função retorna a versão principal do servidor MySQL.

##### Parâmetros

Nenhum.

##### Valor de retorno

Um valor `TINYINT UNSIGNED`.

##### Exemplo

```
mysql> SELECT VERSION(), sys.version_major();
+-----------+---------------------+
| VERSION() | sys.version_major() |
+-----------+---------------------+
| 9.5.0     |                   9 |
+-----------+---------------------+
```