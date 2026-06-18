#### 13.7.5.12 SHOW CREATE USER Statement

```sql
SHOW CREATE USER user
```

Esta instrução mostra a instrução `CREATE USER` que cria o usuário nomeado. Um erro ocorre se o usuário não existir. A instrução requer o privilégio `SELECT` para o system Database `mysql`, exceto para exibir informações para o usuário atual.

Para nomear a conta, use o formato descrito na Seção 6.2.4, “Specifying Account Names”. A parte do host name do nome da conta, se omitida, assume o padrão `'%'`. Também é possível especificar `CURRENT_USER` ou `CURRENT_USER()` para se referir à conta associada à sessão atual.

```sql
mysql> SHOW CREATE USER 'root'@'localhost'\G
*************************** 1. row ***************************
CREATE USER for root@localhost: CREATE USER 'root'@'localhost'
IDENTIFIED WITH 'mysql_native_password'
AS '*2470C0C06DEE42FD1618BB99005ADCA2EC9D1E19'
REQUIRE NONE PASSWORD EXPIRE DEFAULT ACCOUNT UNLOCK
```

O formato da saída é afetado pela configuração da system variable `log_builtin_as_identified_by_password`.

Para exibir os privilégios concedidos a uma conta, utilize a instrução `SHOW GRANTS`. Consulte Seção 13.7.5.21, “SHOW GRANTS Statement”.