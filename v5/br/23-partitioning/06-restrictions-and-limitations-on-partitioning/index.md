## 22.6 Restrições e Limitações no Partitioning

[22.6.1 Chaves de Partitioning, Primary Keys e Unique Keys](partitioning-limitations-partitioning-keys-unique-keys.html)

[22.6.2 Limitações de Partitioning Relacionadas a Storage Engines](partitioning-limitations-storage-engines.html)

[22.6.3 Limitações de Partitioning Relacionadas a Funções](partitioning-limitations-functions.html)

[22.6.4 Partitioning e Locking](partitioning-limitations-locking.html)

Esta seção discute as restrições e limitações atuais no suporte a Partitioning do MySQL.

**Constructos Proibidos.** Os seguintes constructos não são permitidos em expressões de Partitioning:

* Stored procedures, stored functions, loadable functions, ou plugins.

* Variáveis declaradas ou user variables.

Para obter uma lista de funções SQL que são permitidas em expressões de Partitioning, consulte [Section 22.6.3, “Partitioning Limitations Relating to Functions”](partitioning-limitations-functions.html "22.6.3 Limitações de Partitioning Relacionadas a Funções").

**Operadores Aritméticos e Lógicos.**

O uso dos operadores aritméticos [`+`](arithmetic-functions.html#operator_plus), [`-`](arithmetic-functions.html#operator_minus) e [`*`](arithmetic-functions.html#operator_times) é permitido em expressões de Partitioning. No entanto, o resultado deve ser um valor integer ou `NULL` (exceto no caso de Partitioning `[LINEAR] KEY`, conforme discutido em outras partes deste capítulo; consulte [Section 22.2, “Partitioning Types”](partitioning-types.html "22.2 Partitioning Types"), para mais informações).

O operador [`DIV`](arithmetic-functions.html#operator_div) também é suportado, mas o operador [`/`](arithmetic-functions.html#operator_divide) não é permitido. (Bug #30188, Bug #33182)

Os operadores de bit [`|`](bit-functions.html#operator_bitwise-or), [`&`](bit-functions.html#operator_bitwise-and), [`^`](bit-functions.html#operator_bitwise-xor), [`<<`](bit-functions.html#operator_left-shift), [`>>`](bit-functions.html#operator_right-shift) e [`~`](bit-functions.html#operator_bitwise-invert) não são permitidos em expressões de Partitioning.

**Declarações HANDLER.**

Anteriormente, a declaração [`HANDLER`](handler.html "13.2.4 HANDLER Statement") não era suportada com tabelas particionadas. Esta limitação é removida a partir do MySQL 5.7.1.

**Server SQL mode.**

Tabelas que utilizam Partitioning definido pelo usuário não preservam o SQL mode em vigor no momento em que foram criadas. Conforme discutido em [Section 5.1.10, “Server SQL Modes”](sql-mode.html "5.1.10 Server SQL Modes"), os resultados de muitas funções e operadores MySQL podem mudar de acordo com o server SQL mode. Portanto, uma alteração no SQL mode a qualquer momento após a criação de tabelas particionadas pode levar a grandes mudanças no comportamento de tais tabelas e pode facilmente levar à corrupção ou perda de dados. Por essas razões, *é altamente recomendável que você nunca altere o server SQL mode após criar tabelas particionadas*.

**Exemplos.** Os exemplos a seguir ilustram algumas mudanças no comportamento de tabelas particionadas devido a uma alteração no server SQL mode:

1. **Tratamento de erros.** Suponha que você crie uma tabela particionada cuja expressão de Partitioning seja algo como `column DIV 0` ou `column MOD 0`, conforme mostrado aqui:

   ```sql
   mysql> CREATE TABLE tn (c1 INT)
       ->     PARTITION BY LIST(1 DIV c1) (
       ->       PARTITION p0 VALUES IN (NULL),
       ->       PARTITION p1 VALUES IN (1)
       -> );
   Query OK, 0 rows affected (0.05 sec)
   ```

   O comportamento padrão do MySQL é retornar `NULL` para o resultado de uma divisão por zero, sem produzir nenhum erro:

   ```sql
   mysql> SELECT @@sql_mode;
   +------------+
   | @@sql_mode |
   +------------+
   |            |
   +------------+
   1 row in set (0.00 sec)


   mysql> INSERT INTO tn VALUES (NULL), (0), (1);
   Query OK, 3 rows affected (0.00 sec)
   Records: 3  Duplicates: 0  Warnings: 0
   ```

   No entanto, a alteração do server SQL mode para tratar a divisão por zero como um erro e forçar o strict error handling faz com que a mesma declaração [`INSERT`](insert.html "13.2.5 INSERT Statement") falhe, conforme mostrado aqui:

   ```sql
   mysql> SET sql_mode='STRICT_ALL_TABLES,ERROR_FOR_DIVISION_BY_ZERO';
   Query OK, 0 rows affected (0.00 sec)

   mysql> INSERT INTO tn VALUES (NULL), (0), (1);
   ERROR 1365 (22012): Division by 0
   ```

2. **Acessibilidade da tabela.** Às vezes, uma mudança no server SQL mode pode tornar as tabelas particionadas inutilizáveis. A seguinte declaração [`CREATE TABLE`](create-table.html "13.1.18 CREATE TABLE Statement") pode ser executada com sucesso apenas se o modo [`NO_UNSIGNED_SUBTRACTION`](sql-mode.html#sqlmode_no_unsigned_subtraction) estiver em vigor:

   ```sql
   mysql> SELECT @@sql_mode;
   +------------+
   | @@sql_mode |
   +------------+
   |            |
   +------------+
   1 row in set (0.00 sec)

   mysql> CREATE TABLE tu (c1 BIGINT UNSIGNED)
       ->   PARTITION BY RANGE(c1 - 10) (
       ->     PARTITION p0 VALUES LESS THAN (-5),
       ->     PARTITION p1 VALUES LESS THAN (0),
       ->     PARTITION p2 VALUES LESS THAN (5),
       ->     PARTITION p3 VALUES LESS THAN (10),
       ->     PARTITION p4 VALUES LESS THAN (MAXVALUE)
       -> );
   ERROR 1563 (HY000): Partition constant is out of partition function domain

   mysql> SET sql_mode='NO_UNSIGNED_SUBTRACTION';
   Query OK, 0 rows affected (0.00 sec)

   mysql> SELECT @@sql_mode;
   +-------------------------+
   | @@sql_mode              |
   +-------------------------+
   | NO_UNSIGNED_SUBTRACTION |
   +-------------------------+
   1 row in set (0.00 sec)

   mysql> CREATE TABLE tu (c1 BIGINT UNSIGNED)
       ->   PARTITION BY RANGE(c1 - 10) (
       ->     PARTITION p0 VALUES LESS THAN (-5),
       ->     PARTITION p1 VALUES LESS THAN (0),
       ->     PARTITION p2 VALUES LESS THAN (5),
       ->     PARTITION p3 VALUES LESS THAN (10),
       ->     PARTITION p4 VALUES LESS THAN (MAXVALUE)
       -> );
   Query OK, 0 rows affected (0.05 sec)
   ```

   Se você remover o server SQL mode [`NO_UNSIGNED_SUBTRACTION`](sql-mode.html#sqlmode_no_unsigned_subtraction) após criar `tu`, talvez não consiga mais acessar esta tabela:

   ```sql
   mysql> SET sql_mode='';
   Query OK, 0 rows affected (0.00 sec)

   mysql> SELECT * FROM tu;
   ERROR 1563 (HY000): Partition constant is out of partition function domain
   mysql> INSERT INTO tu VALUES (20);
   ERROR 1563 (HY000): Partition constant is out of partition function domain
   ```

   Consulte também [Section 5.1.10, “Server SQL Modes”](sql-mode.html "5.1.10 Server SQL Modes").

Os server SQL modes também impactam a replicação de tabelas particionadas. SQL modes díspares no source e no replica podem levar a expressões de Partitioning sendo avaliadas de forma diferente; isso pode fazer com que a distribuição de dados entre as partitions seja diferente nas cópias do source e do replica de uma determinada tabela, e pode até fazer com que `INSERTs` em tabelas particionadas que são bem-sucedidos no source falhem no replica. Para obter melhores resultados, você deve sempre usar o mesmo server SQL mode no source e no replica.

**Considerações de Performance.** Alguns efeitos das operações de Partitioning na performance são dados na lista a seguir:

* **Operações do File System.** As operações de Partitioning e repartitioning (como [`ALTER TABLE`](alter-table-partition-operations.html "13.1.8.1 ALTER TABLE Partition Operations") com `PARTITION BY ...`, `REORGANIZE PARTITION` ou `REMOVE PARTITIONING`) dependem de operações do file system para sua implementação. Isso significa que a velocidade dessas operações é afetada por fatores como tipo e características do file system, velocidade do disco, swap space, eficiência do sistema operacional no tratamento de arquivos e opções e variáveis do MySQL server relacionadas ao tratamento de arquivos. Em particular, você deve garantir que [`large_files_support`](server-system-variables.html#sysvar_large_files_support) esteja habilitado e que [`open_files_limit`](server-system-variables.html#sysvar_open_files_limit) esteja definido corretamente. Para tabelas particionadas usando o storage engine `MyISAM`, aumentar [`myisam_max_sort_file_size`](server-system-variables.html#sysvar_myisam_max_sort_file_size) pode melhorar a performance; operações de Partitioning e repartitioning envolvendo tabelas `InnoDB` podem ser tornadas mais eficientes habilitando [`innodb_file_per_table`](innodb-parameters.html#sysvar_innodb_file_per_table).

  Consulte também [Número máximo de partitions](partitioning-limitations.html#partitioning-limitations-max-partitions "Maximum number of partitions").

* **MyISAM e uso de File Descriptor de Partition.** Para uma tabela [`MyISAM`](myisam-storage-engine.html "15.2 The MyISAM Storage Engine") particionada, o MySQL usa 2 descritores de arquivo (file descriptors) para cada partition, para cada tabela aberta. Isso significa que você precisa de muito mais descritores de arquivo para realizar operações em uma tabela `MyISAM` particionada do que em uma tabela idêntica a ela, exceto pelo fato de esta última não ser particionada, particularmente ao realizar operações [`ALTER TABLE`](alter-table-partition-operations.html "13.1.8.1 ALTER TABLE Partition Operations").

  Assuma uma tabela `MyISAM` `t` com 100 partitions, como a tabela criada por esta declaração SQL:

  ```sql
  CREATE TABLE t (c1 VARCHAR(50))
  PARTITION BY KEY (c1) PARTITIONS 100
  ENGINE=MYISAM;
  ```

  Note

  Para brevidade, usamos Partitioning `KEY` para a tabela mostrada neste exemplo, mas o uso de descritor de arquivo, conforme descrito aqui, aplica-se a todas as tabelas `MyISAM` particionadas, independentemente do tipo de Partitioning empregado. Tabelas particionadas que usam outros storage engines, como [`InnoDB`](innodb-storage-engine.html "Chapter 14 The InnoDB Storage Engine"), não são afetadas por este problema.

  Agora, assuma que você deseja reparticionar `t` para que tenha 101 partitions, usando a declaração mostrada aqui:

  ```sql
  ALTER TABLE t PARTITION BY KEY (c1) PARTITIONS 101;
  ```

  Para processar esta declaração `ALTER TABLE`, o MySQL usa 402 descritores de arquivo—isto é, dois para cada uma das 100 partitions originais, mais dois para cada uma das 101 novas partitions. Isso ocorre porque todas as partitions (antigas e novas) devem ser abertas simultaneamente durante a reorganização dos dados da tabela. É recomendável que, se você espera realizar tais operações, garanta que a variável de sistema [`open_files_limit`](server-system-variables.html#sysvar_open_files_limit) não esteja definida muito baixa para acomodá-las.

* **Table locks.** Geralmente, o processo que executa uma operação de Partitioning em uma tabela obtém um write lock na tabela. As operações de leitura dessas tabelas são relativamente não afetadas; as operações [`INSERT`](insert.html "13.2.5 INSERT Statement") e [`UPDATE`](update.html "13.2.11 UPDATE Statement") pendentes são realizadas assim que a operação de Partitioning é concluída. Para exceções específicas do `InnoDB` a esta limitação, consulte [Partitioning Operations](innodb-online-ddl-operations.html#online-ddl-partitioning "Partitioning Operations").

* **Storage engine.** As operações de Partitioning, queries e operações de `UPDATE` geralmente tendem a ser mais rápidas com tabelas `MyISAM` do que com tabelas `InnoDB` ou [`NDB`](mysql-cluster.html "Chapter 21 MySQL NDB Cluster 7.5 and NDB Cluster 7.6").

* **Indexes; partition pruning.** Assim como acontece com tabelas não particionadas, o uso adequado de Indexes pode acelerar significativamente as queries em tabelas particionadas. Além disso, projetar tabelas particionadas e queries nessas tabelas para tirar proveito do Partition Pruning pode melhorar drasticamente a performance. Consulte [Section 22.4, “Partition Pruning”](partitioning-pruning.html "22.4 Partition Pruning"), para mais informações.

  Anteriormente, o index condition pushdown não era suportado para tabelas particionadas. Esta limitação foi removida no MySQL 5.7.3. Consulte [Section 8.2.1.5, “Index Condition Pushdown Optimization”](index-condition-pushdown-optimization.html "8.2.1.5 Index Condition Pushdown Optimization").

* **Performance com LOAD DATA.** No MySQL 5.7, [`LOAD DATA`](load-data.html "13.2.6 LOAD DATA Statement") usa buffering para melhorar a performance. Você deve estar ciente de que o buffer utiliza 130 KB de memória por partition para conseguir isso.

**Número máximo de Partitions.** O número máximo possível de partitions para uma determinada tabela que não usa o storage engine [`NDB`](mysql-cluster.html "Chapter 21 MySQL NDB Cluster 7.5 and NDB Cluster 7.6") é 8192. Este número inclui subpartitions.

O número máximo possível de partitions definidas pelo usuário para uma tabela que usa o storage engine [`NDB`](mysql-cluster.html "Chapter 21 MySQL NDB Cluster 7.5 and NDB Cluster 7.6") é determinado de acordo com a versão do software NDB Cluster em uso, o número de data nodes e outros fatores. Consulte [NDB and user-defined partitioning](mysql-cluster-nodes-groups.html#mysql-cluster-nodes-groups-user-partitioning "NDB and user-defined partitioning"), para mais informações.

Se, ao criar tabelas com um grande número de partitions (mas menor que o máximo), você encontrar uma mensagem de erro como `Got error ... from storage engine: Out of resources when opening file`, você poderá resolver o problema aumentando o valor da variável de sistema [`open_files_limit`](server-system-variables.html#sysvar_open_files_limit). No entanto, isso depende do sistema operacional e pode não ser possível ou aconselhável em todas as plataformas; consulte [Section B.3.2.16, “File Not Found and Similar Errors”](not-enough-file-handles.html "B.3.2.16 File Not Found and Similar Errors"), para mais informações. Em alguns casos, usar um grande número (centenas) de partitions também pode não ser aconselhável devido a outras preocupações, portanto, usar mais partitions não leva automaticamente a melhores resultados.

Consulte também [Operações do File System](partitioning-limitations.html#partitioning-limitations-file-system-ops "File system operations").

**Query cache não suportado.** O query cache não é suportado para tabelas particionadas e é desabilitado automaticamente para queries envolvendo tabelas particionadas. O query cache não pode ser habilitado para tais queries.

**Key Caches por Partition.** No MySQL 5.7, key caches são suportados para tabelas [`MyISAM`](myisam-storage-engine.html "15.2 The MyISAM Storage Engine") particionadas, usando as declarações [`CACHE INDEX`](cache-index.html "13.7.6.2 CACHE INDEX Statement") e [`LOAD INDEX INTO CACHE`](load-index.html "13.7.6.5 LOAD INDEX INTO CACHE Statement"). Key caches podem ser definidos para uma, várias ou todas as partitions, e Indexes para uma, várias ou todas as partitions podem ser pré-carregados em key caches.

**Foreign Keys não suportadas para tabelas InnoDB particionadas.** Tabelas particionadas que usam o storage engine [`InnoDB`](innodb-storage-engine.html "Chapter 14 The InnoDB Storage Engine") não suportam foreign keys. Mais especificamente, isso significa que as duas declarações a seguir são verdadeiras:

1. Nenhuma definição de uma tabela `InnoDB` que emprega Partitioning definido pelo usuário pode conter referências de foreign key; nenhuma tabela `InnoDB` cuja definição contenha referências de foreign key pode ser particionada.

2. Nenhuma definição de tabela `InnoDB` pode conter uma referência de foreign key para uma tabela particionada pelo usuário; nenhuma tabela `InnoDB` com Partitioning definido pelo usuário pode conter colunas referenciadas por foreign keys.

O escopo das restrições listadas acima inclui todas as tabelas que usam o storage engine `InnoDB`. As declarações [`CREATE TABLE`](create-table-foreign-keys.html "13.1.18.5 FOREIGN KEY Constraints") e [`ALTER TABLE`](alter-table.html "13.1.8 ALTER TABLE Statement") que resultariam em tabelas violando essas restrições não são permitidas.

**ALTER TABLE ... ORDER BY.** Uma declaração `ALTER TABLE ... ORDER BY column` executada em uma tabela particionada causa o ordenamento das linhas apenas dentro de cada partition.

**Efeitos nas declarações REPLACE pela modificação de Primary Keys.** Pode ser desejável em alguns casos (consulte [Section 22.6.1, “Partitioning Keys, Primary Keys, and Unique Keys”](partitioning-limitations-partitioning-keys-unique-keys.html "22.6.1 Partitioning Keys, Primary Keys, and Unique Keys")) modificar a Primary Key de uma tabela. Esteja ciente de que, se sua aplicação usa declarações [`REPLACE`](replace.html "13.2.8 REPLACE Statement") e você fizer isso, os resultados dessas declarações podem ser drasticamente alterados. Consulte [Section 13.2.8, “REPLACE Statement”](replace.html "13.2.8 REPLACE Statement"), para mais informações e um exemplo.

**FULLTEXT Indexes.** Tabelas particionadas não suportam Indexes ou buscas `FULLTEXT`, mesmo para tabelas particionadas que empregam o storage engine [`InnoDB`](innodb-storage-engine.html "Chapter 14 The InnoDB Storage Engine") ou [`MyISAM`](myisam-storage-engine.html "15.2 The MyISAM Storage Engine").

**Colunas Espaciais.** Colunas com data types espaciais como `POINT` ou `GEOMETRY` não podem ser usadas em tabelas particionadas.

**Tabelas Temporárias.** Tabelas temporárias (`Temporary tables`) não podem ser particionadas. (Bug #17497)

**Tabelas de Log.** Não é possível particionar as tabelas de log; uma declaração [`ALTER TABLE ... PARTITION BY ...`](alter-table-partition-operations.html "13.1.8.1 ALTER TABLE Partition Operations") em tal tabela falha com um erro.

**Data Type da Chave de Partitioning.** Uma chave de Partitioning deve ser uma coluna integer ou uma expressão que se resolva em um integer. Expressões que empregam colunas [`ENUM`](enum.html "11.3.5 The ENUM Type") não podem ser usadas. O valor da coluna ou expressão também pode ser `NULL`. (Consulte [Section 22.2.7, “How MySQL Partitioning Handles NULL”](partitioning-handling-nulls.html "22.2.7 How MySQL Partitioning Handles NULL").)

Existem duas exceções a esta restrição:

1. Ao particionar por [`LINEAR`] `KEY`, é possível usar colunas de qualquer data type MySQL válido, exceto [`TEXT`](blob.html "11.3.4 The BLOB and TEXT Types") ou [`BLOB`](blob.html "11.3.4 The BLOB and TEXT Types") como chaves de Partitioning, pois as funções internas de hash de chave do MySQL produzem o data type correto a partir desses tipos. Por exemplo, as duas declarações [`CREATE TABLE`](create-table.html "13.1.18 CREATE TABLE Statement") a seguir são válidas:

   ```sql
   CREATE TABLE tkc (c1 CHAR)
   PARTITION BY KEY(c1)
   PARTITIONS 4;

   CREATE TABLE tke
       ( c1 ENUM('red', 'orange', 'yellow', 'green', 'blue', 'indigo', 'violet') )
   PARTITION BY LINEAR KEY(c1)
   PARTITIONS 6;
   ```

2. Ao particionar por `RANGE COLUMNS` ou `LIST COLUMNS`, é possível usar colunas string, [`DATE`](datetime.html "11.2.2 The DATE, DATETIME, and TIMESTAMP Types") e [`DATETIME`](datetime.html "11.2.2 The DATE, DATETIME, and TIMESTAMP Types"). Por exemplo, cada uma das seguintes declarações [`CREATE TABLE`](create-table.html "13.1.18 CREATE TABLE Statement") é válida:

   ```sql
   CREATE TABLE rc (c1 INT, c2 DATE)
   PARTITION BY RANGE COLUMNS(c2) (
       PARTITION p0 VALUES LESS THAN('1990-01-01'),
       PARTITION p1 VALUES LESS THAN('1995-01-01'),
       PARTITION p2 VALUES LESS THAN('2000-01-01'),
       PARTITION p3 VALUES LESS THAN('2005-01-01'),
       PARTITION p4 VALUES LESS THAN(MAXVALUE)
   );

   CREATE TABLE lc (c1 INT, c2 CHAR(1))
   PARTITION BY LIST COLUMNS(c2) (
       PARTITION p0 VALUES IN('a', 'd', 'g', 'j', 'm', 'p', 's', 'v', 'y'),
       PARTITION p1 VALUES IN('b', 'e', 'h', 'k', 'n', 'q', 't', 'w', 'z'),
       PARTITION p2 VALUES IN('c', 'f', 'i', 'l', 'o', 'r', 'u', 'x', NULL)
   );
   ```

Nenhuma das exceções anteriores se aplica aos tipos de coluna [`BLOB`](blob.html "11.3.4 The BLOB and TEXT Types") ou [`TEXT`](blob.html "11.3.4 The BLOB and TEXT Types").

**Subqueries.** Uma chave de Partitioning não pode ser uma subquery, mesmo que essa subquery se resolva em um valor integer ou `NULL`.

**Prefixos de Index de Coluna não suportados para Partitioning KEY.** Ao criar uma tabela que é particionada por key, quaisquer colunas na chave de Partitioning que usem prefixos de coluna não são usadas na função de Partitioning da tabela. Considere a seguinte declaração [`CREATE TABLE`](create-table.html "13.1.18 CREATE TABLE Statement"), que possui três colunas [`VARCHAR`](char.html "11.3.2 The CHAR and VARCHAR Types") e cuja Primary Key usa todas as três colunas e especifica prefixos para duas delas:

```sql
CREATE TABLE t1 (
    a VARCHAR(10000),
    b VARCHAR(25),
    c VARCHAR(10),
    PRIMARY KEY (a(10), b, c(2))
) PARTITION BY KEY() PARTITIONS 2;
```

Esta declaração é aceita, mas a tabela resultante é, na verdade, criada como se você tivesse emitido a seguinte declaração, usando apenas a coluna da Primary Key que não inclui um prefixo (coluna `b`) para a chave de Partitioning:

```sql
CREATE TABLE t1 (
    a VARCHAR(10000),
    b VARCHAR(25),
    c VARCHAR(10),
    PRIMARY KEY (a(10), b, c(2))
) PARTITION BY KEY(b) PARTITIONS 2;
```

Nenhum aviso é emitido ou qualquer outra indicação é fornecida de que isso ocorreu, exceto no caso em que todas as colunas especificadas para a chave de Partitioning usam prefixos, caso em que a declaração falha com a mensagem de erro mostrada aqui:

```sql
mysql> CREATE TABLE t2 (
    ->     a VARCHAR(10000),
    ->     b VARCHAR(25),
    ->     c VARCHAR(10),
    ->     PRIMARY KEY (a(10), b(5), c(2))
    -> ) PARTITION BY KEY() PARTITIONS 2;
ERROR 1503 (HY000): A PRIMARY KEY must include all columns in the
table's partitioning function
```

Isso também ocorre ao alterar ou atualizar tais tabelas, e inclui casos em que as colunas usadas na função de Partitioning são definidas implicitamente como aquelas na Primary Key da tabela, empregando uma cláusula `PARTITION BY KEY()` vazia.

Este é um problema conhecido que é abordado no MySQL 8.0 pela depreciação do comportamento permissivo; no MySQL 8.0, se quaisquer colunas que usam prefixos forem incluídas na função de Partitioning de uma tabela, o servidor registra um aviso apropriado para cada coluna, ou levanta um erro descritivo, se necessário. (Permitir o uso de colunas com prefixos em chaves de Partitioning está sujeito à remoção total em uma futura versão do MySQL.)

Para informações gerais sobre Partitioning de tabelas por key, consulte [Section 22.2.5, “KEY Partitioning”](partitioning-key.html "22.2.5 KEY Partitioning").

**Problemas com Subpartitions.** Subpartitions devem usar Partitioning `HASH` ou `KEY`. Apenas partitions `RANGE` e `LIST` podem ser subparticionadas; partitions `HASH` e `KEY` não podem ser subparticionadas.

`SUBPARTITION BY KEY` requer que a coluna ou colunas de subpartitioning sejam especificadas explicitamente, ao contrário do caso com `PARTITION BY KEY`, onde pode ser omitido (caso em que a coluna da Primary Key da tabela é usada por padrão). Considere a tabela criada por esta declaração:

```sql
CREATE TABLE ts (
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(30)
);
```

Você pode criar uma tabela com as mesmas colunas, particionada por `KEY`, usando uma declaração como esta:

```sql
CREATE TABLE ts (
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(30)
)
PARTITION BY KEY()
PARTITIONS 4;
```

A declaração anterior é tratada como se tivesse sido escrita assim, com a coluna da Primary Key da tabela usada como a coluna de Partitioning:

```sql
CREATE TABLE ts (
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(30)
)
PARTITION BY KEY(id)
PARTITIONS 4;
```

No entanto, a seguinte declaração que tenta criar uma tabela subparticionada usando a coluna padrão como a coluna de subpartitioning falha, e a coluna deve ser especificada para que a declaração seja bem-sucedida, conforme mostrado aqui:

```sql
mysql> CREATE TABLE ts (
    ->     id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    ->     name VARCHAR(30)
    -> )
    -> PARTITION BY RANGE(id)
    -> SUBPARTITION BY KEY()
    -> SUBPARTITIONS 4
    -> (
    ->     PARTITION p0 VALUES LESS THAN (100),
    ->     PARTITION p1 VALUES LESS THAN (MAXVALUE)
    -> );
ERROR 1064 (42000): You have an error in your SQL syntax; check the manual that
corresponds to your MySQL server version for the right syntax to use near ')

mysql> CREATE TABLE ts (
    ->     id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    ->     name VARCHAR(30)
    -> )
    -> PARTITION BY RANGE(id)
    -> SUBPARTITION BY KEY(id)
    -> SUBPARTITIONS 4
    -> (
    ->     PARTITION p0 VALUES LESS THAN (100),
    ->     PARTITION p1 VALUES LESS THAN (MAXVALUE)
    -> );
Query OK, 0 rows affected (0.07 sec)
```

Este é um problema conhecido (consulte Bug #51470).

**Opções DATA DIRECTORY e INDEX DIRECTORY.** `DATA DIRECTORY` e `INDEX DIRECTORY` estão sujeitos às seguintes restrições quando usados com tabelas particionadas:

* As opções de nível de tabela `DATA DIRECTORY` e `INDEX DIRECTORY` são ignoradas (consulte Bug #32091).

* No Windows, as opções `DATA DIRECTORY` e `INDEX DIRECTORY` não são suportadas para partitions ou subpartitions individuais de tabelas [`MyISAM`](myisam-storage-engine.html "15.2 The MyISAM Storage Engine"). No entanto, você pode usar `DATA DIRECTORY` para partitions ou subpartitions individuais de tabelas [`InnoDB`](innodb-storage-engine.html "Chapter 14 The InnoDB Storage Engine").

**Reparando e Reconstruindo Tabelas Particionadas.** As declarações [`CHECK TABLE`](check-table.html "13.7.2.2 CHECK TABLE Statement"), [`OPTIMIZE TABLE`](optimize-table.html "13.7.2.4 OPTIMIZE TABLE Statement"), [`ANALYZE TABLE`](analyze-table.html "13.7.2.1 ANALYZE TABLE Statement") e [`REPAIR TABLE`](repair-table.html "13.7.2.5 REPAIR TABLE Statement") são suportadas para tabelas particionadas.

Além disso, você pode usar `ALTER TABLE ... REBUILD PARTITION` para reconstruir uma ou mais partitions de uma tabela particionada; `ALTER TABLE ... REORGANIZE PARTITION` também faz com que as partitions sejam reconstruídas. Consulte [Section 13.1.8, “ALTER TABLE Statement”](alter-table.html "13.1.8 ALTER TABLE Statement"), para mais informações sobre essas duas declarações.

A partir do MySQL 5.7.2, as operações `ANALYZE`, `CHECK`, `OPTIMIZE`, `REPAIR` e `TRUNCATE` são suportadas com subpartitions. `REBUILD` também era sintaxe aceita antes do MySQL 5.7.5, embora isso não tivesse efeito. (Bug #19075411, Bug #73130) Consulte também [Section 13.1.8.1, “ALTER TABLE Partition Operations”](alter-table-partition-operations.html "13.1.8.1 ALTER TABLE Partition Operations").

[**mysqlcheck**](mysqlcheck.html "4.5.3 mysqlcheck — A Table Maintenance Program"), [**myisamchk**](myisamchk.html "4.6.3 myisamchk — MyISAM Table-Maintenance Utility") e [**myisampack**](myisampack.html "4.6.5 myisampack — Generate Compressed, Read-Only MyISAM Tables") não são suportados com tabelas particionadas.

**Opção FOR EXPORT (FLUSH TABLES).** A opção `FOR EXPORT` da declaração [`FLUSH TABLES`](flush.html#flush-tables-for-export-with-list) não é suportada para tabelas `InnoDB` particionadas no MySQL 5.7.4 e anteriores. (Bug #16943907)

**Delimitadores de nome de arquivo para Partitions e Subpartitions.** Os nomes de arquivo de partition e subpartition de tabela incluem delimitadores gerados como `#P#` e `#SP#`. A capitalização (lettercase) de tais delimitadores pode variar e não deve ser considerada fixa.