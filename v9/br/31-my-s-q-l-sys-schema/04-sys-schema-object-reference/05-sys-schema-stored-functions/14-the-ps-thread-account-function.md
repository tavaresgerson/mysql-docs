#### 30.4.5.14 A função ps\_thread\_account()

Dado um ID de thread do Schema de Desempenho, retorna a conta `user_name@host_name` associada ao thread.

##### Parâmetros

* `in_thread_id BIGINT UNSIGNED`: O ID de thread para o qual se deseja retornar a conta. O valor deve corresponder à coluna `THREAD_ID` de alguma linha da tabela `threads` do Schema de Desempenho.

##### Valor de retorno

Um valor `TEXT`.

##### Exemplo

```
mysql> SELECT sys.ps_thread_account(sys.ps_thread_id(CONNECTION_ID()));
+----------------------------------------------------------+
| sys.ps_thread_account(sys.ps_thread_id(CONNECTION_ID())) |
+----------------------------------------------------------+
| root@localhost                                           |
+----------------------------------------------------------+
```