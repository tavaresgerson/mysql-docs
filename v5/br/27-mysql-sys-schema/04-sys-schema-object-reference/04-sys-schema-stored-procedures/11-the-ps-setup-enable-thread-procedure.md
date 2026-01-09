#### 26.4.4.11 O procedimento ps_setup_enable_thread()

Dada uma ID de conexão, habilita a instrumentação do Schema de Desempenho para o thread. Produz um conjunto de resultados indicando quantos threads foram habilitados. Os threads já habilitados não são contados.

##### Parâmetros

- `in_connection_id BIGINT`: O ID da conexão. Este é um valor do tipo especificado na coluna `PROCESSLIST_ID` da tabela `threads` do Gerenciamento de Desempenho ou na coluna `Id` da saída do comando `SHOW PROCESSLIST`.

##### Exemplo

Ative uma conexão específica pelo seu ID de conexão:

```sql
mysql> CALL sys.ps_setup_enable_thread(225);
+------------------+
| summary          |
+------------------+
| Enabled 1 thread |
+------------------+
```

Ative a conexão atual:

```sql
mysql> CALL sys.ps_setup_enable_thread(CONNECTION_ID());
+------------------+
| summary          |
+------------------+
| Enabled 1 thread |
+------------------+
```
