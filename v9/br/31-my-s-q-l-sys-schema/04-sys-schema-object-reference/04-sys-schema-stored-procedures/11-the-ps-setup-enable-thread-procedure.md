#### 30.4.4.11 O procedimento ps\_setup\_enable\_thread()

Dada uma ID de conexão, habilita a instrumentação do Gerenciador de Desempenho para o thread. Produz um conjunto de resultados indicando quantos threads foram habilitados. Os threads já habilitados não são contados.

##### Parâmetros

* `in_connection_id BIGINT`: A ID de conexão. Este é um valor do tipo dado na coluna `PROCESSLIST_ID` da tabela `threads` do Gerenciador de Desempenho ou na coluna `Id` da saída `SHOW PROCESSLIST`.

##### Exemplo

Habilitar uma conexão específica por sua ID de conexão:

```
mysql> CALL sys.ps_setup_enable_thread(225);
+------------------+
| summary          |
+------------------+
| Enabled 1 thread |
+------------------+
```

Habilitar a conexão atual:

```
mysql> CALL sys.ps_setup_enable_thread(CONNECTION_ID());
+------------------+
| summary          |
+------------------+
| Enabled 1 thread |
+------------------+
```