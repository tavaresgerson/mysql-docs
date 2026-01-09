### 25.2.2 Nodos do Clúster NDB, Grupos de Nodos, Replicas de Fragmentos e Partições

Esta seção discute a maneira como o NDB Cluster divide e duplica os dados para armazenamento.

Vários conceitos centrais para a compreensão deste tópico são discutidos nos próximos parágrafos.

**Nó de dados.** Um processo **ndbd** ou **ndbmtd**") que armazena uma ou mais réplicas de fragmento, ou seja, cópias das partições (discutidas mais adiante nesta seção) atribuídas ao grupo de nós do qual o nó é membro.

Cada nó de dados deve estar localizado em um computador separado. Embora seja possível hospedar vários processos de nó de dados em um único computador, essa configuração geralmente não é recomendada.

É comum que os termos “nó” e “nó de dados” sejam usados de forma intercambiável ao se referir a um processo **ndbd** ou **ndbmtd")"; onde mencionado, os nós de gerenciamento (processos **ndb_mgmd**) e os nós SQL (processos **mysqld**) são especificados como tal nesta discussão.

**Grupo de nós.** Um grupo de nós consiste em um ou mais nós e armazena partições ou conjuntos de réplicas de fragmento (veja o próximo item).

O número de grupos de nós em um NDB Cluster não é diretamente configurável; é uma função do número de nós de dados e do número de réplicas de fragmento (`parâmetro de configuração NoOfReplicas`), conforme mostrado aqui:

```
[# of node groups] = [# of data nodes] / NoOfReplicas
```

Assim, um NDB Cluster com 4 nós de dados tem 4 grupos de nós se `NoOfReplicas` for definido para 1 no arquivo `config.ini`, 2 grupos de nós se `NoOfReplicas` for definido para 2 e 1 grupo de nós se `NoOfReplicas` for definido para 4. As réplicas de fragmento são discutidas mais adiante nesta seção; para mais informações sobre `NoOfReplicas`, consulte a Seção 25.4.3.6, “Definindo Nodos de Dados do NDB Cluster”.

Nota

Todos os grupos de nós em um NDB Cluster devem ter o mesmo número de nós de dados.

Você pode adicionar novos grupos de nós (e, portanto, novos nós de dados) online a um NDB Cluster em execução; consulte a Seção 25.6.7, “Adicionar Nodos de Dados do NDB Cluster Online”, para obter mais informações.

**Partição.** Esta é uma parte dos dados armazenados pelo cluster. Cada nó é responsável por manter pelo menos uma cópia de quaisquer partições atribuídas a ele (ou seja, pelo menos uma replica de fragmento) disponível para o cluster.

O número de partições usado por padrão pelo NDB Cluster depende do número de nós de dados e do número de threads LDM em uso pelos nós de dados, conforme mostrado aqui:

```
[# of partitions] = [# of data nodes] * [# of LDM threads]
```

Ao usar nós de dados que executam **ndbmtd**"), o número de threads LDM é controlado pelo ajuste para `MaxNoOfExecutionThreads`. Ao usar **ndbd** há um único thread LDM, o que significa que há tantas partições do cluster quanto nós participam do cluster. Isso também é o caso ao usar **ndbmtd**") com `MaxNoOfExecutionThreads` definido como 3 ou menos. (Você deve estar ciente de que o número de threads LDM aumenta com o valor deste parâmetro, mas não de forma estritamente linear, e que há restrições adicionais para configurá-lo; consulte a descrição de `MaxNoOfExecutionThreads` para obter mais informações.)

**NDB e partição definida pelo usuário.** O NDB Cluster normalmente particiona as tabelas `NDBCLUSTER` automaticamente. No entanto, também é possível empregar partição definida pelo usuário com as tabelas `NDBCLUSTER`. Isso está sujeito às seguintes limitações:

1. Apenas os esquemas de partição `KEY` e `LINEAR KEY` são suportados em produção com tabelas `NDB`.

