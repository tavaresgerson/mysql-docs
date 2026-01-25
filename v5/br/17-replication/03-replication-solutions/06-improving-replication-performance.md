### 16.3.6 Melhorando o Desempenho da Replicação

À medida que o número de replicas se conectando a um source aumenta, a carga, embora mínima, também aumenta, pois cada replica utiliza uma conexão de cliente (client connection) para o source. Além disso, como cada replica deve receber uma cópia completa do Binary Log do source, a carga de rede no source também pode aumentar e criar um bottleneck.

Se você estiver utilizando um grande número de replicas conectadas a um source, e esse source também estiver ocupado processando solicitações (por exemplo, como parte de uma solução de scale-out), talvez você queira melhorar o desempenho do processo de replicação.

Uma maneira de melhorar o desempenho do processo de replicação é criar uma estrutura de replicação mais profunda que permita que o source replique para apenas uma replica, e que as replicas restantes se conectem a esta replica primária para suas necessidades individuais de replicação. Um exemplo dessa estrutura é mostrado na [Figura 16.3, “Usando um Source de Replicação Adicional para Melhorar o Desempenho”](replication-solutions-performance.html#figure_replication-performance "Figure 16.3 Usando um Source de Replicação Adicional para Melhorar o Desempenho").

**Figura 16.3 Usando um Source de Replicação Adicional para Melhorar o Desempenho**

![O servidor MySQL Source 1 replica para o servidor MySQL Source 2, que por sua vez replica para os servidores MySQL Replica 1, MySQL Replica 2 e MySQL Replica 3.](images/subsource-performance.png)

Para que isso funcione, você deve configurar as instâncias MySQL da seguinte forma:

*   O Source 1 é o source primário onde todas as alterações e updates são gravados no Database. O Binary Logging deve ser ativado nesta máquina.

*   O Source 2 é a replica do Source 1 que fornece a funcionalidade de replicação para o restante das replicas na estrutura de replicação. O Source 2 é a única máquina permitida para se conectar ao Source 1. O Source 2 também tem o Binary Logging ativado e a variável de sistema [`log_slave_updates`](replication-options-binary-log.html#sysvar_log_slave_updates) ativada, para que as instruções de replicação do Source 1 também sejam gravadas no Binary Log do Source 2 e, assim, possam ser replicadas para as replicas verdadeiras.

*   Replica 1, Replica 2 e Replica 3 atuam como replicas do Source 2, e replicam as informações do Source 2, que na verdade consistem nos upgrades registrados no Source 1.

A solução acima reduz a carga do cliente (client load) e a carga da interface de rede (network interface load) no source primário, o que deve melhorar o desempenho geral do source primário quando usado como uma solução de Database direta.

Se as suas replicas estiverem com dificuldade em acompanhar o processo de replicação no source, há uma série de opções disponíveis:

*   Se possível, coloque os relay logs e os data files em diferentes drives físicos. Para fazer isso, defina a variável de sistema [`relay_log`](replication-options-replica.html#sysvar_relay_log) para especificar a localização do relay log.

*   Se as replicas forem significativamente mais lentas do que o source, talvez você queira dividir a responsabilidade de replicar Databases diferentes para diferentes replicas. Consulte a [Seção 16.3.5, “Replicando Databases Diferentes para Replicas Diferentes”](replication-solutions-partitioning.html "16.3.5 Replicando Databases Diferentes para Replicas Diferentes").

*   Se o seu source utiliza transactions e você não está preocupado com o suporte a transaction nas suas replicas, utilize `MyISAM` ou outro Storage Engine não transacional nas replicas. Consulte a [Seção 16.3.3, “Utilizando Replicação com Different Source and Replica Storage Engines”](replication-solutions-diffengines.html "16.3.3 Utilizando Replicação com Different Source and Replica Storage Engines").

*   Se as suas replicas não estiverem atuando como sources, e você tiver uma solução potencial para garantir que você possa levantar um source em caso de falha, você pode desativar a variável de sistema [`log_slave_updates`](replication-options-binary-log.html#sysvar_log_slave_updates) nas replicas. Isso impede que replicas "burras" (dumb) também registrem eventos que executaram em seu próprio Binary Log.