### 21.3.7 Upgrade e Downgrade do NDB Cluster

[21.3.7.1 Upgrade e Downgrade do NDB 7.5](mysql-cluster-upgrade-downgrade-7-5.html)

[21.3.7.2 Upgrade e Downgrade do NDB 7.6](mysql-cluster-upgrade-downgrade-7-6.html)

As seções a seguir fornecem informações sobre o upgrade e o downgrade do NDB Cluster 7.5 e 7.6.

Operações de Schema, incluindo instruções SQL DDL, não podem ser realizadas enquanto quaisquer data nodes estiverem reiniciando e, portanto, durante um upgrade ou downgrade online do cluster. Para outras informações sobre o procedimento de Rolling Restart usado para realizar um upgrade online, consulte [Seção 21.6.5, “Executando um Rolling Restart de um NDB Cluster”](mysql-cluster-rolling-restart.html "21.6.5 Executando um Rolling Restart de um NDB Cluster").

Importante

A compatibilidade entre as versões de release é considerada apenas no que diz respeito ao [`NDBCLUSTER`](mysql-cluster.html "Capítulo 21 MySQL NDB Cluster 7.5 e NDB Cluster 7.6") nesta seção, e existem questões adicionais a serem consideradas. Consulte [Seção 2.10, “Upgrading MySQL”](upgrading.html "2.10 Upgrading MySQL").

*Assim como em qualquer outro upgrade ou downgrade de software MySQL, você é fortemente encorajado a revisar as partes relevantes do Manual do MySQL para as versões do MySQL de onde e para onde você pretende migrar, antes de tentar um upgrade ou downgrade do software NDB Cluster*.