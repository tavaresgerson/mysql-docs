#### 17.2.1.3 Credenciais do Usuário

A replicação em grupo usa o protocolo de replicação assíncrona para alcançar a recuperação distribuída seção 17.9.5, “Recuperação Distribuída”, sincronizando os membros do grupo antes de os juntar ao grupo. O processo de recuperação distribuída depende de um canal de replicação chamado `group_replication_recovery`, que é usado para transferir transações dos membros doadores para os membros que se juntam ao grupo. Portanto, você precisa configurar um usuário de replicação com as permissões corretas para que a replicação em grupo possa estabelecer canais de replicação de recuperação de membro para membro.

Inicie a instância do servidor MySQL e, em seguida, conecte um cliente a ela. Crie um usuário MySQL com o privilégio `REPLICATION SLAVE`. Esse processo pode ser capturado no log binário e, em seguida, você pode confiar na recuperação distribuída para replicar as instruções usadas para criar o usuário. Alternativamente, você pode desabilitar o registro binário usando `SET SQL_LOG_BIN=0;` e, em seguida, criar o usuário manualmente em cada membro, por exemplo, se você quiser evitar que as alterações sejam propagadas para outras instâncias do servidor. Se você decidir desabilitar o registro binário, certifique-se de reativá-lo uma vez que tenha configurado o usuário.

No exemplo a seguir, o usuário *`rpl_user`* com a senha *`password`* é mostrado. Ao configurar seus servidores, use um nome de usuário e senha adequados.

```sql
mysql> CREATE USER rpl_user@'%' IDENTIFIED BY 'password';
mysql> GRANT REPLICATION SLAVE ON *.* TO rpl_user@'%';
mysql> FLUSH PRIVILEGES;
```

Se o registro binário estiver desativado, ative-o novamente assim que o usuário for criado usando `SET SQL_LOG_BIN=1;`.

Depois que o usuário for configurado, use a instrução `CHANGE MASTER TO` para configurar o servidor para usar as credenciais fornecidas para o canal de replicação `group_replication_recovery` na próxima vez que ele precisar recuperar seu estado de outro membro. Emite o seguinte, substituindo *`rpl_user`* e *`password`* pelos valores usados ao criar o usuário.

```sql
mysql> CHANGE MASTER TO MASTER_USER='rpl_user', MASTER_PASSWORD='password' \\
		      FOR CHANNEL 'group_replication_recovery';
```

A recuperação distribuída é o primeiro passo dado por um servidor que se junta ao grupo e não possui o mesmo conjunto de transações que os membros do grupo. Se essas credenciais não forem configuradas corretamente para o canal de replicação `group_replication_recovery` e o `rpl_user`, conforme mostrado, o servidor não poderá se conectar aos membros do doador e executar o processo de recuperação distribuída para obter sincronia com os outros membros do grupo, e, portanto, não poderá se juntar ao grupo. Veja Seção 17.9.5, “Recuperação Distribuída”.

Da mesma forma, se o servidor não conseguir identificar corretamente os outros membros através do `hostname` do servidor, o processo de recuperação pode falhar. Recomenda-se que os sistemas operacionais que executam o MySQL tenham um `hostname` único configurado corretamente, seja usando DNS ou configurações locais. Esse `hostname` pode ser verificado na coluna `Member_host` da tabela `performance_schema.replication_group_members`. Se vários membros do grupo externalizarem um `hostname` padrão definido pelo sistema operacional, há a possibilidade de o membro não resolver para o endereço correto e não conseguir se juntar ao grupo. Nessa situação, use `report_host` para configurar um `hostname` único que seja externalizado por cada um dos servidores.
