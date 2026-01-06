### 21.6.12 Operações online com ALTER TABLE no NDB Cluster

O MySQL NDB Cluster 7.5 e 7.6 suportam alterações de esquema de tabela online usando `ALTER TABLE ... ALGORITHM=DEFAULT|INPLACE|COPY`. O NDB Cluster lida com `COPY` e `INPLACE` conforme descrito nos próximos parágrafos.

Para `ALGORITHM=COPY`, o manipulador do NDB Cluster **mysqld** executa as seguintes ações:

- Instrui os nós de dados a criar uma cópia vazia da tabela e a fazer as alterações no esquema necessárias nessa cópia.

- Leitura de linhas da tabela original e escrita delas na cópia.

- Diga aos nós de dados para descartar a tabela original e, em seguida, renomear a cópia.

Às vezes, chamamos isso de "cópia" ou "ALTER TABLE" "offline".

As operações DML não são permitidas simultaneamente com uma cópia de `ALTER TABLE`.

O **mysqld** no qual a instrução `ALTER TABLE` de cópia é emitida obtém uma restrição de metadados, mas isso ocorre apenas nesse **mysqld**. Outros clientes do \[**NDB**] podem modificar os dados das linhas durante uma cópia de `ALTER TABLE`, resultando em inconsistência.

Para `ALGORITHM=INPLACE`, o manipulador do NDB Cluster instrui os nós de dados a fazerem as alterações necessárias e não realiza nenhuma cópia de dados.

Também chamamos isso de uma `ALTER TABLE` "não de cópia" ou "online".

Uma `ALTER TABLE` sem cópia permite operações DML concorrentes.

Independentemente do algoritmo utilizado, o **mysqld** obtém um Bloqueio de Esquema Global (GSL) durante a execução de **ALTER TABLE**; isso impede a execução de qualquer (outro) DDL ou backups simultaneamente neste ou em qualquer outro nó SQL do cluster. Isso normalmente não é um problema, a menos que a **ALTER TABLE** demore muito tempo.

Nota

Algumas versões mais antigas do NDB Cluster usavam uma sintaxe específica para operações de `ALTER TABLE` online no `NDB`. Essa sintaxe foi removida desde então.

As operações que adicionam e removem índices em colunas de largura variável das tabelas de `NDB` ocorrem online. As operações online não são de cópia; ou seja, não é necessário que os índices sejam recriados. Elas não bloqueiam a tabela que está sendo alterada do acesso por outros nós da API em um NDB Cluster (mas veja Limitações das operações online do NDB, mais adiante nesta seção). Tais operações não exigem o modo de usuário único para alterações de tabelas de `NDB` feitas em um NDB cluster com vários nós da API; as transações podem continuar ininterruptas durante operações DDL online.

O `ALGORITHM=INPLACE` pode ser usado para realizar operações de `ADD COLUMN`, `ADD INDEX` (incluindo instruções `CREATE INDEX`) e `DROP INDEX` em tabelas de `NDB` online. O renomeamento online de tabelas de `NDB` também é suportado.

Colunas baseadas em disco não podem ser adicionadas a tabelas de `NDB` online. Isso significa que, se você deseja adicionar uma coluna em memória a uma tabela de `NDB` que usa a opção `STORAGE DISK` em nível de tabela, você deve declarar explicitamente que a nova coluna usa armazenamento baseado em memória. Por exemplo, supondo que você já tenha criado o espaço de tabelas `ts1`, imagine que você cria a tabela `t1` da seguinte forma:

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

Você pode adicionar uma nova coluna de memória a esta tabela online, conforme mostrado aqui:

```sql
mysql> ALTER TABLE t1
     >     ADD COLUMN c3 INT COLUMN_FORMAT DYNAMIC STORAGE MEMORY,
     >     ALGORITHM=INPLACE;
Query OK, 0 rows affected (1.25 sec)
Records: 0  Duplicates: 0  Warnings: 0
```

Esta declaração falha se a opção `MEMÓRIA DE ARMAZENAMENTO` for omitida:

```sql
mysql> ALTER TABLE t1
     >     ADD COLUMN c4 INT COLUMN_FORMAT DYNAMIC,
     >     ALGORITHM=INPLACE;
ERROR 1846 (0A000): ALGORITHM=INPLACE is not supported. Reason:
Adding column(s) or add/reorganize partition not supported online. Try
ALGORITHM=COPY.
```

Se você omitir a opção `COLUMN_FORMAT DYNAMIC`, o formato de coluna dinâmico será empregado automaticamente, mas será emitido um aviso, conforme mostrado aqui:

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

Nota

As palavras-chave `STORAGE` e `COLUMN_FORMAT` são suportadas apenas no NDB Cluster; em qualquer outra versão do MySQL, tentar usar qualquer uma dessas palavras-chave em uma instrução `CREATE TABLE` ou `ALTER TABLE` resulta em um erro.

