## 21.4 Configuração do NDB Cluster

[21.4.1 Configuração de Teste Rápido do NDB Cluster](mysql-cluster-quick.html)

[21.4.2 Visão Geral dos Parâmetros, Opções e Variáveis de Configuração do NDB Cluster](mysql-cluster-configuration-overview.html)

[21.4.3 Arquivos de Configuração do NDB Cluster](mysql-cluster-config-file.html)

[21.4.4 Usando Interconexões de Alta Velocidade com o NDB Cluster](mysql-cluster-interconnects.html)

Um MySQL server que faz parte de um NDB Cluster difere em um aspecto principal de um MySQL server normal (não-clustered): ele emprega o storage engine [`NDB`](mysql-cluster.html "Chapter 21 MySQL NDB Cluster 7.5 and NDB Cluster 7.6"). Este engine também é, às vezes, referido como [`NDBCLUSTER`](mysql-cluster.html "Chapter 21 MySQL NDB Cluster 7.5 and NDB Cluster 7.6"), embora `NDB` seja o termo preferido.

Para evitar alocação desnecessária de recursos, o server é configurado por padrão com o storage engine [`NDB`](mysql-cluster.html "Chapter 21 MySQL NDB Cluster 7.5 and NDB Cluster 7.6") desabilitado. Para habilitar [`NDB`](mysql-cluster.html "Chapter 21 MySQL NDB Cluster 7.5 and NDB Cluster 7.6"), você deve modificar o arquivo de configuração `my.cnf` do server, ou iniciar o server com a opção [`--ndbcluster`](mysql-cluster-options-variables.html#option_mysqld_ndbcluster).

Este MySQL server faz parte do cluster, portanto, também deve saber como acessar um management node para obter os dados de configuração do cluster. O comportamento padrão é procurar o management node em `localhost`. No entanto, caso precise especificar que sua localização é em outro lugar, isso pode ser feito em `my.cnf`, ou com o [**mysql**](mysql.html "4.5.1 mysql — The MySQL Command-Line Client") client. Antes que o storage engine [`NDB`](mysql-cluster.html "Chapter 21 MySQL NDB Cluster 7.5 and NDB Cluster 7.6") possa ser usado, pelo menos um management node deve estar operacional, assim como quaisquer data nodes desejados.

Para mais informações sobre [`--ndbcluster`](mysql-cluster-options-variables.html#option_mysqld_ndbcluster) e outras opções do [**mysqld**](mysqld.html "4.3.1 mysqld — The MySQL Server") específicas para o NDB Cluster, consulte [Seção 21.4.3.9.1, “Opções do MySQL Server para NDB Cluster”](mysql-cluster-options-variables.html#mysql-cluster-program-options-mysqld "21.4.3.9.1 MySQL Server Options for NDB Cluster").

Para informações gerais sobre a instalação do NDB Cluster, consulte [Seção 21.3, “Instalação do NDB Cluster”](mysql-cluster-installation.html "21.3 NDB Cluster Installation").