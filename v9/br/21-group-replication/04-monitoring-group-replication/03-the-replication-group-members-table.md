### 20.4.3 A tabela `replication_group_members`

A tabela `performance_schema.replication_group_members` é usada para monitorar o status das diferentes instâncias do servidor que são membros do grupo. As informações na tabela são atualizadas sempre que há uma mudança na visualização, por exemplo, quando a configuração do grupo é alterada dinamicamente quando um novo membro se junta. Nesse ponto, os servidores trocam parte de seus metadados para se sincronizar e continuar a cooperar. As informações são compartilhadas entre todas as instâncias do servidor que são membros do grupo de replicação, então as informações sobre todos os membros do grupo podem ser consultadas a partir de qualquer membro. Esta tabela pode ser usada para obter uma visão de alto nível do estado de um grupo de replicação, por exemplo, emitindo:

```
SELECT * FROM performance_schema.replication_group_members;
+---------------------------+--------------------------------------+-------------+-------------+--------------+-------------+----------------+----------------------------+
| CHANNEL_NAME              | MEMBER_ID                            | MEMBER_HOST | MEMBER_PORT | MEMBER_STATE | MEMBER_ROLE | MEMBER_VERSION | MEMBER_COMMUNICATION_STACK |
+---------------------------+--------------------------------------+-------------+-------------+--------------+-------------+----------------+----------------------------+
| group_replication_applier | d391e9ee-2691-11ec-bf61-00059a3c7a00 | example1    |        4410 | ONLINE       | PRIMARY     | 9.5.0         | XCom                       |
| group_replication_applier | e059ce5c-2691-11ec-8632-00059a3c7a00 | example2    |        4420 | ONLINE       | SECONDARY   | 9.5.0         | XCom                       |
| group_replication_applier | ecd9ad06-2691-11ec-91c7-00059a3c7a00 | example3    |        4430 | ONLINE       | SECONDARY   | 9.5.0         | XCom                       |
+---------------------------+--------------------------------------+-------------+-------------+--------------+-------------+----------------+----------------------------+
3 rows in set (0.0007 sec)
```

Com base neste resultado, podemos ver que o grupo consiste em três membros. A tabela mostra o `server_uuid` de cada membro, bem como o nome do host e o número de porta do membro, que os clientes usam para se conectar a ele. A coluna `MEMBER_STATE` mostra uma das Seções 20.4.2, “Estados dos Servidores de Replicação do Grupo”, neste caso, mostra que todos os três membros deste grupo estão `ONLINE`, e a coluna `MEMBER_ROLE` mostra que há dois secundários e um primário. Portanto, este grupo deve estar rodando no modo single-primary. A coluna `MEMBER_VERSION` pode ser útil quando você está atualizando um grupo e está combinando membros que estão executando diferentes versões do MySQL. A coluna `MEMBER_COMMUNICATION_STACK` mostra a pilha de comunicação usada para o grupo.

Para mais informações sobre o valor `MEMBER_HOST` e seu impacto no processo de recuperação distribuída, consulte a Seção 20.2.1.3, “Credenciais de Usuário para Recuperação Distribuída”.