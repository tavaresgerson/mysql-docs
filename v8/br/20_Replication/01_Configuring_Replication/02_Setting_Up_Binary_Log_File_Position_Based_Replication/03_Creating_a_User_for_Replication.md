#### 19.1.2.3 Criar um Usuário para Replicação

Cada réplica se conecta à fonte usando um nome de usuário e senha MySQL, portanto, deve haver uma conta de usuário na fonte que a réplica possa usar para se conectar. O nome de usuário é especificado pela opção `SOURCE_USER` | `MASTER_USER` da declaração `CHANGE REPLICATION SOURCE TO` (a partir do MySQL 8.0.23) ou da declaração `CHANGE MASTER TO` (antes do MySQL 8.0.23) ao configurar uma réplica. Qualquer conta pode ser usada para essa operação, desde que tenha sido concedido o privilégio `REPLICATION SLAVE`. Você pode optar por criar uma conta diferente para cada réplica ou se conectar à fonte usando a mesma conta para cada réplica.

Embora você não precise criar uma conta especificamente para a replicação, você deve estar ciente de que o nome de usuário e a senha do usuário de replicação são armazenados em texto simples no repositório de metadados de conexão da replica `mysql.slave_master_info` (consulte a Seção 19.2.4.2, “Repositórios de Metadados de Replicação”). Portanto, você pode querer criar uma conta separada que tenha privilégios apenas para o processo de replicação, para minimizar a possibilidade de comprometimento de outras contas.

Para criar uma nova conta, use `CREATE USER`. Para conceder a esta conta os privilégios necessários para a replicação, use a instrução `GRANT`. Se você criar uma conta apenas para fins de replicação, essa conta precisa apenas do privilégio `REPLICATION SLAVE`. Por exemplo, para configurar um novo usuário, `repl`, que possa se conectar para replicação de qualquer host dentro do domínio `example.com`, emita essas instruções na fonte:

```
mysql> CREATE USER 'repl'@'%.example.com' IDENTIFIED BY 'password';
mysql> GRANT REPLICATION SLAVE ON *.* TO 'repl'@'%.example.com';
```

Consulte a Seção 15.7.1, “Declarações de Gerenciamento de Conta”, para obter mais informações sobre declarações de manipulação de contas de usuário.

Importante

Para se conectar à fonte usando uma conta de usuário que autentica com o plugin `caching_sha2_password`, você deve configurar uma conexão segura conforme descrito na Seção 19.3.1, “Configurando a Replicação para Usar Conexões Encriptadas”, ou habilitar a conexão não encriptada para suportar a troca de senhas usando um par de chaves RSA. O plugin de autenticação `caching_sha2_password` é o padrão para novos usuários criados a partir do MySQL 8.0 (para detalhes, consulte a Seção 8.4.1.2, “Cacheamento de Autenticação Encriptable SHA-2”). Se a conta de usuário que você cria ou usa para a replicação (conforme especificado pela opção `MASTER_USER`) usar este plugin de autenticação e você não estiver usando uma conexão segura, você deve habilitar a troca de senhas baseada em par de chaves RSA para uma conexão bem-sucedida.
