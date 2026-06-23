# Capítulo 20 Replicação em grupo

Este capítulo explica o MySQL Group Replication e como instalar, configurar e monitorar grupos. O MySQL Group Replication permite que você crie topologias de replicação elásticas, altamente disponíveis e tolerantes a falhas.

Os grupos podem operar no modo único primário com eleição primária automática, onde apenas um servidor aceita atualizações de cada vez. Alternativamente, os grupos podem ser implantados no modo multi-primário, onde todos os servidores podem aceitar atualizações, mesmo que elas sejam emitidas simultaneamente.

Existe um serviço de associação de grupo integrado que mantém a visão do grupo consistente e disponível para todos os servidores em qualquer momento. Os servidores podem sair e ingressar no grupo e a visão é atualizada conforme necessário. Às vezes, os servidores podem sair do grupo inesperadamente, e, nesse caso, o mecanismo de detecção de falha detecta isso e notifica o grupo de que a visão foi alterada. Tudo isso é automático.

A Replicação em Grupo garante que o serviço de banco de dados esteja continuamente disponível. No entanto, é importante entender que, se um dos membros do grupo se tornar indisponível, os clientes conectados a esse membro do grupo devem ser redirecionados ou substituídos por outro servidor diferente no grupo, usando um conector, um balanceador de carga, um roteador ou alguma forma de middleware. A Replicação em Grupo não possui um método integrado para fazer isso. Por exemplo, veja o MySQL Router 8.0.

A Replicação em Grupo é fornecida como um plugin para o MySQL Server. Você pode seguir as instruções neste capítulo para configurar o plugin em cada uma das instâncias do servidor que você deseja no grupo, iniciar o grupo e monitorar e administrar o grupo. Uma maneira alternativa de implementar um grupo de instâncias do servidor MySQL é usando o InnoDB Cluster.

Dica

Para implantar múltiplas instâncias do MySQL, você pode usar o InnoDB Cluster, que permite administrar facilmente um grupo de instâncias do servidor MySQL no MySQL Shell. O InnoDB Cluster envolve a Replicação do Grupo MySQL em um ambiente programático que permite implantar facilmente um grupo de instâncias do MySQL para alcançar alta disponibilidade. Além disso, o InnoDB Cluster interage perfeitamente com o MySQL Router, que permite que suas aplicações se conectem ao clúster sem escrever seu próprio processo de falha. Para casos de uso semelhantes que não exigem alta disponibilidade, no entanto, você pode usar o InnoDB ReplicaSet. As instruções de instalação para o MySQL Shell podem ser encontradas aqui.

O capítulo é estruturado da seguinte forma:

* A Seção 20.1, “Contexto de Replicação de Grupo”, fornece uma introdução sobre grupos e como a Replicação de Grupo funciona.

* A seção 20.2, “Começando”, explica como configurar várias instâncias do MySQL Server para criar um grupo.

* A seção 20.3, “Requisitos e Limitações”, explica os requisitos e limitações de arquitetura e configuração para a Replicação em Grupo.

* A seção 20.4, “Replicação do Grupo de Monitoramento”, explica como monitorar um grupo.

* A seção 20.5, “Operações de Replicação em Grupo”, explica como trabalhar com um grupo.

* A seção 20.6, “Segurança da Replicação em Grupo”, explica como proteger um grupo.

* A seção 20.7, “Desempenho e solução de problemas da replicação em grupo”, explica como ajustar o desempenho para um grupo.

* A seção 20.8, “Atualização da Replicação de Grupo”, explica como atualizar um grupo.

* A Seção 20.9, “Variáveis de Replicação de Grupo”, é uma referência para as variáveis do sistema específicas para a Replicação de Grupo.

* A seção 20.10, “Perguntas Frequentes”, fornece respostas para algumas perguntas técnicas sobre a implantação e operação da Replicação de Grupo.