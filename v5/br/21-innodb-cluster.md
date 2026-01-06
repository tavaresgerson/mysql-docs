# Capítulo 20: Cluster InnoDB

Este capítulo apresenta o MySQL InnoDB Cluster, que combina as tecnologias do MySQL para permitir que você implante e administre uma solução completa de alta disponibilidade integrada para o MySQL. Este conteúdo é uma visão geral de alto nível do InnoDB Cluster, para obter documentação completa, consulte MySQL InnoDB Cluster.

Importante

O InnoDB Cluster não oferece suporte para o MySQL NDB Cluster. Para obter mais informações sobre o MySQL NDB Cluster, consulte o Capítulo 21, *MySQL NDB Cluster 7.5 e NDB Cluster 7.6* e a Seção 21.2.6, “MySQL Server Usando InnoDB Comparado com NDB Cluster”.

Um clúster InnoDB é composto por pelo menos três instâncias do Servidor MySQL e oferece recursos de alta disponibilidade e escalabilidade. O InnoDB Cluster utiliza as seguintes tecnologias do MySQL:

- MySQL Shell, que é um cliente e editor de código avançado para MySQL.

- O MySQL Server e o Grupo de Replicação permitem que um conjunto de instâncias do MySQL ofereça alta disponibilidade. O InnoDB Cluster fornece uma maneira alternativa e fácil de usar para trabalhar com o Grupo de Replicação.

- MySQL Router, um middleware leve que oferece roteamento transparente entre sua aplicação e o InnoDB Cluster.

O diagrama a seguir mostra uma visão geral de como essas tecnologias trabalham juntas:

**Figura 20.1 Visão geral do clúster InnoDB**

![Três servidores MySQL estão agrupados em um cluster de alta disponibilidade. Um dos servidores é a instância primária de leitura/escrita, e os outros dois são instâncias secundárias de leitura apenas. A Replicação em Grupo é usada para replicar dados da instância primária para as instâncias secundárias. O MySQL Router conecta as aplicações cliente (neste exemplo, um Conector MySQL) à instância primária.](images/innodb_cluster_overview.png)

Construído sobre o MySQL Group Replication, oferece recursos como gerenciamento automático de membros, tolerância a falhas, failover automático, entre outros. Um clúster InnoDB geralmente funciona em modo único-primário, com uma única instância primária (leitura/escrita) e múltiplas instâncias secundárias (somente leitura). Usuários avançados também podem aproveitar um modo multi-primário, onde todas as instâncias são primárias.

Você trabalha com o Cluster InnoDB usando o AdminAPI, fornecido como parte do MySQL Shell. O AdminAPI está disponível em JavaScript e Python, e é muito adequado para scripts e automação de implantações do MySQL para alcançar alta disponibilidade e escalabilidade. Ao usar o AdminAPI do MySQL Shell, você pode evitar a necessidade de configurar muitas instâncias manualmente. Em vez disso, o AdminAPI fornece uma interface moderna eficaz para conjuntos de instâncias do MySQL e permite que você provisione, administre e monitore sua implantação a partir de uma ferramenta central.

Para começar com o InnoDB Cluster, você precisa baixar e instalar o MySQL Shell. Você precisa de alguns hosts com instâncias do MySQL Server instaladas e também pode instalar o MySQL Router.

O InnoDB Cluster suporta o MySQL Clone, que permite que você crie instâncias de forma simples. No passado, para criar uma nova instância antes que ela se junte a um conjunto de instâncias MySQL, você precisava, de alguma forma, transferir as transações manualmente para a instância que estava se juntando. Isso poderia envolver fazer cópias de arquivos, copiá-los manualmente, e assim por diante. Usando o InnoDB Cluster, você pode simplesmente adicionar uma instância ao cluster e ela será automaticamente provisionada.

Da mesma forma, o InnoDB Cluster está intimamente integrado ao MySQL Router, e você pode usar o AdminAPI para trabalhar com eles juntos. O MySQL Router pode se configurar automaticamente com base em um InnoDB Cluster, em um processo chamado bootstrapping, o que elimina a necessidade de você configurar o roteamento manualmente. O MySQL Router então conecta de forma transparente as aplicações cliente ao InnoDB Cluster, fornecendo roteamento e balanceamento de carga para as conexões do cliente. Essa integração também permite que você administre alguns aspectos de um MySQL Router bootstrapped contra um InnoDB Cluster usando o AdminAPI. As informações de status do InnoDB Cluster incluem detalhes sobre os MySQL Routers bootstrapped contra o cluster. As operações permitem que você crie usuários do MySQL Router no nível do cluster, trabalhe com os MySQL Routers bootstrapped contra o cluster, e assim por diante.

O AdminAPI é compatível com instâncias que executam o MySQL 5.7, mas com um conjunto de recursos reduzido. Para obter mais informações, consulte o uso de instâncias que executam o MySQL 5.7. Para obter a melhor experiência ao usar o AdminAPI e o InnoDB Cluster, faça o upgrade para o MySQL 8.0.

Para obter mais informações sobre essas tecnologias, consulte a documentação do usuário vinculada nas descrições. Além dessa documentação do usuário, há documentação para desenvolvedores sobre todos os métodos da AdminAPI na Referência da API JavaScript do MySQL Shell ou na Referência da API Python do MySQL Shell, disponíveis nos Conectores e APIs.
