## 8.1 Visão Geral da Otimização

O desempenho do Database depende de vários fatores no nível do Database, como Tables, Queries e configurações. Essas construções de software resultam em operações de CPU e I/O no nível do hardware, as quais você deve minimizar e tornar o mais eficientes possível. Ao trabalhar no desempenho do Database, você começa aprendendo as regras e diretrizes de alto nível para o lado do software e medindo o desempenho usando o tempo de relógio (wall-clock time). À medida que você se torna um especialista, aprende mais sobre o que acontece internamente e começa a medir itens como ciclos de CPU e operações de I/O.

Usuários típicos buscam obter o melhor desempenho do Database com suas configurações existentes de software e hardware. Usuários avançados procuram oportunidades para melhorar o próprio software MySQL ou desenvolver seus próprios Storage Engines e appliances de hardware para expandir o ecossistema MySQL.

* Otimizando no Nível do Database
* Otimizando no Nível do Hardware
* Equilibrando Portabilidade e Desempenho

### Otimizando no Nível do Database

O fator mais importante para tornar um aplicativo de Database rápido é seu design básico:

* As Tables estão estruturadas corretamente? Em particular, as Columns têm os tipos de dados (data types) certos, e cada Table tem as Columns apropriadas para o tipo de trabalho? Por exemplo, aplicações que realizam atualizações frequentes geralmente têm muitas Tables com poucas Columns, enquanto aplicações que analisam grandes quantidades de dados geralmente têm poucas Tables com muitas Columns.

* Os Indexes corretos estão implementados para tornar as Queries eficientes?

* Você está usando o Storage Engine apropriado para cada Table e aproveitando os pontos fortes e recursos de cada Storage Engine que utiliza? Em particular, a escolha de um Storage Engine transacional como `InnoDB` ou de um não transacional como `MyISAM` pode ser muito importante para o desempenho e a escalabilidade.

  Nota

  `InnoDB` é o Storage Engine padrão para novas Tables. Na prática, os recursos avançados de desempenho do `InnoDB` significam que as Tables `InnoDB` frequentemente superam o desempenho das Tables `MyISAM` mais simples, especialmente para um Database movimentado.

* Cada Table utiliza um formato de linha (row format) apropriado? Essa escolha também depende do Storage Engine usado para a Table. Em particular, Tables compactadas usam menos espaço em disco e, portanto, exigem menos I/O de disco para ler e gravar os dados. A compactação está disponível para todos os tipos de cargas de trabalho (workloads) com Tables `InnoDB`, e para Tables `MyISAM` somente leitura.

* A aplicação usa uma estratégia de Locking apropriada? Por exemplo, permitindo acesso compartilhado sempre que possível para que as operações do Database possam ser executadas simultaneamente (concurrently), e solicitando acesso exclusivo quando apropriado para que operações críticas recebam prioridade máxima. Novamente, a escolha do Storage Engine é significativa. O Storage Engine `InnoDB` lida com a maioria dos problemas de Locking sem sua intervenção, permitindo melhor concorrência no Database e reduzindo a quantidade de experimentação e Tuning para o seu código.

* Todas as áreas de memória usadas para caching estão dimensionadas corretamente? Ou seja, grandes o suficiente para conter dados acessados frequentemente, mas não tão grandes a ponto de sobrecarregar a memória física e causar paginação (paging). As principais áreas de memória a serem configuradas são o `InnoDB Buffer Pool`, o `MyISAM Key Cache` e o `MySQL Query Cache`.

### Otimizando no Nível do Hardware

Qualquer aplicação de Database eventualmente atinge os limites do hardware à medida que o Database se torna cada vez mais movimentado. Um DBA deve avaliar se é possível realizar o Tuning da aplicação ou reconfigurar o servidor para evitar esses gargalos, ou se são necessários mais recursos de hardware. Os gargalos do sistema tipicamente surgem destas fontes:

* Buscas (Seeks) em disco. O disco leva tempo para encontrar um pedaço de dado. Com discos modernos, o tempo médio para isso é geralmente inferior a 10ms, então podemos, em teoria, fazer cerca de 100 buscas por segundo. Esse tempo melhora lentamente com novos discos e é muito difícil de otimizar para uma única Table. A maneira de otimizar o tempo de busca (seek time) é distribuir os dados em mais de um disco.

* Leitura e escrita em disco. Quando o disco está na posição correta, precisamos ler ou gravar os dados. Com discos modernos, um disco oferece pelo menos 10–20MB/s de throughput. Isso é mais fácil de otimizar do que as buscas (seeks) porque você pode ler em paralelo a partir de vários discos.

* Ciclos de CPU. Quando os dados estão na memória principal, devemos processá-los para obter nosso resultado. Ter Tables grandes em comparação com a quantidade de memória é o fator limitante mais comum. Mas com Tables pequenas, a velocidade geralmente não é o problema.

* Largura de banda (bandwidth) da memória. Quando a CPU precisa de mais dados do que pode caber no cache da CPU, a largura de banda da memória principal se torna um gargalo. Este é um gargalo incomum para a maioria dos sistemas, mas deve ser levado em consideração.

### Equilibrando Portabilidade e Desempenho

Para usar extensões SQL orientadas a desempenho em um programa MySQL portátil, você pode envolver palavras-chave específicas do MySQL em uma declaração dentro dos delimitadores de comentário `/*! */`. Outros servidores SQL ignoram as palavras-chave comentadas. Para obter informações sobre como escrever comentários, consulte a Seção 9.6, “Comentários”.