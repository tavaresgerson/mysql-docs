#### 17.1.2.1 Exemplos de Cenários de Caso de Uso

Os exemplos a seguir são casos de uso típicos para o Group Replication.

* *Elastic Replication* - Ambientes que exigem uma infraestrutura de Replication muito fluida, onde o número de Servers precisa crescer ou diminuir dinamicamente e com o mínimo de efeitos colaterais possível. Por exemplo, serviços de Database para a cloud.

* *Highly Available Shards* - Sharding é uma abordagem popular para alcançar write scale-out. Use o MySQL Group Replication para implementar shards de alta disponibilidade, onde cada shard mapeia para um grupo de Replication.

* *Alternative to Source-Replica replication* - Em certas situações, usar um único source server o torna um single point of contention. Escrever para um grupo inteiro pode se mostrar mais scalable sob certas circunstâncias.

* *Autonomic Systems* - Além disso, você pode implantar o MySQL Group Replication puramente pela automation que está embutida no replication protocol (já descrita neste e nos capítulos anteriores).