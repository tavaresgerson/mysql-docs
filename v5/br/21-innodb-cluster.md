# Capítulo 20 InnoDB Cluster

Este capítulo apresenta o MySQL InnoDB Cluster, que combina tecnologias MySQL para permitir que você implante e administre uma solução completa e integrada de *high availability* (alta disponibilidade) para MySQL. Este conteúdo é uma visão geral de alto nível do InnoDB Cluster; para a documentação completa, consulte MySQL InnoDB Cluster.

Importante

O InnoDB Cluster não oferece suporte para o MySQL NDB Cluster. Para mais informações sobre o MySQL NDB Cluster, consulte Capítulo 21, *MySQL NDB Cluster 7.5 e NDB Cluster 7.6* e Seção 21.2.6, “MySQL Server Usando InnoDB Comparado com NDB Cluster”.

Um InnoDB Cluster consiste em pelo menos três instâncias do MySQL Server e oferece recursos de *high-availability* e *scaling* (escalabilidade). O InnoDB Cluster utiliza as seguintes tecnologias MySQL:

* MySQL Shell, que é um cliente avançado e editor de código para MySQL.

* MySQL Server e Group Replication, que permite que um conjunto de instâncias MySQL forneça *high-availability*. O InnoDB Cluster oferece uma maneira programática alternativa e fácil de usar para trabalhar com Group Replication.

* MySQL Router, um *middleware* leve que fornece *routing* transparente entre sua aplicação e o InnoDB Cluster.

O diagrama a seguir mostra uma visão geral de como essas tecnologias trabalham em conjunto:

**Figura 20.1 Visão geral do InnoDB Cluster**

![Três servidores MySQL são agrupados como um cluster de high availability. Um dos servidores é a instância primary de leitura/escrita (read/write), e as outras duas são instâncias secondary somente leitura (read-only). O Group Replication é usado para replicar dados da instância primary para as instâncias secondary. O MySQL Router conecta as aplicações cliente (neste exemplo, um MySQL Connector) à instância primary.](images/innodb_cluster_overview.png)

Por ser construído sobre o MySQL Group Replication, ele fornece recursos como gerenciamento automático de membros, tolerância a falhas (*fault tolerance*), *failover* automático, e assim por diante. Um InnoDB Cluster geralmente opera em modo *single-primary*, com uma instância *primary* (leitura/escrita) e múltiplas instâncias *secondary* (somente leitura). Usuários avançados também podem se beneficiar de um modo *multi-primary*, onde todas as instâncias são *primaries*.

Você trabalha com o InnoDB Cluster usando a AdminAPI, fornecida como parte do MySQL Shell. A AdminAPI está disponível em JavaScript e Python, e é adequada para *scripting* e *automation* de *deployments* (implantações) do MySQL para alcançar *high-availability* e escalabilidade. Ao usar a AdminAPI do MySQL Shell, você evita a necessidade de configurar muitas instâncias manualmente. Em vez disso, a AdminAPI oferece uma interface moderna e eficaz para conjuntos de instâncias MySQL, permitindo que você faça o *provision*, administre e *monitor* sua implantação a partir de uma ferramenta central.

Para começar a usar o InnoDB Cluster, você precisa baixar e instalar o MySQL Shell. Você precisará de alguns *hosts* com instâncias do MySQL Server instaladas, e também pode instalar o MySQL Router.

O InnoDB Cluster suporta o MySQL Clone, o que permite que você faça o *provision* de instâncias de forma simples. Anteriormente, para fazer o *provision* de uma nova instância antes que ela se juntasse a um conjunto de instâncias MySQL, você precisaria de alguma forma transferir manualmente as *transactions* para a instância que estava entrando. Isso poderia envolver fazer cópias de arquivos, copiá-los manualmente, e assim por diante. Usando o InnoDB Cluster, você pode simplesmente adicionar uma instância ao *cluster* e ela é automaticamente provisionada.

Similarmente, o InnoDB Cluster é estritamente integrado ao MySQL Router, e você pode usar a AdminAPI para trabalhar com eles em conjunto. O MySQL Router pode se configurar automaticamente com base em um InnoDB Cluster, em um processo chamado *bootstrapping*, o que elimina a necessidade de configurar o *routing* manualmente. O MySQL Router então conecta aplicações cliente de forma transparente ao InnoDB Cluster, fornecendo *routing* e *load-balancing* para as conexões cliente. Essa integração também permite que você administre alguns aspectos de um MySQL Router configurado via *bootstrap* em um InnoDB Cluster usando a AdminAPI. As informações de *status* do InnoDB Cluster incluem detalhes sobre os MySQL Routers configurados via *bootstrap* no *cluster*. As operações permitem que você crie usuários do MySQL Router no nível do *cluster*, trabalhe com os MySQL Routers configurados via *bootstrap* no *cluster*, e assim por diante.

A AdminAPI é compatível com instâncias rodando MySQL 5.7, mas com um *feature set* (conjunto de recursos) reduzido. Para mais informações, consulte Usando Instâncias Rodando MySQL 5.7. Para a melhor experiência usando a AdminAPI e o InnoDB Cluster, faça o *upgrade* para o MySQL 8.0.

Para mais informações sobre essas tecnologias, consulte a documentação do usuário vinculada nas descrições. Além desta documentação do usuário, há documentação do desenvolvedor para todos os métodos da AdminAPI no MySQL Shell JavaScript API Reference ou MySQL Shell Python API Reference, disponível em Connectors and APIs.
