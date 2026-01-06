### 21.6.11 Tabelas de dados de disco do cluster NDB

21.6.11.1 Objetos de dados de disco do cluster NDB

21.6.11.2 Uso de Links Simbólicos com Objetos de Dados de Disco

21.6.11.3 Requisitos de Armazenamento de Dados de Disco do NDB Cluster

É possível armazenar as colunas não indexadas das tabelas de `NDB` no disco, em vez de na RAM.

Como parte da implementação do trabalho com NDB Cluster Disk Data, várias melhorias foram feitas no NDB Cluster para o manejo eficiente de grandes quantidades (terabytes) de dados durante a recuperação e reinício de nós. Essas melhorias incluem um algoritmo de "não roubo" para sincronizar um nó inicial com conjuntos de dados muito grandes. Para mais informações, consulte o artigo *Princípios de Recuperação do NDB Cluster 5.1*, dos desenvolvedores do NDB Cluster Mikael Ronström e Jonas Oreland.

O desempenho dos dados do disco do NDB Cluster pode ser influenciado por vários parâmetros de configuração. Para obter informações sobre esses parâmetros e seus efeitos, consulte *Parâmetros de configuração dos dados do disco do NDB Cluster* e *Erros de armazenamento e GCP Stop dos dados do disco do NDB Cluster*

O desempenho de um NDB Cluster que utiliza o armazenamento de dados em disco também pode ser significativamente melhorado ao separar os sistemas de arquivos dos nós de dados dos arquivos de log de desfazer e dos arquivos de dados do espaço de tabelas, o que pode ser feito usando links simbólicos. Para mais informações, consulte Seção 21.6.11.2, “Usando Links Simbólicos com Objetos de Dados em Disco”.
