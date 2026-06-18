#### 21.2.7.1 Não Conformidade com a Sintaxe SQL no NDB Cluster

Algumas instruções SQL relacionadas a certos recursos do MySQL produzem erros quando usadas com tabelas `NDB`, conforme descrito na lista a seguir:

* **Temporary tables.** Temporary tables não são suportadas. Tentar criar uma temporary table que use o storage engine `NDB` ou alterar uma temporary table existente para usar `NDB` falha com o erro Table storage engine 'ndbcluster' does not support the create option 'TEMPORARY'.

* **Indexes e keys em tabelas NDB.** Keys e Indexes em tabelas NDB Cluster estão sujeitos às seguintes limitações:

  + **Largura da coluna.** A tentativa de criar um Index em uma coluna de tabela `NDB` cuja largura seja superior a 3072 bytes é rejeitada com `ER_TOO_LONG_KEY`: Specified key was too long; max key length is 3072 bytes.

    A tentativa de criar um Index em uma coluna de tabela `NDB` cuja largura seja superior a 3056 bytes é bem-sucedida com um warning. Nesses casos, a informação estatística não é gerada, o que significa que um execution plan não otimizado pode ser selecionado. Por esta razão, você deve considerar tornar o comprimento do Index menor que 3056 bytes, se possível.

  + **Colunas TEXT e BLOB.** Você não pode criar Indexes em colunas de tabelas `NDB` que usem qualquer um dos tipos de dados `TEXT` ou `BLOB`.

  + **FULLTEXT indexes.** O storage engine `NDB` não suporta `FULLTEXT` indexes, que são possíveis apenas para tabelas `MyISAM` e `InnoDB`.

    No entanto, você pode criar Indexes em colunas `VARCHAR` de tabelas `NDB`.

  + **Keys USING HASH e NULL.** O uso de colunas anuláveis em unique keys e primary keys significa que as Queries que usam essas colunas são tratadas como full table scans. Para contornar esse problema, torne a coluna `NOT NULL`, ou recrie o Index sem a opção `USING HASH`.

  + **Prefixos.** Não existem prefix indexes; apenas colunas inteiras podem ser indexadas. (O tamanho de um Index de coluna `NDB` é sempre o mesmo que a largura da coluna em bytes, até e incluindo 3072 bytes, conforme descrito anteriormente nesta seção. Consulte também Section 21.2.7.6, “Unsupported or Missing Features in NDB Cluster”, para informações adicionais.)

  + **Colunas BIT.** Uma coluna `BIT` não pode ser uma primary key, unique key ou Index, nem pode fazer parte de uma primary key composta, unique key ou Index.

  + **Colunas AUTO_INCREMENT.** Assim como outros storage engines do MySQL, o storage engine `NDB` pode lidar com no máximo uma coluna `AUTO_INCREMENT` por tabela, e essa coluna deve ser indexada. No entanto, no caso de uma tabela NDB sem uma primary key explícita, uma coluna `AUTO_INCREMENT` é automaticamente definida e usada como uma primary key "oculta". Por esse motivo, você não pode criar uma tabela NDB que tenha uma coluna `AUTO_INCREMENT` e nenhuma primary key explícita.

    As seguintes instruções `CREATE TABLE` não funcionam, conforme mostrado aqui:

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

