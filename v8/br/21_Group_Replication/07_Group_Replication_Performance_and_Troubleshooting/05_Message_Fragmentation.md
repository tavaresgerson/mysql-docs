### 20.7.5 Fragmentação de Mensagens

Quando uma mensagem anormalmente grande é enviada entre os membros do grupo de replicação em grupo, pode resultar em alguns membros do grupo serem relatados como falhos e expulsos do grupo. Isso ocorre porque o único fio usado pelo motor de comunicação de grupo da replicação em grupo (XCom, uma variante do Paxos) é ocupado processando a mensagem por muito tempo, então alguns dos membros do grupo podem relatar o receptor como falho. A partir do MySQL 8.0.16, por padrão, mensagens grandes são automaticamente divididas em fragmentos que são enviados separadamente e reensamblados pelos destinatários.

A variável de sistema `group_replication_communication_max_message_size` especifica um tamanho máximo de mensagem para comunicações de Replicação em Grupo, acima do qual as mensagens são fragmentadas. O tamanho máximo padrão de mensagem é de 10485760 bytes (10 MiB). O maior valor permitido é o mesmo que o valor máximo das variáveis de sistema `replica_max_allowed_packet` e `slave_max_allowed_packet`, que é de 1073741824 bytes (1 GB). O ajuste para `group_replication_communication_max_message_size` deve ser menor que `replica_max_allowed_packet` (ou `slave_max_allowed_packet`), porque o fio aplicável não pode lidar com fragmentos de mensagem maiores que o tamanho máximo de pacote permitido. Para desativar a fragmentação, especifique um valor zero para `group_replication_communication_max_message_size`.

Assim como a maioria das outras variáveis do sistema de replicação em grupo, você deve reiniciar o plugin de replicação em grupo para que a alteração entre em vigor. Por exemplo:

```
STOP GROUP_REPLICATION;
SET GLOBAL group_replication_communication_max_message_size= 5242880;
START GROUP_REPLICATION;
```

A entrega de uma mensagem fragmentada é considerada completa quando todos os fragmentos da mensagem foram recebidos e reassemblados por todos os membros do grupo. As mensagens fragmentadas incluem informações nos seus cabeçalhos que permitem que um membro que se junta durante a transmissão da mensagem recupere os fragmentos anteriores que foram enviados antes de se juntar. Se o membro que se junta não conseguir recuperar os fragmentos, ele é expulso do grupo.

Para que um grupo de replicação possa usar a fragmentação, todos os membros do grupo devem estar no MySQL 8.0.16 ou superior, e a versão do protocolo de comunicação de Replicação de Grupo em uso pelo grupo deve permitir a fragmentação. Você pode inspecionar o protocolo de comunicação em uso por um grupo usando a função `group_replication_get_communication_protocol()`, que retorna a versão mais antiga do MySQL Server que o grupo suporta. As versões do MySQL 5.7.14 permitem a compressão de mensagens, e as versões do MySQL 8.0.16 também permitem a fragmentação de mensagens. Se todos os membros do grupo estiverem no MySQL 8.0.16 ou superior e não houver necessidade de permitir que membros de versões anteriores se juntem, você pode usar a função `group_replication_set_communication_protocol()` para definir a versão do protocolo de comunicação para o MySQL 8.0.16 ou superior para permitir a fragmentação. Para mais informações, consulte a Seção 20.5.1.4, “Definindo a Versão do Protocolo de Comunicação de um Grupo”.

Se um grupo de replicação não puder usar fragmentação porque alguns membros não a suportam, a variável de sistema `group_replication_transaction_size_limit` pode ser usada para limitar o tamanho máximo das transações que o grupo aceita. No MySQL 8.0, o ajuste padrão é de aproximadamente 143 MB. Transações acima desse tamanho são revertidas. Você também pode usar a variável de sistema `group_replication_member_expel_timeout` para permitir um tempo adicional (até uma hora) antes que um membro suspeito de ter falhado seja expulso do grupo.
