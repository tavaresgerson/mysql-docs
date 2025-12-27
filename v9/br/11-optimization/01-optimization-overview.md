## 10.1 Visão Geral da Otimização

O desempenho do banco de dados depende de vários fatores no nível do banco de dados, como tabelas, consultas e configurações. Esses construtos de software resultam em operações de CPU e I/O no nível do hardware, que você deve minimizar e tornar o mais eficiente possível. À medida que trabalha no desempenho do banco de dados, você começa aprendendo as regras e diretrizes de alto nível para o lado do software, e medindo o desempenho usando o tempo de relógio. À medida que se torna um especialista, você aprende mais sobre o que acontece internamente e começa a medir coisas como ciclos de CPU e operações de I/O.

Usuários típicos visam obter o melhor desempenho do banco de dados de suas configurações de software e hardware existentes. Usuários avançados procuram oportunidades para melhorar o próprio software MySQL ou desenvolver seus próprios motores de armazenamento e dispositivos de hardware para expandir o ecossistema MySQL.

* Otimização no Nível do Banco de Dados
* Otimização no Nível do Hardware
* Equilibrando Portabilidade e Desempenho

### Otimização no Nível do Banco de Dados

O fator mais importante para tornar um aplicativo de banco de dados rápido é seu design básico:

* As tabelas estão estruturadas corretamente? Em particular, as colunas têm os tipos de dados corretos, e cada tabela tem as colunas apropriadas para o tipo de trabalho? Por exemplo, aplicativos que realizam atualizações frequentes geralmente têm muitas tabelas com poucas colunas, enquanto aplicativos que analisam grandes quantidades de dados geralmente têm poucas tabelas com muitas colunas.

* Os índices certos estão em vigor para tornar as consultas eficientes?

* Você está usando o mecanismo de armazenamento apropriado para cada tabela e aproveitando as vantagens e recursos de cada mecanismo de armazenamento que você usa? Em particular, a escolha de um mecanismo de armazenamento transacional, como `InnoDB`, ou não transacional, como `MyISAM`, pode ser muito importante para o desempenho e a escalabilidade.

  Nota

  `InnoDB` é o mecanismo de armazenamento padrão para novas tabelas. Na prática, as características avançadas de desempenho de `InnoDB` significam que as tabelas `InnoDB` geralmente superam as tabelas `MyISAM` mais simples, especialmente para um banco de dados ocupado.

* Cada tabela usa um formato de linha apropriado? Essa escolha também depende do mecanismo de armazenamento usado para a tabela. Em particular, as tabelas compactadas usam menos espaço em disco e, portanto, requerem menos I/O de disco para ler e escrever os dados. A compressão está disponível para todos os tipos de cargas de trabalho com tabelas `InnoDB` e para tabelas `MyISAM` de apenas leitura.

* O aplicativo usa uma estratégia de bloqueio apropriada? Por exemplo, permitindo o acesso compartilhado quando possível para que as operações do banco de dados possam ser executadas concorrentemente e solicitando acesso exclusivo quando apropriado para que as operações críticas recebam prioridade máxima. Novamente, a escolha do mecanismo de armazenamento é significativa. O mecanismo de armazenamento `InnoDB` lida com a maioria dos problemas de bloqueio sem a necessidade de sua intervenção, permitindo uma melhor concorrência no banco de dados e reduzindo a quantidade de experimentação e ajuste para seu código.

* Todas as áreas de memória usadas para cache estão dimensionadas corretamente? Ou seja, grandes o suficiente para armazenar dados acessados com frequência, mas não tão grandes que sobrecarreguem a memória física e causem paginação. As principais áreas de memória a serem configuradas são o `InnoDB` buffer pool e o cache de chaves `MyISAM`.

### Otimização no Nível de Hardware





















































































































































Qualquer aplicação de banco de dados eventualmente atinge limites de hardware à medida que o banco de dados fica mais e mais ocupado. Um DBA deve avaliar se é possível ajustar o aplicativo ou reconfigurar o servidor para evitar esses gargalos, ou se são necessários mais recursos de hardware. Os gargalos do sistema geralmente surgem dessas fontes:

* Busca no disco. Leva tempo para o disco encontrar um pedaço de dados. Com discos modernos, o tempo médio para isso geralmente é menor que 10ms, então podemos, em teoria, fazer cerca de 100 buscas por segundo. Esse tempo melhora lentamente com novos discos e é muito difícil de otimizar para uma única tabela. A maneira de otimizar o tempo de busca é distribuir os dados em mais de um disco.

* Leitura e escrita no disco. Quando o disco está na posição correta, precisamos ler ou escrever os dados. Com discos modernos, um disco entrega pelo menos 10–20MB/s de taxa de transferência. Isso é mais fácil de otimizar do que buscas porque você pode ler em paralelo de vários discos.

* Ciclos da CPU. Quando os dados estão na memória principal, precisamos processá-los para obter nosso resultado. Ter tabelas grandes em comparação com a quantidade de memória é o fator limitante mais comum. Mas com tabelas pequenas, a velocidade geralmente não é o problema.

* Largura de banda da memória. Quando a CPU precisa de mais dados do que cabe na cache da CPU, a largura de banda da memória principal se torna um gargalo. Esse é um gargalo incomum para a maioria dos sistemas, mas um a ser levado em consideração.

### Equilibrando Portabilidade e Desempenho

Para usar extensões de SQL orientadas para desempenho em um programa MySQL portátil, você pode envolver palavras-chave específicas do MySQL em uma declaração dentro dos delimitadores de comentário `/*! */`. Outros servidores SQL ignoram as palavras-chave comentadas. Para informações sobre como escrever comentários, consulte a Seção 11.7, “Comentários”.