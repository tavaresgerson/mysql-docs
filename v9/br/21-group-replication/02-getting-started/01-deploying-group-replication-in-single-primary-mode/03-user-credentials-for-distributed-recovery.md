#### 20.2.1.3 Credenciais do Usuário para Recuperação Distribuída

A Replicação em Grupo utiliza um processo de recuperação distribuída para sincronizar os membros do grupo ao integrá-los ao grupo. A recuperação distribuída envolve a transferência de transações do log binário de um doador para um membro que está se juntando, usando um canal de replicação chamado `group_replication_recovery`. Portanto, é necessário configurar um usuário de replicação com as permissões corretas para que a Replicação em Grupo possa estabelecer canais de replicação diretos entre os membros. Se os membros do grupo foram configurados para suportar o uso de uma operação de clonagem remota como parte da recuperação distribuída, esse usuário de replicação também é usado como usuário de clonagem no doador e requer as permissões corretas para esse papel também. Para uma descrição completa da recuperação distribuída, consulte a Seção 20.5.4, “Recuperação Distribuída”.

O mesmo usuário de replicação deve ser usado para a recuperação distribuída em todos os membros do grupo. O processo de criação do usuário de replicação para a recuperação distribuída pode ser registrado no log binário e, em seguida, você pode confiar na recuperação distribuída para replicar as declarações usadas para criar o usuário. Alternativamente, você pode desabilitar o registro binário antes de criar o usuário de replicação e, em seguida, criar o usuário manualmente em cada membro, por exemplo, se você quiser evitar que as alterações sejam propagadas a outras instâncias do servidor. Se você fizer isso, certifique-se de reativar o registro binário uma vez que tenha configurado o usuário.

Importante

Se as conexões de recuperação distribuída do seu grupo usam SSL, o usuário de replicação deve ser criado em cada servidor *antes* do membro que está se juntando se conectar ao doador. Para instruções sobre como configurar SSL para conexões de recuperação distribuída e criar um usuário de replicação que exija SSL, consulte a Seção 20.6.3, “Segurança das Conexões de Recuperação Distribuída”

Importante

Por padrão, os usuários criados no MySQL 8 utilizam a Seção 8.4.1.1, “Cacheamento de Autenticação SHA-2 Pluggable”. Se o usuário de replicação para a recuperação distribuída utilizar o plugin de autenticação de cache SHA-2, e você não estiver usando SSL para as conexões de recuperação distribuída, pares de chaves RSA serão usados para a troca de senhas. Você pode copiar a chave pública do usuário de replicação para o membro que está se juntando, ou configurar os doadores para fornecer a chave pública quando solicitado. Para obter instruções sobre como fazer isso, consulte a Seção 20.6.3.1, “Credenciais de Usuário Seguro para Recuperação Distribuída”.

Para criar o usuário de replicação para a recuperação distribuída, siga estes passos:

1. Inicie a instância do servidor MySQL e, em seguida, conecte um cliente a ele.

2. Se você quiser desabilitar o registro binário para criar o usuário de replicação separadamente em cada instância, faça isso emitindo a seguinte instrução:

   ```
   mysql> SET SQL_LOG_BIN=0;
   ```

3. Crie um usuário MySQL com os seguintes privilégios:

   * `REPLICATION SLAVE`, que é necessário para fazer uma conexão de recuperação distribuída a um doador para recuperar dados.

   * `CONNECTION_ADMIN`, que garante que as conexões de Replicação de Grupo não sejam terminadas se um dos servidores envolvidos for colocado no modo offline.

   * `BACKUP_ADMIN`, se os servidores no grupo de replicação estiverem configurados para suportar clonagem (consulte a Seção 20.5.4.2, “Clonagem para Recuperação Distribuída”). Este privilégio é necessário para que um membro atue como doador em uma operação de clonagem para recuperação distribuída.

* `GROUP_REPLICATION_STREAM`, se a pilha de comunicação MySQL estiver sendo usada para o grupo de replicação (consulte a Seção 20.6.1, “Pilha de Comunicação para Gerenciamento de Segurança de Conexão”). Este privilégio é necessário para que a conta de usuário possa estabelecer e manter conexões para a Replicação em Grupo usando a pilha de comunicação MySQL.

Neste exemplo, o usuário *`rpl_user`* com a senha *`password`* é mostrado. Ao configurar seus servidores, use um nome de usuário e senha adequados:

```
   mysql> CREATE USER rpl_user@'%' IDENTIFIED BY 'password';
   mysql> GRANT REPLICATION SLAVE ON *.* TO rpl_user@'%';
   mysql> GRANT CONNECTION_ADMIN ON *.* TO rpl_user@'%';
   mysql> GRANT BACKUP_ADMIN ON *.* TO rpl_user@'%';
   mysql> GRANT GROUP_REPLICATION_STREAM ON *.* TO rpl_user@'%';
   mysql> FLUSH PRIVILEGES;
   ```

4. Se você desativou o registro binário, ative-o novamente assim que criar o usuário, emitindo a seguinte declaração:

   ```
   mysql> SET SQL_LOG_BIN=1;
   ```

5. Quando criar o usuário de replicação, você deve fornecer as credenciais do usuário ao servidor para uso com a recuperação distribuída. Isso pode ser feito configurando as credenciais do usuário como as credenciais para o canal `group_replication_recovery`, usando uma declaração `CHANGE REPLICATION SOURCE TO`. Alternativamente, você pode especificar as credenciais do usuário para a recuperação distribuída em uma declaração `START GROUP_REPLICATION`.

* As credenciais do usuário definidas usando `CHANGE REPLICATION SOURCE TO` são armazenadas em texto plano nos repositórios de metadados de replicação no servidor. Elas são aplicadas sempre que a Replicação em Grupo é iniciada, incluindo iniciações automáticas se a variável de sistema `group_replication_start_on_boot` for definida como `ON`.

* As credenciais do usuário especificadas em `START GROUP_REPLICATION` são salvas apenas na memória e são removidas por uma declaração `STOP GROUP_REPLICATION` ou o desligamento do servidor. Você deve emitir uma declaração `START GROUP_REPLICATION` para fornecer as credenciais novamente, portanto, não é possível iniciar a Replicação de Grupo automaticamente com essas credenciais. Esse método de especificação das credenciais do usuário ajuda a proteger os servidores de Replicação de Grupo contra acesso não autorizado.

Para obter mais informações sobre as implicações de segurança de cada método de fornecimento das credenciais do usuário, consulte a Seção 20.6.3.1.3, “Fornecer credenciais de usuário de replicação de forma segura”. Se você optar por fornecer as credenciais do usuário usando uma declaração `CHANGE REPLICATION SOURCE TO`, emita a seguinte declaração na instância do servidor agora, substituindo *`rpl_user`* e *`password`* pelos valores usados ao criar o usuário:

```
   mysql> CHANGE REPLICATION SOURCE TO SOURCE_USER='rpl_user',
       ->   SOURCE_PASSWORD='password'
       ->   FOR CHANNEL 'group_replication_recovery';
   ```