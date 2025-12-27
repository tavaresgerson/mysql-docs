### 20.1.2 Casos de Uso de Replicação em Grupo

A Replicação em Grupo permite que você crie sistemas resistentes a falhas com redundância, replicando o estado do sistema para um conjunto de servidores. Mesmo que alguns dos servidores falharem posteriormente, desde que não seja todos ou a maioria, o sistema ainda estará disponível. Dependendo do número de servidores que falham, o grupo pode ter desempenho ou escalabilidade degradados, mas ainda estará disponível. As falhas dos servidores são isoladas e independentes. Elas são rastreadas por um serviço de associação de grupo que depende de um detector de falha distribuído que é capaz de sinalizar quando algum servidor sair do grupo, seja voluntariamente ou devido a uma parada inesperada. Existe um procedimento de recuperação distribuído para garantir que, quando os servidores se juntarem ao grupo, eles sejam atualizados automaticamente. Não há necessidade de failover de servidor, e a natureza de atualização de múltiplas fontes em todas as direções garante que até mesmo as atualizações não sejam bloqueadas em caso de falha de um único servidor. Para resumir, a Replicação em Grupo do MySQL garante que o serviço de banco de dados esteja continuamente disponível.

É importante entender que, embora o serviço de banco de dados esteja disponível, no caso de uma saída inesperada de um servidor, os clientes conectados a ele devem ser redirecionados ou passados para outro servidor. Isso não é algo que a Replicação em Grupo tenta resolver. Um conector, um equilibrador de carga, um roteador ou alguma forma de middleware são mais adequados para lidar com esse problema. Por exemplo, veja o MySQL Router 9.5.

Para resumir, a Replicação em Grupo do MySQL fornece um serviço MySQL altamente disponível, altamente elástico e confiável.

Dica

Para implantar múltiplas instâncias do MySQL, você pode usar o InnoDB Cluster, que permite administrar facilmente um grupo de instâncias do servidor MySQL no MySQL Shell. O InnoDB Cluster envolve a Replicação de Grupo do MySQL em um ambiente programático que permite implantar facilmente um clúster de instâncias do MySQL para alcançar alta disponibilidade. Além disso, o InnoDB Cluster se integra perfeitamente ao MySQL Router, que permite que suas aplicações se conectem ao clúster sem precisar escrever seu próprio processo de falha. Para casos de uso semelhantes que não exigem alta disponibilidade, no entanto, você pode usar o InnoDB ReplicaSet. As instruções de instalação para o MySQL Shell podem ser encontradas aqui.

#### Casos de Uso Exemplos

Os seguintes exemplos são casos de uso típicos para a Replicação de Grupo.

* *Elastic Replication* - Ambientes que exigem uma infraestrutura de replicação muito fluida, onde o número de servidores precisa crescer ou diminuir dinamicamente e com o menor número possível de efeitos colaterais. Por exemplo, serviços de banco de dados para a nuvem.

* *Shards de Alta Disponibilidade* - A fragmentação é uma abordagem popular para alcançar escalabilidade de escrita. Use a Replicação de Grupo do MySQL para implementar shards de alta disponibilidade, onde cada shard é mapeado a um grupo de replicação.

* *Alternativa à replicação assíncrona Source-Replica* - Em certas situações, usar um único servidor de origem torna-o um único ponto de contenção. Escrever para um grupo inteiro pode ser mais escalável sob certas circunstâncias.

* *Sistemas Autônomos* - Além disso, você pode implantar a Replicação de Grupo do MySQL puramente para a automação embutida no protocolo de replicação (já descrito neste e nos capítulos anteriores).