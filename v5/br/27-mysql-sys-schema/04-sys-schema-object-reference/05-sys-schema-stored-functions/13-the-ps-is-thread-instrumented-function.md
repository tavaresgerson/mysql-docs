#### 26.4.5.13 A função ps\_is\_thread\_instrumented()

Retorna `YES` ou `NO` para indicar se a instrumentação do Schema de Desempenho para um ID de conexão específico está habilitada, `UNKNOWN` se o ID for desconhecido ou `NULL` se o ID for `NULL`.

##### Parâmetros

- `in_connection_id BIGINT UNSIGNED`: O ID da conexão. Este é um valor do tipo especificado na coluna `PROCESSLIST_ID` da tabela `threads` do Gerenciamento de Desempenho ou na coluna `Id` da saída do comando `SHOW PROCESSLIST`.

##### Valor de retorno

Um valor `ENUM('SIM','NÃO','DESCONHECIDO')`.

##### Exemplo

```sql
mysql> SELECT sys.ps_is_thread_instrumented(43);
+-----------------------------------+
| sys.ps_is_thread_instrumented(43) |
+-----------------------------------+
| UNKNOWN                           |
+-----------------------------------+
mysql> SELECT sys.ps_is_thread_instrumented(CONNECTION_ID());
+------------------------------------------------+
| sys.ps_is_thread_instrumented(CONNECTION_ID()) |
+------------------------------------------------+
| YES                                            |
+------------------------------------------------+
```
