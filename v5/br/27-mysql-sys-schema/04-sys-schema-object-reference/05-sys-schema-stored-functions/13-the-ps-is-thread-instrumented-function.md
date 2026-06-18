#### 26.4.5.13 A Função ps_is_thread_instrumented()

Retorna `YES` ou `NO` para indicar se a instrumentação do Performance Schema para um determinado *connection ID* está habilitada, `UNKNOWN` se o *ID* for desconhecido, ou `NULL` se o *ID* for `NULL`.

##### Parâmetros

* `in_connection_id BIGINT UNSIGNED`: O *connection ID*. Este é um valor do tipo fornecido na coluna `PROCESSLIST_ID` da tabela `threads` do *Performance Schema* ou na coluna `Id` da saída de `SHOW PROCESSLIST`.

##### Valor de Retorno

Um valor `ENUM('YES','NO','UNKNOWN')`.

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