### 19.1.7 Tarefas Comuns de Administração de Replicação

19.1.7.1 Verificar o Status da Replicação

19.1.7.2 Pausar a Replicação na Replica

19.1.7.3 Ignorar Transações

Uma vez que a replicação tenha sido iniciada, ela é executada sem exigir muita administração regular. Esta seção descreve como verificar o status da replicação, como pausar uma replica e como ignorar uma transação falha em uma replica.

Dica

Para implantar múltiplas instâncias do MySQL, você pode usar o InnoDB Cluster, que permite administrar facilmente um grupo de instâncias do servidor MySQL no MySQL Shell. O InnoDB Cluster envolve a Replicação de Grupo do MySQL em um ambiente programático que permite implantar facilmente um clúster de instâncias do MySQL para alcançar alta disponibilidade. Além disso, o InnoDB Cluster interage perfeitamente com o MySQL Router, que permite que suas aplicações se conectem ao clúster sem precisar escrever seu próprio processo de falha. No entanto, para casos de uso semelhantes que não requerem alta disponibilidade, você pode usar o InnoDB ReplicaSet. As instruções de instalação do MySQL Shell podem ser encontradas aqui.