#### 16.1.2.2 Criar um Usuário para Replicação

Cada réplica se conecta à fonte usando um nome de usuário e senha MySQL, portanto, deve haver uma conta de usuário na fonte que a réplica possa usar para se conectar. O nome de usuário é especificado pela opção `MASTER_USER` no comando `CHANGE MASTER TO` quando você configura uma réplica. Qualquer conta pode ser usada para essa operação, desde que tenha sido concedido o privilégio `REPLICATION SLAVE`. Você pode optar por criar uma conta diferente para cada réplica ou se conectar à fonte usando a mesma conta para cada réplica.

Embora você não precise criar uma conta especificamente para a replicação, você deve estar ciente de que o nome de usuário e a senha do usuário de replicação são armazenados em texto simples nos repositórios de metadados de replicação (consulte Seção 16.2.4.2, “Repositórios de Metadados de Replicação”). Portanto, você pode querer criar uma conta separada que tenha privilégios apenas para o processo de replicação, para minimizar a possibilidade de comprometimento de outras contas.

Para criar uma nova conta, use `CREATE USER`. Para conceder a esta conta os privilégios necessários para a replicação, use a instrução `GRANT`. Se você criar uma conta apenas para fins de replicação, essa conta precisa apenas do privilégio `REPLICATION SLAVE`. Por exemplo, para configurar um novo usuário, `repl`, que possa se conectar para replicação de qualquer host dentro do domínio `example.com`, emita essas instruções na fonte:

```sql
mysql> CREATE USER 'repl'@'%.example.com' IDENTIFIED BY 'password';
mysql> GRANT REPLICATION SLAVE ON *.* TO 'repl'@'%.example.com';
```

Consulte Seção 13.7.1, "Declarações de Gerenciamento de Conta" para obter mais informações sobre declarações de manipulação de contas de usuário.
