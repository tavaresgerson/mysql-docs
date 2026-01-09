#### 30.4.5.13 A função ps_is_thread_instrumented()

Retorna `YES` ou `NO` para indicar se a instrumentação do Schema de Desempenho para uma ID de conexão específica está habilitada, `UNKNOWN` se a ID for desconhecida ou `NULL` se a ID for `NULL`.

##### Parâmetros

* `in_connection_id BIGINT UNSIGNED`: A ID de conexão. Este é um valor do tipo dado na coluna `PROCESSLIST_ID` da tabela `threads` do Schema de Desempenho ou na coluna `Id` da saída do comando `SHOW PROCESSLIST`.

##### Valor de retorno

Um valor de `ENUM('YES','NO','UNKNOWN')`.

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