#### 7.5.6.4 Componente de Eleição Primária de Replicação em Grupo

O componente de Eleição Primária de Replicação em Grupo está disponível como parte da Edição Empresarial do MySQL.

* Propósito: Em caso de falha de over-provisionamento, quando estiver no modo de única eleição primária, use o status de membro mais atualizado do grupo de replicação como critério para a seleção da nova primária.

* URN: `file://component_group_replication_elect_prefers_most_updated`

Antes de instalar o componente de Eleição Primária de Replicação em Grupo, o plugin de Replicação em Grupo deve ser instalado usando `INSTALL PLUGIN` ou `--plugin-load-add` (consulte a Seção 20.2.1.2, “Configurando uma Instância para Replicação em Grupo”); caso contrário, a declaração `INSTALL COMPONENT` é rejeitada com um erro. Se você tentar desinstalar o plugin de Replicação em Grupo quando o componente de Eleição Primária de Replicação em Grupo estiver instalado, `UNINSTALL PLUGIN` falha com o erro Plugin 'group_replication' não pode ser desinstalado agora. Por favor, desinstale o componente 'component_group_replication_elect_prefers_most_updated' e depois desinstale o plugin group_replication.

Uma vez que essas condições sejam atendidas, o componente de Eleição Primária de Replicação em Grupo pode ser instalado e desinstalado usando `INSTALL COMPONENT` e `UNINSTALL COMPONENT`, respectivamente. Consulte as descrições dessas declarações, bem como a Seção 7.5.1, “Instalando e Desinstalando Componentes”, para obter mais informações.

Para habilitar o componente, defina a variável de sistema `group_replication_elect_prefers_most_updated.enabled` para `ON`, em cada membro do grupo de replicação. Isso significa que, em caso de falha de over-provisionamento, o componente escolhe como nova primária a secundária que está mais atualizada, com base em quantos transações estão no backlog da secundária; a secundária com o menor backlog (menos transações atrasadas) é escolhida como nova primária.

Para que a seleção mais atualizada funcione, o componente de Eleição Primária de Replicação em Grupo deve estar instalado em todos os membros do grupo; `group_replication_elect_prefers_most_updated.enabled` deve estar em `ON` para cada membro do grupo. Se o componente não estiver disponível ou se não houver um secundário mais atualizado, a seleção ponderada é usada; no caso de pesos iguais, o servidor com o UUID mais baixo (em ordem lexicográfica) é promovido a primário.

**Variáveis de status.** O componente de Eleição Primária de Replicação em Grupo fornece duas variáveis de status, listadas aqui, para uso no monitoramento:

* `Gr_latest_primary_election_by_most_uptodate_members_trx_delta`: Quando uma nova primária é escolhida usando a seleção mais atualizada, esta é a diferença nas transações processadas pela nova primária e pela secundária mais atualizada.

* `Gr_latest_primary_election_by_most_uptodate_member_timestamp`: Este timestamp é definido sempre que uma nova primária é eleita usando o método mais atual.

Os valores dessas variáveis de status são reinicializados no caso de instalação ou desinstalação do componente, no bootstrap do grupo, sempre que um membro se junta ao grupo (incluindo reassociação automática) e ao reinício do servidor.

**Registros.** Quando a seleção primária em falha usa o método mais atual, o componente escreve uma mensagem no log semelhante à mostrada aqui, anunciando a mudança, identificando a nova primária e fornecendo o número de transações que precisam ser aplicadas do backlog:

```
ER_GRP_PRIMARY_ELECTION_METHOD_MOST_UPDATE
2024-10-08T16:07:48.100736Z 0 [Note] [MY-015562] [Server] Plugin
group_replication reported: 'Group Replication Primary Election:
Member with uuid 8a94f357-aab4-11df-86ab-c80aa9420000  was elected
primary since it was the most up-to-date member with 100 transactions
more than second most up-to-date member
8a94f468-aab4-11df-86ab-c80aa9420000. In case of a tie member weight and
then uuid lexical order was used over the most updated members.'
```

Quando a seleção primária usa a ordem de peso do membro, o componente escreve uma mensagem de log anunciando a mudança, identificando a nova primária pelo UUID e seu valor de peso. A mensagem é semelhante à mostrada aqui:

```
ER_GRP_PRIMARY_ELECTION_METHOD_MEMBER_WEIGHT
2024-10-08T16:07:48.100736Z 0 [Note] [MY-015563] [Server] Plugin
group_replication reported: 'Group Replication Primary Election:
Member with uuid 8a94f357-aab4-11df-86ab-c80aa9420000 was elected
primary since it was highest weight member with value 70. In case
of a tie uuid lexical order was used.'
```