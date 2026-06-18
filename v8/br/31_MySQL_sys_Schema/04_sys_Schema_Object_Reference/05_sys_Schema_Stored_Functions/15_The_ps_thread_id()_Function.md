#### 30.4.5.15 A função ps\_thread\_id()

Nota

A partir do MySQL 8.0.16, a função `ps_thread_id()`") é desaconselhada e está sujeita à remoção em uma versão futura do MySQL. As aplicações que a utilizam devem ser migradas para usar as funções integradas `PS_THREAD_ID()` e `PS_CURRENT_THREAD_ID()` em vez disso. Consulte a Seção 14.21, "Funções do Schema de Desempenho"

Retorna o ID de thread do Schema de Desempenho atribuído a um ID de conexão dado, ou o ID de thread para a conexão atual, se o ID de conexão for `NULL`.

##### Parâmetros

- `in_connection_id BIGINT UNSIGNED`: O ID da conexão para a qual deseja-se retornar o ID do thread. Este é um valor do tipo especificado na coluna `PROCESSLIST_ID` da tabela do Gerenciamento de Desempenho `threads` ou na coluna `Id` do `SHOW PROCESSLIST` de saída.

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
