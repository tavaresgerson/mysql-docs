### 10.2.7 Outras Dicas de Otimização

Esta seção lista várias dicas variadas para melhorar a velocidade do processamento de consultas:

* Se a sua aplicação fizer várias solicitações ao banco de dados para realizar atualizações relacionadas, combinar as instruções em uma rotina armazenada pode ajudar no desempenho. Da mesma forma, se a sua aplicação calcular um único resultado com base em vários valores de coluna ou grandes volumes de dados, combinar a computação em uma função carregável pode ajudar no desempenho. As operações de banco de dados rápidas resultantes ficam então disponíveis para serem reutilizadas por outras consultas, aplicações e até código escrito em diferentes linguagens de programação. Consulte a Seção 27.2, “Usando Rotinas Armazenadas” e Adicionando Funções ao MySQL para mais informações.

* Para corrigir quaisquer problemas de compressão que ocorram com tabelas `ARCHIVE`, use `OPTIMIZE TABLE`. Consulte a Seção 18.5, “O Motor de Armazenamento ARCHIVE”.

* Se possível, classifique relatórios como “ao vivo” ou como “estatísticos”, onde os dados necessários para relatórios estatísticos são criados apenas a partir de tabelas resumidas que são geradas periodicamente a partir dos dados ao vivo.

* Se você tiver dados que não se encaixam bem em uma estrutura de tabela de linhas e colunas, você pode embalar e armazenar dados em uma coluna `BLOB`. Neste caso, você deve fornecer código em sua aplicação para embalar e desembalar informações, mas isso pode economizar operações de E/S para ler e escrever os conjuntos de valores relacionados.

* Com servidores Web, armazene imagens e outros ativos binários como arquivos, com o nome do caminho armazenado no banco de dados em vez do próprio arquivo. A maioria dos servidores Web é melhor em cache de arquivos do que em conteúdos de banco de dados, então usar arquivos é geralmente mais rápido. (Embora você deva lidar com backups e problemas de armazenamento você mesmo neste caso.)

* Se você precisa de uma velocidade realmente alta, veja as interfaces de baixo nível do MySQL. Por exemplo, ao acessar diretamente o mecanismo de armazenamento `InnoDB` ou `MyISAM` do MySQL, você pode obter um aumento substancial de velocidade em comparação com o uso da interface SQL.

Da mesma forma, para bancos de dados que usam o mecanismo de armazenamento `NDBCLUSTER`, você pode querer investigar o uso possível da API NDB (veja o Guia do Desenvolvedor da API MySQL NDB Cluster).

* A replicação pode proporcionar um benefício de desempenho para algumas operações. Você pode distribuir as recuperações dos clientes entre as réplicas para dividir a carga. Para evitar atrasar a fonte enquanto faz backups, você pode fazer backups usando uma réplica. Veja o Capítulo 19, *Replicação*.