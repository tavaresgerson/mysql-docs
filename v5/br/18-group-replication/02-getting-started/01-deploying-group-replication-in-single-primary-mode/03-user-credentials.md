#### 17.2.1.3 Credenciais do Usuário

O Group Replication usa o protocolo de Replication assíncrona para realizar a [Section 17.9.5, “Distributed Recovery”](group-replication-distributed-recovery.html "17.9.5 Distributed Recovery"), sincronizando os membros do grupo antes de uni-los ao grupo. O processo de distributed recovery depende de um replication channel chamado `group_replication_recovery`, que é usado para transferir transactions de membros doadores para os membros que se juntam ao grupo. Portanto, você precisa configurar um usuário de Replication com as permissões corretas para que o Group Replication possa estabelecer replication channels de recovery diretos de membro para membro.

Inicie a instância do MySQL Server e, em seguida, conecte um cliente a ela. Crie um usuário MySQL com o privilege [`REPLICATION SLAVE`](privileges-provided.html#priv_replication-slave). Este processo pode ser capturado no binary log, e você pode então confiar no distributed recovery para replicar as instruções usadas para criar o usuário. Alternativamente, você pode desabilitar o binary logging usando `SET SQL_LOG_BIN=0;` e, em seguida, criar o usuário manualmente em cada membro, por exemplo, se você quiser evitar que as alterações sejam propagadas para outras instâncias de Server. Se você decidir desabilitar o binary logging, certifique-se de reabilitá-lo assim que configurar o usuário.

No exemplo a seguir, o usuário *`rpl_user`* com a senha *`password`* é mostrado. Ao configurar seus Servers, use um nome de usuário e uma senha adequados.

```sql
mysql> CREATE USER rpl_user@'%' IDENTIFIED BY 'password';
mysql> GRANT REPLICATION SLAVE ON *.* TO rpl_user@'%';
mysql> FLUSH PRIVILEGES;
```

Se o binary logging foi desabilitado, reabilite-o assim que o usuário for criado usando `SET SQL_LOG_BIN=1;`.

Uma vez que o usuário tenha sido configurado, use a instrução [`CHANGE MASTER TO`](change-master-to.html "13.4.2.1 CHANGE MASTER TO Statement") para configurar o Server a usar as credenciais fornecidas para o `group_replication_recovery` replication channel na próxima vez que precisar recuperar seu estado a partir de outro membro. Execute o seguinte, substituindo *`rpl_user`* e *`password`* pelos valores usados ao criar o usuário.

```sql
mysql> CHANGE MASTER TO MASTER_USER='rpl_user', MASTER_PASSWORD='password' \\
		      FOR CHANNEL 'group_replication_recovery';
```

O distributed recovery é o primeiro passo dado por um Server que se junta ao grupo e não possui o mesmo conjunto de transactions que os membros do grupo. Se essas credenciais não forem definidas corretamente para o `group_replication_recovery` replication channel e para o `rpl_user` conforme mostrado, o Server não conseguirá se conectar aos membros doadores e executar o processo de distributed recovery para obter sincronia com os outros membros do grupo e, portanto, em última instância, não conseguirá ingressar no grupo. Consulte [Section 17.9.5, “Distributed Recovery”](group-replication-distributed-recovery.html "17.9.5 Distributed Recovery").

Da mesma forma, se o Server não conseguir identificar corretamente os outros membros através do `hostname` do Server, o processo de recovery pode falhar. É recomendado que os sistemas operacionais executando o MySQL tenham um `hostname` exclusivo e devidamente configurado, seja usando DNS ou configurações locais. Este `hostname` pode ser verificado na coluna `Member_host` da tabela [`performance_schema.replication_group_members`](performance-schema-replication-group-members-table.html "25.12.11.8 The replication_group_members Table"). Se vários membros do grupo exteriorizarem um `hostname` padrão definido pelo sistema operacional, existe a chance de o membro não ser resolvido para o endereço correto e não conseguir se juntar ao grupo. Numa situação como essa, use [`report_host`](replication-options-replica.html#sysvar_report_host) para configurar um `hostname` exclusivo a ser exteriorizado por cada um dos Servers.