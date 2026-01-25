### 21.2.7 Limitações Conhecidas do NDB Cluster

[21.2.7.1 Não Conformidade com a Sintaxe SQL no NDB Cluster](mysql-cluster-limitations-syntax.html)

[21.2.7.2 Limites e Diferenças do NDB Cluster em Relação aos Limites Padrão do MySQL](mysql-cluster-limitations-limits.html)

[21.2.7.3 Limites Relacionados ao Tratamento de Transaction no NDB Cluster](mysql-cluster-limitations-transactions.html)

[21.2.7.4 Tratamento de Erros no NDB Cluster](mysql-cluster-limitations-error-handling.html)

[21.2.7.5 Limites Associados a Database Objects no NDB Cluster](mysql-cluster-limitations-database-objects.html)

[21.2.7.6 Recursos Não Suportados ou Ausentes no NDB Cluster](mysql-cluster-limitations-unsupported.html)

[21.2.7.7 Limitações Relacionadas à Performance no NDB Cluster](mysql-cluster-limitations-performance.html)

[21.2.7.8 Questões Exclusivas do NDB Cluster](mysql-cluster-limitations-exclusive-to-cluster.html)

[21.2.7.9 Limitações Relacionadas ao Armazenamento de Disk Data do NDB Cluster](mysql-cluster-limitations-disk-data.html)

[21.2.7.10 Limitações Relacionadas a Múltiplos Nodes do NDB Cluster](mysql-cluster-limitations-multiple-nodes.html)

Nas seções a seguir, discutiremos as limitações conhecidas nas versões atuais do NDB Cluster em comparação com os recursos disponíveis ao usar os storage engines `MyISAM` e `InnoDB`. Se você verificar a categoria "Cluster" no database de bugs do MySQL em <http://bugs.mysql.com>, você pode encontrar bugs conhecidos nas seguintes categorias, em "MySQL Server:", no database de bugs do MySQL em <http://bugs.mysql.com>, os quais pretendemos corrigir nas próximas versões do NDB Cluster:

* NDB Cluster
* Cluster Direct API (NDBAPI)
* Cluster Disk Data
* Cluster Replication
* ClusterJ

Esta informação tem o objetivo de ser completa em relação às condições que acabamos de expor. Você pode reportar quaisquer discrepâncias que encontrar ao database de bugs do MySQL, utilizando as instruções fornecidas na [Seção 1.5, “Como Reportar Bugs ou Problemas”](bug-reports.html "1.5 Como Reportar Bugs ou Problemas"). Qualquer problema que não planejamos corrigir no NDB Cluster 7.5 é adicionado à lista.

Consulte [Problemas Anteriores do NDB Cluster Resolvidos no NDB Cluster 8.0](/doc/refman/8.0/en/mysql-cluster-limitations-resolved.html) para obter uma lista de problemas em versões anteriores que foram resolvidos no NDB Cluster 7.5.

Note

Limitações e outras questões específicas da NDB Cluster Replication são descritas na [Seção 21.7.3, “Questões Conhecidas na NDB Cluster Replication”](mysql-cluster-replication-issues.html "21.7.3 Questões Conhecidas na NDB Cluster Replication").