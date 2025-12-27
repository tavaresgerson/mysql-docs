#### 30.4.4.7 O procedimento ps\_setup\_disable\_thread()

Dada uma ID de conexão, desativa a instrumentação do Gerenciador de Desempenho para o thread. Gera um conjunto de resultados indicando quantos threads foram desativados. Threads já desativados não são contados.

##### Parâmetros

* `in_connection_id BIGINT`: A ID de conexão. Este é um valor do tipo dado na coluna `PROCESSLIST_ID` da tabela `threads` do Gerenciador de Desempenho ou na coluna `Id` da saída `SHOW PROCESSLIST`.

##### Exemplo

Desativar uma conexão específica por sua ID de conexão:

```
mysql> CALL sys.ps_setup_disable_thread(225);
+-------------------+
| summary           |
+-------------------+
| Disabled 1 thread |
+-------------------+
```

Desativar a conexão atual:

```
mysql> CALL sys.ps_setup_disable_thread(CONNECTION_ID());
+-------------------+
| summary           |
+-------------------+
| Disabled 1 thread |
+-------------------+
```