#### 30.4.5.21 A função version\_minor()

Esta função retorna a versão menor do servidor MySQL.

##### Parâmetros

Nenhum.

##### Valor de retorno

Um valor `TINYINT UNSIGNED`.

##### Exemplo

```
mysql> SELECT VERSION(), sys.version_minor();
+-----------+---------------------+
| VERSION() | sys.version_minor() |
+-----------+---------------------+
| 9.4.0     |                   4 |
+-----------+---------------------+
```