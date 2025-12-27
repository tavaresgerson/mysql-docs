#### 20.6.3.1 Credenciais de Usuário Seguro para Recuperação Distribuída

A transferência de estado do log binário requer um usuário de replicação com as permissões corretas para que a Replicação de Grupo possa estabelecer canais de replicação diretos entre os membros. O mesmo usuário de replicação é usado para a recuperação distribuída em todos os membros do grupo. Se os membros do grupo foram configurados para suportar o uso de uma operação de clonagem remota como parte da recuperação distribuída, este usuário de replicação também é usado como o usuário de clone no doador e requer as permissões corretas para este papel. Para instruções detalhadas sobre como configurar este usuário, consulte a Seção 20.2.1.3, “Credenciais de Usuário para Recuperação Distribuída”.

Para garantir as credenciais de usuário, você pode exigir SSL para conexões com a conta de usuário e fornecer as credenciais do usuário quando a Replicação de Grupo for iniciada, em vez de armazená-las nas tabelas de status de replicação. Além disso, se você estiver usando o cache de autenticação SHA-2, você deve configurar pares de chaves RSA nos membros do grupo.

Importante

Ao usar a pilha de comunicação MySQL (`group_replication_communication_stack=MYSQL`) E conexões seguras entre os membros (`group_replication_ssl_mode` não está configurado como `DISABLED`), os usuários de recuperação devem ser configurados corretamente, pois também são os usuários para comunicações de grupo. Siga as instruções na Seção 20.6.3.1.2, “Usuário de Replicação com o Plugin de Autenticação SHA-2 de Caching” e na Seção 20.6.3.1.3, “Fornecer Credenciais de Usuário de Replicação de Forma Segura”.

##### 20.6.3.1.1 Usuário de Replicação com o Plugin de Autenticação SHA-2 de Caching

Por padrão, os usuários criados no MySQL 8 utilizam a Seção 8.4.1.1, “Cacheamento de Autenticação SHA-2 Pluggable”. Se o usuário de replicação que você configura para a recuperação distribuída usar o plugin de autenticação de cache SHA-2, e você não estiver usando SSL para conexões de recuperação distribuída, pares de chaves RSA são usados para a troca de senhas. Para mais informações sobre pares de chaves RSA, consulte a Seção 8.3.3, “Criando Certificados e Chaves SSL e RSA”.

Nessa situação, você pode copiar a chave pública do `rpl_user` para o membro que está se juntando, ou configurar os doadores para fornecer a chave pública quando solicitada. A abordagem mais segura é copiar a chave pública da conta do usuário de replicação para o membro que está se juntando. Em seguida, você precisa configurar a variável de sistema `group_replication_recovery_public_key_path` no membro que está se juntando com o caminho para a chave pública da conta do usuário de replicação.

A abordagem menos segura é configurar `group_replication_recovery_get_public_key=ON` nos doadores para que eles forneçam a chave pública da conta do usuário de replicação aos membros que estão se juntando. Não há como verificar a identidade de um servidor, portanto, configure `group_replication_recovery_get_public_key=ON` apenas quando você tiver certeza de que não há risco de a identidade do servidor ser comprometida, por exemplo, por um ataque de intermediário.

##### 20.6.3.1.2 Usuário de Replicação com SSL

Um usuário de replicação que requer uma conexão SSL deve ser criado *antes* do servidor que está se juntando ao grupo (o membro que está se juntando) se conectar ao doador. Tipicamente, isso é configurado no momento em que você está provisionando um servidor para se juntar ao grupo. Para criar um usuário de replicação para recuperação distribuída que requer uma conexão SSL, execute essas instruções em todos os servidores que vão participar do grupo:

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

O privilégio `GROUP_REPLICATION_STREAM` é necessário ao usar tanto a pilha de comunicação MySQL (`group_replication_communication_stack=MYSQL`) quanto conexões seguras entre os membros (`group_replication_ssl_mode` não definido como `DISABLED`). Veja a Seção 20.6.1, “Pilha de Comunicação para Gerenciamento de Segurança de Conexão”.

