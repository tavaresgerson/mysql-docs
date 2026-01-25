### 21.2.2 Nodes, Node Groups, Fragment Replicas e Partitions do NDB Cluster

Esta seção discute a maneira como o NDB Cluster divide e duplica dados para armazenamento.

Vários conceitos centrais para a compreensão deste tópico são discutidos nos próximos parágrafos.

**Data node.** Um processo [**ndbd**] ou [**ndbmtd**], que armazena uma ou mais Fragment Replicas — ou seja, cópias das Partitions (discutidas mais adiante nesta seção) atribuídas ao Node Group do qual o Node é membro.

Cada Data Node deve estar localizado em um computador separado. Embora também seja possível hospedar múltiplos processos de Data Node em um único computador, tal configuração geralmente não é recomendada.

É comum que os termos “Node” e “Data Node” sejam usados de forma intercambiável ao se referir a um processo [**ndbd**] ou [**ndbmtd**]; quando mencionados, management nodes (processos [**ndb_mgmd**]) e SQL nodes (processos [**mysqld**]) são especificados como tal nesta discussão.

**Node group.** Um Node Group consiste em um ou mais Nodes e armazena Partitions, ou conjuntos de Fragment Replicas (consulte o próximo item).

O número de Node Groups em um NDB Cluster não é diretamente configurável; é uma função do número de Data Nodes e do número de Fragment Replicas (parâmetro de configuração [`NoOfReplicas`]), conforme mostrado aqui:

```sql
[# of node groups] = [# of data nodes] / NoOfReplicas
```

Assim, um NDB Cluster com 4 Data Nodes tem 4 Node Groups se [`NoOfReplicas`] for configurado para 1 no arquivo `config.ini`, 2 Node Groups se [`NoOfReplicas`] for configurado para 2, e 1 Node Group se [`NoOfReplicas`] for configurado para 4. Fragment Replicas são discutidas mais adiante nesta seção; para mais informações sobre [`NoOfReplicas`], consulte [Section 21.4.3.6, “Defining NDB Cluster Data Nodes”].

Note

Todos os Node Groups em um NDB Cluster devem ter o mesmo número de Data Nodes.

Você pode adicionar novos Node Groups (e, portanto, novos Data Nodes) online, a um NDB Cluster em execução; consulte [Section 21.6.7, “Adding NDB Cluster Data Nodes Online”], para mais informações.

**Partition.** Esta é uma porção dos dados armazenados pelo Cluster. Cada Node é responsável por manter pelo menos uma cópia de quaisquer Partitions atribuídas a ele (ou seja, pelo menos uma Fragment Replica) disponível para o Cluster.

O número de Partitions usadas por padrão pelo NDB Cluster depende do número de Data Nodes e do número de LDM Threads em uso pelos Data Nodes, conforme mostrado aqui:

```sql
[# of partitions] = [# of data nodes] * [# of LDM threads]
```

Ao usar Data Nodes executando [**ndbmtd**], o número de LDM Threads é controlado pela configuração de [`MaxNoOfExecutionThreads`]. Ao usar [**ndbd**] há uma única LDM Thread, o que significa que há tantas Cluster Partitions quanto Nodes participando do Cluster. Este também é o caso ao usar [**ndbmtd**] com `MaxNoOfExecutionThreads` configurado para 3 ou menos. (Você deve estar ciente de que o número de LDM Threads aumenta com o valor deste parâmetro, mas não de forma estritamente linear, e que há restrições adicionais para configurá-lo; consulte a descrição de [`MaxNoOfExecutionThreads`] para obter mais informações.)

**NDB e Partitioning definido pelo usuário.** O NDB Cluster normalmente particiona tabelas [`NDBCLUSTER`] automaticamente. No entanto, também é possível empregar Partitioning definido pelo usuário com tabelas [`NDBCLUSTER`]. Isso está sujeito às seguintes limitações:

1. Apenas os esquemas de Partitioning `KEY` e `LINEAR KEY` são suportados em produção com tabelas [`NDB`].