2. O número máximo de partições que podem ser definidas explicitamente para qualquer tabela `NDB` é `8 * [número de threads LDM] * [número de grupos de nós]`, sendo que o número de grupos de nós em um NDB Cluster é determinado conforme discutido anteriormente nesta seção. Ao executar o **ndbd** para processos de nós de dados, definir o número de threads LDM não tem efeito (já que o `ThreadConfig` se aplica apenas ao **ndbmtd")"); nesses casos, esse valor pode ser tratado como se fosse igual a 1 para fins de realização desse cálculo.

Consulte a Seção 25.5.3, “ndbmtd — O Daemon de Nó de Dados do NDB Cluster (Multi-Thread”)"), para obter mais informações.

Para obter mais informações relacionadas ao NDB Cluster e à partição definida pelo usuário, consulte a Seção 25.2.7, “Limitações Conhecidas do NDB Cluster” e a Seção 26.6.2, “Limitações de Partição Relacionadas aos Motores de Armazenamento”.

**Replica fragmentária.** Esta é uma cópia de uma partição do cluster. Cada nó em um grupo de nós armazena uma replica fragmentária. Também conhecida como replica de partição. O número de replicas fragmentárias é igual ao número de nós por grupo de nós.

Uma replica fragmentária pertence inteiramente a um único nó; um nó pode (e geralmente faz) armazenar várias replicas fragmentárias.

O diagrama a seguir ilustra um NDB Cluster com quatro nós de dados executando o **ndbd**, organizados em dois grupos de nós de dois nós cada; os nós 1 e 2 pertencem ao grupo de nós 0, e os nós 3 e 4 pertencem ao grupo de nós 1.

Nota

Apenas os nós de dados são mostrados aqui; embora um NDB Cluster funcional exija um processo **ndb_mgmd** para a gestão do cluster e pelo menos um nó SQL para acessar os dados armazenados pelo cluster, esses foram omitidos da figura para clareza.

**Figura 25.2 NDB Cluster com Dois Grupos de Nós**

![O conteúdo é descrito no texto ao redor.](images/fragment-replicas-groups-1-1.png)

Os dados armazenados pelo clúster são divididos em quatro partições, numeradas 0, 1, 2 e 3. Cada partição é armazenada — em múltiplas cópias — no mesmo grupo de nós. As partições são armazenadas em grupos de nós alternativos da seguinte forma:

* A partição 0 é armazenada no grupo de nós 0; uma replica de fragmento primário (cópia primária) é armazenada no nó 1, e uma replica de fragmento de backup (cópia de backup da partição) é armazenada no nó 2.

* A partição 1 é armazenada no outro grupo de nós (grupo de nós 1); a replica de fragmento primário desta partição está no nó 3, e sua replica de fragmento de backup está no nó 4.

* A partição 2 é armazenada no grupo de nós 0. No entanto, a colocação de suas duas réplicas de fragmento é invertida em relação à da Partição 0; para a Partição 2, a replica de fragmento primário está no nó 2, e a de backup no nó 1.

* A partição 3 é armazenada no grupo de nós 1, e a colocação de suas duas réplicas de fragmento é invertida em relação à da Partição 1. Ou seja, sua replica de fragmento primário está no nó 4, com a de backup no nó 3.

O que isso significa em relação ao funcionamento contínuo de um clúster NDB é o seguinte: enquanto cada grupo de nós participante do clúster tiver pelo menos um nó em operação, o clúster terá uma cópia completa de todos os dados e permanecerá viável. Isso é ilustrado no próximo diagrama.

**Figura 25.3 Nodos Requeridos para um Clúster NDB 2x2**

![O conteúdo é descrito no texto ao redor.](images/replicas-groups-1-2.png)

Neste exemplo, o clúster é composto por dois grupos de nós, cada um contendo dois nós de dados. Cada nó de dados está executando uma instância do **ndbd**. Qualquer combinação de pelo menos um nó do grupo de nós 0 e pelo menos um nó do grupo de nós 1 é suficiente para manter o clúster "vivo". No entanto, se ambos os nós de um único grupo de nós falharem, a combinação composta pelos dois nós restantes do outro grupo de nós não é suficiente. Nessa situação, o clúster perdeu uma partição inteira e, portanto, não pode mais fornecer acesso a um conjunto completo de todos os dados do NDB Cluster.

O número máximo de grupos de nós suportados para uma única instância do NDB Cluster é de 48.