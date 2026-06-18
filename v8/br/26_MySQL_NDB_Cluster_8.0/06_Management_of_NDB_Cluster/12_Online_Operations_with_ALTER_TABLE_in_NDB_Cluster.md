### 25.6.12 Operações online com ALTER TABLE no NDB Cluster

O MySQL NDB Cluster 8.0 suporta alterações de esquema de tabela online usando `ALTER TABLE ... ALGORITHM=DEFAULT|INPLACE|COPY`. O NDB Cluster lida com `COPY` e `INPLACE` conforme descrito nos próximos parágrafos.

Para `ALGORITHM=COPY`, o manipulador do NDB Cluster **mysqld** realiza as seguintes ações:

- Instrui os nós de dados a criar uma cópia vazia da tabela e a fazer as alterações no esquema necessárias nessa cópia.

- Leitura de linhas da tabela original e escrita delas na cópia.

- Diga aos nós de dados para descartar a tabela original e, em seguida, renomear a cópia.

Às vezes, chamamos isso de "cópia" ou "offline" `ALTER TABLE`.

As operações de DML não são permitidas simultaneamente com uma cópia `ALTER TABLE`.

O **mysqld** no qual a instrução de cópia `ALTER TABLE` é emitida obtém uma restrição de metadados, mas isso ocorre apenas nesse **mysqld**. Outros clientes `NDB` podem modificar os dados das linhas durante uma cópia `ALTER TABLE`, resultando em inconsistência.

Para o `ALGORITHM=INPLACE`, o manipulador do NDB Cluster instrui os nós de dados a fazer as alterações necessárias e não realiza nenhuma cópia de dados.

Também nos referimos a isso como um `ALTER TABLE` "não cópia" ou "online".

Um `ALTER TABLE` não copiado permite operações DML concorrentes.

`ALGORITHM=INSTANT` não é suportado pelo NDB 8.0.

Independentemente do algoritmo utilizado, o **mysqld** obtém um Bloqueio de Esquema Global (GSL) durante a execução de **ALTER TABLE**. Isso impede a execução de qualquer (outro) DDL ou backups simultaneamente neste ou em qualquer outro nó SQL do cluster. Isso normalmente não é um problema, a menos que o `ALTER TABLE` demore muito tempo.

Nota

Algumas versões mais antigas do NDB Cluster usavam uma sintaxe específica para operações online `NDB` `ALTER TABLE`. Essa sintaxe foi posteriormente removida.

As operações que adicionam e removem índices em colunas de largura variável das tabelas `NDB` ocorrem online. As operações online não são de cópia; ou seja, não é necessário que os índices sejam recriados. Elas não bloqueiam a tabela que está sendo alterada do acesso por outros nós da API em um NDB Cluster (mas veja as Limitações das operações online do NDB, mais adiante nesta seção). Tais operações não exigem o modo de usuário único para as alterações da tabela `NDB` feitas em um NDB Cluster com vários nós da API; as transações podem continuar ininterruptas durante as operações DDL online.

O `ALGORITHM=INPLACE` pode ser usado para realizar operações online `ADD COLUMN`, `ADD INDEX` (incluindo instruções `CREATE INDEX`), e `DROP INDEX` em tabelas `NDB`. O renomeamento online de tabelas `NDB` também é suportado (antes da versão NDB 8.0, tais colunas não podiam ser renomeadas online).

Colunas baseadas em disco não podem ser adicionadas às tabelas `NDB` online. Isso significa que, se você deseja adicionar uma coluna de memória a uma tabela `NDB` que usa uma opção de nível de tabela `STORAGE DISK`, você deve declarar explicitamente que a nova coluna usa armazenamento baseado em memória. Por exemplo, supondo que você já tenha criado o espaço de tabelas `ts1`, imagine que você cria a tabela `t1` da seguinte forma:

```
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

```
mysql> ALTER TABLE t1
     >     ADD COLUMN c3 INT COLUMN_FORMAT DYNAMIC STORAGE MEMORY,
     >     ALGORITHM=INPLACE;
Query OK, 0 rows affected (1.25 sec)
Records: 0  Duplicates: 0  Warnings: 0
```

Esta declaração falha se a opção `STORAGE MEMORY` for omitida:

```
mysql> ALTER TABLE t1
     >     ADD COLUMN c4 INT COLUMN_FORMAT DYNAMIC,
     >     ALGORITHM=INPLACE;
