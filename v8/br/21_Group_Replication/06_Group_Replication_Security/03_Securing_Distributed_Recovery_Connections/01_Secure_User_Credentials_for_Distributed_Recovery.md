#### 20.6.3.1 Segurança das Credenciais do Usuário para Recuperação Distribuída

A transferência de estado do log binário requer um usuário de replicação com as permissões corretas para que a Replicação em Grupo possa estabelecer canais de replicação diretos entre os membros. O mesmo usuário de replicação é usado para a recuperação distribuída em todos os membros do grupo. Se os membros do grupo foram configurados para suportar o uso de uma operação de clonagem remota como parte da recuperação distribuída, que está disponível a partir do MySQL 8.0.17, este usuário de replicação também é usado como o usuário de clonagem no doador e requer as permissões corretas para este papel também. Para instruções detalhadas sobre como configurar este usuário, consulte a Seção 20.2.1.3, “Credenciais de Usuário para Recuperação Distribuída”.

Para garantir as credenciais do usuário, você pode exigir SSL para conexões com a conta do usuário e (a partir do MySQL 8.0.21) você pode fornecer as credenciais do usuário quando a Replicação por Grupo for iniciada, em vez de armazená-las nas tabelas de status da replica. Além disso, se você estiver usando autenticação de cache SHA-2, você deve configurar pares de chaves RSA nos membros do grupo.

Importante

Ao usar a pilha de comunicação MySQL (`group_replication_communication_stack=MYSQL`) E conexões seguras entre os membros (`group_replication_ssl_mode` não está definido como `DISABLED`), os usuários de recuperação devem ser configurados corretamente, pois eles também são os usuários para comunicações de grupo. Siga as instruções na Seção 20.6.3.1.2, “Usuário de Replicação com SSL” e na Seção 20.6.3.1.3, “Fornecer Credenciais de Usuário de Replicação de Forma Segura”.

##### 20.6.3.1.1 Usuário de replicação com o plugin de autenticação SHA-2 de cacheamento

Por padrão, os usuários criados no MySQL 8 utilizam a Seção 8.4.1.2, “Cacheamento de Autenticação SHA-2 Pluggable”. Se o usuário de replicação que você configura para a recuperação distribuída usar o plugin de autenticação de cache SHA-2, e você não estiver usando SSL para conexões de recuperação distribuída, pares de chaves RSA serão usados para a troca de senhas. Para mais informações sobre pares de chaves RSA, consulte a Seção 8.3.3, “Criando Certificados e Chaves SSL e RSA”.

Nessa situação, você pode copiar a chave pública do `rpl_user` para o membro que está se juntando, ou configurar os doadores para fornecerem a chave pública quando solicitada. A abordagem mais segura é copiar a chave pública da conta de usuário de replicação para o membro que está se juntando. Em seguida, você precisa configurar a variável de sistema `group_replication_recovery_public_key_path` no membro que está se juntando com o caminho para a chave pública da conta de usuário de replicação.

A abordagem menos segura é definir `group_replication_recovery_get_public_key=ON` nos doadores para que eles forneçam a chave pública da conta de usuário de replicação aos membros que se juntam. Não há como verificar a identidade de um servidor, portanto, defina apenas `group_replication_recovery_get_public_key=ON` quando estiver certo de que não há risco de a identidade do servidor ser comprometida, por exemplo, por um ataque de homem no meio.

##### 20.6.3.1.2 Usuário de replicação com SSL

Um usuário de replicação que requer uma conexão SSL deve ser criado *antes* do servidor que está se juntando ao grupo (o membro que está se juntando) se conectar ao doador. Normalmente, isso é configurado no momento em que você está provisionando um servidor para se juntar ao grupo. Para criar um usuário de replicação para recuperação distribuída que requer uma conexão SSL, execute essas instruções em todos os servidores que vão participar do grupo:

```
mysql> SET SQL_LOG_BIN=0;
mysql> CREATE USER 'rec_ssl_user'@'%' IDENTIFIED BY 'password' REQUIRE SSL;
mysql> GRANT REPLICATION SLAVE ON *.* TO 'rec_ssl_user'@'%';
mysql> GRANT CONNECTION_ADMIN ON *.* TO 'rec_ssl_user'@'%';
mysql> GRANT BACKUP_ADMIN ON *.* TO 'rec_ssl_user'@'%';
mysql> GRANT GROUP_REPLICATION_STREAM ON *.* TO rec_ssl_user@'%';
mysql> FLUSH PRIVILEGES;
mysql> SET SQL_LOG_BIN=1;
```

Nota

