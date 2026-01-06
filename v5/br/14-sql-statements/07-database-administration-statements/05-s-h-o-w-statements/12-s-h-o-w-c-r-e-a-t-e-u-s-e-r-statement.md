#### 13.7.5.12 Declaração SHOW CREATE USER

```sql
SHOW CREATE USER user
```

Esta declaração mostra a declaração `CREATE USER` que cria o usuário nomeado. Um erro ocorre se o usuário não existir. A declaração requer o privilégio `SELECT` para o banco de dados do sistema `mysql`, exceto para exibir informações para o usuário atual.

Para nomear a conta, use o formato descrito na Seção 6.2.4, “Especificação de Nomes de Conta”. A parte do nome da conta que contém o nome do host, se omitida, tem como padrão `'%'`. Também é possível especificar `CURRENT_USER` ou `CURRENT_USER()` para se referir à conta associada à sessão atual.

```sql
mysql> SHOW CREATE USER 'root'@'localhost'\G
*************************** 1. row ***************************
CREATE USER for root@localhost: CREATE USER 'root'@'localhost'
IDENTIFIED WITH 'mysql_native_password'
AS '*2470C0C06DEE42FD1618BB99005ADCA2EC9D1E19'
REQUIRE NONE PASSWORD EXPIRE DEFAULT ACCOUNT UNLOCK
```

O formato de saída é afetado pela configuração da variável de sistema `log_builtin_as_identified_by_password`.

Para exibir os privilégios concedidos a uma conta, use a instrução `SHOW GRANTS`. Veja Seção 13.7.5.21, “Instrução SHOW GRANTS”.
