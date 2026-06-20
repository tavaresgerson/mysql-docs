## 8.1 Visão geral da otimização

O desempenho do banco de dados depende de vários fatores no nível do banco de dados, como tabelas, consultas e configurações de configuração. Esses construtos de software resultam em operações de CPU e I/O no nível do hardware, que você deve minimizar e tornar o mais eficiente possível. Ao trabalhar no desempenho do banco de dados, você começa aprendendo as regras e diretrizes de alto nível para o lado do software e medindo o desempenho usando o tempo do relógio. À medida que se torna um especialista, você aprende mais sobre o que acontece internamente e começa a medir coisas como ciclos de CPU e operações de I/O.

Os usuários típicos buscam obter o melhor desempenho do banco de dados de suas configurações de software e hardware existentes. Os usuários avançados procuram oportunidades para melhorar o próprio software MySQL ou desenvolver seus próprios motores de armazenamento e aparelhos de hardware para expandir o ecossistema MySQL.

* Otimização no nível do banco de dados
* Otimização no nível do hardware
* Equilibrar a portabilidade e o desempenho

### Otimização no Nível do Banco de Dados

O fator mais importante para tornar uma aplicação de banco de dados rápida é seu projeto básico:

* As tabelas estão estruturadas corretamente? Em particular, as colunas têm os tipos de dados corretos e cada tabela tem as colunas apropriadas para o tipo de trabalho? Por exemplo, aplicativos que realizam atualizações frequentes geralmente têm muitas tabelas com poucas colunas, enquanto aplicativos que analisam grandes quantidades de dados geralmente têm poucas tabelas com muitas colunas.

* Os índices corretos estão em vigor para tornar as consultas eficientes?

* Você está usando o motor de armazenamento apropriado para cada tabela e aproveitando as forças e características de cada motor de armazenamento que você usa? Em particular, a escolha de um motor de armazenamento transacional, como `InnoDB` ou um não transacional, como `MyISAM`, pode ser muito importante para desempenho e escalabilidade.

Nota

`InnoDB` é o mecanismo de armazenamento padrão para novas tabelas. Na prática, as características avançadas de desempenho de `InnoDB` significam que as tabelas de `InnoDB` frequentemente superam as tabelas mais simples de `MyISAM`, especialmente para um banco de dados ocupado.

* Cada tabela usa um formato de linha apropriado? Essa escolha também depende do mecanismo de armazenamento usado para a tabela. Em particular, as tabelas compactadas usam menos espaço em disco e, portanto, requerem menos I/O de disco para ler e escrever os dados. A compressão está disponível para todos os tipos de cargas de trabalho com tabelas `InnoDB`, e para tabelas `MyISAM` somente de leitura.

* O aplicativo utiliza uma estratégia de bloqueio apropriada? Por exemplo, permitindo acesso compartilhado quando possível, para que as operações de banco de dados possam ser executadas concorrentemente, e solicitando acesso exclusivo quando apropriado, para que as operações críticas recebam a prioridade máxima. Novamente, a escolha do mecanismo de armazenamento é significativa. O mecanismo de armazenamento `InnoDB` lida com a maioria dos problemas de bloqueio sem a necessidade de sua intervenção, permitindo uma melhor concorrência no banco de dados e reduzindo a quantidade de experimentação e ajuste para seu código.

* Todas as áreas de memória utilizadas para cache estão dimensionadas corretamente? Ou seja, grandes o suficiente para armazenar dados frequentemente acessados, mas não tão grandes que sobrecarreguem a memória física e causem paginação. As principais áreas de memória a serem configuradas são o pool de buffers `InnoDB`, o cache de chave `MyISAM` e o cache de consultas MySQL.

### Otimizando no Nível de Hardware

Qualquer aplicativo de banco de dados eventualmente atinge os limites de hardware à medida que o banco de dados se torna cada vez mais ocupado. Um DBA deve avaliar se é possível ajustar o aplicativo ou reconfigurar o servidor para evitar esses gargalos, ou se são necessários mais recursos de hardware. Os gargalos do sistema geralmente surgem dessas fontes:

* Busca de disco. Leva tempo para o disco encontrar um pedaço de dados. Com discos modernos, o tempo médio para isso geralmente é menor que 10 ms, então podemos, em teoria, fazer cerca de 100 buscas por segundo. Esse tempo melhora lentamente com novos discos e é muito difícil otimizar para uma única tabela. A maneira de otimizar o tempo de busca é distribuir os dados em mais de um disco.

* Leitura e escrita em disco. Quando o disco está na posição correta, é necessário ler ou escrever os dados. Com discos modernos, um disco oferece pelo menos 10–20 MB/s de desempenho. Isso é mais fácil de otimizar do que buscas, pois você pode ler em paralelo em vários discos.

* Ciclos da CPU. Quando os dados estão na memória principal, é necessário processá-los para obter o resultado. Ter tabelas grandes em comparação com a quantidade de memória é o fator limitante mais comum. Mas, com tabelas pequenas, a velocidade geralmente não é o problema.

* Largura de banda da memória. Quando a CPU precisa de mais dados do que cabe na memória cache da CPU, a largura de banda da memória principal se torna um gargalo. Esse é um gargalo incomum para a maioria dos sistemas, mas é algo que deve ser considerado.

### Equilibrando portabilidade e desempenho

Para usar extensões de SQL orientadas ao desempenho em um programa MySQL portátil, você pode envolver palavras-chave específicas do MySQL em uma declaração dentro dos delimitadores de comentário `/*! */`. Outros servidores de SQL ignoram as palavras-chave comentadas. Para obter informações sobre como escrever comentários, consulte a Seção 9.6, “Comentários”.