O privilégio `GROUP_REPLICATION_STREAM` é necessário ao usar tanto a pilha de comunicação MySQL (`group_replication_communication_stack=MYSQL`) quanto conexões seguras entre membros (`group_replication_ssl_mode` não definido como `DISABLED`). Veja a Seção 20.6.1, “Pilha de Comunicação para Gerenciamento de Segurança de Conexão”.

##### 20.6.3.1.3 Fornecer credenciais de usuário de replicação de forma segura

Para fornecer as credenciais do usuário para o usuário de replicação, você pode configurá-las permanentemente como as credenciais para o canal `group_replication_recovery` usando uma declaração `CHANGE REPLICATION SOURCE TO` | `CHANGE MASTER TO`. Alternativamente, a partir do MySQL 8.0.21, você pode especiá-las na declaração `START GROUP_REPLICATION` cada vez que o Replicação em Grupo é iniciado. As credenciais do usuário especificadas em `START GROUP_REPLICATION` têm precedência sobre quaisquer credenciais do usuário que tenham sido configuradas usando uma declaração `CHANGE REPLICATION SOURCE TO` | `CHANGE MASTER TO`.

As credenciais do usuário definidas usando `CHANGE REPLICATION SOURCE TO` | `CHANGE MASTER TO` são armazenadas em texto simples nos repositórios de metadados de replicação no servidor, mas as credenciais do usuário especificadas em `START GROUP_REPLICATION` são salvas apenas na memória e são removidas por uma declaração `STOP GROUP_REPLICATION` ou desligamento do servidor. Usar `START GROUP_REPLICATION` para especificar as credenciais do usuário, portanto, ajuda a proteger os servidores de replicação de grupo contra acesso não autorizado. No entanto, esse método não é compatível com o início automático da replicação de grupo, conforme especificado pela variável de sistema `group_replication_start_on_boot`.

Se você quiser definir as credenciais do usuário permanentemente usando uma declaração `CHANGE REPLICATION SOURCE TO` | `CHANGE MASTER TO`, emita essa declaração no membro que vai se juntar ao grupo:

```
mysql> CHANGE MASTER TO MASTER_USER='rec_ssl_user', MASTER_PASSWORD='password'
            FOR CHANNEL 'group_replication_recovery';

Or from MySQL 8.0.23:
mysql> CHANGE REPLICATION SOURCE TO SOURCE_USER='rec_ssl_user', SOURCE_PASSWORD='password'
            FOR CHANNEL 'group_replication_recovery';
```

Para fornecer as credenciais do usuário no `START GROUP_REPLICATION`, emita essa declaração ao iniciar a Replicação em Grupo pela primeira vez ou após o reinício do servidor:

```
mysql> START GROUP_REPLICATION USER='rec_ssl_user', PASSWORD='password';
```

Importante

Se você mudar para usar `START GROUP_REPLICATION` para especificar as credenciais do usuário em um servidor que forneceu as credenciais anteriormente usando `CHANGE REPLICATION SOURCE TO` | `CHANGE MASTER TO`, você deve seguir os passos abaixo para obter os benefícios de segurança dessa mudança.

1. Pare a replicação em grupo no membro do grupo usando uma declaração `STOP GROUP_REPLICATION`. Embora seja possível dar os dois passos seguintes enquanto a replicação em grupo estiver em execução, você precisa reiniciar a replicação em grupo para implementar as alterações.

2. Defina o valor da variável de sistema `group_replication_start_on_boot` para `OFF` (o padrão é `ON`).

3. Remova as credenciais de recuperação distribuídas das tabelas de status de replicação, emitindo a seguinte declaração:

   ```
   mysql> CHANGE MASTER TO MASTER_USER='', MASTER_PASSWORD=''
               FOR CHANNEL 'group_replication_recovery';

   Or from MySQL 8.0.23:
   mysql> CHANGE REPLICATION SOURCE TO SOURCE_USER='', SOURCE_PASSWORD=''
               FOR CHANNEL 'group_replication_recovery';
   ```

4. Reinicie a replicação em grupo no membro do grupo usando uma declaração `START GROUP_REPLICATION` que especifique as credenciais de usuário de recuperação distribuída.

Sem essas etapas, as credenciais permanecem armazenadas nas tabelas de status da replica e também podem ser transferidas para outros membros do grupo durante operações de clonagem remota para recuperação distribuída. O canal `group_replication_recovery` poderia então ser iniciado acidentalmente com as credenciais armazenadas, seja no membro original ou nos membros que foram clonados a partir dele. Um início automático da Replicação de Grupo ao inicializar o servidor (incluindo após uma operação de clonagem remota) usaria as credenciais de usuário armazenadas, e elas também seriam usadas se um operador não especificar as credenciais de recuperação distribuída como parte do `START GROUP_REPLICATION`.
