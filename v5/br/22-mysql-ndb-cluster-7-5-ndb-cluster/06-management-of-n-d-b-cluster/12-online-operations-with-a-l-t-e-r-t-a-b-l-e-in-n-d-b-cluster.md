### 21.6.12 Operações Online com ALTER TABLE no NDB Cluster

O MySQL NDB Cluster 7.5 e 7.6 suporta mudanças online de schema de tabela usando [`ALTER TABLE ... ALGORITHM=DEFAULT|INPLACE|COPY`](alter-table.html#alter-table-performance "Performance and Space Requirements"). O NDB Cluster lida com `COPY` e `INPLACE` conforme descrito nos próximos parágrafos.

Para `ALGORITHM=COPY`, o handler [**mysqld**](mysqld.html "4.3.1 mysqld — The MySQL Server") do NDB Cluster executa as seguintes ações:

* Informa os data nodes para criar uma cópia vazia da tabela e para aplicar as alterações de schema necessárias a esta cópia.

* Lê as rows da tabela original e as escreve na cópia.

* Informa os data nodes para fazer o DROP da tabela original e, em seguida, renomear a cópia.

Às vezes, nos referimos a isso como um `ALTER TABLE` de "cópia" ou "offline".

Operações DML não são permitidas concorrentemente com um `ALTER TABLE` de cópia.

O [**mysqld**](mysqld.html "4.3.1 mysqld — The MySQL Server") no qual a instrução `ALTER TABLE` de cópia é emitida adquire um metadata lock, mas isso está em vigor apenas naquele [**mysqld**](mysqld.html "4.3.1 mysqld — The MySQL Server"). Outros clientes `NDB` podem modificar os dados da row durante um `ALTER TABLE` de cópia, resultando em inconsistência.

Para `ALGORITHM=INPLACE`, o handler do NDB Cluster informa os data nodes para fazer as alterações necessárias, e não executa nenhuma cópia de dados.

Também nos referimos a isso como um `ALTER TABLE` "sem cópia" ou "online".

Um `ALTER TABLE` sem cópia permite operações DML concorrentes.

Independentemente do algoritmo utilizado, o [**mysqld**](mysqld.html "4.3.1 mysqld — The MySQL Server") adquire um Global Schema Lock (GSL) durante a execução do **ALTER TABLE**; isso impede a execução de qualquer outra DDL ou backups concorrentemente neste ou em qualquer outro SQL node no cluster. Isso normalmente não é problemático, a menos que o `ALTER TABLE` demore muito tempo.

Note

Algumas versões mais antigas do NDB Cluster usavam uma sintaxe específica para [`NDB`](mysql-cluster.html "Chapter 21 MySQL NDB Cluster 7.5 and NDB Cluster 7.6") para operações `ALTER TABLE` online. Essa sintaxe foi removida desde então.

Operações que adicionam e removem Indexes em colunas de largura variável de tabelas [`NDB`](mysql-cluster.html "Chapter 21 MySQL NDB Cluster 7.5 and NDB Cluster 7.6") ocorrem online. Operações online não são de cópia (noncopying); ou seja, elas não exigem que os Indexes sejam recriados. Elas não bloqueiam a tabela que está sendo alterada do acesso por outros API nodes em um NDB Cluster (mas consulte [Limitations of NDB online operations](mysql-cluster-online-operations.html#mysql-cluster-online-limitations "Limitations of NDB online operations"), mais adiante nesta seção). Tais operações não exigem o modo de usuário único para alterações de tabelas [`NDB`](mysql-cluster.html "Chapter 21 MySQL NDB Cluster 7.5 and NDB Cluster 7.6") feitas em um NDB Cluster com múltiplos API nodes; as Transactions podem continuar ininterruptamente durante operações DDL online.

`ALGORITHM=INPLACE` pode ser usado para realizar operações online de `ADD COLUMN`, `ADD INDEX` (incluindo instruções `CREATE INDEX`) e `DROP INDEX` em tabelas [`NDB`](mysql-cluster.html "Chapter 21 MySQL NDB Cluster 7.5 and NDB Cluster 7.6"). A renomeação online de tabelas [`NDB`](mysql-cluster.html "Chapter 21 MySQL NDB Cluster 7.5 and NDB Cluster 7.6") também é suportada.

Colunas baseadas em disco (Disk-based columns) não podem ser adicionadas a tabelas [`NDB`](mysql-cluster.html "Chapter 21 MySQL NDB Cluster 7.5 and NDB Cluster 7.6") online. Isso significa que, se você deseja adicionar uma coluna in-memory a uma tabela [`NDB`](mysql-cluster.html "Chapter 21 MySQL NDB Cluster 7.5 and NDB Cluster 7.6") que usa a opção `STORAGE DISK` de nível de tabela, você deve declarar explicitamente que a nova coluna usa armazenamento baseado em memória. Por exemplo — assumindo que você já criou o tablespace `ts1` — suponha que você crie a tabela `t1` da seguinte forma:

```sql
mysql> CREATE TABLE t1 (
     >     c1 INT NOT NULL PRIMARY KEY,
     >     c2 VARCHAR(30)
     >     )
     >     TABLESPACE ts1 STORAGE DISK
     >     ENGINE NDB;
Query OK, 0 rows affected (1.73 sec)
Records: 0  Duplicates: 0  Warnings: 0
```

Você pode adicionar uma nova coluna in-memory a esta tabela online conforme mostrado aqui:

```sql
mysql> ALTER TABLE t1
     >     ADD COLUMN c3 INT COLUMN_FORMAT DYNAMIC STORAGE MEMORY,
     >     ALGORITHM=INPLACE;
Query OK, 0 rows affected (1.25 sec)
Records: 0  Duplicates: 0  Warnings: 0
```

Esta instrução falha se a opção `STORAGE MEMORY` for omitida:

```sql
mysql> ALTER TABLE t1
     >     ADD COLUMN c4 INT COLUMN_FORMAT DYNAMIC,
     >     ALGORITHM=INPLACE;
ERROR 1846 (0A000): ALGORITHM=INPLACE is not supported. Reason:
Adding column(s) or add/reorganize partition not supported online. Try
ALGORITHM=COPY.
```

Se você omitir a opção `COLUMN_FORMAT DYNAMIC`, o formato de coluna dinâmico é empregado automaticamente, mas um warning é emitido, conforme mostrado aqui:

```sql
mysql> ALTER ONLINE TABLE t1 ADD COLUMN c4 INT STORAGE MEMORY;
Query OK, 0 rows affected, 1 warning (1.17 sec)
Records: 0  Duplicates: 0  Warnings: 0

mysql> SHOW WARNINGS\G
*************************** 1. row ***************************
  Level: Warning
   Code: 1478
Message: DYNAMIC column c4 with STORAGE DISK is not supported, column will
become FIXED


mysql> SHOW CREATE TABLE t1\G
*************************** 1. row ***************************
       Table: t1
Create Table: CREATE TABLE `t1` (
  `c1` int(11) NOT NULL,
  `c2` varchar(30) DEFAULT NULL,
  `c3` int(11) /*!50606 STORAGE MEMORY */ /*!50606 COLUMN_FORMAT DYNAMIC */ DEFAULT NULL,
  `c4` int(11) /*!50606 STORAGE MEMORY */ DEFAULT NULL,
  PRIMARY KEY (`c1`)
) /*!50606 TABLESPACE ts_1 STORAGE DISK */ ENGINE=ndbcluster DEFAULT CHARSET=latin1
1 row in set (0.03 sec)
```

Note

As keywords `STORAGE` e `COLUMN_FORMAT` são suportadas apenas no NDB Cluster; em qualquer outra versão do MySQL, a tentativa de usar qualquer uma dessas keywords em uma instrução [`CREATE TABLE`](create-table.html "13.1.18 CREATE TABLE Statement") ou [`ALTER TABLE`](alter-table.html "13.1.8 ALTER TABLE Statement") resulta em um error.

Também é possível usar a instrução `ALTER TABLE ... REORGANIZE PARTITION, ALGORITHM=INPLACE` sem a opção `partition_names INTO (partition_definitions)` em tabelas [`NDB`](mysql-cluster.html "Chapter 21 MySQL NDB Cluster 7.5 and NDB Cluster 7.6"). Isso pode ser usado para redistribuir dados do NDB Cluster entre novos data nodes que foram adicionados ao cluster online. Isso *não* realiza nenhuma defragmentação, o que requer uma instrução [`OPTIMIZE TABLE`](optimize-table.html "13.7.2.4 OPTIMIZE TABLE Statement") ou uma instrução [`ALTER TABLE`](alter-table.html "13.1.8 ALTER TABLE Statement") nula. Para mais informações, consulte [Section 21.6.7, “Adding NDB Cluster Data Nodes Online”](mysql-cluster-online-add-node.html "21.6.7 Adding NDB Cluster Data Nodes Online").

#### Limitações das operações online do NDB

Operações online de `DROP COLUMN` não são suportadas.

Instruções online [`ALTER TABLE`](alter-table.html "13.1.8 ALTER TABLE Statement"), [`CREATE INDEX`](create-index.html "13.1.14 CREATE INDEX Statement"), ou [`DROP INDEX`](drop-index.html "13.1.25 DROP INDEX Statement") que adicionam colunas ou adicionam ou removem Indexes estão sujeitas às seguintes limitações:

* Um [`ALTER TABLE`](alter-table.html "13.1.8 ALTER TABLE Statement") online específico pode usar apenas um dos seguintes: `ADD COLUMN`, `ADD INDEX`, ou `DROP INDEX`. Uma ou mais colunas podem ser adicionadas online em uma única instrução; apenas um Index pode ser criado ou removido online em uma única instrução.

* A tabela sendo alterada não é bloqueada em relação a outros API nodes além daquele no qual uma operação online [`ALTER TABLE`](alter-table.html "13.1.8 ALTER TABLE Statement") `ADD COLUMN`, `ADD INDEX` ou `DROP INDEX` (ou instrução [`CREATE INDEX`](create-index.html "13.1.14 CREATE INDEX Statement") ou [`DROP INDEX`](drop-index.html "13.1.25 DROP INDEX Statement") ) está sendo executada. No entanto, a tabela é bloqueada contra quaisquer outras operações originadas no *mesmo* API node enquanto a operação online está sendo executada.

* A tabela a ser alterada deve ter uma Primary Key explícita; a Primary Key oculta criada pelo storage engine [`NDB`](mysql-cluster.html "Chapter 21 MySQL NDB Cluster 7.5 e NDB Cluster 7.6") não é suficiente para este propósito.

* O storage engine usado pela tabela não pode ser alterado online.
* O tablespace usado pela tabela não pode ser alterado online. (Bug #99269, Bug #31180526)

* Quando usadas com tabelas NDB Cluster Disk Data, não é possível alterar o tipo de storage (`DISK` ou `MEMORY`) de uma coluna online. Isso significa que, ao adicionar ou remover um Index de tal forma que a operação seria realizada online, e você deseja que o tipo de storage da coluna ou colunas seja alterado, você deve usar `ALGORITHM=COPY` na instrução que adiciona ou remove o Index.

Colunas a serem adicionadas online não podem usar os tipos [`BLOB`](blob.html "11.3.4 The BLOB and TEXT Types") ou [`TEXT`](blob.html "11.3.4 The BLOB and TEXT Types"), e devem atender aos seguintes critérios:

* As colunas devem ser dinâmicas; ou seja, deve ser possível criá-las usando `COLUMN_FORMAT DYNAMIC`. Se você omitir a opção `COLUMN_FORMAT DYNAMIC`, o formato de coluna dinâmico será empregado automaticamente.

* As colunas devem permitir valores `NULL` e não ter nenhum valor DEFAULT explícito além de `NULL`. Colunas adicionadas online são criadas automaticamente como `DEFAULT NULL`, como pode ser visto aqui:

  ```sql
  mysql> CREATE TABLE t2 (
       >     c1 INT NOT NULL AUTO_INCREMENT PRIMARY KEY
       >     ) ENGINE=NDB;
  Query OK, 0 rows affected (1.44 sec)

  mysql> ALTER TABLE t2
       >     ADD COLUMN c2 INT,
       >     ADD COLUMN c3 INT,
       >     ALGORITHM=INPLACE;
  Query OK, 0 rows affected, 2 warnings (0.93 sec)

  mysql> SHOW CREATE TABLE t1\G
  *************************** 1. row ***************************
         Table: t1
  Create Table: CREATE TABLE `t2` (
    `c1` int(11) NOT NULL AUTO_INCREMENT,
    `c2` int(11) DEFAULT NULL,
    `c3` int(11) DEFAULT NULL,
    PRIMARY KEY (`c1`)
  ) ENGINE=ndbcluster DEFAULT CHARSET=latin1
  1 row in set (0.00 sec)
  ```

* As colunas devem ser adicionadas após quaisquer colunas existentes. Se você tentar adicionar uma coluna online antes de quaisquer colunas existentes ou usando a keyword `FIRST`, a instrução falhará com um error.

* Colunas de tabela existentes não podem ser reordenadas online.

Para operações [`ALTER TABLE`](alter-table.html "13.1.8 ALTER TABLE Statement") online em tabelas [`NDB`](mysql-cluster.html "Chapter 21 MySQL NDB Cluster 7.5 and NDB Cluster 7.6"), colunas de formato fixo são convertidas para dinâmico quando são adicionadas online, ou quando Indexes são criados ou removidos online, conforme mostrado aqui (repetindo as instruções `CREATE TABLE` e `ALTER TABLE` mostradas anteriormente para fins de clareza):

```sql
mysql> CREATE TABLE t2 (
     >     c1 INT NOT NULL AUTO_INCREMENT PRIMARY KEY
     >     ) ENGINE=NDB;
Query OK, 0 rows affected (1.44 sec)

mysql> ALTER TABLE t2
     >     ADD COLUMN c2 INT,
     >     ADD COLUMN c3 INT,
     >     ALGORITHM=INPLACE;
Query OK, 0 rows affected, 2 warnings (0.93 sec)

mysql> SHOW WARNINGS;
*************************** 1. row ***************************
  Level: Warning
   Code: 1478
Message: Converted FIXED field 'c2' to DYNAMIC to enable online ADD COLUMN
*************************** 2. row ***************************
  Level: Warning
   Code: 1478
Message: Converted FIXED field 'c3' to DYNAMIC to enable online ADD COLUMN
2 rows in set (0.00 sec)
```

Apenas a coluna ou colunas a serem adicionadas online devem ser dinâmicas. As colunas existentes não precisam ser; isso inclui a Primary Key da tabela, que também pode ser `FIXED`, conforme mostrado aqui:

```sql
mysql> CREATE TABLE t3 (
     >     c1 INT NOT NULL AUTO_INCREMENT PRIMARY KEY COLUMN_FORMAT FIXED
     >     ) ENGINE=NDB;
Query OK, 0 rows affected (2.10 sec)

mysql> ALTER TABLE t3 ADD COLUMN c2 INT, ALGORITHM=INPLACE;
Query OK, 0 rows affected, 1 warning (0.78 sec)
Records: 0  Duplicates: 0  Warnings: 0

mysql> SHOW WARNINGS;
*************************** 1. row ***************************
  Level: Warning
   Code: 1478
Message: Converted FIXED field 'c2' to DYNAMIC to enable online ADD COLUMN
1 row in set (0.00 sec)
```

Colunas não são convertidas do formato de coluna `FIXED` para `DYNAMIC` por operações de renomeação. Para mais informações sobre `COLUMN_FORMAT`, consulte [Section 13.1.18, “CREATE TABLE Statement”](create-table.html "13.1.18 CREATE TABLE Statement").

As keywords `KEY`, `CONSTRAINT` e `IGNORE` são suportadas em instruções [`ALTER TABLE`](alter-table.html "13.1.8 ALTER TABLE Statement") usando `ALGORITHM=INPLACE`.

A partir do NDB Cluster 7.5.7, não é permitido definir `MAX_ROWS` como 0 usando uma instrução `ALTER TABLE` online. Você deve usar um `ALTER TABLE` de cópia para realizar esta operação. (Bug #21960004)