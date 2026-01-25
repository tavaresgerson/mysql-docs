#### 21.2.7.1 Não Conformidade com a Sintaxe SQL no NDB Cluster

Algumas instruções SQL relacionadas a certos recursos do MySQL produzem erros quando usadas com tabelas [`NDB`](mysql-cluster.html "Chapter 21 MySQL NDB Cluster 7.5 and NDB Cluster 7.6"), conforme descrito na lista a seguir:

* **Temporary tables.** Temporary tables não são suportadas. Tentar criar uma temporary table que use o storage engine [`NDB`](mysql-cluster.html "Chapter 21 MySQL NDB Cluster 7.5 and NDB Cluster 7.6") ou alterar uma temporary table existente para usar [`NDB`](mysql-cluster.html "Chapter 21 MySQL NDB Cluster 7.5 and NDB Cluster 7.6") falha com o erro Table storage engine 'ndbcluster' does not support the create option 'TEMPORARY'.

* **Indexes e keys em tabelas NDB.** Keys e Indexes em tabelas NDB Cluster estão sujeitos às seguintes limitações:

  + **Largura da coluna.** A tentativa de criar um Index em uma coluna de tabela `NDB` cuja largura seja superior a 3072 bytes é rejeitada com [`ER_TOO_LONG_KEY`](/doc/mysql-errors/5.7/en/server-error-reference.html#error_er_too_long_key): Specified key was too long; max key length is 3072 bytes.

    A tentativa de criar um Index em uma coluna de tabela `NDB` cuja largura seja superior a 3056 bytes é bem-sucedida com um warning. Nesses casos, a informação estatística não é gerada, o que significa que um execution plan não otimizado pode ser selecionado. Por esta razão, você deve considerar tornar o comprimento do Index menor que 3056 bytes, se possível.

  + **Colunas TEXT e BLOB.** Você não pode criar Indexes em colunas de tabelas [`NDB`](mysql-cluster.html "Chapter 21 MySQL NDB Cluster 7.5 and NDB Cluster 7.6") que usem qualquer um dos tipos de dados [`TEXT`](blob.html "11.3.4 The BLOB and TEXT Types") ou [`BLOB`](blob.html "11.3.4 The BLOB and TEXT Types").

  + **FULLTEXT indexes.** O storage engine [`NDB`](mysql-cluster.html "Chapter 21 MySQL NDB Cluster 7.5 and NDB Cluster 7.6") não suporta `FULLTEXT` indexes, que são possíveis apenas para tabelas [`MyISAM`](myisam-storage-engine.html "15.2 The MyISAM Storage Engine") e [`InnoDB`](innodb-storage-engine.html "Chapter 14 The InnoDB Storage Engine").

    No entanto, você pode criar Indexes em colunas [`VARCHAR`](char.html "11.3.2 The CHAR and VARCHAR Types") de tabelas [`NDB`](mysql-cluster.html "Chapter 21 MySQL NDB Cluster 7.5 and NDB Cluster 7.6").

  + **Keys USING HASH e NULL.** O uso de colunas anuláveis em unique keys e primary keys significa que as Queries que usam essas colunas são tratadas como full table scans. Para contornar esse problema, torne a coluna `NOT NULL`, ou recrie o Index sem a opção `USING HASH`.

  + **Prefixos.** Não existem prefix indexes; apenas colunas inteiras podem ser indexadas. (O tamanho de um Index de coluna `NDB` é sempre o mesmo que a largura da coluna em bytes, até e incluindo 3072 bytes, conforme descrito anteriormente nesta seção. Consulte também [Section 21.2.7.6, “Unsupported or Missing Features in NDB Cluster”](mysql-cluster-limitations-unsupported.html "21.2.7.6 Unsupported or Missing Features in NDB Cluster"), para informações adicionais.)

  + **Colunas BIT.** Uma coluna [`BIT`](bit-type.html "11.1.5 Bit-Value Type - BIT") não pode ser uma primary key, unique key ou Index, nem pode fazer parte de uma primary key composta, unique key ou Index.

  + **Colunas AUTO_INCREMENT.** Assim como outros storage engines do MySQL, o storage engine [`NDB`](mysql-cluster.html "Chapter 21 MySQL NDB Cluster 7.5 and NDB Cluster 7.6") pode lidar com no máximo uma coluna `AUTO_INCREMENT` por tabela, e essa coluna deve ser indexada. No entanto, no caso de uma tabela NDB sem uma primary key explícita, uma coluna `AUTO_INCREMENT` é automaticamente definida e usada como uma primary key "oculta". Por esse motivo, você não pode criar uma tabela NDB que tenha uma coluna `AUTO_INCREMENT` e nenhuma primary key explícita.

    As seguintes instruções [`CREATE TABLE`](create-table.html "13.1.18 CREATE TABLE Statement") não funcionam, conforme mostrado aqui:

    ```sql
    # No index on AUTO_INCREMENT column; table has no primary key
    # Raises ER_WRONG_AUTO_KEY
    mysql> CREATE TABLE n (
        ->     a INT,
        ->     b INT AUTO_INCREMENT
        ->     )
        -> ENGINE=NDB;
    ERROR 1075 (42000): Incorrect table definition; there can be only one auto
    column and it must be defined as a key

    # Index on AUTO_INCREMENT column; table has no primary key
    # Raises NDB error 4335
    mysql> CREATE TABLE n (
        ->     a INT,
        ->     b INT AUTO_INCREMENT,
        ->     KEY k (b)
        ->     )
        -> ENGINE=NDB;
    ERROR 1296 (HY000): Got error 4335 'Only one autoincrement column allowed per
    table. Having a table without primary key uses an autoincr' from NDBCLUSTER
    ```

    A seguinte instrução cria uma tabela com uma primary key, uma coluna `AUTO_INCREMENT` e um Index nesta coluna, e é bem-sucedida:

    ```sql
    # Index on AUTO_INCREMENT column; table has a primary key
    mysql> CREATE TABLE n (
        ->     a INT PRIMARY KEY,
        ->     b INT AUTO_INCREMENT,
        ->     KEY k (b)
        ->     )
        -> ENGINE=NDB;
    Query OK, 0 rows affected (0.38 sec)
    ```

* **Restrições em foreign keys.** O suporte para foreign key constraints no NDB 7.5 é comparável ao fornecido pelo [`InnoDB`](innodb-storage-engine.html "Chapter 14 The InnoDB Storage Engine"), sujeito às seguintes restrições:

  + Toda coluna referenciada como uma foreign key requer uma unique key explícita, caso não seja a primary key da tabela.

  + `ON UPDATE CASCADE` não é suportado quando a referência é à primary key da tabela pai.

    Isso ocorre porque um update de uma primary key é implementado como um delete da linha antiga (contendo a primary key antiga) mais um insert da nova linha (com uma nova primary key). Isso não é visível para o kernel NDB, que vê essas duas linhas como iguais e, portanto, não tem como saber que esse update deve ser em cascata (cascaded).

  + A partir do NDB 7.5.14 e NDB 7.6.10: `ON DELETE CASCADE` não é suportado onde a tabela filha contém uma ou mais colunas de qualquer um dos tipos [`TEXT`](blob.html "11.3.4 The BLOB and TEXT Types") ou [`BLOB`](blob.html "11.3.4 The BLOB and TEXT Types"). (Bug #89511, Bug #27484882)

  + `SET DEFAULT` não é suportado. (Também não suportado pelo [`InnoDB`](innodb-storage-engine.html "Chapter 14 The InnoDB Storage Engine").)

  + As palavras-chave `NO ACTION` são aceitas, mas tratadas como `RESTRICT`. (O mesmo que ocorre com InnoDB.)

  + Em versões anteriores do NDB Cluster, ao criar uma tabela com foreign key referenciando um Index em outra tabela, às vezes parecia possível criar a foreign key mesmo que a ordem das colunas nos Indexes não correspondesse, devido ao fato de que um erro apropriado nem sempre era retornado internamente. Uma correção parcial para este problema melhorou o erro usado internamente para funcionar na maioria dos casos; no entanto, ainda é possível que esta situação ocorra no caso de o Index pai ser um unique index. (Bug #18094360)

  + Antes do NDB 7.5.6, ao adicionar ou descartar uma foreign key usando [`ALTER TABLE`](alter-table.html "13.1.8 ALTER TABLE Statement"), os metadados da tabela pai não eram atualizados, o que possibilitava a execução subsequente de instruções `ALTER TABLE` na tabela pai que deveriam ser inválidas. Para contornar esse problema, execute [`SHOW CREATE TABLE`](show-create-table.html "13.7.5.10 SHOW CREATE TABLE Statement") na tabela pai imediatamente após adicionar ou descartar a foreign key; isso força o recarregamento dos metadados da tabela pai.

    Este problema foi corrigido no NDB 7.5.6. (Bug #82989, Bug
    #24666177)

  Para obter mais informações, consulte [Section 13.1.18.5, “FOREIGN KEY Constraints”](create-table-foreign-keys.html "13.1.18.5 FOREIGN KEY Constraints") e [Section 1.6.3.2, “FOREIGN KEY Constraints”](constraint-foreign-key.html "1.6.3.2 FOREIGN KEY Constraints").

* **NDB Cluster e tipos de dados geometry.** Tipos de dados Geometry (`WKT` e `WKB`) são suportados para tabelas [`NDB`](mysql-cluster.html "Chapter 21 MySQL NDB Cluster 7.5 and NDB Cluster 7.6"). No entanto, spatial indexes não são suportados.

* **Conjuntos de caracteres e arquivos de binary log.** Atualmente, as tabelas `ndb_apply_status` e `ndb_binlog_index` são criadas usando o character set `latin1` (ASCII). Como os nomes dos binary logs são registrados nesta tabela, os arquivos de binary log nomeados usando caracteres não latinos não são referenciados corretamente nessas tabelas. Este é um problema conhecido, no qual estamos trabalhando para corrigir. (Bug #50226)

  Para contornar este problema, use apenas caracteres Latin-1 ao nomear arquivos de binary log ou ao definir qualquer uma das opções [`--basedir`](server-system-variables.html#sysvar_basedir), [`--log-bin`](replication-options-binary-log.html#option_mysqld_log-bin) ou [`--log-bin-index`](replication-options-binary-log.html#option_mysqld_log-bin-index).

* **Criação de tabelas NDB com user-defined partitioning.**

  O suporte para user-defined partitioning no NDB Cluster é restrito ao partitioning `LINEAR KEY`. O uso de qualquer outro tipo de partitioning com `ENGINE=NDB` ou `ENGINE=NDBCLUSTER` em uma instrução [`CREATE TABLE`](create-table.html "13.1.18 CREATE TABLE Statement") resulta em um erro.

  É possível anular esta restrição, mas isso não é suportado para uso em ambientes de produção. Para obter detalhes, consulte [User-defined partitioning and the NDB storage engine (NDB Cluster)](partitioning-limitations-storage-engines.html#partitioning-limitations-ndb "User-defined partitioning and the NDB storage engine (NDB Cluster)").

  **Esquema de partitioning padrão.** Todas as tabelas NDB Cluster são particionadas por padrão por `KEY`, usando a primary key da tabela como a partitioning key. Se nenhuma primary key for explicitamente definida para a tabela, a primary key "oculta" criada automaticamente pelo storage engine [`NDB`](mysql-cluster.html "Chapter 21 MySQL NDB Cluster 7.5 and NDB Cluster 7.6") será usada. Para discussões adicionais sobre estas e outras questões relacionadas, consulte [Section 22.2.5, “KEY Partitioning”](partitioning-key.html "22.2.5 KEY Partitioning").

  Instruções [`CREATE TABLE`](create-table.html "13.1.18 CREATE TABLE Statement") e [`ALTER TABLE`](alter-table.html "13.1.8 ALTER TABLE Statement") que fariam com que uma tabela [`NDBCLUSTER`](mysql-cluster.html "Chapter 21 MySQL NDB Cluster 7.5 and NDB Cluster 7.6") particionada pelo usuário não atendesse a um ou ambos os seguintes requisitos não são permitidas e falham com um erro:

  1. A tabela deve ter uma primary key explícita.
  2. Todas as colunas listadas na expression de partitioning da tabela devem fazer parte da primary key.

  **Exceção.** Se uma tabela [`NDBCLUSTER`](mysql-cluster.html "Chapter 21 MySQL NDB Cluster 7.5 and NDB Cluster 7.6") particionada pelo usuário for criada usando uma lista de colunas vazia (ou seja, usando `PARTITION BY [LINEAR] KEY()`), nenhuma primary key explícita é necessária.

  **Número máximo de Partitions para tabelas NDBCLUSTER.** O número máximo de Partitions que podem ser definidas para uma tabela [`NDBCLUSTER`](mysql-cluster.html "Chapter 21 MySQL NDB Cluster 7.5 and NDB Cluster 7.6") ao empregar user-defined partitioning é 8 por node group. (Consulte [Section 21.2.2, “NDB Cluster Nodes, Node Groups, Fragment Replicas, and Partitions”](mysql-cluster-nodes-groups.html "21.2.2 NDB Cluster Nodes, Node Groups, Fragment Replicas, and Partitions"), para obter mais informações sobre NDB Cluster node groups.

  **DROP PARTITION não suportado.** Não é possível descartar Partitions de tabelas [`NDB`](mysql-cluster.html "Chapter 21 MySQL NDB Cluster 7.5 and NDB Cluster 7.6") usando `ALTER TABLE ... DROP PARTITION`. As outras extensões de partitioning para [`ALTER TABLE`](alter-table.html "13.1.8 ALTER TABLE Statement") — `ADD PARTITION`, `REORGANIZE PARTITION` e `COALESCE PARTITION` — são suportadas para tabelas NDB, mas usam cópia (copying) e, portanto, não são otimizadas. Consulte [Section 22.3.1, “Management of RANGE and LIST Partitions”](partitioning-management-range-list.html "22.3.1 Management of RANGE and LIST Partitions") e [Section 13.1.8, “ALTER TABLE Statement”](alter-table.html "13.1.8 ALTER TABLE Statement").

  **Seleção de Partition.** A Partition selection não é suportada para tabelas `NDB`. Consulte [Section 22.5, “Partition Selection”](partitioning-selection.html "22.5 Partition Selection"), para obter mais informações.

* **Tipo de dados JSON.** O tipo de dados [`JSON`](json.html "11.5 The JSON Data Type") do MySQL é suportado para tabelas `NDB` no [**mysqld**](mysqld.html "4.3.1 mysqld — The MySQL Server") fornecido com NDB 7.5.2 e posterior.

  Uma tabela `NDB` pode ter no máximo 3 colunas `JSON`.

  A NDB API não possui provisão especial para trabalhar com dados `JSON`, que ela vê simplesmente como dados `BLOB`. O tratamento de dados como `JSON` deve ser realizado pela aplicação.

* **Tabelas ndbinfo de informação sobre CPU e Thread.** O NDB 7.5.2 adiciona várias novas tabelas ao Database de informação [`ndbinfo`](mysql-cluster-ndbinfo.html "21.6.15 ndbinfo: The NDB Cluster Information Database"), fornecendo informações sobre a atividade de CPU e Thread por node, ID de Thread e tipo de Thread. As tabelas estão listadas aqui:

  + [`cpustat`](mysql-cluster-ndbinfo-cpustat.html "21.6.15.11 The ndbinfo cpustat Table"): Fornece estatísticas de CPU por segundo e por Thread

  + [`cpustat_50ms`](mysql-cluster-ndbinfo-cpustat-50ms.html "21.6.15.12 The ndbinfo cpustat_50ms Table"): Dados brutos de estatísticas de CPU por Thread, coletados a cada 50ms

  + [`cpustat_1sec`](mysql-cluster-ndbinfo-cpustat-1sec.html "21.6.15.13 The ndbinfo cpustat_1sec Table"): Dados brutos de estatísticas de CPU por Thread, coletados a cada segundo

  + [`cpustat_20sec`](mysql-cluster-ndbinfo-cpustat-20sec.html "21.6.15.14 The ndbinfo cpustat_20sec Table"): Dados brutos de estatísticas de CPU por Thread, coletados a cada 20 segundos

  + [`threads`](mysql-cluster-ndbinfo-threads.html "21.6.15.42 The ndbinfo threads Table"): Nomes e descrições dos tipos de Thread

  Para obter mais informações sobre estas tabelas, consulte [Section 21.6.15, “ndbinfo: The NDB Cluster Information Database”](mysql-cluster-ndbinfo.html "21.6.15 ndbinfo: The NDB Cluster Information Database").

* **Tabelas ndbinfo de informação sobre Lock.** O NDB 7.5.3 adiciona novas tabelas ao Database de informação [`ndbinfo`](mysql-cluster-ndbinfo.html "21.6.15 ndbinfo: The NDB Cluster Information Database"), fornecendo informações sobre Locks e tentativas de Lock em um NDB Cluster em execução. Estas tabelas estão listadas aqui:

  + [`cluster_locks`](mysql-cluster-ndbinfo-cluster-locks.html "21.6.15.4 The ndbinfo cluster_locks Table"): Requisições de Lock atuais que estão esperando ou mantendo Locks; esta informação pode ser útil ao investigar paralisações (stalls) e deadlocks. Análoga a `cluster_operations`.

  + [`locks_per_fragment`](mysql-cluster-ndbinfo-locks-per-fragment.html "21.6.15.22 The ndbinfo locks_per_fragment Table"): Contagens de requisições de reivindicação de Lock e seus resultados por fragment, bem como o tempo total gasto esperando por Locks com sucesso ou sem sucesso. Análoga a [`operations_per_fragment`](mysql-cluster-ndbinfo-operations-per-fragment.html "21.6.15.29 The ndbinfo operations_per_fragment Table") e [`memory_per_fragment`](mysql-cluster-ndbinfo-memory-per-fragment.html "21.6.15.27 The ndbinfo memory_per_fragment Table").

  + [`server_locks`](mysql-cluster-ndbinfo-server-locks.html "21.6.15.33 The ndbinfo server_locks Table"): Subconjunto de transações do cluster — aquelas em execução no [**mysqld**](mysqld.html "4.3.1 mysqld — The MySQL Server") local, mostrando um connection id por transação. Análoga a [`server_operations`](mysql-cluster-ndbinfo-server-operations.html "21.6.15.34 The ndbinfo server_operations Table").