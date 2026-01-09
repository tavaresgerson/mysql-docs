#### 26.4.5.7 A função list_add()

Adiciona um valor a uma lista de valores separados por vírgula e retorna o resultado.

Essa função e a função `list_drop()` podem ser úteis para manipular o valor de variáveis do sistema, como `sql_mode` e `optimizer_switch`, que aceitam uma lista de valores separados por vírgula.

##### Parâmetros

- `in_list TEXT`: A lista a ser modificada.

- `in_add_value TEXT`: O valor a ser adicionado à lista.

##### Valor de retorno

Um valor `TEXT`.

##### Exemplo

```sql
mysql> SELECT @@sql_mode;
+----------------------------------------+
| @@sql_mode                             |
+----------------------------------------+
| ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES |
+----------------------------------------+
mysql> SET @@sql_mode = sys.list_add(@@sql_mode, 'NO_ENGINE_SUBSTITUTION');
mysql> SELECT @@sql_mode;
+---------------------------------------------------------------+
| @@sql_mode                                                    |
+---------------------------------------------------------------+
| ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ENGINE_SUBSTITUTION |
+---------------------------------------------------------------+
mysql> SET @@sql_mode = sys.list_drop(@@sql_mode, 'ONLY_FULL_GROUP_BY');
mysql> SELECT @@sql_mode;
+--------------------------------------------+
| @@sql_mode                                 |
+--------------------------------------------+
| STRICT_TRANS_TABLES,NO_ENGINE_SUBSTITUTION |
+--------------------------------------------+
```
