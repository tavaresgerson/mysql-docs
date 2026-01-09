#### 26.4.5.15 A função ps_thread_id()

Retorna o ID de thread do Schema de Desempenho atribuído a um ID de conexão dado, ou o ID de thread para a conexão atual, se o ID de conexão for `NULL`.

##### Parâmetros

- `in_connection_id BIGINT UNSIGNED`: O ID da conexão para a qual deseja-se retornar o ID do thread. Este é um valor do tipo especificado na coluna `PROCESSLIST_ID` da tabela `threads` do Gerenciamento de Desempenho ou na coluna `Id` da saída do comando `SHOW PROCESSLIST`.

##### Valor de retorno

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
