#### 26.4.5.14 A Função ps_thread_account()

Dado um *Thread ID* do *Performance Schema*, retorna a conta `user_name@host_name` associada ao *thread*.

##### Parâmetros

* `in_thread_id BIGINT UNSIGNED`: O *Thread ID* para o qual retornar a conta. O valor deve corresponder à coluna `THREAD_ID` de alguma linha da tabela `threads` do *Performance Schema*.

##### Valor de Retorno

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