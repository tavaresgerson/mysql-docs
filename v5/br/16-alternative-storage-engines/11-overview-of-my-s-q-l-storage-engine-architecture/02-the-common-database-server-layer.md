### 15.11.1 Camada do Servidor de Banco de Dados Comum

Um motor de armazenamento plugável do MySQL é o componente no servidor de banco de dados MySQL responsável por realizar as operações de E/S de dados reais para um banco de dados, além de habilitar e impor determinados conjuntos de recursos que visam uma necessidade específica de uma aplicação. Um grande benefício de usar motores de armazenamento específicos é que você recebe apenas os recursos necessários para uma aplicação específica, e, portanto, tem menos sobrecarga no sistema no banco de dados, com o resultado final sendo mais eficiente e com um desempenho maior do banco de dados. Esta é uma das razões pelas quais o MySQL sempre foi conhecido por ter um desempenho tão alto, igualando ou superando bancos de dados monolíticos proprietários em benchmarks padrão da indústria.

Do ponto de vista técnico, quais são alguns dos componentes de infraestrutura de suporte únicos que estão em um motor de armazenamento? Algumas das principais diferenças de recursos incluem:

- *Concorrência*: Algumas aplicações têm requisitos de bloqueio mais detalhados (como bloqueios em nível de linha) do que outras. Escolher a estratégia de bloqueio certa pode reduzir o overhead e, portanto, melhorar o desempenho geral. Esta área também inclui suporte para capacidades como controle de concorrência de múltiplas versões ou leitura de "instantâneos".

- *Suporte a Transações*: Nem todas as aplicações precisam de transações, mas para aquelas que precisam, existem requisitos bem definidos, como a conformidade ACID e muito mais.

- *Integridade Referencial*: A necessidade de o servidor impor a integridade referencial do banco de dados relacional por meio de chaves estrangeiras definidas pelo DDL.

- *Armazenamento físico*: Isso inclui tudo, desde o tamanho geral da página para tabelas e índices, até o formato usado para armazenar dados no disco físico.

- *Suporte a índices*: Diferentes cenários de aplicação tendem a se beneficiar de diferentes estratégias de índice. Cada mecanismo de armazenamento geralmente tem seus próprios métodos de indexação, embora alguns (como índices de árvore B) sejam comuns a quase todos os mecanismos.

- *Caches de memória*: Diferentes aplicativos respondem melhor a algumas estratégias de cache de memória do que a outras, portanto, embora alguns caches de memória sejam comuns a todos os motores de armazenamento (como os usados para conexões de usuário ou o cache de consultas de alta velocidade do MySQL), outros são definidos de forma única apenas quando um motor de armazenamento específico é utilizado.

- *Ajudas de desempenho*: Isso inclui múltiplas threads de E/S para operações paralelas, concorrência de threads, verificação de ponto de controle de banco de dados, manipulação de inserção em massa e muito mais.

- *Recursos do alvo diversos*: Isso pode incluir suporte para operações geográficas, restrições de segurança para certas operações de manipulação de dados e outros recursos semelhantes.

Cada conjunto de componentes da infraestrutura do motor de armazenamento plugável é projetado para oferecer um conjunto seletivo de benefícios para uma aplicação específica. Por outro lado, evitar um conjunto de recursos dos componentes ajuda a reduzir o overhead desnecessário. É lógico que entender o conjunto de requisitos de uma aplicação específica e selecionar o motor de armazenamento MySQL adequado pode ter um impacto significativo na eficiência e no desempenho do sistema como um todo.
