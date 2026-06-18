### 25.2.2 Nodos do clúster do BND, Grupos de nós, Replicas de fragmentos e Partições

Esta seção discute a maneira como o NDB Cluster divide e duplica os dados para armazenamento.

Vários conceitos centrais para uma compreensão deste tópico são discutidos nos próximos parágrafos.

**Núcleo de dados.** Um processo **ndbd** ou **ndbmtd**") que armazena uma ou mais réplicas de fragmentos, ou seja, cópias das partições (discutidas mais adiante nesta seção) atribuídas ao grupo de nós do qual o nó faz parte.

Cada nó de dados deve estar localizado em um computador separado. Embora seja possível hospedar vários processos de nó de dados em um único computador, essa configuração geralmente não é recomendada.

É comum que os termos "nó" e "nó de dados" sejam usados de forma intercambiável ao se referir a um processo **ndbd** ou \*\*ndbmtd"). Quando mencionado, os nós de gerenciamento (processos **ndb\_mgmd**) e os nós de SQL (processos **mysqld**) são especificados como tal nesta discussão.

**Grupo de nós.** Um grupo de nós é composto por um ou mais nós e armazena partições ou conjuntos de réplicas de fragmentos (veja o próximo item).

O número de grupos de nós em um NDB Cluster não é diretamente configurável; é uma função do número de nós de dados e do número de réplicas de fragmentação (parâmetro de configuração `NoOfReplicas`), conforme mostrado aqui:

```
[# of node groups] = [# of data nodes] / NoOfReplicas
```

Assim, um NDB Cluster com 4 nós de dados tem 4 grupos de nós se `NoOfReplicas` estiver definido como 1 no arquivo `config.ini`, 2 grupos de nós se `NoOfReplicas` estiver definido como 2 e 1 grupo de nós se `NoOfReplicas` estiver definido como 4. As réplicas fragmentadas são discutidas mais adiante nesta seção; para mais informações sobre `NoOfReplicas`, consulte a Seção 25.4.3.6, “Definindo Nodos de Dados de NDB Cluster”.

Nota

Todos os grupos de nós em um NDB Cluster devem ter o mesmo número de nós de dados.

Você pode adicionar novos grupos de nós (e, portanto, novos nós de dados) online a um NDB Cluster em execução; consulte a Seção 25.6.7, “Adicionar Nodos de Dados de NDB Cluster Online”, para obter mais informações.

**Partição.** Esta é uma parte dos dados armazenados pelo clúster. Cada nó é responsável por manter, pelo menos, uma cópia de qualquer partição atribuída a ele (ou seja, pelo menos uma réplica de fragmento) disponível para o clúster.

O número de partições usadas por padrão pelo NDB Cluster depende do número de nós de dados e do número de threads LDM em uso pelos nós de dados, conforme mostrado aqui:

```
[# of partitions] = [# of data nodes] * [# of LDM threads]
```

Ao usar nós de dados que executam **ndbmtd**"), o número de threads do LDM é controlado pelo ajuste para `MaxNoOfExecutionThreads`. Ao usar **ndbd**, há um único thread do LDM, o que significa que há tantas partições do clúster quanto nós participam do clúster. Isso também é o caso ao usar **ndbmtd**") com `MaxNoOfExecutionThreads` definido como 3 ou menos. (Você deve estar ciente de que o número de threads do LDM aumenta com o valor deste parâmetro, mas não de forma estritamente linear, e que há restrições adicionais para configurá-lo; consulte a descrição de `MaxNoOfExecutionThreads` para mais informações.)

**Partitionamento definido pelo usuário e NDB.** O NDB Cluster normalmente particiona as tabelas `NDBCLUSTER` automaticamente. No entanto, também é possível usar o particionamento definido pelo usuário com as tabelas `NDBCLUSTER`. Isso está sujeito às seguintes limitações:

1. Apenas os esquemas de particionamento `KEY` e `LINEAR KEY` são suportados em produção com tabelas `NDB`.

