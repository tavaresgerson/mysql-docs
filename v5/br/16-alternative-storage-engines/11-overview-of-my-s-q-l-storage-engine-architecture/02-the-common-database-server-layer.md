### 15.11.2 A Camada Comum do Servidor de Database

Um *pluggable storage engine* (motor de armazenamento plugável) do MySQL é o componente no servidor de Database MySQL responsável por realizar as operações reais de I/O de dados para um Database, bem como habilitar e impor certos conjuntos de recursos voltados para uma necessidade específica de aplicação. Um grande benefício de usar *storage engines* específicos é que você recebe apenas os recursos necessários para uma aplicação em particular e, portanto, há menos *overhead* de sistema no Database, resultando em maior eficiência e melhor performance do Database. Esta é uma das razões pelas quais o MySQL sempre foi conhecido por ter uma performance tão alta, igualando ou superando Databases monolíticos proprietários em *benchmarks* padrão da indústria.

De uma perspectiva técnica, quais são alguns dos componentes exclusivos de infraestrutura de suporte que estão em um *storage engine*? Algumas das principais diferenciações de recursos incluem:

* *Concurrency* (Concorrência): Algumas aplicações têm requisitos de *lock* mais granulares (como *row-level locks*) do que outras. Escolher a estratégia de *locking* correta pode reduzir o *overhead* e, portanto, melhorar a performance geral. Esta área também inclui suporte para recursos como controle de concorrência multiversão (*multi-version concurrency control*) ou leitura de "snapshot".

* *Transaction Support* (Suporte a Transação): Nem toda aplicação precisa de transações, mas para aquelas que precisam, existem requisitos muito bem definidos, como conformidade com ACID e mais.

* *Referential Integrity* (Integridade Referencial): A necessidade de o servidor impor a integridade referencial de *database* relacional através de *foreign keys* definidas por DDL.

* *Physical Storage* (Armazenamento Físico): Isso envolve desde o tamanho geral da *page* para *tables* e *indexes* até o formato usado para armazenar dados no disco físico.

* *Index Support* (Suporte a Index): Diferentes cenários de aplicação tendem a se beneficiar de diferentes estratégias de *index*. Cada *storage engine* geralmente tem seus próprios métodos de indexação, embora alguns (*B-tree indexes*, por exemplo) sejam comuns a quase todos os *engines*.

* *Memory Caches* (Caches de Memória): Diferentes aplicações respondem melhor a certas estratégias de *caching* de memória do que a outras, então, embora alguns *memory caches* sejam comuns a todos os *storage engines* (como aqueles usados para conexões de usuário ou o *Query Cache* de alta velocidade do MySQL), outros são definidos de forma exclusiva apenas quando um *storage engine* específico está em uso.

* *Performance Aids* (Auxílios de Performance): Isso inclui múltiplos *I/O threads* para operações paralelas, *thread concurrency*, *database checkpointing*, manipulação de *bulk insert*, e mais.

* *Miscellaneous Target Features* (Recursos Alvo Diversos): Isso pode incluir suporte para operações geoespaciais, restrições de segurança para certas operações de manipulação de dados e outros recursos semelhantes.

Cada conjunto de componentes da infraestrutura do *pluggable storage engine* é projetado para oferecer um conjunto seletivo de benefícios para uma aplicação específica. Por outro lado, evitar um conjunto de recursos de componentes ajuda a reduzir o *overhead* desnecessário. É razoável concluir que compreender o conjunto de requisitos de uma aplicação específica e selecionar o *storage engine* MySQL apropriado pode ter um impacto dramático na eficiência e performance geral do sistema.