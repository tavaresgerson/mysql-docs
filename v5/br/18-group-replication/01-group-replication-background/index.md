## 17.1 Fundamentos do Group Replication

[17.1.1 Tecnologias de Replication](group-replication-replication-technologies.html)

[17.1.2 Casos de Uso do Group Replication](group-replication-use-cases.html)

[17.1.3 Detalhes do Group Replication](group-replication-details.html)

Esta seção fornece informações fundamentais sobre o MySQL Group Replication.

A maneira mais comum de criar um sistema tolerante a falhas (*fault-tolerant*) é recorrer à redundância de componentes, ou seja, o componente pode ser removido e o sistema deve continuar a operar conforme o esperado. Isso gera um conjunto de desafios que elevam a complexidade de tais sistemas a um nível totalmente diferente. Especificamente, *Databases* replicados precisam lidar com o fato de exigirem manutenção e administração de diversos *Servers* em vez de apenas um. Além disso, à medida que os *Servers* cooperam para criar o grupo, vários outros problemas clássicos de sistemas distribuídos precisam ser resolvidos, como *network partitioning* ou cenários de *split brain*.

Portanto, o desafio final é fundir a lógica do *Database* e da *data replication* com a lógica de ter vários *Servers* coordenados de forma consistente e simples. Em outras palavras, fazer com que múltiplos *Servers* cheguem a um acordo sobre o estado do sistema e dos dados a cada mudança pela qual o sistema passa. Isso pode ser resumido como *Servers* chegando a um acordo sobre cada transição de estado do *Database*, para que todos progridam como um único *Database* ou, alternativamente, que acabem convergindo para o mesmo estado. Significando que eles precisam operar como uma máquina de estado (distribuída).

O MySQL Group Replication fornece *state machine replication* distribuída com forte coordenação entre os *Servers*. Os *Servers* se coordenam automaticamente quando fazem parte do mesmo grupo. O grupo pode operar em modo *single-primary* com eleição automática do *primary*, onde apenas um *Server* aceita *updates* por vez. Alternativamente, para usuários mais avançados, o grupo pode ser implantado em modo *multi-primary*, onde todos os *Servers* podem aceitar *updates*, mesmo que sejam emitidos concorrentemente. Essa capacidade vem ao custo de as aplicações terem que contornar as limitações impostas por tais implantações.

Existe um serviço de associação de grupo (*group membership service*) integrado que mantém a visão do grupo consistente e disponível para todos os *Servers* a qualquer momento. Os *Servers* podem sair e entrar no grupo e a visão é atualizada correspondentemente. Às vezes, os *Servers* podem sair do grupo inesperadamente, caso em que o mecanismo de detecção de falhas (*failure detection mechanism*) detecta isso e notifica o grupo de que a visão mudou. Isso é totalmente automático.

Para que uma *Transaction* faça *Commit*, a maioria do grupo precisa concordar com a ordem de uma determinada *Transaction* na sequência global de *Transactions*. A decisão de fazer *Commit* ou *Abort* em uma *Transaction* é tomada por cada *Server* individualmente, mas todos os *Servers* tomam a mesma decisão. Se houver um *network partition*, resultando em uma divisão onde os membros são incapazes de chegar a um acordo, o sistema não avança até que esse problema seja resolvido. Consequentemente, há também um mecanismo automático integrado de proteção contra *split-brain*.

Tudo isso é alimentado pelos protocolos do Sistema de Comunicação de Grupo (*Group Communication System* - GCS) fornecidos. Estes oferecem um mecanismo de detecção de falhas (*failure detection mechanism*), um serviço de associação de grupo (*group membership service*) e entrega de mensagens segura e totalmente ordenada. Todas essas propriedades são essenciais para criar um sistema que garanta que os dados sejam replicados de forma consistente em todo o grupo de *Servers*. No cerne desta tecnologia reside uma implementação do *Paxos algorithm*. Ele atua como o motor de comunicação do grupo.