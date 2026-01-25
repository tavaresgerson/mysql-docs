## 16.3 Soluções de Replication

[16.3.1 Usando Replication para Backups](replication-solutions-backups.html)

[16.3.2 Lidando com uma Parada Inesperada de uma Replica](replication-solutions-unexpected-replica-halt.html)

[16.3.3 Usando Replication com Source e Replica com Storage Engines Diferentes](replication-solutions-diffengines.html)

[16.3.4 Usando Replication para Scale-Out](replication-solutions-scaleout.html)

[16.3.5 Replicando Databases Diferentes para Replicas Diferentes](replication-solutions-partitioning.html)

[16.3.6 Melhorando o Desempenho da Replication](replication-solutions-performance.html)

[16.3.7 Trocando Sources Durante um Failover](replication-solutions-switch.html)

[16.3.8 Configurando Replication para Usar Conexões Criptografadas](replication-encrypted-connections.html)

[16.3.9 Replication Semisynchronous](replication-semisync.html)

[16.3.10 Replication Atrasada (Delayed Replication)](replication-delayed.html)

A Replication pode ser utilizada em muitos ambientes diferentes para uma variedade de propósitos. Esta seção fornece notas gerais e conselhos sobre o uso de Replication para tipos específicos de solução.

Para informações sobre o uso de Replication em um ambiente de backup, incluindo notas sobre a configuração, o procedimento de backup e os arquivos a serem submetidos a backup, consulte [Seção 16.3.1, “Usando Replication para Backups”](replication-solutions-backups.html "16.3.1 Usando Replication para Backups").

Para conselhos e dicas sobre como usar diferentes Storage Engines no Source e nas Replicas, consulte [Seção 16.3.3, “Usando Replication com Source e Replica com Storage Engines Diferentes”](replication-solutions-diffengines.html "16.3.3 Usando Replication com Source e Replica com Storage Engines Diferentes").

Usar Replication como uma solução de scale-out exige algumas mudanças na lógica e na operação dos aplicativos que usam a solução. Consulte [Seção 16.3.4, “Usando Replication para Scale-Out”](replication-solutions-scaleout.html "16.3.4 Usando Replication para Scale-Out").

Por razões de desempenho ou distribuição de dados, você pode querer replicar Databases diferentes para Replicas diferentes. Consulte [Seção 16.3.5, “Replicando Databases Diferentes para Replicas Diferentes”](replication-solutions-partitioning.html "16.3.5 Replicando Databases Diferentes para Replicas Diferentes")

À medida que o número de Replicas aumenta, a carga no Source pode aumentar e levar à redução do desempenho (devido à necessidade de replicar o Binary Log para cada Replica). Para dicas sobre como melhorar o desempenho da sua Replication, incluindo o uso de um único servidor secundário como servidor Source de Replication, consulte [Seção 16.3.6, “Melhorando o Desempenho da Replication”](replication-solutions-performance.html "16.3.6 Melhorando o Desempenho da Replication").

Para orientação sobre como trocar Sources, ou converter Replicas em Sources como parte de uma solução de failover de emergência, consulte [Seção 16.3.7, “Trocando Sources Durante um Failover”](replication-solutions-switch.html "16.3.7 Trocando Sources Durante um Failover").

Para proteger sua comunicação de Replication, você pode criptografar o canal de comunicação. Para instruções passo a passo, consulte [Seção 16.3.8, “Configurando Replication para Usar Conexões Criptografadas”](replication-encrypted-connections.html "16.3.8 Configurando Replication para Usar Conexões Criptografadas").