* **Restrições em foreign keys.** O suporte para foreign key constraints no NDB 7.5 é comparável ao fornecido pelo `InnoDB`, sujeito às seguintes restrições:

  + Toda coluna referenciada como uma foreign key requer uma unique key explícita, caso não seja a primary key da tabela.

  + `ON UPDATE CASCADE` não é suportado quando a referência é à primary key da tabela pai.

    Isso ocorre porque um update de uma primary key é implementado como um delete da linha antiga (contendo a primary key antiga) mais um insert da nova linha (com uma nova primary key). Isso não é visível para o kernel NDB, que vê essas duas linhas como iguais e, portanto, não tem como saber que esse update deve ser em cascata (cascaded).

  + A partir do NDB 7.5.14 e NDB 7.6.10: `ON DELETE CASCADE` não é suportado onde a tabela filha contém uma ou mais colunas de qualquer um dos tipos `TEXT` ou `BLOB`. (Bug #89511, Bug #27484882)

  + `SET DEFAULT` não é suportado. (Também não suportado pelo `InnoDB`.)

  + As palavras-chave `NO ACTION` são aceitas, mas tratadas como `RESTRICT`. (O mesmo que ocorre com InnoDB.)

  + Em versões anteriores do NDB Cluster, ao criar uma tabela com foreign key referenciando um Index em outra tabela, às vezes parecia possível criar a foreign key mesmo que a ordem das colunas nos Indexes não correspondesse, devido ao fato de que um erro apropriado nem sempre era retornado internamente. Uma correção parcial para este problema melhorou o erro usado internamente para funcionar na maioria dos casos; no entanto, ainda é possível que esta situação ocorra no caso de o Index pai ser um unique index. (Bug #18094360)

  + Antes do NDB 7.5.6, ao adicionar ou descartar uma foreign key usando `ALTER TABLE`, os metadados da tabela pai não eram atualizados, o que possibilitava a execução subsequente de instruções `ALTER TABLE` na tabela pai que deveriam ser inválidas. Para contornar esse problema, execute `SHOW CREATE TABLE` na tabela pai imediatamente após adicionar ou descartar a foreign key; isso força o recarregamento dos metadados da tabela pai.

    Este problema foi corrigido no NDB 7.5.6. (Bug #82989, Bug
    #24666177)

  Para obter mais informações, consulte Section 13.1.18.5, “FOREIGN KEY Constraints” e Section 1.6.3.2, “FOREIGN KEY Constraints”.

* **NDB Cluster e tipos de dados geometry.** Tipos de dados Geometry (`WKT` e `WKB`) são suportados para tabelas `NDB`. No entanto, spatial indexes não são suportados.

* **Conjuntos de caracteres e arquivos de binary log.** Atualmente, as tabelas `ndb_apply_status` e `ndb_binlog_index` são criadas usando o character set `latin1` (ASCII). Como os nomes dos binary logs são registrados nesta tabela, os arquivos de binary log nomeados usando caracteres não latinos não são referenciados corretamente nessas tabelas. Este é um problema conhecido, no qual estamos trabalhando para corrigir. (Bug #50226)

  Para contornar este problema, use apenas caracteres Latin-1 ao nomear arquivos de binary log ou ao definir qualquer uma das opções `--basedir`, `--log-bin` ou `--log-bin-index`.

* **Criação de tabelas NDB com user-defined partitioning.**

  O suporte para user-defined partitioning no NDB Cluster é restrito ao partitioning `LINEAR KEY`. O uso de qualquer outro tipo de partitioning com `ENGINE=NDB` ou `ENGINE=NDBCLUSTER` em uma instrução `CREATE TABLE` resulta em um erro.

  É possível anular esta restrição, mas isso não é suportado para uso em ambientes de produção. Para obter detalhes, consulte User-defined partitioning and the NDB storage engine (NDB Cluster)").

  **Esquema de partitioning padrão.** Todas as tabelas NDB Cluster são particionadas por padrão por `KEY`, usando a primary key da tabela como a partitioning key. Se nenhuma primary key for explicitamente definida para a tabela, a primary key "oculta" criada automaticamente pelo storage engine `NDB` será usada. Para discussões adicionais sobre estas e outras questões relacionadas, consulte Section 22.2.5, “KEY Partitioning”.

  Instruções `CREATE TABLE` e `ALTER TABLE` que fariam com que uma tabela `NDBCLUSTER` particionada pelo usuário não atendesse a um ou ambos os seguintes requisitos não são permitidas e falham com um erro:

  1. A tabela deve ter uma primary key explícita.
  2. Todas as colunas listadas na expression de partitioning da tabela devem fazer parte da primary key.

  **Exceção.** Se uma tabela `NDBCLUSTER` particionada pelo usuário for criada usando uma lista de colunas vazia (ou seja, usando `PARTITION BY [LINEAR] KEY()`), nenhuma primary key explícita é necessária.

  **Número máximo de Partitions para tabelas NDBCLUSTER.** O número máximo de Partitions que podem ser definidas para uma tabela `NDBCLUSTER` ao empregar user-defined partitioning é 8 por node group. (Consulte Section 21.2.2, “NDB Cluster Nodes, Node Groups, Fragment Replicas, and Partitions”, para obter mais informações sobre NDB Cluster node groups.

  **DROP PARTITION não suportado.** Não é possível descartar Partitions de tabelas `NDB` usando `ALTER TABLE ... DROP PARTITION`. As outras extensões de partitioning para `ALTER TABLE` — `ADD PARTITION`, `REORGANIZE PARTITION` e `COALESCE PARTITION` — são suportadas para tabelas NDB, mas usam cópia (copying) e, portanto, não são otimizadas. Consulte Section 22.3.1, “Management of RANGE and LIST Partitions” e Section 13.1.8, “ALTER TABLE Statement”.

  **Seleção de Partition.** A Partition selection não é suportada para tabelas `NDB`. Consulte Section 22.5, “Partition Selection”, para obter mais informações.

* **Tipo de dados JSON.** O tipo de dados `JSON` do MySQL é suportado para tabelas `NDB` no **mysqld** fornecido com NDB 7.5.2 e posterior.

  Uma tabela `NDB` pode ter no máximo 3 colunas `JSON`.

  A NDB API não possui provisão especial para trabalhar com dados `JSON`, que ela vê simplesmente como dados `BLOB`. O tratamento de dados como `JSON` deve ser realizado pela aplicação.

* **Tabelas ndbinfo de informação sobre CPU e Thread.** O NDB 7.5.2 adiciona várias novas tabelas ao Database de informação `ndbinfo`, fornecendo informações sobre a atividade de CPU e Thread por node, ID de Thread e tipo de Thread. As tabelas estão listadas aqui:

  + `cpustat`: Fornece estatísticas de CPU por segundo e por Thread

  + `cpustat_50ms`: Dados brutos de estatísticas de CPU por Thread, coletados a cada 50ms

  + `cpustat_1sec`: Dados brutos de estatísticas de CPU por Thread, coletados a cada segundo

  + `cpustat_20sec`: Dados brutos de estatísticas de CPU por Thread, coletados a cada 20 segundos

  + `threads`: Nomes e descrições dos tipos de Thread

  Para obter mais informações sobre estas tabelas, consulte Section 21.6.15, “ndbinfo: The NDB Cluster Information Database”.

* **Tabelas ndbinfo de informação sobre Lock.** O NDB 7.5.3 adiciona novas tabelas ao Database de informação `ndbinfo`, fornecendo informações sobre Locks e tentativas de Lock em um NDB Cluster em execução. Estas tabelas estão listadas aqui:

  + `cluster_locks`: Requisições de Lock atuais que estão esperando ou mantendo Locks; esta informação pode ser útil ao investigar paralisações (stalls) e deadlocks. Análoga a `cluster_operations`.

  + `locks_per_fragment`: Contagens de requisições de reivindicação de Lock e seus resultados por fragment, bem como o tempo total gasto esperando por Locks com sucesso ou sem sucesso. Análoga a `operations_per_fragment` e `memory_per_fragment`.

  + `server_locks`: Subconjunto de transações do cluster — aquelas em execução no **mysqld** local, mostrando um connection id por transação. Análoga a `server_operations`.