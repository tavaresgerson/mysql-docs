#### 30.4.4.7 O procedimento ps\_setup\_disable\_thread()

Dada uma ID de conexão, desabilita a instrumentação do Schema de Desempenho para o thread. Produz um conjunto de resultados indicando quantos threads foram desativados. Threads já desativados não são contados.

##### Parâmetros

- `in_connection_id BIGINT`: O ID de conexão. Este é um valor do tipo especificado na coluna `PROCESSLIST_ID` da tabela do Gerenciamento de Desempenho `threads` ou na coluna `Id` do relatório de saída `SHOW PROCESSLIST`.

##### Exemplo

Desativar uma conexão específica pelo seu ID de conexão:

```
mysql> CALL sys.ps_setup_disable_thread(225);
+-------------------+
| summary           |
+-------------------+
| Disabled 1 thread |
+-------------------+
```

Desative a conexão atual:

```
mysql> CALL sys.ps_setup_disable_thread(CONNECTION_ID());
+-------------------+
| summary           |
+-------------------+
| Disabled 1 thread |
+-------------------+
```
