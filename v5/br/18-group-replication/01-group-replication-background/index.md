## 17.1 Contexto da Replicação em Grupo

17.1.1 Tecnologias de Replicação

17.1.2 Casos de uso de replicação em grupo

17.1.3 Detalhes da Replicação em Grupo

Esta seção fornece informações de fundo sobre a replicação em grupo do MySQL.

A maneira mais comum de criar um sistema tolerante a falhas é recorrer à redundância dos componentes, ou seja, o componente pode ser removido e o sistema deve continuar a funcionar conforme o esperado. Isso cria um conjunto de desafios que elevam a complexidade desses sistemas a um nível completamente diferente. Especificamente, as bases de dados replicadas têm de lidar com o fato de que elas exigem manutenção e administração de vários servidores, em vez de apenas um. Além disso, à medida que os servidores estão cooperando para criar o grupo, vários outros problemas clássicos de sistemas distribuídos têm de ser resolvidos, como a partição da rede ou cenários de split brain.

Portanto, o desafio final é fundir a lógica do banco de dados e da replicação de dados com a lógica de ter vários servidores coordenados de maneira consistente e simples. Em outras palavras, ter vários servidores concordando com o estado do sistema e dos dados em cada mudança que o sistema passa. Isso pode ser resumido em ter servidores chegando a um acordo sobre cada transição de estado do banco de dados, para que todos avancem como um único banco de dados ou, alternativamente, que eventualmente converjam para o mesmo estado. Isso significa que eles precisam operar como uma (máquina de estado) distribuída.

O MySQL Group Replication oferece replicação de máquina de estado distribuída com uma forte coordenação entre os servidores. Os servidores se coordenam automaticamente quando fazem parte do mesmo grupo. O grupo pode operar no modo de único primário com eleição automática do primário, onde apenas um servidor aceita atualizações de cada vez. Como alternativa, para usuários mais avançados, o grupo pode ser implantado no modo de múltiplos primários, onde todos os servidores podem aceitar atualizações, mesmo que sejam emitidas simultaneamente. Esse poder vem às custas das aplicações que precisam trabalhar em torno das limitações impostas por tais implantações.

Existe um serviço de associação de grupos integrado que mantém a visualização do grupo consistente e disponível para todos os servidores em qualquer momento. Os servidores podem sair e ingressar no grupo e a visualização é atualizada conforme necessário. Às vezes, os servidores podem sair do grupo inesperadamente, e, nesse caso, o mecanismo de detecção de falhas detecta isso e notifica o grupo de que a visualização foi alterada. Tudo isso é automático.

Para que uma transação seja confirmada, a maioria do grupo precisa concordar com a ordem de uma transação específica na sequência global de transações. A decisão de confirmar ou abortar uma transação é tomada individualmente por cada servidor, mas todos os servidores tomam a mesma decisão. Se houver uma partição na rede, resultando em uma divisão onde os membros não conseguem chegar a um acordo, o sistema não avança até que esse problema seja resolvido. Portanto, há também um mecanismo de proteção embutido, automático e contra divisão de cérebros.

Tudo isso é impulsionado pelos protocolos do Sistema de Comunicação de Grupo (GCS) fornecidos. Esses protocolos oferecem um mecanismo de detecção de falhas, um serviço de associação de grupos e entrega de mensagens segura e totalmente ordenada. Todas essas propriedades são essenciais para criar um sistema que garante a replicação consistente dos dados em todo o grupo de servidores. No cerne dessa tecnologia, existe uma implementação do algoritmo Paxos. Ele atua como o motor de comunicação de grupo.
