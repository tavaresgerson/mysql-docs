#### 30.4.5.22 A função version\_patch()

Esta função retorna a versão da versão de correção do MySQL server.

##### Parâmetros

Nenhum.

##### Valor de retorno

Um valor `TINYINT UNSIGNED`.

##### Exemplo

```
mysql> SELECT VERSION(), sys.version_patch();
+-----------+---------------------+
| VERSION() | sys.version_patch() |
+-----------+---------------------+
| 9.4.0     |                   0 |
+-----------+---------------------+
```