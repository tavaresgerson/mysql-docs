#### 26.4.5.14 A função ps\_thread\_account()

Dada uma ID de thread do Schema de Desempenho, retorna a conta `user_name@host_name` associada à thread.

##### Parâmetros

- `in_thread_id BIGINT UNSIGNED`: O ID do thread para o qual você deseja retornar a conta. O valor deve corresponder à coluna `THREAD_ID` de alguma linha da tabela `threads` do Gerenciamento de Desempenho.

##### Valor de retorno

Um valor `TEXT`.

##### Exemplo

```sql
mysql> SELECT sys.ps_thread_account(sys.ps_thread_id(CONNECTION_ID()));
+----------------------------------------------------------+
| sys.ps_thread_account(sys.ps_thread_id(CONNECTION_ID())) |
+----------------------------------------------------------+
| root@localhost                                           |
+----------------------------------------------------------+
```
