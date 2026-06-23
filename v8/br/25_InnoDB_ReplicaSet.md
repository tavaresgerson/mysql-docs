# Capítulo 24 InnoDB ReplicaSet

Este capítulo apresenta o MySQL InnoDB ReplicaSet, que combina as tecnologias do MySQL para permitir que você implante e administre o Capítulo 19, *Replicação*. Este conteúdo é uma visão geral de alto nível do InnoDB ReplicaSet, para obter documentação completa, consulte MySQL InnoDB ReplicaSet.

Um InnoDB ReplicaSet é composto por pelo menos duas instâncias do MySQL Server e oferece todos os recursos de replicação do MySQL que você conhece, como escala de leitura e segurança de dados. O InnoDB ReplicaSet utiliza as seguintes tecnologias do MySQL:

* MySQL Shell, que é um cliente e editor de código avançado para MySQL.

* MySQL Server e o Capítulo 19, *Replicação*, que permite que um conjunto de instâncias do MySQL forneça disponibilidade e escalabilidade de leitura assíncrona. O InnoDB ReplicaSet oferece uma maneira alternativa, fácil de usar, para trabalhar com Replicação.

* MySQL Router, um middleware leve que oferece roteamento transparente entre sua aplicação e o InnoDB ReplicaSet.

A interface de um InnoDB ReplicaSet é semelhante à do MySQL InnoDB Cluster. Você usa o MySQL Shell para trabalhar com instâncias do MySQL Server como um ReplicaSet, e o MySQL Router também é integrado de forma estreita, da mesma maneira que o InnoDB Cluster.

Baseado em MySQL Replication, um InnoDB ReplicaSet tem um único primário, que se replica em uma ou mais instâncias secundárias. Um InnoDB ReplicaSet não oferece todas as funcionalidades que o InnoDB Cluster oferece, como falha automática ou modo multi-primário. Mas, ele suporta funcionalidades como configurar, adicionar e remover instâncias de maneira semelhante. Você pode alternar manualmente ou falhar para uma instância secundária, por exemplo, em caso de falha. Você pode até adotar uma implantação de Replicação existente e depois administrá-la como um InnoDB ReplicaSet.

Você trabalha com o InnoDB ReplicaSet usando o AdminAPI, fornecido como parte do MySQL Shell. O AdminAPI está disponível em JavaScript e Python, e é bem adequado para script e automação de implantações do MySQL para alcançar alta disponibilidade e escalabilidade. Ao usar o AdminAPI do MySQL Shell, você pode evitar a necessidade de configurar muitas instâncias manualmente. Em vez disso, o AdminAPI fornece uma interface moderna eficaz para conjuntos de instâncias do MySQL e permite que você provista, administre e monitore sua implantação a partir de uma ferramenta central.

Para começar com o InnoDB ReplicaSet, você precisa [baixar][(https://dev.mysql.com/downloads/shell/)] e instalar o MySQL Shell. Você precisa de alguns hosts com instâncias do MySQL Server instaladas, e também pode instalar o MySQL Router.

O InnoDB ReplicaSet suporta [MySQL Clone][(clone-plugin.html "7.6.7 The Clone Plugin")], o que permite provisionar instâncias de forma simples. No passado, para provisionar uma nova instância antes que ela se juntasse a uma implantação de Replicação MySQL, você precisava, de alguma forma, transferir manualmente as transações para a instância que se juntava. Isso poderia envolver fazer cópias de arquivos, copiá-los manualmente, e assim por diante. Você pode simplesmente adicionar uma instância ao conjunto de réplicas e ela é automaticamente provisionada.

Da mesma forma, o InnoDB ReplicaSet é integrado de forma estreita com o MySQL Router, e você pode usar o AdminAPI para trabalhar com eles juntos. O MySQL Router pode se configurar automaticamente com base em um InnoDB ReplicaSet, em um processo chamado bootstrapping, o que elimina a necessidade de você configurar o roteamento manualmente. O MySQL Router, em seguida, conecta de forma transparente as aplicações cliente ao InnoDB ReplicaSet, fornecendo roteamento e balanceamento de carga para as conexões do cliente. Essa integração também permite que você administre alguns aspectos de um MySQL Router bootstrapped contra um InnoDB ReplicaSet usando o AdminAPI. As informações de status do InnoDB ReplicaSet incluem detalhes sobre os MySQL Routers bootstrapped contra o ReplicaSet. As operações permitem que você crie usuários do MySQL Router no nível do ReplicaSet, para trabalhar com os MySQL Routers bootstrapped contra o ReplicaSet, e assim por diante.

Para mais informações sobre essas tecnologias, consulte a documentação do usuário vinculada nas descrições. Além dessa documentação do usuário, há documentação para desenvolvedores sobre todos os métodos da AdminAPI na Referência da API JavaScript do MySQL Shell ou na Referência da API Python do MySQL Shell, disponíveis nos Conectivos e APIs.