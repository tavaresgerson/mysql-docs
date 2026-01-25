#### 26.4.5.15 A Função ps_thread_id()

Retorna o Thread ID do Performance Schema atribuído a um Connection ID específico, ou o Thread ID da conexão atual se o Connection ID for `NULL`.

##### Parâmetros

* `in_connection_id BIGINT UNSIGNED`: O ID da conexão para o qual retornar o Thread ID. Este é um valor do tipo fornecido na coluna `PROCESSLIST_ID` da tabela `threads` do Performance Schema ou na coluna `Id` da saída do `SHOW PROCESSLIST`.

##### Valor de Retorno

Um valor `BIGINT UNSIGNED`.

##### Exemplo

```sql
mysql> SELECT sys.ps_thread_id(260);
+-----------------------+
| sys.ps_thread_id(260) |
+-----------------------+
|                   285 |
+-----------------------+
```