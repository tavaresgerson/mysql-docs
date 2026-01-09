#### 30.4.5.9 A função ps_is_account_enabled()

Retorna `SIM` ou `NÃO` para indicar se a instrumentação do Schema de Desempenho para uma conta específica está habilitada.

##### Parâmetros

* `in_host VARCHAR(60)`: O nome do host da conta a ser verificada.

* `in_user VARCHAR(32)`: O nome de usuário da conta a ser verificada.

##### Valor de retorno

Um valor `ENUM('SIM','NÃO')`.

##### Exemplo

```
mysql> SELECT sys.ps_is_account_enabled('localhost', 'root');
+------------------------------------------------+
| sys.ps_is_account_enabled('localhost', 'root') |
+------------------------------------------------+
| YES                                            |
+------------------------------------------------+
```