ERROR 1846 (0A000): ALGORITHM=INPLACE is not supported. Reason:
Adding column(s) or add/reorganize partition not supported online. Try
ALGORITHM=COPY.
```

Se você omitir a opção `COLUMN_FORMAT DYNAMIC`, o formato dinâmico da coluna será empregado automaticamente, mas será emitido um aviso, conforme mostrado aqui:

```
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
) /*!50606 TABLESPACE ts_1 STORAGE DISK */ ENGINE=ndbcluster DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci
1 row in set (0.03 sec)
```

Nota

As palavras-chave `STORAGE` e `COLUMN_FORMAT` são suportadas apenas no NDB Cluster; em qualquer outra versão do MySQL, tentar usar qualquer uma dessas palavras-chave em uma declaração `CREATE TABLE` ou `ALTER TABLE` resulta em um erro.

É também possível usar a declaração `ALTER TABLE ... REORGANIZE PARTITION, ALGORITHM=INPLACE` sem a opção `partition_names INTO (partition_definitions)` em tabelas `NDB`. Isso pode ser usado para redistribuir os dados do NDB Cluster entre novos nós de dados que foram adicionados ao cluster online. Isso *não* realiza nenhuma desfragmentação, o que requer uma declaração `OPTIMIZE TABLE` ou `ALTER TABLE` nulo. Para mais informações, consulte a Seção 25.6.7, “Adicionando Nodos de Dados do NDB Cluster Online”.

#### Limitações das operações online do NDB

As operações online `DROP COLUMN` não são suportadas.

As declarações online `ALTER TABLE`, `CREATE INDEX` ou `DROP INDEX` que adicionam colunas ou adicionam ou excluem índices estão sujeitas às seguintes limitações:

- Um determinado `ALTER TABLE` pode usar apenas um dos `ADD COLUMN`, `ADD INDEX` ou `DROP INDEX`. Uma ou mais colunas podem ser adicionadas online em uma única declaração; apenas um índice pode ser criado ou excluído online em uma única declaração.

- A tabela que está sendo alterada não está bloqueada em relação aos nós da API, exceto para o nó em que uma operação online `ALTER TABLE`, `ADD COLUMN`, `ADD INDEX` ou `DROP INDEX` (ou uma instrução `CREATE INDEX` ou `DROP INDEX`) está sendo executada. No entanto, a tabela está bloqueada contra quaisquer outras operações que tenham origem no *mesmo* nó da API enquanto a operação online estiver sendo executada.

- A tabela que será alterada deve ter uma chave primária explícita; a chave primária oculta criada pelo motor de armazenamento `NDB` não é suficiente para esse propósito.

- O mecanismo de armazenamento usado pela tabela não pode ser alterado online.

- O tablespace usado pela tabela não pode ser alterado online. A partir do NDB 8.0.21, uma declaração como `ALTER TABLE ndb_table ... ALGORITHM=INPLACE, TABLESPACE=new_tablespace` é especificamente desaconselhada. (Bug #99269, Bug #31180526)

- Quando usado com tabelas de NDB Cluster Disk Data, não é possível alterar o tipo de armazenamento (`DISK` ou `MEMORY`) de uma coluna online. Isso significa que, quando você adicionar ou remover um índice de forma que a operação seja realizada online e você queira alterar o tipo de armazenamento da coluna ou colunas, você deve usar `ALGORITHM=COPY` na instrução que adiciona ou remove o índice.

As colunas que serão adicionadas online não podem usar o tipo `BLOB` ou `TEXT` e devem atender aos seguintes critérios:

- As colunas devem ser dinâmicas; ou seja, deve ser possível criá-las usando `COLUMN_FORMAT DYNAMIC`. Se você omitir a opção `COLUMN_FORMAT DYNAMIC`, o formato dinâmico da coluna será empregado automaticamente.

- As colunas devem permitir valores de `NULL` e não ter nenhum valor padrão explícito diferente de `NULL`. As colunas adicionadas online são automaticamente criadas como `DEFAULT NULL`, como pode ser visto aqui:

  ```
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
  ) ENGINE=ndbcluster DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci
  1 row in set (0.00 sec)
  ```

- As colunas devem ser adicionadas após quaisquer colunas existentes. Se você tentar adicionar uma coluna online antes de qualquer coluna existente ou usando a palavra-chave `FIRST`, a declaração falhará com um erro.

- As colunas da tabela existentes não podem ser reordenadas online.

Para operações online `ALTER TABLE` em tabelas `NDB`, as colunas de formato fixo são convertidas em dinâmicas quando são adicionadas online, ou quando índices são criados ou excluídos online, conforme mostrado aqui (repetindo as instruções `CREATE TABLE` e `ALTER TABLE` apenas para maior clareza):

```
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

```
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

As colunas não são convertidas de `FIXED` para o formato de coluna `DYNAMIC` por meio de operações de renomeação. Para obter mais informações sobre `COLUMN_FORMAT`, consulte a Seção 15.1.20, “Instrução CREATE TABLE”.

As palavras-chave `KEY`, `CONSTRAINT` e `IGNORE` são suportadas em declarações `ALTER TABLE` usando `ALGORITHM=INPLACE`.

A definição de `MAX_ROWS` para 0 usando uma declaração online `ALTER TABLE` é desaconselhada. Você deve usar uma cópia `ALTER TABLE` para realizar essa operação. (Bug #21960004)
