#### 16.1.2.2 Criação de um Usuário para Replicação

Cada replica se conecta ao source usando um nome de usuário MySQL e password, portanto, deve haver uma conta de usuário no source que a replica possa usar para se conectar. O nome de usuário é especificado pela opção `MASTER_USER` no comando `CHANGE MASTER TO` ao configurar uma replica. Qualquer conta pode ser usada para esta operação, desde que lhe tenha sido concedido o privilege [`REPLICATION SLAVE`](privileges-provided.html#priv_replication-slave). Você pode optar por criar uma conta diferente para cada replica, ou se conectar ao source usando a mesma conta para cada replica.

Embora você não precise criar uma conta especificamente para replication, você deve estar ciente de que o nome de usuário e a password da replication são armazenados em `plain text` (texto simples) nos replication metadata repositories (repositórios de metadados de replicação) (veja [Section 16.2.4.2, “Replication Metadata Repositories”](replica-logs-status.html "16.2.4.2 Replication Metadata Repositories")). Portanto, você pode querer criar uma conta separada que tenha privileges apenas para o processo de replication, para minimizar a possibilidade de comprometimento de outras contas.

Para criar uma nova conta, use [`CREATE USER`](create-user.html "13.7.1.2 CREATE USER Statement"). Para conceder a esta conta os privileges necessários para replication, use a Statement [`GRANT`](grant.html "13.7.1.4 GRANT Statement"). Se você criar uma conta apenas para fins de replication, essa conta necessita apenas do privilege [`REPLICATION SLAVE`](privileges-provided.html#priv_replication-slave). Por exemplo, para configurar um novo user, `repl`, que possa se conectar para replication a partir de qualquer host dentro do domain `example.com`, execute estas Statements no source:

```sql
mysql> CREATE USER 'repl'@'%.example.com' IDENTIFIED BY 'password';
mysql> GRANT REPLICATION SLAVE ON *.* TO 'repl'@'%.example.com';
```

Veja [Section 13.7.1, “Account Management Statements”](account-management-statements.html "13.7.1 Account Management Statements"), para mais informações sobre statements para manipulação de contas de usuário.