2. O número máximo de partições que podem ser definidas explicitamente para qualquer tabela `NDB` é `8 * [number of LDM threads] * [number of node groups]`, o número de grupos de nós em um NDB Cluster sendo determinado conforme discutido anteriormente nesta seção. Ao executar o **ndbd** para processos de nó de dados, definir o número de threads do LDM não tem efeito (já que `ThreadConfig` se aplica apenas ao \*\*ndbmtd]]"), em tais casos, esse valor pode ser tratado como se fosse igual a 1 para fins de realização deste cálculo.

   Consulte a Seção 25.5.3, “ndbmtd — O Daemon do Nó de Dados do NDB Cluster (Multi-Thread)”), para obter mais informações.

Para obter mais informações sobre o NDB Cluster e a partição definida pelo usuário, consulte a Seção 25.2.7, “Limitações Conhecidas do NDB Cluster”, e a Seção 26.6.2, “Limitações de Partição Relacionadas aos Motores de Armazenamento”.

**Replica de fragmento.** Esta é uma cópia de uma partição de cluster. Cada nó em um grupo de nós armazena uma replica de fragmento. Também é conhecida como replica de partição. O número de réplicas de fragmento é igual ao número de nós por grupo de nós.

Uma replica de fragmento pertence inteiramente a um único nó; um nó pode (e geralmente armazena) várias réplicas de fragmento.

O diagrama a seguir ilustra um NDB Cluster com quatro nós de dados executando **ndbd**, organizados em dois grupos de nós de dois nós cada; os nós 1 e 2 pertencem ao grupo de nós 0, e os nós 3 e 4 pertencem ao grupo de nós 1.

Nota

Aqui, apenas os nós de dados são mostrados; embora um NDB Cluster funcional exija um processo **ndb\_mgmd** para a gestão do cluster e pelo menos um nó SQL para acessar os dados armazenados pelo cluster, esses foram omitidos da figura para maior clareza.

**Figura 25.2. NDB Cluster com Dois Grupos de Nodos**

![Content is described in the surrounding text.](images/fragment-replicas-groups-1-1.png)

Os dados armazenados pelo clúster são divididos em quatro partições, numeradas de 0, 1, 2 e 3. Cada partição é armazenada — em múltiplas cópias — no mesmo grupo de nós. As partições são armazenadas em grupos de nós alternados da seguinte forma:

- A partição 0 é armazenada no grupo de nós 0; uma replica primária de fragmento (cópia primária) é armazenada no nó 1, e uma replica de backup de fragmento (cópia de backup da partição) é armazenada no nó 2.

- A partição 1 é armazenada no outro grupo de nós (grupo de nós 1); a replica primária do fragmento dessa partição está no nó 3, e a replica de backup do fragmento está no nó 4.

- A partição 2 é armazenada no grupo de nós 0. No entanto, a colocação de suas duas réplicas de fragmento é invertida em relação à da Partição 0; para a Partição 2, a réplica de fragmento primária é armazenada no nó 2, e o backup no nó 1.

- A partição 3 está armazenada no grupo de nós 1, e a colocação de suas duas réplicas de fragmento é invertida em relação às da partição

  1. Ou seja, sua replica primária de fragmento está localizada no nó 4, com o backup no nó 3.

O que isso significa em relação ao funcionamento contínuo de um NDB Cluster é o seguinte: enquanto cada grupo de nós que participa do cluster tiver pelo menos um nó em operação, o cluster terá uma cópia completa de todos os dados e permanecerá viável. Isso é ilustrado no diagrama a seguir.

**Figura 25.3 Nodos necessários para um cluster NDB 2x2**

![Content is described in the surrounding text.](images/replicas-groups-1-2.png)

Neste exemplo, o clúster consiste em dois grupos de nós, cada um contendo dois nós de dados. Cada nó de dados está executando uma instância do **ndbd**. Qualquer combinação de pelo menos um nó do grupo de nós 0 e pelo menos um nó do grupo de nós 1 é suficiente para manter o clúster “vivo”. No entanto, se ambos os nós de um único grupo de nós falharem, a combinação que consiste nos dois nós restantes do outro grupo de nós não é suficiente. Nesta situação, o clúster perdeu uma partição inteira e, portanto, não pode mais fornecer acesso a um conjunto completo de todos os dados do NDB Cluster.

O número máximo de grupos de nós suportados para uma única instância do NDB Cluster é de 48.
