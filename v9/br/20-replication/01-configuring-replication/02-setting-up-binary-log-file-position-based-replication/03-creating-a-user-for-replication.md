#### 19.1.2.3 Criando um Usuário para Replicação

Cada replica se conecta à fonte usando um nome de usuário e senha do MySQL, portanto, deve haver uma conta de usuário na fonte que a replica possa usar para se conectar. O nome de usuário é especificado pela opção `SOURCE_USER` da instrução `CHANGE REPLICATION SOURCE TO` ao configurar uma replica. Qualquer conta pode ser usada para essa operação, desde que tenha sido concedido o privilégio `REPLICATION SLAVE`. Você pode optar por criar uma conta diferente para cada replica ou se conectar à fonte usando a mesma conta para cada replica.

Embora você não precise criar uma conta especificamente para a replicação, você deve estar ciente de que o nome de usuário e a senha do usuário de replicação são armazenados em texto plano no repositório de metadados de replicação `mysql.slave_master_info` (veja a Seção 19.2.4.2, “Repositórios de Metadados de Replicação”). Portanto, você pode querer criar uma conta separada que tenha privilégios apenas para o processo de replicação, para minimizar a possibilidade de comprometimento com outras contas.

Para criar uma nova conta, use `CREATE USER`. Para conceder a essa conta os privilégios necessários para a replicação, use a instrução `GRANT`. Se você criar uma conta apenas para fins de replicação, essa conta precisa apenas do privilégio `REPLICATION SLAVE`. Por exemplo, para configurar um novo usuário, `repl`, que possa se conectar para replicação de qualquer host dentro do domínio `example.com`, emita essas instruções na fonte:

```
mysql> CREATE USER 'repl'@'%.example.com' IDENTIFIED BY 'password';
mysql> GRANT REPLICATION SLAVE ON *.* TO 'repl'@'%.example.com';
```

Veja a Seção 15.7.1, “Instruções de Gerenciamento de Contas”, para mais informações sobre instruções para manipulação de contas de usuário.

Importante

Para se conectar à fonte usando uma conta de usuário que autentica com o plugin `caching_sha2_password`, você deve configurar uma conexão segura conforme descrito na Seção 19.3.1, “Configurando a Replicação para Usar Conexões Encriptadas”, ou habilitar a conexão não encriptada para suportar a troca de senhas usando um par de chaves RSA. O plugin de autenticação `caching_sha2_password` é o padrão para novos usuários (veja a Seção 8.4.1.1, “Cache SHA-2 Pluggable Authentication”). Se a conta de usuário que você cria ou usa para a replicação (conforme especificado pela opção `SOURCE_USER`) usar este plugin de autenticação e você não estiver usando uma conexão segura, você deve habilitar a troca de senhas baseada em par de chaves RSA para uma conexão bem-sucedida.