#### 26.4.4.7 O procedimento ps\_setup\_disable\_thread()

Dada uma ID de conexão, desabilita a instrumentação do Schema de Desempenho para o thread. Produz um conjunto de resultados indicando quantos threads foram desativados. Threads já desativados não são contados.

##### Parâmetros

- `in_connection_id BIGINT`: O ID da conexão. Este é um valor do tipo especificado na coluna `PROCESSLIST_ID` da tabela `threads` do Gerenciamento de Desempenho ou na coluna `Id` da saída do comando `SHOW PROCESSLIST`.

##### Exemplo

Desativar uma conexão específica pelo seu ID de conexão:

```sql
mysql> CALL sys.ps_setup_disable_thread(225);
+-------------------+
| summary           |
+-------------------+
| Disabled 1 thread |
+-------------------+
```

Desative a conexão atual:

```sql
mysql> CALL sys.ps_setup_disable_thread(CONNECTION_ID());
+-------------------+
| summary           |
+-------------------+
| Disabled 1 thread |
+-------------------+
```
