### 17.4.3 A tabela replication_group_member_stats

Cada membro de um grupo de replicação certifica e aplica as transações recebidas pelo grupo. As estatísticas sobre os procedimentos de certificação e aplicação são úteis para entender como a fila de aplicação está crescendo, quantos conflitos foram encontrados, quantas transações foram verificadas, quais transações foram confirmadas em todos os lugares, e assim por diante.

A tabela `performance_schema.replication_group_member_stats` fornece informações em nível de grupo relacionadas ao processo de certificação, além de estatísticas para as transações recebidas e geradas por cada membro individual do grupo de replicação. As informações são compartilhadas entre todas as instâncias do servidor que são membros do grupo de replicação, portanto, as informações sobre todos os membros do grupo podem ser consultadas a partir de qualquer membro. Observe que a atualização das estatísticas para membros remotos é controlada pelo período de mensagem especificado na opção `group_replication_flow_control_period`, portanto, essas podem diferir ligeiramente das estatísticas coletadas localmente para o membro onde a consulta é feita. Para usar esta tabela para monitorar um membro da Replicação de Grupo, execute a seguinte declaração:

```sql
mysql> SELECT * FROM performance_schema.replication_group_member_stats\G
```

Essas colunas são importantes para monitorar o desempenho dos membros conectados ao grupo. Suponha que um dos membros do grupo sempre reporte um grande número de transações na sua fila em comparação com outros membros. Isso significa que o membro está atrasado e não consegue se manter atualizado com os outros membros do grupo. Com base nessas informações, você pode decidir remover o membro do grupo ou adiar o processamento das transações nos outros membros do grupo para reduzir o número de transações na fila. Essas informações também podem ajudá-lo a decidir como ajustar o controle de fluxo do plugin de Replicação de Grupo, veja Seção 17.9.7.3, “Controle de Fluxo”.
