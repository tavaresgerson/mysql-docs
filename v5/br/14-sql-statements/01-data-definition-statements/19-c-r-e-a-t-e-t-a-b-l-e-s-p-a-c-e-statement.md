### 13.1.19 Instrução CREATE TABLESPACE

```sql
CREATE TABLESPACE tablespace_name

  InnoDB and NDB:
    ADD DATAFILE 'file_name'

  InnoDB only:
    [FILE_BLOCK_SIZE = value]

  NDB only:
    USE LOGFILE GROUP logfile_group
    [EXTENT_SIZE [=] extent_size]
    [INITIAL_SIZE [=] initial_size]
    [AUTOEXTEND_SIZE [=] autoextend_size]
    [MAX_SIZE [=] max_size]
    [NODEGROUP [=] nodegroup_id]
    [WAIT]
    [COMMENT [=] 'string']

  InnoDB and NDB:
    [ENGINE [=] engine_name]
```

Esta instrução é usada para criar um tablespace. A sintaxe e semântica precisas dependem do storage engine utilizado. Nas versões padrão do MySQL 5.7, este é sempre um tablespace [`InnoDB`](innodb-storage-engine.html "Chapter 14 The InnoDB Storage Engine"). O MySQL NDB Cluster 7.5 também suporta tablespaces que utilizam o storage engine [`NDB`](mysql-cluster.html "Chapter 21 MySQL NDB Cluster 7.5 and NDB Cluster 7.6") além daqueles que usam `InnoDB`.

