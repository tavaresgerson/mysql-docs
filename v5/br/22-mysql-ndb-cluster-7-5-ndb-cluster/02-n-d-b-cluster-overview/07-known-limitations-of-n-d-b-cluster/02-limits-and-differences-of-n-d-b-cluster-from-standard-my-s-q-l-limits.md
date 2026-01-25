#### 21.2.7.2 Limites e Diferenças do NDB Cluster em Relação aos Limites do MySQL Padrão

Nesta seção, listamos os limites encontrados no NDB Cluster que diferem dos limites encontrados ou que não são encontrados no MySQL padrão.

**Uso de memória e recuperação.** A memória consumida quando dados são inseridos em uma tabela [`NDB`](mysql-cluster.html "Chapter 21 MySQL NDB Cluster 7.5 and NDB Cluster 7.6") não é recuperada automaticamente quando deletada, como ocorre com outros *storage engines*. Em vez disso, as seguintes regras são válidas:

* Uma instrução [`DELETE`](delete.html "13.2.2 DELETE Statement") em uma tabela [`NDB`](mysql-cluster.html "Chapter 21 MySQL NDB Cluster 7.5 and NDB Cluster 7.6") torna a memória anteriormente usada pelas linhas deletadas disponível para reuso apenas por *inserts* na mesma tabela. No entanto, essa memória pode ser disponibilizada para reuso geral executando [`OPTIMIZE TABLE`](optimize-table.html "13.7.2.4 OPTIMIZE TABLE Statement").

  Um *rolling restart* do Cluster também libera qualquer memória usada pelas linhas deletadas. Consulte [Section 21.6.5, “Performing a Rolling Restart of an NDB Cluster”](mysql-cluster-rolling-restart.html "21.6.5 Performing a Rolling Restart of an NDB Cluster").

* Uma operação [`DROP TABLE`](drop-table.html "13.1.29 DROP TABLE Statement") ou [`TRUNCATE TABLE`](truncate-table.html "13.1.34 TRUNCATE TABLE Statement") em uma tabela [`NDB`](mysql-cluster.html "Chapter 21 MySQL NDB Cluster 7.5 and NDB Cluster 7.6") libera a memória que foi usada por essa tabela para reuso por qualquer tabela [`NDB`](mysql-cluster.html "Chapter 21 MySQL NDB Cluster 7.5 and NDB Cluster 7.6"), seja pela mesma tabela ou por outra tabela [`NDB`](mysql-cluster.html "Chapter 21 MySQL NDB Cluster 7.5 and NDB Cluster 7.6").

  Note

  Lembre-se de que [`TRUNCATE TABLE`](truncate-table.html "13.1.34 TRUNCATE TABLE Statement") deleta e recria a tabela. Consulte [Section 13.1.34, “TRUNCATE TABLE Statement”](truncate-table.html "13.1.34 TRUNCATE TABLE Statement").

* **Limites impostos pela configuração do Cluster.** Existe uma série de limites rígidos que são configuráveis, mas a memória principal disponível no Cluster estabelece limites. Consulte a lista completa de parâmetros de configuração em [Section 21.4.3, “NDB Cluster Configuration Files”](mysql-cluster-config-file.html "21.4.3 NDB Cluster Configuration Files"). A maioria dos parâmetros de configuração pode ser atualizada *online*. Esses limites rígidos incluem:

  + Tamanho da memória do Database e tamanho da memória de Index ([`DataMemory`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-datamemory) e [`IndexMemory`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-indexmemory), respectivamente).

    [`DataMemory`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-datamemory) é alocado em páginas de 32KB. À medida que cada página de [`DataMemory`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-datamemory) é usada, ela é atribuída a uma tabela específica; uma vez alocada, essa memória não pode ser liberada, exceto excluindo a tabela (*dropping the table*).

    Consulte [Section 21.4.3.6, “Defining NDB Cluster Data Nodes”](mysql-cluster-ndbd-definition.html "21.4.3.6 Defining NDB Cluster Data Nodes"), para mais informações.

  + O número máximo de operações que podem ser executadas por *transaction* é definido usando os parâmetros de configuração [`MaxNoOfConcurrentOperations`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-maxnoofconcurrentoperations) e [`MaxNoOfLocalOperations`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-maxnooflocaloperations).

    Note

    *Bulk loading*, [`TRUNCATE TABLE`](truncate-table.html "13.1.34 TRUNCATE TABLE Statement") e [`ALTER TABLE`](alter-table.html "13.1.8 ALTER TABLE Statement") são tratados como casos especiais por executarem múltiplas *transactions*, e, portanto, não estão sujeitos a esta limitação.

  + Limites diferentes relacionados a tabelas e *Indexes*. Por exemplo, o número máximo de *ordered Indexes* no Cluster é determinado por [`MaxNoOfOrderedIndexes`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-maxnooforderedindexes), e o número máximo de *ordered Indexes* por tabela é 16.

* **Máximos de Node e Objeto de Dados.** Os seguintes limites se aplicam ao número de *Nodes* do Cluster e objetos de metadados:

  + O número máximo de *data Nodes* é 48.

    Um *data Node* deve ter um *Node ID* no intervalo de 1 a 48, inclusive. (*Management Nodes* e *API Nodes* podem usar *Node IDs* no intervalo de 1 a 255, inclusive.)

  + O número máximo total de *Nodes* em um NDB Cluster é 255. Este número inclui todos os *SQL Nodes* (MySQL Servers), *API Nodes* (aplicativos acessando o Cluster que não sejam MySQL Servers), *data Nodes* e *management servers*.

  + O número máximo de objetos de metadados nas versões atuais do NDB Cluster é 20320. Este limite é *hard-coded*.

  Consulte [Previous NDB Cluster Issues Resolved in NDB Cluster 8.0](/doc/refman/8.0/en/mysql-cluster-limitations-resolved.html), para mais informações.
