#### 30.4.5.13 A função ps\_is\_thread\_instrumented()

Retorna `YES` ou `NO` para indicar se a instrumentação do Schema de Desempenho para um ID de conexão específico está habilitada, `UNKNOWN` se o ID for desconhecido ou `NULL` se o ID for `NULL`.

##### Parâmetros

- `in_connection_id BIGINT UNSIGNED`: O ID de conexão. Este é um valor do tipo especificado na coluna `PROCESSLIST_ID` da tabela do Gerenciamento de Desempenho `threads` ou na coluna `Id` do relatório de saída `SHOW PROCESSLIST`.

##### Valor de retorno

Um valor `ENUM('YES','NO','UNKNOWN')`.

##### Exemplo

```
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