##### 20.6.3.1.3 Fornecer Credenciais de Usuário de Replicação de Forma Segura

Para fornecer as credenciais do usuário de replicação, você pode configurá-las permanentemente como as credenciais para o canal `group_replication_recovery`, usando uma declaração `CHANGE REPLICATION SOURCE TO`. Alternativamente, você pode especiﬁcar as credenciais no momento da declaração `START GROUP_REPLICATION` sempre que a Replicação de Grupo for iniciada. As credenciais de usuário especificadas em `START GROUP_REPLICATION` têm precedência sobre quaisquer credenciais de usuário que tenham sido configuradas usando uma declaração `CHANGE REPLICATION SOURCE TO`.

As credenciais de usuário configuradas usando `CHANGE REPLICATION SOURCE TO` são armazenadas em texto plano nos repositórios de metadados de replicação no servidor, mas as credenciais de usuário especificadas em `START GROUP_REPLICATION` são salvas apenas na memória e são removidas por uma declaração `STOP GROUP_REPLICATION` ou o desligamento do servidor. Usar `START GROUP_REPLICATION` para especificar as credenciais de usuário, portanto, ajuda a proteger os servidores da Replicação de Grupo contra acesso não autorizado. No entanto, esse método não é compatível com o início automático da Replicação de Grupo, conforme especificado pela variável de sistema `group_replication_start_on_boot`.

Se você deseja configurar as credenciais de usuário permanentemente usando uma declaração `CHANGE REPLICATION SOURCE TO`, execute essa declaração no membro que vai se juntar ao grupo:

```
mysql> CHANGE REPLICATION SOURCE TO SOURCE_USER='rec_ssl_user',
    ->   SOURCE_PASSWORD='password'
    ->   FOR CHANNEL 'group_replication_recovery';
```

Para fornecer as credenciais do usuário na instrução `START GROUP_REPLICATION`, execute essa instrução ao iniciar a Replicação de Grupo pela primeira vez ou após o reinício do servidor:

```
mysql> START GROUP_REPLICATION USER='rec_ssl_user', PASSWORD='password';
```

Importante

Se você mudar para usar `START GROUP_REPLICATION` para especificar as credenciais do usuário em um servidor que anteriormente forneceu as credenciais usando `CHANGE REPLICATION SOURCE TO`, você deve completar as seguintes etapas para obter os benefícios de segurança dessa mudança.

1. Pare a Replicação de Grupo no membro do grupo usando uma instrução `STOP GROUP_REPLICATION`. Embora seja possível realizar as seguintes duas etapas enquanto a Replicação de Grupo está em execução, você precisa reiniciar a Replicação de Grupo para implementar as alterações.

2. Defina o valor da variável de sistema `group_replication_start_on_boot` para `OFF` (o padrão é `ON`).

3. Remova as credenciais de recuperação distribuída das tabelas de status da replica executando essa instrução:

   ```
   mysql> CHANGE REPLICATION SOURCE TO SOURCE_USER='', SOURCE_PASSWORD=''
       ->   FOR CHANNEL 'group_replication_recovery';
   ```

4. Reinicie a Replicação de Grupo no membro do grupo usando uma instrução `START GROUP_REPLICATION` que especifique as credenciais do usuário de recuperação distribuída.

Sem essas etapas, as credenciais permanecem armazenadas nas tabelas de status da replica e também podem ser transferidas para outros membros do grupo durante operações de clonagem remota para recuperação distribuída. O canal `group_replication_recovery` poderia então ser iniciado acidentalmente com as credenciais armazenadas, seja no membro original ou nos membros que foram clonados a partir dele. Um início automático da Replicação de Grupo no boot do servidor (incluindo após uma operação de clonagem remota) usaria as credenciais armazenadas, e elas também seriam usadas se um operador não especificar as credenciais de recuperação distribuída como parte de `START GROUP_REPLICATION`.