### 17.4.2 A tabela replication\_group\_members

A tabela `performance_schema.replication_group_members` é usada para monitorar o status das diferentes instâncias do servidor que são membros do grupo. As informações na tabela são atualizadas sempre que houver uma mudança na visualização, por exemplo, quando a configuração do grupo é alterada dinamicamente quando um novo membro se junta. Nesse ponto, os servidores trocam parte de seus metadados para se sincronizar e continuar a cooperar juntos. As informações são compartilhadas entre todas as instâncias do servidor que são membros do grupo de replicação, portanto, as informações sobre todos os membros do grupo podem ser consultadas a partir de qualquer membro. Esta tabela pode ser usada para obter uma visão de alto nível do estado de um grupo de replicação, por exemplo, emitindo:

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

Com base nesse resultado, podemos ver que o grupo consiste em três membros, o número de host e de porta de cada membro que os clientes usam para se conectar ao membro, e o `server_uuid` do membro. A coluna `MEMBER_STATE` mostra um dos Seção 17.4.1, “Estados dos Servidores de Replicação de Grupos”, neste caso, mostra que todos os três membros deste grupo estão `ONLINE`, e a coluna `MEMBER_ROLE` mostra que há dois segundos e um primário. Portanto, este grupo deve estar rodando no modo single-primary. A coluna `MEMBER_VERSION` pode ser útil quando você está atualizando um grupo e está combinando membros que estão executando diferentes versões do MySQL. Consulte Seção 17.4.1, “Estados dos Servidores de Replicação de Grupos” para obter mais informações.

Para obter mais informações sobre o valor `Member_host` e seu impacto no processo de recuperação distribuída, consulte Seção 17.2.1.3, “Credenciais do usuário”.
