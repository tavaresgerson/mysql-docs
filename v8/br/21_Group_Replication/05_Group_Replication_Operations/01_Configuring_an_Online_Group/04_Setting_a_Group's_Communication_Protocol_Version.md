#### 20.5.1.4 Definindo a Versão do Protocolo de Comunicação de um Grupo

A partir do MySQL 8.0.16, a Replicação por Grupo tem o conceito de um protocolo de comunicação para o grupo. A versão do protocolo de comunicação da Replicação por Grupo pode ser gerenciada explicitamente e definida para acomodar a versão mais antiga do servidor MySQL que o grupo deseja suportar. Isso permite que grupos sejam formados a partir de membros em diferentes versões do servidor MySQL, garantindo a compatibilidade reversa.

- As versões do MySQL 5.7.14 permitem a compressão de mensagens (consulte a Seção 20.7.4, “Compressão de Mensagens”).

- As versões do MySQL 8.0.16 também permitem a fragmentação de mensagens (consulte a Seção 20.7.5, “Fragmentação de Mensagens”).

- As versões do MySQL 8.0.27 também permitem que o mecanismo de comunicação de grupo opere com um único líder de consenso quando o grupo estiver no modo de único primário e o `group_replication_paxos_single_leader` estiver definido como verdadeiro (consulte a Seção 20.7.3, “Líder de Consenso Único”).

Todos os membros do grupo devem usar a mesma versão do protocolo de comunicação, para que os membros do grupo possam estar em diferentes versões do servidor MySQL, mas apenas enviar mensagens que possam ser compreendidas por todos os membros do grupo.

Um servidor MySQL na versão X só pode se juntar e alcançar o status `ONLINE` em um grupo de replicação se a versão do protocolo de comunicação do grupo for menor ou igual a X. Quando um novo membro se junta a um grupo de replicação, ele verifica a versão do protocolo de comunicação anunciada pelos membros existentes do grupo. Se o membro que está se juntando suportar essa versão, ele se junta ao grupo e usa o protocolo de comunicação que o grupo anunciou, mesmo que o membro suporte capacidades de comunicação adicionais. Se o membro que está se juntando não suportar a versão do protocolo de comunicação, ele é expulso do grupo.

Se dois membros tentarem participar do mesmo evento de alteração de associação, eles só poderão participar se a versão do protocolo de comunicação para ambos os membros já for compatível com a versão do protocolo de comunicação do grupo. Os membros com versões diferentes do protocolo de comunicação do grupo devem se juntar isoladamente. Por exemplo:

- Uma instância do MySQL Server 8.0.16 pode se juntar com sucesso a um grupo que usa a versão 5.7.24 do protocolo de comunicação.

- Uma instância do MySQL Server 5.7.24 não consegue se juntar a um grupo que usa a versão 8.0.16 do protocolo de comunicação.

- Duas instâncias do MySQL Server 8.0.16 não podem se juntar simultaneamente a um grupo que usa a versão 5.7.24 do protocolo de comunicação.

- Duas instâncias do MySQL Server 8.0.16 podem se juntar simultaneamente a um grupo que usa a versão do protocolo de comunicação 8.0.16.

Você pode inspecionar o protocolo de comunicação utilizado por um grupo usando a função `group_replication_get_communication_protocol()`, que retorna a versão mais antiga do servidor MySQL que o grupo suporta. Todos os membros existentes do grupo retornam a mesma versão do protocolo de comunicação. Por exemplo:

```
SELECT group_replication_get_communication_protocol();
+------------------------------------------------+
| group_replication_get_communication_protocol() |
+------------------------------------------------+
| 8.0.16                                         |
+------------------------------------------------+
```

Observe que a função `group_replication_get_communication_protocol()` retorna a versão mínima do MySQL que o grupo suporta, o que pode diferir do número de versão passado para a função `group_replication_set_communication_protocol()` e da versão do servidor MySQL instalada no membro onde você usa a função.

Se você precisar alterar a versão do protocolo de comunicação de um grupo para que membros de versões anteriores possam se juntar, use a função `group_replication_set_communication_protocol()` para especificar a versão do servidor MySQL do membro mais antigo que você deseja permitir. Isso faz com que o grupo volte para uma versão compatível do protocolo de comunicação, se possível. O privilégio `GROUP_REPLICATION_ADMIN` é necessário para usar essa função, e todos os membros do grupo existentes devem estar online quando você emitir a declaração, sem perda da maioria. Por exemplo:

```
SELECT group_replication_set_communication_protocol("5.7.25");
```

Se você atualizar todos os membros de um grupo de replicação para uma nova versão do MySQL Server, a versão do protocolo de comunicação do grupo não será atualizada automaticamente para corresponder. Se você não precisar mais suportar membros em versões anteriores, você pode usar a função `group_replication_set_communication_protocol()` para definir a versão do protocolo de comunicação para a nova versão do MySQL Server para a qual você atualizou os membros. Por exemplo:

```
SELECT group_replication_set_communication_protocol("8.0.16");
```

A função `group_replication_set_communication_protocol()` é implementada como uma ação de grupo, portanto, é executada simultaneamente em todos os membros do grupo. A ação de grupo começa a bufferizar mensagens e aguarda a entrega de quaisquer mensagens de saída que já estivessem em andamento para serem concluídas, depois altera a versão do protocolo de comunicação e envia as mensagens bufferizadas. Se um membro tentar se juntar ao grupo a qualquer momento após você alterar a versão do protocolo de comunicação, os membros do grupo anunciam a nova versão do protocolo.

O clúster MySQL InnoDB gerencia automaticamente e de forma transparente as versões dos protocolos de comunicação de seus membros, sempre que a topologia do clúster é alterada usando operações da AdminAPI. Um clúster InnoDB sempre usa a versão mais recente do protocolo de comunicação que é suportada por todas as instâncias que fazem parte do clúster ou que estão se juntando a ele. Para obter detalhes, consulte Clúster InnoDB e Protocolo de Replicação por Grupo.
