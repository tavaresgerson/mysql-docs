### 20.7.5 Fragmentação de Mensagens

Quando uma mensagem anormalmente grande é enviada entre os membros do grupo de replicação em grupo, pode resultar em alguns membros do grupo serem relatados como falhos e expulsos do grupo. Isso ocorre porque o único fio utilizado pelo motor de comunicação de grupo da replicação em grupo (XCom, uma variante do Paxos) é ocupado processando a mensagem por muito tempo, então alguns dos membros do grupo podem relatar o receptor como falho. Por padrão, mensagens grandes são automaticamente divididas em fragmentos que são enviados separadamente e reassemblados pelos destinatários.

A variável de sistema `group_replication_communication_max_message_size` especifica um tamanho máximo de mensagem para as comunicações de replicação em grupo, acima do qual as mensagens são fragmentadas. O tamanho máximo de mensagem padrão é de 10485760 bytes (10 MiB). O maior valor permitido é o mesmo que o valor máximo da variável de sistema `replica_max_allowed_packet` (1 GB). `group_replication_communication_max_message_size` deve ser menor que `replica_max_allowed_packet` porque o fio aplicável não pode lidar com fragmentos de mensagem maiores que o tamanho máximo de pacote permitido. Para desativar a fragmentação, especifique um valor zero para `group_replication_communication_max_message_size`.

Como com a maioria das outras variáveis de sistema da replicação em grupo, você deve reiniciar o plugin de replicação em grupo para que a mudança tenha efeito. Por exemplo:

```
STOP GROUP_REPLICATION;
SET GLOBAL group_replication_communication_max_message_size= 5242880;
START GROUP_REPLICATION;
```

A entrega de mensagens para uma mensagem fragmentada é considerada completa quando todos os fragmentos da mensagem foram recebidos e reassemblados por todos os membros do grupo. As mensagens fragmentadas incluem informações nos cabeçalhos que permitem que um membro que se junta durante a transmissão da mensagem recupere os fragmentos anteriores que foram enviados antes de ele se juntar. Se o membro que se junta não conseguir recuperar os fragmentos, ele é expulso do grupo.

O protocolo de comunicação de Replicação de Grupo em uso pelo grupo deve permitir a fragmentação. Você pode obter o protocolo de comunicação em uso por um grupo usando `group_replication_get_communication_protocol()`, que retorna a versão mais antiga do MySQL Server que o grupo suporta. Se necessário, use `group_replication_set_communication_protocol()` para definir a versão do protocolo de comunicação alta o suficiente (8.0.16 ou superior) para permitir a fragmentação. Para mais informações, consulte a Seção 20.5.1.4, “Definindo a Versão do Protocolo de Comunicação de um Grupo”.

Se um grupo de replicação não puder usar a fragmentação porque alguns membros não a suportam, a variável de sistema `group_replication_transaction_size_limit` pode ser usada para limitar o tamanho máximo das transações que o grupo aceita. Transações acima desse tamanho são revertidas. Você também pode usar `group_replication_member_expel_timeout` para permitir um tempo adicional (até uma hora) antes que um membro sob suspeita de ter falhado seja expulso do grupo.