* [Considerações para InnoDB](create-tablespace.html#create-tablespace-innodb "Considerations for InnoDB")
* [Considerações para NDB Cluster](create-tablespace.html#create-tablespace-ndb "Considerations for NDB Cluster")
* [Opções](create-tablespace.html#create-tablespace-options "Options")
* [Notas](create-tablespace.html#create-tablespace-notes "Notes")
* [Exemplos de InnoDB](create-tablespace.html#create-tablespace-innodb-examples "InnoDB Examples")
* [Exemplo de NDB](create-tablespace.html#create-tablespace-ndb-examples "NDB Example")

#### Considerações para InnoDB

A sintaxe [`CREATE TABLESPACE`](create-tablespace.html "13.1.19 CREATE TABLESPACE Statement") é usada para criar tablespaces gerais. Um tablespace geral é um tablespace compartilhado. Ele pode conter múltiplas tabelas e suporta todos os row formats de tabela. Tablespaces gerais podem ser criados em um local relativo ou independente do data directory.

Após criar um tablespace geral `InnoDB`, você pode usar [`CREATE TABLE tbl_name ... TABLESPACE [=] tablespace_name`](create-table.html "13.1.18 CREATE TABLE Statement") ou [`ALTER TABLE tbl_name TABLESPACE [=] tablespace_name`](alter-table.html "13.1.8 ALTER TABLE Statement") para adicionar tabelas ao tablespace. Para mais informações, veja [Seção 14.6.3.3, “General Tablespaces”](general-tablespaces.html "14.6.3.3 General Tablespaces").

#### Considerações para NDB Cluster

Esta instrução é usada para criar um tablespace, que pode conter um ou mais data files, fornecendo espaço de armazenamento para tabelas NDB Cluster Disk Data (veja [Seção 21.6.11, “NDB Cluster Disk Data Tables”](mysql-cluster-disk-data.html "21.6.11 NDB Cluster Disk Data Tables")). Um data file é criado e adicionado ao tablespace usando esta instrução. Data files adicionais podem ser adicionados ao tablespace usando a instrução [`ALTER TABLESPACE`](alter-tablespace.html "13.1.9 ALTER TABLESPACE Statement") (veja [Seção 13.1.9, “ALTER TABLESPACE Statement”](alter-tablespace.html "13.1.9 ALTER TABLESPACE Statement")).

Note

Todos os objetos NDB Cluster Disk Data compartilham o mesmo namespace. Isso significa que *cada objeto Disk Data* deve ter um nome exclusivo (e não apenas cada objeto Disk Data de um determinado tipo). Por exemplo, você não pode ter um tablespace e um log file group com o mesmo nome, ou um tablespace e um data file com o mesmo nome.

Um log file group de um ou mais arquivos de log `UNDO` deve ser atribuído ao tablespace a ser criado com a cláusula `USE LOGFILE GROUP`. *`logfile_group`* deve ser um log file group existente criado com [`CREATE LOGFILE GROUP`](create-logfile-group.html "13.1.15 CREATE LOGFILE GROUP Statement") (veja [Seção 13.1.15, “CREATE LOGFILE GROUP Statement”](create-logfile-group.html "13.1.15 CREATE LOGFILE GROUP Statement")). Múltiplos tablespaces podem usar o mesmo log file group para logging `UNDO`.

Ao definir `EXTENT_SIZE` ou `INITIAL_SIZE`, você pode opcionalmente seguir o número com uma abreviação de uma letra para uma ordem de magnitude, semelhante às usadas em `my.cnf`. Geralmente, esta é uma das letras `M` (para megabytes) ou `G` (para gigabytes).

`INITIAL_SIZE` e `EXTENT_SIZE` estão sujeitos ao arredondamento da seguinte forma:

* `EXTENT_SIZE` é arredondado para o múltiplo inteiro mais próximo de 32K.

* `INITIAL_SIZE` é arredondado *para baixo* para o múltiplo inteiro mais próximo de 32K; este resultado é arredondado para o múltiplo inteiro mais próximo de `EXTENT_SIZE` (após qualquer arredondamento).

Note

[`NDB`](mysql-cluster.html "Chapter 21 MySQL NDB Cluster 7.5 and NDB Cluster 7.6") reserva 4% de um tablespace para operações de reinicialização do node de dados. Este espaço reservado não pode ser usado para armazenamento de dados. Esta restrição se aplica a partir do NDB 7.6.

O arredondamento que acabamos de descrever é feito explicitamente, e um aviso é emitido pelo MySQL Server quando tal arredondamento é realizado. Os valores arredondados também são usados pelo kernel NDB para calcular os valores da coluna [`FILES`](information-schema-files-table.html "24.3.9 The INFORMATION_SCHEMA FILES Table") do Information Schema e para outros propósitos. No entanto, para evitar um resultado inesperado, sugerimos que você sempre use múltiplos inteiros de 32K ao especificar estas opções.

Quando [`CREATE TABLESPACE`](create-tablespace.html "13.1.19 CREATE TABLESPACE Statement") é usado com `ENGINE [=] NDB`, um tablespace e um data file associado são criados em cada node de dados do Cluster. Você pode verificar se os data files foram criados e obter informações sobre eles consultando a tabela [`FILES`](information-schema-files-table.html "24.3.9 The INFORMATION_SCHEMA FILES Table") do Information Schema. (Veja o exemplo mais adiante nesta seção.)

(Veja [Seção 24.3.9, “The INFORMATION_SCHEMA FILES Table”](information-schema-files-table.html "24.3.9 The INFORMATION_SCHEMA FILES Table").)

#### Opções

* `ADD DATAFILE`: Define o nome de um data file do tablespace; esta opção é sempre obrigatória. O `file_name`, incluindo qualquer path especificado, deve ser citado com aspas simples ou duplas. Nomes de arquivos (sem contar a extensão do arquivo) e nomes de diretórios devem ter pelo menos um byte de comprimento. Nomes de arquivos e diretórios de comprimento zero não são suportados.

  Como há diferenças consideráveis na forma como `InnoDB` e `NDB` tratam os data files, os dois storage engines são abordados separadamente na discussão a seguir.

  **Data files InnoDB.** Um tablespace `InnoDB` suporta apenas um único data file, cujo nome deve incluir a extensão `.ibd`.

  Para um tablespace `InnoDB`, o data file é criado por padrão no data directory do MySQL ([`datadir`](server-system-variables.html#sysvar_datadir)). Para colocar o data file em um local diferente do padrão, inclua um path de diretório absoluto ou um path relativo ao local padrão.

  Quando um tablespace `InnoDB` é criado fora do data directory, um arquivo [isl](glossary.html#glos_isl_file ".isl file") é criado no data directory. Para evitar conflitos com tablespaces file-per-table criados implicitamente, não é suportada a criação de um tablespace geral `InnoDB` em um subdiretório sob o data directory. Ao criar um tablespace geral `InnoDB` fora do data directory, o diretório deve existir antes de criar o tablespace.

  Note

  No MySQL 5.7, `ALTER TABLESPACE` não é suportado por `InnoDB`.

  **Data files NDB.** Um tablespace `NDB` suporta múltiplos data files que podem ter qualquer nome de arquivo legal; mais data files podem ser adicionados a um tablespace NDB Cluster após sua criação, usando uma instrução [`ALTER TABLESPACE`](alter-tablespace.html "13.1.9 ALTER TABLESPACE Statement").

  Um data file de tablespace `NDB` é criado por padrão no diretório do sistema de arquivos do node de dados – isto é, o diretório nomeado `ndb_nodeid_fs/TS` sob o data directory do node de dados ([`DataDir`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-datadir)), onde *`nodeid`* é o [`NodeId`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-nodeid) do node de dados. Para colocar o data file em um local diferente do padrão, inclua um path de diretório absoluto ou um path relativo ao local padrão. Se o diretório especificado não existir, `NDB` tenta criá-lo; a conta de usuário do sistema sob a qual o processo do node de dados está em execução deve ter as permissões apropriadas para fazê-lo.

  Note

  Ao determinar o path usado para um data file, `NDB` não expande o caractere `~` (til).

  Quando múltiplos nodes de dados são executados no mesmo host físico, as seguintes considerações se aplicam:

  + Você não pode especificar um path absoluto ao criar um data file.

  + Não é possível criar data files de tablespace fora do diretório do sistema de arquivos do node de dados, a menos que cada node de dados tenha um data directory separado.

  + Se cada node de dados tiver seu próprio data directory, os data files poderão ser criados em qualquer lugar dentro deste diretório.

  + Se cada node de dados tiver seu próprio data directory, também pode ser possível criar um data file fora do data directory do node usando um path relativo, desde que este path se resolva para um local exclusivo no sistema de arquivos do host para cada node de dados em execução nesse host.

* `FILE_BLOCK_SIZE`: Esta opção – que é específica para `InnoDB` e é ignorada por `NDB` – define o block size para o data file do tablespace. Os valores podem ser especificados em bytes ou kilobytes. Por exemplo, um block size de arquivo de 8 kilobytes pode ser especificado como 8192 ou 8K. Se você não especificar esta opção, `FILE_BLOCK_SIZE` assume o valor padrão de [`innodb_page_size`](innodb-parameters.html#sysvar_innodb_page_size). `FILE_BLOCK_SIZE` é obrigatório quando você pretende usar o tablespace para armazenar tabelas `InnoDB` compactadas (`ROW_FORMAT=COMPRESSED`). Neste caso, você deve definir o `FILE_BLOCK_SIZE` do tablespace ao criar o tablespace.

  Se `FILE_BLOCK_SIZE` for igual ao valor de [`innodb_page_size`](innodb-parameters.html#sysvar_innodb_page_size), o tablespace pode conter apenas tabelas com um row format descompactado (`COMPACT`, `REDUNDANT` e `DYNAMIC`). Tabelas com um row format `COMPRESSED` têm um physical page size diferente das tabelas descompactadas. Portanto, tabelas compactadas não podem coexistir no mesmo tablespace que tabelas descompactadas.

  Para que um tablespace geral contenha tabelas compactadas, `FILE_BLOCK_SIZE` deve ser especificado, e o valor `FILE_BLOCK_SIZE` deve ser um page size compactado válido em relação ao valor de [`innodb_page_size`](innodb-parameters.html#sysvar_innodb_page_size). Além disso, o physical page size da tabela compactada (`KEY_BLOCK_SIZE`) deve ser igual a `FILE_BLOCK_SIZE/1024`. Por exemplo, se [`innodb_page_size=16K`](innodb-parameters.html#sysvar_innodb_page_size), e `FILE_BLOCK_SIZE=8K`, o `KEY_BLOCK_SIZE` da tabela deve ser 8. Para mais informações, veja [Seção 14.6.3.3, “General Tablespaces”](general-tablespaces.html "14.6.3.3 General Tablespaces").

* `USE LOGFILE GROUP`: Obrigatório para `NDB`, este é o nome de um log file group criado anteriormente usando [`CREATE LOGFILE GROUP`](create-logfile-group.html "13.1.15 CREATE LOGFILE GROUP Statement"). Não suportado para `InnoDB`, onde resulta em erro.

* `EXTENT_SIZE`: Esta opção é específica para NDB e não é suportada por InnoDB, onde resulta em erro. `EXTENT_SIZE` define o tamanho, em bytes, dos extents usados por quaisquer arquivos pertencentes ao tablespace. O valor padrão é 1M. O tamanho mínimo é 32K, e o máximo teórico é 2G, embora o tamanho máximo prático dependa de vários fatores. Na maioria dos casos, alterar o extent size não tem nenhum efeito mensurável no desempenho, e o valor padrão é recomendado para todas as situações, exceto as mais incomuns.

  Um extent é uma unidade de alocação de espaço em disco. Um extent é preenchido com a maior quantidade de dados que esse extent pode conter antes que outro extent seja usado. Em teoria, até 65.535 (64K) extents podem ser usados por data file; no entanto, o máximo recomendado é 32.768 (32K). O tamanho máximo recomendado para um único data file é 32G – ou seja, 32K extents × 1 MB por extent. Além disso, uma vez que um extent é alocado a uma determinada partition, ele não pode ser usado para armazenar dados de uma partition diferente; um extent não pode armazenar dados de mais de uma partition. Isso significa, por exemplo, que um tablespace com um único datafile cujo `INITIAL_SIZE` (descrito no item a seguir) é de 256 MB e cujo `EXTENT_SIZE` é de 128M tem apenas dois extents, e pode ser usado para armazenar dados de no máximo duas partitions de tabela Disk Data diferentes.

  Você pode ver quantos extents permanecem livres em um determinado data file consultando a tabela [`FILES`](information-schema-files-table.html "24.3.9 The INFORMATION_SCHEMA FILES Table") do Information Schema, e assim derivar uma estimativa de quanto espaço livre permanece no arquivo. Para mais discussões e exemplos, veja [Seção 24.3.9, “The INFORMATION_SCHEMA FILES Table”](information-schema-files-table.html "24.3.9 The INFORMATION_SCHEMA FILES Table").

* `INITIAL_SIZE`: Esta opção é específica para `NDB` e não é suportada por `InnoDB`, onde resulta em erro.

  O parâmetro `INITIAL_SIZE` define o tamanho total em bytes do data file que foi especificado usando `ADD DATATFILE`. Uma vez que este arquivo tenha sido criado, seu tamanho não pode ser alterado; no entanto, você pode adicionar mais data files ao tablespace usando [`ALTER TABLESPACE ... ADD DATAFILE`](alter-tablespace.html "13.1.9 ALTER TABLESPACE Statement").

  `INITIAL_SIZE` é opcional; seu valor padrão é 134217728 (128 MB).

  Em sistemas de 32 bits, o valor máximo suportado para `INITIAL_SIZE` é 4294967296 (4 GB).

* `AUTOEXTEND_SIZE`: Atualmente ignorado pelo MySQL; reservado para possível uso futuro. Não tem efeito em nenhuma versão do MySQL 5.7 ou MySQL NDB Cluster 7.5, independentemente do storage engine usado.

* `MAX_SIZE`: Atualmente ignorado pelo MySQL; reservado para possível uso futuro. Não tem efeito em nenhuma versão do MySQL 5.7 ou MySQL NDB Cluster 7.5, independentemente do storage engine usado.

* `NODEGROUP`: Atualmente ignorado pelo MySQL; reservado para possível uso futuro. Não tem efeito em nenhuma versão do MySQL 5.7 ou MySQL NDB Cluster 7.5, independentemente do storage engine usado.

* `WAIT`: Atualmente ignorado pelo MySQL; reservado para possível uso futuro. Não tem efeito em nenhuma versão do MySQL 5.7 ou MySQL NDB Cluster 7.5, independentemente do storage engine usado.

* `COMMENT`: Atualmente ignorado pelo MySQL; reservado para possível uso futuro. Não tem efeito em nenhuma versão do MySQL 5.7 ou MySQL NDB Cluster 7.5, independentemente do storage engine usado.

* `ENGINE`: Define o storage engine que usa o tablespace, onde *`engine_name`* é o nome do storage engine. Atualmente, apenas o storage engine `InnoDB` é suportado pelas versões padrão do MySQL 5.7. O MySQL NDB Cluster 7.5 suporta tablespaces `NDB` e `InnoDB`. O valor da variável de sistema [`default_storage_engine`](server-system-variables.html#sysvar_default_storage_engine) é usado para `ENGINE` se a opção não for especificada.

#### Notas

* Para as regras que cobrem a nomeação de tablespaces do MySQL, veja [Seção 9.2, “Schema Object Names”](identifiers.html "9.2 Schema Object Names"). Além dessas regras, o caractere barra (“/”) não é permitido, nem você pode usar nomes que começam com `innodb_`, pois este prefixo é reservado para uso do sistema.

* Tablespaces não suportam tabelas temporárias.
* As configurações [`innodb_file_per_table`](innodb-parameters.html#sysvar_innodb_file_per_table), [`innodb_file_format`](innodb-parameters.html#sysvar_innodb_file_format) e [`innodb_file_format_max`](innodb-parameters.html#sysvar_innodb_file_format_max) não têm influência nas operações `CREATE TABLESPACE`. [`innodb_file_per_table`](innodb-parameters.html#sysvar_innodb_file_per_table) não precisa ser habilitado. Tablespaces gerais suportam todos os row formats de tabela, independentemente das configurações de file format. Da mesma forma, tablespaces gerais suportam a adição de tabelas de qualquer row format usando [`CREATE TABLE ... TABLESPACE`](create-table.html "13.1.18 CREATE TABLE Statement"), independentemente das configurações de file format.

* [`innodb_strict_mode`](innodb-parameters.html#sysvar_innodb_strict_mode) não é aplicável a tablespaces gerais. As regras de gerenciamento de tablespace são estritamente aplicadas independentemente de [`innodb_strict_mode`](innodb-parameters.html#sysvar_innodb_strict_mode). Se os parâmetros `CREATE TABLESPACE` estiverem incorretos ou incompatíveis, a operação falha independentemente da configuração de [`innodb_strict_mode`](innodb-parameters.html#sysvar_innodb_strict_mode). Quando uma tabela é adicionada a um tablespace geral usando [`CREATE TABLE ... TABLESPACE`](create-table.html "13.1.18 CREATE TABLE Statement") ou [`ALTER TABLE ... TABLESPACE`](alter-table.html "13.1.8 ALTER TABLE Statement"), [`innodb_strict_mode`](innodb-parameters.html#sysvar_innodb_strict_mode) é ignorado, mas a instrução é avaliada como se [`innodb_strict_mode`](innodb-parameters.html#sysvar_innodb_strict_mode) estivesse habilitado.

* Use `DROP TABLESPACE` para remover um tablespace. Todas as tabelas devem ser removidas de um tablespace usando [`DROP TABLE`](drop-table.html "13.1.29 DROP TABLE Statement") antes de remover o tablespace. Antes de remover um tablespace NDB Cluster, você também deve remover todos os seus data files usando uma ou mais instruções [`ALTER TABLESPACE ... DROP DATATFILE`](alter-tablespace.html "13.1.9 ALTER TABLESPACE Statement"). Veja [Seção 21.6.11.1, “NDB Cluster Disk Data Objects”](mysql-cluster-disk-data-objects.html "21.6.11.1 NDB Cluster Disk Data Objects").

* Todas as partes de uma tabela `InnoDB` adicionada a um tablespace geral `InnoDB` residem no tablespace geral, incluindo Indexes e páginas [`BLOB`](blob.html "11.3.4 The BLOB and TEXT Types").

  Para uma tabela `NDB` atribuída a um tablespace, apenas as colunas que não são indexadas são armazenadas em disco e realmente usam os data files do tablespace. Indexes e colunas indexadas para todas as tabelas `NDB` são sempre mantidas em memória.

* Semelhante ao system tablespace, truncar ou remover tabelas armazenadas em um tablespace geral cria espaço livre internamente no data file [.ibd](glossary.html#glos_ibd_file ".ibd file") do tablespace geral, que só pode ser usado para novos dados `InnoDB`. O espaço não é liberado de volta para o sistema operacional, como acontece com tablespaces file-per-table.

* Um tablespace geral não está associado a nenhum Database ou schema.

* [`ALTER TABLE ... DISCARD TABLESPACE`](alter-table.html "13.1.8 ALTER TABLE Statement") e [`ALTER TABLE ...IMPORT TABLESPACE`](alter-table.html "13.1.8 ALTER TABLE Statement") não são suportados para tabelas que pertencem a um tablespace geral.

* O servidor usa metadata locking em nível de tablespace para DDL que faz referência a tablespaces gerais. Em comparação, o servidor usa metadata locking em nível de tabela para DDL que faz referência a tablespaces file-per-table.

* Um tablespace gerado ou existente não pode ser alterado para um tablespace geral.

* Tabelas armazenadas em um tablespace geral só podem ser abertas no MySQL 5.7.6 ou posterior devido à adição de novos table flags.

* Não há conflito entre nomes de tablespaces gerais e nomes de tablespaces file-per-table. O caractere “/”, presente nos nomes de tablespaces file-per-table, não é permitido em nomes de tablespaces gerais.

* [**mysqldump**](mysqldump.html "4.5.4 mysqldump — A Database Backup Program") e [**mysqlpump**](mysqlpump.html "4.5.6 mysqlpump — A Database Backup Program") não fazem dump de instruções `CREATE TABLESPACE` do `InnoDB`.

#### Exemplos de InnoDB

Este exemplo demonstra a criação de um tablespace geral e a adição de três tabelas descompactadas de diferentes row formats.

```sql
mysql> CREATE TABLESPACE `ts1` ADD DATAFILE 'ts1.ibd' ENGINE=INNODB;

mysql> CREATE TABLE t1 (c1 INT PRIMARY KEY) TABLESPACE ts1 ROW_FORMAT=REDUNDANT;

mysql> CREATE TABLE t2 (c1 INT PRIMARY KEY) TABLESPACE ts1 ROW_FORMAT=COMPACT;

mysql> CREATE TABLE t3 (c1 INT PRIMARY KEY) TABLESPACE ts1 ROW_FORMAT=DYNAMIC;
```

Este exemplo demonstra a criação de um tablespace geral e a adição de uma tabela compactada. O exemplo assume um valor padrão de [`innodb_page_size`](innodb-parameters.html#sysvar_innodb_page_size) de 16K. O `FILE_BLOCK_SIZE` de 8192 exige que a tabela compactada tenha um `KEY_BLOCK_SIZE` de 8.

```sql
mysql> CREATE TABLESPACE `ts2` ADD DATAFILE 'ts2.ibd' FILE_BLOCK_SIZE = 8192 Engine=InnoDB;

mysql> CREATE TABLE t4 (c1 INT PRIMARY KEY) TABLESPACE ts2 ROW_FORMAT=COMPRESSED KEY_BLOCK_SIZE=8;
```

#### Exemplo de NDB

Suponha que você deseje criar um tablespace NDB Cluster Disk Data chamado `myts` usando um datafile chamado `mydata-1.dat`. Um tablespace `NDB` sempre requer o uso de um log file group que consiste em um ou mais arquivos de log undo. Para este exemplo, primeiro criamos um log file group chamado `mylg` que contém um arquivo de log undo chamado `myundo-1.dat`, usando a instrução [`CREATE LOGFILE GROUP`](create-logfile-group.html "13.1.15 CREATE LOGFILE GROUP Statement") mostrada aqui:

```sql
mysql> CREATE LOGFILE GROUP myg1
    ->     ADD UNDOFILE 'myundo-1.dat'
    ->     ENGINE=NDB;
Query OK, 0 rows affected (3.29 sec)
```

Agora você pode criar o tablespace descrito anteriormente usando a seguinte instrução:

```sql
mysql> CREATE TABLESPACE myts
    ->     ADD DATAFILE 'mydata-1.dat'
    ->     USE LOGFILE GROUP mylg
    ->     ENGINE=NDB;
Query OK, 0 rows affected (2.98 sec)
```

Agora você pode criar uma tabela Disk Data usando uma instrução [`CREATE TABLE`](create-table.html "13.1.18 CREATE TABLE Statement") com as opções `TABLESPACE` e `STORAGE DISK`, semelhante ao que é mostrado aqui:

```sql
mysql> CREATE TABLE mytable (
    ->     id INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    ->     lname VARCHAR(50) NOT NULL,
    ->     fname VARCHAR(50) NOT NULL,
    ->     dob DATE NOT NULL,
    ->     joined DATE NOT NULL,
    ->     INDEX(last_name, first_name)
    -> )
    ->     TABLESPACE myts STORAGE DISK
    ->     ENGINE=NDB;
Query OK, 0 rows affected (1.41 sec)
```

É importante notar que apenas as colunas `dob` e `joined` de `mytable` são realmente armazenadas em disco, devido ao fato de que as colunas `id`, `lname` e `fname` são todas indexadas.

Como mencionado anteriormente, quando `CREATE TABLESPACE` é usado com `ENGINE [=] NDB`, um tablespace e um data file associado são criados em cada node de dados do NDB Cluster. Você pode verificar se os data files foram criados e obter informações sobre eles consultando a tabela [`FILES`](information-schema-files-table.html "24.3.9 The INFORMATION_SCHEMA FILES Table") do Information Schema, conforme mostrado aqui:

```sql
mysql> SELECT FILE_NAME, FILE_TYPE, LOGFILE_GROUP_NAME, STATUS, EXTRA
    ->     FROM INFORMATION_SCHEMA.FILES
    ->     WHERE TABLESPACE_NAME = 'myts';

+--------------+------------+--------------------+--------+----------------+
| file_name    | file_type  | logfile_group_name | status | extra          |
+--------------+------------+--------------------+--------+----------------+
| mydata-1.dat | DATAFILE   | mylg               | NORMAL | CLUSTER_NODE=5 |
| mydata-1.dat | DATAFILE   | mylg               | NORMAL | CLUSTER_NODE=6 |
| NULL         | TABLESPACE | mylg               | NORMAL | NULL           |
+--------------+------------+--------------------+--------+----------------+
3 rows in set (0.01 sec)
```

Para informações e exemplos adicionais, veja [Seção 21.6.11.1, “NDB Cluster Disk Data Objects”](mysql-cluster-disk-data-objects.html "21.6.11.1 NDB Cluster Disk Data Objects").