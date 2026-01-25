### 8.2.6 Outras Dicas de Otimização

Esta seção lista várias dicas diversas para melhorar a velocidade de processamento de Querys:

* Se sua aplicação faz várias requisições ao Database para executar atualizações relacionadas, combinar as instruções em uma *stored routine* pode ajudar no desempenho. Da mesma forma, se sua aplicação calcula um único resultado baseado em vários valores de coluna ou grandes volumes de dados, combinar o cálculo em uma *loadable function* pode ajudar no desempenho. As operações de Database rápidas resultantes ficam então disponíveis para serem reutilizadas por outras Querys, aplicações e até mesmo código escrito em diferentes linguagens de programação. Consulte a Seção 23.2, “Using Stored Routines” e Adicionando Funções ao MySQL para mais informações.

* Para corrigir quaisquer problemas de compressão que ocorram com tabelas `ARCHIVE`, use `OPTIMIZE TABLE`. Consulte a Seção 15.5, “The ARCHIVE Storage Engine”.

* Se possível, classifique relatórios como “em tempo real” (*live*) ou “estatísticos”, onde os dados necessários para relatórios estatísticos são criados apenas a partir de tabelas de resumo que são geradas periodicamente a partir dos dados em tempo real (*live*).

* Se você tem dados que não se ajustam bem a uma estrutura de tabela de linhas e colunas, você pode empacotar e armazenar dados em uma coluna `BLOB`. Neste caso, você deve fornecer código em sua aplicação para empacotar e desempacotar informações, mas isso pode economizar operações de I/O para ler e escrever os conjuntos de valores relacionados.

* Em servidores Web, armazene imagens e outros ativos binários como arquivos, com o nome do caminho (path name) armazenado no Database em vez do arquivo em si. A maioria dos servidores Web é melhor em fazer caching de arquivos do que do conteúdo do Database, então usar arquivos é geralmente mais rápido. (Embora você precise lidar com Backups e problemas de armazenamento por conta própria neste caso.)

* Se você precisa de uma velocidade realmente alta, examine as interfaces MySQL de baixo nível. Por exemplo, ao acessar o Storage Engine `InnoDB` ou `MyISAM` do MySQL diretamente, você pode obter um aumento substancial de velocidade em comparação com o uso da interface SQL.

  Da mesma forma, para Databases que utilizam o Storage Engine `NDBCLUSTER`, você pode querer investigar o possível uso da NDB API (consulte o MySQL NDB Cluster API Developer Guide).

* Replication pode fornecer um benefício de desempenho para algumas operações. Você pode distribuir recuperações de clientes entre réplicas para dividir a carga. Para evitar o atraso da *source* ao fazer Backups, você pode fazer Backups usando uma réplica. Consulte o Capítulo 16, *Replication*.