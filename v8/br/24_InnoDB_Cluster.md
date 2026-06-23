# Capítulo 23 InnoDB Cluster

Este capítulo apresenta o MySQL InnoDB Cluster, que combina as tecnologias do MySQL para permitir que você implante e administre uma solução completa de alta disponibilidade integrada para o MySQL. Este conteúdo é uma visão geral de alto nível do InnoDB Cluster, para documentação completa, consulte MySQL InnoDB Cluster.

Importante

O InnoDB Cluster não oferece suporte para o MySQL NDB Cluster. Para mais informações sobre o MySQL NDB Cluster, consulte o Capítulo 25, *MySQL NDB Cluster 8.0* e a Seção 25.2.6, “MySQL Server Usando InnoDB Comparado com NDB Cluster”.

Um InnoDB Cluster é composto por pelo menos três instâncias do Servidor MySQL e oferece recursos de alta disponibilidade e escalabilidade. O InnoDB Cluster utiliza as seguintes tecnologias do MySQL:

* MySQL Shell, que é um cliente e editor de código avançado para MySQL.

* O MySQL Server e o Grupo de Replicação, que permite que um conjunto de instâncias do MySQL forneça alta disponibilidade. O InnoDB Cluster oferece uma maneira alternativa e fácil de usar para trabalhar com o Grupo de Replicação.

* MySQL Router, um middleware leve que oferece roteamento transparente entre sua aplicação e o InnoDB Cluster.

O diagrama a seguir mostra uma visão geral de como essas tecnologias trabalham juntas:

**Figura 23.1 Visão geral do clúster InnoDB**

![Three MySQL servers are grouped together as a high availability cluster. One of the servers is the read/write primary instance, and the other two are read-only secondary instances. Group Replication is used to replicate data from the primary instance to the secondary instances. MySQL Router connects client applications (in this example, a MySQL Connector) to the primary instance.](images/innodb_cluster_overview.png)

Construído sobre a Replicação do Grupo MySQL, oferece recursos como gerenciamento automático de membros, tolerância a falhas, failover automático, entre outros. Um InnoDB Cluster geralmente funciona em modo único-primário, com uma instância primária (leitura e escrita) e múltiplas instâncias secundárias (somente leitura). Usuários avançados também podem aproveitar um modo multi-primário, onde todas as instâncias são primárias. Você pode até mudar a topologia do cluster enquanto o InnoDB Cluster está online, para garantir a maior disponibilidade possível.

Você trabalha com o InnoDB Cluster usando o AdminAPI, fornecido como parte do MySQL Shell. O AdminAPI está disponível em JavaScript e Python, e é bem adequado para script e automação de implantações do MySQL para alcançar alta disponibilidade e escalabilidade. Ao usar o AdminAPI do MySQL Shell, você pode evitar a necessidade de configurar muitas instâncias manualmente. Em vez disso, o AdminAPI fornece uma interface moderna eficaz para conjuntos de instâncias do MySQL e permite que você provista, administre e monitore sua implantação a partir de uma ferramenta central.

Para começar com o InnoDB Cluster, você precisa [baixar][(https://dev.mysql.com/downloads/shell/)] e instalar o MySQL Shell. Você precisa de alguns hosts com instâncias do MySQL Server instaladas, e também pode instalar o MySQL Router.

O InnoDB Cluster suporta o MySQL Clone, o que permite que você disponibilize instâncias de forma simples. No passado, para disponibilizar uma nova instância antes que ela se junte a um conjunto de instâncias MySQL, você precisava, de alguma forma, transferir manualmente as transações para a instância que está se juntando. Isso poderia envolver fazer cópias de arquivos, copiá-los manualmente, e assim por diante. Usando o InnoDB Cluster, você pode simplesmente adicionar uma instância ao cluster e ela é automaticamente disponibilizada.

Da mesma forma, o InnoDB Cluster está intimamente integrado ao MySQL Router, e você pode usar o AdminAPI para trabalhar com eles juntos. O MySQL Router pode se configurar automaticamente com base em um InnoDB Cluster, em um processo chamado bootstrapping, o que elimina a necessidade de você configurar o roteamento manualmente. O MySQL Router, em seguida, conecta de forma transparente as aplicações cliente ao InnoDB Cluster, fornecendo roteamento e balanceamento de carga para as conexões do cliente. Essa integração também permite que você administre alguns aspectos de um MySQL Router bootstrapped contra um InnoDB Cluster usando o AdminAPI. As informações de status do InnoDB Cluster incluem detalhes sobre os MySQL Routers bootstrapped contra o cluster. As operações permitem que você crie usuários do MySQL Router no nível do cluster, para trabalhar com os MySQL Routers bootstrapped contra o cluster, e assim por diante.

Para mais informações sobre essas tecnologias, consulte a documentação do usuário vinculada nas descrições. Além dessa documentação do usuário, há documentação para desenvolvedores sobre todos os métodos da AdminAPI na Referência da API JavaScript do MySQL Shell ou na Referência da API Python do MySQL Shell, disponíveis nos Conectivos e APIs.