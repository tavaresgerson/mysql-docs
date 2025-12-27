## 20.2 Começando

20.2.1 Implementando a Replicação em Grupo no Modo de Primordial Único

20.2.2 Implementando a Replicação em Grupo Localmente

A Replicação em Grupo do MySQL é fornecida como um plugin para o servidor MySQL; cada servidor em um grupo requer configuração e instalação do plugin. Esta seção fornece um tutorial detalhado com os passos necessários para criar um grupo de replicação com pelo menos três membros.

Dica

Para implementar múltiplas instâncias do MySQL, você pode usar o InnoDB Cluster, que permite administrar facilmente um grupo de instâncias do servidor MySQL no MySQL Shell. O InnoDB Cluster envolve a Replicação em Grupo do MySQL em um ambiente programático que permite implantar facilmente um clúster de instâncias do MySQL para alcançar alta disponibilidade. Além disso, o InnoDB Cluster se integra perfeitamente com o MySQL Router, que permite que suas aplicações se conectem ao clúster sem precisar escrever seu próprio processo de falha. No entanto, para casos de uso semelhantes que não requerem alta disponibilidade, você pode usar o InnoDB ReplicaSet. As instruções de instalação para o MySQL Shell podem ser encontradas aqui.