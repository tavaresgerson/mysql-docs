#### 30.4.4.11 O procedimento ps\_setup\_enable\_thread()

Dada uma ID de conexão, habilita a instrumentação do Schema de Desempenho para o thread. Produz um conjunto de resultados indicando quantos threads foram habilitados. Os threads já habilitados não são contados.

##### Parâmetros

- `in_connection_id BIGINT`: O ID de conexão. Este é um valor do tipo especificado na coluna `PROCESSLIST_ID` da tabela do Gerenciamento de Desempenho `threads` ou na coluna `Id` do relatório de saída `SHOW PROCESSLIST`.

##### Exemplo

Ative uma conexão específica pelo seu ID de conexão:

```
mysql> CALL sys.ps_setup_enable_thread(225);
+------------------+
| summary          |
+------------------+
| Enabled 1 thread |
+------------------+
```

Ative a conexão atual:

```
mysql> CALL sys.ps_setup_enable_thread(CONNECTION_ID());
+------------------+
| summary          |
+------------------+
| Enabled 1 thread |
+------------------+
```
