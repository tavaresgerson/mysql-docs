### 21.6.11 Tabelas de Dados em Disco (Disk Data) do NDB Cluster

[21.6.11.1 Objetos de Dados em Disco (Disk Data) do NDB Cluster](mysql-cluster-disk-data-objects.html)

[21.6.11.2 Usando Links Simbólicos com Objetos Disk Data](mysql-cluster-disk-data-symlinks.html)

[21.6.11.3 Requisitos de Armazenamento para Disk Data do NDB Cluster](mysql-cluster-disk-data-storage-requirements.html)

É possível armazenar as colunas não indexadas de tabelas [`NDB`](mysql-cluster.html "Chapter 21 MySQL NDB Cluster 7.5 and NDB Cluster 7.6") em disco, em vez de na RAM.

Como parte da implementação do trabalho de Disk Data do NDB Cluster, várias melhorias foram feitas no NDB Cluster para a manipulação eficiente de grandes quantidades (terabytes) de dados durante o recovery e restart de um node. Estas incluem um algoritmo “no-steal” para sincronizar um node inicializando com grandes conjuntos de dados. Para mais informações, consulte o artigo *[Recovery Principles of NDB Cluster 5.1](http://www.vldb2005.org/program/paper/wed/p1108-ronstrom.pdf)*, dos desenvolvedores do NDB Cluster Mikael Ronström e Jonas Oreland.

O performance do Disk Data do NDB Cluster pode ser influenciado por diversos parâmetros de configuração. Para obter informações sobre esses parâmetros e seus efeitos, consulte *[NDB Cluster Disk Data configuration parameters](mysql-cluster-ndbd-definition.html#mysql-cluster-ndbd-definition-disk-data-parameters "Disk Data Configuration Parameters")* e *[NDB Cluster Disk Data storage and GCP Stop errors](mysql-cluster-ndbd-definition.html#mysql-cluster-ndbd-definition-gcp-stop-errors "Disk Data and GCP Stop errors")*

O performance de um NDB Cluster que usa armazenamento Disk Data também pode ser significativamente melhorado separando os file systems dos data nodes dos arquivos undo log e arquivos de dados de tablespace, o que pode ser feito usando links simbólicos. Para mais informações, consulte [Section 21.6.11.2, “Using Symbolic Links with Disk Data Objects”](mysql-cluster-disk-data-symlinks.html "21.6.11.2 Using Symbolic Links with Disk Data Objects").