## 20.1 Replicação em Grupo - Contexto

20.1.1 Tecnologias de Replicação

20.1.2 Casos de Uso de Replicação em Grupo

20.1.3 Modos de Replicação Múltiplos e de Replicação Única

20.1.4 Serviços de Replicação em Grupo

20.1.5 Arquitetura de Plugin de Replicação em Grupo

Esta seção fornece informações de fundo sobre a Replicação em Grupo do MySQL.

A maneira mais comum de criar um sistema resistente a falhas é recorrer à redundância dos componentes, ou seja, o componente pode ser removido e o sistema deve continuar a funcionar conforme o esperado. Isso cria um conjunto de desafios que elevam a complexidade desses sistemas a um nível completamente diferente. Especificamente, as bases de dados replicadas precisam lidar com o fato de que elas exigem manutenção e administração de vários servidores em vez de apenas um. Além disso, à medida que os servidores estão cooperando para criar o grupo, vários outros problemas clássicos de sistemas distribuídos precisam ser tratados, como a partição da rede ou cenários de cérebro partido.

Portanto, o desafio final é fundir a lógica da replicação de banco de dados e dos dados com a lógica de ter vários servidores coordenados de maneira consistente e simples. Em outras palavras, ter vários servidores concordando com o estado do sistema e dos dados em cada mudança que o sistema passa. Isso pode ser resumido como ter servidores chegando a um acordo sobre cada transição de estado do banco de dados, para que todos avancem como uma única base de dados ou, alternativamente, que eventualmente converjam para o mesmo estado. Significa que eles precisam operar como uma (máquina de estado) distribuída.

O Grupo de Replicação do MySQL fornece replicação de máquina de estado distribuída com uma forte coordenação entre os servidores. Os servidores se coordenam automaticamente quando fazem parte do mesmo grupo. O grupo pode operar no modo de único primário com eleição automática do primário, onde apenas um servidor aceita atualizações de cada vez. Alternativamente, para usuários mais avançados, o grupo pode ser implantado no modo de múltiplos primários, onde todos os servidores podem aceitar atualizações, mesmo que sejam emitidas simultaneamente. Esse poder vem às custas das aplicações que precisam trabalhar em torno das limitações impostas por tais implantações.

Existe um serviço de associação de grupo embutido que mantém a visão do grupo consistente e disponível para todos os servidores em qualquer momento. Os servidores podem sair e entrar no grupo e a visão é atualizada conforme necessário. Às vezes, os servidores podem sair do grupo inesperadamente, caso isso ocorra, o mecanismo de detecção de falha detecta isso e notifica o grupo que a visão foi alterada. Tudo isso é automático.

Para que uma transação seja confirmada, a maioria do grupo deve concordar com a ordem de uma transação específica na sequência global de transações. Decidir confirmar ou abortar uma transação é feito por cada servidor individualmente, mas todos os servidores tomam a mesma decisão. Se houver uma partição de rede, resultando em uma divisão onde os membros não conseguem chegar a um acordo, então o sistema não progride até que esse problema seja resolvido. Portanto, também existe um mecanismo embutido de proteção contra split-brain automático.

Tudo isso é impulsionado pelos protocolos do Sistema de Comunicação de Grupo (GCS) fornecidos. Esses protocolos oferecem um mecanismo de detecção de falhas, um serviço de associação de grupos e entrega de mensagens segura e totalmente ordenada. Todas essas propriedades são essenciais para criar um sistema que garante a replicação consistente dos dados em todo o grupo de servidores. No cerne dessa tecnologia está a implementação do algoritmo Paxos. Ele atua como o motor de comunicação de grupo.