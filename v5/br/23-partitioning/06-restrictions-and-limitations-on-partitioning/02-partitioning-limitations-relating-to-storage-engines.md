### 22.6.2 Limitações de Partitioning Relacionadas a Storage Engines

As seguintes limitações se aplicam ao uso de storage engines com partitioning de tabelas definido pelo usuário.

**MERGE storage engine.** O partitioning definido pelo usuário e o storage engine `MERGE` não são compatíveis. Tabelas que utilizam o storage engine `MERGE` não podem ser particionadas. Tabelas particionadas não podem ser unidas (merged).

**FEDERATED storage engine.** O partitioning de tabelas `FEDERATED` não é suportado; não é possível criar tabelas `FEDERATED` particionadas.

**CSV storage engine.** Tabelas particionadas que utilizam o storage engine `CSV` não são suportadas; não é possível criar tabelas `CSV` particionadas.

**InnoDB storage engine.** Chaves estrangeiras (Foreign Keys) do [`InnoDB`](innodb-storage-engine.html "Chapter 14 The InnoDB Storage Engine") e o partitioning do MySQL não são compatíveis. Tabelas `InnoDB` particionadas não podem ter referências de Foreign Key, nem podem ter colunas referenciadas por Foreign Keys. Tabelas `InnoDB` que possuem ou que são referenciadas por Foreign Keys não podem ser particionadas.

O `InnoDB` não suporta o uso de múltiplos discos para subpartitions. (Atualmente, isso é suportado apenas pelo `MyISAM`.)

Além disso, [`ALTER TABLE ... OPTIMIZE PARTITION`](alter-table-partition-operations.html "13.1.8.1 ALTER TABLE Partition Operations") não funciona corretamente com tabelas particionadas que usam o storage engine `InnoDB`. Em vez disso, use `ALTER TABLE ... REBUILD PARTITION` e `ALTER TABLE ... ANALYZE PARTITION` para essas tabelas. Para mais informações, consulte [Section 13.1.8.1, “ALTER TABLE Partition Operations”](alter-table-partition-operations.html "13.1.8.1 ALTER TABLE Partition Operations").

**Partitioning definido pelo usuário e o NDB storage engine (NDB Cluster).** O partitioning por `KEY` (incluindo `LINEAR KEY`) é o único tipo de partitioning suportado para o storage engine [`NDB`](mysql-cluster.html "Chapter 21 MySQL NDB Cluster 7.5 and NDB Cluster 7.6"). Em circunstâncias normais, não é possível no NDB Cluster criar uma tabela NDB Cluster usando qualquer tipo de partitioning diferente de [`LINEAR`] `KEY`, e a tentativa de fazê-lo resultará em um erro.

*Exceção (não para produção)*: É possível anular essa restrição configurando a variável de sistema [`new`](server-system-variables.html#sysvar_new) para `ON` nos SQL nodes do NDB Cluster. Se você optar por fazer isso, deve estar ciente de que tabelas usando tipos de partitioning diferentes de `[LINEAR] KEY` não são suportadas em produção. *Nesses casos, você pode criar e usar tabelas com tipos de partitioning diferentes de `KEY` ou `LINEAR KEY`, mas você o faz inteiramente por sua conta e risco*. Você também deve estar ciente de que esta funcionalidade agora está descontinuada e sujeita a remoção sem aviso prévio em uma futura release do NDB Cluster.

O número máximo de partitions que podem ser definidas para uma tabela [`NDB`](mysql-cluster.html "Chapter 21 MySQL NDB Cluster 7.5 and NDB Cluster 7.6") depende do número de data nodes e node groups no cluster, da versão do software NDB Cluster em uso e de outros fatores. Consulte [NDB e partitioning definido pelo usuário](mysql-cluster-nodes-groups.html#mysql-cluster-nodes-groups-user-partitioning "NDB and user-defined partitioning"), para mais informações.

A partir do MySQL NDB Cluster 7.5.2, a quantidade máxima de dados de tamanho fixo que pode ser armazenada por partition em uma tabela `NDB` é de 128 TB. Anteriormente, era de 16 GB.

[`CREATE TABLE`](create-table.html "13.1.18 CREATE TABLE Statement") e [`ALTER TABLE`](alter-table-partition-operations.html "13.1.8.1 ALTER TABLE Partition Operations") que fariam com que uma tabela [`NDB`](mysql-cluster.html "Chapter 21 MySQL NDB Cluster 7.5 and NDB Cluster 7.6") particionada pelo usuário não atendesse a um ou ambos os requisitos a seguir não são permitidos e falham com um erro:

1. A tabela deve ter uma Primary Key explícita.
2. Todas as colunas listadas na expressão de partitioning da tabela devem fazer parte da Primary Key.

**Exceção.** Se uma tabela [`NDB`](mysql-cluster.html "Chapter 21 MySQL NDB Cluster 7.5 and NDB Cluster 7.6") particionada pelo usuário for criada usando uma lista de colunas vazia (ou seja, usando `PARTITION BY KEY()` ou `PARTITION BY LINEAR KEY()`), então nenhuma Primary Key explícita é necessária.

**Seleção de Partition (Partition selection).** A seleção de Partition não é suportada para tabelas [`NDB`](mysql-cluster.html "Chapter 21 MySQL NDB Cluster 7.5 and NDB Cluster 7.6"). Consulte [Section 22.5, “Partition Selection”](partitioning-selection.html "22.5 Partition Selection"), para mais informações.

**Upgrade de tabelas particionadas.** Ao realizar um upgrade, tabelas particionadas por `KEY` e que usam qualquer storage engine diferente de [`NDB`](mysql-cluster.html "Chapter 21 MySQL NDB Cluster 7.5 and NDB Cluster 7.6") devem ser despejadas (dumped) e recarregadas (reloaded).

**O mesmo storage engine para todas as partitions.** Todas as partitions de uma tabela particionada devem usar o mesmo storage engine e deve ser o mesmo storage engine usado pela tabela como um todo. Além disso, se o engine não for especificado no nível da tabela, deve-se realizar uma das seguintes ações ao criar ou alterar uma tabela particionada:

* Não especificar nenhum engine para *nenhuma* partition ou subpartition
* Especificar o engine para *todas* as partitions ou subpartitions