Também é possível usar a instrução `ALTER TABLE ... REORGANIZE PARTITION, ALGORITHM=INPLACE` sem a opção `partition_names INTO (partition_definitions)` em tabelas de `NDB` (mysql-cluster.html). Isso pode ser usado para redistribuir os dados do NDB Cluster entre novos nós de dados que foram adicionados ao cluster online. Isso *não* realiza nenhuma desfragmentação, o que requer uma instrução `OPTIMIZE TABLE` (optimize-table.html) ou `ALTER TABLE` (alter-table.html) nula. Para mais informações, consulte Seção 21.6.7, “Adicionando Nodos de Dados do NDB Cluster Online”.

#### Limitações das operações online do NDB

As operações `DROP COLUMN` online não são suportadas.

As instruções `ALTER TABLE` (alter-table.html), `CREATE INDEX` (create-index.html) ou `DROP INDEX` (drop-index.html) que adicionam colunas ou adicionam ou excluem índices estão sujeitas às seguintes limitações:

- Uma instrução `ALTER TABLE` online pode usar apenas uma das opções `ADD COLUMN`, `ADD INDEX` ou `DROP INDEX`. Uma ou mais colunas podem ser adicionadas online em uma única instrução; apenas um índice pode ser criado ou excluído online em uma única instrução.

- A tabela que está sendo alterada não está bloqueada em relação aos nós da API, exceto no nó em que uma operação de `ALTER TABLE` online (`ADD COLUMN`, `ADD INDEX` ou `DROP INDEX`) (ou uma declaração de `CREATE INDEX` ou `DROP INDEX`) é executada. No entanto, a tabela está bloqueada contra quaisquer outras operações que tenham origem no mesmo nó da API enquanto a operação online estiver sendo executada.

- A tabela que deve ser alterada deve ter uma chave primária explícita; a chave primária oculta criada pelo mecanismo de armazenamento `NDB` não é suficiente para esse propósito.

- O mecanismo de armazenamento usado pela tabela não pode ser alterado online.

- O espaço de tabela usado pela tabela não pode ser alterado online. (Bug #99269, Bug #31180526)

- Quando usado com tabelas de NDB Cluster Disk Data, não é possível alterar o tipo de armazenamento (`DISK` ou `MEMORY`) de uma coluna online. Isso significa que, quando você adicionar ou remover um índice de forma que a operação seja realizada online e você queira alterar o tipo de armazenamento da coluna ou colunas, você deve usar `ALGORITHM=COPY` na instrução que adiciona ou remove o índice.

As colunas que serão adicionadas online não podem usar os tipos `BLOB` ou `TEXT` e devem atender aos seguintes critérios:

- As colunas devem ser dinâmicas; ou seja, deve ser possível criá-las usando `COLUMN_FORMAT DYNAMIC`. Se você omitir a opção `COLUMN_FORMAT DYNAMIC`, o formato dinâmico da coluna será empregado automaticamente.

- As colunas devem permitir valores `NULL` e não ter nenhum valor padrão explícito diferente de `NULL`. Colunas adicionadas online são criadas automaticamente como `DEFAULT NULL`, como pode ser visto aqui:

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

- As colunas devem ser adicionadas após quaisquer colunas existentes. Se você tentar adicionar uma coluna online antes de qualquer coluna existente ou usando a palavra-chave `FIRST`, a instrução falhará com um erro.

- As colunas da tabela existentes não podem ser reordenadas online.

Para operações online de alteração de tabelas `ALTER TABLE` em tabelas `NDB`, as colunas de formato fixo são convertidas em dinâmicas quando são adicionadas online, ou quando índices são criados ou excluídos online, conforme mostrado aqui (repetir as declarações `CREATE TABLE` e `ALTER TABLE` apenas para fins de clareza):

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

Apenas a(s) coluna(s) a serem adicionadas online deve(m) ser dinâmica(s). As colunas existentes não precisam ser; isso inclui a chave primária da tabela, que também pode ser `FIXED`, como mostrado aqui:

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

As colunas não são convertidas do formato de coluna `FIXED` para `DYNAMIC` por meio de operações de renomeação. Para obter mais informações sobre `COLUMN_FORMAT`, consulte Seção 13.1.18, “Instrução CREATE TABLE”.

As palavras-chave `KEY`, `CONSTRAINT` e `IGNORE` são suportadas nas instruções `ALTER TABLE` usando `ALGORITHM=INPLACE`.

A partir do NDB Cluster 7.5.7, definir `MAX_ROWS` para 0 usando uma declaração `ALTER TABLE` online é desaconselhável. Você deve usar uma cópia da declaração `ALTER TABLE` para realizar essa operação. (Bug #21960004)
