### 21.7.2 Requisitos Gerais para Replication de NDB Cluster

Um canal de Replication requer dois MySQL servers atuando como replication servers (um para o Source e um para o Replica). Por exemplo, isso significa que, no caso de uma configuração de Replication com dois canais de Replication (para fornecer um canal extra para redundância), deve haver um total de quatro replication nodes, dois por Cluster.

A Replication de um NDB Cluster, conforme descrito nesta seção e nas seguintes, é dependente da row-based replication. Isso significa que o MySQL server Source de Replication deve estar em execução com [`--binlog-format=ROW`](replication-options-binary-log.html#sysvar_binlog_format) ou [`--binlog-format=MIXED`](replication-options-binary-log.html#sysvar_binlog_format), conforme descrito na [Seção 21.7.6, “Iniciando a Replication de NDB Cluster (Canal Único de Replication)”](mysql-cluster-replication-starting.html "21.7.6 Starting NDB Cluster Replication (Single Replication Channel)"). Para informações gerais sobre row-based replication, consulte a [Seção 16.2.1, “Replication Formats”](replication-formats.html "16.2.1 Replication Formats").

Importante

Se você tentar usar NDB Cluster Replication com [`--binlog-format=STATEMENT`](replication-options-binary-log.html#sysvar_binlog_format), a Replication falha ao funcionar corretamente porque a tabela `ndb_binlog_index` no Source cluster e a coluna `epoch` da tabela `ndb_apply_status` no Replica cluster não são atualizadas (consulte a [Seção 21.7.4, “Esquema e Tabelas de Replication de NDB Cluster”](mysql-cluster-replication-schema.html "21.7.4 NDB Cluster Replication Schema and Tables")). Em vez disso, apenas as atualizações no MySQL server que atua como Source de Replication se propagam para o Replica, e nenhuma atualização de quaisquer outros SQL nodes no Source cluster é replicada.

O valor padrão para a opção [`--binlog-format`](replication-options-binary-log.html#sysvar_binlog_format) é `MIXED`.

Cada MySQL server usado para Replication em qualquer Cluster deve ser identificado de forma única entre todos os MySQL replication servers participantes em qualquer um dos Clusters (você não pode ter replication servers tanto no Source cluster quanto no Replica cluster compartilhando o mesmo ID). Isso pode ser feito iniciando cada SQL node usando a opção `--server-id=id`, onde *`id`* é um integer exclusivo. Embora não seja estritamente necessário, assumimos para os propósitos desta discussão que todos os binários do NDB Cluster são da mesma versão de release.

É geralmente verdade na MySQL Replication que ambos os MySQL servers (processos [**mysqld**](mysqld.html "4.3.1 mysqld — The MySQL Server")) envolvidos devem ser compatíveis entre si em relação tanto à versão do replication protocol usado quanto aos conjuntos de recursos SQL que eles suportam (consulte a [Seção 16.4.2, “Compatibilidade de Replication Entre Versões do MySQL”](replication-compatibility.html "16.4.2 Replication Compatibility Between MySQL Versions")). É devido a tais diferenças entre os binários nas distribuições NDB Cluster e MySQL Server 5.7 que a NDB Cluster Replication possui o requisito adicional de que ambos os binários [**mysqld**](mysqld.html "4.3.1 mysqld — The MySQL Server") venham de uma distribuição NDB Cluster. A maneira mais simples e fácil de garantir que os [**mysqld**](mysqld.html "4.3.1 mysqld — The MySQL Server") servers sejam compatíveis é usar a mesma distribuição NDB Cluster para todos os binários [**mysqld**](mysqld.html "4.3.1 mysqld — The MySQL Server") do Source e do Replica.

Assumimos que o Replica server ou Cluster é dedicado à Replication do Source cluster e que nenhum outro dado está sendo armazenado nele.

Todas as tabelas `NDB` que estão sendo replicadas devem ser criadas usando um MySQL server e client. Tabelas e outros objetos Database criados usando a NDB API (com, por exemplo, [`Dictionary::createTable()`](/doc/ndbapi/en/ndb-dictionary.html#ndb-dictionary-createtable)) não são visíveis para um MySQL server e, portanto, não são replicados. Atualizações feitas por aplicações NDB API em tabelas existentes que foram criadas usando um MySQL server podem ser replicadas.

Note

É possível replicar um NDB Cluster usando statement-based replication. No entanto, neste caso, aplicam-se as seguintes restrições:

* Todas as atualizações para rows de dados no cluster atuando como Source devem ser direcionadas para um único MySQL server.

* Não é possível replicar um Cluster usando múltiplos processos de MySQL Replication simultâneos.

* Apenas as alterações feitas no nível SQL são replicadas.

Estas são adicionais às outras limitações da statement-based replication em oposição à row-based replication; consulte a [Seção 16.2.1.1, “Vantagens e Desvantagens da Statement-Based e Row-Based Replication”](replication-sbr-rbr.html "16.2.1.1 Advantages and Disadvantages of Statement-Based and Row-Based Replication"), para informações mais específicas sobre as diferenças entre os dois Replication Formats.