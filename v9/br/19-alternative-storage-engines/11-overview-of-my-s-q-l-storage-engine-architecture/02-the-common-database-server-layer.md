### 18.11.1 A Camada de Servidor de Banco de Dados Comum

O mecanismo de armazenamento escalável MySQL é o componente no servidor de banco de dados MySQL responsável por realizar as operações de E/S de dados reais para um banco de dados, além de habilitar e impor conjuntos de recursos específicos que visam uma necessidade de aplicação específica. Um dos principais benefícios de usar mecanismos de armazenamento específicos é que você recebe apenas os recursos necessários para uma aplicação particular, e, portanto, tem menos sobrecarga do sistema no banco de dados, com o resultado final sendo mais eficiente e com um desempenho do banco de dados maior. Esta é uma das razões pelas quais o MySQL sempre foi conhecido por ter um desempenho tão alto, igualando ou superando bancos de dados monolíticos proprietários em benchmarks padrão da indústria.

Do ponto de vista técnico, quais são alguns dos componentes de infraestrutura de suporte únicos que estão em um mecanismo de armazenamento? Algumas das principais diferenças de recursos incluem:

* *Concorrência*: Algumas aplicações têm requisitos de bloqueio mais granulares (como bloqueios de nível de linha) do que outras. Escolher a estratégia de bloqueio certa pode reduzir a sobrecarga e, portanto, melhorar o desempenho geral. Esta área também inclui suporte para capacidades como controle de concorrência de múltiplas versões ou leitura de "instantâneos".

* *Suporte a Transações*: Nem todas as aplicações precisam de transações, mas para aquelas que precisam, há requisitos muito bem definidos, como conformidade ACID e mais.

* *Integridade Referencial*: A necessidade de o servidor impor a integridade referencial de bancos de dados relacionais através de chaves estrangeiras definidas por DDL.

* *Armazenamento Físico*: Isso envolve tudo, desde o tamanho geral da página para tabelas e índices, até o formato usado para armazenar dados no disco físico.

* *Suporte a Índices*: Diferentes cenários de aplicação tendem a se beneficiar de diferentes estratégias de índice. Cada mecanismo de armazenamento geralmente tem seus próprios métodos de indexação, embora alguns (como índices de árvore B) sejam comuns a quase todos os mecanismos.

* *Caches de Memória*: Diferentes aplicações respondem melhor a algumas estratégias de cache de memória do que a outras, portanto, embora alguns caches de memória sejam comuns a todos os mecanismos de armazenamento (como os usados para conexões de usuário), outros são definidos de forma única apenas quando um determinado mecanismo de armazenamento é colocado em ação.

* *Ajudas de Desempenho*: Isso inclui múltiplos threads de E/S para operações paralelas, concorrência de threads, verificação de ponto de controle de banco de dados, manipulação de inserção em massa e mais.

* *Recursos de Alvo Diversos*: Isso pode incluir suporte para operações geográficas, restrições de segurança para certas operações de manipulação de dados e outras características semelhantes.

Cada conjunto de componentes da infraestrutura de mecanismo de armazenamento plugável é projetado para oferecer um conjunto seletivo de benefícios para uma aplicação particular. Por outro lado, evitar um conjunto de recursos de componentes ajuda a reduzir o overhead desnecessário. É lógico que entender o conjunto de requisitos de uma aplicação particular e selecionar o motor de armazenamento MySQL adequado pode ter um impacto dramático na eficiência e desempenho do sistema como um todo.