### 8.2.6 Outras dicas de otimização

Esta seção lista várias dicas variadas para melhorar a velocidade do processamento de consultas:

- Se sua aplicação fizer várias solicitações ao banco de dados para realizar atualizações relacionadas, combinar as instruções em uma rotina armazenada pode ajudar no desempenho. Da mesma forma, se sua aplicação calcular um único resultado com base em vários valores de coluna ou grandes volumes de dados, combinar a computação em uma função carregável pode ajudar no desempenho. As operações rápidas do banco de dados resultantes então ficam disponíveis para serem reutilizadas por outras consultas, aplicações e até código escrito em diferentes linguagens de programação. Consulte a Seção 23.2, “Usando Rotinas Armazenadas” e Adicionando Funções ao MySQL para obter mais informações.

- Para corrigir quaisquer problemas de compressão que ocorram com as tabelas `ARCHIVE`, use `OPTIMIZE TABLE`. Consulte a Seção 15.5, “O Motor de Armazenamento ARCHIVE”.

- Se possível, classifique os relatórios como "em andamento" ou como "estatísticos", onde os dados necessários para relatórios estatísticos são criados apenas a partir de tabelas resumidas que são geradas periodicamente a partir dos dados em tempo real.

- Se você tiver dados que não se encaixam bem em uma estrutura de tabela de linhas e colunas, você pode embalar e armazenar os dados em uma coluna `BLOB`. Nesse caso, você deve fornecer código em sua aplicação para embalar e desembalar as informações, mas isso pode economizar operações de entrada/saída para ler e escrever os conjuntos de valores relacionados.

- Com servidores web, armazene imagens e outros ativos binários como arquivos, com o nome do caminho armazenado no banco de dados em vez do próprio arquivo. A maioria dos servidores web é melhor em cache de arquivos do que em conteúdos de banco de dados, então usar arquivos é geralmente mais rápido. (Embora você deva lidar com backups e problemas de armazenamento por conta própria neste caso.)

- Se você precisa de uma velocidade realmente alta, veja as interfaces de baixo nível do MySQL. Por exemplo, ao acessar diretamente o mecanismo de armazenamento `InnoDB` ou `MyISAM` do MySQL, você pode obter um aumento substancial na velocidade em comparação com o uso da interface SQL.

  Da mesma forma, para bancos de dados que utilizam o mecanismo de armazenamento `NDBCLUSTER`, você pode querer investigar o uso possível da API NDB (consulte o Guia do Desenvolvedor da API MySQL NDB Cluster).

- A replicação pode proporcionar um benefício de desempenho para algumas operações. Você pode distribuir as recuperações dos clientes entre as réplicas para dividir a carga. Para evitar atrasar a fonte ao fazer backups, você pode fazer backups usando uma réplica. Veja o Capítulo 16, *Replicação*.
