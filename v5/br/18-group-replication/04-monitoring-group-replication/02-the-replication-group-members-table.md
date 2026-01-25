### 17.4.2 A Tabela replication_group_members

A tabela [`performance_schema.replication_group_members`](performance-schema-replication-group-members-table.html "25.12.11.8 The replication_group_members Table") é usada para monitorar o status das diferentes instâncias de servidor que são membros do grupo. As informações na tabela são atualizadas sempre que há uma alteração de view (view change), por exemplo, quando a configuração do grupo é alterada dinamicamente ou quando um novo membro se junta. Nesse momento, os servidores trocam parte de seus metadados para se sincronizarem e continuarem a cooperar. As informações são compartilhadas entre todas as instâncias de servidor que são membros do grupo de Replication, de modo que informações sobre todos os membros do grupo podem ser consultadas (queried) a partir de qualquer membro. Esta tabela pode ser usada para obter uma visão de alto nível do estado de um grupo de Replication, por exemplo, executando:

```sql
SELECT * FROM performance_schema.replication_group_members;
+---------------------------+--------------------------------------+--------------+-------------+--------------+
| CHANNEL_NAME              | MEMBER_ID	                           | MEMBER_HOST  | MEMBER_PORT | MEMBER_STATE |
+---------------------------+--------------------------------------+--------------+-------------+--------------+
| group_replication_applier | 041f26d8-f3f3-11e8-adff-080027337932 | example1     |      3306   | ONLINE       |
| group_replication_applier | f60a3e10-f3f2-11e8-8258-080027337932 | example2     |      3306   | ONLINE       |
| group_replication_applier | fc890014-f3f2-11e8-a9fd-080027337932 | example3     |      3306   | ONLINE       |
+---------------------------+--------------------------------------+--------------+-------------+--------------+
```

Com base neste resultado, podemos ver que o grupo é composto por três membros, o host e o número da porta de cada membro que os clientes usam para se conectar ao membro, e o [`server_uuid`](replication-options.html#sysvar_server_uuid) do membro. A coluna `MEMBER_STATE` mostra um dos [Seção 17.4.1, “Estados do Servidor Group Replication”](group-replication-server-states.html "17.4.1 Group Replication Server States"), neste caso, mostra que todos os três membros neste grupo estão `ONLINE`, e a coluna `MEMBER_ROLE` mostra que há dois secondaries e um único primary. Portanto, este grupo deve estar rodando no modo single-primary. A coluna `MEMBER_VERSION` pode ser útil ao fazer um upgrade de um grupo e estiver combinando membros que executam diferentes versões do MySQL. Consulte [Seção 17.4.1, “Estados do Servidor Group Replication”](group-replication-server-states.html "17.4.1 Group Replication Server States") para mais informações.

Para mais informações sobre o valor `Member_host` e seu impacto no processo de recuperação distribuída, consulte [Seção 17.2.1.3, “Credenciais do Usuário”](group-replication-user-credentials.html "17.2.1.3 User Credentials").