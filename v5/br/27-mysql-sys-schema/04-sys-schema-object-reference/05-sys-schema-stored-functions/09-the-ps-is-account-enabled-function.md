#### 26.4.5.9 A função ps_is_account_enabled()

Retorna `YES` ou `NO` para indicar se a instrumentação do Schema de Desempenho para uma conta específica está habilitada.

##### Parâmetros

- `in_host VARCHAR(60)`: O nome do host da conta a ser verificada.

- `in_user VARCHAR(32)`: O nome do usuário da conta a ser verificada.

##### Valor de retorno

Um valor `ENUM('SIM','NÃO')`.

##### Exemplo

```sql
mysql> SELECT sys.ps_is_account_enabled('localhost', 'root');
+------------------------------------------------+
| sys.ps_is_account_enabled('localhost', 'root') |
+------------------------------------------------+
| YES                                            |
+------------------------------------------------+
```
