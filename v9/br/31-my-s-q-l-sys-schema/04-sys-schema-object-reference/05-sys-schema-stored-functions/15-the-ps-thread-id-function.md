#### 30.4.5.15 A função `ps_thread_id()`

Observação

A função `ps_thread_id()`") está desatualizada e está sujeita à remoção em uma versão futura do MySQL. As aplicações que a utilizam devem ser migradas para usar as funções integradas `PS_THREAD_ID()` e `PS_CURRENT_THREAD_ID()` em vez disso. Consulte a Seção 14.22, “Funções do Schema de Desempenho”

Retorna o ID do thread do Schema de Desempenho atribuído a um ID de conexão dado, ou o ID do thread para a conexão atual se o ID de conexão for `NULL`.

##### Parâmetros

* `in_connection_id BIGINT UNSIGNED`: O ID da conexão para o qual deseja-se retornar o ID do thread. Este é um valor do tipo dado na coluna `PROCESSLIST_ID` da tabela `threads` do Schema de Desempenho ou na coluna `Id` da saída `SHOW PROCESSLIST`.

##### Valor de retorno

Um valor `BIGINT UNSIGNED`.

##### Exemplo

```
mysql> SELECT sys.ps_thread_id(260);
+-----------------------+
| sys.ps_thread_id(260) |
+-----------------------+
|                   285 |
+-----------------------+
```