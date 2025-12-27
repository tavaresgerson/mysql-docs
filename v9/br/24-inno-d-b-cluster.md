# Capítulo 23 InnoDB Cluster

Este capítulo apresenta o InnoDB Cluster do MySQL, que combina as tecnologias do MySQL para permitir que você implante e administre uma solução completa e integrada de alta disponibilidade para o MySQL. Este conteúdo é uma visão geral de alto nível do InnoDB Cluster, para obter documentação completa, consulte MySQL InnoDB Cluster.

Importante

O InnoDB Cluster não oferece suporte para o MySQL NDB Cluster. Para obter mais informações sobre o MySQL NDB Cluster, consulte o Capítulo 25, *MySQL NDB Cluster 9.5* e a Seção 25.2.6, “MySQL Server Usando InnoDB Comparado com NDB Cluster”.

Um InnoDB Cluster consiste em pelo menos três instâncias do MySQL Server e oferece recursos de alta disponibilidade e escalabilidade. O InnoDB Cluster utiliza as seguintes tecnologias do MySQL:

* MySQL Shell, que é um cliente e editor de código avançado para o MySQL.

* MySQL Server e Grupo de Replicação, que permite que um conjunto de instâncias do MySQL forneça alta disponibilidade. O InnoDB Cluster oferece uma maneira programática e fácil de usar de trabalhar com o Grupo de Replicação.

* MySQL Router, um middleware leve que fornece roteamento transparente entre sua aplicação e o InnoDB Cluster.

O diagrama a seguir mostra uma visão geral de como essas tecnologias trabalham juntas:

**Figura 23.1 Visão geral do InnoDB Cluster**

![Três servidores MySQL estão agrupados como um cluster de alta disponibilidade. Um dos servidores é a instância primária de leitura/escrita, e os outros dois são instâncias secundárias de leitura-only. O Grupo de Replicação é usado para replicar dados da instância primária para as instâncias secundárias. O MySQL Router conecta aplicações cliente (neste exemplo, um Conector MySQL) à instância primária.](images/innodb_cluster_overview.png)

Construído sobre a Replicação em Grupo do MySQL, oferece recursos como gerenciamento automático de membros, tolerância a falhas, failover automático, entre outros. Um Clúster InnoDB geralmente funciona em modo único-primário, com uma única instância primária (leitura/escrita) e múltiplas instâncias secundárias (somente leitura). Usuários avançados também podem aproveitar um modo multi-primário, onde todas as instâncias são primárias. Você pode até alterar a topologia do clúster enquanto o InnoDB Cluster estiver online, para garantir a maior disponibilidade possível.

Você trabalha com o InnoDB Cluster usando a AdminAPI, fornecida como parte do MySQL Shell. A AdminAPI está disponível em JavaScript e Python, e é adequada para scripts e automação de implantações do MySQL para alcançar alta disponibilidade e escalabilidade. Ao usar a AdminAPI do MySQL Shell, você pode evitar a necessidade de configurar muitas instâncias manualmente. Em vez disso, a AdminAPI fornece uma interface moderna eficaz para conjuntos de instâncias MySQL e permite que você provisione, administre e monitore sua implantação a partir de uma ferramenta central.

Para começar com o InnoDB Cluster, você precisa [baixar](https://dev.mysql.com/downloads/shell/) e instalar o MySQL Shell. Você precisa de alguns hosts com instâncias do MySQL Server instaladas, e você também pode instalar o MySQL Router.

O InnoDB Cluster suporta o MySQL Clone, que permite provisionar instâncias de forma simples. No passado, para provisionar uma nova instância antes que ela se junte a um conjunto de instâncias MySQL, você precisaria de alguma forma transferir manualmente as transações para a instância que está se juntando. Isso poderia envolver fazer cópias de arquivos, copiá-los manualmente, e assim por diante. Usando o InnoDB Cluster, você pode simplesmente adicionar uma instância ao clúster e ela é provisionada automaticamente.

Da mesma forma, o InnoDB Cluster está intimamente integrado ao MySQL Router, e você pode usar o AdminAPI para trabalhar com eles juntos. O MySQL Router pode se configurar automaticamente com base em um InnoDB Cluster, em um processo chamado bootstrapping, o que elimina a necessidade de você configurar o roteamento manualmente. O MySQL Router então conecta de forma transparente as aplicações cliente ao InnoDB Cluster, fornecendo roteamento e balanceamento de carga para as conexões do cliente. Essa integração também permite que você administre alguns aspectos de um MySQL Router bootstrapped contra um InnoDB Cluster usando o AdminAPI. As informações de status do InnoDB Cluster incluem detalhes sobre os MySQL Routers bootstrapped contra o cluster. As operações permitem que você crie usuários do MySQL Router no nível do cluster, trabalhe com os MySQL Routers bootstrapped contra o cluster, e assim por diante.

Para obter mais informações sobre essas tecnologias, consulte a documentação do usuário vinculada nas descrições. Além dessa documentação do usuário, há documentação para desenvolvedores para todos os métodos do AdminAPI na Referência da API JavaScript do MySQL Shell ou na Referência da API Python do MySQL Shell, disponíveis nos Conectores e APIs.