2. O número máximo de Partitions que podem ser definidas explicitamente para qualquer tabela [`NDB`] é `8 * [número de LDM threads] * [número de node groups]`, sendo o número de Node Groups em um NDB Cluster determinado conforme discutido anteriormente nesta seção. Ao executar [**ndbd**] para processos de Data Node, a configuração do número de LDM Threads não tem efeito (uma vez que [`ThreadConfig`] se aplica apenas ao [**ndbmtd**]); nesses casos, este valor pode ser tratado como se fosse igual a 1 para fins de realização deste cálculo.

   Consulte [Section 21.5.3, “ndbmtd — The NDB Cluster Data Node Daemon (Multi-Threaded)”], para mais informações.

Para mais informações relacionadas ao NDB Cluster e ao Partitioning definido pelo usuário, consulte [Section 21.2.7, “Known Limitations of NDB Cluster”], e [Section 22.6.2, “Partitioning Limitations Relating to Storage Engines”].

**Fragment replica.** Esta é uma cópia de uma Cluster Partition. Cada Node em um Node Group armazena uma Fragment Replica. Também é por vezes conhecida como Partition Replica. O número de Fragment Replicas é igual ao número de Nodes por Node Group.

Uma Fragment Replica pertence inteiramente a um único Node; um Node pode (e geralmente armazena) diversas Fragment Replicas.

O diagrama a seguir ilustra um NDB Cluster com quatro Data Nodes executando [**ndbd**], dispostos em dois Node Groups de dois Nodes cada; os Nodes 1 e 2 pertencem ao Node Group 0, e os Nodes 3 e 4 pertencem ao Node Group 1.

Note

Apenas os Data Nodes são mostrados aqui; embora um NDB Cluster em funcionamento exija um processo [**ndb_mgmd**] para gerenciamento do Cluster e pelo menos um SQL Node para acessar os dados armazenados pelo Cluster, eles foram omitidos da figura para maior clareza.

**Figura 21.2 NDB Cluster com Dois Node Groups**

![O conteúdo é descrito no texto circundante.](images/fragment-replicas-groups-1-1.png)

Os dados armazenados pelo Cluster são divididos em quatro Partitions, numeradas 0, 1, 2 e 3. Cada Partition é armazenada — em múltiplas cópias — no mesmo Node Group. As Partitions são armazenadas em Node Groups alternados da seguinte forma:

* A Partition 0 é armazenada no Node Group 0; uma Primary Fragment Replica (cópia primária) é armazenada no Node 1, e uma Backup Fragment Replica (cópia de Backup da Partition) é armazenada no Node 2.

* A Partition 1 é armazenada no outro Node Group (Node Group 1); a Primary Fragment Replica desta Partition está no Node 3, e sua Backup Fragment Replica está no Node 4.

* A Partition 2 é armazenada no Node Group 0. No entanto, a colocação de suas duas Fragment Replicas é invertida em relação à Partition 0; para a Partition 2, a Primary Fragment Replica é armazenada no Node 2, e a Backup no Node 1.

* A Partition 3 é armazenada no Node Group 1, e a colocação de suas duas Fragment Replicas é invertida em relação às da Partition 1. Ou seja, sua Primary Fragment Replica está localizada no Node 4, com a Backup no Node 3.

O que isso significa em relação à operação contínua de um NDB Cluster é o seguinte: contanto que cada Node Group participante no Cluster tenha pelo menos um Node em operação, o Cluster possui uma cópia completa de todos os dados e permanece viável. Isso é ilustrado no próximo diagrama.

**Figura 21.3 Nodes Necessários para um NDB Cluster 2x2**

![O conteúdo é descrito no texto circundante.](images/replicas-groups-1-2.png)

Neste exemplo, o Cluster consiste em dois Node Groups, cada um composto por dois Data Nodes. Cada Data Node está executando uma instância de [**ndbd**]. Qualquer combinação de pelo menos um Node do Node Group 0 e pelo menos um Node do Node Group 1 é suficiente para manter o Cluster “ativo” (alive). No entanto, se ambos os Nodes de um único Node Group falharem, a combinação composta pelos dois Nodes restantes no outro Node Group não é suficiente. Nesta situação, o Cluster perdeu uma Partition inteira e, portanto, não pode mais fornecer acesso a um conjunto completo de todos os dados do NDB Cluster.

No NDB 7.5.4 e posterior, o número máximo de Node Groups suportados para uma única instância do NDB Cluster é 48 (Bug#80845, Bug #22996305).