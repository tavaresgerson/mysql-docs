### 19.4.9 Falha no Desvio de Conexão Assíncrona de Fontes e Replicas

19.4.9.1 Falha no Desvio de Conexão Assíncrona para Fontes

19.4.9.2 Falha no Desvio de Conexão Assíncrona para Replicas

Você pode usar o mecanismo de falha no desvio de conexão assíncrona para estabelecer uma conexão de replicação (da fonte para a replica) assíncrona para uma nova fonte automaticamente, após a falha da conexão existente de uma replica para sua fonte. O mecanismo de falha no desvio de conexão assíncrona pode ser usado para manter uma replica sincronizada com múltiplos servidores MySQL ou grupos de servidores que compartilham dados. A lista de servidores potenciais de fonte é armazenada na replica, e, em caso de falha de conexão, um novo servidor é selecionado da lista com base em uma prioridade ponderada que você define.

O mecanismo de falha no desvio de conexão assíncrona também suporta topologias de Replicação em Grupo, monitorando automaticamente as alterações na composição do grupo e distinguindo entre servidores primários e secundários. Quando você adiciona um membro do grupo à lista de fontes e o define como parte de um grupo gerenciado, o mecanismo de falha no desvio de conexão assíncrona atualiza a lista de fontes para mantê-la alinhada com as alterações na composição, adicionando e removendo membros do grupo automaticamente à medida que se juntam ou saem. Apenas os membros do grupo online que estão na maioria são usados para conexões e obtenção de status. O último membro remanescente de um grupo gerenciado não é removido automaticamente, mesmo que ele deixe o grupo, para que a configuração do grupo gerenciado seja mantida. No entanto, você pode excluir um grupo gerenciado manualmente se ele não for mais necessário.

O mecanismo de falha de reposição de conexão assíncrona também permite que uma réplica que faz parte de um grupo de replicação gerenciado se reconecte automaticamente ao remetente se o receptor atual (o primário do grupo) falhar. Esse recurso funciona com a Replicação por Grupo, em um grupo configurado no modo de primário único, onde o primário do grupo é uma réplica que tem um canal de replicação usando o mecanismo. O recurso é projetado para um grupo de remetentes e um grupo de receptores para permanecerem sincronizados entre si, mesmo quando alguns membros estão temporariamente indisponíveis. Ele também sincroniza um grupo de receptores com um ou mais remetentes que não fazem parte de um grupo gerenciado. Uma réplica que não faz parte de um grupo de replicação não pode usar esse recurso.

Os requisitos para usar o mecanismo de falha de reposição de conexão assíncrona são os seguintes:

* Os GTIDs devem estar em uso no remetente e na réplica (`gtid_mode=ON`), e a opção `SOURCE_AUTO_POSITION` da declaração `CHANGE REPLICATION SOURCE TO` deve estar habilitada na réplica, para que o autoposicionamento do GTID seja usado para a conexão com o remetente.

* A mesma conta de usuário de replicação e senha devem existir em todos os servidores de origem na lista de canais. Essa conta é usada para a conexão com cada um dos remetentes. Você pode configurar contas diferentes para diferentes canais.

* A conta de usuário de replicação deve ter permissões `SELECT` nas tabelas do Schema de Desempenho, por exemplo, emitindo `GRANT SELECT ON performance_schema.* TO 'repl_user';`

* A conta de usuário e a senha de replicação não podem ser especificadas na declaração usada para iniciar a replicação, porque elas precisam estar disponíveis no reinício automático para a conexão com a fonte alternativa. Elas devem ser definidas para o canal usando a declaração `CHANGE REPLICATION SOURCE TO` no replica, e registradas nos repositórios de metadados de replicação.

* Se o canal onde o mecanismo de falha de conexão assíncrona está em uso estiver no primário de um grupo de modo single-primary de replicação em grupo, a falha de conexão assíncrona entre as réplicas também está ativa por padrão. Nessa situação, o canal de replicação e a conta de usuário de replicação e a senha do canal devem ser configurados em todos os servidores secundários do grupo de replicação e em quaisquer novos membros que se juntem. Se os novos servidores forem provisionados usando a funcionalidade de clone do MySQL, tudo isso acontece automaticamente.

  Importante

* Se você não quiser que a falha de conexão assíncrona ocorra entre as réplicas nessa situação, desative-a desabilitando a ação de membro `mysql_start_failover_channels_if_primary` para o grupo, usando a função `group_replication_disable_member_action`. Quando o recurso é desativado, você não precisa configurar o canal de replicação nos membros do grupo secundário, mas se o primário sair offline ou entrar em um estado de erro, a replicação para o canal pára.

O MySQL InnoDB ClusterSet está disponível para fornecer tolerância a desastres para implantações do InnoDB Cluster, conectando um cluster principal do InnoDB com uma ou mais réplicas dele em locais alternativos, como diferentes centros de dados. Considere usar essa solução em vez disso para simplificar a configuração de uma nova implantação multigrupo para replicação, failover e recuperação de desastres. Você pode adotar uma implantação de Replicação de Grupo existente como um cluster do InnoDB.

O InnoDB ClusterSet e o InnoDB Cluster são projetados para abstrair e simplificar os procedimentos para configurar, gerenciar, monitorar, recuperar e reparar grupos de replicação. O InnoDB ClusterSet gerencia automaticamente a replicação de um cluster principal para clusters de réplica usando um canal de replicação ClusterSet dedicado. Você pode usar comandos de administrador para acionar uma transição controlada ou failover de emergência entre os grupos, se o cluster principal não estiver funcionando normalmente. Servidores e grupos podem ser facilmente adicionados ou removidos da implantação do InnoDB ClusterSet após a configuração inicial, quando a demanda mudar. Para mais informações, consulte MySQL InnoDB ClusterSet.