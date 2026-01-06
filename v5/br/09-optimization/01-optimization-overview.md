## 8.1 Visão geral da otimização

O desempenho do banco de dados depende de vários fatores no nível do banco de dados, como tabelas, consultas e configurações. Esses construtos de software resultam em operações de CPU e I/O no nível do hardware, que você deve minimizar e tornar o mais eficiente possível. À medida que trabalha no desempenho do banco de dados, você começa aprendendo as regras e diretrizes de alto nível do lado do software e medindo o desempenho usando o tempo do relógio. À medida que se torna um especialista, você aprende mais sobre o que acontece internamente e começa a medir coisas como ciclos de CPU e operações de I/O.

Os usuários típicos buscam obter o melhor desempenho do banco de dados de suas configurações de software e hardware existentes. Os usuários avançados procuram oportunidades para melhorar o próprio software MySQL ou desenvolver seus próprios motores de armazenamento e aparelhos de hardware para expandir o ecossistema MySQL.

- Otimização no nível do banco de dados
- Otimização no Nível de Hardware
- Equilibrando portabilidade e desempenho

### Otimização no nível do banco de dados

O fator mais importante para tornar uma aplicação de banco de dados rápida é seu design básico:

- As tabelas estão estruturadas corretamente? Em particular, as colunas têm os tipos de dados corretos e cada tabela tem as colunas apropriadas para o tipo de trabalho? Por exemplo, aplicativos que realizam atualizações frequentes geralmente têm muitas tabelas com poucas colunas, enquanto aplicativos que analisam grandes quantidades de dados geralmente têm poucas tabelas com muitas colunas.

- Os índices corretos estão em vigor para tornar as consultas eficientes?

- Você está usando o mecanismo de armazenamento apropriado para cada tabela e aproveitando as vantagens e recursos de cada mecanismo de armazenamento que você usa? Em particular, a escolha de um mecanismo de armazenamento transacional, como `InnoDB`, ou um não transacional, como `MyISAM`, pode ser muito importante para o desempenho e a escalabilidade.

  Nota

  `InnoDB` é o mecanismo de armazenamento padrão para novas tabelas. Na prática, as características avançadas de desempenho do `InnoDB` significam que as tabelas `InnoDB` geralmente superam as tabelas `MyISAM` mais simples, especialmente para um banco de dados movimentado.

- Cada tabela usa um formato de linha apropriado? Essa escolha também depende do mecanismo de armazenamento usado para a tabela. Em particular, as tabelas compactadas usam menos espaço em disco e, portanto, requerem menos I/O de disco para ler e escrever os dados. A compressão está disponível para todos os tipos de cargas de trabalho com tabelas `InnoDB` e para tabelas `MyISAM` de apenas leitura.

- O aplicativo usa uma estratégia de bloqueio apropriada? Por exemplo, permitindo acesso compartilhado quando possível para que as operações de banco de dados possam ser executadas de forma concorrente e solicitando acesso exclusivo quando apropriado para que as operações críticas recebam prioridade máxima. Novamente, a escolha do mecanismo de armazenamento é significativa. O mecanismo de armazenamento `InnoDB` lida com a maioria dos problemas de bloqueio sem a necessidade de sua intervenção, permitindo uma melhor concorrência no banco de dados e reduzindo a quantidade de experimentação e ajuste para o seu código.

- Todas as áreas de memória usadas para cache estão dimensionadas corretamente? Ou seja, grandes o suficiente para armazenar dados acessados com frequência, mas não tão grandes que sobrecarreguem a memória física e causem paginação. As principais áreas de memória a serem configuradas são o pool de buffers do `InnoDB`, o cache de chaves do `MyISAM` e o cache de consultas do MySQL.

### Otimização no Nível de Hardware

Qualquer aplicação de banco de dados eventualmente atinge os limites de hardware à medida que o banco de dados fica mais e mais ocupado. Um DBA deve avaliar se é possível ajustar a aplicação ou reconfigurar o servidor para evitar esses gargalos, ou se são necessários mais recursos de hardware. Os gargalos do sistema geralmente surgem dessas fontes:

- Busca de disco. Leva tempo para o disco encontrar um pedaço de dados. Com discos modernos, o tempo médio para isso geralmente é menor que 10ms, então, em teoria, podemos fazer cerca de 100 buscas por segundo. Esse tempo melhora lentamente com novos discos e é muito difícil otimizar para uma única tabela. A maneira de otimizar o tempo de busca é distribuir os dados em mais de um disco.

- Leitura e gravação de discos. Quando o disco está na posição correta, precisamos ler ou gravar os dados. Com discos modernos, um disco oferece um desempenho de pelo menos 10–20 MB/s. Isso é mais fácil de otimizar do que buscar, porque você pode ler em paralelo de vários discos.

- Ciclos da CPU. Quando os dados estão na memória principal, precisamos processá-los para obter o resultado. A principal limitação é a existência de tabelas grandes em comparação com a quantidade de memória. No entanto, com tabelas pequenas, a velocidade geralmente não é o problema.

- Largura de banda da memória. Quando a CPU precisa de mais dados do que cabe na cache da CPU, a largura de banda da memória principal se torna um gargalo. Esse é um gargalo incomum para a maioria dos sistemas, mas é importante estar ciente disso.

### Equilibrando portabilidade e desempenho

Para usar extensões de SQL voltadas para o desempenho em um programa MySQL portátil, você pode envolver palavras-chave específicas do MySQL em uma declaração dentro dos delimitadores de comentário `/*! */`. Outros servidores de SQL ignoram as palavras-chave comentadas. Para obter informações sobre como escrever comentários, consulte a Seção 9.6, “Comentários”.
