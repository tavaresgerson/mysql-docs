#### 26.4.5.9 A Função ps_is_account_enabled()

Retorna `YES` ou `NO` para indicar se a instrumentação do Performance Schema para uma determinada conta está habilitada.

##### Parâmetros

* `in_host VARCHAR(60)`: O nome do Host da conta a ser verificada.

* `in_user VARCHAR(32)`: O nome do User da conta a ser verificada.

##### Valor de Retorno

Um valor `ENUM('YES','NO')`.

##### Exemplo

```sql
mysql> SELECT sys.ps_is_account_enabled('localhost', 'root');
+------------------------------------------------+
| sys.ps_is_account_enabled('localhost', 'root') |
+------------------------------------------------+
| YES                                            |
+------------------------------------------------+
```