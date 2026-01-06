#### 17.1.2.1 Exemplos de cenários de casos de uso

Os exemplos a seguir são casos de uso típicos para a replicação em grupo.

- *Replicação elástica* - Ambientes que exigem uma infraestrutura de replicação muito fluida, onde o número de servidores precisa crescer ou diminuir dinamicamente e com o menor número possível de efeitos colaterais. Por exemplo, serviços de banco de dados para a nuvem.

- *Shard de Alta Disponibilidade* - O sharding é uma abordagem popular para alcançar a escalabilidade de escrita. Use a Replicação por Grupo do MySQL para implementar shards de alta disponibilidade, onde cada shard é mapeado para um grupo de replicação.

- *Alternativa à replicação Source-Replica* - Em certas situações, usar um único servidor de origem torna-o um único ponto de conflito. Escrever para um grupo inteiro pode ser mais escalável em certas circunstâncias.

- - Sistemas Autônomos\* - Além disso, você pode implementar a Replicação de Grupo do MySQL apenas para a automação embutida no protocolo de replicação (já descrito neste e nos capítulos anteriores).
