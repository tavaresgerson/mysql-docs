#### 13.1.8.1 Operações de Particionamento ALTER TABLE

Cláusulas relacionadas a Partitioning para [`ALTER TABLE`](alter-table.html "13.1.8 ALTER TABLE Statement") podem ser usadas com tabelas particionadas para repartitioning, adicionar, dropar, descartar, importar, mesclar e dividir Partitions, e para executar manutenção de Partitioning.

* Simplesmente usar uma cláusula *`partition_options`* com [`ALTER TABLE`](alter-table.html "13.1.8 ALTER TABLE Statement") em uma tabela particionada realiza o repartitioning da tabela de acordo com o esquema de Partitioning definido pela *`partition_options`*. Esta cláusula sempre começa com `PARTITION BY` e segue a mesma sintaxe e outras regras que se aplicam à cláusula *`partition_options`* para [`CREATE TABLE`](create-table.html "13.1.18 CREATE TABLE Statement") (para informações mais detalhadas, veja [Section 13.1.18, “CREATE TABLE Statement”](create-table.html "13.1.18 CREATE TABLE Statement")), e também pode ser usada para particionar uma tabela existente que ainda não está particionada. Por exemplo, considere uma tabela (não particionada) definida conforme mostrado aqui:

  ```sql
  CREATE TABLE t1 (
      id INT,
      year_col INT
  );
  ```

  Esta tabela pode ser particionada por `HASH`, usando a coluna `id` como a Partitioning Key, em 8 Partitions por meio desta instrução:

  ```sql
  ALTER TABLE t1
      PARTITION BY HASH(id)
      PARTITIONS 8;
  ```

  O MySQL suporta uma opção `ALGORITHM` com `[SUB]PARTITION BY [LINEAR] KEY`. `ALGORITHM=1` faz com que o servidor use as mesmas `key-hashing functions` que o MySQL 5.1 ao calcular o posicionamento das linhas em Partitions; `ALGORITHM=2` significa que o servidor emprega as `key-hashing functions` implementadas e usadas por padrão para novas tabelas particionadas por `KEY` no MySQL 5.5 e posterior. (Tabelas particionadas criadas com as `key-hashing functions` empregadas no MySQL 5.5 e posterior não podem ser usadas por um servidor MySQL 5.1.) Não especificar a opção tem o mesmo efeito que usar `ALGORITHM=2`. Esta opção destina-se principalmente ao uso durante o upgrade ou downgrade de tabelas particionadas por `[LINEAR] KEY` entre MySQL 5.1 e versões posteriores do MySQL, ou para criar tabelas particionadas por `KEY` ou `LINEAR KEY` em um servidor MySQL 5.5 ou posterior que possa ser usado em um servidor MySQL 5.1.

  Para fazer upgrade de uma tabela particionada por `KEY` que foi criada no MySQL 5.1, primeiro execute [`SHOW CREATE TABLE`](show-create-table.html "13.7.5.10 SHOW CREATE TABLE Statement") e anote as colunas exatas e o número de Partitions mostrados. Agora execute uma instrução `ALTER TABLE` usando exatamente a mesma lista de colunas e número de Partitions do `CREATE TABLE` statement, enquanto adiciona `ALGORITHM=2` imediatamente após as palavras-chave `PARTITION BY`. (Você também deve incluir a palavra-chave `LINEAR` se ela foi usada para a definição original da tabela.) Um exemplo de uma sessão no cliente [**mysql**](mysql.html "4.5.1 mysql — The MySQL Command-Line Client") é mostrado aqui:

  ```sql
  mysql> SHOW CREATE TABLE p\G
  *************************** 1. row ***************************
         Table: p
  Create Table: CREATE TABLE `p` (
    `id` int(11) NOT NULL AUTO_INCREMENT,
    `cd` datetime NOT NULL,
    PRIMARY KEY (`id`)
  ) ENGINE=InnoDB DEFAULT CHARSET=latin1
  /*!50100 PARTITION BY LINEAR KEY (id)
  PARTITIONS 32 */
  1 row in set (0.00 sec)

  mysql> ALTER TABLE p PARTITION BY LINEAR KEY ALGORITHM=2 (id) PARTITIONS 32;
  Query OK, 0 rows affected (5.34 sec)
  Records: 0  Duplicates: 0  Warnings: 0

  mysql> SHOW CREATE TABLE p\G
  *************************** 1. row ***************************
         Table: p
  Create Table: CREATE TABLE `p` (
    `id` int(11) NOT NULL AUTO_INCREMENT,
    `cd` datetime NOT NULL,
    PRIMARY KEY (`id`)
  ) ENGINE=InnoDB DEFAULT CHARSET=latin1
  /*!50100 PARTITION BY LINEAR KEY (id)
  PARTITIONS 32 */
  1 row in set (0.00 sec)
  ```

  Fazer o downgrade de uma tabela criada usando o `key-hashing` padrão usado no MySQL 5.5 e posterior para permitir seu uso por um servidor MySQL 5.1 é semelhante, exceto que, neste caso, você deve usar `ALGORITHM=1` para forçar a reconstrução das Partitions da tabela usando as `key-hashing functions` do MySQL 5.1. Recomenda-se que você não faça isso, exceto quando necessário para compatibilidade com um servidor MySQL 5.1, pois as `KEY hashing functions` aprimoradas usadas por padrão no MySQL 5.5 e posterior fornecem correções para uma série de problemas encontrados na implementação mais antiga.

  Note

  Uma tabela atualizada por meio de `ALTER TABLE ... PARTITION BY ALGORITHM=2 [LINEAR] KEY ...` não pode mais ser usada por um servidor MySQL 5.1. (Essa tabela precisaria passar por um downgrade com `ALTER TABLE ... PARTITION BY ALGORITHM=1 [LINEAR] KEY ...` antes de poder ser usada novamente por um servidor MySQL 5.1.)

  A tabela resultante do uso de uma instrução `ALTER TABLE ... PARTITION BY` deve seguir as mesmas regras de uma criada usando `CREATE TABLE ... PARTITION BY`. Isso inclui as regras que regem a relação entre quaisquer unique keys (incluindo qualquer primary key) que a tabela possa ter e a coluna ou colunas usadas na Partitioning Expression, conforme discutido em [Section 22.6.1, “Partitioning Keys, Primary Keys, and Unique Keys”](partitioning-limitations-partitioning-keys-unique-keys.html "22.6.1 Partitioning Keys, Primary Keys, and Unique Keys"). As regras de `CREATE TABLE ... PARTITION BY` para especificar o número de Partitions também se aplicam a `ALTER TABLE ... PARTITION BY`.

  A cláusula *`partition_definition`* para `ALTER TABLE ADD PARTITION` suporta as mesmas opções da cláusula de mesmo nome para a instrução [`CREATE TABLE`](create-table.html "13.1.18 CREATE TABLE Statement"). (Veja [Section 13.1.18, “CREATE TABLE Statement”](create-table.html "13.1.18 CREATE TABLE Statement"), para a sintaxe e descrição.) Suponha que você tenha a tabela particionada criada conforme mostrado aqui:

  ```sql
  CREATE TABLE t1 (
      id INT,
      year_col INT
  )
  PARTITION BY RANGE (year_col) (
      PARTITION p0 VALUES LESS THAN (1991),
      PARTITION p1 VALUES LESS THAN (1995),
      PARTITION p2 VALUES LESS THAN (1999)
  );
  ```

  Você pode adicionar uma nova Partition `p3` a esta tabela para armazenar valores menores que `2002` da seguinte forma:

  ```sql
  ALTER TABLE t1 ADD PARTITION (PARTITION p3 VALUES LESS THAN (2002));
  ```

  `DROP PARTITION` pode ser usado para dropar uma ou mais Partitions `RANGE` ou `LIST`. Esta instrução não pode ser usada com Partitions `HASH` ou `KEY`; em vez disso, use `COALESCE PARTITION` (veja abaixo). Qualquer dado que estava armazenado nas Partitions dropadas nomeadas na lista *`partition_names`* é descartado. Por exemplo, dada a tabela `t1` definida anteriormente, você pode dropar as Partitions nomeadas `p0` e `p1` conforme mostrado aqui:

  ```sql
  ALTER TABLE t1 DROP PARTITION p0, p1;
  ```

  Note

  `DROP PARTITION` não funciona com tabelas que usam o Storage Engine [`NDB`](mysql-cluster.html "Chapter 21 MySQL NDB Cluster 7.5 and NDB Cluster 7.6"). Veja [Section 22.3.1, “Management of RANGE and LIST Partitions”](partitioning-management-range-list.html "22.3.1 Management of RANGE and LIST Partitions"), e [Section 21.2.7, “Known Limitations of NDB Cluster”](mysql-cluster-limitations.html "21.2.7 Known Limitations of NDB Cluster").

  `ADD PARTITION` e `DROP PARTITION` atualmente não suportam `IF [NOT] EXISTS`.

  As opções [`DISCARD PARTITION ... TABLESPACE`](alter-table.html "13.1.8 ALTER TABLE Statement") e [`IMPORT PARTITION ... TABLESPACE`](alter-table.html "13.1.8 ALTER TABLE Statement") estendem o recurso [Transportable Tablespace](glossary.html#glos_transportable_tablespace "transportable tablespace") para Partitions individuais da tabela `InnoDB`. Cada Partition de tabela `InnoDB` tem seu próprio tablespace file (arquivo `.ibd`). O recurso [Transportable Tablespace](glossary.html#glos_transportable_tablespace "transportable tablespace") facilita a cópia dos tablespaces de uma instância de servidor MySQL em execução para outra instância em execução, ou para realizar um restore na mesma instância. Ambas as opções aceitam uma lista de um ou mais nomes de Partition separados por vírgulas. Por exemplo:

  ```sql
  ALTER TABLE t1 DISCARD PARTITION p2, p3 TABLESPACE;
  ```

  ```sql
  ALTER TABLE t1 IMPORT PARTITION p2, p3 TABLESPACE;
  ```

  Ao executar [`DISCARD PARTITION ... TABLESPACE`](alter-table.html "13.1.8 ALTER TABLE Statement") e [`IMPORT PARTITION ... TABLESPACE`](alter-table.html "13.1.8 ALTER TABLE Statement") em tabelas subparticionadas, são permitidos tanto nomes de Partition quanto de subpartition. Quando um nome de Partition é especificado, as subpartitions dessa Partition são incluídas.

  O recurso [Transportable Tablespace](glossary.html#glos_transportable_tablespace "transportable tablespace") também suporta a cópia ou o restore de tabelas `InnoDB` particionadas. Para mais informações, veja [Section 14.6.1.3, “Importing InnoDB Tables”](innodb-table-import.html "14.6.1.3 Importing InnoDB Tables").

  Renomeações de tabelas particionadas são suportadas. Você pode renomear Partitions individuais indiretamente usando `ALTER TABLE ... REORGANIZE PARTITION`; no entanto, esta operação copia os dados da Partition.

  Para deletar linhas de Partitions selecionadas, use a opção `TRUNCATE PARTITION`. Esta opção aceita uma lista de um ou mais nomes de Partition, separados por vírgulas. Por exemplo, considere a tabela `t1` conforme definida aqui:

  ```sql
  CREATE TABLE t1 (
      id INT,
      year_col INT
  )
  PARTITION BY RANGE (year_col) (
      PARTITION p0 VALUES LESS THAN (1991),
      PARTITION p1 VALUES LESS THAN (1995),
      PARTITION p2 VALUES LESS THAN (1999),
      PARTITION p3 VALUES LESS THAN (2003),
      PARTITION p4 VALUES LESS THAN (2007)
  );
  ```

  Para deletar todas as linhas da Partition `p0`, use a seguinte instrução:

  ```sql
  ALTER TABLE t1 TRUNCATE PARTITION p0;
  ```

  A instrução mostrada acima tem o mesmo efeito que a seguinte instrução [`DELETE`](delete.html "13.2.2 DELETE Statement"):

  ```sql
  DELETE FROM t1 WHERE year_col < 1991;
  ```

  Ao truncar múltiplas Partitions, as Partitions não precisam ser contíguas: isso pode simplificar bastante as operações de delete em tabelas particionadas que, de outra forma, exigiriam condições `WHERE` muito complexas se feitas com instruções [`DELETE`](delete.html "13.2.2 DELETE Statement"). Por exemplo, esta instrução deleta todas as linhas das Partitions `p1` e `p3`:

  ```sql
  ALTER TABLE t1 TRUNCATE PARTITION p1, p3;
  ```

  Uma instrução [`DELETE`](delete.html "13.2.2 DELETE Statement") equivalente é mostrada aqui:

  ```sql
  DELETE FROM t1 WHERE
      (year_col >= 1991 AND year_col < 1995)
      OR
      (year_col >= 2003 AND year_col < 2007);
  ```

  Se você usar a palavra-chave `ALL` no lugar da lista de nomes de Partition, a instrução atua em todas as Partitions da tabela.

  `TRUNCATE PARTITION` apenas deleta linhas; não altera a definição da tabela em si, nem de nenhuma de suas Partitions.

  Para verificar se as linhas foram dropadas, verifique a tabela `INFORMATION_SCHEMA.PARTITIONS`, usando uma Query como esta:

  ```sql
  SELECT PARTITION_NAME, TABLE_ROWS
      FROM INFORMATION_SCHEMA.PARTITIONS
      WHERE TABLE_NAME = 't1';
  ```

  `TRUNCATE PARTITION` é suportado apenas para tabelas particionadas que usam os Storage Engines [`MyISAM`](myisam-storage-engine.html "15.2 The MyISAM Storage Engine"), [`InnoDB`](innodb-storage-engine.html "Chapter 14 The InnoDB Storage Engine"), ou [`MEMORY`](memory-storage-engine.html "15.3 The MEMORY Storage Engine"). Também funciona em tabelas [`BLACKHOLE`](blackhole-storage-engine.html "15.6 The BLACKHOLE Storage Engine") (mas não tem efeito). Não é suportado para tabelas [`ARCHIVE`](archive-storage-engine.html "15.5 The ARCHIVE Storage Engine").

  `COALESCE PARTITION` pode ser usado com uma tabela que é particionada por `HASH` ou `KEY` para reduzir o número de Partitions por *`number`*. Suponha que você tenha criado a tabela `t2` da seguinte forma:

  ```sql
  CREATE TABLE t2 (
      name VARCHAR (30),
      started DATE
  )
  PARTITION BY HASH( YEAR(started) )
  PARTITIONS 6;
  ```

  Para reduzir o número de Partitions usadas por `t2` de 6 para 4, use a seguinte instrução:

  ```sql
  ALTER TABLE t2 COALESCE PARTITION 2;
  ```

  Os dados contidos nas últimas *`number`* Partitions são mesclados nas Partitions restantes. Neste caso, as Partitions 4 e 5 são mescladas nas 4 primeiras Partitions (as Partitions numeradas 0, 1, 2 e 3).

  Para alterar algumas, mas não todas, as Partitions usadas por uma tabela particionada, você pode usar `REORGANIZE PARTITION`. Esta instrução pode ser usada de várias maneiras:

  + Para mesclar um conjunto de Partitions em uma única Partition. Isso é feito nomeando várias Partitions na lista *`partition_names`* e fornecendo uma única definição para *`partition_definition`*.

  + Para dividir uma Partition existente em várias Partitions. Isso é feito nomeando uma única Partition para *`partition_names`* e fornecendo múltiplas *`partition_definitions`*.

  + Para alterar os ranges para um subconjunto de Partitions definidas usando `VALUES LESS THAN` ou as listas de valores para um subconjunto de Partitions definidas usando `VALUES IN`.

  + Esta instrução também pode ser usada sem a opção `partition_names INTO (partition_definitions)` em tabelas que são automaticamente particionadas usando Partitioning por `HASH` para forçar a redistribuição de dados. (Atualmente, apenas tabelas [`NDB`](mysql-cluster.html "Chapter 21 MySQL NDB Cluster 7.5 and NDB Cluster 7.6") são automaticamente particionadas dessa forma.) Isso é útil no NDB Cluster onde, após adicionar novos data nodes do NDB Cluster online a um NDB Cluster existente, você deseja redistribuir os dados da tabela NDB Cluster existentes para os novos data nodes. Nesses casos, você deve invocar a instrução com a opção `ALGORITHM=INPLACE`; em outras palavras, conforme mostrado aqui:

    ```sql
    ALTER TABLE table ALGORITHM=INPLACE, REORGANIZE PARTITION;
    ```

    Você não pode executar outras instruções DDL concomitantemente com a reorganização de tabela online — ou seja, nenhuma outra instrução DDL pode ser emitida enquanto uma instrução `ALTER TABLE ... ALGORITHM=INPLACE, REORGANIZE PARTITION` estiver em execução. Para mais informações sobre como adicionar NDB Cluster data nodes online, veja [Section 21.6.7, “Adding NDB Cluster Data Nodes Online”](mysql-cluster-online-add-node.html "21.6.7 Adding NDB Cluster Data Nodes Online").

    Note

    `ALTER TABLE ... ALGORITHM=INPLACE, REORGANIZE PARTITION` não funciona com tabelas que foram criadas usando a opção `MAX_ROWS`, porque ele usa o valor constante `MAX_ROWS` especificado na instrução original [`CREATE TABLE`](create-table.html "13.1.18 CREATE TABLE Statement") para determinar o número de Partitions necessárias, de modo que nenhuma nova Partition é criada. Em vez disso, você pode usar `ALTER TABLE ... ALGORITHM=INPLACE, MAX_ROWS=rows` para aumentar o número máximo de linhas para essa tabela; neste caso, `ALTER TABLE ... ALGORITHM=INPLACE, REORGANIZE PARTITION` não é necessário (e causa um erro se executado). O valor de *`rows`* deve ser maior que o valor especificado para `MAX_ROWS` na instrução `CREATE TABLE` original para que isso funcione.

    O uso de `MAX_ROWS` para forçar o número de Partitions da tabela está em depreciação (deprecated) no NDB 7.5.4 e posterior; use `PARTITION_BALANCE` em seu lugar (veja [Setting NDB_TABLE options](create-table.html#create-table-comment-ndb-table-options "Setting NDB_TABLE options")).

    Tentar usar `REORGANIZE PARTITION` sem a opção `partition_names INTO (partition_definitions)` em tabelas explicitamente particionadas resulta no erro `REORGANIZE PARTITION without parameters can only be used on auto-partitioned tables using HASH partitioning`.

  Note

  Para Partitions que não foram explicitamente nomeadas, o MySQL fornece automaticamente os nomes padrão `p0`, `p1`, `p2` e assim por diante. O mesmo se aplica às subpartitions.

  Para informações mais detalhadas e exemplos de instruções `ALTER TABLE ... REORGANIZE PARTITION`, veja [Section 22.3.1, “Management of RANGE and LIST Partitions”](partitioning-management-range-list.html "22.3.1 Management of RANGE and LIST Partitions").

* Para trocar uma Partition ou subpartition da tabela com uma tabela, use a instrução [`ALTER TABLE ... EXCHANGE PARTITION`](alter-table.html "13.1.8 ALTER TABLE Statement") — ou seja, para mover quaisquer linhas existentes na Partition ou subpartition para a tabela não particionada, e quaisquer linhas existentes na tabela não particionada para a Partition ou subpartition da tabela.

  Para informações de uso e exemplos, veja [Section 22.3.3, “Exchanging Partitions and Subpartitions with Tables”](partitioning-management-exchange.html "22.3.3 Exchanging Partitions and Subpartitions with Tables").

* Várias opções fornecem funcionalidade de manutenção e repair de Partition análoga à implementada para tabelas não particionadas por instruções como [`CHECK TABLE`](check-table.html "13.7.2.2 CHECK TABLE Statement") e [`REPAIR TABLE`](repair-table.html "13.7.2.5 REPAIR TABLE Statement") (que também são suportadas para tabelas particionadas; para mais informações, veja [Section 13.7.2, “Table Maintenance Statements”](table-maintenance-statements.html "13.7.2 Table Maintenance Statements")). Estas incluem `ANALYZE PARTITION`, `CHECK PARTITION`, `OPTIMIZE PARTITION`, `REBUILD PARTITION` e `REPAIR PARTITION`. Cada uma dessas opções aceita uma cláusula *`partition_names`* consistindo em um ou mais nomes de Partitions, separados por vírgulas. As Partitions já devem existir na tabela a ser alterada. Você também pode usar a palavra-chave `ALL` no lugar de *`partition_names`*, caso em que a instrução atua em todas as Partitions da tabela. Para mais informações e exemplos, veja [Section 22.3.4, “Maintenance of Partitions”](partitioning-maintenance.html "22.3.4 Maintenance of Partitions").

  Alguns Storage Engines do MySQL, como [`InnoDB`](innodb-storage-engine.html "Chapter 14 The InnoDB Storage Engine"), não suportam optimization por Partition. Para uma tabela particionada usando tal Storage Engine, `ALTER TABLE ... OPTIMIZE PARTITION` faz com que a tabela inteira seja reconstruída e analisada, e um warning apropriado seja emitido. (Bug #11751825, Bug #42822)

  Para contornar este problema, use as instruções `ALTER TABLE ... REBUILD PARTITION` e `ALTER TABLE ... ANALYZE PARTITION` em seu lugar.

  As opções `ANALYZE PARTITION`, `CHECK PARTITION`, `OPTIMIZE PARTITION` e `REPAIR PARTITION` não são permitidas para tabelas que não são particionadas.

* No MySQL 5.7.9 e posterior, você pode usar `ALTER TABLE ... UPGRADE PARTITIONING` para atualizar uma tabela [`InnoDB`](innodb-storage-engine.html "Chapter 14 The InnoDB Storage Engine") particionada que foi criada com o antigo handler genérico de Partitioning para o Partitioning nativo do `InnoDB` empregado no MySQL 5.7.6 e posterior. Também a partir do MySQL 5.7.9, o utilitário [**mysql_upgrade**](mysql-upgrade.html "4.4.7 mysql_upgrade — Check and Upgrade MySQL Tables") verifica essas tabelas `InnoDB` particionadas e tenta atualizá-las para Partitioning nativo como parte de suas operações normais.

  Important

  Tabelas `InnoDB` particionadas que não usam o handler de Partitioning nativo do `InnoDB` não podem ser usadas no MySQL 8.0 ou posterior. `ALTER TABLE ... UPGRADE PARTITIONING` não é suportado no MySQL 8.0 ou posterior; portanto, quaisquer tabelas `InnoDB` particionadas que empreguem o handler genérico *devem* ser atualizadas para o handler nativo do InnoDB *antes* de atualizar sua instalação do MySQL para o MySQL 8.0 ou posterior.

* `REMOVE PARTITIONING` permite que você remova o Partitioning de uma tabela sem afetar a tabela ou seus dados. Esta opção pode ser combinada com outras opções [`ALTER TABLE`](alter-table.html "13.1.8 ALTER TABLE Statement"), como aquelas usadas para adicionar, dropar ou renomear colunas ou Indexes.

* Usar a opção `ENGINE` com [`ALTER TABLE`](alter-table.html "13.1.8 ALTER TABLE Statement") altera o Storage Engine usado pela tabela sem afetar o Partitioning.

Quando `ALTER TABLE ... EXCHANGE PARTITION` ou `ALTER TABLE ... TRUNCATE PARTITION` é executado em uma tabela particionada que usa [`MyISAM`](myisam-storage-engine.html "15.2 The MyISAM Storage Engine") (ou outro Storage Engine que utiliza locking em nível de tabela), apenas as Partitions que são realmente lidas são lockadas. (Isso não se aplica a tabelas particionadas que usam um Storage Engine que emprega locking em nível de linha, como [`InnoDB`](innodb-storage-engine.html "Chapter 14 The InnoDB Storage Engine").) Veja [Section 22.6.4, “Partitioning and Locking”](partitioning-limitations-locking.html "22.6.4 Partitioning and Locking").

É possível que uma instrução [`ALTER TABLE`](alter-table.html "13.1.8 ALTER TABLE Statement") contenha uma cláusula `PARTITION BY` ou `REMOVE PARTITIONING` além de outras especificações de alteração, mas a cláusula `PARTITION BY` ou `REMOVE PARTITIONING` deve ser especificada por último, após quaisquer outras especificações.

As opções `ADD PARTITION`, `DROP PARTITION`, `COALESCE PARTITION`, `REORGANIZE PARTITION`, `ANALYZE PARTITION`, `CHECK PARTITION` e `REPAIR PARTITION` não podem ser combinadas com outras especificações de alteração em um único `ALTER TABLE`, uma vez que as opções listadas acima atuam em Partitions individuais. Para mais informações, veja [Section 13.1.8.1, “ALTER TABLE Partition Operations”](alter-table-partition-operations.html "13.1.8.1 ALTER TABLE Partition Operations").

Apenas uma única instância de qualquer uma das seguintes opções pode ser usada em uma determinada instrução [`ALTER TABLE`](alter-table.html "13.1.8 ALTER TABLE Statement"): `PARTITION BY`, `ADD PARTITION`, `DROP PARTITION`, `TRUNCATE PARTITION`, `EXCHANGE PARTITION`, `REORGANIZE PARTITION`, ou `COALESCE PARTITION`, `ANALYZE PARTITION`, `CHECK PARTITION`, `OPTIMIZE PARTITION`, `REBUILD PARTITION`, `REMOVE PARTITIONING`.

Por exemplo, as duas instruções a seguir são inválidas:

```sql
ALTER TABLE t1 ANALYZE PARTITION p1, ANALYZE PARTITION p2;

ALTER TABLE t1 ANALYZE PARTITION p1, CHECK PARTITION p2;
```

No primeiro caso, você pode analisar as Partitions `p1` e `p2` da tabela `t1` concomitantemente usando uma única instrução com uma única opção `ANALYZE PARTITION` que lista ambas as Partitions a serem analisadas, assim:

```sql
ALTER TABLE t1 ANALYZE PARTITION p1, p2;
```

No segundo caso, não é possível executar operações `ANALYZE` e `CHECK` em Partitions diferentes da mesma tabela concomitantemente. Em vez disso, você deve emitir duas instruções separadas, assim:

```sql
ALTER TABLE t1 ANALYZE PARTITION p1;
ALTER TABLE t1 CHECK PARTITION p2;
```

Operações `REBUILD` atualmente não são suportadas para subpartitions. A palavra-chave `REBUILD` é expressamente proibida com subpartitions e faz com que `ALTER TABLE` falhe com um erro se usada dessa forma.

Operações `CHECK PARTITION` e `REPAIR PARTITION` falham quando a Partition a ser checked ou repaired contém quaisquer erros de duplicate key.

Para mais informações sobre essas instruções, veja [Section 22.3.4, “Maintenance of Partitions”](partitioning-maintenance.html "22.3.4 Maintenance of Partitions").